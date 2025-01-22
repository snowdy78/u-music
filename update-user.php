<?php

    include_once "./index.php";
    $db = new DataBase();
    if (!isset($_POST['id'])) {
        echo json_encode(array("err_code" => "id cannot be empty"));
        exit(-1);
    }
    $keys = getRequestArrayAttrs(['id', 'login', 'email', 'password', 'is_admin', 'img_id'], $_POST);    
    $user = new UserInstance();
    $user->id = intval($keys['id']);
    $user->login = $keys['login'];
    $user->email = $keys['email'];
    $user->password = $keys['password'];
    $user->is_admin = intval($keys['is_admin']);
    $user->img_id = $keys['img_id'] !== "null" ? intval($keys['img_id']) : null;
    try {
        $db->updateUser($user);
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
?>