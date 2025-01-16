<?php
    $db = new mysqli('localhost', 'root', '', 'u_music_app', 3306);
    $request = $db->query("SELECT * FROM instruments");
    if ($request && $request->num_rows > 0) {
        while ($row = $request->fetch_assoc()) {
            echo $row['model_name'];
        }
    }
?>