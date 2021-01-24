<?php

  /* create_comission.php

    Run when the user creates a commission.  It creates a commission

    in the database

  */

  require_once('database_request.php');

  function deleteCommissionAndSteps($dbObj, $commission) {
    $statement = $dbObj->prepare("DELETE FROM commissions WHERE id=:id");
    $statement->bindValue(":id",$commission,PDO::PARAM_INT);
    $statement->execute();

    $statement = $dbObj->prepare("DELETE FROM steps WHERE commission_id=:commission_id");
    $statement->bindValue(":commission_id",$commission,PDO::PARAM_INT);
    $statement->execute();
  }

  $postData = json_decode(file_get_contents('php://input'), true);

  $numSteps = $postData['numSteps'];
  $email = $postData['email'];
  $id = random_int(0, 50000);
  $current = 1;

  $db = getDatabaseObject();

  $statement = $db->prepare("INSERT INTO commissions(id,steps,email,current)
                VALUES(:id,:steps,:email,:current);");

  $statement->bindValue(":id",$id,PDO::PARAM_INT);
  $statement->bindValue(":steps",$numSteps);
  $statement->bindValue(":email",$email);
  $statement->bindValue(":current",$current);
  $successful = $statement->execute();
  if(!$successful) {
    http_response_code(500);
    echo 'FAILURE: Could not create commission';
    die();
  }

  for($i = 1; $i <= $numSteps; $i++) {
    $title = $postData['steps'][$i-1]['title'];
    $description = $postData['steps'][$i-1]['description'];
    $price = $postData['steps'][$i-1]['price'];
    $stepStatement = $db->prepare("INSERT INTO steps(commission_id,sequence_number,price,title,description)
                      VALUES(:commission_id,:sequence_number,:price,:title,:description);");
    $stepStatement->bindValue(":commission_id",$id,PDO::PARAM_INT);
    $stepStatement->bindValue(":sequence_number",$i,PDO::PARAM_INT);
    $stepStatement->bindValue(":price",$price,PDO::PARAM_STR);
    $stepStatement->bindValue(":title",$title,PDO::PARAM_STR);
    $stepStatement->bindValue(":description",$description,PDO::PARAM_LOB);
    $successful = $stepStatement->execute();
    if(!$successful) {
      deleteCommissionAndSteps($db, $id);
      echo 'FAILURE: Could not create steps';
      die();
    }
  }

  echo $id;
?>

