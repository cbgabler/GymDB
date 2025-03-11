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

$id = $inputData['id'] ?? '';  // Assuming `id` is provided to identify the record
$name = $inputData['name'] ?? '';
$email = $inputData['email'] ?? '';
$phone = $inputData['phone'] ?? '';
$date_joined = $inputData['date_joined'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "ID is required for update."]);
    exit;
}

$fields = [];
$params = [];
$types = '';

if (!empty($name)) { $fields[] = 'name = ?'; $params[] = $name; $types .= 's'; }
if (!empty($email)) { $fields[] = 'email = ?'; $params[] = $email; $types .= 's'; }
if (!empty($phone)) { $fields[] = 'phone = ?'; $params[] = $phone; $types .= 's'; }
if (!empty($date_joined)) { $fields[] = 'date_joined = ?'; $params[] = $date_joined; $types .= 's'; }

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields provided for update."]);
    exit;
}

// Append ID as the last parameter
$types .= 'i';
$params[] = $id;
$sql = "UPDATE members SET " . implode(', ', $fields) . " WHERE id = ?"; 

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Membership updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating membership: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
