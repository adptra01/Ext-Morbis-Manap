"use strict";var __morbis_feature=(()=>{var V='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',W=`
  :host {
    /* Brand */
    --ext-primary: #00875a;
    --ext-primary-hover: #007049;
    --ext-primary-soft: #e6f4ef;

    /* Semantic */
    --ext-success: #027a48;
    --ext-success-soft: #e8f6ef;
    --ext-warning: #b54708;
    --ext-warning-soft: #fdf1e3;
    --ext-danger: #d92d20;
    --ext-danger-hover: #b42318;
    --ext-danger-soft: #fdeceb;
    --ext-info: #175cd3;
    --ext-info-soft: #e8f0fd;

    /* Surface */
    --ext-bg: #f4f6f8;
    --ext-surface: #ffffff;
    --ext-surface-2: #f8fafc;
    --ext-border: #d0d5dd;

    /* Text \u2014 kontras tinggi untuk keterbacaan usia 30-40 */
    --ext-text: #1c2530;
    --ext-text-secondary: #475467;
    --ext-text-muted: #667085;
    --ext-text-on-primary: #ffffff;

    /* Typography \u2014 lebih besar dari default, untuk mudah dibaca */
    --ext-font-family: ${V};
    --ext-font-size-xs: 12px;
    --ext-font-size-sm: 13px;
    --ext-font-size-md: 15px;
    --ext-font-size-lg: 17px;
    --ext-font-size-xl: 20px;
    --ext-line-height: 1.5;

    /* Radius */
    --ext-radius-sm: 6px;
    --ext-radius-md: 10px;
    --ext-radius-lg: 14px;

    /* Spacing */
    --ext-space-1: 4px;
    --ext-space-2: 8px;
    --ext-space-3: 12px;
    --ext-space-4: 16px;
    --ext-space-5: 20px;
    --ext-space-6: 24px;
    --ext-space-8: 32px;

    /* Shadow */
    --ext-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
    --ext-shadow-md: 0 6px 20px rgba(16, 24, 40, 0.1);
    --ext-shadow-lg: 0 20px 50px rgba(16, 24, 40, 0.18);

    /* Focus ring \u2014 terlihat jelas, penting utk usability */
    --ext-ring: 0 0 0 3px rgba(0, 135, 90, 0.35);

    /* Motion */
    --ext-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --ext-duration-fast: 140ms;
    --ext-duration-normal: 220ms;
  }
`,E=null;function X(){return E||(E=new CSSStyleSheet,E.replaceSync(W)),E}var j=!1;function Y(){if(j||document.getElementById("ext-pjs-font"))return;j=!0;let s=document.createElement("link");s.id="ext-pjs-font",s.rel="stylesheet",s.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(s)}function R(s,i="open"){let f=s.attachShadow({mode:i});return f.adoptedStyleSheets=[X()],Y(),f}var J=`
  :host { display: inline-block; }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ext-space-2);
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    line-height: 1.2;
    border: 1px solid transparent;
    border-radius: var(--ext-radius-md);
    padding: 10px 18px;
    cursor: pointer;
    transition: background-color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      transform var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
    min-height: 42px;
    white-space: nowrap;
  }
  button:hover:not(:disabled) { transform: translateY(-1px); }
  button:active:not(:disabled) { transform: translateY(0); }
  button:focus-visible { outline: none; box-shadow: var(--ext-ring); }
  button:disabled { opacity: 0.55; cursor: not-allowed; }

  /* sizes */
  :host([size='sm']) button { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; border-radius: var(--ext-radius-sm); }
  :host([size='lg']) button { font-size: var(--ext-font-size-lg); padding: 13px 24px; min-height: 50px; }

  /* variants */
  :host([variant='primary']) button { background: var(--ext-primary); color: var(--ext-text-on-primary); }
  :host([variant='primary']) button:hover:not(:disabled) { background: var(--ext-primary-hover); }
  :host([variant='danger']) button { background: var(--ext-danger); color: var(--ext-text-on-primary); }
  :host([variant='danger']) button:hover:not(:disabled) { background: var(--ext-danger-hover); }
  :host([variant='success']) button { background: var(--ext-success); color: var(--ext-text-on-primary); }
  :host([variant='secondary']) button { background: var(--ext-surface); color: var(--ext-text); border-color: var(--ext-border); }
  :host([variant='secondary']) button:hover:not(:disabled) { background: var(--ext-surface-2); }
  :host([variant='ghost']) button { background: transparent; color: var(--ext-primary); }
  :host([variant='ghost']) button:hover:not(:disabled) { background: var(--ext-primary-soft); }
  :host([variant='ghost-danger']) button { background: transparent; color: var(--ext-danger); }
  :host([variant='ghost-danger']) button:hover:not(:disabled) { background: var(--ext-danger-soft); }

  /* loading spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ext-spin 0.7s linear infinite;
    display: none;
  }
  :host([loading]) .spinner { display: inline-block; }
  :host([loading]) button { pointer-events: none; opacity: 0.8; }
  @keyframes ext-spin { to { transform: rotate(360deg); } }
`,_=class extends HTMLElement{constructor(){super();let i=R(this);i.innerHTML=`
      <style>${J}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=i.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",i=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){i.stopPropagation(),i.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(i){(i==="disabled"||i==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}},L=typeof window<"u"?window.customElements:null;if(L)try{L.get("ext-btn")||L.define("ext-btn",_)}catch(s){console.warn("[MORBIS Ext] gagal registrasi ext-btn:",s)}var F="extensionConfig";function N(s,i,f){let b=i?.features?.[s];if(!b)return!0;if(b.enabled===!1)return!1;let y=f??i?.currentRole??"admin";if(y==="admin")return!0;let g=b.allowedRoles;return!Array.isArray(g)||g.length===0?!0:g.includes(y)}async function Q(s){try{let f=(await chrome.storage.sync.get(F))?.[F]??null;return N(s,f)}catch{return!0}}function H(s,i){Q(s).then(f=>{if(f)try{i()}catch(b){console.error(`[featureGate:${s}] gagal jalan:`,b)}})}H("labHistory",function(){let s=t=>document.querySelector(t),i=t=>s(t)?.value?.trim()||"",f=null;function b(){return{idLab:new URLSearchParams(window.location.search).get("id_lab")||i('input[name="id_lab"]'),idVisit:i('input[name="id_visit"]'),idHasilLab:i('input[name="hasil[1][id]"]')}}async function y(t,e){try{let r=((await(await fetch(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${e}`,{credentials:"same-origin"})).text()).match(/<tr[^>]*>[\s\S]*?<\/tr>/g)||[]).find(u=>u.includes(`nolab="${t}"`));if(!r)return null;let l=r.match(/cetakFormPermintaanLab\(\s*(\d+)/)?.[1]||null,d=r.match(/edit_tanggal\(\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/)?.[1]||null;return l?{id:l,tgl:d}:null}catch{return null}}function g(t){window.open(t,"_blank")}let v=["dok_luar","nama_rs"],x={},w=null;function C(t){return t.toLowerCase().split(" ").map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function A(t){return document.querySelector(`[name="${t}"]`)}function P(t,e){let n=x[t];return n===void 0?(e&&(x[t]=e),!1):e===n?!1:e.toLowerCase()!==n.toLowerCase()?(x[t]=e,!1):e===C(n)?!0:(x[t]=e,!1)}function k(){try{for(let t of v){let e=A(t);e&&P(t,(e.value??"").trim())}}catch{}}function z(){try{for(let t of v){let e=A(t);e&&P(t,(e.value??"").trim())&&(e.value=x[t],window.console.info("[paKeepCase] "+t+" dikembalikan ke ejaan asli"))}}catch{}}function M(){let t=window.XMLHttpRequest.prototype;if(t.__extKeepPatched)return;t.__extKeepPatched=!0;let e=t.open,n=t.send;t.open=function(...o){try{let c=o[1];this.__extUrl=typeof c=="string"?c:String(c)}catch{}return e.apply(this,o)},t.send=function(...o){try{let c=this,r=o[0],l=c.__extUrl;if(Object.keys(x).length&&typeof l=="string"&&l.includes("pemeriksaan-pa")&&typeof r=="string"&&r.includes("dok_luar=")){let d=new URLSearchParams(r),u=!1;for(let a of v){let p=x[a],m=d.get(a);p&&m!==null&&m!==p&&m===C(p)&&(d.set(a,p),u=!0)}if(u)return window.console.info("[paKeepCase] payload dok_luar/nama_rs dikembalikan ke ejaan asli"),n.call(this,d.toString())}else if(Object.keys(x).length&&typeof l=="string"&&l.includes("pemeriksaan-pa")&&typeof FormData<"u"&&r instanceof FormData&&(r.has("dok_luar")||r.has("nama_rs")))for(let d of v){let u=x[d],a=r.get(d);u&&typeof a=="string"&&a!==u&&a===C(u)&&(window.console.info("[paKeepCase] payload FormData "+d+" dikembalikan"),r.set(d,u))}}catch{}return n.apply(this,o)}}function $(){let t=window;t.__paKeepCase||(t.__paKeepCase=!0,k(),document.addEventListener("input",e=>{let n=e.target;n&&typeof n.matches=="function"&&n.matches("input, textarea, select")&&k()},!0),document.addEventListener("focusout",()=>k(),!0),document.addEventListener("submit",()=>k(),!0),M(),w=window.setInterval(z,300),window.console.info("[paKeepCase] aktif di input-hasil-pa"))}function K(t,e){let n=document.createElement("div");n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999999;display:flex;align-items:center;justify-content:center;";let o=document.createElement("div");o.style.cssText="background:#fff;border-radius:8px;padding:16px 18px;min-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:Arial,sans-serif;";let c=document.createElement("div");c.textContent="Edit Tanggal Pengajuan",c.style.cssText="font-weight:700;font-size:14px;margin-bottom:10px;color:#1e293b;";let r=document.createElement("input");r.type="date",r.style.cssText="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;padding:10px;";let l=f?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);l&&(r.value=`${l[3]}-${l[2]}-${l[1]}`);let d=document.createElement("div");d.textContent="Server menerima dd/mm/yyyy hh:mm:ss \u2014 waktu diset otomatis ke 00:00:00.",d.style.cssText="font-size:11px;color:#64748b;margin:4px 0 12px;";let u=document.createElement("div");u.style.cssText="display:flex;justify-content:flex-end;";let a=document.createElement("button");a.type="button",a.textContent="Edit Tanggal",a.style.cssText="margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#2563eb;cursor:pointer;";let p=document.createElement("button");p.type="button",p.textContent="Batal",p.style.cssText="margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#dc2626;cursor:pointer;",a.addEventListener("click",async()=>{let m=r.value.trim();if(!m){alert("Isi tanggal pengajuan baru dulu.");return}let[h,O,D]=m.split("-"),B=`${D}/${O}/${h} 00:00:00`;a.disabled=!0,a.textContent="Menyimpan\u2026";let S;try{S=(await(await fetch("/laboratorium/control/edit_tanggal",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:new URLSearchParams({lab:t,id_visit:e,date:B,action:"edit"}).toString()})).json()).status==1}catch{S=!1}n.remove(),alert(S?"Edit Tanggal Pengajuan berhasil diubah.":"Gagal menyimpan tanggal baru."),S&&window.location.reload()}),p.addEventListener("click",()=>n.remove()),n.addEventListener("click",m=>{m.target===n&&n.remove()}),u.append(a,p),o.append(c,r,d,u),n.appendChild(o),document.body.appendChild(n),r.focus()}function I(){let t=Array.from(document.querySelectorAll("fieldset")).find(a=>a.textContent?.includes("Data Pasien"));if(!t)return;let e=document.querySelector("[data-ext-lab-actions]");e&&e.remove();let{idLab:n,idVisit:o,idHasilLab:c}=b();if(!n||!o||!c){console.warn("[inputHasilPa] Missing ids",{idLab:n,idVisit:o,idHasilLab:c});return}let r=document.createElement("div");r.setAttribute("data-ext-lab-actions","true"),r.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;";let l=(a,p,m)=>{let h=document.createElement("ext-btn");return h.setAttribute("variant",p),h.setAttribute("size","sm"),h.textContent=a,h.addEventListener("click",m),h},d=c;y(n,o).then(a=>{a?(d=a.id,f=a.tgl,console.log("[inputHasilPa] permintaan data",{idLab:n,idVisit:o,id:a.id,tgl:a.tgl})):console.warn("[inputHasilPa] Baris lab tidak ditemukan di daftar, pakai hasil[1][id].",{idLab:n,idVisit:o})}),r.append(l("Edit Tanggal Pengajuan","primary",()=>K(n,o)),l("Cetak","info",()=>g(`/laboratorium/print/hasil-lab?id=${n}&nolab=${n}`)),l("Cetak Form Permintaan Lab","secondary",()=>g(`/admisi/formulir-permintaan-labor/cetak?id=${d}&id_visit=${o}&jenis=cetak`)),l("Edit Form Permintaan Lab","secondary",()=>g(`/admisi/formulir-permintaan-labor/form?id=${d}&id_visit=undefined&jenis=edit`)),l("Halaman Asli Pengajuan Lab","ghost",()=>g(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${o}`)));let u=Array.from(document.querySelectorAll("fieldset")).find(a=>a.textContent?.includes("Tanggal Hasil"));if(u)u.after(r);else{let a=document.querySelector("form");a?a.appendChild(r):t.after(r)}}function q(){try{let t=Array.from(document.querySelectorAll("label"));for(let e of t){let n=(e.textContent||"").trim();/^(cara|care)\s+peroleh(an)?$/i.test(n)&&(e.textContent="Cara Perolehan")}if(!t.some(e=>(e.textContent||"").trim()==="Cara Perolehan")){let e=document.querySelector('#cara_peroleh, textarea[name="cara_peroleh"]');if(e){let o=e.parentElement?.querySelectorAll("span, div");if(o){for(let c of Array.from(o))if(/^(cara|care)\s+peroleh(an)?$/i.test((c.textContent||"").trim())){c.textContent="Cara Perolehan";break}}}}}catch{}}function T(){document.documentElement.getAttribute("data-ext-lab-history")&&($(),q(),I())}let G=performance.now();(function t(){document.documentElement.getAttribute("data-ext-lab-history")?T():performance.now()-G<5e3&&setTimeout(t,200)})();let U=history.pushState;history.pushState=function(...t){U.apply(this,t),setTimeout(T,100)},window.addEventListener("popstate",()=>setTimeout(T,100)),window.addEventListener("pagehide",()=>{w!==null&&(clearInterval(w),w=null)})});})();
