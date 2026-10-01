import { describe, it, expect } from 'vitest';
import { restoreBreaks } from '../../src/features/shared/noteText.js';

describe('restoreBreaks', () => {
  it('membiarkan \\n yang sudah benar tetap utuh', () => {
    expect(restoreBreaks('CM\nNT BAHU +\nNT LEHER +')).toBe('CM\nNT BAHU +\nNT LEHER +');
  });

  it('mengubah literal <br/> dari korupsi serializer lama menjadi \\n', () => {
    expect(restoreBreaks('Vod 6/30 x95<br/>Vos 6/20 x105<br/>ods lensa keruh')).toBe(
      'Vod 6/30 x95\nVos 6/20 x105\nods lensa keruh',
    );
  });

  it('mengenali varian <br>, <br />, <BR> (case & slash & spasi)', () => {
    expect(restoreBreaks('a<br>b')).toBe('a\nb');
    expect(restoreBreaks('a<br/>b')).toBe('a\nb');
    expect(restoreBreaks('a<br />b')).toBe('a\nb');
    expect(restoreBreaks('a<BR>b')).toBe('a\nb');
    expect(restoreBreaks('a<Br />b')).toBe('a\nb');
  });

  it('idempoten untuk input yang sudah dinormalisasi', () => {
    const raw = 'Vod\nx95<br/>Vos\nx105';
    const once = restoreBreaks(raw);
    expect(restoreBreaks(once)).toBe(once);
  });

  it('menangani nilai kosong / undefined', () => {
    expect(restoreBreaks('')).toBe('');
    // @ts-expect-error memanggil dengan undefined — restoreBreaks harus toleran
    expect(restoreBreaks(undefined)).toBe('');
  });

  it('tidak menyentuh teks biasa tanpa tag br', () => {
    expect(restoreBreaks('mata buram')).toBe('mata buram');
    expect(restoreBreaks('tidak ada keluhan')).toBe('tidak ada keluhan');
  });
});
