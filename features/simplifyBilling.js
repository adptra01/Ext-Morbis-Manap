/**
 * FEATURE: Simplify Billing (Ringkas Rincian Biaya)
 * Version: 1.4.0 - Fixed Column Count & Styling
 */

const SIMPLIFY_BILLING_CONFIG = {
  detailUrlPattern: '/v2/m-klaim/detail-v2-refaktor',
  targetSectionId: 'pembayaran-gabung',
  toggleButtonId: 'ext-billing-toggle-btn',
  storageKey: 'billing_simplify_mode',
};

let billingViewMode = 'ringkas';

// Helper list array agar tidak repot mengetik ulang
const footerKeywords = [
  'Jasa Pelayanan', 'Total Transaksi', 'Biaya Materai', 'Biaya Administrasi',
  'Total Biaya', 'Pengurangan', 'Diskon', 'Retur Obat', 'Pembayaran',
  'Uang Muka', 'Billing Parsial', 'Saldo Pembayaran', 'Pembulatan',
  'Terbilang', 'Yang Menyerahkan', 'Yang Menerima', 'Dicetak Oleh',
  'Total Resep', 'Total Jasa'
];

// Injeksi Dasar CSS
if (!document.getElementById('ext-billing-style')) {
  const style = document.createElement('style');
  style.id = 'ext-billing-style';
  style.textContent = `
    /* 1. Menyembunyikan Baris Rincian secara Permanen dan Absolut */
    .ext-billing-hidden {
        display: none !important;
    }

    /* 2. Styling Baris Judul Ringkasan (Misal: "A. TOTAL TINDAKAN PER UNIT") */
    tr[data-ext-summary="true"] > td > b {
        font-size: 13px;
        color: #000;
    }

    /* 3. Styling Jarak untuk Baris Sub-total per Unit/Resep */
    tr[data-ext-summary="true"] td {
        padding: 4px 0; /* Memberi nafas antar baris agar tidak terlalu menempel */
        vertical-align: middle;
    }

    /* 4. Styling Baris Grand Total (Meniru garis putus-putus bawaan sistem) */
    .ext-summary-total td {
        border-top: 1px dashed #000;
        border-bottom: 1px dashed #000;
        padding: 8px 0;
        font-weight: bold;
        font-size: 13px !important;
    }

    /* 5. Styling Tombol Toggle (UI Web) */
    #ext-billing-toggle-btn {
        transition: all 0.2s ease-in-out;
    }
    #ext-billing-toggle-btn:hover {
        background: #4f46e5 !important; /* Warna lebih gelap saat di-hover */
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* 6. MODE CETAK (Sangat Krusial untuk Dokumen Rumah Sakit) */
    @media print {
        /* Sembunyikan tombol UI saat masuk ke layar cetak/PDF */
        #ext-billing-toggle-btn, .no-print {
            display: none !important;
        }

        /* Pastikan elemen yang disembunyikan benar-benar hilang dari layout kertas */
        .ext-billing-hidden {
            display: none !important;
        }

        /* Hilangkan margin body bawaan browser agar pas di kertas */
        body {
            margin: 0 !important;
            padding: 0 !important;
        }
    }
  `;
  document.head.appendChild(style);
}

function isMklaimDetailPage() {
  return window.location.pathname.includes(SIMPLIFY_BILLING_CONFIG.detailUrlPattern);
}

/**
 * Helper untuk memformat angka ke string ribuan (mis: 2.165.250)
 */
function formatNumber(num) {
  return num.toLocaleString('id-ID').replace(/,/g, '.');
}

/**
 * Helper untuk memparsing string angka rupiah ke integer
 */
function parseCurrency(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d]/g, '');
  return parseInt(cleaned) || 0;
}

function parseTindakanSections(tbody) {
  const sections = [];
  let currentSection = null;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    if (!cells.length) continue;

    const bigColCell = row.querySelector('td[colspan="7"], td[colspan="8"]');
    if (bigColCell) {
      const unitName = bigColCell.textContent.trim();
      if (unitName && !unitName.match(/^\d/) && unitName.length > 0 && !unitName.toLowerCase().includes('cetak oleh')) {
        currentSection = { name: unitName, subtotal: null };
        sections.push(currentSection);
        continue;
      }
    }

    const subtotalCell = row.querySelector('td[colspan="5"]');
    if (subtotalCell && currentSection) {
      const tds = Array.from(cells);
      if (tds.length >= 3) {
        const vals = tds.slice(-3).map(td => td.textContent.trim());
        currentSection.subtotal = {
          tarif: parseCurrency(vals[0]),
          tunai: parseCurrency(vals[1]),
          jaminan: parseCurrency(vals[2])
        };
        currentSection = null;
      }
    }
  }
  return sections;
}

function parseResepSections(tbody) {
  const sections = [];
  let currentResep = null;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    if (!cells.length) continue;

    const secondTd = row.querySelector('td[colspan="6"]');
    if (secondTd) {
      const bold = secondTd.querySelector('b');
      if (bold && /\d{2}-\d{2}-\d{4}/.test(bold.textContent)) {
        const headerText = bold.textContent.trim().replace(/\s+/g, ' ');
        const match = headerText.match(/^(\d{2}-\d{2}-\d{4})\s+(.+?)\s+(\d+)$/);
        if (match) {
          currentResep = {
            label: `Resep ${match[1]} (No. ${match[3]})`,
            subtotal: null,
          };
          sections.push(currentResep);
          continue;
        }
      }
    }

    const subTotalCell = row.querySelector('td[colspan="4"]');
    if (subTotalCell && /sub\s*total/i.test(subTotalCell.textContent) && currentResep) {
      const tds = Array.from(cells);
      const vals = tds.slice(-3).map(td => td.textContent.trim());
      currentResep.subtotal = {
        tarif: parseCurrency(vals[0]),
        tunai: parseCurrency(vals[1]),
        jaminan: parseCurrency(vals[2])
      };
      currentResep = null;
    }
  }
  return sections;
}

function createSummaryRow(no, label, subtotal, isObat = false) {
  const tr = document.createElement('tr');
  tr.dataset.extSummary = 'true';

  if (isObat) {
    // Layout untuk Tabel Obat (Total 7 Kolom)
    tr.innerHTML = `
      <td align="center" width="5%">${no}.</td>
      <td align="left" colspan="2"><b style="font-size: 13px">${label}</b></td>
      <td align="center"></td>
      <td align="right">${formatNumber(subtotal.tarif)}</td>
      <td align="right">${formatNumber(subtotal.tunai)}</td>
      <td align="right">${formatNumber(subtotal.jaminan)}</td>
    `;
  } else {
    // Layout untuk Tabel Tindakan (Total 8 Kolom)
    tr.innerHTML = `
      <td align="center" width="5%">${no}.</td>
      <td align="left" colspan="3"><b style="font-size: 13px">${label}</b></td>
      <td align="center"></td>
      <td align="right">${formatNumber(subtotal.tarif)}</td>
      <td align="right">${formatNumber(subtotal.tunai)}</td>
      <td align="right">${formatNumber(subtotal.jaminan)}</td>
    `;
  }
  return tr;
}

function createTotalRow(label, totalObj, isObat = false) {
  const tr = document.createElement('tr');
  tr.dataset.extSummary = 'true';
  tr.className = 'ext-summary-total';

  // Tabel obat butuh colspan 4, sedangkan tabel tindakan butuh colspan 5
  const colSpanLabel = isObat ? 4 : 5;

  tr.innerHTML = `
    <td colspan="${colSpanLabel}" align="right"><b style="font-size: 13px">${label}</b></td>
    <td align="right"><b style="font-size: 13px">${formatNumber(totalObj.tarif)}</b></td>
    <td align="right"><b style="font-size: 13px">${formatNumber(totalObj.tunai)}</b></td>
    <td align="right"><b style="font-size: 13px">${formatNumber(totalObj.jaminan)}</b></td>
  `;
  return tr;
}

function applyRingkasMode(tbodies) {
  // Bersihkan summary sebelumnya
  Array.from(document.querySelectorAll('[data-ext-summary]')).forEach(el => el.remove());
  // Bersihkan class header-hidden
  Array.from(document.querySelectorAll('.ext-header-hidden')).forEach(el => el.classList.remove('ext-header-hidden'));
  if (!tbodies) return;

  const section = document.getElementById(SIMPLIFY_BILLING_CONFIG.targetSectionId);

  // Reset semua baris agar tidak tersembunyi dulu
  Array.from(section.querySelectorAll('tr.ext-billing-hidden')).forEach(r => {
    r.classList.remove('ext-billing-hidden');
  });

  // 0. Update Judul
  const titleEl = section.querySelector('u');
  if (titleEl && !titleEl.textContent.includes('(REKAPITULASI)')) {
    titleEl.innerHTML += ' (REKAPITULASI)';
  }

  // 0.5. Sembunyikan kolom frek di header tabel tindakan
  const tindakanHeader = Array.from(tbodies.tindakan?.querySelectorAll('tr.tabel-label') || []);
  tindakanHeader.forEach(tr => {
    const frekCell = tr.querySelector('td[align="center"][width="5%"]');
    if (frekCell && frekCell.textContent.trim() === 'frek') {
      frekCell.classList.add('ext-header-hidden');
    }
  });

  // 1. Proyeksi Tindakan
  let tindakanSectionCount = 0;
  if (tbodies.tindakan) {
    const sections = parseTindakanSections(tbodies.tindakan);
    const rows = Array.from(tbodies.tindakan.querySelectorAll('tr'));

    rows.forEach(r => {
      const txt = r.textContent.trim();
      const isHeader = r.classList.contains('tabel-label') || r.dataset.extSummary || txt.includes('BIAYA') && txt.includes('RINCIAN');
      const isFooter = footerKeywords.some(keyword => txt.includes(keyword));

      if (!isHeader && !isFooter) {
        r.classList.add('ext-billing-hidden');
      }
    });

    const frag = document.createDocumentFragment();
    const head = document.createElement('tr');
    head.dataset.extSummary = 'true';
    head.innerHTML = `<td colspan="8"><br><b style="font-size: 13px">A. TOTAL TINDAKAN PER UNIT</b></td>`;
    frag.appendChild(head);

    let totalA = { tarif: 0, tunai: 0, jaminan: 0 };
    sections.forEach((s, i) => {
      if (s.subtotal) {
        frag.appendChild(createSummaryRow(i + 1, `Sub Total Tindakan ${s.name}`, s.subtotal, false));
        totalA.tarif += s.subtotal.tarif;
        totalA.tunai += s.subtotal.tunai;
        totalA.jaminan += s.subtotal.jaminan;
        tindakanSectionCount++;
      }
    });

    const spacerBefore = document.createElement('tr');
    spacerBefore.dataset.extSummary = 'true';
    spacerBefore.innerHTML = '<td colspan="8" height="10"></td>';
    frag.appendChild(spacerBefore);

    frag.appendChild(createTotalRow('Total Jasa Tindakan Rp.', totalA, false));

    const spacerAfter = document.createElement('tr');
    spacerAfter.dataset.extSummary = 'true';
    spacerAfter.innerHTML = '<td colspan="8" height="20"></td>';
    frag.appendChild(spacerAfter);

    // Cari anchor yang tepat untuk menempatkan summary
    const anchor = rows.find(r => (r.textContent.includes('Total Jasa') || r.textContent.includes('Jasa Pelayanan')) && !r.dataset.extSummary);
    if (anchor) {
      tbodies.tindakan.insertBefore(frag, anchor);
    } else {
      tbodies.tindakan.appendChild(frag);
    }
  }

  // 2. Proyeksi Obat
  if (tbodies.obat) {
    const sections = parseResepSections(tbodies.obat);
    const rows = Array.from(tbodies.obat.querySelectorAll('tr'));

    rows.forEach(r => {
      const txt = r.textContent.trim();
      const isHeader = r.classList.contains('tabel-label') || r.dataset.extSummary;
      const isFooter = footerKeywords.some(keyword => txt.includes(keyword));

      if (!isHeader && !isFooter) {
        r.classList.add('ext-billing-hidden');
      }
    });

    const frag = document.createDocumentFragment();
    const head = document.createElement('tr');
    head.dataset.extSummary = 'true';
    head.innerHTML = `<td colspan="7"><b style="font-size: 13px">B. TOTAL PEMAKAIAN OBAT & ALKES PER RESEP</b></td>`;
    frag.appendChild(head);

    let totalB = { tarif: 0, tunai: 0, jaminan: 0 };
    const startNoB = tindakanSectionCount + 1; // Lanjut nomor dari jumlah tindakan + 1
    sections.forEach((s, i) => {
      if (s.subtotal) {
        frag.appendChild(createSummaryRow(startNoB + i, s.label, s.subtotal, true));
        totalB.tarif += s.subtotal.tarif;
        totalB.tunai += s.subtotal.tunai;
        totalB.jaminan += s.subtotal.jaminan;
      }
    });

    const spacerBefore = document.createElement('tr');
    spacerBefore.dataset.extSummary = 'true';
    spacerBefore.innerHTML = '<td colspan="7" height="10"></td>';
    frag.appendChild(spacerBefore);

    frag.appendChild(createTotalRow('Total Resep Obat & Alkes Rp.', totalB, true));

    const spacerAfter = document.createElement('tr');
    spacerAfter.dataset.extSummary = 'true';
    spacerAfter.innerHTML = '<td colspan="7" height="20"></td>';
    frag.appendChild(spacerAfter);

    // Cari anchor yang tepat untuk menempatkan summary obat
    const anchor = rows.find(r => {
      return footerKeywords.some(keyword => r.textContent.includes(keyword)) && !r.dataset.extSummary;
    });
    if (anchor) {
      tbodies.obat.insertBefore(frag, anchor);
    } else {
      tbodies.obat.appendChild(frag);
    }
  }
}

function applyPenuhMode() {
  Array.from(document.querySelectorAll('[data-ext-summary]')).forEach(el => el.remove());
  Array.from(document.querySelectorAll('.ext-header-hidden')).forEach(el => el.classList.remove('ext-header-hidden'));
  const section = document.getElementById(SIMPLIFY_BILLING_CONFIG.targetSectionId);
  if (section) {
    // Kembalikan Judul
    const titleEl = section.querySelector('u');
    if (titleEl) titleEl.innerHTML = titleEl.innerHTML.replace(' (REKAPITULASI)', '');

    Array.from(section.querySelectorAll('tr.ext-billing-hidden')).forEach(r => {
      r.classList.remove('ext-billing-hidden');
    });
  }
}

function findTableByContent(section, keyword) {
  return Array.from(section.querySelectorAll('table')).find(t => t.textContent.includes(keyword));
}

function getAllBillingTbodies() {
  const section = document.getElementById(SIMPLIFY_BILLING_CONFIG.targetSectionId);
  if (!section) return null;
  const tTindakan = findTableByContent(section, 'RINCIAN BIAYA');
  const tObat = findTableByContent(section, 'Nama Obat');
  return {
    tindakan: tTindakan ? tTindakan.querySelector('tbody') : null,
    obat: tObat ? tObat.querySelector('tbody') : null
  };
}

function renderToggleButton(section) {
  if (document.getElementById(SIMPLIFY_BILLING_CONFIG.toggleButtonId)) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = SIMPLIFY_BILLING_CONFIG.toggleButtonId;
  btn.style.cssText = `margin: 8px 0 4px 10px; padding: 5px 14px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; display: block;`;

  const updateLabel = () => {
    btn.textContent = billingViewMode === 'ringkas' ? '📄 Tampilkan Rincian Penuh' : '📋 Ringkaskan Rincian Biaya';
    btn.style.background = billingViewMode === 'ringkas' ? '#6366f1' : '#ef4444';
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tbodies = getAllBillingTbodies();
    billingViewMode = (billingViewMode === 'ringkas') ? 'penuh' : 'ringkas';
    if (billingViewMode === 'ringkas') applyRingkasMode(tbodies);
    else applyPenuhMode();
    updateLabel();
    sessionStorage.setItem(SIMPLIFY_BILLING_CONFIG.storageKey, billingViewMode);
  });

  updateLabel();
  const heading = section.querySelector('.panel-heading');
  if (heading) {
    heading.style.display = 'flex';
    heading.style.alignItems = 'center';
    heading.appendChild(btn);
  } else {
    section.insertBefore(btn, section.firstChild);
  }
}

function runSimplifyBillingFeature() {
  if (!currentConfig?.features?.simplifyBilling?.enabled) return;
  if (!isMklaimDetailPage()) return;

  const saved = sessionStorage.getItem(SIMPLIFY_BILLING_CONFIG.storageKey);
  if (saved) billingViewMode = saved;

  function tryApply() {
    const section = document.getElementById(SIMPLIFY_BILLING_CONFIG.targetSectionId);
    if (!section) return false;
    const tbodies = getAllBillingTbodies();
    if (!tbodies || (!tbodies.tindakan && !tbodies.obat)) return false;

    renderToggleButton(section);
    if (billingViewMode === 'ringkas') applyRingkasMode(tbodies);
    else applyPenuhMode();
    return true;
  }

  if (!tryApply()) {
    const obs = new MutationObserver(() => { if (tryApply()) obs.disconnect(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }
}

featureModules.simplifyBilling = {
  name: 'Ringkas Rincian Biaya',
  description: 'Ringkaskan tabel rincian biaya menjadi tampilan rekapituluasi yang rapi.',
  run: runSimplifyBillingFeature
};
