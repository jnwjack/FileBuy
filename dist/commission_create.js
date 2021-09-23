function onSliderChange(){const e=document.getElementsByClassName("step"),t=parseInt(document.getElementById("checkpoints").value);let n=0;for(;n<4;)n<t?e[n].classList.toggle("invisible",!1):e[n].classList.toggle("invisible",!0),n++}function onSliderInput(){const e=document.getElementById("checkpoints");document.getElementById("checkpoints-output").textContent=e.value}function stepsBarFragment(e){const t=document.createElement("div");return t.className="steps-bar-fragment",t.classList.toggle("completed",e),t}function stepsBarCircle(e){const t=document.createElement("div");t.className="steps-bar-circle-wrapper";const n=document.createElement("div");return n.className="steps-bar-circle",n.classList.toggle("current",e),t.appendChild(n),t}function updatePreview(e,t=null){let n=document.querySelector("#preview-section"),i=document.querySelector("#file-upload-section");e%2!=0?(n.classList.toggle("invisible",!1),i.classList.toggle("invisible",!0),t?setCanvasImageFromBase64(t,"uploaded-file"):generatePreview(null)):(n.classList.toggle("invisible",!0),i.classList.toggle("invisible",!1))}function updateMilestoneSectionVisibilityAndText(e){const t=e.title,n=e.price,i=e.description,c=e.preview,s=e.status;document.getElementById("current-step-title").textContent=`${t} - $${formatPrice(n)}`,document.getElementById("current-step-description").textContent=i,updatePreview(s,c),s<2?(document.querySelector("#paypal-section").classList.toggle("invisible",!1),document.querySelector("#download-button").classList.toggle("invisible",!0),document.querySelector("#paypal-section-complete").classList.toggle("invisible",!0)):(document.querySelector("#paypal-section").classList.toggle("invisible",!0),document.querySelector("#download-button").classList.toggle("invisible",!1),document.querySelector("#paypal-section-complete").classList.toggle("invisible",!1))}function updateProgressBar(e,t){const n=document.querySelectorAll(".steps-bar-circle").length,i=document.querySelector("#steps-bar");for(;i.firstElementChild;)i.firstElementChild.remove();i.appendChild(stepsBarFragment(!0));for(let c=0;c<n;c++){let n=stepsBarCircle(c===t-1);i.appendChild(n),i.appendChild(stepsBarFragment(c<e-1))}setCircleCallbacks(current,current);const c=document.querySelectorAll(".steps-bar-circle"),s=c[t-1];if(!s.classList.contains("current")){c[t-2].classList.toggle("current",!1)}s.classList.toggle("current",!0)}function setCircleAsCurrent(e){const t=document.querySelector(".steps-bar-circle.current"),n=document.querySelectorAll(".steps-bar-circle")[e-1];t.classList.toggle("current",!1),n.classList.toggle("current",!0)}function circleCallback(e,t,n){return async()=>{if(e>=n||e===t-1)return;let i=await fetchCommissionStep(commissionID,e+1);setCircleAsCurrent(i.stepNumber),updateMilestoneSectionVisibilityAndText(i.step),updateEvidence(i.step.status,i.step.evidence);document.querySelector("#download-button").onclick=()=>requestCommissionDownload(i.commission,e+1,i.step.title);const c=document.querySelectorAll(".steps-bar-circle");for(let e=0;e<=n-1;e++)c[e].onclick=circleCallback(e,i.stepNumber,i.current)}}function setCircleCallbacks(e,t){const n=document.querySelectorAll(".steps-bar-circle");for(let i=0;i<t;i++){n[i].onclick=circleCallback(i,e,t)}}function createEvidenceSlots(e,t){const n=document.querySelector(".evidence-box");for(let i=0;i<3;i++){let c=document.createElement("div");c.classList.toggle("evidence-slot-container",!0);let s=document.createElement("div");s.classList.toggle("evidence-slot",!0),c.dataset.index=i+1;let o=document.createElement("div");o.classList.toggle("evidence-button-container");let l=document.createElement("input");l.type="file",l.classList.toggle("evidence-button",!0),l.id=`e-file${c.dataset.index}`,l.accept="image/*",l.setAttribute("onchange",`uploadEvidence(this, '${e}', '${t}')`);let r=document.createElement("label");r.textContent="+",r.setAttribute("for",`e-file${c.dataset.index}`),o.append(l),o.append(r),o.classList.toggle("invisible",!0);let a=document.createElement("button");a.type="button",a.textContent="-",a.classList.toggle("evidence-remove",!0),a.setAttribute("onclick",`removeEvidence(${c.dataset.index}, '${e}', ${t})`),c.appendChild(s),c.appendChild(o),c.appendChild(a),n.appendChild(c)}}function addEvidenceToSlot(e,t,n){const i=document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-remove`);document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-button-container`).classList.toggle("invisible",!0),t>1?(i.classList.toggle("disabled",!0),i.setAttribute("onclick",void 0)):i.classList.toggle("invisible",!1);const c=document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-slot`);c.textContent="HAS FILE",c.setAttribute("onclick",`activateEvidenceCard('${n}')`)}function setEvidenceSlotAsLowestEmpty(e,t){if(e>3)return;const n=document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-slot`);n.textContent="ADD EVIDENCE",n.setAttribute("onclick",void 0);const i=document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-button-container`);if(document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-remove`).classList.toggle("invisible",!0),t>1){i.getElementsByTagName("label")[0].classList.toggle("disabled",!0);i.getElementsByTagName("input")[0].setAttribute("onclick",void 0)}else i.classList.toggle("invisible",!1)}function updateEvidence(e,t){t.forEach((t=>{addEvidenceToSlot(t.evidenceNumber,e,t.file)}));const n=t.length+1;setEvidenceSlotAsLowestEmpty(n,e);for(let e=n+1;e<=3;e++){let t=document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-button-container`),n=document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-remove`);t.classList.toggle("invisible",!0),n.classList.toggle("invisible",!0),document.querySelector(`.evidence-slot-container[data-index='${e}'] > .evidence-slot`).setAttribute("onchange",void 0)}}function displayMilestone(e,t,n,i,c){document.querySelector("#download-button").onclick=()=>requestCommissionDownload(c,e,i.title);const s=document.getElementById("steps-bar");s.appendChild(stepsBarFragment());for(let i=0;i<t;i++){let t=stepsBarCircle(i===e-1);s.appendChild(t),s.appendChild(stepsBarFragment(i<e-1||n))}setCircleCallbacks(e,e),updateMilestoneSectionVisibilityAndText(i),createEvidenceSlots(c,i.status),updateEvidence(i.status,i.evidence),status<2&&paypal.Buttons({createOrder:async function(e,t){let n=new FormData;n.append("commission",c);const i=await fetch("../php/commission_order.php",{method:"POST",body:n});return await i.text()},onApprove:function(e,t){return t.order.capture().then((function(e){completeCommissionPayment(c,e.id,"filename").then((e=>{if(e){if(updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current),e.currentStep.status>1){document.querySelectorAll(".evidence-slot-container > .evidence-button-container").forEach((e=>{e.getElementsByTagName("label")[0].classList.toggle("disabled",!0);e.getElementsByTagName("button")[0].setAttribute("onclick",void 0)}));document.querySelectorAll(".evidence-slot-container > .evidence-remove");evidenceButtons.forEach((e=>{e.classList.toggle("disabled",!0),e.setAttribute("onclick",void 0)}))}e.current>e.stepNumber&&requestCommissionDownload(e.commission,e.stepNumber,e.currentStep.title)}}))}))}}).render("#paypal-button-container")}function createCommission(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=parseInt(document.getElementById("checkpoints").value);if(isNaN(r)||r<0||r>4)return!1;let n=[];for(let e=1;e<=r;e++){let t=document.getElementById(`step${e}-price`).value;if(isNaN(t)||""===t)return alert("Error: Invalid Price"),!1;let o=document.getElementsByName(`step${e}`)[0].value,r=document.getElementById(`step${e}-description`).value;n.push({title:o,price:t,description:r})}toggleButtonProgressBar(!0);const a={numSteps:r,email:t,steps:n},i=JSON.stringify(a);fetch("../php/create_commission.php",{method:"POST",body:i,header:{"Content-Type":"application/json"}}).then((e=>{if(e.status>=400){throw document.querySelector("#main").reset(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e);document.querySelector("#main").reset(),document.getElementById("checkpoints-output").textContent=1,onSliderChange();let o=`${extractURLRoot(document.location.href)}/commission/${t}`;toggleButtonProgressBar(!1),activateResultCard(o)})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function createListing(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=document.getElementById("price").value;if(isNaN(r)||""===r)return alert("Error: Invalid Price"),!1;let n=document.getElementById("file").files[0];if(!n)return alert("Error: No File"),!1;let a=n.name,i=n.size;return toggleButtonProgressBar(!0),new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(n)})).then((function(e){let o=savePreviewAsBase64(),n=new FormData;n.append("email",t),n.append("price",r),n.append("preview",o),n.append("file",e),n.append("name",a),n.append("size",i),fetch("../php/submit.php",{method:"POST",body:n}).then((e=>{if(413==e.status&&alert("The file is too big. The maximum file size is 4MB"),e.status>=400){throw document.getElementById("main").reset(),defaultPreview(),e.text()}return e.text()})).then((e=>{let t=removeQuotes(e),o=`${extractURLRoot(document.location.href)}/listing/${t}`;document.getElementById("main").reset(),toggleButtonProgressBar(!1),defaultPreview(),activateResultCard(o)})).catch((e=>{console.error("Error:",e),toggleButtonProgressBar(!1)}))}),(function(e){console.error(e)})),!0}function requestDownload(e,t,o){let r=new FormData;r.append("listing",e),r.append("order",t),fetch("../php/download.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}function requestCommissionDownload(e,t,o){fetch(`../php/commission_download.php?commission=${e}&step=${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then((e=>{if(200!=e.status)throw new Error(`Status code: ${e.status}`);return e.json()})).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}async function completeCommissionPayment(e,t,o){let r=new FormData;return r.append("commission",e),r.append("order",t),new Promise((e=>{fetch("../php/commission_pay.php",{method:"POST",body:r}).then((e=>e.json())).then((t=>{e(t)})).catch((e=>{console.error("Error:",e)}))}))}function uploadCommissionFile(e,t){e.preventDefault();let o=document.getElementById("file").files[0];if(!o)return alert("Error: No File"),!1;toggleButtonProgressBar(!0),new Promise(((e,t)=>{let r=new FileReader;r.onload=function(){e(r.result)},r.readAsDataURL(o)})).then((function(e){let o=savePreviewAsBase64(),r=new FormData;r.append("preview",o),r.append("file",e),r.append("commission",t),fetch("../php/commission_file_upload.php",{method:"POST",body:r}).then((e=>{if(413==e.status){throw alert("The file is too big. The maximum file size is 4MB"),document.querySelector("#file").value="",defaultPreview(),e.text()}return e.json()})).then((e=>{toggleButtonProgressBar(!1),defaultPreview(),updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current)})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function sendMessage(e){e.preventDefault();let t=document.querySelector("#email").value,o=document.querySelector("#message").value;if(!isEmailAddress(t))return alert("Enter a valid email"),!1;if(""===o)return alert("Message body empty"),!1;toggleButtonProgressBar(!0);let r=new FormData;r.append("email",t),r.append("message",o),fetch("../php/send_message.php",{method:"POST",body:r,header:{"Content-Type":"application/json"}}).then((e=>{document.querySelector("#main").reset(),toggleButtonProgressBar(!1)})).error((e=>{toggleButtonProgressBar(!1),console.error("Error: ",e)}))}async function fetchCommissionStep(e,t){return new Promise((o=>{fetch(`../php/commission_fetch_step.php?commission=${e}&step=${t}`,{method:"GET",header:{"Content-Type":"application/json"}}).then((e=>{if(200!==e.status)throw new Error(`Status code: ${e.status}`);o(e.json())})).then((e=>e)).catch((e=>{console.error("Error",e)}))}))}function uploadEvidence(e,t,o){let r=e.files[0];if(!r)return console.error("Error: Invalid file"),!1;new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(r)})).then((function(e){let r=new FormData;r.append("file",e),r.append("commission",t),r.append("description","Temporary Description"),fetch("../php/commission_add_evidence.php",{method:"POST",body:r}).then((e=>(413==e.status&&alert("The file is too big. The maximum file size is 4MB"),e.json()))).then((e=>{addEvidenceToSlot(e.evidenceCount,o,e.newEvidence),setEvidenceSlotAsLowestEmpty(e.evidenceCount+1,o),updatePreview(0)})).catch((e=>{console.error("Error",e)}))}))}function removeEvidence(e,t,o){let r=new FormData;r.append("commission",t),r.append("evidence",e),fetch("../php/commission_delete_evidence.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{updateEvidence(o,e),updatePreview(0)})).catch((e=>{console.error("Error",e)}))}function isImage(t){return!(!t||!t.name.toLowerCase().match(".(png|jpg|gif|jpeg)$"))}function isEmailAddress(t){return!(!t||!t.match("^[^@]+@[^@]+.[^@]+$"))}function formatBytes(t,r=0){if(units=["bytes","KB","MB"],t<1e3||3===r)return t.toString(10)+" "+units[r];let n=t/1e3;return n=n.toFixed(2),formatBytes(n,++r)}function formatPrice(t){return t.toFixed(2)}function truncateString(t){return t.length>15?t.substring(0,15)+"...":t}function validateEmail(t,r){return t!==r?(alert("Error: Email and Email Confirm must match"),!1):!!isEmailAddress(t)||(alert("Error: Invalid Email"),!1)}function extractURLRoot(t){let r=0,n=0;for(;r<3&&-1!==n;)n=t.indexOf("/",n+1),r++;return t.substring(0,n)}function removeQuotes(t){return t.replace('"',"")}function toggleButtonProgressBar(e){document.getElementById("submit-button-text").classList.toggle("disabled",e),document.getElementById("progress-bar").classList.toggle("invisible",!e)}function priceInputCallback(e){e.srcElement.valueAsNumber>1e3&&(e.srcElement.valueAsNumber=1e3)}function activateCard(e){let t=document.getElementById(e);-1!==t.className.indexOf("disabled")&&(t.className="card"),document.getElementById("main").className="content blur";let a=Array.from(document.getElementsByTagName("input")),n=Array.from(document.getElementsByTagName("button")),c=Array.from(document.getElementsByClassName("steps-bar-circle")),o=Array.from(document.getElementsByClassName("paypal-button")),m=Array.from(document.getElementsByTagName("a")),l=a.concat(n).concat(c).concat(o).concat(m);console.log(l),l.forEach((e=>{-1===e.className.indexOf("card-button")&&(e.disabled=!0)}));let r=document.getElementsByClassName("clickable-rect");for(const e of r)e.onclick=null;let d=document.getElementById("file");d&&(d.className="file-button")}function disableCard(e){document.getElementById(e).className="card disabled",document.getElementById("main").className="content";let t=Array.from(document.getElementsByTagName("input")),a=Array.from(document.getElementsByTagName("button")),n=Array.from(document.getElementsByClassName("steps-bar-circle")),c=Array.from(document.getElementsByClassName("paypal-button")),o=Array.from(document.getElementsByTagName("a"));t.concat(a).concat(n).concat(c).concat(o).forEach((e=>{e.disabled=!1}));let m=document.getElementsByClassName("clickable-rect");for(const e of m)e.onclick=toggleBurgerMenu;let l=document.getElementById("file");l&&(l.className="file-button hoverable")}function cardActive(e){return-1!==document.getElementById(e).className.indexOf("disabled")}function activateResultCard(e){document.getElementById("copy-button").innerText="Copy";document.getElementById("result-card-text").innerText=e,activateCard("result-card")}async function copyLink(){const e=document.getElementById("result-card-text").innerText;await navigator.clipboard.writeText(e);document.getElementById("copy-button").innerText="Copied!"}function activateEvidenceCard(e){document.querySelector("#evidence-card img").src=e,activateCard("evidence-card")}