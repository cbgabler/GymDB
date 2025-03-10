<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$member_id = $_POST["member_id"];
$feedback_content = $_POST["feedback_content"];
$feedback_date = date("Y-m-d");
$rating = $_POST["rating"];

$stmt = $conn->prepare("INSERT INTO feedback (member_id, feedback_content, feedback_date, rating) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $member_id, $feedback_content, $feedback_date, $rating);

if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>