'use strict';
var __morbis_feature = (() => {
  var By = Object.create;
  var vi = Object.defineProperty;
  var Py = Object.getOwnPropertyDescriptor;
  var Ny = Object.getOwnPropertyNames;
  var _y = Object.getPrototypeOf,
    Hy = Object.prototype.hasOwnProperty;
  var da = (e, t) => () => {
    try {
      return (t || e((t = { exports: {} }).exports, t), t.exports);
    } catch (a) {
      throw ((t = 0), a);
    }
  };
  var mm = (e, t, a, l) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let o of Ny(t))
        !Hy.call(e, o) &&
          o !== a &&
          vi(e, o, { get: () => t[o], enumerable: !(l = Py(t, o)) || l.enumerable });
    return e;
  };
  var R = (e, t, a) => (
      (a = e != null ? By(_y(e)) : {}),
      mm(t || !e || !e.__esModule ? vi(a, 'default', { value: e, enumerable: !0 }) : a, e)
    ),
    zy = (e) => mm(vi({}, '__esModule', { value: !0 }), e);
  var bm = da((Ie) => {
    'use strict';
    function Ii(e, t) {
      var a = e.length;
      e.push(t);
      e: for (; 0 < a;) {
        var l = (a - 1) >>> 1,
          o = e[l];
        if (0 < Ku(o, t)) ((e[l] = t), (e[a] = o), (a = l));
        else break e;
      }
    }
    function ma(e) {
      return e.length === 0 ? null : e[0];
    }
    function Qu(e) {
      if (e.length === 0) return null;
      var t = e[0],
        a = e.pop();
      if (a !== t) {
        e[0] = a;
        e: for (var l = 0, o = e.length, n = o >>> 1; l < n;) {
          var u = 2 * (l + 1) - 1,
            r = e[u],
            s = u + 1,
            i = e[s];
          if (0 > Ku(r, a))
            s < o && 0 > Ku(i, r)
              ? ((e[l] = i), (e[s] = a), (l = s))
              : ((e[l] = r), (e[u] = a), (l = u));
          else if (s < o && 0 > Ku(i, a)) ((e[l] = i), (e[s] = a), (l = s));
          else break e;
        }
      }
      return t;
    }
    function Ku(e, t) {
      var a = e.sortIndex - t.sortIndex;
      return a !== 0 ? a : e.id - t.id;
    }
    Ie.unstable_now = void 0;
    typeof performance == 'object' && typeof performance.now == 'function'
      ? ((pm = performance),
        (Ie.unstable_now = function () {
          return pm.now();
        }))
      : ((yi = Date),
        (hm = yi.now()),
        (Ie.unstable_now = function () {
          return yi.now() - hm;
        }));
    var pm,
      yi,
      hm,
      Aa = [],
      Ja = [],
      Uy = 1,
      zt = null,
      ot = 3,
      wi = !1,
      En = !1,
      On = !1,
      Ri = !1,
      Lm = typeof setTimeout == 'function' ? setTimeout : null,
      Sm = typeof clearTimeout == 'function' ? clearTimeout : null,
      gm = typeof setImmediate < 'u' ? setImmediate : null;
    function Zu(e) {
      for (var t = ma(Ja); t !== null;) {
        if (t.callback === null) Qu(Ja);
        else if (t.startTime <= e) (Qu(Ja), (t.sortIndex = t.expirationTime), Ii(Aa, t));
        else break;
        t = ma(Ja);
      }
    }
    function Ai(e) {
      if (((On = !1), Zu(e), !En))
        if (ma(Aa) !== null) ((En = !0), Io || ((Io = !0), bo()));
        else {
          var t = ma(Ja);
          t !== null && Ti(Ai, t.startTime - e);
        }
    }
    var Io = !1,
      Bn = -1,
      vm = 5,
      ym = -1;
    function Cm() {
      return Ri ? !0 : !(Ie.unstable_now() - ym < vm);
    }
    function Ci() {
      if (((Ri = !1), Io)) {
        var e = Ie.unstable_now();
        ym = e;
        var t = !0;
        try {
          e: {
            ((En = !1), On && ((On = !1), Sm(Bn), (Bn = -1)), (wi = !0));
            var a = ot;
            try {
              t: {
                for (Zu(e), zt = ma(Aa); zt !== null && !(zt.expirationTime > e && Cm());) {
                  var l = zt.callback;
                  if (typeof l == 'function') {
                    ((zt.callback = null), (ot = zt.priorityLevel));
                    var o = l(zt.expirationTime <= e);
                    if (((e = Ie.unstable_now()), typeof o == 'function')) {
                      ((zt.callback = o), Zu(e), (t = !0));
                      break t;
                    }
                    (zt === ma(Aa) && Qu(Aa), Zu(e));
                  } else Qu(Aa);
                  zt = ma(Aa);
                }
                if (zt !== null) t = !0;
                else {
                  var n = ma(Ja);
                  (n !== null && Ti(Ai, n.startTime - e), (t = !1));
                }
              }
              break e;
            } finally {
              ((zt = null), (ot = a), (wi = !1));
            }
            t = void 0;
          }
        } finally {
          t ? bo() : (Io = !1);
        }
      }
    }
    var bo;
    typeof gm == 'function'
      ? (bo = function () {
          gm(Ci);
        })
      : typeof MessageChannel < 'u'
        ? ((bi = new MessageChannel()),
          (xm = bi.port2),
          (bi.port1.onmessage = Ci),
          (bo = function () {
            xm.postMessage(null);
          }))
        : (bo = function () {
            Lm(Ci, 0);
          });
    var bi, xm;
    function Ti(e, t) {
      Bn = Lm(function () {
        e(Ie.unstable_now());
      }, t);
    }
    Ie.unstable_IdlePriority = 5;
    Ie.unstable_ImmediatePriority = 1;
    Ie.unstable_LowPriority = 4;
    Ie.unstable_NormalPriority = 3;
    Ie.unstable_Profiling = null;
    Ie.unstable_UserBlockingPriority = 2;
    Ie.unstable_cancelCallback = function (e) {
      e.callback = null;
    };
    Ie.unstable_forceFrameRate = function (e) {
      0 > e || 125 < e
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
          )
        : (vm = 0 < e ? Math.floor(1e3 / e) : 5);
    };
    Ie.unstable_getCurrentPriorityLevel = function () {
      return ot;
    };
    Ie.unstable_next = function (e) {
      switch (ot) {
        case 1:
        case 2:
        case 3:
          var t = 3;
          break;
        default:
          t = ot;
      }
      var a = ot;
      ot = t;
      try {
        return e();
      } finally {
        ot = a;
      }
    };
    Ie.unstable_requestPaint = function () {
      Ri = !0;
    };
    Ie.unstable_runWithPriority = function (e, t) {
      switch (e) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          e = 3;
      }
      var a = ot;
      ot = e;
      try {
        return t();
      } finally {
        ot = a;
      }
    };
    Ie.unstable_scheduleCallback = function (e, t, a) {
      var l = Ie.unstable_now();
      switch (
        (typeof a == 'object' && a !== null
          ? ((a = a.delay), (a = typeof a == 'number' && 0 < a ? l + a : l))
          : (a = l),
        e)
      ) {
        case 1:
          var o = -1;
          break;
        case 2:
          o = 250;
          break;
        case 5:
          o = 1073741823;
          break;
        case 4:
          o = 1e4;
          break;
        default:
          o = 5e3;
      }
      return (
        (o = a + o),
        (e = {
          id: Uy++,
          callback: t,
          priorityLevel: e,
          startTime: a,
          expirationTime: o,
          sortIndex: -1,
        }),
        a > l
          ? ((e.sortIndex = a),
            Ii(Ja, e),
            ma(Aa) === null &&
              e === ma(Ja) &&
              (On ? (Sm(Bn), (Bn = -1)) : (On = !0), Ti(Ai, a - l)))
          : ((e.sortIndex = o), Ii(Aa, e), En || wi || ((En = !0), Io || ((Io = !0), bo()))),
        e
      );
    };
    Ie.unstable_shouldYield = Cm;
    Ie.unstable_wrapCallback = function (e) {
      var t = ot;
      return function () {
        var a = ot;
        ot = t;
        try {
          return e.apply(this, arguments);
        } finally {
          ot = a;
        }
      };
    };
  });
  var wm = da((CA, Im) => {
    'use strict';
    Im.exports = bm();
  });
  var Nm = da((X) => {
    'use strict';
    var Di = Symbol.for('react.transitional.element'),
      qy = Symbol.for('react.portal'),
      Fy = Symbol.for('react.fragment'),
      Gy = Symbol.for('react.strict_mode'),
      Vy = Symbol.for('react.profiler'),
      Xy = Symbol.for('react.consumer'),
      jy = Symbol.for('react.context'),
      Yy = Symbol.for('react.forward_ref'),
      Ky = Symbol.for('react.suspense'),
      Zy = Symbol.for('react.memo'),
      Mm = Symbol.for('react.lazy'),
      Qy = Symbol.for('react.activity'),
      Rm = Symbol.iterator;
    function Wy(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (Rm && e[Rm]) || e['@@iterator']), typeof e == 'function' ? e : null);
    }
    var Dm = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      Em = Object.assign,
      Om = {};
    function Ro(e, t, a) {
      ((this.props = e), (this.context = t), (this.refs = Om), (this.updater = a || Dm));
    }
    Ro.prototype.isReactComponent = {};
    Ro.prototype.setState = function (e, t) {
      if (typeof e != 'object' && typeof e != 'function' && e != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, e, t, 'setState');
    };
    Ro.prototype.forceUpdate = function (e) {
      this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
    };
    function Bm() {}
    Bm.prototype = Ro.prototype;
    function Ei(e, t, a) {
      ((this.props = e), (this.context = t), (this.refs = Om), (this.updater = a || Dm));
    }
    var Oi = (Ei.prototype = new Bm());
    Oi.constructor = Ei;
    Em(Oi, Ro.prototype);
    Oi.isPureReactComponent = !0;
    var Am = Array.isArray;
    function Mi() {}
    var Se = { H: null, A: null, T: null, S: null },
      Pm = Object.prototype.hasOwnProperty;
    function Bi(e, t, a) {
      var l = a.ref;
      return { $$typeof: Di, type: e, key: t, ref: l !== void 0 ? l : null, props: a };
    }
    function Jy(e, t) {
      return Bi(e.type, t, e.props);
    }
    function Pi(e) {
      return typeof e == 'object' && e !== null && e.$$typeof === Di;
    }
    function $y(e) {
      var t = { '=': '=0', ':': '=2' };
      return (
        '$' +
        e.replace(/[=:]/g, function (a) {
          return t[a];
        })
      );
    }
    var Tm = /\/+/g;
    function ki(e, t) {
      return typeof e == 'object' && e !== null && e.key != null ? $y('' + e.key) : t.toString(36);
    }
    function eC(e) {
      switch (e.status) {
        case 'fulfilled':
          return e.value;
        case 'rejected':
          throw e.reason;
        default:
          switch (
            (typeof e.status == 'string'
              ? e.then(Mi, Mi)
              : ((e.status = 'pending'),
                e.then(
                  function (t) {
                    e.status === 'pending' && ((e.status = 'fulfilled'), (e.value = t));
                  },
                  function (t) {
                    e.status === 'pending' && ((e.status = 'rejected'), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case 'fulfilled':
              return e.value;
            case 'rejected':
              throw e.reason;
          }
      }
      throw e;
    }
    function wo(e, t, a, l, o) {
      var n = typeof e;
      (n === 'undefined' || n === 'boolean') && (e = null);
      var u = !1;
      if (e === null) u = !0;
      else
        switch (n) {
          case 'bigint':
          case 'string':
          case 'number':
            u = !0;
            break;
          case 'object':
            switch (e.$$typeof) {
              case Di:
              case qy:
                u = !0;
                break;
              case Mm:
                return ((u = e._init), wo(u(e._payload), t, a, l, o));
            }
        }
      if (u)
        return (
          (o = o(e)),
          (u = l === '' ? '.' + ki(e, 0) : l),
          Am(o)
            ? ((a = ''),
              u != null && (a = u.replace(Tm, '$&/') + '/'),
              wo(o, t, a, '', function (i) {
                return i;
              }))
            : o != null &&
              (Pi(o) &&
                (o = Jy(
                  o,
                  a +
                    (o.key == null || (e && e.key === o.key)
                      ? ''
                      : ('' + o.key).replace(Tm, '$&/') + '/') +
                    u,
                )),
              t.push(o)),
          1
        );
      u = 0;
      var r = l === '' ? '.' : l + ':';
      if (Am(e))
        for (var s = 0; s < e.length; s++)
          ((l = e[s]), (n = r + ki(l, s)), (u += wo(l, t, a, n, o)));
      else if (((s = Wy(e)), typeof s == 'function'))
        for (e = s.call(e), s = 0; !(l = e.next()).done;)
          ((l = l.value), (n = r + ki(l, s++)), (u += wo(l, t, a, n, o)));
      else if (n === 'object') {
        if (typeof e.then == 'function') return wo(eC(e), t, a, l, o);
        throw (
          (t = String(e)),
          Error(
            'Objects are not valid as a React child (found: ' +
              (t === '[object Object]'
                ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                : t) +
              '). If you meant to render a collection of children, use an array instead.',
          )
        );
      }
      return u;
    }
    function Wu(e, t, a) {
      if (e == null) return e;
      var l = [],
        o = 0;
      return (
        wo(e, l, '', '', function (n) {
          return t.call(a, n, o++);
        }),
        l
      );
    }
    function tC(e) {
      if (e._status === -1) {
        var t = e._result;
        ((t = t()),
          t.then(
            function (a) {
              (e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = a));
            },
            function (a) {
              (e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = a));
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var km =
        typeof reportError == 'function'
          ? reportError
          : function (e) {
              if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
                var t = new window.ErrorEvent('error', {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == 'object' && e !== null && typeof e.message == 'string'
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (typeof process == 'object' && typeof process.emit == 'function') {
                process.emit('uncaughtException', e);
                return;
              }
              console.error(e);
            },
      aC = {
        map: Wu,
        forEach: function (e, t, a) {
          Wu(
            e,
            function () {
              t.apply(this, arguments);
            },
            a,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            Wu(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            Wu(e, function (t) {
              return t;
            }) || []
          );
        },
        only: function (e) {
          if (!Pi(e))
            throw Error('React.Children.only expected to receive a single React element child.');
          return e;
        },
      };
    X.Activity = Qy;
    X.Children = aC;
    X.Component = Ro;
    X.Fragment = Fy;
    X.Profiler = Vy;
    X.PureComponent = Ei;
    X.StrictMode = Gy;
    X.Suspense = Ky;
    X.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Se;
    X.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (e) {
        return Se.H.useMemoCache(e);
      },
    };
    X.cache = function (e) {
      return function () {
        return e.apply(null, arguments);
      };
    };
    X.cacheSignal = function () {
      return null;
    };
    X.cloneElement = function (e, t, a) {
      if (e == null) throw Error('The argument must be a React element, but you passed ' + e + '.');
      var l = Em({}, e.props),
        o = e.key;
      if (t != null)
        for (n in (t.key !== void 0 && (o = '' + t.key), t))
          !Pm.call(t, n) ||
            n === 'key' ||
            n === '__self' ||
            n === '__source' ||
            (n === 'ref' && t.ref === void 0) ||
            (l[n] = t[n]);
      var n = arguments.length - 2;
      if (n === 1) l.children = a;
      else if (1 < n) {
        for (var u = Array(n), r = 0; r < n; r++) u[r] = arguments[r + 2];
        l.children = u;
      }
      return Bi(e.type, o, l);
    };
    X.createContext = function (e) {
      return (
        (e = {
          $$typeof: jy,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (e.Provider = e),
        (e.Consumer = { $$typeof: Xy, _context: e }),
        e
      );
    };
    X.createElement = function (e, t, a) {
      var l,
        o = {},
        n = null;
      if (t != null)
        for (l in (t.key !== void 0 && (n = '' + t.key), t))
          Pm.call(t, l) && l !== 'key' && l !== '__self' && l !== '__source' && (o[l] = t[l]);
      var u = arguments.length - 2;
      if (u === 1) o.children = a;
      else if (1 < u) {
        for (var r = Array(u), s = 0; s < u; s++) r[s] = arguments[s + 2];
        o.children = r;
      }
      if (e && e.defaultProps)
        for (l in ((u = e.defaultProps), u)) o[l] === void 0 && (o[l] = u[l]);
      return Bi(e, n, o);
    };
    X.createRef = function () {
      return { current: null };
    };
    X.forwardRef = function (e) {
      return { $$typeof: Yy, render: e };
    };
    X.isValidElement = Pi;
    X.lazy = function (e) {
      return { $$typeof: Mm, _payload: { _status: -1, _result: e }, _init: tC };
    };
    X.memo = function (e, t) {
      return { $$typeof: Zy, type: e, compare: t === void 0 ? null : t };
    };
    X.startTransition = function (e) {
      var t = Se.T,
        a = {};
      Se.T = a;
      try {
        var l = e(),
          o = Se.S;
        (o !== null && o(a, l),
          typeof l == 'object' && l !== null && typeof l.then == 'function' && l.then(Mi, km));
      } catch (n) {
        km(n);
      } finally {
        (t !== null && a.types !== null && (t.types = a.types), (Se.T = t));
      }
    };
    X.unstable_useCacheRefresh = function () {
      return Se.H.useCacheRefresh();
    };
    X.use = function (e) {
      return Se.H.use(e);
    };
    X.useActionState = function (e, t, a) {
      return Se.H.useActionState(e, t, a);
    };
    X.useCallback = function (e, t) {
      return Se.H.useCallback(e, t);
    };
    X.useContext = function (e) {
      return Se.H.useContext(e);
    };
    X.useDebugValue = function () {};
    X.useDeferredValue = function (e, t) {
      return Se.H.useDeferredValue(e, t);
    };
    X.useEffect = function (e, t) {
      return Se.H.useEffect(e, t);
    };
    X.useEffectEvent = function (e) {
      return Se.H.useEffectEvent(e);
    };
    X.useId = function () {
      return Se.H.useId();
    };
    X.useImperativeHandle = function (e, t, a) {
      return Se.H.useImperativeHandle(e, t, a);
    };
    X.useInsertionEffect = function (e, t) {
      return Se.H.useInsertionEffect(e, t);
    };
    X.useLayoutEffect = function (e, t) {
      return Se.H.useLayoutEffect(e, t);
    };
    X.useMemo = function (e, t) {
      return Se.H.useMemo(e, t);
    };
    X.useOptimistic = function (e, t) {
      return Se.H.useOptimistic(e, t);
    };
    X.useReducer = function (e, t, a) {
      return Se.H.useReducer(e, t, a);
    };
    X.useRef = function (e) {
      return Se.H.useRef(e);
    };
    X.useState = function (e) {
      return Se.H.useState(e);
    };
    X.useSyncExternalStore = function (e, t, a) {
      return Se.H.useSyncExternalStore(e, t, a);
    };
    X.useTransition = function () {
      return Se.H.useTransition();
    };
    X.version = '19.2.7';
  });
  var P = da((IA, _m) => {
    'use strict';
    _m.exports = Nm();
  });
  var zm = da((ft) => {
    'use strict';
    var lC = P();
    function Hm(e) {
      var t = 'https://react.dev/errors/' + e;
      if (1 < arguments.length) {
        t += '?args[]=' + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++)
          t += '&args[]=' + encodeURIComponent(arguments[a]);
      }
      return (
        'Minified React error #' +
        e +
        '; visit ' +
        t +
        ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
      );
    }
    function $a() {}
    var it = {
        d: {
          f: $a,
          r: function () {
            throw Error(Hm(522));
          },
          D: $a,
          C: $a,
          L: $a,
          m: $a,
          X: $a,
          S: $a,
          M: $a,
        },
        p: 0,
        findDOMNode: null,
      },
      oC = Symbol.for('react.portal');
    function nC(e, t, a) {
      var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: oC,
        key: l == null ? null : '' + l,
        children: e,
        containerInfo: t,
        implementation: a,
      };
    }
    var Pn = lC.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function Ju(e, t) {
      if (e === 'font') return '';
      if (typeof t == 'string') return t === 'use-credentials' ? t : '';
    }
    ft.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = it;
    ft.createPortal = function (e, t) {
      var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)) throw Error(Hm(299));
      return nC(e, t, null, a);
    };
    ft.flushSync = function (e) {
      var t = Pn.T,
        a = it.p;
      try {
        if (((Pn.T = null), (it.p = 2), e)) return e();
      } finally {
        ((Pn.T = t), (it.p = a), it.d.f());
      }
    };
    ft.preconnect = function (e, t) {
      typeof e == 'string' &&
        (t
          ? ((t = t.crossOrigin),
            (t = typeof t == 'string' ? (t === 'use-credentials' ? t : '') : void 0))
          : (t = null),
        it.d.C(e, t));
    };
    ft.prefetchDNS = function (e) {
      typeof e == 'string' && it.d.D(e);
    };
    ft.preinit = function (e, t) {
      if (typeof e == 'string' && t && typeof t.as == 'string') {
        var a = t.as,
          l = Ju(a, t.crossOrigin),
          o = typeof t.integrity == 'string' ? t.integrity : void 0,
          n = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0;
        a === 'style'
          ? it.d.S(e, typeof t.precedence == 'string' ? t.precedence : void 0, {
              crossOrigin: l,
              integrity: o,
              fetchPriority: n,
            })
          : a === 'script' &&
            it.d.X(e, {
              crossOrigin: l,
              integrity: o,
              fetchPriority: n,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
      }
    };
    ft.preinitModule = function (e, t) {
      if (typeof e == 'string')
        if (typeof t == 'object' && t !== null) {
          if (t.as == null || t.as === 'script') {
            var a = Ju(t.as, t.crossOrigin);
            it.d.M(e, {
              crossOrigin: a,
              integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
          }
        } else t == null && it.d.M(e);
    };
    ft.preload = function (e, t) {
      if (typeof e == 'string' && typeof t == 'object' && t !== null && typeof t.as == 'string') {
        var a = t.as,
          l = Ju(a, t.crossOrigin);
        it.d.L(e, a, {
          crossOrigin: l,
          integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
          type: typeof t.type == 'string' ? t.type : void 0,
          fetchPriority: typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0,
          referrerPolicy: typeof t.referrerPolicy == 'string' ? t.referrerPolicy : void 0,
          imageSrcSet: typeof t.imageSrcSet == 'string' ? t.imageSrcSet : void 0,
          imageSizes: typeof t.imageSizes == 'string' ? t.imageSizes : void 0,
          media: typeof t.media == 'string' ? t.media : void 0,
        });
      }
    };
    ft.preloadModule = function (e, t) {
      if (typeof e == 'string')
        if (t) {
          var a = Ju(t.as, t.crossOrigin);
          it.d.m(e, {
            as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0,
            crossOrigin: a,
            integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          });
        } else it.d.m(e);
    };
    ft.requestFormReset = function (e) {
      it.d.r(e);
    };
    ft.unstable_batchedUpdates = function (e, t) {
      return e(t);
    };
    ft.useFormState = function (e, t, a) {
      return Pn.H.useFormState(e, t, a);
    };
    ft.useFormStatus = function () {
      return Pn.H.useHostTransitionStatus();
    };
    ft.version = '19.2.7';
  });
  var Ao = da((RA, qm) => {
    'use strict';
    function Um() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Um);
        } catch (e) {
          console.error(e);
        }
    }
    (Um(), (qm.exports = zm()));
  });
  var $x = da((bs) => {
    'use strict';
    var Fe = wm(),
      mh = P(),
      uC = Ao();
    function w(e) {
      var t = 'https://react.dev/errors/' + e;
      if (1 < arguments.length) {
        t += '?args[]=' + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++)
          t += '&args[]=' + encodeURIComponent(arguments[a]);
      }
      return (
        'Minified React error #' +
        e +
        '; visit ' +
        t +
        ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
      );
    }
    function ph(e) {
      return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
    }
    function yu(e) {
      var t = e,
        a = e;
      if (e.alternate) for (; t.return;) t = t.return;
      else {
        e = t;
        do ((t = e), (t.flags & 4098) !== 0 && (a = t.return), (e = t.return));
        while (e);
      }
      return t.tag === 3 ? a : null;
    }
    function hh(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
          return t.dehydrated;
      }
      return null;
    }
    function gh(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
          return t.dehydrated;
      }
      return null;
    }
    function Fm(e) {
      if (yu(e) !== e) throw Error(w(188));
    }
    function rC(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = yu(e)), t === null)) throw Error(w(188));
        return t !== e ? null : e;
      }
      for (var a = e, l = t; ;) {
        var o = a.return;
        if (o === null) break;
        var n = o.alternate;
        if (n === null) {
          if (((l = o.return), l !== null)) {
            a = l;
            continue;
          }
          break;
        }
        if (o.child === n.child) {
          for (n = o.child; n;) {
            if (n === a) return (Fm(o), e);
            if (n === l) return (Fm(o), t);
            n = n.sibling;
          }
          throw Error(w(188));
        }
        if (a.return !== l.return) ((a = o), (l = n));
        else {
          for (var u = !1, r = o.child; r;) {
            if (r === a) {
              ((u = !0), (a = o), (l = n));
              break;
            }
            if (r === l) {
              ((u = !0), (l = o), (a = n));
              break;
            }
            r = r.sibling;
          }
          if (!u) {
            for (r = n.child; r;) {
              if (r === a) {
                ((u = !0), (a = n), (l = o));
                break;
              }
              if (r === l) {
                ((u = !0), (l = n), (a = o));
                break;
              }
              r = r.sibling;
            }
            if (!u) throw Error(w(189));
          }
        }
        if (a.alternate !== l) throw Error(w(190));
      }
      if (a.tag !== 3) throw Error(w(188));
      return a.stateNode.current === a ? e : t;
    }
    function xh(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null;) {
        if (((t = xh(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    var Ce = Object.assign,
      sC = Symbol.for('react.element'),
      $u = Symbol.for('react.transitional.element'),
      Gn = Symbol.for('react.portal'),
      Oo = Symbol.for('react.fragment'),
      Lh = Symbol.for('react.strict_mode'),
      gf = Symbol.for('react.profiler'),
      Sh = Symbol.for('react.consumer'),
      Pa = Symbol.for('react.context'),
      cc = Symbol.for('react.forward_ref'),
      xf = Symbol.for('react.suspense'),
      Lf = Symbol.for('react.suspense_list'),
      dc = Symbol.for('react.memo'),
      el = Symbol.for('react.lazy'),
      Sf = Symbol.for('react.activity'),
      iC = Symbol.for('react.memo_cache_sentinel'),
      Gm = Symbol.iterator;
    function Nn(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (Gm && e[Gm]) || e['@@iterator']), typeof e == 'function' ? e : null);
    }
    var fC = Symbol.for('react.client.reference');
    function vf(e) {
      if (e == null) return null;
      if (typeof e == 'function') return e.$$typeof === fC ? null : e.displayName || e.name || null;
      if (typeof e == 'string') return e;
      switch (e) {
        case Oo:
          return 'Fragment';
        case gf:
          return 'Profiler';
        case Lh:
          return 'StrictMode';
        case xf:
          return 'Suspense';
        case Lf:
          return 'SuspenseList';
        case Sf:
          return 'Activity';
      }
      if (typeof e == 'object')
        switch (e.$$typeof) {
          case Gn:
            return 'Portal';
          case Pa:
            return e.displayName || 'Context';
          case Sh:
            return (e._context.displayName || 'Context') + '.Consumer';
          case cc:
            var t = e.render;
            return (
              (e = e.displayName),
              e ||
                ((e = t.displayName || t.name || ''),
                (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
              e
            );
          case dc:
            return ((t = e.displayName || null), t !== null ? t : vf(e.type) || 'Memo');
          case el:
            ((t = e._payload), (e = e._init));
            try {
              return vf(e(t));
            } catch {}
        }
      return null;
    }
    var Vn = Array.isArray,
      N = mh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      ne = uC.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      Fl = { pending: !1, data: null, method: null, action: null },
      yf = [],
      Bo = -1;
    function La(e) {
      return { current: e };
    }
    function Ke(e) {
      0 > Bo || ((e.current = yf[Bo]), (yf[Bo] = null), Bo--);
    }
    function xe(e, t) {
      (Bo++, (yf[Bo] = e.current), (e.current = t));
    }
    var xa = La(null),
      ru = La(null),
      cl = La(null),
      Er = La(null);
    function Or(e, t) {
      switch ((xe(cl, t), xe(ru, e), xe(xa, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Qp(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI))) ((t = Qp(t)), (e = zx(t, e)));
          else
            switch (e) {
              case 'svg':
                e = 1;
                break;
              case 'math':
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      (Ke(xa), xe(xa, e));
    }
    function Jo() {
      (Ke(xa), Ke(ru), Ke(cl));
    }
    function Cf(e) {
      e.memoizedState !== null && xe(Er, e);
      var t = xa.current,
        a = zx(t, e.type);
      t !== a && (xe(ru, e), xe(xa, a));
    }
    function Br(e) {
      (ru.current === e && (Ke(xa), Ke(ru)), Er.current === e && (Ke(Er), (Lu._currentValue = Fl)));
    }
    var Ni, Vm;
    function Hl(e) {
      if (Ni === void 0)
        try {
          throw Error();
        } catch (a) {
          var t = a.stack.trim().match(/\n( *(at )?)/);
          ((Ni = (t && t[1]) || ''),
            (Vm =
              -1 <
              a.stack.indexOf(`
    at`)
                ? ' (<anonymous>)'
                : -1 < a.stack.indexOf('@')
                  ? '@unknown:0:0'
                  : ''));
        }
      return (
        `
` +
        Ni +
        e +
        Vm
      );
    }
    var _i = !1;
    function Hi(e, t) {
      if (!e || _i) return '';
      _i = !0;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var l = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var p = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(p.prototype, 'props', {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == 'object' && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(p, []);
                  } catch (h) {
                    var m = h;
                  }
                  Reflect.construct(e, [], p);
                } else {
                  try {
                    p.call();
                  } catch (h) {
                    m = h;
                  }
                  e.call(p.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (h) {
                  m = h;
                }
                (p = e()) && typeof p.catch == 'function' && p.catch(function () {});
              }
            } catch (h) {
              if (h && m && typeof h.stack == 'string') return [h.stack, m.stack];
            }
            return [null, null];
          },
        };
        l.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
        var o = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, 'name');
        o &&
          o.configurable &&
          Object.defineProperty(l.DetermineComponentFrameRoot, 'name', {
            value: 'DetermineComponentFrameRoot',
          });
        var n = l.DetermineComponentFrameRoot(),
          u = n[0],
          r = n[1];
        if (u && r) {
          var s = u.split(`
`),
            i = r.split(`
`);
          for (o = l = 0; l < s.length && !s[l].includes('DetermineComponentFrameRoot');) l++;
          for (; o < i.length && !i[o].includes('DetermineComponentFrameRoot');) o++;
          if (l === s.length || o === i.length)
            for (l = s.length - 1, o = i.length - 1; 1 <= l && 0 <= o && s[l] !== i[o];) o--;
          for (; 1 <= l && 0 <= o; l--, o--)
            if (s[l] !== i[o]) {
              if (l !== 1 || o !== 1)
                do
                  if ((l--, o--, 0 > o || s[l] !== i[o])) {
                    var c =
                      `
` + s[l].replace(' at new ', ' at ');
                    return (
                      e.displayName &&
                        c.includes('<anonymous>') &&
                        (c = c.replace('<anonymous>', e.displayName)),
                      c
                    );
                  }
                while (1 <= l && 0 <= o);
              break;
            }
        }
      } finally {
        ((_i = !1), (Error.prepareStackTrace = a));
      }
      return (a = e ? e.displayName || e.name : '') ? Hl(a) : '';
    }
    function cC(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Hl(e.type);
        case 16:
          return Hl('Lazy');
        case 13:
          return e.child !== t && t !== null ? Hl('Suspense Fallback') : Hl('Suspense');
        case 19:
          return Hl('SuspenseList');
        case 0:
        case 15:
          return Hi(e.type, !1);
        case 11:
          return Hi(e.type.render, !1);
        case 1:
          return Hi(e.type, !0);
        case 31:
          return Hl('Activity');
        default:
          return '';
      }
    }
    function Xm(e) {
      try {
        var t = '',
          a = null;
        do ((t += cC(e, a)), (a = e), (e = e.return));
        while (e);
        return t;
      } catch (l) {
        return (
          `
Error generating stack: ` +
          l.message +
          `
` +
          l.stack
        );
      }
    }
    var bf = Object.prototype.hasOwnProperty,
      mc = Fe.unstable_scheduleCallback,
      zi = Fe.unstable_cancelCallback,
      dC = Fe.unstable_shouldYield,
      mC = Fe.unstable_requestPaint,
      Dt = Fe.unstable_now,
      pC = Fe.unstable_getCurrentPriorityLevel,
      vh = Fe.unstable_ImmediatePriority,
      yh = Fe.unstable_UserBlockingPriority,
      Pr = Fe.unstable_NormalPriority,
      hC = Fe.unstable_LowPriority,
      Ch = Fe.unstable_IdlePriority,
      gC = Fe.log,
      xC = Fe.unstable_setDisableYieldValue,
      Cu = null,
      Et = null;
    function ul(e) {
      if ((typeof gC == 'function' && xC(e), Et && typeof Et.setStrictMode == 'function'))
        try {
          Et.setStrictMode(Cu, e);
        } catch {}
    }
    var Ot = Math.clz32 ? Math.clz32 : vC,
      LC = Math.log,
      SC = Math.LN2;
    function vC(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((LC(e) / SC) | 0)) | 0);
    }
    var er = 256,
      tr = 262144,
      ar = 4194304;
    function zl(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function rs(e, t, a) {
      var l = e.pendingLanes;
      if (l === 0) return 0;
      var o = 0,
        n = e.suspendedLanes,
        u = e.pingedLanes;
      e = e.warmLanes;
      var r = l & 134217727;
      return (
        r !== 0
          ? ((l = r & ~n),
            l !== 0
              ? (o = zl(l))
              : ((u &= r), u !== 0 ? (o = zl(u)) : a || ((a = r & ~e), a !== 0 && (o = zl(a)))))
          : ((r = l & ~n),
            r !== 0
              ? (o = zl(r))
              : u !== 0
                ? (o = zl(u))
                : a || ((a = l & ~e), a !== 0 && (o = zl(a)))),
        o === 0
          ? 0
          : t !== 0 &&
              t !== o &&
              (t & n) === 0 &&
              ((n = o & -o), (a = t & -t), n >= a || (n === 32 && (a & 4194048) !== 0))
            ? t
            : o
      );
    }
    function bu(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function yC(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function bh() {
      var e = ar;
      return ((ar <<= 1), (ar & 62914560) === 0 && (ar = 4194304), e);
    }
    function Ui(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function Iu(e, t) {
      ((e.pendingLanes |= t),
        t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function CC(e, t, a, l, o, n) {
      var u = e.pendingLanes;
      ((e.pendingLanes = a),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.warmLanes = 0),
        (e.expiredLanes &= a),
        (e.entangledLanes &= a),
        (e.errorRecoveryDisabledLanes &= a),
        (e.shellSuspendCounter = 0));
      var r = e.entanglements,
        s = e.expirationTimes,
        i = e.hiddenUpdates;
      for (a = u & ~a; 0 < a;) {
        var c = 31 - Ot(a),
          p = 1 << c;
        ((r[c] = 0), (s[c] = -1));
        var m = i[c];
        if (m !== null)
          for (i[c] = null, c = 0; c < m.length; c++) {
            var h = m[c];
            h !== null && (h.lane &= -536870913);
          }
        a &= ~p;
      }
      (l !== 0 && Ih(e, l, 0),
        n !== 0 && o === 0 && e.tag !== 0 && (e.suspendedLanes |= n & ~(u & ~t)));
    }
    function Ih(e, t, a) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var l = 31 - Ot(t);
      ((e.entangledLanes |= t),
        (e.entanglements[l] = e.entanglements[l] | 1073741824 | (a & 261930)));
    }
    function wh(e, t) {
      var a = (e.entangledLanes |= t);
      for (e = e.entanglements; a;) {
        var l = 31 - Ot(a),
          o = 1 << l;
        ((o & t) | (e[l] & t) && (e[l] |= t), (a &= ~o));
      }
    }
    function Rh(e, t) {
      var a = t & -t;
      return ((a = (a & 42) !== 0 ? 1 : pc(a)), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a);
    }
    function pc(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function hc(e) {
      return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
    }
    function Ah() {
      var e = ne.p;
      return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : Qx(e.type));
    }
    function jm(e, t) {
      var a = ne.p;
      try {
        return ((ne.p = e), t());
      } finally {
        ne.p = a;
      }
    }
    var Il = Math.random().toString(36).slice(2),
      We = '__reactFiber$' + Il,
      vt = '__reactProps$' + Il,
      fn = '__reactContainer$' + Il,
      If = '__reactEvents$' + Il,
      bC = '__reactListeners$' + Il,
      IC = '__reactHandles$' + Il,
      Ym = '__reactResources$' + Il,
      wu = '__reactMarker$' + Il;
    function gc(e) {
      (delete e[We], delete e[vt], delete e[If], delete e[bC], delete e[IC]);
    }
    function Po(e) {
      var t = e[We];
      if (t) return t;
      for (var a = e.parentNode; a;) {
        if ((t = a[fn] || a[We])) {
          if (((a = t.alternate), t.child !== null || (a !== null && a.child !== null)))
            for (e = th(e); e !== null;) {
              if ((a = e[We])) return a;
              e = th(e);
            }
          return t;
        }
        ((e = a), (a = e.parentNode));
      }
      return null;
    }
    function cn(e) {
      if ((e = e[We] || e[fn])) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function Xn(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(w(33));
    }
    function Xo(e) {
      var t = e[Ym];
      return (t || (t = e[Ym] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
    }
    function Ye(e) {
      e[wu] = !0;
    }
    var Th = new Set(),
      kh = {};
    function Jl(e, t) {
      ($o(e, t), $o(e + 'Capture', t));
    }
    function $o(e, t) {
      for (kh[e] = t, e = 0; e < t.length; e++) Th.add(t[e]);
    }
    var wC = RegExp(
        '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
      ),
      Km = {},
      Zm = {};
    function RC(e) {
      return bf.call(Zm, e)
        ? !0
        : bf.call(Km, e)
          ? !1
          : wC.test(e)
            ? (Zm[e] = !0)
            : ((Km[e] = !0), !1);
    }
    function xr(e, t, a) {
      if (RC(t))
        if (a === null) e.removeAttribute(t);
        else {
          switch (typeof a) {
            case 'undefined':
            case 'function':
            case 'symbol':
              e.removeAttribute(t);
              return;
            case 'boolean':
              var l = t.toLowerCase().slice(0, 5);
              if (l !== 'data-' && l !== 'aria-') {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, '' + a);
        }
    }
    function lr(e, t, a) {
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case 'undefined':
          case 'function':
          case 'symbol':
          case 'boolean':
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, '' + a);
      }
    }
    function Ta(e, t, a, l) {
      if (l === null) e.removeAttribute(a);
      else {
        switch (typeof l) {
          case 'undefined':
          case 'function':
          case 'symbol':
          case 'boolean':
            e.removeAttribute(a);
            return;
        }
        e.setAttributeNS(t, a, '' + l);
      }
    }
    function qt(e) {
      switch (typeof e) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'string':
        case 'undefined':
          return e;
        case 'object':
          return e;
        default:
          return '';
      }
    }
    function Mh(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
    }
    function AC(e, t, a) {
      var l = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (
        !e.hasOwnProperty(t) &&
        typeof l < 'u' &&
        typeof l.get == 'function' &&
        typeof l.set == 'function'
      ) {
        var o = l.get,
          n = l.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return o.call(this);
            },
            set: function (u) {
              ((a = '' + u), n.call(this, u));
            },
          }),
          Object.defineProperty(e, t, { enumerable: l.enumerable }),
          {
            getValue: function () {
              return a;
            },
            setValue: function (u) {
              a = '' + u;
            },
            stopTracking: function () {
              ((e._valueTracker = null), delete e[t]);
            },
          }
        );
      }
    }
    function wf(e) {
      if (!e._valueTracker) {
        var t = Mh(e) ? 'checked' : 'value';
        e._valueTracker = AC(e, t, '' + e[t]);
      }
    }
    function Dh(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var a = t.getValue(),
        l = '';
      return (
        e && (l = Mh(e) ? (e.checked ? 'true' : 'false') : e.value),
        (e = l),
        e !== a ? (t.setValue(e), !0) : !1
      );
    }
    function Nr(e) {
      if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var TC = /[\n"\\]/g;
    function Vt(e) {
      return e.replace(TC, function (t) {
        return '\\' + t.charCodeAt(0).toString(16) + ' ';
      });
    }
    function Rf(e, t, a, l, o, n, u, r) {
      ((e.name = ''),
        u != null && typeof u != 'function' && typeof u != 'symbol' && typeof u != 'boolean'
          ? (e.type = u)
          : e.removeAttribute('type'),
        t != null
          ? u === 'number'
            ? ((t === 0 && e.value === '') || e.value != t) && (e.value = '' + qt(t))
            : e.value !== '' + qt(t) && (e.value = '' + qt(t))
          : (u !== 'submit' && u !== 'reset') || e.removeAttribute('value'),
        t != null
          ? Af(e, u, qt(t))
          : a != null
            ? Af(e, u, qt(a))
            : l != null && e.removeAttribute('value'),
        o == null && n != null && (e.defaultChecked = !!n),
        o != null && (e.checked = o && typeof o != 'function' && typeof o != 'symbol'),
        r != null && typeof r != 'function' && typeof r != 'symbol' && typeof r != 'boolean'
          ? (e.name = '' + qt(r))
          : e.removeAttribute('name'));
    }
    function Eh(e, t, a, l, o, n, u, r) {
      if (
        (n != null &&
          typeof n != 'function' &&
          typeof n != 'symbol' &&
          typeof n != 'boolean' &&
          (e.type = n),
        t != null || a != null)
      ) {
        if (!((n !== 'submit' && n !== 'reset') || t != null)) {
          wf(e);
          return;
        }
        ((a = a != null ? '' + qt(a) : ''),
          (t = t != null ? '' + qt(t) : a),
          r || t === e.value || (e.value = t),
          (e.defaultValue = t));
      }
      ((l = l ?? o),
        (l = typeof l != 'function' && typeof l != 'symbol' && !!l),
        (e.checked = r ? e.checked : !!l),
        (e.defaultChecked = !!l),
        u != null &&
          typeof u != 'function' &&
          typeof u != 'symbol' &&
          typeof u != 'boolean' &&
          (e.name = u),
        wf(e));
    }
    function Af(e, t, a) {
      (t === 'number' && Nr(e.ownerDocument) === e) ||
        e.defaultValue === '' + a ||
        (e.defaultValue = '' + a);
    }
    function jo(e, t, a, l) {
      if (((e = e.options), t)) {
        t = {};
        for (var o = 0; o < a.length; o++) t['$' + a[o]] = !0;
        for (a = 0; a < e.length; a++)
          ((o = t.hasOwnProperty('$' + e[a].value)),
            e[a].selected !== o && (e[a].selected = o),
            o && l && (e[a].defaultSelected = !0));
      } else {
        for (a = '' + qt(a), t = null, o = 0; o < e.length; o++) {
          if (e[o].value === a) {
            ((e[o].selected = !0), l && (e[o].defaultSelected = !0));
            return;
          }
          t !== null || e[o].disabled || (t = e[o]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function Oh(e, t, a) {
      if (t != null && ((t = '' + qt(t)), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? '' + qt(a) : '';
    }
    function Bh(e, t, a, l) {
      if (t == null) {
        if (l != null) {
          if (a != null) throw Error(w(92));
          if (Vn(l)) {
            if (1 < l.length) throw Error(w(93));
            l = l[0];
          }
          a = l;
        }
        (a == null && (a = ''), (t = a));
      }
      ((a = qt(t)),
        (e.defaultValue = a),
        (l = e.textContent),
        l === a && l !== '' && l !== null && (e.value = l),
        wf(e));
    }
    function en(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === 3) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var kC = new Set(
      'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
        ' ',
      ),
    );
    function Qm(e, t, a) {
      var l = t.indexOf('--') === 0;
      a == null || typeof a == 'boolean' || a === ''
        ? l
          ? e.setProperty(t, '')
          : t === 'float'
            ? (e.cssFloat = '')
            : (e[t] = '')
        : l
          ? e.setProperty(t, a)
          : typeof a != 'number' || a === 0 || kC.has(t)
            ? t === 'float'
              ? (e.cssFloat = a)
              : (e[t] = ('' + a).trim())
            : (e[t] = a + 'px');
    }
    function Ph(e, t, a) {
      if (t != null && typeof t != 'object') throw Error(w(62));
      if (((e = e.style), a != null)) {
        for (var l in a)
          !a.hasOwnProperty(l) ||
            (t != null && t.hasOwnProperty(l)) ||
            (l.indexOf('--') === 0
              ? e.setProperty(l, '')
              : l === 'float'
                ? (e.cssFloat = '')
                : (e[l] = ''));
        for (var o in t) ((l = t[o]), t.hasOwnProperty(o) && a[o] !== l && Qm(e, o, l));
      } else for (var n in t) t.hasOwnProperty(n) && Qm(e, n, t[n]);
    }
    function xc(e) {
      if (e.indexOf('-') === -1) return !1;
      switch (e) {
        case 'annotation-xml':
        case 'color-profile':
        case 'font-face':
        case 'font-face-src':
        case 'font-face-uri':
        case 'font-face-format':
        case 'font-face-name':
        case 'missing-glyph':
          return !1;
        default:
          return !0;
      }
    }
    var MC = new Map([
        ['acceptCharset', 'accept-charset'],
        ['htmlFor', 'for'],
        ['httpEquiv', 'http-equiv'],
        ['crossOrigin', 'crossorigin'],
        ['accentHeight', 'accent-height'],
        ['alignmentBaseline', 'alignment-baseline'],
        ['arabicForm', 'arabic-form'],
        ['baselineShift', 'baseline-shift'],
        ['capHeight', 'cap-height'],
        ['clipPath', 'clip-path'],
        ['clipRule', 'clip-rule'],
        ['colorInterpolation', 'color-interpolation'],
        ['colorInterpolationFilters', 'color-interpolation-filters'],
        ['colorProfile', 'color-profile'],
        ['colorRendering', 'color-rendering'],
        ['dominantBaseline', 'dominant-baseline'],
        ['enableBackground', 'enable-background'],
        ['fillOpacity', 'fill-opacity'],
        ['fillRule', 'fill-rule'],
        ['floodColor', 'flood-color'],
        ['floodOpacity', 'flood-opacity'],
        ['fontFamily', 'font-family'],
        ['fontSize', 'font-size'],
        ['fontSizeAdjust', 'font-size-adjust'],
        ['fontStretch', 'font-stretch'],
        ['fontStyle', 'font-style'],
        ['fontVariant', 'font-variant'],
        ['fontWeight', 'font-weight'],
        ['glyphName', 'glyph-name'],
        ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
        ['glyphOrientationVertical', 'glyph-orientation-vertical'],
        ['horizAdvX', 'horiz-adv-x'],
        ['horizOriginX', 'horiz-origin-x'],
        ['imageRendering', 'image-rendering'],
        ['letterSpacing', 'letter-spacing'],
        ['lightingColor', 'lighting-color'],
        ['markerEnd', 'marker-end'],
        ['markerMid', 'marker-mid'],
        ['markerStart', 'marker-start'],
        ['overlinePosition', 'overline-position'],
        ['overlineThickness', 'overline-thickness'],
        ['paintOrder', 'paint-order'],
        ['panose-1', 'panose-1'],
        ['pointerEvents', 'pointer-events'],
        ['renderingIntent', 'rendering-intent'],
        ['shapeRendering', 'shape-rendering'],
        ['stopColor', 'stop-color'],
        ['stopOpacity', 'stop-opacity'],
        ['strikethroughPosition', 'strikethrough-position'],
        ['strikethroughThickness', 'strikethrough-thickness'],
        ['strokeDasharray', 'stroke-dasharray'],
        ['strokeDashoffset', 'stroke-dashoffset'],
        ['strokeLinecap', 'stroke-linecap'],
        ['strokeLinejoin', 'stroke-linejoin'],
        ['strokeMiterlimit', 'stroke-miterlimit'],
        ['strokeOpacity', 'stroke-opacity'],
        ['strokeWidth', 'stroke-width'],
        ['textAnchor', 'text-anchor'],
        ['textDecoration', 'text-decoration'],
        ['textRendering', 'text-rendering'],
        ['transformOrigin', 'transform-origin'],
        ['underlinePosition', 'underline-position'],
        ['underlineThickness', 'underline-thickness'],
        ['unicodeBidi', 'unicode-bidi'],
        ['unicodeRange', 'unicode-range'],
        ['unitsPerEm', 'units-per-em'],
        ['vAlphabetic', 'v-alphabetic'],
        ['vHanging', 'v-hanging'],
        ['vIdeographic', 'v-ideographic'],
        ['vMathematical', 'v-mathematical'],
        ['vectorEffect', 'vector-effect'],
        ['vertAdvY', 'vert-adv-y'],
        ['vertOriginX', 'vert-origin-x'],
        ['vertOriginY', 'vert-origin-y'],
        ['wordSpacing', 'word-spacing'],
        ['writingMode', 'writing-mode'],
        ['xmlnsXlink', 'xmlns:xlink'],
        ['xHeight', 'x-height'],
      ]),
      DC =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Lr(e) {
      return DC.test('' + e)
        ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        : e;
    }
    function Na() {}
    var Tf = null;
    function Lc(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var No = null,
      Yo = null;
    function Wm(e) {
      var t = cn(e);
      if (t && (e = t.stateNode)) {
        var a = e[vt] || null;
        e: switch (((e = t.stateNode), t.type)) {
          case 'input':
            if (
              (Rf(
                e,
                a.value,
                a.defaultValue,
                a.defaultValue,
                a.checked,
                a.defaultChecked,
                a.type,
                a.name,
              ),
              (t = a.name),
              a.type === 'radio' && t != null)
            ) {
              for (a = e; a.parentNode;) a = a.parentNode;
              for (
                a = a.querySelectorAll('input[name="' + Vt('' + t) + '"][type="radio"]'), t = 0;
                t < a.length;
                t++
              ) {
                var l = a[t];
                if (l !== e && l.form === e.form) {
                  var o = l[vt] || null;
                  if (!o) throw Error(w(90));
                  Rf(
                    l,
                    o.value,
                    o.defaultValue,
                    o.defaultValue,
                    o.checked,
                    o.defaultChecked,
                    o.type,
                    o.name,
                  );
                }
              }
              for (t = 0; t < a.length; t++) ((l = a[t]), l.form === e.form && Dh(l));
            }
            break e;
          case 'textarea':
            Oh(e, a.value, a.defaultValue);
            break e;
          case 'select':
            ((t = a.value), t != null && jo(e, !!a.multiple, t, !1));
        }
      }
    }
    var qi = !1;
    function Nh(e, t, a) {
      if (qi) return e(t, a);
      qi = !0;
      try {
        var l = e(t);
        return l;
      } finally {
        if (
          ((qi = !1),
          (No !== null || Yo !== null) &&
            (Ss(), No && ((t = No), (e = Yo), (Yo = No = null), Wm(t), e)))
        )
          for (t = 0; t < e.length; t++) Wm(e[t]);
      }
    }
    function su(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var l = a[vt] || null;
      if (l === null) return null;
      a = l[t];
      e: switch (t) {
        case 'onClick':
        case 'onClickCapture':
        case 'onDoubleClick':
        case 'onDoubleClickCapture':
        case 'onMouseDown':
        case 'onMouseDownCapture':
        case 'onMouseMove':
        case 'onMouseMoveCapture':
        case 'onMouseUp':
        case 'onMouseUpCapture':
        case 'onMouseEnter':
          ((l = !l.disabled) ||
            ((e = e.type),
            (l = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
            (e = !l));
          break e;
        default:
          e = !1;
      }
      if (e) return null;
      if (a && typeof a != 'function') throw Error(w(231, t, typeof a));
      return a;
    }
    var qa = !(
        typeof window > 'u' ||
        typeof window.document > 'u' ||
        typeof window.document.createElement > 'u'
      ),
      kf = !1;
    if (qa)
      try {
        ((To = {}),
          Object.defineProperty(To, 'passive', {
            get: function () {
              kf = !0;
            },
          }),
          window.addEventListener('test', To, To),
          window.removeEventListener('test', To, To));
      } catch {
        kf = !1;
      }
    var To,
      rl = null,
      Sc = null,
      Sr = null;
    function _h() {
      if (Sr) return Sr;
      var e,
        t = Sc,
        a = t.length,
        l,
        o = 'value' in rl ? rl.value : rl.textContent,
        n = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++);
      var u = a - e;
      for (l = 1; l <= u && t[a - l] === o[n - l]; l++);
      return (Sr = o.slice(e, 1 < l ? 1 - l : void 0));
    }
    function vr(e) {
      var t = e.keyCode;
      return (
        'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function or() {
      return !0;
    }
    function Jm() {
      return !1;
    }
    function yt(e) {
      function t(a, l, o, n, u) {
        ((this._reactName = a),
          (this._targetInst = o),
          (this.type = l),
          (this.nativeEvent = n),
          (this.target = u),
          (this.currentTarget = null));
        for (var r in e) e.hasOwnProperty(r) && ((a = e[r]), (this[r] = a ? a(n) : n[r]));
        return (
          (this.isDefaultPrevented = (
            n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
          )
            ? or
            : Jm),
          (this.isPropagationStopped = Jm),
          this
        );
      }
      return (
        Ce(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var a = this.nativeEvent;
            a &&
              (a.preventDefault
                ? a.preventDefault()
                : typeof a.returnValue != 'unknown' && (a.returnValue = !1),
              (this.isDefaultPrevented = or));
          },
          stopPropagation: function () {
            var a = this.nativeEvent;
            a &&
              (a.stopPropagation
                ? a.stopPropagation()
                : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
              (this.isPropagationStopped = or));
          },
          persist: function () {},
          isPersistent: or,
        }),
        t
      );
    }
    var $l = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      ss = yt($l),
      Ru = Ce({}, $l, { view: 0, detail: 0 }),
      EC = yt(Ru),
      Fi,
      Gi,
      _n,
      is = Ce({}, Ru, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: vc,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return 'movementX' in e
            ? e.movementX
            : (e !== _n &&
                (_n && e.type === 'mousemove'
                  ? ((Fi = e.screenX - _n.screenX), (Gi = e.screenY - _n.screenY))
                  : (Gi = Fi = 0),
                (_n = e)),
              Fi);
        },
        movementY: function (e) {
          return 'movementY' in e ? e.movementY : Gi;
        },
      }),
      $m = yt(is),
      OC = Ce({}, is, { dataTransfer: 0 }),
      BC = yt(OC),
      PC = Ce({}, Ru, { relatedTarget: 0 }),
      Vi = yt(PC),
      NC = Ce({}, $l, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      _C = yt(NC),
      HC = Ce({}, $l, {
        clipboardData: function (e) {
          return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
        },
      }),
      zC = yt(HC),
      UC = Ce({}, $l, { data: 0 }),
      ep = yt(UC),
      qC = {
        Esc: 'Escape',
        Spacebar: ' ',
        Left: 'ArrowLeft',
        Up: 'ArrowUp',
        Right: 'ArrowRight',
        Down: 'ArrowDown',
        Del: 'Delete',
        Win: 'OS',
        Menu: 'ContextMenu',
        Apps: 'ContextMenu',
        Scroll: 'ScrollLock',
        MozPrintableKey: 'Unidentified',
      },
      FC = {
        8: 'Backspace',
        9: 'Tab',
        12: 'Clear',
        13: 'Enter',
        16: 'Shift',
        17: 'Control',
        18: 'Alt',
        19: 'Pause',
        20: 'CapsLock',
        27: 'Escape',
        32: ' ',
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'ArrowLeft',
        38: 'ArrowUp',
        39: 'ArrowRight',
        40: 'ArrowDown',
        45: 'Insert',
        46: 'Delete',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        144: 'NumLock',
        145: 'ScrollLock',
        224: 'Meta',
      },
      GC = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
    function VC(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = GC[e]) ? !!t[e] : !1;
    }
    function vc() {
      return VC;
    }
    var XC = Ce({}, Ru, {
        key: function (e) {
          if (e.key) {
            var t = qC[e.key] || e.key;
            if (t !== 'Unidentified') return t;
          }
          return e.type === 'keypress'
            ? ((e = vr(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
            : e.type === 'keydown' || e.type === 'keyup'
              ? FC[e.keyCode] || 'Unidentified'
              : '';
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: vc,
        charCode: function (e) {
          return e.type === 'keypress' ? vr(e) : 0;
        },
        keyCode: function (e) {
          return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
        },
        which: function (e) {
          return e.type === 'keypress'
            ? vr(e)
            : e.type === 'keydown' || e.type === 'keyup'
              ? e.keyCode
              : 0;
        },
      }),
      jC = yt(XC),
      YC = Ce({}, is, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0,
      }),
      tp = yt(YC),
      KC = Ce({}, Ru, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: vc,
      }),
      ZC = yt(KC),
      QC = Ce({}, $l, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
      WC = yt(QC),
      JC = Ce({}, is, {
        deltaX: function (e) {
          return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
        },
        deltaY: function (e) {
          return 'deltaY' in e
            ? e.deltaY
            : 'wheelDeltaY' in e
              ? -e.wheelDeltaY
              : 'wheelDelta' in e
                ? -e.wheelDelta
                : 0;
        },
        deltaZ: 0,
        deltaMode: 0,
      }),
      $C = yt(JC),
      eb = Ce({}, $l, { newState: 0, oldState: 0 }),
      tb = yt(eb),
      ab = [9, 13, 27, 32],
      yc = qa && 'CompositionEvent' in window,
      Kn = null;
    qa && 'documentMode' in document && (Kn = document.documentMode);
    var lb = qa && 'TextEvent' in window && !Kn,
      Hh = qa && (!yc || (Kn && 8 < Kn && 11 >= Kn)),
      ap = ' ',
      lp = !1;
    function zh(e, t) {
      switch (e) {
        case 'keyup':
          return ab.indexOf(t.keyCode) !== -1;
        case 'keydown':
          return t.keyCode !== 229;
        case 'keypress':
        case 'mousedown':
        case 'focusout':
          return !0;
        default:
          return !1;
      }
    }
    function Uh(e) {
      return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
    }
    var _o = !1;
    function ob(e, t) {
      switch (e) {
        case 'compositionend':
          return Uh(t);
        case 'keypress':
          return t.which !== 32 ? null : ((lp = !0), ap);
        case 'textInput':
          return ((e = t.data), e === ap && lp ? null : e);
        default:
          return null;
      }
    }
    function nb(e, t) {
      if (_o)
        return e === 'compositionend' || (!yc && zh(e, t))
          ? ((e = _h()), (Sr = Sc = rl = null), (_o = !1), e)
          : null;
      switch (e) {
        case 'paste':
          return null;
        case 'keypress':
          if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case 'compositionend':
          return Hh && t.locale !== 'ko' ? null : t.data;
        default:
          return null;
      }
    }
    var ub = {
      color: !0,
      date: !0,
      datetime: !0,
      'datetime-local': !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function op(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === 'input' ? !!ub[e.type] : t === 'textarea';
    }
    function qh(e, t, a, l) {
      (No ? (Yo ? Yo.push(l) : (Yo = [l])) : (No = l),
        (t = es(t, 'onChange')),
        0 < t.length &&
          ((a = new ss('onChange', 'change', null, a, l)), e.push({ event: a, listeners: t })));
    }
    var Zn = null,
      iu = null;
    function rb(e) {
      Nx(e, 0);
    }
    function fs(e) {
      var t = Xn(e);
      if (Dh(t)) return e;
    }
    function np(e, t) {
      if (e === 'change') return t;
    }
    var Fh = !1;
    qa &&
      (qa
        ? ((ur = 'oninput' in document),
          ur ||
            ((Xi = document.createElement('div')),
            Xi.setAttribute('oninput', 'return;'),
            (ur = typeof Xi.oninput == 'function')),
          (nr = ur))
        : (nr = !1),
      (Fh = nr && (!document.documentMode || 9 < document.documentMode)));
    var nr, ur, Xi;
    function up() {
      Zn && (Zn.detachEvent('onpropertychange', Gh), (iu = Zn = null));
    }
    function Gh(e) {
      if (e.propertyName === 'value' && fs(iu)) {
        var t = [];
        (qh(t, iu, e, Lc(e)), Nh(rb, t));
      }
    }
    function sb(e, t, a) {
      e === 'focusin'
        ? (up(), (Zn = t), (iu = a), Zn.attachEvent('onpropertychange', Gh))
        : e === 'focusout' && up();
    }
    function ib(e) {
      if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return fs(iu);
    }
    function fb(e, t) {
      if (e === 'click') return fs(t);
    }
    function cb(e, t) {
      if (e === 'input' || e === 'change') return fs(t);
    }
    function db(e, t) {
      return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
    }
    var Pt = typeof Object.is == 'function' ? Object.is : db;
    function fu(e, t) {
      if (Pt(e, t)) return !0;
      if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
      var a = Object.keys(e),
        l = Object.keys(t);
      if (a.length !== l.length) return !1;
      for (l = 0; l < a.length; l++) {
        var o = a[l];
        if (!bf.call(t, o) || !Pt(e[o], t[o])) return !1;
      }
      return !0;
    }
    function rp(e) {
      for (; e && e.firstChild;) e = e.firstChild;
      return e;
    }
    function sp(e, t) {
      var a = rp(e);
      e = 0;
      for (var l; a;) {
        if (a.nodeType === 3) {
          if (((l = e + a.textContent.length), e <= t && l >= t)) return { node: a, offset: t - e };
          e = l;
        }
        e: {
          for (; a;) {
            if (a.nextSibling) {
              a = a.nextSibling;
              break e;
            }
            a = a.parentNode;
          }
          a = void 0;
        }
        a = rp(a);
      }
    }
    function Vh(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Vh(e, t.parentNode)
              : 'contains' in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Xh(e) {
      e =
        e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = Nr(e.document); t instanceof e.HTMLIFrameElement;) {
        try {
          var a = typeof t.contentWindow.location.href == 'string';
        } catch {
          a = !1;
        }
        if (a) e = t.contentWindow;
        else break;
        t = Nr(e.document);
      }
      return t;
    }
    function Cc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === 'input' &&
          (e.type === 'text' ||
            e.type === 'search' ||
            e.type === 'tel' ||
            e.type === 'url' ||
            e.type === 'password')) ||
          t === 'textarea' ||
          e.contentEditable === 'true')
      );
    }
    var mb = qa && 'documentMode' in document && 11 >= document.documentMode,
      Ho = null,
      Mf = null,
      Qn = null,
      Df = !1;
    function ip(e, t, a) {
      var l = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      Df ||
        Ho == null ||
        Ho !== Nr(l) ||
        ((l = Ho),
        'selectionStart' in l && Cc(l)
          ? (l = { start: l.selectionStart, end: l.selectionEnd })
          : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
            (l = {
              anchorNode: l.anchorNode,
              anchorOffset: l.anchorOffset,
              focusNode: l.focusNode,
              focusOffset: l.focusOffset,
            })),
        (Qn && fu(Qn, l)) ||
          ((Qn = l),
          (l = es(Mf, 'onSelect')),
          0 < l.length &&
            ((t = new ss('onSelect', 'select', null, t, a)),
            e.push({ event: t, listeners: l }),
            (t.target = Ho))));
    }
    function _l(e, t) {
      var a = {};
      return (
        (a[e.toLowerCase()] = t.toLowerCase()),
        (a['Webkit' + e] = 'webkit' + t),
        (a['Moz' + e] = 'moz' + t),
        a
      );
    }
    var zo = {
        animationend: _l('Animation', 'AnimationEnd'),
        animationiteration: _l('Animation', 'AnimationIteration'),
        animationstart: _l('Animation', 'AnimationStart'),
        transitionrun: _l('Transition', 'TransitionRun'),
        transitionstart: _l('Transition', 'TransitionStart'),
        transitioncancel: _l('Transition', 'TransitionCancel'),
        transitionend: _l('Transition', 'TransitionEnd'),
      },
      ji = {},
      jh = {};
    qa &&
      ((jh = document.createElement('div').style),
      'AnimationEvent' in window ||
        (delete zo.animationend.animation,
        delete zo.animationiteration.animation,
        delete zo.animationstart.animation),
      'TransitionEvent' in window || delete zo.transitionend.transition);
    function eo(e) {
      if (ji[e]) return ji[e];
      if (!zo[e]) return e;
      var t = zo[e],
        a;
      for (a in t) if (t.hasOwnProperty(a) && a in jh) return (ji[e] = t[a]);
      return e;
    }
    var Yh = eo('animationend'),
      Kh = eo('animationiteration'),
      Zh = eo('animationstart'),
      pb = eo('transitionrun'),
      hb = eo('transitionstart'),
      gb = eo('transitioncancel'),
      Qh = eo('transitionend'),
      Wh = new Map(),
      Ef =
        'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
          ' ',
        );
    Ef.push('scrollEnd');
    function aa(e, t) {
      (Wh.set(e, t), Jl(t, [e]));
    }
    var _r =
        typeof reportError == 'function'
          ? reportError
          : function (e) {
              if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
                var t = new window.ErrorEvent('error', {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == 'object' && e !== null && typeof e.message == 'string'
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (typeof process == 'object' && typeof process.emit == 'function') {
                process.emit('uncaughtException', e);
                return;
              }
              console.error(e);
            },
      Ut = [],
      Uo = 0,
      bc = 0;
    function cs() {
      for (var e = Uo, t = (bc = Uo = 0); t < e;) {
        var a = Ut[t];
        Ut[t++] = null;
        var l = Ut[t];
        Ut[t++] = null;
        var o = Ut[t];
        Ut[t++] = null;
        var n = Ut[t];
        if (((Ut[t++] = null), l !== null && o !== null)) {
          var u = l.pending;
          (u === null ? (o.next = o) : ((o.next = u.next), (u.next = o)), (l.pending = o));
        }
        n !== 0 && Jh(a, o, n);
      }
    }
    function ds(e, t, a, l) {
      ((Ut[Uo++] = e),
        (Ut[Uo++] = t),
        (Ut[Uo++] = a),
        (Ut[Uo++] = l),
        (bc |= l),
        (e.lanes |= l),
        (e = e.alternate),
        e !== null && (e.lanes |= l));
    }
    function Ic(e, t, a, l) {
      return (ds(e, t, a, l), Hr(e));
    }
    function to(e, t) {
      return (ds(e, null, null, t), Hr(e));
    }
    function Jh(e, t, a) {
      e.lanes |= a;
      var l = e.alternate;
      l !== null && (l.lanes |= a);
      for (var o = !1, n = e.return; n !== null;)
        ((n.childLanes |= a),
          (l = n.alternate),
          l !== null && (l.childLanes |= a),
          n.tag === 22 && ((e = n.stateNode), e === null || e._visibility & 1 || (o = !0)),
          (e = n),
          (n = n.return));
      return e.tag === 3
        ? ((n = e.stateNode),
          o &&
            t !== null &&
            ((o = 31 - Ot(a)),
            (e = n.hiddenUpdates),
            (l = e[o]),
            l === null ? (e[o] = [t]) : l.push(t),
            (t.lane = a | 536870912)),
          n)
        : null;
    }
    function Hr(e) {
      if (50 < nu) throw ((nu = 0), ($f = null), Error(w(185)));
      for (var t = e.return; t !== null;) ((e = t), (t = e.return));
      return e.tag === 3 ? e.stateNode : null;
    }
    var qo = {};
    function xb(e, t, a, l) {
      ((this.tag = e),
        (this.key = a),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
        (this.mode = l),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function kt(e, t, a, l) {
      return new xb(e, t, a, l);
    }
    function wc(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function Ha(e, t) {
      var a = e.alternate;
      return (
        a === null
          ? ((a = kt(e.tag, t, e.key, e.mode)),
            (a.elementType = e.elementType),
            (a.type = e.type),
            (a.stateNode = e.stateNode),
            (a.alternate = e),
            (e.alternate = a))
          : ((a.pendingProps = t),
            (a.type = e.type),
            (a.flags = 0),
            (a.subtreeFlags = 0),
            (a.deletions = null)),
        (a.flags = e.flags & 65011712),
        (a.childLanes = e.childLanes),
        (a.lanes = e.lanes),
        (a.child = e.child),
        (a.memoizedProps = e.memoizedProps),
        (a.memoizedState = e.memoizedState),
        (a.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (a.sibling = e.sibling),
        (a.index = e.index),
        (a.ref = e.ref),
        (a.refCleanup = e.refCleanup),
        a
      );
    }
    function $h(e, t) {
      e.flags &= 65011714;
      var a = e.alternate;
      return (
        a === null
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = a.childLanes),
            (e.lanes = a.lanes),
            (e.child = a.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = a.memoizedProps),
            (e.memoizedState = a.memoizedState),
            (e.updateQueue = a.updateQueue),
            (e.type = a.type),
            (t = a.dependencies),
            (e.dependencies =
              t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function yr(e, t, a, l, o, n) {
      var u = 0;
      if (((l = e), typeof e == 'function')) wc(e) && (u = 1);
      else if (typeof e == 'string')
        u = vI(e, a, xa.current) ? 26 : e === 'html' || e === 'head' || e === 'body' ? 27 : 5;
      else
        e: switch (e) {
          case Sf:
            return ((e = kt(31, a, t, o)), (e.elementType = Sf), (e.lanes = n), e);
          case Oo:
            return Gl(a.children, o, n, t);
          case Lh:
            ((u = 8), (o |= 24));
            break;
          case gf:
            return ((e = kt(12, a, t, o | 2)), (e.elementType = gf), (e.lanes = n), e);
          case xf:
            return ((e = kt(13, a, t, o)), (e.elementType = xf), (e.lanes = n), e);
          case Lf:
            return ((e = kt(19, a, t, o)), (e.elementType = Lf), (e.lanes = n), e);
          default:
            if (typeof e == 'object' && e !== null)
              switch (e.$$typeof) {
                case Pa:
                  u = 10;
                  break e;
                case Sh:
                  u = 9;
                  break e;
                case cc:
                  u = 11;
                  break e;
                case dc:
                  u = 14;
                  break e;
                case el:
                  ((u = 16), (l = null));
                  break e;
              }
            ((u = 29), (a = Error(w(130, e === null ? 'null' : typeof e, ''))), (l = null));
        }
      return ((t = kt(u, a, t, o)), (t.elementType = e), (t.type = l), (t.lanes = n), t);
    }
    function Gl(e, t, a, l) {
      return ((e = kt(7, e, l, t)), (e.lanes = a), e);
    }
    function Yi(e, t, a) {
      return ((e = kt(6, e, null, t)), (e.lanes = a), e);
    }
    function eg(e) {
      var t = kt(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function Ki(e, t, a) {
      return (
        (t = kt(4, e.children !== null ? e.children : [], e.key, t)),
        (t.lanes = a),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var fp = new WeakMap();
    function Xt(e, t) {
      if (typeof e == 'object' && e !== null) {
        var a = fp.get(e);
        return a !== void 0 ? a : ((t = { value: e, source: t, stack: Xm(t) }), fp.set(e, t), t);
      }
      return { value: e, source: t, stack: Xm(t) };
    }
    var Fo = [],
      Go = 0,
      zr = null,
      cu = 0,
      Ft = [],
      Gt = 0,
      vl = null,
      pa = 1,
      ha = '';
    function Oa(e, t) {
      ((Fo[Go++] = cu), (Fo[Go++] = zr), (zr = e), (cu = t));
    }
    function tg(e, t, a) {
      ((Ft[Gt++] = pa), (Ft[Gt++] = ha), (Ft[Gt++] = vl), (vl = e));
      var l = pa;
      e = ha;
      var o = 32 - Ot(l) - 1;
      ((l &= ~(1 << o)), (a += 1));
      var n = 32 - Ot(t) + o;
      if (30 < n) {
        var u = o - (o % 5);
        ((n = (l & ((1 << u) - 1)).toString(32)),
          (l >>= u),
          (o -= u),
          (pa = (1 << (32 - Ot(t) + o)) | (a << o) | l),
          (ha = n + e));
      } else ((pa = (1 << n) | (a << o) | l), (ha = e));
    }
    function Rc(e) {
      e.return !== null && (Oa(e, 1), tg(e, 1, 0));
    }
    function Ac(e) {
      for (; e === zr;) ((zr = Fo[--Go]), (Fo[Go] = null), (cu = Fo[--Go]), (Fo[Go] = null));
      for (; e === vl;)
        ((vl = Ft[--Gt]),
          (Ft[Gt] = null),
          (ha = Ft[--Gt]),
          (Ft[Gt] = null),
          (pa = Ft[--Gt]),
          (Ft[Gt] = null));
    }
    function ag(e, t) {
      ((Ft[Gt++] = pa), (Ft[Gt++] = ha), (Ft[Gt++] = vl), (pa = t.id), (ha = t.overflow), (vl = e));
    }
    var Je = null,
      ye = null,
      te = !1,
      dl = null,
      jt = !1,
      Of = Error(w(519));
    function yl(e) {
      var t = Error(
        w(
          418,
          1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML',
          '',
        ),
      );
      throw (du(Xt(t, e)), Of);
    }
    function cp(e) {
      var t = e.stateNode,
        a = e.type,
        l = e.memoizedProps;
      switch (((t[We] = e), (t[vt] = l), a)) {
        case 'dialog':
          (Z('cancel', t), Z('close', t));
          break;
        case 'iframe':
        case 'object':
        case 'embed':
          Z('load', t);
          break;
        case 'video':
        case 'audio':
          for (a = 0; a < gu.length; a++) Z(gu[a], t);
          break;
        case 'source':
          Z('error', t);
          break;
        case 'img':
        case 'image':
        case 'link':
          (Z('error', t), Z('load', t));
          break;
        case 'details':
          Z('toggle', t);
          break;
        case 'input':
          (Z('invalid', t),
            Eh(t, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0));
          break;
        case 'select':
          Z('invalid', t);
          break;
        case 'textarea':
          (Z('invalid', t), Bh(t, l.value, l.defaultValue, l.children));
      }
      ((a = l.children),
        (typeof a != 'string' && typeof a != 'number' && typeof a != 'bigint') ||
        t.textContent === '' + a ||
        l.suppressHydrationWarning === !0 ||
        Hx(t.textContent, a)
          ? (l.popover != null && (Z('beforetoggle', t), Z('toggle', t)),
            l.onScroll != null && Z('scroll', t),
            l.onScrollEnd != null && Z('scrollend', t),
            l.onClick != null && (t.onclick = Na),
            (t = !0))
          : (t = !1),
        t || yl(e, !0));
    }
    function dp(e) {
      for (Je = e.return; Je;)
        switch (Je.tag) {
          case 5:
          case 31:
          case 13:
            jt = !1;
            return;
          case 27:
          case 3:
            jt = !0;
            return;
          default:
            Je = Je.return;
        }
    }
    function ko(e) {
      if (e !== Je) return !1;
      if (!te) return (dp(e), (te = !0), !1);
      var t = e.tag,
        a;
      if (
        ((a = t !== 3 && t !== 27) &&
          ((a = t === 5) &&
            ((a = e.type), (a = !(a !== 'form' && a !== 'button') || oc(e.type, e.memoizedProps))),
          (a = !a)),
        a && ye && yl(e),
        dp(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
          throw Error(w(317));
        ye = eh(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
          throw Error(w(317));
        ye = eh(e);
      } else
        t === 27
          ? ((t = ye), wl(e.type) ? ((e = sc), (sc = null), (ye = e)) : (ye = t))
          : (ye = Je ? Kt(e.stateNode.nextSibling) : null);
      return !0;
    }
    function Yl() {
      ((ye = Je = null), (te = !1));
    }
    function Zi() {
      var e = dl;
      return (e !== null && (Lt === null ? (Lt = e) : Lt.push.apply(Lt, e), (dl = null)), e);
    }
    function du(e) {
      dl === null ? (dl = [e]) : dl.push(e);
    }
    var Bf = La(null),
      ao = null,
      _a = null;
    function al(e, t, a) {
      (xe(Bf, t._currentValue), (t._currentValue = a));
    }
    function za(e) {
      ((e._currentValue = Bf.current), Ke(Bf));
    }
    function Pf(e, t, a) {
      for (; e !== null;) {
        var l = e.alternate;
        if (
          ((e.childLanes & t) !== t
            ? ((e.childLanes |= t), l !== null && (l.childLanes |= t))
            : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t),
          e === a)
        )
          break;
        e = e.return;
      }
    }
    function Nf(e, t, a, l) {
      var o = e.child;
      for (o !== null && (o.return = e); o !== null;) {
        var n = o.dependencies;
        if (n !== null) {
          var u = o.child;
          n = n.firstContext;
          e: for (; n !== null;) {
            var r = n;
            n = o;
            for (var s = 0; s < t.length; s++)
              if (r.context === t[s]) {
                ((n.lanes |= a),
                  (r = n.alternate),
                  r !== null && (r.lanes |= a),
                  Pf(n.return, a, e),
                  l || (u = null));
                break e;
              }
            n = r.next;
          }
        } else if (o.tag === 18) {
          if (((u = o.return), u === null)) throw Error(w(341));
          ((u.lanes |= a),
            (n = u.alternate),
            n !== null && (n.lanes |= a),
            Pf(u, a, e),
            (u = null));
        } else u = o.child;
        if (u !== null) u.return = o;
        else
          for (u = o; u !== null;) {
            if (u === e) {
              u = null;
              break;
            }
            if (((o = u.sibling), o !== null)) {
              ((o.return = u.return), (u = o));
              break;
            }
            u = u.return;
          }
        o = u;
      }
    }
    function dn(e, t, a, l) {
      e = null;
      for (var o = t, n = !1; o !== null;) {
        if (!n) {
          if ((o.flags & 524288) !== 0) n = !0;
          else if ((o.flags & 262144) !== 0) break;
        }
        if (o.tag === 10) {
          var u = o.alternate;
          if (u === null) throw Error(w(387));
          if (((u = u.memoizedProps), u !== null)) {
            var r = o.type;
            Pt(o.pendingProps.value, u.value) || (e !== null ? e.push(r) : (e = [r]));
          }
        } else if (o === Er.current) {
          if (((u = o.alternate), u === null)) throw Error(w(387));
          u.memoizedState.memoizedState !== o.memoizedState.memoizedState &&
            (e !== null ? e.push(Lu) : (e = [Lu]));
        }
        o = o.return;
      }
      (e !== null && Nf(t, e, a, l), (t.flags |= 262144));
    }
    function Ur(e) {
      for (e = e.firstContext; e !== null;) {
        if (!Pt(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function Kl(e) {
      ((ao = e), (_a = null), (e = e.dependencies), e !== null && (e.firstContext = null));
    }
    function $e(e) {
      return lg(ao, e);
    }
    function rr(e, t) {
      return (ao === null && Kl(e), lg(e, t));
    }
    function lg(e, t) {
      var a = t._currentValue;
      if (((t = { context: t, memoizedValue: a, next: null }), _a === null)) {
        if (e === null) throw Error(w(308));
        ((_a = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
      } else _a = _a.next = t;
      return a;
    }
    var Lb =
        typeof AbortController < 'u'
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (a, l) {
                    e.push(l);
                  },
                });
              this.abort = function () {
                ((t.aborted = !0),
                  e.forEach(function (a) {
                    return a();
                  }));
              };
            },
      Sb = Fe.unstable_scheduleCallback,
      vb = Fe.unstable_NormalPriority,
      _e = {
        $$typeof: Pa,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function Tc() {
      return { controller: new Lb(), data: new Map(), refCount: 0 };
    }
    function Au(e) {
      (e.refCount--,
        e.refCount === 0 &&
          Sb(vb, function () {
            e.controller.abort();
          }));
    }
    var Wn = null,
      _f = 0,
      tn = 0,
      Ko = null;
    function yb(e, t) {
      if (Wn === null) {
        var a = (Wn = []);
        ((_f = 0),
          (tn = $c()),
          (Ko = {
            status: 'pending',
            value: void 0,
            then: function (l) {
              a.push(l);
            },
          }));
      }
      return (_f++, t.then(mp, mp), t);
    }
    function mp() {
      if (--_f === 0 && Wn !== null) {
        Ko !== null && (Ko.status = 'fulfilled');
        var e = Wn;
        ((Wn = null), (tn = 0), (Ko = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Cb(e, t) {
      var a = [],
        l = {
          status: 'pending',
          value: null,
          reason: null,
          then: function (o) {
            a.push(o);
          },
        };
      return (
        e.then(
          function () {
            ((l.status = 'fulfilled'), (l.value = t));
            for (var o = 0; o < a.length; o++) (0, a[o])(t);
          },
          function (o) {
            for (l.status = 'rejected', l.reason = o, o = 0; o < a.length; o++) (0, a[o])(void 0);
          },
        ),
        l
      );
    }
    var pp = N.S;
    N.S = function (e, t) {
      ((xx = Dt()),
        typeof t == 'object' && t !== null && typeof t.then == 'function' && yb(e, t),
        pp !== null && pp(e, t));
    };
    var Vl = La(null);
    function kc() {
      var e = Vl.current;
      return e !== null ? e : pe.pooledCache;
    }
    function Cr(e, t) {
      t === null ? xe(Vl, Vl.current) : xe(Vl, t.pool);
    }
    function og() {
      var e = kc();
      return e === null ? null : { parent: _e._currentValue, pool: e };
    }
    var mn = Error(w(460)),
      Mc = Error(w(474)),
      ms = Error(w(542)),
      qr = { then: function () {} };
    function hp(e) {
      return ((e = e.status), e === 'fulfilled' || e === 'rejected');
    }
    function ng(e, t, a) {
      switch (
        ((a = e[a]), a === void 0 ? e.push(t) : a !== t && (t.then(Na, Na), (t = a)), t.status)
      ) {
        case 'fulfilled':
          return t.value;
        case 'rejected':
          throw ((e = t.reason), xp(e), e);
        default:
          if (typeof t.status == 'string') t.then(Na, Na);
          else {
            if (((e = pe), e !== null && 100 < e.shellSuspendCounter)) throw Error(w(482));
            ((e = t),
              (e.status = 'pending'),
              e.then(
                function (l) {
                  if (t.status === 'pending') {
                    var o = t;
                    ((o.status = 'fulfilled'), (o.value = l));
                  }
                },
                function (l) {
                  if (t.status === 'pending') {
                    var o = t;
                    ((o.status = 'rejected'), (o.reason = l));
                  }
                },
              ));
          }
          switch (t.status) {
            case 'fulfilled':
              return t.value;
            case 'rejected':
              throw ((e = t.reason), xp(e), e);
          }
          throw ((Xl = t), mn);
      }
    }
    function Ul(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (a) {
        throw a !== null && typeof a == 'object' && typeof a.then == 'function'
          ? ((Xl = a), mn)
          : a;
      }
    }
    var Xl = null;
    function gp() {
      if (Xl === null) throw Error(w(459));
      var e = Xl;
      return ((Xl = null), e);
    }
    function xp(e) {
      if (e === mn || e === ms) throw Error(w(483));
    }
    var Zo = null,
      mu = 0;
    function sr(e) {
      var t = mu;
      return ((mu += 1), Zo === null && (Zo = []), ng(Zo, e, t));
    }
    function Hn(e, t) {
      ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
    }
    function ir(e, t) {
      throw t.$$typeof === sC
        ? Error(w(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            w(
              31,
              e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e,
            ),
          ));
    }
    function ug(e) {
      function t(g, d) {
        if (e) {
          var f = g.deletions;
          f === null ? ((g.deletions = [d]), (g.flags |= 16)) : f.push(d);
        }
      }
      function a(g, d) {
        if (!e) return null;
        for (; d !== null;) (t(g, d), (d = d.sibling));
        return null;
      }
      function l(g) {
        for (var d = new Map(); g !== null;)
          (g.key !== null ? d.set(g.key, g) : d.set(g.index, g), (g = g.sibling));
        return d;
      }
      function o(g, d) {
        return ((g = Ha(g, d)), (g.index = 0), (g.sibling = null), g);
      }
      function n(g, d, f) {
        return (
          (g.index = f),
          e
            ? ((f = g.alternate),
              f !== null
                ? ((f = f.index), f < d ? ((g.flags |= 67108866), d) : f)
                : ((g.flags |= 67108866), d))
            : ((g.flags |= 1048576), d)
        );
      }
      function u(g) {
        return (e && g.alternate === null && (g.flags |= 67108866), g);
      }
      function r(g, d, f, L) {
        return d === null || d.tag !== 6
          ? ((d = Yi(f, g.mode, L)), (d.return = g), d)
          : ((d = o(d, f)), (d.return = g), d);
      }
      function s(g, d, f, L) {
        var v = f.type;
        return v === Oo
          ? c(g, d, f.props.children, L, f.key)
          : d !== null &&
              (d.elementType === v ||
                (typeof v == 'object' && v !== null && v.$$typeof === el && Ul(v) === d.type))
            ? ((d = o(d, f.props)), Hn(d, f), (d.return = g), d)
            : ((d = yr(f.type, f.key, f.props, null, g.mode, L)), Hn(d, f), (d.return = g), d);
      }
      function i(g, d, f, L) {
        return d === null ||
          d.tag !== 4 ||
          d.stateNode.containerInfo !== f.containerInfo ||
          d.stateNode.implementation !== f.implementation
          ? ((d = Ki(f, g.mode, L)), (d.return = g), d)
          : ((d = o(d, f.children || [])), (d.return = g), d);
      }
      function c(g, d, f, L, v) {
        return d === null || d.tag !== 7
          ? ((d = Gl(f, g.mode, L, v)), (d.return = g), d)
          : ((d = o(d, f)), (d.return = g), d);
      }
      function p(g, d, f) {
        if ((typeof d == 'string' && d !== '') || typeof d == 'number' || typeof d == 'bigint')
          return ((d = Yi('' + d, g.mode, f)), (d.return = g), d);
        if (typeof d == 'object' && d !== null) {
          switch (d.$$typeof) {
            case $u:
              return (
                (f = yr(d.type, d.key, d.props, null, g.mode, f)),
                Hn(f, d),
                (f.return = g),
                f
              );
            case Gn:
              return ((d = Ki(d, g.mode, f)), (d.return = g), d);
            case el:
              return ((d = Ul(d)), p(g, d, f));
          }
          if (Vn(d) || Nn(d)) return ((d = Gl(d, g.mode, f, null)), (d.return = g), d);
          if (typeof d.then == 'function') return p(g, sr(d), f);
          if (d.$$typeof === Pa) return p(g, rr(g, d), f);
          ir(g, d);
        }
        return null;
      }
      function m(g, d, f, L) {
        var v = d !== null ? d.key : null;
        if ((typeof f == 'string' && f !== '') || typeof f == 'number' || typeof f == 'bigint')
          return v !== null ? null : r(g, d, '' + f, L);
        if (typeof f == 'object' && f !== null) {
          switch (f.$$typeof) {
            case $u:
              return f.key === v ? s(g, d, f, L) : null;
            case Gn:
              return f.key === v ? i(g, d, f, L) : null;
            case el:
              return ((f = Ul(f)), m(g, d, f, L));
          }
          if (Vn(f) || Nn(f)) return v !== null ? null : c(g, d, f, L, null);
          if (typeof f.then == 'function') return m(g, d, sr(f), L);
          if (f.$$typeof === Pa) return m(g, d, rr(g, f), L);
          ir(g, f);
        }
        return null;
      }
      function h(g, d, f, L, v) {
        if ((typeof L == 'string' && L !== '') || typeof L == 'number' || typeof L == 'bigint')
          return ((g = g.get(f) || null), r(d, g, '' + L, v));
        if (typeof L == 'object' && L !== null) {
          switch (L.$$typeof) {
            case $u:
              return ((g = g.get(L.key === null ? f : L.key) || null), s(d, g, L, v));
            case Gn:
              return ((g = g.get(L.key === null ? f : L.key) || null), i(d, g, L, v));
            case el:
              return ((L = Ul(L)), h(g, d, f, L, v));
          }
          if (Vn(L) || Nn(L)) return ((g = g.get(f) || null), c(d, g, L, v, null));
          if (typeof L.then == 'function') return h(g, d, f, sr(L), v);
          if (L.$$typeof === Pa) return h(g, d, f, rr(d, L), v);
          ir(d, L);
        }
        return null;
      }
      function S(g, d, f, L) {
        for (
          var v = null, I = null, C = d, b = (d = 0), A = null;
          C !== null && b < f.length;
          b++
        ) {
          C.index > b ? ((A = C), (C = null)) : (A = C.sibling);
          var T = m(g, C, f[b], L);
          if (T === null) {
            C === null && (C = A);
            break;
          }
          (e && C && T.alternate === null && t(g, C),
            (d = n(T, d, b)),
            I === null ? (v = T) : (I.sibling = T),
            (I = T),
            (C = A));
        }
        if (b === f.length) return (a(g, C), te && Oa(g, b), v);
        if (C === null) {
          for (; b < f.length; b++)
            ((C = p(g, f[b], L)),
              C !== null && ((d = n(C, d, b)), I === null ? (v = C) : (I.sibling = C), (I = C)));
          return (te && Oa(g, b), v);
        }
        for (C = l(C); b < f.length; b++)
          ((A = h(C, g, b, f[b], L)),
            A !== null &&
              (e && A.alternate !== null && C.delete(A.key === null ? b : A.key),
              (d = n(A, d, b)),
              I === null ? (v = A) : (I.sibling = A),
              (I = A)));
        return (
          e &&
            C.forEach(function (D) {
              return t(g, D);
            }),
          te && Oa(g, b),
          v
        );
      }
      function x(g, d, f, L) {
        if (f == null) throw Error(w(151));
        for (
          var v = null, I = null, C = d, b = (d = 0), A = null, T = f.next();
          C !== null && !T.done;
          b++, T = f.next()
        ) {
          C.index > b ? ((A = C), (C = null)) : (A = C.sibling);
          var D = m(g, C, T.value, L);
          if (D === null) {
            C === null && (C = A);
            break;
          }
          (e && C && D.alternate === null && t(g, C),
            (d = n(D, d, b)),
            I === null ? (v = D) : (I.sibling = D),
            (I = D),
            (C = A));
        }
        if (T.done) return (a(g, C), te && Oa(g, b), v);
        if (C === null) {
          for (; !T.done; b++, T = f.next())
            ((T = p(g, T.value, L)),
              T !== null && ((d = n(T, d, b)), I === null ? (v = T) : (I.sibling = T), (I = T)));
          return (te && Oa(g, b), v);
        }
        for (C = l(C); !T.done; b++, T = f.next())
          ((T = h(C, g, b, T.value, L)),
            T !== null &&
              (e && T.alternate !== null && C.delete(T.key === null ? b : T.key),
              (d = n(T, d, b)),
              I === null ? (v = T) : (I.sibling = T),
              (I = T)));
        return (
          e &&
            C.forEach(function (F) {
              return t(g, F);
            }),
          te && Oa(g, b),
          v
        );
      }
      function y(g, d, f, L) {
        if (
          (typeof f == 'object' &&
            f !== null &&
            f.type === Oo &&
            f.key === null &&
            (f = f.props.children),
          typeof f == 'object' && f !== null)
        ) {
          switch (f.$$typeof) {
            case $u:
              e: {
                for (var v = f.key; d !== null;) {
                  if (d.key === v) {
                    if (((v = f.type), v === Oo)) {
                      if (d.tag === 7) {
                        (a(g, d.sibling), (L = o(d, f.props.children)), (L.return = g), (g = L));
                        break e;
                      }
                    } else if (
                      d.elementType === v ||
                      (typeof v == 'object' && v !== null && v.$$typeof === el && Ul(v) === d.type)
                    ) {
                      (a(g, d.sibling), (L = o(d, f.props)), Hn(L, f), (L.return = g), (g = L));
                      break e;
                    }
                    a(g, d);
                    break;
                  } else t(g, d);
                  d = d.sibling;
                }
                f.type === Oo
                  ? ((L = Gl(f.props.children, g.mode, L, f.key)), (L.return = g), (g = L))
                  : ((L = yr(f.type, f.key, f.props, null, g.mode, L)),
                    Hn(L, f),
                    (L.return = g),
                    (g = L));
              }
              return u(g);
            case Gn:
              e: {
                for (v = f.key; d !== null;) {
                  if (d.key === v)
                    if (
                      d.tag === 4 &&
                      d.stateNode.containerInfo === f.containerInfo &&
                      d.stateNode.implementation === f.implementation
                    ) {
                      (a(g, d.sibling), (L = o(d, f.children || [])), (L.return = g), (g = L));
                      break e;
                    } else {
                      a(g, d);
                      break;
                    }
                  else t(g, d);
                  d = d.sibling;
                }
                ((L = Ki(f, g.mode, L)), (L.return = g), (g = L));
              }
              return u(g);
            case el:
              return ((f = Ul(f)), y(g, d, f, L));
          }
          if (Vn(f)) return S(g, d, f, L);
          if (Nn(f)) {
            if (((v = Nn(f)), typeof v != 'function')) throw Error(w(150));
            return ((f = v.call(f)), x(g, d, f, L));
          }
          if (typeof f.then == 'function') return y(g, d, sr(f), L);
          if (f.$$typeof === Pa) return y(g, d, rr(g, f), L);
          ir(g, f);
        }
        return (typeof f == 'string' && f !== '') || typeof f == 'number' || typeof f == 'bigint'
          ? ((f = '' + f),
            d !== null && d.tag === 6
              ? (a(g, d.sibling), (L = o(d, f)), (L.return = g), (g = L))
              : (a(g, d), (L = Yi(f, g.mode, L)), (L.return = g), (g = L)),
            u(g))
          : a(g, d);
      }
      return function (g, d, f, L) {
        try {
          mu = 0;
          var v = y(g, d, f, L);
          return ((Zo = null), v);
        } catch (C) {
          if (C === mn || C === ms) throw C;
          var I = kt(29, C, null, g.mode);
          return ((I.lanes = L), (I.return = g), I);
        }
      };
    }
    var Zl = ug(!0),
      rg = ug(!1),
      tl = !1;
    function Dc(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function Hf(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          }));
    }
    function ml(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function pl(e, t, a) {
      var l = e.updateQueue;
      if (l === null) return null;
      if (((l = l.shared), (oe & 2) !== 0)) {
        var o = l.pending;
        return (
          o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
          (l.pending = t),
          (t = Hr(e)),
          Jh(e, null, a),
          t
        );
      }
      return (ds(e, l, t, a), Hr(e));
    }
    function Jn(e, t, a) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))) {
        var l = t.lanes;
        ((l &= e.pendingLanes), (a |= l), (t.lanes = a), wh(e, a));
      }
    }
    function Qi(e, t) {
      var a = e.updateQueue,
        l = e.alternate;
      if (l !== null && ((l = l.updateQueue), a === l)) {
        var o = null,
          n = null;
        if (((a = a.firstBaseUpdate), a !== null)) {
          do {
            var u = { lane: a.lane, tag: a.tag, payload: a.payload, callback: null, next: null };
            (n === null ? (o = n = u) : (n = n.next = u), (a = a.next));
          } while (a !== null);
          n === null ? (o = n = t) : (n = n.next = t);
        } else o = n = t;
        ((a = {
          baseState: l.baseState,
          firstBaseUpdate: o,
          lastBaseUpdate: n,
          shared: l.shared,
          callbacks: l.callbacks,
        }),
          (e.updateQueue = a));
        return;
      }
      ((e = a.lastBaseUpdate),
        e === null ? (a.firstBaseUpdate = t) : (e.next = t),
        (a.lastBaseUpdate = t));
    }
    var zf = !1;
    function $n() {
      if (zf) {
        var e = Ko;
        if (e !== null) throw e;
      }
    }
    function eu(e, t, a, l) {
      zf = !1;
      var o = e.updateQueue;
      tl = !1;
      var n = o.firstBaseUpdate,
        u = o.lastBaseUpdate,
        r = o.shared.pending;
      if (r !== null) {
        o.shared.pending = null;
        var s = r,
          i = s.next;
        ((s.next = null), u === null ? (n = i) : (u.next = i), (u = s));
        var c = e.alternate;
        c !== null &&
          ((c = c.updateQueue),
          (r = c.lastBaseUpdate),
          r !== u && (r === null ? (c.firstBaseUpdate = i) : (r.next = i), (c.lastBaseUpdate = s)));
      }
      if (n !== null) {
        var p = o.baseState;
        ((u = 0), (c = i = s = null), (r = n));
        do {
          var m = r.lane & -536870913,
            h = m !== r.lane;
          if (h ? ($ & m) === m : (l & m) === m) {
            (m !== 0 && m === tn && (zf = !0),
              c !== null &&
                (c = c.next =
                  { lane: 0, tag: r.tag, payload: r.payload, callback: null, next: null }));
            e: {
              var S = e,
                x = r;
              m = t;
              var y = a;
              switch (x.tag) {
                case 1:
                  if (((S = x.payload), typeof S == 'function')) {
                    p = S.call(y, p, m);
                    break e;
                  }
                  p = S;
                  break e;
                case 3:
                  S.flags = (S.flags & -65537) | 128;
                case 0:
                  if (
                    ((S = x.payload), (m = typeof S == 'function' ? S.call(y, p, m) : S), m == null)
                  )
                    break e;
                  p = Ce({}, p, m);
                  break e;
                case 2:
                  tl = !0;
              }
            }
            ((m = r.callback),
              m !== null &&
                ((e.flags |= 64),
                h && (e.flags |= 8192),
                (h = o.callbacks),
                h === null ? (o.callbacks = [m]) : h.push(m)));
          } else
            ((h = { lane: m, tag: r.tag, payload: r.payload, callback: r.callback, next: null }),
              c === null ? ((i = c = h), (s = p)) : (c = c.next = h),
              (u |= m));
          if (((r = r.next), r === null)) {
            if (((r = o.shared.pending), r === null)) break;
            ((h = r),
              (r = h.next),
              (h.next = null),
              (o.lastBaseUpdate = h),
              (o.shared.pending = null));
          }
        } while (!0);
        (c === null && (s = p),
          (o.baseState = s),
          (o.firstBaseUpdate = i),
          (o.lastBaseUpdate = c),
          n === null && (o.shared.lanes = 0),
          (bl |= u),
          (e.lanes = u),
          (e.memoizedState = p));
      }
    }
    function sg(e, t) {
      if (typeof e != 'function') throw Error(w(191, e));
      e.call(t);
    }
    function ig(e, t) {
      var a = e.callbacks;
      if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) sg(a[e], t);
    }
    var an = La(null),
      Fr = La(0);
    function Lp(e, t) {
      ((e = Xa), xe(Fr, e), xe(an, t), (Xa = e | t.baseLanes));
    }
    function Uf() {
      (xe(Fr, Xa), xe(an, an.current));
    }
    function Ec() {
      ((Xa = Fr.current), Ke(an), Ke(Fr));
    }
    var Nt = La(null),
      Yt = null;
    function ll(e) {
      var t = e.alternate;
      (xe(Oe, Oe.current & 1),
        xe(Nt, e),
        Yt === null && (t === null || an.current !== null || t.memoizedState !== null) && (Yt = e));
    }
    function qf(e) {
      (xe(Oe, Oe.current), xe(Nt, e), Yt === null && (Yt = e));
    }
    function fg(e) {
      e.tag === 22 ? (xe(Oe, Oe.current), xe(Nt, e), Yt === null && (Yt = e)) : ol(e);
    }
    function ol() {
      (xe(Oe, Oe.current), xe(Nt, Nt.current));
    }
    function Tt(e) {
      (Ke(Nt), Yt === e && (Yt = null), Ke(Oe));
    }
    var Oe = La(0);
    function Gr(e) {
      for (var t = e; t !== null;) {
        if (t.tag === 13) {
          var a = t.memoizedState;
          if (a !== null && ((a = a.dehydrated), a === null || uc(a) || rc(a))) return t;
        } else if (
          t.tag === 19 &&
          (t.memoizedProps.revealOrder === 'forwards' ||
            t.memoizedProps.revealOrder === 'backwards' ||
            t.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
            t.memoizedProps.revealOrder === 'together')
        ) {
          if ((t.flags & 128) !== 0) return t;
        } else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var Fa = 0,
      j = null,
      de = null,
      Pe = null,
      Vr = !1,
      Qo = !1,
      Ql = !1,
      Xr = 0,
      pu = 0,
      Wo = null,
      bb = 0;
    function Me() {
      throw Error(w(321));
    }
    function Oc(e, t) {
      if (t === null) return !1;
      for (var a = 0; a < t.length && a < e.length; a++) if (!Pt(e[a], t[a])) return !1;
      return !0;
    }
    function Bc(e, t, a, l, o, n) {
      return (
        (Fa = n),
        (j = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (N.H = e === null || e.memoizedState === null ? qg : Xc),
        (Ql = !1),
        (n = a(l, o)),
        (Ql = !1),
        Qo && (n = dg(t, a, l, o)),
        cg(e),
        n
      );
    }
    function cg(e) {
      N.H = hu;
      var t = de !== null && de.next !== null;
      if (((Fa = 0), (Pe = de = j = null), (Vr = !1), (pu = 0), (Wo = null), t))
        throw Error(w(300));
      e === null || He || ((e = e.dependencies), e !== null && Ur(e) && (He = !0));
    }
    function dg(e, t, a, l) {
      j = e;
      var o = 0;
      do {
        if ((Qo && (Wo = null), (pu = 0), (Qo = !1), 25 <= o)) throw Error(w(301));
        if (((o += 1), (Pe = de = null), e.updateQueue != null)) {
          var n = e.updateQueue;
          ((n.lastEffect = null),
            (n.events = null),
            (n.stores = null),
            n.memoCache != null && (n.memoCache.index = 0));
        }
        ((N.H = Fg), (n = t(a, l)));
      } while (Qo);
      return n;
    }
    function Ib() {
      var e = N.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == 'function' ? Tu(t) : t),
        (e = e.useState()[0]),
        (de !== null ? de.memoizedState : null) !== e && (j.flags |= 1024),
        t
      );
    }
    function Pc() {
      var e = Xr !== 0;
      return ((Xr = 0), e);
    }
    function Nc(e, t, a) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~a));
    }
    function _c(e) {
      if (Vr) {
        for (e = e.memoizedState; e !== null;) {
          var t = e.queue;
          (t !== null && (t.pending = null), (e = e.next));
        }
        Vr = !1;
      }
      ((Fa = 0), (Pe = de = j = null), (Qo = !1), (pu = Xr = 0), (Wo = null));
    }
    function ct() {
      var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return (Pe === null ? (j.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe);
    }
    function Be() {
      if (de === null) {
        var e = j.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = de.next;
      var t = Pe === null ? j.memoizedState : Pe.next;
      if (t !== null) ((Pe = t), (de = e));
      else {
        if (e === null) throw j.alternate === null ? Error(w(467)) : Error(w(310));
        ((de = e),
          (e = {
            memoizedState: de.memoizedState,
            baseState: de.baseState,
            baseQueue: de.baseQueue,
            queue: de.queue,
            next: null,
          }),
          Pe === null ? (j.memoizedState = Pe = e) : (Pe = Pe.next = e));
      }
      return Pe;
    }
    function ps() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Tu(e) {
      var t = pu;
      return (
        (pu += 1),
        Wo === null && (Wo = []),
        (e = ng(Wo, e, t)),
        (t = j),
        (Pe === null ? t.memoizedState : Pe.next) === null &&
          ((t = t.alternate), (N.H = t === null || t.memoizedState === null ? qg : Xc)),
        e
      );
    }
    function hs(e) {
      if (e !== null && typeof e == 'object') {
        if (typeof e.then == 'function') return Tu(e);
        if (e.$$typeof === Pa) return $e(e);
      }
      throw Error(w(438, String(e)));
    }
    function Hc(e) {
      var t = null,
        a = j.updateQueue;
      if ((a !== null && (t = a.memoCache), t == null)) {
        var l = j.alternate;
        l !== null &&
          ((l = l.updateQueue),
          l !== null &&
            ((l = l.memoCache),
            l != null &&
              (t = {
                data: l.data.map(function (o) {
                  return o.slice();
                }),
                index: 0,
              })));
      }
      if (
        (t == null && (t = { data: [], index: 0 }),
        a === null && ((a = ps()), (j.updateQueue = a)),
        (a.memoCache = t),
        (a = t.data[t.index]),
        a === void 0)
      )
        for (a = t.data[t.index] = Array(e), l = 0; l < e; l++) a[l] = iC;
      return (t.index++, a);
    }
    function Ga(e, t) {
      return typeof t == 'function' ? t(e) : t;
    }
    function br(e) {
      var t = Be();
      return zc(t, de, e);
    }
    function zc(e, t, a) {
      var l = e.queue;
      if (l === null) throw Error(w(311));
      l.lastRenderedReducer = a;
      var o = e.baseQueue,
        n = l.pending;
      if (n !== null) {
        if (o !== null) {
          var u = o.next;
          ((o.next = n.next), (n.next = u));
        }
        ((t.baseQueue = o = n), (l.pending = null));
      }
      if (((n = e.baseState), o === null)) e.memoizedState = n;
      else {
        t = o.next;
        var r = (u = null),
          s = null,
          i = t,
          c = !1;
        do {
          var p = i.lane & -536870913;
          if (p !== i.lane ? ($ & p) === p : (Fa & p) === p) {
            var m = i.revertLane;
            if (m === 0)
              (s !== null &&
                (s = s.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: i.action,
                    hasEagerState: i.hasEagerState,
                    eagerState: i.eagerState,
                    next: null,
                  }),
                p === tn && (c = !0));
            else if ((Fa & m) === m) {
              ((i = i.next), m === tn && (c = !0));
              continue;
            } else
              ((p = {
                lane: 0,
                revertLane: i.revertLane,
                gesture: null,
                action: i.action,
                hasEagerState: i.hasEagerState,
                eagerState: i.eagerState,
                next: null,
              }),
                s === null ? ((r = s = p), (u = n)) : (s = s.next = p),
                (j.lanes |= m),
                (bl |= m));
            ((p = i.action), Ql && a(n, p), (n = i.hasEagerState ? i.eagerState : a(n, p)));
          } else
            ((m = {
              lane: p,
              revertLane: i.revertLane,
              gesture: i.gesture,
              action: i.action,
              hasEagerState: i.hasEagerState,
              eagerState: i.eagerState,
              next: null,
            }),
              s === null ? ((r = s = m), (u = n)) : (s = s.next = m),
              (j.lanes |= p),
              (bl |= p));
          i = i.next;
        } while (i !== null && i !== t);
        if (
          (s === null ? (u = n) : (s.next = r),
          !Pt(n, e.memoizedState) && ((He = !0), c && ((a = Ko), a !== null)))
        )
          throw a;
        ((e.memoizedState = n), (e.baseState = u), (e.baseQueue = s), (l.lastRenderedState = n));
      }
      return (o === null && (l.lanes = 0), [e.memoizedState, l.dispatch]);
    }
    function Wi(e) {
      var t = Be(),
        a = t.queue;
      if (a === null) throw Error(w(311));
      a.lastRenderedReducer = e;
      var l = a.dispatch,
        o = a.pending,
        n = t.memoizedState;
      if (o !== null) {
        a.pending = null;
        var u = (o = o.next);
        do ((n = e(n, u.action)), (u = u.next));
        while (u !== o);
        (Pt(n, t.memoizedState) || (He = !0),
          (t.memoizedState = n),
          t.baseQueue === null && (t.baseState = n),
          (a.lastRenderedState = n));
      }
      return [n, l];
    }
    function mg(e, t, a) {
      var l = j,
        o = Be(),
        n = te;
      if (n) {
        if (a === void 0) throw Error(w(407));
        a = a();
      } else a = t();
      var u = !Pt((de || o).memoizedState, a);
      if (
        (u && ((o.memoizedState = a), (He = !0)),
        (o = o.queue),
        Uc(gg.bind(null, l, o, e), [e]),
        o.getSnapshot !== t || u || (Pe !== null && Pe.memoizedState.tag & 1))
      ) {
        if (
          ((l.flags |= 2048),
          ln(9, { destroy: void 0 }, hg.bind(null, l, o, a, t), null),
          pe === null)
        )
          throw Error(w(349));
        n || (Fa & 127) !== 0 || pg(l, t, a);
      }
      return a;
    }
    function pg(e, t, a) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: a }),
        (t = j.updateQueue),
        t === null
          ? ((t = ps()), (j.updateQueue = t), (t.stores = [e]))
          : ((a = t.stores), a === null ? (t.stores = [e]) : a.push(e)));
    }
    function hg(e, t, a, l) {
      ((t.value = a), (t.getSnapshot = l), xg(t) && Lg(e));
    }
    function gg(e, t, a) {
      return a(function () {
        xg(t) && Lg(e);
      });
    }
    function xg(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !Pt(e, a);
      } catch {
        return !0;
      }
    }
    function Lg(e) {
      var t = to(e, 2);
      t !== null && St(t, e, 2);
    }
    function Ff(e) {
      var t = ct();
      if (typeof e == 'function') {
        var a = e;
        if (((e = a()), Ql)) {
          ul(!0);
          try {
            a();
          } finally {
            ul(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ga,
          lastRenderedState: e,
        }),
        t
      );
    }
    function Sg(e, t, a, l) {
      return ((e.baseState = a), zc(e, de, typeof l == 'function' ? l : Ga));
    }
    function wb(e, t, a, l, o) {
      if (xs(e)) throw Error(w(485));
      if (((e = t.action), e !== null)) {
        var n = {
          payload: o,
          action: e,
          next: null,
          isTransition: !0,
          status: 'pending',
          value: null,
          reason: null,
          listeners: [],
          then: function (u) {
            n.listeners.push(u);
          },
        };
        (N.T !== null ? a(!0) : (n.isTransition = !1),
          l(n),
          (a = t.pending),
          a === null
            ? ((n.next = t.pending = n), vg(t, n))
            : ((n.next = a.next), (t.pending = a.next = n)));
      }
    }
    function vg(e, t) {
      var a = t.action,
        l = t.payload,
        o = e.state;
      if (t.isTransition) {
        var n = N.T,
          u = {};
        N.T = u;
        try {
          var r = a(o, l),
            s = N.S;
          (s !== null && s(u, r), Sp(e, t, r));
        } catch (i) {
          Gf(e, t, i);
        } finally {
          (n !== null && u.types !== null && (n.types = u.types), (N.T = n));
        }
      } else
        try {
          ((n = a(o, l)), Sp(e, t, n));
        } catch (i) {
          Gf(e, t, i);
        }
    }
    function Sp(e, t, a) {
      a !== null && typeof a == 'object' && typeof a.then == 'function'
        ? a.then(
            function (l) {
              vp(e, t, l);
            },
            function (l) {
              return Gf(e, t, l);
            },
          )
        : vp(e, t, a);
    }
    function vp(e, t, a) {
      ((t.status = 'fulfilled'),
        (t.value = a),
        yg(t),
        (e.state = a),
        (t = e.pending),
        t !== null &&
          ((a = t.next), a === t ? (e.pending = null) : ((a = a.next), (t.next = a), vg(e, a))));
    }
    function Gf(e, t, a) {
      var l = e.pending;
      if (((e.pending = null), l !== null)) {
        l = l.next;
        do ((t.status = 'rejected'), (t.reason = a), yg(t), (t = t.next));
        while (t !== l);
      }
      e.action = null;
    }
    function yg(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Cg(e, t) {
      return t;
    }
    function yp(e, t) {
      if (te) {
        var a = pe.formState;
        if (a !== null) {
          e: {
            var l = j;
            if (te) {
              if (ye) {
                t: {
                  for (var o = ye, n = jt; o.nodeType !== 8;) {
                    if (!n) {
                      o = null;
                      break t;
                    }
                    if (((o = Kt(o.nextSibling)), o === null)) {
                      o = null;
                      break t;
                    }
                  }
                  ((n = o.data), (o = n === 'F!' || n === 'F' ? o : null));
                }
                if (o) {
                  ((ye = Kt(o.nextSibling)), (l = o.data === 'F!'));
                  break e;
                }
              }
              yl(l);
            }
            l = !1;
          }
          l && (t = a[0]);
        }
      }
      return (
        (a = ct()),
        (a.memoizedState = a.baseState = t),
        (l = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Cg,
          lastRenderedState: t,
        }),
        (a.queue = l),
        (a = Hg.bind(null, j, l)),
        (l.dispatch = a),
        (l = Ff(!1)),
        (n = Vc.bind(null, j, !1, l.queue)),
        (l = ct()),
        (o = { state: t, dispatch: null, action: e, pending: null }),
        (l.queue = o),
        (a = wb.bind(null, j, o, n, a)),
        (o.dispatch = a),
        (l.memoizedState = e),
        [t, a, !1]
      );
    }
    function Cp(e) {
      var t = Be();
      return bg(t, de, e);
    }
    function bg(e, t, a) {
      if (
        ((t = zc(e, t, Cg)[0]),
        (e = br(Ga)[0]),
        typeof t == 'object' && t !== null && typeof t.then == 'function')
      )
        try {
          var l = Tu(t);
        } catch (u) {
          throw u === mn ? ms : u;
        }
      else l = t;
      t = Be();
      var o = t.queue,
        n = o.dispatch;
      return (
        a !== t.memoizedState &&
          ((j.flags |= 2048), ln(9, { destroy: void 0 }, Rb.bind(null, o, a), null)),
        [l, n, e]
      );
    }
    function Rb(e, t) {
      e.action = t;
    }
    function bp(e) {
      var t = Be(),
        a = de;
      if (a !== null) return bg(t, a, e);
      (Be(), (t = t.memoizedState), (a = Be()));
      var l = a.queue.dispatch;
      return ((a.memoizedState = e), [t, l, !1]);
    }
    function ln(e, t, a, l) {
      return (
        (e = { tag: e, create: a, deps: l, inst: t, next: null }),
        (t = j.updateQueue),
        t === null && ((t = ps()), (j.updateQueue = t)),
        (a = t.lastEffect),
        a === null
          ? (t.lastEffect = e.next = e)
          : ((l = a.next), (a.next = e), (e.next = l), (t.lastEffect = e)),
        e
      );
    }
    function Ig() {
      return Be().memoizedState;
    }
    function Ir(e, t, a, l) {
      var o = ct();
      ((j.flags |= e),
        (o.memoizedState = ln(1 | t, { destroy: void 0 }, a, l === void 0 ? null : l)));
    }
    function gs(e, t, a, l) {
      var o = Be();
      l = l === void 0 ? null : l;
      var n = o.memoizedState.inst;
      de !== null && l !== null && Oc(l, de.memoizedState.deps)
        ? (o.memoizedState = ln(t, n, a, l))
        : ((j.flags |= e), (o.memoizedState = ln(1 | t, n, a, l)));
    }
    function Ip(e, t) {
      Ir(8390656, 8, e, t);
    }
    function Uc(e, t) {
      gs(2048, 8, e, t);
    }
    function Ab(e) {
      j.flags |= 4;
      var t = j.updateQueue;
      if (t === null) ((t = ps()), (j.updateQueue = t), (t.events = [e]));
      else {
        var a = t.events;
        a === null ? (t.events = [e]) : a.push(e);
      }
    }
    function wg(e) {
      var t = Be().memoizedState;
      return (
        Ab({ ref: t, nextImpl: e }),
        function () {
          if ((oe & 2) !== 0) throw Error(w(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function Rg(e, t) {
      return gs(4, 2, e, t);
    }
    function Ag(e, t) {
      return gs(4, 4, e, t);
    }
    function Tg(e, t) {
      if (typeof t == 'function') {
        e = e();
        var a = t(e);
        return function () {
          typeof a == 'function' ? a() : t(null);
        };
      }
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function kg(e, t, a) {
      ((a = a != null ? a.concat([e]) : null), gs(4, 4, Tg.bind(null, t, e), a));
    }
    function qc() {}
    function Mg(e, t) {
      var a = Be();
      t = t === void 0 ? null : t;
      var l = a.memoizedState;
      return t !== null && Oc(t, l[1]) ? l[0] : ((a.memoizedState = [e, t]), e);
    }
    function Dg(e, t) {
      var a = Be();
      t = t === void 0 ? null : t;
      var l = a.memoizedState;
      if (t !== null && Oc(t, l[1])) return l[0];
      if (((l = e()), Ql)) {
        ul(!0);
        try {
          e();
        } finally {
          ul(!1);
        }
      }
      return ((a.memoizedState = [l, t]), l);
    }
    function Fc(e, t, a) {
      return a === void 0 || ((Fa & 1073741824) !== 0 && ($ & 261930) === 0)
        ? (e.memoizedState = t)
        : ((e.memoizedState = a), (e = Sx()), (j.lanes |= e), (bl |= e), a);
    }
    function Eg(e, t, a, l) {
      return Pt(a, t)
        ? a
        : an.current !== null
          ? ((e = Fc(e, a, l)), Pt(e, t) || (He = !0), e)
          : (Fa & 42) === 0 || ((Fa & 1073741824) !== 0 && ($ & 261930) === 0)
            ? ((He = !0), (e.memoizedState = a))
            : ((e = Sx()), (j.lanes |= e), (bl |= e), t);
    }
    function Og(e, t, a, l, o) {
      var n = ne.p;
      ne.p = n !== 0 && 8 > n ? n : 8;
      var u = N.T,
        r = {};
      ((N.T = r), Vc(e, !1, t, a));
      try {
        var s = o(),
          i = N.S;
        if (
          (i !== null && i(r, s), s !== null && typeof s == 'object' && typeof s.then == 'function')
        ) {
          var c = Cb(s, l);
          tu(e, t, c, Bt(e));
        } else tu(e, t, l, Bt(e));
      } catch (p) {
        tu(e, t, { then: function () {}, status: 'rejected', reason: p }, Bt());
      } finally {
        ((ne.p = n), u !== null && r.types !== null && (u.types = r.types), (N.T = u));
      }
    }
    function Tb() {}
    function Vf(e, t, a, l) {
      if (e.tag !== 5) throw Error(w(476));
      var o = Bg(e).queue;
      Og(
        e,
        o,
        t,
        Fl,
        a === null
          ? Tb
          : function () {
              return (Pg(e), a(l));
            },
      );
    }
    function Bg(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: Fl,
        baseState: Fl,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ga,
          lastRenderedState: Fl,
        },
        next: null,
      };
      var a = {};
      return (
        (t.next = {
          memoizedState: a,
          baseState: a,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Ga,
            lastRenderedState: a,
          },
          next: null,
        }),
        (e.memoizedState = t),
        (e = e.alternate),
        e !== null && (e.memoizedState = t),
        t
      );
    }
    function Pg(e) {
      var t = Bg(e);
      (t.next === null && (t = e.alternate.memoizedState), tu(e, t.next.queue, {}, Bt()));
    }
    function Gc() {
      return $e(Lu);
    }
    function Ng() {
      return Be().memoizedState;
    }
    function _g() {
      return Be().memoizedState;
    }
    function kb(e) {
      for (var t = e.return; t !== null;) {
        switch (t.tag) {
          case 24:
          case 3:
            var a = Bt();
            e = ml(a);
            var l = pl(t, e, a);
            (l !== null && (St(l, t, a), Jn(l, t, a)), (t = { cache: Tc() }), (e.payload = t));
            return;
        }
        t = t.return;
      }
    }
    function Mb(e, t, a) {
      var l = Bt();
      ((a = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        xs(e) ? zg(t, a) : ((a = Ic(e, t, a, l)), a !== null && (St(a, e, l), Ug(a, t, l))));
    }
    function Hg(e, t, a) {
      var l = Bt();
      tu(e, t, a, l);
    }
    function tu(e, t, a, l) {
      var o = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (xs(e)) zg(t, o);
      else {
        var n = e.alternate;
        if (
          e.lanes === 0 &&
          (n === null || n.lanes === 0) &&
          ((n = t.lastRenderedReducer), n !== null)
        )
          try {
            var u = t.lastRenderedState,
              r = n(u, a);
            if (((o.hasEagerState = !0), (o.eagerState = r), Pt(r, u)))
              return (ds(e, t, o, 0), pe === null && cs(), !1);
          } catch {}
        if (((a = Ic(e, t, o, l)), a !== null)) return (St(a, e, l), Ug(a, t, l), !0);
      }
      return !1;
    }
    function Vc(e, t, a, l) {
      if (
        ((l = {
          lane: 2,
          revertLane: $c(),
          gesture: null,
          action: l,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        xs(e))
      ) {
        if (t) throw Error(w(479));
      } else ((t = Ic(e, a, l, 2)), t !== null && St(t, e, 2));
    }
    function xs(e) {
      var t = e.alternate;
      return e === j || (t !== null && t === j);
    }
    function zg(e, t) {
      Qo = Vr = !0;
      var a = e.pending;
      (a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)), (e.pending = t));
    }
    function Ug(e, t, a) {
      if ((a & 4194048) !== 0) {
        var l = t.lanes;
        ((l &= e.pendingLanes), (a |= l), (t.lanes = a), wh(e, a));
      }
    }
    var hu = {
      readContext: $e,
      use: hs,
      useCallback: Me,
      useContext: Me,
      useEffect: Me,
      useImperativeHandle: Me,
      useLayoutEffect: Me,
      useInsertionEffect: Me,
      useMemo: Me,
      useReducer: Me,
      useRef: Me,
      useState: Me,
      useDebugValue: Me,
      useDeferredValue: Me,
      useTransition: Me,
      useSyncExternalStore: Me,
      useId: Me,
      useHostTransitionStatus: Me,
      useFormState: Me,
      useActionState: Me,
      useOptimistic: Me,
      useMemoCache: Me,
      useCacheRefresh: Me,
    };
    hu.useEffectEvent = Me;
    var qg = {
        readContext: $e,
        use: hs,
        useCallback: function (e, t) {
          return ((ct().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: $e,
        useEffect: Ip,
        useImperativeHandle: function (e, t, a) {
          ((a = a != null ? a.concat([e]) : null), Ir(4194308, 4, Tg.bind(null, t, e), a));
        },
        useLayoutEffect: function (e, t) {
          return Ir(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          Ir(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var a = ct();
          t = t === void 0 ? null : t;
          var l = e();
          if (Ql) {
            ul(!0);
            try {
              e();
            } finally {
              ul(!1);
            }
          }
          return ((a.memoizedState = [l, t]), l);
        },
        useReducer: function (e, t, a) {
          var l = ct();
          if (a !== void 0) {
            var o = a(t);
            if (Ql) {
              ul(!0);
              try {
                a(t);
              } finally {
                ul(!1);
              }
            }
          } else o = t;
          return (
            (l.memoizedState = l.baseState = o),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: o,
            }),
            (l.queue = e),
            (e = e.dispatch = Mb.bind(null, j, e)),
            [l.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = ct();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: function (e) {
          e = Ff(e);
          var t = e.queue,
            a = Hg.bind(null, j, t);
          return ((t.dispatch = a), [e.memoizedState, a]);
        },
        useDebugValue: qc,
        useDeferredValue: function (e, t) {
          var a = ct();
          return Fc(a, e, t);
        },
        useTransition: function () {
          var e = Ff(!1);
          return ((e = Og.bind(null, j, e.queue, !0, !1)), (ct().memoizedState = e), [!1, e]);
        },
        useSyncExternalStore: function (e, t, a) {
          var l = j,
            o = ct();
          if (te) {
            if (a === void 0) throw Error(w(407));
            a = a();
          } else {
            if (((a = t()), pe === null)) throw Error(w(349));
            ($ & 127) !== 0 || pg(l, t, a);
          }
          o.memoizedState = a;
          var n = { value: a, getSnapshot: t };
          return (
            (o.queue = n),
            Ip(gg.bind(null, l, n, e), [e]),
            (l.flags |= 2048),
            ln(9, { destroy: void 0 }, hg.bind(null, l, n, a, t), null),
            a
          );
        },
        useId: function () {
          var e = ct(),
            t = pe.identifierPrefix;
          if (te) {
            var a = ha,
              l = pa;
            ((a = (l & ~(1 << (32 - Ot(l) - 1))).toString(32) + a),
              (t = '_' + t + 'R_' + a),
              (a = Xr++),
              0 < a && (t += 'H' + a.toString(32)),
              (t += '_'));
          } else ((a = bb++), (t = '_' + t + 'r_' + a.toString(32) + '_'));
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: Gc,
        useFormState: yp,
        useActionState: yp,
        useOptimistic: function (e) {
          var t = ct();
          t.memoizedState = t.baseState = e;
          var a = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return ((t.queue = a), (t = Vc.bind(null, j, !0, a)), (a.dispatch = t), [e, t]);
        },
        useMemoCache: Hc,
        useCacheRefresh: function () {
          return (ct().memoizedState = kb.bind(null, j));
        },
        useEffectEvent: function (e) {
          var t = ct(),
            a = { impl: e };
          return (
            (t.memoizedState = a),
            function () {
              if ((oe & 2) !== 0) throw Error(w(440));
              return a.impl.apply(void 0, arguments);
            }
          );
        },
      },
      Xc = {
        readContext: $e,
        use: hs,
        useCallback: Mg,
        useContext: $e,
        useEffect: Uc,
        useImperativeHandle: kg,
        useInsertionEffect: Rg,
        useLayoutEffect: Ag,
        useMemo: Dg,
        useReducer: br,
        useRef: Ig,
        useState: function () {
          return br(Ga);
        },
        useDebugValue: qc,
        useDeferredValue: function (e, t) {
          var a = Be();
          return Eg(a, de.memoizedState, e, t);
        },
        useTransition: function () {
          var e = br(Ga)[0],
            t = Be().memoizedState;
          return [typeof e == 'boolean' ? e : Tu(e), t];
        },
        useSyncExternalStore: mg,
        useId: Ng,
        useHostTransitionStatus: Gc,
        useFormState: Cp,
        useActionState: Cp,
        useOptimistic: function (e, t) {
          var a = Be();
          return Sg(a, de, e, t);
        },
        useMemoCache: Hc,
        useCacheRefresh: _g,
      };
    Xc.useEffectEvent = wg;
    var Fg = {
      readContext: $e,
      use: hs,
      useCallback: Mg,
      useContext: $e,
      useEffect: Uc,
      useImperativeHandle: kg,
      useInsertionEffect: Rg,
      useLayoutEffect: Ag,
      useMemo: Dg,
      useReducer: Wi,
      useRef: Ig,
      useState: function () {
        return Wi(Ga);
      },
      useDebugValue: qc,
      useDeferredValue: function (e, t) {
        var a = Be();
        return de === null ? Fc(a, e, t) : Eg(a, de.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Wi(Ga)[0],
          t = Be().memoizedState;
        return [typeof e == 'boolean' ? e : Tu(e), t];
      },
      useSyncExternalStore: mg,
      useId: Ng,
      useHostTransitionStatus: Gc,
      useFormState: bp,
      useActionState: bp,
      useOptimistic: function (e, t) {
        var a = Be();
        return de !== null ? Sg(a, de, e, t) : ((a.baseState = e), [e, a.queue.dispatch]);
      },
      useMemoCache: Hc,
      useCacheRefresh: _g,
    };
    Fg.useEffectEvent = wg;
    function Ji(e, t, a, l) {
      ((t = e.memoizedState),
        (a = a(l, t)),
        (a = a == null ? t : Ce({}, t, a)),
        (e.memoizedState = a),
        e.lanes === 0 && (e.updateQueue.baseState = a));
    }
    var Xf = {
      enqueueSetState: function (e, t, a) {
        e = e._reactInternals;
        var l = Bt(),
          o = ml(l);
        ((o.payload = t),
          a != null && (o.callback = a),
          (t = pl(e, o, l)),
          t !== null && (St(t, e, l), Jn(t, e, l)));
      },
      enqueueReplaceState: function (e, t, a) {
        e = e._reactInternals;
        var l = Bt(),
          o = ml(l);
        ((o.tag = 1),
          (o.payload = t),
          a != null && (o.callback = a),
          (t = pl(e, o, l)),
          t !== null && (St(t, e, l), Jn(t, e, l)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var a = Bt(),
          l = ml(a);
        ((l.tag = 2),
          t != null && (l.callback = t),
          (t = pl(e, l, a)),
          t !== null && (St(t, e, a), Jn(t, e, a)));
      },
    };
    function wp(e, t, a, l, o, n, u) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == 'function'
          ? e.shouldComponentUpdate(l, n, u)
          : t.prototype && t.prototype.isPureReactComponent
            ? !fu(a, l) || !fu(o, n)
            : !0
      );
    }
    function Rp(e, t, a, l) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(a, l),
        typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
          t.UNSAFE_componentWillReceiveProps(a, l),
        t.state !== e && Xf.enqueueReplaceState(t, t.state, null));
    }
    function Wl(e, t) {
      var a = t;
      if ('ref' in t) {
        a = {};
        for (var l in t) l !== 'ref' && (a[l] = t[l]);
      }
      if ((e = e.defaultProps)) {
        a === t && (a = Ce({}, a));
        for (var o in e) a[o] === void 0 && (a[o] = e[o]);
      }
      return a;
    }
    function Gg(e) {
      _r(e);
    }
    function Vg(e) {
      console.error(e);
    }
    function Xg(e) {
      _r(e);
    }
    function jr(e, t) {
      try {
        var a = e.onUncaughtError;
        a(t.value, { componentStack: t.stack });
      } catch (l) {
        setTimeout(function () {
          throw l;
        });
      }
    }
    function Ap(e, t, a) {
      try {
        var l = e.onCaughtError;
        l(a.value, { componentStack: a.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
      } catch (o) {
        setTimeout(function () {
          throw o;
        });
      }
    }
    function jf(e, t, a) {
      return (
        (a = ml(a)),
        (a.tag = 3),
        (a.payload = { element: null }),
        (a.callback = function () {
          jr(e, t);
        }),
        a
      );
    }
    function jg(e) {
      return ((e = ml(e)), (e.tag = 3), e);
    }
    function Yg(e, t, a, l) {
      var o = a.type.getDerivedStateFromError;
      if (typeof o == 'function') {
        var n = l.value;
        ((e.payload = function () {
          return o(n);
        }),
          (e.callback = function () {
            Ap(t, a, l);
          }));
      }
      var u = a.stateNode;
      u !== null &&
        typeof u.componentDidCatch == 'function' &&
        (e.callback = function () {
          (Ap(t, a, l),
            typeof o != 'function' && (hl === null ? (hl = new Set([this])) : hl.add(this)));
          var r = l.stack;
          this.componentDidCatch(l.value, { componentStack: r !== null ? r : '' });
        });
    }
    function Db(e, t, a, l, o) {
      if (((a.flags |= 32768), l !== null && typeof l == 'object' && typeof l.then == 'function')) {
        if (((t = a.alternate), t !== null && dn(t, a, o, !0), (a = Nt.current), a !== null)) {
          switch (a.tag) {
            case 31:
            case 13:
              return (
                Yt === null ? Wr() : a.alternate === null && De === 0 && (De = 3),
                (a.flags &= -257),
                (a.flags |= 65536),
                (a.lanes = o),
                l === qr
                  ? (a.flags |= 16384)
                  : ((t = a.updateQueue),
                    t === null ? (a.updateQueue = new Set([l])) : t.add(l),
                    ff(e, l, o)),
                !1
              );
            case 22:
              return (
                (a.flags |= 65536),
                l === qr
                  ? (a.flags |= 16384)
                  : ((t = a.updateQueue),
                    t === null
                      ? ((t = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([l]),
                        }),
                        (a.updateQueue = t))
                      : ((a = t.retryQueue), a === null ? (t.retryQueue = new Set([l])) : a.add(l)),
                    ff(e, l, o)),
                !1
              );
          }
          throw Error(w(435, a.tag));
        }
        return (ff(e, l, o), Wr(), !1);
      }
      if (te)
        return (
          (t = Nt.current),
          t !== null
            ? ((t.flags & 65536) === 0 && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = o),
              l !== Of && ((e = Error(w(422), { cause: l })), du(Xt(e, a))))
            : (l !== Of && ((t = Error(w(423), { cause: l })), du(Xt(t, a))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (o &= -o),
              (e.lanes |= o),
              (l = Xt(l, a)),
              (o = jf(e.stateNode, l, o)),
              Qi(e, o),
              De !== 4 && (De = 2)),
          !1
        );
      var n = Error(w(520), { cause: l });
      if (((n = Xt(n, a)), ou === null ? (ou = [n]) : ou.push(n), De !== 4 && (De = 2), t === null))
        return !0;
      ((l = Xt(l, a)), (a = t));
      do {
        switch (a.tag) {
          case 3:
            return (
              (a.flags |= 65536),
              (e = o & -o),
              (a.lanes |= e),
              (e = jf(a.stateNode, l, e)),
              Qi(a, e),
              !1
            );
          case 1:
            if (
              ((t = a.type),
              (n = a.stateNode),
              (a.flags & 128) === 0 &&
                (typeof t.getDerivedStateFromError == 'function' ||
                  (n !== null &&
                    typeof n.componentDidCatch == 'function' &&
                    (hl === null || !hl.has(n)))))
            )
              return (
                (a.flags |= 65536),
                (o &= -o),
                (a.lanes |= o),
                (o = jg(o)),
                Yg(o, e, a, l),
                Qi(a, o),
                !1
              );
        }
        a = a.return;
      } while (a !== null);
      return !1;
    }
    var jc = Error(w(461)),
      He = !1;
    function Qe(e, t, a, l) {
      t.child = e === null ? rg(t, null, a, l) : Zl(t, e.child, a, l);
    }
    function Tp(e, t, a, l, o) {
      a = a.render;
      var n = t.ref;
      if ('ref' in l) {
        var u = {};
        for (var r in l) r !== 'ref' && (u[r] = l[r]);
      } else u = l;
      return (
        Kl(t),
        (l = Bc(e, t, a, u, n, o)),
        (r = Pc()),
        e !== null && !He
          ? (Nc(e, t, o), Va(e, t, o))
          : (te && r && Rc(t), (t.flags |= 1), Qe(e, t, l, o), t.child)
      );
    }
    function kp(e, t, a, l, o) {
      if (e === null) {
        var n = a.type;
        return typeof n == 'function' && !wc(n) && n.defaultProps === void 0 && a.compare === null
          ? ((t.tag = 15), (t.type = n), Kg(e, t, n, l, o))
          : ((e = yr(a.type, null, l, t, t.mode, o)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((n = e.child), !Yc(e, o))) {
        var u = n.memoizedProps;
        if (((a = a.compare), (a = a !== null ? a : fu), a(u, l) && e.ref === t.ref))
          return Va(e, t, o);
      }
      return ((t.flags |= 1), (e = Ha(n, l)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    function Kg(e, t, a, l, o) {
      if (e !== null) {
        var n = e.memoizedProps;
        if (fu(n, l) && e.ref === t.ref)
          if (((He = !1), (t.pendingProps = l = n), Yc(e, o)))
            (e.flags & 131072) !== 0 && (He = !0);
          else return ((t.lanes = e.lanes), Va(e, t, o));
      }
      return Yf(e, t, a, l, o);
    }
    function Zg(e, t, a, l) {
      var o = l.children,
        n = e !== null ? e.memoizedState : null;
      if (
        (e === null &&
          t.stateNode === null &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        l.mode === 'hidden')
      ) {
        if ((t.flags & 128) !== 0) {
          if (((n = n !== null ? n.baseLanes | a : a), e !== null)) {
            for (l = t.child = e.child, o = 0; l !== null;)
              ((o = o | l.lanes | l.childLanes), (l = l.sibling));
            l = o & ~n;
          } else ((l = 0), (t.child = null));
          return Mp(e, t, n, a, l);
        }
        if ((a & 536870912) !== 0)
          ((t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && Cr(t, n !== null ? n.cachePool : null),
            n !== null ? Lp(t, n) : Uf(),
            fg(t));
        else return ((l = t.lanes = 536870912), Mp(e, t, n !== null ? n.baseLanes | a : a, a, l));
      } else
        n !== null
          ? (Cr(t, n.cachePool), Lp(t, n), ol(t), (t.memoizedState = null))
          : (e !== null && Cr(t, null), Uf(), ol(t));
      return (Qe(e, t, o, a), t.child);
    }
    function jn(e, t) {
      return (
        (e !== null && e.tag === 22) ||
          t.stateNode !== null ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function Mp(e, t, a, l, o) {
      var n = kc();
      return (
        (n = n === null ? null : { parent: _e._currentValue, pool: n }),
        (t.memoizedState = { baseLanes: a, cachePool: n }),
        e !== null && Cr(t, null),
        Uf(),
        fg(t),
        e !== null && dn(e, t, l, !0),
        (t.childLanes = o),
        null
      );
    }
    function wr(e, t) {
      return (
        (t = Yr({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function Dp(e, t, a) {
      return (
        Zl(t, e.child, null, a),
        (e = wr(t, t.pendingProps)),
        (e.flags |= 2),
        Tt(t),
        (t.memoizedState = null),
        e
      );
    }
    function Eb(e, t, a) {
      var l = t.pendingProps,
        o = (t.flags & 128) !== 0;
      if (((t.flags &= -129), e === null)) {
        if (te) {
          if (l.mode === 'hidden') return ((e = wr(t, l)), (t.lanes = 536870912), jn(null, e));
          if (
            (qf(t),
            (e = ye)
              ? ((e = qx(e, jt)),
                (e = e !== null && e.data === '&' ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: vl !== null ? { id: pa, overflow: ha } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (a = eg(e)),
                  (a.return = t),
                  (t.child = a),
                  (Je = t),
                  (ye = null)))
              : (e = null),
            e === null)
          )
            throw yl(t);
          return ((t.lanes = 536870912), null);
        }
        return wr(t, l);
      }
      var n = e.memoizedState;
      if (n !== null) {
        var u = n.dehydrated;
        if ((qf(t), o))
          if (t.flags & 256) ((t.flags &= -257), (t = Dp(e, t, a)));
          else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
          else throw Error(w(558));
        else if ((He || dn(e, t, a, !1), (o = (a & e.childLanes) !== 0), He || o)) {
          if (((l = pe), l !== null && ((u = Rh(l, a)), u !== 0 && u !== n.retryLane)))
            throw ((n.retryLane = u), to(e, u), St(l, e, u), jc);
          (Wr(), (t = Dp(e, t, a)));
        } else
          ((e = n.treeContext),
            (ye = Kt(u.nextSibling)),
            (Je = t),
            (te = !0),
            (dl = null),
            (jt = !1),
            e !== null && ag(t, e),
            (t = wr(t, l)),
            (t.flags |= 4096));
        return t;
      }
      return (
        (e = Ha(e.child, { mode: l.mode, children: l.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function Rr(e, t) {
      var a = t.ref;
      if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof a != 'function' && typeof a != 'object') throw Error(w(284));
        (e === null || e.ref !== a) && (t.flags |= 4194816);
      }
    }
    function Yf(e, t, a, l, o) {
      return (
        Kl(t),
        (a = Bc(e, t, a, l, void 0, o)),
        (l = Pc()),
        e !== null && !He
          ? (Nc(e, t, o), Va(e, t, o))
          : (te && l && Rc(t), (t.flags |= 1), Qe(e, t, a, o), t.child)
      );
    }
    function Ep(e, t, a, l, o, n) {
      return (
        Kl(t),
        (t.updateQueue = null),
        (a = dg(t, l, a, o)),
        cg(e),
        (l = Pc()),
        e !== null && !He
          ? (Nc(e, t, n), Va(e, t, n))
          : (te && l && Rc(t), (t.flags |= 1), Qe(e, t, a, n), t.child)
      );
    }
    function Op(e, t, a, l, o) {
      if ((Kl(t), t.stateNode === null)) {
        var n = qo,
          u = a.contextType;
        (typeof u == 'object' && u !== null && (n = $e(u)),
          (n = new a(l, n)),
          (t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null),
          (n.updater = Xf),
          (t.stateNode = n),
          (n._reactInternals = t),
          (n = t.stateNode),
          (n.props = l),
          (n.state = t.memoizedState),
          (n.refs = {}),
          Dc(t),
          (u = a.contextType),
          (n.context = typeof u == 'object' && u !== null ? $e(u) : qo),
          (n.state = t.memoizedState),
          (u = a.getDerivedStateFromProps),
          typeof u == 'function' && (Ji(t, a, u, l), (n.state = t.memoizedState)),
          typeof a.getDerivedStateFromProps == 'function' ||
            typeof n.getSnapshotBeforeUpdate == 'function' ||
            (typeof n.UNSAFE_componentWillMount != 'function' &&
              typeof n.componentWillMount != 'function') ||
            ((u = n.state),
            typeof n.componentWillMount == 'function' && n.componentWillMount(),
            typeof n.UNSAFE_componentWillMount == 'function' && n.UNSAFE_componentWillMount(),
            u !== n.state && Xf.enqueueReplaceState(n, n.state, null),
            eu(t, l, n, o),
            $n(),
            (n.state = t.memoizedState)),
          typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
          (l = !0));
      } else if (e === null) {
        n = t.stateNode;
        var r = t.memoizedProps,
          s = Wl(a, r);
        n.props = s;
        var i = n.context,
          c = a.contextType;
        ((u = qo), typeof c == 'object' && c !== null && (u = $e(c)));
        var p = a.getDerivedStateFromProps;
        ((c = typeof p == 'function' || typeof n.getSnapshotBeforeUpdate == 'function'),
          (r = t.pendingProps !== r),
          c ||
            (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
              typeof n.componentWillReceiveProps != 'function') ||
            ((r || i !== u) && Rp(t, n, l, u)),
          (tl = !1));
        var m = t.memoizedState;
        ((n.state = m),
          eu(t, l, n, o),
          $n(),
          (i = t.memoizedState),
          r || m !== i || tl
            ? (typeof p == 'function' && (Ji(t, a, p, l), (i = t.memoizedState)),
              (s = tl || wp(t, a, s, l, m, i, u))
                ? (c ||
                    (typeof n.UNSAFE_componentWillMount != 'function' &&
                      typeof n.componentWillMount != 'function') ||
                    (typeof n.componentWillMount == 'function' && n.componentWillMount(),
                    typeof n.UNSAFE_componentWillMount == 'function' &&
                      n.UNSAFE_componentWillMount()),
                  typeof n.componentDidMount == 'function' && (t.flags |= 4194308))
                : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
                  (t.memoizedProps = l),
                  (t.memoizedState = i)),
              (n.props = l),
              (n.state = i),
              (n.context = u),
              (l = s))
            : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308), (l = !1)));
      } else {
        ((n = t.stateNode),
          Hf(e, t),
          (u = t.memoizedProps),
          (c = Wl(a, u)),
          (n.props = c),
          (p = t.pendingProps),
          (m = n.context),
          (i = a.contextType),
          (s = qo),
          typeof i == 'object' && i !== null && (s = $e(i)),
          (r = a.getDerivedStateFromProps),
          (i = typeof r == 'function' || typeof n.getSnapshotBeforeUpdate == 'function') ||
            (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
              typeof n.componentWillReceiveProps != 'function') ||
            ((u !== p || m !== s) && Rp(t, n, l, s)),
          (tl = !1),
          (m = t.memoizedState),
          (n.state = m),
          eu(t, l, n, o),
          $n());
        var h = t.memoizedState;
        u !== p || m !== h || tl || (e !== null && e.dependencies !== null && Ur(e.dependencies))
          ? (typeof r == 'function' && (Ji(t, a, r, l), (h = t.memoizedState)),
            (c =
              tl ||
              wp(t, a, c, l, m, h, s) ||
              (e !== null && e.dependencies !== null && Ur(e.dependencies)))
              ? (i ||
                  (typeof n.UNSAFE_componentWillUpdate != 'function' &&
                    typeof n.componentWillUpdate != 'function') ||
                  (typeof n.componentWillUpdate == 'function' && n.componentWillUpdate(l, h, s),
                  typeof n.UNSAFE_componentWillUpdate == 'function' &&
                    n.UNSAFE_componentWillUpdate(l, h, s)),
                typeof n.componentDidUpdate == 'function' && (t.flags |= 4),
                typeof n.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
              : (typeof n.componentDidUpdate != 'function' ||
                  (u === e.memoizedProps && m === e.memoizedState) ||
                  (t.flags |= 4),
                typeof n.getSnapshotBeforeUpdate != 'function' ||
                  (u === e.memoizedProps && m === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = l),
                (t.memoizedState = h)),
            (n.props = l),
            (n.state = h),
            (n.context = s),
            (l = c))
          : (typeof n.componentDidUpdate != 'function' ||
              (u === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 4),
            typeof n.getSnapshotBeforeUpdate != 'function' ||
              (u === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 1024),
            (l = !1));
      }
      return (
        (n = l),
        Rr(e, t),
        (l = (t.flags & 128) !== 0),
        n || l
          ? ((n = t.stateNode),
            (a = l && typeof a.getDerivedStateFromError != 'function' ? null : n.render()),
            (t.flags |= 1),
            e !== null && l
              ? ((t.child = Zl(t, e.child, null, o)), (t.child = Zl(t, null, a, o)))
              : Qe(e, t, a, o),
            (t.memoizedState = n.state),
            (e = t.child))
          : (e = Va(e, t, o)),
        e
      );
    }
    function Bp(e, t, a, l) {
      return (Yl(), (t.flags |= 256), Qe(e, t, a, l), t.child);
    }
    var $i = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function ef(e) {
      return { baseLanes: e, cachePool: og() };
    }
    function tf(e, t, a) {
      return ((e = e !== null ? e.childLanes & ~a : 0), t && (e |= Mt), e);
    }
    function Qg(e, t, a) {
      var l = t.pendingProps,
        o = !1,
        n = (t.flags & 128) !== 0,
        u;
      if (
        ((u = n) || (u = e !== null && e.memoizedState === null ? !1 : (Oe.current & 2) !== 0),
        u && ((o = !0), (t.flags &= -129)),
        (u = (t.flags & 32) !== 0),
        (t.flags &= -33),
        e === null)
      ) {
        if (te) {
          if (
            (o ? ll(t) : ol(t),
            (e = ye)
              ? ((e = qx(e, jt)),
                (e = e !== null && e.data !== '&' ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: vl !== null ? { id: pa, overflow: ha } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (a = eg(e)),
                  (a.return = t),
                  (t.child = a),
                  (Je = t),
                  (ye = null)))
              : (e = null),
            e === null)
          )
            throw yl(t);
          return (rc(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
        }
        var r = l.children;
        return (
          (l = l.fallback),
          o
            ? (ol(t),
              (o = t.mode),
              (r = Yr({ mode: 'hidden', children: r }, o)),
              (l = Gl(l, o, a, null)),
              (r.return = t),
              (l.return = t),
              (r.sibling = l),
              (t.child = r),
              (l = t.child),
              (l.memoizedState = ef(a)),
              (l.childLanes = tf(e, u, a)),
              (t.memoizedState = $i),
              jn(null, l))
            : (ll(t), Kf(t, r))
        );
      }
      var s = e.memoizedState;
      if (s !== null && ((r = s.dehydrated), r !== null)) {
        if (n)
          t.flags & 256
            ? (ll(t), (t.flags &= -257), (t = af(e, t, a)))
            : t.memoizedState !== null
              ? (ol(t), (t.child = e.child), (t.flags |= 128), (t = null))
              : (ol(t),
                (r = l.fallback),
                (o = t.mode),
                (l = Yr({ mode: 'visible', children: l.children }, o)),
                (r = Gl(r, o, a, null)),
                (r.flags |= 2),
                (l.return = t),
                (r.return = t),
                (l.sibling = r),
                (t.child = l),
                Zl(t, e.child, null, a),
                (l = t.child),
                (l.memoizedState = ef(a)),
                (l.childLanes = tf(e, u, a)),
                (t.memoizedState = $i),
                (t = jn(null, l)));
        else if ((ll(t), rc(r))) {
          if (((u = r.nextSibling && r.nextSibling.dataset), u)) var i = u.dgst;
          ((u = i),
            (l = Error(w(419))),
            (l.stack = ''),
            (l.digest = u),
            du({ value: l, source: null, stack: null }),
            (t = af(e, t, a)));
        } else if ((He || dn(e, t, a, !1), (u = (a & e.childLanes) !== 0), He || u)) {
          if (((u = pe), u !== null && ((l = Rh(u, a)), l !== 0 && l !== s.retryLane)))
            throw ((s.retryLane = l), to(e, l), St(u, e, l), jc);
          (uc(r) || Wr(), (t = af(e, t, a)));
        } else
          uc(r)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = s.treeContext),
              (ye = Kt(r.nextSibling)),
              (Je = t),
              (te = !0),
              (dl = null),
              (jt = !1),
              e !== null && ag(t, e),
              (t = Kf(t, l.children)),
              (t.flags |= 4096));
        return t;
      }
      return o
        ? (ol(t),
          (r = l.fallback),
          (o = t.mode),
          (s = e.child),
          (i = s.sibling),
          (l = Ha(s, { mode: 'hidden', children: l.children })),
          (l.subtreeFlags = s.subtreeFlags & 65011712),
          i !== null ? (r = Ha(i, r)) : ((r = Gl(r, o, a, null)), (r.flags |= 2)),
          (r.return = t),
          (l.return = t),
          (l.sibling = r),
          (t.child = l),
          jn(null, l),
          (l = t.child),
          (r = e.child.memoizedState),
          r === null
            ? (r = ef(a))
            : ((o = r.cachePool),
              o !== null
                ? ((s = _e._currentValue), (o = o.parent !== s ? { parent: s, pool: s } : o))
                : (o = og()),
              (r = { baseLanes: r.baseLanes | a, cachePool: o })),
          (l.memoizedState = r),
          (l.childLanes = tf(e, u, a)),
          (t.memoizedState = $i),
          jn(e.child, l))
        : (ll(t),
          (a = e.child),
          (e = a.sibling),
          (a = Ha(a, { mode: 'visible', children: l.children })),
          (a.return = t),
          (a.sibling = null),
          e !== null &&
            ((u = t.deletions), u === null ? ((t.deletions = [e]), (t.flags |= 16)) : u.push(e)),
          (t.child = a),
          (t.memoizedState = null),
          a);
    }
    function Kf(e, t) {
      return ((t = Yr({ mode: 'visible', children: t }, e.mode)), (t.return = e), (e.child = t));
    }
    function Yr(e, t) {
      return ((e = kt(22, e, null, t)), (e.lanes = 0), e);
    }
    function af(e, t, a) {
      return (
        Zl(t, e.child, null, a),
        (e = Kf(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function Pp(e, t, a) {
      e.lanes |= t;
      var l = e.alternate;
      (l !== null && (l.lanes |= t), Pf(e.return, t, a));
    }
    function lf(e, t, a, l, o, n) {
      var u = e.memoizedState;
      u === null
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: l,
            tail: a,
            tailMode: o,
            treeForkCount: n,
          })
        : ((u.isBackwards = t),
          (u.rendering = null),
          (u.renderingStartTime = 0),
          (u.last = l),
          (u.tail = a),
          (u.tailMode = o),
          (u.treeForkCount = n));
    }
    function Wg(e, t, a) {
      var l = t.pendingProps,
        o = l.revealOrder,
        n = l.tail;
      l = l.children;
      var u = Oe.current,
        r = (u & 2) !== 0;
      if (
        (r ? ((u = (u & 1) | 2), (t.flags |= 128)) : (u &= 1),
        xe(Oe, u),
        Qe(e, t, l, a),
        (l = te ? cu : 0),
        !r && e !== null && (e.flags & 128) !== 0)
      )
        e: for (e = t.child; e !== null;) {
          if (e.tag === 13) e.memoizedState !== null && Pp(e, a, t);
          else if (e.tag === 19) Pp(e, a, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null;) {
            if (e.return === null || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      switch (o) {
        case 'forwards':
          for (a = t.child, o = null; a !== null;)
            ((e = a.alternate), e !== null && Gr(e) === null && (o = a), (a = a.sibling));
          ((a = o),
            a === null ? ((o = t.child), (t.child = null)) : ((o = a.sibling), (a.sibling = null)),
            lf(t, !1, o, a, n, l));
          break;
        case 'backwards':
        case 'unstable_legacy-backwards':
          for (a = null, o = t.child, t.child = null; o !== null;) {
            if (((e = o.alternate), e !== null && Gr(e) === null)) {
              t.child = o;
              break;
            }
            ((e = o.sibling), (o.sibling = a), (a = o), (o = e));
          }
          lf(t, !0, a, null, n, l);
          break;
        case 'together':
          lf(t, !1, null, null, void 0, l);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function Va(e, t, a) {
      if (
        (e !== null && (t.dependencies = e.dependencies), (bl |= t.lanes), (a & t.childLanes) === 0)
      )
        if (e !== null) {
          if ((dn(e, t, a, !1), (a & t.childLanes) === 0)) return null;
        } else return null;
      if (e !== null && t.child !== e.child) throw Error(w(153));
      if (t.child !== null) {
        for (e = t.child, a = Ha(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null;)
          ((e = e.sibling), (a = a.sibling = Ha(e, e.pendingProps)), (a.return = t));
        a.sibling = null;
      }
      return t.child;
    }
    function Yc(e, t) {
      return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Ur(e)));
    }
    function Ob(e, t, a) {
      switch (t.tag) {
        case 3:
          (Or(t, t.stateNode.containerInfo), al(t, _e, e.memoizedState.cache), Yl());
          break;
        case 27:
        case 5:
          Cf(t);
          break;
        case 4:
          Or(t, t.stateNode.containerInfo);
          break;
        case 10:
          al(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return ((t.flags |= 128), qf(t), null);
          break;
        case 13:
          var l = t.memoizedState;
          if (l !== null)
            return l.dehydrated !== null
              ? (ll(t), (t.flags |= 128), null)
              : (a & t.child.childLanes) !== 0
                ? Qg(e, t, a)
                : (ll(t), (e = Va(e, t, a)), e !== null ? e.sibling : null);
          ll(t);
          break;
        case 19:
          var o = (e.flags & 128) !== 0;
          if (
            ((l = (a & t.childLanes) !== 0),
            l || (dn(e, t, a, !1), (l = (a & t.childLanes) !== 0)),
            o)
          ) {
            if (l) return Wg(e, t, a);
            t.flags |= 128;
          }
          if (
            ((o = t.memoizedState),
            o !== null && ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
            xe(Oe, Oe.current),
            l)
          )
            break;
          return null;
        case 22:
          return ((t.lanes = 0), Zg(e, t, a, t.pendingProps));
        case 24:
          al(t, _e, e.memoizedState.cache);
      }
      return Va(e, t, a);
    }
    function Jg(e, t, a) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps) He = !0;
        else {
          if (!Yc(e, a) && (t.flags & 128) === 0) return ((He = !1), Ob(e, t, a));
          He = (e.flags & 131072) !== 0;
        }
      else ((He = !1), te && (t.flags & 1048576) !== 0 && tg(t, cu, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          e: {
            var l = t.pendingProps;
            if (((e = Ul(t.elementType)), (t.type = e), typeof e == 'function'))
              wc(e)
                ? ((l = Wl(e, l)), (t.tag = 1), (t = Op(null, t, e, l, a)))
                : ((t.tag = 0), (t = Yf(null, t, e, l, a)));
            else {
              if (e != null) {
                var o = e.$$typeof;
                if (o === cc) {
                  ((t.tag = 11), (t = Tp(null, t, e, l, a)));
                  break e;
                } else if (o === dc) {
                  ((t.tag = 14), (t = kp(null, t, e, l, a)));
                  break e;
                }
              }
              throw ((t = vf(e) || e), Error(w(306, t, '')));
            }
          }
          return t;
        case 0:
          return Yf(e, t, t.type, t.pendingProps, a);
        case 1:
          return ((l = t.type), (o = Wl(l, t.pendingProps)), Op(e, t, l, o, a));
        case 3:
          e: {
            if ((Or(t, t.stateNode.containerInfo), e === null)) throw Error(w(387));
            l = t.pendingProps;
            var n = t.memoizedState;
            ((o = n.element), Hf(e, t), eu(t, l, null, a));
            var u = t.memoizedState;
            if (
              ((l = u.cache),
              al(t, _e, l),
              l !== n.cache && Nf(t, [_e], a, !0),
              $n(),
              (l = u.element),
              n.isDehydrated)
            )
              if (
                ((n = { element: l, isDehydrated: !1, cache: u.cache }),
                (t.updateQueue.baseState = n),
                (t.memoizedState = n),
                t.flags & 256)
              ) {
                t = Bp(e, t, l, a);
                break e;
              } else if (l !== o) {
                ((o = Xt(Error(w(424)), t)), du(o), (t = Bp(e, t, l, a)));
                break e;
              } else
                for (
                  e = t.stateNode.containerInfo,
                    e.nodeType === 9
                      ? (e = e.body)
                      : (e = e.nodeName === 'HTML' ? e.ownerDocument.body : e),
                    ye = Kt(e.firstChild),
                    Je = t,
                    te = !0,
                    dl = null,
                    jt = !0,
                    a = rg(t, null, l, a),
                    t.child = a;
                  a;
                )
                  ((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
            else {
              if ((Yl(), l === o)) {
                t = Va(e, t, a);
                break e;
              }
              Qe(e, t, l, a);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            Rr(e, t),
            e === null
              ? (a = lh(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = a)
                : te ||
                  ((a = t.type),
                  (e = t.pendingProps),
                  (l = ts(cl.current).createElement(a)),
                  (l[We] = t),
                  (l[vt] = e),
                  et(l, a, e),
                  Ye(l),
                  (t.stateNode = l))
              : (t.memoizedState = lh(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
            null
          );
        case 27:
          return (
            Cf(t),
            e === null &&
              te &&
              ((l = t.stateNode = Fx(t.type, t.pendingProps, cl.current)),
              (Je = t),
              (jt = !0),
              (o = ye),
              wl(t.type) ? ((sc = o), (ye = Kt(l.firstChild))) : (ye = o)),
            Qe(e, t, t.pendingProps.children, a),
            Rr(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              te &&
              ((o = l = ye) &&
                ((l = rI(l, t.type, t.pendingProps, jt)),
                l !== null
                  ? ((t.stateNode = l), (Je = t), (ye = Kt(l.firstChild)), (jt = !1), (o = !0))
                  : (o = !1)),
              o || yl(t)),
            Cf(t),
            (o = t.type),
            (n = t.pendingProps),
            (u = e !== null ? e.memoizedProps : null),
            (l = n.children),
            oc(o, n) ? (l = null) : u !== null && oc(o, u) && (t.flags |= 32),
            t.memoizedState !== null && ((o = Bc(e, t, Ib, null, null, a)), (Lu._currentValue = o)),
            Rr(e, t),
            Qe(e, t, l, a),
            t.child
          );
        case 6:
          return (
            e === null &&
              te &&
              ((e = a = ye) &&
                ((a = sI(a, t.pendingProps, jt)),
                a !== null ? ((t.stateNode = a), (Je = t), (ye = null), (e = !0)) : (e = !1)),
              e || yl(t)),
            null
          );
        case 13:
          return Qg(e, t, a);
        case 4:
          return (
            Or(t, t.stateNode.containerInfo),
            (l = t.pendingProps),
            e === null ? (t.child = Zl(t, null, l, a)) : Qe(e, t, l, a),
            t.child
          );
        case 11:
          return Tp(e, t, t.type, t.pendingProps, a);
        case 7:
          return (Qe(e, t, t.pendingProps, a), t.child);
        case 8:
          return (Qe(e, t, t.pendingProps.children, a), t.child);
        case 12:
          return (Qe(e, t, t.pendingProps.children, a), t.child);
        case 10:
          return ((l = t.pendingProps), al(t, t.type, l.value), Qe(e, t, l.children, a), t.child);
        case 9:
          return (
            (o = t.type._context),
            (l = t.pendingProps.children),
            Kl(t),
            (o = $e(o)),
            (l = l(o)),
            (t.flags |= 1),
            Qe(e, t, l, a),
            t.child
          );
        case 14:
          return kp(e, t, t.type, t.pendingProps, a);
        case 15:
          return Kg(e, t, t.type, t.pendingProps, a);
        case 19:
          return Wg(e, t, a);
        case 31:
          return Eb(e, t, a);
        case 22:
          return Zg(e, t, a, t.pendingProps);
        case 24:
          return (
            Kl(t),
            (l = $e(_e)),
            e === null
              ? ((o = kc()),
                o === null &&
                  ((o = pe),
                  (n = Tc()),
                  (o.pooledCache = n),
                  n.refCount++,
                  n !== null && (o.pooledCacheLanes |= a),
                  (o = n)),
                (t.memoizedState = { parent: l, cache: o }),
                Dc(t),
                al(t, _e, o))
              : ((e.lanes & a) !== 0 && (Hf(e, t), eu(t, null, null, a), $n()),
                (o = e.memoizedState),
                (n = t.memoizedState),
                o.parent !== l
                  ? ((o = { parent: l, cache: l }),
                    (t.memoizedState = o),
                    t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = o),
                    al(t, _e, l))
                  : ((l = n.cache), al(t, _e, l), l !== o.cache && Nf(t, [_e], a, !0))),
            Qe(e, t, t.pendingProps.children, a),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(w(156, t.tag));
    }
    function ka(e) {
      e.flags |= 4;
    }
    function of(e, t, a, l, o) {
      if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
        if (((e.flags |= 16777216), (o & 335544128) === o))
          if (e.stateNode.complete) e.flags |= 8192;
          else if (Cx()) e.flags |= 8192;
          else throw ((Xl = qr), Mc);
      } else e.flags &= -16777217;
    }
    function Np(e, t) {
      if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !Xx(t)))
        if (Cx()) e.flags |= 8192;
        else throw ((Xl = qr), Mc);
    }
    function fr(e, t) {
      (t !== null && (e.flags |= 4),
        e.flags & 16384 && ((t = e.tag !== 22 ? bh() : 536870912), (e.lanes |= t), (on |= t)));
    }
    function zn(e, t) {
      if (!te)
        switch (e.tailMode) {
          case 'hidden':
            t = e.tail;
            for (var a = null; t !== null;) (t.alternate !== null && (a = t), (t = t.sibling));
            a === null ? (e.tail = null) : (a.sibling = null);
            break;
          case 'collapsed':
            a = e.tail;
            for (var l = null; a !== null;) (a.alternate !== null && (l = a), (a = a.sibling));
            l === null
              ? t || e.tail === null
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (l.sibling = null);
        }
    }
    function ve(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        a = 0,
        l = 0;
      if (t)
        for (var o = e.child; o !== null;)
          ((a |= o.lanes | o.childLanes),
            (l |= o.subtreeFlags & 65011712),
            (l |= o.flags & 65011712),
            (o.return = e),
            (o = o.sibling));
      else
        for (o = e.child; o !== null;)
          ((a |= o.lanes | o.childLanes),
            (l |= o.subtreeFlags),
            (l |= o.flags),
            (o.return = e),
            (o = o.sibling));
      return ((e.subtreeFlags |= l), (e.childLanes = a), t);
    }
    function Bb(e, t, a) {
      var l = t.pendingProps;
      switch ((Ac(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (ve(t), null);
        case 1:
          return (ve(t), null);
        case 3:
          return (
            (a = t.stateNode),
            (l = null),
            e !== null && (l = e.memoizedState.cache),
            t.memoizedState.cache !== l && (t.flags |= 2048),
            za(_e),
            Jo(),
            a.pendingContext && ((a.context = a.pendingContext), (a.pendingContext = null)),
            (e === null || e.child === null) &&
              (ko(t)
                ? ka(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                  ((t.flags |= 1024), Zi())),
            ve(t),
            null
          );
        case 26:
          var o = t.type,
            n = t.memoizedState;
          return (
            e === null
              ? (ka(t), n !== null ? (ve(t), Np(t, n)) : (ve(t), of(t, o, null, l, a)))
              : n
                ? n !== e.memoizedState
                  ? (ka(t), ve(t), Np(t, n))
                  : (ve(t), (t.flags &= -16777217))
                : ((e = e.memoizedProps), e !== l && ka(t), ve(t), of(t, o, e, l, a)),
            null
          );
        case 27:
          if ((Br(t), (a = cl.current), (o = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== l && ka(t);
          else {
            if (!l) {
              if (t.stateNode === null) throw Error(w(166));
              return (ve(t), null);
            }
            ((e = xa.current), ko(t) ? cp(t, e) : ((e = Fx(o, l, a)), (t.stateNode = e), ka(t)));
          }
          return (ve(t), null);
        case 5:
          if ((Br(t), (o = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== l && ka(t);
          else {
            if (!l) {
              if (t.stateNode === null) throw Error(w(166));
              return (ve(t), null);
            }
            if (((n = xa.current), ko(t))) cp(t, n);
            else {
              var u = ts(cl.current);
              switch (n) {
                case 1:
                  n = u.createElementNS('http://www.w3.org/2000/svg', o);
                  break;
                case 2:
                  n = u.createElementNS('http://www.w3.org/1998/Math/MathML', o);
                  break;
                default:
                  switch (o) {
                    case 'svg':
                      n = u.createElementNS('http://www.w3.org/2000/svg', o);
                      break;
                    case 'math':
                      n = u.createElementNS('http://www.w3.org/1998/Math/MathML', o);
                      break;
                    case 'script':
                      ((n = u.createElement('div')),
                        (n.innerHTML = '<script><\/script>'),
                        (n = n.removeChild(n.firstChild)));
                      break;
                    case 'select':
                      ((n =
                        typeof l.is == 'string'
                          ? u.createElement('select', { is: l.is })
                          : u.createElement('select')),
                        l.multiple ? (n.multiple = !0) : l.size && (n.size = l.size));
                      break;
                    default:
                      n =
                        typeof l.is == 'string'
                          ? u.createElement(o, { is: l.is })
                          : u.createElement(o);
                  }
              }
              ((n[We] = t), (n[vt] = l));
              e: for (u = t.child; u !== null;) {
                if (u.tag === 5 || u.tag === 6) n.appendChild(u.stateNode);
                else if (u.tag !== 4 && u.tag !== 27 && u.child !== null) {
                  ((u.child.return = u), (u = u.child));
                  continue;
                }
                if (u === t) break e;
                for (; u.sibling === null;) {
                  if (u.return === null || u.return === t) break e;
                  u = u.return;
                }
                ((u.sibling.return = u.return), (u = u.sibling));
              }
              t.stateNode = n;
              e: switch ((et(n, o, l), o)) {
                case 'button':
                case 'input':
                case 'select':
                case 'textarea':
                  l = !!l.autoFocus;
                  break e;
                case 'img':
                  l = !0;
                  break e;
                default:
                  l = !1;
              }
              l && ka(t);
            }
          }
          return (
            ve(t),
            of(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a),
            null
          );
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== l && ka(t);
          else {
            if (typeof l != 'string' && t.stateNode === null) throw Error(w(166));
            if (((e = cl.current), ko(t))) {
              if (((e = t.stateNode), (a = t.memoizedProps), (l = null), (o = Je), o !== null))
                switch (o.tag) {
                  case 27:
                  case 5:
                    l = o.memoizedProps;
                }
              ((e[We] = t),
                (e = !!(
                  e.nodeValue === a ||
                  (l !== null && l.suppressHydrationWarning === !0) ||
                  Hx(e.nodeValue, a)
                )),
                e || yl(t, !0));
            } else ((e = ts(e).createTextNode(l)), (e[We] = t), (t.stateNode = e));
          }
          return (ve(t), null);
        case 31:
          if (((a = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((l = ko(t)), a !== null)) {
              if (e === null) {
                if (!l) throw Error(w(318));
                if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                  throw Error(w(557));
                e[We] = t;
              } else (Yl(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
              (ve(t), (e = !1));
            } else
              ((a = Zi()),
                e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a),
                (e = !0));
            if (!e) return t.flags & 256 ? (Tt(t), t) : (Tt(t), null);
            if ((t.flags & 128) !== 0) throw Error(w(558));
          }
          return (ve(t), null);
        case 13:
          if (
            ((l = t.memoizedState),
            e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((o = ko(t)), l !== null && l.dehydrated !== null)) {
              if (e === null) {
                if (!o) throw Error(w(318));
                if (((o = t.memoizedState), (o = o !== null ? o.dehydrated : null), !o))
                  throw Error(w(317));
                o[We] = t;
              } else (Yl(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
              (ve(t), (o = !1));
            } else
              ((o = Zi()),
                e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = o),
                (o = !0));
            if (!o) return t.flags & 256 ? (Tt(t), t) : (Tt(t), null);
          }
          return (
            Tt(t),
            (t.flags & 128) !== 0
              ? ((t.lanes = a), t)
              : ((a = l !== null),
                (e = e !== null && e.memoizedState !== null),
                a &&
                  ((l = t.child),
                  (o = null),
                  l.alternate !== null &&
                    l.alternate.memoizedState !== null &&
                    l.alternate.memoizedState.cachePool !== null &&
                    (o = l.alternate.memoizedState.cachePool.pool),
                  (n = null),
                  l.memoizedState !== null &&
                    l.memoizedState.cachePool !== null &&
                    (n = l.memoizedState.cachePool.pool),
                  n !== o && (l.flags |= 2048)),
                a !== e && a && (t.child.flags |= 8192),
                fr(t, t.updateQueue),
                ve(t),
                null)
          );
        case 4:
          return (Jo(), e === null && ed(t.stateNode.containerInfo), ve(t), null);
        case 10:
          return (za(t.type), ve(t), null);
        case 19:
          if ((Ke(Oe), (l = t.memoizedState), l === null)) return (ve(t), null);
          if (((o = (t.flags & 128) !== 0), (n = l.rendering), n === null))
            if (o) zn(l, !1);
            else {
              if (De !== 0 || (e !== null && (e.flags & 128) !== 0))
                for (e = t.child; e !== null;) {
                  if (((n = Gr(e)), n !== null)) {
                    for (
                      t.flags |= 128,
                        zn(l, !1),
                        e = n.updateQueue,
                        t.updateQueue = e,
                        fr(t, e),
                        t.subtreeFlags = 0,
                        e = a,
                        a = t.child;
                      a !== null;
                    )
                      ($h(a, e), (a = a.sibling));
                    return (xe(Oe, (Oe.current & 1) | 2), te && Oa(t, l.treeForkCount), t.child);
                  }
                  e = e.sibling;
                }
              l.tail !== null &&
                Dt() > Zr &&
                ((t.flags |= 128), (o = !0), zn(l, !1), (t.lanes = 4194304));
            }
          else {
            if (!o)
              if (((e = Gr(n)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (o = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  fr(t, e),
                  zn(l, !0),
                  l.tail === null && l.tailMode === 'hidden' && !n.alternate && !te)
                )
                  return (ve(t), null);
              } else
                2 * Dt() - l.renderingStartTime > Zr &&
                  a !== 536870912 &&
                  ((t.flags |= 128), (o = !0), zn(l, !1), (t.lanes = 4194304));
            l.isBackwards
              ? ((n.sibling = t.child), (t.child = n))
              : ((e = l.last), e !== null ? (e.sibling = n) : (t.child = n), (l.last = n));
          }
          return l.tail !== null
            ? ((e = l.tail),
              (l.rendering = e),
              (l.tail = e.sibling),
              (l.renderingStartTime = Dt()),
              (e.sibling = null),
              (a = Oe.current),
              xe(Oe, o ? (a & 1) | 2 : a & 1),
              te && Oa(t, l.treeForkCount),
              e)
            : (ve(t), null);
        case 22:
        case 23:
          return (
            Tt(t),
            Ec(),
            (l = t.memoizedState !== null),
            e !== null
              ? (e.memoizedState !== null) !== l && (t.flags |= 8192)
              : l && (t.flags |= 8192),
            l
              ? (a & 536870912) !== 0 &&
                (t.flags & 128) === 0 &&
                (ve(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : ve(t),
            (a = t.updateQueue),
            a !== null && fr(t, a.retryQueue),
            (a = null),
            e !== null &&
              e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (a = e.memoizedState.cachePool.pool),
            (l = null),
            t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (l = t.memoizedState.cachePool.pool),
            l !== a && (t.flags |= 2048),
            e !== null && Ke(Vl),
            null
          );
        case 24:
          return (
            (a = null),
            e !== null && (a = e.memoizedState.cache),
            t.memoizedState.cache !== a && (t.flags |= 2048),
            za(_e),
            ve(t),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(w(156, t.tag));
    }
    function Pb(e, t) {
      switch ((Ac(t), t.tag)) {
        case 1:
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 3:
          return (
            za(_e),
            Jo(),
            (e = t.flags),
            (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (Br(t), null);
        case 31:
          if (t.memoizedState !== null) {
            if ((Tt(t), t.alternate === null)) throw Error(w(340));
            Yl();
          }
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 13:
          if ((Tt(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
            if (t.alternate === null) throw Error(w(340));
            Yl();
          }
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 19:
          return (Ke(Oe), null);
        case 4:
          return (Jo(), null);
        case 10:
          return (za(t.type), null);
        case 22:
        case 23:
          return (
            Tt(t),
            Ec(),
            e !== null && Ke(Vl),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return (za(_e), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function $g(e, t) {
      switch ((Ac(t), t.tag)) {
        case 3:
          (za(_e), Jo());
          break;
        case 26:
        case 27:
        case 5:
          Br(t);
          break;
        case 4:
          Jo();
          break;
        case 31:
          t.memoizedState !== null && Tt(t);
          break;
        case 13:
          Tt(t);
          break;
        case 19:
          Ke(Oe);
          break;
        case 10:
          za(t.type);
          break;
        case 22:
        case 23:
          (Tt(t), Ec(), e !== null && Ke(Vl));
          break;
        case 24:
          za(_e);
      }
    }
    function ku(e, t) {
      try {
        var a = t.updateQueue,
          l = a !== null ? a.lastEffect : null;
        if (l !== null) {
          var o = l.next;
          a = o;
          do {
            if ((a.tag & e) === e) {
              l = void 0;
              var n = a.create,
                u = a.inst;
              ((l = n()), (u.destroy = l));
            }
            a = a.next;
          } while (a !== o);
        }
      } catch (r) {
        se(t, t.return, r);
      }
    }
    function Cl(e, t, a) {
      try {
        var l = t.updateQueue,
          o = l !== null ? l.lastEffect : null;
        if (o !== null) {
          var n = o.next;
          l = n;
          do {
            if ((l.tag & e) === e) {
              var u = l.inst,
                r = u.destroy;
              if (r !== void 0) {
                ((u.destroy = void 0), (o = t));
                var s = a,
                  i = r;
                try {
                  i();
                } catch (c) {
                  se(o, s, c);
                }
              }
            }
            l = l.next;
          } while (l !== n);
        }
      } catch (c) {
        se(t, t.return, c);
      }
    }
    function ex(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        try {
          ig(t, a);
        } catch (l) {
          se(e, e.return, l);
        }
      }
    }
    function tx(e, t, a) {
      ((a.props = Wl(e.type, e.memoizedProps)), (a.state = e.memoizedState));
      try {
        a.componentWillUnmount();
      } catch (l) {
        se(e, t, l);
      }
    }
    function au(e, t) {
      try {
        var a = e.ref;
        if (a !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var l = e.stateNode;
              break;
            case 30:
              l = e.stateNode;
              break;
            default:
              l = e.stateNode;
          }
          typeof a == 'function' ? (e.refCleanup = a(l)) : (a.current = l);
        }
      } catch (o) {
        se(e, t, o);
      }
    }
    function ga(e, t) {
      var a = e.ref,
        l = e.refCleanup;
      if (a !== null)
        if (typeof l == 'function')
          try {
            l();
          } catch (o) {
            se(e, t, o);
          } finally {
            ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
          }
        else if (typeof a == 'function')
          try {
            a(null);
          } catch (o) {
            se(e, t, o);
          }
        else a.current = null;
    }
    function ax(e) {
      var t = e.type,
        a = e.memoizedProps,
        l = e.stateNode;
      try {
        e: switch (t) {
          case 'button':
          case 'input':
          case 'select':
          case 'textarea':
            a.autoFocus && l.focus();
            break e;
          case 'img':
            a.src ? (l.src = a.src) : a.srcSet && (l.srcset = a.srcSet);
        }
      } catch (o) {
        se(e, e.return, o);
      }
    }
    function nf(e, t, a) {
      try {
        var l = e.stateNode;
        (tI(l, e.type, a, t), (l[vt] = t));
      } catch (o) {
        se(e, e.return, o);
      }
    }
    function lx(e) {
      return (
        e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && wl(e.type)) || e.tag === 4
      );
    }
    function uf(e) {
      e: for (;;) {
        for (; e.sibling === null;) {
          if (e.return === null || lx(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
        ) {
          if ((e.tag === 27 && wl(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
            continue e;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Zf(e, t, a) {
      var l = e.tag;
      if (l === 5 || l === 6)
        ((e = e.stateNode),
          t
            ? (a.nodeType === 9
                ? a.body
                : a.nodeName === 'HTML'
                  ? a.ownerDocument.body
                  : a
              ).insertBefore(e, t)
            : ((t = a.nodeType === 9 ? a.body : a.nodeName === 'HTML' ? a.ownerDocument.body : a),
              t.appendChild(e),
              (a = a._reactRootContainer),
              a != null || t.onclick !== null || (t.onclick = Na)));
      else if (
        l !== 4 &&
        (l === 27 && wl(e.type) && ((a = e.stateNode), (t = null)), (e = e.child), e !== null)
      )
        for (Zf(e, t, a), e = e.sibling; e !== null;) (Zf(e, t, a), (e = e.sibling));
    }
    function Kr(e, t, a) {
      var l = e.tag;
      if (l === 5 || l === 6) ((e = e.stateNode), t ? a.insertBefore(e, t) : a.appendChild(e));
      else if (l !== 4 && (l === 27 && wl(e.type) && (a = e.stateNode), (e = e.child), e !== null))
        for (Kr(e, t, a), e = e.sibling; e !== null;) (Kr(e, t, a), (e = e.sibling));
    }
    function ox(e) {
      var t = e.stateNode,
        a = e.memoizedProps;
      try {
        for (var l = e.type, o = t.attributes; o.length;) t.removeAttributeNode(o[0]);
        (et(t, l, a), (t[We] = e), (t[vt] = a));
      } catch (n) {
        se(e, e.return, n);
      }
    }
    var Ba = !1,
      Ne = !1,
      rf = !1,
      _p = typeof WeakSet == 'function' ? WeakSet : Set,
      je = null;
    function Nb(e, t) {
      if (((e = e.containerInfo), (ac = ns), (e = Xh(e)), Cc(e))) {
        if ('selectionStart' in e) var a = { start: e.selectionStart, end: e.selectionEnd };
        else
          e: {
            a = ((a = e.ownerDocument) && a.defaultView) || window;
            var l = a.getSelection && a.getSelection();
            if (l && l.rangeCount !== 0) {
              a = l.anchorNode;
              var o = l.anchorOffset,
                n = l.focusNode;
              l = l.focusOffset;
              try {
                (a.nodeType, n.nodeType);
              } catch {
                a = null;
                break e;
              }
              var u = 0,
                r = -1,
                s = -1,
                i = 0,
                c = 0,
                p = e,
                m = null;
              t: for (;;) {
                for (
                  var h;
                  p !== a || (o !== 0 && p.nodeType !== 3) || (r = u + o),
                    p !== n || (l !== 0 && p.nodeType !== 3) || (s = u + l),
                    p.nodeType === 3 && (u += p.nodeValue.length),
                    (h = p.firstChild) !== null;
                )
                  ((m = p), (p = h));
                for (;;) {
                  if (p === e) break t;
                  if (
                    (m === a && ++i === o && (r = u),
                    m === n && ++c === l && (s = u),
                    (h = p.nextSibling) !== null)
                  )
                    break;
                  ((p = m), (m = p.parentNode));
                }
                p = h;
              }
              a = r === -1 || s === -1 ? null : { start: r, end: s };
            } else a = null;
          }
        a = a || { start: 0, end: 0 };
      } else a = null;
      for (lc = { focusedElem: e, selectionRange: a }, ns = !1, je = t; je !== null;)
        if (((t = je), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
          ((e.return = t), (je = e));
        else
          for (; je !== null;) {
            switch (((t = je), (n = t.alternate), (e = t.flags), t.tag)) {
              case 0:
                if (
                  (e & 4) !== 0 &&
                  ((e = t.updateQueue), (e = e !== null ? e.events : null), e !== null)
                )
                  for (a = 0; a < e.length; a++) ((o = e[a]), (o.ref.impl = o.nextImpl));
                break;
              case 11:
              case 15:
                break;
              case 1:
                if ((e & 1024) !== 0 && n !== null) {
                  ((e = void 0),
                    (a = t),
                    (o = n.memoizedProps),
                    (n = n.memoizedState),
                    (l = a.stateNode));
                  try {
                    var S = Wl(a.type, o);
                    ((e = l.getSnapshotBeforeUpdate(S, n)),
                      (l.__reactInternalSnapshotBeforeUpdate = e));
                  } catch (x) {
                    se(a, a.return, x);
                  }
                }
                break;
              case 3:
                if ((e & 1024) !== 0) {
                  if (((e = t.stateNode.containerInfo), (a = e.nodeType), a === 9)) nc(e);
                  else if (a === 1)
                    switch (e.nodeName) {
                      case 'HEAD':
                      case 'HTML':
                      case 'BODY':
                        nc(e);
                        break;
                      default:
                        e.textContent = '';
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if ((e & 1024) !== 0) throw Error(w(163));
            }
            if (((e = t.sibling), e !== null)) {
              ((e.return = t.return), (je = e));
              break;
            }
            je = t.return;
          }
    }
    function nx(e, t, a) {
      var l = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          (Da(e, a), l & 4 && ku(5, a));
          break;
        case 1:
          if ((Da(e, a), l & 4))
            if (((e = a.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (u) {
                se(a, a.return, u);
              }
            else {
              var o = Wl(a.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(o, t, e.__reactInternalSnapshotBeforeUpdate);
              } catch (u) {
                se(a, a.return, u);
              }
            }
          (l & 64 && ex(a), l & 512 && au(a, a.return));
          break;
        case 3:
          if ((Da(e, a), l & 64 && ((e = a.updateQueue), e !== null))) {
            if (((t = null), a.child !== null))
              switch (a.child.tag) {
                case 27:
                case 5:
                  t = a.child.stateNode;
                  break;
                case 1:
                  t = a.child.stateNode;
              }
            try {
              ig(e, t);
            } catch (u) {
              se(a, a.return, u);
            }
          }
          break;
        case 27:
          t === null && l & 4 && ox(a);
        case 26:
        case 5:
          (Da(e, a), t === null && l & 4 && ax(a), l & 512 && au(a, a.return));
          break;
        case 12:
          Da(e, a);
          break;
        case 31:
          (Da(e, a), l & 4 && sx(e, a));
          break;
        case 13:
          (Da(e, a),
            l & 4 && ix(e, a),
            l & 64 &&
              ((e = a.memoizedState),
              e !== null &&
                ((e = e.dehydrated), e !== null && ((a = Xb.bind(null, a)), iI(e, a)))));
          break;
        case 22:
          if (((l = a.memoizedState !== null || Ba), !l)) {
            ((t = (t !== null && t.memoizedState !== null) || Ne), (o = Ba));
            var n = Ne;
            ((Ba = l),
              (Ne = t) && !n ? Ea(e, a, (a.subtreeFlags & 8772) !== 0) : Da(e, a),
              (Ba = o),
              (Ne = n));
          }
          break;
        case 30:
          break;
        default:
          Da(e, a);
      }
    }
    function ux(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), ux(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && gc(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var we = null,
      xt = !1;
    function Ma(e, t, a) {
      for (a = a.child; a !== null;) (rx(e, t, a), (a = a.sibling));
    }
    function rx(e, t, a) {
      if (Et && typeof Et.onCommitFiberUnmount == 'function')
        try {
          Et.onCommitFiberUnmount(Cu, a);
        } catch {}
      switch (a.tag) {
        case 26:
          (Ne || ga(a, t),
            Ma(e, t, a),
            a.memoizedState
              ? a.memoizedState.count--
              : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a)));
          break;
        case 27:
          Ne || ga(a, t);
          var l = we,
            o = xt;
          (wl(a.type) && ((we = a.stateNode), (xt = !1)),
            Ma(e, t, a),
            uu(a.stateNode),
            (we = l),
            (xt = o));
          break;
        case 5:
          Ne || ga(a, t);
        case 6:
          if (((l = we), (o = xt), (we = null), Ma(e, t, a), (we = l), (xt = o), we !== null))
            if (xt)
              try {
                (we.nodeType === 9
                  ? we.body
                  : we.nodeName === 'HTML'
                    ? we.ownerDocument.body
                    : we
                ).removeChild(a.stateNode);
              } catch (n) {
                se(a, t, n);
              }
            else
              try {
                we.removeChild(a.stateNode);
              } catch (n) {
                se(a, t, n);
              }
          break;
        case 18:
          we !== null &&
            (xt
              ? ((e = we),
                Jp(
                  e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e,
                  a.stateNode,
                ),
                sn(e))
              : Jp(we, a.stateNode));
          break;
        case 4:
          ((l = we),
            (o = xt),
            (we = a.stateNode.containerInfo),
            (xt = !0),
            Ma(e, t, a),
            (we = l),
            (xt = o));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (Cl(2, a, t), Ne || Cl(4, a, t), Ma(e, t, a));
          break;
        case 1:
          (Ne ||
            (ga(a, t),
            (l = a.stateNode),
            typeof l.componentWillUnmount == 'function' && tx(a, t, l)),
            Ma(e, t, a));
          break;
        case 21:
          Ma(e, t, a);
          break;
        case 22:
          ((Ne = (l = Ne) || a.memoizedState !== null), Ma(e, t, a), (Ne = l));
          break;
        default:
          Ma(e, t, a);
      }
    }
    function sx(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          sn(e);
        } catch (a) {
          se(t, t.return, a);
        }
      }
    }
    function ix(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          sn(e);
        } catch (a) {
          se(t, t.return, a);
        }
    }
    function _b(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return (t === null && (t = e.stateNode = new _p()), t);
        case 22:
          return (
            (e = e.stateNode),
            (t = e._retryCache),
            t === null && (t = e._retryCache = new _p()),
            t
          );
        default:
          throw Error(w(435, e.tag));
      }
    }
    function cr(e, t) {
      var a = _b(e);
      t.forEach(function (l) {
        if (!a.has(l)) {
          a.add(l);
          var o = jb.bind(null, e, l);
          l.then(o, o);
        }
      });
    }
    function ht(e, t) {
      var a = t.deletions;
      if (a !== null)
        for (var l = 0; l < a.length; l++) {
          var o = a[l],
            n = e,
            u = t,
            r = u;
          e: for (; r !== null;) {
            switch (r.tag) {
              case 27:
                if (wl(r.type)) {
                  ((we = r.stateNode), (xt = !1));
                  break e;
                }
                break;
              case 5:
                ((we = r.stateNode), (xt = !1));
                break e;
              case 3:
              case 4:
                ((we = r.stateNode.containerInfo), (xt = !0));
                break e;
            }
            r = r.return;
          }
          if (we === null) throw Error(w(160));
          (rx(n, u, o),
            (we = null),
            (xt = !1),
            (n = o.alternate),
            n !== null && (n.return = null),
            (o.return = null));
        }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) (fx(t, e), (t = t.sibling));
    }
    var ta = null;
    function fx(e, t) {
      var a = e.alternate,
        l = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (ht(t, e), gt(e), l & 4 && (Cl(3, e, e.return), ku(3, e), Cl(5, e, e.return)));
          break;
        case 1:
          (ht(t, e),
            gt(e),
            l & 512 && (Ne || a === null || ga(a, a.return)),
            l & 64 &&
              Ba &&
              ((e = e.updateQueue),
              e !== null &&
                ((l = e.callbacks),
                l !== null &&
                  ((a = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = a === null ? l : a.concat(l))))));
          break;
        case 26:
          var o = ta;
          if ((ht(t, e), gt(e), l & 512 && (Ne || a === null || ga(a, a.return)), l & 4)) {
            var n = a !== null ? a.memoizedState : null;
            if (((l = e.memoizedState), a === null))
              if (l === null)
                if (e.stateNode === null) {
                  e: {
                    ((l = e.type), (a = e.memoizedProps), (o = o.ownerDocument || o));
                    t: switch (l) {
                      case 'title':
                        ((n = o.getElementsByTagName('title')[0]),
                          (!n ||
                            n[wu] ||
                            n[We] ||
                            n.namespaceURI === 'http://www.w3.org/2000/svg' ||
                            n.hasAttribute('itemprop')) &&
                            ((n = o.createElement(l)),
                            o.head.insertBefore(n, o.querySelector('head > title'))),
                          et(n, l, a),
                          (n[We] = e),
                          Ye(n),
                          (l = n));
                        break e;
                      case 'link':
                        var u = nh('link', 'href', o).get(l + (a.href || ''));
                        if (u) {
                          for (var r = 0; r < u.length; r++)
                            if (
                              ((n = u[r]),
                              n.getAttribute('href') ===
                                (a.href == null || a.href === '' ? null : a.href) &&
                                n.getAttribute('rel') === (a.rel == null ? null : a.rel) &&
                                n.getAttribute('title') === (a.title == null ? null : a.title) &&
                                n.getAttribute('crossorigin') ===
                                  (a.crossOrigin == null ? null : a.crossOrigin))
                            ) {
                              u.splice(r, 1);
                              break t;
                            }
                        }
                        ((n = o.createElement(l)), et(n, l, a), o.head.appendChild(n));
                        break;
                      case 'meta':
                        if ((u = nh('meta', 'content', o).get(l + (a.content || '')))) {
                          for (r = 0; r < u.length; r++)
                            if (
                              ((n = u[r]),
                              n.getAttribute('content') ===
                                (a.content == null ? null : '' + a.content) &&
                                n.getAttribute('name') === (a.name == null ? null : a.name) &&
                                n.getAttribute('property') ===
                                  (a.property == null ? null : a.property) &&
                                n.getAttribute('http-equiv') ===
                                  (a.httpEquiv == null ? null : a.httpEquiv) &&
                                n.getAttribute('charset') ===
                                  (a.charSet == null ? null : a.charSet))
                            ) {
                              u.splice(r, 1);
                              break t;
                            }
                        }
                        ((n = o.createElement(l)), et(n, l, a), o.head.appendChild(n));
                        break;
                      default:
                        throw Error(w(468, l));
                    }
                    ((n[We] = e), Ye(n), (l = n));
                  }
                  e.stateNode = l;
                } else uh(o, e.type, e.stateNode);
              else e.stateNode = oh(o, l, e.memoizedProps);
            else
              n !== l
                ? (n === null
                    ? a.stateNode !== null && ((a = a.stateNode), a.parentNode.removeChild(a))
                    : n.count--,
                  l === null ? uh(o, e.type, e.stateNode) : oh(o, l, e.memoizedProps))
                : l === null && e.stateNode !== null && nf(e, e.memoizedProps, a.memoizedProps);
          }
          break;
        case 27:
          (ht(t, e),
            gt(e),
            l & 512 && (Ne || a === null || ga(a, a.return)),
            a !== null && l & 4 && nf(e, e.memoizedProps, a.memoizedProps));
          break;
        case 5:
          if ((ht(t, e), gt(e), l & 512 && (Ne || a === null || ga(a, a.return)), e.flags & 32)) {
            o = e.stateNode;
            try {
              en(o, '');
            } catch (S) {
              se(e, e.return, S);
            }
          }
          (l & 4 &&
            e.stateNode != null &&
            ((o = e.memoizedProps), nf(e, o, a !== null ? a.memoizedProps : o)),
            l & 1024 && (rf = !0));
          break;
        case 6:
          if ((ht(t, e), gt(e), l & 4)) {
            if (e.stateNode === null) throw Error(w(162));
            ((l = e.memoizedProps), (a = e.stateNode));
            try {
              a.nodeValue = l;
            } catch (S) {
              se(e, e.return, S);
            }
          }
          break;
        case 3:
          if (
            ((kr = null),
            (o = ta),
            (ta = as(t.containerInfo)),
            ht(t, e),
            (ta = o),
            gt(e),
            l & 4 && a !== null && a.memoizedState.isDehydrated)
          )
            try {
              sn(t.containerInfo);
            } catch (S) {
              se(e, e.return, S);
            }
          rf && ((rf = !1), cx(e));
          break;
        case 4:
          ((l = ta), (ta = as(e.stateNode.containerInfo)), ht(t, e), gt(e), (ta = l));
          break;
        case 12:
          (ht(t, e), gt(e));
          break;
        case 31:
          (ht(t, e),
            gt(e),
            l & 4 && ((l = e.updateQueue), l !== null && ((e.updateQueue = null), cr(e, l))));
          break;
        case 13:
          (ht(t, e),
            gt(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) != (a !== null && a.memoizedState !== null) &&
              (Ls = Dt()),
            l & 4 && ((l = e.updateQueue), l !== null && ((e.updateQueue = null), cr(e, l))));
          break;
        case 22:
          o = e.memoizedState !== null;
          var s = a !== null && a.memoizedState !== null,
            i = Ba,
            c = Ne;
          if (((Ba = i || o), (Ne = c || s), ht(t, e), (Ne = c), (Ba = i), gt(e), l & 8192))
            e: for (
              t = e.stateNode,
                t._visibility = o ? t._visibility & -2 : t._visibility | 1,
                o && (a === null || s || Ba || Ne || ql(e)),
                a = null,
                t = e;
              ;
            ) {
              if (t.tag === 5 || t.tag === 26) {
                if (a === null) {
                  s = a = t;
                  try {
                    if (((n = s.stateNode), o))
                      ((u = n.style),
                        typeof u.setProperty == 'function'
                          ? u.setProperty('display', 'none', 'important')
                          : (u.display = 'none'));
                    else {
                      r = s.stateNode;
                      var p = s.memoizedProps.style,
                        m = p != null && p.hasOwnProperty('display') ? p.display : null;
                      r.style.display = m == null || typeof m == 'boolean' ? '' : ('' + m).trim();
                    }
                  } catch (S) {
                    se(s, s.return, S);
                  }
                }
              } else if (t.tag === 6) {
                if (a === null) {
                  s = t;
                  try {
                    s.stateNode.nodeValue = o ? '' : s.memoizedProps;
                  } catch (S) {
                    se(s, s.return, S);
                  }
                }
              } else if (t.tag === 18) {
                if (a === null) {
                  s = t;
                  try {
                    var h = s.stateNode;
                    o ? $p(h, !0) : $p(s.stateNode, !1);
                  } catch (S) {
                    se(s, s.return, S);
                  }
                }
              } else if (
                ((t.tag !== 22 && t.tag !== 23) || t.memoizedState === null || t === e) &&
                t.child !== null
              ) {
                ((t.child.return = t), (t = t.child));
                continue;
              }
              if (t === e) break e;
              for (; t.sibling === null;) {
                if (t.return === null || t.return === e) break e;
                (a === t && (a = null), (t = t.return));
              }
              (a === t && (a = null), (t.sibling.return = t.return), (t = t.sibling));
            }
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((a = l.retryQueue), a !== null && ((l.retryQueue = null), cr(e, a))));
          break;
        case 19:
          (ht(t, e),
            gt(e),
            l & 4 && ((l = e.updateQueue), l !== null && ((e.updateQueue = null), cr(e, l))));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          (ht(t, e), gt(e));
      }
    }
    function gt(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var a, l = e.return; l !== null;) {
            if (lx(l)) {
              a = l;
              break;
            }
            l = l.return;
          }
          if (a == null) throw Error(w(160));
          switch (a.tag) {
            case 27:
              var o = a.stateNode,
                n = uf(e);
              Kr(e, n, o);
              break;
            case 5:
              var u = a.stateNode;
              a.flags & 32 && (en(u, ''), (a.flags &= -33));
              var r = uf(e);
              Kr(e, r, u);
              break;
            case 3:
            case 4:
              var s = a.stateNode.containerInfo,
                i = uf(e);
              Zf(e, i, s);
              break;
            default:
              throw Error(w(161));
          }
        } catch (c) {
          se(e, e.return, c);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function cx(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null;) {
          var t = e;
          (cx(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling));
        }
    }
    function Da(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null;) (nx(e, t.alternate, t), (t = t.sibling));
    }
    function ql(e) {
      for (e = e.child; e !== null;) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (Cl(4, t, t.return), ql(t));
            break;
          case 1:
            ga(t, t.return);
            var a = t.stateNode;
            (typeof a.componentWillUnmount == 'function' && tx(t, t.return, a), ql(t));
            break;
          case 27:
            uu(t.stateNode);
          case 26:
          case 5:
            (ga(t, t.return), ql(t));
            break;
          case 22:
            t.memoizedState === null && ql(t);
            break;
          case 30:
            ql(t);
            break;
          default:
            ql(t);
        }
        e = e.sibling;
      }
    }
    function Ea(e, t, a) {
      for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null;) {
        var l = t.alternate,
          o = e,
          n = t,
          u = n.flags;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            (Ea(o, n, a), ku(4, n));
            break;
          case 1:
            if ((Ea(o, n, a), (l = n), (o = l.stateNode), typeof o.componentDidMount == 'function'))
              try {
                o.componentDidMount();
              } catch (i) {
                se(l, l.return, i);
              }
            if (((l = n), (o = l.updateQueue), o !== null)) {
              var r = l.stateNode;
              try {
                var s = o.shared.hiddenCallbacks;
                if (s !== null)
                  for (o.shared.hiddenCallbacks = null, o = 0; o < s.length; o++) sg(s[o], r);
              } catch (i) {
                se(l, l.return, i);
              }
            }
            (a && u & 64 && ex(n), au(n, n.return));
            break;
          case 27:
            ox(n);
          case 26:
          case 5:
            (Ea(o, n, a), a && l === null && u & 4 && ax(n), au(n, n.return));
            break;
          case 12:
            Ea(o, n, a);
            break;
          case 31:
            (Ea(o, n, a), a && u & 4 && sx(o, n));
            break;
          case 13:
            (Ea(o, n, a), a && u & 4 && ix(o, n));
            break;
          case 22:
            (n.memoizedState === null && Ea(o, n, a), au(n, n.return));
            break;
          case 30:
            break;
          default:
            Ea(o, n, a);
        }
        t = t.sibling;
      }
    }
    function Kc(e, t) {
      var a = null;
      (e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (a = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== a && (e != null && e.refCount++, a != null && Au(a)));
    }
    function Zc(e, t) {
      ((e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && Au(e)));
    }
    function ea(e, t, a, l) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) (dx(e, t, a, l), (t = t.sibling));
    }
    function dx(e, t, a, l) {
      var o = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (ea(e, t, a, l), o & 2048 && ku(9, t));
          break;
        case 1:
          ea(e, t, a, l);
          break;
        case 3:
          (ea(e, t, a, l),
            o & 2048 &&
              ((e = null),
              t.alternate !== null && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== e && (t.refCount++, e != null && Au(e))));
          break;
        case 12:
          if (o & 2048) {
            (ea(e, t, a, l), (e = t.stateNode));
            try {
              var n = t.memoizedProps,
                u = n.id,
                r = n.onPostCommit;
              typeof r == 'function' &&
                r(u, t.alternate === null ? 'mount' : 'update', e.passiveEffectDuration, -0);
            } catch (s) {
              se(t, t.return, s);
            }
          } else ea(e, t, a, l);
          break;
        case 31:
          ea(e, t, a, l);
          break;
        case 13:
          ea(e, t, a, l);
          break;
        case 23:
          break;
        case 22:
          ((n = t.stateNode),
            (u = t.alternate),
            t.memoizedState !== null
              ? n._visibility & 2
                ? ea(e, t, a, l)
                : lu(e, t)
              : n._visibility & 2
                ? ea(e, t, a, l)
                : ((n._visibility |= 2), Do(e, t, a, l, (t.subtreeFlags & 10256) !== 0 || !1)),
            o & 2048 && Kc(u, t));
          break;
        case 24:
          (ea(e, t, a, l), o & 2048 && Zc(t.alternate, t));
          break;
        default:
          ea(e, t, a, l);
      }
    }
    function Do(e, t, a, l, o) {
      for (o = o && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
        var n = e,
          u = t,
          r = a,
          s = l,
          i = u.flags;
        switch (u.tag) {
          case 0:
          case 11:
          case 15:
            (Do(n, u, r, s, o), ku(8, u));
            break;
          case 23:
            break;
          case 22:
            var c = u.stateNode;
            (u.memoizedState !== null
              ? c._visibility & 2
                ? Do(n, u, r, s, o)
                : lu(n, u)
              : ((c._visibility |= 2), Do(n, u, r, s, o)),
              o && i & 2048 && Kc(u.alternate, u));
            break;
          case 24:
            (Do(n, u, r, s, o), o && i & 2048 && Zc(u.alternate, u));
            break;
          default:
            Do(n, u, r, s, o);
        }
        t = t.sibling;
      }
    }
    function lu(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null;) {
          var a = e,
            l = t,
            o = l.flags;
          switch (l.tag) {
            case 22:
              (lu(a, l), o & 2048 && Kc(l.alternate, l));
              break;
            case 24:
              (lu(a, l), o & 2048 && Zc(l.alternate, l));
              break;
            default:
              lu(a, l);
          }
          t = t.sibling;
        }
    }
    var Yn = 8192;
    function Mo(e, t, a) {
      if (e.subtreeFlags & Yn) for (e = e.child; e !== null;) (mx(e, t, a), (e = e.sibling));
    }
    function mx(e, t, a) {
      switch (e.tag) {
        case 26:
          (Mo(e, t, a),
            e.flags & Yn &&
              e.memoizedState !== null &&
              yI(a, ta, e.memoizedState, e.memoizedProps));
          break;
        case 5:
          Mo(e, t, a);
          break;
        case 3:
        case 4:
          var l = ta;
          ((ta = as(e.stateNode.containerInfo)), Mo(e, t, a), (ta = l));
          break;
        case 22:
          e.memoizedState === null &&
            ((l = e.alternate),
            l !== null && l.memoizedState !== null
              ? ((l = Yn), (Yn = 16777216), Mo(e, t, a), (Yn = l))
              : Mo(e, t, a));
          break;
        default:
          Mo(e, t, a);
      }
    }
    function px(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do ((t = e.sibling), (e.sibling = null), (e = t));
        while (e !== null);
      }
    }
    function Un(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null)
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            ((je = l), gx(l, e));
          }
        px(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (hx(e), (e = e.sibling));
    }
    function hx(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (Un(e), e.flags & 2048 && Cl(9, e, e.return));
          break;
        case 3:
          Un(e);
          break;
        case 12:
          Un(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Ar(e))
            : Un(e);
          break;
        default:
          Un(e);
      }
    }
    function Ar(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null)
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            ((je = l), gx(l, e));
          }
        px(e);
      }
      for (e = e.child; e !== null;) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            (Cl(8, t, t.return), Ar(t));
            break;
          case 22:
            ((a = t.stateNode), a._visibility & 2 && ((a._visibility &= -3), Ar(t)));
            break;
          default:
            Ar(t);
        }
        e = e.sibling;
      }
    }
    function gx(e, t) {
      for (; je !== null;) {
        var a = je;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            Cl(8, a, t);
            break;
          case 23:
          case 22:
            if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
              var l = a.memoizedState.cachePool.pool;
              l != null && l.refCount++;
            }
            break;
          case 24:
            Au(a.memoizedState.cache);
        }
        if (((l = a.child), l !== null)) ((l.return = a), (je = l));
        else
          e: for (a = e; je !== null;) {
            l = je;
            var o = l.sibling,
              n = l.return;
            if ((ux(l), l === a)) {
              je = null;
              break e;
            }
            if (o !== null) {
              ((o.return = n), (je = o));
              break e;
            }
            je = n;
          }
      }
    }
    var Hb = {
        getCacheForType: function (e) {
          var t = $e(_e),
            a = t.data.get(e);
          return (a === void 0 && ((a = e()), t.data.set(e, a)), a);
        },
        cacheSignal: function () {
          return $e(_e).controller.signal;
        },
      },
      zb = typeof WeakMap == 'function' ? WeakMap : Map,
      oe = 0,
      pe = null,
      Q = null,
      $ = 0,
      re = 0,
      At = null,
      sl = !1,
      pn = !1,
      Qc = !1,
      Xa = 0,
      De = 0,
      bl = 0,
      jl = 0,
      Wc = 0,
      Mt = 0,
      on = 0,
      ou = null,
      Lt = null,
      Qf = !1,
      Ls = 0,
      xx = 0,
      Zr = 1 / 0,
      Qr = null,
      hl = null,
      qe = 0,
      gl = null,
      nn = null,
      Ua = 0,
      Wf = 0,
      Jf = null,
      Lx = null,
      nu = 0,
      $f = null;
    function Bt() {
      return (oe & 2) !== 0 && $ !== 0 ? $ & -$ : N.T !== null ? $c() : Ah();
    }
    function Sx() {
      if (Mt === 0)
        if (($ & 536870912) === 0 || te) {
          var e = tr;
          ((tr <<= 1), (tr & 3932160) === 0 && (tr = 262144), (Mt = e));
        } else Mt = 536870912;
      return ((e = Nt.current), e !== null && (e.flags |= 32), Mt);
    }
    function St(e, t, a) {
      (((e === pe && (re === 2 || re === 9)) || e.cancelPendingCommit !== null) &&
        (un(e, 0), il(e, $, Mt, !1)),
        Iu(e, a),
        ((oe & 2) === 0 || e !== pe) &&
          (e === pe && ((oe & 2) === 0 && (jl |= a), De === 4 && il(e, $, Mt, !1)), Sa(e)));
    }
    function vx(e, t, a) {
      if ((oe & 6) !== 0) throw Error(w(327));
      var l = (!a && (t & 127) === 0 && (t & e.expiredLanes) === 0) || bu(e, t),
        o = l ? Fb(e, t) : sf(e, t, !0),
        n = l;
      do {
        if (o === 0) {
          pn && !l && il(e, t, 0, !1);
          break;
        } else {
          if (((a = e.current.alternate), n && !Ub(a))) {
            ((o = sf(e, t, !1)), (n = !1));
            continue;
          }
          if (o === 2) {
            if (((n = t), e.errorRecoveryDisabledLanes & n)) var u = 0;
            else
              ((u = e.pendingLanes & -536870913),
                (u = u !== 0 ? u : u & 536870912 ? 536870912 : 0));
            if (u !== 0) {
              t = u;
              e: {
                var r = e;
                o = ou;
                var s = r.current.memoizedState.isDehydrated;
                if ((s && (un(r, u).flags |= 256), (u = sf(r, u, !1)), u !== 2)) {
                  if (Qc && !s) {
                    ((r.errorRecoveryDisabledLanes |= n), (jl |= n), (o = 4));
                    break e;
                  }
                  ((n = Lt),
                    (Lt = o),
                    n !== null && (Lt === null ? (Lt = n) : Lt.push.apply(Lt, n)));
                }
                o = u;
              }
              if (((n = !1), o !== 2)) continue;
            }
          }
          if (o === 1) {
            (un(e, 0), il(e, t, 0, !0));
            break;
          }
          e: {
            switch (((l = e), (n = o), n)) {
              case 0:
              case 1:
                throw Error(w(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                il(l, t, Mt, !sl);
                break e;
              case 2:
                Lt = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(w(329));
            }
            if ((t & 62914560) === t && ((o = Ls + 300 - Dt()), 10 < o)) {
              if ((il(l, t, Mt, !sl), rs(l, 0, !0) !== 0)) break e;
              ((Ua = t),
                (l.timeoutHandle = Ux(
                  Hp.bind(null, l, a, Lt, Qr, Qf, t, Mt, jl, on, sl, n, 'Throttled', -0, 0),
                  o,
                )));
              break e;
            }
            Hp(l, a, Lt, Qr, Qf, t, Mt, jl, on, sl, n, null, -0, 0);
          }
        }
        break;
      } while (!0);
      Sa(e);
    }
    function Hp(e, t, a, l, o, n, u, r, s, i, c, p, m, h) {
      if (((e.timeoutHandle = -1), (p = t.subtreeFlags), p & 8192 || (p & 16785408) === 16785408)) {
        ((p = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: Na,
        }),
          mx(t, n, p));
        var S = (n & 62914560) === n ? Ls - Dt() : (n & 4194048) === n ? xx - Dt() : 0;
        if (((S = CI(p, S)), S !== null)) {
          ((Ua = n),
            (e.cancelPendingCommit = S(Up.bind(null, e, t, n, a, l, o, u, r, s, c, p, null, m, h))),
            il(e, n, u, !i));
          return;
        }
      }
      Up(e, t, n, a, l, o, u, r, s);
    }
    function Ub(e) {
      for (var t = e; ;) {
        var a = t.tag;
        if (
          (a === 0 || a === 11 || a === 15) &&
          t.flags & 16384 &&
          ((a = t.updateQueue), a !== null && ((a = a.stores), a !== null))
        )
          for (var l = 0; l < a.length; l++) {
            var o = a[l],
              n = o.getSnapshot;
            o = o.value;
            try {
              if (!Pt(n(), o)) return !1;
            } catch {
              return !1;
            }
          }
        if (((a = t.child), t.subtreeFlags & 16384 && a !== null)) ((a.return = t), (t = a));
        else {
          if (t === e) break;
          for (; t.sibling === null;) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function il(e, t, a, l) {
      ((t &= ~Wc),
        (t &= ~jl),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        l && (e.warmLanes |= t),
        (l = e.expirationTimes));
      for (var o = t; 0 < o;) {
        var n = 31 - Ot(o),
          u = 1 << n;
        ((l[n] = -1), (o &= ~u));
      }
      a !== 0 && Ih(e, a, t);
    }
    function Ss() {
      return (oe & 6) === 0 ? (Mu(0, !1), !1) : !0;
    }
    function Jc() {
      if (Q !== null) {
        if (re === 0) var e = Q.return;
        else ((e = Q), (_a = ao = null), _c(e), (Zo = null), (mu = 0), (e = Q));
        for (; e !== null;) ($g(e.alternate, e), (e = e.return));
        Q = null;
      }
    }
    function un(e, t) {
      var a = e.timeoutHandle;
      (a !== -1 && ((e.timeoutHandle = -1), oI(a)),
        (a = e.cancelPendingCommit),
        a !== null && ((e.cancelPendingCommit = null), a()),
        (Ua = 0),
        Jc(),
        (pe = e),
        (Q = a = Ha(e.current, null)),
        ($ = t),
        (re = 0),
        (At = null),
        (sl = !1),
        (pn = bu(e, t)),
        (Qc = !1),
        (on = Mt = Wc = jl = bl = De = 0),
        (Lt = ou = null),
        (Qf = !1),
        (t & 8) !== 0 && (t |= t & 32));
      var l = e.entangledLanes;
      if (l !== 0)
        for (e = e.entanglements, l &= t; 0 < l;) {
          var o = 31 - Ot(l),
            n = 1 << o;
          ((t |= e[o]), (l &= ~n));
        }
      return ((Xa = t), cs(), a);
    }
    function yx(e, t) {
      ((j = null),
        (N.H = hu),
        t === mn || t === ms
          ? ((t = gp()), (re = 3))
          : t === Mc
            ? ((t = gp()), (re = 4))
            : (re =
                t === jc
                  ? 8
                  : t !== null && typeof t == 'object' && typeof t.then == 'function'
                    ? 6
                    : 1),
        (At = t),
        Q === null && ((De = 1), jr(e, Xt(t, e.current))));
    }
    function Cx() {
      var e = Nt.current;
      return e === null
        ? !0
        : ($ & 4194048) === $
          ? Yt === null
          : ($ & 62914560) === $ || ($ & 536870912) !== 0
            ? e === Yt
            : !1;
    }
    function bx() {
      var e = N.H;
      return ((N.H = hu), e === null ? hu : e);
    }
    function Ix() {
      var e = N.A;
      return ((N.A = Hb), e);
    }
    function Wr() {
      ((De = 4),
        sl || (($ & 4194048) !== $ && Nt.current !== null) || (pn = !0),
        ((bl & 134217727) === 0 && (jl & 134217727) === 0) || pe === null || il(pe, $, Mt, !1));
    }
    function sf(e, t, a) {
      var l = oe;
      oe |= 2;
      var o = bx(),
        n = Ix();
      ((pe !== e || $ !== t) && ((Qr = null), un(e, t)), (t = !1));
      var u = De;
      e: do
        try {
          if (re !== 0 && Q !== null) {
            var r = Q,
              s = At;
            switch (re) {
              case 8:
                (Jc(), (u = 6));
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                Nt.current === null && (t = !0);
                var i = re;
                if (((re = 0), (At = null), Vo(e, r, s, i), a && pn)) {
                  u = 0;
                  break e;
                }
                break;
              default:
                ((i = re), (re = 0), (At = null), Vo(e, r, s, i));
            }
          }
          (qb(), (u = De));
          break;
        } catch (c) {
          yx(e, c);
        }
      while (!0);
      return (
        t && e.shellSuspendCounter++,
        (_a = ao = null),
        (oe = l),
        (N.H = o),
        (N.A = n),
        Q === null && ((pe = null), ($ = 0), cs()),
        u
      );
    }
    function qb() {
      for (; Q !== null;) wx(Q);
    }
    function Fb(e, t) {
      var a = oe;
      oe |= 2;
      var l = bx(),
        o = Ix();
      pe !== e || $ !== t ? ((Qr = null), (Zr = Dt() + 500), un(e, t)) : (pn = bu(e, t));
      e: do
        try {
          if (re !== 0 && Q !== null) {
            t = Q;
            var n = At;
            t: switch (re) {
              case 1:
                ((re = 0), (At = null), Vo(e, t, n, 1));
                break;
              case 2:
              case 9:
                if (hp(n)) {
                  ((re = 0), (At = null), zp(t));
                  break;
                }
                ((t = function () {
                  ((re !== 2 && re !== 9) || pe !== e || (re = 7), Sa(e));
                }),
                  n.then(t, t));
                break e;
              case 3:
                re = 7;
                break e;
              case 4:
                re = 5;
                break e;
              case 7:
                hp(n) ? ((re = 0), (At = null), zp(t)) : ((re = 0), (At = null), Vo(e, t, n, 7));
                break;
              case 5:
                var u = null;
                switch (Q.tag) {
                  case 26:
                    u = Q.memoizedState;
                  case 5:
                  case 27:
                    var r = Q;
                    if (u ? Xx(u) : r.stateNode.complete) {
                      ((re = 0), (At = null));
                      var s = r.sibling;
                      if (s !== null) Q = s;
                      else {
                        var i = r.return;
                        i !== null ? ((Q = i), vs(i)) : (Q = null);
                      }
                      break t;
                    }
                }
                ((re = 0), (At = null), Vo(e, t, n, 5));
                break;
              case 6:
                ((re = 0), (At = null), Vo(e, t, n, 6));
                break;
              case 8:
                (Jc(), (De = 6));
                break e;
              default:
                throw Error(w(462));
            }
          }
          Gb();
          break;
        } catch (c) {
          yx(e, c);
        }
      while (!0);
      return (
        (_a = ao = null),
        (N.H = l),
        (N.A = o),
        (oe = a),
        Q !== null ? 0 : ((pe = null), ($ = 0), cs(), De)
      );
    }
    function Gb() {
      for (; Q !== null && !dC();) wx(Q);
    }
    function wx(e) {
      var t = Jg(e.alternate, e, Xa);
      ((e.memoizedProps = e.pendingProps), t === null ? vs(e) : (Q = t));
    }
    function zp(e) {
      var t = e,
        a = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Ep(a, t, t.pendingProps, t.type, void 0, $);
          break;
        case 11:
          t = Ep(a, t, t.pendingProps, t.type.render, t.ref, $);
          break;
        case 5:
          _c(t);
        default:
          ($g(a, t), (t = Q = $h(t, Xa)), (t = Jg(a, t, Xa)));
      }
      ((e.memoizedProps = e.pendingProps), t === null ? vs(e) : (Q = t));
    }
    function Vo(e, t, a, l) {
      ((_a = ao = null), _c(t), (Zo = null), (mu = 0));
      var o = t.return;
      try {
        if (Db(e, o, t, a, $)) {
          ((De = 1), jr(e, Xt(a, e.current)), (Q = null));
          return;
        }
      } catch (n) {
        if (o !== null) throw ((Q = o), n);
        ((De = 1), jr(e, Xt(a, e.current)), (Q = null));
        return;
      }
      t.flags & 32768
        ? (te || l === 1
            ? (e = !0)
            : pn || ($ & 536870912) !== 0
              ? (e = !1)
              : ((sl = e = !0),
                (l === 2 || l === 9 || l === 3 || l === 6) &&
                  ((l = Nt.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
          Rx(t, e))
        : vs(t);
    }
    function vs(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          Rx(t, sl);
          return;
        }
        e = t.return;
        var a = Bb(t.alternate, t, Xa);
        if (a !== null) {
          Q = a;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          Q = t;
          return;
        }
        Q = t = e;
      } while (t !== null);
      De === 0 && (De = 5);
    }
    function Rx(e, t) {
      do {
        var a = Pb(e.alternate, e);
        if (a !== null) {
          ((a.flags &= 32767), (Q = a));
          return;
        }
        if (
          ((a = e.return),
          a !== null && ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          Q = e;
          return;
        }
        Q = e = a;
      } while (e !== null);
      ((De = 6), (Q = null));
    }
    function Up(e, t, a, l, o, n, u, r, s) {
      e.cancelPendingCommit = null;
      do ys();
      while (qe !== 0);
      if ((oe & 6) !== 0) throw Error(w(327));
      if (t !== null) {
        if (t === e.current) throw Error(w(177));
        if (
          ((n = t.lanes | t.childLanes),
          (n |= bc),
          CC(e, a, n, u, r, s),
          e === pe && ((Q = pe = null), ($ = 0)),
          (nn = t),
          (gl = e),
          (Ua = a),
          (Wf = n),
          (Jf = o),
          (Lx = l),
          (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              Yb(Pr, function () {
                return (Dx(), null);
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (l = (t.flags & 13878) !== 0),
          (t.subtreeFlags & 13878) !== 0 || l)
        ) {
          ((l = N.T), (N.T = null), (o = ne.p), (ne.p = 2), (u = oe), (oe |= 4));
          try {
            Nb(e, t, a);
          } finally {
            ((oe = u), (ne.p = o), (N.T = l));
          }
        }
        ((qe = 1), Ax(), Tx(), kx());
      }
    }
    function Ax() {
      if (qe === 1) {
        qe = 0;
        var e = gl,
          t = nn,
          a = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || a) {
          ((a = N.T), (N.T = null));
          var l = ne.p;
          ne.p = 2;
          var o = oe;
          oe |= 4;
          try {
            fx(t, e);
            var n = lc,
              u = Xh(e.containerInfo),
              r = n.focusedElem,
              s = n.selectionRange;
            if (u !== r && r && r.ownerDocument && Vh(r.ownerDocument.documentElement, r)) {
              if (s !== null && Cc(r)) {
                var i = s.start,
                  c = s.end;
                if ((c === void 0 && (c = i), 'selectionStart' in r))
                  ((r.selectionStart = i), (r.selectionEnd = Math.min(c, r.value.length)));
                else {
                  var p = r.ownerDocument || document,
                    m = (p && p.defaultView) || window;
                  if (m.getSelection) {
                    var h = m.getSelection(),
                      S = r.textContent.length,
                      x = Math.min(s.start, S),
                      y = s.end === void 0 ? x : Math.min(s.end, S);
                    !h.extend && x > y && ((u = y), (y = x), (x = u));
                    var g = sp(r, x),
                      d = sp(r, y);
                    if (
                      g &&
                      d &&
                      (h.rangeCount !== 1 ||
                        h.anchorNode !== g.node ||
                        h.anchorOffset !== g.offset ||
                        h.focusNode !== d.node ||
                        h.focusOffset !== d.offset)
                    ) {
                      var f = p.createRange();
                      (f.setStart(g.node, g.offset),
                        h.removeAllRanges(),
                        x > y
                          ? (h.addRange(f), h.extend(d.node, d.offset))
                          : (f.setEnd(d.node, d.offset), h.addRange(f)));
                    }
                  }
                }
              }
              for (p = [], h = r; (h = h.parentNode);)
                h.nodeType === 1 && p.push({ element: h, left: h.scrollLeft, top: h.scrollTop });
              for (typeof r.focus == 'function' && r.focus(), r = 0; r < p.length; r++) {
                var L = p[r];
                ((L.element.scrollLeft = L.left), (L.element.scrollTop = L.top));
              }
            }
            ((ns = !!ac), (lc = ac = null));
          } finally {
            ((oe = o), (ne.p = l), (N.T = a));
          }
        }
        ((e.current = t), (qe = 2));
      }
    }
    function Tx() {
      if (qe === 2) {
        qe = 0;
        var e = gl,
          t = nn,
          a = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || a) {
          ((a = N.T), (N.T = null));
          var l = ne.p;
          ne.p = 2;
          var o = oe;
          oe |= 4;
          try {
            nx(e, t.alternate, t);
          } finally {
            ((oe = o), (ne.p = l), (N.T = a));
          }
        }
        qe = 3;
      }
    }
    function kx() {
      if (qe === 4 || qe === 3) {
        ((qe = 0), mC());
        var e = gl,
          t = nn,
          a = Ua,
          l = Lx;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? (qe = 5)
          : ((qe = 0), (nn = gl = null), Mx(e, e.pendingLanes));
        var o = e.pendingLanes;
        if (
          (o === 0 && (hl = null),
          hc(a),
          (t = t.stateNode),
          Et && typeof Et.onCommitFiberRoot == 'function')
        )
          try {
            Et.onCommitFiberRoot(Cu, t, void 0, (t.current.flags & 128) === 128);
          } catch {}
        if (l !== null) {
          ((t = N.T), (o = ne.p), (ne.p = 2), (N.T = null));
          try {
            for (var n = e.onRecoverableError, u = 0; u < l.length; u++) {
              var r = l[u];
              n(r.value, { componentStack: r.stack });
            }
          } finally {
            ((N.T = t), (ne.p = o));
          }
        }
        ((Ua & 3) !== 0 && ys(),
          Sa(e),
          (o = e.pendingLanes),
          (a & 261930) !== 0 && (o & 42) !== 0
            ? e === $f
              ? nu++
              : ((nu = 0), ($f = e))
            : (nu = 0),
          Mu(0, !1));
      }
    }
    function Mx(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), Au(t)));
    }
    function ys() {
      return (Ax(), Tx(), kx(), Dx());
    }
    function Dx() {
      if (qe !== 5) return !1;
      var e = gl,
        t = Wf;
      Wf = 0;
      var a = hc(Ua),
        l = N.T,
        o = ne.p;
      try {
        ((ne.p = 32 > a ? 32 : a), (N.T = null), (a = Jf), (Jf = null));
        var n = gl,
          u = Ua;
        if (((qe = 0), (nn = gl = null), (Ua = 0), (oe & 6) !== 0)) throw Error(w(331));
        var r = oe;
        if (
          ((oe |= 4),
          hx(n.current),
          dx(n, n.current, u, a),
          (oe = r),
          Mu(0, !1),
          Et && typeof Et.onPostCommitFiberRoot == 'function')
        )
          try {
            Et.onPostCommitFiberRoot(Cu, n);
          } catch {}
        return !0;
      } finally {
        ((ne.p = o), (N.T = l), Mx(e, t));
      }
    }
    function qp(e, t, a) {
      ((t = Xt(a, t)),
        (t = jf(e.stateNode, t, 2)),
        (e = pl(e, t, 2)),
        e !== null && (Iu(e, 2), Sa(e)));
    }
    function se(e, t, a) {
      if (e.tag === 3) qp(e, e, a);
      else
        for (; t !== null;) {
          if (t.tag === 3) {
            qp(t, e, a);
            break;
          } else if (t.tag === 1) {
            var l = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == 'function' ||
              (typeof l.componentDidCatch == 'function' && (hl === null || !hl.has(l)))
            ) {
              ((e = Xt(a, e)),
                (a = jg(2)),
                (l = pl(t, a, 2)),
                l !== null && (Yg(a, l, t, e), Iu(l, 2), Sa(l)));
              break;
            }
          }
          t = t.return;
        }
    }
    function ff(e, t, a) {
      var l = e.pingCache;
      if (l === null) {
        l = e.pingCache = new zb();
        var o = new Set();
        l.set(t, o);
      } else ((o = l.get(t)), o === void 0 && ((o = new Set()), l.set(t, o)));
      o.has(a) || ((Qc = !0), o.add(a), (e = Vb.bind(null, e, t, a)), t.then(e, e));
    }
    function Vb(e, t, a) {
      var l = e.pingCache;
      (l !== null && l.delete(t),
        (e.pingedLanes |= e.suspendedLanes & a),
        (e.warmLanes &= ~a),
        pe === e &&
          ($ & a) === a &&
          (De === 4 || (De === 3 && ($ & 62914560) === $ && 300 > Dt() - Ls)
            ? (oe & 2) === 0 && un(e, 0)
            : (Wc |= a),
          on === $ && (on = 0)),
        Sa(e));
    }
    function Ex(e, t) {
      (t === 0 && (t = bh()), (e = to(e, t)), e !== null && (Iu(e, t), Sa(e)));
    }
    function Xb(e) {
      var t = e.memoizedState,
        a = 0;
      (t !== null && (a = t.retryLane), Ex(e, a));
    }
    function jb(e, t) {
      var a = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var l = e.stateNode,
            o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case 19:
          l = e.stateNode;
          break;
        case 22:
          l = e.stateNode._retryCache;
          break;
        default:
          throw Error(w(314));
      }
      (l !== null && l.delete(t), Ex(e, a));
    }
    function Yb(e, t) {
      return mc(e, t);
    }
    var Jr = null,
      Eo = null,
      ec = !1,
      $r = !1,
      cf = !1,
      fl = 0;
    function Sa(e) {
      (e !== Eo && e.next === null && (Eo === null ? (Jr = Eo = e) : (Eo = Eo.next = e)),
        ($r = !0),
        ec || ((ec = !0), Zb()));
    }
    function Mu(e, t) {
      if (!cf && $r) {
        cf = !0;
        do
          for (var a = !1, l = Jr; l !== null;) {
            if (!t)
              if (e !== 0) {
                var o = l.pendingLanes;
                if (o === 0) var n = 0;
                else {
                  var u = l.suspendedLanes,
                    r = l.pingedLanes;
                  ((n = (1 << (31 - Ot(42 | e) + 1)) - 1),
                    (n &= o & ~(u & ~r)),
                    (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
                }
                n !== 0 && ((a = !0), Fp(l, n));
              } else
                ((n = $),
                  (n = rs(
                    l,
                    l === pe ? n : 0,
                    l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
                  )),
                  (n & 3) === 0 || bu(l, n) || ((a = !0), Fp(l, n)));
            l = l.next;
          }
        while (a);
        cf = !1;
      }
    }
    function Kb() {
      Ox();
    }
    function Ox() {
      $r = ec = !1;
      var e = 0;
      fl !== 0 && lI() && (e = fl);
      for (var t = Dt(), a = null, l = Jr; l !== null;) {
        var o = l.next,
          n = Bx(l, t);
        (n === 0
          ? ((l.next = null), a === null ? (Jr = o) : (a.next = o), o === null && (Eo = a))
          : ((a = l), (e !== 0 || (n & 3) !== 0) && ($r = !0)),
          (l = o));
      }
      ((qe !== 0 && qe !== 5) || Mu(e, !1), fl !== 0 && (fl = 0));
    }
    function Bx(e, t) {
      for (
        var a = e.suspendedLanes,
          l = e.pingedLanes,
          o = e.expirationTimes,
          n = e.pendingLanes & -62914561;
        0 < n;
      ) {
        var u = 31 - Ot(n),
          r = 1 << u,
          s = o[u];
        (s === -1
          ? ((r & a) === 0 || (r & l) !== 0) && (o[u] = yC(r, t))
          : s <= t && (e.expiredLanes |= r),
          (n &= ~r));
      }
      if (
        ((t = pe),
        (a = $),
        (a = rs(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
        (l = e.callbackNode),
        a === 0 || (e === t && (re === 2 || re === 9)) || e.cancelPendingCommit !== null)
      )
        return (
          l !== null && l !== null && zi(l),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if ((a & 3) === 0 || bu(e, a)) {
        if (((t = a & -a), t === e.callbackPriority)) return t;
        switch ((l !== null && zi(l), hc(a))) {
          case 2:
          case 8:
            a = yh;
            break;
          case 32:
            a = Pr;
            break;
          case 268435456:
            a = Ch;
            break;
          default:
            a = Pr;
        }
        return (
          (l = Px.bind(null, e)),
          (a = mc(a, l)),
          (e.callbackPriority = t),
          (e.callbackNode = a),
          t
        );
      }
      return (
        l !== null && l !== null && zi(l),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function Px(e, t) {
      if (qe !== 0 && qe !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var a = e.callbackNode;
      if (ys() && e.callbackNode !== a) return null;
      var l = $;
      return (
        (l = rs(e, e === pe ? l : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
        l === 0
          ? null
          : (vx(e, l, t),
            Bx(e, Dt()),
            e.callbackNode != null && e.callbackNode === a ? Px.bind(null, e) : null)
      );
    }
    function Fp(e, t) {
      if (ys()) return null;
      vx(e, t, !0);
    }
    function Zb() {
      nI(function () {
        (oe & 6) !== 0 ? mc(vh, Kb) : Ox();
      });
    }
    function $c() {
      if (fl === 0) {
        var e = tn;
        (e === 0 && ((e = er), (er <<= 1), (er & 261888) === 0 && (er = 256)), (fl = e));
      }
      return fl;
    }
    function Gp(e) {
      return e == null || typeof e == 'symbol' || typeof e == 'boolean'
        ? null
        : typeof e == 'function'
          ? e
          : Lr('' + e);
    }
    function Vp(e, t) {
      var a = t.ownerDocument.createElement('input');
      return (
        (a.name = t.name),
        (a.value = t.value),
        e.id && a.setAttribute('form', e.id),
        t.parentNode.insertBefore(a, t),
        (e = new FormData(e)),
        a.parentNode.removeChild(a),
        e
      );
    }
    function Qb(e, t, a, l, o) {
      if (t === 'submit' && a && a.stateNode === o) {
        var n = Gp((o[vt] || null).action),
          u = l.submitter;
        u &&
          ((t = (t = u[vt] || null) ? Gp(t.formAction) : u.getAttribute('formAction')),
          t !== null && ((n = t), (u = null)));
        var r = new ss('action', 'action', null, l, o);
        e.push({
          event: r,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (l.defaultPrevented) {
                  if (fl !== 0) {
                    var s = u ? Vp(o, u) : new FormData(o);
                    Vf(a, { pending: !0, data: s, method: o.method, action: n }, null, s);
                  }
                } else
                  typeof n == 'function' &&
                    (r.preventDefault(),
                    (s = u ? Vp(o, u) : new FormData(o)),
                    Vf(a, { pending: !0, data: s, method: o.method, action: n }, n, s));
              },
              currentTarget: o,
            },
          ],
        });
      }
    }
    for (dr = 0; dr < Ef.length; dr++)
      ((mr = Ef[dr]),
        (Xp = mr.toLowerCase()),
        (jp = mr[0].toUpperCase() + mr.slice(1)),
        aa(Xp, 'on' + jp));
    var mr, Xp, jp, dr;
    aa(Yh, 'onAnimationEnd');
    aa(Kh, 'onAnimationIteration');
    aa(Zh, 'onAnimationStart');
    aa('dblclick', 'onDoubleClick');
    aa('focusin', 'onFocus');
    aa('focusout', 'onBlur');
    aa(pb, 'onTransitionRun');
    aa(hb, 'onTransitionStart');
    aa(gb, 'onTransitionCancel');
    aa(Qh, 'onTransitionEnd');
    $o('onMouseEnter', ['mouseout', 'mouseover']);
    $o('onMouseLeave', ['mouseout', 'mouseover']);
    $o('onPointerEnter', ['pointerout', 'pointerover']);
    $o('onPointerLeave', ['pointerout', 'pointerover']);
    Jl('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' '));
    Jl(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    );
    Jl('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
    Jl('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' '));
    Jl(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    );
    Jl(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    );
    var gu =
        'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
          ' ',
        ),
      Wb = new Set(
        'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(gu),
      );
    function Nx(e, t) {
      t = (t & 4) !== 0;
      for (var a = 0; a < e.length; a++) {
        var l = e[a],
          o = l.event;
        l = l.listeners;
        e: {
          var n = void 0;
          if (t)
            for (var u = l.length - 1; 0 <= u; u--) {
              var r = l[u],
                s = r.instance,
                i = r.currentTarget;
              if (((r = r.listener), s !== n && o.isPropagationStopped())) break e;
              ((n = r), (o.currentTarget = i));
              try {
                n(o);
              } catch (c) {
                _r(c);
              }
              ((o.currentTarget = null), (n = s));
            }
          else
            for (u = 0; u < l.length; u++) {
              if (
                ((r = l[u]),
                (s = r.instance),
                (i = r.currentTarget),
                (r = r.listener),
                s !== n && o.isPropagationStopped())
              )
                break e;
              ((n = r), (o.currentTarget = i));
              try {
                n(o);
              } catch (c) {
                _r(c);
              }
              ((o.currentTarget = null), (n = s));
            }
        }
      }
    }
    function Z(e, t) {
      var a = t[If];
      a === void 0 && (a = t[If] = new Set());
      var l = e + '__bubble';
      a.has(l) || (_x(t, e, 2, !1), a.add(l));
    }
    function df(e, t, a) {
      var l = 0;
      (t && (l |= 4), _x(a, e, l, t));
    }
    var pr = '_reactListening' + Math.random().toString(36).slice(2);
    function ed(e) {
      if (!e[pr]) {
        ((e[pr] = !0),
          Th.forEach(function (a) {
            a !== 'selectionchange' && (Wb.has(a) || df(a, !1, e), df(a, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[pr] || ((t[pr] = !0), df('selectionchange', !1, t));
      }
    }
    function _x(e, t, a, l) {
      switch (Qx(t)) {
        case 2:
          var o = wI;
          break;
        case 8:
          o = RI;
          break;
        default:
          o = od;
      }
      ((a = o.bind(null, t, a, e)),
        (o = void 0),
        !kf || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (o = !0),
        l
          ? o !== void 0
            ? e.addEventListener(t, a, { capture: !0, passive: o })
            : e.addEventListener(t, a, !0)
          : o !== void 0
            ? e.addEventListener(t, a, { passive: o })
            : e.addEventListener(t, a, !1));
    }
    function mf(e, t, a, l, o) {
      var n = l;
      if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
        e: for (;;) {
          if (l === null) return;
          var u = l.tag;
          if (u === 3 || u === 4) {
            var r = l.stateNode.containerInfo;
            if (r === o) break;
            if (u === 4)
              for (u = l.return; u !== null;) {
                var s = u.tag;
                if ((s === 3 || s === 4) && u.stateNode.containerInfo === o) return;
                u = u.return;
              }
            for (; r !== null;) {
              if (((u = Po(r)), u === null)) return;
              if (((s = u.tag), s === 5 || s === 6 || s === 26 || s === 27)) {
                l = n = u;
                continue e;
              }
              r = r.parentNode;
            }
          }
          l = l.return;
        }
      Nh(function () {
        var i = n,
          c = Lc(a),
          p = [];
        e: {
          var m = Wh.get(e);
          if (m !== void 0) {
            var h = ss,
              S = e;
            switch (e) {
              case 'keypress':
                if (vr(a) === 0) break e;
              case 'keydown':
              case 'keyup':
                h = jC;
                break;
              case 'focusin':
                ((S = 'focus'), (h = Vi));
                break;
              case 'focusout':
                ((S = 'blur'), (h = Vi));
                break;
              case 'beforeblur':
              case 'afterblur':
                h = Vi;
                break;
              case 'click':
                if (a.button === 2) break e;
              case 'auxclick':
              case 'dblclick':
              case 'mousedown':
              case 'mousemove':
              case 'mouseup':
              case 'mouseout':
              case 'mouseover':
              case 'contextmenu':
                h = $m;
                break;
              case 'drag':
              case 'dragend':
              case 'dragenter':
              case 'dragexit':
              case 'dragleave':
              case 'dragover':
              case 'dragstart':
              case 'drop':
                h = BC;
                break;
              case 'touchcancel':
              case 'touchend':
              case 'touchmove':
              case 'touchstart':
                h = ZC;
                break;
              case Yh:
              case Kh:
              case Zh:
                h = _C;
                break;
              case Qh:
                h = WC;
                break;
              case 'scroll':
              case 'scrollend':
                h = EC;
                break;
              case 'wheel':
                h = $C;
                break;
              case 'copy':
              case 'cut':
              case 'paste':
                h = zC;
                break;
              case 'gotpointercapture':
              case 'lostpointercapture':
              case 'pointercancel':
              case 'pointerdown':
              case 'pointermove':
              case 'pointerout':
              case 'pointerover':
              case 'pointerup':
                h = tp;
                break;
              case 'toggle':
              case 'beforetoggle':
                h = tb;
            }
            var x = (t & 4) !== 0,
              y = !x && (e === 'scroll' || e === 'scrollend'),
              g = x ? (m !== null ? m + 'Capture' : null) : m;
            x = [];
            for (var d = i, f; d !== null;) {
              var L = d;
              if (
                ((f = L.stateNode),
                (L = L.tag),
                (L !== 5 && L !== 26 && L !== 27) ||
                  f === null ||
                  g === null ||
                  ((L = su(d, g)), L != null && x.push(xu(d, L, f))),
                y)
              )
                break;
              d = d.return;
            }
            0 < x.length && ((m = new h(m, S, null, a, c)), p.push({ event: m, listeners: x }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (
              ((m = e === 'mouseover' || e === 'pointerover'),
              (h = e === 'mouseout' || e === 'pointerout'),
              m && a !== Tf && (S = a.relatedTarget || a.fromElement) && (Po(S) || S[fn]))
            )
              break e;
            if (
              (h || m) &&
              ((m =
                c.window === c
                  ? c
                  : (m = c.ownerDocument)
                    ? m.defaultView || m.parentWindow
                    : window),
              h
                ? ((S = a.relatedTarget || a.toElement),
                  (h = i),
                  (S = S ? Po(S) : null),
                  S !== null &&
                    ((y = yu(S)), (x = S.tag), S !== y || (x !== 5 && x !== 27 && x !== 6)) &&
                    (S = null))
                : ((h = null), (S = i)),
              h !== S)
            ) {
              if (
                ((x = $m),
                (L = 'onMouseLeave'),
                (g = 'onMouseEnter'),
                (d = 'mouse'),
                (e === 'pointerout' || e === 'pointerover') &&
                  ((x = tp), (L = 'onPointerLeave'), (g = 'onPointerEnter'), (d = 'pointer')),
                (y = h == null ? m : Xn(h)),
                (f = S == null ? m : Xn(S)),
                (m = new x(L, d + 'leave', h, a, c)),
                (m.target = y),
                (m.relatedTarget = f),
                (L = null),
                Po(c) === i &&
                  ((x = new x(g, d + 'enter', S, a, c)),
                  (x.target = f),
                  (x.relatedTarget = y),
                  (L = x)),
                (y = L),
                h && S)
              )
                t: {
                  for (x = Jb, g = h, d = S, f = 0, L = g; L; L = x(L)) f++;
                  L = 0;
                  for (var v = d; v; v = x(v)) L++;
                  for (; 0 < f - L;) ((g = x(g)), f--);
                  for (; 0 < L - f;) ((d = x(d)), L--);
                  for (; f--;) {
                    if (g === d || (d !== null && g === d.alternate)) {
                      x = g;
                      break t;
                    }
                    ((g = x(g)), (d = x(d)));
                  }
                  x = null;
                }
              else x = null;
              (h !== null && Yp(p, m, h, x, !1), S !== null && y !== null && Yp(p, y, S, x, !0));
            }
          }
          e: {
            if (
              ((m = i ? Xn(i) : window),
              (h = m.nodeName && m.nodeName.toLowerCase()),
              h === 'select' || (h === 'input' && m.type === 'file'))
            )
              var I = np;
            else if (op(m))
              if (Fh) I = cb;
              else {
                I = ib;
                var C = sb;
              }
            else
              ((h = m.nodeName),
                !h || h.toLowerCase() !== 'input' || (m.type !== 'checkbox' && m.type !== 'radio')
                  ? i && xc(i.elementType) && (I = np)
                  : (I = fb));
            if (I && (I = I(e, i))) {
              qh(p, I, a, c);
              break e;
            }
            (C && C(e, m, i),
              e === 'focusout' &&
                i &&
                m.type === 'number' &&
                i.memoizedProps.value != null &&
                Af(m, 'number', m.value));
          }
          switch (((C = i ? Xn(i) : window), e)) {
            case 'focusin':
              (op(C) || C.contentEditable === 'true') && ((Ho = C), (Mf = i), (Qn = null));
              break;
            case 'focusout':
              Qn = Mf = Ho = null;
              break;
            case 'mousedown':
              Df = !0;
              break;
            case 'contextmenu':
            case 'mouseup':
            case 'dragend':
              ((Df = !1), ip(p, a, c));
              break;
            case 'selectionchange':
              if (mb) break;
            case 'keydown':
            case 'keyup':
              ip(p, a, c);
          }
          var b;
          if (yc)
            e: {
              switch (e) {
                case 'compositionstart':
                  var A = 'onCompositionStart';
                  break e;
                case 'compositionend':
                  A = 'onCompositionEnd';
                  break e;
                case 'compositionupdate':
                  A = 'onCompositionUpdate';
                  break e;
              }
              A = void 0;
            }
          else
            _o
              ? zh(e, a) && (A = 'onCompositionEnd')
              : e === 'keydown' && a.keyCode === 229 && (A = 'onCompositionStart');
          (A &&
            (Hh &&
              a.locale !== 'ko' &&
              (_o || A !== 'onCompositionStart'
                ? A === 'onCompositionEnd' && _o && (b = _h())
                : ((rl = c), (Sc = 'value' in rl ? rl.value : rl.textContent), (_o = !0))),
            (C = es(i, A)),
            0 < C.length &&
              ((A = new ep(A, e, null, a, c)),
              p.push({ event: A, listeners: C }),
              b ? (A.data = b) : ((b = Uh(a)), b !== null && (A.data = b)))),
            (b = lb ? ob(e, a) : nb(e, a)) &&
              ((A = es(i, 'onBeforeInput')),
              0 < A.length &&
                ((C = new ep('onBeforeInput', 'beforeinput', null, a, c)),
                p.push({ event: C, listeners: A }),
                (C.data = b))),
            Qb(p, e, i, a, c));
        }
        Nx(p, t);
      });
    }
    function xu(e, t, a) {
      return { instance: e, listener: t, currentTarget: a };
    }
    function es(e, t) {
      for (var a = t + 'Capture', l = []; e !== null;) {
        var o = e,
          n = o.stateNode;
        if (
          ((o = o.tag),
          (o !== 5 && o !== 26 && o !== 27) ||
            n === null ||
            ((o = su(e, a)),
            o != null && l.unshift(xu(e, o, n)),
            (o = su(e, t)),
            o != null && l.push(xu(e, o, n))),
          e.tag === 3)
        )
          return l;
        e = e.return;
      }
      return [];
    }
    function Jb(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Yp(e, t, a, l, o) {
      for (var n = t._reactName, u = []; a !== null && a !== l;) {
        var r = a,
          s = r.alternate,
          i = r.stateNode;
        if (((r = r.tag), s !== null && s === l)) break;
        ((r !== 5 && r !== 26 && r !== 27) ||
          i === null ||
          ((s = i),
          o
            ? ((i = su(a, n)), i != null && u.unshift(xu(a, i, s)))
            : o || ((i = su(a, n)), i != null && u.push(xu(a, i, s)))),
          (a = a.return));
      }
      u.length !== 0 && e.push({ event: t, listeners: u });
    }
    var $b = /\r\n?/g,
      eI = /\u0000|\uFFFD/g;
    function Kp(e) {
      return (typeof e == 'string' ? e : '' + e)
        .replace(
          $b,
          `
`,
        )
        .replace(eI, '');
    }
    function Hx(e, t) {
      return ((t = Kp(t)), Kp(e) === t);
    }
    function ce(e, t, a, l, o, n) {
      switch (a) {
        case 'children':
          typeof l == 'string'
            ? t === 'body' || (t === 'textarea' && l === '') || en(e, l)
            : (typeof l == 'number' || typeof l == 'bigint') && t !== 'body' && en(e, '' + l);
          break;
        case 'className':
          lr(e, 'class', l);
          break;
        case 'tabIndex':
          lr(e, 'tabindex', l);
          break;
        case 'dir':
        case 'role':
        case 'viewBox':
        case 'width':
        case 'height':
          lr(e, a, l);
          break;
        case 'style':
          Ph(e, l, n);
          break;
        case 'data':
          if (t !== 'object') {
            lr(e, 'data', l);
            break;
          }
        case 'src':
        case 'href':
          if (l === '' && (t !== 'a' || a !== 'href')) {
            e.removeAttribute(a);
            break;
          }
          if (
            l == null ||
            typeof l == 'function' ||
            typeof l == 'symbol' ||
            typeof l == 'boolean'
          ) {
            e.removeAttribute(a);
            break;
          }
          ((l = Lr('' + l)), e.setAttribute(a, l));
          break;
        case 'action':
        case 'formAction':
          if (typeof l == 'function') {
            e.setAttribute(
              a,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
            );
            break;
          } else
            typeof n == 'function' &&
              (a === 'formAction'
                ? (t !== 'input' && ce(e, t, 'name', o.name, o, null),
                  ce(e, t, 'formEncType', o.formEncType, o, null),
                  ce(e, t, 'formMethod', o.formMethod, o, null),
                  ce(e, t, 'formTarget', o.formTarget, o, null))
                : (ce(e, t, 'encType', o.encType, o, null),
                  ce(e, t, 'method', o.method, o, null),
                  ce(e, t, 'target', o.target, o, null)));
          if (l == null || typeof l == 'symbol' || typeof l == 'boolean') {
            e.removeAttribute(a);
            break;
          }
          ((l = Lr('' + l)), e.setAttribute(a, l));
          break;
        case 'onClick':
          l != null && (e.onclick = Na);
          break;
        case 'onScroll':
          l != null && Z('scroll', e);
          break;
        case 'onScrollEnd':
          l != null && Z('scrollend', e);
          break;
        case 'dangerouslySetInnerHTML':
          if (l != null) {
            if (typeof l != 'object' || !('__html' in l)) throw Error(w(61));
            if (((a = l.__html), a != null)) {
              if (o.children != null) throw Error(w(60));
              e.innerHTML = a;
            }
          }
          break;
        case 'multiple':
          e.multiple = l && typeof l != 'function' && typeof l != 'symbol';
          break;
        case 'muted':
          e.muted = l && typeof l != 'function' && typeof l != 'symbol';
          break;
        case 'suppressContentEditableWarning':
        case 'suppressHydrationWarning':
        case 'defaultValue':
        case 'defaultChecked':
        case 'innerHTML':
        case 'ref':
          break;
        case 'autoFocus':
          break;
        case 'xlinkHref':
          if (
            l == null ||
            typeof l == 'function' ||
            typeof l == 'boolean' ||
            typeof l == 'symbol'
          ) {
            e.removeAttribute('xlink:href');
            break;
          }
          ((a = Lr('' + l)), e.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', a));
          break;
        case 'contentEditable':
        case 'spellCheck':
        case 'draggable':
        case 'value':
        case 'autoReverse':
        case 'externalResourcesRequired':
        case 'focusable':
        case 'preserveAlpha':
          l != null && typeof l != 'function' && typeof l != 'symbol'
            ? e.setAttribute(a, '' + l)
            : e.removeAttribute(a);
          break;
        case 'inert':
        case 'allowFullScreen':
        case 'async':
        case 'autoPlay':
        case 'controls':
        case 'default':
        case 'defer':
        case 'disabled':
        case 'disablePictureInPicture':
        case 'disableRemotePlayback':
        case 'formNoValidate':
        case 'hidden':
        case 'loop':
        case 'noModule':
        case 'noValidate':
        case 'open':
        case 'playsInline':
        case 'readOnly':
        case 'required':
        case 'reversed':
        case 'scoped':
        case 'seamless':
        case 'itemScope':
          l && typeof l != 'function' && typeof l != 'symbol'
            ? e.setAttribute(a, '')
            : e.removeAttribute(a);
          break;
        case 'capture':
        case 'download':
          l === !0
            ? e.setAttribute(a, '')
            : l !== !1 && l != null && typeof l != 'function' && typeof l != 'symbol'
              ? e.setAttribute(a, l)
              : e.removeAttribute(a);
          break;
        case 'cols':
        case 'rows':
        case 'size':
        case 'span':
          l != null && typeof l != 'function' && typeof l != 'symbol' && !isNaN(l) && 1 <= l
            ? e.setAttribute(a, l)
            : e.removeAttribute(a);
          break;
        case 'rowSpan':
        case 'start':
          l == null || typeof l == 'function' || typeof l == 'symbol' || isNaN(l)
            ? e.removeAttribute(a)
            : e.setAttribute(a, l);
          break;
        case 'popover':
          (Z('beforetoggle', e), Z('toggle', e), xr(e, 'popover', l));
          break;
        case 'xlinkActuate':
          Ta(e, 'http://www.w3.org/1999/xlink', 'xlink:actuate', l);
          break;
        case 'xlinkArcrole':
          Ta(e, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', l);
          break;
        case 'xlinkRole':
          Ta(e, 'http://www.w3.org/1999/xlink', 'xlink:role', l);
          break;
        case 'xlinkShow':
          Ta(e, 'http://www.w3.org/1999/xlink', 'xlink:show', l);
          break;
        case 'xlinkTitle':
          Ta(e, 'http://www.w3.org/1999/xlink', 'xlink:title', l);
          break;
        case 'xlinkType':
          Ta(e, 'http://www.w3.org/1999/xlink', 'xlink:type', l);
          break;
        case 'xmlBase':
          Ta(e, 'http://www.w3.org/XML/1998/namespace', 'xml:base', l);
          break;
        case 'xmlLang':
          Ta(e, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', l);
          break;
        case 'xmlSpace':
          Ta(e, 'http://www.w3.org/XML/1998/namespace', 'xml:space', l);
          break;
        case 'is':
          xr(e, 'is', l);
          break;
        case 'innerText':
        case 'textContent':
          break;
        default:
          (!(2 < a.length) || (a[0] !== 'o' && a[0] !== 'O') || (a[1] !== 'n' && a[1] !== 'N')) &&
            ((a = MC.get(a) || a), xr(e, a, l));
      }
    }
    function tc(e, t, a, l, o, n) {
      switch (a) {
        case 'style':
          Ph(e, l, n);
          break;
        case 'dangerouslySetInnerHTML':
          if (l != null) {
            if (typeof l != 'object' || !('__html' in l)) throw Error(w(61));
            if (((a = l.__html), a != null)) {
              if (o.children != null) throw Error(w(60));
              e.innerHTML = a;
            }
          }
          break;
        case 'children':
          typeof l == 'string'
            ? en(e, l)
            : (typeof l == 'number' || typeof l == 'bigint') && en(e, '' + l);
          break;
        case 'onScroll':
          l != null && Z('scroll', e);
          break;
        case 'onScrollEnd':
          l != null && Z('scrollend', e);
          break;
        case 'onClick':
          l != null && (e.onclick = Na);
          break;
        case 'suppressContentEditableWarning':
        case 'suppressHydrationWarning':
        case 'innerHTML':
        case 'ref':
          break;
        case 'innerText':
        case 'textContent':
          break;
        default:
          if (!kh.hasOwnProperty(a))
            e: {
              if (
                a[0] === 'o' &&
                a[1] === 'n' &&
                ((o = a.endsWith('Capture')),
                (t = a.slice(2, o ? a.length - 7 : void 0)),
                (n = e[vt] || null),
                (n = n != null ? n[a] : null),
                typeof n == 'function' && e.removeEventListener(t, n, o),
                typeof l == 'function')
              ) {
                (typeof n != 'function' &&
                  n !== null &&
                  (a in e ? (e[a] = null) : e.hasAttribute(a) && e.removeAttribute(a)),
                  e.addEventListener(t, l, o));
                break e;
              }
              a in e ? (e[a] = l) : l === !0 ? e.setAttribute(a, '') : xr(e, a, l);
            }
      }
    }
    function et(e, t, a) {
      switch (t) {
        case 'div':
        case 'span':
        case 'svg':
        case 'path':
        case 'a':
        case 'g':
        case 'p':
        case 'li':
          break;
        case 'img':
          (Z('error', e), Z('load', e));
          var l = !1,
            o = !1,
            n;
          for (n in a)
            if (a.hasOwnProperty(n)) {
              var u = a[n];
              if (u != null)
                switch (n) {
                  case 'src':
                    l = !0;
                    break;
                  case 'srcSet':
                    o = !0;
                    break;
                  case 'children':
                  case 'dangerouslySetInnerHTML':
                    throw Error(w(137, t));
                  default:
                    ce(e, t, n, u, a, null);
                }
            }
          (o && ce(e, t, 'srcSet', a.srcSet, a, null), l && ce(e, t, 'src', a.src, a, null));
          return;
        case 'input':
          Z('invalid', e);
          var r = (n = u = o = null),
            s = null,
            i = null;
          for (l in a)
            if (a.hasOwnProperty(l)) {
              var c = a[l];
              if (c != null)
                switch (l) {
                  case 'name':
                    o = c;
                    break;
                  case 'type':
                    u = c;
                    break;
                  case 'checked':
                    s = c;
                    break;
                  case 'defaultChecked':
                    i = c;
                    break;
                  case 'value':
                    n = c;
                    break;
                  case 'defaultValue':
                    r = c;
                    break;
                  case 'children':
                  case 'dangerouslySetInnerHTML':
                    if (c != null) throw Error(w(137, t));
                    break;
                  default:
                    ce(e, t, l, c, a, null);
                }
            }
          Eh(e, n, r, s, i, u, o, !1);
          return;
        case 'select':
          (Z('invalid', e), (l = u = n = null));
          for (o in a)
            if (a.hasOwnProperty(o) && ((r = a[o]), r != null))
              switch (o) {
                case 'value':
                  n = r;
                  break;
                case 'defaultValue':
                  u = r;
                  break;
                case 'multiple':
                  l = r;
                default:
                  ce(e, t, o, r, a, null);
              }
          ((t = n),
            (a = u),
            (e.multiple = !!l),
            t != null ? jo(e, !!l, t, !1) : a != null && jo(e, !!l, a, !0));
          return;
        case 'textarea':
          (Z('invalid', e), (n = o = l = null));
          for (u in a)
            if (a.hasOwnProperty(u) && ((r = a[u]), r != null))
              switch (u) {
                case 'value':
                  l = r;
                  break;
                case 'defaultValue':
                  o = r;
                  break;
                case 'children':
                  n = r;
                  break;
                case 'dangerouslySetInnerHTML':
                  if (r != null) throw Error(w(91));
                  break;
                default:
                  ce(e, t, u, r, a, null);
              }
          Bh(e, l, o, n);
          return;
        case 'option':
          for (s in a)
            a.hasOwnProperty(s) &&
              ((l = a[s]), l != null) &&
              (s === 'selected'
                ? (e.selected = l && typeof l != 'function' && typeof l != 'symbol')
                : ce(e, t, s, l, a, null));
          return;
        case 'dialog':
          (Z('beforetoggle', e), Z('toggle', e), Z('cancel', e), Z('close', e));
          break;
        case 'iframe':
        case 'object':
          Z('load', e);
          break;
        case 'video':
        case 'audio':
          for (l = 0; l < gu.length; l++) Z(gu[l], e);
          break;
        case 'image':
          (Z('error', e), Z('load', e));
          break;
        case 'details':
          Z('toggle', e);
          break;
        case 'embed':
        case 'source':
        case 'link':
          (Z('error', e), Z('load', e));
        case 'area':
        case 'base':
        case 'br':
        case 'col':
        case 'hr':
        case 'keygen':
        case 'meta':
        case 'param':
        case 'track':
        case 'wbr':
        case 'menuitem':
          for (i in a)
            if (a.hasOwnProperty(i) && ((l = a[i]), l != null))
              switch (i) {
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(w(137, t));
                default:
                  ce(e, t, i, l, a, null);
              }
          return;
        default:
          if (xc(t)) {
            for (c in a)
              a.hasOwnProperty(c) && ((l = a[c]), l !== void 0 && tc(e, t, c, l, a, void 0));
            return;
          }
      }
      for (r in a) a.hasOwnProperty(r) && ((l = a[r]), l != null && ce(e, t, r, l, a, null));
    }
    function tI(e, t, a, l) {
      switch (t) {
        case 'div':
        case 'span':
        case 'svg':
        case 'path':
        case 'a':
        case 'g':
        case 'p':
        case 'li':
          break;
        case 'input':
          var o = null,
            n = null,
            u = null,
            r = null,
            s = null,
            i = null,
            c = null;
          for (h in a) {
            var p = a[h];
            if (a.hasOwnProperty(h) && p != null)
              switch (h) {
                case 'checked':
                  break;
                case 'value':
                  break;
                case 'defaultValue':
                  s = p;
                default:
                  l.hasOwnProperty(h) || ce(e, t, h, null, l, p);
              }
          }
          for (var m in l) {
            var h = l[m];
            if (((p = a[m]), l.hasOwnProperty(m) && (h != null || p != null)))
              switch (m) {
                case 'type':
                  n = h;
                  break;
                case 'name':
                  o = h;
                  break;
                case 'checked':
                  i = h;
                  break;
                case 'defaultChecked':
                  c = h;
                  break;
                case 'value':
                  u = h;
                  break;
                case 'defaultValue':
                  r = h;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (h != null) throw Error(w(137, t));
                  break;
                default:
                  h !== p && ce(e, t, m, h, l, p);
              }
          }
          Rf(e, u, r, s, i, c, n, o);
          return;
        case 'select':
          h = u = r = m = null;
          for (n in a)
            if (((s = a[n]), a.hasOwnProperty(n) && s != null))
              switch (n) {
                case 'value':
                  break;
                case 'multiple':
                  h = s;
                default:
                  l.hasOwnProperty(n) || ce(e, t, n, null, l, s);
              }
          for (o in l)
            if (((n = l[o]), (s = a[o]), l.hasOwnProperty(o) && (n != null || s != null)))
              switch (o) {
                case 'value':
                  m = n;
                  break;
                case 'defaultValue':
                  r = n;
                  break;
                case 'multiple':
                  u = n;
                default:
                  n !== s && ce(e, t, o, n, l, s);
              }
          ((t = r),
            (a = u),
            (l = h),
            m != null
              ? jo(e, !!a, m, !1)
              : !!l != !!a && (t != null ? jo(e, !!a, t, !0) : jo(e, !!a, a ? [] : '', !1)));
          return;
        case 'textarea':
          h = m = null;
          for (r in a)
            if (((o = a[r]), a.hasOwnProperty(r) && o != null && !l.hasOwnProperty(r)))
              switch (r) {
                case 'value':
                  break;
                case 'children':
                  break;
                default:
                  ce(e, t, r, null, l, o);
              }
          for (u in l)
            if (((o = l[u]), (n = a[u]), l.hasOwnProperty(u) && (o != null || n != null)))
              switch (u) {
                case 'value':
                  m = o;
                  break;
                case 'defaultValue':
                  h = o;
                  break;
                case 'children':
                  break;
                case 'dangerouslySetInnerHTML':
                  if (o != null) throw Error(w(91));
                  break;
                default:
                  o !== n && ce(e, t, u, o, l, n);
              }
          Oh(e, m, h);
          return;
        case 'option':
          for (var S in a)
            ((m = a[S]),
              a.hasOwnProperty(S) &&
                m != null &&
                !l.hasOwnProperty(S) &&
                (S === 'selected' ? (e.selected = !1) : ce(e, t, S, null, l, m)));
          for (s in l)
            ((m = l[s]),
              (h = a[s]),
              l.hasOwnProperty(s) &&
                m !== h &&
                (m != null || h != null) &&
                (s === 'selected'
                  ? (e.selected = m && typeof m != 'function' && typeof m != 'symbol')
                  : ce(e, t, s, m, l, h)));
          return;
        case 'img':
        case 'link':
        case 'area':
        case 'base':
        case 'br':
        case 'col':
        case 'embed':
        case 'hr':
        case 'keygen':
        case 'meta':
        case 'param':
        case 'source':
        case 'track':
        case 'wbr':
        case 'menuitem':
          for (var x in a)
            ((m = a[x]),
              a.hasOwnProperty(x) && m != null && !l.hasOwnProperty(x) && ce(e, t, x, null, l, m));
          for (i in l)
            if (
              ((m = l[i]), (h = a[i]), l.hasOwnProperty(i) && m !== h && (m != null || h != null))
            )
              switch (i) {
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (m != null) throw Error(w(137, t));
                  break;
                default:
                  ce(e, t, i, m, l, h);
              }
          return;
        default:
          if (xc(t)) {
            for (var y in a)
              ((m = a[y]),
                a.hasOwnProperty(y) &&
                  m !== void 0 &&
                  !l.hasOwnProperty(y) &&
                  tc(e, t, y, void 0, l, m));
            for (c in l)
              ((m = l[c]),
                (h = a[c]),
                !l.hasOwnProperty(c) ||
                  m === h ||
                  (m === void 0 && h === void 0) ||
                  tc(e, t, c, m, l, h));
            return;
          }
      }
      for (var g in a)
        ((m = a[g]),
          a.hasOwnProperty(g) && m != null && !l.hasOwnProperty(g) && ce(e, t, g, null, l, m));
      for (p in l)
        ((m = l[p]),
          (h = a[p]),
          !l.hasOwnProperty(p) || m === h || (m == null && h == null) || ce(e, t, p, m, l, h));
    }
    function Zp(e) {
      switch (e) {
        case 'css':
        case 'script':
        case 'font':
        case 'img':
        case 'image':
        case 'input':
        case 'link':
          return !0;
        default:
          return !1;
      }
    }
    function aI() {
      if (typeof performance.getEntriesByType == 'function') {
        for (
          var e = 0, t = 0, a = performance.getEntriesByType('resource'), l = 0;
          l < a.length;
          l++
        ) {
          var o = a[l],
            n = o.transferSize,
            u = o.initiatorType,
            r = o.duration;
          if (n && r && Zp(u)) {
            for (u = 0, r = o.responseEnd, l += 1; l < a.length; l++) {
              var s = a[l],
                i = s.startTime;
              if (i > r) break;
              var c = s.transferSize,
                p = s.initiatorType;
              c && Zp(p) && ((s = s.responseEnd), (u += c * (s < r ? 1 : (r - i) / (s - i))));
            }
            if ((--l, (t += (8 * (n + u)) / (o.duration / 1e3)), e++, 10 < e)) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && ((e = navigator.connection.downlink), typeof e == 'number')
        ? e
        : 5;
    }
    var ac = null,
      lc = null;
    function ts(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Qp(e) {
      switch (e) {
        case 'http://www.w3.org/2000/svg':
          return 1;
        case 'http://www.w3.org/1998/Math/MathML':
          return 2;
        default:
          return 0;
      }
    }
    function zx(e, t) {
      if (e === 0)
        switch (t) {
          case 'svg':
            return 1;
          case 'math':
            return 2;
          default:
            return 0;
        }
      return e === 1 && t === 'foreignObject' ? 0 : e;
    }
    function oc(e, t) {
      return (
        e === 'textarea' ||
        e === 'noscript' ||
        typeof t.children == 'string' ||
        typeof t.children == 'number' ||
        typeof t.children == 'bigint' ||
        (typeof t.dangerouslySetInnerHTML == 'object' &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var pf = null;
    function lI() {
      var e = window.event;
      return e && e.type === 'popstate' ? (e === pf ? !1 : ((pf = e), !0)) : ((pf = null), !1);
    }
    var Ux = typeof setTimeout == 'function' ? setTimeout : void 0,
      oI = typeof clearTimeout == 'function' ? clearTimeout : void 0,
      Wp = typeof Promise == 'function' ? Promise : void 0,
      nI =
        typeof queueMicrotask == 'function'
          ? queueMicrotask
          : typeof Wp < 'u'
            ? function (e) {
                return Wp.resolve(null).then(e).catch(uI);
              }
            : Ux;
    function uI(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function wl(e) {
      return e === 'head';
    }
    function Jp(e, t) {
      var a = t,
        l = 0;
      do {
        var o = a.nextSibling;
        if ((e.removeChild(a), o && o.nodeType === 8))
          if (((a = o.data), a === '/$' || a === '/&')) {
            if (l === 0) {
              (e.removeChild(o), sn(t));
              return;
            }
            l--;
          } else if (a === '$' || a === '$?' || a === '$~' || a === '$!' || a === '&') l++;
          else if (a === 'html') uu(e.ownerDocument.documentElement);
          else if (a === 'head') {
            ((a = e.ownerDocument.head), uu(a));
            for (var n = a.firstChild; n;) {
              var u = n.nextSibling,
                r = n.nodeName;
              (n[wu] ||
                r === 'SCRIPT' ||
                r === 'STYLE' ||
                (r === 'LINK' && n.rel.toLowerCase() === 'stylesheet') ||
                a.removeChild(n),
                (n = u));
            }
          } else a === 'body' && uu(e.ownerDocument.body);
        a = o;
      } while (a);
      sn(t);
    }
    function $p(e, t) {
      var a = e;
      e = 0;
      do {
        var l = a.nextSibling;
        if (
          (a.nodeType === 1
            ? t
              ? ((a._stashedDisplay = a.style.display), (a.style.display = 'none'))
              : ((a.style.display = a._stashedDisplay || ''),
                a.getAttribute('style') === '' && a.removeAttribute('style'))
            : a.nodeType === 3 &&
              (t
                ? ((a._stashedText = a.nodeValue), (a.nodeValue = ''))
                : (a.nodeValue = a._stashedText || '')),
          l && l.nodeType === 8)
        )
          if (((a = l.data), a === '/$')) {
            if (e === 0) break;
            e--;
          } else (a !== '$' && a !== '$?' && a !== '$~' && a !== '$!') || e++;
        a = l;
      } while (a);
    }
    function nc(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
        var a = t;
        switch (((t = t.nextSibling), a.nodeName)) {
          case 'HTML':
          case 'HEAD':
          case 'BODY':
            (nc(a), gc(a));
            continue;
          case 'SCRIPT':
          case 'STYLE':
            continue;
          case 'LINK':
            if (a.rel.toLowerCase() === 'stylesheet') continue;
        }
        e.removeChild(a);
      }
    }
    function rI(e, t, a, l) {
      for (; e.nodeType === 1;) {
        var o = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!l && (e.nodeName !== 'INPUT' || e.type !== 'hidden')) break;
        } else if (l) {
          if (!e[wu])
            switch (t) {
              case 'meta':
                if (!e.hasAttribute('itemprop')) break;
                return e;
              case 'link':
                if (
                  ((n = e.getAttribute('rel')),
                  n === 'stylesheet' && e.hasAttribute('data-precedence'))
                )
                  break;
                if (
                  n !== o.rel ||
                  e.getAttribute('href') !== (o.href == null || o.href === '' ? null : o.href) ||
                  e.getAttribute('crossorigin') !==
                    (o.crossOrigin == null ? null : o.crossOrigin) ||
                  e.getAttribute('title') !== (o.title == null ? null : o.title)
                )
                  break;
                return e;
              case 'style':
                if (e.hasAttribute('data-precedence')) break;
                return e;
              case 'script':
                if (
                  ((n = e.getAttribute('src')),
                  (n !== (o.src == null ? null : o.src) ||
                    e.getAttribute('type') !== (o.type == null ? null : o.type) ||
                    e.getAttribute('crossorigin') !==
                      (o.crossOrigin == null ? null : o.crossOrigin)) &&
                    n &&
                    e.hasAttribute('async') &&
                    !e.hasAttribute('itemprop'))
                )
                  break;
                return e;
              default:
                return e;
            }
        } else if (t === 'input' && e.type === 'hidden') {
          var n = o.name == null ? null : '' + o.name;
          if (o.type === 'hidden' && e.getAttribute('name') === n) return e;
        } else return e;
        if (((e = Kt(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function sI(e, t, a) {
      if (t === '') return null;
      for (; e.nodeType !== 3;)
        if (
          ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !a) ||
          ((e = Kt(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function qx(e, t) {
      for (; e.nodeType !== 8;)
        if (
          ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !t) ||
          ((e = Kt(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function uc(e) {
      return e.data === '$?' || e.data === '$~';
    }
    function rc(e) {
      return e.data === '$!' || (e.data === '$?' && e.ownerDocument.readyState !== 'loading');
    }
    function iI(e, t) {
      var a = e.ownerDocument;
      if (e.data === '$~') e._reactRetry = t;
      else if (e.data !== '$?' || a.readyState !== 'loading') t();
      else {
        var l = function () {
          (t(), a.removeEventListener('DOMContentLoaded', l));
        };
        (a.addEventListener('DOMContentLoaded', l), (e._reactRetry = l));
      }
    }
    function Kt(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (
            ((t = e.data),
            t === '$' ||
              t === '$!' ||
              t === '$?' ||
              t === '$~' ||
              t === '&' ||
              t === 'F!' ||
              t === 'F')
          )
            break;
          if (t === '/$' || t === '/&') return null;
        }
      }
      return e;
    }
    var sc = null;
    function eh(e) {
      e = e.nextSibling;
      for (var t = 0; e;) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === '/$' || a === '/&') {
            if (t === 0) return Kt(e.nextSibling);
            t--;
          } else (a !== '$' && a !== '$!' && a !== '$?' && a !== '$~' && a !== '&') || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function th(e) {
      e = e.previousSibling;
      for (var t = 0; e;) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === '$' || a === '$!' || a === '$?' || a === '$~' || a === '&') {
            if (t === 0) return e;
            t--;
          } else (a !== '/$' && a !== '/&') || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function Fx(e, t, a) {
      switch (((t = ts(a)), e)) {
        case 'html':
          if (((e = t.documentElement), !e)) throw Error(w(452));
          return e;
        case 'head':
          if (((e = t.head), !e)) throw Error(w(453));
          return e;
        case 'body':
          if (((e = t.body), !e)) throw Error(w(454));
          return e;
        default:
          throw Error(w(451));
      }
    }
    function uu(e) {
      for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
      gc(e);
    }
    var Zt = new Map(),
      ah = new Set();
    function as(e) {
      return typeof e.getRootNode == 'function'
        ? e.getRootNode()
        : e.nodeType === 9
          ? e
          : e.ownerDocument;
    }
    var ja = ne.d;
    ne.d = { f: fI, r: cI, D: dI, C: mI, L: pI, m: hI, X: xI, S: gI, M: LI };
    function fI() {
      var e = ja.f(),
        t = Ss();
      return e || t;
    }
    function cI(e) {
      var t = cn(e);
      t !== null && t.tag === 5 && t.type === 'form' ? Pg(t) : ja.r(e);
    }
    var hn = typeof document > 'u' ? null : document;
    function Gx(e, t, a) {
      var l = hn;
      if (l && typeof t == 'string' && t) {
        var o = Vt(t);
        ((o = 'link[rel="' + e + '"][href="' + o + '"]'),
          typeof a == 'string' && (o += '[crossorigin="' + a + '"]'),
          ah.has(o) ||
            (ah.add(o),
            (e = { rel: e, crossOrigin: a, href: t }),
            l.querySelector(o) === null &&
              ((t = l.createElement('link')), et(t, 'link', e), Ye(t), l.head.appendChild(t))));
      }
    }
    function dI(e) {
      (ja.D(e), Gx('dns-prefetch', e, null));
    }
    function mI(e, t) {
      (ja.C(e, t), Gx('preconnect', e, t));
    }
    function pI(e, t, a) {
      ja.L(e, t, a);
      var l = hn;
      if (l && e && t) {
        var o = 'link[rel="preload"][as="' + Vt(t) + '"]';
        t === 'image' && a && a.imageSrcSet
          ? ((o += '[imagesrcset="' + Vt(a.imageSrcSet) + '"]'),
            typeof a.imageSizes == 'string' && (o += '[imagesizes="' + Vt(a.imageSizes) + '"]'))
          : (o += '[href="' + Vt(e) + '"]');
        var n = o;
        switch (t) {
          case 'style':
            n = rn(e);
            break;
          case 'script':
            n = gn(e);
        }
        Zt.has(n) ||
          ((e = Ce(
            { rel: 'preload', href: t === 'image' && a && a.imageSrcSet ? void 0 : e, as: t },
            a,
          )),
          Zt.set(n, e),
          l.querySelector(o) !== null ||
            (t === 'style' && l.querySelector(Du(n))) ||
            (t === 'script' && l.querySelector(Eu(n))) ||
            ((t = l.createElement('link')), et(t, 'link', e), Ye(t), l.head.appendChild(t)));
      }
    }
    function hI(e, t) {
      ja.m(e, t);
      var a = hn;
      if (a && e) {
        var l = t && typeof t.as == 'string' ? t.as : 'script',
          o = 'link[rel="modulepreload"][as="' + Vt(l) + '"][href="' + Vt(e) + '"]',
          n = o;
        switch (l) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            n = gn(e);
        }
        if (
          !Zt.has(n) &&
          ((e = Ce({ rel: 'modulepreload', href: e }, t)),
          Zt.set(n, e),
          a.querySelector(o) === null)
        ) {
          switch (l) {
            case 'audioworklet':
            case 'paintworklet':
            case 'serviceworker':
            case 'sharedworker':
            case 'worker':
            case 'script':
              if (a.querySelector(Eu(n))) return;
          }
          ((l = a.createElement('link')), et(l, 'link', e), Ye(l), a.head.appendChild(l));
        }
      }
    }
    function gI(e, t, a) {
      ja.S(e, t, a);
      var l = hn;
      if (l && e) {
        var o = Xo(l).hoistableStyles,
          n = rn(e);
        t = t || 'default';
        var u = o.get(n);
        if (!u) {
          var r = { loading: 0, preload: null };
          if ((u = l.querySelector(Du(n)))) r.loading = 5;
          else {
            ((e = Ce({ rel: 'stylesheet', href: e, 'data-precedence': t }, a)),
              (a = Zt.get(n)) && td(e, a));
            var s = (u = l.createElement('link'));
            (Ye(s),
              et(s, 'link', e),
              (s._p = new Promise(function (i, c) {
                ((s.onload = i), (s.onerror = c));
              })),
              s.addEventListener('load', function () {
                r.loading |= 1;
              }),
              s.addEventListener('error', function () {
                r.loading |= 2;
              }),
              (r.loading |= 4),
              Tr(u, t, l));
          }
          ((u = { type: 'stylesheet', instance: u, count: 1, state: r }), o.set(n, u));
        }
      }
    }
    function xI(e, t) {
      ja.X(e, t);
      var a = hn;
      if (a && e) {
        var l = Xo(a).hoistableScripts,
          o = gn(e),
          n = l.get(o);
        n ||
          ((n = a.querySelector(Eu(o))),
          n ||
            ((e = Ce({ src: e, async: !0 }, t)),
            (t = Zt.get(o)) && ad(e, t),
            (n = a.createElement('script')),
            Ye(n),
            et(n, 'link', e),
            a.head.appendChild(n)),
          (n = { type: 'script', instance: n, count: 1, state: null }),
          l.set(o, n));
      }
    }
    function LI(e, t) {
      ja.M(e, t);
      var a = hn;
      if (a && e) {
        var l = Xo(a).hoistableScripts,
          o = gn(e),
          n = l.get(o);
        n ||
          ((n = a.querySelector(Eu(o))),
          n ||
            ((e = Ce({ src: e, async: !0, type: 'module' }, t)),
            (t = Zt.get(o)) && ad(e, t),
            (n = a.createElement('script')),
            Ye(n),
            et(n, 'link', e),
            a.head.appendChild(n)),
          (n = { type: 'script', instance: n, count: 1, state: null }),
          l.set(o, n));
      }
    }
    function lh(e, t, a, l) {
      var o = (o = cl.current) ? as(o) : null;
      if (!o) throw Error(w(446));
      switch (e) {
        case 'meta':
        case 'title':
          return null;
        case 'style':
          return typeof a.precedence == 'string' && typeof a.href == 'string'
            ? ((t = rn(a.href)),
              (a = Xo(o).hoistableStyles),
              (l = a.get(t)),
              l || ((l = { type: 'style', instance: null, count: 0, state: null }), a.set(t, l)),
              l)
            : { type: 'void', instance: null, count: 0, state: null };
        case 'link':
          if (
            a.rel === 'stylesheet' &&
            typeof a.href == 'string' &&
            typeof a.precedence == 'string'
          ) {
            e = rn(a.href);
            var n = Xo(o).hoistableStyles,
              u = n.get(e);
            if (
              (u ||
                ((o = o.ownerDocument || o),
                (u = {
                  type: 'stylesheet',
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                n.set(e, u),
                (n = o.querySelector(Du(e))) && !n._p && ((u.instance = n), (u.state.loading = 5)),
                Zt.has(e) ||
                  ((a = {
                    rel: 'preload',
                    as: 'style',
                    href: a.href,
                    crossOrigin: a.crossOrigin,
                    integrity: a.integrity,
                    media: a.media,
                    hrefLang: a.hrefLang,
                    referrerPolicy: a.referrerPolicy,
                  }),
                  Zt.set(e, a),
                  n || SI(o, e, a, u.state))),
              t && l === null)
            )
              throw Error(w(528, ''));
            return u;
          }
          if (t && l !== null) throw Error(w(529, ''));
          return null;
        case 'script':
          return (
            (t = a.async),
            (a = a.src),
            typeof a == 'string' && t && typeof t != 'function' && typeof t != 'symbol'
              ? ((t = gn(a)),
                (a = Xo(o).hoistableScripts),
                (l = a.get(t)),
                l || ((l = { type: 'script', instance: null, count: 0, state: null }), a.set(t, l)),
                l)
              : { type: 'void', instance: null, count: 0, state: null }
          );
        default:
          throw Error(w(444, e));
      }
    }
    function rn(e) {
      return 'href="' + Vt(e) + '"';
    }
    function Du(e) {
      return 'link[rel="stylesheet"][' + e + ']';
    }
    function Vx(e) {
      return Ce({}, e, { 'data-precedence': e.precedence, precedence: null });
    }
    function SI(e, t, a, l) {
      e.querySelector('link[rel="preload"][as="style"][' + t + ']')
        ? (l.loading = 1)
        : ((t = e.createElement('link')),
          (l.preload = t),
          t.addEventListener('load', function () {
            return (l.loading |= 1);
          }),
          t.addEventListener('error', function () {
            return (l.loading |= 2);
          }),
          et(t, 'link', a),
          Ye(t),
          e.head.appendChild(t));
    }
    function gn(e) {
      return '[src="' + Vt(e) + '"]';
    }
    function Eu(e) {
      return 'script[async]' + e;
    }
    function oh(e, t, a) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case 'style':
            var l = e.querySelector('style[data-href~="' + Vt(a.href) + '"]');
            if (l) return ((t.instance = l), Ye(l), l);
            var o = Ce({}, a, {
              'data-href': a.href,
              'data-precedence': a.precedence,
              href: null,
              precedence: null,
            });
            return (
              (l = (e.ownerDocument || e).createElement('style')),
              Ye(l),
              et(l, 'style', o),
              Tr(l, a.precedence, e),
              (t.instance = l)
            );
          case 'stylesheet':
            o = rn(a.href);
            var n = e.querySelector(Du(o));
            if (n) return ((t.state.loading |= 4), (t.instance = n), Ye(n), n);
            ((l = Vx(a)),
              (o = Zt.get(o)) && td(l, o),
              (n = (e.ownerDocument || e).createElement('link')),
              Ye(n));
            var u = n;
            return (
              (u._p = new Promise(function (r, s) {
                ((u.onload = r), (u.onerror = s));
              })),
              et(n, 'link', l),
              (t.state.loading |= 4),
              Tr(n, a.precedence, e),
              (t.instance = n)
            );
          case 'script':
            return (
              (n = gn(a.src)),
              (o = e.querySelector(Eu(n)))
                ? ((t.instance = o), Ye(o), o)
                : ((l = a),
                  (o = Zt.get(n)) && ((l = Ce({}, a)), ad(l, o)),
                  (e = e.ownerDocument || e),
                  (o = e.createElement('script')),
                  Ye(o),
                  et(o, 'link', l),
                  e.head.appendChild(o),
                  (t.instance = o))
            );
          case 'void':
            return null;
          default:
            throw Error(w(443, t.type));
        }
      else
        t.type === 'stylesheet' &&
          (t.state.loading & 4) === 0 &&
          ((l = t.instance), (t.state.loading |= 4), Tr(l, a.precedence, e));
      return t.instance;
    }
    function Tr(e, t, a) {
      for (
        var l = a.querySelectorAll(
            'link[rel="stylesheet"][data-precedence],style[data-precedence]',
          ),
          o = l.length ? l[l.length - 1] : null,
          n = o,
          u = 0;
        u < l.length;
        u++
      ) {
        var r = l[u];
        if (r.dataset.precedence === t) n = r;
        else if (n !== o) break;
      }
      n
        ? n.parentNode.insertBefore(e, n.nextSibling)
        : ((t = a.nodeType === 9 ? a.head : a), t.insertBefore(e, t.firstChild));
    }
    function td(e, t) {
      (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
        e.title == null && (e.title = t.title));
    }
    function ad(e, t) {
      (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
        e.integrity == null && (e.integrity = t.integrity));
    }
    var kr = null;
    function nh(e, t, a) {
      if (kr === null) {
        var l = new Map(),
          o = (kr = new Map());
        o.set(a, l);
      } else ((o = kr), (l = o.get(a)), l || ((l = new Map()), o.set(a, l)));
      if (l.has(e)) return l;
      for (l.set(e, null), a = a.getElementsByTagName(e), o = 0; o < a.length; o++) {
        var n = a[o];
        if (
          !(n[wu] || n[We] || (e === 'link' && n.getAttribute('rel') === 'stylesheet')) &&
          n.namespaceURI !== 'http://www.w3.org/2000/svg'
        ) {
          var u = n.getAttribute(t) || '';
          u = e + u;
          var r = l.get(u);
          r ? r.push(n) : l.set(u, [n]);
        }
      }
      return l;
    }
    function uh(e, t, a) {
      ((e = e.ownerDocument || e),
        e.head.insertBefore(a, t === 'title' ? e.querySelector('head > title') : null));
    }
    function vI(e, t, a) {
      if (a === 1 || t.itemProp != null) return !1;
      switch (e) {
        case 'meta':
        case 'title':
          return !0;
        case 'style':
          if (typeof t.precedence != 'string' || typeof t.href != 'string' || t.href === '') break;
          return !0;
        case 'link':
          if (
            typeof t.rel != 'string' ||
            typeof t.href != 'string' ||
            t.href === '' ||
            t.onLoad ||
            t.onError
          )
            break;
          return t.rel === 'stylesheet'
            ? ((e = t.disabled), typeof t.precedence == 'string' && e == null)
            : !0;
        case 'script':
          if (
            t.async &&
            typeof t.async != 'function' &&
            typeof t.async != 'symbol' &&
            !t.onLoad &&
            !t.onError &&
            t.src &&
            typeof t.src == 'string'
          )
            return !0;
      }
      return !1;
    }
    function Xx(e) {
      return !(e.type === 'stylesheet' && (e.state.loading & 3) === 0);
    }
    function yI(e, t, a, l) {
      if (
        a.type === 'stylesheet' &&
        (typeof l.media != 'string' || matchMedia(l.media).matches !== !1) &&
        (a.state.loading & 4) === 0
      ) {
        if (a.instance === null) {
          var o = rn(l.href),
            n = t.querySelector(Du(o));
          if (n) {
            ((t = n._p),
              t !== null &&
                typeof t == 'object' &&
                typeof t.then == 'function' &&
                (e.count++, (e = ls.bind(e)), t.then(e, e)),
              (a.state.loading |= 4),
              (a.instance = n),
              Ye(n));
            return;
          }
          ((n = t.ownerDocument || t),
            (l = Vx(l)),
            (o = Zt.get(o)) && td(l, o),
            (n = n.createElement('link')),
            Ye(n));
          var u = n;
          ((u._p = new Promise(function (r, s) {
            ((u.onload = r), (u.onerror = s));
          })),
            et(n, 'link', l),
            (a.instance = n));
        }
        (e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(a, t),
          (t = a.state.preload) &&
            (a.state.loading & 3) === 0 &&
            (e.count++,
            (a = ls.bind(e)),
            t.addEventListener('load', a),
            t.addEventListener('error', a)));
      }
    }
    var hf = 0;
    function CI(e, t) {
      return (
        e.stylesheets && e.count === 0 && Mr(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (a) {
              var l = setTimeout(function () {
                if ((e.stylesheets && Mr(e, e.stylesheets), e.unsuspend)) {
                  var n = e.unsuspend;
                  ((e.unsuspend = null), n());
                }
              }, 6e4 + t);
              0 < e.imgBytes && hf === 0 && (hf = 62500 * aI());
              var o = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 && (e.stylesheets && Mr(e, e.stylesheets), e.unsuspend))
                  ) {
                    var n = e.unsuspend;
                    ((e.unsuspend = null), n());
                  }
                },
                (e.imgBytes > hf ? 50 : 800) + t,
              );
              return (
                (e.unsuspend = a),
                function () {
                  ((e.unsuspend = null), clearTimeout(l), clearTimeout(o));
                }
              );
            }
          : null
      );
    }
    function ls() {
      if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
        if (this.stylesheets) Mr(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          ((this.unsuspend = null), e());
        }
      }
    }
    var os = null;
    function Mr(e, t) {
      ((e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++, (os = new Map()), t.forEach(bI, e), (os = null), ls.call(e)));
    }
    function bI(e, t) {
      if (!(t.state.loading & 4)) {
        var a = os.get(e);
        if (a) var l = a.get(null);
        else {
          ((a = new Map()), os.set(e, a));
          for (
            var o = e.querySelectorAll('link[data-precedence],style[data-precedence]'), n = 0;
            n < o.length;
            n++
          ) {
            var u = o[n];
            (u.nodeName === 'LINK' || u.getAttribute('media') !== 'not all') &&
              (a.set(u.dataset.precedence, u), (l = u));
          }
          l && a.set(null, l);
        }
        ((o = t.instance),
          (u = o.getAttribute('data-precedence')),
          (n = a.get(u) || l),
          n === l && a.set(null, o),
          a.set(u, o),
          this.count++,
          (l = ls.bind(this)),
          o.addEventListener('load', l),
          o.addEventListener('error', l),
          n
            ? n.parentNode.insertBefore(o, n.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(o, e.firstChild)),
          (t.state.loading |= 4));
      }
    }
    var Lu = {
      $$typeof: Pa,
      Provider: null,
      Consumer: null,
      _currentValue: Fl,
      _currentValue2: Fl,
      _threadCount: 0,
    };
    function II(e, t, a, l, o, n, u, r, s) {
      ((this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = Ui(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = Ui(0)),
        (this.hiddenUpdates = Ui(null)),
        (this.identifierPrefix = l),
        (this.onUncaughtError = o),
        (this.onCaughtError = n),
        (this.onRecoverableError = u),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = s),
        (this.incompleteTransitions = new Map()));
    }
    function jx(e, t, a, l, o, n, u, r, s, i, c, p) {
      return (
        (e = new II(e, t, a, u, s, i, c, p, r)),
        (t = 1),
        n === !0 && (t |= 24),
        (n = kt(3, null, null, t)),
        (e.current = n),
        (n.stateNode = e),
        (t = Tc()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (n.memoizedState = { element: l, isDehydrated: a, cache: t }),
        Dc(n),
        e
      );
    }
    function Yx(e) {
      return e ? ((e = qo), e) : qo;
    }
    function Kx(e, t, a, l, o, n) {
      ((o = Yx(o)),
        l.context === null ? (l.context = o) : (l.pendingContext = o),
        (l = ml(t)),
        (l.payload = { element: a }),
        (n = n === void 0 ? null : n),
        n !== null && (l.callback = n),
        (a = pl(e, l, t)),
        a !== null && (St(a, e, t), Jn(a, e, t)));
    }
    function rh(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function ld(e, t) {
      (rh(e, t), (e = e.alternate) && rh(e, t));
    }
    function Zx(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = to(e, 67108864);
        (t !== null && St(t, e, 67108864), ld(e, 67108864));
      }
    }
    function sh(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Bt();
        t = pc(t);
        var a = to(e, t);
        (a !== null && St(a, e, t), ld(e, t));
      }
    }
    var ns = !0;
    function wI(e, t, a, l) {
      var o = N.T;
      N.T = null;
      var n = ne.p;
      try {
        ((ne.p = 2), od(e, t, a, l));
      } finally {
        ((ne.p = n), (N.T = o));
      }
    }
    function RI(e, t, a, l) {
      var o = N.T;
      N.T = null;
      var n = ne.p;
      try {
        ((ne.p = 8), od(e, t, a, l));
      } finally {
        ((ne.p = n), (N.T = o));
      }
    }
    function od(e, t, a, l) {
      if (ns) {
        var o = ic(l);
        if (o === null) (mf(e, t, l, us, a), ih(e, l));
        else if (TI(o, e, t, a, l)) l.stopPropagation();
        else if ((ih(e, l), t & 4 && -1 < AI.indexOf(e))) {
          for (; o !== null;) {
            var n = cn(o);
            if (n !== null)
              switch (n.tag) {
                case 3:
                  if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                    var u = zl(n.pendingLanes);
                    if (u !== 0) {
                      var r = n;
                      for (r.pendingLanes |= 2, r.entangledLanes |= 2; u;) {
                        var s = 1 << (31 - Ot(u));
                        ((r.entanglements[1] |= s), (u &= ~s));
                      }
                      (Sa(n), (oe & 6) === 0 && ((Zr = Dt() + 500), Mu(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((r = to(n, 2)), r !== null && St(r, n, 2), Ss(), ld(n, 2));
              }
            if (((n = ic(l)), n === null && mf(e, t, l, us, a), n === o)) break;
            o = n;
          }
          o !== null && l.stopPropagation();
        } else mf(e, t, l, null, a);
      }
    }
    function ic(e) {
      return ((e = Lc(e)), nd(e));
    }
    var us = null;
    function nd(e) {
      if (((us = null), (e = Po(e)), e !== null)) {
        var t = yu(e);
        if (t === null) e = null;
        else {
          var a = t.tag;
          if (a === 13) {
            if (((e = hh(t)), e !== null)) return e;
            e = null;
          } else if (a === 31) {
            if (((e = gh(t)), e !== null)) return e;
            e = null;
          } else if (a === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((us = e), null);
    }
    function Qx(e) {
      switch (e) {
        case 'beforetoggle':
        case 'cancel':
        case 'click':
        case 'close':
        case 'contextmenu':
        case 'copy':
        case 'cut':
        case 'auxclick':
        case 'dblclick':
        case 'dragend':
        case 'dragstart':
        case 'drop':
        case 'focusin':
        case 'focusout':
        case 'input':
        case 'invalid':
        case 'keydown':
        case 'keypress':
        case 'keyup':
        case 'mousedown':
        case 'mouseup':
        case 'paste':
        case 'pause':
        case 'play':
        case 'pointercancel':
        case 'pointerdown':
        case 'pointerup':
        case 'ratechange':
        case 'reset':
        case 'resize':
        case 'seeked':
        case 'submit':
        case 'toggle':
        case 'touchcancel':
        case 'touchend':
        case 'touchstart':
        case 'volumechange':
        case 'change':
        case 'selectionchange':
        case 'textInput':
        case 'compositionstart':
        case 'compositionend':
        case 'compositionupdate':
        case 'beforeblur':
        case 'afterblur':
        case 'beforeinput':
        case 'blur':
        case 'fullscreenchange':
        case 'focus':
        case 'hashchange':
        case 'popstate':
        case 'select':
        case 'selectstart':
          return 2;
        case 'drag':
        case 'dragenter':
        case 'dragexit':
        case 'dragleave':
        case 'dragover':
        case 'mousemove':
        case 'mouseout':
        case 'mouseover':
        case 'pointermove':
        case 'pointerout':
        case 'pointerover':
        case 'scroll':
        case 'touchmove':
        case 'wheel':
        case 'mouseenter':
        case 'mouseleave':
        case 'pointerenter':
        case 'pointerleave':
          return 8;
        case 'message':
          switch (pC()) {
            case vh:
              return 2;
            case yh:
              return 8;
            case Pr:
            case hC:
              return 32;
            case Ch:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var fc = !1,
      xl = null,
      Ll = null,
      Sl = null,
      Su = new Map(),
      vu = new Map(),
      nl = [],
      AI =
        'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
          ' ',
        );
    function ih(e, t) {
      switch (e) {
        case 'focusin':
        case 'focusout':
          xl = null;
          break;
        case 'dragenter':
        case 'dragleave':
          Ll = null;
          break;
        case 'mouseover':
        case 'mouseout':
          Sl = null;
          break;
        case 'pointerover':
        case 'pointerout':
          Su.delete(t.pointerId);
          break;
        case 'gotpointercapture':
        case 'lostpointercapture':
          vu.delete(t.pointerId);
      }
    }
    function qn(e, t, a, l, o, n) {
      return e === null || e.nativeEvent !== n
        ? ((e = {
            blockedOn: t,
            domEventName: a,
            eventSystemFlags: l,
            nativeEvent: n,
            targetContainers: [o],
          }),
          t !== null && ((t = cn(t)), t !== null && Zx(t)),
          e)
        : ((e.eventSystemFlags |= l),
          (t = e.targetContainers),
          o !== null && t.indexOf(o) === -1 && t.push(o),
          e);
    }
    function TI(e, t, a, l, o) {
      switch (t) {
        case 'focusin':
          return ((xl = qn(xl, e, t, a, l, o)), !0);
        case 'dragenter':
          return ((Ll = qn(Ll, e, t, a, l, o)), !0);
        case 'mouseover':
          return ((Sl = qn(Sl, e, t, a, l, o)), !0);
        case 'pointerover':
          var n = o.pointerId;
          return (Su.set(n, qn(Su.get(n) || null, e, t, a, l, o)), !0);
        case 'gotpointercapture':
          return ((n = o.pointerId), vu.set(n, qn(vu.get(n) || null, e, t, a, l, o)), !0);
      }
      return !1;
    }
    function Wx(e) {
      var t = Po(e.target);
      if (t !== null) {
        var a = yu(t);
        if (a !== null) {
          if (((t = a.tag), t === 13)) {
            if (((t = hh(a)), t !== null)) {
              ((e.blockedOn = t),
                jm(e.priority, function () {
                  sh(a);
                }));
              return;
            }
          } else if (t === 31) {
            if (((t = gh(a)), t !== null)) {
              ((e.blockedOn = t),
                jm(e.priority, function () {
                  sh(a);
                }));
              return;
            }
          } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function Dr(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length;) {
        var a = ic(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var l = new a.constructor(a.type, a);
          ((Tf = l), a.target.dispatchEvent(l), (Tf = null));
        } else return ((t = cn(a)), t !== null && Zx(t), (e.blockedOn = a), !1);
        t.shift();
      }
      return !0;
    }
    function fh(e, t, a) {
      Dr(e) && a.delete(t);
    }
    function kI() {
      ((fc = !1),
        xl !== null && Dr(xl) && (xl = null),
        Ll !== null && Dr(Ll) && (Ll = null),
        Sl !== null && Dr(Sl) && (Sl = null),
        Su.forEach(fh),
        vu.forEach(fh));
    }
    function hr(e, t) {
      e.blockedOn === t &&
        ((e.blockedOn = null),
        fc || ((fc = !0), Fe.unstable_scheduleCallback(Fe.unstable_NormalPriority, kI)));
    }
    var gr = null;
    function ch(e) {
      gr !== e &&
        ((gr = e),
        Fe.unstable_scheduleCallback(Fe.unstable_NormalPriority, function () {
          gr === e && (gr = null);
          for (var t = 0; t < e.length; t += 3) {
            var a = e[t],
              l = e[t + 1],
              o = e[t + 2];
            if (typeof l != 'function') {
              if (nd(l || a) === null) continue;
              break;
            }
            var n = cn(a);
            n !== null &&
              (e.splice(t, 3),
              (t -= 3),
              Vf(n, { pending: !0, data: o, method: a.method, action: l }, l, o));
          }
        }));
    }
    function sn(e) {
      function t(s) {
        return hr(s, e);
      }
      (xl !== null && hr(xl, e),
        Ll !== null && hr(Ll, e),
        Sl !== null && hr(Sl, e),
        Su.forEach(t),
        vu.forEach(t));
      for (var a = 0; a < nl.length; a++) {
        var l = nl[a];
        l.blockedOn === e && (l.blockedOn = null);
      }
      for (; 0 < nl.length && ((a = nl[0]), a.blockedOn === null);)
        (Wx(a), a.blockedOn === null && nl.shift());
      if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
        for (l = 0; l < a.length; l += 3) {
          var o = a[l],
            n = a[l + 1],
            u = o[vt] || null;
          if (typeof n == 'function') u || ch(a);
          else if (u) {
            var r = null;
            if (n && n.hasAttribute('formAction')) {
              if (((o = n), (u = n[vt] || null))) r = u.formAction;
              else if (nd(o) !== null) continue;
            } else r = u.action;
            (typeof r == 'function' ? (a[l + 1] = r) : (a.splice(l, 3), (l -= 3)), ch(a));
          }
        }
    }
    function Jx() {
      function e(n) {
        n.canIntercept &&
          n.info === 'react-transition' &&
          n.intercept({
            handler: function () {
              return new Promise(function (u) {
                return (o = u);
              });
            },
            focusReset: 'manual',
            scroll: 'manual',
          });
      }
      function t() {
        (o !== null && (o(), (o = null)), l || setTimeout(a, 20));
      }
      function a() {
        if (!l && !navigation.transition) {
          var n = navigation.currentEntry;
          n &&
            n.url != null &&
            navigation.navigate(n.url, {
              state: n.getState(),
              info: 'react-transition',
              history: 'replace',
            });
        }
      }
      if (typeof navigation == 'object') {
        var l = !1,
          o = null;
        return (
          navigation.addEventListener('navigate', e),
          navigation.addEventListener('navigatesuccess', t),
          navigation.addEventListener('navigateerror', t),
          setTimeout(a, 100),
          function () {
            ((l = !0),
              navigation.removeEventListener('navigate', e),
              navigation.removeEventListener('navigatesuccess', t),
              navigation.removeEventListener('navigateerror', t),
              o !== null && (o(), (o = null)));
          }
        );
      }
    }
    function ud(e) {
      this._internalRoot = e;
    }
    Cs.prototype.render = ud.prototype.render = function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(w(409));
      var a = t.current,
        l = Bt();
      Kx(a, l, e, t, null, null);
    };
    Cs.prototype.unmount = ud.prototype.unmount = function () {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        (Kx(e.current, 2, null, e, null, null), Ss(), (t[fn] = null));
      }
    };
    function Cs(e) {
      this._internalRoot = e;
    }
    Cs.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = Ah();
        e = { blockedOn: null, target: e, priority: t };
        for (var a = 0; a < nl.length && t !== 0 && t < nl[a].priority; a++);
        (nl.splice(a, 0, e), a === 0 && Wx(e));
      }
    };
    var dh = mh.version;
    if (dh !== '19.2.7') throw Error(w(527, dh, '19.2.7'));
    ne.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == 'function'
          ? Error(w(188))
          : ((e = Object.keys(e).join(',')), Error(w(268, e)));
      return (
        (e = rC(t)),
        (e = e !== null ? xh(e) : null),
        (e = e === null ? null : e.stateNode),
        e
      );
    };
    var MI = {
      bundleType: 0,
      version: '19.2.7',
      rendererPackageName: 'react-dom',
      currentDispatcherRef: N,
      reconcilerVersion: '19.2.7',
    };
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u' &&
      ((Fn = __REACT_DEVTOOLS_GLOBAL_HOOK__), !Fn.isDisabled && Fn.supportsFiber)
    )
      try {
        ((Cu = Fn.inject(MI)), (Et = Fn));
      } catch {}
    var Fn;
    bs.createRoot = function (e, t) {
      if (!ph(e)) throw Error(w(299));
      var a = !1,
        l = '',
        o = Gg,
        n = Vg,
        u = Xg;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (a = !0),
          t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
          t.onCaughtError !== void 0 && (n = t.onCaughtError),
          t.onRecoverableError !== void 0 && (u = t.onRecoverableError)),
        (t = jx(e, 1, !1, null, null, a, l, null, o, n, u, Jx)),
        (e[fn] = t.current),
        ed(e),
        new ud(t)
      );
    };
    bs.hydrateRoot = function (e, t, a) {
      if (!ph(e)) throw Error(w(299));
      var l = !1,
        o = '',
        n = Gg,
        u = Vg,
        r = Xg,
        s = null;
      return (
        a != null &&
          (a.unstable_strictMode === !0 && (l = !0),
          a.identifierPrefix !== void 0 && (o = a.identifierPrefix),
          a.onUncaughtError !== void 0 && (n = a.onUncaughtError),
          a.onCaughtError !== void 0 && (u = a.onCaughtError),
          a.onRecoverableError !== void 0 && (r = a.onRecoverableError),
          a.formState !== void 0 && (s = a.formState)),
        (t = jx(e, 1, !0, t, a ?? null, l, o, s, n, u, r, Jx)),
        (t.context = Yx(null)),
        (a = t.current),
        (l = Bt()),
        (l = pc(l)),
        (o = ml(l)),
        (o.callback = null),
        pl(a, o, l),
        (a = l),
        (t.current.lanes = a),
        Iu(t, a),
        Sa(t),
        (e[fn] = t.current),
        ed(e),
        new Cs(t)
      );
    };
    bs.version = '19.2.7';
  });
  var aL = da((TA, tL) => {
    'use strict';
    function eL() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(eL);
        } catch (e) {
          console.error(e);
        }
    }
    (eL(), (tL.exports = $x()));
  });
  var wL = da((As) => {
    'use strict';
    var y0 = Symbol.for('react.transitional.element'),
      C0 = Symbol.for('react.fragment');
    function IL(e, t, a) {
      var l = null;
      if ((a !== void 0 && (l = '' + a), t.key !== void 0 && (l = '' + t.key), 'key' in t)) {
        a = {};
        for (var o in t) o !== 'key' && (a[o] = t[o]);
      } else a = t;
      return (
        (t = a.ref),
        { $$typeof: y0, type: e, key: l, ref: t !== void 0 ? t : null, props: a }
      );
    }
    As.Fragment = C0;
    As.jsx = IL;
    As.jsxs = IL;
  });
  var U = da((PA, RL) => {
    'use strict';
    RL.exports = wL();
  });
  var SA = {},
    Oy = R(aL(), 1);
  var ca = R(P(), 1);
  var xn = R(P(), 1);
  function lL(e) {
    var t,
      a,
      l = '';
    if (typeof e == 'string' || typeof e == 'number') l += e;
    else if (typeof e == 'object')
      if (Array.isArray(e)) {
        var o = e.length;
        for (t = 0; t < o; t++) e[t] && (a = lL(e[t])) && (l && (l += ' '), (l += a));
      } else for (a in e) e[a] && (l && (l += ' '), (l += a));
    return l;
  }
  function Is() {
    for (var e, t, a = 0, l = '', o = arguments.length; a < o; a++)
      (e = arguments[a]) && (t = lL(e)) && (l && (l += ' '), (l += t));
    return l;
  }
  var DI = (e, t) => {
      let a = new Array(e.length + t.length);
      for (let l = 0; l < e.length; l++) a[l] = e[l];
      for (let l = 0; l < t.length; l++) a[e.length + l] = t[l];
      return a;
    },
    EI = (e, t) => ({ classGroupId: e, validator: t }),
    iL = (e = new Map(), t = null, a) => ({ nextPart: e, validators: t, classGroupId: a });
  var oL = [],
    OI = 'arbitrary..',
    BI = (e) => {
      let t = NI(e),
        { conflictingClassGroups: a, conflictingClassGroupModifiers: l } = e;
      return {
        getClassGroupId: (u) => {
          if (u.startsWith('[') && u.endsWith(']')) return PI(u);
          let r = u.split('-'),
            s = r[0] === '' && r.length > 1 ? 1 : 0;
          return fL(r, s, t);
        },
        getConflictingClassGroupIds: (u, r) => {
          if (r) {
            let s = l[u],
              i = a[u];
            return s ? (i ? DI(i, s) : s) : i || oL;
          }
          return a[u] || oL;
        },
      };
    },
    fL = (e, t, a) => {
      if (e.length - t === 0) return a.classGroupId;
      let o = e[t],
        n = a.nextPart.get(o);
      if (n) {
        let i = fL(e, t + 1, n);
        if (i) return i;
      }
      let u = a.validators;
      if (u === null) return;
      let r = t === 0 ? e.join('-') : e.slice(t).join('-'),
        s = u.length;
      for (let i = 0; i < s; i++) {
        let c = u[i];
        if (c.validator(r)) return c.classGroupId;
      }
    },
    PI = (e) =>
      e.slice(1, -1).indexOf(':') === -1
        ? void 0
        : (() => {
            let t = e.slice(1, -1),
              a = t.indexOf(':'),
              l = t.slice(0, a);
            return l ? OI + l : void 0;
          })(),
    NI = (e) => {
      let { theme: t, classGroups: a } = e;
      return _I(a, t);
    },
    _I = (e, t) => {
      let a = iL();
      for (let l in e) {
        let o = e[l];
        sd(o, a, l, t);
      }
      return a;
    },
    sd = (e, t, a, l) => {
      let o = e.length;
      for (let n = 0; n < o; n++) {
        let u = e[n];
        HI(u, t, a, l);
      }
    },
    HI = (e, t, a, l) => {
      if (typeof e == 'string') {
        zI(e, t, a);
        return;
      }
      if (typeof e == 'function') {
        UI(e, t, a, l);
        return;
      }
      qI(e, t, a, l);
    },
    zI = (e, t, a) => {
      let l = e === '' ? t : cL(t, e);
      l.classGroupId = a;
    },
    UI = (e, t, a, l) => {
      if (FI(e)) {
        sd(e(l), t, a, l);
        return;
      }
      (t.validators === null && (t.validators = []), t.validators.push(EI(a, e)));
    },
    qI = (e, t, a, l) => {
      let o = Object.entries(e),
        n = o.length;
      for (let u = 0; u < n; u++) {
        let [r, s] = o[u];
        sd(s, cL(t, r), a, l);
      }
    },
    cL = (e, t) => {
      let a = e,
        l = t.split('-'),
        o = l.length;
      for (let n = 0; n < o; n++) {
        let u = l[n],
          r = a.nextPart.get(u);
        (r || ((r = iL()), a.nextPart.set(u, r)), (a = r));
      }
      return a;
    },
    FI = (e) => 'isThemeGetter' in e && e.isThemeGetter === !0,
    GI = (e) => {
      if (e < 1) return { get: () => {}, set: () => {} };
      let t = 0,
        a = Object.create(null),
        l = Object.create(null),
        o = (n, u) => {
          ((a[n] = u), t++, t > e && ((t = 0), (l = a), (a = Object.create(null))));
        };
      return {
        get(n) {
          let u = a[n];
          if (u !== void 0) return u;
          if ((u = l[n]) !== void 0) return (o(n, u), u);
        },
        set(n, u) {
          n in a ? (a[n] = u) : o(n, u);
        },
      };
    };
  var VI = [],
    nL = (e, t, a, l, o) => ({
      modifiers: e,
      hasImportantModifier: t,
      baseClassName: a,
      maybePostfixModifierPosition: l,
      isExternal: o,
    }),
    XI = (e) => {
      let { prefix: t, experimentalParseClassName: a } = e,
        l = (o) => {
          let n = [],
            u = 0,
            r = 0,
            s = 0,
            i,
            c = o.length;
          for (let x = 0; x < c; x++) {
            let y = o[x];
            if (u === 0 && r === 0) {
              if (y === ':') {
                (n.push(o.slice(s, x)), (s = x + 1));
                continue;
              }
              if (y === '/') {
                i = x;
                continue;
              }
            }
            y === '[' ? u++ : y === ']' ? u-- : y === '(' ? r++ : y === ')' && r--;
          }
          let p = n.length === 0 ? o : o.slice(s),
            m = p,
            h = !1;
          p.endsWith('!')
            ? ((m = p.slice(0, -1)), (h = !0))
            : p.startsWith('!') && ((m = p.slice(1)), (h = !0));
          let S = i && i > s ? i - s : void 0;
          return nL(n, h, m, S);
        };
      if (t) {
        let o = t + ':',
          n = l;
        l = (u) => (u.startsWith(o) ? n(u.slice(o.length)) : nL(VI, !1, u, void 0, !0));
      }
      if (a) {
        let o = l;
        l = (n) => a({ className: n, parseClassName: o });
      }
      return l;
    },
    jI = (e) => {
      let t = new Map();
      return (
        e.orderSensitiveModifiers.forEach((a, l) => {
          t.set(a, 1e6 + l);
        }),
        (a) => {
          let l = [],
            o = [];
          for (let n = 0; n < a.length; n++) {
            let u = a[n],
              r = u[0] === '[',
              s = t.has(u);
            r || s ? (o.length > 0 && (o.sort(), l.push(...o), (o = [])), l.push(u)) : o.push(u);
          }
          return (o.length > 0 && (o.sort(), l.push(...o)), l);
        }
      );
    },
    YI = (e) => ({
      cache: GI(e.cacheSize),
      parseClassName: XI(e),
      sortModifiers: jI(e),
      postfixLookupClassGroupIds: KI(e),
      ...BI(e),
    }),
    KI = (e) => {
      let t = Object.create(null),
        a = e.postfixLookupClassGroups;
      if (a) for (let l = 0; l < a.length; l++) t[a[l]] = !0;
      return t;
    },
    ZI = /\s+/,
    QI = (e, t) => {
      let {
          parseClassName: a,
          getClassGroupId: l,
          getConflictingClassGroupIds: o,
          sortModifiers: n,
          postfixLookupClassGroupIds: u,
        } = t,
        r = [],
        s = e.trim().split(ZI),
        i = '';
      for (let c = s.length - 1; c >= 0; c -= 1) {
        let p = s[c],
          {
            isExternal: m,
            modifiers: h,
            hasImportantModifier: S,
            baseClassName: x,
            maybePostfixModifierPosition: y,
          } = a(p);
        if (m) {
          i = p + (i.length > 0 ? ' ' + i : i);
          continue;
        }
        let g = !!y,
          d;
        if (g) {
          let C = x.substring(0, y);
          d = l(C);
          let b = d && u[d] ? l(x) : void 0;
          b && b !== d && ((d = b), (g = !1));
        } else d = l(x);
        if (!d) {
          if (!g) {
            i = p + (i.length > 0 ? ' ' + i : i);
            continue;
          }
          if (((d = l(x)), !d)) {
            i = p + (i.length > 0 ? ' ' + i : i);
            continue;
          }
          g = !1;
        }
        let f = h.length === 0 ? '' : h.length === 1 ? h[0] : n(h).join(':'),
          L = S ? f + '!' : f,
          v = L + d;
        if (r.indexOf(v) > -1) continue;
        r.push(v);
        let I = o(d, g);
        for (let C = 0; C < I.length; ++C) {
          let b = I[C];
          r.push(L + b);
        }
        i = p + (i.length > 0 ? ' ' + i : i);
      }
      return i;
    },
    WI = (...e) => {
      let t = 0,
        a,
        l,
        o = '';
      for (; t < e.length;) (a = e[t++]) && (l = dL(a)) && (o && (o += ' '), (o += l));
      return o;
    },
    dL = (e) => {
      if (typeof e == 'string') return e;
      let t,
        a = '';
      for (let l = 0; l < e.length; l++) e[l] && (t = dL(e[l])) && (a && (a += ' '), (a += t));
      return a;
    },
    JI = (e, ...t) => {
      let a,
        l,
        o,
        n,
        u = (s) => {
          let i = t.reduce((c, p) => p(c), e());
          return ((a = YI(i)), (l = a.cache.get), (o = a.cache.set), (n = r), r(s));
        },
        r = (s) => {
          let i = l(s);
          if (i) return i;
          let c = QI(s, a);
          return (o(s, c), c);
        };
      return ((n = u), (...s) => n(WI(...s)));
    },
    $I = [],
    Ge = (e) => {
      let t = (a) => a[e] || $I;
      return ((t.isThemeGetter = !0), t);
    },
    mL = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
    pL = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
    e0 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
    t0 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
    a0 =
      /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
    l0 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
    o0 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
    n0 =
      /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
    Rl = (e) => e0.test(e),
    Y = (e) => !!e && !Number.isNaN(Number(e)),
    va = (e) => !!e && Number.isInteger(Number(e)),
    rd = (e) => e.endsWith('%') && Y(e.slice(0, -1)),
    Ya = (e) => t0.test(e),
    hL = () => !0,
    u0 = (e) => a0.test(e) && !l0.test(e),
    id = () => !1,
    r0 = (e) => o0.test(e),
    s0 = (e) => n0.test(e),
    i0 = (e) => !E(e) && !O(e),
    f0 = (e) =>
      e.startsWith('@container') &&
      ((e[10] === '/' && e[11] !== void 0) ||
        (e[11] === 's' && e[16] !== void 0 && e.startsWith('-size/', 10)) ||
        (e[11] === 'n' && e[18] !== void 0 && e.startsWith('-normal/', 10))),
    c0 = (e) => Al(e, LL, id),
    E = (e) => mL.test(e),
    lo = (e) => Al(e, SL, u0),
    uL = (e) => Al(e, S0, Y),
    d0 = (e) => Al(e, yL, hL),
    m0 = (e) => Al(e, vL, id),
    rL = (e) => Al(e, gL, id),
    p0 = (e) => Al(e, xL, s0),
    ws = (e) => Al(e, CL, r0),
    O = (e) => pL.test(e),
    Ou = (e) => oo(e, SL),
    h0 = (e) => oo(e, vL),
    sL = (e) => oo(e, gL),
    g0 = (e) => oo(e, LL),
    x0 = (e) => oo(e, xL),
    Rs = (e) => oo(e, CL, !0),
    L0 = (e) => oo(e, yL, !0),
    Al = (e, t, a) => {
      let l = mL.exec(e);
      return l ? (l[1] ? t(l[1]) : a(l[2])) : !1;
    },
    oo = (e, t, a = !1) => {
      let l = pL.exec(e);
      return l ? (l[1] ? t(l[1]) : a) : !1;
    },
    gL = (e) => e === 'position' || e === 'percentage',
    xL = (e) => e === 'image' || e === 'url',
    LL = (e) => e === 'length' || e === 'size' || e === 'bg-size',
    SL = (e) => e === 'length',
    S0 = (e) => e === 'number',
    vL = (e) => e === 'family-name',
    yL = (e) => e === 'number' || e === 'weight',
    CL = (e) => e === 'shadow';
  var v0 = () => {
    let e = Ge('color'),
      t = Ge('font'),
      a = Ge('text'),
      l = Ge('font-weight'),
      o = Ge('tracking'),
      n = Ge('leading'),
      u = Ge('breakpoint'),
      r = Ge('container'),
      s = Ge('spacing'),
      i = Ge('radius'),
      c = Ge('shadow'),
      p = Ge('inset-shadow'),
      m = Ge('text-shadow'),
      h = Ge('drop-shadow'),
      S = Ge('blur'),
      x = Ge('perspective'),
      y = Ge('aspect'),
      g = Ge('ease'),
      d = Ge('animate'),
      f = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      L = () => [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'left-top',
        'top-right',
        'right-top',
        'bottom-right',
        'right-bottom',
        'bottom-left',
        'left-bottom',
      ],
      v = () => [...L(), O, E],
      I = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      C = () => ['auto', 'contain', 'none'],
      b = () => [O, E, s],
      A = () => [Rl, 'full', 'auto', ...b()],
      T = () => [va, 'none', 'subgrid', O, E],
      D = () => ['auto', { span: ['full', va, O, E] }, va, O, E],
      F = () => [va, 'auto', O, E],
      K = () => ['auto', 'min', 'max', 'fr', O, E],
      W = () => [
        'start',
        'end',
        'center',
        'between',
        'around',
        'evenly',
        'stretch',
        'baseline',
        'center-safe',
        'end-safe',
      ],
      le = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
      V = () => ['auto', ...b()],
      J = () => [
        Rl,
        'auto',
        'full',
        'dvw',
        'dvh',
        'lvw',
        'lvh',
        'svw',
        'svh',
        'min',
        'max',
        'fit',
        ...b(),
      ],
      _ = () => [Rl, 'screen', 'full', 'dvw', 'lvw', 'svw', 'min', 'max', 'fit', ...b()],
      ae = () => [Rl, 'screen', 'full', 'lh', 'dvh', 'lvh', 'svh', 'min', 'max', 'fit', ...b()],
      M = () => [e, O, E],
      wt = () => [...L(), sL, rL, { position: [O, E] }],
      Ue = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
      rt = () => ['auto', 'cover', 'contain', g0, c0, { size: [O, E] }],
      st = () => [rd, Ou, lo],
      ke = () => ['', 'none', 'full', i, O, E],
      Te = () => ['', Y, Ou, lo],
      H = () => ['solid', 'dashed', 'dotted', 'double'],
      ge = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      ee = () => [Y, rd, sL, rL],
      fe = () => ['', 'none', S, O, E],
      ue = () => ['none', Y, O, E],
      Le = () => ['none', Y, O, E],
      Rt = () => [Y, O, E],
      Ze = () => [Rl, 'full', ...b()];
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [Ya],
        breakpoint: [Ya],
        color: [hL],
        container: [Ya],
        'drop-shadow': [Ya],
        ease: ['in', 'out', 'in-out'],
        font: [i0],
        'font-weight': [
          'thin',
          'extralight',
          'light',
          'normal',
          'medium',
          'semibold',
          'bold',
          'extrabold',
          'black',
        ],
        'inset-shadow': [Ya],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
        radius: [Ya],
        shadow: [Ya],
        spacing: ['px', Y],
        text: [Ya],
        'text-shadow': [Ya],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', Rl, E, O, y] }],
        container: ['container'],
        'container-type': [{ '@container': ['', 'normal', 'size', O, E] }],
        'container-named': [f0],
        columns: [{ columns: [Y, E, O, r] }],
        'break-after': [{ 'break-after': f() }],
        'break-before': [{ 'break-before': f() }],
        'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
        'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
        box: [{ box: ['border', 'content'] }],
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        sr: ['sr-only', 'not-sr-only'],
        float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
        clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
        isolation: ['isolate', 'isolation-auto'],
        'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
        'object-position': [{ object: v() }],
        overflow: [{ overflow: I() }],
        'overflow-x': [{ 'overflow-x': I() }],
        'overflow-y': [{ 'overflow-y': I() }],
        overscroll: [{ overscroll: C() }],
        'overscroll-x': [{ 'overscroll-x': C() }],
        'overscroll-y': [{ 'overscroll-y': C() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: A() }],
        'inset-x': [{ 'inset-x': A() }],
        'inset-y': [{ 'inset-y': A() }],
        start: [{ 'inset-s': A(), start: A() }],
        end: [{ 'inset-e': A(), end: A() }],
        'inset-bs': [{ 'inset-bs': A() }],
        'inset-be': [{ 'inset-be': A() }],
        top: [{ top: A() }],
        right: [{ right: A() }],
        bottom: [{ bottom: A() }],
        left: [{ left: A() }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: [va, 'auto', O, E] }],
        basis: [{ basis: [Rl, 'full', 'auto', r, ...b()] }],
        'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
        'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
        flex: [{ flex: [Y, Rl, 'auto', 'initial', 'none', E] }],
        grow: [{ grow: ['', Y, O, E] }],
        shrink: [{ shrink: ['', Y, O, E] }],
        order: [{ order: [va, 'first', 'last', 'none', O, E] }],
        'grid-cols': [{ 'grid-cols': T() }],
        'col-start-end': [{ col: D() }],
        'col-start': [{ 'col-start': F() }],
        'col-end': [{ 'col-end': F() }],
        'grid-rows': [{ 'grid-rows': T() }],
        'row-start-end': [{ row: D() }],
        'row-start': [{ 'row-start': F() }],
        'row-end': [{ 'row-end': F() }],
        'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
        'auto-cols': [{ 'auto-cols': K() }],
        'auto-rows': [{ 'auto-rows': K() }],
        gap: [{ gap: b() }],
        'gap-x': [{ 'gap-x': b() }],
        'gap-y': [{ 'gap-y': b() }],
        'justify-content': [{ justify: [...W(), 'normal'] }],
        'justify-items': [{ 'justify-items': [...le(), 'normal'] }],
        'justify-self': [{ 'justify-self': ['auto', ...le()] }],
        'align-content': [{ content: ['normal', ...W()] }],
        'align-items': [{ items: [...le(), { baseline: ['', 'last'] }] }],
        'align-self': [{ self: ['auto', ...le(), { baseline: ['', 'last'] }] }],
        'place-content': [{ 'place-content': W() }],
        'place-items': [{ 'place-items': [...le(), 'baseline'] }],
        'place-self': [{ 'place-self': ['auto', ...le()] }],
        p: [{ p: b() }],
        px: [{ px: b() }],
        py: [{ py: b() }],
        ps: [{ ps: b() }],
        pe: [{ pe: b() }],
        pbs: [{ pbs: b() }],
        pbe: [{ pbe: b() }],
        pt: [{ pt: b() }],
        pr: [{ pr: b() }],
        pb: [{ pb: b() }],
        pl: [{ pl: b() }],
        m: [{ m: V() }],
        mx: [{ mx: V() }],
        my: [{ my: V() }],
        ms: [{ ms: V() }],
        me: [{ me: V() }],
        mbs: [{ mbs: V() }],
        mbe: [{ mbe: V() }],
        mt: [{ mt: V() }],
        mr: [{ mr: V() }],
        mb: [{ mb: V() }],
        ml: [{ ml: V() }],
        'space-x': [{ 'space-x': b() }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': b() }],
        'space-y-reverse': ['space-y-reverse'],
        size: [{ size: J() }],
        'inline-size': [{ inline: ['auto', ..._()] }],
        'min-inline-size': [{ 'min-inline': ['auto', ..._()] }],
        'max-inline-size': [{ 'max-inline': ['none', ..._()] }],
        'block-size': [{ block: ['auto', ...ae()] }],
        'min-block-size': [{ 'min-block': ['auto', ...ae()] }],
        'max-block-size': [{ 'max-block': ['none', ...ae()] }],
        w: [{ w: [r, 'screen', ...J()] }],
        'min-w': [{ 'min-w': [r, 'screen', 'none', ...J()] }],
        'max-w': [{ 'max-w': [r, 'screen', 'none', 'prose', { screen: [u] }, ...J()] }],
        h: [{ h: ['screen', 'lh', ...J()] }],
        'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...J()] }],
        'max-h': [{ 'max-h': ['screen', 'lh', ...J()] }],
        'font-size': [{ text: ['base', a, Ou, lo] }],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [{ font: [l, L0, d0] }],
        'font-stretch': [
          {
            'font-stretch': [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              'normal',
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded',
              rd,
              E,
            ],
          },
        ],
        'font-family': [{ font: [h0, m0, t] }],
        'font-features': [{ 'font-features': [E] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: [o, O, E] }],
        'line-clamp': [{ 'line-clamp': [Y, 'none', O, uL] }],
        leading: [{ leading: [n, ...b()] }],
        'list-image': [{ 'list-image': ['none', O, E] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'list-style-type': [{ list: ['disc', 'decimal', 'none', O, E] }],
        'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
        'placeholder-color': [{ placeholder: M() }],
        'text-color': [{ text: M() }],
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        'text-decoration-style': [{ decoration: [...H(), 'wavy'] }],
        'text-decoration-thickness': [{ decoration: [Y, 'from-font', 'auto', O, lo] }],
        'text-decoration-color': [{ decoration: M() }],
        'underline-offset': [{ 'underline-offset': [Y, 'auto', O, E] }],
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: b() }],
        'tab-size': [{ tab: [va, O, E] }],
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              O,
              E,
            ],
          },
        ],
        whitespace: [
          { whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', O, E] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: wt() }],
        'bg-repeat': [{ bg: Ue() }],
        'bg-size': [{ bg: rt() }],
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [{ to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, va, O, E],
                radial: ['', O, E],
                conic: [va, O, E],
              },
              x0,
              p0,
            ],
          },
        ],
        'bg-color': [{ bg: M() }],
        'gradient-from-pos': [{ from: st() }],
        'gradient-via-pos': [{ via: st() }],
        'gradient-to-pos': [{ to: st() }],
        'gradient-from': [{ from: M() }],
        'gradient-via': [{ via: M() }],
        'gradient-to': [{ to: M() }],
        rounded: [{ rounded: ke() }],
        'rounded-s': [{ 'rounded-s': ke() }],
        'rounded-e': [{ 'rounded-e': ke() }],
        'rounded-t': [{ 'rounded-t': ke() }],
        'rounded-r': [{ 'rounded-r': ke() }],
        'rounded-b': [{ 'rounded-b': ke() }],
        'rounded-l': [{ 'rounded-l': ke() }],
        'rounded-ss': [{ 'rounded-ss': ke() }],
        'rounded-se': [{ 'rounded-se': ke() }],
        'rounded-ee': [{ 'rounded-ee': ke() }],
        'rounded-es': [{ 'rounded-es': ke() }],
        'rounded-tl': [{ 'rounded-tl': ke() }],
        'rounded-tr': [{ 'rounded-tr': ke() }],
        'rounded-br': [{ 'rounded-br': ke() }],
        'rounded-bl': [{ 'rounded-bl': ke() }],
        'border-w': [{ border: Te() }],
        'border-w-x': [{ 'border-x': Te() }],
        'border-w-y': [{ 'border-y': Te() }],
        'border-w-s': [{ 'border-s': Te() }],
        'border-w-e': [{ 'border-e': Te() }],
        'border-w-bs': [{ 'border-bs': Te() }],
        'border-w-be': [{ 'border-be': Te() }],
        'border-w-t': [{ 'border-t': Te() }],
        'border-w-r': [{ 'border-r': Te() }],
        'border-w-b': [{ 'border-b': Te() }],
        'border-w-l': [{ 'border-l': Te() }],
        'divide-x': [{ 'divide-x': Te() }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': Te() }],
        'divide-y-reverse': ['divide-y-reverse'],
        'border-style': [{ border: [...H(), 'hidden', 'none'] }],
        'divide-style': [{ divide: [...H(), 'hidden', 'none'] }],
        'border-color': [{ border: M() }],
        'border-color-x': [{ 'border-x': M() }],
        'border-color-y': [{ 'border-y': M() }],
        'border-color-s': [{ 'border-s': M() }],
        'border-color-e': [{ 'border-e': M() }],
        'border-color-bs': [{ 'border-bs': M() }],
        'border-color-be': [{ 'border-be': M() }],
        'border-color-t': [{ 'border-t': M() }],
        'border-color-r': [{ 'border-r': M() }],
        'border-color-b': [{ 'border-b': M() }],
        'border-color-l': [{ 'border-l': M() }],
        'divide-color': [{ divide: M() }],
        'outline-style': [{ outline: [...H(), 'none', 'hidden'] }],
        'outline-offset': [{ 'outline-offset': [Y, O, E] }],
        'outline-w': [{ outline: ['', Y, Ou, lo] }],
        'outline-color': [{ outline: M() }],
        shadow: [{ shadow: ['', 'none', c, Rs, ws] }],
        'shadow-color': [{ shadow: M() }],
        'inset-shadow': [{ 'inset-shadow': ['none', p, Rs, ws] }],
        'inset-shadow-color': [{ 'inset-shadow': M() }],
        'ring-w': [{ ring: Te() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: M() }],
        'ring-offset-w': [{ 'ring-offset': [Y, lo] }],
        'ring-offset-color': [{ 'ring-offset': M() }],
        'inset-ring-w': [{ 'inset-ring': Te() }],
        'inset-ring-color': [{ 'inset-ring': M() }],
        'text-shadow': [{ 'text-shadow': ['none', m, Rs, ws] }],
        'text-shadow-color': [{ 'text-shadow': M() }],
        opacity: [{ opacity: [Y, O, E] }],
        'mix-blend': [{ 'mix-blend': [...ge(), 'plus-darker', 'plus-lighter'] }],
        'bg-blend': [{ 'bg-blend': ge() }],
        'mask-clip': [
          { 'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
          'mask-no-clip',
        ],
        'mask-composite': [{ mask: ['add', 'subtract', 'intersect', 'exclude'] }],
        'mask-image-linear-pos': [{ 'mask-linear': [Y] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': ee() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': ee() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': M() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': M() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': ee() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': ee() }],
        'mask-image-t-from-color': [{ 'mask-t-from': M() }],
        'mask-image-t-to-color': [{ 'mask-t-to': M() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': ee() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': ee() }],
        'mask-image-r-from-color': [{ 'mask-r-from': M() }],
        'mask-image-r-to-color': [{ 'mask-r-to': M() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': ee() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': ee() }],
        'mask-image-b-from-color': [{ 'mask-b-from': M() }],
        'mask-image-b-to-color': [{ 'mask-b-to': M() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': ee() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': ee() }],
        'mask-image-l-from-color': [{ 'mask-l-from': M() }],
        'mask-image-l-to-color': [{ 'mask-l-to': M() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': ee() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': ee() }],
        'mask-image-x-from-color': [{ 'mask-x-from': M() }],
        'mask-image-x-to-color': [{ 'mask-x-to': M() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': ee() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': ee() }],
        'mask-image-y-from-color': [{ 'mask-y-from': M() }],
        'mask-image-y-to-color': [{ 'mask-y-to': M() }],
        'mask-image-radial': [{ 'mask-radial': [O, E] }],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': ee() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': ee() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': M() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': M() }],
        'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
        'mask-image-radial-size': [
          { 'mask-radial': [{ closest: ['side', 'corner'], farthest: ['side', 'corner'] }] },
        ],
        'mask-image-radial-pos': [{ 'mask-radial-at': L() }],
        'mask-image-conic-pos': [{ 'mask-conic': [Y] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': ee() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': ee() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': M() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': M() }],
        'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
        'mask-origin': [
          { 'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
        ],
        'mask-position': [{ mask: wt() }],
        'mask-repeat': [{ mask: Ue() }],
        'mask-size': [{ mask: rt() }],
        'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
        'mask-image': [{ mask: ['none', O, E] }],
        filter: [{ filter: ['', 'none', O, E] }],
        blur: [{ blur: fe() }],
        brightness: [{ brightness: [Y, O, E] }],
        contrast: [{ contrast: [Y, O, E] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', h, Rs, ws] }],
        'drop-shadow-color': [{ 'drop-shadow': M() }],
        grayscale: [{ grayscale: ['', Y, O, E] }],
        'hue-rotate': [{ 'hue-rotate': [Y, O, E] }],
        invert: [{ invert: ['', Y, O, E] }],
        saturate: [{ saturate: [Y, O, E] }],
        sepia: [{ sepia: ['', Y, O, E] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none', O, E] }],
        'backdrop-blur': [{ 'backdrop-blur': fe() }],
        'backdrop-brightness': [{ 'backdrop-brightness': [Y, O, E] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [Y, O, E] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': ['', Y, O, E] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [Y, O, E] }],
        'backdrop-invert': [{ 'backdrop-invert': ['', Y, O, E] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [Y, O, E] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [Y, O, E] }],
        'backdrop-sepia': [{ 'backdrop-sepia': ['', Y, O, E] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': b() }],
        'border-spacing-x': [{ 'border-spacing-x': b() }],
        'border-spacing-y': [{ 'border-spacing-y': b() }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          { transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', O, E] },
        ],
        'transition-behavior': [{ transition: ['normal', 'discrete'] }],
        duration: [{ duration: [Y, 'initial', O, E] }],
        ease: [{ ease: ['linear', 'initial', g, O, E] }],
        delay: [{ delay: [Y, O, E] }],
        animate: [{ animate: ['none', d, O, E] }],
        backface: [{ backface: ['hidden', 'visible'] }],
        perspective: [{ perspective: [x, O, E] }],
        'perspective-origin': [{ 'perspective-origin': v() }],
        rotate: [{ rotate: ue() }],
        'rotate-x': [{ 'rotate-x': ue() }],
        'rotate-y': [{ 'rotate-y': ue() }],
        'rotate-z': [{ 'rotate-z': ue() }],
        scale: [{ scale: Le() }],
        'scale-x': [{ 'scale-x': Le() }],
        'scale-y': [{ 'scale-y': Le() }],
        'scale-z': [{ 'scale-z': Le() }],
        'scale-3d': ['scale-3d'],
        skew: [{ skew: Rt() }],
        'skew-x': [{ 'skew-x': Rt() }],
        'skew-y': [{ 'skew-y': Rt() }],
        transform: [{ transform: [O, E, '', 'none', 'gpu', 'cpu'] }],
        'transform-origin': [{ origin: v() }],
        'transform-style': [{ transform: ['3d', 'flat'] }],
        translate: [{ translate: Ze() }],
        'translate-x': [{ 'translate-x': Ze() }],
        'translate-y': [{ 'translate-y': Ze() }],
        'translate-z': [{ 'translate-z': Ze() }],
        'translate-none': ['translate-none'],
        zoom: [{ zoom: [va, O, E] }],
        accent: [{ accent: M() }],
        appearance: [{ appearance: ['none', 'auto'] }],
        'caret-color': [{ caret: M() }],
        'color-scheme': [
          { scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light'] },
        ],
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              O,
              E,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
        'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
        resize: [{ resize: ['none', '', 'y', 'x'] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scrollbar-thumb-color': [{ 'scrollbar-thumb': M() }],
        'scrollbar-track-color': [{ 'scrollbar-track': M() }],
        'scrollbar-gutter': [{ 'scrollbar-gutter': ['auto', 'stable', 'both'] }],
        'scrollbar-w': [{ scrollbar: ['auto', 'thin', 'none'] }],
        'scroll-m': [{ 'scroll-m': b() }],
        'scroll-mx': [{ 'scroll-mx': b() }],
        'scroll-my': [{ 'scroll-my': b() }],
        'scroll-ms': [{ 'scroll-ms': b() }],
        'scroll-me': [{ 'scroll-me': b() }],
        'scroll-mbs': [{ 'scroll-mbs': b() }],
        'scroll-mbe': [{ 'scroll-mbe': b() }],
        'scroll-mt': [{ 'scroll-mt': b() }],
        'scroll-mr': [{ 'scroll-mr': b() }],
        'scroll-mb': [{ 'scroll-mb': b() }],
        'scroll-ml': [{ 'scroll-ml': b() }],
        'scroll-p': [{ 'scroll-p': b() }],
        'scroll-px': [{ 'scroll-px': b() }],
        'scroll-py': [{ 'scroll-py': b() }],
        'scroll-ps': [{ 'scroll-ps': b() }],
        'scroll-pe': [{ 'scroll-pe': b() }],
        'scroll-pbs': [{ 'scroll-pbs': b() }],
        'scroll-pbe': [{ 'scroll-pbe': b() }],
        'scroll-pt': [{ 'scroll-pt': b() }],
        'scroll-pr': [{ 'scroll-pr': b() }],
        'scroll-pb': [{ 'scroll-pb': b() }],
        'scroll-pl': [{ 'scroll-pl': b() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', O, E] }],
        fill: [{ fill: ['none', ...M()] }],
        'stroke-w': [{ stroke: [Y, Ou, lo, uL] }],
        stroke: [{ stroke: ['none', ...M()] }],
        'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
      },
      conflictingClassGroups: {
        'container-named': ['container-type'],
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: [
          'inset-x',
          'inset-y',
          'inset-bs',
          'inset-be',
          'start',
          'end',
          'top',
          'right',
          'bottom',
          'left',
        ],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pbs', 'pbe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mbs', 'mbe', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-x',
          'border-w-y',
          'border-w-s',
          'border-w-e',
          'border-w-bs',
          'border-w-be',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-x',
          'border-color-y',
          'border-color-s',
          'border-color-e',
          'border-color-bs',
          'border-color-be',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        translate: ['translate-x', 'translate-y', 'translate-none'],
        'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mbs',
          'scroll-mbe',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pbs',
          'scroll-pbe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: { 'font-size': ['leading'] },
      postfixLookupClassGroups: ['container-type'],
      orderSensitiveModifiers: [
        '*',
        '**',
        'after',
        'backdrop',
        'before',
        'details-content',
        'file',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection',
      ],
    };
  };
  var bL = JI(v0);
  function dt(...e) {
    return bL(Is(e));
  }
  var AL = R(U(), 1),
    Tl = (0, xn.forwardRef)(({ className: e, autoResize: t = !0, onChange: a, ...l }, o) => {
      let n = (0, xn.useRef)(null),
        u = o || n;
      (0, xn.useEffect)(() => {
        t &&
          u.current &&
          ((u.current.style.height = 'auto'),
          (u.current.style.height = u.current.scrollHeight + 'px'));
      }, [l.value, t, u]);
      let r = (s) => {
        (t &&
          ((s.target.style.height = 'auto'),
          (s.target.style.height = s.target.scrollHeight + 'px')),
          a?.(s));
      };
      return (0, AL.jsx)('textarea', {
        ref: u,
        className: dt(
          'flex w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-md-sm text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y min-h-[50px] leading-relaxed',
          e,
        ),
        onChange: r,
        ...l,
      });
    });
  Tl.displayName = 'Textarea';
  var DL = R(P(), 1);
  var TL = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
    kL = Is,
    ML = (e, t) => (a) => {
      var l;
      if (t?.variants == null) return kL(e, a?.class, a?.className);
      let { variants: o, defaultVariants: n } = t,
        u = Object.keys(o).map((i) => {
          let c = a?.[i],
            p = n?.[i];
          if (c === null) return null;
          let m = TL(c) || TL(p);
          return o[i][m];
        }),
        r =
          a &&
          Object.entries(a).reduce((i, c) => {
            let [p, m] = c;
            return (m === void 0 || (i[p] = m), i);
          }, {}),
        s =
          t == null || (l = t.compoundVariants) === null || l === void 0
            ? void 0
            : l.reduce((i, c) => {
                let { class: p, className: m, ...h } = c;
                return Object.entries(h).every((S) => {
                  let [x, y] = S;
                  return Array.isArray(y) ? y.includes({ ...n, ...r }[x]) : { ...n, ...r }[x] === y;
                })
                  ? [...i, p, m]
                  : i;
              }, []);
      return kL(e, u, s, a?.class, a?.className);
    };
  var EL = R(U(), 1),
    b0 = ML(
      'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-md-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      {
        variants: {
          variant: {
            default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
            destructive:
              'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
            outline:
              'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
          },
          size: {
            default: 'h-8 px-3.5',
            sm: 'h-7 px-2.5',
            lg: 'h-9 px-4',
            xl: 'h-11 px-6 text-base',
            icon: 'h-8 w-8',
          },
        },
        defaultVariants: { variant: 'default', size: 'default' },
      },
    ),
    _t = (0, DL.forwardRef)(({ className: e, variant: t, size: a, ...l }, o) =>
      (0, EL.jsx)('button', {
        className: dt(b0({ variant: t, size: a, className: e })),
        ref: o,
        ...l,
      }),
    );
  _t.displayName = 'Button';
  var nt = R(U(), 1);
  function OL({ title: e, onClose: t }) {
    return (0, nt.jsxs)('div', {
      className:
        'flex items-center justify-between px-6 py-4 shrink-0 bg-gradient-to-br from-primary to-primary/80',
      children: [
        (0, nt.jsxs)('div', {
          className: 'flex items-center gap-3',
          children: [
            (0, nt.jsx)('div', {
              className: 'flex items-center justify-center w-10 h-10 rounded-xl bg-white/15',
              children: (0, nt.jsxs)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'white',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                children: [
                  (0, nt.jsx)('path', {
                    d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
                  }),
                  (0, nt.jsx)('polyline', { points: '14 2 14 8 20 8' }),
                  (0, nt.jsx)('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
                  (0, nt.jsx)('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
                  (0, nt.jsx)('polyline', { points: '10 9 9 9 8 9' }),
                ],
              }),
            }),
            (0, nt.jsx)('h2', {
              className: 'text-[20px] font-bold text-white tracking-tight',
              children: e,
            }),
          ],
        }),
        (0, nt.jsx)(_t, {
          type: 'button',
          variant: 'ghost',
          size: 'sm',
          onClick: t,
          className: 'text-white/70 hover:text-white hover:bg-white/15',
          'aria-label': 'Tutup',
          children: (0, nt.jsxs)('svg', {
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            children: [
              (0, nt.jsx)('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
              (0, nt.jsx)('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
            ],
          }),
        }),
      ],
    });
  }
  var Ve = R(U(), 1);
  function BL({ data: e }) {
    return (0, Ve.jsxs)('div', {
      className:
        'rounded-xl p-5 flex flex-wrap items-center gap-x-8 gap-y-3 bg-gradient-to-br from-muted to-muted/50 border border-border',
      children: [
        (0, Ve.jsxs)('div', {
          className: 'flex items-center gap-3',
          children: [
            (0, Ve.jsx)('div', {
              className: 'flex items-center justify-center w-10 h-10 rounded-full bg-primary/10',
              children: (0, Ve.jsxs)('svg', {
                width: '18',
                height: '18',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                className: 'text-primary',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                children: [
                  (0, Ve.jsx)('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
                  (0, Ve.jsx)('circle', { cx: '12', cy: '7', r: '4' }),
                ],
              }),
            }),
            (0, Ve.jsxs)('div', {
              children: [
                (0, Ve.jsx)('div', {
                  className: 'text-[11px] font-bold text-muted-foreground uppercase tracking-wider',
                  children: 'RM',
                }),
                (0, Ve.jsx)('div', {
                  className: 'text-[18px] font-bold text-foreground font-mono',
                  children: e.norm || '\u2014',
                }),
              ],
            }),
          ],
        }),
        (0, Ve.jsx)('div', { className: 'w-px h-10 bg-border' }),
        (0, Ve.jsxs)('div', {
          children: [
            (0, Ve.jsx)('div', {
              className: 'text-[11px] font-bold text-muted-foreground uppercase tracking-wider',
              children: 'Pasien',
            }),
            (0, Ve.jsx)('div', {
              className: 'text-[18px] font-bold text-foreground',
              children: e.pasien || '\u2014',
            }),
          ],
        }),
        (0, Ve.jsx)('div', { className: 'w-px h-10 bg-border' }),
        (0, Ve.jsxs)('div', {
          children: [
            (0, Ve.jsx)('div', {
              className: 'text-[11px] font-bold text-muted-foreground uppercase tracking-wider',
              children: 'Dokter',
            }),
            (0, Ve.jsx)('div', {
              className: 'text-[18px] font-bold text-foreground',
              children: e.nama_dokter || '\u2014',
            }),
          ],
        }),
      ],
    });
  }
  var Ts = R(U(), 1);
  function mt({ className: e, required: t, children: a, ...l }) {
    return (0, Ts.jsxs)('label', {
      className: dt(
        'block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1',
        e,
      ),
      ...l,
      children: [
        a,
        t && (0, Ts.jsx)('span', { className: 'text-destructive ml-0.5', children: '*' }),
      ],
    });
  }
  var la = R(U(), 1);
  function PL({ anamnesa: e, pemeriksaan: t, onChange: a }) {
    return (0, la.jsxs)('div', {
      className: 'py-5',
      children: [
        (0, la.jsx)('h3', {
          className:
            "text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]",
          children: 'Data Klinis',
        }),
        (0, la.jsxs)('div', {
          className: 'space-y-5',
          children: [
            (0, la.jsxs)('div', {
              children: [
                (0, la.jsx)(mt, { children: 'Anamnesa' }),
                (0, la.jsx)(Tl, {
                  value: e,
                  onChange: (l) => a('anamnesa', l.target.value),
                  placeholder: 'Keluhan pasien...',
                  rows: 4,
                }),
              ],
            }),
            (0, la.jsxs)('div', {
              children: [
                (0, la.jsx)(mt, { children: 'Pemeriksaan Fisik' }),
                (0, la.jsx)(Tl, {
                  value: t,
                  onChange: (l) => a('pemeriksaan', l.target.value),
                  placeholder: 'Hasil pemeriksaan...',
                  rows: 4,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  var NL = R(P(), 1);
  var _L = R(U(), 1),
    Ka = (0, NL.forwardRef)(({ className: e, type: t, ...a }, l) =>
      (0, _L.jsx)('input', {
        type: t,
        className: dt(
          'flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          e,
        ),
        ref: l,
        ...a,
      }),
    );
  Ka.displayName = 'Input';
  var ya = R(U(), 1);
  function HL({ vitals: e, onChange: t }) {
    return (0, ya.jsxs)('div', {
      children: [
        (0, ya.jsx)('h3', {
          className:
            "text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]",
          children: 'Tanda Vital',
        }),
        (0, ya.jsx)('div', {
          className: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
          children: [
            { key: 'tensi', label: 'Tensi', unit: 'mmHg', placeholder: '120/80' },
            { key: 'nadi', label: 'Nadi', unit: 'x/mnt', placeholder: '80' },
            { key: 'suhu', label: 'Suhu', unit: '\xB0C', placeholder: '36.5' },
            { key: 'nafas', label: 'Nafas', unit: 'x/mnt', placeholder: '20' },
            { key: 'berat', label: 'Berat', unit: 'kg', placeholder: '60' },
            { key: 'tinggi', label: 'Tinggi', unit: 'cm', placeholder: '165' },
          ].map((l) =>
            (0, ya.jsxs)(
              'div',
              {
                children: [
                  (0, ya.jsx)(mt, { children: l.label }),
                  (0, ya.jsxs)('div', {
                    className: 'relative',
                    children: [
                      (0, ya.jsx)(Ka, {
                        value: e[l.key],
                        onChange: (o) => t(l.key, o.target.value),
                        placeholder: l.placeholder,
                        className: 'pr-14',
                      }),
                      (0, ya.jsx)('span', {
                        className:
                          'absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground pointer-events-none',
                        children: l.unit,
                      }),
                    ],
                  }),
                ],
              },
              l.key,
            ),
          ),
        }),
      ],
    });
  }
  var Bl = R(P(), 1);
  var Ds = R(P(), 1);
  var ks = (...e) =>
    e
      .filter((t, a, l) => !!t && t.trim() !== '' && l.indexOf(t) === a)
      .join(' ')
      .trim();
  var zL = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  var UL = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, a, l) => (l ? l.toUpperCase() : a.toLowerCase()));
  var fd = (e) => {
    let t = UL(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  var Bu = R(P(), 1);
  var Ms = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  var qL = (e) => {
    for (let t in e) if (t.startsWith('aria-') || t === 'role' || t === 'title') return !0;
    return !1;
  };
  var Ln = R(P(), 1);
  var I0 = (0, Ln.createContext)({});
  var FL = () => (0, Ln.useContext)(I0);
  var GL = (0, Bu.forwardRef)(
    (
      {
        color: e,
        size: t,
        strokeWidth: a,
        absoluteStrokeWidth: l,
        className: o = '',
        children: n,
        iconNode: u,
        ...r
      },
      s,
    ) => {
      let {
          size: i = 24,
          strokeWidth: c = 2,
          absoluteStrokeWidth: p = !1,
          color: m = 'currentColor',
          className: h = '',
        } = FL() ?? {},
        S = (l ?? p) ? (Number(a ?? c) * 24) / Number(t ?? i) : (a ?? c);
      return (0, Bu.createElement)(
        'svg',
        {
          ref: s,
          ...Ms,
          width: t ?? i ?? Ms.width,
          height: t ?? i ?? Ms.height,
          stroke: e ?? m,
          strokeWidth: S,
          className: ks('lucide', h, o),
          ...(!n && !qL(r) && { 'aria-hidden': 'true' }),
          ...r,
        },
        [...u.map(([x, y]) => (0, Bu.createElement)(x, y)), ...(Array.isArray(n) ? n : [n])],
      );
    },
  );
  var Ct = (e, t) => {
    let a = (0, Ds.forwardRef)(({ className: l, ...o }, n) =>
      (0, Ds.createElement)(GL, {
        ref: n,
        iconNode: t,
        className: ks(`lucide-${zL(fd(e))}`, `lucide-${e}`, l),
        ...o,
      }),
    );
    return ((a.displayName = fd(e)), a);
  };
  var w0 = [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]],
    Pu = Ct('check', w0);
  var R0 = [['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }]],
    Nu = Ct('chevron-down', R0);
  var A0 = [
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
      ['path', { d: 'M12 16v-4', key: '1dtifu' }],
      ['path', { d: 'M12 8h.01', key: 'e9boi3' }],
    ],
    _u = Ct('info', A0);
  var T0 = [
      ['path', { d: 'M5 12h14', key: '1ays0h' }],
      ['path', { d: 'M12 5v14', key: 's699le' }],
    ],
    no = Ct('plus', T0);
  var k0 = [
      ['path', { d: 'M10 11v6', key: 'nco0om' }],
      ['path', { d: 'M14 11v6', key: 'outv1u' }],
      ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', key: 'miytrc' }],
      ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
      ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'e791ji' }],
    ],
    uo = Ct('trash-2', k0);
  var M0 = [
      [
        'path',
        {
          d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
          key: 'wmoenq',
        },
      ],
      ['path', { d: 'M12 9v4', key: 'juzpu7' }],
      ['path', { d: 'M12 17h.01', key: 'p32p05' }],
    ],
    oa = Ct('triangle-alert', M0);
  var D0 = [
      ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
      ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
    ],
    Sn = Ct('x', D0);
  var hi = R(P(), 1);
  var k = R(P(), 1),
    tm = R(Ao(), 1);
  function cd(e, [t, a]) {
    return Math.min(a, Math.max(t, e));
  }
  var G1 = !!(typeof window < 'u' && window.document && window.document.createElement);
  function Ee(e, t, { checkForDefaultPrevented: a = !0 } = {}) {
    return function (o) {
      if ((e?.(o), a === !1 || !o || !o.defaultPrevented)) return t?.(o);
    };
  }
  var na = R(P(), 1);
  var Za = R(P(), 1),
    VL = R(U(), 1);
  function vn(e, t = []) {
    let a = [];
    function l(n, u) {
      let r = Za.createContext(u);
      r.displayName = n + 'Context';
      let s = a.length;
      a = [...a, u];
      let i = (p) => {
        let { scope: m, children: h, ...S } = p,
          x = m?.[e]?.[s] || r,
          y = Za.useMemo(() => S, Object.values(S));
        return (0, VL.jsx)(x.Provider, { value: y, children: h });
      };
      i.displayName = n + 'Provider';
      function c(p, m, h = {}) {
        let { optional: S = !1 } = h,
          x = m?.[e]?.[s] || r,
          y = Za.useContext(x);
        if (y) return y;
        if (u !== void 0) return u;
        if (!S) throw new Error(`\`${p}\` must be used within \`${n}\``);
      }
      return [i, c];
    }
    let o = () => {
      let n = a.map((u) => Za.createContext(u));
      return function (r) {
        let s = r?.[e] || n;
        return Za.useMemo(() => ({ [`__scope${e}`]: { ...r, [e]: s } }), [r, s]);
      };
    };
    return ((o.scopeName = e), [l, E0(o, ...t)]);
  }
  function E0(...e) {
    let t = e[0];
    if (e.length === 1) return t;
    let a = () => {
      let l = e.map((o) => ({ useScope: o(), scopeName: o.scopeName }));
      return function (n) {
        let u = l.reduce((r, { useScope: s, scopeName: i }) => {
          let p = s(n)[`__scope${i}`];
          return { ...r, ...p };
        }, {});
        return Za.useMemo(() => ({ [`__scope${t.scopeName}`]: u }), [u]);
      };
    };
    return ((a.scopeName = t.scopeName), a);
  }
  var jL = R(P(), 1);
  function XL(e, t) {
    if (typeof e == 'function') return e(t);
    e != null && (e.current = t);
  }
  function O0(...e) {
    return (t) => {
      let a = !1,
        l = e.map((o) => {
          let n = XL(o, t);
          return (!a && typeof n == 'function' && (a = !0), n);
        });
      if (a)
        return () => {
          for (let o = 0; o < l.length; o++) {
            let n = l[o];
            typeof n == 'function' ? n() : XL(e[o], null);
          }
        };
    };
  }
  function Re(...e) {
    return jL.useCallback(O0(...e), e);
  }
  var tt = R(P(), 1);
  function ro(e) {
    let t = tt.forwardRef((a, l) => {
      let { children: o, ...n } = a,
        u = null,
        r = !1,
        s = [];
      (YL(o) && typeof Es == 'function' && (o = Es(o._payload)),
        tt.Children.forEach(o, (m) => {
          if (H0(m)) {
            r = !0;
            let h = m,
              S = 'child' in h.props ? h.props.child : h.props.children;
            (YL(S) && typeof Es == 'function' && (S = Es(S._payload)),
              (u = P0(h, S)),
              s.push(u?.props?.children));
          } else s.push(m);
        }),
        u
          ? (u = tt.cloneElement(u, void 0, s))
          : !r && tt.Children.count(o) === 1 && tt.isValidElement(o) && (u = o));
      let i = u ? _0(u) : void 0,
        c = Re(l, i);
      if (!u) {
        if (o || o === 0) throw new Error(r ? F0(e) : q0(e));
        return o;
      }
      let p = N0(n, u.props ?? {});
      return (u.type !== tt.Fragment && (p.ref = l ? c : i), tt.cloneElement(u, p));
    });
    return ((t.displayName = `${e}.Slot`), t);
  }
  var B0 = Symbol.for('radix.slottable');
  var P0 = (e, t) => {
    if ('child' in e.props) {
      let a = e.props.child;
      return tt.isValidElement(a)
        ? tt.cloneElement(a, void 0, e.props.children(a.props.children))
        : null;
    }
    return tt.isValidElement(t) ? t : null;
  };
  function N0(e, t) {
    let a = { ...t };
    for (let l in t) {
      let o = e[l],
        n = t[l];
      /^on[A-Z]/.test(l)
        ? o && n
          ? (a[l] = (...r) => {
              let s = n(...r);
              return (o(...r), s);
            })
          : o && (a[l] = o)
        : l === 'style'
          ? (a[l] = { ...o, ...n })
          : l === 'className' && (a[l] = [o, n].filter(Boolean).join(' '));
    }
    return { ...e, ...a };
  }
  function _0(e) {
    let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
      a = t && 'isReactWarning' in t && t.isReactWarning;
    return a
      ? e.ref
      : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
        (a = t && 'isReactWarning' in t && t.isReactWarning),
        a ? e.props.ref : e.props.ref || e.ref);
  }
  function H0(e) {
    return (
      tt.isValidElement(e) &&
      typeof e.type == 'function' &&
      '__radixId' in e.type &&
      e.type.__radixId === B0
    );
  }
  var z0 = Symbol.for('react.lazy');
  function YL(e) {
    return (
      e != null &&
      typeof e == 'object' &&
      '$$typeof' in e &&
      e.$$typeof === z0 &&
      '_payload' in e &&
      U0(e._payload)
    );
  }
  function U0(e) {
    return typeof e == 'object' && e !== null && 'then' in e;
  }
  var q0 = (e) =>
      `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,
    F0 = (e) =>
      `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,
    Es = tt[' use '.trim().toString()];
  var Os = R(U(), 1),
    Bs = R(P(), 1);
  var G0 = R(U(), 1);
  function KL(e) {
    let t = e + 'CollectionProvider',
      [a, l] = vn(t),
      [o, n] = a(t, { collectionRef: { current: null }, itemMap: new Map() }),
      u = (x) => {
        let { scope: y, children: g } = x,
          d = na.useRef(null),
          f = na.useRef(new Map()).current;
        return (0, Os.jsx)(o, { scope: y, itemMap: f, collectionRef: d, children: g });
      };
    u.displayName = t;
    let r = e + 'CollectionSlot',
      s = ro(r),
      i = na.forwardRef((x, y) => {
        let { scope: g, children: d } = x,
          f = n(r, g),
          L = Re(y, f.collectionRef);
        return (0, Os.jsx)(s, { ref: L, children: d });
      });
    i.displayName = r;
    let c = e + 'CollectionItemSlot',
      p = 'data-radix-collection-item',
      m = ro(c),
      h = na.forwardRef((x, y) => {
        let { scope: g, children: d, ...f } = x,
          L = na.useRef(null),
          v = Re(y, L),
          I = n(c, g);
        return (
          na.useEffect(
            () => (
              I.itemMap.set(L, { ref: L, ...f }),
              () => {
                I.itemMap.delete(L);
              }
            ),
          ),
          (0, Os.jsx)(m, { [p]: '', ref: v, children: d })
        );
      });
    h.displayName = c;
    function S(x) {
      let y = n(e + 'CollectionConsumer', x);
      return na.useCallback(() => {
        let d = y.collectionRef.current;
        if (!d) return [];
        let f = Array.from(d.querySelectorAll(`[${p}]`));
        return Array.from(y.itemMap.values()).sort(
          (I, C) => f.indexOf(I.ref.current) - f.indexOf(C.ref.current),
        );
      }, [y.collectionRef, y.itemMap]);
    }
    return [{ Provider: u, Slot: i, ItemSlot: h }, S, l];
  }
  var Ps = R(P(), 1),
    V0 = R(U(), 1),
    X0 = Ps.createContext(void 0);
  function ZL(e) {
    let t = Ps.useContext(X0);
    return e || t || 'ltr';
  }
  var ie = R(P(), 1);
  var QL = R(P(), 1),
    WL = R(Ao(), 1);
  var JL = R(U(), 1),
    j0 = [
      'a',
      'button',
      'div',
      'form',
      'h2',
      'h3',
      'img',
      'input',
      'label',
      'li',
      'nav',
      'ol',
      'p',
      'select',
      'span',
      'svg',
      'ul',
    ],
    me = j0.reduce((e, t) => {
      let a = ro(`Primitive.${t}`),
        l = QL.forwardRef((o, n) => {
          let { asChild: u, ...r } = o,
            s = u ? a : t;
          return (
            typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0),
            (0, JL.jsx)(s, { ...r, ref: n })
          );
        });
      return ((l.displayName = `Primitive.${t}`), { ...e, [t]: l });
    }, {});
  function $L(e, t) {
    e && WL.flushSync(() => e.dispatchEvent(t));
  }
  var yn = R(P(), 1);
  function Ht(e) {
    let t = yn.useRef(e);
    return (
      yn.useEffect(() => {
        t.current = e;
      }),
      yn.useMemo(
        () =>
          (...a) =>
            t.current?.(...a),
        [],
      )
    );
  }
  var md = R(U(), 1),
    Y0 = 'DismissableLayer',
    dd = 'dismissableLayer.update',
    K0 = 'dismissableLayer.pointerDownOutside',
    Z0 = 'dismissableLayer.focusOutside',
    eS,
    aS = ie.createContext({
      layers: new Set(),
      layersWithOutsidePointerEventsDisabled: new Set(),
      branches: new Set(),
      dismissableSurfaces: new Set(),
    }),
    pd = ie.forwardRef((e, t) => {
      let {
          disableOutsidePointerEvents: a = !1,
          deferPointerDownOutside: l = !1,
          onEscapeKeyDown: o,
          onPointerDownOutside: n,
          onFocusOutside: u,
          onInteractOutside: r,
          onDismiss: s,
          ...i
        } = e,
        c = ie.useContext(aS),
        [p, m] = ie.useState(null),
        h = p?.ownerDocument ?? globalThis?.document,
        [, S] = ie.useState({}),
        x = Re(t, m),
        y = Array.from(c.layers),
        [g] = [...c.layersWithOutsidePointerEventsDisabled].slice(-1),
        d = g ? y.indexOf(g) : -1,
        f = p ? y.indexOf(p) : -1,
        L = c.layersWithOutsidePointerEventsDisabled.size > 0,
        v = f >= d,
        I = ie.useRef(!1),
        C = $0(
          (D) => {
            (n?.(D), r?.(D), D.defaultPrevented || s?.());
          },
          {
            ownerDocument: h,
            deferPointerDownOutside: l,
            isDeferredPointerDownOutsideRef: I,
            dismissableSurfaces: c.dismissableSurfaces,
            shouldHandlePointerDownOutside: ie.useCallback(
              (D) => {
                if (!(D instanceof Node)) return !1;
                let F = [...c.branches].some((K) => K.contains(D));
                return v && !F;
              },
              [c.branches, v],
            ),
          },
        ),
        b = ew((D) => {
          if (l && I.current) return;
          let F = D.target;
          [...c.branches].some((W) => W.contains(F)) ||
            (u?.(D), r?.(D), D.defaultPrevented || s?.());
        }, h),
        A = p ? f === y.length - 1 : !1,
        T = Ht((D) => {
          D.key === 'Escape' && (o?.(D), !D.defaultPrevented && s && (D.preventDefault(), s()));
        });
      return (
        ie.useEffect(() => {
          if (A)
            return (
              h.addEventListener('keydown', T, { capture: !0 }),
              () => h.removeEventListener('keydown', T, { capture: !0 })
            );
        }, [h, A, T]),
        ie.useEffect(() => {
          if (p)
            return (
              a &&
                (c.layersWithOutsidePointerEventsDisabled.size === 0 &&
                  ((eS = h.body.style.pointerEvents), (h.body.style.pointerEvents = 'none')),
                c.layersWithOutsidePointerEventsDisabled.add(p)),
              c.layers.add(p),
              tS(),
              () => {
                a &&
                  (c.layersWithOutsidePointerEventsDisabled.delete(p),
                  c.layersWithOutsidePointerEventsDisabled.size === 0 &&
                    (h.body.style.pointerEvents = eS));
              }
            );
        }, [p, h, a, c]),
        ie.useEffect(
          () => () => {
            p && (c.layers.delete(p), c.layersWithOutsidePointerEventsDisabled.delete(p), tS());
          },
          [p, c],
        ),
        ie.useEffect(() => {
          let D = () => S({});
          return (document.addEventListener(dd, D), () => document.removeEventListener(dd, D));
        }, []),
        (0, md.jsx)(me.div, {
          ...i,
          ref: x,
          style: { pointerEvents: L ? (v ? 'auto' : 'none') : void 0, ...e.style },
          onFocusCapture: Ee(e.onFocusCapture, b.onFocusCapture),
          onBlurCapture: Ee(e.onBlurCapture, b.onBlurCapture),
          onPointerDownCapture: Ee(e.onPointerDownCapture, C.onPointerDownCapture),
        })
      );
    });
  pd.displayName = Y0;
  var Q0 = 'DismissableLayerBranch',
    W0 = ie.forwardRef((e, t) => {
      let a = ie.useContext(aS),
        l = ie.useRef(null),
        o = Re(t, l);
      return (
        ie.useEffect(() => {
          let n = l.current;
          if (n)
            return (
              a.branches.add(n),
              () => {
                a.branches.delete(n);
              }
            );
        }, [a.branches]),
        (0, md.jsx)(me.div, { ...e, ref: o })
      );
    });
  W0.displayName = Q0;
  var J0 = () => !0;
  function $0(e, t) {
    let {
        ownerDocument: a = globalThis?.document,
        deferPointerDownOutside: l = !1,
        isDeferredPointerDownOutsideRef: o,
        dismissableSurfaces: n,
        shouldHandlePointerDownOutside: u = J0,
      } = t,
      r = Ht(e),
      s = ie.useRef(!1),
      i = ie.useRef(!1),
      c = ie.useRef(new Map()),
      p = ie.useRef(() => {});
    return (
      ie.useEffect(() => {
        function m() {
          ((i.current = !1), (o.current = !1), c.current.clear());
        }
        function h() {
          return Array.from(c.current.values()).some(Boolean);
        }
        function S(f) {
          if (!i.current) return;
          let L = f.target;
          ((L instanceof Node && [...n].some((I) => I.contains(L))) || c.current.set(f.type, !0),
            f.type === 'click' &&
              window.setTimeout(() => {
                i.current && p.current();
              }, 0));
        }
        function x(f) {
          i.current && c.current.set(f.type, !1);
        }
        let y = (f) => {
            if (f.target && !s.current) {
              let v = function () {
                a.removeEventListener('click', p.current);
                let C = h();
                (m(), C || lS(K0, r, I, { discrete: !0 }));
              };
              var L = v;
              if (!u(f.target)) {
                (a.removeEventListener('click', p.current), m(), (s.current = !1));
                return;
              }
              let I = { originalEvent: f };
              ((i.current = !0),
                (o.current = l && f.button === 0),
                c.current.clear(),
                !l || f.button !== 0
                  ? v()
                  : (a.removeEventListener('click', p.current),
                    (p.current = v),
                    a.addEventListener('click', p.current, { once: !0 })));
            } else (a.removeEventListener('click', p.current), m());
            s.current = !1;
          },
          g = ['pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click'];
        for (let f of g) (a.addEventListener(f, S, !0), a.addEventListener(f, x));
        let d = window.setTimeout(() => {
          a.addEventListener('pointerdown', y);
        }, 0);
        return () => {
          (window.clearTimeout(d),
            a.removeEventListener('pointerdown', y),
            a.removeEventListener('click', p.current));
          for (let f of g) (a.removeEventListener(f, S, !0), a.removeEventListener(f, x));
        };
      }, [a, r, l, o, n, u]),
      { onPointerDownCapture: () => (s.current = !0) }
    );
  }
  function ew(e, t = globalThis?.document) {
    let a = Ht(e),
      l = ie.useRef(!1);
    return (
      ie.useEffect(() => {
        let o = (n) => {
          n.target && !l.current && lS(Z0, a, { originalEvent: n }, { discrete: !1 });
        };
        return (t.addEventListener('focusin', o), () => t.removeEventListener('focusin', o));
      }, [t, a]),
      { onFocusCapture: () => (l.current = !0), onBlurCapture: () => (l.current = !1) }
    );
  }
  function tS() {
    let e = new CustomEvent(dd);
    document.dispatchEvent(e);
  }
  function lS(e, t, a, { discrete: l }) {
    let o = a.originalEvent.target,
      n = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: a });
    (t && o.addEventListener(e, t, { once: !0 }), l ? $L(o, n) : o.dispatchEvent(n));
  }
  var nS = R(P(), 1),
    Ns = 0,
    Cn = null;
  function uS() {
    nS.useEffect(() => {
      Cn || (Cn = { start: oS(), end: oS() });
      let { start: e, end: t } = Cn;
      return (
        document.body.firstElementChild !== e &&
          document.body.insertAdjacentElement('afterbegin', e),
        document.body.lastElementChild !== t && document.body.insertAdjacentElement('beforeend', t),
        Ns++,
        () => {
          (Ns === 1 && (Cn?.start.remove(), Cn?.end.remove(), (Cn = null)),
            (Ns = Math.max(0, Ns - 1)));
        }
      );
    }, []);
  }
  function oS() {
    let e = document.createElement('span');
    return (
      e.setAttribute('data-radix-focus-guard', ''),
      (e.tabIndex = 0),
      (e.style.outline = 'none'),
      (e.style.opacity = '0'),
      (e.style.position = 'fixed'),
      (e.style.pointerEvents = 'none'),
      e
    );
  }
  var Qt = R(P(), 1);
  var cS = R(U(), 1),
    hd = 'focusScope.autoFocusOnMount',
    gd = 'focusScope.autoFocusOnUnmount',
    rS = { bubbles: !1, cancelable: !0 },
    tw = 'FocusScope',
    xd = Qt.forwardRef((e, t) => {
      let { loop: a = !1, trapped: l = !1, onMountAutoFocus: o, onUnmountAutoFocus: n, ...u } = e,
        [r, s] = Qt.useState(null),
        i = Ht(o),
        c = Ht(n),
        p = Qt.useRef(null),
        m = Re(t, s),
        h = Qt.useRef({
          paused: !1,
          pause() {
            this.paused = !0;
          },
          resume() {
            this.paused = !1;
          },
        }).current;
      (Qt.useEffect(() => {
        if (l) {
          let d = function (I) {
              if (h.paused || !r) return;
              let C = I.target;
              r.contains(C) ? (p.current = C) : kl(p.current, { select: !0 });
            },
            f = function (I) {
              if (h.paused || !r) return;
              let C = I.relatedTarget;
              C !== null && (r.contains(C) || kl(p.current, { select: !0 }));
            },
            L = function (I) {
              if (document.activeElement === document.body)
                for (let b of I) b.removedNodes.length > 0 && kl(r);
            };
          var x = d,
            y = f,
            g = L;
          (document.addEventListener('focusin', d), document.addEventListener('focusout', f));
          let v = new MutationObserver(L);
          return (
            r && v.observe(r, { childList: !0, subtree: !0 }),
            () => {
              (document.removeEventListener('focusin', d),
                document.removeEventListener('focusout', f),
                v.disconnect());
            }
          );
        }
      }, [l, r, h.paused]),
        Qt.useEffect(() => {
          if (r) {
            iS.add(h);
            let x = document.activeElement;
            if (!r.contains(x)) {
              let g = new CustomEvent(hd, rS);
              (r.addEventListener(hd, i),
                r.dispatchEvent(g),
                g.defaultPrevented ||
                  (aw(rw(dS(r)), { select: !0 }), document.activeElement === x && kl(r)));
            }
            return () => {
              (r.removeEventListener(hd, i),
                setTimeout(() => {
                  let g = new CustomEvent(gd, rS);
                  (r.addEventListener(gd, c),
                    r.dispatchEvent(g),
                    g.defaultPrevented || kl(x ?? document.body, { select: !0 }),
                    r.removeEventListener(gd, c),
                    iS.remove(h));
                }, 0));
            };
          }
        }, [r, i, c, h]));
      let S = Qt.useCallback(
        (x) => {
          if ((!a && !l) || h.paused) return;
          let y = x.key === 'Tab' && !x.altKey && !x.ctrlKey && !x.metaKey,
            g = document.activeElement;
          if (y && g) {
            let d = x.currentTarget,
              [f, L] = lw(d);
            f && L
              ? !x.shiftKey && g === L
                ? (x.preventDefault(), a && kl(f, { select: !0 }))
                : x.shiftKey && g === f && (x.preventDefault(), a && kl(L, { select: !0 }))
              : g === d && x.preventDefault();
          }
        },
        [a, l, h.paused],
      );
      return (0, cS.jsx)(me.div, { tabIndex: -1, ...u, ref: m, onKeyDown: S });
    });
  xd.displayName = tw;
  function aw(e, { select: t = !1 } = {}) {
    let a = document.activeElement;
    for (let l of e) if ((kl(l, { select: t }), document.activeElement !== a)) return;
  }
  function lw(e) {
    let t = dS(e),
      a = sS(t, e),
      l = sS(t.reverse(), e);
    return [a, l];
  }
  function dS(e) {
    let t = [],
      a = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (l) => {
          let o = l.tagName === 'INPUT' && l.type === 'hidden';
          return l.disabled || l.hidden || o
            ? NodeFilter.FILTER_SKIP
            : l.tabIndex >= 0
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
        },
      });
    for (; a.nextNode();) t.push(a.currentNode);
    return t;
  }
  function sS(e, t) {
    let a = typeof t.checkVisibility == 'function' && t.checkVisibility({ checkVisibilityCSS: !0 });
    for (let l of e)
      if (!(a ? !l.checkVisibility({ checkVisibilityCSS: !0 }) : ow(l, { upTo: t }))) return l;
  }
  function ow(e, { upTo: t }) {
    if (getComputedStyle(e).visibility === 'hidden') return !0;
    for (; e;) {
      if (t !== void 0 && e === t) return !1;
      if (getComputedStyle(e).display === 'none') return !0;
      e = e.parentElement;
    }
    return !1;
  }
  function nw(e) {
    return e instanceof HTMLInputElement && 'select' in e;
  }
  function kl(e, { select: t = !1 } = {}) {
    if (e && e.focus) {
      let a = document.activeElement;
      (e.focus({ preventScroll: !0 }), e !== a && nw(e) && t && e.select());
    }
  }
  var iS = uw();
  function uw() {
    let e = [];
    return {
      add(t) {
        let a = e[0];
        (t !== a && a?.pause(), (e = fS(e, t)), e.unshift(t));
      },
      remove(t) {
        ((e = fS(e, t)), e[0]?.resume());
      },
    };
  }
  function fS(e, t) {
    let a = [...e],
      l = a.indexOf(t);
    return (l !== -1 && a.splice(l, 1), a);
  }
  function rw(e) {
    return e.filter((t) => t.tagName !== 'A');
  }
  var Ld = R(P(), 1);
  var mS = R(P(), 1),
    Ae = globalThis?.document ? mS.useLayoutEffect : () => {};
  var sw = Ld[' useId '.trim().toString()] || (() => {}),
    iw = 0;
  function _s(e) {
    let [t, a] = Ld.useState(sw());
    return (
      Ae(() => {
        e || a((l) => l ?? String(iw++));
      }, [e]),
      e || (t ? `radix-${t}` : '')
    );
  }
  var at = R(P(), 1);
  var gS = ['top', 'right', 'bottom', 'left'];
  var Ca = Math.min,
    pt = Math.max,
    zu = Math.round,
    Uu = Math.floor,
    ua = (e) => ({ x: e, y: e }),
    fw = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  function zs(e, t, a) {
    return pt(e, Ca(t, a));
  }
  function ba(e, t) {
    return typeof e == 'function' ? e(t) : e;
  }
  function Ia(e) {
    return e.split('-')[0];
  }
  function so(e) {
    return e.split('-')[1];
  }
  function Us(e) {
    return e === 'x' ? 'y' : 'x';
  }
  function qs(e) {
    return e === 'y' ? 'height' : 'width';
  }
  function ra(e) {
    let t = e[0];
    return t === 't' || t === 'b' ? 'y' : 'x';
  }
  function Fs(e) {
    return Us(ra(e));
  }
  function xS(e, t, a) {
    a === void 0 && (a = !1);
    let l = so(e),
      o = Fs(e),
      n = qs(o),
      u =
        o === 'x'
          ? l === (a ? 'end' : 'start')
            ? 'right'
            : 'left'
          : l === 'start'
            ? 'bottom'
            : 'top';
    return (t.reference[n] > t.floating[n] && (u = Hu(u)), [u, Hu(u)]);
  }
  function LS(e) {
    let t = Hu(e);
    return [Hs(e), t, Hs(t)];
  }
  function Hs(e) {
    return e.includes('start') ? e.replace('start', 'end') : e.replace('end', 'start');
  }
  var pS = ['left', 'right'],
    hS = ['right', 'left'],
    cw = ['top', 'bottom'],
    dw = ['bottom', 'top'];
  function mw(e, t, a) {
    switch (e) {
      case 'top':
      case 'bottom':
        return a ? (t ? hS : pS) : t ? pS : hS;
      case 'left':
      case 'right':
        return t ? cw : dw;
      default:
        return [];
    }
  }
  function SS(e, t, a, l) {
    let o = so(e),
      n = mw(Ia(e), a === 'start', l);
    return (o && ((n = n.map((u) => u + '-' + o)), t && (n = n.concat(n.map(Hs)))), n);
  }
  function Hu(e) {
    let t = Ia(e);
    return fw[t] + e.slice(t.length);
  }
  function pw(e) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...e };
  }
  function Sd(e) {
    return typeof e != 'number' ? pw(e) : { top: e, right: e, bottom: e, left: e };
  }
  function io(e) {
    let { x: t, y: a, width: l, height: o } = e;
    return { width: l, height: o, top: a, left: t, right: t + l, bottom: a + o, x: t, y: a };
  }
  function vS(e, t, a) {
    let { reference: l, floating: o } = e,
      n = ra(t),
      u = Fs(t),
      r = qs(u),
      s = Ia(t),
      i = n === 'y',
      c = l.x + l.width / 2 - o.width / 2,
      p = l.y + l.height / 2 - o.height / 2,
      m = l[r] / 2 - o[r] / 2,
      h;
    switch (s) {
      case 'top':
        h = { x: c, y: l.y - o.height };
        break;
      case 'bottom':
        h = { x: c, y: l.y + l.height };
        break;
      case 'right':
        h = { x: l.x + l.width, y: p };
        break;
      case 'left':
        h = { x: l.x - o.width, y: p };
        break;
      default:
        h = { x: l.x, y: l.y };
    }
    switch (so(t)) {
      case 'start':
        h[u] -= m * (a && i ? -1 : 1);
        break;
      case 'end':
        h[u] += m * (a && i ? -1 : 1);
        break;
    }
    return h;
  }
  async function bS(e, t) {
    var a;
    t === void 0 && (t = {});
    let { x: l, y: o, platform: n, rects: u, elements: r, strategy: s } = e,
      {
        boundary: i = 'clippingAncestors',
        rootBoundary: c = 'viewport',
        elementContext: p = 'floating',
        altBoundary: m = !1,
        padding: h = 0,
      } = ba(t, e),
      S = Sd(h),
      y = r[m ? (p === 'floating' ? 'reference' : 'floating') : p],
      g = io(
        await n.getClippingRect({
          element:
            (a = await (n.isElement == null ? void 0 : n.isElement(y))) == null || a
              ? y
              : y.contextElement ||
                (await (n.getDocumentElement == null ? void 0 : n.getDocumentElement(r.floating))),
          boundary: i,
          rootBoundary: c,
          strategy: s,
        }),
      ),
      d =
        p === 'floating'
          ? { x: l, y: o, width: u.floating.width, height: u.floating.height }
          : u.reference,
      f = await (n.getOffsetParent == null ? void 0 : n.getOffsetParent(r.floating)),
      L = (await (n.isElement == null ? void 0 : n.isElement(f)))
        ? (await (n.getScale == null ? void 0 : n.getScale(f))) || { x: 1, y: 1 }
        : { x: 1, y: 1 },
      v = io(
        n.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await n.convertOffsetParentRelativeRectToViewportRelativeRect({
              elements: r,
              rect: d,
              offsetParent: f,
              strategy: s,
            })
          : d,
      );
    return {
      top: (g.top - v.top + S.top) / L.y,
      bottom: (v.bottom - g.bottom + S.bottom) / L.y,
      left: (g.left - v.left + S.left) / L.x,
      right: (v.right - g.right + S.right) / L.x,
    };
  }
  var hw = 50,
    IS = async (e, t, a) => {
      let {
          placement: l = 'bottom',
          strategy: o = 'absolute',
          middleware: n = [],
          platform: u,
        } = a,
        r = u.detectOverflow ? u : { ...u, detectOverflow: bS },
        s = await (u.isRTL == null ? void 0 : u.isRTL(t)),
        i = await u.getElementRects({ reference: e, floating: t, strategy: o }),
        { x: c, y: p } = vS(i, l, s),
        m = l,
        h = 0,
        S = {};
      for (let x = 0; x < n.length; x++) {
        let y = n[x];
        if (!y) continue;
        let { name: g, fn: d } = y,
          {
            x: f,
            y: L,
            data: v,
            reset: I,
          } = await d({
            x: c,
            y: p,
            initialPlacement: l,
            placement: m,
            strategy: o,
            middlewareData: S,
            rects: i,
            platform: r,
            elements: { reference: e, floating: t },
          });
        ((c = f ?? c),
          (p = L ?? p),
          (S[g] = { ...S[g], ...v }),
          I &&
            h < hw &&
            (h++,
            typeof I == 'object' &&
              (I.placement && (m = I.placement),
              I.rects &&
                (i =
                  I.rects === !0
                    ? await u.getElementRects({ reference: e, floating: t, strategy: o })
                    : I.rects),
              ({ x: c, y: p } = vS(i, m, s))),
            (x = -1)));
      }
      return { x: c, y: p, placement: m, strategy: o, middlewareData: S };
    },
    wS = (e) => ({
      name: 'arrow',
      options: e,
      async fn(t) {
        let { x: a, y: l, placement: o, rects: n, platform: u, elements: r, middlewareData: s } = t,
          { element: i, padding: c = 0 } = ba(e, t) || {};
        if (i == null) return {};
        let p = Sd(c),
          m = { x: a, y: l },
          h = Fs(o),
          S = qs(h),
          x = await u.getDimensions(i),
          y = h === 'y',
          g = y ? 'top' : 'left',
          d = y ? 'bottom' : 'right',
          f = y ? 'clientHeight' : 'clientWidth',
          L = n.reference[S] + n.reference[h] - m[h] - n.floating[S],
          v = m[h] - n.reference[h],
          I = await (u.getOffsetParent == null ? void 0 : u.getOffsetParent(i)),
          C = I ? I[f] : 0;
        (!C || !(await (u.isElement == null ? void 0 : u.isElement(I)))) &&
          (C = r.floating[f] || n.floating[S]);
        let b = L / 2 - v / 2,
          A = C / 2 - x[S] / 2 - 1,
          T = Ca(p[g], A),
          D = Ca(p[d], A),
          F = T,
          K = C - x[S] - D,
          W = C / 2 - x[S] / 2 + b,
          le = zs(F, W, K),
          V =
            !s.arrow &&
            so(o) != null &&
            W !== le &&
            n.reference[S] / 2 - (W < F ? T : D) - x[S] / 2 < 0,
          J = V ? (W < F ? W - F : W - K) : 0;
        return {
          [h]: m[h] + J,
          data: { [h]: le, centerOffset: W - le - J, ...(V && { alignmentOffset: J }) },
          reset: V,
        };
      },
    });
  var RS = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: 'flip',
        options: e,
        async fn(t) {
          var a, l;
          let {
              placement: o,
              middlewareData: n,
              rects: u,
              initialPlacement: r,
              platform: s,
              elements: i,
            } = t,
            {
              mainAxis: c = !0,
              crossAxis: p = !0,
              fallbackPlacements: m,
              fallbackStrategy: h = 'bestFit',
              fallbackAxisSideDirection: S = 'none',
              flipAlignment: x = !0,
              ...y
            } = ba(e, t);
          if ((a = n.arrow) != null && a.alignmentOffset) return {};
          let g = Ia(o),
            d = ra(r),
            f = Ia(r) === r,
            L = await (s.isRTL == null ? void 0 : s.isRTL(i.floating)),
            v = m || (f || !x ? [Hu(r)] : LS(r)),
            I = S !== 'none';
          !m && I && v.push(...SS(r, x, S, L));
          let C = [r, ...v],
            b = await s.detectOverflow(t, y),
            A = [],
            T = ((l = n.flip) == null ? void 0 : l.overflows) || [];
          if ((c && A.push(b[g]), p)) {
            let W = xS(o, u, L);
            A.push(b[W[0]], b[W[1]]);
          }
          if (((T = [...T, { placement: o, overflows: A }]), !A.every((W) => W <= 0))) {
            var D, F;
            let W = (((D = n.flip) == null ? void 0 : D.index) || 0) + 1,
              le = C[W];
            if (
              le &&
              (!(p === 'alignment' ? d !== ra(le) : !1) ||
                T.every((_) => (ra(_.placement) === d ? _.overflows[0] > 0 : !0)))
            )
              return { data: { index: W, overflows: T }, reset: { placement: le } };
            let V =
              (F = T.filter((J) => J.overflows[0] <= 0).sort(
                (J, _) => J.overflows[1] - _.overflows[1],
              )[0]) == null
                ? void 0
                : F.placement;
            if (!V)
              switch (h) {
                case 'bestFit': {
                  var K;
                  let J =
                    (K = T.filter((_) => {
                      if (I) {
                        let ae = ra(_.placement);
                        return ae === d || ae === 'y';
                      }
                      return !0;
                    })
                      .map((_) => [
                        _.placement,
                        _.overflows.filter((ae) => ae > 0).reduce((ae, M) => ae + M, 0),
                      ])
                      .sort((_, ae) => _[1] - ae[1])[0]) == null
                      ? void 0
                      : K[0];
                  J && (V = J);
                  break;
                }
                case 'initialPlacement':
                  V = r;
                  break;
              }
            if (o !== V) return { reset: { placement: V } };
          }
          return {};
        },
      }
    );
  };
  function yS(e, t) {
    return {
      top: e.top - t.height,
      right: e.right - t.width,
      bottom: e.bottom - t.height,
      left: e.left - t.width,
    };
  }
  function CS(e) {
    return gS.some((t) => e[t] >= 0);
  }
  var AS = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: 'hide',
        options: e,
        async fn(t) {
          let { rects: a, platform: l } = t,
            { strategy: o = 'referenceHidden', ...n } = ba(e, t);
          switch (o) {
            case 'referenceHidden': {
              let u = await l.detectOverflow(t, { ...n, elementContext: 'reference' }),
                r = yS(u, a.reference);
              return { data: { referenceHiddenOffsets: r, referenceHidden: CS(r) } };
            }
            case 'escaped': {
              let u = await l.detectOverflow(t, { ...n, altBoundary: !0 }),
                r = yS(u, a.floating);
              return { data: { escapedOffsets: r, escaped: CS(r) } };
            }
            default:
              return {};
          }
        },
      }
    );
  };
  var TS = new Set(['left', 'top']);
  async function gw(e, t) {
    let { placement: a, platform: l, elements: o } = e,
      n = await (l.isRTL == null ? void 0 : l.isRTL(o.floating)),
      u = Ia(a),
      r = so(a),
      s = ra(a) === 'y',
      i = TS.has(u) ? -1 : 1,
      c = n && s ? -1 : 1,
      p = ba(t, e),
      {
        mainAxis: m,
        crossAxis: h,
        alignmentAxis: S,
      } = typeof p == 'number'
        ? { mainAxis: p, crossAxis: 0, alignmentAxis: null }
        : {
            mainAxis: p.mainAxis || 0,
            crossAxis: p.crossAxis || 0,
            alignmentAxis: p.alignmentAxis,
          };
    return (
      r && typeof S == 'number' && (h = r === 'end' ? S * -1 : S),
      s ? { x: h * c, y: m * i } : { x: m * i, y: h * c }
    );
  }
  var kS = function (e) {
      return (
        e === void 0 && (e = 0),
        {
          name: 'offset',
          options: e,
          async fn(t) {
            var a, l;
            let { x: o, y: n, placement: u, middlewareData: r } = t,
              s = await gw(t, e);
            return u === ((a = r.offset) == null ? void 0 : a.placement) &&
              (l = r.arrow) != null &&
              l.alignmentOffset
              ? {}
              : { x: o + s.x, y: n + s.y, data: { ...s, placement: u } };
          },
        }
      );
    },
    MS = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: 'shift',
          options: e,
          async fn(t) {
            let { x: a, y: l, placement: o, platform: n } = t,
              {
                mainAxis: u = !0,
                crossAxis: r = !1,
                limiter: s = {
                  fn: (g) => {
                    let { x: d, y: f } = g;
                    return { x: d, y: f };
                  },
                },
                ...i
              } = ba(e, t),
              c = { x: a, y: l },
              p = await n.detectOverflow(t, i),
              m = ra(Ia(o)),
              h = Us(m),
              S = c[h],
              x = c[m];
            if (u) {
              let g = h === 'y' ? 'top' : 'left',
                d = h === 'y' ? 'bottom' : 'right',
                f = S + p[g],
                L = S - p[d];
              S = zs(f, S, L);
            }
            if (r) {
              let g = m === 'y' ? 'top' : 'left',
                d = m === 'y' ? 'bottom' : 'right',
                f = x + p[g],
                L = x - p[d];
              x = zs(f, x, L);
            }
            let y = s.fn({ ...t, [h]: S, [m]: x });
            return { ...y, data: { x: y.x - a, y: y.y - l, enabled: { [h]: u, [m]: r } } };
          },
        }
      );
    },
    DS = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          options: e,
          fn(t) {
            let { x: a, y: l, placement: o, rects: n, middlewareData: u } = t,
              { offset: r = 0, mainAxis: s = !0, crossAxis: i = !0 } = ba(e, t),
              c = { x: a, y: l },
              p = ra(o),
              m = Us(p),
              h = c[m],
              S = c[p],
              x = ba(r, t),
              y =
                typeof x == 'number'
                  ? { mainAxis: x, crossAxis: 0 }
                  : { mainAxis: 0, crossAxis: 0, ...x };
            if (s) {
              let f = m === 'y' ? 'height' : 'width',
                L = n.reference[m] - n.floating[f] + y.mainAxis,
                v = n.reference[m] + n.reference[f] - y.mainAxis;
              h < L ? (h = L) : h > v && (h = v);
            }
            if (i) {
              var g, d;
              let f = m === 'y' ? 'width' : 'height',
                L = TS.has(Ia(o)),
                v =
                  n.reference[p] -
                  n.floating[f] +
                  ((L && ((g = u.offset) == null ? void 0 : g[p])) || 0) +
                  (L ? 0 : y.crossAxis),
                I =
                  n.reference[p] +
                  n.reference[f] +
                  (L ? 0 : ((d = u.offset) == null ? void 0 : d[p]) || 0) -
                  (L ? y.crossAxis : 0);
              S < v ? (S = v) : S > I && (S = I);
            }
            return { [m]: h, [p]: S };
          },
        }
      );
    },
    ES = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: 'size',
          options: e,
          async fn(t) {
            var a, l;
            let { placement: o, rects: n, platform: u, elements: r } = t,
              { apply: s = () => {}, ...i } = ba(e, t),
              c = await u.detectOverflow(t, i),
              p = Ia(o),
              m = so(o),
              h = ra(o) === 'y',
              { width: S, height: x } = n.floating,
              y,
              g;
            p === 'top' || p === 'bottom'
              ? ((y = p),
                (g =
                  m === ((await (u.isRTL == null ? void 0 : u.isRTL(r.floating))) ? 'start' : 'end')
                    ? 'left'
                    : 'right'))
              : ((g = p), (y = m === 'end' ? 'top' : 'bottom'));
            let d = x - c.top - c.bottom,
              f = S - c.left - c.right,
              L = Ca(x - c[y], d),
              v = Ca(S - c[g], f),
              I = !t.middlewareData.shift,
              C = L,
              b = v;
            if (
              ((a = t.middlewareData.shift) != null && a.enabled.x && (b = f),
              (l = t.middlewareData.shift) != null && l.enabled.y && (C = d),
              I && !m)
            ) {
              let T = pt(c.left, 0),
                D = pt(c.right, 0),
                F = pt(c.top, 0),
                K = pt(c.bottom, 0);
              h
                ? (b = S - 2 * (T !== 0 || D !== 0 ? T + D : pt(c.left, c.right)))
                : (C = x - 2 * (F !== 0 || K !== 0 ? F + K : pt(c.top, c.bottom)));
            }
            await s({ ...t, availableWidth: b, availableHeight: C });
            let A = await u.getDimensions(r.floating);
            return S !== A.width || x !== A.height ? { reset: { rects: !0 } } : {};
          },
        }
      );
    };
  function Gs() {
    return typeof window < 'u';
  }
  function mo(e) {
    return BS(e) ? (e.nodeName || '').toLowerCase() : '#document';
  }
  function bt(e) {
    var t;
    return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
  }
  function sa(e) {
    var t;
    return (t = (BS(e) ? e.ownerDocument : e.document) || window.document) == null
      ? void 0
      : t.documentElement;
  }
  function BS(e) {
    return Gs() ? e instanceof Node || e instanceof bt(e).Node : !1;
  }
  function Wt(e) {
    return Gs() ? e instanceof Element || e instanceof bt(e).Element : !1;
  }
  function wa(e) {
    return Gs() ? e instanceof HTMLElement || e instanceof bt(e).HTMLElement : !1;
  }
  function OS(e) {
    return !Gs() || typeof ShadowRoot > 'u'
      ? !1
      : e instanceof ShadowRoot || e instanceof bt(e).ShadowRoot;
  }
  function bn(e) {
    let { overflow: t, overflowX: a, overflowY: l, display: o } = Jt(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + l + a) && o !== 'inline' && o !== 'contents';
  }
  function PS(e) {
    return /^(table|td|th)$/.test(mo(e));
  }
  function qu(e) {
    try {
      if (e.matches(':popover-open')) return !0;
    } catch {}
    try {
      return e.matches(':modal');
    } catch {
      return !1;
    }
  }
  var xw = /transform|translate|scale|rotate|perspective|filter/,
    Lw = /paint|layout|strict|content/,
    fo = (e) => !!e && e !== 'none',
    vd;
  function Vs(e) {
    let t = Wt(e) ? Jt(e) : e;
    return (
      fo(t.transform) ||
      fo(t.translate) ||
      fo(t.scale) ||
      fo(t.rotate) ||
      fo(t.perspective) ||
      (!Xs() && (fo(t.backdropFilter) || fo(t.filter))) ||
      xw.test(t.willChange || '') ||
      Lw.test(t.contain || '')
    );
  }
  function NS(e) {
    let t = Qa(e);
    for (; wa(t) && !po(t);) {
      if (Vs(t)) return t;
      if (qu(t)) return null;
      t = Qa(t);
    }
    return null;
  }
  function Xs() {
    return (
      vd == null &&
        (vd = typeof CSS < 'u' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none')),
      vd
    );
  }
  function po(e) {
    return /^(html|body|#document)$/.test(mo(e));
  }
  function Jt(e) {
    return bt(e).getComputedStyle(e);
  }
  function Fu(e) {
    return Wt(e)
      ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
      : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
  }
  function Qa(e) {
    if (mo(e) === 'html') return e;
    let t = e.assignedSlot || e.parentNode || (OS(e) && e.host) || sa(e);
    return OS(t) ? t.host : t;
  }
  function _S(e) {
    let t = Qa(e);
    return po(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : wa(t) && bn(t) ? t : _S(t);
  }
  function co(e, t, a) {
    var l;
    (t === void 0 && (t = []), a === void 0 && (a = !0));
    let o = _S(e),
      n = o === ((l = e.ownerDocument) == null ? void 0 : l.body),
      u = bt(o);
    if (n) {
      let r = js(u);
      return t.concat(u, u.visualViewport || [], bn(o) ? o : [], r && a ? co(r) : []);
    } else return t.concat(o, co(o, [], a));
  }
  function js(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
  }
  function qS(e) {
    let t = Jt(e),
      a = parseFloat(t.width) || 0,
      l = parseFloat(t.height) || 0,
      o = wa(e),
      n = o ? e.offsetWidth : a,
      u = o ? e.offsetHeight : l,
      r = zu(a) !== n || zu(l) !== u;
    return (r && ((a = n), (l = u)), { width: a, height: l, $: r });
  }
  function Cd(e) {
    return Wt(e) ? e : e.contextElement;
  }
  function In(e) {
    let t = Cd(e);
    if (!wa(t)) return ua(1);
    let a = t.getBoundingClientRect(),
      { width: l, height: o, $: n } = qS(t),
      u = (n ? zu(a.width) : a.width) / l,
      r = (n ? zu(a.height) : a.height) / o;
    return (
      (!u || !Number.isFinite(u)) && (u = 1),
      (!r || !Number.isFinite(r)) && (r = 1),
      { x: u, y: r }
    );
  }
  var Sw = ua(0);
  function FS(e) {
    let t = bt(e);
    return !Xs() || !t.visualViewport
      ? Sw
      : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
  }
  function vw(e, t, a) {
    return (t === void 0 && (t = !1), !a || (t && a !== bt(e)) ? !1 : t);
  }
  function ho(e, t, a, l) {
    (t === void 0 && (t = !1), a === void 0 && (a = !1));
    let o = e.getBoundingClientRect(),
      n = Cd(e),
      u = ua(1);
    t && (l ? Wt(l) && (u = In(l)) : (u = In(e)));
    let r = vw(n, a, l) ? FS(n) : ua(0),
      s = (o.left + r.x) / u.x,
      i = (o.top + r.y) / u.y,
      c = o.width / u.x,
      p = o.height / u.y;
    if (n) {
      let m = bt(n),
        h = l && Wt(l) ? bt(l) : l,
        S = m,
        x = js(S);
      for (; x && l && h !== S;) {
        let y = In(x),
          g = x.getBoundingClientRect(),
          d = Jt(x),
          f = g.left + (x.clientLeft + parseFloat(d.paddingLeft)) * y.x,
          L = g.top + (x.clientTop + parseFloat(d.paddingTop)) * y.y;
        ((s *= y.x),
          (i *= y.y),
          (c *= y.x),
          (p *= y.y),
          (s += f),
          (i += L),
          (S = bt(x)),
          (x = js(S)));
      }
    }
    return io({ width: c, height: p, x: s, y: i });
  }
  function Ys(e, t) {
    let a = Fu(e).scrollLeft;
    return t ? t.left + a : ho(sa(e)).left + a;
  }
  function GS(e, t) {
    let a = e.getBoundingClientRect(),
      l = a.left + t.scrollLeft - Ys(e, a),
      o = a.top + t.scrollTop;
    return { x: l, y: o };
  }
  function yw(e) {
    let { elements: t, rect: a, offsetParent: l, strategy: o } = e,
      n = o === 'fixed',
      u = sa(l),
      r = t ? qu(t.floating) : !1;
    if (l === u || (r && n)) return a;
    let s = { scrollLeft: 0, scrollTop: 0 },
      i = ua(1),
      c = ua(0),
      p = wa(l);
    if ((p || (!p && !n)) && ((mo(l) !== 'body' || bn(u)) && (s = Fu(l)), p)) {
      let h = ho(l);
      ((i = In(l)), (c.x = h.x + l.clientLeft), (c.y = h.y + l.clientTop));
    }
    let m = u && !p && !n ? GS(u, s) : ua(0);
    return {
      width: a.width * i.x,
      height: a.height * i.y,
      x: a.x * i.x - s.scrollLeft * i.x + c.x + m.x,
      y: a.y * i.y - s.scrollTop * i.y + c.y + m.y,
    };
  }
  function Cw(e) {
    return Array.from(e.getClientRects());
  }
  function bw(e) {
    let t = sa(e),
      a = Fu(e),
      l = e.ownerDocument.body,
      o = pt(t.scrollWidth, t.clientWidth, l.scrollWidth, l.clientWidth),
      n = pt(t.scrollHeight, t.clientHeight, l.scrollHeight, l.clientHeight),
      u = -a.scrollLeft + Ys(e),
      r = -a.scrollTop;
    return (
      Jt(l).direction === 'rtl' && (u += pt(t.clientWidth, l.clientWidth) - o),
      { width: o, height: n, x: u, y: r }
    );
  }
  var HS = 25;
  function Iw(e, t) {
    let a = bt(e),
      l = sa(e),
      o = a.visualViewport,
      n = l.clientWidth,
      u = l.clientHeight,
      r = 0,
      s = 0;
    if (o) {
      ((n = o.width), (u = o.height));
      let c = Xs();
      (!c || (c && t === 'fixed')) && ((r = o.offsetLeft), (s = o.offsetTop));
    }
    let i = Ys(l);
    if (i <= 0) {
      let c = l.ownerDocument,
        p = c.body,
        m = getComputedStyle(p),
        h =
          (c.compatMode === 'CSS1Compat' && parseFloat(m.marginLeft) + parseFloat(m.marginRight)) ||
          0,
        S = Math.abs(l.clientWidth - p.clientWidth - h);
      S <= HS && (n -= S);
    } else i <= HS && (n += i);
    return { width: n, height: u, x: r, y: s };
  }
  function ww(e, t) {
    let a = ho(e, !0, t === 'fixed'),
      l = a.top + e.clientTop,
      o = a.left + e.clientLeft,
      n = wa(e) ? In(e) : ua(1),
      u = e.clientWidth * n.x,
      r = e.clientHeight * n.y,
      s = o * n.x,
      i = l * n.y;
    return { width: u, height: r, x: s, y: i };
  }
  function zS(e, t, a) {
    let l;
    if (t === 'viewport') l = Iw(e, a);
    else if (t === 'document') l = bw(sa(e));
    else if (Wt(t)) l = ww(t, a);
    else {
      let o = FS(e);
      l = { x: t.x - o.x, y: t.y - o.y, width: t.width, height: t.height };
    }
    return io(l);
  }
  function VS(e, t) {
    let a = Qa(e);
    return a === t || !Wt(a) || po(a) ? !1 : Jt(a).position === 'fixed' || VS(a, t);
  }
  function Rw(e, t) {
    let a = t.get(e);
    if (a) return a;
    let l = co(e, [], !1).filter((r) => Wt(r) && mo(r) !== 'body'),
      o = null,
      n = Jt(e).position === 'fixed',
      u = n ? Qa(e) : e;
    for (; Wt(u) && !po(u);) {
      let r = Jt(u),
        s = Vs(u);
      (!s && r.position === 'fixed' && (o = null),
        (
          n
            ? !s && !o
            : (!s &&
                r.position === 'static' &&
                !!o &&
                (o.position === 'absolute' || o.position === 'fixed')) ||
              (bn(u) && !s && VS(e, u))
        )
          ? (l = l.filter((c) => c !== u))
          : (o = r),
        (u = Qa(u)));
    }
    return (t.set(e, l), l);
  }
  function Aw(e) {
    let { element: t, boundary: a, rootBoundary: l, strategy: o } = e,
      u = [...(a === 'clippingAncestors' ? (qu(t) ? [] : Rw(t, this._c)) : [].concat(a)), l],
      r = zS(t, u[0], o),
      s = r.top,
      i = r.right,
      c = r.bottom,
      p = r.left;
    for (let m = 1; m < u.length; m++) {
      let h = zS(t, u[m], o);
      ((s = pt(h.top, s)), (i = Ca(h.right, i)), (c = Ca(h.bottom, c)), (p = pt(h.left, p)));
    }
    return { width: i - p, height: c - s, x: p, y: s };
  }
  function Tw(e) {
    let { width: t, height: a } = qS(e);
    return { width: t, height: a };
  }
  function kw(e, t, a) {
    let l = wa(t),
      o = sa(t),
      n = a === 'fixed',
      u = ho(e, !0, n, t),
      r = { scrollLeft: 0, scrollTop: 0 },
      s = ua(0);
    function i() {
      s.x = Ys(o);
    }
    if (l || (!l && !n))
      if (((mo(t) !== 'body' || bn(o)) && (r = Fu(t)), l)) {
        let h = ho(t, !0, n, t);
        ((s.x = h.x + t.clientLeft), (s.y = h.y + t.clientTop));
      } else o && i();
    n && !l && o && i();
    let c = o && !l && !n ? GS(o, r) : ua(0),
      p = u.left + r.scrollLeft - s.x - c.x,
      m = u.top + r.scrollTop - s.y - c.y;
    return { x: p, y: m, width: u.width, height: u.height };
  }
  function yd(e) {
    return Jt(e).position === 'static';
  }
  function US(e, t) {
    if (!wa(e) || Jt(e).position === 'fixed') return null;
    if (t) return t(e);
    let a = e.offsetParent;
    return (sa(e) === a && (a = a.ownerDocument.body), a);
  }
  function XS(e, t) {
    let a = bt(e);
    if (qu(e)) return a;
    if (!wa(e)) {
      let o = Qa(e);
      for (; o && !po(o);) {
        if (Wt(o) && !yd(o)) return o;
        o = Qa(o);
      }
      return a;
    }
    let l = US(e, t);
    for (; l && PS(l) && yd(l);) l = US(l, t);
    return l && po(l) && yd(l) && !Vs(l) ? a : l || NS(e) || a;
  }
  var Mw = async function (e) {
    let t = this.getOffsetParent || XS,
      a = this.getDimensions,
      l = await a(e.floating);
    return {
      reference: kw(e.reference, await t(e.floating), e.strategy),
      floating: { x: 0, y: 0, width: l.width, height: l.height },
    };
  };
  function Dw(e) {
    return Jt(e).direction === 'rtl';
  }
  var jS = {
    convertOffsetParentRelativeRectToViewportRelativeRect: yw,
    getDocumentElement: sa,
    getClippingRect: Aw,
    getOffsetParent: XS,
    getElementRects: Mw,
    getClientRects: Cw,
    getDimensions: Tw,
    getScale: In,
    isElement: Wt,
    isRTL: Dw,
  };
  function YS(e, t) {
    return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
  }
  function Ew(e, t) {
    let a = null,
      l,
      o = sa(e);
    function n() {
      var r;
      (clearTimeout(l), (r = a) == null || r.disconnect(), (a = null));
    }
    function u(r, s) {
      (r === void 0 && (r = !1), s === void 0 && (s = 1), n());
      let i = e.getBoundingClientRect(),
        { left: c, top: p, width: m, height: h } = i;
      if ((r || t(), !m || !h)) return;
      let S = Uu(p),
        x = Uu(o.clientWidth - (c + m)),
        y = Uu(o.clientHeight - (p + h)),
        g = Uu(c),
        f = {
          rootMargin: -S + 'px ' + -x + 'px ' + -y + 'px ' + -g + 'px',
          threshold: pt(0, Ca(1, s)) || 1,
        },
        L = !0;
      function v(I) {
        let C = I[0].intersectionRatio;
        if (C !== s) {
          if (!L) return u();
          C
            ? u(!1, C)
            : (l = setTimeout(() => {
                u(!1, 1e-7);
              }, 1e3));
        }
        (C === 1 && !YS(i, e.getBoundingClientRect()) && u(), (L = !1));
      }
      try {
        a = new IntersectionObserver(v, { ...f, root: o.ownerDocument });
      } catch {
        a = new IntersectionObserver(v, f);
      }
      a.observe(e);
    }
    return (u(!0), n);
  }
  function bd(e, t, a, l) {
    l === void 0 && (l = {});
    let {
        ancestorScroll: o = !0,
        ancestorResize: n = !0,
        elementResize: u = typeof ResizeObserver == 'function',
        layoutShift: r = typeof IntersectionObserver == 'function',
        animationFrame: s = !1,
      } = l,
      i = Cd(e),
      c = o || n ? [...(i ? co(i) : []), ...(t ? co(t) : [])] : [];
    c.forEach((g) => {
      (o && g.addEventListener('scroll', a, { passive: !0 }), n && g.addEventListener('resize', a));
    });
    let p = i && r ? Ew(i, a) : null,
      m = -1,
      h = null;
    u &&
      ((h = new ResizeObserver((g) => {
        let [d] = g;
        (d &&
          d.target === i &&
          h &&
          t &&
          (h.unobserve(t),
          cancelAnimationFrame(m),
          (m = requestAnimationFrame(() => {
            var f;
            (f = h) == null || f.observe(t);
          }))),
          a());
      })),
      i && !s && h.observe(i),
      t && h.observe(t));
    let S,
      x = s ? ho(e) : null;
    s && y();
    function y() {
      let g = ho(e);
      (x && !YS(x, g) && a(), (x = g), (S = requestAnimationFrame(y)));
    }
    return (
      a(),
      () => {
        var g;
        (c.forEach((d) => {
          (o && d.removeEventListener('scroll', a), n && d.removeEventListener('resize', a));
        }),
          p?.(),
          (g = h) == null || g.disconnect(),
          (h = null),
          s && cancelAnimationFrame(S));
      }
    );
  }
  var KS = kS;
  var ZS = MS,
    QS = RS,
    WS = ES,
    JS = AS,
    Id = wS;
  var $S = DS,
    wd = (e, t, a) => {
      let l = new Map(),
        o = { platform: jS, ...a },
        n = { ...o.platform, _c: l };
      return IS(e, t, { ...o, platform: n });
    };
  var ze = R(P(), 1),
    tv = R(P(), 1),
    av = R(Ao(), 1),
    Ow = typeof document < 'u',
    Bw = function () {},
    Ks = Ow ? tv.useLayoutEffect : Bw;
  function Zs(e, t) {
    if (e === t) return !0;
    if (typeof e != typeof t) return !1;
    if (typeof e == 'function' && e.toString() === t.toString()) return !0;
    let a, l, o;
    if (e && t && typeof e == 'object') {
      if (Array.isArray(e)) {
        if (((a = e.length), a !== t.length)) return !1;
        for (l = a; l-- !== 0;) if (!Zs(e[l], t[l])) return !1;
        return !0;
      }
      if (((o = Object.keys(e)), (a = o.length), a !== Object.keys(t).length)) return !1;
      for (l = a; l-- !== 0;) if (!{}.hasOwnProperty.call(t, o[l])) return !1;
      for (l = a; l-- !== 0;) {
        let n = o[l];
        if (!(n === '_owner' && e.$$typeof) && !Zs(e[n], t[n])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }
  function lv(e) {
    return typeof window > 'u' ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
  }
  function ev(e, t) {
    let a = lv(e);
    return Math.round(t * a) / a;
  }
  function Rd(e) {
    let t = ze.useRef(e);
    return (
      Ks(() => {
        t.current = e;
      }),
      t
    );
  }
  function ov(e) {
    e === void 0 && (e = {});
    let {
        placement: t = 'bottom',
        strategy: a = 'absolute',
        middleware: l = [],
        platform: o,
        elements: { reference: n, floating: u } = {},
        transform: r = !0,
        whileElementsMounted: s,
        open: i,
      } = e,
      [c, p] = ze.useState({
        x: 0,
        y: 0,
        strategy: a,
        placement: t,
        middlewareData: {},
        isPositioned: !1,
      }),
      [m, h] = ze.useState(l);
    Zs(m, l) || h(l);
    let [S, x] = ze.useState(null),
      [y, g] = ze.useState(null),
      d = ze.useCallback((_) => {
        _ !== I.current && ((I.current = _), x(_));
      }, []),
      f = ze.useCallback((_) => {
        _ !== C.current && ((C.current = _), g(_));
      }, []),
      L = n || S,
      v = u || y,
      I = ze.useRef(null),
      C = ze.useRef(null),
      b = ze.useRef(c),
      A = s != null,
      T = Rd(s),
      D = Rd(o),
      F = Rd(i),
      K = ze.useCallback(() => {
        if (!I.current || !C.current) return;
        let _ = { placement: t, strategy: a, middleware: m };
        (D.current && (_.platform = D.current),
          wd(I.current, C.current, _).then((ae) => {
            let M = { ...ae, isPositioned: F.current !== !1 };
            W.current &&
              !Zs(b.current, M) &&
              ((b.current = M),
              av.flushSync(() => {
                p(M);
              }));
          }));
      }, [m, t, a, D, F]);
    Ks(() => {
      i === !1 &&
        b.current.isPositioned &&
        ((b.current.isPositioned = !1), p((_) => ({ ..._, isPositioned: !1 })));
    }, [i]);
    let W = ze.useRef(!1);
    (Ks(
      () => (
        (W.current = !0),
        () => {
          W.current = !1;
        }
      ),
      [],
    ),
      Ks(() => {
        if ((L && (I.current = L), v && (C.current = v), L && v)) {
          if (T.current) return T.current(L, v, K);
          K();
        }
      }, [L, v, K, T, A]));
    let le = ze.useMemo(
        () => ({ reference: I, floating: C, setReference: d, setFloating: f }),
        [d, f],
      ),
      V = ze.useMemo(() => ({ reference: L, floating: v }), [L, v]),
      J = ze.useMemo(() => {
        let _ = { position: a, left: 0, top: 0 };
        if (!V.floating) return _;
        let ae = ev(V.floating, c.x),
          M = ev(V.floating, c.y);
        return r
          ? {
              ..._,
              transform: 'translate(' + ae + 'px, ' + M + 'px)',
              ...(lv(V.floating) >= 1.5 && { willChange: 'transform' }),
            }
          : { position: a, left: ae, top: M };
      }, [a, r, V.floating, c.x, c.y]);
    return ze.useMemo(
      () => ({ ...c, update: K, refs: le, elements: V, floatingStyles: J }),
      [c, K, le, V, J],
    );
  }
  var Pw = (e) => {
      function t(a) {
        return {}.hasOwnProperty.call(a, 'current');
      }
      return {
        name: 'arrow',
        options: e,
        fn(a) {
          let { element: l, padding: o } = typeof e == 'function' ? e(a) : e;
          return l && t(l)
            ? l.current != null
              ? Id({ element: l.current, padding: o }).fn(a)
              : {}
            : l
              ? Id({ element: l, padding: o }).fn(a)
              : {};
        },
      };
    },
    nv = (e, t) => {
      let a = KS(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    },
    uv = (e, t) => {
      let a = ZS(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    },
    rv = (e, t) => ({ fn: $S(e).fn, options: [e, t] }),
    sv = (e, t) => {
      let a = QS(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    },
    iv = (e, t) => {
      let a = WS(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    };
  var fv = (e, t) => {
    let a = JS(e);
    return { name: a.name, fn: a.fn, options: [e, t] };
  };
  var cv = (e, t) => {
    let a = Pw(e);
    return { name: a.name, fn: a.fn, options: [e, t] };
  };
  var dv = R(P(), 1);
  var Ad = R(U(), 1),
    Nw = 'Arrow',
    mv = dv.forwardRef((e, t) => {
      let { children: a, width: l = 10, height: o = 5, ...n } = e;
      return (0, Ad.jsx)(me.svg, {
        ...n,
        ref: t,
        width: l,
        height: o,
        viewBox: '0 0 30 10',
        preserveAspectRatio: 'none',
        children: e.asChild ? a : (0, Ad.jsx)('polygon', { points: '0,0 30,0 15,10' }),
      });
    });
  mv.displayName = Nw;
  var pv = mv;
  var hv = R(P(), 1);
  function gv(e) {
    let [t, a] = hv.useState(void 0);
    return (
      Ae(() => {
        if (e) {
          a({ width: e.offsetWidth, height: e.offsetHeight });
          let l = new ResizeObserver((o) => {
            if (!Array.isArray(o) || !o.length) return;
            let n = o[0],
              u,
              r;
            if ('borderBoxSize' in n) {
              let s = n.borderBoxSize,
                i = Array.isArray(s) ? s[0] : s;
              ((u = i.inlineSize), (r = i.blockSize));
            } else ((u = e.offsetWidth), (r = e.offsetHeight));
            a({ width: u, height: r });
          });
          return (l.observe(e, { box: 'border-box' }), () => l.unobserve(e));
        } else a(void 0);
      }, [e]),
      t
    );
  }
  var Ml = R(U(), 1);
  var Td = 'Popper',
    [xv, kd] = vn(Td),
    [Hw, Lv] = xv(Td),
    Sv = (e) => {
      let { __scopePopper: t, children: a } = e,
        [l, o] = at.useState(null),
        [n, u] = at.useState(void 0);
      return (0, Ml.jsx)(Hw, {
        scope: t,
        anchor: l,
        onAnchorChange: o,
        placementState: n,
        setPlacementState: u,
        children: a,
      });
    };
  Sv.displayName = Td;
  var vv = 'PopperAnchor',
    yv = at.forwardRef((e, t) => {
      let { __scopePopper: a, virtualRef: l, ...o } = e,
        n = Lv(vv, a),
        u = at.useRef(null),
        r = n.onAnchorChange,
        s = at.useCallback(
          (S) => {
            ((u.current = S), S && r(S));
          },
          [r],
        ),
        i = Re(t, s),
        c = at.useRef(null);
      at.useEffect(() => {
        if (!l) return;
        let S = c.current;
        ((c.current = l.current), S !== c.current && r(c.current));
      });
      let p = n.placementState && Dd(n.placementState),
        m = p?.[0],
        h = p?.[1];
      return l
        ? null
        : (0, Ml.jsx)(me.div, {
            'data-radix-popper-side': m,
            'data-radix-popper-align': h,
            ...o,
            ref: i,
          });
    });
  yv.displayName = vv;
  var Md = 'PopperContent',
    [zw, Uw] = xv(Md),
    Cv = at.forwardRef((e, t) => {
      let {
          __scopePopper: a,
          side: l = 'bottom',
          sideOffset: o = 0,
          align: n = 'center',
          alignOffset: u = 0,
          arrowPadding: r = 0,
          avoidCollisions: s = !0,
          collisionBoundary: i = [],
          collisionPadding: c = 0,
          sticky: p = 'partial',
          hideWhenDetached: m = !1,
          updatePositionStrategy: h = 'optimized',
          onPlaced: S,
          ...x
        } = e,
        y = Lv(Md, a),
        [g, d] = at.useState(null),
        f = Re(t, d),
        [L, v] = at.useState(null),
        I = gv(L),
        C = I?.width ?? 0,
        b = I?.height ?? 0,
        A = l + (n !== 'center' ? '-' + n : ''),
        T = typeof c == 'number' ? c : { top: 0, right: 0, bottom: 0, left: 0, ...c },
        D = Array.isArray(i) ? i : [i],
        F = D.length > 0,
        K = { padding: T, boundary: D.filter(Fw), altBoundary: F },
        {
          refs: W,
          floatingStyles: le,
          placement: V,
          isPositioned: J,
          middlewareData: _,
        } = ov({
          strategy: 'fixed',
          placement: A,
          whileElementsMounted: (...ge) => bd(...ge, { animationFrame: h === 'always' }),
          elements: { reference: y.anchor },
          middleware: [
            nv({ mainAxis: o + b, alignmentAxis: u }),
            s &&
              uv({ mainAxis: !0, crossAxis: !1, limiter: p === 'partial' ? rv() : void 0, ...K }),
            s && sv({ ...K }),
            iv({
              ...K,
              apply: ({ elements: ge, rects: ee, availableWidth: fe, availableHeight: ue }) => {
                let { width: Le, height: Rt } = ee.reference,
                  Ze = ge.floating.style;
                (Ze.setProperty('--radix-popper-available-width', `${fe}px`),
                  Ze.setProperty('--radix-popper-available-height', `${ue}px`),
                  Ze.setProperty('--radix-popper-anchor-width', `${Le}px`),
                  Ze.setProperty('--radix-popper-anchor-height', `${Rt}px`));
              },
            }),
            L && cv({ element: L, padding: r }),
            Gw({ arrowWidth: C, arrowHeight: b }),
            m && fv({ strategy: 'referenceHidden', ...K, boundary: F ? K.boundary : void 0 }),
          ],
        }),
        ae = y.setPlacementState;
      Ae(
        () => (
          ae(V),
          () => {
            ae(void 0);
          }
        ),
        [V, ae],
      );
      let [M, wt] = Dd(V),
        Ue = Ht(S);
      Ae(() => {
        J && Ue?.();
      }, [J, Ue]);
      let rt = _.arrow?.x,
        st = _.arrow?.y,
        ke = _.arrow?.centerOffset !== 0,
        [Te, H] = at.useState();
      return (
        Ae(() => {
          g && H(window.getComputedStyle(g).zIndex);
        }, [g]),
        (0, Ml.jsx)('div', {
          ref: W.setFloating,
          'data-radix-popper-content-wrapper': '',
          style: {
            ...le,
            transform: J ? le.transform : 'translate(0, -200%)',
            minWidth: 'max-content',
            zIndex: Te,
            '--radix-popper-transform-origin': [_.transformOrigin?.x, _.transformOrigin?.y].join(
              ' ',
            ),
            ...(_.hide?.referenceHidden && { visibility: 'hidden', pointerEvents: 'none' }),
          },
          dir: e.dir,
          children: (0, Ml.jsx)(zw, {
            scope: a,
            placedSide: M,
            placedAlign: wt,
            onArrowChange: v,
            arrowX: rt,
            arrowY: st,
            shouldHideArrow: ke,
            children: (0, Ml.jsx)(me.div, {
              'data-side': M,
              'data-align': wt,
              ...x,
              ref: f,
              style: { ...x.style, animation: J ? void 0 : 'none' },
            }),
          }),
        })
      );
    });
  Cv.displayName = Md;
  var bv = 'PopperArrow',
    qw = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' },
    Iv = at.forwardRef(function (t, a) {
      let { __scopePopper: l, ...o } = t,
        n = Uw(bv, l),
        u = qw[n.placedSide];
      return (0, Ml.jsx)('span', {
        ref: n.onArrowChange,
        style: {
          position: 'absolute',
          left: n.arrowX,
          top: n.arrowY,
          [u]: 0,
          transformOrigin: { top: '', right: '0 0', bottom: 'center 0', left: '100% 0' }[
            n.placedSide
          ],
          transform: {
            top: 'translateY(100%)',
            right: 'translateY(50%) rotate(90deg) translateX(-50%)',
            bottom: 'rotate(180deg)',
            left: 'translateY(50%) rotate(-90deg) translateX(50%)',
          }[n.placedSide],
          visibility: n.shouldHideArrow ? 'hidden' : void 0,
        },
        children: (0, Ml.jsx)(pv, { ...o, ref: a, style: { ...o.style, display: 'block' } }),
      });
    });
  Iv.displayName = bv;
  function Fw(e) {
    return e !== null;
  }
  var Gw = (e) => ({
    name: 'transformOrigin',
    options: e,
    fn(t) {
      let { placement: a, rects: l, middlewareData: o } = t,
        u = o.arrow?.centerOffset !== 0,
        r = u ? 0 : e.arrowWidth,
        s = u ? 0 : e.arrowHeight,
        [i, c] = Dd(a),
        p = { start: '0%', center: '50%', end: '100%' }[c],
        m = (o.arrow?.x ?? 0) + r / 2,
        h = (o.arrow?.y ?? 0) + s / 2,
        S = '',
        x = '';
      return (
        i === 'bottom'
          ? ((S = u ? p : `${m}px`), (x = `${-s}px`))
          : i === 'top'
            ? ((S = u ? p : `${m}px`), (x = `${l.floating.height + s}px`))
            : i === 'right'
              ? ((S = `${-s}px`), (x = u ? p : `${h}px`))
              : i === 'left' && ((S = `${l.floating.width + s}px`), (x = u ? p : `${h}px`)),
        { data: { x: S, y: x } }
      );
    },
  });
  function Dd(e) {
    let [t, a = 'center'] = e.split('-');
    return [t, a];
  }
  var wv = Sv,
    Rv = yv,
    Av = Cv,
    Tv = Iv;
  var Qs = R(P(), 1),
    kv = R(Ao(), 1);
  var Mv = R(U(), 1),
    Xw = 'Portal',
    Ed = Qs.forwardRef((e, t) => {
      let { container: a, ...l } = e,
        [o, n] = Qs.useState(!1);
      Ae(() => n(!0), []);
      let u = a || (o && globalThis?.document?.body);
      return u ? kv.createPortal((0, Mv.jsx)(me.div, { ...l, ref: t }), u) : null;
    });
  Ed.displayName = Xw;
  var lt = R(P(), 1);
  var Ev = R(P(), 1);
  function jw(e, t) {
    return Ev.useReducer((a, l) => t[a][l] ?? a, e);
  }
  var Od = (e) => {
    let { present: t, children: a } = e,
      l = Yw(t),
      o = typeof a == 'function' ? a({ present: l.isPresent }) : lt.Children.only(a),
      n = Kw(l.ref, Zw(o));
    return typeof a == 'function' || l.isPresent ? lt.cloneElement(o, { ref: n }) : null;
  };
  Od.displayName = 'Presence';
  function Yw(e) {
    let [t, a] = lt.useState(),
      l = lt.useRef(null),
      o = lt.useRef(e),
      n = lt.useRef('none'),
      u = lt.useRef(void 0),
      r = e ? 'mounted' : 'unmounted',
      [s, i] = jw(r, {
        mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
        unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
        unmounted: { MOUNT: 'mounted' },
      });
    return (
      lt.useEffect(() => {
        s === 'mounted'
          ? ((n.current = u.current ?? Gu(l.current)), (u.current = void 0))
          : (n.current = 'none');
      }, [s]),
      Ae(() => {
        let c = l.current,
          p = o.current;
        if (p !== e) {
          let h = n.current,
            S = Gu(c);
          (e
            ? ((u.current = S), i('MOUNT'))
            : S === 'none' || c?.display === 'none'
              ? i('UNMOUNT')
              : i(p && h !== S ? 'ANIMATION_OUT' : 'UNMOUNT'),
            (o.current = e));
        }
      }, [e, i]),
      Ae(() => {
        if (t) {
          let c,
            p = t.ownerDocument.defaultView ?? window,
            m = (S) => {
              let y = Gu(l.current).includes(CSS.escape(S.animationName));
              if (S.target === t && y && (i('ANIMATION_END'), !o.current)) {
                let g = t.style.animationFillMode;
                ((t.style.animationFillMode = 'forwards'),
                  (c = p.setTimeout(() => {
                    t.style.animationFillMode === 'forwards' && (t.style.animationFillMode = g);
                  })));
              }
            },
            h = (S) => {
              S.target === t && (n.current = Gu(l.current));
            };
          return (
            t.addEventListener('animationstart', h),
            t.addEventListener('animationcancel', m),
            t.addEventListener('animationend', m),
            () => {
              (p.clearTimeout(c),
                t.removeEventListener('animationstart', h),
                t.removeEventListener('animationcancel', m),
                t.removeEventListener('animationend', m));
            }
          );
        } else i('ANIMATION_END');
      }, [t, i]),
      {
        isPresent: ['mounted', 'unmountSuspended'].includes(s),
        ref: lt.useCallback((c) => {
          if (c) {
            let p = getComputedStyle(c);
            ((l.current = p), (u.current = Gu(p)));
          } else l.current = null;
          a(c);
        }, []),
      }
    );
  }
  function Dv(e, t) {
    if (typeof e == 'function') return e(t);
    e != null && (e.current = t);
  }
  function Kw(...e) {
    let t = lt.useRef(e);
    return (
      (t.current = e),
      lt.useCallback((a) => {
        let l = t.current,
          o = !1,
          n = l.map((u) => {
            let r = Dv(u, a);
            return (!o && typeof r == 'function' && (o = !0), r);
          });
        if (o)
          return () => {
            for (let u = 0; u < n.length; u++) {
              let r = n[u];
              typeof r == 'function' ? r() : Dv(l[u], null);
            }
          };
      }, [])
    );
  }
  function Gu(e) {
    return e?.animationName || 'none';
  }
  function Zw(e) {
    let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
      a = t && 'isReactWarning' in t && t.isReactWarning;
    return a
      ? e.ref
      : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
        (a = t && 'isReactWarning' in t && t.isReactWarning),
        a ? e.props.ref : e.props.ref || e.ref);
  }
  var $t = R(P(), 1);
  var Ws = R(P(), 1);
  var Qw = $t[' useInsertionEffect '.trim().toString()] || Ae;
  function Bd({ prop: e, defaultProp: t, onChange: a = () => {}, caller: l }) {
    let [o, n, u] = Ww({ defaultProp: t, onChange: a }),
      r = e !== void 0,
      s = r ? e : o;
    {
      let c = $t.useRef(e !== void 0);
      $t.useEffect(() => {
        let p = c.current;
        (p !== r &&
          console.warn(
            `${l} is changing from ${p ? 'controlled' : 'uncontrolled'} to ${r ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
          ),
          (c.current = r));
      }, [r, l]);
    }
    let i = $t.useCallback(
      (c) => {
        if (r) {
          let p = Jw(c) ? c(e) : c;
          p !== e && u.current?.(p);
        } else n(c);
      },
      [r, e, n, u],
    );
    return [s, i];
  }
  function Ww({ defaultProp: e, onChange: t }) {
    let [a, l] = $t.useState(e),
      o = $t.useRef(a),
      n = $t.useRef(t);
    return (
      Qw(() => {
        n.current = t;
      }, [t]),
      $t.useEffect(() => {
        o.current !== a && (n.current?.(a), (o.current = a));
      }, [a, o]),
      [a, l, n]
    );
  }
  function Jw(e) {
    return typeof e == 'function';
  }
  var Js = R(P(), 1);
  function Ov(e) {
    let t = Js.useRef({ value: e, previous: e });
    return Js.useMemo(
      () => (
        t.current.value !== e && ((t.current.previous = t.current.value), (t.current.value = e)),
        t.current.previous
      ),
      [e],
    );
  }
  var Bv = R(P(), 1);
  var Pv = R(U(), 1),
    Pd = Object.freeze({
      position: 'absolute',
      border: 0,
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      wordWrap: 'normal',
    }),
    $w = 'VisuallyHidden',
    eR = Bv.forwardRef((e, t) =>
      (0, Pv.jsx)(me.span, { ...e, ref: t, style: { ...Pd, ...e.style } }),
    );
  eR.displayName = $w;
  var tR = function (e) {
      if (typeof document > 'u') return null;
      var t = Array.isArray(e) ? e[0] : e;
      return t.ownerDocument.body;
    },
    wn = new WeakMap(),
    $s = new WeakMap(),
    ei = {},
    Nd = 0,
    Nv = function (e) {
      return e && (e.host || Nv(e.parentNode));
    },
    aR = function (e, t) {
      return t
        .map(function (a) {
          if (e.contains(a)) return a;
          var l = Nv(a);
          return l && e.contains(l)
            ? l
            : (console.error('aria-hidden', a, 'in not contained inside', e, '. Doing nothing'),
              null);
        })
        .filter(function (a) {
          return !!a;
        });
    },
    lR = function (e, t, a, l) {
      var o = aR(t, Array.isArray(e) ? e : [e]);
      ei[a] || (ei[a] = new WeakMap());
      var n = ei[a],
        u = [],
        r = new Set(),
        s = new Set(o),
        i = function (p) {
          !p || r.has(p) || (r.add(p), i(p.parentNode));
        };
      o.forEach(i);
      var c = function (p) {
        !p ||
          s.has(p) ||
          Array.prototype.forEach.call(p.children, function (m) {
            if (r.has(m)) c(m);
            else
              try {
                var h = m.getAttribute(l),
                  S = h !== null && h !== 'false',
                  x = (wn.get(m) || 0) + 1,
                  y = (n.get(m) || 0) + 1;
                (wn.set(m, x),
                  n.set(m, y),
                  u.push(m),
                  x === 1 && S && $s.set(m, !0),
                  y === 1 && m.setAttribute(a, 'true'),
                  S || m.setAttribute(l, 'true'));
              } catch (g) {
                console.error('aria-hidden: cannot operate on ', m, g);
              }
          });
      };
      return (
        c(t),
        r.clear(),
        Nd++,
        function () {
          (u.forEach(function (p) {
            var m = wn.get(p) - 1,
              h = n.get(p) - 1;
            (wn.set(p, m),
              n.set(p, h),
              m || ($s.has(p) || p.removeAttribute(l), $s.delete(p)),
              h || p.removeAttribute(a));
          }),
            Nd--,
            Nd || ((wn = new WeakMap()), (wn = new WeakMap()), ($s = new WeakMap()), (ei = {})));
        }
      );
    },
    _v = function (e, t, a) {
      a === void 0 && (a = 'data-aria-hidden');
      var l = Array.from(Array.isArray(e) ? e : [e]),
        o = t || tR(e);
      return o
        ? (l.push.apply(l, Array.from(o.querySelectorAll('[aria-live], script'))),
          lR(l, o, a, 'aria-hidden'))
        : function () {
            return null;
          };
    };
  var It = function () {
    return (
      (It =
        Object.assign ||
        function (t) {
          for (var a, l = 1, o = arguments.length; l < o; l++) {
            a = arguments[l];
            for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
          }
          return t;
        }),
      It.apply(this, arguments)
    );
  };
  function ti(e, t) {
    var a = {};
    for (var l in e)
      Object.prototype.hasOwnProperty.call(e, l) && t.indexOf(l) < 0 && (a[l] = e[l]);
    if (e != null && typeof Object.getOwnPropertySymbols == 'function')
      for (var o = 0, l = Object.getOwnPropertySymbols(e); o < l.length; o++)
        t.indexOf(l[o]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, l[o]) &&
          (a[l[o]] = e[l[o]]);
    return a;
  }
  function Hv(e, t, a) {
    if (a || arguments.length === 2)
      for (var l = 0, o = t.length, n; l < o; l++)
        (n || !(l in t)) && (n || (n = Array.prototype.slice.call(t, 0, l)), (n[l] = t[l]));
    return e.concat(n || Array.prototype.slice.call(t));
  }
  var ui = R(P());
  var ut = R(P());
  var go = 'right-scroll-bar-position',
    xo = 'width-before-scroll-bar',
    _d = 'with-scroll-bars-hidden',
    Hd = '--removed-body-scroll-bar-size';
  function ai(e, t) {
    return (typeof e == 'function' ? e(t) : e && (e.current = t), e);
  }
  var zv = R(P());
  function Uv(e, t) {
    var a = (0, zv.useState)(function () {
      return {
        value: e,
        callback: t,
        facade: {
          get current() {
            return a.value;
          },
          set current(l) {
            var o = a.value;
            o !== l && ((a.value = l), a.callback(l, o));
          },
        },
      };
    })[0];
    return ((a.callback = t), a.facade);
  }
  var li = R(P());
  var oR = typeof window < 'u' ? li.useLayoutEffect : li.useEffect,
    qv = new WeakMap();
  function zd(e, t) {
    var a = Uv(t || null, function (l) {
      return e.forEach(function (o) {
        return ai(o, l);
      });
    });
    return (
      oR(
        function () {
          var l = qv.get(a);
          if (l) {
            var o = new Set(l),
              n = new Set(e),
              u = a.current;
            (o.forEach(function (r) {
              n.has(r) || ai(r, null);
            }),
              n.forEach(function (r) {
                o.has(r) || ai(r, u);
              }));
          }
          qv.set(a, e);
        },
        [e],
      ),
      a
    );
  }
  function nR(e) {
    return e;
  }
  function uR(e, t) {
    t === void 0 && (t = nR);
    var a = [],
      l = !1,
      o = {
        read: function () {
          if (l)
            throw new Error(
              'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.',
            );
          return a.length ? a[a.length - 1] : e;
        },
        useMedium: function (n) {
          var u = t(n, l);
          return (
            a.push(u),
            function () {
              a = a.filter(function (r) {
                return r !== u;
              });
            }
          );
        },
        assignSyncMedium: function (n) {
          for (l = !0; a.length;) {
            var u = a;
            ((a = []), u.forEach(n));
          }
          a = {
            push: function (r) {
              return n(r);
            },
            filter: function () {
              return a;
            },
          };
        },
        assignMedium: function (n) {
          l = !0;
          var u = [];
          if (a.length) {
            var r = a;
            ((a = []), r.forEach(n), (u = a));
          }
          var s = function () {
              var c = u;
              ((u = []), c.forEach(n));
            },
            i = function () {
              return Promise.resolve().then(s);
            };
          (i(),
            (a = {
              push: function (c) {
                (u.push(c), i());
              },
              filter: function (c) {
                return ((u = u.filter(c)), a);
              },
            }));
        },
      };
    return o;
  }
  function Ud(e) {
    e === void 0 && (e = {});
    var t = uR(null);
    return ((t.options = It({ async: !0, ssr: !1 }, e)), t);
  }
  var Fv = R(P()),
    Gv = function (e) {
      var t = e.sideCar,
        a = ti(e, ['sideCar']);
      if (!t) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
      var l = t.read();
      if (!l) throw new Error('Sidecar medium not found');
      return Fv.createElement(l, It({}, a));
    };
  Gv.isSideCarExport = !0;
  function qd(e, t) {
    return (e.useMedium(t), Gv);
  }
  var oi = Ud();
  var Fd = function () {},
    Vu = ut.forwardRef(function (e, t) {
      var a = ut.useRef(null),
        l = ut.useState({ onScrollCapture: Fd, onWheelCapture: Fd, onTouchMoveCapture: Fd }),
        o = l[0],
        n = l[1],
        u = e.forwardProps,
        r = e.children,
        s = e.className,
        i = e.removeScrollBar,
        c = e.enabled,
        p = e.shards,
        m = e.sideCar,
        h = e.noRelative,
        S = e.noIsolation,
        x = e.inert,
        y = e.allowPinchZoom,
        g = e.as,
        d = g === void 0 ? 'div' : g,
        f = e.gapMode,
        L = ti(e, [
          'forwardProps',
          'children',
          'className',
          'removeScrollBar',
          'enabled',
          'shards',
          'sideCar',
          'noRelative',
          'noIsolation',
          'inert',
          'allowPinchZoom',
          'as',
          'gapMode',
        ]),
        v = m,
        I = zd([a, t]),
        C = It(It({}, L), o);
      return ut.createElement(
        ut.Fragment,
        null,
        c &&
          ut.createElement(v, {
            sideCar: oi,
            removeScrollBar: i,
            shards: p,
            noRelative: h,
            noIsolation: S,
            inert: x,
            setCallbacks: n,
            allowPinchZoom: !!y,
            lockRef: a,
            gapMode: f,
          }),
        u
          ? ut.cloneElement(ut.Children.only(r), It(It({}, C), { ref: I }))
          : ut.createElement(d, It({}, C, { className: s, ref: I }), r),
      );
    });
  Vu.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
  Vu.classNames = { fullWidth: xo, zeroRight: go };
  var be = R(P());
  var An = R(P());
  var jv = R(P());
  var Vv;
  var Xv = function () {
    if (Vv) return Vv;
    if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
  };
  function rR() {
    if (!document) return null;
    var e = document.createElement('style');
    e.type = 'text/css';
    var t = Xv();
    return (t && e.setAttribute('nonce', t), e);
  }
  function sR(e, t) {
    e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t));
  }
  function iR(e) {
    var t = document.head || document.getElementsByTagName('head')[0];
    t.appendChild(e);
  }
  var Gd = function () {
    var e = 0,
      t = null;
    return {
      add: function (a) {
        (e == 0 && (t = rR()) && (sR(t, a), iR(t)), e++);
      },
      remove: function () {
        (e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  };
  var Vd = function () {
    var e = Gd();
    return function (t, a) {
      jv.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && a],
      );
    };
  };
  var Xu = function () {
    var e = Vd(),
      t = function (a) {
        var l = a.styles,
          o = a.dynamic;
        return (e(l, o), null);
      };
    return t;
  };
  var fR = { left: 0, top: 0, right: 0, gap: 0 },
    Xd = function (e) {
      return parseInt(e || '', 10) || 0;
    },
    cR = function (e) {
      var t = window.getComputedStyle(document.body),
        a = t[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
        l = t[e === 'padding' ? 'paddingTop' : 'marginTop'],
        o = t[e === 'padding' ? 'paddingRight' : 'marginRight'];
      return [Xd(a), Xd(l), Xd(o)];
    },
    jd = function (e) {
      if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return fR;
      var t = cR(e),
        a = document.documentElement.clientWidth,
        l = window.innerWidth;
      return { left: t[0], top: t[1], right: t[2], gap: Math.max(0, l - a + t[2] - t[0]) };
    };
  var dR = Xu(),
    Rn = 'data-scroll-locked',
    mR = function (e, t, a, l) {
      var o = e.left,
        n = e.top,
        u = e.right,
        r = e.gap;
      return (
        a === void 0 && (a = 'margin'),
        `
  .`
          .concat(
            _d,
            ` {
   overflow: hidden `,
          )
          .concat(
            l,
            `;
   padding-right: `,
          )
          .concat(r, 'px ')
          .concat(
            l,
            `;
  }
  body[`,
          )
          .concat(
            Rn,
            `] {
    overflow: hidden `,
          )
          .concat(
            l,
            `;
    overscroll-behavior: contain;
    `,
          )
          .concat(
            [
              t && 'position: relative '.concat(l, ';'),
              a === 'margin' &&
                `
    padding-left: `
                  .concat(
                    o,
                    `px;
    padding-top: `,
                  )
                  .concat(
                    n,
                    `px;
    padding-right: `,
                  )
                  .concat(
                    u,
                    `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                  )
                  .concat(r, 'px ')
                  .concat(
                    l,
                    `;
    `,
                  ),
              a === 'padding' && 'padding-right: '.concat(r, 'px ').concat(l, ';'),
            ]
              .filter(Boolean)
              .join(''),
            `
  }
  
  .`,
          )
          .concat(
            go,
            ` {
    right: `,
          )
          .concat(r, 'px ')
          .concat(
            l,
            `;
  }
  
  .`,
          )
          .concat(
            xo,
            ` {
    margin-right: `,
          )
          .concat(r, 'px ')
          .concat(
            l,
            `;
  }
  
  .`,
          )
          .concat(go, ' .')
          .concat(
            go,
            ` {
    right: 0 `,
          )
          .concat(
            l,
            `;
  }
  
  .`,
          )
          .concat(xo, ' .')
          .concat(
            xo,
            ` {
    margin-right: 0 `,
          )
          .concat(
            l,
            `;
  }
  
  body[`,
          )
          .concat(
            Rn,
            `] {
    `,
          )
          .concat(Hd, ': ')
          .concat(
            r,
            `px;
  }
`,
          )
      );
    },
    Yv = function () {
      var e = parseInt(document.body.getAttribute(Rn) || '0', 10);
      return isFinite(e) ? e : 0;
    },
    pR = function () {
      An.useEffect(function () {
        return (
          document.body.setAttribute(Rn, (Yv() + 1).toString()),
          function () {
            var e = Yv() - 1;
            e <= 0
              ? document.body.removeAttribute(Rn)
              : document.body.setAttribute(Rn, e.toString());
          }
        );
      }, []);
    },
    Yd = function (e) {
      var t = e.noRelative,
        a = e.noImportant,
        l = e.gapMode,
        o = l === void 0 ? 'margin' : l;
      pR();
      var n = An.useMemo(
        function () {
          return jd(o);
        },
        [o],
      );
      return An.createElement(dR, { styles: mR(n, !t, o, a ? '' : '!important') });
    };
  var Kd = !1;
  if (typeof window < 'u')
    try {
      ((ju = Object.defineProperty({}, 'passive', {
        get: function () {
          return ((Kd = !0), !0);
        },
      })),
        window.addEventListener('test', ju, ju),
        window.removeEventListener('test', ju, ju));
    } catch {
      Kd = !1;
    }
  var ju,
    Lo = Kd ? { passive: !1 } : !1;
  var hR = function (e) {
      return e.tagName === 'TEXTAREA';
    },
    Kv = function (e, t) {
      if (!(e instanceof Element)) return !1;
      var a = window.getComputedStyle(e);
      return a[t] !== 'hidden' && !(a.overflowY === a.overflowX && !hR(e) && a[t] === 'visible');
    },
    gR = function (e) {
      return Kv(e, 'overflowY');
    },
    xR = function (e) {
      return Kv(e, 'overflowX');
    },
    Zd = function (e, t) {
      var a = t.ownerDocument,
        l = t;
      do {
        typeof ShadowRoot < 'u' && l instanceof ShadowRoot && (l = l.host);
        var o = Zv(e, l);
        if (o) {
          var n = Qv(e, l),
            u = n[1],
            r = n[2];
          if (u > r) return !0;
        }
        l = l.parentNode;
      } while (l && l !== a.body);
      return !1;
    },
    LR = function (e) {
      var t = e.scrollTop,
        a = e.scrollHeight,
        l = e.clientHeight;
      return [t, a, l];
    },
    SR = function (e) {
      var t = e.scrollLeft,
        a = e.scrollWidth,
        l = e.clientWidth;
      return [t, a, l];
    },
    Zv = function (e, t) {
      return e === 'v' ? gR(t) : xR(t);
    },
    Qv = function (e, t) {
      return e === 'v' ? LR(t) : SR(t);
    },
    vR = function (e, t) {
      return e === 'h' && t === 'rtl' ? -1 : 1;
    },
    Wv = function (e, t, a, l, o) {
      var n = vR(e, window.getComputedStyle(t).direction),
        u = n * l,
        r = a.target,
        s = t.contains(r),
        i = !1,
        c = u > 0,
        p = 0,
        m = 0;
      do {
        if (!r) break;
        var h = Qv(e, r),
          S = h[0],
          x = h[1],
          y = h[2],
          g = x - y - n * S;
        (S || g) && Zv(e, r) && ((p += g), (m += S));
        var d = r.parentNode;
        r = d && d.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? d.host : d;
      } while ((!s && r !== document.body) || (s && (t.contains(r) || t === r)));
      return (
        ((c && ((o && Math.abs(p) < 1) || (!o && u > p))) ||
          (!c && ((o && Math.abs(m) < 1) || (!o && -u > m)))) &&
          (i = !0),
        i
      );
    };
  var ni = function (e) {
      return 'changedTouches' in e
        ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
        : [0, 0];
    },
    Jv = function (e) {
      return [e.deltaX, e.deltaY];
    },
    $v = function (e) {
      return e && 'current' in e ? e.current : e;
    },
    yR = function (e, t) {
      return e[0] === t[0] && e[1] === t[1];
    },
    CR = function (e) {
      return `
  .block-interactivity-`
        .concat(
          e,
          ` {pointer-events: none;}
  .allow-interactivity-`,
        )
        .concat(
          e,
          ` {pointer-events: all;}
`,
        );
    },
    bR = 0,
    Tn = [];
  function ey(e) {
    var t = be.useRef([]),
      a = be.useRef([0, 0]),
      l = be.useRef(),
      o = be.useState(bR++)[0],
      n = be.useState(Xu)[0],
      u = be.useRef(e);
    (be.useEffect(
      function () {
        u.current = e;
      },
      [e],
    ),
      be.useEffect(
        function () {
          if (e.inert) {
            document.body.classList.add('block-interactivity-'.concat(o));
            var x = Hv([e.lockRef.current], (e.shards || []).map($v), !0).filter(Boolean);
            return (
              x.forEach(function (y) {
                return y.classList.add('allow-interactivity-'.concat(o));
              }),
              function () {
                (document.body.classList.remove('block-interactivity-'.concat(o)),
                  x.forEach(function (y) {
                    return y.classList.remove('allow-interactivity-'.concat(o));
                  }));
              }
            );
          }
        },
        [e.inert, e.lockRef.current, e.shards],
      ));
    var r = be.useCallback(function (x, y) {
        if (('touches' in x && x.touches.length === 2) || (x.type === 'wheel' && x.ctrlKey))
          return !u.current.allowPinchZoom;
        var g = ni(x),
          d = a.current,
          f = 'deltaX' in x ? x.deltaX : d[0] - g[0],
          L = 'deltaY' in x ? x.deltaY : d[1] - g[1],
          v,
          I = x.target,
          C = Math.abs(f) > Math.abs(L) ? 'h' : 'v';
        if ('touches' in x && C === 'h' && I.type === 'range') return !1;
        var b = window.getSelection(),
          A = b && b.anchorNode,
          T = A ? A === I || A.contains(I) : !1;
        if (T) return !1;
        var D = Zd(C, I);
        if (!D) return !0;
        if ((D ? (v = C) : ((v = C === 'v' ? 'h' : 'v'), (D = Zd(C, I))), !D)) return !1;
        if ((!l.current && 'changedTouches' in x && (f || L) && (l.current = v), !v)) return !0;
        var F = l.current || v;
        return Wv(F, y, x, F === 'h' ? f : L, !0);
      }, []),
      s = be.useCallback(function (x) {
        var y = x;
        if (!(!Tn.length || Tn[Tn.length - 1] !== n)) {
          var g = 'deltaY' in y ? Jv(y) : ni(y),
            d = t.current.filter(function (v) {
              return (
                v.name === y.type &&
                (v.target === y.target || y.target === v.shadowParent) &&
                yR(v.delta, g)
              );
            })[0];
          if (d && d.should) {
            y.cancelable && y.preventDefault();
            return;
          }
          if (!d) {
            var f = (u.current.shards || [])
                .map($v)
                .filter(Boolean)
                .filter(function (v) {
                  return v.contains(y.target);
                }),
              L = f.length > 0 ? r(y, f[0]) : !u.current.noIsolation;
            L && y.cancelable && y.preventDefault();
          }
        }
      }, []),
      i = be.useCallback(function (x, y, g, d) {
        var f = { name: x, delta: y, target: g, should: d, shadowParent: IR(g) };
        (t.current.push(f),
          setTimeout(function () {
            t.current = t.current.filter(function (L) {
              return L !== f;
            });
          }, 1));
      }, []),
      c = be.useCallback(function (x) {
        ((a.current = ni(x)), (l.current = void 0));
      }, []),
      p = be.useCallback(function (x) {
        i(x.type, Jv(x), x.target, r(x, e.lockRef.current));
      }, []),
      m = be.useCallback(function (x) {
        i(x.type, ni(x), x.target, r(x, e.lockRef.current));
      }, []);
    be.useEffect(function () {
      return (
        Tn.push(n),
        e.setCallbacks({ onScrollCapture: p, onWheelCapture: p, onTouchMoveCapture: m }),
        document.addEventListener('wheel', s, Lo),
        document.addEventListener('touchmove', s, Lo),
        document.addEventListener('touchstart', c, Lo),
        function () {
          ((Tn = Tn.filter(function (x) {
            return x !== n;
          })),
            document.removeEventListener('wheel', s, Lo),
            document.removeEventListener('touchmove', s, Lo),
            document.removeEventListener('touchstart', c, Lo));
        }
      );
    }, []);
    var h = e.removeScrollBar,
      S = e.inert;
    return be.createElement(
      be.Fragment,
      null,
      S ? be.createElement(n, { styles: CR(o) }) : null,
      h ? be.createElement(Yd, { noRelative: e.noRelative, gapMode: e.gapMode }) : null,
    );
  }
  function IR(e) {
    for (var t = null; e !== null;)
      (e instanceof ShadowRoot && ((t = e.host), (e = e.host)), (e = e.parentNode));
    return t;
  }
  var ty = qd(oi, ey);
  var ay = ui.forwardRef(function (e, t) {
    return ui.createElement(Vu, It({}, e, { ref: t, sideCar: ty }));
  });
  ay.classNames = Vu.classNames;
  var Qd = ay;
  var B = R(U(), 1),
    wR = [' ', 'Enter', 'ArrowUp', 'ArrowDown'],
    RR = [' ', 'Enter'],
    So = 'Select',
    [si, ii, AR] = KL(So),
    [vo, PM] = vn(So, [AR, kd]),
    fi = kd(),
    [TR, El] = vo(So),
    [kR, MR] = vo(So),
    DR = 'SelectProvider';
  function ly(e) {
    let {
        __scopeSelect: t,
        children: a,
        open: l,
        defaultOpen: o,
        onOpenChange: n,
        value: u,
        defaultValue: r,
        onValueChange: s,
        dir: i,
        name: c,
        autoComplete: p,
        disabled: m,
        required: h,
        form: S,
        internal_do_not_use_render: x,
      } = e,
      y = fi(t),
      [g, d] = k.useState(null),
      [f, L] = k.useState(null),
      [v, I] = k.useState(!1),
      C = ZL(i),
      [b, A] = Bd({ prop: l, defaultProp: o ?? !1, onChange: n, caller: So }),
      [T, D] = Bd({ prop: u, defaultProp: r, onChange: s, caller: So }),
      F = k.useRef(null),
      K = k.useRef(T);
    k.useEffect(() => {
      let Ue = S ? g?.ownerDocument.getElementById(S) : g?.form;
      if (Ue instanceof HTMLFormElement) {
        let rt = () => D(K.current);
        return (Ue.addEventListener('reset', rt), () => Ue.removeEventListener('reset', rt));
      }
    }, [S, g, D]);
    let W = g ? !!S || !!g.closest('form') : !0,
      [le, V] = k.useState(new Set()),
      J = _s(),
      _ = Array.from(le)
        .map((Ue) => Ue.props.value)
        .join(';'),
      ae = k.useCallback((Ue) => {
        V((rt) => new Set(rt).add(Ue));
      }, []),
      M = k.useCallback((Ue) => {
        V((rt) => {
          let st = new Set(rt);
          return (st.delete(Ue), st);
        });
      }, []),
      wt = {
        required: h,
        trigger: g,
        onTriggerChange: d,
        valueNode: f,
        onValueNodeChange: L,
        valueNodeHasChildren: v,
        onValueNodeHasChildrenChange: I,
        contentId: J,
        value: T,
        onValueChange: D,
        open: b,
        onOpenChange: A,
        dir: C,
        triggerPointerDownPosRef: F,
        disabled: m,
        name: c,
        autoComplete: p,
        form: S,
        nativeOptions: le,
        nativeSelectKey: _,
        isFormControl: W,
      };
    return (0, B.jsx)(wv, {
      ...y,
      children: (0, B.jsx)(TR, {
        scope: t,
        ...wt,
        children: (0, B.jsx)(si.Provider, {
          scope: t,
          children: (0, B.jsx)(kR, {
            scope: t,
            onNativeOptionAdd: ae,
            onNativeOptionRemove: M,
            children: QR(x) ? x(wt) : a,
          }),
        }),
      }),
    });
  }
  ly.displayName = DR;
  var am = (e) => {
    let { __scopeSelect: t, children: a, ...l } = e;
    return (0, B.jsx)(ly, {
      __scopeSelect: t,
      ...l,
      internal_do_not_use_render: ({ isFormControl: o }) =>
        (0, B.jsxs)(B.Fragment, { children: [a, o ? (0, B.jsx)(Sy, { __scopeSelect: t }) : null] }),
    });
  };
  am.displayName = So;
  var oy = 'SelectTrigger',
    ci = k.forwardRef((e, t) => {
      let { __scopeSelect: a, disabled: l = !1, ...o } = e,
        n = fi(a),
        u = El(oy, a),
        r = u.disabled || l,
        s = Re(t, u.onTriggerChange),
        i = ii(a),
        c = k.useRef('touch'),
        [p, m, h] = vy((x) => {
          let y = i().filter((f) => !f.disabled),
            g = y.find((f) => f.value === u.value),
            d = yy(y, x, g);
          d !== void 0 && u.onValueChange(d.value);
        }),
        S = (x) => {
          (r || (u.onOpenChange(!0), h()),
            x &&
              (u.triggerPointerDownPosRef.current = {
                x: Math.round(x.pageX),
                y: Math.round(x.pageY),
              }));
        };
      return (0, B.jsx)(Rv, {
        asChild: !0,
        ...n,
        children: (0, B.jsx)(me.button, {
          type: 'button',
          role: 'combobox',
          'aria-controls': u.open ? u.contentId : void 0,
          'aria-expanded': u.open,
          'aria-required': u.required,
          'aria-autocomplete': 'none',
          dir: u.dir,
          'data-state': u.open ? 'open' : 'closed',
          disabled: r,
          'data-disabled': r ? '' : void 0,
          'data-placeholder': pi(u.value) ? '' : void 0,
          ...o,
          ref: s,
          onClick: Ee(o.onClick, (x) => {
            (x.currentTarget.focus(), c.current !== 'mouse' && S(x));
          }),
          onPointerDown: Ee(o.onPointerDown, (x) => {
            c.current = x.pointerType;
            let y = x.target;
            (y.hasPointerCapture(x.pointerId) && y.releasePointerCapture(x.pointerId),
              x.button === 0 &&
                x.ctrlKey === !1 &&
                x.pointerType === 'mouse' &&
                (S(x), x.preventDefault()));
          }),
          onKeyDown: Ee(o.onKeyDown, (x) => {
            let y = p.current !== '';
            (!(x.ctrlKey || x.altKey || x.metaKey) && x.key.length === 1 && m(x.key),
              !(y && x.key === ' ') && wR.includes(x.key) && (S(), x.preventDefault()));
          }),
        }),
      });
    });
  ci.displayName = oy;
  var ny = 'SelectValue',
    lm = k.forwardRef((e, t) => {
      let { __scopeSelect: a, className: l, style: o, children: n, placeholder: u = '', ...r } = e,
        s = El(ny, a),
        { onValueNodeHasChildrenChange: i } = s,
        c = n !== void 0,
        p = Re(t, s.onValueNodeChange);
      Ae(() => {
        i(c);
      }, [i, c]);
      let m = pi(s.value);
      return (0, B.jsx)(me.span, {
        ...r,
        asChild: m ? !1 : r.asChild,
        ref: p,
        style: { pointerEvents: 'none' },
        children: (0, B.jsx)(k.Fragment, { children: m ? u : n }, m ? 'placeholder' : 'value'),
      });
    });
  lm.displayName = ny;
  var ER = 'SelectIcon',
    om = k.forwardRef((e, t) => {
      let { __scopeSelect: a, children: l, ...o } = e;
      return (0, B.jsx)(me.span, { 'aria-hidden': !0, ...o, ref: t, children: l || '\u25BC' });
    });
  om.displayName = ER;
  var uy = 'SelectPortal',
    [OR, BR] = vo(uy, { forceMount: void 0 }),
    nm = (e) => {
      let { __scopeSelect: t, forceMount: a, ...l } = e;
      return (0, B.jsx)(OR, {
        scope: e.__scopeSelect,
        forceMount: a,
        children: (0, B.jsx)(Ed, { asChild: !0, ...l }),
      });
    };
  nm.displayName = uy;
  var Dl = 'SelectContent',
    di = k.forwardRef((e, t) => {
      let a = BR(Dl, e.__scopeSelect),
        { forceMount: l = a.forceMount, ...o } = e,
        n = El(Dl, e.__scopeSelect),
        [u, r] = k.useState();
      return (
        Ae(() => {
          r(new DocumentFragment());
        }, []),
        (0, B.jsx)(Od, {
          present: l || n.open,
          children: ({ present: s }) =>
            s ? (0, B.jsx)(iy, { ...o, ref: t }) : (0, B.jsx)(ry, { ...o, fragment: u }),
        })
      );
    });
  di.displayName = Dl;
  var ry = k.forwardRef((e, t) => {
    let { __scopeSelect: a, children: l, fragment: o } = e;
    return o
      ? tm.createPortal(
          (0, B.jsx)(sy, {
            scope: a,
            children: (0, B.jsx)(si.Slot, {
              scope: a,
              children: (0, B.jsx)('div', { ref: t, children: l }),
            }),
          }),
          o,
        )
      : null;
  });
  ry.displayName = 'SelectContentFragment';
  var ia = 10,
    [sy, Ol] = vo(Dl),
    PR = 'SelectContentImpl',
    NR = ro('SelectContent.RemoveScroll'),
    iy = k.forwardRef((e, t) => {
      let { __scopeSelect: a } = e,
        {
          position: l = 'item-aligned',
          onCloseAutoFocus: o,
          onEscapeKeyDown: n,
          onPointerDownOutside: u,
          side: r,
          sideOffset: s,
          align: i,
          alignOffset: c,
          arrowPadding: p,
          collisionBoundary: m,
          collisionPadding: h,
          sticky: S,
          hideWhenDetached: x,
          avoidCollisions: y,
          ...g
        } = e,
        d = El(Dl, a),
        [f, L] = k.useState(null),
        [v, I] = k.useState(null),
        C = Re(t, L),
        [b, A] = k.useState(null),
        [T, D] = k.useState(null),
        F = ii(a),
        [K, W] = k.useState(!1),
        le = k.useRef(!1);
      (k.useEffect(() => {
        if (f) return _v(f);
      }, [f]),
        uS());
      let V = k.useCallback(
          (H) => {
            let [ge, ...ee] = F().map((Le) => Le.ref.current),
              [fe] = ee.slice(-1),
              ue = document.activeElement;
            for (let Le of H)
              if (
                Le === ue ||
                (Le?.scrollIntoView({ block: 'nearest' }),
                Le === ge && v && (v.scrollTop = 0),
                Le === fe && v && (v.scrollTop = v.scrollHeight),
                Le?.focus(),
                document.activeElement !== ue)
              )
                return;
          },
          [F, v],
        ),
        J = k.useCallback(() => V([b, f]), [V, b, f]);
      k.useEffect(() => {
        K && J();
      }, [K, J]);
      let { onOpenChange: _, triggerPointerDownPosRef: ae } = d;
      (k.useEffect(() => {
        if (f) {
          let H = { x: 0, y: 0 },
            ge = (fe) => {
              H = {
                x: Math.abs(Math.round(fe.pageX) - (ae.current?.x ?? 0)),
                y: Math.abs(Math.round(fe.pageY) - (ae.current?.y ?? 0)),
              };
            },
            ee = (fe) => {
              (H.x <= 10 && H.y <= 10
                ? fe.preventDefault()
                : fe.composedPath().includes(f) || _(!1),
                document.removeEventListener('pointermove', ge),
                (ae.current = null));
            };
          return (
            ae.current !== null &&
              (document.addEventListener('pointermove', ge),
              document.addEventListener('pointerup', ee, { capture: !0, once: !0 })),
            () => {
              (document.removeEventListener('pointermove', ge),
                document.removeEventListener('pointerup', ee, { capture: !0 }));
            }
          );
        }
      }, [f, _, ae]),
        k.useEffect(() => {
          let H = () => _(!1);
          return (
            window.addEventListener('blur', H),
            window.addEventListener('resize', H),
            () => {
              (window.removeEventListener('blur', H), window.removeEventListener('resize', H));
            }
          );
        }, [_]));
      let [M, wt] = vy((H) => {
          let ge = F().filter((ue) => !ue.disabled),
            ee = ge.find((ue) => ue.ref.current === document.activeElement),
            fe = yy(ge, H, ee);
          fe && setTimeout(() => fe.ref.current?.focus());
        }),
        Ue = k.useCallback(
          (H, ge, ee) => {
            let fe = !le.current && !ee;
            ((d.value !== void 0 && d.value === ge) || fe) && (A(H), fe && (le.current = !0));
          },
          [d.value],
        ),
        rt = k.useCallback(() => f?.focus(), [f]),
        st = k.useCallback(
          (H, ge, ee) => {
            let fe = !le.current && !ee;
            ((d.value !== void 0 && d.value === ge) || fe) && D(H);
          },
          [d.value],
        ),
        ke = l === 'popper' ? Wd : fy,
        Te =
          ke === Wd
            ? {
                side: r,
                sideOffset: s,
                align: i,
                alignOffset: c,
                arrowPadding: p,
                collisionBoundary: m,
                collisionPadding: h,
                sticky: S,
                hideWhenDetached: x,
                avoidCollisions: y,
              }
            : {};
      return (0, B.jsx)(sy, {
        scope: a,
        content: f,
        viewport: v,
        onViewportChange: I,
        itemRefCallback: Ue,
        selectedItem: b,
        onItemLeave: rt,
        itemTextRefCallback: st,
        focusSelectedItem: J,
        selectedItemText: T,
        position: l,
        isPositioned: K,
        searchRef: M,
        children: (0, B.jsx)(Qd, {
          as: NR,
          allowPinchZoom: !0,
          children: (0, B.jsx)(xd, {
            asChild: !0,
            trapped: d.open,
            onMountAutoFocus: (H) => {
              H.preventDefault();
            },
            onUnmountAutoFocus: Ee(o, (H) => {
              (d.trigger?.focus({ preventScroll: !0 }), H.preventDefault());
            }),
            children: (0, B.jsx)(pd, {
              asChild: !0,
              disableOutsidePointerEvents: !0,
              onEscapeKeyDown: n,
              onPointerDownOutside: u,
              onFocusOutside: (H) => H.preventDefault(),
              onDismiss: () => d.onOpenChange(!1),
              children: (0, B.jsx)(ke, {
                role: 'listbox',
                id: d.contentId,
                'data-state': d.open ? 'open' : 'closed',
                dir: d.dir,
                onContextMenu: (H) => H.preventDefault(),
                ...g,
                ...Te,
                onPlaced: () => W(!0),
                ref: C,
                style: { display: 'flex', flexDirection: 'column', outline: 'none', ...g.style },
                onKeyDown: Ee(g.onKeyDown, (H) => {
                  let ge = H.ctrlKey || H.altKey || H.metaKey;
                  if (
                    (H.key === 'Tab' && H.preventDefault(),
                    !ge && H.key.length === 1 && wt(H.key),
                    ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(H.key))
                  ) {
                    let fe = F()
                      .filter((ue) => !ue.disabled)
                      .map((ue) => ue.ref.current);
                    if (
                      (['ArrowUp', 'End'].includes(H.key) && (fe = fe.slice().reverse()),
                      ['ArrowUp', 'ArrowDown'].includes(H.key))
                    ) {
                      let ue = H.target,
                        Le = fe.indexOf(ue);
                      fe = fe.slice(Le + 1);
                    }
                    (setTimeout(() => V(fe)), H.preventDefault());
                  }
                }),
              }),
            }),
          }),
        }),
      });
    });
  iy.displayName = PR;
  var _R = 'SelectItemAlignedPosition',
    fy = k.forwardRef((e, t) => {
      let { __scopeSelect: a, onPlaced: l, ...o } = e,
        n = El(Dl, a),
        u = Ol(Dl, a),
        [r, s] = k.useState(null),
        [i, c] = k.useState(null),
        p = Re(t, c),
        m = ii(a),
        h = k.useRef(!1),
        S = k.useRef(!0),
        { viewport: x, selectedItem: y, selectedItemText: g, focusSelectedItem: d } = u,
        f = k.useCallback(() => {
          if (n.trigger && n.valueNode && r && i && x && y && g) {
            let C = n.trigger.getBoundingClientRect(),
              b = i.getBoundingClientRect(),
              A = n.valueNode.getBoundingClientRect(),
              T = g.getBoundingClientRect();
            if (n.dir !== 'rtl') {
              let ue = T.left - b.left,
                Le = A.left - ue,
                Rt = C.left - Le,
                Ze = C.width + Rt,
                xi = Math.max(Ze, b.width),
                Li = window.innerWidth - ia,
                Si = cd(Le, [ia, Math.max(ia, Li - xi)]);
              ((r.style.minWidth = Ze + 'px'), (r.style.left = Si + 'px'));
            } else {
              let ue = b.right - T.right,
                Le = window.innerWidth - A.right - ue,
                Rt = window.innerWidth - C.right - Le,
                Ze = C.width + Rt,
                xi = Math.max(Ze, b.width),
                Li = window.innerWidth - ia,
                Si = cd(Le, [ia, Math.max(ia, Li - xi)]);
              ((r.style.minWidth = Ze + 'px'), (r.style.right = Si + 'px'));
            }
            let D = m(),
              F = window.innerHeight - ia * 2,
              K = x.scrollHeight,
              W = window.getComputedStyle(i),
              le = parseInt(W.borderTopWidth, 10),
              V = parseInt(W.paddingTop, 10),
              J = parseInt(W.borderBottomWidth, 10),
              _ = parseInt(W.paddingBottom, 10),
              ae = le + V + K + _ + J,
              M = Math.min(y.offsetHeight * 5, ae),
              wt = window.getComputedStyle(x),
              Ue = parseInt(wt.paddingTop, 10),
              rt = parseInt(wt.paddingBottom, 10),
              st = C.top + C.height / 2 - ia,
              ke = F - st,
              Te = y.offsetHeight / 2,
              H = y.offsetTop + Te,
              ge = le + V + H,
              ee = ae - ge;
            if (ge <= st) {
              let ue = D.length > 0 && y === D[D.length - 1].ref.current;
              r.style.bottom = '0px';
              let Le = i.clientHeight - x.offsetTop - x.offsetHeight,
                Rt = Math.max(ke, Te + (ue ? rt : 0) + Le + J),
                Ze = ge + Rt;
              r.style.height = Ze + 'px';
            } else {
              let ue = D.length > 0 && y === D[0].ref.current;
              r.style.top = '0px';
              let Rt = Math.max(st, le + x.offsetTop + (ue ? Ue : 0) + Te) + ee;
              ((r.style.height = Rt + 'px'), (x.scrollTop = ge - st + x.offsetTop));
            }
            ((r.style.margin = `${ia}px 0`),
              (r.style.minHeight = M + 'px'),
              (r.style.maxHeight = F + 'px'),
              l?.(),
              requestAnimationFrame(() => (h.current = !0)));
          }
        }, [m, n.trigger, n.valueNode, r, i, x, y, g, n.dir, l]);
      Ae(() => f(), [f]);
      let [L, v] = k.useState();
      Ae(() => {
        i && v(window.getComputedStyle(i).zIndex);
      }, [i]);
      let I = k.useCallback(
        (C) => {
          C && S.current === !0 && (f(), d?.(), (S.current = !1));
        },
        [f, d],
      );
      return (0, B.jsx)(zR, {
        scope: a,
        contentWrapper: r,
        shouldExpandOnScrollRef: h,
        onScrollButtonChange: I,
        children: (0, B.jsx)('div', {
          ref: s,
          style: { display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: L },
          children: (0, B.jsx)(me.div, {
            ...o,
            ref: p,
            style: { boxSizing: 'border-box', maxHeight: '100%', ...o.style },
          }),
        }),
      });
    });
  fy.displayName = _R;
  var HR = 'SelectPopperPosition',
    Wd = k.forwardRef((e, t) => {
      let { __scopeSelect: a, align: l = 'start', collisionPadding: o = ia, ...n } = e,
        u = fi(a);
      return (0, B.jsx)(Av, {
        ...u,
        ...n,
        ref: t,
        align: l,
        collisionPadding: o,
        style: {
          boxSizing: 'border-box',
          ...n.style,
          '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)',
        },
      });
    });
  Wd.displayName = HR;
  var [zR, um] = vo(Dl, {}),
    Jd = 'SelectViewport',
    rm = k.forwardRef((e, t) => {
      let { __scopeSelect: a, nonce: l, ...o } = e,
        n = Ol(Jd, a),
        u = um(Jd, a),
        r = Re(t, n.onViewportChange),
        s = k.useRef(0);
      return (0, B.jsxs)(B.Fragment, {
        children: [
          (0, B.jsx)('style', {
            dangerouslySetInnerHTML: {
              __html:
                '[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}',
            },
            nonce: l,
          }),
          (0, B.jsx)(si.Slot, {
            scope: a,
            children: (0, B.jsx)(me.div, {
              'data-radix-select-viewport': '',
              role: 'presentation',
              ...o,
              ref: r,
              style: { position: 'relative', flex: 1, overflow: 'hidden auto', ...o.style },
              onScroll: Ee(o.onScroll, (i) => {
                let c = i.currentTarget,
                  { contentWrapper: p, shouldExpandOnScrollRef: m } = u;
                if (m?.current && p) {
                  let h = Math.abs(s.current - c.scrollTop);
                  if (h > 0) {
                    let S = window.innerHeight - ia * 2,
                      x = parseFloat(p.style.minHeight),
                      y = parseFloat(p.style.height),
                      g = Math.max(x, y);
                    if (g < S) {
                      let d = g + h,
                        f = Math.min(S, d),
                        L = d - f;
                      ((p.style.height = f + 'px'),
                        p.style.bottom === '0px' &&
                          ((c.scrollTop = L > 0 ? L : 0), (p.style.justifyContent = 'flex-end')));
                    }
                  }
                }
                s.current = c.scrollTop;
              }),
            }),
          }),
        ],
      });
    });
  rm.displayName = Jd;
  var cy = 'SelectGroup',
    [UR, qR] = vo(cy),
    dy = k.forwardRef((e, t) => {
      let { __scopeSelect: a, ...l } = e,
        o = _s();
      return (0, B.jsx)(UR, {
        scope: a,
        id: o,
        children: (0, B.jsx)(me.div, { role: 'group', 'aria-labelledby': o, ...l, ref: t }),
      });
    });
  dy.displayName = cy;
  var my = 'SelectLabel',
    FR = k.forwardRef((e, t) => {
      let { __scopeSelect: a, ...l } = e,
        o = qR(my, a);
      return (0, B.jsx)(me.div, { id: o.id, ...l, ref: t });
    });
  FR.displayName = my;
  var ri = 'SelectItem',
    [GR, py] = vo(ri),
    mi = k.forwardRef((e, t) => {
      let { __scopeSelect: a, value: l, disabled: o = !1, textValue: n, ...u } = e,
        r = El(ri, a),
        s = Ol(ri, a),
        i = r.value === l,
        [c, p] = k.useState(n ?? ''),
        [m, h] = k.useState(!1),
        S = Ht((f) => s.itemRefCallback?.(f, l, o)),
        x = Re(t, S),
        y = _s(),
        g = k.useRef('touch'),
        d = () => {
          o || (r.onValueChange(l), r.onOpenChange(!1));
        };
      return (0, B.jsx)(GR, {
        scope: a,
        value: l,
        disabled: o,
        textId: y,
        isSelected: i,
        onItemTextChange: k.useCallback((f) => {
          p((L) => L || (f?.textContent ?? '').trim());
        }, []),
        children: (0, B.jsx)(si.ItemSlot, {
          scope: a,
          value: l,
          disabled: o,
          textValue: c,
          children: (0, B.jsx)(me.div, {
            role: 'option',
            'aria-labelledby': y,
            'data-highlighted': m ? '' : void 0,
            'aria-selected': i && m,
            'data-state': i ? 'checked' : 'unchecked',
            'aria-disabled': o || void 0,
            'data-disabled': o ? '' : void 0,
            tabIndex: o ? void 0 : -1,
            ...u,
            ref: x,
            onFocus: Ee(u.onFocus, () => h(!0)),
            onBlur: Ee(u.onBlur, () => h(!1)),
            onClick: Ee(u.onClick, () => {
              g.current !== 'mouse' && d();
            }),
            onPointerUp: Ee(u.onPointerUp, () => {
              g.current === 'mouse' && d();
            }),
            onPointerDown: Ee(u.onPointerDown, (f) => {
              g.current = f.pointerType;
            }),
            onPointerMove: Ee(u.onPointerMove, (f) => {
              ((g.current = f.pointerType),
                o
                  ? s.onItemLeave?.()
                  : g.current === 'mouse' && f.currentTarget.focus({ preventScroll: !0 }));
            }),
            onPointerLeave: Ee(u.onPointerLeave, (f) => {
              f.currentTarget === document.activeElement && s.onItemLeave?.();
            }),
            onKeyDown: Ee(u.onKeyDown, (f) => {
              o ||
                f.target !== f.currentTarget ||
                (s.searchRef?.current !== '' && f.key === ' ') ||
                (RR.includes(f.key) && d(), f.key === ' ' && f.preventDefault());
            }),
          }),
        }),
      });
    });
  mi.displayName = ri;
  var Yu = 'SelectItemText',
    sm = k.forwardRef((e, t) => {
      let { __scopeSelect: a, className: l, style: o, ...n } = e,
        u = El(Yu, a),
        r = Ol(Yu, a),
        s = py(Yu, a),
        i = MR(Yu, a),
        [c, p] = k.useState(null),
        m = Ht((d) => r.itemTextRefCallback?.(d, s.value, s.disabled)),
        h = Re(t, p, s.onItemTextChange, m),
        S = c?.textContent,
        x = k.useMemo(
          () =>
            (0, B.jsx)('option', { value: s.value, disabled: s.disabled, children: S }, s.value),
          [s.disabled, s.value, S],
        ),
        { onNativeOptionAdd: y, onNativeOptionRemove: g } = i;
      return (
        Ae(() => (y(x), () => g(x)), [y, g, x]),
        (0, B.jsxs)(B.Fragment, {
          children: [
            (0, B.jsx)(me.span, { id: s.textId, ...n, ref: h }),
            s.isSelected && u.valueNode && !u.valueNodeHasChildren && !pi(u.value)
              ? tm.createPortal(n.children, u.valueNode)
              : null,
          ],
        })
      );
    });
  sm.displayName = Yu;
  var hy = 'SelectItemIndicator',
    VR = k.forwardRef((e, t) => {
      let { __scopeSelect: a, ...l } = e;
      return py(hy, a).isSelected ? (0, B.jsx)(me.span, { 'aria-hidden': !0, ...l, ref: t }) : null;
    });
  VR.displayName = hy;
  var $d = 'SelectScrollUpButton',
    XR = k.forwardRef((e, t) => {
      let a = Ol($d, e.__scopeSelect),
        l = um($d, e.__scopeSelect),
        [o, n] = k.useState(!1),
        u = Re(t, l.onScrollButtonChange);
      return (
        Ae(() => {
          if (a.viewport && a.isPositioned) {
            let s = function () {
              let c = i.scrollTop > 0;
              n(c);
            };
            var r = s;
            let i = a.viewport;
            return (s(), i.addEventListener('scroll', s), () => i.removeEventListener('scroll', s));
          }
        }, [a.viewport, a.isPositioned]),
        o
          ? (0, B.jsx)(gy, {
              ...e,
              ref: u,
              onAutoScroll: () => {
                let { viewport: r, selectedItem: s } = a;
                r && s && (r.scrollTop = r.scrollTop - s.offsetHeight);
              },
            })
          : null
      );
    });
  XR.displayName = $d;
  var em = 'SelectScrollDownButton',
    jR = k.forwardRef((e, t) => {
      let a = Ol(em, e.__scopeSelect),
        l = um(em, e.__scopeSelect),
        [o, n] = k.useState(!1),
        u = Re(t, l.onScrollButtonChange);
      return (
        Ae(() => {
          if (a.viewport && a.isPositioned) {
            let s = function () {
              let c = i.scrollHeight - i.clientHeight,
                p = Math.ceil(i.scrollTop) < c;
              n(p);
            };
            var r = s;
            let i = a.viewport;
            return (s(), i.addEventListener('scroll', s), () => i.removeEventListener('scroll', s));
          }
        }, [a.viewport, a.isPositioned]),
        o
          ? (0, B.jsx)(gy, {
              ...e,
              ref: u,
              onAutoScroll: () => {
                let { viewport: r, selectedItem: s } = a;
                r && s && (r.scrollTop = r.scrollTop + s.offsetHeight);
              },
            })
          : null
      );
    });
  jR.displayName = em;
  var gy = k.forwardRef((e, t) => {
      let { __scopeSelect: a, onAutoScroll: l, ...o } = e,
        n = Ol('SelectScrollButton', a),
        u = k.useRef(null),
        r = ii(a),
        s = k.useCallback(() => {
          u.current !== null && (window.clearInterval(u.current), (u.current = null));
        }, []);
      return (
        k.useEffect(() => () => s(), [s]),
        Ae(() => {
          r()
            .find((c) => c.ref.current === document.activeElement)
            ?.ref.current?.scrollIntoView({ block: 'nearest' });
        }, [r]),
        (0, B.jsx)(me.div, {
          'aria-hidden': !0,
          ...o,
          ref: t,
          style: { flexShrink: 0, ...o.style },
          onPointerDown: Ee(o.onPointerDown, () => {
            u.current === null && (u.current = window.setInterval(l, 50));
          }),
          onPointerMove: Ee(o.onPointerMove, () => {
            (n.onItemLeave?.(), u.current === null && (u.current = window.setInterval(l, 50)));
          }),
          onPointerLeave: Ee(o.onPointerLeave, () => {
            s();
          }),
        })
      );
    }),
    YR = 'SelectSeparator',
    KR = k.forwardRef((e, t) => {
      let { __scopeSelect: a, ...l } = e;
      return (0, B.jsx)(me.div, { 'aria-hidden': !0, ...l, ref: t });
    });
  KR.displayName = YR;
  var xy = 'SelectArrow',
    ZR = k.forwardRef((e, t) => {
      let { __scopeSelect: a, ...l } = e,
        o = fi(a);
      return Ol(xy, a).position === 'popper' ? (0, B.jsx)(Tv, { ...o, ...l, ref: t }) : null;
    });
  ZR.displayName = xy;
  var Ly = 'SelectBubbleInput',
    Sy = k.forwardRef(({ __scopeSelect: e, ...t }, a) => {
      let l = El(Ly, e),
        {
          value: o,
          onValueChange: n,
          required: u,
          disabled: r,
          name: s,
          autoComplete: i,
          form: c,
        } = l,
        { nativeOptions: p, nativeSelectKey: m } = l,
        h = k.useRef(null),
        S = Re(a, h),
        x = o ?? '',
        y = Ov(x),
        g = Array.from(p).some((d) => (d.props.value ?? '') === '');
      return (
        k.useEffect(() => {
          let d = h.current;
          if (!d) return;
          let f = window.HTMLSelectElement.prototype,
            v = Object.getOwnPropertyDescriptor(f, 'value').set;
          if (y !== x && v) {
            let I = new Event('change', { bubbles: !0 });
            (v.call(d, x), d.dispatchEvent(I));
          }
        }, [y, x]),
        (0, B.jsxs)(
          me.select,
          {
            'aria-hidden': !0,
            required: u,
            tabIndex: -1,
            name: s,
            autoComplete: i,
            disabled: r,
            form: c,
            onChange: (d) => n(d.target.value),
            ...t,
            style: { ...Pd, ...t.style },
            ref: S,
            defaultValue: x,
            children: [pi(o) && !g ? (0, B.jsx)('option', { value: '' }) : null, Array.from(p)],
          },
          m,
        )
      );
    });
  Sy.displayName = Ly;
  function QR(e) {
    return typeof e == 'function';
  }
  function pi(e) {
    return e === '' || e === void 0;
  }
  function vy(e) {
    let t = Ht(e),
      a = k.useRef(''),
      l = k.useRef(0),
      o = k.useCallback(
        (u) => {
          let r = a.current + u;
          (t(r),
            (function s(i) {
              ((a.current = i),
                window.clearTimeout(l.current),
                i !== '' && (l.current = window.setTimeout(() => s(''), 1e3)));
            })(r));
        },
        [t],
      ),
      n = k.useCallback(() => {
        ((a.current = ''), window.clearTimeout(l.current));
      }, []);
    return (k.useEffect(() => () => window.clearTimeout(l.current), []), [a, o, n]);
  }
  function yy(e, t, a) {
    let o = t.length > 1 && Array.from(t).every((i) => i === t[0]) ? t[0] : t,
      n = a ? e.indexOf(a) : -1,
      u = WR(e, Math.max(n, 0));
    o.length === 1 && (u = u.filter((i) => i !== a));
    let s = u.find((i) => i.textValue.toLowerCase().startsWith(o.toLowerCase()));
    return s !== a ? s : void 0;
  }
  function WR(e, t) {
    return e.map((a, l) => e[(t + l) % e.length]);
  }
  var Ra = R(U(), 1),
    kn = am;
  var Mn = lm,
    yo = (0, hi.forwardRef)(({ className: e, children: t, ...a }, l) =>
      (0, Ra.jsxs)(ci, {
        ref: l,
        className: dt(
          'flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[&>span]:line-clamp-1',
          e,
        ),
        ...a,
        children: [
          t,
          (0, Ra.jsx)(om, {
            asChild: !0,
            children: (0, Ra.jsx)(Nu, { className: 'h-4 w-4 opacity-50' }),
          }),
        ],
      }),
    );
  yo.displayName = ci.displayName;
  var Co = (0, hi.forwardRef)(({ className: e, children: t, position: a = 'popper', ...l }, o) =>
    (0, Ra.jsx)(nm, {
      children: (0, Ra.jsx)(di, {
        ref: o,
        className: dt(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          a === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          e,
        ),
        position: a,
        ...l,
        children: (0, Ra.jsx)(rm, {
          className: dt(
            'p-1',
            a === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          ),
          children: t,
        }),
      }),
    }),
  );
  Co.displayName = di.displayName;
  var Wa = (0, hi.forwardRef)(({ className: e, children: t, ...a }, l) =>
    (0, Ra.jsx)(mi, {
      ref: l,
      className: dt(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-md-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        e,
      ),
      ...a,
      children: (0, Ra.jsx)(sm, { children: t }),
    }),
  );
  Wa.displayName = mi.displayName;
  var z = R(U(), 1),
    $R = '/rekam-medik/search?opsi=kodeicd10&q=';
  function Cy({ rows: e, onChange: t }) {
    let [a, l] = (0, Bl.useState)([]),
      [o, n] = (0, Bl.useState)(-1),
      [u, r] = (0, Bl.useState)({ top: 0, left: 0, width: 0 }),
      [s, i] = (0, Bl.useState)(''),
      c = (0, Bl.useRef)(null),
      p = (0, Bl.useRef)(null),
      m = (d, f) => t(e.map((L, v) => (v === d ? { ...L, ...f } : L))),
      h = (d) => t(e.filter((f, L) => L !== d)),
      S = (d, f, L) => {
        if ((i(''), clearTimeout(c.current ?? void 0), p.current?.abort(), d.length < 3)) {
          (l([]), n(-1));
          return;
        }
        let v = L.getBoundingClientRect();
        (r({ top: v.bottom + 2, left: v.left, width: v.width }),
          (c.current = setTimeout(async () => {
            let I = new AbortController();
            p.current = I;
            try {
              let C = await fetch(`${$R}${encodeURIComponent(d)}`, { signal: I.signal });
              if (!C.ok) {
                i('HTTP ' + C.status);
                return;
              }
              let b = await C.text();
              if (!b || b === '[]') {
                i('Data tidak ditemukan');
                return;
              }
              let A;
              try {
                if (((A = JSON.parse(b)), !Array.isArray(A))) throw new Error('not array');
              } catch {
                A = b
                  .split(
                    `
`,
                  )
                  .filter((T) => T.includes('|'))
                  .map((T) => {
                    let [D, F, K] = T.split('|');
                    return { NAMA: D.trim(), KODE: F.trim(), ID: K.trim() };
                  })
                  .filter((T) => T.KODE);
              }
              A.length > 0 ? (l(A.slice(0, 15)), n(f)) : i('Data tidak ditemukan');
            } catch (C) {
              i(String(C));
            }
          }, 300)));
      },
      x = (d, f) => {
        (m(d, { idicd: f.ID, kode10: f.KODE, namaDiagnosa: f.NAMA }), l([]), n(-1));
      },
      y = (d) => (f) => {
        (m(d, { namaDiagnosa: f.target.value }), S(f.target.value, d, f.currentTarget));
      },
      g = (d) => (f) => {
        m(d, { kode10: f.target.value });
      };
    return (0, z.jsxs)('div', {
      className: 'px-5 py-4 border-b border-border bg-muted/30',
      children: [
        (0, z.jsxs)('div', {
          className: 'flex items-center justify-between mb-4',
          children: [
            (0, z.jsxs)('h3', {
              className:
                "text-[18px] font-bold text-foreground font-['Lexend',system-ui,sans-serif]",
              children: [
                'Diagnosa (ICD-10)',
                ' ',
                e.length > 0 &&
                  (0, z.jsxs)('span', {
                    className: 'font-normal text-muted-foreground',
                    children: ['(', e.length, ')'],
                  }),
              ],
            }),
            (0, z.jsxs)(_t, {
              variant: 'default',
              size: 'lg',
              onClick: () =>
                t([...e, { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' }]),
              className: 'px-5 py-2.5 text-sm font-semibold',
              children: [(0, z.jsx)(no, { className: 'size-4' }), ' Tambah Diagnosa'],
            }),
          ],
        }),
        e.length === 0
          ? (0, z.jsxs)('div', {
              className: 'border-2 border-dashed border-border rounded-xl py-8 text-center bg-card',
              children: [
                (0, z.jsx)('p', {
                  className: 'text-[16px] text-muted-foreground',
                  children: 'Belum ada diagnosa',
                }),
                (0, z.jsx)('p', {
                  className: 'text-[14px] text-muted-foreground mt-1',
                  children: 'Klik "Tambah Diagnosa" untuk menambahkan',
                }),
              ],
            })
          : (0, z.jsx)('div', {
              className: 'space-y-3',
              children: e.map((d, f) => {
                let L = f + 1;
                return (0, z.jsxs)(
                  'div',
                  {
                    className: 'bg-card rounded-xl border-2 border-border p-4',
                    children: [
                      (0, z.jsxs)('div', {
                        className: 'grid grid-cols-1 md:grid-cols-2 gap-3',
                        children: [
                          (0, z.jsxs)('div', {
                            className: 'md:col-span-2',
                            children: [
                              (0, z.jsx)(mt, { children: 'Nama Diagnosa' }),
                              (0, z.jsxs)('div', {
                                className: 'relative',
                                children: [
                                  (0, z.jsx)(Ka, {
                                    id: `rj-nama${L}`,
                                    name: 'nama[]',
                                    value: d.namaDiagnosa,
                                    placeholder: 'Cari diagnosa...',
                                    autoComplete: 'off',
                                    onChange: y(f),
                                  }),
                                  (0, z.jsx)('input', {
                                    type: 'hidden',
                                    id: `rj-idicd${L}`,
                                    name: 'idicd[]',
                                    value: d.idicd,
                                  }),
                                  a.length > 0 &&
                                    o === f &&
                                    (0, z.jsx)('div', {
                                      className:
                                        'fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto',
                                      style: { top: u.top, left: u.left, width: u.width },
                                      children: a.map((v, I) =>
                                        (0, z.jsxs)(
                                          'div',
                                          {
                                            onClick: () => x(f, v),
                                            className:
                                              'px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors',
                                            children: [
                                              (0, z.jsx)('div', {
                                                className: 'font-medium text-foreground',
                                                children: v.NAMA,
                                              }),
                                              (0, z.jsx)('div', {
                                                className: 'text-muted-foreground text-xs',
                                                children: v.KODE,
                                              }),
                                            ],
                                          },
                                          v.ID || I,
                                        ),
                                      ),
                                    }),
                                  s &&
                                    (0, z.jsx)('div', {
                                      className:
                                        'fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive',
                                      style: { top: u.top, left: u.left },
                                      children: s,
                                    }),
                                ],
                              }),
                            ],
                          }),
                          (0, z.jsxs)('div', {
                            children: [
                              (0, z.jsx)(mt, { children: 'Kode ICD-10' }),
                              (0, z.jsx)(Ka, {
                                id: `rj-kode${L}`,
                                name: 'kode10[]',
                                value: d.kode10,
                                placeholder: 'Kode',
                                onChange: g(f),
                                className: 'font-mono',
                              }),
                            ],
                          }),
                          (0, z.jsxs)('div', {
                            children: [
                              (0, z.jsx)(mt, { children: 'Kasus' }),
                              (0, z.jsxs)(kn, {
                                value: d.kasus,
                                onValueChange: (v) => m(f, { kasus: v }),
                                children: [
                                  (0, z.jsx)(yo, {
                                    className: 'h-12',
                                    children: (0, z.jsx)(Mn, { placeholder: 'Pilih Kasus' }),
                                  }),
                                  (0, z.jsxs)(Co, {
                                    className: 'z-[1050]',
                                    children: [
                                      (0, z.jsx)(Wa, { value: 'BARU', children: 'Baru' }),
                                      (0, z.jsx)(Wa, { value: 'LAMA', children: 'Lama' }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, z.jsxs)('div', {
                            children: [
                              (0, z.jsx)(mt, { children: 'Komplikasi' }),
                              (0, z.jsxs)(kn, {
                                value: d.komplikasi,
                                onValueChange: (v) => m(f, { komplikasi: v }),
                                children: [
                                  (0, z.jsx)(yo, {
                                    className: 'h-12',
                                    children: (0, z.jsx)(Mn, { placeholder: 'Pilih' }),
                                  }),
                                  (0, z.jsxs)(Co, {
                                    className: 'z-[1050]',
                                    children: [
                                      (0, z.jsx)(Wa, { value: 'YA', children: 'Ya' }),
                                      (0, z.jsx)(Wa, { value: 'TIDAK', children: 'Tidak' }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, z.jsx)('div', {
                        className: 'flex justify-end mt-3',
                        children: (0, z.jsx)(_t, {
                          variant: 'ghost',
                          size: 'icon',
                          onClick: () => h(f),
                          className: 'h-10 w-10 text-muted-foreground hover:text-destructive',
                          children: (0, z.jsx)(uo, { className: 'size-5' }),
                        }),
                      }),
                    ],
                  },
                  f,
                );
              }),
            }),
      ],
    });
  }
  var Pl = R(P(), 1);
  var G = R(U(), 1),
    eA = '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=',
    tA = [
      { value: 'Primer', label: 'Utama (Primer)' },
      { value: 'Sekunder', label: 'Tambahan (Sekunder)' },
    ],
    aA = [
      { value: '', label: 'Pilih Kategori Prosedur' },
      { value: '24642003', label: 'Layanan Psikiatri' },
      { value: '409063005', label: 'Konseling' },
      { value: '409073007', label: 'Edukasi' },
      { value: '387713003', label: 'Tindakan Bedah' },
      { value: '103693007', label: 'Pemeriksaan Diagnostik' },
      { value: '46947000', label: 'Manipulasi Terapi' },
      { value: '410606002', label: 'Pelayanan Sosial' },
      { value: '277132007', label: 'Tindakan Terapeutik' },
    ];
  function by({ rows: e, onChange: t }) {
    let [a, l] = (0, Pl.useState)([]),
      [o, n] = (0, Pl.useState)(-1),
      [u, r] = (0, Pl.useState)({ top: 0, left: 0, width: 0 }),
      [s, i] = (0, Pl.useState)(''),
      c = (0, Pl.useRef)(null),
      p = (0, Pl.useRef)(null),
      m = (d, f) => t(e.map((L, v) => (v === d ? { ...L, ...f } : L))),
      h = (d) => t(e.filter((f, L) => L !== d)),
      S = (d, f, L) => {
        if ((i(''), clearTimeout(c.current ?? void 0), p.current?.abort(), d.length < 3)) {
          (l([]), n(-1));
          return;
        }
        let v = L.getBoundingClientRect();
        (r({ top: v.bottom + 2, left: v.left, width: v.width }),
          (c.current = setTimeout(async () => {
            let I = new AbortController();
            p.current = I;
            try {
              let C = await fetch(`${eA}${encodeURIComponent(d)}&limit=10`, { signal: I.signal });
              if (!C.ok) {
                i('HTTP ' + C.status);
                return;
              }
              let b = await C.text();
              if (!b || b === '[]') {
                i('Data tidak ditemukan');
                return;
              }
              let A;
              try {
                if (((A = JSON.parse(b)), !Array.isArray(A))) throw new Error('not array');
              } catch {
                A = b
                  .split(
                    `
`,
                  )
                  .filter((T) => T.includes('|'))
                  .map((T) => {
                    let [D, F, K] = T.split('|');
                    return { NAMA: D.trim(), KODE: F.trim(), ID: K.trim() };
                  })
                  .filter((T) => T.KODE);
              }
              A.length > 0 ? (l(A.slice(0, 15)), n(f)) : i('Data tidak ditemukan');
            } catch (C) {
              i(String(C));
            }
          }, 300)));
      },
      x = (d, f) => {
        (m(d, { idicdTindakan: f.ID, kode9: f.KODE, namaTindakan: f.NAMA }), l([]), n(-1));
      },
      y = (d) => (f) => {
        (m(d, { namaTindakan: f.target.value }), S(f.target.value, d, f.currentTarget));
      },
      g = (d) => (f) => {
        m(d, { kode9: f.target.value });
      };
    return (0, G.jsxs)('div', {
      className: 'px-5 py-4 border-b border-border bg-muted/30',
      children: [
        (0, G.jsxs)('div', {
          className: 'flex items-center justify-between mb-4',
          children: [
            (0, G.jsxs)('h3', {
              className:
                "text-[18px] font-bold text-foreground font-['Lexend',system-ui,sans-serif]",
              children: [
                'Tindakan (ICD-9)',
                ' ',
                e.length > 0 &&
                  (0, G.jsxs)('span', {
                    className: 'font-normal text-muted-foreground',
                    children: ['(', e.length, ')'],
                  }),
              ],
            }),
            (0, G.jsxs)(_t, {
              variant: 'default',
              size: 'lg',
              onClick: () =>
                t([
                  ...e,
                  {
                    idicdTindakan: '',
                    kode9: '',
                    namaTindakan: '',
                    komorbid: '',
                    kategoriProsedur: '',
                    snomedProsedur: '',
                    codeProsedur: '',
                  },
                ]),
              className: 'px-5 py-2.5 text-sm font-semibold',
              children: [(0, G.jsx)(no, { className: 'size-4' }), ' Tambah Tindakan'],
            }),
          ],
        }),
        e.length === 0
          ? (0, G.jsxs)('div', {
              className: 'border-2 border-dashed border-border rounded-xl py-8 text-center bg-card',
              children: [
                (0, G.jsx)('p', {
                  className: 'text-[16px] text-muted-foreground',
                  children: 'Belum ada tindakan',
                }),
                (0, G.jsx)('p', {
                  className: 'text-[14px] text-muted-foreground mt-1',
                  children: 'Klik "Tambah Tindakan" untuk menambahkan',
                }),
              ],
            })
          : (0, G.jsx)('div', {
              className: 'space-y-3',
              children: e.map((d, f) => {
                let L = f + 1;
                return (0, G.jsxs)(
                  'div',
                  {
                    className: 'bg-card rounded-xl border-2 border-border p-4',
                    children: [
                      (0, G.jsxs)('div', {
                        className: 'grid grid-cols-1 md:grid-cols-2 gap-3',
                        children: [
                          (0, G.jsxs)('div', {
                            className: 'md:col-span-2',
                            children: [
                              (0, G.jsx)(mt, { children: 'Nama Tindakan' }),
                              (0, G.jsxs)('div', {
                                className: 'relative',
                                children: [
                                  (0, G.jsx)(Ka, {
                                    id: `rj-tindakan${L}`,
                                    name: 'namaTindakan[]',
                                    value: d.namaTindakan,
                                    placeholder: 'Cari tindakan...',
                                    autoComplete: 'off',
                                    onChange: y(f),
                                  }),
                                  (0, G.jsx)('input', {
                                    type: 'hidden',
                                    id: `rj-idicdTindakan${L}`,
                                    name: 'idicdTindakan[]',
                                    value: d.idicdTindakan,
                                  }),
                                  a.length > 0 &&
                                    o === f &&
                                    (0, G.jsx)('div', {
                                      className:
                                        'fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto',
                                      style: { top: u.top, left: u.left, width: u.width },
                                      children: a.map((v, I) =>
                                        (0, G.jsxs)(
                                          'div',
                                          {
                                            onClick: () => x(f, v),
                                            className:
                                              'px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors',
                                            children: [
                                              (0, G.jsx)('div', {
                                                className: 'font-medium text-foreground',
                                                children: v.NAMA,
                                              }),
                                              (0, G.jsx)('div', {
                                                className: 'text-muted-foreground text-xs',
                                                children: v.KODE,
                                              }),
                                            ],
                                          },
                                          v.ID || I,
                                        ),
                                      ),
                                    }),
                                  s &&
                                    (0, G.jsx)('div', {
                                      className:
                                        'fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive',
                                      style: { top: u.top, left: u.left },
                                      children: s,
                                    }),
                                ],
                              }),
                            ],
                          }),
                          (0, G.jsxs)('div', {
                            children: [
                              (0, G.jsx)(mt, { children: 'Kode ICD-9' }),
                              (0, G.jsx)(Ka, {
                                id: `rj-kode9${L}`,
                                name: 'kode9[]',
                                value: d.kode9,
                                placeholder: 'Kode',
                                onChange: g(f),
                                className: 'font-mono',
                              }),
                            ],
                          }),
                          (0, G.jsxs)('div', {
                            children: [
                              (0, G.jsx)(mt, { children: 'Jenis' }),
                              (0, G.jsxs)(kn, {
                                value: d.komorbid,
                                onValueChange: (v) => m(f, { komorbid: v }),
                                children: [
                                  (0, G.jsx)(yo, {
                                    className: 'h-12',
                                    children: (0, G.jsx)(Mn, { placeholder: 'Pilih Jenis' }),
                                  }),
                                  (0, G.jsx)(Co, {
                                    className: 'z-[1050]',
                                    children: tA.map((v) =>
                                      (0, G.jsx)(
                                        Wa,
                                        { value: v.value, children: v.label },
                                        v.value,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, G.jsxs)('div', {
                            children: [
                              (0, G.jsx)(mt, { required: !0, children: 'Kategori Prosedur' }),
                              (0, G.jsxs)(kn, {
                                value: d.kategoriProsedur,
                                onValueChange: (v) => m(f, { kategoriProsedur: v }),
                                children: [
                                  (0, G.jsx)(yo, {
                                    className: 'h-12',
                                    children: (0, G.jsx)(Mn, { placeholder: 'Pilih Kategori' }),
                                  }),
                                  (0, G.jsx)(Co, {
                                    className: 'z-[1050]',
                                    children: aA.map((v) =>
                                      (0, G.jsx)(
                                        Wa,
                                        { value: v.value, children: v.label },
                                        v.value || 'empty',
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, G.jsx)('div', {
                        className: 'flex justify-end mt-3',
                        children: (0, G.jsx)(_t, {
                          variant: 'ghost',
                          size: 'icon',
                          onClick: () => h(f),
                          className: 'h-10 w-10 text-muted-foreground hover:text-destructive',
                          children: (0, G.jsx)(uo, { className: 'size-5' }),
                        }),
                      }),
                    ],
                  },
                  f,
                );
              }),
            }),
      ],
    });
  }
  var Xe = R(U(), 1);
  function Iy({ errors: e, warnings: t = [] }) {
    return e.length > 0 || t.length > 0
      ? (0, Xe.jsxs)(Xe.Fragment, {
          children: [
            t.length > 0 &&
              (0, Xe.jsx)('div', {
                className: 'px-6 py-4 border-t-2 border-border bg-yellow-50 dark:bg-yellow-950/30',
                role: 'alert',
                children: (0, Xe.jsxs)('div', {
                  className: 'flex items-start gap-3',
                  children: [
                    (0, Xe.jsx)(oa, {
                      className: 'size-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5',
                    }),
                    (0, Xe.jsxs)('div', {
                      children: [
                        (0, Xe.jsx)('p', {
                          className:
                            'text-[15px] font-bold text-yellow-800 dark:text-yellow-300 mb-1',
                          children: 'Perhatian',
                        }),
                        (0, Xe.jsx)('ul', {
                          className: 'space-y-1',
                          children: t.map((l, o) =>
                            (0, Xe.jsxs)(
                              'li',
                              {
                                className: 'text-[14px] text-yellow-700 dark:text-yellow-400',
                                children: [l.section, ': ', l.message],
                              },
                              o,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            e.length > 0 &&
              (0, Xe.jsx)('div', {
                className: 'px-6 py-4 border-t-2 border-border bg-destructive/5',
                role: 'alert',
                children: (0, Xe.jsxs)('div', {
                  className: 'flex items-start gap-3',
                  children: [
                    (0, Xe.jsx)(oa, { className: 'size-5 text-destructive shrink-0 mt-0.5' }),
                    (0, Xe.jsxs)('div', {
                      children: [
                        (0, Xe.jsxs)('p', {
                          className: 'text-[15px] font-bold text-destructive mb-1',
                          children: ['Terdapat ', e.length, ' kesalahan'],
                        }),
                        (0, Xe.jsx)('ul', {
                          className: 'space-y-1',
                          children: e.map((l, o) =>
                            (0, Xe.jsxs)(
                              'li',
                              {
                                className: 'text-[14px] text-destructive/80',
                                children: [l.section, ': ', l.message],
                              },
                              o,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
          ],
        })
      : null;
  }
  var Dn = R(U(), 1),
    lA = {
      default: 'bg-primary/10 text-primary border-primary/20',
      success:
        'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      warning:
        'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      danger: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    oA = { default: _u, success: Pu, warning: oa, danger: Sn };
  function im({ variant: e = 'default', icon: t, children: a, className: l, onDismiss: o }) {
    let n = oA[e];
    return (0, Dn.jsxs)('span', {
      className: dt(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
        lA[e],
        l,
      ),
      children: [
        t && (0, Dn.jsx)(n, { className: 'size-3' }),
        a,
        o &&
          (0, Dn.jsx)('button', {
            onClick: o,
            className: 'ml-0.5 hover:opacity-70',
            'aria-label': 'Dismiss',
            children: (0, Dn.jsx)(Sn, { className: 'size-2.5' }),
          }),
      ],
    });
  }
  var fa = R(U(), 1);
  function wy({ onCancel: e, onSave: t, saving: a, hasErrors: l, lastSaved: o, onRefresh: n }) {
    return (0, fa.jsxs)('div', {
      className:
        'flex items-center justify-between px-6 py-4 border-t-2 border-border shrink-0 bg-muted/30',
      children: [
        (0, fa.jsxs)('div', {
          className: 'flex items-center gap-3',
          children: [
            l && (0, fa.jsx)(im, { variant: 'danger', icon: !0, children: 'Validasi gagal' }),
            o &&
              (0, fa.jsxs)('span', {
                className: 'text-muted-foreground text-sm',
                children: ['Tersimpan pukul ', o],
              }),
            a && (0, fa.jsx)(im, { variant: 'default', icon: !0, children: 'Menyimpan...' }),
          ],
        }),
        (0, fa.jsxs)('div', {
          className: 'flex items-center gap-3',
          children: [
            n &&
              (0, fa.jsx)(_t, {
                type: 'button',
                variant: 'outline',
                size: 'default',
                onClick: n,
                children: 'Segarkan',
              }),
            (0, fa.jsx)(_t, {
              type: 'button',
              variant: 'outline',
              size: 'default',
              onClick: e,
              children: 'Batal',
            }),
            (0, fa.jsx)(_t, {
              type: 'button',
              variant: 'default',
              size: 'lg',
              onClick: t,
              disabled: a || l,
              children: a ? 'Menyimpan...' : 'Simpan',
            }),
          ],
        }),
      ],
    });
  }
  var he = R(U(), 1);
  function Ry(e) {
    let t = [];
    return (
      e.diagnosa.forEach((a, l) => {
        (!a.kode10 && !a.namaDiagnosa) ||
          (a.kode10 &&
            !a.namaDiagnosa &&
            t.push({ section: `Diagnosa #${l + 1}`, message: 'Nama diagnosa kosong' }),
          a.namaDiagnosa &&
            !a.kode10 &&
            t.push({ section: `Diagnosa #${l + 1}`, message: 'Kode ICD-10 kosong' }));
      }),
      e.tindakan.forEach((a, l) => {
        a.kode9 &&
          (a.namaTindakan ||
            t.push({ section: `Tindakan #${l + 1}`, message: 'Nama tindakan kosong' }),
          a.idicdTindakan?.trim() &&
            a.kode9?.trim() &&
            a.namaTindakan?.trim() &&
            !a.kategoriProsedur?.trim() &&
            t.push({ section: `Tindakan #${l + 1}`, message: 'Kategori Prosedur belum dipilih' }));
      }),
      t
    );
  }
  function Ay({ data: e, onSave: t, onClose: a }) {
    let [l, o] = (0, ca.useState)(e),
      [n, u] = (0, ca.useState)(!1),
      [r, s] = (0, ca.useState)(null),
      [i, c] = (0, ca.useState)(!1),
      [p, m] = (0, ca.useState)([]),
      [h, S] = (0, ca.useState)([]),
      x = (0, ca.useRef)(l.diagnosa.some((v) => v.idicd?.trim())),
      y = i ? Ry(l) : [],
      g = [...y, ...h],
      d = y.length > 0,
      f = (0, ca.useCallback)(async () => {
        if ((c(!0), m([]), S([]), Ry(l).length > 0)) return;
        let I = l.diagnosa.filter(
          (C) => C.idicd?.trim() && C.kode10?.trim() && C.namaDiagnosa?.trim(),
        );
        (x.current &&
          I.length === 0 &&
          m([
            {
              section: 'Diagnosa',
              message:
                'Semua diagnosa telah dihapus. Sistem Morbis biasanya tidak menghapus ICD yang sudah tersimpan ketika daftar diagnosa dikosongkan.',
            },
          ]),
          u(!0));
        try {
          (await t(l), s(new Date().toLocaleTimeString()));
        } catch (C) {
          let b = C instanceof Error ? C.message : String(C);
          S([{ section: 'Server', message: b }]);
        } finally {
          u(!1);
        }
      }, [l, t]),
      L = (v, I) => o({ ...l, clinicalNotes: { ...l.clinicalNotes, [v]: I } });
    return (0, he.jsxs)('div', {
      className: 'resume-modal',
      children: [
        (0, he.jsx)(OL, { title: 'Resume Rawat Jalan', onClose: a }),
        (0, he.jsxs)('div', {
          className: 'flex-1 overflow-y-auto px-6 py-5 space-y-6',
          children: [
            (0, he.jsx)(BL, { data: l.patientInfo }),
            (0, he.jsx)(PL, {
              anamnesa: l.clinicalNotes.anamnesa,
              pemeriksaan: l.clinicalNotes.pemeriksaan_fisik,
              onChange: (v, I) => L(v === 'pemeriksaan' ? 'pemeriksaan_fisik' : v, I),
            }),
            (0, he.jsx)('hr', { className: 'border-t-2 border-border' }),
            (0, he.jsxs)('div', {
              children: [
                (0, he.jsx)('h3', {
                  className:
                    "text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]",
                  children: 'Catatan Diagnosa',
                }),
                (0, he.jsx)(Tl, {
                  value: l.clinicalNotes.catatan,
                  onChange: (v) => L('catatan', v.target.value),
                  placeholder: 'Catatan diagnosa...',
                  rows: 3,
                }),
              ],
            }),
            (0, he.jsx)('hr', { className: 'border-t-2 border-border' }),
            (0, he.jsxs)('div', {
              children: [
                (0, he.jsx)('h3', {
                  className:
                    "text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]",
                  children: 'Tindakan',
                }),
                (0, he.jsx)(Tl, {
                  value: l.clinicalNotes.tindakan,
                  onChange: (v) => L('tindakan', v.target.value),
                  placeholder: 'Tindakan...',
                  rows: 3,
                }),
              ],
            }),
            (0, he.jsx)('hr', { className: 'border-t-2 border-border' }),
            (0, he.jsxs)('div', {
              children: [
                (0, he.jsx)('h3', {
                  className:
                    "text-[18px] font-bold text-foreground mb-4 font-['Lexend',system-ui,sans-serif]",
                  children: 'Terapi Pengobatan',
                }),
                (0, he.jsx)(Tl, {
                  value: l.clinicalNotes.terapi_pengobatan,
                  onChange: (v) => L('terapi_pengobatan', v.target.value),
                  placeholder: 'Terapi pengobatan...',
                  rows: 3,
                }),
              ],
            }),
            (0, he.jsx)('hr', { className: 'border-t-2 border-border' }),
            (0, he.jsx)(HL, {
              vitals: l.vitalSigns,
              onChange: (v, I) => o({ ...l, vitalSigns: { ...l.vitalSigns, [v]: I } }),
            }),
            (0, he.jsx)('hr', { className: 'border-t-2 border-border' }),
            (0, he.jsx)(Cy, { rows: l.diagnosa, onChange: (v) => o({ ...l, diagnosa: v }) }),
            (0, he.jsx)('hr', { className: 'border-t-2 border-border' }),
            (0, he.jsx)(by, { rows: l.tindakan, onChange: (v) => o({ ...l, tindakan: v }) }),
          ],
        }),
        (0, he.jsx)(Iy, { errors: g, warnings: p }),
        (0, he.jsx)(wy, {
          saving: n,
          hasErrors: d,
          lastSaved: r,
          onSave: f,
          onCancel: a,
          onRefresh: () => location.reload(),
        }),
      ],
    });
  }
  var Ty = R(P(), 1),
    gi = class extends Ty.Component {
      constructor() {
        super(...arguments);
        this.state = { hasError: !1 };
      }
      static getDerivedStateFromError() {
        return { hasError: !0 };
      }
      componentDidCatch() {
        this.props.onError();
      }
      render() {
        return this.state.hasError ? null : this.props.children;
      }
    };
  var dm = R(U(), 1),
    nA = [
      { pattern: 'periksa.*dokter', weight: 1 },
      { pattern: 'konsultasi', weight: 2 },
      { pattern: 'tindakan utama', weight: 3 },
      { pattern: 'lab', weight: 10 },
      { pattern: 'glukosa', weight: 11 },
      { pattern: 'hba1c', weight: 12 },
      { pattern: 'hb a1c', weight: 12 },
    ];
  function ky(e) {
    let t = new Map();
    return [...e].sort((a, l) => {
      let o = (n) => {
        let u = n.toLowerCase().trim();
        for (let r of nA)
          if (
            (t.has(r.pattern) || t.set(r.pattern, new RegExp(r.pattern, 'i')),
            t.get(r.pattern).test(u))
          )
            return r.weight;
        return 999;
      };
      return o(a) - o(l);
    });
  }
  function uA(e) {
    if (!e) return '';
    let t = e.trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
  }
  function My(e) {
    return e.map(uA).join(`
`);
  }
  function Ey() {
    let e = document.getElementById('pembayaran-gabung') || document.body,
      t = [],
      a = [],
      l = e.querySelectorAll('tr'),
      o = !1;
    for (let s of l) {
      let i = s.textContent?.trim() || '';
      if (s.querySelector('b') && !i.match(/^\d/)) {
        o = !0;
        continue;
      }
      if (o && (i.includes('Total') || i.includes('Sub Total'))) {
        o = !1;
        continue;
      }
      if (o) {
        let p = Array.from(s.querySelectorAll('td'));
        if (p.length >= 5 && p[0]?.textContent?.trim().match(/^\d+\.?$/)) {
          let m = p[2]?.textContent?.trim() || '',
            h = p[4]?.textContent?.trim() || '1';
          t.push(h && h !== '1' ? `${m} (${h})` : m);
        }
      }
    }
    let n = Array.from(e.querySelectorAll('b')).find((s) => s.textContent?.includes('Biaya Resep'));
    if (n) {
      let s = n.closest('tr')?.nextElementSibling;
      for (; s && !s.textContent?.includes('Sub Total');) {
        if (s.getAttribute('valign') === 'top') {
          let i = Array.from(s.querySelectorAll('td')),
            c = i[1]?.textContent?.trim() || '',
            p = c.match(/^\d+\s+(.*)/),
            m = p ? p[1] : c,
            h = i[2]?.textContent?.trim() || '';
          a.push(h ? `${m} (${h})` : m);
        }
        s = s.nextElementSibling;
      }
    }
    let u = ky(t),
      r = ky(a);
    return (
      console.log('[RJ] extracted billing lines:', {
        tindakanLines: t,
        terapiLines: a,
        sortedTindakan: u,
        sortedTerapi: r,
      }),
      { tindakan: My(u), terapiPengobatan: My(r) }
    );
  }
  var LD = location.pathname.includes('rm-rawat-jalan-new');
  var rA = '/rekam-medik/control/rm-rawat-jalan',
    Nl = null,
    fm = null;
  function sA() {
    let e = document.getElementById('resume-view');
    if (!e) return null;
    let t = (r) => {
        let s = e.querySelectorAll('table table tr, fieldset table tr');
        for (let i of s) {
          let c = i.querySelectorAll('td');
          for (let p = 0; p < c.length; p++)
            if (c[p].textContent?.trim() === r && c[p + 1]) {
              let m = c[p + 1];
              return (m.textContent?.trim() === ':' ? c[p + 2] : m)?.textContent?.trim() || '';
            }
        }
        return '';
      },
      a = () => {
        let r = Array.from(e.querySelectorAll('tr')).find((p) =>
          p.textContent?.includes('Hasil Pemeriksaan Fisik'),
        );
        if (!r) return '';
        let s = r.querySelector('td:last-child table, td[colspan] table');
        if (!s) return '';
        let i = Array.from(s.querySelectorAll('tr')).find((p) => {
          let m = p.querySelectorAll('td');
          return Array.from(m).some((h) => h.textContent?.trim() === 'Lainnya');
        });
        if (!i) return '';
        let c = i.querySelectorAll('td');
        for (let p = 0; p < c.length; p++)
          if (c[p].textContent?.trim() === 'Lainnya' && p + 2 < c.length) {
            let m = c[p + 2]?.textContent?.trim() || '',
              h = ['Tensi:', 'Nadi:', 'Suhu:', 'Nafas:', 'Tinggi:', 'Berat:', 'Lainnya:'];
            return m
              .split(
                `
`,
              )
              .filter((S) => {
                let x = S.trim();
                return x && !h.some((y) => x.startsWith(y));
              }).join(`
`);
          }
        return '';
      },
      l = (r) => {
        let s = Array.from(e.querySelectorAll('tr')).find((p) =>
          p.textContent?.includes('Hasil Pemeriksaan Fisik'),
        );
        if (!s) return '';
        let i = s.querySelector('td:last-child table, td[colspan] table');
        if (!i) return '';
        let c = i.querySelectorAll('tr');
        for (let p of c) {
          let m = p.querySelectorAll('td');
          for (let h = 0; h < m.length; h++)
            if (m[h].textContent?.trim() === r && m[h + 1]) {
              let S = m[h + 1];
              return (S.textContent?.trim() === ':' ? m[h + 2] : S)?.textContent?.trim() || '';
            }
        }
        return '';
      },
      o = [],
      n = Array.from(e.querySelectorAll('tr')).find((r) => r.textContent?.includes('ICD X'));
    if (n) {
      let r = n.querySelector('td:last-child table, td[colspan] table');
      if (r) {
        let s = r.querySelectorAll('tr');
        for (let i of s) {
          let p = (i.textContent?.trim() || '').match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/);
          p && o.push({ idicd: '', kode10: p[2], namaDiagnosa: p[1], kasus: '', komplikasi: '' });
        }
      }
    }
    let u = [];
    return {
      patientInfo: { norm: t('No. Rekam Medis'), pasien: t('Nama Pasien'), nama_dokter: '' },
      clinicalNotes: {
        anamnesa: t('Anamnesa'),
        pemeriksaan_fisik: a(),
        catatan: t('Diagnosa'),
        tindakan: t('Tindakan'),
        terapi_pengobatan: t('Terapi Pengobatan'),
      },
      vitalSigns: {
        tensi: l('Tensi'),
        nadi: l('Nadi'),
        suhu: l('Suhu'),
        nafas: l('Nafas'),
        tinggi: l('Tinggi'),
        berat: l('Berat'),
      },
      diagnosa: o,
      tindakan: u,
    };
  }
  function iA() {
    console.log('[RJ] extractFormData \u2014 path:', location.pathname);
    let e = sA(),
      t = document,
      a = (m) => t.getElementById(m)?.value || '',
      l = (m) => {
        let h = t.querySelector(
          `textarea[name="${m}"], input[name="${m}"], #${m}, select[name="${m}"]`,
        );
        return h ? ('tagName' in h && h.tagName === 'SELECT' ? h.value : h.value || '') : '';
      },
      o = (m) => t.querySelector(`input[name="${m}"]:checked`)?.value || '',
      n = {
        norm: a('norm') || a('no_rm'),
        pasien: a('pasien') || a('nama_pasien'),
        nama_dokter: a('nama_dokter') || a('dokter'),
        id_visit:
          a('id_visit') ||
          new URLSearchParams(location.search).get('id_visit') ||
          (typeof q?.id_visit == 'string' ? q.id_visit : ''),
        id_rawat_jalan:
          a('id_rawat_jalan') ||
          new URLSearchParams(location.search).get('id') ||
          (typeof q?.id_rawat_jalan == 'string' ? q.id_rawat_jalan : ''),
        id_user: a('id_user') || (typeof q?.id_user == 'string' ? q.id_user : '') || '1',
        id_dokter: a('id_dokter') || (typeof q?.id_dokter == 'string' ? q.id_dokter : ''),
        id_bed: a('id_bed') || (typeof q?.id_bed == 'string' ? q.id_bed : ''),
        noregis: a('noregis') || (typeof q?.noregis == 'string' ? q.noregis : ''),
      },
      u = {
        anamnesa: l('anamnesa'),
        pemeriksaan_fisik: l('pemeriksaan_fisik') || l('pemeriksaan') || l('fisik') || '',
        catatan: l('catatan') || '',
        tindakan: l('tindakan') || l('namaTindakan'),
        terapi_pengobatan: l('terapi_pengobatan') || '',
        jenis_kasus: l('jenis_kasus'),
        status_kasus: o('status_kasus'),
        tindak_lanjut: l('tindak_lanjut'),
      },
      r = {
        tensi: a('tensi'),
        nadi: a('nadi'),
        suhu: a('suhu'),
        nafas: a('nafas'),
        tinggi: a('tinggi'),
        berat: a('berat'),
      },
      s = [],
      i = t.querySelectorAll('input[name="kode10[]"], input[name="kode[]"]');
    if (i.length === 0) {
      let m = 1;
      for (
        ;
        t.getElementById(`kode${m}`) || t.querySelector(`input[name="kode10[]"]:nth-child(${m})`);
      ) {
        let h = a(`idicd${m}`) || '',
          S = a(`kode${m}`) || '',
          x = a(`nama${m}`) || '';
        ((S || x) && s.push({ idicd: h, kode10: S, namaDiagnosa: x, kasus: '', komplikasi: '' }),
          m++);
      }
    } else
      i.forEach((m) => {
        let h = m.closest('tr');
        if (!h) return;
        let S = h.querySelector('input[name="idicd[]"], input[name="idicd"]')?.value || '',
          x = m.value || '',
          y = h.querySelector('input[name="namaDiagnosa[]"], input[name="nama[]"]')?.value || '',
          g = h.querySelector('select[name="kasus[]"]')?.value || '',
          d = h.querySelector('select[name="komplikasi[]"]')?.value || '';
        (x || y) && s.push({ idicd: S, kode10: x, namaDiagnosa: y, kasus: g, komplikasi: d });
      });
    if (s.length === 0 && q) {
      let m = Array.isArray(q['kode10[]']) ? q['kode10[]'] : [],
        h = Array.isArray(q['nama[]']) ? q['nama[]'] : [],
        S = Array.isArray(q['idicd[]']) ? q['idicd[]'] : [],
        x = Array.isArray(q['kasus_diagnosa[]']) ? q['kasus_diagnosa[]'] : [],
        y = Array.isArray(q['komplikasi[]']) ? q['komplikasi[]'] : [];
      m.forEach((g, d) => {
        g &&
          s.push({
            idicd: S[d] || '',
            kode10: g,
            namaDiagnosa: h[d] || '',
            kasus: x[d] || '',
            komplikasi: y[d] || '',
          });
      });
    }
    let c = [];
    if (
      (t.querySelectorAll('input[name="kode9[]"]').forEach((m) => {
        let h = m.closest('tr');
        if (!h) return;
        let S = m.value || '';
        if (!S) return;
        let x = h.querySelector('input[name="idicdTindakan[]"]')?.value || '',
          y = h.querySelector('input[name="namaTindakan[]"]')?.value || '',
          g = h.querySelector('select[name="komorbid[]"]')?.value || '',
          d = h.querySelector('select[name="kategoriProsedur[]"]')?.value || '',
          f = h.querySelector('input[name="snomedProsedur[]"]')?.value || '',
          L = h.querySelector('input[name="codeProsedur[]"]')?.value || S;
        c.push({
          idicdTindakan: x,
          kode9: S,
          namaTindakan: y,
          komorbid: g,
          kategoriProsedur: d,
          snomedProsedur: f,
          codeProsedur: L,
        });
      }),
      c.length === 0 && q)
    ) {
      let m = Array.isArray(q['kode9[]']) ? q['kode9[]'] : [],
        h = Array.isArray(q['namaTindakan[]']) ? q['namaTindakan[]'] : [],
        S = Array.isArray(q['idicdTindakan[]']) ? q['idicdTindakan[]'] : [],
        x = Array.isArray(q['komorbid[]']) ? q['komorbid[]'] : [],
        y = Array.isArray(q['kategoriProsedur[]']) ? q['kategoriProsedur[]'] : [];
      m.forEach((g, d) => {
        g &&
          c.push({
            idicdTindakan: S[d] || '',
            kode9: g,
            namaTindakan: h[d] || '',
            komorbid: x[d] || '',
            kategoriProsedur: y[d] || '',
          });
      });
    }
    if (
      (e &&
        ((n.norm = n.norm || e.patientInfo.norm),
        (n.pasien = n.pasien || e.patientInfo.pasien),
        (n.nama_dokter = n.nama_dokter || e.patientInfo.nama_dokter),
        (u.anamnesa = u.anamnesa || e.clinicalNotes.anamnesa),
        (u.pemeriksaan_fisik = u.pemeriksaan_fisik || e.clinicalNotes.pemeriksaan_fisik),
        (u.catatan = u.catatan || e.clinicalNotes.catatan),
        (u.tindakan = u.tindakan || e.clinicalNotes.tindakan),
        (u.terapi_pengobatan = u.terapi_pengobatan || e.clinicalNotes.terapi_pengobatan),
        (r.tensi = r.tensi || e.vitalSigns.tensi),
        (r.nadi = r.nadi || e.vitalSigns.nadi),
        (r.suhu = r.suhu || e.vitalSigns.suhu),
        (r.nafas = r.nafas || e.vitalSigns.nafas),
        (r.tinggi = r.tinggi || e.vitalSigns.tinggi),
        (r.berat = r.berat || e.vitalSigns.berat),
        s.length === 0 && s.push(...e.diagnosa),
        c.length === 0 && c.push(...e.tindakan)),
      !u.tindakan || u.tindakan === '-' || !u.terapi_pengobatan || u.terapi_pengobatan === '-')
    ) {
      let m = Ey();
      (m.tindakan && (!u.tindakan || u.tindakan === '-') && (u.tindakan = m.tindakan),
        m.terapiPengobatan &&
          (!u.terapi_pengobatan || u.terapi_pengobatan === '-') &&
          (u.terapi_pengobatan = m.terapiPengobatan));
    }
    if (q) {
      let m = {
        anamnesa: u.anamnesa,
        pemeriksaan_fisik: u.pemeriksaan_fisik,
        catatan: u.catatan,
        tindakan: u.tindakan,
        terapi_pengobatan: u.terapi_pengobatan,
      };
      for (let [h, S] of Object.entries(m))
        if (!S || S === '-') {
          let x = q[h];
          typeof x == 'string' && x && (u[h] = x);
        }
    }
    return { patientInfo: n, clinicalNotes: u, vitalSigns: r, diagnosa: s, tindakan: c };
  }
  function fA(e) {
    let t = [],
      a = (f, L) => t.push([f, String(L)]);
    q?.id_bed || console.log('[RJ] MISS id_bed \u2014 cfs keys:', Object.keys(q || {}).join(','));
    let l = (f) => document.querySelector(`input[name="${f}"]`)?.value || '',
      o = (f) => document.getElementById(f)?.value || '',
      n = (f) => document.querySelector(`input[name="${f}"]:checked`)?.value || '',
      u = (f) => (typeof q?.[f] == 'string' ? q[f] : ''),
      r = (f) => e.patientInfo?.[f] || '';
    (a(
      'id_visit',
      r('id_visit') ||
        l('id_visit') ||
        new URLSearchParams(location.search).get('id_visit') ||
        u('id_visit'),
    ),
      a(
        'id_rawat_jalan',
        r('id_rawat_jalan') ||
          l('id_rawat_jalan') ||
          new URLSearchParams(location.search).get('id') ||
          u('id_rawat_jalan'),
      ),
      a('id_user', r('id_user') || l('id_user') || u('id_user') || '1'),
      a('id_dokter', r('id_dokter') || l('id_dokter') || u('id_dokter') || ''),
      a('id_bed', r('id_bed') || l('id_bed') || u('id_bed') || ''),
      !r('id_bed') && !l('id_bed') && !u('id_bed') && console.log('[RJ] id_bed STILL empty'),
      a('norm', r('norm') || l('norm') || u('norm') || ''),
      a('noregis', r('noregis') || l('noregis') || u('noregis') || ''),
      a('pasien', r('pasien') || l('pasien') || u('pasien') || ''),
      a('nama_dokter', r('nama_dokter') || l('nama_dokter') || u('nama_dokter') || ''),
      a('jenis_kasus', o('jenis_kasus') || u('jenis_kasus') || ''),
      a('tindak_lanjut', o('tindak_lanjut') || u('tindak_lanjut') || ''),
      a('status_kasus', n('status_kasus') || u('status_kasus') || 'BARU'),
      a('rujukan', o('rujukan') || u('rujukan') || '83'),
      a('keadaan_keluar', o('keadaan_keluar') || u('keadaan_keluar') || '87'),
      a('cara_keluar', o('cara_keluar') || u('cara_keluar') || '161'),
      a('pemeriksaan_lanjut', o('pemeriksaan_lanjut') || u('pemeriksaan_lanjut') || '88'),
      a('pulang_berkas', l('pulang_berkas') || u('pulang_berkas') || ''),
      a(
        'composition_diet',
        l('composition_diet') ||
          document.getElementById('composition_diet')?.value ||
          u('composition_diet') ||
          '',
      ),
      a('alergiMakananJSON', l('alergiMakananJSON') || u('alergiMakananJSON') || '[]'),
      a('alergiLingkunganJSON', l('alergiLingkunganJSON') || u('alergiLingkunganJSON') || '[]'));
    let s = new Date(),
      i = (f) => f.toString().padStart(2, '0');
    a(
      'waktu',
      `${i(s.getDate())}/${i(s.getMonth() + 1)}/${s.getFullYear()} ${i(s.getHours())}:${i(s.getMinutes())}:${i(s.getSeconds())}`,
    );
    let c = (f) => f.replace(/\n/g, '<br/>');
    (a('anamnesa', c(e.clinicalNotes.anamnesa)),
      a('pemeriksaan_fisik', c(e.clinicalNotes.pemeriksaan_fisik)),
      a('catatan', c(e.clinicalNotes.catatan)),
      a('tindakan', c(e.clinicalNotes.tindakan)),
      a('terapi_pengobatan', c(e.clinicalNotes.terapi_pengobatan)));
    let p = (f) => f.match(/^([\d/.]+)/)?.[0] || '';
    (a('tensi', p(e.vitalSigns.tensi)),
      a('nadi', p(e.vitalSigns.nadi)),
      a('suhu', p(e.vitalSigns.suhu)),
      a('nafas', p(e.vitalSigns.nafas)),
      a('tinggi', p(e.vitalSigns.tinggi)),
      a('berat', p(e.vitalSigns.berat)));
    let m = (f) => (Array.isArray(q?.[f]) ? q[f] : []),
      h = m('kode10[]'),
      S = m('idicd[]'),
      x = m('kasus_diagnosa[]'),
      y = m('komplikasi[]');
    return (
      e.diagnosa
        .filter((f) => f.idicd?.trim() && f.kode10?.trim() && f.namaDiagnosa?.trim())
        .filter((f, L, v) => v.findIndex((I) => I.idicd === f.idicd) === L)
        .forEach((f) => {
          let L = f.idicd;
          if (!L && f.kode10) {
            let v = h.indexOf(f.kode10);
            v >= 0 && S[v] && (L = S[v]);
          }
          (a('nama[]', f.namaDiagnosa),
            a('idicd[]', L),
            a('kode10[]', f.kode10),
            a('kasus_diagnosa[]', f.kasus || ''),
            a('komplikasi[]', f.komplikasi || ''));
        }),
      e.tindakan
        .filter((f) => f.idicdTindakan?.trim() && f.kode9?.trim() && f.namaTindakan?.trim())
        .filter(
          (f, L, v) =>
            v.findIndex((I) => I.idicdTindakan === f.idicdTindakan && I.kode9 === f.kode9) === L,
        )
        .forEach((f) => {
          (a('namaTindakan[]', f.namaTindakan),
            a('kode9[]', f.kode9),
            a('idicdTindakan[]', f.idicdTindakan),
            a('kategoriProsedur[]', f.kategoriProsedur || ''),
            a('komorbid[]', f.komorbid || ''),
            a('snomedProsedur[]', f.snomedProsedur || ''),
            a('codeProsedur[]', f.codeProsedur || ''));
        }),
      a('save', 'Simpan'),
      t.map(([f, L]) => encodeURIComponent(f) + '=' + encodeURIComponent(L)).join('&')
    );
  }
  function cA(e) {
    return fA(e);
  }
  function cm(e) {
    (Nl && (Nl.unmount(), (Nl = null)),
      (e.innerHTML = ''),
      (e.style.display = 'none'),
      document.body.classList.remove('ext-resume-open'),
      fm && (fm.disabled = !1));
  }
  function dA(e, t) {
    if (
      (Nl && (Nl.unmount(), (Nl = null)),
      (e.innerHTML = ''),
      !document.getElementById('morbis-resume-fonts'))
    ) {
      let l = document.createElement('link');
      ((l.id = 'morbis-resume-fonts'),
        (l.rel = 'stylesheet'),
        (l.href =
          'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;500;600;700&display=swap'),
        document.head.appendChild(l));
    }
    if (!document.getElementById('morbis-resume-css')) {
      let l = document.createElement('style');
      ((l.id = 'morbis-resume-css'),
        (l.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, ::before, ::after{
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop{
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

/*
! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: JetBrains Mono, Fira Code, Consolas, monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}

*,
  *::before,
  *::after {
    box-sizing: border-box;
  }

html {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

:root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.375rem;
  }

.dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --md-scrollbar: #484d54;
  }

::-moz-selection {
    background: #2469f0;
    color: white;
  }

::selection {
    background: #2469f0;
    color: white;
  }

* {
    scrollbar-width: thin;
    scrollbar-color: #c9cdd4 transparent;
  }

.dark * {
    scrollbar-color: var(--md-scrollbar) transparent;
  }

*::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

*::-webkit-scrollbar-track {
    background: transparent;
  }

*::-webkit-scrollbar-thumb {
    background: #c9cdd4;
    border-radius: 3px;
  }

.dark *::-webkit-scrollbar-thumb {
    background: var(--md-scrollbar);
  }

*::-webkit-scrollbar-thumb:hover {
    background: #a4a9b3;
  }

.dark *::-webkit-scrollbar-thumb:hover {
    background: #636971;
  }
.\\!container{
  width: 100% !important;
}
.container{
  width: 100%;
}
@media (min-width: 640px){

  .\\!container{
    max-width: 640px !important;
  }

  .container{
    max-width: 640px;
  }
}
@media (min-width: 768px){

  .\\!container{
    max-width: 768px !important;
  }

  .container{
    max-width: 768px;
  }
}
@media (min-width: 1024px){

  .\\!container{
    max-width: 1024px !important;
  }

  .container{
    max-width: 1024px;
  }
}
@media (min-width: 1280px){

  .\\!container{
    max-width: 1280px !important;
  }

  .container{
    max-width: 1280px;
  }
}
@media (min-width: 1536px){

  .\\!container{
    max-width: 1536px !important;
  }

  .container{
    max-width: 1536px;
  }
}
.pointer-events-none{
  pointer-events: none;
}
.visible{
  visibility: visible;
}
.static{
  position: static;
}
.fixed{
  position: fixed;
}
.absolute{
  position: absolute;
}
.relative{
  position: relative;
}
.bottom-4{
  bottom: 1rem;
}
.left-0{
  left: 0px;
}
.left-1\\/2{
  left: 50%;
}
.right-0{
  right: 0px;
}
.right-3{
  right: 0.75rem;
}
.top-1\\/2{
  top: 50%;
}
.top-full{
  top: 100%;
}
.z-50{
  z-index: 50;
}
.z-\\[1050\\]{
  z-index: 1050;
}
.z-\\[2147483647\\]{
  z-index: 2147483647;
}
.col-span-full{
  grid-column: 1 / -1;
}
.mx-auto{
  margin-left: auto;
  margin-right: auto;
}
.-mb-\\[1px\\]{
  margin-bottom: -1px;
}
.mb-1{
  margin-bottom: 0.25rem;
}
.mb-1\\.5{
  margin-bottom: 0.375rem;
}
.mb-2\\.5{
  margin-bottom: 0.625rem;
}
.mb-3{
  margin-bottom: 0.75rem;
}
.mb-3\\.5{
  margin-bottom: 0.875rem;
}
.mb-4{
  margin-bottom: 1rem;
}
.ml-0\\.5{
  margin-left: 0.125rem;
}
.ml-1\\.5{
  margin-left: 0.375rem;
}
.mr-1{
  margin-right: 0.25rem;
}
.mr-2{
  margin-right: 0.5rem;
}
.mr-3{
  margin-right: 0.75rem;
}
.mr-auto{
  margin-right: auto;
}
.mt-0\\.5{
  margin-top: 0.125rem;
}
.mt-1{
  margin-top: 0.25rem;
}
.mt-3{
  margin-top: 0.75rem;
}
.mt-px{
  margin-top: 1px;
}
.block{
  display: block;
}
.inline-block{
  display: inline-block;
}
.inline{
  display: inline;
}
.flex{
  display: flex;
}
.inline-flex{
  display: inline-flex;
}
.\\!table{
  display: table !important;
}
.table{
  display: table;
}
.grid{
  display: grid;
}
.\\!contents{
  display: contents !important;
}
.contents{
  display: contents;
}
.hidden{
  display: none;
}
.size-1\\.5{
  width: 0.375rem;
  height: 0.375rem;
}
.size-10{
  width: 2.5rem;
  height: 2.5rem;
}
.size-2\\.5{
  width: 0.625rem;
  height: 0.625rem;
}
.size-3{
  width: 0.75rem;
  height: 0.75rem;
}
.size-3\\.5{
  width: 0.875rem;
  height: 0.875rem;
}
.size-4{
  width: 1rem;
  height: 1rem;
}
.size-5{
  width: 1.25rem;
  height: 1.25rem;
}
.h-1{
  height: 0.25rem;
}
.h-10{
  height: 2.5rem;
}
.h-11{
  height: 2.75rem;
}
.h-12{
  height: 3rem;
}
.h-2{
  height: 0.5rem;
}
.h-24{
  height: 6rem;
}
.h-4{
  height: 1rem;
}
.h-5{
  height: 1.25rem;
}
.h-6{
  height: 1.5rem;
}
.h-7{
  height: 1.75rem;
}
.h-8{
  height: 2rem;
}
.h-9{
  height: 2.25rem;
}
.h-\\[300px\\]{
  height: 300px;
}
.h-\\[30px\\]{
  height: 30px;
}
.h-\\[var\\(--radix-select-trigger-height\\)\\]{
  height: var(--radix-select-trigger-height);
}
.h-full{
  height: 100%;
}
.max-h-60{
  max-height: 15rem;
}
.max-h-96{
  max-height: 24rem;
}
.max-h-\\[180px\\]{
  max-height: 180px;
}
.max-h-\\[220px\\]{
  max-height: 220px;
}
.max-h-\\[240px\\]{
  max-height: 240px;
}
.max-h-\\[600px\\]{
  max-height: 600px;
}
.min-h-\\[200px\\]{
  min-height: 200px;
}
.min-h-\\[50px\\]{
  min-height: 50px;
}
.w-10{
  width: 2.5rem;
}
.w-2{
  width: 0.5rem;
}
.w-4{
  width: 1rem;
}
.w-5{
  width: 1.25rem;
}
.w-6{
  width: 1.5rem;
}
.w-7{
  width: 1.75rem;
}
.w-8{
  width: 2rem;
}
.w-9{
  width: 2.25rem;
}
.w-\\[100px\\]{
  width: 100px;
}
.w-\\[120px\\]{
  width: 120px;
}
.w-\\[30px\\]{
  width: 30px;
}
.w-\\[340px\\]{
  width: 340px;
}
.w-\\[35\\%\\]{
  width: 35%;
}
.w-\\[90px\\]{
  width: 90px;
}
.w-full{
  width: 100%;
}
.w-px{
  width: 1px;
}
.min-w-0{
  min-width: 0px;
}
.min-w-\\[8rem\\]{
  min-width: 8rem;
}
.min-w-\\[var\\(--radix-select-trigger-width\\)\\]{
  min-width: var(--radix-select-trigger-width);
}
.max-w-\\[120px\\]{
  max-width: 120px;
}
.max-w-\\[140px\\]{
  max-width: 140px;
}
.max-w-\\[200px\\]{
  max-width: 200px;
}
.flex-1{
  flex: 1 1 0%;
}
.flex-shrink{
  flex-shrink: 1;
}
.shrink-0{
  flex-shrink: 0;
}
.-translate-x-1\\/2{
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-1\\/2{
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-90{
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform{
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes pulse{

  50%{
    opacity: .5;
  }
}
.animate-pulse{
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes slide-up{

  0%{
    opacity: 0;
    transform: translateY(8px);
  }

  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up{
  animation: slide-up 0.15s ease-out;
}
.cursor-default{
  cursor: default;
}
.cursor-not-allowed{
  cursor: not-allowed;
}
.cursor-pointer{
  cursor: pointer;
}
.select-none{
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize-none{
  resize: none;
}
.resize-y{
  resize: vertical;
}
.resize{
  resize: both;
}
.grid-cols-1{
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2{
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3{
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-\\[repeat\\(auto-fill\\2c minmax\\(100px\\2c 1fr\\)\\)\\]{
  grid-template-columns: repeat(auto-fill,minmax(100px,1fr));
}
.grid-cols-\\[repeat\\(auto-fill\\2c minmax\\(90px\\2c 1fr\\)\\)\\]{
  grid-template-columns: repeat(auto-fill,minmax(90px,1fr));
}
.flex-col{
  flex-direction: column;
}
.flex-wrap{
  flex-wrap: wrap;
}
.items-start{
  align-items: flex-start;
}
.items-center{
  align-items: center;
}
.justify-end{
  justify-content: flex-end;
}
.justify-center{
  justify-content: center;
}
.justify-between{
  justify-content: space-between;
}
.gap-0{
  gap: 0px;
}
.gap-1{
  gap: 0.25rem;
}
.gap-1\\.5{
  gap: 0.375rem;
}
.gap-2{
  gap: 0.5rem;
}
.gap-2\\.5{
  gap: 0.625rem;
}
.gap-3{
  gap: 0.75rem;
}
.gap-4{
  gap: 1rem;
}
.gap-x-8{
  -moz-column-gap: 2rem;
       column-gap: 2rem;
}
.gap-y-3{
  row-gap: 0.75rem;
}
.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.25rem * var(--tw-space-y-reverse));
}
.space-y-6 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]){
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-border > :not([hidden]) ~ :not([hidden]){
  border-color: hsl(var(--border));
}
.overflow-auto{
  overflow: auto;
}
.overflow-hidden{
  overflow: hidden;
}
.overflow-y-auto{
  overflow-y: auto;
}
.truncate{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whitespace-nowrap{
  white-space: nowrap;
}
.whitespace-pre-wrap{
  white-space: pre-wrap;
}
.break-words{
  overflow-wrap: break-word;
}
.rounded{
  border-radius: 0.25rem;
}
.rounded-full{
  border-radius: 9999px;
}
.rounded-lg{
  border-radius: 0.5rem;
}
.rounded-md{
  border-radius: 6px;
}
.rounded-sm{
  border-radius: 0.125rem;
}
.rounded-xl{
  border-radius: 0.75rem;
}
.border{
  border-width: 1px;
}
.border-2{
  border-width: 2px;
}
.border-b{
  border-bottom-width: 1px;
}
.border-b-2{
  border-bottom-width: 2px;
}
.border-l-2{
  border-left-width: 2px;
}
.border-t{
  border-top-width: 1px;
}
.border-t-2{
  border-top-width: 2px;
}
.border-dashed{
  border-style: dashed;
}
.border-none{
  border-style: none;
}
.border-\\[\\#2469f0\\]{
  --tw-border-opacity: 1;
  border-color: rgb(36 105 240 / var(--tw-border-opacity, 1));
}
.border-amber-200{
  --tw-border-opacity: 1;
  border-color: rgb(253 230 138 / var(--tw-border-opacity, 1));
}
.border-border{
  border-color: hsl(var(--border));
}
.border-destructive{
  border-color: hsl(var(--destructive));
}
.border-destructive\\/20{
  border-color: hsl(var(--destructive) / 0.2);
}
.border-foreground{
  border-color: hsl(var(--foreground));
}
.border-green-200{
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-input{
  border-color: hsl(var(--input));
}
.border-primary{
  border-color: hsl(var(--primary));
}
.border-primary\\/15{
  border-color: hsl(var(--primary) / 0.15);
}
.border-primary\\/20{
  border-color: hsl(var(--primary) / 0.2);
}
.border-red-200{
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-red-500{
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-transparent{
  border-color: transparent;
}
.bg-\\[\\#2469f0\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(36 105 240 / var(--tw-bg-opacity, 1));
}
.bg-accent{
  background-color: hsl(var(--accent));
}
.bg-accent\\/20{
  background-color: hsl(var(--accent) / 0.2);
}
.bg-accent\\/40{
  background-color: hsl(var(--accent) / 0.4);
}
.bg-accent\\/50{
  background-color: hsl(var(--accent) / 0.5);
}
.bg-amber-50{
  --tw-bg-opacity: 1;
  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));
}
.bg-amber-50\\/50{
  background-color: rgb(255 251 235 / 0.5);
}
.bg-background{
  background-color: hsl(var(--background));
}
.bg-blue-100{
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50{
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-border{
  background-color: hsl(var(--border));
}
.bg-card{
  background-color: hsl(var(--card));
}
.bg-destructive{
  background-color: hsl(var(--destructive));
}
.bg-destructive\\/10{
  background-color: hsl(var(--destructive) / 0.1);
}
.bg-destructive\\/5{
  background-color: hsl(var(--destructive) / 0.05);
}
.bg-foreground{
  background-color: hsl(var(--foreground));
}
.bg-green-50{
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500{
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-green-600{
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.bg-muted{
  background-color: hsl(var(--muted));
}
.bg-muted-foreground{
  background-color: hsl(var(--muted-foreground));
}
.bg-muted\\/30{
  background-color: hsl(var(--muted) / 0.3);
}
.bg-muted\\/40{
  background-color: hsl(var(--muted) / 0.4);
}
.bg-popover{
  background-color: hsl(var(--popover));
}
.bg-primary{
  background-color: hsl(var(--primary));
}
.bg-primary\\/10{
  background-color: hsl(var(--primary) / 0.1);
}
.bg-primary\\/5{
  background-color: hsl(var(--primary) / 0.05);
}
.bg-red-50{
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-500\\/5{
  background-color: rgb(239 68 68 / 0.05);
}
.bg-red-600{
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}
.bg-secondary{
  background-color: hsl(var(--secondary));
}
.bg-white\\/15{
  background-color: rgb(255 255 255 / 0.15);
}
.bg-yellow-50{
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-gradient-to-br{
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
.from-muted{
  --tw-gradient-from: hsl(var(--muted)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--muted) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-primary{
  --tw-gradient-from: hsl(var(--primary)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-muted\\/50{
  --tw-gradient-to: hsl(var(--muted) / 0.5) var(--tw-gradient-to-position);
}
.to-primary\\/80{
  --tw-gradient-to: hsl(var(--primary) / 0.8) var(--tw-gradient-to-position);
}
.p-0\\.5{
  padding: 0.125rem;
}
.p-1{
  padding: 0.25rem;
}
.p-1\\.5{
  padding: 0.375rem;
}
.p-2{
  padding: 0.5rem;
}
.p-2\\.5{
  padding: 0.625rem;
}
.p-3{
  padding: 0.75rem;
}
.p-3\\.5{
  padding: 0.875rem;
}
.p-4{
  padding: 1rem;
}
.p-5{
  padding: 1.25rem;
}
.p-8{
  padding: 2rem;
}
.px-1{
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-1\\.5{
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.px-2{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5{
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3{
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-3\\.5{
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}
.px-4{
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5{
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.px-6{
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-0{
  padding-top: 0px;
  padding-bottom: 0px;
}
.py-0\\.5{
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1{
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5{
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-12{
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.py-2{
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-2\\.5{
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}
.py-3{
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4{
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-5{
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
.py-8{
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pb-1\\.5{
  padding-bottom: 0.375rem;
}
.pb-2{
  padding-bottom: 0.5rem;
}
.pl-2{
  padding-left: 0.5rem;
}
.pr-14{
  padding-right: 3.5rem;
}
.pr-8{
  padding-right: 2rem;
}
.pt-3{
  padding-top: 0.75rem;
}
.text-center{
  text-align: center;
}
.font-\\[\\'Inter\\'\\2c system-ui\\2c sans-serif\\]{
  font-family: 'Inter',system-ui,sans-serif;
}
.font-\\[\\'Lexend\\'\\2c system-ui\\2c sans-serif\\]{
  font-family: 'Lexend',system-ui,sans-serif;
}
.font-mono{
  font-family: JetBrains Mono, Fira Code, Consolas, monospace;
}
.text-\\[10px\\]{
  font-size: 10px;
}
.text-\\[11px\\]{
  font-size: 11px;
}
.text-\\[13px\\]{
  font-size: 13px;
}
.text-\\[14px\\]{
  font-size: 14px;
}
.text-\\[15px\\]{
  font-size: 15px;
}
.text-\\[16px\\]{
  font-size: 16px;
}
.text-\\[18px\\]{
  font-size: 18px;
}
.text-\\[20px\\]{
  font-size: 20px;
}
.text-\\[8px\\]{
  font-size: 8px;
}
.text-\\[9px\\]{
  font-size: 9px;
}
.text-base{
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-md-sm{
  font-size: 12px;
  line-height: 18px;
}
.text-md-xs{
  font-size: 11px;
  line-height: 16px;
}
.text-sm{
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xs{
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold{
  font-weight: 700;
}
.font-medium{
  font-weight: 500;
}
.font-normal{
  font-weight: 400;
}
.font-semibold{
  font-weight: 600;
}
.uppercase{
  text-transform: uppercase;
}
.leading-relaxed{
  line-height: 1.625;
}
.tracking-tight{
  letter-spacing: -0.025em;
}
.tracking-wide{
  letter-spacing: 0.025em;
}
.tracking-wider{
  letter-spacing: 0.05em;
}
.text-\\[\\#2469f0\\]{
  --tw-text-opacity: 1;
  color: rgb(36 105 240 / var(--tw-text-opacity, 1));
}
.text-amber-700{
  --tw-text-opacity: 1;
  color: rgb(180 83 9 / var(--tw-text-opacity, 1));
}
.text-background{
  color: hsl(var(--background));
}
.text-blue-700{
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-card-foreground{
  color: hsl(var(--card-foreground));
}
.text-destructive{
  color: hsl(var(--destructive));
}
.text-destructive-foreground{
  color: hsl(var(--destructive-foreground));
}
.text-destructive\\/80{
  color: hsl(var(--destructive) / 0.8);
}
.text-foreground{
  color: hsl(var(--foreground));
}
.text-green-500{
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}
.text-green-700{
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-muted-foreground{
  color: hsl(var(--muted-foreground));
}
.text-popover-foreground{
  color: hsl(var(--popover-foreground));
}
.text-primary{
  color: hsl(var(--primary));
}
.text-primary-foreground{
  color: hsl(var(--primary-foreground));
}
.text-red-500{
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600{
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-800{
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}
.text-red-900{
  --tw-text-opacity: 1;
  color: rgb(127 29 29 / var(--tw-text-opacity, 1));
}
.text-secondary-foreground{
  color: hsl(var(--secondary-foreground));
}
.text-white{
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-white\\/70{
  color: rgb(255 255 255 / 0.7);
}
.text-yellow-600{
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}
.text-yellow-700{
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.text-yellow-800{
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
}
.underline-offset-4{
  text-underline-offset: 4px;
}
.antialiased{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.opacity-0{
  opacity: 0;
}
.opacity-30{
  opacity: 0.3;
}
.opacity-50{
  opacity: 0.5;
}
.opacity-60{
  opacity: 0.6;
}
.opacity-85{
  opacity: 0.85;
}
.opacity-90{
  opacity: 0.9;
}
.shadow{
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg{
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-md{
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm{
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none{
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline{
  outline-style: solid;
}
.ring{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-0{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.blur{
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.grayscale{
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter{
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-filter{
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition{
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all{
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors{
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform{
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-150{
  transition-duration: 150ms;
}
.duration-200{
  transition-duration: 200ms;
}
.duration-300{
  transition-duration: 300ms;
}
.ease-in-out{
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out{
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
@keyframes enter{

  from{
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}
@keyframes exit{

  to{
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
  }
}
.animate-in{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.fade-in{
  --tw-enter-opacity: 0;
}
.fade-out{
  --tw-exit-opacity: 0;
}
.duration-150{
  animation-duration: 150ms;
}
.duration-200{
  animation-duration: 200ms;
}
.duration-300{
  animation-duration: 300ms;
}
.ease-in-out{
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out{
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.running{
  animation-play-state: running;
}
.placeholder\\:text-muted-foreground::-moz-placeholder{
  color: hsl(var(--muted-foreground));
}
.placeholder\\:text-muted-foreground::placeholder{
  color: hsl(var(--muted-foreground));
}
.hover\\:bg-accent:hover{
  background-color: hsl(var(--accent));
}
.hover\\:bg-amber-100\\/50:hover{
  background-color: rgb(254 243 199 / 0.5);
}
.hover\\:bg-destructive\\/10:hover{
  background-color: hsl(var(--destructive) / 0.1);
}
.hover\\:bg-destructive\\/20:hover{
  background-color: hsl(var(--destructive) / 0.2);
}
.hover\\:bg-destructive\\/90:hover{
  background-color: hsl(var(--destructive) / 0.9);
}
.hover\\:bg-green-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-muted\\/50:hover{
  background-color: hsl(var(--muted) / 0.5);
}
.hover\\:bg-primary\\/5:hover{
  background-color: hsl(var(--primary) / 0.05);
}
.hover\\:bg-primary\\/90:hover{
  background-color: hsl(var(--primary) / 0.9);
}
.hover\\:bg-red-500\\/10:hover{
  background-color: rgb(239 68 68 / 0.1);
}
.hover\\:bg-red-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-secondary\\/80:hover{
  background-color: hsl(var(--secondary) / 0.8);
}
.hover\\:bg-white\\/15:hover{
  background-color: rgb(255 255 255 / 0.15);
}
.hover\\:bg-white\\/25:hover{
  background-color: rgb(255 255 255 / 0.25);
}
.hover\\:text-accent-foreground:hover{
  color: hsl(var(--accent-foreground));
}
.hover\\:text-destructive:hover{
  color: hsl(var(--destructive));
}
.hover\\:text-foreground:hover{
  color: hsl(var(--foreground));
}
.hover\\:text-red-600:hover{
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.hover\\:text-white:hover{
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.hover\\:underline:hover{
  text-decoration-line: underline;
}
.hover\\:opacity-70:hover{
  opacity: 0.7;
}
.focus\\:bg-accent:focus{
  background-color: hsl(var(--accent));
}
.focus\\:text-accent-foreground:focus{
  color: hsl(var(--accent-foreground));
}
.focus\\:outline-none:focus{
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring-1:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-2:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-primary:focus{
  --tw-ring-color: hsl(var(--primary));
}
.focus\\:ring-red-500:focus{
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-ring:focus{
  --tw-ring-color: hsl(var(--ring));
}
.focus\\:ring-offset-1:focus{
  --tw-ring-offset-width: 1px;
}
.focus-visible\\:outline-none:focus-visible{
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-visible\\:ring-2:focus-visible{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus-visible\\:ring-ring:focus-visible{
  --tw-ring-color: hsl(var(--ring));
}
.focus-visible\\:ring-offset-1:focus-visible{
  --tw-ring-offset-width: 1px;
}
.disabled\\:pointer-events-none:disabled{
  pointer-events: none;
}
.disabled\\:cursor-not-allowed:disabled{
  cursor: not-allowed;
}
.disabled\\:opacity-50:disabled{
  opacity: 0.5;
}
.group:hover .group-hover\\:opacity-100{
  opacity: 1;
}
.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{
  pointer-events: none;
}
.data-\\[side\\=bottom\\]\\:translate-y-1[data-side="bottom"]{
  --tw-translate-y: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=top\\]\\:-translate-y-1[data-side="top"]{
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:translate-x-4[data-state="checked"]{
  --tw-translate-x: 1rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state="unchecked"]{
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:bg-primary[data-state="checked"]{
  background-color: hsl(var(--primary));
}
.data-\\[state\\=unchecked\\]\\:bg-input[data-state="unchecked"]{
  background-color: hsl(var(--input));
}
.data-\\[disabled\\]\\:opacity-50[data-disabled]{
  opacity: 0.5;
}
.data-\\[state\\=open\\]\\:animate-in[data-state="open"]{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:animate-out[data-state="closed"]{
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:fade-out-0[data-state="closed"]{
  --tw-exit-opacity: 0;
}
.data-\\[state\\=open\\]\\:fade-in-0[data-state="open"]{
  --tw-enter-opacity: 0;
}
.data-\\[state\\=closed\\]\\:zoom-out-95[data-state="closed"]{
  --tw-exit-scale: .95;
}
.data-\\[state\\=open\\]\\:zoom-in-95[data-state="open"]{
  --tw-enter-scale: .95;
}
.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side="bottom"]{
  --tw-enter-translate-y: -0.5rem;
}
.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side="left"]{
  --tw-enter-translate-x: 0.5rem;
}
.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side="right"]{
  --tw-enter-translate-x: -0.5rem;
}
.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side="top"]{
  --tw-enter-translate-y: 0.5rem;
}
.dark\\:border-amber-800:is(.dark *){
  --tw-border-opacity: 1;
  border-color: rgb(146 64 14 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800:is(.dark *){
  --tw-border-opacity: 1;
  border-color: rgb(22 101 52 / var(--tw-border-opacity, 1));
}
.dark\\:border-red-900:is(.dark *){
  --tw-border-opacity: 1;
  border-color: rgb(127 29 29 / var(--tw-border-opacity, 1));
}
.dark\\:bg-amber-900\\/30:is(.dark *){
  background-color: rgb(120 53 15 / 0.3);
}
.dark\\:bg-amber-950\\/20:is(.dark *){
  background-color: rgb(69 26 3 / 0.2);
}
.dark\\:bg-blue-900\\/30:is(.dark *){
  background-color: rgb(30 58 138 / 0.3);
}
.dark\\:bg-blue-950\\/20:is(.dark *){
  background-color: rgb(23 37 84 / 0.2);
}
.dark\\:bg-green-950\\/20:is(.dark *){
  background-color: rgb(5 46 22 / 0.2);
}
.dark\\:bg-red-950\\/20:is(.dark *){
  background-color: rgb(69 10 10 / 0.2);
}
.dark\\:bg-yellow-950\\/30:is(.dark *){
  background-color: rgb(66 32 6 / 0.3);
}
.dark\\:text-amber-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(252 211 77 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-200:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(254 202 202 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-400:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-500:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity, 1));
}
@media (min-width: 640px){

  .sm\\:grid-cols-3{
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 768px){

  .md\\:col-span-2{
    grid-column: span 2 / span 2;
  }

  .md\\:grid-cols-2{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.\\[\\&\\>span\\]\\:line-clamp-1>span{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.\\[\\&\\>span\\]\\:h-3>span{
  height: 0.75rem;
}
.\\[\\&\\>span\\]\\:w-3>span{
  width: 0.75rem;
}
.data-\\[state\\=checked\\]\\:\\[\\&\\>span\\]\\:translate-x-3>span[data-state="checked"]{
  --tw-translate-x: 0.75rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.\\[\\&_svg\\]\\:pointer-events-none svg{
  pointer-events: none;
}
.\\[\\&_svg\\]\\:size-4 svg{
  width: 1rem;
  height: 1rem;
}
.\\[\\&_svg\\]\\:shrink-0 svg{
  flex-shrink: 0;
}

      .resume-modal * {
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
        box-sizing: border-box;
      }
      .resume-modal {
        background: #f8f6f3;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0,0,0,.3);
        width: 94%;
        max-width: 900px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: resume-slideup .3s ease;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1d23;
      }
      .resume-modal h1, .resume-modal h2, .resume-modal h3 { font-family: 'Lexend', system-ui, sans-serif; }
      .resume-modal textarea,
      .resume-modal input,
      .resume-modal select {
        font-size: 16px !important;
        min-height: 48px !important;
        pointer-events: auto !important;
      }
      .resume-modal textarea {
        resize: vertical !important;
        min-height: 120px !important;
      }
      .resume-modal .ri-modal textarea,
      .resume-modal .ri-modal input,
      .resume-modal .ri-modal select {
        pointer-events: auto !important;
      }
      .resume-modal button { cursor: pointer; min-height: 48px; }
      @keyframes resume-slideup { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    `),
        document.head.appendChild(l));
    }
    Nl = (0, Oy.createRoot)(e);
    let a = async (l) => {
      let o = cA(l),
        n = await fetch(rA, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: o,
          credentials: 'same-origin',
        }),
        u = await n.text();
      if (!n.ok)
        throw (console.error('[RJ] save failed:', n.status, u), new Error('HTTP ' + n.status));
      let r =
          /(?:<b>)?(?:Notice|Warning|Fatal error|Parse error|Catchable fatal error)(?:<\/b>)?\s*:\s*[^<]*/gi,
        s = [],
        i;
      for (; (i = r.exec(u)) !== null;) {
        let c = i[0].trim().replace(/<[^>]+>/g, '');
        c &&
          (/github\.com\/newrelic|newrelic-browser|google-analytics|googletagmanager/i.test(c) ||
            s.push(c));
      }
      if (s.length > 0)
        throw (
          console.error('[RJ] PHP errors:', s),
          new Error(
            s.join(`
`),
          )
        );
      q = null;
    };
    (Nl.render(
      (0, dm.jsx)(gi, {
        onError: () => setTimeout(() => cm(e), 0),
        children: (0, dm.jsx)(Ay, { data: t, onSave: a, onClose: () => cm(e) }),
      }),
    ),
      document.body.classList.add('ext-resume-open'),
      setTimeout(() => {
        e.querySelectorAll('textarea').forEach((l) => {
          ((l.style.height = 'auto'),
            (l.style.height = l.scrollHeight + 'px'),
            l.addEventListener('input', () => {
              ((l.style.height = 'auto'), (l.style.height = l.scrollHeight + 'px'));
            }));
        });
      }, 50));
  }
  var q = null;
  async function mA() {
    let e = new URLSearchParams(location.search).get('id_visit');
    if (!e) return {};
    let t = `${location.origin}/rekam-medik/rm-rawat-jalan-new?id_visit=${e}`;
    try {
      let l = await (await fetch(t, { credentials: 'same-origin' })).text(),
        o = new DOMParser().parseFromString(l, 'text/html'),
        n = {};
      (o.querySelectorAll('input[type="hidden"], input[type="text"]').forEach((r) => {
        r.name && !r.name.endsWith('[]') && (n[r.name] = r.value);
      }),
        o.querySelectorAll('textarea').forEach((r) => {
          r.name && (n[r.name] = r.value);
        }),
        o.querySelectorAll('select').forEach((r) => {
          (r.id && (n[r.id] = r.value),
            r.name &&
              (r.name.endsWith('[]')
                ? (Array.isArray(n[r.name]) || (n[r.name] = []), n[r.name].push(r.value))
                : (n[r.name] = r.value)));
        }),
        o.querySelectorAll('input[type="radio"]:checked').forEach((r) => {
          r.name && (n[r.name] = r.value);
        }));
      let u = new Set();
      o.querySelectorAll('input[name$="[]"]').forEach((r) => {
        r.name && u.add(r.name);
      });
      for (let r of u) {
        let s = [];
        (o.querySelectorAll(`input[name="${r}"]`).forEach((i) => {
          i.value && s.push(i.value);
        }),
          s.length > 0 && (n[r] = s));
      }
      return n;
    } catch (a) {
      return (console.error('[RJ] failed to fetch form state:', a), {});
    }
  }
  function pA() {
    let e = [];
    for (let t of document.querySelectorAll('p, td')) {
      let a = t.textContent?.trim().match(/No Resep\s*:\s*(\d+)/i);
      a && !e.includes(a[1]) && e.push(a[1]);
    }
    return e;
  }
  async function hA(e) {
    let a = await (await fetch(e, { credentials: 'same-origin' })).text(),
      o = new DOMParser().parseFromString(a, 'text/html').querySelectorAll('h5'),
      n = null;
    for (let i of o)
      if (i.textContent?.trim() === 'Resep yang ditebus') {
        n = i;
        break;
      }
    if (!n) return [];
    let u = n.nextElementSibling;
    for (; u && u.tagName !== 'TABLE';) u = u.nextElementSibling;
    if (!u) return [];
    let r = [],
      s = u.querySelectorAll('tr');
    for (let i = 1; i < s.length; i++) {
      let c = s[i].querySelectorAll('td');
      if (c.length < 8) continue;
      let p = c[1]?.textContent?.trim(),
        m = c[7]?.textContent?.trim(),
        h = c[5]?.textContent?.trim();
      p && r.push(`${p} - ${m || '-'}`);
    }
    return r;
  }
  async function gA() {
    let e = pA();
    if (!e.length) return null;
    let t = await Promise.all(
        e.map((o) => {
          let n = `${location.origin}/admisi/pelaksanaan_pelayanan/history/resep?id=${o}`;
          return hA(n);
        }),
      ),
      a = new Set(),
      l = [];
    for (let o of t)
      for (let n of o) {
        let u = n.split(' - ')[0];
        a.has(u) || (a.add(u), l.push(n));
      }
    return l.length
      ? l.join(`
`)
      : null;
  }
  function Dy() {
    if (
      !location.href.startsWith(location.origin + '/v2/m-klaim/detail-v2-refaktor') ||
      !new URLSearchParams(location.search).has('id_visit') ||
      (
        document.querySelector('input[name=jenis]')?.value ??
        document.querySelector('select[name=jenis]')?.value ??
        ''
      )
        .toUpperCase()
        .includes('INAP') ||
      document.getElementById('ext-resume-float-btn')
    )
      return;
    let l = document.createElement('div');
    ((l.id = 'ext-resume-container'),
      (l.style.cssText =
        'position: fixed; inset: 0; z-index: 1000; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;'),
      document.body.appendChild(l));
    let o = document.createElement('button');
    ((fm = o),
      (o.id = 'ext-resume-float-btn'),
      (o.textContent = 'RJ'),
      (o.title = 'Resume Rajal'),
      (o.style.cssText =
        'position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483645;width:48px;height:48px;border-radius:12px;border:none;background:#2b5f8a;color:white;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:transform .15s,box-shadow .15s;'),
      (o.onmouseenter = () => {
        ((o.style.transform = 'translateY(-50%) scale(1.05)'),
          (o.style.boxShadow = '0 4px 16px rgba(43,95,138,.35)'));
      }),
      (o.onmouseleave = () => {
        ((o.style.transform = 'translateY(-50%)'),
          (o.style.boxShadow = '0 2px 8px rgba(0,0,0,.2)'));
      }),
      o.addEventListener('click', async () => {
        if (!o.disabled) {
          o.disabled = !0;
          try {
            q || (q = await mA());
            let n = await gA(),
              u = iA();
            n && (u.clinicalNotes.terapi_pengobatan = n);
            let r = !u.clinicalNotes.tindakan || u.clinicalNotes.tindakan === '-',
              s = !u.clinicalNotes.terapi_pengobatan || u.clinicalNotes.terapi_pengobatan === '-';
            if (r || s) {
              let i = Ey();
              (i.tindakan && r && (u.clinicalNotes.tindakan = i.tindakan),
                i.terapiPengobatan &&
                  s &&
                  (u.clinicalNotes.terapi_pengobatan = i.terapiPengobatan));
            }
            ((l.style.display = 'flex'), dA(l, u));
          } catch (n) {
            (console.error('[RJ] click error:', n), (l.style.display = 'none'), (o.disabled = !1));
          }
        }
      }),
      document.body.appendChild(o),
      document.addEventListener('keydown', (n) => {
        n.key === 'Escape' && l.style.display === 'block' && cm(l);
      }));
  }
  function xA() {
    return document.documentElement.getAttribute('data-ext-resume-modal') === '1';
  }
  function LA() {
    return (
      ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'].some((t) =>
        location.pathname.toLowerCase().includes(t),
      ) || document.querySelectorAll('input[type="password"]').length > 0
    );
  }
  xA() &&
    (LA() ||
      (document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', Dy)
        : Dy()));
  return zy(SA);
})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/info.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/trash-2.mjs:
lucide-react/dist/esm/icons/triangle-alert.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.24.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
