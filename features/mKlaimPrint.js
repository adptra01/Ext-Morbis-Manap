"use strict";var __morbis_feature=(()=>{var Ct=Object.defineProperty;var sa=Object.getOwnPropertyDescriptor;var na=Object.getOwnPropertyNames;var ra=Object.prototype.hasOwnProperty;var Ma=(i,M)=>{for(var t in M)Ct(i,t,{get:M[t],enumerable:!0})},La=(i,M,t,e)=>{if(M&&typeof M=="object"||typeof M=="function")for(let r of na(M))!ra.call(i,r)&&r!==t&&Ct(i,r,{get:()=>M[r],enumerable:!(e=sa(M,r))||e.enumerable});return i};var ua=i=>La(Ct({},"__esModule",{value:!0}),i);var oi={};Ma(oi,{buildAnestesiSection:()=>Vt,doctorFromQr:()=>xt,formFields:()=>ut});function Rt(){return window}var wt="RSUD H. Abdul Manap";function Pt(i){let M=i.document,t=e=>{if(e.dataset.tools||!e.naturalWidth||e.naturalWidth<260||e.closest("table"))return;e.dataset.tools="1";let r=M.createElement("span");r.className="img-wrap",e.parentNode?.insertBefore(r,e),r.appendChild(e);let u=M.createElement("span");u.className="img-tools";let n=(L,l)=>{let d=M.createElement("button");return d.type="button",d.dataset.act=l,d.textContent=L,d};u.appendChild(n("\u21BB Rotasi 90\xB0","rot")),u.appendChild(n("Hapus","del")),r.insertBefore(u,e),u.addEventListener("click",L=>{let l=L.target.closest("button")?.dataset.act;if(l==="del"){r.remove();return}if(l!=="rot")return;let d=e.naturalWidth,N=e.naturalHeight;if(!d||!N)return;let c=M.createElement("canvas");c.width=N,c.height=d;let S=c.getContext("2d");if(S){S.translate(N/2,d/2),S.rotate(Math.PI/2),S.drawImage(e,-d/2,-N/2);try{e.src=c.toDataURL("image/png")}catch{}}})};M.querySelectorAll(".dossier-wrapper img").forEach(e=>{e.complete?t(e):e.addEventListener("load",()=>t(e),{once:!0})})}function Ut(i){let M=()=>{try{i.focus(),i.print()}catch{}},t=i.document;t.getElementById("btnPrintPdf")?.addEventListener("click",M);let e=Array.from(t.querySelectorAll(".rm-page")),r=t.getElementById("rmSectionSelect"),u=Array.from(t.querySelectorAll(".tab-btn")),n=w=>{r&&(r.value=w),u.forEach(I=>I.classList.toggle("active",I.dataset.target===w)),e.forEach(I=>{let y=w==="all"||I.id===w||I.id.startsWith(`${w}-`);I.classList.toggle("hidden-section",!y)}),i.scrollTo({top:0,behavior:"smooth"})};r?.addEventListener("change",w=>n(w.target.value)),u.forEach(w=>w.addEventListener("click",()=>n(w.dataset.target||"all")));let L=t.getElementById("checkCounter"),l=Array.from(t.querySelectorAll(".rm-checkbox, .vbox")),d=()=>{L&&(L.textContent=`${l.filter(w=>w.checked).length} / ${l.length}`)};l.forEach(w=>w.addEventListener("change",d)),t.getElementById("btnCheckAll")?.addEventListener("click",()=>{l.forEach(w=>w.checked=!0),d()}),t.getElementById("btnResetChecks")?.addEventListener("click",()=>{l.forEach(w=>w.checked=!1),d()}),d();let N=(w,I)=>{let y=t.createElement("button");return y.type="button",y.className="ext-scroll-btn no-print",y.textContent=w,y.addEventListener("click",I),y},c=N("\u2191",()=>i.scrollTo({top:0,behavior:"smooth"})),S=N("\u2193",()=>i.scrollTo({top:t.documentElement.scrollHeight,behavior:"smooth"})),g=t.createElement("style");g.textContent=".ext-scroll-btn{position:fixed;right:14px;width:34px;height:34px;border:1px solid #000;background:#fff;font-size:16px;font-weight:bold;cursor:pointer;z-index:9999;display:flex;align-items:center;justify-content:center}.ext-scroll-btn:first-of-type{bottom:56px}.ext-scroll-btn:last-of-type{bottom:14px}",t.head.appendChild(g),t.body.appendChild(c),t.body.appendChild(S),i.addEventListener("afterprint",()=>{i.confirm("Apakah menu print ini akan ditutup?")&&i.close()})}var Kt=Rt(),oa=["script","style",'link[rel="stylesheet"]',".no-print",".hilang-saat-print","button","input","select","textarea",'label:has(input[type="checkbox"])',".btn","[data-shortcut-buttons]","[data-back-to-detail-klaim]","[data-bpjs-revision-history]","[onclick]",'a[href^="javascript:"]'],mt=i=>document.getElementById(i)?.value?.trim()||"",s=(...i)=>{for(let M of i){let t=mt(M).replace(/^\s*:\s*/,"").trim();if(t)return t}return"-"};function la(i){let M=t=>{let e=document.createElement("span");return e.className="fv",e.textContent=t,e};i.querySelectorAll("input").forEach(t=>{let e=(t.type||"text").toLowerCase();if(e==="hidden"){t.remove();return}if(e==="radio"||e==="checkbox"){if(!t.checked){t.remove();return}if(e==="radio"){t.replaceWith(M("\u2713"));return}let n=(t.value||"").trim().replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/\b\w/g,L=>L.toUpperCase());t.replaceWith(M(n?"\u2713 "+n:"\u2713"));return}let r=(t.value||"").trim();r?t.replaceWith(M(r)):t.remove()}),i.querySelectorAll("textarea").forEach(t=>{let e=(t.value||"").trim();e?t.replaceWith(M(e)):t.remove()}),i.querySelectorAll("select").forEach(t=>{let r=(t.options[t.selectedIndex]?.textContent||t.value||"").trim();r?t.replaceWith(M(r)):t.remove()})}function ja(i){try{if(!i.width||!i.height)return!0;let M=64,t=document.createElement("canvas");t.width=M,t.height=M;let e=t.getContext("2d",{willReadFrequently:!0});if(!e)return!1;e.drawImage(i,0,0,M,M);let r=e.getImageData(0,0,M,M).data,u=0;for(let L=0;L<r.length;L+=4)u+=(r[L]+r[L+1]+r[L+2])/3;let n=u/(M*M);return n<8||n>250}catch{return!1}}function da(i){i.querySelectorAll("table").forEach(M=>{if(M.parentElement?.closest("table"))return;let t=Array.from(M.rows),e=t[0]?.cells.length||0;t.length<6||e<4||M.querySelector(".vcol")||t.forEach((r,u)=>{let n=Array.from(r.cells);if(!(!n.length||n.some(L=>L.colSpan>=3)))if(u===0){let L=document.createElement("th");L.className="vcol",L.textContent="Ver",r.appendChild(L)}else{let L=document.createElement("td");L.className="vcol";let l=document.createElement("input");l.type="checkbox",l.className="vbox",L.appendChild(l),r.appendChild(L)}})})}var ca=/Rincian Biaya|Resume|Telaah|Laboratorium|Radiologi|SPRI|SBPK/i;function Sa(i){i.querySelectorAll(".tabel-juduls").forEach(t=>t.remove()),i.querySelectorAll("h1,h2,td").forEach(t=>{let e=(t.textContent||"").replace(/\s+/g," ").trim();/^RSUD H\.? ABDUL MANAP$/i.test(e)&&t.remove()}),i.querySelectorAll("tr").forEach(t=>{let e=(t.textContent||"").replace(/\s+/g," ").trim();(/^(RSUD H\.? ABDUL MANAP|PEMERINTAH KOTA JAMBI|Jl\. Sk\. Rd\. Syahbudin)/i.test(e)||/^(RINCIAN\s+BIAYA|LAPORAN|FORMULIR)/i.test(e)&&t.querySelector("u,b,strong"))&&t.remove()});let M=i.querySelector("table");M&&Array.from(i.querySelectorAll("hr")).forEach(t=>{M.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING&&t.remove()})}function Yt(i,M=!1){let t=i.cloneNode(!0),e=Array.from(i.querySelectorAll("canvas")),r=Array.from(t.querySelectorAll("canvas"));return e.forEach((u,n)=>{let L=r[n];if(L){if(ja(u)){L.remove();return}try{let l=document.createElement("img");l.src=u.toDataURL("image/png"),l.style.cssText="max-width:100%;height:auto;",L.replaceWith(l)}catch{let l=document.createElement("div");l.className="fv",l.textContent="[Berkas PDF \u2014 silakan buka di halaman asli]",L.replaceWith(l)}}}),la(t),oa.forEach(u=>t.querySelectorAll(u).forEach(n=>n.remove())),t.querySelectorAll("tr").forEach(u=>{let n=Array.from(u.cells);for(let L=n.length-1;L>=0;L--){let l=n[L];if(!(!(l.textContent||"").trim()&&!l.querySelector("img,table,input")))break;l.remove()}}),t.querySelectorAll("[style]").forEach(u=>{let L=((u.getAttribute("style")||"").match(/(?:text-align|width|vertical-align|white-space)\s*:[^;]+/gi)||[]).join(";");L?u.setAttribute("style",L):u.removeAttribute("style")}),t.removeAttribute("id"),t.removeAttribute("class"),t.removeAttribute("style"),t.querySelectorAll("div").forEach(u=>{!u.children.length&&!(u.textContent||"").trim()&&u.remove()}),Sa(t),M&&da(t),t.innerHTML.trim()}function ga(i,M){let e=(i.querySelector(".panel-heading, .panel-title, legend, h4")?.textContent||"").replace(/\s+/g," ").trim();return e=e.replace(/^Cetak\s+/i,"").replace(/^[\d.,\s-]+/,""),e||`Berkas ${String(M+1).padStart(2,"0")}`}var Aa=/^(Konsul|Radiologi)/i;function Qt(){let i=Array.from(document.querySelectorAll(".isidalam")),M=new Set,t=[],e=[];if(i.forEach((r,u)=>{let n=ga(r,u);if(!Aa.test(n)&&M.has(n))return;M.add(n);let L=Yt(r,ca.test(n));if(L.length<20){e.push({title:n,docNo:null});return}t.push({title:n,html:L}),e.push({title:n,docNo:t.length})}),!t.length){let r=document.querySelector("#section-to-print");if(r){let u="Detail Klaim";t.push({title:u,html:Yt(r)}),e.push({title:u,docNo:1})}}return{sections:t,inventory:e}}var a=i=>St(i).replace(/[&<>"']/g,M=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[M]),J=i=>a(i).trim().replace(/\r\n/g,`
`).replace(/\n{3,}/g,`

`).split(`

`).map(M=>M.replace(/\n/g,"<br/>")).join('<span class="nl-gap"></span>'),kt=i=>(new DOMParser().parseFromString(i.replace(/src="data:[^"]*"/g,""),"text/html").body.textContent||"").replace(/\s+/g," ").trim(),ma=i=>{let M=i.split(/[-/]/).map(u=>u.trim());if(M.length!==3)return i;let[t,e,r]=M;return t.length===4?`${t}-${e.padStart(2,"0")}-${r.padStart(2,"0")}`:`${r}-${e.padStart(2,"0")}-${t.padStart(2,"0")}`},Na=/(?:Tgl|Tanggal)\.?\s*Masuk(?:\s*RS)?\s*[:.]?\s*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/gi,pa=/(?:Tgl|Tanggal)\.?\s*(?:Keluar|Pulang)(?:\s*RS)?\s*[:.]?\s*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/gi,Bt=/No\.?\s*SEP\s*[:.]?\s*([0-9A-Z]{8,})/gi;function wa(i,M){let t=[],e=i.map(c=>({t:c.title,x:kt(c.html)})),r=c=>{let S=[],g=new Set;return e.forEach(w=>{let I=new RegExp(c.source,c.flags),y;for(;y=I.exec(w.x);){let k=w.t+"|"+y[1];g.has(k)||(g.add(k),S.push({t:w.t,d:c===Bt?y[1]:ma(y[1])}))}}),S},u=r(Na);new Set(u.map(c=>c.d)).size>1&&t.push({level:"warn",title:"Tanggal masuk berbeda antar berkas",detail:u.map(c=>`${c.t} ${c.d}`).join(" \xB7 ")+" \u2014 samakan sebelum berkas dikirim ke verifikator."});let n=r(pa);if(u.length&&n.length){let c=u.map(g=>g.d).sort()[0],S=n.map(g=>g.d).sort().pop();S<c&&t.push({level:"warn",title:"Tanggal keluar lebih awal dari tanggal masuk",detail:`Masuk ${c} \xB7 Keluar ${S}.`})}let L=r(Bt);new Set(L.map(c=>c.d)).size>1&&t.push({level:"warn",title:"Nomor SEP berbeda antar lembar",detail:L.map(c=>`${c.t} ${c.d}`).join(" \xB7 ")});let l=[/^SEP$/i,/SBPK/i,/Resume/i,/Rincian Biaya/i],d=M.filter(c=>c.docNo===null&&l.some(S=>S.test(c.title)));d.length&&t.push({level:"warn",title:"Berkas inti belum terisi",detail:d.map(c=>c.title).join(", ")+"."});let N=e.find(c=>/Rincian Biaya/i.test(c.t));return N&&!/Total\s+(Biaya|Transaksi|Resep|Jasa)/i.test(N.x)&&t.push({level:"warn",title:"Rincian biaya tanpa baris total",detail:"Tidak ditemukan Total Biaya/Transaksi/Resep pada lembar Rincian Biaya."}),["Laboratorium","Radiologi"].forEach(c=>{let S=e.find(g=>new RegExp(c,"i").test(g.t));S&&S.x.length<60&&t.push({level:"info",title:`Lembar ${c} hanya lampiran gambar`,detail:"Tidak ada teks hasil yang bisa dicocokkan otomatis \u2014 cocokkan manual dengan Resume dan Rincian Biaya."})}),t}var ya="data:image/png;base64,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",Da=[[/^Triage/i,{id:"triage",code:"TRIAGE",tab:"Triage IGD",option:"Triage \u2014 Pengkajian Awal IGD"}],[/PENGKAJIAN INSTALASI GAWAT DARURAT/i,{id:"pengkajian-igd",code:"PENGKAJIAN IGD",tab:"Pengkajian IGD",option:"Pengkajian IGD \u2014 Lembar Pengkajian Instalasi Gawat Darurat"}],[/^SEP$/i,{id:"rm-01",code:"RM. 01",tab:"RM. 01 SEP/CBG",option:"RM. 01 \u2014 SEP &amp; Berkas Klaim Individual (INA-CBG)"}],[/^Surat (?:Rencana )?Kontrol/i,{id:"surat-kontrol",code:"SURAT KONTROL",tab:"Surat Rencana Kontrol",option:"Surat Rencana Kontrol \u2014 BPJS VClaim"}],[/^SBPK$/i,{id:"rm-02",code:"RM. 02",tab:"RM. 02 SBPK",option:"RM. 02 \u2014 Surat Bukti Pelayanan Kesehatan (SBPK)"}],[/^SPRI$/i,{id:"rm-03",code:"RM. 03",tab:"RM. 03 SPRI",option:"RM. 03 \u2014 Surat Pengantar Rawat Inap (SPRI)"}],[/^Rincian Biaya/i,{id:"rm-05",code:"RM. 05",tab:"RM. 05 Billing",option:"RM. 05 \u2014 Rincian Biaya Pelayanan Rawat Inap &amp; Farmasi"}],[/^Resume/i,{id:"rm-06",code:"RM. 06",tab:"RM. 06 Resume",option:"RM. 06 \u2014 Ringkasan Pulang (Discharge Summary)"}],[/^Telaah/i,{id:"rm-07",code:"RM. 07",tab:"RM. 07 Telaah",option:"RM. 07 \u2014 Formulir Telaah Resep, Obat &amp; Edukasi"}],[/^Radiologi/i,{id:"rm-08",code:"RM. 08",tab:"RM. 08 Radiologi",option:"RM. 08 \u2014 Hasil Pemeriksaan Radiologi"}],[/^Laboratorium/i,{id:"rm-09",code:"RM. 09",tab:"RM. 09 Lab",option:"RM. 09 \u2014 Hasil Pemeriksaan Laboratorium Patologi Klinik"}],[/Konsul/i,{id:"rm-10",code:"RM. 10",tab:"RM. 10 Konsul",option:"RM. 10 \u2014 Lembar Konsultasi Antar-Spesialis"}],[/^Persetujuan Tindakan/i,{id:"form-konsent",code:"RM. 19A",tab:"RM. 19A Persetujuan",option:"RM. 19A \u2014 Persetujuan Tindakan Kedokteran"}],[/^Anestesi/i,{id:"form-anestesi",code:"RM. 21",tab:"RM. 21 Anestesi",option:"RM. 21 \u2014 Laporan Anestesi"}],[/^Fisioterapi/i,{id:"form-fisioterapi",code:"FISIOTERAPI",tab:"Fisioterapi",option:"Fisioterapi \u2014 Assesmen &amp; Terapi"}],[/^Pengkajian Hemodialisa/i,{id:"form-hemodialisa",code:"HEMODIALISA",tab:"Hemodialisa",option:"Hemodialisa \u2014 Pengkajian &amp; Sesi"}],[/^Operasi/i,{id:"form-operasi",code:"RM. 20",tab:"RM. 20 Operasi",option:"RM. 20 \u2014 Laporan Pelaksanaan Operasi"}],[/^Surat Kematian/i,{id:"form-kematian",code:"KEMATIAN",tab:"Surat Kematian",option:"Surat Kematian \u2014 Surat Keterangan"}],[/^Permintaan Terapi/i,{id:"form-terapi",code:"TERAPI",tab:"Permintaan Terapi",option:"Permintaan Terapi \u2014 Rehabilitasi Medik"}],[/^Uji Fungsi/i,{id:"form-uji-fungsi",code:"UJI FUNGSI",tab:"Uji Fungsi",option:"Uji Fungsi \u2014 Lembar Uji Fungsi"}],[/^Partograf/i,{id:"form-partograf",code:"PARTOGRAF",tab:"Partograf",option:"Partograf \u2014 Pemantauan Persalinan"}],[/^Laporan Tindakan/i,{id:"form-laporan-tindakan",code:"LAPORAN TINDAKAN",tab:"Laporan Tindakan",option:"Laporan Tindakan \u2014 Pelaksanaan Tindakan"}],[/^Bon Makan/i,{id:"form-bon-makan",code:"BON MAKAN",tab:"Bon Makan",option:"Bon Makan \u2014 Pasien / Pendamping"}],[/^PEMERIKSAAN$/i,{id:"form-pemeriksaan",code:"PEMERIKSAAN",tab:"Pemeriksaan",option:"Pemeriksaan \u2014 Hasil Diagnostik"}]],xa=(i,M)=>Da.find(([t])=>t.test(i))?.[1]??{id:`doc-${M+1}`,code:"FORMULIR RM KLAIM JKN",tab:`RM. ${String(M+1).padStart(2,"0")} ${i}`,option:`RM. ${String(M+1).padStart(2,"0")} \u2014 ${i}`},V=i=>`<div class="kop-surat"><img class="kop-logo" src="${ya}" alt="Logo Kota Jambi"><div class="kop-text">
<div class="kop-line-1">PEMERINTAH KOTA JAMBI</div>
<div class="kop-line-2">DINAS KESEHATAN</div>
<div class="kop-line-3">RUMAH SAKIT UMUM DAERAH H. ABDUL MANAP</div>
<div class="kop-line-4">Alamat : Jl. Sk. Rd. Syahbuddin Kel. Mayang Mangurai Kec. Alam Barajo Kota Jambi 36129 &#9742; (0741) 670459</div>
<div class="kop-line-5">email : rsud_ham.jambi@yahoo.co.id, rsud@jambikota.go.id, website : rsud.jambikota.go.id</div>
</div></div><div class="kop-double-rule"></div>`,o=(i,M,t=!1)=>`<tr><td class="lbl">${i}</td><td class="col">:</td><td class="val">${t?`<strong>${J(M)}</strong>`:J(M)}</td></tr>`,Wt="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDEuNjMgMzEuMDIiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEsIC5jbHMtMiB7CiAgICAgICAgZmlsbDogIzAwYTU1MTsKICAgICAgfQoKICAgICAgLmNscy0zLCAuY2xzLTQgewogICAgICAgIGZpbGw6ICMwMjNmODc7CiAgICAgIH0KCiAgICAgIC5jbHMtNSB7CiAgICAgICAgZmlsbDogI2ZmZjsKICAgICAgfQoKICAgICAgLmNscy01LCAuY2xzLTQsIC5jbHMtMiB7CiAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxnPgogICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTAyLjkxLDE1LjFjLS44Mi0yLjQtMS42NS00LjgtMi40Ny03LjJsLTEuODYsMi4zMnY0Ljg5YzAsMS4xOS0uNjcsMS45Ni0yLjEyLDEuOTVoLS44N2MwLTUuNjksMC0xMS4zNywwLTE3LjA2aC42NGMuMzEsMCwuNTcsMCwuODcuMDUsMS4wMi4xOSwxLjQ5LjksMS40OSwxLjl2NS4zMmw1LjMxLTYuMzlDMTA0LjY0LDAsMTA1LjA3LDAsMTA2LjI5LDBoLjQxYy0xLjQsMS44LTIuOCwzLjU5LTQuMiw1LjM5LDEuNDMsMy44OSwyLjg3LDcuNzgsNC4zLDExLjY3aC0uNDdjLS42OSwwLTEuMzUuMDMtMS45OC0uMjYtLjQzLS4yLS43OC0uNS0xLjA0LS44OC0uMTgtLjI2LS4yOS0uNTMtLjM5LS44MloiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTExNy45NCwxNC44NmMtLjc1LDEuNjItMi41MywyLjIzLTQuNDMsMi4yMy0yLjk0LDAtNC41NS0xLjYxLTUuMjctMy43Mi0uNS0xLjQ2LS42Ni0zLjI4LS4zOS00Ljk5LjQxLTIuNjEsMi01LjM4LDUuMjktNS4zOCw0Ljc2LDAsNS4zLDMuNjgsNS40Niw2Ljk5aC03Ljk3Yy0uMDksMS45OC4zMiw1LjYxLDMuMjksNS42MS43OSwwLDEuMzktLjE0LDEuNzktLjQyLjcyLS40MiwxLjMxLS43OSwyLjIzLS4zM2gwWm0tMi4wNi02LjA5Yy0uMDYtLjgtLjE1LTEuNDgtLjI3LTIuMDMtLjcxLTMuMTUtMy45OC0yLjgyLTQuNzQtLjAyLS4xNS41NS0uMjQsMS4yNC0uMjYsMi4wNWg1LjI3WiIvPgogICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTIyLjkxLDE1LjAzYy41My4zNSwxLjE3LjUzLDEuOTEuNTNzMS4zNS0uMTgsMS43My0uNTVjLjM4LS4zNi41Ny0uODMuNTctMS40LDAtLjQtLjA2LS43My0uMTktMS0uMTMtLjI3LS4yOS0uNS0uNS0uNjktLjItLjE5LS40NC0uMzUtLjctLjQ3LS4yNy0uMTItLjUzLS4yNC0uODEtLjM0LS42MS0uMjItMS4xNy0uNDYtMS42OC0uNzEtLjUxLS4yNi0uOTUtLjU1LTEuMzItLjg3LS4zNy0uMzItLjY2LS42OS0uODctMS4xMS0uMjEtLjQyLS4zMS0uOS0uMzEtMS40NiwwLS42Ni4xMi0xLjI0LjM1LTEuNzMuMjMtLjUuNTYtLjkxLjk4LTEuMjQuNDItLjMzLjkxLS41OCwxLjQ5LS43NS41Ny0uMTcsMS4yLS4yNSwxLjg3LS4yNS44MiwwLDEuNTkuMTMsMi4zMS40MS43Mi4yNywxLjI0Ljc3LDEuNTgsMS41LS45Ny42OC0xLjYuMTktMi4yMS0uMDMtLjExLS4wNi0uMjMtLjExLS4zNS0uMTYtLjM0LS4xMi0uNzEtLjE4LTEuMTEtLjE4LS4zMiwwLS42My4wNC0uOTMuMTEtLjMuMDctLjU2LjE5LS43OS4zNC0uMjMuMTUtLjQuMzUtLjUzLjU4LS4xMy4yMy0uMTkuNTItLjE5Ljg1LDAsLjU1LjE3Ljk5LjUxLDEuMjkuMzQuMzEuNzYuNTYsMS4yNy43Ny41MS4yLDEuMDYuNCwxLjY0LjU4LjU5LjE4LDEuMTQuNDMsMS42NC43My41MS4zMS45My43MSwxLjI3LDEuMjEuMzQuNS41MSwxLjE3LjUxLDIuMDIsMCwuNjQtLjEzLDEuMjItLjM3LDEuNzMtLjI1LjUxLS41OS45NC0xLjAzLDEuMjktLjQzLjM1LS45NS42Mi0xLjU2LjgxLS42LjE5LTEuMjUuMjgtMS45NC4yOC0xLjE2LDAtMi4xNS0uMjEtMi45Ny0uNjQtLjgyLS40Mi0xLjQzLTEuMDctMS44MS0xLjk1LjMyLS4yLjgzLS41LDEuNDktLjI2LjQ0LjE2LjcuNDksMS4wNy43NFoiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE1Mi43MSw2LjcyYzAtLjctLjE2LTEuMTctLjUtMS40My0uMzMtLjI1LS44NS0uMzgtMS41Ni0uMzgtLjU4LDAtMS4xMi4xMy0xLjYyLjM4LS41LjI1LS44Ni41My0xLjA5Ljg1djkuMDZjMCwuOTUtLjQ1LDEuNjItMS40MiwxLjgxLS4yOS4wNS0uNTMuMDUtLjgzLjA1aC0uNjFWMGguNjFjLjMsMCwuNTQsMCwuODMuMDUuOTcuMTgsMS40Mi44NSwxLjQyLDEuODF2MS4yNmgwdjEuNThjLjM3LS40NS45Mi0uODQsMS42NC0xLjE4LjczLS4zNCwxLjU3LS41MSwyLjU0LS41MSwxLjE2LDAsMi4wMi4yOSwyLjU5Ljg2LjU2LjU3Ljg1LDEuNDYuODUsMi42NnYxMC41NGgtLjYxYy0uMywwLS41NCwwLS44My0uMDUtLjk3LS4xOC0xLjQyLS44NS0xLjQyLTEuODFWNi43MloiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE2NC44Nyw5LjI5Yy0uMzIuMTYtLjcuMjktMS4xNC4zOC0uNDMuMDktLjg1LjItMS4yNi4zMi0uODEuMjMtMS4zOC41OS0xLjc0LDEuMDctLjM1LjQ4LS41MywxLjExLS41MywxLjg4LDAsLjg3LjE3LDEuNTEuNTIsMS45MS4zNS40Ljg5LjYsMS42My42LjU2LDAsMS4wNi0uMTMsMS41LS4zOS40My0uMjYuNzctLjYzLDEuMDEtMS4wOXYtNC42N2gwWm0uMjIsNS44N2MtLjMyLjYtLjgxLDEuMDYtMS40NSwxLjQxLS42NC4zNC0xLjQuNTEtMi4yNy41MS0xLjMyLDAtMi4zMS0uMzMtMi45Ni0uOTktLjY1LS42Ni0uOTgtMS41OC0uOTgtMi43NnMuMjYtMi4wOC43Ny0yLjcxYy41MS0uNjMsMS4zMS0xLjExLDIuMzktMS40NC4zNS0uMTIuNzMtLjIxLDEuMTItLjI3LjM5LS4wNy43OC0uMTMsMS4xNi0uMi4zOC0uMDYuNzQtLjE0LDEuMDktLjI0Ljc5LS4yMi44Ny0uNDIuODgtLjk4LDAtLjI2LDAtLjUyLDAtLjc3LDAtLjcxLS4xNi0xLjI1LS40OC0xLjYxLS4zMi0uMzYtLjkzLS41NS0xLjg0LS41NS0uNjgsMC0xLjI2LjEzLTEuNzUuNC0uOTUuNTItMS4zNy45NC0yLjYuMzQuNDctLjgxLDEuMTEtMS40LDEuOTItMS43Ni44MS0uMzYsMS42OS0uNTMsMi42NC0uNTMuNjgsMCwxLjMyLjA1LDEuOTIuMTQuNi4wOSwxLjEzLjI4LDEuNTcuNTQuNDQuMjcuNzkuNjUsMS4wNSwxLjEzLjI2LjQ5LjM5LDEuMTIuMzksMS45MXYxMC4zM2MtLjA3LDAtLjQ1LDAtLjc3LDAtMS4zNiwwLTEuNzgtLjcyLTEuODEtMS45MVoiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE3Ny43OSwxNi4xNmMtLjQ1LjMzLS45MS41Ni0xLjM5LjctLjQ4LjE0LTEuMS4yMS0xLjg3LjIxLTEuMjIsMC0yLjE4LS4zNS0yLjg3LTEuMDQtLjY5LS42OS0xLjA0LTEuNjUtMS4wNC0yLjg4VjQuMzloLS40NmMtLjc5LS4wMi0xLjIxLS4xNS0xLjIxLTEuMzhoMS42N1YwaC42MWMuMywwLC41NCwwLC44My4wNS45Ny4xOCwxLjQyLjg1LDEuNDIsMS44MXYxLjE1aDEuNjdjLjc5LjAyLDEuMjEuMTUsMS4yMSwxLjM4aC0yLjl2OC43N2MwLC43Ni4xNywxLjM1LjUsMS43Ny4zMy40Mi44Ni42NCwxLjU4LjY0LjI2LDAsLjUtLjAyLjctLjA1Ljg0LS4xMywxLjI1LS4wMSwxLjU3LjY1WiIvPgogICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTk4Ljc4LDYuNzJjMC0uNy0uMTctMS4xNy0uNS0xLjQzLS4zMy0uMjUtLjg1LS4zOC0xLjU2LS4zOC0uNTgsMC0xLjEyLjEzLTEuNjIuMzgtLjUuMjUtLjg2LjUzLTEuMDkuODV2OS4wNmMwLC45NS0uNDUsMS42Mi0xLjQyLDEuODEtLjI5LjA1LS41My4wNS0uODMuMDVoLS42MVYzaC42MWMuMywwLC41NCwwLC44My4wNS45MS4xNywxLjM2Ljc4LDEuNDEsMS42NGgwYy4zNy0uNDUuOTItLjg0LDEuNjQtMS4xOC43Mi0uMzQsMS41Ny0uNTEsMi41NC0uNTEsMS4xNiwwLDIuMDIuMjksMi41OS44Ni41Ni41Ny44NSwxLjQ2Ljg1LDIuNjZ2MTAuNTRoLS42MWMtLjMsMC0uNTQsMC0uODMtLjA1LS45Ny0uMTgtMS40Mi0uODUtMS40Mi0xLjgxVjYuNzJaIi8+CiAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0xNDIuMTEsMTQuODZjLS43NSwxLjYyLTIuNTMsMi4yMy00LjQzLDIuMjMtMi45NCwwLTQuNTUtMS42MS01LjI3LTMuNzItLjUtMS40Ni0uNjYtMy4yOC0uNC00Ljk5LjQxLTIuNjEsMi01LjM4LDUuMjktNS4zOCw0Ljc2LDAsNS4zLDMuNjgsNS40Niw2Ljk5aC03Ljk3Yy0uMDksMS45OC4zMiw1LjYxLDMuMjksNS42MS43OSwwLDEuMzktLjE0LDEuNzktLjQyLjcyLS40MiwxLjMxLS43OSwyLjIzLS4zM2gwWm0tMi4wNi02LjA5Yy0uMDYtLjgtLjE1LTEuNDgtLjI3LTIuMDMtLjctMy4xNS0zLjk4LTIuODItNC43NC0uMDItLjE1LjU1LS4yNCwxLjI0LS4yNiwyLjA1aDUuMjdaIi8+CiAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0xODYuMjYsOS4yOWMtLjMyLjE2LS43LjI5LTEuMTQuMzgtLjQzLjA5LS44NS4yLTEuMjYuMzItLjgxLjIzLTEuMzkuNTktMS43NCwxLjA3LS4zNS40OC0uNTMsMS4xMS0uNTMsMS44OCwwLC44Ny4xNywxLjUxLjUyLDEuOTEuMzUuNC44OS42LDEuNjMuNi41NiwwLDEuMDYtLjEzLDEuNS0uMzkuNDQtLjI2Ljc3LS42MywxLjAyLTEuMDl2LTQuNjdoMFptLjIyLDUuODdjLS4zMi42LS44MSwxLjA2LTEuNDUsMS40MS0uNjQuMzQtMS40LjUxLTIuMjcuNTEtMS4zMiwwLTIuMzEtLjMzLTIuOTYtLjk5LS42NS0uNjYtLjk4LTEuNTgtLjk4LTIuNzZzLjI2LTIuMDguNzctMi43MWMuNTItLjYzLDEuMzEtMS4xMSwyLjM5LTEuNDQuMzUtLjEyLjczLS4yMSwxLjEyLS4yNy4zOS0uMDcuNzgtLjEzLDEuMTYtLjIuMzgtLjA2Ljc0LS4xNCwxLjA5LS4yNC43OS0uMjIuODctLjQyLjg4LS45OCwwLS4yNiwwLS41MiwwLS43NywwLS43MS0uMTYtMS4yNS0uNDgtMS42MS0uMzItLjM2LS45My0uNTUtMS44NC0uNTUtLjY4LDAtMS4yNi4xMy0xLjc1LjQtLjk1LjUyLTEuMzcuOTQtMi42LjM0LjQ3LS44MSwxLjExLTEuNCwxLjkyLTEuNzYuODEtLjM2LDEuNjktLjUzLDIuNjQtLjUzLjY4LDAsMS4zMi4wNSwxLjkyLjE0LjYuMDksMS4xMy4yOCwxLjU3LjU0LjQ0LjI3Ljc5LjY1LDEuMDUsMS4xMy4yNi40OS4zOSwxLjEyLjM5LDEuOTF2MTAuMzNjLS4wNywwLS40NSwwLS43NywwLTEuMzYsMC0xLjc4LS43Mi0xLjgxLTEuOTFaIi8+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0ibTUxLjczLDcuNzJjMS44OC0uMDYsMi40MS0xLjcsMi40MS0zLjA3LDAtMS40NC0uMTUtMy4wNy0yLjEtMy4wN2gtMi41MXY2LjE0aDIuMlptLS4wMyw3LjljLjkzLDAsMS42Mi0uMjYsMi4wNi0uNzguNDQtLjUyLjY2LTEuMzYuNjYtMi41MiwwLTEuNDctLjItMi45Ny0yLjIyLTMuMjdoLTIuNjh2Ni41N2gyLjE3Wm0tNS4xNywxLjQ3Vi4wNGg1Ljg2YzMuMzEsMCw0Ljc5LDIuMTIsNC40OSw0LjktLjE0LDEuMjgtLjYyLDIuNi0xLjkxLDMuMjksMy4xNi45NiwzLjE2LDUuNTgsMS4zLDcuNTgtLjguODUtMi4wNywxLjI4LTMuODMsMS4yOGgtNS45MVoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im02MC42Ni4wNGg1Ljc5Yy44NywwLDEuNjEuMDksMi4yMi4yNy42MS4xOCwxLjEuNDQsMS40Ny44LjM3LjM2LjY0LjgxLjgxLDEuMzUuMTcuNTQuMjUsMS4xOC4yNSwxLjksMCwxLjE2LS4wOSwyLjEzLS4yNywyLjktLjE4Ljc4LS40NywxLjQxLS44OSwxLjg4LS40Mi40Ny0uOTcuODItMS42NSwxLjAyLS42OC4yMS0xLjUzLjMxLTIuNTUuMzFoLTIuMnY0LjY2YzAsMS4xOS0uNjcsMS45Ni0yLjEyLDEuOTVoLS44N2MwLTUuNjgsMC0xMS4zNywwLTE3LjA1aDBabTQuODgsOC45M2MuNDgsMCwuODktLjA2LDEuMjItLjE5LjMzLS4xMy42LS4zNC44Mi0uNjMuMjItLjMuMzctLjY5LjQ3LTEuMTguMS0uNDkuMTQtMS4xLjE0LTEuODNzLS4wNC0xLjMtLjEyLTEuNzZjLS4wOC0uNDYtLjIxLS44Mi0uMzctMS4wOS0uMTctLjI3LS4zOS0uNDUtLjY2LS41Ni0uMjctLjEtLjYxLS4xNi0xLjAxLS4xNmgtMi4zN3Y3LjM5aDEuODhaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0zIiBkPSJtNzQuNC4wNGguNjNjLjMxLDAsLjU2LDAsLjg2LjA1LDEuMDEuMTksMS40OC44OSwxLjQ4LDEuODh2MTAuODhjMCwyLjgzLTEuNjcsNC4yNS01LjAyLDQuMjUtLjE2LDAtLjMxLDAtLjQ2LDAtMS4wOS0uMDItMi4wNi0uMjctMi44OS0uNzUtLjg2LS41LTEuNDktMS4yMi0xLjg5LTIuMTUuNy0uMjgsMS4zLS40MywxLjkzLjA0LjI2LjE5LjQ3LjQyLjc1LjYxLjMuMi42NC4zNSwxLjAyLjQ0LjgxLjIsMS45Ni4yMSwyLjc0LS4yMi43OS0uNDQuODYtMS4yNy44Ni0yLjA1Vi4wNFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im04Mi41OSwxNC44NGMuNTUuMzcsMS4yMy41NiwyLjA1LjU2LjM5LDAsLjc2LS4wNiwxLjExLS4xOC4zNS0uMTIuNjYtLjI5LjkzLS41Mi4yNy0uMjIuNDgtLjQ5LjYzLS44Mi4xNS0uMzIuMjMtLjY4LjIzLTEuMDksMC0uMzYtLjA2LS42Ny0uMTctLjk1LS4xMS0uMjctLjI3LS41Mi0uNDYtLjczLS4xOS0uMjItLjQyLS40MS0uNjktLjU5LS4yNy0uMTgtLjU1LS4zNi0uODYtLjU1LS42OS0uNC0xLjMzLS43OS0xLjkyLTEuMTctLjU5LS4zOC0xLjEtLjc5LTEuNTMtMS4yMi0uNDMtLjQzLS43OC0uOTEtMS4wMy0xLjQzLS4yNS0uNTItLjM3LTEuMTQtLjM3LTEuODYsMC0uNjIuMTEtMS4xOC4zMy0xLjcuMjItLjUyLjU0LS45Ni45Ny0xLjM0LjQzLS4zOC45NS0uNjgsMS41Ni0uODkuNjEtLjIyLDEuMzEtLjMyLDIuMS0uMzIsMS4wMywwLDEuOTIuMjEsMi42Ni42My43NC40MiwxLjI0LDEuMDIsMS41LDEuNzgtLjg2LjM3LTEuNDkuMTctMi4xOS0uMzUtLjQ0LS4yOS0uOTctLjQ0LTEuNTgtLjQ0LS44NSwwLTEuNTIuMjEtMS45OS42Mi0uNDcuNDItLjcxLDEtLjcxLDEuNzYsMCwuNjMuMTgsMS4xNS41NCwxLjU3LjM2LjQyLjgxLjc5LDEuMzUsMS4xMy41NC4zNCwxLjEzLjY2LDEuNzYuOTcuNjQuMzEsMS4yMi42NywxLjc2LDEuMDguNTQuNDEuOTkuOSwxLjM1LDEuNDcuMzYuNTcuNTQsMS4yOS41NCwyLjE1LDAsLjY3LS4xMywxLjMtLjM5LDEuODctLjI2LjU3LS42MywxLjA3LTEuMTEsMS40OC0uNDguNDItMS4wNy43NC0xLjc3Ljk4LS43LjI0LTEuNDkuMzYtMi4zOC4zNi0xLjE0LDAtMi4xNC0uMjUtMy4wMS0uNzUtLjg2LS41LTEuNDktMS4yMi0xLjg5LTIuMTUuNy0uMjgsMS4zLS40MywxLjkzLjA0LjI2LjE5LjQ3LjQyLjc1LjYxWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0ibTExMy4wOCwyOS4xM3YtMy41OGMwLS4xNiwwLS4zMi0uMDItLjQ4LS4wMi0uMTYtLjA1LS4zMS0uMS0uNDUtLjA1LS4xNC0uMTMtLjI4LS4yMy0uNDEtLjEzLS4xOS0uMzEtLjMyLS41My0uNDEtLjIyLS4wOS0uNDctLjEzLS43Ny0uMTMtLjIzLDAtLjQzLjA0LS42LjEtLjE3LjA2LS4zMS4xNC0uNDMuMjMtLjExLjA5LS4yLjE4LS4yNy4yNy0uMDYuMDktLjExLjE2LS4xMy4yMXYtLjdoLTEuMDR2NS4zM2gxLjA0di0zLjI4YzAtLjExLDAtLjIzLjAyLS4zNy4wMS0uMTMuMDUtLjI2LjEtLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA5LS4wOC4xOS0uMTUuMzEtLjE5LjExLS4wNS4yNS0uMDcuNDEtLjA3LjIzLDAsLjQxLjA0LjU1LjExLjEzLjA3LjIzLjE3LjI5LjI5LjA2LjEyLjEuMjYuMTIuNDEuMDIuMTUuMDIuMy4wMi40N3YzLjM3aDEuMDJabS02LjE5LTMuMDloLTIuMjVzMC0uMDUsMC0uMTNjMC0uMDguMDEtLjE4LjAzLS4zLjAyLS4xMi4wNS0uMjUuMS0uMzguMDUtLjEzLjExLS4yNi4yLS4zNy4wOS0uMTIuMi0uMjEuMzQtLjI4LjE0LS4wNy4zMS0uMS41MS0uMDkuMTgsMCwuMzQuMDUuNDYuMTIuMTMuMDcuMjMuMTcuMzEuMjkuMDguMTIuMTQuMjQuMTguMzcuMDQuMTMuMDcuMjUuMDkuMzcuMDIuMTIuMDMuMjEuMDMuMjksMCwuMDgsMCwuMTIsMCwuMTNoMFptMS4wMy43MXYtLjNjMC0uMTQsMC0uMy0uMDItLjQ5LS4wMS0uMTktLjA1LS4zOS0uMDktLjYtLjA1LS4yMS0uMTItLjQxLS4yMS0uNjEtLjA5LS4yLS4yMi0uMzgtLjM3LS41NC0uMTUtLjE2LS4zNS0uMjktLjU4LS4zOS0uMjMtLjEtLjUxLS4xNC0uODMtLjE0LS4zMywwLS42Mi4wNS0uODYuMTQtLjI0LjA5LS40NS4yMi0uNjIuMzgtLjE3LjE2LS4zMS4zNC0uNDEuNTQtLjExLjItLjE5LjQtLjI1LjYyLS4wNi4yMS0uMS40Mi0uMTIuNjEtLjAyLjItLjAzLjM4LS4wMy41MywwLC4xNSwwLC4zMi4wMy41MS4wMi4xOS4wNi4zOC4xMi41OC4wNi4yLjE1LjQuMjYuNTkuMTIuMTkuMjcuMzYuNDYuNTIuMTkuMTUuNDIuMjguNy4zNi4yOC4wOS42MS4xNC45OS4xNC4yNSwwLC40Ny0uMDIuNjYtLjA2LjE5LS4wNC4zNS0uMDguNDgtLjEzLjEzLS4wNS4yMy0uMDkuMy0uMTMuMDctLjA0LjExLS4wNy4xMy0uMDhsLjE1LS45NHMtLjA2LjA0LS4xMi4wOWMtLjA3LjA1LS4xNi4xLS4yOS4xNi0uMTIuMDYtLjI4LjExLS40Ny4xNS0uMTkuMDQtLjQxLjA2LS42Ni4wNS0uMywwLS41NS0uMDUtLjc1LS4xMy0uMi0uMDgtLjM2LS4xOC0uNDgtLjMtLjEyLS4xMi0uMjEtLjI1LS4yNy0uMzgtLjA2LS4xMy0uMS0uMjYtLjExLS4zNy0uMDItLjExLS4wMy0uMi0uMDItLjI2di0uMTNoMy4yOVptLTUuNTYsMi4zOHYtNy4yM2gtMS4wMXY3LjIzaDEuMDFabS0zLjE4LTMuMDloLTIuMjVzMC0uMDUsMC0uMTNjMC0uMDguMDEtLjE4LjAzLS4zLjAyLS4xMi4wNS0uMjUuMS0uMzguMDUtLjEzLjExLS4yNi4yLS4zNy4wOS0uMTIuMi0uMjEuMzQtLjI4LjE0LS4wNy4zMS0uMS41MS0uMDkuMTgsMCwuMzQuMDUuNDYuMTIuMTMuMDcuMjMuMTcuMzEuMjkuMDguMTIuMTQuMjQuMTguMzcuMDQuMTMuMDcuMjUuMDkuMzcuMDIuMTIuMDMuMjEuMDMuMjksMCwuMDgsMCwuMTIsMCwuMTNoMFptMS4wMy43MXYtLjNjMC0uMTQsMC0uMy0uMDItLjQ5LS4wMS0uMTktLjA1LS4zOS0uMDktLjYtLjA1LS4yMS0uMTItLjQxLS4yMS0uNjEtLjA5LS4yLS4yMi0uMzgtLjM3LS41NC0uMTUtLjE2LS4zNS0uMjktLjU4LS4zOS0uMjMtLjEtLjUxLS4xNC0uODMtLjE0LS4zMywwLS42Mi4wNS0uODYuMTQtLjI0LjA5LS40NS4yMi0uNjIuMzgtLjE3LjE2LS4zMS4zNC0uNDEuNTQtLjExLjItLjE5LjQtLjI1LjYyLS4wNi4yMS0uMS40Mi0uMTIuNjEtLjAyLjItLjAzLjM4LS4wMy41MywwLC4xNSwwLC4zMi4wMy41MS4wMi4xOS4wNi4zOC4xMi41OC4wNi4yLjE1LjQuMjYuNTkuMTIuMTkuMjcuMzYuNDYuNTIuMTkuMTUuNDIuMjguNy4zNi4yOC4wOS42MS4xNC45OS4xNC4yNSwwLC40Ny0uMDIuNjUtLjA2LjE5LS4wNC4zNS0uMDguNDgtLjEzLjEzLS4wNS4yMy0uMDkuMy0uMTMuMDctLjA0LjExLS4wNy4xMy0uMDhsLjE1LS45NHMtLjA2LjA0LS4xMi4wOWMtLjA3LjA1LS4xNi4xLS4yOS4xNi0uMTIuMDYtLjI4LjExLS40Ny4xNS0uMTkuMDQtLjQxLjA2LS42Ni4wNS0uMywwLS41NS0uMDUtLjc1LS4xMy0uMi0uMDgtLjM2LS4xOC0uNDgtLjMtLjEyLS4xMi0uMjEtLjI1LS4yNi0uMzgtLjA2LS4xMy0uMS0uMjYtLjExLS4zNy0uMDItLjExLS4wMy0uMi0uMDItLjI2di0uMTNoMy4yOFptLTQuNy0yLjk1aC0xLjAxbC0xLjE2LDQuMTMtMS4xOC00LjEzaC0xLjA1bDEuNyw1LjMxLS4wOC4zNmMtLjAyLjExLS4wNS4yLS4xLjI5LS4wNS4wOS0uMTEuMTYtLjE4LjIxLS4wOC4wNS0uMTcuMDgtLjI5LjA4LS4xNCwwLS4yNi0uMDItLjM3LS4wNS0uMTEtLjAzLS4xOS0uMDYtLjI1LS4wOS0uMDYtLjAzLS4wOS0uMDUtLjA5LS4wNWwuMTEuODZzLjA0LjAyLjExLjA1Yy4wNy4wMy4xNy4wNi4zLjA5LjEzLjAzLjI4LjA0LjQ2LjA0LjIyLDAsLjQtLjA0LjU1LS4xMi4xNS0uMDguMjctLjE5LjM3LS4zMi4xLS4xNC4xOC0uMy4yNS0uNDguMDctLjE4LjEzLS4zOC4yLS41OWwxLjcyLTUuNThoMFptLTUuMDgsNS4zM3YtMy41OGMwLS4xNiwwLS4zMi0uMDItLjQ4LS4wMi0uMTYtLjA1LS4zMS0uMS0uNDUtLjA1LS4xNC0uMTMtLjI4LS4yMy0uNDEtLjEzLS4xOS0uMzEtLjMyLS41My0uNDEtLjIyLS4wOS0uNDctLjEzLS43Ny0uMTMtLjIzLDAtLjQzLjA0LS42LjEtLjE3LjA2LS4zMS4xNC0uNDMuMjMtLjEyLjA5LS4yLjE4LS4yNy4yNy0uMDYuMDktLjExLjE2LS4xMy4yMXYtLjdoLTEuMDR2NS4zM2gxLjA0di0zLjI4YzAtLjExLDAtLjIzLjAyLS4zNy4wMS0uMTMuMDUtLjI2LjEtLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA5LS4wOC4xOS0uMTUuMzEtLjE5LjExLS4wNS4yNS0uMDcuNDEtLjA3LjIzLDAsLjQxLjA0LjU1LjExLjEzLjA3LjIzLjE3LjI5LjI5LjA2LjEyLjEuMjYuMTIuNDEuMDIuMTUuMDIuMy4wMi40N3YzLjM3aDEuMDJabS02LjE5LTMuMDloLTIuMjVzMC0uMDUsMC0uMTNjMC0uMDguMDEtLjE4LjAzLS4zLjAyLS4xMi4wNS0uMjUuMS0uMzguMDUtLjEzLjExLS4yNi4yLS4zNy4wOS0uMTIuMi0uMjEuMzQtLjI4LjE0LS4wNy4zMS0uMS41MS0uMDkuMTgsMCwuMzQuMDUuNDYuMTIuMTMuMDcuMjMuMTcuMzEuMjkuMDguMTIuMTQuMjQuMTguMzcuMDQuMTMuMDcuMjUuMDkuMzcuMDIuMTIuMDMuMjEuMDMuMjksMCwuMDgsMCwuMTIsMCwuMTNoMFptMS4wMy43MXYtLjNjMC0uMTQsMC0uMy0uMDItLjQ5LS4wMS0uMTktLjA1LS4zOS0uMDktLjYtLjA1LS4yMS0uMTItLjQxLS4yMS0uNjEtLjA5LS4yLS4yMi0uMzgtLjM3LS41NC0uMTUtLjE2LS4zNS0uMjktLjU4LS4zOS0uMjMtLjEtLjUxLS4xNC0uODMtLjE0LS4zMywwLS42Mi4wNS0uODYuMTQtLjI0LjA5LS40NS4yMi0uNjIuMzgtLjE3LjE2LS4zMS4zNC0uNDEuNTQtLjExLjItLjE5LjQtLjI1LjYyLS4wNi4yMS0uMS40Mi0uMTIuNjEtLjAyLjItLjAzLjM4LS4wMy41MywwLC4xNSwwLC4zMi4wMy41MS4wMi4xOS4wNi4zOC4xMi41OC4wNi4yLjE1LjQuMjYuNTkuMTIuMTkuMjcuMzYuNDYuNTIuMTkuMTUuNDIuMjguNy4zNi4yOC4wOS42MS4xNC45OS4xNC4yNSwwLC40Ny0uMDIuNjYtLjA2LjE5LS4wNC4zNS0uMDguNDgtLjEzLjEzLS4wNS4yMy0uMDkuMy0uMTMuMDctLjA0LjExLS4wNy4xMy0uMDhsLjE1LS45NHMtLjA2LjA0LS4xMi4wOWMtLjA3LjA1LS4xNi4xLS4yOS4xNi0uMTIuMDYtLjI4LjExLS40Ny4xNS0uMTkuMDQtLjQxLjA2LS42Ni4wNS0uMywwLS41NS0uMDUtLjc1LS4xMy0uMi0uMDgtLjM2LS4xOC0uNDgtLjMtLjEyLS4xMi0uMjEtLjI1LS4yNi0uMzgtLjA2LS4xMy0uMS0uMjYtLjExLS4zNy0uMDItLjExLS4wMy0uMi0uMDItLjI2di0uMTNoMy4yOFptLTYuMzEtMi4zNWMwLC4yMy0uMDIuNDMtLjA3LjYtLjA1LjE2LS4xMi4zLS4yMi40Mi0uMDguMTEtLjE4LjE5LS4yNy4yNS0uMS4wNi0uMTkuMTEtLjI5LjEzLS4wOS4wMy0uMTguMDUtLjI1LjA1LS4wNywwLS4xMi4wMS0uMTUuMDFoLTEuMDl2LTIuOTZoMS4wOWMuMDgsMCwuMTcsMCwuMjcuMDIuMTEuMDIuMjIuMDUuMzMuMS4xMS4wNS4yMi4xMy4zMi4yNC4xLjExLjE4LjI2LjI0LjQ0LjA2LjE4LjA5LjQyLjA5LjdoMFptMS4yNCwwYzAtLjM5LS4wNS0uNzMtLjE0LTEuMDEtLjA5LS4yOC0uMjItLjUyLS4zOC0uNzEtLjE2LS4xOS0uMzUtLjM0LS41Ni0uNDUtLjIxLS4xMS0uNDUtLjE5LS42OS0uMjQtLjI1LS4wNS0uNS0uMDctLjc3LS4wN2gtMi4yM3Y3LjJoMS4ydi0yLjI5aDEuMDdjLjIxLDAsLjQyLS4wMS42NC0uMDQuMjEtLjAzLjQyLS4wOS42My0uMTguMjEtLjA5LjQxLS4yMy42LS40Mi4yLS4xOC4zNS0uNDMuNDYtLjczLjExLS4zLjE3LS42Ni4xNy0xLjA2aDBabTU1LjU0LDMuMTRjMCwuMTMtLjAzLjI1LS4wOS4zNC0uMDYuMS0uMTQuMTktLjI0LjI2LS4xLjA3LS4yMS4xMy0uMzQuMTgtLjA3LjAzLS4xNC4wNS0uMjEuMDYtLjA3LjAxLS4xMy4wMi0uMTkuMDItLjE3LDAtLjMzLS4wMy0uNDctLjA5LS4xNC0uMDYtLjI1LS4xNi0uMzMtLjI5LS4wOS0uMTMtLjEzLS4zLS4xMy0uNSwwLS4wNSwwLS4xMSwwLS4xNiwwLS4wNi4wMi0uMTEuMDMtLjE2LjA1LS4xNi4xNC0uMjkuMjctLjQuMTMtLjEuMjgtLjE4LjQ3LS4yMi4xOS0uMDUuNC0uMDcuNjQtLjA3LjExLDAsLjIxLDAsLjI5LjAxLjA5LDAsLjE2LjAyLjIxLjAzLjA1LDAsLjA4LjAxLjA4LjAydi45N2gwWm0xLjA0LDEuNTl2LTMuNWMwLS4yMy0uMDEtLjQzLS4wNC0uNi0uMDMtLjE3LS4wNy0uMzItLjE0LS40NS0uMDctLjEzLS4xNi0uMjYtLjI4LS4zOC0uMTYtLjE2LS4zNy0uMjktLjYzLS4zOS0uMjctLjEtLjU5LS4xNS0uOTgtLjE1LS4yMywwLS40My4wMi0uNjEuMDYtLjE3LjAzLS4zMi4wOC0uNDQuMTItLjEyLjA1LS4yMS4wOS0uMjcuMTItLjA2LjA0LS4wOS4wNS0uMDkuMDVsLS4xOC45NHMuMDMtLjAzLjA5LS4wN2MuMDYtLjA1LjE0LS4xLjI2LS4xNi4xMi0uMDYuMjYtLjEyLjQzLS4xNy4xNy0uMDUuMzctLjA4LjU5LS4wOC4yOCwwLC41MS4wMy42OC4wOS4xNy4wNi4zLjE0LjM3LjI1LjA3LjA5LjEyLjE4LjE0LjI3LjAzLjA5LjA0LjE4LjA0LjI3LDAsLjA5LDAsLjE2LDAsLjIzdi4yN3MtLjAzLDAtLjA4LS4wMWMtLjA1LDAtLjEzLS4wMS0uMjItLjAyLS4wOSwwLS4yLS4wMS0uMzEtLjAxLS4yLDAtLjQxLjAxLS42MS4wNC0uMjEuMDMtLjQuMDctLjU5LjE0LS4xOS4wNi0uMzcuMTUtLjUzLjI2LS4xNi4xMS0uMy4yNC0uNDEuNC0uMDkuMTMtLjE2LjI2LS4yLjM5LS4wNS4xMy0uMDcuMjQtLjA5LjM1LS4wMi4xMS0uMDIuMTktLjAyLjI2LDAsLjExLjAxLjIzLjA0LjM3LjAzLjE0LjA3LjI3LjE0LjQxLjA2LjE0LjE1LjI3LjI3LjM4LjEyLjEyLjI2LjIxLjQ0LjI5LjE3LjA4LjM4LjEyLjYzLjEzLjI2LDAsLjUtLjAyLjctLjA5LjIxLS4wNi4zOS0uMTUuNTQtLjI3LjE1LS4xMi4yOC0uMjYuMzktLjQxdi4zMWMwLC4wNSwwLC4xLDAsLjE1LDAsLjA1LjAzLjEuMDcuMTQuMDMuMDMuMDcuMDUuMTIuMDcuMDUuMDEuMDkuMDIuMTMuMDIuMDQsMCwuMDcsMCwuMDksMGguNTZabS00LjE3LTQuMjRsLS4xNS0uOTdjLS4wNS0uMDMtLjA5LS4wNi0uMTMtLjA4LS4wNC0uMDItLjA3LS4wNC0uMS0uMDUtLjAzLS4wMS0uMDctLjAzLS4xMi0uMDQtLjA2LS4wMS0uMTEtLjAyLS4xNS0uMDMtLjA0LDAtLjA5LDAtLjE0LDAtLjA5LDAtLjE3LDAtLjI1LjAxLS4wOC4wMS0uMTYuMDMtLjI0LjA3LS4wOC4wMy0uMTUuMDgtLjIyLjE1LS4wOC4wOC0uMTUuMTUtLjIuMjMtLjA1LjA4LS4wOS4xNS0uMTIuMjEtLjAzLjA2LS4wNS4xMS0uMDYuMTR2LS43MmgtMS4wNHY1LjMzaDEuMDR2LTMuMDNjMC0uMDksMC0uMTksMC0uMzEsMC0uMTEuMDItLjIzLjA0LS4zNS4wMy0uMTIuMDctLjI0LjEyLS4zNi4wNi0uMS4xMi0uMTguMjEtLjI2LjA4LS4wOC4xOC0uMTQuMjktLjE4LjExLS4wNC4yNC0uMDcuMzgtLjA3LjE3LDAsLjMzLjAzLjQ2LjA5LjEzLjA2LjI2LjEzLjM3LjIzaDBabS01LjE1LDIuNjVjMCwuMTMtLjAzLjI1LS4wOS4zNC0uMDYuMS0uMTQuMTktLjI0LjI2LS4xLjA3LS4yMS4xMy0uMzQuMTgtLjA3LjAzLS4xNC4wNS0uMjEuMDYtLjA3LjAxLS4xNC4wMi0uMTkuMDItLjE3LDAtLjMzLS4wMy0uNDctLjA5LS4xNC0uMDYtLjI1LS4xNi0uMzMtLjI5LS4wOC0uMTMtLjEzLS4zLS4xMy0uNSwwLS4wNSwwLS4xMSwwLS4xNiwwLS4wNi4wMi0uMTEuMDMtLjE2LjA1LS4xNi4xNC0uMjkuMjctLjQuMTMtLjEuMjgtLjE4LjQ3LS4yMi4xOS0uMDUuNC0uMDcuNjQtLjA3LjExLDAsLjIxLDAsLjI5LjAxLjA5LDAsLjE2LjAyLjIxLjAzLjA1LDAsLjA4LjAxLjA4LjAydi45N2gwWm0xLjA0LDEuNTl2LTMuNWMwLS4yMy0uMDEtLjQzLS4wNC0uNi0uMDMtLjE3LS4wNy0uMzItLjE0LS40NS0uMDctLjEzLS4xNi0uMjYtLjI4LS4zOC0uMTYtLjE2LS4zNy0uMjktLjYzLS4zOS0uMjctLjEtLjU5LS4xNS0uOTgtLjE1LS4yMywwLS40My4wMi0uNjEuMDYtLjE3LjAzLS4zMi4wOC0uNDQuMTItLjEyLjA1LS4yMS4wOS0uMjcuMTItLjA2LjA0LS4wOS4wNS0uMDkuMDVsLS4xOS45NHMuMDMtLjAzLjA5LS4wN2MuMDYtLjA1LjE0LS4xLjI2LS4xNi4xMi0uMDYuMjYtLjEyLjQzLS4xNy4xNy0uMDUuMzctLjA4LjU5LS4wOC4yOCwwLC41MS4wMy42OC4wOS4xNy4wNi4zLjE0LjM3LjI1LjA3LjA5LjEyLjE4LjE0LjI3LjAzLjA5LjA0LjE4LjA0LjI3LDAsLjA5LDAsLjE2LDAsLjIzdi4yN3MtLjAzLDAtLjA4LS4wMWMtLjA1LDAtLjEzLS4wMS0uMjItLjAyLS4wOSwwLS4yLS4wMS0uMzEtLjAxLS4yLDAtLjQxLjAxLS42MS4wNC0uMjEuMDMtLjQuMDctLjU5LjE0LS4xOS4wNi0uMzcuMTUtLjUzLjI2LS4xNi4xMS0uMy4yNC0uNDEuNC0uMDkuMTMtLjE2LjI2LS4yLjM5LS4wNS4xMy0uMDcuMjQtLjA5LjM1LS4wMi4xMS0uMDIuMTktLjAyLjI2LDAsLjExLjAxLjIzLjA0LjM3LjAzLjE0LjA3LjI3LjE0LjQxLjA2LjE0LjE1LjI3LjI3LjM4LjEyLjEyLjI2LjIxLjQ0LjI5LjE3LjA4LjM5LjEyLjYzLjEzLjI2LDAsLjUtLjAyLjctLjA5LjIxLS4wNi4zOS0uMTUuNTQtLjI3LjE1LS4xMi4yOC0uMjYuMzgtLjQxdi4zMWMwLC4wNSwwLC4xLjAxLjE1LDAsLjA1LjAzLjEuMDcuMTQuMDMuMDMuMDcuMDUuMTIuMDcuMDUuMDEuMDkuMDIuMTMuMDIuMDQsMCwuMDcsMCwuMDksMGguNTZabS01LjgzLjQ1YzAsLjEyLS4wMy4yMy0uMS4zMi0uMDcuMDktLjE2LjE2LS4yNy4yMi0uMTEuMDYtLjI0LjEtLjM3LjEzLS4xMy4wMy0uMjcuMDQtLjQuMDQtLjI2LDAtLjQ4LS4wMy0uNjctLjA5LS4xOS0uMDYtLjMzLS4xNS0uNDQtLjI1LS4xLS4xMS0uMTUtLjI0LS4xNS0uMzksMC0uMS4wMi0uMTkuMDUtLjI4LjAzLS4wOC4wNy0uMTUuMTItLjIxLjA1LS4wNi4wOS0uMS4xMi0uMTMuMDQtLjAzLjA1LS4wNS4wNi0uMDVoLjkxYy4yMywwLC40Mi4wMy41Ny4wNy4xNS4wNC4yNi4wOS4zNS4xNi4wOC4wNy4xNC4xNC4xOC4yMi4wMy4wOC4wNS4xNi4wNS4yNWgwWm0tLjEzLTQuMDNjMCwuMjQtLjA0LjQ0LS4xMi42MS0uMDguMTctLjIuMy0uMzYuMzktLjE2LjA5LS4zNi4xNC0uNi4xNC0uMiwwLS4zNy0uMDUtLjUyLS4xNS0uMTQtLjEtLjI1LS4yMy0uMzItLjQtLjA3LS4xNy0uMTEtLjM3LS4xMS0uNTlzLjA0LS40NC4xMS0uNmMuMDctLjE2LjE4LS4yOS4zMy0uMzcuMTUtLjA4LjMzLS4xMy41Ni0uMTIuMTksMCwuMzYuMDQuNDkuMS4xMy4wNi4yNC4xNS4zMi4yNS4wOC4xLjE0LjIyLjE3LjM1LjA0LjEzLjA1LjI2LjA1LjM5aDBabTEuMTcsMy45OGMwLS41LS4xNy0uODYtLjUzLTEuMS0uMzYtLjI0LS44OS0uMzYtMS41OS0uMzUtLjA4LDAtLjE3LDAtLjI4LDAtLjExLDAtLjIyLDAtLjM0LDAtLjEyLDAtLjIyLS4wMi0uMzItLjA0LS4xLS4wMi0uMTgtLjA1LS4yNC0uMS0uMDYtLjA1LS4wOS0uMTEtLjEtLjE5LDAtLjA5LjAzLS4xNi4xLS4yMS4wNi0uMDUuMTUtLjA4LjI2LS4xLjExLS4wMi4yNC0uMDMuMzgtLjAzLjE0LDAsLjI5LDAsLjQ2LDAsLjQ0LDAsLjgyLS4wOCwxLjEzLS4yMy4zMS0uMTUuNTQtLjM2LjcxLS42NS4xNi0uMjguMjQtLjYyLjI0LTEuMDF2LTEuNzNoLS41M3MtLjA5LDAtLjEzLDBjLS4wNSwwLS4wOS4wMS0uMTQuMDMtLjA1LjAyLS4wOS4wNi0uMTMuMTEtLjA0LjA1LS4wNi4xMS0uMDcuMTcsMCwuMDYtLjAxLjExLDAsLjE1di4wN3MtLjAxLS4wMi0uMDQtLjA2Yy0uMDMtLjA0LS4wNy0uMDktLjE0LS4xNS0uMDctLjA2LS4xNS0uMTItLjI2LS4xOC0uMTEtLjA2LS4yNC0uMTEtLjM5LS4xNi0uMTYtLjA0LS4zNC0uMDYtLjU1LS4wNi0uMTQsMC0uMjguMDEtLjQzLjA1LS4xNS4wMy0uMy4wOS0uNDUuMTctLjE1LjA4LS4yOC4xOS0uNC4zMy0uMTIuMTQtLjIxLjMxLS4yOC41Mi0uMDcuMjEtLjEuNDYtLjEuNzYsMCwuMi4wMy4zOC4wOC41NC4wNS4xNi4xMi4yOS4xOS40LjA4LjExLjE1LjIuMjMuMjcuMDguMDcuMTQuMTMuMTkuMTYuMDUuMDMuMDguMDUuMDguMDUsMCwwLS4wNCwwLS4xLjAxLS4wNy4wMS0uMTUuMDMtLjI0LjA3LS4xLjAzLS4xOS4wOC0uMjkuMTUtLjEuMDctLjE4LjE2LS4yNC4yNy0uMDYuMTEtLjEuMjYtLjEuNDMsMCwuMTMsMCwuMjQuMDQuMzMuMDMuMDkuMDguMTcuMTQuMjMuMDYuMDYuMTIuMTEuMTkuMTQuMDcuMDQuMTMuMDYuMi4wOCwwLDAtLjAyLjAxLS4wNi4wNC0uMDQuMDItLjA5LjA2LS4xNC4xMS0uMDYuMDUtLjExLjEyLS4xNy4yLS4wNi4wOC0uMS4xOC0uMTQuMjktLjA0LjExLS4wNi4yNC0uMDYuMzksMCwuMjYuMDkuNDguMjYuNjguMTcuMi40Mi4zNS43NC40Ny4zMy4xMS43My4xNywxLjIuMTcuMjksMCwuNTctLjAzLjgyLS4wOS4yNi0uMDYuNDktLjE1LjY5LS4yNy4yLS4xMi4zNi0uMjguNDgtLjQ3LjEyLS4xOS4xOC0uNDEuMi0uNjdoMFptLTYuMjUuMDVjMCwuMTItLjAzLjIzLS4xLjMyLS4wNy4wOS0uMTYuMTYtLjI3LjIyLS4xMS4wNi0uMjQuMS0uMzcuMTMtLjE0LjAzLS4yNy4wNC0uNC4wNC0uMjYsMC0uNDgtLjAzLS42Ny0uMDktLjE5LS4wNi0uMzMtLjE1LS40NC0uMjUtLjEtLjExLS4xNS0uMjQtLjE1LS4zOSwwLS4xLjAyLS4xOS4wNi0uMjguMDMtLjA4LjA3LS4xNS4xMi0uMjEuMDUtLjA2LjA5LS4xLjEyLS4xMy4wNC0uMDMuMDUtLjA1LjA1LS4wNWguOTFjLjIzLDAsLjQyLjAzLjU3LjA3LjE1LjA0LjI2LjA5LjM1LjE2LjA4LjA3LjE0LjE0LjE4LjIyLjAzLjA4LjA1LjE2LjA1LjI1aDBabS0uMTMtNC4wM2MwLC4yNC0uMDQuNDQtLjEyLjYxLS4wOC4xNy0uMi4zLS4zNi4zOS0uMTYuMDktLjM2LjE0LS41OS4xNC0uMiwwLS4zNy0uMDUtLjUyLS4xNS0uMTQtLjEtLjI1LS4yMy0uMzItLjQtLjA3LS4xNy0uMTEtLjM3LS4xMS0uNTlzLjA0LS40NC4xMS0uNmMuMDctLjE2LjE4LS4yOS4zMy0uMzcuMTUtLjA4LjMzLS4xMy41Ni0uMTIuMiwwLC4zNi4wNC40OS4xLjEzLjA2LjI0LjE1LjMyLjI1LjA4LjEuMTQuMjIuMTcuMzUuMDQuMTMuMDUuMjYuMDUuMzloMFptMS4xNywzLjk4YzAtLjUtLjE3LS44Ni0uNTMtMS4xLS4zNi0uMjQtLjg5LS4zNi0xLjU5LS4zNS0uMDgsMC0uMTcsMC0uMjgsMC0uMTEsMC0uMjIsMC0uMzQsMC0uMTIsMC0uMjItLjAyLS4zMi0uMDQtLjEtLjAyLS4xOC0uMDUtLjI0LS4xLS4wNi0uMDUtLjA5LS4xMS0uMS0uMTksMC0uMDkuMDMtLjE2LjEtLjIxLjA2LS4wNS4xNS0uMDguMjYtLjEuMTEtLjAyLjI0LS4wMy4zOC0uMDMuMTQsMCwuMjksMCwuNDYsMCwuNDQsMCwuODItLjA4LDEuMTMtLjIzLjMxLS4xNS41NC0uMzYuNzEtLjY1LjE2LS4yOC4yNC0uNjIuMjQtMS4wMXYtMS43M2gtLjUzcy0uMDksMC0uMTMsMGMtLjA1LDAtLjA5LjAxLS4xNC4wMy0uMDUuMDItLjA5LjA2LS4xNC4xMS0uMDQuMDUtLjA2LjExLS4wNy4xNywwLC4wNi0uMDEuMTEtLjAxLjE1di4wN3MtLjAxLS4wMi0uMDQtLjA2Yy0uMDMtLjA0LS4wNy0uMDktLjE0LS4xNS0uMDctLjA2LS4xNS0uMTItLjI2LS4xOC0uMTEtLjA2LS4yNC0uMTEtLjQtLjE2LS4xNi0uMDQtLjM0LS4wNi0uNTUtLjA2LS4xNCwwLS4yOC4wMS0uNDMuMDUtLjE1LjAzLS4zLjA5LS40NS4xNy0uMTUuMDgtLjI4LjE5LS40LjMzLS4xMi4xNC0uMjEuMzEtLjI4LjUyLS4wNy4yMS0uMS40Ni0uMS43NiwwLC4yLjAzLjM4LjA4LjU0LjA1LjE2LjEyLjI5LjE5LjQuMDguMTEuMTUuMi4yMy4yNy4wOC4wNy4xNC4xMy4xOS4xNi4wNS4wMy4wOC4wNS4wOC4wNSwwLDAtLjA0LDAtLjEuMDEtLjA3LjAxLS4xNS4wMy0uMjQuMDctLjEuMDMtLjE5LjA4LS4yOS4xNS0uMS4wNy0uMTguMTYtLjI0LjI3LS4wNi4xMS0uMS4yNi0uMS40MywwLC4xMywwLC4yNC4wNC4zMy4wMy4wOS4wOC4xNy4xNC4yMy4wNi4wNi4xMi4xMS4xOS4xNC4wNy4wNC4xMy4wNi4xOS4wOCwwLDAtLjAyLjAxLS4wNi4wNC0uMDQuMDItLjA4LjA2LS4xNC4xMS0uMDYuMDUtLjExLjEyLS4xNy4yLS4wNi4wOC0uMS4xOC0uMTQuMjktLjA0LjExLS4wNi4yNC0uMDYuMzksMCwuMjYuMDkuNDguMjYuNjhzLjQyLjM1Ljc0LjQ3Yy4zMy4xMS43My4xNywxLjIuMTcuMjksMCwuNTctLjAzLjgyLS4wOS4yNi0uMDYuNDktLjE1LjY5LS4yNy4yLS4xMi4zNi0uMjguNDgtLjQ3LjEyLS4xOS4xOC0uNDEuMi0uNjdoMFptLTQ2LjE4LS40di0zLjU4YzAtLjE2LDAtLjMyLS4wMi0uNDgtLjAyLS4xNi0uMDUtLjMxLS4xLS40NS0uMDUtLjE0LS4xMy0uMjgtLjIzLS40MS0uMTMtLjE5LS4zMS0uMzItLjUzLS40MS0uMjItLjA5LS40Ny0uMTMtLjc3LS4xMy0uMjMsMC0uNDMuMDQtLjYuMS0uMTcuMDYtLjMxLjE0LS40My4yMy0uMTIuMDktLjIuMTgtLjI3LjI3LS4wNi4wOS0uMTEuMTYtLjEzLjIxdi0uN2gtMS4wNHY1LjMzaDEuMDR2LTMuMjhjMC0uMTEsMC0uMjMuMDItLjM3LjAxLS4xMy4wNS0uMjYuMS0uMzkuMDUtLjEzLjEzLS4yNC4yNC0uMzUuMDktLjA4LjE5LS4xNS4zMS0uMTkuMTEtLjA1LjI1LS4wNy40MS0uMDcuMjMsMCwuNDEuMDQuNTUuMTEuMTMuMDcuMjMuMTcuMjkuMjkuMDYuMTIuMS4yNi4xMi40MS4wMi4xNS4wMi4zLjAyLjQ3djMuMzdoMS4wMlptLTYuMzUtMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIxLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjEzLjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNy0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM2LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE5Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTItLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMi0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wNy4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDYuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzkuMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOS0uNDF2LjMxYzAsLjA1LDAsLjEsMCwuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptLTYuMjQtMS4yNmMtLjA1LjA2LS4xMS4xMy0uMTguMTgtLjA3LjA2LS4xNS4xMS0uMjQuMTYtLjExLjA1LS4yMi4wOS0uMzIuMTEtLjEuMDItLjIxLjAzLS4zMi4wMy0uMjEsMC0uMzktLjA1LS41NC0uMTUtLjE1LS4wOS0uMjYtLjIzLS4zNS0uNC0uMDktLjE3LS4xNS0uMzctLjItLjU5LS4wNC0uMjMtLjA2LS40Ny0uMDctLjc0LDAtLjE1LDAtLjMxLjAyLS40OS4wMS0uMTguMDQtLjM2LjA4LS41My4wNC0uMTguMS0uMzQuMTgtLjQ5LjA4LS4xNS4xOS0uMjcuMzMtLjM2LjE0LS4wOS4zMS0uMTQuNTItLjE0LjE5LDAsLjM0LjAzLjQ4LjA4LjEzLjA1LjI0LjEzLjMyLjIyLjA4LjA4LjEzLjE4LjE4LjI4LjA0LjEuMDcuMjEuMDguMzIuMDEuMTEuMDIuMjIuMDIuMzJ2Mi4xN2gwWm0xLjA0LDEuMjZ2LTcuMjNoLTEuMDR2Mi40cy0uMDEtLjAyLS4wNC0uMDZjLS4wMy0uMDQtLjA3LS4wOS0uMTItLjE1LS4wNi0uMDYtLjE0LS4xMi0uMjMtLjE4LS4xLS4wNi0uMjItLjExLS4zNi0uMTUtLjE0LS4wNC0uMzItLjA2LS41MS0uMDYtLjI4LDAtLjUyLjA1LS43My4xMy0uMjEuMDktLjM5LjIxLS41NC4zNi0uMTUuMTUtLjI4LjMyLS4zOC41MS0uMS4xOS0uMTguMzktLjI0LjYtLjA2LjIxLS4xLjQyLS4xMy42Mi0uMDMuMjEtLjA0LjQtLjA0LjU4LDAsLjI5LjAyLjU3LjA3Ljg0LjA1LjI3LjEyLjUyLjIxLjc1LjEuMjMuMjMuNDMuMzkuNi4xNi4xNy4zNS4zLjU3LjQuMjMuMDkuNDkuMTQuNzkuMTMuMTksMCwuMzYtLjAzLjUyLS4wOC4xNS0uMDUuMy0uMTIuNDMtLjIxLjEzLS4wOS4yNy0uMi4zOS0uMzJ2LjUzaC45OVptLTYuNDYtMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIxLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjE0LjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNi0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM3LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE5Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTMtLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMi0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wNy4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDcuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzguMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOS0uNDF2LjMxYzAsLjA1LDAsLjEsMCwuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptLTYuMTQtMi4xNWMwLC4xOS0uMDIuMzYtLjA3LjQ5LS4wNS4xMy0uMTIuMjQtLjIxLjMzLS4xMS4xMS0uMjQuMTgtLjM4LjIyLS4xNC4wNC0uMjkuMDctLjQ0LjA3LS4xNSwwLS4yOSwwLS40MiwwaC0xLjAzdi0yLjIxaDEuMDNjLjE2LDAsLjMyLDAsLjQ4LjAyLjE2LjAxLjMuMDQuNDQuMDkuMTMuMDUuMjUuMTIuMzQuMjIuMDguMDkuMTUuMi4xOS4zMy4wNS4xMi4wNy4yNy4wNy40NGgwWm0tLjI2LTMuMDZjMCwuMi0uMDQuMzctLjEuNS0uMDcuMTMtLjE1LjIzLS4yNi4zLS4xLjA4LS4yMS4xMy0uMzMuMTYtLjExLjAzLS4yMi4wNS0uMzEuMDYtLjEsMC0uMTcuMDEtLjIyLDBoLTEuMDd2LTIuMDVoMS4wN3MuMSwwLC4xNywwYy4wNywwLC4xNS4wMS4yNC4wMi4wOC4wMS4xNy4wMy4yNS4wNi4wOC4wMy4xNS4wNy4yLjEyLjEyLjA5LjIxLjIuMjcuMzMuMDYuMTMuMDkuMjkuMDkuNDhoMFptMS41LDMuMDRjMC0uMTQtLjAxLS4yNy0uMDQtLjQxLS4wMy0uMTQtLjA4LS4yNy0uMTUtLjM5LS4wNy0uMTMtLjE2LS4yNC0uMjgtLjM1LS4xNC0uMTMtLjMtLjIzLS40Ny0uMjktLjE3LS4wNy0uMzUtLjExLS41Mi0uMTQuMTItLjA0LjIzLS4wOS4zNS0uMTUuMTItLjA2LjIyLS4xMy4zMi0uMi4xLS4wOC4xOC0uMTYuMjUtLjI2LjA4LS4xNC4xNS0uMjkuMi0uNDcuMDUtLjE4LjA4LS4zOC4wOC0uNjEsMC0uMjYtLjA0LS41LS4xMy0uNy0uMDgtLjItLjItLjM3LS4zNC0uNTEtLjE0LS4xNC0uMy0uMjQtLjQ4LS4zMi0uMjItLjEtLjQ2LS4xNy0uNy0uMi0uMjQtLjAzLS41MS0uMDUtLjc5LS4wNWgtMi4yN3Y3LjJoMi4yNWMuMTcsMCwuMzYsMCwuNTUtLjAxLjE5LS4wMS4zOC0uMDMuNTctLjA3LjE5LS4wNC4zNy0uMS41NS0uMTcuMTctLjA4LjMzLS4xOC40Ny0uMzEuMTUtLjE2LjI3LS4zMi4zNi0uNS4wOS0uMTguMTQtLjM2LjE4LS41NS4wMy0uMTkuMDUtLjM3LjA1LS41NmgwWm0xMTIuNDksMi4xN3YtMy41OGMwLS4xNiwwLS4zMi0uMDItLjQ4LS4wMi0uMTYtLjA1LS4zMS0uMS0uNDUtLjA1LS4xNC0uMTMtLjI4LS4yMy0uNDEtLjEzLS4xOS0uMzEtLjMyLS41My0uNDEtLjIyLS4wOS0uNDctLjEzLS43Ny0uMTMtLjIzLDAtLjQzLjA0LS42LjEtLjE3LjA2LS4zMS4xNC0uNDMuMjMtLjExLjA5LS4yLjE4LS4yNy4yNy0uMDYuMDktLjExLjE2LS4xMy4yMXYtLjdoLTEuMDR2NS4zM2gxLjA0di0zLjI4YzAtLjExLDAtLjIzLjAyLS4zNy4wMS0uMTMuMDUtLjI2LjEtLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA5LS4wOC4xOS0uMTUuMzEtLjE5LjExLS4wNS4yNS0uMDcuNDEtLjA3LjIzLDAsLjQxLjA0LjU1LjExLjEzLjA3LjIzLjE3LjI5LjI5LjA2LjEyLjEuMjYuMTIuNDEuMDIuMTUuMDIuMy4wMi40N3YzLjM3aDEuMDJabS01LjM3LDB2LTUuMzNoLTEuMDN2NS4zM2gxLjAzWm0uMDktNi43YzAtLjEtLjAzLS4yLS4wOC0uMjctLjA1LS4wOC0uMTItLjE0LS4yMi0uMTgtLjA5LS4wNC0uMi0uMDctLjMxLS4wNy0uMTIsMC0uMjIuMDMtLjMxLjA4LS4wOS4wNS0uMTYuMTEtLjIxLjE5LS4wNS4wOC0uMDguMTYtLjA4LjI1LDAsLjEuMDIuMi4wNy4yOC4wNS4wOC4xMS4xNS4yLjE5LjA5LjA1LjIuMDcuMzQuMDcuMTIsMCwuMjMtLjAzLjMyLS4wNy4wOS0uMDUuMTYtLjExLjIxLS4xOS4wNS0uMDguMDgtLjE4LjA4LS4yOGgwWm0tMi4zNCw2Ljd2LTMuNTZjMC0uMTIsMC0uMjYtLjAyLS40MS0uMDEtLjE1LS4wNC0uMy0uMDgtLjQ0LS4wNC0uMTUtLjExLS4yOS0uMTktLjQzLS4wOC0uMTQtLjItLjI1LS4zNC0uMzYtLjEzLS4wOS0uMjgtLjE2LS40NC0uMi0uMTYtLjA0LS4zMS0uMDYtLjQ3LS4wNi0uMjEsMC0uNC4wMy0uNTYuMDktLjE2LjA2LS4zLjEyLS40Mi4yMS0uMTIuMDgtLjIxLjE3LS4yOS4yNS0uMDguMDktLjEzLjE2LS4xNy4yMy0uMDQuMDctLjA2LjExLS4wNy4xMiwwLS4wMy0uMDItLjA4LS4wNS0uMTUtLjAzLS4wNy0uMDgtLjE1LS4xNS0uMjQtLjA2LS4wOS0uMTUtLjE3LS4yNi0uMjUtLjA5LS4wNi0uMTktLjExLS4zLS4xNS0uMTEtLjA0LS4yMS0uMDctLjMyLS4wOC0uMTEtLjAyLS4yMS0uMDItLjMtLjAyLS4yMiwwLS40Mi4wMy0uNTguMDktLjE3LjA2LS4zLjEzLS40Mi4yMi0uMTEuMDktLjIuMTgtLjI3LjI4LS4wNy4wOS0uMTEuMTgtLjEzLjI1di0uNzJoLTEuMDN2NS4zM2gxLjAzdi0zLjI3YzAtLjIyLjAyLS40LjA1LS41NS4wMy0uMTQuMDgtLjI2LjE0LS4zNS4wNS0uMDkuMTItLjE2LjE4LS4yMi4wOC0uMDguMTYtLjEzLjI2LS4xOC4xLS4wNC4yMS0uMDcuMzQtLjA3LjE2LDAsLjI5LjAyLjM4LjA2LjEuMDQuMTguMDguMjQuMTUuMDguMDcuMTQuMTUuMTkuMjUuMDUuMDkuMDguMjEuMS4zNC4wMi4xMy4wMy4yOS4wMy40N3YzLjM3aDEuMDF2LTMuMjdjMC0uMTIsMC0uMjUuMDEtLjM4LjAxLS4xMy4wNC0uMjYuMDktLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA4LS4wOC4xOC0uMTQuMjktLjE4LjEtLjA0LjIxLS4wNi4zMy0uMDYuMTMsMCwuMjQuMDEuMzUuMDQuMS4wMy4yLjA4LjI5LjE2LjA3LjA3LjEzLjE0LjE2LjIxLjA0LjA3LjA2LjEyLjA3LjE2LjAxLjA1LjAzLjExLjA0LjE4LjAxLjA3LjAyLjE2LjAzLjI0LDAsLjA5LjAxLjE4LjAxLjI3djMuMzdoMS4wMVptLTkuMTItMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIxLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjEzLjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNi0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM3LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE4Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTItLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMi0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wOC4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDYuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzguMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOS0uNDF2LjMxYzAsLjA1LDAsLjEuMDEuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptLTUuMDMtMi42MnYtNC41OGgtMS4ydjQuNThjMCwuMTYsMCwuMzMtLjAxLjUsMCwuMTctLjAzLjM0LS4wNy40OS0uMDMuMTYtLjA5LjMtLjE2LjQzLS4xLjE1LS4yMy4yNy0uMzkuMzUtLjE2LjA4LS4zNS4xMi0uNTYuMTItLjE2LDAtLjMxLS4wMi0uNDQtLjA1LS4xNC0uMDMtLjI2LS4wNy0uMzctLjExLS4xLS4wNC0uMTktLjA4LS4yNS0uMTEtLjA2LS4wMy0uMDktLjA1LS4xLS4wNmwuMjYsMS4wNHMuMDMuMDEuMDguMDRjLjA1LjAzLjEyLjA2LjIyLjA5LjEuMDMuMjIuMDcuMzUuMDkuMTQuMDMuMjkuMDQuNDcuMDQuMDcsMCwuMTYsMCwuMjgsMCwuMTIsMCwuMjUtLjAzLjM5LS4wNi4xNC0uMDMuMjgtLjA4LjQzLS4xNS4xNC0uMDcuMjctLjE2LjM5LS4yNy4xMi0uMTEuMjMtLjI0LjMxLS4zOC4wOS0uMTQuMTYtLjMuMjItLjQ5LjA2LS4xOC4xLS40LjEyLS42NS4wMy0uMjUuMDQtLjU0LjA0LS44N2gwWm0zMS4xNiwyLjYydi0zLjU4YzAtLjE2LDAtLjMyLS4wMi0uNDgtLjAyLS4xNi0uMDUtLjMxLS4xLS40NS0uMDUtLjE0LS4xMy0uMjgtLjIzLS40MS0uMTMtLjE5LS4zMS0uMzItLjUzLS40MS0uMjItLjA5LS40Ny0uMTMtLjc3LS4xMy0uMjMsMC0uNDMuMDQtLjYuMS0uMTcuMDYtLjMxLjE0LS40My4yMy0uMTEuMDktLjIuMTgtLjI3LjI3LS4wNi4wOS0uMTEuMTYtLjEzLjIxdi0uN2gtMS4wNHY1LjMzaDEuMDR2LTMuMjhjMC0uMTEsMC0uMjMuMDItLjM3LjAxLS4xMy4wNS0uMjYuMS0uMzkuMDUtLjEzLjEzLS4yNC4yNC0uMzUuMDktLjA4LjE5LS4xNS4zMS0uMTkuMTEtLjA1LjI1LS4wNy40MS0uMDcuMjMsMCwuNDEuMDQuNTUuMTEuMTMuMDcuMjMuMTcuMjkuMjkuMDYuMTIuMS4yNi4xMi40MS4wMi4xNS4wMi4zLjAyLjQ3djMuMzdoMS4wMlptLTYuMzUtMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIyLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjE0LjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNi0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM3LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE5Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTMtLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMS0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wNy4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDYuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzkuMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOC0uNDF2LjMxYzAsLjA1LDAsLjEsMCwuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptMzIuNTEsMHYtNy4yM2gtMS4wMXY3LjIzaDEuMDFabS0zLjM1LTEuNTljMCwuMTMtLjAzLjI1LS4wOS4zNC0uMDYuMS0uMTQuMTktLjI0LjI2LS4xLjA3LS4yMS4xMy0uMzQuMTgtLjA3LjAzLS4xNC4wNS0uMjEuMDYtLjA3LjAxLS4xNC4wMi0uMTkuMDItLjE3LDAtLjMzLS4wMy0uNDctLjA5LS4xNC0uMDYtLjI1LS4xNi0uMzMtLjI5LS4wOC0uMTMtLjEzLS4zLS4xMy0uNSwwLS4wNSwwLS4xMSwwLS4xNiwwLS4wNi4wMi0uMTEuMDMtLjE2LjA1LS4xNi4xNC0uMjkuMjctLjQuMTMtLjEuMjgtLjE4LjQ3LS4yMi4xOS0uMDUuNC0uMDcuNjQtLjA3LjExLDAsLjIxLDAsLjI5LjAxLjA5LDAsLjE2LjAyLjIxLjAzLjA1LDAsLjA4LjAxLjA4LjAydi45N2gwWm0xLjA0LDEuNTl2LTMuNWMwLS4yMy0uMDEtLjQzLS4wNC0uNi0uMDMtLjE3LS4wNy0uMzItLjE0LS40NS0uMDYtLjEzLS4xNi0uMjYtLjI4LS4zOC0uMTYtLjE2LS4zNy0uMjktLjYzLS4zOS0uMjctLjEtLjU5LS4xNS0uOTgtLjE1LS4yMywwLS40My4wMi0uNjEuMDYtLjE3LjAzLS4zMi4wOC0uNDQuMTItLjEyLjA1LS4yMS4wOS0uMjcuMTItLjA2LjA0LS4wOS4wNS0uMDkuMDVsLS4xOS45NHMuMDMtLjAzLjA5LS4wN2MuMDYtLjA1LjE0LS4xLjI2LS4xNi4xMS0uMDYuMjYtLjEyLjQzLS4xNy4xNy0uMDUuMzctLjA4LjU5LS4wOC4yOCwwLC41MS4wMy42OC4wOS4xNy4wNi4zLjE0LjM3LjI1LjA3LjA5LjEyLjE4LjE0LjI3LjAzLjA5LjA0LjE4LjA0LjI3LDAsLjA5LDAsLjE2LDAsLjIzdi4yN3MtLjAzLDAtLjA4LS4wMWMtLjA1LDAtLjEzLS4wMS0uMjItLjAyLS4wOSwwLS4yLS4wMS0uMzItLjAxLS4yLDAtLjQxLjAxLS42MS4wNC0uMjEuMDMtLjQuMDctLjU5LjE0LS4xOS4wNi0uMzcuMTUtLjUzLjI2LS4xNi4xMS0uMy4yNC0uNDEuNC0uMDkuMTMtLjE2LjI2LS4yLjM5LS4wNS4xMy0uMDguMjQtLjA5LjM1LS4wMi4xMS0uMDIuMTktLjAyLjI2LDAsLjExLjAxLjIzLjA0LjM3LjAzLjE0LjA3LjI3LjE0LjQxLjA2LjE0LjE1LjI3LjI3LjM4LjEyLjEyLjI2LjIxLjQ0LjI5LjE3LjA4LjM5LjEyLjYzLjEzLjI2LDAsLjUtLjAyLjctLjA5LjIxLS4wNi4zOS0uMTUuNTQtLjI3LjE1LS4xMi4yOC0uMjYuMzktLjQxdi4zMWMwLC4wNSwwLC4xLDAsLjE1LDAsLjA1LjAzLjEuMDcuMTQuMDMuMDMuMDcuMDUuMTIuMDcuMDUuMDEuMDkuMDIuMTMuMDIuMDQsMCwuMDcsMCwuMDksMGguNTZabS01LjE1LDB2LTUuMzNoLTEuMDN2NS4zM2gxLjAzWm0uMDktNi43YzAtLjEtLjAzLS4yLS4wOC0uMjctLjA1LS4wOC0uMTItLjE0LS4yMi0uMTgtLjA5LS4wNC0uMi0uMDctLjMyLS4wNy0uMTIsMC0uMjIuMDMtLjMxLjA4LS4wOS4wNS0uMTYuMTEtLjIxLjE5LS4wNS4wOC0uMDguMTYtLjA4LjI1LDAsLjEuMDIuMi4wNy4yOC4wNS4wOC4xMS4xNS4yLjE5LjA5LjA1LjIuMDcuMzMuMDcuMTIsMCwuMjMtLjAzLjMyLS4wNy4wOS0uMDUuMTYtLjExLjIxLS4xOS4wNS0uMDguMDgtLjE4LjA4LS4yOGgwWm0tMi4xMiw1LjE5YzAtLjI2LS4wNi0uNDgtLjE3LS42Ny0uMTEtLjE5LS4yNi0uMzUtLjQ2LS40OC0uMTktLjEzLS40MS0uMjUtLjY1LS4zNS0uMTItLjA1LS4yNC0uMS0uMzctLjE2LS4xMi0uMDUtLjI0LS4xMi0uMzUtLjE5LS4xMS0uMDctLjE5LS4xNS0uMjYtLjI0LS4wNy0uMDktLjEtLjItLjEtLjMyLDAtLjIyLjA4LS4zOC4yMi0uNS4xNS0uMTEuMzUtLjE3LjYyLS4xNy4yMSwwLC40LjAyLjU2LjA1LjE2LjA0LjI5LjA5LjQuMTQuMTEuMDYuMTkuMS4yNC4xNS4wNS4wNC4wOC4wNi4wOC4wN2wtLjE1LS44OHMtLjAyLS4wMi0uMDctLjA2Yy0uMDUtLjA0LS4xMy0uMDgtLjIzLS4xMy0uMTEtLjA1LS4yNS0uMDktLjQyLS4xMi0uMTctLjAzLS4zOS0uMDUtLjY0LS4wNC0uMjMsMC0uNDUuMDMtLjY1LjA5LS4yLjA2LS4zOC4xNS0uNTMuMjgtLjE1LjEyLS4yNy4yNy0uMzYuNDUtLjA5LjE4LS4xMy4zOS0uMTMuNjIsMCwuMjQuMDUuNDUuMTMuNjIuMDguMTcuMTkuMzIuMzMuNDMuMTQuMTIuMjkuMjIuNDUuMzEuMTYuMDguMzMuMTYuNDkuMjMuMTYuMDcuMzIuMTUuNDUuMjIuMTQuMDguMjUuMTcuMzMuMjcuMDguMS4xMy4yMy4xMy4zOCwwLC4yNC0uMDguNDItLjIzLjU0LS4xNS4xMi0uMzguMTctLjcuMTctLjE5LDAtLjM3LS4wMy0uNTUtLjA4LS4xOC0uMDUtLjM0LS4xLS40OC0uMTctLjE0LS4wNi0uMjYtLjEyLS4zNC0uMTctLjA4LS4wNS0uMTMtLjA3LS4xMy0uMDhsLjE1LDEuMDFjLjA3LjA0LjE3LjA5LjI5LjE0LjEzLjA2LjMuMS41LjE0LjIuMDQuNDUuMDYuNzMuMDUuMjcsMCwuNTMtLjA0Ljc3LS4xMi4yNC0uMDguNDUtLjIuNjQtLjM2LjE0LS4xMi4yNi0uMjguMzQtLjQ2LjA4LS4xOS4xMy0uNDEuMTMtLjY2aDBabS01LjM3LTEuMTFjMCwuMzgtLjA0LjcxLS4xMi45OS0uMDguMjgtLjIxLjUtLjM3LjY2LS4xNy4xNi0uMzguMjQtLjY0LjI0LS4yOSwwLS41My0uMDctLjcxLS4yLS4xOC0uMTQtLjMyLS4zNC0uNC0uNjItLjA5LS4yOC0uMTMtLjY0LS4xMy0xLjA3LDAtLjI2LjAxLS41Mi4wNC0uNzYuMDMtLjI0LjA5LS40Ni4xOC0uNjUuMDktLjE5LjIxLS4zNC4zOC0uNDUuMTYtLjExLjM3LS4xNy42NC0uMTcuMjEsMCwuMzguMDUuNTIuMTMuMTQuMDguMjUuMTkuMzMuMzMuMDguMTQuMTQuMjkuMTguNDcuMDQuMTcuMDcuMzUuMDguNTQuMDEuMTkuMDIuMzguMDIuNTZoMFptMS4xLS4wMmMwLS4yOS0uMDItLjU4LS4wNy0uODUtLjA1LS4yNy0uMTItLjUzLS4yMy0uNzYtLjExLS4yMy0uMjQtLjQ0LS40Mi0uNjItLjE3LS4xOC0uMzktLjMyLS42NC0uNDItLjI1LS4xLS41NS0uMTUtLjktLjE2LS4zNCwwLS42NC4wNS0uOS4xNS0uMjYuMS0uNDguMjQtLjY2LjQxLS4xOC4xOC0uMzMuMzgtLjQ0LjYyLS4xMS4yNC0uMi40OS0uMjUuNzctLjA1LjI4LS4wOC41Ni0uMDguODYsMCwuNDEuMDQuNzguMTIsMS4xMS4wOC4zMy4yMS42Mi40Ljg2LjE4LjI0LjQyLjQyLjcyLjU1LjMuMTMuNjYuMTksMS4wOC4yLjM2LDAsLjY3LS4wNy45NS0uMjEuMjgtLjE0LjUyLS4zMy43MS0uNTguMTktLjI1LjM0LS41NC40NC0uODcuMS0uMzMuMTUtLjY4LjE1LTEuMDZoMFptLTUuMzIuNTZjMC0uMjMtLjA0LS40NC0uMS0uNjMtLjA3LS4xOS0uMTctLjM1LS4zLS41LS4xNC0uMTctLjI5LS4zMS0uNDctLjQzLS4xOC0uMTItLjM2LS4yMy0uNTUtLjMyLS4xOS0uMDktLjM4LS4xOC0uNTctLjI2LS4xOS0uMDgtLjM2LS4xNi0uNTItLjI1LS4xNi0uMDgtLjMtLjE4LS40MS0uMjgtLjA3LS4wNy0uMTItLjE0LS4xNi0uMi0uMDQtLjA2LS4wNy0uMTMtLjA4LS4yLS4wMi0uMDctLjAyLS4xNC0uMDItLjIyLDAtLjE0LjAzLS4yNy4wOS0uNC4wNi0uMTMuMTctLjI1LjMyLS4zNS4xLS4wNy4yMy0uMTIuNC0uMTUuMTYtLjAzLjM2LS4wNS42LS4wNS4xMiwwLC4yNCwwLC4zNi4wMy4xMi4wMi4yMy4wNC4zMy4wNi4xNS4wMy4yOC4wNy4zOC4xMS4xLjA0LjE4LjA3LjI0LjEuMDYuMDMuMDkuMDUuMTEuMDdsLS4yNC0xLjAzcy0uMDMtLjAyLS4wOS0uMDVjLS4wNi0uMDMtLjE1LS4wNi0uMjctLjEtLjEyLS4wMy0uMjgtLjA2LS40Ny0uMDktLjE5LS4wMy0uNDItLjA0LS42OS0uMDQtLjIxLDAtLjQxLjAyLS42Mi4wNS0uMi4wNC0uNC4xLS41OC4xOC0uMTkuMDgtLjM2LjItLjUyLjM0LS4xNC4xMi0uMjYuMjYtLjM0LjQtLjA5LjE0LS4xNS4yOS0uMTkuNDQtLjA0LjE1LS4wNi4zLS4wNi40NSwwLC4xNy4wMi4zNC4wNS41LjAzLjE2LjA5LjMxLjE3LjQ2LjEuMTYuMjEuMy4zNi40Mi4xNC4xMi4zMS4yMy40OC4zMi4xOC4wOS4zNi4xOS41NS4yNy4xOS4wOS4zOC4xOC41Ni4yOC4xOS4xLjM2LjIxLjUyLjM0LjEuMDguMTkuMTYuMjYuMjQuMDcuMDguMTIuMTcuMTYuMjcuMDMuMS4wNS4yMS4wNS4zNCwwLC4yLS4wNC4zNy0uMTIuNS0uMDguMTQtLjE5LjI2LS4zNS4zNi0uMDguMDYtLjE3LjEtLjI4LjEzLS4xMS4wMy0uMjIuMDYtLjMzLjA3LS4xMS4wMi0uMjEuMDItLjMuMDMtLjA5LDAtLjE1LDAtLjE4LDAtLjExLDAtLjIyLDAtLjMzLS4wMi0uMTEtLjAxLS4yMi0uMDMtLjMyLS4wNS0uMjItLjA0LS40MS0uMDktLjU2LS4xMy0uMTUtLjA0LS4yNy0uMDgtLjM0LS4xMS0uMDgtLjAzLS4xMi0uMDQtLjEzLS4wNWwuMjYsMS4wMXMuMDQuMDIuMS4wNWMuMDYuMDMuMTYuMDcuMjkuMTEuMTMuMDQuMy4wOC41MS4xMS4yMS4wMy40NS4wNS43NC4wNS4yMiwwLC40NS0uMDIuNjktLjA1LjI0LS4wNC40Ny0uMS43LS4xOS4yMy0uMDkuNDMtLjIyLjYxLS4zOS4xOC0uMTYuMzMtLjM3LjQ0LS42My4xMS0uMjUuMTYtLjU2LjE3LS45MloiLz4KICAgICAgPGc+CiAgICAgICAgPGc+CiAgICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJtMi41MiwxNS4wNGMuNDQtMy4wNSwzLjUtMy44OCwzLjc5LTYuNjYtMS4zOC42MS0zLjAzLjQyLTQuMjQtLjU4LTEuMzQsMi40MS0xLjQxLDQuNzguNDUsNy4yNFoiLz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJtOC40Myw2LjE5YzEuNTYtLjIzLDIuOS0xLjMzLDQuMTgtMi40MSwxLjc3LTEuNSw0LjI0LTMuMzUsNi41OS0zLjE3QzE1LS42OSwxMC40NS4yNCw3LjY4LDEuOTRjMS4wNywxLjE4LDEuMzEsMi44NC43NSw0LjI0WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im0yOC41LDE1Ljk5Yy0uNDQsMy4wNS0zLjUsMy44OC0zLjc5LDYuNjYsMS4zOC0uNjEsMy4wMy0uNDIsNC4yNC41OCwxLjM0LTIuNDEsMS40MS00Ljc4LS40NS03LjI0WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im0yMi41OSwyNC44NGMtMS41Ni4yMy0yLjksMS4zMy00LjE4LDIuNDEtMS43NywxLjUtNC4yNCwzLjM1LTYuNTksMy4xNyw0LjIsMS4zLDguNzQuMzcsMTEuNTEtMS4zMy0xLjA3LTEuMTgtMS4zMS0yLjg0LS43NS00LjI0WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0xNS45OSwyLjUyYzMuMDUuNDQsMy44NywzLjUsNi42NiwzLjc5LS42MS0xLjM4LS40Mi0zLjAzLjU4LTQuMjQtMi40MS0xLjM0LTQuNzgtMS40MS03LjI0LjQ1WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0yNC44NCw4LjQzYy4yMywxLjU2LDEuMzMsMi45LDIuNDEsNC4xOCwxLjUsMS43NywzLjM1LDQuMjQsMy4xNyw2LjU5LDEuMy00LjIuMzctOC43NC0xLjMzLTExLjUxLTEuMTgsMS4wNy0yLjg0LDEuMzItNC4yNC43NVoiLz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMTUuMDQsMjguNWMtMy4wNS0uNDQtMy44OC0zLjUtNi42Ni0zLjc5LjYxLDEuMzguNDIsMy4wMy0uNTgsNC4yNCwyLjQxLDEuMzQsNC43OCwxLjQxLDcuMjQtLjQ1WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im02LjE5LDIyLjU5Yy0uMjMtMS41Ni0xLjMzLTIuOS0yLjQxLTQuMTgtMS41LTEuNzctMy4zNC00LjI0LTMuMTctNi41OS0xLjMsNC4yLS4zNyw4Ljc0LDEuMzMsMTEuNTEsMS4xOC0xLjA3LDIuODQtMS4zMSw0LjI0LS43NVoiLz4KICAgICAgICAgIDwvZz4KICAgICAgICAgIDxnPgogICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0yOC43NiwyLjI2YzEuMywxLjMsMS4zLDMuNCwwLDQuNy0xLjMsMS4zLTMuNCwxLjMtNC43LDAtMS4zLTEuMy0xLjMtMy40LDAtNC43LDEuMy0xLjMsMy40LTEuMyw0LjcsMFoiLz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im02Ljk2LDI0LjA3YzEuMywxLjMsMS4zLDMuNCwwLDQuNy0xLjMsMS4zLTMuNCwxLjMtNC43LDAtMS4zLTEuMy0xLjMtMy40LDAtNC43LDEuMy0xLjMsMy40LTEuMyw0LjcsMFoiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im0yOC43NiwyOC43NmMtMS4zLDEuMy0zLjQsMS4zLTQuNywwLTEuMy0xLjMtMS4zLTMuNCwwLTQuNywxLjMtMS4zLDMuNC0xLjMsNC43LDBzMS4zLDMuNCwwLDQuN1oiLz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im02Ljk2LDYuOTZjLTEuMywxLjMtMy40LDEuMy00LjcsMC0xLjMtMS4zLTEuMy0zLjQsMC00LjcsMS4zLTEuMywzLjQtMS4zLDQuNywwLDEuMywxLjMsMS4zLDMuNCwwLDQuN1oiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0ibTE0LjEsMTguMzF2MS4xN2gyLjgzdi0yLjU1bDIuNDMsMi4zNWMuMi4xOS4xOS4zLjE5LjQ5di44czAsLjAyLDAsLjA0aDBzMCwuMDMsMCwuMDRoMHMwLC4wMywwLC4wNGgwczAsLjAyLDAsLjAzaDBzMCwuMDMsMCwuMDRoMHMwLC4wMywwLC4wNGgwczAsLjAzLDAsLjAzaDBzMCwuMDMsMCwuMDRoMHMwLC4wMywwLC4wNGgwczAsLjAzLDAsLjAzaDBzMCwuMDMsMCwuMDRoMHMwLC4wMiwwLC4wNGgwczAsLjAzLDAsLjAzaDBzMCwuMDMtLjAxLjA0aDBzMCwuMDMtLjAxLjAzaDBzMCwuMDIsMCwuMDNoMHMwLC4wMy0uMDEuMDRoMHMwLC4wMi0uMDEuMDNoMHMwLC4wMi0uMDEuMDNoMHMwLC4wMy0uMDEuMDRoMHMwLC4wMi0uMDEuMDNoMHMwLC4wMi0uMDEuMDNoMHMtLjAxLjAzLS4wMi4wNGgwczAsLjAyLS4wMS4wM2gwczAsLjAyLS4wMS4wM2gwczAsLjAzLS4wMi4wM2gwczAsLjAyLS4wMS4wM2gwcy0uMDEuMDItLjAyLjAzYzAsMCwwLDAtLjAxLjAxLDAsMCwwLC4wMS0uMDEuMDJoMHMwLC4wMi0uMDEuMDJjMCwwLDAsMC0uMDEuMDEsMCwwLS4wMS4wMS0uMDIuMDIsMCwwLDAsMC0uMDEuMDEsMCwwLDAsMC0uMDEuMDFoLS4wMXMtLjAxLjAyLS4wMS4wMmMwLDAsMCwwLS4wMS4wMWgwcy0uMDEuMDEtLjAyLjAyaDBzMCwwLS4wMS4wMWMwLDAsMCwwLS4wMS4wMWgtLjAxcy0uMDEuMDItLjAxLjAyYzAsMC0uMDIuMDEtLjAyLjAyaC0uMDFzMCwuMDItLjAxLjAyaC0uMDFzMCwuMDItLjAxLjAyYzAsMCwwLDAtLjAxLDAsMCwwLS4wMi4wMS0uMDMuMDJoMHMtLjAxLjAxLS4wMi4wMmgtLjAxcy0uMDEuMDEtLjAyLjAyaC0uMDFzLS4wMi4wMi0uMDMuMDJoLS4wMXMtLjAxLjAxLS4wMi4wMmgtLjAxcy0uMDEuMDEtLjAyLjAyaDBzLS4wMi4wMi0uMDMuMDJoLS4wMXMtLjAyLjAxLS4wMi4wMWMwLDAsMCwwLS4wMSwwLS4yLjA5LS40MS4xNC0uNjQuMTRoLTMuOTF2MS4xN2wtMi41LTIuNDgsMi41LTIuNDhoMFptMi44My00LjIxaDIuNTV2Mi44M2gtMS4xN2wyLjQ4LDIuNSwyLjQ4LTIuNWgtMS4xN3YtMy45MWMwLS4yMy0uMDUtLjQ1LS4xNC0uNjQsMCwwLDAsMCwwLS4wMXYtLjAycy0uMDEtLjAxLS4wMS0uMDFjMC0uMDEtLjAxLS4wMi0uMDItLjAzaDBzMC0uMDIsMC0uMDJoMHMwLS4wMiwwLS4wM2gwcy0uMDEtLjAzLS4wMi0uMDRoMHMwLS4wMi0uMDEtLjAzaDBzMC0uMDItLjAxLS4wM2gwcy0uMDEtLjAzLS4wMi0uMDRjMCwwLDAsMCwwLS4wMSwwLDAsMCwwLS4wMS0uMDFoMHMwLS4wMi0uMDEtLjAzaDBzLS4wMS0uMDMtLjAyLS4wM2gtLjAxcy0uMDEtLjAyLS4wMS0uMDJjMCwwLDAsMC0uMDEtLjAxLDAsMCwwLDAtLjAxLS4wMWgwcy0uMDEtLjAxLS4wMi0uMDJoMHMwLDAtLjAxLS4wMWgtLjAxcy0uMDEtLjAyLS4wMS0uMDJjMCwwLDAsMC0uMDEtLjAxLDAsMCwwLDAtLjAxLS4wMSwwLDAtLjAxLS4wMS0uMDItLjAyLDAsMCwwLDAtLjAxLDAsMCwwLDAsMC0uMDEtLjAxaC0uMDFzLS4wMS0uMDItLjAyLS4wMmMwLDAsMCwwLS4wMS0uMDEsMCwwLS4wMS0uMDEtLjAyLS4wMWgtLjAxczAtLjAyLS4wMS0uMDJoLS4wMXMtLjAxLS4wMi0uMDItLjAyaC0uMDFzLS4wMS0uMDItLjAyLS4wMmgtLjAxcy0uMDEtLjAyLS4wMi0uMDJoLS4wMXMtLjAyLS4wMi0uMDMtLjAyaDBzLS4wMS0uMDEtLjAyLS4wMmgtLjAxcy0uMDEtLjAxLS4wMi0uMDJoMHMtLjAyLS4wMi0uMDMtLjAyaDBzLS4wMS0uMDEtLjAyLS4wMmgtLjAxcy0uMDItLjAxLS4wMi0uMDJoMHMtLjAyLS4wMS0uMDMtLjAyaDBzLS4wMSwwLS4wMi0uMDFoLS4wMXMtLjAyLS4wMS0uMDMtLjAxaDBzLS4wMiwwLS4wMy0uMDFoLS4wMXMtLjAxLDAtLjAyLS4wMWgwcy0uMDIsMC0uMDMtLjAxaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaC0uMDFzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaC0uMDFzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wNCwwaDBzLS4wMiwwLS4wMywwaC0uMDFzLS4wMiwwLS4wNCwwaC0uOGMtLjE4LDAtLjI5LS4wMi0uNDkuMTlsLTIuMzUsMi40M2gwWm0tMi44MywyLjgzaC0yLjU1di0yLjgzaDEuMTdsLTIuNDgtMi41LTIuNDgsMi41aDEuMTd2My45MWMwLC4yMy4wNS40NS4xNC42NCwwLDAsMCwwLDAsLjAxdi4wMnMuMDEuMDEuMDEuMDFjMCwuMDEuMDEuMDIuMDIuMDNoMHMwLC4wMiwwLC4wMmgwczAsLjAyLDAsLjAzaDBzLjAxLjAzLjAyLjA0aDBzMCwuMDIuMDEuMDNoMHMwLC4wMi4wMS4wM2gwcy4wMS4wMy4wMi4wNGMwLDAsMCwwLDAsLjAxLDAsMCwwLDAsLjAxLjAxaDBzMCwuMDIuMDEuMDNoMHMuMDEuMDMuMDIuMDRoLjAxcy4wMS4wMi4wMS4wMmMwLDAsMCwwLC4wMS4wMSwwLDAsMCwwLC4wMS4wMWgwcy4wMS4wMS4wMi4wMmgwczAsMCwuMDEuMDFoLjAxcy4wMS4wMi4wMS4wMmMwLDAsMCwwLC4wMS4wMSwwLDAsMCwwLC4wMS4wMSwwLDAsLjAxLjAxLjAyLjAyLDAsMCwwLDAsLjAxLjAxLDAsMCwwLDAsLjAxLjAxaC4wMXMuMDEuMDIuMDIuMDJjMCwwLDAsMCwuMDEuMDEsMCwwLC4wMS4wMS4wMi4wMWguMDFzMCwuMDIuMDEuMDJoLjAxcy4wMS4wMi4wMi4wMmguMDFzLjAxLjAyLjAyLjAyaC4wMXMuMDEuMDIuMDIuMDJoLjAxcy4wMi4wMi4wMy4wMmgwcy4wMS4wMS4wMi4wMmguMDFzLjAxLjAxLjAyLjAyaDBzLjAyLjAyLjAzLjAyaDBzLjAxLjAxLjAyLjAyaDBzLjAyLjAxLjAyLjAyaDBzLjAyLjAxLjAzLjAyaDBzLjAxLjAxLjAyLjAxaC4wMXMuMDIuMDEuMDMuMDFoMHMuMDIsMCwuMDMuMDFoMHMuMDIsMCwuMDIuMDFoLjAxcy4wMiwwLC4wMy4wMWgwcy4wMiwwLC4wMywwaDBzLjAyLDAsLjAzLDBoMHMuMDIsMCwuMDMsMGgwcy4wMiwwLC4wMywwaC4wMXMuMDIsMCwuMDMsMGgwcy4wMiwwLC4wMywwaDBzLjAyLDAsLjAzLDBoLjAxcy4wMiwwLC4wMywwaDBzLjAyLDAsLjA0LDBoMHMuMDIsMCwuMDMsMGguMDFzLjAyLDAsLjA0LDBoLjhjLjE4LDAsLjI5LjAyLjQ5LS4xOWwyLjM1LTIuNDNoMFptMC0yLjgzbC0yLjQzLTIuMzVjLS4yMS0uMi0uMTktLjMtLjE5LS40OXYtLjhzMC0uMDIsMC0uMDNoMHMwLS4wMywwLS4wNGgwczAtLjAzLDAtLjA1aDBzMC0uMDIsMC0uMDRoMHMwLS4wMywwLS4wNGgwczAtLjAzLDAtLjA0aDBzMC0uMDMsMC0uMDNoMHMwLS4wMywwLS4wNGgwczAtLjAzLDAtLjA0aDBzMC0uMDMsMC0uMDNoMHMwLS4wMywwLS4wNGgwczAtLjAyLjAxLS4wNGgwczAtLjAyLDAtLjAzaDBzMC0uMDMuMDEtLjA0aDBzMC0uMDIsMC0uMDNoMHMwLS4wMywwLS4wM2gwczAtLjAzLjAxLS4wNGgwczAtLjAyLjAxLS4wM2gwczAtLjAyLjAxLS4wM2gwczAtLjAzLjAxLS4wNGgwczAtLjAyLjAxLS4wM2gwczAtLjAyLjAxLS4wM2gwcy4wMS0uMDMuMDItLjA0aDBzMC0uMDIuMDEtLjAzaDBzMC0uMDIuMDEtLjAzaDBzMC0uMDMuMDItLjAzaDBzMC0uMDIuMDEtLjAzaDBzLjAxLS4wMi4wMS0uMDNjMCwwLDAsMCwuMDEtLjAxLDAsMCwwLS4wMS4wMS0uMDJoMHMwLS4wMi4wMS0uMDJjMCwwLDAsMCwuMDEtLjAxLDAsMCwuMDEtLjAxLjAyLS4wMiwwLDAsMCwwLC4wMS0uMDEsMCwwLDAsMCwuMDEtLjAxaC4wMXMuMDEtLjAyLjAxLS4wMmMwLDAsMCwwLC4wMS0uMDFoMHMuMDEtLjAxLjAyLS4wMmgwczAsMCwuMDEtLjAxYzAsMCwwLDAsLjAxLS4wMWguMDFzLjAxLS4wMi4wMS0uMDJjMCwwLC4wMi0uMDEuMDItLjAyaC4wMXMwLS4wMi4wMS0uMDJoLjAxczAtLjAyLjAxLS4wMmMwLDAsMCwwLC4wMSwwLDAsMCwuMDItLjAxLjAzLS4wMmgwcy4wMS0uMDEuMDItLjAyaC4wMXMuMDEtLjAxLjAyLS4wMmguMDFzLjAyLS4wMi4wMy0uMDJoLjAxcy4wMS0uMDEuMDItLjAyaC4wMXMuMDEtLjAxLjAyLS4wMmgwcy4wMi0uMDIuMDMtLjAyaC4wMXMuMDItLjAxLjAyLS4wMWMwLDAsMCwwLC4wMSwwLC4yLS4wOS40MS0uMTQuNjQtLjE0aDMuOTF2LTEuMTdsMi41LDIuNDgtMi41LDIuNDh2LTEuMTdoLTIuODN2Mi41NVoiLz4KICAgICAgICAgIDxwb2x5Z29uIGNsYXNzPSJjbHMtNSIgcG9pbnRzPSIxNC4xMSAxOS40NSAxNC4xMSAxNi45MiAxMS41NyAxNi45MiAxMS41NyAxNC4xMSAxNC4xMSAxNC4xMSAxNC4xMSAxMS41NyAxNi45MiAxMS41NyAxNi45MiAxNC4xMSAxOS40NSAxNC4xMSAxOS40NSAxNi45MiAxNi45MiAxNi45MiAxNi45MiAxOS40NSAxNC4xMSAxOS40NSIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+",_t=i=>i.replace(/\s+/g," ").replace(/Telep\s+on/gi,"Telepon").replace(/Kunjunga\s+n/gi,"Kunjungan").replace(/Spes\s+ialis/gi,"Spesialis").trim();function Ea(i){let M=i.find(f=>/^SEP$/i.test(f.title)),t=M?kt(M.html):"",e=M&&new DOMParser().parseFromString(M.html,"text/html").querySelector('img[src*="qrserver"], img[src*="qr-code"]')?.getAttribute("src")||"",r=f=>_t(t.match(f)?.[1]||"")||"-",u=(f,R)=>r(new RegExp(`${f}\\s*:\\s*([\\s\\S]*?)(?=${R}|$)`,"i")),n=s("no_sep","sep")!=="-"?s("no_sep","sep"):r(/No\.?\s*SEP\s*[:.]?\s*([0-9A-Z]+)/i),L=r(/Tgl\.?\s*SEP\s*[:.]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i),l=s("no_hp","telepon")!=="-"?s("no_hp","telepon"):u("No\\.?\\s*Telepon","Sub\\/Spesialis"),d=s("kelas").replace(/^Kelas\s*/i,""),c=s("tgl_lahir","tglLahir").replace(/^:\s*/,"").split(/\s*\/\s*/)[0]?.trim()||"-",S=u("Kelamin","No\\.?\\s*Telepon"),g=s("dokter","dpjp"),w=s("kartu","no_kartu","noka"),I=s("norm","rekam_medis"),y=s("nama")||"-",k=w.match(/^(.*?)\s*\(MR\.?\s*([^)]+)\)$/i),K=k?`${a(k[1].trim())}<span class="sep-inline-mr">No.MR : ${a(k[2].trim())}</span>`:`${a(w)}${I!=="-"?`<span class="sep-inline-mr">No.MR : ${a(I)}</span>`:""}`,G=s("jenis_kunjungan")!=="-"?s("jenis_kunjungan"):r(/Jns\.?\s*Kunjungan\s*[:.]?\s*([\s\S]*?)(?:\s+Kls\.?\s*Hak|$)/i),Y=G.replace(/^-\s*/,"").split(/\s+-\s+|\n/).map(f=>f.trim()).filter(Boolean),E=Y.length>1?'<ul class="sep-multiline-list">'+Y.map(f=>`<li>${a(f)}</li>`).join("")+"</ul>":a(G),P=s("peserta","jenis_peserta")!=="-"?s("peserta","jenis_peserta"):u("(?<!Nama )Peserta","COB|Jns\\.?\\s*Rawat"),U=s("penjamin")!=="-"?s("penjamin"):u("Penjamin","\\*Saya|CATATAN"),x=s("faskes_perujuk","faskes")!=="-"?s("faskes_perujuk","faskes"):u("Faskes\\s*Perujuk","Diagnosa\\s*Awal"),b=s("diagnosa_awal")!=="-"?s("diagnosa_awal"):u("Diagnosa\\s*Awal","Catatan|Peserta"),A=s("catatan_sep","catatan")!=="-"?s("catatan_sep","catatan"):u("Catatan","Peserta|COB"),v=s("sub_spesialis","spesialis")!=="-"?s("sub_spesialis","spesialis"):u("Sub\\/Spesialis","Dokter"),p=r(/Cetakan\s+ke\s*[:.]?\s*(\d+)/i),h=p!=="-"?`<div class="sep-print-meta">Cetakan ke ${a(p)}</div>`:"",C=(f,R,z="",j=!1)=>`<tr><td class="lbl${j?" right":""}">${f}</td><td class="sep">:</td><td class="val${z?" "+z:""}">${R}</td></tr>`,Q='<tr><td colspan="3">&nbsp;</td></tr>',D=d!=="-"?`Kelas ${a(d)}`:"-";return`<section class="rm-page sep-page" id="rm-01">
 <section class="bpjs-sep-sheet">
 <div class="sep-header">
   <img class="sep-logo" src="${Wt}" alt="BPJS Kesehatan" width="215" height="33" />
   <div class="sep-title-wrap">
     <div class="sep-title">SURAT ELEGIBILITAS PESERTA</div>
     <div class="sep-hospital">${a(wt.toUpperCase())}</div>
   </div>
 </div>
 <div class="sep-columns">
   <div class="sep-col-left"><table class="sep-kv-table">
     ${C("No. SEP",`<span class="sep-no-value">${a(n)}</span>`)}
     ${C("Tgl. SEP",a(L))}
     ${C("No.Kartu",K)}
     ${C("Nama Peserta",`<strong>${a(y)}</strong>`)}
     ${C("Tgl.Lahir",`${a(c)} &nbsp;&nbsp; Kelamin : ${a(S)}`)}
     ${C("No.Telepon",a(l))}
     ${C("Sub/Spesialis",a(v))}
     ${C("Dokter",a(g))}
     ${C("Faskes Perujuk",a(x!=="-"?x:`${wt} - Kota Jambi`))}
     ${C("Diagnosa Awal",a(b))}
     ${C("Catatan",a(A))}
   </table></div>
   <div class="sep-col-right"><table class="sep-kv-table">
     ${Q}${Q}
     ${C("Peserta",a(P),"",!0)}
     ${C("COB","-","",!0)}
     ${C("Jns.Rawat",`<strong>${a(s("jenis"))}</strong>`,"",!0)}
     ${C("Jns.Kunjungan",E,"",!0)}
     ${C("Kls.Hak",`<strong>${D}</strong>`,"",!0)}
     ${C("Kls.Rawat",`<strong>${D}</strong>`,"",!0)}
     ${C("Penjamin",a(U),"",!0)}
   </table></div>
 </div>
 <div class="sep-disclaimer">
   *Saya Menyetujui BPJS Kesehatan menggunakan informasi Medis Pasien jika diperlukan.<br/>
   *SEP bukan sebagai bukti penjamin peserta
 </div>
 ${h}
 <div class="sep-signatures">
   <div class="sep-sig-box">
     <div class="sep-sig-role">Pasien/<br/>Keluarga Pasien</div>
     ${e?`<img class="sep-qr" src="${a(e)}" alt="QR SEP" width="100" height="100" />`:""}
     <div class="sep-sig-name">(${a(y)})</div>
   </div>
 </div>
 </section>
</section>`}function ba(i){let M=i.find(U=>/^SPRI$/i.test(U.title)),t=et(i,/^SPRI$/i)[0]??"",e=M?new DOMParser().parseFromString(M.html,"text/html"):null,r=U=>{if(!e)return"-";for(let x of Array.from(e.querySelectorAll("tr"))){let b=Array.from(x.cells);if(!b.length)continue;let A=(b[0].textContent||"").replace(/\s+/g," ").trim();if(!U.test(A))continue;if(b.length===1)return A;let v=b.slice(1).map(p=>(p.innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim()).filter(Boolean).join(`
`).trim();if(v)return v}return"-"},u=(U,x)=>x.match(U)?.[1]?.trim()||"-",n=r(/^Pemeriksaan Fisik$/i),L=u(/Keadaan Umum\s*:\s*(.*?)\s*(?:Tensi|$)/i,n),l=u(/Tensi\s*:\s*(.*?)\s*(?:Nadi|$)/i,n),d=u(/Nadi\s*:\s*(.*?)\s*(?:RR|$)/i,n),N=u(/RR\s*:\s*(.*?)\s*(?:Suhu|$)/i,n),c=u(/Suhu\s*:\s*(.*?)\s*(?:BB|$)/i,n),S=u(/BB\s*:\s*(.*?)\s*(?:TB|$)/i,n),g=u(/TB\s*:\s*(.*?)$/i,n),w=u(/Pemeriksaan Fisik\s*:\s*([\s\S]*)$/i,n),I=r(/^Catatan$/i),y=r(/^Diit$/i),k=r(/^Terapi$/i),K=r(/^Kota Jambi,.*Jam|^Waktu Pengantar/i),G=K.match(/^(Kota Jambi,.*?Jam\s*\d{1,2}:\d{2})/i)?.[1]||K,Y=s("dokter","dpjp"),E=s("tgl_lahir","tglLahir").split(/\s*\/\s*/),P=E.length>1?`${E[1]} (${E[0]})`:E[0]||"-";return`<section class="rm-page" id="rm-03">
${V("RM. 03")}
<div class="rm-form-title">SURAT PENGANTAR RAWAT INAP (SPRI)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"),!0)}
    ${o("Umur / Tgl. Lahir",P)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Alamat",ct(i))}
    ${o("Dikirim Oleh",Y)}
    ${o("Waktu Pengantar",G)}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead>
    <tr><th colspan="7">PEMERIKSAAN TANDA VITAL &amp; ANTROPOMETRI SAAT MASUK</th></tr>
    <tr>
      <th>KEADAAN UMUM</th><th>TEKANAN DARAH</th><th>NADI</th>
      <th>PERNAPASAN (RR)</th><th>SUHU</th><th>BERAT BADAN</th><th>TINGGI BADAN</th>
    </tr>
  </thead>
  <tbody><tr>
    <td class="center"><strong>${a(L)}</strong></td>
    <td class="center"><strong>${a(l)}</strong></td>
    <td class="center">${a(d)}</td>
    <td class="center">${a(N)}</td>
    <td class="center">${a(c)}</td>
    <td class="center">${a(S)}</td>
    <td class="center">${a(g)}</td>
  </tr></tbody>
</table>

<table class="rm-grid-table">
  <tbody>
    <tr><td style="width: 175px;"><strong>ANAMNESIS</strong></td><td>${J(r(/^Anamnesis$/i))}</td></tr>
    <tr><td><strong>RIWAYAT PENYAKIT KELUARGA</strong></td><td>${J(r(/^Riwayat Penyakit Keluarga$/i))}</td></tr>
    <tr><td><strong>RIWAYAT ALERGI</strong></td><td>${J(r(/^Riwayat Alergi$/i))}</td></tr>
    <tr><td><strong>PEMERIKSAAN FISIK / CATATAN</strong></td><td>${w!=="-"?`<strong>${J(w)}</strong>`:"-"}${I!=="-"?`<br/>${J(I)}`:""}</td></tr>
    <tr><td><strong>PEMERIKSAAN PENUNJANG AWAL</strong></td><td>${J(r(/^Pemeriksaan Penunjang$/i))}</td></tr>
    <tr><td><strong>DIAGNOSA KERJA</strong></td><td><strong>${J(r(/^Diagnosa Kerja$/i))}</strong></td></tr>
    <tr><td><strong>TERAPI &amp; DIIT AWAL</strong></td><td>${J(k)}${y!=="-"?`<br/><strong>Diit :</strong> ${J(y)}`:""}</td></tr>
  </tbody>
</table>

<div class="rm-signature-block" style="justify-content:flex-end;">
  <div class="rm-sig-box">
    <div>${a(G)}</div>
    <div>Dokter yang Memeriksa</div>
    ${t?`<img class="rm-sig-qr" src="${a(t)}" alt="QR tanda tangan dokter" width="80" height="80" />`:""}
    ${t?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(Y)} )</div>
  </div>
</div>
</section>`}function Ia(i){let M=i.find(b=>/^SBPK$/i.test(b.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=new Map,r=new Map,u=[],n="-";if(t){for(let v of Array.from(t.querySelectorAll("tr"))){let p=Array.from(v.cells);for(let h=0;h<p.length-2;h++){let C=(p[h].textContent||"").replace(/\s+/g," ").trim();if((p[h+1].textContent||"").trim()!==":")continue;let Q=(p[h+2].innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<\/li>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim();C&&Q&&!e.has(C)&&e.set(C,Q)}p.length>=5&&/^[A-Z]\d{2}(?:\.\d+)?$/.test(p[2].textContent?.trim()??"")&&p[0].textContent?.trim()&&p[1].textContent?.trim()&&u.push({unit:(p[0].textContent||"").replace(/\s+/g," ").trim(),diag:(p[1].textContent||"").replace(/\s+/g," ").trim(),icd:(p[2].textContent||"").trim(),dokter:(p[4].textContent||"").replace(/\s+/g," ").trim()||"-"})}for(let v of Array.from(t.querySelectorAll("li"))){let p=(v.textContent||"").replace(/\s+/g," ").trim();if(!p||/\([A-Z]\d{2}(?:\.\d+)?\)$/i.test(p))continue;let h=p.toUpperCase();r.set(h,(r.get(h)||0)+1)}let b=Array.from(t.querySelectorAll("table")),A=(b[b.length-1]?.textContent||"").match(/\((dr\.[^)]+)\)/i);A&&(n=A[1].trim())}let L=b=>{for(let[A,v]of e)if(b.test(A))return v;return"-"},l=L(/^No Kartu BPJS$/i),d=s("norm","rekam_medis"),N=s("nama"),c=L(/^Tanggal lahir/i),S=L(/^Alamat$/i),g=s("no_sep","sep")!=="-"?s("no_sep","sep"):L(/^No SEP$/i),w=L(/^Jenis Kelamin$/i),I=/^L$/i.test(w)?"Laki-laki (L)":/^P$/i.test(w)?"Perempuan (P)":w,y=L(/^Tgl\.? Masuk RS$/i),k=L(/^Berat badan/i),K=u[0]?.unit||L(/^Unit Pelayanan|^Poliklinik/i),G=L(/^ANAMNESE$/i),Y=n!=="-"?n:s("dokter","dpjp"),E=et(i,/^SBPK/i)[0]??"",P=et(i,/^SEP/i)[0]??et(i,/^Rincian Biaya/i)[0]??"",U=u.length?u.map(b=>`<tr><td>${a(b.unit)}</td><td>Diagnosa</td><td><strong>${a(b.diag)}</strong></td><td class="center">${a(b.icd)}</td><td>${a(b.dokter)}</td></tr>`).join(""):`<tr><td>${J(K)}</td><td>Diagnosa Utama</td><td><strong>${J(L(/^Diagnosa utama/i))}</strong></td><td class="center">-</td><td>${a(Y)}</td></tr>
       <tr><td>${J(K)}</td><td>Diagnosa Tambahan</td><td>${J(L(/^Diagnosa tambahan/i))}</td><td class="center">-</td><td>${a(Y)}</td></tr>`,x=Array.from(r.entries()).map(([b,A],v)=>`<tr><td class="center">${v+1}</td><td>${a(b)}</td><td>${a(Y)}</td><td class="center">${A}</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi SBPK Item ${v+1}"></td></tr>`).join("");return`<section class="rm-page" id="rm-02">
${V("RM. 02")}
<div class="rm-form-title">SURAT BUKTI PELAYANAN KESEHATAN (SBPK)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("No. Kartu BPJS",l)}
    ${o("No. Rekam Medis",d)}
    ${o("Nama Pasien",N,!0)}
    ${o("Tgl. Lahir / Umur",c)}
    ${o("Alamat",S)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("No. SEP",g)}
    ${o("Jenis Kelamin",I)}
    ${o("Tgl. Masuk RS",`${y} (*)`,!0)}
    ${o("Berat Badan Bayi",k)}
    ${o("Unit Pelayanan",K)}
  </table></div>
</div>

<table class="rm-grid-table">
  <tbody>
    <tr>
      <td style="width: 170px;"><strong>Hasil anamnesa datang untuk</strong></td>
      <td>
        <span class="static-box">&nbsp;</span> Suspek &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&#10003;</span> <strong>Tegak Diagnosa</strong> &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&nbsp;</span> Observasi &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&nbsp;</span> Kontrol lanjutan &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&nbsp;</span> Buka Balutan / Jahitan
      </td>
    </tr>
    <tr><td><strong>ANAMNESE</strong></td><td>${J(G)}</td></tr>
  </tbody>
</table>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 150px;">POLIKLINIK / RUANG</th>
    <th style="width: 120px;">JENIS DIAGNOSA</th>
    <th>DIAGNOSA</th>
    <th style="width: 65px;">ICD X</th>
    <th style="width: 165px;">DOKTER / PETUGAS</th>
  </tr></thead>
  <tbody>${U}</tbody>
</table>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>TINDAKAN / PEMERIKSAAN PENUNJANG / TERAPI (TERAGGREGASI)</th>
    <th style="width: 165px;">UNIT / DOKTER PELAKSANA</th>
    <th class="center" style="width: 48px;">FREK</th>
    <th class="center" style="width: 56px;">VER (&#10003;)</th>
  </tr></thead>
  <tbody>${x}</tbody>
</table>

<div class="footnote-rm">
  (*) Catatan Sistem: periksa kembali tanggal masuk pada SBPK dengan SEP &amp; Resume sebelum berkas dikirim.
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Pasien / Keluarga Pasien</div>
    ${P?`<img class="rm-sig-qr" src="${a(P)}" alt="QR persetujuan pasien" width="80" height="80" />`:""}
    ${P?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(N)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter Penanggung Jawab Pelayanan (DPJP)</div>
    ${E?`<img class="rm-sig-qr" src="${a(E)}" alt="QR persetujuan DPJP" width="80" height="80" />`:""}
    ${E?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(Y)} )</div>
  </div>
</div>
</section>`}var qt=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];function zt(i){let M=String(i??"").replace(/^\s*:\s*/,"").trim(),t=M.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/)||M.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(!t)return M||"-";let[e,r,u]=t.slice(1),n=e.length===4?e:u,L=qt[Number(r)-1];return L?`${Number(e.length===4?u:e)} ${L} ${n}`:M}function Ta(i){let M=i.find(x=>/^Surat (?:Rencana )?Kontrol/i.test(x.title)),t=M?kt(M.html):"",e=x=>_t(t.match(x)?.[1]||"")||"-",r=(x,b)=>e(new RegExp(`${x}\\s*:\\s*([\\s\\S]*?)(?=${b}|$)`,"i")),u=(x,b)=>{for(let A of x){let v=s(A);if(v!=="-")return v}return e(b)},L=M&&new DOMParser().parseFromString(M.html,"text/html").querySelector('img[src*="qrserver"], img[src*="qr-code"]')?.getAttribute("src")||""||et(i,/^SEP/i)[0]||et(i,/^Resume/i)[0]||et(i,/^SBPK/i)[0]||et(i,/^Rincian Biaya/i)[0]||"",l=u(["no_surat_kontrol","no_surat"],/NO\.\s*([0-9A-Z]{10,})/i),d=e(/Kepada Yth\s*([\s\S]*?)(?=Mohon pemeriksaan|No\.?\s*Kartu|$)/i)!=="-"?e(/Kepada Yth\s*([\s\S]*?)(?=Mohon pemeriksaan|No\.?\s*Kartu|$)/i):s("dokter","dpjp"),N=s("dokter","dpjp")!=="-"?s("dokter","dpjp"):d,c=u(["kartu","no_kartu","noka"],/No\.?\s*Kartu\s*[:.]?\s*([\s\S]*?)(?=Nama\s*Peserta|$)/i),S=s("norm","rekam_medis"),g=c.match(/^(.*?)\s*\(MR\.?\s*([^)]+)\)$/i),w=g?`${a(g[1].trim())}<span class="sep-inline-mr">No.MR : ${a(g[2].trim())}</span>`:`${a(c)}${S!=="-"?`<span class="sep-inline-mr">No.MR : ${a(S)}</span>`:""}`,I=s("nama")!=="-"?s("nama"):r("Nama\\s*Peserta","Tanggal Lahir"),y=s("jenis_kelamin","jk"),k=/perempuan|^p$/i.test(y)?"Perempuan":/laki|^l$/i.test(y)?"Laki-laki":t.match(/Nama Peserta\s*:\s*[^()]*\((Perempuan|Laki-laki)\)/i)?.[1]||"",K=k&&!new RegExp(`\\(${k}\\)`,"i").test(I)?`${I} (${k})`:I,G=zt(u(["tgl_lahir","tglLahir"],/Tanggal Lahir\s*[:.]?\s*([\s\S]*?)(?=Diagnosa|$)/i)),Y=u(["diagnosa_awal","diagnosa"],/Diagnosa\s*[:.]?\s*([\s\S]*?)(?=Tanggal entri|$)/i),E=zt(u(["tanggalAwal","tgl_masuk","tgl"],/Tanggal entri\s*[:.]?\s*([\s\S]*?)(?=Demikian|$)/i)),P=(x,b)=>`<tr><td class="lbl">${x}</td><td class="sep">:</td><td class="val">${b}</td></tr>`,U=x=>`<tr><td class="val" colspan="3" style="padding-top:6px;">${a(x)}</td></tr>`;return`<section class="rm-page sep-page" id="surat-kontrol">
 <section class="bpjs-sep-sheet">
 <div class="sep-header">
   <img class="sep-logo" src="${Wt}" alt="BPJS Kesehatan" width="215" height="33" />
   <div class="sep-title-wrap">
     <div class="sep-title">SURAT RENCANA KONTROL</div>
     <div class="sep-hospital">${a(wt.toUpperCase())}</div>
   </div>
 </div>
 <div class="sep-no-value" style="text-align:right;margin-bottom:10px;">NO. ${a(l)}</div>
 <div class="sep-columns">
   <div class="sep-col-left" style="flex:1 1 100%;"><table class="sep-kv-table">
     <tr><td class="lbl">Kepada Yth</td><td class="sep">:</td><td class="val"><strong>${a(d)}</strong></td></tr>
     ${U("Mohon pemeriksaan dan penangan lebih lanjut :")}
     ${P("No.Kartu",w)}
     ${P("Nama Peserta",`<strong>${a(K)}</strong>`)}
     ${P("Tanggal Lahir",a(G))}
     ${P("Diagnosa",a(Y))}
     ${P("Tanggal entri",a(E))}
     ${U("Demikian atas bantuannya, diucapkan banyak terima kasih.")}
   </table></div>
 </div>
 <div class="sep-signatures">
   <div class="sep-sig-box">
     <div>Mengetahui,</div>
     ${L?`<img class="sep-qr" src="${a(L)}" alt="QR tanda tangan DPJP" width="100" height="100" />`:""}
     <div class="sep-sig-name">( ${a(N)} )</div>
   </div>
 </div>
 </section>
</section>`}function ka(i){let M=i.find(D=>/^Rincian Biaya/i.test(D.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=new Map,r=new Map;if(t){let D=Array.from(t.querySelectorAll("table")),f=D.find(z=>/frek/i.test(z.rows[0]?.textContent||""));for(let z of Array.from(f?.rows??[])){let j=Array.from(z.cells).map(B=>(B.textContent||"").replace(/\s+/g," ").trim());if(j.length<6||!/^\d+\.?$/.test(j[0]))continue;let O=j[2]||"-",W=O.toUpperCase().replace(/\s+/g," ").trim(),X=parseInt(j[4],10)||1,rt=parseFloat((j[7]||"0").replace(/\./g,"").replace(",","."))||0,H=e.get(W);H?(H.frek+=X,H.jaminan+=rt):e.set(W,{name:O,petugas:j[3]||"-",frek:X,tarif:j[5]||"-",jaminan:rt})}let R=D.find(z=>/nama\s*obat/i.test(z.rows[0]?.textContent||""));for(let z of Array.from(R?.rows??[])){let j=Array.from(z.cells).map(B=>(B.textContent||"").replace(/\s+/g," ").trim());if(j.length<5||!/^\d+(\.\d+)?$/.test(j[2]))continue;let O=j[1].replace(/^\d+\s*/,"").trim()||"-",W=O.toUpperCase().replace(/\s+/g," ").trim(),X=parseFloat(j[2].replace(",","."))||0,rt=parseFloat((j[5]||"0").replace(/\./g,"").replace(",","."))||0,H=r.get(W);H?(H.qty+=X,H.jaminan+=rt):r.set(W,{name:O,qty:X,jaminan:rt})}}let u=D=>{if(!t)return 0;for(let f of Array.from(t.querySelectorAll("tr"))){let R=Array.from(f.cells).map(z=>(z.textContent||"").replace(/\s+/g," ").trim());if(R.some(z=>D.test(z)))for(let z of R.slice(1)){let j=parseFloat(z.replace(/\./g,"").replace(",","."));if(Number.isFinite(j)&&j!==0)return j}}return 0},n=u(/^Total Jasa Rp/i),L=u(/^Total Resep/i),l=u(/^Jasa Pelayanan/i),d=u(/^Biaya Administrasi/i),N=u(/^Biaya Materai/i),c=u(/^Diskon/i),S=u(/^Pembulatan/i),g=u(/^Total Biaya/i),w=n+L+l,I=Math.max(0,w-g),y=D=>D.toLocaleString("id-ID",{minimumFractionDigits:0,maximumFractionDigits:0}),k=(D,f,R=!1)=>`<div class="rm-sum-line"${R?' style="font-weight:bold;border-top:1px solid #000;"':""}><span>${a(D)}</span><span class="rm-sum-dots"></span><span>${a(f)}</span></div>`,K=Array.from(e.values()).map((D,f)=>`<tr><td class="center">${f+1}</td><td>${a(D.name)}</td><td>${a(D.petugas)}</td><td class="center">${D.frek}</td><td class="num">${a(D.tarif)}</td><td class="num">${y(D.jaminan)}</td></tr>`).join(""),G=Array.from(r.values()).map((D,f)=>`<tr><td class="center">${f+1}</td><td>${a(D.name)}</td><td class="center">${D.qty}</td><td class="num">${y(D.jaminan)}</td></tr>`).join(""),Y=s("norm","rekam_medis"),E=s("nama"),P=s("dokter","dpjp"),U=ct(i),x=s("no_sep","sep"),b=[s("jenis"),s("kelas","ruang")].filter(D=>D!=="-").join(" / ")||"-",A=s("tanggalAwal","tgl_masuk","tgl"),v=s("tanggalAkhir","keluar","tgl_keluar"),p=et(i,/^Rincian Biaya/i),h=D=>Qa(D).toLowerCase(),C=p.find(D=>/pasien|approve/i.test(h(D)))??p[0]??"",Q=p.find(D=>/penerima|kasir|billing/i.test(h(D)))??p.find(D=>D!==C)??"";return`<section class="rm-page" id="rm-05">
${V("RM. 05")}
<div class="rm-form-title">RINCIAN BIAYA PELAYANAN RAWAT INAP &amp; FARMASI</div>

<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${o("No. Rekam Medis",Y)}
    ${o("Nama Pasien",E,!0)}
    ${o("Alamat Pasien",U)}
    ${o("Unit / Instalasi",b)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Golongan Pasien",`BPJS KESEHATAN (SEP: ${x})`)}
    ${o("Dokter DPJP",P)}
    ${o("Periode Rawat",`${A} s/d ${v}`)}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>URAIAN TINDAKAN / PELAYANAN</th>
    <th style="width: 155px;">DOKTER / PELAKSANA</th>
    <th class="center" style="width: 48px;">FREK</th>
    <th class="num" style="width: 88px;">TARIF (Rp)</th>
    <th class="num" style="width: 98px;">JAMINAN (Rp)</th>
  </tr></thead>
  <tbody>${K}</tbody>
</table>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>NAMA OBAT / ALKES</th>
    <th class="center" style="width: 52px;">QTY</th>
    <th class="num" style="width: 120px;">JAMINAN (Rp)</th>
  </tr></thead>
  <tbody>${G}</tbody>
</table>

<div class="rm-summary">
  ${k("Sub Total Layanan Medis / Tindakan",y(n))}
  ${k("Sub Total Penjualan (Farmasi/Obat)",y(L))}
  ${k("Jasa Pelayanan (Jasa Medis/Paramudis)",y(l))}
  ${k("Jasa Sarana","0")}
  ${k("Biaya Administrasi",y(d))}
  ${k("Biaya Materai",y(N))}
  ${k("Diskon",y(c))}
  ${k("Pembulatan",y(S))}
  ${k("TOTAL TAGIHAN (KOTOR)",y(w),!0)}
  ${k("Ditanggung Jaminan / Klaim BPJS",y(g))}
  ${k("TANGGUNGAN PASIEN (Sisa yang harus dibayar)",y(I))}
  ${k("Uang Muka / Deposit","0")}
  ${k("Bayar (Tunai/Non-Tunai)",y(I))}
  ${k("Kembali","0")}
  ${k("Status",I===0?"Lunas":"-")}
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Yang Menyerahkan,</div>
    <div>Pasien / Keluarga Pasien</div>
    ${C?`<img class="rm-sig-qr" src="${a(C)}" alt="QR persetujuan pasien" width="80" height="80" />`:""}
    ${C?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(E)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Yang Menerima</div>
    ${Q?`<img class="rm-sig-qr" src="${a(Q)}" alt="QR penerima" width="80" height="80" />`:""}
    ${Q?"":'<div class="rm-sig-space"></div>'}
    <div>(Petugas Billing / Kasir)</div>
  </div>
</div>
</section>`}function ha(i){let M=i.find(B=>/^Resume/i.test(B.title)),t=et(i,/^Resume/i)[0]??"",e=et(i,/^SEP/i)[0]??et(i,/^Rincian Biaya/i)[0]??"",r=M?new DOMParser().parseFromString(M.html,"text/html"):null,u=new Map;if(r)for(let B of Array.from(r.querySelectorAll("tr"))){let Z=Array.from(B.cells);for(let tt=0;tt<Z.length-2;tt++){let Mt=(Z[tt].textContent||"").replace(/\s+/g," ").trim().replace(/^-\s*/,"").replace(/\s*:$/,"");if((Z[tt+1].textContent||"").trim()!==":")continue;let m=(Z[tt+2].innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/[ \t]+/g," ").trim();Mt&&m&&!u.has(Mt)&&u.set(Mt,m)}for(let tt=0;tt<Z.length-1;tt++){let Lt=(Z[tt].textContent||"").replace(/\s+/g," ").trim().replace(/^-\s*/,"").replace(/\s*:$/,""),Mt=(Z[tt+1].textContent||"").replace(/\u00a0/g," ").match(/^\s*:\s*(.+)$/);Lt&&Mt&&!u.has(Lt)&&u.set(Lt,Mt[1].trim())}}let n=(...B)=>{for(let[Z,tt]of u)if(B.some(Lt=>Lt.test(Z)))return tt;return"-"},L=B=>{for(let[Z,tt]of u)if(B.test(Z))return tt;return"-"},l=s("nama"),d=s("norm","rekam_medis"),N=s("tgl_lahir","tglLahir"),c=s("jenis_kelamin","jk"),S=n(/^Tanggal Masuk$/i),g=Array.from(u).filter(([B])=>/^Tanggal Keluar$/i.test(B)).map(([,B])=>B),w=g.find(B=>/\d{1,2}:\d{2}/.test(B))??g[0]??"-",I=n(/^Ruang Rawat$/i),y=n(/^Kelas$/i),k=n(/^Dokter Rawat Bersama/i),K=k!=="-"?k:s("dokter","dpjp"),G=n(/^Anemnesa|^Anamnesa/i),Y=n(/^Riwayat Penyakit$/i),E=n(/^Pemeriksaan Fisik$/i),P=n(/^Hasil Pemeriksaan Diagnostik/i),U=n(/^Diagnosa Utama$/i),x=n(/^Diagnosa Sekunder$/i),b=n(/^Prosedur \/ Operasi$/i),A=n(/^Diagnosa Tindakan$/i),v=n(/^Pengobatan$/i),p=n(/^Obat Pulang$/i),h=n(/^Kondisi Pulang$/i),C=n(/^Catatan Kondisi Pulang$/i),Q=n(/^Jadwal Kontrol$/i),D=n(/^Pemeriksaan Lanjutan/i),f=n(/^Cara Pulang$/i),R=n(/^Instruksi Pulang$/i),z=n(/rujukan masuk/i),j=n(/rujukan dikembalikan/i),O=n(/dirujuk keluar/i),W=n(/^Apakah pasien menggunakan KB\?$/i),X=n(/^Tindakan$/i),rt=[["TD",L(/^TD$/)],["HR",L(/^HR$/)],["RR",L(/^RR$/)],["S",L(/^S$/)],["SpO2",L(/^SPO2$/)],["GCS E/M/V",[L(/^E$/),L(/^M$/),L(/^V$/)].filter(B=>B!=="-").join("/")],["KU",L(/^KU$/)],["Kesadaran",L(/^Kesadaran$/)],["Nadi",L(/^Nadi$/)],["SH",L(/^SH$/)]].filter(([,B])=>B&&B!=="-").map(([B,Z])=>`${B}: ${Z}`).join(" | "),H=(B,Z)=>`<tr><td style="width: 175px;"><strong>${B}</strong></td><td>${J(Z)}</td></tr>`;return`<section class="rm-page" id="rm-06">
${V("RM. 06")}
<div class="rm-form-title">RINGKASAN PULANG (DISCHARGE SUMMARY)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",l,!0)}
    ${o("No. Rekam Medis",d,!0)}
    ${o("Tgl. Lahir / Kelamin",`${N} / ${c}`)}
    ${o("Jenis Kasus",n(/^Jenis Kasus$/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Masuk",S)}
    ${o("Tanggal Keluar",w)}
    ${o("Ruang / Kelas",`${I} / ${y}`)}
    ${o("DPJP / Rawat Bersama",K)}
  </table></div>
</div>

<table class="rm-grid-table">
  <tbody>
    ${H("ALASAN / INDIKASI RAWAT &amp; ANAMNESA",`${n(/^Alasan \/ Indikasi Rawat/i)}
${G}`.trim())}
    ${H("RIWAYAT PENYAKIT",Y)}
    ${H("PEMERIKSAAN FISIK &amp; TANDA VITAL MASUK",`${E}${rt?`
Vital Signs : ${rt}`:""}`.trim())}
    ${H("HASIL PEMERIKSAAN DIAGNOSTIK",P)}
    ${H("DIAGNOSA UTAMA",U)}
    ${H("DIAGNOSA SEKUNDER",x)}
    ${H("TINDAKAN / PROSEDUR",b)}
    ${H("DIAGNOSA TINDAKAN (ICD-9-CM)",A)}
    ${H("PENGOBATAN SELAMA RAWAT",v)}
    ${H("OBAT PULANG",p)}
    ${H("TINDAKAN KEPERAWATAN",X)}
    ${H("KONDISI PULANG",h.split(/\n/)[0])}
    ${H("KONDISI &amp; CARA PULANG",`${C}
Cara Pulang: ${f}`.trim())}
    ${H("INSTRUKSI PULANG",R)}
    ${H("INSTRUKSI &amp; JADWAL KONTROL",`${Q}
${D}`.trim())}
    ${H("STATUS RUJUKAN",`Masuk: ${z} | Dikembalikan: ${j} | Dirujuk keluar: ${O}`)}
    ${H("PELAYANAN KB",W)}
  </tbody>
</table>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Mengetahui Pasien / Keluarga</div>
    ${e?`<img class="rm-sig-qr" src="${a(e)}" alt="QR persetujuan pasien" width="80" height="80" />`:""}
    ${e?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(l)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Yang Membuat</div>
    ${t?`<img class="rm-sig-qr" src="${a(t)}" alt="QR tanda tangan DPJP" width="80" height="80" />`:""}
    ${t?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(K)} )</div>
  </div>
</div>
</section>`}function Ca(i){let M=i.find(e=>/^Resume/i.test(e.title)),t=M?kt(M.html):"";return/RESUME MEDIS RAWAT JALAN|RINGKASAN PELAYANAN RAWAT JALAN/i.test(t)||/Tanggal Konsultasi/i.test(t)?fa(i):ha(i)}function fa(i){let M=i.find(N=>/^Resume/i.test(N.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=new Map;if(t)for(let N of Array.from(t.querySelectorAll("tr"))){let c=Array.from(N.cells).map(S=>jt(S));for(let S=0;S<c.length-2;S++)c[S+1]===":"&&c[S]&&c[S+2]&&!e.has(c[S])&&e.set(c[S],c[S+2])}let r=(...N)=>{for(let[c,S]of e)if(N.some(g=>g.test(c)))return S;return"-"},u=s("nama")!=="-"?s("nama"):r(/^Nama Pasien$/i),n=s("norm","rekam_medis")!=="-"?s("norm","rekam_medis"):r(/^No\.? Rekam Medis$/i),L=(N,c)=>`<tr><td style="width:175px;"><strong>${N}</strong></td><td>${J(c)}</td></tr>`,l=N=>`<tr><th class="rm-sec-head" colspan="2" style="text-align:left;">${N}</th></tr>`,d=N=>`<table class="rm-grid-table"><tbody>${N}</tbody></table>`;return`<section class="rm-page" id="rm-06-rajal">
${V("RM. 06")}
<div class="rm-form-title">RESUME MEDIS RAWAT JALAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",u,!0)}
    ${o("No. Rekam Medis",n,!0)}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk")!=="-"?s("jenis_kelamin","jk"):r(/^Jenis Kelamin$/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Konsultasi",r(/^Tanggal Konsultasi$/i))}
    ${o("Tempat Konsultasi",r(/^Tempat Konsultasi$/i))}
    ${o("Jenis Kunjungan",s("jenis","kelas","ruang"))}
  </table></div>
</div>
${d(l("I. ANAMNESA &amp; PEMERIKSAAN")+L("ANAMNESA",r(/^Anamnesa$/i))+L("HASIL PEMERIKSAAN FISIK",r(/^Hasil Pemeriksaan Fisik$/i)))}
${d(l("II. DIAGNOSA &amp; TINDAKAN")+L("DIAGNOSA",r(/^Diagnosa$/i))+L("ICD X (UTAMA / SEKUNDER)",r(/^ICD X$/i))+L("JENIS TINDAKAN",r(/^Jenis tindakan$/i))+L("ICD IX",r(/^ICD IX$/i))+L("TINDAKAN",r(/^Tindakan$/i)))}
${d(l("III. PLANNING, TERAPI &amp; TINDAK LANJUT")+L("PLANNING",r(/^Planning$/i))+L("TERAPI PENGOBATAN",r(/^Terapi Pengobatan$/i))+L("TINDAK LANJUT",r(/^Tindak Lanjut$/i))+L("JADWAL CONTROL",r(/^Jadwal Contro[li]$/i))+L("RUJUK KE",r(/^Rujuk Ke$/i))+L("RIWAYAT PENUNJANG MEDIS",r(/^Riwayat Penunjang Medis$/i)))}
</section>`}function za(i){let M=i.find(f=>/^Telaah/i.test(f.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=new Map,r=[],u=[],n=[];if(t){for(let R of Array.from(t.querySelectorAll("tr"))){let z=Array.from(R.cells).map(j=>(j.innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim());for(let j=0;j<z.length-2;j++){let O=z[j].replace(/:$/,"").trim();z[j+1]===":"&&O&&z[j+2]&&!e.has(O)&&e.set(O,z[j+2])}for(let j of z){let O=j.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);O&&!e.has(O[1].trim())&&e.set(O[1].trim(),O[2].trim())}}for(let R of Array.from(t.querySelectorAll("tr"))){let z=Array.from(R.cells).map(O=>(O.textContent||"").replace(/\s+/g," ").trim());if(z.length<2||!/^R\/\d+$/i.test(z[0]))continue;let j=z[1].match(/^(.*?)\s*Jml:\s*(\S+)/i);r.push({no:z[0],name:j?j[1].trim():z[1],jml:j?j[2]:"-"})}for(let R of Array.from(t.querySelectorAll("table"))){let z=(R.rows[0]?.textContent||"").replace(/\s+/g," ").trim();if(!/^(Telaah Resep|Telaah Obat|Edukasi)/i.test(z))continue;let j=[];for(let O of Array.from(R.rows).slice(1)){let W=Array.from(O.cells).map(X=>(X.textContent||"").replace(/\s+/g," ").trim());W.length<2||!/^\d+$/.test(W[0])||j.push([W[0],W[1]])}j.length&&u.push({title:z.split(/\s{2,}/)[0]||z,rows:j})}let f=Array.from(t.querySelectorAll("table")).find(R=>/Hitung/i.test(R.rows[0]?.textContent||""));f&&n.push(...Array.from(f.rows[0].cells).map(R=>(R.textContent||"").replace(/\s+/g," ").trim()).filter(R=>/Hitung|Timbang|Kemas|Penyerahan/i.test(R)))}n.length||n.push("Hitung","Timbang","Kemas","Penyerahan");let L=(...f)=>{for(let[R,z]of e)if(f.some(j=>j.test(R)))return z;return"-"},l=f=>{for(let R of Array.from(document.querySelectorAll("td"))){let z=(R.textContent||"").replace(/\s+/g," ").trim(),j=z.match(f);if(!j)continue;let O=z.slice((j.index??0)+j[0].length).replace(/^\s*:\s*/,"").trim();if(O)return O;let W=(R.nextElementSibling?.textContent||"").replace(/\s+/g," ").trim();if(W&&!/^:/.test(W))return W}return"-"},d=s("dokter","dpjp")!=="-"?s("dokter","dpjp"):L(/^Dokter/i),N=L(/^No Resep/i),c=l(/^Ruangan\/Poli/i)!=="-"?l(/^Ruangan\/Poli/i):L(/^Ruangan\/?Poli/i,/^Ruangan/i),S=l(/^Tanggal Periksa/i)!=="-"?l(/^Tanggal Periksa/i):L(/^Tanggal/i,/^Tanggal & Jam/i),g=l(/^Jam Datang/i)!=="-"?l(/^Jam Datang/i):L(/^Jam/i),w=L(/^SIP/i),I=s("nama")!=="-"?s("nama"):L(/^Nama Pasien/i),y=s("norm","rekam_medis")!=="-"?s("norm","rekam_medis"):L(/^No\.? RM/i),k=ct(i),K=s("tgl_lahir","tglLahir").replace(/^:\s*/,"")||L(/^Tgl\.? Lahir/i),G=s("no_hp","telepon").replace(/^:\s*/,"")||L(/^No HP/i),Y=L(/^Penjamin/i),E=L(/alergi/i),P=L(/berat|\bbb\b/i),U=s("jenis_kelamin","jk").replace(/^:\s*/,""),x=/perempuan|^p$/i.test(U)?"P":/laki|^l$/i.test(U)?"L":U,b=I+(x&&x!=="-"?` (${x})`:""),A=`${E!=="-"?E:"-"} / ${P!=="-"?`BB ${P}${/\bkg\b/i.test(P)?"":" kg"}`:"- kg"}`,v=s("no_sep","sep")!=="-"?s("no_sep","sep"):s("kartu"),p='<table class="rm-grid-table"><thead><tr>'+n.map(f=>`<th class="center">${a(f)}</th>`).join("")+"</tr></thead><tbody><tr>"+n.map(()=>'<td style="height:30px">&nbsp;</td>').join("")+"</tr></tbody></table>",h=u.length?u.map(f=>`<table class="rm-grid-table"><thead><tr><th colspan="2">${a(f.title)}</th><th style="width:44px;">Y/T</th></tr></thead><tbody>`+f.rows.map(([R,z])=>`<tr><td class="center" style="width:28px;">${a(R)}</td><td>${a(z)}</td><td class="center">&nbsp;</td></tr>`).join("")+"</tbody></table>").join(""):"",C='<table class="rm-grid-table"><tbody><tr><th colspan="2">PERUBAHAN RESEP</th></tr><tr><th>Tertulis</th><th>Menjadi</th></tr><tr><td style="height:28px">&nbsp;</td><td style="height:28px">&nbsp;</td></tr><tr><td class="center">Apoteker</td><td class="center">Disetujui Dokter</td></tr><tr><td style="height:28px">&nbsp;</td><td style="height:28px">&nbsp;</td></tr><tr><th colspan="2">WAKTU TUNGGU</th></tr><tr><td>Masuk</td><td>&nbsp;</td></tr><tr><td>Diserahkan</td><td>&nbsp;</td></tr><tr><td>Paraf Pasien/Keluarga</td><td style="height:30px">&nbsp;</td></tr></tbody></table>',Q=(f,R,z=!1)=>`<div class="tm-row${z?" long":""}"><span class="tm-label">${a(f)}:</span><span class="tm-val">${R&&R.trim()&&R!=="-"?a(R):"-"}</span></div>`,D=r.length?r.map(f=>`<div class="med"><span class="med-no">${a(f.no)}</span> <span class="med-name">${a(f.name)}</span>`+(f.jml&&f.jml!=="-"?`, <span class="med-jml">Jml: ${a(f.jml)}</span>`:"")+"</div>").join(""):'<div class="med">Tidak ada data obat pada halaman telaah.</div>';return`<section class="rm-page" id="rm-07">
${V("RM. 07")}
<div class="rm-form-title">FORMULIR TELAAH RESEP, TELAAH OBAT &amp; EDUKASI FARMASI</div>

<div class="t-main">
  <div class="t-left">
    <div class="tm-card tm-card--small tm-card--left"><div class="tm-col">
      ${Q("Pasien",b)}
      ${Q("No. RM",y)}
      ${Q("Tgl. Lahir",K)}
      ${Q("Alergi &amp; BB",A)}
      ${Q("Alamat",k,!0)}
      ${Q("No HP",G)}
    </div></div>
    <div class="t-meds">${D}</div>
    ${p}
    <table class="rm-grid-table t-lampiran"><thead><tr>
      <th>Srt. Rujuk Balik</th><th>Surat Iter</th><th>Hasil Lab</th>
    </tr></thead><tbody><tr>
      <td style="height:26px">&nbsp;</td><td style="height:26px">&nbsp;</td><td style="height:26px">&nbsp;</td>
    </tr></tbody></table>
  </div>
  <div class="t-right">
    <div class="tm-card tm-card--right"><div class="tm-col">
      ${Q("Dokter",d)}
      ${Q("SIP Dokter",w)}
      ${Q("No Resep",N)}
      ${Q("No SEP",v)}
      ${Q("Ruangan",c)}
      ${Q("Tanggal",S)}
      ${Q("Jam",g)}
      ${Q("Penjamin",Y)}
    </div></div>
    ${h}
    ${C}
  </div>
</div>

<div class="footnote-rm">Obat tidak boleh diganti tanpa sepengetahuan Dokter.</div>
</section>`}var va=/^(No\.?\s*(RONTGEN|RM)|Umur|Tanggal Periksa|Bed|Status|Nama Pasien|Jenis Kelamin|Alamat|dr\.?\s*(Pengirim|DPJP)|Dokter (Pengirim|DPJP)|Diagnosa (Klinis|ICD))/i,$a=/<div[^>]*class="[^"]*head-cetak-instansi[^"]*"[^>]*>\s*HASIL PEMERIKSAAN RADIOLOGI/i;function Oa(i,M,t="rm-08"){let e=M??i.find(r=>/^Radiologi/i.test(r.title));return Ba(e?.html??"",$a).map((r,u)=>{let n=et([{title:"Radiologi",html:r}],/Radiologi/i)[0]??"";return Ra(i,r,n,u?`${t}-${u+1}`:t)}).join("")}function Ra(i,M,t,e){let r=new DOMParser().parseFromString(M,"text/html"),u=Fa(r,va),n=[],L="";for(let p of Array.from(r.querySelectorAll("tr"))){let h=Array.from(p.cells).map(jt);for(let C of h){let Q=C.match(/^expertise\s*:\s*([\s\S]+)$/i);Q&&!L&&(L=Q[1].trim())}h.length>=4&&/^\d+$/.test(h[0])&&h[1]&&n.push({name:h[1],golongan:h[2],kontras:h[3]})}let l=(...p)=>{for(let[h,C]of u)if(p.some(Q=>Q.test(h)))return C;return"-"},d=l(/^No\.? RONTGEN/i),N=l(/^Tanggal Periksa/i),c=l(/^Umur/i),S=s("norm","rekam_medis")!=="-"?s("norm","rekam_medis"):l(/^No\.? RM/i),g=s("nama")!=="-"?s("nama"):l(/^Nama Pasien/i),w=s("jenis_kelamin","jk").replace(/^:\s*/,"")||l(/^Jenis Kelamin/i),I=/perempuan|^p$/i.test(w)?"P":/laki|^l$/i.test(w)?"L":w,y=ct(i),k=l(/^Bed|^Ruang/i),K=l(/^Status/i),G=l(/^dr\.? Pengirim|^Dokter Pengirim/i),Y=l(/^dr\.? DPJP|^Dokter DPJP/i),E=(r.body.textContent||"").replace(/\s+/g," ").match(/\(\s*([^)]{3,80})\s*\)/)?.[1]?.trim()||"-",P=Y!=="-"?Y:E!=="-"?E:xt(t),U=l(/^Diagnosa Klinis/i),x=l(/^Diagnosa ICD/i),b=n.length&&n[0].golongan||"-",A=n.length?n.map((p,h)=>`<tr><td class="center">${h+1}</td><td><strong>${a(p.name)}</strong></td><td class="center">${a(p.golongan||"-")}</td><td class="center">${a(p.kontras||"-")}</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi Radiologi ${h+1}"></td></tr>`).join(""):'<tr><td class="center">-</td><td>Tidak ada jenis pemeriksaan tercatat.</td><td class="center">-</td><td class="center">-</td><td class="center">-</td></tr>',v=L?L.replace(/^\s*\d+\.\s*/,"").replace(/^\n+|\n+$/g,"").split(`
`).map(p=>p.trim()).map(p=>p?`<div>${a(p)}</div>`:"<div>&nbsp;</div>").join(""):"<div>Tidak ada expertise tercatat pada halaman.</div>";return`<section class="rm-page" id="${a(e)}">
${V("RM. 08")}
<div class="rm-form-title">HASIL PEMERIKSAAN RADIOLOGI</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("No. Rontgen",d,!0)}
    ${o("Tanggal Periksa",N)}
    ${o("No. Rekam Medis",S)}
    ${o("Nama Pasien",g,!0)}
    ${o("Jenis Kelamin",I!=="-"?`Laki-laki / Perempuan (${I})`:"-")}
    ${o("Alamat",y)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Umur / Tgl. Lahir",c)}
    ${o("Ruang / Asal",k!=="-"&&K!=="-"?`${k} (Status: ${K})`:k)}
    ${o("Dokter Pengirim",G)}
    ${o("Dokter DPJP / Penilai",P)}
    ${o("Diagnosa Klinis",U)}
    ${o("Diagnosa ICD",x)}
    ${o("Status Pasien",K)}
    ${o("Golongan / Jenis",`${b} \u2014 ${n[0]?.kontras||"-"}`)}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>JENIS PEMERIKSAAN</th>
    <th style="width: 110px;">GOLONGAN</th>
    <th style="width: 110px;">KONTRAS</th>
    <th class="center" style="width: 56px;">VER (&#10003;)</th>
  </tr></thead>
  <tbody>${A}</tbody>
</table>

<table class="rm-grid-table">
  <thead><tr><th>URAIAN EXPERTISE &amp; KESAN PEMERIKSAAN</th></tr></thead>
  <tbody><tr><td style="padding: 8px 10px; line-height: 1.5;">${v}</td></tr></tbody>
</table>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>No. Rontgen : ${a(d)}</div>
    <div>Jenis Pemeriksaan : ${a(b)}</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter Penilai</div>
    ${t?`<img class="rm-sig-qr" src="${a(t)}" alt="QR tanda tangan radiolog" width="80" height="80" />`:""}
    ${t?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(P)} )</div>
  </div>
</div>
</section>`}var Pa=i=>{for(let M of i){if(!/PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(M.title))continue;let t=new DOMParser().parseFromString(M.html,"text/html");for(let e of Array.from(t.querySelectorAll("table"))){let r=Array.from(e.rows[0]?.cells||[]).map(u=>jt(u)).join(" ");if(/^Triase/i.test(r))return Array.from(e.rows).slice(1).map(u=>Array.from(u.cells).map(jt))}}return[]};function Ua(i){let M=i.find(A=>/^Triage/i.test(A.title)),t=et(i,/^Triage/i)[0]??"",e=M?new DOMParser().parseFromString(M.html,"text/html"):null,r=new Map,u="-";if(e){for(let v of Array.from(e.querySelectorAll("tr"))){let p=Array.from(v.cells).map(h=>(h.innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim());for(let h=0;h<p.length-2;h++){let C=p[h].replace(/:$/,"").trim();p[h+1]===":"&&C&&p[h+2]&&!r.has(C)&&r.set(C,p[h+2])}for(let h of p){let C=h.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);!C||C[2].includes(":")||C[2].length>120||r.has(C[1].trim())||r.set(C[1].trim(),C[2].trim())}}let A=(e.textContent||"").replace(/\s+/g," ").match(/Dokter yang memeriksa\s*\(([^)]+)\)/i);A&&(u=A[1].trim())}let n=(...A)=>{for(let[v,p]of r)if(A.some(h=>h.test(v)))return p;return"-"},L=s("norm","rekam_medis")!=="-"?s("norm","rekam_medis"):n(/^No\.?\s*RM/i),l=s("nama")!=="-"?s("nama"):n(/^Nama$/i),d=n(/^Tanggal$/i),N=n(/^Jam Datang/i),c=n(/^Jam Registrasi/i),S=n(/^Cara Datang/i),g=n(/^Diantar Polisi/i),w=n(/^No\.?\s*ID/i),I=n(/^Pengantar Pasien/i),y=n(/^Riwayat Penyakit Dahulu/i),k=n(/^Keluhan Utama/i),K=n(/^Keadaan Umum/i),G=n(/^Suhu/i),Y=n(/^Nadi/i),E=n(/^RR$/i),P=n(/^Tekanan Darah/i),U=n(/^Jam$/i),x=n(/^No\.?\s*Antrian/i),b=n(/^Status/i);return`<section class="rm-page" id="triage">
${V("TRIAGE")}
<div class="rm-form-title">TRIAGE TERINTEGRASI &amp; PENGKAJIAN AWAL IGD</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("No. Rekam Medis",L,!0)}
    ${o("Nama Pasien",l,!0)}
    ${o("Tanggal",d)}
    ${o("Jam Datang",N)}
    ${o("Jam Registrasi",c)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Cara Datang",S)}
    ${o("Diantar Polisi",g)}
    ${o("No. ID",w)}
    ${o("Pengantar Pasien",I)}
    ${o("Status Triage",b,!0)}
  </table></div>
</div>

<div class="sub-heading-rm">ANAMNESA &amp; RIWAYAT</div>
<table class="rm-grid-table"><tbody>
  ${o("Riwayat Penyakit Dahulu",y)}
  ${o("Keluhan Utama",k)}
</tbody></table>

<div class="sub-heading-rm">TANDA VITAL &amp; PEMERIKSAAN</div>
<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${o("Keadaan Umum",K)}
    ${o("Suhu (\xB0C)",G)}
    ${o("Nadi (x/menit)",Y)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("RR (x/menit)",E)}
    ${o("Tekanan Darah (mmHg)",P)}
    ${o("Jam",U)}
    ${o("No. Antrian",x)}
  </table></div>
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>Status Triage : ${a(b)}</div>
    <div>No. Antrian : ${a(x)}</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter yang Memeriksa</div>
    ${t?`<img class="rm-sig-qr" src="${a(t)}" alt="QR tanda tangan dokter" width="80" height="80" />`:""}
    ${t?"":'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(u!=="-"?u:xt(t))} )</div>
  </div>
</div>
</section>`}function Ka(i){let M=i.find(m=>/PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(m.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=t?Array.from(t.querySelectorAll("table")):[],r=m=>(m.innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim(),u=m=>m?Array.from(m.rows).map($=>Array.from($.cells).map(r)):[],n=m=>{let $=e.find(F=>m.test((F.rows[0]?.textContent||"").replace(/\s+/g," ").trim()));return u($)},L=m=>{let $=e.find(F=>m.test(F.textContent||""));return u($)},l=e.find(m=>/^Usia$/i.test((m.rows[1]?.cells[1]?.textContent||"").trim())),d=e.find(m=>/^Riwayat Jatuh$/i.test((m.rows[1]?.cells[1]?.textContent||"").trim())),N=m=>m.reduce(($,F)=>{let it=D(F),at=it==="-"?0:Number(it);return $+(Number.isFinite(at)?at:0)},0),c=(m,$)=>$?m>=45?"TINGGI":m>=25?"SEDANG":"RENDAH":m>=12?"TINGGI":m>=6?"SEDANG":"RENDAH",S=(m,$)=>{let F=N(m);return`${F} \u2014 ${c(F,$)}`},g=m=>m?Array.from(m.rows).map(($,F)=>{let it=Array.from($.cells).map(at=>{let lt=jt(at),At=at.rowSpan>1?` rowspan="${at.rowSpan}"`:"",It=at.colSpan>1?` colspan="${at.colSpan}"`:"",nt=/JUMLAH SKOR|Keterangan Hasil|Catatan/i.test(lt),ht=lt.includes("\u2713"),Tt=F===0?"th":"td";return`<${Tt}${At}${It}${nt?' style="font-weight:bold;text-align:right;"':""}>${ht?`<strong>${a(lt)}</strong>`:a(lt||"-")}</${Tt}>`}).join("");return`<tr${F===0?' class="sec-hdr"':""}>${it}</tr>`}).join(""):'<tr><td colspan="5">-</td></tr>',w=n(/^Triase/i),I=n(/^Pengkajian\s*0\s*1\s*2\s*Nilai/i),y=L(/MORSE FALL SCALE/i),k=n(/^Objektif\s*Kelainan/i),K=n(/^Diagnosa Utama$/i),G=n(/^Diagnosa Banding$/i),Y=n(/^Tindakan$/i),E=n(/^Pukul\s*Nama Obat/i),P=n(/^No\s*Nama Perawat IGD/i),U=(m,$)=>{let F=Array.isArray($)?$.join(""):$;return'<table class="rm-grid-table"><thead><tr>'+m.map(it=>`<th>${a(it)}</th>`).join("")+"</tr></thead><tbody>"+(F||'<tr><td colspan="'+m.length+'">-</td></tr>')+"</tbody></table>"},x=I.slice(1).map(m=>{if(m.some(F=>/^TOTAL$/i.test((F||"").trim()))){let F=m[m.length-1]||"-";return`<tr style="font-weight:bold;"><td colspan="4" style="text-align:right;"><strong>TOTAL</strong></td><td class="center"><strong>${a(F)}</strong></td></tr>`}return"<tr>"+m.map((F,it)=>`<td${it===0?"":' class="center"'}>${a(F||"-")}</td>`).join("")+"</tr>"}).join(""),b=k.slice(1).map(m=>`<tr><td>${a(m[0]||"-")}</td><td>${a(m.slice(1).filter(Boolean).join(" ")||"-")}</td></tr>`).join(""),A=[["DIAGNOSA UTAMA",K.slice(1).flat().filter(Boolean).join(" ")||"-"],["DIAGNOSA BANDING",G.slice(1).flat().filter(Boolean).join(" ")||"-"]].map(([m,$])=>`<tr><td style="width:180px;"><strong>${m}</strong></td><td>${a($)}</td></tr>`).join(""),v=Y.slice(1).flat().filter(Boolean).join(" ")||"-",p=E.slice(1).filter(m=>m.some(Boolean)).map(m=>"<tr>"+m.slice(0,4).map($=>`<td>${a($||"-")}</td>`).join("")+"</tr>").join(""),h=P.slice(1).flat().filter(Boolean).join(" \xB7 "),C=Pa(i).find(m=>(m[0]||"").includes("\u2713"))?.slice(1)||[],Q=m=>{let $=m.find(at=>/^JUMLAH SKOR/i.test(at[0]||"")),F=m.find(at=>/^Keterangan Hasil/i.test(at[0]||"")),it=$?.slice(1).filter(Boolean).join(" ")||"-";return F?`${it} \xB7 ${F.slice(1).filter(Boolean).join(" ")}`:it},D=m=>document.querySelector(`input[name="${m}"]:checked`)?.value||"-",f=m=>(Array.from(t?.querySelectorAll("label")||[]).find(F=>m.test((F.textContent||"").replace(/\s+/g," ").trim()))?.nextElementSibling?.textContent||"").replace(/\s+/g," ").trim()||"-",R=(Array.from(t?.querySelectorAll("div")||[]).find($=>/^Planning\s*:\s*Terapy/i.test(($.textContent||"").trim().slice(0,80)))?.nextElementSibling?.textContent||"").split(/TINDAK LANJUT/i)[0].split(/Kondisi Pasien Saat Pindah/i)[0].replace(/[ \t]+/g," ").trim()||"-",z=s("pengkajian_keperawatan"),[j,O,W]=(()=>{let m=z.split(/\n\s*RPD\s*:/i),$=m[0].replace(/^\s*Subjektif\s*:\s*/i,"").trim()||"-",F=(m[1]||"").split(/\n\s*RPO\s*:/i);return[$,F[0]?.trim()||"-",F[1]?.trim()||"-"]})(),X=(m,$)=>D(m)==="ya"?s($):D(m)==="tidak"?"Tidak":"-",rt=m=>{let $=Array.from(document.querySelectorAll(`input[name="${m}"]:checked`)).map(F=>F.value).filter(Boolean);return $.length?$.join(", "):"-"},H=m=>({tanpa_bantuan:"Jalan Tanpa Bantuan",kursi_roda:"Kursi Roda",tempat_tidur:"Brankar",dengan_bantuan:"Dengan Bantuan",tidak_ada:"Tidak mengalami cedera",lantas:"KLL",lainnya:"Lainnya",tidak:"Tidak Terganggu",ya:"Ada Gangguan",Bpjs:"BPJS Kesehatan"})[m]||m||"-",B=(m,$)=>`<tr><td style="width:175px;"><strong>${m}</strong></td><td>${$}</td></tr>`,Z=(m,$)=>`<tr><td class="lbl">${m}</td><td class="col">:</td><td class="val">${$}</td></tr>`,tt=Number(s("nutrisi_bb")),Lt=Number(s("nutrisi_tb"))/100,Mt=tt>0&&Lt>0?(tt/(Lt*Lt)).toFixed(1).replace(".",","):"-";return`<section class="rm-page" id="pengkajian-igd">
${V("PENGKAJIAN IGD")}
<div class="rm-form-title">LEMBAR PENGKAJIAN INSTALASI GAWAT DARURAT</div>

<div class="igd-masthead">
  <div class="igd-masthead-label">Pasien \xB7 Instalasi Gawat Darurat</div>
  <div class="igd-masthead-name">${a(s("nama"))}</div>
</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"),!0)}
    ${o("Tgl. Lahir / Umur",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",/perempuan|^p$/i.test(s("jenis_kelamin","jk"))?"Perempuan (P)":"Laki-laki (L)")}
    ${o("Agama / Suku",`${f(/^Agama/i)} / ${f(/^Suku/i)}`)}
    ${o("Pekerjaan",s("pekerjaan"))}
    ${o("No. Telp / HP",s("no_hp","telepon"))}
    ${o("Nama Orangtua / Pasangan",`${s("nama_orangtua")} / ${s("nama_pasangan")}`)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Masuk",s("tgl_masuk"))}
    ${o("Tiba di IGD / Diperiksa",`Pukul ${s("pukul_tiba_di_rs")} / Diperiksa Pukul ${s("pukul_diperiksa")}`)}
    ${o("Prosedur Masuk",H(D("kaji[prosedur_masuk]")))}
    ${o("Cara Masuk",H(D("kaji[cara_masuk]")))}
    ${o("Penyebab Cedera",H(D("kaji[penyebab_cedera]")))}
    ${o("Status Alergi",X("kaji[status_alergi]","status_alergi_text"))}
    ${o("Gangguan Perilaku",H(D("kaji[gangguan_perilaku]")))}
    ${Z("Status Kehamilan",/perempuan|^p$/i.test(s("jenis_kelamin","jk"))?a(s("status_kehamilan")):'<span class="filter-note">Tidak berlaku (Pasien Laki-laki \u2014 disaring otomatis)</span>')}
  </table></div>
</div>

<div class="igd-summary">
  <div><span>Triase</span><b>${a(C[0]||"-")} ${a(C[1]||"")}</b></div>
  <div><span>GCS / Kesadaran</span><b>${a(s("vital_gcs"))} \xB7 ${a(s("vital_kesadaran"))}</b></div>
  <div><span>SpO2 / Nadi</span><b>${a(s("vital_spo"))} \xB7 ${a(s("vital_nadi"))}</b></div>
  <div><span>Risiko Jatuh (Morse)</span><b>${a(Q(y))}</b></div>
</div>

<div class="sub-heading-rm">KONDISI AWAL &amp; RIWAYAT</div>
<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${o("Prosedur Masuk",D("kaji[prosedur_masuk]"))}
    ${o("Cara Masuk",D("kaji[cara_masuk]"))}
    ${o("Status Alergi",X("kaji[status_alergi]","status_alergi_text"))}
    ${o("Status Psikologi",D("kaji[status_psikologi]"))}
    ${o("Status Sosial",D("kaji[status_sosial]"))}
    ${o("Status Ekonomi",D("kaji[status_ekonomi]"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Nutrisi (BB/TB)",`${s("nutrisi_bb")} kg / ${s("nutrisi_tb")} cm`)}
    ${o("Kognitif",D("kaji[fungsi_kognitif]"))}
    ${o("Motorik",D("kaji[fungsi_motorik]"))}
    ${o("Hambatan Pembelajaran",X("kaji[hambatan_pembelajaran]","terhambat_pembelajaran_text"))}
    ${o("Kebutuhan Edukasi",D("kaji[kebutuhan_edukasi]"))}
    ${o("Penerjemah",X("kaji[dibutuhkan_penerjemah]","penerjemah_text"))}
  </table></div>
</div>

<div class="sub-heading-rm">TANDA VITAL SAAT MASUK</div>
${U(["TEKANAN DARAH","NADI","PERNAPASAN","SUHU","SpO2","GCS","GCS (E/V/M)","KESADARAN"],["<tr>"+[ft(s("vital_td")),s("vital_nadi"),s("vital_nafas"),s("vital_suhu"),s("vital_spo"),s("vital_gcs")].map(m=>`<td class="center">${a(m)}</td>`).join("")+`<td class="center">${a([s("vital_e"),s("vital_m"),s("vital_v")].join("/"))}</td><td class="center">${a(s("vital_kesadaran"))}</td></tr>`])}

<div class="sub-heading-rm">KONDISI SAAT PINDAH / PULANG DARI IGD</div>
${U(["PUKUL","TEKANAN DARAH","NADI","PERNAPASAN","SUHU","SpO2","GCS","KESADARAN"],["<tr>"+[s("waktu_pasien_pulang"),ft(s("kondisi_pasien_td")),s("kondisi_pasien_nadi"),s("kondisi_pasien_nafas"),s("kondisi_pasien_suhu"),s("kondisi_pasien_spo"),s("kondisi_pasien_gcs"),s("kondisi_pasien_kesadaran")].map(m=>`<td class="center">${a(m)}</td>`).join("")+"</tr>"])}

<div class="sub-heading-rm">TRIASE (DIISI OLEH DOKTER)</div>
<table class="rm-table">
  <thead>
    <tr><th style="width:34px;">PILIH</th><th style="width:95px;">SKALA TRIASE</th><th>KATEGORI &amp; KETERANGAN KLINIS</th><th style="width:105px;">RESPON TIME</th></tr>
  </thead>
  <tbody>${w.slice(1).map(m=>{let $=(m[0]||"").includes("\u2713"),F=m.length>=4?m.slice(1,4):m.slice(0,3);return`<tr${$?' style="font-weight:bold;"':""}><td class="center"><span class="chk-box">${$?"&#10003;":"&nbsp;"}</span></td>${F.map(it=>`<td>${a(it||"-")}</td>`).join("")}</tr>`}).join("")}</tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">II. PENGKAJIAN PSIKOSOSIAL, SPIRITUAL, EKONOMI, NUTRISI &amp; FUNGSIONAL</td></tr></thead>
  <tbody>
    ${B("Status Psikologi",D("kaji[status_psikologi]")||"-")}
    ${B("Status Sosial &amp; Spiritual",`Hubungan keluarga: ${D("kaji[status_sosial]")||"-"} | Kegiatan keagamaan: ${a(s("status_spiritual"))}`)}
    ${B("Status Pembiayaan",H(D("kaji[status_ekonomi]")))}
    ${B("Antropometri &amp; Nutrisi",`BB: <strong>${a(s("nutrisi_bb"))} Kg</strong> | TB: <strong>${a(s("nutrisi_tb"))} Cm</strong> | IMT: <strong>${Mt} kg/m&sup2;</strong> | Konsul Gizi: ${D("kaji[nutrisi_konsul]")||"-"}`)}
    ${B("Status Fungsional",`Kognitif: ${D("kaji[fungsi_kognitif]")||"-"} | Motorik: ${D("kaji[fungsi_motorik]")||"-"}`)}
    ${B("Komunikasi &amp; Edukasi",`Hambatan: ${X("kaji[hambatan_pembelajaran]","terhambat_pembelajaran_text")} | Penerjemah: ${X("kaji[dibutuhkan_penerjemah]","penerjemah_text")} | Kebutuhan Edukasi: ${rt("kaji[kebutuhan_edukasi]")}`)}
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">III. ASESMEN NYERI \u2014 WONG BAKER / NRS (PQRST)</td></tr></thead>
  <tbody>
    <tr>
      <td style="width:165px;"><strong>Skala Wong Baker</strong></td>
      <td><span class="filter-note">Skala nyeri Wong Baker (0\u20135) \u2014 lihat halaman asal; di dossier ini tidak ditampilkan sebagai gambar.</span></td>
    </tr>
    <tr><td><strong>(P) Faktor Pencetus</strong></td><td>${a(s("faktor_pencetus"))}</td></tr>
    <tr><td><strong>(Q) Kualitas Nyeri</strong></td><td>${D("kaji[qualitas]")||"-"}</td></tr>
    <tr><td><strong>(R) Lokasi &amp; Penjalaran</strong></td><td>${a(s("lokasi_nyeri"))} &nbsp;|&nbsp; <strong>Menjalar:</strong> ${D("kaji[nyeri_menjalar]")||"-"}</td></tr>
    <tr><td><strong>(S) Skala Nyeri (NRS 0\u201310)</strong></td><td>${a(s("skala_nyeri"))} &nbsp;|&nbsp; Wong Baker: ${a(s("emo_wong"))}</td></tr>
    <tr><td><strong>(T) Waktu &amp; Frekuensi</strong></td><td>${a(s("lamanya_nyeri"))} &nbsp;|&nbsp; ${D("kaji[nyeri_frekwensi]")||"-"}</td></tr>
  </tbody>
</table>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="5">IV. PENGKAJIAN NYERI (FLACC)</td></tr>
    <tr><th>PENGKAJIAN</th><th>0</th><th>1</th><th>2</th><th>NILAI</th></tr>
  </thead>
  <tbody>${x||'<tr><td colspan="5">-</td></tr>'}</tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="5">V. ASESMEN AWAL RESIKO JATUH PADA ANAK (HUMPTY DUMPTY)</td></tr></thead>
  <tbody>
    <tr>
      <td colspan="2"><strong>SKOR TERPILIH</strong></td>
      <td colspan="3"><strong>${S(["kaji[arja_usia]","kaji[arja_jenis_kelamin]","kaji[arja_diagnosis]","kaji[arja_gangguan_kognitif]","kaji[arja_faktor_lingkungan]","kaji[arja_respon_pembedahan]","kaji[arja_medikamentosa]"],!1)}</strong></td>
    </tr>
    ${g(l)}
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="5">VI. ASESMEN AWAL RESIKO JATUH PADA DEWASA (MORSE FALL SCALE)</td></tr></thead>
  <tbody>
    <tr>
      <td colspan="2"><strong>SKOR TERPILIH</strong></td>
      <td colspan="3"><strong>${S(["kaji[arja_dewasa_jatuh]","kaji[arja_dewasa_diagnosa]","kaji[arja_dewasa_alat]","kaji[arja_dewasa_infus]","kaji[arja_dewasa_carajalan]","kaji[arja_dewasa_mental]"],!0)}</strong></td>
    </tr>
    ${g(d)}
  </tbody>
</table>

<div class="two-col-grid">
  <div class="col-half">
    <table class="rm-table" style="margin-bottom: 0; height: 100%;">
      <thead>
        <tr class="sec-hdr"><td colspan="3">VI-A. PERBANDINGAN TANDA VITAL (OBJEKTIF)</td></tr>
        <tr><th>PARAMETER</th><th style="width: 108px;">AWAL IGD</th><th style="width: 108px;">PINDAH HCU</th></tr>
      </thead>
      <tbody>
        ${[["Tekanan Darah (TD)",s("vital_td"),s("kondisi_pasien_td")],["Nadi (HR)",s("vital_nadi"),s("kondisi_pasien_nadi")],["Pernapasan (RR)",s("vital_nafas"),s("kondisi_pasien_nafas")],["Suhu Aksila",s("vital_suhu"),s("kondisi_pasien_suhu")],["Saturasi Oksigen (SpO2)",s("vital_spo"),s("kondisi_pasien_spo")],["Kesadaran",s("vital_kesadaran"),s("kondisi_pasien_kesadaran")],["Skor GCS",s("vital_gcs"),s("kondisi_pasien_gcs")]].map(([m,$,F])=>`<tr><td><strong>${a(m)}</strong></td><td class="center">${a($)}</td><td class="center">${a(F)}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>
  <div class="col-half">
    <table class="rm-table" style="margin-bottom: 0;">
      <thead>
        <tr class="sec-hdr"><td colspan="2">VI-B. PEMERIKSAAN FISIK LOKALIS &amp; PENUNJANG</td></tr>
        <tr><th>OBJEKTIF</th><th>KELAINAN</th></tr>
      </thead>
      <tbody>${b}</tbody>
    </table>
  </div>
</div>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">V. PENGKAJIAN MEDIS DOKTER IGD \u2014 ANAMNESIS (SUBJEKTIF)</td></tr></thead>
  <tbody>
    <tr><td style="width:155px;"><strong>(a) Keluhan Utama &amp; RPS</strong></td><td>${J(j)}</td></tr>
    <tr><td><strong>(b) Riwayat Penyakit Dahulu (RPD)</strong></td><td>${J(O)}</td></tr>
    <tr><td><strong>(c) Riwayat Penggunaan Obat (RPO)</strong></td><td>${J(W)}</td></tr>
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">VI. DIAGNOSA &amp; TINDAKAN & PLANNING TERINTEGRASI</td></tr></thead>
  <tbody>
    ${A}
    <tr><td style="width:165px;"><strong>TINDAKAN</strong></td><td>${a(v)}</td></tr>
    <tr>
      <td><strong>PEMERIKSAAN PENUNJANG</strong></td>
      <td>EKG: ${a(f(/^EKG$/i))} &nbsp;|&nbsp; Radiologi: ${a(f(/^Radiologi$/i))} &nbsp;|&nbsp; Laboratorium: ${a(f(/^Laboratorium$/i))}</td>
    </tr>
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">IX. PENGKAJIAN KEPERAWATAN &amp; MEDIS</td></tr></thead>
  <tbody><tr><td style="width:165px;"><strong>PENGKAJIAN KEPERAWATAN</strong></td><td>${J(s("pengkajian_keperawatan"))}</td></tr></tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">X. PLANNING / TERAPI TERINTEGRASI</td></tr></thead>
  <tbody>
    <tr>
      <td style="width:165px;vertical-align:top;"><strong>Tatalaksana Awal (A)</strong></td>
      <td>${J(R.split(/Konsul dr\./i)[0].trim()||"-")}</td>
    </tr>
    ${R.split(/(?=Konsul dr\.)/i).slice(1).map((m,$)=>{let F=m.match(/^Konsul (dr\.?[^:\n]+)/i)?.[1]?.trim()||"-",it=m.match(/Plan\s*:\s*([\s\S]*?)(?=Terapi\s*:|Konsul dr\.|$)/i)?.[1]?.trim()||"-",at=m.match(/Terapi\s*:\s*([\s\S]*?)(?=Konsul dr\.|$)/i)?.[1]?.trim()||"-",lt=m.match(/Dx\s*:\s*([\s\S]*?)(?=Masalah\s*:|Terapi\s*:|Konsul dr\.|$)/i)?.[1]?.trim()||"-",At=m.match(/Masalah\s*:\s*([\s\S]*?)(?=Terapi\s*:|Konsul dr\.|$)/i)?.[1]?.trim()||"-";return`<tr>
          <td style="width:165px;vertical-align:top;"><strong>Advis ( ${String.fromCharCode(66+$)} ) \u2014 ${a(F)}</strong></td>
          <td>
            ${lt!=="-"?`<strong>Dx:</strong> ${J(lt)}<br/>`:""}
            ${At!=="-"?`<strong>Masalah:</strong> ${J(At)}<br/>`:""}
            ${it!=="-"?`<strong>Visite Plan:</strong> ${J(it)}<br/>`:""}
            ${at!=="-"?`<strong>Terapi:</strong> ${J(at)}`:""}
          </td>
        </tr>`}).join("")}
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">XI. DISPOSISI TINDAK LANJUT</td></tr></thead>
  <tbody>
    <tr><td style="width:165px;"><strong>Tindak Lanjut</strong></td><td>${D("medis[tindak_lanjut]")||"-"}</td></tr>
    <tr><td><strong>Ruangan Rawat Inap</strong></td><td>${a(s("tindak_lanjut_ruangan_ranap"))} \u2014 Indikasi: ${a(s("tindak_lanjut_indikasi_ranap"))}</td></tr>
    <tr><td><strong>Pukul Pindah / Pulang</strong></td><td>${a(s("waktu_pasien_pulang"))}</td></tr>
    <tr><td><strong>Kondisi Pasien Saat Pindah</strong></td><td>TD ${a(ft(s("kondisi_pasien_td")))} | Nadi ${a(s("kondisi_pasien_nadi"))} | RR ${a(s("kondisi_pasien_nafas"))} | Suhu ${a(s("kondisi_pasien_suhu"))} | SpO2 ${a(s("kondisi_pasien_spo"))} | GCS ${a(s("kondisi_pasien_gcs"))} | Kesadaran ${a(s("kondisi_pasien_kesadaran"))}</td></tr>
  </tbody>
</table>

<div class="sub-heading-rm">OBAT / TERAPI IGD</div>
${U(["PUKUL","NAMA OBAT","DOSIS / RUTE","TANDA TANGAN"],p)}

<div class="sub-heading-rm">PERAWAT IGD</div>
<table class="rm-grid-table"><tbody><tr><td>${a(h||"-")}</td></tr></tbody></table>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>Ruangan : ${a(s("tindak_lanjut_ruangan_ranap"))}</div>
    <div>Perawat Ruangan : ${a(s("perawat_ruangan"))}</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter IGD</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${a(s("dokter_igd","dokter"))} )</div>
  </div>
</div>
</section>`}function Ya(i,M){let t=[/^Telaah/i,/^SBPK/i,/^Radiologi/i],e=u=>{let n=t.findIndex(L=>L.test(u));return n<0?99:n},r=[...i].sort((u,n)=>e(u.title)-e(n.title));for(let u of r){let n=new DOMParser().parseFromString(u.html,"text/html");for(let L of Array.from(n.querySelectorAll("tr"))){let l=Array.from(L.cells).map(d=>(d.textContent||"").replace(/\s+/g," ").trim());for(let d=0;d<l.length-2;d++)if(M.test(l[d])&&l[d+1]===":"&&l[d+2])return l[d+2];for(let d of l){let N=d.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);if(N&&M.test(N[1].trim())&&N[2]&&!N[2].includes(":")&&N[2].length<=160)return N[2].trim()}}}return"-"}var ct=i=>mt("alamat").replace(/^\s*:\s*/,"").trim()||Ya(i,/^Alamat/i),et=(i,M)=>{let t=i.find(r=>M.test(r.title));if(!t)return[];let e=new DOMParser().parseFromString(t.html,"text/html");return Array.from(e.querySelectorAll("img")).map(r=>r.getAttribute("src")||"").filter(r=>/qr|barcode/i.test(r))},xt=i=>{if(!i)return"-";try{let M=i.split(/[?&](?:size|choe|cht|chl)=/i)[0]??i,t=decodeURIComponent(M.replace(/\+/g," "));return(t.match(/oleh\s*:\s*([^&]+)/i)?.[1]||t.match(/approve\s*([\s\S]*?)\s+tgl\b/i)?.[1]||t.match(/(dr\.[^&]+)/i)?.[1]||"").split(/\s+(?:tgl|jam)\b/i)[0].replace(/\s+/g," ").trim()||"-"}catch{return"-"}},ft=i=>/\d/.test(i)?i:"-";function ut(i,M){let t=i.find(u=>M.test(u.title)),e=t?new DOMParser().parseFromString(t.html,"text/html"):null,r=new Map;if(!e)return r;for(let u of Array.from(e.querySelectorAll("tr"))){let n=Array.from(u.cells).map(L=>(L.innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim());for(let L=0;L<n.length-1;L++){let l=n[L].replace(/^[-:\s]+|[\s:]+$/g,"");!l||r.has(l)||(n[L+1]===":"&&n[L+2]?r.set(l,n[L+2]):n[L+1].startsWith(":")&&n[L+1].length>1&&r.set(l,n[L+1].replace(/^:\s*/,"").trim()))}for(let L of n)for(let l of L.split(/\n+/)){let d=l.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);d&&d[2].length<=120&&!r.has(d[1].trim())&&r.set(d[1].trim(),d[2].trim())}}return r}var Qa=i=>{try{return decodeURIComponent(i)}catch{return i}},St=i=>i.replace(/&gt;/gi,">").replace(/&lt;/gi,"<").replace(/&quot;/gi,'"').replace(/&#39;/g,"'").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&nbsp;/gi," ");function jt(i){return St((i.innerHTML||"").replace(/<!--[\s\S]*?-->/g,"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim())}function Ba(i,M){let t=new RegExp(M.source,M.flags.includes("g")?M.flags:M.flags+"g"),e=Array.from(i.matchAll(t)).map(r=>r.index??0);return e.length<2?[i]:e.map((r,u)=>i.slice(r,u+1<e.length?e[u+1]:i.length))}function Fa(i,M){let t=new Map;for(let e of Array.from(i.querySelectorAll("tr"))){let r=Array.from(e.cells).map(jt);for(let u=0;u<r.length-1;u++){let n=r[u].replace(/^[-:\s]+|[\s:]+$/g,"").trim();if(!M.test(n)||t.has(n))continue;let L=r[u+1].replace(/^:\s*/,"").trim();L&&t.set(n,L)}}return t}var ot=(i,...M)=>{for(let[t,e]of i)if(M.some(r=>r.test(t)))return St(e);return"-"};function Et(i,M,t=30){let e=i.find(n=>M.test(n.title)),r=e?new DOMParser().parseFromString(e.html,"text/html"):null;if(!r)return[];let u=[];for(let n of Array.from(r.querySelectorAll("tr"))){let L=Array.from(n.cells).map(l=>(l.textContent||"").replace(/\s+/g," ").trim());if(L.length&&L.some(Boolean)&&u.push(L),u.length>=t)break}return u}var Nt=i=>'<table class="rm-grid-table"><tbody>'+i.map(([M,t])=>`<tr><td style="width:175px;"><strong>${M}</strong></td><td>${J(t)}</td></tr>`).join("")+"</tbody></table>",bt=(i,M,t=!1)=>{let e=t?[...i,"VER (&#10003;)"]:i;return'<table class="rm-grid-table"><thead><tr>'+e.map(r=>`<th>${r}</th>`).join("")+"</tr></thead><tbody>"+(M.length?M.map(r=>"<tr>"+e.map((u,n)=>t&&n===e.length-1?'<td class="center"><input type="checkbox" class="rm-checkbox"></td>':`<td>${J(r[n]||"-")}</td>`).join("")+"</tr>").join(""):`<tr><td colspan="${e.length}">-</td></tr>`)+"</tbody></table>"},gt=(i,M)=>'<div class="rm-signature-block">'+[i,M].map((t,e)=>`<div class="rm-sig-box${e?"":" left-align"}">`+t.slice(0,-1).map(r=>`<div>${r}</div>`).join("")+`<div class="rm-sig-space"></div><div class="rm-sig-name">${t[t.length-1]}</div></div>`).join("")+"</div>";function Ga(i){let M=i.find(j=>/^Persetujuan Tindakan/i.test(j.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=t?Array.from(t.querySelectorAll("table")):[],r=j=>St((j.innerHTML||"").replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/[ \t]+/g," ").trim()),u=j=>j?Array.from(j.rows).map(O=>Array.from(O.cells).map(r)):[],n=j=>j?.querySelector('img[src*="qrserver"], img[src*="qr-code"]')?.getAttribute("src")||"",L=j=>j.replace(/-->\s*/g,"").replace(/\btsb\b/gi,"tersebut").replace(/pembiuasan/gi,"pembiusan").replace(/\bizi Tuhan\b/gi,"izin Tuhan").replace(/\bresiko\b/gi,"risiko").replace(/\bAm\.?kep\b/gi,"A.Md.Kep").replace(/\s+/g," ").trim(),l=e.find(j=>/PEMBERIAN INFORMASI/i.test(j.rows[0]?.textContent||"")),d=e.find(j=>/JENIS INFORMASI/i.test(j.rows[0]?.textContent||"")),N=e.find(j=>/Dengan ini menyatakan bahwa saya dokter/i.test(j.rows[0]?.textContent||"")),c=e.find(j=>/PERSETUJUAN TINDAKAN KEDOKTERAN/i.test(j.rows[0]?.textContent||"")),S=u(l).slice(1).map(j=>[j[0]||"-",L((j[1]||j[2]||"-").replace(/^:\s*/,""))]).filter((j,O,W)=>W.findIndex(X=>X[0]===j[0])===O),g=u(d).slice(1).map((j,O)=>({no:/^\d+$/.test(j[0]||"")?j[0]:String(O+1),label:L(j[1]||"-"),isi:L(j[2]||"-"),centang:(j[3]||"").includes("\u2713")})),w=(N?Array.from(N.rows):[]).map(j=>({teks:L(r(j.cells[0])),ttd:L(j.cells[1]?r(j.cells[1]):""),qr:n(j.cells[1])})).filter((j,O,W)=>W.findIndex(X=>X.teks===j.teks)===O),I=u(c),y=L(I[2]?.join(" ")||"-"),k=L(I[3]?.join(" ")||"-"),G=(c?Array.from(c.rows[4]?.cells||[]):[]).map((j,O)=>({teks:L(r(j)),qr:O===2?n(j):""})),Y=s("nama"),E=j=>j.replace(/Jambi\s*,?\s*\d{1,2}\/\d{1,2}\/\d{4}\s*,?\s*Jam\s*[\d:.]+/gi,"").replace(/\s+/g," ").trim(),P=j=>j.match(/\(([^)]+)\)/)?.[1]?.trim()||E(j)||"-",U=E(y),x=E(k),b=U.match(/Nama\s*:\s*(.+?)(?=\s+Umur\s*:|$)/i)?.[1]?.trim()||"-",A=U.match(/Umur\s*:\s*(.+?)(?=\s+Jenis Kelamin\s*:|$)/i)?.[1]?.trim()||"-",v=U.match(/Jenis Kelamin\s*:\s*(.+?)(?=\s+Alamat\s*:|$)/i)?.[1]?.trim()||"-",p=U.match(/Alamat\s*:\s*(.+)$/i)?.[1]?.trim()||"-",h=g.find(j=>j.no==="3")?.isi||"-",C=j=>x.match(j)?.[0]?.trim()||"",Q=[C(/Saya memahami perlunya dan manfaat tindakan tersebut[\s\S]*?(?=Saya juga menyadari|$)/i),C(/Saya juga menyadari[\s\S]*?(?=Saya memahami perlunya tindakan pembiusan|Saya bertanggung jawab|$)/i),C(/Saya memahami perlunya tindakan pembiusan[\s\S]*?(?=Saya bertanggung jawab|$)/i),C(/Saya bertanggung jawab[\s\S]*$/i)].filter(Boolean),D=(j,O)=>{let W=E(G[j]?.teks||"").replace(O,"");return P(W)},f=D(0,/Yang Menyatakan/i),R=D(1,/Saksi Keluarga/i),z=D(2,/Saksi Rumah Sakit/i);return`<section class="rm-page" id="form-konsent">
${V("RM. 19A")}
<div class="rm-form-title">PERSETUJUAN TINDAKAN KEDOKTERAN (RM 19 A)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",Y,!0)}
    ${o("Umur",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
    ${o("Alamat",ct(i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${S.map(([j,O])=>o(j,O,j==="Penerima Informasi / Pemberi Persetujuan")).join("")}
  </table></div>
</div>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="4">I. PEMBERIAN INFORMASI</td></tr>
    <tr><th style="width:28px;">NO</th><th>JENIS INFORMASI</th><th>ISI INFORMASI</th><th style="width:70px;">TANDA (&#10003;)</th></tr>
  </thead>
  <tbody>
    ${g.length?g.map(j=>`<tr><td class="center">${a(j.no)}</td><td>${a(j.label)}</td><td>${J(j.isi)}</td><td class="center">${j.centang?"&#10003;":"&nbsp;"}</td></tr>`).join(""):'<tr><td colspan="4">-</td></tr>'}
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="4">II. PERNYATAAN PEMBERI &amp; PENERIMA INFORMASI</td></tr></thead>
  <tbody>
    ${w.length?w.map((j,O)=>`<tr><td colspan="3">${J(E(j.teks))}</td><td style="text-align:center;vertical-align:top;"><div>${O===0?"Tanda Tangan Dokter":"Tanda Tangan Penerima"}</div>`+(j.qr?`<img class="rm-sig-qr" src="${a(j.qr)}" alt="QR tanda tangan" width="80" height="80" />`:'<div class="rm-sig-space"></div>')+`<div>( <strong>${a(P(j.ttd))}</strong> )</div></td></tr>`).join(""):'<tr><td colspan="4">-</td></tr>'}
    <tr><td colspan="4">* Bila pasien tidak kompeten atau tidak mau menerima informasi, maka penerima informasi adalah wali atau keluarga terdekat.</td></tr>
  </tbody>
</table>

<div style="border:1px solid #000000;margin-bottom:5px;">
  <div class="sec-hdr" style="border-bottom:1px solid #000000;padding:4px 6px;">III. PERSETUJUAN TINDAKAN KEDOKTERAN</div>
  <div style="padding:5px 8px;">
    <div>Yang bertanda tangan di bawah ini, saya:</div>
    <table class="rm-grid-table"><tbody>
      <tr><td style="width:80px;">Nama</td><td style="width:10px;">:</td><td><strong>${a(b)}</strong></td><td style="width:80px;">Umur</td><td style="width:10px;">:</td><td>${a(A)}</td></tr>
      <tr><td>Jenis Kelamin</td><td>:</td><td>${a(v)}</td><td>Alamat</td><td>:</td><td>${a(p)}</td></tr>
    </tbody></table>
    <div>Dengan ini menyatakan <strong>PERSETUJUAN</strong> untuk dilakukannya tindakan kedokteran (<strong>${a(h)}</strong>) terhadap: &nbsp; <span class="chk-box">&nbsp;</span> diri saya sendiri &nbsp; <span class="chk-box">&#10003;</span> <strong>Wali / Keluarga dari pasien</strong>:</div>
    <table class="rm-grid-table"><tbody>
      <tr><td style="width:90px;">Nama Pasien</td><td style="width:10px;">:</td><td><strong>${a(Y)}</strong></td><td style="width:70px;">Umur</td><td style="width:10px;">:</td><td>${a(s("tgl_lahir","tglLahir"))}</td></tr>
      <tr><td>Jenis Kelamin</td><td>:</td><td><span class="chk-box">${/laki|^l$/i.test(s("jenis_kelamin","jk"))?"&#10003;":"&nbsp;"}</span> Laki-laki &nbsp; <span class="chk-box">${/perempuan|^p$/i.test(s("jenis_kelamin","jk"))?"&#10003;":"&nbsp;"}</span> Perempuan</td><td>Alamat</td><td>:</td><td>${a(ct(i))}</td></tr>
    </tbody></table>
    ${Q.map((j,O)=>`<div style="text-align:justify;margin:3px 0;">${O+1}. ${a(j)}</div>`).join("")}
    <table class="rm-table"><thead><tr>
      <th>Yang Menyatakan / Pemberi Persetujuan</th><th>Saksi Keluarga</th><th>Saksi Rumah Sakit</th>
    </tr></thead><tbody><tr>
      <td style="text-align:center;">
        ${G[0]?.qr?`<img class="rm-sig-qr" src="${a(G[0].qr)}" alt="QR penandatangan" width="80" height="80" />`:'<div class="rm-sig-space"></div>'}
        ( <strong>${a(f)}</strong> )
      </td>
      <td style="text-align:center;">
        ${G[1]?.qr?`<img class="rm-sig-qr" src="${a(G[1].qr)}" alt="QR saksi keluarga" width="80" height="80" />`:'<div class="rm-sig-space"></div>'}
        ( <strong>${a(R)}</strong> )
      </td>
      <td style="text-align:center;">
        ${G[2]?.qr?`<img class="rm-sig-qr" src="${a(G[2].qr)}" alt="QR saksi rumah sakit" width="80" height="80" />`:'<div class="rm-sig-space"></div>'}
        ( <strong>${a(z)}</strong> )
      </td>
    </tr></tbody></table>
  </div>
</div>
</section>`}function Vt(i){let M=i.find(T=>/^Anestesi/i.test(T.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=ut(i,/^Anestesi/i),r=(...T)=>ot(e,...T),u=(...T)=>{let q=St(r(...T)).replace(/\s+/g," ").trim();return q&&q!=="-"?q:"-"},n=t?(t.body.textContent||"").replace(/\s+/g," ").trim():"",L=t?Array.from(t.querySelectorAll("table")):[],l=T=>T?Array.from(T.rows).map(q=>Array.from(q.cells).map(st=>(st.textContent||"").replace(/\s+/g," ").trim())):[],d=T=>L.find(q=>T.test(Array.from(q.rows).flatMap(st=>Array.from(st.cells).filter(yt=>!yt.querySelector("table")).map(yt=>yt.textContent||"")).join(" "))),N=(T,q="after")=>{let st=T.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(q==="after"?`${st}\\s*\u2713`:`\u2713\\s*${st}`,"i").test(n)?"&#10003;":"&nbsp;"},c=(...T)=>{for(let q of i){let st=new DOMParser().parseFromString(q.html,"text/html");for(let yt of Array.from(st.querySelectorAll("tr"))){let Dt=Array.from(yt.cells).map(dt=>(dt.textContent||"").replace(/\s+/g," ").trim());for(let dt=0;dt<Dt.length-1;dt++){let ia=Dt[dt].replace(/^[-:\s]+|[\s:]+$/g,"");if(!T.some(ea=>ea.test(ia)))continue;let Ot=Dt[dt+1]===":"?Dt[dt+2]||"":Dt[dt+1].replace(/^:\s*/,"").trim();if(Ot)return Ot}}}return"-"},S=s("nama")!=="-"?s("nama"):u(/^Nama Pasien/i),g=s("norm","rekam_medis")!=="-"?s("norm","rekam_medis"):u(/^No\.? RM/i),w=s("tgl_lahir","tglLahir")!=="-"?s("tgl_lahir","tglLahir"):c(/^Tgl\.? Lahir|^Tanggal Lahir/i),I=s("umur")!=="-"?s("umur"):c(/^Umur/i),y=Number(I.match(/(\d{1,3})/)?.[1]||0),k=s("jenis_kelamin","jk")!=="-"?s("jenis_kelamin","jk"):c(/^Jenis Kelamin/i),K=/perempuan|^p$/i.test(k)?"Perempuan (P)":/laki|^l$/i.test(k)?"Laki-laki (L)":k,G=u(/^Dokter Anestesi/i),Y=u(/^Dokter Bedah/i)!=="-"?u(/^Dokter Bedah/i):s("dokter","dpjp"),E=u(/^Penata Anestesi/i),P=u(/^Ruangan/i)!=="-"?u(/^Ruangan/i):s("jenis","kelas","ruang"),U=u(/^Tanggal/i)!=="-"?u(/^Tanggal/i):s("tgl","tanggalAwal","tgl_masuk"),x=u(/^Diagnosis Prabedah|^Diagnosa Pra/i),b=u(/^Diagnosis Pasca Bedah|^Diagnosa Pasca/i),A=u(/^Jenis pembedahan/i),v=u(/^Jenis operasi/i),p=u(/^Jam Mulai/i),h=T=>{let q=L.find(st=>T.test(st.rows[0]?.textContent||""));return q?l(q).slice(1).map(st=>st.slice(1).filter(Boolean).join(" ")).filter(Boolean).join(", "):"-"},C=h(/MEDIKASI/i),Q=h(/PEMBERIAN CAIRAN/i),D=n.match(/kristaloid\s+(\d+)\s*ml/i)?.[1]??"-",f=n.match(/perdarahan\s*\(?EBL\)?\s*(\d+)\s*ml/i)?.[1]??"-",R=n.match(/diuresis\s*(\d+)\s*ml/i)?.[1]??"-",z=n.match(/Respirasi\s*:\s*([^,]+)/i)?.[1]?.trim()??"-",j=d(/Informed Consent/i),O=l(j).flat().filter(Boolean).map(T=>({label:T.replace(/^[\d\s✓]+/,"").trim(),on:/✓/.test(T)})).filter(T=>T.label&&T.label.length<60),W=O.length?O.map(T=>`<div><span class="chk-box">${T.on?"&#10003;":"&nbsp;"}</span> ${a(T.label)}</div>`).join(""):"<div>-</div>",X=d(/PENYAKIT PENYERTA/i),rt=l(X).slice(1).filter(T=>T.length>=2&&/^(Sistem|lain-lain)/i.test(T[0])),H=rt.length?rt.map(T=>`<div><span class="chk-box">${/ya|ada|\+/i.test(T[1])?"&#10003;":"&nbsp;"}</span> ${a(T[0])}</div>`).join(""):"<div>-</div>",B=Array.from(t?.querySelectorAll("img")||[]).filter(T=>{if(!(T.getAttribute("src")||"").startsWith("data:image"))return!1;let st=`${T.id} ${T.getAttribute("class")||""} ${T.alt||""}`.toLowerCase();return!/logo|kars|qr|barcode/.test(st)}),Z=T=>T?`<div class="chart-frame">${T.outerHTML}</div>`:'<div class="chart-frame">Grafik tidak tersedia pada berkas ini.</div>',tt=Z(B[0]),Lt=Z(B[1]??B[0]),Mt=et(i,/^Anestesi/i),$=[["Dokter Spesialis Anestesiologi",Mt[0]||"",G],["Penata / Perawat Anestesi",Mt[1]||"",E],["Perawat Ruangan",Mt[2]||"",xt(Mt[2])]].map(([T,q,st])=>'<div class="tte-box"><div>'+a(T)+'</div><div class="tte-qr">'+(q?`<img src="${a(q)}" alt="QR TTE" width="54" height="54" />`:"")+'</div><div class="tte-name">'+a(st)+"</div></div>").join(""),F=y>0&&y<18,it=N("Spinal","before")==="&#10003;"||N("Epidural","before")==="&#10003;"||N("Kaudal","before")==="&#10003;"||/subarachnoid/i.test(n),at=(...T)=>T.map(q=>s(q)).filter(q=>q!=="-").join(" / ")||"-",lt=at("skorRR","skor15","skor30","skor1jam","skor2jam","skorkeluarRR"),At=at("jampascaanestesi","jam15","jam30","jam45","1jam","2jam","3jam","4jam"),It=F?`<tr><td>Skor Steward</td><td colspan="3">Berlaku untuk pasien anak. Nilai: ${at("pergerakansteward","pernafasansteward","kesadaransteward")}</td></tr>`:`<tr><td>Aldrete Score</td><td colspan="3">Aktivitas \xB7 Pernapasan \xB7 Sirkulasi \xB7 Kesadaran \xB7 Warna \u2014 ${lt!=="-"?`skor (RR/15'/30'/1j/2j/keluar): <strong>${a(lt)}</strong>`:"skor diisi di halaman asal."}</td></tr>
       <tr><td>Bromage Score</td><td colspan="3">${it?`Gerakan penuh dari tungkai dan pergelangan kaki (blok motorik pulih) \u2014 ${At!=="-"?`nilai: <strong>${a(At)}</strong>`:"skor diisi di halaman asal."}`:"Tidak Berlaku (anestesi non-regional)."}</td></tr>
       <tr><td>Steward Score</td><td colspan="3"><em>Tidak Berlaku (khusus pasien anak \u2014 pasien dewasa).</em></td></tr>`,nt=(T,q="-")=>n.match(T)?.[1]?.trim()||q,ht=[`GCS ${nt(/GCS\s*:\s*(\d+)/i)}`,`TD ${nt(/Tekanan Darah\s*:\s*(\d+\s*\/\s*\d+)/i)} mmHg`,`Nadi ${nt(/Nadi\s*:\s*(\d+)/i)} x/mnt`,`RR ${nt(/RR\s*:\s*(\d+)/i)} x/mnt`,`BB ${nt(/BB\s*:\s*(\d+)/i)} kg`,`TB ${nt(/TB\s*:\s*(\d+)/i)} cm`].join(" \xB7 "),Tt=[`Suntikan ${nt(/Suntikan Jam\s*:\s*([\d:]+)/i)}`,`Analgesia ${nt(/analgesia Jam\s*:\s*([\d:]+)/i)}`,`Operasi ${nt(/operasi Jam\s*:\s*([\d:]+)/i)}`].join(" \xB7 "),Zt=[`Masuk RR ${nt(/Masuk ruangan pemulihan jam\s*:\s*([\d:]+)/i)}`,`Keluar RR ${nt(/Jam keluar ruangan pemulihan\s*:\s*([\d:]+)/i)}`,`TD ${nt(/Tanda Vital[^:]*Tekanan Darah\s*:\s*(\d+\s*\/\s*\d+)/i)} mmHg`,`Nadi ${nt(/Nadi\s*:\s*(\d+)(?=\s*x\/mnt)/i)} x/mnt`].join(" \xB7 "),ta=d(/INSTRUKSI PASCA ANESTESI/i),$t=l(ta).flat().map(T=>T.replace(/^[\d\s]+/,"").trim()).filter(T=>T&&!/INSTRUKSI PASCA ANESTESI/i.test(T)&&T.length>3),aa=$t.length?'<ol class="an-instruksi">'+$t.map(T=>`<li>${a(T)}</li>`).join("")+"</ol>":"<div>-</div>",_=(T,q)=>`<tr><td class="k">${T}</td><td class="c">:</td><td class="v">${q}</td></tr>`,pt=T=>`<tr><th class="rm-sec-head" style="text-align:left;">${T}</th></tr>`;return`<section class="rm-page" id="form-anestesi">
<div class="an-meta"><span>Halaman 1 dari 2</span></div>
${V("RM. 21")}
<div class="rm-form-title">LAPORAN ANESTESI</div>
<div class="an-subtitle">REKAM PELAKSANAAN ANESTESI</div>

<table class="rm-grid-table"><tbody><tr>
  <td style="width:52%;"><table class="an-kv">
    ${_("Nama Pasien",`<strong>${a(S)}</strong>`)}
    ${_("No. Rekam Medis",`<strong>${a(g)}</strong>`)}
    ${_("Tgl. Lahir / Umur",`${a(w)} (${a(I)} / ${a(K)})`)}
    ${_("Diagnosa Pra Bedah",a(x))}
    ${_("Diagnosa Pasca Bedah",`<strong>${a(b)}</strong>`)}
  </table></td>
  <td><table class="an-kv">
    ${_("Tanggal Tindakan",`<strong>${a(U)}</strong>`)}
    ${_("Jenis Pembedahan",a(A))}
    ${_("Jenis Operasi",a(v))}
    ${_("Ruangan",a(P))}
    ${_("Dokter Anestesi",`<strong>${a(G)}</strong>`)}
  </table></td>
</tr></tbody></table>

<table class="rm-grid-table"><tbody>${pt("A. JENIS PERSIAPAN ANESTESI")}
<tr><td><div class="an-grid-4">${W}</div></td></tr></tbody></table>

<table class="rm-grid-table"><tbody>${pt("B. PENGKAJIAN PRA BEDAH &amp; RENCANA ANESTESI")}
<tr><td><table class="an-kv">
  ${_("Waktu Mulai",a(p))}
  ${_("Tanda Vital Awal",a(ht))}
  ${_("Dokter Operator",a(Y))}
  ${_("Asisten Bedah",a(u(/^Asisten Bedah|^Asisten/i)))}
  ${_("Instrumen Bedah",a(u(/^Instrumen Bedah|^Perawat Instrumen/i)))}
  ${_("Rencana Anestesi",`${N("Anestesi Umum","before")} Umum &nbsp; ${N("Spinal","before")} Spinal &nbsp; ${N("Epidural","before")} Epidural &nbsp; ${N("Kaudal","before")} Kaudal`)}
</table>
<div class="an-risk"><strong>Riwayat Penyakit &amp; Faktor Risiko:</strong><div class="an-grid-3">${H}</div></div>
</td></tr></tbody></table>

<table class="rm-grid-table"><tbody>${pt("C. INDUKSI &amp; MONITORING ANESTESI")}
<tr><td><table class="an-kv">
  ${_("Teknik / Lokasi Tusukan",a(u(/^Lokasi Tusukan/i)))}
  ${_("Waktu Suntikan / Analgesia / Operasi",a(Tt))}
  ${_("Anestesi Lokal",a(u(/^Anestesi lokal/i)))}
  ${_("ASA",`${N(" I ")} I &nbsp; ${N(" II ")} II &nbsp; ${N(" III ")} III &nbsp; ${N(" IV ")} IV &nbsp; ${N(" V ")} V &nbsp; ${N(" E ")} E`)}
</table></td></tr>
<tr><td>${tt}</td></tr></tbody></table>

<!-- ================= HALAMAN 2 ================= -->
<div class="an-page-break"></div>
<div class="an-running">
  <span><strong>LAPORAN ANESTESI (LANJUTAN)</strong> \u2014 ${a(wt)}</span>
  <span>Pasien: <strong>${a(S)}</strong> \u2022 RM: <strong>${a(g)}</strong></span>
  <span><strong>Halaman 2 dari 2</strong></span>
</div>

<table class="rm-grid-table"><tbody>${pt("D. MEDIKASI, CAIRAN &amp; JALAN NAPAS")}
<tr><td><table class="an-kv">
  ${_("Medikasi",a(C))}
  ${_("Pemberian Cairan",a(Q))}
  ${_("Total Asupan Cairan",D==="-"?"-":`${D} ml`)}
  ${_("Total Keluaran Cairan",`Perdarahan ${f} ml \u2022 Diuresis ${R} ml`)}
  ${_("Pengelolaan Napas",a(z))}
</table></td></tr></tbody></table>

<table class="rm-grid-table"><tbody>${pt("E. PEMANTAUAN RUANG PULIH SADAR")}
<tr><td><table class="an-kv">
  ${_("Kronologi & Tanda Vital RR",a(Zt))}
</table></td></tr>
<tr><td>${Lt}</td></tr></tbody></table>

<table class="rm-grid-table"><tbody><tr><th class="rm-sec-head" colspan="2" style="text-align:left;">F. PENILAIAN KELAYAKAN PINDAH RUANGAN</th></tr>
${It}</tbody></table>

<table class="rm-grid-table"><tbody>${pt("G. INSTRUKSI PASCA ANESTESI")}
<tr><td>${aa}</td></tr></tbody></table>

<footer class="an-tte">${$}</footer>
</section>`}function Ja(i){let M=ut(i,/^Fisioterapi/i),t=Et(i,/^Fisioterapi/i),e=(...r)=>ot(M,...r);return`<section class="rm-page" id="form-fisioterapi">
${V("FISIOTERAPI")}
<div class="rm-form-title">LEMBAR ASSESMEN &amp; TERAPI FISIOTERAPI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"))}
    ${o("Tgl. Lahir",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal",e(/^Tanggal/i))}
    ${o("Diagnosa",e(/^Diagnosa/i))}
    ${o("Ruang / Asal",e(/^Ruang|^Unit/i))}
    ${o("Terapis",e(/^Terapis|^Fisioterapis/i))}
  </table></div>
</div>
${Nt([["KELUHAN UTAMA (SUBJEKTIF)",e(/^Keluhan|^Subjektif/i)],["PEMERIKSAAN OBJEKTIF (ROM / MMT / FUNGSI)",e(/^Objektif|^Pemeriksaan/i)],["ASSESMEN FISIOTERAPI",e(/^Assesmen|^Diagnosa Fisio/i)],["RENCANA TERAPI &amp; TUJUAN",e(/^Rencana|^Terapi|^Tujuan/i)]])}
<div class="sub-heading-rm">PELAKSANAAN TERAPI</div>
${bt(["TANGGAL","MODALITAS / LATIHAN","FREKUENSI","RESPON PASIEN"],t,!0)}
${gt(["Pasien / Keluarga Pasien",`( ${a(s("nama"))} )`],["Kota Jambi, "+a(e(/^Tanggal/i)),"Terapis / Fisioterapis",`( ${a(e(/^Terapis|^Fisioterapis/i))} )`])}
</section>`}function Ha(i){let M=ut(i,/^Pengkajian Hemodialisa/i),t=Et(i,/^Pengkajian Hemodialisa/i),e=(...r)=>ot(M,...r);return`<section class="rm-page" id="form-hemodialisa">
${V("HEMODIALISA")}
<div class="rm-form-title">LEMBAR PENGKAJIAN &amp; SESI HEMODIALISA</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"))}
    ${o("Tgl. Lahir",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Sesi",e(/^Tanggal/i))}
    ${o("Akses Vaskular",e(/^Akses/i))}
    ${o("Diagnosa",e(/^Diagnosa/i))}
    ${o("Perawat / Dokter",e(/^Perawat|^Dokter/i))}
  </table></div>
</div>
${bt(["PARAMETER","SEBELUM DIALISA","SESUDAH DIALISA","KETERANGAN"],[["Berat Badan",e(/^BB Sebelum|^Berat Sebelum/),e(/^BB Sesudah|^Berat Sesudah/),"-"],["Tekanan Darah",e(/^TD Sebelum|^Tekanan Sebelum/),e(/^TD Sesudah|^Tekanan Sesudah/),"-"],["Nadi",e(/^Nadi Sebelum/),e(/^Nadi Sesudah/),"-"],...t],!0)}
${Nt([["BLOOD FLOW / DIALYSATE FLOW",e(/^Blood Flow|^Dialysate/i)],["ULTRAFILTRASI &amp; Heparinisasi",e(/^Ultrafiltrasi|^UF|^Heparin/i)],["ADEKUASI (Kt/V)",e(/^Kt\/V|^Adekuasi/i)],["KOMPLIKASI / CATATAN",e(/^Komplikasi|^Catatan/i)]])}
${gt(["Pasien / Keluarga Pasien",`( ${a(s("nama"))} )`],["Kota Jambi, "+a(e(/^Tanggal/i)),"Perawat Hemodialisa",`( ${a(e(/^Perawat/i))} )`])}
</section>`}function Wa(i){let M=i.find(x=>/^Operasi/i.test(x.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=ut(i,/^Operasi/i),r=(...x)=>ot(e,...x),u=x=>St(x).replace(/\bantispetik\b/gi,"antiseptik").replace(/\bincisi\b/gi,"insisi").replace(/\bfacia\b/gi,"fasia").replace(/\bdaryantul\b/gi,"daryantulle").replace(/\bPendarahan\b/g,"Perdarahan").replace(/\bTranfusi\b/g,"Transfusi").replace(/\bEFEKTIF\b/g,"Elektif").replace(/\s+/g," ").trim(),n=(...x)=>{let b=u(r(...x));return b&&b!=="-"?b:"-"},L=(x,b)=>{for(let A of x){let v=s(A);if(v!=="-")return u(v)}return n(b)},l=(()=>{if(!t)return[];let b=Array.from(t.querySelectorAll("td")).find(A=>/^\s*Uraian Pembedahan\b/i.test(A.textContent||""))?.parentElement?.nextElementSibling?.querySelector("td")?.textContent||"";return b.trim()||(b=Array.from(t.querySelectorAll("td")).map(A=>(A.textContent||"").trim()).sort((A,v)=>v.length-A.length)[0]||""),b.split(/\n+/).map(A=>u(A)).filter(Boolean)})(),d=t?Array.from(t.querySelectorAll("td")).map(x=>(x.textContent||"").replace(/\s+/g," ").trim()).filter(x=>/^-?\s*(MAYOR|MINOR|EFEKTIF|ELEKTIF|EMERGENSI|CITO|SEDANG|KHUSUS)$/i.test(x)).join(" "):"",N=x=>x.test(d)?"&#10003;":"&nbsp;",c=n(/^Komplikasi/i),S=c==="-"?'<span class="chk-box">&#10003;</span> Tidak ada komplikasi &nbsp;&nbsp; <span class="chk-box">&nbsp;</span> Ada, sebutkan: ..............................':'<span class="chk-box">&nbsp;</span> Tidak ada komplikasi &nbsp;&nbsp; <span class="chk-box">&#10003;</span> Ada: <strong>'+a(c)+"</strong>",g=n(/^Penggunaan Implan/i),w=/^Ya/i.test(g)?`<span class="chk-box">&nbsp;</span> Tidak &nbsp; <span class="chk-box">&#10003;</span> Ya \u2014 Jenis: ${a(n(/^Jenis Implan/i))} | No. Seri: ${a(n(/^Nomor Implan/i))}`:'<span class="chk-box">&#10003;</span> Tidak &nbsp; <span class="chk-box">&nbsp;</span> Ya',I=n(/^Tanggal Bedah/i),y=L(["dokter_operator","operator"],/^Dokter Operator|^Operator/i),k=et(i,/^Operasi/i)[0]??"",K=s("jenis_kelamin","jk")||n(/^Jenis Kelamin/i),G=/perempuan|^p$/i.test(K)?"Perempuan (P)":/laki|^l$/i.test(K)?"Laki-laki (L)":K,Y=I!=="-"?zt(I):"-",E=(x,b,A="")=>`<tr><td class="k${A}">${x}</td><td class="c">:</td><td class="v">${b}</td></tr>`,P=(x,b=2)=>`<tr><th class="rm-sec-head" colspan="${b}" style="text-align:left;">${x}</th></tr>`,U=l.length?'<ol class="op-steps">'+l.map(x=>`<li>${a(x)}</li>`).join("")+"</ol>":"<div>-</div>";return`<section class="rm-page" id="form-operasi">
${V("RM. 20")}
<div class="rm-form-title">LAPORAN PELAKSANAAN OPERASI</div>

<div class="id-box-borderless">
  <div class="id-col"><table class="op-kv">
    ${E("Nama Pasien",`<strong>${a(L(["nama"],/^Nama Pasien|^Nama$/i))}</strong>`)}
    ${E("Tanggal Lahir / Umur",`${a(L(["tgl_lahir","tglLahir"],/^Tanggal Lahir|^Tgl Lahir/i))} (${a(s("umur")||n(/^Umur/i))})`)}
  </table></div>
  <div class="id-col"><table class="op-kv">
    ${E("No. Rekam Medis",`<strong>${a(L(["norm","rekam_medis"],/^No\.? RM/i))}</strong>`)}
    ${E("Jenis Kelamin",a(G))}
  </table></div>
</div>

<table class="rm-grid-table"><tbody>
  ${P("I. TIM OPERASI &amp; WAKTU PEMBEDAHAN")}
  <tr>
    <td style="width:54%;">
      <table class="op-kv">
        ${E("Dokter Operator",`<strong>${a(y)}</strong>`)}
        ${E("Asisten / Dr. Anestesi",a(n(/^Asisten/i)))}
        ${E("Perawat Instrumen",a(n(/^Perawat Instrumen/i)))}
      </table>
    </td>
    <td>
      <table class="op-kv">
        ${E("Tanggal Bedah",`<strong>${a(I)}</strong>`)}
        ${E("Jam Mulai \u2013 Selesai",`${a(n(/^Jam Mulai/i))} \u2013 ${a(n(/^Jam Selesai/i))}`)}
        ${E("Lama Waktu Bedah",`<strong>${a(n(/^Waktu Bedah/i))}</strong>`)}
      </table>
    </td>
  </tr>
</tbody></table>

<table class="rm-grid-table"><tbody>
  ${P("II. DIAGNOSIS, KLASIFIKASI &amp; TINDAKAN / ICD-9-CM")}
  <tr>
    <td style="width:54%;">
      <table class="op-kv">
        ${E("Diagnosis Pra Bedah",a(n(/^Diagnosis Pra Bedah|^Diagnosa Pra/i)))}
        ${E("Diagnosis Pasca Bedah",`<strong>${a(n(/^Diagnosis Pasca Bedah|^Diagnosa Pasca/i))}</strong>`)}
        ${E("Nama / Macam Operasi",`<strong>${a(n(/^Nama Macam Operasi|^Tindakan|^Prosedur/i))}</strong>`)}
      </table>
    </td>
    <td>
      <table class="op-kv">
        <tr><td class="k">Kategori Operasi</td><td class="c">:</td><td class="v"><span class="chk-box">${N(/MAYOR/i)}</span> Mayor &nbsp; <span class="chk-box">${N(/SEDANG|MINOR/i)}</span> Sedang &nbsp; <span class="chk-box">${N(/KHUSUS/i)}</span> Khusus</td></tr>
        <tr><td class="k">Sifat Operasi</td><td class="c">:</td><td class="v"><span class="chk-box">${N(/ELEKTIF|EFEKTIF/i)}</span> Elektif &nbsp; <span class="chk-box">${N(/CITO|EMERGENSI/i)}</span> Cito / Emergensi</td></tr>
        ${E("Jaringan Dieksisi",a(n(/^Jaringan yang Dieksisi|^Jaringan Dieksisi/i)))}
        <tr><td class="k">Penggunaan Implan</td><td class="c">:</td><td class="v">${w}</td></tr>
      </table>
    </td>
  </tr>
</tbody></table>

<table class="rm-grid-table"><tbody>
  ${P("III. URAIAN PEMBEDAHAN")}
  <tr><td class="op-narrative">
    <div><strong>Langkah-Langkah Tindakan:</strong></div>
    ${U}
  </td></tr>
  <tr><td><strong>IV. Komplikasi Intraoperatif:</strong> &nbsp; ${S}</td></tr>
</tbody></table>

<table class="rm-grid-table"><tbody>
  <tr>
    <th class="rm-sec-head" style="width:50%;text-align:left;">V. PEMERIKSAAN PATOLOGI ANATOMI (PA)</th>
    <th class="rm-sec-head" style="text-align:left;">VI. PERDARAHAN, TRANSFUSI &amp; DRAINASE</th>
  </tr>
  <tr>
    <td><table class="op-kv">
      ${E("Jaringan ke PA",`<strong>${a(n(/^Jaringan ke Patologi/i))}</strong>`)}
      ${E("Dikirim Untuk",a(n(/^Dikirim Untuk/i)))}
      ${E("Jenis Jaringan",a(n(/^Jenis Jaringan/i)))}
      ${E("Tanggal Pengiriman",a(n(/^Tanggal Jaringan/i)))}
    </table></td>
    <td><table class="op-kv">
      ${E("Perkiraan Perdarahan",`<strong>${a(n(/^Perkiraan Pendarahan|^Perkiraan Perdarahan/i))}</strong>`)}
      ${E("Transfusi Darah",a(n(/^Tranfusi Darah|^Transfusi Darah/i)))}
      ${E("Pemakaian Drain",a(n(/^Pemakaian Drain/i)))}
    </table></td>
  </tr>
</tbody></table>

<div class="rm-signature-block" style="justify-content:flex-end;">
  <div class="rm-sig-box">
    <div>Jambi, ${a(Y)}</div>
    <div>Dokter Operator,</div>
    ${k?`<img class="rm-sig-qr" src="${a(k)}" alt="QR TTE dokter operator" width="80" height="80" />`:'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(y)} )</div>
  </div>
</div>
</section>`}function _a(i){let M=i.find(r=>/^Laboratorium/i.test(r.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=t?Array.from(t.querySelectorAll("img")).map(r=>r.outerHTML).filter(r=>!/logo/i.test(r)):[];return`<section class="rm-page" id="rm-09">
${V("RM. 09")}
<div class="rm-form-title">HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK</div>
<div class="passthrough-separator"><span>LAMPIRAN HASIL LABORATORIUM (LIS)</span><span>FILE UPLOAD</span></div>
<div class="raw-upload-frame">
  ${e.length?e.join("<br/>"):"-"}
</div>
</section>`}function qa(i){let M=ut(i,/^Surat Kematian/i),t=(...e)=>ot(M,...e);return`<section class="rm-page" id="form-kematian">
${V("KEMATIAN")}
<div class="rm-form-title">SURAT KETERANGAN KEMATIAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"))}
    ${o("Tgl. Lahir / Umur",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
    ${o("Alamat",ct(i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Kematian",t(/^Tanggal Kematian|^Tanggal/i))}
    ${o("Jam Kematian",t(/^Jam/i))}
    ${o("Tempat Kematian",t(/^Tempat/i))}
    ${o("Ruang / Kelas",[s("jenis"),s("kelas","ruang")].filter(e=>e!=="-").join(" / ")||"-")}
  </table></div>
</div>
${Nt([["PENYEBAB KEMATIAN LANGSUNG (I)",t(/^Penyebab Langsung|^Penyebab I/i)],["PENYEBAB ANTARA (II)",t(/^Penyebab Antara|^Penyebab II/i)],["PENYAKIT / KONDISI LAIN",t(/^Penyakit Lain|^Kondisi Lain/i)],["KETERANGAN",t(/^Keterangan|^Catatan/i)]])}
${gt(["Keluarga Pasien",`( ${a(s("nama"))} )`],["Kota Jambi, "+a(t(/^Tanggal Kematian|^Tanggal/i)),"Dokter yang Menyatakan Meninggal",`( ${a(s("dokter","dpjp"))} )`])}
</section>`}function Va(i){let M=i.find(g=>/^Permintaan Terapi/i.test(g.title)),t=M?new DOMParser().parseFromString(M.html,"text/html"):null,e=ut(i,/^Permintaan Terapi/i),r=(...g)=>ot(e,...g),u=g=>{if(!t)return"-";for(let w of Array.from(t.querySelectorAll("tr"))){let I=Array.from(w.cells).map(y=>jt(y));if(I.length>=2&&g.test(I[0])&&I[1])return I[1]}return"-"},n=u(/^No\.?\s*RM/i),L=u(/^Nama Pasien/i),l=u(/^Diagnosa/i)!=="-"?u(/^Diagnosa/i):s("diagnosa"),d=t?Array.from(t.querySelectorAll("td")).find(g=>/Permintaan\s+Terapi\s*:/i.test(g.textContent||""))?.innerHTML.split(/<hr\s*\/?>|\n|<br\s*\/?>/i).map(g=>St(g.replace(/<[^>]+>/g,"")).replace(/\s+/g," ").trim()).filter(g=>g&&!/Permintaan\s+Terapi/i.test(g))??[]:[],N=Array.from(t?.querySelectorAll("table")||[]).find(g=>{let w=(g.rows[0]?.textContent||"").replace(/\s+/g," ");return/PROGRAM/i.test(w)&&/TANGGAL/i.test(w)&&/TTD/i.test(w)}),c=N?Array.from(N.rows).slice(1).map(g=>Array.from(g.cells).map(w=>jt(w))).filter(g=>g[0]||g[1]||g[3]||g[4]):[],S=c.length?c.map((g,w)=>`<tr><td class="center">${w+1}</td><td>${a(g[1]||"-")}</td><td>${J(g[0]||"-")}</td><td>${a(g[3]||"-")}</td><td>${a(g[4]||"-")}</td><td class="center"><input type="checkbox" class="rm-checkbox"></td></tr>`).join(""):'<tr><td colspan="6">-</td></tr>';return`<section class="rm-page" id="form-terapi">
${V("TERAPI")}
<div class="rm-form-title">PERMINTAAN TERAPI REHABILITASI MEDIK</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",L!=="-"?L:s("nama"),!0)}
    ${o("No. RM",n!=="-"?n:s("norm","rekam_medis"))}
    ${o("Tgl. Lahir",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Permintaan",c[0]?.[1]||r(/^Tanggal/i))}
    ${o("Ruangan / Unit Asal",s("jenis","kelas","ruang"))}
    ${o("Dokter Pengirim",c[0]?.[3]||"-")}
    ${o("Diagnosa",l)}
  </table></div>
</div>
${Nt([["PERMINTAAN TERAPI",d.length?d.map(g=>`&bull; ${a(g)}`).join("<br/>"):"-"]])}
<div class="sub-heading-rm">RINCIAN PERMINTAAN</div>
<table class="rm-grid-table"><thead><tr>
  <th>NO</th><th>TANGGAL</th><th>PROGRAM / MODALITAS</th><th>DOKTER</th><th>TERAPIS</th><th>VER (&#10003;)</th>
</tr></thead><tbody>${S}</tbody></table>
${gt(["Pasien / Keluarga Pasien",`( ${a(L!=="-"?L:s("nama"))} )`],["Kota Jambi, "+a(c[0]?.[1]||"-"),"Dokter Pengirim",`( ${a(c[0]?.[3]||"-")} )`])}
</section>`}function Xa(i){let M=ut(i,/^Uji Fungsi/i),t=(...S)=>ot(M,...S),e=i.find(S=>/^Uji Fungsi/i.test(S.title)),n=(e?new DOMParser().parseFromString(e.html,"text/html"):null)?.querySelector('input[name="suspec_penyakit"]:checked')?.value==="Ya"?'<span class="chk-box">&#10003;</span> Ya &nbsp; <span class="chk-box">&nbsp;</span> Tidak':'<span class="chk-box">&nbsp;</span> Ya &nbsp; <span class="chk-box">&#10003;</span> Tidak',L=t(/^Tanggal Lahir\/Umur/i).split(/\s*\/\s*/),l=t(/^Tanggal Pelayanan/i).split(/\s+/),d=(S,g)=>`<tr><td style="width:175px;"><strong>${S}</strong></td><td>${J(g)}</td></tr>`,N=S=>`<tr><th class="rm-sec-head" colspan="2" style="text-align:left;">${S}</th></tr>`,c=S=>`<table class="rm-grid-table"><tbody>${S}</tbody></table>`;return`<section class="rm-page" id="form-uji-fungsi">
${V("UJI FUNGSI")}
<div class="rm-form-title">LEMBAR PEMERIKSAAN REHABILITASI MEDIK</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama")!=="-"?s("nama"):t(/^Nama Pasien/i),!0)}
    ${o("No. RM",s("norm","rekam_medis")!=="-"?s("norm","rekam_medis"):t(/^No\.?Rm/i))}
    ${o("Tgl. Lahir / Umur",`${L[0]??"-"} (${L[1]??"-"})`)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Pelayanan",`${l[0]??"-"} ${l[1]??""}`.trim())}
    ${o("Jenis Kunjungan",s("jenis","kelas","ruang"))}
    ${o("No. SEP",s("sep","no_sep"))}
  </table></div>
</div>
${c(N("I. IDENTITAS PESERTA")+d("Alamat",t(/^Alamat/i))+d("Telp / HP",t(/^Telp/i))+d("Hubungan dengan Tertanggung",t(/^Hubungan/i)))}
${c(N("II. PEMERIKSAAN &amp; UJI FUNGSI")+d("ANAMNESA",t(/^Anamnesa/i))+d("PEMERIKSAAN FISIK &amp; UJI FUNGSI",t(/^Pemeriksaan Fisik/i))+d("DIAGNOSA MEDIS (ICD-10)",t(/^Diagnosa Medis/i))+d("DIAGNOSA FUNGSI (ICD-10)",t(/^Diagnosa Fungsi/i))+d("TATA LAKSANA KFR (ICD-9)",t(/^Tata Laksana/i))+d("EDUKASI",t(/^Edukasi/i))+d("ANJURAN",t(/^Anjuran/i))+d("EVALUASI",t(/^Evaluasi/i))+d("SUSPEK PENYAKIT AKIBAT KERJA",n))}
${gt(["Pasien / Keluarga Pasien",`( ${a(s("nama")!=="-"?s("nama"):t(/^Nama Pasien/i))} )`],["Kota Jambi, "+a(l[0]??"-"),"Dokter Sp.KFR","( .................................................. )"])}
</section>`}function Za(i){let M=ut(i,/^Partograf/i),t=Et(i,/^Partograf/i),e=(...r)=>ot(M,...r);return`<section class="rm-page" id="form-partograf">
${V("PARTOGRAF")}
<div class="rm-form-title">PARTOGRAF \u2014 PEMANTAUAN KEMAJUAN PERSALINAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"))}
    ${o("Umur",e(/^Umur/i))}
    ${o("Grafida / Paritas",e(/^Grafida|^Paritas|^G/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("HPHT",e(/^HPHT/i))}
    ${o("Taksiran Persalinan",e(/^Taksiran|^TP/i))}
    ${o("Tanggal Persalinan",e(/^Tanggal/i))}
    ${o("Petugas",e(/^Petugas|^Bidan/i))}
  </table></div>
</div>
<div class="sub-heading-rm">KEMAJUAN PERSALINAN &amp; OBSERVASI</div>
${bt(["JAM","PEMBUKAAN","TURUN","KONTRAKSI","DJJ","TD / NADI","SUHU","URINE","CATATAN"],t,!0)}
${Nt([["KEADAAN IBU &amp; JANIN",e(/^Keadaan|^Kondisi/i)],["TINDAKAN / PENYIMPANGAN",e(/^Tindakan|^Penyimpangan/i)],["CATATAN",e(/^Catatan/i)]])}
${gt(["Keluarga Pasien",`( ${a(s("nama"))} )`],["Kota Jambi, "+a(e(/^Tanggal/i)),"Bidan / Petugas Persalinan",`( ${a(e(/^Petugas|^Bidan/i))} )`])}
</section>`}function ti(i){let M=ut(i,/^Laporan Tindakan/i),t=Et(i,/^Laporan Tindakan/i),e=(...r)=>ot(M,...r);return`<section class="rm-page" id="form-laporan-tindakan">
${V("LAPORAN TINDAKAN")}
<div class="rm-form-title">LAPORAN PELAKSANAAN TINDAKAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"))}
    ${o("Tgl. Lahir",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Tindakan",e(/^Tanggal/i))}
    ${o("Jenis Tindakan",e(/^Jenis Tindakan|^Tindakan/i))}
    ${o("Ruang / Unit",e(/^Ruang|^Unit/i))}
    ${o("Pelaksana",e(/^Pelaksana|^Petugas|^Dokter/i))}
  </table></div>
</div>
${Nt([["INDIKASI / DIAGNOSA",e(/^Indikasi|^Diagnosa/i)],["URAIAN TINDAKAN",e(/^Uraian|^Prosedur/i)],["HASIL TINDAKAN",e(/^Hasil/i)],["KOMPLIKASI / CATATAN",e(/^Komplikasi|^Catatan/i)]])}
<div class="sub-heading-rm">RINCIAN TINDAKAN</div>
${bt(["NO","TINDAKAN","WAKTU / JAM","PELAKSANA"],t,!0)}
${gt(["Pasien / Keluarga Pasien",`( ${a(s("nama"))} )`],["Kota Jambi, "+a(e(/^Tanggal/i)),"Pelaksana Tindakan",`( ${a(e(/^Pelaksana|^Petugas|^Dokter/i))} )`])}
</section>`}var Ft=i=>i?Array.from(i.rows).map(M=>Array.from(M.cells).map(jt)):[],Gt=i=>[i.match(/(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1]??"-",i.match(/Pukul\s*([\d:]+)/i)?.[1]??"-"],Jt=i=>i.match(/dr\.[^\n]+/i)?.[0]?.trim()??"-";function ai(i){let M=Array.from(i.querySelectorAll("table")),t=M[0]??null,e=M.find(y=>/Jawaban Konsultasi/i.test(y.textContent||""))??null,r=Ft(t),u=Ft(e),n=r[0]??[],L=r[1]?.[0]||"",l=r.findIndex(y=>/^Penemuan Klinis/i.test(y[0]||"")),[d,N]=Gt(n[1]||""),[c,S]=Gt(u[1]?.[1]||""),g={};for(let y of u.slice(2))for(let k of y){let K=k.match(/^(Subjektif|Objektif|Assesmen|Planning|Instruksi)\s*:\s*([\s\S]*)$/i);K&&(g[K[1].toLowerCase()]=K[2].trim()||"-")}let w=(n[0]||"").replace(/^\s*Konsul Ke\s*:\s*/i,"").replace(/\s+/g," ").trim(),I=Jt(u[u.length-1]?.[1]||"");return{konsulen:I!=="-"?I:w||"-",pengirim:Jt(r[r.length-1]?.[1]||""),tanggal:d,jam:N,jenis:L.match(/Mohon\s+Konsultasi\s+([^\s:]+)/i)?.[1]??"-",permintaan:L||"-",penemuan:(l>=0?r[l+1]?.[0]:"")||"-",dugaan:r.flat().find(y=>/^Dugaan\s*:/i.test(y))?.replace(/^Dugaan\s*:\s*/i,"").trim()||"-",subjektif:g.subjektif||"-",objektif:g.objektif||"-",asesmen:g.asesmen||"-",planning:g.planning||"-",instruksi:g.instruksi||"-",keputusan:u.flat().find(y=>/Konsultasi selesai tanggal/i.test(y))||"-",tglJawaban:c,jamJawaban:S,tglLahir:"-"}}function ii(i,M,t="rm-10"){let e=M??i.find(L=>/Konsul/i.test(L.title));if(!e)return"";let r=new DOMParser().parseFromString(e.html,"text/html"),u=Array.from(r.querySelectorAll("b")).filter(L=>/^\s*Konsul Ke\s*:/i.test(L.textContent||"")).map(L=>L.closest("table")?.parentElement).filter(L=>!!L),n=Array.from(r.querySelectorAll("tr")).map(L=>Array.from(L.cells).map(jt)).flatMap(L=>L.slice(0,-1).map((l,d)=>[l,L[d+1]])).find(([L])=>/^Tanggal Lahir$/i.test(L))?.[1]?.match(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/)?.[0]??"-";return u.map((L,l)=>{let d=ai(L);return d.tglLahir=n,ei(d,l?`${t}-${l+1}`:t)}).join("")}function ei(i,M){let t=i.konsulen!=="-"?i.konsulen:s("dokter_konsulen")!=="-"?s("dokter_konsulen"):"-",e=S=>St(S).replace(/\bPenilain\b/gi,"Penilaian").replace(/\bdijadwalkn\b/gi,"dijadwalkan").replace(/\bbtk\b/gi,"terima kasih").replace(/Terimakasih/gi,"Terima kasih").replace(/\s+/g," ").trim(),r=Array.from(e(i.permintaan).matchAll(/(?:^|\s)[1-3]\.\s*([^]*?)(?=\s[1-3]\.\s|$)/g)).map(S=>S[1].trim()).filter(Boolean),u=r.length?r.map(S=>`<div><span class="chk-box">&nbsp;</span> ${a(S)}</div>`).join(""):"-",n=/^0?0:00:00$/.test(i.jamJawaban)?"":i.jamJawaban,L=`${i.tglJawaban} ${n}`.trim(),l=i.dugaan!=="-"?i.dugaan:i.penemuan,d=[["S (SUBJEKTIF)",i.subjektif],["O (OBJEKTIF)",i.objektif],["A (ASSESMEN)",i.asesmen],["P (PLANNING)",i.planning],["INSTRUKSI",i.instruksi],["KEPUTUSAN KONSULTASI",i.keputusan]],N=S=>`<tr><th class="rm-sec-head" colspan="2" style="text-align:left;">${S}</th></tr>`,c=S=>`<table class="rm-grid-table"><tbody>${S}</tbody></table>`;return`<section class="rm-page" id="${a(M)}">
${V("RM. 10")}
<div class="rm-form-title">LEMBAR KONSULTASI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("No. Rekam Medis",s("norm","rekam_medis"),!0)}
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("Tanggal Lahir",i.tglLahir)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Jenis Kunjungan",[s("jenis"),s("kelas","ruang")].filter(S=>S!=="-").join(" / ")||"-")}
    ${o("Tanggal Permintaan",`${i.tanggal} ${i.jam}`.trim())}
    ${o("Tanggal Jawaban",L)}
  </table></div>
</div>
${c(N("BAGIAN I \u2014 PERMINTAAN KONSULTASI (DOKTER PEMOHON)")+`<tr><td style="width:175px;"><strong>Kepada Yth. Konsulen</strong></td><td>${a(t)}</td></tr><tr><td><strong>Jenis Permohonan</strong></td><td>${a(i.jenis)}</td></tr><tr><td><strong>Tujuan Konsultasi</strong></td><td>${u}</td></tr><tr><td><strong>Penemuan Klinis Terpenting</strong></td><td>${J(e(i.penemuan))}</td></tr><tr><td><strong>Dugaan Diagnosa</strong></td><td><strong>${a(e(l))}</strong></td></tr>`)}
${c(N("BAGIAN II \u2014 JAWABAN KONSULTASI (DOKTER KONSULEN)")+d.map(([S,g])=>`<tr><td style="width:175px;"><strong>${S}</strong></td><td>${J(e(g))}</td></tr>`).join(""))}
</section>`}function si(i){let M=ut(i,/^Bon Makan/i),t=(...n)=>ot(M,...n),e=et(i,/^Bon Makan/i)[0]??"",r=xt(e),u=t(/^TANGGAL/i);return`<section class="rm-page" id="form-bon-makan">
${V("BON MAKANAN")}
<div class="rm-form-title">BON MAKANAN</div>
<div class="an-tte-note">Harap diberikan untuk penderita :</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("NAMA",t(/^NAMA$/i),!0)}
    ${o("NO RM",t(/^NO RM$/i))}
    ${o("NO REGISTRASI",t(/^NO REGISTRASI/i))}
    ${o("KELAS",t(/^KELAS$/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("RUANG",t(/^RUANG$/i))}
    ${o("TANGGAL",u)}
    ${o("JAM",t(/^JAM$/i))}
    ${o("DIET",t(/^DIET$/i))}
  </table></div>
</div>
<div class="rm-signature-block" style="justify-content:flex-end;">
  <div class="rm-sig-box">
    <div>Kota Jambi, ${a(u)}</div>
    <div>Dokter Jaga</div>
    ${e?`<img class="rm-sig-qr" src="${a(e)}" alt="QR dokter jaga" width="80" height="80" />`:'<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${a(r)} )</div>
  </div>
</div>
</section>`}function ni(i){let M=ut(i,/^PEMERIKSAAN$/i),t=Et(i,/^PEMERIKSAAN$/i),e=(...r)=>ot(M,...r);return`<section class="rm-page" id="form-pemeriksaan">
${V("PEMERIKSAAN")}
<div class="rm-form-title">HASIL PEMERIKSAAN / DIAGNOSTIK</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${o("Nama Pasien",s("nama"),!0)}
    ${o("No. Rekam Medis",s("norm","rekam_medis"))}
    ${o("Tgl. Lahir",s("tgl_lahir","tglLahir"))}
    ${o("Jenis Kelamin",s("jenis_kelamin","jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${o("Tanggal Pemeriksaan",e(/^Tanggal/i))}
    ${o("Jenis Pemeriksaan",e(/^Jenis Pemeriksaan|^Pemeriksaan/i))}
    ${o("Spesimen / Bahan",e(/^Spesimen|^Bahan/i))}
    ${o("Dokter Pengirim",e(/^Dokter Pengirim/i))}
  </table></div>
</div>
${bt(["PARAMETER","HASIL","SATUAN","NILAI RUJUKAN"],t,!0)}
${Nt([["MAKROSKOPIK / TEMUAN",e(/^Makroskopik|^Temuan/i)],["MIKROSKOPIK",e(/^Mikroskopik/i)],["KESIMPULAN / DIAGNOSA",e(/^Kesimpulan|^Diagnosa/i)],["CATATAN",e(/^Catatan/i)]])}
${gt(["Petugas / Analis",`( ${a(e(/^Petugas|^Analis/i))} )`],["Kota Jambi, "+a(e(/^Tanggal/i)),"Dokter Penanggung Jawab",`( ${a(e(/^Dokter Penanggung Jawab|^Dokter/i))} )`])}
</section>`}function ri(i,M){let t=wa(i,M),e=s("no_sep","sep"),r=s("kartu","no_kartu","noka"),u=s("norm","rekam_medis"),n=s("nama"),L=[s("jenis"),s("kelas","ruang")].filter(A=>A!=="-").join(" / ")||"-",l=s("dokter","dpjp"),d=s("tanggalAwal","tgl_masuk","tgl"),N=s("tanggalAkhir","keluar","tgl_keluar"),c=s("tgl_lahir","tglLahir"),S=s("jenis_kelamin","jk"),g=ct(i),w=i.filter(A=>/resep/i.test(A.title)).length,I=qt,y=new Date,k=`${y.getDate()} ${I[y.getMonth()]} ${y.getFullYear()}`,K=`<table class="rm-grid-table">
  <thead>
    <tr><th colspan="3">CATATAN KETIDAKSESUAIAN DATA LINTAS DOKUMEN (HASIL UJI SILANG OTOMATIS)</th></tr>
    <tr><th style="width: 32px;">NO</th><th style="width: 170px;">JENIS KETIDAKSESUAIAN</th><th>URAIAN TEMUAN VERIFIKASI</th></tr>
  </thead>
  <tbody>${t.map((A,v)=>`<tr><td class="center">${v+1}</td><td><strong>${a(A.title)}</strong></td><td>${a(A.detail)}</td></tr>`).join("")}</tbody>
</table>`,G=`<section class="rm-page" id="rm-00">
${V("RM. 00")}
<div class="rm-form-title">LEMBAR KENDALI KELENGKAPAN &amp; VERIFIKASI BERKAS KLAIM JKN</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    <tr><td class="lbl">NAMA PASIEN</td><td class="col">:</td><td class="val"><strong>${a(n)}</strong></td></tr>
    <tr><td class="lbl">NO. REKAM MEDIS</td><td class="col">:</td><td class="val"><strong>${a(u)}</strong></td></tr>
    <tr><td class="lbl">TGL. LAHIR / UMUR</td><td class="col">:</td><td class="val">${a(c)}</td></tr>
    <tr><td class="lbl">JENIS KELAMIN</td><td class="col">:</td><td class="val">${a(S)}</td></tr>
    <tr><td class="lbl">ALAMAT</td><td class="col">:</td><td class="val">${a(g)}</td></tr>
  </table></div>
  <div class="id-col"><table class="id-table">
    <tr><td class="lbl">NO. KARTU BPJS</td><td class="col">:</td><td class="val"><strong>${a(r)}</strong></td></tr>
    <tr><td class="lbl">NO. SEP</td><td class="col">:</td><td class="val"><strong>${a(e)}</strong></td></tr>
    <tr><td class="lbl">TGL. MASUK / KELUAR</td><td class="col">:</td><td class="val">${a([d,N].filter(A=>A&&A!=="-").join(" s/d ")||"-")}</td></tr>
    <tr><td class="lbl">RUANG / KELAS</td><td class="col">:</td><td class="val">${a(L)}</td></tr>
    <tr><td class="lbl">DPJP UTAMA</td><td class="col">:</td><td class="val">${a(l)}</td></tr>
  </table></div>
</div>

<table class="rm-grid-table">
  <thead>
    <tr>
      <th style="width: 110px;">KODE INA-CBG</th>
      <th>DESKRIPSI GROUPING INA-CBG</th>
      <th class="num" style="width: 120px;">TARIF INA-CBG</th>
      <th class="num" style="width: 120px;">TARIF RIIL RS</th>
      <th class="num" style="width: 115px;">SELISIH</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center"><strong>${a(mt("ina_cbg_code")||"-")}</strong></td>
      <td>${a(mt("ina_cbg_desc")||"-")}</td>
      <td class="num"><strong>${a(mt("tarif_ina_cbg")||"-")}</strong></td>
      <td class="num">${a(mt("tarif_riil_rs")||"-")}</td>
      <td class="num">${a(mt("selisih")||"-")}</td>
    </tr>
  </tbody>
</table>

<table class="rm-grid-table">
  <thead>
    <tr>
      <th style="width: 32px;">NO</th>
      <th style="width: 58px;">KODE RM</th>
      <th>JENIS BERKAS / DOKUMEN KLAIM</th>
      <th style="width: 120px;">STATUS BERKAS</th>
      <th style="width: 68px;">TANDA (&#10003;)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="center">1</td><td class="center">RM. 01</td><td>Surat Elegibilitas Peserta (SEP) \u2014 No. ${a(e)}</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 01 SEP"></td></tr>
    <tr><td class="center">2</td><td class="center">RM. 01</td><td>Berkas Klaim Individual Pasien (INA-CBG E-Klaim 5.10.9)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi INA-CBG"></td></tr>
    <tr><td class="center">3</td><td class="center">RM. 02</td><td>Surat Bukti Pelayanan Kesehatan (SBPK) \u2014 ${a(L)}</td><td class="center"><strong>ADA *</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 02 SBPK"></td></tr>
    <tr><td class="center">4</td><td class="center">RM. 03</td><td>Surat Pengantar Rawat Inap (SPRI) \u2014 Tgl. ${a(d||"-")}</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 03 SPRI"></td></tr>
    <tr><td class="center">5</td><td class="center">Seksi 04</td><td>File Upload Dokumen Pasien (Laporan Echo/Doppler &amp; Rekaman EKG)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi Seksi 04 Upload"></td></tr>
    <tr><td class="center">6</td><td class="center">RM. 05</td><td>Rincian Biaya Pelayanan Rawat Inap &amp; Farmasi (${w} Nota Resep)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 05 Billing"></td></tr>
    <tr><td class="center">7</td><td class="center">RM. 06</td><td>Ringkasan Pulang (Discharge Summary) \u2014 DPJP ${a(l)}</td><td class="center"><strong>ADA *</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 06 Resume"></td></tr>
    <tr><td class="center">8</td><td class="center">RM. 07</td><td>Formulir Telaah Resep, Telaah Obat &amp; Edukasi Farmasi (No. 230445)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 07 Telaah"></td></tr>
    <tr><td class="center">9</td><td class="center">RM. 08</td><td>Hasil Pemeriksaan Radiologi \u2014 Thorax AP/PA (No. Rontgen 5918)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 08 Radiologi"></td></tr>
    <tr><td class="center">10</td><td class="center">RM. 09</td><td>Hasil Pemeriksaan Laboratorium Patologi Klinik (Hematologi &amp; Urine)</td><td class="center"><strong>TIDAK LENGKAP *</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 09 Lab"></td></tr>
    <tr><td class="center">11</td><td class="center">RM. 10</td><td>Lembar Konsultasi Antar-Spesialis (dr. M. Ryan Ramadhan, Sp.JP., FIHA)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 10 Konsul"></td></tr>
  </tbody>
</table>

${K}

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Kota Jambi, ${k}</div>
    <div>Petugas Casemix / Klaim JKN RS</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
    <div class="rm-sig-sub">RSUD H. Abdul Manap Kota Jambi</div>
  </div>
  <div class="rm-sig-box">
    <div>Diterima &amp; Diverifikasi Oleh,</div>
    <div>Verifikator BPJS Kesehatan</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
    <div class="rm-sig-sub">NPP. ............................................</div>
  </div>
</div>
</section>`,Y=i,E=new Map,P=Y.map((A,v)=>{let p=xa(A.title,v),h=(E.get(p.id)??0)+1;return E.set(p.id,h),h===1?p:{...p,id:`${p.id}-${h}`,tab:`${p.tab} (${h})`,option:`${p.option} (${h})`}}),U=Y.map((A,v)=>{let p=P[v];return/^SEP$/i.test(A.title)?Ea(i):/^Surat (?:Rencana )?Kontrol/i.test(A.title)?Ta(i):/^SPRI$/i.test(A.title)?ba(i):/^SBPK$/i.test(A.title)?Ia(i):/^Rincian Biaya/i.test(A.title)?ka(i):/^Resume/i.test(A.title)?Ca(i):/^Telaah/i.test(A.title)?za(i):/^Radiologi/i.test(A.title)?Oa(i,A,p.id):/^Triage/i.test(A.title)?Ua(i):/PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(A.title)?Ka(i):/^Laboratorium/i.test(A.title)?_a(i):/Konsul/i.test(A.title)?ii(i,A,p.id):/^Persetujuan Tindakan/i.test(A.title)?Ga(i):/^Anestesi/i.test(A.title)?Vt(i):/^Fisioterapi/i.test(A.title)?Ja(i):/^Pengkajian Hemodialisa/i.test(A.title)?Ha(i):/^Operasi/i.test(A.title)?Wa(i):/^Surat Kematian/i.test(A.title)?qa(i):/^Permintaan Terapi/i.test(A.title)?Va(i):/^Uji Fungsi/i.test(A.title)?Xa(i):/^Partograf/i.test(A.title)?Za(i):/^Laporan Tindakan/i.test(A.title)?ti(i):/^Bon Makan/i.test(A.title)?si(i):/^PEMERIKSAAN$/i.test(A.title)?ni(i):`<section class="rm-page" id="${p.id}">
${V(p.code)}
<div class="rm-form-title">${a(A.title)}</div>
<div class="doc-body">${A.html}</div>
</section>`}).join(""),x=['<button type="button" class="tab-btn active" data-target="all">Semua</button>','<button type="button" class="tab-btn" data-target="rm-00">RM. 00 Kendali</button>',...Y.map((A,v)=>{let p=P[v];return`<button type="button" class="tab-btn" data-target="${p.id}">${p.tab}</button>`})].join(""),b=['<option value="all">Semua Formulir RM</option>','<option value="rm-00">RM. 00 \u2014 Lembar Kendali &amp; Verifikasi</option>',...Y.map((A,v)=>{let p=P[v];return`<option value="${p.id}">${p.option}</option>`})].join("");return`<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="${a(location.origin)}">
<title>Formulir Rekam Medis Baku \u2014 Dossier Klaim BPJS ${a(wt)}</title>
<style>
    /* ==========================================================================
       1. RESET & AUTHENTIC INDONESIAN HOSPITAL RM FORM TOKENS
       Pure Monochrome Black Ink (#000000) on White Paper (#FFFFFF).
       Zero SaaS colors, zero rounded pills/badges, zero drop shadows.
       ========================================================================== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #000000;
      background-color: #E5E5E5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ==========================================================================
       2. SCREEN-ONLY VERIFIER TOOLBAR (.no-print)
       ========================================================================== */
    .verifier-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #FFFFFF;
      border-bottom: 2px solid #000000;
      padding: 8px 16px;
      font-family: Arial, Helvetica, sans-serif;
    }

    .toolbar-row {
      max-width: 210mm;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .toolbar-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .toolbar-label {
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
    }

    .toolbar-select {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      color: #000000;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      padding: 4px 8px;
      cursor: pointer;
    }

    .toolbar-counter {
      font-size: 8.5pt;
      border: 1px solid #000000;
      padding: 3px 8px;
      background-color: #FFFFFF;
    }

    .toolbar-btn {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      color: #000000;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      padding: 4px 10px;
      cursor: pointer;
    }

    .toolbar-btn:hover {
      background-color: #F0F0F0;
    }

    .toolbar-btn-print {
      background-color: #000000;
      color: #FFFFFF;
    }

    .toolbar-btn-print:hover {
      background-color: #222222;
    }

    .toolbar-tabs {
      max-width: 210mm;
      margin: 6px auto 0 auto;
      padding-top: 6px;
      border-top: 1px solid #000000;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tab-btn {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      color: #000000;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      padding: 2px 6px;
      cursor: pointer;
    }

    .tab-btn.active {
      background-color: #000000;
      color: #FFFFFF;
      font-weight: bold;
    }

    /* ==========================================================================
       3. A4 PAPER SHEET CONTAINER (NO DROP SHADOWS)
       ========================================================================== */
    .dossier-wrapper {
      max-width: 210mm;
      margin: 16px auto 40px auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .rm-page {
      width: 100%;
      background-color: #FFFFFF;
      border: 1px solid #888888;
      padding: 12mm 14mm;
    }

    .rm-page.hidden-section {
      display: none;
    }

    /* ==========================================================================
       4. OFFICIAL RSUD H. ABDUL MANAP KOP SURAT (TIMES NEW ROMAN + DOUBLE RULE)
       ========================================================================== */
    .rm-code-top {
      text-align: right;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      margin-bottom: 2px;
      letter-spacing: 0.02em;
    }

    .kop-surat {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 5px;
    }

    .kop-logo {
      width: 52px;
      height: 60px;
      flex-shrink: 0;
    }

    .kop-text {
      flex: 1;
      text-align: center;
      font-family: "Times New Roman", Times, serif;
      color: #000000;
      line-height: 1.2;
    }

    .kop-line-1 {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.03em;
    }

    .kop-line-2 {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.03em;
    }

    .kop-line-3 {
      font-size: 12.5pt;
      font-weight: bold;
      letter-spacing: 0.02em;
      margin-top: 1px;
    }

    .kop-line-4 {
      font-size: 7.5pt;
      font-weight: normal;
      margin-top: 2px;
    }

    .kop-line-5 {
      font-size: 7.5pt;
      font-weight: normal;
    }

    .kop-double-rule {
      border-top: 2px solid #000000;
      height: 2px;
      border-bottom: 0.75px solid #000000;
      margin-bottom: 10px;
    }

    .rm-form-title {
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }

    /* ==========================================================================
       5. PATIENT IDENTITY BLOCKS (PATTERN A: BORDERED BOX / PATTERN B: BORDERLESS)
       Strict vertical colon ':' alignment (label | 10px ':' | value)
       ========================================================================== */
    .id-box-bordered {
      border: 1px solid #000000;
      padding: 6px 10px;
      margin-bottom: 9px;
      display: flex;
      gap: 16px;
    }

    .id-box-borderless {
      padding: 2px 0;
      margin-bottom: 8px;
      display: flex;
      gap: 16px;
    }

    .id-col {
      flex: 1;
      min-width: 0;
    }

    .id-table {
      width: 100%;
      border-collapse: collapse;
    }

    .id-table td {
      padding: 1.5px 0;
      vertical-align: top;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.2pt;
      line-height: 1.3;
    }

    .id-table td.lbl {
      width: 118px;
      white-space: nowrap;
      text-align: left;
    }

    .id-table td.lbl-wide {
      width: 138px;
      white-space: nowrap;
      text-align: left;
    }

    .id-table td.col {
      width: 10px;
      text-align: center;
    }

    .id-table td.val {
      text-align: left;
    }

    /* ==========================================================================
       6. FULL-GRID RM TABLES (border: 1px solid #000 ON ALL TH & TD)
       ========================================================================== */
    .rm-grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.2pt;
    }

    .rm-grid-table th,
    .rm-grid-table td {
      border: 1px solid #000000;
      padding: 4px 6px;
      vertical-align: top;
      color: #000000;
    }

    .rm-grid-table th {
      font-size: 8.5pt;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
      background-color: #FFFFFF;
    }

    .rm-grid-table td.center,
    .rm-grid-table th.center {
      text-align: center;
      vertical-align: middle;
    }

    .rm-grid-table td.num,
    .rm-grid-table th.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .rm-grid-table td.nowrap {
      white-space: nowrap;
    }

    .rm-grid-table tr.section-banner td {
      font-weight: bold;
      font-size: 8.5pt;
      text-transform: uppercase;
      padding: 4px 6px;
    }

    .rm-grid-table tr.sub-group td {
      font-weight: bold;
      text-decoration: underline;
      padding-top: 5px;
      padding-bottom: 4px;
    }

    .rm-grid-table tr.total-row td {
      font-weight: bold;
      padding: 5px 6px;
    }

    /* Square 11px x 11px Interactive Verification Checkbox */
    .rm-checkbox {
      appearance: none;
      -webkit-appearance: none;
      width: 11px;
      height: 11px;
      border: 1px solid #000000;
      border-radius: 0;
      background-color: #FFFFFF;
      display: inline-grid;
      place-content: center;
      vertical-align: middle;
      cursor: pointer;
    }

    .rm-checkbox::before {
      content: "\u2713";
      font-size: 9px;
      font-weight: bold;
      line-height: 1;
      color: #000000;
      transform: scale(0);
    }

    .rm-checkbox:checked::before {
      transform: scale(1);
    }

    /* Static printed checkbox symbol for clinical forms */
    .static-box {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1px solid #000000;
      text-align: center;
      line-height: 9px;
      font-size: 8px;
      font-weight: bold;
      margin-right: 4px;
      vertical-align: middle;
    }

    .sub-heading-rm {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 7px 0 4px 0;
    }

    .footnote-rm {
      font-size: 7.5pt;
      margin-top: 4px;
      line-height: 1.35;
    }

    /* ==========================================================================
       7. ATOMIC SIGNATURE FOOTER (break-inside: avoid)
       ========================================================================== */
    .rm-signature-block {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      break-inside: avoid;
      page-break-inside: avoid;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.2pt;
    }

    .rm-sig-box {
      width: 44%;
      text-align: center;
    }

    .rm-sig-box.left-align {
      text-align: left;
    }

    .rm-sig-space {
      height: 44px;
    }

    .rm-sig-name {
      font-weight: bold;
    }

    .rm-sig-sub {
      font-size: 7.5pt;
    }

    /* ==========================================================================
       8. SECTION 04 \u2014 FILE UPLOAD ORIGINAL PASSTHROUGH (NOT REDESIGNED)
       ========================================================================== */
    .passthrough-separator {
      border-top: 2px solid #000000;
      border-bottom: 1px solid #000000;
      padding: 4px 6px;
      margin-bottom: 10px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .raw-upload-frame {
      border: 1px solid #000000;
      padding: 8px 10px;
      margin-bottom: 12px;
      font-family: "Times New Roman", Times, serif;
      font-size: 8.5pt;
      break-inside: avoid;
    }

    .raw-upload-table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
      font-size: 8pt;
    }

    .raw-upload-table th,
    .raw-upload-table td {
      border: 1px solid #000000;
      padding: 2px 4px;
    }

    /* ==========================================================================
       9. PRINT MEDIA RULES (@media print \u2014 A4 PORTRAIT, 12MM MARGIN)
       ========================================================================== */
    /* Spacer baris kosong dari nl2br \u2014 4px, bukan satu line-box penuh. */
    .nl-gap { display: block; height: 4px; line-height: 0; font-size: 0; }

    @media print {
      @page {
        size: A4 portrait;
        margin: 12mm;
      }

      /* Jarak antar baris seragam & rapat di semua section (audit 4 reviewer):
         turunkan line-height turunan 1.35/1.38/1.45 \u2192 1.2 pada teks tabel. */
      .rm-page,
      .rm-page td,
      .rm-page div,
      .rm-page li,
      .rm-page .rm-note,
      .rm-page .tm-val,
      .rm-page .tm-label,
      .rm-page .med,
      .rm-page .op-kv td,
      .rm-page .an-kv td,
      .rm-page .op-narrative,
      .rm-page .an-instruksi,
      .rm-page .bpjs-sep-sheet,
      .rm-page .footnote-rm {
        line-height: 1.2 !important;
      }
      .nl-gap { height: 3px !important; }

      body {
        background-color: #FFFFFF !important;
        margin: 0;
        padding: 0;
      }

      .no-print,
      .verifier-toolbar,
      .img-tools {
        display: none !important;
      }

      .dossier-wrapper {
        max-width: 100%;
        margin: 0;
        gap: 0;
      }

      .rm-page {
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        break-after: page;
        page-break-after: always;
      }

      .rm-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      .rm-page.hidden-section {
        display: none !important;
      }

      thead {
        display: table-header-group;
      }

      tr,
      .rm-signature-block,
      .id-box-bordered {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }

    @media (max-width: 720px) {
      .rm-page {
        padding: 12px;
      }
      .id-box-bordered,
      .id-box-borderless {
        flex-direction: column;
        gap: 4px;
      }
      .rm-signature-block {
        flex-direction: column;
        gap: 14px;
      }
      .rm-sig-box {
        width: 100%;
      }
    }

/* \u2500\u2500 Tambahan generator: komponen hasil scrape & fokus keyboard \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.kop-logo{object-fit:contain;object-position:center}
/* SEP BPJS \u2014 cetakan VClaim (sheet menggantikan kop RSUD) */
.rm-page.sep-page{padding:0}
.bpjs-sep-sheet{width:210mm;max-width:100%;margin:0 auto;padding:10mm 14mm;background:#fff;color:#000;font:9.5pt/1.38 Arial,Helvetica,sans-serif;box-sizing:border-box;break-inside:avoid;page-break-inside:avoid}
.sep-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;position:relative}
.sep-logo{flex:0 0 215px;width:215px;height:33px;object-fit:contain;object-position:left center}
.sep-title-wrap{flex:0 0 auto;text-align:right;padding-right:0}
.sep-title{font-size:10.5pt;font-weight:400;letter-spacing:.3px;text-transform:uppercase}
.sep-hospital{font-size:10.5pt;text-transform:uppercase}
.sep-columns{display:flex;justify-content:space-between;gap:18px}
.sep-col-left{flex:0 0 56%}
.sep-col-right{flex:0 0 42%;display:flex;flex-direction:column;justify-content:space-between}
.sep-kv-table{width:100%;border-collapse:collapse}
.sep-kv-table td{padding:1.8px 0;vertical-align:top;border:none}
.sep-kv-table td.lbl{width:102px;white-space:nowrap}
.sep-col-right .sep-kv-table td.lbl{width:92px}
.sep-kv-table td.sep{width:12px;text-align:center}
.sep-kv-table td.val{word-break:break-word}
.sep-no-value{font-size:9.5pt;letter-spacing:.2px}
.sep-inline-mr{margin-left:14px;white-space:nowrap}
.sep-multiline-list{margin:0;padding:0;list-style:none}
.sep-disclaimer{margin-top:10px;font-size:7.5pt;font-style:italic}
.sep-print-meta{font-size:9.5pt;font-style:normal}
/* Isi/body SEP seragam 9.5pt \u2014 kecuali disclaimer (7.5pt italic). */
.sep-signatures{display:flex;justify-content:flex-end;gap:16px;margin-top:18px}
.sep-sig-box{flex:0 0 44%;font-size:9.5pt;line-height:1.25;text-align:center}
.sep-sig-role{min-height:24px}
.sep-sig-name{margin-top:2px;font-weight:bold}
.sep-qr{display:block;margin:2px auto;width:100px;height:100px;object-fit:contain}
.rm-sig-qr{display:block;width:80px;height:80px;margin:0 auto 4px;object-fit:contain}
/* @page A4 portrait 12mm ditetapkan sekali di blok print utama \u2014 jangan
   ditimpa di sini supaya margin semua halaman dossier konsisten. */
@media print{body{background:#fff;padding:0}.bpjs-sep-sheet{width:100%;padding:0}}
@media screen{body{background:#e5e7eb;padding:20px}.bpjs-sep-sheet{box-shadow:0 1px 4px rgba(0,0,0,.15)}}
/* Telaah (RM.07) \u2014 grid 2 kolom ala telaahResepPrint.ts */
.t-main{display:grid;grid-template-columns:62% 38%;gap:8px;align-items:start}
.t-left,.t-right{display:flex;flex-direction:column;gap:5px;min-width:0}
.tm-card{padding:2px 0 4px;margin-bottom:4px;border-bottom:.5pt solid #333}
.tm-col{display:flex;flex-direction:column;gap:2px}
.tm-row{display:grid;grid-template-columns:30% 70%;column-gap:4px;align-items:start}
.tm-row.long{display:grid}
.tm-label{font-size:7.5pt;line-height:1.25;color:#333}
.tm-val{font-size:8pt;line-height:1.25;overflow-wrap:anywhere}
.t-meds{font-size:8pt;margin-bottom:6px}
.med{margin-bottom:3px;line-height:1.3}
.med-no{font-weight:400}
.med-name{font-weight:700}
.med-jml{font-weight:700;white-space:nowrap}
.t-lampiran th{font-size:7.5pt}
.rm-summary{margin:8px 0 10px;font-size:8.5pt}
.rm-sum-line{display:flex;align-items:baseline;gap:6px;padding:1px 0}
.rm-sum-line .rm-sum-dots{flex:1;border-bottom:1px dotted #000;transform:translateY(-3px)}
.rm-checkbox:focus-visible,.vbox:focus-visible,.toolbar-btn:focus-visible,.toolbar-select:focus-visible,.tab-btn:focus-visible{outline:2px solid #000000;outline-offset:2px}
.vbox{appearance:none;-webkit-appearance:none;width:11px;height:11px;margin:0;border:1px solid #000000;border-radius:0;background-color:#FFFFFF;display:inline-grid;place-content:center;vertical-align:middle;cursor:pointer}
.vbox::before{content:"\u2713";font-size:9px;font-weight:bold;line-height:1;color:#000000;transform:scale(0)}
.vbox:checked::before{transform:scale(1)}
.doc-body table{width:100%!important;border-collapse:collapse!important;margin:0 0 8px!important;font-size:8.2pt!important}
.doc-body th,.doc-body td{border:1px solid #000000!important;padding:3px 5px!important;vertical-align:top;color:#000000!important;overflow-wrap:anywhere}
.doc-body th{background-color:#FFFFFF!important;font-weight:bold;text-align:center}
.doc-body h1,.doc-body h2,.doc-body h3{font-size:9.5pt;margin:6px 0}
.doc-body p{margin:2px 0}
.doc-body label{min-width:100px;font-weight:600;color:#333333}
.doc-body .fv{font-weight:500}
.doc-body img{max-width:100%!important;height:auto!important}
.doc-body .panel,.doc-body .isidalam,.doc-body .card{border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;width:100%!important}
.doc-body .vcol{width:16px!important;text-align:center!important}
.telaah-layout{display:flex;gap:8px;align-items:stretch;margin:0 0 6px}
.telaah-layout table{flex:1;margin-bottom:0}
.img-wrap{display:inline-block;max-width:100%}
.img-tools{display:flex;gap:6px;justify-content:flex-end;margin:0 0 5px}
.img-tools button{font-family:inherit;font-size:10px;padding:3px 9px;border:1px solid #000000;background-color:#FFFFFF;cursor:pointer}
</style></head><body>
<style>
    /* IGD: gambar asal MORBIS (skala nyeri Wong Baker & gambar objektif)
       ikut tercetak, dirapikan sebagai figure + keterangan. */
    .rm-figure { margin: 0 0 8px; break-inside: avoid; text-align: center; }
    .rm-figure img { max-width: 100%; height: auto; border: 1px solid #000000; }
    .rm-figure figcaption { margin-top: 3px; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.04em; }
    .rm-figure-row { display: flex; gap: 10px; align-items: flex-start; break-inside: avoid; }
    .rm-figure-row .rm-figure { flex: 0 0 46%; margin: 0; }
    .rm-figure-row .rm-grid-table { flex: 1; min-width: 0; }
    .rm-note { border: 1px solid #000000; padding: 6px 8px; margin-bottom: 8px; font-size: 8.2pt; line-height: 1.4; break-inside: avoid; }

    /* Bahasa visual RM baku: banner bagian bernomor, tabel full-grid, kotak
       centang statis \u2014 mengikuti prototipe referensi RM.02/IGD. */
    .rm-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif; font-size: 8pt; line-height: 1.28; }
    .rm-table th, .rm-table td { border: 1px solid #000000; padding: 3px 5px; vertical-align: top; }
    .rm-table th { font-weight: bold; text-align: center; vertical-align: middle; }
    .rm-table tr.sec-hdr td { font-weight: bold; font-size: 8.5pt; text-transform: uppercase; padding: 4px 5px; letter-spacing: 0.01em; }
    .chk-box { display: inline-block; width: 9.5px; height: 9.5px; border: 1px solid #000000; text-align: center; line-height: 8.5px; font-size: 7.5pt; font-weight: bold; margin-right: 3px; vertical-align: middle; }
    .opt-item { display: inline-block; margin-right: 10px; white-space: nowrap; }
    .filter-note { font-size: 7.3pt; font-style: italic; }
    .two-col-grid { display: flex; gap: 6px; margin-bottom: 8px; align-items: stretch; }
    .two-col-grid > .col-half { flex: 1; min-width: 0; }
    .rm-top-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; font-size: 8.5pt; font-weight: bold; }
    .running-header-box { border: 1px solid #000000; padding: 4px 8px; margin-bottom: 6px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; font-size: 7.8pt; }

    /* Editorial clinical: nomor urut otomatis, kepala pasien, dan ringkasan
       data kritis \u2014 tetap tinta hitam di atas kertas A4. */
    #pengkajian-igd { counter-reset: igdsec; }
    #pengkajian-igd .sub-heading-rm {
      counter-increment: igdsec;
      position: relative;
      padding: 3px 0 3px 30px;
      border-bottom: 1px solid #000000;
    }
    #pengkajian-igd .sub-heading-rm::before {
      content: counter(igdsec, decimal-leading-zero);
      position: absolute;
      left: 0;
      top: 3px;
      font-size: 7pt;
      font-weight: normal;
      letter-spacing: 0.08em;
    }
    .igd-masthead { margin-bottom: 9px; }
    .igd-masthead-label { font-size: 7pt; letter-spacing: 0.14em; text-transform: uppercase; }
    .igd-masthead-name {
      font-size: 17pt;
      font-weight: bold;
      line-height: 1.15;
      margin: 2px 0 6px;
      letter-spacing: -0.02em;
    }
    .igd-summary {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
      border-top: 2px solid #000000;
      border-bottom: 1px solid #000000;
      margin: 0 0 9px;
    }
    .igd-summary > div { padding: 5px 8px; border-left: 1px solid #000000; }
    .igd-summary > div:first-child { border-left: 0; padding-left: 0; }
    .igd-summary span { display: block; font-size: 6.5pt; letter-spacing: 0.1em; text-transform: uppercase; }
    .igd-summary b { display: block; font-size: 11pt; line-height: 1.25; margin-top: 2px; }
    .igd-band-value { font-size: 11pt !important; font-weight: bold; }

    /* Laporan Operasi (RM.20) \u2014 tabel label:nilai tanpa garis di dalam kotak,
       narasi pembedahan dipecah jadi langkah bernomor. */
    #form-operasi .op-kv { width: 100%; border-collapse: collapse; }
    #form-operasi .op-kv td { border: none; padding: 1.5px 0; vertical-align: top; font-size: 8.2pt; line-height: 1.3; }
    #form-operasi .op-kv td.k { width: 132px; white-space: nowrap; }
    #form-operasi .op-kv td.c { width: 10px; text-align: center; }
    #form-operasi .op-kv td.v { overflow-wrap: anywhere; }
    #form-operasi .op-narrative { padding: 6px 8px; line-height: 1.45; }
    #form-operasi .op-preface { margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px dashed #666666; }
    #form-operasi .op-steps { margin: 3px 0 0; padding-left: 18px; }
    #form-operasi .op-steps li { margin-bottom: 2px; }

    /* Laporan Anestesi (RM.21) \u2014 2 halaman A4, grafik terkunci, 3 TTE sejajar. */
    #form-anestesi .an-meta { display: flex; justify-content: space-between; font-size: 8pt; font-weight: bold; margin-bottom: 2px; }
    #form-anestesi .an-subtitle { text-align: center; font-size: 8.5pt; letter-spacing: 0.08em; margin: -4px 0 6px; }
    #form-anestesi .an-kv { width: 100%; border-collapse: collapse; }
    #form-anestesi .an-kv td { border: none; padding: 1.5px 0; vertical-align: top; font-size: 8.2pt; line-height: 1.3; }
    #form-anestesi .an-kv td.k { width: 112px; white-space: nowrap; }
    #form-anestesi .an-kv td.c { width: 10px; text-align: center; }
    #form-anestesi .an-kv td.v { overflow-wrap: anywhere; }
    #form-anestesi .an-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px 6px; font-size: 8pt; }
    #form-anestesi .an-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px 8px; font-size: 7.8pt; margin-top: 2px; }
    #form-anestesi .an-risk { margin-top: 4px; padding-top: 4px; border-top: 1px dashed #666666; }
    #form-anestesi .chart-frame { padding: 4px; text-align: center; border: 1px solid #000000; break-inside: avoid; page-break-inside: avoid; }
    #form-anestesi .chart-frame img { max-width: 100%; height: auto; }
    #form-anestesi .an-page-break { page-break-before: always; break-before: page; }
    #form-anestesi { break-after: auto; page-break-after: auto; }
    #form-anestesi + .rm-page { break-before: page; page-break-before: always; }
    #form-anestesi .an-tte .tte-qr img { width: 100%; height: auto; max-width: 48px; }
    #form-anestesi .an-running { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; border-bottom: 1.5px solid #000000; padding-bottom: 4px; margin: 0 0 7px; font-size: 8pt; }
    #form-anestesi .an-instruksi { margin: 0; padding-left: 18px; line-height: 1.4; font-size: 8.2pt; }
    #form-anestesi .an-tte-note { font-size: 7.6pt; margin-top: 4px; }
    #form-anestesi .an-tte { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; break-inside: avoid; page-break-inside: avoid; }
    #form-anestesi .an-tte .tte-box { padding: 5px 4px; text-align: center; font-size: 8pt; }
    #form-anestesi .an-tte .tte-qr { width: 54px; height: 54px; margin: 4px auto; display: flex; align-items: center; justify-content: center; }
    #form-anestesi .an-tte .tte-name { font-weight: bold; }
</style>
<header class="verifier-toolbar no-print"><div class="toolbar-row">
<div class="toolbar-group"><span class="toolbar-label">Formulir RM Klaim BPJS:</span><select id="rmSectionSelect" class="toolbar-select" aria-label="Pilih Formulir RM">${b}</select></div>
<div class="toolbar-group"><span class="toolbar-counter">Tanda Verifikator (&#10003;): <strong id="checkCounter">0 / 0</strong></span>
<button type="button" class="toolbar-btn" id="btnCheckAll">Centang Semua</button>
<button type="button" class="toolbar-btn" id="btnResetChecks">Reset</button>
<button type="button" class="toolbar-btn toolbar-btn-print" id="btnPrintPdf">Cetak / Simpan PDF (A4)</button></div>
</div><nav id="rmTabs" class="toolbar-tabs" aria-label="Navigasi Formulir RM">${x}</nav></header>
<main class="dossier-wrapper">${G}${U}</main>
</body></html>`}async function Mi(){let i=t=>{let e=getComputedStyle(t);return e.display!=="none"&&e.visibility!=="hidden"&&Number(e.opacity)>0},M=Date.now()+3e3;for(;Date.now()<M&&[".swal2-container",".swal-overlay--active",".sweet-alert"].flatMap(e=>Array.from(document.querySelectorAll(e))).some(i);)await new Promise(e=>window.setTimeout(e,150));await new Promise(t=>window.setTimeout(t,50))}function Li(i){let M=window.open("","_blank");if(!M)return!1;try{return M.document.open(),M.document.write(i),M.document.close(),Pt(M),Ut(M),!0}catch{return!1}}async function Xt(){let i=document.getElementById("ext-mklaim-print-btn"),M=i?.textContent||"Cetak Rapi M-KLAIM";i&&(i.disabled=!0,i.textContent="Memproses\u2026",i.style.opacity="0.7");try{await Mi();let{sections:t,inventory:e}=Qt();if(t.length<3&&(await new Promise(L=>window.setTimeout(L,800)),{sections:t,inventory:e}=Qt()),!t.length){window.alert("Tidak ada section berkas yang bisa dicetak.");return}let r=ri(t,e);if(Li(r))return;let u;for(let L of[0,300,600]){L&&await new Promise(l=>window.setTimeout(l,L));try{if(!(await chrome.runtime.sendMessage({type:"OPEN_PRINT_DOSSIER",html:r}))?.success)throw new Error("background menolak membuka tab");return}catch(l){u=l;let d=l instanceof Error?l.message:String(l);if(!/Receiving end does not exist|Extension context invalidated/i.test(d))break}}let n=u instanceof Error?u.message:String(u||"");chrome.runtime?.id?window.alert(`Gagal membuka dossier: ${n||"tidak diketahui"}. Refresh halaman M-KLAIM (Ctrl+Shift+R) lalu coba lagi.`):window.alert("Ekstensi diperbarui, refresh halaman M-KLAIM (Ctrl+Shift+R) lalu klik lagi Cetak Rapi.")}finally{i&&(i.disabled=!1,i.textContent=M,i.style.opacity="1")}}function ui(){let i=Array.from(document.querySelectorAll("button.btn-success")).find(t=>/^printDiv\s*\(/i.test(t.getAttribute("onclick")||""));return i?.parentElement?i.parentElement:Array.from(document.querySelectorAll('div[style*="text-align:right"]')).find(t=>t.querySelector("button"))||document.getElementById("SCETAK")||document.body}var vt="v2";function Ht(){if(!window.location.pathname.includes("/v2/m-klaim/detail-v2-refaktor"))return;let i=document.getElementById("ext-mklaim-print-btn");if(i?.dataset.extBuild===vt)return;i?.remove();let M=ui(),t=document.createElement("button");t.id="ext-mklaim-print-btn",t.dataset.extBuild=vt,t.type="button",t.className="btn btn-primary btn-sm",t.style.cssText="margin-left:8px;background:#0f766e;border-color:#0f766e;color:#fff;font-weight:600;border-radius:4px;padding:5px 12px;cursor:pointer;white-space:nowrap;",t.textContent="Cetak Rapi M-KLAIM",t.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),Xt().catch(r=>{console.error("[mKlaimPrint] gagal:",r),window.alert("Gagal menyiapkan dossier cetak. Coba refresh halaman M-KLAIM."),t.disabled=!1,t.textContent="Cetak Rapi M-KLAIM"})}),M.appendChild(t)}window.extMklaimPrintNow=Xt;typeof Kt.featureModules<"u"&&(Kt.featureModules.mKlaimPrint={id:"mKlaimPrint",name:"Cetak Rapi M-KLAIM",description:"Dossier cetak A4 profesional: semua section berkas klaim disusun rapi di tab baru",match:{prefix:"/v2/m-klaim/detail-v2-refaktor"},run:()=>{let i=()=>Ht();document.readyState==="complete"?window.setTimeout(i,500):window.addEventListener("load",()=>window.setTimeout(i,500));let M=()=>{let e=document.getElementById("ext-mklaim-print-btn");if(e?.dataset.extBuild!==vt){Ht();return}e.parentElement&&e.parentElement.lastElementChild!==e&&e.parentElement.appendChild(e)};new MutationObserver(()=>M()).observe(document.body,{childList:!0,subtree:!0}),window.setInterval(M,1500)}});return ua(oi);})();
