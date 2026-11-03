import { describe, it, expect } from 'vitest';
import {
  isDepoRanap,
  isRawatInapAtauIgd,
  isResepAsliAllowed,
} from '../../src/features/shared/unitGate';

function makeDoc(html: string): Document {
  // Minimal mock: body.textContent + querySelectorAll('table')
  const body = { textContent: html } as unknown as HTMLElement;
  const tables: Element[] = [];
  // Parse <table>...</table> blocks
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let m;
  while ((m = tableRegex.exec(html)) !== null) {
    const tableHtml = m[0];
    const rows: Element[] = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    while ((trMatch = trRegex.exec(tableHtml)) !== null) {
      const trHtml = trMatch[1];
      const tds: Element[] = [];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;
      while ((tdMatch = tdRegex.exec(trHtml)) !== null) {
        const td = { textContent: tdMatch[1].replace(/<[^>]+>/g, '') } as unknown as Element;
        tds.push(td);
      }
      const tr = { querySelectorAll: () => tds } as unknown as Element;
      rows.push(tr);
    }
    const table = {
      querySelectorAll: (sel: string) => {
        if (sel === 'tr') return rows;
        if (sel === 'tr:first-child td')
          return rows.length > 0 ? (rows[0] as any).querySelectorAll('td') : [];
        return [];
      },
    } as unknown as Element;
    tables.push(table);
  }

  const doc = {
    body,
    querySelectorAll: (sel: string) => {
      if (sel === 'table') return tables;
      return [];
    },
  } as unknown as Document;
  return doc;
}

describe('isDepoRanap', () => {
  it('returns true when page contains DEPO RANAP', () => {
    const doc = makeDoc('<body><td>Unit</td><td>DEPO RANAP</td></body>');
    expect(isDepoRanap(doc)).toBe(true);
  });

  it('returns true case-insensitive', () => {
    const doc = makeDoc('<body><span>depo ranap</span></body>');
    expect(isDepoRanap(doc)).toBe(true);
  });

  it('returns false when no DEPO RANAP', () => {
    const doc = makeDoc('<body><td>Unit</td><td>DEPO RAJAL</td></body>');
    expect(isDepoRanap(doc)).toBe(false);
  });
});

describe('isRawatInapAtauIgd', () => {
  it('returns true when Ruangan contains IGD', () => {
    const doc = makeDoc('<table><tr><td>Ruangan</td><td>IGD</td></tr></table>');
    expect(isRawatInapAtauIgd(doc)).toBe(true);
  });

  it('returns true when Kelas contains Rawat Inap', () => {
    const doc = makeDoc('<table><tr><td>Kelas Rawat</td><td>Rawat Inap</td></tr></table>');
    expect(isRawatInapAtauIgd(doc)).toBe(true);
  });

  it('returns true when Jenis Kunjungan contains Rawat Inap', () => {
    const doc = makeDoc('<table><tr><td>Jenis Kunjungan</td><td>RAWAT INAP</td></tr></table>');
    expect(isRawatInapAtauIgd(doc)).toBe(true);
  });

  it('returns true when body contains IGD', () => {
    const doc = makeDoc('<body><span>Kelas: IGD</span></body>');
    expect(isRawatInapAtauIgd(doc)).toBe(true);
  });

  it('returns false for rawat jalan biasa', () => {
    const doc = makeDoc(
      '<table><tr><td>Ruangan</td><td>Poli Umum</td></tr><tr><td>Kelas</td><td>III</td></tr></table>',
    );
    expect(isRawatInapAtauIgd(doc)).toBe(false);
  });
});

describe('isResepAsliAllowed', () => {
  it('returns true for depo ranap', () => {
    const doc = makeDoc('<body><td>DEPO RANAP</td></body>');
    expect(isResepAsliAllowed(doc)).toBe(true);
  });

  it('returns true for pasien IGD', () => {
    const doc = makeDoc('<table><tr><td>Kelas</td><td>IGD</td></tr></table>');
    expect(isResepAsliAllowed(doc)).toBe(true);
  });

  it('returns false for rajal biasa tanpa depo ranap', () => {
    const doc = makeDoc('<table><tr><td>Ruangan</td><td>Poli Umum</td></tr></table>');
    expect(isResepAsliAllowed(doc)).toBe(false);
  });
});
