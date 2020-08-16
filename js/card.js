function activateCard(text) {
    let card = document.getElementById('card');
    card.className = 'card-active';
    card.innerText = text;

    let content = document.getElementById('content');
    content.className = 'blur';

    let inputs = Array.from(document.getElementsByTagName('input'));
    let buttons = Array.from(document.getElementsByTagName('button'));
    let elementArray = inputs.concat(buttons);
    elementArray.forEach((input) => {
        input.disabled = true;
    });
}