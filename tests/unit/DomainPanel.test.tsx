import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DomainPanel } from '../../src/popup/DomainPanel';

afterEach(cleanup);

const defaultUrls = [
  { id: 'default-1', url: 'http://192.168.8.4', enabled: true, isDefault: true },
  { id: 'custom-1', url: 'http://example.com', enabled: false, isDefault: false },
];

describe('DomainPanel', () => {
  it('renders URLs', () => {
    render(
      <DomainPanel urls={defaultUrls} onAdd={vi.fn()} onRemove={vi.fn()} onToggle={vi.fn()} />,
    );
    expect(screen.getByText('http://192.168.8.4')).toBeTruthy();
    expect(screen.getByText('http://example.com')).toBeTruthy();
  });

  it('shows empty message when no URLs', () => {
    render(<DomainPanel urls={[]} onAdd={vi.fn()} onRemove={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.getByText('Belum ada URL')).toBeTruthy();
  });

  it('renders input and add button', () => {
    render(
      <DomainPanel urls={defaultUrls} onAdd={vi.fn()} onRemove={vi.fn()} onToggle={vi.fn()} />,
    );
    expect(screen.getByPlaceholderText('http://example.com')).toBeTruthy();
    const addButtons = screen.getAllByText('Tambah');
    expect(addButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders default and custom badges', () => {
    render(
      <DomainPanel urls={defaultUrls} onAdd={vi.fn()} onRemove={vi.fn()} onToggle={vi.fn()} />,
    );
    const defaults = screen.getAllByText('DEFAULT');
    const customs = screen.getAllByText('CUSTOM');
    expect(defaults.length).toBeGreaterThanOrEqual(1);
    expect(customs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders delete buttons for each URL', () => {
    render(
      <DomainPanel urls={defaultUrls} onAdd={vi.fn()} onRemove={vi.fn()} onToggle={vi.fn()} />,
    );
    const deleteButtons = screen.getAllByLabelText(/Hapus/);
    expect(deleteButtons.length).toBe(2);
  });
});
