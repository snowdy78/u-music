<?php
    include "./index.php";
    $db = new DataBase();
    try {
        $count = $db->countInstruments();
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode(array("count" => intval($count)));
?>