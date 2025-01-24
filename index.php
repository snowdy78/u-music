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
    function implodeToSqlData(string $sep, $arr) {
        $result = '';
        foreach ($arr as $key => $value) {
            if (!isset($value)) {
                unset($arr[$key]);
            }
        }
        foreach ($arr as $key => $value) {
            $str_value = ''.$value;
            if (gettype($value) === 'string') {
                $str_value = "'$str_value'";
            }
            $result .= "$str_value";
            if ($key != array_key_last($arr)) {
                $result .= "$sep ";
            }
        }
        return $result;
    }
    function arrayToEnumString(array $arr, string $sep) {
        $result = '';
        foreach ($arr as $key => $value) {
            if (!isset($value)) {
                unset($arr[$key]);
            }
        }
        foreach ($arr as $key => $value) {
            $str_value = ''.$value;
            if (gettype($value) === 'string') {
                $str_value = "'$str_value'";
            }
            $result .= "$key=$str_value ";
            if ($key != array_key_last($arr)) {
                $result .= "$sep ";
            }
        }
        return $result;
    }
    header('Content-Type: application/json');
    cors();
    enum MatchType {
        case All; 
        case Any;
    }
    function queryWhere(string $query, array $params, MatchType $match = MatchType::All) : string {
        $sql_operator_between = $match == MatchType::All ? "AND" : "OR";
        if (empty($params)) {
            return $query;
        }
        $query .= " WHERE ";
        $query .= arrayToEnumString($params, $sql_operator_between);
        return $query;
    }
    class UserAlreadyExist extends Exception {}
    class IncorrectRequest extends Exception {}
    class UserRegisterError extends Exception {}

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
            $query = queryWhere(
                "SELECT * FROM $table_name", 
                $data, 
                $match
            );
            return $this->requestToData($this->query($query));
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
                    VALUES(DEFAULT, '$img_name', '$img_data', '$img_type');"
            ));
            $request = $this->query(
                "SELECT LAST_INSERT_ID();"
            );
            $this->handleRequest($request);
            return +$request->fetch_assoc()['LAST_INSERT_ID()'];
        }
        public function addInstrument(array $instrument) {
            foreach (['model_name', 'category'] as $key) {
                if (empty($instrument[$key])) {
                    throw new IncorrectRequest("Instrument $key cannot be empty");
                }
            }
            try {
                $i = $this->findInstruments(
                    [
                        'model_name' => $instrument['model_name'],
                        'category' => $instrument['category']
                    ],
                    MatchType::All,
                )[0];
                $id = $i['id'];
                $in_stock = $i['in_stock'];
                $this->handleRequest($this->query("UPDATE instruments SET in_stock=$in_stock+1 WHERE id=$id"));
                return;
            } catch (IncorrectRequest) {}
            foreach (['price', 'img_id', 'in_stock'] as $key) {
                if (empty($instrument[$key])) {
                    throw new IncorrectRequest("Instrument $key cannot be empty");
                }
            }
            $query = "INSERT INTO instruments (id, ".implode(', ', array_keys($instrument)).") 
                VALUES(DEFAULT, ".implodeToSqlData(', ', $instrument).")";
            $this->handleRequest($this->query($query));
        }
        public function updateUser(array $user_data) {
            if (!isset($user_data['id'])) {
                throw new IncorrectRequest("User id cannot be empty");
            }
            $user_data['id'] = +$user_data['id'];
            try {
                $this->findUsers(['id' => $user_data['id']], MatchType::All);
            } catch (IncorrectRequest) {
                throw new IncorrectRequest("User not found");
            }
            if (isset($user_data['login']) || isset($user_data['email'])) {
                try {
                    $find_array = [];
                    if (isset($user_data['login'])) {
                        $find_array['login'] = $user_data['login'];
                    }
                    if (isset($user_data['email'])) {
                        $find_array['email'] = $user_data['email'];
                    }
                    $users = $this->findUsers($find_array, MatchType::Any);
                    foreach ($users as $user) {
                        if ($user['id'] != $user_data['id']) {
                            throw new UserAlreadyExist("User with such login or email already exists");
                        }
                    }
                } catch (IncorrectRequest) {}
            }
            $id = $user_data['id'];
            if (!empty($user_data['password'])) {
                $user_data['password'] = sha1($user_data['password']);              
            }
            $query = "UPDATE `users` SET ".arrayToEnumString($user_data, ",")." WHERE id=$id";
            $this->handleRequest($this->query($query));
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