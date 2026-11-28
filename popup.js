import { C as __toESM, S as require_react, _ as RotateCcw, a as SelectTrigger, b as createLucideIcon, c as Switch, d as ErrorBoundary, f as require_jsx_runtime, g as Search, h as X, i as SelectItem, l as Button, m as sendMessage, n as Select, o as SelectValue, p as MessageTypes, r as SelectContent, s as Input, t as getVersionBadge, u as cn, v as RefreshCw, x as require_client, y as Plus } from "./chunks/version-Dq5ke04r.js";
//#region node_modules/lucide-react/dist/esm/icons/zap.mjs
/**
* @license lucide-react v1.49.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var __iconData = {
	name: "zap",
	size: 24,
	node: [["path", {
		d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
		key: "1v7up4"
	}]]
};
__iconData.node;
var Zap = createLucideIcon(__iconData);
//#endregion
//#region src/popup/StatusCard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_client = require_client();
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	{
		value: "casemix",
		label: "Casemix"
	},
	{
		value: "kasir",
		label: "Kasir"
	},
	{
		value: "dokter",
		label: "Dokter"
	},
	{
		value: "apotek",
		label: "Apotek"
	},
	{
		value: "admin",
		label: "Admin"
	},
	{
		value: "labor",
		label: "Labor"
	},
	{
		value: "pendaftaran",
		label: "Pendaftaran"
	},
	{
		value: "igd",
		label: "IGD"
	}
];
var ROLE_LABELS = {
	casemix: "Casemix",
	kasir: "Kasir",
	dokter: "Dokter",
	apotek: "Apotek",
	admin: "Admin",
	labor: "Labor",
	pendaftaran: "Pendaftaran",
	igd: "IGD"
};
function StatusCard({ enabled, role, onToggle, onRoleChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: enabled,
				onCheckedChange: onToggle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block w-2 h-2 rounded-full ${enabled ? "bg-green-500" : "bg-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-md-xs font-medium text-foreground",
					children: enabled ? "Aktif" : "Non-Aktif"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-muted-foreground mt-0.5",
				children: ["Role: ", ROLE_LABELS[role] || role]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value: role,
			onChange: (e) => onRoleChange(e.target.value),
			className: "w-[120px] h-8 rounded-md border border-input bg-background px-2 text-md-sm text-foreground outline-none focus:ring-2 focus:ring-ring",
			children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: r.value,
				children: r.label
			}, r.value))
		})]
	});
}
//#endregion
//#region src/popup/featureMeta.ts
var CATEGORY_LABELS = {
	all: "Semua",
	mklaim: "M-Klaim & Billing",
	rmresep: "RM & Resep",
	labrad: "Lab & Rad",
	antrian: "Antrian & MJKN",
	lainnya: "Lainnya"
};
/** Pill utama sesuai prototype. 'Lainnya' hanya muncul bila ada fitur tak dikenal. */
var MAIN_CATEGORIES = [
	"all",
	"mklaim",
	"rmresep",
	"labrad",
	"antrian"
];
var KLAIM_LIST = ["/v2/m-klaim"];
var KLAIM_DETAIL = ["/v2/m-klaim/detail"];
var RESEP = ["/admisi/pelaksanaan_pelayanan/resep", "/inventory/resep/penerimaan"];
var LAB = ["/laboratorium"];
var ANTRIAN = [
	"/antrian",
	"/view-antrian",
	"/admisi/pelaksanaan_pelayanan/antrian"
];
var FARMASI = [
	"/antrian-farmasi",
	"/view-call-websocet",
	"/inventory/resep/penerimaan"
];
var META = {
	openDetailInNewTab: {
		category: "mklaim",
		urlPatterns: KLAIM_LIST
	},
	shortcutButtons: {
		category: "mklaim",
		urlPatterns: [
			...KLAIM_LIST,
			"/admisi/pelaksanaan_pelayanan",
			"/admisi/detail-rawat-inap"
		]
	},
	filterPersistence: {
		category: "mklaim",
		urlPatterns: KLAIM_LIST
	},
	scrollButtons: {
		category: "mklaim",
		urlPatterns: KLAIM_DETAIL
	},
	batchUpload: {
		category: "mklaim",
		urlPatterns: KLAIM_DETAIL
	},
	batchDelete: {
		category: "mklaim",
		urlPatterns: KLAIM_DETAIL
	},
	mKlaimBulkVerif: {
		category: "mklaim",
		urlPatterns: KLAIM_LIST
	},
	mKlaimPrint: {
		category: "mklaim",
		urlPatterns: KLAIM_DETAIL
	},
	mKlaimMarks: {
		category: "mklaim",
		urlPatterns: KLAIM_LIST
	},
	mKlaimVerifLog: {
		category: "mklaim",
		urlPatterns: KLAIM_DETAIL
	},
	laporanLinks: {
		category: "mklaim",
		urlPatterns: KLAIM_LIST
	},
	billingFilterPersistence: {
		category: "mklaim",
		urlPatterns: ["/billing/pembayaran-new/billing-verifikasi"]
	},
	billingEditTools: {
		category: "mklaim",
		urlPatterns: KLAIM_DETAIL
	},
	fetchWatchdog: {
		category: "mklaim",
		urlPatterns: []
	},
	resumeValidator: {
		category: "rmresep",
		urlPatterns: KLAIM_DETAIL
	},
	resumeHistory: {
		category: "rmresep",
		urlPatterns: KLAIM_DETAIL
	},
	resumeModal: {
		category: "rmresep",
		urlPatterns: KLAIM_DETAIL
	},
	resumeRanap: {
		category: "rmresep",
		urlPatterns: KLAIM_DETAIL
	},
	resepTools: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	fixJasaPelayanan: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	consultationEnhancer: {
		category: "rmresep",
		urlPatterns: ["/admisi/pengajuan_konsultasi/konsultasi"]
	},
	doctorFilterPersistence: {
		category: "rmresep",
		urlPatterns: [
			"/admisi/pelaksanaan_pelayanan",
			"/admisi/pelaksanaan-operasi",
			"/admisi/detail-rawat-inap"
		]
	},
	telaahResep: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	resepAsli: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	cpptReader: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	detailKunjungan: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	penerimaanExport: {
		category: "rmresep",
		urlPatterns: RESEP
	},
	pindahOperasi: {
		category: "rmresep",
		urlPatterns: ["/admisi/pelaksanaan-operasi", "/admisi/detail-rawat-inap"]
	},
	visiteKonsul: {
		category: "rmresep",
		urlPatterns: ["/admisi/pelaksanaan_pelayanan/halaman-utama"]
	},
	paLabPrint: {
		category: "labrad",
		urlPatterns: [...LAB, "/radiologi"]
	},
	randomKodeGenerator: {
		category: "labrad",
		urlPatterns: ["/admisi/data-layanan", "/laboratorium/data-pemeriksaan-lab"]
	},
	labHistory: {
		category: "labrad",
		urlPatterns: LAB
	},
	cancelBatal: {
		category: "labrad",
		urlPatterns: [...LAB, "/radiologi"]
	},
	antrianTools: {
		category: "antrian",
		urlPatterns: ANTRIAN
	},
	antrianFarmasi: {
		category: "antrian",
		urlPatterns: FARMASI
	},
	antrolKirimOtomatis: {
		category: "antrian",
		urlPatterns: FARMASI
	},
	ttsServer: {
		category: "antrian",
		urlPatterns: []
	}
};
/** Fitur baru belum terdaftar: tampil di "Semua", tidak ikut blok kontekstual
*  sampai pola URL-nya ditambahkan di sini. */
function getFeatureMeta(key) {
	return Object.prototype.hasOwnProperty.call(META, key) ? META[key] : {
		category: "all",
		urlPatterns: []
	};
}
/** Cocokkan pathname apa adanya atau sebagai prefix segmen (/a tidak selaras /ab). */
function matchesPathname(urlPatterns, pathname) {
	const path = pathname.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
	return urlPatterns.some((raw) => {
		const prefix = raw.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
		return path === prefix || path.startsWith(prefix + "/");
	});
}
//#endregion
//#region src/popup/FeaturesPanel.tsx
function FeaturesPanel({ features, role, disabled, onToggle, onModeChange, pathname }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const q = search.trim().toLowerCase();
	const entries = (0, import_react.useMemo)(() => Object.entries(features).filter(([, f]) => role === "admin" || f.allowedRoles?.includes(role)).sort(([, a], [, b]) => (a.name ?? "").localeCompare(b.name ?? "", "id")), [features, role]);
	const filtered = (0, import_react.useMemo)(() => {
		const list = q ? entries.filter(([key, f]) => [
			key,
			f.name ?? "",
			f.description ?? ""
		].join(" ").toLowerCase().includes(q)) : entries;
		if (category === "all") return list;
		return list.filter(([key]) => getFeatureMeta(key).category === category);
	}, [
		entries,
		q,
		category
	]);
	const showContextual = !q && category === "all";
	const contextualEntries = (0, import_react.useMemo)(() => {
		if (!showContextual) return [];
		const path = (pathname ?? "").trim();
		if (!path) return [];
		const matched = [];
		for (const [key, f] of entries) {
			if (f.comingSoon) continue;
			if (matchesPathname(getFeatureMeta(key).urlPatterns, path)) matched.push([key, f]);
		}
		return matched;
	}, [
		showContextual,
		pathname,
		entries
	]);
	const enabledCount = filtered.filter(([, f]) => f.enabled && !f.comingSoon).length;
	const totalCount = filtered.filter(([, f]) => !f.comingSoon).length;
	if (entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-md-xs text-muted-foreground",
			children: "Tidak ada fitur untuk role ini"
		})
	});
	if (filtered.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-md-xs text-muted-foreground",
			children: "Tidak ada fitur cocok"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: disabled ? "opacity-50 pointer-events-none" : "",
		children: [
			showContextual && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1.5 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider",
							children: "Aktif di Halaman Ini"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-muted-foreground font-mono truncate mt-0.5",
						children: pathname
					}),
					contextualEntries.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 space-y-0.5",
						children: contextualEntries.map(([key, f]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 min-w-0 text-md-xs font-medium text-foreground truncate",
								children: f.name || key
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: f.enabled,
								onCheckedChange: (val) => onToggle(key, val),
								disabled,
								className: "h-4 w-7 shrink-0 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
							})]
						}, key))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground mt-1.5",
						children: "Tidak ada fitur yang aktif di halaman ini"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					"aria-label": "Cari fitur",
					placeholder: "Cari fitur…",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "h-7 text-[11px] pl-7"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 mb-1.5",
				children: MAIN_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": category === c,
					onClick: () => setCategory(c),
					className: cn("h-6 px-2 rounded-full text-[10px] font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1", category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
					children: CATEGORY_LABELS[c]
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-muted-foreground mb-1.5",
				children: [
					enabledCount,
					" dari ",
					totalCount,
					" fitur aktif"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-0.5",
				children: filtered.map(([key, feature]) => {
					const isComingSoon = feature.comingSoon === true;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center justify-between px-2.5 py-2 rounded ${feature.enabled && !isComingSoon ? "bg-accent" : ""} ${isComingSoon ? "opacity-60" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 mr-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-md-xs font-medium text-foreground",
									children: feature.name || key
								}), isComingSoon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full",
									children: "CS"
								})]
							}), feature.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground truncate mt-0.5",
								children: feature.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [key === "openDetailInNewTab" && feature.modes && feature.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: feature.mode || "same-tab",
								onValueChange: (v) => onModeChange(key, v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-6 text-[10px] w-[90px]",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(feature.modes).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: k,
									className: "text-[10px]",
									children: v
								}, k)) })]
							}), !isComingSoon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: feature.enabled,
								onCheckedChange: (val) => onToggle(key, val),
								disabled
							})]
						})]
					}, key);
				})
			})
		]
	});
}
//#endregion
//#region src/popup/DomainPanel.tsx
function DomainPanel({ urls, onAdd, onRemove, onToggle }) {
	const [input, setInput] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const isValidUrl = (url) => {
		try {
			const p = new URL(url);
			return p.protocol === "http:" || p.protocol === "https:";
		} catch {
			return false;
		}
	};
	const handleAdd = () => {
		const trimmed = input.trim();
		if (!trimmed) {
			setError("Masukkan URL terlebih dahulu");
			return;
		}
		if (!isValidUrl(trimmed)) {
			setError("Format URL tidak valid");
			return;
		}
		if (urls.find((u) => u.url === trimmed)) {
			setError("URL sudah ada");
			return;
		}
		setError(null);
		onAdd(trimmed);
		setInput("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1.5 mb-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "text",
				value: input,
				onChange: (e) => {
					setInput(e.target.value);
					setError(null);
				},
				onKeyDown: (e) => e.key === "Enter" && handleAdd(),
				placeholder: "http://example.com",
				className: "flex-1"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "default",
				size: "xs",
				onClick: handleAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Tambah"]
			})]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] text-destructive mb-1",
			role: "alert",
			children: error
		}),
		urls.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-center text-md-xs text-muted-foreground py-3",
			children: "Belum ada URL"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-0.5",
			children: urls.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-accent group ${item.isDefault ? "bg-blue-50 dark:bg-blue-950/20" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: item.enabled,
						onCheckedChange: (val) => onToggle(item.id, val),
						className: "h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-[10px] text-foreground truncate font-mono",
						children: item.url
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[8px] font-semibold px-1 py-0.5 rounded ${item.isDefault ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-muted text-muted-foreground"}`,
						children: item.isDefault ? "DEFAULT" : "CUSTOM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onRemove(item.id),
						disabled: item.isDefault,
						"aria-label": `Hapus ${item.url}`,
						className: `p-0.5 rounded transition-colors ${item.isDefault ? "opacity-0" : "opacity-0 group-hover:opacity-100 hover:bg-accent"}`,
						title: "Hapus",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3 text-muted-foreground hover:text-destructive" })
					})
				]
			}, item.id))
		})
	] });
}
//#endregion
//#region src/features/shared/usageLog.ts
var KEY = "extUsageLog";
/** Ambil log (terbaru dulu) — utk viewer/console. */
async function getUsageLog() {
	try {
		const { [KEY]: entries } = await chrome.storage.local.get(KEY);
		return [...entries ?? []].reverse();
	} catch {
		return [];
	}
}
/** Bersihkan semua log. */
async function clearUsageLog() {
	try {
		await chrome.storage.local.remove(KEY);
	} catch {}
}
//#endregion
//#region src/popup/UsageLogPanel.tsx
function fmtTime(ts) {
	const d = new Date(ts);
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getDate()}/${d.getMonth() + 1} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
/**
* Panel log penggunaan & error fitur. Tersimpan lokal di browser ini
* (chrome.storage.local), auto-hapus > 1 minggu. Utk diagnosa bug lapangan.
*/
function UsageLogPanel() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(() => {
		getUsageLog().then((entries) => setLogs(entries.slice(0, 50)));
	}, []);
	(0, import_react.useEffect)(() => {
		if (expanded) refresh();
	}, [expanded, refresh]);
	const errors = logs.filter((l) => !l.ok).length;
	const handleClear = (0, import_react.useCallback)(() => {
		if (!confirm("Hapus semua log penggunaan di komputer ini?")) return;
		clearUsageLog().then(() => {
			setLogs([]);
			refresh();
		});
	}, [refresh]);
	if (!expanded) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setExpanded(true),
		className: "w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-md-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: "Log Penggunaan (7 hari)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `text-md-xs font-semibold ${errors > 0 ? "text-red-500" : "text-green-500"}`,
			children: logs.length === 0 ? "muat…" : `${logs.length} entri${errors > 0 ? ` · ${errors} error` : ""}`
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border rounded-md bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-3 py-1.5 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
				children: "Log Penggunaan (7 hari terakhir)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleClear,
					className: "text-[10px] px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20",
					children: "Hapus"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setExpanded(false),
					className: "text-[10px] px-2 py-0.5 rounded bg-accent text-foreground",
					children: "Tutup"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[220px] overflow-y-auto p-1.5 space-y-1 font-mono text-[10px]",
			children: [logs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground p-1",
				children: "Belum ada log."
			}), logs.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex gap-1.5 items-start rounded px-1.5 py-1 ${l.ok ? "bg-muted/40" : "bg-destructive/10"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground shrink-0",
						children: fmtTime(l.ts)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: l.ok ? "text-foreground" : "text-destructive",
						children: l.feature
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: l.event
					}),
					l.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground truncate max-w-[140px]",
						children: l.detail
					})
				]
			}, i))]
		})]
	});
}
//#endregion
//#region src/popup/App.tsx
async function loadAll() {
	try {
		const result = await sendMessage({ type: MessageTypes.GET_ALL });
		if (result?.config) return {
			config: result.config,
			urls: result.urls ?? []
		};
	} catch {}
	const c = await chrome.storage.local.get(["extensionConfig", "extensionCustomUrls"]);
	return {
		config: c.extensionConfig ?? {
			extensionEnabled: true,
			currentRole: "admin",
			features: {}
		},
		urls: c.extensionCustomUrls ?? []
	};
}
function reloadActiveTab() {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, (tabs) => {
		if (tabs[0]?.id) {
			chrome.tabs.reload(tabs[0].id);
			window.close();
		}
	});
}
function App() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [config, setConfig] = (0, import_react.useState)(null);
	const [urls, setUrls] = (0, import_react.useState)([]);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("fitur");
	const [activePath, setActivePath] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		loadAll().then((result) => {
			setConfig(result.config);
			setUrls(result.urls);
			setLoading(false);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		let alive = true;
		try {
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, (tabs) => {
				const url = tabs?.[0]?.url;
				if (alive && url) try {
					setActivePath(new URL(url).pathname);
				} catch {}
			});
		} catch {}
		return () => {
			alive = false;
		};
	}, []);
	const toastTimer = (0, import_react.useRef)(null);
	const showToast = (0, import_react.useCallback)((msg) => {
		if (toastTimer.current) clearTimeout(toastTimer.current);
		setToast(msg);
		toastTimer.current = setTimeout(() => setToast(null), 2e3);
	}, []);
	(0, import_react.useEffect)(() => () => {
		if (toastTimer.current) clearTimeout(toastTimer.current);
	}, []);
	const handleToggleExtension = (0, import_react.useCallback)(() => {
		if (!config) return;
		const next = !config.extensionEnabled;
		setConfig({
			...config,
			extensionEnabled: next
		});
		sendMessage({
			type: MessageTypes.TOGGLE_EXTENSION,
			enabled: next
		}).catch(() => showToast("Gagal mengubah status extension"));
		showToast(next ? "Extension diaktifkan" : "Extension dinonaktifkan");
		reloadActiveTab();
	}, [config, showToast]);
	const handleRoleChange = (0, import_react.useCallback)((role) => {
		if (!config) return;
		setConfig({
			...config,
			currentRole: role
		});
		sendMessage({
			type: MessageTypes.SET_ROLE,
			role
		}).catch(() => showToast("Gagal mengubah role"));
		showToast("Role berhasil diubah");
	}, [config, showToast]);
	const handleFeatureToggle = (0, import_react.useCallback)((key, value) => {
		if (!config) return;
		setConfig({
			...config,
			features: {
				...config.features,
				[key]: {
					...config.features[key],
					enabled: value
				}
			}
		});
		sendMessage({
			type: MessageTypes.TOGGLE_FEATURE,
			key,
			enabled: value
		}).then(() => reloadActiveTab()).catch(() => {
			setConfig((prev) => prev && {
				...prev,
				features: {
					...prev.features,
					[key]: {
						...prev.features[key],
						enabled: !value
					}
				}
			});
			showToast("Gagal mengubah fitur — state dikembalikan");
		});
	}, [config, showToast]);
	const handleModeChange = (0, import_react.useCallback)((key, mode) => {
		if (!config?.features[key]) return;
		setConfig({
			...config,
			features: {
				...config.features,
				[key]: {
					...config.features[key],
					mode
				}
			}
		});
		sendMessage({
			type: MessageTypes.CHANGE_FEATURE_MODE,
			key,
			mode
		}).catch(() => showToast("Gagal mengubah mode"));
		showToast("Mode berhasil diubah");
	}, [config, showToast]);
	const handleAddUrl = (0, import_react.useCallback)((url) => {
		const newUrl = {
			id: "url-" + Date.now(),
			url,
			enabled: true,
			isDefault: false
		};
		setUrls((prev) => [...prev, newUrl]);
		sendMessage({
			type: MessageTypes.ADD_URL,
			url
		}).then(() => {
			showToast("URL berhasil ditambahkan");
			reloadActiveTab();
		}).catch(() => {
			setUrls((prev) => prev.filter((u) => u.id !== newUrl.id));
			showToast("Gagal menambah URL — perubahan dibatalkan");
		});
	}, [showToast]);
	const handleRemoveUrl = (0, import_react.useCallback)((id) => {
		const previous = urls.find((u) => u.id === id);
		setUrls((prev) => prev.filter((u) => u.id !== id));
		sendMessage({
			type: MessageTypes.DELETE_URL,
			id
		}).then(() => reloadActiveTab()).catch(() => {
			if (previous) setUrls((prev) => [...prev, previous]);
			showToast("Gagal menghapus URL — perubahan dibatalkan");
		});
	}, [showToast, urls]);
	const handleToggleUrl = (0, import_react.useCallback)((id, value) => {
		setUrls((prev) => prev.map((u) => u.id === id ? {
			...u,
			enabled: value
		} : u));
		sendMessage({
			type: MessageTypes.TOGGLE_URL,
			id,
			enabled: value
		}).catch(() => showToast("Gagal mengubah URL"));
		reloadActiveTab();
	}, [showToast]);
	const handleReset = (0, import_react.useCallback)(() => {
		if (!confirm("Apakah Anda yakin ingin mereset ke pengaturan default?")) return;
		sendMessage({ type: MessageTypes.RESET_CONFIG }).catch(() => showToast("Gagal mereset konfigurasi"));
		setToast("Reset ke default");
		setTimeout(() => {
			loadAll().then((result) => {
				setConfig(result.config);
				setUrls(result.urls);
				reloadActiveTab();
			});
		}, 500);
	}, [showToast]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-[300px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-md-sm text-muted-foreground",
			children: "Memuat…"
		})
	});
	if (!config) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-[300px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-md-sm text-destructive",
			children: "Gagal memuat konfigurasi"
		})
	});
	const version = getVersionBadge();
	const featureKeys = Object.keys(config.features);
	const totalFeatures = featureKeys.length;
	const enabledFeatures = featureKeys.filter((k) => config.features[k]?.enabled && !config.features[k]?.comingSoon).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ErrorBoundary, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-[340px] min-h-[200px] max-h-[600px] flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 z-10 shrink-0 bg-background border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 pt-2.5 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-5 h-5 rounded bg-[#2469f0] flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white text-[10px] font-bold",
									children: "M"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-md-sm font-semibold text-foreground",
										children: "MORBIS Ext"
									}), version && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-1 py-0.5 rounded-full",
										children: version
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground truncate",
									children: "Produktivitas SIMRS"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, {
								enabled: config.extensionEnabled,
								role: config.currentRole,
								onToggle: handleToggleExtension,
								onRoleChange: handleRoleChange
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[10px] text-muted-foreground truncate",
							children: ["Halaman aktif: ", activePath || "—"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 px-3 pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-0.5 p-0.5 rounded-lg bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === "fitur",
						onClick: () => setTab("fitur"),
						className: cn("flex-1 h-7 rounded-md text-[11px] font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1", tab === "fitur" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"),
						children: "Fitur"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === "domain",
						onClick: () => setTab("domain"),
						className: cn("flex-1 h-7 rounded-md text-[11px] font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1", tab === "domain" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"),
						children: "Domain & Sistem"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-h-0 overflow-y-auto px-3 pb-2",
				children: tab === "fitur" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturesPanel, {
					features: config.features,
					role: config.currentRole,
					disabled: !config.extensionEnabled,
					onToggle: handleFeatureToggle,
					onModeChange: handleModeChange,
					pathname: activePath
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainPanel, {
							urls,
							onAdd: handleAddUrl,
							onRemove: handleRemoveUrl,
							onToggle: handleToggleUrl
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "xs",
								onClick: handleReset,
								className: "touch-manipulation",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Reset Default"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsageLogPanel, {})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-t border-border bg-background px-3 py-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] text-muted-foreground truncate",
						children: [
							enabledFeatures,
							" dari ",
							totalFeatures,
							" fitur aktif"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "xs",
						onClick: reloadActiveTab,
						className: "shrink-0 touch-manipulation",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Reload"]
					})]
				})
			})
		]
	}), toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up",
		role: "alert",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-2 bg-foreground text-background text-md-xs rounded-lg shadow-lg",
			children: toast
		})
	})] });
}
//#endregion
//#region popup/main.tsx
var root = document.getElementById("root");
if (root) (0, import_client.createRoot)(root).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
//#endregion
