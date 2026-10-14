"use strict";var __morbis_feature=(()=>{var C=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var X=Object.getOwnPropertyNames;var Y=Object.prototype.hasOwnProperty;var Z=(e,t)=>{for(var n in t)C(e,n,{get:t[n],enumerable:!0})},ee=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of X(t))!Y.call(e,o)&&o!==n&&C(e,o,{get:()=>t[o],enumerable:!(r=W(t,o))||r.enumerable});return e};var te=e=>ee(C({},"__esModule",{value:!0}),e);var he={};Z(he,{applySelectAll:()=>R,clearSelection:()=>w,getSelected:()=>F,initMKlaimBulkVerifFeature:()=>Q,isEligible:()=>U,parseIdVisit:()=>ne,pruneSelection:()=>K});function A(){return window}var P="ext-batch-shared-style";function I(){if(document.getElementById(P))return;let e=document.createElement("style");e.id=P,e.textContent=`
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
  `,document.head.appendChild(e)}function q(e,t,n=2){let r=o=>fetch(e,t).catch(i=>{if(o<=0)throw i;return new Promise(a=>setTimeout(a,1e3*(3-o))).then(()=>r(o-1))});return r(n)}function y(e){return new Promise(t=>{I();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",r=document.createElement("div");r.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",r.innerHTML=`
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
      </div>`,r.querySelector("h3").textContent=e.title;let o=r.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((d,p)=>{p>0&&o.appendChild(document.createElement("br")),o.appendChild(document.createTextNode(d))});let i=d=>{r.remove(),document.removeEventListener("keydown",a),t(d)},a=d=>{d.key==="Escape"&&i(!1)};r.querySelector(".ext-modal-close").addEventListener("click",()=>i(!1)),r.addEventListener("click",d=>{d.target===r&&i(!1)}),r.querySelector("[data-ext-ok]").addEventListener("click",()=>i(!0));let l=r.querySelector("[data-ext-cancel]");l&&l.addEventListener("click",()=>i(!1)),document.addEventListener("keydown",a),document.body.appendChild(r)})}var z=A(),s={endpointVerif:"/v2/m-klaim/control/verif",endpointBatal:"/v2/m-klaim/control/batal-verif",delayMs:600,barId:"ext-bulk-verif-bar",cssId:"ext-bulk-verif-style",readyTimeoutMs:15e3,readyPollMs:250,warnIfMoreThan:100,UJI_SAJA:!1},g=[{sel:"#data-table",kind:"main",nama:"Klaim",aksi:"Verif",endpoint:s.endpointVerif,danger:!1},{sel:"#data-table-verif",kind:"verif",nama:"Sudah Terverifikasi",aksi:"Batal Verif",endpoint:s.endpointBatal,danger:!0}],b={main:new Set,verif:new Set},f=!1;function R(e,t,n){let r=0;return t.forEach(o=>{!o.id||!o.eligible||(n?b[e].add(o.id):b[e].delete(o.id),r+=1)}),r}function K(e,t){let n=new Set;t.forEach(o=>{o.id&&o.eligible&&n.add(o.id)});let r=0;return Array.from(b[e]).forEach(o=>{n.has(o)||(b[e].delete(o),r+=1)}),r}function F(e){return Array.from(b[e])}function w(e){b[e].clear()}function ne(e){let t=e.match(/\d+/);return t?t[0]:null}function U(e,t,n){return t?e==="main"?!0:n:!1}function re(){if(document.getElementById(s.cssId))return;let e=document.createElement("style");e.id=s.cssId,e.textContent=`
    #${s.barId} {
      position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
      z-index: 2147482000; display: none; align-items: center; gap: 14px;
      background: #0f172a; color: #f8fafc; border-radius: 12px;
      padding: 10px 16px; font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; box-shadow: 0 8px 28px rgba(15,23,42,.35);
    }
    #${s.barId} .bv-item { display: flex; align-items: center; gap: 8px; }
    #${s.barId} .bv-label { color: #cbd5e1; }
    #${s.barId} .bv-count { color: #f8fafc; font-weight: 700; }
    #${s.barId} button {
      border: none; border-radius: 8px; cursor: pointer; padding: 7px 14px;
      font-size: 12.5px; font-weight: 700; font-family: inherit;
    }
    #${s.barId} .bv-aksi { background: #2563eb; color: #fff; }
    #${s.barId} .bv-aksi:hover { background: #1d4ed8; }
    #${s.barId} .bv-aksi-danger { background: #dc2626; color: #fff; }
    #${s.barId} .bv-aksi-danger:hover { background: #b91c1c; }
    #${s.barId} .bv-reset { background: #334155; color: #e2e8f0; }
    #${s.barId} .bv-reset:hover { background: #475569; }
    #${s.barId} button:disabled { opacity: .55; cursor: not-allowed; }

    /* Status + progress saat proses massal berjalan */
    #${s.barId} .bv-status { color: #f8fafc; font-weight: 700; min-width: 150px; }
    #${s.barId} .bv-progress {
      position: relative; width: 220px; height: 9px; border-radius: 999px;
      background: #1e293b; overflow: hidden; flex: 0 0 auto;
    }
    #${s.barId} .bv-progress > i {
      position: absolute; top: 0; left: 0; bottom: 0; width: 0%;
      border-radius: 999px; background: linear-gradient(90deg, #2563eb, #38bdf8);
      transition: width .25s ease;
    }
    #${s.barId} .bv-progress.done > i {
      background: linear-gradient(90deg, #16a34a, #4ade80);
    }

    .bv-check {
      display: inline-flex; align-items: center; justify-content: center;
      margin-right: 6px; vertical-align: middle; cursor: pointer;
    }
    /* Kolom khusus checkbox: <th> sendiri di posisi 0 + <td> sejajar di tiap
       baris. <th> HANYA ditambahkan setelah DataTables aktif (lihat
       renderHeaderCheckbox) supaya jumlah kolom yang dibaca saat init tetap
       16 dan pemetaan data ajax tidak bergeser. */
    th.bv-sel-th {
      width: 30px; min-width: 30px; text-align: center; vertical-align: middle;
      padding: 4px 2px !important; border-right: 1px solid #e2e8f0;
      background: #f8fafc;
      /* Kolom terkunci (freeze pane): tetap terlihat saat tabel digeser
         horizontal (kontainer scroll: .main overflow-x auto di halaman). */
      position: -webkit-sticky; position: sticky; left: 0; z-index: 11;
      box-shadow: 2px 0 3px rgba(15, 23, 42, .10);
    }
    th.bv-sel-th input { width: 15px; height: 15px; cursor: pointer; margin: 0; }
    th.bv-sel-th input:disabled { cursor: not-allowed; }
    td.bv-sel {
      width: 30px; text-align: center; vertical-align: middle;
      padding: 4px 2px !important; border-right: 1px solid #e2e8f0;
      background: #f8fafc;
      position: -webkit-sticky; position: sticky; left: 0; z-index: 9;
    }
    .table-hover tbody tr:hover > td.bv-sel,
    tbody tr:hover > td.bv-sel { background: #eef2f7; }
    td.bv-sel input { width: 15px; height: 15px; cursor: pointer; margin: 0; }
    td.bv-sel input:disabled { cursor: not-allowed; }
    /* Penanda fitur aktif - memudahkan diagnosis di console */
    html[data-ext-bulk-verif='1'] td.bv-sel { background: #eff6ff; }
  `,document.head.appendChild(e),I()}function u(e){return document.querySelector(e.sel)}function O(e){let t=window.jQuery;if(!t)return null;try{return t(e.sel).DataTable()??null}catch{return null}}function N(e){return(Array.isArray(e)?e:[e]).filter(t=>t instanceof HTMLElement)}function $(e){let t=e.querySelector('[onclick*="detail("]');if(t){let r=(t.getAttribute("onclick")||"").match(/\d+/);if(r)return r[0]}let n=e.querySelector('[onclick*="BatalVerif("]');if(n){let r=(n.getAttribute("onclick")||"").match(/\d+/);if(r)return r[0]}return null}function j(e,t){return U(e.kind,!!t.querySelector('button[onclick*="detail("]'),!!t.querySelector('button[onclick*="BatalVerif("]'))}function V(e,t){return{id:$(t),eligible:j(e,t)}}function J(e){let t=u(e);if(!t)return[];let n=O(e);if(n)try{return N(n.rows({search:"applied"}).nodes().toArray())}catch{}return Array.from(t.querySelectorAll("tbody tr")).filter(r=>!r.classList.contains("dataTables_empty"))}function oe(e){let t=u(e);if(!t)return[];let n=O(e);if(n)try{return N(n.rows().nodes().toArray())}catch{}return Array.from(t.querySelectorAll("tbody tr")).filter(r=>!r.classList.contains("dataTables_empty"))}function ie(e,t){let n=$(t);if(!n){let a=document.createElement("td");a.className="bv-sel",a.dataset.extBvUnid="1";let l=document.createElement("input");l.type="checkbox",l.disabled=!0,l.title="id_visit tidak terbaca dari markup baris ini",a.appendChild(l),t.insertBefore(a,t.firstChild);return}let r=j(e,t),o=document.createElement("td");o.className="bv-sel";let i=document.createElement("input");i.type="checkbox",i.dataset.extBvId=n,i.checked=b[e.kind].has(n),s.UJI_SAJA?(i.disabled=!0,i.title="Mode uji - belum bisa dipilih"):(i.disabled=f||!r,i.title=f?"Sedang diproses...":r?"Pilih baris ini":"Baris tidak memenuhi syarat aksi ini",i.addEventListener("change",()=>{i.checked?b[e.kind].add(n):b[e.kind].delete(n),L(),k(e)})),o.appendChild(i),t.insertBefore(o,t.firstChild)}function ae(e){e.querySelectorAll("tbody td.bv-sel").forEach(t=>t.remove())}function _(e){let t=u(e);t&&(ae(t),t.querySelectorAll("tbody tr").forEach(n=>ie(e,n)),k(e))}function k(e){let n=u(e)?.querySelector("thead input[data-ext-bv-header]");if(!n)return;let r=J(e).filter(a=>j(e,a)),o=r.length,i=r.filter(a=>{let l=$(a);return!!l&&b[e.kind].has(l)}).length;n.disabled=s.UJI_SAJA||f||o===0,n.checked=o>0&&i===o,n.indeterminate=i>0&&i<o}function se(e){if(!e)return!1;try{if(window.jQuery?.fn?.DataTable?.isDataTable?.(e))return!0}catch{}return e.classList.contains("dataTable")}function D(e){let t=u(e);if(!se(t))return;let n=t?.querySelector("thead tr");if(!n)return;if(n.querySelector('th[data-ext-bv-header="1"]')){k(e);return}let o=document.createElement("th");o.className="bv-sel-th",o.dataset.extBvHeader="1",o.title="Pilih / batal pilih semua baris yang cocok dengan pencarian";let i=document.createElement("input");i.type="checkbox",i.dataset.extBvHeader="1",i.disabled=!0,s.UJI_SAJA?i.title="Mode uji - belum bisa dipilih":(i.title="Pilih semua hasil pencarian",i.addEventListener("change",()=>{let a=J(e).map(l=>V(e,l));R(e.kind,a,i.checked),_(e),L()})),o.appendChild(i),n.insertBefore(o,n.firstChild),s.UJI_SAJA?i.disabled=!0:k(e)}function H(){g.forEach(M),L()}function S(){return document.getElementById(s.barId)}function B(e,t,n,r,o,i=!1){let a=S();if(!a)return;let l=n>0?Math.min(100,Math.round(t/n*100)):0;a.innerHTML="";let d=document.createElement("div");d.className="bv-item";let p=document.createElement("span");p.className="bv-status",p.textContent=i?`Selesai - ${e.nama}`:`${e.nama}: ${t}/${n}`;let c=document.createElement("div");c.className=i?"bv-progress done":"bv-progress";let v=document.createElement("i");v.style.width=`${l}%`,c.appendChild(v);let m=document.createElement("span");m.className="bv-label",i?m.textContent=o>0?`OK ${r} \xB7 Gagal ${o}`:`OK ${r} dari ${n}`:m.textContent=o>0?`OK ${r} \xB7 Gagal ${o}`:`OK ${r}`,d.append(p,c,m),a.appendChild(d),a.style.display="flex"}function L(){let e=S();if(!e)return;let t=g.map(r=>[r,b[r.kind].size]).filter(([,r])=>r>0);if(s.UJI_SAJA||t.length===0){e.style.display="none";return}if(f)return;e.innerHTML="",t.forEach(([r,o])=>{let i=document.createElement("div");i.className="bv-item";let a=document.createElement("span");a.className="bv-label",a.textContent=`${r.nama}: `;let l=document.createElement("span");l.className="bv-count",l.textContent=`${o} dipilih`;let d=document.createElement("button");d.className=r.danger?"bv-aksi bv-aksi-danger":"bv-aksi",d.textContent=r.aksi,d.addEventListener("click",()=>{ue(r)}),i.append(a,l,d),e.appendChild(i)});let n=document.createElement("button");n.className="bv-reset",n.textContent="Batal Pilih",n.addEventListener("click",()=>{g.forEach(r=>w(r.kind)),H()}),e.appendChild(n),e.style.display="flex"}function le(){if(S())return;let e=document.createElement("div");e.id=s.barId,e.style.display="none",document.body.appendChild(e)}async function de(e,t){try{let n=new URLSearchParams({id_visit:t}),r=await q(e,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:n.toString(),credentials:"same-origin"});if(!r.ok)return{id:t,ok:!1,pesan:`HTTP ${r.status}`};let o=await r.json(),i=String(o.kode)==="200";return{id:t,ok:i,pesan:o.message??(i?"Sukses":"Gagal")}}catch(n){return{id:t,ok:!1,pesan:n.message||"Gagal koneksi"}}}function ce(e){let t=oe(e).map(r=>V(e,r)),n=K(e.kind,t);return{valid:F(e.kind),gugur:n}}async function ue(e){if(f)return;let{valid:t,gugur:n}=ce(e);if(t.length===0){w(e.kind),H(),await y({title:"Tidak ada baris yang bisa diproses",message:"Pilihan tidak lagi cocok dengan data di tabel. Silakan pilih ulang.",okLabel:"Mengerti",hideCancel:!0});return}let r=Math.ceil(t.length*s.delayMs/1e3),o=[`${e.nama}: ${t.length} baris akan diproses.`];if(n>0&&o.push(`${n} pilihan diabaikan (data berubah/tidak memenuhi syarat).`),o.push(e.danger?"Verifikasi yang dibatalkan kembali ke daftar belum terverifikasi.":"Data yang tidak memenuhi syarat akan ditolak server."),t.length>s.warnIfMoreThan&&o.push(`PERINGATAN: jumlah besar, proses \xB1${r} detik. Jangan tutup halaman.`),o.push("Lanjutkan?"),!await y({title:`${e.aksi} ${t.length} data?`,message:o.join(`
`),variant:e.danger?"danger":"primary",okLabel:`Ya, ${e.aksi}`,cancelLabel:"Batal"}))return;f=!0,g.forEach(c=>k(c)),B(e,0,t.length,0,0);let a=[],l=0;for(let c=0;c<t.length;c+=1){let v=await de(e.endpoint,t[c]);v.ok?l+=1:a.push(v),B(e,c+1,t.length,l,a.length),c<t.length-1&&await new Promise(m=>setTimeout(m,s.delayMs))}f=!1,w(e.kind),B(e,t.length,t.length,l,a.length,!0),await new Promise(c=>setTimeout(c,700));let d=[`${e.aksi} selesai.`,`Berhasil: ${l} dari ${t.length}`];a.length>0&&(d.push("",`Gagal: ${a.length}`),a.slice(0,10).forEach(c=>d.push(`#${c.id} - ${c.pesan}`)),a.length>10&&d.push(`... dan ${a.length-10} lainnya`));let p=S();p&&(p.style.display="none"),await y({title:"Hasil",message:d.join(`
`),okLabel:"Muat ulang tabel",hideCancel:!0}),window.location.reload()}function be(){return new Promise(e=>{let t=Date.now(),n=()=>{if(g.some(o=>u(o))||Date.now()-t>s.readyTimeoutMs){e();return}setTimeout(n,s.readyPollMs)};n()})}var h=!1,T=[],E=new Map;function pe(){T.forEach(e=>e.disconnect()),T.length=0,E.clear()}function x(e){if(!h){h=!0;try{D(e),_(e),L()}finally{h=!1}}}function G(e){let t=e.querySelectorAll("tbody tr").length;return t===0||e.querySelectorAll("tbody td.bv-sel").length===t}function fe(e,t){let n=new MutationObserver(()=>{if(h)return;let o=u(e);if(o){if(o!==t){M(e);return}G(o)||x(e)}});n.observe(t,{childList:!0,subtree:!0}),T.push(n);let r=t.parentElement;if(r){let o=new MutationObserver(()=>{let i=u(e);i&&i!==t&&M(e)});o.observe(r,{childList:!0}),T.push(o)}}function M(e){let t=u(e);if(t){if(D(e),E.get(e.sel)===t){x(e);return}E.set(e.sel,t),x(e),fe(e,t)}}function ge(){setInterval(()=>{h||g.forEach(e=>{let t=E.get(e.sel),n=u(e);n&&(!t||!document.contains(t)||n!==t)?M(e):(n&&!G(n)||n&&!n.querySelector('thead th[data-ext-bv-header="1"]'))&&x(e)})},Math.max(1e3,s.readyPollMs*4))}function me(){let e=window.jQuery;e&&g.forEach(t=>{let n=u(t);if(!(!n||n.dataset.extBvBound==="1")){n.dataset.extBvBound="1";try{e(t.sel).off("draw.dt.extBv").on("draw.dt.extBv",()=>{f||h||x(t)})}catch{}}})}function Q(){try{re(),be().then(()=>{pe(),le(),H(),me(),ge(),document.documentElement.setAttribute("data-ext-bulk-verif","1");let e=g.map(t=>{let n=u(t),r=n?n.querySelectorAll("tbody tr:not(.dataTables_empty)").length:0,o=n?n.querySelectorAll("tbody td.bv-sel").length:0,i=n?n.querySelectorAll("tbody td.bv-sel[data-ext-bv-unid]").length:0,a=n?!!n.querySelector('thead th[data-ext-bv-header="1"]'):!1;return`${t.sel}: kolom=${o}/${r}${i?` (${i} tanpa id)`:""} ${a?"header=ok":"header=BELUM"}`});console.log("[BulkVerif] Init complete -",e.join(" | "),s.UJI_SAJA?"(MODE UJI: checkbox nonaktif)":"")})}catch(e){console.error("[BulkVerif] Init error:",e)}}typeof z.featureModules<"u"&&(z.featureModules.mKlaimBulkVerif={id:"mKlaimBulkVerif",name:"Bulk Verif / Batal Verif",description:"Verifikasi atau batalkan verifikasi banyak klaim sekaligus",match:{regex:/^\/v2\/m-klaim\/?$/},run:Q});return te(he);})();
