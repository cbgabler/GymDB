<?php
header('Content-Type: application/json');
include('config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$class_id = $_POST['classID'] ?? '';
$class_name = $_POST['className'] ?? '';
$description = $_POST['classDescription'] ?? '';
$duration = $_POST['classDuration'] ?? '';
$capacity = $_POST['classCapacity'] ?? '';
$class_category = $_POST['classCategory'] ?? '';
$class_date = $_POST['classDate'] ?? '';
$equipment_id = $_POST['classEquipment'] ?? '';
$employee_id = $_POST['classEmployee'] ?? '';

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
