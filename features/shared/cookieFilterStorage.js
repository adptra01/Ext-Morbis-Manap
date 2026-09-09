"use strict";var __morbis_feature=(()=>{var p=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var S=(e,o)=>{for(var t in o)p(e,t,{get:o[t],enumerable:!0})},I=(e,o,t,n)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of L(o))!E.call(e,r)&&r!==t&&p(e,r,{get:()=>o[r],enumerable:!(n=C(o,r))||n.enumerable});return e};var F=e=>I(p({},"__esModule",{value:!0}),e);var T={};S(T,{CookieFilterStorage:()=>l,initClearAllFilterButton:()=>f,removeClearAllFilterButton:()=>c,setupFilterLogoutWatcher:()=>w});var g="ext-batch-shared-style";function B(){if(document.getElementById(g))return;let e=document.createElement("style");e.id=g,e.textContent=`
    .ext-modal-content {
      background: #ffffff; border-radius: 16px; padding: 28px 32px;
      max-width: 860px; width: 95%; max-height: 85vh; overflow-y: auto;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 40px -15px rgba(0,0,0,0.08);
      margin: auto; font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .ext-modal-content * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

    .ext-modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .ext-modal-header h3 {
      margin: 0; font-size: 18px; color: #0f172a; font-weight: 700;
      letter-spacing: -0.3px;
    }

    .ext-modal-close {
      width: 36px; height: 36px; font-size: 18px; color: #94a3b8;
      border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-weight: 500; transition: all 0.15s ease;
    }
    .ext-modal-close:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; transform: scale(1.05); }
    .ext-modal-close:active { transform: scale(0.95); }

    .ext-modal-buttons {
      margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;
    }

    .ext-btn {
      padding: 10px 22px; border: none; border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 600; transition: all 0.15s ease;
      letter-spacing: -0.1px; display: inline-flex; align-items: center; gap: 7px;
    }
    .ext-btn:active { transform: scale(0.97); }

    .ext-btn-primary { background: #2563eb; color: white; }
    .ext-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
    .ext-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

    .ext-btn-secondary { background: #ffffff; color: #334155; border: 1px solid #e2e8f0; }
    .ext-btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
    .ext-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .ext-btn-danger { background: #ef4444; color: white; }
    .ext-btn-danger:hover { background: #dc2626; box-shadow: 0 4px 12px rgba(239,68,68,0.2); }
    .ext-btn-danger:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }
    .ext-btn-danger.disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

    .ext-btn-purple {
      background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;
    }
    .ext-btn-purple:hover { background: #7c3aed; color: white; border-color: #7c3aed; box-shadow: 0 4px 12px rgba(124,58,237,0.2); }
    .ext-btn-purple:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

    .ext-warning-box {
      background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px;
      padding: 16px 18px; margin-bottom: 20px; color: #9a3412;
      font-size: 13px; line-height: 1.6;
    }
    .ext-warning-box strong { color: #7c2d12; }

    .ext-search-input {
      width: 100%; padding: 10px 14px; font-size: 13px;
      border: 1px solid #e2e8f0; border-radius: 10px; outline: none;
      color: #1e293b; background: #f8fafc; box-sizing: border-box;
      pointer-events: auto;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .ext-search-input:focus { border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.1); background: #fff; }
    .ext-search-input::placeholder { color: #94a3b8; }

    .ext-status-badge {
      font-size: 10px; padding: 3px 10px; background: #f1f5f9;
      border-radius: 20px; color: #475569; font-weight: 600;
      white-space: nowrap; border: 1px solid #e2e8f0;
      letter-spacing: 0.2px;
    }
    .ext-status-badge[data-status="success"] { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
    .ext-status-badge[data-status="error"] { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
    .ext-status-badge[data-status="deleting"] { background: #fffbeb; color: #92400e; border-color: #fde68a; }

    .ext-modal-content input,
    .ext-modal-content textarea,
    .ext-modal-content select,
    .ext-modal-content button {
      pointer-events: auto !important;
    }

    .ext-checkbox {
      margin-top: 4px; cursor: pointer; accent-color: #2563eb;
      width: 20px; height: 20px; flex-shrink: 0; border-radius: 4px;
    }

    .ext-checkbox-label {
      display: flex; gap: 12px; align-items: flex-start;
      cursor: pointer; flex: 1; min-width: 0;
    }

    .ext-delete-preview-item {
      padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 12px;
      display: flex; gap: 12px; align-items: flex-start;
      background: #fff; transition: background-color 0.15s ease;
    }
    .ext-delete-preview-item:hover { background: #f8fafc; }
    .ext-delete-preview-item.selected {
      background: #fef2f2; border-left: 3px solid #ef4444;
    }

    .ext-delete-preview-btn {
      padding: 7px 14px; background: #f8fafc; color: #475569;
      border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px;
      font-weight: 600; cursor: pointer; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px;
      transition: all 0.15s ease;
    }
    .ext-delete-preview-btn:hover { background: #475569; color: white; border-color: #475569; }
    .ext-delete-preview-btn:active { transform: scale(0.97); }
    .ext-delete-preview-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .ext-delete-single-btn {
      width: 32px; height: 32px; color: #dc2626; border-radius: 8px;
      background: #fef2f2; border: 1px solid #fecaca;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; flex-shrink: 0;
    }
    .ext-delete-single-btn:hover { background: #dc2626; color: white; border-color: #dc2626; }
    .ext-delete-single-btn:active { transform: scale(0.93); }

    .progress-fill {
      height: 100%; background: #2563eb; width: 0%;
      border-radius: 2px; transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ext-preview-item {
      padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px;
    }
    .ext-preview-item.success { color: #059669; }
    .ext-preview-item.error { color: #dc2626; }
    .ext-preview-item.pending { color: #64748b; }
  `,document.head.appendChild(e)}function b(e){return new Promise(o=>{B();let t=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",n=document.createElement("div");n.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",n.innerHTML=`
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${e.hideCancel?"":`<button class="ext-btn ext-btn-secondary" data-ext-cancel>${e.cancelLabel??"Batal"}</button>`}
          <button class="ext-btn ${t}" data-ext-ok>${e.okLabel??"Lanjut"}</button>
        </div>
      </div>`,n.querySelector("h3").textContent=e.title;let r=n.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((a,y)=>{y>0&&r.appendChild(document.createElement("br")),r.appendChild(document.createTextNode(a))});let i=a=>{n.remove(),document.removeEventListener("keydown",x),o(a)},x=a=>{a.key==="Escape"&&i(!1)};n.querySelector(".ext-modal-close").addEventListener("click",()=>i(!1)),n.addEventListener("click",a=>{a.target===n&&i(!1)}),n.querySelector("[data-ext-ok]").addEventListener("click",()=>i(!0));let u=n.querySelector("[data-ext-cancel]");u&&u.addEventListener("click",()=>i(!1)),document.addEventListener("keydown",x),document.body.appendChild(n)})}var s="_morbis_filter_",m=!1,d=null;function z(){let e=new Date;return e.setDate(e.getDate()+1),e.setHours(0,0,0,0),e}function j(e,o,t){document.cookie=e+"="+o+"; expires="+t+"; path=/; SameSite=Lax"}function h(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax"}var l={set:function(e,o){try{let t=encodeURIComponent(JSON.stringify(o));j(s+e,t,z().toUTCString())}catch(t){console.error("[CookieFilterStorage] set error:",e,t)}},get:function(e){try{let o=s+e+"=",t=document.cookie.split("; ");for(let n=0;n<t.length;n++){let r=t[n].trim();if(r.indexOf(o)===0){let i=r.substring(o.length);try{return JSON.parse(decodeURIComponent(i))}catch{return null}}}}catch(o){console.error("[CookieFilterStorage] get error:",e,o)}return null},remove:function(e){try{h(s+e)}catch(o){console.error("[CookieFilterStorage] remove error:",e,o)}},clearAll:function(){try{let e=document.cookie.split("; ");for(let o=0;o<e.length;o++){let t=e[o].trim();if(t.indexOf(s)===0){let n=t.indexOf("="),r=n>-1?t.substring(0,n):t;h(r)}}console.log("[CookieFilterStorage] All filter cookies cleared.")}catch(e){console.error("[CookieFilterStorage] clearAll error:",e)}},has:function(e){try{let o=s+e+"=",t=document.cookie.split("; ");for(let n=0;n<t.length;n++)if(t[n].trim().indexOf(o)===0)return!0}catch(o){console.error("[CookieFilterStorage] has error:",e,o)}return!1},migrateFromLocalStorage:function(e,o){if(!this.has(o))try{let t=localStorage.getItem(e);if(t){let n=JSON.parse(t);this.set(o,n),localStorage.removeItem(e),console.log('[CookieFilterStorage] Migrated localStorage "'+e+'" \u2192 cookie "'+o+'"')}}catch(t){console.error('[CookieFilterStorage] Migration failed for "'+e+'":',t)}}};function v(){let e=window.location.pathname.toLowerCase(),o=["/login","/auth","/signin","/masuk","/keluar","/logout"];for(let n=0;n<o.length;n++)if(e.indexOf(o[n])!==-1)return!0;return document.querySelectorAll('input[type="password"]').length>0}function w(){if(m)return;if(m=!0,v()){l.clearAll();return}let e=window.location.href,o=new MutationObserver(function(){let n=window.location.href;n!==e&&(e=n,v()&&(l.clearAll(),console.log("[CookieFilterStorage] Logout detected. Filter cookies cleared.")),k()?f():c())}),t=document.body||document.documentElement;t&&o.observe(t,{childList:!0,subtree:!0})}function k(){let e=window.location.pathname;return!!(e.includes("/v2/m-klaim")&&!e.includes("detail")||e.includes("/billing/pembayaran-new/billing-verifikasi")||e.includes("/admisi/pelaksanaan-"))}function f(){if(c(),sessionStorage.getItem("ext-hide-clear-filter")||!k())return;let e=document.cookie.split("; "),o=!1;for(let i=0;i<e.length;i++)if(e[i].trim().indexOf(s)===0){o=!0;break}if(!o)return;let t=document.createElement("div");t.id="ext-clear-all-filters",t.style.cssText="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#dc3545;color:#fff;padding:10px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;font-family:Segoe UI,Arial,sans-serif;box-shadow:0 2px 8px rgba(220,53,69,0.3);user-select:none;display:flex;align-items:center;gap:12px;";let n=document.createElement("span");n.textContent="Hapus Data Filter",t.appendChild(n);let r=document.createElement("span");r.textContent="\xD7",r.style.cssText="cursor:pointer;font-weight:bold;font-size:20px;line-height:1;opacity:0.8;transition:opacity 0.15s;",r.addEventListener("mouseenter",function(){r.style.opacity="1"}),r.addEventListener("mouseleave",function(){r.style.opacity="0.8"}),r.addEventListener("click",function(i){i.stopPropagation(),t.style.display="none",sessionStorage.setItem("ext-hide-clear-filter","true")}),t.appendChild(r),t.addEventListener("click",function(){b({title:"Hapus Data Filter",message:"Hapus semua data filter yang tersimpan?",variant:"danger",okLabel:"Hapus",cancelLabel:"Batal"}).then(function(i){i&&(l.clearAll(),window.location.reload())})}),t.addEventListener("mouseenter",function(){t.style.background="#c82333"}),t.addEventListener("mouseleave",function(){t.style.background="#dc3545"}),document.body.appendChild(t),d=t}function c(){d&&(d.remove(),d=null);let e=document.getElementById("ext-clear-all-filters");e&&e.remove()}window.CookieFilterStorage=l;window.setupFilterLogoutWatcher=w;window.initClearAllFilterButton=f;window.removeClearAllFilterButton=c;return F(T);})();
