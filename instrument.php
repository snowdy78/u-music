<?php
    include_once "./index.php";
    $db = new DataBase();
    try {
        $row = $db->findInstruments($_GET, MatchType::All)[0];
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($row);
?>