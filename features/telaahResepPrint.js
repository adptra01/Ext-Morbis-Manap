"use strict";var __morbis_feature=(()=>{var et="extensionConfig";function Mt(h,x,A){let f=x?.features?.[h];if(!f)return!0;if(f.enabled===!1)return!1;let S=A??x?.currentRole??"admin";if(S==="admin")return!0;let k=f.allowedRoles;return!Array.isArray(k)||k.length===0?!0:k.includes(S)}async function Nt(h){try{let A=(await chrome.storage.sync.get(et))?.[et]??null;return Mt(h,A)}catch{return!0}}function at(h,x){Nt(h).then(A=>{if(A)try{x()}catch(f){console.error(`[featureGate:${h}] gagal jalan:`,f)}})}at("telaahResep",function(){"use strict";async function h(){let S="ext-telaah-proc",k=document.querySelector(".halaman");if(!k||k.getAttribute(S))return;let m=k;m.setAttribute(S,"1");let u=t=>(t?.textContent||"").replace(/\s+/g," ").trim();function r(t){return String(t??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let nt=t=>t?r(t.replace(/^(.*?)(\d+)$/,`$1
$2`)):"-",it=m.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",_="RSUD H. ABDUL MANAP",M=[],N=m.querySelector("#head-cetak-logo");if(N){let t=N.querySelector("b");_=t?u(t):_;let a=document.createElement("div");a.innerHTML=N.innerHTML.replace(/<br\s*\/?>/gi,`
`),M=(a.textContent||"").split(`
`).map(e=>e.trim()).filter(Boolean).filter(e=>e!==_)}let j=new Map,L=[];m.querySelectorAll(".halaman > table:first-of-type table").forEach(t=>{t.querySelectorAll("tr").forEach(a=>{let e=a.querySelectorAll("td");if(e.length<2)return;let n=u(e[0]),i=u(e[1]).replace(/^:\s*/,"");if(n&&!j.has(n)&&j.set(n,i),/^diagnosa$/i.test(n)){let s=(e[1].innerHTML||"").replace(/<br\s*\/?>/gi,`
`),c=document.createElement("div");c.innerHTML=s,L=(c.textContent||"").split(`
`).map(l=>l.trim()).filter(l=>l&&!/^:/.test(l)&&!/tidak ada/i.test(l))}})});let rt=t=>j.get(t)??"",v=[],z=Array.from(m.querySelectorAll("table.resep-item"))[1],U="",D="",y=[],P=[],ot="",H="";async function st(){let t=new URLSearchParams(window.location.search),a=t.get("id_resep")||t.get("id")||t.get("penjualan")||"";if(!a)return;let e="/inventory/resep/penerimaan/detail?id="+a;try{let n=await fetch(e,{credentials:"include"});if(!n.ok)return;let i=await n.text(),s=new DOMParser().parseFromString(i,"text/html"),c=o=>(s.querySelector("#"+o)||s.querySelector('input[name="'+o+'"]')||s.querySelector('input[id*="'+o+'"]'))?.value?.trim()||"";U=c("id_visit")||t.get("visit")||U,D=c("id_kunjungan")||D,H=c("no_sep")||H;let d=Array.from(s.querySelectorAll("fieldset#perhatian")).find(o=>{let g=o.querySelector("legend");return g&&/riwayat\s*diagnosa\s*pasien/i.test(u(g))});if(d){let o=Array.from(d.querySelectorAll("li")).map(b=>u(b)).filter(Boolean),g=-1,It=Array.from(d.querySelectorAll("strong, b"));for(let b of It)if(/diagnosa\s*sekunder/i.test(u(b))){let X=b.closest("li");if(X){let R=Array.from(d.querySelectorAll("li")).indexOf(X);R>=0&&(g=R)}else{let R=b.nextElementSibling;if(R&&R.tagName==="OL"){let Z=R.querySelector("li");if(Z){let tt=Array.from(d.querySelectorAll("li")).indexOf(Z);tt>=0&&(g=tt)}}}break}g>=0&&g<o.length?(y=o.slice(0,g),P=o.slice(g).filter(b=>b&&!/tidak ada/i.test(b))):o.length&&(y=o)}}catch{}}function lt(t){let a=c=>typeof c=="string"?c.trim():"",e=a(t.nama_barang),n=a(t.kekuatan),i=a(t.sediaan),s=a(t.satuan);return n&&(e+=(e?" ":"")+n),i&&(e+=(e?", ":"")+i),s&&(e+=(e?" @":"")+s),e}function ct(t){return{NO_R:t.no_r,JENIS_R:t.jenis_r,JENIS_RSP:t.jenis_r,NAMA_RACIKAN:t.nama_racikan,ATURAN_PAKAI_MANUAL:t.aturan_pakai_manual,JUMLAH_RACIKAN:t.jumlah_racikan,NAMA:lt(t),KEKUATAN_R_RACIK:t.kekuatan_r_racik,KEKUATAN:t.kekuatan,JUMLAH_R_PAKAI:t.jumlah_r_pakai,SEDIAAN:t.sediaan,JUMLAH_R_RESEP:t.jumlah_r_resep}}async function mt(t){try{let a=await fetch("/inventory/search?opsi=tabel_penjualan_lama&id_penjualan="+encodeURIComponent(t),{credentials:"include",cache:"no-store"});if(!a.ok)return[];let e=await a.json();return(Array.isArray(e)?e:Object.values(e??{})).filter(i=>typeof i=="object"&&i!==null).map(ct).filter(i=>String(i.NO_R??"").trim()!=="")}catch{return[]}}async function dt(){let t=w.get("id_resep")||w.get("id")||w.get("penjualan")||"";if(!t)return[];try{let a=await fetch("/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id="+encodeURIComponent(t),{credentials:"include",cache:"no-store"});if(!a.ok)return[];let e=await a.json(),n=String(e?.ID_PENJUALAN??"").trim();if(n&&n!=="0"){let i=await mt(n);if(i.length)return i}return Array.isArray(e?.resep)?e.resep:[]}catch{return[]}}function pt(t){try{let a=new URL(t);if(a.protocol!=="http:"&&a.protocol!=="https:")return!1;let e=a.hostname.toLowerCase();return["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"].includes(e)?!0:e.endsWith(".rsudkotajambi.id")||e.endsWith(".ddev.site")}catch{return!1}}async function gt(t){try{let a="http://dev.rsudkotajambi.id/rs";try{let i=localStorage.getItem("ext-farmasi-app-base");i&&pt(i)&&(a=i.replace(/\/+$/,""))}catch{}let e=await fetch(a+"/api/queue/lookup?resep_id="+encodeURIComponent(t),{cache:"no-store",credentials:"omit",signal:AbortSignal.timeout(8e3)});if(!e.ok)return"";let n=await e.json();if(n.ok&&n.found&&n.queue?.queue_number)return n.queue.queue_number}catch{}return""}let w=new URLSearchParams(window.location.search),C=w.get("id_resep")||w.get("id")||w.get("penjualan")||"";await st();let K=await dt();if(K.length){v.length=0;let t=new Map;for(let a of K){let e=String(a.NO_R??"").trim();e&&(t.has(e)||t.set(e,[]),t.get(e).push(a))}for(let[a,e]of t){let n=e[0],i=String(n.JENIS_R??"").toLowerCase()==="racikan"||String(n.JENIS_RSP??"").toLowerCase()==="racikan",s=String(n.NAMA_RACIKAN??"").trim(),l=String(n.ATURAN_PAKAI_MANUAL??"").trim().replace(/^-\s*/,"").trim();if(i||e.length>1){let d={no:"R/"+a,name:s||"",jml:"",jumlahJadi:String(n.JUMLAH_RACIKAN??"").trim()||"",sediaan:s,aturan:l?[l]:[],subMeds:e.map(o=>({name:String(o.NAMA??"").trim(),strength:String(o.KEKUATAN_R_RACIK??o.KEKUATAN??"").trim(),dose:"",jmlPerR:String(o.JUMLAH_R_PAKAI??"").trim(),sediaan:String(o.SEDIAAN??"").trim()}))};v.push(d)}else{let d={no:"R/"+a,name:String(n.NAMA??"").trim(),jml:String(n.JUMLAH_R_RESEP??n.JUMLAH_R_PAKAI??"").trim(),jumlahJadi:"",sediaan:String(n.SEDIAAN??"").trim(),aturan:l?[l]:[],subMeds:[]};v.push(d)}}}!y.length&&L.length&&(y=L);let J=m.querySelector("#form_checklist_telaah_resep"),O=t=>{let a=[];if(!J)return a;let e=Array.from(J.querySelectorAll("table")).find(n=>u(n.querySelector("tr td"))===t);return e&&e.querySelectorAll("tr").forEach((n,i)=>{if(i===0)return;let s=n.querySelectorAll("td");if(s.length<2)return;let c=u(s[0]),l=u(s[1]);c&&l&&l!==t&&a.push([c,l])}),a},ut=O("Telaah Resep"),ht=O("Telaah Obat"),B=Array.from(m.querySelectorAll("center, strong")).find(t=>/Obat tidak boleh diganti/i.test(u(t))),ft=B?u(B):"Obat tidak boleh diganti tanpa sepengetahuan Dokter",q=(t,a,e="",n="")=>'<div class="tm-row'+(n?" "+n:"")+'"><span class="tm-label">'+r(t)+':</span><span class="tm-val'+(e?" "+e:"")+'">'+(a&&a.trim()?r(a):"-")+"</span></div>",F=[...y.length?[y.join(", ")]:[],...P.length?[P.join(", ")]:[]],p=t=>rt(t),T=p("Jenis Kelamin"),bt=/^perempuan$/i.test(T)?"P":/^laki-laki$/i.test(T)?"L":T,xt=(p("Nama Pasien")||"-")+(T?" ("+bt+")":""),At=(p("Dokter")||"-")+(p("Ruangan/Poli")?" / "+p("Ruangan/Poli"):""),G=t=>{for(let a of j.keys())if(t.test(a))return j.get(a)||"";return""},$=G(/alergi/i),E=G(/berat|\bbb\b/i),V=E?/\bkg\b/i.test(E)?E:E+" kg":"- kg",kt=($||"-")+" / "+(E?"BB "+V:V),yt=[["Pasien",xt,""],["No. RM",p("No. RM"),""],["Tgl. Lahir",p("Tgl. Lahir/Umur"),""],["Alergi & BB",kt,""],["Alamat",p("Alamat"),"long"],["No HP",p("No HP"),""]],wt=[["Dokter",At,""],["SIP Dokter",p("SIP Dokter"),""],["No Resep",p("No Resep"),""],["No SEP",H||"-",""],["Tanggal",p("Tanggal & Jam"),""],["Penjamin",p("Penjamin"),""]],Rt=q("Diagnosa",F.length?F.join(", "):"-","","long"),St='<section class="tm-card tm-card--small tm-card--left"><div class="tm-col">'+yt.map(([t,a,e])=>q(t,a,"",e)).join("")+Rt+"</div></section>",jt='<section class="tm-card tm-card--right"><div class="tm-col">'+wt.map(([t,a,e])=>q(t,a,"",e)).join("")+"</div></section>",Et=v.map(t=>{if(t.subMeds.length){let e=t.subMeds.map((d,o)=>{let g=d.jmlPerR||"";return'<div class="med-line'+(o>0?" indent":"")+'">'+(o===0?'<span class="med-no">'+r(t.no)+"</span> ":"")+'<span class="med-name">'+r(d.name)+"</span>"+(g?', <span class="med-jml">Jml: '+r(g)+"</span>":"")+"</div>"}).join(""),n=t.jumlahJadi?r(t.jumlahJadi):"",i=t.sediaan?r(t.sediaan):"Racikan",s=t.aturan.length?t.aturan.map(d=>r(d.replace(/^\(|\)$/g,""))).join(" "):"",c=n?"Jml "+n+" "+i+(s?" - ("+s+")":""):"",l=c?'<div class="med-jadiracik">'+c+"</div>":"";return'<div class="med">'+e+l+"</div>"}let a=t.jml||"";return'<div class="med"><div class="med-line"><span class="med-no">'+r(t.no)+'</span> <span class="med-name">'+r(t.name)+"</span>"+(a?', <span class="med-jml">Jml: '+r(a)+"</span>":"")+"</div>"+(t.aturan.length?'<div class="med-aturan">'+t.aturan.map(e=>r(e)).join("<br/>")+"</div>":"")+"</div>"}).join(""),I=z?Array.from(z.querySelectorAll("tr:first-child td")).map(t=>u(t)).filter(Boolean):["Hitung","Timbang","Kemas"];I.some(t=>/paraf/i.test(t))||I.push("Paraf");let _t=I.length,vt='<table class="t-admin"><thead><tr>'+I.map(t=>'<th class="l">'+r(t)+"</th>").join("")+"</tr></thead><tbody><tr>"+Array.from({length:_t}).map(()=>'<td class="blk"></td>').join("")+"</tr></tbody></table>",Y=(t,a)=>'<table class="t-check"><thead><tr><th class="l" colspan="2">'+r(t)+'</th><th class="yt">Y/T</th></tr></thead><tbody>'+a.map(([e,n])=>'<tr><td class="num">'+r(e)+"</td><td>"+r(n)+'</td><td class="yt"></td></tr>').join("")+"</tbody></table>",Tt='<header class="t-head"><img class="t-logo" alt="Logo" src="'+r(it)+'"/><div class="t-bhead"><h1 class="t-hname">'+r(_)+"</h1>"+(M[0]?'<div class="t-hsub">'+r(M[0])+"</div>":"")+'</div><div class="t-antrian">'+nt(ot)+'</div></header><main class="t-main"><section class="t-left">'+St+'<div class="t-meds">'+Et+"</div>"+vt+'</section><section class="t-right">'+jt+Y("Telaah Resep",ut)+Y("Telaah Obat",ht)+'<table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c" colspan="2">Waktu Tunggu</td></tr><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr><tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>'+'</section></main><footer class="t-footer">'+r(ft)+'</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';if(m.innerHTML=Tt,C){let t=m.querySelector(".t-antrian");gt(C).then(a=>{a&&t&&t.isConnected&&(t.textContent=a.replace(/^(.*?)(\d+)$/,`$1
$2`))})}let W=866;m.scrollHeight>W&&(m.classList.add("compact"),m.offsetHeight,m.scrollHeight>W&&(m.classList.remove("compact"),m.classList.add("ultra")));let Q="ext-telaah-style";if(!document.getElementById(Q)){let t=document.createElement("style");t.id=Q,t.textContent=`
        /* === PRINT CONTRACT: 105mm \xD7 241mm === */
        .halaman{box-sizing:border-box;width:105mm!important;height:auto!important;max-height:241mm;margin:0!important;padding:0 3mm}
        @page{size:105mm 241mm;margin:0}
        .halaman *{box-sizing:border-box;font-size:11px!important}
        .halaman{font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.25;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

        /* HEADER 3 kolom: logo | brand & alamat | no antrian */
        .t-head{display:flex;align-items:center;padding-bottom:6px;border-bottom:1.5px solid #000;margin-bottom:8px;gap:10px}
        .t-logo{width:50px;height:50px;object-fit:contain;object-position:left top;flex:none}
        .t-bhead{flex:1;font-size:11px;min-width:0}
        .t-hname{font-size:12px;font-weight:800;margin:0 0 2px;letter-spacing:-.01em}
        .t-hsub{line-height:1.2;font-size:10px}
        .t-antrian{flex:none;text-align:right;font-size:36px!important;font-weight:800;color:#198754;letter-spacing:-.02em;font-variant-numeric:tabular-nums;min-width:0;overflow-wrap:anywhere;line-height:1;white-space:pre-line}

        /* METADATA \u2014 grid: label kiri, nilai kanan (efisien tinggi) */
        .tm-card{background:#fff;padding:2px 0 4px;margin-bottom:4px;font-size:11px;border-bottom:0.5pt solid #333}
        .tm-card--small .tm-label{font-size:9px!important}
        .tm-card--small .tm-val{font-size:10px!important}
        .tm-col{display:flex;flex-direction:column;gap:3px}
        .tm-row{display:grid;grid-template-columns:35% 65%;column-gap:4px;align-items:start}
        .tm-card--left .tm-row{grid-template-columns:20% 65%}
        .tm-card--right .tm-row{grid-template-columns:30% 65%}
        .tm-label{color:#5b6470;font-size:10px;line-height:1.25;text-align:left}
        .tm-val{color:#000;line-height:1.25;word-wrap:break-word;overflow-wrap:anywhere}
        /* field panjang (alamat, diagnosa) tetap di grid 2 kolom biar wrap di kanan */
        .tm-row.long{display:grid}
        .tm-row.long .tm-label{display:block}

        /* MAIN 2 kolom \u2014 kiri lebih lebar utk nama obat */
        .t-main{display:grid;grid-template-columns:62% 38%;gap:6px;align-items:start}
        .t-left,.t-right{display:flex;flex-direction:column;gap:5px;min-width:0}
        .t-right .t-check{margin-bottom:0}
        .t-meds{margin-bottom:8px;font-size:11px;min-width:0}

        /* DAFTAR OBAT */
        .med{margin-bottom:6px}
        .med-line{font-size:11px;line-height:1.35;text-align:left}
        .med-line.indent{margin-left:0}
        .med-no{font-weight:400}
        .med-name{font-weight:600}
        .med-sep{color:#374151}
        .med-jml{white-space:nowrap;font-weight:600;color:#047857}
        .med-aturan{margin-left:0;font-size:10px;color:#374151;margin-top:1px}
        .med-jadiracik{margin-top:3px;padding-top:1px;font-size:11px;font-weight:700}

        /* TABEL \u2014 checklist (font sama dengan info pasien & dokter = 10px) */
        table{width:100%;border-collapse:collapse;font-size:10px}
        .halaman th,.halaman td{border:0.5pt solid #333;padding:1px 3px;font-weight:400;font-size:10px!important;line-height:1.2}
        thead th{font-weight:400}
        .yt{width:32px;text-align:center}
        .num{width:16px;text-align:center}
        .l{text-align:left}
        .c{text-align:center}
        .half{width:50%}
        .third{width:33.333%}
        .twothird{width:66.667%}
        .blk{height:40px;padding:.5pt 3px}
        .blk2{min-height:10px}
        .blk3{min-height:35px}
        .blk4{height:40px;padding:.5pt 3px}
        .t-sub{text-align:center;font-size:10px!important;margin:3px 0}

        /* FOOTER + BUTTON */
        .t-footer{margin-top:10px;text-align:center;font-weight:700;font-style:italic;font-size:11px}
        .t-print{margin-top:24px;display:flex;gap:8px}
        .t-btn{border:1px solid #d1d5db;background:#fff;border-radius:6px;padding:6px 14px;font-size:11px;cursor:pointer}
        .t-btn:hover{background:#f9fafb}
        @media print{.no-print{display:none!important}}

        /* === ADAPTIVE DENSITY (gentle fallback) === */
        .halaman.compact .t-head{padding-bottom:4px;margin-bottom:6px;gap:8px}
        .halaman.compact .t-logo{width:45px;height:45px}
        .halaman.compact .t-hname{font-size:11px!important}
        .halaman.compact .t-antrian{font-size:30px!important}
        .halaman.compact .tm-card{padding:1px 0 2px;margin-bottom:2px}
        .halaman.compact .tm-col{gap:2px}
        .halaman.compact .tm-label{font-size:9px!important}
        .halaman.compact .tm-val{font-size:10px!important}
        .halaman.compact .t-main{gap:4px}
        .halaman.compact .t-left,.halaman.compact .t-right{gap:3px}
        .halaman.compact .t-meds{margin-bottom:4px}
        .halaman.compact .med{margin-bottom:3px}
        .halaman.compact .blk{height:30px}
        .halaman.compact .blk3{min-height:25px}
        .halaman.compact .blk4{height:30px}
        .halaman.compact .t-footer{margin-top:6px}

        .halaman.ultra .t-head{padding-bottom:3px;margin-bottom:4px;gap:6px}
        .halaman.ultra .t-logo{width:40px;height:40px}
        .halaman.ultra .t-hname{font-size:10px!important}
        .halaman.ultra .t-antrian{font-size:26px!important}
        .halaman.ultra .tm-card{padding:1px 0;margin-bottom:1px}
        .halaman.ultra .tm-col{gap:1px}
        .halaman.ultra .tm-label{font-size:8px!important}
        .halaman.ultra .tm-val{font-size:9px!important}
        .halaman.ultra .t-main{gap:3px}
        .halaman.ultra .t-left,.halaman.ultra .t-right{gap:2px}
        .halaman.ultra .t-meds{margin-bottom:2px}
        .halaman.ultra .med{margin-bottom:2px}
        .halaman.ultra .med-line{font-size:10px!important}
        .halaman.ultra .blk{height:30px}
        .halaman.ultra .blk3{min-height:20px}
        .halaman.ultra .blk4{height:30px}
        .halaman.ultra .t-footer{margin-top:4px;font-size:10px!important}
      `,document.head.appendChild(t)}}let x=h,A=Date.now(),f=window.setInterval(()=>{document.documentElement.getAttribute("data-ext-telaah")==="1"?(window.clearInterval(f),x()):Date.now()-A>5e3&&window.clearInterval(f)},200)});})();
