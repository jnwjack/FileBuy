<!DOCTYPE html>

<html lang="en">

<head>
  <title>File Buy</title>
  <meta name="description" content="Sell digital files online">
  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
  <meta content="utf-8" http-equiv="encoding">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
  <link rel="stylesheet" type="text/css" href="../dist/listing_create.css">

  <link rel='icon' href='../favicon.ico?' type='image/x-icon'>
</head>

<body onload="defaultPreview('preview')">
  <!--Add side menu and header -->
  <?php
    include_once('../php/view/header.php');
    include_once('../php/view/side_menu.php');
  ?>
  <!--Cards-->
  <div id="result-card" class="card disabled">
    <p>
      Your Listing:
    </p>
    <p id="result-card-text"></p>
    <div class="button-row">
      <button type="button" class="card-button secondary" onclick="disableCard('result-card')">
        Close
      </button>
      <button id="copy-button" class="card-button" type="button" onclick="copyLink()">
        Copy
      </button>
    </div>
  </div>
  <?php
    include_once('../php/view/preview_card.php');
  ?>

  <!--Content-->
  <form id="main" class="content" onsubmit="createListing(event)">
    <div class="content-part">
      <?php
        include_once("../php/view/file_upload.php");
      ?>
    </div>
    <div class="content-part">
      <div class="price-wrapper">
        <input type="number" id="price" min="0" max="1000" step="0.01" placeholder="5.00" oninput="priceInputCallback(event)">
        <i>$</i>
      </div>
      <input id="email" type="email" placeholder="PayPal Email" />
      <input id="confirm" type="text" placeholder="Confirm Email" />
    </div>
    <div class="content-part">
      <div class="button-row">
        <button type="button" class="form-button secondary" onclick="activateCard('preview-card')">
          Show Preview
        </button>
        <button type="submit" class="form-button">
          <div class="submit-button-text">
            Post Listing
          </div>
          <div class="progress-bar invisible"></div>
        </button>
      </div>
    </div>
  </form>

  <script src="../dist/listing_create.js"></script>
</body>
</html>