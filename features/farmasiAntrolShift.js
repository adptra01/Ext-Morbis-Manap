"use strict";var __morbis_feature=(()=>{function k(e){return new Promise((t,n)=>{chrome.runtime.sendMessage(e,r=>{chrome.runtime.lastError?n(chrome.runtime.lastError):t(r)})})}var q="http://dev.rsudkotajambi.id/rs",B=null,p=null;async function H(){try{return((await chrome.storage.sync.get("extensionCustomUrls")).extensionCustomUrls??[]).filter(n=>n.url&&n.enabled!==!1).map(n=>n.url.replace(/\/+$/,"")+"/rs")}catch{return[]}}var D=["http://dev.rsudkotajambi.id/rs","http://103.147.236.138/rs"];async function F(e,t,n){return k({type:"QUEUE_API",url:e,method:t,body:n})}function j(e,t){return new Promise((n,r)=>{let i=setTimeout(()=>r(new Error("timeout")),t);e.then(o=>{clearTimeout(i),n(o)}).catch(o=>{clearTimeout(i),r(o)})})}function g(){return p||(p=(async()=>{try{let n=localStorage.getItem("ext-farmasi-app-base");if(n&&/^https?:\/\//.test(n))return n.replace(/\/+$/,"")}catch{}let e=await H(),t=[...new Set([...e,...D])];for(let n of t)try{let r=await j(F(n+"/api/queue/lookup?resep_id=probe","GET"),2500),i=r.contentType||"";if((r.status===200||r.status===422)&&i.includes("application/json"))return B=n,n}catch{}return q})(),p)}var _="";async function b(e){try{let t={...e};if(e.event==="ENQUEUE"&&delete t.queue_number,e.event==="BATAL"&&!e.queue_number)return console.warn("[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati"),{ok:!1};let n=await g(),r=new AbortController,i=setTimeout(()=>r.abort(),8e3),o=await fetch(n+"/api/queue/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),cache:"no-store",credentials:"omit",signal:r.signal});if(clearTimeout(i),!o.ok){let l="";try{l=(await o.json())?.message||""}catch{}throw new Error("HTTP "+o.status+(l?" \u2014 "+l:""))}let a=await o.json();return{ok:!!a.ok,queue_number:a.queue?.queue_number,created:a.created,duplicate:a.duplicate}}catch(t){let n=t.message;return n!==_&&(console.warn("[MORBIS Ext] queue sync gagal:",n),_=n),await $(e),{ok:!1}}}var c="ext-queue-retry-queue",z=20;async function $(e){try{let t=(await chrome.storage.local.get(c))[c]??[];if(t.some(n=>n.event_id===e.event_id))return;t.push(e),t.length>z&&t.shift(),await chrome.storage.local.set({[c]:t}),console.log("[MORBIS Ext] disimpan ke retry queue:",e.event,e.queue_number??"")}catch{}}async function X(){try{return(await chrome.storage.local.get(c))[c]??[]}catch{return[]}}async function A(e){try{let n=((await chrome.storage.local.get(c))[c]??[]).filter(r=>r.event_id!==e);await chrome.storage.local.set({[c]:n})}catch{}}async function Q(){let e=await X();if(e.length)for(let t of[...e])try{(await K(t)).ok&&(await A(t.event_id),console.log("[MORBIS Ext] retry queue sukses:",t.event,t.queue_number??""))}catch(n){let r=n.message??"";(r.includes("HTTP 404")||r.includes("HTTP 422"))&&(await A(t.event_id),console.log("[MORBIS Ext] retry queue buang (stale):",t.event,t.queue_number??"",r))}}async function K(e){let t={...e};e.event==="ENQUEUE"&&delete t.queue_number;let n=await g(),r=new AbortController,i=setTimeout(()=>r.abort(),8e3),o=await fetch(n+"/api/queue/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),cache:"no-store",credentials:"omit",signal:r.signal});if(clearTimeout(i),!o.ok)throw new Error("HTTP "+o.status);let a=await o.json();return{ok:!!a.ok,queue_number:a.queue?.queue_number}}setInterval(()=>{Q()},1e4);function h(e,t,n){return`${e}-${t}-${n}-${new Date().toISOString().slice(0,10)}`}function L(e,t=5e3){let n=document.documentElement,r=Date.now(),i=window.setInterval(()=>{n.getAttribute("data-ext-antrian-farmasi")==="1"?(window.clearInterval(i),e()):Date.now()-r>t&&(window.clearInterval(i),Y())},200)}function Y(){if(document.getElementById("ext-feature-gate-notif"))return;let e=document.createElement("div");e.id="ext-feature-gate-notif",e.textContent="\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)",e.style.cssText="position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);",document.body.appendChild(e),setTimeout(()=>e.remove(),1e4)}var C="ext-batch-shared-style";function W(){if(document.getElementById(C))return;let e=document.createElement("style");e.id=C,e.textContent=`
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
  `,document.head.appendChild(e)}function R(e){return new Promise(t=>{W();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",r=document.createElement("div");r.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",r.innerHTML=`
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
      </div>`,r.querySelector("h3").textContent=e.title;let i=r.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((s,d)=>{d>0&&i.appendChild(document.createElement("br")),i.appendChild(document.createTextNode(s))});let o=s=>{r.remove(),document.removeEventListener("keydown",a),t(s)},a=s=>{s.key==="Escape"&&o(!1)};r.querySelector(".ext-modal-close").addEventListener("click",()=>o(!1)),r.addEventListener("click",s=>{s.target===r&&o(!1)}),r.querySelector("[data-ext-ok]").addEventListener("click",()=>o(!0));let l=r.querySelector("[data-ext-cancel]");l&&l.addEventListener("click",()=>o(!1)),document.addEventListener("keydown",a),document.body.appendChild(r)})}var S="RSUD H. Abdul Manap";function y(e){let t=window.open("","_blank","width=400,height=560");if(!t)return R({title:"Popup Diblokir",message:"Izinkan popup untuk mencetak.",variant:"warning",okLabel:"OK",hideCancel:!0}),!1;let n=e.jenis||e.unit?`<div style="font-size:16px;margin-top:2px;">${[e.jenis,e.unit].filter(Boolean).join(" \xB7 ")}</div>`:"",r=e.tglLahir?`<div style="font-size:13px;margin-top:4px;color:#555;">${e.tglLahir}</div>`:"";return t.document.write('<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">'+S+`</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>`+r+n+`<div style="font-size:11px;margin-top:10px;color:#333;">${e.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`),t.document.close(),window.setTimeout(()=>{try{t.focus(),t.print()}catch{}},300),!0}var J="/v2/antrol/search",V="sub=update_v2",Z="/public/antrian-farmasi-v2/list-antrian-v2";async function ee(e){try{let t=await fetch(await g()+"/api/queue/lookup?resep_id="+encodeURIComponent(e),{cache:"no-store",credentials:"omit"});if(!t.ok)return null;let n=await t.json();return!n.ok||!n.found||!n.queue?.queue_number?null:{queue_number:n.queue.queue_number,status:n.queue.status??""}}catch{return null}}async function E(e){let t=[e.get("id_resep")||"",e.get("id_resep","nomor_resep")||"",new URLSearchParams(location.search).get("id")??""].filter(n=>n&&n.length>=3);for(let n of t){let r=await ee(n);if(r)return r}return null}function O(e){if(e==="DIBATALKAN")return!0;try{let r=(document.querySelector("#isi, .card, .panel, .form-horizontal, form, table")||document.body).querySelectorAll("span, b, strong, td, .label, .badge, h3, h4");for(let i of r){let o=(i.textContent||"").trim();if(/^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(o)&&!i.closest("button, input, a"))return!0}}catch{}return!1}async function te(e){return fetch(`${J}?${V}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`id=${encodeURIComponent(e)}&taskid=6`,credentials:"include"}).then(t=>(console.log("[MORBIS Ext] antrian terdaftar id="+e,"status",t.status),!0)).catch(t=>(console.warn("[MORBIS Ext] gagal mendaftarkan antrian",t),!1))}async function ne(e,t){try{let n=await fetch(Z,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:"type=check_antrian",cache:"no-store",credentials:"include"});if(!n.ok)return null;let r=await n.json();if(!Array.isArray(r))return null;let i=String(t??"").slice(0,16);return r.find(o=>String(o.ID_PASIEN??"")===String(e)&&(!i||String(o.WAKTU??"").slice(0,16)===i))??r.find(o=>String(o.ID_PASIEN??"")===String(e))??null}catch{return null}}async function I(e,t,n,r){if(!await te(e))throw new Error("gagal antrol MORBIS");let o=r.get("id_pasien")||new URLSearchParams(location.search).get("norm")||"",a=r.get("waktu_pengajuan"),l=r.namaPasien(),s=n==="racik"?"racikan":"tunggal",d=(async()=>{for(let T=0;T<3;T++){let v=await ne(o,a);if(v)return v;await new Promise(M=>setTimeout(M,200))}return null})(),N=b({event_id:h("enq",e,e+"-"+s)+"-"+Date.now().toString(36),event:"ENQUEUE",resep_id:t,nama_pasien:l,norm:o||void 0,tgl_lahir:r.tglLahir()||void 0,shift:"",jenis:s,counter:"",payload:{idVisit:e,unit:"",waktu:a||""}}),[U,w]=await Promise.all([d,N]);if(!w.ok)throw new Error("gagal terhubung App Antrian");let x=w.queue_number||"";if(!x)throw new Error("nomor antrian belum terbit");return y({nomorResep:t,nama:l,jenis:s,unit:String(U?.NAMA_UNIT??""),tanggal:a?a.slice(0,10):"",code:x,tglLahir:r.tglLahir()}),x}async function P(e,t,n){let r=h("bat",t,e)+"-"+Date.now().toString(36);return(await b({event_id:r,event:"BATAL",queue_number:e,resep_id:t})).ok?{ok:!0,gone:!1}:await E(n)?{ok:!1,gone:!1}:{ok:!0,gone:!0}}function G(e,t,n,r="",i="",o=""){y({nomorResep:e,nama:n.namaPasien(),jenis:r,unit:i,tanggal:o,code:t,tglLahir:n.tglLahir()})}if(window.__extAntrolShift)throw new Error("skip double inject farmasiAntrolShift");window.__extAntrolShift=!0;function re(){let e=document.querySelector("#nama_pasien")?.value?.trim();if(e)return e.toUpperCase();let t=document.querySelector("#nama")?.value?.trim();if(t)return t.toUpperCase();let n=Array.from(document.querySelectorAll("th, td, label, strong, b, span"));for(let o of n){let a=(o.textContent||"").trim();if(!/^nama\s*pasien$/i.test(a))continue;let l=o.nextElementSibling||o.parentElement?.querySelector("input, select")||o.parentElement?.nextElementSibling,s=(l?.textContent||l?.value||"").trim();if(s)return s.toUpperCase()}let r=/(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i,i=Array.from(document.querySelectorAll("h1, h2, h3, .page-title, .card-title"));for(let o of i){if(o.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]'))continue;let a=(o.textContent||"").trim();if(!(!a||a.length<4||a.length>60||r.test(a)||a.split(/\s+/).filter(Boolean).length<2))return a.toUpperCase()}return""}function oe(){let e=document.querySelector("#tgl_lahir")?.value?.trim();if(e)return e;let t=document.querySelectorAll("tr");for(let n of t){let r=n.querySelectorAll("td");for(let i=0;i<r.length-1;i++)if(/^tanggal\s*lahir$/i.test(r[i].textContent?.trim()||"")&&r[i+1]){let o=r[i+1].textContent?.trim();if(o&&o!==":")return o}}return""}var f={get:(e,t)=>(document.querySelector("#"+e)?.value||(t?document.querySelector('input[name="'+t+'"]')?.value:"")||"").trim(),namaPasien:re,tglLahir:oe};function m(e,t){return document.querySelector("#"+e)?.value?.trim()||(t?document.querySelector('input[name="'+t+'"]')?.value?.trim():"")||""}function u(e,t){let n=document.querySelector("#ext-antrian-bar");if(!n)return;let r=m("nomor_resep","id_resep");if(e==="issued"&&t){n.innerHTML='<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;"><span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">\u2713 Sudah antri \u2014 '+t+'</span><div style="display: flex; gap: 6px;"><button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button><button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB \u2014 resep bisa di-antrikan ulang">Batal antrian</button></div></div>',n.querySelector("#ext-antrian-cetak")?.addEventListener("click",()=>{if(r)try{G(r,t||"",f)}catch{}}),n.querySelector("#ext-antrian-batal")?.addEventListener("click",async()=>{if(!confirm("Batalkan antrian "+t+"? Resep akan keluar dari daftar panggilan."))return;let o=n.querySelector("#ext-antrian-batal");if(o&&(o.disabled=!0,o.textContent="Membatalkan\u2026"),!(await P(t||"",r,f)).ok){alert("[MORBIS Ext] Gagal membatalkan antrian. Coba lagi."),o&&(o.disabled=!1,o.textContent="Batal antrian");return}u("ready")});return}n.innerHTML='<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button><button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';let i=o=>{let a=m("id_visit"),l=m("id_resep","nomor_resep");if(!a||!l){alert("[MORBIS Ext] data resep belum dimuat. Coba lagi.");return}let s=document.querySelector(o==="racik"?"#ext-antrian-racik":"#ext-antrian-tunggal");s&&(s.disabled=!0,s.textContent="Memproses\u2026"),I(a,l,o,f).then(d=>u("issued",d)).catch(d=>alert("[MORBIS Ext] "+(d?.message||"gagal mengantrikan"))).finally(()=>{s&&(s.disabled=!1,s.textContent=o==="racik"?"Antrikan obat racik":"Antrikan obat tunggal")})};n.querySelector("#ext-antrian-racik")?.addEventListener("click",()=>i("racik")),n.querySelector("#ext-antrian-tunggal")?.addEventListener("click",()=>i("tunggal"))}function ie(){let e=()=>{let n=Array.from(document.querySelectorAll('td[valign="top"]')).find(o=>o.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'));if(!n)return null;let r=document.createElement("fieldset");r.id="ext-antrian-fieldset",r.style.cssText="margin-top:6px;",r.innerHTML="<legend>Antrian Farmasi</legend>";let i=document.createElement("div");return i.id="ext-antrian-bar",i.style.cssText="display:flex;flex-wrap:wrap;align-items:center;",r.appendChild(i),n.appendChild(r),i},t=()=>{let r=document.querySelector("#ext-antrian-bar")||e();if(!r)return;let i=o=>{if(!m("id_resep","nomor_resep")){o<10?window.setTimeout(()=>i(o+1),800):u("ready");return}E(f).then(l=>{if(O(l?.status)){r.innerHTML='<span style="color:#b02a37;font-weight:700;">Resep dibatalkan \u2014 antrian tidak tersedia</span>';return}l?u("issued",l.queue_number):o<10?window.setTimeout(()=>i(o+1),800):u("ready")})};i(0)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t,{once:!0}):t(),window.setTimeout(t,2e3),window.setTimeout(t,5e3)}L(()=>{ae(),ie()});function ae(){let e=(i,o)=>String(i??"").includes("/v2/antrol/search")&&String(i??"").includes("sub=update_v2")&&String(o??"").includes("taskid=6"),t=XMLHttpRequest.prototype.open,n=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(i,o,...a){return this.__extUrl=String(o),t.apply(this,[i,o,...a])},XMLHttpRequest.prototype.send=function(i){if(e(this.__extUrl,i)){console.log("[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)");return}return n.apply(this,[i])};let r=window.fetch.bind(window);window.fetch=((i,o)=>{let a=typeof i=="string"?i:i instanceof URL?i.toString():i.url;return e(a,o?.body)?(console.log("[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)"),Promise.resolve(new Response(null,{status:200}))):r(i,o)})}})();
