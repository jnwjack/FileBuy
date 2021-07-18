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

  $fetchStatement = $db->prepare('
        SELECT 
          steps.sequence_number AS sequence_number
          evidence.id AS evidence_id
        FROM commissions
        INNER JOIN steps ON steps.commission_id = commissions.id
        INNER JOIN evidence ON 
          steps.sequence_number = evidence.step_number AND 
          steps.commission_id = evidence.commission_id
        WHERE 
          steps.commission_id=:commission_id AND 
          evidence.evidence_number=:evidence_number');
  $fetchStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $fetchStatement->bindValue(':evidence_number', $evidenceNumber, PDO::PARAM_INT);
  $successful = $fetchStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $fetchStatementRow = $fetchStatement->fetch(PDO::FETCH_ASSOC);
  $evidenceID = $fetchStatementRow['evidence_id'];

  // Delete file
  $filename = "/opt/data/${commission_id}-${currentStepNumber}";
  if(!file_exists($filename) || !unlink($filename)) {
    http_response_code(500);
    die('FAILURE: Could not delete file for milestone');
  }  


  // Reorder evidence by decrementing evidence number for evidence entries that have a lower evidence number than the one we just deleted
  $updateStatement = $db->prepare('UPDATE evidence SET evidence_number = evidence_number - 1 WHERE commission_id=:commission_id AND evidence_number > :deleted_evidence_number');
  $updateStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $updateStatement->bindValue(':deleted_evidence_number', $evidenceNumber, PDO::PARAM_INT);
  $successful = $updateStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not edit evidence indices');
  }

  // Decrement evidence count

?>