import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Button } from '../../src/ui/components/button';

afterEach(cleanup);

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeTruthy();
  });

  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByRole('button', { name: 'Click' }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders as disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: 'Disabled' }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Styled</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });

  it('renders different variants', () => {
    const { container } = render(
      <>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="link">Link</Button>
      </>,
    );
    expect(container.querySelectorAll('button').length).toBe(4);
  });

  it('renders compact xs size for popup (smaller than sm)', () => {
    const { container } = render(
      <>
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
      </>,
    );
    const [xs, sm] = Array.from(container.querySelectorAll('button'));
    expect(xs.className).toContain('h-7');
    expect(xs.className).toContain('text-xs');
    expect(xs.className).not.toContain('h-9');
    expect(sm.className).toContain('h-9');
  });
});
