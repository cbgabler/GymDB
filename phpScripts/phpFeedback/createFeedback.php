<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$member_id = $_POST["member_id"];
$feedback_content = $_POST["feedback_content"];
$feedback_date = date("Y-m-d");
$rating = $_POST["rating"];

$stmt = $conn->prepare("INSERT INTO feedback (member_id, feedback_content, feedback_date, rating) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $member_id, $feedback_content, $feedback_date, $rating);

$response = [];

if ($stmt->execute()) {
    $response["success"] = true;
    $response["message"] = "New record created successfully";
} else {
    $response["success"] = false;
    $response["error"] = "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
