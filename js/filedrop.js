/* dropHandler(ev)

  Called when a file is dragged into the 'drag file here' zone.

*/
function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  // Toggle off drag enter effect
  const filedrop = document.querySelector('.file-button-wrapper');
  filedrop.classList.toggle('drag-over', false);

  if (ev.dataTransfer.files) {
    if (ev.dataTransfer.files.length > 1) {
      alert("Only upload 1 file");
    } else {
      let fileElement = document.getElementById("file");
      fileElement.files = ev.dataTransfer.files;
      generatePreview(ev.dataTransfer.files[0], 'preview');
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

/* dragEnterHandler(ev)

  Change appearance of file drop area when dragged file enters area.

*/
function dragEnterHandler(ev) {
  const filedrop = document.querySelector('.file-button-wrapper');
  filedrop.classList.toggle('drag-over', true);
}

/* dragLeaveHandler(ev)

  Change appearance back to normal when dragged file leaves area.

*/
function dragLeaveHandler(ev) {
  const filedrop = document.querySelector('.file-button-wrapper');
  filedrop.classList.toggle('drag-over', false);
}

/* selectHandler(element)

  Called when file is selected via the 'file upload' button.

*/
function selectHandler(element) {
  let file = element.files[0];
  generatePreview(file, 'preview');
  if(!file) {
    return false;
  }
}