"use strict";
var __morbis_feature = (() => {
  // src/features/resumeValidator.ts
  (function() {
    const MAX_WAIT = 100;
    let waited = 0;
    const check = setInterval(function() {
      waited++;
      const enabled = document.documentElement.getAttribute("data-ext-resume-validator");
      if (enabled !== null) {
        clearInterval(check);
        if (enabled !== "1") return;
        waitForForm();
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function waitForForm() {
      if (!window.location.pathname.includes("/tambah-resume-ri")) return;
      const poll = setInterval(function() {
        const saveBtn = document.getElementById("save");
        const form = document.querySelector('form[action*="rawat-inap-resume"]');
        if (saveBtn && form) {
          clearInterval(poll);
          init(form, saveBtn);
        }
      }, 200);
    }
    function init(form, saveBtn) {
      injectStyle();
      setupCekForm(form);
      setupAutoClearHandlers();
      restoreDraft();
      setupAutosave(form);
      optimizeVitalInputs();
      optimizeBloodPressure();
      addRequiredAttributes();
      preventEnterSubmit();
      autoExpandTextareas();
      setupColorIndicators();
      setupAutoFormatICD();
      setupUnsavedWarning(form);
      checkAndLockForm(form, saveBtn);
      setupUnifiedSaveHandler(saveBtn, form);
    }
    function injectStyle() {
      if (document.getElementById("ext-rv-css")) return;
      const s = document.createElement("style");
      s.id = "ext-rv-css";
      s.textContent = [
        ".ext-rv-error { border: 2px solid #dc2626 !important; background: #fef2f2 !important; transition: all 0.2s; }",
        ".ext-rv-toast { position: fixed; top: 20px; right: 20px; z-index: 99999; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.15); max-width: 420px; line-height: 1.5; }",
        ".ext-rv-toast-error { background: #fef2f2; color: #991b1b; border-left: 5px solid #dc2626; }",
        ".ext-rv-toast-success { background: #f0fdf4; color: #065f46; border-left: 5px solid #16a34a; }",
        ".ext-rv-locked { background: #f0f0f0 !important; cursor: not-allowed; opacity: 0.8; }",
        ".ext-rv-save-disabled { opacity: 0.5; pointer-events: none; }",
        ".ext-rv-icd-valid { border: 2px solid #4caf50 !important; background: #e8f5e9 !important; }",
        ".ext-rv-icd-invalid { border: 2px solid #f44336 !important; background: #ffebee !important; }"
      ].join("\n");
      document.head.appendChild(s);
    }
    function setupCekForm(form) {
      const w = window;
      w.cekForm = function() {
        return runValidation();
      };
      if (form.onsubmit !== null) {
        form.onsubmit = function(e) {
          const result = runValidation();
          if (!result && e) {
            e.preventDefault();
          }
          return result;
        };
      }
      const $2 = w.jQuery;
      if ($2) {
        $2(form).on("submit", function(e) {
          if (!runValidation()) {
            e.preventDefault();
            return false;
          }
          return true;
        });
      }
      var origSubmit = form.submit.bind(form);
      form.submit = function() {
        if (!runValidation()) return;
        _dirty = false;
        try {
          localStorage.removeItem(getDraftKey());
        } catch (_e) {
        }
        origSubmit();
      };
    }
    const DRAFT_PREFIX = "ext_draft_resume_";
    function getDraftKey() {
      const visitId = val("id_visit");
      return DRAFT_PREFIX + (visitId || "unknown");
    }
    var _debounceTimer = null;
    var DEBOUNCE_MS = 2e3;
    function debounce(fn, delay) {
      return function() {
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(fn, delay);
      };
    }
    function setupAutosave(form) {
      if (hasIdResume()) return;
      var doSave = function() {
        saveDraft(form);
      };
      var inputs = form.querySelectorAll(
        "input, textarea, select"
      );
      inputs.forEach(function(el) {
        el.addEventListener("change", debounce(doSave, DEBOUNCE_MS));
        el.addEventListener("input", debounce(doSave, DEBOUNCE_MS));
      });
      setInterval(doSave, 3e4);
    }
    function saveDraft(form) {
      const key = getDraftKey();
      const data = new FormData(form);
      const obj = {};
      data.forEach(function(value, name) {
        obj[name] = value.toString();
      });
      obj._saved_at = Date.now().toString();
      try {
        localStorage.setItem(key, JSON.stringify(obj));
      } catch (_e) {
      }
    }
    function restoreDraft() {
      if (hasIdResume()) return;
      const key = getDraftKey();
      let raw = null;
      try {
        raw = localStorage.getItem(key);
      } catch (_e) {
        return;
      }
      if (!raw) return;
      let draft;
      try {
        draft = JSON.parse(raw);
      } catch (_e) {
        return;
      }
      const w = window;
      const swal = typeof w.swal === "function" ? w.swal : null;
      const ok = function() {
        for (const name in draft) {
          if (name === "_saved_at") continue;
          const el = document.querySelector(
            '[name="' + name + '"]'
          );
          if (el && !el.value) {
            el.value = draft[name];
          }
        }
        try {
          localStorage.removeItem(key);
        } catch (_e) {
        }
      };
      if (swal) {
        swal({
          title: "Draft Ditemukan",
          text: "Data draft sebelumnya ditemukan. Pulihkan?",
          icon: "info",
          buttons: ["Hapus", "Pulihkan"],
          closeOnClickOutside: false
        }).then(function(restore) {
          if (restore) ok();
          else {
            try {
              localStorage.removeItem(key);
            } catch (_e) {
            }
          }
        });
      } else {
        ok();
      }
    }
    function hasIdResume() {
      const el = document.getElementById("id_resume_inap");
      return !!el && !!el.value;
    }
    function checkAndLockForm(form, saveBtn) {
      if (!hasIdResume()) return;
      const fields = form.querySelectorAll(
        "input, textarea, select"
      );
      fields.forEach(function(el) {
        if (el.id === "save" || el.type === "button" || el.type === "submit") return;
        if (el.tagName === "SELECT") {
          el.disabled = true;
        } else {
          el.readOnly = true;
        }
        el.classList.add("ext-rv-locked");
      });
      saveBtn.textContent = "Data Terkunci (Sudah Tersimpan)";
      saveBtn.value = "Data Terkunci (Sudah Tersimpan)";
      const unlock = function() {
        fields.forEach(function(el) {
          if (el.id === "save" || el.type === "button" || el.type === "submit") return;
          el.disabled = false;
          el.readOnly = false;
          el.classList.remove("ext-rv-locked");
        });
        saveBtn.textContent = "Simpan Perubahan";
        saveBtn.value = "Simpan Perubahan";
        attachSaveHandler(saveBtn, form);
      };
      saveBtn.onclick = function(e) {
        e.preventDefault();
        const w = window;
        const swal = typeof w.swal === "function" ? w.swal : null;
        const ask = function() {
          if (swal) {
            swal({
              title: "Buka Kunci?",
              text: "Data sudah tersimpan. Buka kunci untuk mengedit?",
              icon: "warning",
              buttons: ["Batal", "Ya, Buka"],
              closeOnClickOutside: false
            }).then(function(yes) {
              if (yes) {
                unlock();
                swal({ title: "Siap Edit", text: "Field sudah bisa diedit. Klik Simpan Perubahan jika selesai.", icon: "success", timer: 2e3 });
              }
            });
          } else {
            if (confirm("Data sudah tersimpan. Buka kunci untuk mengedit?")) {
              unlock();
            }
          }
        };
        ask();
      };
    }
    function setupUnifiedSaveHandler(saveBtn, form) {
      if (hasIdResume()) return;
      attachSaveHandler(saveBtn, form);
    }
    function attachSaveHandler(saveBtn, form) {
      saveBtn.onclick = function(e) {
        if (!runValidation()) {
          e.preventDefault();
          return false;
        }
        saveBtn.classList.add("ext-rv-save-disabled");
        saveBtn.textContent = "Mengecek Koneksi...";
        saveBtn.value = "Mengecek Koneksi...";
        checkSession().then(function(active) {
          if (!active) {
            saveBtn.classList.remove("ext-rv-save-disabled");
            saveBtn.textContent = "Simpan (Login Ulang Dulu)";
            saveBtn.value = "Simpan (Login Ulang Dulu)";
            const w = window;
            if (typeof w.swal === "function") {
              w.swal({
                title: "Sesi Habis",
                text: "Jangan tutup halaman ini! Buka tab baru, login kembali, lalu klik Simpan lagi.",
                icon: "error",
                buttons: { confirm: { text: "OK, Saya Login Dulu", className: "btn btn-danger" } },
                closeOnClickOutside: false
              });
            } else {
              alert("Sesi habis! Buka tab baru, login kembali, lalu klik Simpan lagi.");
            }
            return;
          }
          try {
            localStorage.removeItem(getDraftKey());
          } catch (_e) {
          }
          saveBtn.textContent = "Menyimpan...";
          saveBtn.value = "Menyimpan...";
          form.submit();
        });
        e.preventDefault();
      };
    }
    async function checkSession() {
      try {
        const resp = await fetch("/admisi/search?opsi=norm_rekam_medik&q=1", {
          method: "HEAD",
          cache: "no-store"
        });
        if (resp.redirected || resp.status === 401 || resp.status === 403) return false;
        return true;
      } catch (_e) {
        return false;
      }
    }
    let _dirty = false;
    function setupUnsavedWarning(form) {
      var inputs = form.querySelectorAll(
        "input, textarea, select"
      );
      inputs.forEach(function(el) {
        el.addEventListener("change", function() {
          _dirty = true;
        });
        el.addEventListener("input", function() {
          _dirty = true;
        });
      });
      form.addEventListener("submit", function() {
        _dirty = false;
      });
      window.addEventListener("beforeunload", function(e) {
        if (!_dirty) return;
        e.preventDefault();
        e.returnValue = "Data yang belum disimpan akan hilang.";
        return e.returnValue;
      });
    }
    function optimizeVitalInputs() {
      const fields = [
        { id: "suhu_pulang", min: 30, max: 45, step: 0.1 },
        { id: "suhu", min: 30, max: 45, step: 0.1 },
        { id: "nadi_pulang", min: 20, max: 250, step: 1 },
        { id: "nadi", min: 20, max: 250, step: 1 },
        { id: "rr_pulang", min: 4, max: 80, step: 1 },
        { id: "nafas", min: 4, max: 80, step: 1 },
        { id: "spo2_pulang", min: 50, max: 100, step: 1 },
        { id: "spo2", min: 50, max: 100, step: 1 },
        { id: "gcs_e", min: 1, max: 4, step: 1 },
        { id: "gcs_m", min: 1, max: 6, step: 1 },
        { id: "gcs_v", min: 1, max: 5, step: 1 },
        { id: "berat", min: 1, max: 500, step: 0.1 }
      ];
      fields.forEach(function(f) {
        var el = document.getElementById(f.id);
        if (!el) return;
        el.type = "number";
        el.min = String(f.min);
        el.max = String(f.max);
        el.step = String(f.step);
        if (!el.placeholder) {
          el.placeholder = f.min + "-" + f.max;
        }
      });
    }
    function optimizeBloodPressure() {
      var ids = ["td_pulang", "td", "tensi", "tensi_pulang"];
      ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.placeholder = "120/80";
        el.pattern = "[0-9]{2,3}/[0-9]{2,3}";
        el.title = "Format: angka/angka (Contoh: 120/80)";
      });
    }
    function addRequiredAttributes() {
      var ids = [
        "alasan_rawat",
        "anamnesa",
        "diagnosa_primary",
        "kode_diagnosa_utama",
        "jenis_kasus",
        "keadaan_keluar",
        "cara_keluar",
        "tgl_keluar2"
      ];
      ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.required = true;
      });
    }
    function preventEnterSubmit() {
      document.querySelectorAll('input:not([type="submit"]):not([type="button"])').forEach(function(el) {
        el.addEventListener("keydown", function(e) {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        });
      });
    }
    function autoExpandTextareas() {
      document.querySelectorAll("textarea").forEach(function(el) {
        el.style.overflow = "hidden";
        el.style.resize = "vertical";
        el.addEventListener("input", function() {
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
        });
      });
    }
    function setupColorIndicators() {
      var icd10Fields = buildICD10Fields();
      var icd9Fields = buildICD9Fields();
      icd10Fields.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", function() {
          var v = el.value.trim();
          el.classList.remove("ext-rv-icd-valid", "ext-rv-icd-invalid");
          if (v === "") return;
          if (/^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/i.test(v)) {
            el.classList.add("ext-rv-icd-valid");
          } else {
            el.classList.add("ext-rv-icd-invalid");
          }
        });
      });
      icd9Fields.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", function() {
          var v = el.value.trim();
          el.classList.remove("ext-rv-icd-valid", "ext-rv-icd-invalid");
          if (v === "") return;
          if (/^[0-9]{2}(\.[0-9]{1,2})?$/.test(v)) {
            el.classList.add("ext-rv-icd-valid");
          } else {
            el.classList.add("ext-rv-icd-invalid");
          }
        });
      });
    }
    function setupAutoFormatICD() {
      var icd10Fields = buildICD10Fields();
      icd10Fields.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("blur", function() {
          var v = el.value.trim().toUpperCase();
          if (!v) return;
          v = v.replace(".", "");
          if (v.length > 3) {
            v = v.substring(0, 3) + "." + v.substring(3);
          }
          el.value = v;
          el.dispatchEvent(new Event("input"));
        });
      });
      var icd9Fields = buildICD9Fields();
      icd9Fields.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("blur", function() {
          var v = el.value.trim();
          if (!v) return;
          v = v.replace(".", "");
          if (v.length > 2) {
            v = v.substring(0, 2) + "." + v.substring(2);
          }
          el.value = v;
          el.dispatchEvent(new Event("input"));
        });
      });
    }
    function runValidation() {
      clearErrors();
      var errs = [];
      function fail(ok, msg, id) {
        if (!ok) errs.push({ msg, id });
      }
      fail(!!val("norm"), "No. RM harus diisi", "norm");
      fail(!!val("pasien"), "Nama pasien harus diisi", "pasien");
      fail(!!val("id_visit"), "Data kunjungan tidak valid", "pasien");
      fail(!!val("alasan_rawat"), "Alasan rawat harus diisi", "alasan_rawat");
      fail(!!val("anamnesa"), "Anamnesa harus diisi", "anamnesa");
      fail(!!val("diagnosa_primary"), "Diagnosa primary harus diisi", "diagnosa_primary");
      fail(!!val("terapi_pengobatan"), "Terapi/pengobatan harus diisi", "terapi_pengobatan");
      fail(!!val("kode_diagnosa_utama"), "Kode ICD-10 Diagnosa Utama harus diisi", "kode_diagnosa_utama");
      if (val("kode_diagnosa_utama")) fail(isICD10(val("kode_diagnosa_utama")), "Format kode ICD-10 Diagnosa Utama tidak valid (contoh: A00, B20.9)", "kode_diagnosa_utama");
      if (val("diagnosa_utama")) fail(!!val("id_diagnosa_utama"), "Diagnosa Utama harus dipilih dari hasil pencarian (autocomplete)", "diagnosa_utama");
      for (var si = 1; si <= 10; si++) {
        var kDS = val("kode_diagnosa_sekunder" + si);
        var nDS = val("diagnosa_sekunder" + si);
        var iDS = val("id_diagnosa_sekunder" + si);
        if (kDS) fail(isICD10(kDS), "Format kode ICD-10 Diagnosa Sekunder " + si + " tidak valid", "kode_diagnosa_sekunder" + si);
        if (nDS) fail(!!iDS, "Diagnosa Sekunder " + si + " harus dipilih dari hasil pencarian", "diagnosa_sekunder" + si);
      }
      for (var ti = 1; ti <= 10; ti++) {
        var kTK = val("kode_tindakan" + ti);
        var nTK = val("tindakan" + ti);
        var iTK = val("id_tindakan" + ti);
        if (kTK) fail(isICD9(kTK), "Format kode ICD-9 Tindakan " + ti + " tidak valid (contoh: 45.16)", "kode_tindakan" + ti);
        if (nTK) fail(!!iTK, "Tindakan " + ti + " harus dipilih dari hasil pencarian (autocomplete)", "tindakan" + ti);
      }
      var td = val("td_pulang") || val("tensi");
      if (td) fail(isNormalBP(td), "Tekanan darah pulang tidak valid (contoh: 120/80)", val("td_pulang") ? "td_pulang" : "tensi");
      var nadi = val("nadi_pulang");
      if (nadi) fail(isValidVital(nadi, 20, 250), "Nadi pulang harus 20-250", "nadi_pulang");
      var suhu = val("suhu_pulang");
      if (suhu) fail(isValidVital(suhu, 30, 45), "Suhu pulang harus 30-45\xB0C", "suhu_pulang");
      var rr = val("rr_pulang");
      if (rr) fail(isValidVital(rr, 4, 80), "RR pulang harus 4-80", "rr_pulang");
      var spo2 = val("spo2_pulang");
      if (spo2) fail(isValidVital(spo2, 50, 100), "SpO2 pulang harus 50-100%", "spo2_pulang");
      fail(!!val("jenis_kasus"), "Jenis kasus harus dipilih", "jenis_kasus");
      fail(!!val("keadaan_keluar"), "Keadaan keluar harus dipilih", "keadaan_keluar");
      fail(!!val("cara_keluar"), "Cara keluar harus dipilih", "cara_keluar");
      fail(!!val("tgl_keluar2"), "Tanggal keluar harus diisi", "tgl_keluar2");
      var gcsE = val("gcs_e");
      if (gcsE) fail(isValidVital(gcsE, 1, 4), "GCS Eye harus 1-4", "gcs_e");
      var gcsM = val("gcs_m");
      if (gcsM) fail(isValidVital(gcsM, 1, 6), "GCS Motor harus 1-6", "gcs_m");
      var gcsV = val("gcs_v");
      if (gcsV) fail(isValidVital(gcsV, 1, 5), "GCS Verbal harus 1-5", "gcs_v");
      var opsiA = radioVal("pasien_rujuk_masuk_opsi").toLowerCase();
      if (opsiA === "ya") fail(hasRadio("pasien_rujuk_masuk"), "Alasan Datang poin A: pilih asal rujukan masuk", "pasien_rujuk_masuk_opsi-ya");
      var opsiB = radioVal("pasien_rujuk_dikembalikan_opsi").toLowerCase();
      if (opsiB === "ya") fail(hasRadio("pasien_rujuk_dikembalikan"), "Alasan Datang poin B: pilih asal rujukan dikembalikan", "pasien_rujuk_dikembalikan_opsi-ya");
      var opsiC = radioVal("pasien_dirujuk_keluar_opsi").toLowerCase();
      if (opsiC === "ya") fail(hasRadio("pasien_rujuk_keluar"), "Alasan Datang poin C: pilih rujukan keluar", "pasien_dirujuk_keluar_opsi-ya");
      var kb = radioVal("menggunakan_kb_opsi").toLowerCase();
      if (kb === "ya") {
        fail(!!val("jenis_kb"), "Pelayanan KB: jenis KB harus dipilih", "jenis_kb");
        fail(!!val("waktu_kb"), "Pelayanan KB: waktu KB harus dipilih", "waktu_kb");
        fail(hasChecked(".monitoring_kb"), "Pelayanan KB: pilih minimal satu monitoring KB", "monitoring_kb-komplikasi_kb");
      }
      var covid = radioVal("cek_status_covid").toLowerCase();
      if (covid === "1") fail(!!val("status_covid"), "Status COVID: pilih jenis COVID", "status_covid");
      var tglMasuk = val("tgl_masuk") || val("tgl_masuk2");
      var tglKeluar = val("tgl_keluar2");
      if (tglMasuk && tglKeluar) {
        fail(new Date(tglKeluar) >= new Date(tglMasuk), "Tanggal keluar tidak boleh sebelum tanggal masuk", "tgl_keluar2");
      }
      if (errs.length > 0) {
        warnAll(errs);
        return false;
      }
      return true;
    }
    function clearErrors() {
      document.querySelectorAll(".ext-rv-error").forEach(function(el) {
        el.classList.remove("ext-rv-error");
      });
    }
    function warnAll(errs) {
      var first = errs[0];
      var firstEl = document.getElementById(first.id);
      if (firstEl) {
        firstEl.focus();
        firstEl.classList.add("ext-rv-error");
        setTimeout(function() {
          firstEl.classList.remove("ext-rv-error");
        }, 3e3);
      }
      for (var i = 1; i < errs.length; i++) {
        var f = document.getElementById(errs[i].id);
        if (f) {
          f.classList.add("ext-rv-error");
          (function(el) {
            setTimeout(function() {
              el.classList.remove("ext-rv-error");
            }, 3e3);
          })(f);
        }
      }
      var lines = [];
      for (var i = 0; i < errs.length; i++) {
        lines.push("\u2022 " + errs[i].msg);
      }
      var bulletList = lines.join("\n");
      var w = window;
      if (typeof w.swal === "function") {
        w.swal({
          title: "Validasi Gagal (" + errs.length + " masalah)",
          text: bulletList,
          icon: "warning",
          buttons: { confirm: { text: "OK", className: "btn btn-primary" } },
          closeOnClickOutside: false
        });
      } else {
        alert("Validasi Gagal (" + errs.length + " masalah):\n" + bulletList);
      }
    }
    function $(id) {
      return document.getElementById(id);
    }
    function val(id) {
      const el = $(id);
      return el?.value?.trim() || "";
    }
    function isNormalBP(v) {
      const parts = v.split("/");
      if (parts.length !== 2) return false;
      const sys = parseInt(parts[0]);
      const dia = parseInt(parts[1]);
      if (isNaN(sys) || isNaN(dia)) return false;
      return sys >= 50 && sys <= 250 && dia >= 20 && dia <= 160;
    }
    function isValidVital(v, min, max) {
      const n = parseFloat(v.replace(/,/g, "."));
      return !isNaN(n) && n >= min && n <= max;
    }
    function isICD10(v) {
      return /^[A-Z][0-9][0-9](\.[0-9]{1,2})?$/.test(v.toUpperCase());
    }
    function isICD9(v) {
      return /^[0-9]{2}(\.[0-9]{1,2})?$/.test(v);
    }
    function radioVal(name) {
      const el = document.querySelector('input[name="' + name + '"]:checked');
      return el?.value || "";
    }
    function hasRadio(name) {
      return document.querySelector('input[name="' + name + '"]:checked') !== null;
    }
    function hasChecked(sel) {
      return document.querySelector(sel + ":checked") !== null;
    }
    function setupAutoClearHandlers() {
      function attachClear(fieldId, targetId) {
        var el = document.getElementById(fieldId);
        if (!el) return;
        el.addEventListener("input", function() {
          var idEl = document.getElementById(targetId);
          if (idEl) idEl.value = "";
        });
      }
      attachClear("kode_diagnosa_utama", "id_diagnosa_utama");
      attachClear("diagnosa_utama", "id_diagnosa_utama");
      for (var i = 1; i <= 10; i++) {
        var tgtS = "id_diagnosa_sekunder" + i;
        attachClear("kode_diagnosa_sekunder" + i, tgtS);
        attachClear("diagnosa_sekunder" + i, tgtS);
      }
      for (var j = 1; j <= 10; j++) {
        var tgtT = "id_tindakan" + j;
        attachClear("kode_tindakan" + j, tgtT);
        attachClear("tindakan" + j, tgtT);
      }
    }
    function buildICD10Fields() {
      var result = ["kode_diagnosa_utama"];
      for (var i = 1; i <= 10; i++) {
        result.push("kode_diagnosa_sekunder" + i);
      }
      return result;
    }
    function buildICD9Fields() {
      var result = [];
      for (var i = 1; i <= 10; i++) {
        result.push("kode_tindakan" + i);
      }
      return result;
    }
  })();
})();
//# sourceMappingURL=resumeValidator.js.map
