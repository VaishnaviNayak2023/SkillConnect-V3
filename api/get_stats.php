<?php
// api/get_stats.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Essential for local testing

// Include the database configuration file (db_config.php)
require_once('../db_config.php');

$response = [
    'success' => false,
    'metrics' => [], // Will hold all dynamic data
    'error' => ''
];

// SQL statement to select all relevant metric names and values
$sql = "SELECT metric_name, value FROM site_stats 
        WHERE metric_name IN ('assisted_students', 'total_success_rate', 'mentors_count', 'chief_experts_count')";

if ($result = $conn->query($sql)) {
    if ($result->num_rows > 0) {
        // Fetch all rows into an associative array
        while ($row = $result->fetch_assoc()) {
            // Map metric_name to value for easy JavaScript access
            $response['metrics'][$row['metric_name']] = $row['value'];
        }
        $response['success'] = true;
    } else {
        $response['error'] = 'Metrics not found in database.';
    }
    $result->close();
} else {
    $response['error'] = 'Query failed: ' . $conn->error;
}

$conn->close();

echo json_encode($response);
?>