<?php

  /* commission_download.php

    Return file to frontend if status is completed for the step.

  */

  require_once('database_request.php');

  $commissionID = $_GET['commission'];
  $stepNumber = $_GET['step'];

  $db = getDatabaseObject();

  $statement = $db->prepare('SELECT status FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $statement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $statement->bindValue(':sequence_number', $stepNumber, PDO::PARAM_INT);
  $successful = $statement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch milestone');
  }

  $statementRow = $statement->fetch(PDO::FETCH_ASSOC);
  $status = $statementRow['status'];

  // If not complete, don't return file
  if($status != 3) {
    http_response_code(401);
    die('FAILURE: Step is not complete');
  }

  // Fetch file and encode it as json object
  $file = unserialize(file_get_contents("/opt/data/$commissionID-$stepNumber"));
  $jsonData = json_encode($file);

  echo $jsonData;

?>