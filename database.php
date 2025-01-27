<?php
    include_once "index.php";
    class UserAlreadyExist extends Exception {}
    class IncorrectRequest extends Exception {}
    class UserRegisterError extends Exception {}

    class DataBase extends mysqli {
        private function flowAttributes(array $keys, array $values) {
            $arr = array();
            foreach ($keys as $key => $value) {
                if (isset($values[$value])) {
                    $arr[$value] = $values[$value];
                }
            }
            return $arr;
        }
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
        private function findData(string $table_name, array $data, MatchType $match, int | null $chunk_start = null, int | null $chunk_end = null) {
            $query = queryWhere(
                "SELECT * FROM $table_name", 
                $data, 
                $match
            );
            if ($chunk_start !== null && $chunk_end !== null) {
                $query .= " LIMIT $chunk_start, $chunk_end";
            }
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
            foreach (['model_name', 'category', 'price', 'img_id', 'in_stock'] as $key) {
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
                $in_stock1 = $i['in_stock'];
                $in_stock2 = $instrument['in_stock'];
                $this->handleRequest($this->query("UPDATE instruments SET in_stock=$in_stock1+$in_stock2 WHERE id=$id"));
                return;
            } catch (IncorrectRequest) {}
            $query = "INSERT INTO instruments (id, ".implode(', ', array_keys($instrument)).") 
                VALUES(DEFAULT, ".implodeToSqlData(', ', $instrument).")";
            $this->handleRequest($this->query($query));
            $request = $this->query(
                "SELECT LAST_INSERT_ID();"
            );
            $this->handleRequest($request);
            return +$request->fetch_assoc()['LAST_INSERT_ID()'];
        }
        public function updateInstrument(array $instrument_data) {
            if (!isset($instrument_data['id'])) {
                throw new IncorrectRequest("id cannot be empty");
            }
            $instrument_data['id'] = intval($instrument_data['id']);
            try {
                $this->findInstruments(['id' => $instrument_data['id']], MatchType::All);
            } catch (IncorrectRequest) {
                throw new IncorrectRequest("Instrument not found");
            }
            $set_data = new ArrayObject($instrument_data);
            $set_data = $set_data->getArrayCopy();
            if (isset($set_data['img_id']) && $set_data['img_id'] === null) {
                throw new IncorrectRequest("img_id cannot be null");
            }
            unset($set_data['id']);
            $this->handleRequest($this->query(
                "UPDATE instruments SET "
                .arrayToEnumString($set_data, ',')
                ." WHERE id=".$instrument_data['id']
            ));
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
        public function findUsers(array $users, MatchType $match, int | null $chunk_start = null, int | null $chunk_end = null) {
            $keys = ['id', 'login', 'email', 'password', 'is_admin', 'img_id'];
            $array = $this->flowAttributes($keys, $users);
            if (isset($array['password'])) {
                $array['password'] = sha1($array['password']);
            }
            return $this->findData('users', $array, $match, $chunk_start, $chunk_end);
        }
        public function findInstruments(array $instrument_data, MatchType $match, int | null $chunk_start = null, int | null $chunk_end = null) {
            $keys = ['id', 'model_name', 'category', 'price', 'img_id', 'in_stock'];
            return $this->findData('instruments', $this->flowAttributes($keys, $instrument_data), $match, $chunk_start, $chunk_end);
        }
        public function findImages(array $image_data, MatchType $match, int | null $chunk_start = null, int | null $chunk_end = null) {
            $keys = ['id', 'name', 'data', 'type'];
            return $this->findData('images', $this->flowAttributes($keys, $image_data), $match, $chunk_start, $chunk_end);
        }
        public function deleteUser(int $id) {
            $this->handleRequest($this->query("DELETE FROM `users` WHERE id=$id"));
        }
        public function deleteInstrument(int $id) {
            $this->handleRequest($this->query("DELETE FROM `instruments` WHERE id=$id"));
        }
        public function deleteImage(int $id) {
            $this->handleRequest($this->query("DELETE FROM `images` WHERE id=$id"));
        }
    };
?>