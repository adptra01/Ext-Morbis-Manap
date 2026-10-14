"use strict";var __morbis_feature=(()=>{var ht="extensionConfig";function Kt(p,i,f){let h=i?.features?.[p];if(!h)return!0;if(h.enabled===!1)return!1;let w=f??i?.currentRole??"admin";if(w==="admin")return!0;let x=h.allowedRoles;return!Array.isArray(x)||x.length===0?!0:x.includes(w)}async function Nt(p){try{let f=(await chrome.storage.sync.get(ht))?.[ht]??null;return Kt(p,f)}catch{return!0}}function bt(p,i){Nt(p).then(f=>{if(f)try{i()}catch(h){console.error(`[featureGate:${p}] gagal jalan:`,h)}})}var yt="ext-free-text-noop",xt='input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select{text-transform:none!important}';function kt(p){try{let i=p.toUpper;if(typeof i=="function"&&i[yt]===!0)return!0;let f=function(h){return h?.value??""};f[yt]=!0;try{Object.defineProperty(p,"toUpper",{value:f,writable:!0,configurable:!0})}catch{p.toUpper=f}return!0}catch{return!1}}var W="ext-pa-typo",wt=[{key:"kop",label:"Kop Surat"},{key:"pasien",label:"Data Pasien"},{key:"judul",label:"Judul Bagian Isi"},{key:"isi",label:"Isi"},{key:"kesimpulan",label:"Kesimpulan"},{key:"ttd",label:"TTD"}],C={kop:{fs:16,lh:1.2},pasien:{fs:4,lh:1},judul:{fs:6,lh:1.2},isi:{fs:5,lh:1.25},kesimpulan:{fs:5,lh:1.25},ttd:{fs:6,lh:1.2}},Tt=4,Et=24,Bt=.5,$t=2.5;function vt(p,i,f,h){let w=typeof p=="number"?p:Number(p);return Number.isFinite(w)?Math.min(h,Math.max(f,w)):i}function I(p,i){let f=p??{};return{fs:vt(f.fs,i.fs,Tt,Et),lh:vt(f.lh,i.lh,Bt,$t)}}function K(p){let i=p??{};return{kop:I(i.kop,C.kop),pasien:I(i.pasien,C.pasien),judul:I(i.judul,C.judul),isi:I(i.isi,C.isi),kesimpulan:I(i.kesimpulan,C.kesimpulan),ttd:I(i.ttd,C.ttd)}}function X(){return K(null)}function Y(p){try{if(!p)return X();let i=p.getItem(W);return i?K(JSON.parse(i)):X()}catch{return X()}}function At(p,i){try{return p?(p.setItem(W,JSON.stringify(K(i))),!0):!1}catch{return!1}}function St(p){try{p?.removeItem(W)}catch{}}function J(p){let i=K(p),f=h=>Math.min(Et,Math.max(Tt,h));return{...i,alamatFs:f(i.kop.fs-8.5),judulLapFs:f(i.kop.fs-4)}}var b=p=>String(Math.round(p*100)/100);function Vt(p){let i=J(p);return{"--pa-kop-fs":`${b(i.kop.fs)}pt`,"--pa-kop-lh":b(i.kop.lh),"--pa-alamat-fs":`${b(i.alamatFs)}pt`,"--pa-judul-lap-fs":`${b(i.judulLapFs)}pt`,"--pa-pasien-fs":`${b(i.pasien.fs)}pt`,"--pa-pasien-lh":b(i.pasien.lh),"--pa-judul-fs":`${b(i.judul.fs)}pt`,"--pa-judul-lh":b(i.judul.lh),"--pa-isi-fs":`${b(i.isi.fs)}pt`,"--pa-isi-lh":b(i.isi.lh),"--pa-kesimpulan-fs":`${b(i.kesimpulan.fs)}pt`,"--pa-kesimpulan-lh":b(i.kesimpulan.lh),"--pa-ttd-fs":`${b(i.ttd.fs)}pt`,"--pa-ttd-lh":b(i.ttd.lh)}}function jt(p,i){if(p)try{for(let[f,h]of Object.entries(Vt(i)))p.setProperty(f,h)}catch{}}var Xt=/^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;function Q(p){let i=p??"",f=i.match(Xt);if(!f)return null;let h=i.slice(f[0].length).trim();return h===""?null:[f[1],h]}bt("paLabPrint",function(){"use strict";function p(){try{kt(window)}catch{}try{if(document.head&&!document.getElementById("ext-free-text-style")){let x=document.createElement("style");x.id="ext-free-text-style",x.textContent=xt,document.head.appendChild(x)}}catch{}}if(p(),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",p),window.setInterval(p,3e3),!window.location.pathname.includes("/laboratorium/print/"))return;async function f(){let x="ext-pa-print-proc";if(document.documentElement.getAttribute(x))return;document.documentElement.setAttribute(x,"1");let F=()=>{try{return window.localStorage??null}catch{return null}},T=Y(F()),N=()=>{try{jt(document.documentElement.style,T)}catch{}};N();let v=t=>H(t?.textContent||"");function Z(t){return t.replace(/<[^>]+>/g," ")}function Lt(t){return t.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi,"H. ")}function H(t){return Lt(t).replace(/\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi," ").replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi," ").replace(/\s+/g," ").trim()}function c(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let tt=document.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",_=Array.from(document.querySelectorAll("h1.kop-atas")).map(t=>v(t)).filter(Boolean);for(;_.length<3;)_.push("");let z=[],et=document.querySelector("#head-cetak-logo center, #head-cetak-logo");if(et){let t=document.createElement("div");t.innerHTML=et.innerHTML,t.querySelectorAll("h1").forEach(e=>e.remove()),z=(t.innerHTML||"").split(/<br\s*\/?>/gi).map(e=>t.textContent&&e.replace(/<[^>]+>/g,"").trim()).map(e=>String(e||"").trim()).filter(Boolean)}let q=z.join(" "),nt=t=>{let e=q.match(new RegExp(t+"\\s*:([\\d\\s().+-]+)","i"));return e?e[1].trim():""},it=nt("telp"),at=nt("fax"),D=(q.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)||[""])[0],G=(q.match(/https?:\/\/[^\s;,]+/)||[""])[0],A=q.replace(/telp\s*:[\d\s().+-]+/gi,"").replace(/fax\s*:[\d\s().+-]+/gi,"").replace(/website\s*:?/gi,"").replace(/email\s*:?/gi,"");D&&(A=A.split(D).join("")),G&&(A=A.split(G).join("")),A=A.split(/[;]+/).map(t=>t.replace(/\s+/g," ").trim()).filter(Boolean).join(", ").replace(/,\s*,+/g,",").replace(/^[,;\s]+|[,;\s]+$/g,"");let Pt=["Alamat: "+A,it?"Telp: "+it:"",at?"Fax: "+at:""].filter(Boolean).join(", "),Rt=[D?"Email: "+D:"",G?"Website: "+G:""].filter(Boolean).join(", ");z=[Pt,Rt].filter(Boolean);let B=v(document.querySelector(".head-cetak-instansi"))||"LAPORAN HASIL PEMERIKSAAN",U=[];document.querySelectorAll(".table-outer tr").forEach(t=>{let e=t.querySelectorAll("td");if(e.length>=6){let a=v(e[0]),s=v(e[2]),l=v(e[3]),r=v(e[5]);a&&U.push([a,s]),l&&U.push([l,r])}});let j=["makroskopik","mikroskopik","kesimpulan","icdo","catatan","saran"],k=t=>t.toLowerCase().replace(/0/g,"o").replace(/[^a-z]/g,""),E=[];document.querySelectorAll(".contentlab td").forEach(t=>{let e="",a=!1,s=t.querySelector(".section-title");if(s)e=v(s),a=!0;else{let d=m=>m.split(":")[0].trim();for(let m of Array.from(t.children).slice(0,3)){let g=v(m);if(g&&g.length<=24&&j.includes(k(d(g)))){e=d(g);break}}if(!e){let m=(t.textContent||"").split(`
`).map(g=>g.trim()).find(Boolean)||"";m&&j.includes(k(d(m)))&&(e=d(m))}if(!e)return}let l=document.createElement("div");l.innerHTML=t.innerHTML,l.querySelector(".section-title")?.remove();let r=l.innerHTML.replace(/\r\n?/g,`
`).replace(/<br\s*\/?>[ \t]*\n?/gi,`
`).replace(/\n(?:[ \t]*\n)+/g,"\u2028").split("\u2028").map(d=>d.split(/<br\s*\/?>|\n/).map(m=>H(m.replace(/<[^>]+>/g," "))).filter(Boolean)).filter(d=>d.length),u=[],n=[];r.forEach((d,m)=>{d.forEach((g,y)=>{m>0&&y===0&&u.length&&n.push(u.length),u.push(g)})});let o=u;if(!a&&o.length&&k(o[0])===k(e)){o.shift();for(let d=0;d<n.length;d++)n[d]-=1;for(;n.length&&n[0]<=0;)n.shift()}o.length>1&&!/^[IVXLC]+\.\s/.test(o[0])&&o.slice(1).some(d=>/^II\.\s/.test(d))&&(o[0]="I. "+o[0]),e&&E.push({title:e,items:o,para:n})});let Ct=/^catatan\s*:?/i,It=/^icd[\s-]*o\b\s*:?/i,$=[];for(let t of E){let e=[{title:t.title,items:[],para:[]}],a=e[0],s=!1,l=(r,u)=>{a={title:r,items:[],para:[],bare:u},e.push(a),s=!0};if(t.items.forEach((r,u)=>{let n=r.match(Ct),o=n?null:r.match(It);if(n){k(a.title)!=="catatan"&&l("Catatan");let d=r.slice(n[0].length).trim();d&&(t.para.includes(u)&&a.para.push(a.items.length),a.items.push(d));return}if(o){k(a.title)!=="icdo"&&l("ICD-0",!0),t.para.includes(u)&&a.para.push(a.items.length),a.items.push(r);return}t.para.includes(u)&&a.para.push(a.items.length),a.items.push(r)}),s)for(let r of e)r.items.length&&$.push(r);else $.push(e[0])}E.length=0,E.push(...$),E.forEach((t,e)=>t._i=e),E.sort((t,e)=>{let a=t._i??0,s=e._i??0,l=j.indexOf(k(t.title)),r=j.indexOf(k(e.title)),u=l===-1?j.length:l,n=r===-1?j.length:r;return u!==n?u-n:a-s});function zt(t){let e="";t instanceof HTMLSelectElement?e=((t.selectedIndex>=0?t.options[t.selectedIndex]:void 0)?.textContent||t.value||"").trim():(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(e=(t.value||"").trim());let a=(t.getAttribute("name")||"")+" "+(t.getAttribute("id")||""),s=t.getAttribute("placeholder")||"",l=t.closest("tr, .form-group, .form-row, div")?.textContent||"";return{val:e,ctx:(a+" "+s+" "+l).slice(0,300)}}function Mt(t,e,a){let s=e.toLowerCase().split(/[^a-z0-9]+/).filter(n=>n.length>=4&&!/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(n));if(!s.length)return"";let l=s.sort((n,o)=>o.length-n.length)[0],r="",u=-1;return t.querySelectorAll("input, textarea, select").forEach(n=>{let{val:o,ctx:d}=zt(n);if(!o||o===e||!o.toLowerCase().includes(l))return;let m=a.test(d)?2:0;m>u&&(u=m,r=o)}),r}function Ft(t,e){return(t.querySelector(e)?.value||"").trim()}async function Ht(t){let e=new URLSearchParams(window.location.search).get("id");if(!e)return;let a=n=>/ket\w*\s*klinis/i.test(n),s=n=>/^dokter/i.test(n)||/^rs\b/i.test(n),l=t.map(([n,o],d)=>({label:n,value:o,idx:d})).filter(n=>s(n.label)?!!n.value:a(n.label));if(!l.length)return;let r=new AbortController,u=window.setTimeout(()=>r.abort(),6e3);try{let n=new URL("/laboratorium/input-hasil/input-hasil-pa?id_lab="+encodeURIComponent(e),window.location.href),o=await fetch(n.toString(),{credentials:"same-origin",signal:r.signal});if(!o.ok){window.console.info("[paPrint] override: fetch input status "+o.status);return}let d=await o.text(),m=new DOMParser().parseFromString(d,"text/html");window.console.info('[paPrint] override: input title="'+(m.title||"").slice(0,60)+'" len='+d.length+" fields="+m.querySelectorAll("input, textarea, select").length);for(let g of l){if(a(g.label)){let gt=Ft(m,'#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]'),R=H(Z(gt));window.console.info("[paPrint] override: "+g.label+' cetak="'+g.value+'" input="'+R+'"'),R&&R!==g.value&&(t[g.idx][1]=R);continue}let y=/^dokter/i.test(g.label)?/dokter|pengirim|luar|dalam|rujuk/i:/rs\b|rumah\s*sakit|faskes|asal/i,S=Mt(m,g.value,y),P=H(Z(S||""));window.console.info("[paPrint] override: "+g.label+' cetak="'+g.value+'" input="'+P+'"'),P&&P!==g.value&&(t[g.idx][1]=P)}}catch{window.console.info("[paPrint] override: fetch gagal, pakai nilai server")}finally{window.clearTimeout(u)}}await Ht(U).catch(()=>{});let L=Array.from(document.querySelectorAll(".contentlab ~ div table td")).map(t=>v(t)).filter(Boolean),ot=L[0]||"",rt=L[1]||"",O=document.querySelector(".contentlab ~ div table img")?.getAttribute("src")||"",st=L.find(t=>/^\(.*\)$/.test(t))||L[2]||"",lt=L.find(t=>/^nip\.?/i.test(t))||L[3]||"",pt=document.querySelector('a.tombol[href*="export"]')?.getAttribute("href")||window.location.href+"&export=word",_t=Array.from(document.body.querySelectorAll("script")),qt=t=>t.toLowerCase().split(/\s+/).map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" "),M=U.map(([t,e])=>{if(!/^ruang/i.test(t))return[t,e];let a=e.replace(/^poli\s+.+?-\s*(?=klinik)/i,"").trim()||e,l=a.replace(/^(\S+)\s+-\s*(?=\1\b)/i,"").trim()||a,r=l.split(/\s+-\s*/);if(r.length>=3&&/rawat\s+inap/i.test(r[1])){let u=qt(r[1].trim()),n=r.slice(2).join(" - ").trim(),o=n?u+" - "+n:u;if(o)return[t,o]}return[t,l]}),Dt=M.map(([t,e])=>'<div class="info-item"><div class="info-label">'+c(t)+'</div><div class="info-colon">:</div><div class="info-value">'+c(e)+"</div></div>").join(""),V=t=>/^icd-?o\s*:/i.test(t)?"<strong>"+c(t)+"</strong>":c(t),ct=t=>/^catatan/i.test(t.trim()),dt=t=>t.replace(/^catatan\s*:?\s*/i,"").replace(/^[-•–—*]+\s*/,"").trim(),Gt=M.find(([t])=>/^no\.?pa/i.test(t))?.[1].replace(/[^a-zA-Z0-9]+/g,"-")||"tanpa-no";function ut(t){if(/^data:/i.test(t))return Promise.resolve(t);let e=new URL(t,window.location.href).href;return fetch(e,{signal:AbortSignal.timeout(8e3),credentials:"same-origin"}).then(a=>{if(!a.ok)throw new Error("img "+a.status);return a.blob()}).then(a=>new Promise((s,l)=>{let r=new FileReader;r.onload=()=>s(String(r.result)),r.onerror=()=>l(r.error),r.readAsDataURL(a)})).catch(()=>e)}async function Ut(){let t=J(T),[e,a]=await Promise.all([ut(tt),O?ut(O):Promise.resolve("")]),s="";for(let o=0;o<M.length;o+=2){let d=M[o],m=M[o+1];s+="<tr><td>"+c(d[0])+"</td><td>:</td><td>"+c(d[1])+"</td>"+(m?"<td>"+c(m[0])+"</td><td>:</td><td>"+c(m[1])+"</td>":"<td></td><td></td><td></td>")+"</tr>"}let l="";for(let o of E){if(ct(o.title)){let y=o.items.length?o.items:["Tidak ada"];l+='<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top" style="font-size:'+t.judul.fs+'pt"><b><u>CATATAN:</u></b></td><td>'+y.map(S=>"- "+c(dt(S)||"Tidak ada")).join("<br>")+"</td></tr></table>";continue}if(o.bare){o.items.forEach((y,S)=>{l+='<p style="margin:'+(S===0?"12pt":"0")+" 0 6pt 0;font-size:"+t.judul.fs+'pt;"><b>'+c(y.toUpperCase())+"</b></p>"});continue}l+='<p style="margin:12pt 0 0 0;font-size:'+t.judul.fs+'pt;"><b><u>'+c(o.title.toUpperCase())+"</u></b></p>";let d=k(o.title)==="kesimpulan",m=d?t.kesimpulan.fs:t.isi.fs,g=d?t.kesimpulan.lh:t.isi.lh;o.items.forEach((y,S)=>{let P=d?"<b>"+c(y)+"</b>":V(y),R=Q(y)?"margin-left:18pt;text-indent:-18pt;":"";l+='<p style="margin:'+(o.para.includes(S)?"14pt":"0")+" 0 6pt 0;font-size:"+m+"pt;line-height:"+g+";text-align:justify;"+R+'">'+P+"</p>"})}let r='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>'+c(B)+'</title></head><body style="font-family:Arial,sans-serif;font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="'+e+'" width="90"></td><td align="center">'+_.slice(0,3).map(o=>'<b style="font-size:'+t.kop.fs+'pt;">'+c(o)+"</b>").join("<br>")+'<br><span style="font-size:'+t.alamatFs+'pt;">'+z.map(o=>c(o)).join("<br>")+'</span></td></tr></table><hr><p align="center" style="font-size:'+t.judulLapFs+'pt;"><b><u>'+c(B.toUpperCase())+'</u></b></p><table border="0" cellspacing="0" cellpadding="2" style="font-size:'+t.pasien.fs+"pt;line-height:"+t.pasien.lh+';">'+s+"</table>"+l+'<table border="0" width="100%" cellspacing="0" cellpadding="0" style="font-size:'+t.ttd.fs+"pt;line-height:"+t.ttd.lh+';"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">'+c(ot)+'</p><p style="margin:0 0 6pt 0;">'+c(rt)+"</p>"+(a?'<p style="margin:0 0 6pt 0;"><img src="'+a+'" width="80" height="80"></p>':"")+'<p style="margin:0 0 6pt 0;"><b>'+c(st)+'</b></p><p style="margin:0 0 6pt 0;">'+c(lt)+"</p></td></tr></table></body></html>",u=new Blob(["\uFEFF"+r],{type:"application/msword"}),n=document.createElement("a");n.href=URL.createObjectURL(u),n.download="Hasil-PA-"+Gt+".doc",document.body.appendChild(n),n.click(),window.setTimeout(()=>{URL.revokeObjectURL(n.href),n.remove()},4e3)}let Ot=E.map(t=>{if(ct(t.title))return'<div class="section-catatan"><span class="catatan-label">Catatan:</span><div class="catatan-list">'+(t.items.length?t.items:["Tidak ada"]).map(l=>'<div class="catatan-item"><span class="catatan-dash">-</span><span>'+c(dt(l)||"Tidak ada")+"</span></div>").join("")+"</div></div>";let e=k(t.title)==="kesimpulan",a='<div class="'+(t.bare?"section-isi section-isi-bare":"section-isi")+(e?" section-kesimpulan":"")+'">'+t.items.map((s,l)=>{let r=t.para.includes(l)?" item-para":"",u=Q(s);if(u){let n=e?"<strong>"+c(u[1])+"</strong>":V(u[1]);return'<div class="item-list has-marker'+r+'"><span class="item-marker">'+c(u[0])+"</span><span>"+n+"</span></div>"}return'<div class="item-list'+r+'">'+(e?"<strong>"+c(s)+"</strong>":V(s))+"</div>"}).join("")+"</div>";return t.bare?a:'<div class="section-judul">'+c(t.title)+"</div>"+a}).join("");document.body.innerHTML='<a href="'+c(pt)+'" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><button type="button" class="no-print" id="btn-typo" title="Atur font & spasi cetakan">\u2699\uFE0F Gaya</button><div class="t-typo no-print" id="ext-pa-typo" hidden></div><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="'+c(tt)+'" alt="Logo"></div><div class="kop-text">'+_.slice(0,3).map(t=>'<h1 class="kop-atas">'+c(t)+"</h1>").join("")+'<div class="kop-alamat">'+z.map(t=>c(t)).join("<br>")+'</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">'+c(B)+'</div><div class="patient-info-container">'+Dt+'</div><div class="hasil-pa">'+Ot+'</div><div class="ttd-container clearfix"><div class="ttd-box"><p>'+c(ot)+"</p><p>"+c(rt)+"</p>"+(O?'<img src="'+c(O)+'" alt="QR Code TTD">':"")+'<p style="font-weight: bold; margin-bottom: 0;">'+c(st)+'</p><p style="margin-top: 2px;">'+c(lt)+"</p></div></div></div>",_t.forEach(t=>document.body.appendChild(t)),document.querySelector("#btn-word")?.addEventListener("click",t=>{t.preventDefault(),Ut().catch(()=>{window.location.href=pt})});let mt=()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=(s,l,r,u,n,o,d,m)=>"<label>"+c(r)+'<input type="range" data-g="'+c(s)+'" data-f="'+l+'" min="'+u+'" max="'+n+'" step="'+o+'" value="'+d+'"><output data-o="'+c(s+"-"+l)+'">'+c(String(d)+m)+"</output></label>";t.innerHTML="<h4>Gaya Cetakan PA</h4>"+wt.map(s=>'<div class="t-typo-group"><strong>'+c(s.label)+'</strong><div class="t-typo-row">'+e(s.key,"fs","Font (pt)",4,20,.5,T[s.key].fs,"pt")+e(s.key,"lh","Spasi baris",.5,2.5,.05,T[s.key].lh,"")+"</div></div>").join("")+'<div class="t-typo-actions"><button type="button" data-act="save" class="primary">Simpan</button><button type="button" data-act="reset">Reset</button></div><div class="t-typo-note" data-note></div>',t.querySelectorAll('input[type="range"]').forEach(s=>{let l=s;l.addEventListener("input",()=>{let r=l.dataset.g,u=l.dataset.f;if(!r||!u||!T[r])return;T[r][u]=Number(l.value),N();let n=t.querySelector(`output[data-o="${r}-${u}"]`);n&&(n.textContent=l.value+(u==="fs"?"pt":""))})});let a=t.querySelector("[data-note]");t.querySelector('[data-act="save"]')?.addEventListener("click",()=>{let s=At(F(),T);a&&(a.textContent=s?"Tersimpan \u2713":"Gagal menyimpan")}),t.querySelector('[data-act="reset"]')?.addEventListener("click",()=>{if(St(F()),T=Y(F()),N(),mt(),a){let s=t.querySelector("[data-note]");s&&(s.textContent="Kembali ke default \u2713")}})};document.querySelector("#btn-typo")?.addEventListener("click",()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=t.hidden;e&&mt(),t.hidden=!e}),document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(t=>t.remove());let ft="ext-pa-print-style";if(!document.getElementById(ft)){let t=document.createElement("style");t.id=ft,t.textContent=`
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
           seperti section-judul (minus garis bawah). */
        .section-isi-bare {
            margin: 12px 0 0;
            padding: 0;
            font-size: var(--pa-judul-fs, 6pt);
            font-weight: bold;
            line-height: var(--pa-judul-lh, 1.2);
            text-transform: uppercase;
        }

        .section-isi-bare .item-list {
            margin: 0;
            padding: 0;
        }

        /* CATATAN: label + list gantung \u2014 baris lanjutan rata di bawah
           dash pertama ("Catatan: - \u2026" lalu "- \u2026" sejajar di bawahnya). */
        .section-catatan {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 12px;
            font-size: var(--pa-isi-fs, 5pt);
            line-height: var(--pa-isi-lh, 1.25);
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
