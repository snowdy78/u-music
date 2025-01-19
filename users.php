<?php
    include_once "./index.php";
    $db = new mysqli('localhost', 'root', '', 'u_music_app', 3306);
    $request = $db->query("SELECT * FROM users");
    if ($request && $request->num_rows > 0) {
        $row = json_encode(array($request->fetch_array(MYSQLI_ASSOC)));
        echo $row;
    }
?>