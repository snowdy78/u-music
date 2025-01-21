<?php
    include_once "./index.php";
    $db = new DataBase();
    if ($_SERVER['REQUEST_METHOD'] != "POST") {
        echo json_encode(array("err_code" => "Not a post request"));
        exit(-1);
    }
    if (!isset($_FILES['image'])) { 
        echo json_encode(array("err_code" => "No file uploaded"));
        exit(-1);
    }
    if ($_FILES['image']['error'] != 0) {
        echo json_encode(array("err_code" => "File upload error"));
        exit(-1);
    }

    try {
        $db->uploadImage(
            $_FILES['image']['name'],
            $_FILES['image']['type'],
            $_FILES['image']['tmp_name']
        );
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode(array());
?>