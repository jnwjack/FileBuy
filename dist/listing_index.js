function isImage(t){return!(!t||!t.name.toLowerCase().match(".(png|jpg|gif|jpeg)$"))}function isEmailAddress(t){return!(!t||!t.match("^[^@]+@[^@]+.[^@]+$"))}function formatBytes(t,r=0){if(units=["bytes","KB","MB"],t<1e3||3===r)return t.toString(10)+" "+units[r];let n=t/1e3;return n=n.toFixed(2),formatBytes(n,++r)}function formatPrice(t){return t.toFixed(2)}function truncateString(t){return t.length>15?t.substring(0,15)+"...":t}function validateEmail(t,r){return t!==r?(alert("Error: Email and Email Confirm must match"),!1):!!isEmailAddress(t)||(alert("Error: Invalid Email"),!1)}function extractURLRoot(t){let r=0,n=0;for(;r<3&&-1!==n;)n=t.indexOf("/",n+1),r++;return t.substring(0,n)}function removeQuotes(t){return t.replace('"',"")}function defaultPreview(){let e=document.getElementById("preview"),t=e.getContext("2d");e.className="",t.font="22px serif";let n=e.width/6,l=e.height/6;for(let e=0;e<6;e++)for(let a=0;a<6;a++){let i=(e+a)%2==0?"rgb(191, 191, 191)":"rgb(255, 255, 255)";t.fillStyle=i,t.fillRect(e*n,a*l,n,l)}}function generatePreview(e){if(defaultPreview(),e){let t=new FileReader,n=new Image;t.onload=function(){n.src=t.result};let l=document.getElementById("preview"),a=l.getContext("2d");n.onload=function(){isImage(e)&&a.drawImage(n,0,0,l.width,l.height)},t.readAsDataURL(e),isImage(e)&&!l.className.includes("blur")&&(l.className+="blur")}}function savePreviewAsBase64(){return document.getElementById("preview").toDataURL("image/jpeg",.05)}function savePreviewAsBlob(){let e=document.getElementById("preview");return new Promise((function(t,n){e.toBlob((function(e){t(e)}))}))}function setCanvasImageFromBase64(e,t){let n=new Image;n.src=e;let l=document.getElementById(t),a=l.getContext("2d");n.onload=function(){a.drawImage(n,0,0,l.width,l.height),l.className+="blur"}}function createCommission(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=parseInt(document.getElementById("checkpoints").value);if(isNaN(r)||r<0||r>4)return!1;let n=[];for(let e=1;e<=r;e++){let t=document.getElementById(`step${e}-price`).value;if(isNaN(t)||""===t)return alert("Error: Invalid Price"),!1;let o=document.getElementsByName(`step${e}`)[0].value,r=document.getElementById(`step${e}-description`).value;n.push({title:o,price:t,description:r})}toggleButtonProgressBar(!0);const a={numSteps:r,email:t,steps:n},i=JSON.stringify(a);fetch("../php/create_commission.php",{method:"POST",body:i,header:{"Content-Type":"application/json"}}).then((e=>{if(e.status>=400){throw document.querySelector("#main").reset(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e);document.querySelector("#main").reset(),document.getElementById("checkpoints-output").textContent=1,onSliderChange();let o=`${extractURLRoot(document.location.href)}/commission/${t}`;toggleButtonProgressBar(!1),activateResultCard(o)})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function createListing(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=document.getElementById("price").value;if(isNaN(r)||""===r)return alert("Error: Invalid Price"),!1;let n=document.getElementById("file").files[0];if(!n)return alert("Error: No File"),!1;let a=n.name,i=n.size;return toggleButtonProgressBar(!0),new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(n)})).then((function(e){let o=savePreviewAsBase64(),n=new FormData;n.append("email",t),n.append("price",r),n.append("preview",o),n.append("file",e),n.append("name",a),n.append("size",i),fetch("../php/submit.php",{method:"POST",body:n}).then((e=>{if(413==e.status&&alert("The file is too big. The maximum file size is 4MB"),e.status>=400){throw document.getElementById("main").reset(),defaultPreview(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e),o=`${extractURLRoot(document.location.href)}/listing/${t}`;document.getElementById("main").reset(),toggleButtonProgressBar(!1),defaultPreview(),activateResultCard(o)})).catch((e=>{console.error("Error:",e),toggleButtonProgressBar(!1)}))}),(function(e){console.error(e)})),!0}function requestDownload(e,t,o){let r=new FormData;r.append("listing",e),r.append("order",t),fetch("../php/download.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}function requestCommissionDownload(e,t,o){fetch(`../php/commission_download.php?commission=${e}&step=${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then((e=>{if(200!=e.status)throw new Error(`Status code: ${e.status}`);return e.json()})).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}async function completeCommissionPayment(e,t,o){let r=new FormData;return r.append("commission",e),r.append("order",t),new Promise((e=>{fetch("../php/commission_pay.php",{method:"POST",body:r}).then((e=>e.json())).then((t=>{e(t)})).catch((e=>{console.error("Error:",e)}))}))}function uploadCommissionFile(e,t){e.preventDefault();let o=document.getElementById("file").files[0];if(!o)return alert("Error: No File"),!1;toggleButtonProgressBar(!0),new Promise(((e,t)=>{let r=new FileReader;r.onload=function(){e(r.result)},r.readAsDataURL(o)})).then((function(e){let o=savePreviewAsBase64(),r=new FormData;r.append("preview",o),r.append("file",e),r.append("commission",t),fetch("../php/commission_file_upload.php",{method:"POST",body:r}).then((e=>{if(413==e.status){throw alert("The file is too big. The maximum file size is 4MB"),document.querySelector("#file").value="",defaultPreview(),e.text()}return e.json()})).then((e=>{toggleButtonProgressBar(!1),defaultPreview(),updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current)})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function sendMessage(e){e.preventDefault();let t=document.querySelector("#email").value,o=document.querySelector("#message").value;if(!isEmailAddress(t))return alert("Enter a valid email"),!1;if(""===o)return alert("Message body empty"),!1;toggleButtonProgressBar(!0);let r=new FormData;r.append("email",t),r.append("message",o),fetch("../php/send_message.php",{method:"POST",body:r,header:{"Content-Type":"application/json"}}).then((e=>{document.querySelector("#main").reset(),toggleButtonProgressBar(!1)})).error((e=>{toggleButtonProgressBar(!1),console.error("Error: ",e)}))}async function fetchCommissionStep(e,t){return new Promise((o=>{fetch(`../php/commission_fetch_step.php?commission=${e}&step=${t}`,{method:"GET",header:{"Content-Type":"application/json"}}).then((e=>{if(200!==e.status)throw new Error(`Status code: ${e.status}`);o(e.json())})).then((e=>e)).catch((e=>{console.error("Error",e)}))}))}function uploadEvidence(e,t,o){let r=e.files[0];if(!r)return console.error("Error: Invalid file"),!1;new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(r)})).then((function(e){let r=new FormData;r.append("file",e),r.append("commission",t),r.append("description","Temporary Description"),fetch("../php/commission_add_evidence.php",{method:"POST",body:r}).then((e=>(413==e.status&&alert("The file is too big. The maximum file size is 4MB"),e.json()))).then((e=>{addEvidenceToSlot(e.evidenceCount,o,e.newEvidence),setEvidenceSlotAsLowestEmpty(e.evidenceCount+1,o),updatePreview(0)})).catch((e=>{console.error("Error",e)}))}))}function removeEvidence(e,t,o){let r=new FormData;r.append("commission",t),r.append("evidence",e),fetch("../php/commission_delete_evidence.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{updateEvidence(o,e),updatePreview(0)})).catch((e=>{console.error("Error",e)}))}function activateCard(e){let t=document.getElementById(e);-1!==t.className.indexOf("disabled")&&(t.className="card"),document.getElementById("main").className="content blur";let n=Array.from(document.getElementsByTagName("input")),a=Array.from(document.getElementsByTagName("button"));n.concat(a).forEach((e=>{-1===e.className.indexOf("card-button")&&(e.disabled=!0)}));let c=document.getElementsByClassName("clickable-rect");for(const e of c)e.onclick=null;let d=document.getElementById("file");d&&(d.className="file-button")}function disableCard(e){document.getElementById(e).className="card disabled",document.getElementById("main").className="content";let t=Array.from(document.getElementsByTagName("input")),n=Array.from(document.getElementsByTagName("button"));t.concat(n).forEach((e=>{e.disabled=!1}));let a=document.getElementsByClassName("clickable-rect");for(const e of a)e.onclick=toggleBurgerMenu;let c=document.getElementById("file");c&&(c.className="file-button hoverable")}function cardActive(e){return-1!==document.getElementById(e).className.indexOf("disabled")}function activateResultCard(e){document.getElementById("copy-button").innerText="Copy";document.getElementById("result-card-text").innerText=e,activateCard("result-card")}async function copyLink(){const e=document.getElementById("result-card-text").innerText;await navigator.clipboard.writeText(e);document.getElementById("copy-button").innerText="Copied!"}function activateEvidenceCard(e){document.querySelector("#evidence-card img").src=e,activateCard("evidence-card")}