import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/components/button';
import { Input } from '../../ui/components/input';
import { Badge } from '../../ui/components/Badge';
import { Trash2, Eye, Search, RefreshCw, AlertTriangle } from 'lucide-react';

interface DeleteItem {
  id_dokumen: string;
  filename: string;
  keterangan: string;
  tglFile: string;
  tglUpload: string;
  url: string;
  selected: boolean;
  status: string;
}

interface BatchDeletePanelProps {
  tabId: number;
}

export function BatchDeletePanel({ tabId }: BatchDeletePanelProps) {
  const [items, setItems] = useState<DeleteItem[]>([]);
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
        if (action === 'BATCH_DELETE_PROGRESS') {
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
        } else if (action === 'BATCH_DELETE_CRAWL_RESULT') {
          setItems(data.items);
          setStatusText(`${data.items.length} dokumen ditemukan.`);
          setIsProcessing(false);
        } else if (action === 'BATCH_DELETE_SINGLE_RESULT') {
          const { index, success, error } = data;
          const updated = [...items];
          if (success) {
            updated.splice(index, 1);
            setStatusText('Dokumen berhasil dihapus.');
          } else {
            updated[index].status = 'error';
            setStatusText(`Gagal menghapus: ${error}`);
          }
          setItems(updated);
          setIsProcessing(false);
        } else if (action === 'BATCH_DELETE_ERROR') {
          setStatusText(`Error: ${data.error}`);
          setIsProcessing(false);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [items]);

  const handleCrawl = () => {
    setIsProcessing(true);
    setStatusText('Mencari dokumen pasien...');
    sendTabAction('BATCH_DELETE_CRAWL', null);
  };

  const handleToggleItem = (index: number) => {
    const updated = [...items];
    updated[index].selected = !updated[index].selected;
    setItems(updated);
    sendTabAction('BATCH_DELETE_UPDATE_ITEMS', { items: updated });
  };

  const handlePreview = (item: DeleteItem) => {
    sendTabAction('BATCH_DELETE_PREVIEW', { url: item.url, filename: item.filename });
  };

  const handleSingleDelete = (index: number) => {
    const item = items[index];
    if (!item) return;
    if (confirm(`Hapus dokumen ini?\n\n${item.filename}\nID: ${item.id_dokumen}\n\nTindakan ini tidak bisa di-undo.`)) {
      setIsProcessing(true);
      setStatusText(`Menghapus: ${item.filename}...`);
      sendTabAction('BATCH_DELETE_SINGLE', { index, id_dokumen: item.id_dokumen });
    }
  };

  const handleStartDelete = () => {
    const selectedCount = items.filter(i => i.selected).length;
    if (selectedCount === 0) {
      alert('Pilih dokumen untuk dihapus');
      return;
    }
    if (confirm(`Hapus ${selectedCount} dokumen? TINDAKAN INI BERSIFAT PERMANEN DAN TIDAK BISA DIUNDO!`)) {
      setIsProcessing(true);
      setProgress(0);
      setStatusText('Memulai penghapusan massal...');
      sendTabAction('BATCH_DELETE_START', null);
    }
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
      item.id_dokumen.toLowerCase().includes(query)
    );
  });

  const selectedCount = items.filter(i => i.selected).length;

  return (
    <div className="space-y-4">
      {/* Warning Alert */}
      <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-md space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-md-xs text-red-900 dark:text-red-200">
          <AlertTriangle className="size-4 shrink-0" />
          <span>PERHATIAN!</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90">
          File yang dihapus <strong>tidak dapat dikembalikan</strong>. Tindakan ini bersifat permanen dan seketika menghapus dari database server.
        </p>
      </div>

      <div className="space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCrawl}
          disabled={isProcessing}
          className="w-full border-primary/20 hover:bg-primary/5 text-primary"
        >
          <Search className="size-3.5 mr-1" /> Cari Dokumen Pasien
        </Button>
      </div>

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
            <Input
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-6 max-w-[120px] text-[11px]"
            />
          </div>

          <div className="max-h-60 overflow-y-auto border border-border rounded-md divide-y divide-border bg-card">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 text-md-xs flex items-start gap-2 transition-colors ${
                  item.selected ? 'bg-red-500/5 border-l-2 border-red-500' : 'opacity-85'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleToggleItem(idx)}
                  disabled={isProcessing}
                  className="mt-0.5 rounded border-input text-red-600 focus:ring-red-500 size-3.5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-medium text-foreground truncate block" title={item.filename}>
                      {idx + 1}. {item.filename}
                    </span>
                    {item.status !== 'pending' && (
                      <Badge
                        variant={
                          item.status === 'success'
                            ? 'success'
                            : item.status === 'deleting'
                            ? 'warning'
                            : 'danger'
                        }
                        className="shrink-0 scale-90"
                      >
                        {item.status === 'success' ? 'Sukses' : item.status === 'deleting' ? '...' : 'Gagal'}
                      </Badge>
                    )}
                  </div>

                  <div className="text-[10px] text-muted-foreground flex gap-1.5">
                    <span>ID: <strong className="text-foreground">{item.id_dokumen}</strong></span>
                    <span>|</span>
                    <span>{item.tglFile}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{item.keterangan || '-'}</p>
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
                    onClick={() => handleSingleDelete(idx)}
                    disabled={isProcessing}
                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-600 transition-all disabled:opacity-50"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="size-3.5" />
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
          <Button
            variant="destructive"
            size="sm"
            onClick={handleStartDelete}
            disabled={isProcessing || items.length === 0 || selectedCount === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            <Trash2 className="size-3.5 mr-1" /> Hapus Terpilih ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}