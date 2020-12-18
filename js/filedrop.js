/* generatePreview(file)

  Inserts the image into the preview box and blurs the image.

*/
function generatePreview(file) {
  let reader = new FileReader();
  let image = new Image();
  reader.onload = function () {
    image.src = reader.result;
  }

  let canvas = document.getElementById("preview");
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

/* dropHandler(ev)

  Called when a file is dragged into the 'drag file here' zone.

*/
function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.files) {
    if (ev.dataTransfer.files.length > 1) {
      alert("Only upload 1 file");
    } else {
      let fileElement = document.getElementById("file");
      fileElement.files = ev.dataTransfer.files;
      generatePreview(ev.dataTransfer.files[0]);
    }
  }
}

/* dragOverHandler(ev)

  Prevents file from being opened when the file is dragged over 
  the 'drag file here' zone.

*/
function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

/* selectHandler(element)

  Called when file is selected via the 'file upload' button.

*/
function selectHandler(element) {
  let file = element.files[0];
  if(!file) {
    defaultPreview();
    return false;
  }

  generatePreview(file);
}