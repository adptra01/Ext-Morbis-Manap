import { useState, useEffect, useCallback } from 'react';
import { getUsageLog, clearUsageLog } from '../features/shared/usageLog';
import type { UsageLogEntry } from '../features/shared/types';

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getDate()}/${d.getMonth() + 1} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/**
 * Panel log penggunaan & error fitur. Tersimpan lokal di browser ini
 * (chrome.storage.local), auto-hapus > 1 minggu. Utk diagnosa bug lapangan.
 */
export function UsageLogPanel() {
  const [logs, setLogs] = useState<UsageLogEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  const refresh = useCallback(() => {
    getUsageLog().then((entries) => setLogs(entries.slice(0, 50)));
  }, []);

  useEffect(() => {
    if (expanded) refresh();
  }, [expanded, refresh]);

  const errors = logs.filter((l) => !l.ok).length;

  const handleClear = useCallback(() => {
    if (!confirm('Hapus semua log penggunaan di komputer ini?')) return;
    clearUsageLog().then(() => {
      setLogs([]);
      refresh();
    });
  }, [refresh]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-md-xs"
      >
        <span className="text-muted-foreground">Log Penggunaan (7 hari)</span>
        <span
          className={`text-md-xs font-semibold ${errors > 0 ? 'text-red-500' : 'text-green-500'}`}
        >
          {logs.length === 0
            ? 'muat…'
            : `${logs.length} entri${errors > 0 ? ` · ${errors} error` : ''}`}
        </span>
      </button>
    );
  }

  return (
    <div className="border border-border rounded-md bg-background">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Log Penggunaan (7 hari terakhir)
        </span>
        <div className="flex gap-1">
          <button
            onClick={handleClear}
            className="text-[10px] px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            Hapus
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="text-[10px] px-2 py-0.5 rounded bg-accent text-foreground"
          >
            Tutup
          </button>
        </div>
      </div>
      <div className="max-h-[220px] overflow-y-auto p-1.5 space-y-1 font-mono text-[10px]">
        {logs.length === 0 && <p className="text-muted-foreground p-1">Belum ada log.</p>}
        {logs.map((l, i) => (
          <div
            key={i}
            className={`flex gap-1.5 items-start rounded px-1.5 py-1 ${
              l.ok ? 'bg-muted/40' : 'bg-destructive/10'
            }`}
          >
            <span className="text-muted-foreground shrink-0">{fmtTime(l.ts)}</span>
            <span className={l.ok ? 'text-foreground' : 'text-destructive'}>{l.feature}</span>
            <span className="text-muted-foreground">{l.event}</span>
            {l.detail && (
              <span className="text-muted-foreground truncate max-w-[140px]">{l.detail}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
