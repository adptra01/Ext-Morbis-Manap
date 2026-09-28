import { describe, it, expect } from 'vitest';
import { stripDevHosts, DEV_HOSTS } from '../../scripts/manifest-transform.mjs';

const baseManifest = {
  manifest_version: 3,
  host_permissions: [
    'http://103.147.236.140/*',
    'http://127.0.0.1/*',
    'http://localhost/*',
    'http://*.ddev.site/*',
  ],
};

describe('stripDevHosts (phase D: production manifest bersih)', () => {
  it('menghapus semua host development dari host_permissions', () => {
    const out = stripDevHosts(baseManifest);
    for (const host of DEV_HOSTS) {
      expect(out.host_permissions).not.toContain(host);
    }
  });

  it('mempertahankan host produksi SIMRS', () => {
    const out = stripDevHosts(baseManifest);
    expect(out.host_permissions).toEqual(['http://103.147.236.140/*']);
  });

  it('tidak berubah saat manifest sudah bersih', () => {
    const clean = { host_permissions: ['http://103.147.236.140/*'] };
    expect(stripDevHosts(clean).host_permissions).toEqual(['http://103.147.236.140/*']);
  });

  it('tidak bermutasi input (murni)', () => {
    const input = JSON.parse(JSON.stringify(baseManifest));
    stripDevHosts(input);
    expect(input.host_permissions).toEqual(baseManifest.host_permissions);
  });
});
