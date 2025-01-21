<?php
    include_once "./index.php";
    $db = new DataBase();
    $login = $_POST['login'] ?? "";
    if ($login == "") {
        echo json_encode(array("err_code" => "Login cannot be empty"));
        exit(-1);
    }
    $email = $_POST['email'] ?? "";
    if ($email == "") {
        echo json_encode(array("err_code" => "Email cannot be empty"));
        exit(-1);
    }
    $password = $_POST['password'] ?? "";
    if ($password == "") {
        echo json_encode(array("err_code" => "Password cannot be empty"));
        exit(-1);
    }
    $password = sha1($_POST['password']);
    try {
        $db->registerUser($login, $email, $password);
    } catch(Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
    }
    echo json_encode(array());

?>