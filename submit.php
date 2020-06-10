<?php

$preview = serialize($_POST["preview"]);
$file = serialize($_POST["file"]);
$email = $_POST["email"];
$price = $_POST["price"];
$id = random_int(0,4294967294);

$db = new PDO("mysql:host=localhost;dbname=file_buy");
$statement = $db->prepare("INSERT INTO listings(preview,file,email,price,id)
                      VALUES(:preview,:file,:email,:price,:id);");

$statement->bindValue(":preview",$preview,PDO::PARAM_LOB);
$statement->bindValue(":file",$file,PDO::PARAM_LOB);
$statement->bindValue(":email",$email,PDO::PARAM_STR);
$statement->bindValue(":price",$email,PDO::PARAM_STR);
$statement->bindValue(":id",$id,PDO::PARAM_INT);
$statement->execute();

?>