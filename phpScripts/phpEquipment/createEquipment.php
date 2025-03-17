<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$description = $_POST['description'];
$quantity = $_POST['quantity'];
$price = $_POST['price'];
$purchase_date = $_POST['purchase_date'];
$seller = $_POST['seller'];
$notes = $_POST['notes'];

$stmt = $conn->prepare("INSERT INTO equipment (name, description, quantity, price, purchase_date, seller, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssissss", $name, $description, $quantity, $price, $purchase_date, $seller, $notes);

if ($stmt->execute()) {
    echo "New equipment record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
