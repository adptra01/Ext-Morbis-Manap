"use strict";var __morbis_feature=(()=>{function _(){return window}var D="ext-batch-shared-style";function C(){if(document.getElementById(D))return;let e=document.createElement("style");e.id=D,e.textContent=`
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
  `,document.head.appendChild(e)}var g={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};function H(e,n){let o=n||18;return`<span style="display:inline-flex;align-items:center;justify-content:center;width:${o}px;height:${o}px;flex-shrink:0;">${e}</span>`}async function S(e,n){try{let o=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!o.ok)throw new Error(`HTTP ${o.status}`);let t=await o.blob(),r=URL.createObjectURL(t);$(r,n,e,()=>URL.revokeObjectURL(r))}catch{$(e,n,e)}}function $(e,n,o,t){let r=document.getElementById("ext-inline-preview-modal");r&&r.remove();let p=n.toLowerCase().split(".").pop()||"",u=p==="pdf",l=["jpg","jpeg","png","gif","webp"].includes(p),i=document.createElement("div");i.id="ext-inline-preview-modal",i.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let s='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';u?s=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:l?s=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:s=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${g.file}<div>Preview not available for this format</div></div>`;let c=n.replace(/"/g,"&quot;").replace(/</g,"&lt;");if(i.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${c}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${g.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${g.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${s}</div>
  `,document.body.appendChild(i),document.getElementById("ext-preview-close")?.addEventListener("click",()=>{t&&t(),i.remove()}),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(o||e,"_blank"),t&&t(),i.remove()}),i.addEventListener("click",f=>{f.target===i&&(t&&t(),i.remove())}),document.addEventListener("keydown",function f(m){m.key==="Escape"&&(t&&t(),i.remove(),document.removeEventListener("keydown",f))}),u||l){let f=setInterval(()=>{if(u?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let b=i.querySelector(".ext-inline-preview-loading");b&&b.remove(),clearInterval(f)}},500)}}var T=_(),d={deleteEndpoint:"/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus",fetchListUrl:"/admisi/pelaksanaan_pelayanan/dokumen-pasien",maxConcurrent:1,maxBatchSize:10,delayBetweenDelete:500,modalId:"ext-batch-delete-modal",previewId:"ext-delete-preview-list",progressId:"ext-delete-progress-bar",statusId:"ext-delete-status-text"},a=[],x=!1;function R(){if(document.getElementById("ext-batch-delete-style"))return;let e=document.createElement("style");e.id="ext-batch-delete-style",e.textContent=`
    .ext-batch-delete-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15,23,42,0.45); display: none; z-index: 10000;
      align-items: center; justify-content: center;
      backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    }
    .ext-batch-delete-modal.show { display: flex; }

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
  `,document.head.appendChild(e),C()}function z(e){document.querySelectorAll("button:not(#ext-batch-delete-btn):not([disabled])").forEach(t=>{e?(t.disabled=!0,t.dataset.extWasEnabled="true"):t.dataset.extWasEnabled==="true"&&(t.disabled=!1,delete t.dataset.extWasEnabled)}),document.querySelectorAll("form input, form button, form a").forEach(t=>{e?(t.disabled=!0,t.dataset.extWasEnabled="true"):t.dataset.extWasEnabled==="true"&&(t.disabled=!1,delete t.dataset.extWasEnabled)})}function P(e){["ext-delete-close-btn","ext-delete-cancel-btn","ext-fetch-files-btn","ext-start-delete-btn"].forEach(o=>{let t=document.getElementById(o);t&&(t.disabled=e,t.style.opacity=e?"0.5":"1",t.style.cursor=e?"not-allowed":"pointer")}),document.querySelectorAll("#"+d.previewId+" input, #"+d.previewId+" button").forEach(o=>o.disabled=e),z(e)}function U(){let e=document.querySelector(".ext-modal-buttons");e&&(e.innerHTML='<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">'+g.refresh+" Reload Halaman</span></button>",document.getElementById("ext-reload-btn")?.addEventListener("click",()=>{window.location.reload()}))}async function I(e){try{let n=new FormData;return n.append("id",e),(await fetch(d.deleteEndpoint,{method:"POST",body:n,credentials:"same-origin"})).ok}catch(n){return console.error("[Delete Dokumen] Error:",n),!1}}function j(){if(document.getElementById("ext-batch-delete-btn"))return;C();let e=document.createElement("button");e.id="ext-batch-delete-btn",e.type="button",e.textContent="Hapus Dokumen",e.addEventListener("click",F);let n=null,o=document.getElementById("ext-batch-url-btn");o&&o.parentNode?(n=o.parentNode,n.insertBefore(e,o.nextSibling)):(n=document.querySelector(".panel-heading")||document.querySelector('[id*="upload"]')||document.querySelector(".panel")||document.querySelector("main")||document.body,n?n.appendChild(e):console.error("[BatchDelete] No suitable container found!"))}function F(){let e=document.getElementById(d.modalId);e||(e=document.createElement("div"),e.id=d.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">${g.xClose}</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">${H(g.warning,18)} PERHATIAN!</strong>
          <span style="font-size: 12px; opacity: 0.85; line-height: 1.5;">File yang dihapus <strong style="color: #7c2d12;">tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">
            <span style="display: inline-flex; align-items: center; gap: 7px;">${g.search} Cari Dokumen Pasien</span>
          </button>
        </div>
        <div id="ext-delete-search-wrap" style="display: none; margin-bottom: 12px;">
          <input type="text" id="ext-delete-search-input" class="ext-search-input" placeholder="Cari dokumen...">
        </div>
        <div id="${d.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${d.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${d.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">${g.trash}</span> Hapus Terpilih</button>
        </div>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.getElementById("ext-delete-close-btn")?.addEventListener("click",B),document.getElementById("ext-delete-cancel-btn")?.addEventListener("click",B),document.getElementById("ext-fetch-files-btn")?.addEventListener("click",q),document.getElementById("ext-start-delete-btn")?.addEventListener("click",A),document.getElementById("ext-delete-search-input")?.addEventListener("input",w),e?.addEventListener("click",function(n){n.target===e&&B()})},50)),e.classList.add("show")}function B(){let e=document.getElementById(d.modalId);e&&e.classList.remove("show"),a=[],x=!1;let n=document.getElementById(d.previewId),o=document.getElementById(d.progressId),t=document.getElementById(d.statusId);n&&(n.style.display="none",n.innerHTML=""),o&&(o.style.display="none"),t&&(t.textContent="");let r=document.querySelector(".ext-modal-buttons");r&&(r.innerHTML='<button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button><button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">'+g.trash+"</span> Hapus Terpilih</button>",document.getElementById("ext-delete-cancel-btn")?.addEventListener("click",B),document.getElementById("ext-start-delete-btn")?.addEventListener("click",A)),P(!1)}async function q(){let n=new URLSearchParams(window.location.search).get("id_visit");if(console.log("[BatchDelete] Current URL:",window.location.href),console.log("[BatchDelete] id_visit found:",n),!n){console.error("[BatchDelete] id_visit not found in URL!"),alert(`Parameter id_visit tidak ditemukan di URL saat ini.

Pastikan buka dari halaman detail pasien.`);return}let o=document.getElementById("ext-fetch-files-btn");o&&(o.disabled=!0,o.textContent="Mencari...");try{let t=`${window.location.origin}${d.fetchListUrl}?id_visit=${n}&page=85&id_kunjungan=`,r=await fetch(t);if(!r.ok)throw new Error("Gagal memuat halaman dokumen pasien");let p=await r.text(),l=new DOMParser().parseFromString(p,"text/html").querySelectorAll("table.data-list.tabel tr");console.log("[BatchDelete] Total rows found:",l.length),a=[];for(let s=1;s<l.length;s++){let c=l[s],f=c.querySelector('button[onclick*="hapus"]'),m=null;if(console.log(`[BatchDelete] Row ${s}: deleteBtn found:`,!!f),f){let M=f.getAttribute("onclick")?.match(/hapus\(([^)]+)\)/);M&&(m=M[1].replace(/['"]/g,"").trim())}if(!m)continue;let b=c.querySelector("td:nth-child(2) a"),y=c.cells[1]?.textContent?.trim()||"unknown",v=c.cells[2]?.textContent?.trim()||"-",h=c.cells[3]?.textContent?.trim()||"-",L=c.cells[4]?.textContent?.trim()||"-",k=b?.getAttribute("href")||"",E=k.startsWith("http")?k:`${window.location.origin}${k}`;a.push({id_dokumen:m,filename:y,keterangan:v,tglFile:h,tglUpload:L,url:E,selected:!1,status:"pending"})}if(a.length===0){console.error("[BatchDelete] No documents found in queue!");let s=document.getElementById(d.statusId);s&&(s.textContent="Tidak ada dokumen ditemukan.");return}console.log("[BatchDelete] Queue populated with",a.length,"documents"),w();let i=document.getElementById(d.statusId);i&&(i.textContent=`${a.length} dokumen siap dihapus!`)}catch(t){console.error("[Batch Delete] Crawl error:",t);let r=document.getElementById(d.statusId);r&&(r.textContent="Error: "+t.message)}finally{o&&(o.disabled=!1,o.textContent="Cari Dokumen Pasien")}}async function O(e){if(x)return;let n=a[e];if(!n||!confirm(`Hapus dokumen ini?

${n.filename}
ID: ${n.id_dokumen}

Tindakan ini tidak bisa di-undo.`))return;let t=document.getElementById(d.statusId);n.status="deleting",w(),t&&(t.textContent=`Menghapus 1 dokumen: ${n.filename}...`),await I(n.id_dokumen)?(a.splice(e,1),t&&(t.textContent=`Sukses menghapus: ${n.filename}`)):(n.status="error",t&&(t.textContent=`Gagal menghapus: ${n.filename}`)),w()}function w(){let e=document.getElementById(d.previewId),n=document.getElementById("ext-start-delete-btn"),o=document.getElementById(d.statusId),t=document.getElementById("ext-delete-search-wrap"),r=document.getElementById("ext-delete-search-input"),p=(r?.value||"").toLowerCase();if(!a||a.length===0){e&&(e.style.display="none",e.innerHTML=""),t&&(t.style.display="none"),r&&(r.value=""),n&&(n.disabled=!0),o&&(o.textContent="",o.style.color="#4b5563");return}t&&(t.style.display="block");let u=a.map((i,s)=>({item:i,idx:s})).filter(({item:i})=>!p||i.filename.toLowerCase().includes(p)||i.keterangan.toLowerCase().includes(p)||i.id_dokumen.toLowerCase().includes(p));if(e&&(e.style.display="block",e.style.borderRadius="6px"),e.innerHTML='<div style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #f1f5f9;font-size:11px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.5px;">Dokumen Pasien <span style="color:#64748b;font-weight:400;">('+a.length+' dokumen, <span style="color:#dc2626;">'+a.filter(i=>i.selected).length+"</span> dipilih)</span></div>",u.length===0){let i=document.createElement("div");i.style.cssText="padding:32px;text-align:center;font-size:13px;color:#94a3b8;",i.textContent="Tidak ada dokumen yang cocok dengan pencarian.",e?.appendChild(i)}u.forEach(({item:i,idx:s})=>{let c=document.createElement("div");c.className="ext-delete-preview-item",i.selected&&c.classList.add("selected");let f=x;c.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" data-index="${s}" class="ext-checkbox" ${i.selected?"checked":""} ${f?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s+1}. ${i.filename}</strong>
            ${i.status!=="pending"?`<span class="ext-status-badge" data-status="${i.status}">${i.status==="success"?"Selesai":i.status==="error"?"Gagal":i.status==="deleting"?"...":i.status}</span>`:""}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
            <span>ID: <strong style="color: #111827;">${i.id_dokumen}</strong></span>
            <span style="color: #d1d5db;">|</span>
            <span>${i.tglFile}</span>
            <span style="color: #d1d5db;">|</span>
            <span>${i.tglUpload}</span>
          </div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${i.keterangan}</div>
        </div>
      </label>
      <button data-index="${s}" class="ext-delete-preview-btn" ${f?"disabled":""}>${g.eye} Preview</button>
      <button data-index="${s}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${f?"disabled":""}>${g.trash}</button>
    `;let m=c.querySelector('input[type="checkbox"]');!x&&m&&m.addEventListener("change",h=>{a[s].selected=h.target.checked,w()});let b=c.querySelectorAll("button"),y=b[0],v=b[1];x||(y.addEventListener("click",()=>{S(a[s].url,a[s].filename)}),v.addEventListener("click",()=>{O(s)})),e?.appendChild(c)});let l=a.filter(i=>i.selected).length;n&&(n.disabled=l===0||x,n.textContent=`Hapus ${l} Dokumen`,l>0&&!x?n.classList.remove("disabled"):n.classList.add("disabled"))}async function A(){if(x)return;let e=a.filter(l=>l.selected);if(e.length===0){alert("Pilih dokumen untuk dihapus");return}if(!confirm(`Hapus ${e.length} dokumen? TIDAK BISA DIUNDO!`))return;x=!0,P(!0);let n=0,o=0,t=document.getElementById(d.progressId),r=t?.querySelector(".progress-fill"),p=document.getElementById(d.statusId);t&&(t.style.display="block"),r&&(r.style.width="0%"),p&&(p.style.color="#fcd34d");for(let l=0;l<e.length;l++){let i=e[l];if(i.status="deleting",await I(i.id_dokumen)?(i.status="success",n++):(i.status="error",o++),w(),r&&p){let c=(l+1)/e.length*100;r.style.width=c+"%",p.textContent=`Diproses ${l+1}/${e.length} - Sukses: ${n}, Gagal: ${o}`}await new Promise(c=>setTimeout(c,d.delayBetweenDelete))}let u=`Selesai! Sukses: ${n}, Gagal: ${o}`;p&&(p.textContent=u,p.style.color=o>0?"#000000":"#6ee7b7"),o>0&&console.log("Failed deletes:",a.filter(l=>l.status==="error")),alert(u),U(),x=!1}function G(){let e=window.location.pathname,n=/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/.test(e),o=!!new URLSearchParams(window.location.search).get("id_visit");return console.log("[BatchDelete] URL check:",{path:e,pathMatch:n,hasIdVisit:o}),n&&o}async function N(){let n=new URLSearchParams(window.location.search).get("id_visit");if(!n){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_ERROR",data:{error:"Parameter id_visit tidak ditemukan di URL."}}).catch(console.error);return}try{let o=`${window.location.origin}${d.fetchListUrl}?id_visit=${n}&page=85&id_kunjungan=`,t=await fetch(o);if(!t.ok)throw new Error("Gagal memuat halaman dokumen pasien");let r=await t.text(),u=new DOMParser().parseFromString(r,"text/html").querySelectorAll("table.data-list.tabel tr");a=[];for(let l=1;l<u.length;l++){let i=u[l],s=i.querySelector('button[onclick*="hapus"]'),c=null;if(s){let E=s.getAttribute("onclick")?.match(/hapus\(([^)]+)\)/);E&&(c=E[1].replace(/['"]/g,"").trim())}if(!c)continue;let f=i.querySelector("td:nth-child(2) a"),m=i.cells[1]?.textContent?.trim()||"unknown",b=i.cells[2]?.textContent?.trim()||"-",y=i.cells[3]?.textContent?.trim()||"-",v=i.cells[4]?.textContent?.trim()||"-",h=f?.getAttribute("href")||"",L=h.startsWith("http")?h:`${window.location.origin}${h}`;a.push({id_dokumen:c,filename:m,keterangan:b,tglFile:y,tglUpload:v,url:L,selected:!1,status:"pending"})}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_CRAWL_RESULT",data:{items:a}}).catch(console.error)}catch(o){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_ERROR",data:{error:o.message}}).catch(console.error)}}async function W(e,n){if(!a[e])return;let t=await I(n);chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_SINGLE_RESULT",data:{index:e,success:t,error:t?void 0:"Gagal memproses penghapusan di server."}}).catch(console.error)}async function V(){let e=a.filter(t=>t.selected);if(e.length===0)return;let n=0,o=0;for(let t=0;t<e.length;t++){let r=e[t];r.status="deleting",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_PROGRESS",data:{percent:t/e.length*100,status:`Menghapus: ${r.filename} (${t+1}/${e.length})...`,items:a,finished:!1}}).catch(console.error),await I(r.id_dokumen)?(r.status="success",n++):(r.status="error",o++),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_DELETE_PROGRESS",data:{percent:(t+1)/e.length*100,status:`Diproses ${t+1}/${e.length} - Sukses: ${n}, Gagal: ${o}`,items:a,finished:t===e.length-1}}).catch(console.error),await new Promise(u=>setTimeout(u,d.delayBetweenDelete))}}function K(){if(G()&&T.currentConfig?.features?.batchDelete?.enabled&&T.ExtensionCore.isFeatureAllowed("batchDelete"))try{console.log("[BatchDelete] Init starting..."),R(),chrome.runtime.sendMessage({type:"PAGE_CONTEXT",feature:"mKlaimDetail",data:{idVisit:new URLSearchParams(window.location.search).get("id_visit")}}).catch(console.error),chrome.runtime.onMessage.addListener((e,n,o)=>{if(e.type==="TAB_ACTION"){let{action:t,payload:r}=e;t==="BATCH_DELETE_CRAWL"?N():t==="BATCH_DELETE_UPDATE_ITEMS"?a=r.items:t==="BATCH_DELETE_PREVIEW"?S(r.url,r.filename).catch(()=>{window.open(r.url,"_blank")}):t==="BATCH_DELETE_SINGLE"?W(r.index,r.id_dokumen):t==="BATCH_DELETE_START"&&V(),o({success:!0})}else e.type==="BATCH_DELETE_ACTION"&&o({success:!0});return!0}),setTimeout(j,500),console.log("[BatchDelete] Init complete, button should be rendered")}catch(e){console.error("[BatchDelete] Init error:",e)}}typeof T.featureModules<"u"&&(T.featureModules.batchDelete={name:"Batch Delete Dokumen",description:"Hapus multiple dokumen sekaligus",run:K});})();
