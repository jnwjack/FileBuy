<?php

  /* commission_file_upload.php

    Upload file for the current step of a commission

  */

  require_once('database_request.php');
  require_once('paypal_request.php');
  require_once('util.php');

  $commission_id = $_POST['commission'];
  $preview = serialize($_POST["preview"]);
  $file = serialize($_POST["file"]);

  if(fileTooLarge($file)) {
    http_response_code(413);
    die('FAILURE: File too large');
  }

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
  $email = $commissionStatementRow['email'];

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
  $currentStepPriceWithFee = priceWithFee($currentStepPrice);
  
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

    // Fetch evidence for this step
    $evidenceStatement = $db->prepare('SELECT * FROM evidence WHERE commission_id=:commission_id AND step_number=:step_number');
    $evidenceStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
    $evidenceStatement->bindValue(':step_number', $currentStepNumber, PDO::PARAM_INT);
    $successful = $evidenceStatement->execute();
    if(!$successful) {
      http_response_code(500);
      die('FAILURE: Could not fetch evidence for milestone');
    }
    $evidenceStatementRows = $evidenceStatement->fetchAll(PDO::FETCH_ASSOC);

    $evidenceArray = array();
    foreach ($evidenceStatementRows as $evidence) {
      $evidenceID = $evidence['id'];
      $evidenceFile = unserialize(file_get_contents("/opt/data/${commission_id}-${currentStepNumber}-${evidenceID}"));
      $evidenceObject = array(
        'evidenceNumber' => $evidence['evidence_number'],
        'description' => $evidence['description'],
        'file' => $evidenceFile
      );

      // Add evidence to array
      $evidenceArray[] = $evidenceObject;
    }

    $returnData = array(
      'stepNumber' => $currentStepNumber,
      'current' => $currentStepNumber,
      'commission' => $commission_id,
      'currentStep' => array(
        'preview' => unserialize($preview),
        'title' => $currentStepTitle,
        'status' => $newStepStatus,
        'price' => $currentStepPriceWithFee,
        'description' => $currentStepDescription,
        'evidence' => $evidenceArray
      )
    );

    $newStepNumber = $currentStepNumber + 1;

    // If order is complete
    if($currentStepStatus == 2) {
      // Pay seller
      $ch = curl_init('https://api-m.sandbox.paypal.com/v1/payments/payouts');
      $curl_data = array(
        'sender_batch_header' => array('email_subject' => 'A milestone has been completed!', 'email_message' => '<3'),
        'items' => array(array(
        'recipient_type' => 'EMAIL', 
        'amount' => array('value' => "$currentStepPrice", 'currency' => 'USD'),
        'note' => 'Thank you for using FileBuy!',
        'sender_item_id' => '0',
        'receiver' => "$email",
        'notification_language' => 'fr-FR')
        )
      );
      $json_curl_data = json_encode($curl_data);
      
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $json_curl_data);
  
      $payout_response = makePayPalCall($ch);
      if(!in_array($payout_response->batch_header->batch_status, array('PENDING', 'PROCESSING', 'SUCCESS'))) {
        http_response_code(500);
        die('ERROR: Payout to seller failed');
      }

      // If there's another step
      if($newStepNumber <= $totalSteps) {
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
        $nextStepPrice = priceWithFee($stepStatementRow['price']);
        $nextStepPreview = $stepStatementRow['preview'];

        $returnData['current'] = $newStepNumber;
      }
    }

    $jsonData = json_encode($returnData);

    echo $jsonData;
  } else {
    http_response_code(500);
    die('FAILURE: Cannot upload file at this point in milestone');
  }

  
?>