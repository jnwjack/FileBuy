/* activateCard(text)

  Makes the card visible and displays the listing link.  Blurs the background

*/
function activateCard(cardID) {
  let card = document.getElementById(cardID);
  if(card.className.indexOf("disabled") !== -1) {
    card.className = "card";
  }

  let content = document.getElementById('main');
  content.className = 'content blur';

  let inputs = Array.from(document.getElementsByTagName('input'));
  let buttons = Array.from(document.getElementsByTagName('button'));
  let elementArray = inputs.concat(buttons);
  elementArray.forEach((input) => {
    if(input.className.indexOf('card-button') === -1) {
      input.disabled = true;
    }
  });

  // Disable clickable header SVGs
  let clickableRects = document.getElementsByClassName('clickable-rect');
  for(const rect of clickableRects) {
    rect.onclick = null;
  }

  let fileInput = document.getElementById('file');
  fileInput.className = 'file-button';
}


/* disableCard(text)

  Makes the card invisible and unblurs the background.

*/
function disableCard(cardID) {
  let card = document.getElementById(cardID);
  card.className = 'card disabled';

  let content = document.getElementById('main');
  content.className = 'content';

  let inputs = Array.from(document.getElementsByTagName('input'));
  let buttons = Array.from(document.getElementsByTagName('button'));
  let elementArray = inputs.concat(buttons);
  elementArray.forEach((input) => {
    input.disabled = false;
  });

  // Re-enable clickable header SVGS
  let clickableRects = document.getElementsByClassName('clickable-rect');
  for(const rect of clickableRects) {
    rect.onclick = toggleBurgerMenu;
  }

  let fileInput = document.getElementById('file');
  fileInput.className = 'file-button hoverable';
}

function cardActive(cardID) {
  let card = document.getElementById(cardID);
  return card.className.indexOf('disabled') !== -1;
}

function activateResultCard(text) {
  let cardText = document.getElementById('result-card-text');
  cardText.innerText = text;

  activateCard('result-card');
}

/* Copy link on card to clipboard */
async function copyLink() {
  const text = document.getElementById('result-card-text').innerText;
  await navigator.clipboard.writeText(text);
  const button = document.getElementById('copy-button');
  button.innerText = 'Copied!';
}