"use strict";
var __morbis_feature = (() => {
  // src/features/pindahOperasi/main.ts
  function pindahOperasi() {
    const form = document.querySelector("#form-data");
    if (!form) {
      alert("Form #form-data tidak ditemukan");
      return;
    }
    const targetVisit = prompt("Masukkan ID Visit tujuan:");
    if (!targetVisit || !/^\d+$/.test(targetVisit)) return;
    const targetKunjungan = prompt("Masukkan ID Kunjungan tujuan (opsional):") || "";
    const fd = new FormData(form);
    const params = new URLSearchParams();
    for (const [k, v] of Array.from(fd.entries())) {
      if (k !== "id_pengajuan") params.append(k, v);
    }
    params.set("id_visit", targetVisit);
    if (targetKunjungan) params.set("id_kunjungan", targetKunjungan);
    const btn = document.querySelector("#simpan-pindah");
    if (btn) {
      btn.disabled = true;
      btn.value = "Memproses...";
    }
    fetch("/admisi/pelaksanaan_pelayanan/control/pengajuan-operasi?opsi=simpan", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: params.toString()
    }).then((r) => r.json()).then((data) => {
      if (data.status === "200" || data.status === 200) {
        alert("BERHASIL! Operasi dipindahkan ke Visit " + targetVisit);
        location.reload();
      } else {
        alert("GAGAL: " + (data.message || "Respon tidak dikenal"));
      }
    }).catch((e) => alert("Gagal: " + e.message)).finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.value = "Pindahkan Operasi";
      }
    });
  }
  function init() {
    const loginPaths = ["/login", "/auth", "/signin", "/masuk", "/keluar", "/logout"];
    if (loginPaths.some((p) => location.pathname.toLowerCase().includes(p)) || document.querySelectorAll('input[type="password"]').length > 0)
      return;
    if (document.getElementById("simpan-pindah")) return;
    const simpan = document.querySelector(
      '#simpan, #save, input[type="submit"], button[type="submit"]'
    );
    if (!simpan || !simpan.parentNode) return;
    const btn = document.createElement("input");
    btn.type = "button";
    btn.className = "btn btn-warning";
    btn.id = "simpan-pindah";
    btn.value = "Pindahkan Operasi";
    btn.onclick = pindahOperasi;
    simpan.parentNode.insertBefore(btn, simpan.nextSibling);
    console.log("[PindahOperasi] Button added");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
//# sourceMappingURL=main.js.map
