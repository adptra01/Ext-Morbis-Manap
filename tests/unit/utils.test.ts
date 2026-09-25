import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Shared Utils - Pure Functions', () => {
  describe('fetchFileFromUrl', () => {
    it('throws on non-ok response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
      const { fetchFileFromUrl } = await import('../../src/features/shared/utils.js');
      await expect(fetchFileFromUrl('http://test.com/file.pdf', 'file.pdf')).rejects.toThrow(
        'HTTP 404',
      );
    });

    it('returns File on successful fetch', async () => {
      const blob = new Blob(['test'], { type: 'application/pdf' });
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, blob: () => blob });
      const { fetchFileFromUrl } = await import('../../src/features/shared/utils.js');
      const file = await fetchFileFromUrl('http://test.com/file.pdf', 'file.pdf');
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('file.pdf');
    });
  });

  describe('toggleProcessingState', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="btn1">Save</button>
        <input id="input1" />
      `;
    });

    it('disables elements on processing start', async () => {
      const { toggleProcessingState } = await import('../../src/features/shared/utils.js');
      toggleProcessingState(['btn1', 'input1'], true);
      const btn = document.getElementById('btn1') as HTMLButtonElement;
      expect(btn.style.opacity).toBe('0.5');
      expect(btn.style.cursor).toBe('not-allowed');
    });

    it('enables elements on processing end', async () => {
      const { toggleProcessingState } = await import('../../src/features/shared/utils.js');
      const btn = document.getElementById('btn1') as HTMLButtonElement;
      toggleProcessingState(['btn1'], true);
      toggleProcessingState(['btn1'], false);
      expect(btn.style.opacity).toBe('1');
      expect(btn.style.cursor).toBe('pointer');
    });

    it('handles non-existent elements', async () => {
      const { toggleProcessingState } = await import('../../src/features/shared/utils.js');
      expect(() => toggleProcessingState(['non-existent'], true)).not.toThrow();
    });
  });

  describe('showErrorToast', () => {
    it('creates toast with error message in body', async () => {
      vi.useFakeTimers();
      const { showErrorToast } = await import('../../src/features/shared/utils.js');
      const body = document.body;
      const before = body.children.length;
      showErrorToast('Something went wrong');
      expect(body.children.length).toBe(before + 1);
      const last = body.lastElementChild;
      expect(last!.textContent).toBe('Error: Something went wrong');
      vi.useRealTimers();
    });
  });

  describe('numberToWords', () => {
    async function words(n: number | string) {
      const { numberToWords } = await import('../../src/features/shared/utils.js');
      return numberToWords(n);
    }

    it('handles 0 and single digits', async () => {
      expect(await words(0)).toBe('nol');
      expect(await words(1)).toBe('satu');
      expect(await words(9)).toBe('sembilan');
      expect(await words(11)).toBe('sebelas');
    });

    it('converts tens (12-99)', async () => {
      expect(await words(13)).toBe('tiga belas');
      expect(await words(20)).toBe('dua puluh');
      expect(await words(25)).toBe('dua puluh lima');
      expect(await words(99)).toBe('sembilan puluh sembilan');
    });

    it('converts hundreds (100-999)', async () => {
      expect(await words(100)).toBe('seratus');
      expect(await words(150)).toBe('seratus lima puluh');
      expect(await words(999)).toBe('sembilan ratus sembilan puluh sembilan');
      expect(await words(104)).toBe('seratus empat');
    });

    it('accepts numeric string and non-numeric safety', async () => {
      expect(await words('13')).toBe('tiga belas');
      expect(await words('abc')).toBe('abc');
    });
  });
});
