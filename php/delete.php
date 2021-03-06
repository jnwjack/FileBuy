<?php

  /* delete.php

    This script is run every 30 minutes via a cron job.

    It deletes every listing that is older than 6 hours

  */

  require_once('database_request.php');

  $db = getDatabaseObject();

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
      $delete_statement->bindValue(':id',$row['id'],PDO::PARAM_STR);
      $delete_statement->execute();
    }
  }

?>