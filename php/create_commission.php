<?php

  /* create_comission.php

    Run when the user creates a commission.  It creates a commission

    in the database

  */
  
  require('../vendor/autoload.php');
  use Ramsey\Uuid\Uuid;
  require_once('database_request.php');
  require_once('email.php');

  function deleteCommissionAndSteps($dbObj, $commission) {
    $statement = $dbObj->prepare("DELETE FROM commissions WHERE id=:id");
    $statement->bindValue(":id",$commission,PDO::PARAM_STR);
    $statement->execute();

    $statement = $dbObj->prepare("DELETE FROM steps WHERE commission_id=:commission_id");
    $statement->bindValue(":commission_id",$commission,PDO::PARAM_STR);
    $statement->execute();
  }

  $postData = json_decode(file_get_contents('php://input'), true);

  $numSteps = $postData['numSteps'];
  $email = $postData['email'];
  $uuid = Uuid::uuid4();
  $id = $uuid->toString();
  $current = 1;

  $db = getDatabaseObject();

  $statement = $db->prepare("INSERT INTO commissions(id,steps,email,current)
                VALUES(:id,:steps,:email,:current);");
  $statement->bindValue(":id", $id,PDO::PARAM_STR);
  $statement->bindValue(":steps", $numSteps,PDO::PARAM_INT);
  $statement->bindValue(":email", $email, PDO::PARAM_STR);
  $statement->bindValue(":current", $current, PDO::PARAM_INT);
  $successful = $statement->execute();
  if(!$successful) {
    http_response_code(500);
    echo 'FAILURE: Could not create commission';
    die();
  }

  for($i = 1; $i <= $numSteps; $i++) {
    $title = $postData['steps'][$i-1]['title'];
    $description = $postData['steps'][$i-1]['description'];
    $price = round($postData['steps'][$i-1]['price'], 2);
    $stepStatement = $db->prepare("INSERT INTO steps(commission_id,sequence_number,price,title,description)
                      VALUES(:commission_id,:sequence_number,:price,:title,:description);");
    $stepStatement->bindValue(":commission_id",$id,PDO::PARAM_STR);
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

  // Send email with link
  $confirmation = new Email();
  $confirmation->setMessage("Hi! Here's the link to the commission you've just started: https://filebuy.app/commission/$id.");
  $confirmation->setSubject('Link to your commmission');
  $confirmation->setRecipient($email);
  $confirmation->send();

  echo $id;
?>

