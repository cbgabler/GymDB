<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, name, description, quantity, price, purchase_date, seller, notes FROM equipment";
$result = $conn->query($sql);

$equipment = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $equipment[] = $row;
    }
    echo json_encode($equipment);
} else {
    echo json_encode([]);
}

$conn->close();
?>