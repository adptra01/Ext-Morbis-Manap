"use strict";
var __morbis_feature = (() => {
  // src/features/resumeTab.ts
  (function() {
    var MAX_WAIT = 200;
    var waited = 0;
    var AUTOCOMPLETE_URLS = {
      icd10: "/rekam-medik/search?opsi=clauseDiagnose_icd10",
      icd9: "/rekam-medik/search?opsi=clauseDiagnose_icd9"
    };
    var ENDPOINT = "/rekam-medik/control/rm-rawat-jalan";
    var diagnosaRowCounter = 0;
    var tindakanRowCounter = 0;
    var dataLoaded = false;
    var simpanBound = false;
    var extRoot = null;
    var acMenuIcd10 = null;
    var acMenuIcd9 = null;
    var acActiveInput = null;
    var acActiveCallback = null;
    var check = setInterval(function() {
      waited++;
      var enabled = document.documentElement.getAttribute("data-ext-resume-modal");
      if (enabled !== null) {
        clearInterval(check);
        if (enabled === "1") {
          console.log("[ResumeTab] Attribute found, enabled=1, calling init()");
          init();
        }
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
        console.warn("[ResumeTab] Attribute not found after timeout, self-init fallback");
        init();
      }
    }, 50);
    function init() {
      if (!isMklaimDetailPage()) {
        console.log("[ResumeTab] init: BUKAN halaman M-Klaim detail, skip");
        return;
      }
      var idVisit = getIdVisit();
      if (!idVisit) {
        console.warn("[ResumeTab] init: No id_visit found in URL");
        return;
      }
      console.log("[ResumeTab] init: id_visit =", idVisit, ", menunggu DOM ready...");
      var poll = setInterval(function() {
        var form = document.querySelector(".form-horizontal") || document.querySelector("form");
        if (!form) return;
        clearInterval(poll);
        if (!isRawatJalan()) {
          console.log("[ResumeTab] init: BUKAN rawat jalan, skip");
          return;
        }
        console.log("[ResumeTab] init: isRawatJalan = true, injectFloatingButton...");
        injectFloatingButton(idVisit);
      }, 200);
    }
    function isMklaimDetailPage() {
      return window.location.pathname.includes("/v2/m-klaim/detail-v2");
    }
    function getIdVisit() {
      var params = new URLSearchParams(window.location.search);
      return params.get("id_visit");
    }
    function isRawatJalan() {
      var params = new URLSearchParams(window.location.search);
      var status = (params.get("status") || "").toLowerCase();
      if (status === "rj") return true;
      var jenis = document.querySelector('input[name="jenis"]');
      if (jenis && jenis.value.toUpperCase().includes("JALAN")) return true;
      return false;
    }
    function injectFloatingButton(idVisit) {
      if (document.getElementById("ext-resume-root")) return;
      var host = document.createElement("div");
      host.id = "ext-resume-root";
      document.body.appendChild(host);
      extRoot = host.attachShadow({ mode: "open" });
      var css = getShadowCSS();
      extRoot.innerHTML = css + getShadowHTML();
      var rootEl = extRoot.querySelector(".ext-root");
      var btn = extRoot.getElementById("ext-floating-btn");
      var overlay = extRoot.querySelector(".ext-overlay");
      var closeBtn = extRoot.getElementById("ext-overlay-close");
      var backdrop = extRoot.querySelector(".ext-backdrop");
      btn.addEventListener("click", function() {
        openOverlay(idVisit);
      });
      if (closeBtn) {
        closeBtn.addEventListener("click", function() {
          closeOverlay();
        });
      }
      if (backdrop) {
        backdrop.addEventListener("click", function() {
          closeOverlay();
        });
      }
      document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeOverlay();
      });
      createAcMenus();
      injectPrintCSS();
      console.log("[ResumeTab] Shadow DOM + floating button injected");
    }
    function openOverlay(idVisit) {
      var overlay = extRoot.querySelector(".ext-overlay");
      if (!overlay) return;
      overlay.style.display = "flex";
      if (!dataLoaded) {
        var content = extRoot.getElementById("ext-resume-content");
        if (content) {
          content.innerHTML = '<div class="ext-loading"><div class="ext-spinner"></div><p>Memuat data resume...</p></div>';
        }
        dataLoaded = true;
        loadResumeData(idVisit);
      }
    }
    function closeOverlay() {
      var overlay = extRoot ? extRoot.querySelector(".ext-overlay") : null;
      if (overlay) overlay.style.display = "none";
      hideAcMenu();
    }
    function showLoadError(msg) {
      var content = extRoot ? extRoot.getElementById("ext-resume-content") : null;
      if (!content) return;
      content.innerHTML = '<div class="ext-error"><p class="ext-error-title">Gagal memuat data resume</p><p>' + esc(msg) + '</p><button id="ext-error-back" class="ext-btn ext-btn-danger">Kembali</button></div>';
      var backBtn = content.querySelector("#ext-error-back");
      if (backBtn) backBtn.addEventListener("click", function() {
        closeOverlay();
      });
    }
    function loadResumeData(idVisit) {
      var url = window.location.origin + "/rekam-medik/rm-rawat-jalan-new?id_visit=" + idVisit;
      fetch(url, { credentials: "same-origin" }).then(function(r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      }).then(function(html) {
        parseAndRender(html, idVisit);
      }).catch(function(e) {
        showLoadError(e.message);
      });
    }
    function parseAndRender(html, idVisit) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var data = extractFormData(doc);
      data.id_visit = idVisit;
      var content = extRoot ? extRoot.getElementById("ext-resume-content") : null;
      if (!content) return;
      content.innerHTML = buildFormHTML(data);
      bindFormEvents();
    }
    function bindFormEvents() {
      var root = extRoot;
      if (!root) return;
      bindDynamicRows(root);
      bindSimpan(root);
      bindCancel(root);
      initAutocompleteFields(root);
    }
    function extractFormData(doc) {
      var val = function(id) {
        var el2 = doc.getElementById(id);
        return el2 ? (el2.value || "").trim() : "";
      };
      var sel = function(sel2) {
        var el2 = doc.querySelector(sel2);
        return el2 ? (el2.value || "").trim() : "";
      };
      var allFormData = {};
      var arrayFields = {};
      var form = doc.querySelector("form");
      if (form) {
        var elements = form.querySelectorAll("input, select, textarea");
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          if (!el.name) continue;
          if ((el.type === "checkbox" || el.type === "radio") && !el.checked) continue;
          var name = el.name;
          var value = el.value || "";
          if (name.endsWith("[]")) {
            var cleanName = name.slice(0, -2);
            if (!arrayFields[cleanName]) arrayFields[cleanName] = [];
            arrayFields[cleanName].push(value);
          } else {
            allFormData[name] = value;
          }
        }
      }
      var allHidden = doc.querySelectorAll('input[type="hidden"]');
      for (var i = 0; i < allHidden.length; i++) {
        var inp = allHidden[i];
        if (!inp.name) continue;
        var name = inp.name;
        var value = inp.value || "";
        if (name.endsWith("[]")) {
          var cleanName = name.slice(0, -2);
          if (!arrayFields[cleanName]) arrayFields[cleanName] = [];
          arrayFields[cleanName].push(value);
        } else {
          allFormData[name] = value;
        }
      }
      var vitalSigns = ["tensi", "nadi", "suhu", "nafas", "tinggi", "berat"];
      for (var j = 0; j < vitalSigns.length; j++) {
        var vs = vitalSigns[j];
        if (!allFormData[vs]) allFormData[vs] = val(vs) || "";
      }
      var base = {
        id_visit: val("id_visit") || allFormData.id_visit || "",
        id_rawat_jalan: val("id_rawat_jalan") || allFormData.id_rawat_jalan || "",
        id_user: allFormData.id_user || "1",
        id_dokter: val("id_dokter") || allFormData.id_dokter || "",
        id_bed: val("id_bed") || allFormData.id_bed || "",
        noregis: val("noregis") || allFormData.noregis || "",
        norm: val("norm") || allFormData.norm || "",
        pasien: val("pasien") || allFormData.pasien || "",
        nama_dokter: allFormData.nama_dokter || "",
        waktu: allFormData.waktu || "",
        diagnosa_rows: extractDiagnosaRows(doc),
        tindakan_rows: extractTindakanRows(doc),
        alergiMakananJSON: allFormData.alergiMakananJSON || "[]",
        alergiLingkunganJSON: allFormData.alergiLingkunganJSON || "[]"
      };
      for (var key in allFormData) {
        if (!(key in base)) {
          base[key] = allFormData[key];
        }
      }
      for (var arrKey in arrayFields) {
        base[arrKey] = arrayFields[arrKey];
      }
      if (base.kode9 && Array.isArray(base.kode9) && base.kode9.length > 0 && (!base.codeProsedur || !Array.isArray(base.codeProsedur))) {
        base.codeProsedur = base.kode9.slice();
      }
      if (!base.jenis_kasus) base.jenis_kasus = "";
      return base;
    }
    function extractDiagnosaRows(doc) {
      var rows = [];
      var idicdInputs = doc.querySelectorAll('input[name="idicd[]"]');
      idicdInputs.forEach(function(inp) {
        var row = inp ? inp.closest("tr") : null;
        if (!row) return;
        var id = inp.value || "";
        var kode = "";
        var nama = "";
        var kasus = "";
        var komp = "";
        var kodeInput = row.querySelector('input[name="kode10[]"]');
        var namaInput = row.querySelector('input[name="nama[]"]');
        var kasusSel = row.querySelector('select[name="kasus_diagnosa[]"]');
        var kompSel = row.querySelector('select[name="komplikasi[]"]');
        if (kodeInput) kode = kodeInput.value;
        if (namaInput) nama = namaInput.value;
        if (kasusSel) kasus = kasusSel.value;
        if (kompSel) komp = kompSel.value;
        rows.push({ idicd: id, kode, nama, kasus_diagnosa: kasus, komplikasi: komp });
      });
      return rows;
    }
    function extractTindakanRows(doc) {
      var rows = [];
      var idicdInputs = doc.querySelectorAll('input[name="idicdTindakan[]"]');
      idicdInputs.forEach(function(inp) {
        var row = inp ? inp.closest("tr") : null;
        if (!row) return;
        var kode9 = (row.querySelector('input[name="kode9[]"]') || {}).value || "";
        rows.push({
          idicdTindakan: inp.value || "",
          kode9,
          namaTindakan: (row.querySelector('input[name="namaTindakan[]"]') || {}).value || "",
          komorbid: (row.querySelector('select[name="komorbid[]"]') || {}).value || "",
          kategoriProsedur: (row.querySelector('select[name="kategoriProsedur[]"]') || {}).value || "",
          snomedProsedur: (row.querySelector('input[name="snomedProsedur[]"]') || {}).value || "",
          codeProsedur: (row.querySelector('input[name="codeProsedur[]"]') || {}).value || kode9
        });
      });
      return rows;
    }
    function buildFormHTML(data) {
      return '<form id="ext-resume-form">' + buildHiddenFields(data) + buildInfoSection(data) + buildClinicalSection(data) + buildDiagnosaSection(data) + buildTindakanSection(data) + buildActionButtons() + "</form>";
    }
    function buildHiddenFields(data) {
      var now = /* @__PURE__ */ new Date();
      var waktu = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0") + " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0");
      var fields = {
        id_visit: data.id_visit,
        id_rawat_jalan: data.id_rawat_jalan,
        id_user: data.id_user,
        id_dokter: data.id_dokter,
        id_bed: data.id_bed,
        noregis: data.noregis,
        norm: data.norm || data.noregis,
        pasien: data.pasien,
        nama_dokter: data.nama_dokter,
        waktu: data.waktu || waktu,
        alergiMakananJSON: data.alergiMakananJSON || "[]",
        alergiLingkunganJSON: data.alergiLingkunganJSON || "[]"
      };
      var html = "";
      for (var key in fields) {
        html += '<input type="hidden" name="' + key + '" value="' + esc(fields[key]) + '">';
      }
      var skipKeys = {
        id_visit: 1,
        id_rawat_jalan: 1,
        id_user: 1,
        id_dokter: 1,
        id_bed: 1,
        noregis: 1,
        norm: 1,
        pasien: 1,
        nama_dokter: 1,
        waktu: 1,
        alergiMakananJSON: 1,
        alergiLingkunganJSON: 1,
        tensi: 1,
        nadi: 1,
        suhu: 1,
        nafas: 1,
        tinggi: 1,
        berat: 1,
        anamnesa: 1,
        pemeriksaan_fisik: 1,
        catatan: 1,
        tindakan: 1,
        terapi_pengobatan: 1,
        composition_diet: 1,
        save: 1
      };
      for (var key in data) {
        if (!skipKeys[key] && typeof data[key] === "string") {
          html += '<input type="hidden" name="' + key + '" value="' + esc(data[key]) + '">';
        }
      }
      return html;
    }
    function buildInfoSection(data) {
      return '<div class="ext-info-box"><div class="ext-info-item"><label>No. RM</label><div class="ext-info-value">' + esc(data.norm) + '</div></div><div class="ext-info-item ext-info-item-wide"><label>Nama Pasien</label><div class="ext-info-value">' + esc(data.pasien) + '</div></div><div class="ext-info-item ext-info-item-wide"><label>Dokter DPJP</label><div class="ext-info-value">' + esc(data.nama_dokter) + "</div></div></div>";
    }
    function buildClinicalSection(data) {
      return '<div class="ext-section"><h3 class="ext-section-title">Data Klinis</h3><div class="ext-clinical-grid">' + buildTextarea("anamnesa", "Anamnesa", data.anamnesa) + buildTextarea("pemeriksaan_fisik", "Pemeriksaan Fisik", data.pemeriksaan_fisik) + buildTextarea("catatan", "Diagnosa (Catatan) *", data.catatan) + buildTextarea("tindakan", "Tindakan", data.tindakan) + buildTextarea("terapi_pengobatan", "Terapi Pengobatan", data.terapi_pengobatan) + '</div><h3 class="ext-section-title" style="margin-top:16px;">Tanda Vital</h3><div class="ext-clinical-grid">' + buildTextInput("tensi", "Tensi (mmHg)", data.tensi) + buildTextInput("nadi", "Nadi (x/menit)", data.nadi) + buildTextInput("suhu", "Suhu (\xB0C)", data.suhu) + buildTextInput("nafas", "Nafas (x/menit)", data.nafas) + buildTextInput("tinggi", "Tinggi Badan (cm)", data.tinggi) + buildTextInput("berat", "Berat Badan (kg)", data.berat) + "</div></div>";
    }
    function buildTextarea(name, label, value) {
      return '<div class="ext-field"><label for="ext-' + name + '">' + esc(label) + '</label><textarea name="' + name + '" id="ext-' + name + '">' + esc(value) + "</textarea></div>";
    }
    function buildTextInput(name, label, value) {
      return '<div class="ext-field"><label for="ext-' + name + '">' + esc(label) + '</label><input type="text" name="' + name + '" id="ext-' + name + '" value="' + esc(value) + '"></div>';
    }
    function buildDiagnosaSection(data) {
      var html = '<div class="ext-section"><div class="ext-section-header"><h3 class="ext-section-title">Diagnosa (ICD-10)</h3><button type="button" id="ext-add-diagnosa" class="ext-btn ext-btn-primary ext-btn-sm">+ Tambah Diagnosa</button></div><table class="ext-table"><thead><tr><th style="width:35%;">Nama Diagnosa</th><th style="width:12%;">Kode ICD-10</th><th style="width:15%;">Kasus</th><th style="width:13%;">Komplikasi</th><th style="width:8%;">Aksi</th></tr></thead><tbody id="ext-diagnosa-tbody">';
      if (data.diagnosa_rows.length > 0) {
        data.diagnosa_rows.forEach(function(row, i) {
          html += buildDiagnosaRowHTML(i, row);
        });
        diagnosaRowCounter = data.diagnosa_rows.length;
      } else {
        html += buildDiagnosaRowHTML(0, { idicd: "", kode: "", nama: "", kasus_diagnosa: "", komplikasi: "" });
        diagnosaRowCounter = 1;
      }
      html += "</tbody></table></div>";
      return html;
    }
    function buildDiagnosaRowHTML(index, data) {
      var kasusOpts = '<option value="">Pilih</option><option value="Kasus Lama">Kasus Lama</option><option value="Kasus Baru">Kasus Baru</option>';
      var kompOpts = '<option value="">Pilih</option><option value="Primer">Primer</option><option value="Komplikasi">Komplikasi</option><option value="Komorbid">Komorbid</option>';
      return '<tr data-row="' + index + '"><td><input type="text" name="nama[]" value="' + esc(data.nama) + '" id="nama' + index + '" class="ext-ac-icd10-nama" placeholder="Cari diagnosa..."></td><td><input type="text" name="kode10[]" value="' + esc(data.kode) + '" id="kode' + index + '" class="ext-ac-icd10-kode" placeholder="Kode ICD-10"></td><input type="hidden" name="idicd[]" value="' + esc(data.idicd) + '" id="idicd' + index + '"><td><select name="kasus_diagnosa[]">' + kasusOpts + '</select></td><td><select name="komplikasi[]">' + kompOpts + '</select></td><td><button type="button" class="ext-rm-row ext-btn-danger">Hapus</button></td></tr>';
    }
    function buildTindakanSection(data) {
      var html = '<div class="ext-section"><div class="ext-section-header"><h3 class="ext-section-title">Tindakan (ICD-9)</h3><button type="button" id="ext-add-tindakan" class="ext-btn ext-btn-primary ext-btn-sm">+ Tambah Tindakan</button></div><table class="ext-table"><thead><tr><th style="width:30%;">Nama Tindakan</th><th style="width:10%;">Kode ICD-9</th><th style="width:12%;">Komorbid</th><th style="width:15%;">Kategori Prosedur</th><th style="width:8%;">Aksi</th></tr></thead><tbody id="ext-tindakan-tbody">';
      if (data.tindakan_rows.length > 0) {
        data.tindakan_rows.forEach(function(row, i) {
          html += buildTindakanRowHTML(i, row);
        });
        tindakanRowCounter = data.tindakan_rows.length;
      } else {
        html += buildTindakanRowHTML(0, { idicdTindakan: "", kode9: "", namaTindakan: "", komorbid: "", kategoriProsedur: "", snomedProsedur: "", codeProsedur: "" });
        tindakanRowCounter = 1;
      }
      html += "</tbody></table></div>";
      return html;
    }
    function buildTindakanRowHTML(index, data) {
      var komorbidOpts = '<option value="">Pilih</option><option value="Primer">Primer</option><option value="Sekunder">Sekunder</option>';
      var kategoriOpts = buildKategoriProsedurOptions();
      return '<tr data-row="' + index + '"><td><input type="text" name="namaTindakan[]" value="' + esc(data.namaTindakan) + '" id="namaTindakan' + index + '" class="ext-ac-icd9-nama" placeholder="Cari tindakan..."></td><td><input type="text" name="kode9[]" value="' + esc(data.kode9) + '" id="kode9' + index + '" class="ext-ac-icd9-kode" placeholder="Kode ICD-9"></td><input type="hidden" name="idicdTindakan[]" value="' + esc(data.idicdTindakan) + '" id="idicdTindakan' + index + '"><input type="hidden" name="snomedProsedur[]" value="' + esc(data.snomedProsedur) + '" id="snomedProsedur' + index + '"><input type="hidden" name="codeProsedur[]" value="' + esc(data.codeProsedur) + '" id="codeProsedur' + index + '"><td><select name="komorbid[]">' + komorbidOpts + '</select></td><td><select name="kategoriProsedur[]" class="ext-kategori-prosedur">' + kategoriOpts + '</select></td><td><button type="button" class="ext-rm-row ext-btn-danger">Hapus</button></td></tr>';
    }
    function buildKategoriProsedurOptions() {
      var opts = [
        { value: "", text: "Pilih Kategori" },
        { value: "1", text: "1 - Prosedur Administrasi" },
        { value: "2", text: "2 - Prosedur Sederhana" },
        { value: "3", text: "3 - Prosedur Sedang" },
        { value: "4", text: "4 - Prosedur Besar" },
        { value: "5", text: "5 - Prosedur Khusus" }
      ];
      return opts.map(function(o) {
        return '<option value="' + o.value + '">' + esc(o.text) + "</option>";
      }).join("");
    }
    function buildActionButtons() {
      return '<div class="ext-actions"><button type="button" id="ext-resume-simpan" class="ext-btn ext-btn-success">Simpan Resume</button><button type="button" id="ext-resume-cancel" class="ext-btn ext-btn-secondary">Tutup</button><span id="ext-resume-status" class="ext-status"></span></div>';
    }
    function bindDynamicRows(root) {
      var addDiag = root.getElementById("ext-add-diagnosa");
      if (addDiag) addDiag.addEventListener("click", function() {
        addDiagnosaRow(root);
      });
      var addTind = root.getElementById("ext-add-tindakan");
      if (addTind) addTind.addEventListener("click", function() {
        addTindakanRow(root);
      });
      root.addEventListener("click", function(e) {
        var btn = e.target.closest(".ext-rm-row");
        if (!btn) return;
        var row = btn.closest("tr");
        if (row) {
          var tbody = row.parentElement;
          row.remove();
          renumberRows(tbody);
        }
      });
    }
    function addDiagnosaRow(root) {
      var tbody = root.getElementById("ext-diagnosa-tbody");
      if (!tbody) return;
      var newRow = buildDiagnosaRowHTML(diagnosaRowCounter, { idicd: "", kode: "", nama: "", kasus_diagnosa: "", komplikasi: "" });
      tbody.insertAdjacentHTML("beforeend", newRow);
      diagnosaRowCounter++;
      initNewRowAutocomplete(tbody, "icd10");
    }
    function addTindakanRow(root) {
      var tbody = root.getElementById("ext-tindakan-tbody");
      if (!tbody) return;
      var newRow = buildTindakanRowHTML(tindakanRowCounter, { idicdTindakan: "", kode9: "", namaTindakan: "", komorbid: "", kategoriProsedur: "", snomedProsedur: "", codeProsedur: "" });
      tbody.insertAdjacentHTML("beforeend", newRow);
      tindakanRowCounter++;
      initNewRowAutocomplete(tbody, "icd9");
    }
    function initNewRowAutocomplete(tbody, type) {
      var lastRow = tbody.querySelector("tr:last-child");
      if (!lastRow) return;
      if (type === "icd10") {
        var namaInput = lastRow.querySelector(".ext-ac-icd10-nama");
        var kodeInput = lastRow.querySelector(".ext-ac-icd10-kode");
        if (namaInput) setupAcInput(namaInput, AUTOCOMPLETE_URLS.icd10, function(item, input) {
          var row = input.closest("tr");
          if (!row) return;
          row.querySelector('input[name="idicd[]"]').value = item.ID;
          row.querySelector('input[name="kode10[]"]').value = item.KODE;
          input.value = item.NAMA;
          input.style.borderColor = "#22c55e";
        });
        if (kodeInput) setupAcInput(kodeInput, AUTOCOMPLETE_URLS.icd10, function(item, input) {
          var row = input.closest("tr");
          if (!row) return;
          row.querySelector('input[name="idicd[]"]').value = item.ID;
          row.querySelector('input[name="nama[]"]').value = item.NAMA;
          input.value = item.KODE;
          input.style.borderColor = "#22c55e";
        });
      } else {
        var namaInput = lastRow.querySelector(".ext-ac-icd9-nama");
        var kodeInput = lastRow.querySelector(".ext-ac-icd9-kode");
        if (namaInput) setupAcInput(namaInput, AUTOCOMPLETE_URLS.icd9, function(item, input) {
          var row = input.closest("tr");
          if (!row) return;
          row.querySelector('input[name="idicdTindakan[]"]').value = item.ID;
          row.querySelector('input[name="kode9[]"]').value = item.KODE;
          var cpInp = row.querySelector('input[name="codeProsedur[]"]');
          if (cpInp) cpInp.value = item.KODE;
          input.value = item.NAMA;
          input.style.borderColor = "#22c55e";
        });
        if (kodeInput) setupAcInput(kodeInput, AUTOCOMPLETE_URLS.icd9, function(item, input) {
          var row = input.closest("tr");
          if (!row) return;
          row.querySelector('input[name="idicdTindakan[]"]').value = item.ID;
          row.querySelector('input[name="namaTindakan[]"]').value = item.NAMA;
          input.value = item.KODE;
          input.style.borderColor = "#22c55e";
        });
      }
    }
    function renumberRows(tbody) {
      var rows = tbody.querySelectorAll("tr");
      rows.forEach(function(row, i) {
        row.setAttribute("data-row", i);
      });
    }
    function bindSimpan(root) {
      if (simpanBound) return;
      simpanBound = true;
      var simpanBtn = root.getElementById("ext-resume-simpan");
      if (!simpanBtn) return;
      simpanBtn.addEventListener("click", function() {
        if (!validateForm()) return;
        var btn = this;
        btn.textContent = "Menyimpan...";
        btn.disabled = true;
        btn.style.opacity = "0.6";
        var form = root.getElementById("ext-resume-form");
        doSave(btn, form);
      });
    }
    function serializeForm(form) {
      var nameToElements = {};
      var inputs = form.querySelectorAll("input, select, textarea");
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (!el.name) continue;
        if (el.type === "checkbox" || el.type === "radio") {
          if (!el.checked) continue;
        }
        if (!nameToElements[el.name]) nameToElements[el.name] = [];
        nameToElements[el.name].push(el);
      }
      var pairs = [];
      for (var name in nameToElements) {
        var elements = nameToElements[name];
        if (name.endsWith("[]") || elements.length > 1) {
          for (var j = 0; j < elements.length; j++) {
            pairs.push([name, elements[j].value || ""]);
          }
        } else {
          pairs.push([name, elements[0].value || ""]);
        }
      }
      pairs.push(["save", "Simpan"]);
      return pairs;
    }
    function validatePayload(pairs) {
      var errors = [];
      var grouped = {};
      for (var i = 0; i < pairs.length; i++) {
        var name = pairs[i][0];
        if (!grouped[name]) grouped[name] = [];
        grouped[name].push(pairs[i][1]);
      }
      var kode10 = grouped["kode10[]"] || [];
      var kode9 = grouped["kode9[]"] || [];
      var namaTindakan = grouped["namaTindakan[]"] || [];
      var codeProsedur = grouped["codeProsedur[]"] || [];
      var kategoriProsedur = grouped["kategoriProsedur[]"] || [];
      if (kode10.length === 0) errors.push("Minimal 1 ICD-10 harus dipilih");
      for (var i = 0; i < kode9.length; i++) {
        var num = i + 1;
        if (!kode9[i]) continue;
        if (!namaTindakan[i]) errors.push("Tindakan #" + num + ": Nama tindakan kosong");
        if (!codeProsedur[i]) errors.push("Tindakan #" + num + ": codeProsedur belum terisi");
        if (!kategoriProsedur[i]) errors.push("Tindakan #" + num + ": kategoriProsedur belum terisi");
      }
      return errors;
    }
    function doSave(btn, form) {
      var pairs = serializeForm(form);
      var validationErrors = validatePayload(pairs);
      if (validationErrors.length > 0) {
        var msg = "Validasi gagal:\n\n" + validationErrors.join("\n");
        console.warn("[ResumeTab] " + msg);
        alert(msg);
        btn.textContent = btn.getAttribute("data-orig") || "Simpan";
        btn.disabled = false;
        return Promise.resolve();
      }
      var body = "";
      for (var i = 0; i < pairs.length; i++) {
        if (body) body += "&";
        body += encodeURIComponent(pairs[i][0]) + "=" + encodeURIComponent(pairs[i][1]);
      }
      console.log("[ResumeTab] POST body length:", body.length, "pairs:", pairs.length);
      console.log("[ResumeTab] POST to:", ENDPOINT);
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "same-origin"
      }).then(function(r) {
        console.log("[ResumeTab] Response status:", r.status, "redirected:", r.redirected, "finalURL:", r.url);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text().then(function(text) {
          return { url: r.url, text };
        });
      }).then(function(res) {
        var snippet = res.text.substring(0, 600);
        console.log("[ResumeTab] Response length:", res.text.length, "url:", res.url, "preview:", snippet);
        if (res.url.includes("msg=1") || res.text.includes("msg=1") || res.text.includes("Berhasil disimpan")) {
          afterSaveSuccess(btn);
          return;
        }
        var tmp = document.createElement("div");
        tmp.innerHTML = res.text;
        var errEl = tmp.querySelector(".alert-error, .alert-danger, .error-message, .flash-error, .alert.alert-danger");
        if (errEl) {
          throw new Error("Server: " + (errEl.textContent || "").trim().substring(0, 200));
        }
        var hasForm = res.text.includes("rm-rawat-jalan-new") || res.text.includes('id="save"');
        if (hasForm) {
          tmp.querySelectorAll("input, select, textarea").forEach(function(el) {
            if (el.name && !el.name.match(/^id_/) || el.id === "waktu") {
              console.log("[ResumeTab] Form field:", el.name || el.id, "=", el.value);
            }
          });
          throw new Error("Form kembali ke input (validasi server gagal)");
        }
        throw new Error("Respon tidak mengandung msg=1");
      }).catch(function(e) {
        afterSaveError(btn, e.message);
      });
    }
    function afterSaveSuccess(btn) {
      btn.textContent = "Simpan Resume";
      btn.disabled = false;
      btn.style.opacity = "1";
      showStatus("Berhasil disimpan!", "success");
      setTimeout(function() {
        if (typeof loadContent === "function") {
          loadContent(
            window.location.origin + "/v2/m-klaim/partials/div-resume?id_visit=" + getIdVisit() + "&jenis_kunjungan=1",
            "resume-view"
          );
        }
      }, 1500);
    }
    function afterSaveError(btn, msg) {
      btn.textContent = "Simpan Resume";
      btn.disabled = false;
      btn.style.opacity = "1";
      showStatus("Gagal menyimpan. " + msg, "error");
    }
    function validateForm() {
      var errors = [];
      var root = extRoot;
      if (!root) return false;
      var form = root.getElementById("ext-resume-form");
      if (!form) {
        showStatus("Form resume belum siap.", "error");
        return false;
      }
      var norm = form.querySelector('input[name="norm"]');
      if (!norm || !norm.value.trim()) errors.push("No. RM harus diisi");
      var pasien = form.querySelector('input[name="pasien"]');
      if (!pasien || !pasien.value.trim()) errors.push("Nama Pasien harus diisi");
      var idVisit = form.querySelector('input[name="id_visit"]');
      if (!idVisit || !idVisit.value.trim()) errors.push("Data kunjungan tidak valid");
      var catatan = form.querySelector("#ext-catatan");
      if (catatan && !catatan.value.trim()) {
        errors.push("Diagnosa (Catatan) harus diisi");
        catatan.style.borderColor = "#ef4444";
      } else if (catatan) {
        catatan.style.borderColor = "#cbd5e1";
      }
      var idicdInputs = form.querySelectorAll('input[name="idicd[]"]');
      idicdInputs.forEach(function(inp) {
        if (!inp.value.trim()) {
          var row = inp.closest("tr");
          if (row) {
            var namaInput = row.querySelector('input[name="nama[]"]');
            if (namaInput && namaInput.value.trim()) {
              errors.push('Diagnosa "' + namaInput.value.trim().substring(0, 30) + '..." belum dipilih dari autocomplete');
              namaInput.style.borderColor = "#ef4444";
            }
          }
        }
      });
      var idicdTindakanInputs = form.querySelectorAll('input[name="idicdTindakan[]"]');
      idicdTindakanInputs.forEach(function(inp) {
        if (!inp.value.trim()) {
          var row = inp.closest("tr");
          if (row) {
            var namaInput = row.querySelector('input[name="namaTindakan[]"]');
            if (namaInput && namaInput.value.trim()) {
              errors.push('Tindakan "' + namaInput.value.trim().substring(0, 30) + '..." belum dipilih dari autocomplete');
              namaInput.style.borderColor = "#ef4444";
            }
          }
        }
      });
      if (errors.length > 0) {
        showStatus("Validasi Gagal: " + errors[0] + (errors.length > 1 ? " (+" + (errors.length - 1) + " lagi)" : ""), "error");
        return false;
      }
      return true;
    }
    function showStatus(msg, type) {
      var root = extRoot;
      if (!root) return;
      var status = root.getElementById("ext-resume-status");
      if (!status) return;
      status.style.display = "inline-block";
      status.textContent = msg;
      status.style.background = type === "success" ? "#dcfce7" : "#fef2f2";
      status.style.color = type === "success" ? "#166534" : "#991b1b";
      status.style.borderLeft = "4px solid " + (type === "success" ? "#22c55e" : "#ef4444");
      setTimeout(function() {
        status.style.display = "none";
      }, 5e3);
    }
    function bindCancel(root) {
      var cancelBtn = root.getElementById("ext-resume-cancel");
      if (cancelBtn) cancelBtn.addEventListener("click", function() {
        closeOverlay();
      });
    }
    function esc(str) {
      if (!str) return "";
      var d = document.createElement("div");
      d.textContent = str;
      return d.innerHTML;
    }
    function injectPrintCSS() {
      if (document.getElementById("ext-print-css")) return;
      var s = document.createElement("style");
      s.id = "ext-print-css";
      s.textContent = "@media print { .ext-ac-global-menu { display: none !important; } }";
      document.head.appendChild(s);
    }
    function createAcMenus() {
      acMenuIcd10 = createAcMenu();
      acMenuIcd9 = createAcMenu();
    }
    function createAcMenu() {
      var el = document.createElement("div");
      el.className = "ext-ac-global-menu";
      el.style.cssText = 'position:fixed;z-index:2147483647;display:none;background:#fff;border:1px solid #cbd5e1;border-radius:6px;max-height:200px;overflow-y:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.15);min-width:200px;';
      document.body.appendChild(el);
      return el;
    }
    function hideAcMenu() {
      if (acMenuIcd10) acMenuIcd10.style.display = "none";
      if (acMenuIcd9) acMenuIcd9.style.display = "none";
      acActiveInput = null;
      acActiveCallback = null;
    }
    function setupAcInput(input, url, onSelect) {
      if (input.getAttribute("data-ext-ac-init")) return;
      input.setAttribute("data-ext-ac-init", "1");
      var isIcd10 = input.classList.contains("ext-ac-icd10-nama") || input.classList.contains("ext-ac-icd10-kode");
      var menu = isIcd10 ? acMenuIcd10 : acMenuIcd9;
      input.addEventListener("input", function() {
        var val = input.value.trim();
        if (val.length < 2) {
          menu.style.display = "none";
          return;
        }
        fetch(url + "&q=" + encodeURIComponent(val), { credentials: "same-origin" }).then(function(r) {
          return r.json();
        }).then(function(data) {
          menu.innerHTML = "";
          if (!data || data.length === 0) {
            menu.style.display = "none";
            return;
          }
          data.forEach(function(item) {
            var li = document.createElement("div");
            li.className = "ext-ac-item";
            li.innerHTML = "<b>" + esc(item.NAMA) + '</b> <span class="ext-ac-kode">(' + esc(item.KODE) + ")</span>";
            li.addEventListener("mousedown", function(e) {
              e.preventDefault();
              onSelect(item, input);
              menu.style.display = "none";
            });
            menu.appendChild(li);
          });
          var rect = input.getBoundingClientRect();
          menu.style.left = rect.left + "px";
          menu.style.top = rect.bottom + 2 + "px";
          menu.style.minWidth = Math.max(rect.width, 200) + "px";
          menu.style.display = "block";
        }).catch(function() {
          menu.style.display = "none";
        });
      });
      input.addEventListener("blur", function() {
        setTimeout(function() {
          menu.style.display = "none";
        }, 250);
      });
      input.addEventListener("focus", function() {
        if (menu.children.length > 0) {
          var rect = input.getBoundingClientRect();
          menu.style.left = rect.left + "px";
          menu.style.top = rect.bottom + 2 + "px";
          menu.style.display = "block";
        }
      });
    }
    function initAutocompleteFields(root) {
      root.querySelectorAll(".ext-ac-icd10-nama, .ext-ac-icd10-kode").forEach(function(input) {
        var isKode = input.classList.contains("ext-ac-icd10-kode");
        setupAcInput(input, AUTOCOMPLETE_URLS.icd10, function(item, inp) {
          var row = inp.closest("tr");
          if (!row) return;
          row.querySelector('input[name="idicd[]"]').value = item.ID;
          if (isKode) {
            row.querySelector('input[name="nama[]"]').value = item.NAMA;
            inp.value = item.KODE;
          } else {
            row.querySelector('input[name="kode10[]"]').value = item.KODE;
            inp.value = item.NAMA;
          }
          inp.style.borderColor = "#22c55e";
        });
      });
      root.querySelectorAll(".ext-ac-icd9-nama, .ext-ac-icd9-kode").forEach(function(input) {
        var isKode = input.classList.contains("ext-ac-icd9-kode");
        setupAcInput(input, AUTOCOMPLETE_URLS.icd9, function(item, inp) {
          var row = inp.closest("tr");
          if (!row) return;
          row.querySelector('input[name="idicdTindakan[]"]').value = item.ID;
          if (isKode) {
            row.querySelector('input[name="namaTindakan[]"]').value = item.NAMA;
            inp.value = item.KODE;
          } else {
            row.querySelector('input[name="kode9[]"]').value = item.KODE;
            inp.value = item.NAMA;
          }
          var cpInp2 = row.querySelector('input[name="codeProsedur[]"]');
          if (cpInp2) cpInp2.value = item.KODE;
          inp.style.borderColor = "#22c55e";
        });
      });
    }
    function getShadowHTML() {
      return '<div class="ext-root"><button id="ext-floating-btn" class="ext-float-btn" title="Resume Rajal">RJ</button><div class="ext-overlay"><div class="ext-backdrop"></div><div class="ext-panel"><div class="ext-panel-header"><span class="ext-panel-title">Resume Rajal</span><button id="ext-overlay-close" class="ext-close-btn">&times;</button></div><div class="ext-panel-body" id="ext-resume-content"><div class="ext-loading"><div class="ext-spinner"></div><p>Klik tombol RJ untuk memuat form resume...</p></div></div></div></div></div>';
    }
    function getShadowCSS() {
      return '<style>.ext-root { all: initial; display: block; }.ext-float-btn {position: fixed; right: 16px; top: 50%; transform: translateY(-50%);z-index: 2147483647; width: 48px; height: 48px; border-radius: 50%;background: linear-gradient(135deg,#0ea5e9,#0284c7); color: #fff;border: none; font-size: 16px; font-weight: 700; cursor: pointer;box-shadow: 0 4px 16px rgba(14,165,233,.4);font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;transition: transform .2s, box-shadow .2s;}.ext-float-btn:hover { transform: translateY(-50%) scale(1.1); box-shadow: 0 6px 24px rgba(14,165,233,.5); }.ext-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%;z-index: 2147483646; display: none;align-items: center; justify-content: center;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;}.ext-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.4); }.ext-panel {position: relative; width: 800px; max-width: 94vw; max-height: 90vh;background: #fff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.3);display: flex; flex-direction: column; overflow: hidden;}.ext-panel-header {display: flex; align-items: center; justify-content: space-between;padding: 14px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;}.ext-panel-title { font-size: 16px; font-weight: 700; color: #0c4a6e; }.ext-close-btn {background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer;padding: 0 4px; line-height: 1;}.ext-close-btn:hover { color: #475569; }.ext-panel-body {padding: 20px; overflow-y: auto; flex: 1;font-size: 14px; color: #1e293b;}.ext-loading { text-align: center; padding: 60px 20px; color: #6b7280; }.ext-spinner {display: inline-block; width: 36px; height: 36px;border: 3px solid #e5e7eb; border-top-color: #0ea5e9; border-radius: 50%;animation: ext-spin .8s linear infinite;}.ext-error { text-align: center; padding: 40px 20px; }.ext-error-title { font-size: 16px; font-weight: 600; color: #dc2626; margin: 0 0 8px; }.ext-info-box {display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px;padding: 14px 16px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;}.ext-info-item { flex: 1; min-width: 140px; }.ext-info-item-wide { flex: 2; min-width: 200px; }.ext-info-item label { font-weight: 600; color: #0c4a6e; font-size: 11px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }.ext-info-value { padding: 6px 10px; background: #fff; border-radius: 4px; font-size: 13px; border: 1px solid #bae6fd; }.ext-section { margin-bottom: 18px; }.ext-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }.ext-section-title { color: #0369a1; font-size: 14px; margin: 0; padding-bottom: 6px; border-bottom: 2px solid #e0f2fe; }.ext-clinical-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }.ext-field { grid-column: span 1; }.ext-field label { font-weight: 600; color: #334155; font-size: 11px; display: block; margin-bottom: 3px; }.ext-field textarea {width: 100%; min-height: 64px; padding: 7px 9px;border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;resize: vertical; font-family: inherit; box-sizing: border-box;}.ext-field textarea:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.15); }.ext-table { width: 100%; border-collapse: collapse; font-size: 13px; }.ext-table th { padding: 7px 8px; text-align: left; border: 1px solid #e2e8f0; background: #f0f9ff; font-weight: 600; color: #0c4a6e; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }.ext-table td { padding: 5px 6px; border: 1px solid #e2e8f0; }.ext-table input, .ext-table select {width: 100%; padding: 4px 7px; border: 1px solid #cbd5e1; border-radius: 4px;font-size: 13px; box-sizing: border-box; font-family: inherit;}.ext-table input:focus, .ext-table select:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.15); }.ext-actions {display: flex; gap: 10px; margin-top: 18px; padding-top: 14px;border-top: 2px solid #e2e8f0; align-items: center;}.ext-btn {padding: 9px 24px; border: none; border-radius: 6px; font-size: 13px;font-weight: 600; cursor: pointer; font-family: inherit;transition: opacity .2s, background .2s;}.ext-btn:disabled { opacity: .5; cursor: not-allowed; }.ext-btn-success { background: #16a34a; color: #fff; }.ext-btn-success:hover:not(:disabled) { background: #15803d; }.ext-btn-secondary { background: #6b7280; color: #fff; }.ext-btn-secondary:hover:not(:disabled) { background: #4b5563; }.ext-btn-primary { background: #0ea5e9; color: #fff; }.ext-btn-primary:hover:not(:disabled) { background: #0284c7; }.ext-btn-danger { background: #ef4444; color: #fff; }.ext-btn-sm { padding: 5px 12px; font-size: 12px; }.ext-status { display: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }.ext-ac-item {padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f4f6;transition: background .15s;}.ext-ac-item:hover { background: #f0f9ff; }.ext-ac-kode { color: #6b7280; }@keyframes ext-spin { to { transform: rotate(360deg); } }@media print {  .ext-float-btn, .ext-overlay { display: none !important; }}</style>';
    }
    console.log("[ResumeTab] Module loaded, waiting for attribute");
  })();
})();
//# sourceMappingURL=resumeTab.js.map
