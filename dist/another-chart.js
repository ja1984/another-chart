var ot = Object.defineProperty;
var V = (i) => {
  throw TypeError(i);
};
var it = (i, s, t) => s in i ? ot(i, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[s] = t;
var $ = (i, s, t) => it(i, typeof s != "symbol" ? s + "" : s, t), tt = (i, s, t) => s.has(i) || V("Cannot " + t);
var r = (i, s, t) => (tt(i, s, "read from private field"), t ? t.call(i) : s.get(i)), m = (i, s, t) => s.has(i) ? V("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(i) : s.set(i, t), p = (i, s, t, e) => (tt(i, s, "write to private field"), e ? e.call(i, t) : s.set(i, t), t);
class nt extends HTMLElement {
  constructor() {
    super(...arguments);
    $(this, "data", []);
    $(this, "color", "rgba(46, 204, 113, 0.9)");
    $(this, "parent");
  }
  connectedCallback() {
    this.parent = this.parentNode, this.attachShadow({ mode: "open" }).innerHTML = "<slot></slot>", this.updateData();
  }
  static get observedAttributes() {
    return ["data", "color"];
  }
  attributeChangedCallback(t, e, o) {
    e !== o && (t === "data" && (this.data = JSON.parse(o || "[]")), t === "color" && (this.color = o || "rgba(46, 204, 113, 0.9)"), this.render());
  }
  updateData() {
    this.data = JSON.parse(this.getAttribute("data") || "[]"), this.color = this.getAttribute("color") || "rgba(46, 204, 113, 0.9)";
  }
  forceResize() {
    this.render();
  }
  render() {
    var b, T;
    if (!this.parent) return;
    const t = (T = (b = this.parentElement) == null ? void 0 : b.shadowRoot) == null ? void 0 : T.querySelector("canvas"), e = t.getContext("2d"), o = window.devicePixelRatio || 1, a = t.width / o, h = t.height / o, n = this.parent.getGlobals(), w = this.parent.getNumberOfValues(), u = this.parent.beginAtZero() ? 0 : n.min, v = this.parent.getCenter(), c = n.max, S = (c - u || 1) / 10, A = Math.pow(10, Math.floor(Math.log10(S))), l = S / A;
    let C;
    l <= 1 ? C = 1 : l <= 2 ? C = 2 : l <= 4 ? C = 5 : C = 10;
    const d = C * A, g = Math.floor(u / d) * d, f = Math.ceil(c / d) * d;
    Array.from(this.children).forEach((k) => {
      typeof k.draw == "function" && k.draw(e, a, h, this.data.slice(0, w), g, f, w, this.color, v);
    });
  }
}
function G(i) {
  if (!i) return "rgba(0, 0, 0, 1)";
  if (i = i.trim(), i.startsWith("#")) {
    let t = i.replace(/^#/, "");
    t.length === 3 ? t = t.split("").map((n) => n + n).join("") : t.length === 4 && (t = t.split("").map((n) => n + n).join(""));
    const e = parseInt(t.substring(0, 2), 16), o = parseInt(t.substring(2, 4), 16), a = parseInt(t.substring(4, 6), 16), h = t.length === 8 ? parseInt(t.substring(6, 8), 16) / 255 : 1;
    return `rgba(${e}, ${o}, ${a}, ${h})`;
  }
  const s = i.match(/rgba?\(([^)]+)\)/);
  if (s) {
    let [t, e, o, a = 1] = s[1].split(",").map((h) => h.trim());
    return `rgba(${parseInt(t)}, ${parseInt(e)}, ${parseInt(o)}, ${parseFloat(a)})`;
  }
  throw new Error("Unsupported color format");
}
function rt(i, s, t, e, o) {
  if (!s || !t) {
    console.warn("[AC Tooltip] Canvas or tooltip element not found.");
    return;
  }
  const a = s.getBoundingClientRect(), h = i.clientX - a.left, n = i.clientY - a.top, w = Array.from(e.querySelectorAll("ac-data-set")), u = e.getNumberOfValues(), { min: v, max: c } = e.getGlobals(), _ = e.getLabels(), y = { top: 20, bottom: 30, left: 40, right: 20 }, S = s.clientWidth, A = s.clientHeight, l = S - y.left - y.right, C = A - y.top - y.bottom, d = (h - y.left) / l, g = Math.round(d * (u - 1));
  if (g < 0 || g >= u) {
    t.style.display = "none";
    return;
  }
  const f = [];
  let b = 0, T = 0, k = !1;
  if (w.forEach((E, x) => {
    const X = JSON.parse(E.getAttribute("data") || "[]")[g];
    if (X == null) return;
    const et = E.getAttribute("label") || `Dataset ${x + 1}`, st = G(E.getAttribute("color"));
    f.push(`<div><div>${_[g]}</div><span style="color:${st};">●</span> ${et}: ${X}</div>`), k || (b = y.left + g / (u - 1) * l, T = y.top + C * (1 - (X - v) / (c - v)), k = !0);
  }), o === "mouse") {
    f.length ? (t.innerHTML = f.join(""), t.style.left = `${h + 10}px`, t.style.top = `${n + 10}px`, t.style.display = "block") : t.style.display = "none";
    return;
  }
  f.length && k ? (t.innerHTML = f.join(""), t.style.left = `${b + 10}px`, t.style.top = `${T - 30}px`, t.style.display = "block") : t.style.display = "none";
}
var H, P, N, Y;
class at extends HTMLElement {
  constructor() {
    super(...arguments);
    m(this, H, "point");
    m(this, P);
    m(this, N);
    m(this, Y);
    $(this, "_tooltip");
  }
  static get observedAttributes() {
    return ["position"];
  }
  connectedCallback() {
    var t, e, o;
    if (p(this, H, this.getAttribute("position") || "point"), p(this, N, (t = this.parentElement) == null ? void 0 : t.shadowRoot), p(this, Y, this.parentElement), !r(this, N)) {
      console.error("[AC Tooltip] Tooltip must be a child of another-chart with a shadow root.");
      return;
    }
    p(this, P, (o = (e = this.parentElement) == null ? void 0 : e.shadowRoot) == null ? void 0 : o.querySelector("canvas")), this._tooltip = document.createElement("div"), this._tooltip.className = "another-chart__tooltip", r(this, H) === "point" && this._tooltip.classList.add("another-chart__tooltip--animate"), r(this, N).appendChild(this._tooltip), r(this, P).addEventListener("mousemove", (a) => this.handleMouseMove(a)), r(this, P).addEventListener("mouseleave", () => {
      this._tooltip && (this._tooltip.style.display = "none");
    });
  }
  handleMouseMove(t) {
    rt(t, r(this, P), this._tooltip, r(this, Y), r(this, H));
  }
  attributeChangedCallback(t, e, o) {
    e !== o && t === "position" && (p(this, H, o || "point"), this._tooltip && this._tooltip.classList.toggle("another-chart__tooltip--animate", r(this, H) === "point"));
  }
}
H = new WeakMap(), P = new WeakMap(), N = new WeakMap(), Y = new WeakMap();
var W, I, J;
class lt extends HTMLElement {
  constructor() {
    super(...arguments);
    m(this, W);
    m(this, I);
    m(this, J, "bottom");
    $(this, "_legend");
  }
  static get observedAttributes() {
    return ["position"];
  }
  connectedCallback() {
    var t;
    if (p(this, W, (t = this.parentElement) == null ? void 0 : t.shadowRoot), p(this, I, this.parentElement), p(this, J, this.getAttribute("position") || "bottom"), !r(this, W)) {
      console.warn("[AC Legend] Legend must be a child of another-chart with a shadow root.");
      return;
    }
    this._legend = document.createElement("div"), this._legend.className = "another-chart__legend", r(this, J) === "top" && this._legend.classList.add("another-chart__legend--top"), r(this, W).appendChild(this._legend), setTimeout(() => {
      this.renderLegends();
    }, 0);
  }
  renderLegends() {
    if (!r(this, I)) {
      console.error("[AC Legend] Legend must be a child of another-chart.");
      return;
    }
    const t = Array.from(r(this, I).querySelectorAll("ac-data-set"));
    this._legend && (this._legend.innerHTML = "", t.forEach((e, o) => {
      const a = e.getAttribute("label") || `Dataset ${o + 1}`, h = G(e.getAttribute("color")), n = document.createElement("div");
      n.className = "legend__item";
      const w = document.createElement("div");
      w.className = "legend__color", w.style.backgroundColor = h;
      const u = document.createElement("span");
      u.textContent = a ?? `Dataset ${o + 1}`, n.appendChild(w), n.appendChild(u), this._legend.appendChild(n);
    }));
  }
}
W = new WeakMap(), I = new WeakMap(), J = new WeakMap();
function ht(i, s, t, e, o, a, h = !1) {
  const n = K(), w = e - (n.top + n.bottom), u = window.devicePixelRatio || 1;
  i.width = t * u, i.height = e * u, s.setTransform(1, 0, 0, 1, 0, 0), s.scale(u, u), s.clearRect(0, 0, t, e), h && (o > 0 && (o = 0), a < 0 && (a = 0));
  const v = a - o;
  if (v === 0) return;
  let _ = v / 10;
  const y = Math.pow(10, Math.floor(Math.log10(_))), S = _ / y;
  let A;
  S <= 1 ? A = 1 : S <= 2 ? A = 2 : S <= 4 ? A = 5 : A = 10;
  const l = A * y, C = Math.floor(o / l) * l, d = Math.ceil(a / l) * l, g = /* @__PURE__ */ new Set();
  for (let E = C; E <= d + l / 2; E += l)
    g.add(Number(E.toFixed(10)));
  const f = Array.from(g).sort((E, x) => x - E);
  s.font = "12px sans-serif", s.fillStyle = "#666666", s.textAlign = "right", s.textBaseline = "middle";
  const b = 5, T = (E) => n.top + (d - E) / (d - C) * w;
  s.strokeStyle = "#e5e5e5", s.lineWidth = 1, f.forEach((E) => {
    const x = Math.round(T(E)) + 0.5;
    s.beginPath(), s.moveTo(n.left + 0.5, x), s.lineTo(t - n.right, x), s.stroke(), s.fillText(
      E.toFixed(Number.isInteger(l) ? 0 : 1),
      n.left - b,
      x
    );
  });
  const k = n.left + 0.5;
  s.beginPath(), s.moveTo(k, n.top), s.lineTo(k, e - n.bottom), s.stroke(), s.beginPath(), s.moveTo(t - n.right, n.top), s.lineTo(t - n.right, e - n.bottom), s.stroke();
}
function ct(i, s, t, e, o = !0) {
  const a = K(), h = s - a.left - a.right, n = 10, w = e.length, u = w - 1;
  if (i.fillStyle = "#666", i.font = "12px sans-serif", i.textAlign = "center", i.textBaseline = "top", i.lineWidth = 1, o) {
    const v = h / w;
    for (let c = 0; c < w; c++) {
      const _ = a.left + v * (c + 0.5);
      if (c < u) {
        const y = a.left + v * (c + 1);
        i.strokeStyle = "#e5e5e5", i.beginPath(), i.moveTo(y, a.top), i.lineTo(y, t - n - 20), i.stroke();
      }
      i.fillText(e[c], _, t - n - 10);
    }
  } else
    for (let v = 0; v <= u; v++) {
      const c = a.left + h / u * v;
      i.strokeStyle = "#e5e5e5", i.beginPath(), i.moveTo(c, a.top), i.lineTo(c, t - n - 20), i.stroke(), i.fillText(e[v], c, t - n - 10);
    }
}
function K(i) {
  const s = { top: 10, right: 20, bottom: 30, left: 50 };
  return {
    top: s.top + 0,
    right: s.right + 0,
    bottom: s.bottom + 0,
    left: s.left + 0
  };
}
var D, O, Z;
class dt extends HTMLElement {
  constructor() {
    super(...arguments);
    m(this, D);
    m(this, O, "auto");
    m(this, Z, 10);
  }
  connectedCallback() {
    p(this, O, this.getAttribute("width") ?? "auto"), p(this, D, this.getAttribute("color") || void 0), p(this, Z, parseFloat(this.getAttribute("space") || "10"));
  }
  static get observedAttributes() {
    return ["color", "bar-width"];
  }
  attributeChangedCallback(t, e, o) {
    e !== o && (t === "color" && p(this, D, o || void 0), t === "bar-width" && p(this, O, o ?? "auto"));
  }
  draw(t, e, o, a, h, n, w, u) {
    const v = w ?? a.length, c = K(), _ = e - (c.left + c.right), y = o - (c.top + c.bottom), S = n - h || 1;
    t.save(), t.translate(c.left + 0.5, o - c.bottom + 0.5), t.scale(1, -1);
    const A = _ / v, l = r(this, O) !== "auto" ? 0 : r(this, Z) ?? 0, C = r(this, O) === "auto" ? A - l : Math.min(parseFloat(r(this, O)), A - l);
    t.fillStyle = G(r(this, D) ?? u ?? "black"), a.forEach((d, g) => {
      const f = g * A + (A - C) / 2, b = (d - h) / S * y;
      t.fillRect(f, 0, C, b), this.dispatchEvent(new CustomEvent("register-click-area", {
        detail: {
          x: f + c.left,
          y: o - c.bottom - b,
          width: C,
          height: b,
          value: d
        },
        bubbles: !0,
        composed: !0
      }));
    }), t.restore();
  }
}
D = new WeakMap(), O = new WeakMap(), Z = new WeakMap();
var R, F, j;
class pt extends HTMLElement {
  constructor() {
    super(...arguments);
    m(this, R);
    m(this, F, 0);
    m(this, j, 2);
  }
  connectedCallback() {
    p(this, F, parseFloat(this.getAttribute("tension") || "0")), p(this, j, parseFloat(this.getAttribute("width") ?? "") || 1), p(this, R, this.getAttribute("color") || void 0);
  }
  static get observedAttributes() {
    return ["tension", "color", "width"];
  }
  attributeChangedCallback(t, e, o) {
    e !== o && (t === "color" && p(this, R, o || void 0), t === "tension" && p(this, F, parseFloat(this.getAttribute("tension") || "0")), t === "width" && p(this, j, parseFloat(this.getAttribute("width") ?? "") || 1));
  }
  draw(t, e, o, a, h, n, w, u, v = !0) {
    const c = w ?? a.length;
    a.length;
    const _ = K(), y = e - (_.left + _.right), S = o - (_.top + _.bottom);
    t.save(), t.translate(_.left + 0.5, o - _.bottom + 0.5), t.scale(1, -1), t.lineWidth = r(this, j);
    const A = n - h || 1;
    let l;
    if (v) {
      const d = y / c;
      l = a.map((g, f) => {
        const b = d * (f + 0.5), T = (g - h) / A * S;
        return { x: b, y: T };
      });
    } else
      l = a.map((d, g) => {
        const f = g / (c - 1) * y, b = (d - h) / A * S;
        return { x: f, y: b };
      });
    t.strokeStyle = G(r(this, R) ?? u ?? "black"), t.beginPath(), t.moveTo(l[0].x, l[0].y);
    for (let d = 0; d < l.length - 1; d++) {
      const g = l[d - 1] || l[d], f = l[d], b = l[d + 1], T = l[d + 2] || b, k = r(this, F), E = f.x + (b.x - g.x) * k / 6, x = f.y + (b.y - g.y) * k / 6, Q = b.x - (T.x - f.x) * k / 6, X = b.y - (T.y - f.y) * k / 6;
      t.bezierCurveTo(E, x, Q, X, b.x, b.y);
    }
    t.stroke(), t.fillStyle = G(r(this, R) ?? u ?? "black");
    const C = 4;
    l.forEach(({ x: d, y: g }) => {
      t.beginPath(), t.arc(d, g, C, 0, 2 * Math.PI), t.fill();
    }), t.restore();
  }
}
R = new WeakMap(), F = new WeakMap(), j = new WeakMap();
const ut = `
    :host {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    :host:has(.another-chart__legend--top) {
      flex-direction: column-reverse;
    }
    canvas {
      width: 100%;
      flex: 1;
      min-height: 0px;
    }
    .another-chart__legend {
    width: 100%;
    padding: 6px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    font-size: 12px;
    font-family: sans-serif;
  }
  .legend__item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend__color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .another-chart__tooltip { 
      position: absolute;
      background: #666;
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      pointer-events: none;
      font-size: 12px;
      z-index: 10;
      display: none;
      font-family: sans-serif;
    }
    .another-chart__tooltip--animate {
      transition: all ease .2s;
    }
  `;
var M, q, B, U, L, z;
class bt extends HTMLElement {
  constructor() {
    super();
    m(this, M, []);
    m(this, q, !1);
    m(this, B, !1);
    m(this, U, []);
    m(this, L);
    m(this, z);
    $(this, "_observer");
    $(this, "_resizeObserver");
    this.attachShadow({ mode: "open" }), this.setupElements(), this.setupObservers(), this.setupListeners();
  }
  static get observedAttributes() {
    return ["labels"];
  }
  setupElements() {
    var o;
    const t = document.createElement("style");
    t.textContent = ut, p(this, L, document.createElement("canvas")), p(this, z, r(this, L).getContext("2d"));
    const e = document.createElement("slot");
    (o = this.shadowRoot) == null || o.append(t, r(this, L), e);
  }
  setupObservers() {
    this._observer = new MutationObserver(() => this.renderAllCharts()), this._observer.observe(this, {
      childList: !0,
      subtree: !0,
      attributes: !0
    }), this._resizeObserver = new ResizeObserver(() => this.renderAllCharts()), this._resizeObserver.observe(this);
  }
  setupListeners() {
    this.addEventListener("register-click-area", (t) => {
      const e = t.detail;
      r(this, U).push(e);
    }), r(this, L).addEventListener("click", this.handleClick.bind(this));
  }
  connectedCallback() {
    p(this, M, (this.getAttribute("labels") ?? "").split(",").map((t) => t.trim())), p(this, q, (this.getAttribute("begin-at-zero") ?? this.getAttribute("beginAtZero") ?? "true") === "true"), setTimeout(() => this.renderAllCharts(), 0);
  }
  attributeChangedCallback(t, e, o) {
    if (console.log(`Attribute changed: ${t} from ${e} to ${o}`), !(!r(this, L) || !r(this, z)) && e !== o && t === "labels") {
      const a = (o ?? "").split(",").map((n) => n.trim()), h = a.length === r(this, M).length;
      if (p(this, M, a), h) {
        this.drawScales();
        return;
      }
      this.renderAllCharts();
    }
  }
  disconnectedCallback() {
    this._observer && this._observer.disconnect(), this._resizeObserver && this._resizeObserver.disconnect();
  }
  handleClick(t) {
    const e = r(this, L).getBoundingClientRect(), o = t.clientX - e.left, a = t.clientY - e.top, h = r(this, U).find(
      (n) => o >= n.x && o <= n.x + n.width && a >= n.y && a <= n.y + n.height
    );
    h && (console.log("Clicked value:", h.value), this.dispatchEvent(new CustomEvent("value-click", {
      detail: { value: h.value },
      bubbles: !0,
      composed: !0
    })));
  }
  renderAllCharts() {
    const t = Array.from(this.querySelectorAll("ac-data-set"));
    p(this, B, Array.from(this.querySelectorAll("ac-bar-chart")).length > 0), t.forEach((e) => {
      var o;
      return (o = e.updateData) == null ? void 0 : o.call(e);
    }), this.drawScales(), t.forEach((e) => {
      var o;
      return (o = e.forceResize) == null ? void 0 : o.call(e);
    });
  }
  drawScales() {
    const t = r(this, L).clientWidth ?? 800, e = r(this, L).clientHeight ?? 400;
    ht(r(this, L), r(this, z), t, e, this.getGlobals().min, this.getGlobals().max, r(this, q)), ct(r(this, z), t, e, r(this, M), r(this, B));
  }
  beginAtZero() {
    return r(this, q);
  }
  getNumberOfValues() {
    var t;
    return ((t = r(this, M)) == null ? void 0 : t.length) ?? 0;
  }
  getLabels() {
    return r(this, M);
  }
  getCenter() {
    return r(this, B);
  }
  getGlobals() {
    let t = [];
    return Array.from(this.children).forEach((e) => {
      var a;
      const o = JSON.parse(e.getAttribute("data") || "[]");
      t.push(...o.slice(0, ((a = r(this, M)) == null ? void 0 : a.length) || o.length));
    }), t = [...new Set(t)].toSorted((e, o) => e - o), { min: t.at(0) ?? 0, max: t.at(-1) ?? 0 };
  }
}
M = new WeakMap(), q = new WeakMap(), B = new WeakMap(), U = new WeakMap(), L = new WeakMap(), z = new WeakMap();
customElements.define("another-chart", bt);
customElements.define("ac-data-set", nt);
customElements.define("ac-line-chart", pt);
customElements.define("ac-tooltip", at);
customElements.define("ac-legend", lt);
customElements.define("ac-bar-chart", dt);
