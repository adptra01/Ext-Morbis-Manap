import React from "react";
import { createRoot } from "react-dom/client";
import ConsEnhancerApp from "./ConsEnhancerApp";

export function mountConsultationEnhancer() {
  const container = document.createElement("div");
  container.id = "consRoot";
  container.style.display = "none";
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    <div>
      <ConsEnhancerApp />
    </div>
  );
  return () => {
    root.unmount();
    container.remove();
  };
}
