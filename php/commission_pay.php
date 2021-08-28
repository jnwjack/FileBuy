<?php

  /* commission_pay.php

    This script is called when the buyer of a commission completes a payment for a milestone. It progresses
    the status variable of the current milestone and, if the step is completed, increments the current milestone
    variable in the commission row and returns the file data.

  */

  require_once('paypal_request.php');
  require_once('database_request.php');
  require_once('email.php');
  require_once('util.php');

  $commission_id = $_POST['commission'];
  $order = $_POST['order'];

  $db = getDatabaseObject();

  $commissionStatement = $db->prepare('SELECT email, steps, current FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id',$commission_id,PDO::PARAM_STR);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $commissionRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepNumber = $commissionRow['current'];
  $totalSteps = $commissionRow['steps'];
  // Get email so we can send an email at the end and pay out if necessary
  $email = $commissionRow['email'];

  $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
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
  $currentStepPriceWithFee = priceWithFee($currentStepPrice);
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
  $ch = curl_init("https://api-m.sandbox.paypal.com/v2/checkout/orders/$order");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $paypal_response = makePayPalCall($ch);

  if($paypal_response->status != 'COMPLETED') {
    http_response_code(500);
    die('FAILURE: Order not complete');
  }

  // Update status code to show that payment is received
  $newStatusCode = $currentStepStatus + 2;
  $stepStatement = $db->prepare('UPDATE steps SET status=:status WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
  $stepStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $stepStatement->bindValue(':status', $newStatusCode, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not update milestone');
  }

  $returnData = array(
    'stepNumber' => $currentStepNumber,
    'current' => $currentStepNumber,
    'commission' => $commission_id,
    'currentStep' => array(
      'preview' => unserialize($currentStepPreview),
      'title' => $currentStepTitle,
      'status' => $newStatusCode,
      'price' => $currentStepPriceWithFee,
      'description' => $currentStepDescription
    )
  );

  // If the order for this milestone is now complete
  if($currentStepStatus == 1) {
    // Pay out to seller
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

    $newStepNumber = $currentStepNumber + 1;
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

  // Send email to alert that a payment has been made
  $alert = new Email();
  $alert->setMessage("Congrats! A payment has been made on your commission: https://filebuy.app/commission/$commission_id");
  $alert->setSubject('Payment made on your commission');
  $alert->setRecipient($email);
  $alert->send();

  $jsonData = json_encode($returnData);
  echo $jsonData;

?>