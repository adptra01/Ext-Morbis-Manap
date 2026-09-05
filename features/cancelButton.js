"use strict";var __morbis_feature=(()=>{var q='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',j=`
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
    --ext-font-family: ${q};
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
`,g=null;function M(){return g||(g=new CSSStyleSheet,g.replaceSync(j)),g}var T=!1;function z(){if(T||document.getElementById("ext-pjs-font"))return;T=!0;let e=document.createElement("link");e.id="ext-pjs-font",e.rel="stylesheet",e.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(e)}function m(e,n="open"){let t=e.attachShadow({mode:n});return t.adoptedStyleSheets=[M()],z(),t}var R=`
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
`,y=class extends HTMLElement{constructor(){super();let n=m(this);n.innerHTML=`
      <style>${R}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=n.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",n=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){n.stopPropagation(),n.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(n){(n==="disabled"||n==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",y);var B=`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-xs);
    font-weight: 700;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  :host([variant='success']) { background: var(--ext-success-soft); color: var(--ext-success); border-color: #bfe3cf; }
  :host([variant='warning']) { background: var(--ext-warning-soft); color: var(--ext-warning); border-color: #f2d3ae; }
  :host([variant='danger']) { background: var(--ext-danger-soft); color: var(--ext-danger); border-color: #f3c1be; }
  :host([variant='info']) { background: var(--ext-info-soft); color: var(--ext-info); border-color: #c3d6f5; }
  :host([variant='neutral']) { background: var(--ext-surface-2); color: var(--ext-text-secondary); border-color: var(--ext-border); }
  :host([variant='primary']) { background: var(--ext-primary-soft); color: var(--ext-primary); border-color: #b8ddcd; }
`,k=class extends HTMLElement{constructor(){super();let n=m(this);n.innerHTML=`<style>${B}</style><slot></slot>`}};customElements.get("ext-badge")||customElements.define("ext-badge",k);var _=`
  :host {
    display: flex;
    flex-direction: column;
    font-family: var(--ext-font-family);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-lg);
    overflow: hidden;
  }
  .tablist {
    display: flex;
    border-bottom: 1px solid var(--ext-border);
    background: var(--ext-surface-2);
    overflow-x: auto;
  }
  ::slotted([slot='tab']) {
    appearance: none;
    border: none;
    background: transparent;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    color: var(--ext-text-secondary);
    padding: 14px 20px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    transition: color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      background-color var(--ext-duration-fast) var(--ext-ease);
  }
  ::slotted([slot='tab']:hover) { color: var(--ext-primary); background: var(--ext-primary-soft); }
  ::slotted([slot='tab'][data-active]) { color: var(--ext-primary); border-bottom-color: var(--ext-primary); font-weight: 700; }
  ::slotted([slot='tab']:focus-visible) { outline: none; box-shadow: inset var(--ext-ring); }
  .panels { padding: var(--ext-space-5); }
  ::slotted([slot='panel']) { display: none; }
  ::slotted([slot='panel'][data-active]) { display: block; }
`,E=class extends HTMLElement{constructor(){super(),this.attachShadowWithTokens()}attachShadowWithTokens(){let n=m(this);n.innerHTML=`
      <style>${_}</style>
      <div class="tablist"><slot name="tab"></slot></div>
      <div class="panels"><slot name="panel"></slot></div>
    `}connectedCallback(){this.addEventListener("click",t=>{let u=t.target.closest('[slot="tab"]');!u||!this.contains(u)||this.activate(u.getAttribute("data-tab")||"")});let n=this.querySelector('[slot="tab"][data-active]');n&&this.activate(n.getAttribute("data-tab")||"")}activate(n){n&&(this.querySelectorAll('[slot="tab"]').forEach(t=>{t.getAttribute("data-tab")===n?t.setAttribute("data-active",""):t.removeAttribute("data-active")}),this.querySelectorAll('[slot="panel"]').forEach(t=>{t.getAttribute("data-panel")===n?t.setAttribute("data-active",""):t.removeAttribute("data-active")}),this.dispatchEvent(new CustomEvent("ext-tab-change",{detail:{tab:n}})))}};customElements.get("ext-tabs")||customElements.define("ext-tabs",E);var O=`
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
`,w=class extends HTMLElement{constructor(){super();this.handleKey=t=>{t.key==="Escape"&&this.hasAttribute("open")&&this.cancel()};this.root=m(this),this.root.innerHTML=`
      <style>${O}</style>
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
    `}connectedCallback(){let t=this.root.querySelector(".overlay");this.root.querySelector(".close").addEventListener("click",()=>this.cancel()),t.addEventListener("click",p=>{p.target===t&&this.cancel()}),document.addEventListener("keydown",this.handleKey)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKey)}get titleSlot(){return this.querySelector('[slot="title"]')}get footerSlot(){return this.querySelector('[slot="footer"]')}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}cancel(){this.dispatchEvent(new CustomEvent("ext-cancel")),this.close()}ok(){this.dispatchEvent(new CustomEvent("ext-ok"))}};customElements.get("ext-modal")||customElements.define("ext-modal",w);function h(e){return new Promise(n=>{let t=document.createElement("ext-modal");t.setAttribute("variant",e.variant??"warning"),e.okLabel&&t.setAttribute("ok-label",e.okLabel),e.cancelLabel&&t.setAttribute("cancel-label",e.cancelLabel),e.hideCancel&&t.setAttribute("hide-cancel",""),t.innerHTML=`<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;let u=t.querySelector('[slot="title"]');u.textContent=e.title;let p=t.querySelector(".ext-confirm-body");if(e.icon){let b=document.createElement("div");b.className="ext-confirm-icon",b.textContent=e.icon,p.appendChild(b)}e.message&&e.message.split(`
`).forEach((C,L)=>{L>0&&p.appendChild(document.createElement("br")),p.appendChild(document.createTextNode(C))}),t.querySelector("[data-ext-confirm-ok]").textContent=e.okLabel??"Lanjut",t.querySelector("[data-ext-confirm-ok]").setAttribute("variant",e.variant==="danger"?"danger":"primary"),e.hideCancel?t.querySelector("[data-ext-confirm-cancel]")?.remove():t.querySelector("[data-ext-confirm-cancel]").textContent=e.cancelLabel??"Batal";let v=b=>{t.remove(),n(b)};t.addEventListener("ext-ok",()=>v(!0)),t.addEventListener("ext-cancel",()=>v(!1)),document.body.appendChild(t),t.open()})}(function(){"use strict";let e="ext-batal",t=null;function u(){t!==null&&(clearInterval(t),t=null)}function p(){return document.documentElement.getAttribute("data-ext-cancel-batal")==="1"}function S(s){if(!s)return null;let i=s.getAttribute("onclick");if(!i)return null;let r=i.match(/(?:edit_hasil|cetak_nota)\s*\(\s*['"]?(\d+)/);if(r){let d=i.match(/[?&]id_visit=(\d+)/);return{id:r[1],idVisit:d?d[1]:""}}let o=i.match(/[?&]id=(\d+)/),a=i.match(/[?&]id_visit=(\d+)/);return o?{id:o[1],idVisit:a?a[1]:""}:null}function v(s,i,r="sm"){let o=document.createElement("ext-btn");return o.setAttribute("variant",i),o.setAttribute("size",r),o.setAttribute("class",e),o.setAttribute("style","margin-left:5px;"),o.textContent=s,o}function b(){document.querySelectorAll("table tbody tr").forEach(s=>{if(s.querySelector("."+e))return;let i=s.querySelector('[onclick*="edit_hasil"],[onclick*="cetak_nota"]');if(!i)return;let r=i.closest("td");if(!r)return;let o=S(i);if(!o)return;let a=o.id,c=s.querySelector("td:nth-child(4)")?.textContent?.trim()||"",l=v("Batal","danger");l.onclick=()=>{typeof window.batal=="function"?window.batal(a,c):h({title:"Peringatan",message:"Fungsi batal() tidak ditemukan. Refresh halaman dan coba lagi.",variant:"warning",okLabel:"OK",hideCancel:!0})},r.appendChild(l)})}function C(){document.querySelectorAll("table tbody tr").forEach(s=>{if(s.querySelector("."+e))return;let i=s.querySelector('[onclick*="editBacaan"],[onclick*="showAddFotoRadiologi"]');if(!i)return;let r=i.closest("td");if(!r)return;let o=S(i);if(!o)return;let a=o.id,d=o.idVisit,c=v("Batal","ghost-danger","sm");c.onclick=()=>{let l=window;typeof l.batal_radiologi=="function"?l.batal_radiologi(a):typeof l.batal_pengajuan=="function"?l.batal_pengajuan(a,d):h({title:"Peringatan",message:"Fungsi pembatalan radiologi tidak ditemukan. Refresh halaman dan coba lagi.",variant:"warning",okLabel:"OK",hideCancel:!0})},r.appendChild(document.createElement("br")),r.appendChild(c)})}function L(s,i,r,o){let a=document.createElement("ext-modal");a.setAttribute("variant","danger"),a.setAttribute("ok-label",r),a.setAttribute("cancel-label","Tutup");let d=document.createElement("h3");d.setAttribute("slot","title"),d.textContent=s;let c=document.createElement("div");c.textContent=i;let l=document.createElement("ext-btn");l.setAttribute("variant","danger"),l.textContent=r;let x=document.createElement("ext-btn");x.setAttribute("variant","secondary"),x.textContent="Tutup";let f=document.createElement("div");f.setAttribute("slot","footer"),f.style.display="flex",f.style.gap="12px",f.appendChild(x),f.appendChild(l),a.appendChild(d),a.appendChild(c),a.appendChild(f),document.body.appendChild(a),a.open(),l.addEventListener("click",()=>{a.close(),a.remove(),o()}),x.addEventListener("click",()=>{a.close(),a.remove()}),a.addEventListener("ext-cancel",()=>a.remove())}function H(){let s=new URLSearchParams(location.search).get("id");if(!s)return;let i=document.querySelector(".field-group");if(!i||i.querySelector("."+e))return;let r=document.createElement("ext-btn");r.setAttribute("variant","danger"),r.setAttribute("size","md"),r.setAttribute("class",e),r.setAttribute("style","margin-left:8px;"),r.textContent="Batal Radiologi",r.onclick=()=>{L("Batal Radiologi","Jika Anda melanjutkan pembatalan maka billing pasien akan berubah, pastikan belum ada pembayaran atas pasien ini.","Ya, Batal",()=>{fetch("/routes/radiologi?opsi=batal-radiologi",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"idRadiologi="+encodeURIComponent(s)}).then(o=>o.json()).then(o=>{if(o.code===200){let a=document.createElement("ext-modal");a.setAttribute("variant","success"),a.setAttribute("hide-cancel","");let d=document.createElement("h3");d.setAttribute("slot","title"),d.textContent="Berhasil";let c=document.createElement("div");c.textContent="Data berhasil dibatalkan";let l=document.createElement("div");l.setAttribute("slot","footer"),l.appendChild((()=>{let x=document.createElement("ext-btn");return x.setAttribute("variant","primary"),x.textContent="OK",x.addEventListener("click",()=>{a.remove()}),x})()),a.appendChild(d),a.appendChild(c),a.appendChild(l),document.body.appendChild(a),a.open(),setTimeout(()=>location.reload(),5e3)}else h({title:"Gagal",message:o.code+" \u2014 "+o.message,variant:"danger",okLabel:"OK",hideCancel:!0})}).catch(()=>{h({title:"Gagal",message:"Terjadi kesalahan, coba lagi",variant:"danger",okLabel:"OK",hideCancel:!0})})})},i.appendChild(r)}function A(){if(!p())return;let s=location.pathname;/\/laboratorium\/input-hasil/.test(s)?b():/\/admisi\/radiologi\/pemeriksaan\/form-edit-bacaan-radiologi/.test(s)?H():/\/admisi\/radiologi\/pemeriksaan/.test(s)&&C()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",A):A(),t=window.setInterval(A,3e3),window.addEventListener("beforeunload",u),new MutationObserver(()=>{document.documentElement.getAttribute("data-ext-cancel-batal")!=="1"&&u()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-ext-cancel-batal"]})})();})();
