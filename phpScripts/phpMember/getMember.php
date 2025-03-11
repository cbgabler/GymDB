<?php
include('../config.php');

header('Content-Type: application/json');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$sql = "SELECT id, name, email, phone, date_joined FROM members";
$result = $conn->query($sql);

$member = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $member[] = $row;
    }
    echo json_encode($member);
} else {
    echo json_encode([]);
}

$conn->close();
?>
