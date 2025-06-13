import DataSet from './DataSet';
import Tooltip from './Tooltip';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import AreaChart from './charts/AreaChart';

import { drawScale, drawBottomScale } from './utils/chart';
import { colorToRgba } from "./utils/colors";


customElements.define('another-chart', class AnotherChart extends HTMLElement {
  #labels: string[] = [];
  #beginAtZero: boolean = false;
  #legend: 'top' | 'bottom' | 'none' = 'bottom';

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D | null;
  _slot!: HTMLSlotElement;
  _observer!: MutationObserver;
  _legendContainer!: HTMLDivElement;
  _resizeObserver!: ResizeObserver;
  


  static get observedAttributes() {
    return ['labels'];
  }

  connectedCallback() {
    const content = `
    :host {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    :host:has(.legend--top) {
      flex-direction: column-reverse;
    }
    canvas {
      width: 100%;
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

    this.#labels = (this.getAttribute("labels") ?? '').split(',').map(label => label.trim());
    this.#legend = this.getAttribute("legend") as 'top' | 'bottom' | 'none' || 'bottom';
    this.#beginAtZero = (this.getAttribute('begin-at-zero') ?? this.getAttribute('beginAtZero') ?? 'true') === 'true';

    const style = document.createElement('style');
    style.textContent = content;

    this.canvas = document.createElement('canvas');

    this.ctx = this.canvas.getContext('2d');
    this._slot = document.createElement('slot');
    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.canvas);
    shadowRoot.appendChild(this._slot);

    if (this.#legend !== 'none') {
      this._legendContainer = document.createElement('div');
      this._legendContainer.className = 'legend';

      if (this.#legend === 'top') {
        this._legendContainer.classList.add('legend--top');
      }
      shadowRoot.appendChild(this._legendContainer);
    }


    this._observer = new MutationObserver(() => this.renderAllCharts());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // 👇 Use ResizeObserver instead of window resize
    this._resizeObserver = new ResizeObserver(() => this.renderAllCharts());
    this._resizeObserver.observe(this); // or this.canvas if you prefer to track canvas size only


    // Defer first render
    setTimeout(() => this.renderAllCharts(), 0);
  }

  



  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (!this.canvas || !this.ctx) return;

    if (oldValue === newValue) return;

    if (name === 'labels') {
      const changedLabels = (newValue ?? '').split(',').map(label => label.trim());
      const justRenderScales = changedLabels.length === this.#labels.length;
      this.#labels = changedLabels;

      if (justRenderScales) {
        this.drawScales();
        return;
      }
      this.renderAllCharts();
    }


  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    if (this._resizeObserver) this._resizeObserver.disconnect();

  }

  renderAllCharts() {
    this.renderLegends(); // ← Add this line

    const dataSets = Array.from(this.querySelectorAll('ac-data-set')) as any[];

    // Update data in all datasets first
    dataSets.forEach(ds => ds.updateData?.());

    // Now draw the updated scales
    this.drawScales();

    // Force a resize (which triggers a render)
    dataSets.forEach(ds => ds.forceResize?.());
  }

  drawScales() {
    const clientWidth = this.shadowRoot?.querySelector('canvas')!.clientWidth ?? 800;
    const clientHeight = this.shadowRoot?.querySelector('canvas')!.clientHeight ?? 400;

    drawScale(this.canvas, this.ctx!, clientWidth, clientHeight, this.getGlobals().min, this.getGlobals().max, this.#beginAtZero);
    drawBottomScale(this.ctx!, clientWidth, clientHeight, this.#labels);
  }

  renderLegends() {
    const datasets = Array.from(this.querySelectorAll('ac-data-set')) as HTMLElement[];

    if (!this._legendContainer) return;
    this._legendContainer.innerHTML = '';

    datasets.forEach((ds, i) => {
      const label = ds.getAttribute('label') || `Dataset ${i + 1}`;
      const color = colorToRgba(ds.getAttribute('color'));

      const item = document.createElement('div');
      item.className = 'legend__item';

      const swatch = document.createElement('div');
      swatch.className = 'legend__color';
      swatch.style.backgroundColor = color;

      const text = document.createElement('span');
      text.textContent = label ?? `Dataset ${i + 1}`;

      item.appendChild(swatch);
      item.appendChild(text);
      this._legendContainer.appendChild(item);
    });
  }


  beginAtZero() {
    return this.#beginAtZero;
  }

  getNumberOfValues() {
    return this.#labels?.length ?? 0;
  }

  getLabels() {
    return this.#labels;
  }

  getGlobals(): { min: number, max: number } {
    let values: number[] = [];
    Array.from(this.children).forEach(dataSet => {
      const data = JSON.parse(dataSet.getAttribute('data') || '[]');
      values.push(...data.slice(0, this.#labels?.length || data.length));
    });

    values = [...new Set(values)].toSorted((a, b) => a - b);
    return { min: values.at(0) ?? 0, max: values.at(-1) ?? 0 }
  }
});

customElements.define('ac-data-set', DataSet);
customElements.define('ac-line-chart', LineChart);
customElements.define('ac-tooltip', Tooltip);

customElements.define('ac-bar-chart', BarChart);

customElements.define('pie-chart', PieChart);
customElements.define('area-chart', AreaChart);
