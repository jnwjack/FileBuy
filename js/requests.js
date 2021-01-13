function createListing(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let confirm = document.getElementById("confirm").value;
  if(email !== confirm) {
    alert("Error: Email and Email Confirm must match");
    return false;
  }

  if(!isEmailAddress(email)) {
    alert("Error: Invalid Email");
    return false;
  }

  let price = document.getElementById("price").value;
  if(isNaN(price) || price === ""){
    alert("Error: Invalid Price");
    return false;
  }

  let file = document.getElementById("file").files[0];
  if(!file) {
    alert("Error: No File");
    return false;
  }
  let name = file.name;
  let size = file.size;

  // Handle Progress Bar Animation
  document.getElementById('submit-button-text').classList.toggle('disabled', true);
  document.getElementById('progress-bar').classList.toggle('invisible', false);

  let readerPromise = new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    }
    reader.readAsDataURL(file);
  });

  readerPromise.then(function(fileData) {
    //let previewPromise = savePreviewAsBlob();
    let previewb64 = savePreviewAsBase64();

    let formData = new FormData();
    formData.append("email", email);
    formData.append("price", price);
    formData.append("preview", previewb64);
    formData.append("file", fileData);
    formData.append("name", name);
    formData.append("size", size);

    fetch("php/submit.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      let currentUrl = document.location.href;
      let linkString = `${currentUrl}listing/` + JSON.stringify(result, null, 2)
      let form = document.getElementById('main');
      form.reset();

      // Turn off progress bar
      document.getElementById('submit-button-text').classList.toggle('disabled', false);
      document.getElementById('progress-bar').classList.toggle('invisible', true);

      defaultPreview();
      activateResultCard(linkString);
    })
    .catch(error => {
      console.error("Error:", error);

      // Turn off progress bar
      document.getElementById('submit-button-text').classList.toggle('disabled', false);
      document.getElementById('progress-bar').classList.toggle('invisible', true);
    });

    }, function(err) {
      console.log(err);
  });

  return true;
}

function requestDownload(listing, orderID, filename) {
  let formData = new FormData();
  formData.append('listing', listing);
  formData.append('order', orderID);

  fetch('../php/download.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    let link = document.createElement('a');
    link.download = filename || 'download';
    link.href = result;
    link.click();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}