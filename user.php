<?php
    include_once "./index.php";
    $db = new mysqli('localhost', 'root', '', 'u_music_app', 3306);
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $login = isset($_GET['login']) ? $_GET['login'] : null;
    $email = isset($_GET['email']) ? $_GET['email'] : null;
    $password = isset($_GET['password']) ? sha1($_GET['password']) : null;
    $is_admin = isset($_GET['is_admin']) ? $_GET['is_admin'] : null;
    $keys = array(
        'id' => $id,
        'login' => $login,
        'email' => $email,
        'password' => $password,
        'is_admin' => $is_admin
    );
    $query = queryWhere("SELECT * FROM users", $keys);
    $request = $db->query($query);
    if (!$request) {
        echo json_encode(array("err_code" => "User not found"));
        exit(-1);
    } 
    $row = $request->fetch_assoc();
    if (empty($row)) {
        echo json_encode(array("err_code" => "User not found"));
        exit(-1);
    }
    echo json_encode($row);
?>