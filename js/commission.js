function onSliderChange() {
  const steps = document.getElementsByClassName('step');
  const numSteps = parseInt(document.getElementById('checkpoints').value);

  let totalPossibleSteps = 4;
  let i = 0;
  while(i < totalPossibleSteps) {
    if(i < numSteps) {
      steps[i].classList.toggle('invisible', false);
    } else {
      steps[i].classList.toggle('invisible', true);
    }

    i++;
  }
}

function onSliderInput() {
  const checkpointSlider = document.getElementById('checkpoints');
  const output = document.getElementById('checkpoints-output');
  output.textContent = checkpointSlider.value;
}

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

function displayMilestone(current, numSteps, complete, currentStep, commissionID) {
  console.log(current, numSteps);
  const stepsBar = document.getElementById('steps-bar');
  
  stepsBar.appendChild(stepsBarFragment());
  for(let i = 0; i < numSteps; i++) {
    stepsBar.appendChild(stepsBarCircle(i === current - 1));
    stepsBar.appendChild(stepsBarFragment(i < current - 1 || complete));
  }

  const title = currentStep['title'];
  const price = currentStep['price'];
  const description = currentStep['description'];
  const preview = currentStep['preview'];
  const status = currentStep['status'];

  document.getElementById('current-step-title').textContent = `${title} - $${price}`;
  document.getElementById('current-step-description').textContent = description;

  /* Status codes:
    0 - no payment, no file uploaded
    1 - no payment, file uploaded
    2 - payment, no file uploaded
    3 - payment, file uploaded (complete)
  */

  // Check if file is uploaded
  let previewSection = document.querySelector('#preview-section');
  let fileUpload = document.querySelector('#file-upload-section');
  if(status % 2 !== 0) {
    console.log('file uploaded');
    // file is uploaded
    previewSection.classList.toggle('invisible', false);
    fileUpload.classList.toggle('invisible', true);
    if(preview) {
      // Set canvas data to preview
      setCanvasImageFromBase64(preview);
    } else {
      // Default preview
      generatePreview(null);
    }
  } else {
    // file is not uploaded
    previewSection.classList.toggle('invisible', true);
    fileUpload.classList.toggle('invisible', false);

    // Display PayPal Buttons
  }

  // Check if payment made
  if(status < 2) {
    console.log('no payment');
    document.getElementById('paypal-section').classList.toggle('invisible', false);
    paypal.Buttons({
      createOrder: async function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        let formData = new FormData();
        formData.append('commission', commissionID);
        const response = await fetch('../php/commission_order.php', {
          method: 'POST',
          body: formData
        });
        const orderId = await response.text();

        return orderId;
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          //requestDownload(listingData['id'], details.id, listingData['name']);
          completeCommissionPayment(commissionID, details.id, 'filename');
        });
      }
    }).render('#paypal-button-container');
  } else {
    document.getElementById('paypal-section').classList.toggle('invisible', true);
    console.log('payment');
  }
  //generatePreview(preview);
}