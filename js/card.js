/* activateCard(text)

  Makes the card visible and displays the listing link.  Blurs the background

*/
function activateCard(text) {
    let card = document.getElementById('card');
    card.className = 'card-active';
    card.innerText = '\tYour Link Is:\n\n' + text;

    let content = document.getElementById('content');
    content.className = 'blur';

    let inputs = Array.from(document.getElementsByTagName('input'));
    let buttons = Array.from(document.getElementsByTagName('button'));
    let elementArray = inputs.concat(buttons);
    elementArray.forEach((input) => {
        input.disabled = true;
    });

    let fileInput = document.getElementById('file');
    fileInput.className = 'inputfile';
}


/* disableCard(text)

  Makes the card invisible and unblurs the background.

*/
function disableCard() {
    let card = document.getElementById('card');
    card.className = 'card-disabled';
    card.innerText = '';

    let content = document.getElementById('content');
    content.className = '';

    let inputs = Array.from(document.getElementsByTagName('input'));
    let buttons = Array.from(document.getElementsByTagName('button'));
    let elementArray = inputs.concat(buttons);
    elementArray.forEach((input) => {
        input.disabled = false;
    });

    let fileInput = document.getElementById('file');
    fileInput.className = 'inputfile hoverable';
}

function cardActive() {
    let card = document.getElementById('card');
    return card.className === 'card-active';
}