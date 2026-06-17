import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/components/input';
import { Button } from '../../ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/components/select';
import type { DiagnosaRow } from './types';

interface DiagnosaSectionProps {
  rows: DiagnosaRow[];
  onChange: (rows: DiagnosaRow[]) => void;
}

export function DiagnosaSection({ rows, onChange }: DiagnosaSectionProps) {
  const updateRow = (i: number, partial: Partial<DiagnosaRow>) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...partial } : r));
    onChange(next);
  };

  const removeRow = (i: number) => {
    onChange(rows.filter((_, idx) => idx !== i));
  };

  return (
    <div className="px-5 py-4 border-b border-border bg-background">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md-sm font-semibold text-foreground">
          Diagnosa (ICD-10){' '}
          {rows.length > 0 && (
            <span className="text-muted-foreground font-normal">({rows.length})</span>
          )}
        </h3>
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            onChange([
              ...rows,
              { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' },
            ])
          }
        >
          <Plus className="size-3.5" />
          Tambah Diagnosa
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-border rounded-md py-6 text-center">
          <p className="text-md-sm text-muted-foreground">Belum ada diagnosa</p>
          <p className="text-md-xs text-muted-foreground mt-1">
            Klik "Tambah Diagnosa" untuk menambahkan
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-md-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  className="text-left font-semibold text-muted-foreground px-3 py-2"
                  style={{ width: '35%' }}
                >
                  Nama Diagnosa
                </th>
                <th
                  className="text-left font-semibold text-muted-foreground px-3 py-2"
                  style={{ width: '14%' }}
                >
                  Kode ICD-10
                </th>
                <th
                  className="text-left font-semibold text-muted-foreground px-3 py-2"
                  style={{ width: '15%' }}
                >
                  Kasus
                </th>
                <th
                  className="text-left font-semibold text-muted-foreground px-3 py-2"
                  style={{ width: '15%' }}
                >
                  Komplikasi
                </th>
                <th className="pr-3 py-2" style={{ width: '8%' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-3 py-1.5">
                    <Input
                      type="text"
                      value={row.namaDiagnosa}
                      onChange={(e) => updateRow(i, { namaDiagnosa: e.target.value })}
                      placeholder="Cari diagnosa..."
                      className="border-0 bg-transparent px-0 h-7 text-md-sm shadow-none focus-visible:ring-0"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      type="text"
                      value={row.kode10}
                      onChange={(e) => updateRow(i, { kode10: e.target.value })}
                      placeholder="Kode"
                      className="border-0 bg-transparent px-0 h-7 text-md-xs font-mono shadow-none focus-visible:ring-0"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Select value={row.kasus} onValueChange={(v) => updateRow(i, { kasus: v })}>
                      <SelectTrigger className="h-7 w-full border-border text-md-xs">
                        <SelectValue placeholder="Pilih Kasus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BARU">BARU</SelectItem>
                        <SelectItem value="LAMA">LAMA</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-1.5">
                    <Select
                      value={row.komplikasi}
                      onValueChange={(v) => updateRow(i, { komplikasi: v })}
                    >
                      <SelectTrigger className="h-7 w-full border-border text-md-xs">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ya">Ya</SelectItem>
                        <SelectItem value="Tidak">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="pr-3 py-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(i)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
