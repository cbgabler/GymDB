<?php
$servername = "classmysql.engr.oregonstate.edu";
$username = "cs340_gablerc";
$password = "1498";
$dbname = "cs340_gablerc";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($_POST['id'])) {
    $id = intval($_POST['id']);

    $stmt = $conn->prepare("DELETE FROM members WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Member deleted successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid ID provided.";
}

$conn->close();
?>