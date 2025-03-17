<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$position = $_POST['position'];

$stmt = $conn->prepare("INSERT INTO employees (name, email, phone, position) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $phone, $position);

if ($stmt->execute()) {
    echo "New employee record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
