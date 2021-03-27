<?php

  /* email.php

    Returns a wrapper object that handles the sending of an email

  */

  class Email 
  {
    private $message = "";
    private $subject = "";
    private $to = "";

    public function setMessage(string $newMessage) {
      $this->message = $newMessage;
    }

    public function setSubject(string $newSubject) {
      $this->subject = $newSubject;
    }

    public function setRecipient(string $newRecipient) {
      $this->to = $newRecipient;
    }

    public function send() {
      mail($this->to, $this->subject, $this->message);
    }
  }

?>