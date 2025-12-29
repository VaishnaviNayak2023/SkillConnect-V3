<?php
// db.php - PDO Database Connection

$host = 'localhost';
$db   = 'elearning_skillconnect';
$user = 'root'; // <--- VERIFY THIS
$pass = '';     // <--- VERIFY THIS (often 'root' or empty string)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // If connection fails, log it and return a JSON error to the frontend
     error_log("Database connection failed: " . $e->getMessage());
     http_response_code(500); // Internal Server Error
     echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
     exit;
}
?>