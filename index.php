<?php
    function cors() {
    
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
        
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        
            exit(0);
        }
        
    }
    function getRequestArrayAttrs(array $attrs, array $arr) {
        $keys = array();
        for ($i = 0; $i < count($attrs); $i++) {
            $keys[$attrs[$i]] = null;
        }
        foreach($keys as $key => &$value) {
            $value = $arr[$key] ?? null;
        }
        return $keys;
    }
    header('Content-Type: application/json');
    cors();
    enum MatchType {
        case All; 
        case Any;
    }
    function queryWhere(string $query, array $params, MatchType $match = MatchType::All) : string {
        $sql_operator_between = $match == MatchType::All ? "AND" : "OR";
        foreach ($params as $key => $value) {
            if ($value == null) {
                unset($params[$key]);
            }
        }
        if (empty($params)) {
            return $query;
        }
        $query .= " WHERE ";
        foreach ($params as $key => $value) {
            $str_value = ''.$value;
            if (gettype($value) == 'string') {
                $str_value = "'$str_value'";
            }
            $query .= "$key=$str_value ";
            if ($key != array_key_last($params)) {
                $query .= "$sql_operator_between ";
            }
        }
        return $query;
    }
    class UserAlreadyExist extends Exception {}
    class IncorrectRequest extends Exception {}
    class UserRegisterError extends Exception {}
    class InstrumentInstance {
        public string | null $id = null;
        public string | null $model_name = null;
        public string | null $category = null;
        public string | null $price = null;
        public string | null $in_stock = null;
        public string | null $img_id = null;
        function toArray() {
            return [
                'model_name' => $this->model_name,
                'category' => $this->category,
                'price' => $this->price,
                'in_stock' => $this->in_stock,
                'img_id' => $this->img_id
            ];
        }
    }
    class UserInstance {
        public int | null $id = null;
        public string | null $login = null;
        public string | null $email = null;
        public string | null $password = null;
        public int | null $is_admin = null;
        public int | null $img_id = null;        
        function toArray() {
            return [
                'id' => $this->id,
                'login' => $this->login,
                'email' => $this->email,
                'password' => $this->password,
                'is_admin' => $this->is_admin,
                'img_id' => $this->img_id
            ];
        }
    }
    class DataBase extends mysqli {
        public function __construct() {
            mysqli::__construct('localhost', 'root', '', 'u_music_app', 3306);
        }
        private function handleRequest(mixed $request) {
            if (!$request) {
                throw new IncorrectRequest("IncorrectRequest");
            }
        }
        private function requestToData(mixed $request) {
            $this->handleRequest($request);
            $row = $request->fetch_all(MYSQLI_ASSOC);
            if (empty($row)) {
                throw new IncorrectRequest("Not found");
            }
            return $row;
        }
        private function findData(string $table_name, array $data, MatchType $match) {
            return $this->requestToData($this->query(queryWhere(
                "SELECT * FROM $table_name", 
                $data, 
                $match
            )));
        }
        public function registerUser(string $login, string $email, string $password) {
            if (empty($login)) {
                throw new IncorrectRequest("Login cannot be empty");
            }
            if (empty($email)) {
                throw new IncorrectRequest("Email cannot be empty");
            }
            if (empty($password)) {
                throw new IncorrectRequest("Password cannot be empty");
            }
            $password = sha1($_POST['password']);
            try {
                $this->findUsers(['email' => $email, 'login' => $login], MatchType::All);
                throw new UserAlreadyExist("User with such login or email already exists");
            } catch (IncorrectRequest) {}
            $this->handleRequest($this->query(
                "INSERT INTO users (id, login, email, password, is_admin, img_id) 
                            VALUES(DEFAULT, '$login', '$email', '$password', DEFAULT, DEFAULT)"));
        }
        public function uploadImage(string $img_name, string $img_type, mixed $img_data) {
            if (empty($img_data))
                throw new IncorrectRequest("File cannot be empty");
            if (empty($img_type))
                throw new IncorrectRequest("File type cannot be empty");
            if (empty($img_name))
                throw new IncorrectRequest("File name cannot be empty");

            $img_data = addslashes(file_get_contents($img_data));
            $this->handleRequest($this->query(
                "INSERT INTO `images` (id, name, data, type) 
                    VALUES(DEFAULT, '$img_name', '$img_data', '$img_type')"
            ));
        }
        public function addInstrument(InstrumentInstance $instrument) {
            if (empty($instrument->model_name)) {
                throw new IncorrectRequest("Instrument model name cannot be empty");
            }
            if (empty($category)) {
                throw new IncorrectRequest("Instrument category cannot be empty");
            }
            try {
                $i = $this->findInstruments(
                    [
                        'model_name' => $instrument->model_name,
                        'category' => $instrument->category
                    ],
                    MatchType::All,
                )[0];
                $id = $i->id;
                $in_stock = +$i['in_stock'];
                $in_stock++;
                $this->handleRequest($this->query("UPDATE instruments SET in_stock=$in_stock WHERE id=$id"));
                return;
            } catch (IncorrectRequest) {}
            if (empty($price)) {
                throw new IncorrectRequest("Instrument price cannot be empty");
            }
            $model_name = $instrument->model_name;
            $category = $instrument->category;
            $price = $instrument->price;
            $in_stock = $instrument->in_stock ?? 1;
            $img_id = $instrument->img_id;
            $img_id = empty($img_id) ? 'DEFAULT' : "$img_id";
            $this->handleRequest($this->query(
                "INSERT INTO instruments (id, model_name, category, price, in_stock, img_id) 
                    VALUES(
                        DEFAULT,
                        '$model_name',
                        '$category',
                        $price,
                        $in_stock,
                        $img_id
                    )"
            ));
        }
        public function updateUser(UserInstance $user_data) {
            try {
                $this->findUsers(['login' => $user_data->login, 'email' => $user_data->email], MatchType::Any);
                throw new UserAlreadyExist("User with such login or email already exists");
            } catch (IncorrectRequest) {}
            $login = empty($user_data->login) ? "" : "login='$user_data->login',";
            $email = empty($user_data->email) ? "" : "email='$user_data->email',";
            $password = empty($password) ? "" : "password='".sha1($user_data->password)."',";
            $is_admin = $user_data->is_admin ? "is_admin=1," : "is_admin=0,";
            $img_id = "img_id=$user_data->img_id,";
            $this->handleRequest($this->query(queryWhere(
                "UPDATE users SET $login $email $password $is_admin $img_id", 
                    ['id' => $user_data->id])));
        }
        public function findUsers(array $user_data, MatchType $match) {
            return $this->findData('users', $user_data, $match);
        }
        public function findInstruments(array $instrument_data, MatchType $match) {
            return $this->findData('instruments', $instrument_data, $match);
        }
        public function findImages(array $image_data, MatchType $match) {
            return $this->findData('images', $image_data, $match);
        }
    };
?>