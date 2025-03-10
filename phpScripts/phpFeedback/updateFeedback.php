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

$class_id = $inputData['id'] ?? '';
$class_name = $inputData['class_name'] ?? '';
$description = $inputData['description'] ?? '';
$duration = $inputData['duration'] ?? '';
$capacity = $inputData['capacity'] ?? '';
$class_category = $inputData['class_category'] ?? '';  // Fix typo: 'class_caetgory' -> 'class_category'
$class_date = $inputData['class_date'] ?? '';
$equipment_id = $inputData['equipment_id'] ?? '';
$employee_id = $inputData['employee_id'] ?? '';

if (empty($class_id)) {
    echo json_encode(["success" => false, "message" => "Class ID is required."]);
    exit;
}

$fields = [];
$params = [];
$types = '';

if (!empty($class_name)) { $fields[] = 'class_name = ?'; $params[] = $class_name; $types .= 's'; }
if (!empty($description)) { $fields[] = 'description = ?'; $params[] = $description; $types .= 's'; }
if (!empty($duration)) { $fields[] = 'duration = ?'; $params[] = $duration; $types .= 'i'; }
if (!empty($capacity)) { $fields[] = 'capacity = ?'; $params[] = $capacity; $types .= 'i'; }
if (!empty($class_category)) { $fields[] = 'class_category = ?'; $params[] = $class_category; $types .= 's'; }
if (!empty($class_date)) { $fields[] = 'class_date = ?'; $params[] = $class_date; $types .= 's'; }
if (!empty($equipment_id)) { $fields[] = 'equipment_id = ?'; $params[] = $equipment_id; $types .= 'i'; }
if (!empty($employee_id)) { $fields[] = 'employee_id = ?'; $params[] = $employee_id; $types .= 'i'; }

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields provided to update."]);
    exit;
}

$types .= 'i';
$params[] = $class_id;
$sql = "UPDATE classes SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Class updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating class: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
