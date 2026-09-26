"use strict";var __morbis_feature=(()=>{var I={background:"#ffffff",foreground:"#0a0a0e",card:"#ffffff",cardForeground:"#0a0a0e",primary:"#2469f0",primaryForeground:"#f8fafc",primaryHover:"#1d58cc",secondary:"#f1f5f9",secondaryForeground:"#1e293b",muted:"#f1f5f9",mutedForeground:"#64748b",accent:"#f1f5f9",accentForeground:"#1e293b",destructive:"#ef4444",destructiveForeground:"#f8fafc",border:"#e2e8f0",input:"#e2e8f0",ring:"#2469f0",success:"#1b8a4b",successBg:"#eaf6ef",warning:"#c47a1a",warningBg:"#fef4e4",error:"#ef4444",errorBg:"#fef2f2",info:"#2469f0",infoBg:"#eef3ff"};var Oe=new Set;function fe(e,a){if(Oe.has(e)){let s=document.getElementById(e);if(s)return s}let n=document.createElement("style");return n.id=e,n.textContent=a,document.head.appendChild(n),Oe.add(e),n}fe("ext-shared-animations",`
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);var Ht=/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/,jt=/^[0-9]{2}(\.[0-9]{1,2})?$/,Ot=/^(\d{1,3})\/(\d{1,3})$/,Bt=/^\d+(\.\d+)?$/;function v(e){let a=e.trim();return a===""||/^[-–—]+$/.test(a)}function z(e){return Ht.test(e.trim().toUpperCase())}function ee(e){return jt.test(e.trim())}function ge(e){let a=e.trim().replace(/\s+/g,""),n=Ot.exec(a);if(!n)return!1;let s=parseInt(n[1],10),l=parseInt(n[2],10);return s>=50&&s<=250&&l>=20&&l<=160}function L(e,a,n){let s=e.trim().replace(",",".");if(!Bt.test(s))return!1;let l=parseFloat(s);return!isNaN(l)&&l>=a&&l<=n}function he(e){return/[\p{L}\p{N}]/u.test(e)}var Pt='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',$t=`
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
    --ext-font-family: ${Pt};
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
`,ne=null;function Dt(){return ne||(ne=new CSSStyleSheet,ne.replaceSync($t)),ne}var Be=!1;function Ft(){if(Be||document.getElementById("ext-pjs-font"))return;Be=!0;let e=document.createElement("link");e.id="ext-pjs-font",e.rel="stylesheet",e.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(e)}function re(e,a="open"){let n=e.attachShadow({mode:a});return n.adoptedStyleSheets=[Dt()],Ft(),n}var Vt=`
  :host { display: none; }
  :host([open]) { display: block; }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(2px);
    animation: ext-fade var(--ext-duration-normal) var(--ext-ease);
    padding: var(--ext-space-6);
  }
  .modal {
    width: 520px;
    max-width: 100%;
    background: var(--ext-surface);
    border-radius: var(--ext-radius-lg);
    box-shadow: var(--ext-shadow-lg);
    overflow: hidden;
    animation: ext-slide-up var(--ext-duration-normal) var(--ext-ease);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ext-space-4);
    padding: var(--ext-space-5) var(--ext-space-6);
    border-bottom: 1px solid var(--ext-border);
  }
  .title {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-lg);
    font-weight: 700;
    color: var(--ext-text);
    margin: 0;
  }
  .close {
    appearance: none;
    border: none;
    background: var(--ext-surface-2);
    color: var(--ext-text-secondary);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--ext-duration-fast) var(--ext-ease), color var(--ext-duration-fast) var(--ext-ease);
  }
  .close:hover { background: var(--ext-danger-soft); color: var(--ext-danger); }
  .close:focus-visible { outline: none; box-shadow: var(--ext-ring); }

  .body {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text-secondary);
    padding: var(--ext-space-6);
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ext-space-3);
    padding: 0 var(--ext-space-6) var(--ext-space-6);
  }
  /* tombol utama di dalam modal memakai komponen ext-btn \u2014 styling via atribut host */
  ::slotted(*) { font-family: var(--ext-font-family); }

  /* variant accent line */
  :host([variant='danger']) .header { box-shadow: inset 4px 0 0 var(--ext-danger); }
  :host([variant='success']) .header { box-shadow: inset 4px 0 0 var(--ext-success); }
  :host([variant='info']) .header { box-shadow: inset 4px 0 0 var(--ext-info); }
  :host([variant='warning']) .header { box-shadow: inset 4px 0 0 var(--ext-warning); }

  @keyframes ext-fade { from { opacity: 0; } }
  @keyframes ext-slide-up {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
  }
`,xe=class extends HTMLElement{constructor(){super();this.handleKey=n=>{n.key==="Escape"&&this.hasAttribute("open")&&this.cancel()};this.root=re(this),this.root.innerHTML=`
      <style>${Vt}</style>
      <div class="overlay">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="header">
            <h3 class="title"><slot name="title"></slot></h3>
            <button class="close" part="close" aria-label="Tutup">&times;</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `}connectedCallback(){let n=this.root.querySelector(".overlay");this.root.querySelector(".close").addEventListener("click",()=>this.cancel()),n.addEventListener("click",l=>{l.target===n&&this.cancel()}),document.addEventListener("keydown",this.handleKey)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKey)}get titleSlot(){return this.querySelector('[slot="title"]')}get footerSlot(){return this.querySelector('[slot="footer"]')}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}cancel(){this.dispatchEvent(new CustomEvent("ext-cancel")),this.close()}ok(){this.dispatchEvent(new CustomEvent("ext-ok"))}};customElements.get("ext-modal")||customElements.define("ext-modal",xe);var Nt=`
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
`,be=class extends HTMLElement{constructor(){super();let a=re(this);a.innerHTML=`
      <style>${Nt}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=a.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",a=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){a.stopPropagation(),a.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(a){(a==="disabled"||a==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",be);function ve(e){return new Promise(a=>{let n=document.createElement("ext-modal");n.setAttribute("variant",e.variant??"warning"),e.okLabel&&n.setAttribute("ok-label",e.okLabel),e.cancelLabel&&n.setAttribute("cancel-label",e.cancelLabel),e.hideCancel&&n.setAttribute("hide-cancel",""),n.innerHTML=`<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;let s=n.querySelector('[slot="title"]');s.textContent=e.title;let l=n.querySelector(".ext-confirm-body");if(e.icon){let f=document.createElement("div");f.className="ext-confirm-icon",f.textContent=e.icon,l.appendChild(f)}e.message&&e.message.split(`
`).forEach((b,y)=>{y>0&&l.appendChild(document.createElement("br")),l.appendChild(document.createTextNode(b))}),n.querySelector("[data-ext-confirm-ok]").textContent=e.okLabel??"Lanjut";let m=n.querySelector("[data-ext-confirm-ok]");m.setAttribute("variant",e.variant==="danger"?"danger":"primary"),e.hideCancel?n.querySelector("[data-ext-confirm-cancel]")?.remove():n.querySelector("[data-ext-confirm-cancel]").textContent=e.cancelLabel??"Batal",m.addEventListener("click",()=>n.ok()),e.hideCancel||n.querySelector("[data-ext-confirm-cancel]").addEventListener("click",()=>n.cancel());let x=f=>{n.remove(),a(f)};n.addEventListener("ext-ok",()=>x(!0)),n.addEventListener("ext-cancel",()=>x(!1)),document.body.appendChild(n),n.open()})}var Pe="morbis_preop_markers";function $e(){try{if(typeof window<"u"&&window.localStorage)return window.localStorage}catch{}return null}function Kt(e,a=Date.now()){let n={},s=0;for(let[l,m]of Object.entries(e))m&&m.markedAt&&a-m.markedAt<=2592e6?n[l]=m:s++;return{purged:n,count:s}}function De(e=$e(),a=Date.now()){if(!e)return{};try{let n=e.getItem(Pe);if(!n)return{};let s=JSON.parse(n);if(typeof s!="object"||s===null)return{};let{purged:l,count:m}=Kt(s,a),x=0;for(let f of Object.keys(l)){let b=l[f];b&&((b.norm!==void 0||b.nama!==void 0||b.noReg!==void 0)&&x++,l[f]=zt(b))}return(m>0||x>0)&&Ut(l,e),l}catch{return{}}}function zt(e){return{idVisit:e.idVisit,markedAt:e.markedAt}}function Ut(e,a=$e()){if(a)try{a.setItem(Pe,JSON.stringify(e))}catch{}}var qt="http://dev.rsudkotajambi.id/rs",Jt="ext-farmasi-app-base";var Xt=["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"],Wt=".rsudkotajambi.id";var Gt=["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"],Fe="Fitur nonaktif: server Reports menggunakan HTTP (belum mendukung HTTPS)";function G(e){try{let a=new URL(e??Y());if(a.protocol==="https:")return null;let n=a.hostname.toLowerCase();return Gt.includes(n)?null:Fe}catch{return Fe}}function Yt(e){try{let a=new URL(e);if(a.protocol!=="http:"&&a.protocol!=="https:")return!1;let n=a.hostname.toLowerCase();return Xt.includes(n)?!0:n.endsWith(Wt)}catch{return!1}}function Y(){try{let e=localStorage.getItem(Jt);if(e&&Yt(e))return e.replace(/\/+$/,"")}catch{}return qt}async function Qt(e,a,n=fetch){let s=new AbortController,l=globalThis.setTimeout(()=>s.abort(),25e3);try{return await n(e,{...a,signal:s.signal})}finally{globalThis.clearTimeout(l)}}async function Zt(e,a=fetch){try{let n=Y(),s=G(n);if(s)return console.warn("[casemixApi]",s,"\u2014 baca pusat dilewati:",e),null;let l=await Qt(n+e,{cache:"no-store",credentials:"omit",headers:{Accept:"application/json"}},a);return l.ok?await l.json():null}catch{return null}}async function Ve(e,a,n=fetch){if(!e)return[];let s="/api/reports/resume-history?id_visit="+encodeURIComponent(e)+(a?"&tipe="+a:""),l=await Zt(s,n);return!l?.ok||!Array.isArray(l.data)?[]:l.data}function en(){try{let e=globalThis.crypto;if(e&&typeof e.randomUUID=="function")return e.randomUUID()}catch{}return`${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}function q(){try{if(typeof window<"u"&&window.localStorage)return window.localStorage}catch{}return null}var Je="ext_rv_history_",tn=Je,Xe="ext_rv_lastform_",ye="ext_migrated_rv_",We=50;function ke(e,a){return`${Je}${a==="ranap"?"ri":"rj"}_${e||"unknown"}`}function Ge(e,a){return`${Xe}${a==="ranap"?"ri":"rj"}_${e||"unknown"}`}function ae(e,a){if(!e)return null;try{let n=e.getItem(a);return n?JSON.parse(n):null}catch{return null}}function _e(e,a,n){if(e)try{e.setItem(a,JSON.stringify(n))}catch{}}function nn(e,a){return JSON.stringify(e??null)===JSON.stringify(a??null)}function Ye(e,a){let n={};return Object.keys(e).forEach(s=>n[s]=!0),Object.keys(a).forEach(s=>n[s]=!0),Object.keys(n).filter(s=>!nn(e[s],a[s]))}function Ne(e){let a=e===void 0?"-":JSON.stringify(e);return a.length>60?a.slice(0,60)+"\u2026":a}function U(e,a,n=q()){let s=ae(n,ke(e,a)),l=Array.isArray(s)?s:[];if(a==="ranap"){let m=ae(n,tn+e);if(Array.isArray(m)&&m.length>0&&l.length===0){let x=m.map(f=>({...f,tipe:"ranap"}));return Ee(x,e,"ranap",n),x}}return l}function Ee(e,a,n,s=q()){_e(s,ke(a,n),e.slice(-We))}function Qe(e,a,n=q()){let s=ae(n,Ge(e,a));return s||(a==="ranap"?ae(n,Xe+e):null)}function ie(e,a,n,s=q()){_e(s,Ge(a,n),e)}function rn(){try{let e=document.getElementById("userpanel");if(e){let m="",x="";if(e.querySelectorAll(".subgroup").forEach(y=>{let T=(y.querySelector(".subtitle")?.textContent||"").trim().toLowerCase(),S=(y.querySelector(".subcontent")?.textContent||"").trim();T==="username"&&S&&(m=S),T==="role"&&S&&(x=S)}),m)return`${m}${x?` (${x})`:""}`;let b=(e.querySelector("a")?.textContent||"").trim();if(b&&b!=="Petugas Rumah Sakit")return b}let n=(document.querySelector("#petugas, .petugas, .username, #username, .user-name")?.textContent||"").trim();if(n)return n.slice(0,80);let s=document.querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')?.value?.trim();if(s)return s.slice(0,80);let l=document.querySelector('input[name="id_user"], #id_user')?.value?.trim();if(l)return`User #${l}`}catch{}return"petugas"}var an="/api/reports/resume-history";function on(){return Y()}function sn(e){return ye+e}function ln(e,a){if(!e)return 0;try{let n=e.getItem(a);if(n===null)return 0;let s=Number(JSON.parse(n));return Number.isFinite(s)?s:0}catch{return 0}}function un(e,a,n,s){if(!(!e||!a))try{let l=sn(ke(a,n));s>ln(e,l)&&_e(e,l,s)}catch{}}function cn(e,a,n=fetch,s=q(),l=e.tipe){let m={client_id:e.client_id??null,id_visit:a,id_resume:e.id_resume,aksi:e.aksi,tipe:e.tipe,waktu:new Date(e.at).toISOString(),user:e.user,before:e.before,after:e.after,changed:e.changed},x=async()=>{try{let f=on(),b=G(f);return b?(console.warn("[resumeHistory]",b,"\u2014 kirim resume dilewati:",a),!1):(await n(f+an,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(m),keepalive:!0,credentials:"omit"})).ok?(un(s,a,l,e.at),!0):!1}catch{return!1}};try{return x()}catch{return Promise.resolve(!1)}}var Ke=null,ze=0;function Ze(e){if(!e.idVisit)return null;let a=e.now??Date.now(),n=e.store??q();ie(e.after,e.idVisit,e.tipe,n);let s=JSON.stringify([e.idVisit,e.aksi,e.after]);if(Ke===s&&a-ze<5e3)return null;Ke=s,ze=a;let l={at:a,aksi:e.aksi,id_resume:e.idResume??"",user:e.user??rn(),tipe:e.tipe,before:e.before??{},after:e.after,changed:Ye(e.before??{},e.after),client_id:en()},m=U(e.idVisit,e.tipe,n);m.push(l),Ee(m,e.idVisit,e.tipe,n),ie(e.after,e.idVisit,e.tipe,n);try{cn(l,e.idVisit,e.fetcher??fetch,n,e.tipe)}catch{}return l}function et(e){try{let a=document.createElement("div");a.textContent=e,a.style.cssText="position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;font-size:16px!important;line-height:1.6!important;font-family:"+tt+"!important;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;",document.body.appendChild(a),setTimeout(()=>a.remove(),4e3)}catch{}}function dn(e){if(e!=null){if(typeof e=="string")return e;if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e))return e.map(a=>{if(typeof a=="string")return a;try{return JSON.stringify(a)??""}catch{return""}});try{return JSON.stringify(e)??""}catch{return""}}}function Ue(e){let a={};if(!e||typeof e!="object"||Array.isArray(e))return a;for(let n of Object.keys(e)){let s=dn(e[n]);s!==void 0&&(a[n]=s)}return a}function pn(e,a){try{if(!e||typeof e!="object")return null;let n=e.waktu?Date.parse(e.waktu):NaN;if(!Number.isFinite(n))return null;let s=Ue(e.after),l=Ue(e.before),m=e.tipe==="rajal"?"rajal":e.tipe==="ranap"?"ranap":a,x=Array.isArray(e.changed)?e.changed.filter(b=>typeof b=="string"):Ye(l,s),f=typeof e.client_id=="string"&&e.client_id?e.client_id:void 0;return{at:n,aksi:e.aksi==="buat"?"buat":"ubah",id_resume:typeof e.id_resume=="string"?e.id_resume:"",user:typeof e.user=="string"&&e.user?e.user:"petugas",tipe:m,before:l,after:s,changed:x,...f?{client_id:f}:{}}}catch{return null}}function qe(e){if(e.client_id)return"cid:"+e.client_id;try{return"h:"+e.at+"|"+e.user+"|"+e.aksi+"|"+JSON.stringify(e.after)}catch{return"h:"+e.at+"|"+e.user+"|"+e.aksi}}function mn(e,a){let n=new Set(e.map(qe)),s=e.slice();for(let l of a){let m=qe(l);n.has(m)||(n.add(m),s.push(l))}return s.sort((l,m)=>l.at-m.at),s.slice(-We)}var tt="'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif";function nt(e){try{document.querySelector("#ext-rv-history-overlay")?.remove()}catch{}let a=e.store??q(),n=U(e.idVisit,e.tipe,a).slice().reverse(),s=e.zIndex??99998,l=document.createElement("div");l.id="ext-rv-history-overlay",l.style.cssText=`position:fixed;inset:0;z-index:${s};background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px;`,l.addEventListener("click",function(S){S.target===l&&l.remove()});let m=document.createElement("div");m.style.cssText="background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;font-size:16px!important;line-height:1.6!important;color:#1c2530;font-family:"+tt+"!important;",l.appendChild(m);let x=document.createElement("div");x.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;";let f=document.createElement("span");f.textContent=`${e.title??"Riwayat Resume"} (${n.length})`,x.appendChild(f);let b=document.createElement("button");b.type="button",b.textContent="\xD7",b.style.cssText="border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;font-family:inherit!important;font-size:16px!important;line-height:1!important;cursor:pointer;",b.onclick=function(){l.remove()},x.appendChild(b),m.appendChild(x);let y=document.createElement("div");y.style.cssText="padding:14px 18px;overflow-y:auto;",m.appendChild(y);let T=S=>{if(n=S,f.textContent=`${e.title??"Riwayat Resume"} (${n.length})`,y.replaceChildren(),!n.length){y.textContent="Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.";return}n.forEach(function(k,j){let P=n.length-j,R=document.createElement("div");R.style.cssText="border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;";let $=document.createElement("div");$.style.fontWeight="600";let J=k.user?` \u2014 oleh ${k.user}`:"";$.textContent=`#${P} \u2014 ${new Date(k.at).toLocaleString("id-ID")} \u2014 ${k.aksi==="buat"?"Buat baru":"Ubah"}${J} \u2014 ${k.changed.length} field berubah`,R.appendChild($);let O=document.createElement("div");O.style.cssText="display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;",k.changed.length?O.textContent=k.changed.map(function(F){return F+": "+Ne(k.before[F])+" \u2192 "+Ne(k.after[F])}).join(`
`):O.textContent="Tidak ada perbedaan field.",R.appendChild(O);let D=document.createElement("div");D.style.cssText="margin-top:8px;display:flex;gap:8px;";let M=document.createElement("button");M.type="button",M.textContent="Lihat",M.style.cssText="border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;",M.onclick=function(){O.style.display=O.style.display==="none"?"block":"none"},D.appendChild(M);let B=document.createElement("button");B.type="button",B.textContent="Salin ke Form",B.style.cssText="background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;",B.onclick=function(){try{e.onApply(k.after),l.remove()}catch{}},D.appendChild(B),R.appendChild(D),y.appendChild(R)})};T(n);try{document.body.appendChild(l)}catch{}if(e.idVisit){let S=G();if(S)try{let k=document.createElement("div");k.textContent=S+" \u2014 riwayat hanya dari PC ini.",k.style.cssText="margin-top:10px;padding:8px 10px;background:#fef3c7;color:#92400e;border-radius:6px;font-size:13px;line-height:1.5;",y.appendChild(k)}catch{}else try{Ve(e.idVisit,e.tipe).then(k=>{try{if(!k.length||!l.isConnected)return;let j=[];for(let $ of k){let J=pn($,e.tipe);J&&j.push(J)}if(!j.length)return;let P=U(e.idVisit,e.tipe,a),R=mn(P,j);if(R.length===P.length)return;Ee(R,e.idVisit,e.tipe,a),T(R.slice().reverse());try{document.dispatchEvent(new CustomEvent("ext-rv-history-merged",{detail:{idVisit:e.idVisit,tipe:e.tipe,count:R.length}}))}catch{}}catch{}})}catch{}}}var rt="ext_migrated_preop_ids",at=ye,Se=20;function it(e,a){if(!e)return null;try{let n=e.getItem(a);return n?JSON.parse(n):null}catch{return null}}function ot(e,a,n){if(e)try{e.setItem(a,JSON.stringify(n))}catch{}}function fn(){try{if(typeof window<"u"&&window.localStorage)return window.localStorage}catch{}return null}async function Te(e,a,n=fetch){let s=Y(),l=G(s);if(l)return console.warn("[casemixBackfill]",l,"\u2014 backfill dilewati:",e),!1;try{return(await n(s+e,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(a),credentials:"omit"})).ok}catch{return!1}}function gn(e,a){let n=new Set(a);return Object.keys(e).filter(s=>!n.has(s)).slice(0,Se)}function hn(e,a){return e.filter(n=>n.at>a).slice(0,Se)}function xn(e){let a=[];if(!e)return a;try{let n=[],s=e;if(typeof s.length=="number"&&s.key)for(let l=0;l<s.length;l++){let m=s.key(l);m&&n.push(m)}for(let l of n){let m=l.match(/^ext_rv_history_(ri|rj)_(.+)$/);if(m){a.push({key:l,idVisit:m[2],tipe:m[1]==="ri"?"ranap":"rajal"});continue}m=l.match(/^ext_rv_history_(.+)$/),m&&!m[1].startsWith("ri_")&&!m[1].startsWith("rj_")&&a.push({key:l,idVisit:m[1],tipe:"ranap"})}}catch{}return a}async function bn(e=fn(),a=fetch){let n={preopUploaded:0,resumeUploaded:0,offline:!1};if(!e)return n;try{let s=De(e),l=it(e,rt)??[],m=gn(s,l);for(let x of m){let f=s[x];if(!f)continue;if(!await Te("/api/casemix/pre-op/toggle",{id_visit:x,marked:!0,norm:f.norm??null,nama:f.nama??null,no_reg:f.noReg??null,user:null},a)){n.offline=!0;break}l.push(x),n.preopUploaded++}try{let x=new Set(Object.keys(s)),f=[];for(let b of l){if(x.has(b)){f.push(b);continue}if(n.offline){f.push(b);continue}await Te("/api/casemix/pre-op/toggle",{id_visit:b,marked:!1},a)?n.preopUploaded++:(n.offline=!0,f.push(b))}(f.length!==l.length||n.preopUploaded>0)&&ot(e,rt,f)}catch{}}catch{n.offline=!0}try{for(let{key:s,idVisit:l,tipe:m}of xn(e)){if(!l||l==="unknown")continue;if(n.resumeUploaded>=Se)break;let x=it(e,at+s)??0,f=U(l,m,e),b=hn(f,x),y=x;for(let T of b){if(!await Te("/api/reports/resume-history",{client_id:T.client_id??null,id_visit:l,id_resume:T.id_resume,aksi:T.aksi,tipe:T.tipe??m,waktu:new Date(T.at).toISOString(),user:T.user,before:T.before,after:T.after,changed:T.changed},a)){n.offline=!0;break}y=Math.max(y,T.at),n.resumeUploaded++}if(y>x&&ot(e,at+s,y),n.offline)break}}catch{n.offline=!0}try{(n.preopUploaded||n.resumeUploaded)&&window.console.debug(`[casemixBackfill] diunggah: ${n.preopUploaded} pre-op, ${n.resumeUploaded} resume`)}catch{}return n}var st=null;function lt(){if(st!==null)return;let e=()=>{try{if(document.hidden)return}catch{}bn().catch(()=>{})};window.setTimeout(e,5e3),st=window.setInterval(e,3e4)}(function(){let a=0,n=setInterval(function(){a++;let t=document.documentElement.getAttribute("data-ext-resume-validator"),i=document.documentElement.getAttribute("data-ext-resume-history");if(t!==null||i!==null){clearInterval(n);let r=t==="1",u=i==="1"||r;if(!r&&!u)return;l(r,u)}else a>=100&&clearInterval(n)},50);function s(){let t=window.location.pathname;return t.includes("/tambah-resume-ri")||t.includes("/edit-resume-ri")?"ranap":t.includes("/rm-rawat-jalan-new")?"rajal":null}function l(t,i){let r=s();if(!r)return;let u=setInterval(function(){let o=document.getElementById("save"),c=r==="ranap"?document.querySelector('form[action*="rawat-inap-resume"], form[action*="edit-resume-rawat-inap"]'):document.querySelector('form#formdata, form[action*="rm-rawat-jalan"]');o&&c&&(clearInterval(u),m(c,o,r,t,i))},200)}function m(t,i,r,u,o){x();try{lt()}catch{}if(o&&f(t,r,u),!u){o&&we(t,i,r);return}Lt(r),r==="ranap"&&(D("ranap")||(O(),R(t))),dt(),pt(),bt(),mt(r),ft(),gt(),vt(r),yt(r),ct(t),we(t,i,r)}function x(){fe("ext-rv-css",[`.ext-rv-error { border: 2px solid ${I.error} !important; background: ${I.errorBg} !important; transition: all 0.2s; }`,".ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }",`.ext-rv-toast-error { background: ${I.errorBg}; color: #991b1b; border-left: 5px solid ${I.error}; }`,`.ext-rv-toast-success { background: ${I.successBg}; color: #065f46; border-left: 5px solid ${I.success}; }`,`.ext-rv-icd-valid { border: 2px solid ${I.success} !important; background: ${I.successBg} !important; }`,`.ext-rv-icd-invalid { border: 2px solid ${I.error} !important; background: ${I.errorBg} !important; }`].join(`
`))}function f(t,i,r){let u=window;if(i==="rajal"){let p=typeof u.simpan=="function"?u.simpan:null;if(p&&!p.__extWrapped){let h=function(...g){if(r&&!Q(i))return!1;F(t,i),X=!1;try{localStorage.removeItem(S())}catch{}return p.apply(this,g)};h.__extWrapped=!0,u.simpan=h}}else r&&(u.cekForm=function(){return Q(i)});t.onsubmit!==null&&(t.onsubmit=function(p){let h=r?Q(i):!0;return!h&&p?p.preventDefault():F(t,i),h});let o=u.jQuery;r&&typeof o=="object"&&o&&typeof o.fn?.on=="function"&&o.fn.on("submit",function(p){return Q(i)?!0:(p.preventDefault(),!1)});var c=t.submit.bind(t);t.submit=function(){if(!(r&&!Q(i))){F(t,i),X=!1,$();try{localStorage.removeItem(S())}catch{}c()}}}let b="ext_draft_resume_";var y=null,T=4320*60*1e3;function S(){let t=d("id_visit");return b+(t||"unknown")}var k=null,j=2e3;function P(t,i){return function(){k&&clearTimeout(k),k=setTimeout(t,i)}}function R(t){var i=function(){J(t)},r=t.querySelectorAll("input, textarea, select");r.forEach(function(u){u.addEventListener("change",P(i,j)),u.addEventListener("input",P(i,j))}),y=setInterval(i,3e4)}function $(){y!==null&&(clearInterval(y),y=null)}function J(t){let i=S(),r=new FormData(t),u={};r.forEach(function(o,c){u[c]=o.toString()}),u._saved_at=Date.now().toString();try{localStorage.setItem(i,JSON.stringify({savedAt:Date.now(),data:u}))}catch{}}async function O(){let t=S(),i=null;try{i=localStorage.getItem(t)}catch{return}if(!i)return;let r;try{r=JSON.parse(i)}catch{return}if(typeof r.savedAt!="number"||typeof r.data!="object"||r.data===null||Date.now()-r.savedAt>=T){try{localStorage.removeItem(t)}catch{}return}let o=r.data,c=function(){for(let h in o){if(h==="_saved_at")continue;let g=document.querySelector('[name="'+h+'"]');g&&!g.value&&(g.value=o[h])}try{localStorage.removeItem(t)}catch{}};if(await ve({title:"Draft Ditemukan",message:"Data draft sebelumnya ditemukan. Pulihkan?",variant:"info",okLabel:"Pulihkan",cancelLabel:"Hapus"}))c();else try{localStorage.removeItem(t)}catch{}}function D(t){let i=t==="rajal"?"id_rawat_jalan":"id_resume_inap",r=document.getElementById(i);return!!r&&!!r.value}var M=null;function B(){return d("id_visit")}function F(t,i){let r=Le(t),u=B(),o=d(i==="rajal"?"id_rawat_jalan":"id_resume_inap"),c=D(i)?"ubah":"buat",p=Qe(u,i)||{};Ze({idVisit:u,idResume:o,tipe:i,aksi:c,before:p,after:r}),te(u,i)}function we(t,i,r){let u=B();if(ie(Le(t),u,r),te(u,r),M||!i.parentElement)return;let o=document.createElement("button");o.type="button",o.id="ext-rv-history-btn",o.textContent="Riwayat",o.style.cssText="margin-left:8px;border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:13px;",o.onclick=function(){nt({idVisit:u,tipe:r,title:r==="rajal"?"Riwayat Resume Rajal":"Riwayat Resume Rawat Inap",zIndex:99998,onApply:function(c){ut(t,c)}})},i.parentElement.insertBefore(o,i.nextSibling),M=o,te(u,r),window.addEventListener("ext-rv-history-merged",function(c){try{let p=c.detail;p&&p.idVisit===u&&p.tipe===r&&te(u,r)}catch{}})}function te(t,i){if(!M)return;let r=U(t,i).length;M.textContent=r>0?"Riwayat ("+r+")":"Riwayat"}function Le(t){let i={},r=/^(kode_|diagnosa_|tindakan\d+$|nosokomial\d+$|kode\d+$|kode9\d+$)/;return t.querySelectorAll("input[name], textarea[name], select[name], input[id]:not([name]):not([type=button]):not([type=submit]), textarea[id]:not([name]), select[id]:not([name])").forEach(function(o){let p=o.getAttribute("name")||(r.test(o.id)?o.id:"");if(!p||p==="_saved_at"||p==="save")return;if(o instanceof HTMLInputElement&&(o.type==="checkbox"||o.type==="radio")){if(!o.checked)return;let g=i[p];g===void 0?i[p]=o.value:Array.isArray(g)?g.push(o.value):i[p]=[g,o.value];return}if(o instanceof HTMLSelectElement&&o.multiple){i[p]=Array.from(o.selectedOptions).map(function(g){return g.value});return}let h=i[p];h!==void 0&&!Array.isArray(h)?i[p]=[h,o.value]:Array.isArray(h)?h.push(o.value):i[p]=o.value}),i}function ut(t,i){let r=0,u=0;Object.keys(i).forEach(function(o){let c=i[o],p=Array.from(t.querySelectorAll('[name="'+o+'"]'));if(!p.length){let g=t.querySelector("#"+CSS.escape(o));p=g?[g]:[]}if(!p.length){u++;return}let h=Array.isArray(c)?c:[c];p.forEach(function(g,C){if(g instanceof HTMLInputElement&&(g.type==="checkbox"||g.type==="radio"))g.checked=Array.isArray(c)?c.indexOf(g.value)>=0:g.value===c;else if(g instanceof HTMLSelectElement&&g.multiple){let _=Array.isArray(c)?c:[c];Array.from(g.options).forEach(function(w){w.selected=_.indexOf(w.value)>=0})}else g.value=h[C]??"";g.dispatchEvent(new Event("input",{bubbles:!0})),g.dispatchEvent(new Event("change",{bubbles:!0})),r++})}),et("Disalin "+r+" field"+(u>0?", "+u+" nama tak ditemukan":"")+". Periksa lalu klik Simpan.")}let X=!1;function ct(t){var i=t.querySelectorAll("input, textarea, select");i.forEach(function(r){r.addEventListener("change",function(){X=!0}),r.addEventListener("input",function(){X=!0})}),t.addEventListener("submit",function(){X=!1}),window.addEventListener("beforeunload",function(r){if(X)return r.preventDefault(),r.returnValue="Data yang belum disimpan akan hilang.",r.returnValue})}function dt(){[{id:"suhu_pulang",min:30,max:45,step:.1},{id:"suhu",min:30,max:45,step:.1},{id:"nadi_pulang",min:20,max:250,step:1},{id:"nadi",min:20,max:250,step:1},{id:"rr_pulang",min:4,max:80,step:1},{id:"nafas",min:4,max:80,step:1},{id:"spo2_pulang",min:50,max:100,step:1},{id:"spo2",min:50,max:100,step:1},{id:"gcs_e",min:1,max:4,step:1},{id:"gcs_m",min:1,max:6,step:1},{id:"gcs_v",min:1,max:5,step:1},{id:"tinggi",min:30,max:250,step:1},{id:"berat",min:1,max:500,step:.1}].forEach(function(i){var r=document.getElementById(i.id);if(r){var u=r.value.trim();(u==="-"||u===""||isNaN(Number(u)))&&(r.value=""),r.type="number",r.min=String(i.min),r.max=String(i.max),r.step=String(i.step),r.placeholder||(r.placeholder=i.min+"-"+i.max)}})}function pt(){var t=["td_pulang","td","tensi","tensi_pulang"];t.forEach(function(i){var r=document.getElementById(i);r&&(r.placeholder="120/80",r.pattern="[0-9]{2,3}/[0-9]{2,3}",r.title="Format: angka/angka (Contoh: 120/80)")})}function mt(t){var i=t==="rajal"?["anamnesa","catatan","terapi_pengobatan","jenis_kasus","tindak_lanjut"]:["alasan_rawat","anamnesa","diagnosa_primary","kode_diagnosa_utama","jenis_kasus","keadaan_keluar","cara_keluar","tgl_keluar2"];i.forEach(function(r){var u=document.getElementById(r);u&&(u.required=!0)})}function ft(){document.querySelectorAll('input:not([type="submit"]):not([type="button"])').forEach(function(t){t.addEventListener("keydown",function(i){i.key==="Enter"&&i.preventDefault()})})}function gt(){document.querySelectorAll("textarea").forEach(function(t){t.style.overflow="hidden",t.style.resize="vertical",t.addEventListener("input",function(){t.style.height="auto",t.style.height=t.scrollHeight+"px"})})}let ht=["td_pulang","tensi","nadi_pulang","suhu_pulang","rr_pulang","spo2_pulang","gcs_e","gcs_m","gcs_v"];function xt(){let t=document.getElementById("keadaan_keluar")?.value||"",i=document.getElementById("cara_keluar")?.value||"";return[t,i,document.getElementById("keadaan_keluar")?.options[document.getElementById("keadaan_keluar")?.selectedIndex??0]?.text||"",document.getElementById("cara_keluar")?.options[document.getElementById("cara_keluar")?.selectedIndex??0]?.text||""].some(u=>/meninggal/i.test(u))}function oe(){let t=xt();ht.forEach(function(i){var r=document.getElementById(i);r&&(t?(r.value&&!r.dataset.originalValue&&(r.dataset.originalValue=r.value),r.value="",r.disabled=!0,r.style.backgroundColor="#f5f5f5",r.style.color="#999",r.title="Otomatis kosong: pasien meninggal dunia"):(r.dataset.originalValue&&(r.value=r.dataset.originalValue,delete r.dataset.originalValue),r.disabled=!1,r.style.backgroundColor="",r.style.color="",r.title=""))})}function bt(){let t=document.getElementById("keadaan_keluar"),i=document.getElementById("cara_keluar");oe(),t&&t.addEventListener("change",oe),i&&i.addEventListener("change",oe)}function vt(t){var i=Re(t),r=Ie(t);i.forEach(function(u){let o=document.getElementById(u);o&&o.addEventListener("input",function(){var c=o.value.trim();o.classList.remove("ext-rv-icd-valid","ext-rv-icd-invalid"),c!==""&&(/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(c)?o.classList.add("ext-rv-icd-valid"):o.classList.add("ext-rv-icd-invalid"))})}),r.forEach(function(u){let o=document.getElementById(u);o&&o.addEventListener("input",function(){var c=o.value.trim();o.classList.remove("ext-rv-icd-valid","ext-rv-icd-invalid"),c!==""&&(/^[0-9]{2}(\.[0-9]{1,2})?$/.test(c)?o.classList.add("ext-rv-icd-valid"):o.classList.add("ext-rv-icd-invalid"))})})}function yt(t){var i=Re(t);i.forEach(function(u){let o=document.getElementById(u);o&&o.addEventListener("blur",function(){var c=o.value.trim().toUpperCase();c&&(c=c.replace(".",""),c.length>3&&(c=c.substring(0,3)+"."+c.substring(3)),o.value=c,o.dispatchEvent(new Event("input")))})});var r=Ie(t);r.forEach(function(u){let o=document.getElementById(u);o&&o.addEventListener("blur",function(){var c=o.value.trim();c&&(c=c.replace(".",""),c.length>2&&(c=c.substring(0,2)+"."+c.substring(2)),o.value=c,o.dispatchEvent(new Event("input")))})})}function Re(t){if(t==="rajal"){let u=[];if(document.querySelectorAll('input[name="kode10[]"]').forEach(function(c){c.id&&u.push(c.id)}),u.length)return u;let o=[];for(let c=1;c<=20;c++)o.push("kode"+c);return o}for(var i=["kode_diagnosa_utama"],r=1;r<=10;r++)i.push("kode_diagnosa_sekunder"+r);return i}function Ie(t){if(t==="rajal"){let u=[];if(document.querySelectorAll('input[name="kode9[]"]').forEach(function(c){c.id&&u.push(c.id)}),u.length)return u;let o=[];for(let c=1;c<=20;c++)o.push("kode9"+c);return o}for(var i=[],r=1;r<=10;r++)i.push("kode_tindakan"+r);return i}function Q(t){Et();var i=[];function r(o,c,p){o||i.push({msg:c,id:p})}function u(o,c){let p=d(o);v(p)||he(p)||r(!1,c+" tidak boleh hanya berisi simbol atau karakter khusus",o)}return t==="rajal"?_t(r,u):kt(r,u),i.length>0?(Tt(i),!1):!0}function kt(t,i){t(!!d("norm"),"No. RM harus diisi","norm"),t(!!d("pasien"),"Nama pasien harus diisi","pasien"),t(!!d("id_visit"),"Data kunjungan tidak valid","pasien"),i("alasan_rawat","Alasan rawat"),i("anamnesa","Anamnesa"),i("diagnosa_primary","Diagnosa primary"),i("terapi_pengobatan","Terapi/pengobatan"),t(!!d("kode_diagnosa_utama"),"Kode ICD-10 Diagnosa Utama harus diisi","kode_diagnosa_utama"),d("kode_diagnosa_utama")&&!v(d("kode_diagnosa_utama"))&&t(z(d("kode_diagnosa_utama")),"Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)","kode_diagnosa_utama"),d("diagnosa_utama")&&!se("kode_diagnosa_utama",z)&&t(!!d("id_diagnosa_utama"),"Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)","diagnosa_utama");for(var r=1;r<=10;r++){var u=d("kode_diagnosa_sekunder"+r),o=d("diagnosa_sekunder"+r),c=d("id_diagnosa_sekunder"+r);u&&!v(u)&&t(z(u),"Format kode ICD-10 Diagnosa Sekunder "+r+" tidak valid","kode_diagnosa_sekunder"+r),o&&!v(o)&&!se("kode_diagnosa_sekunder"+r,z)&&t(!!c,"Diagnosa Sekunder "+r+" harus dipilih dari hasil pencarian","diagnosa_sekunder"+r)}for(var p=1;p<=10;p++){var h=d("kode_tindakan"+p),g=d("tindakan"+p),C=d("id_tindakan"+p);h&&!v(h)&&t(ee(h),"Format kode ICD-9 Tindakan "+p+" tidak valid (contoh: 45.16)","kode_tindakan"+p),g&&!v(g)&&!se("kode_tindakan"+p,ee)&&t(!!C,"Tindakan "+p+" harus dipilih dari hasil pencarian (autocomplete)","tindakan"+p)}var _=d("td_pulang")||d("tensi");_&&!v(_)&&t(ge(_),"Tekanan darah pulang tidak valid (contoh: 120/80)",d("td_pulang")?"td_pulang":"tensi");var w=d("keadaan_keluar"),E=w&&/meninggal\s*dunia/i.test(w),A=d("nadi_pulang");!E&&A&&!v(A)&&t(L(A,20,250),"Nadi pulang harus 20-250","nadi_pulang");var V=d("suhu_pulang");!E&&V&&!v(V)&&t(L(V,30,45),"Suhu pulang harus 30-45\xB0C","suhu_pulang");var N=d("rr_pulang");!E&&N&&!v(N)&&t(L(N,4,120),"RR pulang harus 4-120","rr_pulang");var H=d("spo2_pulang");!E&&H&&!v(H)&&t(L(H,50,100),"SpO2 pulang harus 50-100%","spo2_pulang"),t(!!d("jenis_kasus"),"Jenis kasus harus dipilih","jenis_kasus"),t(!!d("keadaan_keluar"),"Keadaan keluar harus dipilih","keadaan_keluar"),t(!!d("cara_keluar"),"Cara keluar harus dipilih","cara_keluar"),t(!!(d("tgl_keluar2")||d("tgl_keluar")),"Tanggal keluar harus diisi","tgl_keluar2");var ue=d("gcs_e");!E&&ue&&!v(ue)&&t(L(ue,1,4),"GCS Eye harus 1-4","gcs_e");var ce=d("gcs_m");!E&&ce&&!v(ce)&&t(L(ce,1,6),"GCS Motor harus 1-6","gcs_m");var W=d("gcs_v");!E&&W&&!v(W)&&t(L(W,1,5),"GCS Verbal harus 1-5","gcs_v");var de=d("gcs_e"),pe=d("gcs_m");if(!E&&de&&pe&&W&&!v(de)&&!v(pe)&&!v(W)){var Ce=Number(de)+Number(pe)+Number(W);t(L(String(Ce),3,15),"Total GCS (E+M+V) harus 3-15, saat ini "+Ce,"gcs_v")}var Rt=Z("pasien_rujuk_masuk_opsi").toLowerCase();Rt==="ya"&&t(le("pasien_rujuk_masuk"),"Alasan Datang poin A: pilih asal rujukan masuk","pasien_rujuk_masuk_opsi-ya");var It=Z("pasien_rujuk_dikembalikan_opsi").toLowerCase();It==="ya"&&t(le("pasien_rujuk_dikembalikan"),"Alasan Datang poin B: pilih asal rujukan dikembalikan","pasien_rujuk_dikembalikan_opsi-ya");var Ct=Z("pasien_dirujuk_keluar_opsi").toLowerCase();Ct==="ya"&&t(le("pasien_rujuk_keluar"),"Alasan Datang poin C: pilih rujukan keluar","pasien_dirujuk_keluar_opsi-ya");var Mt=Z("menggunakan_kb_opsi").toLowerCase();Mt==="ya"&&(t(!!d("jenis_kb"),"Pelayanan KB: jenis KB harus dipilih","jenis_kb"),t(!!d("waktu_kb"),"Pelayanan KB: waktu KB harus dipilih","waktu_kb"),t(wt(".monitoring_kb"),"Pelayanan KB: pilih minimal satu monitoring KB","monitoring_kb-komplikasi_kb"));var At=Z("cek_status_covid").toLowerCase();At==="1"&&t(!!d("status_covid"),"Status COVID: pilih jenis COVID","status_covid");var Me=d("tgl_masuk")||d("tgl_masuk2"),Ae=d("tgl_keluar2")||d("tgl_keluar");if(Me&&Ae){let me=function(He){let K=He.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}):(\d{2}))?/);if(K)return new Date(+K[3],+K[2]-1,+K[1],+(K[4]||0),+(K[5]||0),+(K[6]||0)).getTime();let je=Date.parse(He);return isNaN(je)?0:je};var vn=me;t(me(Ae)>=me(Me),"Tanggal keluar tidak boleh sebelum tanggal masuk","tgl_keluar2")}}function _t(t,i){t(!!d("id_visit"),"Data kunjungan tidak valid","id_visit"),t(!!d("nama_pasien"),"Nama pasien harus diisi","nama_pasien"),i("anamnesa","Anamnesa"),i("catatan","Catatan diagnosa"),i("terapi_pengobatan","Terapi/pengobatan"),["pemeriksaan_fisik","tindakan","planning"].forEach(function(_){let w=d(_);w&&!v(w)&&!he(w)&&t(!1,(_==="pemeriksaan_fisik"?"Pemeriksaan fisik":_==="planning"?"Planning":"Tindakan")+" tidak boleh hanya berisi simbol atau karakter khusus",_)}),document.querySelectorAll('input[name="kode10[]"]').forEach(function(_,w){let E=(_.value||"").trim(),A=_.closest("tr"),V=(A?.querySelector('input[name="idicd[]"]')?.value||"").trim(),N=(A?.querySelector('input[name="nama[]"]')?.value||"").trim(),H=_.id||`kode10-${w}`;E&&!v(E)&&!z(E)&&t(!1,"Format kode ICD-10 baris "+(w+1)+" tidak valid (contoh: A00, B20.9)",H),(!v(E)||!v(N))&&!V&&!z(E)&&t(!1,"Diagnosa baris "+(w+1)+" harus dipilih dari hasil pencarian (autocomplete)",H)}),document.querySelectorAll('input[name="kode9[]"]').forEach(function(_,w){let E=(_.value||"").trim(),A=_.closest("tr"),V=(A?.querySelector('input[name="idicdTindakan[]"]')?.value||"").trim(),N=(A?.querySelector('input[name="namaTindakan[]"]')?.value||"").trim(),H=_.id||`kode9-${w}`;E&&!v(E)&&!ee(E)&&t(!1,"Format kode ICD-9 Tindakan baris "+(w+1)+" tidak valid (contoh: 45.16)",H),(!v(E)||!v(N))&&!V&&!ee(E)&&t(!1,"Tindakan baris "+(w+1)+" harus dipilih dari hasil pencarian (autocomplete)",H)});let u=d("tensi");u&&!v(u)&&t(ge(u),"Tekanan darah tidak valid (contoh: 120/80)","tensi");let o=d("nadi");o&&!v(o)&&t(L(o,20,250),"Nadi harus 20-250","nadi");let c=d("suhu");c&&!v(c)&&t(L(c,30,45),"Suhu harus 30-45\xB0C","suhu");let p=d("nafas");p&&!v(p)&&t(L(p,4,80),"Nafas harus 4-80","nafas");let h=d("spo2");h&&!v(h)&&t(L(h,50,100),"SpO2 harus 50-100%","spo2");let g=d("tinggi");g&&!v(g)&&t(L(g,30,250),"Tinggi badan harus 30-250 cm","tinggi");let C=d("berat");C&&!v(C)&&t(L(C,1,500),"Berat badan harus 1-500 kg","berat"),t(!!d("jenis_kasus"),"Jenis kasus harus dipilih","jenis_kasus"),t(!!d("tindak_lanjut"),"Tindak lanjut harus dipilih","tindak_lanjut")}function Et(){document.querySelectorAll(".ext-rv-error").forEach(function(t){t.classList.remove("ext-rv-error")})}function Tt(t){var i=t[0];let r=document.getElementById(i.id);r&&(r.focus(),r.classList.add("ext-rv-error"),setTimeout(function(){r.classList.remove("ext-rv-error")},3e3));for(var u=1;u<t.length;u++){var o=document.getElementById(t[u].id);o&&(o.classList.add("ext-rv-error"),(function(h){setTimeout(function(){h.classList.remove("ext-rv-error")},3e3)})(o))}for(var c=[],u=0;u<t.length;u++)c.push("\u2022 "+t[u].msg);var p=c.join(`
`);ve({title:"Validasi Gagal ("+t.length+" masalah)",message:p,variant:"warning",okLabel:"OK",hideCancel:!0})}function St(t){return document.getElementById(t)}function d(t){return St(t)?.value?.trim()||""}function se(t,i){let r=d(t);return!!r&&!v(r)&&i(r)}function Z(t){return document.querySelector('input[name="'+t+'"]:checked')?.value||""}function le(t){return document.querySelector('input[name="'+t+'"]:checked')!==null}function wt(t){return document.querySelector(t+":checked")!==null}function Lt(t){if(t==="rajal")return;function i(p,h){var g=document.getElementById(p);g&&g.addEventListener("input",function(C){if(!(C&&C.isTrusted===!1)){var _=document.getElementById(h);_&&(_.value="")}})}i("kode_diagnosa_utama","id_diagnosa_utama"),i("diagnosa_utama","id_diagnosa_utama");for(var r=1;r<=10;r++){var u="id_diagnosa_sekunder"+r;i("kode_diagnosa_sekunder"+r,u),i("diagnosa_sekunder"+r,u)}for(var o=1;o<=10;o++){var c="id_tindakan"+o;i("kode_tindakan"+o,c),i("tindakan"+o,c)}}})();})();
