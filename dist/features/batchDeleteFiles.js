"use strict";var __morbis_feature=(()=>{function C(){return window}var T="ext-batch-shared-style";function I(){if(document.getElementById(T))return;let e=document.createElement("style");e.id=T,e.textContent=`
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
  `,document.head.appendChild(e)}var x={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};function S(e,t){let i=t||18;return`<span style="display:inline-flex;align-items:center;justify-content:center;width:${i}px;height:${i}px;flex-shrink:0;">${e}</span>`}async function $(e,t){try{let i=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!i.ok)throw new Error(`HTTP ${i.status}`);let n=await i.blob(),r=URL.createObjectURL(n);M(r,t,e,()=>URL.revokeObjectURL(r))}catch{M(e,t,e)}}function M(e,t,i,n){let r=document.getElementById("ext-inline-preview-modal");r&&r.remove();let p=t.toLowerCase().split(".").pop()||"",f=p==="pdf",l=["jpg","jpeg","png","gif","webp"].includes(p),o=document.createElement("div");o.id="ext-inline-preview-modal",o.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let s='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';f?s=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:l?s=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:s=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${x.file}<div>Preview not available for this format</div></div>`;let d=t.replace(/"/g,"&quot;").replace(/</g,"&lt;");if(o.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${d}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${x.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${x.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${s}</div>
  `,document.body.appendChild(o),document.getElementById("ext-preview-close")?.addEventListener("click",()=>{n&&n(),o.remove()}),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(i||e,"_blank"),n&&n(),o.remove()}),o.addEventListener("click",u=>{u.target===o&&(n&&n(),o.remove())}),document.addEventListener("keydown",function u(m){m.key==="Escape"&&(n&&n(),o.remove(),document.removeEventListener("keydown",u))}),f||l){let u=setInterval(()=>{if(f?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let b=o.querySelector(".ext-inline-preview-loading");b&&b.remove(),clearInterval(u)}},500)}}var w=C(),a={deleteEndpoint:"/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus",fetchListUrl:"/admisi/pelaksanaan_pelayanan/dokumen-pasien",maxConcurrent:1,maxBatchSize:10,delayBetweenDelete:500,modalId:"ext-batch-delete-modal",previewId:"ext-delete-preview-list",progressId:"ext-delete-progress-bar",statusId:"ext-delete-status-text"},c=[],g=!1;function j(){if(document.getElementById("ext-batch-delete-style"))return;let e=document.createElement("style");e.id="ext-batch-delete-style",e.textContent=`
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
  `,document.head.appendChild(e),I()}function _(e){document.querySelectorAll("button:not(#ext-batch-delete-btn):not([disabled])").forEach(n=>{e?(n.disabled=!0,n.dataset.extWasEnabled="true"):n.dataset.extWasEnabled==="true"&&(n.disabled=!1,delete n.dataset.extWasEnabled)}),document.querySelectorAll("form input, form button, form a").forEach(n=>{e?(n.disabled=!0,n.dataset.extWasEnabled="true"):n.dataset.extWasEnabled==="true"&&(n.disabled=!1,delete n.dataset.extWasEnabled)})}function D(e){["ext-delete-close-btn","ext-delete-cancel-btn","ext-fetch-files-btn","ext-start-delete-btn"].forEach(i=>{let n=document.getElementById(i);n&&(n.disabled=e,n.style.opacity=e?"0.5":"1",n.style.cursor=e?"not-allowed":"pointer")}),document.querySelectorAll("#"+a.previewId+" input, #"+a.previewId+" button").forEach(i=>i.disabled=e),_(e)}function F(){let e=document.querySelector(".ext-modal-buttons");e&&(e.innerHTML='<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">'+x.refresh+" Reload Halaman</span></button>",document.getElementById("ext-reload-btn")?.addEventListener("click",()=>{window.location.reload()}))}async function H(e){try{let t=new FormData;return t.append("id",e),(await fetch(a.deleteEndpoint,{method:"POST",body:t,credentials:"same-origin"})).ok}catch(t){return console.error("[Delete Dokumen] Error:",t),!1}}function q(){if(document.getElementById("ext-batch-delete-btn"))return;I();let e=document.createElement("button");e.id="ext-batch-delete-btn",e.type="button",e.textContent="Hapus Dokumen",e.addEventListener("click",A);let t=null,i=document.getElementById("ext-batch-url-btn");i&&i.parentNode?(t=i.parentNode,t.insertBefore(e,i.nextSibling)):(t=document.querySelector(".panel-heading")||document.querySelector('[id*="upload"]')||document.querySelector(".panel")||document.querySelector("main")||document.body,t?t.appendChild(e):console.error("[BatchDelete] No suitable container found!"))}function A(){let e=document.getElementById(a.modalId);e||(e=document.createElement("div"),e.id=a.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Hapus Dokumen</h3>
          <button class="ext-modal-close" id="ext-delete-close-btn">${x.xClose}</button>
        </div>
        <div class="ext-warning-box">
          <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">${S(x.warning,18)} PERHATIAN!</strong>
          <span style="font-size: 12px; opacity: 0.85; line-height: 1.5;">File yang dihapus <strong style="color: #7c2d12;">tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen.</span>
        </div>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button id="ext-fetch-files-btn" class="ext-btn ext-btn-purple">
            <span style="display: inline-flex; align-items: center; gap: 7px;">${x.search} Cari Dokumen Pasien</span>
          </button>
        </div>
        <div id="ext-delete-search-wrap" style="display: none; margin-bottom: 12px;">
          <input type="text" id="ext-delete-search-input" class="ext-search-input" placeholder="Cari dokumen...">
        </div>
        <div id="${a.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${a.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${a.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button>
          <button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">${x.trash}</span> Hapus Terpilih</button>
        </div>
      </div>
    `,document.body.appendChild(e),setTimeout(()=>{document.getElementById("ext-delete-close-btn")?.addEventListener("click",y),document.getElementById("ext-delete-cancel-btn")?.addEventListener("click",y),document.getElementById("ext-fetch-files-btn")?.addEventListener("click",U),document.getElementById("ext-start-delete-btn")?.addEventListener("click",P),document.getElementById("ext-delete-search-input")?.addEventListener("input",h),e?.addEventListener("click",function(t){t.target===e&&y()})},50)),e.classList.add("show")}function y(){let e=document.getElementById(a.modalId);e&&e.classList.remove("show"),c=[],g=!1;let t=document.getElementById(a.previewId),i=document.getElementById(a.progressId),n=document.getElementById(a.statusId);t&&(t.style.display="none",t.innerHTML=""),i&&(i.style.display="none"),n&&(n.textContent="");let r=document.querySelector(".ext-modal-buttons");r&&(r.innerHTML='<button id="ext-delete-cancel-btn" class="ext-btn ext-btn-secondary">Batal</button><button id="ext-start-delete-btn" class="ext-btn ext-btn-danger disabled"><span style="display:inline-flex;align-items:center;gap:6px;">'+x.trash+"</span> Hapus Terpilih</button>",document.getElementById("ext-delete-cancel-btn")?.addEventListener("click",y),document.getElementById("ext-start-delete-btn")?.addEventListener("click",P)),D(!1)}async function U(){let t=new URLSearchParams(window.location.search).get("id_visit");if(console.log("[BatchDelete] Current URL:",window.location.href),console.log("[BatchDelete] id_visit found:",t),!t){console.error("[BatchDelete] id_visit not found in URL!"),alert(`Parameter id_visit tidak ditemukan di URL saat ini.

Pastikan buka dari halaman detail pasien.`);return}let i=document.getElementById("ext-fetch-files-btn");i&&(i.disabled=!0,i.textContent="Mencari...");try{let n=`${window.location.origin}${a.fetchListUrl}?id_visit=${t}&page=85&id_kunjungan=`,r=await fetch(n);if(!r.ok)throw new Error("Gagal memuat halaman dokumen pasien");let p=await r.text(),l=new DOMParser().parseFromString(p,"text/html").querySelectorAll("table.data-list.tabel tr");console.log("[BatchDelete] Total rows found:",l.length),c=[];for(let s=1;s<l.length;s++){let d=l[s],u=d.querySelector('button[onclick*="hapus"]'),m=null;if(console.log(`[BatchDelete] Row ${s}: deleteBtn found:`,!!u),u){let L=u.getAttribute("onclick")?.match(/hapus\(([^)]+)\)/);L&&(m=L[1].replace(/['"]/g,"").trim())}if(!m)continue;let b=d.querySelector("td:nth-child(2) a"),v=d.cells[1]?.textContent?.trim()||"unknown",k=d.cells[2]?.textContent?.trim()||"-",E=d.cells[3]?.textContent?.trim()||"-",z=d.cells[4]?.textContent?.trim()||"-",B=b?.getAttribute("href")||"",R=B.startsWith("http")?B:`${window.location.origin}${B}`;c.push({id_dokumen:m,filename:v,keterangan:k,tglFile:E,tglUpload:z,url:R,selected:!1,status:"pending"})}if(c.length===0){console.error("[BatchDelete] No documents found in queue!");let s=document.getElementById(a.statusId);s&&(s.textContent="Tidak ada dokumen ditemukan.");return}console.log("[BatchDelete] Queue populated with",c.length,"documents"),h();let o=document.getElementById(a.statusId);o&&(o.textContent=`${c.length} dokumen siap dihapus!`)}catch(n){console.error("[Batch Delete] Crawl error:",n);let r=document.getElementById(a.statusId);r&&(r.textContent="Error: "+n.message)}finally{i&&(i.disabled=!1,i.textContent="Cari Dokumen Pasien")}}async function G(e){if(g)return;let t=c[e];if(!t||!confirm(`Hapus dokumen ini?

${t.filename}
ID: ${t.id_dokumen}

Tindakan ini tidak bisa di-undo.`))return;let n=document.getElementById(a.statusId);t.status="deleting",h(),n&&(n.textContent=`Menghapus 1 dokumen: ${t.filename}...`),await H(t.id_dokumen)?(c.splice(e,1),n&&(n.textContent=`Sukses menghapus: ${t.filename}`)):(t.status="error",n&&(n.textContent=`Gagal menghapus: ${t.filename}`)),h()}function h(){let e=document.getElementById(a.previewId),t=document.getElementById("ext-start-delete-btn"),i=document.getElementById(a.statusId),n=document.getElementById("ext-delete-search-wrap"),r=document.getElementById("ext-delete-search-input"),p=(r?.value||"").toLowerCase();if(!c||c.length===0){e&&(e.style.display="none",e.innerHTML=""),n&&(n.style.display="none"),r&&(r.value=""),t&&(t.disabled=!0),i&&(i.textContent="",i.style.color="#4b5563");return}n&&(n.style.display="block");let f=c.map((o,s)=>({item:o,idx:s})).filter(({item:o})=>!p||o.filename.toLowerCase().includes(p)||o.keterangan.toLowerCase().includes(p)||o.id_dokumen.toLowerCase().includes(p));if(e&&(e.style.display="block",e.style.borderRadius="6px"),e.innerHTML='<div style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #f1f5f9;font-size:11px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.5px;">Dokumen Pasien <span style="color:#64748b;font-weight:400;">('+c.length+' dokumen, <span style="color:#dc2626;">'+c.filter(o=>o.selected).length+"</span> dipilih)</span></div>",f.length===0){let o=document.createElement("div");o.style.cssText="padding:32px;text-align:center;font-size:13px;color:#94a3b8;",o.textContent="Tidak ada dokumen yang cocok dengan pencarian.",e?.appendChild(o)}f.forEach(({item:o,idx:s})=>{let d=document.createElement("div");d.className="ext-delete-preview-item",o.selected&&d.classList.add("selected");let u=g;d.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" data-index="${s}" class="ext-checkbox" ${o.selected?"checked":""} ${u?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s+1}. ${o.filename}</strong>
            ${o.status!=="pending"?`<span class="ext-status-badge" data-status="${o.status}">${o.status==="success"?"Selesai":o.status==="error"?"Gagal":o.status==="deleting"?"...":o.status}</span>`:""}
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
      <button data-index="${s}" class="ext-delete-preview-btn" ${u?"disabled":""}>${x.eye} Preview</button>
      <button data-index="${s}" class="ext-delete-single-btn" title="Hapus Dokumen Ini" ${u?"disabled":""}>${x.trash}</button>
    `;let m=d.querySelector('input[type="checkbox"]');!g&&m&&m.addEventListener("change",E=>{c[s].selected=E.target.checked,h()});let b=d.querySelectorAll("button"),v=b[0],k=b[1];g||(v.addEventListener("click",()=>{$(c[s].url,c[s].filename)}),k.addEventListener("click",()=>{G(s)})),e?.appendChild(d)});let l=c.filter(o=>o.selected).length;t&&(t.disabled=l===0||g,t.textContent=`Hapus ${l} Dokumen`,l>0&&!g?t.classList.remove("disabled"):t.classList.add("disabled"))}async function P(){if(g)return;let e=c.filter(l=>l.selected);if(e.length===0){alert("Pilih dokumen untuk dihapus");return}if(!confirm(`Hapus ${e.length} dokumen? TIDAK BISA DIUNDO!`))return;g=!0,D(!0);let t=0,i=0,n=document.getElementById(a.progressId),r=n?.querySelector(".progress-fill"),p=document.getElementById(a.statusId);n&&(n.style.display="block"),r&&(r.style.width="0%"),p&&(p.style.color="#fcd34d");for(let l=0;l<e.length;l++){let o=e[l];if(o.status="deleting",await H(o.id_dokumen)?(o.status="success",t++):(o.status="error",i++),h(),r&&p){let d=(l+1)/e.length*100;r.style.width=d+"%",p.textContent=`Diproses ${l+1}/${e.length} - Sukses: ${t}, Gagal: ${i}`}await new Promise(d=>setTimeout(d,a.delayBetweenDelete))}let f=`Selesai! Sukses: ${t}, Gagal: ${i}`;p&&(p.textContent=f,p.style.color=i>0?"#000000":"#6ee7b7"),i>0&&console.log("Failed deletes:",c.filter(l=>l.status==="error")),alert(f),F(),g=!1}function W(){let e=window.location.pathname,t=/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/.test(e),i=!!new URLSearchParams(window.location.search).get("id_visit");return console.log("[BatchDelete] URL check:",{path:e,pathMatch:t,hasIdVisit:i}),t&&i}function N(){if(W()&&w.currentConfig?.features?.batchDelete?.enabled&&w.ExtensionCore.isFeatureAllowed("batchDelete"))try{console.log("[BatchDelete] Init starting..."),j(),setTimeout(q,500),console.log("[BatchDelete] Init complete, button should be rendered")}catch(e){console.error("[BatchDelete] Init error:",e)}}typeof w.featureModules<"u"&&(w.featureModules.batchDelete={name:"Batch Delete Dokumen",description:"Hapus multiple dokumen sekaligus",run:N});})();
