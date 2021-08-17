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
  //const enabledFragments = document.querySelectorAll('.steps-bar-fragment');
  const numSteps = document.querySelectorAll('.steps-bar-circle').length;
  const stepsBar = document.querySelector('#steps-bar');
  while(stepsBar.firstElementChild) {
    stepsBar.firstElementChild.remove();
  }

  // Enable all the older fragments, along with the newer, rightmost one.
  // for(let i = 0;i <= currentStep - 1; i++) {
  //   enabledFragments[i].classList.toggle('completed', true);
  // }

  stepsBar.appendChild(stepsBarFragment(true));

  for(let i = 0; i < numSteps; i++) {
    let circleWrapper = stepsBarCircle(i === selectedStep - 1);
    stepsBar.appendChild(circleWrapper);
    stepsBar.appendChild(stepsBarFragment(i < currentStep - 1));
  }

  // Set onclick functions for circles. Must be done dynamically and updated with any change in the
  // state of the commission. This is because the callbacks are dependent upon the current step number
  setCircleCallbacks(current, current);

  // Get the fragment the rightmost fragment that should be marked as completed.
  // const currentFragment = document.querySelectorAll('.steps-bar-fragment')[currentStep - 1];
  // currentFragment.classList.toggle('completed', true);

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
function createEvidenceSlots(commissionID) {
  const evidenceBox = document.querySelector('.evidence-box');
  for(let i = 0; i < 3; i++) {
    let evidenceSlotContainer = document.createElement('div');
    evidenceSlotContainer.classList.toggle('evidence-slot-container', true);

    let evidenceSlot = document.createElement('div');
    evidenceSlot.classList.toggle('evidence-slot', true);

    evidenceSlot.dataset.index = i + 1;

    let evidenceButtonContainer = document.createElement('div');
    evidenceButtonContainer.classList.toggle('evidence-button-container');

    let evidenceButton = document.createElement('input');
    evidenceButton.type = 'file';
    evidenceButton.classList.toggle('evidence-button', true);
    evidenceButton.id = `e-file${evidenceSlot.dataset.index}`;
    evidenceButton.accept = 'image/*';
    evidenceButton.setAttribute('onchange', `uploadEvidence(this, '${commissionID}')`);

    let evidenceButtonLabel = document.createElement('label');
    evidenceButtonLabel.textContent = '+';
    evidenceButtonLabel.setAttribute('for', `e-file${evidenceSlot.dataset.index}`);

    evidenceButtonContainer.append(evidenceButton);
    evidenceButtonContainer.append(evidenceButtonLabel);
    evidenceButtonContainer.classList.toggle('invisible', true)

    // Create button for removing evidence
    let evidenceRemove = document.createElement('button');
    evidenceRemove.type = 'button';
    evidenceRemove.textContent = '-';
    evidenceRemove.classList.toggle('evidence-remove', true);

    evidenceSlotContainer.appendChild(evidenceSlot);
    evidenceSlotContainer.appendChild(evidenceButtonContainer);
    evidenceSlotContainer.appendChild(evidenceRemove);

    evidenceBox.appendChild(evidenceSlotContainer);
  }
}

// LEFT OFF HERE: NEXT STEP, MOVE DATA-INDEX TO SLOT CONTAINER, NOT SLOT

function updateEvidence(stepStatus, evidenceArray) {
  evidenceArray.forEach(evidence => {
    let index = evidence['evidenceNumber'];
    let slot = document.querySelector(`.evidence-slot[data-index='${index}']`);
    slot.textContent = 'HAS FILE';

    let evidenceButtonContainer = document.querySelector(`.evidence-slot[data-index='${index}'] + .evidence-button-container`);
    let evidenceRemove = document.querySelector(`.evidence-slot[data-index='${index}'] + .evidence-remove`);
    // Hide 'add evidence' button because evidence has been added
    evidenceButtonContainer.classList.toggle('invisible', true);
    if(stepStatus > 1) {
      // Hide button if we can no longer edit evidence because payment has been made
      evidenceRemove.classList.toggle('invisible', true);
    } else {
      evidenceRemove.classList.toggle('invisible', false);
    }
  });

  // Get lowest-index empty evidence slot, add '+' button
  const lowestEmptyIndex = evidenceArray.length + 1;
  if(lowestEmptyIndex > 3) {
    return;
  }
  const lowestEmptySlot = document.querySelector(`.evidence-slot[data-index='${lowestEmptyIndex}']`);
  lowestEmptySlot.textContent = 'ADD EVIDENCE';
  const lowestEmptyButtonContainer = document.querySelector(`.evidence-slot[data-index='${lowestEmptyIndex}'] + .evidence-button-container`);
  const lowestEmptyRemove = document.querySelector(`.evidence-slot[data-index='${lowestEmptyIndex}'] + .evidence-remove`);
  // Hide 'remove' button, because there is no evidence
  lowestEmptyRemove.classList.toggle('invisible', true);
  if(stepStatus > 1) {
    lowestEmptyButtonContainer.classList.toggle('invisible', true);
  } else {
    lowestEmptyButtonContainer.classList.toggle('invisible', false);
  }

  // For all higher-index slots, disable button
  for(let i = lowestEmptyIndex + 1; i < 3; i++) {
    let evidenceButtonContainer = document.querySelector(`.evidence-slot[data-index='${i}'] + .evidence-button-container`);
    let evidenceRemove = document.querySelector(`.evidence-slot[data-index='${i}'] + .evidence-remove`);
    evidenceButtonContainer.classList.toggle('invisible', true);
    evidenceRemove.classList.toggle('invisible', true);
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
  createEvidenceSlots(commissionID);
  updateEvidence(currentStep['status'], currentStep['evidence']);

  // Check if payment made
  if(status < 2) {
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