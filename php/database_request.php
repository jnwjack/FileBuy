<?php

  /* database_request.php

    Contains functions related to interacting with the database.

  */

  /* getDatabaseObject()

    Fetch credentials from filesystem and return a PDO object.

  */
  function getDatabaseObject() {
    $username_filename = '/etc/dbuser';
    $username_file = fopen($username_filename, 'r');
    $username = fread($username_file, filesize($username_filename));

    $password_filename = '/etc/dbpwd';
    $password_file = fopen($username_filename, 'r');
    $password = fread($password_file, filesize($password_filename));

    $db = new PDO('mysql:host=localhost;dbname=file_buy', $username, $password,
      array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

    return $db;
  }

  getDatabaseObject();

?>