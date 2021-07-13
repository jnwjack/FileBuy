function toggleButtonProgressBar(active) {
  document.getElementById('submit-button-text').classList.toggle('disabled', active);
  document.getElementById('progress-bar').classList.toggle('invisible', !active);
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