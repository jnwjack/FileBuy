<?php

  /* submit.php

    This script is run when the user posts a listing for their file.

    It creates a listing in the database.

  */

  require_once('database_request.php');

  $preview = serialize($_POST["preview"]);
  $file = serialize($_POST["file"]);
  $email = $_POST["email"];
  $price = $_POST["price"];
  $name = $_POST["name"];
  $size = $_POST["size"];
  $id = random_int(0, 50000);

  $db = getDatabaseObject();

  $statement = $db->prepare("INSERT INTO listings(preview,file,email,price,id,name,size)
              VALUES(:preview,:file,:email,:price,:id,:name,:size);");

  $statement->bindValue(":preview",$preview,PDO::PARAM_LOB);
  $statement->bindValue(":file",$file,PDO::PARAM_LOB);
  $statement->bindValue(":email",$email,PDO::PARAM_STR);
  $statement->bindValue(":price",$price,PDO::PARAM_STR);
  $statement->bindValue(":id",$id,PDO::PARAM_INT);
  $statement->bindValue(":name",$name,PDO::PARAM_STR);
  $statement->bindValue(":size",$size,PDO::PARAM_INT);
  $statement->execute();

  echo $id;

?>