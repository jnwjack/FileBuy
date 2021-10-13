function isImage(t){return!(!t||!t.name.toLowerCase().match(".(png|jpg|gif|jpeg)$"))}function isEmailAddress(t){return!(!t||!t.match("^[^@]+@[^@]+.[^@]+$"))}function formatBytes(t,r=0){if(units=["bytes","KB","MB"],t<1e3||3===r)return t.toString(10)+" "+units[r];let n=t/1e3;return n=n.toFixed(2),formatBytes(n,++r)}function formatPrice(t){return t.toFixed(2)}function truncateString(t,r){return t.length>r?t.substring(0,r)+"...":t}function validateEmail(t,r){return t!==r?(alert("Error: Email and Email Confirm must match"),!1):!!isEmailAddress(t)||(alert("Error: Invalid Email"),!1)}function extractURLRoot(t){let r=0,n=0;for(;r<3&&-1!==n;)n=t.indexOf("/",n+1),r++;return t.substring(0,n)}function removeQuotes(t){return t.replace('"',"")}function toggleButtonProgressBar(e){document.getElementById("submit-button-text").classList.toggle("disabled",e),document.getElementById("progress-bar").classList.toggle("invisible",!e)}function priceInputCallback(e){e.srcElement.valueAsNumber>1e3&&(e.srcElement.valueAsNumber=1e3)}function createCommission(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let n=parseInt(document.getElementById("checkpoints").value);if(isNaN(n)||n<0||n>4)return!1;let r=[];for(let e=1;e<=n;e++){let t=document.getElementById(`step${e}-price`).value;if(isNaN(t)||""===t)return alert("Error: Invalid Price"),!1;let o=document.getElementsByName(`step${e}`)[0].value,n=document.getElementById(`step${e}-description`).value;r.push({title:o,price:t,description:n})}toggleButtonProgressBar(!0);const i={numSteps:n,email:t,steps:r},s=JSON.stringify(i);fetch("../php/create_commission.php",{method:"POST",body:s,header:{"Content-Type":"application/json"}}).then((e=>{if(e.status>=400){throw document.querySelector("#main").reset(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e);document.querySelector("#main").reset(),document.getElementById("checkpoints-output").textContent=1,onSliderChange();let o=`${extractURLRoot(document.location.href)}/commission/${t}`;toggleButtonProgressBar(!1),activateResultCard(o)})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function createListing(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let n=document.getElementById("price").value;if(isNaN(n)||""===n)return alert("Error: Invalid Price"),!1;let r=document.getElementById("file").files[0];if(!r)return alert("Error: No File"),!1;let i=r.name,s=r.size;return toggleButtonProgressBar(!0),new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(r)})).then((function(e){let o=savePreviewAsBase64(),r=new FormData;r.append("email",t),r.append("price",n),r.append("preview",o),r.append("file",e),r.append("name",i),r.append("size",s),fetch("../php/submit.php",{method:"POST",body:r}).then((e=>{if(413==e.status&&alert("The file is too big. The maximum file size is 4MB"),e.status>=400){throw document.getElementById("main").reset(),defaultPreview(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e),o=`${extractURLRoot(document.location.href)}/listing/${t}`;document.getElementById("main").reset(),toggleButtonProgressBar(!1),defaultPreview(),activateResultCard(o)})).catch((e=>{console.error("Error:",e),toggleButtonProgressBar(!1)}))}),(function(e){console.error(e)})),!0}function requestDownload(e,t,o){let n=new FormData;n.append("listing",e),n.append("order",t),fetch("../php/download.php",{method:"POST",body:n}).then((e=>e.json())).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}function requestCommissionDownload(e,t,o){fetch(`../php/commission_download.php?commission=${e}&step=${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then((e=>{if(200!=e.status)throw new Error(`Status code: ${e.status}`);return e.json()})).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}async function completeCommissionPayment(e,t,o){let n=new FormData;return n.append("commission",e),n.append("order",t),new Promise((e=>{fetch("../php/commission_pay.php",{method:"POST",body:n}).then((e=>e.json())).then((t=>{e(t)})).catch((e=>{console.error("Error:",e)}))}))}function uploadCommissionFile(e,t){e.preventDefault();let o=document.getElementById("file").files[0];if(!o)return alert("Error: No File"),!1;toggleButtonProgressBar(!0),new Promise(((e,t)=>{let n=new FileReader;n.onload=function(){e(n.result)},n.readAsDataURL(o)})).then((function(e){let o=savePreviewAsBase64(),n=new FormData;n.append("preview",o),n.append("file",e),n.append("commission",t),fetch("../php/commission_file_upload.php",{method:"POST",body:n}).then((e=>{if(413==e.status){throw alert("The file is too big. The maximum file size is 4MB"),document.querySelector("#file").value="",defaultPreview(),e.text()}return e.json()})).then((e=>{if(toggleButtonProgressBar(!1),defaultPreview(),updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current),e.current!==e.stepNumber){const t=e.currentStep.evidence;for(let o=0;o<3;o++){let n=o<t.length?t[o].file:null,r=o<t.length?t[o].description:null;updateEvidenceSlot(n,o+1,t.length,e.currentStep.status,e.commission,r)}}})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function sendMessage(e){e.preventDefault();let t=document.querySelector("#email").value,o=document.querySelector("#message").value;if(!isEmailAddress(t))return alert("Enter a valid email"),!1;if(""===o)return alert("Message body empty"),!1;toggleButtonProgressBar(!0);let n=new FormData;n.append("email",t),n.append("message",o),fetch("../php/send_message.php",{method:"POST",body:n,header:{"Content-Type":"application/json"}}).then((e=>{document.querySelector("#main").reset(),toggleButtonProgressBar(!1)})).error((e=>{toggleButtonProgressBar(!1),console.error("Error: ",e)}))}async function fetchCommissionStep(e,t){return new Promise((o=>{fetch(`../php/commission_fetch_step.php?commission=${e}&step=${t}`,{method:"GET",header:{"Content-Type":"application/json"}}).then((e=>{if(200!==e.status)throw new Error(`Status code: ${e.status}`);o(e.json())})).then((e=>e)).catch((e=>{console.error("Error",e)}))}))}function uploadEvidence(e,t,o){let n=e.files[0];if(!n)return console.error("Error: Invalid file"),!1;new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(n)})).then((function(e){let o=new FormData;o.append("file",e),o.append("commission",t),o.append("description","Temporary Description"),fetch("../php/commission_add_evidence.php",{method:"POST",body:o}).then((e=>(413==e.status&&alert("The file is too big. The maximum file size is 4MB"),e.json()))).then((e=>{const t=e.evidenceCount;updateEvidenceSlot(e.newEvidence,t,t,0,e.commission,e.description);for(let o=t;o<3;o++)updateEvidenceSlot(null,o+1,t,0,e.commission,null);updatePreview(0)})).catch((e=>{console.error("Error",e)}))}))}function removeEvidence(e,t,o){let n=new FormData;n.append("commission",t),n.append("evidence",e),fetch("../php/commission_delete_evidence.php",{method:"POST",body:n}).then((e=>e.json())).then((e=>{for(let o=0;o<3;o++){let n=o<e.length?e[o].file:null,r=o<e.length?e[o].description:null;updateEvidenceSlot(n,o+1,e.length,0,t,r)}updatePreview(0)})).catch((e=>{console.error("Error",e)}))}