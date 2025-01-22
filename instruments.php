<?php
    include_once "./index.php";
    $db = new DataBase();
    $keys = getRequestArrayAttrs(['id', 'model_name', 'category', 'price', 'in_stock', 'img_id'], $_GET);
    try {
        $rows = $db->findInstruments($keys, MatchType::All);
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($rows);
?>