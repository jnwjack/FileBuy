function isImage(t){return!(!t||!t.name.toLowerCase().match(".(png|jpg|gif|jpeg)$"))}function isEmailAddress(t){return!(!t||!t.match("^[^@]+@[^@]+.[^@]+$"))}function formatBytes(t,r=0){if(units=["bytes","KB","MB"],t<1e3||3===r)return t.toString(10)+" "+units[r];let n=t/1e3;return n=n.toFixed(2),formatBytes(n,++r)}function formatPrice(t){return t.toFixed(2)}function truncateString(t){return t.length>15?t.substring(0,15)+"...":t}function validateEmail(t,r){return t!==r?(alert("Error: Email and Email Confirm must match"),!1):!!isEmailAddress(t)||(alert("Error: Invalid Email"),!1)}function extractURLRoot(t){let r=0,n=0;for(;r<3&&-1!==n;)n=t.indexOf("/",n+1),r++;return t.substring(0,n)}function removeQuotes(t){return t.replace('"',"")}function activateCard(e){let t=document.getElementById(e);-1!==t.className.indexOf("disabled")&&(t.className="card"),document.getElementById("main").className="content blur";let n=Array.from(document.getElementsByTagName("input")),a=Array.from(document.getElementsByTagName("button"));n.concat(a).forEach((e=>{-1===e.className.indexOf("card-button")&&(e.disabled=!0)}));let c=document.getElementsByClassName("clickable-rect");for(const e of c)e.onclick=null;let l=document.getElementById("file");l&&(l.className="file-button")}function disableCard(e){document.getElementById(e).className="card disabled",document.getElementById("main").className="content";let t=Array.from(document.getElementsByTagName("input")),n=Array.from(document.getElementsByTagName("button"));t.concat(n).forEach((e=>{e.disabled=!1}));let a=document.getElementsByClassName("clickable-rect");for(const e of a)e.onclick=toggleBurgerMenu;let c=document.getElementById("file");c&&(c.className="file-button hoverable")}function cardActive(e){return-1!==document.getElementById(e).className.indexOf("disabled")}function activateResultCard(e){document.getElementById("copy-button").innerText="Copy";document.getElementById("result-card-text").innerText=e,activateCard("result-card")}async function copyLink(){const e=document.getElementById("result-card-text").innerText;await navigator.clipboard.writeText(e);document.getElementById("copy-button").innerText="Copied!"}function defaultPreview(){let e=document.getElementById("preview"),t=e.getContext("2d");e.className="",t.font="22px serif";let n=e.width/6,l=e.height/6;for(let e=0;e<6;e++)for(let a=0;a<6;a++){let i=(e+a)%2==0?"rgb(191, 191, 191)":"rgb(255, 255, 255)";t.fillStyle=i,t.fillRect(e*n,a*l,n,l)}}function generatePreview(e){if(e){let t=new FileReader,n=new Image;t.onload=function(){n.src=t.result};let l=document.getElementById("preview"),a=l.getContext("2d");n.onload=function(){isImage(e)&&a.drawImage(n,0,0,l.width,l.height)},t.readAsDataURL(e),isImage(e)&&!l.className.includes("blur")&&(l.className+="blur")}else defaultPreview()}function savePreviewAsBase64(){return document.getElementById("preview").toDataURL("image/jpeg",.05)}function savePreviewAsBlob(){let e=document.getElementById("preview");return new Promise((function(t,n){e.toBlob((function(e){t(e)}))}))}function setCanvasImageFromBase64(e,t){let n=new Image;n.src=e;let l=document.getElementById(t),a=l.getContext("2d");n.onload=function(){a.drawImage(n,0,0,l.width,l.height),l.className+="blur"}}function onSliderChange(){const e=document.getElementsByClassName("step"),t=parseInt(document.getElementById("checkpoints").value);let s=0;for(;s<4;)s<t?e[s].classList.toggle("invisible",!1):e[s].classList.toggle("invisible",!0),s++}function onSliderInput(){const e=document.getElementById("checkpoints");document.getElementById("checkpoints-output").textContent=e.value}function stepsBarFragment(e){const t=document.createElement("div");return t.className="steps-bar-fragment",t.classList.toggle("completed",e),t}function stepsBarCircle(e){const t=document.createElement("div");t.className="steps-bar-circle-wrapper";const s=document.createElement("div");return s.className="steps-bar-circle",s.classList.toggle("current",e),t.appendChild(s),t}function updateMilestoneSectionVisibilityAndText(e){const t=e.title,s=e.price,n=e.description,c=e.preview,l=e.status;document.getElementById("current-step-title").textContent=`${t} - $${formatPrice(s)}`,document.getElementById("current-step-description").textContent=n;let i=document.querySelector("#preview-section"),o=document.querySelector("#file-upload-section");l%2!=0?(i.classList.toggle("invisible",!1),o.classList.toggle("invisible",!0),c?setCanvasImageFromBase64(c,"uploaded-file"):generatePreview(null)):(i.classList.toggle("invisible",!0),o.classList.toggle("invisible",!1)),l<2?(document.querySelector("#paypal-section").classList.toggle("invisible",!1),document.querySelector("#download-button").classList.toggle("invisible",!0),document.querySelector("#paypal-section-complete").classList.toggle("invisible",!0)):(document.querySelector("#paypal-section").classList.toggle("invisible",!0),document.querySelector("#download-button").classList.toggle("invisible",!1),document.querySelector("#paypal-section-complete").classList.toggle("invisible",!1))}function updateProgressBar(e,t){const s=document.querySelectorAll(".steps-bar-circle").length,n=document.querySelector("#steps-bar");for(;n.firstElementChild;)n.firstElementChild.remove();n.appendChild(stepsBarFragment(!0));for(let c=0;c<s;c++){let s=stepsBarCircle(c===t-1);n.appendChild(s),n.appendChild(stepsBarFragment(c<e-1))}setCircleCallbacks(current,current);const c=document.querySelectorAll(".steps-bar-circle"),l=c[t-1];if(!l.classList.contains("current")){c[t-2].classList.toggle("current",!1)}l.classList.toggle("current",!0)}function setCircleAsCurrent(e){const t=document.querySelector(".steps-bar-circle.current"),s=document.querySelectorAll(".steps-bar-circle")[e-1];t.classList.toggle("current",!1),s.classList.toggle("current",!0)}function circleCallback(e,t,s){return async()=>{if(e>=s||e===t-1)return;let n=await fetchCommissionStep(commissionID,e+1);setCircleAsCurrent(n.stepNumber),updateMilestoneSectionVisibilityAndText(n.step);document.querySelector("#download-button").onclick=()=>requestCommissionDownload(n.commission,e+1,n.step.title);const c=document.querySelectorAll(".steps-bar-circle");for(let e=0;e<=s-1;e++)c[e].onclick=circleCallback(e,n.stepNumber,n.current)}}function setCircleCallbacks(e,t){const s=document.querySelectorAll(".steps-bar-circle");for(let n=0;n<t;n++){s[n].onclick=circleCallback(n,e,t)}}function displayMilestone(e,t,s,n,c){document.querySelector("#download-button").onclick=()=>requestCommissionDownload(c,e,n.title);const l=document.getElementById("steps-bar");l.appendChild(stepsBarFragment());for(let n=0;n<t;n++){let t=stepsBarCircle(n===e-1);l.appendChild(t),l.appendChild(stepsBarFragment(n<e-1||s))}setCircleCallbacks(e,e),updateMilestoneSectionVisibilityAndText(n),status<2&&paypal.Buttons({createOrder:async function(e,t){let s=new FormData;s.append("commission",c);const n=await fetch("../php/commission_order.php",{method:"POST",body:s});return await n.text()},onApprove:function(e,t){return t.order.capture().then((function(e){completeCommissionPayment(c,e.id,"filename").then((e=>{e&&(updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current),e.current>e.stepNumber&&requestCommissionDownload(e.commission,e.stepNumber,e.currentStep.title))}))}))}}).render("#paypal-button-container")}function createCommission(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=parseInt(document.getElementById("checkpoints").value);if(isNaN(r)||r<0||r>4)return!1;let n=[];for(let e=1;e<=r;e++){let t=document.getElementById(`step${e}-price`).value;if(isNaN(t)||""===t)return alert("Error: Invalid Price"),!1;let o=document.getElementsByName(`step${e}`)[0].value,r=document.getElementById(`step${e}-description`).value;n.push({title:o,price:t,description:r})}toggleButtonProgressBar(!0);const a={numSteps:r,email:t,steps:n},s=JSON.stringify(a);fetch("../php/create_commission.php",{method:"POST",body:s,header:{"Content-Type":"application/json"}}).then((e=>e.text())).then((e=>{let t=removeQuotes(e);document.querySelector(".content").reset(),document.getElementById("checkpoints-output").textContent=1,onSliderChange();let o=`${extractURLRoot(document.location.href)}/commission/${t}`;toggleButtonProgressBar(!1),activateResultCard(o)})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function createListing(e){e.preventDefault();let t=document.getElementById("email").value,o=document.getElementById("confirm").value;if(!validateEmail(t,o))return!1;let r=document.getElementById("price").value;if(isNaN(r)||""===r)return alert("Error: Invalid Price"),!1;let n=document.getElementById("file").files[0];if(!n)return alert("Error: No File"),!1;let a=n.name,s=n.size;return toggleButtonProgressBar(!0),new Promise(((e,t)=>{let o=new FileReader;o.onload=function(){e(o.result)},o.readAsDataURL(n)})).then((function(e){let o=savePreviewAsBase64(),n=new FormData;n.append("email",t),n.append("price",r),n.append("preview",o),n.append("file",e),n.append("name",a),n.append("size",s),fetch("../php/submit.php",{method:"POST",body:n}).then((e=>e.text())).then((e=>{let t=removeQuotes(e),o=`${extractURLRoot(document.location.href)}/listing/${t}`;document.getElementById("main").reset(),toggleButtonProgressBar(!1),defaultPreview(),activateResultCard(o)})).catch((e=>{console.error("Error:",e),toggleButtonProgressBar(!1)}))}),(function(e){console.error(e)})),!0}function requestDownload(e,t,o){let r=new FormData;r.append("listing",e),r.append("order",t),fetch("../php/download.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}function requestCommissionDownload(e,t,o){fetch(`../php/commission_download.php?commission=${e}&step=${t}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then((e=>{if(200!=e.status)throw new Error(`Status code: ${e.status}`);return e.json()})).then((e=>{let t=document.createElement("a");t.download=o||"download",t.href=e,t.click()})).catch((e=>{console.error("Error:",e)}))}async function completeCommissionPayment(e,t,o){let r=new FormData;return r.append("commission",e),r.append("order",t),new Promise((e=>{fetch("../php/commission_pay.php",{method:"POST",body:r}).then((e=>e.json())).then((t=>{e(t)})).catch((e=>{console.error("Error:",e)}))}))}function uploadCommissionFile(e,t){e.preventDefault();let o=document.getElementById("file").files[0];if(!o)return alert("Error: No File"),!1;toggleButtonProgressBar(!0),new Promise(((e,t)=>{let r=new FileReader;r.onload=function(){e(r.result)},r.readAsDataURL(o)})).then((function(e){let o=savePreviewAsBase64(),r=new FormData;r.append("preview",o),r.append("file",e),r.append("commission",t),fetch("../php/commission_file_upload.php",{method:"POST",body:r}).then((e=>e.json())).then((e=>{toggleButtonProgressBar(!1),defaultPreview(),updateProgressBar(e.current,e.stepNumber),updateMilestoneSectionVisibilityAndText(e.currentStep),setCircleCallbacks(e.stepNumber,e.current)}))})).catch((e=>{toggleButtonProgressBar(!1),console.error("Error:",e)}))}function sendMessage(e){e.preventDefault();let t=document.querySelector("#email").value,o=document.querySelector("#message").value;if(!isEmailAddress(t))return alert("Enter a valid email"),!1;if(""===o)return alert("Message body empty"),!1;toggleButtonProgressBar(!0);let r=new FormData;r.append("email",t),r.append("message",o),fetch("../php/send_message.php",{method:"POST",body:r,header:{"Content-Type":"application/json"}}).then((e=>{document.querySelector("#main").reset(),toggleButtonProgressBar(!1)})).error((e=>{toggleButtonProgressBar(!1),console.error("Error: ",e)}))}async function fetchCommissionStep(e,t){return new Promise((o=>{fetch(`../php/commission_fetch_step.php?commission=${e}&step=${t}`,{method:"GET",header:{"Content-Type":"application/json"}}).then((e=>{if(200!==e.status)throw new Error(`Status code: ${e.status}`);o(e.json())})).then((e=>e)).catch((e=>{console.error("Error",e)}))}))}function toggleButtonProgressBar(t){document.getElementById("submit-button-text").classList.toggle("disabled",t),document.getElementById("progress-bar").classList.toggle("invisible",!t)}