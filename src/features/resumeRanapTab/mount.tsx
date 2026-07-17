/* ── RI resume: fetch form data, render React, submit ke endpoint ── */

import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';
import type { RanapFormData, IcdItem } from './types';

const FORM_URL = '/admisi/detail-rawat-inap/edit-resume-ri';
const ENDPOINT = '/rekam-medik/control/edit-resume-rawat-inap';

let reactRoot: Root | null = null;
let overlayBtn: HTMLButtonElement | null = null;
let cachedData: RanapFormData | null = null;

function val(doc: Document, name: string): string {
  const el = doc.querySelector<HTMLInputElement>(`[name="${name}"]`);
  return el?.value ?? '';
}
function ta(doc: Document, name: string): string {
  const el = doc.querySelector<HTMLTextAreaElement>(`textarea[name="${name}"]`);
  return el?.textContent?.trim() ?? el?.value?.trim() ?? '';
}

function arrVal(doc: Document, name: string): string[] {
  return Array.from(doc.querySelectorAll<HTMLInputElement>(`[name="${name}"]`))
    .map((el) => el.value)
    .filter(Boolean);
}

function extractIcdItems(doc: Document, prefix: string, ids: string[]): IcdItem[] {
  const items: IcdItem[] = [];
  let i = 1;
  while (doc.querySelector(`#${prefix}${i}`)) {
    const kodeEl = doc.querySelector<HTMLInputElement>(`#kode_${prefix}${i}`);
    const namaEl = doc.querySelector<HTMLInputElement>(`#${prefix}${i}`);
    items.push({
      kode: kodeEl?.value ?? '',
      nama: namaEl?.value ?? '',
      id: ids[i - 1] ?? '',
    });
    i++;
  }
  return items;
}

function parseFormHtml(html: string): RanapFormData {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const idsSekunder = arrVal(doc, 'id_diagnosa_sekunder[]');
  const idsTindakan = arrVal(doc, 'id_tindakan[]');
  const idsNosokomial = arrVal(doc, 'id_nosokomial[]');

  return {
    id_visit: val(doc, 'id_visit'),
    id_resume_inap: val(doc, 'id_resume_inap'),
    id_user: val(doc, 'id_user'),
    id_bed: val(doc, 'id_bed'),
    unit: val(doc, 'unit'),
    noreg: val(doc, 'noreg'),
    norm: val(doc, 'norm'),
    pasien: val(doc, 'pasien'),
    // Ringkasan
    dokter_bersama: val(doc, 'dokter_bersama'),
    alasan_rawat: val(doc, 'alasan_rawat'),
    anamnesa: ta(doc, 'anamnesa'),
    riwayat_penyakit: ta(doc, 'riwayat_penyakit'),
    // Vital
    tensi: val(doc, 'tensi'),
    nadi: val(doc, 'nadi'),
    suhu: val(doc, 'suhu'),
    spo2: val(doc, 'spo2'),
    nafas: val(doc, 'nafas'),
    gcs_e: val(doc, 'gcs_e'),
    gcs_m: val(doc, 'gcs_m'),
    gcs_v: val(doc, 'gcs_v'),
    // Pemeriksaan & Diagnosa
    fisik_text: ta(doc, 'fisik_text'),
    laborat: ta(doc, 'laborat'),
    diagnosa_primary: ta(doc, 'diagnosa_primary'),
    diagnosa_skunder: ta(doc, 'diagnosa_skunder'),
    diagnosa_tindakan: ta(doc, 'diagnosa_tindakan'),
    tindakan: ta(doc, 'tindakan'),
    terapi_pengobatan: ta(doc, 'terapi_pengobatan'),
    obat_plg: ta(doc, 'obat_plg'),
    tindakan_dua: ta(doc, 'tindakan_dua'),
    jenis_kasus: val(doc, 'jenis_kasus'),
    // ICD
    kode_diagnosa_utama: doc.querySelector<HTMLInputElement>('#kode_diagnosa_utama')?.value ?? '',
    diagnosa_utama_nama: doc.querySelector<HTMLInputElement>('#diagnosa_utama')?.value ?? '',
    id_diagnosa_utama: val(doc, 'id_diagnosa_utama'),
    icd_sekunder: extractIcdItems(doc, 'diagnosa_sekunder', idsSekunder),
    icd_tindakan: extractIcdItems(doc, 'tindakan', idsTindakan),
    icd_nosokomial: extractIcdItems(doc, 'nosokomial', idsNosokomial),
    // Kondisi pulang
    ku: val(doc, 'ku'),
    kes: val(doc, 'kes'),
    td_pulang: val(doc, 'td_pulang'),
    nadi_pulang: val(doc, 'nadi_pulang'),
    suhu_pulang: val(doc, 'suhu_pulang'),
    rr_pulang: val(doc, 'rr_pulang'),
    spo2_pulang: val(doc, 'spo2_pulang'),
    catatan_keluar: ta(doc, 'catatan_keluar'),
    keadaan_keluar: val(doc, 'keadaan_keluar'),
    cara_keluar: val(doc, 'cara_keluar'),
    penyebab_kematian: ta(doc, 'penyebab_kematian'),
    instruksi_pulang: ta(doc, 'instruksi_pulang'),
    // Keluar
    tgl_keluar: val(doc, 'tgl_keluar'),
    jadwal_kontrol: val(doc, 'jadwal_kontrol'),
    pemeriksaan_lanjut: val(doc, 'pemeriksaan_lanjut'),
    kelas: val(doc, 'kelas'),
    id_kelas: val(doc, 'id_kelas'),
  };
}

async function fetchFormData(): Promise<RanapFormData | null> {
  const idVisit = new URLSearchParams(location.search).get('id_visit');
  if (!idVisit) return null;

  try {
    // 1. Dapatkan resume ID dari halaman daftar resume
    const listResp = await fetch(`/admisi/detail-rawat-inap/resume-ri?idVisit=${idVisit}`, {
      credentials: 'same-origin',
    });
    const listHtml = await listResp.text();
    const resumeId = listHtml.match(/edit\((\d+),/)?.[1] ?? '';

    if (!resumeId) {
      console.warn('[RI] no existing resume found, using empty form');
    }

    // 2. Fetch halaman form dengan ID resume
    const url = resumeId
      ? `${FORM_URL}?idVisit=${idVisit}&id=${resumeId}`
      : `${FORM_URL}?idVisit=${idVisit}`;
    const resp = await fetch(url, { credentials: 'same-origin' });
    const html = await resp.text();
    return parseFormHtml(html);
  } catch (e) {
    console.error('[RI] fetch failed:', e);
    return null;
  }
}

function serializeFormData(data: RanapFormData): string {
  const pairs: [string, string][] = [];
  const add = (name: string, v: string) => {
    if (v) pairs.push([name, v]);
  };

  add('id_visit', data.id_visit);
  add('id_resume_inap', data.id_resume_inap);
  add('id_user', data.id_user);
  add('id_bed', data.id_bed);
  add('unit', data.unit);
  add('noreg', data.noreg);
  add('norm', data.norm);
  add('pasien', data.pasien);
  add('dokter_bersama', data.dokter_bersama);
  add('alasan_rawat', data.alasan_rawat);
  add('anamnesa', data.anamnesa);
  add('riwayat_penyakit', data.riwayat_penyakit);
  add('tensi', data.tensi);
  add('nadi', data.nadi);
  add('suhu', data.suhu);
  add('spo2', data.spo2);
  add('nafas', data.nafas);
  add('gcs_e', data.gcs_e);
  add('gcs_m', data.gcs_m);
  add('gcs_v', data.gcs_v);
  add('fisik_text', data.fisik_text);
  add('laborat', data.laborat);
  add('diagnosa_primary', data.diagnosa_primary);
  add('diagnosa_skunder', data.diagnosa_skunder);
  add('diagnosa_tindakan', data.diagnosa_tindakan);
  add('tindakan', data.tindakan);
  add('terapi_pengobatan', data.terapi_pengobatan);
  add('obat_plg', data.obat_plg);
  add('tindakan_dua', data.tindakan_dua);
  add('jenis_kasus', data.jenis_kasus);
  add('id_diagnosa_utama', data.id_diagnosa_utama);
  data.icd_sekunder.forEach((item) => add('id_diagnosa_sekunder[]', item.id));
  data.icd_tindakan.forEach((item) => add('id_tindakan[]', item.id));
  data.icd_nosokomial.forEach((item) => add('id_nosokomial[]', item.id));
  add('ku', data.ku);
  add('kes', data.kes);
  add('td_pulang', data.td_pulang);
  add('nadi_pulang', data.nadi_pulang);
  add('suhu_pulang', data.suhu_pulang);
  add('rr_pulang', data.rr_pulang);
  add('spo2_pulang', data.spo2_pulang);
  add('catatan_keluar', data.catatan_keluar);
  add('keadaan_keluar', data.keadaan_keluar);
  add('cara_keluar', data.cara_keluar);
  add('penyebab_kematian', data.penyebab_kematian);
  add('instruksi_pulang', data.instruksi_pulang);
  add('tgl_keluar', data.tgl_keluar);
  add('jadwal_kontrol', data.jadwal_kontrol);
  add('pemeriksaan_lanjut', data.pemeriksaan_lanjut);
  add('kelas', data.kelas);
  add('id_kelas', data.id_kelas);
  add('save', 'Simpan');
  return pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

function closeOverlay() {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  const c = document.getElementById('ext-ri-container');
  if (c) c.remove();
  document.body.classList.remove('ext-ri-open');
  if (overlayBtn) overlayBtn.disabled = false;
}

function mountReactApp(data: RanapFormData) {
  const container = document.createElement('div');
  container.id = 'ext-ri-container';
  container.style.cssText =
    'position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center';
  document.body.appendChild(container);
  document.body.classList.add('ext-ri-open');

  if (!document.getElementById('ext-ri-css')) {
    const s = document.createElement('style');
    s.id = 'ext-ri-css';
    s.textContent = `
      .ri-modal{background:#fff;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.25);width:94%;max-width:900px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;animation:ri-up .25s ease}
      .ri-modal textarea,.ri-modal input,.ri-modal select{resize:vertical!important;pointer-events:auto!important}
      @keyframes ri-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    `;
    document.head.appendChild(s);
  }

  reactRoot = createRoot(container);

  const handleSave = async (formData: RanapFormData): Promise<void> => {
    const body = serializeFormData(formData);
    const resp = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      credentials: 'same-origin',
    });
    const text = await resp.text();
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const phpPattern = /(?:Notice|Warning|Fatal error|Parse error)/i;
    if (phpPattern.test(text) && text.length < 300) throw new Error('PHP error');
    cachedData = null;
  };

  reactRoot.render(
    <ErrorBoundary onError={() => setTimeout(closeOverlay, 0)}>
      <App data={data} onSave={handleSave} onClose={closeOverlay} />
    </ErrorBoundary>,
  );

  setTimeout(() => {
    container.querySelectorAll('textarea').forEach((tx) => {
      tx.addEventListener('input', () => {
        tx.style.height = 'auto';
        tx.style.height = tx.scrollHeight + 'px';
      });
      tx.dispatchEvent(new Event('input'));
    });
  }, 0);
}

async function isFeatureEnabled(): Promise<boolean> {
  try {
    const result = await chrome.storage.sync.get('extensionConfig');
    return result.extensionConfig?.features?.resumeRanap?.enabled === true;
  } catch {
    return true;
  }
}

async function init() {
  if (!location.href.startsWith(location.origin + '/v2/m-klaim/detail-v2-refaktor')) return;
  if (!(await isFeatureEnabled())) return;
  const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
  if (
    loginPaths.some((p) => location.pathname.toLowerCase().includes(p)) ||
    document.querySelectorAll('input[type="password"]').length > 0
  )
    return;
  const idVisit = new URLSearchParams(location.search).get('id_visit');
  if (!idVisit) return;
  const jenis =
    document.querySelector<HTMLInputElement>('input[name=jenis]')?.value ??
    document.querySelector<HTMLSelectElement>('select[name=jenis]')?.value ??
    '';
  if (!jenis.toUpperCase().includes('INAP')) return;
  if (document.getElementById('ext-ri-container')) return;

  overlayBtn = document.createElement('button');
  overlayBtn.id = 'ext-ri-float-btn';
  overlayBtn.textContent = 'RI';
  overlayBtn.title = 'Resume Rawat Inap';
  overlayBtn.style.cssText =
    'position:fixed;right:16px;top:calc(50% + 52px);transform:translateY(-50%);z-index:2147483645;' +
    'width:44px;height:44px;border-radius:10px;border:none;background:#059669;color:#fff;' +
    'font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)';

  overlayBtn.onclick = async () => {
    if (overlayBtn!.disabled) return;
    overlayBtn!.disabled = true;
    try {
      if (!cachedData) cachedData = await fetchFormData();
      if (!cachedData) {
        alert('Gagal memuat data');
        overlayBtn!.disabled = false;
        return;
      }
      mountReactApp(cachedData);
    } catch (e) {
      console.error('[RI] error:', e);
      alert('Gagal: ' + (e instanceof Error ? e.message : String(e)));
      overlayBtn!.disabled = false;
    }
  };
  document.body.appendChild(overlayBtn);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
else init();
