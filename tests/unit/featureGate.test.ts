import { describe, it, expect } from 'vitest';
import { decideFeatureGate } from '../../src/features/shared/featureGate.js';

const cfg = (features: Record<string, object>, role = 'casemix') => ({
  currentRole: role,
  features,
});

describe('featureGate — decideFeatureGate', () => {
  it('entry hilang = ON (kompatibel mundur, fitur lama selalu jalan)', () => {
    expect(decideFeatureGate('apaSaja', null)).toBe(true);
    expect(decideFeatureGate('apaSaja', undefined)).toBe(true);
    expect(decideFeatureGate('apaSaja', cfg({}))).toBe(true);
    expect(decideFeatureGate('apaSaja', cfg({ lain: { enabled: true } }))).toBe(true);
  });

  it('enabled === false = OFF walau role admin', () => {
    const c = cfg({ f: { enabled: false, allowedRoles: ['casemix', 'admin'] } }, 'admin');
    expect(decideFeatureGate('f', c)).toBe(false);
  });

  it('enabled true + role diizinkan = ON', () => {
    const c = cfg({ f: { enabled: true, allowedRoles: ['casemix', 'admin'] } });
    expect(decideFeatureGate('f', c)).toBe(true);
  });

  it('enabled true + role tak diizinkan = OFF', () => {
    const c = cfg({ f: { enabled: true, allowedRoles: ['casemix'] } }, 'kasir');
    expect(decideFeatureGate('f', c)).toBe(false);
  });

  it('admin selalu ON bila enabled (konsisten init.ts/popup)', () => {
    const c = cfg({ f: { enabled: true, allowedRoles: ['kasir'] } }, 'admin');
    expect(decideFeatureGate('f', c)).toBe(true);
  });

  it('allowedRoles kosong/hilang = tak ada batasan role', () => {
    expect(decideFeatureGate('f', cfg({ f: { enabled: true } }, 'kasir'))).toBe(true);
    expect(decideFeatureGate('f', cfg({ f: { enabled: true, allowedRoles: [] } }, 'kasir'))).toBe(
      true,
    );
  });

  it('entry tanpa flag enabled = ON (default lama)', () => {
    expect(decideFeatureGate('f', cfg({ f: {} }, 'kasir'))).toBe(true);
  });

  it('role eksplisit mengalahkan currentRole config', () => {
    const c = cfg({ f: { enabled: true, allowedRoles: ['kasir'] } }, 'casemix');
    expect(decideFeatureGate('f', c, 'kasir')).toBe(true);
    expect(decideFeatureGate('f', c, 'dokter')).toBe(false);
  });
});
