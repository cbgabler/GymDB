<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT class_name, description, duration, capacity, class_category, class_date, equipment_id, employee_id FROM classes";
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