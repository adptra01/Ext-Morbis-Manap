import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { fetchTabContent } from "./legacy";
import ServerTabRenderer from "./ServerTabRenderer";
import PenunjangRenderer from "./PenunjangRenderer";

interface Props {
  data: Record<string, string>;
  onClose: () => void;
}

const TABS = [
  { id: "resep", label: "History Resep" },
  { id: "dokumen", label: "Dokumen Pasien" },
  { id: "cppt", label: "CPPT" },
  { id: "penunjang", label: "Penunjang Medis" },
];

export default function ConsInfoTabs({ data, onClose }: Props) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const loaded = useRef<Set<string>>(new Set());

  const loadTab = async (tabId: string) => {
    if (loaded.current.has(tabId)) return;
    loaded.current.add(tabId);
    setLoading((prev) => ({ ...prev, [tabId]: true }));
    try {
      const html = await fetchTabContent(tabId, data);
      setContents((prev) => ({ ...prev, [tabId]: html }));
    } catch {
      setContents((prev) => ({ ...prev, [tabId]: `<div class="cons-error">Gagal memuat data</div>` }));
    } finally {
      setLoading((prev) => ({ ...prev, [tabId]: false }));
    }
  };

  useEffect(() => { loadTab(TABS[0].id); }, []);

  return createPortal(
    <div className="cons-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cons-modal cons-modal-wide">
        <div className="cons-header">
          <h2>{data.nama ?? ""} ({data.noRm ?? ""})</h2>
          <button className="cons-close" onClick={onClose}>&times;</button>
        </div>
        <div className="cons-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`cons-tab-btn${activeTab === tab.id ? " cons-tab-active" : ""}`}
              onClick={() => { setActiveTab(tab.id); loadTab(tab.id); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="cons-tab-content">
          {loading[activeTab] ? (
            <div className="cons-loading">Memuat...</div>
          ) : contents[activeTab] ? activeTab === "penunjang" ? (
            <PenunjangRenderer html={contents[activeTab]} />
          ) : (
            <ServerTabRenderer html={contents[activeTab]} />
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
