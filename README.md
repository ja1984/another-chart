# Another Chart

A lightweight, flexible, and modern web component charting library. Create beautiful charts using custom elements and plain HTML.

## Features

- **Web Components**: Use charts as native HTML elements.
- **Multiple Chart Types**: Line and Bar charts.
- **Customizable**: Easily style and configure datasets, colors, legends, and tooltips.
- **Responsive**: Charts resize automatically.
- **Zero Dependency**: No external libraries required.

## Installation

Install via npm:

```sh
npm install another-chart
```

Or use directly in your project by including the built JS file.

## Usage

### Basic Example

```html
<another-chart labels="Jan, Feb, Mar, Apr, May, Jun, Jul" begin-at-zero="true">
  <ac-data-set data="[100, 40, 10, 15, 10, 25, 30]" color="#900">
    <ac-bar-chart color="#090"></ac-bar-chart>
    <ac-line-chart></ac-line-chart>
  </ac-data-set>
  <ac-tooltip position="mouse"></ac-tooltip>
  <ac-legend position="top"></ac-legend>
</another-chart>
```

### With JavaScript (Vite/ESM)

```js
import 'another-chart';
```

Or, if using the demo build:

```html
<script src="dist/another-chart.js" type="module"></script>
```

## Chart Types

- `<ac-line-chart>`: Line chart (supports `color`, `width`, `tension`)
- `<ac-bar-chart>`: Bar chart (supports `color`, `bar-width`)

## Customization

- **Legend**: Add `<ac-legend position="top"></ac-legend>` or `<ac-legend position="bottom"></ac-legend>` as a child of `<another-chart>`.
- **Tooltip**: Add `<ac-tooltip position="mouse|point"></ac-tooltip>` as a child of `<another-chart>`.
- **Colors**: Use the `color` attribute on `<ac-data-set>`, `<ac-bar-chart>`, or `<ac-line-chart>`.
- **Labels**: Set the `labels` attribute on `<another-chart>` (comma-separated).

## Development

- Clone the repo
- Install dependencies:  
  ```sh
  npm install
  ```
- Start dev server:  
  ```sh
  npm run dev
  ```
- Build:  
  ```sh
  npm run build
  ```

## File Structure

- [`src/`](src/) — Source code (charts, utils, components)
- [`types/`](types/) — TypeScript types ([`index.ts`](types/index.ts))
- [`demo.html`](demo.html) — Demo page
- [`index.html`](index.html) — Example usage

## License

MIT © 2025 Jonathan Andersson