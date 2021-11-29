function isImage(t){return!(!t||!t.name.toLowerCase().match(".(png|jpg|gif|jpeg)$"))}function isEmailAddress(t){return!(!t||!t.match("^[^@]+@[^@]+.[^@]+$"))}function formatBytes(t,r=0){if(units=["bytes","KB","MB"],t<1e3||3===r)return t.toString(10)+" "+units[r];let n=t/1e3;return n=n.toFixed(2),formatBytes(n,++r)}function formatPrice(t){return t.toFixed(2)}function truncateString(t,r){return t.length>r?t.substring(0,r)+"...":t}function validateEmail(t,r){return t!==r?(alert("Error: Email and Email Confirm must match"),!1):!!isEmailAddress(t)||(alert("Error: Invalid Email"),!1)}function extractURLRoot(t){let r=0,n=0;for(;r<3&&-1!==n;)n=t.indexOf("/",n+1),r++;return t.substring(0,n)}function removeQuotes(t){return t.replace('"',"")}function defaultPreview(e){let t=document.getElementById(e),n=t.getContext("2d");t.className="",n.font="22px serif";let l=t.width/6,a=t.height/6;for(let e=0;e<6;e++)for(let t=0;t<6;t++){let i=(e+t)%2==0?"rgb(191, 191, 191)":"rgb(255, 255, 255)";n.fillStyle=i,n.fillRect(e*l,t*a,l,a)}}function generatePreview(e,t){if(defaultPreview(t),e){let n=new FileReader,l=new Image;n.onload=function(){l.src=n.result};let a=document.getElementById(t),i=a.getContext("2d");l.onload=function(){isImage(e)&&i.drawImage(l,0,0,a.width,a.height)},n.readAsDataURL(e),isImage(e)&&!a.className.includes("blur")&&(a.className+="blur")}}function savePreviewAsBase64(){return document.getElementById("preview").toDataURL("image/jpeg",.05)}function savePreviewAsBlob(){let e=document.getElementById("preview");return new Promise((function(t,n){e.toBlob((function(e){t(e)}))}))}function setCanvasImageFromBase64(e,t){let n=new Image;n.src=e;let l=document.getElementById(t),a=l.getContext("2d");n.onload=function(){a.drawImage(n,0,0,l.width,l.height),l.className+="blur"}}function createCommission(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=parseInt(document.getElementById("checkpoints").value);if(isNaN(r)||r<0||r>4)return!1;let n=[];for(let e=1;e<=r;e++){let t=document.getElementById(`step${e}-price`).value;if(isNaN(t)||""===t)return alert("Error: Invalid Price"),!1;let o=document.getElementsByName(`step${e}`)[0].value,r=document.getElementById(`step${e}-description`).value;n.push({title:o,price:t,description:r})}const s=document.querySelector('button[type="submit"]');toggleProgressBar(s,!0);const i={numSteps:r,email:t,steps:n},a=JSON.stringify(i);fetch("../php/create_commission.php",{method:"POST",body:a,header:{"Content-Type":"application/json"}}).then((e=>{if(409==e.status&&alert("This email address has too many active postings. Contact us if you would like to close an active posting."),e.status>=400){throw document.querySelector("#main").reset(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e);document.querySelector("#main").reset(),document.getElementById("checkpoints-output").textContent=1,onSliderChange();let o=`${extractURLRoot(document.location.href)}/commission/${t}`;toggleProgressBar(s,!1),activateResultCard(o)})).catch((e=>{toggleProgressBar(s,!1),console.error("Error:",e)}))}function createListing(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=document.getElementById("price").value;if(isNaN(r)||""===r)return alert("Error: Invalid Price"),!1;let n=document.getElementById("file").files[0];if(!n)return alert("Error: No File"),!1;let s=n.name,i=n.size;const a=document.querySelector('button[type="submit"]');return toggleProgressBar(a,!0),new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(n)})).then((function(e){let o=null;isImage(n)&&(o=savePreviewAsBase64());let l=new FormData;l.append("email",t),l.append("price",r),l.append("preview",o),l.append("file",e),l.append("name",s),l.append("size",i),fetch("../php/submit.php",{method:"POST",body:l}).then((e=>{if(413==e.status?alert("The file is too big. The maximum file size is 4MB"):409==e.status&&alert("This email address has too many active postings. Contact us if you would like to close an active posting."),e.status>=400){throw document.getElementById("main").reset(),defaultPreview("preview"),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e),o=`${extractURLRoot(document.location.href)}/listing/${t}`;document.getElementById("main").reset(),toggleProgressBar(a,!1),defaultPreview("preview"),activateResultCard(o)})).catch((e=>{console.error("Error:",e),toggleProgressBar(a,!1)}))}),(function(e){console.error(e)})),!0}function requestDownload(e,t,o){let r=new FormData;r.append("listing",e),r.append("order",t),fetch("../php/download.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}function requestCommissionDownload(e,t,o){fetch(`../php/commission_download.php?commission=${e}&step=${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then((e=>{if(200!=e.status)throw new Error(`Status code: ${e.status}`);return e.json()})).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}async function completeCommissionPayment(e,t,o){let r=new FormData;return r.append("commission",e),r.append("order",t),new Promise((e=>{fetch("../php/commission_pay.php",{method:"POST",body:r}).then((e=>e.json())).then((t=>{e(t)})).catch((e=>{console.error("Error:",e)}))}))}function uploadCommissionFile(e,t){e.preventDefault();let o=document.getElementById("file").files[0];if(!o)return alert("Error: No File"),!1;const r=document.querySelector('button[type="submit"]');toggleProgressBar(r,!0),new Promise(((e,t)=>{let r=new FileReader;r.onload=function(){e(r.result)},r.readAsDataURL(o)})).then((function(e){let n=null;isImage(o)&&(n=savePreviewAsBase64());let s=new FormData;s.append("preview",n),s.append("file",e),s.append("commission",t),fetch("../php/commission_file_upload.php",{method:"POST",body:s}).then((e=>{if(413==e.status){throw alert("The file is too big. The maximum file size is 4MB"),document.querySelector("#file").value="",defaultPreview("uploaded-file"),e.text()}return e.json()})).then((e=>{if(toggleProgressBar(r,!1),defaultPreview("uploaded-file"),updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current),e.current!==e.stepNumber){const t=e.currentStep.evidence;for(let o=0;o<3;o++){let r=o<t.length?t[o].file:null,n=o<t.length?t[o].description:null;updateEvidenceSlot(r,o+1,t.length,e.currentStep.status,e.commission,n)}}})).catch((e=>{toggleProgressBar(r,!1),console.error("Error:",e)}))})).catch((e=>{toggleProgressBar(r,!1),console.error("Error:",e)}))}function sendMessage(e){e.preventDefault();let t=document.querySelector("#email").value,o=document.querySelector("#message").value;if(!isEmailAddress(t))return alert("Enter a valid email"),!1;if(""===o)return alert("Message body empty"),!1;const r=document.querySelector('button[type="submit"]');toggleProgressBar(r,!0);let n=new FormData;n.append("email",t),n.append("message",o),fetch("../php/send_message.php",{method:"POST",body:n,header:{"Content-Type":"application/json"}}).then((e=>{document.querySelector("#main").reset(),toggleProgressBar(r,!1)})).error((e=>{toggleProgressBar(r,!1),console.error("Error: ",e)}))}async function fetchCommissionStep(e,t){return new Promise((o=>{fetch(`../php/commission_fetch_step.php?commission=${e}&step=${t}`,{method:"GET",header:{"Content-Type":"application/json"}}).then((e=>{if(200!==e.status)throw new Error(`Status code: ${e.status}`);o(e.json())})).then((e=>e)).catch((e=>{console.error("Error",e)}))}))}function uploadEvidence(e,t,o){let r=e.files[0];if(!r)return console.error("Error: Invalid file"),!1;const n=document.querySelector(`.evidence-slot-container[data-index='${o}']`);toggleProgressBar(n,!0),new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(r)})).then((function(e){const o=n.querySelector("input").value;let r=new FormData;r.append("file",e),r.append("commission",t),r.append("description",o),fetch("../php/commission_add_evidence.php",{method:"POST",body:r}).then((e=>(413==e.status&&(toggleProgressBar(descriptionField.false),alert("The file is too big. The maximum file size is 4MB")),e.json()))).then((e=>{toggleProgressBar(n,!1);const t=e.evidenceCount;updateEvidenceSlot(e.newEvidence,t,t,0,e.commission,e.description);for(let o=t;o<3;o++)updateEvidenceSlot(null,o+1,t,0,e.commission,null);updatePreview(0)})).catch((e=>{toggleProgressBar(n,!1),console.error("Error",e)}))}))}function removeEvidence(e,t,o){let r=new FormData;r.append("commission",t),r.append("evidence",e),fetch("../php/commission_delete_evidence.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{for(let o=0;o<3;o++){let r=o<e.length?e[o].file:null,n=o<e.length?e[o].description:null;updateEvidenceSlot(r,o+1,e.length,0,t,n)}updatePreview(0)})).catch((e=>{console.error("Error",e)}))}function activateCard(e){let t=document.getElementById(e);-1!==t.className.indexOf("disabled")&&(t.className="card"),document.getElementById("main").className="content blur";let a=Array.from(document.getElementsByTagName("input")),n=Array.from(document.getElementsByTagName("button"));a.concat(n).forEach((e=>{-1===e.className.indexOf("card-button")&&(e.disabled=!0)}));let c=Array.from(document.getElementsByClassName("steps-bar-circle")),l=Array.from(document.getElementsByTagName("a"));c.concat(l).forEach((e=>{e.classList.toggle("disabled",!0)}));let o=document.getElementsByClassName("clickable-rect");for(const e of o)e.onclick=null;let m=document.getElementById("file");m&&(m.className="file-button")}function disableCard(e){document.getElementById(e).className="card disabled",document.getElementById("main").className="content";let t=Array.from(document.getElementsByTagName("input")),a=Array.from(document.getElementsByTagName("button"));t.concat(a).forEach((e=>{e.disabled=!1}));let n=Array.from(document.getElementsByClassName("steps-bar-circle")),c=Array.from(document.getElementsByTagName("a"));n.concat(c).forEach((e=>{e.classList.toggle("disabled",!1)}));let l=document.getElementsByClassName("clickable-rect");for(const e of l)e.onclick=toggleBurgerMenu;let o=document.getElementById("file");o&&(o.className="file-button hoverable")}function cardActive(e){return-1!==document.getElementById(e).className.indexOf("disabled")}function activateResultCard(e){document.getElementById("copy-button").innerText="Copy";document.getElementById("result-card-text").innerText=e,activateCard("result-card")}async function copyLink(){const e=document.getElementById("result-card-text").innerText;await navigator.clipboard.writeText(e);document.getElementById("copy-button").innerText="Copied!"}function activateEvidenceCard(e){document.querySelector("#evidence-card img").src=e,activateCard("evidence-card")}