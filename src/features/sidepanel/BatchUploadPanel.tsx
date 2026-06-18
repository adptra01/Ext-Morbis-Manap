import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/components/button';
import { Input } from '../../ui/components/input';
import { Badge } from '../../ui/components/Badge';
import { Eye, Upload, Search, RefreshCw, X, AlertCircle } from 'lucide-react';

interface BatchItem {
  filename: string;
  norm: string;
  tanggal: string;
  jenis_dokumen: string;
  keterangan: string;
  url: string;
  status: string;
  tglFileTabel?: string;
  tglUploadTabel?: string;
  selected?: boolean;
  error?: string;
}

interface BatchUploadPanelProps {
  tabId: number;
  initialData?: Record<string, unknown>;
}

export function BatchUploadPanel({ tabId }: BatchUploadPanelProps) {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFinishedReload, setShowFinishedReload] = useState(false);

  // Send command to content script via background
  const sendTabAction = useCallback(async (action: string, payload: unknown) => {
    try {
      await chrome.runtime.sendMessage({
        type: 'TAB_ACTION',
        tabId,
        action,
        payload,
      });
    } catch (err) {
      console.error('Error sending tab action:', err);
    }
  }, [tabId]);

  // Handle messages from content script (progress updates)
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'TAB_ACTION_RESULT') {
        const { action, data } = message;
        if (action === 'BATCH_UPLOAD_PROGRESS') {
          const { percent, status, items: updatedItems, finished } = data;
          setProgress(percent);
          setStatusText(status);
          if (updatedItems) {
            setItems(updatedItems);
          }
          if (finished) {
            setIsProcessing(false);
            setShowFinishedReload(true);
          }
        } else if (action === 'BATCH_UPLOAD_ANALYZE_RESULT') {
          setItems(data.items);
          setStatusText(`${data.items.length} URL siap diproses`);
          setIsProcessing(false);
        } else if (action === 'BATCH_UPLOAD_CRAWL_RESULT') {
          setItems(data.items);
          setStatusText(`${data.items.length} dokumen berhasil ditemukan!`);
          setIsProcessing(false);
        } else if (action === 'BATCH_UPLOAD_ERROR') {
          setStatusText(`Error: ${data.error}`);
          setIsProcessing(false);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      alert('Silakan paste URL terlebih dahulu');
      return;
    }
    setIsProcessing(true);
    setStatusText('Menganalisis URL...');
    sendTabAction('BATCH_UPLOAD_ANALYZE', { inputText });
  };

  const handleCrawl = () => {
    setIsProcessing(true);
    setStatusText('Mencari dokumen di rekam medis...');
    sendTabAction('BATCH_UPLOAD_CRAWL', null);
  };

  const handleToggleItem = (index: number) => {
    const updated = [...items];
    updated[index].selected = !updated[index].selected;
    setItems(updated);
    sendTabAction('BATCH_UPLOAD_UPDATE_ITEMS', { items: updated });
  };

  const handleKeteranganChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index].keterangan = val;
    setItems(updated);
    sendTabAction('BATCH_UPLOAD_UPDATE_ITEMS', { items: updated });
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    sendTabAction('BATCH_UPLOAD_UPDATE_ITEMS', { items: updated });
  };

  const handlePreview = (item: BatchItem) => {
    sendTabAction('BATCH_UPLOAD_PREVIEW', { url: item.url, filename: item.filename });
  };

  const handleStartUpload = () => {
    const selectedCount = items.filter(i => i.selected !== false).length;
    if (selectedCount === 0) {
      alert('Tidak ada dokumen yang dipilih untuk diupload.');
      return;
    }
    if (confirm(`Upload ${selectedCount} dokumen? Proses ini tidak dapat dibatalkan.`)) {
      setIsProcessing(true);
      setProgress(0);
      setStatusText('Memulai upload...');
      sendTabAction('BATCH_UPLOAD_START', null);
    }
  };

  const handleTestSingle = () => {
    if (items.length === 0) {
      alert('Tidak ada URL untuk ditest');
      return;
    }
    setIsProcessing(true);
    setStatusText('Testing single upload...');
    sendTabAction('BATCH_UPLOAD_TEST_SINGLE', null);
  };

  const handleReload = () => {
    chrome.tabs.reload(tabId);
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.filename.toLowerCase().includes(query) ||
      item.keterangan.toLowerCase().includes(query) ||
      item.norm.toLowerCase().includes(query)
    );
  });

  const selectedCount = items.filter(i => i.selected !== false).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-border pb-2">
        <button
          onClick={() => { if (!isProcessing) setMode('manual'); }}
          className={`flex-1 pb-1.5 text-md-xs font-semibold border-b-2 text-center transition-all ${
            mode === 'manual'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          disabled={isProcessing}
        >
          Mode Manual (Paste URL)
        </button>
        <button
          onClick={() => { if (!isProcessing) setMode('auto'); }}
          className={`flex-1 pb-1.5 text-md-xs font-semibold border-b-2 text-center transition-all ${
            mode === 'auto'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          disabled={isProcessing}
        >
          Auto-Crawl Rekam Medis
        </button>
      </div>

      {mode === 'manual' ? (
        <div className="space-y-2">
          <label className="text-md-xs font-medium text-muted-foreground">
            Paste URL Dokumen (satu per baris):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder="https://example.com/dokumen1.pdf&#10;https://example.com/dokumen2.jpg"
            className="w-full h-24 p-2 text-md-xs border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <Button
            size="sm"
            onClick={handleAnalyze}
            disabled={isProcessing || !inputText.trim()}
            className="w-full"
          >
            <Search className="size-3.5 mr-1" /> Analisis URL
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-md-xs text-muted-foreground">
            Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCrawl}
            disabled={isProcessing}
            className="w-full border-primary/20 hover:bg-primary/5 text-primary"
          >
            <Search className="size-3.5 mr-1" /> Cari Dokumen Pasien Otomatis
          </Button>
        </div>
      )}

      {/* Progress & Status */}
      {statusText && (
        <div className="p-2.5 bg-accent/40 rounded-md border border-border space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground truncate max-w-[200px]">
              {statusText}
            </span>
            {isProcessing && progress > 0 && (
              <span className="text-[10px] font-semibold text-primary">{Math.round(progress)}%</span>
            )}
          </div>
          {isProcessing && progress > 0 && (
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Preview list */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-md-xs font-semibold">
              Preview ({selectedCount} / {items.length} dipilih)
            </span>
            {mode === 'auto' && (
              <Input
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-6 max-w-[120px] text-[11px]"
              />
            )}
          </div>

          <div className="max-h-60 overflow-y-auto border border-border rounded-md divide-y divide-border bg-card">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 text-md-xs flex items-start gap-2 transition-colors ${
                  item.selected !== false ? 'bg-accent/20' : 'opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.selected !== false}
                  onChange={() => handleToggleItem(idx)}
                  disabled={isProcessing}
                  className="mt-0.5 rounded border-input text-primary focus:ring-primary size-3.5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-medium text-foreground truncate block" title={item.filename}>
                      {idx + 1}. {item.filename}
                    </span>
                    {item.status !== 'pending' && (
                      <Badge
                        variant={item.status === 'success' ? 'success' : 'danger'}
                        className="shrink-0 scale-90"
                      >
                        {item.status === 'success' ? 'Sukses' : 'Gagal'}
                      </Badge>
                    )}
                  </div>

                  {item.tglFileTabel ? (
                    <div className="text-[10px] text-muted-foreground flex gap-1.5">
                      <span>Dibuat: {item.tglFileTabel}</span>
                      <span>|</span>
                      <span>Unggah: {item.tglUploadTabel}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground flex gap-1.5">
                      <span>NORM: {item.norm || '-'}</span>
                      <span>|</span>
                      <span>Tgl Klaim: {item.tanggal}</span>
                    </div>
                  )}

                  <Input
                    value={item.keterangan}
                    onChange={(e) => handleKeteranganChange(idx, e.target.value)}
                    placeholder="Keterangan..."
                    disabled={isProcessing}
                    className="h-6 text-[10px] py-0 px-1.5"
                  />

                  {item.error && (
                    <p className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" /> {item.error}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handlePreview(item)}
                    className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-all"
                    title="Preview File"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    disabled={isProcessing}
                    className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all disabled:opacity-50"
                    title="Buang dari Antrian"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-md-xs">
                Tidak ada dokumen yang cocok.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-2">
        {showFinishedReload ? (
          <Button
            onClick={handleReload}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="size-3.5 mr-1" /> Reload Halaman
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSingle}
              disabled={isProcessing || items.length === 0}
              className="flex-1 text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 dark:text-amber-300 dark:border-amber-800 dark:bg-amber-950/20"
            >
              Test 1 URL
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleStartUpload}
              disabled={isProcessing || items.length === 0 || selectedCount === 0}
              className="flex-1"
            >
              <Upload className="size-3.5 mr-1" /> Mulai Upload
            </Button>
          </>
        )}
      </div>
    </div>
  );
}