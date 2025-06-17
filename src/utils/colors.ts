export function colorToRgba(input?: string | null) {
  if(!input) return undefined; // Default to black if input is empty
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

export function defaultColor(index: number): string {
  const palette = [
    'rgba(34, 197, 94, 0.9)',    // Green
    'rgba(239, 68, 68, 0.9)',    // Red
    'rgba(59, 130, 246, 0.9)',   // Blue
    'rgba(251, 146, 60, 0.9)',   // Orange
    'rgba(236, 72, 153, 0.9)',   // Pink
    'rgba(132, 204, 22, 0.9)',   // Lime
    'rgba(14, 165, 233, 0.9)',   // Sky Blue
    'rgba(168, 85, 247, 0.9)',   // Purple
    'rgba(250, 204, 21, 0.9)',   // Yellow
    'rgba(20, 184, 166, 0.9)',   // Teal
  ];
  return palette[index % palette.length];
}