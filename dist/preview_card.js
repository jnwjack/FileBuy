function activateCard(e){let t=document.getElementById(e);-1!==t.className.indexOf("disabled")&&(t.className="card"),document.getElementById("main").className="content blur";let a=Array.from(document.getElementsByTagName("input")),n=Array.from(document.getElementsByTagName("button"));a.concat(n).forEach((e=>{-1===e.className.indexOf("card-button")&&(e.disabled=!0)}));let c=Array.from(document.getElementsByClassName("steps-bar-circle")),l=Array.from(document.getElementsByTagName("a"));c.concat(l).forEach((e=>{e.classList.toggle("disabled",!0)}));let o=document.getElementsByClassName("clickable-rect");for(const e of o)e.onclick=null;let m=document.getElementById("file");m&&(m.className="file-button")}function disableCard(e){document.getElementById(e).className="card disabled",document.getElementById("main").className="content";let t=Array.from(document.getElementsByTagName("input")),a=Array.from(document.getElementsByTagName("button"));t.concat(a).forEach((e=>{e.disabled=!1}));let n=Array.from(document.getElementsByClassName("steps-bar-circle")),c=Array.from(document.getElementsByTagName("a"));n.concat(c).forEach((e=>{e.classList.toggle("disabled",!1)}));let l=document.getElementsByClassName("clickable-rect");for(const e of l)e.onclick=toggleBurgerMenu;let o=document.getElementById("file");o&&(o.className="file-button hoverable")}function cardActive(e){return-1!==document.getElementById(e).className.indexOf("disabled")}function activateResultCard(e){document.getElementById("copy-button").innerText="Copy";document.getElementById("result-card-text").innerText=e,activateCard("result-card")}async function copyLink(){const e=document.getElementById("result-card-text").innerText;await navigator.clipboard.writeText(e);document.getElementById("copy-button").innerText="Copied!"}function activateEvidenceCard(e){document.querySelector("#evidence-card img").src=e,activateCard("evidence-card")}