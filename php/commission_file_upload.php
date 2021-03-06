<?php

  /* commission_file_upload.php

    Upload file for the current step of a commission

  */

  require_once('database_request.php');
  $commission_id = $_POST['commission'];
  $preview = serialize($_POST["preview"]);
  $file = serialize($_POST["file"]);

  $db = getDatabaseObject();

  $commissionStatement = $db->prepare('SELECT current, email, steps FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id', $commission_id, PDO::PARAM_STR);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $commissionStatementRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepNumber = $commissionStatementRow['current'];
  $totalSteps = $commissionStatementRow['steps'];

  $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
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
    $insertStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
    $insertStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
    $successful = $insertStatement->execute();
    if(!$successful) {
      http_response_code(500);
      die('FAILURE: Could not update commission milestone');
    }

    $returnData = array(
      'current' => $currentStepNumber,
      'currentStep' => array(
        'preview' => unserialize($preview),
        'title' => $currentStepTitle,
        'status' => $newStepStatus,
        'price' => $currentStepPrice,
        'description' => $currentStepDescription
      )
    );

    $newStepNumber = $currentStepNumber + 1;
    if($currentStepStatus == 2 && $newStepNumber <= $totalSteps) {
      $commissionStatement = $db->prepare('UPDATE commissions SET current=:current WHERE id=:id');
      $commissionStatement->bindValue(':id', $commission_id, PDO::PARAM_STR);
      $commissionStatement->bindValue(':current', $newStepNumber, PDO::PARAM_INT);
      $successful = $commissionStatement->execute();
      if(!$successful) {
        http_response_code(500);
        die('FAILURE: Could not update new status of commission');
      }

      $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
      $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
      $stepStatement->bindValue(':sequence_number', $newStepNumber, PDO::PARAM_INT);
      $successful = $stepStatement->execute();
      if(!$successful) {
        http_response_code(500);
        die('FAILURE: Could not fetch next milestone');
      }
      $stepStatementRow = $stepStatement->fetch(PDO::FETCH_ASSOC);
      $nextStepOrderID = $stepStatementRow['order_id'];
      $nextStepStatus = $stepStatementRow['status'];
      $nextStepTitle = $stepStatementRow['title'];
      $nextStepDescription = $stepStatementRow['description'];
      $nextStepPrice = $stepStatementRow['price'];
      $nextStepPreview = $stepStatementRow['preview'];

      $returnData['current'] = $newStepNumber;
      $returnData['currentStep']['status'] = $nextStepStatus;
      $returnData['currentStep']['preview'] = $nextStepPreview;
      $returnData['currentStep']['title'] = $nextStepTitle;
      $returnData['currentStep']['description'] = $nextStepDescription;
      $returnData['currentStep']['price'] = $nextStepPrice;
    }

    $jsonData = json_encode($returnData);

    echo $jsonData;
  } else {
    http_response_code(500);
    die('FAILURE: Cannot upload file at this point in milestone');
  }

  
?>