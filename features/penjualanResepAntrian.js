"use strict";var __morbis_feature=(()=>{function k(e){return new Promise((r,n)=>{chrome.runtime.sendMessage(e,o=>{chrome.runtime.lastError?n(chrome.runtime.lastError):r(o)})})}var B="http://dev.rsudkotajambi.id/rs",H=null,g=null;async function D(){try{return((await chrome.storage.sync.get("extensionCustomUrls")).extensionCustomUrls??[]).filter(n=>n.url&&n.enabled!==!1).map(n=>n.url.replace(/\/+$/,"")+"/rs")}catch{return[]}}var F=["http://dev.rsudkotajambi.id/rs","http://103.147.236.138/rs"];async function j(e,r,n){return k({type:"QUEUE_API",url:e,method:r,body:n})}function z(e,r){return new Promise((n,o)=>{let i=setTimeout(()=>o(new Error("timeout")),r);e.then(t=>{clearTimeout(i),n(t)}).catch(t=>{clearTimeout(i),o(t)})})}function f(){return g||(g=(async()=>{try{let n=localStorage.getItem("ext-farmasi-app-base");if(n&&/^https?:\/\//.test(n))return n.replace(/\/+$/,"")}catch{}let e=await D(),r=[...new Set([...e,...F])];for(let n of r)try{let o=await z(j(n+"/api/queue/lookup?resep_id=probe","GET"),2500),i=o.contentType||"";if((o.status===200||o.status===422)&&i.includes("application/json"))return H=n,n}catch{}return B})(),g)}var _="";async function b(e){try{let r={...e};if(e.event==="ENQUEUE"&&delete r.queue_number,e.event==="BATAL"&&!e.queue_number)return console.warn("[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati"),{ok:!1};let n=await f(),o=new AbortController,i=setTimeout(()=>o.abort(),8e3),t=await fetch(n+"/api/queue/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),cache:"no-store",credentials:"omit",signal:o.signal});if(clearTimeout(i),!t.ok){let s="";try{s=(await t.json())?.message||""}catch{}throw new Error("HTTP "+t.status+(s?" \u2014 "+s:""))}let a=await t.json();return{ok:!!a.ok,queue_number:a.queue?.queue_number,created:a.created,duplicate:a.duplicate}}catch(r){let n=r.message;return n!==_&&(console.warn("[MORBIS Ext] queue sync gagal:",n),_=n),await X(e),{ok:!1}}}var c="ext-queue-retry-queue",$=20;async function X(e){try{let r=(await chrome.storage.local.get(c))[c]??[];if(r.some(n=>n.event_id===e.event_id))return;r.push(e),r.length>$&&r.shift(),await chrome.storage.local.set({[c]:r}),console.log("[MORBIS Ext] disimpan ke retry queue:",e.event,e.queue_number??"")}catch{}}async function Q(){try{return(await chrome.storage.local.get(c))[c]??[]}catch{return[]}}async function A(e){try{let n=((await chrome.storage.local.get(c))[c]??[]).filter(o=>o.event_id!==e);await chrome.storage.local.set({[c]:n})}catch{}}async function K(){let e=await Q();if(e.length)for(let r of[...e])try{(await Y(r)).ok&&(await A(r.event_id),console.log("[MORBIS Ext] retry queue sukses:",r.event,r.queue_number??""))}catch(n){let o=n.message??"";(o.includes("HTTP 404")||o.includes("HTTP 422"))&&(await A(r.event_id),console.log("[MORBIS Ext] retry queue buang (stale):",r.event,r.queue_number??"",o))}}async function Y(e){let r={...e};e.event==="ENQUEUE"&&delete r.queue_number;let n=await f(),o=new AbortController,i=setTimeout(()=>o.abort(),8e3),t=await fetch(n+"/api/queue/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),cache:"no-store",credentials:"omit",signal:o.signal});if(clearTimeout(i),!t.ok)throw new Error("HTTP "+t.status);let a=await t.json();return{ok:!!a.ok,queue_number:a.queue?.queue_number}}setInterval(()=>{K()},1e4);function h(e,r,n){return`${e}-${r}-${n}-${new Date().toISOString().slice(0,10)}`}function L(e,r=5e3){let n=document.documentElement,o=Date.now(),i=window.setInterval(()=>{n.getAttribute("data-ext-antrian-farmasi")==="1"?(window.clearInterval(i),e()):Date.now()-o>r&&(window.clearInterval(i),W())},200)}function W(){if(document.getElementById("ext-feature-gate-notif"))return;let e=document.createElement("div");e.id="ext-feature-gate-notif",e.textContent="\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)",e.style.cssText="position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);",document.body.appendChild(e),setTimeout(()=>e.remove(),1e4)}var R="ext-batch-shared-style";function J(){if(document.getElementById(R))return;let e=document.createElement("style");e.id=R,e.textContent=`
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
  `,document.head.appendChild(e)}function C(e){return new Promise(r=>{J();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",o=document.createElement("div");o.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",o.innerHTML=`
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
      </div>`,o.querySelector("h3").textContent=e.title;let i=o.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((l,d)=>{d>0&&i.appendChild(document.createElement("br")),i.appendChild(document.createTextNode(l))});let t=l=>{o.remove(),document.removeEventListener("keydown",a),r(l)},a=l=>{l.key==="Escape"&&t(!1)};o.querySelector(".ext-modal-close").addEventListener("click",()=>t(!1)),o.addEventListener("click",l=>{l.target===o&&t(!1)}),o.querySelector("[data-ext-ok]").addEventListener("click",()=>t(!0));let s=o.querySelector("[data-ext-cancel]");s&&s.addEventListener("click",()=>t(!1)),document.addEventListener("keydown",a),document.body.appendChild(o)})}var S="RSUD H. Abdul Manap";function y(e){let r=window.open("","_blank","width=400,height=560");if(!r)return C({title:"Popup Diblokir",message:"Izinkan popup untuk mencetak.",variant:"warning",okLabel:"OK",hideCancel:!0}),!1;let n=e.jenis||e.unit?`<div style="font-size:16px;margin-top:2px;">${[e.jenis,e.unit].filter(Boolean).join(" \xB7 ")}</div>`:"",o=e.tglLahir?`<div style="font-size:13px;margin-top:4px;color:#555;">${e.tglLahir}</div>`:"";return r.document.write('<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">'+S+`</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>`+o+n+`<div style="font-size:11px;margin-top:10px;color:#333;">${e.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`),r.document.close(),window.setTimeout(()=>{try{r.focus(),r.print()}catch{}},300),!0}var V="/v2/antrol/search",Z="sub=update_v2",ee="/public/antrian-farmasi-v2/list-antrian-v2";async function te(e){try{let r=await fetch(await f()+"/api/queue/lookup?resep_id="+encodeURIComponent(e),{cache:"no-store",credentials:"omit"});if(!r.ok)return null;let n=await r.json();return!n.ok||!n.found||!n.queue?.queue_number?null:{queue_number:n.queue.queue_number,status:n.queue.status??""}}catch{return null}}async function E(e){let r=[e.get("id_resep")||"",e.get("id_resep","nomor_resep")||"",new URLSearchParams(location.search).get("id")??""].filter(n=>n&&n.length>=3);for(let n of r){let o=await te(n);if(o)return o}return null}function O(e){if(e==="DIBATALKAN")return!0;try{let o=(document.querySelector("#isi, .card, .panel, .form-horizontal, form, table")||document.body).querySelectorAll("span, b, strong, td, .label, .badge, h3, h4");for(let i of o){let t=(i.textContent||"").trim();if(/^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(t)&&!i.closest("button, input, a"))return!0}}catch{}return!1}async function ne(e){return fetch(`${V}?${Z}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`id=${encodeURIComponent(e)}&taskid=6`,credentials:"include"}).then(r=>(console.log("[MORBIS Ext] antrian terdaftar id="+e,"status",r.status),!0)).catch(r=>(console.warn("[MORBIS Ext] gagal mendaftarkan antrian",r),!1))}async function re(e,r){try{let n=await fetch(ee,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:"type=check_antrian",cache:"no-store",credentials:"include"});if(!n.ok)return null;let o=await n.json();if(!Array.isArray(o))return null;let i=String(r??"").slice(0,16);return o.find(t=>String(t.ID_PASIEN??"")===String(e)&&(!i||String(t.WAKTU??"").slice(0,16)===i))??o.find(t=>String(t.ID_PASIEN??"")===String(e))??null}catch{return null}}async function I(e,r,n,o){if(!await ne(e))throw new Error("gagal antrol MORBIS");let t=o.get("id_pasien")||new URLSearchParams(location.search).get("norm")||"",a=o.get("waktu_pengajuan"),s=o.namaPasien(),l=n==="racik"?"racikan":"tunggal",d=(async()=>{for(let T=0;T<3;T++){let v=await re(t,a);if(v)return v;await new Promise(q=>setTimeout(q,200))}return null})(),N=b({event_id:h("enq",e,e+"-"+l)+"-"+Date.now().toString(36),event:"ENQUEUE",resep_id:r,nama_pasien:s,norm:t||void 0,tgl_lahir:o.tglLahir()||void 0,shift:"",jenis:l,counter:"",payload:{idVisit:e,unit:"",waktu:a||""}}),[M,w]=await Promise.all([d,N]);if(!w.ok)throw new Error("gagal terhubung App Antrian");let x=w.queue_number||"";if(!x)throw new Error("nomor antrian belum terbit");return y({nomorResep:r,nama:s,jenis:l,unit:String(M?.NAMA_UNIT??""),tanggal:a?a.slice(0,10):"",code:x,tglLahir:o.tglLahir()}),x}async function P(e,r,n){let o=h("bat",r,e)+"-"+Date.now().toString(36);return(await b({event_id:o,event:"BATAL",queue_number:e,resep_id:r})).ok?{ok:!0,gone:!1}:await E(n)?{ok:!1,gone:!1}:{ok:!0,gone:!0}}function G(e,r,n,o="",i="",t=""){y({nomorResep:e,nama:n.namaPasien(),jenis:o,unit:i,tanggal:t,code:r,tglLahir:n.tglLahir()})}if(window.__extPenjualanAntrian)throw new Error("skip double inject penjualanResepAntrian");window.__extPenjualanAntrian=!0;var U=new URLSearchParams(location.search),oe=U.get("visit")??"",ie=U.get("id")??"";function ae(){let e=document.querySelector("#nama_pasien")?.value?.trim();if(e)return e.toUpperCase();let r=document.querySelector("#nama")?.value?.trim();if(r)return r.toUpperCase();let n=Array.from(document.querySelectorAll("th, td, label, strong, b, span"));for(let t of n){let a=(t.textContent||"").trim();if(!/^nama\s*pasien$/i.test(a))continue;let s=t.nextElementSibling||t.parentElement?.querySelector("input, select")||t.parentElement?.nextElementSibling,l=(s?.textContent||s?.value||"").trim();if(l)return l.toUpperCase()}let o=/(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i,i=Array.from(document.querySelectorAll("h1, h2, h3, .page-title, .card-title"));for(let t of i){if(t.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]'))continue;let a=(t.textContent||"").trim();if(!(!a||a.length<4||a.length>60||o.test(a)||a.split(/\s+/).filter(Boolean).length<2))return a.toUpperCase()}return""}function se(){let e=document.querySelector("#tgl_lahir")?.value?.trim();if(e)return e;let r=document.querySelectorAll("tr");for(let n of r){let o=n.querySelectorAll("td");for(let i=0;i<o.length-1;i++)if(/^tanggal\s*lahir$/i.test(o[i].textContent?.trim()||"")&&o[i+1]){let t=o[i+1].textContent?.trim();if(t&&t!==":")return t}}return""}function u(e,r){if(e){let n=document.querySelector("#"+e)?.value?.trim()||"";if(n)return n}if(r){let n=document.querySelector('input[name="'+r+'"]')?.value?.trim()||"";if(n)return n}return e==="id_resep"?ie:e==="id_visit"?oe:""}var m={get:u,namaPasien:ae,tglLahir:se};function p(e,r){let n=document.querySelector("#ext-antrian-bar");if(!n)return;let o=u("nomor_resep","id_resep");if(e==="issued"&&r){n.innerHTML='<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;"><span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">\u2713 Sudah antri \u2014 '+r+'</span><div style="display: flex; gap: 6px;"><button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button><button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB \u2014 resep bisa di-antrikan ulang">Batal antrian</button></div></div>',n.querySelector("#ext-antrian-cetak")?.addEventListener("click",()=>{if(o)try{G(o,r||"",m)}catch{}}),n.querySelector("#ext-antrian-batal")?.addEventListener("click",async()=>{if(!confirm("Batalkan antrian "+r+"? Resep akan keluar dari daftar panggilan."))return;let t=n.querySelector("#ext-antrian-batal");if(t&&(t.disabled=!0,t.textContent="Membatalkan\u2026"),!(await P(r||"",o,m)).ok){alert("[MORBIS Ext] Gagal membatalkan antrian. Coba lagi."),t&&(t.disabled=!1,t.textContent="Batal antrian");return}p("ready")});return}n.innerHTML='<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button><button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';let i=t=>{let a=u("id_visit"),s=u("id_resep","nomor_resep");if(!a||!s){alert("[MORBIS Ext] data resep belum dimuat. Coba lagi.");return}let l=document.querySelector(t==="racik"?"#ext-antrian-racik":"#ext-antrian-tunggal");l&&(l.disabled=!0,l.textContent="Memproses\u2026"),I(a,s,t,m).then(d=>p("issued",d)).catch(d=>alert("[MORBIS Ext] "+(d?.message||"gagal mengantrikan"))).finally(()=>{l&&(l.disabled=!1,l.textContent=t==="racik"?"Antrikan obat racik":"Antrikan obat tunggal")})};n.querySelector("#ext-antrian-racik")?.addEventListener("click",()=>i("racik")),n.querySelector("#ext-antrian-tunggal")?.addEventListener("click",()=>i("tunggal"))}function le(){let e=()=>{let n=Array.from(document.querySelectorAll('td[valign="top"]')).find(t=>t.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'));if(n){let t=document.createElement("fieldset");t.id="ext-antrian-fieldset",t.style.cssText="margin-top:6px;",t.innerHTML="<legend>Antrian Farmasi</legend>";let a=document.createElement("div");return a.id="ext-antrian-bar",a.style.cssText="display:flex;flex-wrap:wrap;align-items:center;",t.appendChild(a),n.appendChild(t),a}let o=document.querySelector("form");if(o){let t=document.createElement("fieldset");t.id="ext-antrian-fieldset",t.style.cssText="margin-top:6px;",t.innerHTML="<legend>Antrian Farmasi</legend>";let a=document.createElement("div");a.id="ext-antrian-bar",a.style.cssText="display:flex;flex-wrap:wrap;align-items:center;",t.appendChild(a);let s=o.querySelector('button[type="submit"], input[type="submit"]');return s?s.parentElement?.insertBefore(t,s):o.prepend(t),a}let i=document.querySelector(".card-body, .panel-body, .form-horizontal");if(i){let t=document.createElement("fieldset");t.id="ext-antrian-fieldset",t.style.cssText="margin-top:6px;",t.innerHTML="<legend>Antrian Farmasi</legend>";let a=document.createElement("div");return a.id="ext-antrian-bar",a.style.cssText="display:flex;flex-wrap:wrap;align-items:center;",t.appendChild(a),i.prepend(t),a}if(!document.getElementById("ext-antrian-fieldset")){let t=document.createElement("div");return t.id="ext-antrian-fieldset",t.style.cssText="position:fixed;top:60px;right:12px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);",t.innerHTML='<legend style="font-weight:700;margin-bottom:4px;display:block;">Antrian Farmasi</legend><div id="ext-antrian-bar" style="display:flex;flex-wrap:wrap;align-items:center;"></div>',document.body.appendChild(t),t.querySelector("#ext-antrian-bar")}return null},r=()=>{let o=document.querySelector("#ext-antrian-bar")||e();if(!o)return;let i=t=>{if(!u("id_resep","nomor_resep")){t<10?window.setTimeout(()=>i(t+1),800):p("ready");return}E(m).then(s=>{if(O(s?.status)){o.innerHTML='<span style="color:#b02a37;font-weight:700;">Resep dibatalkan \u2014 antrian tidak tersedia</span>';return}s?p("issued",s.queue_number):t<10?window.setTimeout(()=>i(t+1),800):p("ready")})};i(0)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r,{once:!0}):r(),window.setTimeout(r,2e3),window.setTimeout(r,5e3)}L(()=>{ce(),le()});function ce(){let e=(i,t)=>String(i??"").includes("/v2/antrol/search")&&String(i??"").includes("sub=update_v2")&&String(t??"").includes("taskid=6"),r=XMLHttpRequest.prototype.open,n=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(i,t,...a){return this.__extUrl=String(t),r.apply(this,[i,t,...a])},XMLHttpRequest.prototype.send=function(i){if(e(this.__extUrl,i)){console.log("[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)");return}return n.apply(this,[i])};let o=window.fetch.bind(window);window.fetch=((i,t)=>{let a=typeof i=="string"?i:i instanceof URL?i.toString():i.url;return e(a,t?.body)?(console.log("[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)"),Promise.resolve(new Response(null,{status:200}))):o(i,t)})}})();
