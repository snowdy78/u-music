<?php
    include_once "./index.php";
    $db = new DataBase();
    $chunk_start = null;
    if (isset($_GET['chunk_start'])) {
        $chunk_start = intval($_GET['chunk_start']);
    }
    $chunk_end = null;
    if (isset($_GET['chunk_end'])) {
        $chunk_end = intval($_GET['chunk_end']);
    }
    try {
        $rows = $db->findUsers($_GET, MatchType::All, $chunk_start, $chunk_end);
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($rows);
?>