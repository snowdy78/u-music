<?php
    include_once "./index.php";
    $db = new mysqli('localhost', 'root', '', 'u_music_app', 3306);
    $login = $_POST['login'];
    $email = $_POST['email'];
    $password = sha1($_POST['password']);
    $request = $db->query(
        "INSERT INTO users (id, login, email, password, is_admin) 
                     VALUES(DEFAULT, '$login', '$email', '$password', DEFAULT)");
    echo json_encode(array("code" => !$request));
?>