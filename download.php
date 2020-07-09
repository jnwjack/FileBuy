<?php

  $username = "root";
  $password = "root";

  $db = new PDO("mysql:host=localhost;dbname=file_buy", $username, $password,
  array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

  $statement = $db->prepare("SELECT file FROM listings WHERE id=:id");
  $statement->bindValue(":id",$_POST["listing"],PDO::PARAM_INT);
  $statement->execute();
  $row = $statement->fetch(PDO::FETCH_ASSOC);

  $file = unserialize($row["file"]);
  $jsonData = json_encode($file);
  echo $jsonData;

?>