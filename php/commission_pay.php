<?php

  /* commission_pay.php

    This script is called when the buyer of a commission completes a payment for a milestone. It progresses
    the status variable of the current milestone and, if the step is completed, increments the current milestone
    variable in the commission row and returns the file data.

  */

  require_once('paypal_request.php');
  require_once('database_request.php');

  $commission_id = $_POST['commission'];
  $order = $_POST['order'];

  $db = getDatabaseObject();

  $commissionStatement = $db->prepare('SELECT steps, current FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id',$commission_id,PDO::PARAM_INT);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $commissionRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepNumber = $commissionRow['current'];
  $totalSteps = $commissionRow['steps'];

  $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_INT);
  $stepStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $stepStatementRow = $stepStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepOrderID = $stepStatementRow['order_id'];
  $currentStepStatus = $stepStatementRow['status'];
  $currentStepTitle = $stepStatementRow['title'];
  $currentStepDescription = $stepStatementRow['description'];
  $currentStepPrice = $stepStatementRow['price'];
  $currentStepPreview = $stepStatementRow['preview'];

  if($order != $currentStepOrderID) {
    http_response_code(500);
    die('FAILURE: Invalid Order ID');
  }

  // Payment already received, don't continue
  if($currentStepStatus > 1) {
    http_response_code(500);
    die('FAILURE: Payment already received');
  }

  // Get order details
  $ch = curl_init("https://api.sandbox.paypal.com/v2/checkout/orders/$order");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $paypal_response = makePayPalCall($ch);

  if($paypal_response->status != 'COMPLETED') {
    http_response_code(500);
    die('FAILURE: Order not complete');
  }

  // Update status code to show that payment is received
  $newStatusCode = $currentStepStatus + 2;
  $stepStatement = $db->prepare('UPDATE steps SET status=:status WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_INT);
  $stepStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $stepStatement->bindValue(':status', $newStatusCode, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not update milestone');
  }

  $returnData = array(
    'current' => $currentStepNumber,
    'currentStep' => array(
      'preview' => unserialize($currentStepPreview),
      'title' => $currentStepTitle,
      'status' => $newStatusCode,
      'price' => $currentStepPrice,
      'description' => $currentStepDescription
    )
  );

  // If the order for this milestone is now complete
  if($currentStepStatus == 1) {
    $newStepNumber = $currentStepNumber + 1;
    if($newStepNumber <= $totalSteps) {
      $commissionStatement = $db->prepare('UPDATE commissions SET current=:current WHERE id=:id');
      $commissionStatement->bindValue(':id', $commission_id, PDO::PARAM_INT);
      $commissionStatement->bindValue(':current', $newStepNumber, PDO::PARAM_INT);
      $successful = $commissionStatement->execute();
      if(!$successful) {
        http_response_code(500);
        die('FAILURE: Could not update new status of commission');
      }

      $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
      $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_INT);
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
  }

  $jsonData = json_encode($returnData);
  echo $jsonData;

?>