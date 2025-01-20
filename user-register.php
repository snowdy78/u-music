<?php
    include_once "./index.php";
    $db = new mysqli('localhost', 'root', '', 'u_music_app', 3306);
    $login = $_POST['login'];
    if ($login == "") {
        echo json_encode(array("err_code" => "Login cannot be empty"));
        exit(-1);
    }
    $email = $_POST['email'];
    if ($email == "") {
        echo json_encode(array("err_code" => "Email cannot be empty"));
        exit(-1);
    }
    $password = sha1($_POST['password']);
    if ($password == "") {
        echo json_encode(array("err_code" => "Password cannot be empty"));
        exit(-1);
    }
    $find_request = $db->query("SELECT * FROM users WHERE email='$email' OR login='$login'");
    if ($find_request && $find_request->num_rows != 0) {
        echo json_encode(array("err_code" => "User with such login or email already exists"));
        exit(-1);
    }
    $request = $db->query(
        "INSERT INTO users (id, login, email, password, is_admin) 
                     VALUES(DEFAULT, '$login', '$email', '$password', DEFAULT)");
    if ($request) {
        echo json_encode(array());
        exit(0);
    }
    echo json_encode(array("err_code" => "Cannot register user"));
?>