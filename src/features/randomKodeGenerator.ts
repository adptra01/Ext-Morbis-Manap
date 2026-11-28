/**
 * randomKodeGenerator — tombol "Generate Kode" di form tambah layanan &
 * pemeriksaan lab. Kode diacak lalu dicek ke tabel asli supaya unik.
 *
 * Halaman:
 *   /admisi/data-layanan/?do=add      → #kode_layanan
 *   /laboratorium/data-pemeriksaan-lab?do=add → #kode_u + #kode
 */
import { whenFeatureEnabled } from './shared/featureGate.js';

const BTN_ID = 'ext-random-kode-btn';
const STATUS_ID = 'ext-random-kode-status';
const MAX_PERCUBAAN = 12;

type Jenis = 'layanan' | 'lab';

/** Teks sel tanpa tag/entity — untuk parser HTML tabel murni. */
function bersihkan(s: string): string {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/** Benar kalau kode sudah dipakai baris mana pun di tabel (murni, unit-tested). */
export function kodeSudahAda(html: string, kode: string): boolean {
  const target = bersihkan(kode);
  if (!target) return false;
  for (const baris of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || []) {
    const sel = Array.from(baris.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)).map((m) =>
      bersihkan(m[1]),
    );
    if (sel.includes(target)) return true;
  }
  return false;
}

/** Kode acak: prefix + 6 karakter alfanumerik (huruf besar). */
export function buatKode(prefix: string, panjang = 6): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // tanpa I/O/0/1 (mudah salah baca)
  const bytes = new Uint8Array(panjang);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < panjang; i++) bytes[i] = Math.floor(Math.random() * 256);
  let out = prefix.toUpperCase();
  for (let i = 0; i < panjang; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function jenisHalaman(): Jenis | null {
  const p = location.pathname.toLowerCase();
  if (p.includes('/admisi/data-layanan')) return 'layanan';
  if (p.includes('/laboratorium/data-pemeriksaan-lab')) return 'lab';
  return null;
}

function fieldKode(jenis: Jenis): string {
  return jenis === 'layanan' ? 'kode_layanan' : 'kode_u';
}

async function kodeTersedia(jenis: Jenis, kode: string): Promise<boolean> {
  // Endpoint asli memakai query datar `?do=tabel&category=N&key=...`
  const url =
    (jenis === 'layanan' ? '/admisi/data-layanan' : '/laboratorium/data-pemeriksaan-lab') +
    '?do=tabel&category=' +
    (jenis === 'layanan' ? '8' : '2') +
    '&key=' +
    encodeURIComponent(kode);
  const r = await fetch(url, { credentials: 'include', cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const html = await r.text();
  if (/Morbis \| Login/i.test(html)) throw new Error('sesi MORBIS habis');
  return !kodeSudahAda(html, kode);
}

function statusEl(): HTMLElement {
  let el = document.getElementById(STATUS_ID);
  if (!el) {
    el = document.createElement('span');
    el.id = STATUS_ID;
    el.style.cssText = 'font-size:12px;margin-left:8px;font-weight:600;';
    const btn = document.getElementById(BTN_ID);
    btn?.parentNode?.insertBefore(el, btn.nextSibling);
  }
  return el;
}

function pasangTombol(input: HTMLInputElement, jenis: Jenis): void {
  if (document.getElementById(BTN_ID)) return;
  const btn = document.createElement('button');
  btn.id = BTN_ID;
  btn.type = 'button';
  btn.textContent = '🎲 Generate Kode';
  btn.title = 'Buat kode acak yang belum dipakai';
  btn.style.cssText =
    'margin-left:6px;padding:6px 10px;border:none;border-radius:5px;background:#6d4df5;color:#fff;font-weight:700;cursor:pointer;vertical-align:middle;';
  input.parentNode?.insertBefore(btn, input.nextSibling);

  btn.addEventListener('click', () => void generate(jenis));
}

async function generate(jenis: Jenis): Promise<void> {
  const btn = document.getElementById(BTN_ID) as HTMLButtonElement | null;
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  statusEl().textContent = 'Mencari kode unik…';
  const prefix = jenis === 'layanan' ? 'LAY' : 'LAB';
  try {
    let kode = '';
    for (let i = 0; i < MAX_PERCUBAAN; i++) {
      const kandidat = buatKode(prefix);
      if (await kodeTersedia(jenis, kandidat)) {
        kode = kandidat;
        break;
      }
    }
    if (!kode) throw new Error('tidak ada kode unik setelah ' + MAX_PERCUBAAN + ' percobaan');
    const target = document.querySelector<HTMLInputElement>(
      'input[name="' + fieldKode(jenis) + '"]',
    );
    if (!target) throw new Error('field kode tidak ditemukan');
    target.value = kode;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    if (jenis === 'lab') {
      const list = document.querySelector<HTMLInputElement>('input[name="kode"]');
      if (list) {
        list.value = kode;
        list.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    statusEl().style.color = '#166534';
    statusEl().textContent = 'Kode ' + kode + ' tersedia.';
  } catch (e) {
    statusEl().style.color = '#b91c1c';
    statusEl().textContent = 'Gagal: ' + String((e as Error).message ?? e);
  } finally {
    btn.disabled = false;
  }
}

function start(): void {
  if (typeof document === 'undefined' || typeof location === 'undefined') return;
  const jenis = jenisHalaman();
  if (!jenis || document.querySelector('input[type="password"]')) return;

  const cobaPasang = (): void => {
    const input = document.querySelector<HTMLInputElement>(
      'input[name="' + fieldKode(jenis) + '"]',
    );
    if (input) pasangTombol(input, jenis);
  };
  cobaPasang();

  // Form "Tambah" bisa dimuat belakangan lewat contentloader MORBIS.
  if (typeof MutationObserver !== 'undefined') {
    let t = 0;
    new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(cobaPasang, 150);
    }).observe(document.body, { childList: true, subtree: true });
  }
}

whenFeatureEnabled('randomKodeGenerator', start);
