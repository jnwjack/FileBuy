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

function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function selectHandler(element) {
  let file = element.files[0];
  if(!file) {
    console.log("hey");
    defaultPreview();
    return false;
  }

  generatePreview(file);
}