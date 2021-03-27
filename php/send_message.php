<?php

  /* send_message.php

    Send message to owner of File Buy team. Called by Contact page.

  */

  require_once('email.php');


  $email = new Email();
  $email->setRecipient('test@gmail.com');
  $email->setSubject('A message');
  $email->setMessage('Does this work?');
  $email->send();

  echo 'TODO: Add email server'

?>