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