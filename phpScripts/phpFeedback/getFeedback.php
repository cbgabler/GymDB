<?php
include('../config.php');

header('Content-Type: application/json');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, member_id, feedback_content, feedback_date, rating FROM feedback";
$result = $conn->query($sql);

$feedback = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $feedback[] = $row;
    }
    echo json_encode($feedback);
} else {
    echo json_encode([]);
}

$conn->close();
?>