<?php
ini_set('display_errors', 0); // Disable direct error display for security
ini_set('log_errors', 1);
ini_set('error_log', '../logs/php_errors.log'); // Ensure the directory is writable
error_reporting(E_ALL);

include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die("Connection failed. Check error log.");
}

// Validate input
if (!isset($_POST['name'], $_POST['price'], $_POST['duration'], $_POST['guest_passes'], $_POST['signup_fee'], $_POST['class_id'])) {
    error_log("Missing required POST parameters.");
    die("Invalid input. Check error log.");
}

$name = $_POST['name'];
$price = $_POST['price'];
$duration = $_POST['duration'];
$guest_passes = $_POST['guest_passes'];
$signup_fee = $_POST['signup_fee'];
$class_id = $_POST['class_id'];

// Prepare SQL statement
$stmt = $conn->prepare("INSERT INTO memberships (name, price, duration, guest_passes, signup_fee, class_id) 
                        VALUES (?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    die("Error preparing statement. Check error log.");
}

$stmt->bind_param("sssdii", $name, $price, $duration, $guest_passes, $signup_fee, $class_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "New membership record created successfully"]);
} else {
    error_log("Execution failed: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
