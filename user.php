<?php
    include_once "./index.php";
    $db = new mysqli('localhost', 'root', '', 'u_music_app', 3306);
    $id = $_GET['id'];
    $request = $db->query(
        "SELECT * FROM users WHERE id=$id");
    if (!$request) {
        echo "<b>User not found</b>";
        exit(-1);
    } 
    $row = json_encode(array($request->fetch_array(MYSQLI_ASSOC)));
    echo $row;
?>