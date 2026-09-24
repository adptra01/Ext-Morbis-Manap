"use strict";var __morbis_feature=(()=>{var D='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',O=`
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
    --ext-font-family: ${D};
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
`,w=null;function B(){return w||(w=new CSSStyleSheet,w.replaceSync(O)),w}var _=!1;function V(){if(_||document.getElementById("ext-pjs-font"))return;_=!0;let f=document.createElement("link");f.id="ext-pjs-font",f.rel="stylesheet",f.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(f)}function A(f,l="open"){let b=f.attachShadow({mode:l});return b.adoptedStyleSheets=[B()],V(),b}var W=`
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
`,T=class extends HTMLElement{constructor(){super();let l=A(this);l.innerHTML=`
      <style>${W}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=l.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",l=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){l.stopPropagation(),l.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(l){(l==="disabled"||l==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",T);(function(){let f=t=>document.querySelector(t),l=t=>f(t)?.value?.trim()||"",b=null;function P(){return{idLab:new URLSearchParams(window.location.search).get("id_lab")||l('input[name="id_lab"]'),idVisit:l('input[name="id_visit"]'),idHasilLab:l('input[name="hasil[1][id]"]')}}async function j(t,e){try{let o=((await(await fetch(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${e}`,{credentials:"same-origin"})).text()).match(/<tr[^>]*>[\s\S]*?<\/tr>/g)||[]).find(d=>d.includes(`nolab="${t}"`));if(!o)return null;let i=o.match(/cetakFormPermintaanLab\(\s*(\d+)/)?.[1]||null,s=o.match(/edit_tanggal\(\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/)?.[1]||null;return i?{id:i,tgl:s}:null}catch{return null}}function g(t){window.open(t,"_blank")}let h=["dok_luar","nama_rs"],m={},y=null;function S(t){return t.toLowerCase().split(" ").map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function L(t){return document.querySelector(`[name="${t}"]`)}function C(t,e){let n=m[t];return n===void 0?(e&&(m[t]=e),!1):e===n?!1:e.toLowerCase()!==n.toLowerCase()?(m[t]=e,!1):e===S(n)?!0:(m[t]=e,!1)}function v(){try{for(let t of h){let e=L(t);e&&C(t,(e.value??"").trim())}}catch{}}function z(){try{for(let t of h){let e=L(t);e&&C(t,(e.value??"").trim())&&(e.value=m[t],window.console.info("[paKeepCase] "+t+" dikembalikan ke ejaan asli"))}}catch{}}function H(){let t=window.XMLHttpRequest.prototype;if(t.__extKeepPatched)return;t.__extKeepPatched=!0;let e=t.open,n=t.send;t.open=function(...r){try{let c=r[1];this.__extUrl=typeof c=="string"?c:String(c)}catch{}return e.apply(this,r)},t.send=function(...r){try{let c=this,o=r[0],i=c.__extUrl;if(Object.keys(m).length&&typeof i=="string"&&i.includes("pemeriksaan-pa")&&typeof o=="string"&&o.includes("dok_luar=")){let s=new URLSearchParams(o),d=!1;for(let a of h){let u=m[a],p=s.get(a);u&&p!==null&&p!==u&&p===S(u)&&(s.set(a,u),d=!0)}if(d)return window.console.info("[paKeepCase] payload dok_luar/nama_rs dikembalikan ke ejaan asli"),n.call(this,s.toString())}else if(Object.keys(m).length&&typeof i=="string"&&i.includes("pemeriksaan-pa")&&typeof FormData<"u"&&o instanceof FormData&&(o.has("dok_luar")||o.has("nama_rs")))for(let s of h){let d=m[s],a=o.get(s);d&&typeof a=="string"&&a!==d&&a===S(d)&&(window.console.info("[paKeepCase] payload FormData "+s+" dikembalikan"),o.set(s,d))}}catch{}return n.apply(this,r)}}function M(){let t=window;t.__paKeepCase||(t.__paKeepCase=!0,v(),document.addEventListener("input",e=>{let n=e.target;n&&typeof n.matches=="function"&&n.matches("input, textarea, select")&&v()},!0),document.addEventListener("focusout",()=>v(),!0),document.addEventListener("submit",()=>v(),!0),H(),y=window.setInterval(z,300),window.console.info("[paKeepCase] aktif di input-hasil-pa"))}function $(t,e){let n=document.createElement("div");n.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999999;display:flex;align-items:center;justify-content:center;";let r=document.createElement("div");r.style.cssText="background:#fff;border-radius:8px;padding:16px 18px;min-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:Arial,sans-serif;";let c=document.createElement("div");c.textContent="Edit Tanggal Pengajuan",c.style.cssText="font-weight:700;font-size:14px;margin-bottom:10px;color:#1e293b;";let o=document.createElement("input");o.type="date",o.style.cssText="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;padding:10px;";let i=b?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);i&&(o.value=`${i[3]}-${i[2]}-${i[1]}`);let s=document.createElement("div");s.textContent="Server menerima dd/mm/yyyy hh:mm:ss \u2014 waktu diset otomatis ke 00:00:00.",s.style.cssText="font-size:11px;color:#64748b;margin:4px 0 12px;";let d=document.createElement("div");d.style.cssText="display:flex;justify-content:flex-end;";let a=document.createElement("button");a.type="button",a.textContent="Edit Tanggal",a.style.cssText="margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#2563eb;cursor:pointer;";let u=document.createElement("button");u.type="button",u.textContent="Batal",u.style.cssText="margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#dc2626;cursor:pointer;",a.addEventListener("click",async()=>{let p=o.value.trim();if(!p){alert("Isi tanggal pengajuan baru dulu.");return}let[x,I,q]=p.split("-"),U=`${q}/${I}/${x} 00:00:00`;a.disabled=!0,a.textContent="Menyimpan\u2026";let k=!1;try{k=(await(await fetch("/laboratorium/control/edit_tanggal",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:new URLSearchParams({lab:t,id_visit:e,date:U,action:"edit"}).toString()})).json()).status==1}catch{k=!1}n.remove(),alert(k?"Edit Tanggal Pengajuan berhasil diubah.":"Gagal menyimpan tanggal baru."),k&&window.location.reload()}),u.addEventListener("click",()=>n.remove()),n.addEventListener("click",p=>{p.target===n&&n.remove()}),d.append(a,u),r.append(c,o,s,d),n.appendChild(r),document.body.appendChild(n),o.focus()}function R(){let t=Array.from(document.querySelectorAll("fieldset")).find(a=>a.textContent?.includes("Data Pasien"));if(!t)return;let e=document.querySelector("[data-ext-lab-actions]");e&&e.remove();let{idLab:n,idVisit:r,idHasilLab:c}=P();if(!n||!r||!c){console.warn("[inputHasilPa] Missing ids",{idLab:n,idVisit:r,idHasilLab:c});return}let o=document.createElement("div");o.setAttribute("data-ext-lab-actions","true"),o.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;";let i=(a,u,p)=>{let x=document.createElement("ext-btn");return x.setAttribute("variant",u),x.setAttribute("size","sm"),x.textContent=a,x.addEventListener("click",p),x},s=c;j(n,r).then(a=>{a?(s=a.id,b=a.tgl,console.log("[inputHasilPa] permintaan data",{idLab:n,idVisit:r,id:a.id,tgl:a.tgl})):console.warn("[inputHasilPa] Baris lab tidak ditemukan di daftar, pakai hasil[1][id].",{idLab:n,idVisit:r})}),o.append(i("Edit Tanggal Pengajuan","primary",()=>$(n,r)),i("Cetak","info",()=>g(`/laboratorium/print/hasil-lab?id=${n}&nolab=${n}`)),i("Cetak Form Permintaan Lab","secondary",()=>g(`/admisi/formulir-permintaan-labor/cetak?id=${s}&id_visit=${r}&jenis=cetak`)),i("Edit Form Permintaan Lab","secondary",()=>g(`/admisi/formulir-permintaan-labor/form?id=${s}&id_visit=undefined&jenis=edit`)),i("Halaman Asli Pengajuan Lab","ghost",()=>g(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${r}`)));let d=Array.from(document.querySelectorAll("fieldset")).find(a=>a.textContent?.includes("Tanggal Hasil"));if(d)d.after(o);else{let a=document.querySelector("form");a?a.appendChild(o):t.after(o)}}function E(){document.documentElement.getAttribute("data-ext-lab-history")&&(M(),R())}let K=performance.now();(function t(){document.documentElement.getAttribute("data-ext-lab-history")?E():performance.now()-K<5e3&&setTimeout(t,200)})();let F=history.pushState;history.pushState=function(...t){F.apply(this,t),setTimeout(E,100)},window.addEventListener("popstate",()=>setTimeout(E,100)),window.addEventListener("pagehide",()=>{y!==null&&(clearInterval(y),y=null)})})();})();
