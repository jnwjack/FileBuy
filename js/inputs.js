function toggleButtonProgressBar(active) {
  document.getElementById('submit-button-text').classList.toggle('disabled', active);
  document.getElementById('progress-bar').classList.toggle('invisible', !active);
}