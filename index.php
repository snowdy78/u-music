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
    header('Content-Type: application/json');
    cors();
    enum MatchType {
        case All; 
        case Any;
    }
    function queryWhere(string $query, array $params, MatchType $match) : string {
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
        public string | null $model_name = null;
        public string | null $category = null;
        public string | null $price = null;
        public string | null $in_stock = null;
        public string | null $img_id = null;
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
            try {
                $this->findUsers(['email' => $email, 'login' => $login], MatchType::All);
                throw new UserAlreadyExist("User with such login or email already exists");
            } catch (IncorrectRequest) {}
            $this->handleRequest($this->query(
                "INSERT INTO users (id, login, email, password, is_admin, img_id) 
                            VALUES(DEFAULT, '$login', '$email', '$password', DEFAULT, DEFAULT)"));
        }
        public function uploadImage(string $img_name, mixed $img_data) {
            $this->handleRequest($this->query(
                "INSERT INTO `images` (id, name, data) 
                    VALUES(DEFAULT, '$img_name', '$img_data')"
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