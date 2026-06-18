import React from "react";
import ConsDetailModal from "./ConsDetailModal";
import ConsInfoTabs from "./ConsInfoTabs";

export default function ConsEnhancerApp() {
  const [detailData, setDetailData] = React.useState<Record<string, string> | null>(null);
  const [infoData, setInfoData] = React.useState<Record<string, string> | null>(null);

  React.useEffect(() => {
    const onDetail = (e: Event) => setDetailData((e as CustomEvent).detail);
    const onInfo = (e: Event) => setInfoData((e as CustomEvent).detail);
    window.addEventListener("morbis-cons-detail", onDetail);
    window.addEventListener("morbis-cons-info", onInfo);
    return () => {
      window.removeEventListener("morbis-cons-detail", onDetail);
      window.removeEventListener("morbis-cons-info", onInfo);
    };
  }, []);

  return (
    <>
      {detailData && <ConsDetailModal data={detailData} onClose={() => setDetailData(null)} />}
      {infoData && <ConsInfoTabs data={infoData} onClose={() => setInfoData(null)} />}
    </>
  );
}
