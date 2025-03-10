<?php
header('Content-Type: application/json');
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Reading JSON data from POST
$inputData = json_decode(file_get_contents('php://input'), true);

$feedback_id = $inputData['id'] ?? '';  // Assuming `id` is provided to identify the record
$member_id = $inputData['member_id'] ?? '';
$feedback_content = $inputData['feedback_content'] ?? '';
$date = date('Y-m-d');  // Auto-update the date
$rating = $inputData['rating'] ?? '';

if (empty($feedback_id)) {
    echo json_encode(["success" => false, "message" => "Feedback ID is required for update."]);
    exit;
}

// Prepare update fields
$fields = [];
$params = [];
$types = '';

if (!empty($member_id)) { $fields[] = 'member_id = ?'; $params[] = $member_id; $types .= 'i'; }
if (!empty($feedback_content)) { $fields[] = 'feedback_content = ?'; $params[] = $feedback_content; $types .= 's'; }
if (!empty($rating)) { $fields[] = 'rating = ?'; $params[] = $rating; $types .= 'i'; }

// Always update the date
$fields[] = 'feedback_date = ?';
$params[] = $date;
$types .= 's';

// Ensure there are fields to update
if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields provided for update."]);
    exit;
}

$types .= 'i';
$params[] = $feedback_id;
$sql = "UPDATE feedback SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Feedback updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating feedback: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
