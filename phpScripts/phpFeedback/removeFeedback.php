<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure the POST request is made
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Invalid request method. Only POST is allowed.");
}

$id = $_POST["id"] ?? null;

if (!$id) {
    die("Error: No feedback ID provided.");
}

// Prepare the SQL statement to prevent SQL injection
$stmt = $conn->prepare("DELETE FROM feedback WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo "Feedback deleted successfully.";
    } else {
        echo "No feedback found with that ID.";
    }
} else {
    echo "Failed: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
