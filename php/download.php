<?php

  /* download.php

    This script is run when a user completes a payment for a file or when they click the download
    button and the file has already been paid for.

    It checks if the PayPal order is complete.  If sets the 'complete' flag to 1 if it is not already
    and the payment was successful.  If 'complete' is equal to 1, the file has already been paid for.

  */

  require_once('paypal_request.php');
  require_once('database_request.php');
  require_once('email.php');

  $db = getDatabaseObject();

  $id = $_POST['listing'];

  $statement = $db->prepare('SELECT email, order_id, complete, price FROM listings WHERE id=:id');
  $statement->bindValue(':id',$id,PDO::PARAM_STR);
  $statement->execute();
  $row = $statement->fetch(PDO::FETCH_ASSOC);
  $order_id = $row['order_id'];
  // Price without fee to pay to seller
  $price = $row['price'];
  // Get email so we can send message to seller
  $email = $row['email'];

  // File already paid for
  if($row['complete'] == 1) {
    $file = unserialize(file_get_contents("/opt/data/$_POST[listing]"));
    $jsonData = json_encode($file);

    echo $jsonData;
  }

  // Otherwise, see if PayPal order is complete
  else if($order_id == $_POST['order']) {
    $ch = curl_init("https://api-m.sandbox.paypal.com/v2/checkout/orders/$order_id");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $paypal_response = makePayPalCall($ch);
  
    if($paypal_response->status != 'COMPLETED') {
      http_response_code(500);
      die('FAILURE: Order not complete');
    }

    // Pay seller
    $ch = curl_init('https://api-m.sandbox.paypal.com/v1/payments/payouts');
    $curl_data = array(
      'sender_batch_header' => array('email_subject' => 'Your file has been bought!', 'email_message' => '<3'),
      'items' => array(array(
      'recipient_type' => 'EMAIL', 
      'amount' => array('value' => "$price", 'currency' => 'USD'),
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

    $update = $db->prepare('UPDATE listings SET complete = 1 WHERE id=:id');
    $update->bindValue(':id',$_POST['listing'],PDO::PARAM_STR);
    $update->execute();

    // Email seller
    $alert = new Email();
    $alert->setMessage("Congrats! Your file has been paid for: https://filebuy.app/listing/$id");
    $alert->setSubject('Payment made on your listing');
    $alert->setRecipient($email);
    $alert->send();

    $file = unserialize(file_get_contents("/opt/data/$_POST[listing]"));
    $jsonData = json_encode($file);

    echo $jsonData;
  }

  else {
    http_response_code(400);
    echo 'FAILURE: Invalid order';
  }

?>