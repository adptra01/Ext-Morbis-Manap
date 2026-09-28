import { describe, it, expect, vi, afterEach } from 'vitest';

// Helper versi dibaca dari chrome.runtime.getManifest(). Cases ini menjaga
// dua hal: (1) badge ikut manifest, (2) tidak ada string versi hardcode di UI.
describe('getVersionBadge', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubManifest = (version: string) => {
    vi.stubGlobal('chrome', {
      runtime: { getManifest: () => ({ version }) },
    });
  };

  it('mengembalikan v<versi dari manifest', async () => {
    stubManifest('1.5.92');
    const { getVersionBadge, getExtensionVersion } = await import('../../src/shared/version');
    expect(getExtensionVersion()).toBe('1.5.92');
    expect(getVersionBadge()).toBe('v1.5.92');
  });

  it('kosong bila chrome tidak tersedia (unit test/node)', async () => {
    vi.stubGlobal('chrome', undefined);
    const { getVersionBadge, getExtensionVersion } = await import('../../src/shared/version');
    expect(getExtensionVersion()).toBe('');
    expect(getVersionBadge()).toBe('');
  });

  it('tidak melempar saat getManifest tidak lengkap', async () => {
    vi.stubGlobal('chrome', { runtime: {} });
    const { getExtensionVersion } = await import('../../src/shared/version');
    expect(getExtensionVersion()).toBe('');
  });
});

describe('UI: tidak ada versi hardcode', () => {
  // Regresi nyata: badge side panel pernah macet di "v1.2" sementara manifest
  // sudah 1.5.x. Pola ini yang harus dicegah, bukan nilai versinya.
  const files = ['src/popup/App.tsx', 'src/features/sidepanel/App.tsx'];

  it.each(files)('%s tidak memuat string versi hardcode', async (file) => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const src = readFileSync(resolve(process.cwd(), file), 'utf8');
    // v1.2, v1.5.9, dst — bentuk "v" + angka, bukan callsite getVersionBadge.
    const hardcoded = src.match(/>\s*v\d+(\.\d+)+\s*</);
    expect(hardcoded, `hardcoded version found in ${file}`).toBeNull();
    expect(src).toContain('getVersionBadge');
  });
});
