function toggleButtonProgressBar(active) {
  document.getElementById('submit-button-text').classList.toggle('disabled', active);
  document.getElementById('progress-bar').classList.toggle('invisible', !active);
}

/* toggleProgressBar(container, active)

  Start animated progress bar for a given container. Move text
  out of view, then have color-changing animation start. Requires
  2 elements of class submit-button-text and progress-bar, respectively,
  to be children of container

*/
function toggleProgressBar(container, active) {
  container.querySelector('.submit-button-text').classList.toggle('disabled', active);

  // We don't have a progress-bar element if the container is an evidence slot container
  if(!container.classList.contains('evidence-slot-container')) {
    container.querySelector('.progress-bar').classList.toggle('invisible', !active);
  }
}

/* priceInputCallback(event)

  Called when any input is made to a price field. Ensures that any value has only 2
  decimal points

*/
function priceInputCallback(event) {
  if(event.srcElement.valueAsNumber > 1000) {
    event.srcElement.valueAsNumber = 1000;
  }
}