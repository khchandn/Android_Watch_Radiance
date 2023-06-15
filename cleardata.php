<?php
$serverName = "43.252.167.19";
$databaseName = "Therapy";
$userName = "Radiance";
$password = "Radiance88#";
$con = mysqli_connect($serverName, $userName, $password, $databaseName);
if(!$con) echo "Error<br>";
else echo "Connected<br>";
try {
    $sql = "DELETE FROM HeartBeat";
    $con-> query($sql);
    echo "Data cleared successfully";
}catch(Exception $e){
    echo "Error". $e->getMessage();
}



mysqli_close($con);





?>