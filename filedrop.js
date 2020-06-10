function generatePreview(file) {
  let reader = new FileReader();
  let image = new Image();
  reader.onload = function () {
    image.src = reader.result;
  }

  let canvas = document.getElementById("preview");
  let context = canvas.getContext("2d");
  image.onload = function() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  reader.readAsDataURL(file);
  if(!canvas.className.includes("blur")){
    canvas.className += "blur";
  }
}

function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        generatePreview(file);
      }
    }
  }
}

function dragOverHandler(ev) {
    console.log("File(s) in drop zone"); 
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function selectHandler(ev) {
  let file = ev.files[0];
  if(!file) {
    return false;
  }

  generatePreview(file);
}