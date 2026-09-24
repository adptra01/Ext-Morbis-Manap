"use strict";var __morbis_feature=(()=>{function K(){return window}var G="ext-batch-shared-style";function _(){if(document.getElementById(G))return;let e=document.createElement("style");e.id=G,e.textContent=`
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
  `,document.head.appendChild(e)}var k={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};async function O(e,a){try{let n=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!n.ok)throw new Error(`HTTP ${n.status}`);let t=await n.blob(),r=URL.createObjectURL(t);W(r,a,e,()=>URL.revokeObjectURL(r))}catch{W(e,a,e)}}function W(e,a,n,t){let r=document.getElementById("ext-inline-preview-modal");r&&r.remove();let s=a.toLowerCase().split(".").pop()||"",i=s==="pdf",l=["jpg","jpeg","png","gif","webp"].includes(s),d=document.createElement("div");d.id="ext-inline-preview-modal",d.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let o='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';i?o=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:l?o=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:o=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${k.file}<div>Preview not available for this format</div></div>`;let c=a.replace(/"/g,"&quot;").replace(/</g,"&lt;");if(d.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${c}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${k.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${k.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${o}</div>
  `,document.body.appendChild(d),document.getElementById("ext-preview-close")?.addEventListener("click",()=>{t&&t(),d.remove()}),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(n||e,"_blank"),t&&t(),d.remove()}),d.addEventListener("click",u=>{u.target===d&&(t&&t(),d.remove())}),document.addEventListener("keydown",function u(m){m.key==="Escape"&&(t&&t(),d.remove(),document.removeEventListener("keydown",u))}),i||l){let u=setInterval(()=>{if(i?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let f=d.querySelector(".ext-inline-preview-loading");f&&f.remove(),clearInterval(u)}},500)}}function T(e){return new Promise(a=>{_();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",t=document.createElement("div");t.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",t.innerHTML=`
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
      </div>`,t.querySelector("h3").textContent=e.title;let r=t.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((d,o)=>{o>0&&r.appendChild(document.createElement("br")),r.appendChild(document.createTextNode(d))});let s=d=>{t.remove(),document.removeEventListener("keydown",i),a(d)},i=d=>{d.key==="Escape"&&s(!1)};t.querySelector(".ext-modal-close").addEventListener("click",()=>s(!1)),t.addEventListener("click",d=>{d.target===t&&s(!1)}),t.querySelector("[data-ext-ok]").addEventListener("click",()=>s(!0));let l=t.querySelector("[data-ext-cancel]");l&&l.addEventListener("click",()=>s(!1)),document.addEventListener("keydown",i),document.body.appendChild(t)})}function re(e){let a=new Date,n=a.getTime(),t=Math.random().toString(36).substring(2,8);return`upload_${a.toISOString().slice(0,10).replace(/-/g,"")}_${n}_${t}${e}`}function V(e,a){return re(".pdf")}function j(e,a,n){let t=Math.max(1,Math.round(a)),r=Math.max(1,Math.round(n)),s=new TextEncoder,i=`1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
`,l=`2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
`,d=`3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${t} ${r}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>
endobj
`,o=`4 0 obj
<< /Type /XObject /Subtype /Image /Width ${t} /Height ${r} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${e.length} >>
stream
`,c=`
endstream
endobj
`,u=`q
${t} 0 0 ${r} 0 0 cm
/Im0 Do
Q
`,m=`5 0 obj
<< /Length ${s.encode(u).length} >>
stream
${u}endstream
endobj
`,f=`%PDF-1.4
`,h=[],v=0,x=[],y=B=>{h.push(B),v+=B.length};y(s.encode(f)),x[0]=v,y(s.encode(i)),x[1]=v,y(s.encode(l)),x[2]=v,y(s.encode(d)),x[3]=v,y(s.encode(o)),y(e),y(s.encode(c)),x[4]=v,y(s.encode(m));let S=v,C=`xref
0 6
0000000000 65535 f 
`;for(let B of x)C+=`${String(B).padStart(10,"0")} 00000 n 
`;return C+=`trailer
<< /Size 6 /Root 1 0 R >>
startxref
${S}
%%EOF
`,y(s.encode(C)),new Blob(h,{type:"application/pdf"})}function Y(e){return e.length>=5&&e[0]===37&&e[1]===80&&e[2]===68&&e[3]===70&&e[4]===45?"pdf":e.length>=3&&e[0]===255&&e[1]===216&&e[2]===255?"jpeg":e.length>=8&&e[0]===137&&e[1]===80&&e[2]===78&&e[3]===71?"png":e.length>=6&&e[0]===71&&e[1]===73&&e[2]===70&&e[3]===56?"gif":e.length>=12&&e[0]===82&&e[1]===73&&e[2]===70&&e[3]===70&&e[8]===87&&e[9]===69&&e[10]===66&&e[11]===80?"webp":"unknown"}var I=K(),g={targetUrl:"/v2/m-klaim/detail-v2-refaktor",uploadEndpoint:"/v2/m-klaim/uploda-dokumen/control?sub=simpan",maxConcurrent:3,maxBatchSize:50,supportedExtensions:[".pdf",".jpg",".jpeg",".png",".gif"],modalId:"ext-batch-url-modal",textareaId:"ext-url-input",previewId:"ext-preview-list",progressId:"ext-progress-bar",statusId:"ext-status-text"};function ae(e){let a=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0");return`${a}-${n}-${t}`}function oe(){return ae(new Date)}function H(){let e=t=>{if(!t)return null;let r=String(t).trim(),s=r.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(s)return`${s[1]}-${s[2].padStart(2,"0")}-${s[3].padStart(2,"0")}`;let i=r.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(i)return`${i[3]}-${i[2].padStart(2,"0")}-${i[1].padStart(2,"0")}`;let l=r.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);return l?`${l[3]}-${l[2].padStart(2,"0")}-${l[1].padStart(2,"0")}`:null},a=["#tgl","#tanggal","#tanggal_masuk",'input[name="tanggal"]'];for(let t of a){let r=document.querySelector(t),s=e(r?.value);if(s)return s}let n=new URLSearchParams(window.location.search);for(let t of["tanggalAwal","tanggalAkhir","tanggal","tgl"]){let r=e(n.get(t));if(r)return r}return console.warn("[Batch Upload] Tanggal klaim tidak ditemukan (input #tgl & URL), pakai tanggal hari ini"),oe()}function E(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ie(e,a={},n=3e4){let t=new AbortController,r=setTimeout(()=>t.abort(),n),s=a.signal;return s&&(s.aborted?(clearTimeout(r),t.abort()):s.addEventListener("abort",()=>t.abort())),fetch(e,{...a,signal:t.signal}).finally(()=>clearTimeout(r))}async function D(e,a={},n=2){let t=a.signal,r=null;for(let s=0;s<=n;s++){try{let i=t?{...a,signal:t}:a,l=await ie(e,i);if(l.ok||l.status>=400&&l.status<500&&l.status!==429)return l;r=new Error(`HTTP ${l.status}: ${l.statusText}`)}catch(i){if(r=i,i instanceof DOMException&&i.name==="AbortError"){if(t?.aborted)throw new Error("Batch cancelled");r=new Error("Request timeout")}}s<n&&!(r instanceof Error&&r.message==="Batch cancelled")&&(await new Promise(i=>setTimeout(i,1e3*(s+1))),console.log(`[Batch Upload] Retry ${s+1}/${n} for ${e}`))}throw r||new Error("Fetch failed after retries")}var p=[],w=!1,U=null;function P(){return U||(U=new AbortController),U.signal}function F(){U&&(U.abort(),U=null),w=!1}function Q(e){return!e||typeof e!="string"?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n.length>0).map(n=>n.replace(/ /g,"%20")).filter(n=>{try{new URL(n);let t=n.split(/[?#]/)[0].toLowerCase();return g.supportedExtensions.some(r=>t.endsWith(r))}catch{return!1}})}function M(e){try{let a=new URL(e),t=decodeURIComponent(a.pathname).split("/").pop()||"unknown",r=t.replace(/\.[^/.]+$/,""),s=r.split(/[-_\s]+/),i="",l=H(),d=s.filter(u=>{let m=/^\d+$/.test(u),f=u.length;return m&&f>=6&&f<=12&&f!==10&&f!==13});if(d.length>0)i=d[0];else{let u=a.searchParams.get("norm")||a.searchParams.get("no_rm");u&&/^\d{6,12}$/.test(u)&&(i=u)}let c=s.filter(u=>!/^\d{10}$/.test(u)&&u!==i).join(" ").trim()||r.replace(/[-_]+/g," ");return{filename:t,norm:i,tanggal:l,jenis_dokumen:"Lain-lain",keterangan:c,url:e,status:"pending"}}catch{return{filename:"error",norm:"",tanggal:H(),jenis_dokumen:"Lain-lain",keterangan:"URL tidak valid",url:e,status:"error",error:"Invalid URL format"}}}function se(){let e=document.getElementById(g.modalId);e||(e=document.createElement("div"),e.id=g.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${k.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${g.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${k.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${k.search} Cari Dokumen Pasien Otomatis</button>
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
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Tutup</button>
          <button class="ext-btn ext-btn-danger" id="ext-cancel-batch-btn" style="display:none;" title="Batalkan proses upload yang sedang berjalan">${k.xClose} Batalkan Upload</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${k.upload} Mulai Upload</button>
        </div>
      </div>
    `,setTimeout(()=>{document.getElementById("ext-modal-close-btn")?.addEventListener("click",()=>e?.classList.remove("show")),document.getElementById("ext-analyze-btn")?.addEventListener("click",le),document.getElementById("ext-cancel-btn")?.addEventListener("click",z),document.getElementById("ext-cancel-batch-btn")?.addEventListener("click",F),document.getElementById("ext-test-single-btn")?.addEventListener("click",ee),document.getElementById("ext-start-upload-btn")?.addEventListener("click",te),document.querySelectorAll('input[name="ext-upload-mode"]').forEach(n=>{n.addEventListener("change",t=>{let r=t.target,s=document.getElementById("ext-manual-section"),i=document.getElementById("ext-auto-section");r.value==="manual"?(s&&(s.style.display="block"),i&&(i.style.display="none")):(s&&(s.style.display="none"),i&&(i.style.display="block")),p=[],L([]),b("")})}),document.getElementById("ext-crawl-btn")?.addEventListener("click",de),document.getElementById("ext-upload-search-input")?.addEventListener("input",()=>L(p)),e?.addEventListener("click",function(n){n.target===e&&z()})},0),document.body.appendChild(e)),document.querySelectorAll(".ext-batch-delete-modal.show").forEach(n=>{n!==e&&n.classList.remove("show")}),e.classList.add("show"),document.getElementById(g.textareaId)?.focus()}function z(){F();let e=document.getElementById(g.modalId);if(e){e.classList.remove("show"),p=[],w=!1,L([]),X(0),b("");let a=document.getElementById("ext-upload-search-input");a&&(a.value="");let n=document.getElementById("ext-upload-search-wrap");n&&(n.style.display="none");let t=document.querySelector("#"+g.modalId+" .ext-modal-buttons");t&&(t.innerHTML='<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Tutup</button><button class="ext-btn ext-btn-danger" id="ext-cancel-batch-btn" style="display:none;" title="Batalkan proses upload yang sedang berjalan">'+k.xClose+' Batalkan Upload</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>'+k.upload+" Mulai Upload</button>",document.getElementById("ext-cancel-btn")?.addEventListener("click",z),document.getElementById("ext-cancel-batch-btn")?.addEventListener("click",F),document.getElementById("ext-test-single-btn")?.addEventListener("click",ee),document.getElementById("ext-start-upload-btn")?.addEventListener("click",te))}}function L(e){let a=document.getElementById(g.previewId),n=document.getElementById("ext-start-upload-btn"),t=document.getElementById("ext-upload-search-wrap"),r=document.getElementById("ext-upload-search-input"),s=document.getElementById("ext-auto-section")?.style.display!=="none",i=(r?.value||"").toLowerCase();if(!e||e.length===0){a&&(a.style.display="none"),n&&(n.disabled=!0),t&&(t.style.display="none"),r&&(r.value="");return}t&&s&&(t.style.display="block");let l=e.map((o,c)=>({item:o,i:c})).filter(({item:o})=>!i||o.filename.toLowerCase().includes(i)||o.keterangan.toLowerCase().includes(i)||o.norm.toLowerCase().includes(i));a&&(a.style.display="block");let d=document.createElement("div");if(d.style.marginBottom="10px",d.innerHTML=`<strong class="preview-header-text">Preview (${l.length} dari ${e.length} dokumen, ${e.filter(o=>o.selected!==!1).length} dipilih):</strong>`,a&&(a.innerHTML="",a.appendChild(d)),l.length===0){let o=document.createElement("div");o.style.cssText="padding:24px;text-align:center;font-size:13px;color:#9ca3af;",o.textContent="Tidak ada dokumen yang cocok dengan pencarian.",a?.appendChild(o)}l.forEach(({item:o,i:c})=>{let u="";o.tglFileTabel?u=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${E(o.tglFileTabel||"")}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${E(o.tglUploadTabel||"")}</strong></span>
      </div>`:u=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${E(o.norm||"-")}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${E(o.tanggal)}</strong></span>
      </div>`;let m=(o.filename.split(".").pop()||"").toLowerCase(),h={pdf:"bg-red-100 text-red-700",jpg:"bg-blue-100 text-blue-700",jpeg:"bg-blue-100 text-blue-700",png:"bg-green-100 text-green-700"}[m]||"bg-gray-100 text-gray-700",v=m?`<span class="${h}" style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;text-transform:uppercase;margin-left:6px;">${m}</span>`:"",x=document.createElement("div");x.className="ext-delete-preview-item",o.selected&&x.classList.add("selected"),x.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${c}" ${o.selected!==!1?"checked":""} ${w?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c+1}. ${E(o.filename)}${v}</strong>
            ${o.status!=="pending"?`<span class="ext-status-badge" data-status="${o.status==="success"?"success":o.status==="error"?"error":"deleting"}">${o.status==="success"?"Sukses":o.status==="error"?"Gagal":"Memproses"}</span>`:""}
          </div>
          ${u}
          <input type="text" class="ext-keterangan-input" data-index="${c}" value="${E(o.keterangan||"")}" placeholder="Keterangan dokumen..." ${w?"disabled":""}>
          ${o.error?`<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${E(o.error)}</div>`:""}
        </div>
      </label>
      <button data-index="${c}" class="ext-delete-preview-btn" ${w?"disabled":""}>${k.eye} Preview</button>
      <button data-index="${c}" class="ext-delete-single-btn" title="Buang dari Antrian" ${w?"disabled":""}>${k.xClose}</button>
    `;let y=x.querySelector(".ext-checkbox"),S=x.querySelector(".ext-delete-preview-btn"),C=x.querySelector(".ext-delete-single-btn"),B=$=>{if(w)return;o.selected=$,y&&(y.checked=$),$?x.classList.add("selected"):x.classList.remove("selected");let N=e.filter(ne=>ne.selected!==!1).length;d.innerHTML=`<strong class="preview-header-text">Preview (${N} Dokumen Dipilih):</strong>`,n&&(n.disabled=N===0)};y?.addEventListener("change",$=>B($.target.checked)),C?.addEventListener("click",()=>B(!1));let q=x.querySelector(".ext-keterangan-input");q?.addEventListener("input",function(){p[c].keterangan=q.value}),S&&(S.addEventListener("click",async()=>{try{await O(p[c].url,p[c].filename)}catch{window.open(p[c].url,"_blank")}}),w&&(S.disabled=!0)),a?.appendChild(x)}),n&&(n.disabled=e.filter(o=>o.selected!==!1).length===0)}function X(e){let a=document.getElementById(g.progressId);if(!a)return;let n=a.querySelector(".progress-fill");e>0?(a.style.display="block",n&&(n.style.width=`${e}%`)):a.style.display="none"}function b(e){let a=document.getElementById(g.statusId);a&&(a.textContent=e)}function R(e){let a=["ext-analyze-btn","ext-cancel-btn","ext-test-single-btn","ext-start-upload-btn","ext-modal-close-btn","ext-crawl-btn",g.textareaId];document.querySelectorAll('input[name="ext-upload-mode"]').forEach(t=>{t.disabled=e});let n=document.getElementById("ext-cancel-batch-btn");n&&(n.style.display=e?"inline-flex":"none"),a.forEach(t=>{let r=document.getElementById(t);r&&(r.disabled=e,(t==="ext-modal-close-btn"||t===g.textareaId)&&(r.style.opacity=e?"0.5":"1",r.style.cursor=e?"not-allowed":t===g.textareaId?"text":"pointer"))})}function le(){let a=document.getElementById(g.textareaId)?.value.trim()||"";if(!a){T({title:"Tidak ada URL",message:"Silakan paste URL terlebih dahulu.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let n=Q(a);if(n.length===0){T({title:"Tidak ada URL valid",message:"Pastikan URL mengandung ekstensi file yang didukung.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(n.length>g.maxBatchSize){T({title:"Terlalu banyak URL",message:`Maksimal ${g.maxBatchSize} URL per batch.`,variant:"warning",okLabel:"OK",hideCancel:!0});return}p=n.map(t=>M(t)),L(p),b(`${n.length} URL siap diproses`)}async function de(){let a=new URLSearchParams(window.location.search).get("id_visit");if(!a){T({title:"Parameter id_visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0});return}b("Sedang mencari dokumen di rekam medis...");let n=document.getElementById("ext-crawl-btn");n&&(n.disabled=!0,n.textContent="Mencari...");try{let t=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${a}&id_kunjungan=`,r=await fetch(t,{signal:P()});if(!r.ok)throw new Error("Gagal memuat halaman dokumen pasien");let s=await r.text(),i=new DOMParser().parseFromString(s,"text/html"),l=i.querySelectorAll("table.data-list.tabel tr");l.length<=1&&(l=i.querySelectorAll("table.tabel tr")),l.length<=1&&(l=i.querySelectorAll('table[id*="dokumen"] tr, table[class*="dokumen"] tr')),l.length<=1&&(l=i.querySelectorAll("tbody tr"));let d=[];for(let o=1;o<l.length;o++){let c=l[o],u=c.querySelector('td a[href*="/assets/dokumen-pasien/"]');if(u||(u=c.querySelector('td a[href*="dokumen-pasien"]')),u||(u=c.querySelector("a[href]")),!u)continue;let m=u.getAttribute("href");if(!m?.includes("/assets/dokumen-pasien/"))continue;let f=m.startsWith("http")?m:`${window.location.origin}${m}`,h=Array.from(c.querySelectorAll("td")),v=h[1]?.textContent?.trim()||h[0]?.textContent?.trim()||"",x=h[2]?.textContent?.trim()||h[1]?.textContent?.trim()||"",y=h[3]?.textContent?.trim()||h[2]?.textContent?.trim()||"",S=h[4]?.textContent?.trim()||h[3]?.textContent?.trim()||"";d.push({url:f,filenameTabel:v,tglFile:y,tglUpload:S,keteranganTabel:x})}if(d.length===0){b("Tidak ada dokumen ditemukan di rekam medis."),n&&(n.disabled=!1,n.textContent="Cari Dokumen Pasien Otomatis");return}p=d.map(o=>{let c=M(o.url);return c.tglFileTabel=o.tglFile,c.tglUploadTabel=o.tglUpload,c.filename=o.filenameTabel||c.filename,c.keterangan=o.keteranganTabel||c.filename||"-",c.selected=!1,c}),L(p),b(`${p.length} dokumen berhasil ditemukan!`)}catch(t){b("Error: "+t.message)}finally{n&&(n.disabled=!1,n.textContent="Cari Dokumen Pasien Otomatis")}}async function ce(e,a){b(`Mengunduh: ${E(a)}...`),console.log("[Batch Upload] Fetching URL:",e);let n,t=P();try{n=await D(e,{method:"GET",credentials:"same-origin",signal:t},2)}catch{n=await D(e,{method:"GET",mode:"cors",credentials:"omit",signal:t},1)}if(!n.ok){let d=await n.text().catch(()=>"");throw new Error(`HTTP ${n.status} \u2014 ${n.statusText||d.slice(0,120)}`)}let r=await n.blob();if(r.size===0)throw new Error("File kosong (0 bytes) dari server");let s=await r.slice(0,512).text().catch(()=>"");if(/^\s*<!doctype html|<html[\s>]/i.test(s))throw new Error("Server mengembalikan halaman HTML (sesi login kadaluarsa?) \u2014 bukan file dokumen");let i=a.includes(".")?"."+a.split(".").pop():"",l=a.replace(/[<>:"/\\|?*]/g,"_");return new File([r],l,{type:r.type||`application/${i.slice(1)||"octet-stream"}`})}async function ue(e){if(typeof createImageBitmap=="function"){let a=await createImageBitmap(e);try{return{width:a.width,height:a.height}}finally{a.close?.()}}return new Promise((a,n)=>{let t=new Image,r=URL.createObjectURL(e);t.onload=()=>{URL.revokeObjectURL(r),a({width:t.naturalWidth,height:t.naturalHeight})},t.onerror=()=>{URL.revokeObjectURL(r),n(new Error("Tidak bisa membaca dimensi gambar"))},t.src=r})}async function pe(e){let a=document.createElement("canvas"),n=URL.createObjectURL(e);try{let t=await new Promise((d,o)=>{let c=new Image;c.onload=()=>d(c),c.onerror=()=>o(new Error("Gagal memuat gambar untuk konversi ke PDF")),c.src=n}),r=Math.max(1,t.naturalWidth),s=Math.max(1,t.naturalHeight);a.width=r,a.height=s;let i=a.getContext("2d");if(!i)throw new Error("Canvas 2D tidak tersedia");i.fillStyle="#ffffff",i.fillRect(0,0,r,s),i.drawImage(t,0,0);let l=await new Promise(d=>a.toBlob(d,"image/jpeg",.92));if(!l)throw new Error("Gagal rasterisasi gambar ke JPEG");return{bytes:new Uint8Array(await l.arrayBuffer()),width:r,height:s}}finally{URL.revokeObjectURL(n)}}async function ge(e){let a=new Uint8Array(await e.slice(0,16).arrayBuffer()),n=Y(a),t=e.name.replace(/\.[a-z0-9]+$/i,".pdf");if(n==="pdf")return new File([e],t,{type:"application/pdf"});if(n==="jpeg"){let r=new Uint8Array(await e.arrayBuffer()),{width:s,height:i}=await ue(e);return new File([j(r,s,i)],t,{type:"application/pdf"})}if(n==="png"||n==="gif"||n==="webp"){let{bytes:r,width:s,height:i}=await pe(e);return new File([j(r,s,i)],t,{type:"application/pdf"})}throw new Error(`File bukan PDF/gambar yang bisa dikonversi (${e.type||"tipe tidak diketahui"}) \u2014 upload dibatalkan`)}function me(){let e=new Date,a=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0"),r=String(e.getHours()).padStart(2,"0"),s=String(e.getMinutes()).padStart(2,"0"),i=String(e.getSeconds()).padStart(2,"0");return`${a}-${n}-${t} ${r}:${s}:${i}`}async function A(e,a){try{let n=V(e,e.keterangan);b(`Download: ${E(e.filename)}...`);let t=await ce(e.url,n);b(`Konversi ke PDF: ${E(e.filename)}...`),t=await ge(t);let r=new FormData;r.append("id_visit",a),r.append("norm",e.norm),r.append("tgl_file",e.tanggal),r.append("jenis_dokumen",e.jenis_dokumen||"Lain-lain"),r.append("dok",t);let s=me();r.append("keterangan",s),b(`Upload: ${E(t.name)} (${(t.size/1024).toFixed(0)} KB)...`);let i=await D(g.uploadEndpoint,{method:"POST",body:r,credentials:"same-origin",signal:P()},2);if(!i.ok){if(i.redirected)throw new Error("Sesi login kadaluarsa \u2014 login ulang di tab ini lalu coba lagi");let c=await i.text().catch(()=>""),u=c.replace(/<[^>]+>/g,"").trim().slice(0,200),m=c.match(/"message"\s*:\s*"([^"]+)"/),f=m?`Server ${i.status}: ${m[1]}`:`Server ${i.status}: ${u||i.statusText}`;throw new Error(f)}let l=await i.text(),d=i.headers.get("content-type")||"";if(/application\/json/i.test(d))try{let c=JSON.parse(l);return c.success===!1||c.status==="error"||c.error?{success:!1,error:c.message||c.error||"Server rejected"}:{success:!0,result:l}}catch{return{success:!0,result:l}}if(/text\/html/i.test(d))return/class="[^"]*alert-danger[^"]*"/i.test(l)||/<div[^>]*class="[^"]*error[^"]*"[^>]*>[\s\S]{0,200}<\/div>/i.test(l)||/"success"\s*:\s*false/i.test(l)?{success:!1,error:`Server error: ${l.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,200)}`}:{success:!0,result:l};let o=l.trim();return/^(error|gagal)/i.test(o)?{success:!1,error:`Server: ${o.slice(0,200)}`}:{success:!0,result:l}}catch(n){let t=n.message,r=t;return t.includes("Failed to fetch")||t.includes("NetworkError")?r="Network error \u2014 cek koneksi atau CORS":t.includes("timeout")||t.includes("AbortError")?r="Timeout \u2014 server tidak merespon dalam 30 detik":t.includes("0 bytes")&&(r="File kosong dari server"),{success:!1,error:r}}}async function Z(){if(w)return;w=!0,R(!0);let e=document.getElementById("ext-start-upload-btn");e&&(e.textContent="Memproses...");let n=new URLSearchParams(window.location.search).get("id_visit")||"";if(!n){T({title:"ID Visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0}),R(!1),w=!1,e&&(e.textContent="Mulai Upload");return}let t=0,r=0,s=p.filter(o=>o.selected!==!1),i=s.length;if(i===0){T({title:"Tidak ada dokumen dipilih",message:"Tidak ada dokumen yang dipilih untuk diupload.",variant:"warning",okLabel:"OK",hideCancel:!0}),R(!1),w=!1,b(""),e&&(e.textContent="Mulai Upload");return}for(let o=0;o<i;o++){if(P().aborted){b("Batch dibatalkan oleh user");break}let c=new URLSearchParams(window.location.search).get("id_visit")||"";if(!c){b("ID Visit hilang dari URL \u2014 batch dihentikan");break}c!==n&&console.warn("[Batch Upload] ID Visit berubah mid-batch:",n,"->",c);let u=s[o];b(`[${o+1}/${i}] ${E(u.filename)}...`);try{let f=new URLSearchParams(window.location.search).get("id_visit")||n,h=await A(u,f);h.success?(u.status="success",t++):(u.status="error",u.error=h.error,r++)}catch(f){if(f instanceof Error&&f.message==="Batch cancelled"){b("Batch dibatalkan");break}u.status="error",u.error=f.message,r++}let m=(o+1)/i*100;X(m),L(p)}let l=[`Selesai ${i} dokumen:`,`${t} sukses`];r>0&&l.push(`${r} gagal`),b(l.join(" ")),r>0&&console.warn("[Batch Upload] Failed:",p.filter(o=>o.status==="error").map(o=>`${o.filename}: ${o.error}`));let d=document.querySelector("#"+g.modalId+" .ext-modal-buttons");if(d){let o=`<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">${k.refresh} Reload Halaman</span></button>`,c=r>0?'<button class="ext-btn ext-btn-secondary" id="ext-retry-failed-btn" style="border-color:#fbbf24;color:#92400e;">Ulangi yang Gagal</button>':"";d.innerHTML=`<div style="display:flex;gap:8px;justify-content:flex-end;">${c}${o}</div>`,document.getElementById("ext-reload-btn")?.addEventListener("click",()=>window.location.reload()),r>0&&document.getElementById("ext-retry-failed-btn")?.addEventListener("click",()=>{p.forEach(u=>{u.status==="error"&&(u.status="pending",u.error=void 0)}),L(p),Z()})}w=!1}async function ee(){if(p.length===0){T({title:"Tidak ada URL",message:"Tidak ada URL untuk ditest.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(w)return;w=!0,R(!0);let e=p[0];b("Testing single upload...");let n=new URLSearchParams(window.location.search).get("id_visit")||"";try{let t=await A(e,n);t.success?(e.status="success",b("Test sukses! Detail di console.")):(e.status="error",e.error=t.error,b("Test gagal! Detail di console."))}catch(t){e.status="error",e.error=t.message,b("Test error! Detail di console.")}L(p),R(!1),w=!1}function te(){if(p.length===0){T({title:"Tidak ada URL",message:"Tidak ada URL untuk diproses.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let e=p.filter(a=>a.selected!==!1).length;if(e===0){T({title:"Tidak ada dokumen dipilih",message:"Centang dokumen yang ingin diupload.",variant:"warning",okLabel:"OK",hideCancel:!0});return}(async()=>await T({title:`Upload ${e} dokumen?`,message:"Proses ini tidak dapat dibatalkan.",variant:"warning",okLabel:"Ya, Upload"})&&Z())()}function fe(){return!!new URLSearchParams(window.location.search).get("id_visit")}async function xe(){let a=new URLSearchParams(window.location.search).get("id_visit");if(!a){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Parameter id_visit tidak ditemukan di URL."}}).catch(console.error);return}try{let n=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${a}&page=85&id_kunjungan=`,t=await fetch(n);if(!t.ok)throw new Error("Gagal memuat halaman dokumen pasien");let r=await t.text(),i=new DOMParser().parseFromString(r,"text/html").querySelectorAll("table.data-list.tabel tr"),l=[];for(let d=1;d<i.length;d++){let o=i[d],c=o.querySelector("td:nth-child(2) a");if(!c)continue;let u=c.getAttribute("href");if(!u?.includes("/assets/dokumen-pasien/"))continue;let m=u.startsWith("http")?u:`${window.location.origin}${u}`,f=o.cells[1]?.textContent?.trim()||"",h=o.cells[2]?.textContent?.trim()||"",v=o.cells[3]?.textContent?.trim()||"",x=o.cells[4]?.textContent?.trim()||"";l.push({url:m,filenameTabel:f,tglFile:v,tglUpload:x,keteranganTabel:h})}if(l.length===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:[]}}).catch(console.error);return}p=l.map(d=>{let o=M(d.url);return o.tglFileTabel=d.tglFile,o.tglUploadTabel=d.tglUpload,o.filename=d.filenameTabel||o.filename,o.keterangan=d.keteranganTabel||o.filename||"-",o.selected=!1,o}),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:p}}).catch(console.error)}catch(n){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:n.message}}).catch(console.error)}}async function be(){try{let a=new URLSearchParams(window.location.search).get("id_visit")||"";if(!a){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"ID Visit tidak ditemukan di URL"}}).catch(console.error);return}let n=0,t=0,r=p.filter(i=>i.selected!==!1),s=r.length;if(s===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Tidak ada dokumen yang dipilih."}}).catch(console.error);return}for(let i=0;i<s;i++){let l=r[i];l.status="uploading",J(i,s,n,t,p);try{let d=await A(l,a);d.success?(l.status="success",n++):(l.status="error",l.error=d.error,t++)}catch(d){l.status="error",l.error=d.message,t++}J(i+1,s,n,t,p)}}catch(e){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:e.message}}).catch(console.error)}}function J(e,a,n,t,r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:e/a*100,status:`Diproses: ${e}/${a} - Sukses: ${n}, Gagal: ${t}`,items:r,finished:e>=a}}).catch(console.error)}async function he(){if(p.length===0)return;let e=p[0],n=new URLSearchParams(window.location.search).get("id_visit")||"";e.status="uploading",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:50,status:`Testing single upload: ${e.filename}...`,items:p,finished:!1}}).catch(console.error);try{let t=await A(e,n);t.success?e.status="success":(e.status="error",e.error=t.error)}catch(t){e.status="error",e.error=t.message}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:100,status:e.status==="success"?"Test upload sukses!":"Test upload gagal!",items:p,finished:!0}}).catch(console.error)}function we(){if(document.getElementById("ext-batch-url-style"))return;let e=document.createElement("style");e.id="ext-batch-url-style",e.textContent=`
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
  `,document.head.appendChild(e),_()}function ye(){!I.currentConfig?.features?.batchUpload?.enabled||!I.ExtensionCore.isFeatureAllowed("batchUpload")||fe()&&(we(),chrome.runtime.sendMessage({type:"PAGE_CONTEXT",feature:"mKlaimDetail",data:{idVisit:new URLSearchParams(window.location.search).get("id_visit"),tanggalMasuk:H()}}).catch(console.error),!window.__extBatchUploadRegistered&&(window.__extBatchUploadRegistered=!0,chrome.runtime.onMessage.addListener((e,a,n)=>{if(e.type==="TAB_ACTION"){let{action:t,payload:r}=e;t==="BATCH_UPLOAD_ANALYZE"?(p=Q(r.inputText).map(i=>M(i)),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ANALYZE_RESULT",data:{items:p}}).catch(console.error)):t==="BATCH_UPLOAD_CRAWL"?xe():t==="BATCH_UPLOAD_UPDATE_ITEMS"?p=r.items:t==="BATCH_UPLOAD_PREVIEW"?O(r.url,r.filename).catch(()=>{window.open(r.url,"_blank")}):t==="BATCH_UPLOAD_START"?be():t==="BATCH_UPLOAD_TEST_SINGLE"&&he(),n({success:!0})}else e.type==="BATCH_UPLOAD_ACTION"&&n({success:!0});return!0})))}window.batchUploadShowModal=se;typeof I.featureModules<"u"&&I.featureModules!==null?I.featureModules.batchUpload={id:"batchUpload",name:"Upload Dokumen Ulang",description:"Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis",match:{regex:/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/},run:ye}:console.warn("[Batch Upload] featureModules not defined, module registration skipped");})();
