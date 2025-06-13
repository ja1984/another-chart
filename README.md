# Another Chart

A lightweight, flexible, and modern web component charting library. Create beautiful charts using custom elements and plain HTML.

## Features

- **Web Components**: Use charts as native HTML elements.
- **Multiple Chart Types**: Line, Bar, Area, and Pie charts.
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
<another-chart labels="Jan, Feb, Mar, Apr, May, Jun, Jul" legend="top" begin-at-zero="true">
  <ac-data-set data="[100, 40, 10, 15, 10, 25, 30]" color="#900">
    <ac-bar-chart color="#090"></ac-bar-chart>
    <ac-line-chart></ac-line-chart>
  </ac-data-set>
  <ac-tooltip position="mouse"></ac-tooltip>
</another-chart>
```

### With JavaScript (Vite/ESM)

```js
import 'another-chart';
```

Or, if using the demo:

```html
<script src="dist/another-chart.js" type="module"></script>
```

## Chart Types

- `<ac-line-chart>`: Line chart (supports `color`, `width`, `tension`)
- `<ac-bar-chart>`: Bar chart (supports `color`, `bar-width`)
- `<area-chart>`: Area chart
- `<pie-chart>`: Pie chart

## Customization

- **Legend**: Set `legend="top"`, `legend="bottom"`, or `legend="none"`
- **Tooltip**: Add `<ac-tooltip position="mouse|point"></ac-tooltip>`
- **Colors**: Use `color` attribute on datasets or chart elements
- **Labels**: Set `labels` attribute on `<another-chart>`

## Development

- Clone the repo
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`

## File Structure

- `src/` — Source code (charts, utils, components)
- `types/` — TypeScript types
- `demo.html` — Demo page
- `index.html` — Example usage

## License

MIT © 2025 Jonathan Andersson