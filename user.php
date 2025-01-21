<?php
    include_once "./index.php";
    $db = new DataBase();
    $keys = array(
        'id' => null,
        'login' => null,
        'email' => null,
        'password' => null,
        'is_admin' => null
    );
    foreach($keys as $key => &$value) {
        $value = $_GET[$key] ?? null;
    }
    if (isset($keys['password'])) {
        $keys['password'] = sha1($keys['password']);
    }
    try {
        $row = $db->findUsers($keys, MatchType::All)[0];
    } catch (IncorrectRequest $err) {
        echo json_encode(array("err_code" => $err->getMessage()));
    }
    echo json_encode($row);
?>