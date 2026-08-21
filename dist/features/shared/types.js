'use strict';
var __morbis_feature = (() => {
  var n = Object.defineProperty;
  var s = Object.getOwnPropertyDescriptor;
  var a = Object.getOwnPropertyNames;
  var l = Object.prototype.hasOwnProperty;
  var g = (r, e) => {
      for (var o in e) n(r, o, { get: e[o], enumerable: !0 });
    },
    u = (r, e, o, i) => {
      if ((e && typeof e == 'object') || typeof e == 'function')
        for (let t of a(e))
          !l.call(r, t) &&
            t !== o &&
            n(r, t, { get: () => e[t], enumerable: !(i = s(e, t)) || i.enumerable });
      return r;
    };
  var d = (r) => u(n({}, '__esModule', { value: !0 }), r);
  var b = {};
  g(b, { getMorbisGlobals: () => c });
  function c() {
    return window;
  }
  return d(b);
})();
