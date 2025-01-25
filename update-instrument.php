<?php
    include_once "./database.php";

    try {
        $db = new DataBase();
        $db->updateInstrument($_POST);
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode(array());
?>