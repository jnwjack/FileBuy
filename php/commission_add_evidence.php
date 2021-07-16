<?php

  /* commission_add_evidence.php

    Submit file to be used as evidence for a certain step in the
    commission. Up to 3 files can be used per step.

  */

  require_once('database_request.php');
  require_once('util.php');

  $commission_id = $_POST['commission'];
  $file = serialize($_POST['file']);
  $description = $_POST['description'];

  if(fileTooLarge($file)) {
    http_response_code(413);
    die('FAILURE: File too large');
  }

  $db = getDatabaseObject();

  $commissionStatement = $db->prepare('SELECT current, email, steps FROM commissions WHERE id=:id');
  $commissionStatement->bindValue(':id', $commission_id, PDO::PARAM_STR);
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
  $stepStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
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

  $newEvidenceCount = $currentStepEvidenceCount + 1;
  $fileWriteSuccessful = file_put_contents("/opt/data/${commission_id}-${currentStepNumber}-e${newEvidenceCount}", $file);
  if(!$fileWriteSuccessful) {
    http_response_code(500);
    die('FAILURE: Could not write file');
  }

  // Add new entry to evidence table
  $evidenceStatement = $db->prepare('INSERT INTO evidence(index, description, commission_id, step_number)
                        VALUES(:evidence_number, :description, :commission_id, :step_number');
  $evidenceStatement->bindValue(':evidence_number', $newEvidenceCount, PDO::PARAM_INT);
  $evidenceStatement->bindValue(':description', $description, PDO::PARAM_LOB);
  $evidenceStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
  $evidenceStatement->bindValue(':step_number', $currentStepNumber, PDO::PARAM_INT);
  $successful = $evidenceStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not add entry to evidence table');
  }

  // Update evidence count
  $updateStatement = $db->prepare('UPDATE steps SET evidence_count=:evidence_count');
  $updateStatement->bindValue(':evidence_count', $newEvidenceCount, PDO::PARAM_INT);
  $successful = $updateStatement->execute();
  if(!$successful) {
    http_response_code(500);
    die('FAILURE: Could not update new status of commission');
  }

  // Fetch file and encode it as json object
  $file = unserialize(file_get_contents("/opt/data/$commissionID-$stepNumber-e${newEvidenceCount}"));
  $returnData = array(
    'current' => $currentStepNumber,
    'commission' => $commission_id,
    'evidenceCount' => $newEvidenceCount,
    'newEvidence' => $file
  );
  $jsonData = json_encode($returnData);

  echo $jsonData;

?>