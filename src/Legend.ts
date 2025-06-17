
import { colorToRgba, defaultColor } from "./utils/colors";

export default class Legend extends HTMLElement {
  #root!: ShadowRoot | null | undefined;
  #parent!: unknown;
  #position: 'top' | 'bottom' = 'bottom';
  _legend!: HTMLDivElement;

  static get observedAttributes() {
    return ['position'];
  }

  connectedCallback() {
    this.#root = this.parentElement?.shadowRoot;
    this.#parent = this.parentElement;
    this.#position = this.getAttribute("position") as 'top' | 'bottom' || 'bottom';
    
    if(!this.#root) {
      console.warn('[AC Legend] Legend must be a child of another-chart with a shadow root.');
      return;
    }

    this._legend = document.createElement('div');
    this._legend.className = 'another-chart__legend';

    if(this.#position === 'top') {
      this._legend.classList.add('another-chart__legend--top');
    }

    this.#root.appendChild(this._legend);
    setTimeout(() => { this.renderLegends() }, 0);
  }

  renderLegends() {
    if (!this.#parent) {
      console.error('[AC Legend] Legend must be a child of another-chart.');
      return;
    }
    const datasets = Array.from(this.#parent.querySelectorAll('ac-data-set')) as HTMLElement[];
    if (!this._legend) return;
    this._legend.innerHTML = '';

    datasets.forEach((ds, i) => {
      const label = ds.getAttribute('label') || `Dataset ${i + 1}`;
      const color = colorToRgba(ds.getAttribute('color')) ?? defaultColor(i);

      const item = document.createElement('div');
      item.className = 'legend__item';

      const swatch = document.createElement('div');
      swatch.className = 'legend__color';
      swatch.style.backgroundColor = color;

      const text = document.createElement('span');
      text.textContent = label ?? `Dataset ${i + 1}`;

      item.appendChild(swatch);
      item.appendChild(text);
      this._legend.appendChild(item);
    });
  }
}
