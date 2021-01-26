<!DOCTYPE html>

<html>

<head>
  <title>File Buy</title>
  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
  <meta content="utf-8" http-equiv="encoding">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
  <link rel="stylesheet" type="text/css" href="../css/common.css">
  <link rel="stylesheet" type="text/css" href="../css/commission.css">

  <link rel="icon" href="../favicon.ico?" type="image/x-icon">
</head>

<body onload="onSliderChange()">
  <?php
    include_once('php/view/header.php');
    include_once('php/view/side_menu.php');
  ?>

  <form class="content" onsubmit="createCommission(event)">
    <h2 class="content-part">
      Create a new commission
    </h2>
    <div class="content-part">
      <input id="email" type="text" placeholder="PayPal Email" />
      <input id="confirm" type="text" placeholder="Confirm Email" />
    </div>
    <div id="slider" class="content-part">
      <label for="checkpoints">Number of steps in commission</label>
      <div class="slider-wrapper">
        <input type="range" id="checkpoints" name="checkpoints" min="1" max="4" step="1" value="1" oninput="onSliderInput()" onchange="onSliderChange()">
        <output id="checkpoints-output" for="checkpoints">1</output>
      </div>
    </div>
    <div class="step content-part">
      <label for="step1">Step One</label>
      <input type="text" name="step1" placeholder="Title of Step" />
      <div class="price-wrapper">
        <input type="number" id="step1-price" min="0" max="10000" step="0.01" placeholder="5.00">
        <i>$</i>
      </div>
      <textarea id="step1-description" placeholder="Enter a description for the file that will be uploaded for this step."></textarea>
    </div>
    <div class="step content-part">
      <label for="step2">Step Two</label>
      <input type="text" name="step2" placeholder="Title of Step" />
      <div class="price-wrapper">
        <input type="number" id="step2-price" min="0" max="10000" step="0.01" placeholder="5.00">
        <i>$</i>
      </div>
      <textarea id="step2-description" placeholder="Enter a description for the file that will be uploaded for this step."></textarea>
    </div>
    <div class="step content-part">
      <label for="step3">Step Three</label>
      <input type="text" name="step3" placeholder="Title of Step" />
      <div class="price-wrapper">
        <input type="number" id="step3-price" min="0" max="10000" step="0.01" placeholder="5.00">
        <i>$</i>
      </div>
      <textarea id="step3-description" placeholder="Enter a description for the file that will be uploaded for this step."></textarea>
    </div>
    <div class="step content-part">
      <label for="step4">Step Four</label>
      <input type="text" name="step4" placeholder="Title of Step" />
      <div class="price-wrapper">
        <input type="number" id="step4-price" min="0" max="10000" step="0.01" placeholder="5.00">
        <i>$</i>
      </div>
      <textarea id="step4-description" placeholder="Enter a description for the file that will be uploaded for this step."></textarea>
    </div>
    <div class="content-part">
      <button type="submit" class="form-button">
        Start Commission
      </button>
    </div>
  </form>

  <script src="../js/commission.js"></script>
  <script src="../js/requests.js"></script>
  <script src="../js/util.js"></script>
</body>

</html>