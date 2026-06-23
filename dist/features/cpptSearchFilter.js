"use strict";var __morbis_feature=(()=>{function I(){return window}var c={background:"#ffffff",foreground:"#0a0a0e",card:"#ffffff",cardForeground:"#0a0a0e",primary:"#2469f0",primaryForeground:"#f8fafc",primaryHover:"#1d58cc",secondary:"#f1f5f9",secondaryForeground:"#1e293b",muted:"#f1f5f9",mutedForeground:"#64748b",accent:"#f1f5f9",accentForeground:"#1e293b",destructive:"#ef4444",destructiveForeground:"#f8fafc",border:"#e2e8f0",input:"#e2e8f0",ring:"#2469f0",success:"#1b8a4b",successBg:"#eaf6ef",warning:"#c47a1a",warningBg:"#fef4e4",error:"#ef4444",errorBg:"#fef2f2",info:"#2469f0",infoBg:"#eef3ff"};var R=new Set;function A(e,t){if(R.has(e)){let o=document.getElementById(e);if(o)return o}let r=document.createElement("style");return r.id=e,r.textContent=t,document.head.appendChild(r),R.add(e),r}A("ext-shared-animations",`
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);var z=I(),V="ext-cppt-search-style",Y="ext-cppt-no-results";function J(){let e=window.location.pathname;return/\/admisi\/pelaksanaan_pelayanan\/cppt\/?$/.test(e)?"rajal":/\/admisi\/detail-rawat-inap\/cppt\/?$/.test(e)?"ranap":null}function W(e){if(e.id==="history_cppt")return!0;let r=e.querySelector("tr");if(r){let o=Array.from(r.querySelectorAll("th, td")).map(s=>s.textContent?.trim().toLowerCase()||"");if(["waktu","penginput","subyektif","obyektif","assessment","instruksi"].filter(s=>o.some(i=>i.includes(s))).length>=2)return!0}return!!e.textContent?.toLowerCase().includes("cppt")}function j(){return Array.from(document.querySelectorAll("table")).filter(W)}function D(e){let t=e.querySelector("thead tr")||e.querySelector("tr");return t?Array.from(t.querySelectorAll("th, td")).map(r=>r.textContent?.trim()||"").filter(r=>r.length>0):[]}function E(e,...t){for(let r of t){let o=e.findIndex(n=>n.toLowerCase().includes(r));if(o!==-1)return o}return-1}function Q(){A(V,`
    .ext-cppt-filter-bar {
      display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
      padding: 12px 16px; margin: 10px 0;
      background: ${c.muted};
      border: 1px solid ${c.border}; border-radius: 8px;
    }
    .ext-cppt-filter-bar .ext-cppt-label {
      font-weight: 600; font-size: 13px; color: ${c.foreground}; margin-right: 4px;
    }
    .ext-cppt-filter-bar input, .ext-cppt-filter-bar select {
      padding: 6px 10px; border: 1px solid ${c.input}; border-radius: 5px;
      font-size: 13px; background: ${c.background}; color: ${c.foreground};
      outline: none; transition: border-color 0.15s;
      min-width: 0;
    }
    .ext-cppt-filter-bar input:focus, .ext-cppt-filter-bar select:focus {
      border-color: ${c.primary}; box-shadow: 0 0 0 2px ${c.primary}26;
    }
    .ext-cppt-filter-bar input.ext-cppt-search-input { flex: 1 1 180px; min-width: 140px; }
    .ext-cppt-filter-bar select.ext-cppt-dokter-select { flex: 0 1 160px; }
    .ext-cppt-filter-bar input.ext-cppt-date-input { flex: 0 1 130px; }
    .ext-cppt-filter-bar .ext-cppt-btn {
      padding: 6px 14px; border: none; border-radius: 5px;
      cursor: pointer; font-size: 12px; font-weight: 600;
      transition: all 0.15s; white-space: nowrap;
    }
    .ext-cppt-filter-bar .ext-cppt-btn-clear { background: ${c.error}; color: white; }
    .ext-cppt-filter-bar .ext-cppt-btn-clear:hover { background: #dc2626; }
    .ext-cppt-no-results {
      padding: 30px 20px; text-align: center;
      color: ${c.mutedForeground}; font-size: 14px; font-weight: 500;
      background: #fafafa; border: 1px dashed ${c.border};
      border-radius: 8px; margin: 10px 0;
    }
    .ext-cppt-table-wrapper {
      display: block !important; width: 100% !important;
      max-width: 100% !important; clear: both !important;
      float: none !important; flex: 0 0 100% !important;
      box-sizing: border-box !important; break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    .ext-cppt-filtered-row { display: none !important; }
  `)}function C(e){return Array.from(e.querySelectorAll("tr")).filter(t=>t.querySelector("td"))}function X(e,t){let r=new Set;for(let o of e){let a=o.querySelectorAll("td")[t]?.textContent?.trim();a&&a.length>0&&r.add(a)}return Array.from(r).sort()}function Z(e){let t=e.match(/(\d{2})\/(\d{2})\/(\d{4})/);return t?t[3]+"-"+t[2]+"-"+t[1]:e}function O(e){return"ext_cppt_filter_"+e}function N(e){return"cppt"+e+"_"}function ee(e){try{let t=sessionStorage.getItem(O(e));if(t)return JSON.parse(t)}catch{}return{search:"",dokter:"",tanggalAwal:"",tanggalAkhir:""}}function M(e,t){try{sessionStorage.setItem(O(t),JSON.stringify(e))}catch{}}function te(e){let t=new URLSearchParams(window.location.search),r=N(e);return{search:t.get(r+"search")||"",dokter:t.get(r+"dokter")||"",tanggalAwal:t.get(r+"tgl_awal")||"",tanggalAkhir:t.get(r+"tgl_akhir")||""}}function _(e,t){let r=new URL(window.location.href),o=r.searchParams,n=N(t),a=(i,l)=>{l?o.set(i,l):o.delete(i)};a(n+"search",e.search),a(n+"dokter",e.dokter),a(n+"tgl_awal",e.tanggalAwal),a(n+"tgl_akhir",e.tanggalAkhir);let s=r.pathname+"?"+o.toString();s!==window.location.pathname+"?"+window.location.search.slice(1)&&window.history.replaceState(null,"",s)}function S(e,t,r,o,n){let a=0;for(let s of t){let i=s.querySelectorAll("td");if(i.length===0){a++;continue}let l=!0,p=i[r]?.textContent?.trim()||"",g=Z(p.toLowerCase()),f=i[o]?.textContent?.trim().toLowerCase()||"",m=Array.from(i).map(x=>x.textContent?.trim().toLowerCase()||"").join(" ");if(e.search){let x=e.search.toLowerCase();m.includes(x)||(l=!1)}l&&e.dokter&&f!==e.dokter.toLowerCase()&&(l=!1),l&&e.tanggalAwal&&g<e.tanggalAwal&&(l=!1),l&&e.tanggalAkhir&&g>e.tanggalAkhir&&(l=!1),s.classList.toggle("ext-cppt-filtered-row",!l),l&&a++}n&&(n.style.display=a===0&&t.length>0?"block":"none")}function q(e,t){let r="ext-cppt-filter-"+t;if(e.parentElement?.classList.contains("ext-cppt-table-wrapper"))return;let o=document.getElementById(r);if(o){let d=o.closest(".ext-cppt-table-wrapper");d&&d.remove()}let n=document.getElementById("ext-cppt-nores-"+t);n&&n.remove();let a=D(e),s=E(a,"waktu","masuk","tanggal"),i=E(a,"penginput","dokter","pembuat");if(i===-1&&s===-1)return;let l=document.createElement("div");l.id=r,l.className="ext-cppt-filter-bar";let p=te(t);M(p,t);let g="ext-cppt-search-"+t,f="ext-cppt-dokter-"+t,m="ext-cppt-tgl-awal-"+t,x="ext-cppt-tgl-akhir-"+t,B="ext-cppt-clear-"+t,U="ext-cppt-nores-"+t;l.innerHTML=`
    <span class="ext-cppt-label">Cari:</span>
    <input type="text" id="${g}" class="ext-cppt-search-input"
      placeholder="Cari..." value="${F(p.search)}">

    <span class="ext-cppt-label">Penginput:</span>
    <select id="${f}" class="ext-cppt-dokter-select">
      <option value="">Semua Dokter</option>
    </select>

    <span class="ext-cppt-label">Dari:</span>
    <input type="date" id="${m}" class="ext-cppt-date-input"
      value="${F(p.tanggalAwal)}">

    <span class="ext-cppt-label">S/d:</span>
    <input type="date" id="${x}" class="ext-cppt-date-input"
      value="${F(p.tanggalAkhir)}">

    <button class="ext-cppt-btn ext-cppt-btn-clear" id="${B}">Reset</button>
  `;let $=e.parentNode,G=$?getComputedStyle($).display:"unknown";console.log("[CPPT Filter] Table #"+t+" parent display:",G);let b=document.createElement("div");b.className="ext-cppt-table-wrapper",b.style.cssText="display:block !important;width:100% !important;clear:both;flex:0 0 100%;box-sizing:border-box",$?.insertBefore(b,e),b.appendChild(l),b.appendChild(e);let u=document.createElement("div");u.id=U,u.className=Y,u.textContent="Tidak ada data yang sesuai dengan filter.",u.style.display="none",b.appendChild(u),console.log("[CPPT Filter] Injected filter #"+t+" before table:",e.id||"(no id)");let h=document.getElementById(f),P=C(e);if(i!==-1&&h){let d=X(P,i);for(let L of d){let T=document.createElement("option");T.value=L,T.textContent=L,L===p.dokter&&(T.selected=!0),h.appendChild(T)}}let y=document.getElementById(g),w=document.getElementById(m),v=document.getElementById(x),K=document.getElementById(B),H;function k(){clearTimeout(H),H=setTimeout(()=>{let d={search:y?.value||"",dokter:h?.value||"",tanggalAwal:w?.value||"",tanggalAkhir:v?.value||""};M(d,t),_(d,t),S(d,C(e),s,i,u)},250)}y?.addEventListener("input",k),h?.addEventListener("change",k),w?.addEventListener("input",k),v?.addEventListener("input",k),K?.addEventListener("click",()=>{y&&(y.value=""),h&&(h.value=""),w&&(w.value=""),v&&(v.value="");let d={search:"",dokter:"",tanggalAwal:"",tanggalAkhir:""};M(d,t),_(d,t),S(d,C(e),s,i,u)}),S(p,P,s,i,u)}function F(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ne(){if(!J())return;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(r,500)}):setTimeout(r,500),new MutationObserver(()=>{let o=j();for(let n=0;n<o.length;n++){let a=o[n];if(!a.parentElement?.classList.contains("ext-cppt-table-wrapper")){let s=document.getElementById("ext-cppt-filter-"+n);if(s){let i=s.closest(".ext-cppt-table-wrapper");i&&i.remove()}q(a,n)}}}).observe(document.body,{childList:!0,subtree:!0});function r(){let o=j();if(o.length!==0){Q(),console.log("[CPPT Filter] Found "+o.length+" CPPT table(s)");for(let n=0;n<o.length;n++)console.log("[CPPT Filter] Table #"+n+": id="+(o[n].id||"(none)")+" parent="+(o[n].parentNode?.className||"(none)")+" rows="+o[n].querySelectorAll("tr").length),q(o[n],n);for(let n=0;n<o.length;n++){let a=o[n];new MutationObserver(()=>{let i=ee(n);if(i.search||i.dokter||i.tanggalAwal||i.tanggalAkhir){let p=D(a),g=E(p,"waktu","masuk","tanggal"),f=E(p,"penginput","dokter","pembuat"),m="ext-cppt-nores-"+n;S(i,C(a),g,f,document.getElementById(m))}}).observe(a,{childList:!0,subtree:!0})}}}}typeof z.featureModules<"u"?z.featureModules.cpptSearchFilter={name:"CPPT Search & Filter",description:"Cari dan filter data CPPT per tabel (Riwayat CPPT & History Kunjungan)",run:ne}:console.warn("[CPPT Search] featureModules not defined, registration skipped");})();
