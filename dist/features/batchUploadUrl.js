"use strict";var __morbis_feature=(()=>{function P(){return window}var A="ext-batch-shared-style";function R(){if(document.getElementById(A))return;let e=document.createElement("style");e.id=A,e.textContent=`
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
  `,document.head.appendChild(e)}var b={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};async function C(e,r){try{let t=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!t.ok)throw new Error(`HTTP ${t.status}`);let n=await t.blob(),i=URL.createObjectURL(n);$(i,r,e,()=>URL.revokeObjectURL(i))}catch{$(e,r,e)}}function $(e,r,t,n){let i=document.getElementById("ext-inline-preview-modal");i&&i.remove();let c=r.toLowerCase().split(".").pop()||"",s=c==="pdf",p=["jpg","jpeg","png","gif","webp"].includes(c),a=document.createElement("div");a.id="ext-inline-preview-modal",a.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let o='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';s?o=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:p?o=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:o=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${b.file}<div>Preview not available for this format</div></div>`;let l=r.replace(/"/g,"&quot;").replace(/</g,"&lt;");if(a.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${l}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${b.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${b.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${o}</div>
  `,document.body.appendChild(a),document.getElementById("ext-preview-close")?.addEventListener("click",()=>{n&&n(),a.remove()}),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(t||e,"_blank"),n&&n(),a.remove()}),a.addEventListener("click",u=>{u.target===a&&(n&&n(),a.remove())}),document.addEventListener("keydown",function u(m){m.key==="Escape"&&(n&&n(),a.remove(),document.removeEventListener("keydown",u))}),s||p){let u=setInterval(()=>{if(s?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let h=a.querySelector(".ext-inline-preview-loading");h&&h.remove(),clearInterval(u)}},500)}}var I=P(),g={targetUrl:"/v2/m-klaim/detail-v2-refaktor",uploadEndpoint:"/v2/m-klaim/uploda-dokumen/control?sub=simpan",maxConcurrent:3,maxBatchSize:50,supportedExtensions:[".pdf",".jpg",".jpeg",".png"],modalId:"ext-batch-url-modal",textareaId:"ext-url-input",previewId:"ext-preview-list",progressId:"ext-progress-bar",statusId:"ext-status-text"};function N(e){let r=e.getFullYear(),t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${r}-${t}-${n}`}function q(){return N(new Date)}function S(){let e=document.getElementById("tgl");if(e&&e.value){let r=e.value.split("/");if(r.length===3){let[t,n,i]=r;return`${i}-${n}-${t}`}}return console.warn("[Batch Upload] Input #tgl tidak ditemukan, pakai tanggal hari ini"),q()}var d=[],f=!1;function D(e){return!e||typeof e!="string"?[]:e.split(`
`).map(t=>t.trim()).filter(t=>t.length>0).map(t=>t.replace(/ /g,"%20")).filter(t=>{try{new URL(t);let n=t.split(/[?#]/)[0].toLowerCase();return g.supportedExtensions.some(i=>n.endsWith(i))}catch{return!1}})}function B(e){try{let r=new URL(e),n=decodeURIComponent(r.pathname).split("/").pop()||"unknown",i=n.replace(/\.[^/.]+$/,""),c=i.split(/[-_\s]+/),s="",p=S(),a=c.findIndex(u=>/^\d{3,12}$/.test(u)&&!/^\d{10}$/.test(u));a!==-1&&(s=c[a],c.splice(a,1));let l=c.filter(u=>!/^\d{10}$/.test(u)).join(" ").trim()||i.replace(/[-_]+/g," ");return{filename:n,norm:s,tanggal:p,jenis_dokumen:"Lain-lain",keterangan:l,url:e,status:"pending"}}catch{return{filename:"error",norm:"",tanggal:S(),url:e,status:"error",error:"Invalid URL format"}}}function H(){if(document.getElementById("ext-batch-url-btn"))return;let e=document.createElement("button");if(e.id="ext-batch-url-btn",e.type="button",e.textContent="Upload Dokumen Ulang",e.style.cssText="margin: 8px 0 4px 10px; padding: 10px 22px; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; display: block; transition: all 0.15s ease; letter-spacing: -0.1px; box-shadow: 0 2px 8px rgba(37,99,235,0.2);",e.addEventListener("click",G),e.addEventListener("mouseenter",()=>e.style.background="#1d4ed8"),e.addEventListener("mouseleave",()=>e.style.background="#2563eb"),!document.getElementById("ext-batch-url-style")){let t=document.createElement("style");t.id="ext-batch-url-style",t.textContent=`
      #${g.textareaId} {
        width: 100%; height: 150px; padding: 12px; border: 1px solid #e2e8f0;
        border-radius: 10px; font-size: 12px; resize: vertical;
        background: #f8fafc; color: #1e293b;
        transition: border-color 0.15s ease; box-sizing: border-box;
      }
      #${g.textareaId}:focus {
        border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.1);
        background: #fff; outline: none;
      }
      #${g.previewId} {
        margin-top: 15px; max-height: 400px; overflow-y: auto;
        border: 1px solid #f1f5f9; border-radius: 10px; padding: 12px;
      }
      #${g.progressId} {
        width: 100%; height: 6px; background: #f1f5f9;
        border-radius: 3px; margin: 12px 0; display: none; overflow: hidden;
      }
      #${g.progressId} .progress-fill {
        height: 100%; background: #2563eb; border-radius: 3px;
        width: 0%; transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
      }
      .ext-input-label {
        display: block; margin-bottom: 6px; font-weight: 600;
        font-size: 13px; color: #334155;
      }
      .ext-mode-radio {
        display: flex; gap: 20px; align-items: center; margin-bottom: 16px;
        font-size: 13px; color: #475569;
      }
      .ext-mode-radio label { cursor: pointer; display: flex; align-items: center; gap: 6px; }
      .ext-mode-radio input[type="radio"] { accent-color: #2563eb; }
      .ext-upload-search-wrap { display: none; margin-bottom: 10px; }
      .ext-keterangan-input {
        width: 100%; padding: 6px 10px; font-size: 11px;
        border: 1px solid #e2e8f0; border-radius: 6px; outline: none;
        color: #475569; background: #f8fafc; box-sizing: border-box;
        margin-top: 5px; transition: border-color 0.15s ease;
      }
      .ext-keterangan-input:focus { border-color: #94a3b8; background: #fff; }
      .ext-keterangan-input::placeholder { color: #94a3b8; }
      .ext-inline-preview-spinner {
        width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.15);
        border-top: 4px solid #fff; border-radius: 50%;
        animation: ext-spin 0.8s linear infinite;
      }
      @keyframes ext-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `,document.head.appendChild(t)}R();let r=document.querySelector('.panel-heading, [id*="upload"], [class*="upload"]');if(r)r.appendChild(e);else{let t=document.querySelector('form[action*="uploda-dokumen"]');t&&t.parentNode?.insertBefore(e,t)}}function G(){let e=document.getElementById(g.modalId);e||(e=document.createElement("div"),e.id=g.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${b.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${g.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${b.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${b.search} Cari Dokumen Pasien Otomatis</button>
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
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${b.upload} Mulai Upload</button>
        </div>
      </div>
    `,setTimeout(()=>{document.getElementById("ext-modal-close-btn")?.addEventListener("click",()=>e?.classList.remove("show")),document.getElementById("ext-analyze-btn")?.addEventListener("click",V),document.getElementById("ext-cancel-btn")?.addEventListener("click",M),document.getElementById("ext-test-single-btn")?.addEventListener("click",z),document.getElementById("ext-start-upload-btn")?.addEventListener("click",j),document.querySelectorAll('input[name="ext-upload-mode"]').forEach(t=>{t.addEventListener("change",n=>{let i=n.target,c=document.getElementById("ext-manual-section"),s=document.getElementById("ext-auto-section");i.value==="manual"?(c&&(c.style.display="block"),s&&(s.style.display="none")):(c&&(c.style.display="none"),s&&(s.style.display="block")),d=[],w([]),x("")})}),document.getElementById("ext-crawl-btn")?.addEventListener("click",W),document.getElementById("ext-upload-search-input")?.addEventListener("input",()=>w(d)),e?.addEventListener("click",function(t){t.target===e&&M()})},0),document.body.appendChild(e)),e.classList.add("show"),document.getElementById(g.textareaId)?.focus()}function M(){let e=document.getElementById(g.modalId);if(e){e.classList.remove("show"),d=[],f=!1,w([]),O(0),x("");let r=document.getElementById("ext-upload-search-input");r&&(r.value="");let t=document.getElementById("ext-upload-search-wrap");t&&(t.style.display="none");let n=document.querySelector(".ext-modal-buttons");n&&(n.innerHTML='<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Batal</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>'+b.upload+" Mulai Upload</button>",document.getElementById("ext-cancel-btn")?.addEventListener("click",M),document.getElementById("ext-test-single-btn")?.addEventListener("click",z),document.getElementById("ext-start-upload-btn")?.addEventListener("click",j))}}function w(e){let r=document.getElementById(g.previewId),t=document.getElementById("ext-start-upload-btn"),n=document.getElementById("ext-upload-search-wrap"),i=document.getElementById("ext-upload-search-input"),c=document.getElementById("ext-auto-section")?.style.display!=="none",s=(i?.value||"").toLowerCase();if(!e||e.length===0){r&&(r.style.display="none"),t&&(t.disabled=!0),n&&(n.style.display="none"),i&&(i.value="");return}n&&c&&(n.style.display="block");let p=e.map((o,l)=>({item:o,i:l})).filter(({item:o})=>!s||o.filename.toLowerCase().includes(s)||o.keterangan.toLowerCase().includes(s)||o.norm.toLowerCase().includes(s));r&&(r.style.display="block");let a=document.createElement("div");if(a.style.marginBottom="10px",a.innerHTML=`<strong class="preview-header-text">Preview (${p.length} dari ${e.length} dokumen, ${e.filter(o=>o.selected!==!1).length} dipilih):</strong>`,r&&(r.innerHTML="",r.appendChild(a)),p.length===0){let o=document.createElement("div");o.style.cssText="padding:24px;text-align:center;font-size:13px;color:#9ca3af;",o.textContent="Tidak ada dokumen yang cocok dengan pencarian.",r?.appendChild(o)}p.forEach(({item:o,i:l})=>{let u="";o.tglFileTabel?u=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${o.tglFileTabel}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${o.tglUploadTabel}</strong></span>
      </div>`:u=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${o.norm||"-"}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${o.tanggal}</strong></span>
      </div>`;let m=document.createElement("div");m.className="ext-delete-preview-item",o.selected&&m.classList.add("selected"),m.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${l}" ${o.selected!==!1?"checked":""} ${f?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${l+1}. ${o.filename}</strong>
            ${o.status!=="pending"?`<span class="ext-status-badge" data-status="${o.status}">${o.status==="success"?"Sukses":o.status==="error"?"Gagal":o.status}</span>`:""}
          </div>
          ${u}
          <input type="text" class="ext-keterangan-input" data-index="${l}" value="${o.keterangan||""}" placeholder="Keterangan dokumen..." ${f?"disabled":""}>
          ${o.error?`<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${o.error}</div>`:""}
        </div>
      </label>
      <button data-index="${l}" class="ext-delete-preview-btn" ${f?"disabled":""}>${b.eye} Preview</button>
      <button data-index="${l}" class="ext-delete-single-btn" title="Buang dari Antrian" ${f?"disabled":""}>${b.xClose}</button>
    `;let h=m.querySelector(".ext-checkbox"),y=m.querySelector(".ext-delete-preview-btn"),k=m.querySelector(".ext-delete-single-btn"),v=E=>{if(f)return;o.selected=E,h&&(h.checked=E),E?m.classList.add("selected"):m.classList.remove("selected");let _=e.filter(F=>F.selected!==!1).length;a.innerHTML=`<strong class="preview-header-text">Preview (${_} Dokumen Dipilih):</strong>`,t&&(t.disabled=_===0)};h?.addEventListener("change",E=>v(E.target.checked)),k?.addEventListener("click",()=>v(!1));let L=m.querySelector(".ext-keterangan-input");L?.addEventListener("input",function(){d[l].keterangan=L.value}),y&&(y.addEventListener("click",async()=>{try{await C(d[l].url,d[l].filename)}catch{window.open(d[l].url,"_blank")}}),f&&(y.disabled=!0)),r?.appendChild(m)}),t&&(t.disabled=e.filter(o=>o.selected!==!1).length===0)}function O(e){let r=document.getElementById(g.progressId);if(!r)return;let t=r.querySelector(".progress-fill");e>0?(r.style.display="block",t&&(t.style.width=`${e}%`)):r.style.display="none"}function x(e){let r=document.getElementById(g.statusId);r&&(r.textContent=e)}function T(e){let r=["ext-analyze-btn","ext-cancel-btn","ext-test-single-btn","ext-start-upload-btn","ext-modal-close-btn","ext-crawl-btn",g.textareaId];document.querySelectorAll('input[name="ext-upload-mode"]').forEach(t=>{t.disabled=e}),r.forEach(t=>{let n=document.getElementById(t);n&&(n.disabled=e,(t==="ext-modal-close-btn"||t===g.textareaId)&&(n.style.opacity=e?"0.5":"1",n.style.cursor=e?"not-allowed":t===g.textareaId?"text":"pointer"))})}function V(){let r=document.getElementById(g.textareaId)?.value.trim()||"";if(!r){alert("Silakan paste URL terlebih dahulu");return}let t=D(r);if(t.length===0){alert("Tidak ada URL valid yang ditemukan. Pastikan URL mengandung ekstensi file yang didukung.");return}if(t.length>g.maxBatchSize){alert(`Maksimal ${g.maxBatchSize} URL per batch`);return}d=t.map(n=>B(n)),w(d),x(`${t.length} URL siap diproses`)}async function W(){let r=new URLSearchParams(window.location.search).get("id_visit");if(!r){alert("Parameter id_visit tidak ditemukan di URL saat ini.");return}x("Sedang mencari dokumen di rekam medis...");let t=document.getElementById("ext-crawl-btn");t&&(t.disabled=!0,t.textContent="Mencari...");try{let n=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${r}&page=85&id_kunjungan=`,i=await fetch(n);if(!i.ok)throw new Error("Gagal memuat halaman dokumen pasien");let c=await i.text(),p=new DOMParser().parseFromString(c,"text/html").querySelectorAll("table.data-list.tabel tr"),a=[];for(let o=1;o<p.length;o++){let l=p[o],u=l.querySelector("td:nth-child(2) a");if(!u)continue;let m=u.getAttribute("href");if(!m?.includes("/assets/dokumen-pasien/"))continue;let h=m.startsWith("http")?m:`${window.location.origin}${m}`,y=l.cells[1]?.textContent?.trim()||"",k=l.cells[2]?.textContent?.trim()||"",v=l.cells[3]?.textContent?.trim()||"",L=l.cells[4]?.textContent?.trim()||"";a.push({url:h,filenameTabel:y,tglFile:v,tglUpload:L,keteranganTabel:k})}if(a.length===0){x("Tidak ada dokumen ditemukan di rekam medis."),t&&(t.disabled=!1,t.textContent="Cari Dokumen Pasien Otomatis");return}d=a.map(o=>{let l=B(o.url);return l.tglFileTabel=o.tglFile,l.tglUploadTabel=o.tglUpload,l.filename=o.filenameTabel||l.filename,l.keterangan=o.keteranganTabel||l.filename||"-",l.selected=!1,l}),w(d),x(`${d.length} dokumen berhasil ditemukan!`)}catch(n){x("Error: "+n.message)}finally{t&&(t.disabled=!1,t.textContent="Cari Dokumen Pasien Otomatis")}}async function K(e,r){x(`Mengunduh: ${r}...`),console.log("[Batch Upload] Fetching URL:",e);let t=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);let n=await t.blob();return new File([n],r,{type:n.type})}async function U(e,r){try{let t=await K(e.url,e.filename),n=new FormData;n.append("id_visit",r),n.append("norm",e.norm),n.append("tgl_file",e.tanggal),n.append("jenis_dokumen",e.jenis_dokumen||"Lain-lain"),n.append("dok",t),n.append("keterangan",e.keterangan||""),x(`Mengupload: ${e.filename}...`);let i=await fetch(g.uploadEndpoint,{method:"POST",body:n,credentials:"same-origin"});if(!i.ok){let s=await i.text();throw new Error(`Upload failed: ${i.status} - ${s}`)}return{success:!0,result:await i.text()}}catch(t){return{success:!1,error:t.message}}}async function Y(){if(f)return;f=!0,T(!0);let e=document.getElementById("ext-start-upload-btn");e&&(e.textContent="Memproses...");let t=new URLSearchParams(window.location.search).get("id_visit")||"";if(!t){alert("ID Visit tidak ditemukan di URL"),T(!1),f=!1,e&&(e.textContent="Mulai Upload");return}let n=0,i=0,c=d.filter(a=>a.selected!==!1),s=c.length;if(s===0){alert("Tidak ada dokumen yang dipilih untuk diupload."),T(!1),f=!1,x(""),e&&(e.textContent="Mulai Upload");return}for(let a=0;a<s;a++){let o=c[a];try{let u=await U(o,t);u.success?(o.status="success",n++):(o.status="error",o.error=u.error,i++)}catch(u){o.status="error",o.error=u.message,i++}let l=(a+1)/s*100;O(l),w(d),x(`Diproses: ${a+1}/${s} - Sukses: ${n}, Gagal: ${i}`)}x(`Selesai! Sukses: ${n}, Gagal: ${i}`),i>0&&console.log("Failed uploads:",d.filter(a=>a.status==="error"));let p=document.querySelector(".ext-modal-buttons");p&&(p.innerHTML='<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">'+b.refresh+" Reload Halaman</span></button>",document.getElementById("ext-reload-btn")?.addEventListener("click",()=>window.location.reload())),f=!1}async function z(){if(d.length===0){alert("Tidak ada URL untuk ditest");return}if(f)return;f=!0,T(!0);let e=d[0];x("Testing single upload...");let t=new URLSearchParams(window.location.search).get("id_visit")||"";try{let n=await U(e,t);n.success?(e.status="success",x("Test sukses! Detail di console.")):(e.status="error",e.error=n.error,x("Test gagal! Detail di console."))}catch(n){e.status="error",e.error=n.message,x("Test error! Detail di console.")}w(d),T(!1),f=!1}function j(){if(d.length===0){alert("Tidak ada URL untuk diproses");return}confirm(`Upload ${d.length} dokumen? Proses ini tidak dapat dibatalkan.`)&&Y()}function Q(){return/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/.test(window.location.pathname)?!!new URLSearchParams(window.location.search).get("id_visit"):!1}async function Z(){let r=new URLSearchParams(window.location.search).get("id_visit");if(!r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Parameter id_visit tidak ditemukan di URL."}}).catch(console.error);return}try{let t=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${r}&page=85&id_kunjungan=`,n=await fetch(t);if(!n.ok)throw new Error("Gagal memuat halaman dokumen pasien");let i=await n.text(),s=new DOMParser().parseFromString(i,"text/html").querySelectorAll("table.data-list.tabel tr"),p=[];for(let a=1;a<s.length;a++){let o=s[a],l=o.querySelector("td:nth-child(2) a");if(!l)continue;let u=l.getAttribute("href");if(!u?.includes("/assets/dokumen-pasien/"))continue;let m=u.startsWith("http")?u:`${window.location.origin}${u}`,h=o.cells[1]?.textContent?.trim()||"",y=o.cells[2]?.textContent?.trim()||"",k=o.cells[3]?.textContent?.trim()||"",v=o.cells[4]?.textContent?.trim()||"";p.push({url:m,filenameTabel:h,tglFile:k,tglUpload:v,keteranganTabel:y})}if(p.length===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:[]}}).catch(console.error);return}d=p.map(a=>{let o=B(a.url);return o.tglFileTabel=a.tglFile,o.tglUploadTabel=a.tglUpload,o.filename=a.filenameTabel||o.filename,o.keterangan=a.keteranganTabel||o.filename||"-",o.selected=!1,o}),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:d}}).catch(console.error)}catch(t){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:t.message}}).catch(console.error)}}async function X(){let r=new URLSearchParams(window.location.search).get("id_visit")||"";if(!r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"ID Visit tidak ditemukan di URL"}}).catch(console.error);return}let t=0,n=0,i=d.filter(s=>s.selected!==!1),c=i.length;if(c===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Tidak ada dokumen yang dipilih."}}).catch(console.error);return}for(let s=0;s<c;s++){let p=i[s];p.status="uploading",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:s/c*100,status:`Mengupload: ${p.filename} (${s+1}/${c})...`,items:d,finished:!1}}).catch(console.error);try{let a=await U(p,r);a.success?(p.status="success",t++):(p.status="error",p.error=a.error,n++)}catch(a){p.status="error",p.error=a.message,n++}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:(s+1)/c*100,status:`Diproses: ${s+1}/${c} - Sukses: ${t}, Gagal: ${n}`,items:d,finished:s===c-1}}).catch(console.error)}}async function J(){if(d.length===0)return;let e=d[0],t=new URLSearchParams(window.location.search).get("id_visit")||"";e.status="uploading",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:50,status:`Testing single upload: ${e.filename}...`,items:d,finished:!1}}).catch(console.error);try{let n=await U(e,t);n.success?e.status="success":(e.status="error",e.error=n.error)}catch(n){e.status="error",e.error=n.message}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:100,status:e.status==="success"?"Test upload sukses!":"Test upload gagal!",items:d,finished:!0}}).catch(console.error)}function ee(){!I.currentConfig?.features?.batchUpload?.enabled||!I.ExtensionCore.isFeatureAllowed("batchUpload")||Q()&&(chrome.runtime.sendMessage({type:"PAGE_CONTEXT",feature:"mKlaimDetail",data:{idVisit:new URLSearchParams(window.location.search).get("id_visit"),tanggalMasuk:S()}}).catch(console.error),chrome.runtime.onMessage.addListener((e,r,t)=>{if(e.type==="TAB_ACTION"){let{action:n,payload:i}=e;n==="BATCH_UPLOAD_ANALYZE"?(d=D(i.inputText).map(s=>B(s)),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ANALYZE_RESULT",data:{items:d}}).catch(console.error)):n==="BATCH_UPLOAD_CRAWL"?Z():n==="BATCH_UPLOAD_UPDATE_ITEMS"?d=i.items:n==="BATCH_UPLOAD_PREVIEW"?C(i.url,i.filename).catch(()=>{window.open(i.url,"_blank")}):n==="BATCH_UPLOAD_START"?X():n==="BATCH_UPLOAD_TEST_SINGLE"&&J(),t({success:!0})}else e.type==="BATCH_UPLOAD_ACTION"&&t({success:!0});return!0}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",H):setTimeout(H,1e3))}typeof I.featureModules<"u"?I.featureModules.batchUpload={name:"Upload Dokumen Ulang",description:"Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis",run:ee}:console.warn("[Batch Upload] featureModules not defined, module registration skipped");})();
