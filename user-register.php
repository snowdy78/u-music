<?php
    include_once "./index.php";
    $db = new DataBase();
    try {
        $db->registerUser($_POST['login'], $_POST['email'], $_POST['password']);
    } catch(Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode(array());

?>