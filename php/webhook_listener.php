<?php

  /* webhook_listener.php

    This script is called upon a completed payment from the buyer to file buy.

    A payment is then made to the seller from file buy.
  
  */

  $username = "root";
  $password = "root";

  $access_token = '***REMOVED***';

  $data = json_decode(file_get_contents('php://input'), true);
  $resource = $data['resource'];
  $order_id = $resource['id'];
  $status = $resource['status'];

  $db = new PDO('mysql:host=localhost;dbname=file_buy', $username, $password,
    array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

  $statement = $db->prepare('SELECT email, price, complete, id FROM listings WHERE order_id=:order_id');
  $statement->bindValue(':order_id',$order_id,PDO::PARAM_STR);
  $statement->execute();
  $row = $statement->fetch(PDO::FETCH_ASSOC);
  
  if(!$row) {
    http_response_code(400);
    die('FAILURE: Order not in database');
  }

  $complete_code = $row['complete'];
  $seller_email = $row['email'];
  $price = $row['price'];
  $id = $row['id'];

  switch($complete_code) {
    case 0:
      http_response_code(500);
      die('Payment not received');
    case 1:  
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
      $decoded_paypal_data = json_decode($payout_response);
      
      if(!$decoded_paypal_data) {
        http_response_code(500);
        die('FAILURE: Order not complete');
      }

      $statement = $db->prepare('UPDATE listings SET complete=2 WHERE id=:id');
      $statement->bindValue(':id',$id,PDO::PARAM_INT);
      $statement->execute();

      die('Seller payment pending');
    case 2:
      die('Seller payment already completed');
  }


?>