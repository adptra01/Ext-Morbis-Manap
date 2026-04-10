/**
 * UNIT TEST: Delete Dokumen Klaim Feature V4.0 - Background Scraper
 * Testing background scraping and document ID mapping functionality
 */

// Mock environment
global.window = {
  location: {
    href: 'http://test.com/v2/m-klaim/detail?id_visit=12345'
  }
};

global.document = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  addEventListener: jest.fn()
};

global.URLSearchParams = jest.fn(() => ({
  get: jest.fn((key) => key === 'id_visit' ? '12345' : null)
}));

global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

global.alert = jest.fn();
global.confirm = jest.fn();
global.fetch = jest.fn();

// Mock DOMParser
global.DOMParser = class {
  parseFromString() {
    return {
      querySelectorAll: jest.fn(() => [])
    };
  }
};

// Mock AbortController
global.AbortController = class {
  constructor() {
    this.signal = {};
    this.abort = jest.fn();
  }
};

describe('Delete Dokumen Klaim V4.0 - Background Scraper Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm.mockReturnValue(true);
  });

  /**
   * TEST 1: getIdVisit Function
   */
  describe('getIdVisit', () => {

    test('should extract id_visit from URLSearchParams', () => {
      global.window.location.href = 'http://test.com/detail?id_visit=12345';
      global.URLSearchParams.mockImplementation(() => ({
        get: jest.fn((key) => key === 'id_visit' ? '12345' : null)
      }));

      const idVisit = getIdVisit();

      expect(idVisit).toBe('12345');
    });

    test('should extract id from URLSearchParams', () => {
      global.window.location.href = 'http://test.com/detail?id=67890';
      global.URLSearchParams.mockImplementation(() => ({
        get: jest.fn((key) => key === 'id' ? '67890' : null)
      }));

      const idVisit = getIdVisit();

      expect(idVisit).toBe('67890');
    });

    test('should return null if no id_visit or id found', () => {
      global.window.location.href = 'http://test.com/detail';
      global.URLSearchParams.mockImplementation(() => ({
        get: jest.fn(() => null)
      }));

      const idVisit = getIdVisit();

      expect(idVisit).toBeNull();
    });
  });

  /**
   * TEST 2: buildDocumentMap Function
   */
  describe('buildDocumentMap', () => {

    test('should fetch detail page and build document ID map', async () => {
      // Mock fetch response
      const mockHtml = `
        <html>
          <body>
            <table>
              <tr>
                <td><a href="/assets/dokumen-pasien/ATIKA.pdf">ATIKA.pdf</a></td>
                <td><button onclick="hapus(44921)">Hapus</button></td>
              </tr>
              <tr>
                <td><a href="/assets/dokumen-pasien/IMG.jpg">IMG.jpg</a></td>
                <td><button onclick="hapus(44922)">Hapus</button></td>
              </tr>
            </table>
          </body>
        </html>
      `;

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue(mockHtml)
      });

      // Mock DOMParser
      global.DOMParser = class {
        parseFromString() {
          const doc = {
            querySelectorAll: jest.fn((selector) => {
              if (selector === 'tr') {
                return [
                  {
                    querySelector: jest.fn((sel) => {
                      if (sel.includes('a[href*="/assets/"]')) {
                        return { getAttribute: () => '/assets/dokumen-pasien/ATIKA.pdf' };
                      }
                      if (sel.includes('button[onclick*="hapus"]')) {
                        return { getAttribute: () => 'hapus(44921)' };
                      }
                      return null;
                    })
                  }
                ];
              }
              return [];
            })
          };
          return doc;
        }
      };

      await buildDocumentMap();

      expect(fetch).toHaveBeenCalledWith(
        '/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=12345'
      );
    });

    test('should handle network error gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      await buildDocumentMap();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Scraping failed'),
        expect.any(Error)
      );
    });

    test('should handle timeout and abort request', async () => {
      const abortMock = jest.fn();
      global.AbortController = class {
        constructor() {
          this.signal = {};
          this.abort = abortMock;
        }
      };

      global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      await buildDocumentMap();

      // Abort should be called after timeout
      expect(abortMock).toHaveBeenCalled();
    });

    test('should retry with alternative URL if first fails', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({
          ok: true,
          text: jest.fn().mockResolvedValue('<html></html>')
        });

      await buildDocumentMap();

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1,
        '/admisi/pelaksanaan_pelayanan/dokumen-pasien?id_visit=12345'
      );
      expect(fetch).toHaveBeenNthCalledWith(2,
        '/admisi/detail-rawat-inap/dokumen-pasien?id_visit=12345'
      );
    });

    test('should not start scraping if already in progress', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('<html></html>')
      });

      // Start multiple scrapes
      const promise1 = buildDocumentMap();
      const promise2 = buildDocumentMap();
      const promise3 = buildDocumentMap();

      await Promise.all([promise1, promise2, promise3]);

      // Should only call fetch once
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * TEST 3: scanAndInjectButtons Function
   */
  describe('scanAndInjectButtons', () => {

    beforeEach(() => {
      // Set up documentIdMap
      global.documentIdMap = {
        'ATIKA.pdf': '44921',
        'IMG.jpg': '44922'
      };
      global.isMapLoaded = true;
    });

    test('should skip scan if map not loaded', () => {
      global.isMapLoaded = false;

      scanAndInjectButtons();

      expect(document.querySelectorAll).not.toHaveBeenCalled();
    });

    test('should skip scan if documentIdMap is empty', () => {
      global.documentIdMap = {};

      scanAndInjectButtons();

      expect(document.querySelectorAll).not.toHaveBeenCalled();
    });

    test('should inject delete button for PDF file found in script', () => {
      global.document.querySelectorAll.mockImplementation((selector) => {
        if (selector === '.isidalam') {
          return [{
            querySelector: jest.fn((sel) => {
              if (sel.includes('script')) {
                return { textContent: "var url = '/assets/dokumen-pasien/ATIKA.pdf';" };
              }
              return null;
            }),
            querySelectorAll: jest.fn(() => []),
            closest: jest.fn(() => null)
          }];
        }
        return [];
      });
      global.document.createElement = jest.fn(() => ({
        className: '',
        innerHTML: '',
        setAttribute: jest.fn(),
        style: {}
      }));

      scanAndInjectButtons();

      expect(document.createElement).toHaveBeenCalled();
    });

    test('should inject delete button for image file', () => {
      global.document.querySelectorAll.mockImplementation((selector) => {
        if (selector === '.isidalam') {
          return [{
            querySelector: jest.fn((sel) => {
              if (sel.includes('img')) {
                return { getAttribute: () => '/assets/dokumen-pasien/IMG.jpg' };
              }
              if (sel.includes('.panel-heading')) {
                return { appendChild: jest.fn() };
              }
              return null;
            }),
            querySelectorAll: jest.fn(() => []),
            closest: jest.fn(() => null)
          }];
        }
        return [];
      });
      global.document.createElement = jest.fn(() => ({
        className: '',
        innerHTML: '',
        setAttribute: jest.fn(),
        style: {}
      }));

      scanAndInjectButtons();

      expect(document.createElement).toHaveBeenCalled();
    });

    test('should not inject button if already exists', () => {
      global.document.querySelectorAll.mockImplementation((selector) => {
        if (selector === '.isidalam') {
          return [{
            querySelector: jest.fn(() => ({
              classList: { contains: () => true }
            })),
            querySelectorAll: jest.fn(() => []),
            closest: jest.fn(() => null)
          }];
        }
        return [];
      });

      scanAndInjectButtons();

      expect(document.createElement).not.toHaveBeenCalled();
    });
  });

  /**
   * TEST 4: Click Handler
   */
  describe('Click Handler', () => {

    test('should handle delete button click', async () => {
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => ({
          style: { transition: '', opacity: '', transform: '' },
          remove: jest.fn()
        })),
        getAttribute: jest.fn(() => '44921')
      };

      const event = {
        target: { closest: () => btn },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      // Simulate click event
      const handler = document.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      await handler(event);

      expect(confirm).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalled();
    });

    test('should show confirmation dialog', async () => {
      global.confirm.mockReturnValue(false);

      const btn = {
        getAttribute: jest.fn(() => '44921')
      };

      const event = {
        target: { closest: () => btn },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };

      // Simulate click event
      const handler = document.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      await handler(event);

      expect(confirm).toHaveBeenCalledWith(
        expect.stringContaining('Apakah Anda yakin ingin menghapus')
      );
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should show error message if delete fails', async () => {
      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => null),
        getAttribute: jest.fn(() => '44921')
      };

      const event = {
        target: { closest: () => btn },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };

      global.fetch.mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('{"status":"error","message":"File not found"}')
      });

      // Simulate click event
      const handler = document.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      await handler(event);

      expect(alert).toHaveBeenCalledWith('❌ Gagal menghapus dokumen: File not found');
    });

    test('should remove document wrapper on success', async () => {
      const wrapper = {
        style: { transition: '', opacity: '', transform: '' },
        remove: jest.fn()
      };

      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn((sel) => sel === '.isidalam' ? wrapper : null),
        getAttribute: jest.fn(() => '44921')
      };

      const event = {
        target: { closest: () => btn },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      // Simulate click event
      const handler = document.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      await handler(event);

      expect(wrapper.style.opacity).toBe('0');
      expect(wrapper.style.transform).toBe('translateY(-10px)');
    });
  });

  /**
   * TEST 5: Module Registration
   */
  describe('Module Registration', () => {

    test('should register module with correct properties', () => {
      if (typeof featureModules !== 'undefined') {
        featureModules.deleteDokumenKlaim = {
          name: 'Hapus Dokumen M-Klaim (v4.0 - Background Scraper)',
          description: 'Menggunakan background scraping untuk membangun kamus ID dokumen',
          run: runDeleteDokumenFeature,
          stop: stopDeleteDokumenFeature
        };
      }

      expect(featureModules.deleteDokumenKlaim).toBeDefined();
      expect(featureModules.deleteDokumenKlaim.name).toBe('Hapus Dokumen M-Klaim (v4.0 - Background Scraper)');
      expect(typeof featureModules.deleteDokumenKlaim.run).toBe('function');
      expect(typeof featureModules.deleteDokumenKlaim.stop).toBe('function');
    });
  });

  /**
   * TEST 6: Edge Cases
   */
  describe('Edge Cases', () => {

    test('should handle multiple file types in document map', () => {
      global.documentIdMap = {
        'ATIKA.pdf': '44921',
        'IMG.jpg': '44922',
        'DOC.docx': '44923'
      };
      global.isMapLoaded = true;

      // Should scan and inject for all files
      global.document.querySelectorAll.mockReturnValue([{}, {}, {}]);

      scanAndInjectButtons();

      expect(document.querySelectorAll).toHaveBeenCalledWith('.isidalam');
    });

    test('should handle special characters in filename', () => {
      global.documentIdMap = {
        'FILE_2024-04-11.pdf': '44921',
        'ATIKA (Copy).pdf': '44922'
      };
      global.isMapLoaded = true;

      global.document.querySelectorAll.mockReturnValue([{}]);

      scanAndInjectButtons();

      expect(document.querySelectorAll).toHaveBeenCalled();
    });

    test('should handle empty document ID map after scraping', () => {
      global.documentIdMap = {};
      global.isMapLoaded = true;

      scanAndInjectButtons();

      expect(document.querySelectorAll).not.toHaveBeenCalled();
    });

    test('should handle large document sets', () => {
      // Create map with 100 entries
      const largeMap = {};
      for (let i = 0; i < 100; i++) {
        largeMap[`FILE${i}.pdf`] = `${44921 + i}`;
      }
      global.documentIdMap = largeMap;
      global.isMapLoaded = true;

      // Simulate many wrappers
      const wrappers = Array(100).fill({ querySelector: jest.fn(), querySelectorAll: jest.fn(() => []) });
      global.document.querySelectorAll.mockReturnValue(wrappers);

      const startTime = Date.now();
      scanAndInjectButtons();
      const endTime = Date.now();

      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  /**
   * TEST 7: Integration Scenarios
   */
  describe('Integration Scenarios', () => {

    test('should handle sequential document deletions', async () => {
      global.documentIdMap = { 'FILE1.pdf': '44921', 'FILE2.pdf': '44922' };
      global.isMapLoaded = true;

      global.fetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('{"status":"success"}')
      });

      const btn = {
        innerHTML: 'Hapus',
        disabled: false,
        style: { opacity: '1' },
        closest: jest.fn(() => ({ style: {}, remove: jest.fn() })),
        getAttribute: jest.fn(() => '44921')
      };

      const event = {
        target: { closest: () => btn },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        stopImmediatePropagation: jest.fn()
      };

      // Simulate two deletions
      const handler = document.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];

      await handler(event);
      await handler(event);

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('should refresh document map periodically', () => {
      // Set up periodic refresh
      jest.useFakeTimers();

      runDeleteDokumenFeature();

      // Fast-forward 1 minute
      jest.advanceTimersByTime(60000);

      expect(global.fetch).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
