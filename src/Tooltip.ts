
import { draw } from './utils/tooltip';

export default class Tooltip extends HTMLElement {
  #position: 'mouse' | 'point' = 'point';
  #canvas!: HTMLCanvasElement;
  #root!: ShadowRoot | null | undefined;
  #parent!: unknown;
  _tooltip!: HTMLDivElement;

  static get observedAttributes() {
    return ['position'];
  }

  connectedCallback() {
    this.#position = this.getAttribute("position") as 'mouse' | 'point' || 'point';
    this.#root = this.parentElement?.shadowRoot;
    this.#parent = this.parentElement;

    if (!this.#root) {
      console.error('[AC Tooltip] Tooltip must be a child of another-chart with a shadow root.');
      return;
    }

    this.#canvas = this.parentElement?.shadowRoot?.querySelector('canvas') as HTMLCanvasElement;

    this._tooltip = document.createElement('div');
    this._tooltip.className = 'another-chart__tooltip';
    if (this.#position === 'point') {
      this._tooltip.classList.add('another-chart__tooltip--animate');
    }
    this.#root.appendChild(this._tooltip);
    this.#canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.#canvas.addEventListener('mouseleave', () => {
      if (this._tooltip) this._tooltip.style.display = 'none';
    });
  }

  handleMouseMove(e: MouseEvent) {
    draw(e, this.#canvas, this._tooltip, this.#parent, this.#position);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'position') {
      this.#position = newValue as 'mouse' | 'point' || 'point';
      if (this._tooltip) {
        this._tooltip.classList.toggle('another-chart__tooltip--animate', this.#position === 'point');
      }
    }
  }
}
