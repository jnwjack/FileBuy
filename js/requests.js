/* createCommission(event)

  Call backend and create commission and associated steps

*/
function createCommission(event) {
  event.preventDefault();

  let email = document.getElementById('email').value;
  let confirm = document.getElementById('confirm').value;

  if(!validateEmail(email, confirm)) {
    return false;
  }

  let numSteps = parseInt(document.getElementById('checkpoints').value);
  if(isNaN(numSteps) || numSteps < 0 || numSteps > 4) {
    return false;
  }

  let steps = [];
  for(let i = 1; i <= numSteps; i++) {
    let price = document.getElementById(`step${i}-price`).value;
    if(isNaN(price) || price === '') {
      alert('Error: Invalid Price');
      return false;
    }

    let title = document.getElementsByName(`step${i}`)[0].value;
    let description = document.getElementById(`step${i}-description`).value;
    steps.push({
      title: title,
      price: price,
      description: description,
    });
  }

  toggleButtonProgressBar(true);

  const commissionObject = {
    numSteps: numSteps,
    email: email,
    steps: steps
  };
  const formData = JSON.stringify(commissionObject);

  fetch('../php/create_commission.php', {
    method: 'POST',
    body: formData,
    header: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(result => {
    let commissionID = removeQuotes(result);
    let form = document.querySelector('.content');
    form.reset();
    let output = document.getElementById('checkpoints-output');
    output.textContent = 1;
    let currentUrlRoot = extractURLRoot(document.location.href);
    let linkString = `${currentUrlRoot}/commission/${commissionID}`;

    toggleButtonProgressBar(false);

    activateResultCard(linkString);
  })
  .catch(error => {
    toggleButtonProgressBar(false);

    console.error('Error:', error);
  })
}

/* createListing(event)

  Call backend to create listing for single-purchase file.

*/
function createListing(event) {
  event.preventDefault();

  let email = document.getElementById('email').value;
  let confirm = document.getElementById('confirm').value;
  if(!validateEmail(email, confirm)) {
    return false;
  }

  let price = document.getElementById('price').value;
  if(isNaN(price) || price === ''){
    alert('Error: Invalid Price');
    return false;
  }

  let file = document.getElementById('file').files[0];
  if(!file) {
    alert('Error: No File');
    return false;
  }
  let name = file.name;
  let size = file.size;

  // Handle Progress Bar Animation
  toggleButtonProgressBar(true);

  let readerPromise = new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    }
    reader.readAsDataURL(file);
  });

  readerPromise.then(function(fileData) {
    let previewb64 = savePreviewAsBase64();

    let formData = new FormData();
    formData.append('email', email);
    formData.append('price', price);
    formData.append('preview', previewb64);
    formData.append('file', fileData);
    formData.append('name', name);
    formData.append('size', size);

    fetch('php/submit.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(result => {
      let listingID = removeQuotes(result);
      let currentUrl = document.location.href;
      let linkString = `${currentUrl}listing/${listingID}`;
      let form = document.getElementById('main');
      form.reset();

      // Turn off progress bar
      toggleButtonProgressBar(false);

      defaultPreview();
      activateResultCard(linkString);
    })
    .catch(error => {
      console.error('Error:', error);

      // Turn off progress bar
      toggleButtonProgressBar(false);
    });

    }, function(err) {
      console.error(err);
  });

  return true;
}

/* requestDownload(listing, orderID, filename)

  Request file from backend and download file

*/
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

/* requestCommissionDownload(commission, step)

  Fetch file from backend for specified commission and step

*/

function requestCommissionDownload(commission, step, filename) {
  fetch(`../php/commission_download.php?commission=${commission}&step=${step}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if(response.status != 200) {
      throw new Error(`Status code: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    let link = document.createElement('a');
    link.download = filename || 'download';
    link.href = json;
    link.click();
  })
  .catch(error => {
    console.error('Error:', error);
  })
}

// Combine this and the above function
async function completeCommissionPayment(commission, orderID, filename) {
  let formData = new FormData();
  formData.append('commission', commission);
  formData.append('order', orderID);

  return new Promise(resolve => {fetch('../php/commission_pay.php', {
      method:'POST',
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
}

/* uploadCommissionFile(event)

  Upload file for current step in commission.

*/
function uploadCommissionFile(event, commissionID) {
  event.preventDefault();

  let file = document.getElementById('file').files[0];
  if(!file) {
    alert('Error: No File');
    return false;
  }

  toggleButtonProgressBar(true);

  let readerPromise = new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    }
    reader.readAsDataURL(file);
  });

  readerPromise.then(function(fileData) {
    let previewb64 = savePreviewAsBase64();

    let formData = new FormData();
    formData.append('preview', previewb64);
    formData.append('file', fileData);
    formData.append('commission', commissionID);

    fetch('../php/commission_file_upload.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(state => {
      toggleButtonProgressBar(false);

      // Clear preview card
      defaultPreview();
      
      updateProgressBar(state['current'], state['stepNumber']);
      updateMilestoneSectionVisibilityAndText(state['currentStep']);
      setCircleCallbacks(state['stepNumber'], state['current']);
    });
  })
  .catch(error => {
    toggleButtonProgressBar(false);

    console.error('Error:', error);
  })
}

/* sendMessage(event)

  Send message to site owner via Contact page

*/

function sendMessage(event) {
  event.preventDefault();

  let email = document.querySelector('#email').value;
  let message = document.querySelector('#message').value;

  if(!isEmailAddress(email)) {
    alert('Enter a valid email');
    return false;
  }
  
  if(message === '') {
    alert('Message body empty');
    return false;
  }

  toggleButtonProgressBar(true);

  let formData = new FormData();
  formData.append('email', email);
  formData.append('message', message);

  fetch('../php/send_message.php', {
    method: 'POST',
    body: formData,
    header: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    let form = document.querySelector('#main');
    form.reset();
    toggleButtonProgressBar(false);
  })
  .error(error => {
    toggleButtonProgressBar(false);
    
    console.error('Error: ', error);
  })
}

/* fetchCommissionStep(commission, step)

  Fetch data for a specified step for a commission

*/
async function fetchCommissionStep(commission, step) {
  return new Promise(resolve => {fetch(`../php/commission_fetch_step.php?commission=${commission}&step=${step}`, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if(response.status !== 200) {
        throw new Error(`Status code: ${response.status}`);
      }
      resolve(response.json());
    })
    .then(json => json)
    .catch(error => {
      console.error('Error', error);
    })
  });
}