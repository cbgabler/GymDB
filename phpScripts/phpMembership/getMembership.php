<?php
include('../config.php');

header('Content-Type: application/json');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$sql = "SELECT id, name, price, duration, guest_passes, signup_fee, class_id FROM memberships";
$result = $conn->query($sql);

$classes = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $classes[] = $row;
    }
    echo json_encode($classes);
} else {
    echo json_encode([]);
}

$conn->close();
?>
