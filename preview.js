function defaultPreview() {
  let canvas = document.getElementById("preview");
  let context = canvas.getContext("2d");
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

  context.fillStyle = 'rgb(0, 0, 0)';
  context.textBaseline = 'middle';
  context.textAlign = "center";
  context.fillText('Preview', width / 2, height / 2);
}

function savePreviewAsBlob() {
  let canvas = document.getElementById("preview");
  canvas.toBlob(function (blob) {
    let img = document.createElement('img'),
      url = URL.createObjectURL(blob);

    img.onload = function () {
      // no longer need to read the blob so it's revoked
      URL.revokeObjectURL(url);
    };

    img.src = url;
    document.body.appendChild(img);
  });
} 