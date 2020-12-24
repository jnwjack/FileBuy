<?php

  /* order.php

    This script is called when a user clicks the "Pay with PayPal" button and sets up an order.

    A paypal order is created and the order ID is saved in the database.
  
  */

  require_once('paypal_request.php');
  require_once('database_request.php');

  $db = getDatabaseObject();

  $statement = $db->prepare('SELECT email, price FROM listings WHERE id=:id');
  $statement->bindValue(':id',$_POST['listing'],PDO::PARAM_INT);
  $statement->execute();
  $row = $statement->fetch(PDO::FETCH_ASSOC);
  $price = $row['price'];
  $seller_email = $row['email'];

  $ch = curl_init('https://api.sandbox.paypal.com/v2/checkout/orders');
  $curl_data = array('intent' => 'CAPTURE', 'purchase_units' => array(array('amount' => array('currency_code' => 'USD', 'value' => "$price"))));
  $json_curl_data = json_encode($curl_data);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $json_curl_data);

  $paypal_response = makePayPalCall($ch);
  if(!$paypal_response) {
    http_response_code(500);
    echo 'ORDER FAILED';
    die();
  }

  $statement = $db->prepare('UPDATE listings SET order_id=:order_id WHERE id=:id');
  $statement->bindValue(':order_id',$paypal_response->id,PDO::PARAM_STR);
  $statement->bindValue(':id',$_POST['listing'],PDO::PARAM_INT);
  $statement->execute();

  echo $paypal_response->id;

?>