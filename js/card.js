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
  let inputArray = inputs.concat(buttons);
  inputArray.forEach((input) => {
    if(input.className.indexOf('card-button') === -1) {
      input.disabled = true;
    }
  });

  // Disabled circles and anchors in nav
  let circles = Array.from(document.getElementsByClassName('steps-bar-circle'));
  let headerLinks = Array.from(document.getElementsByTagName('a'));
  let elementArray = circles.concat(headerLinks);
  elementArray.forEach((element) => {
    element.classList.toggle('disabled', true);
  })

  // Disable clickable header SVGs
  let clickableRects = document.getElementsByClassName('clickable-rect');
  for(const rect of clickableRects) {
    rect.onclick = null;
  }

  // Disable hover on file button if it exists
  let fileInput = document.getElementById('file');
  if(fileInput) {
    fileInput.className = 'file-button';
  }
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
  let inputArray = inputs.concat(buttons);
  inputArray.forEach((input) => {
    input.disabled = false;
  });

  // Re-enable circles and anchors in nav
  let circles = Array.from(document.getElementsByClassName('steps-bar-circle'));
  let headerLinks = Array.from(document.getElementsByTagName('a'));
  let elementArray = circles.concat(headerLinks);
  elementArray.forEach((element) => {
    element.classList.toggle('disabled', false);
  })

  // Re-enable clickable header SVGS
  let clickableRects = document.getElementsByClassName('clickable-rect');
  for(const rect of clickableRects) {
    rect.onclick = toggleBurgerMenu;
  }

  // Enable hover on file button if it exists
  let fileInput = document.getElementById('file');
  if(fileInput) {
    fileInput.className = 'file-button hoverable';
  }
}

function cardActive(cardID) {
  let card = document.getElementById(cardID);
  return card.className.indexOf('disabled') !== -1;
}

function activateResultCard(text) {
  const copyButton = document.getElementById('copy-button');
  copyButton.innerText = 'Copy';
  const cardText = document.getElementById('result-card-text');
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

/* activateEvidenceCard(evidence)

  Take the data for the specific piece of evidence and
  set it as the <img> element's src attribute. Then,
  activate the card

*/
function activateEvidenceCard(evidence) {
  const img = document.querySelector('#evidence-card img');
  img.src = evidence;
  activateCard('evidence-card');
}