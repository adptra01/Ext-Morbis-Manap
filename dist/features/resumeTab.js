'use strict';
var __morbis_feature = (() => {
  var dC = Object.create;
  var _i = Object.defineProperty;
  var mC = Object.getOwnPropertyDescriptor;
  var pC = Object.getOwnPropertyNames;
  var hC = Object.getPrototypeOf,
    gC = Object.prototype.hasOwnProperty;
  var Hm = (e) => {
    throw TypeError(e);
  };
  var Ca = (e, t) => () => {
    try {
      return (t || e((t = { exports: {} }).exports, t), t.exports);
    } catch (a) {
      throw ((t = 0), a);
    }
  };
  var zm = (e, t, a, l) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let o of pC(t))
        !gC.call(e, o) &&
          o !== a &&
          _i(e, o, { get: () => t[o], enumerable: !(l = mC(t, o)) || l.enumerable });
    return e;
  };
  var A = (e, t, a) => (
      (a = e != null ? dC(hC(e)) : {}),
      zm(t || !e || !e.__esModule ? _i(a, 'default', { value: e, enumerable: !0 }) : a, e)
    ),
    xC = (e) => zm(_i({}, '__esModule', { value: !0 }), e);
  var Nm = (e, t, a) => t.has(e) || Hm('Cannot ' + a);
  var st = (e, t, a) => (Nm(e, t, 'read from private field'), a ? a.call(e) : t.get(e)),
    qm = (e, t, a) =>
      t.has(e)
        ? Hm('Cannot add the same private member more than once')
        : t instanceof WeakSet
          ? t.add(e)
          : t.set(e, a),
    Ui = (e, t, a, l) => (Nm(e, t, 'write to private field'), l ? l.call(e, a) : t.set(e, a), a);
  var Wm = Ca((we) => {
    'use strict';
    function qi(e, t) {
      var a = e.length;
      e.push(t);
      e: for (; 0 < a;) {
        var l = (a - 1) >>> 1,
          o = e[l];
        if (0 < dr(o, t)) ((e[l] = t), (e[a] = o), (a = l));
        else break e;
      }
    }
    function ba(e) {
      return e.length === 0 ? null : e[0];
    }
    function pr(e) {
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
          if (0 > dr(r, a))
            s < o && 0 > dr(i, r)
              ? ((e[l] = i), (e[s] = a), (l = s))
              : ((e[l] = r), (e[u] = a), (l = u));
          else if (s < o && 0 > dr(i, a)) ((e[l] = i), (e[s] = a), (l = s));
          else break e;
        }
      }
      return t;
    }
    function dr(e, t) {
      var a = e.sortIndex - t.sortIndex;
      return a !== 0 ? a : e.id - t.id;
    }
    we.unstable_now = void 0;
    typeof performance == 'object' && typeof performance.now == 'function'
      ? ((Fm = performance),
        (we.unstable_now = function () {
          return Fm.now();
        }))
      : ((Hi = Date),
        (Gm = Hi.now()),
        (we.unstable_now = function () {
          return Hi.now() - Gm;
        }));
    var Fm,
      Hi,
      Gm,
      _a = [],
      cl = [],
      LC = 1,
      Xt = null,
      it = 3,
      Fi = !1,
      Zn = !1,
      Qn = !1,
      Gi = !1,
      jm = typeof setTimeout == 'function' ? setTimeout : null,
      Ym = typeof clearTimeout == 'function' ? clearTimeout : null,
      Vm = typeof setImmediate < 'u' ? setImmediate : null;
    function mr(e) {
      for (var t = ba(cl); t !== null;) {
        if (t.callback === null) pr(cl);
        else if (t.startTime <= e) (pr(cl), (t.sortIndex = t.expirationTime), qi(_a, t));
        else break;
        t = ba(cl);
      }
    }
    function Vi(e) {
      if (((Qn = !1), mr(e), !Zn))
        if (ba(_a) !== null) ((Zn = !0), Po || ((Po = !0), Bo()));
        else {
          var t = ba(cl);
          t !== null && Xi(Vi, t.startTime - e);
        }
    }
    var Po = !1,
      Wn = -1,
      Km = 5,
      Zm = -1;
    function Qm() {
      return Gi ? !0 : !(we.unstable_now() - Zm < Km);
    }
    function zi() {
      if (((Gi = !1), Po)) {
        var e = we.unstable_now();
        Zm = e;
        var t = !0;
        try {
          e: {
            ((Zn = !1), Qn && ((Qn = !1), Ym(Wn), (Wn = -1)), (Fi = !0));
            var a = it;
            try {
              t: {
                for (mr(e), Xt = ba(_a); Xt !== null && !(Xt.expirationTime > e && Qm());) {
                  var l = Xt.callback;
                  if (typeof l == 'function') {
                    ((Xt.callback = null), (it = Xt.priorityLevel));
                    var o = l(Xt.expirationTime <= e);
                    if (((e = we.unstable_now()), typeof o == 'function')) {
                      ((Xt.callback = o), mr(e), (t = !0));
                      break t;
                    }
                    (Xt === ba(_a) && pr(_a), mr(e));
                  } else pr(_a);
                  Xt = ba(_a);
                }
                if (Xt !== null) t = !0;
                else {
                  var n = ba(cl);
                  (n !== null && Xi(Vi, n.startTime - e), (t = !1));
                }
              }
              break e;
            } finally {
              ((Xt = null), (it = a), (Fi = !1));
            }
            t = void 0;
          }
        } finally {
          t ? Bo() : (Po = !1);
        }
      }
    }
    var Bo;
    typeof Vm == 'function'
      ? (Bo = function () {
          Vm(zi);
        })
      : typeof MessageChannel < 'u'
        ? ((Ni = new MessageChannel()),
          (Xm = Ni.port2),
          (Ni.port1.onmessage = zi),
          (Bo = function () {
            Xm.postMessage(null);
          }))
        : (Bo = function () {
            jm(zi, 0);
          });
    var Ni, Xm;
    function Xi(e, t) {
      Wn = jm(function () {
        e(we.unstable_now());
      }, t);
    }
    we.unstable_IdlePriority = 5;
    we.unstable_ImmediatePriority = 1;
    we.unstable_LowPriority = 4;
    we.unstable_NormalPriority = 3;
    we.unstable_Profiling = null;
    we.unstable_UserBlockingPriority = 2;
    we.unstable_cancelCallback = function (e) {
      e.callback = null;
    };
    we.unstable_forceFrameRate = function (e) {
      0 > e || 125 < e
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
          )
        : (Km = 0 < e ? Math.floor(1e3 / e) : 5);
    };
    we.unstable_getCurrentPriorityLevel = function () {
      return it;
    };
    we.unstable_next = function (e) {
      switch (it) {
        case 1:
        case 2:
        case 3:
          var t = 3;
          break;
        default:
          t = it;
      }
      var a = it;
      it = t;
      try {
        return e();
      } finally {
        it = a;
      }
    };
    we.unstable_requestPaint = function () {
      Gi = !0;
    };
    we.unstable_runWithPriority = function (e, t) {
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
      var a = it;
      it = e;
      try {
        return t();
      } finally {
        it = a;
      }
    };
    we.unstable_scheduleCallback = function (e, t, a) {
      var l = we.unstable_now();
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
          id: LC++,
          callback: t,
          priorityLevel: e,
          startTime: a,
          expirationTime: o,
          sortIndex: -1,
        }),
        a > l
          ? ((e.sortIndex = a),
            qi(cl, e),
            ba(_a) === null &&
              e === ba(cl) &&
              (Qn ? (Ym(Wn), (Wn = -1)) : (Qn = !0), Xi(Vi, a - l)))
          : ((e.sortIndex = o), qi(_a, e), Zn || Fi || ((Zn = !0), Po || ((Po = !0), Bo()))),
        e
      );
    };
    we.unstable_shouldYield = Qm;
    we.unstable_wrapCallback = function (e) {
      var t = it;
      return function () {
        var a = it;
        it = t;
        try {
          return e.apply(this, arguments);
        } finally {
          it = a;
        }
      };
    };
  });
  var $m = Ca((n1, Jm) => {
    'use strict';
    Jm.exports = Wm();
  });
  var fp = Ca((V) => {
    'use strict';
    var Ki = Symbol.for('react.transitional.element'),
      SC = Symbol.for('react.portal'),
      vC = Symbol.for('react.fragment'),
      yC = Symbol.for('react.strict_mode'),
      CC = Symbol.for('react.profiler'),
      bC = Symbol.for('react.consumer'),
      IC = Symbol.for('react.context'),
      wC = Symbol.for('react.forward_ref'),
      RC = Symbol.for('react.suspense'),
      AC = Symbol.for('react.memo'),
      op = Symbol.for('react.lazy'),
      TC = Symbol.for('react.activity'),
      ep = Symbol.iterator;
    function kC(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (ep && e[ep]) || e['@@iterator']), typeof e == 'function' ? e : null);
    }
    var np = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      up = Object.assign,
      rp = {};
    function Uo(e, t, a) {
      ((this.props = e), (this.context = t), (this.refs = rp), (this.updater = a || np));
    }
    Uo.prototype.isReactComponent = {};
    Uo.prototype.setState = function (e, t) {
      if (typeof e != 'object' && typeof e != 'function' && e != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, e, t, 'setState');
    };
    Uo.prototype.forceUpdate = function (e) {
      this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
    };
    function sp() {}
    sp.prototype = Uo.prototype;
    function Zi(e, t, a) {
      ((this.props = e), (this.context = t), (this.refs = rp), (this.updater = a || np));
    }
    var Qi = (Zi.prototype = new sp());
    Qi.constructor = Zi;
    up(Qi, Uo.prototype);
    Qi.isPureReactComponent = !0;
    var tp = Array.isArray;
    function Yi() {}
    var Le = { H: null, A: null, T: null, S: null },
      ip = Object.prototype.hasOwnProperty;
    function Wi(e, t, a) {
      var l = a.ref;
      return { $$typeof: Ki, type: e, key: t, ref: l !== void 0 ? l : null, props: a };
    }
    function MC(e, t) {
      return Wi(e.type, t, e.props);
    }
    function Ji(e) {
      return typeof e == 'object' && e !== null && e.$$typeof === Ki;
    }
    function DC(e) {
      var t = { '=': '=0', ':': '=2' };
      return (
        '$' +
        e.replace(/[=:]/g, function (a) {
          return t[a];
        })
      );
    }
    var ap = /\/+/g;
    function ji(e, t) {
      return typeof e == 'object' && e !== null && e.key != null ? DC('' + e.key) : t.toString(36);
    }
    function EC(e) {
      switch (e.status) {
        case 'fulfilled':
          return e.value;
        case 'rejected':
          throw e.reason;
        default:
          switch (
            (typeof e.status == 'string'
              ? e.then(Yi, Yi)
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
    function _o(e, t, a, l, o) {
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
              case Ki:
              case SC:
                u = !0;
                break;
              case op:
                return ((u = e._init), _o(u(e._payload), t, a, l, o));
            }
        }
      if (u)
        return (
          (o = o(e)),
          (u = l === '' ? '.' + ji(e, 0) : l),
          tp(o)
            ? ((a = ''),
              u != null && (a = u.replace(ap, '$&/') + '/'),
              _o(o, t, a, '', function (i) {
                return i;
              }))
            : o != null &&
              (Ji(o) &&
                (o = MC(
                  o,
                  a +
                    (o.key == null || (e && e.key === o.key)
                      ? ''
                      : ('' + o.key).replace(ap, '$&/') + '/') +
                    u,
                )),
              t.push(o)),
          1
        );
      u = 0;
      var r = l === '' ? '.' : l + ':';
      if (tp(e))
        for (var s = 0; s < e.length; s++)
          ((l = e[s]), (n = r + ji(l, s)), (u += _o(l, t, a, n, o)));
      else if (((s = kC(e)), typeof s == 'function'))
        for (e = s.call(e), s = 0; !(l = e.next()).done;)
          ((l = l.value), (n = r + ji(l, s++)), (u += _o(l, t, a, n, o)));
      else if (n === 'object') {
        if (typeof e.then == 'function') return _o(EC(e), t, a, l, o);
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
    function hr(e, t, a) {
      if (e == null) return e;
      var l = [],
        o = 0;
      return (
        _o(e, l, '', '', function (n) {
          return t.call(a, n, o++);
        }),
        l
      );
    }
    function OC(e) {
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
    var lp =
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
      BC = {
        map: hr,
        forEach: function (e, t, a) {
          hr(
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
            hr(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            hr(e, function (t) {
              return t;
            }) || []
          );
        },
        only: function (e) {
          if (!Ji(e))
            throw Error('React.Children.only expected to receive a single React element child.');
          return e;
        },
      };
    V.Activity = TC;
    V.Children = BC;
    V.Component = Uo;
    V.Fragment = vC;
    V.Profiler = CC;
    V.PureComponent = Zi;
    V.StrictMode = yC;
    V.Suspense = RC;
    V.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Le;
    V.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (e) {
        return Le.H.useMemoCache(e);
      },
    };
    V.cache = function (e) {
      return function () {
        return e.apply(null, arguments);
      };
    };
    V.cacheSignal = function () {
      return null;
    };
    V.cloneElement = function (e, t, a) {
      if (e == null) throw Error('The argument must be a React element, but you passed ' + e + '.');
      var l = up({}, e.props),
        o = e.key;
      if (t != null)
        for (n in (t.key !== void 0 && (o = '' + t.key), t))
          !ip.call(t, n) ||
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
      return Wi(e.type, o, l);
    };
    V.createContext = function (e) {
      return (
        (e = {
          $$typeof: IC,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (e.Provider = e),
        (e.Consumer = { $$typeof: bC, _context: e }),
        e
      );
    };
    V.createElement = function (e, t, a) {
      var l,
        o = {},
        n = null;
      if (t != null)
        for (l in (t.key !== void 0 && (n = '' + t.key), t))
          ip.call(t, l) && l !== 'key' && l !== '__self' && l !== '__source' && (o[l] = t[l]);
      var u = arguments.length - 2;
      if (u === 1) o.children = a;
      else if (1 < u) {
        for (var r = Array(u), s = 0; s < u; s++) r[s] = arguments[s + 2];
        o.children = r;
      }
      if (e && e.defaultProps)
        for (l in ((u = e.defaultProps), u)) o[l] === void 0 && (o[l] = u[l]);
      return Wi(e, n, o);
    };
    V.createRef = function () {
      return { current: null };
    };
    V.forwardRef = function (e) {
      return { $$typeof: wC, render: e };
    };
    V.isValidElement = Ji;
    V.lazy = function (e) {
      return { $$typeof: op, _payload: { _status: -1, _result: e }, _init: OC };
    };
    V.memo = function (e, t) {
      return { $$typeof: AC, type: e, compare: t === void 0 ? null : t };
    };
    V.startTransition = function (e) {
      var t = Le.T,
        a = {};
      Le.T = a;
      try {
        var l = e(),
          o = Le.S;
        (o !== null && o(a, l),
          typeof l == 'object' && l !== null && typeof l.then == 'function' && l.then(Yi, lp));
      } catch (n) {
        lp(n);
      } finally {
        (t !== null && a.types !== null && (t.types = a.types), (Le.T = t));
      }
    };
    V.unstable_useCacheRefresh = function () {
      return Le.H.useCacheRefresh();
    };
    V.use = function (e) {
      return Le.H.use(e);
    };
    V.useActionState = function (e, t, a) {
      return Le.H.useActionState(e, t, a);
    };
    V.useCallback = function (e, t) {
      return Le.H.useCallback(e, t);
    };
    V.useContext = function (e) {
      return Le.H.useContext(e);
    };
    V.useDebugValue = function () {};
    V.useDeferredValue = function (e, t) {
      return Le.H.useDeferredValue(e, t);
    };
    V.useEffect = function (e, t) {
      return Le.H.useEffect(e, t);
    };
    V.useEffectEvent = function (e) {
      return Le.H.useEffectEvent(e);
    };
    V.useId = function () {
      return Le.H.useId();
    };
    V.useImperativeHandle = function (e, t, a) {
      return Le.H.useImperativeHandle(e, t, a);
    };
    V.useInsertionEffect = function (e, t) {
      return Le.H.useInsertionEffect(e, t);
    };
    V.useLayoutEffect = function (e, t) {
      return Le.H.useLayoutEffect(e, t);
    };
    V.useMemo = function (e, t) {
      return Le.H.useMemo(e, t);
    };
    V.useOptimistic = function (e, t) {
      return Le.H.useOptimistic(e, t);
    };
    V.useReducer = function (e, t, a) {
      return Le.H.useReducer(e, t, a);
    };
    V.useRef = function (e) {
      return Le.H.useRef(e);
    };
    V.useState = function (e) {
      return Le.H.useState(e);
    };
    V.useSyncExternalStore = function (e, t, a) {
      return Le.H.useSyncExternalStore(e, t, a);
    };
    V.useTransition = function () {
      return Le.H.useTransition();
    };
    V.version = '19.2.8';
  });
  var P = Ca((r1, cp) => {
    'use strict';
    cp.exports = fp();
  });
  var mp = Ca((mt) => {
    'use strict';
    var PC = P();
    function dp(e) {
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
    function dl() {}
    var dt = {
        d: {
          f: dl,
          r: function () {
            throw Error(dp(522));
          },
          D: dl,
          C: dl,
          L: dl,
          m: dl,
          X: dl,
          S: dl,
          M: dl,
        },
        p: 0,
        findDOMNode: null,
      },
      _C = Symbol.for('react.portal');
    function UC(e, t, a) {
      var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: _C,
        key: l == null ? null : '' + l,
        children: e,
        containerInfo: t,
        implementation: a,
      };
    }
    var Jn = PC.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function gr(e, t) {
      if (e === 'font') return '';
      if (typeof t == 'string') return t === 'use-credentials' ? t : '';
    }
    mt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = dt;
    mt.createPortal = function (e, t) {
      var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)) throw Error(dp(299));
      return UC(e, t, null, a);
    };
    mt.flushSync = function (e) {
      var t = Jn.T,
        a = dt.p;
      try {
        if (((Jn.T = null), (dt.p = 2), e)) return e();
      } finally {
        ((Jn.T = t), (dt.p = a), dt.d.f());
      }
    };
    mt.preconnect = function (e, t) {
      typeof e == 'string' &&
        (t
          ? ((t = t.crossOrigin),
            (t = typeof t == 'string' ? (t === 'use-credentials' ? t : '') : void 0))
          : (t = null),
        dt.d.C(e, t));
    };
    mt.prefetchDNS = function (e) {
      typeof e == 'string' && dt.d.D(e);
    };
    mt.preinit = function (e, t) {
      if (typeof e == 'string' && t && typeof t.as == 'string') {
        var a = t.as,
          l = gr(a, t.crossOrigin),
          o = typeof t.integrity == 'string' ? t.integrity : void 0,
          n = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0;
        a === 'style'
          ? dt.d.S(e, typeof t.precedence == 'string' ? t.precedence : void 0, {
              crossOrigin: l,
              integrity: o,
              fetchPriority: n,
            })
          : a === 'script' &&
            dt.d.X(e, {
              crossOrigin: l,
              integrity: o,
              fetchPriority: n,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
      }
    };
    mt.preinitModule = function (e, t) {
      if (typeof e == 'string')
        if (typeof t == 'object' && t !== null) {
          if (t.as == null || t.as === 'script') {
            var a = gr(t.as, t.crossOrigin);
            dt.d.M(e, {
              crossOrigin: a,
              integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
          }
        } else t == null && dt.d.M(e);
    };
    mt.preload = function (e, t) {
      if (typeof e == 'string' && typeof t == 'object' && t !== null && typeof t.as == 'string') {
        var a = t.as,
          l = gr(a, t.crossOrigin);
        dt.d.L(e, a, {
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
    mt.preloadModule = function (e, t) {
      if (typeof e == 'string')
        if (t) {
          var a = gr(t.as, t.crossOrigin);
          dt.d.m(e, {
            as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0,
            crossOrigin: a,
            integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          });
        } else dt.d.m(e);
    };
    mt.requestFormReset = function (e) {
      dt.d.r(e);
    };
    mt.unstable_batchedUpdates = function (e, t) {
      return e(t);
    };
    mt.useFormState = function (e, t, a) {
      return Jn.H.useFormState(e, t, a);
    };
    mt.useFormStatus = function () {
      return Jn.H.useHostTransitionStatus();
    };
    mt.version = '19.2.8';
  });
  var Ho = Ca((i1, hp) => {
    'use strict';
    function pp() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pp);
        } catch (e) {
          console.error(e);
        }
    }
    (pp(), (hp.exports = mp()));
  });
  var AL = Ca((qs) => {
    'use strict';
    var Ge = $m(),
      qh = P(),
      HC = Ho();
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
    function Fh(e) {
      return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
    }
    function Hu(e) {
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
    function Gh(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
          return t.dehydrated;
      }
      return null;
    }
    function Vh(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
          return t.dehydrated;
      }
      return null;
    }
    function gp(e) {
      if (Hu(e) !== e) throw Error(w(188));
    }
    function zC(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = Hu(e)), t === null)) throw Error(w(188));
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
            if (n === a) return (gp(o), e);
            if (n === l) return (gp(o), t);
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
    function Xh(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null;) {
        if (((t = Xh(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    var ye = Object.assign,
      NC = Symbol.for('react.element'),
      xr = Symbol.for('react.transitional.element'),
      uu = Symbol.for('react.portal'),
      Vo = Symbol.for('react.fragment'),
      jh = Symbol.for('react.strict_mode'),
      Of = Symbol.for('react.profiler'),
      Yh = Symbol.for('react.consumer'),
      Va = Symbol.for('react.context'),
      Tc = Symbol.for('react.forward_ref'),
      Bf = Symbol.for('react.suspense'),
      Pf = Symbol.for('react.suspense_list'),
      kc = Symbol.for('react.memo'),
      ml = Symbol.for('react.lazy'),
      _f = Symbol.for('react.activity'),
      qC = Symbol.for('react.memo_cache_sentinel'),
      xp = Symbol.iterator;
    function $n(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (xp && e[xp]) || e['@@iterator']), typeof e == 'function' ? e : null);
    }
    var FC = Symbol.for('react.client.reference');
    function Uf(e) {
      if (e == null) return null;
      if (typeof e == 'function') return e.$$typeof === FC ? null : e.displayName || e.name || null;
      if (typeof e == 'string') return e;
      switch (e) {
        case Vo:
          return 'Fragment';
        case Of:
          return 'Profiler';
        case jh:
          return 'StrictMode';
        case Bf:
          return 'Suspense';
        case Pf:
          return 'SuspenseList';
        case _f:
          return 'Activity';
      }
      if (typeof e == 'object')
        switch (e.$$typeof) {
          case uu:
            return 'Portal';
          case Va:
            return e.displayName || 'Context';
          case Yh:
            return (e._context.displayName || 'Context') + '.Consumer';
          case Tc:
            var t = e.render;
            return (
              (e = e.displayName),
              e ||
                ((e = t.displayName || t.name || ''),
                (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
              e
            );
          case kc:
            return ((t = e.displayName || null), t !== null ? t : Uf(e.type) || 'Memo');
          case ml:
            ((t = e._payload), (e = e._init));
            try {
              return Uf(e(t));
            } catch {}
        }
      return null;
    }
    var ru = Array.isArray,
      _ = qh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      ne = HC.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      eo = { pending: !1, data: null, method: null, action: null },
      Hf = [],
      Xo = -1;
    function Ta(e) {
      return { current: e };
    }
    function Ze(e) {
      0 > Xo || ((e.current = Hf[Xo]), (Hf[Xo] = null), Xo--);
    }
    function he(e, t) {
      (Xo++, (Hf[Xo] = e.current), (e.current = t));
    }
    var Aa = Ta(null),
      Iu = Ta(null),
      Il = Ta(null),
      Qr = Ta(null);
    function Wr(e, t) {
      switch ((he(Il, t), he(Iu, e), he(Aa, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Ih(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI))) ((t = Ih(t)), (e = mL(t, e)));
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
      (Ze(Aa), he(Aa, e));
    }
    function fn() {
      (Ze(Aa), Ze(Iu), Ze(Il));
    }
    function zf(e) {
      e.memoizedState !== null && he(Qr, e);
      var t = Aa.current,
        a = mL(t, e.type);
      t !== a && (he(Iu, e), he(Aa, a));
    }
    function Jr(e) {
      (Iu.current === e && (Ze(Aa), Ze(Iu)), Qr.current === e && (Ze(Qr), (Pu._currentValue = eo)));
    }
    var $i, Lp;
    function Ql(e) {
      if ($i === void 0)
        try {
          throw Error();
        } catch (a) {
          var t = a.stack.trim().match(/\n( *(at )?)/);
          (($i = (t && t[1]) || ''),
            (Lp =
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
        $i +
        e +
        Lp
      );
    }
    var ef = !1;
    function tf(e, t) {
      if (!e || ef) return '';
      ef = !0;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var l = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var m = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(m.prototype, 'props', {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == 'object' && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(m, []);
                  } catch (p) {
                    var f = p;
                  }
                  Reflect.construct(e, [], m);
                } else {
                  try {
                    m.call();
                  } catch (p) {
                    f = p;
                  }
                  e.call(m.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (p) {
                  f = p;
                }
                (m = e()) && typeof m.catch == 'function' && m.catch(function () {});
              }
            } catch (p) {
              if (p && f && typeof p.stack == 'string') return [p.stack, f.stack];
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
                    var h =
                      `
` + s[l].replace(' at new ', ' at ');
                    return (
                      e.displayName &&
                        h.includes('<anonymous>') &&
                        (h = h.replace('<anonymous>', e.displayName)),
                      h
                    );
                  }
                while (1 <= l && 0 <= o);
              break;
            }
        }
      } finally {
        ((ef = !1), (Error.prepareStackTrace = a));
      }
      return (a = e ? e.displayName || e.name : '') ? Ql(a) : '';
    }
    function GC(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Ql(e.type);
        case 16:
          return Ql('Lazy');
        case 13:
          return e.child !== t && t !== null ? Ql('Suspense Fallback') : Ql('Suspense');
        case 19:
          return Ql('SuspenseList');
        case 0:
        case 15:
          return tf(e.type, !1);
        case 11:
          return tf(e.type.render, !1);
        case 1:
          return tf(e.type, !0);
        case 31:
          return Ql('Activity');
        default:
          return '';
      }
    }
    function Sp(e) {
      try {
        var t = '',
          a = null;
        do ((t += GC(e, a)), (a = e), (e = e.return));
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
    var Nf = Object.prototype.hasOwnProperty,
      Mc = Ge.unstable_scheduleCallback,
      af = Ge.unstable_cancelCallback,
      VC = Ge.unstable_shouldYield,
      XC = Ge.unstable_requestPaint,
      Bt = Ge.unstable_now,
      jC = Ge.unstable_getCurrentPriorityLevel,
      Kh = Ge.unstable_ImmediatePriority,
      Zh = Ge.unstable_UserBlockingPriority,
      $r = Ge.unstable_NormalPriority,
      YC = Ge.unstable_LowPriority,
      Qh = Ge.unstable_IdlePriority,
      KC = Ge.log,
      ZC = Ge.unstable_setDisableYieldValue,
      zu = null,
      Pt = null;
    function Sl(e) {
      if ((typeof KC == 'function' && ZC(e), Pt && typeof Pt.setStrictMode == 'function'))
        try {
          Pt.setStrictMode(zu, e);
        } catch {}
    }
    var _t = Math.clz32 ? Math.clz32 : JC,
      QC = Math.log,
      WC = Math.LN2;
    function JC(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((QC(e) / WC) | 0)) | 0);
    }
    var Lr = 256,
      Sr = 262144,
      vr = 4194304;
    function Wl(e) {
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
    function ws(e, t, a) {
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
              ? (o = Wl(l))
              : ((u &= r), u !== 0 ? (o = Wl(u)) : a || ((a = r & ~e), a !== 0 && (o = Wl(a)))))
          : ((r = l & ~n),
            r !== 0
              ? (o = Wl(r))
              : u !== 0
                ? (o = Wl(u))
                : a || ((a = l & ~e), a !== 0 && (o = Wl(a)))),
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
    function Nu(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function $C(e, t) {
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
    function Wh() {
      var e = vr;
      return ((vr <<= 1), (vr & 62914560) === 0 && (vr = 4194304), e);
    }
    function lf(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function qu(e, t) {
      ((e.pendingLanes |= t),
        t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function eb(e, t, a, l, o, n) {
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
        var h = 31 - _t(a),
          m = 1 << h;
        ((r[h] = 0), (s[h] = -1));
        var f = i[h];
        if (f !== null)
          for (i[h] = null, h = 0; h < f.length; h++) {
            var p = f[h];
            p !== null && (p.lane &= -536870913);
          }
        a &= ~m;
      }
      (l !== 0 && Jh(e, l, 0),
        n !== 0 && o === 0 && e.tag !== 0 && (e.suspendedLanes |= n & ~(u & ~t)));
    }
    function Jh(e, t, a) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var l = 31 - _t(t);
      ((e.entangledLanes |= t),
        (e.entanglements[l] = e.entanglements[l] | 1073741824 | (a & 261930)));
    }
    function $h(e, t) {
      var a = (e.entangledLanes |= t);
      for (e = e.entanglements; a;) {
        var l = 31 - _t(a),
          o = 1 << l;
        ((o & t) | (e[l] & t) && (e[l] |= t), (a &= ~o));
      }
    }
    function eg(e, t) {
      var a = t & -t;
      return ((a = (a & 42) !== 0 ? 1 : Dc(a)), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a);
    }
    function Dc(e) {
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
    function Ec(e) {
      return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
    }
    function tg() {
      var e = ne.p;
      return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : IL(e.type));
    }
    function vp(e, t) {
      var a = ne.p;
      try {
        return ((ne.p = e), t());
      } finally {
        ne.p = a;
      }
    }
    var Ul = Math.random().toString(36).slice(2),
      et = '__reactFiber$' + Ul,
      It = '__reactProps$' + Ul,
      yn = '__reactContainer$' + Ul,
      qf = '__reactEvents$' + Ul,
      tb = '__reactListeners$' + Ul,
      ab = '__reactHandles$' + Ul,
      yp = '__reactResources$' + Ul,
      Fu = '__reactMarker$' + Ul;
    function Oc(e) {
      (delete e[et], delete e[It], delete e[qf], delete e[tb], delete e[ab]);
    }
    function jo(e) {
      var t = e[et];
      if (t) return t;
      for (var a = e.parentNode; a;) {
        if ((t = a[yn] || a[et])) {
          if (((a = t.alternate), t.child !== null || (a !== null && a.child !== null)))
            for (e = kh(e); e !== null;) {
              if ((a = e[et])) return a;
              e = kh(e);
            }
          return t;
        }
        ((e = a), (a = e.parentNode));
      }
      return null;
    }
    function Cn(e) {
      if ((e = e[et] || e[yn])) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function su(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(w(33));
    }
    function an(e) {
      var t = e[yp];
      return (t || (t = e[yp] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
    }
    function Ke(e) {
      e[Fu] = !0;
    }
    var ag = new Set(),
      lg = {};
    function fo(e, t) {
      (cn(e, t), cn(e + 'Capture', t));
    }
    function cn(e, t) {
      for (lg[e] = t, e = 0; e < t.length; e++) ag.add(t[e]);
    }
    var lb = RegExp(
        '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
      ),
      Cp = {},
      bp = {};
    function ob(e) {
      return Nf.call(bp, e)
        ? !0
        : Nf.call(Cp, e)
          ? !1
          : lb.test(e)
            ? (bp[e] = !0)
            : ((Cp[e] = !0), !1);
    }
    function Pr(e, t, a) {
      if (ob(t))
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
    function yr(e, t, a) {
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
    function Ua(e, t, a, l) {
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
    function Yt(e) {
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
    function og(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
    }
    function nb(e, t, a) {
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
    function Ff(e) {
      if (!e._valueTracker) {
        var t = og(e) ? 'checked' : 'value';
        e._valueTracker = nb(e, t, '' + e[t]);
      }
    }
    function ng(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var a = t.getValue(),
        l = '';
      return (
        e && (l = og(e) ? (e.checked ? 'true' : 'false') : e.value),
        (e = l),
        e !== a ? (t.setValue(e), !0) : !1
      );
    }
    function es(e) {
      if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var ub = /[\n"\\]/g;
    function Qt(e) {
      return e.replace(ub, function (t) {
        return '\\' + t.charCodeAt(0).toString(16) + ' ';
      });
    }
    function Gf(e, t, a, l, o, n, u, r) {
      ((e.name = ''),
        u != null && typeof u != 'function' && typeof u != 'symbol' && typeof u != 'boolean'
          ? (e.type = u)
          : e.removeAttribute('type'),
        t != null
          ? u === 'number'
            ? ((t === 0 && e.value === '') || e.value != t) && (e.value = '' + Yt(t))
            : e.value !== '' + Yt(t) && (e.value = '' + Yt(t))
          : (u !== 'submit' && u !== 'reset') || e.removeAttribute('value'),
        t != null
          ? Vf(e, u, Yt(t))
          : a != null
            ? Vf(e, u, Yt(a))
            : l != null && e.removeAttribute('value'),
        o == null && n != null && (e.defaultChecked = !!n),
        o != null && (e.checked = o && typeof o != 'function' && typeof o != 'symbol'),
        r != null && typeof r != 'function' && typeof r != 'symbol' && typeof r != 'boolean'
          ? (e.name = '' + Yt(r))
          : e.removeAttribute('name'));
    }
    function ug(e, t, a, l, o, n, u, r) {
      if (
        (n != null &&
          typeof n != 'function' &&
          typeof n != 'symbol' &&
          typeof n != 'boolean' &&
          (e.type = n),
        t != null || a != null)
      ) {
        if (!((n !== 'submit' && n !== 'reset') || t != null)) {
          Ff(e);
          return;
        }
        ((a = a != null ? '' + Yt(a) : ''),
          (t = t != null ? '' + Yt(t) : a),
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
        Ff(e));
    }
    function Vf(e, t, a) {
      (t === 'number' && es(e.ownerDocument) === e) ||
        e.defaultValue === '' + a ||
        (e.defaultValue = '' + a);
    }
    function ln(e, t, a, l) {
      if (((e = e.options), t)) {
        t = {};
        for (var o = 0; o < a.length; o++) t['$' + a[o]] = !0;
        for (a = 0; a < e.length; a++)
          ((o = t.hasOwnProperty('$' + e[a].value)),
            e[a].selected !== o && (e[a].selected = o),
            o && l && (e[a].defaultSelected = !0));
      } else {
        for (a = '' + Yt(a), t = null, o = 0; o < e.length; o++) {
          if (e[o].value === a) {
            ((e[o].selected = !0), l && (e[o].defaultSelected = !0));
            return;
          }
          t !== null || e[o].disabled || (t = e[o]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function rg(e, t, a) {
      if (t != null && ((t = '' + Yt(t)), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? '' + Yt(a) : '';
    }
    function sg(e, t, a, l) {
      if (t == null) {
        if (l != null) {
          if (a != null) throw Error(w(92));
          if (ru(l)) {
            if (1 < l.length) throw Error(w(93));
            l = l[0];
          }
          a = l;
        }
        (a == null && (a = ''), (t = a));
      }
      ((a = Yt(t)),
        (e.defaultValue = a),
        (l = e.textContent),
        l === a && l !== '' && l !== null && (e.value = l),
        Ff(e));
    }
    function dn(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === 3) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var rb = new Set(
      'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
        ' ',
      ),
    );
    function Ip(e, t, a) {
      var l = t.indexOf('--') === 0;
      a == null || typeof a == 'boolean' || a === ''
        ? l
          ? e.setProperty(t, '')
          : t === 'float'
            ? (e.cssFloat = '')
            : (e[t] = '')
        : l
          ? e.setProperty(t, a)
          : typeof a != 'number' || a === 0 || rb.has(t)
            ? t === 'float'
              ? (e.cssFloat = a)
              : (e[t] = ('' + a).trim())
            : (e[t] = a + 'px');
    }
    function ig(e, t, a) {
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
        for (var o in t) ((l = t[o]), t.hasOwnProperty(o) && a[o] !== l && Ip(e, o, l));
      } else for (var n in t) t.hasOwnProperty(n) && Ip(e, n, t[n]);
    }
    function Bc(e) {
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
    var sb = new Map([
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
      ib =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function _r(e) {
      return ib.test('' + e)
        ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        : e;
    }
    function Xa() {}
    var Xf = null;
    function Pc(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var Yo = null,
      on = null;
    function wp(e) {
      var t = Cn(e);
      if (t && (e = t.stateNode)) {
        var a = e[It] || null;
        e: switch (((e = t.stateNode), t.type)) {
          case 'input':
            if (
              (Gf(
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
                a = a.querySelectorAll('input[name="' + Qt('' + t) + '"][type="radio"]'), t = 0;
                t < a.length;
                t++
              ) {
                var l = a[t];
                if (l !== e && l.form === e.form) {
                  var o = l[It] || null;
                  if (!o) throw Error(w(90));
                  Gf(
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
              for (t = 0; t < a.length; t++) ((l = a[t]), l.form === e.form && ng(l));
            }
            break e;
          case 'textarea':
            rg(e, a.value, a.defaultValue);
            break e;
          case 'select':
            ((t = a.value), t != null && ln(e, !!a.multiple, t, !1));
        }
      }
    }
    var of = !1;
    function fg(e, t, a) {
      if (of) return e(t, a);
      of = !0;
      try {
        var l = e(t);
        return l;
      } finally {
        if (
          ((of = !1),
          (Yo !== null || on !== null) &&
            (Us(), Yo && ((t = Yo), (e = on), (on = Yo = null), wp(t), e)))
        )
          for (t = 0; t < e.length; t++) wp(e[t]);
      }
    }
    function wu(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var l = a[It] || null;
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
    var Qa = !(
        typeof window > 'u' ||
        typeof window.document > 'u' ||
        typeof window.document.createElement > 'u'
      ),
      jf = !1;
    if (Qa)
      try {
        ((zo = {}),
          Object.defineProperty(zo, 'passive', {
            get: function () {
              jf = !0;
            },
          }),
          window.addEventListener('test', zo, zo),
          window.removeEventListener('test', zo, zo));
      } catch {
        jf = !1;
      }
    var zo,
      vl = null,
      _c = null,
      Ur = null;
    function cg() {
      if (Ur) return Ur;
      var e,
        t = _c,
        a = t.length,
        l,
        o = 'value' in vl ? vl.value : vl.textContent,
        n = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++);
      var u = a - e;
      for (l = 1; l <= u && t[a - l] === o[n - l]; l++);
      return (Ur = o.slice(e, 1 < l ? 1 - l : void 0));
    }
    function Hr(e) {
      var t = e.keyCode;
      return (
        'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function Cr() {
      return !0;
    }
    function Rp() {
      return !1;
    }
    function wt(e) {
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
            ? Cr
            : Rp),
          (this.isPropagationStopped = Rp),
          this
        );
      }
      return (
        ye(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var a = this.nativeEvent;
            a &&
              (a.preventDefault
                ? a.preventDefault()
                : typeof a.returnValue != 'unknown' && (a.returnValue = !1),
              (this.isDefaultPrevented = Cr));
          },
          stopPropagation: function () {
            var a = this.nativeEvent;
            a &&
              (a.stopPropagation
                ? a.stopPropagation()
                : typeof a.cancelBubble != 'unknown' && (a.cancelBubble = !0),
              (this.isPropagationStopped = Cr));
          },
          persist: function () {},
          isPersistent: Cr,
        }),
        t
      );
    }
    var co = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Rs = wt(co),
      Gu = ye({}, co, { view: 0, detail: 0 }),
      fb = wt(Gu),
      nf,
      uf,
      eu,
      As = ye({}, Gu, {
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
        getModifierState: Uc,
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
            : (e !== eu &&
                (eu && e.type === 'mousemove'
                  ? ((nf = e.screenX - eu.screenX), (uf = e.screenY - eu.screenY))
                  : (uf = nf = 0),
                (eu = e)),
              nf);
        },
        movementY: function (e) {
          return 'movementY' in e ? e.movementY : uf;
        },
      }),
      Ap = wt(As),
      cb = ye({}, As, { dataTransfer: 0 }),
      db = wt(cb),
      mb = ye({}, Gu, { relatedTarget: 0 }),
      rf = wt(mb),
      pb = ye({}, co, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      hb = wt(pb),
      gb = ye({}, co, {
        clipboardData: function (e) {
          return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
        },
      }),
      xb = wt(gb),
      Lb = ye({}, co, { data: 0 }),
      Tp = wt(Lb),
      Sb = {
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
      vb = {
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
      yb = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
    function Cb(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = yb[e]) ? !!t[e] : !1;
    }
    function Uc() {
      return Cb;
    }
    var bb = ye({}, Gu, {
        key: function (e) {
          if (e.key) {
            var t = Sb[e.key] || e.key;
            if (t !== 'Unidentified') return t;
          }
          return e.type === 'keypress'
            ? ((e = Hr(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
            : e.type === 'keydown' || e.type === 'keyup'
              ? vb[e.keyCode] || 'Unidentified'
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
        getModifierState: Uc,
        charCode: function (e) {
          return e.type === 'keypress' ? Hr(e) : 0;
        },
        keyCode: function (e) {
          return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
        },
        which: function (e) {
          return e.type === 'keypress'
            ? Hr(e)
            : e.type === 'keydown' || e.type === 'keyup'
              ? e.keyCode
              : 0;
        },
      }),
      Ib = wt(bb),
      wb = ye({}, As, {
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
      kp = wt(wb),
      Rb = ye({}, Gu, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: Uc,
      }),
      Ab = wt(Rb),
      Tb = ye({}, co, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
      kb = wt(Tb),
      Mb = ye({}, As, {
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
      Db = wt(Mb),
      Eb = ye({}, co, { newState: 0, oldState: 0 }),
      Ob = wt(Eb),
      Bb = [9, 13, 27, 32],
      Hc = Qa && 'CompositionEvent' in window,
      cu = null;
    Qa && 'documentMode' in document && (cu = document.documentMode);
    var Pb = Qa && 'TextEvent' in window && !cu,
      dg = Qa && (!Hc || (cu && 8 < cu && 11 >= cu)),
      Mp = ' ',
      Dp = !1;
    function mg(e, t) {
      switch (e) {
        case 'keyup':
          return Bb.indexOf(t.keyCode) !== -1;
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
    function pg(e) {
      return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
    }
    var Ko = !1;
    function _b(e, t) {
      switch (e) {
        case 'compositionend':
          return pg(t);
        case 'keypress':
          return t.which !== 32 ? null : ((Dp = !0), Mp);
        case 'textInput':
          return ((e = t.data), e === Mp && Dp ? null : e);
        default:
          return null;
      }
    }
    function Ub(e, t) {
      if (Ko)
        return e === 'compositionend' || (!Hc && mg(e, t))
          ? ((e = cg()), (Ur = _c = vl = null), (Ko = !1), e)
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
          return dg && t.locale !== 'ko' ? null : t.data;
        default:
          return null;
      }
    }
    var Hb = {
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
    function Ep(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === 'input' ? !!Hb[e.type] : t === 'textarea';
    }
    function hg(e, t, a, l) {
      (Yo ? (on ? on.push(l) : (on = [l])) : (Yo = l),
        (t = Ls(t, 'onChange')),
        0 < t.length &&
          ((a = new Rs('onChange', 'change', null, a, l)), e.push({ event: a, listeners: t })));
    }
    var du = null,
      Ru = null;
    function zb(e) {
      fL(e, 0);
    }
    function Ts(e) {
      var t = su(e);
      if (ng(t)) return e;
    }
    function Op(e, t) {
      if (e === 'change') return t;
    }
    var gg = !1;
    Qa &&
      (Qa
        ? ((Ir = 'oninput' in document),
          Ir ||
            ((sf = document.createElement('div')),
            sf.setAttribute('oninput', 'return;'),
            (Ir = typeof sf.oninput == 'function')),
          (br = Ir))
        : (br = !1),
      (gg = br && (!document.documentMode || 9 < document.documentMode)));
    var br, Ir, sf;
    function Bp() {
      du && (du.detachEvent('onpropertychange', xg), (Ru = du = null));
    }
    function xg(e) {
      if (e.propertyName === 'value' && Ts(Ru)) {
        var t = [];
        (hg(t, Ru, e, Pc(e)), fg(zb, t));
      }
    }
    function Nb(e, t, a) {
      e === 'focusin'
        ? (Bp(), (du = t), (Ru = a), du.attachEvent('onpropertychange', xg))
        : e === 'focusout' && Bp();
    }
    function qb(e) {
      if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return Ts(Ru);
    }
    function Fb(e, t) {
      if (e === 'click') return Ts(t);
    }
    function Gb(e, t) {
      if (e === 'input' || e === 'change') return Ts(t);
    }
    function Vb(e, t) {
      return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
    }
    var Ht = typeof Object.is == 'function' ? Object.is : Vb;
    function Au(e, t) {
      if (Ht(e, t)) return !0;
      if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
      var a = Object.keys(e),
        l = Object.keys(t);
      if (a.length !== l.length) return !1;
      for (l = 0; l < a.length; l++) {
        var o = a[l];
        if (!Nf.call(t, o) || !Ht(e[o], t[o])) return !1;
      }
      return !0;
    }
    function Pp(e) {
      for (; e && e.firstChild;) e = e.firstChild;
      return e;
    }
    function _p(e, t) {
      var a = Pp(e);
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
        a = Pp(a);
      }
    }
    function Lg(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Lg(e, t.parentNode)
              : 'contains' in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Sg(e) {
      e =
        e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = es(e.document); t instanceof e.HTMLIFrameElement;) {
        try {
          var a = typeof t.contentWindow.location.href == 'string';
        } catch {
          a = !1;
        }
        if (a) e = t.contentWindow;
        else break;
        t = es(e.document);
      }
      return t;
    }
    function zc(e) {
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
    var Xb = Qa && 'documentMode' in document && 11 >= document.documentMode,
      Zo = null,
      Yf = null,
      mu = null,
      Kf = !1;
    function Up(e, t, a) {
      var l = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      Kf ||
        Zo == null ||
        Zo !== es(l) ||
        ((l = Zo),
        'selectionStart' in l && zc(l)
          ? (l = { start: l.selectionStart, end: l.selectionEnd })
          : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
            (l = {
              anchorNode: l.anchorNode,
              anchorOffset: l.anchorOffset,
              focusNode: l.focusNode,
              focusOffset: l.focusOffset,
            })),
        (mu && Au(mu, l)) ||
          ((mu = l),
          (l = Ls(Yf, 'onSelect')),
          0 < l.length &&
            ((t = new Rs('onSelect', 'select', null, t, a)),
            e.push({ event: t, listeners: l }),
            (t.target = Zo))));
    }
    function Zl(e, t) {
      var a = {};
      return (
        (a[e.toLowerCase()] = t.toLowerCase()),
        (a['Webkit' + e] = 'webkit' + t),
        (a['Moz' + e] = 'moz' + t),
        a
      );
    }
    var Qo = {
        animationend: Zl('Animation', 'AnimationEnd'),
        animationiteration: Zl('Animation', 'AnimationIteration'),
        animationstart: Zl('Animation', 'AnimationStart'),
        transitionrun: Zl('Transition', 'TransitionRun'),
        transitionstart: Zl('Transition', 'TransitionStart'),
        transitioncancel: Zl('Transition', 'TransitionCancel'),
        transitionend: Zl('Transition', 'TransitionEnd'),
      },
      ff = {},
      vg = {};
    Qa &&
      ((vg = document.createElement('div').style),
      'AnimationEvent' in window ||
        (delete Qo.animationend.animation,
        delete Qo.animationiteration.animation,
        delete Qo.animationstart.animation),
      'TransitionEvent' in window || delete Qo.transitionend.transition);
    function mo(e) {
      if (ff[e]) return ff[e];
      if (!Qo[e]) return e;
      var t = Qo[e],
        a;
      for (a in t) if (t.hasOwnProperty(a) && a in vg) return (ff[e] = t[a]);
      return e;
    }
    var yg = mo('animationend'),
      Cg = mo('animationiteration'),
      bg = mo('animationstart'),
      jb = mo('transitionrun'),
      Yb = mo('transitionstart'),
      Kb = mo('transitioncancel'),
      Ig = mo('transitionend'),
      wg = new Map(),
      Zf =
        'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
          ' ',
        );
    Zf.push('scrollEnd');
    function sa(e, t) {
      (wg.set(e, t), fo(t, [e]));
    }
    var ts =
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
      jt = [],
      Wo = 0,
      Nc = 0;
    function ks() {
      for (var e = Wo, t = (Nc = Wo = 0); t < e;) {
        var a = jt[t];
        jt[t++] = null;
        var l = jt[t];
        jt[t++] = null;
        var o = jt[t];
        jt[t++] = null;
        var n = jt[t];
        if (((jt[t++] = null), l !== null && o !== null)) {
          var u = l.pending;
          (u === null ? (o.next = o) : ((o.next = u.next), (u.next = o)), (l.pending = o));
        }
        n !== 0 && Rg(a, o, n);
      }
    }
    function Ms(e, t, a, l) {
      ((jt[Wo++] = e),
        (jt[Wo++] = t),
        (jt[Wo++] = a),
        (jt[Wo++] = l),
        (Nc |= l),
        (e.lanes |= l),
        (e = e.alternate),
        e !== null && (e.lanes |= l));
    }
    function qc(e, t, a, l) {
      return (Ms(e, t, a, l), as(e));
    }
    function po(e, t) {
      return (Ms(e, null, null, t), as(e));
    }
    function Rg(e, t, a) {
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
            ((o = 31 - _t(a)),
            (e = n.hiddenUpdates),
            (l = e[o]),
            l === null ? (e[o] = [t]) : l.push(t),
            (t.lane = a | 536870912)),
          n)
        : null;
    }
    function as(e) {
      if (50 < Cu) throw ((Cu = 0), (gc = null), Error(w(185)));
      for (var t = e.return; t !== null;) ((e = t), (t = e.return));
      return e.tag === 3 ? e.stateNode : null;
    }
    var Jo = {};
    function Zb(e, t, a, l) {
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
    function Et(e, t, a, l) {
      return new Zb(e, t, a, l);
    }
    function Fc(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function Ya(e, t) {
      var a = e.alternate;
      return (
        a === null
          ? ((a = Et(e.tag, t, e.key, e.mode)),
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
    function Ag(e, t) {
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
    function zr(e, t, a, l, o, n) {
      var u = 0;
      if (((l = e), typeof e == 'function')) Fc(e) && (u = 1);
      else if (typeof e == 'string')
        u = JI(e, a, Aa.current) ? 26 : e === 'html' || e === 'head' || e === 'body' ? 27 : 5;
      else
        e: switch (e) {
          case _f:
            return ((e = Et(31, a, t, o)), (e.elementType = _f), (e.lanes = n), e);
          case Vo:
            return to(a.children, o, n, t);
          case jh:
            ((u = 8), (o |= 24));
            break;
          case Of:
            return ((e = Et(12, a, t, o | 2)), (e.elementType = Of), (e.lanes = n), e);
          case Bf:
            return ((e = Et(13, a, t, o)), (e.elementType = Bf), (e.lanes = n), e);
          case Pf:
            return ((e = Et(19, a, t, o)), (e.elementType = Pf), (e.lanes = n), e);
          default:
            if (typeof e == 'object' && e !== null)
              switch (e.$$typeof) {
                case Va:
                  u = 10;
                  break e;
                case Yh:
                  u = 9;
                  break e;
                case Tc:
                  u = 11;
                  break e;
                case kc:
                  u = 14;
                  break e;
                case ml:
                  ((u = 16), (l = null));
                  break e;
              }
            ((u = 29), (a = Error(w(130, e === null ? 'null' : typeof e, ''))), (l = null));
        }
      return ((t = Et(u, a, t, o)), (t.elementType = e), (t.type = l), (t.lanes = n), t);
    }
    function to(e, t, a, l) {
      return ((e = Et(7, e, l, t)), (e.lanes = a), e);
    }
    function cf(e, t, a) {
      return ((e = Et(6, e, null, t)), (e.lanes = a), e);
    }
    function Tg(e) {
      var t = Et(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function df(e, t, a) {
      return (
        (t = Et(4, e.children !== null ? e.children : [], e.key, t)),
        (t.lanes = a),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var Hp = new WeakMap();
    function Wt(e, t) {
      if (typeof e == 'object' && e !== null) {
        var a = Hp.get(e);
        return a !== void 0 ? a : ((t = { value: e, source: t, stack: Sp(t) }), Hp.set(e, t), t);
      }
      return { value: e, source: t, stack: Sp(t) };
    }
    var $o = [],
      en = 0,
      ls = null,
      Tu = 0,
      Kt = [],
      Zt = 0,
      Ol = null,
      Ia = 1,
      wa = '';
    function Fa(e, t) {
      (($o[en++] = Tu), ($o[en++] = ls), (ls = e), (Tu = t));
    }
    function kg(e, t, a) {
      ((Kt[Zt++] = Ia), (Kt[Zt++] = wa), (Kt[Zt++] = Ol), (Ol = e));
      var l = Ia;
      e = wa;
      var o = 32 - _t(l) - 1;
      ((l &= ~(1 << o)), (a += 1));
      var n = 32 - _t(t) + o;
      if (30 < n) {
        var u = o - (o % 5);
        ((n = (l & ((1 << u) - 1)).toString(32)),
          (l >>= u),
          (o -= u),
          (Ia = (1 << (32 - _t(t) + o)) | (a << o) | l),
          (wa = n + e));
      } else ((Ia = (1 << n) | (a << o) | l), (wa = e));
    }
    function Gc(e) {
      e.return !== null && (Fa(e, 1), kg(e, 1, 0));
    }
    function Vc(e) {
      for (; e === ls;) ((ls = $o[--en]), ($o[en] = null), (Tu = $o[--en]), ($o[en] = null));
      for (; e === Ol;)
        ((Ol = Kt[--Zt]),
          (Kt[Zt] = null),
          (wa = Kt[--Zt]),
          (Kt[Zt] = null),
          (Ia = Kt[--Zt]),
          (Kt[Zt] = null));
    }
    function Mg(e, t) {
      ((Kt[Zt++] = Ia), (Kt[Zt++] = wa), (Kt[Zt++] = Ol), (Ia = t.id), (wa = t.overflow), (Ol = e));
    }
    var tt = null,
      ve = null,
      te = !1,
      wl = null,
      Jt = !1,
      Qf = Error(w(519));
    function Bl(e) {
      var t = Error(
        w(
          418,
          1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML',
          '',
        ),
      );
      throw (ku(Wt(t, e)), Qf);
    }
    function zp(e) {
      var t = e.stateNode,
        a = e.type,
        l = e.memoizedProps;
      switch (((t[et] = e), (t[It] = l), a)) {
        case 'dialog':
          (J('cancel', t), J('close', t));
          break;
        case 'iframe':
        case 'object':
        case 'embed':
          J('load', t);
          break;
        case 'video':
        case 'audio':
          for (a = 0; a < Ou.length; a++) J(Ou[a], t);
          break;
        case 'source':
          J('error', t);
          break;
        case 'img':
        case 'image':
        case 'link':
          (J('error', t), J('load', t));
          break;
        case 'details':
          J('toggle', t);
          break;
        case 'input':
          (J('invalid', t),
            ug(t, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0));
          break;
        case 'select':
          J('invalid', t);
          break;
        case 'textarea':
          (J('invalid', t), sg(t, l.value, l.defaultValue, l.children));
      }
      ((a = l.children),
        (typeof a != 'string' && typeof a != 'number' && typeof a != 'bigint') ||
        t.textContent === '' + a ||
        l.suppressHydrationWarning === !0 ||
        dL(t.textContent, a)
          ? (l.popover != null && (J('beforetoggle', t), J('toggle', t)),
            l.onScroll != null && J('scroll', t),
            l.onScrollEnd != null && J('scrollend', t),
            l.onClick != null && (t.onclick = Xa),
            (t = !0))
          : (t = !1),
        t || Bl(e, !0));
    }
    function Np(e) {
      for (tt = e.return; tt;)
        switch (tt.tag) {
          case 5:
          case 31:
          case 13:
            Jt = !1;
            return;
          case 27:
          case 3:
            Jt = !0;
            return;
          default:
            tt = tt.return;
        }
    }
    function No(e) {
      if (e !== tt) return !1;
      if (!te) return (Np(e), (te = !0), !1);
      var t = e.tag,
        a;
      if (
        ((a = t !== 3 && t !== 27) &&
          ((a = t === 5) &&
            ((a = e.type), (a = !(a !== 'form' && a !== 'button') || yc(e.type, e.memoizedProps))),
          (a = !a)),
        a && ve && Bl(e),
        Np(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
          throw Error(w(317));
        ve = Th(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
          throw Error(w(317));
        ve = Th(e);
      } else
        t === 27
          ? ((t = ve), Hl(e.type) ? ((e = wc), (wc = null), (ve = e)) : (ve = t))
          : (ve = tt ? ea(e.stateNode.nextSibling) : null);
      return !0;
    }
    function no() {
      ((ve = tt = null), (te = !1));
    }
    function mf() {
      var e = wl;
      return (e !== null && (Ct === null ? (Ct = e) : Ct.push.apply(Ct, e), (wl = null)), e);
    }
    function ku(e) {
      wl === null ? (wl = [e]) : wl.push(e);
    }
    var Wf = Ta(null),
      ho = null,
      ja = null;
    function hl(e, t, a) {
      (he(Wf, t._currentValue), (t._currentValue = a));
    }
    function Ka(e) {
      ((e._currentValue = Wf.current), Ze(Wf));
    }
    function Jf(e, t, a) {
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
    function $f(e, t, a, l) {
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
                  Jf(n.return, a, e),
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
            Jf(u, a, e),
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
    function bn(e, t, a, l) {
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
            Ht(o.pendingProps.value, u.value) || (e !== null ? e.push(r) : (e = [r]));
          }
        } else if (o === Qr.current) {
          if (((u = o.alternate), u === null)) throw Error(w(387));
          u.memoizedState.memoizedState !== o.memoizedState.memoizedState &&
            (e !== null ? e.push(Pu) : (e = [Pu]));
        }
        o = o.return;
      }
      (e !== null && $f(t, e, a, l), (t.flags |= 262144));
    }
    function os(e) {
      for (e = e.firstContext; e !== null;) {
        if (!Ht(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function uo(e) {
      ((ho = e), (ja = null), (e = e.dependencies), e !== null && (e.firstContext = null));
    }
    function at(e) {
      return Dg(ho, e);
    }
    function wr(e, t) {
      return (ho === null && uo(e), Dg(e, t));
    }
    function Dg(e, t) {
      var a = t._currentValue;
      if (((t = { context: t, memoizedValue: a, next: null }), ja === null)) {
        if (e === null) throw Error(w(308));
        ((ja = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
      } else ja = ja.next = t;
      return a;
    }
    var Qb =
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
      Wb = Ge.unstable_scheduleCallback,
      Jb = Ge.unstable_NormalPriority,
      _e = {
        $$typeof: Va,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function Xc() {
      return { controller: new Qb(), data: new Map(), refCount: 0 };
    }
    function Vu(e) {
      (e.refCount--,
        e.refCount === 0 &&
          Wb(Jb, function () {
            e.controller.abort();
          }));
    }
    var pu = null,
      ec = 0,
      mn = 0,
      nn = null;
    function $b(e, t) {
      if (pu === null) {
        var a = (pu = []);
        ((ec = 0),
          (mn = gd()),
          (nn = {
            status: 'pending',
            value: void 0,
            then: function (l) {
              a.push(l);
            },
          }));
      }
      return (ec++, t.then(qp, qp), t);
    }
    function qp() {
      if (--ec === 0 && pu !== null) {
        nn !== null && (nn.status = 'fulfilled');
        var e = pu;
        ((pu = null), (mn = 0), (nn = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function eI(e, t) {
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
    var Fp = _.S;
    _.S = function (e, t) {
      ((Xx = Bt()),
        typeof t == 'object' && t !== null && typeof t.then == 'function' && $b(e, t),
        Fp !== null && Fp(e, t));
    };
    var ao = Ta(null);
    function jc() {
      var e = ao.current;
      return e !== null ? e : me.pooledCache;
    }
    function Nr(e, t) {
      t === null ? he(ao, ao.current) : he(ao, t.pool);
    }
    function Eg() {
      var e = jc();
      return e === null ? null : { parent: _e._currentValue, pool: e };
    }
    var In = Error(w(460)),
      Yc = Error(w(474)),
      Ds = Error(w(542)),
      ns = { then: function () {} };
    function Gp(e) {
      return ((e = e.status), e === 'fulfilled' || e === 'rejected');
    }
    function Og(e, t, a) {
      switch (
        ((a = e[a]), a === void 0 ? e.push(t) : a !== t && (t.then(Xa, Xa), (t = a)), t.status)
      ) {
        case 'fulfilled':
          return t.value;
        case 'rejected':
          throw ((e = t.reason), Xp(e), e);
        default:
          if (typeof t.status == 'string') t.then(Xa, Xa);
          else {
            if (((e = me), e !== null && 100 < e.shellSuspendCounter)) throw Error(w(482));
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
              throw ((e = t.reason), Xp(e), e);
          }
          throw ((lo = t), In);
      }
    }
    function Jl(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (a) {
        throw a !== null && typeof a == 'object' && typeof a.then == 'function'
          ? ((lo = a), In)
          : a;
      }
    }
    var lo = null;
    function Vp() {
      if (lo === null) throw Error(w(459));
      var e = lo;
      return ((lo = null), e);
    }
    function Xp(e) {
      if (e === In || e === Ds) throw Error(w(483));
    }
    var un = null,
      Mu = 0;
    function Rr(e) {
      var t = Mu;
      return ((Mu += 1), un === null && (un = []), Og(un, e, t));
    }
    function tu(e, t) {
      ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
    }
    function Ar(e, t) {
      throw t.$$typeof === NC
        ? Error(w(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            w(
              31,
              e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e,
            ),
          ));
    }
    function Bg(e) {
      function t(g, d) {
        if (e) {
          var c = g.deletions;
          c === null ? ((g.deletions = [d]), (g.flags |= 16)) : c.push(d);
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
        return ((g = Ya(g, d)), (g.index = 0), (g.sibling = null), g);
      }
      function n(g, d, c) {
        return (
          (g.index = c),
          e
            ? ((c = g.alternate),
              c !== null
                ? ((c = c.index), c < d ? ((g.flags |= 67108866), d) : c)
                : ((g.flags |= 67108866), d))
            : ((g.flags |= 1048576), d)
        );
      }
      function u(g) {
        return (e && g.alternate === null && (g.flags |= 67108866), g);
      }
      function r(g, d, c, x) {
        return d === null || d.tag !== 6
          ? ((d = cf(c, g.mode, x)), (d.return = g), d)
          : ((d = o(d, c)), (d.return = g), d);
      }
      function s(g, d, c, x) {
        var y = c.type;
        return y === Vo
          ? h(g, d, c.props.children, x, c.key)
          : d !== null &&
              (d.elementType === y ||
                (typeof y == 'object' && y !== null && y.$$typeof === ml && Jl(y) === d.type))
            ? ((d = o(d, c.props)), tu(d, c), (d.return = g), d)
            : ((d = zr(c.type, c.key, c.props, null, g.mode, x)), tu(d, c), (d.return = g), d);
      }
      function i(g, d, c, x) {
        return d === null ||
          d.tag !== 4 ||
          d.stateNode.containerInfo !== c.containerInfo ||
          d.stateNode.implementation !== c.implementation
          ? ((d = df(c, g.mode, x)), (d.return = g), d)
          : ((d = o(d, c.children || [])), (d.return = g), d);
      }
      function h(g, d, c, x, y) {
        return d === null || d.tag !== 7
          ? ((d = to(c, g.mode, x, y)), (d.return = g), d)
          : ((d = o(d, c)), (d.return = g), d);
      }
      function m(g, d, c) {
        if ((typeof d == 'string' && d !== '') || typeof d == 'number' || typeof d == 'bigint')
          return ((d = cf('' + d, g.mode, c)), (d.return = g), d);
        if (typeof d == 'object' && d !== null) {
          switch (d.$$typeof) {
            case xr:
              return (
                (c = zr(d.type, d.key, d.props, null, g.mode, c)),
                tu(c, d),
                (c.return = g),
                c
              );
            case uu:
              return ((d = df(d, g.mode, c)), (d.return = g), d);
            case ml:
              return ((d = Jl(d)), m(g, d, c));
          }
          if (ru(d) || $n(d)) return ((d = to(d, g.mode, c, null)), (d.return = g), d);
          if (typeof d.then == 'function') return m(g, Rr(d), c);
          if (d.$$typeof === Va) return m(g, wr(g, d), c);
          Ar(g, d);
        }
        return null;
      }
      function f(g, d, c, x) {
        var y = d !== null ? d.key : null;
        if ((typeof c == 'string' && c !== '') || typeof c == 'number' || typeof c == 'bigint')
          return y !== null ? null : r(g, d, '' + c, x);
        if (typeof c == 'object' && c !== null) {
          switch (c.$$typeof) {
            case xr:
              return c.key === y ? s(g, d, c, x) : null;
            case uu:
              return c.key === y ? i(g, d, c, x) : null;
            case ml:
              return ((c = Jl(c)), f(g, d, c, x));
          }
          if (ru(c) || $n(c)) return y !== null ? null : h(g, d, c, x, null);
          if (typeof c.then == 'function') return f(g, d, Rr(c), x);
          if (c.$$typeof === Va) return f(g, d, wr(g, c), x);
          Ar(g, c);
        }
        return null;
      }
      function p(g, d, c, x, y) {
        if ((typeof x == 'string' && x !== '') || typeof x == 'number' || typeof x == 'bigint')
          return ((g = g.get(c) || null), r(d, g, '' + x, y));
        if (typeof x == 'object' && x !== null) {
          switch (x.$$typeof) {
            case xr:
              return ((g = g.get(x.key === null ? c : x.key) || null), s(d, g, x, y));
            case uu:
              return ((g = g.get(x.key === null ? c : x.key) || null), i(d, g, x, y));
            case ml:
              return ((x = Jl(x)), p(g, d, c, x, y));
          }
          if (ru(x) || $n(x)) return ((g = g.get(c) || null), h(d, g, x, y, null));
          if (typeof x.then == 'function') return p(g, d, c, Rr(x), y);
          if (x.$$typeof === Va) return p(g, d, c, wr(d, x), y);
          Ar(d, x);
        }
        return null;
      }
      function L(g, d, c, x) {
        for (
          var y = null, I = null, b = d, C = (d = 0), R = null;
          b !== null && C < c.length;
          C++
        ) {
          b.index > C ? ((R = b), (b = null)) : (R = b.sibling);
          var T = f(g, b, c[C], x);
          if (T === null) {
            b === null && (b = R);
            break;
          }
          (e && b && T.alternate === null && t(g, b),
            (d = n(T, d, C)),
            I === null ? (y = T) : (I.sibling = T),
            (I = T),
            (b = R));
        }
        if (C === c.length) return (a(g, b), te && Fa(g, C), y);
        if (b === null) {
          for (; C < c.length; C++)
            ((b = m(g, c[C], x)),
              b !== null && ((d = n(b, d, C)), I === null ? (y = b) : (I.sibling = b), (I = b)));
          return (te && Fa(g, C), y);
        }
        for (b = l(b); C < c.length; C++)
          ((R = p(b, g, C, c[C], x)),
            R !== null &&
              (e && R.alternate !== null && b.delete(R.key === null ? C : R.key),
              (d = n(R, d, C)),
              I === null ? (y = R) : (I.sibling = R),
              (I = R)));
        return (
          e &&
            b.forEach(function (B) {
              return t(g, B);
            }),
          te && Fa(g, C),
          y
        );
      }
      function S(g, d, c, x) {
        if (c == null) throw Error(w(151));
        for (
          var y = null, I = null, b = d, C = (d = 0), R = null, T = c.next();
          b !== null && !T.done;
          C++, T = c.next()
        ) {
          b.index > C ? ((R = b), (b = null)) : (R = b.sibling);
          var B = f(g, b, T.value, x);
          if (B === null) {
            b === null && (b = R);
            break;
          }
          (e && b && B.alternate === null && t(g, b),
            (d = n(B, d, C)),
            I === null ? (y = B) : (I.sibling = B),
            (I = B),
            (b = R));
        }
        if (T.done) return (a(g, b), te && Fa(g, C), y);
        if (b === null) {
          for (; !T.done; C++, T = c.next())
            ((T = m(g, T.value, x)),
              T !== null && ((d = n(T, d, C)), I === null ? (y = T) : (I.sibling = T), (I = T)));
          return (te && Fa(g, C), y);
        }
        for (b = l(b); !T.done; C++, T = c.next())
          ((T = p(b, g, C, T.value, x)),
            T !== null &&
              (e && T.alternate !== null && b.delete(T.key === null ? C : T.key),
              (d = n(T, d, C)),
              I === null ? (y = T) : (I.sibling = T),
              (I = T)));
        return (
          e &&
            b.forEach(function (O) {
              return t(g, O);
            }),
          te && Fa(g, C),
          y
        );
      }
      function v(g, d, c, x) {
        if (
          (typeof c == 'object' &&
            c !== null &&
            c.type === Vo &&
            c.key === null &&
            (c = c.props.children),
          typeof c == 'object' && c !== null)
        ) {
          switch (c.$$typeof) {
            case xr:
              e: {
                for (var y = c.key; d !== null;) {
                  if (d.key === y) {
                    if (((y = c.type), y === Vo)) {
                      if (d.tag === 7) {
                        (a(g, d.sibling), (x = o(d, c.props.children)), (x.return = g), (g = x));
                        break e;
                      }
                    } else if (
                      d.elementType === y ||
                      (typeof y == 'object' && y !== null && y.$$typeof === ml && Jl(y) === d.type)
                    ) {
                      (a(g, d.sibling), (x = o(d, c.props)), tu(x, c), (x.return = g), (g = x));
                      break e;
                    }
                    a(g, d);
                    break;
                  } else t(g, d);
                  d = d.sibling;
                }
                c.type === Vo
                  ? ((x = to(c.props.children, g.mode, x, c.key)), (x.return = g), (g = x))
                  : ((x = zr(c.type, c.key, c.props, null, g.mode, x)),
                    tu(x, c),
                    (x.return = g),
                    (g = x));
              }
              return u(g);
            case uu:
              e: {
                for (y = c.key; d !== null;) {
                  if (d.key === y)
                    if (
                      d.tag === 4 &&
                      d.stateNode.containerInfo === c.containerInfo &&
                      d.stateNode.implementation === c.implementation
                    ) {
                      (a(g, d.sibling), (x = o(d, c.children || [])), (x.return = g), (g = x));
                      break e;
                    } else {
                      a(g, d);
                      break;
                    }
                  else t(g, d);
                  d = d.sibling;
                }
                ((x = df(c, g.mode, x)), (x.return = g), (g = x));
              }
              return u(g);
            case ml:
              return ((c = Jl(c)), v(g, d, c, x));
          }
          if (ru(c)) return L(g, d, c, x);
          if ($n(c)) {
            if (((y = $n(c)), typeof y != 'function')) throw Error(w(150));
            return ((c = y.call(c)), S(g, d, c, x));
          }
          if (typeof c.then == 'function') return v(g, d, Rr(c), x);
          if (c.$$typeof === Va) return v(g, d, wr(g, c), x);
          Ar(g, c);
        }
        return (typeof c == 'string' && c !== '') || typeof c == 'number' || typeof c == 'bigint'
          ? ((c = '' + c),
            d !== null && d.tag === 6
              ? (a(g, d.sibling), (x = o(d, c)), (x.return = g), (g = x))
              : (a(g, d), (x = cf(c, g.mode, x)), (x.return = g), (g = x)),
            u(g))
          : a(g, d);
      }
      return function (g, d, c, x) {
        try {
          Mu = 0;
          var y = v(g, d, c, x);
          return ((un = null), y);
        } catch (b) {
          if (b === In || b === Ds) throw b;
          var I = Et(29, b, null, g.mode);
          return ((I.lanes = x), (I.return = g), I);
        }
      };
    }
    var ro = Bg(!0),
      Pg = Bg(!1),
      pl = !1;
    function Kc(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function tc(e, t) {
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
    function Rl(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function Al(e, t, a) {
      var l = e.updateQueue;
      if (l === null) return null;
      if (((l = l.shared), (oe & 2) !== 0)) {
        var o = l.pending;
        return (
          o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
          (l.pending = t),
          (t = as(e)),
          Rg(e, null, a),
          t
        );
      }
      return (Ms(e, l, t, a), as(e));
    }
    function hu(e, t, a) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))) {
        var l = t.lanes;
        ((l &= e.pendingLanes), (a |= l), (t.lanes = a), $h(e, a));
      }
    }
    function pf(e, t) {
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
    var ac = !1;
    function gu() {
      if (ac) {
        var e = nn;
        if (e !== null) throw e;
      }
    }
    function xu(e, t, a, l) {
      ac = !1;
      var o = e.updateQueue;
      pl = !1;
      var n = o.firstBaseUpdate,
        u = o.lastBaseUpdate,
        r = o.shared.pending;
      if (r !== null) {
        o.shared.pending = null;
        var s = r,
          i = s.next;
        ((s.next = null), u === null ? (n = i) : (u.next = i), (u = s));
        var h = e.alternate;
        h !== null &&
          ((h = h.updateQueue),
          (r = h.lastBaseUpdate),
          r !== u && (r === null ? (h.firstBaseUpdate = i) : (r.next = i), (h.lastBaseUpdate = s)));
      }
      if (n !== null) {
        var m = o.baseState;
        ((u = 0), (h = i = s = null), (r = n));
        do {
          var f = r.lane & -536870913,
            p = f !== r.lane;
          if (p ? (ee & f) === f : (l & f) === f) {
            (f !== 0 && f === mn && (ac = !0),
              h !== null &&
                (h = h.next =
                  { lane: 0, tag: r.tag, payload: r.payload, callback: null, next: null }));
            e: {
              var L = e,
                S = r;
              f = t;
              var v = a;
              switch (S.tag) {
                case 1:
                  if (((L = S.payload), typeof L == 'function')) {
                    m = L.call(v, m, f);
                    break e;
                  }
                  m = L;
                  break e;
                case 3:
                  L.flags = (L.flags & -65537) | 128;
                case 0:
                  if (
                    ((L = S.payload), (f = typeof L == 'function' ? L.call(v, m, f) : L), f == null)
                  )
                    break e;
                  m = ye({}, m, f);
                  break e;
                case 2:
                  pl = !0;
              }
            }
            ((f = r.callback),
              f !== null &&
                ((e.flags |= 64),
                p && (e.flags |= 8192),
                (p = o.callbacks),
                p === null ? (o.callbacks = [f]) : p.push(f)));
          } else
            ((p = { lane: f, tag: r.tag, payload: r.payload, callback: r.callback, next: null }),
              h === null ? ((i = h = p), (s = m)) : (h = h.next = p),
              (u |= f));
          if (((r = r.next), r === null)) {
            if (((r = o.shared.pending), r === null)) break;
            ((p = r),
              (r = p.next),
              (p.next = null),
              (o.lastBaseUpdate = p),
              (o.shared.pending = null));
          }
        } while (!0);
        (h === null && (s = m),
          (o.baseState = s),
          (o.firstBaseUpdate = i),
          (o.lastBaseUpdate = h),
          n === null && (o.shared.lanes = 0),
          (_l |= u),
          (e.lanes = u),
          (e.memoizedState = m));
      }
    }
    function _g(e, t) {
      if (typeof e != 'function') throw Error(w(191, e));
      e.call(t);
    }
    function Ug(e, t) {
      var a = e.callbacks;
      if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) _g(a[e], t);
    }
    var pn = Ta(null),
      us = Ta(0);
    function jp(e, t) {
      ((e = el), he(us, e), he(pn, t), (el = e | t.baseLanes));
    }
    function lc() {
      (he(us, el), he(pn, pn.current));
    }
    function Zc() {
      ((el = us.current), Ze(pn), Ze(us));
    }
    var zt = Ta(null),
      $t = null;
    function gl(e) {
      var t = e.alternate;
      (he(De, De.current & 1),
        he(zt, e),
        $t === null && (t === null || pn.current !== null || t.memoizedState !== null) && ($t = e));
    }
    function oc(e) {
      (he(De, De.current), he(zt, e), $t === null && ($t = e));
    }
    function Hg(e) {
      e.tag === 22 ? (he(De, De.current), he(zt, e), $t === null && ($t = e)) : xl(e);
    }
    function xl() {
      (he(De, De.current), he(zt, zt.current));
    }
    function Dt(e) {
      (Ze(zt), $t === e && ($t = null), Ze(De));
    }
    var De = Ta(0);
    function rs(e) {
      for (var t = e; t !== null;) {
        if (t.tag === 13) {
          var a = t.memoizedState;
          if (a !== null && ((a = a.dehydrated), a === null || bc(a) || Ic(a))) return t;
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
    var Wa = 0,
      K = null,
      ce = null,
      Be = null,
      ss = !1,
      rn = !1,
      so = !1,
      is = 0,
      Du = 0,
      sn = null,
      tI = 0;
    function ke() {
      throw Error(w(321));
    }
    function Qc(e, t) {
      if (t === null) return !1;
      for (var a = 0; a < t.length && a < e.length; a++) if (!Ht(e[a], t[a])) return !1;
      return !0;
    }
    function Wc(e, t, a, l, o, n) {
      return (
        (Wa = n),
        (K = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (_.H = e === null || e.memoizedState === null ? hx : sd),
        (so = !1),
        (n = a(l, o)),
        (so = !1),
        rn && (n = Ng(t, a, l, o)),
        zg(e),
        n
      );
    }
    function zg(e) {
      _.H = Eu;
      var t = ce !== null && ce.next !== null;
      if (((Wa = 0), (Be = ce = K = null), (ss = !1), (Du = 0), (sn = null), t))
        throw Error(w(300));
      e === null || Ue || ((e = e.dependencies), e !== null && os(e) && (Ue = !0));
    }
    function Ng(e, t, a, l) {
      K = e;
      var o = 0;
      do {
        if ((rn && (sn = null), (Du = 0), (rn = !1), 25 <= o)) throw Error(w(301));
        if (((o += 1), (Be = ce = null), e.updateQueue != null)) {
          var n = e.updateQueue;
          ((n.lastEffect = null),
            (n.events = null),
            (n.stores = null),
            n.memoCache != null && (n.memoCache.index = 0));
        }
        ((_.H = gx), (n = t(a, l)));
      } while (rn);
      return n;
    }
    function aI() {
      var e = _.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == 'function' ? Xu(t) : t),
        (e = e.useState()[0]),
        (ce !== null ? ce.memoizedState : null) !== e && (K.flags |= 1024),
        t
      );
    }
    function Jc() {
      var e = is !== 0;
      return ((is = 0), e);
    }
    function $c(e, t, a) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~a));
    }
    function ed(e) {
      if (ss) {
        for (e = e.memoizedState; e !== null;) {
          var t = e.queue;
          (t !== null && (t.pending = null), (e = e.next));
        }
        ss = !1;
      }
      ((Wa = 0), (Be = ce = K = null), (rn = !1), (Du = is = 0), (sn = null));
    }
    function pt() {
      var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return (Be === null ? (K.memoizedState = Be = e) : (Be = Be.next = e), Be);
    }
    function Ee() {
      if (ce === null) {
        var e = K.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = ce.next;
      var t = Be === null ? K.memoizedState : Be.next;
      if (t !== null) ((Be = t), (ce = e));
      else {
        if (e === null) throw K.alternate === null ? Error(w(467)) : Error(w(310));
        ((ce = e),
          (e = {
            memoizedState: ce.memoizedState,
            baseState: ce.baseState,
            baseQueue: ce.baseQueue,
            queue: ce.queue,
            next: null,
          }),
          Be === null ? (K.memoizedState = Be = e) : (Be = Be.next = e));
      }
      return Be;
    }
    function Es() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Xu(e) {
      var t = Du;
      return (
        (Du += 1),
        sn === null && (sn = []),
        (e = Og(sn, e, t)),
        (t = K),
        (Be === null ? t.memoizedState : Be.next) === null &&
          ((t = t.alternate), (_.H = t === null || t.memoizedState === null ? hx : sd)),
        e
      );
    }
    function Os(e) {
      if (e !== null && typeof e == 'object') {
        if (typeof e.then == 'function') return Xu(e);
        if (e.$$typeof === Va) return at(e);
      }
      throw Error(w(438, String(e)));
    }
    function td(e) {
      var t = null,
        a = K.updateQueue;
      if ((a !== null && (t = a.memoCache), t == null)) {
        var l = K.alternate;
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
        a === null && ((a = Es()), (K.updateQueue = a)),
        (a.memoCache = t),
        (a = t.data[t.index]),
        a === void 0)
      )
        for (a = t.data[t.index] = Array(e), l = 0; l < e; l++) a[l] = qC;
      return (t.index++, a);
    }
    function Ja(e, t) {
      return typeof t == 'function' ? t(e) : t;
    }
    function qr(e) {
      var t = Ee();
      return ad(t, ce, e);
    }
    function ad(e, t, a) {
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
          h = !1;
        do {
          var m = i.lane & -536870913;
          if (m !== i.lane ? (ee & m) === m : (Wa & m) === m) {
            var f = i.revertLane;
            if (f === 0)
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
                m === mn && (h = !0));
            else if ((Wa & f) === f) {
              ((i = i.next), f === mn && (h = !0));
              continue;
            } else
              ((m = {
                lane: 0,
                revertLane: i.revertLane,
                gesture: null,
                action: i.action,
                hasEagerState: i.hasEagerState,
                eagerState: i.eagerState,
                next: null,
              }),
                s === null ? ((r = s = m), (u = n)) : (s = s.next = m),
                (K.lanes |= f),
                (_l |= f));
            ((m = i.action), so && a(n, m), (n = i.hasEagerState ? i.eagerState : a(n, m)));
          } else
            ((f = {
              lane: m,
              revertLane: i.revertLane,
              gesture: i.gesture,
              action: i.action,
              hasEagerState: i.hasEagerState,
              eagerState: i.eagerState,
              next: null,
            }),
              s === null ? ((r = s = f), (u = n)) : (s = s.next = f),
              (K.lanes |= m),
              (_l |= m));
          i = i.next;
        } while (i !== null && i !== t);
        if (
          (s === null ? (u = n) : (s.next = r),
          !Ht(n, e.memoizedState) && ((Ue = !0), h && ((a = nn), a !== null)))
        )
          throw a;
        ((e.memoizedState = n), (e.baseState = u), (e.baseQueue = s), (l.lastRenderedState = n));
      }
      return (o === null && (l.lanes = 0), [e.memoizedState, l.dispatch]);
    }
    function hf(e) {
      var t = Ee(),
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
        (Ht(n, t.memoizedState) || (Ue = !0),
          (t.memoizedState = n),
          t.baseQueue === null && (t.baseState = n),
          (a.lastRenderedState = n));
      }
      return [n, l];
    }
    function qg(e, t, a) {
      var l = K,
        o = Ee(),
        n = te;
      if (n) {
        if (a === void 0) throw Error(w(407));
        a = a();
      } else a = t();
      var u = !Ht((ce || o).memoizedState, a);
      if (
        (u && ((o.memoizedState = a), (Ue = !0)),
        (o = o.queue),
        ld(Vg.bind(null, l, o, e), [e]),
        o.getSnapshot !== t || u || (Be !== null && Be.memoizedState.tag & 1))
      ) {
        if (
          ((l.flags |= 2048),
          hn(9, { destroy: void 0 }, Gg.bind(null, l, o, a, t), null),
          me === null)
        )
          throw Error(w(349));
        n || (Wa & 127) !== 0 || Fg(l, t, a);
      }
      return a;
    }
    function Fg(e, t, a) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: a }),
        (t = K.updateQueue),
        t === null
          ? ((t = Es()), (K.updateQueue = t), (t.stores = [e]))
          : ((a = t.stores), a === null ? (t.stores = [e]) : a.push(e)));
    }
    function Gg(e, t, a, l) {
      ((t.value = a), (t.getSnapshot = l), Xg(t) && jg(e));
    }
    function Vg(e, t, a) {
      return a(function () {
        Xg(t) && jg(e);
      });
    }
    function Xg(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !Ht(e, a);
      } catch {
        return !0;
      }
    }
    function jg(e) {
      var t = po(e, 2);
      t !== null && bt(t, e, 2);
    }
    function nc(e) {
      var t = pt();
      if (typeof e == 'function') {
        var a = e;
        if (((e = a()), so)) {
          Sl(!0);
          try {
            a();
          } finally {
            Sl(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ja,
          lastRenderedState: e,
        }),
        t
      );
    }
    function Yg(e, t, a, l) {
      return ((e.baseState = a), ad(e, ce, typeof l == 'function' ? l : Ja));
    }
    function lI(e, t, a, l, o) {
      if (Ps(e)) throw Error(w(485));
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
        (_.T !== null ? a(!0) : (n.isTransition = !1),
          l(n),
          (a = t.pending),
          a === null
            ? ((n.next = t.pending = n), Kg(t, n))
            : ((n.next = a.next), (t.pending = a.next = n)));
      }
    }
    function Kg(e, t) {
      var a = t.action,
        l = t.payload,
        o = e.state;
      if (t.isTransition) {
        var n = _.T,
          u = {};
        _.T = u;
        try {
          var r = a(o, l),
            s = _.S;
          (s !== null && s(u, r), Yp(e, t, r));
        } catch (i) {
          uc(e, t, i);
        } finally {
          (n !== null && u.types !== null && (n.types = u.types), (_.T = n));
        }
      } else
        try {
          ((n = a(o, l)), Yp(e, t, n));
        } catch (i) {
          uc(e, t, i);
        }
    }
    function Yp(e, t, a) {
      a !== null && typeof a == 'object' && typeof a.then == 'function'
        ? a.then(
            function (l) {
              Kp(e, t, l);
            },
            function (l) {
              return uc(e, t, l);
            },
          )
        : Kp(e, t, a);
    }
    function Kp(e, t, a) {
      ((t.status = 'fulfilled'),
        (t.value = a),
        Zg(t),
        (e.state = a),
        (t = e.pending),
        t !== null &&
          ((a = t.next), a === t ? (e.pending = null) : ((a = a.next), (t.next = a), Kg(e, a))));
    }
    function uc(e, t, a) {
      var l = e.pending;
      if (((e.pending = null), l !== null)) {
        l = l.next;
        do ((t.status = 'rejected'), (t.reason = a), Zg(t), (t = t.next));
        while (t !== l);
      }
      e.action = null;
    }
    function Zg(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Qg(e, t) {
      return t;
    }
    function Zp(e, t) {
      if (te) {
        var a = me.formState;
        if (a !== null) {
          e: {
            var l = K;
            if (te) {
              if (ve) {
                t: {
                  for (var o = ve, n = Jt; o.nodeType !== 8;) {
                    if (!n) {
                      o = null;
                      break t;
                    }
                    if (((o = ea(o.nextSibling)), o === null)) {
                      o = null;
                      break t;
                    }
                  }
                  ((n = o.data), (o = n === 'F!' || n === 'F' ? o : null));
                }
                if (o) {
                  ((ve = ea(o.nextSibling)), (l = o.data === 'F!'));
                  break e;
                }
              }
              Bl(l);
            }
            l = !1;
          }
          l && (t = a[0]);
        }
      }
      return (
        (a = pt()),
        (a.memoizedState = a.baseState = t),
        (l = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Qg,
          lastRenderedState: t,
        }),
        (a.queue = l),
        (a = dx.bind(null, K, l)),
        (l.dispatch = a),
        (l = nc(!1)),
        (n = rd.bind(null, K, !1, l.queue)),
        (l = pt()),
        (o = { state: t, dispatch: null, action: e, pending: null }),
        (l.queue = o),
        (a = lI.bind(null, K, o, n, a)),
        (o.dispatch = a),
        (l.memoizedState = e),
        [t, a, !1]
      );
    }
    function Qp(e) {
      var t = Ee();
      return Wg(t, ce, e);
    }
    function Wg(e, t, a) {
      if (
        ((t = ad(e, t, Qg)[0]),
        (e = qr(Ja)[0]),
        typeof t == 'object' && t !== null && typeof t.then == 'function')
      )
        try {
          var l = Xu(t);
        } catch (u) {
          throw u === In ? Ds : u;
        }
      else l = t;
      t = Ee();
      var o = t.queue,
        n = o.dispatch;
      return (
        a !== t.memoizedState &&
          ((K.flags |= 2048), hn(9, { destroy: void 0 }, oI.bind(null, o, a), null)),
        [l, n, e]
      );
    }
    function oI(e, t) {
      e.action = t;
    }
    function Wp(e) {
      var t = Ee(),
        a = ce;
      if (a !== null) return Wg(t, a, e);
      (Ee(), (t = t.memoizedState), (a = Ee()));
      var l = a.queue.dispatch;
      return ((a.memoizedState = e), [t, l, !1]);
    }
    function hn(e, t, a, l) {
      return (
        (e = { tag: e, create: a, deps: l, inst: t, next: null }),
        (t = K.updateQueue),
        t === null && ((t = Es()), (K.updateQueue = t)),
        (a = t.lastEffect),
        a === null
          ? (t.lastEffect = e.next = e)
          : ((l = a.next), (a.next = e), (e.next = l), (t.lastEffect = e)),
        e
      );
    }
    function Jg() {
      return Ee().memoizedState;
    }
    function Fr(e, t, a, l) {
      var o = pt();
      ((K.flags |= e),
        (o.memoizedState = hn(1 | t, { destroy: void 0 }, a, l === void 0 ? null : l)));
    }
    function Bs(e, t, a, l) {
      var o = Ee();
      l = l === void 0 ? null : l;
      var n = o.memoizedState.inst;
      ce !== null && l !== null && Qc(l, ce.memoizedState.deps)
        ? (o.memoizedState = hn(t, n, a, l))
        : ((K.flags |= e), (o.memoizedState = hn(1 | t, n, a, l)));
    }
    function Jp(e, t) {
      Fr(8390656, 8, e, t);
    }
    function ld(e, t) {
      Bs(2048, 8, e, t);
    }
    function nI(e) {
      K.flags |= 4;
      var t = K.updateQueue;
      if (t === null) ((t = Es()), (K.updateQueue = t), (t.events = [e]));
      else {
        var a = t.events;
        a === null ? (t.events = [e]) : a.push(e);
      }
    }
    function $g(e) {
      var t = Ee().memoizedState;
      return (
        nI({ ref: t, nextImpl: e }),
        function () {
          if ((oe & 2) !== 0) throw Error(w(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function ex(e, t) {
      return Bs(4, 2, e, t);
    }
    function tx(e, t) {
      return Bs(4, 4, e, t);
    }
    function ax(e, t) {
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
    function lx(e, t, a) {
      ((a = a != null ? a.concat([e]) : null), Bs(4, 4, ax.bind(null, t, e), a));
    }
    function od() {}
    function ox(e, t) {
      var a = Ee();
      t = t === void 0 ? null : t;
      var l = a.memoizedState;
      return t !== null && Qc(t, l[1]) ? l[0] : ((a.memoizedState = [e, t]), e);
    }
    function nx(e, t) {
      var a = Ee();
      t = t === void 0 ? null : t;
      var l = a.memoizedState;
      if (t !== null && Qc(t, l[1])) return l[0];
      if (((l = e()), so)) {
        Sl(!0);
        try {
          e();
        } finally {
          Sl(!1);
        }
      }
      return ((a.memoizedState = [l, t]), l);
    }
    function nd(e, t, a) {
      return a === void 0 || ((Wa & 1073741824) !== 0 && (ee & 261930) === 0)
        ? (e.memoizedState = t)
        : ((e.memoizedState = a), (e = Yx()), (K.lanes |= e), (_l |= e), a);
    }
    function ux(e, t, a, l) {
      return Ht(a, t)
        ? a
        : pn.current !== null
          ? ((e = nd(e, a, l)), Ht(e, t) || (Ue = !0), e)
          : (Wa & 42) === 0 || ((Wa & 1073741824) !== 0 && (ee & 261930) === 0)
            ? ((Ue = !0), (e.memoizedState = a))
            : ((e = Yx()), (K.lanes |= e), (_l |= e), t);
    }
    function rx(e, t, a, l, o) {
      var n = ne.p;
      ne.p = n !== 0 && 8 > n ? n : 8;
      var u = _.T,
        r = {};
      ((_.T = r), rd(e, !1, t, a));
      try {
        var s = o(),
          i = _.S;
        if (
          (i !== null && i(r, s), s !== null && typeof s == 'object' && typeof s.then == 'function')
        ) {
          var h = eI(s, l);
          Lu(e, t, h, Ut(e));
        } else Lu(e, t, l, Ut(e));
      } catch (m) {
        Lu(e, t, { then: function () {}, status: 'rejected', reason: m }, Ut());
      } finally {
        ((ne.p = n), u !== null && r.types !== null && (u.types = r.types), (_.T = u));
      }
    }
    function uI() {}
    function rc(e, t, a, l) {
      if (e.tag !== 5) throw Error(w(476));
      var o = sx(e).queue;
      rx(
        e,
        o,
        t,
        eo,
        a === null
          ? uI
          : function () {
              return (ix(e), a(l));
            },
      );
    }
    function sx(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: eo,
        baseState: eo,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ja,
          lastRenderedState: eo,
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
            lastRenderedReducer: Ja,
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
    function ix(e) {
      var t = sx(e);
      (t.next === null && (t = e.alternate.memoizedState), Lu(e, t.next.queue, {}, Ut()));
    }
    function ud() {
      return at(Pu);
    }
    function fx() {
      return Ee().memoizedState;
    }
    function cx() {
      return Ee().memoizedState;
    }
    function rI(e) {
      for (var t = e.return; t !== null;) {
        switch (t.tag) {
          case 24:
          case 3:
            var a = Ut();
            e = Rl(a);
            var l = Al(t, e, a);
            (l !== null && (bt(l, t, a), hu(l, t, a)), (t = { cache: Xc() }), (e.payload = t));
            return;
        }
        t = t.return;
      }
    }
    function sI(e, t, a) {
      var l = Ut();
      ((a = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        Ps(e) ? mx(t, a) : ((a = qc(e, t, a, l)), a !== null && (bt(a, e, l), px(a, t, l))));
    }
    function dx(e, t, a) {
      var l = Ut();
      Lu(e, t, a, l);
    }
    function Lu(e, t, a, l) {
      var o = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (Ps(e)) mx(t, o);
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
            if (((o.hasEagerState = !0), (o.eagerState = r), Ht(r, u)))
              return (Ms(e, t, o, 0), me === null && ks(), !1);
          } catch {}
        if (((a = qc(e, t, o, l)), a !== null)) return (bt(a, e, l), px(a, t, l), !0);
      }
      return !1;
    }
    function rd(e, t, a, l) {
      if (
        ((l = {
          lane: 2,
          revertLane: gd(),
          gesture: null,
          action: l,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        Ps(e))
      ) {
        if (t) throw Error(w(479));
      } else ((t = qc(e, a, l, 2)), t !== null && bt(t, e, 2));
    }
    function Ps(e) {
      var t = e.alternate;
      return e === K || (t !== null && t === K);
    }
    function mx(e, t) {
      rn = ss = !0;
      var a = e.pending;
      (a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)), (e.pending = t));
    }
    function px(e, t, a) {
      if ((a & 4194048) !== 0) {
        var l = t.lanes;
        ((l &= e.pendingLanes), (a |= l), (t.lanes = a), $h(e, a));
      }
    }
    var Eu = {
      readContext: at,
      use: Os,
      useCallback: ke,
      useContext: ke,
      useEffect: ke,
      useImperativeHandle: ke,
      useLayoutEffect: ke,
      useInsertionEffect: ke,
      useMemo: ke,
      useReducer: ke,
      useRef: ke,
      useState: ke,
      useDebugValue: ke,
      useDeferredValue: ke,
      useTransition: ke,
      useSyncExternalStore: ke,
      useId: ke,
      useHostTransitionStatus: ke,
      useFormState: ke,
      useActionState: ke,
      useOptimistic: ke,
      useMemoCache: ke,
      useCacheRefresh: ke,
    };
    Eu.useEffectEvent = ke;
    var hx = {
        readContext: at,
        use: Os,
        useCallback: function (e, t) {
          return ((pt().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: at,
        useEffect: Jp,
        useImperativeHandle: function (e, t, a) {
          ((a = a != null ? a.concat([e]) : null), Fr(4194308, 4, ax.bind(null, t, e), a));
        },
        useLayoutEffect: function (e, t) {
          return Fr(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          Fr(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var a = pt();
          t = t === void 0 ? null : t;
          var l = e();
          if (so) {
            Sl(!0);
            try {
              e();
            } finally {
              Sl(!1);
            }
          }
          return ((a.memoizedState = [l, t]), l);
        },
        useReducer: function (e, t, a) {
          var l = pt();
          if (a !== void 0) {
            var o = a(t);
            if (so) {
              Sl(!0);
              try {
                a(t);
              } finally {
                Sl(!1);
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
            (e = e.dispatch = sI.bind(null, K, e)),
            [l.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = pt();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: function (e) {
          e = nc(e);
          var t = e.queue,
            a = dx.bind(null, K, t);
          return ((t.dispatch = a), [e.memoizedState, a]);
        },
        useDebugValue: od,
        useDeferredValue: function (e, t) {
          var a = pt();
          return nd(a, e, t);
        },
        useTransition: function () {
          var e = nc(!1);
          return ((e = rx.bind(null, K, e.queue, !0, !1)), (pt().memoizedState = e), [!1, e]);
        },
        useSyncExternalStore: function (e, t, a) {
          var l = K,
            o = pt();
          if (te) {
            if (a === void 0) throw Error(w(407));
            a = a();
          } else {
            if (((a = t()), me === null)) throw Error(w(349));
            (ee & 127) !== 0 || Fg(l, t, a);
          }
          o.memoizedState = a;
          var n = { value: a, getSnapshot: t };
          return (
            (o.queue = n),
            Jp(Vg.bind(null, l, n, e), [e]),
            (l.flags |= 2048),
            hn(9, { destroy: void 0 }, Gg.bind(null, l, n, a, t), null),
            a
          );
        },
        useId: function () {
          var e = pt(),
            t = me.identifierPrefix;
          if (te) {
            var a = wa,
              l = Ia;
            ((a = (l & ~(1 << (32 - _t(l) - 1))).toString(32) + a),
              (t = '_' + t + 'R_' + a),
              (a = is++),
              0 < a && (t += 'H' + a.toString(32)),
              (t += '_'));
          } else ((a = tI++), (t = '_' + t + 'r_' + a.toString(32) + '_'));
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: ud,
        useFormState: Zp,
        useActionState: Zp,
        useOptimistic: function (e) {
          var t = pt();
          t.memoizedState = t.baseState = e;
          var a = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return ((t.queue = a), (t = rd.bind(null, K, !0, a)), (a.dispatch = t), [e, t]);
        },
        useMemoCache: td,
        useCacheRefresh: function () {
          return (pt().memoizedState = rI.bind(null, K));
        },
        useEffectEvent: function (e) {
          var t = pt(),
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
      sd = {
        readContext: at,
        use: Os,
        useCallback: ox,
        useContext: at,
        useEffect: ld,
        useImperativeHandle: lx,
        useInsertionEffect: ex,
        useLayoutEffect: tx,
        useMemo: nx,
        useReducer: qr,
        useRef: Jg,
        useState: function () {
          return qr(Ja);
        },
        useDebugValue: od,
        useDeferredValue: function (e, t) {
          var a = Ee();
          return ux(a, ce.memoizedState, e, t);
        },
        useTransition: function () {
          var e = qr(Ja)[0],
            t = Ee().memoizedState;
          return [typeof e == 'boolean' ? e : Xu(e), t];
        },
        useSyncExternalStore: qg,
        useId: fx,
        useHostTransitionStatus: ud,
        useFormState: Qp,
        useActionState: Qp,
        useOptimistic: function (e, t) {
          var a = Ee();
          return Yg(a, ce, e, t);
        },
        useMemoCache: td,
        useCacheRefresh: cx,
      };
    sd.useEffectEvent = $g;
    var gx = {
      readContext: at,
      use: Os,
      useCallback: ox,
      useContext: at,
      useEffect: ld,
      useImperativeHandle: lx,
      useInsertionEffect: ex,
      useLayoutEffect: tx,
      useMemo: nx,
      useReducer: hf,
      useRef: Jg,
      useState: function () {
        return hf(Ja);
      },
      useDebugValue: od,
      useDeferredValue: function (e, t) {
        var a = Ee();
        return ce === null ? nd(a, e, t) : ux(a, ce.memoizedState, e, t);
      },
      useTransition: function () {
        var e = hf(Ja)[0],
          t = Ee().memoizedState;
        return [typeof e == 'boolean' ? e : Xu(e), t];
      },
      useSyncExternalStore: qg,
      useId: fx,
      useHostTransitionStatus: ud,
      useFormState: Wp,
      useActionState: Wp,
      useOptimistic: function (e, t) {
        var a = Ee();
        return ce !== null ? Yg(a, ce, e, t) : ((a.baseState = e), [e, a.queue.dispatch]);
      },
      useMemoCache: td,
      useCacheRefresh: cx,
    };
    gx.useEffectEvent = $g;
    function gf(e, t, a, l) {
      ((t = e.memoizedState),
        (a = a(l, t)),
        (a = a == null ? t : ye({}, t, a)),
        (e.memoizedState = a),
        e.lanes === 0 && (e.updateQueue.baseState = a));
    }
    var sc = {
      enqueueSetState: function (e, t, a) {
        e = e._reactInternals;
        var l = Ut(),
          o = Rl(l);
        ((o.payload = t),
          a != null && (o.callback = a),
          (t = Al(e, o, l)),
          t !== null && (bt(t, e, l), hu(t, e, l)));
      },
      enqueueReplaceState: function (e, t, a) {
        e = e._reactInternals;
        var l = Ut(),
          o = Rl(l);
        ((o.tag = 1),
          (o.payload = t),
          a != null && (o.callback = a),
          (t = Al(e, o, l)),
          t !== null && (bt(t, e, l), hu(t, e, l)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var a = Ut(),
          l = Rl(a);
        ((l.tag = 2),
          t != null && (l.callback = t),
          (t = Al(e, l, a)),
          t !== null && (bt(t, e, a), hu(t, e, a)));
      },
    };
    function $p(e, t, a, l, o, n, u) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == 'function'
          ? e.shouldComponentUpdate(l, n, u)
          : t.prototype && t.prototype.isPureReactComponent
            ? !Au(a, l) || !Au(o, n)
            : !0
      );
    }
    function eh(e, t, a, l) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(a, l),
        typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
          t.UNSAFE_componentWillReceiveProps(a, l),
        t.state !== e && sc.enqueueReplaceState(t, t.state, null));
    }
    function io(e, t) {
      var a = t;
      if ('ref' in t) {
        a = {};
        for (var l in t) l !== 'ref' && (a[l] = t[l]);
      }
      if ((e = e.defaultProps)) {
        a === t && (a = ye({}, a));
        for (var o in e) a[o] === void 0 && (a[o] = e[o]);
      }
      return a;
    }
    function xx(e) {
      ts(e);
    }
    function Lx(e) {
      console.error(e);
    }
    function Sx(e) {
      ts(e);
    }
    function fs(e, t) {
      try {
        var a = e.onUncaughtError;
        a(t.value, { componentStack: t.stack });
      } catch (l) {
        setTimeout(function () {
          throw l;
        });
      }
    }
    function th(e, t, a) {
      try {
        var l = e.onCaughtError;
        l(a.value, { componentStack: a.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
      } catch (o) {
        setTimeout(function () {
          throw o;
        });
      }
    }
    function ic(e, t, a) {
      return (
        (a = Rl(a)),
        (a.tag = 3),
        (a.payload = { element: null }),
        (a.callback = function () {
          fs(e, t);
        }),
        a
      );
    }
    function vx(e) {
      return ((e = Rl(e)), (e.tag = 3), e);
    }
    function yx(e, t, a, l) {
      var o = a.type.getDerivedStateFromError;
      if (typeof o == 'function') {
        var n = l.value;
        ((e.payload = function () {
          return o(n);
        }),
          (e.callback = function () {
            th(t, a, l);
          }));
      }
      var u = a.stateNode;
      u !== null &&
        typeof u.componentDidCatch == 'function' &&
        (e.callback = function () {
          (th(t, a, l),
            typeof o != 'function' && (Tl === null ? (Tl = new Set([this])) : Tl.add(this)));
          var r = l.stack;
          this.componentDidCatch(l.value, { componentStack: r !== null ? r : '' });
        });
    }
    function iI(e, t, a, l, o) {
      if (((a.flags |= 32768), l !== null && typeof l == 'object' && typeof l.then == 'function')) {
        if (((t = a.alternate), t !== null && bn(t, a, o, !0), (a = zt.current), a !== null)) {
          switch (a.tag) {
            case 31:
            case 13:
              return (
                $t === null ? hs() : a.alternate === null && Me === 0 && (Me = 3),
                (a.flags &= -257),
                (a.flags |= 65536),
                (a.lanes = o),
                l === ns
                  ? (a.flags |= 16384)
                  : ((t = a.updateQueue),
                    t === null ? (a.updateQueue = new Set([l])) : t.add(l),
                    Af(e, l, o)),
                !1
              );
            case 22:
              return (
                (a.flags |= 65536),
                l === ns
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
                    Af(e, l, o)),
                !1
              );
          }
          throw Error(w(435, a.tag));
        }
        return (Af(e, l, o), hs(), !1);
      }
      if (te)
        return (
          (t = zt.current),
          t !== null
            ? ((t.flags & 65536) === 0 && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = o),
              l !== Qf && ((e = Error(w(422), { cause: l })), ku(Wt(e, a))))
            : (l !== Qf && ((t = Error(w(423), { cause: l })), ku(Wt(t, a))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (o &= -o),
              (e.lanes |= o),
              (l = Wt(l, a)),
              (o = ic(e.stateNode, l, o)),
              pf(e, o),
              Me !== 4 && (Me = 2)),
          !1
        );
      var n = Error(w(520), { cause: l });
      if (((n = Wt(n, a)), yu === null ? (yu = [n]) : yu.push(n), Me !== 4 && (Me = 2), t === null))
        return !0;
      ((l = Wt(l, a)), (a = t));
      do {
        switch (a.tag) {
          case 3:
            return (
              (a.flags |= 65536),
              (e = o & -o),
              (a.lanes |= e),
              (e = ic(a.stateNode, l, e)),
              pf(a, e),
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
                    (Tl === null || !Tl.has(n)))))
            )
              return (
                (a.flags |= 65536),
                (o &= -o),
                (a.lanes |= o),
                (o = vx(o)),
                yx(o, e, a, l),
                pf(a, o),
                !1
              );
        }
        a = a.return;
      } while (a !== null);
      return !1;
    }
    var id = Error(w(461)),
      Ue = !1;
    function $e(e, t, a, l) {
      t.child = e === null ? Pg(t, null, a, l) : ro(t, e.child, a, l);
    }
    function ah(e, t, a, l, o) {
      a = a.render;
      var n = t.ref;
      if ('ref' in l) {
        var u = {};
        for (var r in l) r !== 'ref' && (u[r] = l[r]);
      } else u = l;
      return (
        uo(t),
        (l = Wc(e, t, a, u, n, o)),
        (r = Jc()),
        e !== null && !Ue
          ? ($c(e, t, o), $a(e, t, o))
          : (te && r && Gc(t), (t.flags |= 1), $e(e, t, l, o), t.child)
      );
    }
    function lh(e, t, a, l, o) {
      if (e === null) {
        var n = a.type;
        return typeof n == 'function' && !Fc(n) && n.defaultProps === void 0 && a.compare === null
          ? ((t.tag = 15), (t.type = n), Cx(e, t, n, l, o))
          : ((e = zr(a.type, null, l, t, t.mode, o)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((n = e.child), !fd(e, o))) {
        var u = n.memoizedProps;
        if (((a = a.compare), (a = a !== null ? a : Au), a(u, l) && e.ref === t.ref))
          return $a(e, t, o);
      }
      return ((t.flags |= 1), (e = Ya(n, l)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    function Cx(e, t, a, l, o) {
      if (e !== null) {
        var n = e.memoizedProps;
        if (Au(n, l) && e.ref === t.ref)
          if (((Ue = !1), (t.pendingProps = l = n), fd(e, o)))
            (e.flags & 131072) !== 0 && (Ue = !0);
          else return ((t.lanes = e.lanes), $a(e, t, o));
      }
      return fc(e, t, a, l, o);
    }
    function bx(e, t, a, l) {
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
          return oh(e, t, n, a, l);
        }
        if ((a & 536870912) !== 0)
          ((t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && Nr(t, n !== null ? n.cachePool : null),
            n !== null ? jp(t, n) : lc(),
            Hg(t));
        else return ((l = t.lanes = 536870912), oh(e, t, n !== null ? n.baseLanes | a : a, a, l));
      } else
        n !== null
          ? (Nr(t, n.cachePool), jp(t, n), xl(t), (t.memoizedState = null))
          : (e !== null && Nr(t, null), lc(), xl(t));
      return ($e(e, t, o, a), t.child);
    }
    function iu(e, t) {
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
    function oh(e, t, a, l, o) {
      var n = jc();
      return (
        (n = n === null ? null : { parent: _e._currentValue, pool: n }),
        (t.memoizedState = { baseLanes: a, cachePool: n }),
        e !== null && Nr(t, null),
        lc(),
        Hg(t),
        e !== null && bn(e, t, l, !0),
        (t.childLanes = o),
        null
      );
    }
    function Gr(e, t) {
      return (
        (t = cs({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function nh(e, t, a) {
      return (
        ro(t, e.child, null, a),
        (e = Gr(t, t.pendingProps)),
        (e.flags |= 2),
        Dt(t),
        (t.memoizedState = null),
        e
      );
    }
    function fI(e, t, a) {
      var l = t.pendingProps,
        o = (t.flags & 128) !== 0;
      if (((t.flags &= -129), e === null)) {
        if (te) {
          if (l.mode === 'hidden') return ((e = Gr(t, l)), (t.lanes = 536870912), iu(null, e));
          if (
            (oc(t),
            (e = ve)
              ? ((e = hL(e, Jt)),
                (e = e !== null && e.data === '&' ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Ol !== null ? { id: Ia, overflow: wa } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (a = Tg(e)),
                  (a.return = t),
                  (t.child = a),
                  (tt = t),
                  (ve = null)))
              : (e = null),
            e === null)
          )
            throw Bl(t);
          return ((t.lanes = 536870912), null);
        }
        return Gr(t, l);
      }
      var n = e.memoizedState;
      if (n !== null) {
        var u = n.dehydrated;
        if ((oc(t), o))
          if (t.flags & 256) ((t.flags &= -257), (t = nh(e, t, a)));
          else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
          else throw Error(w(558));
        else if ((Ue || bn(e, t, a, !1), (o = (a & e.childLanes) !== 0), Ue || o)) {
          if (((l = me), l !== null && ((u = eg(l, a)), u !== 0 && u !== n.retryLane)))
            throw ((n.retryLane = u), po(e, u), bt(l, e, u), id);
          (hs(), (t = nh(e, t, a)));
        } else
          ((e = n.treeContext),
            (ve = ea(u.nextSibling)),
            (tt = t),
            (te = !0),
            (wl = null),
            (Jt = !1),
            e !== null && Mg(t, e),
            (t = Gr(t, l)),
            (t.flags |= 4096));
        return t;
      }
      return (
        (e = Ya(e.child, { mode: l.mode, children: l.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function Vr(e, t) {
      var a = t.ref;
      if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof a != 'function' && typeof a != 'object') throw Error(w(284));
        (e === null || e.ref !== a) && (t.flags |= 4194816);
      }
    }
    function fc(e, t, a, l, o) {
      return (
        uo(t),
        (a = Wc(e, t, a, l, void 0, o)),
        (l = Jc()),
        e !== null && !Ue
          ? ($c(e, t, o), $a(e, t, o))
          : (te && l && Gc(t), (t.flags |= 1), $e(e, t, a, o), t.child)
      );
    }
    function uh(e, t, a, l, o, n) {
      return (
        uo(t),
        (t.updateQueue = null),
        (a = Ng(t, l, a, o)),
        zg(e),
        (l = Jc()),
        e !== null && !Ue
          ? ($c(e, t, n), $a(e, t, n))
          : (te && l && Gc(t), (t.flags |= 1), $e(e, t, a, n), t.child)
      );
    }
    function rh(e, t, a, l, o) {
      if ((uo(t), t.stateNode === null)) {
        var n = Jo,
          u = a.contextType;
        (typeof u == 'object' && u !== null && (n = at(u)),
          (n = new a(l, n)),
          (t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null),
          (n.updater = sc),
          (t.stateNode = n),
          (n._reactInternals = t),
          (n = t.stateNode),
          (n.props = l),
          (n.state = t.memoizedState),
          (n.refs = {}),
          Kc(t),
          (u = a.contextType),
          (n.context = typeof u == 'object' && u !== null ? at(u) : Jo),
          (n.state = t.memoizedState),
          (u = a.getDerivedStateFromProps),
          typeof u == 'function' && (gf(t, a, u, l), (n.state = t.memoizedState)),
          typeof a.getDerivedStateFromProps == 'function' ||
            typeof n.getSnapshotBeforeUpdate == 'function' ||
            (typeof n.UNSAFE_componentWillMount != 'function' &&
              typeof n.componentWillMount != 'function') ||
            ((u = n.state),
            typeof n.componentWillMount == 'function' && n.componentWillMount(),
            typeof n.UNSAFE_componentWillMount == 'function' && n.UNSAFE_componentWillMount(),
            u !== n.state && sc.enqueueReplaceState(n, n.state, null),
            xu(t, l, n, o),
            gu(),
            (n.state = t.memoizedState)),
          typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
          (l = !0));
      } else if (e === null) {
        n = t.stateNode;
        var r = t.memoizedProps,
          s = io(a, r);
        n.props = s;
        var i = n.context,
          h = a.contextType;
        ((u = Jo), typeof h == 'object' && h !== null && (u = at(h)));
        var m = a.getDerivedStateFromProps;
        ((h = typeof m == 'function' || typeof n.getSnapshotBeforeUpdate == 'function'),
          (r = t.pendingProps !== r),
          h ||
            (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
              typeof n.componentWillReceiveProps != 'function') ||
            ((r || i !== u) && eh(t, n, l, u)),
          (pl = !1));
        var f = t.memoizedState;
        ((n.state = f),
          xu(t, l, n, o),
          gu(),
          (i = t.memoizedState),
          r || f !== i || pl
            ? (typeof m == 'function' && (gf(t, a, m, l), (i = t.memoizedState)),
              (s = pl || $p(t, a, s, l, f, i, u))
                ? (h ||
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
          tc(e, t),
          (u = t.memoizedProps),
          (h = io(a, u)),
          (n.props = h),
          (m = t.pendingProps),
          (f = n.context),
          (i = a.contextType),
          (s = Jo),
          typeof i == 'object' && i !== null && (s = at(i)),
          (r = a.getDerivedStateFromProps),
          (i = typeof r == 'function' || typeof n.getSnapshotBeforeUpdate == 'function') ||
            (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
              typeof n.componentWillReceiveProps != 'function') ||
            ((u !== m || f !== s) && eh(t, n, l, s)),
          (pl = !1),
          (f = t.memoizedState),
          (n.state = f),
          xu(t, l, n, o),
          gu());
        var p = t.memoizedState;
        u !== m || f !== p || pl || (e !== null && e.dependencies !== null && os(e.dependencies))
          ? (typeof r == 'function' && (gf(t, a, r, l), (p = t.memoizedState)),
            (h =
              pl ||
              $p(t, a, h, l, f, p, s) ||
              (e !== null && e.dependencies !== null && os(e.dependencies)))
              ? (i ||
                  (typeof n.UNSAFE_componentWillUpdate != 'function' &&
                    typeof n.componentWillUpdate != 'function') ||
                  (typeof n.componentWillUpdate == 'function' && n.componentWillUpdate(l, p, s),
                  typeof n.UNSAFE_componentWillUpdate == 'function' &&
                    n.UNSAFE_componentWillUpdate(l, p, s)),
                typeof n.componentDidUpdate == 'function' && (t.flags |= 4),
                typeof n.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
              : (typeof n.componentDidUpdate != 'function' ||
                  (u === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof n.getSnapshotBeforeUpdate != 'function' ||
                  (u === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = l),
                (t.memoizedState = p)),
            (n.props = l),
            (n.state = p),
            (n.context = s),
            (l = h))
          : (typeof n.componentDidUpdate != 'function' ||
              (u === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof n.getSnapshotBeforeUpdate != 'function' ||
              (u === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (l = !1));
      }
      return (
        (n = l),
        Vr(e, t),
        (l = (t.flags & 128) !== 0),
        n || l
          ? ((n = t.stateNode),
            (a = l && typeof a.getDerivedStateFromError != 'function' ? null : n.render()),
            (t.flags |= 1),
            e !== null && l
              ? ((t.child = ro(t, e.child, null, o)), (t.child = ro(t, null, a, o)))
              : $e(e, t, a, o),
            (t.memoizedState = n.state),
            (e = t.child))
          : (e = $a(e, t, o)),
        e
      );
    }
    function sh(e, t, a, l) {
      return (no(), (t.flags |= 256), $e(e, t, a, l), t.child);
    }
    var xf = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function Lf(e) {
      return { baseLanes: e, cachePool: Eg() };
    }
    function Sf(e, t, a) {
      return ((e = e !== null ? e.childLanes & ~a : 0), t && (e |= Ot), e);
    }
    function Ix(e, t, a) {
      var l = t.pendingProps,
        o = !1,
        n = (t.flags & 128) !== 0,
        u;
      if (
        ((u = n) || (u = e !== null && e.memoizedState === null ? !1 : (De.current & 2) !== 0),
        u && ((o = !0), (t.flags &= -129)),
        (u = (t.flags & 32) !== 0),
        (t.flags &= -33),
        e === null)
      ) {
        if (te) {
          if (
            (o ? gl(t) : xl(t),
            (e = ve)
              ? ((e = hL(e, Jt)),
                (e = e !== null && e.data !== '&' ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Ol !== null ? { id: Ia, overflow: wa } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (a = Tg(e)),
                  (a.return = t),
                  (t.child = a),
                  (tt = t),
                  (ve = null)))
              : (e = null),
            e === null)
          )
            throw Bl(t);
          return (Ic(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
        }
        var r = l.children;
        return (
          (l = l.fallback),
          o
            ? (xl(t),
              (o = t.mode),
              (r = cs({ mode: 'hidden', children: r }, o)),
              (l = to(l, o, a, null)),
              (r.return = t),
              (l.return = t),
              (r.sibling = l),
              (t.child = r),
              (l = t.child),
              (l.memoizedState = Lf(a)),
              (l.childLanes = Sf(e, u, a)),
              (t.memoizedState = xf),
              iu(null, l))
            : (gl(t), cc(t, r))
        );
      }
      var s = e.memoizedState;
      if (s !== null && ((r = s.dehydrated), r !== null)) {
        if (n)
          t.flags & 256
            ? (gl(t), (t.flags &= -257), (t = vf(e, t, a)))
            : t.memoizedState !== null
              ? (xl(t), (t.child = e.child), (t.flags |= 128), (t = null))
              : (xl(t),
                (r = l.fallback),
                (o = t.mode),
                (l = cs({ mode: 'visible', children: l.children }, o)),
                (r = to(r, o, a, null)),
                (r.flags |= 2),
                (l.return = t),
                (r.return = t),
                (l.sibling = r),
                (t.child = l),
                ro(t, e.child, null, a),
                (l = t.child),
                (l.memoizedState = Lf(a)),
                (l.childLanes = Sf(e, u, a)),
                (t.memoizedState = xf),
                (t = iu(null, l)));
        else if ((gl(t), Ic(r))) {
          if (((u = r.nextSibling && r.nextSibling.dataset), u)) var i = u.dgst;
          ((u = i),
            (l = Error(w(419))),
            (l.stack = ''),
            (l.digest = u),
            ku({ value: l, source: null, stack: null }),
            (t = vf(e, t, a)));
        } else if ((Ue || bn(e, t, a, !1), (u = (a & e.childLanes) !== 0), Ue || u)) {
          if (((u = me), u !== null && ((l = eg(u, a)), l !== 0 && l !== s.retryLane)))
            throw ((s.retryLane = l), po(e, l), bt(u, e, l), id);
          (bc(r) || hs(), (t = vf(e, t, a)));
        } else
          bc(r)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = s.treeContext),
              (ve = ea(r.nextSibling)),
              (tt = t),
              (te = !0),
              (wl = null),
              (Jt = !1),
              e !== null && Mg(t, e),
              (t = cc(t, l.children)),
              (t.flags |= 4096));
        return t;
      }
      return o
        ? (xl(t),
          (r = l.fallback),
          (o = t.mode),
          (s = e.child),
          (i = s.sibling),
          (l = Ya(s, { mode: 'hidden', children: l.children })),
          (l.subtreeFlags = s.subtreeFlags & 65011712),
          i !== null ? (r = Ya(i, r)) : ((r = to(r, o, a, null)), (r.flags |= 2)),
          (r.return = t),
          (l.return = t),
          (l.sibling = r),
          (t.child = l),
          iu(null, l),
          (l = t.child),
          (r = e.child.memoizedState),
          r === null
            ? (r = Lf(a))
            : ((o = r.cachePool),
              o !== null
                ? ((s = _e._currentValue), (o = o.parent !== s ? { parent: s, pool: s } : o))
                : (o = Eg()),
              (r = { baseLanes: r.baseLanes | a, cachePool: o })),
          (l.memoizedState = r),
          (l.childLanes = Sf(e, u, a)),
          (t.memoizedState = xf),
          iu(e.child, l))
        : (gl(t),
          (a = e.child),
          (e = a.sibling),
          (a = Ya(a, { mode: 'visible', children: l.children })),
          (a.return = t),
          (a.sibling = null),
          e !== null &&
            ((u = t.deletions), u === null ? ((t.deletions = [e]), (t.flags |= 16)) : u.push(e)),
          (t.child = a),
          (t.memoizedState = null),
          a);
    }
    function cc(e, t) {
      return ((t = cs({ mode: 'visible', children: t }, e.mode)), (t.return = e), (e.child = t));
    }
    function cs(e, t) {
      return ((e = Et(22, e, null, t)), (e.lanes = 0), e);
    }
    function vf(e, t, a) {
      return (
        ro(t, e.child, null, a),
        (e = cc(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function ih(e, t, a) {
      e.lanes |= t;
      var l = e.alternate;
      (l !== null && (l.lanes |= t), Jf(e.return, t, a));
    }
    function yf(e, t, a, l, o, n) {
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
    function wx(e, t, a) {
      var l = t.pendingProps,
        o = l.revealOrder,
        n = l.tail;
      l = l.children;
      var u = De.current,
        r = (u & 2) !== 0;
      if (
        (r ? ((u = (u & 1) | 2), (t.flags |= 128)) : (u &= 1),
        he(De, u),
        $e(e, t, l, a),
        (l = te ? Tu : 0),
        !r && e !== null && (e.flags & 128) !== 0)
      )
        e: for (e = t.child; e !== null;) {
          if (e.tag === 13) e.memoizedState !== null && ih(e, a, t);
          else if (e.tag === 19) ih(e, a, t);
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
            ((e = a.alternate), e !== null && rs(e) === null && (o = a), (a = a.sibling));
          ((a = o),
            a === null ? ((o = t.child), (t.child = null)) : ((o = a.sibling), (a.sibling = null)),
            yf(t, !1, o, a, n, l));
          break;
        case 'backwards':
        case 'unstable_legacy-backwards':
          for (a = null, o = t.child, t.child = null; o !== null;) {
            if (((e = o.alternate), e !== null && rs(e) === null)) {
              t.child = o;
              break;
            }
            ((e = o.sibling), (o.sibling = a), (a = o), (o = e));
          }
          yf(t, !0, a, null, n, l);
          break;
        case 'together':
          yf(t, !1, null, null, void 0, l);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function $a(e, t, a) {
      if (
        (e !== null && (t.dependencies = e.dependencies), (_l |= t.lanes), (a & t.childLanes) === 0)
      )
        if (e !== null) {
          if ((bn(e, t, a, !1), (a & t.childLanes) === 0)) return null;
        } else return null;
      if (e !== null && t.child !== e.child) throw Error(w(153));
      if (t.child !== null) {
        for (e = t.child, a = Ya(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null;)
          ((e = e.sibling), (a = a.sibling = Ya(e, e.pendingProps)), (a.return = t));
        a.sibling = null;
      }
      return t.child;
    }
    function fd(e, t) {
      return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && os(e)));
    }
    function cI(e, t, a) {
      switch (t.tag) {
        case 3:
          (Wr(t, t.stateNode.containerInfo), hl(t, _e, e.memoizedState.cache), no());
          break;
        case 27:
        case 5:
          zf(t);
          break;
        case 4:
          Wr(t, t.stateNode.containerInfo);
          break;
        case 10:
          hl(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return ((t.flags |= 128), oc(t), null);
          break;
        case 13:
          var l = t.memoizedState;
          if (l !== null)
            return l.dehydrated !== null
              ? (gl(t), (t.flags |= 128), null)
              : (a & t.child.childLanes) !== 0
                ? Ix(e, t, a)
                : (gl(t), (e = $a(e, t, a)), e !== null ? e.sibling : null);
          gl(t);
          break;
        case 19:
          var o = (e.flags & 128) !== 0;
          if (
            ((l = (a & t.childLanes) !== 0),
            l || (bn(e, t, a, !1), (l = (a & t.childLanes) !== 0)),
            o)
          ) {
            if (l) return wx(e, t, a);
            t.flags |= 128;
          }
          if (
            ((o = t.memoizedState),
            o !== null && ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
            he(De, De.current),
            l)
          )
            break;
          return null;
        case 22:
          return ((t.lanes = 0), bx(e, t, a, t.pendingProps));
        case 24:
          hl(t, _e, e.memoizedState.cache);
      }
      return $a(e, t, a);
    }
    function Rx(e, t, a) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps) Ue = !0;
        else {
          if (!fd(e, a) && (t.flags & 128) === 0) return ((Ue = !1), cI(e, t, a));
          Ue = (e.flags & 131072) !== 0;
        }
      else ((Ue = !1), te && (t.flags & 1048576) !== 0 && kg(t, Tu, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          e: {
            var l = t.pendingProps;
            if (((e = Jl(t.elementType)), (t.type = e), typeof e == 'function'))
              Fc(e)
                ? ((l = io(e, l)), (t.tag = 1), (t = rh(null, t, e, l, a)))
                : ((t.tag = 0), (t = fc(null, t, e, l, a)));
            else {
              if (e != null) {
                var o = e.$$typeof;
                if (o === Tc) {
                  ((t.tag = 11), (t = ah(null, t, e, l, a)));
                  break e;
                } else if (o === kc) {
                  ((t.tag = 14), (t = lh(null, t, e, l, a)));
                  break e;
                }
              }
              throw ((t = Uf(e) || e), Error(w(306, t, '')));
            }
          }
          return t;
        case 0:
          return fc(e, t, t.type, t.pendingProps, a);
        case 1:
          return ((l = t.type), (o = io(l, t.pendingProps)), rh(e, t, l, o, a));
        case 3:
          e: {
            if ((Wr(t, t.stateNode.containerInfo), e === null)) throw Error(w(387));
            l = t.pendingProps;
            var n = t.memoizedState;
            ((o = n.element), tc(e, t), xu(t, l, null, a));
            var u = t.memoizedState;
            if (
              ((l = u.cache),
              hl(t, _e, l),
              l !== n.cache && $f(t, [_e], a, !0),
              gu(),
              (l = u.element),
              n.isDehydrated)
            )
              if (
                ((n = { element: l, isDehydrated: !1, cache: u.cache }),
                (t.updateQueue.baseState = n),
                (t.memoizedState = n),
                t.flags & 256)
              ) {
                t = sh(e, t, l, a);
                break e;
              } else if (l !== o) {
                ((o = Wt(Error(w(424)), t)), ku(o), (t = sh(e, t, l, a)));
                break e;
              } else
                for (
                  e = t.stateNode.containerInfo,
                    e.nodeType === 9
                      ? (e = e.body)
                      : (e = e.nodeName === 'HTML' ? e.ownerDocument.body : e),
                    ve = ea(e.firstChild),
                    tt = t,
                    te = !0,
                    wl = null,
                    Jt = !0,
                    a = Pg(t, null, l, a),
                    t.child = a;
                  a;
                )
                  ((a.flags = (a.flags & -3) | 4096), (a = a.sibling));
            else {
              if ((no(), l === o)) {
                t = $a(e, t, a);
                break e;
              }
              $e(e, t, l, a);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            Vr(e, t),
            e === null
              ? (a = Dh(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = a)
                : te ||
                  ((a = t.type),
                  (e = t.pendingProps),
                  (l = Ss(Il.current).createElement(a)),
                  (l[et] = t),
                  (l[It] = e),
                  lt(l, a, e),
                  Ke(l),
                  (t.stateNode = l))
              : (t.memoizedState = Dh(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
            null
          );
        case 27:
          return (
            zf(t),
            e === null &&
              te &&
              ((l = t.stateNode = gL(t.type, t.pendingProps, Il.current)),
              (tt = t),
              (Jt = !0),
              (o = ve),
              Hl(t.type) ? ((wc = o), (ve = ea(l.firstChild))) : (ve = o)),
            $e(e, t, t.pendingProps.children, a),
            Vr(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              te &&
              ((o = l = ve) &&
                ((l = zI(l, t.type, t.pendingProps, Jt)),
                l !== null
                  ? ((t.stateNode = l), (tt = t), (ve = ea(l.firstChild)), (Jt = !1), (o = !0))
                  : (o = !1)),
              o || Bl(t)),
            zf(t),
            (o = t.type),
            (n = t.pendingProps),
            (u = e !== null ? e.memoizedProps : null),
            (l = n.children),
            yc(o, n) ? (l = null) : u !== null && yc(o, u) && (t.flags |= 32),
            t.memoizedState !== null && ((o = Wc(e, t, aI, null, null, a)), (Pu._currentValue = o)),
            Vr(e, t),
            $e(e, t, l, a),
            t.child
          );
        case 6:
          return (
            e === null &&
              te &&
              ((e = a = ve) &&
                ((a = NI(a, t.pendingProps, Jt)),
                a !== null ? ((t.stateNode = a), (tt = t), (ve = null), (e = !0)) : (e = !1)),
              e || Bl(t)),
            null
          );
        case 13:
          return Ix(e, t, a);
        case 4:
          return (
            Wr(t, t.stateNode.containerInfo),
            (l = t.pendingProps),
            e === null ? (t.child = ro(t, null, l, a)) : $e(e, t, l, a),
            t.child
          );
        case 11:
          return ah(e, t, t.type, t.pendingProps, a);
        case 7:
          return ($e(e, t, t.pendingProps, a), t.child);
        case 8:
          return ($e(e, t, t.pendingProps.children, a), t.child);
        case 12:
          return ($e(e, t, t.pendingProps.children, a), t.child);
        case 10:
          return ((l = t.pendingProps), hl(t, t.type, l.value), $e(e, t, l.children, a), t.child);
        case 9:
          return (
            (o = t.type._context),
            (l = t.pendingProps.children),
            uo(t),
            (o = at(o)),
            (l = l(o)),
            (t.flags |= 1),
            $e(e, t, l, a),
            t.child
          );
        case 14:
          return lh(e, t, t.type, t.pendingProps, a);
        case 15:
          return Cx(e, t, t.type, t.pendingProps, a);
        case 19:
          return wx(e, t, a);
        case 31:
          return fI(e, t, a);
        case 22:
          return bx(e, t, a, t.pendingProps);
        case 24:
          return (
            uo(t),
            (l = at(_e)),
            e === null
              ? ((o = jc()),
                o === null &&
                  ((o = me),
                  (n = Xc()),
                  (o.pooledCache = n),
                  n.refCount++,
                  n !== null && (o.pooledCacheLanes |= a),
                  (o = n)),
                (t.memoizedState = { parent: l, cache: o }),
                Kc(t),
                hl(t, _e, o))
              : ((e.lanes & a) !== 0 && (tc(e, t), xu(t, null, null, a), gu()),
                (o = e.memoizedState),
                (n = t.memoizedState),
                o.parent !== l
                  ? ((o = { parent: l, cache: l }),
                    (t.memoizedState = o),
                    t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = o),
                    hl(t, _e, l))
                  : ((l = n.cache), hl(t, _e, l), l !== o.cache && $f(t, [_e], a, !0))),
            $e(e, t, t.pendingProps.children, a),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(w(156, t.tag));
    }
    function Ha(e) {
      e.flags |= 4;
    }
    function Cf(e, t, a, l, o) {
      if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
        if (((e.flags |= 16777216), (o & 335544128) === o))
          if (e.stateNode.complete) e.flags |= 8192;
          else if (Qx()) e.flags |= 8192;
          else throw ((lo = ns), Yc);
      } else e.flags &= -16777217;
    }
    function fh(e, t) {
      if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !SL(t)))
        if (Qx()) e.flags |= 8192;
        else throw ((lo = ns), Yc);
    }
    function Tr(e, t) {
      (t !== null && (e.flags |= 4),
        e.flags & 16384 && ((t = e.tag !== 22 ? Wh() : 536870912), (e.lanes |= t), (gn |= t)));
    }
    function au(e, t) {
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
    function Se(e) {
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
    function dI(e, t, a) {
      var l = t.pendingProps;
      switch ((Vc(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (Se(t), null);
        case 1:
          return (Se(t), null);
        case 3:
          return (
            (a = t.stateNode),
            (l = null),
            e !== null && (l = e.memoizedState.cache),
            t.memoizedState.cache !== l && (t.flags |= 2048),
            Ka(_e),
            fn(),
            a.pendingContext && ((a.context = a.pendingContext), (a.pendingContext = null)),
            (e === null || e.child === null) &&
              (No(t)
                ? Ha(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                  ((t.flags |= 1024), mf())),
            Se(t),
            null
          );
        case 26:
          var o = t.type,
            n = t.memoizedState;
          return (
            e === null
              ? (Ha(t), n !== null ? (Se(t), fh(t, n)) : (Se(t), Cf(t, o, null, l, a)))
              : n
                ? n !== e.memoizedState
                  ? (Ha(t), Se(t), fh(t, n))
                  : (Se(t), (t.flags &= -16777217))
                : ((e = e.memoizedProps), e !== l && Ha(t), Se(t), Cf(t, o, e, l, a)),
            null
          );
        case 27:
          if ((Jr(t), (a = Il.current), (o = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== l && Ha(t);
          else {
            if (!l) {
              if (t.stateNode === null) throw Error(w(166));
              return (Se(t), null);
            }
            ((e = Aa.current), No(t) ? zp(t, e) : ((e = gL(o, l, a)), (t.stateNode = e), Ha(t)));
          }
          return (Se(t), null);
        case 5:
          if ((Jr(t), (o = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== l && Ha(t);
          else {
            if (!l) {
              if (t.stateNode === null) throw Error(w(166));
              return (Se(t), null);
            }
            if (((n = Aa.current), No(t))) zp(t, n);
            else {
              var u = Ss(Il.current);
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
              ((n[et] = t), (n[It] = l));
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
              e: switch ((lt(n, o, l), o)) {
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
              l && Ha(t);
            }
          }
          return (
            Se(t),
            Cf(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a),
            null
          );
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== l && Ha(t);
          else {
            if (typeof l != 'string' && t.stateNode === null) throw Error(w(166));
            if (((e = Il.current), No(t))) {
              if (((e = t.stateNode), (a = t.memoizedProps), (l = null), (o = tt), o !== null))
                switch (o.tag) {
                  case 27:
                  case 5:
                    l = o.memoizedProps;
                }
              ((e[et] = t),
                (e = !!(
                  e.nodeValue === a ||
                  (l !== null && l.suppressHydrationWarning === !0) ||
                  dL(e.nodeValue, a)
                )),
                e || Bl(t, !0));
            } else ((e = Ss(e).createTextNode(l)), (e[et] = t), (t.stateNode = e));
          }
          return (Se(t), null);
        case 31:
          if (((a = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((l = No(t)), a !== null)) {
              if (e === null) {
                if (!l) throw Error(w(318));
                if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                  throw Error(w(557));
                e[et] = t;
              } else (no(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
              (Se(t), (e = !1));
            } else
              ((a = mf()),
                e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a),
                (e = !0));
            if (!e) return t.flags & 256 ? (Dt(t), t) : (Dt(t), null);
            if ((t.flags & 128) !== 0) throw Error(w(558));
          }
          return (Se(t), null);
        case 13:
          if (
            ((l = t.memoizedState),
            e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((o = No(t)), l !== null && l.dehydrated !== null)) {
              if (e === null) {
                if (!o) throw Error(w(318));
                if (((o = t.memoizedState), (o = o !== null ? o.dehydrated : null), !o))
                  throw Error(w(317));
                o[et] = t;
              } else (no(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
              (Se(t), (o = !1));
            } else
              ((o = mf()),
                e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = o),
                (o = !0));
            if (!o) return t.flags & 256 ? (Dt(t), t) : (Dt(t), null);
          }
          return (
            Dt(t),
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
                Tr(t, t.updateQueue),
                Se(t),
                null)
          );
        case 4:
          return (fn(), e === null && xd(t.stateNode.containerInfo), Se(t), null);
        case 10:
          return (Ka(t.type), Se(t), null);
        case 19:
          if ((Ze(De), (l = t.memoizedState), l === null)) return (Se(t), null);
          if (((o = (t.flags & 128) !== 0), (n = l.rendering), n === null))
            if (o) au(l, !1);
            else {
              if (Me !== 0 || (e !== null && (e.flags & 128) !== 0))
                for (e = t.child; e !== null;) {
                  if (((n = rs(e)), n !== null)) {
                    for (
                      t.flags |= 128,
                        au(l, !1),
                        e = n.updateQueue,
                        t.updateQueue = e,
                        Tr(t, e),
                        t.subtreeFlags = 0,
                        e = a,
                        a = t.child;
                      a !== null;
                    )
                      (Ag(a, e), (a = a.sibling));
                    return (he(De, (De.current & 1) | 2), te && Fa(t, l.treeForkCount), t.child);
                  }
                  e = e.sibling;
                }
              l.tail !== null &&
                Bt() > ms &&
                ((t.flags |= 128), (o = !0), au(l, !1), (t.lanes = 4194304));
            }
          else {
            if (!o)
              if (((e = rs(n)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (o = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  Tr(t, e),
                  au(l, !0),
                  l.tail === null && l.tailMode === 'hidden' && !n.alternate && !te)
                )
                  return (Se(t), null);
              } else
                2 * Bt() - l.renderingStartTime > ms &&
                  a !== 536870912 &&
                  ((t.flags |= 128), (o = !0), au(l, !1), (t.lanes = 4194304));
            l.isBackwards
              ? ((n.sibling = t.child), (t.child = n))
              : ((e = l.last), e !== null ? (e.sibling = n) : (t.child = n), (l.last = n));
          }
          return l.tail !== null
            ? ((e = l.tail),
              (l.rendering = e),
              (l.tail = e.sibling),
              (l.renderingStartTime = Bt()),
              (e.sibling = null),
              (a = De.current),
              he(De, o ? (a & 1) | 2 : a & 1),
              te && Fa(t, l.treeForkCount),
              e)
            : (Se(t), null);
        case 22:
        case 23:
          return (
            Dt(t),
            Zc(),
            (l = t.memoizedState !== null),
            e !== null
              ? (e.memoizedState !== null) !== l && (t.flags |= 8192)
              : l && (t.flags |= 8192),
            l
              ? (a & 536870912) !== 0 &&
                (t.flags & 128) === 0 &&
                (Se(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : Se(t),
            (a = t.updateQueue),
            a !== null && Tr(t, a.retryQueue),
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
            e !== null && Ze(ao),
            null
          );
        case 24:
          return (
            (a = null),
            e !== null && (a = e.memoizedState.cache),
            t.memoizedState.cache !== a && (t.flags |= 2048),
            Ka(_e),
            Se(t),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(w(156, t.tag));
    }
    function mI(e, t) {
      switch ((Vc(t), t.tag)) {
        case 1:
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 3:
          return (
            Ka(_e),
            fn(),
            (e = t.flags),
            (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (Jr(t), null);
        case 31:
          if (t.memoizedState !== null) {
            if ((Dt(t), t.alternate === null)) throw Error(w(340));
            no();
          }
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 13:
          if ((Dt(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
            if (t.alternate === null) throw Error(w(340));
            no();
          }
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 19:
          return (Ze(De), null);
        case 4:
          return (fn(), null);
        case 10:
          return (Ka(t.type), null);
        case 22:
        case 23:
          return (
            Dt(t),
            Zc(),
            e !== null && Ze(ao),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return (Ka(_e), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Ax(e, t) {
      switch ((Vc(t), t.tag)) {
        case 3:
          (Ka(_e), fn());
          break;
        case 26:
        case 27:
        case 5:
          Jr(t);
          break;
        case 4:
          fn();
          break;
        case 31:
          t.memoizedState !== null && Dt(t);
          break;
        case 13:
          Dt(t);
          break;
        case 19:
          Ze(De);
          break;
        case 10:
          Ka(t.type);
          break;
        case 22:
        case 23:
          (Dt(t), Zc(), e !== null && Ze(ao));
          break;
        case 24:
          Ka(_e);
      }
    }
    function ju(e, t) {
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
        ie(t, t.return, r);
      }
    }
    function Pl(e, t, a) {
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
                } catch (h) {
                  ie(o, s, h);
                }
              }
            }
            l = l.next;
          } while (l !== n);
        }
      } catch (h) {
        ie(t, t.return, h);
      }
    }
    function Tx(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        try {
          Ug(t, a);
        } catch (l) {
          ie(e, e.return, l);
        }
      }
    }
    function kx(e, t, a) {
      ((a.props = io(e.type, e.memoizedProps)), (a.state = e.memoizedState));
      try {
        a.componentWillUnmount();
      } catch (l) {
        ie(e, t, l);
      }
    }
    function Su(e, t) {
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
        ie(e, t, o);
      }
    }
    function Ra(e, t) {
      var a = e.ref,
        l = e.refCleanup;
      if (a !== null)
        if (typeof l == 'function')
          try {
            l();
          } catch (o) {
            ie(e, t, o);
          } finally {
            ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
          }
        else if (typeof a == 'function')
          try {
            a(null);
          } catch (o) {
            ie(e, t, o);
          }
        else a.current = null;
    }
    function Mx(e) {
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
        ie(e, e.return, o);
      }
    }
    function bf(e, t, a) {
      try {
        var l = e.stateNode;
        (OI(l, e.type, a, t), (l[It] = t));
      } catch (o) {
        ie(e, e.return, o);
      }
    }
    function Dx(e) {
      return (
        e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && Hl(e.type)) || e.tag === 4
      );
    }
    function If(e) {
      e: for (;;) {
        for (; e.sibling === null;) {
          if (e.return === null || Dx(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
        ) {
          if ((e.tag === 27 && Hl(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
            continue e;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function dc(e, t, a) {
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
              a != null || t.onclick !== null || (t.onclick = Xa)));
      else if (
        l !== 4 &&
        (l === 27 && Hl(e.type) && ((a = e.stateNode), (t = null)), (e = e.child), e !== null)
      )
        for (dc(e, t, a), e = e.sibling; e !== null;) (dc(e, t, a), (e = e.sibling));
    }
    function ds(e, t, a) {
      var l = e.tag;
      if (l === 5 || l === 6) ((e = e.stateNode), t ? a.insertBefore(e, t) : a.appendChild(e));
      else if (l !== 4 && (l === 27 && Hl(e.type) && (a = e.stateNode), (e = e.child), e !== null))
        for (ds(e, t, a), e = e.sibling; e !== null;) (ds(e, t, a), (e = e.sibling));
    }
    function Ex(e) {
      var t = e.stateNode,
        a = e.memoizedProps;
      try {
        for (var l = e.type, o = t.attributes; o.length;) t.removeAttributeNode(o[0]);
        (lt(t, l, a), (t[et] = e), (t[It] = a));
      } catch (n) {
        ie(e, e.return, n);
      }
    }
    var Ga = !1,
      Pe = !1,
      wf = !1,
      ch = typeof WeakSet == 'function' ? WeakSet : Set,
      Ye = null;
    function pI(e, t) {
      if (((e = e.containerInfo), (Sc = bs), (e = Sg(e)), zc(e))) {
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
                h = 0,
                m = e,
                f = null;
              t: for (;;) {
                for (
                  var p;
                  m !== a || (o !== 0 && m.nodeType !== 3) || (r = u + o),
                    m !== n || (l !== 0 && m.nodeType !== 3) || (s = u + l),
                    m.nodeType === 3 && (u += m.nodeValue.length),
                    (p = m.firstChild) !== null;
                )
                  ((f = m), (m = p));
                for (;;) {
                  if (m === e) break t;
                  if (
                    (f === a && ++i === o && (r = u),
                    f === n && ++h === l && (s = u),
                    (p = m.nextSibling) !== null)
                  )
                    break;
                  ((m = f), (f = m.parentNode));
                }
                m = p;
              }
              a = r === -1 || s === -1 ? null : { start: r, end: s };
            } else a = null;
          }
        a = a || { start: 0, end: 0 };
      } else a = null;
      for (vc = { focusedElem: e, selectionRange: a }, bs = !1, Ye = t; Ye !== null;)
        if (((t = Ye), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
          ((e.return = t), (Ye = e));
        else
          for (; Ye !== null;) {
            switch (((t = Ye), (n = t.alternate), (e = t.flags), t.tag)) {
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
                    var L = io(a.type, o);
                    ((e = l.getSnapshotBeforeUpdate(L, n)),
                      (l.__reactInternalSnapshotBeforeUpdate = e));
                  } catch (S) {
                    ie(a, a.return, S);
                  }
                }
                break;
              case 3:
                if ((e & 1024) !== 0) {
                  if (((e = t.stateNode.containerInfo), (a = e.nodeType), a === 9)) Cc(e);
                  else if (a === 1)
                    switch (e.nodeName) {
                      case 'HEAD':
                      case 'HTML':
                      case 'BODY':
                        Cc(e);
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
              ((e.return = t.return), (Ye = e));
              break;
            }
            Ye = t.return;
          }
    }
    function Ox(e, t, a) {
      var l = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          (Na(e, a), l & 4 && ju(5, a));
          break;
        case 1:
          if ((Na(e, a), l & 4))
            if (((e = a.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (u) {
                ie(a, a.return, u);
              }
            else {
              var o = io(a.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(o, t, e.__reactInternalSnapshotBeforeUpdate);
              } catch (u) {
                ie(a, a.return, u);
              }
            }
          (l & 64 && Tx(a), l & 512 && Su(a, a.return));
          break;
        case 3:
          if ((Na(e, a), l & 64 && ((e = a.updateQueue), e !== null))) {
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
              Ug(e, t);
            } catch (u) {
              ie(a, a.return, u);
            }
          }
          break;
        case 27:
          t === null && l & 4 && Ex(a);
        case 26:
        case 5:
          (Na(e, a), t === null && l & 4 && Mx(a), l & 512 && Su(a, a.return));
          break;
        case 12:
          Na(e, a);
          break;
        case 31:
          (Na(e, a), l & 4 && _x(e, a));
          break;
        case 13:
          (Na(e, a),
            l & 4 && Ux(e, a),
            l & 64 &&
              ((e = a.memoizedState),
              e !== null &&
                ((e = e.dehydrated), e !== null && ((a = bI.bind(null, a)), qI(e, a)))));
          break;
        case 22:
          if (((l = a.memoizedState !== null || Ga), !l)) {
            ((t = (t !== null && t.memoizedState !== null) || Pe), (o = Ga));
            var n = Pe;
            ((Ga = l),
              (Pe = t) && !n ? qa(e, a, (a.subtreeFlags & 8772) !== 0) : Na(e, a),
              (Ga = o),
              (Pe = n));
          }
          break;
        case 30:
          break;
        default:
          Na(e, a);
      }
    }
    function Bx(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), Bx(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && Oc(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var Re = null,
      yt = !1;
    function za(e, t, a) {
      for (a = a.child; a !== null;) (Px(e, t, a), (a = a.sibling));
    }
    function Px(e, t, a) {
      if (Pt && typeof Pt.onCommitFiberUnmount == 'function')
        try {
          Pt.onCommitFiberUnmount(zu, a);
        } catch {}
      switch (a.tag) {
        case 26:
          (Pe || Ra(a, t),
            za(e, t, a),
            a.memoizedState
              ? a.memoizedState.count--
              : a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a)));
          break;
        case 27:
          Pe || Ra(a, t);
          var l = Re,
            o = yt;
          (Hl(a.type) && ((Re = a.stateNode), (yt = !1)),
            za(e, t, a),
            bu(a.stateNode),
            (Re = l),
            (yt = o));
          break;
        case 5:
          Pe || Ra(a, t);
        case 6:
          if (((l = Re), (o = yt), (Re = null), za(e, t, a), (Re = l), (yt = o), Re !== null))
            if (yt)
              try {
                (Re.nodeType === 9
                  ? Re.body
                  : Re.nodeName === 'HTML'
                    ? Re.ownerDocument.body
                    : Re
                ).removeChild(a.stateNode);
              } catch (n) {
                ie(a, t, n);
              }
            else
              try {
                Re.removeChild(a.stateNode);
              } catch (n) {
                ie(a, t, n);
              }
          break;
        case 18:
          Re !== null &&
            (yt
              ? ((e = Re),
                Rh(
                  e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e,
                  a.stateNode,
                ),
                vn(e))
              : Rh(Re, a.stateNode));
          break;
        case 4:
          ((l = Re),
            (o = yt),
            (Re = a.stateNode.containerInfo),
            (yt = !0),
            za(e, t, a),
            (Re = l),
            (yt = o));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (Pl(2, a, t), Pe || Pl(4, a, t), za(e, t, a));
          break;
        case 1:
          (Pe ||
            (Ra(a, t),
            (l = a.stateNode),
            typeof l.componentWillUnmount == 'function' && kx(a, t, l)),
            za(e, t, a));
          break;
        case 21:
          za(e, t, a);
          break;
        case 22:
          ((Pe = (l = Pe) || a.memoizedState !== null), za(e, t, a), (Pe = l));
          break;
        default:
          za(e, t, a);
      }
    }
    function _x(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          vn(e);
        } catch (a) {
          ie(t, t.return, a);
        }
      }
    }
    function Ux(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          vn(e);
        } catch (a) {
          ie(t, t.return, a);
        }
    }
    function hI(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return (t === null && (t = e.stateNode = new ch()), t);
        case 22:
          return (
            (e = e.stateNode),
            (t = e._retryCache),
            t === null && (t = e._retryCache = new ch()),
            t
          );
        default:
          throw Error(w(435, e.tag));
      }
    }
    function kr(e, t) {
      var a = hI(e);
      t.forEach(function (l) {
        if (!a.has(l)) {
          a.add(l);
          var o = II.bind(null, e, l);
          l.then(o, o);
        }
      });
    }
    function St(e, t) {
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
                if (Hl(r.type)) {
                  ((Re = r.stateNode), (yt = !1));
                  break e;
                }
                break;
              case 5:
                ((Re = r.stateNode), (yt = !1));
                break e;
              case 3:
              case 4:
                ((Re = r.stateNode.containerInfo), (yt = !0));
                break e;
            }
            r = r.return;
          }
          if (Re === null) throw Error(w(160));
          (Px(n, u, o),
            (Re = null),
            (yt = !1),
            (n = o.alternate),
            n !== null && (n.return = null),
            (o.return = null));
        }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) (Hx(t, e), (t = t.sibling));
    }
    var ra = null;
    function Hx(e, t) {
      var a = e.alternate,
        l = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (St(t, e), vt(e), l & 4 && (Pl(3, e, e.return), ju(3, e), Pl(5, e, e.return)));
          break;
        case 1:
          (St(t, e),
            vt(e),
            l & 512 && (Pe || a === null || Ra(a, a.return)),
            l & 64 &&
              Ga &&
              ((e = e.updateQueue),
              e !== null &&
                ((l = e.callbacks),
                l !== null &&
                  ((a = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = a === null ? l : a.concat(l))))));
          break;
        case 26:
          var o = ra;
          if ((St(t, e), vt(e), l & 512 && (Pe || a === null || Ra(a, a.return)), l & 4)) {
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
                            n[Fu] ||
                            n[et] ||
                            n.namespaceURI === 'http://www.w3.org/2000/svg' ||
                            n.hasAttribute('itemprop')) &&
                            ((n = o.createElement(l)),
                            o.head.insertBefore(n, o.querySelector('head > title'))),
                          lt(n, l, a),
                          (n[et] = e),
                          Ke(n),
                          (l = n));
                        break e;
                      case 'link':
                        var u = Oh('link', 'href', o).get(l + (a.href || ''));
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
                        ((n = o.createElement(l)), lt(n, l, a), o.head.appendChild(n));
                        break;
                      case 'meta':
                        if ((u = Oh('meta', 'content', o).get(l + (a.content || '')))) {
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
                        ((n = o.createElement(l)), lt(n, l, a), o.head.appendChild(n));
                        break;
                      default:
                        throw Error(w(468, l));
                    }
                    ((n[et] = e), Ke(n), (l = n));
                  }
                  e.stateNode = l;
                } else Bh(o, e.type, e.stateNode);
              else e.stateNode = Eh(o, l, e.memoizedProps);
            else
              n !== l
                ? (n === null
                    ? a.stateNode !== null && ((a = a.stateNode), a.parentNode.removeChild(a))
                    : n.count--,
                  l === null ? Bh(o, e.type, e.stateNode) : Eh(o, l, e.memoizedProps))
                : l === null && e.stateNode !== null && bf(e, e.memoizedProps, a.memoizedProps);
          }
          break;
        case 27:
          (St(t, e),
            vt(e),
            l & 512 && (Pe || a === null || Ra(a, a.return)),
            a !== null && l & 4 && bf(e, e.memoizedProps, a.memoizedProps));
          break;
        case 5:
          if ((St(t, e), vt(e), l & 512 && (Pe || a === null || Ra(a, a.return)), e.flags & 32)) {
            o = e.stateNode;
            try {
              dn(o, '');
            } catch (L) {
              ie(e, e.return, L);
            }
          }
          (l & 4 &&
            e.stateNode != null &&
            ((o = e.memoizedProps), bf(e, o, a !== null ? a.memoizedProps : o)),
            l & 1024 && (wf = !0));
          break;
        case 6:
          if ((St(t, e), vt(e), l & 4)) {
            if (e.stateNode === null) throw Error(w(162));
            ((l = e.memoizedProps), (a = e.stateNode));
            try {
              a.nodeValue = l;
            } catch (L) {
              ie(e, e.return, L);
            }
          }
          break;
        case 3:
          if (
            ((Yr = null),
            (o = ra),
            (ra = vs(t.containerInfo)),
            St(t, e),
            (ra = o),
            vt(e),
            l & 4 && a !== null && a.memoizedState.isDehydrated)
          )
            try {
              vn(t.containerInfo);
            } catch (L) {
              ie(e, e.return, L);
            }
          wf && ((wf = !1), zx(e));
          break;
        case 4:
          ((l = ra), (ra = vs(e.stateNode.containerInfo)), St(t, e), vt(e), (ra = l));
          break;
        case 12:
          (St(t, e), vt(e));
          break;
        case 31:
          (St(t, e),
            vt(e),
            l & 4 && ((l = e.updateQueue), l !== null && ((e.updateQueue = null), kr(e, l))));
          break;
        case 13:
          (St(t, e),
            vt(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) != (a !== null && a.memoizedState !== null) &&
              (_s = Bt()),
            l & 4 && ((l = e.updateQueue), l !== null && ((e.updateQueue = null), kr(e, l))));
          break;
        case 22:
          o = e.memoizedState !== null;
          var s = a !== null && a.memoizedState !== null,
            i = Ga,
            h = Pe;
          if (((Ga = i || o), (Pe = h || s), St(t, e), (Pe = h), (Ga = i), vt(e), l & 8192))
            e: for (
              t = e.stateNode,
                t._visibility = o ? t._visibility & -2 : t._visibility | 1,
                o && (a === null || s || Ga || Pe || $l(e)),
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
                      var m = s.memoizedProps.style,
                        f = m != null && m.hasOwnProperty('display') ? m.display : null;
                      r.style.display = f == null || typeof f == 'boolean' ? '' : ('' + f).trim();
                    }
                  } catch (L) {
                    ie(s, s.return, L);
                  }
                }
              } else if (t.tag === 6) {
                if (a === null) {
                  s = t;
                  try {
                    s.stateNode.nodeValue = o ? '' : s.memoizedProps;
                  } catch (L) {
                    ie(s, s.return, L);
                  }
                }
              } else if (t.tag === 18) {
                if (a === null) {
                  s = t;
                  try {
                    var p = s.stateNode;
                    o ? Ah(p, !0) : Ah(s.stateNode, !1);
                  } catch (L) {
                    ie(s, s.return, L);
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
            l !== null && ((a = l.retryQueue), a !== null && ((l.retryQueue = null), kr(e, a))));
          break;
        case 19:
          (St(t, e),
            vt(e),
            l & 4 && ((l = e.updateQueue), l !== null && ((e.updateQueue = null), kr(e, l))));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          (St(t, e), vt(e));
      }
    }
    function vt(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var a, l = e.return; l !== null;) {
            if (Dx(l)) {
              a = l;
              break;
            }
            l = l.return;
          }
          if (a == null) throw Error(w(160));
          switch (a.tag) {
            case 27:
              var o = a.stateNode,
                n = If(e);
              ds(e, n, o);
              break;
            case 5:
              var u = a.stateNode;
              a.flags & 32 && (dn(u, ''), (a.flags &= -33));
              var r = If(e);
              ds(e, r, u);
              break;
            case 3:
            case 4:
              var s = a.stateNode.containerInfo,
                i = If(e);
              dc(e, i, s);
              break;
            default:
              throw Error(w(161));
          }
        } catch (h) {
          ie(e, e.return, h);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function zx(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null;) {
          var t = e;
          (zx(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling));
        }
    }
    function Na(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null;) (Ox(e, t.alternate, t), (t = t.sibling));
    }
    function $l(e) {
      for (e = e.child; e !== null;) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (Pl(4, t, t.return), $l(t));
            break;
          case 1:
            Ra(t, t.return);
            var a = t.stateNode;
            (typeof a.componentWillUnmount == 'function' && kx(t, t.return, a), $l(t));
            break;
          case 27:
            bu(t.stateNode);
          case 26:
          case 5:
            (Ra(t, t.return), $l(t));
            break;
          case 22:
            t.memoizedState === null && $l(t);
            break;
          case 30:
            $l(t);
            break;
          default:
            $l(t);
        }
        e = e.sibling;
      }
    }
    function qa(e, t, a) {
      for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null;) {
        var l = t.alternate,
          o = e,
          n = t,
          u = n.flags;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            (qa(o, n, a), ju(4, n));
            break;
          case 1:
            if ((qa(o, n, a), (l = n), (o = l.stateNode), typeof o.componentDidMount == 'function'))
              try {
                o.componentDidMount();
              } catch (i) {
                ie(l, l.return, i);
              }
            if (((l = n), (o = l.updateQueue), o !== null)) {
              var r = l.stateNode;
              try {
                var s = o.shared.hiddenCallbacks;
                if (s !== null)
                  for (o.shared.hiddenCallbacks = null, o = 0; o < s.length; o++) _g(s[o], r);
              } catch (i) {
                ie(l, l.return, i);
              }
            }
            (a && u & 64 && Tx(n), Su(n, n.return));
            break;
          case 27:
            Ex(n);
          case 26:
          case 5:
            (qa(o, n, a), a && l === null && u & 4 && Mx(n), Su(n, n.return));
            break;
          case 12:
            qa(o, n, a);
            break;
          case 31:
            (qa(o, n, a), a && u & 4 && _x(o, n));
            break;
          case 13:
            (qa(o, n, a), a && u & 4 && Ux(o, n));
            break;
          case 22:
            (n.memoizedState === null && qa(o, n, a), Su(n, n.return));
            break;
          case 30:
            break;
          default:
            qa(o, n, a);
        }
        t = t.sibling;
      }
    }
    function cd(e, t) {
      var a = null;
      (e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (a = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== a && (e != null && e.refCount++, a != null && Vu(a)));
    }
    function dd(e, t) {
      ((e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && Vu(e)));
    }
    function ua(e, t, a, l) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) (Nx(e, t, a, l), (t = t.sibling));
    }
    function Nx(e, t, a, l) {
      var o = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (ua(e, t, a, l), o & 2048 && ju(9, t));
          break;
        case 1:
          ua(e, t, a, l);
          break;
        case 3:
          (ua(e, t, a, l),
            o & 2048 &&
              ((e = null),
              t.alternate !== null && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== e && (t.refCount++, e != null && Vu(e))));
          break;
        case 12:
          if (o & 2048) {
            (ua(e, t, a, l), (e = t.stateNode));
            try {
              var n = t.memoizedProps,
                u = n.id,
                r = n.onPostCommit;
              typeof r == 'function' &&
                r(u, t.alternate === null ? 'mount' : 'update', e.passiveEffectDuration, -0);
            } catch (s) {
              ie(t, t.return, s);
            }
          } else ua(e, t, a, l);
          break;
        case 31:
          ua(e, t, a, l);
          break;
        case 13:
          ua(e, t, a, l);
          break;
        case 23:
          break;
        case 22:
          ((n = t.stateNode),
            (u = t.alternate),
            t.memoizedState !== null
              ? n._visibility & 2
                ? ua(e, t, a, l)
                : vu(e, t)
              : n._visibility & 2
                ? ua(e, t, a, l)
                : ((n._visibility |= 2), Fo(e, t, a, l, (t.subtreeFlags & 10256) !== 0 || !1)),
            o & 2048 && cd(u, t));
          break;
        case 24:
          (ua(e, t, a, l), o & 2048 && dd(t.alternate, t));
          break;
        default:
          ua(e, t, a, l);
      }
    }
    function Fo(e, t, a, l, o) {
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
            (Fo(n, u, r, s, o), ju(8, u));
            break;
          case 23:
            break;
          case 22:
            var h = u.stateNode;
            (u.memoizedState !== null
              ? h._visibility & 2
                ? Fo(n, u, r, s, o)
                : vu(n, u)
              : ((h._visibility |= 2), Fo(n, u, r, s, o)),
              o && i & 2048 && cd(u.alternate, u));
            break;
          case 24:
            (Fo(n, u, r, s, o), o && i & 2048 && dd(u.alternate, u));
            break;
          default:
            Fo(n, u, r, s, o);
        }
        t = t.sibling;
      }
    }
    function vu(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null;) {
          var a = e,
            l = t,
            o = l.flags;
          switch (l.tag) {
            case 22:
              (vu(a, l), o & 2048 && cd(l.alternate, l));
              break;
            case 24:
              (vu(a, l), o & 2048 && dd(l.alternate, l));
              break;
            default:
              vu(a, l);
          }
          t = t.sibling;
        }
    }
    var fu = 8192;
    function qo(e, t, a) {
      if (e.subtreeFlags & fu) for (e = e.child; e !== null;) (qx(e, t, a), (e = e.sibling));
    }
    function qx(e, t, a) {
      switch (e.tag) {
        case 26:
          (qo(e, t, a),
            e.flags & fu &&
              e.memoizedState !== null &&
              $I(a, ra, e.memoizedState, e.memoizedProps));
          break;
        case 5:
          qo(e, t, a);
          break;
        case 3:
        case 4:
          var l = ra;
          ((ra = vs(e.stateNode.containerInfo)), qo(e, t, a), (ra = l));
          break;
        case 22:
          e.memoizedState === null &&
            ((l = e.alternate),
            l !== null && l.memoizedState !== null
              ? ((l = fu), (fu = 16777216), qo(e, t, a), (fu = l))
              : qo(e, t, a));
          break;
        default:
          qo(e, t, a);
      }
    }
    function Fx(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do ((t = e.sibling), (e.sibling = null), (e = t));
        while (e !== null);
      }
    }
    function lu(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null)
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            ((Ye = l), Vx(l, e));
          }
        Fx(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (Gx(e), (e = e.sibling));
    }
    function Gx(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (lu(e), e.flags & 2048 && Pl(9, e, e.return));
          break;
        case 3:
          lu(e);
          break;
        case 12:
          lu(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Xr(e))
            : lu(e);
          break;
        default:
          lu(e);
      }
    }
    function Xr(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null)
          for (var a = 0; a < t.length; a++) {
            var l = t[a];
            ((Ye = l), Vx(l, e));
          }
        Fx(e);
      }
      for (e = e.child; e !== null;) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            (Pl(8, t, t.return), Xr(t));
            break;
          case 22:
            ((a = t.stateNode), a._visibility & 2 && ((a._visibility &= -3), Xr(t)));
            break;
          default:
            Xr(t);
        }
        e = e.sibling;
      }
    }
    function Vx(e, t) {
      for (; Ye !== null;) {
        var a = Ye;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            Pl(8, a, t);
            break;
          case 23:
          case 22:
            if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
              var l = a.memoizedState.cachePool.pool;
              l != null && l.refCount++;
            }
            break;
          case 24:
            Vu(a.memoizedState.cache);
        }
        if (((l = a.child), l !== null)) ((l.return = a), (Ye = l));
        else
          e: for (a = e; Ye !== null;) {
            l = Ye;
            var o = l.sibling,
              n = l.return;
            if ((Bx(l), l === a)) {
              Ye = null;
              break e;
            }
            if (o !== null) {
              ((o.return = n), (Ye = o));
              break e;
            }
            Ye = n;
          }
      }
    }
    var gI = {
        getCacheForType: function (e) {
          var t = at(_e),
            a = t.data.get(e);
          return (a === void 0 && ((a = e()), t.data.set(e, a)), a);
        },
        cacheSignal: function () {
          return at(_e).controller.signal;
        },
      },
      xI = typeof WeakMap == 'function' ? WeakMap : Map,
      oe = 0,
      me = null,
      $ = null,
      ee = 0,
      se = 0,
      Mt = null,
      yl = !1,
      wn = !1,
      md = !1,
      el = 0,
      Me = 0,
      _l = 0,
      oo = 0,
      pd = 0,
      Ot = 0,
      gn = 0,
      yu = null,
      Ct = null,
      mc = !1,
      _s = 0,
      Xx = 0,
      ms = 1 / 0,
      ps = null,
      Tl = null,
      Fe = 0,
      kl = null,
      xn = null,
      Za = 0,
      pc = 0,
      hc = null,
      jx = null,
      Cu = 0,
      gc = null;
    function Ut() {
      return (oe & 2) !== 0 && ee !== 0 ? ee & -ee : _.T !== null ? gd() : tg();
    }
    function Yx() {
      if (Ot === 0)
        if ((ee & 536870912) === 0 || te) {
          var e = Sr;
          ((Sr <<= 1), (Sr & 3932160) === 0 && (Sr = 262144), (Ot = e));
        } else Ot = 536870912;
      return ((e = zt.current), e !== null && (e.flags |= 32), Ot);
    }
    function bt(e, t, a) {
      (((e === me && (se === 2 || se === 9)) || e.cancelPendingCommit !== null) &&
        (Ln(e, 0), Cl(e, ee, Ot, !1)),
        qu(e, a),
        ((oe & 2) === 0 || e !== me) &&
          (e === me && ((oe & 2) === 0 && (oo |= a), Me === 4 && Cl(e, ee, Ot, !1)), ka(e)));
    }
    function Kx(e, t, a) {
      if ((oe & 6) !== 0) throw Error(w(327));
      var l = (!a && (t & 127) === 0 && (t & e.expiredLanes) === 0) || Nu(e, t),
        o = l ? vI(e, t) : Rf(e, t, !0),
        n = l;
      do {
        if (o === 0) {
          wn && !l && Cl(e, t, 0, !1);
          break;
        } else {
          if (((a = e.current.alternate), n && !LI(a))) {
            ((o = Rf(e, t, !1)), (n = !1));
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
                o = yu;
                var s = r.current.memoizedState.isDehydrated;
                if ((s && (Ln(r, u).flags |= 256), (u = Rf(r, u, !1)), u !== 2)) {
                  if (md && !s) {
                    ((r.errorRecoveryDisabledLanes |= n), (oo |= n), (o = 4));
                    break e;
                  }
                  ((n = Ct),
                    (Ct = o),
                    n !== null && (Ct === null ? (Ct = n) : Ct.push.apply(Ct, n)));
                }
                o = u;
              }
              if (((n = !1), o !== 2)) continue;
            }
          }
          if (o === 1) {
            (Ln(e, 0), Cl(e, t, 0, !0));
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
                Cl(l, t, Ot, !yl);
                break e;
              case 2:
                Ct = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(w(329));
            }
            if ((t & 62914560) === t && ((o = _s + 300 - Bt()), 10 < o)) {
              if ((Cl(l, t, Ot, !yl), ws(l, 0, !0) !== 0)) break e;
              ((Za = t),
                (l.timeoutHandle = pL(
                  dh.bind(null, l, a, Ct, ps, mc, t, Ot, oo, gn, yl, n, 'Throttled', -0, 0),
                  o,
                )));
              break e;
            }
            dh(l, a, Ct, ps, mc, t, Ot, oo, gn, yl, n, null, -0, 0);
          }
        }
        break;
      } while (!0);
      ka(e);
    }
    function dh(e, t, a, l, o, n, u, r, s, i, h, m, f, p) {
      if (((e.timeoutHandle = -1), (m = t.subtreeFlags), m & 8192 || (m & 16785408) === 16785408)) {
        ((m = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: Xa,
        }),
          qx(t, n, m));
        var L = (n & 62914560) === n ? _s - Bt() : (n & 4194048) === n ? Xx - Bt() : 0;
        if (((L = e0(m, L)), L !== null)) {
          ((Za = n),
            (e.cancelPendingCommit = L(ph.bind(null, e, t, n, a, l, o, u, r, s, h, m, null, f, p))),
            Cl(e, n, u, !i));
          return;
        }
      }
      ph(e, t, n, a, l, o, u, r, s);
    }
    function LI(e) {
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
              if (!Ht(n(), o)) return !1;
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
    function Cl(e, t, a, l) {
      ((t &= ~pd),
        (t &= ~oo),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        l && (e.warmLanes |= t),
        (l = e.expirationTimes));
      for (var o = t; 0 < o;) {
        var n = 31 - _t(o),
          u = 1 << n;
        ((l[n] = -1), (o &= ~u));
      }
      a !== 0 && Jh(e, a, t);
    }
    function Us() {
      return (oe & 6) === 0 ? (Yu(0, !1), !1) : !0;
    }
    function hd() {
      if ($ !== null) {
        if (se === 0) var e = $.return;
        else ((e = $), (ja = ho = null), ed(e), (un = null), (Mu = 0), (e = $));
        for (; e !== null;) (Ax(e.alternate, e), (e = e.return));
        $ = null;
      }
    }
    function Ln(e, t) {
      var a = e.timeoutHandle;
      (a !== -1 && ((e.timeoutHandle = -1), _I(a)),
        (a = e.cancelPendingCommit),
        a !== null && ((e.cancelPendingCommit = null), a()),
        (Za = 0),
        hd(),
        (me = e),
        ($ = a = Ya(e.current, null)),
        (ee = t),
        (se = 0),
        (Mt = null),
        (yl = !1),
        (wn = Nu(e, t)),
        (md = !1),
        (gn = Ot = pd = oo = _l = Me = 0),
        (Ct = yu = null),
        (mc = !1),
        (t & 8) !== 0 && (t |= t & 32));
      var l = e.entangledLanes;
      if (l !== 0)
        for (e = e.entanglements, l &= t; 0 < l;) {
          var o = 31 - _t(l),
            n = 1 << o;
          ((t |= e[o]), (l &= ~n));
        }
      return ((el = t), ks(), a);
    }
    function Zx(e, t) {
      ((K = null),
        (_.H = Eu),
        t === In || t === Ds
          ? ((t = Vp()), (se = 3))
          : t === Yc
            ? ((t = Vp()), (se = 4))
            : (se =
                t === id
                  ? 8
                  : t !== null && typeof t == 'object' && typeof t.then == 'function'
                    ? 6
                    : 1),
        (Mt = t),
        $ === null && ((Me = 1), fs(e, Wt(t, e.current))));
    }
    function Qx() {
      var e = zt.current;
      return e === null
        ? !0
        : (ee & 4194048) === ee
          ? $t === null
          : (ee & 62914560) === ee || (ee & 536870912) !== 0
            ? e === $t
            : !1;
    }
    function Wx() {
      var e = _.H;
      return ((_.H = Eu), e === null ? Eu : e);
    }
    function Jx() {
      var e = _.A;
      return ((_.A = gI), e);
    }
    function hs() {
      ((Me = 4),
        yl || ((ee & 4194048) !== ee && zt.current !== null) || (wn = !0),
        ((_l & 134217727) === 0 && (oo & 134217727) === 0) || me === null || Cl(me, ee, Ot, !1));
    }
    function Rf(e, t, a) {
      var l = oe;
      oe |= 2;
      var o = Wx(),
        n = Jx();
      ((me !== e || ee !== t) && ((ps = null), Ln(e, t)), (t = !1));
      var u = Me;
      e: do
        try {
          if (se !== 0 && $ !== null) {
            var r = $,
              s = Mt;
            switch (se) {
              case 8:
                (hd(), (u = 6));
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                zt.current === null && (t = !0);
                var i = se;
                if (((se = 0), (Mt = null), tn(e, r, s, i), a && wn)) {
                  u = 0;
                  break e;
                }
                break;
              default:
                ((i = se), (se = 0), (Mt = null), tn(e, r, s, i));
            }
          }
          (SI(), (u = Me));
          break;
        } catch (h) {
          Zx(e, h);
        }
      while (!0);
      return (
        t && e.shellSuspendCounter++,
        (ja = ho = null),
        (oe = l),
        (_.H = o),
        (_.A = n),
        $ === null && ((me = null), (ee = 0), ks()),
        u
      );
    }
    function SI() {
      for (; $ !== null;) $x($);
    }
    function vI(e, t) {
      var a = oe;
      oe |= 2;
      var l = Wx(),
        o = Jx();
      me !== e || ee !== t ? ((ps = null), (ms = Bt() + 500), Ln(e, t)) : (wn = Nu(e, t));
      e: do
        try {
          if (se !== 0 && $ !== null) {
            t = $;
            var n = Mt;
            t: switch (se) {
              case 1:
                ((se = 0), (Mt = null), tn(e, t, n, 1));
                break;
              case 2:
              case 9:
                if (Gp(n)) {
                  ((se = 0), (Mt = null), mh(t));
                  break;
                }
                ((t = function () {
                  ((se !== 2 && se !== 9) || me !== e || (se = 7), ka(e));
                }),
                  n.then(t, t));
                break e;
              case 3:
                se = 7;
                break e;
              case 4:
                se = 5;
                break e;
              case 7:
                Gp(n) ? ((se = 0), (Mt = null), mh(t)) : ((se = 0), (Mt = null), tn(e, t, n, 7));
                break;
              case 5:
                var u = null;
                switch ($.tag) {
                  case 26:
                    u = $.memoizedState;
                  case 5:
                  case 27:
                    var r = $;
                    if (u ? SL(u) : r.stateNode.complete) {
                      ((se = 0), (Mt = null));
                      var s = r.sibling;
                      if (s !== null) $ = s;
                      else {
                        var i = r.return;
                        i !== null ? (($ = i), Hs(i)) : ($ = null);
                      }
                      break t;
                    }
                }
                ((se = 0), (Mt = null), tn(e, t, n, 5));
                break;
              case 6:
                ((se = 0), (Mt = null), tn(e, t, n, 6));
                break;
              case 8:
                (hd(), (Me = 6));
                break e;
              default:
                throw Error(w(462));
            }
          }
          yI();
          break;
        } catch (h) {
          Zx(e, h);
        }
      while (!0);
      return (
        (ja = ho = null),
        (_.H = l),
        (_.A = o),
        (oe = a),
        $ !== null ? 0 : ((me = null), (ee = 0), ks(), Me)
      );
    }
    function yI() {
      for (; $ !== null && !VC();) $x($);
    }
    function $x(e) {
      var t = Rx(e.alternate, e, el);
      ((e.memoizedProps = e.pendingProps), t === null ? Hs(e) : ($ = t));
    }
    function mh(e) {
      var t = e,
        a = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = uh(a, t, t.pendingProps, t.type, void 0, ee);
          break;
        case 11:
          t = uh(a, t, t.pendingProps, t.type.render, t.ref, ee);
          break;
        case 5:
          ed(t);
        default:
          (Ax(a, t), (t = $ = Ag(t, el)), (t = Rx(a, t, el)));
      }
      ((e.memoizedProps = e.pendingProps), t === null ? Hs(e) : ($ = t));
    }
    function tn(e, t, a, l) {
      ((ja = ho = null), ed(t), (un = null), (Mu = 0));
      var o = t.return;
      try {
        if (iI(e, o, t, a, ee)) {
          ((Me = 1), fs(e, Wt(a, e.current)), ($ = null));
          return;
        }
      } catch (n) {
        if (o !== null) throw (($ = o), n);
        ((Me = 1), fs(e, Wt(a, e.current)), ($ = null));
        return;
      }
      t.flags & 32768
        ? (te || l === 1
            ? (e = !0)
            : wn || (ee & 536870912) !== 0
              ? (e = !1)
              : ((yl = e = !0),
                (l === 2 || l === 9 || l === 3 || l === 6) &&
                  ((l = zt.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
          eL(t, e))
        : Hs(t);
    }
    function Hs(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          eL(t, yl);
          return;
        }
        e = t.return;
        var a = dI(t.alternate, t, el);
        if (a !== null) {
          $ = a;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          $ = t;
          return;
        }
        $ = t = e;
      } while (t !== null);
      Me === 0 && (Me = 5);
    }
    function eL(e, t) {
      do {
        var a = mI(e.alternate, e);
        if (a !== null) {
          ((a.flags &= 32767), ($ = a));
          return;
        }
        if (
          ((a = e.return),
          a !== null && ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          $ = e;
          return;
        }
        $ = e = a;
      } while (e !== null);
      ((Me = 6), ($ = null));
    }
    function ph(e, t, a, l, o, n, u, r, s) {
      e.cancelPendingCommit = null;
      do zs();
      while (Fe !== 0);
      if ((oe & 6) !== 0) throw Error(w(327));
      if (t !== null) {
        if (t === e.current) throw Error(w(177));
        if (
          ((n = t.lanes | t.childLanes),
          (n |= Nc),
          eb(e, a, n, u, r, s),
          e === me && (($ = me = null), (ee = 0)),
          (xn = t),
          (kl = e),
          (Za = a),
          (pc = n),
          (hc = o),
          (jx = l),
          (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              wI($r, function () {
                return (nL(), null);
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (l = (t.flags & 13878) !== 0),
          (t.subtreeFlags & 13878) !== 0 || l)
        ) {
          ((l = _.T), (_.T = null), (o = ne.p), (ne.p = 2), (u = oe), (oe |= 4));
          try {
            pI(e, t, a);
          } finally {
            ((oe = u), (ne.p = o), (_.T = l));
          }
        }
        ((Fe = 1), tL(), aL(), lL());
      }
    }
    function tL() {
      if (Fe === 1) {
        Fe = 0;
        var e = kl,
          t = xn,
          a = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || a) {
          ((a = _.T), (_.T = null));
          var l = ne.p;
          ne.p = 2;
          var o = oe;
          oe |= 4;
          try {
            Hx(t, e);
            var n = vc,
              u = Sg(e.containerInfo),
              r = n.focusedElem,
              s = n.selectionRange;
            if (u !== r && r && r.ownerDocument && Lg(r.ownerDocument.documentElement, r)) {
              if (s !== null && zc(r)) {
                var i = s.start,
                  h = s.end;
                if ((h === void 0 && (h = i), 'selectionStart' in r))
                  ((r.selectionStart = i), (r.selectionEnd = Math.min(h, r.value.length)));
                else {
                  var m = r.ownerDocument || document,
                    f = (m && m.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      L = r.textContent.length,
                      S = Math.min(s.start, L),
                      v = s.end === void 0 ? S : Math.min(s.end, L);
                    !p.extend && S > v && ((u = v), (v = S), (S = u));
                    var g = _p(r, S),
                      d = _p(r, v);
                    if (
                      g &&
                      d &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== g.node ||
                        p.anchorOffset !== g.offset ||
                        p.focusNode !== d.node ||
                        p.focusOffset !== d.offset)
                    ) {
                      var c = m.createRange();
                      (c.setStart(g.node, g.offset),
                        p.removeAllRanges(),
                        S > v
                          ? (p.addRange(c), p.extend(d.node, d.offset))
                          : (c.setEnd(d.node, d.offset), p.addRange(c)));
                    }
                  }
                }
              }
              for (m = [], p = r; (p = p.parentNode);)
                p.nodeType === 1 && m.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (typeof r.focus == 'function' && r.focus(), r = 0; r < m.length; r++) {
                var x = m[r];
                ((x.element.scrollLeft = x.left), (x.element.scrollTop = x.top));
              }
            }
            ((bs = !!Sc), (vc = Sc = null));
          } finally {
            ((oe = o), (ne.p = l), (_.T = a));
          }
        }
        ((e.current = t), (Fe = 2));
      }
    }
    function aL() {
      if (Fe === 2) {
        Fe = 0;
        var e = kl,
          t = xn,
          a = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || a) {
          ((a = _.T), (_.T = null));
          var l = ne.p;
          ne.p = 2;
          var o = oe;
          oe |= 4;
          try {
            Ox(e, t.alternate, t);
          } finally {
            ((oe = o), (ne.p = l), (_.T = a));
          }
        }
        Fe = 3;
      }
    }
    function lL() {
      if (Fe === 4 || Fe === 3) {
        ((Fe = 0), XC());
        var e = kl,
          t = xn,
          a = Za,
          l = jx;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? (Fe = 5)
          : ((Fe = 0), (xn = kl = null), oL(e, e.pendingLanes));
        var o = e.pendingLanes;
        if (
          (o === 0 && (Tl = null),
          Ec(a),
          (t = t.stateNode),
          Pt && typeof Pt.onCommitFiberRoot == 'function')
        )
          try {
            Pt.onCommitFiberRoot(zu, t, void 0, (t.current.flags & 128) === 128);
          } catch {}
        if (l !== null) {
          ((t = _.T), (o = ne.p), (ne.p = 2), (_.T = null));
          try {
            for (var n = e.onRecoverableError, u = 0; u < l.length; u++) {
              var r = l[u];
              n(r.value, { componentStack: r.stack });
            }
          } finally {
            ((_.T = t), (ne.p = o));
          }
        }
        ((Za & 3) !== 0 && zs(),
          ka(e),
          (o = e.pendingLanes),
          (a & 261930) !== 0 && (o & 42) !== 0
            ? e === gc
              ? Cu++
              : ((Cu = 0), (gc = e))
            : (Cu = 0),
          Yu(0, !1));
      }
    }
    function oL(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), Vu(t)));
    }
    function zs() {
      return (tL(), aL(), lL(), nL());
    }
    function nL() {
      if (Fe !== 5) return !1;
      var e = kl,
        t = pc;
      pc = 0;
      var a = Ec(Za),
        l = _.T,
        o = ne.p;
      try {
        ((ne.p = 32 > a ? 32 : a), (_.T = null), (a = hc), (hc = null));
        var n = kl,
          u = Za;
        if (((Fe = 0), (xn = kl = null), (Za = 0), (oe & 6) !== 0)) throw Error(w(331));
        var r = oe;
        if (
          ((oe |= 4),
          Gx(n.current),
          Nx(n, n.current, u, a),
          (oe = r),
          Yu(0, !1),
          Pt && typeof Pt.onPostCommitFiberRoot == 'function')
        )
          try {
            Pt.onPostCommitFiberRoot(zu, n);
          } catch {}
        return !0;
      } finally {
        ((ne.p = o), (_.T = l), oL(e, t));
      }
    }
    function hh(e, t, a) {
      ((t = Wt(a, t)),
        (t = ic(e.stateNode, t, 2)),
        (e = Al(e, t, 2)),
        e !== null && (qu(e, 2), ka(e)));
    }
    function ie(e, t, a) {
      if (e.tag === 3) hh(e, e, a);
      else
        for (; t !== null;) {
          if (t.tag === 3) {
            hh(t, e, a);
            break;
          } else if (t.tag === 1) {
            var l = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == 'function' ||
              (typeof l.componentDidCatch == 'function' && (Tl === null || !Tl.has(l)))
            ) {
              ((e = Wt(a, e)),
                (a = vx(2)),
                (l = Al(t, a, 2)),
                l !== null && (yx(a, l, t, e), qu(l, 2), ka(l)));
              break;
            }
          }
          t = t.return;
        }
    }
    function Af(e, t, a) {
      var l = e.pingCache;
      if (l === null) {
        l = e.pingCache = new xI();
        var o = new Set();
        l.set(t, o);
      } else ((o = l.get(t)), o === void 0 && ((o = new Set()), l.set(t, o)));
      o.has(a) || ((md = !0), o.add(a), (e = CI.bind(null, e, t, a)), t.then(e, e));
    }
    function CI(e, t, a) {
      var l = e.pingCache;
      (l !== null && l.delete(t),
        (e.pingedLanes |= e.suspendedLanes & a),
        (e.warmLanes &= ~a),
        me === e &&
          (ee & a) === a &&
          (Me === 4 || (Me === 3 && (ee & 62914560) === ee && 300 > Bt() - _s)
            ? (oe & 2) === 0 && Ln(e, 0)
            : (pd |= a),
          gn === ee && (gn = 0)),
        ka(e));
    }
    function uL(e, t) {
      (t === 0 && (t = Wh()), (e = po(e, t)), e !== null && (qu(e, t), ka(e)));
    }
    function bI(e) {
      var t = e.memoizedState,
        a = 0;
      (t !== null && (a = t.retryLane), uL(e, a));
    }
    function II(e, t) {
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
      (l !== null && l.delete(t), uL(e, a));
    }
    function wI(e, t) {
      return Mc(e, t);
    }
    var gs = null,
      Go = null,
      xc = !1,
      xs = !1,
      Tf = !1,
      bl = 0;
    function ka(e) {
      (e !== Go && e.next === null && (Go === null ? (gs = Go = e) : (Go = Go.next = e)),
        (xs = !0),
        xc || ((xc = !0), AI()));
    }
    function Yu(e, t) {
      if (!Tf && xs) {
        Tf = !0;
        do
          for (var a = !1, l = gs; l !== null;) {
            if (!t)
              if (e !== 0) {
                var o = l.pendingLanes;
                if (o === 0) var n = 0;
                else {
                  var u = l.suspendedLanes,
                    r = l.pingedLanes;
                  ((n = (1 << (31 - _t(42 | e) + 1)) - 1),
                    (n &= o & ~(u & ~r)),
                    (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
                }
                n !== 0 && ((a = !0), gh(l, n));
              } else
                ((n = ee),
                  (n = ws(
                    l,
                    l === me ? n : 0,
                    l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
                  )),
                  (n & 3) === 0 || Nu(l, n) || ((a = !0), gh(l, n)));
            l = l.next;
          }
        while (a);
        Tf = !1;
      }
    }
    function RI() {
      rL();
    }
    function rL() {
      xs = xc = !1;
      var e = 0;
      bl !== 0 && PI() && (e = bl);
      for (var t = Bt(), a = null, l = gs; l !== null;) {
        var o = l.next,
          n = sL(l, t);
        (n === 0
          ? ((l.next = null), a === null ? (gs = o) : (a.next = o), o === null && (Go = a))
          : ((a = l), (e !== 0 || (n & 3) !== 0) && (xs = !0)),
          (l = o));
      }
      ((Fe !== 0 && Fe !== 5) || Yu(e, !1), bl !== 0 && (bl = 0));
    }
    function sL(e, t) {
      for (
        var a = e.suspendedLanes,
          l = e.pingedLanes,
          o = e.expirationTimes,
          n = e.pendingLanes & -62914561;
        0 < n;
      ) {
        var u = 31 - _t(n),
          r = 1 << u,
          s = o[u];
        (s === -1
          ? ((r & a) === 0 || (r & l) !== 0) && (o[u] = $C(r, t))
          : s <= t && (e.expiredLanes |= r),
          (n &= ~r));
      }
      if (
        ((t = me),
        (a = ee),
        (a = ws(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
        (l = e.callbackNode),
        a === 0 || (e === t && (se === 2 || se === 9)) || e.cancelPendingCommit !== null)
      )
        return (
          l !== null && l !== null && af(l),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if ((a & 3) === 0 || Nu(e, a)) {
        if (((t = a & -a), t === e.callbackPriority)) return t;
        switch ((l !== null && af(l), Ec(a))) {
          case 2:
          case 8:
            a = Zh;
            break;
          case 32:
            a = $r;
            break;
          case 268435456:
            a = Qh;
            break;
          default:
            a = $r;
        }
        return (
          (l = iL.bind(null, e)),
          (a = Mc(a, l)),
          (e.callbackPriority = t),
          (e.callbackNode = a),
          t
        );
      }
      return (
        l !== null && l !== null && af(l),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function iL(e, t) {
      if (Fe !== 0 && Fe !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var a = e.callbackNode;
      if (zs() && e.callbackNode !== a) return null;
      var l = ee;
      return (
        (l = ws(e, e === me ? l : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
        l === 0
          ? null
          : (Kx(e, l, t),
            sL(e, Bt()),
            e.callbackNode != null && e.callbackNode === a ? iL.bind(null, e) : null)
      );
    }
    function gh(e, t) {
      if (zs()) return null;
      Kx(e, t, !0);
    }
    function AI() {
      UI(function () {
        (oe & 6) !== 0 ? Mc(Kh, RI) : rL();
      });
    }
    function gd() {
      if (bl === 0) {
        var e = mn;
        (e === 0 && ((e = Lr), (Lr <<= 1), (Lr & 261888) === 0 && (Lr = 256)), (bl = e));
      }
      return bl;
    }
    function xh(e) {
      return e == null || typeof e == 'symbol' || typeof e == 'boolean'
        ? null
        : typeof e == 'function'
          ? e
          : _r('' + e);
    }
    function Lh(e, t) {
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
    function TI(e, t, a, l, o) {
      if (t === 'submit' && a && a.stateNode === o) {
        var n = xh((o[It] || null).action),
          u = l.submitter;
        u &&
          ((t = (t = u[It] || null) ? xh(t.formAction) : u.getAttribute('formAction')),
          t !== null && ((n = t), (u = null)));
        var r = new Rs('action', 'action', null, l, o);
        e.push({
          event: r,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (l.defaultPrevented) {
                  if (bl !== 0) {
                    var s = u ? Lh(o, u) : new FormData(o);
                    rc(a, { pending: !0, data: s, method: o.method, action: n }, null, s);
                  }
                } else
                  typeof n == 'function' &&
                    (r.preventDefault(),
                    (s = u ? Lh(o, u) : new FormData(o)),
                    rc(a, { pending: !0, data: s, method: o.method, action: n }, n, s));
              },
              currentTarget: o,
            },
          ],
        });
      }
    }
    for (Mr = 0; Mr < Zf.length; Mr++)
      ((Dr = Zf[Mr]),
        (Sh = Dr.toLowerCase()),
        (vh = Dr[0].toUpperCase() + Dr.slice(1)),
        sa(Sh, 'on' + vh));
    var Dr, Sh, vh, Mr;
    sa(yg, 'onAnimationEnd');
    sa(Cg, 'onAnimationIteration');
    sa(bg, 'onAnimationStart');
    sa('dblclick', 'onDoubleClick');
    sa('focusin', 'onFocus');
    sa('focusout', 'onBlur');
    sa(jb, 'onTransitionRun');
    sa(Yb, 'onTransitionStart');
    sa(Kb, 'onTransitionCancel');
    sa(Ig, 'onTransitionEnd');
    cn('onMouseEnter', ['mouseout', 'mouseover']);
    cn('onMouseLeave', ['mouseout', 'mouseover']);
    cn('onPointerEnter', ['pointerout', 'pointerover']);
    cn('onPointerLeave', ['pointerout', 'pointerover']);
    fo('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' '));
    fo(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    );
    fo('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
    fo('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' '));
    fo(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    );
    fo(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    );
    var Ou =
        'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
          ' ',
        ),
      kI = new Set(
        'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(Ou),
      );
    function fL(e, t) {
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
              } catch (h) {
                ts(h);
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
              } catch (h) {
                ts(h);
              }
              ((o.currentTarget = null), (n = s));
            }
        }
      }
    }
    function J(e, t) {
      var a = t[qf];
      a === void 0 && (a = t[qf] = new Set());
      var l = e + '__bubble';
      a.has(l) || (cL(t, e, 2, !1), a.add(l));
    }
    function kf(e, t, a) {
      var l = 0;
      (t && (l |= 4), cL(a, e, l, t));
    }
    var Er = '_reactListening' + Math.random().toString(36).slice(2);
    function xd(e) {
      if (!e[Er]) {
        ((e[Er] = !0),
          ag.forEach(function (a) {
            a !== 'selectionchange' && (kI.has(a) || kf(a, !1, e), kf(a, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[Er] || ((t[Er] = !0), kf('selectionchange', !1, t));
      }
    }
    function cL(e, t, a, l) {
      switch (IL(t)) {
        case 2:
          var o = l0;
          break;
        case 8:
          o = o0;
          break;
        default:
          o = yd;
      }
      ((a = o.bind(null, t, a, e)),
        (o = void 0),
        !jf || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (o = !0),
        l
          ? o !== void 0
            ? e.addEventListener(t, a, { capture: !0, passive: o })
            : e.addEventListener(t, a, !0)
          : o !== void 0
            ? e.addEventListener(t, a, { passive: o })
            : e.addEventListener(t, a, !1));
    }
    function Mf(e, t, a, l, o) {
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
              if (((u = jo(r)), u === null)) return;
              if (((s = u.tag), s === 5 || s === 6 || s === 26 || s === 27)) {
                l = n = u;
                continue e;
              }
              r = r.parentNode;
            }
          }
          l = l.return;
        }
      fg(function () {
        var i = n,
          h = Pc(a),
          m = [];
        e: {
          var f = wg.get(e);
          if (f !== void 0) {
            var p = Rs,
              L = e;
            switch (e) {
              case 'keypress':
                if (Hr(a) === 0) break e;
              case 'keydown':
              case 'keyup':
                p = Ib;
                break;
              case 'focusin':
                ((L = 'focus'), (p = rf));
                break;
              case 'focusout':
                ((L = 'blur'), (p = rf));
                break;
              case 'beforeblur':
              case 'afterblur':
                p = rf;
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
                p = Ap;
                break;
              case 'drag':
              case 'dragend':
              case 'dragenter':
              case 'dragexit':
              case 'dragleave':
              case 'dragover':
              case 'dragstart':
              case 'drop':
                p = db;
                break;
              case 'touchcancel':
              case 'touchend':
              case 'touchmove':
              case 'touchstart':
                p = Ab;
                break;
              case yg:
              case Cg:
              case bg:
                p = hb;
                break;
              case Ig:
                p = kb;
                break;
              case 'scroll':
              case 'scrollend':
                p = fb;
                break;
              case 'wheel':
                p = Db;
                break;
              case 'copy':
              case 'cut':
              case 'paste':
                p = xb;
                break;
              case 'gotpointercapture':
              case 'lostpointercapture':
              case 'pointercancel':
              case 'pointerdown':
              case 'pointermove':
              case 'pointerout':
              case 'pointerover':
              case 'pointerup':
                p = kp;
                break;
              case 'toggle':
              case 'beforetoggle':
                p = Ob;
            }
            var S = (t & 4) !== 0,
              v = !S && (e === 'scroll' || e === 'scrollend'),
              g = S ? (f !== null ? f + 'Capture' : null) : f;
            S = [];
            for (var d = i, c; d !== null;) {
              var x = d;
              if (
                ((c = x.stateNode),
                (x = x.tag),
                (x !== 5 && x !== 26 && x !== 27) ||
                  c === null ||
                  g === null ||
                  ((x = wu(d, g)), x != null && S.push(Bu(d, x, c))),
                v)
              )
                break;
              d = d.return;
            }
            0 < S.length && ((f = new p(f, L, null, a, h)), m.push({ event: f, listeners: S }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (
              ((f = e === 'mouseover' || e === 'pointerover'),
              (p = e === 'mouseout' || e === 'pointerout'),
              f && a !== Xf && (L = a.relatedTarget || a.fromElement) && (jo(L) || L[yn]))
            )
              break e;
            if (
              (p || f) &&
              ((f =
                h.window === h
                  ? h
                  : (f = h.ownerDocument)
                    ? f.defaultView || f.parentWindow
                    : window),
              p
                ? ((L = a.relatedTarget || a.toElement),
                  (p = i),
                  (L = L ? jo(L) : null),
                  L !== null &&
                    ((v = Hu(L)), (S = L.tag), L !== v || (S !== 5 && S !== 27 && S !== 6)) &&
                    (L = null))
                : ((p = null), (L = i)),
              p !== L)
            ) {
              if (
                ((S = Ap),
                (x = 'onMouseLeave'),
                (g = 'onMouseEnter'),
                (d = 'mouse'),
                (e === 'pointerout' || e === 'pointerover') &&
                  ((S = kp), (x = 'onPointerLeave'), (g = 'onPointerEnter'), (d = 'pointer')),
                (v = p == null ? f : su(p)),
                (c = L == null ? f : su(L)),
                (f = new S(x, d + 'leave', p, a, h)),
                (f.target = v),
                (f.relatedTarget = c),
                (x = null),
                jo(h) === i &&
                  ((S = new S(g, d + 'enter', L, a, h)),
                  (S.target = c),
                  (S.relatedTarget = v),
                  (x = S)),
                (v = x),
                p && L)
              )
                t: {
                  for (S = MI, g = p, d = L, c = 0, x = g; x; x = S(x)) c++;
                  x = 0;
                  for (var y = d; y; y = S(y)) x++;
                  for (; 0 < c - x;) ((g = S(g)), c--);
                  for (; 0 < x - c;) ((d = S(d)), x--);
                  for (; c--;) {
                    if (g === d || (d !== null && g === d.alternate)) {
                      S = g;
                      break t;
                    }
                    ((g = S(g)), (d = S(d)));
                  }
                  S = null;
                }
              else S = null;
              (p !== null && yh(m, f, p, S, !1), L !== null && v !== null && yh(m, v, L, S, !0));
            }
          }
          e: {
            if (
              ((f = i ? su(i) : window),
              (p = f.nodeName && f.nodeName.toLowerCase()),
              p === 'select' || (p === 'input' && f.type === 'file'))
            )
              var I = Op;
            else if (Ep(f))
              if (gg) I = Gb;
              else {
                I = qb;
                var b = Nb;
              }
            else
              ((p = f.nodeName),
                !p || p.toLowerCase() !== 'input' || (f.type !== 'checkbox' && f.type !== 'radio')
                  ? i && Bc(i.elementType) && (I = Op)
                  : (I = Fb));
            if (I && (I = I(e, i))) {
              hg(m, I, a, h);
              break e;
            }
            (b && b(e, f, i),
              e === 'focusout' &&
                i &&
                f.type === 'number' &&
                i.memoizedProps.value != null &&
                Vf(f, 'number', f.value));
          }
          switch (((b = i ? su(i) : window), e)) {
            case 'focusin':
              (Ep(b) || b.contentEditable === 'true') && ((Zo = b), (Yf = i), (mu = null));
              break;
            case 'focusout':
              mu = Yf = Zo = null;
              break;
            case 'mousedown':
              Kf = !0;
              break;
            case 'contextmenu':
            case 'mouseup':
            case 'dragend':
              ((Kf = !1), Up(m, a, h));
              break;
            case 'selectionchange':
              if (Xb) break;
            case 'keydown':
            case 'keyup':
              Up(m, a, h);
          }
          var C;
          if (Hc)
            e: {
              switch (e) {
                case 'compositionstart':
                  var R = 'onCompositionStart';
                  break e;
                case 'compositionend':
                  R = 'onCompositionEnd';
                  break e;
                case 'compositionupdate':
                  R = 'onCompositionUpdate';
                  break e;
              }
              R = void 0;
            }
          else
            Ko
              ? mg(e, a) && (R = 'onCompositionEnd')
              : e === 'keydown' && a.keyCode === 229 && (R = 'onCompositionStart');
          (R &&
            (dg &&
              a.locale !== 'ko' &&
              (Ko || R !== 'onCompositionStart'
                ? R === 'onCompositionEnd' && Ko && (C = cg())
                : ((vl = h), (_c = 'value' in vl ? vl.value : vl.textContent), (Ko = !0))),
            (b = Ls(i, R)),
            0 < b.length &&
              ((R = new Tp(R, e, null, a, h)),
              m.push({ event: R, listeners: b }),
              C ? (R.data = C) : ((C = pg(a)), C !== null && (R.data = C)))),
            (C = Pb ? _b(e, a) : Ub(e, a)) &&
              ((R = Ls(i, 'onBeforeInput')),
              0 < R.length &&
                ((b = new Tp('onBeforeInput', 'beforeinput', null, a, h)),
                m.push({ event: b, listeners: R }),
                (b.data = C))),
            TI(m, e, i, a, h));
        }
        fL(m, t);
      });
    }
    function Bu(e, t, a) {
      return { instance: e, listener: t, currentTarget: a };
    }
    function Ls(e, t) {
      for (var a = t + 'Capture', l = []; e !== null;) {
        var o = e,
          n = o.stateNode;
        if (
          ((o = o.tag),
          (o !== 5 && o !== 26 && o !== 27) ||
            n === null ||
            ((o = wu(e, a)),
            o != null && l.unshift(Bu(e, o, n)),
            (o = wu(e, t)),
            o != null && l.push(Bu(e, o, n))),
          e.tag === 3)
        )
          return l;
        e = e.return;
      }
      return [];
    }
    function MI(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function yh(e, t, a, l, o) {
      for (var n = t._reactName, u = []; a !== null && a !== l;) {
        var r = a,
          s = r.alternate,
          i = r.stateNode;
        if (((r = r.tag), s !== null && s === l)) break;
        ((r !== 5 && r !== 26 && r !== 27) ||
          i === null ||
          ((s = i),
          o
            ? ((i = wu(a, n)), i != null && u.unshift(Bu(a, i, s)))
            : o || ((i = wu(a, n)), i != null && u.push(Bu(a, i, s)))),
          (a = a.return));
      }
      u.length !== 0 && e.push({ event: t, listeners: u });
    }
    var DI = /\r\n?/g,
      EI = /\u0000|\uFFFD/g;
    function Ch(e) {
      return (typeof e == 'string' ? e : '' + e)
        .replace(
          DI,
          `
`,
        )
        .replace(EI, '');
    }
    function dL(e, t) {
      return ((t = Ch(t)), Ch(e) === t);
    }
    function fe(e, t, a, l, o, n) {
      switch (a) {
        case 'children':
          typeof l == 'string'
            ? t === 'body' || (t === 'textarea' && l === '') || dn(e, l)
            : (typeof l == 'number' || typeof l == 'bigint') && t !== 'body' && dn(e, '' + l);
          break;
        case 'className':
          yr(e, 'class', l);
          break;
        case 'tabIndex':
          yr(e, 'tabindex', l);
          break;
        case 'dir':
        case 'role':
        case 'viewBox':
        case 'width':
        case 'height':
          yr(e, a, l);
          break;
        case 'style':
          ig(e, l, n);
          break;
        case 'data':
          if (t !== 'object') {
            yr(e, 'data', l);
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
          ((l = _r('' + l)), e.setAttribute(a, l));
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
                ? (t !== 'input' && fe(e, t, 'name', o.name, o, null),
                  fe(e, t, 'formEncType', o.formEncType, o, null),
                  fe(e, t, 'formMethod', o.formMethod, o, null),
                  fe(e, t, 'formTarget', o.formTarget, o, null))
                : (fe(e, t, 'encType', o.encType, o, null),
                  fe(e, t, 'method', o.method, o, null),
                  fe(e, t, 'target', o.target, o, null)));
          if (l == null || typeof l == 'symbol' || typeof l == 'boolean') {
            e.removeAttribute(a);
            break;
          }
          ((l = _r('' + l)), e.setAttribute(a, l));
          break;
        case 'onClick':
          l != null && (e.onclick = Xa);
          break;
        case 'onScroll':
          l != null && J('scroll', e);
          break;
        case 'onScrollEnd':
          l != null && J('scrollend', e);
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
          ((a = _r('' + l)), e.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', a));
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
          (J('beforetoggle', e), J('toggle', e), Pr(e, 'popover', l));
          break;
        case 'xlinkActuate':
          Ua(e, 'http://www.w3.org/1999/xlink', 'xlink:actuate', l);
          break;
        case 'xlinkArcrole':
          Ua(e, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', l);
          break;
        case 'xlinkRole':
          Ua(e, 'http://www.w3.org/1999/xlink', 'xlink:role', l);
          break;
        case 'xlinkShow':
          Ua(e, 'http://www.w3.org/1999/xlink', 'xlink:show', l);
          break;
        case 'xlinkTitle':
          Ua(e, 'http://www.w3.org/1999/xlink', 'xlink:title', l);
          break;
        case 'xlinkType':
          Ua(e, 'http://www.w3.org/1999/xlink', 'xlink:type', l);
          break;
        case 'xmlBase':
          Ua(e, 'http://www.w3.org/XML/1998/namespace', 'xml:base', l);
          break;
        case 'xmlLang':
          Ua(e, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', l);
          break;
        case 'xmlSpace':
          Ua(e, 'http://www.w3.org/XML/1998/namespace', 'xml:space', l);
          break;
        case 'is':
          Pr(e, 'is', l);
          break;
        case 'innerText':
        case 'textContent':
          break;
        default:
          (!(2 < a.length) || (a[0] !== 'o' && a[0] !== 'O') || (a[1] !== 'n' && a[1] !== 'N')) &&
            ((a = sb.get(a) || a), Pr(e, a, l));
      }
    }
    function Lc(e, t, a, l, o, n) {
      switch (a) {
        case 'style':
          ig(e, l, n);
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
            ? dn(e, l)
            : (typeof l == 'number' || typeof l == 'bigint') && dn(e, '' + l);
          break;
        case 'onScroll':
          l != null && J('scroll', e);
          break;
        case 'onScrollEnd':
          l != null && J('scrollend', e);
          break;
        case 'onClick':
          l != null && (e.onclick = Xa);
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
          if (!lg.hasOwnProperty(a))
            e: {
              if (
                a[0] === 'o' &&
                a[1] === 'n' &&
                ((o = a.endsWith('Capture')),
                (t = a.slice(2, o ? a.length - 7 : void 0)),
                (n = e[It] || null),
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
              a in e ? (e[a] = l) : l === !0 ? e.setAttribute(a, '') : Pr(e, a, l);
            }
      }
    }
    function lt(e, t, a) {
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
          (J('error', e), J('load', e));
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
                    fe(e, t, n, u, a, null);
                }
            }
          (o && fe(e, t, 'srcSet', a.srcSet, a, null), l && fe(e, t, 'src', a.src, a, null));
          return;
        case 'input':
          J('invalid', e);
          var r = (n = u = o = null),
            s = null,
            i = null;
          for (l in a)
            if (a.hasOwnProperty(l)) {
              var h = a[l];
              if (h != null)
                switch (l) {
                  case 'name':
                    o = h;
                    break;
                  case 'type':
                    u = h;
                    break;
                  case 'checked':
                    s = h;
                    break;
                  case 'defaultChecked':
                    i = h;
                    break;
                  case 'value':
                    n = h;
                    break;
                  case 'defaultValue':
                    r = h;
                    break;
                  case 'children':
                  case 'dangerouslySetInnerHTML':
                    if (h != null) throw Error(w(137, t));
                    break;
                  default:
                    fe(e, t, l, h, a, null);
                }
            }
          ug(e, n, r, s, i, u, o, !1);
          return;
        case 'select':
          (J('invalid', e), (l = u = n = null));
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
                  fe(e, t, o, r, a, null);
              }
          ((t = n),
            (a = u),
            (e.multiple = !!l),
            t != null ? ln(e, !!l, t, !1) : a != null && ln(e, !!l, a, !0));
          return;
        case 'textarea':
          (J('invalid', e), (n = o = l = null));
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
                  fe(e, t, u, r, a, null);
              }
          sg(e, l, o, n);
          return;
        case 'option':
          for (s in a)
            a.hasOwnProperty(s) &&
              ((l = a[s]), l != null) &&
              (s === 'selected'
                ? (e.selected = l && typeof l != 'function' && typeof l != 'symbol')
                : fe(e, t, s, l, a, null));
          return;
        case 'dialog':
          (J('beforetoggle', e), J('toggle', e), J('cancel', e), J('close', e));
          break;
        case 'iframe':
        case 'object':
          J('load', e);
          break;
        case 'video':
        case 'audio':
          for (l = 0; l < Ou.length; l++) J(Ou[l], e);
          break;
        case 'image':
          (J('error', e), J('load', e));
          break;
        case 'details':
          J('toggle', e);
          break;
        case 'embed':
        case 'source':
        case 'link':
          (J('error', e), J('load', e));
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
                  fe(e, t, i, l, a, null);
              }
          return;
        default:
          if (Bc(t)) {
            for (h in a)
              a.hasOwnProperty(h) && ((l = a[h]), l !== void 0 && Lc(e, t, h, l, a, void 0));
            return;
          }
      }
      for (r in a) a.hasOwnProperty(r) && ((l = a[r]), l != null && fe(e, t, r, l, a, null));
    }
    function OI(e, t, a, l) {
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
            h = null;
          for (p in a) {
            var m = a[p];
            if (a.hasOwnProperty(p) && m != null)
              switch (p) {
                case 'checked':
                  break;
                case 'value':
                  break;
                case 'defaultValue':
                  s = m;
                default:
                  l.hasOwnProperty(p) || fe(e, t, p, null, l, m);
              }
          }
          for (var f in l) {
            var p = l[f];
            if (((m = a[f]), l.hasOwnProperty(f) && (p != null || m != null)))
              switch (f) {
                case 'type':
                  n = p;
                  break;
                case 'name':
                  o = p;
                  break;
                case 'checked':
                  i = p;
                  break;
                case 'defaultChecked':
                  h = p;
                  break;
                case 'value':
                  u = p;
                  break;
                case 'defaultValue':
                  r = p;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (p != null) throw Error(w(137, t));
                  break;
                default:
                  p !== m && fe(e, t, f, p, l, m);
              }
          }
          Gf(e, u, r, s, i, h, n, o);
          return;
        case 'select':
          p = u = r = f = null;
          for (n in a)
            if (((s = a[n]), a.hasOwnProperty(n) && s != null))
              switch (n) {
                case 'value':
                  break;
                case 'multiple':
                  p = s;
                default:
                  l.hasOwnProperty(n) || fe(e, t, n, null, l, s);
              }
          for (o in l)
            if (((n = l[o]), (s = a[o]), l.hasOwnProperty(o) && (n != null || s != null)))
              switch (o) {
                case 'value':
                  f = n;
                  break;
                case 'defaultValue':
                  r = n;
                  break;
                case 'multiple':
                  u = n;
                default:
                  n !== s && fe(e, t, o, n, l, s);
              }
          ((t = r),
            (a = u),
            (l = p),
            f != null
              ? ln(e, !!a, f, !1)
              : !!l != !!a && (t != null ? ln(e, !!a, t, !0) : ln(e, !!a, a ? [] : '', !1)));
          return;
        case 'textarea':
          p = f = null;
          for (r in a)
            if (((o = a[r]), a.hasOwnProperty(r) && o != null && !l.hasOwnProperty(r)))
              switch (r) {
                case 'value':
                  break;
                case 'children':
                  break;
                default:
                  fe(e, t, r, null, l, o);
              }
          for (u in l)
            if (((o = l[u]), (n = a[u]), l.hasOwnProperty(u) && (o != null || n != null)))
              switch (u) {
                case 'value':
                  f = o;
                  break;
                case 'defaultValue':
                  p = o;
                  break;
                case 'children':
                  break;
                case 'dangerouslySetInnerHTML':
                  if (o != null) throw Error(w(91));
                  break;
                default:
                  o !== n && fe(e, t, u, o, l, n);
              }
          rg(e, f, p);
          return;
        case 'option':
          for (var L in a)
            ((f = a[L]),
              a.hasOwnProperty(L) &&
                f != null &&
                !l.hasOwnProperty(L) &&
                (L === 'selected' ? (e.selected = !1) : fe(e, t, L, null, l, f)));
          for (s in l)
            ((f = l[s]),
              (p = a[s]),
              l.hasOwnProperty(s) &&
                f !== p &&
                (f != null || p != null) &&
                (s === 'selected'
                  ? (e.selected = f && typeof f != 'function' && typeof f != 'symbol')
                  : fe(e, t, s, f, l, p)));
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
          for (var S in a)
            ((f = a[S]),
              a.hasOwnProperty(S) && f != null && !l.hasOwnProperty(S) && fe(e, t, S, null, l, f));
          for (i in l)
            if (
              ((f = l[i]), (p = a[i]), l.hasOwnProperty(i) && f !== p && (f != null || p != null))
            )
              switch (i) {
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (f != null) throw Error(w(137, t));
                  break;
                default:
                  fe(e, t, i, f, l, p);
              }
          return;
        default:
          if (Bc(t)) {
            for (var v in a)
              ((f = a[v]),
                a.hasOwnProperty(v) &&
                  f !== void 0 &&
                  !l.hasOwnProperty(v) &&
                  Lc(e, t, v, void 0, l, f));
            for (h in l)
              ((f = l[h]),
                (p = a[h]),
                !l.hasOwnProperty(h) ||
                  f === p ||
                  (f === void 0 && p === void 0) ||
                  Lc(e, t, h, f, l, p));
            return;
          }
      }
      for (var g in a)
        ((f = a[g]),
          a.hasOwnProperty(g) && f != null && !l.hasOwnProperty(g) && fe(e, t, g, null, l, f));
      for (m in l)
        ((f = l[m]),
          (p = a[m]),
          !l.hasOwnProperty(m) || f === p || (f == null && p == null) || fe(e, t, m, f, l, p));
    }
    function bh(e) {
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
    function BI() {
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
          if (n && r && bh(u)) {
            for (u = 0, r = o.responseEnd, l += 1; l < a.length; l++) {
              var s = a[l],
                i = s.startTime;
              if (i > r) break;
              var h = s.transferSize,
                m = s.initiatorType;
              h && bh(m) && ((s = s.responseEnd), (u += h * (s < r ? 1 : (r - i) / (s - i))));
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
    var Sc = null,
      vc = null;
    function Ss(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Ih(e) {
      switch (e) {
        case 'http://www.w3.org/2000/svg':
          return 1;
        case 'http://www.w3.org/1998/Math/MathML':
          return 2;
        default:
          return 0;
      }
    }
    function mL(e, t) {
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
    function yc(e, t) {
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
    var Df = null;
    function PI() {
      var e = window.event;
      return e && e.type === 'popstate' ? (e === Df ? !1 : ((Df = e), !0)) : ((Df = null), !1);
    }
    var pL = typeof setTimeout == 'function' ? setTimeout : void 0,
      _I = typeof clearTimeout == 'function' ? clearTimeout : void 0,
      wh = typeof Promise == 'function' ? Promise : void 0,
      UI =
        typeof queueMicrotask == 'function'
          ? queueMicrotask
          : typeof wh < 'u'
            ? function (e) {
                return wh.resolve(null).then(e).catch(HI);
              }
            : pL;
    function HI(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Hl(e) {
      return e === 'head';
    }
    function Rh(e, t) {
      var a = t,
        l = 0;
      do {
        var o = a.nextSibling;
        if ((e.removeChild(a), o && o.nodeType === 8))
          if (((a = o.data), a === '/$' || a === '/&')) {
            if (l === 0) {
              (e.removeChild(o), vn(t));
              return;
            }
            l--;
          } else if (a === '$' || a === '$?' || a === '$~' || a === '$!' || a === '&') l++;
          else if (a === 'html') bu(e.ownerDocument.documentElement);
          else if (a === 'head') {
            ((a = e.ownerDocument.head), bu(a));
            for (var n = a.firstChild; n;) {
              var u = n.nextSibling,
                r = n.nodeName;
              (n[Fu] ||
                r === 'SCRIPT' ||
                r === 'STYLE' ||
                (r === 'LINK' && n.rel.toLowerCase() === 'stylesheet') ||
                a.removeChild(n),
                (n = u));
            }
          } else a === 'body' && bu(e.ownerDocument.body);
        a = o;
      } while (a);
      vn(t);
    }
    function Ah(e, t) {
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
    function Cc(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
        var a = t;
        switch (((t = t.nextSibling), a.nodeName)) {
          case 'HTML':
          case 'HEAD':
          case 'BODY':
            (Cc(a), Oc(a));
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
    function zI(e, t, a, l) {
      for (; e.nodeType === 1;) {
        var o = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!l && (e.nodeName !== 'INPUT' || e.type !== 'hidden')) break;
        } else if (l) {
          if (!e[Fu])
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
        if (((e = ea(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function NI(e, t, a) {
      if (t === '') return null;
      for (; e.nodeType !== 3;)
        if (
          ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !a) ||
          ((e = ea(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function hL(e, t) {
      for (; e.nodeType !== 8;)
        if (
          ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !t) ||
          ((e = ea(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function bc(e) {
      return e.data === '$?' || e.data === '$~';
    }
    function Ic(e) {
      return e.data === '$!' || (e.data === '$?' && e.ownerDocument.readyState !== 'loading');
    }
    function qI(e, t) {
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
    function ea(e) {
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
    var wc = null;
    function Th(e) {
      e = e.nextSibling;
      for (var t = 0; e;) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === '/$' || a === '/&') {
            if (t === 0) return ea(e.nextSibling);
            t--;
          } else (a !== '$' && a !== '$!' && a !== '$?' && a !== '$~' && a !== '&') || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function kh(e) {
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
    function gL(e, t, a) {
      switch (((t = Ss(a)), e)) {
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
    function bu(e) {
      for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
      Oc(e);
    }
    var ta = new Map(),
      Mh = new Set();
    function vs(e) {
      return typeof e.getRootNode == 'function'
        ? e.getRootNode()
        : e.nodeType === 9
          ? e
          : e.ownerDocument;
    }
    var tl = ne.d;
    ne.d = { f: FI, r: GI, D: VI, C: XI, L: jI, m: YI, X: ZI, S: KI, M: QI };
    function FI() {
      var e = tl.f(),
        t = Us();
      return e || t;
    }
    function GI(e) {
      var t = Cn(e);
      t !== null && t.tag === 5 && t.type === 'form' ? ix(t) : tl.r(e);
    }
    var Rn = typeof document > 'u' ? null : document;
    function xL(e, t, a) {
      var l = Rn;
      if (l && typeof t == 'string' && t) {
        var o = Qt(t);
        ((o = 'link[rel="' + e + '"][href="' + o + '"]'),
          typeof a == 'string' && (o += '[crossorigin="' + a + '"]'),
          Mh.has(o) ||
            (Mh.add(o),
            (e = { rel: e, crossOrigin: a, href: t }),
            l.querySelector(o) === null &&
              ((t = l.createElement('link')), lt(t, 'link', e), Ke(t), l.head.appendChild(t))));
      }
    }
    function VI(e) {
      (tl.D(e), xL('dns-prefetch', e, null));
    }
    function XI(e, t) {
      (tl.C(e, t), xL('preconnect', e, t));
    }
    function jI(e, t, a) {
      tl.L(e, t, a);
      var l = Rn;
      if (l && e && t) {
        var o = 'link[rel="preload"][as="' + Qt(t) + '"]';
        t === 'image' && a && a.imageSrcSet
          ? ((o += '[imagesrcset="' + Qt(a.imageSrcSet) + '"]'),
            typeof a.imageSizes == 'string' && (o += '[imagesizes="' + Qt(a.imageSizes) + '"]'))
          : (o += '[href="' + Qt(e) + '"]');
        var n = o;
        switch (t) {
          case 'style':
            n = Sn(e);
            break;
          case 'script':
            n = An(e);
        }
        ta.has(n) ||
          ((e = ye(
            { rel: 'preload', href: t === 'image' && a && a.imageSrcSet ? void 0 : e, as: t },
            a,
          )),
          ta.set(n, e),
          l.querySelector(o) !== null ||
            (t === 'style' && l.querySelector(Ku(n))) ||
            (t === 'script' && l.querySelector(Zu(n))) ||
            ((t = l.createElement('link')), lt(t, 'link', e), Ke(t), l.head.appendChild(t)));
      }
    }
    function YI(e, t) {
      tl.m(e, t);
      var a = Rn;
      if (a && e) {
        var l = t && typeof t.as == 'string' ? t.as : 'script',
          o = 'link[rel="modulepreload"][as="' + Qt(l) + '"][href="' + Qt(e) + '"]',
          n = o;
        switch (l) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            n = An(e);
        }
        if (
          !ta.has(n) &&
          ((e = ye({ rel: 'modulepreload', href: e }, t)),
          ta.set(n, e),
          a.querySelector(o) === null)
        ) {
          switch (l) {
            case 'audioworklet':
            case 'paintworklet':
            case 'serviceworker':
            case 'sharedworker':
            case 'worker':
            case 'script':
              if (a.querySelector(Zu(n))) return;
          }
          ((l = a.createElement('link')), lt(l, 'link', e), Ke(l), a.head.appendChild(l));
        }
      }
    }
    function KI(e, t, a) {
      tl.S(e, t, a);
      var l = Rn;
      if (l && e) {
        var o = an(l).hoistableStyles,
          n = Sn(e);
        t = t || 'default';
        var u = o.get(n);
        if (!u) {
          var r = { loading: 0, preload: null };
          if ((u = l.querySelector(Ku(n)))) r.loading = 5;
          else {
            ((e = ye({ rel: 'stylesheet', href: e, 'data-precedence': t }, a)),
              (a = ta.get(n)) && Ld(e, a));
            var s = (u = l.createElement('link'));
            (Ke(s),
              lt(s, 'link', e),
              (s._p = new Promise(function (i, h) {
                ((s.onload = i), (s.onerror = h));
              })),
              s.addEventListener('load', function () {
                r.loading |= 1;
              }),
              s.addEventListener('error', function () {
                r.loading |= 2;
              }),
              (r.loading |= 4),
              jr(u, t, l));
          }
          ((u = { type: 'stylesheet', instance: u, count: 1, state: r }), o.set(n, u));
        }
      }
    }
    function ZI(e, t) {
      tl.X(e, t);
      var a = Rn;
      if (a && e) {
        var l = an(a).hoistableScripts,
          o = An(e),
          n = l.get(o);
        n ||
          ((n = a.querySelector(Zu(o))),
          n ||
            ((e = ye({ src: e, async: !0 }, t)),
            (t = ta.get(o)) && Sd(e, t),
            (n = a.createElement('script')),
            Ke(n),
            lt(n, 'link', e),
            a.head.appendChild(n)),
          (n = { type: 'script', instance: n, count: 1, state: null }),
          l.set(o, n));
      }
    }
    function QI(e, t) {
      tl.M(e, t);
      var a = Rn;
      if (a && e) {
        var l = an(a).hoistableScripts,
          o = An(e),
          n = l.get(o);
        n ||
          ((n = a.querySelector(Zu(o))),
          n ||
            ((e = ye({ src: e, async: !0, type: 'module' }, t)),
            (t = ta.get(o)) && Sd(e, t),
            (n = a.createElement('script')),
            Ke(n),
            lt(n, 'link', e),
            a.head.appendChild(n)),
          (n = { type: 'script', instance: n, count: 1, state: null }),
          l.set(o, n));
      }
    }
    function Dh(e, t, a, l) {
      var o = (o = Il.current) ? vs(o) : null;
      if (!o) throw Error(w(446));
      switch (e) {
        case 'meta':
        case 'title':
          return null;
        case 'style':
          return typeof a.precedence == 'string' && typeof a.href == 'string'
            ? ((t = Sn(a.href)),
              (a = an(o).hoistableStyles),
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
            e = Sn(a.href);
            var n = an(o).hoistableStyles,
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
                (n = o.querySelector(Ku(e))) && !n._p && ((u.instance = n), (u.state.loading = 5)),
                ta.has(e) ||
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
                  ta.set(e, a),
                  n || WI(o, e, a, u.state))),
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
              ? ((t = An(a)),
                (a = an(o).hoistableScripts),
                (l = a.get(t)),
                l || ((l = { type: 'script', instance: null, count: 0, state: null }), a.set(t, l)),
                l)
              : { type: 'void', instance: null, count: 0, state: null }
          );
        default:
          throw Error(w(444, e));
      }
    }
    function Sn(e) {
      return 'href="' + Qt(e) + '"';
    }
    function Ku(e) {
      return 'link[rel="stylesheet"][' + e + ']';
    }
    function LL(e) {
      return ye({}, e, { 'data-precedence': e.precedence, precedence: null });
    }
    function WI(e, t, a, l) {
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
          lt(t, 'link', a),
          Ke(t),
          e.head.appendChild(t));
    }
    function An(e) {
      return '[src="' + Qt(e) + '"]';
    }
    function Zu(e) {
      return 'script[async]' + e;
    }
    function Eh(e, t, a) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case 'style':
            var l = e.querySelector('style[data-href~="' + Qt(a.href) + '"]');
            if (l) return ((t.instance = l), Ke(l), l);
            var o = ye({}, a, {
              'data-href': a.href,
              'data-precedence': a.precedence,
              href: null,
              precedence: null,
            });
            return (
              (l = (e.ownerDocument || e).createElement('style')),
              Ke(l),
              lt(l, 'style', o),
              jr(l, a.precedence, e),
              (t.instance = l)
            );
          case 'stylesheet':
            o = Sn(a.href);
            var n = e.querySelector(Ku(o));
            if (n) return ((t.state.loading |= 4), (t.instance = n), Ke(n), n);
            ((l = LL(a)),
              (o = ta.get(o)) && Ld(l, o),
              (n = (e.ownerDocument || e).createElement('link')),
              Ke(n));
            var u = n;
            return (
              (u._p = new Promise(function (r, s) {
                ((u.onload = r), (u.onerror = s));
              })),
              lt(n, 'link', l),
              (t.state.loading |= 4),
              jr(n, a.precedence, e),
              (t.instance = n)
            );
          case 'script':
            return (
              (n = An(a.src)),
              (o = e.querySelector(Zu(n)))
                ? ((t.instance = o), Ke(o), o)
                : ((l = a),
                  (o = ta.get(n)) && ((l = ye({}, a)), Sd(l, o)),
                  (e = e.ownerDocument || e),
                  (o = e.createElement('script')),
                  Ke(o),
                  lt(o, 'link', l),
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
          ((l = t.instance), (t.state.loading |= 4), jr(l, a.precedence, e));
      return t.instance;
    }
    function jr(e, t, a) {
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
    function Ld(e, t) {
      (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
        e.title == null && (e.title = t.title));
    }
    function Sd(e, t) {
      (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
        e.integrity == null && (e.integrity = t.integrity));
    }
    var Yr = null;
    function Oh(e, t, a) {
      if (Yr === null) {
        var l = new Map(),
          o = (Yr = new Map());
        o.set(a, l);
      } else ((o = Yr), (l = o.get(a)), l || ((l = new Map()), o.set(a, l)));
      if (l.has(e)) return l;
      for (l.set(e, null), a = a.getElementsByTagName(e), o = 0; o < a.length; o++) {
        var n = a[o];
        if (
          !(n[Fu] || n[et] || (e === 'link' && n.getAttribute('rel') === 'stylesheet')) &&
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
    function Bh(e, t, a) {
      ((e = e.ownerDocument || e),
        e.head.insertBefore(a, t === 'title' ? e.querySelector('head > title') : null));
    }
    function JI(e, t, a) {
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
    function SL(e) {
      return !(e.type === 'stylesheet' && (e.state.loading & 3) === 0);
    }
    function $I(e, t, a, l) {
      if (
        a.type === 'stylesheet' &&
        (typeof l.media != 'string' || matchMedia(l.media).matches !== !1) &&
        (a.state.loading & 4) === 0
      ) {
        if (a.instance === null) {
          var o = Sn(l.href),
            n = t.querySelector(Ku(o));
          if (n) {
            ((t = n._p),
              t !== null &&
                typeof t == 'object' &&
                typeof t.then == 'function' &&
                (e.count++, (e = ys.bind(e)), t.then(e, e)),
              (a.state.loading |= 4),
              (a.instance = n),
              Ke(n));
            return;
          }
          ((n = t.ownerDocument || t),
            (l = LL(l)),
            (o = ta.get(o)) && Ld(l, o),
            (n = n.createElement('link')),
            Ke(n));
          var u = n;
          ((u._p = new Promise(function (r, s) {
            ((u.onload = r), (u.onerror = s));
          })),
            lt(n, 'link', l),
            (a.instance = n));
        }
        (e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(a, t),
          (t = a.state.preload) &&
            (a.state.loading & 3) === 0 &&
            (e.count++,
            (a = ys.bind(e)),
            t.addEventListener('load', a),
            t.addEventListener('error', a)));
      }
    }
    var Ef = 0;
    function e0(e, t) {
      return (
        e.stylesheets && e.count === 0 && Kr(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (a) {
              var l = setTimeout(function () {
                if ((e.stylesheets && Kr(e, e.stylesheets), e.unsuspend)) {
                  var n = e.unsuspend;
                  ((e.unsuspend = null), n());
                }
              }, 6e4 + t);
              0 < e.imgBytes && Ef === 0 && (Ef = 62500 * BI());
              var o = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 && (e.stylesheets && Kr(e, e.stylesheets), e.unsuspend))
                  ) {
                    var n = e.unsuspend;
                    ((e.unsuspend = null), n());
                  }
                },
                (e.imgBytes > Ef ? 50 : 800) + t,
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
    function ys() {
      if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
        if (this.stylesheets) Kr(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          ((this.unsuspend = null), e());
        }
      }
    }
    var Cs = null;
    function Kr(e, t) {
      ((e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++, (Cs = new Map()), t.forEach(t0, e), (Cs = null), ys.call(e)));
    }
    function t0(e, t) {
      if (!(t.state.loading & 4)) {
        var a = Cs.get(e);
        if (a) var l = a.get(null);
        else {
          ((a = new Map()), Cs.set(e, a));
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
          (l = ys.bind(this)),
          o.addEventListener('load', l),
          o.addEventListener('error', l),
          n
            ? n.parentNode.insertBefore(o, n.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(o, e.firstChild)),
          (t.state.loading |= 4));
      }
    }
    var Pu = {
      $$typeof: Va,
      Provider: null,
      Consumer: null,
      _currentValue: eo,
      _currentValue2: eo,
      _threadCount: 0,
    };
    function a0(e, t, a, l, o, n, u, r, s) {
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
        (this.expirationTimes = lf(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = lf(0)),
        (this.hiddenUpdates = lf(null)),
        (this.identifierPrefix = l),
        (this.onUncaughtError = o),
        (this.onCaughtError = n),
        (this.onRecoverableError = u),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = s),
        (this.incompleteTransitions = new Map()));
    }
    function vL(e, t, a, l, o, n, u, r, s, i, h, m) {
      return (
        (e = new a0(e, t, a, u, s, i, h, m, r)),
        (t = 1),
        n === !0 && (t |= 24),
        (n = Et(3, null, null, t)),
        (e.current = n),
        (n.stateNode = e),
        (t = Xc()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (n.memoizedState = { element: l, isDehydrated: a, cache: t }),
        Kc(n),
        e
      );
    }
    function yL(e) {
      return e ? ((e = Jo), e) : Jo;
    }
    function CL(e, t, a, l, o, n) {
      ((o = yL(o)),
        l.context === null ? (l.context = o) : (l.pendingContext = o),
        (l = Rl(t)),
        (l.payload = { element: a }),
        (n = n === void 0 ? null : n),
        n !== null && (l.callback = n),
        (a = Al(e, l, t)),
        a !== null && (bt(a, e, t), hu(a, e, t)));
    }
    function Ph(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function vd(e, t) {
      (Ph(e, t), (e = e.alternate) && Ph(e, t));
    }
    function bL(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = po(e, 67108864);
        (t !== null && bt(t, e, 67108864), vd(e, 67108864));
      }
    }
    function _h(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Ut();
        t = Dc(t);
        var a = po(e, t);
        (a !== null && bt(a, e, t), vd(e, t));
      }
    }
    var bs = !0;
    function l0(e, t, a, l) {
      var o = _.T;
      _.T = null;
      var n = ne.p;
      try {
        ((ne.p = 2), yd(e, t, a, l));
      } finally {
        ((ne.p = n), (_.T = o));
      }
    }
    function o0(e, t, a, l) {
      var o = _.T;
      _.T = null;
      var n = ne.p;
      try {
        ((ne.p = 8), yd(e, t, a, l));
      } finally {
        ((ne.p = n), (_.T = o));
      }
    }
    function yd(e, t, a, l) {
      if (bs) {
        var o = Rc(l);
        if (o === null) (Mf(e, t, l, Is, a), Uh(e, l));
        else if (u0(o, e, t, a, l)) l.stopPropagation();
        else if ((Uh(e, l), t & 4 && -1 < n0.indexOf(e))) {
          for (; o !== null;) {
            var n = Cn(o);
            if (n !== null)
              switch (n.tag) {
                case 3:
                  if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                    var u = Wl(n.pendingLanes);
                    if (u !== 0) {
                      var r = n;
                      for (r.pendingLanes |= 2, r.entangledLanes |= 2; u;) {
                        var s = 1 << (31 - _t(u));
                        ((r.entanglements[1] |= s), (u &= ~s));
                      }
                      (ka(n), (oe & 6) === 0 && ((ms = Bt() + 500), Yu(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((r = po(n, 2)), r !== null && bt(r, n, 2), Us(), vd(n, 2));
              }
            if (((n = Rc(l)), n === null && Mf(e, t, l, Is, a), n === o)) break;
            o = n;
          }
          o !== null && l.stopPropagation();
        } else Mf(e, t, l, null, a);
      }
    }
    function Rc(e) {
      return ((e = Pc(e)), Cd(e));
    }
    var Is = null;
    function Cd(e) {
      if (((Is = null), (e = jo(e)), e !== null)) {
        var t = Hu(e);
        if (t === null) e = null;
        else {
          var a = t.tag;
          if (a === 13) {
            if (((e = Gh(t)), e !== null)) return e;
            e = null;
          } else if (a === 31) {
            if (((e = Vh(t)), e !== null)) return e;
            e = null;
          } else if (a === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((Is = e), null);
    }
    function IL(e) {
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
          switch (jC()) {
            case Kh:
              return 2;
            case Zh:
              return 8;
            case $r:
            case YC:
              return 32;
            case Qh:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Ac = !1,
      Ml = null,
      Dl = null,
      El = null,
      _u = new Map(),
      Uu = new Map(),
      Ll = [],
      n0 =
        'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
          ' ',
        );
    function Uh(e, t) {
      switch (e) {
        case 'focusin':
        case 'focusout':
          Ml = null;
          break;
        case 'dragenter':
        case 'dragleave':
          Dl = null;
          break;
        case 'mouseover':
        case 'mouseout':
          El = null;
          break;
        case 'pointerover':
        case 'pointerout':
          _u.delete(t.pointerId);
          break;
        case 'gotpointercapture':
        case 'lostpointercapture':
          Uu.delete(t.pointerId);
      }
    }
    function ou(e, t, a, l, o, n) {
      return e === null || e.nativeEvent !== n
        ? ((e = {
            blockedOn: t,
            domEventName: a,
            eventSystemFlags: l,
            nativeEvent: n,
            targetContainers: [o],
          }),
          t !== null && ((t = Cn(t)), t !== null && bL(t)),
          e)
        : ((e.eventSystemFlags |= l),
          (t = e.targetContainers),
          o !== null && t.indexOf(o) === -1 && t.push(o),
          e);
    }
    function u0(e, t, a, l, o) {
      switch (t) {
        case 'focusin':
          return ((Ml = ou(Ml, e, t, a, l, o)), !0);
        case 'dragenter':
          return ((Dl = ou(Dl, e, t, a, l, o)), !0);
        case 'mouseover':
          return ((El = ou(El, e, t, a, l, o)), !0);
        case 'pointerover':
          var n = o.pointerId;
          return (_u.set(n, ou(_u.get(n) || null, e, t, a, l, o)), !0);
        case 'gotpointercapture':
          return ((n = o.pointerId), Uu.set(n, ou(Uu.get(n) || null, e, t, a, l, o)), !0);
      }
      return !1;
    }
    function wL(e) {
      var t = jo(e.target);
      if (t !== null) {
        var a = Hu(t);
        if (a !== null) {
          if (((t = a.tag), t === 13)) {
            if (((t = Gh(a)), t !== null)) {
              ((e.blockedOn = t),
                vp(e.priority, function () {
                  _h(a);
                }));
              return;
            }
          } else if (t === 31) {
            if (((t = Vh(a)), t !== null)) {
              ((e.blockedOn = t),
                vp(e.priority, function () {
                  _h(a);
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
    function Zr(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length;) {
        var a = Rc(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var l = new a.constructor(a.type, a);
          ((Xf = l), a.target.dispatchEvent(l), (Xf = null));
        } else return ((t = Cn(a)), t !== null && bL(t), (e.blockedOn = a), !1);
        t.shift();
      }
      return !0;
    }
    function Hh(e, t, a) {
      Zr(e) && a.delete(t);
    }
    function r0() {
      ((Ac = !1),
        Ml !== null && Zr(Ml) && (Ml = null),
        Dl !== null && Zr(Dl) && (Dl = null),
        El !== null && Zr(El) && (El = null),
        _u.forEach(Hh),
        Uu.forEach(Hh));
    }
    function Or(e, t) {
      e.blockedOn === t &&
        ((e.blockedOn = null),
        Ac || ((Ac = !0), Ge.unstable_scheduleCallback(Ge.unstable_NormalPriority, r0)));
    }
    var Br = null;
    function zh(e) {
      Br !== e &&
        ((Br = e),
        Ge.unstable_scheduleCallback(Ge.unstable_NormalPriority, function () {
          Br === e && (Br = null);
          for (var t = 0; t < e.length; t += 3) {
            var a = e[t],
              l = e[t + 1],
              o = e[t + 2];
            if (typeof l != 'function') {
              if (Cd(l || a) === null) continue;
              break;
            }
            var n = Cn(a);
            n !== null &&
              (e.splice(t, 3),
              (t -= 3),
              rc(n, { pending: !0, data: o, method: a.method, action: l }, l, o));
          }
        }));
    }
    function vn(e) {
      function t(s) {
        return Or(s, e);
      }
      (Ml !== null && Or(Ml, e),
        Dl !== null && Or(Dl, e),
        El !== null && Or(El, e),
        _u.forEach(t),
        Uu.forEach(t));
      for (var a = 0; a < Ll.length; a++) {
        var l = Ll[a];
        l.blockedOn === e && (l.blockedOn = null);
      }
      for (; 0 < Ll.length && ((a = Ll[0]), a.blockedOn === null);)
        (wL(a), a.blockedOn === null && Ll.shift());
      if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
        for (l = 0; l < a.length; l += 3) {
          var o = a[l],
            n = a[l + 1],
            u = o[It] || null;
          if (typeof n == 'function') u || zh(a);
          else if (u) {
            var r = null;
            if (n && n.hasAttribute('formAction')) {
              if (((o = n), (u = n[It] || null))) r = u.formAction;
              else if (Cd(o) !== null) continue;
            } else r = u.action;
            (typeof r == 'function' ? (a[l + 1] = r) : (a.splice(l, 3), (l -= 3)), zh(a));
          }
        }
    }
    function RL() {
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
    function bd(e) {
      this._internalRoot = e;
    }
    Ns.prototype.render = bd.prototype.render = function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(w(409));
      var a = t.current,
        l = Ut();
      CL(a, l, e, t, null, null);
    };
    Ns.prototype.unmount = bd.prototype.unmount = function () {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        (CL(e.current, 2, null, e, null, null), Us(), (t[yn] = null));
      }
    };
    function Ns(e) {
      this._internalRoot = e;
    }
    Ns.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = tg();
        e = { blockedOn: null, target: e, priority: t };
        for (var a = 0; a < Ll.length && t !== 0 && t < Ll[a].priority; a++);
        (Ll.splice(a, 0, e), a === 0 && wL(e));
      }
    };
    var Nh = qh.version;
    if (Nh !== '19.2.8') throw Error(w(527, Nh, '19.2.8'));
    ne.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == 'function'
          ? Error(w(188))
          : ((e = Object.keys(e).join(',')), Error(w(268, e)));
      return (
        (e = zC(t)),
        (e = e !== null ? Xh(e) : null),
        (e = e === null ? null : e.stateNode),
        e
      );
    };
    var s0 = {
      bundleType: 0,
      version: '19.2.8',
      rendererPackageName: 'react-dom',
      currentDispatcherRef: _,
      reconcilerVersion: '19.2.8',
    };
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u' &&
      ((nu = __REACT_DEVTOOLS_GLOBAL_HOOK__), !nu.isDisabled && nu.supportsFiber)
    )
      try {
        ((zu = nu.inject(s0)), (Pt = nu));
      } catch {}
    var nu;
    qs.createRoot = function (e, t) {
      if (!Fh(e)) throw Error(w(299));
      var a = !1,
        l = '',
        o = xx,
        n = Lx,
        u = Sx;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (a = !0),
          t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
          t.onCaughtError !== void 0 && (n = t.onCaughtError),
          t.onRecoverableError !== void 0 && (u = t.onRecoverableError)),
        (t = vL(e, 1, !1, null, null, a, l, null, o, n, u, RL)),
        (e[yn] = t.current),
        xd(e),
        new bd(t)
      );
    };
    qs.hydrateRoot = function (e, t, a) {
      if (!Fh(e)) throw Error(w(299));
      var l = !1,
        o = '',
        n = xx,
        u = Lx,
        r = Sx,
        s = null;
      return (
        a != null &&
          (a.unstable_strictMode === !0 && (l = !0),
          a.identifierPrefix !== void 0 && (o = a.identifierPrefix),
          a.onUncaughtError !== void 0 && (n = a.onUncaughtError),
          a.onCaughtError !== void 0 && (u = a.onCaughtError),
          a.onRecoverableError !== void 0 && (r = a.onRecoverableError),
          a.formState !== void 0 && (s = a.formState)),
        (t = vL(e, 1, !0, t, a ?? null, l, o, s, n, u, r, RL)),
        (t.context = yL(null)),
        (a = t.current),
        (l = Ut()),
        (l = Dc(l)),
        (o = Rl(l)),
        (o.callback = null),
        Al(a, o, l),
        (a = l),
        (t.current.lanes = a),
        qu(t, a),
        ka(t),
        (e[yn] = t.current),
        xd(e),
        new Ns(t)
      );
    };
    qs.version = '19.2.8';
  });
  var ML = Ca((c1, kL) => {
    'use strict';
    function TL() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(TL);
        } catch (e) {
          console.error(e);
        }
    }
    (TL(), (kL.exports = AL()));
  });
  var $L = Ca((Xs) => {
    'use strict';
    var $0 = Symbol.for('react.transitional.element'),
      ew = Symbol.for('react.fragment');
    function JL(e, t, a) {
      var l = null;
      if ((a !== void 0 && (l = '' + a), t.key !== void 0 && (l = '' + t.key), 'key' in t)) {
        a = {};
        for (var o in t) o !== 'key' && (a[o] = t[o]);
      } else a = t;
      return (
        (t = a.ref),
        { $$typeof: $0, type: e, key: l, ref: t !== void 0 ? t : null, props: a }
      );
    }
    Xs.Fragment = ew;
    Xs.jsx = JL;
    Xs.jsxs = JL;
  });
  var G = Ca((L1, eS) => {
    'use strict';
    eS.exports = $L();
  });
  var a1 = {},
    cC = A(ML(), 1);
  var ya = A(P(), 1);
  var Tn = A(P(), 1);
  function DL(e) {
    var t,
      a,
      l = '';
    if (typeof e == 'string' || typeof e == 'number') l += e;
    else if (typeof e == 'object')
      if (Array.isArray(e)) {
        var o = e.length;
        for (t = 0; t < o; t++) e[t] && (a = DL(e[t])) && (l && (l += ' '), (l += a));
      } else for (a in e) e[a] && (l && (l += ' '), (l += a));
    return l;
  }
  function Fs() {
    for (var e, t, a = 0, l = '', o = arguments.length; a < o; a++)
      (e = arguments[a]) && (t = DL(e)) && (l && (l += ' '), (l += t));
    return l;
  }
  var i0 = (e, t) => {
      let a = new Array(e.length + t.length);
      for (let l = 0; l < e.length; l++) a[l] = e[l];
      for (let l = 0; l < t.length; l++) a[e.length + l] = t[l];
      return a;
    },
    f0 = (e, t) => ({ classGroupId: e, validator: t }),
    UL = (e = new Map(), t = null, a) => ({ nextPart: e, validators: t, classGroupId: a });
  var EL = [],
    c0 = 'arbitrary..',
    d0 = (e) => {
      let t = p0(e),
        { conflictingClassGroups: a, conflictingClassGroupModifiers: l } = e;
      return {
        getClassGroupId: (u) => {
          if (u.startsWith('[') && u.endsWith(']')) return m0(u);
          let r = u.split('-'),
            s = r[0] === '' && r.length > 1 ? 1 : 0;
          return HL(r, s, t);
        },
        getConflictingClassGroupIds: (u, r) => {
          if (r) {
            let s = l[u],
              i = a[u];
            return s ? (i ? i0(i, s) : s) : i || EL;
          }
          return a[u] || EL;
        },
      };
    },
    HL = (e, t, a) => {
      if (e.length - t === 0) return a.classGroupId;
      let o = e[t],
        n = a.nextPart.get(o);
      if (n) {
        let i = HL(e, t + 1, n);
        if (i) return i;
      }
      let u = a.validators;
      if (u === null) return;
      let r = t === 0 ? e.join('-') : e.slice(t).join('-'),
        s = u.length;
      for (let i = 0; i < s; i++) {
        let h = u[i];
        if (h.validator(r)) return h.classGroupId;
      }
    },
    m0 = (e) =>
      e.slice(1, -1).indexOf(':') === -1
        ? void 0
        : (() => {
            let t = e.slice(1, -1),
              a = t.indexOf(':'),
              l = t.slice(0, a);
            return l ? c0 + l : void 0;
          })(),
    p0 = (e) => {
      let { theme: t, classGroups: a } = e;
      return h0(a, t);
    },
    h0 = (e, t) => {
      let a = UL();
      for (let l in e) {
        let o = e[l];
        wd(o, a, l, t);
      }
      return a;
    },
    wd = (e, t, a, l) => {
      let o = e.length;
      for (let n = 0; n < o; n++) {
        let u = e[n];
        g0(u, t, a, l);
      }
    },
    g0 = (e, t, a, l) => {
      if (typeof e == 'string') {
        x0(e, t, a);
        return;
      }
      if (typeof e == 'function') {
        L0(e, t, a, l);
        return;
      }
      S0(e, t, a, l);
    },
    x0 = (e, t, a) => {
      let l = e === '' ? t : zL(t, e);
      l.classGroupId = a;
    },
    L0 = (e, t, a, l) => {
      if (v0(e)) {
        wd(e(l), t, a, l);
        return;
      }
      (t.validators === null && (t.validators = []), t.validators.push(f0(a, e)));
    },
    S0 = (e, t, a, l) => {
      let o = Object.entries(e),
        n = o.length;
      for (let u = 0; u < n; u++) {
        let [r, s] = o[u];
        wd(s, zL(t, r), a, l);
      }
    },
    zL = (e, t) => {
      let a = e,
        l = t.split('-'),
        o = l.length;
      for (let n = 0; n < o; n++) {
        let u = l[n],
          r = a.nextPart.get(u);
        (r || ((r = UL()), a.nextPart.set(u, r)), (a = r));
      }
      return a;
    },
    v0 = (e) => 'isThemeGetter' in e && e.isThemeGetter === !0,
    y0 = (e) => {
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
  var C0 = [],
    OL = (e, t, a, l, o) => ({
      modifiers: e,
      hasImportantModifier: t,
      baseClassName: a,
      maybePostfixModifierPosition: l,
      isExternal: o,
    }),
    b0 = (e) => {
      let { prefix: t, experimentalParseClassName: a } = e,
        l = (o) => {
          let n = [],
            u = 0,
            r = 0,
            s = 0,
            i,
            h = o.length;
          for (let S = 0; S < h; S++) {
            let v = o[S];
            if (u === 0 && r === 0) {
              if (v === ':') {
                (n.push(o.slice(s, S)), (s = S + 1));
                continue;
              }
              if (v === '/') {
                i = S;
                continue;
              }
            }
            v === '[' ? u++ : v === ']' ? u-- : v === '(' ? r++ : v === ')' && r--;
          }
          let m = n.length === 0 ? o : o.slice(s),
            f = m,
            p = !1;
          m.endsWith('!')
            ? ((f = m.slice(0, -1)), (p = !0))
            : m.startsWith('!') && ((f = m.slice(1)), (p = !0));
          let L = i && i > s ? i - s : void 0;
          return OL(n, p, f, L);
        };
      if (t) {
        let o = t + ':',
          n = l;
        l = (u) => (u.startsWith(o) ? n(u.slice(o.length)) : OL(C0, !1, u, void 0, !0));
      }
      if (a) {
        let o = l;
        l = (n) => a({ className: n, parseClassName: o });
      }
      return l;
    },
    I0 = (e) => {
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
    w0 = (e) => ({
      cache: y0(e.cacheSize),
      parseClassName: b0(e),
      sortModifiers: I0(e),
      postfixLookupClassGroupIds: R0(e),
      ...d0(e),
    }),
    R0 = (e) => {
      let t = Object.create(null),
        a = e.postfixLookupClassGroups;
      if (a) for (let l = 0; l < a.length; l++) t[a[l]] = !0;
      return t;
    },
    A0 = /\s+/,
    T0 = (e, t) => {
      let {
          parseClassName: a,
          getClassGroupId: l,
          getConflictingClassGroupIds: o,
          sortModifiers: n,
          postfixLookupClassGroupIds: u,
        } = t,
        r = [],
        s = e.trim().split(A0),
        i = '';
      for (let h = s.length - 1; h >= 0; h -= 1) {
        let m = s[h],
          {
            isExternal: f,
            modifiers: p,
            hasImportantModifier: L,
            baseClassName: S,
            maybePostfixModifierPosition: v,
          } = a(m);
        if (f) {
          i = m + (i.length > 0 ? ' ' + i : i);
          continue;
        }
        let g = !!v,
          d;
        if (g) {
          let b = S.substring(0, v);
          d = l(b);
          let C = d && u[d] ? l(S) : void 0;
          C && C !== d && ((d = C), (g = !1));
        } else d = l(S);
        if (!d) {
          if (!g) {
            i = m + (i.length > 0 ? ' ' + i : i);
            continue;
          }
          if (((d = l(S)), !d)) {
            i = m + (i.length > 0 ? ' ' + i : i);
            continue;
          }
          g = !1;
        }
        let c = p.length === 0 ? '' : p.length === 1 ? p[0] : n(p).join(':'),
          x = L ? c + '!' : c,
          y = x + d;
        if (r.indexOf(y) > -1) continue;
        r.push(y);
        let I = o(d, g);
        for (let b = 0; b < I.length; ++b) {
          let C = I[b];
          r.push(x + C);
        }
        i = m + (i.length > 0 ? ' ' + i : i);
      }
      return i;
    },
    k0 = (...e) => {
      let t = 0,
        a,
        l,
        o = '';
      for (; t < e.length;) (a = e[t++]) && (l = NL(a)) && (o && (o += ' '), (o += l));
      return o;
    },
    NL = (e) => {
      if (typeof e == 'string') return e;
      let t,
        a = '';
      for (let l = 0; l < e.length; l++) e[l] && (t = NL(e[l])) && (a && (a += ' '), (a += t));
      return a;
    },
    M0 = (e, ...t) => {
      let a,
        l,
        o,
        n,
        u = (s) => {
          let i = t.reduce((h, m) => m(h), e());
          return ((a = w0(i)), (l = a.cache.get), (o = a.cache.set), (n = r), r(s));
        },
        r = (s) => {
          let i = l(s);
          if (i) return i;
          let h = T0(s, a);
          return (o(s, h), h);
        };
      return ((n = u), (...s) => n(k0(...s)));
    },
    D0 = [],
    Ve = (e) => {
      let t = (a) => a[e] || D0;
      return ((t.isThemeGetter = !0), t);
    },
    qL = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
    FL = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
    E0 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
    O0 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
    B0 =
      /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
    P0 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
    _0 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
    U0 =
      /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
    zl = (e) => E0.test(e),
    W = (e) => !!e && !Number.isNaN(Number(e)),
    Ma = (e) => !!e && Number.isInteger(Number(e)),
    Id = (e) => e.endsWith('%') && W(e.slice(0, -1)),
    al = (e) => O0.test(e),
    GL = () => !0,
    H0 = (e) => B0.test(e) && !P0.test(e),
    Rd = () => !1,
    z0 = (e) => _0.test(e),
    N0 = (e) => U0.test(e),
    q0 = (e) => !M(e) && !E(e),
    F0 = (e) =>
      e.startsWith('@container') &&
      ((e[10] === '/' && e[11] !== void 0) ||
        (e[11] === 's' && e[16] !== void 0 && e.startsWith('-size/', 10)) ||
        (e[11] === 'n' && e[18] !== void 0 && e.startsWith('-normal/', 10))),
    G0 = (e) => Nl(e, jL, Rd),
    M = (e) => qL.test(e),
    go = (e) => Nl(e, YL, H0),
    BL = (e) => Nl(e, W0, W),
    V0 = (e) => Nl(e, ZL, GL),
    X0 = (e) => Nl(e, KL, Rd),
    PL = (e) => Nl(e, VL, Rd),
    j0 = (e) => Nl(e, XL, N0),
    Gs = (e) => Nl(e, QL, z0),
    E = (e) => FL.test(e),
    Qu = (e) => xo(e, YL),
    Y0 = (e) => xo(e, KL),
    _L = (e) => xo(e, VL),
    K0 = (e) => xo(e, jL),
    Z0 = (e) => xo(e, XL),
    Vs = (e) => xo(e, QL, !0),
    Q0 = (e) => xo(e, ZL, !0),
    Nl = (e, t, a) => {
      let l = qL.exec(e);
      return l ? (l[1] ? t(l[1]) : a(l[2])) : !1;
    },
    xo = (e, t, a = !1) => {
      let l = FL.exec(e);
      return l ? (l[1] ? t(l[1]) : a) : !1;
    },
    VL = (e) => e === 'position' || e === 'percentage',
    XL = (e) => e === 'image' || e === 'url',
    jL = (e) => e === 'length' || e === 'size' || e === 'bg-size',
    YL = (e) => e === 'length',
    W0 = (e) => e === 'number',
    KL = (e) => e === 'family-name',
    ZL = (e) => e === 'number' || e === 'weight',
    QL = (e) => e === 'shadow';
  var J0 = () => {
    let e = Ve('color'),
      t = Ve('font'),
      a = Ve('text'),
      l = Ve('font-weight'),
      o = Ve('tracking'),
      n = Ve('leading'),
      u = Ve('breakpoint'),
      r = Ve('container'),
      s = Ve('spacing'),
      i = Ve('radius'),
      h = Ve('shadow'),
      m = Ve('inset-shadow'),
      f = Ve('text-shadow'),
      p = Ve('drop-shadow'),
      L = Ve('blur'),
      S = Ve('perspective'),
      v = Ve('aspect'),
      g = Ve('ease'),
      d = Ve('animate'),
      c = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      x = () => [
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
      y = () => [...x(), E, M],
      I = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      b = () => ['auto', 'contain', 'none'],
      C = () => [E, M, s],
      R = () => [zl, 'full', 'auto', ...C()],
      T = () => [Ma, 'none', 'subgrid', E, M],
      B = () => ['auto', { span: ['full', Ma, E, M] }, Ma, E, M],
      O = () => [Ma, 'auto', E, M],
      U = () => ['auto', 'min', 'max', 'fr', E, M],
      Q = () => [
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
      ae = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
      z = () => ['auto', ...C()],
      j = () => [
        zl,
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
        ...C(),
      ],
      N = () => [zl, 'screen', 'full', 'dvw', 'lvw', 'svw', 'min', 'max', 'fit', ...C()],
      le = () => [zl, 'screen', 'full', 'lh', 'dvh', 'lvh', 'svh', 'min', 'max', 'fit', ...C()],
      k = () => [e, E, M],
      qt = () => [...x(), _L, PL, { position: [E, M] }],
      Oe = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
      rt = () => ['auto', 'cover', 'contain', K0, G0, { size: [E, M] }],
      Ft = () => [Id, Qu, go],
      be = () => ['', 'none', 'full', i, E, M],
      Te = () => ['', W, Qu, go],
      Gt = () => ['solid', 'dashed', 'dotted', 'double'],
      F = () => [
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
      Y = () => [W, Id, _L, PL],
      qe = () => ['', 'none', L, E, M],
      ue = () => ['none', W, E, M],
      re = () => ['none', W, E, M],
      Ie = () => [W, E, M],
      Lt = () => [zl, 'full', ...C()];
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [al],
        breakpoint: [al],
        color: [GL],
        container: [al],
        'drop-shadow': [al],
        ease: ['in', 'out', 'in-out'],
        font: [q0],
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
        'inset-shadow': [al],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
        radius: [al],
        shadow: [al],
        spacing: ['px', W],
        text: [al],
        'text-shadow': [al],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', zl, M, E, v] }],
        container: ['container'],
        'container-type': [{ '@container': ['', 'normal', 'size', E, M] }],
        'container-named': [F0],
        columns: [{ columns: [W, M, E, r] }],
        'break-after': [{ 'break-after': c() }],
        'break-before': [{ 'break-before': c() }],
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
        'object-position': [{ object: y() }],
        overflow: [{ overflow: I() }],
        'overflow-x': [{ 'overflow-x': I() }],
        'overflow-y': [{ 'overflow-y': I() }],
        overscroll: [{ overscroll: b() }],
        'overscroll-x': [{ 'overscroll-x': b() }],
        'overscroll-y': [{ 'overscroll-y': b() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: R() }],
        'inset-x': [{ 'inset-x': R() }],
        'inset-y': [{ 'inset-y': R() }],
        start: [{ 'inset-s': R(), start: R() }],
        end: [{ 'inset-e': R(), end: R() }],
        'inset-bs': [{ 'inset-bs': R() }],
        'inset-be': [{ 'inset-be': R() }],
        top: [{ top: R() }],
        right: [{ right: R() }],
        bottom: [{ bottom: R() }],
        left: [{ left: R() }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: [Ma, 'auto', E, M] }],
        basis: [{ basis: [zl, 'full', 'auto', r, ...C()] }],
        'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
        'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
        flex: [{ flex: [W, zl, 'auto', 'initial', 'none', M] }],
        grow: [{ grow: ['', W, E, M] }],
        shrink: [{ shrink: ['', W, E, M] }],
        order: [{ order: [Ma, 'first', 'last', 'none', E, M] }],
        'grid-cols': [{ 'grid-cols': T() }],
        'col-start-end': [{ col: B() }],
        'col-start': [{ 'col-start': O() }],
        'col-end': [{ 'col-end': O() }],
        'grid-rows': [{ 'grid-rows': T() }],
        'row-start-end': [{ row: B() }],
        'row-start': [{ 'row-start': O() }],
        'row-end': [{ 'row-end': O() }],
        'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
        'auto-cols': [{ 'auto-cols': U() }],
        'auto-rows': [{ 'auto-rows': U() }],
        gap: [{ gap: C() }],
        'gap-x': [{ 'gap-x': C() }],
        'gap-y': [{ 'gap-y': C() }],
        'justify-content': [{ justify: [...Q(), 'normal'] }],
        'justify-items': [{ 'justify-items': [...ae(), 'normal'] }],
        'justify-self': [{ 'justify-self': ['auto', ...ae()] }],
        'align-content': [{ content: ['normal', ...Q()] }],
        'align-items': [{ items: [...ae(), { baseline: ['', 'last'] }] }],
        'align-self': [{ self: ['auto', ...ae(), { baseline: ['', 'last'] }] }],
        'place-content': [{ 'place-content': Q() }],
        'place-items': [{ 'place-items': [...ae(), 'baseline'] }],
        'place-self': [{ 'place-self': ['auto', ...ae()] }],
        p: [{ p: C() }],
        px: [{ px: C() }],
        py: [{ py: C() }],
        ps: [{ ps: C() }],
        pe: [{ pe: C() }],
        pbs: [{ pbs: C() }],
        pbe: [{ pbe: C() }],
        pt: [{ pt: C() }],
        pr: [{ pr: C() }],
        pb: [{ pb: C() }],
        pl: [{ pl: C() }],
        m: [{ m: z() }],
        mx: [{ mx: z() }],
        my: [{ my: z() }],
        ms: [{ ms: z() }],
        me: [{ me: z() }],
        mbs: [{ mbs: z() }],
        mbe: [{ mbe: z() }],
        mt: [{ mt: z() }],
        mr: [{ mr: z() }],
        mb: [{ mb: z() }],
        ml: [{ ml: z() }],
        'space-x': [{ 'space-x': C() }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': C() }],
        'space-y-reverse': ['space-y-reverse'],
        size: [{ size: j() }],
        'inline-size': [{ inline: ['auto', ...N()] }],
        'min-inline-size': [{ 'min-inline': ['auto', ...N()] }],
        'max-inline-size': [{ 'max-inline': ['none', ...N()] }],
        'block-size': [{ block: ['auto', ...le()] }],
        'min-block-size': [{ 'min-block': ['auto', ...le()] }],
        'max-block-size': [{ 'max-block': ['none', ...le()] }],
        w: [{ w: [r, 'screen', ...j()] }],
        'min-w': [{ 'min-w': [r, 'screen', 'none', ...j()] }],
        'max-w': [{ 'max-w': [r, 'screen', 'none', 'prose', { screen: [u] }, ...j()] }],
        h: [{ h: ['screen', 'lh', ...j()] }],
        'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...j()] }],
        'max-h': [{ 'max-h': ['screen', 'lh', ...j()] }],
        'font-size': [{ text: ['base', a, Qu, go] }],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [{ font: [l, Q0, V0] }],
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
              Id,
              M,
            ],
          },
        ],
        'font-family': [{ font: [Y0, X0, t] }],
        'font-features': [{ 'font-features': [M] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: [o, E, M] }],
        'line-clamp': [{ 'line-clamp': [W, 'none', E, BL] }],
        leading: [{ leading: [n, ...C()] }],
        'list-image': [{ 'list-image': ['none', E, M] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'list-style-type': [{ list: ['disc', 'decimal', 'none', E, M] }],
        'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
        'placeholder-color': [{ placeholder: k() }],
        'text-color': [{ text: k() }],
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        'text-decoration-style': [{ decoration: [...Gt(), 'wavy'] }],
        'text-decoration-thickness': [{ decoration: [W, 'from-font', 'auto', E, go] }],
        'text-decoration-color': [{ decoration: k() }],
        'underline-offset': [{ 'underline-offset': [W, 'auto', E, M] }],
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: C() }],
        'tab-size': [{ tab: [Ma, E, M] }],
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
              E,
              M,
            ],
          },
        ],
        whitespace: [
          { whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', E, M] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: qt() }],
        'bg-repeat': [{ bg: Oe() }],
        'bg-size': [{ bg: rt() }],
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [{ to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, Ma, E, M],
                radial: ['', E, M],
                conic: [Ma, E, M],
              },
              Z0,
              j0,
            ],
          },
        ],
        'bg-color': [{ bg: k() }],
        'gradient-from-pos': [{ from: Ft() }],
        'gradient-via-pos': [{ via: Ft() }],
        'gradient-to-pos': [{ to: Ft() }],
        'gradient-from': [{ from: k() }],
        'gradient-via': [{ via: k() }],
        'gradient-to': [{ to: k() }],
        rounded: [{ rounded: be() }],
        'rounded-s': [{ 'rounded-s': be() }],
        'rounded-e': [{ 'rounded-e': be() }],
        'rounded-t': [{ 'rounded-t': be() }],
        'rounded-r': [{ 'rounded-r': be() }],
        'rounded-b': [{ 'rounded-b': be() }],
        'rounded-l': [{ 'rounded-l': be() }],
        'rounded-ss': [{ 'rounded-ss': be() }],
        'rounded-se': [{ 'rounded-se': be() }],
        'rounded-ee': [{ 'rounded-ee': be() }],
        'rounded-es': [{ 'rounded-es': be() }],
        'rounded-tl': [{ 'rounded-tl': be() }],
        'rounded-tr': [{ 'rounded-tr': be() }],
        'rounded-br': [{ 'rounded-br': be() }],
        'rounded-bl': [{ 'rounded-bl': be() }],
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
        'border-style': [{ border: [...Gt(), 'hidden', 'none'] }],
        'divide-style': [{ divide: [...Gt(), 'hidden', 'none'] }],
        'border-color': [{ border: k() }],
        'border-color-x': [{ 'border-x': k() }],
        'border-color-y': [{ 'border-y': k() }],
        'border-color-s': [{ 'border-s': k() }],
        'border-color-e': [{ 'border-e': k() }],
        'border-color-bs': [{ 'border-bs': k() }],
        'border-color-be': [{ 'border-be': k() }],
        'border-color-t': [{ 'border-t': k() }],
        'border-color-r': [{ 'border-r': k() }],
        'border-color-b': [{ 'border-b': k() }],
        'border-color-l': [{ 'border-l': k() }],
        'divide-color': [{ divide: k() }],
        'outline-style': [{ outline: [...Gt(), 'none', 'hidden'] }],
        'outline-offset': [{ 'outline-offset': [W, E, M] }],
        'outline-w': [{ outline: ['', W, Qu, go] }],
        'outline-color': [{ outline: k() }],
        shadow: [{ shadow: ['', 'none', h, Vs, Gs] }],
        'shadow-color': [{ shadow: k() }],
        'inset-shadow': [{ 'inset-shadow': ['none', m, Vs, Gs] }],
        'inset-shadow-color': [{ 'inset-shadow': k() }],
        'ring-w': [{ ring: Te() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: k() }],
        'ring-offset-w': [{ 'ring-offset': [W, go] }],
        'ring-offset-color': [{ 'ring-offset': k() }],
        'inset-ring-w': [{ 'inset-ring': Te() }],
        'inset-ring-color': [{ 'inset-ring': k() }],
        'text-shadow': [{ 'text-shadow': ['none', f, Vs, Gs] }],
        'text-shadow-color': [{ 'text-shadow': k() }],
        opacity: [{ opacity: [W, E, M] }],
        'mix-blend': [{ 'mix-blend': [...F(), 'plus-darker', 'plus-lighter'] }],
        'bg-blend': [{ 'bg-blend': F() }],
        'mask-clip': [
          { 'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
          'mask-no-clip',
        ],
        'mask-composite': [{ mask: ['add', 'subtract', 'intersect', 'exclude'] }],
        'mask-image-linear-pos': [{ 'mask-linear': [W] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': Y() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': Y() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': k() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': k() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': Y() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': Y() }],
        'mask-image-t-from-color': [{ 'mask-t-from': k() }],
        'mask-image-t-to-color': [{ 'mask-t-to': k() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': Y() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': Y() }],
        'mask-image-r-from-color': [{ 'mask-r-from': k() }],
        'mask-image-r-to-color': [{ 'mask-r-to': k() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': Y() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': Y() }],
        'mask-image-b-from-color': [{ 'mask-b-from': k() }],
        'mask-image-b-to-color': [{ 'mask-b-to': k() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': Y() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': Y() }],
        'mask-image-l-from-color': [{ 'mask-l-from': k() }],
        'mask-image-l-to-color': [{ 'mask-l-to': k() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': Y() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': Y() }],
        'mask-image-x-from-color': [{ 'mask-x-from': k() }],
        'mask-image-x-to-color': [{ 'mask-x-to': k() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': Y() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': Y() }],
        'mask-image-y-from-color': [{ 'mask-y-from': k() }],
        'mask-image-y-to-color': [{ 'mask-y-to': k() }],
        'mask-image-radial': [{ 'mask-radial': [E, M] }],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': Y() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': Y() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': k() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': k() }],
        'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
        'mask-image-radial-size': [
          { 'mask-radial': [{ closest: ['side', 'corner'], farthest: ['side', 'corner'] }] },
        ],
        'mask-image-radial-pos': [{ 'mask-radial-at': x() }],
        'mask-image-conic-pos': [{ 'mask-conic': [W] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': Y() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': Y() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': k() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': k() }],
        'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
        'mask-origin': [
          { 'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
        ],
        'mask-position': [{ mask: qt() }],
        'mask-repeat': [{ mask: Oe() }],
        'mask-size': [{ mask: rt() }],
        'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
        'mask-image': [{ mask: ['none', E, M] }],
        filter: [{ filter: ['', 'none', E, M] }],
        blur: [{ blur: qe() }],
        brightness: [{ brightness: [W, E, M] }],
        contrast: [{ contrast: [W, E, M] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', p, Vs, Gs] }],
        'drop-shadow-color': [{ 'drop-shadow': k() }],
        grayscale: [{ grayscale: ['', W, E, M] }],
        'hue-rotate': [{ 'hue-rotate': [W, E, M] }],
        invert: [{ invert: ['', W, E, M] }],
        saturate: [{ saturate: [W, E, M] }],
        sepia: [{ sepia: ['', W, E, M] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none', E, M] }],
        'backdrop-blur': [{ 'backdrop-blur': qe() }],
        'backdrop-brightness': [{ 'backdrop-brightness': [W, E, M] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [W, E, M] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': ['', W, E, M] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [W, E, M] }],
        'backdrop-invert': [{ 'backdrop-invert': ['', W, E, M] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [W, E, M] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [W, E, M] }],
        'backdrop-sepia': [{ 'backdrop-sepia': ['', W, E, M] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': C() }],
        'border-spacing-x': [{ 'border-spacing-x': C() }],
        'border-spacing-y': [{ 'border-spacing-y': C() }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          { transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', E, M] },
        ],
        'transition-behavior': [{ transition: ['normal', 'discrete'] }],
        duration: [{ duration: [W, 'initial', E, M] }],
        ease: [{ ease: ['linear', 'initial', g, E, M] }],
        delay: [{ delay: [W, E, M] }],
        animate: [{ animate: ['none', d, E, M] }],
        backface: [{ backface: ['hidden', 'visible'] }],
        perspective: [{ perspective: [S, E, M] }],
        'perspective-origin': [{ 'perspective-origin': y() }],
        rotate: [{ rotate: ue() }],
        'rotate-x': [{ 'rotate-x': ue() }],
        'rotate-y': [{ 'rotate-y': ue() }],
        'rotate-z': [{ 'rotate-z': ue() }],
        scale: [{ scale: re() }],
        'scale-x': [{ 'scale-x': re() }],
        'scale-y': [{ 'scale-y': re() }],
        'scale-z': [{ 'scale-z': re() }],
        'scale-3d': ['scale-3d'],
        skew: [{ skew: Ie() }],
        'skew-x': [{ 'skew-x': Ie() }],
        'skew-y': [{ 'skew-y': Ie() }],
        transform: [{ transform: [E, M, '', 'none', 'gpu', 'cpu'] }],
        'transform-origin': [{ origin: y() }],
        'transform-style': [{ transform: ['3d', 'flat'] }],
        translate: [{ translate: Lt() }],
        'translate-x': [{ 'translate-x': Lt() }],
        'translate-y': [{ 'translate-y': Lt() }],
        'translate-z': [{ 'translate-z': Lt() }],
        'translate-none': ['translate-none'],
        zoom: [{ zoom: [Ma, E, M] }],
        accent: [{ accent: k() }],
        appearance: [{ appearance: ['none', 'auto'] }],
        'caret-color': [{ caret: k() }],
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
              E,
              M,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
        'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
        resize: [{ resize: ['none', '', 'y', 'x'] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scrollbar-thumb-color': [{ 'scrollbar-thumb': k() }],
        'scrollbar-track-color': [{ 'scrollbar-track': k() }],
        'scrollbar-gutter': [{ 'scrollbar-gutter': ['auto', 'stable', 'both'] }],
        'scrollbar-w': [{ scrollbar: ['auto', 'thin', 'none'] }],
        'scroll-m': [{ 'scroll-m': C() }],
        'scroll-mx': [{ 'scroll-mx': C() }],
        'scroll-my': [{ 'scroll-my': C() }],
        'scroll-ms': [{ 'scroll-ms': C() }],
        'scroll-me': [{ 'scroll-me': C() }],
        'scroll-mbs': [{ 'scroll-mbs': C() }],
        'scroll-mbe': [{ 'scroll-mbe': C() }],
        'scroll-mt': [{ 'scroll-mt': C() }],
        'scroll-mr': [{ 'scroll-mr': C() }],
        'scroll-mb': [{ 'scroll-mb': C() }],
        'scroll-ml': [{ 'scroll-ml': C() }],
        'scroll-p': [{ 'scroll-p': C() }],
        'scroll-px': [{ 'scroll-px': C() }],
        'scroll-py': [{ 'scroll-py': C() }],
        'scroll-ps': [{ 'scroll-ps': C() }],
        'scroll-pe': [{ 'scroll-pe': C() }],
        'scroll-pbs': [{ 'scroll-pbs': C() }],
        'scroll-pbe': [{ 'scroll-pbe': C() }],
        'scroll-pt': [{ 'scroll-pt': C() }],
        'scroll-pr': [{ 'scroll-pr': C() }],
        'scroll-pb': [{ 'scroll-pb': C() }],
        'scroll-pl': [{ 'scroll-pl': C() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', E, M] }],
        fill: [{ fill: ['none', ...k()] }],
        'stroke-w': [{ stroke: [W, Qu, go, BL] }],
        stroke: [{ stroke: ['none', ...k()] }],
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
  var WL = M0(J0);
  function ot(...e) {
    return WL(Fs(e));
  }
  var tS = A(G(), 1),
    ql = (0, Tn.forwardRef)(({ className: e, autoResize: t = !0, onChange: a, ...l }, o) => {
      let n = (0, Tn.useRef)(null),
        u = o || n;
      (0, Tn.useEffect)(() => {
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
      return (0, tS.jsx)('textarea', {
        ref: u,
        className: ot(
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
  ql.displayName = 'Textarea';
  var js = A(G(), 1);
  function Xe({ className: e, required: t, children: a, ...l }) {
    return (0, js.jsxs)('label', {
      className: ot(
        'block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1',
        e,
      ),
      ...l,
      children: [
        a,
        t && (0, js.jsx)('span', { className: 'text-destructive ml-0.5', children: '*' }),
      ],
    });
  }
  var kn = A(G(), 1);
  function Mn({ title: e, children: t, className: a }) {
    return (0, kn.jsxs)('div', {
      className: ot('bg-card border border-border rounded-lg mb-3 overflow-hidden', a),
      children: [
        (0, kn.jsxs)('div', {
          className:
            'px-3.5 py-2 bg-primary/5 border-b border-primary/15 text-[13px] font-bold text-primary flex items-center gap-1.5',
          children: [(0, kn.jsx)('span', { className: 'text-sm', children: '\u25CF' }), e],
        }),
        (0, kn.jsx)('div', { className: 'p-3.5', children: t }),
      ],
    });
  }
  var ht = A(G(), 1);
  function aS({ title: e, onClose: t, patientInfo: a }) {
    return (0, ht.jsxs)('div', {
      className:
        'flex items-center justify-between px-5 py-3 bg-gradient-to-br from-primary to-primary/80 text-white shrink-0',
      children: [
        (0, ht.jsxs)('div', {
          className: 'flex items-center gap-3',
          children: [
            (0, ht.jsx)('div', {
              className: 'flex items-center justify-center w-9 h-9 rounded-lg bg-white/15',
              children: (0, ht.jsxs)('svg', {
                width: '18',
                height: '18',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'white',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                children: [
                  (0, ht.jsx)('path', {
                    d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
                  }),
                  (0, ht.jsx)('polyline', { points: '14 2 14 8 20 8' }),
                  (0, ht.jsx)('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
                  (0, ht.jsx)('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
                  (0, ht.jsx)('polyline', { points: '10 9 9 9 8 9' }),
                ],
              }),
            }),
            (0, ht.jsxs)('div', {
              children: [
                (0, ht.jsx)('h2', {
                  className: 'text-[15px] font-bold tracking-tight',
                  children: e,
                }),
                a &&
                  (0, ht.jsxs)('div', {
                    className: 'text-[11px] text-white/70 mt-0.5',
                    children: [
                      'RM ',
                      a.norm || '\u2014',
                      ' \xB7 ',
                      a.pasien || '\u2014',
                      ' \xB7',
                      ' ',
                      a.nama_dokter || '\u2014',
                    ],
                  }),
              ],
            }),
          ],
        }),
        (0, ht.jsx)('button', {
          type: 'button',
          onClick: t,
          className:
            'bg-white/15 hover:bg-white/25 border-none text-white w-[28px] h-[28px] rounded-md text-sm flex items-center justify-center cursor-pointer transition-colors',
          'aria-label': 'Tutup',
          children: '\u2715',
        }),
      ],
    });
  }
  var ll = A(G(), 1);
  function lS({ anamnesa: e, pemeriksaan: t, onChange: a }) {
    return (0, ll.jsxs)('div', {
      className: 'space-y-3',
      children: [
        (0, ll.jsxs)('div', {
          children: [
            (0, ll.jsx)(Xe, { children: 'Anamnesa' }),
            (0, ll.jsx)(ql, {
              value: e,
              onChange: (l) => a('anamnesa', l.target.value),
              placeholder: 'Keluhan pasien...',
              rows: 4,
            }),
          ],
        }),
        (0, ll.jsxs)('div', {
          children: [
            (0, ll.jsx)(Xe, { children: 'Pemeriksaan Fisik' }),
            (0, ll.jsx)(ql, {
              value: t,
              onChange: (l) => a('pemeriksaan', l.target.value),
              placeholder: 'Hasil pemeriksaan...',
              rows: 4,
            }),
          ],
        }),
      ],
    });
  }
  var oS = A(P(), 1);
  var nS = A(G(), 1),
    ol = (0, oS.forwardRef)(({ className: e, type: t, ...a }, l) =>
      (0, nS.jsx)('input', {
        type: t,
        className: ot(
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
  ol.displayName = 'Input';
  var Fl = A(G(), 1);
  function uS({ vitals: e, onChange: t }) {
    return (0, Fl.jsx)('div', {
      className: 'grid grid-cols-2 sm:grid-cols-3 gap-3',
      children: [
        { key: 'tensi', label: 'Tensi', unit: 'mmHg', placeholder: '120/80' },
        { key: 'nadi', label: 'Nadi', unit: 'x/mnt', placeholder: '80' },
        { key: 'suhu', label: 'Suhu', unit: '\xB0C', placeholder: '36.5' },
        { key: 'nafas', label: 'Nafas', unit: 'x/mnt', placeholder: '20' },
        { key: 'berat', label: 'Berat', unit: 'kg', placeholder: '60' },
        { key: 'tinggi', label: 'Tinggi', unit: 'cm', placeholder: '165' },
      ].map((l) =>
        (0, Fl.jsxs)(
          'div',
          {
            children: [
              (0, Fl.jsx)(Xe, { children: l.label }),
              (0, Fl.jsxs)('div', {
                className: 'relative',
                children: [
                  (0, Fl.jsx)(ol, {
                    value: e[l.key],
                    onChange: (o) => t(l.key, o.target.value),
                    placeholder: l.placeholder,
                    className: 'pr-14',
                  }),
                  (0, Fl.jsx)('span', {
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
    });
  }
  var jl = A(P(), 1);
  var Zs = A(P(), 1);
  var Ys = (...e) =>
    e
      .filter((t, a, l) => !!t && t.trim() !== '' && l.indexOf(t) === a)
      .join(' ')
      .trim();
  var rS = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  var sS = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, a, l) => (l ? l.toUpperCase() : a.toLowerCase()));
  var Ad = (e) => {
    let t = sS(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  var Wu = A(P(), 1);
  var Ks = {
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
  var iS = (e) => {
    for (let t in e) if (t.startsWith('aria-') || t === 'role' || t === 'title') return !0;
    return !1;
  };
  var Dn = A(P(), 1);
  var tw = (0, Dn.createContext)({});
  var fS = () => (0, Dn.useContext)(tw);
  var cS = (0, Wu.forwardRef)(
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
          strokeWidth: h = 2,
          absoluteStrokeWidth: m = !1,
          color: f = 'currentColor',
          className: p = '',
        } = fS() ?? {},
        L = (l ?? m) ? (Number(a ?? h) * 24) / Number(t ?? i) : (a ?? h);
      return (0, Wu.createElement)(
        'svg',
        {
          ref: s,
          ...Ks,
          width: t ?? i ?? Ks.width,
          height: t ?? i ?? Ks.height,
          stroke: e ?? f,
          strokeWidth: L,
          className: Ys('lucide', p, o),
          ...(!n && !iS(r) && { 'aria-hidden': 'true' }),
          ...r,
        },
        [...u.map(([S, v]) => (0, Wu.createElement)(S, v)), ...(Array.isArray(n) ? n : [n])],
      );
    },
  );
  var Rt = (e, t) => {
    let a = (0, Zs.forwardRef)(({ className: l, ...o }, n) =>
      (0, Zs.createElement)(cS, {
        ref: n,
        iconNode: t,
        className: Ys(`lucide-${rS(Ad(e))}`, `lucide-${e}`, l),
        ...o,
      }),
    );
    return ((a.displayName = Ad(e)), a);
  };
  var aw = [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]],
    Ju = Rt('check', aw);
  var lw = [['path', { d: 'm6 9 6 6 6-6', key: 'qrunsl' }]],
    $u = Rt('chevron-down', lw);
  var ow = [
      ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
      ['path', { d: 'M12 16v-4', key: '1dtifu' }],
      ['path', { d: 'M12 8h.01', key: 'e9boi3' }],
    ],
    er = Rt('info', ow);
  var nw = [
      ['path', { d: 'M5 12h14', key: '1ays0h' }],
      ['path', { d: 'M12 5v14', key: 's699le' }],
    ],
    Lo = Rt('plus', nw);
  var uw = [
      ['path', { d: 'M10 11v6', key: 'nco0om' }],
      ['path', { d: 'M14 11v6', key: 'outv1u' }],
      ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', key: 'miytrc' }],
      ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
      ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'e791ji' }],
    ],
    So = Rt('trash-2', uw);
  var rw = [
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
    ia = Rt('triangle-alert', rw);
  var sw = [
      ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
      ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
    ],
    En = Rt('x', sw);
  var hS = A(P(), 1);
  var dS = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
    mS = Fs,
    pS = (e, t) => (a) => {
      var l;
      if (t?.variants == null) return mS(e, a?.class, a?.className);
      let { variants: o, defaultVariants: n } = t,
        u = Object.keys(o).map((i) => {
          let h = a?.[i],
            m = n?.[i];
          if (h === null) return null;
          let f = dS(h) || dS(m);
          return o[i][f];
        }),
        r =
          a &&
          Object.entries(a).reduce((i, h) => {
            let [m, f] = h;
            return (f === void 0 || (i[m] = f), i);
          }, {}),
        s =
          t == null || (l = t.compoundVariants) === null || l === void 0
            ? void 0
            : l.reduce((i, h) => {
                let { class: m, className: f, ...p } = h;
                return Object.entries(p).every((L) => {
                  let [S, v] = L;
                  return Array.isArray(v) ? v.includes({ ...n, ...r }[S]) : { ...n, ...r }[S] === v;
                })
                  ? [...i, m, f]
                  : i;
              }, []);
      return mS(e, u, s, a?.class, a?.className);
    };
  var gS = A(G(), 1),
    iw = pS(
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
    fa = (0, hS.forwardRef)(({ className: e, variant: t, size: a, ...l }, o) =>
      (0, gS.jsx)('button', {
        className: ot(iw({ variant: t, size: a, className: e })),
        ref: o,
        ...l,
      }),
    );
  fa.displayName = 'Button';
  var Di = A(P(), 1);
  var D = A(P(), 1),
    Rm = A(Ho(), 1);
  var fw = Object.defineProperty,
    cw = (e, t) => fw(e, 'name', { value: t, configurable: !0 });
  function Qs(e, [t, a]) {
    return Math.min(a, Math.max(t, e));
  }
  cw(Qs, 'clamp');
  var dw = Object.defineProperty,
    On = (e, t) => dw(e, 'name', { value: t, configurable: !0 }),
    xS = !!(typeof window < 'u' && window.document && window.document.createElement);
  function He(e, t, { checkForDefaultPrevented: a = !0 } = {}) {
    return On(function (o) {
      if ((e?.(o), a === !1 || !o || !o.defaultPrevented)) return t?.(o);
    }, 'handleEvent');
  }
  On(He, 'composeEventHandlers');
  function mw(e) {
    if (!xS) throw new Error('Cannot access window outside of the DOM');
    return e?.ownerDocument?.defaultView ?? window;
  }
  On(mw, 'getOwnerWindow');
  function Td(e) {
    if (!xS) throw new Error('Cannot access document outside of the DOM');
    return e?.ownerDocument ?? document;
  }
  On(Td, 'getOwnerDocument');
  function LS(e, t = !1) {
    let { activeElement: a } = Td(e);
    if (!a?.nodeName) return null;
    if (SS(a) && a.contentDocument) return LS(a.contentDocument.body, t);
    if (t) {
      let l = a.getAttribute('aria-activedescendant');
      if (l) {
        let o = Td(a).getElementById(l);
        if (o) return o;
      }
    }
    return a;
  }
  On(LS, 'getActiveElement');
  function SS(e) {
    return e.tagName === 'IFRAME';
  }
  On(SS, 'isFrame');
  var ma = A(P(), 1);
  var la = A(P(), 1),
    kd = A(G(), 1),
    pw = Object.defineProperty,
    aa = (e, t) => pw(e, 'name', { value: t, configurable: !0 });
  function hw(e, t) {
    let a = la.createContext(t);
    a.displayName = e + 'Context';
    let l = aa((n) => {
      let { children: u, ...r } = n,
        s = la.useMemo(() => r, Object.values(r));
      return (0, kd.jsx)(a.Provider, { value: s, children: u });
    }, 'Provider');
    l.displayName = e + 'Provider';
    function o(n, u = {}) {
      let { optional: r = !1 } = u,
        s = la.useContext(a);
      if (s) return s;
      if (t !== void 0) return t;
      if (!r) throw new Error(`\`${n}\` must be used within \`${e}\``);
    }
    return (aa(o, 'useContext'), [l, o]);
  }
  aa(hw, 'createContext');
  function nl(e, t = []) {
    let a = [];
    function l(n, u) {
      let r = la.createContext(u);
      r.displayName = n + 'Context';
      let s = a.length;
      a = [...a, u];
      let i = aa((m) => {
        let { scope: f, children: p, ...L } = m,
          S = f?.[e]?.[s] || r,
          v = la.useMemo(() => L, Object.values(L));
        return (0, kd.jsx)(S.Provider, { value: v, children: p });
      }, 'Provider');
      i.displayName = n + 'Provider';
      function h(m, f, p = {}) {
        let { optional: L = !1 } = p,
          S = f?.[e]?.[s] || r,
          v = la.useContext(S);
        if (v) return v;
        if (u !== void 0) return u;
        if (!L) throw new Error(`\`${m}\` must be used within \`${n}\``);
      }
      return (aa(h, 'useContext'), [i, h]);
    }
    aa(l, 'createContext');
    let o = aa(() => {
      let n = a.map((u) => la.createContext(u));
      return aa(function (r) {
        let s = r?.[e] || n;
        return la.useMemo(() => ({ [`__scope${e}`]: { ...r, [e]: s } }), [r, s]);
      }, 'useScope');
    }, 'createScope');
    return ((o.scopeName = e), [l, vS(o, ...t)]);
  }
  aa(nl, 'createContextScope');
  function vS(...e) {
    let t = e[0];
    if (e.length === 1) return t;
    let a = aa(() => {
      let l = e.map((o) => ({ useScope: o(), scopeName: o.scopeName }));
      return aa(function (n) {
        let u = l.reduce((r, { useScope: s, scopeName: i }) => {
          let m = s(n)[`__scope${i}`];
          return { ...r, ...m };
        }, {});
        return la.useMemo(() => ({ [`__scope${t.scopeName}`]: u }), [u]);
      }, 'useComposedScopes');
    }, 'createScope');
    return ((a.scopeName = t.scopeName), a);
  }
  aa(vS, 'composeContextScopes');
  var yS = A(P(), 1),
    gw = Object.defineProperty,
    Dd = (e, t) => gw(e, 'name', { value: t, configurable: !0 });
  function Md(e, t) {
    if (typeof e == 'function') return e(t);
    e != null && (e.current = t);
  }
  Dd(Md, 'setRef');
  function CS(...e) {
    return (t) => {
      let a = !1,
        l = e.map((o) => {
          let n = Md(o, t);
          return (!a && typeof n == 'function' && (a = !0), n);
        });
      if (a)
        return () => {
          for (let o = 0; o < l.length; o++) {
            let n = l[o];
            typeof n == 'function' ? n() : Md(e[o], null);
          }
        };
    };
  }
  Dd(CS, 'composeRefs');
  function ge(...e) {
    return yS.useCallback(CS(...e), e);
  }
  Dd(ge, 'useComposedRefs');
  var nt = A(P(), 1);
  var xw = Object.defineProperty,
    ca = (e, t) => xw(e, 'name', { value: t, configurable: !0 });
  function da(e) {
    let t = nt.forwardRef((a, l) => {
      let { children: o, ...n } = a,
        u = null,
        r = !1,
        s = [];
      (Ed(o) && typeof Ws == 'function' && (o = Ws(o._payload)),
        nt.Children.forEach(o, (f) => {
          if (RS(f)) {
            r = !0;
            let p = f,
              L = 'child' in p.props ? p.props.child : p.props.children;
            (Ed(L) && typeof Ws == 'function' && (L = Ws(L._payload)),
              (u = Sw(p, L)),
              s.push(u?.props?.children));
          } else s.push(f);
        }),
        u
          ? (u = nt.cloneElement(u, void 0, s))
          : !r && nt.Children.count(o) === 1 && nt.isValidElement(o) && (u = o));
      let i = u ? wS(u) : void 0,
        h = ge(l, i);
      if (!u) {
        if (o || o === 0) throw new Error(r ? Cw(e) : yw(e));
        return o;
      }
      let m = IS(n, u.props ?? {});
      return (u.type !== nt.Fragment && (m.ref = l ? h : i), nt.cloneElement(u, m));
    });
    return ((t.displayName = `${e}.Slot`), t);
  }
  ca(da, 'createSlot');
  var bS = Symbol.for('radix.slottable');
  function Lw(e) {
    let t = ca((a) => ('child' in a ? a.children(a.child) : a.children), 'Slottable');
    return ((t.displayName = `${e}.Slottable`), (t.__radixId = bS), t);
  }
  ca(Lw, 'createSlottable');
  var Sw = ca((e, t) => {
    if ('child' in e.props) {
      let a = e.props.child;
      return nt.isValidElement(a)
        ? nt.cloneElement(a, void 0, e.props.children(a.props.children))
        : null;
    }
    return nt.isValidElement(t) ? t : null;
  }, 'getSlottableElementFromSlottable');
  function IS(e, t) {
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
  ca(IS, 'mergeProps');
  function wS(e) {
    let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
      a = t && 'isReactWarning' in t && t.isReactWarning;
    return a
      ? e.ref
      : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
        (a = t && 'isReactWarning' in t && t.isReactWarning),
        a ? e.props.ref : e.props.ref || e.ref);
  }
  ca(wS, 'getElementRef');
  function RS(e) {
    return (
      nt.isValidElement(e) &&
      typeof e.type == 'function' &&
      '__radixId' in e.type &&
      e.type.__radixId === bS
    );
  }
  ca(RS, 'isSlottable');
  var vw = Symbol.for('react.lazy');
  function Ed(e) {
    return (
      e != null &&
      typeof e == 'object' &&
      '$$typeof' in e &&
      e.$$typeof === vw &&
      '_payload' in e &&
      AS(e._payload)
    );
  }
  ca(Ed, 'isLazyComponent');
  function AS(e) {
    return typeof e == 'object' && e !== null && 'then' in e;
  }
  ca(AS, 'isPromiseLike');
  var yw = ca(
      (e) =>
        `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,
      'createSlotError',
    ),
    Cw = ca(
      (e) =>
        `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,
      'createSlottableError',
    ),
    Ws = nt[' use '.trim().toString()];
  var Js = A(G(), 1),
    At = A(P(), 1);
  var vo = A(G(), 1);
  var bw = Object.defineProperty,
    Qe = (e, t) => bw(e, 'name', { value: t, configurable: !0 });
  function Pd(e) {
    let t = e + 'CollectionProvider',
      [a, l] = nl(t),
      [o, n] = a(t, { collectionRef: { current: null }, itemMap: new Map() }),
      u = Qe((S) => {
        let { scope: v, children: g } = S,
          d = ma.useRef(null),
          c = ma.useRef(new Map()).current;
        return (0, Js.jsx)(o, { scope: v, itemMap: c, collectionRef: d, children: g });
      }, 'CollectionProvider');
    u.displayName = t;
    let r = e + 'CollectionSlot',
      s = da(r),
      i = ma.forwardRef((S, v) => {
        let { scope: g, children: d } = S,
          c = n(r, g),
          x = ge(v, c.collectionRef);
        return (0, Js.jsx)(s, { ref: x, children: d });
      });
    i.displayName = r;
    let h = e + 'CollectionItemSlot',
      m = 'data-radix-collection-item',
      f = da(h),
      p = ma.forwardRef((S, v) => {
        let { scope: g, children: d, ...c } = S,
          x = ma.useRef(null),
          y = ge(v, x),
          I = n(h, g);
        return (
          ma.useEffect(
            () => (
              I.itemMap.set(x, { ref: x, ...c }),
              () => {
                I.itemMap.delete(x);
              }
            ),
          ),
          (0, Js.jsx)(f, { [m]: '', ref: y, children: d })
        );
      });
    p.displayName = h;
    function L(S) {
      let v = n(e + 'CollectionConsumer', S);
      return ma.useCallback(() => {
        let d = v.collectionRef.current;
        if (!d) return [];
        let c = Array.from(d.querySelectorAll(`[${m}]`));
        return Array.from(v.itemMap.values()).sort(
          (I, b) => c.indexOf(I.ref.current) - c.indexOf(b.ref.current),
        );
      }, [v.collectionRef, v.itemMap]);
    }
    return (Qe(L, 'useCollection'), [{ Provider: u, Slot: i, ItemSlot: p }, L, l]);
  }
  Qe(Pd, 'createCollection');
  var TS = new WeakMap(),
    ze,
    Nt,
    Od =
      ((Nt = class extends Map {
        constructor(a) {
          super(a);
          qm(this, ze);
          (Ui(this, ze, [...super.keys()]), TS.set(this, !0));
        }
        set(a, l) {
          return (
            TS.get(this) &&
              (this.has(a) ? (st(this, ze)[st(this, ze).indexOf(a)] = a) : st(this, ze).push(a)),
            super.set(a, l),
            this
          );
        }
        insert(a, l, o) {
          let n = this.has(l),
            u = st(this, ze).length,
            r = _d(a),
            s = r >= 0 ? r : u + r,
            i = s < 0 || s >= u ? -1 : s;
          if (i === this.size || (n && i === this.size - 1) || i === -1)
            return (this.set(l, o), this);
          let h = this.size + (n ? 0 : 1);
          r < 0 && s++;
          let m = [...st(this, ze)],
            f,
            p = !1;
          for (let L = s; L < h; L++)
            if (s === L) {
              let S = m[L];
              (m[L] === l && (S = m[L + 1]),
                n && this.delete(l),
                (f = this.get(S)),
                this.set(l, o));
            } else {
              !p && m[L - 1] === l && (p = !0);
              let S = m[p ? L : L - 1],
                v = f;
              ((f = this.get(S)), this.delete(S), this.set(S, v));
            }
          return this;
        }
        with(a, l, o) {
          let n = new Nt(this);
          return (n.insert(a, l, o), n);
        }
        before(a) {
          let l = st(this, ze).indexOf(a) - 1;
          if (!(l < 0)) return this.entryAt(l);
        }
        setBefore(a, l, o) {
          let n = st(this, ze).indexOf(a);
          return n === -1 ? this : this.insert(n, l, o);
        }
        after(a) {
          let l = st(this, ze).indexOf(a);
          if (((l = l === -1 || l === this.size - 1 ? -1 : l + 1), l !== -1))
            return this.entryAt(l);
        }
        setAfter(a, l, o) {
          let n = st(this, ze).indexOf(a);
          return n === -1 ? this : this.insert(n + 1, l, o);
        }
        first() {
          return this.entryAt(0);
        }
        last() {
          return this.entryAt(-1);
        }
        clear() {
          return (Ui(this, ze, []), super.clear());
        }
        delete(a) {
          let l = super.delete(a);
          return (l && st(this, ze).splice(st(this, ze).indexOf(a), 1), l);
        }
        deleteAt(a) {
          let l = this.keyAt(a);
          return l !== void 0 ? this.delete(l) : !1;
        }
        at(a) {
          let l = $s(st(this, ze), a);
          if (l !== void 0) return this.get(l);
        }
        entryAt(a) {
          let l = $s(st(this, ze), a);
          if (l !== void 0) return [l, this.get(l)];
        }
        indexOf(a) {
          return st(this, ze).indexOf(a);
        }
        keyAt(a) {
          return $s(st(this, ze), a);
        }
        from(a, l) {
          let o = this.indexOf(a);
          if (o === -1) return;
          let n = o + l;
          return (n < 0 && (n = 0), n >= this.size && (n = this.size - 1), this.at(n));
        }
        keyFrom(a, l) {
          let o = this.indexOf(a);
          if (o === -1) return;
          let n = o + l;
          return (n < 0 && (n = 0), n >= this.size && (n = this.size - 1), this.keyAt(n));
        }
        find(a, l) {
          let o = 0;
          for (let n of this) {
            if (Reflect.apply(a, l, [n, o, this])) return n;
            o++;
          }
        }
        findIndex(a, l) {
          let o = 0;
          for (let n of this) {
            if (Reflect.apply(a, l, [n, o, this])) return o;
            o++;
          }
          return -1;
        }
        filter(a, l) {
          let o = [],
            n = 0;
          for (let u of this) (Reflect.apply(a, l, [u, n, this]) && o.push(u), n++);
          return new Nt(o);
        }
        map(a, l) {
          let o = [],
            n = 0;
          for (let u of this) (o.push([u[0], Reflect.apply(a, l, [u, n, this])]), n++);
          return new Nt(o);
        }
        reduce(...a) {
          let [l, o] = a,
            n = 0,
            u = o ?? this.at(0);
          for (let r of this)
            (n === 0 && a.length === 1 ? (u = r) : (u = Reflect.apply(l, this, [u, r, n, this])),
              n++);
          return u;
        }
        reduceRight(...a) {
          let [l, o] = a,
            n = o ?? this.at(-1);
          for (let u = this.size - 1; u >= 0; u--) {
            let r = this.at(u);
            u === this.size - 1 && a.length === 1
              ? (n = r)
              : (n = Reflect.apply(l, this, [n, r, u, this]));
          }
          return n;
        }
        toSorted(a) {
          let l = [...this.entries()].sort(a);
          return new Nt(l);
        }
        toReversed() {
          let a = new Nt();
          for (let l = this.size - 1; l >= 0; l--) {
            let o = this.keyAt(l),
              n = this.get(o);
            a.set(o, n);
          }
          return a;
        }
        toSpliced(...a) {
          let l = [...this.entries()];
          return (l.splice(...a), new Nt(l));
        }
        slice(a, l) {
          let o = new Nt(),
            n = this.size - 1;
          if (a === void 0) return o;
          (a < 0 && (a = a + this.size), l !== void 0 && l > 0 && (n = l - 1));
          for (let u = a; u <= n; u++) {
            let r = this.keyAt(u),
              s = this.get(r);
            o.set(r, s);
          }
          return o;
        }
        every(a, l) {
          let o = 0;
          for (let n of this) {
            if (!Reflect.apply(a, l, [n, o, this])) return !1;
            o++;
          }
          return !0;
        }
        some(a, l) {
          let o = 0;
          for (let n of this) {
            if (Reflect.apply(a, l, [n, o, this])) return !0;
            o++;
          }
          return !1;
        }
      }),
      (ze = new WeakMap()),
      Qe(Nt, 'OrderedDict'),
      Nt);
  function $s(e, t) {
    if ('at' in Array.prototype) return Array.prototype.at.call(e, t);
    let a = kS(e, t);
    return a === -1 ? void 0 : e[a];
  }
  Qe($s, 'at');
  function kS(e, t) {
    let a = e.length,
      l = _d(t),
      o = l >= 0 ? l : a + l;
    return o < 0 || o >= a ? -1 : o;
  }
  Qe(kS, 'toSafeIndex');
  function _d(e) {
    return e !== e || e === 0 ? 0 : Math.trunc(e);
  }
  Qe(_d, 'toSafeInteger');
  function Iw(e) {
    let t = e + 'CollectionProvider',
      [a, l] = nl(t),
      [o, n] = a(t, {
        collectionElement: null,
        collectionRef: { current: null },
        collectionRefObject: { current: null },
        itemMap: new Od(),
        setItemMap: Qe(() => {}, 'setItemMap'),
      }),
      u = Qe(
        ({ state: c, ...x }) => (c ? (0, vo.jsx)(s, { ...x, state: c }) : (0, vo.jsx)(r, { ...x })),
        'CollectionProvider',
      );
    u.displayName = t;
    let r = Qe((c) => {
      let x = v();
      return (0, vo.jsx)(s, { ...c, state: x });
    }, 'CollectionInit');
    r.displayName = t + 'Init';
    let s = Qe((c) => {
      let { scope: x, children: y, state: I } = c,
        b = At.useRef(null),
        [C, R] = At.useState(null),
        T = ge(b, R),
        [B, O] = I;
      return (
        At.useEffect(() => {
          if (!C) return;
          let U = ES(() => {});
          return (
            U.observe(C, { childList: !0, subtree: !0 }),
            () => {
              U.disconnect();
            }
          );
        }, [C]),
        (0, vo.jsx)(o, {
          scope: x,
          itemMap: B,
          setItemMap: O,
          collectionRef: T,
          collectionRefObject: b,
          collectionElement: C,
          children: y,
        })
      );
    }, 'CollectionProviderImpl');
    s.displayName = t + 'Impl';
    let i = e + 'CollectionSlot',
      h = da(i),
      m = At.forwardRef((c, x) => {
        let { scope: y, children: I } = c,
          b = n(i, y),
          C = ge(x, b.collectionRef);
        return (0, vo.jsx)(h, { ref: C, children: I });
      });
    m.displayName = i;
    let f = e + 'CollectionItemSlot',
      p = 'data-radix-collection-item',
      L = da(f),
      S = At.forwardRef((c, x) => {
        let { scope: y, children: I, ...b } = c,
          C = At.useRef(null),
          [R, T] = At.useState(null),
          B = ge(x, C, T),
          O = n(f, y),
          { setItemMap: U } = O,
          Q = At.useRef(b);
        MS(Q.current, b) || (Q.current = b);
        let ae = Q.current;
        return (
          At.useEffect(() => {
            let z = ae;
            return (
              U((j) =>
                R
                  ? j.has(R)
                    ? j.set(R, { ...z, element: R }).toSorted(Bd)
                    : (j.set(R, { ...z, element: R }), j.toSorted(Bd))
                  : j,
              ),
              () => {
                U((j) => (!R || !j.has(R) ? j : (j.delete(R), new Od(j))));
              }
            );
          }, [R, ae, U]),
          (0, vo.jsx)(L, { [p]: '', ref: B, children: I })
        );
      });
    S.displayName = f;
    function v() {
      return At.useState(new Od());
    }
    Qe(v, 'useInitCollection');
    function g(c) {
      let { itemMap: x } = n(e + 'CollectionConsumer', c);
      return x;
    }
    return (
      Qe(g, 'useCollection'),
      [
        { Provider: u, Slot: m, ItemSlot: S },
        { createCollectionScope: l, useCollection: g, useInitCollection: v },
      ]
    );
  }
  Qe(Iw, 'createCollection');
  function MS(e, t) {
    if (e === t) return !0;
    if (typeof e != 'object' || typeof t != 'object' || e == null || t == null) return !1;
    let a = Object.keys(e),
      l = Object.keys(t);
    if (a.length !== l.length) return !1;
    for (let o of a) if (!Object.prototype.hasOwnProperty.call(t, o) || e[o] !== t[o]) return !1;
    return !0;
  }
  Qe(MS, 'shallowEqual');
  function DS(e, t) {
    return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING);
  }
  Qe(DS, 'isElementPreceding');
  function Bd(e, t) {
    return !e[1].element || !t[1].element ? 0 : DS(e[1].element, t[1].element) ? -1 : 1;
  }
  Qe(Bd, 'sortByDocumentPosition');
  function ES(e) {
    return new MutationObserver((a) => {
      for (let l of a)
        if (l.type === 'childList') {
          e();
          return;
        }
    });
  }
  Qe(ES, 'getChildListObserver');
  var ei = A(P(), 1),
    Aw = A(G(), 1),
    ww = Object.defineProperty,
    Rw = (e, t) => ww(e, 'name', { value: t, configurable: !0 }),
    Tw = ei.createContext(void 0);
  function Ud(e) {
    let t = ei.useContext(Tw);
    return e || t || 'ltr';
  }
  Rw(Ud, 'useDirection');
  var de = A(P(), 1);
  var OS = A(P(), 1),
    BS = A(Ho(), 1);
  var PS = A(G(), 1),
    kw = Object.defineProperty,
    Mw = (e, t) => kw(e, 'name', { value: t, configurable: !0 }),
    Dw = [
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
    We = Dw.reduce((e, t) => {
      let a = da(`Primitive.${t}`),
        l = OS.forwardRef((o, n) => {
          let { asChild: u, ...r } = o,
            s = u ? a : t;
          return (
            typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0),
            (0, PS.jsx)(s, { ...r, ref: n })
          );
        });
      return ((l.displayName = `Primitive.${t}`), { ...e, [t]: l });
    }, {});
  function Hd(e, t) {
    e && BS.flushSync(() => e.dispatchEvent(t));
  }
  Mw(Hd, 'dispatchDiscreteCustomEvent');
  var Bn = A(P(), 1),
    Ew = Object.defineProperty,
    Ow = (e, t) => Ew(e, 'name', { value: t, configurable: !0 });
  function Tt(e) {
    let t = Bn.useRef(e);
    return (
      Bn.useEffect(() => {
        t.current = e;
      }),
      Bn.useMemo(
        () =>
          (...a) =>
            t.current?.(...a),
        [],
      )
    );
  }
  Ow(Tt, 'useCallbackRef');
  var US = A(G(), 1),
    Bw = Object.defineProperty,
    Je = (e, t) => Bw(e, 'name', { value: t, configurable: !0 }),
    zd = 'dismissableLayer.update',
    Pw = 'dismissableLayer.pointerDownOutside',
    _w = 'dismissableLayer.focusOutside',
    _S,
    HS = de.createContext({
      layers: new Set(),
      layersWithOutsidePointerEventsDisabled: new Set(),
      branches: new Set(),
      dismissableSurfaces: new Set(),
    }),
    zS = de.forwardRef(
      Je(function (t, a) {
        let {
            disableOutsidePointerEvents: l = !1,
            deferPointerDownOutside: o = !1,
            onEscapeKeyDown: n,
            onPointerDownOutside: u,
            onFocusOutside: r,
            onInteractOutside: s,
            onDismiss: i,
            ...h
          } = t,
          m = de.useContext(HS),
          [f, p] = de.useState(null),
          L = f?.ownerDocument ?? globalThis?.document,
          [, S] = de.useState({}),
          v = ge(a, p),
          g = Array.from(m.layers),
          [d] = [...m.layersWithOutsidePointerEventsDisabled].slice(-1),
          c = d ? g.indexOf(d) : -1,
          x = f ? g.indexOf(f) : -1,
          y = m.layersWithOutsidePointerEventsDisabled.size > 0,
          I = x >= c,
          b = de.useRef(!1),
          C = NS(
            (O) => {
              (u?.(O), s?.(O), O.defaultPrevented || i?.());
            },
            {
              ownerDocument: L,
              deferPointerDownOutside: o,
              isDeferredPointerDownOutsideRef: b,
              dismissableSurfaces: m.dismissableSurfaces,
              shouldHandlePointerDownOutside: de.useCallback(
                (O) => {
                  if (!(O instanceof Node)) return !1;
                  let U = [...m.branches].some((Q) => Q.contains(O));
                  return I && !U;
                },
                [m.branches, I],
              ),
            },
          ),
          R = qS((O) => {
            if (o && b.current) return;
            let U = O.target;
            [...m.branches].some((ae) => ae.contains(U)) ||
              (r?.(O), s?.(O), O.defaultPrevented || i?.());
          }, L),
          T = f ? x === g.length - 1 : !1,
          B = Tt((O) => {
            O.key === 'Escape' && (n?.(O), !O.defaultPrevented && i && (O.preventDefault(), i()));
          });
        return (
          de.useEffect(() => {
            if (T)
              return (
                L.addEventListener('keydown', B, { capture: !0 }),
                () => L.removeEventListener('keydown', B, { capture: !0 })
              );
          }, [L, T, B]),
          de.useEffect(() => {
            if (f)
              return (
                l &&
                  (m.layersWithOutsidePointerEventsDisabled.size === 0 &&
                    ((_S = L.body.style.pointerEvents), (L.body.style.pointerEvents = 'none')),
                  m.layersWithOutsidePointerEventsDisabled.add(f)),
                m.layers.add(f),
                Nd(),
                () => {
                  l &&
                    (m.layersWithOutsidePointerEventsDisabled.delete(f),
                    m.layersWithOutsidePointerEventsDisabled.size === 0 &&
                      (L.body.style.pointerEvents = _S));
                }
              );
          }, [f, L, l, m]),
          de.useEffect(
            () => () => {
              f && (m.layers.delete(f), m.layersWithOutsidePointerEventsDisabled.delete(f), Nd());
            },
            [f, m],
          ),
          de.useEffect(() => {
            let O = Je(() => S({}), 'handleUpdate');
            return (document.addEventListener(zd, O), () => document.removeEventListener(zd, O));
          }, []),
          (0, US.jsx)(We.div, {
            ...h,
            ref: v,
            style: { pointerEvents: y ? (I ? 'auto' : 'none') : void 0, ...t.style },
            onFocusCapture: He(t.onFocusCapture, R.onFocusCapture),
            onBlurCapture: He(t.onBlurCapture, R.onBlurCapture),
            onPointerDownCapture: He(t.onPointerDownCapture, C.onPointerDownCapture),
          })
        );
      }, 'DismissableLayer'),
    );
  function Uw() {
    let e = de.useContext(HS),
      [t, a] = de.useState(null);
    return (
      de.useEffect(() => {
        if (t)
          return (
            e.dismissableSurfaces.add(t),
            () => {
              e.dismissableSurfaces.delete(t);
            }
          );
      }, [t, e.dismissableSurfaces]),
      a
    );
  }
  Je(Uw, 'useDismissableLayerSurface');
  var Hw = Je(() => !0, 'IS_TRUE');
  function NS(e, t) {
    let {
        ownerDocument: a = globalThis?.document,
        deferPointerDownOutside: l = !1,
        isDeferredPointerDownOutsideRef: o,
        dismissableSurfaces: n,
        shouldHandlePointerDownOutside: u = Hw,
      } = t,
      r = Tt(e),
      s = de.useRef(!1),
      i = de.useRef(!1),
      h = de.useRef(new Map()),
      m = de.useRef(() => {});
    return (
      de.useEffect(() => {
        function f() {
          ((i.current = !1), (o.current = !1), h.current.clear());
        }
        Je(f, 'resetOutsideInteraction');
        function p() {
          return Array.from(h.current.values()).some(Boolean);
        }
        Je(p, 'isOutsideInteractionIntercepted');
        function L(c) {
          if (!i.current) return;
          let x = c.target;
          ((x instanceof Node && [...n].some((I) => I.contains(x))) || h.current.set(c.type, !0),
            c.type === 'click' &&
              window.setTimeout(() => {
                i.current && m.current();
              }, 0));
        }
        Je(L, 'handleInteractionCapture');
        function S(c) {
          i.current && h.current.set(c.type, !1);
        }
        Je(S, 'handleInteractionBubble');
        let v = Je((c) => {
            if (c.target && !s.current) {
              let y = function () {
                a.removeEventListener('click', m.current);
                let b = p();
                (f(), b || qd(Pw, r, I, { discrete: !0 }));
              };
              var x = y;
              if ((Je(y, 'handleAndDispatchPointerDownOutsideEvent'), !u(c.target))) {
                (a.removeEventListener('click', m.current), f(), (s.current = !1));
                return;
              }
              let I = { originalEvent: c };
              ((i.current = !0),
                (o.current = l && c.button === 0),
                h.current.clear(),
                !l || c.button !== 0
                  ? y()
                  : (a.removeEventListener('click', m.current),
                    (m.current = y),
                    a.addEventListener('click', m.current, { once: !0 })));
            } else (a.removeEventListener('click', m.current), f());
            s.current = !1;
          }, 'handlePointerDown'),
          g = ['pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click'];
        for (let c of g) (a.addEventListener(c, L, !0), a.addEventListener(c, S));
        let d = window.setTimeout(() => {
          a.addEventListener('pointerdown', v);
        }, 0);
        return () => {
          (window.clearTimeout(d),
            a.removeEventListener('pointerdown', v),
            a.removeEventListener('click', m.current));
          for (let c of g) (a.removeEventListener(c, L, !0), a.removeEventListener(c, S));
        };
      }, [a, r, l, o, n, u]),
      { onPointerDownCapture: Je(() => (s.current = !0), 'onPointerDownCapture') }
    );
  }
  Je(NS, 'usePointerDownOutside');
  function qS(e, t = globalThis?.document) {
    let a = Tt(e),
      l = de.useRef(!1);
    return (
      de.useEffect(() => {
        let o = Je((n) => {
          n.target && !l.current && qd(_w, a, { originalEvent: n }, { discrete: !1 });
        }, 'handleFocus');
        return (t.addEventListener('focusin', o), () => t.removeEventListener('focusin', o));
      }, [t, a]),
      {
        onFocusCapture: Je(() => (l.current = !0), 'onFocusCapture'),
        onBlurCapture: Je(() => (l.current = !1), 'onBlurCapture'),
      }
    );
  }
  Je(qS, 'useFocusOutside');
  function Nd() {
    let e = new CustomEvent(zd);
    document.dispatchEvent(e);
  }
  Je(Nd, 'dispatchUpdate');
  function qd(e, t, a, { discrete: l }) {
    let o = a.originalEvent.target,
      n = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: a });
    (t && o.addEventListener(e, t, { once: !0 }), l ? Hd(o, n) : o.dispatchEvent(n));
  }
  Je(qd, 'handleAndDispatchCustomEvent');
  var FS = A(P(), 1),
    zw = Object.defineProperty,
    Gd = (e, t) => zw(e, 'name', { value: t, configurable: !0 }),
    ti = 0,
    Pn = null;
  function Nw(e) {
    return (ai(), e.children);
  }
  Gd(Nw, 'FocusGuards');
  function ai() {
    FS.useEffect(() => {
      Pn || (Pn = { start: Fd(), end: Fd() });
      let { start: e, end: t } = Pn;
      return (
        document.body.firstElementChild !== e &&
          document.body.insertAdjacentElement('afterbegin', e),
        document.body.lastElementChild !== t && document.body.insertAdjacentElement('beforeend', t),
        ti++,
        () => {
          (ti === 1 && (Pn?.start.remove(), Pn?.end.remove(), (Pn = null)),
            (ti = Math.max(0, ti - 1)));
        }
      );
    }, []);
  }
  Gd(ai, 'useFocusGuards');
  function Fd() {
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
  Gd(Fd, 'createFocusGuard');
  var oa = A(P(), 1);
  var XS = A(G(), 1),
    qw = Object.defineProperty,
    gt = (e, t) => qw(e, 'name', { value: t, configurable: !0 }),
    Vd = 'focusScope.autoFocusOnMount',
    Xd = 'focusScope.autoFocusOnUnmount',
    GS = { bubbles: !1, cancelable: !0 },
    jS = oa.forwardRef(
      gt(function (t, a) {
        let { loop: l = !1, trapped: o = !1, onMountAutoFocus: n, onUnmountAutoFocus: u, ...r } = t,
          [s, i] = oa.useState(null),
          h = Tt(n),
          m = Tt(u),
          f = oa.useRef(null),
          p = ge(a, i),
          L = oa.useRef({
            paused: !1,
            pause() {
              this.paused = !0;
            },
            resume() {
              this.paused = !1;
            },
          }).current;
        (oa.useEffect(() => {
          if (o) {
            let c = function (b) {
                if (L.paused || !s) return;
                let C = b.target;
                s.contains(C) ? (f.current = C) : ul(f.current, { select: !0 });
              },
              x = function (b) {
                if (L.paused || !s) return;
                let C = b.relatedTarget;
                C !== null && (s.contains(C) || ul(f.current, { select: !0 }));
              },
              y = function (b) {
                if (document.activeElement === document.body)
                  for (let R of b) R.removedNodes.length > 0 && ul(s);
              };
            var v = c,
              g = x,
              d = y;
            (gt(c, 'handleFocusIn'),
              gt(x, 'handleFocusOut'),
              gt(y, 'handleMutations'),
              document.addEventListener('focusin', c),
              document.addEventListener('focusout', x));
            let I = new MutationObserver(y);
            return (
              s && I.observe(s, { childList: !0, subtree: !0 }),
              () => {
                (document.removeEventListener('focusin', c),
                  document.removeEventListener('focusout', x),
                  I.disconnect());
              }
            );
          }
        }, [o, s, L.paused]),
          oa.useEffect(() => {
            if (s) {
              VS.add(L);
              let v = document.activeElement;
              if (!s.contains(v)) {
                let d = new CustomEvent(Vd, GS);
                (s.addEventListener(Vd, h),
                  s.dispatchEvent(d),
                  d.defaultPrevented ||
                    (YS(JS(Kd(s)), { select: !0 }), document.activeElement === v && ul(s)));
              }
              return () => {
                (s.removeEventListener(Vd, h),
                  setTimeout(() => {
                    let d = new CustomEvent(Xd, GS);
                    (s.addEventListener(Xd, m),
                      s.dispatchEvent(d),
                      d.defaultPrevented || ul(v ?? document.body, { select: !0 }),
                      s.removeEventListener(Xd, m),
                      VS.remove(L));
                  }, 0));
              };
            }
          }, [s, h, m, L]));
        let S = oa.useCallback(
          (v) => {
            if ((!l && !o) || L.paused) return;
            let g = v.key === 'Tab' && !v.altKey && !v.ctrlKey && !v.metaKey,
              d = document.activeElement;
            if (g && d) {
              let c = v.currentTarget,
                [x, y] = KS(c);
              x && y
                ? !v.shiftKey && d === y
                  ? (v.preventDefault(), l && ul(x, { select: !0 }))
                  : v.shiftKey && d === x && (v.preventDefault(), l && ul(y, { select: !0 }))
                : d === c && v.preventDefault();
            }
          },
          [l, o, L.paused],
        );
        return (0, XS.jsx)(We.div, { tabIndex: -1, ...r, ref: p, onKeyDown: S });
      }, 'FocusScope'),
    );
  function YS(e, { select: t = !1 } = {}) {
    let a = document.activeElement;
    for (let l of e) if ((ul(l, { select: t }), document.activeElement !== a)) return;
  }
  gt(YS, 'focusFirst');
  function KS(e) {
    let t = Kd(e),
      a = jd(t, e),
      l = jd(t.reverse(), e);
    return [a, l];
  }
  gt(KS, 'getTabbableEdges');
  function Kd(e) {
    let t = [],
      a = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
        acceptNode: gt((l) => {
          let o = l.tagName === 'INPUT' && l.type === 'hidden';
          return l.disabled || l.hidden || o
            ? NodeFilter.FILTER_SKIP
            : l.tabIndex >= 0
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
        }, 'acceptNode'),
      });
    for (; a.nextNode();) t.push(a.currentNode);
    return t;
  }
  gt(Kd, 'getTabbableCandidates');
  function jd(e, t) {
    let a = typeof t.checkVisibility == 'function' && t.checkVisibility({ checkVisibilityCSS: !0 });
    for (let l of e)
      if (!(a ? !l.checkVisibility({ checkVisibilityCSS: !0 }) : ZS(l, { upTo: t }))) return l;
  }
  gt(jd, 'findVisible');
  function ZS(e, { upTo: t }) {
    if (getComputedStyle(e).visibility === 'hidden') return !0;
    for (; e;) {
      if (t !== void 0 && e === t) return !1;
      if (getComputedStyle(e).display === 'none') return !0;
      e = e.parentElement;
    }
    return !1;
  }
  gt(ZS, 'isHidden');
  function QS(e) {
    return e instanceof HTMLInputElement && 'select' in e;
  }
  gt(QS, 'isSelectableInput');
  function ul(e, { select: t = !1 } = {}) {
    if (e && e.focus) {
      let a = document.activeElement;
      (e.focus({ preventScroll: !0 }), e !== a && QS(e) && t && e.select());
    }
  }
  gt(ul, 'focus');
  var VS = WS();
  function WS() {
    let e = [];
    return {
      add(t) {
        let a = e[0];
        (t !== a && a?.pause(), (e = Yd(e, t)), e.unshift(t));
      },
      remove(t) {
        ((e = Yd(e, t)), e[0]?.resume());
      },
    };
  }
  gt(WS, 'createFocusScopesStack');
  function Yd(e, t) {
    let a = [...e],
      l = a.indexOf(t);
    return (l !== -1 && a.splice(l, 1), a);
  }
  gt(Yd, 'arrayRemove');
  function JS(e) {
    return e.filter((t) => t.tagName !== 'A');
  }
  gt(JS, 'removeLinks');
  var Zd = A(P(), 1);
  var $S = A(P(), 1),
    Ae = globalThis?.document ? $S.useLayoutEffect : () => {};
  var Fw = Object.defineProperty,
    Gw = (e, t) => Fw(e, 'name', { value: t, configurable: !0 }),
    Vw = Zd[' useId '.trim().toString()] || (() => {}),
    Xw = 0;
  function li(e) {
    let [t, a] = Zd.useState(Vw());
    return (
      Ae(() => {
        e || a((l) => l ?? String(Xw++));
      }, [e]),
      e || (t ? `radix-${t}` : '')
    );
  }
  Gw(li, 'useId');
  var ft = A(P(), 1);
  var av = ['top', 'right', 'bottom', 'left'];
  var Da = Math.min,
    pa = Math.max,
    ar = Math.round,
    lr = Math.floor,
    Ea = (e) => ({ x: e, y: e }),
    jw = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  function Qd(e, t, a) {
    return pa(e, Da(t, a));
  }
  function Oa(e, t) {
    return typeof e == 'function' ? e(t) : e;
  }
  function rl(e) {
    return e.split('-')[0];
  }
  function yo(e) {
    return e.split('-')[1];
  }
  function ni(e) {
    return e === 'x' ? 'y' : 'x';
  }
  function ui(e) {
    return e === 'y' ? 'height' : 'width';
  }
  function ha(e) {
    let t = e[0];
    return t === 't' || t === 'b' ? 'y' : 'x';
  }
  function ri(e) {
    return ni(ha(e));
  }
  function lv(e, t, a) {
    a === void 0 && (a = !1);
    let l = yo(e),
      o = ri(e),
      n = ui(o),
      u =
        o === 'x'
          ? l === (a ? 'end' : 'start')
            ? 'right'
            : 'left'
          : l === 'start'
            ? 'bottom'
            : 'top';
    return (t.reference[n] > t.floating[n] && (u = tr(u)), [u, tr(u)]);
  }
  function ov(e) {
    let t = tr(e);
    return [oi(e), t, oi(t)];
  }
  function oi(e) {
    return e.includes('start') ? e.replace('start', 'end') : e.replace('end', 'start');
  }
  var ev = ['left', 'right'],
    tv = ['right', 'left'],
    Yw = ['top', 'bottom'],
    Kw = ['bottom', 'top'];
  function Zw(e, t, a) {
    switch (e) {
      case 'top':
      case 'bottom':
        return a ? (t ? tv : ev) : t ? ev : tv;
      case 'left':
      case 'right':
        return t ? Yw : Kw;
      default:
        return [];
    }
  }
  function nv(e, t, a, l) {
    let o = yo(e),
      n = Zw(rl(e), a === 'start', l);
    return (o && ((n = n.map((u) => u + '-' + o)), t && (n = n.concat(n.map(oi)))), n);
  }
  function tr(e) {
    let t = rl(e);
    return jw[t] + e.slice(t.length);
  }
  function Qw(e) {
    var t, a, l, o;
    return {
      top: (t = e.top) != null ? t : 0,
      right: (a = e.right) != null ? a : 0,
      bottom: (l = e.bottom) != null ? l : 0,
      left: (o = e.left) != null ? o : 0,
    };
  }
  function Wd(e) {
    return typeof e != 'number' ? Qw(e) : { top: e, right: e, bottom: e, left: e };
  }
  function Co(e) {
    let { x: t, y: a, width: l, height: o } = e;
    return { width: l, height: o, top: a, left: t, right: t + l, bottom: a + o, x: t, y: a };
  }
  function uv(e, t, a) {
    let { reference: l, floating: o } = e,
      n = ha(t),
      u = ri(t),
      r = ui(u),
      s = rl(t),
      i = n === 'y',
      h = l.x + l.width / 2 - o.width / 2,
      m = l.y + l.height / 2 - o.height / 2,
      f = l[r] / 2 - o[r] / 2,
      p;
    switch (s) {
      case 'top':
        p = { x: h, y: l.y - o.height };
        break;
      case 'bottom':
        p = { x: h, y: l.y + l.height };
        break;
      case 'right':
        p = { x: l.x + l.width, y: m };
        break;
      case 'left':
        p = { x: l.x - o.width, y: m };
        break;
      default:
        p = { x: l.x, y: l.y };
    }
    let L = yo(t);
    return (L && (p[u] += f * (L === 'end' ? 1 : -1) * (a && i ? -1 : 1)), p);
  }
  async function iv(e, t) {
    var a;
    t === void 0 && (t = {});
    let { x: l, y: o, platform: n, rects: u, elements: r, strategy: s } = e,
      {
        boundary: i = 'clippingAncestors',
        rootBoundary: h = 'viewport',
        elementContext: m = 'floating',
        altBoundary: f = !1,
        padding: p = 0,
      } = Oa(t, e),
      L = Wd(p),
      v = r[f ? (m === 'floating' ? 'reference' : 'floating') : m],
      g = Co(
        await n.getClippingRect({
          element:
            (a = await (n.isElement == null ? void 0 : n.isElement(v))) == null || a
              ? v
              : v.contextElement ||
                (await (n.getDocumentElement == null ? void 0 : n.getDocumentElement(r.floating))),
          boundary: i,
          rootBoundary: h,
          strategy: s,
        }),
      ),
      d =
        m === 'floating'
          ? { x: l, y: o, width: u.floating.width, height: u.floating.height }
          : u.reference,
      c = await (n.getOffsetParent == null ? void 0 : n.getOffsetParent(r.floating)),
      x = ((await (n.isElement == null ? void 0 : n.isElement(c))) &&
        (await (n.getScale == null ? void 0 : n.getScale(c)))) || { x: 1, y: 1 },
      y = Co(
        n.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await n.convertOffsetParentRelativeRectToViewportRelativeRect({
              elements: r,
              rect: d,
              offsetParent: c,
              strategy: s,
            })
          : d,
      );
    return {
      top: (g.top - y.top + L.top) / x.y,
      bottom: (y.bottom - g.bottom + L.bottom) / x.y,
      left: (g.left - y.left + L.left) / x.x,
      right: (y.right - g.right + L.right) / x.x,
    };
  }
  var Ww = 50,
    fv = async (e, t, a) => {
      let {
          placement: l = 'bottom',
          strategy: o = 'absolute',
          middleware: n = [],
          platform: u,
        } = a,
        r = u.detectOverflow ? u : { ...u, detectOverflow: iv },
        s = await (u.isRTL == null ? void 0 : u.isRTL(t)),
        i = await u.getElementRects({ reference: e, floating: t, strategy: o }),
        { x: h, y: m } = uv(i, l, s),
        f = l,
        p = 0,
        L = {};
      for (let S = 0; S < n.length; S++) {
        let v = n[S];
        if (!v) continue;
        let { name: g, fn: d } = v,
          {
            x: c,
            y: x,
            data: y,
            reset: I,
          } = await d({
            x: h,
            y: m,
            initialPlacement: l,
            placement: f,
            strategy: o,
            middlewareData: L,
            rects: i,
            platform: r,
            elements: { reference: e, floating: t },
          });
        ((h = c ?? h),
          (m = x ?? m),
          (L[g] = { ...L[g], ...y }),
          I &&
            p < Ww &&
            (p++,
            typeof I == 'object' &&
              (I.placement && (f = I.placement),
              I.rects &&
                (i =
                  I.rects === !0
                    ? await u.getElementRects({ reference: e, floating: t, strategy: o })
                    : I.rects),
              ({ x: h, y: m } = uv(i, f, s))),
            (S = -1)));
      }
      return { x: h, y: m, placement: f, strategy: o, middlewareData: L };
    },
    cv = (e) => ({
      name: 'arrow',
      options: e,
      async fn(t) {
        let { x: a, y: l, placement: o, rects: n, platform: u, elements: r, middlewareData: s } = t,
          { element: i, padding: h = 0 } = Oa(e, t) || {};
        if (i == null) return {};
        let m = Wd(h),
          f = { x: a, y: l },
          p = ri(o),
          L = ui(p),
          S = await u.getDimensions(i),
          v = p === 'y',
          g = v ? 'top' : 'left',
          d = v ? 'bottom' : 'right',
          c = v ? 'clientHeight' : 'clientWidth',
          x = n.reference[L] + n.reference[p] - f[p] - n.floating[L],
          y = f[p] - n.reference[p],
          I = await (u.getOffsetParent == null ? void 0 : u.getOffsetParent(i)),
          b = I ? I[c] : 0;
        (!b || !(await (u.isElement == null ? void 0 : u.isElement(I)))) &&
          (b = r.floating[c] || n.floating[L]);
        let C = x / 2 - y / 2,
          R = b / 2 - S[L] / 2 - 1,
          T = Da(m[g], R),
          B = Da(m[d], R),
          O = b - S[L] - B,
          U = b / 2 - S[L] / 2 + C,
          Q = Qd(T, U, O),
          ae =
            !s.arrow &&
            yo(o) != null &&
            U !== Q &&
            n.reference[L] / 2 - (U < T ? T : B) - S[L] / 2 < 0,
          z = ae ? (U < T ? U - T : U - O) : 0;
        return {
          [p]: f[p] + z,
          data: { [p]: Q, centerOffset: U - Q - z, ...(ae && { alignmentOffset: z }) },
          reset: ae,
        };
      },
    });
  var dv = function (e) {
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
              mainAxis: h = !0,
              crossAxis: m = !0,
              fallbackPlacements: f,
              fallbackStrategy: p = 'bestFit',
              fallbackAxisSideDirection: L = 'none',
              flipAlignment: S = !0,
              ...v
            } = Oa(e, t);
          if ((a = n.arrow) != null && a.alignmentOffset) return {};
          let g = rl(o),
            d = ha(r),
            c = rl(r) === r,
            x = await (s.isRTL == null ? void 0 : s.isRTL(i.floating)),
            y = f || (c || !S ? [tr(r)] : ov(r)),
            I = L !== 'none';
          !f && I && y.push(...nv(r, S, L, x));
          let b = [r, ...y],
            C = await s.detectOverflow(t, v),
            R = [],
            T = ((l = n.flip) == null ? void 0 : l.overflows) || [];
          if ((h && R.push(C[g]), m)) {
            let Q = lv(o, u, x);
            R.push(C[Q[0]], C[Q[1]]);
          }
          if (((T = [...T, { placement: o, overflows: R }]), !R.every((Q) => Q <= 0))) {
            var B, O;
            let Q = (((B = n.flip) == null ? void 0 : B.index) || 0) + 1,
              ae = b[Q];
            if (
              ae &&
              (!(m === 'alignment' ? d !== ha(ae) : !1) ||
                T.every((N) => (ha(N.placement) === d ? N.overflows[0] > 0 : !0)))
            )
              return { data: { index: Q, overflows: T }, reset: { placement: ae } };
            let z =
              (O = T.filter((j) => j.overflows[0] <= 0).sort(
                (j, N) => j.overflows[1] - N.overflows[1],
              )[0]) == null
                ? void 0
                : O.placement;
            if (!z)
              switch (p) {
                case 'bestFit': {
                  var U;
                  let j =
                    (U = T.filter((N) => {
                      if (I) {
                        let le = ha(N.placement);
                        return le === d || le === 'y';
                      }
                      return !0;
                    })
                      .map((N) => [
                        N.placement,
                        N.overflows.filter((le) => le > 0).reduce((le, k) => le + k, 0),
                      ])
                      .sort((N, le) => N[1] - le[1])[0]) == null
                      ? void 0
                      : U[0];
                  j && (z = j);
                  break;
                }
                case 'initialPlacement':
                  z = r;
                  break;
              }
            if (o !== z) return { reset: { placement: z } };
          }
          return {};
        },
      }
    );
  };
  function rv(e, t) {
    return {
      top: e.top - t.height,
      right: e.right - t.width,
      bottom: e.bottom - t.height,
      left: e.left - t.width,
    };
  }
  function sv(e) {
    return av.some((t) => e[t] >= 0);
  }
  var mv = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: 'hide',
        options: e,
        async fn(t) {
          let { rects: a, platform: l } = t,
            { strategy: o = 'referenceHidden', ...n } = Oa(e, t);
          switch (o) {
            case 'referenceHidden': {
              let u = await l.detectOverflow(t, { ...n, elementContext: 'reference' }),
                r = rv(u, a.reference);
              return { data: { referenceHiddenOffsets: r, referenceHidden: sv(r) } };
            }
            case 'escaped': {
              let u = await l.detectOverflow(t, { ...n, altBoundary: !0 }),
                r = rv(u, a.floating);
              return { data: { escapedOffsets: r, escaped: sv(r) } };
            }
            default:
              return {};
          }
        },
      }
    );
  };
  var pv = new Set(['left', 'top']);
  async function Jw(e, t) {
    let { placement: a, platform: l, elements: o } = e,
      n = await (l.isRTL == null ? void 0 : l.isRTL(o.floating)),
      u = rl(a),
      r = yo(a),
      s = ha(a) === 'y',
      i = pv.has(u) ? -1 : 1,
      h = n && s ? -1 : 1,
      m = Oa(t, e),
      {
        mainAxis: f,
        crossAxis: p,
        alignmentAxis: L,
      } = typeof m == 'number'
        ? { mainAxis: m, crossAxis: 0, alignmentAxis: null }
        : {
            mainAxis: m.mainAxis || 0,
            crossAxis: m.crossAxis || 0,
            alignmentAxis: m.alignmentAxis,
          };
    return (
      r && typeof L == 'number' && (p = r === 'end' ? L * -1 : L),
      s ? { x: p * h, y: f * i } : { x: f * i, y: p * h }
    );
  }
  var hv = function (e) {
      return (
        e === void 0 && (e = 0),
        {
          name: 'offset',
          options: e,
          async fn(t) {
            var a, l;
            let { x: o, y: n, placement: u, middlewareData: r } = t,
              s = await Jw(t, e);
            return u === ((a = r.offset) == null ? void 0 : a.placement) &&
              (l = r.arrow) != null &&
              l.alignmentOffset
              ? {}
              : { x: o + s.x, y: n + s.y, data: { ...s, placement: u } };
          },
        }
      );
    },
    gv = function (e) {
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
                  fn: (d) => {
                    let { x: c, y: x } = d;
                    return { x: c, y: x };
                  },
                },
                ...i
              } = Oa(e, t),
              h = { x: a, y: l },
              m = await n.detectOverflow(t, i),
              f = ha(o),
              p = ni(f),
              L = h[p],
              S = h[f],
              v = (d, c) =>
                Qd(c + m[d === 'y' ? 'top' : 'left'], c, c - m[d === 'y' ? 'bottom' : 'right']);
            (u && (L = v(p, L)), r && (S = v(f, S)));
            let g = s.fn({ ...t, [p]: L, [f]: S });
            return { ...g, data: { x: g.x - a, y: g.y - l, enabled: { [p]: u, [f]: r } } };
          },
        }
      );
    },
    xv = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          options: e,
          fn(t) {
            var a, l;
            let { x: o, y: n, placement: u, rects: r, middlewareData: s } = t,
              { offset: i = 0, mainAxis: h = !0, crossAxis: m = !0 } = Oa(e, t),
              f = { x: o, y: n },
              p = ha(u),
              L = ni(p),
              S = f[L],
              v = f[p],
              g = Oa(i, t),
              d =
                typeof g == 'number'
                  ? { mainAxis: g, crossAxis: 0 }
                  : {
                      mainAxis: (a = g.mainAxis) != null ? a : 0,
                      crossAxis: (l = g.crossAxis) != null ? l : 0,
                    };
            if (h) {
              let y = L === 'y' ? 'height' : 'width',
                I = r.reference[L] - r.floating[y] + d.mainAxis,
                b = r.reference[L] + r.reference[y] - d.mainAxis;
              S < I ? (S = I) : S > b && (S = b);
            }
            if (m) {
              var c, x;
              let y = L === 'y' ? 'width' : 'height',
                I = pv.has(rl(u)),
                b =
                  r.reference[p] -
                  r.floating[y] +
                  ((I && ((c = s.offset) == null ? void 0 : c[p])) || 0) +
                  (I ? 0 : d.crossAxis),
                C =
                  r.reference[p] +
                  r.reference[y] +
                  (I ? 0 : ((x = s.offset) == null ? void 0 : x[p]) || 0) -
                  (I ? d.crossAxis : 0);
              v < b ? (v = b) : v > C && (v = C);
            }
            return { [L]: S, [p]: v };
          },
        }
      );
    },
    Lv = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: 'size',
          options: e,
          async fn(t) {
            let { placement: a, rects: l, platform: o, elements: n } = t,
              { apply: u = () => {}, ...r } = Oa(e, t),
              s = await o.detectOverflow(t, r),
              i = rl(a),
              h = yo(a),
              m = ha(a) === 'y',
              { width: f, height: p } = l.floating,
              L,
              S;
            i === 'top' || i === 'bottom'
              ? ((L = i),
                (S =
                  h === ((await (o.isRTL == null ? void 0 : o.isRTL(n.floating))) ? 'start' : 'end')
                    ? 'left'
                    : 'right'))
              : ((S = i), (L = h === 'end' ? 'top' : 'bottom'));
            let v = p - s.top - s.bottom,
              g = f - s.left - s.right,
              d = Da(p - s[L], v),
              c = Da(f - s[S], g),
              x = t.middlewareData.shift,
              y = !x,
              I = d,
              b = c;
            (x != null && x.enabled.x && (b = g),
              x != null && x.enabled.y && (I = v),
              y &&
                !h &&
                (m ? (b = f - 2 * pa(s.left, s.right)) : (I = p - 2 * pa(s.top, s.bottom))),
              await u({ ...t, availableWidth: b, availableHeight: I }));
            let C = await o.getDimensions(n.floating);
            return f !== C.width || p !== C.height ? { reset: { rects: !0 } } : {};
          },
        }
      );
    };
  function si() {
    return typeof window < 'u';
  }
  function wo(e) {
    return vv(e) ? (e.nodeName || '').toLowerCase() : '#document';
  }
  function xt(e) {
    var t;
    return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
  }
  function Ba(e) {
    var t;
    return (t = (vv(e) ? e.ownerDocument : e.document) || window.document) == null
      ? void 0
      : t.documentElement;
  }
  function vv(e) {
    return si() ? e instanceof Node || e instanceof xt(e).Node : !1;
  }
  function ga(e) {
    return si() ? e instanceof Element || e instanceof xt(e).Element : !1;
  }
  function sl(e) {
    return si() ? e instanceof HTMLElement || e instanceof xt(e).HTMLElement : !1;
  }
  function Sv(e) {
    return !si() || typeof ShadowRoot > 'u'
      ? !1
      : e instanceof ShadowRoot || e instanceof xt(e).ShadowRoot;
  }
  function or(e) {
    let { overflow: t, overflowX: a, overflowY: l, display: o } = xa(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + l + a) && o !== 'inline' && o !== 'contents';
  }
  function yv(e) {
    return /^(table|td|th)$/.test(wo(e));
  }
  function nr(e) {
    try {
      if (e.matches(':popover-open')) return !0;
    } catch {}
    try {
      return e.matches(':modal');
    } catch {
      return !1;
    }
  }
  var $w = /transform|translate|scale|rotate|perspective|filter/,
    eR = /paint|layout|strict|content/,
    bo = (e) => !!e && e !== 'none',
    Jd;
  function ii(e) {
    let t = ga(e) ? xa(e) : e;
    return (
      bo(t.transform) ||
      bo(t.translate) ||
      bo(t.scale) ||
      bo(t.rotate) ||
      bo(t.perspective) ||
      (!fi() && (bo(t.backdropFilter) || bo(t.filter))) ||
      $w.test(t.willChange || '') ||
      eR.test(t.contain || '')
    );
  }
  function Cv(e) {
    let t = Gl(e);
    for (; sl(t) && !_n(t);) {
      if (ii(t)) return t;
      if (nr(t)) return null;
      t = Gl(t);
    }
    return null;
  }
  function fi() {
    return (
      Jd == null &&
        (Jd = typeof CSS < 'u' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none')),
      Jd
    );
  }
  function _n(e) {
    return /^(html|body|#document)$/.test(wo(e));
  }
  function xa(e) {
    return xt(e).getComputedStyle(e);
  }
  function ur(e) {
    return ga(e)
      ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
      : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
  }
  function Gl(e) {
    if (wo(e) === 'html') return e;
    let t = e.assignedSlot || e.parentNode || (Sv(e) && e.host) || Ba(e);
    return Sv(t) ? t.host : t;
  }
  function bv(e) {
    let t = Gl(e);
    return _n(t) ? (e.ownerDocument || e).body : sl(t) && or(t) ? t : bv(t);
  }
  function Io(e, t, a) {
    var l;
    (t === void 0 && (t = []), a === void 0 && (a = !0));
    let o = bv(e),
      n = o === ((l = e.ownerDocument) == null ? void 0 : l.body),
      u = xt(o);
    if (n) {
      let r = ci(u);
      return t.concat(u, u.visualViewport || [], or(o) ? o : [], r && a ? Io(r) : []);
    } else return t.concat(o, Io(o, [], a));
  }
  function ci(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
  }
  function Rv(e) {
    let t = xa(e),
      a = parseFloat(t.width) || 0,
      l = parseFloat(t.height) || 0,
      o = sl(e),
      n = o ? e.offsetWidth : a,
      u = o ? e.offsetHeight : l,
      r = ar(a) !== n || ar(l) !== u;
    return (r && ((a = n), (l = u)), { width: a, height: l, $: r });
  }
  function em(e) {
    return ga(e) ? e : e.contextElement;
  }
  function Un(e) {
    let t = em(e);
    if (!sl(t)) return Ea(1);
    let a = t.getBoundingClientRect(),
      { width: l, height: o, $: n } = Rv(t),
      u = (n ? ar(a.width) : a.width) / l,
      r = (n ? ar(a.height) : a.height) / o;
    return (
      (!u || !Number.isFinite(u)) && (u = 1),
      (!r || !Number.isFinite(r)) && (r = 1),
      { x: u, y: r }
    );
  }
  var tR = Ea(0);
  function Av(e) {
    let t = xt(e);
    return !fi() || !t.visualViewport
      ? tR
      : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
  }
  function aR(e, t, a) {
    return (t === void 0 && (t = !1), !!a && t && a === xt(e));
  }
  function Ro(e, t, a, l) {
    (t === void 0 && (t = !1), a === void 0 && (a = !1));
    let o = e.getBoundingClientRect(),
      n = em(e),
      u = Ea(1);
    t && (l ? ga(l) && (u = Un(l)) : (u = Un(e)));
    let r = aR(n, a, l) ? Av(n) : Ea(0),
      s = (o.left + r.x) / u.x,
      i = (o.top + r.y) / u.y,
      h = o.width / u.x,
      m = o.height / u.y;
    if (n && l) {
      let f = xt(n),
        p = ga(l) ? xt(l) : l,
        L = f,
        S = ci(L);
      for (; S && p !== L;) {
        let v = Un(S),
          g = S.getBoundingClientRect(),
          d = xa(S),
          c = g.left + (S.clientLeft + parseFloat(d.paddingLeft)) * v.x,
          x = g.top + (S.clientTop + parseFloat(d.paddingTop)) * v.y;
        ((s *= v.x),
          (i *= v.y),
          (h *= v.x),
          (m *= v.y),
          (s += c),
          (i += x),
          (L = xt(S)),
          (S = ci(L)));
      }
    }
    return Co({ width: h, height: m, x: s, y: i });
  }
  function di(e, t) {
    let a = ur(e).scrollLeft;
    return t ? t.left + a : Ro(Ba(e)).left + a;
  }
  function Tv(e, t) {
    let a = e.getBoundingClientRect(),
      l = a.left + t.scrollLeft - di(e, a),
      o = a.top + t.scrollTop;
    return { x: l, y: o };
  }
  function lR(e) {
    let { elements: t, rect: a, offsetParent: l, strategy: o } = e,
      n = o === 'fixed',
      u = Ba(l),
      r = t ? nr(t.floating) : !1;
    if (l === u || (r && n)) return a;
    let s = { scrollLeft: 0, scrollTop: 0 },
      i = Ea(1),
      h = Ea(0),
      m = sl(l);
    if ((m || !n) && ((wo(l) !== 'body' || or(u)) && (s = ur(l)), m)) {
      let p = Ro(l);
      ((i = Un(l)), (h.x = p.x + l.clientLeft), (h.y = p.y + l.clientTop));
    }
    let f = u && !m && !n ? Tv(u, s) : Ea(0);
    return {
      width: a.width * i.x,
      height: a.height * i.y,
      x: a.x * i.x - s.scrollLeft * i.x + h.x + f.x,
      y: a.y * i.y - s.scrollTop * i.y + h.y + f.y,
    };
  }
  function oR(e) {
    return e.getClientRects ? Array.from(e.getClientRects()) : [];
  }
  function nR(e) {
    let t = ur(e),
      a = e.ownerDocument.body,
      l = pa(e.scrollWidth, e.clientWidth, a.scrollWidth, a.clientWidth),
      o = pa(e.scrollHeight, e.clientHeight, a.scrollHeight, a.clientHeight),
      n = -t.scrollLeft + di(e),
      u = -t.scrollTop;
    return (
      xa(a).direction === 'rtl' && (n += pa(e.clientWidth, a.clientWidth) - l),
      { width: l, height: o, x: n, y: u }
    );
  }
  var uR = 25;
  function rR(e, t, a) {
    a === void 0 && (a = 'viewport');
    let l = a === 'layoutViewport',
      o = xt(e),
      n = Ba(e),
      u = o.visualViewport,
      r = n.clientWidth,
      s = n.clientHeight,
      i = 0,
      h = 0;
    if (u) {
      let f = !fi() || t === 'fixed';
      l
        ? f || ((i = -u.offsetLeft), (h = -u.offsetTop))
        : ((r = u.width), (s = u.height), f && ((i = u.offsetLeft), (h = u.offsetTop)));
    }
    if (di(n) <= 0) {
      let f = n.ownerDocument,
        p = f.body,
        L = getComputedStyle(p),
        S =
          (f.compatMode === 'CSS1Compat' && parseFloat(L.marginLeft) + parseFloat(L.marginRight)) ||
          0,
        v = Math.abs(n.clientWidth - p.clientWidth - S),
        g = getComputedStyle(n).scrollbarGutter === 'stable both-edges' ? v / 2 : v;
      g <= uR && (r -= g);
    }
    return { width: r, height: s, x: i, y: h };
  }
  function sR(e, t) {
    let a = Ro(e, !0, t === 'fixed'),
      l = a.top + e.clientTop,
      o = a.left + e.clientLeft,
      n = Un(e),
      u = e.clientWidth * n.x,
      r = e.clientHeight * n.y,
      s = o * n.x,
      i = l * n.y;
    return { width: u, height: r, x: s, y: i };
  }
  function Iv(e, t, a) {
    let l;
    if (t === 'viewport' || t === 'layoutViewport') l = rR(e, a, t);
    else if (t === 'document') l = nR(Ba(e));
    else if (ga(t)) l = sR(t, a);
    else {
      let o = Av(e);
      l = { x: t.x - o.x, y: t.y - o.y, width: t.width, height: t.height };
    }
    return Co(l);
  }
  function iR(e, t) {
    let a = t.get(e);
    if (a) return a;
    let l = Io(e, [], !1).filter((r) => ga(r) && wo(r) !== 'body'),
      o = null,
      n = xa(e).position === 'fixed',
      u = n ? Gl(e) : e;
    for (; ga(u) && !_n(u);) {
      let r = xa(u),
        s = ii(u),
        i = o ? o.position : n ? 'fixed' : '';
      (!s && (i === 'fixed' || (i === 'absolute' && r.position === 'static'))
        ? (l = l.filter((m) => m !== u))
        : (o = r),
        (u = Gl(u)));
    }
    return (t.set(e, l), l);
  }
  function fR(e) {
    let { element: t, boundary: a, rootBoundary: l, strategy: o } = e,
      u = [...(a === 'clippingAncestors' ? (nr(t) ? [] : iR(t, this._c)) : [].concat(a)), l],
      r = Iv(t, u[0], o),
      s = r.top,
      i = r.right,
      h = r.bottom,
      m = r.left;
    for (let f = 1; f < u.length; f++) {
      let p = Iv(t, u[f], o);
      ((s = pa(p.top, s)), (i = Da(p.right, i)), (h = Da(p.bottom, h)), (m = pa(p.left, m)));
    }
    return { width: i - m, height: h - s, x: m, y: s };
  }
  function cR(e) {
    let { width: t, height: a } = Rv(e);
    return { width: t, height: a };
  }
  function dR(e, t, a) {
    let l = sl(t),
      o = Ba(t),
      n = a === 'fixed',
      u = Ro(e, !0, n, t),
      r = { scrollLeft: 0, scrollTop: 0 },
      s = Ea(0);
    if ((l || !n) && ((wo(t) !== 'body' || or(o)) && (r = ur(t)), l)) {
      let f = Ro(t, !0, n, t);
      ((s.x = f.x + t.clientLeft), (s.y = f.y + t.clientTop));
    }
    !l && o && (s.x = di(o));
    let i = o && !l && !n ? Tv(o, r) : Ea(0),
      h = u.left + r.scrollLeft - s.x - i.x,
      m = u.top + r.scrollTop - s.y - i.y;
    return { x: h, y: m, width: u.width, height: u.height };
  }
  function $d(e) {
    return xa(e).position === 'static';
  }
  function wv(e, t) {
    if (!sl(e) || xa(e).position === 'fixed') return null;
    if (t) return t(e);
    let a = e.offsetParent;
    return (Ba(e) === a && (a = a.ownerDocument.body), a);
  }
  function kv(e, t) {
    let a = xt(e);
    if (nr(e)) return a;
    if (!sl(e)) {
      let o = Gl(e);
      for (; o && !_n(o);) {
        if (ga(o) && !$d(o)) return o;
        o = Gl(o);
      }
      return a;
    }
    let l = wv(e, t);
    for (; l && yv(l) && $d(l);) l = wv(l, t);
    return l && _n(l) && $d(l) && !ii(l) ? a : l || Cv(e) || a;
  }
  var mR = async function (e) {
    let t = this.getOffsetParent || kv,
      a = this.getDimensions,
      l = await a(e.floating);
    return {
      reference: dR(e.reference, await t(e.floating), e.strategy),
      floating: { x: 0, y: 0, width: l.width, height: l.height },
    };
  };
  function pR(e) {
    return xa(e).direction === 'rtl';
  }
  var Mv = {
    convertOffsetParentRelativeRectToViewportRelativeRect: lR,
    getDocumentElement: Ba,
    getClippingRect: fR,
    getOffsetParent: kv,
    getElementRects: mR,
    getClientRects: oR,
    getDimensions: cR,
    getScale: Un,
    isElement: ga,
    isRTL: pR,
  };
  function Dv(e, t) {
    return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
  }
  function hR(e, t, a) {
    let l = null,
      o,
      n = Ba(e);
    function u() {
      var h;
      (clearTimeout(o), (h = l) == null || h.disconnect(), (l = null));
    }
    function r(h, m) {
      (h === void 0 && (h = !1), m === void 0 && (m = 1), u());
      let f = e.getBoundingClientRect(),
        { left: p, top: L, width: S, height: v } = f;
      if ((h || t(), !S || !v)) return;
      let g = lr(L),
        d = lr(n.clientWidth - (p + S)),
        c = lr(n.clientHeight - (L + v)),
        x = lr(p),
        I = {
          rootMargin: -g + 'px ' + -d + 'px ' + -c + 'px ' + -x + 'px',
          threshold: pa(0, Da(1, m)) || 1,
        },
        b = !0;
      function C(R) {
        let T = R[0].intersectionRatio;
        if (!Dv(f, e.getBoundingClientRect())) return r();
        if (T !== m) {
          if (!b) return r();
          T
            ? r(!1, T)
            : (o = setTimeout(() => {
                r(!1, 1e-7);
              }, 1e3));
        }
        b = !1;
      }
      try {
        l = new IntersectionObserver(C, { ...I, root: n.ownerDocument });
      } catch {
        l = new IntersectionObserver(C, I);
      }
      l.observe(e);
    }
    let s = xt(e),
      i = () => r(a);
    return (
      s.addEventListener('resize', i),
      r(!0),
      () => {
        (s.removeEventListener('resize', i), u());
      }
    );
  }
  function tm(e, t, a, l) {
    l === void 0 && (l = {});
    let {
        ancestorScroll: o = !0,
        ancestorResize: n = !0,
        elementResize: u = typeof ResizeObserver == 'function',
        layoutShift: r = typeof IntersectionObserver == 'function',
        animationFrame: s = !1,
      } = l,
      i = em(e),
      h = o || n ? [...(i ? Io(i) : []), ...(t ? Io(t) : [])] : [];
    h.forEach((g) => {
      (o && g.addEventListener('scroll', a), n && g.addEventListener('resize', a));
    });
    let m = i && r ? hR(i, a, n) : null,
      f = -1,
      p = null;
    u &&
      ((p = new ResizeObserver((g) => {
        let [d] = g;
        (d &&
          d.target === i &&
          p &&
          t &&
          (p.unobserve(t),
          cancelAnimationFrame(f),
          (f = requestAnimationFrame(() => {
            var c;
            (c = p) == null || c.observe(t);
          }))),
          a());
      })),
      i && !s && p.observe(i),
      t && p.observe(t));
    let L,
      S = s ? Ro(e) : null;
    s && v();
    function v() {
      let g = Ro(e);
      (S && !Dv(S, g) && a(), (S = g), (L = requestAnimationFrame(v)));
    }
    return (
      a(),
      () => {
        var g;
        (h.forEach((d) => {
          (o && d.removeEventListener('scroll', a), n && d.removeEventListener('resize', a));
        }),
          m?.(),
          (g = p) == null || g.disconnect(),
          (p = null),
          s && cancelAnimationFrame(L));
      }
    );
  }
  var Ev = hv;
  var Ov = gv,
    Bv = dv,
    Pv = Lv,
    _v = mv,
    am = cv;
  var Uv = xv,
    lm = (e, t, a) => {
      let l = new Map(),
        o = a ?? {},
        n = { ...Mv, ...o.platform, _c: l };
      return fv(e, t, { ...o, platform: n });
    };
  var Ne = A(P(), 1),
    zv = A(P(), 1),
    Nv = A(Ho(), 1),
    gR = typeof document < 'u',
    xR = function () {},
    mi = gR ? zv.useLayoutEffect : xR;
  function pi(e, t) {
    if (e === t) return !0;
    if (typeof e != typeof t) return !1;
    if (typeof e == 'function' && e.toString() === t.toString()) return !0;
    let a, l, o;
    if (e && t && typeof e == 'object') {
      if (Array.isArray(e)) {
        if (((a = e.length), a !== t.length)) return !1;
        for (l = a; l-- !== 0;) if (!pi(e[l], t[l])) return !1;
        return !0;
      }
      if (((o = Object.keys(e)), (a = o.length), a !== Object.keys(t).length)) return !1;
      for (l = a; l-- !== 0;) if (!{}.hasOwnProperty.call(t, o[l])) return !1;
      for (l = a; l-- !== 0;) {
        let n = o[l];
        if (!(n === '_owner' && e.$$typeof) && !pi(e[n], t[n])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }
  function qv(e) {
    return typeof window > 'u' ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
  }
  function Hv(e, t) {
    let a = qv(e);
    return Math.round(t * a) / a;
  }
  function om(e) {
    let t = Ne.useRef(e);
    return (
      mi(() => {
        t.current = e;
      }),
      t
    );
  }
  function Fv(e) {
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
      [h, m] = Ne.useState({
        x: 0,
        y: 0,
        strategy: a,
        placement: t,
        middlewareData: {},
        isPositioned: !1,
      }),
      [f, p] = Ne.useState(l);
    pi(f, l) || p(l);
    let [L, S] = Ne.useState(null),
      [v, g] = Ne.useState(null),
      d = Ne.useCallback((N) => {
        N !== I.current && ((I.current = N), S(N));
      }, []),
      c = Ne.useCallback((N) => {
        N !== b.current && ((b.current = N), g(N));
      }, []),
      x = n || L,
      y = u || v,
      I = Ne.useRef(null),
      b = Ne.useRef(null),
      C = Ne.useRef(h),
      R = s != null,
      T = om(s),
      B = om(o),
      O = om(i),
      U = Ne.useCallback(() => {
        if (!I.current || !b.current) return;
        let N = { placement: t, strategy: a, middleware: f };
        (B.current && (N.platform = B.current),
          lm(I.current, b.current, N).then((le) => {
            let k = { ...le, isPositioned: O.current !== !1 };
            Q.current &&
              !pi(C.current, k) &&
              ((C.current = k),
              Nv.flushSync(() => {
                m(k);
              }));
          }));
      }, [f, t, a, B, O]);
    mi(() => {
      i === !1 &&
        C.current.isPositioned &&
        ((C.current.isPositioned = !1), m((N) => ({ ...N, isPositioned: !1 })));
    }, [i]);
    let Q = Ne.useRef(!1);
    (mi(
      () => (
        (Q.current = !0),
        () => {
          Q.current = !1;
        }
      ),
      [],
    ),
      mi(() => {
        if ((x && (I.current = x), y && (b.current = y), x && y)) {
          if (T.current) return T.current(x, y, U);
          U();
        }
      }, [x, y, U, T, R]));
    let ae = Ne.useMemo(
        () => ({ reference: I, floating: b, setReference: d, setFloating: c }),
        [d, c],
      ),
      z = Ne.useMemo(() => ({ reference: x, floating: y }), [x, y]),
      j = Ne.useMemo(() => {
        let N = { position: a, left: 0, top: 0 };
        if (!z.floating) return N;
        let le = Hv(z.floating, h.x),
          k = Hv(z.floating, h.y);
        return r
          ? {
              ...N,
              transform: 'translate(' + le + 'px, ' + k + 'px)',
              ...(qv(z.floating) >= 1.5 && { willChange: 'transform' }),
            }
          : { position: a, left: le, top: k };
      }, [a, r, z.floating, h.x, h.y]);
    return Ne.useMemo(
      () => ({ ...h, update: U, refs: ae, elements: z, floatingStyles: j }),
      [h, U, ae, z, j],
    );
  }
  var LR = (e) => {
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
              ? am({ element: l.current, padding: o }).fn(a)
              : {}
            : l
              ? am({ element: l, padding: o }).fn(a)
              : {};
        },
      };
    },
    Gv = (e, t) => {
      let a = Ev(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    },
    Vv = (e, t) => {
      let a = Ov(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    },
    Xv = (e, t) => ({ fn: Uv(e).fn, options: [e, t] }),
    jv = (e, t) => {
      let a = Bv(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    },
    Yv = (e, t) => {
      let a = Pv(e);
      return { name: a.name, fn: a.fn, options: [e, t] };
    };
  var Kv = (e, t) => {
    let a = _v(e);
    return { name: a.name, fn: a.fn, options: [e, t] };
  };
  var Zv = (e, t) => {
    let a = LR(e);
    return { name: a.name, fn: a.fn, options: [e, t] };
  };
  var Qv = A(P(), 1);
  var SR = Object.defineProperty,
    vR = (e, t) => SR(e, 'name', { value: t, configurable: !0 });
  function nm(e) {
    let [t, a] = Qv.useState(void 0);
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
  vR(nm, 'useSize');
  var Hn = A(G(), 1),
    yR = Object.defineProperty,
    Vl = (e, t) => yR(e, 'name', { value: t, configurable: !0 });
  var Wv = 'Popper',
    [Jv, um] = nl(Wv),
    [CR, $v] = Jv(Wv),
    bR = Vl((e) => {
      let { __scopePopper: t, children: a } = e,
        [l, o] = ft.useState(null),
        [n, u] = ft.useState(void 0);
      return (0, Hn.jsx)(CR, {
        scope: t,
        anchor: l,
        onAnchorChange: o,
        placementState: n,
        setPlacementState: u,
        children: a,
      });
    }, 'Popper'),
    IR = 'PopperAnchor',
    wR = ft.forwardRef(
      Vl(function (t, a) {
        let { __scopePopper: l, virtualRef: o, ...n } = t,
          u = $v(IR, l),
          r = ft.useRef(null),
          s = u.onAnchorChange,
          i = ft.useCallback(
            (S) => {
              ((r.current = S), S && s(S));
            },
            [s],
          ),
          h = ge(a, i),
          m = ft.useRef(null);
        ft.useEffect(() => {
          if (!o) return;
          let S = m.current;
          ((m.current = o.current), S !== m.current && s(m.current));
        });
        let f = u.placementState && hi(u.placementState),
          p = f?.[0],
          L = f?.[1];
        return o
          ? null
          : (0, Hn.jsx)(We.div, {
              'data-radix-popper-side': p,
              'data-radix-popper-align': L,
              ...n,
              ref: h,
            });
      }, 'PopperAnchor'),
    ),
    ey = 'PopperContent',
    [RR, kk] = Jv(ey),
    AR = ft.forwardRef(
      Vl(function (t, a) {
        let {
            __scopePopper: l,
            side: o = 'bottom',
            sideOffset: n = 0,
            align: u = 'center',
            alignOffset: r = 0,
            arrowPadding: s = 0,
            avoidCollisions: i = !0,
            collisionBoundary: h = [],
            collisionPadding: m = 0,
            sticky: f = 'partial',
            hideWhenDetached: p = !1,
            updatePositionStrategy: L = 'optimized',
            onPlaced: S,
            ...v
          } = t,
          g = $v(ey, l),
          [d, c] = ft.useState(null),
          x = ge(a, c),
          [y, I] = ft.useState(null),
          b = nm(y),
          C = b?.width ?? 0,
          R = b?.height ?? 0,
          T = o + (u !== 'center' ? '-' + u : ''),
          B = typeof m == 'number' ? m : { top: 0, right: 0, bottom: 0, left: 0, ...m },
          O = Array.isArray(h) ? h : [h],
          U = O.length > 0,
          Q = { padding: B, boundary: O.filter(ty), altBoundary: U },
          {
            refs: ae,
            floatingStyles: z,
            placement: j,
            isPositioned: N,
            middlewareData: le,
          } = Fv({
            strategy: 'fixed',
            placement: T,
            whileElementsMounted: Vl(
              (...Y) => tm(...Y, { animationFrame: L === 'always' }),
              'whileElementsMounted',
            ),
            elements: { reference: g.anchor },
            middleware: [
              Gv({ mainAxis: n + R, alignmentAxis: r }),
              i &&
                Vv({ mainAxis: !0, crossAxis: !1, limiter: f === 'partial' ? Xv() : void 0, ...Q }),
              i && jv({ ...Q }),
              Yv({
                ...Q,
                apply: Vl(({ elements: Y, rects: qe, availableWidth: ue, availableHeight: re }) => {
                  let { width: Ie, height: Lt } = qe.reference,
                    Vt = Y.floating.style;
                  (Vt.setProperty('--radix-popper-available-width', `${ue}px`),
                    Vt.setProperty('--radix-popper-available-height', `${re}px`),
                    Vt.setProperty('--radix-popper-anchor-width', `${Ie}px`),
                    Vt.setProperty('--radix-popper-anchor-height', `${Lt}px`));
                }, 'apply'),
              }),
              y && Zv({ element: y, padding: s }),
              TR({ arrowWidth: C, arrowHeight: R }),
              p && Kv({ strategy: 'referenceHidden', ...Q, boundary: U ? Q.boundary : void 0 }),
            ],
          }),
          k = g.setPlacementState;
        Ae(
          () => (
            k(j),
            () => {
              k(void 0);
            }
          ),
          [j, k],
        );
        let [qt, Oe] = hi(j),
          rt = Tt(S);
        Ae(() => {
          N && rt?.();
        }, [N, rt]);
        let Ft = le.arrow?.x,
          be = le.arrow?.y,
          Te = le.arrow?.centerOffset !== 0,
          [Gt, F] = ft.useState();
        return (
          Ae(() => {
            d && F(window.getComputedStyle(d).zIndex);
          }, [d]),
          (0, Hn.jsx)('div', {
            ref: ae.setFloating,
            'data-radix-popper-content-wrapper': '',
            style: {
              ...z,
              transform: N ? z.transform : 'translate(0, -200%)',
              minWidth: 'max-content',
              zIndex: Gt,
              '--radix-popper-transform-origin': [
                le.transformOrigin?.x,
                le.transformOrigin?.y,
              ].join(' '),
              ...(le.hide?.referenceHidden && { visibility: 'hidden', pointerEvents: 'none' }),
            },
            dir: t.dir,
            children: (0, Hn.jsx)(RR, {
              scope: l,
              placedSide: qt,
              placedAlign: Oe,
              onArrowChange: I,
              arrowX: Ft,
              arrowY: be,
              shouldHideArrow: Te,
              children: (0, Hn.jsx)(We.div, {
                'data-side': qt,
                'data-align': Oe,
                ...v,
                ref: x,
                style: { ...v.style, animation: N ? v.style?.animation : 'none' },
              }),
            }),
          })
        );
      }, 'PopperContent'),
    );
  function ty(e) {
    return e !== null;
  }
  Vl(ty, 'isNotNull');
  var TR = Vl(
    (e) => ({
      name: 'transformOrigin',
      options: e,
      fn(t) {
        let { placement: a, rects: l, middlewareData: o } = t,
          u = o.arrow?.centerOffset !== 0,
          r = u ? 0 : e.arrowWidth,
          s = u ? 0 : e.arrowHeight,
          [i, h] = hi(a),
          m = { start: '0%', center: '50%', end: '100%' }[h],
          f = (o.arrow?.x ?? 0) + r / 2,
          p = (o.arrow?.y ?? 0) + s / 2,
          L = '',
          S = '';
        return (
          i === 'bottom'
            ? ((L = u ? m : `${f}px`), (S = `${-s}px`))
            : i === 'top'
              ? ((L = u ? m : `${f}px`), (S = `${l.floating.height + s}px`))
              : i === 'right'
                ? ((L = `${-s}px`), (S = u ? m : `${p}px`))
                : i === 'left' && ((L = `${l.floating.width + s}px`), (S = u ? m : `${p}px`)),
          { data: { x: L, y: S } }
        );
      },
    }),
    'transformOrigin',
  );
  function hi(e) {
    let [t, a = 'center'] = e.split('-');
    return [t, a];
  }
  Vl(hi, 'getSideAndAlignFromPlacement');
  var ay = bR,
    ly = wR,
    oy = AR;
  var gi = A(P(), 1),
    ny = A(Ho(), 1);
  var uy = A(G(), 1),
    MR = Object.defineProperty,
    DR = (e, t) => MR(e, 'name', { value: t, configurable: !0 }),
    ry = gi.forwardRef(
      DR(function (t, a) {
        let { container: l, ...o } = t,
          [n, u] = gi.useState(!1);
        Ae(() => u(!0), []);
        let r = l || (n && globalThis?.document?.body);
        return r ? ny.createPortal((0, uy.jsx)(We.div, { ...o, ref: a }), r) : null;
      }, 'Portal'),
    );
  var ut = A(P(), 1);
  var sy = A(P(), 1),
    ER = Object.defineProperty,
    il = (e, t) => ER(e, 'name', { value: t, configurable: !0 });
  function iy(e, t) {
    return sy.useReducer((a, l) => t[a][l] ?? a, e);
  }
  il(iy, 'useStateMachine');
  var fy = il((e) => {
    let { present: t, children: a } = e,
      l = cy(t),
      o = typeof a == 'function' ? a({ present: l.isPresent }) : ut.Children.only(a),
      n = dy(l.ref, my(o));
    return typeof a == 'function' || l.isPresent ? ut.cloneElement(o, { ref: n }) : null;
  }, 'Presence');
  function cy(e) {
    let [t, a] = ut.useState(),
      l = ut.useRef(null),
      o = ut.useRef(e),
      n = ut.useRef('none'),
      u = ut.useRef(void 0),
      r = e ? 'mounted' : 'unmounted',
      [s, i] = iy(r, {
        mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
        unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
        unmounted: { MOUNT: 'mounted' },
      });
    return (
      ut.useEffect(() => {
        s === 'mounted'
          ? ((n.current = u.current ?? zn(l.current)), (u.current = void 0))
          : (n.current = 'none');
      }, [s]),
      Ae(() => {
        let h = l.current,
          m = o.current;
        if (m !== e) {
          let p = n.current,
            L = zn(h);
          (e
            ? ((u.current = L), i('MOUNT'))
            : L === 'none' || h?.display === 'none'
              ? i('UNMOUNT')
              : i(m && p !== L ? 'ANIMATION_OUT' : 'UNMOUNT'),
            (o.current = e));
        }
      }, [e, i]),
      Ae(() => {
        if (t) {
          let h,
            m = t.ownerDocument.defaultView ?? window,
            f = il((L) => {
              let v = zn(l.current).includes(CSS.escape(L.animationName));
              if (L.target === t && v && (i('ANIMATION_END'), !o.current)) {
                let g = t.style.animationFillMode;
                ((t.style.animationFillMode = 'forwards'),
                  (h = m.setTimeout(() => {
                    t.style.animationFillMode === 'forwards' && (t.style.animationFillMode = g);
                  })));
              }
            }, 'handleAnimationEnd'),
            p = il((L) => {
              L.target === t && (n.current = zn(l.current));
            }, 'handleAnimationStart');
          return (
            t.addEventListener('animationstart', p),
            t.addEventListener('animationcancel', f),
            t.addEventListener('animationend', f),
            () => {
              (m.clearTimeout(h),
                t.removeEventListener('animationstart', p),
                t.removeEventListener('animationcancel', f),
                t.removeEventListener('animationend', f));
            }
          );
        } else i('ANIMATION_END');
      }, [t, i]),
      {
        isPresent: ['mounted', 'unmountSuspended'].includes(s),
        ref: ut.useCallback((h) => {
          if (h) {
            let m = getComputedStyle(h);
            ((l.current = m), (u.current = zn(m)));
          } else l.current = null;
          a(h);
        }, []),
      }
    );
  }
  il(cy, 'usePresence');
  function rm(e, t) {
    if (typeof e == 'function') return e(t);
    e != null && (e.current = t);
  }
  il(rm, 'setRef');
  function dy(...e) {
    let t = ut.useRef(e);
    return (
      (t.current = e),
      ut.useCallback((a) => {
        let l = t.current,
          o = !1,
          n = l.map((u) => {
            let r = rm(u, a);
            return (!o && typeof r == 'function' && (o = !0), r);
          });
        if (o)
          return () => {
            for (let u = 0; u < n.length; u++) {
              let r = n[u];
              typeof r == 'function' ? r() : rm(l[u], null);
            }
          };
      }, [])
    );
  }
  il(dy, 'useStableComposedRefs');
  function zn(e) {
    return e?.animationName || 'none';
  }
  il(zn, 'getAnimationName');
  function my(e) {
    let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
      a = t && 'isReactWarning' in t && t.isReactWarning;
    return a
      ? e.ref
      : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
        (a = t && 'isReactWarning' in t && t.isReactWarning),
        a ? e.props.ref : e.props.ref || e.ref);
  }
  il(my, 'getElementRef');
  var na = A(P(), 1);
  var xi = !1;
  var La = A(P(), 1);
  var Nn = A(P(), 1),
    OR = Object.defineProperty,
    BR = (e, t) => OR(e, 'name', { value: t, configurable: !0 }),
    py = Nn[' useEffectEvent '.trim().toString()],
    hy = Nn[' useInsertionEffect '.trim().toString()];
  function sm(e) {
    if (typeof py == 'function') return py(e);
    let t = Nn.useRef(() => {
      throw new Error('Cannot call an event handler while rendering.');
    });
    return (
      typeof hy == 'function'
        ? hy(() => {
            t.current = e;
          })
        : Ae(() => {
            t.current = e;
          }),
      Nn.useMemo(
        () =>
          (...a) =>
            t.current?.(...a),
        [],
      )
    );
  }
  BR(sm, 'useEffectEvent');
  var PR = Object.defineProperty,
    rr = (e, t) => PR(e, 'name', { value: t, configurable: !0 }),
    _R = na[' useInsertionEffect '.trim().toString()] || Ae;
  function Li({ prop: e, defaultProp: t, onChange: a = rr(() => {}, 'onChange'), caller: l }) {
    let [o, n, u] = xy({ defaultProp: t, onChange: a }),
      r = e !== void 0,
      s = r ? e : o;
    if (xi) {
      let h = na.useRef(e !== void 0);
      na.useEffect(() => {
        let m = h.current;
        (m !== r &&
          console.warn(
            `${l} is changing from ${m ? 'controlled' : 'uncontrolled'} to ${r ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
          ),
          (h.current = r));
      }, [r, l]);
    }
    let i = na.useCallback(
      (h) => {
        if (r) {
          let m = Ly(h) ? h(e) : h;
          m !== e && u.current?.(m);
        } else n(h);
      },
      [r, e, n, u],
    );
    return [s, i];
  }
  rr(Li, 'useControllableState');
  function xy({ defaultProp: e, onChange: t }) {
    let [a, l] = na.useState(e),
      o = na.useRef(a),
      n = na.useRef(t);
    return (
      _R(() => {
        n.current = t;
      }, [t]),
      na.useEffect(() => {
        o.current !== a && (n.current?.(a), (o.current = a));
      }, [a, o]),
      [a, l, n]
    );
  }
  rr(xy, 'useUncontrolledState');
  function Ly(e) {
    return typeof e == 'function';
  }
  rr(Ly, 'isFunction');
  var gy = Symbol('RADIX:SYNC_STATE');
  function UR(e, t, a, l) {
    let { prop: o, defaultProp: n, onChange: u, caller: r } = t,
      s = o !== void 0,
      i = sm(u);
    if (xi) {
      let v = La.useRef(o !== void 0);
      La.useEffect(() => {
        let g = v.current;
        (g !== s &&
          console.warn(
            `${r} is changing from ${g ? 'controlled' : 'uncontrolled'} to ${s ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
          ),
          (v.current = s));
      }, [s, r]);
    }
    let h = [{ ...a, state: n }];
    l && h.push(l);
    let [m, f] = La.useReducer(
        (v, g) => {
          if (g.type === gy) return { ...v, state: g.state };
          let d = e(v, g);
          return (s && !Object.is(d.state, v.state) && i(d.state), d);
        },
        ...h,
      ),
      p = m.state,
      L = La.useRef(p);
    La.useEffect(() => {
      L.current !== p && ((L.current = p), s || i(p));
    }, [p, L, s]);
    let S = La.useMemo(() => (o !== void 0 ? { ...m, state: o } : m), [m, o]);
    return (
      La.useEffect(() => {
        s && !Object.is(o, m.state) && f({ type: gy, state: o });
      }, [o, m.state, s]),
      [S, f]
    );
  }
  rr(UR, 'useControllableStateReducer');
  var Si = A(P(), 1),
    HR = Object.defineProperty,
    zR = (e, t) => HR(e, 'name', { value: t, configurable: !0 });
  function im(e) {
    let t = Si.useRef({ value: e, previous: e });
    return Si.useMemo(
      () => (
        t.current.value !== e && ((t.current.previous = t.current.value), (t.current.value = e)),
        t.current.previous
      ),
      [e],
    );
  }
  zR(im, 'usePrevious');
  var NR = A(P(), 1);
  var qR = A(G(), 1);
  var Sy = Object.freeze({
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
  });
  var FR = function (e) {
      if (typeof document > 'u') return null;
      var t = Array.isArray(e) ? e[0] : e;
      return t.ownerDocument.body;
    },
    qn = new WeakMap(),
    vi = new WeakMap(),
    yi = {},
    fm = 0,
    vy = function (e) {
      return e && (e.host || vy(e.parentNode));
    },
    GR = function (e, t) {
      return t
        .map(function (a) {
          if (e.contains(a)) return a;
          var l = vy(a);
          return l && e.contains(l)
            ? l
            : (console.error('aria-hidden', a, 'in not contained inside', e, '. Doing nothing'),
              null);
        })
        .filter(function (a) {
          return !!a;
        });
    },
    VR = function (e, t, a, l) {
      var o = GR(t, Array.isArray(e) ? e : [e]);
      yi[a] || (yi[a] = new WeakMap());
      var n = yi[a],
        u = [],
        r = new Set(),
        s = new Set(o),
        i = function (m) {
          !m || r.has(m) || (r.add(m), i(m.parentNode));
        };
      o.forEach(i);
      var h = function (m) {
        !m ||
          s.has(m) ||
          Array.prototype.forEach.call(m.children, function (f) {
            if (r.has(f)) h(f);
            else
              try {
                var p = f.getAttribute(l),
                  L = p !== null && p !== 'false',
                  S = (qn.get(f) || 0) + 1,
                  v = (n.get(f) || 0) + 1;
                (qn.set(f, S),
                  n.set(f, v),
                  u.push(f),
                  S === 1 && L && vi.set(f, !0),
                  v === 1 && f.setAttribute(a, 'true'),
                  L || f.setAttribute(l, 'true'));
              } catch (g) {
                console.error('aria-hidden: cannot operate on ', f, g);
              }
          });
      };
      return (
        h(t),
        r.clear(),
        fm++,
        function () {
          (u.forEach(function (m) {
            var f = qn.get(m) - 1,
              p = n.get(m) - 1;
            (qn.set(m, f),
              n.set(m, p),
              f || (vi.has(m) || m.removeAttribute(l), vi.delete(m)),
              p || m.removeAttribute(a));
          }),
            fm--,
            fm || ((qn = new WeakMap()), (qn = new WeakMap()), (vi = new WeakMap()), (yi = {})));
        }
      );
    },
    yy = function (e, t, a) {
      a === void 0 && (a = 'data-aria-hidden');
      var l = Array.from(Array.isArray(e) ? e : [e]),
        o = t || FR(e);
      return o
        ? (l.push.apply(l, Array.from(o.querySelectorAll('[aria-live], script'))),
          VR(l, o, a, 'aria-hidden'))
        : function () {
            return null;
          };
    };
  var kt = function () {
    return (
      (kt =
        Object.assign ||
        function (t) {
          for (var a, l = 1, o = arguments.length; l < o; l++) {
            a = arguments[l];
            for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
          }
          return t;
        }),
      kt.apply(this, arguments)
    );
  };
  function Ci(e, t) {
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
  function Cy(e, t, a) {
    if (a || arguments.length === 2)
      for (var l = 0, o = t.length, n; l < o; l++)
        (n || !(l in t)) && (n || (n = Array.prototype.slice.call(t, 0, l)), (n[l] = t[l]));
    return e.concat(n || Array.prototype.slice.call(t));
  }
  var Ai = A(P());
  var ct = A(P());
  var Ao = 'right-scroll-bar-position',
    To = 'width-before-scroll-bar',
    cm = 'with-scroll-bars-hidden',
    dm = '--removed-body-scroll-bar-size';
  function bi(e, t) {
    return (typeof e == 'function' ? e(t) : e && (e.current = t), e);
  }
  var by = A(P());
  function Iy(e, t) {
    var a = (0, by.useState)(function () {
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
  var Ii = A(P());
  var XR = typeof window < 'u' ? Ii.useLayoutEffect : Ii.useEffect,
    wy = new WeakMap();
  function mm(e, t) {
    var a = Iy(t || null, function (l) {
      return e.forEach(function (o) {
        return bi(o, l);
      });
    });
    return (
      XR(
        function () {
          var l = wy.get(a);
          if (l) {
            var o = new Set(l),
              n = new Set(e),
              u = a.current;
            (o.forEach(function (r) {
              n.has(r) || bi(r, null);
            }),
              n.forEach(function (r) {
                o.has(r) || bi(r, u);
              }));
          }
          wy.set(a, e);
        },
        [e],
      ),
      a
    );
  }
  function jR(e) {
    return e;
  }
  function YR(e, t) {
    t === void 0 && (t = jR);
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
              var h = u;
              ((u = []), h.forEach(n));
            },
            i = function () {
              return Promise.resolve().then(s);
            };
          (i(),
            (a = {
              push: function (h) {
                (u.push(h), i());
              },
              filter: function (h) {
                return ((u = u.filter(h)), a);
              },
            }));
        },
      };
    return o;
  }
  function pm(e) {
    e === void 0 && (e = {});
    var t = YR(null);
    return ((t.options = kt({ async: !0, ssr: !1 }, e)), t);
  }
  var Ry = A(P()),
    Ay = function (e) {
      var t = e.sideCar,
        a = Ci(e, ['sideCar']);
      if (!t) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
      var l = t.read();
      if (!l) throw new Error('Sidecar medium not found');
      return Ry.createElement(l, kt({}, a));
    };
  Ay.isSideCarExport = !0;
  function hm(e, t) {
    return (e.useMedium(t), Ay);
  }
  var wi = pm();
  var gm = function () {},
    sr = ct.forwardRef(function (e, t) {
      var a = ct.useRef(null),
        l = ct.useState({ onScrollCapture: gm, onWheelCapture: gm, onTouchMoveCapture: gm }),
        o = l[0],
        n = l[1],
        u = e.forwardProps,
        r = e.children,
        s = e.className,
        i = e.removeScrollBar,
        h = e.enabled,
        m = e.shards,
        f = e.sideCar,
        p = e.noRelative,
        L = e.noIsolation,
        S = e.inert,
        v = e.allowPinchZoom,
        g = e.as,
        d = g === void 0 ? 'div' : g,
        c = e.gapMode,
        x = Ci(e, [
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
        y = f,
        I = mm([a, t]),
        b = kt(kt({}, x), o);
      return ct.createElement(
        ct.Fragment,
        null,
        h &&
          ct.createElement(y, {
            sideCar: wi,
            removeScrollBar: i,
            shards: m,
            noRelative: p,
            noIsolation: L,
            inert: S,
            setCallbacks: n,
            allowPinchZoom: !!v,
            lockRef: a,
            gapMode: c,
          }),
        u
          ? ct.cloneElement(ct.Children.only(r), kt(kt({}, b), { ref: I }))
          : ct.createElement(d, kt({}, b, { className: s, ref: I }), r),
      );
    });
  sr.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
  sr.classNames = { fullWidth: To, zeroRight: Ao };
  var Ce = A(P());
  var Gn = A(P());
  var My = A(P());
  var Ty;
  var ky = function () {
    if (Ty) return Ty;
    if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
  };
  function KR() {
    if (!document) return null;
    var e = document.createElement('style');
    e.type = 'text/css';
    var t = ky();
    return (t && e.setAttribute('nonce', t), e);
  }
  function ZR(e, t) {
    e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t));
  }
  function QR(e) {
    var t = document.head || document.getElementsByTagName('head')[0];
    t.appendChild(e);
  }
  var xm = function () {
    var e = 0,
      t = null;
    return {
      add: function (a) {
        (e == 0 && (t = KR()) && (ZR(t, a), QR(t)), e++);
      },
      remove: function () {
        (e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  };
  var Lm = function () {
    var e = xm();
    return function (t, a) {
      My.useEffect(
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
  var ir = function () {
    var e = Lm(),
      t = function (a) {
        var l = a.styles,
          o = a.dynamic;
        return (e(l, o), null);
      };
    return t;
  };
  var WR = { left: 0, top: 0, right: 0, gap: 0 },
    Sm = function (e) {
      return parseInt(e || '', 10) || 0;
    },
    JR = function (e) {
      var t = window.getComputedStyle(document.body),
        a = t[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
        l = t[e === 'padding' ? 'paddingTop' : 'marginTop'],
        o = t[e === 'padding' ? 'paddingRight' : 'marginRight'];
      return [Sm(a), Sm(l), Sm(o)];
    },
    vm = function (e) {
      if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return WR;
      var t = JR(e),
        a = document.documentElement.clientWidth,
        l = window.innerWidth;
      return { left: t[0], top: t[1], right: t[2], gap: Math.max(0, l - a + t[2] - t[0]) };
    };
  var $R = ir(),
    Fn = 'data-scroll-locked',
    eA = function (e, t, a, l) {
      var o = e.left,
        n = e.top,
        u = e.right,
        r = e.gap;
      return (
        a === void 0 && (a = 'margin'),
        `
  .`
          .concat(
            cm,
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
            Fn,
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
            Ao,
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
            To,
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
          .concat(Ao, ' .')
          .concat(
            Ao,
            ` {
    right: 0 `,
          )
          .concat(
            l,
            `;
  }
  
  .`,
          )
          .concat(To, ' .')
          .concat(
            To,
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
            Fn,
            `] {
    `,
          )
          .concat(dm, ': ')
          .concat(
            r,
            `px;
  }
`,
          )
      );
    },
    Dy = function () {
      var e = parseInt(document.body.getAttribute(Fn) || '0', 10);
      return isFinite(e) ? e : 0;
    },
    tA = function () {
      Gn.useEffect(function () {
        return (
          document.body.setAttribute(Fn, (Dy() + 1).toString()),
          function () {
            var e = Dy() - 1;
            e <= 0
              ? document.body.removeAttribute(Fn)
              : document.body.setAttribute(Fn, e.toString());
          }
        );
      }, []);
    },
    ym = function (e) {
      var t = e.noRelative,
        a = e.noImportant,
        l = e.gapMode,
        o = l === void 0 ? 'margin' : l;
      tA();
      var n = Gn.useMemo(
        function () {
          return vm(o);
        },
        [o],
      );
      return Gn.createElement($R, { styles: eA(n, !t, o, a ? '' : '!important') });
    };
  var Cm = !1;
  if (typeof window < 'u')
    try {
      ((fr = Object.defineProperty({}, 'passive', {
        get: function () {
          return ((Cm = !0), !0);
        },
      })),
        window.addEventListener('test', fr, fr),
        window.removeEventListener('test', fr, fr));
    } catch {
      Cm = !1;
    }
  var fr,
    ko = Cm ? { passive: !1 } : !1;
  var aA = function (e) {
      return e.tagName === 'TEXTAREA';
    },
    Ey = function (e, t) {
      if (!(e instanceof Element)) return !1;
      var a = window.getComputedStyle(e);
      return a[t] !== 'hidden' && !(a.overflowY === a.overflowX && !aA(e) && a[t] === 'visible');
    },
    lA = function (e) {
      return Ey(e, 'overflowY');
    },
    oA = function (e) {
      return Ey(e, 'overflowX');
    },
    bm = function (e, t) {
      var a = t.ownerDocument,
        l = t;
      do {
        typeof ShadowRoot < 'u' && l instanceof ShadowRoot && (l = l.host);
        var o = Oy(e, l);
        if (o) {
          var n = By(e, l),
            u = n[1],
            r = n[2];
          if (u > r) return !0;
        }
        l = l.parentNode;
      } while (l && l !== a.body);
      return !1;
    },
    nA = function (e) {
      var t = e.scrollTop,
        a = e.scrollHeight,
        l = e.clientHeight;
      return [t, a, l];
    },
    uA = function (e) {
      var t = e.scrollLeft,
        a = e.scrollWidth,
        l = e.clientWidth;
      return [t, a, l];
    },
    Oy = function (e, t) {
      return e === 'v' ? lA(t) : oA(t);
    },
    By = function (e, t) {
      return e === 'v' ? nA(t) : uA(t);
    },
    rA = function (e, t) {
      return e === 'h' && t === 'rtl' ? -1 : 1;
    },
    Py = function (e, t, a, l, o) {
      var n = rA(e, window.getComputedStyle(t).direction),
        u = n * l,
        r = a.target,
        s = t.contains(r),
        i = !1,
        h = u > 0,
        m = 0,
        f = 0;
      do {
        if (!r) break;
        var p = By(e, r),
          L = p[0],
          S = p[1],
          v = p[2],
          g = S - v - n * L;
        (L || g) && Oy(e, r) && ((m += g), (f += L));
        var d = r.parentNode;
        r = d && d.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? d.host : d;
      } while ((!s && r !== document.body) || (s && (t.contains(r) || t === r)));
      return (
        ((h && ((o && Math.abs(m) < 1) || (!o && u > m))) ||
          (!h && ((o && Math.abs(f) < 1) || (!o && -u > f)))) &&
          (i = !0),
        i
      );
    };
  var Ri = function (e) {
      return 'changedTouches' in e
        ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
        : [0, 0];
    },
    _y = function (e) {
      return [e.deltaX, e.deltaY];
    },
    Uy = function (e) {
      return e && 'current' in e ? e.current : e;
    },
    sA = function (e, t) {
      return e[0] === t[0] && e[1] === t[1];
    },
    iA = function (e) {
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
    fA = 0,
    Vn = [];
  function Hy(e) {
    var t = Ce.useRef([]),
      a = Ce.useRef([0, 0]),
      l = Ce.useRef(),
      o = Ce.useState(fA++)[0],
      n = Ce.useState(ir)[0],
      u = Ce.useRef(e);
    (Ce.useEffect(
      function () {
        u.current = e;
      },
      [e],
    ),
      Ce.useEffect(
        function () {
          if (e.inert) {
            document.body.classList.add('block-interactivity-'.concat(o));
            var S = Cy([e.lockRef.current], (e.shards || []).map(Uy), !0).filter(Boolean);
            return (
              S.forEach(function (v) {
                return v.classList.add('allow-interactivity-'.concat(o));
              }),
              function () {
                (document.body.classList.remove('block-interactivity-'.concat(o)),
                  S.forEach(function (v) {
                    return v.classList.remove('allow-interactivity-'.concat(o));
                  }));
              }
            );
          }
        },
        [e.inert, e.lockRef.current, e.shards],
      ));
    var r = Ce.useCallback(function (S, v) {
        if (('touches' in S && S.touches.length === 2) || (S.type === 'wheel' && S.ctrlKey))
          return !u.current.allowPinchZoom;
        var g = Ri(S),
          d = a.current,
          c = 'deltaX' in S ? S.deltaX : d[0] - g[0],
          x = 'deltaY' in S ? S.deltaY : d[1] - g[1],
          y,
          I = S.target,
          b = Math.abs(c) > Math.abs(x) ? 'h' : 'v';
        if ('touches' in S && b === 'h' && I.type === 'range') return !1;
        var C = window.getSelection(),
          R = C && C.anchorNode,
          T = R ? R === I || R.contains(I) : !1;
        if (T) return !1;
        var B = bm(b, I);
        if (!B) return !0;
        if ((B ? (y = b) : ((y = b === 'v' ? 'h' : 'v'), (B = bm(b, I))), !B)) return !1;
        if ((!l.current && 'changedTouches' in S && (c || x) && (l.current = y), !y)) return !0;
        var O = l.current || y;
        return Py(O, v, S, O === 'h' ? c : x, !0);
      }, []),
      s = Ce.useCallback(function (S) {
        var v = S;
        if (!(!Vn.length || Vn[Vn.length - 1] !== n)) {
          var g = 'deltaY' in v ? _y(v) : Ri(v),
            d = t.current.filter(function (y) {
              return (
                y.name === v.type &&
                (y.target === v.target || v.target === y.shadowParent) &&
                sA(y.delta, g)
              );
            })[0];
          if (d && d.should) {
            v.cancelable && v.preventDefault();
            return;
          }
          if (!d) {
            var c = (u.current.shards || [])
                .map(Uy)
                .filter(Boolean)
                .filter(function (y) {
                  return y.contains(v.target);
                }),
              x = c.length > 0 ? r(v, c[0]) : !u.current.noIsolation;
            x && v.cancelable && v.preventDefault();
          }
        }
      }, []),
      i = Ce.useCallback(function (S, v, g, d) {
        var c = { name: S, delta: v, target: g, should: d, shadowParent: cA(g) };
        (t.current.push(c),
          setTimeout(function () {
            t.current = t.current.filter(function (x) {
              return x !== c;
            });
          }, 1));
      }, []),
      h = Ce.useCallback(function (S) {
        ((a.current = Ri(S)), (l.current = void 0));
      }, []),
      m = Ce.useCallback(function (S) {
        i(S.type, _y(S), S.target, r(S, e.lockRef.current));
      }, []),
      f = Ce.useCallback(function (S) {
        i(S.type, Ri(S), S.target, r(S, e.lockRef.current));
      }, []);
    Ce.useEffect(function () {
      return (
        Vn.push(n),
        e.setCallbacks({ onScrollCapture: m, onWheelCapture: m, onTouchMoveCapture: f }),
        document.addEventListener('wheel', s, ko),
        document.addEventListener('touchmove', s, ko),
        document.addEventListener('touchstart', h, ko),
        function () {
          ((Vn = Vn.filter(function (S) {
            return S !== n;
          })),
            document.removeEventListener('wheel', s, ko),
            document.removeEventListener('touchmove', s, ko),
            document.removeEventListener('touchstart', h, ko));
        }
      );
    }, []);
    var p = e.removeScrollBar,
      L = e.inert;
    return Ce.createElement(
      Ce.Fragment,
      null,
      L ? Ce.createElement(n, { styles: iA(o) }) : null,
      p ? Ce.createElement(ym, { noRelative: e.noRelative, gapMode: e.gapMode }) : null,
    );
  }
  function cA(e) {
    for (var t = null; e !== null;)
      (e instanceof ShadowRoot && ((t = e.host), (e = e.host)), (e = e.parentNode));
    return t;
  }
  var zy = hm(wi, Hy);
  var Ny = Ai.forwardRef(function (e, t) {
    return Ai.createElement(sr, kt({}, e, { ref: t, sideCar: zy }));
  });
  Ny.classNames = sr.classNames;
  var Im = Ny;
  var H = A(G(), 1),
    dA = Object.defineProperty,
    pe = (e, t) => dA(e, 'name', { value: t, configurable: !0 }),
    mA = [' ', 'Enter', 'ArrowUp', 'ArrowDown'],
    pA = [' ', 'Enter'],
    Xn = 'Select',
    [ki, Am, hA] = Pd(Xn),
    [Do, bD] = nl(Xn, [hA, um]),
    Tm = um(),
    [gA, Xl] = Do(Xn),
    [xA, LA] = Do(Xn);
  function Gy(e) {
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
        name: h,
        autoComplete: m,
        disabled: f,
        required: p,
        form: L,
        internal_do_not_use_render: S,
      } = e,
      v = Tm(t),
      [g, d] = D.useState(null),
      [c, x] = D.useState(null),
      [y, I] = D.useState(!1),
      b = Ud(i),
      [C, R] = Li({ prop: l, defaultProp: o ?? !1, onChange: n, caller: Xn }),
      [T, B] = Li({ prop: u, defaultProp: r, onChange: s, caller: Xn }),
      O = D.useRef(null),
      U = D.useRef(T);
    D.useEffect(() => {
      let Oe = L ? g?.ownerDocument.getElementById(L) : g?.form;
      if (Oe instanceof HTMLFormElement) {
        let rt = pe(() => B(U.current), 'reset');
        return (Oe.addEventListener('reset', rt), () => Oe.removeEventListener('reset', rt));
      }
    }, [L, g, B]);
    let Q = g ? !!L || !!g.closest('form') : !0,
      [ae, z] = D.useState(new Set()),
      j = li(),
      N = Array.from(ae)
        .map((Oe) => Oe.props.value)
        .join(';'),
      le = D.useCallback((Oe) => {
        z((rt) => new Set(rt).add(Oe));
      }, []),
      k = D.useCallback((Oe) => {
        z((rt) => {
          let Ft = new Set(rt);
          return (Ft.delete(Oe), Ft);
        });
      }, []),
      qt = {
        required: p,
        trigger: g,
        onTriggerChange: d,
        valueNode: c,
        onValueNodeChange: x,
        valueNodeHasChildren: y,
        onValueNodeHasChildrenChange: I,
        contentId: j,
        value: T,
        onValueChange: B,
        open: C,
        onOpenChange: R,
        dir: b,
        triggerPointerDownPosRef: O,
        disabled: f,
        name: h,
        autoComplete: m,
        form: L,
        nativeOptions: ae,
        nativeSelectKey: N,
        isFormControl: Q,
      };
    return (0, H.jsx)(ay, {
      ...v,
      children: (0, H.jsx)(gA, {
        scope: t,
        ...qt,
        children: (0, H.jsx)(ki.Provider, {
          scope: t,
          children: (0, H.jsx)(xA, {
            scope: t,
            onNativeOptionAdd: le,
            onNativeOptionRemove: k,
            children: Wy(S) ? S(qt) : a,
          }),
        }),
      }),
    });
  }
  pe(Gy, 'SelectProvider');
  var Vy = pe((e) => {
      let { __scopeSelect: t, children: a, ...l } = e;
      return (0, H.jsx)(Gy, {
        __scopeSelect: t,
        ...l,
        internal_do_not_use_render: ({ isFormControl: o }) =>
          (0, H.jsxs)(H.Fragment, {
            children: [a, o ? (0, H.jsx)(BA, { __scopeSelect: t }) : null],
          }),
      });
    }, 'Select'),
    SA = 'SelectTrigger',
    km = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, disabled: o = !1, ...n } = t,
          u = Tm(l),
          r = Xl(SA, l),
          s = r.disabled || o,
          i = ge(a, r.onTriggerChange),
          h = Am(l),
          m = D.useRef('touch'),
          [f, p, L] = Em((v) => {
            let g = h().filter((x) => !x.disabled),
              d = g.find((x) => x.value === r.value),
              c = Om(g, v, d);
            c !== void 0 && r.onValueChange(c.value);
          }),
          S = pe((v) => {
            (s || (r.onOpenChange(!0), L()),
              v &&
                (r.triggerPointerDownPosRef.current = {
                  x: Math.round(v.pageX),
                  y: Math.round(v.pageY),
                }));
          }, 'handleOpen');
        return (0, H.jsx)(ly, {
          asChild: !0,
          ...u,
          children: (0, H.jsx)(We.button, {
            type: 'button',
            role: 'combobox',
            'aria-controls': r.open ? r.contentId : void 0,
            'aria-expanded': r.open,
            'aria-required': r.required,
            'aria-autocomplete': 'none',
            dir: r.dir,
            'data-state': r.open ? 'open' : 'closed',
            disabled: s,
            'data-disabled': s ? '' : void 0,
            'data-placeholder': cr(r.value) ? '' : void 0,
            ...n,
            ref: i,
            onClick: He(n.onClick, (v) => {
              (v.currentTarget.focus(), m.current !== 'mouse' && S(v));
            }),
            onPointerDown: He(n.onPointerDown, (v) => {
              m.current = v.pointerType;
              let g = v.target;
              (g.hasPointerCapture(v.pointerId) && g.releasePointerCapture(v.pointerId),
                v.button === 0 &&
                  v.ctrlKey === !1 &&
                  v.pointerType === 'mouse' &&
                  (S(v), v.preventDefault()));
            }),
            onKeyDown: He(n.onKeyDown, (v) => {
              let g = f.current !== '';
              (!(v.ctrlKey || v.altKey || v.metaKey) && v.key.length === 1 && p(v.key),
                !(g && v.key === ' ') && mA.includes(v.key) && (S(), v.preventDefault()));
            }),
          }),
        });
      }, 'SelectTrigger'),
    ),
    vA = 'SelectValue',
    Xy = D.forwardRef(
      pe(function (t, a) {
        let {
            __scopeSelect: l,
            className: o,
            style: n,
            children: u,
            placeholder: r = '',
            ...s
          } = t,
          i = Xl(vA, l),
          { onValueNodeHasChildrenChange: h } = i,
          m = u !== void 0,
          f = ge(a, i.onValueNodeChange);
        Ae(() => {
          h(m);
        }, [h, m]);
        let p = cr(i.value);
        return (0, H.jsx)(We.span, {
          ...s,
          asChild: p ? !1 : s.asChild,
          ref: f,
          style: { pointerEvents: 'none' },
          children: (0, H.jsx)(D.Fragment, { children: p ? r : u }, p ? 'placeholder' : 'value'),
        });
      }, 'SelectValue'),
    ),
    jy = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, children: o, ...n } = t;
        return (0, H.jsx)(We.span, { 'aria-hidden': !0, ...n, ref: a, children: o || '\u25BC' });
      }, 'SelectIcon'),
    ),
    yA = 'SelectPortal',
    [CA, bA] = Do(yA, { forceMount: void 0 }),
    Yy = pe((e) => {
      let { __scopeSelect: t, forceMount: a, ...l } = e;
      return (0, H.jsx)(CA, {
        scope: e.__scopeSelect,
        forceMount: a,
        children: (0, H.jsx)(ry, { asChild: !0, ...l }),
      });
    }, 'SelectPortal'),
    Mo = 'SelectContent',
    Mm = D.forwardRef(
      pe(function (t, a) {
        let l = bA(Mo, t.__scopeSelect),
          { forceMount: o = l.forceMount, ...n } = t,
          u = Xl(Mo, t.__scopeSelect),
          [r, s] = D.useState();
        return (
          Ae(() => {
            s(new DocumentFragment());
          }, []),
          (0, H.jsx)(fy, {
            present: o || u.open,
            children: ({ present: i }) =>
              i ? (0, H.jsx)(RA, { ...n, ref: a }) : (0, H.jsx)(IA, { ...n, fragment: r }),
          })
        );
      }, 'SelectContent'),
    ),
    IA = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, children: o, fragment: n } = t;
        return n
          ? Rm.createPortal(
              (0, H.jsx)(Ky, {
                scope: l,
                children: (0, H.jsx)(ki.Slot, {
                  scope: l,
                  children: (0, H.jsx)('div', { ref: a, children: o }),
                }),
              }),
              n,
            )
          : null;
      }, 'SelectContentFragment'),
    ),
    Sa = 10,
    [Ky, Mi] = Do(Mo),
    wA = da('SelectContent.RemoveScroll'),
    RA = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l } = t,
          {
            position: o = 'item-aligned',
            onCloseAutoFocus: n,
            onEscapeKeyDown: u,
            onPointerDownOutside: r,
            side: s,
            sideOffset: i,
            align: h,
            alignOffset: m,
            arrowPadding: f,
            collisionBoundary: p,
            collisionPadding: L,
            sticky: S,
            hideWhenDetached: v,
            avoidCollisions: g,
            ...d
          } = t,
          c = Xl(Mo, l),
          [x, y] = D.useState(null),
          [I, b] = D.useState(null),
          C = ge(a, y),
          [R, T] = D.useState(null),
          [B, O] = D.useState(null),
          U = Am(l),
          [Q, ae] = D.useState(!1),
          z = D.useRef(!1);
        (D.useEffect(() => {
          if (x) return yy(x);
        }, [x]),
          ai());
        let j = D.useCallback(
            (F) => {
              let [Y, ...qe] = U().map((Ie) => Ie.ref.current),
                [ue] = qe.slice(-1),
                re = document.activeElement;
              for (let Ie of F)
                if (
                  Ie === re ||
                  (Ie?.scrollIntoView({ block: 'nearest' }),
                  Ie === Y && I && (I.scrollTop = 0),
                  Ie === ue && I && (I.scrollTop = I.scrollHeight),
                  Ie?.focus(),
                  document.activeElement !== re)
                )
                  return;
            },
            [U, I],
          ),
          N = D.useCallback(() => j([R, x]), [j, R, x]);
        D.useEffect(() => {
          Q && N();
        }, [Q, N]);
        let { onOpenChange: le, triggerPointerDownPosRef: k } = c;
        (D.useEffect(() => {
          if (x) {
            let F = { x: 0, y: 0 },
              Y = pe((ue) => {
                F = {
                  x: Math.abs(Math.round(ue.pageX) - (k.current?.x ?? 0)),
                  y: Math.abs(Math.round(ue.pageY) - (k.current?.y ?? 0)),
                };
              }, 'handlePointerMove'),
              qe = pe((ue) => {
                (F.x <= 10 && F.y <= 10
                  ? ue.preventDefault()
                  : ue.composedPath().includes(x) || le(!1),
                  document.removeEventListener('pointermove', Y),
                  (k.current = null));
              }, 'handlePointerUp');
            return (
              k.current !== null &&
                (document.addEventListener('pointermove', Y),
                document.addEventListener('pointerup', qe, { capture: !0, once: !0 })),
              () => {
                (document.removeEventListener('pointermove', Y),
                  document.removeEventListener('pointerup', qe, { capture: !0 }));
              }
            );
          }
        }, [x, le, k]),
          D.useEffect(() => {
            let F = pe(() => le(!1), 'close');
            return (
              window.addEventListener('blur', F),
              window.addEventListener('resize', F),
              () => {
                (window.removeEventListener('blur', F), window.removeEventListener('resize', F));
              }
            );
          }, [le]));
        let [qt, Oe] = Em((F) => {
            let Y = U().filter((re) => !re.disabled),
              qe = Y.find((re) => re.ref.current === document.activeElement),
              ue = Om(Y, F, qe);
            ue && setTimeout(() => ue.ref.current?.focus());
          }),
          rt = D.useCallback(
            (F, Y, qe) => {
              let ue = !z.current && !qe;
              ((c.value !== void 0 && c.value === Y) || ue) && (T(F), ue && (z.current = !0));
            },
            [c.value],
          ),
          Ft = D.useCallback(() => x?.focus(), [x]),
          be = D.useCallback(
            (F, Y, qe) => {
              let ue = !z.current && !qe;
              ((c.value !== void 0 && c.value === Y) || ue) && O(F);
            },
            [c.value],
          ),
          Te = o === 'popper' ? qy : AA,
          Gt =
            Te === qy
              ? {
                  side: s,
                  sideOffset: i,
                  align: h,
                  alignOffset: m,
                  arrowPadding: f,
                  collisionBoundary: p,
                  collisionPadding: L,
                  sticky: S,
                  hideWhenDetached: v,
                  avoidCollisions: g,
                }
              : {};
        return (0, H.jsx)(Ky, {
          scope: l,
          content: x,
          viewport: I,
          onViewportChange: b,
          itemRefCallback: rt,
          selectedItem: R,
          onItemLeave: Ft,
          itemTextRefCallback: be,
          focusSelectedItem: N,
          selectedItemText: B,
          position: o,
          isPositioned: Q,
          searchRef: qt,
          children: (0, H.jsx)(Im, {
            as: wA,
            allowPinchZoom: !0,
            children: (0, H.jsx)(jS, {
              asChild: !0,
              trapped: c.open,
              onMountAutoFocus: (F) => {
                F.preventDefault();
              },
              onUnmountAutoFocus: He(n, (F) => {
                (c.trigger?.focus({ preventScroll: !0 }), F.preventDefault());
              }),
              children: (0, H.jsx)(zS, {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: u,
                onPointerDownOutside: r,
                onFocusOutside: (F) => F.preventDefault(),
                onDismiss: () => c.onOpenChange(!1),
                children: (0, H.jsx)(Te, {
                  role: 'listbox',
                  id: c.contentId,
                  'data-state': c.open ? 'open' : 'closed',
                  dir: c.dir,
                  onContextMenu: (F) => F.preventDefault(),
                  ...d,
                  ...Gt,
                  onPlaced: () => ae(!0),
                  ref: C,
                  style: { display: 'flex', flexDirection: 'column', outline: 'none', ...d.style },
                  onKeyDown: He(d.onKeyDown, (F) => {
                    let Y = F.ctrlKey || F.altKey || F.metaKey;
                    if (
                      (F.key === 'Tab' && F.preventDefault(),
                      !Y && F.key.length === 1 && Oe(F.key),
                      ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(F.key))
                    ) {
                      let ue = U()
                        .filter((re) => !re.disabled)
                        .map((re) => re.ref.current);
                      if (
                        (['ArrowUp', 'End'].includes(F.key) && (ue = ue.slice().reverse()),
                        ['ArrowUp', 'ArrowDown'].includes(F.key))
                      ) {
                        let re = F.target,
                          Ie = ue.indexOf(re);
                        ue = ue.slice(Ie + 1);
                      }
                      (setTimeout(() => j(ue)), F.preventDefault());
                    }
                  }),
                }),
              }),
            }),
          }),
        });
      }, 'SelectContentImpl'),
    ),
    AA = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, onPlaced: o, ...n } = t,
          u = Xl(Mo, l),
          r = Mi(Mo, l),
          [s, i] = D.useState(null),
          [h, m] = D.useState(null),
          f = ge(a, m),
          p = Am(l),
          L = D.useRef(!1),
          S = D.useRef(!0),
          { viewport: v, selectedItem: g, selectedItemText: d, focusSelectedItem: c } = r,
          x = D.useCallback(() => {
            if (u.trigger && u.valueNode && s && h && v && g && d) {
              let C = u.trigger.getBoundingClientRect(),
                R = h.getBoundingClientRect(),
                T = u.valueNode.getBoundingClientRect(),
                B = d.getBoundingClientRect();
              if (u.dir !== 'rtl') {
                let re = B.left - R.left,
                  Ie = T.left - re,
                  Lt = C.left - Ie,
                  Vt = C.width + Lt,
                  Oi = Math.max(Vt, R.width),
                  Bi = window.innerWidth - Sa,
                  Pi = Qs(Ie, [Sa, Math.max(Sa, Bi - Oi)]);
                ((s.style.minWidth = Vt + 'px'), (s.style.left = Pi + 'px'));
              } else {
                let re = R.right - B.right,
                  Ie = window.innerWidth - T.right - re,
                  Lt = window.innerWidth - C.right - Ie,
                  Vt = C.width + Lt,
                  Oi = Math.max(Vt, R.width),
                  Bi = window.innerWidth - Sa,
                  Pi = Qs(Ie, [Sa, Math.max(Sa, Bi - Oi)]);
                ((s.style.minWidth = Vt + 'px'), (s.style.right = Pi + 'px'));
              }
              let O = p(),
                U = window.innerHeight - Sa * 2,
                Q = v.scrollHeight,
                ae = window.getComputedStyle(h),
                z = parseInt(ae.borderTopWidth, 10),
                j = parseInt(ae.paddingTop, 10),
                N = parseInt(ae.borderBottomWidth, 10),
                le = parseInt(ae.paddingBottom, 10),
                k = z + j + Q + le + N,
                qt = Math.min(g.offsetHeight * 5, k),
                Oe = window.getComputedStyle(v),
                rt = parseInt(Oe.paddingTop, 10),
                Ft = parseInt(Oe.paddingBottom, 10),
                be = C.top + C.height / 2 - Sa,
                Te = U - be,
                Gt = g.offsetHeight / 2,
                F = g.offsetTop + Gt,
                Y = z + j + F,
                qe = k - Y;
              if (Y <= be) {
                let re = O.length > 0 && g === O[O.length - 1].ref.current;
                s.style.bottom = '0px';
                let Ie = h.clientHeight - v.offsetTop - v.offsetHeight,
                  Lt = Math.max(Te, Gt + (re ? Ft : 0) + Ie + N),
                  Vt = Y + Lt;
                s.style.height = Vt + 'px';
              } else {
                let re = O.length > 0 && g === O[0].ref.current;
                s.style.top = '0px';
                let Lt = Math.max(be, z + v.offsetTop + (re ? rt : 0) + Gt) + qe;
                ((s.style.height = Lt + 'px'), (v.scrollTop = Y - be + v.offsetTop));
              }
              ((s.style.margin = `${Sa}px 0`),
                (s.style.minHeight = qt + 'px'),
                (s.style.maxHeight = U + 'px'),
                o?.(),
                requestAnimationFrame(() => (L.current = !0)));
            }
          }, [p, u.trigger, u.valueNode, s, h, v, g, d, u.dir, o]);
        Ae(() => x(), [x]);
        let [y, I] = D.useState();
        Ae(() => {
          h && I(window.getComputedStyle(h).zIndex);
        }, [h]);
        let b = D.useCallback(
          (C) => {
            C && S.current === !0 && (x(), c?.(), (S.current = !1));
          },
          [x, c],
        );
        return (0, H.jsx)(TA, {
          scope: l,
          contentWrapper: s,
          shouldExpandOnScrollRef: L,
          onScrollButtonChange: b,
          children: (0, H.jsx)('div', {
            ref: i,
            style: { display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: y },
            children: (0, H.jsx)(We.div, {
              ...n,
              ref: f,
              style: { boxSizing: 'border-box', maxHeight: '100%', ...n.style },
            }),
          }),
        });
      }, 'SelectItemAlignedPosition'),
    ),
    qy = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, align: o = 'start', collisionPadding: n = Sa, ...u } = t,
          r = Tm(l);
        return (0, H.jsx)(oy, {
          ...r,
          ...u,
          ref: a,
          align: o,
          collisionPadding: n,
          style: {
            boxSizing: 'border-box',
            ...u.style,
            '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
            '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
            '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)',
          },
        });
      }, 'SelectPopperPosition'),
    ),
    [TA, kA] = Do(Mo, {}),
    Fy = 'SelectViewport',
    Zy = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, nonce: o, ...n } = t,
          u = Mi(Fy, l),
          r = kA(Fy, l),
          s = ge(a, u.onViewportChange),
          i = D.useRef(0);
        return (0, H.jsxs)(H.Fragment, {
          children: [
            (0, H.jsx)('style', {
              dangerouslySetInnerHTML: {
                __html:
                  '[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}',
              },
              nonce: o,
            }),
            (0, H.jsx)(ki.Slot, {
              scope: l,
              children: (0, H.jsx)(We.div, {
                'data-radix-select-viewport': '',
                role: 'presentation',
                ...n,
                ref: s,
                style: { position: 'relative', flex: 1, overflow: 'hidden auto', ...n.style },
                onScroll: He(n.onScroll, (h) => {
                  let m = h.currentTarget,
                    { contentWrapper: f, shouldExpandOnScrollRef: p } = r;
                  if (p?.current && f) {
                    let L = Math.abs(i.current - m.scrollTop);
                    if (L > 0) {
                      let S = window.innerHeight - Sa * 2,
                        v = parseFloat(f.style.minHeight),
                        g = parseFloat(f.style.height),
                        d = Math.max(v, g);
                      if (d < S) {
                        let c = d + L,
                          x = Math.min(S, c),
                          y = c - x;
                        ((f.style.height = x + 'px'),
                          f.style.bottom === '0px' &&
                            ((m.scrollTop = y > 0 ? y : 0), (f.style.justifyContent = 'flex-end')));
                      }
                    }
                  }
                  i.current = m.scrollTop;
                }),
              }),
            }),
          ],
        });
      }, 'SelectViewport'),
    ),
    MA = 'SelectGroup',
    [ID, wD] = Do(MA);
  var wm = 'SelectItem',
    [DA, EA] = Do(wm),
    Dm = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, value: o, disabled: n = !1, textValue: u, ...r } = t,
          s = Xl(wm, l),
          i = Mi(wm, l),
          h = s.value === o,
          [m, f] = D.useState(u ?? ''),
          [p, L] = D.useState(!1),
          S = Tt((x) => i.itemRefCallback?.(x, o, n)),
          v = ge(a, S),
          g = li(),
          d = D.useRef('touch'),
          c = pe(() => {
            n || (s.onValueChange(o), s.onOpenChange(!1));
          }, 'handleSelect');
        return (0, H.jsx)(DA, {
          scope: l,
          value: o,
          disabled: n,
          textId: g,
          isSelected: h,
          onItemTextChange: D.useCallback((x) => {
            f((y) => y || (x?.textContent ?? '').trim());
          }, []),
          children: (0, H.jsx)(ki.ItemSlot, {
            scope: l,
            value: o,
            disabled: n,
            textValue: m,
            children: (0, H.jsx)(We.div, {
              role: 'option',
              'aria-labelledby': g,
              'data-highlighted': p ? '' : void 0,
              'aria-selected': h && p,
              'data-state': h ? 'checked' : 'unchecked',
              'aria-disabled': n || void 0,
              'data-disabled': n ? '' : void 0,
              tabIndex: n ? void 0 : -1,
              ...r,
              ref: v,
              onFocus: He(r.onFocus, () => L(!0)),
              onBlur: He(r.onBlur, () => L(!1)),
              onClick: He(r.onClick, () => {
                d.current !== 'mouse' && c();
              }),
              onPointerUp: He(r.onPointerUp, () => {
                d.current === 'mouse' && c();
              }),
              onPointerDown: He(r.onPointerDown, (x) => {
                d.current = x.pointerType;
              }),
              onPointerMove: He(r.onPointerMove, (x) => {
                ((d.current = x.pointerType),
                  n
                    ? i.onItemLeave?.()
                    : d.current === 'mouse' && x.currentTarget.focus({ preventScroll: !0 }));
              }),
              onPointerLeave: He(r.onPointerLeave, (x) => {
                x.currentTarget === document.activeElement && i.onItemLeave?.();
              }),
              onKeyDown: He(r.onKeyDown, (x) => {
                n ||
                  x.target !== x.currentTarget ||
                  (i.searchRef?.current !== '' && x.key === ' ') ||
                  (pA.includes(x.key) && c(), x.key === ' ' && x.preventDefault());
              }),
            }),
          }),
        });
      }, 'SelectItem'),
    ),
    Ti = 'SelectItemText',
    Qy = D.forwardRef(
      pe(function (t, a) {
        let { __scopeSelect: l, className: o, style: n, ...u } = t,
          r = Xl(Ti, l),
          s = Mi(Ti, l),
          i = EA(Ti, l),
          h = LA(Ti, l),
          [m, f] = D.useState(null),
          p = Tt((c) => s.itemTextRefCallback?.(c, i.value, i.disabled)),
          L = ge(a, f, i.onItemTextChange, p),
          S = m?.textContent,
          v = D.useMemo(
            () =>
              (0, H.jsx)('option', { value: i.value, disabled: i.disabled, children: S }, i.value),
            [i.disabled, i.value, S],
          ),
          { onNativeOptionAdd: g, onNativeOptionRemove: d } = h;
        return (
          Ae(() => (g(v), () => d(v)), [g, d, v]),
          (0, H.jsxs)(H.Fragment, {
            children: [
              (0, H.jsx)(We.span, { id: i.textId, ...u, ref: L }),
              i.isSelected && r.valueNode && !r.valueNodeHasChildren && !cr(r.value)
                ? Rm.createPortal(u.children, r.valueNode)
                : null,
            ],
          })
        );
      }, 'SelectItemText'),
    );
  var OA = 'SelectBubbleInput',
    BA = D.forwardRef(
      pe(function ({ __scopeSelect: t, ...a }, l) {
        let o = Xl(OA, t),
          {
            value: n,
            onValueChange: u,
            required: r,
            disabled: s,
            name: i,
            autoComplete: h,
            form: m,
          } = o,
          { nativeOptions: f, nativeSelectKey: p } = o,
          L = D.useRef(null),
          S = ge(l, L),
          v = n ?? '',
          g = im(v),
          d = Array.from(f).some((c) => (c.props.value ?? '') === '');
        return (
          D.useEffect(() => {
            let c = L.current;
            if (!c) return;
            let x = window.HTMLSelectElement.prototype,
              I = Object.getOwnPropertyDescriptor(x, 'value').set;
            if (g !== v && I) {
              let b = new Event('change', { bubbles: !0 });
              (I.call(c, v), c.dispatchEvent(b));
            }
          }, [g, v]),
          (0, H.jsxs)(
            We.select,
            {
              'aria-hidden': !0,
              required: r,
              tabIndex: -1,
              name: i,
              autoComplete: h,
              disabled: s,
              form: m,
              onChange: (c) => u(c.target.value),
              ...a,
              style: { ...Sy, ...a.style },
              ref: S,
              defaultValue: v,
              children: [cr(n) && !d ? (0, H.jsx)('option', { value: '' }) : null, Array.from(f)],
            },
            p,
          )
        );
      }, 'SelectBubbleInput'),
    );
  function Wy(e) {
    return typeof e == 'function';
  }
  pe(Wy, 'isFunction');
  function cr(e) {
    return e === '' || e === void 0;
  }
  pe(cr, 'shouldShowPlaceholder');
  function Em(e) {
    let t = Tt(e),
      a = D.useRef(''),
      l = D.useRef(0),
      o = D.useCallback(
        (u) => {
          let r = a.current + u;
          (t(r),
            pe(function s(i) {
              ((a.current = i),
                window.clearTimeout(l.current),
                i !== '' && (l.current = window.setTimeout(() => s(''), 1e3)));
            }, 'updateSearch')(r));
        },
        [t],
      ),
      n = D.useCallback(() => {
        ((a.current = ''), window.clearTimeout(l.current));
      }, []);
    return (D.useEffect(() => () => window.clearTimeout(l.current), []), [a, o, n]);
  }
  pe(Em, 'useTypeaheadSearch');
  function Om(e, t, a) {
    let o = t.length > 1 && Array.from(t).every((i) => i === t[0]) ? t[0] : t,
      n = a ? e.indexOf(a) : -1,
      u = Jy(e, Math.max(n, 0));
    o.length === 1 && (u = u.filter((i) => i !== a));
    let s = u.find((i) => i.textValue.toLowerCase().startsWith(o.toLowerCase()));
    return s !== a ? s : void 0;
  }
  pe(Om, 'findNextItem');
  function Jy(e, t) {
    return e.map((a, l) => e[(t + l) % e.length]);
  }
  pe(Jy, 'wrapArray');
  var Pa = A(G(), 1),
    jn = Vy;
  var Yn = Xy,
    Eo = (0, Di.forwardRef)(({ className: e, children: t, ...a }, l) =>
      (0, Pa.jsxs)(km, {
        ref: l,
        className: ot(
          'flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[&>span]:line-clamp-1',
          e,
        ),
        ...a,
        children: [
          t,
          (0, Pa.jsx)(jy, {
            asChild: !0,
            children: (0, Pa.jsx)($u, { className: 'h-4 w-4 opacity-50' }),
          }),
        ],
      }),
    );
  Eo.displayName = km.displayName;
  var Oo = (0, Di.forwardRef)(
    ({ className: e, children: t, position: a = 'item-aligned', ...l }, o) =>
      (0, Pa.jsx)(Yy, {
        children: (0, Pa.jsx)(Mm, {
          ref: o,
          className: ot(
            'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            a === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
            e,
          ),
          position: a,
          ...l,
          children: (0, Pa.jsx)(Zy, {
            className: ot(
              'p-1',
              a === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            ),
            children: t,
          }),
        }),
      }),
  );
  Oo.displayName = Mm.displayName;
  var fl = (0, Di.forwardRef)(({ className: e, children: t, ...a }, l) =>
    (0, Pa.jsx)(Dm, {
      ref: l,
      className: ot(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-md-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        e,
      ),
      ...a,
      children: (0, Pa.jsx)(Qy, { children: t }),
    }),
  );
  fl.displayName = Dm.displayName;
  var X = A(G(), 1),
    _A = '/rekam-medik/search?opsi=kodeicd10&q=';
  function $y({ rows: e, onChange: t }) {
    let [a, l] = (0, jl.useState)([]),
      [o, n] = (0, jl.useState)(-1),
      [u, r] = (0, jl.useState)({ top: 0, left: 0, width: 0 }),
      [s, i] = (0, jl.useState)(''),
      h = (0, jl.useRef)(null),
      m = (0, jl.useRef)(null),
      f = (d, c) => t(e.map((x, y) => (y === d ? { ...x, ...c } : x))),
      p = (d) => t(e.filter((c, x) => x !== d)),
      L = (d, c, x) => {
        if ((i(''), clearTimeout(h.current ?? void 0), m.current?.abort(), d.length < 3)) {
          (l([]), n(-1));
          return;
        }
        let y = x.getBoundingClientRect();
        (r({ top: y.bottom + 2, left: y.left, width: y.width }),
          (h.current = setTimeout(async () => {
            let I = new AbortController();
            m.current = I;
            try {
              let b = await fetch(`${_A}${encodeURIComponent(d)}`, { signal: I.signal });
              if (!b.ok) {
                i('HTTP ' + b.status);
                return;
              }
              let C = await b.text();
              if (!C || C === '[]') {
                i('Data tidak ditemukan');
                return;
              }
              let R;
              try {
                if (((R = JSON.parse(C)), !Array.isArray(R))) throw new Error('not array');
              } catch {
                R = C.split(
                  `
`,
                )
                  .filter((T) => T.includes('|'))
                  .map((T) => {
                    let [B, O, U] = T.split('|');
                    return { NAMA: B.trim(), KODE: O.trim(), ID: U.trim() };
                  })
                  .filter((T) => T.KODE);
              }
              R.length > 0 ? (l(R.slice(0, 15)), n(c)) : i('Data tidak ditemukan');
            } catch (b) {
              i(String(b));
            }
          }, 300)));
      },
      S = (d, c) => {
        (f(d, { idicd: c.ID, kode10: c.KODE, namaDiagnosa: c.NAMA }), l([]), n(-1));
      },
      v = (d) => (c) => {
        (f(d, { namaDiagnosa: c.target.value }), L(c.target.value, d, c.currentTarget));
      },
      g = (d) => (c) => {
        f(d, { kode10: c.target.value });
      };
    return (0, X.jsxs)('div', {
      children: [
        (0, X.jsx)('div', {
          className: 'flex justify-end mb-3',
          children: (0, X.jsxs)(fa, {
            variant: 'default',
            size: 'sm',
            onClick: () =>
              t([...e, { idicd: '', kode10: '', namaDiagnosa: '', kasus: '', komplikasi: '' }]),
            children: [(0, X.jsx)(Lo, { className: 'size-4' }), ' Tambah Diagnosa'],
          }),
        }),
        e.length === 0
          ? (0, X.jsxs)('div', {
              className: 'border-2 border-dashed border-border rounded-xl py-8 text-center bg-card',
              children: [
                (0, X.jsx)('p', {
                  className: 'text-[16px] text-muted-foreground',
                  children: 'Belum ada diagnosa',
                }),
                (0, X.jsx)('p', {
                  className: 'text-[14px] text-muted-foreground mt-1',
                  children: 'Klik "Tambah Diagnosa" untuk menambahkan',
                }),
              ],
            })
          : (0, X.jsx)('div', {
              className: 'space-y-3',
              children: e.map((d, c) => {
                let x = c + 1;
                return (0, X.jsxs)(
                  'div',
                  {
                    className: 'bg-card rounded-xl border-2 border-border p-3',
                    children: [
                      (0, X.jsxs)('div', {
                        className: 'mb-2',
                        children: [
                          (0, X.jsx)(Xe, { children: 'Nama Diagnosa' }),
                          (0, X.jsxs)('div', {
                            className: 'relative',
                            children: [
                              (0, X.jsx)(ol, {
                                id: `rj-nama${x}`,
                                name: 'nama[]',
                                value: d.namaDiagnosa,
                                placeholder: 'Cari diagnosa...',
                                autoComplete: 'off',
                                onChange: v(c),
                              }),
                              (0, X.jsx)('input', {
                                type: 'hidden',
                                id: `rj-idicd${x}`,
                                name: 'idicd[]',
                                value: d.idicd,
                              }),
                              a.length > 0 &&
                                o === c &&
                                (0, X.jsx)('div', {
                                  className:
                                    'fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto',
                                  style: { top: u.top, left: u.left, width: u.width },
                                  children: a.map((y, I) =>
                                    (0, X.jsxs)(
                                      'div',
                                      {
                                        onClick: () => S(c, y),
                                        className:
                                          'px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors',
                                        children: [
                                          (0, X.jsx)('div', {
                                            className: 'font-medium text-foreground',
                                            children: y.NAMA,
                                          }),
                                          (0, X.jsx)('div', {
                                            className: 'text-muted-foreground text-xs',
                                            children: y.KODE,
                                          }),
                                        ],
                                      },
                                      y.ID || I,
                                    ),
                                  ),
                                }),
                              s &&
                                (0, X.jsx)('div', {
                                  className:
                                    'fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive',
                                  style: { top: u.top, left: u.left },
                                  children: s,
                                }),
                            ],
                          }),
                        ],
                      }),
                      (0, X.jsxs)('div', {
                        className: 'grid grid-cols-[1fr_120px_100px_36px] gap-2 items-end',
                        children: [
                          (0, X.jsxs)('div', {
                            children: [
                              (0, X.jsx)(Xe, { children: 'Kode ICD-10' }),
                              (0, X.jsx)(ol, {
                                id: `rj-kode${x}`,
                                name: 'kode10[]',
                                value: d.kode10,
                                placeholder: 'Kode',
                                onChange: g(c),
                                className: 'font-mono',
                              }),
                            ],
                          }),
                          (0, X.jsxs)('div', {
                            children: [
                              (0, X.jsx)(Xe, { children: 'Kasus' }),
                              (0, X.jsxs)(jn, {
                                value: d.kasus,
                                onValueChange: (y) => f(c, { kasus: y }),
                                children: [
                                  (0, X.jsx)(Eo, {
                                    className: 'h-[32px] text-xs',
                                    children: (0, X.jsx)(Yn, { placeholder: 'Pilih' }),
                                  }),
                                  (0, X.jsxs)(Oo, {
                                    className: 'z-[1050]',
                                    children: [
                                      (0, X.jsx)(fl, { value: 'BARU', children: 'Baru' }),
                                      (0, X.jsx)(fl, { value: 'LAMA', children: 'Lama' }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, X.jsxs)('div', {
                            children: [
                              (0, X.jsx)(Xe, { children: 'Komplikasi' }),
                              (0, X.jsxs)(jn, {
                                value: d.komplikasi,
                                onValueChange: (y) => f(c, { komplikasi: y }),
                                children: [
                                  (0, X.jsx)(Eo, {
                                    className: 'h-[32px] text-xs',
                                    children: (0, X.jsx)(Yn, { placeholder: 'Pilih' }),
                                  }),
                                  (0, X.jsxs)(Oo, {
                                    className: 'z-[1050]',
                                    children: [
                                      (0, X.jsx)(fl, { value: 'YA', children: 'Ya' }),
                                      (0, X.jsx)(fl, { value: 'TIDAK', children: 'Tidak' }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, X.jsx)(fa, {
                            variant: 'ghost',
                            size: 'icon',
                            onClick: () => p(c),
                            className: 'h-8 w-8 text-muted-foreground hover:text-destructive',
                            children: (0, X.jsx)(So, { className: 'size-4' }),
                          }),
                        ],
                      }),
                    ],
                  },
                  c,
                );
              }),
            }),
      ],
    });
  }
  var Yl = A(P(), 1);
  var Z = A(G(), 1),
    UA = '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=',
    HA = [
      { value: 'Primer', label: 'Utama (Primer)' },
      { value: 'Sekunder', label: 'Tambahan (Sekunder)' },
    ],
    zA = [
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
  function eC({ rows: e, onChange: t }) {
    let [a, l] = (0, Yl.useState)([]),
      [o, n] = (0, Yl.useState)(-1),
      [u, r] = (0, Yl.useState)({ top: 0, left: 0, width: 0 }),
      [s, i] = (0, Yl.useState)(''),
      h = (0, Yl.useRef)(null),
      m = (0, Yl.useRef)(null),
      f = (d, c) => t(e.map((x, y) => (y === d ? { ...x, ...c } : x))),
      p = (d) => t(e.filter((c, x) => x !== d)),
      L = (d, c, x) => {
        if ((i(''), clearTimeout(h.current ?? void 0), m.current?.abort(), d.length < 3)) {
          (l([]), n(-1));
          return;
        }
        let y = x.getBoundingClientRect();
        (r({ top: y.bottom + 2, left: y.left, width: y.width }),
          (h.current = setTimeout(async () => {
            let I = new AbortController();
            m.current = I;
            try {
              let b = await fetch(`${UA}${encodeURIComponent(d)}&limit=10`, { signal: I.signal });
              if (!b.ok) {
                i('HTTP ' + b.status);
                return;
              }
              let C = await b.text();
              if (!C || C === '[]') {
                i('Data tidak ditemukan');
                return;
              }
              let R;
              try {
                if (((R = JSON.parse(C)), !Array.isArray(R))) throw new Error('not array');
              } catch {
                R = C.split(
                  `
`,
                )
                  .filter((T) => T.includes('|'))
                  .map((T) => {
                    let [B, O, U] = T.split('|');
                    return { NAMA: B.trim(), KODE: O.trim(), ID: U.trim() };
                  })
                  .filter((T) => T.KODE);
              }
              R.length > 0 ? (l(R.slice(0, 15)), n(c)) : i('Data tidak ditemukan');
            } catch (b) {
              i(String(b));
            }
          }, 300)));
      },
      S = (d, c) => {
        (f(d, { idicdTindakan: c.ID, kode9: c.KODE, namaTindakan: c.NAMA }), l([]), n(-1));
      },
      v = (d) => (c) => {
        (f(d, { namaTindakan: c.target.value }), L(c.target.value, d, c.currentTarget));
      },
      g = (d) => (c) => {
        f(d, { kode9: c.target.value });
      };
    return (0, Z.jsxs)('div', {
      children: [
        (0, Z.jsx)('div', {
          className: 'flex justify-end mb-3',
          children: (0, Z.jsxs)(fa, {
            variant: 'default',
            size: 'sm',
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
            children: [(0, Z.jsx)(Lo, { className: 'size-4' }), ' Tambah Tindakan'],
          }),
        }),
        e.length === 0
          ? (0, Z.jsxs)('div', {
              className: 'border-2 border-dashed border-border rounded-xl py-8 text-center bg-card',
              children: [
                (0, Z.jsx)('p', {
                  className: 'text-[16px] text-muted-foreground',
                  children: 'Belum ada tindakan',
                }),
                (0, Z.jsx)('p', {
                  className: 'text-[14px] text-muted-foreground mt-1',
                  children: 'Klik "Tambah Tindakan" untuk menambahkan',
                }),
              ],
            })
          : (0, Z.jsx)('div', {
              className: 'space-y-3',
              children: e.map((d, c) => {
                let x = c + 1;
                return (0, Z.jsxs)(
                  'div',
                  {
                    className: 'bg-card rounded-xl border-2 border-border p-3',
                    children: [
                      (0, Z.jsxs)('div', {
                        className: 'mb-2',
                        children: [
                          (0, Z.jsx)(Xe, { children: 'Nama Tindakan' }),
                          (0, Z.jsxs)('div', {
                            className: 'relative',
                            children: [
                              (0, Z.jsx)(ol, {
                                id: `rj-tindakan${x}`,
                                name: 'namaTindakan[]',
                                value: d.namaTindakan,
                                placeholder: 'Cari tindakan...',
                                autoComplete: 'off',
                                onChange: v(c),
                              }),
                              (0, Z.jsx)('input', {
                                type: 'hidden',
                                id: `rj-idicdTindakan${x}`,
                                name: 'idicdTindakan[]',
                                value: d.idicdTindakan,
                              }),
                              a.length > 0 &&
                                o === c &&
                                (0, Z.jsx)('div', {
                                  className:
                                    'fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto',
                                  style: { top: u.top, left: u.left, width: u.width },
                                  children: a.map((y, I) =>
                                    (0, Z.jsxs)(
                                      'div',
                                      {
                                        onClick: () => S(c, y),
                                        className:
                                          'px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors',
                                        children: [
                                          (0, Z.jsx)('div', {
                                            className: 'font-medium text-foreground',
                                            children: y.NAMA,
                                          }),
                                          (0, Z.jsx)('div', {
                                            className: 'text-muted-foreground text-xs',
                                            children: y.KODE,
                                          }),
                                        ],
                                      },
                                      y.ID || I,
                                    ),
                                  ),
                                }),
                              s &&
                                (0, Z.jsx)('div', {
                                  className:
                                    'fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive',
                                  style: { top: u.top, left: u.left },
                                  children: s,
                                }),
                            ],
                          }),
                        ],
                      }),
                      (0, Z.jsxs)('div', {
                        className: 'grid grid-cols-[1fr_140px_180px_36px] gap-2 items-end',
                        children: [
                          (0, Z.jsxs)('div', {
                            children: [
                              (0, Z.jsx)(Xe, { children: 'Kode ICD-9' }),
                              (0, Z.jsx)(ol, {
                                id: `rj-kode9${x}`,
                                name: 'kode9[]',
                                value: d.kode9,
                                placeholder: 'Kode',
                                onChange: g(c),
                                className: 'font-mono',
                              }),
                            ],
                          }),
                          (0, Z.jsxs)('div', {
                            children: [
                              (0, Z.jsx)(Xe, { children: 'Jenis' }),
                              (0, Z.jsxs)(jn, {
                                value: d.komorbid,
                                onValueChange: (y) => f(c, { komorbid: y }),
                                children: [
                                  (0, Z.jsx)(Eo, {
                                    className: 'h-[32px] text-xs',
                                    children: (0, Z.jsx)(Yn, { placeholder: 'Pilih' }),
                                  }),
                                  (0, Z.jsx)(Oo, {
                                    className: 'z-[1050]',
                                    children: HA.map((y) =>
                                      (0, Z.jsx)(
                                        fl,
                                        { value: y.value, children: y.label },
                                        y.value,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, Z.jsxs)('div', {
                            children: [
                              (0, Z.jsx)(Xe, { required: !0, children: 'Kategori Prosedur' }),
                              (0, Z.jsxs)(jn, {
                                value: d.kategoriProsedur,
                                onValueChange: (y) => f(c, { kategoriProsedur: y }),
                                children: [
                                  (0, Z.jsx)(Eo, {
                                    className: 'h-[32px] text-xs',
                                    children: (0, Z.jsx)(Yn, { placeholder: 'Pilih Kategori' }),
                                  }),
                                  (0, Z.jsx)(Oo, {
                                    className: 'z-[1050]',
                                    children: zA.map((y) =>
                                      (0, Z.jsx)(
                                        fl,
                                        { value: y.value, children: y.label },
                                        y.value || 'empty',
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, Z.jsx)(fa, {
                            variant: 'ghost',
                            size: 'icon',
                            onClick: () => p(c),
                            className: 'h-8 w-8 text-muted-foreground hover:text-destructive',
                            children: (0, Z.jsx)(So, { className: 'size-4' }),
                          }),
                        ],
                      }),
                    ],
                  },
                  c,
                );
              }),
            }),
      ],
    });
  }
  var je = A(G(), 1);
  function tC({ errors: e, warnings: t = [] }) {
    return e.length > 0 || t.length > 0
      ? (0, je.jsxs)(je.Fragment, {
          children: [
            t.length > 0 &&
              (0, je.jsx)('div', {
                className: 'px-6 py-4 border-t-2 border-border bg-yellow-50 dark:bg-yellow-950/30',
                role: 'alert',
                children: (0, je.jsxs)('div', {
                  className: 'flex items-start gap-3',
                  children: [
                    (0, je.jsx)(ia, {
                      className: 'size-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5',
                    }),
                    (0, je.jsxs)('div', {
                      children: [
                        (0, je.jsx)('p', {
                          className:
                            'text-[15px] font-bold text-yellow-800 dark:text-yellow-300 mb-1',
                          children: 'Perhatian',
                        }),
                        (0, je.jsx)('ul', {
                          className: 'space-y-1',
                          children: t.map((l, o) =>
                            (0, je.jsxs)(
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
              (0, je.jsx)('div', {
                className: 'px-6 py-4 border-t-2 border-border bg-destructive/5',
                role: 'alert',
                children: (0, je.jsxs)('div', {
                  className: 'flex items-start gap-3',
                  children: [
                    (0, je.jsx)(ia, { className: 'size-5 text-destructive shrink-0 mt-0.5' }),
                    (0, je.jsxs)('div', {
                      children: [
                        (0, je.jsxs)('p', {
                          className: 'text-[15px] font-bold text-destructive mb-1',
                          children: ['Terdapat ', e.length, ' kesalahan'],
                        }),
                        (0, je.jsx)('ul', {
                          className: 'space-y-1',
                          children: e.map((l, o) =>
                            (0, je.jsxs)(
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
  var Kn = A(G(), 1),
    NA = {
      default: 'bg-primary/10 text-primary border-primary/20',
      success:
        'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      warning:
        'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      danger: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    qA = { default: er, success: Ju, warning: ia, danger: En };
  function Bm({ variant: e = 'default', icon: t, children: a, className: l, onDismiss: o }) {
    let n = qA[e];
    return (0, Kn.jsxs)('span', {
      className: ot(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
        NA[e],
        l,
      ),
      children: [
        t && (0, Kn.jsx)(n, { className: 'size-3' }),
        a,
        o &&
          (0, Kn.jsx)('button', {
            onClick: o,
            className: 'ml-0.5 hover:opacity-70',
            'aria-label': 'Dismiss',
            children: (0, Kn.jsx)(En, { className: 'size-2.5' }),
          }),
      ],
    });
  }
  var va = A(G(), 1);
  function aC({ onCancel: e, onSave: t, saving: a, hasErrors: l, lastSaved: o, onRefresh: n }) {
    return (0, va.jsxs)('div', {
      className:
        'flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-card',
      children: [
        (0, va.jsxs)('div', {
          className: 'flex items-center gap-3',
          children: [
            l && (0, va.jsx)(Bm, { variant: 'danger', icon: !0, children: 'Validasi gagal' }),
            o &&
              (0, va.jsxs)('span', {
                className: 'text-muted-foreground text-xs',
                children: ['Tersimpan ', o],
              }),
            a && (0, va.jsx)(Bm, { variant: 'default', icon: !0, children: 'Menyimpan...' }),
          ],
        }),
        (0, va.jsxs)('div', {
          className: 'flex items-center gap-2',
          children: [
            n &&
              (0, va.jsx)(fa, {
                type: 'button',
                variant: 'ghost',
                size: 'default',
                onClick: n,
                children: 'Reset',
              }),
            (0, va.jsx)(fa, {
              type: 'button',
              variant: 'outline',
              size: 'default',
              onClick: e,
              children: 'Batal',
            }),
            (0, va.jsx)(fa, {
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
  var xe = A(G(), 1);
  function lC(e) {
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
  function oC({ data: e, onSave: t, onClose: a }) {
    let [l, o] = (0, ya.useState)(e),
      [n, u] = (0, ya.useState)(!1),
      [r, s] = (0, ya.useState)(null),
      [i, h] = (0, ya.useState)(!1),
      [m, f] = (0, ya.useState)([]),
      [p, L] = (0, ya.useState)([]),
      S = (0, ya.useRef)(l.diagnosa.some((y) => y.idicd?.trim())),
      v = i ? lC(l) : [],
      g = [...v, ...p],
      d = v.length > 0,
      c = (0, ya.useCallback)(async () => {
        if ((h(!0), f([]), L([]), lC(l).length > 0)) return;
        let I = l.diagnosa.filter(
          (b) => b.idicd?.trim() && b.kode10?.trim() && b.namaDiagnosa?.trim(),
        );
        (S.current &&
          I.length === 0 &&
          f([
            {
              section: 'Diagnosa',
              message:
                'Semua diagnosa telah dihapus. Sistem Morbis biasanya tidak menghapus ICD yang sudah tersimpan ketika daftar diagnosa dikosongkan.',
            },
          ]),
          u(!0));
        try {
          (await t(l), s(new Date().toLocaleTimeString()));
        } catch (b) {
          let C = b instanceof Error ? b.message : String(b);
          L([{ section: 'Server', message: C }]);
        } finally {
          u(!1);
        }
      }, [l, t]),
      x = (y, I) => o({ ...l, clinicalNotes: { ...l.clinicalNotes, [y]: I } });
    return (0, xe.jsxs)('div', {
      className: 'resume-modal',
      children: [
        (0, xe.jsx)(aS, { title: 'Resume Rawat Jalan', onClose: a, patientInfo: l.patientInfo }),
        (0, xe.jsxs)('div', {
          className: 'flex-1 overflow-y-auto px-5 py-4 space-y-3',
          children: [
            (0, xe.jsx)(Mn, {
              title: 'Data Klinis',
              children: (0, xe.jsx)(lS, {
                anamnesa: l.clinicalNotes.anamnesa,
                pemeriksaan: l.clinicalNotes.pemeriksaan_fisik,
                onChange: (y, I) => x(y === 'pemeriksaan' ? 'pemeriksaan_fisik' : y, I),
              }),
            }),
            (0, xe.jsx)(Mn, {
              title: 'Tanda Vital',
              children: (0, xe.jsx)(uS, {
                vitals: l.vitalSigns,
                onChange: (y, I) => o({ ...l, vitalSigns: { ...l.vitalSigns, [y]: I } }),
              }),
            }),
            (0, xe.jsx)(Mn, {
              title: 'Catatan Medis',
              children: (0, xe.jsxs)('div', {
                className: 'space-y-3',
                children: [
                  (0, xe.jsxs)('div', {
                    children: [
                      (0, xe.jsx)(Xe, { children: 'Catatan Diagnosis' }),
                      (0, xe.jsx)(ql, {
                        value: l.clinicalNotes.catatan,
                        onChange: (y) => x('catatan', y.target.value),
                        placeholder: 'Catatan diagnosa...',
                        rows: 3,
                      }),
                    ],
                  }),
                  (0, xe.jsxs)('div', {
                    children: [
                      (0, xe.jsx)(Xe, { children: 'Tindakan' }),
                      (0, xe.jsx)(ql, {
                        value: l.clinicalNotes.tindakan,
                        onChange: (y) => x('tindakan', y.target.value),
                        placeholder: 'Tindakan...',
                        rows: 3,
                      }),
                    ],
                  }),
                  (0, xe.jsxs)('div', {
                    children: [
                      (0, xe.jsx)(Xe, { children: 'Terapi Pengobatan' }),
                      (0, xe.jsx)(ql, {
                        value: l.clinicalNotes.terapi_pengobatan,
                        onChange: (y) => x('terapi_pengobatan', y.target.value),
                        placeholder: 'Terapi pengobatan...',
                        rows: 3,
                      }),
                    ],
                  }),
                ],
              }),
            }),
            (0, xe.jsx)(Mn, {
              title: `Diagnosis (ICD-10)${l.diagnosa.length > 0 ? ` (${l.diagnosa.length})` : ''}`,
              children: (0, xe.jsx)($y, {
                rows: l.diagnosa,
                onChange: (y) => o({ ...l, diagnosa: y }),
              }),
            }),
            (0, xe.jsx)(Mn, {
              title: `Tindakan (ICD-9)${l.tindakan.length > 0 ? ` (${l.tindakan.length})` : ''}`,
              children: (0, xe.jsx)(eC, {
                rows: l.tindakan,
                onChange: (y) => o({ ...l, tindakan: y }),
              }),
            }),
          ],
        }),
        (0, xe.jsx)(tC, { errors: g, warnings: m }),
        (0, xe.jsx)(aC, {
          saving: n,
          hasErrors: d,
          lastSaved: r,
          onSave: c,
          onCancel: a,
          onRefresh: () => location.reload(),
        }),
      ],
    });
  }
  var nC = A(P(), 1),
    Ei = class extends nC.Component {
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
  var Um = A(G(), 1),
    FA = [
      { pattern: 'periksa.*dokter', weight: 1 },
      { pattern: 'konsultasi', weight: 2 },
      { pattern: 'tindakan utama', weight: 3 },
      { pattern: 'lab', weight: 10 },
      { pattern: 'glukosa', weight: 11 },
      { pattern: 'hba1c', weight: 12 },
      { pattern: 'hb a1c', weight: 12 },
    ];
  function uC(e) {
    let t = new Map();
    return [...e].sort((a, l) => {
      let o = (n) => {
        let u = n.toLowerCase().trim();
        for (let r of FA)
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
  function GA(e) {
    if (!e) return '';
    let t = e.trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
  }
  function rC(e) {
    return e.map(GA).join(`
`);
  }
  function fC() {
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
        let m = Array.from(s.querySelectorAll('td'));
        if (m.length >= 5 && m[0]?.textContent?.trim().match(/^\d+\.?$/)) {
          let f = m[2]?.textContent?.trim() || '',
            p = m[4]?.textContent?.trim() || '1';
          t.push(p && p !== '1' ? `${f} (${p})` : f);
        }
      }
    }
    let n = Array.from(e.querySelectorAll('b')).find((s) => s.textContent?.includes('Biaya Resep'));
    if (n) {
      let s = n.closest('tr')?.nextElementSibling;
      for (; s && !s.textContent?.includes('Sub Total');) {
        if (s.getAttribute('valign') === 'top') {
          let i = Array.from(s.querySelectorAll('td')),
            h = i[1]?.textContent?.trim() || '',
            m = h.match(/^\d+\s+(.*)/),
            f = m ? m[1] : h,
            p = i[2]?.textContent?.trim() || '';
          a.push(p ? `${f} (${p})` : f);
        }
        s = s.nextElementSibling;
      }
    }
    let u = uC(t),
      r = uC(a);
    return (
      console.log('[RJ] extracted billing lines:', {
        tindakanLines: t,
        terapiLines: a,
        sortedTindakan: u,
        sortedTerapi: r,
      }),
      { tindakan: rC(u), terapiPengobatan: rC(r) }
    );
  }
  var fE = location.pathname.includes('rm-rawat-jalan-new');
  var VA = '/rekam-medik/control/rm-rawat-jalan',
    Kl = null,
    Pm = null;
  function XA() {
    let e = document.getElementById('resume-view');
    if (!e) return null;
    let t = (r) => {
        let s = e.querySelectorAll('table table tr, fieldset table tr');
        for (let i of s) {
          let h = i.querySelectorAll('td');
          for (let m = 0; m < h.length; m++)
            if (h[m].textContent?.trim() === r && h[m + 1]) {
              let f = h[m + 1];
              return (f.textContent?.trim() === ':' ? h[m + 2] : f)?.textContent?.trim() || '';
            }
        }
        return '';
      },
      a = () => {
        let r = Array.from(e.querySelectorAll('tr')).find((m) =>
          m.textContent?.includes('Hasil Pemeriksaan Fisik'),
        );
        if (!r) return '';
        let s = r.querySelector('td:last-child table, td[colspan] table');
        if (!s) return '';
        let i = Array.from(s.querySelectorAll('tr')).find((m) => {
          let f = m.querySelectorAll('td');
          return Array.from(f).some((p) => p.textContent?.trim() === 'Lainnya');
        });
        if (!i) return '';
        let h = i.querySelectorAll('td');
        for (let m = 0; m < h.length; m++)
          if (h[m].textContent?.trim() === 'Lainnya' && m + 2 < h.length) {
            let f = h[m + 2]?.textContent?.trim() || '',
              p = ['Tensi:', 'Nadi:', 'Suhu:', 'Nafas:', 'Tinggi:', 'Berat:', 'Lainnya:'];
            return f
              .split(
                `
`,
              )
              .filter((L) => {
                let S = L.trim();
                return S && !p.some((v) => S.startsWith(v));
              }).join(`
`);
          }
        return '';
      },
      l = (r) => {
        let s = Array.from(e.querySelectorAll('tr')).find((m) =>
          m.textContent?.includes('Hasil Pemeriksaan Fisik'),
        );
        if (!s) return '';
        let i = s.querySelector('td:last-child table, td[colspan] table');
        if (!i) return '';
        let h = i.querySelectorAll('tr');
        for (let m of h) {
          let f = m.querySelectorAll('td');
          for (let p = 0; p < f.length; p++)
            if (f[p].textContent?.trim() === r && f[p + 1]) {
              let L = f[p + 1];
              return (L.textContent?.trim() === ':' ? f[p + 2] : L)?.textContent?.trim() || '';
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
          let m = (i.textContent?.trim() || '').match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/);
          m && o.push({ idicd: '', kode10: m[2], namaDiagnosa: m[1], kasus: '', komplikasi: '' });
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
  function jA() {
    console.log('[RJ] extractFormData \u2014 path:', location.pathname);
    let e = XA(),
      t = document,
      a = (f) => t.getElementById(f)?.value || '',
      l = (f) => {
        let p = t.querySelector(
          `textarea[name="${f}"], input[name="${f}"], #${f}, select[name="${f}"]`,
        );
        return p ? ('tagName' in p && p.tagName === 'SELECT' ? p.value : p.value || '') : '';
      },
      o = (f) => t.querySelector(`input[name="${f}"]:checked`)?.value || '',
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
      let f = 1;
      for (
        ;
        t.getElementById(`kode${f}`) || t.querySelector(`input[name="kode10[]"]:nth-child(${f})`);
      ) {
        let p = a(`idicd${f}`) || '',
          L = a(`kode${f}`) || '',
          S = a(`nama${f}`) || '';
        ((L || S) && s.push({ idicd: p, kode10: L, namaDiagnosa: S, kasus: '', komplikasi: '' }),
          f++);
      }
    } else
      i.forEach((f) => {
        let p = f.closest('tr');
        if (!p) return;
        let L = p.querySelector('input[name="idicd[]"], input[name="idicd"]')?.value || '',
          S = f.value || '',
          v = p.querySelector('input[name="namaDiagnosa[]"], input[name="nama[]"]')?.value || '',
          g = p.querySelector('select[name="kasus[]"]')?.value || '',
          d = p.querySelector('select[name="komplikasi[]"]')?.value || '';
        (S || v) && s.push({ idicd: L, kode10: S, namaDiagnosa: v, kasus: g, komplikasi: d });
      });
    if (s.length === 0 && q) {
      let f = Array.isArray(q['kode10[]']) ? q['kode10[]'] : [],
        p = Array.isArray(q['nama[]']) ? q['nama[]'] : [],
        L = Array.isArray(q['idicd[]']) ? q['idicd[]'] : [],
        S = Array.isArray(q['kasus_diagnosa[]']) ? q['kasus_diagnosa[]'] : [],
        v = Array.isArray(q['komplikasi[]']) ? q['komplikasi[]'] : [];
      f.forEach((g, d) => {
        g &&
          s.push({
            idicd: L[d] || '',
            kode10: g,
            namaDiagnosa: p[d] || '',
            kasus: S[d] || '',
            komplikasi: v[d] || '',
          });
      });
    }
    let h = [];
    if (
      (t.querySelectorAll('input[name="kode9[]"]').forEach((f) => {
        let p = f.closest('tr');
        if (!p) return;
        let L = f.value || '';
        if (!L) return;
        let S = p.querySelector('input[name="idicdTindakan[]"]')?.value || '',
          v = p.querySelector('input[name="namaTindakan[]"]')?.value || '',
          g = p.querySelector('select[name="komorbid[]"]')?.value || '',
          d = p.querySelector('select[name="kategoriProsedur[]"]')?.value || '',
          c = p.querySelector('input[name="snomedProsedur[]"]')?.value || '',
          x = p.querySelector('input[name="codeProsedur[]"]')?.value || L;
        h.push({
          idicdTindakan: S,
          kode9: L,
          namaTindakan: v,
          komorbid: g,
          kategoriProsedur: d,
          snomedProsedur: c,
          codeProsedur: x,
        });
      }),
      h.length === 0 && q)
    ) {
      let f = Array.isArray(q['kode9[]']) ? q['kode9[]'] : [],
        p = Array.isArray(q['namaTindakan[]']) ? q['namaTindakan[]'] : [],
        L = Array.isArray(q['idicdTindakan[]']) ? q['idicdTindakan[]'] : [],
        S = Array.isArray(q['komorbid[]']) ? q['komorbid[]'] : [],
        v = Array.isArray(q['kategoriProsedur[]']) ? q['kategoriProsedur[]'] : [];
      f.forEach((g, d) => {
        g &&
          h.push({
            idicdTindakan: L[d] || '',
            kode9: g,
            namaTindakan: p[d] || '',
            komorbid: S[d] || '',
            kategoriProsedur: v[d] || '',
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
        h.length === 0 && h.push(...e.tindakan)),
      !u.tindakan || u.tindakan === '-' || !u.terapi_pengobatan || u.terapi_pengobatan === '-')
    ) {
      let f = fC();
      (f.tindakan && (!u.tindakan || u.tindakan === '-') && (u.tindakan = f.tindakan),
        f.terapiPengobatan &&
          (!u.terapi_pengobatan || u.terapi_pengobatan === '-') &&
          (u.terapi_pengobatan = f.terapiPengobatan));
    }
    if (q) {
      let f = {
        anamnesa: u.anamnesa,
        pemeriksaan_fisik: u.pemeriksaan_fisik,
        catatan: u.catatan,
        tindakan: u.tindakan,
        terapi_pengobatan: u.terapi_pengobatan,
      };
      for (let [p, L] of Object.entries(f))
        if (!L || L === '-') {
          let S = q[p];
          typeof S == 'string' && S && (u[p] = S);
        }
    }
    return { patientInfo: n, clinicalNotes: u, vitalSigns: r, diagnosa: s, tindakan: h };
  }
  function YA(e) {
    let t = [],
      a = (c, x) => t.push([c, String(x)]);
    q?.id_bed || console.log('[RJ] MISS id_bed \u2014 cfs keys:', Object.keys(q || {}).join(','));
    let l = (c) => document.querySelector(`input[name="${c}"]`)?.value || '',
      o = (c) => document.getElementById(c)?.value || '',
      n = (c) => document.querySelector(`input[name="${c}"]:checked`)?.value || '',
      u = (c) => (typeof q?.[c] == 'string' ? q[c] : ''),
      r = (c) => e.patientInfo?.[c] || '';
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
      i = (c) => c.toString().padStart(2, '0');
    a(
      'waktu',
      `${i(s.getDate())}/${i(s.getMonth() + 1)}/${s.getFullYear()} ${i(s.getHours())}:${i(s.getMinutes())}:${i(s.getSeconds())}`,
    );
    let h = (c) => c.replace(/\n/g, '<br/>');
    (a('anamnesa', h(e.clinicalNotes.anamnesa)),
      a('pemeriksaan_fisik', h(e.clinicalNotes.pemeriksaan_fisik)),
      a('catatan', h(e.clinicalNotes.catatan)),
      a('tindakan', h(e.clinicalNotes.tindakan)),
      a('terapi_pengobatan', h(e.clinicalNotes.terapi_pengobatan)));
    let m = (c) => c.match(/^([\d/.]+)/)?.[0] || '';
    (a('tensi', m(e.vitalSigns.tensi)),
      a('nadi', m(e.vitalSigns.nadi)),
      a('suhu', m(e.vitalSigns.suhu)),
      a('nafas', m(e.vitalSigns.nafas)),
      a('tinggi', m(e.vitalSigns.tinggi)),
      a('berat', m(e.vitalSigns.berat)));
    let f = (c) => (Array.isArray(q?.[c]) ? q[c] : []),
      p = f('kode10[]'),
      L = f('idicd[]'),
      S = f('kasus_diagnosa[]'),
      v = f('komplikasi[]');
    return (
      e.diagnosa
        .filter((c) => c.idicd?.trim() && c.kode10?.trim() && c.namaDiagnosa?.trim())
        .filter((c, x, y) => y.findIndex((I) => I.idicd === c.idicd) === x)
        .forEach((c) => {
          let x = c.idicd;
          if (!x && c.kode10) {
            let y = p.indexOf(c.kode10);
            y >= 0 && L[y] && (x = L[y]);
          }
          (a('nama[]', c.namaDiagnosa),
            a('idicd[]', x),
            a('kode10[]', c.kode10),
            a('kasus_diagnosa[]', c.kasus || ''),
            a('komplikasi[]', c.komplikasi || ''));
        }),
      e.tindakan
        .filter((c) => c.idicdTindakan?.trim() && c.kode9?.trim() && c.namaTindakan?.trim())
        .filter(
          (c, x, y) =>
            y.findIndex((I) => I.idicdTindakan === c.idicdTindakan && I.kode9 === c.kode9) === x,
        )
        .forEach((c) => {
          (a('namaTindakan[]', c.namaTindakan),
            a('kode9[]', c.kode9),
            a('idicdTindakan[]', c.idicdTindakan),
            a('kategoriProsedur[]', c.kategoriProsedur || ''),
            a('komorbid[]', c.komorbid || ''),
            a('snomedProsedur[]', c.snomedProsedur || ''),
            a('codeProsedur[]', c.codeProsedur || ''));
        }),
      a('save', 'Simpan'),
      t.map(([c, x]) => encodeURIComponent(c) + '=' + encodeURIComponent(x)).join('&')
    );
  }
  function KA(e) {
    return YA(e);
  }
  function _m(e) {
    (Kl && (Kl.unmount(), (Kl = null)),
      (e.innerHTML = ''),
      (e.style.display = 'none'),
      document.body.classList.remove('ext-resume-open'),
      Pm && (Pm.disabled = !1));
  }
  function ZA(e, t) {
    if (
      (Kl && (Kl.unmount(), (Kl = null)),
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
*//*
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
.mb-2{
  margin-bottom: 0.5rem;
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
.h-\\[28px\\]{
  height: 28px;
}
.h-\\[300px\\]{
  height: 300px;
}
.h-\\[30px\\]{
  height: 30px;
}
.h-\\[32px\\]{
  height: 32px;
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
.w-\\[28px\\]{
  width: 28px;
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
.grid-cols-2{
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3{
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-\\[1fr_120px_100px_36px\\]{
  grid-template-columns: 1fr 120px 100px 36px;
}
.grid-cols-\\[1fr_140px_180px_36px\\]{
  grid-template-columns: 1fr 140px 180px 36px;
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
.items-end{
  align-items: flex-end;
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
.bg-gray-100{
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-green-100{
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
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
.bg-red-100{
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
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
.text-gray-700{
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
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
.text-red-700{
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
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

      /* \u2500\u2500 Reset host-page overrides inside the modal \u2500\u2500 */
      /* ponytail: specificity 0-2-0 beats most host styles without !important */
      .resume-modal .resume-modal {
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
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
      }
      .resume-modal .resume-modal *,
      .resume-modal .resume-modal *::before,
      .resume-modal .resume-modal *::after {
        box-sizing: border-box;
      }
      /* Neutralize host page input/select/textarea defaults.
         No reset on buttons \u2014 our Button component owns its own styling via Tailwind. */
      .resume-modal .resume-modal input,
      .resume-modal .resume-modal select,
      .resume-modal .resume-modal textarea {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: default;
      }
      .resume-modal .resume-modal input,
      .resume-modal .resume-modal select,
      .resume-modal .resume-modal textarea {
        height: auto;
        min-height: 32px;
        width: 100%;
        border: 1px solid hsl(214.3 31.8% 91.4%);
        border-radius: 6px;
        background: white;
        padding: 4px 10px;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .resume-modal .resume-modal input:focus,
      .resume-modal .resume-modal select:focus,
      .resume-modal .resume-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .resume-modal .resume-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .resume-modal .resume-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .resume-modal .resume-modal h1,
      .resume-modal .resume-modal h2,
      .resume-modal .resume-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
      /* \u2500\u2500 Radix Select portal (renders outside .resume-modal) \u2500\u2500 */
      [data-radix-select-viewport] {
        padding: 4px;
      }
      [data-radix-select-viewport] [role="option"] {
        all: unset;
        display: flex;
        align-items: center;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        line-height: 18px;
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
        color: #1a1d23;
      }
      [data-radix-select-viewport] [role="option"]:focus,
      [data-radix-select-viewport] [role="option"][data-highlighted] {
        background: hsl(210 40% 96.1%);
        color: hsl(222.2 47.4% 11.2%);
      }
      [data-radix-popper-content-wrapper] {
        z-index: 2147483646 !important;
      }
      @keyframes resume-slideup { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    `),
        document.head.appendChild(l));
    }
    Kl = (0, cC.createRoot)(e);
    let a = async (l) => {
      let o = KA(l),
        n = await fetch(VA, {
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
        let h = i[0].trim().replace(/<[^>]+>/g, '');
        h &&
          (/github\.com\/newrelic|newrelic-browser|google-analytics|googletagmanager/i.test(h) ||
            s.push(h));
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
    (Kl.render(
      (0, Um.jsx)(Ei, {
        onError: () => setTimeout(() => _m(e), 0),
        children: (0, Um.jsx)(oC, { data: t, onSave: a, onClose: () => _m(e) }),
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
  async function QA() {
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
  function WA() {
    let e = [];
    for (let t of document.querySelectorAll('p, td')) {
      let a = t.textContent?.trim().match(/No Resep\s*:\s*(\d+)/i);
      a && !e.includes(a[1]) && e.push(a[1]);
    }
    return e;
  }
  async function JA(e) {
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
      let h = s[i].querySelectorAll('td');
      if (h.length < 8) continue;
      let m = h[1]?.textContent?.trim(),
        f = h[7]?.textContent?.trim(),
        p = h[5]?.textContent?.trim();
      m && r.push(`${m} - ${f || '-'}`);
    }
    return r;
  }
  async function $A() {
    let e = WA();
    if (!e.length) return null;
    let t = await Promise.all(
        e.map((o) => {
          let n = `${location.origin}/admisi/pelaksanaan_pelayanan/history/resep?id=${o}`;
          return JA(n);
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
  function sC() {
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
      (l.className = 'resume-modal'),
      (l.style.cssText =
        'position: fixed; inset: 0; z-index: 1000; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;'),
      document.body.appendChild(l));
    let o = document.createElement('button');
    ((Pm = o),
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
            q || (q = await QA());
            let n = await $A(),
              u = jA();
            n && (u.clinicalNotes.terapi_pengobatan = n);
            let r = !u.clinicalNotes.tindakan || u.clinicalNotes.tindakan === '-',
              s = !u.clinicalNotes.terapi_pengobatan || u.clinicalNotes.terapi_pengobatan === '-';
            if (r || s) {
              let i = fC();
              (i.tindakan && r && (u.clinicalNotes.tindakan = i.tindakan),
                i.terapiPengobatan &&
                  s &&
                  (u.clinicalNotes.terapi_pengobatan = i.terapiPengobatan));
            }
            ((l.style.display = 'flex'), ZA(l, u));
          } catch (n) {
            (console.error('[RJ] click error:', n), (l.style.display = 'none'), (o.disabled = !1));
          }
        }
      }),
      document.body.appendChild(o),
      document.addEventListener('keydown', (n) => {
        n.key === 'Escape' && l.style.display !== 'none' && _m(l);
      }));
  }
  function iC() {
    return document.documentElement.getAttribute('data-ext-resume-modal') === '1';
  }
  function e1() {
    return (
      ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'].some((t) =>
        location.pathname.toLowerCase().includes(t),
      ) || document.querySelectorAll('input[type="password"]').length > 0
    );
  }
  function t1(e = 5e3) {
    return iC()
      ? Promise.resolve(!0)
      : new Promise((t) => {
          let a = Date.now(),
            l = setInterval(() => {
              iC() ? (clearInterval(l), t(!0)) : Date.now() - a > e && (clearInterval(l), t(!1));
            }, 200);
        });
  }
  (async () =>
    e1() ||
    ((await t1()) &&
      (document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', sC)
        : sC())))();
  return xC(a1);
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
   * @license lucide-react v1.33.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
