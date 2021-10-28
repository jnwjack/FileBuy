/* defaultPreveiew

  Generates black and white checkerboard pattern inside the preview box.

*/
function defaultPreview(canvasID) {
  let canvas = document.getElementById(canvasID);
  let context = canvas.getContext('2d');

  canvas.className = '';
  context.font = '22px serif';

  let width = canvas.width;
  let height = canvas.height;
  let numBlocks = 6;
  let blockWidth = width / numBlocks;
  let blockHeight = height / numBlocks;

  for (let i = 0; i < numBlocks; i++) {
    for (let j = 0; j < numBlocks; j++) {
      let color = ((i + j) % 2 == 0) ? 'rgb(191, 191, 191)' : 'rgb(255, 255, 255)';
      context.fillStyle = color;
      context.fillRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
    }
  }
}

/* generatePreview(file)

  Inserts the image into the preview box and blurs the image.

*/
function generatePreview(file, canvas) {
  defaultPreview(canvas);
  if(file) {
    let reader = new FileReader();
    let image = new Image();
    reader.onload = function () {
      image.src = reader.result;
    }

    let canvas = document.getElementById(canvas);
    let context = canvas.getContext("2d");
    image.onload = function () {
      if(isImage(file)) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }

    reader.readAsDataURL(file);
    if(isImage(file) && !canvas.className.includes("blur")){
      canvas.className += "blur";
    }
  }
}

/* savePreviewAsBase64()

  Called at listing creation.  Converts file in preview box
  to base64 string.

*/
function savePreviewAsBase64() {
  let canvas = document.getElementById('preview');
  
  return canvas.toDataURL('image/jpeg', 0.05);
}

/* savePreviewAsBlob()

  Called at listing creation.  Converts file in preview box
  to blob object.

  NO LONGER USED

*/
function savePreviewAsBlob() {
  let canvas = document.getElementById('preview');
  
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function (blob) {
      resolve(blob);
    });
  });
}

/* setCanvasImageFromBase64(string)

  Converts base64 string to image and draws it on
  the canvas.

*/
function setCanvasImageFromBase64(string, canvasID) {
  let image = new Image();
  image.src = string;

  let canvas = document.getElementById(canvasID);
  let context = canvas.getContext('2d');
  image.onload = function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.className += 'blur';
  }
}