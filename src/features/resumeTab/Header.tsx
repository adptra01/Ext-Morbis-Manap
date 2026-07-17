import { X } from 'lucide-react';

interface HeaderProps {
  title: string;
  onClose: () => void;
}

export function Header({ title, onClose }: HeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 shrink-0"
      style={{
        background: 'linear-gradient(135deg, #2b5f8a 0%, #1f4a6e 100%)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-white tracking-tight font-['Lexend',system-ui,sans-serif]">
          {title}
        </h2>
      </div>
      <button
        onClick={onClose}
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
        aria-label="Tutup"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
