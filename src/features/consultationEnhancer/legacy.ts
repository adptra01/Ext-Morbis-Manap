const PATIENT_INFO_TABS = [
  {
    id: 'resep',
    label: 'History Resep',
    ajax: {
      url: '/admisi/pengajuan_konsultasi/tabel-resep',
      method: 'POST' as const,
      data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
    },
  },
  {
    id: 'dokumen',
    label: 'Dokumen Pasien',
    ajax: {
      url: '/admisi/pengajuan_konsultasi/tabel-dok',
      method: 'POST' as const,
      data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
    },
  },
  {
    id: 'cppt',
    label: 'CPPT',
    ajax: {
      url: '/admisi/pengajuan_konsultasi/tabel-cppt',
      method: 'POST' as const,
      data: (visit: string, noRm: string) => ({ id_visit: visit, id_pasien: noRm, page: 1 }),
    },
  },
];

export function injectStyle(): void {
  if (document.getElementById('morbis-cons-css')) return;
  const s = document.createElement('style');
  s.id = 'morbis-cons-css';
  s.textContent = [
    '.morbis-cons-hide { display:none !important; }',
    '.morbis-cons-btn { display:inline-block; padding:4px 8px; margin:2px; font-size:11px; font-weight:600; border:1px solid #d1d5db; border-radius:4px; cursor:pointer; background:#fff; color:#374151; }',
    '.morbis-cons-btn:hover { background:#f3f4f6; }',
    '.morbis-cons-detail { }',
    '.morbis-cons-detail:hover { }',
    '.morbis-cons-info { }',
    '.morbis-cons-info:hover { }',
    '.morbis-cons-overlay { display:flex; align-items:center; justify-content:center; position:fixed; z-index:99999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); }',
    '.morbis-cons-content { background:#fff; margin:0; padding:0; width:80%; max-width:900px; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.2); max-height:85vh; display:flex; flex-direction:column; }',
    '.morbis-cons-header { background:#111827; color:#fff; padding:15px 20px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; }',
    '.morbis-cons-header h2 { margin:0; font-size:18px; font-weight:600; color:#fff; }',
    '.morbis-cons-close { color:#fff; font-size:28px; font-weight:bold; cursor:pointer; background:none; border:none; padding:0; line-height:1; }',
    '.morbis-cons-close:hover { opacity:0.8; }',
    '.morbis-cons-body { padding:20px; overflow-y:auto; flex:1; }',
    '.morbis-cons-body label { font-weight:600; color:#374151; display:block; margin:15px 0 5px; font-size:14px; }',
    '.morbis-cons-body label:first-child { margin-top:0; }',
    '.morbis-cons-fv { background:#f9fafb; padding:12px 15px; border-radius:6px; border-left:4px solid #9ca3af; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word; max-height:300px; overflow-y:auto; }',
    '.morbis-cons-tab-bar { background:#f9fafb; padding:0 20px; display:flex; gap:2px; border-bottom:2px solid #e5e7eb; flex-shrink:0; }',
    '.morbis-tab-btn { padding:10px 18px; font-size:13px; font-weight:500; border:none; background:transparent; color:#6b7280; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-2px; transition:color 0.15s,background-color 0.15s; }',
    '.morbis-tab-btn:hover { color:#111827; background:#f3f4f6; }',
    '.morbis-tab-btn.morbis-tab-active { color:#111827; background:#fff; border-bottom-color:#111827; }',
    '.morbis-tab-panel { display:none; }',
    '.morbis-tab-panel.morbis-tab-active { display:block; }',

    'table.tabel.tabel-compact,table.table-input.tabel-compact{width:100%!important;border-collapse:collapse!important;font-size:14px!important;table-layout:auto!important;}',
    'table.tabel.tabel-compact th,table.table-input.tabel-compact th{background:#374151!important;color:#fff!important;font-weight:600!important;padding:10px 12px!important;border:1px solid #4b5563!important;white-space:nowrap!important;}',
    'table.tabel.tabel-compact td,table.table-input.tabel-compact td{padding:8px 12px!important;border:1px solid #e5e7eb!important;vertical-align:top!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:200px!important;}',
    'table.tabel.tabel-compact td:nth-child(3),table.table-input.tabel-compact td:nth-child(3){font-weight:600!important;color:#111827!important;min-width:130px!important;}',
    'table.tabel.tabel-compact tr:nth-child(even),table.table-input.tabel-compact tr:nth-child(even){background:#f9fafb!important;}',
    'table.tabel.tabel-compact tr:hover,table.table-input.tabel-compact tr:hover{background:#f3f4f6!important;}',
    'table.tabel.tabel-compact,table.tabel.tabel-compact td,table.tabel.tabel-compact th{transition:none!important;}',
    '.ext-resp-wrap{overflow-x:auto!important;width:100%!important;margin-bottom:12px!important;border:1px solid #e2e8f0!important;border-radius:8px!important;-webkit-overflow-scrolling:touch!important;}',
    '.ext-resp-wrap table.tabel.tabel-compact{width:auto!important;min-width:100%!important;table-layout:auto!important;}',

    '.patient-info{display:flex!important;flex-direction:column!important;gap:2px!important;}',
    '.patient-name{font-weight:700!important;color:#0f172a!important;}',
    '.patient-rm{font-size:11px!important;color:#64748b!important;}',
    '.morbis-dd{position:relative;display:inline-block;vertical-align:middle;}',
    '.morbis-dd-toggle{padding:4px 10px;font-size:16px;line-height:1;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;background:#fff;color:#374151;}',
    '.morbis-dd-toggle:hover{background:#f3f4f6;}',
    '.morbis-dd-menu{display:none;position:absolute;right:0;top:100%;z-index:50;background:#fff;border:1px solid #e5e7eb;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:4px 0;min-width:140px;margin-top:2px;}',
    '.morbis-dd-menu button{display:block;width:100%;padding:8px 16px;background:none!important;border:none!important;text-align:left;cursor:pointer;font-size:12px;color:#374151!important;border-radius:0!important;}',
    '.morbis-dd-menu button:hover{background:#f3f4f6!important;}',
    '.ext-search-wrap{display:flex;margin-bottom:8px;}',
    '.ext-search-input{padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;width:220px;outline:none;color:#374151;background:#fff;}',
    '.ext-search-input:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,0.15);}',
    '.ext-search-input::placeholder{color:#9ca3af;}',

    '.morbis-table-wrapper{overflow-x:auto!important;width:100%!important;margin-bottom:12px!important;border:1px solid #e2e8f0!important;border-radius:8px!important;-webkit-overflow-scrolling:touch!important;}',
    '.morbis-table-wrapper .morbis-data-table{width:auto!important;min-width:100%!important;table-layout:auto!important;}',
    '.morbis-data-table{width:100%!important;border-collapse:collapse!important;font-size:14px!important;table-layout:auto!important;}',
    '.morbis-data-table th{background:#374151!important;color:#fff!important;font-weight:600!important;padding:10px 12px!important;border:1px solid #4b5563!important;white-space:nowrap!important;}',
    '.morbis-data-table td{padding:8px 12px!important;border:1px solid #e5e7eb!important;vertical-align:top!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:200px!important;}',
    '.morbis-data-table td:nth-child(3){font-weight:600!important;color:#111827!important;min-width:130px!important;}',
    '.morbis-data-table tr:nth-child(even){background:#f9fafb!important;}',
    '.morbis-data-table tr:hover{background:#f3f4f6!important;}',
    '.morbis-table-search{display:flex;margin-bottom:8px;padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;width:220px;outline:none;color:#374151;background:#fff;margin-right:auto;}',
    '.morbis-table-search:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,0.15);}',
    '.morbis-table-search::placeholder{color:#9ca3af;}',
    '.morbis-patient-info{display:flex!important;flex-direction:column!important;gap:2px!important;}',
    '.morbis-patient-name{font-weight:700!important;color:#0f172a!important;}',
    '.morbis-patient-rm{font-size:11px!important;color:#64748b!important;}',

    'table.tabel.tabel-compact td[data-full-text]{position:relative!important;cursor:help!important;}',
    'table.tabel.tabel-compact td[data-full-text]::after{content:attr(data-full-text);position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#1f2937;padding:20px 24px;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);z-index:10000;max-width:80vw;width:420px;white-space:pre-wrap;line-height:1.6;border:1px solid #e5e7eb;font-size:14px;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 0.15s,visibility 0.15s;transition-delay:0s;}',
    'table.tabel.tabel-compact td[data-full-text]:hover::after{opacity:1;visibility:visible;transition-delay:0.3s;}',
    'table.tabel.tabel-compact td[data-full-text]::before{content:"";position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.15);z-index:9999;opacity:0;visibility:hidden;transition:opacity 0.15s,visibility 0.15s;transition-delay:0s;pointer-events:none;}',
    'table.tabel.tabel-compact td[data-full-text]:hover::before{opacity:1;visibility:visible;transition-delay:0.3s;}',
    '.morbis-data-table td[data-morbis-ft]{position:relative!important;cursor:help!important;}',
    '.morbis-data-table td[data-morbis-ft]::after{content:attr(data-morbis-ft);position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#1f2937;padding:20px 24px;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);z-index:10000;max-width:80vw;width:420px;white-space:pre-wrap;line-height:1.6;border:1px solid #e5e7eb;font-size:14px;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 0.15s,visibility 0.15s;transition-delay:0s;}',
    '.morbis-data-table td[data-morbis-ft]:hover::after{opacity:1;visibility:visible;transition-delay:0.3s;}',
    '.morbis-data-table td[data-morbis-ft]::before{content:"";position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.15);z-index:9999;opacity:0;visibility:hidden;transition:opacity 0.15s,visibility 0.15s;transition-delay:0s;pointer-events:none;}',
    '.morbis-data-table td[data-morbis-ft]:hover::before{opacity:1;visibility:visible;transition-delay:0.3s;}',
    '#searchTable { display: none !important; }',
    '.floleft{float:none!important;width:100%!important;display:flex!important;flex-direction:column;gap:10px;}',
    '#new-param-filter{width:100%;box-sizing:border-box;background:#fff;border-radius:12px;padding:20px;border:1px solid #e5e7eb;box-shadow:0 2px 8px rgba(0,0,0,.05);}',
    '#new-param-filter h4{margin:0;font-size:18px;font-weight:600;color:#16a34a;padding-left:12px;border-left:4px solid #22c55e;margin-bottom:20px;}',
    '#new-param-filter label{font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;}',
    '#new-param-filter input,#new-param-filter select{height:42px;padding:0 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;font-size:14px;color:#1f2937;width:100%;box-sizing:border-box;transition:all .2s ease;}',
    '#new-param-filter input:focus,#new-param-filter select:focus{outline:none;border-color:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.15);}',
    '#btn-cari-secure{background:#22c55e;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500;font-size:14px;transition:background .2s;}',
    '#btn-cari-secure:hover{background:#16a34a;}',
    '#btn-reset-secure{background:#f1f5f9;color:#475569;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500;font-size:14px;transition:background .2s;}',
    '#btn-reset-secure:hover{background:#e2e8f0;color:#334155;}',
    '#filter-btn-row{display:flex;gap:10px;margin-top:20px;}',
    '.ac_results{background:#fff;border:1px solid #dbe2ea!important;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.12);overflow:hidden;z-index:999999;margin-top:4px;}',
    '.ac_results ul{margin:0;padding:4px 0;}',
    '.ac_results li{border-bottom:1px solid #f1f5f9;cursor:pointer;}',
    '.ac_results li:last-child{border-bottom:none;}',
    '.ac_results li:hover{background:#22c55e!important;}',
    '.ac_results li:hover .result-name,.ac_results li:hover .result-rm{color:#fff!important;}',
    '.ac_over{background:#22c55e!important;color:#fff!important;}',
    '.ac_odd{background:transparent!important;}',
    '.result{display:flex;flex-direction:column;gap:2px;padding:10px 14px;}',
    '.result-name{font-size:14px;font-weight:600;color:#1e293b;}',
    '.result-rm{font-size:12px;color:#64748b;margin-top:2px;}',
    '.ac_over .result-name,.ac_over .result-rm{color:#fff!important;}',
    '.ac_results li b{font-weight:600;}',
    '.ac_results li i{font-style:normal;color:#64748b;font-size:12px;}',
    '.ac_over li i{color:#fff!important;}',
    '#filter-loading{width:18px;height:18px;border:2px solid #e2e8f0;border-top-color:#22c55e;border-radius:50%;display:none;}',
    '#filter-loading.active{display:inline-block;animation:morbis-spin .6s linear infinite;}',
    '@keyframes morbis-spin{to{transform:rotate(360deg);}}',

    '.cons-modal table.tabel{width:100%!important;border-collapse:collapse!important;border:1px solid #e5e7eb!important;border-radius:8px;overflow:hidden;margin-bottom:1rem!important;table-layout:fixed;}',
    '.cons-modal table.tabel th{background:#f1f5f9!important;color:#1e293b!important;font-weight:600!important;text-transform:none!important;padding:10px 12px!important;border:1px solid #e5e7eb!important;text-align:left!important;}',
    '.cons-modal table.tabel td{background:#fff!important;color:#475569!important;padding:10px 12px!important;border:1px solid #e5e7eb!important;text-align:left!important;vertical-align:top;line-height:1.6;font-size:13px;}',
    '.cons-modal table.tabel tr:nth-child(even) td{background:#f8fafc!important;}',
    '.cons-modal table.tabel tbody tr:hover td{background:#f1f5f9!important;}',
    '.cons-modal table.tabel td[style*="white-space:pre-line"]{white-space:pre-wrap!important;word-break:break-word;overflow:hidden;position:relative;max-height:6em;}',
    '.cons-modal table.tabel td[style*="white-space:pre-line"]:hover{max-height:none;}',
    '.cons-modal table.tabel td[style*="white-space:pre-line"]::after{content:"\\2935 \\a0 lanjutkan";position:absolute;bottom:0;right:0;background:linear-gradient(to right,transparent,#fff);color:#16a34a;font-size:11px;font-weight:600;padding:2px 8px 2px 40px;pointer-events:none;transition:opacity .2s;}',
    '.cons-modal table.tabel td[style*="white-space:pre-line"]:hover::after{opacity:0;}',
    '.cons-modal table.tabel td[style*="white-space:pre-line"]:not(:hover){max-height:6em;overflow:hidden;}',

    '.cons-header{padding-top:10px!important;padding-bottom:10px!important;}',
    '.cons-tab-content{padding-top:5px!important;padding-bottom:5px!important;}',
    '.cons-modal .cons-header{padding:10px 24px!important;}',
    '.cons-modal .cons-tab-content{padding:5px 24px!important;}',
    '.cons-modal .cons-raw-html{margin:0!important;padding:0!important;}',
    '.cons-modal .cons-raw-html > *{margin-top:0!important;margin-bottom:0!important;}',
    '.cons-modal table{margin-top:0!important;margin-bottom:0!important;}',
    '.cons-modal center{margin:0!important;padding:0!important;}',
    '.cons-modal p{margin:0!important;}',
    '.cons-modal br{line-height:0!important;}',
    '.cons-modal table.tabel{margin-top:0!important;}',
    '.cons-raw-html > *:first-child{margin-top:0!important;}',

    '.cons-cppt-card{border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;overflow:hidden;}',
    '.cons-cppt-head{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;user-select:none;transition:background .15s;background:#f8fafc;}',
    '.cons-cppt-head:hover{background:#f1f5f9;}',
    '.cons-cppt-arrow{font-size:10px;color:#94a3b8;transition:transform .2s;flex-shrink:0;display:inline-block;}',
    '.cons-cppt-card.expanded .cons-cppt-arrow{transform:rotate(90deg);}',
    '.cons-cppt-head-info{font-size:13px;font-weight:500;color:#1e293b;flex:1;}',
    '.cons-cppt-head-sub{font-size:11px;color:#64748b;}',
    '.cons-cppt-body{display:none;border-top:1px solid #e5e7eb;}',
    '.cons-cppt-card.expanded .cons-cppt-body{display:block;}',
    '.cons-cppt-row{display:flex;gap:8px;padding:8px 12px;border-bottom:1px solid #f1f5f9;align-items:flex-start;}',
    '.cons-cppt-row:last-child{border-bottom:none;}',
    '.cons-cppt-label{flex:0 0 140px;font-weight:600;color:#374151;font-size:11px;text-transform:uppercase;letter-spacing:.3px;padding-top:2px;flex-shrink:0;}',
    '.cons-cppt-value{flex:1;font-size:13px;line-height:1.6;color:#1e293b;white-space:pre-wrap;word-break:break-word;}',
    '#modals #isimaster table th:first-child,#modals #isimaster table td:first-child{width:30px!important;max-width:30px!important;text-align:center!important;white-space:nowrap!important;padding:8px 4px!important;}',
  ].join('\n');
  document.head.appendChild(s);
}

export function injectPageScripts(): void {
  if (document.getElementById('morbis-cons-page-scripts')) return;
  const s = document.createElement('script');
  s.id = 'morbis-cons-page-scripts';
  s.textContent = [
    "window.openTab=function(e,t){var c=e.closest('.tab')&&e.closest('.tab').parentElement||document.body;c.querySelectorAll('.tabcontent').forEach(function(el){el.style.display='none'});c.querySelectorAll('.tablinks').forEach(function(el){el.classList.remove('active')});e.classList.add('active');var sel=document.getElementById(t);if(sel)sel.style.display='block';var cc=c.querySelector('#contents, .tab-content');if(cc)cc.style.display='block';};",
    'if(!window.cetak)window.cetak=function(){};',
    'if(!window.openDirection)window.openDirection=function(){};',
    '(function(){',
    '  if(!window.jQuery || window.jQuery.morbisAjaxWrapped)return;',
    '  window.jQuery.morbisAjaxWrapped = true;',
    '  var origAjax=jQuery.ajax;',
    '  jQuery.ajax=function(o){',
    '    if(o&&o.success){',
    '      var origSuccess=o.success;',
    '      o.success=function(msg){',
    '        if(typeof msg==="string"){',
    '          msg=msg.replace(/<script[^>]*>[\\s\\S]*?<\\/script>/gi,function(m){',
    '            return /\\b(const|let)\\s+konsulCSS\\b/.test(m)?"":m;',
    '          });',
    '        }',
    '        return origSuccess.apply(this,arguments);',
    '      };',
    '    }',
    '    return origAjax.apply(this,arguments);',
    '  };',
    '})();',
    '(function(){',
    "  var fs=document.querySelector('form#searchTable fieldset');",
    '  if(!fs)return;',
    "  fs.style.display='none';",
    "  var w=document.createElement('div');",
    "  w.id='new-param-filter';",
    "  w.style.cssText='';",
    "  var h=document.createElement('h4');",
    "  h.textContent='Filter Konsultasi';",
    '  w.appendChild(h);',
    "  var g=document.createElement('div');",
    "  g.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:15px;align-items:end;';",
    "  function mkField(lbl,id,html){var d=document.createElement('div');var l=document.createElement('label');l.textContent=lbl;d.appendChild(l);d.innerHTML+=html;return d;}",
    "  var os=document.getElementById('poli_unit');",
    "  if(os){var ns=os.cloneNode(true);ns.id='f_poli_unit';g.appendChild(mkField('UNIT','f_poli_unit','<select id=\"f_poli_unit\">'+ns.innerHTML+'</select>'));}",
    '  g.appendChild(mkField(\'DOKTER\',\'f_dokter\',\'<input type="text" id="f_dokter" placeholder="Nama Dokter..."><input type="hidden" id="f_id_dokter">\'));',
    '  g.appendChild(mkField(\'NO. RM\',\'f_noRm\',\'<input type="text" id="f_noRm" placeholder="00-00-00">\'));',
    '  g.appendChild(mkField(\'NAMA PASIEN\',\'f_pasien\',\'<input type="text" id="f_pasien" placeholder="Nama Pasien...">\'));',
    "  var bd=document.createElement('div');",
    "  bd.id='filter-btn-row';",
    "  var cb=document.createElement('button');cb.textContent='Cari';cb.id='btn-cari-secure';",
    "  var rb=document.createElement('button');rb.textContent='Reset';rb.id='btn-reset-secure';",
    "  bd.appendChild(cb);var ld=document.createElement('span');ld.id='filter-loading';bd.appendChild(ld);bd.appendChild(rb);",
    '  w.appendChild(g);w.appendChild(bd);',
    "  var fm=document.getElementById('searchTable');",
    '  if(fm&&fm.parentNode)fm.parentNode.insertBefore(w,fm);',
    '  function acLoad(elem,url,opts){',
    '    var origSearch=opts.search||null;',
    '    opts.search=function(q,resp){',
    "      ld.className='active';",
    '      if(origSearch)origSearch.call(this,q,resp);',
    '    };',
    '    jQuery(elem).autocomplete(url,opts).result(function(e,d){',
    "      ld.className='';",
    '      if(opts.result)opts.result.call(this,e,d);',
    '    });',
    '  }',
    "  if(typeof jQuery!=='undefined'&&jQuery.fn.autocomplete){",
    "    acLoad('#f_dokter','/admisi/search?opsi=nakes_dokter_only',{parse:function(d){var p=[];for(var i=0;i<d.length;i++)p[i]={data:d[i],value:d[i].NAMA};return p;},formatItem:function(d){return '<div class=result><div class=result-name>'+d.NAMA+'</div></div>';},width:300,dataType:'json',result:function(e,d){jQuery(this).val(d.NAMA);jQuery('#f_id_dokter').val(d.ID_PENDUDUK);}});",
    "    acLoad('#f_pasien','/admisi/search?opsi=pasien',{parse:function(d){var p=[];for(var i=0;i<d.length;i++)p[i]={data:d[i],value:d[i].nama};return p;},formatItem:function(d){return '<div class=result><div class=result-name>'+d.nama+'</div><div class=result-rm>RM : '+d.id_pasien+'</div></div>';},width:300,dataType:'json',result:function(e,d){jQuery(this).val(d.nama);jQuery('#f_noRm').val(d.id_pasien);}});",
    "    acLoad('#f_noRm','/admisi/search?opsi=noRm',{parse:function(d){var p=[];for(var i=0;i<d.length;i++)p[i]={data:d[i],value:d[i].ID_PASIEN};return p;},formatItem:function(d){return '<div class=result><div class=result-name>'+d.NAMA_PAS+'</div><div class=result-rm>RM : '+d.ID_PASIEN+'</div></div>';},width:300,dataType:'json',result:function(e,d){jQuery(this).val(d.ID_PASIEN);jQuery('#f_pasien').val(d.NAMA_PAS);}});",
    '  }',
    '  function ds(){',
    "    var pu=document.getElementById('f_poli_unit').value;",
    "    var id=document.getElementById('f_id_dokter').value;",
    "    var rm=document.getElementById('f_noRm').value.replace(/[^a-zA-Z0-9-]/g,'');",
    "    var p=document.getElementById('f_pasien').value.replace(/[^a-zA-Z0-9\\s]/g,'');",
    "    if(typeof window.contentloader==='function'){",
    "      var ub='/admisi/pengajuan_konsultasi/tabel-konsultasi';",
    "      var pr='&poli_unit='+pu+'&id_dokter='+id+'&noRm='+rm+'&pasien='+encodeURIComponent(p);",
    "      window.contentloader(ub+'?status_selesai=belum'+pr,'#tabellist');",
    "      window.contentloader(ub+'?status_selesai=sudah'+pr,'#tabeldone');",
    '    }',
    '  }',
    "  document.getElementById('btn-cari-secure').onclick=function(e){e.preventDefault();ds();};",
    "  document.getElementById('btn-reset-secure').onclick=function(e){",
    '    e.preventDefault();',
    "    document.getElementById('f_pasien').value='';",
    "    document.getElementById('f_noRm').value='';",
    "    document.getElementById('f_dokter').value='';",
    "    document.getElementById('f_id_dokter').value='';",
    "    var fpu=document.getElementById('f_poli_unit');if(fpu.options.length)fpu.selectedIndex=0;",
    '    ds();',
    '  };',
    '})();',
    "(function(){var _h=function(id){var v=document.getElementById('id_visit');var m=document.getElementById('modals');if(m)m.style.display='block';if(typeof jQuery!='undefined'){jQuery('#isimaster').html('');jQuery.ajax({url:'/admisi/pelaksanaan_pelayanan/history-penunjang/tabel',data:'noRm='+id+'&id_visit='+(v?v.value:'')+'&tipe=hasil',cache:false,success:function(r){jQuery('#isimaster').html(r)}})}};if(!window._ext_pnj_lock){window._ext_pnj_lock=true;window.modal_penunjang_history=_h;Object.defineProperty(window,'penunjang_modal',{configurable:false,get:function(){return _h},set:function(){}});}else{window.penunjang_modal=_h;}})();",
  ].join('\n');
  (document.head || document.documentElement).appendChild(s);
}

function shortName(n: string): string {
  // "dr. Yanrike Harahap, Sp. PD" → "dr. Yanrike Harahap"
  const ci = n.indexOf(',');
  return ci >= 0 ? n.substring(0, ci).trim() : n;
}

function esc(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function addSearchFilter(tbl: HTMLTableElement): void {
  if (tbl.querySelector('.ext-search-input')) return;
  const input = document.createElement('input');
  input.className = 'ext-search-input';
  input.type = 'text';
  input.placeholder = 'Cari di tabel ini...';
  const wrap = tbl.parentElement || tbl;
  wrap.insertBefore(input, tbl);
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    (tbl.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>).forEach((row) => {
      if (row.classList.contains('ext-child')) return;
      row.style.display =
        q === '' || (row.textContent || '').toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

export function enhanceTables(): void {
  if (!document.getElementById('morbis-dd-close')) {
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.morbis-dd-menu').forEach((m) => {
        const menu = m as HTMLElement;
        if (menu.style.display === 'none') return;
        if (!menu.contains(e.target as Node)) menu.style.display = 'none';
      });
    });
    const fl = document.createElement('span');
    fl.id = 'morbis-dd-close';
    fl.style.display = 'none';
    document.body.appendChild(fl);
  }

  const tables = document.querySelectorAll('table');
  tables.forEach((tbl) => {
    if (tbl.hasAttribute('data-morbis-enhanced')) return;
    if (tbl.closest('.cons-overlay')) return; // skip modal tables
    if (tbl.closest('#tabeldone') || tbl.closest('#tabellist')) return; // handled by buildCustomTables
    if (tbl.closest('#searchTable')) return; // skip search form layout table
    tbl.setAttribute('data-morbis-enhanced', '1');
    tbl.classList.add('tabel', 'full', 'tabel-compact');

    if (tbl.parentElement && !tbl.parentElement.classList.contains('ext-resp-wrap')) {
      const w = document.createElement('div');
      w.className = 'ext-resp-wrap';
      tbl.parentElement.insertBefore(w, tbl);
      w.appendChild(tbl);
    }

    const headerRow =
      tbl.querySelector('thead tr') || tbl.querySelector('tbody tr') || tbl.querySelector('tr');
    if (!headerRow) return;

    const headerFromTbody = !tbl.querySelector('thead tr') && !!tbl.querySelector('tbody tr');
    const cells = headerRow.querySelectorAll('th, td');
    const headerTexts: string[] = [];
    cells.forEach((c) => headerTexts.push((c.textContent || '').trim()));

    const totalCols = headerTexts.length;
    const hasAksiCol = headerTexts.some((t) => /aksi/i.test(t));

    if (!hasAksiCol) {
      const actionTh = document.createElement('th');
      actionTh.textContent = 'Aksi';
      actionTh.style.cssText = 'width:120px;text-align:center;';
      headerRow.appendChild(actionTh);
    }

    const permintaanIdx = headerTexts.findIndex((t) => /permintaan/i.test(t));
    const kesanIdx = headerTexts.findIndex((t) => /kesan/i.test(t));
    const anjuranIdx = headerTexts.findIndex((t) => /anjuran/i.test(t));
    const actionCol = hasAksiCol ? headerTexts.findIndex((t) => /aksi/i.test(t)) : totalCols;
    const unitTujuanIdx = headerTexts.findIndex((t) => /unit tujuan/i.test(t));
    const tanggalIdx = headerTexts.findIndex((t) => /tanggal pengajuan/i.test(t));

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    // hide UNIT TUJUAN header
    if (unitTujuanIdx >= 0 && cells.length > unitTujuanIdx) {
      (cells[unitTujuanIdx] as HTMLElement).style.display = 'none';
    }

    // merge headers: NAMA/RM, UNIT, DOKTER
    const headCells = headerRow.querySelectorAll('th, td');
    if (!headerRow.hasAttribute('data-ext-head-merge') && headCells.length > 2) {
      headerRow.setAttribute('data-ext-head-merge', '1');
      (headCells[2] as HTMLElement).textContent = 'NAMA / RM';
      if (headCells.length > 3) (headCells[3] as HTMLElement).textContent = 'UNIT';
      if (headCells.length > 5) (headCells[5] as HTMLElement).textContent = 'DOKTER';
      if (headCells.length > 1) (headCells[1] as HTMLElement).style.display = 'none'; // NO.RM
      if (headCells.length > 6) (headCells[6] as HTMLElement).style.display = 'none'; // DOKTER KONSULTASI
    }

    const rows = tbl.querySelectorAll('tbody tr');
    rows.forEach((row, ri) => {
      if (headerFromTbody && ri === 0) return;
      const rds = row.querySelectorAll('td');

      if (!hasAksiCol && rds.length <= totalCols) {
        const td = document.createElement('td');
        td.style.cssText = 'text-align:center;white-space:nowrap;';
        row.appendChild(td);
      }

      const allCells = row.querySelectorAll('td');
      if (allCells.length <= actionCol) return;

      // hide UNIT TUJUAN cell
      if (unitTujuanIdx >= 0 && allCells.length > unitTujuanIdx) {
        (allCells[unitTujuanIdx] as HTMLElement).style.display = 'none';
      }

      // format date: 2026-06-14 13:42:25 → 14 Jun 13:42
      if (tanggalIdx >= 0 && allCells.length > tanggalIdx) {
        const cell = allCells[tanggalIdx];
        const txt = cell.textContent?.trim() || '';
        const m = txt.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
        if (m) {
          cell.textContent = `${parseInt(m[3])} ${months[parseInt(m[2]) - 1]} ${m[4]}:${m[5]}`;
        }
      }

      // hover: data-full-text for popup
      [permintaanIdx, kesanIdx, anjuranIdx].forEach((idx) => {
        if (idx >= 0 && allCells.length > idx) {
          const txt = (allCells[idx].textContent || '').trim();
          if (txt.length > 20) allCells[idx].setAttribute('data-full-text', txt);
        }
      });

      const actionCell = allCells[actionCol];
      if (actionCell.querySelector('.morbis-cons-btn')) return;

      const rd: string[] = [];
      allCells.forEach((td) => rd.push((td.textContent || '').trim()));

      // merge columns: NAMA+RM, UNIT ASAL→TUJUAN, DOKTER (idempotent — skip if already has patient-info)
      if (allCells.length > 2 && !allCells[2].querySelector('.patient-info')) {
        const nama = (allCells[2].textContent || '').trim();
        const rm = (allCells[1].textContent || '').trim();
        allCells[2].innerHTML = `<div class="patient-info"><span class="patient-name">${esc(nama)}</span><span class="patient-rm">${esc(rm)}</span></div>`;
        (allCells[1] as HTMLElement).style.display = 'none';
        if (allCells.length > 4) {
          const asal = (allCells[3].textContent || '').trim();
          const tujuan = (allCells[4].textContent || '').trim();
          allCells[3].textContent = `${asal}  →  ${tujuan}`;
        }
        if (allCells.length > 6) {
          const pengaju = shortName((allCells[5].textContent || '').trim());
          const kons = shortName((allCells[6].textContent || '').trim());
          allCells[5].innerHTML = kons
            ? `${esc(pengaju)}<br><span class="patient-rm">→ ${esc(kons)}</span>`
            : esc(pengaju);
          (allCells[6] as HTMLElement).style.display = 'none';
        }
      }

      let id_konsul = row.id || '';
      let visitId = '';
      row
        .querySelectorAll(
          'a[href*="id_visit"], a[href*="form-input-konsultasi"], button[onclick*="id_visit"], button[onclick*="form-input-konsultasi"], button[onclick*="direction_konsul"]',
        )
        .forEach((el) => {
          const href = el.getAttribute('href') || el.getAttribute('onclick') || '';
          const m =
            href.match(/id_visit=(\d+)/) || href.match(/direction_konsul\('[^']+',\s*'(\d+)'/);
          if (m) visitId = m[1];
          if (!id_konsul) {
            const km = href.match(/direction_konsul\('(\d+)'/);
            if (km) id_konsul = km[1];
          }
        });

      const detailBtn = document.createElement('button');
      detailBtn.className = 'morbis-cons-btn morbis-cons-detail';
      detailBtn.textContent = 'Detail';

      const infoBtn = document.createElement('button');
      infoBtn.className = 'morbis-cons-btn morbis-cons-info';
      infoBtn.textContent = 'Info Pasien';

      detailBtn.onclick = () => {
        const p: Record<string, string> = {};
        if (rd.length > 1) p.noRm = rd[1];
        if (rd.length > 2) p.nama = rd[2];
        if (rd.length > 3) p.unitAsal = rd[3];
        if (rd.length > 4) p.unitTujuan = rd[4];
        if (rd.length > 5) p.dokterMengajukan = rd[5];
        if (rd.length > 6) p.dokterKonsultasi = rd[6];
        if (rd.length > 7) p.tanggal = rd[7];
        if (permintaanIdx >= 0 && rd.length > permintaanIdx) p.permintaan = rd[permintaanIdx];
        if (kesanIdx >= 0 && rd.length > kesanIdx) p.kesan = rd[kesanIdx] || '-';
        if (anjuranIdx >= 0 && rd.length > anjuranIdx) p.anjuran = rd[anjuranIdx] || '-';
        p.baseUrl = window.location.origin;
        window.dispatchEvent(new CustomEvent('morbis-cons-detail', { detail: p }));
      };

      infoBtn.onclick = () => {
        if (!id_konsul) return;
        window.dispatchEvent(
          new CustomEvent('morbis-cons-info', {
            detail: {
              id: id_konsul,
              visit: visitId,
              nama: rd[2] || '',
              noRm: rd[1] || '',
              baseUrl: window.location.origin,
            },
          }),
        );
      };

      // dropdown: all buttons into •••
      const dd = document.createElement('div');
      dd.className = 'morbis-dd';
      const toggle = document.createElement('button');
      toggle.className = 'morbis-dd-toggle';
      toggle.textContent = '•••';
      dd.appendChild(toggle);
      const menu = document.createElement('div');
      menu.className = 'morbis-dd-menu';
      dd.appendChild(menu);

      Array.from(actionCell.querySelectorAll('button')).forEach((b) => menu.appendChild(b));
      menu.appendChild(detailBtn);
      menu.appendChild(infoBtn);
      const hapusBtn = Array.from(menu.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Hapus'),
      );
      if (hapusBtn) menu.appendChild(hapusBtn);

      actionCell.innerHTML = '';
      actionCell.appendChild(dd);

      toggle.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isOpen = menu.style.display !== 'none';
        if (isOpen) {
          menu.style.display = 'none';
          dd.appendChild(menu);
          menu.style.position = '';
          menu.style.top = '';
          menu.style.left = '';
        } else {
          document.body.appendChild(menu);
          const r = toggle.getBoundingClientRect();
          menu.style.position = 'fixed';
          menu.style.top = r.bottom + 'px';
          menu.style.left =
            Math.max(4, Math.min(r.left + r.width - 160, window.innerWidth - 164)) + 'px';
          menu.style.display = 'block';
        }
      };
    });
    addSearchFilter(tbl);
  });
}

export function buildCustomTables(): void {
  if (document.querySelector('[data-ext-bct-running]')) return;
  document.documentElement.setAttribute('data-ext-bct-running', '1');
  setTimeout(() => document.documentElement.removeAttribute('data-ext-bct-running'), 1000);
  if (!document.getElementById('morbis-dd-close')) {
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.morbis-dd-menu').forEach((m) => {
        const menu = m as HTMLElement;
        if (menu.style.display === 'none') return;
        if (!menu.contains(e.target as Node)) menu.style.display = 'none';
      });
    });
    const fl = document.createElement('span');
    fl.id = 'morbis-dd-close';
    fl.style.display = 'none';
    document.body.appendChild(fl);
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  ['#tabeldone', '#tabellist'].forEach((sel) => {
    const container = document.querySelector(sel);
    if (!container) return;

    // 1. Clean up any search inputs/wrappers from previous runs or other extensions
    container
      .querySelectorAll('.ext-search-input, .ext-search-wrap, .morbis-table-search')
      .forEach((el) => el.remove());

    const tbl = container.querySelector('table');
    if (!tbl) return;

    // If already enhanced in this cycle, skip
    if (tbl.hasAttribute('data-morbis-custom')) return;

    // 2. Unwrap the table from any wrapper container
    const parent = tbl.parentElement;
    if (parent && parent !== container) {
      parent.replaceWith(tbl);
    }

    tbl.setAttribute('data-morbis-custom', '1');

    // 3. Clear existing classes to completely evade third-party extension CSS targeting
    tbl.className = 'morbis-data-table';

    // 4. Wrap with our own wrapper and add the search input
    const wrap = document.createElement('div');
    wrap.className = 'morbis-table-wrapper';
    tbl.replaceWith(wrap);

    const searchInput = document.createElement('input');
    searchInput.className = 'morbis-table-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Cari di tabel ini...';

    wrap.appendChild(searchInput);
    wrap.appendChild(tbl);

    const headerRow =
      tbl.querySelector('thead tr') || tbl.querySelector('tbody tr') || tbl.querySelector('tr');
    if (!headerRow) return;

    const headerFromTbody = !tbl.querySelector('thead tr') && !!tbl.querySelector('tbody tr');
    const cells = headerRow.querySelectorAll('th, td');
    const headerTexts: string[] = [];
    cells.forEach((c) => headerTexts.push((c.textContent || '').trim()));

    const totalCols = headerTexts.length;
    const hasAksiCol = headerTexts.some((t) => /aksi/i.test(t));

    if (!hasAksiCol) {
      const actionTh = document.createElement('th');
      actionTh.textContent = 'Aksi';
      actionTh.style.cssText = 'width:120px;text-align:center;';
      headerRow.appendChild(actionTh);
    }

    const permintaanIdx = headerTexts.findIndex((t) => /permintaan/i.test(t));
    const kesanIdx = headerTexts.findIndex((t) => /kesan/i.test(t));
    const anjuranIdx = headerTexts.findIndex((t) => /anjuran/i.test(t));
    const actionCol = hasAksiCol ? headerTexts.findIndex((t) => /aksi/i.test(t)) : totalCols;
    const unitTujuanIdx = headerTexts.findIndex((t) => /unit tujuan/i.test(t));
    const tanggalIdx = headerTexts.findIndex((t) => /tanggal pengajuan/i.test(t));

    if (unitTujuanIdx >= 0 && cells.length > unitTujuanIdx) {
      (cells[unitTujuanIdx] as HTMLElement).style.display = 'none';
    }

    const headCells = headerRow.querySelectorAll('th, td');
    if (!headerRow.hasAttribute('data-morbis-hm') && headCells.length > 2) {
      headerRow.setAttribute('data-morbis-hm', '1');
      (headCells[2] as HTMLElement).textContent = 'NAMA / RM';
      if (headCells.length > 3) (headCells[3] as HTMLElement).textContent = 'UNIT';
      if (headCells.length > 5) (headCells[5] as HTMLElement).textContent = 'DOKTER';
      if (headCells.length > 1) (headCells[1] as HTMLElement).style.display = 'none';
      if (headCells.length > 6) (headCells[6] as HTMLElement).style.display = 'none';
    }

    const rows = tbl.querySelectorAll('tbody tr');
    rows.forEach((row, ri) => {
      if (headerFromTbody && ri === 0) return;
      const rds = row.querySelectorAll('td');

      if (!hasAksiCol && rds.length <= totalCols) {
        const td = document.createElement('td');
        td.style.cssText = 'text-align:center;white-space:nowrap;';
        row.appendChild(td);
      }

      const allCells = row.querySelectorAll('td');
      if (allCells.length <= actionCol) return;

      if (unitTujuanIdx >= 0 && allCells.length > unitTujuanIdx) {
        (allCells[unitTujuanIdx] as HTMLElement).style.display = 'none';
      }

      if (tanggalIdx >= 0 && allCells.length > tanggalIdx) {
        const cell = allCells[tanggalIdx];
        const txt = cell.textContent?.trim() || '';
        const m = txt.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
        if (m) {
          cell.textContent = `${parseInt(m[3])} ${months[parseInt(m[2]) - 1]} ${m[4]}:${m[5]}`;
        }
      }

      [permintaanIdx, kesanIdx, anjuranIdx].forEach((idx) => {
        if (idx >= 0 && allCells.length > idx) {
          const txt = (allCells[idx].textContent || '').trim();
          if (txt.length > 20) allCells[idx].setAttribute('data-morbis-ft', txt);
        }
      });

      const actionCell = allCells[actionCol];
      if (actionCell.querySelector('.morbis-cons-btn')) return;

      const rd: string[] = [];
      allCells.forEach((td) => rd.push((td.textContent || '').trim()));

      if (allCells.length > 2 && !allCells[2].querySelector('.morbis-patient-info')) {
        const nama = (allCells[2].textContent || '').trim();
        const rm = (allCells[1].textContent || '').trim();
        allCells[2].innerHTML = `<div class="morbis-patient-info"><span class="morbis-patient-name">${esc(nama)}</span><span class="morbis-patient-rm">${esc(rm)}</span></div>`;
        (allCells[1] as HTMLElement).style.display = 'none';
        if (allCells.length > 4) {
          const asal = (allCells[3].textContent || '').trim();
          const tujuan = (allCells[4].textContent || '').trim();
          allCells[3].textContent = `${asal}  →  ${tujuan}`;
        }
        if (allCells.length > 6) {
          const pengaju = shortName((allCells[5].textContent || '').trim());
          const kons = shortName((allCells[6].textContent || '').trim());
          allCells[5].innerHTML = kons
            ? `${esc(pengaju)}<br><span class="morbis-patient-rm">→ ${esc(kons)}</span>`
            : esc(pengaju);
          (allCells[6] as HTMLElement).style.display = 'none';
        }
      }

      let id_konsul = row.id || '';
      let visitId = '';
      row
        .querySelectorAll(
          'a[href*="id_visit"], a[href*="form-input-konsultasi"], button[onclick*="id_visit"], button[onclick*="form-input-konsultasi"], button[onclick*="direction_konsul"]',
        )
        .forEach((el) => {
          const href = el.getAttribute('href') || el.getAttribute('onclick') || '';
          const m =
            href.match(/id_visit=(\d+)/) || href.match(/direction_konsul\('[^']+',\s*'(\d+)'/);
          if (m) visitId = m[1];
          if (!id_konsul) {
            const km = href.match(/direction_konsul\('(\d+)'/);
            if (km) id_konsul = km[1];
          }
        });

      const detailBtn = document.createElement('button');
      detailBtn.className = 'morbis-cons-btn morbis-cons-detail';
      detailBtn.textContent = 'Detail';

      const infoBtn = document.createElement('button');
      infoBtn.className = 'morbis-cons-btn morbis-cons-info';
      infoBtn.textContent = 'Info Pasien';

      detailBtn.onclick = () => {
        const p: Record<string, string> = {};
        if (rd.length > 1) p.noRm = rd[1];
        if (rd.length > 2) p.nama = rd[2];
        if (rd.length > 3) p.unitAsal = rd[3];
        if (rd.length > 4) p.unitTujuan = rd[4];
        if (rd.length > 5) p.dokterMengajukan = rd[5];
        if (rd.length > 6) p.dokterKonsultasi = rd[6];
        if (rd.length > 7) p.tanggal = rd[7];
        if (permintaanIdx >= 0 && rd.length > permintaanIdx) p.permintaan = rd[permintaanIdx];
        if (kesanIdx >= 0 && rd.length > kesanIdx) p.kesan = rd[kesanIdx] || '-';
        if (anjuranIdx >= 0 && rd.length > anjuranIdx) p.anjuran = rd[anjuranIdx] || '-';
        p.baseUrl = window.location.origin;
        window.dispatchEvent(new CustomEvent('morbis-cons-detail', { detail: p }));
      };

      infoBtn.onclick = () => {
        if (!id_konsul) return;
        window.dispatchEvent(
          new CustomEvent('morbis-cons-info', {
            detail: {
              id: id_konsul,
              visit: visitId,
              nama: rd[2] || '',
              noRm: rd[1] || '',
              baseUrl: window.location.origin,
            },
          }),
        );
      };

      const dd = document.createElement('div');
      dd.className = 'morbis-dd';
      const toggle = document.createElement('button');
      toggle.className = 'morbis-dd-toggle';
      toggle.textContent = '•••';
      dd.appendChild(toggle);
      const menu = document.createElement('div');
      menu.className = 'morbis-dd-menu';
      dd.appendChild(menu);

      Array.from(actionCell.querySelectorAll('button')).forEach((b) => menu.appendChild(b));
      menu.appendChild(detailBtn);
      menu.appendChild(infoBtn);
      const hapusBtn = Array.from(menu.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Hapus'),
      );
      if (hapusBtn) menu.appendChild(hapusBtn);

      actionCell.innerHTML = '';
      actionCell.appendChild(dd);

      toggle.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isOpen = menu.style.display !== 'none';
        if (isOpen) {
          menu.style.display = 'none';
          dd.appendChild(menu);
          menu.style.position = '';
          menu.style.top = '';
          menu.style.left = '';
        } else {
          document.body.appendChild(menu);
          const r = toggle.getBoundingClientRect();
          menu.style.position = 'fixed';
          menu.style.top = r.bottom + 'px';
          menu.style.left =
            Math.max(4, Math.min(r.left + r.width - 160, window.innerWidth - 164)) + 'px';
          menu.style.display = 'block';
        }
      };
    });

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      (tbl.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>).forEach((row) => {
        row.style.display =
          q === '' || (row.textContent || '').toLowerCase().includes(q) ? '' : 'none';
      });
    });
  });
}

export function loadTabContent(
  tabId: string,
  panel: HTMLElement,
  data: Record<string, string>,
): void {
  const tab = PATIENT_INFO_TABS.find((t) => t.id === tabId);
  if (!tab) return;
  const target = panel.querySelector('.morbis-tab-body') || panel;
  const $ = (window as unknown as Record<string, unknown>).jQuery as any;
  if (!$ || !$.ajax) {
    target.innerHTML =
      '<div style="text-align:center;padding:40px;color:red;">jQuery tidak tersedia</div>';
    return;
  }
  target.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">Memuat...</div>';
  const konsulId = data.id || '';
  const ajaxData = tab.ajax.data(data.visit, data.noRm || '', konsulId);
  $.ajax({
    url: tab.ajax.url,
    type: tab.ajax.method,
    dataType: 'html',
    data: ajaxData,
    success: (response: string) => {
      target.innerHTML = response;
      target.querySelectorAll('[style*="margin-top"]').forEach((el) => {
        el.style.marginTop = '0';
      });
    },
    error: (_xhr: unknown, _status: string, error: string) => {
      target.innerHTML =
        '<div style="text-align:center;padding:40px;color:red;">Gagal memuat: ' + error + '</div>';
    },
  });
}

export function fetchTabContent(tabId: string, data: Record<string, string>): Promise<string> {
  return new Promise((resolve, reject) => {
    const tab = PATIENT_INFO_TABS.find((t) => t.id === tabId);
    if (!tab) {
      resolve('Tab tidak ditemukan');
      return;
    }
    const $ = (window as unknown as Record<string, unknown>).jQuery as any;
    if (!$ || !$.ajax) {
      resolve('jQuery tidak tersedia');
      return;
    }
    const konsulId = data.id || '';
    const ajaxData = tab.ajax.data(data.visit, data.noRm || '', konsulId);
    $.ajax({
      url: tab.ajax.url,
      type: tab.ajax.method,
      dataType: 'html',
      data: ajaxData,
      success: (response: string) => {
        if (tabId === 'resep')
          response = filterTableCols(response, [
            'no',
            'waktu penjualan',
            'dokter',
            'unit asal',
            'unit tujuan',
          ]);
        else if (tabId === 'dokumen')
          response = filterTableCols(response, ['no', 'nama file', 'keterangan']);
        else if (tabId === 'cppt') response = toCpptCards(response);
        resolve(response);
      },
      error: (_xhr: unknown, _status: string, error: string) => {
        reject(error);
      },
    });
  });
}

function filterTableCols(html: string, keepHeaders: string[]): string {
  const d = document.createElement('div');
  d.innerHTML = html;
  const tbl = d.querySelector('table');
  if (!tbl) return html;
  const headRow = tbl.querySelector('thead tr') || tbl.querySelector('tr');
  if (!headRow) return html;
  const heads = headRow.querySelectorAll('th, td');
  const hideIdx: number[] = [];
  heads.forEach((h, i) => {
    const txt = (h.textContent || '').trim().toLowerCase();
    const keep = keepHeaders.some((k) => txt.includes(k));
    if (!keep) hideIdx.push(i);
  });
  hideIdx.forEach((i) => {
    if (heads[i]) (heads[i] as HTMLElement).style.display = 'none';
  });
  tbl.querySelectorAll('tr').forEach((row) => {
    const cells = row.querySelectorAll('td');
    hideIdx.forEach((i) => {
      if (cells[i]) (cells[i] as HTMLElement).style.display = 'none';
    });
  });
  return d.innerHTML;
}

const CPPT_WAKTU_KW = ['waktu', 'masuk', 'tanggal'];
const CPPT_PEGAWAI_KW = ['pegawai', 'penginput', 'dokter'];

function toCpptCards(html: string): string {
  const d = document.createElement('div');
  d.innerHTML = html;
  const tbl = d.querySelector('table');
  if (!tbl) return html;
  const headRow = tbl.querySelector('thead tr') || tbl.querySelector('tr');
  if (!headRow) return html;
  const heads = headRow.querySelectorAll('th, td');
  const labels: string[] = [];
  heads.forEach((h) => labels.push((h.textContent || '').trim()));
  const waktuIdx = labels.findIndex((l) => CPPT_WAKTU_KW.some((k) => l.toLowerCase().includes(k)));
  const pegawaiIdx = labels.findIndex((l) =>
    CPPT_PEGAWAI_KW.some((k) => l.toLowerCase().includes(k)),
  );
  const skipIdx = new Set([waktuIdx, pegawaiIdx].filter((i) => i >= 0 && i < labels.length));
  const bodyRows = tbl.querySelectorAll('tbody tr, tr');
  const cards: string[] = [];
  bodyRows.forEach((row) => {
    if (!row.querySelector('td')) return;
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return;
    const waktuVal =
      waktuIdx >= 0 && cells.length > waktuIdx ? (cells[waktuIdx].textContent || '').trim() : '';
    const pegawaiVal =
      pegawaiIdx >= 0 && cells.length > pegawaiIdx
        ? (cells[pegawaiIdx].textContent || '').trim()
        : '';
    const headText = waktuVal + (waktuVal && pegawaiVal ? ' — ' : '') + pegawaiVal;
    const fields: string[] = [];
    labels.forEach((label, i) => {
      if (i >= cells.length || skipIdx.has(i)) return;
      const val = cells[i].innerHTML.trim();
      fields.push(
        `<div class="cons-cppt-row"><span class="cons-cppt-label">${esc(label)}</span><div class="cons-cppt-value">${val}</div></div>`,
      );
    });
    cards.push(
      '<div class="cons-cppt-card">' +
        '<div class="cons-cppt-head" data-cppt-toggle role="button" tabindex="0">' +
        '<span class="cons-cppt-arrow">▶</span>' +
        '<span class="cons-cppt-head-info">' +
        esc(headText || '(detail)') +
        '</span>' +
        '</div>' +
        '<div class="cons-cppt-body">' +
        fields.join('') +
        '</div>' +
        '</div>',
    );
  });
  return cards.join('');
}
