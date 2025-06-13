var q = Object.defineProperty;
var N = (o) => {
  throw TypeError(o);
};
var j = (o, e, t) => e in o ? q(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var A = (o, e, t) => j(o, typeof e != "symbol" ? e + "" : e, t), I = (o, e, t) => e.has(o) || N("Cannot " + t);
var S = (o, e, t) => (I(o, e, "read from private field"), t ? t.call(o) : e.get(o)), L = (o, e, t) => e.has(o) ? N("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), E = (o, e, t, n) => (I(o, e, "write to private field"), n ? n.call(o, t) : e.set(o, t), t);
class B extends HTMLElement {
  constructor() {
    super(...arguments);
    A(this, "data", []);
    A(this, "color", "rgba(46, 204, 113, 0.9)");
    A(this, "parent");
  }
  connectedCallback() {
    this.parent = this.parentNode, this.attachShadow({ mode: "open" }).innerHTML = "<slot></slot>", this.updateData();
  }
  static get observedAttributes() {
    return ["data", "color"];
  }
  attributeChangedCallback(t, n, s) {
    n !== s && (t === "data" && (this.data = JSON.parse(s || "[]")), t === "color" && (this.color = s || "rgba(46, 204, 113, 0.9)"), this.render());
  }
  updateData() {
    this.data = JSON.parse(this.getAttribute("data") || "[]"), this.color = this.getAttribute("color") || "rgba(46, 204, 113, 0.9)";
  }
  forceResize() {
    this.render();
  }
  render() {
    var f, M;
    if (!this.parent) return;
    const t = (M = (f = this.parentElement) == null ? void 0 : f.shadowRoot) == null ? void 0 : M.querySelector("canvas"), n = t.getContext("2d"), s = window.devicePixelRatio || 1, a = t.width / s, c = t.height / s, r = this.parent.getGlobals(), d = this.parent.getNumberOfValues(), h = this.parent.beginAtZero() ? 0 : r.min, p = r.max, m = (p - h || 1) / 10, y = Math.pow(10, Math.floor(Math.log10(m))), i = m / y;
    let g;
    i <= 1 ? g = 1 : i <= 2 ? g = 2 : i <= 4 ? g = 5 : g = 10;
    const l = g * y, v = Math.floor(h / l) * l, w = Math.ceil(p / l) * l;
    Array.from(this.children).forEach((T) => {
      typeof T.draw == "function" && T.draw(n, a, c, this.data.slice(0, d), v, w, d, this.color);
    });
  }
}
class J extends HTMLElement {
  draw(e, t, n, s, a, c) {
    e.save(), e.translate(0, n), e.scale(1, -1), e.beginPath(), e.moveTo(0, 0), e.lineTo(t, 0), e.strokeStyle = "#999", e.lineWidth = 1, e.stroke();
    const r = 10, d = s.length, h = r * (d - 1), p = (t - h) / d, b = c - a || 1;
    s.forEach((u, m) => {
      const y = m * (p + r), i = 0, g = (u - a) / b, l = Math.max(g * n, 1);
      e.fillStyle = "rgba(52, 152, 219, 0.6)", e.fillRect(y, i, p, l);
    }), e.restore();
  }
}
function $(o) {
  if (!o) return "rgba(0, 0, 0, 1)";
  if (o = o.trim(), o.startsWith("#")) {
    let t = o.replace(/^#/, "");
    t.length === 3 ? t = t.split("").map((r) => r + r).join("") : t.length === 4 && (t = t.split("").map((r) => r + r).join(""));
    const n = parseInt(t.substring(0, 2), 16), s = parseInt(t.substring(2, 4), 16), a = parseInt(t.substring(4, 6), 16), c = t.length === 8 ? parseInt(t.substring(6, 8), 16) / 255 : 1;
    return `rgba(${n}, ${s}, ${a}, ${c})`;
  }
  const e = o.match(/rgba?\(([^)]+)\)/);
  if (e) {
    let [t, n, s, a = 1] = e[1].split(",").map((c) => c.trim());
    return `rgba(${parseInt(t)}, ${parseInt(n)}, ${parseInt(s)}, ${parseFloat(a)})`;
  }
  throw new Error("Unsupported color format");
}
function Z(o, e, t, n, s, a, c = !1) {
  const r = z(), d = n - (r.top + r.bottom), h = window.devicePixelRatio || 1;
  o.width = t * h, o.height = n * h, e.setTransform(1, 0, 0, 1, 0, 0), e.scale(h, h), e.clearRect(0, 0, t, n), c && (s > 0 && (s = 0), a < 0 && (a = 0));
  const p = a - s;
  if (p === 0) return;
  let u = p / 10;
  const m = Math.pow(10, Math.floor(Math.log10(u))), y = u / m;
  let i;
  y <= 1 ? i = 1 : y <= 2 ? i = 2 : y <= 4 ? i = 5 : i = 10;
  const g = i * m, l = Math.floor(s / g) * g, v = Math.ceil(a / g) * g, w = /* @__PURE__ */ new Set();
  for (let C = l; C <= v + g / 2; C += g)
    w.add(Number(C.toFixed(10)));
  const f = Array.from(w).sort((C, P) => P - C);
  e.font = "12px sans-serif", e.fillStyle = "#333", e.textAlign = "right", e.textBaseline = "middle";
  const M = 5, T = (C) => r.top + (v - C) / (v - l) * d;
  e.strokeStyle = "#f5f5f5", e.lineWidth = 1, f.forEach((C) => {
    const P = Math.round(T(C)) + 0.5;
    e.beginPath(), e.moveTo(r.left + 0.5, P), e.lineTo(t - r.right, P), e.stroke(), e.fillText(
      C.toFixed(Number.isInteger(g) ? 0 : 1),
      r.left - M,
      P
    );
  });
  const W = r.left + 0.5;
  e.beginPath(), e.moveTo(W, r.top), e.lineTo(W, n - r.bottom), e.stroke();
}
function X(o, e, t, n) {
  const s = z(), a = e - s.left - s.right, c = 10, r = n.length - 1;
  o.fillStyle = "#333", o.font = "12px sans-serif", o.textAlign = "center", o.textBaseline = "top", o.lineWidth = 1;
  for (let d = 0; d <= r; d++) {
    const h = s.left + a / r * d, p = n[d];
    o.strokeStyle = "#f5f5f5", o.beginPath(), o.moveTo(h, s.top), o.lineTo(h, t - c - 20), o.stroke(), o.fillText(p, h, t - c - 10);
  }
}
function z(o) {
  const e = { top: 10, right: 20, bottom: 30, left: 50 };
  return {
    top: e.top + 0,
    right: e.right + 0,
    bottom: e.bottom + 0,
    left: e.left + 0
  };
}
var _, H, R, D;
let Y = (D = class extends HTMLElement {
  constructor() {
    super(...arguments);
    L(this, _);
    L(this, H, 0);
    L(this, R, 2);
  }
  connectedCallback() {
    E(this, H, parseFloat(this.getAttribute("tension") || "0")), E(this, R, parseFloat(this.getAttribute("width") ?? "") || 1), E(this, _, this.getAttribute("color") || void 0);
  }
  static get observedAttributes() {
    return ["tension", "color", "width"];
  }
  attributeChangedCallback(t, n, s) {
    n !== s && (t === "color" && E(this, _, s || void 0), t === "tension" && E(this, H, parseFloat(this.getAttribute("tension") || "0")), t === "width" && E(this, R, parseFloat(this.getAttribute("width") ?? "") || 1));
  }
  draw(t, n, s, a, c, r, d, h) {
    const p = d ?? a.length;
    a.length;
    const b = z(), u = n - (b.left + b.right), m = s - (b.top + b.bottom);
    t.save(), t.translate(b.left + 0.5, s - b.bottom + 0.5), t.scale(1, -1), t.lineWidth = S(this, R);
    const y = r - c || 1, i = a.map((l, v) => {
      const w = v / (p - 1) * u, f = (l - c) / y * m;
      return { x: w, y: f };
    });
    t.strokeStyle = $(S(this, _) ?? h ?? "black"), t.beginPath(), t.moveTo(i[0].x, i[0].y);
    for (let l = 0; l < i.length - 1; l++) {
      const v = i[l - 1] || i[l], w = i[l], f = i[l + 1], M = i[l + 2] || f, T = S(this, H), W = w.x + (f.x - v.x) * T / 6, C = w.y + (f.y - v.y) * T / 6, P = f.x - (M.x - w.x) * T / 6, G = f.y - (M.y - w.y) * T / 6;
      t.bezierCurveTo(W, C, P, G, f.x, f.y);
    }
    t.stroke(), t.fillStyle = $(S(this, _) ?? h ?? "black");
    const g = 4;
    i.forEach(({ x: l, y: v }) => {
      t.beginPath(), t.arc(l, v, g, 0, 2 * Math.PI), t.fill();
    }), t.restore();
  }
}, _ = new WeakMap(), H = new WeakMap(), R = new WeakMap(), D);
class U extends HTMLElement {
  draw(e, t, n, s) {
    const a = s.reduce((b, u) => b + u, 0);
    let c = 0;
    const r = t / 2, d = n / 2, h = Math.min(t, n) / 4, p = ["#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"];
    s.forEach((b, u) => {
      const m = b / a * 2 * Math.PI;
      e.fillStyle = p[u % p.length] + "aa", e.beginPath(), e.moveTo(r, d), e.arc(r, d, h, c, c + m), e.closePath(), e.fill(), c += m;
    });
  }
}
class V extends HTMLElement {
  draw(e, t, n, s, a, c) {
    const r = z(), d = t - r.left - r.right, h = n - r.top - r.bottom;
    e.save(), e.translate(r.left, n - r.bottom), e.scale(1, -1);
    const p = c - a || 1;
    e.strokeStyle = "rgba(46, 204, 113, 0.9)", e.lineWidth = 1;
    const b = 10, u = s.length, m = b * (u - 1), y = (d - m) / u, i = s.map((l, v) => {
      const w = v * (y + b) + y / 2, f = (l - a) / p * h;
      return { x: w, y: f };
    }), g = e.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(46, 204, 113, 0)"), g.addColorStop(1, "rgba(46, 204, 113, 0.4)"), e.fillStyle = g, e.beginPath(), e.moveTo(i[0].x, 0);
    for (const l of i)
      e.lineTo(l.x, l.y);
    e.lineTo(i[i.length - 1].x, 0), e.closePath(), e.fill(), e.beginPath(), e.moveTo(i[0].x, i[0].y);
    for (const l of i.slice(1))
      e.lineTo(l.x, l.y);
    e.stroke(), e.restore();
  }
}
var k, O, F;
customElements.define("another-chart", (F = class extends HTMLElement {
  constructor() {
    super(...arguments);
    L(this, k, []);
    L(this, O, !1);
    A(this, "canvas");
    A(this, "ctx");
    A(this, "_slot");
    A(this, "_observer");
    A(this, "_legendContainer");
    A(this, "_resizeObserver");
  }
  static get observedAttributes() {
    return ["labels"];
  }
  connectedCallback() {
    console.log("connectedCallback");
    const t = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    canvas {
      width: 100%;
      pointer-events: none;
      flex: 1;
      min-height: 0px;
    }
    .legend {
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
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  `;
    E(this, k, (this.getAttribute("labels") ?? "").split(",").map((a) => a.trim()));
    const n = document.createElement("style");
    n.textContent = t, this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this._slot = document.createElement("slot"), this._legendContainer = document.createElement("div"), this._legendContainer.className = "legend";
    const s = this.attachShadow({ mode: "open" });
    s.appendChild(n), s.appendChild(this.canvas), s.appendChild(this._slot), s.appendChild(this._legendContainer), this._observer = new MutationObserver(() => this.renderAllCharts()), this._observer.observe(this, {
      childList: !0,
      subtree: !0,
      attributes: !0
    }), this._resizeObserver = new ResizeObserver(() => this.renderAllCharts()), this._resizeObserver.observe(this), setTimeout(() => this.renderAllCharts(), 0);
  }
  attributeChangedCallback(t, n, s) {
    if (!(!this.canvas || !this.ctx) && n !== s && t === "labels") {
      const a = (s ?? "").split(",").map((r) => r.trim()), c = a.length === S(this, k).length;
      if (E(this, k, a), c) {
        this.drawScales();
        return;
      }
      this.renderAllCharts();
    }
  }
  disconnectedCallback() {
    this._observer && this._observer.disconnect(), this._resizeObserver && this._resizeObserver.disconnect();
  }
  renderAllCharts() {
    this.updateLegend();
    const t = Array.from(this.querySelectorAll("data-set"));
    t.forEach((n) => {
      var s;
      return (s = n.updateData) == null ? void 0 : s.call(n);
    }), this.drawScales(), t.forEach((n) => {
      var s;
      return (s = n.forceResize) == null ? void 0 : s.call(n);
    });
  }
  drawScales() {
    var s, a;
    const t = ((s = this.shadowRoot) == null ? void 0 : s.querySelector("canvas").clientWidth) ?? 800, n = ((a = this.shadowRoot) == null ? void 0 : a.querySelector("canvas").clientHeight) ?? 400;
    console.log(n, t), Z(this.canvas, this.ctx, t, n, this.getGlobals().min, this.getGlobals().max, S(this, O)), X(this.ctx, t, n, S(this, k));
  }
  updateLegend() {
    const t = Array.from(this.querySelectorAll("data-set"));
    this._legendContainer && (this._legendContainer.innerHTML = "", t.forEach((n, s) => {
      const a = n.getAttribute("label") || `Dataset ${s + 1}`, c = n.getAttribute("color") || "black", r = document.createElement("div");
      r.className = "legend-item";
      const d = document.createElement("div");
      d.className = "legend-color", d.style.backgroundColor = c;
      const h = document.createElement("span");
      h.textContent = a, r.appendChild(d), r.appendChild(h), this._legendContainer.appendChild(r);
    }));
  }
  beginAtZero() {
    return S(this, O);
  }
  getNumberOfValues() {
    var t;
    return ((t = S(this, k)) == null ? void 0 : t.length) ?? 0;
  }
  getGlobals() {
    let t = [];
    return Array.from(this.children).forEach((n) => {
      var a;
      const s = JSON.parse(n.getAttribute("data") || "[]");
      t.push(...s.slice(0, ((a = S(this, k)) == null ? void 0 : a.length) || s.length));
    }), t = [...new Set(t)].toSorted((n, s) => n - s), { min: t.at(0) ?? 0, max: t.at(-1) ?? 0 };
  }
}, k = new WeakMap(), O = new WeakMap(), F));
customElements.define("data-set", B);
customElements.define("bar-chart", J);
customElements.define("line-chart", Y);
customElements.define("pie-chart", U);
customElements.define("area-chart", V);
