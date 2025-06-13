export function colorToRgba(input?: string | null) {
  if(!input) return 'rgba(0, 0, 0, 1)'; // Default to black if input is empty
  input = input.trim();

  // HEX format
  if (input.startsWith('#')) {
    let hex = input.replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    } else if (hex.length === 4) {
      hex = hex.split('').map(h => h + h).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // rgb() or rgba() format
  const rgbMatch = input.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    let [r, g, b, a = 1] = rgbMatch[1].split(',').map(v => v.trim());
    return `rgba(${parseInt(r)}, ${parseInt(g)}, ${parseInt(b)}, ${parseFloat(a)})`;
  }

  throw new Error("Unsupported color format");
}
