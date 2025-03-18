<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$price = $_POST['price'];
$duration = $_POST['duration'];
$guest_passes = $_POST['guest_passes'];
$signup_fee = $_POST['signup_fee'];
$class_id = $_POST['class_id'];

$stmt = $conn->prepare("INSERT INTO memberships (name, price, duration, guest_passes, signup_fee, class_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssdiii", $name, $price, $duration, $guest_passes, $signup_fee, $class_id);

if ($stmt->execute()) {
    echo "New membership record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
