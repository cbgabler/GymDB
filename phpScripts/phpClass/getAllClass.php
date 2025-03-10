<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM classes");
$classes = [];

while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

echo json_encode($classes);
$conn->close();
?>
