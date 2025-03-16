<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieving form data
$name = $_POST['name'];
$price = $_POST['price'];
$duration = $_POST['duration'];
$guest_passes = $_POST['guest_passes'];
$signup_fee = $_POST['signup_fee'];
$renewable = $_POST['renewable'];
$class_id = $_POST['class_id'];

// Prepare and bind SQL query
$stmt = $conn->prepare("INSERT INTO memberships (name, price, duration, guest_passes, signup_fee, renewable, class_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssdiii", $name, $price, $duration, $guest_passes, $signup_fee, $renewable, $class_id);

// Execute the query and check for success
if ($stmt->execute()) {
    echo "New membership record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
