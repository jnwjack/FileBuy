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
  require_once('email.php');
  require_once('util.php');

  $preview = $_POST["preview"] != "null" ? serialize($_POST["preview"]) : NULL;
  $file = serialize($_POST["file"]);
  $email = $_POST["email"];
  $price = round($_POST["price"], 2);
  $name = $_POST["name"];
  $size = $_POST["size"];
  $uuid = Uuid::uuid4();
  $id = $uuid->toString();

  if(fileTooLarge($file)) {
    http_response_code(413);
    die('FAILURE: File too large');
  }

  if(priceTooLarge($price)) {
    http_response_code(418);
    die('FAILURE: Price too large');
  }

  $db = getDatabaseObject();

  if(tooManyPostings($db, $email)) {
    // 409 = Too many postings
    http_response_code(409);
    die('This email has too many active postings');
  }

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
      // Send email with link
      $confirmation = new Email();
      $confirmation->setMessage("Hi! Here's the link to the listing you've just created: https://filebuy.app/listing/$id");
      $confirmation->setSubject('Link to your listing');
      $confirmation->setRecipient($email);
      $confirmation->send();

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