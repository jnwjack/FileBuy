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
  <link rel='stylesheet' type='text/css' href='../css/commission/index.css'>

  <link rel='icon' href='../favicon.ico?' type='image/x-icon'>
</head>

<body>
  <?php
    // Add side menu and header
    include_once('../php/view/header.php');
    include_once('../php/view/side_menu.php');

    /* commission.php

      Fetches information for the commission via the supplied commission ID.

    */
    require_once('../php/database_request.php');

    $db = getDatabaseObject();

    $commissionStatement = $db->prepare('SELECT steps, current, email FROM commissions WHERE id=:id');
    $commissionStatement->bindValue(':id', $_GET['commission'], PDO::PARAM_INT);
    $commissionStatement->execute();
    $commission = $commissionStatement->fetch(PDO::FETCH_ASSOC);

    if(!$commission) {
      header('Location: /error');
      die();
    }

    $db = getDatabaseObject();

    $currentStepStatement = $db->prepare('SELECT preview, name, title, description, price FROM steps WHERE commission_id=:commission_id AND sequence_number=:sequence_number');
    $currentStepStatement->bindValue(':commission_id', $_GET['commission'], PDO::PARAM_INT);
    $currentStepStatement->bindValue(':sequence_number', $commission['current'], PDO::PARAM_INT);
    $currentStepStatement->execute();
    $currentStep = $currentStepStatement->fetch(PDO::FETCH_ASSOC);

    if(!$currentStep) {
      header('Location: /error');
      die();
    }

    $convertedArray = array(
      'steps' => $commission['steps'],
      'current' => $commission['current'],
      'email' => $commission['email'],
      'currentStep' => array(
        'preview' => $currentStep['preview'],
        'name' => $currentStep['name'],
        'title' => $currentStep['title'],
        'description' => $currentStep['description'],
        'price' => $currentStep['price']
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
    <div class="preview-wrapper invisible">
      <canvas id="preview">
        Preview
      </canvas>
    </div>
    <div id="file-upload-section" class="content-part">
      <?php 
        include_once('../php/view/file_upload.php');
      ?>
      <button type="submit">
        Confirm
      </button>
    </div>
  </div>

  <script src='../js/preview.js'></script>
  <script>
    /*

      Display the fetched commission information on the page

    */

    // Generate progress bar
    function stepsBarFragment(isCompleted) {
      const stepsBarFragment = document.createElement('div');
      stepsBarFragment.className = 'steps-bar-fragment';
      stepsBarFragment.classList.toggle('completed', isCompleted);
      
      return stepsBarFragment;
    }

    function stepsBarCircle(isCurrent) {
      const stepsBarCircleWrapper = document.createElement('div');
      stepsBarCircleWrapper.className = 'steps-bar-circle-wrapper';
      const stepsBarCircle = document.createElement('div');
      stepsBarCircle.className = 'steps-bar-circle';
      stepsBarCircle.classList.toggle('current', isCurrent);
      stepsBarCircleWrapper.appendChild(stepsBarCircle);

      return stepsBarCircleWrapper;
    }

    const commissionData = <?php echo $json; ?>;
    const numSteps = commissionData['steps'];
    // Figure out how to store this complete variable later
    const complete = false;
    const current = commissionData['current'];
    const stepsBar = document.getElementById('steps-bar');
    stepsBar.appendChild(stepsBarFragment());
    for(let i = 0; i < numSteps; i++) {
      stepsBar.appendChild(stepsBarCircle(i === current - 1));
      stepsBar.appendChild(stepsBarFragment(i < current - 1 || complete));
    }

    // Display current step
    const title = commissionData['currentStep']['title'];
    const price = commissionData['currentStep']['price'];
    const description = commissionData['currentStep']['description'];
    const preview = commissionData['currentStep']['preview'];
    document.getElementById('current-step-title').textContent = `${title} - $${price}`;
    document.getElementById('current-step-description').textContent = description;
    generatePreview(preview);

  </script>
</body>
<html>