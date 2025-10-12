var s = Object.defineProperty;
var o = (e, t, r) => t in e ? s(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var n = (e, t, r) => o(e, typeof t != "symbol" ? t + "" : t, r);
import { Store as a, useStore as i } from "@tanstack/react-store";
const S = (e) => typeof e == "function", c = (e, t) => ({ ...e, ...t });
class u {
  constructor(t) {
    n(this, "_innerStore", new a({
      isOpen: !1,
      payload: void 0
    }));
    n(this, "useStore", (t) => i(this._innerStore, t));
    this._type = t;
  }
  get state() {
    return this._innerStore.state;
  }
  _subscibe(t) {
    return this._innerStore.subscribe(t);
  }
  setState(t) {
    this._innerStore.setState((r) => S(t) ? t(r) : c(r, t));
  }
}
const f = (e) => new u(e);
export {
  f as createTanstackStoreAdapter
};
