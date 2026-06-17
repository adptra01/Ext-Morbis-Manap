import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '../../ui/components/input';
import { Button } from '../../ui/components/button';
import { Switch } from '../../ui/components/switch';
import { type CustomUrl } from './types';

interface DomainPanelProps {
  urls: CustomUrl[];
  onAdd: (url: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

const isValidUrl = (url: string): boolean => {
  try {
    const p = new URL(url);
    return p.protocol === 'http:' || p.protocol === 'https:';
  } catch {
    return false;
  }
};

export function DomainPanel({ urls, onAdd, onRemove, onToggle }: DomainPanelProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="http://192.168.1.100"
          className="flex-1"
        />
        <Button variant="default" size="sm" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {error && (
        <p className="text-md-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {urls.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-md-sm text-muted-foreground">Belum ada domain</p>
        </div>
      )}

      <div className="space-y-1">
        {urls.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent group ${
              item.isDefault ? 'bg-blue-50 dark:bg-blue-950/20' : ''
            }`}
          >
            <Switch checked={item.enabled} onCheckedChange={(val) => onToggle(item.id, val)} />
            <span className="flex-1 text-md-xs text-foreground truncate font-mono">{item.url}</span>
            {item.isDefault && (
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                DEFAULT
              </span>
            )}
            <button
              onClick={() => onRemove(item.id)}
              disabled={item.isDefault}
              aria-label={`Hapus ${item.url}`}
              className={`p-1 rounded transition-colors ${
                item.isDefault
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive'
              }`}
              title={item.isDefault ? 'URL default tidak dapat dihapus' : 'Hapus'}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
