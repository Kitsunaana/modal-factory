import { isFunction as sr } from "@modal-factory/core";
import { isPlainObject as $t, combineReducers as Vt, applyMiddleware as ar, compose as Qe, createStore as cr, isAction as zt } from "redux";
var ke = { exports: {} }, N = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vt;
function fr() {
  if (vt) return N;
  vt = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), a = Symbol.for("react.consumer"), f = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), _ = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), b = Symbol.iterator;
  function g(n) {
    return n === null || typeof n != "object" ? null : (n = b && n[b] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var w = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, R = Object.assign, j = {};
  function $(n, c, E) {
    this.props = n, this.context = c, this.refs = j, this.updater = E || w;
  }
  $.prototype.isReactComponent = {}, $.prototype.setState = function(n, c) {
    if (typeof n != "object" && typeof n != "function" && n != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, n, c, "setState");
  }, $.prototype.forceUpdate = function(n) {
    this.updater.enqueueForceUpdate(this, n, "forceUpdate");
  };
  function U() {
  }
  U.prototype = $.prototype;
  function Y(n, c, E) {
    this.props = n, this.context = c, this.refs = j, this.updater = E || w;
  }
  var O = Y.prototype = new U();
  O.constructor = Y, R(O, $.prototype), O.isPureReactComponent = !0;
  var k = Array.isArray, y = { H: null, A: null, T: null, S: null, V: null }, V = Object.prototype.hasOwnProperty;
  function F(n, c, E, v, T, I) {
    return E = I.ref, {
      $$typeof: e,
      type: n,
      key: c,
      ref: E !== void 0 ? E : null,
      props: I
    };
  }
  function W(n, c) {
    return F(
      n.type,
      c,
      void 0,
      void 0,
      void 0,
      n.props
    );
  }
  function K(n) {
    return typeof n == "object" && n !== null && n.$$typeof === e;
  }
  function ae(n) {
    var c = { "=": "=0", ":": "=2" };
    return "$" + n.replace(/[=:]/g, function(E) {
      return c[E];
    });
  }
  var z = /\/+/g;
  function ue(n, c) {
    return typeof n == "object" && n !== null && n.key != null ? ae("" + n.key) : c.toString(36);
  }
  function re() {
  }
  function ee(n) {
    switch (n.status) {
      case "fulfilled":
        return n.value;
      case "rejected":
        throw n.reason;
      default:
        switch (typeof n.status == "string" ? n.then(re, re) : (n.status = "pending", n.then(
          function(c) {
            n.status === "pending" && (n.status = "fulfilled", n.value = c);
          },
          function(c) {
            n.status === "pending" && (n.status = "rejected", n.reason = c);
          }
        )), n.status) {
          case "fulfilled":
            return n.value;
          case "rejected":
            throw n.reason;
        }
    }
    throw n;
  }
  function q(n, c, E, v, T) {
    var I = typeof n;
    (I === "undefined" || I === "boolean") && (n = null);
    var C = !1;
    if (n === null) C = !0;
    else
      switch (I) {
        case "bigint":
        case "string":
        case "number":
          C = !0;
          break;
        case "object":
          switch (n.$$typeof) {
            case e:
            case t:
              C = !0;
              break;
            case d:
              return C = n._init, q(
                C(n._payload),
                c,
                E,
                v,
                T
              );
          }
      }
    if (C)
      return T = T(n), C = v === "" ? "." + ue(n, 0) : v, k(T) ? (E = "", C != null && (E = C.replace(z, "$&/") + "/"), q(T, c, E, "", function(Q) {
        return Q;
      })) : T != null && (K(T) && (T = W(
        T,
        E + (T.key == null || n && n.key === T.key ? "" : ("" + T.key).replace(
          z,
          "$&/"
        ) + "/") + C
      )), c.push(T)), 1;
    C = 0;
    var B = v === "" ? "." : v + ":";
    if (k(n))
      for (var A = 0; A < n.length; A++)
        v = n[A], I = B + ue(v, A), C += q(
          v,
          c,
          E,
          I,
          T
        );
    else if (A = g(n), typeof A == "function")
      for (n = A.call(n), A = 0; !(v = n.next()).done; )
        v = v.value, I = B + ue(v, A++), C += q(
          v,
          c,
          E,
          I,
          T
        );
    else if (I === "object") {
      if (typeof n.then == "function")
        return q(
          ee(n),
          c,
          E,
          v,
          T
        );
      throw c = String(n), Error(
        "Objects are not valid as a React child (found: " + (c === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : c) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return C;
  }
  function te(n, c, E) {
    if (n == null) return n;
    var v = [], T = 0;
    return q(n, v, "", "", function(I) {
      return c.call(E, I, T++);
    }), v;
  }
  function ie(n) {
    if (n._status === -1) {
      var c = n._result;
      c = c(), c.then(
        function(E) {
          (n._status === 0 || n._status === -1) && (n._status = 1, n._result = E);
        },
        function(E) {
          (n._status === 0 || n._status === -1) && (n._status = 2, n._result = E);
        }
      ), n._status === -1 && (n._status = 0, n._result = c);
    }
    if (n._status === 1) return n._result.default;
    throw n._result;
  }
  var ne = typeof reportError == "function" ? reportError : function(n) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var c = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof n == "object" && n !== null && typeof n.message == "string" ? String(n.message) : String(n),
        error: n
      });
      if (!window.dispatchEvent(c)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", n);
      return;
    }
    console.error(n);
  };
  function ce() {
  }
  return N.Children = {
    map: te,
    forEach: function(n, c, E) {
      te(
        n,
        function() {
          c.apply(this, arguments);
        },
        E
      );
    },
    count: function(n) {
      var c = 0;
      return te(n, function() {
        c++;
      }), c;
    },
    toArray: function(n) {
      return te(n, function(c) {
        return c;
      }) || [];
    },
    only: function(n) {
      if (!K(n))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return n;
    }
  }, N.Component = $, N.Fragment = o, N.Profiler = i, N.PureComponent = Y, N.StrictMode = u, N.Suspense = p, N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = y, N.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(n) {
      return y.H.useMemoCache(n);
    }
  }, N.cache = function(n) {
    return function() {
      return n.apply(null, arguments);
    };
  }, N.cloneElement = function(n, c, E) {
    if (n == null)
      throw Error(
        "The argument must be a React element, but you passed " + n + "."
      );
    var v = R({}, n.props), T = n.key, I = void 0;
    if (c != null)
      for (C in c.ref !== void 0 && (I = void 0), c.key !== void 0 && (T = "" + c.key), c)
        !V.call(c, C) || C === "key" || C === "__self" || C === "__source" || C === "ref" && c.ref === void 0 || (v[C] = c[C]);
    var C = arguments.length - 2;
    if (C === 1) v.children = E;
    else if (1 < C) {
      for (var B = Array(C), A = 0; A < C; A++)
        B[A] = arguments[A + 2];
      v.children = B;
    }
    return F(n.type, T, void 0, void 0, I, v);
  }, N.createContext = function(n) {
    return n = {
      $$typeof: f,
      _currentValue: n,
      _currentValue2: n,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, n.Provider = n, n.Consumer = {
      $$typeof: a,
      _context: n
    }, n;
  }, N.createElement = function(n, c, E) {
    var v, T = {}, I = null;
    if (c != null)
      for (v in c.key !== void 0 && (I = "" + c.key), c)
        V.call(c, v) && v !== "key" && v !== "__self" && v !== "__source" && (T[v] = c[v]);
    var C = arguments.length - 2;
    if (C === 1) T.children = E;
    else if (1 < C) {
      for (var B = Array(C), A = 0; A < C; A++)
        B[A] = arguments[A + 2];
      T.children = B;
    }
    if (n && n.defaultProps)
      for (v in C = n.defaultProps, C)
        T[v] === void 0 && (T[v] = C[v]);
    return F(n, I, void 0, void 0, null, T);
  }, N.createRef = function() {
    return { current: null };
  }, N.forwardRef = function(n) {
    return { $$typeof: l, render: n };
  }, N.isValidElement = K, N.lazy = function(n) {
    return {
      $$typeof: d,
      _payload: { _status: -1, _result: n },
      _init: ie
    };
  }, N.memo = function(n, c) {
    return {
      $$typeof: _,
      type: n,
      compare: c === void 0 ? null : c
    };
  }, N.startTransition = function(n) {
    var c = y.T, E = {};
    y.T = E;
    try {
      var v = n(), T = y.S;
      T !== null && T(E, v), typeof v == "object" && v !== null && typeof v.then == "function" && v.then(ce, ne);
    } catch (I) {
      ne(I);
    } finally {
      y.T = c;
    }
  }, N.unstable_useCacheRefresh = function() {
    return y.H.useCacheRefresh();
  }, N.use = function(n) {
    return y.H.use(n);
  }, N.useActionState = function(n, c, E) {
    return y.H.useActionState(n, c, E);
  }, N.useCallback = function(n, c) {
    return y.H.useCallback(n, c);
  }, N.useContext = function(n) {
    return y.H.useContext(n);
  }, N.useDebugValue = function() {
  }, N.useDeferredValue = function(n, c) {
    return y.H.useDeferredValue(n, c);
  }, N.useEffect = function(n, c, E) {
    var v = y.H;
    if (typeof E == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return v.useEffect(n, c);
  }, N.useId = function() {
    return y.H.useId();
  }, N.useImperativeHandle = function(n, c, E) {
    return y.H.useImperativeHandle(n, c, E);
  }, N.useInsertionEffect = function(n, c) {
    return y.H.useInsertionEffect(n, c);
  }, N.useLayoutEffect = function(n, c) {
    return y.H.useLayoutEffect(n, c);
  }, N.useMemo = function(n, c) {
    return y.H.useMemo(n, c);
  }, N.useOptimistic = function(n, c) {
    return y.H.useOptimistic(n, c);
  }, N.useReducer = function(n, c, E) {
    return y.H.useReducer(n, c, E);
  }, N.useRef = function(n) {
    return y.H.useRef(n);
  }, N.useState = function(n) {
    return y.H.useState(n);
  }, N.useSyncExternalStore = function(n, c, E) {
    return y.H.useSyncExternalStore(
      n,
      c,
      E
    );
  }, N.useTransition = function() {
    return y.H.useTransition();
  }, N.version = "19.1.1", N;
}
var Ee = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Ee.exports;
var wt;
function lr() {
  return wt || (wt = 1, (function(e, t) {
    process.env.NODE_ENV !== "production" && (function() {
      function o(r, s) {
        Object.defineProperty(a.prototype, r, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              s[0],
              s[1]
            );
          }
        });
      }
      function u(r) {
        return r === null || typeof r != "object" ? null : (r = Se && r[Se] || r["@@iterator"], typeof r == "function" ? r : null);
      }
      function i(r, s) {
        r = (r = r.constructor) && (r.displayName || r.name) || "ReactClass";
        var h = r + "." + s;
        it[h] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          s,
          r
        ), it[h] = !0);
      }
      function a(r, s, h) {
        this.props = r, this.context = s, this.refs = We, this.updater = h || st;
      }
      function f() {
      }
      function l(r, s, h) {
        this.props = r, this.context = s, this.refs = We, this.updater = h || st;
      }
      function p(r) {
        return "" + r;
      }
      function _(r) {
        try {
          p(r);
          var s = !1;
        } catch {
          s = !0;
        }
        if (s) {
          s = console;
          var h = s.error, m = typeof Symbol == "function" && Symbol.toStringTag && r[Symbol.toStringTag] || r.constructor.name || "Object";
          return h.call(
            s,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            m
          ), p(r);
        }
      }
      function d(r) {
        if (r == null) return null;
        if (typeof r == "function")
          return r.$$typeof === rr ? null : r.displayName || r.name || null;
        if (typeof r == "string") return r;
        switch (r) {
          case n:
            return "Fragment";
          case E:
            return "Profiler";
          case c:
            return "StrictMode";
          case C:
            return "Suspense";
          case B:
            return "SuspenseList";
          case _e:
            return "Activity";
        }
        if (typeof r == "object")
          switch (typeof r.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), r.$$typeof) {
            case ce:
              return "Portal";
            case T:
              return (r.displayName || "Context") + ".Provider";
            case v:
              return (r._context.displayName || "Context") + ".Consumer";
            case I:
              var s = r.render;
              return r = r.displayName, r || (r = s.displayName || s.name || "", r = r !== "" ? "ForwardRef(" + r + ")" : "ForwardRef"), r;
            case A:
              return s = r.displayName || null, s !== null ? s : d(r.type) || "Memo";
            case Q:
              s = r._payload, r = r._init;
              try {
                return d(r(s));
              } catch {
              }
          }
        return null;
      }
      function b(r) {
        if (r === n) return "<>";
        if (typeof r == "object" && r !== null && r.$$typeof === Q)
          return "<...>";
        try {
          var s = d(r);
          return s ? "<" + s + ">" : "<...>";
        } catch {
          return "<...>";
        }
      }
      function g() {
        var r = M.A;
        return r === null ? null : r.getOwner();
      }
      function w() {
        return Error("react-stack-top-frame");
      }
      function R(r) {
        if (Re.call(r, "key")) {
          var s = Object.getOwnPropertyDescriptor(r, "key").get;
          if (s && s.isReactWarning) return !1;
        }
        return r.key !== void 0;
      }
      function j(r, s) {
        function h() {
          lt || (lt = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            s
          ));
        }
        h.isReactWarning = !0, Object.defineProperty(r, "key", {
          get: h,
          configurable: !0
        });
      }
      function $() {
        var r = d(this.type);
        return pt[r] || (pt[r] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), r = this.props.ref, r !== void 0 ? r : null;
      }
      function U(r, s, h, m, S, x, D, L) {
        return h = x.ref, r = {
          $$typeof: ne,
          type: r,
          key: s,
          props: x,
          _owner: S
        }, (h !== void 0 ? h : null) !== null ? Object.defineProperty(r, "ref", {
          enumerable: !1,
          get: $
        }) : Object.defineProperty(r, "ref", { enumerable: !1, value: null }), r._store = {}, Object.defineProperty(r._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(r, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.defineProperty(r, "_debugStack", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: D
        }), Object.defineProperty(r, "_debugTask", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: L
        }), Object.freeze && (Object.freeze(r.props), Object.freeze(r)), r;
      }
      function Y(r, s) {
        return s = U(
          r.type,
          s,
          void 0,
          void 0,
          r._owner,
          r.props,
          r._debugStack,
          r._debugTask
        ), r._store && (s._store.validated = r._store.validated), s;
      }
      function O(r) {
        return typeof r == "object" && r !== null && r.$$typeof === ne;
      }
      function k(r) {
        var s = { "=": "=0", ":": "=2" };
        return "$" + r.replace(/[=:]/g, function(h) {
          return s[h];
        });
      }
      function y(r, s) {
        return typeof r == "object" && r !== null && r.key != null ? (_(r.key), k("" + r.key)) : s.toString(36);
      }
      function V() {
      }
      function F(r) {
        switch (r.status) {
          case "fulfilled":
            return r.value;
          case "rejected":
            throw r.reason;
          default:
            switch (typeof r.status == "string" ? r.then(V, V) : (r.status = "pending", r.then(
              function(s) {
                r.status === "pending" && (r.status = "fulfilled", r.value = s);
              },
              function(s) {
                r.status === "pending" && (r.status = "rejected", r.reason = s);
              }
            )), r.status) {
              case "fulfilled":
                return r.value;
              case "rejected":
                throw r.reason;
            }
        }
        throw r;
      }
      function W(r, s, h, m, S) {
        var x = typeof r;
        (x === "undefined" || x === "boolean") && (r = null);
        var D = !1;
        if (r === null) D = !0;
        else
          switch (x) {
            case "bigint":
            case "string":
            case "number":
              D = !0;
              break;
            case "object":
              switch (r.$$typeof) {
                case ne:
                case ce:
                  D = !0;
                  break;
                case Q:
                  return D = r._init, W(
                    D(r._payload),
                    s,
                    h,
                    m,
                    S
                  );
              }
          }
        if (D) {
          D = r, S = S(D);
          var L = m === "" ? "." + y(D, 0) : m;
          return ct(S) ? (h = "", L != null && (h = L.replace(_t, "$&/") + "/"), W(S, s, h, "", function(se) {
            return se;
          })) : S != null && (O(S) && (S.key != null && (D && D.key === S.key || _(S.key)), h = Y(
            S,
            h + (S.key == null || D && D.key === S.key ? "" : ("" + S.key).replace(
              _t,
              "$&/"
            ) + "/") + L
          ), m !== "" && D != null && O(D) && D.key == null && D._store && !D._store.validated && (h._store.validated = 2), S = h), s.push(S)), 1;
        }
        if (D = 0, L = m === "" ? "." : m + ":", ct(r))
          for (var P = 0; P < r.length; P++)
            m = r[P], x = L + y(m, P), D += W(
              m,
              s,
              h,
              x,
              S
            );
        else if (P = u(r), typeof P == "function")
          for (P === r.entries && (ht || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), ht = !0), r = P.call(r), P = 0; !(m = r.next()).done; )
            m = m.value, x = L + y(m, P++), D += W(
              m,
              s,
              h,
              x,
              S
            );
        else if (x === "object") {
          if (typeof r.then == "function")
            return W(
              F(r),
              s,
              h,
              m,
              S
            );
          throw s = String(r), Error(
            "Objects are not valid as a React child (found: " + (s === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : s) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return D;
      }
      function K(r, s, h) {
        if (r == null) return r;
        var m = [], S = 0;
        return W(r, m, "", "", function(x) {
          return s.call(h, x, S++);
        }), m;
      }
      function ae(r) {
        if (r._status === -1) {
          var s = r._result;
          s = s(), s.then(
            function(h) {
              (r._status === 0 || r._status === -1) && (r._status = 1, r._result = h);
            },
            function(h) {
              (r._status === 0 || r._status === -1) && (r._status = 2, r._result = h);
            }
          ), r._status === -1 && (r._status = 0, r._result = s);
        }
        if (r._status === 1)
          return s = r._result, s === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            s
          ), "default" in s || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            s
          ), s.default;
        throw r._result;
      }
      function z() {
        var r = M.H;
        return r === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), r;
      }
      function ue() {
      }
      function re(r) {
        if (Te === null)
          try {
            var s = ("require" + Math.random()).slice(0, 7);
            Te = (e && e[s]).call(
              e,
              "timers"
            ).setImmediate;
          } catch {
            Te = function(m) {
              mt === !1 && (mt = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var S = new MessageChannel();
              S.port1.onmessage = m, S.port2.postMessage(void 0);
            };
          }
        return Te(r);
      }
      function ee(r) {
        return 1 < r.length && typeof AggregateError == "function" ? new AggregateError(r) : r[0];
      }
      function q(r, s) {
        s !== Ce - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), Ce = s;
      }
      function te(r, s, h) {
        var m = M.actQueue;
        if (m !== null)
          if (m.length !== 0)
            try {
              ie(m), re(function() {
                return te(r, s, h);
              });
              return;
            } catch (S) {
              M.thrownErrors.push(S);
            }
          else M.actQueue = null;
        0 < M.thrownErrors.length ? (m = ee(M.thrownErrors), M.thrownErrors.length = 0, h(m)) : s(r);
      }
      function ie(r) {
        if (!Fe) {
          Fe = !0;
          var s = 0;
          try {
            for (; s < r.length; s++) {
              var h = r[s];
              do {
                M.didUsePromise = !1;
                var m = h(!1);
                if (m !== null) {
                  if (M.didUsePromise) {
                    r[s] = h, r.splice(0, s);
                    return;
                  }
                  h = m;
                } else break;
              } while (!0);
            }
            r.length = 0;
          } catch (S) {
            r.splice(0, s + 1), M.thrownErrors.push(S);
          } finally {
            Fe = !1;
          }
        }
      }
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var ne = Symbol.for("react.transitional.element"), ce = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), v = Symbol.for("react.consumer"), T = Symbol.for("react.context"), I = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), B = Symbol.for("react.suspense_list"), A = Symbol.for("react.memo"), Q = Symbol.for("react.lazy"), _e = Symbol.for("react.activity"), Se = Symbol.iterator, it = {}, st = {
        isMounted: function() {
          return !1;
        },
        enqueueForceUpdate: function(r) {
          i(r, "forceUpdate");
        },
        enqueueReplaceState: function(r) {
          i(r, "replaceState");
        },
        enqueueSetState: function(r) {
          i(r, "setState");
        }
      }, at = Object.assign, We = {};
      Object.freeze(We), a.prototype.isReactComponent = {}, a.prototype.setState = function(r, s) {
        if (typeof r != "object" && typeof r != "function" && r != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, r, s, "setState");
      }, a.prototype.forceUpdate = function(r) {
        this.updater.enqueueForceUpdate(this, r, "forceUpdate");
      };
      var J = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, Oe;
      for (Oe in J)
        J.hasOwnProperty(Oe) && o(Oe, J[Oe]);
      f.prototype = a.prototype, J = l.prototype = new f(), J.constructor = l, at(J, a.prototype), J.isPureReactComponent = !0;
      var ct = Array.isArray, rr = Symbol.for("react.client.reference"), M = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null,
        actQueue: null,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, Re = Object.prototype.hasOwnProperty, ft = console.createTask ? console.createTask : function() {
        return null;
      };
      J = {
        react_stack_bottom_frame: function(r) {
          return r();
        }
      };
      var lt, dt, pt = {}, nr = J.react_stack_bottom_frame.bind(
        J,
        w
      )(), or = ft(b(w)), ht = !1, _t = /\/+/g, yt = typeof reportError == "function" ? reportError : function(r) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var s = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof r == "object" && r !== null && typeof r.message == "string" ? String(r.message) : String(r),
            error: r
          });
          if (!window.dispatchEvent(s)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", r);
          return;
        }
        console.error(r);
      }, mt = !1, Te = null, Ce = 0, Ne = !1, Fe = !1, Et = typeof queueMicrotask == "function" ? function(r) {
        queueMicrotask(function() {
          return queueMicrotask(r);
        });
      } : re;
      J = Object.freeze({
        __proto__: null,
        c: function(r) {
          return z().useMemoCache(r);
        }
      }), t.Children = {
        map: K,
        forEach: function(r, s, h) {
          K(
            r,
            function() {
              s.apply(this, arguments);
            },
            h
          );
        },
        count: function(r) {
          var s = 0;
          return K(r, function() {
            s++;
          }), s;
        },
        toArray: function(r) {
          return K(r, function(s) {
            return s;
          }) || [];
        },
        only: function(r) {
          if (!O(r))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return r;
        }
      }, t.Component = a, t.Fragment = n, t.Profiler = E, t.PureComponent = l, t.StrictMode = c, t.Suspense = C, t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = M, t.__COMPILER_RUNTIME = J, t.act = function(r) {
        var s = M.actQueue, h = Ce;
        Ce++;
        var m = M.actQueue = s !== null ? s : [], S = !1;
        try {
          var x = r();
        } catch (P) {
          M.thrownErrors.push(P);
        }
        if (0 < M.thrownErrors.length)
          throw q(s, h), r = ee(M.thrownErrors), M.thrownErrors.length = 0, r;
        if (x !== null && typeof x == "object" && typeof x.then == "function") {
          var D = x;
          return Et(function() {
            S || Ne || (Ne = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: function(P, se) {
              S = !0, D.then(
                function(pe) {
                  if (q(s, h), h === 0) {
                    try {
                      ie(m), re(function() {
                        return te(
                          pe,
                          P,
                          se
                        );
                      });
                    } catch (ir) {
                      M.thrownErrors.push(ir);
                    }
                    if (0 < M.thrownErrors.length) {
                      var ur = ee(
                        M.thrownErrors
                      );
                      M.thrownErrors.length = 0, se(ur);
                    }
                  } else P(pe);
                },
                function(pe) {
                  q(s, h), 0 < M.thrownErrors.length && (pe = ee(
                    M.thrownErrors
                  ), M.thrownErrors.length = 0), se(pe);
                }
              );
            }
          };
        }
        var L = x;
        if (q(s, h), h === 0 && (ie(m), m.length !== 0 && Et(function() {
          S || Ne || (Ne = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), M.actQueue = null), 0 < M.thrownErrors.length)
          throw r = ee(M.thrownErrors), M.thrownErrors.length = 0, r;
        return {
          then: function(P, se) {
            S = !0, h === 0 ? (M.actQueue = m, re(function() {
              return te(
                L,
                P,
                se
              );
            })) : P(L);
          }
        };
      }, t.cache = function(r) {
        return function() {
          return r.apply(null, arguments);
        };
      }, t.captureOwnerStack = function() {
        var r = M.getCurrentStack;
        return r === null ? null : r();
      }, t.cloneElement = function(r, s, h) {
        if (r == null)
          throw Error(
            "The argument must be a React element, but you passed " + r + "."
          );
        var m = at({}, r.props), S = r.key, x = r._owner;
        if (s != null) {
          var D;
          e: {
            if (Re.call(s, "ref") && (D = Object.getOwnPropertyDescriptor(
              s,
              "ref"
            ).get) && D.isReactWarning) {
              D = !1;
              break e;
            }
            D = s.ref !== void 0;
          }
          D && (x = g()), R(s) && (_(s.key), S = "" + s.key);
          for (L in s)
            !Re.call(s, L) || L === "key" || L === "__self" || L === "__source" || L === "ref" && s.ref === void 0 || (m[L] = s[L]);
        }
        var L = arguments.length - 2;
        if (L === 1) m.children = h;
        else if (1 < L) {
          D = Array(L);
          for (var P = 0; P < L; P++)
            D[P] = arguments[P + 2];
          m.children = D;
        }
        for (m = U(
          r.type,
          S,
          void 0,
          void 0,
          x,
          m,
          r._debugStack,
          r._debugTask
        ), S = 2; S < arguments.length; S++)
          x = arguments[S], O(x) && x._store && (x._store.validated = 1);
        return m;
      }, t.createContext = function(r) {
        return r = {
          $$typeof: T,
          _currentValue: r,
          _currentValue2: r,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, r.Provider = r, r.Consumer = {
          $$typeof: v,
          _context: r
        }, r._currentRenderer = null, r._currentRenderer2 = null, r;
      }, t.createElement = function(r, s, h) {
        for (var m = 2; m < arguments.length; m++) {
          var S = arguments[m];
          O(S) && S._store && (S._store.validated = 1);
        }
        if (m = {}, S = null, s != null)
          for (P in dt || !("__self" in s) || "key" in s || (dt = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), R(s) && (_(s.key), S = "" + s.key), s)
            Re.call(s, P) && P !== "key" && P !== "__self" && P !== "__source" && (m[P] = s[P]);
        var x = arguments.length - 2;
        if (x === 1) m.children = h;
        else if (1 < x) {
          for (var D = Array(x), L = 0; L < x; L++)
            D[L] = arguments[L + 2];
          Object.freeze && Object.freeze(D), m.children = D;
        }
        if (r && r.defaultProps)
          for (P in x = r.defaultProps, x)
            m[P] === void 0 && (m[P] = x[P]);
        S && j(
          m,
          typeof r == "function" ? r.displayName || r.name || "Unknown" : r
        );
        var P = 1e4 > M.recentlyCreatedOwnerStacks++;
        return U(
          r,
          S,
          void 0,
          void 0,
          g(),
          m,
          P ? Error("react-stack-top-frame") : nr,
          P ? ft(b(r)) : or
        );
      }, t.createRef = function() {
        var r = { current: null };
        return Object.seal(r), r;
      }, t.forwardRef = function(r) {
        r != null && r.$$typeof === A ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof r != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          r === null ? "null" : typeof r
        ) : r.length !== 0 && r.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          r.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), r != null && r.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var s = { $$typeof: I, render: r }, h;
        return Object.defineProperty(s, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return h;
          },
          set: function(m) {
            h = m, r.name || r.displayName || (Object.defineProperty(r, "name", { value: m }), r.displayName = m);
          }
        }), s;
      }, t.isValidElement = O, t.lazy = function(r) {
        return {
          $$typeof: Q,
          _payload: { _status: -1, _result: r },
          _init: ae
        };
      }, t.memo = function(r, s) {
        r == null && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          r === null ? "null" : typeof r
        ), s = {
          $$typeof: A,
          type: r,
          compare: s === void 0 ? null : s
        };
        var h;
        return Object.defineProperty(s, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return h;
          },
          set: function(m) {
            h = m, r.name || r.displayName || (Object.defineProperty(r, "name", { value: m }), r.displayName = m);
          }
        }), s;
      }, t.startTransition = function(r) {
        var s = M.T, h = {};
        M.T = h, h._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var m = r(), S = M.S;
          S !== null && S(h, m), typeof m == "object" && m !== null && typeof m.then == "function" && m.then(ue, yt);
        } catch (x) {
          yt(x);
        } finally {
          s === null && h._updatedFibers && (r = h._updatedFibers.size, h._updatedFibers.clear(), 10 < r && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), M.T = s;
        }
      }, t.unstable_useCacheRefresh = function() {
        return z().useCacheRefresh();
      }, t.use = function(r) {
        return z().use(r);
      }, t.useActionState = function(r, s, h) {
        return z().useActionState(
          r,
          s,
          h
        );
      }, t.useCallback = function(r, s) {
        return z().useCallback(r, s);
      }, t.useContext = function(r) {
        var s = z();
        return r.$$typeof === v && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), s.useContext(r);
      }, t.useDebugValue = function(r, s) {
        return z().useDebugValue(r, s);
      }, t.useDeferredValue = function(r, s) {
        return z().useDeferredValue(r, s);
      }, t.useEffect = function(r, s, h) {
        r == null && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        var m = z();
        if (typeof h == "function")
          throw Error(
            "useEffect CRUD overload is not enabled in this build of React."
          );
        return m.useEffect(r, s);
      }, t.useId = function() {
        return z().useId();
      }, t.useImperativeHandle = function(r, s, h) {
        return z().useImperativeHandle(r, s, h);
      }, t.useInsertionEffect = function(r, s) {
        return r == null && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), z().useInsertionEffect(r, s);
      }, t.useLayoutEffect = function(r, s) {
        return r == null && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), z().useLayoutEffect(r, s);
      }, t.useMemo = function(r, s) {
        return z().useMemo(r, s);
      }, t.useOptimistic = function(r, s) {
        return z().useOptimistic(r, s);
      }, t.useReducer = function(r, s, h) {
        return z().useReducer(r, s, h);
      }, t.useRef = function(r) {
        return z().useRef(r);
      }, t.useState = function(r) {
        return z().useState(r);
      }, t.useSyncExternalStore = function(r, s, h) {
        return z().useSyncExternalStore(
          r,
          s,
          h
        );
      }, t.useTransition = function() {
        return z().useTransition();
      }, t.version = "19.1.1", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(Ee, Ee.exports)), Ee.exports;
}
var bt;
function Le() {
  return bt || (bt = 1, process.env.NODE_ENV === "production" ? ke.exports = fr() : ke.exports = lr()), ke.exports;
}
var X = Le(), Ae = { exports: {} }, qe = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gt;
function dr() {
  if (gt) return qe;
  gt = 1;
  var e = Le();
  function t(p, _) {
    return p === _ && (p !== 0 || 1 / p === 1 / _) || p !== p && _ !== _;
  }
  var o = typeof Object.is == "function" ? Object.is : t, u = e.useSyncExternalStore, i = e.useRef, a = e.useEffect, f = e.useMemo, l = e.useDebugValue;
  return qe.useSyncExternalStoreWithSelector = function(p, _, d, b, g) {
    var w = i(null);
    if (w.current === null) {
      var R = { hasValue: !1, value: null };
      w.current = R;
    } else R = w.current;
    w = f(
      function() {
        function $(y) {
          if (!U) {
            if (U = !0, Y = y, y = b(y), g !== void 0 && R.hasValue) {
              var V = R.value;
              if (g(V, y))
                return O = V;
            }
            return O = y;
          }
          if (V = O, o(Y, y)) return V;
          var F = b(y);
          return g !== void 0 && g(V, F) ? (Y = y, V) : (Y = y, O = F);
        }
        var U = !1, Y, O, k = d === void 0 ? null : d;
        return [
          function() {
            return $(_());
          },
          k === null ? void 0 : function() {
            return $(k());
          }
        ];
      },
      [_, d, b, g]
    );
    var j = u(p, w[0], w[1]);
    return a(
      function() {
        R.hasValue = !0, R.value = j;
      },
      [j]
    ), l(j), j;
  }, qe;
}
var Be = {};
/**
 * @license React
 * use-sync-external-store-with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var St;
function pr() {
  return St || (St = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(p, _) {
      return p === _ && (p !== 0 || 1 / p === 1 / _) || p !== p && _ !== _;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var t = Le(), o = typeof Object.is == "function" ? Object.is : e, u = t.useSyncExternalStore, i = t.useRef, a = t.useEffect, f = t.useMemo, l = t.useDebugValue;
    Be.useSyncExternalStoreWithSelector = function(p, _, d, b, g) {
      var w = i(null);
      if (w.current === null) {
        var R = { hasValue: !1, value: null };
        w.current = R;
      } else R = w.current;
      w = f(
        function() {
          function $(y) {
            if (!U) {
              if (U = !0, Y = y, y = b(y), g !== void 0 && R.hasValue) {
                var V = R.value;
                if (g(V, y))
                  return O = V;
              }
              return O = y;
            }
            if (V = O, o(Y, y))
              return V;
            var F = b(y);
            return g !== void 0 && g(V, F) ? (Y = y, V) : (Y = y, O = F);
          }
          var U = !1, Y, O, k = d === void 0 ? null : d;
          return [
            function() {
              return $(_());
            },
            k === null ? void 0 : function() {
              return $(k());
            }
          ];
        },
        [_, d, b, g]
      );
      var j = u(p, w[0], w[1]);
      return a(
        function() {
          R.hasValue = !0, R.value = j;
        },
        [j]
      ), l(j), j;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), Be;
}
var Ot;
function hr() {
  return Ot || (Ot = 1, process.env.NODE_ENV === "production" ? Ae.exports = dr() : Ae.exports = pr()), Ae.exports;
}
var _r = hr();
function yr(e) {
  e();
}
function mr() {
  let e = null, t = null;
  return {
    clear() {
      e = null, t = null;
    },
    notify() {
      yr(() => {
        let o = e;
        for (; o; )
          o.callback(), o = o.next;
      });
    },
    get() {
      const o = [];
      let u = e;
      for (; u; )
        o.push(u), u = u.next;
      return o;
    },
    subscribe(o) {
      let u = !0;
      const i = t = {
        callback: o,
        next: null,
        prev: t
      };
      return i.prev ? i.prev.next = i : e = i, function() {
        !u || e === null || (u = !1, i.next ? i.next.prev = i.prev : t = i.prev, i.prev ? i.prev.next = i.next : e = i.next);
      };
    }
  };
}
var Rt = {
  notify() {
  },
  get: () => []
};
function Er(e, t) {
  let o, u = Rt, i = 0, a = !1;
  function f(j) {
    d();
    const $ = u.subscribe(j);
    let U = !1;
    return () => {
      U || (U = !0, $(), b());
    };
  }
  function l() {
    u.notify();
  }
  function p() {
    R.onStateChange && R.onStateChange();
  }
  function _() {
    return a;
  }
  function d() {
    i++, o || (o = e.subscribe(p), u = mr());
  }
  function b() {
    i--, o && i === 0 && (o(), o = void 0, u.clear(), u = Rt);
  }
  function g() {
    a || (a = !0, d());
  }
  function w() {
    a && (a = !1, b());
  }
  const R = {
    addNestedSub: f,
    notifyNestedSubs: l,
    handleChangeWrapper: p,
    isSubscribed: _,
    trySubscribe: g,
    tryUnsubscribe: w,
    getListeners: () => u
  };
  return R;
}
var vr = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", wr = /* @__PURE__ */ vr(), br = () => typeof navigator < "u" && navigator.product === "ReactNative", gr = /* @__PURE__ */ br(), Sr = () => wr || gr ? X.useLayoutEffect : X.useEffect, Or = /* @__PURE__ */ Sr(), Rr = /* @__PURE__ */ Symbol.for("react-redux-context"), Tr = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function Cr() {
  if (!X.createContext) return {};
  const e = Tr[Rr] ??= /* @__PURE__ */ new Map();
  let t = e.get(X.createContext);
  return t || (t = X.createContext(
    null
  ), process.env.NODE_ENV !== "production" && (t.displayName = "ReactRedux"), e.set(X.createContext, t)), t;
}
var Ie = /* @__PURE__ */ Cr();
function Nr(e) {
  const { children: t, context: o, serverState: u, store: i } = e, a = X.useMemo(() => {
    const p = Er(i), _ = {
      store: i,
      subscription: p,
      getServerState: u ? () => u : void 0
    };
    if (process.env.NODE_ENV === "production")
      return _;
    {
      const { identityFunctionCheck: d = "once", stabilityCheck: b = "once" } = e;
      return /* @__PURE__ */ Object.assign(_, {
        stabilityCheck: b,
        identityFunctionCheck: d
      });
    }
  }, [i, u]), f = X.useMemo(() => i.getState(), [i]);
  Or(() => {
    const { subscription: p } = a;
    return p.onStateChange = p.notifyNestedSubs, p.trySubscribe(), f !== i.getState() && p.notifyNestedSubs(), () => {
      p.tryUnsubscribe(), p.onStateChange = void 0;
    };
  }, [a, f]);
  const l = o || Ie;
  return /* @__PURE__ */ X.createElement(l.Provider, { value: a }, t);
}
var kr = Nr;
function Lt(e = Ie) {
  return function() {
    const o = X.useContext(e);
    if (process.env.NODE_ENV !== "production" && !o)
      throw new Error(
        "could not find react-redux context value; please ensure the component is wrapped in a <Provider>"
      );
    return o;
  };
}
var Ar = /* @__PURE__ */ Lt(), Dr = (e, t) => e === t;
function Pr(e = Ie) {
  const t = e === Ie ? Ar : Lt(e), o = (u, i = {}) => {
    const { equalityFn: a = Dr } = typeof i == "function" ? { equalityFn: i } : i;
    if (process.env.NODE_ENV !== "production") {
      if (!u)
        throw new Error("You must pass a selector to useSelector");
      if (typeof u != "function")
        throw new Error("You must pass a function as a selector to useSelector");
      if (typeof a != "function")
        throw new Error(
          "You must pass a function as an equality function to useSelector"
        );
    }
    const f = t(), { store: l, subscription: p, getServerState: _ } = f, d = X.useRef(!0), b = X.useCallback(
      {
        [u.name](w) {
          const R = u(w);
          if (process.env.NODE_ENV !== "production") {
            const { devModeChecks: j = {} } = typeof i == "function" ? {} : i, { identityFunctionCheck: $, stabilityCheck: U } = f, {
              identityFunctionCheck: Y,
              stabilityCheck: O
            } = {
              stabilityCheck: U,
              identityFunctionCheck: $,
              ...j
            };
            if (O === "always" || O === "once" && d.current) {
              const k = u(w);
              if (!a(R, k)) {
                let y;
                try {
                  throw new Error();
                } catch (V) {
                  ({ stack: y } = V);
                }
                console.warn(
                  "Selector " + (u.name || "unknown") + ` returned a different result when called with the same parameters. This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array) should be memoized: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization`,
                  {
                    state: w,
                    selected: R,
                    selected2: k,
                    stack: y
                  }
                );
              }
            }
            if ((Y === "always" || Y === "once" && d.current) && R === w) {
              let k;
              try {
                throw new Error();
              } catch (y) {
                ({ stack: k } = y);
              }
              console.warn(
                "Selector " + (u.name || "unknown") + ` returned the root state when called. This can lead to unnecessary rerenders.
Selectors that return the entire state are almost certainly a mistake, as they will cause a rerender whenever *anything* in state changes.`,
                { stack: k }
              );
            }
            d.current && (d.current = !1);
          }
          return R;
        }
      }[u.name],
      [u]
    ), g = _r.useSyncExternalStoreWithSelector(
      p.addNestedSub,
      l.getState,
      _ || l.getState,
      b,
      a
    );
    return X.useDebugValue(g), g;
  };
  return Object.assign(o, {
    withTypes: () => o
  }), o;
}
var jr = /* @__PURE__ */ Pr(), De = { exports: {} }, ye = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tt;
function Mr() {
  if (Tt) return ye;
  Tt = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.fragment");
  function o(u, i, a) {
    var f = null;
    if (a !== void 0 && (f = "" + a), i.key !== void 0 && (f = "" + i.key), "key" in i) {
      a = {};
      for (var l in i)
        l !== "key" && (a[l] = i[l]);
    } else a = i;
    return i = a.ref, {
      $$typeof: e,
      type: u,
      key: f,
      ref: i !== void 0 ? i : null,
      props: a
    };
  }
  return ye.Fragment = t, ye.jsx = o, ye.jsxs = o, ye;
}
var me = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ct;
function xr() {
  return Ct || (Ct = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(n) {
      if (n == null) return null;
      if (typeof n == "function")
        return n.$$typeof === ae ? null : n.displayName || n.name || null;
      if (typeof n == "string") return n;
      switch (n) {
        case j:
          return "Fragment";
        case U:
          return "Profiler";
        case $:
          return "StrictMode";
        case y:
          return "Suspense";
        case V:
          return "SuspenseList";
        case K:
          return "Activity";
      }
      if (typeof n == "object")
        switch (typeof n.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), n.$$typeof) {
          case R:
            return "Portal";
          case O:
            return (n.displayName || "Context") + ".Provider";
          case Y:
            return (n._context.displayName || "Context") + ".Consumer";
          case k:
            var c = n.render;
            return n = n.displayName, n || (n = c.displayName || c.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
          case F:
            return c = n.displayName || null, c !== null ? c : e(n.type) || "Memo";
          case W:
            c = n._payload, n = n._init;
            try {
              return e(n(c));
            } catch {
            }
        }
      return null;
    }
    function t(n) {
      return "" + n;
    }
    function o(n) {
      try {
        t(n);
        var c = !1;
      } catch {
        c = !0;
      }
      if (c) {
        c = console;
        var E = c.error, v = typeof Symbol == "function" && Symbol.toStringTag && n[Symbol.toStringTag] || n.constructor.name || "Object";
        return E.call(
          c,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          v
        ), t(n);
      }
    }
    function u(n) {
      if (n === j) return "<>";
      if (typeof n == "object" && n !== null && n.$$typeof === W)
        return "<...>";
      try {
        var c = e(n);
        return c ? "<" + c + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var n = z.A;
      return n === null ? null : n.getOwner();
    }
    function a() {
      return Error("react-stack-top-frame");
    }
    function f(n) {
      if (ue.call(n, "key")) {
        var c = Object.getOwnPropertyDescriptor(n, "key").get;
        if (c && c.isReactWarning) return !1;
      }
      return n.key !== void 0;
    }
    function l(n, c) {
      function E() {
        q || (q = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          c
        ));
      }
      E.isReactWarning = !0, Object.defineProperty(n, "key", {
        get: E,
        configurable: !0
      });
    }
    function p() {
      var n = e(this.type);
      return te[n] || (te[n] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), n = this.props.ref, n !== void 0 ? n : null;
    }
    function _(n, c, E, v, T, I, C, B) {
      return E = I.ref, n = {
        $$typeof: w,
        type: n,
        key: c,
        props: I,
        _owner: T
      }, (E !== void 0 ? E : null) !== null ? Object.defineProperty(n, "ref", {
        enumerable: !1,
        get: p
      }) : Object.defineProperty(n, "ref", { enumerable: !1, value: null }), n._store = {}, Object.defineProperty(n._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(n, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(n, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: C
      }), Object.defineProperty(n, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: B
      }), Object.freeze && (Object.freeze(n.props), Object.freeze(n)), n;
    }
    function d(n, c, E, v, T, I, C, B) {
      var A = c.children;
      if (A !== void 0)
        if (v)
          if (re(A)) {
            for (v = 0; v < A.length; v++)
              b(A[v]);
            Object.freeze && Object.freeze(A);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else b(A);
      if (ue.call(c, "key")) {
        A = e(n);
        var Q = Object.keys(c).filter(function(Se) {
          return Se !== "key";
        });
        v = 0 < Q.length ? "{key: someKey, " + Q.join(": ..., ") + ": ...}" : "{key: someKey}", ce[A + v] || (Q = 0 < Q.length ? "{" + Q.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          v,
          A,
          Q,
          A
        ), ce[A + v] = !0);
      }
      if (A = null, E !== void 0 && (o(E), A = "" + E), f(c) && (o(c.key), A = "" + c.key), "key" in c) {
        E = {};
        for (var _e in c)
          _e !== "key" && (E[_e] = c[_e]);
      } else E = c;
      return A && l(
        E,
        typeof n == "function" ? n.displayName || n.name || "Unknown" : n
      ), _(
        n,
        A,
        I,
        T,
        i(),
        E,
        C,
        B
      );
    }
    function b(n) {
      typeof n == "object" && n !== null && n.$$typeof === w && n._store && (n._store.validated = 1);
    }
    var g = Le(), w = Symbol.for("react.transitional.element"), R = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), $ = Symbol.for("react.strict_mode"), U = Symbol.for("react.profiler"), Y = Symbol.for("react.consumer"), O = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), y = Symbol.for("react.suspense"), V = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), W = Symbol.for("react.lazy"), K = Symbol.for("react.activity"), ae = Symbol.for("react.client.reference"), z = g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ue = Object.prototype.hasOwnProperty, re = Array.isArray, ee = console.createTask ? console.createTask : function() {
      return null;
    };
    g = {
      react_stack_bottom_frame: function(n) {
        return n();
      }
    };
    var q, te = {}, ie = g.react_stack_bottom_frame.bind(
      g,
      a
    )(), ne = ee(u(a)), ce = {};
    me.Fragment = j, me.jsx = function(n, c, E, v, T) {
      var I = 1e4 > z.recentlyCreatedOwnerStacks++;
      return d(
        n,
        c,
        E,
        !1,
        v,
        T,
        I ? Error("react-stack-top-frame") : ie,
        I ? ee(u(n)) : ne
      );
    }, me.jsxs = function(n, c, E, v, T) {
      var I = 1e4 > z.recentlyCreatedOwnerStacks++;
      return d(
        n,
        c,
        E,
        !0,
        v,
        T,
        I ? Error("react-stack-top-frame") : ie,
        I ? ee(u(n)) : ne
      );
    };
  })()), me;
}
var Nt;
function Ir() {
  return Nt || (Nt = 1, process.env.NODE_ENV === "production" ? De.exports = Mr() : De.exports = xr()), De.exports;
}
var $r = Ir(), Ut = Symbol.for("immer-nothing"), kt = Symbol.for("immer-draftable"), Z = Symbol.for("immer-state"), Vr = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(e) {
    return `The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`;
  },
  function(e) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`;
  },
  "This object has been frozen and should not be mutated",
  function(e) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(e) {
    return `'current' expects a draft, got: ${e}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(e) {
    return `'original' expects a draft, got: ${e}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function G(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const o = Vr[e], u = typeof o == "function" ? o.apply(null, t) : o;
    throw new Error(`[Immer] ${u}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var he = Object.getPrototypeOf;
function le(e) {
  return !!e && !!e[Z];
}
function oe(e) {
  return e ? Yt(e) || Array.isArray(e) || !!e[kt] || !!e.constructor?.[kt] || ge(e) || Ye(e) : !1;
}
var zr = Object.prototype.constructor.toString();
function Yt(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = he(e);
  if (t === null)
    return !0;
  const o = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return o === Object ? !0 : typeof o == "function" && Function.toString.call(o) === zr;
}
function $e(e, t) {
  Ue(e) === 0 ? Reflect.ownKeys(e).forEach((o) => {
    t(o, e[o], e);
  }) : e.forEach((o, u) => t(u, o, e));
}
function Ue(e) {
  const t = e[Z];
  return t ? t.type_ : Array.isArray(e) ? 1 : ge(e) ? 2 : Ye(e) ? 3 : 0;
}
function Xe(e, t) {
  return Ue(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function Ht(e, t, o) {
  const u = Ue(e);
  u === 2 ? e.set(t, o) : u === 3 ? e.add(o) : e[t] = o;
}
function Lr(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function ge(e) {
  return e instanceof Map;
}
function Ye(e) {
  return e instanceof Set;
}
function fe(e) {
  return e.copy_ || e.base_;
}
function Ze(e, t) {
  if (ge(e))
    return new Map(e);
  if (Ye(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const o = Yt(e);
  if (t === !0 || t === "class_only" && !o) {
    const u = Object.getOwnPropertyDescriptors(e);
    delete u[Z];
    let i = Reflect.ownKeys(u);
    for (let a = 0; a < i.length; a++) {
      const f = i[a], l = u[f];
      l.writable === !1 && (l.writable = !0, l.configurable = !0), (l.get || l.set) && (u[f] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: l.enumerable,
        value: e[f]
      });
    }
    return Object.create(he(e), u);
  } else {
    const u = he(e);
    if (u !== null && o)
      return { ...e };
    const i = Object.create(u);
    return Object.assign(i, e);
  }
}
function ot(e, t = !1) {
  return He(e) || le(e) || !oe(e) || (Ue(e) > 1 && Object.defineProperties(e, {
    set: { value: Pe },
    add: { value: Pe },
    clear: { value: Pe },
    delete: { value: Pe }
  }), Object.freeze(e), t && Object.values(e).forEach((o) => ot(o, !0))), e;
}
function Pe() {
  G(2);
}
function He(e) {
  return Object.isFrozen(e);
}
var Ur = {};
function de(e) {
  const t = Ur[e];
  return t || G(0, e), t;
}
var we;
function Wt() {
  return we;
}
function Yr(e, t) {
  return {
    drafts_: [],
    parent_: e,
    immer_: t,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0
  };
}
function At(e, t) {
  t && (de("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Je(e) {
  et(e), e.drafts_.forEach(Hr), e.drafts_ = null;
}
function et(e) {
  e === we && (we = e.parent_);
}
function Dt(e) {
  return we = Yr(we, e);
}
function Hr(e) {
  const t = e[Z];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function Pt(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const o = t.drafts_[0];
  return e !== void 0 && e !== o ? (o[Z].modified_ && (Je(t), G(4)), oe(e) && (e = Ve(t, e), t.parent_ || ze(t, e)), t.patches_ && de("Patches").generateReplacementPatches_(
    o[Z].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = Ve(t, o, []), Je(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Ut ? e : void 0;
}
function Ve(e, t, o) {
  if (He(t))
    return t;
  const u = t[Z];
  if (!u)
    return $e(
      t,
      (i, a) => jt(e, u, t, i, a, o)
    ), t;
  if (u.scope_ !== e)
    return t;
  if (!u.modified_)
    return ze(e, u.base_, !0), u.base_;
  if (!u.finalized_) {
    u.finalized_ = !0, u.scope_.unfinalizedDrafts_--;
    const i = u.copy_;
    let a = i, f = !1;
    u.type_ === 3 && (a = new Set(i), i.clear(), f = !0), $e(
      a,
      (l, p) => jt(e, u, i, l, p, o, f)
    ), ze(e, i, !1), o && e.patches_ && de("Patches").generatePatches_(
      u,
      o,
      e.patches_,
      e.inversePatches_
    );
  }
  return u.copy_;
}
function jt(e, t, o, u, i, a, f) {
  if (process.env.NODE_ENV !== "production" && i === o && G(5), le(i)) {
    const l = a && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
    !Xe(t.assigned_, u) ? a.concat(u) : void 0, p = Ve(e, i, l);
    if (Ht(o, u, p), le(p))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else f && o.add(i);
  if (oe(i) && !He(i)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    Ve(e, i), (!t || !t.scope_.parent_) && typeof u != "symbol" && (ge(o) ? o.has(u) : Object.prototype.propertyIsEnumerable.call(o, u)) && ze(e, i);
  }
}
function ze(e, t, o = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && ot(t, o);
}
function Wr(e, t) {
  const o = Array.isArray(e), u = {
    type_: o ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : Wt(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: t,
    // The base state.
    base_: e,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1
  };
  let i = u, a = ut;
  o && (i = [u], a = be);
  const { revoke: f, proxy: l } = Proxy.revocable(i, a);
  return u.draft_ = l, u.revoke_ = f, l;
}
var ut = {
  get(e, t) {
    if (t === Z)
      return e;
    const o = fe(e);
    if (!Xe(o, t))
      return Fr(e, o, t);
    const u = o[t];
    return e.finalized_ || !oe(u) ? u : u === Ge(e.base_, t) ? (Ke(e), e.copy_[t] = rt(u, e)) : u;
  },
  has(e, t) {
    return t in fe(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(fe(e));
  },
  set(e, t, o) {
    const u = Ft(fe(e), t);
    if (u?.set)
      return u.set.call(e.draft_, o), !0;
    if (!e.modified_) {
      const i = Ge(fe(e), t), a = i?.[Z];
      if (a && a.base_ === o)
        return e.copy_[t] = o, e.assigned_[t] = !1, !0;
      if (Lr(o, i) && (o !== void 0 || Xe(e.base_, t)))
        return !0;
      Ke(e), tt(e);
    }
    return e.copy_[t] === o && // special case: handle new props with value 'undefined'
    (o !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(o) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = o, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return Ge(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, Ke(e), tt(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const o = fe(e), u = Reflect.getOwnPropertyDescriptor(o, t);
    return u && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: u.enumerable,
      value: o[t]
    };
  },
  defineProperty() {
    G(11);
  },
  getPrototypeOf(e) {
    return he(e.base_);
  },
  setPrototypeOf() {
    G(12);
  }
}, be = {};
$e(ut, (e, t) => {
  be[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
be.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && G(13), be.set.call(this, e, t, void 0);
};
be.set = function(e, t, o) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && G(14), ut.set.call(this, e[0], t, o, e[0]);
};
function Ge(e, t) {
  const o = e[Z];
  return (o ? fe(o) : e)[t];
}
function Fr(e, t, o) {
  const u = Ft(t, o);
  return u ? "value" in u ? u.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    u.get?.call(e.draft_)
  ) : void 0;
}
function Ft(e, t) {
  if (!(t in e))
    return;
  let o = he(e);
  for (; o; ) {
    const u = Object.getOwnPropertyDescriptor(o, t);
    if (u)
      return u;
    o = he(o);
  }
}
function tt(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && tt(e.parent_));
}
function Ke(e) {
  e.copy_ || (e.copy_ = Ze(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var qr = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (t, o, u) => {
      if (typeof t == "function" && typeof o != "function") {
        const a = o;
        o = t;
        const f = this;
        return function(p = a, ..._) {
          return f.produce(p, (d) => o.call(this, d, ..._));
        };
      }
      typeof o != "function" && G(6), u !== void 0 && typeof u != "function" && G(7);
      let i;
      if (oe(t)) {
        const a = Dt(this), f = rt(t, void 0);
        let l = !0;
        try {
          i = o(f), l = !1;
        } finally {
          l ? Je(a) : et(a);
        }
        return At(a, u), Pt(i, a);
      } else if (!t || typeof t != "object") {
        if (i = o(t), i === void 0 && (i = t), i === Ut && (i = void 0), this.autoFreeze_ && ot(i, !0), u) {
          const a = [], f = [];
          de("Patches").generateReplacementPatches_(t, i, a, f), u(a, f);
        }
        return i;
      } else
        G(1, t);
    }, this.produceWithPatches = (t, o) => {
      if (typeof t == "function")
        return (f, ...l) => this.produceWithPatches(f, (p) => t(p, ...l));
      let u, i;
      return [this.produce(t, o, (f, l) => {
        u = f, i = l;
      }), u, i];
    }, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy);
  }
  createDraft(e) {
    oe(e) || G(8), le(e) && (e = Br(e));
    const t = Dt(this), o = rt(e, void 0);
    return o[Z].isManual_ = !0, et(t), o;
  }
  finishDraft(e, t) {
    const o = e && e[Z];
    (!o || !o.isManual_) && G(9);
    const { scope_: u } = o;
    return At(u, t), Pt(void 0, u);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  applyPatches(e, t) {
    let o;
    for (o = t.length - 1; o >= 0; o--) {
      const i = t[o];
      if (i.path.length === 0 && i.op === "replace") {
        e = i.value;
        break;
      }
    }
    o > -1 && (t = t.slice(o + 1));
    const u = de("Patches").applyPatches_;
    return le(e) ? u(e, t) : this.produce(
      e,
      (i) => u(i, t)
    );
  }
};
function rt(e, t) {
  const o = ge(e) ? de("MapSet").proxyMap_(e, t) : Ye(e) ? de("MapSet").proxySet_(e, t) : Wr(e, t);
  return (t ? t.scope_ : Wt()).drafts_.push(o), o;
}
function Br(e) {
  return le(e) || G(10, e), qt(e);
}
function qt(e) {
  if (!oe(e) || He(e))
    return e;
  const t = e[Z];
  let o;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, o = Ze(e, t.scope_.immer_.useStrictShallowCopy_);
  } else
    o = Ze(e, !0);
  return $e(o, (u, i) => {
    Ht(o, u, qt(i));
  }), t && (t.finalized_ = !1), o;
}
var Gr = new qr(), Bt = Gr.produce;
function Gt(e) {
  return ({ dispatch: o, getState: u }) => (i) => (a) => typeof a == "function" ? a(o, u, e) : i(a);
}
var Kr = Gt(), Qr = Gt, Xr = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? Qe : Qe.apply(null, arguments);
}, Zr = (e) => e && typeof e.match == "function";
function Mt(e, t) {
  function o(...u) {
    if (t) {
      let i = t(...u);
      if (!i)
        throw new Error(process.env.NODE_ENV === "production" ? H(0) : "prepareAction did not return an object");
      return {
        type: e,
        payload: i.payload,
        ..."meta" in i && {
          meta: i.meta
        },
        ..."error" in i && {
          error: i.error
        }
      };
    }
    return {
      type: e,
      payload: u[0]
    };
  }
  return o.toString = () => `${e}`, o.type = e, o.match = (u) => zt(u) && u.type === e, o;
}
function Jr(e) {
  return typeof e == "function" && "type" in e && // hasMatchFunction only wants Matchers but I don't see the point in rewriting it
  Zr(e);
}
function en(e) {
  const t = e ? `${e}`.split("/") : [], o = t[t.length - 1] || "actionCreator";
  return `Detected an action creator with type "${e || "unknown"}" being dispatched. 
Make sure you're calling the action creator before dispatching, i.e. \`dispatch(${o}())\` instead of \`dispatch(${o})\`. This is necessary even if the action has no payload.`;
}
function tn(e = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (o) => (u) => o(u);
  const {
    isActionCreator: t = Jr
  } = e;
  return () => (o) => (u) => (t(u) && console.warn(en(u.type)), o(u));
}
function Kt(e, t) {
  let o = 0;
  return {
    measureTime(u) {
      const i = Date.now();
      try {
        return u();
      } finally {
        const a = Date.now();
        o += a - i;
      }
    },
    warnIfExceeded() {
      o > e && console.warn(`${t} took ${o}ms, which is more than the warning threshold of ${e}ms. 
If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.
It is disabled in production builds, so you don't need to worry about that.`);
    }
  };
}
var Qt = class ve extends Array {
  constructor(...t) {
    super(...t), Object.setPrototypeOf(this, ve.prototype);
  }
  static get [Symbol.species]() {
    return ve;
  }
  concat(...t) {
    return super.concat.apply(this, t);
  }
  prepend(...t) {
    return t.length === 1 && Array.isArray(t[0]) ? new ve(...t[0].concat(this)) : new ve(...t.concat(this));
  }
};
function xt(e) {
  return oe(e) ? Bt(e, () => {
  }) : e;
}
function je(e, t, o) {
  return e.has(t) ? e.get(t) : e.set(t, o(t)).get(t);
}
function rn(e) {
  return typeof e != "object" || e == null || Object.isFrozen(e);
}
function nn(e, t, o) {
  const u = Xt(e, t, o);
  return {
    detectMutations() {
      return Zt(e, t, u, o);
    }
  };
}
function Xt(e, t = [], o, u = "", i = /* @__PURE__ */ new Set()) {
  const a = {
    value: o
  };
  if (!e(o) && !i.has(o)) {
    i.add(o), a.children = {};
    for (const f in o) {
      const l = u ? u + "." + f : f;
      t.length && t.indexOf(l) !== -1 || (a.children[f] = Xt(e, t, o[f], l));
    }
  }
  return a;
}
function Zt(e, t = [], o, u, i = !1, a = "") {
  const f = o ? o.value : void 0, l = f === u;
  if (i && !l && !Number.isNaN(u))
    return {
      wasMutated: !0,
      path: a
    };
  if (e(f) || e(u))
    return {
      wasMutated: !1
    };
  const p = {};
  for (let d in o.children)
    p[d] = !0;
  for (let d in u)
    p[d] = !0;
  const _ = t.length > 0;
  for (let d in p) {
    const b = a ? a + "." + d : d;
    if (_ && t.some((R) => R instanceof RegExp ? R.test(b) : b === R))
      continue;
    const g = Zt(e, t, o.children[d], u[d], l, b);
    if (g.wasMutated)
      return g;
  }
  return {
    wasMutated: !1
  };
}
function on(e = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (t) => (o) => t(o);
  {
    let t = function(l, p, _, d) {
      return JSON.stringify(l, o(p, d), _);
    }, o = function(l, p) {
      let _ = [], d = [];
      return p || (p = function(b, g) {
        return _[0] === g ? "[Circular ~]" : "[Circular ~." + d.slice(0, _.indexOf(g)).join(".") + "]";
      }), function(b, g) {
        if (_.length > 0) {
          var w = _.indexOf(this);
          ~w ? _.splice(w + 1) : _.push(this), ~w ? d.splice(w, 1 / 0, b) : d.push(b), ~_.indexOf(g) && (g = p.call(this, b, g));
        } else _.push(g);
        return l == null ? g : l.call(this, b, g);
      };
    }, {
      isImmutable: u = rn,
      ignoredPaths: i,
      warnAfter: a = 32
    } = e;
    const f = nn.bind(null, u, i);
    return ({
      getState: l
    }) => {
      let p = l(), _ = f(p), d;
      return (b) => (g) => {
        const w = Kt(a, "ImmutableStateInvariantMiddleware");
        w.measureTime(() => {
          if (p = l(), d = _.detectMutations(), _ = f(p), d.wasMutated)
            throw new Error(process.env.NODE_ENV === "production" ? H(19) : `A state mutation was detected between dispatches, in the path '${d.path || ""}'.  This may cause incorrect behavior. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`);
        });
        const R = b(g);
        return w.measureTime(() => {
          if (p = l(), d = _.detectMutations(), _ = f(p), d.wasMutated)
            throw new Error(process.env.NODE_ENV === "production" ? H(20) : `A state mutation was detected inside a dispatch, in the path: ${d.path || ""}. Take a look at the reducer(s) handling the action ${t(g)}. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`);
        }), w.warnIfExceeded(), R;
      };
    };
  }
}
function Jt(e) {
  const t = typeof e;
  return e == null || t === "string" || t === "boolean" || t === "number" || Array.isArray(e) || $t(e);
}
function nt(e, t = "", o = Jt, u, i = [], a) {
  let f;
  if (!o(e))
    return {
      keyPath: t || "<root>",
      value: e
    };
  if (typeof e != "object" || e === null || a?.has(e)) return !1;
  const l = u != null ? u(e) : Object.entries(e), p = i.length > 0;
  for (const [_, d] of l) {
    const b = t ? t + "." + _ : _;
    if (!(p && i.some((w) => w instanceof RegExp ? w.test(b) : b === w))) {
      if (!o(d))
        return {
          keyPath: b,
          value: d
        };
      if (typeof d == "object" && (f = nt(d, b, o, u, i, a), f))
        return f;
    }
  }
  return a && er(e) && a.add(e), !1;
}
function er(e) {
  if (!Object.isFrozen(e)) return !1;
  for (const t of Object.values(e))
    if (!(typeof t != "object" || t === null) && !er(t))
      return !1;
  return !0;
}
function un(e = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (t) => (o) => t(o);
  {
    const {
      isSerializable: t = Jt,
      getEntries: o,
      ignoredActions: u = [],
      ignoredActionPaths: i = ["meta.arg", "meta.baseQueryMeta"],
      ignoredPaths: a = [],
      warnAfter: f = 32,
      ignoreState: l = !1,
      ignoreActions: p = !1,
      disableCache: _ = !1
    } = e, d = !_ && WeakSet ? /* @__PURE__ */ new WeakSet() : void 0;
    return (b) => (g) => (w) => {
      if (!zt(w))
        return g(w);
      const R = g(w), j = Kt(f, "SerializableStateInvariantMiddleware");
      return !p && !(u.length && u.indexOf(w.type) !== -1) && j.measureTime(() => {
        const $ = nt(w, "", t, o, i, d);
        if ($) {
          const {
            keyPath: U,
            value: Y
          } = $;
          console.error(`A non-serializable value was detected in an action, in the path: \`${U}\`. Value:`, Y, `
Take a look at the logic that dispatched this action: `, w, `
(See https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)`, `
(To allow non-serializable values see: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data)`);
        }
      }), l || (j.measureTime(() => {
        const $ = b.getState(), U = nt($, "", t, o, a, d);
        if (U) {
          const {
            keyPath: Y,
            value: O
          } = U;
          console.error(`A non-serializable value was detected in the state, in the path: \`${Y}\`. Value:`, O, `
Take a look at the reducer(s) handling this action type: ${w.type}.
(See https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)`);
        }
      }), j.warnIfExceeded()), R;
    };
  }
}
function Me(e) {
  return typeof e == "boolean";
}
var sn = () => function(t) {
  const {
    thunk: o = !0,
    immutableCheck: u = !0,
    serializableCheck: i = !0,
    actionCreatorCheck: a = !0
  } = t ?? {};
  let f = new Qt();
  if (o && (Me(o) ? f.push(Kr) : f.push(Qr(o.extraArgument))), process.env.NODE_ENV !== "production") {
    if (u) {
      let l = {};
      Me(u) || (l = u), f.unshift(on(l));
    }
    if (i) {
      let l = {};
      Me(i) || (l = i), f.push(un(l));
    }
    if (a) {
      let l = {};
      Me(a) || (l = a), f.unshift(tn(l));
    }
  }
  return f;
}, an = "RTK_autoBatch", It = (e) => (t) => {
  setTimeout(t, e);
}, cn = (e = {
  type: "raf"
}) => (t) => (...o) => {
  const u = t(...o);
  let i = !0, a = !1, f = !1;
  const l = /* @__PURE__ */ new Set(), p = e.type === "tick" ? queueMicrotask : e.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window < "u" && window.requestAnimationFrame ? window.requestAnimationFrame : It(10)
  ) : e.type === "callback" ? e.queueNotification : It(e.timeout), _ = () => {
    f = !1, a && (a = !1, l.forEach((d) => d()));
  };
  return Object.assign({}, u, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(d) {
      const b = () => i && d(), g = u.subscribe(b);
      return l.add(d), () => {
        g(), l.delete(d);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(d) {
      try {
        return i = !d?.meta?.[an], a = !i, a && (f || (f = !0, p(_))), u.dispatch(d);
      } finally {
        i = !0;
      }
    }
  });
}, fn = (e) => function(o) {
  const {
    autoBatch: u = !0
  } = o ?? {};
  let i = new Qt(e);
  return u && i.push(cn(typeof u == "object" ? u : void 0)), i;
};
function ln(e) {
  const t = sn(), {
    reducer: o = void 0,
    middleware: u,
    devTools: i = !0,
    duplicateMiddlewareCheck: a = !0,
    preloadedState: f = void 0,
    enhancers: l = void 0
  } = e || {};
  let p;
  if (typeof o == "function")
    p = o;
  else if ($t(o))
    p = Vt(o);
  else
    throw new Error(process.env.NODE_ENV === "production" ? H(1) : "`reducer` is a required argument, and must be a function or an object of functions that can be passed to combineReducers");
  if (process.env.NODE_ENV !== "production" && u && typeof u != "function")
    throw new Error(process.env.NODE_ENV === "production" ? H(2) : "`middleware` field must be a callback");
  let _;
  if (typeof u == "function") {
    if (_ = u(t), process.env.NODE_ENV !== "production" && !Array.isArray(_))
      throw new Error(process.env.NODE_ENV === "production" ? H(3) : "when using a middleware builder function, an array of middleware must be returned");
  } else
    _ = t();
  if (process.env.NODE_ENV !== "production" && _.some((j) => typeof j != "function"))
    throw new Error(process.env.NODE_ENV === "production" ? H(4) : "each middleware provided to configureStore must be a function");
  if (process.env.NODE_ENV !== "production" && a) {
    let j = /* @__PURE__ */ new Set();
    _.forEach(($) => {
      if (j.has($))
        throw new Error(process.env.NODE_ENV === "production" ? H(42) : "Duplicate middleware references found when creating the store. Ensure that each middleware is only included once.");
      j.add($);
    });
  }
  let d = Qe;
  i && (d = Xr({
    // Enable capture of stack traces for dispatched Redux actions
    trace: process.env.NODE_ENV !== "production",
    ...typeof i == "object" && i
  }));
  const b = ar(..._), g = fn(b);
  if (process.env.NODE_ENV !== "production" && l && typeof l != "function")
    throw new Error(process.env.NODE_ENV === "production" ? H(5) : "`enhancers` field must be a callback");
  let w = typeof l == "function" ? l(g) : g();
  if (process.env.NODE_ENV !== "production" && !Array.isArray(w))
    throw new Error(process.env.NODE_ENV === "production" ? H(6) : "`enhancers` callback must return an array");
  if (process.env.NODE_ENV !== "production" && w.some((j) => typeof j != "function"))
    throw new Error(process.env.NODE_ENV === "production" ? H(7) : "each enhancer provided to configureStore must be a function");
  process.env.NODE_ENV !== "production" && _.length && !w.includes(b) && console.error("middlewares were provided, but middleware enhancer was not included in final enhancers - make sure to call `getDefaultEnhancers`");
  const R = d(...w);
  return cr(p, f, R);
}
function tr(e) {
  const t = {}, o = [];
  let u;
  const i = {
    addCase(a, f) {
      if (process.env.NODE_ENV !== "production") {
        if (o.length > 0)
          throw new Error(process.env.NODE_ENV === "production" ? H(26) : "`builder.addCase` should only be called before calling `builder.addMatcher`");
        if (u)
          throw new Error(process.env.NODE_ENV === "production" ? H(27) : "`builder.addCase` should only be called before calling `builder.addDefaultCase`");
      }
      const l = typeof a == "string" ? a : a.type;
      if (!l)
        throw new Error(process.env.NODE_ENV === "production" ? H(28) : "`builder.addCase` cannot be called with an empty action type");
      if (l in t)
        throw new Error(process.env.NODE_ENV === "production" ? H(29) : `\`builder.addCase\` cannot be called with two reducers for the same action type '${l}'`);
      return t[l] = f, i;
    },
    addAsyncThunk(a, f) {
      if (process.env.NODE_ENV !== "production" && u)
        throw new Error(process.env.NODE_ENV === "production" ? H(43) : "`builder.addAsyncThunk` should only be called before calling `builder.addDefaultCase`");
      return f.pending && (t[a.pending.type] = f.pending), f.rejected && (t[a.rejected.type] = f.rejected), f.fulfilled && (t[a.fulfilled.type] = f.fulfilled), f.settled && o.push({
        matcher: a.settled,
        reducer: f.settled
      }), i;
    },
    addMatcher(a, f) {
      if (process.env.NODE_ENV !== "production" && u)
        throw new Error(process.env.NODE_ENV === "production" ? H(30) : "`builder.addMatcher` should only be called before calling `builder.addDefaultCase`");
      return o.push({
        matcher: a,
        reducer: f
      }), i;
    },
    addDefaultCase(a) {
      if (process.env.NODE_ENV !== "production" && u)
        throw new Error(process.env.NODE_ENV === "production" ? H(31) : "`builder.addDefaultCase` can only be called once");
      return u = a, i;
    }
  };
  return e(i), [t, o, u];
}
function dn(e) {
  return typeof e == "function";
}
function pn(e, t) {
  if (process.env.NODE_ENV !== "production" && typeof t == "object")
    throw new Error(process.env.NODE_ENV === "production" ? H(8) : "The object notation for `createReducer` has been removed. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createReducer");
  let [o, u, i] = tr(t), a;
  if (dn(e))
    a = () => xt(e());
  else {
    const l = xt(e);
    a = () => l;
  }
  function f(l = a(), p) {
    let _ = [o[p.type], ...u.filter(({
      matcher: d
    }) => d(p)).map(({
      reducer: d
    }) => d)];
    return _.filter((d) => !!d).length === 0 && (_ = [i]), _.reduce((d, b) => {
      if (b)
        if (le(d)) {
          const w = b(d, p);
          return w === void 0 ? d : w;
        } else {
          if (oe(d))
            return Bt(d, (g) => b(g, p));
          {
            const g = b(d, p);
            if (g === void 0) {
              if (d === null)
                return d;
              throw Error("A case reducer on a non-draftable value must not return undefined");
            }
            return g;
          }
        }
      return d;
    }, l);
  }
  return f.getInitialState = a, f;
}
var hn = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function _n(e, t) {
  return `${e}/${t}`;
}
function yn({
  creators: e
} = {}) {
  const t = e?.asyncThunk?.[hn];
  return function(u) {
    const {
      name: i,
      reducerPath: a = i
    } = u;
    if (!i)
      throw new Error(process.env.NODE_ENV === "production" ? H(11) : "`name` is a required option for createSlice");
    typeof process < "u" && process.env.NODE_ENV === "development" && u.initialState === void 0 && console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
    const f = (typeof u.reducers == "function" ? u.reducers(vn()) : u.reducers) || {}, l = Object.keys(f), p = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, _ = {
      addCase(O, k) {
        const y = typeof O == "string" ? O : O.type;
        if (!y)
          throw new Error(process.env.NODE_ENV === "production" ? H(12) : "`context.addCase` cannot be called with an empty action type");
        if (y in p.sliceCaseReducersByType)
          throw new Error(process.env.NODE_ENV === "production" ? H(13) : "`context.addCase` cannot be called with two reducers for the same action type: " + y);
        return p.sliceCaseReducersByType[y] = k, _;
      },
      addMatcher(O, k) {
        return p.sliceMatchers.push({
          matcher: O,
          reducer: k
        }), _;
      },
      exposeAction(O, k) {
        return p.actionCreators[O] = k, _;
      },
      exposeCaseReducer(O, k) {
        return p.sliceCaseReducersByName[O] = k, _;
      }
    };
    l.forEach((O) => {
      const k = f[O], y = {
        reducerName: O,
        type: _n(i, O),
        createNotation: typeof u.reducers == "function"
      };
      bn(k) ? Sn(y, k, _, t) : wn(y, k, _);
    });
    function d() {
      if (process.env.NODE_ENV !== "production" && typeof u.extraReducers == "object")
        throw new Error(process.env.NODE_ENV === "production" ? H(14) : "The object notation for `createSlice.extraReducers` has been removed. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createSlice");
      const [O = {}, k = [], y = void 0] = typeof u.extraReducers == "function" ? tr(u.extraReducers) : [u.extraReducers], V = {
        ...O,
        ...p.sliceCaseReducersByType
      };
      return pn(u.initialState, (F) => {
        for (let W in V)
          F.addCase(W, V[W]);
        for (let W of p.sliceMatchers)
          F.addMatcher(W.matcher, W.reducer);
        for (let W of k)
          F.addMatcher(W.matcher, W.reducer);
        y && F.addDefaultCase(y);
      });
    }
    const b = (O) => O, g = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new WeakMap();
    let R;
    function j(O, k) {
      return R || (R = d()), R(O, k);
    }
    function $() {
      return R || (R = d()), R.getInitialState();
    }
    function U(O, k = !1) {
      function y(F) {
        let W = F[O];
        if (typeof W > "u") {
          if (k)
            W = je(w, y, $);
          else if (process.env.NODE_ENV !== "production")
            throw new Error(process.env.NODE_ENV === "production" ? H(15) : "selectSlice returned undefined for an uninjected slice reducer");
        }
        return W;
      }
      function V(F = b) {
        const W = je(g, k, () => /* @__PURE__ */ new WeakMap());
        return je(W, F, () => {
          const K = {};
          for (const [ae, z] of Object.entries(u.selectors ?? {}))
            K[ae] = mn(z, F, () => je(w, F, $), k);
          return K;
        });
      }
      return {
        reducerPath: O,
        getSelectors: V,
        get selectors() {
          return V(y);
        },
        selectSlice: y
      };
    }
    const Y = {
      name: i,
      reducer: j,
      actions: p.actionCreators,
      caseReducers: p.sliceCaseReducersByName,
      getInitialState: $,
      ...U(a),
      injectInto(O, {
        reducerPath: k,
        ...y
      } = {}) {
        const V = k ?? a;
        return O.inject({
          reducerPath: V,
          reducer: j
        }, y), {
          ...Y,
          ...U(V, !0)
        };
      }
    };
    return Y;
  };
}
function mn(e, t, o, u) {
  function i(a, ...f) {
    let l = t(a);
    if (typeof l > "u") {
      if (u)
        l = o();
      else if (process.env.NODE_ENV !== "production")
        throw new Error(process.env.NODE_ENV === "production" ? H(16) : "selectState returned undefined for an uninjected slice reducer");
    }
    return e(l, ...f);
  }
  return i.unwrapped = e, i;
}
var En = /* @__PURE__ */ yn();
function vn() {
  function e(t, o) {
    return {
      _reducerDefinitionType: "asyncThunk",
      payloadCreator: t,
      ...o
    };
  }
  return e.withTypes = () => e, {
    reducer(t) {
      return Object.assign({
        // hack so the wrapping function has the same name as the original
        // we need to create a wrapper so the `reducerDefinitionType` is not assigned to the original
        [t.name](...o) {
          return t(...o);
        }
      }[t.name], {
        _reducerDefinitionType: "reducer"
        /* reducer */
      });
    },
    preparedReducer(t, o) {
      return {
        _reducerDefinitionType: "reducerWithPrepare",
        prepare: t,
        reducer: o
      };
    },
    asyncThunk: e
  };
}
function wn({
  type: e,
  reducerName: t,
  createNotation: o
}, u, i) {
  let a, f;
  if ("reducer" in u) {
    if (o && !gn(u))
      throw new Error(process.env.NODE_ENV === "production" ? H(17) : "Please use the `create.preparedReducer` notation for prepared action creators with the `create` notation.");
    a = u.reducer, f = u.prepare;
  } else
    a = u;
  i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, f ? Mt(e, f) : Mt(e));
}
function bn(e) {
  return e._reducerDefinitionType === "asyncThunk";
}
function gn(e) {
  return e._reducerDefinitionType === "reducerWithPrepare";
}
function Sn({
  type: e,
  reducerName: t
}, o, u, i) {
  if (!i)
    throw new Error(process.env.NODE_ENV === "production" ? H(18) : "Cannot use `create.asyncThunk` in the built-in `createSlice`. Use `buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })` to create a customised version of `createSlice`.");
  const {
    payloadCreator: a,
    fulfilled: f,
    pending: l,
    rejected: p,
    settled: _,
    options: d
  } = o, b = i(e, a, d);
  u.exposeAction(t, b), f && u.addCase(b.fulfilled, f), l && u.addCase(b.pending, l), p && u.addCase(b.rejected, p), _ && u.addMatcher(b.settled, _), u.exposeCaseReducer(t, {
    fulfilled: f || xe,
    pending: l || xe,
    rejected: p || xe,
    settled: _ || xe
  });
}
function xe() {
}
function H(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
class On {
  _slices = {};
  _reducers = {};
  _store = ln({
    reducer: (t = {}) => t
  });
  get ReduxModalProvider() {
    return (t) => /* @__PURE__ */ $r.jsx(kr, { store: this._store, ...t });
  }
  get rootStore() {
    return this._store;
  }
  getSlice(t) {
    return this._slices[t];
  }
  injectModal(t) {
    const o = En({
      name: t,
      initialState: {
        isOpen: !1,
        payload: void 0
      },
      reducers: {
        update: (i, { payload: a }) => {
          Object.assign(i, a);
        }
      }
    });
    Object.assign(this._slices, { [o.name]: o }), Object.assign(this._reducers, {
      [o.name]: o.reducer
    });
    const u = Vt(this._reducers);
    this._store.replaceReducer(u);
  }
}
const Rn = new On();
class Tn {
  constructor(t, o) {
    this._type = t, this._innerStore = o, this._innerStore.injectModal(t);
  }
  get state() {
    return this._innerStore.rootStore.getState()[this._type];
  }
  _subscibe(t) {
    return this._innerStore.rootStore.subscribe(t);
  }
  setState(t) {
    const o = sr(t) ? t(this.state) : t, u = this._innerStore.getSlice(this._type).actions.update(o);
    this._innerStore.rootStore.dispatch(u);
  }
  useStore(t) {
    return jr((o) => t(o[this._type]));
  }
}
const kn = (e) => new Tn(e, Rn);
export {
  On as ReduxStoreFacade,
  Tn as ReduxToModalStoreAdapter,
  kn as createReduxStoreAdapter,
  Rn as reduxStoreFacade
};
