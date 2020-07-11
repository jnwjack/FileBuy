<?php

  $username = 'root';
  $password = 'root';

  $access_token = '***REMOVED***;

  $db = new PDO('mysql:host=localhost;dbname=file_buy', $username, $password,
  array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

  $statement = $db->prepare('SELECT file, order_id FROM listings WHERE id=:id');
  $statement->bindValue(':id',$_POST['listing'],PDO::PARAM_INT);
  $statement->execute();
  $row = $statement->fetch(PDO::FETCH_ASSOC);
  $order_id = $row['order_id'];

  if($order_id != $_POST['order']) {
    echo 'FAILURE: INVALID ORDER';
  }
  else {
    $ch = curl_init("https://api.sandbox.paypal.com/v2/checkout/orders/$order_id");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      "Authorization: Bearer $access_token"
    ));
    $paypal_data = curl_exec($ch);
    $decoded_paypal_data = json_decode($paypal_data);
  
    if($decoded_paypal_data->status != 'COMPLETED') {
      echo 'FAILURE: ORDER NOT COMPLETE';
    }
    else {
      $file = unserialize($row['file']);
      $jsonData = json_encode($file);
      echo $jsonData;
    }
  }

?>