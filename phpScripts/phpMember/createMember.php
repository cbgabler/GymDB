<?php
include('config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$date_joined = date('Y-m-d');

$stmt = $conn->prepare("INSERT INTO members (name, email, phone, date_joined) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $phone, $date_joined);


if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
