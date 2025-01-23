<?php
    include "./index.php";
    $db = new DataBase();
    try {
        $img = $db->findImages($_GET, MatchType::All)[0];
        $img_type = $img['type'];
        $img['data'] = "data:$img_type;base64,".base64_encode($img['data']);
    } catch (Exception $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($img);
?>