function savePreviewAsBlob() {
  let canvas = document.getElementById("preview");
  let convertedImage = {};
  
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function (blob) {
      resolve(blob);
    });
  });
} 

function createListing(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let confirm = document.getElementById("confirm").value;
  if(email !== confirm) {
    alert("Error: Email and Email Confirm must match");
    return false;
  }

  let price = document.getElementById("price").value;
  if(isNaN(price) || price === ""){
    alert("Error: Invalid Price");
    return false;
  }

  let file = document.getElementById("file").files[0];
  if(!file) {
    alert("Error: No File");
    return false;
  }

  console.log(file);
  let blobTest = URL.createObjectURL(file);
  console.log(blobTest);

  let readerPromise = new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    }
    reader.readAsDataURL(file);
  })

  readerPromise.then(function(fileData) {
    let previewPromise = savePreviewAsBlob();
    previewPromise.then(function(preview) {
      let formData = new FormData();
      formData.append("email", email);
      formData.append("price", price);
      formData.append("preview", preview);
      formData.append("file", fileData);
  
      fetch("submit.php", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        alert("JSON.stringify(result, null, 2)");
      })
      .catch(error => {
        console.log("Error:", error);
      });
  
    }, function(err) {
      console.log(err);
    });
  });

  return true;
}