import { Button } from '../../ui/components/button';
import { Badge } from '../../ui/components/Badge';
import type { ResumeData } from './types';

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
  /** ponytail: onRefresh is the seam App.tsx uses (`() => location.reload()`). Keep it stable; confirmation is layered in App if needed. */
  onRefresh?: () => void;
  onReset?: () => void;
  onHistory?: () => void;
  saving?: boolean;
  hasErrors?: boolean;
  lastSaved?: string | null;
  /** Ringkasan urutan yang AKAN dikirim ke server, supaya dokter bisa
   *  memverifikasi urutan tanpa harus membuka DevTools. Urutan di server
   *  mengikuti urutan baris di payload (delete-all-then-insert), jadi
   *  urutan di layar = urutan yang akan tersimpan. */
  orderSummary?: { label: string; codes: string[] }[];
}

export function Footer({
  onCancel,
  onSave,
  onRefresh,
  onReset,
  onHistory,
  saving,
  hasErrors,
  lastSaved,
  orderSummary,
}: FooterProps) {
  const handleReset = onReset ?? onRefresh;
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t-2 border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0 sticky bottom-0 z-[1]">
      <div className="flex items-center gap-3 min-w-0 flex-wrap">
        {hasErrors && (
          <Badge variant="danger" icon>
            Validasi gagal
          </Badge>
        )}
        {lastSaved && (
          <span className="text-base text-muted-foreground truncate">Tersimpan {lastSaved}</span>
        )}
        {saving && (
          <Badge variant="default" icon>
            Menyimpan...
          </Badge>
        )}
        {orderSummary?.map((o) => (
          <span key={o.label} className="text-base text-muted-foreground truncate">
            {o.label}: {o.codes.length ? o.codes.join(' → ') : '(kosong)'}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {onHistory && (
          <Button
            type="button"
            variant="success"
            size="default"
            onClick={onHistory}
            className="gap-2"
          >
            Riwayat
          </Button>
        )}
        {handleReset && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleReset}
            className="gap-2"
          >
            Reset Formulir
          </Button>
        )}
        <Button type="button" variant="dark" size="default" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={onSave}
          disabled={saving || hasErrors}
          className="gap-2 px-7 min-h-11"
          aria-label="Simpan resume"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
}
