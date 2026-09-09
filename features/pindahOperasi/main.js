"use strict";var __morbis_feature=(()=>{var c="ext-batch-shared-style";function u(){if(document.getElementById(c))return;let e=document.createElement("style");e.id=c,e.textContent=`
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
  `,document.head.appendChild(e)}function d(e){return new Promise(t=>{u();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",o=document.createElement("div");o.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",o.innerHTML=`
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
      </div>`,o.querySelector("h3").textContent=e.title;let a=o.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((s,f)=>{f>0&&a.appendChild(document.createElement("br")),a.appendChild(document.createTextNode(s))});let i=s=>{o.remove(),document.removeEventListener("keydown",r),t(s)},r=s=>{s.key==="Escape"&&i(!1)};o.querySelector(".ext-modal-close").addEventListener("click",()=>i(!1)),o.addEventListener("click",s=>{s.target===o&&i(!1)}),o.querySelector("[data-ext-ok]").addEventListener("click",()=>i(!0));let l=o.querySelector("[data-ext-cancel]");l&&l.addEventListener("click",()=>i(!1)),document.addEventListener("keydown",r),document.body.appendChild(o)})}function b(){let e=document.querySelector("#form-data");if(!e){d({title:"Error",message:"Form #form-data tidak ditemukan",variant:"warning",okLabel:"OK",hideCancel:!0});return}let t=prompt("Masukkan ID Visit tujuan:");if(!t||!/^\d+$/.test(t))return;let n=prompt("Masukkan ID Kunjungan tujuan (opsional):")||"",o=new FormData(e),a=new URLSearchParams;for(let[r,l]of Array.from(o.entries()))r!=="id_pengajuan"&&a.append(r,l);a.set("id_visit",t),n&&a.set("id_kunjungan",n);let i=document.querySelector("#simpan-pindah");i&&(i.disabled=!0,i.value="Memproses..."),fetch("/admisi/pelaksanaan_pelayanan/control/pengajuan-operasi?opsi=simpan",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest"},body:a.toString()}).then(r=>r.json()).then(r=>{r.status==="200"||r.status===200?(d({title:"Berhasil",message:"Operasi dipindahkan ke Visit "+t,variant:"success",okLabel:"OK",hideCancel:!0}),location.reload()):d({title:"Gagal",message:r.message||"Respon tidak dikenal",variant:"danger",okLabel:"OK",hideCancel:!0})}).catch(r=>{d({title:"Error",message:r.message,variant:"danger",okLabel:"OK",hideCancel:!0})}).finally(()=>{i&&(i.disabled=!1,i.value="Pindahkan Operasi")})}async function p(){try{let t=(await chrome.storage.sync.get("extensionConfig")).extensionConfig;if(!t||t.extensionEnabled!==!0)return!1;let n=t.currentRole??"admin";return(t.features?.pindahOperasi?.allowedRoles??["admin"]).includes(n)}catch{return!1}}function x(){if(["/login","/auth","/signin","/masuk","/keluar","/logout"].some(o=>location.pathname.toLowerCase().includes(o))||document.querySelectorAll('input[type="password"]').length>0||document.getElementById("simpan-pindah"))return;let t=document.querySelector('#simpan, #save, input[type="submit"], button[type="submit"]');if(!t||!t.parentNode)return;let n=document.createElement("input");n.type="button",n.className="btn btn-warning",n.id="simpan-pindah",n.value="Pindahkan Operasi",n.onclick=b,t.parentNode.insertBefore(n,t.nextSibling),console.log("[PindahOperasi] Button added")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{p().then(e=>{e&&x()})}):p().then(e=>{e&&x()});})();
