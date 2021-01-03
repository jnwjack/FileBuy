/* defaultPreveiew

  Generates black and white checkerboard pattern inside the preview box.

*/
function defaultPreview() {
  let canvas = document.getElementById("preview");
  let context = canvas.getContext("2d");

  canvas.className = "";
  context.font = "22px serif";

  let width = canvas.width;
  let height = canvas.height;
  let numBlocks = 6;
  let blockWidth = width / numBlocks;
  let blockHeight = height / numBlocks;

  for (let i = 0; i < numBlocks; i++) {
    for (let j = 0; j < numBlocks; j++) {
      let color = ((i + j) % 2 == 0) ? "rgb(191, 191, 191)" : "rgb(255, 255, 255)";
      context.fillStyle = color;
      context.fillRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
    }
  }

  // context.fillStyle = "rgb(0, 0, 0)";
  // context.textBaseline = "middle";
  // context.textAlign = "center";
  // context.font = "3rem sans-serif";
  // context.fillText("Preview", width / 2, height / 2);
}

/* savePreviewAsBase64()

  Called at listing creation.  Converts file in preview box
  to base64 stirng.

*/
function savePreviewAsBase64() {
  let canvas = document.getElementById("preview");
  
  return canvas.toDataURL("image/jpeg", 0.05);
}

/* savePreviewAsBlob()

  Called at listing creation.  Converts file in preview box
  to blob object.

  NO LONGER USED

*/
function savePreviewAsBlob() {
  let canvas = document.getElementById("preview");
  
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function (blob) {
      resolve(blob);
    });
  });
}

/* enablePreviewCard

  Makes preview card in center of screen visible (mobile only).

*/
function enablePreviewCard() {
  let previewCard = document.getElementById("preview-card");
  if(previewCard.className.indexOf("disabled") !== -1) {
    previewCard.className = "";
  }

  let content = document.getElementById('content');
  content.className = 'blur';

  let inputs = Array.from(document.getElementsByTagName('input'));
  let buttons = Array.from(document.getElementsByTagName('button'));
  let elementArray = inputs.concat(buttons);
  elementArray.forEach((input) => {
    if(input.parentElement !== previewCard) {
      input.disabled = true;
    }
  });

  let fileInput = document.getElementById('file');
  fileInput.className = 'file-button';
}

function disablePreviewCard() {
  let previewCard = document.getElementById("preview-card");
  if(previewCard.className.indexOf("disabled") === -1) {
    previewCard.className = "disabled"
  }

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