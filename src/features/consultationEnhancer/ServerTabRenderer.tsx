import React, { useEffect, useRef } from 'react';

interface Props {
  html: string;
}

export default function ServerTabRenderer({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const head = (e.target as HTMLElement).closest('[data-cppt-toggle]');
      if (!head) return;
      const card = head.closest('.cons-cppt-card');
      if (card) card.classList.toggle('expanded');
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [html]);

  return <div ref={ref} className="cons-raw-html" dangerouslySetInnerHTML={{ __html: html }} />;
}
