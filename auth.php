<?php
// auth.php - User Authentication

session_start();
header('Content-Type: application/json');
require 'db.php'; // Includes $pdo connection object

$action = $_GET['action'] ?? null;
$data = json_decode(file_get_contents("php://input"), true);

switch ($action) {
    case 'signup':
        if (!isset($data['name'], $data['email'], $data['password'])) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
            exit;
        }

        $name = trim($data['name']);
        $email = trim($data['email']);
        $password = $data['password'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
            exit;
        }

        // Use password_hash for secure storage
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        try {
            // Check if email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'Email already registered.']);
                exit;
            }

            // Insert new user using prepared statement
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $password_hash]);

            echo json_encode(['success' => true, 'message' => 'Registration successful.']);

        } catch (\PDOException $e) {
            error_log("Signup error: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Database error during registration.']);
        }
        break;

    case 'login':
        if (!isset($data['email'], $data['password'])) {
            echo json_encode(['success' => false, 'message' => 'Missing email or password.']);
            exit;
        }

        $email = trim($data['email']);
        $password = $data['password'];

        try {
            $stmt = $pdo->prepare("SELECT id, name, password_hash, role FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                // Login successful - set session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_role'] = $user['role'];

                echo json_encode(['success' => true, 'message' => 'Login successful.', 'user' => ['name' => $user['name'], 'role' => $user['role']]]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
            }
        } catch (\PDOException $e) {
            error_log("Login error: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Database error during login.']);
        }
        break;
        
    case 'logout':
        session_unset();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        break;
}
?>