"use strict";var __morbis_feature=(()=>{var Tt="extensionConfig";function Et(o,n,m){if(n?.extensionEnabled===!1)return!1;let h=n?.features?.[o];if(!h)return!0;if(h.enabled===!1)return!1;let T=m??n?.currentRole??"admin";if(T==="admin")return!0;let v=h.allowedRoles;return!Array.isArray(v)||v.length===0?!0:v.includes(T)}async function ne(o){try{let n=await chrome.runtime.sendMessage({type:"GET_CONFIG"});if(n?.config)return Et(o,n.config)}catch{}try{let m=(await chrome.storage.local.get(Tt))?.[Tt]??null;return Et(o,m)}catch{return!0}}function St(o,n){ne(o).then(m=>{if(m)try{n()}catch(h){console.error(`[featureGate:${o}] gagal jalan:`,h)}}).catch(m=>console.error(`[featureGate:${o}] gagal baca config:`,m))}var At="ext-free-text-noop",jt='input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select{text-transform:none!important}';function It(o){try{let n=o.toUpper;if(typeof n=="function"&&n[At]===!0)return!0;let m=function(h){return h?.value??""};m[At]=!0;try{Object.defineProperty(o,"toUpper",{value:m,writable:!0,configurable:!0})}catch{o.toUpper=m}return!0}catch{return!1}}var nt="ext-pa-typo",Lt=[{key:"kop",label:"Kop Surat"},{key:"pasien",label:"Data Pasien"},{key:"judul",label:"Judul Bagian Isi"},{key:"isi",label:"Isi (termasuk ICD-O, Saran & Catatan)"},{key:"kesimpulan",label:"Kesimpulan"},{key:"ttd",label:"TTD"}],j={kop:{fs:16,lh:1.2},pasien:{fs:4,lh:1},judul:{fs:6,lh:1.2},isi:{fs:5,lh:1.25},kesimpulan:{fs:5,lh:1.25},icdo:{fs:6,lh:1.2},catatan:{fs:5,lh:1.25},ttd:{fs:6,lh:1.2}},Pt=4,Rt=24,ie=.5,ae=2.5;function Ct(o,n,m,h){let T=typeof o=="number"?o:Number(o);return Number.isFinite(T)?Math.min(h,Math.max(m,T)):n}function I(o,n){let m=o??{};return{fs:Ct(m.fs,n.fs,Pt,Rt),lh:Ct(m.lh,n.lh,ie,ae)}}function B(o){let n=o??{};return{kop:I(n.kop,j.kop),pasien:I(n.pasien,j.pasien),judul:I(n.judul,j.judul),isi:I(n.isi,j.isi),kesimpulan:I(n.kesimpulan,j.kesimpulan),icdo:I(n.icdo,j.icdo),catatan:I(n.catatan,j.catatan),ttd:I(n.ttd,j.ttd)}}function et(){return B(null)}function it(o){try{if(!o)return et();let n=o.getItem(nt);return n?B(JSON.parse(n)):et()}catch{return et()}}function zt(o,n){try{return o?(o.setItem(nt,JSON.stringify(B(n))),!0):!1}catch{return!1}}function Mt(o){try{o?.removeItem(nt)}catch{}}function at(o){let n=B(o),m=h=>Math.min(Rt,Math.max(Pt,h));return{...n,alamatFs:m(n.kop.fs-8.5),judulLapFs:m(n.kop.fs-4)}}var b=o=>String(Math.round(o*100)/100);function oe(o){let n=at(o);return{"--pa-kop-fs":`${b(n.kop.fs)}pt`,"--pa-kop-lh":b(n.kop.lh),"--pa-alamat-fs":`${b(n.alamatFs)}pt`,"--pa-judul-lap-fs":`${b(n.judulLapFs)}pt`,"--pa-pasien-fs":`${b(n.pasien.fs)}pt`,"--pa-pasien-lh":b(n.pasien.lh),"--pa-judul-fs":`${b(n.judul.fs)}pt`,"--pa-judul-lh":b(n.judul.lh),"--pa-isi-fs":`${b(n.isi.fs)}pt`,"--pa-isi-lh":b(n.isi.lh),"--pa-kesimpulan-fs":`${b(n.kesimpulan.fs)}pt`,"--pa-kesimpulan-lh":b(n.kesimpulan.lh),"--pa-icdo-fs":`${b(n.icdo.fs)}pt`,"--pa-icdo-lh":b(n.icdo.lh),"--pa-catatan-fs":`${b(n.catatan.fs)}pt`,"--pa-catatan-lh":b(n.catatan.lh),"--pa-ttd-fs":`${b(n.ttd.fs)}pt`,"--pa-ttd-lh":b(n.ttd.lh)}}function qt(o,n){if(o)try{for(let[m,h]of Object.entries(oe(n)))o.setProperty(m,h)}catch{}}var re=/^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;function V(o){let n=o??"",m=n.match(re);if(!m)return null;let h=n.slice(m[0].length).trim();return h===""?null:[m[1],h]}var se={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" ",plusmn:"\xB1",pm:"\xB1",equals:"=",ge:"\u2265",geq:"\u2265",le:"\u2264",leq:"\u2264",ne:"\u2260",neq:"\u2260",times:"\xD7",divide:"\xF7",deg:"\xB0",micro:"\xB5",hellip:"\u2026",ndash:"\u2013",mdash:"\u2014",bull:"\u2022",middot:"\xB7",ldquo:"\u201C",rdquo:"\u201D",lsquo:"\u2018",rsquo:"\u2019",laquo:"\xAB",raquo:"\xBB",trade:"\u2122",reg:"\xAE",copy:"\xA9"},le=/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi;function Gt(o){if(!Number.isFinite(o)||o<32||o>1114111)return" ";try{return String.fromCodePoint(o)}catch{return" "}}function ot(o){return String(o??"").replace(le,(n,m)=>{if(m[0]==="#"){let h=/^#x([0-9a-f]+)$/i.exec(m);return Gt(h?parseInt(h[1],16):parseInt(m.slice(1),10))}return se[m.toLowerCase()]??n})}St("paLabPrint",function(){"use strict";function o(){try{It(window)}catch{}try{if(document.head&&!document.getElementById("ext-free-text-style")){let v=document.createElement("style");v.id="ext-free-text-style",v.textContent=jt,document.head.appendChild(v)}}catch{}}if(o(),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",o),window.setInterval(o,3e3),!window.location.pathname.includes("/laboratorium/print/"))return;async function m(){let v="ext-pa-print-proc";if(document.documentElement.getAttribute(v))return;document.documentElement.setAttribute(v,"1");let H=()=>{try{return window.localStorage??null}catch{return null}},E=it(H()),X=()=>{try{qt(document.documentElement.style,E)}catch{}};X();let w=t=>D(t?.textContent||"");function rt(t){return t.replace(/<[^>]+>/g," ")}function Ft(t){return t.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi,"H. ")}function D(t){let e=Ft(t).replace(/\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi," ").replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi," ");return ot(ot(e)).replace(/\s+/g," ").trim()}function d(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let st=document.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",_=Array.from(document.querySelectorAll("h1.kop-atas")).map(t=>w(t)).filter(Boolean);for(;_.length<3;)_.push("");let z=[],lt=document.querySelector("#head-cetak-logo center, #head-cetak-logo");if(lt){let t=document.createElement("div");t.innerHTML=lt.innerHTML,t.querySelectorAll("h1").forEach(e=>e.remove()),z=(t.innerHTML||"").split(/<br\s*\/?>/gi).map(e=>t.textContent&&e.replace(/<[^>]+>/g,"").trim()).map(e=>String(e||"").trim()).filter(Boolean)}let O=z.join(" "),pt=t=>{let e=O.match(new RegExp(t+"\\s*:([\\d\\s().+-]+)","i"));return e?e[1].trim():""},ct=pt("telp"),dt=pt("fax"),N=(O.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)||[""])[0],U=(O.match(/https?:\/\/[^\s;,]+/)||[""])[0],C=O.replace(/telp\s*:[\d\s().+-]+/gi,"").replace(/fax\s*:[\d\s().+-]+/gi,"").replace(/website\s*:?/gi,"").replace(/email\s*:?/gi,"");N&&(C=C.split(N).join("")),U&&(C=C.split(U).join("")),C=C.split(/[;]+/).map(t=>t.replace(/\s+/g," ").trim()).filter(Boolean).join(", ").replace(/,\s*,+/g,",").replace(/^[,;\s]+|[,;\s]+$/g,"");let Ht=["Alamat: "+C,ct?"Telp: "+ct:"",dt?"Fax: "+dt:""].filter(Boolean).join(", "),Dt=[N?"Email: "+N:"",U?"Website: "+U:""].filter(Boolean).join(", ");z=[Ht,Dt].filter(Boolean);let Y=w(document.querySelector(".head-cetak-instansi"))||"LAPORAN HASIL PEMERIKSAAN",K=[];document.querySelectorAll(".table-outer tr").forEach(t=>{let e=t.querySelectorAll("td");if(e.length>=6){let r=w(e[0]),l=w(e[2]),p=w(e[3]),s=w(e[5]);r&&K.push([r,l]),p&&K.push([p,s])}});let L=["makroskopik","mikroskopik","kesimpulan","icdo","catatan","saran"],y=t=>t.toLowerCase().replace(/0/g,"o").replace(/[^a-z]/g,""),S=[];document.querySelectorAll(".contentlab td").forEach(t=>{let e="",r=!1,l=t.querySelector(".section-title");if(l)e=w(l),r=!0;else{let c=g=>g.split(":")[0].trim();for(let g of Array.from(t.children).slice(0,3)){let u=w(g);if(u&&u.length<=24&&L.includes(y(c(u)))){e=c(u);break}}if(!e){let g=(t.textContent||"").split(`
`).map(u=>u.trim()).find(Boolean)||"";g&&L.includes(y(c(g)))&&(e=c(g))}if(!e)return}let p=document.createElement("div");p.innerHTML=t.innerHTML,p.querySelector(".section-title")?.remove();let s=p.innerHTML.replace(/\r\n?/g,`
`).replace(/<br\s*\/?>[ \t]*\n?/gi,`
`).replace(/\n(?:[ \t]*\n)+/g,"\u2028").split("\u2028").map(c=>c.split(/<br\s*\/?>|\n/).map(g=>D(g.replace(/<[^>]+>/g," "))).filter(Boolean)).filter(c=>c.length),f=[],a=[];s.forEach((c,g)=>{c.forEach((u,x)=>{g>0&&x===0&&f.length&&a.push(f.length),f.push(u)})});let i=f;if(!r&&i.length&&y(i[0])===y(e)){i.shift();for(let c=0;c<a.length;c++)a[c]-=1;for(;a.length&&a[0]<=0;)a.shift()}i.length>1&&!/^[IVXLC]+\.\s/.test(i[0])&&!/:\s*$/.test(i[0])&&i.slice(1).some(c=>/^II\.\s/.test(c))&&(i[0]="I. "+i[0]),e&&S.push({title:e,items:i,para:a})});let _t=/^catatan\s*:?/i,Ot=/^icd[\s-]*o\b\s*:?/i,W=[];for(let t of S){let e=[{title:t.title,items:[],para:[]}],r=e[0],l=!1,p=(s,f)=>{r={title:s,items:[],para:[],bare:f},e.push(r),l=!0};if(t.items.forEach((s,f)=>{let a=s.match(_t),i=a?null:s.match(Ot);if(a){y(r.title)!=="catatan"&&p("Catatan");let c=s.slice(a[0].length).trim();c&&(t.para.includes(f)&&r.para.push(r.items.length),r.items.push(c));return}if(i){y(r.title)!=="icdo"&&p("ICD-0",!0),t.para.includes(f)&&r.para.push(r.items.length),r.items.push(s);return}t.para.includes(f)&&r.para.push(r.items.length),r.items.push(s)}),l)for(let s of e)s.items.length&&W.push(s);else W.push(e[0])}S.length=0,S.push(...W),S.forEach((t,e)=>t._i=e),S.sort((t,e)=>{let r=t._i??0,l=e._i??0,p=L.indexOf(y(t.title)),s=L.indexOf(y(e.title)),f=p===-1?L.length:p,a=s===-1?L.length:s;return f!==a?f-a:r-l});function Nt(t){let e="";t instanceof HTMLSelectElement?e=((t.selectedIndex>=0?t.options[t.selectedIndex]:void 0)?.textContent||t.value||"").trim():(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(e=(t.value||"").trim());let r=(t.getAttribute("name")||"")+" "+(t.getAttribute("id")||""),l=t.getAttribute("placeholder")||"",p=t.closest("tr, .form-group, .form-row, div")?.textContent||"";return{val:e,ctx:(r+" "+l+" "+p).slice(0,300)}}function Ut(t,e,r){let l=e.toLowerCase().split(/[^a-z0-9]+/).filter(a=>a.length>=4&&!/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(a));if(!l.length)return"";let p=l.sort((a,i)=>i.length-a.length)[0],s="",f=-1;return t.querySelectorAll("input, textarea, select").forEach(a=>{let{val:i,ctx:c}=Nt(a);if(!i||i===e||!i.toLowerCase().includes(p))return;let g=r.test(c)?2:0;g>f&&(f=g,s=i)}),s}function Kt(t,e){return(t.querySelector(e)?.value||"").trim()}async function $t(t){let e=new URLSearchParams(window.location.search).get("id");if(!e)return;let r=a=>/ket\w*\s*klinis/i.test(a),l=a=>/^dokter/i.test(a)||/^rs\b/i.test(a),p=t.map(([a,i],c)=>({label:a,value:i,idx:c})).filter(a=>l(a.label)?!!a.value:r(a.label));if(!p.length)return;let s=new AbortController,f=window.setTimeout(()=>s.abort(),6e3);try{let a=new URL("/laboratorium/input-hasil/input-hasil-pa?id_lab="+encodeURIComponent(e),window.location.href),i=await fetch(a.toString(),{credentials:"same-origin",signal:s.signal});if(!i.ok){window.console.info("[paPrint] override: fetch input status "+i.status);return}let c=await i.text(),g=new DOMParser().parseFromString(c,"text/html");window.console.info('[paPrint] override: input title="'+(g.title||"").slice(0,60)+'" len='+c.length+" fields="+g.querySelectorAll("input, textarea, select").length);for(let u of p){if(r(u.label)){let tt=Kt(g,'#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]'),k=D(rt(tt));window.console.info("[paPrint] override: "+u.label+' cetak="'+u.value+'" input="'+k+'"'),k&&k!==u.value&&(t[u.idx][1]=k);continue}let x=/^dokter/i.test(u.label)?/dokter|pengirim|luar|dalam|rujuk/i:/rs\b|rumah\s*sakit|faskes|asal/i,q=Ut(g,u.value,x),A=D(rt(q||""));window.console.info("[paPrint] override: "+u.label+' cetak="'+u.value+'" input="'+A+'"'),A&&A!==u.value&&(t[u.idx][1]=A)}}catch{window.console.info("[paPrint] override: fetch gagal, pakai nilai server")}finally{window.clearTimeout(f)}}await $t(K).catch(()=>{});let P=Array.from(document.querySelectorAll(".contentlab ~ div table td")).map(t=>w(t)).filter(Boolean),ut=P[0]||"",mt=P[1]||"",$=document.querySelector(".contentlab ~ div table img")?.getAttribute("src")||"",ft=P.find(t=>/^\(.*\)$/.test(t))||P[2]||"",gt=P.find(t=>/^nip\.?/i.test(t))||P[3]||"",ht=document.querySelector('a.tombol[href*="export"]')?.getAttribute("href")||window.location.href+"&export=word",Bt=Array.from(document.body.querySelectorAll("script")),Vt=t=>t.toLowerCase().split(/\s+/).map(e=>e&&e.charAt(0).toUpperCase()+e.slice(1)).join(" "),M=K.map(([t,e])=>{if(/^(cara|care)\s+peroleh(an)?$/i.test(t.trim()))return["Cara Perolehan",e];if(!/^ruang/i.test(t))return[t,e];let r=e.replace(/^poli\s+.+?-\s*(?=klinik)/i,"").trim()||e,p=r.replace(/^(\S+)\s+-\s*(?=\1\b)/i,"").trim()||r,s=p.split(/\s+-\s*/);if(s.length>=3&&/rawat\s+inap/i.test(s[1])){let f=Vt(s[1].trim()),a=s.slice(2).join(" - ").trim(),i=a?f+" - "+a:f;if(i)return[t,i]}return[t,p]}),Xt=M.map(([t,e])=>'<div class="info-item"><div class="info-label">'+d(t)+'</div><div class="info-colon">:</div><div class="info-value">'+d(e)+"</div></div>").join(""),J=t=>/^icd-?o\s*:/i.test(t)?"<strong>"+d(t)+"</strong>":d(t),Yt=t=>/^catatan/i.test(t.trim()),Q=t=>/^saran/i.test(t.trim()),bt=t=>Yt(t)||Q(t),Wt=t=>Q(t)?"Saran:":"Catatan:",Z=t=>t.replace(/^(catatan|saran)\s*:?\s*/i,"").replace(/^[-•–—*]+\s*/,"").trim(),Jt=M.find(([t])=>/^no\.?pa/i.test(t))?.[1].replace(/[^a-zA-Z0-9]+/g,"-")||"tanpa-no";function yt(t){if(/^data:/i.test(t))return Promise.resolve(t);let e=new URL(t,window.location.href).href;return fetch(e,{signal:AbortSignal.timeout(8e3),credentials:"same-origin"}).then(r=>{if(!r.ok)throw new Error("img "+r.status);return r.blob()}).then(r=>new Promise((l,p)=>{let s=new FileReader;s.onload=()=>l(String(s.result)),s.onerror=()=>p(s.error),s.readAsDataURL(r)})).catch(()=>e)}async function Qt(){let t=at(E),[e,r]=await Promise.all([yt(st),$?yt($):Promise.resolve("")]),l="";for(let i=0;i<M.length;i+=2){let c=M[i],g=M[i+1];l+="<tr><td>"+d(c[0])+"</td><td>:</td><td>"+d(c[1])+"</td>"+(g?"<td>"+d(g[0])+"</td><td>:</td><td>"+d(g[1])+"</td>":"<td></td><td></td><td></td>")+"</tr>"}let p="";for(let i of S){if(bt(i.title)){let k=i.items.length?i.items:["Tidak ada"],G=k.length>1,F=Q(i.title)?"SARAN:":"CATATAN:";p+='<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top" style="font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><b>'+F+'</b></td><td valign="top" style="font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';">'+k.map(R=>(G?"- ":"")+"<b>"+d(Z(R)||"Tidak ada")+"</b>").join("<br>")+"</td></tr></table>";continue}if(i.bare){i.items.forEach((k,G)=>{p+='<p style="margin:'+(G===0?"12pt":"0")+" 0 6pt 0;font-size:"+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><b>'+d(k.toUpperCase())+"</b></p>"});continue}let c=["makroskopik","mikroskopik","kesimpulan"].includes(y(i.title)),g=y(i.title)==="icdo";p+='<p style="margin:12pt 0 0 0;font-size:'+(g?t.isi.fs:t.judul.fs)+'pt;"><b>'+(c?"<u>":"")+d(i.title.toUpperCase())+(c?"</u>":"")+"</b></p>";let u=y(i.title)==="kesimpulan",x=y(i.title)==="icdo",q=u||x||y(i.title)==="saran",A=u?t.kesimpulan.fs:t.isi.fs,tt=u?t.kesimpulan.lh:t.isi.lh;i.items.forEach((k,G)=>{let F=u?k.trimStart():k,R=u?null:V(F),vt=i.items.length===1&&R!==null&&/^[-•–—*]$/.test(R[0]),wt=vt?Z(F)||R[1]:F,te=q?"<b>"+d(wt)+"</b>":J(wt),ee=R&&!vt?"margin-left:18pt;text-indent:-18pt;":"";p+='<p style="margin:'+(i.para.includes(G)?"4pt":"0")+" 0 6pt 0;font-size:"+A+"pt;line-height:"+tt+";text-align:justify;"+ee+'">'+te+"</p>"})}let s='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>'+d(Y)+'</title></head><body style="font-family:Arial,sans-serif;font-size:'+t.isi.fs+"pt;line-height:"+t.isi.lh+';"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="'+e+'" width="90"></td><td align="center">'+_.slice(0,3).map(i=>'<b style="font-size:'+t.kop.fs+'pt;">'+d(i)+"</b>").join("<br>")+'<br><span style="font-size:'+t.alamatFs+'pt;">'+z.map(i=>d(i)).join("<br>")+'</span></td></tr></table><hr><p align="center" style="font-size:'+t.judulLapFs+'pt;"><b><u>'+d(Y.toUpperCase())+'</u></b></p><table border="0" cellspacing="0" cellpadding="2" style="font-size:'+t.pasien.fs+"pt;line-height:"+t.pasien.lh+';">'+l+"</table>"+p+'<table border="0" width="100%" cellspacing="0" cellpadding="0" style="font-size:'+t.ttd.fs+"pt;line-height:"+t.ttd.lh+';"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">'+d(ut)+'</p><p style="margin:0 0 6pt 0;">'+d(mt)+"</p>"+(r?'<p style="margin:0 0 6pt 0;"><img src="'+r+'" width="80" height="80"></p>':"")+'<p style="margin:0 0 6pt 0;"><b>'+d(ft)+'</b></p><p style="margin:0 0 6pt 0;">'+d(gt)+"</p></td></tr></table></body></html>",f=new Blob(["\uFEFF"+s],{type:"application/msword"}),a=document.createElement("a");a.href=URL.createObjectURL(f),a.download="Hasil-PA-"+Jt+".doc",document.body.appendChild(a),a.click(),window.setTimeout(()=>{URL.revokeObjectURL(a.href),a.remove()},4e3)}let Zt=S.map(t=>{if(bt(t.title)){let i=t.items.length?t.items:["Tidak ada"],c=i.length>1;return'<div class="section-catatan"><span class="catatan-label">'+Wt(t.title)+'</span><div class="catatan-list">'+i.map(g=>{let u="<span>"+d(Z(g)||"Tidak ada")+"</span>";return c?'<div class="catatan-item"><span class="catatan-dash">-</span>'+u+"</div>":'<div class="catatan-item">'+u+"</div>"}).join("")+"</div></div>"}let e=y(t.title)==="kesimpulan",r=y(t.title)==="icdo",l=e||r||y(t.title)==="saran",p='<div class="'+(t.bare?"section-isi section-isi-bare":"section-isi")+(e?" section-kesimpulan":"")+(r&&!t.bare?" section-icdo":"")+'">'+t.items.map((i,c)=>{let g=t.para.includes(c)?" item-para":"",u=e?i.trimStart():i,x=e?null:V(u),q=!e&&!x&&/:\s*$/.test(u)&&c+1<t.items.length&&!!V(t.items[c+1])&&t.para.includes(c+1);if(x&&!(t.items.length===1&&/^[-•–—*]$/.test(x[0]))){let A=l?"<strong>"+d(x[1])+"</strong>":J(x[1]);return'<div class="item-list has-marker'+g+'"><span class="item-marker">'+(l?"<strong>"+d(x[0])+"</strong>":d(x[0]))+"</span><span>"+A+"</span></div>"}return'<div class="item-list'+g+(q?" item-intro":"")+'">'+(l?"<strong>"+d(u)+"</strong>":J(u))+"</div>"}).join("")+"</div>";if(t.bare)return p;let s=y(t.title),f=["makroskopik","mikroskopik","kesimpulan"].includes(s)?" u":"",a=s==="icdo"?" i":"";return'<div class="section-judul'+f+a+'">'+d(t.title)+"</div>"+p}).join("");document.body.innerHTML='<a href="'+d(ht)+'" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><button type="button" class="no-print" id="btn-typo" title="Atur font & spasi cetakan">\u2699\uFE0F Gaya</button><div class="t-typo no-print" id="ext-pa-typo" hidden></div><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="'+d(st)+'" alt="Logo"></div><div class="kop-text">'+_.slice(0,3).map(t=>'<h1 class="kop-atas">'+d(t)+"</h1>").join("")+'<div class="kop-alamat">'+z.map(t=>d(t)).join("<br>")+'</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">'+d(Y)+'</div><div class="patient-info-container">'+Xt+'</div><div class="hasil-pa">'+Zt+'</div><div class="ttd-container clearfix"><div class="ttd-box"><p>'+d(ut)+"</p><p>"+d(mt)+"</p>"+($?'<img src="'+d($)+'" alt="QR Code TTD">':"")+'<p style="font-weight: bold; margin-bottom: 0;">'+d(ft)+'</p><p style="margin-top: 2px;">'+d(gt)+"</p></div></div></div>",Bt.forEach(t=>document.body.appendChild(t)),document.querySelector("#btn-word")?.addEventListener("click",t=>{t.preventDefault(),Qt().catch(()=>{window.location.href=ht})});let xt=()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=(l,p,s,f,a,i,c,g)=>"<label>"+d(s)+'<input type="range" data-g="'+d(l)+'" data-f="'+p+'" min="'+f+'" max="'+a+'" step="'+i+'" value="'+c+'"><output data-o="'+d(l+"-"+p)+'">'+d(String(c)+g)+"</output></label>";t.innerHTML="<h4>Gaya Cetakan PA</h4>"+Lt.map(l=>'<div class="t-typo-group"><strong>'+d(l.label)+'</strong><div class="t-typo-row">'+e(l.key,"fs","Font (pt)",4,20,.5,E[l.key].fs,"pt")+e(l.key,"lh","Spasi baris",.5,2.5,.05,E[l.key].lh,"")+"</div></div>").join("")+'<div class="t-typo-actions"><button type="button" data-act="save" class="primary">Simpan</button><button type="button" data-act="reset">Reset</button></div><div class="t-typo-note" data-note></div>',t.querySelectorAll('input[type="range"]').forEach(l=>{let p=l;p.addEventListener("input",()=>{let s=p.dataset.g,f=p.dataset.f;if(!s||!f||!E[s])return;E[s][f]=Number(p.value),X();let a=t.querySelector(`output[data-o="${s}-${f}"]`);a&&(a.textContent=p.value+(f==="fs"?"pt":""))})});let r=t.querySelector("[data-note]");t.querySelector('[data-act="save"]')?.addEventListener("click",()=>{let l=zt(H(),E);r&&(r.textContent=l?"Tersimpan \u2713":"Gagal menyimpan")}),t.querySelector('[data-act="reset"]')?.addEventListener("click",()=>{if(Mt(H()),E=it(H()),X(),xt(),r){let l=t.querySelector("[data-note]");l&&(l.textContent="Kembali ke default \u2713")}})};document.querySelector("#btn-typo")?.addEventListener("click",()=>{let t=document.getElementById("ext-pa-typo");if(!t)return;let e=t.hidden;e&&xt(),t.hidden=!e}),document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(t=>t.remove());let kt="ext-pa-print-style";if(!document.getElementById(kt)){let t=document.createElement("style");t.id=kt,t.textContent=`
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
      `,document.head.appendChild(t)}}let h=Date.now(),T=window.setInterval(()=>{document.documentElement.getAttribute("data-ext-pa-print")==="1"?(window.clearInterval(T),m().catch(()=>{})):Date.now()-h>5e3&&window.clearInterval(T)},200)});})();
