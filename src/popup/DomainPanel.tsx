import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui/components/input';
import { Button } from '../ui/components/button';
import { Switch } from '../ui/components/switch';
import type { CustomUrl } from '../types';

interface DomainPanelProps {
  urls: CustomUrl[];
  onAdd: (url: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

export function DomainPanel({ urls, onAdd, onRemove, onToggle }: DomainPanelProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (url: string): boolean => {
    try {
      const p = new URL(url);
      return p.protocol === 'http:' || p.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Masukkan URL terlebih dahulu');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('Format URL tidak valid');
      return;
    }
    if (urls.find((u) => u.url === trimmed)) {
      setError('URL sudah ada');
      return;
    }
    setError(null);
    onAdd(trimmed);
    setInput('');
  };

  return (
    <div>
      <div className="flex gap-1.5 mb-1.5">
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="http://example.com"
          className="flex-1"
        />
        <Button variant="default" size="sm" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Tambah
        </Button>
      </div>
      {error && (
        <p className="text-[10px] text-destructive mb-1" role="alert">
          {error}
        </p>
      )}
      {urls.length === 0 ? (
        <p className="text-center text-md-xs text-muted-foreground py-3">Belum ada URL</p>
      ) : (
        <div className="space-y-0.5">
          {urls.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-accent group ${
                item.isDefault ? 'bg-blue-50 dark:bg-blue-950/20' : ''
              }`}
            >
              <Switch
                checked={item.enabled}
                onCheckedChange={(val) => onToggle(item.id, val)}
                className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
              />
              <span className="flex-1 text-[10px] text-foreground truncate font-mono">
                {item.url}
              </span>
              <span
                className={`text-[8px] font-semibold px-1 py-0.5 rounded ${
                  item.isDefault
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.isDefault ? 'DEFAULT' : 'CUSTOM'}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                disabled={item.isDefault}
                aria-label={`Hapus ${item.url}`}
                className={`p-0.5 rounded transition-colors ${
                  item.isDefault ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 hover:bg-accent'
                }`}
                title="Hapus"
              >
                <X className="size-3 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
