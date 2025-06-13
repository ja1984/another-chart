interface AnotherChart {
  getGlobals(): { min: number; max: number };
  getNumberOfValues(): number;
  beginAtZero(): boolean;
  getCenter(): boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
}

export default class DataSet extends HTMLElement {
  private data: number[] = [];
  private color: string = 'rgba(46, 204, 113, 0.9)';
  private parent!: AnotherChart;

  connectedCallback() {

    this.parent = this.parentNode as unknown as AnotherChart;
    this.attachShadow({ mode: 'open' }).innerHTML = `<slot></slot>`;
    this.updateData();
  }

  static get observedAttributes() {
    return ['data', 'color'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'data') {
      this.data = JSON.parse(newValue || '[]');
    }

    if (name === 'color') {
      this.color = newValue || 'rgba(46, 204, 113, 0.9)';
    }

    this.render(); // Trigger re-render on updates
  }

  updateData() {
    this.data = JSON.parse(this.getAttribute('data') || '[]');
    this.color = this.getAttribute('color') || 'rgba(46, 204, 113, 0.9)';
  }

  forceResize() {
    this.render();
  }

  private render() {
    //this.parentElement?.shadowRoot.querySelector('canvas')
    if(!this.parent) return;
    const canvas = this.parentElement?.shadowRoot?.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const global = this.parent.getGlobals();
    const numberOfValues = this.parent.getNumberOfValues();
    const rawMin = this.parent.beginAtZero() ? 0 : global.min;
    const shouldCenterPoints = this.parent.getCenter();
    const rawMax = global.max;

    const approxSteps = 10;
    const range = rawMax - rawMin || 1;
    const rawStep = range / approxSteps;

    const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const digit = rawStep / pow10;

    let niceDigit;
    if (digit <= 1) niceDigit = 1;
    else if (digit <= 2) niceDigit = 2;
    else if (digit <= 4) niceDigit = 5;
    else niceDigit = 10;

    const step = niceDigit * pow10;
    const start = Math.floor(rawMin / step) * step;
    const end = Math.ceil(rawMax / step) * step;

    Array.from(this.children).forEach(child => {
      if (typeof (child as any).draw === 'function') {
        (child as any).draw(ctx, width, height, this.data.slice(0, numberOfValues), start, end, numberOfValues, this.color, shouldCenterPoints);
      }
    });
  }
}
