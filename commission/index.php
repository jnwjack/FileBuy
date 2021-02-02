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

    $statement = $db->prepare('SELECT steps, current, email FROM commissions WHERE id=:id');
    $statement->bindValue(':id',$_GET['commission'],PDO::PARAM_INT);
    $statement->execute();
    $row = $statement->fetch(PDO::FETCH_ASSOC);

    if(!$row) {
      header('Location: /error');
      die();
    }

    $convertedArray = array(
      'steps' => $row['steps'],
      'current' => $row['current'],
      'email' => $row['email']
    );
    $json = json_encode($convertedArray);
  ?>

  <div class="content">
    <h2 class="content-part" id="title">
      Commission
    </h2>
    <div class="content-part" id="steps-bar">
    </div>
  </div>

  <script>
    /*

      Display the fetched commission information on the page

    */

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
    const current = commissionData['current'];
    const stepsBar = document.getElementById('steps-bar');
    stepsBar.appendChild(stepsBarFragment());
    for(let i = 0; i < numSteps; i++) {
      stepsBar.appendChild(stepsBarCircle(i === current - 1));
      stepsBar.appendChild(stepsBarFragment(i < current - 1));
    }

  </script>
</body>
<html>