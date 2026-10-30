"use strict";var __morbis_feature=(()=>{var O='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',B=`
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
    --ext-font-family: ${O};
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
`,E=null;function V(){return E||(E=new CSSStyleSheet,E.replaceSync(B)),E}var P=!1;function W(){if(P||document.getElementById("ext-pjs-font"))return;P=!0;let l=document.createElement("link");l.id="ext-pjs-font",l.rel="stylesheet",l.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(l)}function j(l,o="open"){let f=l.attachShadow({mode:o});return f.adoptedStyleSheets=[V()],W(),f}var X=`
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
`,L=class extends HTMLElement{constructor(){super();let o=j(this);o.innerHTML=`
      <style>${X}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=o.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",o=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){o.stopPropagation(),o.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(o){(o==="disabled"||o==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",L);var F="extensionConfig";function Y(l,o,f){let b=o?.features?.[l];if(!b)return!0;if(b.enabled===!1)return!1;let y=f??o?.currentRole??"admin";if(y==="admin")return!0;let g=b.allowedRoles;return!Array.isArray(g)||g.length===0?!0:g.includes(y)}async function J(l){try{let f=(await chrome.storage.sync.get(F))?.[F]??null;return Y(l,f)}catch{return!0}}function z(l,o){J(l).then(f=>{if(f)try{o()}catch(b){console.error(`[featureGate:${l}] gagal jalan:`,b)}})}z("labHistory",function(){let l=t=>document.querySelector(t),o=t=>l(t)?.value?.trim()||"",f=null;function b(){return{idLab:new URLSearchParams(window.location.search).get("id_lab")||o('input[name="id_lab"]'),idVisit:o('input[name="id_visit"]'),idHasilLab:o('input[name="hasil[1][id]"]')}}async function y(t,e){try{let r=((await(await fetch(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${e}`,{credentials:"same-origin"})).text()).match(/<tr[^>]*>[\s\S]*?<\/tr>/g)||[]).find(c=>c.includes(`nolab="${t}"`));if(!r)return null;let s=r.match(/cetakFormPermintaanLab\(\s*(\d+)/)?.[1]||null,d=r.match(/edit_tanggal\(\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/)?.[1]||null;return s?{id:s,tgl:d}:null}catch{return null}}function g(t){window.open(t,"_blank")}let v=["dok_luar","nama_rs"],x={},w=null;function T(t){return t.toLowerCase().split(" ").map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function _(t){return document.querySelector(`[name="${t}"]`)}function A(t,e){let n=x[t];return n===void 0?(e&&(x[t]=e),!1):e===n?!1:e.toLowerCase()!==n.toLowerCase()?(x[t]=e,!1):e===T(n)?!0:(x[t]=e,!1)}function k(){try{for(let t of v){let e=_(t);e&&A(t,(e.value??"").trim())}}catch{}}function R(){try{for(let t of v){let e=_(t);e&&A(t,(e.value??"").trim())&&(e.value=x[t],window.console.info("[paKeepCase] "+t+" dikembalikan ke ejaan asli"))}}catch{}}function H(){let t=window.XMLHttpRequest.prototype;if(t.__extKeepPatched)return;t.__extKeepPatched=!0;let e=t.open,n=t.send;t.open=function(...i){try{let u=i[1];this.__extUrl=typeof u=="string"?u:String(u)}catch{}return e.apply(this,i)},t.send=function(...i){try{let u=this,r=i[0],s=u.__extUrl;if(Object.keys(x).length&&typeof s=="string"&&s.includes("pemeriksaan-pa")&&typeof r=="string"&&r.includes("dok_luar=")){let d=new URLSearchParams(r),c=!1;for(let a of v){let p=x[a],m=d.get(a);p&&m!==null&&m!==p&&m===T(p)&&(d.set(a,p),c=!0)}if(c)return window.console.info("[paKeepCase] payload dok_luar/nama_rs dikembalikan ke ejaan asli"),n.call(this,d.toString())}else if(Object.keys(x).length&&typeof s=="string"&&s.includes("pemeriksaan-pa")&&typeof FormData<"u"&&r instanceof FormData&&(r.has("dok_luar")||r.has("nama_rs")))for(let d of v){let c=x[d],a=r.get(d);c&&typeof a=="string"&&a!==c&&a===T(c)&&(window.console.info("[paKeepCase] payload FormData "+d+" dikembalikan"),r.set(d,c))}}catch{}return n.apply(this,i)}}function $(){let t=window;t.__paKeepCase||(t.__paKeepCase=!0,k(),document.addEventListener("input",e=>{let n=e.target;n&&typeof n.matches=="function"&&n.matches("input, textarea, select")&&k()},!0),document.addEventListener("focusout",()=>k(),!0),document.addEventListener("submit",()=>k(),!0),H(),w=window.setInterval(R,300),window.console.info("[paKeepCase] aktif di input-hasil-pa"))}function M(t,e){let n=document.createElement("div");n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999999;display:flex;align-items:center;justify-content:center;";let i=document.createElement("div");i.style.cssText="background:#fff;border-radius:8px;padding:16px 18px;min-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:Arial,sans-serif;";let u=document.createElement("div");u.textContent="Edit Tanggal Pengajuan",u.style.cssText="font-weight:700;font-size:14px;margin-bottom:10px;color:#1e293b;";let r=document.createElement("input");r.type="date",r.style.cssText="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;padding:10px;";let s=f?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);s&&(r.value=`${s[3]}-${s[2]}-${s[1]}`);let d=document.createElement("div");d.textContent="Server menerima dd/mm/yyyy hh:mm:ss \u2014 waktu diset otomatis ke 00:00:00.",d.style.cssText="font-size:11px;color:#64748b;margin:4px 0 12px;";let c=document.createElement("div");c.style.cssText="display:flex;justify-content:flex-end;";let a=document.createElement("button");a.type="button",a.textContent="Edit Tanggal",a.style.cssText="margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#2563eb;cursor:pointer;";let p=document.createElement("button");p.type="button",p.textContent="Batal",p.style.cssText="margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#dc2626;cursor:pointer;",a.addEventListener("click",async()=>{let m=r.value.trim();if(!m){alert("Isi tanggal pengajuan baru dulu.");return}let[h,G,U]=m.split("-"),D=`${U}/${G}/${h} 00:00:00`;a.disabled=!0,a.textContent="Menyimpan\u2026";let S;try{S=(await(await fetch("/laboratorium/control/edit_tanggal",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:new URLSearchParams({lab:t,id_visit:e,date:D,action:"edit"}).toString()})).json()).status==1}catch{S=!1}n.remove(),alert(S?"Edit Tanggal Pengajuan berhasil diubah.":"Gagal menyimpan tanggal baru."),S&&window.location.reload()}),p.addEventListener("click",()=>n.remove()),n.addEventListener("click",m=>{m.target===n&&n.remove()}),c.append(a,p),i.append(u,r,d,c),n.appendChild(i),document.body.appendChild(n),r.focus()}function K(){let t=Array.from(document.querySelectorAll("fieldset")).find(a=>a.textContent?.includes("Data Pasien"));if(!t)return;let e=document.querySelector("[data-ext-lab-actions]");e&&e.remove();let{idLab:n,idVisit:i,idHasilLab:u}=b();if(!n||!i||!u){console.warn("[inputHasilPa] Missing ids",{idLab:n,idVisit:i,idHasilLab:u});return}let r=document.createElement("div");r.setAttribute("data-ext-lab-actions","true"),r.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;";let s=(a,p,m)=>{let h=document.createElement("ext-btn");return h.setAttribute("variant",p),h.setAttribute("size","sm"),h.textContent=a,h.addEventListener("click",m),h},d=u;y(n,i).then(a=>{a?(d=a.id,f=a.tgl,console.log("[inputHasilPa] permintaan data",{idLab:n,idVisit:i,id:a.id,tgl:a.tgl})):console.warn("[inputHasilPa] Baris lab tidak ditemukan di daftar, pakai hasil[1][id].",{idLab:n,idVisit:i})}),r.append(s("Edit Tanggal Pengajuan","primary",()=>M(n,i)),s("Cetak","info",()=>g(`/laboratorium/print/hasil-lab?id=${n}&nolab=${n}`)),s("Cetak Form Permintaan Lab","secondary",()=>g(`/admisi/formulir-permintaan-labor/cetak?id=${d}&id_visit=${i}&jenis=cetak`)),s("Edit Form Permintaan Lab","secondary",()=>g(`/admisi/formulir-permintaan-labor/form?id=${d}&id_visit=undefined&jenis=edit`)),s("Halaman Asli Pengajuan Lab","ghost",()=>g(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${i}`)));let c=Array.from(document.querySelectorAll("fieldset")).find(a=>a.textContent?.includes("Tanggal Hasil"));if(c)c.after(r);else{let a=document.querySelector("form");a?a.appendChild(r):t.after(r)}}function C(){document.documentElement.getAttribute("data-ext-lab-history")&&($(),K())}let I=performance.now();(function t(){document.documentElement.getAttribute("data-ext-lab-history")?C():performance.now()-I<5e3&&setTimeout(t,200)})();let q=history.pushState;history.pushState=function(...t){q.apply(this,t),setTimeout(C,100)},window.addEventListener("popstate",()=>setTimeout(C,100)),window.addEventListener("pagehide",()=>{w!==null&&(clearInterval(w),w=null)})});})();
