/**
 * Deklarasi JSX untuk Web Components shared UI layer (src/ui/web).
 * React 19 (react-jsx) memakai namespace React.JSX — deklarasi via
 * module augmentation pada module 'react' agar `npx tsc --noEmit` bersih.
 */
import type { ExtBtn, ExtBadge, ExtTabs, ExtModal } from './web/index';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ext-btn': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'danger' | 'success' | 'secondary' | 'ghost' | 'ghost-danger';
          size?: 'sm' | 'md' | 'lg';
          loading?: boolean | string;
          disabled?: boolean | string;
        },
        HTMLElement
      > & { ref?: React.Ref<ExtBtn> };
      'ext-badge': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
        },
        HTMLElement
      > & { ref?: React.Ref<ExtBadge> };
      'ext-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<ExtTabs>;
      };
      'ext-modal': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          open?: boolean | string;
          variant?: 'danger' | 'success' | 'info' | 'warning';
          'ok-label'?: string;
          'cancel-label'?: string;
          'hide-cancel'?: boolean | string;
        },
        HTMLElement
      > & { ref?: React.Ref<ExtModal> };
    }
  }
}

export {};
