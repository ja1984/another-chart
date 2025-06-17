import DataSet from './DataSet';
import Tooltip from './Tooltip';
import Legend from './Legend';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import { drawScale, drawBottomScale } from './utils/chart';
import { defaultColor } from './utils/colors';

const STYLES = `
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


class AnotherChart extends HTMLElement {
  #labels: string[] = [];
  #beginAtZero: boolean = false;
  #center: boolean = false;
  #clickMap: Array<{ x: number; y: number; width: number; height: number; value: number }> = [];
  #canvas!: HTMLCanvasElement;

  #ctx!: CanvasRenderingContext2D | null;
  _observer!: MutationObserver;
  _resizeObserver!: ResizeObserver;



  static get observedAttributes() {
    return ['labels'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.setupElements();
    this.setupObservers();
    this.setupListeners();
  }

  setupElements() {
    const style = document.createElement('style');
    style.textContent = STYLES;

    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    const slot = document.createElement('slot');
    this.shadowRoot?.append(style, this.#canvas, slot);
  }

  setupObservers() {
    this._observer = new MutationObserver(() => this.renderAllCharts());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    this._resizeObserver = new ResizeObserver(() => this.renderAllCharts());
    this._resizeObserver.observe(this);
  }

  setupListeners() {
    this.addEventListener('register-click-area', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.#clickMap.push(detail);
    });

    this.#canvas.addEventListener('click', this.handleClick.bind(this));
  }

  connectedCallback() {
    this.#labels = (this.getAttribute("labels") ?? '').split(',').map(label => label.trim());
    this.#beginAtZero = (this.getAttribute('begin-at-zero') ?? this.getAttribute('beginAtZero') ?? 'true') === 'true';

    setTimeout(() => this.renderAllCharts(), 0);
  }



  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(`Attribute changed: ${name} from ${oldValue} to ${newValue}`);
    if (!this.#canvas || !this.#ctx) return;

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

  handleClick(event: MouseEvent) {
    const rect = this.#canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hit = this.#clickMap.find(region =>
      x >= region.x &&
      x <= region.x + region.width &&
      y >= region.y &&
      y <= region.y + region.height
    );

    if (hit) {
      console.log('Clicked value:', hit.value);

      // Optional: Emit custom event for external listeners
      this.dispatchEvent(new CustomEvent('value-click', {
        detail: { value: hit.value },
        bubbles: true,
        composed: true
      }));
    }
  }


  renderAllCharts() {
    const dataSets = Array.from(this.querySelectorAll('ac-data-set')) as any[];
    this.#center = Array.from(this.querySelectorAll('ac-bar-chart')).length > 0

    // Update data in all datasets first
    dataSets.forEach((ds, index) => ds.updateData?.(defaultColor(index)));

    // Now draw the updated scales
    this.drawScales();

    // Force a resize (which triggers a render)
    dataSets.forEach((ds, index) => ds.forceResize?.());
  }

  drawScales() {
    const clientWidth = this.#canvas!.clientWidth ?? 800;
    const clientHeight = this.#canvas!.clientHeight ?? 400;

    drawScale(this.#canvas, this.#ctx!, clientWidth, clientHeight, this.getGlobals().min, this.getGlobals().max, this.#beginAtZero);
    drawBottomScale(this.#ctx!, clientWidth, clientHeight, this.#labels, this.#center);
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

  getCenter() {
    return this.#center;
  }

  getGlobals(): { min: number, max: number } {
    let values: number[] = [];
    Array.from(this.children).forEach(dataSet => {
      const data = JSON.parse(dataSet.getAttribute('data') || '[]');
      values.push(...data.slice(0, this.#labels?.length || data.length));
    });

    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;

    return { min, max };
  }

};

customElements.define('another-chart', AnotherChart);
customElements.define('ac-data-set', DataSet);
customElements.define('ac-line-chart', LineChart);
customElements.define('ac-tooltip', Tooltip);
customElements.define('ac-legend', Legend);

customElements.define('ac-bar-chart', BarChart);
