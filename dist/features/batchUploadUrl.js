"use strict";var __morbis_feature=(()=>{function Y(){return window}var J="ext-batch-shared-style";function q(){if(document.getElementById(J))return;let e=document.createElement("style");e.id=J,e.textContent=`
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
  `,document.head.appendChild(e)}var v={search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',trash:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',xClose:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',eye:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',refresh:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',upload:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',arrowRight:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'};async function N(e,a){try{let n=await fetch(e,{method:"GET",mode:"cors",credentials:"omit"});if(!n.ok)throw new Error(`HTTP ${n.status}`);let t=await n.blob(),r=URL.createObjectURL(t);Q(r,a,e,()=>URL.revokeObjectURL(r))}catch{Q(e,a,e)}}var A=null;function Q(e,a,n,t){A&&A();let r=a.toLowerCase().split(".").pop()||"",s=r==="pdf",i=["jpg","jpeg","png","gif","webp"].includes(r),l=document.createElement("div");l.id="ext-inline-preview-modal",l.style.cssText="position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(15,23,42,0.88) !important;z-index:10001 !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-direction:column !important;padding:20px !important;box-sizing:border-box !important;backdrop-filter:blur(8px) !important;-webkit-backdrop-filter:blur(8px) !important;";let c='<div class="ext-inline-preview-loading" style="display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;color:#fff;"><div class="ext-inline-preview-spinner"></div><div style="font-size:14px;">Loading preview...</div></div>';s?c=`<iframe id="ext-inline-preview-iframe" src="${e}" style="width:100%;height:100%;border:none;display:block;border-radius:12px;"></iframe>`:i?c=`<img id="ext-inline-preview-img" src="${e}" alt="Image Preview" style="width:100%;height:100%;border:none;display:block;object-fit:contain;border-radius:12px;">`:c=`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:15px;color:#64748b;background:#f8fafc;flex-direction:column;gap:16px;border-radius:12px;">${v.file}<div>Preview not available for this format</div></div>`;let o=a.replace(/"/g,"&quot;").replace(/</g,"&lt;");l.innerHTML=`
    <div style="position:absolute;top:20px;right:20px;display:flex;gap:10px;align-items:center;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;backdrop-filter:blur(12px);z-index:10002;border:1px solid rgba(255,255,255,0.1);">
      <span style="color:#e2e8f0;font-size:13px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${o}</span>
      <button id="ext-preview-newtab" style="padding:7px 14px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.15s ease;display:inline-flex;align-items:center;gap:6px;">${v.arrowRight} Open Tab</button>
      <button id="ext-preview-close" style="padding:7px 12px;background:rgba(255,255,255,0.1);color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;font-size:16px;font-weight:500;transition:all 0.15s ease;line-height:1;">${v.xClose}</button>
    </div>
    <div style="width:clamp(400px,90vw,1200px);height:clamp(300px,90vh,800px);background:white;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.4);overflow:hidden;position:relative;">${c}</div>
  `,document.body.appendChild(l);let d=!1,u,p=x=>{x.key==="Escape"&&m()},m=()=>{d||(d=!0,A===m&&(A=null),t&&t(),document.removeEventListener("keydown",p),u!==void 0&&clearInterval(u),l.remove())};A=m,document.getElementById("ext-preview-close")?.addEventListener("click",m),document.getElementById("ext-preview-newtab")?.addEventListener("click",()=>{window.open(n||e,"_blank"),m()}),l.addEventListener("click",x=>{x.target===l&&m()}),document.addEventListener("keydown",p),(s||i)&&(u=window.setInterval(()=>{if(s?document.getElementById("ext-inline-preview-iframe")?.getAttribute("src"):document.getElementById("ext-inline-preview-img")?.complete){let f=l.querySelector(".ext-inline-preview-loading");f&&f.remove(),clearInterval(u)}},500))}function $(e){return new Promise(a=>{q();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",t=document.createElement("div");t.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",t.innerHTML=`
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
`).forEach((c,o)=>{o>0&&r.appendChild(document.createElement("br")),r.appendChild(document.createTextNode(c))});let s=c=>{t.remove(),document.removeEventListener("keydown",i),a(c)},i=c=>{c.key==="Escape"&&s(!1)};t.querySelector(".ext-modal-close").addEventListener("click",()=>s(!1)),t.addEventListener("click",c=>{c.target===t&&s(!1)}),t.querySelector("[data-ext-ok]").addEventListener("click",()=>s(!0));let l=t.querySelector("[data-ext-cancel]");l&&l.addEventListener("click",()=>s(!1)),document.addEventListener("keydown",i),document.body.appendChild(t)})}function se(e){let a=new Date,n=a.getTime(),t=Math.random().toString(36).substring(2,8);return`upload_${a.toISOString().slice(0,10).replace(/-/g,"")}_${n}_${t}${e}`}function X(e,a){return se(".pdf")}function j(e,a,n){let t=Math.max(1,Math.round(a)),r=Math.max(1,Math.round(n)),s=new TextEncoder,i=le(e),l=i?.components??3,c=l===1?"/DeviceGray":l===4?"/DeviceCMYK":"/DeviceRGB",o=i&&i.width>0?i.width:t,d=i&&i.height>0?i.height:r,u=de(e),p=ce(u,t,r),m=`1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
`,x=`2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
`,f=`3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${t} ${r}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>
endobj
`,w=`4 0 obj
<< /Type /XObject /Subtype /Image /Width ${o} /Height ${d} /ColorSpace ${c} /BitsPerComponent 8 /Filter /DCTDecode /Length ${e.length} >>
stream
`,L=`
endstream
endobj
`,y=`q
${p} cm
/Im0 Do
Q
`,R=`5 0 obj
<< /Length ${s.encode(y).length} >>
stream
${y}endstream
endobj
`,B=`%PDF-1.4
`,P=[],E=0,C=[],S=O=>{P.push(O),E+=O.length};S(s.encode(B)),C[0]=E,S(s.encode(m)),C[1]=E,S(s.encode(x)),C[2]=E,S(s.encode(f)),C[3]=E,S(s.encode(w)),S(e),S(s.encode(L)),C[4]=E,S(s.encode(R));let ie=E,z=`xref
0 6
0000000000 65535 f 
`;for(let O of C)z+=`${String(O).padStart(10,"0")} 00000 n 
`;return z+=`trailer
<< /Size 6 /Root 1 0 R >>
startxref
${ie}
%%EOF
`,S(s.encode(z)),new Blob(P,{type:"application/pdf"})}function le(e){let a=e.length,n=2;for(;n+4<a;){if(e[n]!==255){n++;continue}let t=n+1;for(;t<a&&e[t]===255;)t++;if(t>=a)break;let r=e[t],s=t+1;if(r===216||r===217||r===1)break;if(r>=208&&r<=215){n=s;continue}if(s+2>a)break;let i=e[s]<<8|e[s+1];if(i<2)break;if(r>=192&&r<=195||r>=197&&r<=199||r>=201&&r<=203||r>=205&&r<=207){let c=s+2;if(c+6>a)break;let o=e[c+1]<<8|e[c+2],d=e[c+3]<<8|e[c+4],u=e[c+5];return u>=1&&u<=4&&o>0&&d>0?{width:d,height:o,components:u}:null}n=s+i}return null}function de(e){let a=e.length,n=2;for(;n+4<a;){if(e[n]!==255){n++;continue}let t=n+1;for(;t<a&&e[t]===255;)t++;if(t>=a)break;let r=e[t],s=t+1;if(r===216||r===217||r===1)break;if(r>=208&&r<=215){n=s;continue}if(s+2>a)break;let i=e[s]<<8|e[s+1];if(i<2)break;if(r===225){let l=s+2,c=i-2;if(c>=12&&e[l]===69&&e[l+1]===120&&e[l+2]===105&&e[l+3]===102&&e[l+4]===0&&e[l+5]===0){let o=l+6,d=c-6;if(d>=8){let u=e[o]===73&&e[o+1]===73,p=e[o]===77&&e[o+1]===77;if(u||p){let m=f=>u?e[o+f]|e[o+f+1]<<8:e[o+f]<<8|e[o+f+1],x=f=>u?e[o+f]|e[o+f+1]<<8|e[o+f+2]<<16|e[o+f+3]<<24:e[o+f]<<24|e[o+f+1]<<16|e[o+f+2]<<8|e[o+f+3];if(m(2)===42){let f=x(4);if(f+2<=d){let w=m(f);for(let L=0;L<w;L++){let y=f+2+L*12;if(y+12>d)break;if(m(y)!==274)continue;let R=m(y+2),B=u?e[o+y+8]|e[o+y+9]<<8:e[o+y+8]<<8|e[o+y+9];return R===3&&B>=1&&B<=8?B:1}return 1}}}}}}n=s+i}return 1}function ce(e,a,n){switch(e){case 2:return`${-a} 0 0 ${n} ${a} 0`;case 3:return`${-a} 0 0 ${-n} ${a} ${n}`;case 4:return`${a} 0 0 ${-n} 0 ${n}`;case 5:return`0 ${-n} ${-a} 0 ${a} ${n}`;case 6:return`0 ${-n} ${a} 0 0 ${n}`;case 7:return`0 ${n} ${a} 0 0 0`;case 8:return`0 ${n} ${-a} 0 ${a} 0`;default:return`${a} 0 0 ${n} 0 0`}}function Z(e){return e.length>=5&&e[0]===37&&e[1]===80&&e[2]===68&&e[3]===70&&e[4]===45?"pdf":e.length>=3&&e[0]===255&&e[1]===216&&e[2]===255?"jpeg":e.length>=8&&e[0]===137&&e[1]===80&&e[2]===78&&e[3]===71?"png":e.length>=6&&e[0]===71&&e[1]===73&&e[2]===70&&e[3]===56?"gif":e.length>=12&&e[0]===82&&e[1]===73&&e[2]===70&&e[3]===70&&e[8]===87&&e[9]===69&&e[10]===66&&e[11]===80?"webp":"unknown"}var M=Y(),b={targetUrl:"/v2/m-klaim/detail-v2-refaktor",uploadEndpoint:"/v2/m-klaim/uploda-dokumen/control?sub=simpan",maxConcurrent:3,maxBatchSize:50,supportedExtensions:[".pdf",".jpg",".jpeg",".png",".gif"],modalId:"ext-batch-url-modal",textareaId:"ext-url-input",previewId:"ext-preview-list",progressId:"ext-progress-bar",statusId:"ext-status-text"};function ue(e){let a=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0");return`${a}-${n}-${t}`}function pe(){return ue(new Date)}function K(){let e=t=>{if(!t)return null;let r=String(t).trim(),s=r.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(s)return`${s[1]}-${s[2].padStart(2,"0")}-${s[3].padStart(2,"0")}`;let i=r.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(i)return`${i[3]}-${i[2].padStart(2,"0")}-${i[1].padStart(2,"0")}`;let l=r.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);return l?`${l[3]}-${l[2].padStart(2,"0")}-${l[1].padStart(2,"0")}`:null},a=["#tgl","#tanggal","#tanggal_masuk",'input[name="tanggal"]'];for(let t of a){let r=document.querySelector(t),s=e(r?.value);if(s)return s}let n=new URLSearchParams(window.location.search);for(let t of["tanggalAwal","tanggalAkhir","tanggal","tgl"]){let r=e(n.get(t));if(r)return r}return console.warn("[Batch Upload] Tanggal klaim tidak ditemukan (input #tgl & URL), pakai tanggal hari ini"),pe()}function T(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ge(e,a={},n=3e4){let t=new AbortController,r=setTimeout(()=>t.abort(),n),s=a.signal,i=()=>t.abort();return s&&(s.aborted?(clearTimeout(r),t.abort()):s.addEventListener("abort",i,{once:!0})),fetch(e,{...a,signal:t.signal}).finally(()=>{clearTimeout(r),s&&s.removeEventListener("abort",i)})}async function G(e,a={},n=2){let t=a.signal,r=null;for(let s=0;s<=n;s++){try{let i=t?{...a,signal:t}:a,l=await ge(e,i);if(l.ok||l.status>=400&&l.status<500&&l.status!==429)return l;r=new Error(`HTTP ${l.status}: ${l.statusText}`)}catch(i){if(r=i,i instanceof DOMException&&i.name==="AbortError"){if(t?.aborted)throw new Error("Batch cancelled");r=new Error("Request timeout")}}s<n&&!(r instanceof Error&&r.message==="Batch cancelled")&&(await new Promise(i=>setTimeout(i,1e3*(s+1))),console.log(`[Batch Upload] Retry ${s+1}/${n} for ${e}`))}throw r||new Error("Fetch failed after retries")}var g=[],k=!1,I=null;function H(){return I||(I=new AbortController),I.signal}function W(){I&&I.abort(),k=!1}function te(e){return!e||typeof e!="string"?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n.length>0).map(n=>n.replace(/ /g,"%20")).filter(n=>{try{new URL(n);let t=n.split(/[?#]/)[0].toLowerCase();return b.supportedExtensions.some(r=>t.endsWith(r))}catch{return!1}})}function D(e){try{let a=new URL(e),t=decodeURIComponent(a.pathname).split("/").pop()||"unknown",r=t.replace(/\.[^/.]+$/,""),s=r.split(/[-_\s]+/),i="",l=K(),c=s.filter(u=>{let p=/^\d+$/.test(u),m=u.length;return p&&m>=6&&m<=12&&m!==10&&m!==13});if(c.length>0)i=c[0];else{let u=a.searchParams.get("norm")||a.searchParams.get("no_rm");u&&/^\d{6,12}$/.test(u)&&(i=u)}let d=s.filter(u=>!/^\d{10}$/.test(u)&&u!==i).join(" ").trim()||r.replace(/[-_]+/g," ");return{filename:t,norm:i,tanggal:l,jenis_dokumen:"Lain-lain",keterangan:d,url:e,status:"pending"}}catch{return{filename:"error",norm:"",tanggal:K(),jenis_dokumen:"Lain-lain",keterangan:"URL tidak valid",url:e,status:"error",error:"Invalid URL format"}}}function fe(){let e=document.getElementById(b.modalId);e||(e=document.createElement("div"),e.id=b.modalId,e.className="ext-batch-delete-modal",e.innerHTML=`
      <div class="ext-modal-content">
        <div class="ext-modal-header">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.3px;">Upload Dokumen Ulang</h3>
          <button class="ext-modal-close" id="ext-modal-close-btn">${v.xClose}</button>
        </div>
        <div class="ext-mode-radio">
          <label><input type="radio" name="ext-upload-mode" value="manual" checked> Mode Manual (Paste URL)</label>
          <label><input type="radio" name="ext-upload-mode" value="auto"> Auto-Crawl Rekam Medis</label>
        </div>
        <div id="ext-manual-section">
          <label class="ext-input-label">Paste URL Dokumen (satu per baris):</label>
          <textarea id="${b.textareaId}" placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg&#10;..."></textarea>
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-analyze-btn">${v.search} Analisis URL</button>
          </div>
        </div>
        <div id="ext-auto-section" style="display: none;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.</p>
          <div style="margin-bottom: 12px; display: flex; gap: 10px;">
            <button class="ext-btn ext-btn-purple" id="ext-crawl-btn">${v.search} Cari Dokumen Pasien Otomatis</button>
          </div>
          <div id="ext-upload-search-wrap" class="ext-upload-search-wrap" style="display: none;">
            <input type="text" id="ext-upload-search-input" class="ext-search-input" placeholder="Cari dokumen...">
          </div>
        </div>
        <div id="${b.previewId}" style="display: none; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;"></div>
        <div id="${b.progressId}" style="display: none; height: 4px; background: #374151; margin: 12px 0; border-radius: 2px; overflow: hidden;">
          <div class="progress-fill"></div>
        </div>
        <div id="${b.statusId}" style="margin: 8px 0; font-size: 11px; color: #9ca3af; font-weight: 500; letter-spacing: 0.3px;"></div>
        <div class="ext-modal-buttons">
          <button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Tutup</button>
          <button class="ext-btn ext-btn-danger" id="ext-cancel-batch-btn" style="display:none;" title="Batalkan proses upload yang sedang berjalan">${v.xClose} Batalkan Upload</button>
          <button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button>
          <button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>${v.upload} Mulai Upload</button>
        </div>
      </div>
    `,setTimeout(()=>{document.getElementById("ext-modal-close-btn")?.addEventListener("click",()=>e?.classList.remove("show")),document.getElementById("ext-analyze-btn")?.addEventListener("click",me),document.getElementById("ext-cancel-btn")?.addEventListener("click",V),document.getElementById("ext-cancel-batch-btn")?.addEventListener("click",W),document.getElementById("ext-test-single-btn")?.addEventListener("click",ae),document.getElementById("ext-start-upload-btn")?.addEventListener("click",oe),document.querySelectorAll('input[name="ext-upload-mode"]').forEach(n=>{n.addEventListener("change",t=>{let r=t.target,s=document.getElementById("ext-manual-section"),i=document.getElementById("ext-auto-section");r.value==="manual"?(s&&(s.style.display="block"),i&&(i.style.display="none")):(s&&(s.style.display="none"),i&&(i.style.display="block")),g=[],U([]),h("")})}),document.getElementById("ext-crawl-btn")?.addEventListener("click",xe),document.getElementById("ext-upload-search-input")?.addEventListener("input",()=>U(g)),e?.addEventListener("click",function(n){n.target===e&&V()})},0),document.body.appendChild(e)),document.querySelectorAll(".ext-batch-delete-modal.show").forEach(n=>{n!==e&&n.classList.remove("show")}),e.classList.add("show"),document.getElementById(b.textareaId)?.focus()}function V(){W();let e=document.getElementById(b.modalId);if(e){e.classList.remove("show"),g=[],k=!1,U([]),ne(0),h("");let a=document.getElementById("ext-upload-search-input");a&&(a.value="");let n=document.getElementById("ext-upload-search-wrap");n&&(n.style.display="none");let t=document.querySelector("#"+b.modalId+" .ext-modal-buttons");t&&(t.innerHTML='<button class="ext-btn ext-btn-secondary" id="ext-cancel-btn">Tutup</button><button class="ext-btn ext-btn-danger" id="ext-cancel-batch-btn" style="display:none;" title="Batalkan proses upload yang sedang berjalan">'+v.xClose+' Batalkan Upload</button><button id="ext-test-single-btn" class="ext-btn ext-btn-secondary" style="background: #fef3c7; color: #92400e; border-color: #fde68a;">Test 1 URL</button><button id="ext-start-upload-btn" class="ext-btn ext-btn-primary" disabled>'+v.upload+" Mulai Upload</button>",document.getElementById("ext-cancel-btn")?.addEventListener("click",V),document.getElementById("ext-cancel-batch-btn")?.addEventListener("click",W),document.getElementById("ext-test-single-btn")?.addEventListener("click",ae),document.getElementById("ext-start-upload-btn")?.addEventListener("click",oe))}}function U(e){let a=document.getElementById(b.previewId),n=document.getElementById("ext-start-upload-btn"),t=document.getElementById("ext-upload-search-wrap"),r=document.getElementById("ext-upload-search-input"),s=document.getElementById("ext-auto-section")?.style.display!=="none",i=(r?.value||"").toLowerCase();if(!e||e.length===0){a&&(a.style.display="none"),n&&(n.disabled=!0),t&&(t.style.display="none"),r&&(r.value="");return}t&&s&&(t.style.display="block");let l=e.map((o,d)=>({item:o,i:d})).filter(({item:o})=>!i||o.filename.toLowerCase().includes(i)||o.keterangan.toLowerCase().includes(i)||o.norm.toLowerCase().includes(i));a&&(a.style.display="block");let c=document.createElement("div");if(c.style.marginBottom="10px",c.innerHTML=`<strong class="preview-header-text">Preview (${l.length} dari ${e.length} dokumen, ${e.filter(o=>o.selected!==!1).length} dipilih):</strong>`,a&&(a.innerHTML="",a.appendChild(c)),l.length===0){let o=document.createElement("div");o.style.cssText="padding:24px;text-align:center;font-size:13px;color:#9ca3af;",o.textContent="Tidak ada dokumen yang cocok dengan pencarian.",a?.appendChild(o)}l.forEach(({item:o,i:d})=>{let u="";o.tglFileTabel?u=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>Dibuat: <strong style="color:#111827;">${T(o.tglFileTabel||"")}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Diunggah: <strong style="color:#111827;">${T(o.tglUploadTabel||"")}</strong></span>
      </div>`:u=`<div style="font-size:11px;color:#4b5563;margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
        <span>NORM: <strong style="color:#111827;">${T(o.norm||"-")}</strong></span>
        <span style="color:#d1d5db;">|</span>
        <span>Tgl Klaim: <strong style="color:#111827;">${T(o.tanggal)}</strong></span>
      </div>`;let p=(o.filename.split(".").pop()||"").toLowerCase(),x={pdf:"bg-red-100 text-red-700",jpg:"bg-blue-100 text-blue-700",jpeg:"bg-blue-100 text-blue-700",png:"bg-green-100 text-green-700"}[p]||"bg-gray-100 text-gray-700",f=p?`<span class="${x}" style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;text-transform:uppercase;margin-left:6px;">${p}</span>`:"",w=document.createElement("div");w.className="ext-delete-preview-item",o.selected&&w.classList.add("selected"),w.innerHTML=`
      <label class="ext-checkbox-label" style="flex:1;min-width:0;">
        <input type="checkbox" class="ext-checkbox" data-index="${d}" ${o.selected!==!1?"checked":""} ${k?"disabled":""}>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <strong style="font-size: 13px; color: #000000; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${d+1}. ${T(o.filename)}${f}</strong>
            ${o.status!=="pending"?`<span class="ext-status-badge" data-status="${o.status==="success"?"success":o.status==="error"?"error":"deleting"}">${o.status==="success"?"Sukses":o.status==="error"?"Gagal":"Memproses"}</span>`:""}
          </div>
          ${u}
          <input type="text" class="ext-keterangan-input" data-index="${d}" value="${T(o.keterangan||"")}" placeholder="Keterangan dokumen..." ${k?"disabled":""}>
          ${o.error?`<div style="font-size: 11px; color: #dc2626; margin-top: 4px;"><strong>Error:</strong> ${T(o.error)}</div>`:""}
        </div>
      </label>
      <button data-index="${d}" class="ext-delete-preview-btn" ${k?"disabled":""}>${v.eye} Preview</button>
      <button data-index="${d}" class="ext-delete-single-btn" title="Buang dari Antrian" ${k?"disabled":""}>${v.xClose}</button>
    `;let L=w.querySelector(".ext-checkbox"),y=w.querySelector(".ext-delete-preview-btn"),R=w.querySelector(".ext-delete-single-btn"),B=E=>{if(k)return;o.selected=E,L&&(L.checked=E),E?w.classList.add("selected"):w.classList.remove("selected");let C=e.filter(S=>S.selected!==!1).length;c.innerHTML=`<strong class="preview-header-text">Preview (${C} Dokumen Dipilih):</strong>`,n&&(n.disabled=C===0)};L?.addEventListener("change",E=>B(E.target.checked)),R?.addEventListener("click",()=>B(!1));let P=w.querySelector(".ext-keterangan-input");P?.addEventListener("input",function(){g[d].keterangan=P.value}),y&&(y.addEventListener("click",async()=>{try{await N(g[d].url,g[d].filename)}catch{window.open(g[d].url,"_blank")}}),k&&(y.disabled=!0)),a?.appendChild(w)}),n&&(n.disabled=e.filter(o=>o.selected!==!1).length===0)}function ne(e){let a=document.getElementById(b.progressId);if(!a)return;let n=a.querySelector(".progress-fill");e>0?(a.style.display="block",n&&(n.style.width=`${e}%`)):a.style.display="none"}function h(e){let a=document.getElementById(b.statusId);a&&(a.textContent=e)}function _(e){let a=["ext-analyze-btn","ext-cancel-btn","ext-test-single-btn","ext-start-upload-btn","ext-modal-close-btn","ext-crawl-btn",b.textareaId];document.querySelectorAll('input[name="ext-upload-mode"]').forEach(t=>{t.disabled=e});let n=document.getElementById("ext-cancel-batch-btn");n&&(n.style.display=e?"inline-flex":"none"),a.forEach(t=>{let r=document.getElementById(t);r&&(r.disabled=e,(t==="ext-modal-close-btn"||t===b.textareaId)&&(r.style.opacity=e?"0.5":"1",r.style.cursor=e?"not-allowed":t===b.textareaId?"text":"pointer"))})}function me(){let a=document.getElementById(b.textareaId)?.value.trim()||"";if(!a){$({title:"Tidak ada URL",message:"Silakan paste URL terlebih dahulu.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let n=te(a);if(n.length===0){$({title:"Tidak ada URL valid",message:"Pastikan URL mengandung ekstensi file yang didukung.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(n.length>b.maxBatchSize){$({title:"Terlalu banyak URL",message:`Maksimal ${b.maxBatchSize} URL per batch.`,variant:"warning",okLabel:"OK",hideCancel:!0});return}g=n.map(t=>D(t)),U(g),h(`${n.length} URL siap diproses`)}async function xe(){let a=new URLSearchParams(window.location.search).get("id_visit");if(!a){$({title:"Parameter id_visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0});return}h("Sedang mencari dokumen di rekam medis...");let n=document.getElementById("ext-crawl-btn");n&&(n.disabled=!0,n.textContent="Mencari...");try{let t=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${a}&id_kunjungan=`,r=await fetch(t,{signal:H()});if(!r.ok)throw new Error("Gagal memuat halaman dokumen pasien");let s=await r.text(),i=new DOMParser().parseFromString(s,"text/html"),l=i.querySelectorAll("table.data-list.tabel tr");l.length<=1&&(l=i.querySelectorAll("table.tabel tr")),l.length<=1&&(l=i.querySelectorAll('table[id*="dokumen"] tr, table[class*="dokumen"] tr')),l.length<=1&&(l=i.querySelectorAll("tbody tr"));let c=[];for(let o=1;o<l.length;o++){let d=l[o],u=d.querySelector('td a[href*="/assets/dokumen-pasien/"]');if(u||(u=d.querySelector('td a[href*="dokumen-pasien"]')),u||(u=d.querySelector("a[href]")),!u)continue;let p=u.getAttribute("href");if(!p?.includes("/assets/dokumen-pasien/"))continue;let m=p.startsWith("http")?p:`${window.location.origin}${p}`,x=Array.from(d.querySelectorAll("td")),f=x[1]?.textContent?.trim()||x[0]?.textContent?.trim()||"",w=x[2]?.textContent?.trim()||x[1]?.textContent?.trim()||"",L=x[3]?.textContent?.trim()||x[2]?.textContent?.trim()||"",y=x[4]?.textContent?.trim()||x[3]?.textContent?.trim()||"";c.push({url:m,filenameTabel:f,tglFile:L,tglUpload:y,keteranganTabel:w})}if(c.length===0){h("Tidak ada dokumen ditemukan di rekam medis."),n&&(n.disabled=!1,n.textContent="Cari Dokumen Pasien Otomatis");return}g=c.map(o=>{let d=D(o.url);return d.tglFileTabel=o.tglFile,d.tglUploadTabel=o.tglUpload,d.filename=o.filenameTabel||d.filename,d.keterangan=o.keteranganTabel||d.filename||"-",d.selected=!1,d}),U(g),h(`${g.length} dokumen berhasil ditemukan!`)}catch(t){h("Error: "+t.message)}finally{n&&(n.disabled=!1,n.textContent="Cari Dokumen Pasien Otomatis")}}async function be(e,a){h(`Mengunduh: ${T(a)}...`),console.log("[Batch Upload] Fetching URL:",e);let n,t=H();try{n=await G(e,{method:"GET",credentials:"same-origin",signal:t},2)}catch{n=await G(e,{method:"GET",mode:"cors",credentials:"omit",signal:t},1)}if(!n.ok){let c=await n.text().catch(()=>"");throw new Error(`HTTP ${n.status} \u2014 ${n.statusText||c.slice(0,120)}`)}let r=await n.blob();if(r.size===0)throw new Error("File kosong (0 bytes) dari server");let s=await r.slice(0,512).text().catch(()=>"");if(/^\s*<!doctype html|<html[\s>]/i.test(s))throw new Error("Server mengembalikan halaman HTML (sesi login kadaluarsa?) \u2014 bukan file dokumen");let i=a.includes(".")?"."+a.split(".").pop():"",l=a.replace(/[<>:"/\\|?*]/g,"_");return new File([r],l,{type:r.type||`application/${i.slice(1)||"octet-stream"}`})}async function he(e){if(typeof createImageBitmap=="function"){let a=await createImageBitmap(e);try{return{width:a.width,height:a.height}}finally{a.close?.()}}return new Promise((a,n)=>{let t=new Image,r=URL.createObjectURL(e);t.onload=()=>{URL.revokeObjectURL(r),a({width:t.naturalWidth,height:t.naturalHeight})},t.onerror=()=>{URL.revokeObjectURL(r),n(new Error("Tidak bisa membaca dimensi gambar"))},t.src=r})}async function we(e){let a=document.createElement("canvas"),n=URL.createObjectURL(e);try{let t=await new Promise((c,o)=>{let d=new Image;d.onload=()=>c(d),d.onerror=()=>o(new Error("Gagal memuat gambar untuk konversi ke PDF")),d.src=n}),r=Math.max(1,t.naturalWidth),s=Math.max(1,t.naturalHeight);a.width=r,a.height=s;let i=a.getContext("2d");if(!i)throw new Error("Canvas 2D tidak tersedia");i.fillStyle="#ffffff",i.fillRect(0,0,r,s),i.drawImage(t,0,0);let l=await new Promise(c=>a.toBlob(c,"image/jpeg",.92));if(!l)throw new Error("Gagal rasterisasi gambar ke JPEG");return{bytes:new Uint8Array(await l.arrayBuffer()),width:r,height:s}}finally{URL.revokeObjectURL(n)}}async function ye(e){let a=new Uint8Array(await e.slice(0,16).arrayBuffer()),n=Z(a),t=e.name.replace(/\.[a-z0-9]+$/i,".pdf");if(n==="pdf")return new File([e],t,{type:"application/pdf"});if(n==="jpeg"){let r=new Uint8Array(await e.arrayBuffer()),{width:s,height:i}=await he(e);return new File([j(r,s,i)],t,{type:"application/pdf"})}if(n==="png"||n==="gif"||n==="webp"){let{bytes:r,width:s,height:i}=await we(e);return new File([j(r,s,i)],t,{type:"application/pdf"})}throw new Error(`File bukan PDF/gambar yang bisa dikonversi (${e.type||"tipe tidak diketahui"}) \u2014 upload dibatalkan`)}function ke(){let e=new Date,a=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0"),r=String(e.getHours()).padStart(2,"0"),s=String(e.getMinutes()).padStart(2,"0"),i=String(e.getSeconds()).padStart(2,"0");return`${a}-${n}-${t} ${r}:${s}:${i}`}async function F(e,a){try{let n=X(e,e.keterangan);h(`Download: ${T(e.filename)}...`);let t=await be(e.url,n);h(`Konversi ke PDF: ${T(e.filename)}...`),t=await ye(t);let r=new FormData;r.append("id_visit",a),r.append("norm",e.norm),r.append("tgl_file",e.tanggal),r.append("jenis_dokumen",e.jenis_dokumen||"Lain-lain"),r.append("dok",t);let s=ke();r.append("keterangan",s),h(`Upload: ${T(t.name)} (${(t.size/1024).toFixed(0)} KB)...`);let i=await G(b.uploadEndpoint,{method:"POST",body:r,credentials:"same-origin",signal:H()},2);if(!i.ok){if(i.redirected)throw new Error("Sesi login kadaluarsa \u2014 login ulang di tab ini lalu coba lagi");let d=await i.text().catch(()=>""),u=d.replace(/<[^>]+>/g,"").trim().slice(0,200),p=d.match(/"message"\s*:\s*"([^"]+)"/),m=p?`Server ${i.status}: ${p[1]}`:`Server ${i.status}: ${u||i.statusText}`;throw new Error(m)}let l=await i.text(),c=i.headers.get("content-type")||"";if(/application\/json/i.test(c))try{let d=JSON.parse(l);return d.success===!1||d.status==="error"||d.error?{success:!1,error:d.message||d.error||"Server rejected"}:{success:!0,result:l}}catch{return{success:!0,result:l}}if(/text\/html/i.test(c))return/class="[^"]*alert-danger[^"]*"/i.test(l)||/<div[^>]*class="[^"]*error[^"]*"[^>]*>[\s\S]{0,200}<\/div>/i.test(l)||/"success"\s*:\s*false/i.test(l)?{success:!1,error:`Server error: ${l.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,200)}`}:{success:!0,result:l};let o=l.trim();return/^(error|gagal)/i.test(o)?{success:!1,error:`Server: ${o.slice(0,200)}`}:{success:!0,result:l}}catch(n){let t=n.message;if(t==="Batch cancelled")throw n;let r=t;return t.includes("Failed to fetch")||t.includes("NetworkError")?r="Network error \u2014 cek koneksi atau CORS":t.includes("timeout")||t.includes("AbortError")?r="Timeout \u2014 server tidak merespon dalam 30 detik":t.includes("0 bytes")&&(r="File kosong dari server"),{success:!1,error:r}}}async function re(){if(k)return;I=new AbortController,k=!0,_(!0);let e=document.getElementById("ext-start-upload-btn");e&&(e.textContent="Memproses...");let n=new URLSearchParams(window.location.search).get("id_visit")||"";if(!n){$({title:"ID Visit tidak ditemukan",message:"Pastikan buka dari halaman detail pasien.",variant:"warning",okLabel:"OK",hideCancel:!0}),_(!1),k=!1,e&&(e.textContent="Mulai Upload");return}let t=0,r=0,s=!1,i=g.filter(d=>d.selected!==!1),l=i.length;if(l===0){$({title:"Tidak ada dokumen dipilih",message:"Tidak ada dokumen yang dipilih untuk diupload.",variant:"warning",okLabel:"OK",hideCancel:!0}),_(!1),k=!1,h(""),e&&(e.textContent="Mulai Upload");return}for(let d=0;d<l;d++){if(H().aborted){s=!0,h("Batch dibatalkan oleh user");break}let u=new URLSearchParams(window.location.search).get("id_visit")||"";if(!u){h("ID Visit hilang dari URL \u2014 batch dihentikan");break}u!==n&&console.warn("[Batch Upload] ID Visit berubah mid-batch:",n,"->",u);let p=i[d];h(`[${d+1}/${l}] ${T(p.filename)}...`);try{let x=new URLSearchParams(window.location.search).get("id_visit")||n,f=await F(p,x);f.success?(p.status="success",t++):(p.status="error",p.error=f.error,r++)}catch(x){if(x instanceof Error&&x.message==="Batch cancelled"){s=!0,h("Batch dibatalkan");break}p.status="error",p.error=x.message,r++}let m=(d+1)/l*100;ne(m),U(g)}let c=s?["Batch dibatalkan:",`${t} sukses`]:[`Selesai ${l} dokumen:`,`${t} sukses`];r>0&&c.push(`${r} gagal`),h(c.join(" ")),r>0&&console.warn("[Batch Upload] Failed:",g.filter(d=>d.status==="error").map(d=>`${d.filename}: ${d.error}`));let o=document.querySelector("#"+b.modalId+" .ext-modal-buttons");if(o){let d=`<button class="ext-btn ext-btn-purple" id="ext-reload-btn"><span style="display:inline-flex;align-items:center;gap:7px;">${v.refresh} Reload Halaman</span></button>`,u=r>0?'<button class="ext-btn ext-btn-secondary" id="ext-retry-failed-btn" style="border-color:#fbbf24;color:#92400e;">Ulangi yang Gagal</button>':"";o.innerHTML=`<div style="display:flex;gap:8px;justify-content:flex-end;">${u}${d}</div>`,document.getElementById("ext-reload-btn")?.addEventListener("click",()=>window.location.reload()),r>0&&document.getElementById("ext-retry-failed-btn")?.addEventListener("click",()=>{g.forEach(p=>{p.status==="error"&&(p.status="pending",p.error=void 0)}),U(g),re()})}k=!1}async function ae(){if(g.length===0){$({title:"Tidak ada URL",message:"Tidak ada URL untuk ditest.",variant:"warning",okLabel:"OK",hideCancel:!0});return}if(k)return;k=!0,_(!0);let e=g[0];h("Testing single upload...");let n=new URLSearchParams(window.location.search).get("id_visit")||"";try{let t=await F(e,n);t.success?(e.status="success",h("Test sukses! Detail di console.")):(e.status="error",e.error=t.error,h("Test gagal! Detail di console."))}catch(t){e.status="error",e.error=t.message,h("Test error! Detail di console.")}U(g),_(!1),k=!1}function oe(){if(g.length===0){$({title:"Tidak ada URL",message:"Tidak ada URL untuk diproses.",variant:"warning",okLabel:"OK",hideCancel:!0});return}let e=g.filter(a=>a.selected!==!1).length;if(e===0){$({title:"Tidak ada dokumen dipilih",message:"Centang dokumen yang ingin diupload.",variant:"warning",okLabel:"OK",hideCancel:!0});return}(async()=>await $({title:`Upload ${e} dokumen?`,message:"Proses ini tidak dapat dibatalkan.",variant:"warning",okLabel:"Ya, Upload"})&&re())()}function ve(){return!!new URLSearchParams(window.location.search).get("id_visit")}async function Ee(){let a=new URLSearchParams(window.location.search).get("id_visit");if(!a){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Parameter id_visit tidak ditemukan di URL."}}).catch(console.error);return}try{let n=`${window.location.origin}/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=${a}&page=85&id_kunjungan=`,t=await fetch(n);if(!t.ok)throw new Error("Gagal memuat halaman dokumen pasien");let r=await t.text(),i=new DOMParser().parseFromString(r,"text/html").querySelectorAll("table.data-list.tabel tr"),l=[];for(let c=1;c<i.length;c++){let o=i[c],d=o.querySelector("td:nth-child(2) a");if(!d)continue;let u=d.getAttribute("href");if(!u?.includes("/assets/dokumen-pasien/"))continue;let p=u.startsWith("http")?u:`${window.location.origin}${u}`,m=o.cells[1]?.textContent?.trim()||"",x=o.cells[2]?.textContent?.trim()||"",f=o.cells[3]?.textContent?.trim()||"",w=o.cells[4]?.textContent?.trim()||"";l.push({url:p,filenameTabel:m,tglFile:f,tglUpload:w,keteranganTabel:x})}if(l.length===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:[]}}).catch(console.error);return}g=l.map(c=>{let o=D(c.url);return o.tglFileTabel=c.tglFile,o.tglUploadTabel=c.tglUpload,o.filename=c.filenameTabel||o.filename,o.keterangan=c.keteranganTabel||o.filename||"-",o.selected=!1,o}),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_CRAWL_RESULT",data:{items:g}}).catch(console.error)}catch(n){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:n.message}}).catch(console.error)}}async function Te(){I=new AbortController;try{let a=new URLSearchParams(window.location.search).get("id_visit")||"";if(!a){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"ID Visit tidak ditemukan di URL"}}).catch(console.error);return}let n=0,t=0,r=g.filter(i=>i.selected!==!1),s=r.length;if(s===0){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:"Tidak ada dokumen yang dipilih."}}).catch(console.error);return}for(let i=0;i<s;i++){let l=r[i];l.status="uploading",ee(i,s,n,t,g);try{let c=await F(l,a);c.success?(l.status="success",n++):(l.status="error",l.error=c.error,t++)}catch(c){l.status="error",l.error=c.message,t++}ee(i+1,s,n,t,g)}}catch(e){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ERROR",data:{error:e.message}}).catch(console.error)}}function ee(e,a,n,t,r){chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:e/a*100,status:`Diproses: ${e}/${a} - Sukses: ${n}, Gagal: ${t}`,items:r,finished:e>=a}}).catch(console.error)}async function Le(){if(g.length===0)return;let e=g[0],n=new URLSearchParams(window.location.search).get("id_visit")||"";e.status="uploading",chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:50,status:`Testing single upload: ${e.filename}...`,items:g,finished:!1}}).catch(console.error);try{let t=await F(e,n);t.success?e.status="success":(e.status="error",e.error=t.error)}catch(t){e.status="error",e.error=t.message}chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_PROGRESS",data:{percent:100,status:e.status==="success"?"Test upload sukses!":"Test upload gagal!",items:g,finished:!0}}).catch(console.error)}function Se(){if(document.getElementById("ext-batch-url-style"))return;let e=document.createElement("style");e.id="ext-batch-url-style",e.textContent=`
    #${b.textareaId} {
      width:100%;height:150px;padding:12px;border:1px solid #e2e8f0;
      border-radius:10px;font-size:12px;resize:vertical;
      background:#f8fafc;color:#1e293b;
      transition:border-color .15s ease;box-sizing:border-box;
    }
    #${b.textareaId}:focus {
      border-color:#94a3b8;box-shadow:0 0 0 3px rgba(148,163,184,.1);
      background:#fff;outline:none;
    }
    #${b.previewId} {
      margin-top:15px;max-height:none;overflow-y:visible;
      border:1px solid #f1f5f9;border-radius:10px;padding:12px;
    }
    #${b.progressId} .progress-fill {
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
  `,document.head.appendChild(e),q()}function $e(){!M.currentConfig?.features?.batchUpload?.enabled||!M.ExtensionCore.isFeatureAllowed("batchUpload")||ve()&&(Se(),chrome.runtime.sendMessage({type:"PAGE_CONTEXT",feature:"mKlaimDetail",data:{idVisit:new URLSearchParams(window.location.search).get("id_visit"),tanggalMasuk:K()}}).catch(console.error),!window.__extBatchUploadRegistered&&(window.__extBatchUploadRegistered=!0,chrome.runtime.onMessage.addListener((e,a,n)=>{if(e.type==="TAB_ACTION"){let{action:t,payload:r}=e;t==="BATCH_UPLOAD_ANALYZE"?(g=te(r.inputText).map(i=>D(i)),chrome.runtime.sendMessage({type:"TAB_ACTION_RESULT",action:"BATCH_UPLOAD_ANALYZE_RESULT",data:{items:g}}).catch(console.error)):t==="BATCH_UPLOAD_CRAWL"?Ee():t==="BATCH_UPLOAD_UPDATE_ITEMS"?g=r.items:t==="BATCH_UPLOAD_PREVIEW"?N(r.url,r.filename).catch(()=>{window.open(r.url,"_blank")}):t==="BATCH_UPLOAD_START"?Te():t==="BATCH_UPLOAD_TEST_SINGLE"&&Le(),n({success:!0})}else e.type==="BATCH_UPLOAD_ACTION"&&n({success:!0});return!0})))}window.batchUploadShowModal=fe;typeof M.featureModules<"u"&&M.featureModules!==null?M.featureModules.batchUpload={id:"batchUpload",name:"Upload Dokumen Ulang",description:"Upload Dokumen Ulang via paste URL dengan metadata extraction otomatis",match:{regex:/^\/v2\/m-klaim\/detail-v2-refaktor\/?$/},run:$e}:console.warn("[Batch Upload] featureModules not defined, module registration skipped");})();
