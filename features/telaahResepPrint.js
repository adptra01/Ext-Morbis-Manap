"use strict";var __morbis_feature=(()=>{var at="extensionConfig";function Nt(h,x,A){let f=x?.features?.[h];if(!f)return!0;if(f.enabled===!1)return!1;let S=A??x?.currentRole??"admin";if(S==="admin")return!0;let k=f.allowedRoles;return!Array.isArray(k)||k.length===0?!0:k.includes(S)}async function Lt(h){try{let A=(await chrome.storage.sync.get(at))?.[at]??null;return Nt(h,A)}catch{return!0}}function nt(h,x){Lt(h).then(A=>{if(A)try{x()}catch(f){console.error(`[featureGate:${h}] gagal jalan:`,f)}})}nt("telaahResep",function(){"use strict";async function h(){let S="ext-telaah-proc",k=document.querySelector(".halaman");if(!k||k.getAttribute(S))return;let m=k;m.setAttribute(S,"1");let u=t=>(t?.textContent||"").replace(/\s+/g," ").trim();function o(t){return String(t??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}let it=t=>t?o(t.replace(/^(.*?)(\d+)$/,`$1
$2`)):"-",rt=m.querySelector("#logo img")?.getAttribute("src")||"/assets/images/logo/Kota Jambi.png",_="RSUD H. ABDUL MANAP",N=[],L=m.querySelector("#head-cetak-logo");if(L){let t=L.querySelector("b");_=t?u(t):_;let a=document.createElement("div");a.innerHTML=L.innerHTML.replace(/<br\s*\/?>/gi,`
`),N=(a.textContent||"").split(`
`).map(e=>e.trim()).filter(Boolean).filter(e=>e!==_)}let j=new Map,P=[];m.querySelectorAll(".halaman > table:first-of-type table").forEach(t=>{t.querySelectorAll("tr").forEach(a=>{let e=a.querySelectorAll("td");if(e.length<2)return;let n=u(e[0]),i=u(e[1]).replace(/^:\s*/,"");if(n&&!j.has(n)&&j.set(n,i),/^diagnosa$/i.test(n)){let r=(e[1].innerHTML||"").replace(/<br\s*\/?>/gi,`
`),l=document.createElement("div");l.innerHTML=r,P=(l.textContent||"").split(`
`).map(c=>c.trim()).filter(c=>c&&!/^:/.test(c)&&!/tidak ada/i.test(c))}})});let ot=t=>j.get(t)??"",v=[],C=Array.from(m.querySelectorAll("table.resep-item"))[1],U="",D="",y=[],H=[],st="",q="",E="";async function lt(){let t=new URLSearchParams(window.location.search),a=t.get("id_resep")||t.get("id")||t.get("penjualan")||"";if(!a)return;let e="/inventory/resep/penerimaan/detail?id="+a;try{let n=await fetch(e,{credentials:"include"});if(!n.ok)return;let i=await n.text(),r=new DOMParser().parseFromString(i,"text/html"),l=s=>(r.querySelector("#"+s)||r.querySelector('input[name="'+s+'"]')||r.querySelector('input[id*="'+s+'"]')||r.querySelector("textarea#"+s)||r.querySelector('textarea[name="'+s+'"]'))?.value?.trim()||"";U=l("id_visit")||t.get("visit")||U,D=l("id_kunjungan")||D,q=l("no_sep")||q,E=l("catatan")||E;let d=Array.from(r.querySelectorAll("fieldset#perhatian")).find(s=>{let g=s.querySelector("legend");return g&&/riwayat\s*diagnosa\s*pasien/i.test(u(g))});if(d){let s=Array.from(d.querySelectorAll("li")).map(b=>u(b)).filter(Boolean),g=-1,Mt=Array.from(d.querySelectorAll("strong, b"));for(let b of Mt)if(/diagnosa\s*sekunder/i.test(u(b))){let Z=b.closest("li");if(Z){let R=Array.from(d.querySelectorAll("li")).indexOf(Z);R>=0&&(g=R)}else{let R=b.nextElementSibling;if(R&&R.tagName==="OL"){let tt=R.querySelector("li");if(tt){let et=Array.from(d.querySelectorAll("li")).indexOf(tt);et>=0&&(g=et)}}}break}g>=0&&g<s.length?(y=s.slice(0,g),H=s.slice(g).filter(b=>b&&!/tidak ada/i.test(b))):s.length&&(y=s)}}catch{}}function ct(t){let a=l=>typeof l=="string"?l.trim():"",e=a(t.nama_barang),n=a(t.kekuatan),i=a(t.sediaan),r=a(t.satuan);return n&&(e+=(e?" ":"")+n),i&&(e+=(e?", ":"")+i),r&&(e+=(e?" @":"")+r),e}function mt(t){return{NO_R:t.no_r,JENIS_R:t.jenis_r,JENIS_RSP:t.jenis_r,NAMA_RACIKAN:t.nama_racikan,ATURAN_PAKAI_MANUAL:t.aturan_pakai_manual,JUMLAH_RACIKAN:t.jumlah_racikan,NAMA:ct(t),KEKUATAN_R_RACIK:t.kekuatan_r_racik,KEKUATAN:t.kekuatan,JUMLAH_R_PAKAI:t.jumlah_r_pakai,SEDIAAN:t.sediaan,JUMLAH_R_RESEP:t.jumlah_r_resep}}async function dt(t){try{let a=await fetch("/inventory/search?opsi=tabel_penjualan_lama&id_penjualan="+encodeURIComponent(t),{credentials:"include",cache:"no-store"});if(!a.ok)return[];let e=await a.json();return(Array.isArray(e)?e:Object.values(e??{})).filter(i=>typeof i=="object"&&i!==null).map(mt).filter(i=>String(i.NO_R??"").trim()!=="")}catch{return[]}}async function pt(){let t=w.get("id_resep")||w.get("id")||w.get("penjualan")||"";if(!t)return[];try{let a=await fetch("/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id="+encodeURIComponent(t),{credentials:"include",cache:"no-store"});if(!a.ok)return[];let e=await a.json(),n=String(e?.CATATAN??"").trim();n!==""&&(E=n);let i=String(e?.ID_PENJUALAN??"").trim();if(i&&i!=="0"){let r=await dt(i);if(r.length)return r}return Array.isArray(e?.resep)?e.resep:[]}catch{return[]}}function gt(t){try{let a=new URL(t);if(a.protocol!=="http:"&&a.protocol!=="https:")return!1;let e=a.hostname.toLowerCase();return["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"].includes(e)?!0:e.endsWith(".rsudkotajambi.id")||e.endsWith(".ddev.site")}catch{return!1}}async function ut(t){try{let a="http://dev.rsudkotajambi.id/rs";try{let i=localStorage.getItem("ext-farmasi-app-base");i&&gt(i)&&(a=i.replace(/\/+$/,""))}catch{}let e=await fetch(a+"/api/queue/lookup?resep_id="+encodeURIComponent(t),{cache:"no-store",credentials:"omit",signal:AbortSignal.timeout(8e3)});if(!e.ok)return"";let n=await e.json();if(n.ok&&n.found&&n.queue?.queue_number)return n.queue.queue_number}catch{}return""}let w=new URLSearchParams(window.location.search),K=w.get("id_resep")||w.get("id")||w.get("penjualan")||"";await lt();let J=await pt();if(J.length){v.length=0;let t=new Map;for(let a of J){let e=String(a.NO_R??"").trim();e&&(t.has(e)||t.set(e,[]),t.get(e).push(a))}for(let[a,e]of t){let n=e[0],i=String(n.JENIS_R??"").toLowerCase()==="racikan"||String(n.JENIS_RSP??"").toLowerCase()==="racikan",r=String(n.NAMA_RACIKAN??"").trim(),c=String(n.ATURAN_PAKAI_MANUAL??"").trim().replace(/^-\s*/,"").trim();if(i||e.length>1){let d={no:"R/"+a,name:r||"",jml:"",jumlahJadi:String(n.JUMLAH_RACIKAN??"").trim()||"",sediaan:r,aturan:c?[c]:[],subMeds:e.map(s=>({name:String(s.NAMA??"").trim(),strength:String(s.KEKUATAN_R_RACIK??s.KEKUATAN??"").trim(),dose:"",jmlPerR:String(s.JUMLAH_R_PAKAI??"").trim(),sediaan:String(s.SEDIAAN??"").trim()}))};v.push(d)}else{let d={no:"R/"+a,name:String(n.NAMA??"").trim(),jml:String(n.JUMLAH_R_RESEP??n.JUMLAH_R_PAKAI??"").trim(),jumlahJadi:"",sediaan:String(n.SEDIAAN??"").trim(),aturan:c?[c]:[],subMeds:[]};v.push(d)}}}!y.length&&P.length&&(y=P);let O=m.querySelector("#form_checklist_telaah_resep"),B=t=>{let a=[];if(!O)return a;let e=Array.from(O.querySelectorAll("table")).find(n=>u(n.querySelector("tr td"))===t);return e&&e.querySelectorAll("tr").forEach((n,i)=>{if(i===0)return;let r=n.querySelectorAll("td");if(r.length<2)return;let l=u(r[0]),c=u(r[1]);l&&c&&c!==t&&a.push([l,c])}),a},ht=B("Telaah Resep"),ft=B("Telaah Obat"),F=Array.from(m.querySelectorAll("center, strong")).find(t=>/Obat tidak boleh diganti/i.test(u(t))),bt=F?u(F):"Obat tidak boleh diganti tanpa sepengetahuan Dokter",z=(t,a,e="",n="")=>'<div class="tm-row'+(n?" "+n:"")+'"><span class="tm-label">'+o(t)+':</span><span class="tm-val'+(e?" "+e:"")+'">'+(a&&a.trim()?o(a):"-")+"</span></div>",G=[...y.length?[y.join(", ")]:[],...H.length?[H.join(", ")]:[]],p=t=>ot(t),I=p("Jenis Kelamin"),xt=/^perempuan$/i.test(I)?"P":/^laki-laki$/i.test(I)?"L":I,At=(p("Nama Pasien")||"-")+(I?" ("+xt+")":""),kt=(p("Dokter")||"-")+(p("Ruangan/Poli")?" / "+p("Ruangan/Poli"):""),$=t=>{for(let a of j.keys())if(t.test(a))return j.get(a)||"";return""},V=$(/alergi/i),T=$(/berat|\bbb\b/i),Y=T?/\bkg\b/i.test(T)?T:T+" kg":"- kg",yt=(V||"-")+" / "+(T?"BB "+Y:Y),wt=[["Pasien",At,""],["No. RM",p("No. RM"),""],["Tgl. Lahir",p("Tgl. Lahir/Umur"),""],["Alergi & BB",yt,""],["Alamat",p("Alamat"),"long"],["No HP",p("No HP"),""]],Rt=[["Dokter",kt,""],["SIP Dokter",p("SIP Dokter"),""],["No Resep",p("No Resep"),""],["No SEP",q||"-",""],["Tanggal",p("Tanggal & Jam"),""],["Penjamin",p("Penjamin"),""]],St=z("Diagnosa",G.length?G.join(", "):"-","","long"),jt='<section class="tm-card tm-card--small tm-card--left"><div class="tm-col">'+wt.map(([t,a,e])=>z(t,a,"",e)).join("")+St+"</div></section>",Et='<section class="tm-card tm-card--right"><div class="tm-col">'+Rt.map(([t,a,e])=>z(t,a,"",e)).join("")+"</div></section>",Tt=v.map(t=>{if(t.subMeds.length){let e=t.subMeds.map((d,s)=>{let g=d.jmlPerR||"";return'<div class="med-line'+(s>0?" indent":"")+'">'+(s===0?'<span class="med-no">'+o(t.no)+"</span> ":"")+'<span class="med-name">'+o(d.name)+"</span>"+(g?', <span class="med-jml">Jml: '+o(g)+"</span>":"")+"</div>"}).join(""),n=t.jumlahJadi?o(t.jumlahJadi):"",i=t.sediaan?o(t.sediaan):"Racikan",r=t.aturan.length?t.aturan.map(d=>o(d.replace(/^\(|\)$/g,""))).join(" "):"",l=n?"Jml "+n+" "+i+(r?" - ("+r+")":""):"",c=l?'<div class="med-jadiracik">'+l+"</div>":"";return'<div class="med">'+e+c+"</div>"}let a=t.jml||"";return'<div class="med"><div class="med-line"><span class="med-no">'+o(t.no)+'</span> <span class="med-name">'+o(t.name)+"</span>"+(a?', <span class="med-jml">Jml: '+o(a)+"</span>":"")+"</div>"+(t.aturan.length?'<div class="med-aturan">'+t.aturan.map(e=>o(e)).join("<br/>")+"</div>":"")+"</div>"}).join(""),M=C?Array.from(C.querySelectorAll("tr:first-child td")).map(t=>u(t)).filter(Boolean):["Hitung","Timbang","Kemas"];M.some(t=>/paraf/i.test(t))||M.push("Paraf");let _t=M.length,vt='<table class="t-admin"><thead><tr>'+M.map(t=>'<th class="l">'+o(t)+"</th>").join("")+"</tr></thead><tbody><tr>"+Array.from({length:_t}).map(()=>'<td class="blk"></td>').join("")+"</tr></tbody></table>",W=(t,a)=>'<table class="t-check"><thead><tr><th class="l" colspan="2">'+o(t)+'</th><th class="yt">Y/T</th></tr></thead><tbody>'+a.map(([e,n])=>'<tr><td class="num">'+o(e)+"</td><td>"+o(n)+'</td><td class="yt"></td></tr>').join("")+"</tbody></table>",It='<header class="t-head"><img class="t-logo" alt="Logo" src="'+o(rt)+'"/><div class="t-bhead"><h1 class="t-hname">'+o(_)+"</h1>"+(N[0]?'<div class="t-hsub">'+o(N[0])+"</div>":"")+'</div><div class="t-antrian">'+it(st)+'</div></header><main class="t-main"><section class="t-left">'+jt+'<div class="t-meds">'+Tt+"</div>"+(E.trim()!==""?'<div class="t-catatan"><div class="t-catatan-title">Catatan</div><div class="t-catatan-body">'+o(E).split(`
`).map(t=>t.trim()).filter(Boolean).join("<br/>")+"</div></div>":"")+vt+'</section><section class="t-right">'+Et+W("Telaah Resep",ht)+W("Telaah Obat",ft)+'<table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c" colspan="2">Waktu Tunggu</td></tr><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr><tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>'+'</section></main><footer class="t-footer">'+o(bt)+'</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';if(m.innerHTML=It,K){let t=m.querySelector(".t-antrian");ut(K).then(a=>{a&&t&&t.isConnected&&(t.textContent=a.replace(/^(.*?)(\d+)$/,`$1
$2`))})}let Q=866;m.scrollHeight>Q&&(m.classList.add("compact"),m.offsetHeight,m.scrollHeight>Q&&(m.classList.remove("compact"),m.classList.add("ultra")));let X="ext-telaah-style";if(!document.getElementById(X)){let t=document.createElement("style");t.id=X,t.textContent=`
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
        .med{margin-bottom:6px}        .med-line{font-size:11px;line-height:1.35;text-align:left}
        .med-line.indent{margin-left:0}
        .med-no{font-weight:400}
        .med-name{font-weight:600}
        .med-sep{color:#374151}
        .med-jml{white-space:nowrap;font-weight:600;color:#047857}
        .med-aturan{margin-left:0;font-size:10px;color:#374151;margin-top:1px}
        .med-jadiracik{margin-top:3px;padding-top:1px;font-size:11px;font-weight:700}

        /* CATATAN resep (dari textarea #catatan halaman detail) */
        .t-catatan{margin-bottom:8px;border:1px solid #f87171;border-radius:4px;padding:4px 6px;background:#fef2f2}
        .t-catatan-title{font-weight:700;font-size:10px;color:#b91c1c;margin-bottom:2px}
        .t-catatan-body{font-size:11px;color:#7f1d1d;line-height:1.35;white-space:normal}

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
