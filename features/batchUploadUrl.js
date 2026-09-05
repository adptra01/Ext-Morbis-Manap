"use strict";var __morbis_feature=(()=>{function z(){return window}var F="ext-batch-shared-style";function M(){if(document.getElementById(F))return;let e=document.createElement("style");e.id=F,e.textContent=`
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
  `,document.head.appendChild(e)}var h={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};async function P(e,r){try{let n=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!n.ok)throw new Error(`HTTP ${n.status}`);let t=await n.blob(),a=URL.createObjectURL(t);j(a,r,e,()=>URL.revokeObjectURL(a))}catch{j(e,r,e)}}function j(e,r,n,t){let a=document.getElementById("ext-inline-preview-modal");a&&a.remove();let i=r.toLowerCase().split(".").pop()||"",l=i==="pdf",u=["jpg","jpeg","png","gif","webp"].includes(i),s=document.createElement("div");s.id="ext-inline-preview-modal",s.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let o='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';l?o=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:u?o=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:o=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${h.file}<div>Preview not available for this format</div></div>`;let d=r.replace(/"/g,"&quot;").replace(/</g,"&lt;");if(s.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${d}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${h.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${h.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${o}</div>
  `,document.body.appendChild(s),document.getElementById("ext-preview-close")?.addEventListener("click",()=>{t&&t(),s.remove()}),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(n||e,"_blank"),t&&t(),s.remove()}),s.addEventListener("click",p=>{p.target===s&&(t&&t(),s.remove())}),document.addEventListener("keydown",function p(m){m.key==="Escape"&&(t&&t(),s.remove(),document.removeEventListener("keydown",p))}),l||u){let p=setInterval(()=>{if(l?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let k=s.querySelector(".ext-inline-preview-loading");k&&k.remove(),clearInterval(p)}},500)}}function y(e){return new Promise(r=>{M();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",t=document.createElement("div");t.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",t.innerHTML=`
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${e.hideCancel?"":`<button class="ext-btn ext-btn-secondary" data-ext-cancel>${e.cancelLabel??"Batal"}</button>`}
          <button class="ext-btn ${n}" data-ext-ok>${e.okLabel??"Lanjut"}</button>
        </div>
      </div>`,t.querySelector("h3").textContent=e.title;let a=t.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((s,o)=>{o>0&&a.appendChild(document.createElement("br")),a.appendChild(document.createTextNode(s))});let i=s=>{t.remove(),document.removeEventListener("keydown",l),r(s)},l=s=>{s.key==="Escape"&&i(!1)};t.querySelector(".ext-modal-close").addEventListener("click",()=>i(!1)),t.addEventListener("click",s=>{s.target===t&&i(!1)}),t.querySelector("[data-ext-ok]").addEventListener("click",()=>i(!0));let u=t.querySelector("[data-ext-cancel]");u&&u.addEventListener("click",()=>i(!1)),document.addEventListener("keydown",l),document.body.appendChild(t)})}var B=z(),g={targetUrl:"/v2/m-klaim/detail-v2-refaktor",uploadEndpoint:"/v2/m-klaim/uploda-dokumen/control?sub=simpan",maxConcurrent:3,maxBatchSize:50,supportedExtensions:[".pdf",".jpg",".jpeg",".png"],modalId:"ext-batch-url-modal",textareaId:"ext-url-input",previewId:"ext-preview-list",progressId:"ext-progress-bar",statusId:"ext-status-text"};function Z(e){let r=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0");return`${r}-${n}-${t}`}function X(){return Z(new Date)}function S(){let e=document.getElementById("tgl");if(e&&e.value){let r=e.value.split("/");if(r.length===3){let[n,t,a]=r;return`${a}-${t}-${n}`}}return console.warn("[Batch Upload] Input #tgl tidak ditemukan, pakai tanggal hari ini"),X()}function w(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function J(e,r={},n=3e4){let t=new AbortController,a=setTimeout(()=>t.abort(),n);return fetch(e,{...r,signal:t.signal}).finally(()=>clearTimeout(a))}async function _(e,r={},n=2){let t=null;for(let a=0;a<=n;a++){try{let i=await J(e,r);if(i.ok||i.status>=400&&i.status<500&&i.status!==429)return i;t=new Error(`HTTP ${i.status}: ${i.statusText}`)}catch(i){t=i,i instanceof DOMException&&i.name==="AbortError"&&(t=new Error("Request timeout"))}a<n&&(await new Promise(i=>setTimeout(i,1e3*(a+1))),console.log(`[Batch Upload] Retry ${a+1}/${n} for ${e}`))}throw t||new Error("Fetch failed after retries")}var c=[],f=!1;function N(e){return!e||typeof e!="string"?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n.length>0).map(n=>n.replace(/ /g,"%20")).filter(n=>{try{new URL(n);let t=n.split(/[?#]/)[0].toLowerCase();return g.supportedExtensions.some(a=>t.endsWith(a))}catch{return!1}})}function I(e){try{let r=new URL(e),t=decodeURIComponent(r.pathname).split("/").pop()||"unknown",a=t.replace(/\.[^/.]+$/,""),i=a.split(/[-_\s]+/),l="",u=S(),s=i.findIndex(p=>/^\d{3,12}$/.test(p)&&!/^\d{10}$/.test(p));s!==-1&&(l=i[s],i.splice(s,1));let d=i.filter(p=>!/^\d{10}$/.test(p)).join(" ").trim()||a.replace(/[-_]+/g," ");return{filename:t,norm:l,tanggal:u,jenis_dokumen:"Lain-lain",keterangan:d,url:e,status:"pending"}}catch{return{filename:"error",norm:"",tanggal:S(),jenis_dokumen:"Lain-lain",keterangan:"URL tidak valid",url:e,status:"error",error:"Invalid URL format"}}}function ee(){let e=document.getElementById(g.modalId);e||(e=document.createElement("div"),e.id=g.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${h.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${g.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${h.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${h.search} Cari Dokumen Pasien Otomatis</button>
          </div>
          <div id="ext-upload-search-wrap" class="ext-upload-search-wrap" style="display: none;">
            <input type="text" id="ext-upload-search-input" class="ext-search-input" placeholder="Cari dokumen...">
          </div>
        </div>
        <div id="${g.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${g.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${g.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${h.upload} Mulai Upload</button>
        </div>
      </div>
    `,setTimeout(()=>{document.getElementById("ext-modal-close-btn")?.addEventListener("click",()=>e?.classList.remove("show")),document.getElementById("ext-analyze-btn")?.addEventListener("click",te),document.getElementById("ext-cancel-btn")?.addEventListener("click",A),document.getElementById("ext-test-single-btn")?.addEventListener("click",W),document.getElementById("ext-start-upload-btn")?.addEventListener("click",V),document.querySelectorAll('input[name="ext-upload-mode"]').forEach(n=>{n.addEventListener("change",t=>{let a=t.target,i=document.getElementById("ext-manual-section"),l=document.getElementById("ext-auto-section");a.value==="manual"?(i&&(i.style.display="block"),l&&(l.style.display="none")):(i&&(i.style.display="none"),l&&(l.style.display="block")),c=[],v([]),x("")})}),document.getElementById("ext-crawl-btn")?.addEventListener("click",ne),document.getElementById("ext-upload-search-input")?.addEventListener("input",()=>v(c)),e?.addEventListener("click",function(n){n.target===e&&A()})},0),document.body.appendChild(e)),e.classList.add("show"),document.getElementById(g.textareaId)?.focus()}function A(){let e=document.getElementById(g.modalId);if(e){e.classList.remove("show"),c=[],f=!1,v([]),G(0),x("");let r=document.getElementById("ext-upload-search-input");r&&(r.value="");let n=document.getElementById("ext-upload-search-wrap");n&&(n.style.display="none");let t=document.querySelector(".ext-modal-buttons");t&&(t.innerHTML='<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>'+h.upload+" Mulai Upload</button>",document.getElementById("ext-cancel-btn")?.addEventListener("click",A),document.getElementById("ext-test-single-btn")?.addEventListener("click",W),document.getElementById("ext-start-upload-btn")?.addEventListener("click",V))}}function v(e){let r=document.getElementById(g.previewId),n=document.getElementById("ext-start-upload-btn"),t=document.getElementById("ext-upload-search-wrap"),a=document.getElementById("ext-upload-search-input"),i=document.getElementById("ext-auto-section")?.style.display!=="none",l=(a?.value||"").toLowerCase();if(!e||e.length===0){r&&(r.style.display="none"),n&&(n.disabled=!0),t&&(t.style.display="none"),a&&(a.value="");return}t&&i&&(t.style.display="block");let u=e.map((o,d)=>({item:o,i:d})).filter(({item:o})=>!l||o.filename.toLowerCase().includes(l)||o.keterangan.toLowerCase().includes(l)||o.norm.toLowerCase().includes(l));r&&(r.style.display="block");let s=document.createElement("div");if(s.style.marginBottom="10px",s.innerHTML=`<strong class="preview-header-text">Preview (${u.length} dari ${e.length} dokumen, ${e.filter(o=>o.selected!==!1).length} dipilih):</strong>`,r&&(r.innerHTML="",r.appendChild(s)),u.length===0){let o=document.createElement("div");o.style.cssText="padding:24px;text-align:center;font-size:13px;color:#9ca3af;",o.textContent="Tidak ada dokumen yang cocok dengan pencarian.",r?.appendChild(o)}u.forEach(({item:o,i:d})=>{let p="";o.tglFileTabel?p=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${w(o.tglFileTabel||"")}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${w(o.tglUploadTabel||"")}</strong></span>
      </div>`:p=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${w(o.norm||"-")}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${w(o.tanggal)}</strong></span>
      </div>`;let m=(o.filename.split(".").pop()||"").toLowerCase(),E={pdf:"bg-red-100 text-red-700",jpg:"bg-blue-100 text-blue-700",jpeg:"bg-blue-100 text-blue-700",png:"bg-green-100 text-green-700"}[m]||"bg-gray-100 text-gray-700",T=m?`<span class="${E}" style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;text-transform:uppercase;margin-left:6px;">${m}</span>`:"",b=document.createElement("div");b.className="ext-delete-preview-item",o.selected&&b.classList.add("selected"),b.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${d}" ${o.selected!==!1?"checked":""} ${f?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${d+1}. ${w(o.filename)}${T}</strong>
            ${o.status!=="pending"?`<span class="ext-status-badge" data-status="${o.status==="success"?"success":o.status==="error"?"error":"deleting"}">${o.status==="success"?"Sukses":o.status==="error"?"Gagal":"Memproses"}</span>`:""}
          </div>
          ${p}
          <input type="text" class="ext-keterangan-input" data-index="${d}" value="${w(o.keterangan||"")}" placeholder="Keterangan dokumen..." ${f?"disabled":""}>
          ${o.error?`<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${w(o.error)}</div>`:""}
        </div>
      </label>
      <button data-index="${d}" class="ext-delete-preview-btn" ${f?"disabled":""}>${h.eye} Preview</button>
      <button data-index="${d}" class="ext-delete-single-btn" title="Buang dari Antrian" ${f?"disabled":""}>${h.xClose}</button>
    `;let L=b.querySelector(".ext-checkbox"),$=b.querySelector(".ext-delete-preview-btn"),Y=b.querySelector(".ext-delete-single-btn"),O=C=>{if(f)return;o.selected=C,L&&(L.checked=C),C?b.classList.add("selected"):b.classList.remove("selected");let D=e.filter(Q=>Q.selected!==!1).length;s.innerHTML=`<strong class="preview-header-text">Preview (${D} Dokumen Dipilih):</strong>`,n&&(n.disabled=D===0)};L?.addEventListener("change",C=>O(C.target.checked)),Y?.addEventListener("click",()=>O(!1));let H=b.querySelector(".ext-keterangan-input");H?.addEventListener("input",function(){c[d].keterangan=H.value}),$&&($.addEventListener("click",async()=>{try{await P(c[d].url,c[d].filename)}catch{window.open(c[d].url,"_blank")}}),f&&($.disabled=!0)),r?.appendChild(b)}),n&&(n.disabled=e.filter(o=>o.selected!==!1).length===0)}function G(e){let r=document.getElementById(g.progressId);if(!r)return;let n=r.querySelector(".progress-fill");e>0?(r.style.display="block",n&&(n.style.width=`${e}%`)):r.style.display="none"}function x(e){let r=document.getElementById(g.statusId);r&&(r.textContent=e)}function U(e){let r=["ext-analyze-btn","ext-cancel-btn","ext-test-single-btn","ext-start-upload-btn","ext-modal-close-btn","ext-crawl-btn",g.textareaId];document.querySelectorAll('input[name="ext-upload-mode"]').forEach(n=>{n.disabled=e}),r.forEach(n=>{let t=document.getElementById(n);t&&(t.disabled=e,(n==="ext-modal-close-btn"||n===g.textareaId)&&(t.style.opacity=e?"0.5":"1",t.style.cursor=e?"not-allowed":n===g.textareaId?"text":"pointer"))})}function te(){let r=document.getElementById(g.textareaId)?.value.trim()||"";if(!r){y({title:"Tidak ada URL",message:"Silakan paste URL terlebih dahulu.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let n=N(r);if(n.length===0){y({title:"Tidak ada URL valid",message:"Pastikan URL mengandung ekstensi file yang didukung.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(n.length>g.maxBatchSize){y({title:"Terlalu banyak URL",message:`Maksimal ${g.maxBatchSize} URL per batch.`,variant:"warning",okLabel:"OK",hideCancel:!0});return}c=n.map(t=>I(t)),v(c),x(`${n.length} URL siap diproses`)}async function ne(){let r=new URLSearchParams(window.location.search).get("id_visit");if(!r){y({title:"Parameter id_visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0});return}x("Sedang mencari dokumen di rekam medis...");let n=document.getElementById("ext-crawl-btn");n&&(n.disabled=!0,n.textContent="Mencari...");try{let t=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${r}&page=85&id_kunjungan=`,a=await fetch(t);if(!a.ok)throw new Error("Gagal memuat halaman dokumen pasien");let i=await a.text(),u=new DOMParser().parseFromString(i,"text/html").querySelectorAll("table.data-list.tabel tr"),s=[];for(let o=1;o<u.length;o++){let d=u[o],p=d.querySelector("td:nth-child(2) a");if(!p)continue;let m=p.getAttribute("href");if(!m?.includes("/assets/dokumen-pasien/"))continue;let k=m.startsWith("http")?m:`${window.location.origin}${m}`,E=d.cells[1]?.textContent?.trim()||"",T=d.cells[2]?.textContent?.trim()||"",b=d.cells[3]?.textContent?.trim()||"",L=d.cells[4]?.textContent?.trim()||"";s.push({url:k,filenameTabel:E,tglFile:b,tglUpload:L,keteranganTabel:T})}if(s.length===0){x("Tidak ada dokumen ditemukan di rekam medis."),n&&(n.disabled=!1,n.textContent="Cari Dokumen Pasien Otomatis");return}c=s.map(o=>{let d=I(o.url);return d.tglFileTabel=o.tglFile,d.tglUploadTabel=o.tglUpload,d.filename=o.filenameTabel||d.filename,d.keterangan=o.keteranganTabel||d.filename||"-",d.selected=!1,d}),v(c),x(`${c.length} dokumen berhasil ditemukan!`)}catch(t){x("Error: "+t.message)}finally{n&&(n.disabled=!1,n.textContent="Cari Dokumen Pasien Otomatis")}}async function oe(e,r){x(`Mengunduh: ${w(r)}...`),console.log("[Batch Upload] Fetching URL:",e);let n;try{n=await _(e,{method:"GET",credentials:"same-origin"},2)}catch{n=await _(e,{method:"GET",mode:"cors",credentials:"omit"},1)}if(!n.ok){let l=await n.text().catch(()=>"");throw new Error(`HTTP ${n.status} \u2014 ${n.statusText||l.slice(0,120)}`)}let t=await n.blob();if(t.size===0)throw new Error("File kosong (0 bytes) dari server");let a=r.includes(".")?"."+r.split(".").pop():"",i=r.replace(/[<>:"/\\|?*]/g,"_");return new File([t],i,{type:t.type||`application/${a.slice(1)||"octet-stream"}`})}async function R(e,r){try{x(`Download: ${w(e.filename)}...`);let n=await oe(e.url,e.filename),t=new FormData;t.append("id_visit",r),t.append("norm",e.norm),t.append("tgl_file",e.tanggal),t.append("jenis_dokumen",e.jenis_dokumen||"Lain-lain"),t.append("dok",n),t.append("keterangan",e.keterangan||""),x(`Upload: ${w(e.filename)} (${(n.size/1024).toFixed(0)} KB)...`);let a=await _(g.uploadEndpoint,{method:"POST",body:t,credentials:"same-origin"},2);if(!a.ok){let u=(await a.text().catch(()=>"")).replace(/<[^>]+>/g,"").trim().slice(0,200);throw new Error(`Server ${a.status}: ${u||a.statusText}`)}let i=await a.text();return i.includes("error")||i.includes("gagal")?{success:!1,error:`Server response: ${i.replace(/<[^>]+>/g,"").trim().slice(0,200)}`}:{success:!0,result:i}}catch(n){let t=n.message,a=t;return t.includes("Failed to fetch")||t.includes("NetworkError")?a="Network error \u2014 cek koneksi atau CORS":t.includes("timeout")||t.includes("AbortError")?a="Timeout \u2014 server tidak merespon dalam 30 detik":t.includes("0 bytes")&&(a="File kosong dari server"),{success:!1,error:a}}}async function K(){if(f)return;f=!0,U(!0);let e=document.getElementById("ext-start-upload-btn");e&&(e.textContent="Memproses...");let n=new URLSearchParams(window.location.search).get("id_visit")||"";if(!n){y({title:"ID Visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0}),U(!1),f=!1,e&&(e.textContent="Mulai Upload");return}let t=0,a=0,i=c.filter(o=>o.selected!==!1),l=i.length;if(l===0){y({title:"Tidak ada dokumen dipilih",message:"Tidak ada dokumen yang dipilih untuk diupload.",variant:"warning",okLabel:"OK",hideCancel:!0}),U(!1),f=!1,x(""),e&&(e.textContent="Mulai Upload");return}for(let o=0;o<l;o++){let d=i[o];x(`[${o+1}/${l}] ${w(d.filename)}...`);try{let m=await R(d,n);m.success?(d.status="success",t++):(d.status="error",d.error=m.error,a++)}catch(m){d.status="error",d.error=m.message,a++}let p=(o+1)/l*100;G(p),v(c)}let u=[`Selesai ${l} dokumen:`,`${t} sukses`];a>0&&u.push(`${a} gagal`),x(u.join(" ")),a>0&&console.warn("[Batch Upload] Failed:",c.filter(o=>o.status==="error").map(o=>`${o.filename}: ${o.error}`));let s=document.querySelector(".ext-modal-buttons");if(s){let o=`<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">${h.refresh} Reload Halaman</span></button>`,d=a>0?'<button class="ext-btn ext-btn-secondary" id="ext-retry-failed-btn" style="border-color:#fbbf24;color:#92400e;">Ulangi yang Gagal</button>':"";s.innerHTML=`<div style="display:flex;gap:8px;justify-content:flex-end;">${d}${o}</div>`,document.getElementById("ext-reload-btn")?.addEventListener("click",()=>window.location.reload()),a>0&&document.getElementById("ext-retry-failed-btn")?.addEventListener("click",()=>{c.forEach(p=>{p.status==="error"&&(p.status="pending",p.error=void 0)}),v(c),K()})}f=!1}async function W(){if(c.length===0){y({title:"Tidak ada URL",message:"Tidak ada URL untuk ditest.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(f)return;f=!0,U(!0);let e=c[0];x("Testing single upload...");let n=new URLSearchParams(window.location.search).get("id_visit")||"";try{let t=await R(e,n);t.success?(e.status="success",x("Test sukses! Detail di console.")):(e.status="error",e.error=t.error,x("Test gagal! Detail di console."))}catch(t){e.status="error",e.error=t.message,x("Test error! Detail di console.")}v(c),U(!1),f=!1}function V(){if(c.length===0){y({title:"Tidak ada URL",message:"Tidak ada URL untuk diproses.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let e=c.filter(r=>r.selected!==!1).length;if(e===0){y({title:"Tidak ada dokumen dipilih",message:"Centang dokumen yang ingin diupload.",variant:"warning",okLabel:"OK",hideCancel:!0});return}(async()=>await y({title:`Upload ${e} dokumen?`,message:"Proses ini tidak dapat dibatalkan.",variant:"warning",okLabel:"Ya, Upload"})&&K())()}function re(){return!!new URLSearchParams(window.location.search).get("id_visit")}async function ae(){let r=new URLSearchParams(window.location.search).get("id_visit");if(!r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Parameter id_visit tidak ditemukan di URL."}}).catch(console.error);return}try{let n=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${r}&page=85&id_kunjungan=`,t=await fetch(n);if(!t.ok)throw new Error("Gagal memuat halaman dokumen pasien");let a=await t.text(),l=new DOMParser().parseFromString(a,"text/html").querySelectorAll("table.data-list.tabel tr"),u=[];for(let s=1;s<l.length;s++){let o=l[s],d=o.querySelector("td:nth-child(2) a");if(!d)continue;let p=d.getAttribute("href");if(!p?.includes("/assets/dokumen-pasien/"))continue;let m=p.startsWith("http")?p:`${window.location.origin}${p}`,k=o.cells[1]?.textContent?.trim()||"",E=o.cells[2]?.textContent?.trim()||"",T=o.cells[3]?.textContent?.trim()||"",b=o.cells[4]?.textContent?.trim()||"";u.push({url:m,filenameTabel:k,tglFile:T,tglUpload:b,keteranganTabel:E})}if(u.length===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:[]}}).catch(console.error);return}c=u.map(s=>{let o=I(s.url);return o.tglFileTabel=s.tglFile,o.tglUploadTabel=s.tglUpload,o.filename=s.filenameTabel||o.filename,o.keterangan=s.keteranganTabel||o.filename||"-",o.selected=!1,o}),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:c}}).catch(console.error)}catch(n){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:n.message}}).catch(console.error)}}async function ie(){try{let r=new URLSearchParams(window.location.search).get("id_visit")||"";if(!r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"ID Visit tidak ditemukan di URL"}}).catch(console.error);return}let n=0,t=0,a=c.filter(l=>l.selected!==!1),i=a.length;if(i===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Tidak ada dokumen yang dipilih."}}).catch(console.error);return}for(let l=0;l<i;l++){let u=a[l];u.status="uploading",q(l,i,n,t,c);try{let s=await R(u,r);s.success?(u.status="success",n++):(u.status="error",u.error=s.error,t++)}catch(s){u.status="error",u.error=s.message,t++}q(l+1,i,n,t,c)}}catch(e){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:e.message}}).catch(console.error)}}function q(e,r,n,t,a){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:e/r*100,status:`Diproses: ${e}/${r} - Sukses: ${n}, Gagal: ${t}`,items:a,finished:e>=r}}).catch(console.error)}async function se(){if(c.length===0)return;let e=c[0],n=new URLSearchParams(window.location.search).get("id_visit")||"";e.status="uploading",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:50,status:`Testing single upload: ${e.filename}...`,items:c,finished:!1}}).catch(console.error);try{let t=await R(e,n);t.success?e.status="success":(e.status="error",e.error=t.error)}catch(t){e.status="error",e.error=t.message}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:100,status:e.status==="success"?"Test upload sukses!":"Test upload gagal!",items:c,finished:!0}}).catch(console.error)}function le(){if(document.getElementById("ext-batch-url-style"))return;let e=document.createElement("style");e.id="ext-batch-url-style",e.textContent=`
    #${g.textareaId} {
      width:100%;height:150px;padding:12px;border:1px solid #e2e8f0;
      border-radius:10px;font-size:12px;resize:vertical;
      background:#f8fafc;color:#1e293b;
      transition:border-color .15s ease;box-sizing:border-box;
    }
    #${g.textareaId}:focus {
      border-color:#94a3b8;box-shadow:0 0 0 3px rgba(148,163,184,.1);
      background:#fff;outline:none;
    }
    #${g.previewId} {
      margin-top:15px;max-height:none;overflow-y:visible;
      border:1px solid #f1f5f9;border-radius:10px;padding:12px;
    }
    #${g.progressId} .progress-fill {
      height:100%;background:#2563eb;border-radius:3px;
      width:0%;transition:width .3s cubic-bezier(.16,1,.3,1);
    }
    .ext-input-label{display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#334155}
    .ext-mode-radio{display:flex;gap:20px;align-items:center;margin-bottom:16px;font-size:13px;color:#475569}
    .ext-mode-radio label{cursor:pointer;display:flex;align-items:center;gap:6px}
    .ext-mode-radio input[type="radio"]{accent-color:#2563eb}
    .ext-upload-search-wrap{display:none;margin-bottom:10px}
    .ext-keterangan-input{
      width:100%;padding:6px 10px;font-size:11px;border:1px solid #e2e8f0;border-radius:6px;
      outline:none;color:#475569;background:#f8fafc;box-sizing:border-box;margin-top:5px;
    }
    .ext-keterangan-input:focus{border-color:#94a3b8;background:#fff}
    .ext-keterangan-input::placeholder{color:#94a3b8}
    .ext-inline-preview-spinner{
      width:40px;height:40px;border:4px solid rgba(255,255,255,.15);
      border-top:4px solid #fff;border-radius:50%;animation:ext-spin .8s linear infinite
    }
    @keyframes ext-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  `,document.head.appendChild(e),M()}function de(){!B.currentConfig?.features?.batchUpload?.enabled||!B.ExtensionCore.isFeatureAllowed("batchUpload")||re()&&(le(),chrome.runtime.sendMessage({type:"PAGE_CONTEXT",feature:"mKlaimDetail",data:{idVisit:new URLSearchParams(window.location.search).get("id_visit"),tanggalMasuk:S()}}).catch(console.error),!window.__extBatchUploadRegistered&&(window.__extBatchUploadRegistered=!0,chrome.runtime.onMessage.addListener((e,r,n)=>{if(e.type==="TAB_ACTION"){let{action:t,payload:a}=e;t==="BATCH_UPLOAD_ANALYZE"?(c=N(a.inputText).map(l=>I(l)),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ANALYZE_RESULT",data:{items:c}}).catch(console.error)):t==="BATCH_UPLOAD_CRAWL"?ae():t==="BATCH_UPLOAD_UPDATE_ITEMS"?c=a.items:t==="BATCH_UPLOAD_PREVIEW"?P(a.url,a.filename).catch(()=>{window.open(a.url,"_blank")}):t==="BATCH_UPLOAD_START"?ie():t==="BATCH_UPLOAD_TEST_SINGLE"&&se(),n({success:!0})}else e.type==="BATCH_UPLOAD_ACTION"&&n({success:!0});return!0})))}window.batchUploadShowModal=ee;typeof B.featureModules<"u"&&B.featureModules!==null?B.featureModules.batchUpload={id:"batchUpload",name:"Upload Dokumen Ulang",description:"Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis",match:{regex:/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/},run:de}:console.warn("[Batch Upload] featureModules not defined, module registration skipped");})();
