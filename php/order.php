<?php

  /* order.php

    This script is called when a user clicks the "Pay with PayPal" button and sets up an order.

    A paypal order is created and the order ID is saved in the database.
  
  */

  $username = "root";
  $password = "root";

  $access_token = 'TOKEN';

  $db = new PDO('mysql:host=localhost;dbname=file_buy', $username, $password,
      array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

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
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    "Authorization: Bearer $access_token"
  ));
  curl_setopt($ch, CURLOPT_POSTFIELDS, $json_curl_data);
  $paypal_data = curl_exec($ch);

  if(!$paypal_data) {
    echo 'FAILURE';
  }
  else {
    $decoded_paypal_data = json_decode($paypal_data);
    $statement = $db->prepare('UPDATE listings SET order_id=:order_id WHERE id=:id');
    $statement->bindValue(':order_id',$decoded_paypal_data->id,PDO::PARAM_STR);
    $statement->bindValue(':id',$_POST['listing'],PDO::PARAM_INT);
    $statement->execute();

    $ch = curl_init('https://api.sandbox.paypal.com/v1/payments/payouts');
    $curl_data = array(
      'sender_batch_header' => array('email_subject' => 'Your file has been bought!', 'email_message' => '<3'),
      'items' => array(array(
        'recipient_type' => 'EMAIL', 
        'amount' => array('value' => "$price", 'currency' => 'USD'),
        'note' => 'Thank you for using FileBuy!',
        'sender_item_id' => '0',
        'receiver' => "$seller_email",
        'notification_language' => 'fr-FR')
      )
    );
    $json_curl_data = json_encode($curl_data);

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      "Authorization: Bearer $access_token"
    ));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_curl_data);
    $payout_response = curl_exec($ch);

    echo $decoded_paypal_data->id;
  }

?>