import { useState } from "react";

interface Props {
  data: Record<string, string>;
}

const TABS = [
  { id: "resep", label: "History Resep" },
  { id: "dokumen", label: "Dokumen Pasien" },
  { id: "cppt", label: "CPPT" },
  { id: "penunjang", label: "Penunjang Medis" },
] as const;

const TAB_EP: Record<string, { url: string; method: string; getData: (d: Props["data"]) => Record<string, string> }> = {
  resep: { url: "/admisi/pengajuan_konsultasi/tabel-resep", method: "POST", getData: (d) => ({ id_visit: d.visit, id_pasien: d.noRm, page: "1" }) },
  dokumen: { url: "/admisi/pengajuan_konsultasi/tabel-dok", method: "POST", getData: (d) => ({ id_visit: d.visit, id_pasien: d.noRm, page: "1" }) },
  cppt: { url: "/admisi/pengajuan_konsultasi/tabel-cppt", method: "POST", getData: (d) => ({ id_visit: d.visit, id_pasien: d.noRm, page: "1" }) },
  penunjang: { url: "/admisi/modal/modal-history-penunjang-v2", method: "GET", getData: (d) => ({ norm: d.noRm, id_visit: d.visit }) },
};

export function ConsultationInfoPanel({ data }: Props) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const loadTab = async (tabId: string) => {
    if (contents[tabId] || loading[tabId]) return;
    setLoading((prev) => ({ ...prev, [tabId]: true }));

    const ep = TAB_EP[tabId];
    const url = `${data.baseUrl || "http://103.147.236.140"}${ep.url}`;
    const formData = ep.getData(data);

    try {
      const res = await chrome.runtime.sendMessage({ type: "PROXY_FETCH", url, method: ep.method, data: formData });
      setContents((prev) => ({ ...prev, [tabId]: res?.success ? res.html : `<div style="color:red;padding:20px;">Gagal memuat</div>` }));
    } catch {
      setContents((prev) => ({ ...prev, [tabId]: `<div style="color:red;padding:20px;">Gagal memuat</div>` }));
    } finally {
      setLoading((prev) => ({ ...prev, [tabId]: false }));
    }
  };

  if (!contents[TABS[0].id] && !loading[TABS[0].id]) loadTab(TABS[0].id);

  return (
    <div className="space-y-3">
      <h3 className="text-md-sm font-semibold text-foreground">Info Pasien</h3>
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); loadTab(tab.id); }}
            className={`px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors -mb-[1px] ${
              activeTab === tab.id ? "text-foreground border-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {loading[activeTab] ? (
          <div className="text-center py-12 text-muted-foreground text-md-sm">Memuat...</div>
        ) : contents[activeTab] ? (
          <div className="text-md-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: contents[activeTab] }} />
        ) : null}
      </div>
    </div>
  );
}
