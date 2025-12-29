<?php
// courses.php - Course Listing and Search Endpoint

header('Content-Type: application/json');
require 'db.php'; // Includes $pdo connection object. Exits with error if DB fails.

$searchTerm = $_GET['search'] ?? '';

// Build the base query
$sql = "SELECT 
            c.id, c.title, c.description, c.image_url, c.created_at,
            u.name AS mentor_name
        FROM courses c
        JOIN mentors m ON c.mentor_id = m.id
        JOIN users u ON m.user_id = u.id";

$params = [];
$whereClauses = [];

// Add search condition
if (!empty($searchTerm)) {
    $searchWildcard = '%' . $searchTerm . '%';
    $whereClauses[] = "(c.title LIKE ? OR c.description LIKE ?)";
    $params[] = $searchWildcard;
    $params[] = $searchWildcard;
}

if (!empty($whereClauses)) {
    $sql .= " WHERE " . implode(" AND ", $whereClauses);
}

$sql .= " ORDER BY c.created_at DESC";


try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Placeholder data generation for frontend consistency
    $formattedCourses = array_map(function($course) {
        $course['duration'] = rand(10, 100) . ' Hours';
        $course['lessons'] = rand(5, 30);
        $course['rating'] = number_format(rand(35, 50) / 10, 1);
        $course['image_url'] = $course['image_url'] ?? 'img/default-course.jpg';
        return $course;
    }, $courses);

    echo json_encode(['success' => true, 'data' => $formattedCourses]);

} catch (\PDOException $e) {
    // Catch SQL query errors (e.g., table missing)
    error_log("Course fetch SQL error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'SQL Query Error. Check table integrity.']);
}
?>