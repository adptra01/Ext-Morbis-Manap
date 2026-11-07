"use strict";var __morbis_feature=(()=>{var G="extensionConfig";function Q(d,b,g){let s=b?.features?.[d];if(!s)return!0;if(s.enabled===!1)return!1;let m=g??b?.currentRole??"admin";if(m==="admin")return!0;let p=s.allowedRoles;return!Array.isArray(p)||p.length===0?!0:p.includes(m)}async function Z(d){try{let g=(await chrome.storage.sync.get(G))?.[G]??null;return Q(d,g)}catch{return!0}}function z(d,b){Z(d).then(g=>{if(g)try{b()}catch(s){console.error(`[featureGate:${d}] gagal jalan:`,s)}})}z("billingAdjustment",function(){"use strict";let d="data-ext-billing-adj",s=0,m=null,p=!1;function S(){m!==null&&(clearInterval(m),m=null)}function W(){return document.documentElement.getAttribute(d)==="1"}function i(e){return document.querySelector(e)?.value??""}function l(e){if(!e)return 0;let a=String(e).replace(/[.,](?=\d{3}(?:[.,]|$))/g,"").replace(/[.,](?=\d{1,2}$)/,".");return parseFloat(a)||0}function u(e){return e.toLocaleString("id-ID").replace(/,/g,".")}function y(e,t){let a=e.match(new RegExp("^"+t+"_(\\d+)$"));return a?a[1]:null}function N(){if(document.getElementById("ext-billing-adj-css"))return;let e=document.createElement("style");e.id="ext-billing-adj-css",e.textContent=`
      #totalharga.ext-billing-editable,
      #pembulatanShow.ext-billing-editable,
      #ext-total-jasa.ext-billing-editable {
        background: #fef3c7 !important;
        border: 2px solid #f59e0b !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 600;
        color: #92400e;
        cursor: text;
        min-width: 100px;
        text-align: right;
      }
      #totalharga.ext-billing-editable:focus,
      #pembulatanShow.ext-billing-editable:focus,
      #ext-total-jasa.ext-billing-editable:focus {
        border-color: #d97706 !important;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
        outline: none;
      }
      .ext-billing-total-display {
        background: #dbeafe !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 700;
        color: #1e40af;
        min-width: 120px;
        text-align: right;
        display: inline-block;
      }
      .ext-billing-regen-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
      }
      .ext-billing-regen-btn:hover { background: #1d4ed8; }
      .ext-billing-regen-btn:active { background: #1e40af; }
      .ext-billing-regen-btn svg { width: 14px; height: 14px; }
      .ext-billing-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 8px;
      }
      .ext-billing-status.ok { background: #d1fae5; color: #065f46; }
      .ext-billing-status.warning { background: #fef3c7; color: #92400e; }
      .ext-billing-auto-mode {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        margin-left: 4px;
        background: #e0e7ff;
        color: #3730a3;
      }
    `,document.head.appendChild(e)}function T(e,t){document.querySelector(".ext-billing-status")?.remove();let a=document.createElement("span");a.className="ext-billing-status "+t,a.textContent=e;let n=document.querySelector(".ext-billing-regen-btn");n?.parentElement&&n.parentElement.insertBefore(a,n.nextSibling),setTimeout(()=>a.remove(),3e3)}function M(e){let t=l(i("#harga_"+e)),a=l(i("#frekuensi_"+e)),n=l(i("#diskon_"+e)),o=t*a-n,r=document.querySelector("#total_"+e);return r&&(r.value=u(o)),o}function w(){let e=0;return document.querySelectorAll('input[id^="total_"]').forEach(t=>{y(t.id,"total")&&(e+=l(t.value))}),e}function I(){let e=document.querySelectorAll("table");for(let t of Array.from(e))for(let a of Array.from(t.querySelectorAll("tr"))){let n=a.querySelectorAll("td");if(!n.length||n[0].textContent.trim()!=="Total")continue;let o=(n[1]?.textContent??"").match(/Tunai\s*:?\s*([\d.]+)/);if(o)return l(o[1])}return 0}function k(e){let a=document.querySelectorAll("table")[1]?.querySelector("b"),n=document.querySelector("#ext-total-jasa");n?n.value=u(e):a&&(a.textContent=u(e));let o=document.querySelector("#total_billing");o&&(o.value=String(Math.round(e)))}function c(){let e=l(i("#totalharga")),t=l(i("#biaya_adm")),a=l(i("#biaya_materai")),n=l(i("#diskon")),o=l(i("#klaim_bpjs")),r=l(i("#tarik_uang_muka")),h=l(i("#pembulatanShow")),L=l(i("#bayar")),E=e+t+a-n-o+r+h,H=document.querySelector("#total_belum_dibayar");H&&(H.value=String(Math.round(E)));let _=document.querySelector("#pembulatan"),C=document.querySelector("#pembulatanShow");_&&C&&(_.value=C.value);let v=Array.from(document.querySelectorAll("td")).find(f=>f.textContent.trim().toLowerCase()==="total belum dibayar")?.parentElement?.querySelector("td:last-child");if(v&&!v.querySelector("input")){let f=v.querySelector(".ext-billing-total-display");f||(v.textContent="",f=document.createElement("span"),f.className="ext-billing-total-display",v.appendChild(f)),f.textContent=u(E)}let j=Math.max(0,L-E),B=document.querySelector("#kembali2"),R=document.querySelector("#kembali1");B&&(B.value=String(j)),R&&(R.textContent=u(j));let q=Math.max(0,E-L),K=document.querySelector("#sisaTagihan2"),F=document.querySelector("#sisaTagihan1");K&&(K.value=String(q)),F&&(F.textContent=u(q));let D=document.querySelector("#total1");D&&(D.textContent=L>=E?"0":u(q))}function x(e,t){e.dataset.extRtBound!=="1"&&(e.dataset.extRtBound="1",e.addEventListener("input",t),e.addEventListener("keyup",t),e.addEventListener("change",t))}function A(){document.querySelectorAll('input[id^="frekuensi_"]').forEach(o=>{let r=y(o.id,"frekuensi");r&&M(r)});let e=w(),t=document.querySelector("#ext-total-jasa");if(t){t.value=u(e),t.dataset.autoMode="true";let o=document.querySelector("#totaljasa-auto-indicator");o&&(o.style.display="")}k(e);let a=e+I(),n=document.querySelector("#totalharga");n&&(n.value=u(a),n.dataset.original=n.value),c(),T("Regenerated: "+u(a),"ok")}function O(){let e=document.querySelectorAll("table"),t=e[1]?.querySelector("td:last-child"),a=e[1]?.querySelector("b");if(!t||document.querySelector("#ext-total-jasa"))return;let n=document.createElement("input");n.type="text",n.id="ext-total-jasa",n.className="ext-billing-editable",n.value=a?.textContent.trim()??i("#total_billing"),n.dataset.autoMode="true",a?a.replaceWith(n):t.prepend(n);let o=document.createElement("span");o.className="ext-billing-auto-mode",o.textContent="AUTO",o.id="totaljasa-auto-indicator",n.after(o),x(n,()=>{n.dataset.autoMode="false",o.style.display="none",k(l(n.value)),c()}),n.addEventListener("blur",()=>T("Total jasa diupdate","ok")),n.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),n.blur())})}function P(){let e=document.querySelector("#totalharga");!e||e.dataset.extBillingBound==="1"||(e.dataset.extBillingBound="1",e.classList.add("ext-billing-editable"),e.dataset.original=e.value,x(e,()=>{c()}),e.addEventListener("blur",()=>{e.dataset.original=e.value,T("Total diupdate","ok")}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),e.blur())}))}function $(){let e=document.querySelector("#pembulatanShow");!e||e.dataset.extBillingBound==="1"||(e.dataset.extBillingBound="1",e.removeAttribute("readonly"),e.readOnly=!1,e.removeAttribute("disabled"),e.disabled=!1,e.classList.add("ext-billing-editable"),e.dataset.original=e.value,x(e,()=>{c()}),e.addEventListener("blur",()=>{e.dataset.original=e.value}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),e.blur())}))}function J(){if(document.documentElement.dataset.extBillingRows==="1")return;document.documentElement.dataset.extBillingRows="1";let e=t=>{let a=t.target;if(!(a instanceof HTMLInputElement))return;let n=y(a.id,"frekuensi")??y(a.id,"harga")??y(a.id,"diskon");if(!n)return;M(n);let o=w(),r=document.querySelector("#ext-total-jasa");r&&r.dataset.autoMode!=="false"&&(r.value=u(o)),k(o);let h=document.querySelector("#totalharga");h&&(h.value=u(o+I())),c()};document.addEventListener("input",e),document.addEventListener("keyup",e),document.addEventListener("change",e)}function X(){["biaya_adm","biaya_materai","diskon","klaim_bpjs","tarik_uang_muka","bayar"].forEach(t=>{let a=document.querySelector("#"+t);a&&x(a,c)});let e=document.querySelector("#diskon_dalam_persen");e&&x(e,()=>{let t=l(e.value),a=l(i("#totalharga")),n=document.querySelector("#diskon");n&&(n.value=u(a*t/100)),c()})}function U(){if(document.querySelector(".ext-billing-regen-btn"))return;let e=document.querySelector("button");if(!e?.parentElement)return;let t=document.createElement("button");t.type="button",t.className="ext-billing-regen-btn",t.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Regenerate Total',t.addEventListener("click",A),e.parentElement.insertBefore(t,e.nextSibling)}function V(){document.documentElement.dataset.extBillingKeys!=="1"&&(document.documentElement.dataset.extBillingKeys="1",document.addEventListener("keydown",e=>{if(e.ctrlKey&&e.shiftKey&&e.key==="R"&&(e.preventDefault(),A()),e.ctrlKey&&e.shiftKey&&e.key==="T"){e.preventDefault();let t=document.querySelector("#totalharga");t?.focus(),t?.select()}if(e.ctrlKey&&e.shiftKey&&e.key==="P"){e.preventDefault();let t=document.querySelector("#pembulatanShow");t?.focus(),t?.select()}}))}function Y(){p||(p=!0,N(),O(),P(),$(),J(),X(),U(),V(),c(),console.log("[BillingAdj] initialized"))}m=window.setInterval(()=>{if(s++,!W()){s>=150&&S();return}document.querySelector("#totalharga")&&document.querySelector("#pembulatanShow")?(S(),Y()):s>=150&&S()},100)});})();
