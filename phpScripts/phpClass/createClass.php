<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$class_name = $_POST['className'] ?? '';
$description = $_POST['classDescription'] ?? '';
$duration = $_POST['classDuration'] ?? '';
$capacity = $_POST['classCapacity'] ?? '';
$class_category = $_POST['classCategory'] ?? '';
$class_date = $_POST['classDate'] ?? '';
$equipment_id = $_POST['equipment_id'] ?? '';
$employee_id = $_POST['employee_id'] ?? '';

$stmt = $conn->prepare("INSERT INTO classes 
    (class_name, description, duration, capacity, class_category, class_date, equipment_id, employee_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssisssii",
    $class_name, 
    $description, 
    $duration, 
    $capacity, 
    $class_category, 
    $class_date, 
    $equipment_id, 
    $employee_id
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
