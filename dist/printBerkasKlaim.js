// src/features/shared/printDossier.ts
async function loadDossier(key) {
	let got = await chrome.storage.session.get(key);
	let html = got[key];
	if (typeof html !== "string") {
		got = await chrome.storage.local.get(key);
		html = got[key];
	}
	return typeof html === "string" ? html : null;
}
/** Alat layar lampiran hasil scan: rotasi 90° & hapus (tidak ikut tercetak). */
function installImageTools(win) {
	const doc = win.document;
	const setup = (img) => {
		if (img.dataset.tools || !img.naturalWidth || img.naturalWidth < 260) return;
		if (img.closest("table")) return;
		img.dataset.tools = "1";
		const wrap = doc.createElement("span");
		wrap.className = "img-wrap";
		img.parentNode?.insertBefore(wrap, img);
		wrap.appendChild(img);
		const tools = doc.createElement("span");
		tools.className = "img-tools";
		const mk = (label, act) => {
			const b = doc.createElement("button");
			b.type = "button";
			b.dataset.act = act;
			b.textContent = label;
			return b;
		};
		tools.appendChild(mk("↻ Rotasi 90°", "rot"));
		tools.appendChild(mk("Hapus", "del"));
		wrap.insertBefore(tools, img);
		tools.addEventListener("click", (ev) => {
			const act = ev.target.closest("button")?.dataset.act;
			if (act === "del") {
				wrap.remove();
				return;
			}
			if (act !== "rot") return;
			const w = img.naturalWidth;
			const h = img.naturalHeight;
			if (!w || !h) return;
			const c = doc.createElement("canvas");
			c.width = h;
			c.height = w;
			const ctx = c.getContext("2d");
			if (!ctx) return;
			ctx.translate(h / 2, w / 2);
			ctx.rotate(Math.PI / 2);
			ctx.drawImage(img, -w / 2, -h / 2);
			try {
				img.src = c.toDataURL("image/png");
			} catch {}
		});
	};
	doc.querySelectorAll(".doc-body img").forEach((img) => {
		if (img.complete) setup(img);
		else img.addEventListener("load", () => setup(img), { once: true });
	});
}
/** Pasang semua handler toolbar di halaman dossier (print, filter, verifikasi). */
function installDossierHandlers(win) {
	const doPrint = () => {
		try {
			win.focus();
			win.print();
		} catch {}
	};
	const d = win.document;
	d.getElementById("btnPrintPdf")?.addEventListener("click", doPrint);
	const pages = Array.from(d.querySelectorAll(".rm-page"));
	const sel = d.getElementById("rmSectionSelect");
	const tabs = Array.from(d.querySelectorAll(".tab-btn"));
	const filter = (target) => {
		if (sel) sel.value = target;
		tabs.forEach((b) => b.classList.toggle("active", b.dataset.target === target));
		pages.forEach((pg) => pg.classList.toggle("hidden-section", target !== "all" && pg.id !== target));
		win.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	sel?.addEventListener("change", (ev) => filter(ev.target.value));
	tabs.forEach((b) => b.addEventListener("click", () => filter(b.dataset.target || "all")));
	const countEl = d.getElementById("checkCounter");
	const boxes = Array.from(d.querySelectorAll(".rm-checkbox, .vbox"));
	const syncCount = () => {
		if (countEl) countEl.textContent = `${boxes.filter((b) => b.checked).length} / ${boxes.length}`;
	};
	boxes.forEach((b) => b.addEventListener("change", syncCount));
	d.getElementById("btnCheckAll")?.addEventListener("click", () => {
		boxes.forEach((b) => b.checked = true);
		syncCount();
	});
	d.getElementById("btnResetChecks")?.addEventListener("click", () => {
		boxes.forEach((b) => b.checked = false);
		syncCount();
	});
	syncCount();
	win.addEventListener("afterprint", () => {
		if (win.confirm("Apakah menu print ini akan ditutup?")) win.close();
	});
}
// src/features/printBerkasKlaim/main.ts
/** Halaman ekstensi asli untuk dossier cetak M-KLAIM.
*  Berbeda dari about:blank: punya URL chrome-extension:// sehingga isi
*  dossier tetap ada setelah tab di-refresh (dibaca ulang dari storage). */
async function boot() {
	const loading = document.getElementById("ext-print-loading");
	const id = new URLSearchParams(window.location.search).get("id");
	if (!id) {
		if (loading) loading.textContent = "Dossier tidak ditemukan (parameter id hilang).";
		return;
	}
	const html = await loadDossier(id);
	if (!html) {
		if (loading) loading.textContent = "Data dossier sudah tidak tersedia (browser pernah di-restart). Silakan klik Cetak Rapi lagi dari halaman M-KLAIM.";
		return;
	}
	document.open();
	document.write(html);
	document.close();
	installImageTools(window);
	installDossierHandlers(window);
}
boot();
