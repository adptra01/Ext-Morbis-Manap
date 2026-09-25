import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { act } from 'react';
import { ErrorBoundary } from '../../src/ui/components/ErrorBoundary';

afterEach(cleanup);

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const Throw = () => {
  throw new Error('test crash');
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>ok</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('ok')).toBeTruthy();
  });

  it('renders default fallback on error', () => {
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Terjadi kesalahan')).toBeTruthy();
    expect(screen.getByText('test crash')).toBeTruthy();
  });

  it('renders custom fallback on error', () => {
    render(
      <ErrorBoundary fallback={<div>custom error</div>}>
        <Throw />
      </ErrorBoundary>,
    );
    expect(screen.getByText('custom error')).toBeTruthy();
  });
});
