<?php

  /* commission_file_upload.php

    Upload file for the current step of a commission

  */

  require_once('database_request.php');
  $commission_id = $_POST['commission'];
  $preview = serialize($_POST["preview"]);
  $file = serialize($_POST["file"]);

  $db = getDatabaseObject();

  $commissionStatement = $db->prepare('SELECT current, email FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id', $commission_id, PDO::PARAM_INT);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $commissionStatementRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepNumber = $commissionStatementRow['current'];

  $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_INT);
  $stepStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch milestone');
  }
  $stepStatementRow = $stepStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepStatus = $stepStatementRow['status'];
  $currentStepTitle = $stepStatementRow['title'];
  $currentStepDescription = $stepStatementRow['description'];
  $currentStepPrice = $stepStatementRow['price'];
  
  // Only upload file if no file uploaded and step not complete
  if($currentStepStatus == 0 || $currentStepStatus == 2) {
    $newStepStatus = $currentStepStatus + 1;
    $fileWriteSuccessful = file_put_contents("/opt/data/${commission_id}-${currentStepNumber}", $file);
    if(!$fileWriteSuccessful) {
      http_response_code(500);
      die('FAILURE: Could not write file');
    }
    $insertStatement = $db->prepare('UPDATE steps SET status=:status, preview=:preview WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
    $insertStatement->bindValue(':preview', $preview, PDO::PARAM_LOB);
    $insertStatement->bindValue(':status', $newStepStatus, PDO::PARAM_INT);
    $insertStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_INT);
    $insertStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
    $insertStatement->execute();
    // if(!$successful) {
    //   http_response_code(500);
    //   die('FAILURE: Could not update commission milestone');
    // }
    $returnData = array(
      'preview' => unserialize($preview),
      'status' => $newStepStatus,
      'title' => $currentStepTitle,
      'price' => $currentStepPrice,
      'description' => $currentStepDescription
    );
    $jsonData = json_encode($returnData);

    echo $jsonData;
  } else {
    http_response_code(500);
    die('FAILURE: Cannot upload file at this point in milestone');
  }

  
?>