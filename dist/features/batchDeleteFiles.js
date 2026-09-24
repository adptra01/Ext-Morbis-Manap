"use strict";var __morbis_feature=(()=>{function A(){return window}var P="ext-batch-shared-style";function M(){if(document.getElementById(P))return;let e=document.createElement("style");e.id=P,e.textContent=`
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

    /* Base styles for batch modals (upload + delete). Same class is used by
       both features so opening one closes the other; CSS must live here in
       shared utils or a role-gated feature (delete off, upload on) renders
       an unstyled, non-fixed modal. */
    .ext-batch-delete-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15,23,42,0.45); display: none; z-index: 10000;
      align-items: center; justify-content: center;
      backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    }
    .ext-batch-delete-modal.show { display: flex; }

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
  `,document.head.appendChild(e)}var m={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};function z(e,n){let r=n||18;return`<span style="display:inline-flex;align-items:center;justify-content:center;width:${r}px;height:${r}px;flex-shrink:0;">${e}</span>`}async function D(e,n){try{let r=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!r.ok)throw new Error(`HTTP ${r.status}`);let t=await r.blob(),i=URL.createObjectURL(t);R(i,n,e,()=>URL.revokeObjectURL(i))}catch{R(e,n,e)}}var E=null;function R(e,n,r,t){E&&E();let i=n.toLowerCase().split(".").pop()||"",p=i==="pdf",c=["jpg","jpeg","png","gif","webp"].includes(i),d=document.createElement("div");d.id="ext-inline-preview-modal",d.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let o='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';p?o=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:c?o=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:o=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${m.file}<div>Preview not available for this format</div></div>`;let a=n.replace(/"/g,"&quot;").replace(/</g,"&lt;");d.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${a}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${m.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${m.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${o}</div>
  `,document.body.appendChild(d);let u=!1,g,x=b=>{b.key==="Escape"&&f()},f=()=>{u||(u=!0,E===f&&(E=null),t&&t(),document.removeEventListener("keydown",x),g!==void 0&&clearInterval(g),d.remove())};E=f,document.getElementById("ext-preview-close")?.addEventListener("click",f),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(r||e,"_blank"),f()}),d.addEventListener("click",b=>{b.target===d&&f()}),document.addEventListener("keydown",x),(p||c)&&(g=window.setInterval(()=>{if(p?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let y=d.querySelector(".ext-inline-preview-loading");y&&y.remove(),clearInterval(g)}},500))}function v(e){return new Promise(n=>{M();let r=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",t=document.createElement("div");t.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",t.innerHTML=`
      <div class="ext-modal-content" style="max-width:480px;">
        <div class="ext-modal-header">
          <h3></h3>
          <button class="ext-modal-close">&times;</button>
        </div>
        <div class="ext-confirm-body" style="font-size:14px;color:#334155;line-height:1.6;"></div>
        <div class="ext-modal-buttons">
          ${e.hideCancel?"":`<button class="ext-btn ext-btn-secondary" data-ext-cancel>${e.cancelLabel??"Batal"}</button>`}
          <button class="ext-btn ${r}" data-ext-ok>${e.okLabel??"Lanjut"}</button>
        </div>
      </div>`,t.querySelector("h3").textContent=e.title;let i=t.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((o,a)=>{a>0&&i.appendChild(document.createElement("br")),i.appendChild(document.createTextNode(o))});let p=o=>{t.remove(),document.removeEventListener("keydown",c),n(o)},c=o=>{o.key==="Escape"&&p(!1)};t.querySelector(".ext-modal-close").addEventListener("click",()=>p(!1)),t.addEventListener("click",o=>{o.target===t&&p(!1)}),t.querySelector("[data-ext-ok]").addEventListener("click",()=>p(!0));let d=t.querySelector("[data-ext-cancel]");d&&d.addEventListener("click",()=>p(!1)),document.addEventListener("keydown",c),document.body.appendChild(t)})}var I=A(),l={deleteEndpoint:"/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus",fetchListUrl:"/admisi/pelaksanaan_pelayanan/dokumen-pasien",maxConcurrent:1,maxBatchSize:10,delayBetweenDelete:500,modalId:"ext-batch-delete-modal",previewId:"ext-delete-preview-list",progressId:"ext-delete-progress-bar",statusId:"ext-delete-status-text"},s=[],h=!1;function F(){if(document.getElementById("ext-batch-delete-style"))return;let e=document.createElement("style");e.id="ext-batch-delete-style",e.textContent=`
    #ext-batch-delete-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #ef4444; color: white; border: none; border-radius: 10px; cursor: pointer;
      font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 13px; font-weight: 700;
      padding: 10px 22px; transition: all 0.15s ease;
      letter-spacing: -0.1px; box-shadow: 0 2px 8px rgba(239,68,68,0.25);
    }
    #ext-batch-delete-btn:hover {
      background: #dc2626; box-shadow: 0 4px 14px rgba(220,38,38,0.35);
      transform: translateY(-1px);
    }
    #ext-batch-delete-btn:active { transform: translateY(0); }
  `,document.head.appendChild(e),M()}function j(e){document.querySelectorAll("button:not(#ext-batch-delete-btn):not([disabled])").forEach(t=>{e?(t.disabled=!0,t.dataset.extWasEnabled="true"):t.dataset.extWasEnabled==="true"&&(t.disabled=!1,delete t.dataset.extWasEnabled)}),document.querySelectorAll("form input, form button, form a").forEach(t=>{e?(t.disabled=!0,t.dataset.extWasEnabled="true"):t.dataset.extWasEnabled==="true"&&(t.disabled=!1,delete t.dataset.extWasEnabled)})}function $(e){["ext-delete-close-btn","ext-delete-cancel-btn","ext-fetch-files-btn","ext-start-delete-btn"].forEach(r=>{let t=document.getElementById(r);t&&(t.disabled=e,t.style.opacity=e?"0.5":"1",t.style.cursor=e?"not-allowed":"pointer")}),document.querySelectorAll("#"+l.previewId+" input, #"+l.previewId+" button").forEach(r=>r.disabled=e),j(e)}function O(){let e=document.querySelector("#"+l.modalId+" .ext-modal-buttons");e&&(e.innerHTML='<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">'+m.refresh+" Reload Halaman</span></button>",document.getElementById("ext-reload-btn")?.addEventListener("click",()=>{window.location.reload()}))}async function S(e){try{let n=new FormData;return n.append("id",e),(await fetch(l.deleteEndpoint,{method:"POST",body:n,credentials:"same-origin",signal:AbortSignal.timeout(3e4)})).ok}catch(n){return console.error("[Delete Dokumen] Error:",n),!1}}function q(){let e=document.getElementById(l.modalId);e||(e=document.createElement("div"),e.id=l.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">${m.xClose}</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">${z(m.warning,18)} PERHATIAN!</strong>
          <span style="font-size: 12px; opacity: 0.85; line-height: 1.5;">File yang dihapus <strong style="color: #7c2d12;">tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">
            <span style="display: inline-flex; align-items: center; gap: 7px;">${m.search} Cari Dokumen Pasien</span>
          </button>
        </div>
        <div id="ext-delete-search-wrap" style="display: none; margin-bottom: 12px;">
          <input type="text" id="ext-delete-search-input" class="ext-search-input" placeholder="Cari dokumen...">
        </div>
        <div id="${l.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${l.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${l.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger" disabled><span style="display:inline-flex;align-items:center;gap:6px;">${m.trash}</span> Hapus Terpilih</button>
        </div>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.getElementById("ext-delete-close-btn")?.addEventListener("click",C),document.getElementById("ext-delete-cancel-btn")?.addEventListener("click",C),document.getElementById("ext-fetch-files-btn")?.addEventListener("click",G),document.getElementById("ext-start-delete-btn")?.addEventListener("click",U),document.getElementById("ext-delete-search-input")?.addEventListener("input",T),e?.addEventListener("click",function(n){n.target===e&&C()})},50)),document.querySelectorAll(".ext-batch-delete-modal.show").forEach(n=>{n!==e&&n.classList.remove("show")}),e.classList.add("show")}function _(e){let n=document.getElementById("ext-start-delete-btn");n&&(n.disabled=e===0||h,n.textContent=`Hapus ${e} Dokumen`)}function C(){let e=document.getElementById(l.modalId);e&&e.classList.remove("show"),s=[],h=!1;let n=document.getElementById(l.previewId),r=document.getElementById(l.progressId),t=document.getElementById(l.statusId);n&&(n.style.display="none",n.innerHTML=""),r&&(r.style.display="none"),t&&(t.textContent="");let i=document.querySelector("#"+l.modalId+" .ext-modal-buttons");i&&(i.innerHTML='<button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button><button id="ext-start-delete-btn" class="ext-btn ext-btn-danger" disabled><span style="display:inline-flex;align-items:center;gap:6px;">'+m.trash+"</span> Hapus Terpilih</button>",document.getElementById("ext-delete-cancel-btn")?.addEventListener("click",C),document.getElementById("ext-start-delete-btn")?.addEventListener("click",U)),$(!1)}async function G(){let n=new URLSearchParams(window.location.search).get("id_visit");if(console.log("[BatchDelete] Current URL:",window.location.href),console.log("[BatchDelete] id_visit found:",n),!n){console.error("[BatchDelete] id_visit not found in URL!"),v({title:"Parameter id_visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let r=document.getElementById("ext-fetch-files-btn");r&&(r.disabled=!0,r.textContent="Mencari...");try{let t=`${window.location.origin}${l.fetchListUrl}?id_visit=${n}&page=85&id_kunjungan=`,i=await fetch(t,{signal:AbortSignal.timeout(3e4)});if(!i.ok)throw new Error("Gagal memuat halaman dokumen pasien");let p=await i.text(),d=new DOMParser().parseFromString(p,"text/html").querySelectorAll("table.data-list.tabel tr");console.log("[BatchDelete] Total rows found:",d.length),s=[];for(let a=1;a<d.length;a++){let u=d[a],g=u.querySelector('button[onclick*="hapus"]'),x=null;if(console.log(`[BatchDelete] Row ${a}: deleteBtn found:`,!!g),g){let H=g.getAttribute("onclick")?.match(/hapus\(([^)]+)\)/);H&&(x=H[1].replace(/['"]/g,"").trim())}if(!x)continue;let f=u.querySelector("td:nth-child(2) a"),b=u.cells[1]?.textContent?.trim()||"unknown",y=u.cells[2]?.textContent?.trim()||"-",w=u.cells[3]?.textContent?.trim()||"-",k=u.cells[4]?.textContent?.trim()||"-",L=f?.getAttribute("href")||"",B=L.startsWith("http")?L:`${window.location.origin}${L}`;s.push({id_dokumen:x,filename:b,keterangan:y,tglFile:w,tglUpload:k,url:B,selected:!1,status:"pending"})}if(s.length===0){console.error("[BatchDelete] No documents found in queue!");let a=document.getElementById(l.statusId);a&&(a.textContent="Tidak ada dokumen ditemukan.");return}console.log("[BatchDelete] Queue populated with",s.length,"documents"),T();let o=document.getElementById(l.statusId);o&&(o.textContent=`${s.length} dokumen siap dihapus!`)}catch(t){console.error("[Batch Delete] Crawl error:",t);let i=document.getElementById(l.statusId);i&&(i.textContent="Error: "+t.message)}finally{r&&(r.disabled=!1,r.textContent="Cari Dokumen Pasien")}}async function N(e){try{if(h)return;let n=s[e];if(!n||!await v({title:"Hapus dokumen ini?",message:`${n.filename}
ID: ${n.id_dokumen}

Tindakan ini tidak bisa di-undo.`,variant:"danger",okLabel:"Ya, Hapus"}))return;let t=document.getElementById(l.statusId);n.status="deleting",T(),t&&(t.textContent=`Menghapus 1 dokumen: ${n.filename}...`),await S(n.id_dokumen)?(s.splice(e,1),t&&(t.textContent=`Sukses menghapus: ${n.filename}`)):(n.status="error",t&&(t.textContent=`Gagal menghapus: ${n.filename}`)),T()}catch(n){console.error("[BatchDelete] deleteSingleFromQueue error:",n)}}function T(){let e=document.getElementById(l.previewId),n=document.getElementById(l.statusId),r=document.getElementById("ext-delete-search-wrap"),t=document.getElementById("ext-delete-search-input"),i=(t?.value||"").toLowerCase();if(!s||s.length===0){e&&(e.style.display="none",e.innerHTML=""),r&&(r.style.display="none"),t&&(t.value=""),_(0),n&&(n.textContent="",n.style.color="#4b5563");return}r&&(r.style.display="block");let p=s.map((o,a)=>({item:o,idx:a})).filter(({item:o})=>!i||o.filename.toLowerCase().includes(i)||o.keterangan.toLowerCase().includes(i)||o.id_dokumen.toLowerCase().includes(i));if(e)e.style.display="block",e.style.borderRadius="6px";else return;let c=document.createElement("div");c.style.cssText="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #f1f5f9;font-size:11px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.5px;";let d=()=>{c.innerHTML='Dokumen Pasien <span style="color:#64748b;font-weight:400;">('+s.length+' dokumen, <span style="color:#dc2626;">'+s.filter(o=>o.selected).length+"</span> dipilih)</span>"};if(d(),e.innerHTML="",e.appendChild(c),p.length===0){let o=document.createElement("div");o.style.cssText="padding:32px;text-align:center;font-size:13px;color:#94a3b8;",o.textContent="Tidak ada dokumen yang cocok dengan pencarian.",e?.appendChild(o)}p.forEach(({item:o,idx:a})=>{let u=document.createElement("div");u.className="ext-delete-preview-item",o.selected&&u.classList.add("selected");let g=h;u.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" data-index="${a}" class="ext-checkbox" ${o.selected?"checked":""} ${g?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a+1}. ${o.filename}</strong>
            ${o.status!=="pending"?`<span class="ext-status-badge" data-status="${o.status==="success"?"success":o.status==="error"?"error":"deleting"}">${o.status==="success"?"Selesai":o.status==="error"?"Gagal":"Memproses"}</span>`:""}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
            <span>ID: <strong style="color: #111827;">${o.id_dokumen}</strong></span>
            <span style="color: #d1d5db;">|</span>
            <span>${o.tglFile}</span>
            <span style="color: #d1d5db;">|</span>
            <span>${o.tglUpload}</span>
          </div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${o.keterangan}</div>
        </div>
      </label>
      <button data-index="${a}" class="ext-delete-preview-btn" ${g?"disabled":""}>${m.eye} Preview</button>
      <button data-index="${a}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${g?"disabled":""}>${m.trash}</button>
    `;let x=u.querySelector('input[type="checkbox"]');!h&&x&&x.addEventListener("change",w=>{s[a].selected=w.target.checked,u.classList.toggle("selected",s[a].selected),d(),_(s.filter(k=>k.selected).length)});let f=u.querySelectorAll("button"),b=f.length>0?f[0]:null,y=f.length>1?f[1]:null;h||(b?.addEventListener("click",()=>{D(s[a].url,s[a].filename)}),y?.addEventListener("click",()=>{N(a)})),e?.appendChild(u)}),_(s.filter(o=>o.selected).length)}async function U(){try{if(h)return;let e=s.filter(o=>o.selected);if(e.length===0){v({title:"Tidak ada dokumen dipilih",message:"Centang dokumen yang ingin dihapus terlebih dahulu.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(!await v({title:`Hapus ${e.length} dokumen?`,message:"TIDAK BISA DIUNDO!",variant:"danger",okLabel:"Ya, Hapus"}))return;h=!0,$(!0);let r=0,t=0,i=document.getElementById(l.progressId),p=i?.querySelector(".progress-fill"),c=document.getElementById(l.statusId);i&&(i.style.display="block"),p&&(p.style.width="0%"),c&&(c.style.color="#fcd34d");for(let o=0;o<e.length;o++){let a=e[o];if(a.status="deleting",await S(a.id_dokumen)?(a.status="success",r++):(a.status="error",t++),T(),p&&c){let g=(o+1)/e.length*100;p.style.width=g+"%",c.textContent=`Diproses ${o+1}/${e.length} - Sukses: ${r}, Gagal: ${t}`}await new Promise(g=>setTimeout(g,l.delayBetweenDelete))}let d=`Selesai! Sukses: ${r}, Gagal: ${t}`;c&&(c.textContent=d,c.style.color=t>0?"#000000":"#6ee7b7"),t>0&&console.log("Failed deletes:",s.filter(o=>o.status==="error")),v({title:"Proses selesai",message:d,variant:t>0?"warning":"success",okLabel:"OK",hideCancel:!0}),O(),h=!1}catch(e){console.error("[BatchDelete] startBatchDelete error:",e),h=!1,$(!1)}}function W(){return!!new URLSearchParams(window.location.search).get("id_visit")}async function K(){let n=new URLSearchParams(window.location.search).get("id_visit");if(!n){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_ERROR",data:{error:"Parameter id_visit tidak ditemukan di URL."}}).catch(console.error);return}try{let r=`${window.location.origin}${l.fetchListUrl}?id_visit=${n}&page=85&id_kunjungan=`,t=await fetch(r,{signal:AbortSignal.timeout(3e4)});if(!t.ok)throw new Error("Gagal memuat halaman dokumen pasien");let i=await t.text(),c=new DOMParser().parseFromString(i,"text/html").querySelectorAll("table.data-list.tabel tr");s=[];for(let d=1;d<c.length;d++){let o=c[d],a=o.querySelector('button[onclick*="hapus"]'),u=null;if(a){let B=a.getAttribute("onclick")?.match(/hapus\(([^)]+)\)/);B&&(u=B[1].replace(/['"]/g,"").trim())}if(!u)continue;let g=o.querySelector("td:nth-child(2) a"),x=o.cells[1]?.textContent?.trim()||"unknown",f=o.cells[2]?.textContent?.trim()||"-",b=o.cells[3]?.textContent?.trim()||"-",y=o.cells[4]?.textContent?.trim()||"-",w=g?.getAttribute("href")||"",k=w.startsWith("http")?w:`${window.location.origin}${w}`;s.push({id_dokumen:u,filename:x,keterangan:f,tglFile:b,tglUpload:y,url:k,selected:!1,status:"pending"})}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_CRAWL_RESULT",data:{items:s}}).catch(console.error)}catch(r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_ERROR",data:{error:r.message}}).catch(console.error)}}async function V(e,n){if(!s[e])return;let t=await S(n);chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_SINGLE_RESULT",data:{index:e,success:t,error:t?void 0:"Gagal memproses penghapusan di server."}}).catch(console.error)}async function Q(){try{let e=s.filter(t=>t.selected);if(e.length===0)return;let n=0,r=0;for(let t=0;t<e.length;t++){let i=e[t];i.status="deleting",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_PROGRESS",data:{percent:t/e.length*100,status:`Menghapus: ${i.filename} (${t+1}/${e.length})...`,items:s,finished:!1}}).catch(console.error),await S(i.id_dokumen)?(i.status="success",n++):(i.status="error",r++),Y(t+1,e.length,n,r,s),await new Promise(c=>setTimeout(c,l.delayBetweenDelete))}}catch(e){console.error("[BatchDelete] startBatchDeleteToSidepanel error:",e),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_ERROR",data:{error:e.message}}).catch(console.error)}}function Y(e,n,r,t,i){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_PROGRESS",data:{percent:e/n*100,status:`Diproses ${e}/${n} - Sukses: ${r}, Gagal: ${t}`,items:i,finished:e>=n}}).catch(console.error)}function X(){if(W()&&I.currentConfig?.features?.batchDelete?.enabled&&I.ExtensionCore.isFeatureAllowed("batchDelete"))try{if(console.log("[BatchDelete] Init starting..."),F(),chrome.runtime.sendMessage({type:"PAGE_CONTEXT",feature:"mKlaimDetail",data:{idVisit:new URLSearchParams(window.location.search).get("id_visit")}}).catch(console.error),window.__extBatchDeleteRegistered)return;window.__extBatchDeleteRegistered=!0,chrome.runtime.onMessage.addListener((e,n,r)=>{if(e.type==="TAB_ACTION"){let{action:t,payload:i}=e;t==="BATCH_DELETE_CRAWL"?K():t==="BATCH_DELETE_UPDATE_ITEMS"?s=i.items:t==="BATCH_DELETE_PREVIEW"?D(i.url,i.filename).catch(()=>{window.open(i.url,"_blank")}):t==="BATCH_DELETE_SINGLE"?V(i.index,i.id_dokumen):t==="BATCH_DELETE_START"&&Q(),r({success:!0})}else e.type==="BATCH_DELETE_ACTION"&&r({success:!0});return!0}),console.log("[BatchDelete] Init complete")}catch(e){console.error("[BatchDelete] Init error:",e)}}window.batchDeleteShowModal=q;typeof I.featureModules<"u"&&(I.featureModules.batchDelete={id:"batchDelete",name:"Batch Delete Dokumen",description:"Hapus multiple dokumen sekaligus",match:{regex:/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/},run:X});})();
