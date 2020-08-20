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
</head>
    
<body>
  <div>Listing Page!</div>
  <div id='content'>
    <div class='h-stack align-center'>
      <div class='v-stack'>
        <div id='filename'>File Preview</div>
        <div id='preview-wrapper'>
          <canvas id='preview' width='120' height='120'>
            Preview
          </canvas>
        </div>
        <div id='price'>Price: $</div>
        <div id='seller-email'>Seller: </div>
      </div>
      <div id='paypal-button-container' class='justify-center'></div>
    </div>
  </div>
  <?php
    $username = "root";
    $password = "root";
    
    $db = new PDO('mysql:host=localhost;dbname=file_buy', $username, $password,
    array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

    $statement = $db->prepare('SELECT preview, email, price, id FROM listings WHERE id=:id');
    $statement->bindValue(':id',$_GET['listing'],PDO::PARAM_INT);
    $statement->execute();
    $row = $statement->fetch(PDO::FETCH_ASSOC);

    $convertedArray = array(
      'preview' => unserialize($row['preview']),
      'email' => $row['email'],
      'price' => $row['price'],
      'id' => $row['id']
    );
    $json = json_encode($convertedArray);
  ?>

  <script src='../js/util.js'></script>
  <script src='https://www.paypal.com/sdk/js?client-id=AZA0KXJEtn8DBgcuU-2Ls_PwgiF18ihnbgIm1y9IQJ8_hOTNlqtEDo_95gSDTcsVeYtY9mC6_vUVimPJ'></script>
  <script> 
    const listingData = <?php echo $json; ?>;
    let image = new Image();
    image.src = listingData['preview'];

    let canvas = document.getElementById('preview');
    let context = canvas.getContext('2d');
    image.onload = function () {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.className += 'blur';
    }

    document.getElementById('price').textContent += listingData['price'];
    document.getElementById('seller-email').textContent += listingData['email'];

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
          // This function shows a transaction success message to your buyer.
          alert('Transaction completed by ' + details.payer.name.given_name);
          let formData = new FormData();
          formData.append('listing', listingData['id']);
          formData.append('order', details.id);

          fetch('../php/download.php', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(result => {
            let link = document.createElement('a');
            link.download = 'download';
            link.href = result;
            link.click();
          })
          .catch(error => {
            console.error('Error:', error);
          });
        });
      }
    }).render('#paypal-button-container');
    //This function displays Smart Payment Buttons on your web page.
  </script>
</body>


</html>