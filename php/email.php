<?php

  /* email.php

    Returns a wrapper object that handles the sending of an email

  */

  require('../vendor/autoload.php');

  class Email 
  {
    private $sendgrid;
    private $sendgridEmail;

    function __construct() {
      // Start session if not started yet
      if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
      }

      // Check if sendgrid API key is in session
      if(!$_SESSION['SENDGRID']) {
        $sendgrid_key_filename = '../auth/MAILKEY';
        $sendgrid_key_file = fopen($sendgrid_key_filename, 'r');
        $sendgrid_key = fread($sendgrid_key_file, filesize($sendgrid_key_filename));
        $_SESSION['SENDGRID'] = $sendgrid_key;
      }

      // Sendgrip API
      $this->sendgrid = new \SendGrid($_SESSION['SENDGRID']);

      // Initialize email with sendgrid
      $this->sendgridEmail = new \SendGrid\Mail\Mail(); 
      $this->sendgridEmail->setFrom("noreply@em5875.filebuy.app", "File Buy");
    }

    public function setMessage(string $newMessage, string $header) {
      $this->sendgridEmail->addContent(
        "text/html", "<h1>$header</h1><p>$newMessage</p>"
      );
    }

    public function setSubject(string $newSubject) {
      $this->sendgridEmail->setSubject($newSubject);
    }

    public function setRecipient(string $newRecipient) {
      $this->sendgridEmail->addTo($newRecipient, "Recipient");
    }

    public function send() {
      // Return true if no error and response code is 2xx
      try {
        $responseCode = $this->sendgrid->send($this->sendgridEmail)->statusCode();
        return($responseCode < 300 && $responseCode >= 200);
      } catch (Exception $e) {
        return false;
      }
    }
  }

?>