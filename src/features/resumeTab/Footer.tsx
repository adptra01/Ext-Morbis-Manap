import { Save, RotateCcw, XCircle } from 'lucide-react';

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  hasErrors?: boolean;
  lastSaved?: string | null;
  onRefresh?: () => void;
}

export function Footer({ onCancel, onSave, saving, hasErrors, lastSaved, onRefresh }: FooterProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 border-t-2 border-[#e2ddd7] shrink-0"
      style={{ background: '#f8f6f3' }}
    >
      <div className="flex items-center gap-3">
        {hasErrors && (
          <span className="text-[#b91c1c] flex items-center gap-1.5 text-[14px] font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#b91c1c]" />
            Validasi gagal
          </span>
        )}
        {lastSaved && (
          <span className="text-[#6b7280] text-[14px]">Tersimpan pukul {lastSaved}</span>
        )}
        {saving && (
          <span className="text-[#2b5f8a] text-[14px] font-medium flex items-center gap-1.5">
            <RotateCcw className="h-4 w-4 animate-spin" />
            Menyimpan...
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="h-12 px-5 rounded-xl border-2 border-[#e2ddd7] bg-white text-[15px] font-semibold text-[#4a4e57] hover:bg-[#f0ece6] transition-all flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Segarkan
          </button>
        )}
        <button
          onClick={onCancel}
          className="h-12 px-5 rounded-xl border-2 border-[#e2ddd7] bg-white text-[15px] font-semibold text-[#4a4e57] hover:bg-[#f0ece6] transition-all flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Batal
        </button>
        <button
          onClick={onSave}
          disabled={saving || hasErrors}
          className="h-12 px-8 rounded-xl bg-[#2b7a4a] text-white text-[16px] font-bold hover:bg-[#23663d] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(43,122,74,0.3)]"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}
