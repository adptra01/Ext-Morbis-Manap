import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { StatusCard } from '../../src/popup/StatusCard';

afterEach(cleanup);

describe('StatusCard', () => {
  it('shows Aktif when enabled', () => {
    render(<StatusCard enabled={true} role="casemix" onToggle={vi.fn()} onRoleChange={vi.fn()} />);
    expect(screen.getByText('Aktif')).toBeTruthy();
  });

  it('shows Non-Aktif when disabled', () => {
    render(<StatusCard enabled={false} role="casemix" onToggle={vi.fn()} onRoleChange={vi.fn()} />);
    expect(screen.getByText('Non-Aktif')).toBeTruthy();
  });

  it('shows role label', () => {
    render(<StatusCard enabled={true} role="dokter" onToggle={vi.fn()} onRoleChange={vi.fn()} />);
    const matches = screen.getAllByText(/Dokter/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('shows enabled dot', () => {
    const { container } = render(
      <StatusCard enabled={true} role="casemix" onToggle={vi.fn()} onRoleChange={vi.fn()} />,
    );
    expect(container.querySelector('.bg-green-500')).toBeTruthy();
  });
});
