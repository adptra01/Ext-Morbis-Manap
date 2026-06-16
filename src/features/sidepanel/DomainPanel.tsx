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

export function DomainPanel({ urls, onAdd, onRemove, onToggle }: DomainPanelProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="http://192.168.1.100"
          className="flex-1"
        />
        <Button variant="default" size="sm" onClick={handleAdd}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {urls.length === 0 && (
        <div className="text-center py-8">
          <p className="text-md-sm text-muted-foreground">Belum ada domain</p>
        </div>
      )}

      <div className="space-y-1">
        {urls.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent group"
          >
            <Switch checked={item.enabled} onCheckedChange={(val) => onToggle(item.id, val)} />
            <span className="flex-1 text-md-sm text-foreground truncate font-mono text-md-xs">
              {item.url}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              aria-label={`Hapus ${item.url}`}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
              title="Hapus"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
