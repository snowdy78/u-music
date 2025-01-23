<?php
    include_once "./index.php";
    $db = new DataBase();
    if (!empty($_GET['password'])) {
        $_GET['password'] = sha1($_GET['password']);
    }
    try {
        $rows = $db->findUsers($_GET, MatchType::All);
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($rows);
?>