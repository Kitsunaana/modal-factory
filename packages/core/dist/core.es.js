class p {
  constructor(t) {
    this.store = t;
  }
  get state() {
    return {};
  }
  _subscibe(t) {
    return () => {
    };
  }
  setState(t) {
  }
  useStore(t) {
    return {};
  }
}
const m = (e) => {
  const t = new p({});
  return Object.assign(t, { type: e }), t;
}, f = (e) => typeof e == "function", u = (e, t) => ({ ...e, ...t }), d = (e) => e != null && typeof e == "object";
class x {
  constructor(t, s) {
    this.type = t, this.store = s, this.close = this.close.bind(this);
  }
  _modifiedContext = this;
  builder = {
    use: (t) => {
      const s = (o) => {
        const i = d(o.ctx) ? o.ctx : {}, n = d(o.store) ? o.store : {};
        return this.store.setState(u(this.store.state, n)), u(i, this._modifiedContext);
      };
      s.extendPayload = () => this._modifiedContext, s.getContext = () => this._modifiedContext;
      const r = t({
        context: this._modifiedContext,
        next: s
      });
      return this._modifiedContext = Object.assign(this, r), this._modifiedContext;
    }
  };
  withParams() {
    return this;
  }
  useIsOpen() {
    return this.store.useStore((t) => t.isOpen);
  }
  usePayload() {
    return this.store.useStore((t) => t.payload);
  }
  open(t) {
    this.store.setState({
      isOpen: !0,
      payload: t
    });
  }
  close() {
    this.store.setState({
      isOpen: !1,
      payload: void 0
    });
  }
}
const b = ({
  variants: e,
  createStore: t = m
}) => Object.entries(e).reduce((r, [o, i]) => (r[o] = (n) => {
  const a = new x(n, t(n));
  return i.reduce(
    (l, h) => {
      const c = l.builder.use(h);
      return Object.assign(c, {
        withParams: () => c
      }), c;
    },
    a
  );
}, r), {}), O = (e) => (t) => e(t), S = {
  payload: (e) => e,
  store: (e) => e
};
function y() {
  return "Hello from core!";
}
export {
  p as BaseStore,
  x as Modal,
  O as combine,
  y as coreHello,
  b as createDirector,
  m as createNoopStoreAdapter,
  f as isFunction,
  d as isNotEmpty,
  u as merge,
  S as toBrand
};
