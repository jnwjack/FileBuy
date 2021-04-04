<?php

  /* email.php

    Returns a wrapper object that handles the sending of an email

  */

  require('../vendor/autoload.php');

  class Email 
  {
    private $recipient;
    private $message;
    private $subject;

    private $sendgrid;
    private $sendgridEmail;

    function __construct() {
      // Start session if not started yet
      if(session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
      }

      // Check if sendgrid API key is in session
      if(!array_key_exists('SENDGRID', $_SESSION)) {
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

      // Add template
      $this->sendgridEmail->setTemplateId('d-3f64de4b270f4aaeae55ac4521df719d');
    }

    public function setMessage(string $newMessage) {
      // $this->sendgridEmail->addContent(
      //   "text/html", "<h1>$header</h1><p>$newMessage</p>"
      // );
      $this->message = $newMessage;
    }

    public function setSubject(string $newSubject) {
      // $this->sendgridEmail->setSubject($newSubject);
      $this->subject = $newSubject;
    }

    public function setRecipient(string $newRecipient) {
      // $this->sendgridEmail->addTo($newRecipient, "Recipient");
      $this->recipient = $newRecipient;
    }

    public function send() {
      // Return true if no error and response code is 2xx
      $this->sendgridEmail->addTo($this->recipient, 'Recipient', [
        'subject' => $this->subject,
        'message' => $this->message
      ]);
      try {
        $responseCode = $this->sendgrid->send($this->sendgridEmail)->statusCode();
        return($responseCode < 300 && $responseCode >= 200);
      } catch (Exception $e) {
        return false;
      }
    }
  }

?>