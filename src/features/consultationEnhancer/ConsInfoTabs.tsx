import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchTabContent } from './legacy';
import ServerTabRenderer from './ServerTabRenderer';
import type { ExtModal } from '../../ui/web';

interface Props {
  data: Record<string, string>;
  onClose: () => void;
}

const TABS = [
  { id: 'resep', label: 'History Resep' },
  { id: 'dokumen', label: 'Dokumen Pasien' },
  { id: 'cppt', label: 'CPPT' },
];

export default function ConsInfoTabs({ data, onClose }: Props) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const loaded = useRef<Set<string>>(new Set());
  const modalRef = useRef<ExtModal>(null);

  const loadTab = async (tabId: string) => {
    if (loaded.current.has(tabId)) return;
    loaded.current.add(tabId);
    setLoading((prev) => ({ ...prev, [tabId]: true }));
    try {
      const html = await fetchTabContent(tabId, data);
      setContents((prev) => ({ ...prev, [tabId]: html }));
    } catch {
      setContents((prev) => ({
        ...prev,
        [tabId]: `<div class="cons-error">Gagal memuat data</div>`,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [tabId]: false }));
    }
  };

  useEffect(() => {
    modalRef.current?.open();
    const el = modalRef.current;
    const onCancel = () => onClose();
    el?.addEventListener('ext-cancel', onCancel);
    return () => el?.removeEventListener('ext-cancel', onCancel);
  }, []);

  useEffect(() => {
    loadTab(TABS[0].id);
  }, []);

  return createPortal(
    <ext-modal ref={modalRef} variant="info">
      <h3 slot="title">
        {data.nama ?? ''} ({data.noRm ?? ''})
      </h3>
      <ext-tabs>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            slot="tab"
            data-tab={tab.id}
            data-active={activeTab === tab.id ? '' : undefined}
            onClick={() => {
              setActiveTab(tab.id);
              loadTab(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
        {TABS.map((tab) => (
          <div
            key={tab.id}
            slot="panel"
            data-panel={tab.id}
            data-active={activeTab === tab.id ? '' : undefined}
          >
            {loading[tab.id] ? (
              <div className="cons-loading">Memuat...</div>
            ) : contents[tab.id] ? (
              <ServerTabRenderer html={contents[tab.id]} />
            ) : null}
          </div>
        ))}
      </ext-tabs>
      <div slot="footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <ext-btn variant="secondary" onClick={onClose}>
          Tutup
        </ext-btn>
      </div>
    </ext-modal>,
    document.body,
  );
}
