/** Penyimpanan dossier cetak & handler halaman — dipakai bersama oleh
 *  content script mKlaimPrint (produsen HTML) dan extension page
 *  print-berkas-klaim (konsumen, tahan refresh).

 * catatan: chrome.storage.session otomatis bersih saat browser restart. */
const PREFIX = 'extDossier:';

export async function saveDossier(html: string): Promise<string> {
  const key = `${PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    await chrome.storage.session.set({ [key]: html });
  } catch {
    // sesi penuh (besarnya data URL hasil scan) → fallback ke local
    await chrome.storage.local.set({ [key]: html });
  }
  return key;
}

export async function loadDossier(key: string): Promise<string | null> {
  let got = (await chrome.storage.session.get(key)) as Record<string, unknown>;
  let html = got[key];
  if (typeof html !== 'string') {
    got = (await chrome.storage.local.get(key)) as Record<string, unknown>;
    html = got[key];
  }
  return typeof html === 'string' ? html : null;
}

/** Alat layar lampiran hasil scan: rotasi 90° & hapus (tidak ikut tercetak). */
export function installImageTools(win: Window): void {
  const doc = win.document;
  const setup = (img: HTMLImageElement): void => {
    if (img.dataset.tools || !img.naturalWidth || img.naturalWidth < 260) return;
    if (img.closest('table')) return;
    img.dataset.tools = '1';
    const wrap = doc.createElement('span');
    wrap.className = 'img-wrap';
    img.parentNode?.insertBefore(wrap, img);
    wrap.appendChild(img);

    const tools = doc.createElement('span');
    tools.className = 'img-tools';
    const mk = (label: string, act: string): HTMLButtonElement => {
      const b = doc.createElement('button');
      b.type = 'button';
      b.dataset.act = act;
      b.textContent = label;
      return b;
    };
    tools.appendChild(mk('↻ Rotasi 90°', 'rot'));
    tools.appendChild(mk('Hapus', 'del'));
    wrap.insertBefore(tools, img);

    tools.addEventListener('click', (ev) => {
      const act = (ev.target as HTMLElement).closest('button')?.dataset.act;
      if (act === 'del') {
        wrap.remove();
        return;
      }
      if (act !== 'rot') return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;
      const c = doc.createElement('canvas');
      c.width = h;
      c.height = w;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.translate(h / 2, w / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -w / 2, -h / 2);
      try {
        img.src = c.toDataURL('image/png');
      } catch {
        /* gambar lintas-origin tidak bisa diputar */
      }
    });
  };
  doc.querySelectorAll<HTMLImageElement>('.doc-body img').forEach((img) => {
    if (img.complete) setup(img);
    else img.addEventListener('load', () => setup(img), { once: true });
  });
}

/** Pasang semua handler toolbar di halaman dossier (print, filter, verifikasi). */
export function installDossierHandlers(win: Window): void {
  const doPrint = (): void => {
    try {
      win.focus();
      win.print();
    } catch {
      /* abaikan */
    }
  };
  const d = win.document;
  d.getElementById('btnPrintPdf')?.addEventListener('click', doPrint);

  const pages = Array.from(d.querySelectorAll<HTMLElement>('.rm-page'));
  const sel = d.getElementById('rmSectionSelect') as HTMLSelectElement | null;
  const tabs = Array.from(d.querySelectorAll<HTMLButtonElement>('.tab-btn'));
  const filter = (target: string): void => {
    if (sel) sel.value = target;
    tabs.forEach((b) => b.classList.toggle('active', b.dataset.target === target));
    pages.forEach((pg) =>
      pg.classList.toggle('hidden-section', target !== 'all' && pg.id !== target),
    );
    win.scrollTo({ top: 0, behavior: 'smooth' });
  };
  sel?.addEventListener('change', (ev) => filter((ev.target as HTMLSelectElement).value));
  tabs.forEach((b) => b.addEventListener('click', () => filter(b.dataset.target || 'all')));

  const countEl = d.getElementById('checkCounter');
  const boxes = Array.from(d.querySelectorAll<HTMLInputElement>('.rm-checkbox, .vbox'));
  const syncCount = (): void => {
    if (countEl) countEl.textContent = `${boxes.filter((b) => b.checked).length} / ${boxes.length}`;
  };
  boxes.forEach((b) => b.addEventListener('change', syncCount));
  d.getElementById('btnCheckAll')?.addEventListener('click', () => {
    boxes.forEach((b) => (b.checked = true));
    syncCount();
  });
  d.getElementById('btnResetChecks')?.addEventListener('click', () => {
    boxes.forEach((b) => (b.checked = false));
    syncCount();
  });
  syncCount();
  win.addEventListener('afterprint', () => {
    if (win.confirm('Apakah menu print ini akan ditutup?')) win.close();
  });
}
