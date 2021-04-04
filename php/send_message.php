<?php

  /* send_message.php

    Send message to owner. Called by Contact page.

  */


  require_once('email.php');
  $contactEmail = $_POST['email'];
  $message = $_POST['message'];

  $email = new Email();
  $email->setMessage($message);
  $email->setSubject("$contactEmail has filled out a contact form");
  $email->setRecipient('jnw900@gmail.com');
  $result = $email->send();

  if(!$result) {
    http_response_code(500);
    die('ERROR: Email could not send');
  }
  die('Success');

?>