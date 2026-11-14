"use strict";var __morbis_feature=(()=>{var vt="extensionConfig";function Qt(l,i,g){let h=i?.features?.[l];if(!h)return!0;if(h.enabled===!1)return!1;let w=g??i?.currentRole??"admin";if(w==="admin")return!0;let k=h.allowedRoles;return!Array.isArray(k)||k.length===0?!0:k.includes(w)}async function Zt(l){try{let g=(await chrome.storage.sync.get(vt))?.[vt]??null;return Qt(l,g)}catch{return!0}}function wt(l,i){Zt(l).then(g=>{if(g)try{i()}catch(h){console.error(`[featureGate:${l}] gagal jalan:`,h)}})}var Tt="ext-free-text-noop",St='input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select{text-transform:none!important}';function At(l){try{let i=l.toUpper;if(typeof i=="function"&&i[Tt]===!0)return!0;let g=function(h){return h?.value??""};g[Tt]=!0;try{Object.defineProperty(l,"toUpper",{value:g,writable:!0,configurable:!0})}catch{l.toUpper=g}return!0}catch{return!1}}var et="ext-pa-typo",jt=[{key:"kop",label:"Kop Surat"},{key:"pasien",label:"Data Pasien"},{key:"judul",label:"Judul Bagian Isi"},{key:"isi",label:"Isi (termasuk ICD-O, Saran & Catatan)"},{key:"kesimpulan",label:"Kesimpulan"},{key:"ttd",label:"TTD"}],A={kop:{fs:16,lh:1.2},pasien:{fs:4,lh:1},judul:{fs:6,lh:1.2},isi:{fs:5,lh:1.25},kesimpulan:{fs:5,lh:1.25},icdo:{fs:6,lh:1.2},catatan:{fs:5,lh:1.25},ttd:{fs:6,lh:1.2}},Lt=4,Pt=24,te=.5,ee=2.5;function Et(l,i,g,h){let w=typeof l=="number"?l:Number(l);return Number.isFinite(w)?Math.min(h,Math.max(g,w)):i}function E(l,i){let g=l??{};return{fs:Et(g.fs,i.fs,Lt,Pt),lh:Et(g.lh,i.lh,te,ee)}}function $(l){let i=l??{};return{kop:E(i.kop,A.kop),pasien:E(i.pasien,A.pasien),judul:E(i.judul,A.judul),isi:E(i.isi,A.isi),kesimpulan:E(i.kesimpulan,A.kesimpulan),icdo:E(i.icdo,A.icdo),catatan:E(i.catatan,A.catatan),ttd:E(i.ttd,A.ttd)}}function tt(){return $(null)}function nt(l){try{if(!l)return tt();let i=l.getItem(et);return i?$(JSON.parse(i)):tt()}catch{return tt()}}function Ct(l,i){try{return l?(l.setItem(et,JSON.stringify($(i))),!0):!1}catch{return!1}}function It(l){try{l?.removeItem(et)}catch{}}function it(l){let i=$(l),g=h=>Math.min(Pt,Math.max(Lt,h));return{...i,alamatFs:g(i.kop.fs-8.5),judulLapFs:g(i.kop.fs-4)}}var b=l=>String(Math.round(l*100)/100);function ne(l){let i=it(l);return{"--pa-kop-fs":`${b(i.kop.fs)}pt`,"--pa-kop-lh":b(i.kop.lh),"--pa-alamat-fs":`${b(i.alamatFs)}pt`,"--pa-judul-lap-fs":`${b(i.judulLapFs)}pt`,"--pa-pasien-fs":`${b(i.pasien.fs)}pt`,"--pa-pasien-lh":b(i.pasien.lh),"--pa-judul-fs":`${b(i.judul.fs)}pt`,"--pa-judul-lh":b(i.judul.lh),"--pa-isi-fs":`${b(i.isi.fs)}pt`,"--pa-isi-lh":b(i.isi.lh),"--pa-kesimpulan-fs":`${b(i.kesimpulan.fs)}pt`,"--pa-kesimpulan-lh":b(i.kesimpulan.lh),"--pa-icdo-fs":`${b(i.icdo.fs)}pt`,"--pa-icdo-lh":b(i.icdo.lh),"--pa-catatan-fs":`${b(i.catatan.fs)}pt`,"--pa-catatan-lh":b(i.catatan.lh),"--pa-ttd-fs":`${b(i.ttd.fs)}pt`,"--pa-ttd-lh":b(i.ttd.lh)}}function Rt(l,i){if(l)try{for(let[g,h]of Object.entries(ne(i)))l.setProperty(g,h)}catch{}}var ie=/^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;function at(l){let i=l??"",g=i.match(ie);if(!g)return null;let h=i.slice(g[0].length).trim();return h===""?null:[g[1],h]}wt("paLabPrint",function(){"use strict";function l(){try{At(window)}catch{}try{if(document.head&&!document.getElementById("ext-free-text-style")){let k=document.createElement("style");k.id="ext-free-text-style",k.textContent=St,document.head.appendChild(k)}}catch{}}if(l(),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",l),window.setInterval(l,3e3),!window.location.pathname.includes("/laboratorium/print/"))return;async function g(){let k="ext-pa-print-proc";if(document.documentElement.getAttribute(k))return;document.documentElement.setAttribute(k,"1");let G=()=>{try{return window.localStorage??null}catch{return null}},T=nt(G()),B=()=>{try{Rt(document.documentElement.style,T)}catch{}};B();let v=t=>D(t?.textContent||"");function ot(t){return t.replace(/<[^>]+>/g," ")}function zt(t){return t.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi,"H. ")}function D(t){return zt(t).replace(/\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi," ").replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi," ").replace(/\s+/g," ").trim()}function c(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let rt=document.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",F=Array.from(document.querySelectorAll("h1.kop-atas")).map(t=>v(t)).filter(Boolean);for(;F.length<3;)F.push("");let z=[],st=document.querySelector("#head-cetak-logo center, #head-cetak-logo");if(st){let t=document.createElement("div");t.innerHTML=st.innerHTML,t.querySelectorAll("h1").forEach(e=>e.remove()),z=(t.innerHTML||"").split(/<br\s*\/?>/gi).map(e=>t.textContent&&e.replace(/<[^>]+>/g,"").trim()).map(e=>String(e||"").trim()).filter(Boolean)}let _=z.join(" "),lt=t=>{let e=_.match(new RegExp(t+"\\s*:([\\d\\s().+-]+)","i"));return e?e[1].trim():""},pt=lt("telp"),ct=lt("fax"),q=(_.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)||[""])[0],O=(_.match(/https?:\/\/[^\s;,]+/)||[""])[0],j=_.replace(/telp\s*:[\d\s().+-]+/gi,"").replace(/fax\s*:[\d\s().+-]+/gi,"").replace(/website\s*:?/gi,"").replace(/email\s*:?/gi,"");q&&(j=j.split(q).join("")),O&&(j=j.split(O).join("")),j=j.split(/[;]+/).map(t=>t.replace(/\s+/g," ").trim()).filter(Boolean).join(", ").replace(/,\s*,+/g,",").replace(/^[,;\s]+|[,;\s]+$/g,"");let Mt=["Alamat: "+j,pt?"Telp: "+pt:"",ct?"Fax: "+ct:""].filter(Boolean).join(", "),Ht=[q?"Email: "+q:"",O?"Website: "+O:""].filter(Boolean).join(", ");z=[Mt,Ht].filter(Boolean);let V=v(document.querySelector(".head-cetak-instansi"))||"LAPORAN HASIL PEMERIKSAAN",U=[];document.querySelectorAll(".table-outer tr").forEach(t=>{let e=t.querySelectorAll("td");if(e.length>=6){let o=v(e[0]),p=v(e[2]),s=v(e[3]),r=v(e[5]);o&&U.push([o,p]),s&&U.push([s,r])}});let P=["makroskopik","mikroskopik","kesimpulan","icdo","catatan","saran"],y=t=>t.toLowerCase().replace(/0/g,"o").replace(/[^a-z]/g,""),S=[];document.querySelectorAll(".contentlab td").forEach(t=>{let e="",o=!1,p=t.querySelector(".section-title");if(p)e=v(p),o=!0;else{let d=f=>f.split(":")[0].trim();for(let f of Array.from(t.children).slice(0,3)){let u=v(f);if(u&&u.length<=24&&P.includes(y(d(u)))){e=d(u);break}}if(!e){let f=(t.textContent||"").split(`
`).map(u=>u.trim()).find(Boolean)||"";f&&P.includes(y(d(f)))&&(e=d(f))}if(!e)return}let s=document.createElement("div");s.innerHTML=t.innerHTML,s.querySelector(".section-title")?.remove();let r=s.innerHTML.replace(/\r\n?/g,`
`).replace(/<br\s*\/?>[ \t]*\n?/gi,`
`).replace(/\n(?:[ \t]*\n)+/g,"\u2028").split("\u2028").map(d=>d.split(/<br\s*\/?>|\n/).map(f=>D(f.replace(/<[^>]+>/g," "))).filter(Boolean)).filter(d=>d.length),m=[],a=[];r.forEach((d,f)=>{d.forEach((u,L)=>{f>0&&L===0&&m.length&&a.push(m.length),m.push(u)})});let n=m;if(!o&&n.length&&y(n[0])===y(e)){n.shift();for(let d=0;d<a.length;d++)a[d]-=1;for(;a.length&&a[0]<=0;)a.shift()}n.length>1&&!/^[IVXLC]+\.\s/.test(n[0])&&n.slice(1).some(d=>/^II\.\s/.test(d))&&(n[0]="I. "+n[0]),e&&S.push({title:e,items:n,para:a})});let Gt=/^catatan\s*:?/i,Dt=/^icd[\s-]*o\b\s*:?/i,X=[];for(let t of S){let e=[{title:t.title,items:[],para:[]}],o=e[0],p=!1,s=(r,m)=>{o={title:r,items:[],para:[],bare:m},e.push(o),p=!0};if(t.items.forEach((r,m)=>{let a=r.match(Gt),n=a?null:r.match(Dt);if(a){y(o.title)!=="catatan"&&s("Catatan");let d=r.slice(a[0].length).trim();d&&(t.para.includes(m)&&o.para.push(o.items.length),o.items.push(d));return}if(n){y(o.title)!=="icdo"&&s("ICD-0",!0),t.para.includes(m)&&o.para.push(o.items.length),o.items.push(r);return}t.para.includes(m)&&o.para.push(o.items.length),o.items.push(r)}),p)for(let r of e)r.items.length&&X.push(r);else X.push(e[0])}S.length=0,S.push(...X),S.forEach((t,e)=>t._i=e),S.sort((t,e)=>{let o=t._i??0,p=e._i??0,s=P.indexOf(y(t.title)),r=P.indexOf(y(e.title)),m=s===-1?P.length:s,a=r===-1?P.length:r;return m!==a?m-a:o-p});function Ft(t){let e="";t instanceof HTMLSelectElement?e=((t.selectedIndex>=0?t.options[t.selectedIndex]:void 0)?.textContent||t.value||"").trim():(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(e=(t.value||"").trim());let o=(t.getAttribute("name")||"")+" "+(t.getAttribute("id")||""),p=t.getAttribute("placeholder")||"",s=t.closest("tr, .form-group, .form-row, div")?.textContent||"";return{val:e,ctx:(o+" "+p+" "+s).slice(0,300)}}function _t(t,e,o){let p=e.toLowerCase().split(/[^a-z0-9]+/).filter(a=>a.length>=4&&!/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(a));if(!p.length)return"";let s=p.sort((a,n)=>n.length-a.length)[0],r="",m=-1;return t.querySelectorAll("input, textarea, select").forEach(a=>{let{val:n,ctx:d}=Ft(a);if(!n||n===e||!n.toLowerCase().includes(s))return;let f=o.test(d)?2:0;f>m&&(m=f,r=n)}),r}function qt(t,e){return(t.querySelector(e)?.value||"").trim()}async function Ot(t){let e=new URLSearchParams(window.location.search).get("id");if(!e)return;let o=a=>/ket\w*\s*klinis/i.test(a),p=a=>/^dokter/i.test(a)||/^rs\b/i.test(a),s=t.map(([a,n],d)=>({label:a,value:n,idx:d})).filter(a=>p(a.label)?!!a.value:o(a.label));if(!s.length)return;let r=new AbortController,m=window.setTimeout(()=>r.abort(),6e3);try{let a=new URL("/laboratorium/input-hasil/input-hasil-pa?id_lab="+encodeURIComponent(e),window.location.href),n=await fetch(a.toString(),{credentials:"same-origin",signal:r.signal});if(!n.ok){window.console.info("[paPrint] override: fetch input status "+n.status);return}let d=await n.text(),f=new DOMParser().parseFromString(d,"text/html");window.console.info('[paPrint] override: input title="'+(f.title||"").slice(0,60)+'" len='+d.length+" fields="+f.querySelectorAll("input, textarea, select").length);for(let u of s){if(o(u.label)){let Z=qt(f,'#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]'),x=D(ot(Z));window.console.info("[paPrint] override: "+u.label+' cetak="'+u.value+'" input="'+x+'"'),x&&x!==u.value&&(t[u.idx][1]=x);continue}let L=/^dokter/i.test(u.label)?/dokter|pengirim|luar|dalam|rujuk/i:/rs\b|rumah\s*sakit|faskes|asal/i,Q=_t(f,u.value,L),I=D(ot(Q||""));window.console.info("[paPrint] override: "+u.label+' cetak="'+u.value+'" input="'+I+'"'),I&&I!==u.value&&(t[u.idx][1]=I)}}catch{window.console.info("[paPrint] override: fetch gagal, pakai nilai server")}finally{window.clearTimeout(m)}}await Ot(U).catch(()=>{});let C=Array.from(document.querySelectorAll(".contentlab ~ div table td")).map(t=>v(t)).filter(Boolean),dt=C[0]||"",ut=C[1]||"",K=document.querySelector(".contentlab ~ div table img")?.getAttribute("src")||"",mt=C.find(t=>/^\(.*\)$/.test(t))||C[2]||"",ft=C.find(t=>/^nip\.?/i.test(t))||C[3]||"",gt=document.querySelector('a.tombol[href*="export"]')?.getAttribute("href")||window.location.href+"&export=word",Ut=Array.from(document.body.querySelectorAll("script")),Kt=t=>t.toLowerCase().split(/\s+/).map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" "),M=U.map(([t,e])=>{if(/^(cara|care)\s+peroleh(an)?$/i.test(t.trim()))return["Cara Perolehan",e];if(!/^ruang/i.test(t))return[t,e];let o=e.replace(/^poli\s+.+?-\s*(?=klinik)/i,"").trim()||e,s=o.replace(/^(\S+)\s+-\s*(?=\1\b)/i,"").trim()||o,r=s.split(/\s+-\s*/);if(r.length>=3&&/rawat\s+inap/i.test(r[1])){let m=Kt(r[1].trim()),a=r.slice(2).join(" - ").trim(),n=a?m+" - "+a:m;if(n)return[t,n]}return[t,s]}),Nt=M.map(([t,e])=>'<div class="info-item"><div class="info-label">'+c(t)+'</div><div class="info-colon">:</div><div class="info-value">'+c(e)+"</div></div>").join(""),W=t=>/^icd-?o\s*:/i.test(t)?"<strong>"+c(t)+"</strong>":c(t),$t=t=>/^catatan/i.test(t.trim()),Y=t=>/^saran/i.test(t.trim()),ht=t=>$t(t)||Y(t),Bt=t=>Y(t)?"Saran:":"Catatan:",J=t=>t.replace(/^(catatan|saran)\s*:?\s*/i,"").replace(/^[-•–—*]+\s*/,"").trim(),Vt=M.find(([t])=>/^no\.?pa/i.test(t))?.[1].replace(/[^a-zA-Z0-9]+/g,"-")||"tanpa-no";function bt(t){if(/^data:/i.test(t))return Promise.resolve(t);let e=new URL(t,window.location.href).href;return fetch(e,{signal:AbortSignal.timeout(8e3),credentials:"same-origin"}).then(o=>{if(!o.ok)throw new Error("img "+o.status);return o.blob()}).then(o=>new Promise((p,s)=>{let r=new FileReader;r.onload=()=>p(String(r.result)),r.onerror=()=>s(r.error),r.readAsDataURL(o)})).catch(()=>e)}async function Xt(){let t=it(T),[e,o]=await Promise.all([bt(rt),K?bt(K):Promise.resolve("")]),p="";for(let n=0;n<M.length;n+=2){let d=M[n],f=M[n+1];p+="<tr><td>"+c(d[0])+"</td><td>:</td><td>"+c(d[1])+"</td>"+(f?"<td>"+c(f[0])+"</td><td>:</td><td>"+c(f[1])+"</td>":"<td></td><td></td><td></td>")+"</tr>"}let s="";for(let n of S){if(ht(n.title)){let x=n.items.length?n.items:["Tidak ada"],H=x.length>1,R=Y(n.title)?"SARAN:":"CATATAN:";s+='<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top" style="font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><b>'+R+'</b></td><td valign="top" style="font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';">'+x.map(N=>(H?"- ":"")+"<b>"+c(J(N)||"Tidak ada")+"</b>").join("<br>")+"</td></tr></table>";continue}if(n.bare){n.items.forEach((x,H)=>{s+='<p style="margin:'+(H===0?"12pt":"0")+" 0 6pt 0;font-size:"+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><b>'+c(x.toUpperCase())+"</b></p>"});continue}let d=["makroskopik","mikroskopik","kesimpulan"].includes(y(n.title)),f=y(n.title)==="icdo";s+='<p style="margin:12pt 0 0 0;font-size:'+(f?t.isi.fs:t.judul.fs)+'pt;"><b>'+(d?"<u>":"")+c(n.title.toUpperCase())+(d?"</u>":"")+"</b></p>";let u=y(n.title)==="kesimpulan",L=y(n.title)==="icdo",Q=u||L||y(n.title)==="saran",I=u?t.kesimpulan.fs:t.isi.fs,Z=u?t.kesimpulan.lh:t.isi.lh;n.items.forEach((x,H)=>{let R=at(x),N=n.items.length===1&&R!==null&&/^[-•–—*]$/.test(R[0]),kt=N?J(x)||R[1]:x,Yt=Q?"<b>"+c(kt)+"</b>":W(kt),Jt=R&&!N?"margin-left:18pt;text-indent:-18pt;":"";s+='<p style="margin:'+(n.para.includes(H)?"14pt":"0")+" 0 6pt 0;font-size:"+I+"pt;line-height:"+Z+";text-align:justify;"+Jt+'">'+Yt+"</p>"})}let r='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>'+c(V)+'</title></head><body style="font-family:Arial,sans-serif;font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="'+e+'" width="90"></td><td align="center">'+F.slice(0,3).map(n=>'<b style="font-size:'+t.kop.fs+'pt;">'+c(n)+"</b>").join("<br>")+'<br><span style="font-size:'+t.alamatFs+'pt;">'+z.map(n=>c(n)).join("<br>")+'</span></td></tr></table><hr><p align="center" style="font-size:'+t.judulLapFs+'pt;"><b><u>'+c(V.toUpperCase())+'</u></b></p><table border="0" cellspacing="0" cellpadding="2" style="font-size:'+t.pasien.fs+"pt;line-height:"+t.pasien.lh+';">'+p+"</table>"+s+'<table border="0" width="100%" cellspacing="0" cellpadding="0" style="font-size:'+t.ttd.fs+"pt;line-height:"+t.ttd.lh+';"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">'+c(dt)+'</p><p style="margin:0 0 6pt 0;">'+c(ut)+"</p>"+(o?'<p style="margin:0 0 6pt 0;"><img src="'+o+'" width="80" height="80"></p>':"")+'<p style="margin:0 0 6pt 0;"><b>'+c(mt)+'</b></p><p style="margin:0 0 6pt 0;">'+c(ft)+"</p></td></tr></table></body></html>",m=new Blob(["\uFEFF"+r],{type:"application/msword"}),a=document.createElement("a");a.href=URL.createObjectURL(m),a.download="Hasil-PA-"+Vt+".doc",document.body.appendChild(a),a.click(),window.setTimeout(()=>{URL.revokeObjectURL(a.href),a.remove()},4e3)}let Wt=S.map(t=>{if(ht(t.title)){let n=t.items.length?t.items:["Tidak ada"],d=n.length>1;return'<div class="section-catatan"><span class="catatan-label">'+Bt(t.title)+'</span><div class="catatan-list">'+n.map(f=>{let u="<span>"+c(J(f)||"Tidak ada")+"</span>";return d?'<div class="catatan-item"><span class="catatan-dash">-</span>'+u+"</div>":'<div class="catatan-item">'+u+"</div>"}).join("")+"</div></div>"}let e=y(t.title)==="kesimpulan",o=y(t.title)==="icdo",p=e||o||y(t.title)==="saran",s='<div class="'+(t.bare?"section-isi section-isi-bare":"section-isi")+(e?" section-kesimpulan":"")+(o&&!t.bare?" section-icdo":"")+'">'+t.items.map((n,d)=>{let f=t.para.includes(d)?" item-para":"",u=at(n);if(u&&!(t.items.length===1&&/^[-•–—*]$/.test(u[0]))){let L=p?"<strong>"+c(u[1])+"</strong>":W(u[1]);return'<div class="item-list has-marker'+f+'"><span class="item-marker">'+c(u[0])+"</span><span>"+L+"</span></div>"}return'<div class="item-list'+f+'">'+(p?"<strong>"+c(n)+"</strong>":W(n))+"</div>"}).join("")+"</div>";if(t.bare)return s;let r=y(t.title),m=["makroskopik","mikroskopik","kesimpulan"].includes(r)?" u":"",a=r==="icdo"?" i":"";return'<div class="section-judul'+m+a+'">'+c(t.title)+"</div>"+s}).join("");document.body.innerHTML='<a href="'+c(gt)+'" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><button type="button" class="no-print" id="btn-typo" title="Atur font & spasi cetakan">\u2699\uFE0F Gaya</button><div class="t-typo no-print" id="ext-pa-typo" hidden></div><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="'+c(rt)+'" alt="Logo"></div><div class="kop-text">'+F.slice(0,3).map(t=>'<h1 class="kop-atas">'+c(t)+"</h1>").join("")+'<div class="kop-alamat">'+z.map(t=>c(t)).join("<br>")+'</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">'+c(V)+'</div><div class="patient-info-container">'+Nt+'</div><div class="hasil-pa">'+Wt+'</div><div class="ttd-container clearfix"><div class="ttd-box"><p>'+c(dt)+"</p><p>"+c(ut)+"</p>"+(K?'<img src="'+c(K)+'" alt="QR Code TTD">':"")+'<p style="font-weight: bold; margin-bottom: 0;">'+c(mt)+'</p><p style="margin-top: 2px;">'+c(ft)+"</p></div></div></div>",Ut.forEach(t=>document.body.appendChild(t)),document.querySelector("#btn-word")?.addEventListener("click",t=>{t.preventDefault(),Xt().catch(()=>{window.location.href=gt})});let yt=()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=(p,s,r,m,a,n,d,f)=>"<label>"+c(r)+'<input type="range" data-g="'+c(p)+'" data-f="'+s+'" min="'+m+'" max="'+a+'" step="'+n+'" value="'+d+'"><output data-o="'+c(p+"-"+s)+'">'+c(String(d)+f)+"</output></label>";t.innerHTML="<h4>Gaya Cetakan PA</h4>"+jt.map(p=>'<div class="t-typo-group"><strong>'+c(p.label)+'</strong><div class="t-typo-row">'+e(p.key,"fs","Font (pt)",4,20,.5,T[p.key].fs,"pt")+e(p.key,"lh","Spasi baris",.5,2.5,.05,T[p.key].lh,"")+"</div></div>").join("")+'<div class="t-typo-actions"><button type="button" data-act="save" class="primary">Simpan</button><button type="button" data-act="reset">Reset</button></div><div class="t-typo-note" data-note></div>',t.querySelectorAll('input[type="range"]').forEach(p=>{let s=p;s.addEventListener("input",()=>{let r=s.dataset.g,m=s.dataset.f;if(!r||!m||!T[r])return;T[r][m]=Number(s.value),B();let a=t.querySelector(`output[data-o="${r}-${m}"]`);a&&(a.textContent=s.value+(m==="fs"?"pt":""))})});let o=t.querySelector("[data-note]");t.querySelector('[data-act="save"]')?.addEventListener("click",()=>{let p=Ct(G(),T);o&&(o.textContent=p?"Tersimpan \u2713":"Gagal menyimpan")}),t.querySelector('[data-act="reset"]')?.addEventListener("click",()=>{if(It(G()),T=nt(G()),B(),yt(),o){let p=t.querySelector("[data-note]");p&&(p.textContent="Kembali ke default \u2713")}})};document.querySelector("#btn-typo")?.addEventListener("click",()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=t.hidden;e&&yt(),t.hidden=!e}),document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(t=>t.remove());let xt="ext-pa-print-style";if(!document.getElementById(xt)){let t=document.createElement("style");t.id=xt,t.textContent=`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

        /* Pengaturan Font dan Kertas untuk Cetak */
        body {
            font-family: 'Roboto', sans-serif;
            font-size: 6pt;
            color: #000;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
        }

        .page-a4 {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 20mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            border-radius: 4px;
        }

        /* User Header Styles */
        .head-cetak {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin-bottom: 5px;
            width: 100%;
        }

        #logo img {
            height: 90px;
            width: auto;
        }

        .kop-text {
            text-align: center;
        }

        .kop-atas {
            font-size: var(--pa-kop-fs, 16pt);
            margin: 0;
            line-height: var(--pa-kop-lh, 1.2);
            font-weight: bold;
            color: #000;
        }

        .kop-alamat {
            font-size: var(--pa-alamat-fs, 7.5pt);
            margin-top: 5px;
            color: #334155;
            line-height: var(--pa-kop-lh, 1.3);
        }

        hr.kop-hr {
            border: none;
            border-top: 2px solid #000;
            margin: 10px 0;
            width: 100%;
        }

        .head-cetak-instansi {
            font-size: var(--pa-judul-lap-fs, 12pt);
            font-weight: bold;
            text-align: center;
            margin: 15px 0 20px 0;
            text-decoration: underline;
            text-transform: uppercase;
            line-height: var(--pa-kop-lh, 1.2);
        }

        /* Kontainer utama dengan 2 kolom */
        .patient-info-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 40px;
            font-family: Arial, sans-serif;
            max-width: 900px;
        }

        /* Tata letak untuk setiap baris data (Label : Nilai) */
        .info-item {
            display: grid;
            grid-template-columns: 110px 15px 1fr;
            align-items: start;
        }

        .info-label {
            font-weight: 500;
        }

        .info-colon {
            text-align: center;
        }

        /* Responsif: Ubah jadi 1 kolom di layar HP (lebar maksimal 768px) */
        @media (max-width: 768px) {
            .patient-info-container {
                grid-template-columns: 1fr;
            }
        }

        /* Result Sections */
        .hasil-pa {
            margin-top: 20px;
        }

        .hasil-title {
            text-align: center;
            font-weight: bold;
            font-size: 8pt;
            margin-bottom: 20px;
            text-decoration: underline;
        }

        .section-judul {
            font-weight: bold;
            margin-top: 12px;
            font-size: 6pt;
            text-transform: uppercase;
        }

        /* Garis bawah hanya untuk header Makroskopik/Mikroskopik/Kesimpulan
           (permintaan user 2026-11-06). */
        .section-judul.u {
            text-decoration: underline;
        }

        .section-isi {
            margin-top: 8px;
            text-align: justify;
            line-height: 1.25;
        }

        .item-list {
            margin-bottom: 12px;
        }

        .group-title {
            margin-bottom: 6px;
            font-weight: 500;
        }

        .empty-field {
            color: #9ca3af;
            font-style: italic;
        }

        /* Signature Section */
        .ttd-container {
            margin-top: 15px;
        }

        .ttd-box {
            float: right;
            width: 300px;
            text-align: center;
            font-size: var(--pa-ttd-fs, 6pt);
            line-height: var(--pa-ttd-lh, 1.2);
        }

        .ttd-box p {
            margin: 5px 0;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        @media print {
            body {
                background-color: transparent;
                padding: 0;
            }

            .page-a4 {
                margin: 0;
                box-shadow: none;
                width: 100%;
                padding: 10mm;
            }

            .nav-container,
            .nav-button,
            .btn-print,
            .btn-back {
                display: none !important;
            }
        }

        /* Buttons */
        .nav-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #64748b;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px;
            transition: background 0.2s;
        }

        .nav-button:hover {
            background-color: #475569;
        }

        .btn-print {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e293b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: background 0.2s;
        }

        .btn-print:hover {
            background: #0f172a;
        }

        .btn-back {
            position: fixed;
            top: 20px;
            right: 170px;
            background: #64748b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: background 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-back:hover {
            background: #475569;
        }

        /* === OVERRIDE: QR sedang + info rapat + print 2 kolom ===
           Layout tetap prioritas; hanya: QR 80px, jarak baris info
           rapat, info pasien tetap grid 2 kolom saat cetak. */
        .ttd-box img {
            width: 80px;
            height: 80px;
        }

        .patient-info-container {
            font-size: var(--pa-pasien-fs, 4pt);
            line-height: var(--pa-pasien-lh, 1);
            gap: 4px 40px;
            border: 1px solid #000;
            padding: 10px 12px;
        }

        @media print {
            .patient-info-container {
                grid-template-columns: 1fr 1fr !important;
            }

            .section-judul {
                break-after: avoid;
            }
        }

        .section-judul {
            font-size: var(--pa-judul-fs, 6pt);
            line-height: var(--pa-judul-lh, 1.2);
        }

        .section-isi {
            font-size: var(--pa-isi-fs, 5pt);
            line-height: var(--pa-isi-lh, 1.25);
        }

        /* Isi Kesimpulan: grup gaya sendiri, terpisah dari Isi
           (permintaan user). Default sama dengan isi agar tampilan
           awal tidak berubah. */
        .section-kesimpulan {
            font-size: var(--pa-kesimpulan-fs, 5pt);
            line-height: var(--pa-kesimpulan-lh, 1.25);
        }

        /* Isi ICD-O yang dirender server DENGAN judul section sendiri:
           menyatu dengan Catatan/Saran \u2192 ikut grup Isi yang sama
           (user 2026-11-06), selalu bold.
           Varian tanpa judul memakai .section-isi-bare (grup Isi sama). */
        .section-icdo {
            font-size: var(--pa-isi-fs, 5pt);
            font-weight: bold;
            line-height: var(--pa-isi-lh, 1.25);
        }

        /* Header ICD-O berjudul menyatu dengan isinya \u2192 grup Isi
           (bukan Judul), supaya header+isi sama besar. */
        .section-judul.i {
            font-size: var(--pa-isi-fs, 5pt);
            line-height: var(--pa-isi-lh, 1.25);
        }

        /* Hanging indent: baris bernomor/berpoin \u2014 penanda di kolom
           kiri tetap, teks lanjutan sejajar di bawah teks. */
        .item-list.has-marker {
            display: flex;
            gap: 6px;
        }

        .item-marker {
            flex-shrink: 0;
        }

        .item-list {
            margin-bottom: 6px;
        }

        /* Awal paragraf baru (baris kosong di input): gap ekstra. */
        .item-list.item-para {
            margin-top: 14px;
        }

        /* ICD-O tanpa judul (bare, id=154696): "ICD-O : \u2026" saja tanpa
           dobel judul "ICD-0" \u2014 font, margin & padding sama persis
           seperti section-judul (minus garis bawah), dan memakai grup
           Isi yang sama dengan Catatan/Saran (user 2026-11-06). */
        .section-isi-bare {
            margin: 12px 0 0;
            padding: 0;
            font-size: var(--pa-isi-fs, 5pt);
            font-weight: bold;
            line-height: var(--pa-isi-lh, 1.25);
            text-transform: uppercase;
        }

        .section-isi-bare .item-list {
            margin: 0;
            padding: 0;
        }

        /* CATATAN & SARAN: label + list gantung \u2014 baris lanjutan rata di bawah
           dash pertama ("Catatan: - \u2026" lalu "- \u2026" sejajar di bawahnya).
           Header dan isi menyatu dalam satu baris, jadi keduanya memakai
           grup Isi yang sama (\u2699\uFE0F Gaya \u2192 Isi), sama besar dengan isi \u2014
           sesuai permintaan user 2026-11-06. Seluruh isinya bold. */
        .section-catatan {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 12px;
            font-size: var(--pa-isi-fs, 5pt);
            font-weight: bold;
            line-height: var(--pa-isi-lh, 1.25);
            text-align: justify;
        }

        .catatan-label {
            flex-shrink: 0;
            font-weight: bold;
            font-size: var(--pa-isi-fs, 5pt);
            line-height: var(--pa-isi-lh, 1.25);
            text-transform: uppercase;
        }

        .catatan-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
            font-weight: bold;
        }

        .catatan-item {
            display: flex;
            gap: 6px;
        }

        .catatan-dash {
            flex-shrink: 0;
        }

        /* Panel pengaturan tipografi (tombol \u2699\uFE0F Gaya) \u2014 no-print. */
        #btn-typo {
            position: fixed;
            top: 70px;
            right: 20px;
            background: #1e293b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            z-index: 9999;
        }
        #btn-typo:hover { background: #0f172a; }
        .t-typo {
            position: fixed;
            top: 120px;
            right: 20px;
            width: 280px;
            max-height: 70vh;
            overflow-y: auto;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
            padding: 12px 14px;
            z-index: 9999;
            font-family: 'Roboto', sans-serif;
        }
        .t-typo h4 { margin: 0 0 8px; font-size: 13px; }
        .t-typo-group { margin-bottom: 10px; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        .t-typo-group > strong { display: block; font-size: 12px; margin-bottom: 4px; }
        .t-typo-row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .t-typo-row label { display: flex; flex-direction: column; font-size: 11px; color: #475569; gap: 2px; }
        .t-typo-row input[type="range"] { width: 100%; }
        .t-typo-row output { font-size: 11px; color: #0f172a; font-weight: 600; }
        .t-typo-actions { display: flex; gap: 8px; margin-top: 4px; }
        .t-typo-actions button {
            flex: 1;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 6px;
            padding: 6px 0;
            font-size: 12px;
            cursor: pointer;
        }
        .t-typo-actions button.primary { background: #1e293b; color: white; border-color: #1e293b; }
        .t-typo-note { font-size: 11px; color: #15803d; min-height: 16px; margin-top: 6px; }
        @media print { .no-print { display: none !important; } }
      `,document.head.appendChild(t)}}let h=Date.now(),w=window.setInterval(()=>{document.documentElement.getAttribute("data-ext-pa-print")==="1"?(window.clearInterval(w),g().catch(()=>{})):Date.now()-h>5e3&&window.clearInterval(w)},200)});})();
