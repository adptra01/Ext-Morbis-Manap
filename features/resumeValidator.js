"use strict";var __morbis_feature=(()=>{var c={background:"#ffffff",foreground:"#0a0a0e",card:"#ffffff",cardForeground:"#0a0a0e",primary:"#2469f0",primaryForeground:"#f8fafc",primaryHover:"#1d58cc",secondary:"#f1f5f9",secondaryForeground:"#1e293b",muted:"#f1f5f9",mutedForeground:"#64748b",accent:"#f1f5f9",accentForeground:"#1e293b",destructive:"#ef4444",destructiveForeground:"#f8fafc",border:"#e2e8f0",input:"#e2e8f0",ring:"#2469f0",success:"#1b8a4b",successBg:"#eaf6ef",warning:"#c47a1a",warningBg:"#fef4e4",error:"#ef4444",errorBg:"#fef2f2",info:"#2469f0",infoBg:"#eef3ff"};var G=new Set;function C(s,d){if(G.has(s)){let f=document.getElementById(s);if(f)return f}let o=document.createElement("style");return o.id=s,o.textContent=d,document.head.appendChild(o),G.add(s),o}C("ext-shared-animations",`
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);var He='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',Ce=`
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
    --ext-font-family: ${He};
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
`,S=null;function Ie(){return S||(S=new CSSStyleSheet,S.replaceSync(Ce)),S}var X=!1;function Ae(){if(X||document.getElementById("ext-pjs-font"))return;X=!0;let s=document.createElement("link");s.id="ext-pjs-font",s.rel="stylesheet",s.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(s)}function w(s,d="open"){let o=s.attachShadow({mode:d});return o.adoptedStyleSheets=[Ie()],Ae(),o}var $e=`
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
`,I=class extends HTMLElement{constructor(){super();this.handleKey=o=>{o.key==="Escape"&&this.hasAttribute("open")&&this.cancel()};this.root=w(this),this.root.innerHTML=`
      <style>${$e}</style>
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
    `}connectedCallback(){let o=this.root.querySelector(".overlay");this.root.querySelector(".close").addEventListener("click",()=>this.cancel()),o.addEventListener("click",p=>{p.target===o&&this.cancel()}),document.addEventListener("keydown",this.handleKey)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKey)}get titleSlot(){return this.querySelector('[slot="title"]')}get footerSlot(){return this.querySelector('[slot="footer"]')}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}cancel(){this.dispatchEvent(new CustomEvent("ext-cancel")),this.close()}ok(){this.dispatchEvent(new CustomEvent("ext-ok"))}};customElements.get("ext-modal")||customElements.define("ext-modal",I);var Be=`
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
`,A=class extends HTMLElement{constructor(){super();let d=w(this);d.innerHTML=`
      <style>${Be}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=d.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",d=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){d.stopPropagation(),d.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(d){(d==="disabled"||d==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",A);function b(s){return new Promise(d=>{let o=document.createElement("ext-modal");o.setAttribute("variant",s.variant??"warning"),s.okLabel&&o.setAttribute("ok-label",s.okLabel),s.cancelLabel&&o.setAttribute("cancel-label",s.cancelLabel),s.hideCancel&&o.setAttribute("hide-cancel",""),o.innerHTML=`<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;let f=o.querySelector('[slot="title"]');f.textContent=s.title;let p=o.querySelector(".ext-confirm-body");if(s.icon){let m=document.createElement("div");m.className="ext-confirm-icon",m.textContent=s.icon,p.appendChild(m)}s.message&&s.message.split(`
`).forEach((x,h)=>{h>0&&p.appendChild(document.createElement("br")),p.appendChild(document.createTextNode(x))}),o.querySelector("[data-ext-confirm-ok]").textContent=s.okLabel??"Lanjut",o.querySelector("[data-ext-confirm-ok]").setAttribute("variant",s.variant==="danger"?"danger":"primary"),s.hideCancel?o.querySelector("[data-ext-confirm-cancel]")?.remove():o.querySelector("[data-ext-confirm-cancel]").textContent=s.cancelLabel??"Batal";let _=m=>{o.remove(),d(m)};o.addEventListener("ext-ok",()=>_(!0)),o.addEventListener("ext-cancel",()=>_(!1)),document.body.appendChild(o),o.open()})}(function(){let d=0,o=setInterval(function(){d++;let e=document.documentElement.getAttribute("data-ext-resume-validator");if(e!==null){if(clearInterval(o),e!=="1")return;f()}else d>=100&&clearInterval(o)},50);function f(){if(!window.location.pathname.includes("/tambah-resume-ri"))return;let e=setInterval(function(){let t=document.getElementById("save"),n=document.querySelector('form[action*="rawat-inap-resume"]');t&&n&&(clearInterval(e),p(n,t))},200)}function p(e,t){$(),_(e),be(),te(),Q(e),oe(),se(),le(),de(),ue(),ce(),me(),ie(e),ne(e,t),ae(t,e)}function $(){C("ext-rv-css",[`.ext-rv-error { border: 2px solid ${c.error} !important; background: ${c.errorBg} !important; transition: all 0.2s; }`,".ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }",`.ext-rv-toast-error { background: ${c.errorBg}; color: #991b1b; border-left: 5px solid ${c.error}; }`,`.ext-rv-toast-success { background: ${c.successBg}; color: #065f46; border-left: 5px solid ${c.success}; }`,`.ext-rv-locked { background: ${c.muted} !important; cursor: not-allowed; opacity: 0.8; }`,".ext-rv-save-disabled { opacity: 0.5; pointer-events: none; }",`.ext-rv-icd-valid { border: 2px solid ${c.success} !important; background: ${c.successBg} !important; }`,`.ext-rv-icd-invalid { border: 2px solid ${c.error} !important; background: ${c.errorBg} !important; }`].join(`
`))}function _(e){let t=window;t.cekForm=function(){return y()},e.onsubmit!==null&&(e.onsubmit=function(r){let l=y();return!l&&r&&r.preventDefault(),l});let n=t.jQuery;n&&n(e).on("submit",function(r){return y()?!0:(r.preventDefault(),!1)});var a=e.submit.bind(e);e.submit=function(){if(y()){k=!1,Z();try{localStorage.removeItem(h())}catch{}a()}}}let m="ext_draft_resume_";var x=null;function h(){let e=i("id_visit");return m+(e||"unknown")}var M=null,B=2e3;function D(e,t){return function(){M&&clearTimeout(M),M=setTimeout(e,t)}}function Q(e){if(!L()){var t=function(){ee(e)},n=e.querySelectorAll("input, textarea, select");n.forEach(function(a){a.addEventListener("change",D(t,B)),a.addEventListener("input",D(t,B))}),x=setInterval(t,3e4)}}function Z(){x!==null&&(clearInterval(x),x=null)}function ee(e){let t=h(),n=new FormData(e),a={};n.forEach(function(r,l){a[l]=r.toString()}),a._saved_at=Date.now().toString();try{localStorage.setItem(t,JSON.stringify(a))}catch{}}async function te(){if(L())return;let e=h(),t=null;try{t=localStorage.getItem(e)}catch{return}if(!t)return;let n;try{n=JSON.parse(t)}catch{return}let a=function(){for(let l in n){if(l==="_saved_at")continue;let u=document.querySelector('[name="'+l+'"]');u&&!u.value&&(u.value=n[l])}try{localStorage.removeItem(e)}catch{}};if(await b({title:"Draft Ditemukan",message:"Data draft sebelumnya ditemukan. Pulihkan?",variant:"info",okLabel:"Pulihkan",cancelLabel:"Hapus"}))a();else try{localStorage.removeItem(e)}catch{}}function L(){let e=document.getElementById("id_resume_inap");return!!e&&!!e.value}function ne(e,t){if(!L())return;let n=e.querySelectorAll("input, textarea, select");n.forEach(function(r){r.id==="save"||r.type==="button"||r.type==="submit"||(r.tagName==="SELECT"?r.disabled=!0:r.readOnly=!0,r.classList.add("ext-rv-locked"))}),t.textContent="Data Terkunci (Sudah Tersimpan)",t.value="Data Terkunci (Sudah Tersimpan)";let a=function(){n.forEach(function(r){r.id==="save"||r.type==="button"||r.type==="submit"||(r.disabled=!1,r.readOnly=!1,r.classList.remove("ext-rv-locked"))}),t.textContent="Simpan Perubahan",t.value="Simpan Perubahan",j(t,e)};t.onclick=function(r){r.preventDefault(),async function(){await b({title:"Buka Kunci?",message:"Data sudah tersimpan. Buka kunci untuk mengedit?",variant:"warning",okLabel:"Ya, Buka",cancelLabel:"Batal"})&&(a(),await b({title:"Siap Edit",message:"Field sudah bisa diedit. Klik Simpan Perubahan jika selesai.",variant:"success",okLabel:"OK",hideCancel:!0}))}()}}function ae(e,t){L()||j(e,t)}function j(e,t){e.onclick=function(n){if(!y())return n.preventDefault(),!1;e.classList.add("ext-rv-save-disabled"),e.textContent="Mengecek Koneksi...",e.value="Mengecek Koneksi...",re().then(function(a){if(!a){e.classList.remove("ext-rv-save-disabled"),e.textContent="Simpan (Login Ulang Dulu)",e.value="Simpan (Login Ulang Dulu)",b({title:"Sesi Habis",message:"Jangan tutup halaman ini! Buka tab baru, login kembali, lalu klik Simpan lagi.",variant:"danger",okLabel:"OK, Saya Login Dulu",hideCancel:!0});return}try{localStorage.removeItem(h())}catch{}e.textContent="Menyimpan...",e.value="Menyimpan...",t.submit()}),n.preventDefault()}}async function re(){try{let e=await fetch("/admisi/search?opsi=norm_rekam_medik&q=1",{method:"HEAD",cache:"no-store"});return!(e.redirected||e.status===401||e.status===403)}catch{return!1}}let k=!1;function ie(e){var t=e.querySelectorAll("input, textarea, select");t.forEach(function(n){n.addEventListener("change",function(){k=!0}),n.addEventListener("input",function(){k=!0})}),e.addEventListener("submit",function(){k=!1}),window.addEventListener("beforeunload",function(n){if(k)return n.preventDefault(),n.returnValue="Data yang belum disimpan akan hilang.",n.returnValue})}function oe(){[{id:"suhu_pulang",min:30,max:45,step:.1},{id:"suhu",min:30,max:45,step:.1},{id:"nadi_pulang",min:20,max:250,step:1},{id:"nadi",min:20,max:250,step:1},{id:"rr_pulang",min:4,max:80,step:1},{id:"nafas",min:4,max:80,step:1},{id:"spo2_pulang",min:50,max:100,step:1},{id:"spo2",min:50,max:100,step:1},{id:"gcs_e",min:1,max:4,step:1},{id:"gcs_m",min:1,max:6,step:1},{id:"gcs_v",min:1,max:5,step:1},{id:"berat",min:1,max:500,step:.1}].forEach(function(t){var n=document.getElementById(t.id);n&&(n.type="number",n.min=String(t.min),n.max=String(t.max),n.step=String(t.step),n.placeholder||(n.placeholder=t.min+"-"+t.max))})}function se(){var e=["td_pulang","td","tensi","tensi_pulang"];e.forEach(function(t){var n=document.getElementById(t);n&&(n.placeholder="120/80",n.pattern="[0-9]{2,3}/[0-9]{2,3}",n.title="Format: angka/angka (Contoh: 120/80)")})}function le(){var e=["alasan_rawat","anamnesa","diagnosa_primary","kode_diagnosa_utama","jenis_kasus","keadaan_keluar","cara_keluar","tgl_keluar2"];e.forEach(function(t){var n=document.getElementById(t);n&&(n.required=!0)})}function de(){document.querySelectorAll('input:not([type="submit"]):not([type="button"])').forEach(function(e){e.addEventListener("keydown",function(t){t.key==="Enter"&&t.preventDefault()})})}function ue(){document.querySelectorAll("textarea").forEach(function(e){e.style.overflow="hidden",e.style.resize="vertical",e.addEventListener("input",function(){e.style.height="auto",e.style.height=e.scrollHeight+"px"})})}function ce(){var e=z(),t=q();e.forEach(function(n){var a=document.getElementById(n);a&&a.addEventListener("input",function(){var r=a.value.trim();a.classList.remove("ext-rv-icd-valid","ext-rv-icd-invalid"),r!==""&&(/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(r)?a.classList.add("ext-rv-icd-valid"):a.classList.add("ext-rv-icd-invalid"))})}),t.forEach(function(n){var a=document.getElementById(n);a&&a.addEventListener("input",function(){var r=a.value.trim();a.classList.remove("ext-rv-icd-valid","ext-rv-icd-invalid"),r!==""&&(/^[0-9]{2}(\.[0-9]{1,2})?$/.test(r)?a.classList.add("ext-rv-icd-valid"):a.classList.add("ext-rv-icd-invalid"))})})}function me(){var e=z();e.forEach(function(n){var a=document.getElementById(n);a&&a.addEventListener("blur",function(){var r=a.value.trim().toUpperCase();r&&(r=r.replace(".",""),r.length>3&&(r=r.substring(0,3)+"."+r.substring(3)),a.value=r,a.dispatchEvent(new Event("input")))})});var t=q();t.forEach(function(n){var a=document.getElementById(n);a&&a.addEventListener("blur",function(){var r=a.value.trim();r&&(r=r.replace(".",""),r.length>2&&(r=r.substring(0,2)+"."+r.substring(2)),a.value=r,a.dispatchEvent(new Event("input")))})})}function y(){fe();var e=[];function t(Se,we,Me){Se||e.push({msg:we,id:Me})}t(!!i("norm"),"No. RM harus diisi","norm"),t(!!i("pasien"),"Nama pasien harus diisi","pasien"),t(!!i("id_visit"),"Data kunjungan tidak valid","pasien"),t(!!i("alasan_rawat"),"Alasan rawat harus diisi","alasan_rawat"),t(!!i("anamnesa"),"Anamnesa harus diisi","anamnesa"),t(!!i("diagnosa_primary"),"Diagnosa primary harus diisi","diagnosa_primary"),t(!!i("terapi_pengobatan"),"Terapi/pengobatan harus diisi","terapi_pengobatan"),t(!!i("kode_diagnosa_utama"),"Kode ICD-10 Diagnosa Utama harus diisi","kode_diagnosa_utama"),i("kode_diagnosa_utama")&&t(F(i("kode_diagnosa_utama")),"Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)","kode_diagnosa_utama"),i("diagnosa_utama")&&t(!!i("id_diagnosa_utama"),"Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)","diagnosa_utama");for(var n=1;n<=10;n++){var a=i("kode_diagnosa_sekunder"+n),r=i("diagnosa_sekunder"+n),l=i("id_diagnosa_sekunder"+n);a&&t(F(a),"Format kode ICD-10 Diagnosa Sekunder "+n+" tidak valid","kode_diagnosa_sekunder"+n),r&&t(!!l,"Diagnosa Sekunder "+n+" harus dipilih dari hasil pencarian","diagnosa_sekunder"+n)}for(var u=1;u<=10;u++){var v=i("kode_tindakan"+u),T=i("tindakan"+u),ke=i("id_tindakan"+u);v&&t(xe(v),"Format kode ICD-9 Tindakan "+u+" tidak valid (contoh: 45.16)","kode_tindakan"+u),T&&t(!!ke,"Tindakan "+u+" harus dipilih dari hasil pencarian (autocomplete)","tindakan"+u)}var K=i("td_pulang")||i("tensi");K&&t(ve(K),"Tekanan darah pulang tidak valid (contoh: 120/80)",i("td_pulang")?"td_pulang":"tensi");var N=i("nadi_pulang");N&&t(g(N,20,250),"Nadi pulang harus 20-250","nadi_pulang");var P=i("suhu_pulang");P&&t(g(P,30,45),"Suhu pulang harus 30-45\xB0C","suhu_pulang");var R=i("rr_pulang");R&&t(g(R,4,80),"RR pulang harus 4-80","rr_pulang");var V=i("spo2_pulang");V&&t(g(V,50,100),"SpO2 pulang harus 50-100%","spo2_pulang"),t(!!i("jenis_kasus"),"Jenis kasus harus dipilih","jenis_kasus"),t(!!i("keadaan_keluar"),"Keadaan keluar harus dipilih","keadaan_keluar"),t(!!i("cara_keluar"),"Cara keluar harus dipilih","cara_keluar"),t(!!i("tgl_keluar2"),"Tanggal keluar harus diisi","tgl_keluar2");var O=i("gcs_e");O&&t(g(O,1,4),"GCS Eye harus 1-4","gcs_e");var U=i("gcs_m");U&&t(g(U,1,6),"GCS Motor harus 1-6","gcs_m");var Y=i("gcs_v");Y&&t(g(Y,1,5),"GCS Verbal harus 1-5","gcs_v");var ye=E("pasien_rujuk_masuk_opsi").toLowerCase();ye==="ya"&&t(H("pasien_rujuk_masuk"),"Alasan Datang poin A: pilih asal rujukan masuk","pasien_rujuk_masuk_opsi-ya");var Ee=E("pasien_rujuk_dikembalikan_opsi").toLowerCase();Ee==="ya"&&t(H("pasien_rujuk_dikembalikan"),"Alasan Datang poin B: pilih asal rujukan dikembalikan","pasien_rujuk_dikembalikan_opsi-ya");var _e=E("pasien_dirujuk_keluar_opsi").toLowerCase();_e==="ya"&&t(H("pasien_rujuk_keluar"),"Alasan Datang poin C: pilih rujukan keluar","pasien_dirujuk_keluar_opsi-ya");var Le=E("menggunakan_kb_opsi").toLowerCase();Le==="ya"&&(t(!!i("jenis_kb"),"Pelayanan KB: jenis KB harus dipilih","jenis_kb"),t(!!i("waktu_kb"),"Pelayanan KB: waktu KB harus dipilih","waktu_kb"),t(he(".monitoring_kb"),"Pelayanan KB: pilih minimal satu monitoring KB","monitoring_kb-komplikasi_kb"));var Te=E("cek_status_covid").toLowerCase();Te==="1"&&t(!!i("status_covid"),"Status COVID: pilih jenis COVID","status_covid");var J=i("tgl_masuk")||i("tgl_masuk2"),W=i("tgl_keluar2");return J&&W&&t(new Date(W)>=new Date(J),"Tanggal keluar tidak boleh sebelum tanggal masuk","tgl_keluar2"),e.length>0?(pe(e),!1):!0}function fe(){document.querySelectorAll(".ext-rv-error").forEach(function(e){e.classList.remove("ext-rv-error")})}function pe(e){var t=e[0],n=document.getElementById(t.id);n&&(n.focus(),n.classList.add("ext-rv-error"),setTimeout(function(){n.classList.remove("ext-rv-error")},3e3));for(var a=1;a<e.length;a++){var r=document.getElementById(e[a].id);r&&(r.classList.add("ext-rv-error"),(function(v){setTimeout(function(){v.classList.remove("ext-rv-error")},3e3)})(r))}for(var l=[],a=0;a<e.length;a++)l.push("\u2022 "+e[a].msg);var u=l.join(`
`);b({title:"Validasi Gagal ("+e.length+" masalah)",message:u,variant:"warning",okLabel:"OK",hideCancel:!0})}function ge(e){return document.getElementById(e)}function i(e){return ge(e)?.value?.trim()||""}function ve(e){let t=e.split("/");if(t.length!==2)return!1;let n=parseInt(t[0]),a=parseInt(t[1]);return isNaN(n)||isNaN(a)?!1:n>=50&&n<=250&&a>=20&&a<=160}function g(e,t,n){let a=parseFloat(e.replace(/,/g,"."));return!isNaN(a)&&a>=t&&a<=n}function F(e){return/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/.test(e.toUpperCase())}function xe(e){return/^[0-9]{2}(\.[0-9]{1,2})?$/.test(e)}function E(e){return document.querySelector('input[name="'+e+'"]:checked')?.value||""}function H(e){return document.querySelector('input[name="'+e+'"]:checked')!==null}function he(e){return document.querySelector(e+":checked")!==null}function be(){function e(l,u){var v=document.getElementById(l);v&&v.addEventListener("input",function(){var T=document.getElementById(u);T&&(T.value="")})}e("kode_diagnosa_utama","id_diagnosa_utama"),e("diagnosa_utama","id_diagnosa_utama");for(var t=1;t<=10;t++){var n="id_diagnosa_sekunder"+t;e("kode_diagnosa_sekunder"+t,n),e("diagnosa_sekunder"+t,n)}for(var a=1;a<=10;a++){var r="id_tindakan"+a;e("kode_tindakan"+a,r),e("tindakan"+a,r)}}function z(){for(var e=["kode_diagnosa_utama"],t=1;t<=10;t++)e.push("kode_diagnosa_sekunder"+t);return e}function q(){for(var e=[],t=1;t<=10;t++)e.push("kode_tindakan"+t);return e}})();})();
