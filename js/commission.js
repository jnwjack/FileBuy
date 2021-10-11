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

function updatePreview(status, preview=null) {
    // Check if file is uploaded
    let previewSection = document.querySelector('#preview-section');
    let fileUpload = document.querySelector('#file-upload-section');
    if(status % 2 !== 0) {
      // file is uploaded
      previewSection.classList.toggle('invisible', false);
      fileUpload.classList.toggle('invisible', true);
      if(preview) {
        // Set canvas data to preview
        setCanvasImageFromBase64(preview, 'uploaded-file');
      } else {
        // Default preview
        generatePreview(null);
      }
    } else {
      // file is not uploaded
      previewSection.classList.toggle('invisible', true);
      fileUpload.classList.toggle('invisible', false);
    }
}

function updateMilestoneSectionVisibilityAndText(currentStep) {
  const title = currentStep['title'];
  const price = currentStep['price'];
  const description = currentStep['description'];
  const preview = currentStep['preview'];
  const status = currentStep['status'];

  // Display title and description of step
  document.getElementById('current-step-title').textContent = `${title} - $${formatPrice(price)}`;
  document.getElementById('current-step-description').textContent = description;

    /* Status codes:
    0 - no payment, no file uploaded
    1 - no payment, file uploaded
    2 - payment, no file uploaded
    3 - payment, file uploaded (complete)
  */

  // Check if file is uploaded
  updatePreview(status, preview);

  // If payment has not been made
  if(status < 2) {
    // Enable PayPal Section
    document.querySelector('#paypal-section').classList.toggle('invisible', false);
    // Disable download button
    document.querySelector('#download-button').classList.toggle('invisible', true);
    // Disable completed text
    document.querySelector('#paypal-section-complete').classList.toggle('invisible', true);

  } else {
    // Disable PayPal section
    document.querySelector('#paypal-section').classList.toggle('invisible', true);
    // Enable download button
    document.querySelector('#download-button').classList.toggle('invisible', false);
    // Enable completed text
    document.querySelector('#paypal-section-complete').classList.toggle('invisible', false);
  }
}

function updateProgressBar(currentStep, selectedStep) {
  // Remove the currently completed fragment bars because we want these bars and the new one to be synced
  const numSteps = document.querySelectorAll('.steps-bar-circle').length;
  const stepsBar = document.querySelector('#steps-bar');
  while(stepsBar.firstElementChild) {
    stepsBar.firstElementChild.remove();
  }

  stepsBar.appendChild(stepsBarFragment(true));

  for(let i = 0; i < numSteps; i++) {
    let circleWrapper = stepsBarCircle(i === selectedStep - 1);
    stepsBar.appendChild(circleWrapper);
    stepsBar.appendChild(stepsBarFragment(i < currentStep - 1));
  }

  // Set onclick functions for circles. Must be done dynamically and updated with any change in the
  // state of the commission. This is because the callbacks are dependent upon the current step number
  setCircleCallbacks(current, current);

  const circles = document.querySelectorAll('.steps-bar-circle');
  // Get the circle that should be marked as current
  const currentCircle = circles[selectedStep - 1];
  // If this circle is not already current, that means the previous one is. Unmark that one
  // as current.
  if(!currentCircle.classList.contains('current')) {
    const previousCircle = circles[selectedStep - 2];
    previousCircle.classList.toggle('current', false);
  }
  currentCircle.classList.toggle('current', true);
}

function setCircleAsCurrent(newStep) {
  const currentCircle = document.querySelector('.steps-bar-circle.current');
  const newCurrentCircle = document.querySelectorAll('.steps-bar-circle')[newStep - 1];

  currentCircle.classList.toggle('current', false);
  newCurrentCircle.classList.toggle('current', true);
}

function circleCallback(index, current, maxStep) {
  return async () => {
    if(index >= maxStep || index === current - 1) {
      return;
    }

    // Fetch and display that circle's step
    let jsonData = await fetchCommissionStep(commissionID, index + 1);
    setCircleAsCurrent(jsonData['stepNumber']);
    updateMilestoneSectionVisibilityAndText(jsonData['step']);

    // Update evidence slots
    const evidenceArray = jsonData['step']['evidence'];
    for(let i = 0; i < 3; i++) {
      // Image data is null if the evidence slot is empty
      let imageData = i < evidenceArray.length ? evidenceArray[i]['file'] : null;
      updateEvidenceSlot(imageData, i + 1, evidenceArray.length, jsonData['step']['status'], commissionID);
    }

    // Set download button callback
    const downloadButton = document.querySelector('#download-button');
    downloadButton.onclick = () => requestCommissionDownload(jsonData['commission'], index + 1, jsonData['step']['title']);

    // Adjust callbacks on circles to reflect new current step
    const circles = document.querySelectorAll('.steps-bar-circle');
    for(let i = 0; i <= maxStep - 1; i++) {
      circles[i].onclick = circleCallback(i, jsonData['stepNumber'], jsonData['current']);
    }
  }
}

function setCircleCallbacks(currentStepNumber, maxStepNumber) {
  const circles = document.querySelectorAll('.steps-bar-circle');
  for(let i = 0; i < maxStepNumber; i++) {
    const circle = circles[i];
    circle.onclick = circleCallback(i, currentStepNumber, maxStepNumber);
  }
}

/* createEvidenceSlots()

  Create DOM elements that we'll use for evidence

*/
function createEvidenceSlots() {
  const evidenceBox = document.querySelector('.evidence-box');
  // Create 3 slots
  for(let i = 0; i < 3; i++) {
    let evidenceSlotContainer = document.createElement('div');
    evidenceSlotContainer.classList.toggle('evidence-slot-container', true);

    let evidenceSlot = document.createElement('div');
    evidenceSlot.classList.toggle('evidence-slot', true);

    evidenceSlotContainer.dataset.index = i + 1;

    let evidenceButtonContainer = document.createElement('div');
    evidenceButtonContainer.classList.toggle('evidence-button-container');

    let evidenceButton = document.createElement('input');
    evidenceButton.type = 'file';
    evidenceButton.classList.toggle('evidence-button', true);
    evidenceButton.id = `e-file${evidenceSlotContainer.dataset.index}`;
    evidenceButton.accept = 'image/*';

    let evidenceButtonLabel = document.createElement('label');
    evidenceButtonLabel.textContent = '+';
    evidenceButtonLabel.setAttribute('for', `e-file${evidenceSlotContainer.dataset.index}`);

    evidenceButtonContainer.append(evidenceButton);
    evidenceButtonContainer.append(evidenceButtonLabel);
    evidenceButtonContainer.classList.toggle('invisible', true)

    // Create button for removing evidence
    let evidenceRemove = document.createElement('button');
    evidenceRemove.type = 'button';
    evidenceRemove.textContent = '-';
    evidenceRemove.classList.toggle('evidence-remove', true);
    //evidenceRemove.setAttribute('onclick', `removeEvidence(${evidenceSlotContainer.dataset.index}, '${commissionID}', ${status})`);

    evidenceSlotContainer.appendChild(evidenceSlot);
    evidenceSlotContainer.appendChild(evidenceButtonContainer);
    evidenceSlotContainer.appendChild(evidenceRemove);

    evidenceBox.appendChild(evidenceSlotContainer);
  }
}

// New functions
function updateEvidenceSlot(imageData, index, numFilledSlots, stepStatus, commissionID) {
  // Disable/enable buttons
  toggleEvidenceButtonsDisabled(index, stepStatus);
  
  // Button visibility
  const addButton = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-button-container > input`);
  if(stepStatus == 3) {
    // If step is complete, all buttons should be invisible
    toggleEvidenceButtonsVisibility(index, false, false);
  } else if(imageData) {
    // Slot is filled, remove button should be visible
    toggleEvidenceButtonsVisibility(index, false, true);
    // Set remove button callback
    const removeButton = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-remove`);
    removeButton.setAttribute('onclick', `removeEvidence(${index}, '${commissionID}', ${stepStatus})`);
  } else if(index == numFilledSlots + 1) {
    // Slot is the lowest empty slot, add button should be visible
    toggleEvidenceButtonsVisibility(index, true, false);
    // Set add button callback
    const addButton = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-button-container > input`);
    addButton.setAttribute('onchange', `uploadEvidence(this, '${commissionID}', ${stepStatus})`);
  } else {
    // Slot is a non-lowest empty slot, all buttons invisible
    toggleEvidenceButtonsVisibility(index, false, false);
  }

  // Slot click behavior
  const slot = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-slot`); 
  if(imageData) {
    slot.setAttribute('onclick', `activateEvidenceCard('${imageData}')`);
    slot.classList.toggle('disabled', false);
  } else {
    slot.setAttribute('onclick', undefined);
    slot.classList.toggle('disabled', true);
  }
}

function toggleEvidenceButtonsVisibility(index, addIsVisible, removeIsVisible) {
  const addButtonContainer = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-button-container`);
  const removeButton = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-remove`);

  if(addIsVisible) {
    addButtonContainer.classList.toggle('invisible', false);
  } else {
    addButtonContainer.classList.toggle('invisible', true);
  }

  if(removeIsVisible) {
    removeButton.classList.toggle('invisible', false);
  } else {
    removeButton.classList.toggle('invisible', true);
  }
}

function toggleEvidenceButtonsDisabled(index, stepStatus) {
  const addButtonLabel = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-button-container > label`);
  const removeButton = document.querySelector(`.evidence-slot-container[data-index='${index}'] > .evidence-remove`);

  // If there's a payment, but no file upload, buttons should be disabled
  if(stepStatus == 2) {
    addButtonLabel.classList.toggle('disabled', true);
    removeButton.classList.toggle('disabled', true);
  } else {
    addButtonLabel.classList.toggle('disabled', false);
    removeButton.classList.toggle('disabled', false);
  }
}

function displayMilestone(current, numSteps, complete, currentStep, commissionID) {
  // Set download callback
  const downloadButton = document.querySelector('#download-button');
  downloadButton.onclick = () => requestCommissionDownload(commissionID, current, currentStep['title']);

  // Draw progress bar
  const stepsBar = document.getElementById('steps-bar');
  stepsBar.appendChild(stepsBarFragment());

  for(let i = 0; i < numSteps; i++) {
    let circleWrapper = stepsBarCircle(i === current - 1);
    stepsBar.appendChild(circleWrapper);
    stepsBar.appendChild(stepsBarFragment(i < current - 1 || complete));
  }

  // Set onclick functions for circles. Must be done dynamically and updated with any change in the
  // state of the commission. This is because the callbacks are dependent upon the current step number
  setCircleCallbacks(current, current);

  updateMilestoneSectionVisibilityAndText(currentStep);

  // Load evidence
  createEvidenceSlots();
  //updateEvidence(currentStep['status'], currentStep['evidence'], commissionID);
  evidenceArray = currentStep['evidence'];
  for(let i = 0; i < 3; i++) {
    // Image data is null if the evidence slot is empty
    let imageData = i < evidenceArray.length ? evidenceArray[i]['file'] : null;
    updateEvidenceSlot(imageData, i + 1, evidenceArray.length, currentStep['status'], commissionID);
  }

  // Check if payment made
  if(currentStep['status'] < 2) {
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
          completeCommissionPayment(commissionID, details.id, 'filename').then(state => {
            if(state) {
              // Display new state
              updateProgressBar(state['current'], state['stepNumber']);
              updateMilestoneSectionVisibilityAndText(state['currentStep']);
              setCircleCallbacks(state['stepNumber'], state['current']);

              // Update evidence
              const evidenceArray = state['currentStep']['evidence'];
              for(let i = 0; i < 3; i++) {
                // Image data is null if the evidence slot is empty
                let imageData = i < evidenceArray.length ? evidenceArray[i]['file'] : null;
                updateEvidenceSlot(imageData, i + 1, evidenceArray.length, state['currentStep']['status'], commissionID);
              }

              // If the current milestone is greater than the milestone we were just working on (stepNumber),
              // then request a download of the file, since the milestone should be complete
              if(state['current'] > state['stepNumber']) {
                requestCommissionDownload(state['commission'], state['stepNumber'], state['currentStep']['title']);
              }
            }
          })
        });
      }
    }).render('#paypal-button-container');
  }
}