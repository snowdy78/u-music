<?php
    include_once "./index.php";
    $db = new DataBase();
    try {
        $rows = $db->findInstruments($_GET, MatchType::All);
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($rows);
?>