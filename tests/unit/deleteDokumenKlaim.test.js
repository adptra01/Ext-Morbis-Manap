/**
 * UNIT TEST: Delete Dokumen Klaim Feature
 * Testing core functions without browser dependencies
 */

// Mock environment for testing
global.document = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  createElement: jest.fn(),
  addEventListener: jest.fn()
};

global.URLSearchParams = jest.fn();
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Import functions to test (after mocking)
const {
  extractDokumenId,
  isValidDokumenId,
  buildDeletePayload,
  parseApiResponse
} = require('../../features/deleteDokumenKlaim');

// Mock fetch globally
global.fetch = jest.fn();

describe('Delete Dokumen Klaim - Unit Tests', () => {

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST 1: extractDokumenId Function
   */
  describe('extractDokumenId', () => {

    test('should extract ID from data-id attribute', () => {
      const el = { dataset: { id: '12345' } };
      expect(extractDokumenId(el)).toBe('12345');
    });

    test('should extract ID from data-id-dokumen attribute', () => {
      const el = { dataset: { idDokumen: '67890' } };
      expect(extractDokumenId(el)).toBe('67890');
    });

    test('should extract ID from href with id= param', () => {
      const el = { href: '/view?id=54321', dataset: {} };
      expect(extractDokumenId(el)).toBe('54321');
    });

    test('should extract ID from href with id_dokumen= param', () => {
      const el = { href: '/view?id_dokumen=99999', dataset: {} };
      expect(extractDokumenId(el)).toBe('99999');
    });

    test('should extract ID from onclick attribute with hapus()', () => {
      const el = {
        getAttribute: jest.fn((attr) => {
          if (attr === 'onclick') return 'hapus(11111)';
          return null;
        }),
        dataset: {},
        href: undefined
      };
      expect(extractDokumenId(el)).toBe('11111');
    });

    test('should extract ID from parent element data-id', () => {
      const parent = { dataset: { id: '22222' } };
      const el = {
        dataset: {},
        href: undefined,
        getAttribute: jest.fn(() => null),
        parentElement: parent
      };
      expect(extractDokumenId(el)).toBe('22222');
    });

    test('should return null when no ID found', () => {
      const el = {
        dataset: {},
        href: '/other-page',
        getAttribute: jest.fn(() => null),
        parentElement: null
      };
      expect(extractDokumenId(el)).toBeNull();
    });
  });

  /**
   * TEST 2: isValidDokumenId Function
   */
  describe('isValidDokumenId', () => {

    test('should return true for valid numeric ID', () => {
      expect(isValidDokumenId('12345')).toBe(true);
      expect(isValidDokumenId('1')).toBe(true);
      expect(isValidDokumenId('999999')).toBe(true);
    });

    test('should return false for non-numeric strings', () => {
      expect(isValidDokumenId('abc123')).toBe(false);
      expect(isValidDokumenId('hello')).toBe(false);
      expect(isValidDokumenId('123abc')).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isValidDokumenId('')).toBe(false);
    });

    test('should return false for null', () => {
      expect(isValidDokumenId(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isValidDokumenId(undefined)).toBe(false);
    });

    test('should return false for negative numbers', () => {
      expect(isValidDokumenId('-123')).toBe(false);
    });

    test('should return false for decimal numbers', () => {
      expect(isValidDokumenId('123.45')).toBe(false);
    });
  });

  /**
   * TEST 3: buildDeletePayload Function
   */
  describe('buildDeletePayload', () => {

    test('should build payload with ID only when no CSRF token', () => {
      const payload = buildDeletePayload('12345', null);
      expect(payload.get('id')).toBe('12345');
      expect(payload.has('csrf_token')).toBe(false);
    });

    test('should build payload with ID and CSRF token', () => {
      const payload = buildDeletePayload('12345', 'abc123def');
      expect(payload.get('id')).toBe('12345');
      expect(payload.get('csrf_token')).toBe('abc123def');
    });

    test('should handle empty CSRF token', () => {
      const payload = buildDeletePayload('67890', '');
      expect(payload.get('id')).toBe('67890');
      expect(payload.has('csrf_token')).toBe(true);
      expect(payload.get('csrf_token')).toBe('');
    });
  });

  /**
   * TEST 4: parseApiResponse Function
   */
  describe('parseApiResponse', () => {

    test('should parse valid success JSON response', async () => {
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await parseApiResponse(mockResponse);
      expect(result).toEqual({ status: 'success' });
    });

    test('should parse error response with message', async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('{"status":"error","message":"File not found"}')
      };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await parseApiResponse(mockResponse);
      expect(result).toEqual({ status: 'error', message: 'File not found' });
    });

    test('should throw error for non-JSON response', async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('<html>Error page</html>')
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(parseApiResponse(mockResponse)).rejects.toThrow('Respon server tidak valid');
    });

    test('should handle network timeout', async () => {
      global.fetch.mockRejectedValue(new Error('Network timeout'));

      await expect(parseApiResponse(null)).rejects.toThrow('Network timeout');
    });

    test('should handle 404 error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('{"status":"error"}')
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(parseApiResponse(mockResponse)).rejects.toThrow();
    });
  });

  /**
   * TEST 5: findSafeContainer Function
   */
  describe('findSafeContainer', () => {

    test('should return td element when available', () => {
      const td = { tagName: 'TD', closest: jest.fn(() => null) };
      const el = {
        closest: jest.fn((selector) => {
          if (selector === 'td') return td;
          return null;
        })
      };

      const container = findSafeContainer(el);
      expect(container).toBe(td);
    });

    test('should return btn-group when available', () => {
      const btnGroup = { classList: { contains: jest.fn(() => true) } };
      const el = {
        closest: jest.fn((selector) => {
          if (selector === 'td') return null;
          if (selector === '.btn-group') return btnGroup;
          return null;
        })
      };

      const container = findSafeContainer(el);
      expect(container).toBe(btnGroup);
    });

    test('should return parent element when no specific container found', () => {
      const parent = { tagName: 'DIV' };
      const el = {
        closest: jest.fn(() => null),
        parentElement: parent
      };

      const container = findSafeContainer(el);
      expect(container).toBe(parent);
    });

    test('should return null when no container found', () => {
      const el = {
        closest: jest.fn(() => null),
        parentElement: null
      };

      const container = findSafeContainer(el);
      expect(container).toBeNull();
    });
  });

  /**
   * TEST 6: Button Injection Logic
   */
  describe('injectDeleteButton', () => {

    test('should not inject if button already exists', () => {
      const container = {
        querySelector: jest.fn(() => ({ dataset: { id: '12345' } }))
      };
      const el = { parentElement: container };

      injectDeleteButton(el, '12345');

      // Should not call createElement
      expect(document.createElement).not.toHaveBeenCalled();
    });

    test('should not inject if native delete button exists', () => {
      const nativeBtn = {
        getAttribute: jest.fn(() => 'hapus(12345)'),
        classList: { contains: jest.fn(() => true) }
      };
      const container = {
        querySelector: jest.fn(() => nativeBtn)
      };
      const el = { parentElement: container };

      injectDeleteButton(el, '12345');

      // Should not call createElement
      expect(document.createElement).not.toHaveBeenCalled();
    });

    test('should inject button in td container', () => {
      const container = {
        tagName: 'TD',
        querySelector: jest.fn(() => null),
        appendChild: jest.fn()
      };
      const el = {
        parentNode: container,
        tagName: 'A'
      };

      const mockBtn = {
        className: '',
        innerHTML: '',
        setAttribute: jest.fn(),
        style: {}
      };
      document.createElement.mockReturnValue(mockBtn);

      injectDeleteButton(el, '12345');

      expect(document.createElement).toHaveBeenCalledWith('button');
      expect(mockBtn.className).toContain('ext-super-delete-btn');
      expect(mockBtn.setAttribute).toHaveBeenCalledWith('data-id', '12345');
      expect(container.appendChild).toHaveBeenCalledWith(mockBtn);
    });

    test('should inject button in btn-group container', () => {
      const container = {
        classList: { contains: jest.fn(() => true) },
        querySelector: jest.fn(() => null),
        appendChild: jest.fn()
      };
      const el = {
        parentNode: null,
        closest: jest.fn(() => container)
      };

      const mockBtn = {
        className: '',
        innerHTML: '',
        setAttribute: jest.fn(),
        style: {}
      };
      document.createElement.mockReturnValue(mockBtn);

      injectDeleteButton(el, '12345');

      expect(document.createElement).toHaveBeenCalledWith('button');
      expect(container.appendChild).toHaveBeenCalledWith(mockBtn);
    });

    test('should insert button after element when in other container', () => {
      const container = {
        tagName: 'DIV',
        querySelector: jest.fn(() => null)
      };
      const el = {
        parentNode: container,
        tagName: 'A'
      };
      container.insertBefore = jest.fn();

      const mockBtn = {
        className: '',
        innerHTML: '',
        setAttribute: jest.fn(),
        style: {}
      };
      document.createElement.mockReturnValue(mockBtn);

      injectDeleteButton(el, '12345');

      expect(container.insertBefore).toHaveBeenCalledWith(mockBtn, el.nextSibling);
    });
  });

  /**
   * TEST 7: Click Handler
   */
  describe('handleDeleteClick', () => {

    test('should do nothing if clicked element is not delete button', () => {
      const e = {
        target: { classList: { contains: jest.fn(() => false) } },
        target: { closest: jest.fn(() => null) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };

      handleDeleteClick(e);

      expect(e.preventDefault).not.toHaveBeenCalled();
      expect(confirm).not.toHaveBeenCalled();
    });

    test('should show confirmation dialog for delete button', () => {
      const mockBtn = {
        getAttribute: jest.fn(() => '12345'),
        innerHTML: '🗑️ Hapus',
        disabled: false,
        style: {}
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => false);

      handleDeleteClick(e);

      expect(confirm).toHaveBeenCalledWith('PERINGATAN: Apakah Anda yakin ingin menghapus dokumen ini secara permanen?');
    });

    test('should not proceed if user cancels confirmation', () => {
      const mockBtn = {
        getAttribute: jest.fn(() => '12345'),
        innerHTML: '🗑️ Hapus',
        disabled: false,
        style: {}
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => false);

      handleDeleteClick(e);

      expect(fetch).not.toHaveBeenCalled();
    });

    test('should show error if no document ID found', () => {
      const mockBtn = {
        getAttribute: jest.fn(() => null),
        innerHTML: '🗑️ Hapus'
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();

      handleDeleteClick(e);

      expect(alert).toHaveBeenCalledWith('❌ ID Dokumen tidak ditemukan!');
    });

    test('should send delete request on confirmation', async () => {
      const mockBtn = {
        getAttribute: jest.fn(() => '12345'),
        innerHTML: '🗑️ Hapus',
        disabled: false,
        style: {},
        setAttribute: jest.fn()
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();
      global.window = { location: { reload: jest.fn() } };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await handleDeleteClick(e);

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

    test('should reload page on successful deletion', async () => {
      const mockBtn = {
        getAttribute: jest.fn(() => '12345'),
        innerHTML: '🗑️ Hapus',
        disabled: false,
        style: {}
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();
      global.window = { location: { reload: jest.fn() } };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      await handleDeleteClick(e);

      expect(alert).toHaveBeenCalledWith('✅ Dokumen berhasil dihapus!');
      expect(window.location.reload).toHaveBeenCalled();
    });

    test('should show error message on failed deletion', async () => {
      const mockBtn = {
        getAttribute: jest.fn(() => '12345'),
        innerHTML: '🗑️ Hapus',
        disabled: false,
        style: { opacity: '1' },
        setAttribute: jest.fn()
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();

      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('{"status":"error","message":"File locked"}')
      });

      await handleDeleteClick(e);

      expect(alert).toHaveBeenCalledWith('❌ Gagal: File locked');
      expect(mockBtn.innerHTML).toBe('🗑️ Hapus');
      expect(mockBtn.disabled).toBe(false);
    });
  });

  /**
   * TEST 8: Polling Mechanism
   */
  describe('Polling Mechanism', () => {

    test('should set interval for polling', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      const pollInterval = 1500;

      runDeleteDokumenFeature();

      expect(setIntervalSpy).toHaveBeenCalledWith(
        expect.any(Function),
        pollInterval
      );

      setIntervalSpy.mockRestore();
    });

    test('should clear interval when stopping feature', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      // Start feature
      const intervalId = setInterval(() => {}, 1500);
      deleteDokumenPollingInterval = intervalId;

      // Stop feature
      stopDeleteDokumenFeature();

      expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);
      expect(deleteDokumenPollingInterval).toBeNull();

      clearIntervalSpy.mockRestore();
      setIntervalSpy.mockRestore();
    });

    test('should scan for new elements on poll', () => {
      const mockElements = [
        { href: '/file.pdf?id=12345', dataset: {} },
        { dataset: { idDokumen: '67890' }, href: undefined }
      ];
      document.querySelectorAll.mockReturnValue(mockElements);

      scanAndInjectButtons();

      expect(document.querySelectorAll).toHaveBeenCalled();
    });
  });

  /**
   * TEST 9: Edge Cases
   */
  describe('Edge Cases', () => {

    test('should handle rapid clicks on delete button', async () => {
      const mockBtn = {
        getAttribute: jest.fn(() => '12345'),
        innerHTML: '🗑️ Hapus',
        disabled: false,
        style: {}
      };
      const e = {
        target: { closest: jest.fn(() => mockBtn) },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();
      global.window = { location: { reload: jest.fn() } };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      // Simulate rapid clicks
      const promises = [
        handleDeleteClick(e),
        handleDeleteClick(e),
        handleDeleteClick(e)
      ];

      await Promise.all(promises);

      // First click disables the button, subsequent clicks should be ignored
      expect(confirm).toHaveBeenCalledTimes(1);
    });

    test('should handle large dataset without performance issue', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        href: `/file.pdf?id=${i}`,
        dataset: {}
      }));

      document.querySelectorAll.mockReturnValue(largeDataset);
      const startTime = performance.now();

      scanAndInjectButtons();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete in < 100ms
    });

    test('should handle null/undefined elements gracefully', () => {
      document.querySelectorAll.mockReturnValue([null, undefined, {}]);

      expect(() => {
        scanAndInjectButtons();
      }).not.toThrow();
    });
  });

  /**
   * TEST 10: Module Registration
   */
  describe('Module Registration', () => {

    test('should register module when featureModules is defined', () => {
      global.featureModules = {};

      // Load module
      require('../../features/deleteDokumenKlaim');

      expect(featureModules.deleteDokumenKlaim).toBeDefined();
      expect(featureModules.deleteDokumenKlaim.name).toBeDefined();
      expect(featureModules.deleteDokumenKlaim.description).toBeDefined();
      expect(featureModules.deleteDokumenKlaim.run).toBeDefined();
      expect(typeof featureModules.deleteDokumenKlaim.run).toBe('function');
    });

    test('should not register module when featureModules is undefined', () => {
      global.featureModules = undefined;

      const consoleWarnSpy = jest.spyOn(console, 'warn');

      // Load module
      require('../../features/deleteDokumenKlaim');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('featureModules not defined')
      );

      consoleWarnSpy.mockRestore();
    });
  });
});

// Export for testing
module.exports = {
  extractDokumenId,
  isValidDokumenId,
  buildDeletePayload,
  parseApiResponse
};
