<?php
// subscribe.php - Newsletter Subscription Endpoint

header('Content-Type: application/json');
require 'db.php'; // Includes $pdo connection object

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM subscribers WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'You are already subscribed.']);
        exit;
    }

    // Insert new subscriber using prepared statement
    $stmt = $pdo->prepare("INSERT INTO subscribers (email) VALUES (?)");
    $stmt->execute([$email]);

    echo json_encode(['success' => true, 'message' => 'Subscription successful!']);

} catch (\PDOException $e) {
    error_log("Subscription error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again later.']);
}
?>