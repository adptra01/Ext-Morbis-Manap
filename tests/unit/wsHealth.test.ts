import { describe, it, expect } from 'vitest';
import { nextHealth, type HealthState } from '../../src/features/shared/wsHealth.js';

/* Kotrak mesin kesehatan WebSocket native (MODE 1 NATIVE / MODE 2 fallback).
 * Mesin murni → diuji tanpa DOM. Menerjemahkan acceptance criteria 1-3. */

const cfg = { staleMax: 2 }; // praktis: 2 pengamatan diam = dianggap WS mati

function s0(): HealthState {
  return { nativeActive: true, staleStreak: 0, nativeSig: '', ourSig: '' };
}

describe('wsHealth - nextHealth (WS-health machine)', () => {
  it('WS sehat → DOM bergerak → jangan mulai polling (MODE 1)', () => {
    const r1 = nextHealth(s0(), { type: 'observe', signal: 'A' }, cfg);
    expect(r1.startPolling).toBe(false);
    expect(r1.next.nativeActive).toBe(true);

    // native terus gerak (signal berubah tiap pengamatan) → tetap tidak polling
    const r2 = nextHealth({ ...r1.next, nativeSig: 'A' }, { type: 'observe', signal: 'B' }, cfg);
    expect(r2.startPolling).toBe(false);
    expect(r2.next.nativeActive).toBe(true);
  });

  it('WS mati → DOM membeku ≥ staleMax → mulai polling fallback (MODE 2)', () => {
    // baseline siap: nativeSempat bergerak ke signal 'A' lalu membeku.
    const st = nextHealth(s0(), { type: 'observe', signal: 'A' }, cfg).next; // sekarang nativeSig=A
    // diam #1
    let r = nextHealth(st, { type: 'observe', signal: 'A' }, cfg);
    expect(r.startPolling).toBe(false);
    // diam #2 → lewat staleMax
    r = nextHealth(r.next, { type: 'observe', signal: 'A' }, cfg);
    expect(r.startPolling).toBe(true);
    expect(r.next.nativeActive).toBe(false);
  });

  it('WS pulih → DOM bergerak lagi → hentikan polling (kembali MODE 1)', () => {
    // bawa ke MODE 2 (fallback aktif)
    let st = nextHealth(s0(), { type: 'observe', signal: 'A' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: 'A' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: 'A' }, cfg).next; // kini nativeActive=false
    expect(st.nativeActive).toBe(false);

    // native menulis signal baru (recovery)
    const r = nextHealth(st, { type: 'observe', signal: 'Z' }, cfg);
    expect(r.stopPolling).toBe(true);
    expect(r.next.nativeActive).toBe(true);
  });

  it('perubahan DOM dari extension sendiri → TIDAK dianggap recovery (anti feedback-loop)', () => {
    // bawa ke MODE 2
    let st = nextHealth(s0(), { type: 'observe', signal: 'A' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: 'A' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: 'A' }, cfg).next;
    expect(st.nativeActive).toBe(false);

    // extension merender ulang → we-wrote → nativeSig ikut signal extension
    const w = nextHealth(st, { type: 'we-wrote', signal: 'EXT-7' }, cfg);
    expect(w.stopPolling).toBe(false); // jangan berhenti polling
    expect(w.next.ourSig).toBe('EXT-7');

    // pengamatan berikutnya melihat signal extension (value sama) → masih fallback, bukan recovery
    const r = nextHealth(w.next, { type: 'observe', signal: 'EXT-7' }, cfg);
    expect(r.stopPolling).toBe(false);
  });

  it('polling berhasil → tidak serta-merta reset nativeActive (tetap fallback sampai native bergerak)', () => {
    // MODE 2 tetap polling; hanya signal native yang mengubahnya.
    let st = nextHealth(s0(), { type: 'observe', signal: '' }, cfg).next; // native diam langsung
    st = nextHealth(st, { type: 'observe', signal: '' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: '' }, cfg).next;
    expect(st.nativeActive).toBe(false);

    const r = nextHealth(st, { type: 'observe', signal: '' }, cfg);
    expect(r.startPolling).toBe(false); // sudah fallback, tidak perlu re-start
    expect(r.next.nativeActive).toBe(false);
  });

  it('staleStreak tidak menumpuk liar saat fallback aktif', () => {
    // MODE 2, diam terus-menerus
    let st = nextHealth(s0(), { type: 'observe', signal: '' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: '' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: '' }, cfg).next;
    expect(st.nativeActive).toBe(false);

    const r = nextHealth(st, { type: 'observe', signal: '' }, cfg); // diam lagi
    expect(r.next.staleStreak).toBe(st.staleStreak); // tidak naik saat fallback
  });

  it('startup + DOM diam: TIDAK langsung fallback pada pengamatan pertama (butuh staleMax berturut)', () => {
    // Baru start: nativeSig kosong, DOM langsung diam. Pengamatan ke-1 bukan fallback.
    const r1 = nextHealth(s0(), { type: 'observe', signal: 'X' }, cfg);
    expect(r1.startPolling).toBe(false);
    expect(r1.next.nativeActive).toBe(true);

    // Pengamatan ke-1 yang masuk "diam" total justru X==nativeSig; baru setelah staleMax berturut.
    // Dengan staleMax=2: diam #1 dan #2 berturut → fallback, BUKAN langsung di #1.
    const r2 = nextHealth(r1.next, { type: 'observe', signal: 'X' }, cfg);
    expect(r2.startPolling).toBe(false); // stale #1
    const r3 = nextHealth(r2.next, { type: 'observe', signal: 'X' }, cfg);
    expect(r3.startPolling).toBe(true); // stale #2 → MODE 2

    // peluru tambahan: sejak awal sudah fallback salah karena DOM diam sejak load? Tidak —
    // grace period diberikan (staleMax berturut), jadi 1x diam tidak memicu fallback.
  });

  it('native menulis nilai BERBEDA pasca extension-write → terdeteksi recovery (stopPolling)', () => {
    // bawa ke MODE 2
    let st = nextHealth(s0(), { type: 'observe', signal: 'A' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: 'A' }, cfg).next;
    st = nextHealth(st, { type: 'observe', signal: 'A' }, cfg).next; // nativeActive=false
    expect(st.nativeActive).toBe(false);

    // extension re-render → we-wrote (signal EXT-1), tetap fallback
    const w = nextHealth(st, { type: 'we-wrote', signal: 'EXT-1' }, cfg);
    expect(w.stopPolling).toBe(false);

    // native muncul kembali dan menulis nilai BERBEDA dari tulis-extension → recovery (MODE 1)
    const r = nextHealth(w.next, { type: 'observe', signal: 'NATIVE-BARU' }, cfg);
    expect(r.stopPolling).toBe(true);
    expect(r.next.nativeActive).toBe(true);
  });
});
