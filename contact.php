<html lang="en">

<head>
  <title>File Buy</title>
  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
  <meta content="utf-8" http-equiv="encoding">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
  <link rel="stylesheet" type="text/css" href="dist/contact.css">

  <link rel='icon' href='favicon.ico?' type='image/x-icon'>
</head>

<body>
  <?php
    include_once('php/view/header.php');
    include_once('php/view/side_menu.php');
  ?>

  <form id="main" class="content" onsubmit="sendMessage(event)">
    <h2 class="content-part">Have a question? Contact us!</h2>
    <p class="content-part">
      If you are contacting us about a refund, please take a moment and read the relevant section on the "About" page first.
    </p>
    <div class="content-part">
      <input id="email" type="email" placeholder="Email">
      <textarea id="message" placeholder="Message"></textarea>
    </div>
    <div class="content-part">
      <button type="submit" class="form-button">
        <div class="submit-button-text">
          Send
        </div>
        <div class="progress-bar invisible"></div>
      </button>
    </div>
  </form>

  <script src="dist/contact.js"></script>
</body>

</html>