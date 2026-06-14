"use strict";var __morbis_feature=(()=>{var d=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var T=(t,e)=>{for(var n in e)d(t,n,{get:e[n],enumerable:!0})},k=(t,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of S(e))!E.call(t,i)&&i!==n&&d(t,i,{get:()=>e[i],enumerable:!(o=y(e,i))||o.enumerable});return t};var I=t=>k(d({},"__esModule",{value:!0}),t);var B={};T(B,{fetchFileFromUrl:()=>u,injectSharedCSS:()=>f,safeFetch:()=>c,showErrorToast:()=>v,toggleProcessingState:()=>g});var m=!1;function f(){if(m||document.getElementById("ext-batch-shared-style"))return;let t=document.createElement("link");t.id="ext-batch-shared-style",t.rel="stylesheet",t.href=chrome.runtime.getURL("features/shared/batch-ui.css"),document.head.appendChild(t),m=!0,console.log("[SharedUtils] CSS injected")}async function c(t,e={},n=2){try{let o=new AbortController,i=setTimeout(()=>o.abort(),3e4),a=await fetch(t,{...e,signal:o.signal});return clearTimeout(i),a}catch(o){if(n>0&&o.name!=="AbortError")return await new Promise(i=>setTimeout(i,1e3)),c(t,e,n-1);throw o}}async function u(t,e){let n=await c(t,{method:"GET",mode:"cors",credentials:"omit"});if(!n.ok)throw new Error(`HTTP ${n.status}`);let o=await n.blob();return new File([o],e,{type:o.type})}async function P(t,e){try{let n=await u(t,e),o=URL.createObjectURL(n);h(o,e,()=>URL.revokeObjectURL(o))}catch(n){console.error("[Preview] Fetch error:",n),h(t,e)}}function h(t,e,n=null){let o=document.getElementById("ext-inline-preview-modal");o&&o.remove();let i=e.toLowerCase().split(".").pop()||"",a=i==="pdf",x=["jpg","jpeg","png","gif","webp"].includes(i),r=document.createElement("div");r.id="ext-inline-preview-modal";let b=a?`<iframe id="ext-inline-preview-iframe" src="${t}"></iframe>`:x?`<img id="ext-inline-preview-img" src="${t}" loading="lazy">`:`
        <div class="ext-inline-preview-error">
          <div style="font-size: 18px; color: #ef4444;">\u{1F4C4}</div>
          <div>Format tidak didukung</div>
        </div>`;r.innerHTML=`
    <div class="ext-inline-preview-header">
      <span class="ext-inline-preview-filename" title="${e}">${e}</span>
      <button class="ext-inline-preview-btn" id="ext-preview-newtab">Tab Baru</button>
      <button class="ext-inline-preview-close" id="ext-preview-close">\u2715</button>
    </div>
    <div class="ext-inline-preview-content">
      ${b}
    </div>`,document.body.appendChild(r),r.focus();let p=document.getElementById("ext-preview-close"),w=document.getElementById("ext-preview-newtab"),s=()=>{n&&n(),r.remove()};p&&(p.onclick=s),w&&(w.onclick=()=>{window.open(t,"_blank"),s()}),r.onclick=l=>{l.target===r&&s()},document.onkeydown=l=>{l.key==="Escape"&&s()}}function g(t,e){t.forEach(n=>{let o=document.getElementById(n);o&&(o.style.opacity=e?"0.5":"1",o.style.cursor=e?"not-allowed":"pointer")})}function v(t){let e=document.createElement("div");e.style.cssText=`
    position: fixed; top: 20px; right: 20px;
    background: #ef4444; color: white; padding: 12px 20px;
    border-radius: 6px; z-index: 10001; font-weight: 500;
    box-shadow: 0 4px 12px rgba(239,68,68,0.4);
  `,e.textContent=`Error: ${t}`,document.body.appendChild(e),setTimeout(()=>e.remove(),5e3)}window.SharedBatchUtils={injectSharedCSS:f,safeFetch:c,showInlinePreviewSafe:P,toggleProcessingState:g,showErrorToast:v};console.log("[SharedUtils] Loaded");return I(B);})();
