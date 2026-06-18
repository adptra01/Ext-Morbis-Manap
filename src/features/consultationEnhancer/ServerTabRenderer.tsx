import React, { useMemo, useState } from "react";

interface Props {
  html: string;
}

interface TableData {
  headers: string[];
  rows: { html: string; text: string }[][];
}

function stripHtml(html: string): string {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || d.innerText || "";
}

function extractTables(html: string): TableData[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const tables: TableData[] = [];
  const container = doc.querySelector(".main") || doc.body;
  const tableEls = container.querySelectorAll("table");

  tableEls.forEach((table) => {
    const t: TableData = { headers: [], rows: [] };
    const allRows = table.querySelectorAll("tr");
    if (allRows.length === 0) return;

    const thead = table.querySelector("thead");
    if (thead) {
      thead.querySelectorAll("th, td").forEach((cell) => {
        t.headers.push(cell.textContent?.trim() || "");
      });
    }
    const firstRow = allRows[0];
    const thCells = firstRow.querySelectorAll("th");
    if (t.headers.length === 0 && thCells.length > 0) {
      thCells.forEach((cell) => {
        t.headers.push(cell.textContent?.trim() || "");
      });
    }

    const tbody = table.querySelector("tbody");
    const bodyRows = tbody ? tbody.querySelectorAll("tr") : allRows;
    const skipFirstRow = !tbody && t.headers.length > 0;

    bodyRows.forEach((row, ri) => {
      if (skipFirstRow && ri === 0) return;
      const cells: { html: string; text: string }[] = [];
      row.querySelectorAll("td").forEach((cell) => {
        const h = cell.innerHTML;
        cells.push({ html: h, text: stripHtml(h).trim() });
      });
      if (cells.length > 0) t.rows.push(cells);
    });

    if (t.rows.length > 0) tables.push(t);
  });

  return tables;
}

const TRUNCATE_LEN = 100;

function needsTruncate(text: string): boolean {
  return text.length > TRUNCATE_LEN || (text.match(/\n/g) || []).length > 2;
}

export default function ServerTabRenderer({ html }: Props) {
  const tables = useMemo(() => extractTables(html), [html]);
  const pagination = useMemo(() => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const el = doc.querySelector(".pagination");
    return el ? el.outerHTML : null;
  }, [html]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (tidx: number, ridx: number) => {
    const key = `${tidx}-${ridx}`;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (tables.length === 0) {
    return <div className="cons-empty">Tidak ada data</div>;
  }

  return (
    <div className="cons-renderer">
      {tables.map((t, ti) => {
        const anyLong = t.rows.some((r) => r.some((c) => needsTruncate(c.text)));
        return (
          <div key={ti} className="cons-table-wrap">
            <table className="cons-custom-table">
              <thead>
                <tr>
                  {t.headers.map((h, ci) => (
                    <th key={ci}>{h || `Kolom ${ci + 1}`}</th>
                  ))}
                  {anyLong && <th className="cons-th-aksi">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, ri) => {
                  const key = `${ti}-${ri}`;
                  const open = expanded.has(key);
                  return (
                    <React.Fragment key={ri}>
                      <tr>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={open ? "cons-td-open" : ""}
                            title={!open && needsTruncate(cell.text) ? cell.text : undefined}
                          >
                            {!open && needsTruncate(cell.text) ? (
                              <span className="cons-text-clip">
                                {cell.text.slice(0, TRUNCATE_LEN).replace(/\n/g, " ")}...
                              </span>
                            ) : (
                              <span style={{ whiteSpace: "pre-wrap" }}>{cell.text}</span>
                            )}
                          </td>
                        ))}
                        {anyLong && (
                          <td className="cons-td-aksi">
                            <button className="cons-btn-detail" onClick={() => toggle(ti, ri)}>
                              {open ? "Tutup" : "Detail"}
                            </button>
                          </td>
                        )}
                      </tr>
                      {open && (
                        <tr className="cons-expand-row">
                          <td colSpan={(t.headers.length || row.length) + (anyLong ? 1 : 0)}>
                            <div className="cons-expand-body">
                              {row.map((cell, ci) => (
                                <div key={ci} className="cons-expand-field">
                                  <span className="cons-expand-label">
                                    {t.headers[ci] || `Kolom ${ci + 1}`}
                                  </span>
                                  <div
                                    className="cons-expand-value"
                                    dangerouslySetInnerHTML={{ __html: cell.html }}
                                  />
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
      {pagination && (
        <div className="cons-pagination" dangerouslySetInnerHTML={{ __html: pagination }} />
      )}
    </div>
  );
}
