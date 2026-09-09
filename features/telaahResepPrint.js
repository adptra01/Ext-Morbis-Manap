"use strict";var __morbis_feature=(()=>{(function(){"use strict";async function tt(){let z="ext-telaah-proc",v=document.querySelector(".halaman");if(!v||v.getAttribute(z))return;let s=v;s.setAttribute(z,"1");let g=t=>(t?.textContent||"").replace(/\s+/g," ").trim();function i(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let nt=s.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",y="RSUD H. ABDUL MANAP",T=[],M=s.querySelector("#head-cetak-logo");if(M){let t=M.querySelector("b");y=t?g(t):y;let e=document.createElement("div");e.innerHTML=M.innerHTML.replace(/<br\s*\/?>/gi,`
`),T=(e.textContent||"").split(`
`).map(a=>a.trim()).filter(Boolean).filter(a=>a!==y)}let A=new Map,E=[];s.querySelectorAll(".halaman > table:first-of-type table").forEach(t=>{t.querySelectorAll("tr").forEach(e=>{let a=e.querySelectorAll("td");if(a.length<2)return;let n=g(a[0]),o=g(a[1]).replace(/^:\s*/,"");if(n&&!A.has(n)&&A.set(n,o),/^diagnosa$/i.test(n)){let p=(a[1].innerHTML||"").replace(/<br\s*\/?>/gi,`
`),l=document.createElement("div");l.innerHTML=p,E=(l.textContent||"").split(`
`).map(r=>r.trim()).filter(r=>r&&!/^:/.test(r)&&!/tidak ada/i.test(r))}})});let it=t=>A.get(t)??"",S=[],N=Array.from(s.querySelectorAll("table.resep-item"))[1],_="",D="",b=[],I=[],L="",H="";async function rt(){let t=new URLSearchParams(window.location.search),e=t.get("id_resep")||t.get("id")||t.get("penjualan")||"";if(!e)return;let a=["/inventory/resep/penerimaan/detail?id="+e,"/inventory/penjualan-resep-edit/detail?id="+e];for(let n of a)try{let o=await fetch(n,{credentials:"include"});if(!o.ok)continue;let p=await o.text(),l=new DOMParser().parseFromString(p,"text/html"),r=m=>(l.querySelector("#"+m)||l.querySelector('input[name="'+m+'"]')||l.querySelector('input[id*="'+m+'"]'))?.value?.trim()||"";_=r("id_visit")||t.get("visit")||_,D=r("id_kunjungan")||D,H=r("no_sep")||H;let c=Array.from(l.querySelectorAll("fieldset#perhatian")).find(m=>{let h=m.querySelector("legend");return h&&/riwayat\s*diagnosa\s*pasien/i.test(g(h))});if(c){let m=Array.from(c.querySelectorAll("li")).map(f=>g(f)).filter(Boolean),h=-1,jt=Array.from(c.querySelectorAll("strong, b"));for(let f of jt)if(/diagnosa\s*sekunder/i.test(g(f))){let W=f.closest("li");if(W){let k=Array.from(c.querySelectorAll("li")).indexOf(W);k>=0&&(h=k)}else{let k=f.nextElementSibling;if(k&&k.tagName==="OL"){let X=k.querySelector("li");if(X){let Z=Array.from(c.querySelectorAll("li")).indexOf(X);Z>=0&&(h=Z)}}}break}h>=0&&h<m.length?(b=m.slice(0,h),I=m.slice(h).filter(f=>f&&!/tidak ada/i.test(f))):m.length&&(b=m)}if(b.length)break}catch{}}async function ot(){let t=x.get("id_resep")||x.get("id")||x.get("penjualan")||"";if(!t)return[];try{let e=await fetch("/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id="+encodeURIComponent(t),{credentials:"include",cache:"no-store"});if(!e.ok)return[];let a=await e.json();return Array.isArray(a?.resep)?a.resep:[]}catch{return[]}}async function st(t){try{let e="http://dev.rsudkotajambi.id/rs";try{let o=localStorage.getItem("ext-farmasi-app-base");o&&/^https?:\/\//.test(o)&&(e=o.replace(/\/+$/,""))}catch{}let a=await fetch(e+"/api/queue/lookup?resep_id="+encodeURIComponent(t),{cache:"no-store",credentials:"omit"});if(!a.ok)return"";let n=await a.json();if(n.ok&&n.found&&n.queue?.queue_number)return n.queue.queue_number}catch{}return""}let x=new URLSearchParams(window.location.search),U=x.get("id_resep")||x.get("id")||x.get("penjualan")||"";L=U?await st(U):"",await rt();let J=await ot();if(J.length){S.length=0;let t=new Map;for(let e of J){let a=String(e.NO_R??"").trim();a&&(t.has(a)||t.set(a,[]),t.get(a).push(e))}for(let[e,a]of t){let n=a[0],o=String(n.JENIS_R??"").toLowerCase()==="racikan"||String(n.JENIS_RSP??"").toLowerCase()==="racikan",p=String(n.NAMA_RACIKAN??"").trim(),r=String(n.ATURAN_PAKAI_MANUAL??"").trim().replace(/^-\s*/,"").trim();if(o||a.length>1){let u={no:"R/"+e,name:p||"",jml:"",jumlahJadi:String(n.JUMLAH_RACIKAN??"").trim()||"",sediaan:p,aturan:r?[r]:[],subMeds:a.map(c=>({name:String(c.NAMA??"").trim(),strength:String(c.KEKUATAN_R_RACIK??c.KEKUATAN??"").trim(),dose:"",jmlPerR:String(c.JUMLAH_R_PAKAI??"").trim(),sediaan:String(c.SEDIAAN??"").trim()}))};S.push(u)}else{let u={no:"R/"+e,name:String(n.NAMA??"").trim(),jml:String(n.JUMLAH_R_RESEP??n.JUMLAH_R_PAKAI??"").trim(),jumlahJadi:"",sediaan:String(n.SEDIAAN??"").trim(),aturan:r?[r]:[],subMeds:[]};S.push(u)}}}!b.length&&E.length&&(b=E);let K=s.querySelector("#form_checklist_telaah_resep"),O=t=>{let e=[];if(!K)return e;let a=Array.from(K.querySelectorAll("table")).find(n=>g(n.querySelector("tr td"))===t);return a&&a.querySelectorAll("tr").forEach((n,o)=>{if(o===0)return;let p=n.querySelectorAll("td");if(p.length<2)return;let l=g(p[0]),r=g(p[1]);l&&r&&r!==t&&e.push([l,r])}),e},lt=O("Telaah Resep"),ct=O("Telaah Obat"),B=Array.from(s.querySelectorAll("center, strong")).find(t=>/Obat tidak boleh diganti/i.test(g(t))),mt=B?g(B):"Obat tidak boleh diganti tanpa sepengetahuan Dokter",P=(t,e,a="",n="")=>'<div class="tm-row'+(n?" "+n:"")+'"><span class="tm-label">'+i(t)+':</span><span class="tm-val'+(a?" "+a:"")+'">'+(e&&e.trim()?i(e):"-")+"</span></div>",C=[...b.length?[b.join(", ")]:[],...I.length?[I.join(", ")]:[]],d=t=>it(t),j=d("Jenis Kelamin"),dt=/^perempuan$/i.test(j)?"P":/^laki-laki$/i.test(j)?"L":j,pt=(d("Nama Pasien")||"-")+(j?" ("+dt+")":""),gt=(d("Dokter")||"-")+(d("Ruangan/Poli")?" / "+d("Ruangan/Poli"):""),$=t=>{for(let e of A.keys())if(t.test(e))return A.get(e)||"";return""},F=$(/alergi/i),w=$(/berat|\bbb\b/i),G=w?/\bkg\b/i.test(w)?w:w+" kg":"- kg",ht=(F||"-")+" / "+(w?"BB "+G:G),ut=[["Pasien",pt,""],["No. RM",d("No. RM"),""],["Tgl. Lahir",d("Tgl. Lahir/Umur"),""],["Alergi & BB",ht,""],["Alamat",d("Alamat"),"long"],["No HP",d("No HP"),""]],ft=[["Dokter",gt,""],["SIP Dokter",d("SIP Dokter"),""],["No Resep",d("No Resep"),""],["No SEP",H||"-",""],["Tanggal",d("Tanggal & Jam"),""],["Penjamin",d("Penjamin"),""]],bt=P("Diagnosa",C.length?C.join(", "):"-","","long"),xt='<section class="tm-card tm-card--small tm-card--left"><div class="tm-col">'+ut.map(([t,e,a])=>P(t,e,"",a)).join("")+bt+"</div></section>",kt='<section class="tm-card tm-card--right"><div class="tm-col">'+ft.map(([t,e,a])=>P(t,e,"",a)).join("")+"</div></section>",At=S.map(t=>{if(t.subMeds.length){let a=t.subMeds.map((u,c)=>{let m=u.jmlPerR||"";return'<div class="med-line'+(c>0?" indent":"")+'">'+(c===0?'<span class="med-no">'+i(t.no)+"</span> ":"")+'<span class="med-name">'+i(u.name)+"</span>"+(m?', <span class="med-jml">Jml: '+i(m)+"</span>":"")+"</div>"}).join(""),n=t.jumlahJadi?i(t.jumlahJadi):"",o=t.sediaan?i(t.sediaan):"Racikan",p=t.aturan.length?t.aturan.map(u=>i(u.replace(/^\(|\)$/g,""))).join(" "):"",l=n?"Jml "+n+" "+o+(p?" - ("+p+")":""):"",r=l?'<div class="med-jadiracik">'+l+"</div>":"";return'<div class="med">'+a+r+"</div>"}let e=t.jml||"";return'<div class="med"><div class="med-line"><span class="med-no">'+i(t.no)+'</span> <span class="med-name">'+i(t.name)+"</span>"+(e?', <span class="med-jml">Jml: '+i(e)+"</span>":"")+"</div>"+(t.aturan.length?'<div class="med-aturan">'+t.aturan.map(a=>i(a)).join("<br/>")+"</div>":"")+"</div>"}).join(""),R=N?Array.from(N.querySelectorAll("tr:first-child td")).map(t=>g(t)).filter(Boolean):["Hitung","Timbang","Kemas"];R.some(t=>/paraf/i.test(t))||R.push("Paraf");let wt=R.length,yt='<table class="t-admin"><thead><tr>'+R.map(t=>'<th class="l">'+i(t)+"</th>").join("")+"</tr></thead><tbody><tr>"+Array.from({length:wt}).map(()=>'<td class="blk"></td>').join("")+"</tr></tbody></table>",V=(t,e)=>'<table class="t-check"><thead><tr><th class="l" colspan="2">'+i(t)+'</th><th class="yt">Y/T</th></tr></thead><tbody>'+e.map(([a,n])=>'<tr><td class="num">'+i(a)+"</td><td>"+i(n)+'</td><td class="yt"></td></tr>').join("")+"</tbody></table>",St='<header class="t-head"><img class="t-logo" alt="Logo" src="'+i(nt)+'"/><div class="t-bhead"><h1 class="t-hname">'+i(y)+"</h1>"+(T[0]?'<div class="t-hsub">'+i(T[0])+"</div>":"")+"</div>"+(L?'<div class="t-antrian">'+i(L.replace(/^(.*?)(\d+)$/,`$1
$2`))+"</div>":"")+'</header><main class="t-main"><section class="t-left">'+xt+'<div class="t-meds">'+At+"</div>"+yt+'</section><section class="t-right">'+kt+V("Telaah Resep",lt)+V("Telaah Obat",ct)+'<table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c" colspan="2">Waktu Tunggu</td></tr><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr><tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>'+'</section></main><footer class="t-footer">'+i(mt)+'</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';s.innerHTML=St;let Y=866;s.scrollHeight>Y&&(s.classList.add("compact"),s.offsetHeight,s.scrollHeight>Y&&(s.classList.remove("compact"),s.classList.add("ultra")));let Q="ext-telaah-style";if(!document.getElementById(Q)){let t=document.createElement("style");t.id=Q,t.textContent=`
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
      `,document.head.appendChild(t)}}let et=tt,at=Date.now(),q=window.setInterval(()=>{document.documentElement.getAttribute("data-ext-telaah")==="1"?(window.clearInterval(q),et()):Date.now()-at>5e3&&window.clearInterval(q)},200)})();})();
