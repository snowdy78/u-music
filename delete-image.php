<?php
    include_once "./index.php";
    if (!isset($_GET['id'])) {
        echo json_encode(array("err_code" => "No id provided"));
        exit(-1);
    }
    $id = intval($_GET['id']);
    try {
        $db = new DataBase();
        $db->deleteImage($id);
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode(array());
?>