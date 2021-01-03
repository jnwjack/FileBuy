/* activateCard(text)

  Makes the card visible and displays the listing link.  Blurs the background

*/
function activateCard(cardID) {
  let card = document.getElementById(cardID);
  if(card.className.indexOf("disabled") !== -1) {
    card.className = "card";
  }

  let content = document.getElementById('content');
  content.className = 'blur';

  let inputs = Array.from(document.getElementsByTagName('input'));
  let buttons = Array.from(document.getElementsByTagName('button'));
  let elementArray = inputs.concat(buttons);
  elementArray.forEach((input) => {
    if(input.parentElement !== card) {
      input.disabled = true;
    }
  });

  let fileInput = document.getElementById('file');
  fileInput.className = 'file-button';
}


/* disableCard(text)

  Makes the card invisible and unblurs the background.

*/
function disableCard(cardID) {
  let card = document.getElementById(cardID);
  card.className = 'card disabled';

  let content = document.getElementById('content');
  content.className = '';

  let inputs = Array.from(document.getElementsByTagName('input'));
  let buttons = Array.from(document.getElementsByTagName('button'));
  let elementArray = inputs.concat(buttons);
  elementArray.forEach((input) => {
    input.disabled = false;
  });

  let fileInput = document.getElementById('file');
  fileInput.className = 'file-button hoverable';
}

function cardActive(cardID) {
  let card = document.getElementById(cardID);
  return card.className.indexOf('disabled') !== -1;
}

function activateResultCard(text) {
  let cardText = document.getElementsByTagName('p')[0];
  cardText.innerText = '\tYour Link Is:\n\n' + text;

  activateCard('result-card');
}