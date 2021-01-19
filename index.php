

<html>

<head>
  <title>File Buy</title>
  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
  <meta content="utf-8" http-equiv="encoding">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
  <link rel="stylesheet" type="text/css" href="css/index.css">
  <link rel="stylesheet" type="text/css" href="css/common.css">

  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200&display=swap" rel="stylesheet">

  <link rel='icon' href='favicon.ico?' type='image/x-icon'>
</head>

<body onload="defaultPreview()">
  <!--Add side menu and header -->
  <?php
    include_once('php/view/header.php');
    include_once('php/view/side_menu.php');
  ?>
  <!--Cards-->
  <div id="result-card" class="card disabled">
    <p>
      Your Link Is:
    </p>
    <p id="result-card-text"></p>
    <div class="button-row">
      <button id="copy-button" class="card-button" type="button" onclick="copyLink()">
        Copy
      </button>
      <button type="button" class="card-button" onclick="disableCard('result-card')">
        Close
      </button>
    </div>
  </div>
  <div id="preview-card" class="card disabled">
    <div class="preview-wrapper">
      <canvas id="preview">
        Preview
      </canvas>
    </div>
    <button type="button" class="card-button" onclick="disableCard('preview-card')">
      Close
    </button>
  </div>

  <!--Content-->
  <form id="main" class="content" onsubmit="createListing(event)">
    <div id="file-button-wrapper" class="content-part" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)" ondragenter="dragEnterHandler(event)" ondragleave="dragLeaveHandler(event)">
      <input type="file" id="file" class="file-button hoverable" accept="image/*" onchange="selectHandler(this)"/>
      <label for="file">
        <object id="upload-svg" data="images/upload.svg"></object>
        Choose a file
      </label>
    </div>
    <div class="content-part">
      <div class="price-wrapper">
        <input type="number" id="price" min="0" max="10000" step="0.01" placeholder="5.00">
        <i>$</i>
      </div>
      <input id="email" type="text" placeholder="PayPal Email" />
      <input id="confirm" type="text" placeholder="Confirm Email" />
    </div>
    <div class="content-part">
      <div class="button-row">
        <button type="button" class="form-button" onclick="activateCard('preview-card')">
          Show Preview
        </button>
        <button type="submit" class="form-button">
          <div id="submit-button-text">
            Post Listing
          </div>
          <div id="progress-bar" class="invisible"></div>
        </button>
      </div>
    </div>
  </div>

  <script src="js/preview.js"></script>
  <script src="js/filedrop.js"></script>
  <script src="js/util.js"></script>
  <script src="js/requests.js"></script>
  <script src="js/card.js"></script>
</body>
</html>