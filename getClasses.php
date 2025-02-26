<?php
// Include the config file for DB credentials
include('config.php');

header('Content-Type: application/json');

// Use the constants from the config file
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

// Check the connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// SQL query to get the classes
$sql = "SELECT class_name, duration, class_date, employee_id FROM classes";
$result = $conn->query($sql);

$classes = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $classes[] = $row;
    }
    // Return the results as JSON
    echo json_encode($classes);
} else {
    echo json_encode([]);
}

// Close the connection
$conn->close();
?>
