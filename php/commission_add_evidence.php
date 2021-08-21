<?php

  /* commission_add_evidence.php

    Submit file to be used as evidence for a certain step in the
    commission. Up to 3 files can be used per step.

  */

  require('../vendor/autoload.php');
  use Ramsey\Uuid\Uuid;
  require_once('database_request.php');
  require_once('util.php');

  $commissionID = $_POST['commission'];
  $file = serialize($_POST['file']);
  $description = $_POST['description'];

  if(fileTooLarge($file)) {
    http_response_code(413);
    die('FAILURE: File too large');
  }

  $db = getDatabaseObject();

  $commissionStatement = $db->prepare('SELECT current, email, steps FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id', $commissionID, PDO::PARAM_STR);
  $successful = $commissionStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch commission');
  }
  $commissionStatementRow = $commissionStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepNumber = $commissionStatementRow['current'];
  $totalSteps = $commissionStatementRow['steps'];
  $email = $commissionStatementRow['email'];

  $stepStatement = $db->prepare('SELECT * FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $stepStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $stepStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $stepStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not fetch milestone');
  }
  $stepStatementRow = $stepStatement->fetch(PDO::FETCH_ASSOC);
  $currentStepEvidenceCount = $stepStatementRow['evidence_count'];
  $currentStepStatus = $stepStatementRow['status'];
  if($currentStepEvidenceCount >= 3) {
    http_response_code(500);
    die('FAILURE: No room for more evidence for this milestone');
  }
  // Can't add evidence if payment has already been made.
  if($currentStepStatus > 1) {
    http_response_code(500);
    die('FAILURE: Payment already made for this milestone');
  }

  if($currentStepStatus == 1) {
    // Delete file for that step and reset status to no 'payment, no file'
    $filename = "/opt/data/${commission_id}-${currentStepNumber}";
    if(!file_exists($filename) || !unlink($filename)) {
      http_response_code(500);
      die('FAILURE: Could not delete file for milestone');
    }

    $updateStatement = $db->prepare('UPDATE steps SET status=0 WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
    $updateStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
    $updateStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
    $successful = $updateStatement->execute();
    if(!$successful) {
      http_response_code(500);
      die('FAILURE: Could not edit milestone status');
    }
  }
  
  // We should use uuid's with evidence, because evidence will be getting reordered,
  // so we can't use the step number
  $uuid = Uuid::uuid4();
  $evidenceID = $uuid->toString();
  $newEvidenceCount = $currentStepEvidenceCount + 1;
  $fileWriteSuccessful = file_put_contents("/opt/data/${commissionID}-${currentStepNumber}-${evidenceID}", $file);
  if(!$fileWriteSuccessful) {
    http_response_code(500);
    die('FAILURE: Could not write file');
  }

  // Add new entry to evidence table
  $evidenceStatement = $db->prepare('INSERT INTO evidence(evidence_number, id, description, commission_id, step_number)
                        VALUES(:evidence_number, :id, :description, :commission_id, :step_number);');
  $evidenceStatement->bindValue(':evidence_number', $newEvidenceCount, PDO::PARAM_INT);
  $evidenceStatement->bindValue(':id', $evidenceID, PDO::PARAM_STR);
  $evidenceStatement->bindValue(':description', $description, PDO::PARAM_LOB);
  $evidenceStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $evidenceStatement->bindValue(':step_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $evidenceStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not add entry to evidence table');
  }

  // Update evidence count
  $updateStatement = $db->prepare('UPDATE steps SET evidence_count=:evidence_count WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
  $updateStatement->bindValue(':evidence_count', $newEvidenceCount, PDO::PARAM_INT);
  $updateStatement->bindValue(':commission_id', $commissionID, PDO::PARAM_STR);
  $updateStatement->bindValue(':sequence_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $updateStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not update new status of commission');
  }

  // Fetch file and encode it as json object
  $file = unserialize(file_get_contents("/opt/data/${commissionID}-${currentStepNumber}-${evidenceID}"));
  $returnData = array(
    'current' => $currentStepNumber,
    'commission' => $commissionID,
    'evidenceCount' => $newEvidenceCount,
    'newEvidence' => $file,
    'description' => $description
  );
  $jsonData = json_encode($returnData);

  echo $jsonData;

?>