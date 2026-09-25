import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { FeaturesPanel } from '../../src/popup/FeaturesPanel';

afterEach(cleanup);

function makeFeatures() {
  return {
    openDetailInNewTab: {
      enabled: true,
      name: 'Open Detail Mode',
      description: 'Pilih mode buka detail',
      allowedRoles: ['casemix'],
    },
    batchUpload: {
      enabled: false,
      name: 'Batch Upload',
      allowedRoles: ['casemix'],
    },
    comingSoonFeature: {
      enabled: false,
      name: 'Coming Soon',
      allowedRoles: ['casemix'],
      comingSoon: true,
    },
  };
}

describe('FeaturesPanel', () => {
  it('renders features for the matching role', () => {
    render(
      <FeaturesPanel
        features={makeFeatures()}
        role="casemix"
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/Open Detail Mode/)).toBeTruthy();
    expect(screen.getByText(/Batch Upload/)).toBeTruthy();
  });

  it('shows enabled count text', () => {
    render(
      <FeaturesPanel
        features={makeFeatures()}
        role="casemix"
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    const countEl = screen.getByText(/\d+ dari \d+ fitur aktif/);
    expect(countEl).toBeTruthy();
  });

  it('shows coming soon badge', () => {
    render(
      <FeaturesPanel
        features={makeFeatures()}
        role="casemix"
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    const badges = screen.getAllByText('CS');
    expect(badges.length).toBe(1);
  });

  it('shows description text', () => {
    render(
      <FeaturesPanel
        features={makeFeatures()}
        role="casemix"
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    const descs = screen.getAllByText('Pilih mode buka detail');
    expect(descs.length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty message when no features for role', () => {
    render(
      <FeaturesPanel
        features={makeFeatures()}
        role="labor"
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Tidak ada fitur untuk role ini')).toBeTruthy();
  });

  it('shows features for admin role', () => {
    render(
      <FeaturesPanel
        features={makeFeatures()}
        role="admin"
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    const features = screen.getAllByText(/Open Detail Mode|Batch Upload|Coming Soon/);
    expect(features.length).toBeGreaterThanOrEqual(3);
  });

  it('applies disabled styles', () => {
    const { container } = render(
      <FeaturesPanel
        features={makeFeatures()}
        role="casemix"
        disabled={true}
        onToggle={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain('opacity-50');
  });
});
