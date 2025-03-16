<?php
header('Content-Type: application/json');
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$inputData = json_decode(file_get_contents('php://input'), true);

$employee_id = $inputData['id'] ?? '';
$employee_name = $inputData['employee_name'] ?? '';
$position = $inputData['position'] ?? '';
$salary = $inputData['salary'] ?? '';
$hire_date = $inputData['hire_date'] ?? '';
$department = $inputData['department'] ?? '';
$contact_number = $inputData['contact_number'] ?? '';

if (empty($employee_id)) {
    echo json_encode(["success" => false, "message" => "Employee ID is required."]);
    exit;
}

$fields = [];
$params = [];
$types = '';

if (!empty($employee_name)) { $fields[] = 'employee_name = ?'; $params[] = $employee_name; $types .= 's'; }
if (!empty($position)) { $fields[] = 'position = ?'; $params[] = $position; $types .= 's'; }
if (!empty($salary)) { $fields[] = 'salary = ?'; $params[] = $salary; $types .= 'd'; }  // Assuming salary is a decimal or float
if (!empty($hire_date)) { $fields[] = 'hire_date = ?'; $params[] = $hire_date; $types .= 's'; }
if (!empty($department)) { $fields[] = 'department = ?'; $params[] = $department; $types .= 's'; }
if (!empty($contact_number)) { $fields[] = 'contact_number = ?'; $params[] = $contact_number; $types .= 's'; }

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields provided to update."]);
    exit;
}

$types .= 'i';
$params[] = $employee_id;
$sql = "UPDATE employees SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Employee updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating employee: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
