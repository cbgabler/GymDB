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

$equipment_id = $inputData['id'] ?? '';
$name = $inputData['name'] ?? '';
$description = $inputData['description'] ?? '';
$quantity = $inputData['quantity'] ?? '';
$price = $inputData['price'] ?? '';
$purchase_date = $inputData['purchase_date'] ?? '';
$seller = $inputData['seller'] ?? '';
$notes = $inputData['notes'] ?? '';

// Validate that an equipment ID is provided
if (empty($equipment_id)) {
    echo json_encode(["success" => false, "message" => "Equipment ID is required."]);
    exit;
}

$fields = [];
$params = [];
$types = '';

// Add fields dynamically based on provided data
if (!empty($name)) { $fields[] = 'name = ?'; $params[] = $name; $types .= 's'; }
if (!empty($description)) { $fields[] = 'description = ?'; $params[] = $description; $types .= 's'; }
if (!empty($quantity)) { $fields[] = 'quantity = ?'; $params[] = $quantity; $types .= 'i'; }
if (!empty($price)) { $fields[] = 'price = ?'; $params[] = $price; $types .= 'd'; }
if (!empty($purchase_date)) { $fields[] = 'purchase_date = ?'; $params[] = $purchase_date; $types .= 's'; }
if (!empty($seller)) { $fields[] = 'seller = ?'; $params[] = $seller; $types .= 's'; }
if (!empty($notes)) { $fields[] = 'notes = ?'; $params[] = $notes; $types .= 's'; }

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields provided to update."]);
    exit;
}

// Add the equipment_id for the WHERE clause
$types .= 'i';
$params[] = $equipment_id;

$sql = "UPDATE equipment SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Equipment updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating equipment: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
