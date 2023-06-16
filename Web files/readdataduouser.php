<?php

$serverName = "43.252.167.19";
$databaseName = "Therapy";
$userName = "Radiance";
$password = "Radiance88#";
$con = mysqli_connect($serverName, $userName, $password, $databaseName);
// if(!$con) echo "Error<br>";
// else echo "Connected<br>";

$sql = "SELECT * FROM HeartBeat";
$result = mysqli_query($con, $sql);

$data = array();

while($row = mysqli_fetch_assoc($result)){
    $UUID = (String)$row['UUID'];
    $timestamp = (int) $row['Timestamp'];
    $heartbeat = (int) $row['HeartBeat'];
    $data[] = array('userID' => $UUID, 'x' => $timestamp*1000,'y' => $heartbeat);
}

header('Content-Type: application/json');
echo json_encode($data);

mysqli_close($con);

?>