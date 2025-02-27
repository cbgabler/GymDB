<?php
include('../config.php');

// Create a connection to MySQL
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$date_joined = date('Y-m-d'); // Assuming today's date

// Prevent SQL Injection using prepared statements
$stmt = $conn->prepare("INSERT INTO members (name, email, phone, date_joined) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $phone, $date_joined);


// Execute the prepared statement
if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

// Close the prepared statement and connection
$stmt->close();
$conn->close();
?>
