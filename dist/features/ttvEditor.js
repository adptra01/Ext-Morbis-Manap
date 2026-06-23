"use strict";var __morbis_feature=(()=>{var e={background:"#ffffff",foreground:"#0a0a0e",card:"#ffffff",cardForeground:"#0a0a0e",primary:"#2469f0",primaryForeground:"#f8fafc",primaryHover:"#1d58cc",secondary:"#f1f5f9",secondaryForeground:"#1e293b",muted:"#f1f5f9",mutedForeground:"#64748b",accent:"#f1f5f9",accentForeground:"#1e293b",destructive:"#ef4444",destructiveForeground:"#f8fafc",border:"#e2e8f0",input:"#e2e8f0",ring:"#2469f0",success:"#1b8a4b",successBg:"#eaf6ef",warning:"#c47a1a",warningBg:"#fef4e4",error:"#ef4444",errorBg:"#fef2f2",info:"#2469f0",infoBg:"#eef3ff"};var x=new Set;function p(l,c){if(x.has(l)){let u=document.getElementById(l);if(u)return u}let a=document.createElement("style");return a.id=l,a.textContent=c,document.head.appendChild(a),x.add(l),a}function b(l,c="default",a){let u={sm:"padding:5px 10px;font-size:11px;line-height:16px;",default:"padding:6px 14px;font-size:12px;line-height:18px;"},f={default:`background:${e.primary};color:${e.primaryForeground};border:none;`,secondary:`background:${e.secondary};color:${e.secondaryForeground};border:none;`,outline:`background:transparent;color:${e.foreground};border:1px solid ${e.border};`,ghost:`background:transparent;color:${e.foreground};border:none;`,destructive:`background:${e.destructive};color:${e.destructiveForeground};border:none;`},s=document.createElement("button");return s.textContent=l,a?.id&&(s.id=a.id),a?.disabled&&(s.disabled=!0),s.style.cssText=["display:inline-flex;align-items:center;justify-content:center;gap:4px;","border-radius:6px;","font-weight:500;cursor:pointer;white-space:nowrap;","transition:all 0.15s ease;","user-select:none;",u[a?.size||"default"],f[c],a?.disabled?"opacity:0.5;pointer-events:none;":""].join(""),s.onmouseenter=()=>{s.disabled||(s.style.opacity="0.85")},s.onmouseleave=()=>{s.disabled||(s.style.opacity="1")},s}function v(l,c="default"){let a={default:`background:${e.infoBg};color:${e.info};border:1px solid ${e.border};`,success:`background:${e.successBg};color:${e.success};border:1px solid ${e.success}33;`,warning:`background:${e.warningBg};color:${e.warning};border:1px solid ${e.warning}33;`,danger:`background:${e.errorBg};color:${e.error};border:1px solid ${e.error}33;`},u=document.createElement("span");return u.textContent=l,u.style.cssText=["display:inline-flex;align-items:center;gap:4px;","padding:1px 8px;font-size:11px;font-weight:600;border-radius:9999px;user-select:none;",a[c]].join(""),u}function y(l){let c=document.createElement("div");return c.style.cssText=["display:flex;align-items:center;gap:8px;",`padding:6px 12px;background:${e.muted};`,`border:1px solid ${e.border};border-radius:6px;`,"font-size:12px;line-height:18px;user-select:none;"].join(""),l&&(c.id=l),c}p("ext-shared-animations",`
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);(function(){let c=0,a=[{index:0,name:"gcs",min:1,max:15,step:1,unit:"",label:"GCS"},{index:1,name:"sistol",min:50,max:250,step:1,unit:"mmHg",label:"Sistol"},{index:2,name:"diastol",min:20,max:160,step:1,unit:"mmHg",label:"Diastol"},{index:3,name:"nadi",min:20,max:250,step:1,unit:"x/menit",label:"Nadi"},{index:4,name:"rr",min:4,max:80,step:1,unit:"x/menit",label:"RR"},{index:5,name:"suhu",min:30,max:45,step:.1,unit:"\xB0C",label:"Suhu"},{index:6,name:"berat_badan",min:.5,max:500,step:.1,unit:"kg",label:"BB"},{index:7,name:"tinggi_badan",min:20,max:300,step:.1,unit:"cm",label:"TB"}];p("ext-ttv-css",`
    .ext-ttv-editable {
      pointer-events: auto !important;
      background: ${e.background} !important;
      border: 2px solid ${e.primary} !important;
      border-radius: 4px !important;
      padding: 2px 6px !important;
      transition: border-color 0.2s, background-color 0.2s;
    }
    .ext-ttv-editable:focus {
      outline: none !important;
      border-color: ${e.primaryHover} !important;
      box-shadow: 0 0 0 3px ${e.primary}4D !important;
    }
    .ext-ttv-valid {
      border-color: ${e.success} !important;
    }
    .ext-ttv-valid:focus {
      border-color: #16a34a !important;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3) !important;
    }
    .ext-ttv-invalid {
      border-color: ${e.error} !important;
      background: ${e.errorBg} !important;
    }
    .ext-ttv-invalid:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3) !important;
    }
    .ext-ttv-locked {
      pointer-events: none !important;
      background: ${e.muted} !important;
      border: 2px solid #9ca3af !important;
      opacity: 0.7;
    }
  `);let u=setInterval(function(){c++;let t=document.documentElement.getAttribute("data-ext-ttv-editor");t!==null?(clearInterval(u),t==="1"&&f()):c>=100&&clearInterval(u)},50);function f(){if(!window.location.pathname.includes("/surat-pengantar-ri"))return;let t=setInterval(function(){let r=document.getElementById("formDataRujukan"),i=document.querySelectorAll("input.hanya_baca");r&&i.length>0&&(clearInterval(t),s(i))},200)}function s(t){let r=[];t.forEach(function(i,d){let n=i,o=a.find(function(m){return m.index===d});o&&(n.removeAttribute("readonly"),n.classList.remove("hanya_baca"),n.classList.add("ext-ttv-editable"),n.setAttribute("name",o.name),n.setAttribute("data-ext-ttv",o.name),n.setAttribute("placeholder",o.min+"-"+o.max),n.type="number",n.min=String(o.min),n.max=String(o.max),n.step=String(o.step),n.addEventListener("input",function(){g(n,o)}),n.addEventListener("blur",function(){g(n,o)}),r.push(n))}),h(r)}function g(t,r){let i=parseFloat(t.value);if(t.classList.remove("ext-ttv-valid","ext-ttv-invalid"),t.value!==""){if(isNaN(i)||i<r.min||i>r.max?(t.classList.add("ext-ttv-invalid"),t.title=r.label+" harus antara "+r.min+"-"+r.max+" "+r.unit):(t.classList.add("ext-ttv-valid"),t.title=""),r.name==="sistol"){let d=document.querySelector('input[data-ext-ttv="diastol"]');d&&d.value&&t.value&&parseFloat(t.value)<=parseFloat(d.value)&&(t.classList.remove("ext-ttv-valid"),t.classList.add("ext-ttv-invalid"),t.title="Sistol harus lebih besar dari Diastol")}if(r.name==="diastol"){let d=document.querySelector('input[data-ext-ttv="sistol"]');d&&d.value&&t.value&&parseFloat(t.value)>=parseFloat(d.value)&&(t.classList.remove("ext-ttv-valid"),t.classList.add("ext-ttv-invalid"),t.title="Diastol harus lebih kecil dari Sistol")}}}function h(t){let r=document.getElementById("formDataRujukan");if(!r)return;let i=document.createElement("span");i.style.cssText=`color:${e.success};font-weight:600;font-size:12px;`,i.textContent="Editable";let d=b("Kunci TTV","outline",{size:"sm"}),n=y("ext-ttv-toggle-bar");n.appendChild(v("TTV Editor","default")),n.appendChild(i),n.appendChild(d),n.style.marginBottom="12px",r.insertBefore(n,r.firstChild);let o=!1;d.addEventListener("click",function(){o=!o,t.forEach(function(m){o?(m.classList.add("ext-ttv-locked"),m.readOnly=!0):(m.classList.remove("ext-ttv-locked"),m.readOnly=!1)}),i.textContent=o?"Locked":"Editable",i.style.color=o?e.mutedForeground:e.success,d.textContent=o?"Buka TTV":"Kunci TTV"})}})();})();
