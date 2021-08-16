<!DOCTYPE html>

<html lang="en">

<head>
  <title>File Buy</title>
  <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>
  <meta content='utf-8' http-equiv='encoding'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv='X-UA-Compatible' content='IE=edge' /> <!-- Optimal Internet Explorer compatibility -->
  <link rel='stylesheet' type='text/css' href='../dist/commission_index.css'>

  <link rel='icon' href='../favicon.ico?' type='image/x-icon'>
</head>

<body onload="defaultPreview()">
  <?php
    // Add side menu and header
    include_once('../php/view/header.php');
    include_once('../php/view/side_menu.php');
    include_once('../php/view/preview_card.php');
    include_once('../php/view/explain_card.php');

    /* commission.php

      Fetches information for the commission via the supplied commission ID.

    */
    require_once('../php/database_request.php');
    require_once('../php/util.php');

    $commission_id = $_GET['commission'];

    $db = getDatabaseObject();

    $commissionStatement = $db->prepare('SELECT steps, current, email FROM commissions WHERE id=:id');
    $commissionStatement->bindValue(':id', "$commission_id", PDO::PARAM_STR);
    $commissionStatement->execute();
    $commission = $commissionStatement->fetch(PDO::FETCH_ASSOC);

    if(!$commission) {
      header('Location: /error');
      die();
    }

    $db = getDatabaseObject();

    $currentStepStatement = $db->prepare('SELECT preview, name, title, description, price, status FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
    $currentStepStatement->bindValue(':commission_id', "$commission_id", PDO::PARAM_STR);
    $currentStepStatement->bindValue(':sequence_number', $commission['current'], PDO::PARAM_INT);
    $currentStepStatement->execute();
    $currentStep = $currentStepStatement->fetch(PDO::FETCH_ASSOC);

    if(!$currentStep) {
      header('Location: /error');
      die();
    }

    // Fetch evidence for this step
    $evidenceStatement = $db->prepare('SELECT * FROM evidence WHERE commission_id=:commission_id AND step_number=:step_number');
    $evidenceStatement->bindValue(':commission_id', $commission_id, PDO::PARAM_STR);
    $evidenceStatement->bindValue(':sequence_number', $commission['current'], PDO::PARAM_INT);
    $successful = $evidenceStatement->execute();
    if(!$successful) {
      http_response_code(500);
      die('FAILURE: Could not fetch evidence for milestone');
    }
    $evidenceStatementRows = $evidenceStatement->fetchAll(PDO::FETCH_ASSOC);

    $evidenceArray = array();
    foreach ($evidenceStatementRows as $evidence) {
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

    $convertedArray = array(
      'commission_id' => $_GET['commission'],
      'steps' => $commission['steps'],
      'current' => $commission['current'],
      'email' => $commission['email'],
      'currentStep' => array(
        'preview' => unserialize($currentStep['preview']),
        'title' => $currentStep['title'],
        'description' => $currentStep['description'],
        'price' => priceWithFee($currentStep['price']),
        'status' => $currentStep['status'],
        'evidence' => $evidenceArray
      )
    );
    $json = json_encode($convertedArray);
  ?>

  <div class="content" id="main">
    <h2 class="content-part" id="title">
      Commission
    </h2>
    <div class="content-part" id="steps-bar">
    </div>
    <h3 id="current-step-title" class="content-part">
      Could not display milestone information.
    </h3>
    <p id="current-step-description" class="content-part"></p>
    <div id="preview-section" class="content-part invisible">
      <p class="text-complete">Seller: Upload File - Complete</p>
      <a id="explain-anchor" onclick="activateCard('explain-card')">Low quality?</a>
      <div class="preview-wrapper">
        <canvas id="uploaded-file">
          Preview
        </canvas>
      </div>
      <button id="download-button">
        Download
      </button>
    </div>
    <div id="file-upload-section" class="content-part invisible">
      <p>Seller: Upload File</p>
      <?php 
        include_once('../php/view/file_upload.php');
      ?>
      <div class="button-row">
        <button class="form-button" onclick="activateCard('preview-card')">
          Show Preview
        </button>
        <button type="submit" class="form-button">
          <div id="submit-button-text">
            Confirm
          </div>
          <div id="progress-bar" class="invisible"></div>
        </button>
      </div>
    </div>
    <div id="paypal-section" class="content-part invisible">
      <p>Buyer: Pay</p>
      <div id="paypal-button-container"></div>
    </div>
    <p id="paypal-section-complete" class="content-part text-complete invisible">Buyer: Pay - Complete</p>
    <div class="content-part">
      <p>Add Evidence</p>
      <div class="evidence-box">
      </div>
    </div>
  </div>

  <script src="../dist/commission_index.js"></script>
  <script src="https://www.paypal.com/sdk/js?client-id=AWN4WQzmmUyUccqa8ZVYp1EmW3HP3AHCHZT3OnXzsiiqT87e2RAQTO7_EAkx-GeDgrHSK_iyDNfQK2sV&currency=USD" data-sdk-integration-source="button-factory"></script>
  <script>
    /*

      Display the fetched commission information on the page

    */

    const commissionData = <?php echo $json; ?>;
    const numSteps = commissionData['steps'];
    const commissionID = commissionData['commission_id'];
    // Figure out how to store this complete variable later
    const complete = false;
    const email = commissionData['email'];
    const current = commissionData['current'];

    document.querySelector('#title').textContent = `Commission by ${email}`;
    document.querySelector('#file-upload-section > .button-row > button[type="submit"]').onclick = (event) => uploadCommissionFile(event, commissionID);

    const currentStep = commissionData['currentStep'];
    displayMilestone(current, numSteps, complete, currentStep, commissionID);
  </script>
</body>
<html>