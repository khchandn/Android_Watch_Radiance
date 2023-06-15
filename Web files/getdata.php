<?php
        
$serverName = "43.252.167.19";
$databaseName = "Therapy";
$userName = "Radiance";
$password = "Radiance88#";
$con = mysqli_connect($serverName, $userName, $password, $databaseName);
if(!$con) echo "Error<br>";
else echo "Connected<br>";

$timestamp = $_POST['timestamp'];
$heartBeat = $_POST['heartBeat'];
$heartBeatint = (int)$heartBeat;
$timestampstring = (String)$timestamp;

$sql = "INSERT INTO HeartBeat (Timestamp, HeartBeat) VALUES ('$timestampstring', '$heartBeatint')";

if (mysqli_query($con, $sql)) {
  $response["success"] = 1;
  $response["message"] = "Received value: ". $heartBeat. ",". $timestamp;
} else {
  $response["success"] = 0;
  $response["message"] = "Failed to receive value";
}

mysqli_close($con);

echo json_encode($response);
?>