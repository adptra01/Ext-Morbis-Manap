1## 🆕 Phase 11: Fitur Bulk Check/Uncheck Files Setelah Crawl
2
3> **Tujuan:** Menambahkan tombol untuk select all / deselect all / invert selection pada daftar file hasil crawling, sehingga user bisa dengan mudah memilih file mana saja yang akan diupload.
4>
5> **Konteks:** Setelah auto-crawl berhasil menemukan banyak file, user perlu cara cepat untuk memilih/membatalkan pilihan semua file tanpa harus klik satu-satu.
6
7---
8
9### **11.1 Analisis & Perencanaan**
10
11- [ ] **11.1.1** Review struktur `batchQueue` saat ini
12  - [ ] Cek apakah sudah ada property `selected` / `checked` di setiap item
13  - [ ] Jika belum, rencanakan penambahan property `selected: true/false`
14- [ ] **11.1.2** Identifikasi lokasi render daftar file di `updatePreview()`
15- [ ] **11.1.3** Tentukan default state setelah crawl:
16  - [ ] Option A: **Semua ter-checklist** secara default (recommended)
17  - [ ] Option B: **Semua un-checklist** secara default
18  - [ ] Option C: **Configurable** via settings
19
20### **11.2 UI: Tombol Bulk Action**
21
22- [ ] **11.2.1** Tambahkan **toolbar bulk action** di atas list preview
23- [ ] **11.2.2** Buat komponen tombol:
24  - [ ] ☑️ **"Pilih Semua"** (Select All)
25  - [ ] ☐ **"Batalkan Semua"** (Deselect All)
26  - [ ] 🔄 **"Balik Pilihan"** (Invert Selection)
27  - [ ] 🗑️ **"Hapus yang Dipilih"** (Delete Selected)
28- [ ] **11.2.3** Tambahkan **counter indicator**:
29  - [ ] Format: `"5 dari 20 file dipilih"`
30  - [ ] Update real-time saat checkbox berubah
31- [ ] **11.2.4** Tambahkan **master checkbox** di header
32  - [ ] State: checked / unchecked / indeterminate (partial)
33  - [ ] Klik master checkbox → toggle semua
34
35### **11.3 UI: Checkbox per Item**
36
37- [ ] **11.3.1** Tambahkan `<input type="checkbox">` di setiap item preview
38- [ ] **11.3.2** Posisi checkbox: **sebelah kiri** nama file
39- [ ] **11.3.3** Styling checkbox:
40  - [ ] Ukuran cukup besar (minimal 18x18px) untuk mudah diklik
41  - [ ] Warna aktif sesuai tema extension
42  - [ ] Hover state yang jelas
43- [ ] **11.3.4** Label checkbox clickable (klik nama file = toggle checkbox)
44
45### **11.4 Logic: State Management**
46
47- [ ] **11.4.1** Tambahkan property ke setiap item `batchQueue`:
48  ```javascript
49  {
50    url: '...',
51    filename: '...',
52    selected: true,  // ← properti baru
53    status: 'pending'
54  }
55  ```
56- [ ] **11.4.2** Function `selectAll()`:
57  ```javascript
58  function selectAll() {
59    batchQueue.forEach(item => item.selected = true);
60    updatePreview();
61    updateBulkActionUI();
62  }
63  ```
64- [ ] **11.4.3** Function `deselectAll()`:
65  ```javascript
66  function deselectAll() {
67    batchQueue.forEach(item => item.selected = false);
68    updatePreview();
69    updateBulkActionUI();
70  }
71  ```
72- [ ] **11.4.4** Function `invertSelection()`:
73  ```javascript
74  function invertSelection() {
75    batchQueue.forEach(item => item.selected = !item.selected);
76    updatePreview();
77    updateBulkActionUI();
78  }
79  ```
80- [ ] **11.4.5** Function `deleteSelected()`:
81  ```javascript
82  function deleteSelected() {
83    const selectedCount = batchQueue.filter(i => i.selected).length;
84    if (confirm(`Hapus ${selectedCount} file yang dipilih?`)) {
85      batchQueue = batchQueue.filter(i => !i.selected);
86      updatePreview();
87    }
88  }
89  ```
90- [ ] **11.4.6** Function `toggleItemSelection(index)`:
91  ```javascript
92  function toggleItemSelection(index) {
93    batchQueue[index].selected = !batchQueue[index].selected;
94    updateBulkActionUI();
95  }
96  ```
97
98### **11.5 Logic: Master Checkbox Behavior**
99
100- [ ] **11.5.1** Function `updateMasterCheckbox()`:
101  - [ ] Jika **semua selected** → master = `checked`
102  - [ ] Jika **tidak ada yang selected** → master = `unchecked`
103  - [ ] Jika **sebagian selected** → master = `indeterminate`
104- [ ] **11.5.2** Panggil `updateMasterCheckbox()` setiap kali ada perubahan
105- [ ] **11.5.3** Implementasi indeterminate state:
106  ```javascript
107  masterCheckbox.indeterminate = (selectedCount > 0 && selectedCount < total);
108  masterCheckbox.checked = (selectedCount === total);
109  ```
110
111### **11.6 Integrasi dengan Upload Logic**
112
113- [ ] **11.6.1** Modifikasi fungsi upload untuk **hanya proses file yang selected**:
114  ```javascript
115  const itemsToUpload = batchQueue.filter(item => item.selected);
116  ```
117- [ ] **11.6.2** Validasi sebelum upload:
118  - [ ] Jika **tidak ada yang selected** → tampilkan warning
119  - [ ] Message: `"Pilih minimal 1 file untuk diupload"`
120- [ ] **11.6.3** Update progress indicator:
121  - [ ] Hitung progress berdasarkan `selected items`, bukan total
122  - [ ] Format: `"Upload 3 dari 5 file terpilih"`
123- [ ] **11.6.4** Tombol upload disabled jika **0 file selected**
124
125### **11.7 Integrasi dengan Auto-Crawl**
126
127- [ ] **11.7.1** Setelah crawl selesai, **default-kan semua item `selected: true`**
128- [ ] **11.7.2** Tampilkan **notifikasi** setelah crawl:
129  - [ ] Format: `"✅ Ditemukan 15 file. Semua sudah dipilih secara default."`
130- [ ] **11.7.3** Auto-scroll ke toolbar bulk action setelah crawl selesai
131- [ ] **11.7.4** Highlight toolbar dengan animasi singkat (flash) untuk menarik perhatian
132
133### **11.8 Integrasi dengan Preview Modal**
134
135- [ ] **11.8.1** Pastikan **checkbox tidak trigger** saat klik tombol preview
136- [ ] **11.8.2** Tambahkan `event.stopPropagation()` di handler preview button
137- [ ] **11.8.3** Status selected tetap preserved setelah preview ditutup
138
139### **11.9 Filtering & Sorting (Bonus)**
140
141- [ ] **11.9.1** Tambahkan **filter dropdown**:
142  - [ ] "Semua file"
143  - [ ] "Hanya yang dipilih"
144  - [ ] "Hanya yang tidak dipilih"
145  - [ ] "Hanya PDF"
146  - [ ] "Hanya Gambar"
147- [ ] **11.9.2** Tambahkan **search box** untuk filter nama file
148- [ ] **11.9.3** Tambahkan **sort options**:
149  - [ ] By filename (A-Z / Z-A)
150  - [ ] By size (ascending / descending)
151  - [ ] By status
152
153### **11.10 Smart Selection (Bonus Advanced)**
154
155- [ ] **11.10.1** Tombol **"Pilih PDF Saja"**
156- [ ] **11.10.2** Tombol **"Pilih Gambar Saja"**
157- [ ] **11.10.3** Tombol **"Pilih yang Belum Diupload"**
158- [ ] **11.10.4** Tombol **"Pilih yang Gagal Upload"** (untuk retry)
159- [ ] **11.10.5** **Range selection** dengan Shift+Click:
160  - [ ] Klik item pertama → Shift+Klik item terakhir → select range
161
162### **11.11 Keyboard Shortcuts**
163
164- [ ] **11.11.1** `Ctrl+A` → Select All (saat focus di list)
165- [ ] **11.11.2** `Ctrl+D` → Deselect All
166- [ ] **11.11.3** `Ctrl+I` → Invert Selection
167- [ ] **11.11.4** `Delete` key → Delete selected items
168- [ ] **11.11.5** `Space` → Toggle item yang sedang di-focus
169- [ ] **11.11.6** Tampilkan **tooltip shortcut** di hover tombol
170
171### **11.12 Styling & UX**
172
173- [ ] **11.12.1** CSS untuk toolbar bulk action:
174  ```css
175  .ext-bulk-toolbar {
176    display: flex;
177    gap: 8px;
178    padding: 10px;
179    background: #f3f4f6;
180    border-radius: 6px;
181    margin-bottom: 10px;
182    align-items: center;
183    flex-wrap: wrap;
184  }
185  ```
186- [ ] **11.12.2** Visual feedback untuk item selected:
187  - [ ] Background color berbeda (misal: light blue)
188  - [ ] Border kiri dengan warna accent
189- [ ] **11.12.3** Animasi smooth saat check/uncheck
190- [ ] **11.12.4** Badge counter dengan warna dinamis:
191  - [ ] 0 selected → abu-abu
192  - [ ] 1-n selected → biru
193  - [ ] All selected → hijau
194
195### **11.13 Testing**
196
197- [ ] **11.13.1** Test **Select All** dengan 0 file → tidak error
198- [ ] **11.13.2** Test **Select All** dengan 1 file → checkbox checked
199- [ ] **11.13.3** Test **Select All** dengan 100+ file → performa OK
200- [ ] **11.13.4** Test **Deselect All** → semua uncheck
201- [ ] **11.13.5** Test **Invert Selection** → toggle benar
202- [ ] **11.13.6** Test **master checkbox indeterminate** state
203- [ ] **11.13.7** Test **delete selected** → konfirmasi muncul
204- [ ] **11.13.8** Test **upload hanya selected files**
205- [ ] **11.13.9** Test **preserve selection** saat preview dibuka-tutup
206- [ ] **11.13.10** Test **keyboard shortcuts** berfungsi
207- [ ] **11.13.11** Test **edge case**: semua file gagal upload → retry selected
208- [ ] **11.13.12** Test **interaksi dengan preview modal** (tidak konflik)
209
210### **11.14 Dokumentasi**
211
212- [ ] **11.14.1** Update **CHANGELOG.md**:
213  ```markdown
214  ## [1.2.0] - YYYY-MM-DD
215  ### Added
216  - Bulk select/desel
### **11.14 Dokumentasi**

- [ ] **11.14.1** Update **CHANGELOG.md**:
  ```markdown
  ## [1.2.0] - YYYY-MM-DD
  ### Added
  - Bulk select/deselect semua file hasil crawl
  - Master checkbox dengan indeterminate state
  - Invert selection untuk toggle kebalikan pilihan
  - Delete selected items dengan konfirmasi
  - Counter indicator file terpilih
  - Keyboard shortcuts (Ctrl+A, Ctrl+D, Ctrl+I, Delete, Space)
  - Smart selection (pilih PDF/Gambar saja, pilih yang gagal upload)
  - Filter & sort untuk daftar file
  ### Changed
  - Upload hanya memproses file yang dipilih (selected)
  - Default state setelah crawl: semua file ter-checklist
  ```
- [ ] **11.14.2** Update **README.md** dengan screenshot fitur baru
- [ ] **11.14.3** Tambahkan **user guide** cara menggunakan bulk action
- [ ] **11.14.4** Update JSDoc untuk function baru:
  - [ ] `selectAll()`
  - [ ] `deselectAll()`
  - [ ] `invertSelection()`
  - [ ] `deleteSelected()`
  - [ ] `toggleItemSelection()`
  - [ ] `updateMasterCheckbox()`
  - [ ] `updateBulkActionUI()`

### **11.15 Migration & Backward Compatibility**

- [ ] **11.15.1** Handle existing `batchQueue` yang belum punya property `selected`:
  ```javascript
  // Migration: add 'selected' property to existing items
  batchQueue = batchQueue.map(item => ({
    ...item,
    selected: item.selected !== undefined ? item.selected : true
  }));
  ```
- [ ] **11.15.2** Pastikan **tidak break** fitur upload manual (paste URL)
- [ ] **11.15.3** Pastikan **tidak break** fitur preview yang sudah dibuat di Phase 2

---

## 📐 Mockup UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Hasil Crawling: 15 file ditemukan                   │
├─────────────────────────────────────────────────────────┤
│  ☑️ [Master] │ 15/15 dipilih │ 📊 Filter ▼ │ 🔎 Search │
│                                                          │
│  [✅ Pilih Semua] [❌ Batalkan] [🔄 Balik] [🗑️ Hapus]   │
│  [📄 PDF Saja] [🖼️ Gambar Saja] [⚠️ Yang Gagal]        │
├─────────────────────────────────────────────────────────┤
│  ☑️ 📄 dokumen-klaim-001.pdf         [👁️ Preview] [🗑️] │
│  ☑️ 🖼️ foto-ktp-pasien.jpg          [👁️ Preview] [🗑️] │
│  ☐ 📄 surat-rujukan.pdf              [👁️ Preview] [🗑️] │
│  ☑️ 🖼️ hasil-lab.png                 [👁️ Preview] [🗑️] │
│  ...                                                     │
├─────────────────────────────────────────────────────────┤
│           [🚀 Upload 14 File Terpilih]                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Contoh Implementasi Kode

### **Snippet: Render Bulk Toolbar**

```javascript
/**
 * UI: Render bulk action toolbar
 */
function renderBulkToolbar() {
  const selectedCount = batchQueue.filter(i => i.selected).length;
  const totalCount = batchQueue.length;
  
  return `
    <div class="ext-bulk-toolbar">
      <label class="ext-master-checkbox-wrapper">
        <input type="checkbox" 
               id="ext-master-checkbox"
               ${selectedCount === totalCount && totalCount > 0 ? 'checked' : ''}>
        <span class="ext-counter-badge ${selectedCount > 0 ? 'active' : ''}">
          ${selectedCount} / ${totalCount} dipilih
        </span>
      </label>
      
      <div class="ext-bulk-actions">
        <button id="ext-btn-select-all" title="Pilih Semua (Ctrl+A)">
          ☑️ Pilih Semua
        </button>
        <button id="ext-btn-deselect-all" title="Batalkan Semua (Ctrl+D)">
          ☐ Batalkan
        </button>
        <button id="ext-btn-invert" title="Balik Pilihan (Ctrl+I)">
          🔄 Balik
        </button>
        <button id="ext-btn-delete-selected" 
                title="Hapus yang Dipilih (Delete)"
                ${selectedCount === 0 ? 'disabled' : ''}>
          🗑️ Hapus (${selectedCount})
        </button>
      </div>
      
      <div class="ext-smart-actions">
        <button id="ext-btn-select-pdf" title="Pilih PDF saja">
          📄 PDF
        </button>
        <button id="ext-btn-select-image" title="Pilih Gambar saja">
          🖼️ Gambar
        </button>
        <button id="ext-btn-select-failed" title="Pilih yang gagal">
          ⚠️ Gagal
        </button>
      </div>
    </div>
  `;
}
```

### **Snippet: Event Handlers Setup**

```javascript
/**
 * Setup bulk action event listeners
 */
function setupBulkActionListeners() {
  // Master checkbox
  document.getElementById('ext-master-checkbox')?.addEventListener('change', (e) => {
    if (e.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  });
  
  // Bulk action buttons
  document.getElementById('ext-btn-select-all')?.addEventListener('click', selectAll);
  document.getElementById('ext-btn-deselect-all')?.addEventListener('click', deselectAll);
  document.getElementById('ext-btn-invert')?.addEventListener('click', invertSelection);
  document.getElementById('ext-btn-delete-selected')?.addEventListener('click', deleteSelected);
  
  // Smart selection
  document.getElementById('ext-btn-select-pdf')?.addEventListener('click', () => selectByType('pdf'));
  document.getElementById('ext-btn-select-image')?.addEventListener('click', () => selectByType('image'));
  document.getElementById('ext-btn-select-failed')?.addEventListener('click', () => selectByStatus('failed'));
}

/**
 * Select items by file type
 */
function selectByType(type) {
  const imageExts = ['jpg', 'jpeg', 'png'];
  batchQueue.forEach(item => {
    const ext = item.filename.split('.').pop().toLowerCase();
    if (type === 'pdf') {
      item.selected = (ext === 'pdf');
    } else if (type === 'image') {
      item.selected = imageExts.includes(ext);
    }
  });
  updatePreview();
}

/**
 * Select items by status
 */
function selectByStatus(status) {
  batchQueue.forEach(item => {
    item.selected = (item.status === status);
  });
  updatePreview();
}
```

### **Snippet: Keyboard Shortcuts**

```javascript
/**
 * Setup keyboard shortcuts for bulk actions
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Ctrl+A: Select All
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      selectAll();
    }
    
    // Ctrl+D: Deselect All
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      deselectAll();
    }
    
    // Ctrl+I: Invert Selection
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      invertSelection();
    }
    
    // Delete: Remove selected
    if (e.key === 'Delete') {
      const selectedCount = batchQueue.filter(i => i.selected).length;
      if (selectedCount > 0) {
        e.preventDefault();
        deleteSelected();
      }
    }
  });
}
```

### **Snippet: CSS Styling**

```css
/* Bulk Action Toolbar */
.ext-bulk-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  margin-bottom: 12px;
  align-items: center;
  border: 1px solid #d1d5db;
}

.ext-master-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.ext-master-checkbox-wrapper input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.ext-counter-badge {
  padding: 4px 10px;
  background: #9ca3af;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}

.ext-counter-badge.active {
  background: #3b82f6;
}

.ext-counter-badge.all-selected {
  background: #10b981;
}

.ext-bulk-actions,
.ext-smart-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ext-bulk-toolbar button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.ext-bulk-toolbar button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.ext-bulk-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

### **11.14 Dokumentasi**

- [ ] **11.14.1** Update **CHANGELOG.md**:
  ```markdown
  ## [1.2.0] - YYYY-MM-DD
  ### Added
  - Bulk select/deselect semua file hasil crawl
  - Master checkbox dengan indeterminate state
  - Invert selection untuk toggle kebalikan pilihan
  - Delete selected items dengan konfirmasi
  - Counter indicator file terpilih
  - Keyboard shortcuts (Ctrl+A, Ctrl+D, Ctrl+I, Delete, Space)
  - Smart selection (pilih PDF/Gambar saja, pilih yang gagal upload)
  - Filter & sort untuk daftar file
  ### Changed
  - Upload hanya memproses file yang dipilih (selected)
  - Default state setelah crawl: semua file ter-checklist
  ```
- [ ] **11.14.2** Update **README.md** dengan screenshot fitur baru
- [ ] **11.14.3** Tambahkan **user guide** cara menggunakan bulk action
- [ ] **11.14.4** Update JSDoc untuk function baru:
  - [ ] `selectAll()`
  - [ ] `deselectAll()`
  - [ ] `invertSelection()`
  - [ ] `deleteSelected()`
  - [ ] `toggleItemSelection()`
  - [ ] `updateMasterCheckbox()`
  - [ ] `updateBulkActionUI()`

### **11.15 Migration & Backward Compatibility**

- [ ] **11.15.1** Handle existing `batchQueue` yang belum punya property `selected`:
  ```javascript
  // Migration: add 'selected' property to existing items
  batchQueue = batchQueue.map(item => ({
    ...item,
    selected: item.selected !== undefined ? item.selected : true
  }));
  ```
- [ ] **11.15.2** Pastikan **tidak break** fitur upload manual (paste URL)
- [ ] **11.15.3** Pastikan **tidak break** fitur preview yang sudah dibuat di Phase 2

---

## 📐 Mockup UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Hasil Crawling: 15 file ditemukan                   │
├─────────────────────────────────────────────────────────┤
│  ☑️ [Master] │ 15/15 dipilih │ 📊 Filter ▼ │ 🔎 Search │
│                                                          │
│  [✅ Pilih Semua] [❌ Batalkan] [🔄 Balik] [🗑️ Hapus]   │
│  [📄 PDF Saja] [🖼️ Gambar Saja] [⚠️ Yang Gagal]        │
├─────────────────────────────────────────────────────────┤
│  ☑️ 📄 dokumen-klaim-001.pdf         [👁️ Preview] [🗑️] │
│  ☑️ 🖼️ foto-ktp-pasien.jpg          [👁️ Preview] [🗑️] │
│  ☐ 📄 surat-rujukan.pdf              [👁️ Preview] [🗑️] │
│  ☑️ 🖼️ hasil-lab.png                 [👁️ Preview] [🗑️] │
│  ...                                                     │
├─────────────────────────────────────────────────────────┤
│           [🚀 Upload 14 File Terpilih]                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Contoh Implementasi Kode

### **Snippet: Render Bulk Toolbar**

```javascript
/**
 * UI: Render bulk action toolbar
 */
function renderBulkToolbar() {
  const selectedCount = batchQueue.filter(i => i.selected).length;
  const totalCount = batchQueue.length;
  
  return `
    <div class="ext-bulk-toolbar">
      <label class="ext-master-checkbox-wrapper">
        <input type="checkbox" 
               id="ext-master-checkbox"
               ${selectedCount === totalCount && totalCount > 0 ? 'checked' : ''}>
        <span class="ext-counter-badge ${selectedCount > 0 ? 'active' : ''}">
          ${selectedCount} / ${totalCount} dipilih
        </span>
      </label>
      
      <div class="ext-bulk-actions">
        <button id="ext-btn-select-all" title="Pilih Semua (Ctrl+A)">
          ☑️ Pilih Semua
        </button>
        <button id="ext-btn-deselect-all" title="Batalkan Semua (Ctrl+D)">
          ☐ Batalkan
        </button>
        <button id="ext-btn-invert" title="Balik Pilihan (Ctrl+I)">
          🔄 Balik
        </button>
        <button id="ext-btn-delete-selected" 
                title="Hapus yang Dipilih (Delete)"
                ${selectedCount === 0 ? 'disabled' : ''}>
          🗑️ Hapus (${selectedCount})
        </button>
      </div>
      
      <div class="ext-smart-actions">
        <button id="ext-btn-select-pdf" title="Pilih PDF saja">
          📄 PDF
        </button>
        <button id="ext-btn-select-image" title="Pilih Gambar saja">
          🖼️ Gambar
        </button>
        <button id="ext-btn-select-failed" title="Pilih yang gagal">
          ⚠️ Gagal
        </button>
      </div>
    </div>
  `;
}
```

### **Snippet: Event Handlers Setup**

```javascript
/**
 * Setup bulk action event listeners
 */
function setupBulkActionListeners() {
  // Master checkbox
  document.getElementById('ext-master-checkbox')?.addEventListener('change', (e) => {
    if (e.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  });
  
  // Bulk action buttons
  document.getElementById('ext-btn-select-all')?.addEventListener('click', selectAll);
  document.getElementById('ext-btn-deselect-all')?.addEventListener('click', deselectAll);
  document.getElementById('ext-btn-invert')?.addEventListener('click', invertSelection);
  document.getElementById('ext-btn-delete-selected')?.addEventListener('click', deleteSelected);
  
  // Smart selection
  document.getElementById('ext-btn-select-pdf')?.addEventListener('click', () => selectByType('pdf'));
  document.getElementById('ext-btn-select-image')?.addEventListener('click', () => selectByType('image'));
  document.getElementById('ext-btn-select-failed')?.addEventListener('click', () => selectByStatus('failed'));
}

/**
 * Select items by file type
 */
function selectByType(type) {
  const imageExts = ['jpg', 'jpeg', 'png'];
  batchQueue.forEach(item => {
    const ext = item.filename.split('.').pop().toLowerCase();
    if (type === 'pdf') {
      item.selected = (ext === 'pdf');
    } else if (type === 'image') {
      item.selected = imageExts.includes(ext);
    }
  });
  updatePreview();
}

/**
 * Select items by status
 */
function selectByStatus(status) {
  batchQueue.forEach(item => {
    item.selected = (item.status === status);
  });
  updatePreview();
}
```

### **Snippet: Keyboard Shortcuts**

```javascript
/**
 * Setup keyboard shortcuts for bulk actions
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Ctrl+A: Select All
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      selectAll();
    }
    
    // Ctrl+D: Deselect All
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      deselectAll();
    }
    
    // Ctrl+I: Invert Selection
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      invertSelection();
    }
    
    // Delete: Remove selected
    if (e.key === 'Delete') {
      const selectedCount = batchQueue.filter(i => i.selected).length;
      if (selectedCount > 0) {
        e.preventDefault();
        deleteSelected();
      }
    }
  });
}
```

### **Snippet: CSS Styling**

```css
/* Bulk Action Toolbar */
.ext-bulk-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  margin-bottom: 12px;
  align-items: center;
  border: 1px solid #d1d5db;
}

.ext-master-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.ext-master-checkbox-wrapper input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.ext-counter-badge {
  padding: 4px 10px;
  background: #9ca3af;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}

.ext-counter-badge.active {
  background: #3b82f6;
}

.ext-counter-badge.all-selected {
  background: #10b981;
}

.ext-bulk-actions,
.ext-smart-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ext-bulk-toolbar button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.ext-bulk-toolbar button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.ext-bulk-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}