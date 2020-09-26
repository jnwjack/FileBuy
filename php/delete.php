<?php

  $username = "root";
  $password = "root";

  $db = new PDO('mysql:host=localhost;dbname=file_buy', $username, $password,
    array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

  $statement = $db->prepare('SELECT * FROM listings');
  $statement->execute();
  $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

  $current_time = new DateTime('now', new DateTimeZone('America/New_York'));

  foreach ($rows as $row) {
    $listing_time = new DateTime($row['time'], new DateTimeZone('America/New_York'));
    //$current_time = new DateTime('now', new DateTimeZone('America/New_York'));
  
    $time_difference = $listing_time->diff($current_time);
  
    if($time_difference->h >= 6 || $time_difference->d > 0 || $time_difference->m > 0 || $time_difference->y > 0) {
      $delete_statement = $db->prepare('DELETE FROM listings WHERE id = :id');
      $delete_statement->bindValue(':id',$row['id'],PDO::PARAM_INT);
      $delete_statement->execute();
    }
  }

?>