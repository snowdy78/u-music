<?php
    include_once "./index.php";
    $db = new DataBase();
    try {
        $db->updateUser($_POST);
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode(array());
?>
