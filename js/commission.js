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

function displayMilestone(current, numSteps, complete, currentStep) {
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
  let previewWrapper = document.querySelector('.preview-wrapper');
  let fileUpload = document.querySelector('#file-upload-section');
  if(status % 2 !== 0) {
    // file is uploaded
    previewWrapper.classList.toggle('invisible', false);
    fileUpload.classList.toggle('invisible', true);
  } else {
    // file is not uploaded
    previewWrapper.classList.toggle('invisible', true);
    fileUpload.classList.toggle('invisible', false);
  }

  // Check if payment made
  if(status < 2) {
    console.log('no payment');
  } else {
    console.log('payment');
  }
  generatePreview(preview);
}