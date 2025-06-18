var nt = Object.defineProperty;
var et = (o) => {
  throw TypeError(o);
};
var rt = (o, e, t) => e in o ? nt(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var $ = (o, e, t) => rt(o, typeof e != "symbol" ? e + "" : e, t), st = (o, e, t) => e.has(o) || et("Cannot " + t);
var a = (o, e, t) => (st(o, e, "read from private field"), t ? t.call(o) : e.get(o)), y = (o, e, t) => e.has(o) ? et("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), p = (o, e, t, s) => (st(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
class at extends HTMLElement {
  constructor() {
    super(...arguments);
    $(this, "data", []);
    $(this, "color", "rgba(46, 204, 113, 0.9)");
    $(this, "parent");
  }
  connectedCallback() {
    this.parent = this.parentNode, this.attachShadow({ mode: "open" }).innerHTML = "<slot></slot>";
  }
  static get observedAttributes() {
    return ["data", "color"];
  }
  attributeChangedCallback(t, s, i) {
    s !== i && (t === "data" && (this.data = JSON.parse(i || "[]")), t === "color" && (this.color = i || "rgba(46, 204, 113, 0.9)"), this.render());
  }
  updateData(t) {
    this.data = JSON.parse(this.getAttribute("data") || "[]"), this.color = this.getAttribute("color") || t;
  }
  forceResize() {
    this.render();
  }
  render() {
    var g, S;
    if (!this.parent) return;
    const t = (S = (g = this.parentElement) == null ? void 0 : g.shadowRoot) == null ? void 0 : S.querySelector("canvas"), s = t.getContext("2d"), i = window.devicePixelRatio || 1, r = t.width / i, l = t.height / i, n = this.parent.getGlobals(), w = this.parent.getNumberOfValues();
    let u = n.min, f = n.max;
    this.parent.beginAtZero() && (u = Math.min(0, n.min), f = Math.max(0, n.max));
    const d = this.parent.getCenter(), v = (f - u || 1) / 10, A = Math.pow(10, Math.floor(Math.log10(v))), h = v / A;
    let E;
    h <= 1 ? E = 1 : h <= 2 ? E = 2 : h <= 4 ? E = 5 : E = 10;
    const c = E * A, m = Math.floor(u / c) * c, _ = Math.ceil(f / c) * c;
    Array.from(this.children).forEach((M) => {
      typeof M.draw == "function" && M.draw(s, r, l, this.data.slice(0, w), m, _, w, this.color, d);
    });
  }
}
function X(o) {
  if (!o) return;
  if (o = o.trim(), o.startsWith("#")) {
    let t = o.replace(/^#/, "");
    t.length === 3 ? t = t.split("").map((n) => n + n).join("") : t.length === 4 && (t = t.split("").map((n) => n + n).join(""));
    const s = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), r = parseInt(t.substring(4, 6), 16), l = t.length === 8 ? parseInt(t.substring(6, 8), 16) / 255 : 1;
    return `rgba(${s}, ${i}, ${r}, ${l})`;
  }
  const e = o.match(/rgba?\(([^)]+)\)/);
  if (e) {
    let [t, s, i, r = 1] = e[1].split(",").map((l) => l.trim());
    return `rgba(${parseInt(t)}, ${parseInt(s)}, ${parseInt(i)}, ${parseFloat(r)})`;
  }
  throw new Error("Unsupported color format");
}
function V(o) {
  const e = [
    "rgba(34, 197, 94, 0.9)",
    // Green
    "rgba(239, 68, 68, 0.9)",
    // Red
    "rgba(59, 130, 246, 0.9)",
    // Blue
    "rgba(251, 146, 60, 0.9)",
    // Orange
    "rgba(236, 72, 153, 0.9)",
    // Pink
    "rgba(132, 204, 22, 0.9)",
    // Lime
    "rgba(14, 165, 233, 0.9)",
    // Sky Blue
    "rgba(168, 85, 247, 0.9)",
    // Purple
    "rgba(250, 204, 21, 0.9)",
    // Yellow
    "rgba(20, 184, 166, 0.9)"
    // Teal
  ];
  return e[o % e.length];
}
function lt(o, e, t, s, i) {
  if (!e || !t) {
    console.warn("[AC Tooltip] Canvas or tooltip element not found.");
    return;
  }
  const r = e.getBoundingClientRect(), l = o.clientX - r.left, n = o.clientY - r.top, w = Array.from(s.querySelectorAll("ac-data-set")), u = s.getNumberOfValues(), { min: f, max: d } = s.getGlobals(), C = s.getLabels(), b = { top: 20, bottom: 30, left: 40, right: 20 }, v = e.clientWidth, A = e.clientHeight, h = v - b.left - b.right, E = A - b.top - b.bottom, c = (l - b.left) / h;
  if (c < 0 || c > 1) {
    t.style.display = "none";
    return;
  }
  const m = Math.floor(c * u), _ = Math.max(0, Math.min(u - 1, m)), g = [`<div>${C[_]}</div>`];
  let S = 0, M = 0, k = !1;
  if (w.forEach((x, U) => {
    const Q = JSON.parse(x.getAttribute("data") || "[]")[_];
    if (Q == null) return;
    const ot = x.getAttribute("label") || `Dataset ${U + 1}`, it = X(x.getAttribute("color")) ?? V(U);
    g.push(`<div><span style="color:${it};">●</span> ${ot}: ${Q}</div>`), k || (S = b.left + _ / (u - 1) * h, M = b.top + E * (1 - (Q - f) / (d - f)), k = !0);
  }), i === "mouse") {
    g.length ? (t.innerHTML = g.join(""), t.style.left = `${l + 10}px`, t.style.top = `${n + 10}px`, t.style.display = "block") : t.style.display = "none";
    return;
  }
  g.length && k ? (t.innerHTML = g.join(""), t.style.left = `${S + 10}px`, t.style.top = `${M - 30}px`, t.style.display = "block") : t.style.display = "none";
}
var H, P, N, Y;
class ht extends HTMLElement {
  constructor() {
    super(...arguments);
    y(this, H, "point");
    y(this, P);
    y(this, N);
    y(this, Y);
    $(this, "_tooltip");
  }
  static get observedAttributes() {
    return ["position"];
  }
  connectedCallback() {
    var t, s, i;
    if (p(this, H, this.getAttribute("position") || "point"), p(this, N, (t = this.parentElement) == null ? void 0 : t.shadowRoot), p(this, Y, this.parentElement), !a(this, N)) {
      console.error("[AC Tooltip] Tooltip must be a child of another-chart with a shadow root.");
      return;
    }
    p(this, P, (i = (s = this.parentElement) == null ? void 0 : s.shadowRoot) == null ? void 0 : i.querySelector("canvas")), this._tooltip = document.createElement("div"), this._tooltip.className = "another-chart__tooltip", a(this, H) === "point" && this._tooltip.classList.add("another-chart__tooltip--animate"), a(this, N).appendChild(this._tooltip), a(this, P).addEventListener("mousemove", (r) => this.handleMouseMove(r)), a(this, P).addEventListener("mouseleave", () => {
      this._tooltip && (this._tooltip.style.display = "none");
    });
  }
  handleMouseMove(t) {
    lt(t, a(this, P), this._tooltip, a(this, Y), a(this, H));
  }
  attributeChangedCallback(t, s, i) {
    s !== i && t === "position" && (p(this, H, i || "point"), this._tooltip && this._tooltip.classList.toggle("another-chart__tooltip--animate", a(this, H) === "point"));
  }
}
H = new WeakMap(), P = new WeakMap(), N = new WeakMap(), Y = new WeakMap();
var W, I, G;
class ct extends HTMLElement {
  constructor() {
    super(...arguments);
    y(this, W);
    y(this, I);
    y(this, G, "bottom");
    $(this, "_legend");
  }
  static get observedAttributes() {
    return ["position"];
  }
  connectedCallback() {
    var t;
    if (p(this, W, (t = this.parentElement) == null ? void 0 : t.shadowRoot), p(this, I, this.parentElement), p(this, G, this.getAttribute("position") || "bottom"), !a(this, W)) {
      console.warn("[AC Legend] Legend must be a child of another-chart with a shadow root.");
      return;
    }
    this._legend = document.createElement("div"), this._legend.className = "another-chart__legend", a(this, G) === "top" && this._legend.classList.add("another-chart__legend--top"), a(this, W).appendChild(this._legend), setTimeout(() => {
      this.renderLegends();
    }, 0);
  }
  renderLegends() {
    if (!a(this, I)) {
      console.error("[AC Legend] Legend must be a child of another-chart.");
      return;
    }
    const t = Array.from(a(this, I).querySelectorAll("ac-data-set"));
    this._legend && (this._legend.innerHTML = "", t.forEach((s, i) => {
      const r = s.getAttribute("label") || `Dataset ${i + 1}`, l = X(s.getAttribute("color")) ?? V(i), n = document.createElement("div");
      n.className = "legend__item";
      const w = document.createElement("div");
      w.className = "legend__color", w.style.backgroundColor = l;
      const u = document.createElement("span");
      u.textContent = r ?? `Dataset ${i + 1}`, n.appendChild(w), n.appendChild(u), this._legend.appendChild(n);
    }));
  }
}
W = new WeakMap(), I = new WeakMap(), G = new WeakMap();
function dt(o, e, t, s, i, r, l = !1) {
  const n = K(), w = s - (n.top + n.bottom), u = window.devicePixelRatio || 1;
  o.width = t * u, o.height = s * u, e.setTransform(1, 0, 0, 1, 0, 0), e.scale(u, u), e.clearRect(0, 0, t, s), l && (i > 0 && (i = 0), r < 0 && (r = 0));
  const f = r - i;
  if (f === 0) return;
  let C = f / 10;
  const b = Math.pow(10, Math.floor(Math.log10(C))), v = C / b;
  let A;
  v <= 1 ? A = 1 : v <= 2 ? A = 2 : v <= 4 ? A = 5 : A = 10;
  const h = A * b, E = Math.floor(i / h) * h, c = Math.ceil(r / h) * h, m = /* @__PURE__ */ new Set();
  for (let k = E; k <= c + h / 2; k += h)
    m.add(Number(k.toFixed(10)));
  const _ = Array.from(m).sort((k, x) => x - k);
  e.font = "12px sans-serif", e.fillStyle = "#666666", e.textAlign = "right", e.textBaseline = "middle";
  const g = 5, S = (k) => n.top + (c - k) / (c - E) * w;
  e.strokeStyle = "#e5e5e5", e.lineWidth = 1, _.forEach((k) => {
    const x = Math.round(S(k)) + 0.5;
    e.beginPath(), e.moveTo(n.left + 0.5, x), e.lineTo(t - n.right, x), e.stroke(), e.fillText(
      k.toFixed(Number.isInteger(h) ? 0 : 1),
      n.left - g,
      x
    );
  });
  const M = n.left + 0.5;
  e.beginPath(), e.moveTo(M, n.top), e.lineTo(M, s - n.bottom), e.stroke(), e.beginPath(), e.moveTo(t - n.right, n.top), e.lineTo(t - n.right, s - n.bottom), e.stroke();
}
function pt(o, e, t, s, i = !0) {
  const r = K(), l = e - r.left - r.right, n = 10, w = s.length, u = w - 1;
  if (o.fillStyle = "#666", o.font = "12px sans-serif", o.textAlign = "center", o.textBaseline = "top", o.lineWidth = 1, i) {
    const f = l / w;
    for (let d = 0; d < w; d++) {
      const C = r.left + f * (d + 0.5);
      if (d < u) {
        const b = r.left + f * (d + 1);
        o.strokeStyle = "#e5e5e5", o.beginPath(), o.moveTo(b, r.top), o.lineTo(b, t - n - 20), o.stroke();
      }
      o.fillText(s[d], C, t - n - 10);
    }
  } else
    for (let f = 0; f <= u; f++) {
      const d = r.left + l / u * f;
      o.strokeStyle = "#e5e5e5", o.beginPath(), o.moveTo(d, r.top), o.lineTo(d, t - n - 20), o.stroke(), o.fillText(s[f], d, t - n - 10);
    }
}
function K(o) {
  const e = { top: 10, right: 20, bottom: 30, left: 50 };
  return {
    top: e.top + 0,
    right: e.right + 0,
    bottom: e.bottom + 0,
    left: e.left + 0
  };
}
var F, O, J;
class gt extends HTMLElement {
  constructor() {
    super(...arguments);
    y(this, F);
    y(this, O, "auto");
    y(this, J, 10);
  }
  connectedCallback() {
    p(this, O, this.getAttribute("width") ?? "auto"), p(this, F, this.getAttribute("color") || void 0), p(this, J, parseFloat(this.getAttribute("space") || "10"));
  }
  static get observedAttributes() {
    return ["color", "bar-width"];
  }
  attributeChangedCallback(t, s, i) {
    s !== i && (t === "color" && p(this, F, i || void 0), t === "bar-width" && p(this, O, i ?? "auto"));
  }
  draw(t, s, i, r, l, n, w, u) {
    const f = w ?? r.length, d = K(), C = s - (d.left + d.right), b = i - (d.top + d.bottom), v = n - l || 1;
    t.save(), t.translate(d.left + 0.5, d.top + 0.5);
    const A = C / f, h = a(this, O) !== "auto" ? 0 : a(this, J) ?? 0, E = a(this, O) === "auto" ? A - h : Math.min(parseFloat(a(this, O)), A - h);
    t.fillStyle = X(a(this, F) ?? u ?? "black");
    const c = (0 - l) / v * b;
    r.forEach((m, _) => {
      const g = _ * A + (A - E) / 2, S = Math.abs(m) / v * b, M = m >= 0 ? b - (m - l) / v * b : b - c;
      t.fillRect(g, M, E, S), this.dispatchEvent(new CustomEvent("register-click-area", {
        detail: {
          x: g + d.left,
          y: M + d.top,
          width: E,
          height: S,
          value: m
        },
        bubbles: !0,
        composed: !0
      }));
    }), t.restore();
  }
}
F = new WeakMap(), O = new WeakMap(), J = new WeakMap();
var R, D, j;
class ut extends HTMLElement {
  constructor() {
    super(...arguments);
    y(this, R);
    y(this, D, 0);
    y(this, j, 2);
  }
  connectedCallback() {
    p(this, D, parseFloat(this.getAttribute("tension") || "0")), p(this, j, parseFloat(this.getAttribute("width") ?? "") || 1), p(this, R, this.getAttribute("color") || void 0);
  }
  static get observedAttributes() {
    return ["tension", "color", "width"];
  }
  attributeChangedCallback(t, s, i) {
    s !== i && (t === "color" && p(this, R, i || void 0), t === "tension" && p(this, D, parseFloat(this.getAttribute("tension") || "0")), t === "width" && p(this, j, parseFloat(this.getAttribute("width") ?? "") || 1));
  }
  draw(t, s, i, r, l, n, w, u, f = !0) {
    const d = w ?? r.length;
    r.length;
    const C = K(), b = s - (C.left + C.right), v = i - (C.top + C.bottom);
    t.save(), t.translate(C.left + 0.5, C.top + 0.5), t.lineWidth = a(this, j);
    const A = n - l || 1;
    let h;
    if (f) {
      const c = b / d;
      h = r.map((m, _) => {
        const g = c * (_ + 0.5), S = v - (m - l) / A * v;
        return { x: g, y: Math.max(0, Math.min(v, S)) };
      });
    } else
      h = r.map((c, m) => {
        const _ = m / (d - 1) * b, g = v - (c - l) / A * v;
        return { x: _, y: Math.max(0, Math.min(v, g)) };
      });
    t.strokeStyle = X(a(this, R) ?? u ?? "black"), t.beginPath(), t.moveTo(h[0].x, h[0].y);
    for (let c = 0; c < h.length - 1; c++) {
      const m = h[c - 1] || h[c], _ = h[c], g = h[c + 1], S = h[c + 2] || g, M = a(this, D), k = _.x + (g.x - m.x) * M / 6, x = _.y + (g.y - m.y) * M / 6, U = g.x - (S.x - _.x) * M / 6, tt = g.y - (S.y - _.y) * M / 6;
      t.bezierCurveTo(k, x, U, tt, g.x, g.y);
    }
    t.stroke(), t.fillStyle = X(a(this, R) ?? u ?? "black");
    const E = 4;
    h.forEach(({ x: c, y: m }) => {
      t.beginPath(), t.arc(c, m, E, 0, 2 * Math.PI), t.fill();
    }), t.restore();
  }
}
R = new WeakMap(), D = new WeakMap(), j = new WeakMap();
const bt = `
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
var L, q, B, Z, T, z;
class ft extends HTMLElement {
  constructor() {
    super();
    y(this, L, []);
    y(this, q, !1);
    y(this, B, !1);
    y(this, Z, []);
    y(this, T);
    y(this, z);
    $(this, "_observer");
    $(this, "_resizeObserver");
    this.attachShadow({ mode: "open" }), this.setupElements(), this.setupObservers(), this.setupListeners();
  }
  static get observedAttributes() {
    return ["labels"];
  }
  setupElements() {
    var i;
    const t = document.createElement("style");
    t.textContent = bt, p(this, T, document.createElement("canvas")), p(this, z, a(this, T).getContext("2d"));
    const s = document.createElement("slot");
    (i = this.shadowRoot) == null || i.append(t, a(this, T), s);
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
      const s = t.detail;
      a(this, Z).push(s);
    }), a(this, T).addEventListener("click", this.handleClick.bind(this));
  }
  connectedCallback() {
    p(this, L, (this.getAttribute("labels") ?? "").split(",").map((t) => t.trim())), p(this, q, (this.getAttribute("begin-at-zero") ?? this.getAttribute("beginAtZero") ?? "true") === "true"), setTimeout(() => this.renderAllCharts(), 0);
  }
  attributeChangedCallback(t, s, i) {
    if (console.log(`Attribute changed: ${t} from ${s} to ${i}`), !(!a(this, T) || !a(this, z)) && s !== i && t === "labels") {
      const r = (i ?? "").split(",").map((n) => n.trim()), l = r.length === a(this, L).length;
      if (p(this, L, r), l) {
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
    const s = a(this, T).getBoundingClientRect(), i = t.clientX - s.left, r = t.clientY - s.top, l = a(this, Z).find(
      (n) => i >= n.x && i <= n.x + n.width && r >= n.y && r <= n.y + n.height
    );
    l && (console.log("Clicked value:", l.value), this.dispatchEvent(new CustomEvent("value-click", {
      detail: { value: l.value },
      bubbles: !0,
      composed: !0
    })));
  }
  renderAllCharts() {
    const t = Array.from(this.querySelectorAll("ac-data-set"));
    p(this, B, Array.from(this.querySelectorAll("ac-bar-chart")).length > 0), t.forEach((s, i) => {
      var r;
      return (r = s.updateData) == null ? void 0 : r.call(s, V(i));
    }), this.drawScales(), t.forEach((s, i) => {
      var r;
      return (r = s.forceResize) == null ? void 0 : r.call(s);
    });
  }
  drawScales() {
    const t = a(this, T).clientWidth ?? 800, s = a(this, T).clientHeight ?? 400;
    dt(a(this, T), a(this, z), t, s, this.getGlobals().min, this.getGlobals().max, a(this, q)), pt(a(this, z), t, s, a(this, L), a(this, B));
  }
  beginAtZero() {
    return a(this, q);
  }
  getNumberOfValues() {
    var t;
    return ((t = a(this, L)) == null ? void 0 : t.length) ?? 0;
  }
  getLabels() {
    return a(this, L);
  }
  getCenter() {
    return a(this, B);
  }
  getGlobals() {
    let t = [];
    Array.from(this.children).forEach((r) => {
      var n;
      const l = JSON.parse(r.getAttribute("data") || "[]");
      t.push(...l.slice(0, ((n = a(this, L)) == null ? void 0 : n.length) || l.length));
    });
    const s = t.length ? Math.min(...t) : 0, i = t.length ? Math.max(...t) : 0;
    return { min: s, max: i };
  }
}
L = new WeakMap(), q = new WeakMap(), B = new WeakMap(), Z = new WeakMap(), T = new WeakMap(), z = new WeakMap();
customElements.define("another-chart", ft);
customElements.define("ac-data-set", at);
customElements.define("ac-line-chart", ut);
customElements.define("ac-tooltip", ht);
customElements.define("ac-legend", ct);
customElements.define("ac-bar-chart", gt);
