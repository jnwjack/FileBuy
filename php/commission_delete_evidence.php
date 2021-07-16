<?php

  /* commission_delete_evidence.php

    Delete the file associated with the specified index at the specified step.
    Also delete the associated description.

  */

  require_once('database_request.php');

  $commissionID = $_POST['commission'];
  $evidenceNumber = $_POST['evidence'];

  if($evidenceNumber > 3 || $evidenceNumber < 1) {
    http_response_code(400);
    die('FAILURE: Evidence number out of range');
  }

  $db = getDatabaseObject();

  $fetchStatement = $db->prepare('SELECT s.sequence_number as sequence_number FROM steps as s INNER JOIN evidence as e ON s.commission_id = e.commission_id WHERE s.commission_id=:commission_id AND e.evidence_number=:evidence_number');
  $fetchStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $fetchStatement->bindValue(':evidence_number', $evidenceNumber, PDO::PARAM_INT);
  $successful = $fetchStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $fetchStatementRow = $fetchStatement->fetch(PDO::FETCH_ASSOC);

?>