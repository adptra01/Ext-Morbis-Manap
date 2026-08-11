/* wsHealth.ts — murni (tanpa DOM/timer): mesin status kesehatan WebSocket
 * native MORBIS, dipakai antrianFarmasiDisplay.ts sebagai MODE 1/2 switch.
 *
 * Prinsip: extension "mengamati" aktivitas DOM native, TIDAK menyentuh
 * window.WebSocket. Jika DOM native terus berubah → WS sehat → jangan polling
 * (MODE 1 / NATIVE). Jika membeku `staleMax` pengamatan berturut-turut → WS
 * dianggap mati → aktifkan polling fallback (MODE 2).
 *
 * `ourSig` membedakan perubahan yang extension tulis sendiri dari perubahan
 * eksternal/native, supaya tidak ada feedback-loop (render extension jangan
 * dianggap sebagai "native recovery").
 *
 * Semua logika murni → bisa diuji unit tanpa browser (acceptance 1-3).
 */

export type HealthState = {
  nativeActive: boolean; // true = native WS hidup → jangan polling
  staleStreak: number; // pengamatan diam berturut-turut
  nativeSig: string; // signature DOM native terakhir
  ourSig: string; // signature DOM yang BARU SAJA ditulis extension
};

export type HealthConfig = {
  staleMax: number; // berapa pengamatan diam sebelum dianggap WS mati
};

export type HealthAction =
  | { type: 'observe'; signal: string } // pengamatan DOM terbaru
  | { type: 'we-wrote'; signal: string }; // extension baru saja merender DOM

export type HealthResult = {
  next: HealthState;
  startPolling: boolean; // naik ke MODE 2 (fallback)
  stopPolling: boolean; // kembali ke MODE 1 (native recovery)
};

export function nextHealth(
  state: HealthState,
  action: HealthAction,
  config: HealthConfig,
): HealthResult {
  // Signal yang extension tulis sendiri: tidak pernah dianggap recovery native.
  if (action.type === 'we-wrote') {
    return {
      next: { ...state, nativeSig: action.signal, staleStreak: 0, ourSig: action.signal },
      startPolling: false,
      stopPolling: false,
    };
  }

  const sig = action.signal;
  // PERUBAHAN: native bergerak.
  if (sig !== state.nativeSig) {
    const recovered = sig !== state.ourSig; // perubahan itu bukan dari extension
    return {
      next: {
        ...state,
        nativeActive: recovered ? true : state.nativeActive,
        nativeSig: sig,
        staleStreak: 0,
        ourSig: recovered ? '' : state.ourSig,
      },
      startPolling: !state.nativeActive && !recovered, // masih fallback & bukan tulis sendiri → lanjut polling
      stopPolling: state.nativeActive === false && recovered, // pulih dari fallback → berhenti polling
    };
  }

  // DIAM: tidak ada perubahan pada pengamatan ini.
  // Saat sudah fallback (!nativeActive), jangan menumpuk streak tak terbatas;
  // saturasi agar tetap jadi penanda aktivitas terakhir.
  const streak = state.nativeActive ? state.staleStreak + 1 : state.staleStreak;
  if (state.nativeActive && streak >= config.staleMax) {
    // Native membeku cukup lama → WS dianggap mati → mulai polling fallback (MODE 2).
    return {
      next: { ...state, nativeActive: false, staleStreak: 0 },
      startPolling: true,
      stopPolling: false,
    };
  }
  return {
    next: { ...state, staleStreak: streak },
    startPolling: false,
    stopPolling: false,
  };
}
