"use strict";var __morbis_feature=(()=>{var vt="extensionConfig";function Qt(c,i,g){let h=i?.features?.[c];if(!h)return!0;if(h.enabled===!1)return!1;let w=g??i?.currentRole??"admin";if(w==="admin")return!0;let k=h.allowedRoles;return!Array.isArray(k)||k.length===0?!0:k.includes(w)}async function Zt(c){try{let g=(await chrome.storage.local.get(vt))?.[vt]??null;return Qt(c,g)}catch{return!0}}function wt(c,i){Zt(c).then(g=>{if(g)try{i()}catch(h){console.error(`[featureGate:${c}] gagal jalan:`,h)}})}var Tt="ext-free-text-noop",St='input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select{text-transform:none!important}';function At(c){try{let i=c.toUpper;if(typeof i=="function"&&i[Tt]===!0)return!0;let g=function(h){return h?.value??""};g[Tt]=!0;try{Object.defineProperty(c,"toUpper",{value:g,writable:!0,configurable:!0})}catch{c.toUpper=g}return!0}catch{return!1}}var nt="ext-pa-typo",jt=[{key:"kop",label:"Kop Surat"},{key:"pasien",label:"Data Pasien"},{key:"judul",label:"Judul Bagian Isi"},{key:"isi",label:"Isi (termasuk ICD-O, Saran & Catatan)"},{key:"kesimpulan",label:"Kesimpulan"},{key:"ttd",label:"TTD"}],A={kop:{fs:16,lh:1.2},pasien:{fs:4,lh:1},judul:{fs:6,lh:1.2},isi:{fs:5,lh:1.25},kesimpulan:{fs:5,lh:1.25},icdo:{fs:6,lh:1.2},catatan:{fs:5,lh:1.25},ttd:{fs:6,lh:1.2}},It=4,Lt=24,te=.5,ee=2.5;function Et(c,i,g,h){let w=typeof c=="number"?c:Number(c);return Number.isFinite(w)?Math.min(h,Math.max(g,w)):i}function E(c,i){let g=c??{};return{fs:Et(g.fs,i.fs,It,Lt),lh:Et(g.lh,i.lh,te,ee)}}function B(c){let i=c??{};return{kop:E(i.kop,A.kop),pasien:E(i.pasien,A.pasien),judul:E(i.judul,A.judul),isi:E(i.isi,A.isi),kesimpulan:E(i.kesimpulan,A.kesimpulan),icdo:E(i.icdo,A.icdo),catatan:E(i.catatan,A.catatan),ttd:E(i.ttd,A.ttd)}}function et(){return B(null)}function it(c){try{if(!c)return et();let i=c.getItem(nt);return i?B(JSON.parse(i)):et()}catch{return et()}}function Pt(c,i){try{return c?(c.setItem(nt,JSON.stringify(B(i))),!0):!1}catch{return!1}}function Ct(c){try{c?.removeItem(nt)}catch{}}function at(c){let i=B(c),g=h=>Math.min(Lt,Math.max(It,h));return{...i,alamatFs:g(i.kop.fs-8.5),judulLapFs:g(i.kop.fs-4)}}var b=c=>String(Math.round(c*100)/100);function ne(c){let i=at(c);return{"--pa-kop-fs":`${b(i.kop.fs)}pt`,"--pa-kop-lh":b(i.kop.lh),"--pa-alamat-fs":`${b(i.alamatFs)}pt`,"--pa-judul-lap-fs":`${b(i.judulLapFs)}pt`,"--pa-pasien-fs":`${b(i.pasien.fs)}pt`,"--pa-pasien-lh":b(i.pasien.lh),"--pa-judul-fs":`${b(i.judul.fs)}pt`,"--pa-judul-lh":b(i.judul.lh),"--pa-isi-fs":`${b(i.isi.fs)}pt`,"--pa-isi-lh":b(i.isi.lh),"--pa-kesimpulan-fs":`${b(i.kesimpulan.fs)}pt`,"--pa-kesimpulan-lh":b(i.kesimpulan.lh),"--pa-icdo-fs":`${b(i.icdo.fs)}pt`,"--pa-icdo-lh":b(i.icdo.lh),"--pa-catatan-fs":`${b(i.catatan.fs)}pt`,"--pa-catatan-lh":b(i.catatan.lh),"--pa-ttd-fs":`${b(i.ttd.fs)}pt`,"--pa-ttd-lh":b(i.ttd.lh)}}function Rt(c,i){if(c)try{for(let[g,h]of Object.entries(ne(i)))c.setProperty(g,h)}catch{}}var ie=/^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;function V(c){let i=c??"",g=i.match(ie);if(!g)return null;let h=i.slice(g[0].length).trim();return h===""?null:[g[1],h]}wt("paLabPrint",function(){"use strict";function c(){try{At(window)}catch{}try{if(document.head&&!document.getElementById("ext-free-text-style")){let k=document.createElement("style");k.id="ext-free-text-style",k.textContent=St,document.head.appendChild(k)}}catch{}}if(c(),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",c),window.setInterval(c,3e3),!window.location.pathname.includes("/laboratorium/print/"))return;async function g(){let k="ext-pa-print-proc";if(document.documentElement.getAttribute(k))return;document.documentElement.setAttribute(k,"1");let G=()=>{try{return window.localStorage??null}catch{return null}},T=it(G()),X=()=>{try{Rt(document.documentElement.style,T)}catch{}};X();let v=t=>F(t?.textContent||"");function ot(t){return t.replace(/<[^>]+>/g," ")}function zt(t){return t.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi,"H. ")}function F(t){return zt(t).replace(/\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi," ").replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi," ").replace(/\s+/g," ").trim()}function d(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let rt=document.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",_=Array.from(document.querySelectorAll("h1.kop-atas")).map(t=>v(t)).filter(Boolean);for(;_.length<3;)_.push("");let z=[],st=document.querySelector("#head-cetak-logo center, #head-cetak-logo");if(st){let t=document.createElement("div");t.innerHTML=st.innerHTML,t.querySelectorAll("h1").forEach(e=>e.remove()),z=(t.innerHTML||"").split(/<br\s*\/?>/gi).map(e=>t.textContent&&e.replace(/<[^>]+>/g,"").trim()).map(e=>String(e||"").trim()).filter(Boolean)}let q=z.join(" "),lt=t=>{let e=q.match(new RegExp(t+"\\s*:([\\d\\s().+-]+)","i"));return e?e[1].trim():""},pt=lt("telp"),ct=lt("fax"),O=(q.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)||[""])[0],U=(q.match(/https?:\/\/[^\s;,]+/)||[""])[0],j=q.replace(/telp\s*:[\d\s().+-]+/gi,"").replace(/fax\s*:[\d\s().+-]+/gi,"").replace(/website\s*:?/gi,"").replace(/email\s*:?/gi,"");O&&(j=j.split(O).join("")),U&&(j=j.split(U).join("")),j=j.split(/[;]+/).map(t=>t.replace(/\s+/g," ").trim()).filter(Boolean).join(", ").replace(/,\s*,+/g,",").replace(/^[,;\s]+|[,;\s]+$/g,"");let Mt=["Alamat: "+j,pt?"Telp: "+pt:"",ct?"Fax: "+ct:""].filter(Boolean).join(", "),Ht=[O?"Email: "+O:"",U?"Website: "+U:""].filter(Boolean).join(", ");z=[Mt,Ht].filter(Boolean);let W=v(document.querySelector(".head-cetak-instansi"))||"LAPORAN HASIL PEMERIKSAAN",K=[];document.querySelectorAll(".table-outer tr").forEach(t=>{let e=t.querySelectorAll("td");if(e.length>=6){let o=v(e[0]),s=v(e[2]),l=v(e[3]),r=v(e[5]);o&&K.push([o,s]),l&&K.push([l,r])}});let L=["makroskopik","mikroskopik","kesimpulan","icdo","catatan","saran"],y=t=>t.toLowerCase().replace(/0/g,"o").replace(/[^a-z]/g,""),S=[];document.querySelectorAll(".contentlab td").forEach(t=>{let e="",o=!1,s=t.querySelector(".section-title");if(s)e=v(s),o=!0;else{let p=f=>f.split(":")[0].trim();for(let f of Array.from(t.children).slice(0,3)){let u=v(f);if(u&&u.length<=24&&L.includes(y(p(u)))){e=p(u);break}}if(!e){let f=(t.textContent||"").split(`
`).map(u=>u.trim()).find(Boolean)||"";f&&L.includes(y(p(f)))&&(e=p(f))}if(!e)return}let l=document.createElement("div");l.innerHTML=t.innerHTML,l.querySelector(".section-title")?.remove();let r=l.innerHTML.replace(/\r\n?/g,`
`).replace(/<br\s*\/?>[ \t]*\n?/gi,`
`).replace(/\n(?:[ \t]*\n)+/g,"\u2028").split("\u2028").map(p=>p.split(/<br\s*\/?>|\n/).map(f=>F(f.replace(/<[^>]+>/g," "))).filter(Boolean)).filter(p=>p.length),m=[],a=[];r.forEach((p,f)=>{p.forEach((u,I)=>{f>0&&I===0&&m.length&&a.push(m.length),m.push(u)})});let n=m;if(!o&&n.length&&y(n[0])===y(e)){n.shift();for(let p=0;p<a.length;p++)a[p]-=1;for(;a.length&&a[0]<=0;)a.shift()}n.length>1&&!/^[IVXLC]+\.\s/.test(n[0])&&!/:\s*$/.test(n[0])&&n.slice(1).some(p=>/^II\.\s/.test(p))&&(n[0]="I. "+n[0]),e&&S.push({title:e,items:n,para:a})});let Dt=/^catatan\s*:?/i,Gt=/^icd[\s-]*o\b\s*:?/i,Y=[];for(let t of S){let e=[{title:t.title,items:[],para:[]}],o=e[0],s=!1,l=(r,m)=>{o={title:r,items:[],para:[],bare:m},e.push(o),s=!0};if(t.items.forEach((r,m)=>{let a=r.match(Dt),n=a?null:r.match(Gt);if(a){y(o.title)!=="catatan"&&l("Catatan");let p=r.slice(a[0].length).trim();p&&(t.para.includes(m)&&o.para.push(o.items.length),o.items.push(p));return}if(n){y(o.title)!=="icdo"&&l("ICD-0",!0),t.para.includes(m)&&o.para.push(o.items.length),o.items.push(r);return}t.para.includes(m)&&o.para.push(o.items.length),o.items.push(r)}),s)for(let r of e)r.items.length&&Y.push(r);else Y.push(e[0])}S.length=0,S.push(...Y),S.forEach((t,e)=>t._i=e),S.sort((t,e)=>{let o=t._i??0,s=e._i??0,l=L.indexOf(y(t.title)),r=L.indexOf(y(e.title)),m=l===-1?L.length:l,a=r===-1?L.length:r;return m!==a?m-a:o-s});function Ft(t){let e="";t instanceof HTMLSelectElement?e=((t.selectedIndex>=0?t.options[t.selectedIndex]:void 0)?.textContent||t.value||"").trim():(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(e=(t.value||"").trim());let o=(t.getAttribute("name")||"")+" "+(t.getAttribute("id")||""),s=t.getAttribute("placeholder")||"",l=t.closest("tr, .form-group, .form-row, div")?.textContent||"";return{val:e,ctx:(o+" "+s+" "+l).slice(0,300)}}function _t(t,e,o){let s=e.toLowerCase().split(/[^a-z0-9]+/).filter(a=>a.length>=4&&!/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(a));if(!s.length)return"";let l=s.sort((a,n)=>n.length-a.length)[0],r="",m=-1;return t.querySelectorAll("input, textarea, select").forEach(a=>{let{val:n,ctx:p}=Ft(a);if(!n||n===e||!n.toLowerCase().includes(l))return;let f=o.test(p)?2:0;f>m&&(m=f,r=n)}),r}function qt(t,e){return(t.querySelector(e)?.value||"").trim()}async function Ot(t){let e=new URLSearchParams(window.location.search).get("id");if(!e)return;let o=a=>/ket\w*\s*klinis/i.test(a),s=a=>/^dokter/i.test(a)||/^rs\b/i.test(a),l=t.map(([a,n],p)=>({label:a,value:n,idx:p})).filter(a=>s(a.label)?!!a.value:o(a.label));if(!l.length)return;let r=new AbortController,m=window.setTimeout(()=>r.abort(),6e3);try{let a=new URL("/laboratorium/input-hasil/input-hasil-pa?id_lab="+encodeURIComponent(e),window.location.href),n=await fetch(a.toString(),{credentials:"same-origin",signal:r.signal});if(!n.ok){window.console.info("[paPrint] override: fetch input status "+n.status);return}let p=await n.text(),f=new DOMParser().parseFromString(p,"text/html");window.console.info('[paPrint] override: input title="'+(f.title||"").slice(0,60)+'" len='+p.length+" fields="+f.querySelectorAll("input, textarea, select").length);for(let u of l){if(o(u.label)){let tt=qt(f,'#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]'),x=F(ot(tt));window.console.info("[paPrint] override: "+u.label+' cetak="'+u.value+'" input="'+x+'"'),x&&x!==u.value&&(t[u.idx][1]=x);continue}let I=/^dokter/i.test(u.label)?/dokter|pengirim|luar|dalam|rujuk/i:/rs\b|rumah\s*sakit|faskes|asal/i,H=_t(f,u.value,I),C=F(ot(H||""));window.console.info("[paPrint] override: "+u.label+' cetak="'+u.value+'" input="'+C+'"'),C&&C!==u.value&&(t[u.idx][1]=C)}}catch{window.console.info("[paPrint] override: fetch gagal, pakai nilai server")}finally{window.clearTimeout(m)}}await Ot(K).catch(()=>{});let P=Array.from(document.querySelectorAll(".contentlab ~ div table td")).map(t=>v(t)).filter(Boolean),dt=P[0]||"",ut=P[1]||"",N=document.querySelector(".contentlab ~ div table img")?.getAttribute("src")||"",mt=P.find(t=>/^\(.*\)$/.test(t))||P[2]||"",ft=P.find(t=>/^nip\.?/i.test(t))||P[3]||"",gt=document.querySelector('a.tombol[href*="export"]')?.getAttribute("href")||window.location.href+"&export=word",Ut=Array.from(document.body.querySelectorAll("script")),Kt=t=>t.toLowerCase().split(/\s+/).map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" "),M=K.map(([t,e])=>{if(/^(cara|care)\s+peroleh(an)?$/i.test(t.trim()))return["Cara Perolehan",e];if(!/^ruang/i.test(t))return[t,e];let o=e.replace(/^poli\s+.+?-\s*(?=klinik)/i,"").trim()||e,l=o.replace(/^(\S+)\s+-\s*(?=\1\b)/i,"").trim()||o,r=l.split(/\s+-\s*/);if(r.length>=3&&/rawat\s+inap/i.test(r[1])){let m=Kt(r[1].trim()),a=r.slice(2).join(" - ").trim(),n=a?m+" - "+a:m;if(n)return[t,n]}return[t,l]}),Nt=M.map(([t,e])=>'<div class="info-item"><div class="info-label">'+d(t)+'</div><div class="info-colon">:</div><div class="info-value">'+d(e)+"</div></div>").join(""),J=t=>/^icd-?o\s*:/i.test(t)?"<strong>"+d(t)+"</strong>":d(t),$t=t=>/^catatan/i.test(t.trim()),Q=t=>/^saran/i.test(t.trim()),ht=t=>$t(t)||Q(t),Bt=t=>Q(t)?"Saran:":"Catatan:",Z=t=>t.replace(/^(catatan|saran)\s*:?\s*/i,"").replace(/^[-•–—*]+\s*/,"").trim(),Vt=M.find(([t])=>/^no\.?pa/i.test(t))?.[1].replace(/[^a-zA-Z0-9]+/g,"-")||"tanpa-no";function bt(t){if(/^data:/i.test(t))return Promise.resolve(t);let e=new URL(t,window.location.href).href;return fetch(e,{signal:AbortSignal.timeout(8e3),credentials:"same-origin"}).then(o=>{if(!o.ok)throw new Error("img "+o.status);return o.blob()}).then(o=>new Promise((s,l)=>{let r=new FileReader;r.onload=()=>s(String(r.result)),r.onerror=()=>l(r.error),r.readAsDataURL(o)})).catch(()=>e)}async function Xt(){let t=at(T),[e,o]=await Promise.all([bt(rt),N?bt(N):Promise.resolve("")]),s="";for(let n=0;n<M.length;n+=2){let p=M[n],f=M[n+1];s+="<tr><td>"+d(p[0])+"</td><td>:</td><td>"+d(p[1])+"</td>"+(f?"<td>"+d(f[0])+"</td><td>:</td><td>"+d(f[1])+"</td>":"<td></td><td></td><td></td>")+"</tr>"}let l="";for(let n of S){if(ht(n.title)){let x=n.items.length?n.items:["Tidak ada"],D=x.length>1,R=Q(n.title)?"SARAN:":"CATATAN:";l+='<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top" style="font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><b>'+R+'</b></td><td valign="top" style="font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';">'+x.map($=>(D?"- ":"")+"<b>"+d(Z($)||"Tidak ada")+"</b>").join("<br>")+"</td></tr></table>";continue}if(n.bare){n.items.forEach((x,D)=>{l+='<p style="margin:'+(D===0?"12pt":"0")+" 0 6pt 0;font-size:"+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><b>'+d(x.toUpperCase())+"</b></p>"});continue}let p=["makroskopik","mikroskopik","kesimpulan"].includes(y(n.title)),f=y(n.title)==="icdo";l+='<p style="margin:12pt 0 0 0;font-size:'+(f?t.isi.fs:t.judul.fs)+'pt;"><b>'+(p?"<u>":"")+d(n.title.toUpperCase())+(p?"</u>":"")+"</b></p>";let u=y(n.title)==="kesimpulan",I=y(n.title)==="icdo",H=u||I||y(n.title)==="saran",C=u?t.kesimpulan.fs:t.isi.fs,tt=u?t.kesimpulan.lh:t.isi.lh;n.items.forEach((x,D)=>{let R=V(x),$=n.items.length===1&&R!==null&&/^[-•–—*]$/.test(R[0]),kt=$?Z(x)||R[1]:x,Yt=H?"<b>"+d(kt)+"</b>":J(kt),Jt=R&&!$?"margin-left:18pt;text-indent:-18pt;":"";l+='<p style="margin:'+(n.para.includes(D)?"4pt":"0")+" 0 6pt 0;font-size:"+C+"pt;line-height:"+tt+";text-align:justify;"+Jt+'">'+Yt+"</p>"})}let r='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>'+d(W)+'</title></head><body style="font-family:Arial,sans-serif;font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="'+e+'" width="90"></td><td align="center">'+_.slice(0,3).map(n=>'<b style="font-size:'+t.kop.fs+'pt;">'+d(n)+"</b>").join("<br>")+'<br><span style="font-size:'+t.alamatFs+'pt;">'+z.map(n=>d(n)).join("<br>")+'</span></td></tr></table><hr><p align="center" style="font-size:'+t.judulLapFs+'pt;"><b><u>'+d(W.toUpperCase())+'</u></b></p><table border="0" cellspacing="0" cellpadding="2" style="font-size:'+t.pasien.fs+"pt;line-height:"+t.pasien.lh+';">'+s+"</table>"+l+'<table border="0" width="100%" cellspacing="0" cellpadding="0" style="font-size:'+t.ttd.fs+"pt;line-height:"+t.ttd.lh+';"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">'+d(dt)+'</p><p style="margin:0 0 6pt 0;">'+d(ut)+"</p>"+(o?'<p style="margin:0 0 6pt 0;"><img src="'+o+'" width="80" height="80"></p>':"")+'<p style="margin:0 0 6pt 0;"><b>'+d(mt)+'</b></p><p style="margin:0 0 6pt 0;">'+d(ft)+"</p></td></tr></table></body></html>",m=new Blob(["\uFEFF"+r],{type:"application/msword"}),a=document.createElement("a");a.href=URL.createObjectURL(m),a.download="Hasil-PA-"+Vt+".doc",document.body.appendChild(a),a.click(),window.setTimeout(()=>{URL.revokeObjectURL(a.href),a.remove()},4e3)}let Wt=S.map(t=>{if(ht(t.title)){let n=t.items.length?t.items:["Tidak ada"],p=n.length>1;return'<div class="section-catatan"><span class="catatan-label">'+Bt(t.title)+'</span><div class="catatan-list">'+n.map(f=>{let u="<span>"+d(Z(f)||"Tidak ada")+"</span>";return p?'<div class="catatan-item"><span class="catatan-dash">-</span>'+u+"</div>":'<div class="catatan-item">'+u+"</div>"}).join("")+"</div></div>"}let e=y(t.title)==="kesimpulan",o=y(t.title)==="icdo",s=e||o||y(t.title)==="saran",l='<div class="'+(t.bare?"section-isi section-isi-bare":"section-isi")+(e?" section-kesimpulan":"")+(o&&!t.bare?" section-icdo":"")+'">'+t.items.map((n,p)=>{let f=t.para.includes(p)?" item-para":"",u=V(n),I=!u&&/:\s*$/.test(n)&&p+1<t.items.length&&!!V(t.items[p+1])&&t.para.includes(p+1);if(u&&!(t.items.length===1&&/^[-•–—*]$/.test(u[0]))){let H=s?"<strong>"+d(u[1])+"</strong>":J(u[1]);return'<div class="item-list has-marker'+f+'"><span class="item-marker">'+(s?"<strong>"+d(u[0])+"</strong>":d(u[0]))+"</span><span>"+H+"</span></div>"}return'<div class="item-list'+f+(I?" item-intro":"")+'">'+(s?"<strong>"+d(n)+"</strong>":J(n))+"</div>"}).join("")+"</div>";if(t.bare)return l;let r=y(t.title),m=["makroskopik","mikroskopik","kesimpulan"].includes(r)?" u":"",a=r==="icdo"?" i":"";return'<div class="section-judul'+m+a+'">'+d(t.title)+"</div>"+l}).join("");document.body.innerHTML='<a href="'+d(gt)+'" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><button type="button" class="no-print" id="btn-typo" title="Atur font & spasi cetakan">\u2699\uFE0F Gaya</button><div class="t-typo no-print" id="ext-pa-typo" hidden></div><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="'+d(rt)+'" alt="Logo"></div><div class="kop-text">'+_.slice(0,3).map(t=>'<h1 class="kop-atas">'+d(t)+"</h1>").join("")+'<div class="kop-alamat">'+z.map(t=>d(t)).join("<br>")+'</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">'+d(W)+'</div><div class="patient-info-container">'+Nt+'</div><div class="hasil-pa">'+Wt+'</div><div class="ttd-container clearfix"><div class="ttd-box"><p>'+d(dt)+"</p><p>"+d(ut)+"</p>"+(N?'<img src="'+d(N)+'" alt="QR Code TTD">':"")+'<p style="font-weight: bold; margin-bottom: 0;">'+d(mt)+'</p><p style="margin-top: 2px;">'+d(ft)+"</p></div></div></div>",Ut.forEach(t=>document.body.appendChild(t)),document.querySelector("#btn-word")?.addEventListener("click",t=>{t.preventDefault(),Xt().catch(()=>{window.location.href=gt})});let yt=()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=(s,l,r,m,a,n,p,f)=>"<label>"+d(r)+'<input type="range" data-g="'+d(s)+'" data-f="'+l+'" min="'+m+'" max="'+a+'" step="'+n+'" value="'+p+'"><output data-o="'+d(s+"-"+l)+'">'+d(String(p)+f)+"</output></label>";t.innerHTML="<h4>Gaya Cetakan PA</h4>"+jt.map(s=>'<div class="t-typo-group"><strong>'+d(s.label)+'</strong><div class="t-typo-row">'+e(s.key,"fs","Font (pt)",4,20,.5,T[s.key].fs,"pt")+e(s.key,"lh","Spasi baris",.5,2.5,.05,T[s.key].lh,"")+"</div></div>").join("")+'<div class="t-typo-actions"><button type="button" data-act="save" class="primary">Simpan</button><button type="button" data-act="reset">Reset</button></div><div class="t-typo-note" data-note></div>',t.querySelectorAll('input[type="range"]').forEach(s=>{let l=s;l.addEventListener("input",()=>{let r=l.dataset.g,m=l.dataset.f;if(!r||!m||!T[r])return;T[r][m]=Number(l.value),X();let a=t.querySelector(`output[data-o="${r}-${m}"]`);a&&(a.textContent=l.value+(m==="fs"?"pt":""))})});let o=t.querySelector("[data-note]");t.querySelector('[data-act="save"]')?.addEventListener("click",()=>{let s=Pt(G(),T);o&&(o.textContent=s?"Tersimpan \u2713":"Gagal menyimpan")}),t.querySelector('[data-act="reset"]')?.addEventListener("click",()=>{if(Ct(G()),T=it(G()),X(),yt(),o){let s=t.querySelector("[data-note]");s&&(s.textContent="Kembali ke default \u2713")}})};document.querySelector("#btn-typo")?.addEventListener("click",()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=t.hidden;e&&yt(),t.hidden=!e}),document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(t=>t.remove());let xt="ext-pa-print-style";if(!document.getElementById(xt)){let t=document.createElement("style");t.id=xt,t.textContent=`
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
        /* Hanging indent: penanda (I., II., VII., ...) di kolom kiri tetap
           (posisi absolut), teks paragraf mulai di indent tetap sehingga
           baris lanjutan & antar item sejajar meski lebar penanda beda. */
        .item-list.has-marker {
            position: relative;
            padding-left: 2ch;
        }

        .item-marker {
            position: absolute;
            left: 0;
            top: 0;
            white-space: nowrap;
        }

        /* Item tanpa penomoran dalam section yang punya penomoran (mis.
           "Diterima 2 buah jaringan..." di Makroskopik) ikut terindent
           agar sejajar dengan teks setelah Romawi. */
        .section-isi:has(.item-list.has-marker) .item-list:not(.has-marker) {
            padding-left: 2ch;
        }

        /* Baris pengantar yang dipisah baris kosong \u2192 rata kiri. */
        .section-isi:has(.item-list.has-marker) .item-list.item-intro {
            padding-left: 0;
        }

        .item-list {
            margin-bottom: 6px;
        }

        /* Awal paragraf baru (baris kosong di input): gap rapat. */
        .item-list.item-para {
            margin-top: 4px;
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
