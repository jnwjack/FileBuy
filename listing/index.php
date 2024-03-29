<!DOCTYPE html>

<html lang="en">

<head>
  <title>File Buy</title>
  <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>
  <meta content='utf-8' http-equiv='encoding'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <!-- Ensures optimal rendering on mobile devices. -->
  <meta http-equiv='X-UA-Compatible' content='IE=edge' /> <!-- Optimal Internet Explorer compatibility -->
  <link rel='stylesheet' type='text/css' href='../../dist/listing_index.css'>

  <link rel='icon' href='../favicon.ico?' type='image/x-icon'>
</head>
    
<body>
  <!--Add side menu, header, and card-->
  <?php
    include_once('../php/view/header.php');
    include_once('../php/view/side_menu.php');
    include_once('../php/view/explain_card.php');
  ?>
  <div class="content" id="main">
    <div class="content-part">
      <h2 id="file-header"></h2>
      <a id="explain-anchor" onclick="activateCard('explain-card')">Low quality?</a>
      <div class="preview-wrapper">
        <canvas id="preview">
          Preview
        </canvas>
      </div>
      <div class="subheader-row">
        <div id="seller-email"></div>
        <div id="size"></div>
      </div>
    </div>
    <div id="paypal-button-container" class="content-part">
    </div>
    <div id="download-button-container" class="content-part">
      <button id="download-button">Download</button>
    </div>
  </div>
  <?php
    /* listing.php

      Fetches information for the listing via the supplied listing ID.

    */

    require_once('../php/database_request.php');
    require_once('../php/util.php');
    $listing_id = $_GET['listing'];

    $db = getDatabaseObject();

    $statement = $db->prepare('SELECT preview, email, price, id, name, size, complete FROM listings WHERE id=:id');
    $statement->bindValue(':id',"$listing_id",PDO::PARAM_STR);
    $statement->execute();
    $row = $statement->fetch(PDO::FETCH_ASSOC);

    if(!$row) {
      // must be changed to actual url root later
      header('Location: ../404.php');
      die();
    }

    $convertedArray = array(
      'preview' => unserialize($row['preview']),
      'email' => $row['email'],
      'price' => priceWithFee($row['price']),
      'id' => $row['id'],
      'name' => $row['name'],
      'size' => $row['size'],
      'complete' => $row['complete']
    );
    $json = json_encode($convertedArray);
  ?>

  <script src='../dist/commission_index.js'></script>
  <script src="https://www.paypal.com/sdk/js?client-id=AWN4WQzmmUyUccqa8ZVYp1EmW3HP3AHCHZT3OnXzsiiqT87e2RAQTO7_EAkx-GeDgrHSK_iyDNfQK2sV&currency=USD" data-sdk-integration-source="button-factory"></script>
  <script>
    /* 

      Display the fetched listing information on the page

    */
  
    const listingData = <?php echo $json ?>;
    if(listingData['preview']) {
      setCanvasImageFromBase64(listingData['preview'], 'preview');
    } else {
      defaultPreview('preview');
    }

    //document.getElementById('price').textContent += listingData['price'];
    document.getElementById('seller-email').textContent += `Listed By: ${truncateString(listingData['email'], 15)}`;
    //document.getElementById('filename').textContent = listingData['name'];
    document.getElementById('file-header').textContent = `${truncateString(listingData['name'], 15)} - $${formatPrice(listingData['price'])}`;
    document.getElementById('size').textContent = `File Size: ${formatBytes(listingData['size'])}`;

    if(!listingData['complete']) {
      document.getElementById('download-button-container').className = 'invisible';

      paypal.Buttons({
        createOrder: async function(data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          let formData = new FormData();
          formData.append('listing', listingData['id']);
          const response = await fetch('../php/order.php', {
            method: 'POST',
            body: formData
          });
          const orderId = await response.text();

          return orderId;
        },
        onApprove: function(data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function(details) {
            requestDownload(listingData['id'], details.id, listingData['name']);
          });
        }
      }).render('#paypal-button-container');
    } else {
      document.getElementById('download-button').onclick = () => requestDownload(listingData['id'], '0', listingData['name']);
      document.getElementById('paypal-button-container').className = 'invisible';
    }

    //This function displays Smart Payment Buttons on your web page.
  </script>
</body>


</html>
