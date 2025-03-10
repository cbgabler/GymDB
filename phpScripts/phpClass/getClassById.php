<?php
include('../config.php');

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['id'])) {
    $classID = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM classes WHERE id = ?");
    $stmt->bind_param("i", $classID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode([]);
    }

    $stmt->close();
    $conn->close();
}
?>
