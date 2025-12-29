<?php
// db_config.php

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root'); // Your MySQL Username
define('DB_PASSWORD', 'your_password'); // Your MySQL Password
define('DB_NAME', 'totc_db'); // Your Database Name

$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn === false) {
    die("ERROR: Could not connect to the database. " . $conn->connect_error);
}
?>