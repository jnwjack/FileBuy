<?php

  /* commission_fetch_step.php

    Fetch a specified step for a specified commission

  */

  require_once('database_request.php');
  require_once('util.php');

  $commissionID = $_GET['commission'];
  $queryStepNumber = (int) $_GET['step'];

  $db = getDatabaseObject();

  // Make sure this step is valid (not ahead of current step)
  $commissionStatement = $db->prepare('SELECT current FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id', $commissionID, PDO::PARAM_STR);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $commissionStatementRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepNumber = $commissionStatementRow['current'];

  if($queryStepNumber > $currentStepNumber) {
    http_response_code(500);
    die('FAILURE: Select a valid step');
  }

  // Fetch step
  $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $stepStatement->bindValue(':sequence_number', $queryStepNumber, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch milestone');
  }
  $stepStatementRow = $stepStatement->fetch(PDO::FETCH_ASSOC);
  $queryStepStatus = $stepStatementRow['status'];
  $queryStepTitle = $stepStatementRow['title'];
  $queryStepDescription = $stepStatementRow['description'];
  $queryStepPrice = priceWithFee($stepStatementRow['price']);
  $queryStepPreview = $stepStatementRow['preview'];

  $returnData = array(
    'stepNumber' => $queryStepNumber,
    'current' => $currentStepNumber,
    'commission' => $commissionID,
    'step' => array(
      'preview' => unserialize($queryStepPreview),
      'title' => $queryStepTitle,
      'status' => $queryStepStatus,
      'price' => $queryStepPrice,
      'description' => $queryStepDescription
    )
  );

  $jsonData= json_encode($returnData);

  echo $jsonData
?>