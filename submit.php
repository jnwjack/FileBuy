<?php

$preview = serialize($_FILES["preview"]);
$file = serialize($_POST["file"]);
$email = $_POST["email"];
$price = $_POST["price"];
$id = random_int(0, 50000);

$username = "root";
$password = "root";

$db = new PDO("mysql:host=localhost;dbname=file_buy", $username, $password,
        array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

$statement = $db->prepare("INSERT INTO listings(preview,file,email,price,id)
                      VALUES(:preview,:file,:email,:price,:id);");

$statement->bindValue(":preview",$preview,PDO::PARAM_LOB);
$statement->bindValue(":file",$file,PDO::PARAM_LOB);
$statement->bindValue(":email",$email,PDO::PARAM_STR);
$statement->bindValue(":price",$price,PDO::PARAM_STR);
$statement->bindValue(":id",$id,PDO::PARAM_INT);
$statement->execute();

echo $id;

?>