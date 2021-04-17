<!DOCTYPE html>

<html>

<head>
  <title>File Buy</title>
  <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>
  <meta content='utf-8' http-equiv='encoding'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv='X-UA-Compatible' content='IE=edge' /> <!-- Optimal Internet Explorer compatibility -->
  <link rel='stylesheet' type='text/css' href='../css/common.css'>
  <link rel='stylesheet' type='text/css' href='../css/commission/commission_index.css'>

  <link rel='icon' href='../favicon.ico?' type='image/x-icon'>
</head>

<body>
  <?php
    // Add side menu and header
    include_once('../php/view/header.php');
    include_once('../php/view/side_menu.php');
    include_once('../php/util.php');

    /* commission.php

      Fetches information for the commission via the supplied commission ID.

    */
    require_once('../php/database_request.php');

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

    $convertedArray = array(
      'commission_id' => $_GET['commission'],
      'steps' => $commission['steps'],
      'current' => $commission['current'],
      'email' => $commission['email'],
      'currentStep' => array(
        'preview' => unserialize($currentStep['preview']),
        'name' => $currentStep['name'],
        'title' => $currentStep['title'],
        'description' => $currentStep['description'],
        'price' => priceWithFee($currentStep['price']),
        'status' => $currentStep['status'],
      )
    );
    $json = json_encode($convertedArray);
  ?>

  <div class="content">
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
      <div class="preview-wrapper">
        <canvas id="preview">
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
      <button type="submit" class="form-button">
        <div id="submit-button-text">
          Confirm
        </div>
        <div id="progress-bar" class="invisible"></div>
      </button>
    </div>
    <div id="paypal-section" class="content-part invisible">
      <p>Buyer: Pay</p>
      <div id="paypal-button-container"></div>
    </div>
  </div>

  <script src='../js/util.js'></script>
  <script src='../js/preview.js'></script>
  <script src='../js/commission.js'></script>
  <script src='../js/requests.js'></script>
  <script src='../js/inputs.js'></script>
  <script src="https://www.paypal.com/sdk/js?client-id=AZA0KXJEtn8DBgcuU-2Ls_PwgiF18ihnbgIm1y9IQJ8_hOTNlqtEDo_95gSDTcsVeYtY9mC6_vUVimPJ&currency=USD" data-sdk-integration-source="button-factory"></script>
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
    document.querySelector('#file-upload-section > button').onclick = (event) => uploadCommissionFile(event, commissionID);

    const currentStep = commissionData['currentStep'];
    displayMilestone(current, numSteps, complete, currentStep, commissionID);
  </script>
</body>
<html>