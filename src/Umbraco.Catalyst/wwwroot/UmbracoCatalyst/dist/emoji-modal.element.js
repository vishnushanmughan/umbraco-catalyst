import { UmbModalBaseElement as wt } from "@umbraco-cms/backoffice/modal";
import { E as it, a as rt, l as xt, i as W } from "./index.js";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, X = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), ot = /* @__PURE__ */ new WeakMap();
let At = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (X && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ot.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ot.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ct = (r) => new At(typeof r == "string" ? r : r + "", void 0, Y), jt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new At(e, r, Y);
}, Pt = (r, t) => {
  if (X) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = D.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, nt = X ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ct(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ot, defineProperty: Ut, getOwnPropertyDescriptor: Mt, getOwnPropertyNames: Tt, getOwnPropertySymbols: Ht, getPrototypeOf: Rt } = Object, y = globalThis, at = y.trustedTypes, kt = at ? at.emptyScript : "", Q = y.reactiveElementPolyfillSupport, M = (r, t) => r, L = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? kt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, tt = (r, t) => !Ot(r, t), lt = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: tt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = lt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Ut(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = Mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const t = Rt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const e = this.properties, s = [...Tt(e), ...Ht(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(nt(i));
    } else t !== void 0 && e.push(nt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : L).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : L;
      this._$Em = i;
      const c = a.fromAttribute(e, l.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (n = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? tt)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[M("elementProperties")] = /* @__PURE__ */ new Map(), C[M("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: C }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, ht = (r) => r, z = T.trustedTypes, ct = z ? z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, vt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + g, Nt = `<${bt}>`, w = document, H = () => w.createComment(""), R = (r) => r === null || typeof r != "object" && typeof r != "function", et = Array.isArray, Dt = (r) => et(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", J = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, ut = />/g, v = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, $t = /"/g, Et = /^(?:script|style|textarea|title)$/i, It = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = It(1), x = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), E = w.createTreeWalker(w, 129);
function St(r, t) {
  if (!et(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Lt = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let c, p, h = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, p = o.exec(a), p !== null); ) u = o.lastIndex, o === O ? p[1] === "!--" ? o = dt : p[1] !== void 0 ? o = ut : p[2] !== void 0 ? (Et.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = v) : p[3] !== void 0 && (o = v) : o === v ? p[0] === ">" ? (o = i ?? O, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? v : p[3] === '"' ? $t : pt) : o === $t || o === pt ? o = v : o === dt || o === ut ? o = O : (o = v, i = void 0);
    const d = o === v && r[l + 1].startsWith("/>") ? " " : "";
    n += o === O ? a + Nt : h >= 0 ? (s.push(c), a.slice(0, h) + vt + a.slice(h) + g + d) : a + g + (h === -2 ? l : d);
  }
  return [St(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, p] = Lt(t, e);
    if (this.el = k.createElement(c, s), E.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = E.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(vt)) {
          const u = p[o++], d = i.getAttribute(h).split(g), $ = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: $[2], strings: d, ctor: $[1] === "." ? Bt : $[1] === "?" ? qt : $[1] === "@" ? Vt : B }), i.removeAttribute(h);
        } else h.startsWith(g) && (a.push({ type: 6, index: n }), i.removeAttribute(h));
        if (Et.test(i.tagName)) {
          const h = i.textContent.split(g), u = h.length - 1;
          if (u > 0) {
            i.textContent = z ? z.emptyScript : "";
            for (let d = 0; d < u; d++) i.append(h[d], H()), E.nextNode(), a.push({ type: 2, index: ++n });
            i.append(h[u], H());
          }
        }
      } else if (i.nodeType === 8) if (i.data === bt) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(g, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = w.createElement("template");
    return s.innerHTML = t, s;
  }
}
function j(r, t, e = r, s) {
  var o, l;
  if (t === x) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = R(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = j(r, i._$AS(r, t.values), i, s)), t;
}
class zt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? w).importNode(e, !0);
    E.currentNode = i;
    let n = E.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new P(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new Wt(n, this, t)), this._$AV.push(c), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = E.nextNode(), o++);
    }
    return E.currentNode = w, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class P {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = j(this, t, e), R(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Dt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = k.createElement(St(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new zt(i, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = _t.get(t.strings);
    return e === void 0 && _t.set(t.strings, e = new k(t)), e;
  }
  k(t) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new P(this.O(H()), this.O(H()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = ht(t).nextSibling;
      ht(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = _;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = j(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== x, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = j(this, l[s + a], e, a), c === x && (c = this._$AH[a]), o || (o = !R(c) || c !== this._$AH[a]), c === _ ? t = _ : t !== _ && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class qt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Vt extends B {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = j(this, t, e, 0) ?? _) === x) return;
    const s = this._$AH, i = t === _ && s !== _ || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== _ && (s === _ || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Wt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    j(this, t);
  }
}
const Qt = { I: P }, F = T.litHtmlPolyfillSupport;
F == null || F(k, P), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.3");
const Jt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new P(t.insertBefore(H(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
let I = class extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return x;
  }
};
var yt;
I._$litElement$ = !0, I.finalized = !0, (yt = S.litElementHydrateSupport) == null || yt.call(S, { LitElement: I });
const K = S.litElementPolyfillSupport;
K == null || K({ LitElement: I });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: tt }, Zt = (r = Kt, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, r, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, r, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, r, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Gt(r) {
  return (t, e) => typeof e == "object" ? Zt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function q(r) {
  return Gt({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = { CHILD: 2 }, Yt = (r) => (...t) => ({ _$litDirective$: r, values: t });
let te = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, s) {
    this._$Ct = t, this._$AM = e, this._$Ci = s;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ee } = Qt, ft = (r) => r, mt = () => document.createComment(""), U = (r, t, e) => {
  var n;
  const s = r._$AA.parentNode, i = t === void 0 ? r._$AB : t._$AA;
  if (e === void 0) {
    const o = s.insertBefore(mt(), i), l = s.insertBefore(mt(), i);
    e = new ee(o, l, r, r.options);
  } else {
    const o = e._$AB.nextSibling, l = e._$AM, a = l !== r;
    if (a) {
      let c;
      (n = e._$AQ) == null || n.call(e, r), e._$AM = r, e._$AP !== void 0 && (c = r._$AU) !== l._$AU && e._$AP(c);
    }
    if (o !== i || a) {
      let c = e._$AA;
      for (; c !== o; ) {
        const p = ft(c).nextSibling;
        ft(s).insertBefore(c, i), c = p;
      }
    }
  }
  return e;
}, b = (r, t, e = r) => (r._$AI(t, e), r), se = {}, ie = (r, t = se) => r._$AH = t, re = (r) => r._$AH, Z = (r) => {
  r._$AR(), r._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = (r, t, e) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = t; i <= e; i++) s.set(r[i], i);
  return s;
}, G = Yt(class extends te {
  constructor(r) {
    if (super(r), r.type !== Xt.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(r, t, e) {
    let s;
    e === void 0 ? e = t : t !== void 0 && (s = t);
    const i = [], n = [];
    let o = 0;
    for (const l of r) i[o] = s ? s(l, o) : o, n[o] = e(l, o), o++;
    return { values: n, keys: i };
  }
  render(r, t, e) {
    return this.dt(r, t, e).values;
  }
  update(r, [t, e, s]) {
    const i = re(r), { values: n, keys: o } = this.dt(t, e, s);
    if (!Array.isArray(i)) return this.ut = o, n;
    const l = this.ut ?? (this.ut = []), a = [];
    let c, p, h = 0, u = i.length - 1, d = 0, $ = n.length - 1;
    for (; h <= u && d <= $; ) if (i[h] === null) h++;
    else if (i[u] === null) u--;
    else if (l[h] === o[d]) a[d] = b(i[h], n[d]), h++, d++;
    else if (l[u] === o[$]) a[$] = b(i[u], n[$]), u--, $--;
    else if (l[h] === o[$]) a[$] = b(i[h], n[$]), U(r, a[$ + 1], i[h]), h++, $--;
    else if (l[u] === o[d]) a[d] = b(i[u], n[d]), U(r, i[h], i[u]), u--, d++;
    else if (c === void 0 && (c = gt(o, d, $), p = gt(l, h, u)), c.has(l[h])) if (c.has(l[u])) {
      const f = p.get(o[d]), V = f !== void 0 ? i[f] : null;
      if (V === null) {
        const st = U(r, i[h]);
        b(st, n[d]), a[d] = st;
      } else a[d] = b(V, n[d]), U(r, i[h], V), i[f] = null;
      d++;
    } else Z(i[u]), u--;
    else Z(i[h]), h++;
    for (; d <= $; ) {
      const f = U(r, a[$ + 1]);
      b(f, n[d]), a[d++] = f;
    }
    for (; h <= u; ) {
      const f = i[h++];
      f !== null && Z(f);
    }
    return this.ut = o, ie(r, a), x;
  }
});
var oe = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, N = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? ne(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && oe(t, e, i), i;
};
let A = class extends wt {
  constructor() {
    super(...arguments), this._emojiDataSet = null, this._loading = !0, this._searchQuery = "", this._recentIds = [], this._boundHandleOutsideClick = (r) => this._handleOutsideClick(r);
  }
  connectedCallback() {
    super.connectedCallback(), this._loadRecent(), this._loadData(), setTimeout(() => document.addEventListener("mousedown", this._boundHandleOutsideClick, !0), 0);
  }
  disconnectedCallback() {
    document.removeEventListener("mousedown", this._boundHandleOutsideClick, !0), super.disconnectedCallback();
  }
  _handleOutsideClick(r) {
    var s;
    const t = r.composedPath(), e = (s = this.shadowRoot) == null ? void 0 : s.getElementById("emoji-popup-layout");
    e && t.includes(e) || this._rejectModal();
  }
  _loadRecent() {
    try {
      const r = localStorage.getItem(it);
      if (r) {
        const t = JSON.parse(r);
        this._recentIds = Array.isArray(t) ? t.slice(0, rt) : [];
      }
    } catch {
      this._recentIds = [];
    }
  }
  async _loadData() {
    this._loading = !0;
    try {
      this._emojiDataSet = await xt();
    } finally {
      this._loading = !1;
    }
  }
  /** Sections in order: recent (if any), then each data category (skip frequent). */
  _getSections() {
    if (!this._emojiDataSet) return [];
    const { categories: r, emojis: t } = this._emojiDataSet, e = [], s = this._getRecentEmojis();
    s.length > 0 && e.push({ id: "recent", name: "Recently used", emojis: s });
    for (const i of r) {
      if (i.id === "frequent" || i.id === "flags") continue;
      const n = i.emojis.map((o) => t[o]).filter((o) => !!o && !W(o));
      n.length > 0 && e.push({ id: i.id, name: i.name, emojis: n });
    }
    return e;
  }
  /** Flat list when searching. */
  _getFilteredEmojis() {
    if (!this._emojiDataSet) return [];
    const r = this._searchQuery.trim().toLowerCase();
    if (!r) return [];
    const t = this._emojiDataSet.emojis;
    return Object.keys(t).filter((s) => {
      const i = t[s];
      if (!i) return !1;
      const n = (i.name || "").toLowerCase(), o = (i.keywords || []).join(" ").toLowerCase(), l = (i.shortcodes || []).join(" ").toLowerCase();
      return n.includes(r) || o.includes(r) || l.includes(r) || s.toLowerCase().includes(r);
    }).map((s) => t[s]).filter((s) => !!s && !W(s));
  }
  _getRecentEmojis() {
    if (!this._emojiDataSet || this._recentIds.length === 0) return [];
    const r = this._emojiDataSet.emojis;
    return this._recentIds.map((t) => r[t]).filter((t) => !!t && !W(t));
  }
  _onSelect(r) {
    var e;
    const t = r.native;
    this.value = t, (e = this.modalContext) == null || e.setValue(t), this._addToRecent(r.id), this._submitModal();
  }
  _addToRecent(r) {
    let t = [...this._recentIds];
    t = t.filter((e) => e !== r), t.unshift(r), t = t.slice(0, rt), this._recentIds = t;
    try {
      localStorage.setItem(it, JSON.stringify(t));
    } catch {
    }
  }
  _onSearchInput(r) {
    const t = r.target;
    this._searchQuery = (t == null ? void 0 : t.value) ?? "";
  }
  /** Unicode only — no images or CDN URLs. */
  _renderEmojiChar(r) {
    return m`<span class="emoji-char" title=${r.name}>${r.native}</span>`;
  }
  render() {
    const r = this._getSections(), t = this._getFilteredEmojis(), e = this._searchQuery.trim().length > 0;
    return m`
            <umb-body-layout id="emoji-popup-layout" headline="">
                <div id="emoji-picker">
                    <div class="search-row">
                        <uui-input
                            class="search-input"
                            type="search"
                            placeholder="Search"
                            .value=${this._searchQuery}
                            @input=${this._onSearchInput}
                            label="Search">
                            <div slot="prepend">
                                <uui-icon name="search"></uui-icon>
                            </div>
                        </uui-input>
                    </div>
                    ${this._loading ? m`<div class="loading">Loading</div>` : e ? m`
                                <div class="scroll-wrap">
                                    <div class="emojis-grid emojis-grid-all">
                                        ${t.length === 0 ? m`<p class="empty">No matches.</p>` : G(
      t,
      (s) => s.id,
      (s) => m`
                                                      <button
                                                          type="button"
                                                          class="emoji-btn"
                                                          title=${s.name}
                                                          @click=${() => this._onSelect(s)}>
                                                          ${this._renderEmojiChar(s)}
                                                      </button>
                                                  `
    )}
                                    </div>
                                </div>
                            ` : m`
                                <div class="scroll-wrap">
                                    ${G(
      r,
      (s) => s.id,
      (s) => m`
                                            <section
                                                class="emoji-section"
                                                data-section-id=${s.id}
                                                aria-labelledby="sec-label-${s.id}">
                                                <h4 class="section-title" id="sec-label-${s.id}">${s.name}</h4>
                                                <div class="emojis-grid">
                                                    ${G(
        s.emojis,
        (i) => i.id,
        (i) => m`
                                                            <button
                                                                type="button"
                                                                class="emoji-btn"
                                                                title=${i.name}
                                                                @click=${() => this._onSelect(i)}>
                                                                ${this._renderEmojiChar(i)}
                                                            </button>
                                                        `
      )}
                                                </div>
                                            </section>
                                        `
    )}
                                </div>
                            `}
                </div>
            </umb-body-layout>
        `;
  }
};
A.styles = [
  jt`
            :host {
                --umb-body-layout-color-background: var(--uui-color-surface, #f5f5f5);
            }
            #emoji-picker {
                display: flex;
                flex-direction: column;
                gap: 0;
                width: 300px;
                max-width: 300px;
                height: 240px;
                max-height: 240px;
                min-height: 240px;
                border-radius: 0;
                overflow: hidden;
            }
            .search-row {
                flex-shrink: 0;
                width: 100%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                z-index: 1;
            }
            .search-row uui-input {
                width: 100%;
            }
            .loading {
                padding: 1rem;
                text-align: center;
                color: var(--uui-color-text-alt, #666);
            }
            .scroll-wrap {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 4px 4px 8px 0;
            }
            .scroll-wrap::-webkit-scrollbar {
                width: 5px;
            }
            .scroll-wrap::-webkit-scrollbar-thumb {
                background: var(--uui-color-border, #ccc);
                border-radius: 0;
            }
            .emoji-section {
                scroll-margin-top: 4px;
            }
            .section-title {
                margin: 8px 4px 4px;
                padding: 0;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                color: var(--uui-color-text-alt, #666);
            }
            .emojis-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 2px;
                border-radius: 0;
            }
            .emojis-grid-all {
                padding-bottom: 6px;
            }
            .emoji-btn {
                width: 32px;
                height: 32px;
                padding: 0;
                border: none;
                border-radius: 0;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.12s ease;
            }
            .emoji-char {
                font-size: 22px;
                line-height: 1;
                font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', sans-serif;
            }
            .emoji-btn:hover {
                background: var(--uui-color-surface-emphasis, rgba(0, 0, 0, 0.06));
            }
            .empty {
                color: var(--uui-color-text-alt, #666);
                margin: 0.5rem 0;
                grid-column: 1 / -1;
            }
        `
];
N([
  q()
], A.prototype, "_emojiDataSet", 2);
N([
  q()
], A.prototype, "_loading", 2);
N([
  q()
], A.prototype, "_searchQuery", 2);
N([
  q()
], A.prototype, "_recentIds", 2);
A = N([
  Ft("umb-tiptap-emoji-modal")
], A);
const pe = A;
export {
  A as UmbTiptapEmojiModalElement,
  pe as default,
  A as element
};
