var ot = Object.defineProperty;
var V = (i) => {
  throw TypeError(i);
};
var it = (i, o, t) => o in i ? ot(i, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[o] = t;
var $ = (i, o, t) => it(i, typeof o != "symbol" ? o + "" : o, t), tt = (i, o, t) => o.has(i) || V("Cannot " + t);
var n = (i, o, t) => (tt(i, o, "read from private field"), t ? t.call(i) : o.get(i)), m = (i, o, t) => o.has(i) ? V("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(i) : o.set(i, t), p = (i, o, t, e) => (tt(i, o, "write to private field"), e ? e.call(i, t) : o.set(i, t), t);
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
  attributeChangedCallback(t, e, s) {
    e !== s && (t === "data" && (this.data = JSON.parse(s || "[]")), t === "color" && (this.color = s || "rgba(46, 204, 113, 0.9)"), this.render());
  }
  updateData() {
    this.data = JSON.parse(this.getAttribute("data") || "[]"), this.color = this.getAttribute("color") || "rgba(46, 204, 113, 0.9)";
  }
  forceResize() {
    this.render();
  }
  render() {
    var f, T;
    if (!this.parent) return;
    const t = (T = (f = this.parentElement) == null ? void 0 : f.shadowRoot) == null ? void 0 : T.querySelector("canvas"), e = t.getContext("2d"), s = window.devicePixelRatio || 1, a = t.width / s, h = t.height / s, r = this.parent.getGlobals(), w = this.parent.getNumberOfValues(), u = this.parent.beginAtZero() ? 0 : r.min, v = this.parent.getCenter(), c = r.max, S = (c - u || 1) / 10, A = Math.pow(10, Math.floor(Math.log10(S))), l = S / A;
    let C;
    l <= 1 ? C = 1 : l <= 2 ? C = 2 : l <= 4 ? C = 5 : C = 10;
    const d = C * A, b = Math.floor(u / d) * d, g = Math.ceil(c / d) * d;
    Array.from(this.children).forEach((k) => {
      typeof k.draw == "function" && k.draw(e, a, h, this.data.slice(0, w), b, g, w, this.color, v);
    });
  }
}
function G(i) {
  if (!i) return "rgba(0, 0, 0, 1)";
  if (i = i.trim(), i.startsWith("#")) {
    let t = i.replace(/^#/, "");
    t.length === 3 ? t = t.split("").map((r) => r + r).join("") : t.length === 4 && (t = t.split("").map((r) => r + r).join(""));
    const e = parseInt(t.substring(0, 2), 16), s = parseInt(t.substring(2, 4), 16), a = parseInt(t.substring(4, 6), 16), h = t.length === 8 ? parseInt(t.substring(6, 8), 16) / 255 : 1;
    return `rgba(${e}, ${s}, ${a}, ${h})`;
  }
  const o = i.match(/rgba?\(([^)]+)\)/);
  if (o) {
    let [t, e, s, a = 1] = o[1].split(",").map((h) => h.trim());
    return `rgba(${parseInt(t)}, ${parseInt(e)}, ${parseInt(s)}, ${parseFloat(a)})`;
  }
  throw new Error("Unsupported color format");
}
function rt(i, o, t, e, s) {
  if (!o || !t) {
    console.warn("[AC Tooltip] Canvas or tooltip element not found.");
    return;
  }
  const a = o.getBoundingClientRect(), h = i.clientX - a.left, r = i.clientY - a.top, w = Array.from(e.querySelectorAll("ac-data-set")), u = e.getNumberOfValues(), { min: v, max: c } = e.getGlobals(), _ = e.getLabels(), y = { top: 20, bottom: 30, left: 40, right: 20 }, S = o.clientWidth, A = o.clientHeight, l = S - y.left - y.right, C = A - y.top - y.bottom, d = (h - y.left) / l, b = Math.round(d * (u - 1));
  if (b < 0 || b >= u) {
    t.style.display = "none";
    return;
  }
  const g = [];
  let f = 0, T = 0, k = !1;
  if (w.forEach((E, x) => {
    const X = JSON.parse(E.getAttribute("data") || "[]")[b];
    if (X == null) return;
    const et = E.getAttribute("label") || `Dataset ${x + 1}`, st = G(E.getAttribute("color"));
    g.push(`<div><div>${_[b]}</div><span style="color:${st};">●</span> ${et}: ${X}</div>`), k || (f = y.left + b / (u - 1) * l, T = y.top + C * (1 - (X - v) / (c - v)), k = !0);
  }), s === "mouse") {
    g.length ? (t.innerHTML = g.join(""), t.style.left = `${h + 10}px`, t.style.top = `${r + 10}px`, t.style.display = "block") : t.style.display = "none";
    return;
  }
  g.length && k ? (t.innerHTML = g.join(""), t.style.left = `${f + 10}px`, t.style.top = `${T - 30}px`, t.style.display = "block") : t.style.display = "none";
}
var H, R, N, Y;
class at extends HTMLElement {
  constructor() {
    super(...arguments);
    m(this, H, "point");
    m(this, R);
    m(this, N);
    m(this, Y);
    $(this, "_tooltip");
  }
  static get observedAttributes() {
    return ["position"];
  }
  connectedCallback() {
    var t, e, s;
    if (p(this, H, this.getAttribute("position") || "point"), p(this, N, (t = this.parentElement) == null ? void 0 : t.shadowRoot), p(this, Y, this.parentElement), !n(this, N)) {
      console.error("[AC Tooltip] Tooltip must be a child of another-chart with a shadow root.");
      return;
    }
    p(this, R, (s = (e = this.parentElement) == null ? void 0 : e.shadowRoot) == null ? void 0 : s.querySelector("canvas")), this._tooltip = document.createElement("div"), this._tooltip.className = "another-chart__tooltip", n(this, H) === "point" && this._tooltip.classList.add("another-chart__tooltip--animate"), n(this, N).appendChild(this._tooltip), n(this, R).addEventListener("mousemove", (a) => this.handleMouseMove(a)), n(this, R).addEventListener("mouseleave", () => {
      this._tooltip && (this._tooltip.style.display = "none");
    });
  }
  handleMouseMove(t) {
    rt(t, n(this, R), this._tooltip, n(this, Y), n(this, H));
  }
  attributeChangedCallback(t, e, s) {
    e !== s && t === "position" && (p(this, H, s || "point"), this._tooltip && this._tooltip.classList.toggle("another-chart__tooltip--animate", n(this, H) === "point"));
  }
}
H = new WeakMap(), R = new WeakMap(), N = new WeakMap(), Y = new WeakMap();
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
    if (p(this, W, (t = this.parentElement) == null ? void 0 : t.shadowRoot), p(this, I, this.parentElement), p(this, J, this.getAttribute("position") || "bottom"), !n(this, W)) {
      console.warn("[AC Legend] Legend must be a child of another-chart with a shadow root.");
      return;
    }
    this._legend = document.createElement("div"), this._legend.className = "another-chart__legend", n(this, J) === "top" && this._legend.classList.add("another-chart__legend--top"), n(this, W).appendChild(this._legend), setTimeout(() => {
      this.renderLegends();
    }, 0);
  }
  renderLegends() {
    if (!n(this, I)) {
      console.error("[AC Legend] Legend must be a child of another-chart.");
      return;
    }
    const t = Array.from(n(this, I).querySelectorAll("ac-data-set"));
    this._legend && (this._legend.innerHTML = "", t.forEach((e, s) => {
      const a = e.getAttribute("label") || `Dataset ${s + 1}`, h = G(e.getAttribute("color")), r = document.createElement("div");
      r.className = "legend__item";
      const w = document.createElement("div");
      w.className = "legend__color", w.style.backgroundColor = h;
      const u = document.createElement("span");
      u.textContent = a ?? `Dataset ${s + 1}`, r.appendChild(w), r.appendChild(u), this._legend.appendChild(r);
    }));
  }
}
W = new WeakMap(), I = new WeakMap(), J = new WeakMap();
function ht(i, o, t, e, s, a, h = !1) {
  const r = K(), w = e - (r.top + r.bottom), u = window.devicePixelRatio || 1;
  i.width = t * u, i.height = e * u, o.setTransform(1, 0, 0, 1, 0, 0), o.scale(u, u), o.clearRect(0, 0, t, e), h && (s > 0 && (s = 0), a < 0 && (a = 0));
  const v = a - s;
  if (v === 0) return;
  let _ = v / 10;
  const y = Math.pow(10, Math.floor(Math.log10(_))), S = _ / y;
  let A;
  S <= 1 ? A = 1 : S <= 2 ? A = 2 : S <= 4 ? A = 5 : A = 10;
  const l = A * y, C = Math.floor(s / l) * l, d = Math.ceil(a / l) * l, b = /* @__PURE__ */ new Set();
  for (let E = C; E <= d + l / 2; E += l)
    b.add(Number(E.toFixed(10)));
  const g = Array.from(b).sort((E, x) => x - E);
  o.font = "12px sans-serif", o.fillStyle = "#333", o.textAlign = "right", o.textBaseline = "middle";
  const f = 5, T = (E) => r.top + (d - E) / (d - C) * w;
  o.strokeStyle = "#f5f5f5", o.lineWidth = 1, g.forEach((E) => {
    const x = Math.round(T(E)) + 0.5;
    o.beginPath(), o.moveTo(r.left + 0.5, x), o.lineTo(t - r.right, x), o.stroke(), o.fillText(
      E.toFixed(Number.isInteger(l) ? 0 : 1),
      r.left - f,
      x
    );
  });
  const k = r.left + 0.5;
  o.beginPath(), o.moveTo(k, r.top), o.lineTo(k, e - r.bottom), o.stroke();
}
function ct(i, o, t, e, s = !0) {
  const a = K(), h = o - a.left - a.right, r = 10, w = e.length, u = w - 1;
  if (i.fillStyle = "#333", i.font = "12px sans-serif", i.textAlign = "center", i.textBaseline = "top", i.lineWidth = 1, s) {
    const v = h / w;
    for (let c = 0; c < w; c++) {
      const _ = a.left + v * (c + 0.5);
      if (c < u) {
        const y = a.left + v * (c + 1);
        i.strokeStyle = "#f5f5f5", i.beginPath(), i.moveTo(y, a.top), i.lineTo(y, t - r - 20), i.stroke();
      }
      i.fillText(e[c], _, t - r - 10);
    }
  } else
    for (let v = 0; v <= u; v++) {
      const c = a.left + h / u * v;
      i.strokeStyle = "#f5f5f5", i.beginPath(), i.moveTo(c, a.top), i.lineTo(c, t - r - 20), i.stroke(), i.fillText(e[v], c, t - r - 10);
    }
}
function K(i) {
  const o = { top: 10, right: 20, bottom: 30, left: 50 };
  return {
    top: o.top + 0,
    right: o.right + 0,
    bottom: o.bottom + 0,
    left: o.left + 0
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
  attributeChangedCallback(t, e, s) {
    e !== s && (t === "color" && p(this, D, s || void 0), t === "bar-width" && p(this, O, s ?? "auto"));
  }
  draw(t, e, s, a, h, r, w, u) {
    const v = w ?? a.length, c = K(), _ = e - (c.left + c.right), y = s - (c.top + c.bottom), S = r - h || 1;
    t.save(), t.translate(c.left + 0.5, s - c.bottom + 0.5), t.scale(1, -1);
    const A = _ / v, l = n(this, O) !== "auto" ? 0 : n(this, Z) ?? 0, C = n(this, O) === "auto" ? A - l : Math.min(parseFloat(n(this, O)), A - l);
    t.fillStyle = G(n(this, D) ?? u ?? "black"), a.forEach((d, b) => {
      const g = b * A + (A - C) / 2, f = (d - h) / S * y;
      t.fillRect(g, 0, C, f), this.dispatchEvent(new CustomEvent("register-click-area", {
        detail: {
          x: g + c.left,
          y: s - c.bottom - f,
          width: C,
          height: f,
          value: d
        },
        bubbles: !0,
        composed: !0
      }));
    }), t.restore();
  }
}
D = new WeakMap(), O = new WeakMap(), Z = new WeakMap();
var P, F, j;
class pt extends HTMLElement {
  constructor() {
    super(...arguments);
    m(this, P);
    m(this, F, 0);
    m(this, j, 2);
  }
  connectedCallback() {
    p(this, F, parseFloat(this.getAttribute("tension") || "0")), p(this, j, parseFloat(this.getAttribute("width") ?? "") || 1), p(this, P, this.getAttribute("color") || void 0);
  }
  static get observedAttributes() {
    return ["tension", "color", "width"];
  }
  attributeChangedCallback(t, e, s) {
    e !== s && (t === "color" && p(this, P, s || void 0), t === "tension" && p(this, F, parseFloat(this.getAttribute("tension") || "0")), t === "width" && p(this, j, parseFloat(this.getAttribute("width") ?? "") || 1));
  }
  draw(t, e, s, a, h, r, w, u, v = !0) {
    const c = w ?? a.length;
    a.length;
    const _ = K(), y = e - (_.left + _.right), S = s - (_.top + _.bottom);
    t.save(), t.translate(_.left + 0.5, s - _.bottom + 0.5), t.scale(1, -1), t.lineWidth = n(this, j);
    const A = r - h || 1;
    let l;
    if (v) {
      const d = y / c;
      l = a.map((b, g) => {
        const f = d * (g + 0.5), T = (b - h) / A * S;
        return { x: f, y: T };
      });
    } else
      l = a.map((d, b) => {
        const g = b / (c - 1) * y, f = (d - h) / A * S;
        return { x: g, y: f };
      });
    t.strokeStyle = G(n(this, P) ?? u ?? "black"), t.beginPath(), t.moveTo(l[0].x, l[0].y);
    for (let d = 0; d < l.length - 1; d++) {
      const b = l[d - 1] || l[d], g = l[d], f = l[d + 1], T = l[d + 2] || f, k = n(this, F), E = g.x + (f.x - b.x) * k / 6, x = g.y + (f.y - b.y) * k / 6, Q = f.x - (T.x - g.x) * k / 6, X = f.y - (T.y - g.y) * k / 6;
      t.bezierCurveTo(E, x, Q, X, f.x, f.y);
    }
    t.stroke(), t.fillStyle = G(n(this, P) ?? u ?? "black");
    const C = 4;
    l.forEach(({ x: d, y: b }) => {
      t.beginPath(), t.arc(d, b, C, 0, 2 * Math.PI), t.fill();
    }), t.restore();
  }
}
P = new WeakMap(), F = new WeakMap(), j = new WeakMap();
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
    background: rgba(255, 255, 255, 0.8);
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
      background: #333;
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
class ft extends HTMLElement {
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
    var s;
    const t = document.createElement("style");
    t.textContent = ut, p(this, L, document.createElement("canvas")), p(this, z, n(this, L).getContext("2d"));
    const e = document.createElement("slot");
    (s = this.shadowRoot) == null || s.append(t, n(this, L), e);
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
      n(this, U).push(e);
    }), n(this, L).addEventListener("click", this.handleClick.bind(this));
  }
  connectedCallback() {
    p(this, M, (this.getAttribute("labels") ?? "").split(",").map((t) => t.trim())), p(this, q, (this.getAttribute("begin-at-zero") ?? this.getAttribute("beginAtZero") ?? "true") === "true"), setTimeout(() => this.renderAllCharts(), 0);
  }
  attributeChangedCallback(t, e, s) {
    if (console.log(`Attribute changed: ${t} from ${e} to ${s}`), !(!n(this, L) || !n(this, z)) && e !== s && t === "labels") {
      const a = (s ?? "").split(",").map((r) => r.trim()), h = a.length === n(this, M).length;
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
    const e = n(this, L).getBoundingClientRect(), s = t.clientX - e.left, a = t.clientY - e.top, h = n(this, U).find(
      (r) => s >= r.x && s <= r.x + r.width && a >= r.y && a <= r.y + r.height
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
      var s;
      return (s = e.updateData) == null ? void 0 : s.call(e);
    }), this.drawScales(), t.forEach((e) => {
      var s;
      return (s = e.forceResize) == null ? void 0 : s.call(e);
    });
  }
  drawScales() {
    const t = n(this, L).clientWidth ?? 800, e = n(this, L).clientHeight ?? 400;
    ht(n(this, L), n(this, z), t, e, this.getGlobals().min, this.getGlobals().max, n(this, q)), ct(n(this, z), t, e, n(this, M), n(this, B));
  }
  beginAtZero() {
    return n(this, q);
  }
  getNumberOfValues() {
    var t;
    return ((t = n(this, M)) == null ? void 0 : t.length) ?? 0;
  }
  getLabels() {
    return n(this, M);
  }
  getCenter() {
    return n(this, B);
  }
  getGlobals() {
    let t = [];
    return Array.from(this.children).forEach((e) => {
      var a;
      const s = JSON.parse(e.getAttribute("data") || "[]");
      t.push(...s.slice(0, ((a = n(this, M)) == null ? void 0 : a.length) || s.length));
    }), t = [...new Set(t)].toSorted((e, s) => e - s), { min: t.at(0) ?? 0, max: t.at(-1) ?? 0 };
  }
}
M = new WeakMap(), q = new WeakMap(), B = new WeakMap(), U = new WeakMap(), L = new WeakMap(), z = new WeakMap();
customElements.define("another-chart", ft);
customElements.define("ac-data-set", nt);
customElements.define("ac-line-chart", pt);
customElements.define("ac-tooltip", at);
customElements.define("ac-legend", lt);
customElements.define("ac-bar-chart", dt);
