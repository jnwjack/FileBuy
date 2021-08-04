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
          steps.evidence_count as evidence_count
          evidence.id AS evidence_id
        FROM commissions
        INNER JOIN steps ON 
          steps.commission_id = commissions.id AND
          steps.sequence_number = commissions.current
        INNER JOIN evidence ON 
          steps.sequence_number = evidence.step_number AND 
          steps.commission_id = evidence.commission_id
        WHERE 
          commissions.id=:commission_id AND 
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
  $currentStepNumber = $fetchStatementRow['sequence_number'];
  $evidenceCount = $fetchStatementRow['evidence_count'];

  if($evidenceCount > 3 || $evidenceCount < 1) {
    http_response_code(500);
    die('FAILURE: Current evidence count out of range');
  }

  // Delete file
  $filename = "/opt/data/${commissionID}-${currentStepNumber}-${evidenceID}";
  if(!file_exists($filename) || !unlink($filename)) {
    http_response_code(500);
    die('FAILURE: Could not delete file for milestone');
  }

  // Delete entry in evidence table
  $deleteStatement = $db->prepare('DELETE FROM evidence WHERE commission_id=:commission_id AND step_number=:step_number AND evidence_number=:evidence_number');
  $deleteStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $deleteStatement->bindValue(':step_number', $currentStepNumber, PDO::PARAM_INT);
  $deleteStatement->bindValue(':evidence_number', $evidenceNumber, PDO::PARAM_INT);
  $successful = $deleteStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE:Could not delete entry from evidence table');
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
  $updateStatement = $db->prepare('UPDATE steps SET evidence_count = evidence_count - 1 WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $updateStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $updateStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $updateStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not edit milestone evidence count');
  }

  // Return array of current evidence
  $evidenceArray = array();
  $fetchStatement = $db->prepare('SELECT evidence_number, description, id FROM evidence WHERE commission_id=:commission_id AND step_number=:step_number');
  $fetchStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $fetchStatement->bindValue(':step_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $fetchStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch evidence after deletion');
  }
  $fetchStatementRows = $fetchStatement->fetchAll(PDO::FETCH_ASSOC);
  foreach ($fetchStatementRows as $evidence) {
    $evidenceID = $evidence['id'];
    $evidenceFile = unserialize(file_get_contents("/opt/data/${commissionID}-${currentStepNumber}-${evidenceID}"));
    $evidenceObject = array(
      'evidenceNumber' => $evidence['evidence_number'],
      'description' => $evidence['description'],
      'file' => $evidenceFile
    );

    // Add evidence to array
    $evidenceArray[] = $evidenceObject;
  }

  $returnData = json_encode($evidenceArray);
  echo $returnData;
?>