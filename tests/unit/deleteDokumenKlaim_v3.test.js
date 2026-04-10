/**
 * UNIT TEST: Delete Dokumen Klaim Feature V3.0
 * Testing "Define Once, Works Everywhere" approach
 */

// Mock environment
global.document = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  readyState: 'complete',
  addEventListener: jest.fn()
};

global.window = {
  event: null,
  location: { reload: jest.fn() }
};

global.URLSearchParams = jest.fn();
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

global.confirm = jest.fn();
global.alert = jest.fn();

// Mock fetch globally
global.fetch = jest.fn();

describe('Delete Dokumen Klaim V3.0 - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.hapus
    delete window.hapus;
    global.confirm = jest.fn();
    global.alert = jest.fn();
  });

  /**
   * TEST 1: defineHapusFunction - Define Once
   */
  describe('defineHapusFunction', () => {

    test('should define window.hapus when not exists', () => {
      expect(window.hapus).toBeUndefined();

      defineHapusFunction();

      expect(window.hapus).toBeDefined();
      expect(typeof window.hapus).toBe('function');
    });

    test('should not redefine if window.hapus already exists', () => {
      window.hapus = jest.fn();

      const result = defineHapusFunction();

      expect(result).toBe(false);
      expect(window.hapus).toBe(jest.fn()); // Should keep original
    });

    test('should return true when newly defined', () => {
      const result = defineHapusFunction();

      expect(result).toBe(true);
    });
  });

  /**
   * TEST 2: window.hapus Function - Basic Functionality
   */
  describe('window.hapus - Basic Functionality', () => {

    beforeEach(() => {
      defineHapusFunction();
    });

    test('should alert error if idDokumen is null', async () => {
      await window.hapus(null);

      expect(alert).toHaveBeenCalledWith('❌ ID Dokumen tidak valid!');
      expect(confirm).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should alert error if idDokumen is undefined', async () => {
      await window.hapus(undefined);

      expect(alert).toHaveBeenCalledWith('❌ ID Dokumen tidak valid!');
      expect(confirm).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should alert error if idDokumen is empty string', async () => {
      await window.hapus('');

      expect(alert).toHaveBeenCalledWith('❌ ID Dokumen tidak valid!');
      expect(confirm).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should show confirmation dialog for valid ID', async () => {
      global.confirm.mockReturnValue(false);

      await window.hapus('12345');

      expect(confirm).toHaveBeenCalledWith(
        expect.stringContaining('Apakah Anda yakin ingin menghapus dokumen (ID: 12345)')
      );
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should proceed when user confirms deletion', async () => {
      global.confirm.mockReturnValue(true);
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(confirm).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalled();
    });

    test('should cancel when user rejects deletion', async () => {
      global.confirm.mockReturnValue(false);

      await window.hapus('12345');

      expect(confirm).toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  /**
   * TEST 3: window.hapus - API Integration
   */
  describe('window.hapus - API Integration', () => {

    beforeEach(() => {
      defineHapusFunction();
      global.confirm.mockReturnValue(true);
    });

    test('should send POST request to correct endpoint', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(fetch).toHaveBeenCalledWith(
        '/admisi/pelaksanaan_pelayanan/dokumen-pasien/control?sub=hapus',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
          })
        })
      );
    });

    test('should include id in request body', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('67890');

      const fetchCall = fetch.mock.calls[0];
      const body = fetchCall[1].body;

      expect(body).toContain('id=67890');
    });

    test('should include CSRF token if available', async () => {
      global.document.querySelector.mockReturnValue({ value: 'abc123token' });
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      const fetchCall = fetch.mock.calls[0];
      const body = fetchCall[1].body;

      expect(body).toContain('csrf_token=abc123token');
    });

    test('should work without CSRF token', async () => {
      global.document.querySelector.mockReturnValue(null);
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      const fetchCall = fetch.mock.calls[0];
      const body = fetchCall[1].body;

      expect(body).not.toContain('csrf_token');
    });

    test('should parse JSON response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success","message":"Deleted"}')
      });

      await window.hapus('12345');

      expect(alert).toHaveBeenCalledWith('✅ Dokumen berhasil dihapus!');
    });

    test('should handle error response from server', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('{"status":"error","message":"File not found"}')
      });

      await window.hapus('12345');

      expect(alert).toHaveBeenCalledWith('❌ Gagal menghapus: File not found');
    });

    test('should handle default error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('{"status":"error"}')
      });

      await window.hapus('12345');

      expect(alert).toHaveBeenCalledWith('❌ Gagal menghapus: Ditolak oleh server');
    });

    test('should handle non-JSON response', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('<html>Error</html>')
      });

      await window.hapus('12345');

      expect(alert).toHaveBeenCalledWith('⚠️ Terjadi kesalahan: Respon server tidak valid');
    });

    test('should handle network error', async () => {
      global.fetch.mockRejectedValue(new Error('Network timeout'));

      await window.hapus('12345');

      expect(alert).toHaveBeenCalledWith('⚠️ Terjadi kesalahan: Network timeout');
    });
  });

  /**
   * TEST 4: window.hapus - UI Updates
   */
  describe('window.hapus - UI Updates', () => {

    beforeEach(() => {
      defineHapusFunction();
      global.confirm.mockReturnValue(true);
    });

    test('should update button to loading state', async () => {
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => null)
      };
      global.window.event = { target: btn };
      global.document.querySelector.mockReturnValue(btn);

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(btn.innerHTML).toBe('⏳ Menghapus...');
      expect(btn.disabled).toBe(true);
      expect(btn.style.opacity).toBe('0.5');
    });

    test('should restore button on error', async () => {
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => null)
      };
      global.window.event = { target: btn };
      global.document.querySelector.mockReturnValue(btn);

      global.fetch.mockRejectedValue(new Error('Error'));

      await window.hapus('12345');

      expect(btn.innerHTML).toBe('Hapus');
      expect(btn.disabled).toBe(false);
      expect(btn.style.opacity).toBe('1');
    });

    test('should remove row from DOM on success', async () => {
      const row = {
        style: { transition: '', opacity: '' },
        remove: jest.fn()
      };
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn((selector) => selector === 'tr' ? row : null)
      };
      global.window.event = { target: btn };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(row.style.opacity).toBe('0');
      expect(row.style.transition).toBe('opacity 0.3s ease');
      expect(row.remove).toHaveBeenCalled();
    });

    test('should reload page if row not found', async () => {
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => null)
      };
      global.window.event = { target: btn };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(window.location.reload).toHaveBeenCalled();
    });

    test('should reload page if button not found', async () => {
      global.window.event = null;

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  /**
   * TEST 5: stopDeleteDokumenFeature
   */
  describe('stopDeleteDokumenFeature', () => {

    test('should remove window.hapus function', () => {
      defineHapusFunction();
      expect(window.hapus).toBeDefined();

      stopDeleteDokumenFeature();

      expect(window.hapus).toBeUndefined();
    });

    test('should do nothing if window.hapus not defined', () => {
      expect(window.hapus).toBeUndefined();

      expect(() => {
        stopDeleteDokumenFeature();
      }).not.toThrow();
    });
  });

  /**
   * TEST 6: runDeleteDokumenFeature
   */
  describe('runDeleteDokumenFeature', () => {

    test('should define window.hapus when DOM is ready', () => {
      document.readyState = 'complete';

      runDeleteDokumenFeature();

      expect(window.hapus).toBeDefined();
    });

    test('should add DOMContentLoaded listener if DOM is loading', () => {
      document.readyState = 'loading';

      runDeleteDokumenFeature();

      expect(document.addEventListener).toHaveBeenCalledWith(
        'DOMContentLoaded',
        expect.any(Function)
      );
    });
  });

  /**
   * TEST 7: Module Registration
   */
  describe('Module Registration', () => {

    test('should register module when featureModules is defined', () => {
      global.featureModules = {};

      // Simulate module registration
      if (typeof featureModules !== 'undefined') {
        featureModules.deleteDokumenKlaim = {
          name: 'Hapus Dokumen M-Klaim (v3.0 - Define Once)',
          description: 'Mendefinisikan window.hapus() agar tombol hapus native server bekerja',
          run: runDeleteDokumenFeature,
          stop: stopDeleteDokumenFeature
        };
      }

      expect(featureModules.deleteDokumenKlaim).toBeDefined();
      expect(featureModules.deleteDokumenKlaim.name).toBe('Hapus Dokumen M-Klaim (v3.0 - Define Once)');
      expect(typeof featureModules.deleteDokumenKlaim.run).toBe('function');
      expect(typeof featureModules.deleteDokumenKlaim.stop).toBe('function');
    });
  });

  /**
   * TEST 8: Integration Scenarios
   */
  describe('Integration Scenarios', () => {

    beforeEach(() => {
      defineHapusFunction();
      global.confirm.mockReturnValue(true);
    });

    test('should handle multiple sequential deletions', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => ({ remove: jest.fn(), style: { opacity: '', transition: '' } }))
      };
      global.window.event = { target: btn };

      // Delete first file
      await window.hapus('12345');

      // Delete second file
      await window.hapus('67890');

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('should work without window.event (called directly)', async () => {
      global.window.event = null;
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle button selection via querySelector', async () => {
      global.window.event = null;
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => ({ remove: jest.fn(), style: { opacity: '', transition: '' } }))
      };
      global.document.querySelector.mockReturnValue(btn);

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(document.querySelector).toHaveBeenCalledWith(`button[onclick*="hapus(12345)"]`);
    });
  });

  /**
   * TEST 9: Edge Cases
   */
  describe('Edge Cases', () => {

    beforeEach(() => {
      defineHapusFunction();
      global.confirm.mockReturnValue(true);
    });

    test('should handle string numeric ID', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('12345');

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle number ID', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus(12345);

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle large ID numbers', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await window.hapus('9999999999');

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle empty server response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('')
      });

      await window.hapus('12345');

      expect(alert).toHaveBeenCalledWith('⚠️ Terjadi kesalahan: Respon server tidak valid');
    });
  });

  /**
   * TEST 10: Memory & Performance
   */
  describe('Memory & Performance', () => {

    test('should not create memory leaks - no polling', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      runDeleteDokumenFeature();

      // Should NOT call setInterval
      expect(setIntervalSpy).not.toHaveBeenCalled();

      setIntervalSpy.mockRestore();
    });

    test('should clean up properly when stopped', () => {
      defineHapusFunction();
      expect(window.hapus).toBeDefined();

      stopDeleteDokumenFeature();
      expect(window.hapus).toBeUndefined();
    });

    test('should be idempotent - multiple starts OK', () => {
      runDeleteDokumenFeature();
      runDeleteDokumenFeature();
      runDeleteDokumenFeature();

      // Should not crash
      expect(window.hapus).toBeDefined();
    });
  });
});
