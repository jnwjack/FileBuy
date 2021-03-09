<?php

  /* submit.php

    This script is run when the user posts a listing for their file.

    It creates a listing in the database.

  */

  // Error handling
  function exceptions_error_handler($severity, $message, $filename, $lineno) {
    die($message);
    //throw new ErrorException($message, 0, $severity, $filename, $lineno);
  }

  set_error_handler('exceptions_error_handler');

  require('../vendor/autoload.php');
  use Ramsey\Uuid\Uuid;
  require_once('database_request.php');

  $preview = serialize($_POST["preview"]);
  $file = serialize($_POST["file"]);
  $email = $_POST["email"];
  $price = $_POST["price"];
  $name = $_POST["name"];
  $size = $_POST["size"];
  $uuid = Uuid::uuid4();
  $id = $uuid->toString();

  $db = getDatabaseObject();

  $statement = $db->prepare("INSERT INTO listings(preview,email,price,id,name,size)
              VALUES(:preview,:email,:price,:id,:name,:size);");

  $statement->bindValue(":preview",$preview,PDO::PARAM_LOB);
  $statement->bindValue(":email",$email,PDO::PARAM_STR);
  $statement->bindValue(":price",$price,PDO::PARAM_STR);
  $statement->bindValue(":id",$id,PDO::PARAM_STR);
  $statement->bindValue(":name",$name,PDO::PARAM_STR);
  $statement->bindValue(":size",$size,PDO::PARAM_INT);
  $listingCreateSuccessful = $statement->execute();

  if($listingCreateSuccessful) {
    $fileWriteSuccessful = file_put_contents("/opt/data/$id", $file);
    if($fileWriteSuccessful) {
      echo $id;
    } else {
      // Couldn't write file, delete
      $delete_statement = $db->prepare('DELETE FROM listings WHERE id = :id');
      $delete_statement->bindValue(':id',$row['id'],PDO::PARAM_STR);
      $delete_statement->execute();

      http_response_code(500);
      die('FAILURE: Could not write file to system');
    }
  } else {
    http_response_code(500);
    die('FAILURE: Could not create database entry');
  }
?>