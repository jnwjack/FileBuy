<?php

  /* paypal_request.php

    Contains functions related to interacting with the Paypal API.

  */

  if(session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
  }

  /* fetchPayPalToken()

    Fetch an access token from PayPal using our credentials and
    store in the _SESSION variable.

  */
  function fetchPayPalToken() {
    error_log(print_r('fetchPayPalToken', TRUE));
    $client_id_filename = '../auth/CLIENT_ID';
    $client_id_file = fopen($client_id_filename, 'r');
    $client_id = fread($client_id_file, filesize($client_id_filename));

    $client_sec_filename = '../auth/CLIENT_SECRET';
    $client_sec_file = fopen($client_sec_filename, 'r');
    $client_sec = fread($client_sec_file, filesize($client_sec_filename));

    $ch = curl_init('https://api-m.paypal.com/v1/oauth2/token');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      'Accept-Language: en_US' 
    ));
    curl_setopt($ch, CURLOPT_USERPWD, "$client_id:$client_sec");
    curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
    $response = curl_exec($ch);
    $decoded_data = json_decode($response);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if($httpcode !== 200) {
      error_log(print_r($httpcode, TRUE));
      return false;
    }

    // error_log(print_r($decoded_data, TRUE));
    $_SESSION['paypal_token'] = $decoded_data->access_token;
  }

  /* makePayPalCall($ch)

    Set http headers for the cUrl object and makes the request
    to PayPal. Also handles if the token is expired.

  */
  function makePayPalCall($ch) {
    if(!array_key_exists('paypal_token', $_SESSION)) {
      error_log(print_r('missing key', TRUE));
      fetchPayPalToken();
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/json',
      "Authorization: Bearer {$_SESSION['paypal_token']}"
    ));

    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    // check if token is expired/invalid, fetch token again if it is.
    if($httpcode === 401) {
      // Sleep for 5 seconds to avoid 429 response from PayPal
      sleep(5);
      fetchPayPalToken();
      makePayPalCall($ch);
    } else if($httpcode >= 300) {
      return false;
    }
    
    error_log(print_r($response, TRUE));
    $decoded_data = json_decode($response);

    return $decoded_data;
  }

?>