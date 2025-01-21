<?php
    include_once "./index.php";
    $db = new DataBase();
    $keys = getRequestArrayAttrs(['id', 'login', 'email', 'password', 'is_admin', 'img_id']);
    if (isset($keys['password'])) {
        $keys['password'] = sha1($keys['password']);
    }
    try {
        $row = $db->findUsers($keys, MatchType::All)[0];
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
        exit(-1);
    }
    echo json_encode($row);
?>