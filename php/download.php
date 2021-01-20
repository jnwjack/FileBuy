<?php

  /* download.php

    This script is run when a user completes a payment for a file or when they click the download
    button and the file has already been paid for.

    It checks if the PayPal order is complete.  If sets the 'complete' flag to 1 if it is not already
    and the payment was successful.  If 'complete' is equal to 1, the file has already been paid for.

  */

  require_once('paypal_request.php');
  require_once('database_request.php');

  $db = getDatabaseObject();

  $statement = $db->prepare('SELECT order_id, complete FROM listings WHERE id=:id');
  $statement->bindValue(':id',$_POST['listing'],PDO::PARAM_INT);
  $statement->execute();
  $row = $statement->fetch(PDO::FETCH_ASSOC);
  $order_id = $row['order_id'];

  if($order_id == $_POST['order'] || $row['complete'] == 1) {
    $ch = curl_init("https://api.sandbox.paypal.com/v2/checkout/orders/$order_id");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $paypal_response = makePayPalCall($ch);
  
    if($paypal_response->status != 'COMPLETED') {
      http_response_code(500);
      echo 'FAILURE: Order not complete';
    }
    else {
      $file = unserialize(file_get_contents("/opt/data/$_POST[listing]"));
      $jsonData = json_encode($file);

      if($row['complete'] == 0) {
        $update = $db->prepare('UPDATE listings SET complete = 1 WHERE id=:id');
        $update->bindValue(':id',$_POST['listing'],PDO::PARAM_INT);
        $update->execute();
      }

      echo $jsonData;
    }
  }
  else {
    http_response_code(400);
    echo 'FAILURE: Invalid order';
  }

?>