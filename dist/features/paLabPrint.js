"use strict";var __morbis_feature=(()=>{var ht="extensionConfig";function Nt(l,n,f){let h=n?.features?.[l];if(!h)return!0;if(h.enabled===!1)return!1;let w=f??n?.currentRole??"admin";if(w==="admin")return!0;let k=h.allowedRoles;return!Array.isArray(k)||k.length===0?!0:k.includes(w)}async function Bt(l){try{let f=(await chrome.storage.sync.get(ht))?.[ht]??null;return Nt(l,f)}catch{return!0}}function bt(l,n){Bt(l).then(f=>{if(f)try{n()}catch(h){console.error(`[featureGate:${l}] gagal jalan:`,h)}})}var yt="ext-free-text-noop",xt='input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select{text-transform:none!important}';function kt(l){try{let n=l.toUpper;if(typeof n=="function"&&n[yt]===!0)return!0;let f=function(h){return h?.value??""};f[yt]=!0;try{Object.defineProperty(l,"toUpper",{value:f,writable:!0,configurable:!0})}catch{l.toUpper=f}return!0}catch{return!1}}var Y="ext-pa-typo",wt=[{key:"kop",label:"Kop Surat"},{key:"pasien",label:"Data Pasien"},{key:"judul",label:"Judul Bagian Isi"},{key:"isi",label:"Isi"},{key:"kesimpulan",label:"Kesimpulan"},{key:"icdo",label:"ICD-O"},{key:"catatan",label:"Catatan"},{key:"ttd",label:"TTD"}],A={kop:{fs:16,lh:1.2},pasien:{fs:4,lh:1},judul:{fs:6,lh:1.2},isi:{fs:5,lh:1.25},kesimpulan:{fs:5,lh:1.25},icdo:{fs:6,lh:1.2},catatan:{fs:5,lh:1.25},ttd:{fs:6,lh:1.2}},Tt=4,Et=24,$t=.5,Vt=2.5;function vt(l,n,f,h){let w=typeof l=="number"?l:Number(l);return Number.isFinite(w)?Math.min(h,Math.max(f,w)):n}function S(l,n){let f=l??{};return{fs:vt(f.fs,n.fs,Tt,Et),lh:vt(f.lh,n.lh,$t,Vt)}}function K(l){let n=l??{};return{kop:S(n.kop,A.kop),pasien:S(n.pasien,A.pasien),judul:S(n.judul,A.judul),isi:S(n.isi,A.isi),kesimpulan:S(n.kesimpulan,A.kesimpulan),icdo:S(n.icdo,A.icdo),catatan:S(n.catatan,A.catatan),ttd:S(n.ttd,A.ttd)}}function W(){return K(null)}function J(l){try{if(!l)return W();let n=l.getItem(Y);return n?K(JSON.parse(n)):W()}catch{return W()}}function At(l,n){try{return l?(l.setItem(Y,JSON.stringify(K(n))),!0):!1}catch{return!1}}function St(l){try{l?.removeItem(Y)}catch{}}function Q(l){let n=K(l),f=h=>Math.min(Et,Math.max(Tt,h));return{...n,alamatFs:f(n.kop.fs-8.5),judulLapFs:f(n.kop.fs-4)}}var b=l=>String(Math.round(l*100)/100);function Xt(l){let n=Q(l);return{"--pa-kop-fs":`${b(n.kop.fs)}pt`,"--pa-kop-lh":b(n.kop.lh),"--pa-alamat-fs":`${b(n.alamatFs)}pt`,"--pa-judul-lap-fs":`${b(n.judulLapFs)}pt`,"--pa-pasien-fs":`${b(n.pasien.fs)}pt`,"--pa-pasien-lh":b(n.pasien.lh),"--pa-judul-fs":`${b(n.judul.fs)}pt`,"--pa-judul-lh":b(n.judul.lh),"--pa-isi-fs":`${b(n.isi.fs)}pt`,"--pa-isi-lh":b(n.isi.lh),"--pa-kesimpulan-fs":`${b(n.kesimpulan.fs)}pt`,"--pa-kesimpulan-lh":b(n.kesimpulan.lh),"--pa-icdo-fs":`${b(n.icdo.fs)}pt`,"--pa-icdo-lh":b(n.icdo.lh),"--pa-catatan-fs":`${b(n.catatan.fs)}pt`,"--pa-catatan-lh":b(n.catatan.lh),"--pa-ttd-fs":`${b(n.ttd.fs)}pt`,"--pa-ttd-lh":b(n.ttd.lh)}}function jt(l,n){if(l)try{for(let[f,h]of Object.entries(Xt(n)))l.setProperty(f,h)}catch{}}var Wt=/^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;function Z(l){let n=l??"",f=n.match(Wt);if(!f)return null;let h=n.slice(f[0].length).trim();return h===""?null:[f[1],h]}bt("paLabPrint",function(){"use strict";function l(){try{kt(window)}catch{}try{if(document.head&&!document.getElementById("ext-free-text-style")){let k=document.createElement("style");k.id="ext-free-text-style",k.textContent=xt,document.head.appendChild(k)}}catch{}}if(l(),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",l),window.setInterval(l,3e3),!window.location.pathname.includes("/laboratorium/print/"))return;async function f(){let k="ext-pa-print-proc";if(document.documentElement.getAttribute(k))return;document.documentElement.setAttribute(k,"1");let D=()=>{try{return window.localStorage??null}catch{return null}},T=J(D()),N=()=>{try{jt(document.documentElement.style,T)}catch{}};N();let v=t=>G(t?.textContent||"");function tt(t){return t.replace(/<[^>]+>/g," ")}function Lt(t){return t.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi,"H. ")}function G(t){return Lt(t).replace(/\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi," ").replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi," ").replace(/\s+/g," ").trim()}function c(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let et=document.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",F=Array.from(document.querySelectorAll("h1.kop-atas")).map(t=>v(t)).filter(Boolean);for(;F.length<3;)F.push("");let I=[],nt=document.querySelector("#head-cetak-logo center, #head-cetak-logo");if(nt){let t=document.createElement("div");t.innerHTML=nt.innerHTML,t.querySelectorAll("h1").forEach(e=>e.remove()),I=(t.innerHTML||"").split(/<br\s*\/?>/gi).map(e=>t.textContent&&e.replace(/<[^>]+>/g,"").trim()).map(e=>String(e||"").trim()).filter(Boolean)}let H=I.join(" "),at=t=>{let e=H.match(new RegExp(t+"\\s*:([\\d\\s().+-]+)","i"));return e?e[1].trim():""},it=at("telp"),ot=at("fax"),_=(H.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)||[""])[0],q=(H.match(/https?:\/\/[^\s;,]+/)||[""])[0],j=H.replace(/telp\s*:[\d\s().+-]+/gi,"").replace(/fax\s*:[\d\s().+-]+/gi,"").replace(/website\s*:?/gi,"").replace(/email\s*:?/gi,"");_&&(j=j.split(_).join("")),q&&(j=j.split(q).join("")),j=j.split(/[;]+/).map(t=>t.replace(/\s+/g," ").trim()).filter(Boolean).join(", ").replace(/,\s*,+/g,",").replace(/^[,;\s]+|[,;\s]+$/g,"");let Ct=["Alamat: "+j,it?"Telp: "+it:"",ot?"Fax: "+ot:""].filter(Boolean).join(", "),Pt=[_?"Email: "+_:"",q?"Website: "+q:""].filter(Boolean).join(", ");I=[Ct,Pt].filter(Boolean);let B=v(document.querySelector(".head-cetak-instansi"))||"LAPORAN HASIL PEMERIKSAAN",U=[];document.querySelectorAll(".table-outer tr").forEach(t=>{let e=t.querySelectorAll("td");if(e.length>=6){let r=v(e[0]),p=v(e[2]),s=v(e[3]),o=v(e[5]);r&&U.push([r,p]),s&&U.push([s,o])}});let C=["makroskopik","mikroskopik","kesimpulan","icdo","catatan","saran"],y=t=>t.toLowerCase().replace(/0/g,"o").replace(/[^a-z]/g,""),E=[];document.querySelectorAll(".contentlab td").forEach(t=>{let e="",r=!1,p=t.querySelector(".section-title");if(p)e=v(p),r=!0;else{let d=m=>m.split(":")[0].trim();for(let m of Array.from(t.children).slice(0,3)){let g=v(m);if(g&&g.length<=24&&C.includes(y(d(g)))){e=d(g);break}}if(!e){let m=(t.textContent||"").split(`
`).map(g=>g.trim()).find(Boolean)||"";m&&C.includes(y(d(m)))&&(e=d(m))}if(!e)return}let s=document.createElement("div");s.innerHTML=t.innerHTML,s.querySelector(".section-title")?.remove();let o=s.innerHTML.replace(/\r\n?/g,`
`).replace(/<br\s*\/?>[ \t]*\n?/gi,`
`).replace(/\n(?:[ \t]*\n)+/g,"\u2028").split("\u2028").map(d=>d.split(/<br\s*\/?>|\n/).map(m=>G(m.replace(/<[^>]+>/g," "))).filter(Boolean)).filter(d=>d.length),u=[],i=[];o.forEach((d,m)=>{d.forEach((g,M)=>{m>0&&M===0&&u.length&&i.push(u.length),u.push(g)})});let a=u;if(!r&&a.length&&y(a[0])===y(e)){a.shift();for(let d=0;d<i.length;d++)i[d]-=1;for(;i.length&&i[0]<=0;)i.shift()}a.length>1&&!/^[IVXLC]+\.\s/.test(a[0])&&a.slice(1).some(d=>/^II\.\s/.test(d))&&(a[0]="I. "+a[0]),e&&E.push({title:e,items:a,para:i})});let Rt=/^catatan\s*:?/i,It=/^icd[\s-]*o\b\s*:?/i,$=[];for(let t of E){let e=[{title:t.title,items:[],para:[]}],r=e[0],p=!1,s=(o,u)=>{r={title:o,items:[],para:[],bare:u},e.push(r),p=!0};if(t.items.forEach((o,u)=>{let i=o.match(Rt),a=i?null:o.match(It);if(i){y(r.title)!=="catatan"&&s("Catatan");let d=o.slice(i[0].length).trim();d&&(t.para.includes(u)&&r.para.push(r.items.length),r.items.push(d));return}if(a){y(r.title)!=="icdo"&&s("ICD-0",!0),t.para.includes(u)&&r.para.push(r.items.length),r.items.push(o);return}t.para.includes(u)&&r.para.push(r.items.length),r.items.push(o)}),p)for(let o of e)o.items.length&&$.push(o);else $.push(e[0])}E.length=0,E.push(...$),E.forEach((t,e)=>t._i=e),E.sort((t,e)=>{let r=t._i??0,p=e._i??0,s=C.indexOf(y(t.title)),o=C.indexOf(y(e.title)),u=s===-1?C.length:s,i=o===-1?C.length:o;return u!==i?u-i:r-p});function zt(t){let e="";t instanceof HTMLSelectElement?e=((t.selectedIndex>=0?t.options[t.selectedIndex]:void 0)?.textContent||t.value||"").trim():(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(e=(t.value||"").trim());let r=(t.getAttribute("name")||"")+" "+(t.getAttribute("id")||""),p=t.getAttribute("placeholder")||"",s=t.closest("tr, .form-group, .form-row, div")?.textContent||"";return{val:e,ctx:(r+" "+p+" "+s).slice(0,300)}}function Mt(t,e,r){let p=e.toLowerCase().split(/[^a-z0-9]+/).filter(i=>i.length>=4&&!/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(i));if(!p.length)return"";let s=p.sort((i,a)=>a.length-i.length)[0],o="",u=-1;return t.querySelectorAll("input, textarea, select").forEach(i=>{let{val:a,ctx:d}=zt(i);if(!a||a===e||!a.toLowerCase().includes(s))return;let m=r.test(d)?2:0;m>u&&(u=m,o=a)}),o}function Dt(t,e){return(t.querySelector(e)?.value||"").trim()}async function Gt(t){let e=new URLSearchParams(window.location.search).get("id");if(!e)return;let r=i=>/ket\w*\s*klinis/i.test(i),p=i=>/^dokter/i.test(i)||/^rs\b/i.test(i),s=t.map(([i,a],d)=>({label:i,value:a,idx:d})).filter(i=>p(i.label)?!!i.value:r(i.label));if(!s.length)return;let o=new AbortController,u=window.setTimeout(()=>o.abort(),6e3);try{let i=new URL("/laboratorium/input-hasil/input-hasil-pa?id_lab="+encodeURIComponent(e),window.location.href),a=await fetch(i.toString(),{credentials:"same-origin",signal:o.signal});if(!a.ok){window.console.info("[paPrint] override: fetch input status "+a.status);return}let d=await a.text(),m=new DOMParser().parseFromString(d,"text/html");window.console.info('[paPrint] override: input title="'+(m.title||"").slice(0,60)+'" len='+d.length+" fields="+m.querySelectorAll("input, textarea, select").length);for(let g of s){if(r(g.label)){let L=Dt(m,'#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]'),R=G(tt(L));window.console.info("[paPrint] override: "+g.label+' cetak="'+g.value+'" input="'+R+'"'),R&&R!==g.value&&(t[g.idx][1]=R);continue}let M=/^dokter/i.test(g.label)?/dokter|pengirim|luar|dalam|rujuk/i:/rs\b|rumah\s*sakit|faskes|asal/i,X=Mt(m,g.value,M),x=G(tt(X||""));window.console.info("[paPrint] override: "+g.label+' cetak="'+g.value+'" input="'+x+'"'),x&&x!==g.value&&(t[g.idx][1]=x)}}catch{window.console.info("[paPrint] override: fetch gagal, pakai nilai server")}finally{window.clearTimeout(u)}}await Gt(U).catch(()=>{});let P=Array.from(document.querySelectorAll(".contentlab ~ div table td")).map(t=>v(t)).filter(Boolean),rt=P[0]||"",st=P[1]||"",O=document.querySelector(".contentlab ~ div table img")?.getAttribute("src")||"",lt=P.find(t=>/^\(.*\)$/.test(t))||P[2]||"",pt=P.find(t=>/^nip\.?/i.test(t))||P[3]||"",ct=document.querySelector('a.tombol[href*="export"]')?.getAttribute("href")||window.location.href+"&export=word",Ft=Array.from(document.body.querySelectorAll("script")),Ht=t=>t.toLowerCase().split(/\s+/).map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" "),z=U.map(([t,e])=>{if(!/^ruang/i.test(t))return[t,e];let r=e.replace(/^poli\s+.+?-\s*(?=klinik)/i,"").trim()||e,s=r.replace(/^(\S+)\s+-\s*(?=\1\b)/i,"").trim()||r,o=s.split(/\s+-\s*/);if(o.length>=3&&/rawat\s+inap/i.test(o[1])){let u=Ht(o[1].trim()),i=o.slice(2).join(" - ").trim(),a=i?u+" - "+i:u;if(a)return[t,a]}return[t,s]}),_t=z.map(([t,e])=>'<div class="info-item"><div class="info-label">'+c(t)+'</div><div class="info-colon">:</div><div class="info-value">'+c(e)+"</div></div>").join(""),V=t=>/^icd-?o\s*:/i.test(t)?"<strong>"+c(t)+"</strong>":c(t),dt=t=>/^catatan/i.test(t.trim()),ut=t=>t.replace(/^catatan\s*:?\s*/i,"").replace(/^[-•–—*]+\s*/,"").trim(),qt=z.find(([t])=>/^no\.?pa/i.test(t))?.[1].replace(/[^a-zA-Z0-9]+/g,"-")||"tanpa-no";function mt(t){if(/^data:/i.test(t))return Promise.resolve(t);let e=new URL(t,window.location.href).href;return fetch(e,{signal:AbortSignal.timeout(8e3),credentials:"same-origin"}).then(r=>{if(!r.ok)throw new Error("img "+r.status);return r.blob()}).then(r=>new Promise((p,s)=>{let o=new FileReader;o.onload=()=>p(String(o.result)),o.onerror=()=>s(o.error),o.readAsDataURL(r)})).catch(()=>e)}async function Ut(){let t=Q(T),[e,r]=await Promise.all([mt(et),O?mt(O):Promise.resolve("")]),p="";for(let a=0;a<z.length;a+=2){let d=z[a],m=z[a+1];p+="<tr><td>"+c(d[0])+"</td><td>:</td><td>"+c(d[1])+"</td>"+(m?"<td>"+c(m[0])+"</td><td>:</td><td>"+c(m[1])+"</td>":"<td></td><td></td><td></td>")+"</tr>"}let s="";for(let a of E){if(dt(a.title)){let x=a.items.length?a.items:["Tidak ada"];s+='<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top" style="font-size:'+t.judul.fs+'pt"><b><u>CATATAN:</u></b></td><td valign="top" style="font-size:'+t.catatan.fs+"pt;line-height:"+t.catatan.lh+';">'+x.map(L=>"- <b>"+c(ut(L)||"Tidak ada")+"</b>").join("<br>")+"</td></tr></table>";continue}if(a.bare){a.items.forEach((x,L)=>{s+='<p style="margin:'+(L===0?"12pt":"0")+" 0 6pt 0;font-size:"+t.icdo.fs+"pt;line-height:"+t.icdo.lh+';"><b>'+c(x.toUpperCase())+"</b></p>"});continue}s+='<p style="margin:12pt 0 0 0;font-size:'+t.judul.fs+'pt;"><b><u>'+c(a.title.toUpperCase())+"</u></b></p>";let d=y(a.title)==="kesimpulan",m=y(a.title)==="icdo",g=d||m||y(a.title)==="saran",M=d?t.kesimpulan.fs:m?t.icdo.fs:t.isi.fs,X=d?t.kesimpulan.lh:m?t.icdo.lh:t.isi.lh;a.items.forEach((x,L)=>{let R=g?"<b>"+c(x)+"</b>":V(x),Kt=Z(x)?"margin-left:18pt;text-indent:-18pt;":"";s+='<p style="margin:'+(a.para.includes(L)?"14pt":"0")+" 0 6pt 0;font-size:"+M+"pt;line-height:"+X+";text-align:justify;"+Kt+'">'+R+"</p>"})}let o='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>'+c(B)+'</title></head><body style="font-family:Arial,sans-serif;font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="'+e+'" width="90"></td><td align="center">'+F.slice(0,3).map(a=>'<b style="font-size:'+t.kop.fs+'pt;">'+c(a)+"</b>").join("<br>")+'<br><span style="font-size:'+t.alamatFs+'pt;">'+I.map(a=>c(a)).join("<br>")+'</span></td></tr></table><hr><p align="center" style="font-size:'+t.judulLapFs+'pt;"><b><u>'+c(B.toUpperCase())+'</u></b></p><table border="0" cellspacing="0" cellpadding="2" style="font-size:'+t.pasien.fs+"pt;line-height:"+t.pasien.lh+';">'+p+"</table>"+s+'<table border="0" width="100%" cellspacing="0" cellpadding="0" style="font-size:'+t.ttd.fs+"pt;line-height:"+t.ttd.lh+';"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">'+c(rt)+'</p><p style="margin:0 0 6pt 0;">'+c(st)+"</p>"+(r?'<p style="margin:0 0 6pt 0;"><img src="'+r+'" width="80" height="80"></p>':"")+'<p style="margin:0 0 6pt 0;"><b>'+c(lt)+'</b></p><p style="margin:0 0 6pt 0;">'+c(pt)+"</p></td></tr></table></body></html>",u=new Blob(["\uFEFF"+o],{type:"application/msword"}),i=document.createElement("a");i.href=URL.createObjectURL(u),i.download="Hasil-PA-"+qt+".doc",document.body.appendChild(i),i.click(),window.setTimeout(()=>{URL.revokeObjectURL(i.href),i.remove()},4e3)}let Ot=E.map(t=>{if(dt(t.title))return'<div class="section-catatan"><span class="catatan-label">Catatan:</span><div class="catatan-list">'+(t.items.length?t.items:["Tidak ada"]).map(u=>'<div class="catatan-item"><span class="catatan-dash">-</span><span>'+c(ut(u)||"Tidak ada")+"</span></div>").join("")+"</div></div>";let e=y(t.title)==="kesimpulan",r=y(t.title)==="icdo",p=e||r||y(t.title)==="saran",s='<div class="'+(t.bare?"section-isi section-isi-bare":"section-isi")+(e?" section-kesimpulan":"")+(r&&!t.bare?" section-icdo":"")+'">'+t.items.map((o,u)=>{let i=t.para.includes(u)?" item-para":"",a=Z(o);if(a){let d=p?"<strong>"+c(a[1])+"</strong>":V(a[1]);return'<div class="item-list has-marker'+i+'"><span class="item-marker">'+c(a[0])+"</span><span>"+d+"</span></div>"}return'<div class="item-list'+i+'">'+(p?"<strong>"+c(o)+"</strong>":V(o))+"</div>"}).join("")+"</div>";return t.bare?s:'<div class="section-judul">'+c(t.title)+"</div>"+s}).join("");document.body.innerHTML='<a href="'+c(ct)+'" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><button type="button" class="no-print" id="btn-typo" title="Atur font & spasi cetakan">\u2699\uFE0F Gaya</button><div class="t-typo no-print" id="ext-pa-typo" hidden></div><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="'+c(et)+'" alt="Logo"></div><div class="kop-text">'+F.slice(0,3).map(t=>'<h1 class="kop-atas">'+c(t)+"</h1>").join("")+'<div class="kop-alamat">'+I.map(t=>c(t)).join("<br>")+'</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">'+c(B)+'</div><div class="patient-info-container">'+_t+'</div><div class="hasil-pa">'+Ot+'</div><div class="ttd-container clearfix"><div class="ttd-box"><p>'+c(rt)+"</p><p>"+c(st)+"</p>"+(O?'<img src="'+c(O)+'" alt="QR Code TTD">':"")+'<p style="font-weight: bold; margin-bottom: 0;">'+c(lt)+'</p><p style="margin-top: 2px;">'+c(pt)+"</p></div></div></div>",Ft.forEach(t=>document.body.appendChild(t)),document.querySelector("#btn-word")?.addEventListener("click",t=>{t.preventDefault(),Ut().catch(()=>{window.location.href=ct})});let ft=()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=(p,s,o,u,i,a,d,m)=>"<label>"+c(o)+'<input type="range" data-g="'+c(p)+'" data-f="'+s+'" min="'+u+'" max="'+i+'" step="'+a+'" value="'+d+'"><output data-o="'+c(p+"-"+s)+'">'+c(String(d)+m)+"</output></label>";t.innerHTML="<h4>Gaya Cetakan PA</h4>"+wt.map(p=>'<div class="t-typo-group"><strong>'+c(p.label)+'</strong><div class="t-typo-row">'+e(p.key,"fs","Font (pt)",4,20,.5,T[p.key].fs,"pt")+e(p.key,"lh","Spasi baris",.5,2.5,.05,T[p.key].lh,"")+"</div></div>").join("")+'<div class="t-typo-actions"><button type="button" data-act="save" class="primary">Simpan</button><button type="button" data-act="reset">Reset</button></div><div class="t-typo-note" data-note></div>',t.querySelectorAll('input[type="range"]').forEach(p=>{let s=p;s.addEventListener("input",()=>{let o=s.dataset.g,u=s.dataset.f;if(!o||!u||!T[o])return;T[o][u]=Number(s.value),N();let i=t.querySelector(`output[data-o="${o}-${u}"]`);i&&(i.textContent=s.value+(u==="fs"?"pt":""))})});let r=t.querySelector("[data-note]");t.querySelector('[data-act="save"]')?.addEventListener("click",()=>{let p=At(D(),T);r&&(r.textContent=p?"Tersimpan \u2713":"Gagal menyimpan")}),t.querySelector('[data-act="reset"]')?.addEventListener("click",()=>{if(St(D()),T=J(D()),N(),ft(),r){let p=t.querySelector("[data-note]");p&&(p.textContent="Kembali ke default \u2713")}})};document.querySelector("#btn-typo")?.addEventListener("click",()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=t.hidden;e&&ft(),t.hidden=!e}),document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(t=>t.remove());let gt="ext-pa-print-style";if(!document.getElementById(gt)){let t=document.createElement("style");t.id=gt,t.textContent=`
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
            text-decoration: underline;
            text-transform: uppercase;
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
           grup font & spasi sendiri, terpisah dari Isi, dan selalu bold.
           Varian tanpa judul memakai .section-isi-bare (grup ICD-O sama). */
        .section-icdo {
            font-size: var(--pa-icdo-fs, 6pt);
            font-weight: bold;
            line-height: var(--pa-icdo-lh, 1.2);
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
           seperti section-judul (minus garis bawah), tapi ukuran font
           dan spasi baris punya grup sendiri (\u2699\uFE0F Gaya \u2192 ICD-O). */
        .section-isi-bare {
            margin: 12px 0 0;
            padding: 0;
            font-size: var(--pa-icdo-fs, 6pt);
            font-weight: bold;
            line-height: var(--pa-icdo-lh, 1.2);
            text-transform: uppercase;
        }

        .section-isi-bare .item-list {
            margin: 0;
            padding: 0;
        }

        /* CATATAN: label + list gantung \u2014 baris lanjutan rata di bawah
           dash pertama ("Catatan: - \u2026" lalu "- \u2026" sejajar di bawahnya).
           Label tetap grup Judul Bagian Isi (heading); isi Catatan punya
           grup font & spasi baris sendiri (\u2699\uFE0F Gaya \u2192 Catatan) dan
           seluruh isinya bold (permintaan user). */
        .section-catatan {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 12px;
            font-size: var(--pa-catatan-fs, 5pt);
            font-weight: bold;
            line-height: var(--pa-catatan-lh, 1.25);
            text-align: justify;
        }

        .catatan-label {
            flex-shrink: 0;
            font-weight: bold;
            font-size: var(--pa-judul-fs, 6pt);
            line-height: var(--pa-judul-lh, 1.2);
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
      `,document.head.appendChild(t)}}let h=Date.now(),w=window.setInterval(()=>{document.documentElement.getAttribute("data-ext-pa-print")==="1"?(window.clearInterval(w),f().catch(()=>{})):Date.now()-h>5e3&&window.clearInterval(w)},200)});})();
