<?php

  /* commission_order.php

    This script is called when a user clicks the "Pay with PayPal" button and sets up an order on a commission.

    A paypal order is created and the order ID is saved in the steps table.

  */

  require_once('paypal_request.php');
  require_once('database_request.php');
  require_once('util.php');

  $commission_id = $_POST['commission'];

  $db = getDatabaseObject();
  $commissionStatement = $db->prepare('SELECT current FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id', $commission_id, PDO::PARAM_STR);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission data');
  }
  $commissionRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $current = $commissionRow['current'];

  $stepStatement = $db->prepare('SELECT price, status, order_id FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
  $stepStatement->bindValue(':sequence_number', $current, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch milestone data');
  }
  $stepRow = $stepStatement->fetch(PDO::FETCH_ASSOC);
  $status = $stepRow['status'];
  $price = priceWithFee($stepRow['price']);
  $orderID = $stepRow['order_id'];

  // Only set up order if status indicates that no payment has been made
  if($status >= 2) {
    http_response_code(500);
    die('ERROR: Payment already made for this step');
  }

  // If we already have an order ID, return it
  if($orderID) {
    echo $orderID;
  }
  // Ohterwise, fetch a new order ID from PayPal
  else {
    $ch = curl_init('https://api.sandbox.paypal.com/v2/checkout/orders');
    $curl_data = array('intent' => 'CAPTURE', 'purchase_units' => array(array('amount' => array('currency_code' => 'USD', 'value' => "$price"))));
    $json_curl_data = json_encode($curl_data);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_curl_data);
    $paypal_response = makePayPalCall($ch);
    if(!$paypal_response) {
      http_response_code(500);
      die('FAILURE: PayPal request failed');
    }
  
    // Update step row to include order_id
    $updateStatement = $db->prepare('UPDATE steps SET order_id=:order_id WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
    $updateStatement->bindValue(':order_id', $paypal_response->id, PDO::PARAM_STR);
    $updateStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
    $updateStatement->bindValue(':sequence_number', $current, PDO::PARAM_INT);
    $successful = $updateStatement->execute();
    if(!$successful) {
      http_response_code(500);
      die('FAILURE: Could not update milestone');
    }
    
    echo $paypal_response->id;
  }
?>
