"use strict";var __morbis_feature=(()=>{function R(){return window}var H=R(),_="ext-cppt-search-style",G="ext-cppt-no-results";function K(){let e=window.location.pathname;return/\/admisi\/pelaksanaan_pelayanan\/cppt\/?$/.test(e)?"rajal":/\/admisi\/detail-rawat-inap\/cppt\/?$/.test(e)?"ranap":null}function J(e){if(e.id==="history_cppt")return!0;let o=e.querySelector("tr");if(o){let r=Array.from(o.querySelectorAll("th, td")).map(s=>s.textContent?.trim().toLowerCase()||"");if(["waktu","penginput","subyektif","obyektif","assessment","instruksi"].filter(s=>r.some(a=>a.includes(s))).length>=2)return!0}return!!e.textContent?.toLowerCase().includes("cppt")}function B(){return Array.from(document.querySelectorAll("table")).filter(J)}function D(e){let t=e.querySelector("thead tr")||e.querySelector("tr");return t?Array.from(t.querySelectorAll("th, td")).map(o=>o.textContent?.trim()||"").filter(o=>o.length>0):[]}function S(e,...t){for(let o of t){let r=e.findIndex(n=>n.toLowerCase().includes(o));if(r!==-1)return r}return-1}function W(){if(document.getElementById(_))return;let e=document.createElement("style");e.id=_,e.textContent=`
    .ext-cppt-filter-bar {
      display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
      padding: 12px 16px; margin: 10px 0; background: #f0f4f8;
      border: 1px solid #d1d9e6; border-radius: 8px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .ext-cppt-filter-bar .ext-cppt-label {
      font-weight: 600; font-size: 13px; color: #374151; margin-right: 4px;
    }
    .ext-cppt-filter-bar input, .ext-cppt-filter-bar select {
      padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 5px;
      font-size: 13px; background: white; color: #1f2937;
      outline: none; transition: border-color 0.15s;
      min-width: 0;
    }
    .ext-cppt-filter-bar input:focus, .ext-cppt-filter-bar select:focus {
      border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
    }
    .ext-cppt-filter-bar input.ext-cppt-search-input {
      flex: 1 1 180px; min-width: 140px;
    }
    .ext-cppt-filter-bar select.ext-cppt-dokter-select {
      flex: 0 1 160px;
    }
    .ext-cppt-filter-bar input.ext-cppt-date-input {
      flex: 0 1 130px;
    }
    .ext-cppt-filter-bar .ext-cppt-btn {
      padding: 6px 14px; border: none; border-radius: 5px;
      cursor: pointer; font-size: 12px; font-weight: 600;
      transition: all 0.15s; white-space: nowrap;
    }
    .ext-cppt-filter-bar .ext-cppt-btn-clear {
      background: #ef4444; color: white;
    }
    .ext-cppt-filter-bar .ext-cppt-btn-clear:hover {
      background: #dc2626;
    }
    .ext-cppt-no-results {
      padding: 30px 20px; text-align: center;
      color: #6b7280; font-size: 14px; font-weight: 500;
      background: #fafafa; border: 1px dashed #d1d5db;
      border-radius: 8px; margin: 10px 0;
    }
    .ext-cppt-table-wrapper {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      clear: both !important;
      float: none !important;
      flex: 0 0 100% !important;
      box-sizing: border-box !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    .ext-cppt-filtered-row {
      display: none !important;
    }
  `,document.head.appendChild(e)}function v(e){return Array.from(e.querySelectorAll("tr")).filter(t=>t.querySelector("td"))}function Y(e,t){let o=new Set;for(let r of e){let i=r.querySelectorAll("td")[t]?.textContent?.trim();i&&i.length>0&&o.add(i)}return Array.from(o).sort()}function Q(e){let t=e.match(/(\d{2})\/(\d{2})\/(\d{4})/);return t?t[3]+"-"+t[2]+"-"+t[1]:e}function N(e){return"ext_cppt_filter_"+e}function U(e){return"cppt"+e+"_"}function V(e){try{let t=sessionStorage.getItem(N(e));if(t)return JSON.parse(t)}catch{}return{search:"",dokter:"",tanggalAwal:"",tanggalAkhir:""}}function L(e,t){try{sessionStorage.setItem(N(t),JSON.stringify(e))}catch{}}function X(e){let t=new URLSearchParams(window.location.search),o=U(e);return{search:t.get(o+"search")||"",dokter:t.get(o+"dokter")||"",tanggalAwal:t.get(o+"tgl_awal")||"",tanggalAkhir:t.get(o+"tgl_akhir")||""}}function q(e,t){let o=new URL(window.location.href),r=o.searchParams,n=U(t),i=(a,l)=>{l?r.set(a,l):r.delete(a)};i(n+"search",e.search),i(n+"dokter",e.dokter),i(n+"tgl_awal",e.tanggalAwal),i(n+"tgl_akhir",e.tanggalAkhir);let s=o.pathname+"?"+r.toString();s!==window.location.pathname+"?"+window.location.search.slice(1)&&window.history.replaceState(null,"",s)}function T(e,t,o,r,n){let i=0;for(let s of t){let a=s.querySelectorAll("td");if(a.length===0){i++;continue}let l=!0,p=a[o]?.textContent?.trim()||"",u=Q(p.toLowerCase()),g=a[r]?.textContent?.trim().toLowerCase()||"",f=Array.from(a).map(m=>m.textContent?.trim().toLowerCase()||"").join(" ");if(e.search){let m=e.search.toLowerCase();f.includes(m)||(l=!1)}l&&e.dokter&&g!==e.dokter.toLowerCase()&&(l=!1),l&&e.tanggalAwal&&u<e.tanggalAwal&&(l=!1),l&&e.tanggalAkhir&&u>e.tanggalAkhir&&(l=!1),s.classList.toggle("ext-cppt-filtered-row",!l),l&&i++}n&&(n.style.display=i===0&&t.length>0?"block":"none")}function O(e,t){let o="ext-cppt-filter-"+t;if(e.parentElement?.classList.contains("ext-cppt-table-wrapper"))return;let r=document.getElementById(o);if(r){let c=r.closest(".ext-cppt-table-wrapper");c&&c.remove()}let n=document.getElementById("ext-cppt-nores-"+t);n&&n.remove();let i=D(e),s=S(i,"waktu","masuk","tanggal"),a=S(i,"penginput","dokter","pembuat");if(a===-1&&s===-1)return;let l=document.createElement("div");l.id=o,l.className="ext-cppt-filter-bar";let p=X(t);L(p,t);let u="ext-cppt-search-"+t,g="ext-cppt-dokter-"+t,f="ext-cppt-tgl-awal-"+t,m="ext-cppt-tgl-akhir-"+t,F="ext-cppt-clear-"+t,$="ext-cppt-nores-"+t;l.innerHTML=`
    <span class="ext-cppt-label">Cari:</span>
    <input type="text" id="${u}" class="ext-cppt-search-input"
      placeholder="Cari..." value="${P(p.search)}">

    <span class="ext-cppt-label">Penginput:</span>
    <select id="${g}" class="ext-cppt-dokter-select">
      <option value="">Semua Dokter</option>
    </select>

    <span class="ext-cppt-label">Dari:</span>
    <input type="date" id="${f}" class="ext-cppt-date-input"
      value="${P(p.tanggalAwal)}">

    <span class="ext-cppt-label">S/d:</span>
    <input type="date" id="${m}" class="ext-cppt-date-input"
      value="${P(p.tanggalAkhir)}">

    <button class="ext-cppt-btn ext-cppt-btn-clear" id="${F}">Reset</button>
  `;let E=e.parentNode,j=E?getComputedStyle(E).display:"unknown";console.log("[CPPT Filter] Table #"+t+" parent display:",j);let b=document.createElement("div");b.className="ext-cppt-table-wrapper",b.style.cssText="display:block !important;width:100% !important;clear:both;flex:0 0 100%;box-sizing:border-box",E?.insertBefore(b,e),b.appendChild(l),b.appendChild(e);let d=document.createElement("div");d.id=$,d.className=G,d.textContent="Tidak ada data yang sesuai dengan filter.",d.style.display="none",b.appendChild(d),console.log("[CPPT Filter] Injected filter #"+t+" before table:",e.id||"(no id)");let h=document.getElementById(g),M=v(e);if(a!==-1&&h){let c=Y(M,a);for(let A of c){let C=document.createElement("option");C.value=A,C.textContent=A,A===p.dokter&&(C.selected=!0),h.appendChild(C)}}let x=document.getElementById(u),w=document.getElementById(f),y=document.getElementById(m),z=document.getElementById(F),I;function k(){clearTimeout(I),I=setTimeout(()=>{let c={search:x?.value||"",dokter:h?.value||"",tanggalAwal:w?.value||"",tanggalAkhir:y?.value||""};L(c,t),q(c,t),T(c,v(e),s,a,d)},250)}x?.addEventListener("input",k),h?.addEventListener("change",k),w?.addEventListener("input",k),y?.addEventListener("input",k),z?.addEventListener("click",()=>{x&&(x.value=""),h&&(h.value=""),w&&(w.value=""),y&&(y.value="");let c={search:"",dokter:"",tanggalAwal:"",tanggalAkhir:""};L(c,t),q(c,t),T(c,v(e),s,a,d)}),T(p,M,s,a,d)}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Z(){if(!K())return;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(o,500)}):setTimeout(o,500),new MutationObserver(()=>{let r=B();for(let n=0;n<r.length;n++){let i=r[n];if(!i.parentElement?.classList.contains("ext-cppt-table-wrapper")){let s=document.getElementById("ext-cppt-filter-"+n);if(s){let a=s.closest(".ext-cppt-table-wrapper");a&&a.remove()}O(i,n)}}}).observe(document.body,{childList:!0,subtree:!0});function o(){let r=B();if(r.length!==0){W(),console.log("[CPPT Filter] Found "+r.length+" CPPT table(s)");for(let n=0;n<r.length;n++)console.log("[CPPT Filter] Table #"+n+": id="+(r[n].id||"(none)")+" parent="+(r[n].parentNode?.className||"(none)")+" rows="+r[n].querySelectorAll("tr").length),O(r[n],n);for(let n=0;n<r.length;n++){let i=r[n];new MutationObserver(()=>{let a=V(n);if(a.search||a.dokter||a.tanggalAwal||a.tanggalAkhir){let p=D(i),u=S(p,"waktu","masuk","tanggal"),g=S(p,"penginput","dokter","pembuat"),f="ext-cppt-nores-"+n;T(a,v(i),u,g,document.getElementById(f))}}).observe(i,{childList:!0,subtree:!0})}}}}typeof H.featureModules<"u"?H.featureModules.cpptSearchFilter={name:"CPPT Search & Filter",description:"Cari dan filter data CPPT per tabel (Riwayat CPPT & History Kunjungan)",run:Z}:console.warn("[CPPT Search] featureModules not defined, registration skipped");})();
