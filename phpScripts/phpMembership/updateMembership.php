<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$inputData = json_decode(file_get_contents('php://input'), true);

$membership_id = $inputData['id'] ?? '';
$name = $inputData['name'] ?? '';
$price = $inputData['price'] ?? '';
$duration = $inputData['duration'] ?? '';
$guest_passes = $inputData['guest_passes'] ?? '';
$signup_fee = $inputData['signup_fee'] ?? '';
$class_id = $inputData['class_id'] ?? 'None'; 

if (empty($membership_id)) {
    echo json_encode(["success" => false, "message" => "Membership ID is required for update."]);
    exit;
}

$fields = [];
$params = [];
$types = '';

if (!empty($name)) { 
    $fields[] = 'name = ?'; 
    $params[] = $name; 
    $types .= 's'; 
}
if (!empty($price)) { 
    $fields[] = 'price = ?'; 
    $params[] = $price; 
    $types .= 'd';
}
if (!empty($duration)) { 
    $fields[] = 'duration = ?'; 
    $params[] = $duration; 
    $types .= 'i'; 
}
if (!empty($guest_passes)) { 
    $fields[] = 'guest_passes = ?'; 
    $params[] = $guest_passes; 
    $types .= 'i';
}
if (!empty($signup_fee)) { 
    $fields[] = 'signup_fee = ?'; 
    $params[] = $signup_fee; 
    $types .= 'd';
}
if ($class_id !== 'None') { 
    $fields[] = 'class_id = ?'; 
    $params[] = $class_id; 
    $types .= 's';
}

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields provided for update."]);
    exit;
}

$types .= 'i';
$params[] = $membership_id;
$sql = "UPDATE memberships SET " . implode(', ', $fields) . " WHERE id = ?";
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