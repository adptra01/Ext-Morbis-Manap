"use strict";var __morbis_feature=(()=>{var nt="http://dev.rsudkotajambi.id/rs",rt="ext-farmasi-app-base";var it=["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"],at=".rsudkotajambi.id";function ot(t){try{let e=new URL(t);if(e.protocol!=="http:"&&e.protocol!=="https:")return!1;let n=e.hostname.toLowerCase();return it.includes(n)?!0:n.endsWith(at)}catch{return!1}}function U(){try{let t=localStorage.getItem(rt);if(t&&ot(t))return t.replace(/\/+$/,"")}catch{}return nt}function V(){return U()}function J(t,e=8e3){try{let n=window.requestIdleCallback;if(typeof n=="function"){n.call(window,t,{timeout:e});return}}catch{}window.setTimeout(t,Math.min(e,1500))}function q(){return window}var st='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',X=`
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
    --ext-font-family: ${st};
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
`,_=null;function lt(){return _||(_=new CSSStyleSheet,_.replaceSync(X)),_}var W=!1;function dt(){if(W||document.getElementById("ext-pjs-font"))return;W=!0;let t=document.createElement("link");t.id="ext-pjs-font",t.rel="stylesheet",t.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(t)}function R(t,e="open"){let n=t.attachShadow({mode:e});return n.adoptedStyleSheets=[lt()],dt(),n}var G=!1;function Y(){if(G)return;G=!0;let t=document.createElement("style");t.id="ext-token-css",t.textContent=X.replace(":host",":root"),document.head.appendChild(t)}var ut=`
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
`,H=class extends HTMLElement{constructor(){super();let e=R(this);e.innerHTML=`
      <style>${ut}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=e.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",e=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){e.stopPropagation(),e.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(e){(e==="disabled"||e==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}},P=typeof window<"u"?window.customElements:null;if(P)try{P.get("ext-btn")||P.define("ext-btn",H)}catch(t){console.warn("[MORBIS Ext] gagal registrasi ext-btn:",t)}var ct=`
  :host { display: block; }
  input {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-md);
    padding: 9px 12px;
    min-height: 42px;
    transition: border-color var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
  }
  input::placeholder { color: var(--ext-text-muted); }
  input:focus { outline: none; border-color: var(--ext-primary); box-shadow: var(--ext-ring); }
  input:disabled { background: var(--ext-surface-2); color: var(--ext-text-muted); cursor: not-allowed; }
  :host([invalid]) input { border-color: var(--ext-danger); }

  :host([size='sm']) input {
    font-size: var(--ext-font-size-sm);
    padding: 6px 10px;
    min-height: 32px;
    border-radius: var(--ext-radius-sm);
  }
  :host([size='lg']) input {
    font-size: var(--ext-font-size-lg);
    padding: 12px 14px;
    min-height: 50px;
  }
`,D=class extends HTMLElement{constructor(){super();let e=R(this);e.innerHTML=`<style>${ct}</style><input />`,this.input=e.querySelector("input");for(let n of["change","focus","blur"])this.input.addEventListener(n,()=>this.dispatchEvent(new Event(n)))}static get observedAttributes(){return["type","placeholder","value","disabled","invalid"]}connectedCallback(){this.sync()}attributeChangedCallback(){this.sync()}sync(){let{input:e}=this;if(!e)return;e.type=this.getAttribute("type")||"text",e.placeholder=this.getAttribute("placeholder")||"",e.disabled=this.hasAttribute("disabled"),e.setAttribute("aria-invalid",this.hasAttribute("invalid")?"true":"false");let n=this.getAttribute("value");n!==null&&e.value!==n&&(e.value=n)}get value(){return this.input.value}set value(e){this.input.value=e??""}focus(){this.input.focus()}},O=typeof window<"u"?window.customElements:null;if(O)try{O.get("ext-input")||O.define("ext-input",D)}catch(t){console.warn("[MORBIS Ext] gagal registrasi ext-input:",t)}var E="[MORBIS Ext] visiteKonsul",M=q();function Z(){try{let e=new URLSearchParams(location.search).get("id_visit");return e&&e.trim()?e.trim():null}catch{return null}}var pt=V(),L=pt+"/api/visite-konsul";function tt(t,e){return t?.message||(e?`HTTP ${e.status}`:"gagal menghubungi server")}async function mt(t){let e=await fetch(`${L}/list?id_visit=${encodeURIComponent(t)}`,{credentials:"omit"}),n=await e.json().catch(()=>null);return n?.ok?{rows:(n.data||[]).map(i=>({id:i.id,jenis:i.jenis,nama_dokter:i.nama_dokter,id_dokter:i.id_dokter,saving:!1}))}:{rows:[],error:tt(n,e)}}async function ft(t,e,n){let i=await(await fetch(`${L}/save`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"omit",body:JSON.stringify({id:e.id,id_visit:Number(t),jenis:e.jenis,id_dokter:e.id_dokter,nama_dokter:e.nama_dokter,user:n})})).json();return i?.ok?{id:i.data.id,jenis:i.data.jenis,nama_dokter:i.data.nama_dokter,id_dokter:i.data.id_dokter,saving:!1}:null}async function gt(t,e){return!!(await(await fetch(`${L}/delete`,{method:"DELETE",headers:{"Content-Type":"application/json"},credentials:"omit",body:JSON.stringify({id:t,id_visit:Number(e)})})).json())?.ok}async function xt(t){let e=await fetch(`${L}/dokter?q=${encodeURIComponent(t)}`,{credentials:"omit"}),n=await e.json().catch(()=>null);return n?.ok?{items:n.data||[]}:{items:[],error:tt(n,e)}}function A(t,e,n){if((typeof window<"u"?window.customElements:null)?.get?.("ext-btn")){let c=document.createElement("ext-btn");return c.setAttribute("variant",t),c.setAttribute("size",e),c.textContent=n,c}let i=document.createElement("button");return i.type="button",i.textContent=n,i.className=`ext-vk-btn ext-vk-btn--${t} ext-vk-btn--${e}`,i}function ht(){try{let t=document.querySelector('input[name="id_user"], #id_user');if(t?.value?.trim())return t.value.trim()}catch{}return"petugas"}function et(t){return`ext-vk-cache-${t}`}function N(t){return`ext-vk-pending-${t}`}function j(){try{return window.localStorage||null}catch{return null}}function bt(t){let e=j();if(!e)return[];try{let n=e.getItem(et(t));if(!n)return[];let r=JSON.parse(n);return Array.isArray(r)?r.filter(i=>i&&typeof i.nama_dokter=="string").map(i=>({id:typeof i.id=="number"?i.id:null,jenis:i.jenis==="konsul"?"konsul":"visite",nama_dokter:String(i.nama_dokter),id_dokter:typeof i.id_dokter=="number"?i.id_dokter:null,saving:!1})):[]}catch{return[]}}function I(t,e){let n=j();if(n)try{n.setItem(et(t),JSON.stringify(e.map(r=>({id:r.id,jenis:r.jenis,nama_dokter:r.nama_dokter,id_dokter:r.id_dokter}))))}catch{}}function S(t){let e=j();if(!e)return[];try{let n=e.getItem(N(t));if(!n)return[];let r=JSON.parse(n);return Array.isArray(r)?r.filter(i=>i&&typeof i.nama_dokter=="string").map(i=>({id:typeof i.id=="number"?i.id:null,jenis:i.jenis==="konsul"?"konsul":"visite",nama_dokter:String(i.nama_dokter),id_dokter:typeof i.id_dokter=="number"?i.id_dokter:null,saving:!1})):[]}catch{return[]}}function z(t,e){let n=j();if(n)try{e.length?n.setItem(N(t),JSON.stringify(e.map(r=>({id:r.id,jenis:r.jenis,nama_dokter:r.nama_dokter,id_dokter:r.id_dokter})))):n.removeItem(N(t))}catch{}}function yt(t,e){let n=[...t];for(let r of e)n.find(c=>c.jenis===r.jenis&&c.nama_dokter.trim().toLowerCase()===r.nama_dokter.trim().toLowerCase())||n.push(r);return n}function kt(){let t=document.createElement("style");t.textContent=`
    .ext-vk-card { margin: 12px 0; padding: 12px; border: 1px solid var(--ext-border); border-radius: var(--ext-radius-md); background: var(--ext-surface); font-family: var(--ext-font-family); }
    .ext-vk-card h2, .ext-vk-card h3 { margin: 0 0 8px; font-size: var(--ext-font-size-md); font-weight: 700; color: var(--ext-text); }
    .ext-vk-card > ext-btn, .ext-vk-card > .ext-vk-btn { margin-right: 6px; }
    .ext-vk-btn { display: inline-flex; align-items: center; justify-content: center; font-family: var(--ext-font-family); font-weight: 600; border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); cursor: pointer; margin-right: 6px; }
    .ext-vk-btn--sm { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; }
    .ext-vk-btn--primary { background: var(--ext-primary); color: var(--ext-text-on-primary); border-color: var(--ext-primary); }
    .ext-vk-btn--secondary { background: var(--ext-surface); color: var(--ext-text); }
    .ext-vk-btn--danger { background: var(--ext-danger); color: var(--ext-text-on-primary); border-color: var(--ext-danger); }
    .ext-vk-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .ext-vk-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .ext-vk-table th, .ext-vk-table td { border: 1px solid var(--ext-border); padding: 4px 6px; font-size: var(--ext-font-size-sm); color: var(--ext-text); }
    .ext-vk-table th { background: var(--ext-surface-2); }
    .ext-vk-autocomplete { position: relative; }
    .ext-vk-input { width: 100%; box-sizing: border-box; padding: 6px 10px; font-size: var(--ext-font-size-sm); border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); font-family: var(--ext-font-family); color: var(--ext-text); background: var(--ext-surface); }
    .ext-vk-suggest { position: absolute; top: 100%; left: 0; right: 0; background: var(--ext-surface); border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); max-height: 160px; overflow-y: auto; z-index: 9999; box-shadow: var(--ext-shadow-md); }
    .ext-vk-suggest div { padding: 6px 8px; font-size: var(--ext-font-size-sm); color: var(--ext-text); cursor: pointer; }
    .ext-vk-suggest div:hover { background: var(--ext-surface-2); }
    .ext-vk-status { font-size: var(--ext-font-size-xs); color: var(--ext-text-muted); margin-left: 6px; }
    .ext-vk-warn { margin: 0 0 8px; padding: 8px 10px; font-size: var(--ext-font-size-sm); border-radius: var(--ext-radius-sm); background: var(--ext-danger-soft); border: 1px solid #f3c1be; color: var(--ext-danger); }
  `,document.head.appendChild(t)}function vt(t,e,n){let r=()=>{let p=t.value;return typeof p=="string"?p:t.getAttribute("value")??""},i=p=>{let y=t;try{y.value=p}catch{}t.setAttribute("value",p)},c=t.parentElement,a=null,v=null;function m(){a&&(a.remove(),a=null)}t.addEventListener("input",()=>{v&&window.clearTimeout(v),v=window.setTimeout(async()=>{let p=r().trim();if(p.length<2){m();return}let{items:y,error:C}=await xt(p);if(m(),!(!y.length&&!C)){if(a=document.createElement("div"),a.className="ext-vk-suggest",C&&!y.length){let l=document.createElement("div");l.textContent=`Pencarian dokter gagal: ${C}`,l.style.color="var(--ext-danger)",a.appendChild(l),c.appendChild(a);return}for(let l of y){let x=document.createElement("div");x.textContent=l.nama,x.addEventListener("mousedown",d=>{d.preventDefault(),i(l.nama),n(l.id,l.nama),m()}),a.appendChild(x)}c.appendChild(a)}},250)}),t.addEventListener("blur",()=>window.setTimeout(m,150))}function Q(t,e,n,r,i,c){let a=document.createElement("div");a.className="ext-vk-card";let v=document.createElement("h3");v.textContent=t,a.appendChild(v);let m=document.createElement("table");m.className="ext-vk-table";let p=document.createElement("thead");p.innerHTML='<tr><th style="width:40px">No</th><th>Dokter</th><th style="width:60px">Aksi</th></tr>',m.appendChild(p);let y=document.createElement("tbody");m.appendChild(y),a.appendChild(m);let C=A("secondary","sm","+ Tambah");a.appendChild(C);let l=A("primary","sm","Simpan");a.appendChild(l);let x=A("secondary","sm","Sinkron");a.appendChild(x);let d=document.createElement("span");d.className="ext-vk-status",a.appendChild(d);function T(){y.innerHTML="",n.filter(o=>o.jenis===e).forEach((o,k)=>{let f=document.createElement("tr"),h=document.createElement("td");h.textContent=String(k+1),f.appendChild(h);let u=document.createElement("td"),w=document.createElement("div");w.className="ext-vk-autocomplete";let b;if(window.customElements?.get?.("ext-input")){b=document.createElement("ext-input"),b.setAttribute("type","text"),b.setAttribute("size","sm"),b.setAttribute("placeholder","Ketik nama dokter...");try{b.value=o.nama_dokter}catch{}b.setAttribute("value",o.nama_dokter)}else{let g=document.createElement("input");g.type="text",g.placeholder="Ketik nama dokter...",g.value=o.nama_dokter,g.className="ext-vk-input",b=g}w.appendChild(b),u.appendChild(w),vt(b,o,(g,K)=>{o.id_dokter=g,o.nama_dokter=K,d.textContent="Belum disimpan"}),b.addEventListener("change",()=>{let g=b.value;o.nama_dokter=(typeof g=="string"?g:b.getAttribute("value")??"").trim(),d.textContent="Belum disimpan"}),f.appendChild(u);let B=document.createElement("td"),$=A("danger","sm","Hapus");$.addEventListener("click",async()=>{if(o.id&&!await gt(o.id,r)){d.textContent="Gagal hapus";return}let g=n.indexOf(o);g>=0&&n.splice(g,1),T(),d.textContent="Dihapus"}),B.appendChild($),f.appendChild(B),y.appendChild(f)})}async function F(s){if(!s.nama_dokter.trim()||s.saving)return!1;s.saving=!0;let o=await ft(r,s,i);return s.saving=!1,o?(s.id=o.id,s.id_dokter=o.id_dokter,s.nama_dokter=o.nama_dokter,!0):!1}l.addEventListener("click",async()=>{let s=n.filter(h=>h.jenis===e&&h.nama_dokter.trim());if(!s.length){d.textContent="Belum ada data";return}let o=!!window.customElements?.get?.("ext-btn");o?l.setAttribute("loading",""):(l.disabled=!0,l.textContent="Menyimpan..."),d.textContent="Menyimpan...",I(r,n);let k=0,f=[];for(let h of s)await F(h)?k++:f.push(h);if(f.length)z(r,[...S(r),...f]);else{let h=S(r).filter(u=>!s.some(w=>w.jenis===u.jenis&&w.nama_dokter.trim().toLowerCase()===u.nama_dokter.trim().toLowerCase()));z(r,h)}I(r,n),o?l.removeAttribute("loading"):(l.disabled=!1,l.textContent="Simpan"),k===s.length?d.textContent="Tersimpan":k===0?d.textContent="Offline \u2014 tersimpan lokal, akan dikirim saat online":d.textContent=`Tersimpan ${k}/${s.length} (sisanya lokal)`,k!==s.length&&console.warn(E,"gagal simpan",e,k,"/",s.length)}),x.addEventListener("click",async()=>{let s=S(r).filter(u=>u.jenis===e);if(!s.length){d.textContent="Tidak ada data pending";return}let o=!!window.customElements?.get?.("ext-btn");o?x.setAttribute("loading",""):(x.disabled=!0,x.textContent="Sinkron..."),d.textContent="Menyinkronkan...";let k=0,f=[];for(let u of s)await F(u)?k++:f.push(u);let h=S(r).filter(u=>u.jenis!==e);z(r,[...h,...f]);for(let u of s)n.some(w=>w.jenis===u.jenis&&w.nama_dokter.trim().toLowerCase()===u.nama_dokter.trim().toLowerCase())||n.push({...u,saving:!1});I(r,n),T(),o?x.removeAttribute("loading"):(x.disabled=!1,x.textContent="Sinkron"),d.textContent=f.length?`Gagal ${f.length}, coba lagi`:`Sinkron ${k} data`}),C.addEventListener("click",()=>{n.push({id:null,jenis:e,nama_dokter:"",id_dokter:null,saving:!1}),T()}),T(),c.appendChild(a)}function wt(){let t=Array.from(document.querySelectorAll("h2.judul")).find(e=>/halaman\s+utama/i.test(e.textContent||""));return t||Array.from(document.querySelectorAll("h1, h2, h3")).find(e=>/halaman\s+utama/i.test(e.textContent||""))||null}async function Ct(t=5e3){let e=Date.now()+t;for(;;){let n=wt();if(n||Date.now()>e)return n;await new Promise(r=>setTimeout(r,250))}}async function St(){let t=Z();if(!t||M.__extVisiteKonsul)return;M.__extVisiteKonsul=!0,Y(),kt();let e=ht(),n=document.querySelector("#main-content, .content, main, #content");n||(n=document.body);let r=document.createElement("div");r.className="ext-vk-card";let i=document.createElement("h2");i.textContent="Visite & Konsul Dokter Spesialis IGD (input manual)",r.appendChild(i);let c=await Ct();c?c.insertAdjacentElement("afterend",r):n.insertBefore(r,n.firstChild);let a=[],{rows:v,error:m}=await mt(t);if(m){let p=document.createElement("div");p.className="ext-vk-warn",p.textContent=`API visite-konsul tidak aktif (${m}). Menampilkan data lokal (cache). Pencarian & simpan dokter akan gagal sampai admin Reports mengaktifkan grup API ini.`,r.appendChild(p),console.warn(E,"api list gagal:",m);let y=bt(t),C=S(t),l=yt(y,C);a.push(...l)}else a.push(...v),I(t,v);Q("VISITE","visite",a,t,e,r),Q("KONSUL","konsul",a,t,e,r),console.log(E,"loaded",a.length,"rows for visit",t)}typeof M.featureModules<"u"?M.featureModules.visiteKonsul={id:"visiteKonsul",name:"Visite & Konsul Dokter (IGD)",description:"Input manual visite & konsul dokter spesialis IGD di halaman utama pelayanan (data di Reports SIMRS)",match:{pathname:"/admisi/pelaksanaan_pelayanan/halaman-utama"},enabledWhen:()=>!!Z(),run:()=>J(()=>{St().catch(t=>console.error(E,t))},500)}:console.warn(E,"featureModules not defined, registration skipped");})();
