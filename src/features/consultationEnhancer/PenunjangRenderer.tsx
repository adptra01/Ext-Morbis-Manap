import React, { useEffect, useMemo, useState } from "react";

interface Props {
  html: string;
}

function extractVisibleHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const preferred = doc.querySelector(".data-input-cus");
  if (preferred) return preferred.outerHTML;
  const main = doc.querySelector(".main");
  if (main) return main.outerHTML;
  const contents = doc.getElementById("contents");
  if (contents) return contents.outerHTML;
  return html;
}

export default function PenunjangRenderer({ html }: Props) {
  const [readyHtml, setReadyHtml] = useState("");
  const seed = useMemo(() => html, [html]);

  useEffect(() => {
    const t = window.setTimeout(() => setReadyHtml(extractVisibleHtml(seed)), 0);
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).penunjang_modal = (id_pasien: string | number) => {
        const modal = window.open("", "_blank");
        const url = `/admisi/modal/modal-history-penunjang-v2?norm=${id_pasien}&id_visit=${(window as any).document?.querySelector?.('#id_visit')?.value || ''}`;
        if (modal) {
          modal.location.href = url;
          modal.focus();
        } else {
          window.location.href = url;
        }
      };
      (window as unknown as Record<string, unknown>).master_lab = (id_visit: string | number) => {
        const win = window.open(`/admisi/modal/modal-laborat?id_visit=${id_visit}`, "MyWindow", "width=8000px,height=800px,scrollbars=1");
        win?.focus();
      };
      (window as unknown as Record<string, unknown>).master = (id_visit: string | number) => {
        const win = window.open(`/admisi/modal/modal-radiologi?id_visit=${id_visit}&jenis=Radiologi`, "MyWindow", "width=8000px,height=800px,scrollbars=1");
        win?.focus();
      };
    }
    return () => window.clearTimeout(t);
  }, [seed]);

  if (!readyHtml) {
    return <div className="cons-loading">Memuat...</div>;
  }

  return <div className="cons-penunjang" dangerouslySetInnerHTML={{ __html: readyHtml }} />;
}
