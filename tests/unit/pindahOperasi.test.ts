import { describe, expect, it } from 'vitest';
import { isStatusListPage, saveEndpointFor } from '../../src/features/pindahOperasi/main.js';

describe('pindahOperasi — endpoint simpan per halaman', () => {
  it('edit-operasi pakai endpoint pengajuan', () => {
    expect(saveEndpointFor('/admisi/pelaksanaan-operasi/edit-operasi/form')).toBe(
      '/admisi/pelaksanaan_pelayanan/control/pengajuan-operasi?opsi=simpan',
    );
  });
  it('endoskopi detail pakai control endoskopi', () => {
    expect(saveEndpointFor('/admisi/pelaksanaan-operasi/endoskopi/detail_operasi')).toBe(
      '/admisi/pelaksanaan-operasi/endoskopi/control',
    );
  });
  it('cathlab detail pakai control cathlab', () => {
    expect(saveEndpointFor('/admisi/pelaksanaan-operasi/cathlab/detail_operasi')).toBe(
      '/admisi/pelaksanaan-operasi/cathlab/control',
    );
  });
});

describe('pindahOperasi — status rollback di daftar endoskopi/cathlab', () => {
  it('deteksi halaman daftar endoskopi/cathlab', () => {
    expect(isStatusListPage('/admisi/pelaksanaan-operasi/endoskopi')).toBe(true);
    expect(isStatusListPage('/admisi/pelaksanaan-operasi/cathlab')).toBe(true);
    expect(isStatusListPage('/admisi/pelaksanaan-operasi')).toBe(false);
    expect(isStatusListPage('/admisi/pelaksanaan_pelayanan/edit-operasi/form')).toBe(false);
  });
});
