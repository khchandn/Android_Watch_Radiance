<?php
        
$serverName = "43.252.167.19";
$databaseName = "Therapy";
$userName = "Radiance";
$password = "Radiance88#";
$con = mysqli_connect($serverName, $userName, $password, $databaseName);
if(!$con) echo "Error<br>";
else echo "Connected<br>";



$state = $_POST['state'];

if($state == 'duo'){
  global $timestamp1, $heartBeat1, $UUID1, $timestamp2, $heartBeat2, $UUID2, $sql;
  $timestamp1 = $_POST['timestamp1'];
  $heartBeat1 = $_POST['heartBeat1'];
  $UUID1 = $_POST['UUID1'];
  $timestamp2 = $_POST['timestamp2'];
  $heartBeat2 = $_POST['heartBeat2'];
  $UUID2 = $_POST['UUID2'];
  $heartBeatint1 = (int)$heartBeat1;
  $heartBeatint2 = (int)$heartBeat2;
  $timestampstring1 = (String)$timestamp1;
  $timestampstring2 = (String)$timestamp2;
  $sql = "INSERT INTO HeartBeat (UUID, Timestamp, HeartBeat) VALUES ('$UUID1', '$timestampstring1', '$heartBeatint1')
  , ('$UUID2', '$timestampstring2', '$heartBeatint2')";
}
else{
  global $timestamp1, $heartBeat1, $UUID1, $timestamp2, $heartBeat2, $UUID2, $sql;
  $timestamp1 = $_POST['timestamp1'];
  $heartBeat1 = $_POST['heartBeat1'];
  $UUID1 = $_POST['UUID1'];
  $heartBeatint1 = (int)$heartBeat1;
  $timestampstring1 = (String)$timestamp1;
  $sql = "INSERT INTO HeartBeat (UUID,Timestamp, HeartBeat) VALUES ('$UUID1', '$timestampstring1', '$heartBeatint1')";
}

// $sql = "INSERT INTO HeartBeat (UUID,Timestamp, HeartBeat) VALUES ('$UUID', '$timestampstring', '$heartBeatint')";

if (mysqli_query($con, $sql)) {
  $response["success"] = 1;
  $response["message"] = "Received value: ". $state;
} else {
  $response["success"] = 0;
  $response["message"] = "Failed to receive value";
}

mysqli_close($con);

echo json_encode($response);
?>