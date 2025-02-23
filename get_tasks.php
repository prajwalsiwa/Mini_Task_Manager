<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

include 'db.php';

$sql = "SELECT * FROM tasks";
$result = $conn->query($sql);

$tasks = array();
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);
?>
