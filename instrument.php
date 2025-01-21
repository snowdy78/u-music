<?php
    include_once "./index.php";
    $db = new DataBase();
    $keys = array(
        'id' => null,
        'model_name' => null,
        'category' => null,
        'price' => null,
        'in_stock' => null,
        'img_id' => null,
    );
    foreach($keys as $key => &$value) {
        $value = $_GET[$key] ?? null;
    }
    try {
        $row = $db->findInstruments($keys, MatchType::All)[0];
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
    }
    echo json_encode($row);
?>