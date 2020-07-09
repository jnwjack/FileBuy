function savePreviewAsBlob() {
  let canvas = document.getElementById("preview");
  
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function (blob) {
      resolve(blob);
    });
  });
} 

function savePreviewAsBase64() {
  let canvas = document.getElementById("preview");
  
  return canvas.toDataURL("image/jpeg", 0.05);
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

  let readerPromise = new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    }
    reader.readAsDataURL(file);
  });

  readerPromise.then(function(fileData) {
    //let previewPromise = savePreviewAsBlob();
    let previewb64 = savePreviewAsBase64();

    let formData = new FormData();
    formData.append("email", email);
    formData.append("price", price);
    formData.append("preview", previewb64);
    formData.append("file", fileData);

    console.log("previewb64", previewb64);
    console.log("filedata", fileData);

    fetch("submit.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      console.log("result", JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error("Error:", error);
    });

    }, function(err) {
      console.log(err);
  });



    /*previewPromise.then(function(preview) {
      let formData = new FormData();
      formData.append("email", email);
      formData.append("price", price);
      formData.append("preview", preview);
      formData.append("file", fileData);

      console.log("file before sending:", fileData);
  
      fetch("submit.php", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        console.log("result", JSON.stringify(result, null, 2));
      })
      .catch(error => {
        console.log("Error:", error);
      });
  
    }, function(err) {
      console.log(err);
    });
  });*/

  return true;
}