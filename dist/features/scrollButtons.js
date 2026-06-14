"use strict";var __morbis_feature=(()=>{function d(){return window}var i=d(),c={scrollDuration:800,showScrollThreshold:200,buttonPosition:{bottom:"20px",right:"20px"}};function h(){try{let e="scroll-buttons-print-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=`
      html { scroll-behavior: smooth; }
      @media print { [data-scroll-buttons] { display: none !important; } }
    `,document.head.appendChild(t)}catch(e){console.warn("[Scroll Buttons] Error injecting print styles:",e)}}function b(){return document.querySelector("[data-scroll-buttons]")!==null}function y(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}function f(e,t=c.scrollDuration){let n=window.pageYOffset||document.documentElement.scrollTop,r=e-n,s=performance.now();function l(a){let o=a-s,u=Math.min(o/t,1),p=y(u);window.scrollTo(0,n+r*p),u<1&&requestAnimationFrame(l)}requestAnimationFrame(l)}function w(){f(0)}function v(){let e=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight);f(e-window.innerHeight)}function m(e){try{let t=window.pageYOffset||document.documentElement.scrollTop,n=e.querySelector("[data-scroll-up]"),r=e.querySelector("[data-scroll-down]");if(!n||!r)return;t>c.showScrollThreshold?(n.style.opacity="1",n.style.transform="scale(1)",n.style.pointerEvents="auto"):(n.style.opacity="0",n.style.transform="scale(0.8)",n.style.pointerEvents="none");let s=t+window.innerHeight;Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)-s>c.showScrollThreshold?(r.style.opacity="1",r.style.transform="scale(1)",r.style.pointerEvents="auto"):(r.style.opacity="0",r.style.transform="scale(0.8)",r.style.pointerEvents="none")}catch(t){console.warn("[Scroll Buttons] Error updating button visibility:",t)}}function g(){try{if(b())return;let e=document.createElement("div");e.dataset.scrollButtons="true",e.style.cssText=`
      position: fixed;
      bottom: ${c.buttonPosition.bottom};
      right: ${c.buttonPosition.right};
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    `;let t=(l,a)=>{let o=document.createElement("button");return o.dataset[l==="up"?"scrollUp":"scrollDown"]="true",o.innerHTML=l==="up"?"&#9650;":"&#9660;",o.style.cssText=`
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(59, 130, 246, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `,o.addEventListener("mouseenter",()=>{o.style.backgroundColor="#2563eb",o.style.transform="scale(1.1)"}),o.addEventListener("mouseleave",()=>{o.style.backgroundColor="rgba(59, 130, 246, 0.9)",o.style.transform="scale(1)"}),o.addEventListener("click",u=>{u.preventDefault(),a()}),o},n=t("up",w),r=t("down",v);e.appendChild(n),e.appendChild(r),document.body.appendChild(e);let s;window.addEventListener("scroll",()=>{clearTimeout(s),s=setTimeout(()=>m(e),50)}),m(e)}catch(e){console.warn("[Scroll Buttons] Error rendering buttons:",e)}}function E(){try{if(!(i.currentConfig?.features?.scrollButtons?.enabled&&i.ExtensionCore.isFeatureAllowed("scrollButtons")))return;window.scrollTo(0,0),setTimeout(g,500),new MutationObserver(()=>{i.currentConfig?.features?.scrollButtons?.enabled!==!1&&!b()&&g()}).observe(document.body,{childList:!0,subtree:!0})}catch(e){console.warn("[Scroll Buttons] Error running feature:",e)}}typeof i.featureModules<"u"?i.featureModules.scrollButtons={name:"Scroll Buttons (Top/Bottom)",description:"Tombol scroll otomatis ke atas dan bawah halaman detail",run:()=>{h(),E()}}:console.warn("[Scroll Buttons] featureModules not defined, module registration skipped");})();
