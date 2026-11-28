"use strict";var __morbis_feature=(()=>{var T="ext-batch-shared-style";function z(){if(document.getElementById(T))return;let e=document.createElement("style");e.id=T,e.textContent=`
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
    .ext-status-badge[data-status="warning"] { background: #fffbeb; color: #92400e; border-color: #fde68a; }

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
  `,document.head.appendChild(e)}function v(e){return new Promise(t=>{z();let n=e.variant==="danger"?"ext-btn-danger":"ext-btn-primary",o=document.createElement("div");o.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);backdrop-filter:blur(2px);",o.innerHTML=`
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
      </div>`,o.querySelector("h3").textContent=e.title;let r=o.querySelector(".ext-confirm-body");e.message&&e.message.split(`
`).forEach((l,b)=>{b>0&&r.appendChild(document.createElement("br")),r.appendChild(document.createTextNode(l))});let i=l=>{o.remove(),document.removeEventListener("keydown",a),t(l)},a=l=>{l.key==="Escape"&&i(!1)};o.querySelector(".ext-modal-close").addEventListener("click",()=>i(!1)),o.addEventListener("click",l=>{l.target===o&&i(!1)}),o.querySelector("[data-ext-ok]").addEventListener("click",()=>i(!0));let s=o.querySelector("[data-ext-cancel]");s&&s.addEventListener("click",()=>i(!1)),document.addEventListener("keydown",a),document.body.appendChild(o)})}var _="RSUD H. Abdul Manap";function h(e){let t=window.open("","_blank","width=400,height=560");if(!t)return v({title:"Popup Diblokir",message:"Izinkan popup untuk mencetak.",variant:"warning",okLabel:"OK",hideCancel:!0}),!1;let n=e.jenis||e.unit?`<div style="font-size:16px;margin-top:2px;">${[e.jenis,e.unit].filter(Boolean).join(" \xB7 ")}</div>`:"",o=e.tglLahir?`<div style="font-size:13px;margin-top:4px;color:#555;">${e.tglLahir}</div>`:"";return t.document.write('<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">'+_+`</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${e.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${e.nama}</div>`+o+n+`<div style="font-size:11px;margin-top:10px;color:#333;">${e.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`),t.document.close(),window.setTimeout(()=>{try{t.focus(),t.print()}catch{}},300),!0}function k(e){return new Promise((t,n)=>{let o=!1,r=setTimeout(()=>{o||(o=!0,n(new Error("Chrome message timeout")))},15e3);chrome.runtime.sendMessage(e,i=>{let a=chrome.runtime.lastError;if(o)return;if(o=!0,clearTimeout(r),a){n(a);return}let s=i;if(s?.success===!1||s?.error){n(new Error(s.error||"Permintaan ditolak background"));return}t(s)})})}var $="http://dev.rsudkotajambi.id/rs",Q=null,f=null;async function X(){try{return((await chrome.storage.local.get("extensionCustomUrls")).extensionCustomUrls??[]).filter(n=>n.url&&n.enabled!==!1).map(n=>n.url.replace(/\/+$/,"")+"/rs")}catch{return[]}}var K=["http://dev.rsudkotajambi.id/rs","http://103.147.236.138/rs"],W=["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"],J=[".rsudkotajambi.id",".ddev.site"];function Y(e){try{let t=new URL(e);if(t.protocol!=="http:"&&t.protocol!=="https:")return!1;let n=t.hostname.toLowerCase();return W.includes(n)?!0:J.some(o=>n.endsWith(o))}catch{return!1}}async function V(e,t,n){return k({type:"QUEUE_API",url:e,method:t,body:n})}function Z(e,t){return new Promise((n,o)=>{let r=setTimeout(()=>o(new Error("timeout")),t);e.then(i=>{clearTimeout(r),n(i)}).catch(i=>{clearTimeout(r),o(i)})})}function C(){return f||(f=(async()=>{try{let n=localStorage.getItem("ext-farmasi-app-base");if(n&&Y(n))return n.replace(/\/+$/,"")}catch{}let e=await X(),t=[...new Set([...e,...K])];for(let n of t)try{let o=await Z(V(n+"/api/queue/lookup?resep_id=probe","GET"),2500),r=o.contentType||"";if((o.status===200||o.status===422)&&r.includes("application/json"))return Q=n,n}catch{}return $})(),f)}var A="";async function S(e){try{let t={...e};if(e.event==="ENQUEUE"&&delete t.queue_number,e.event==="BATAL"&&!e.queue_number)return console.warn("[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati"),{ok:!1};let n=await C(),o=new AbortController,r=setTimeout(()=>o.abort(),8e3),i=await fetch(n+"/api/queue/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),cache:"no-store",credentials:"omit",signal:o.signal});if(clearTimeout(r),!i.ok){let s="";try{s=(await i.json())?.message||""}catch{}throw new Error("HTTP "+i.status+(s?" \u2014 "+s:""))}let a=await i.json();return{ok:!!a.ok,queue_number:a.queue?.queue_number,created:a.created,duplicate:a.duplicate}}catch(t){let n=t.message;return n!==A&&(console.warn("[MORBIS Ext] queue sync gagal:",n),A=n),await te(e),{ok:!1}}}var c="ext-queue-retry-queue",ee=20;async function te(e){try{let t=(await chrome.storage.local.get(c))[c]??[];if(t.some(n=>n.event_id===e.event_id))return;t.push(e),t.length>ee&&t.shift(),await chrome.storage.local.set({[c]:t}),console.log("[MORBIS Ext] disimpan ke retry queue:",e.event,e.queue_number??"")}catch{}}async function ne(){try{return(await chrome.storage.local.get(c))[c]??[]}catch{return[]}}async function L(e){try{let n=((await chrome.storage.local.get(c))[c]??[]).filter(o=>o.event_id!==e);await chrome.storage.local.set({[c]:n})}catch{}}async function oe(){let e=await ne();if(e.length)for(let t of[...e])try{(await re(t)).ok&&(await L(t.event_id),console.log("[MORBIS Ext] retry queue sukses:",t.event,t.queue_number??""))}catch(n){let o=n.message??"";(o.includes("HTTP 404")||o.includes("HTTP 422"))&&(await L(t.event_id),console.log("[MORBIS Ext] retry queue buang (stale):",t.event,t.queue_number??"",o))}}async function re(e){let t={...e};e.event==="ENQUEUE"&&delete t.queue_number;let n=await C(),o=new AbortController,r=setTimeout(()=>o.abort(),8e3),i=await fetch(n+"/api/queue/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),cache:"no-store",credentials:"omit",signal:o.signal});if(clearTimeout(r),!i.ok)throw new Error("HTTP "+i.status);let a=await i.json();return{ok:!!a.ok,queue_number:a.queue?.queue_number}}setInterval(()=>{oe()},1e4);function O(e,t,n){return`${e}-${t}-${n}-${new Date().toISOString().slice(0,10)}`}function I(e,t=5e3){let n=document.documentElement,o=Date.now(),r=window.setInterval(()=>{let i=n.getAttribute("data-ext-antrian-farmasi");i==="1"?(window.clearInterval(r),e()):i==="0"?window.clearInterval(r):Date.now()-o>t&&(window.clearInterval(r),ie())},200)}function ie(){if(!document.body||document.getElementById("ext-feature-gate-notif"))return;let e=document.createElement("div");e.id="ext-feature-gate-notif",e.textContent="\u26A0\uFE0F Fitur antrian tidak aktif \u2014 muat ulang halaman (F5)",e.style.cssText="position:fixed;top:8px;right:8px;z-index:999999;background:#dc3545;color:#fff;padding:8px 16px;border-radius:6px;font:13px system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.2);",document.body.appendChild(e),setTimeout(()=>e.remove(),1e4)}var R="extensionConfig";function N(e,t,n){if(t?.extensionEnabled===!1)return!1;let o=t?.features?.[e];if(!o)return!0;if(o.enabled===!1)return!1;let r=n??t?.currentRole??"admin";if(r==="admin")return!0;let i=o.allowedRoles;return!Array.isArray(i)||i.length===0?!0:i.includes(r)}async function ae(e){try{let t=await chrome.runtime.sendMessage({type:"GET_CONFIG"});if(t?.config)return N(e,t.config)}catch{}try{let n=(await chrome.storage.local.get(R))?.[R]??null;return N(e,n)}catch{return!0}}function P(e,t){ae(e).then(n=>{if(n)try{t()}catch(o){console.error(`[featureGate:${e}] gagal jalan:`,o)}}).catch(n=>console.error(`[featureGate:${e}] gagal baca config:`,n))}var se="/v2/antrol/search",le="sub=update_v2",ce="/public/antrian-farmasi-v2/list-antrian-v2",E=null;if(window.__extPenerimaanAntrol)throw new Error("skip double inject penerimaanAntrolCetak");window.__extPenerimaanAntrol=!0;function u(...e){console.log("[MORBIS Ext] penerimaanAntrolCetak:",...e)}function G(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function M(e){let t=await fetch(`/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(e)}`,{credentials:"include",cache:"no-store"});if(!t.ok)throw new Error("data-resep-new HTTP "+t.status);return await t.json()}async function de(e){return(await fetch(`${se}?${le}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`id=${encodeURIComponent(e)}&taskid=6`,credentials:"include"})).ok}async function ue(){let e=await fetch(ce,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:"type=check_antrian",cache:"no-store",credentials:"include"});if(!e.ok)throw new Error("check_antrian HTTP "+e.status);let t=await e.json();if(!Array.isArray(t))throw new Error("bukan array");return t}function pe(e,t,n){let o=String(n??"");return e.find(r=>String(r.ID_PASIEN??"")!==String(t)?!1:o?String(r.WAKTU??"").slice(0,16)===o.slice(0,16):!0)}function ge(e){if(!e)return"";let t=(e.textContent||"").match(/Shift\s*:\s*([A-Za-z0-9]+)/i);return t?t[1]:""}function D(e){if(!e)return"";let t=(e.textContent||"").match(/\b[A-Z]{2,3}-\d+\b/);return t?t[0]:""}function fe(e){if(!e)return"";let t=e.querySelectorAll("td"),n="";for(let o of Array.from(t).slice(3,5)){let r=(o.textContent||"").trim();r.length>n.length&&!/^[0-9\s.:-]+$/.test(r)&&(n=r)}return n}function B(e,t){return(String(e.NAMA_PAS??e.NAMA_PASIEN??"").trim()||fe(t)).toUpperCase()}async function me(e){try{let t=await M(e),n=String(t.ID_VISIT??"");if(!n)throw new Error("ID_VISIT kosong");u("antrikan idVisit="+n,"resep",e);let o=await de(n);u("antrol",o?"OK":"gagal");let r=document.querySelector(`tr[id="${e}"]`),a=(r?Array.from(r.querySelectorAll("td")):[])[2],s=D(a)||"";if(!s){u("nomor native belum ada utk",n),alert("Nomor antrian belum terbit. Coba lagi.");return}u("nomor publik",s);let l=B(t,r),b=(async()=>{for(let g=0;g<3;g++){try{let d=await ue(),y=pe(d,String(t.ID_PASIEN??""),String(t.WAKTU_PENGAJUAN??""))??d.find(j=>String(j.ID??"")===n);if(y)return y}catch{}await new Promise(d=>setTimeout(d,200))}})(),H=S({event_id:O("enq",n,s)+"-"+Date.now().toString(36),event:"ENQUEUE",resep_id:e,nama_pasien:l,norm:String(t.ID_PASIEN??""),shift:"",jenis:"",counter:"",payload:{idVisit:n,unit:String(t.UNIT_TUJUAN_DEPO??""),waktu:String(t.WAKTU_PENGAJUAN??"")}}),[x,w]=await Promise.all([b,H]);w.ok||u("ENQUEUE app gagal (app tidak terjangkau?) \u2014 antrian tetap jalan di MORBIS");let p=w.queue_number||s;u("nomor publik",p);let q=x?.SHIFT||(a?ge(a):"")||"";if(a&&!a.hasAttribute("data-ext-code")){let g=a.querySelector("button"),d=g?g.outerHTML:"";a.innerHTML=`${G(p)}<br>Shift : ${G(q||"-")}`+(d?"<br>"+d:""),a.setAttribute("data-ext-code",p),a.setAttribute("data-ext-resep",e),F(a,p,e)}h({nomorResep:e,nama:l,jenis:x?.JENIS??"",unit:String(x?.NAMA_UNIT??t.UNIT_TUJUAN_DEPO??""),tanggal:String(t.WAKTU_PENGAJUAN??"").slice(0,10),code:p})}catch(t){u("gagal",t),alert("[MORBIS Ext] Gagal mengantrikan resep: "+String(t.message??t))}}function F(e,t,n){let o=e.querySelector("button");if(!o)return;let r=o.cloneNode(!0);r.textContent="\u{1F5A8} Cetak Kembali",r.title=t+" \u2014 cetak ulang kartu tanpa mengantrikan lagi",r.style.cssText="margin-top:4px;padding:3px 8px;font-size:11px;border:1px solid #0d6efd;background:#e7f1ff;color:#0d6efd;border-radius:6px;cursor:pointer;",r.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),(async()=>{try{let a=await M(n);h({nomorResep:n,nama:B(a,e.closest("tr")),jenis:"",unit:String(a.UNIT_TUJUAN_DEPO??""),tanggal:String(a.WAKTU_PENGAJUAN??"").slice(0,10),code:t})}catch(a){alert("[MORBIS Ext] Gagal cetak ulang: "+String(a.message??a))}})()}),o.replaceWith(r)}function m(){let e=window;if(!e.no_antrian||e.no_antrian.__ext)return;let t=e.no_antrian,n=o=>{me(String(o))};n.__ext=!0,e.no_antrian=n}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m,{once:!0}):m();window.setTimeout(m,1e3);window.setTimeout(m,3e3);function U(){try{document.querySelectorAll("tr[id]").forEach(e=>{let t=e.children[2];if(!t)return;let n=t.querySelector("button");if(!n||n.textContent?.includes("Cetak"))return;let o=t.getAttribute("data-ext-code")||D(t),r=e.getAttribute("id")||"";!o||!r||(t.setAttribute("data-ext-code",o),t.setAttribute("data-ext-resep",r),F(t,o,r))})}catch{}}P("penerimaanExport",()=>{I(()=>{U(),E=window.setInterval(U,4e3)})});window.addEventListener("beforeunload",()=>{E!==null&&clearInterval(E)});})();
