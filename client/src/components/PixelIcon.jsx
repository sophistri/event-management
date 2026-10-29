// Tiny pixel-art sprites drawn from text grids and rendered as crisp SVG.
//
//   .  empty        p  pink      y  mustard    b  periwinkle
//   c  cream/white  w  white     r  deep rose  o  ink (outline colour)
//
// Pass `outline` (default true) and every empty cell touching a filled cell is
// painted in the ink colour, so sprites only need their fill drawn.
// To add an icon: add a grid below, then <PixelIcon name="yourIcon" />.

const COLORS = {
  p: 'var(--pink)',
  y: 'var(--mustard)',
  b: 'var(--blue)',
  c: 'var(--cream)',
  w: '#ffffff',
  r: 'var(--rose)',
  o: 'var(--ink)',
  z: 'var(--mustard-soft)',
};

const ICONS = {
  heart: [
    '.pp.pp.',
    'pwppppp',
    'ppppppp',
    '.ppppp.',
    '..ppp..',
    '...p...',
  ],
  star: [
    '....y....',
    '...yzy...',
    '...yyy...',
    'yyyyyyyyy',
    '.yyyyyyy.',
    '..yyyyy..',
    '..yyyyy..',
    '.yyy.yyy.',
    '.yy...yy.',
  ],
  sun: [
    '..yyy..',
    '.yzyyy.',
    'yzyyyyy',
    'yyyyyyy',
    'yyyyyyy',
    '.yyyyy.',
    '..yyy..',
  ],
  mail: [
    'ccccccccccc',
    'cocccccccoc',
    'ccocccccocc',
    'cccocccoccc',
    'ccccococccc',
    'cccccoccccc',
    'ccccccccccc',
  ],
  folder: [
    'yyyy.......',
    'yyyyyyyyyyy',
    'yzzzzzzzzzy',
    'yzyyyyyyyzy',
    'yyyyyyyyyyy',
    'yyyyyyyyyyy',
    'yyyyyyyyyyy',
  ],
  cloud: [
    '....cc.......',
    '...cccc..cc..',
    '.ccccccccccc.',
    'ccccccccccccc',
    'ccccccccccccc',
  ],
  sparkle: [
    '...w...',
    '...w...',
    '..www..',
    'wwwwwww',
    '..www..',
    '...w...',
    '...w...',
  ],
  // Window-control glyphs (drawn in ink, no outline pass)
  min: ['.....', '.....', '.....', 'ooooo', 'ooooo'],
  max: ['ooooo', 'o...o', 'o...o', 'o...o', 'ooooo'],
  close: ['oo...oo', '.oo.oo.', '..ooo..', '.oo.oo.', 'oo...oo'],
};

const NO_OUTLINE = new Set(['sparkle', 'min', 'max', 'close']);

function build(name, outline) {
  const rows = ICONS[name];
  if (!rows) return null;
  const w = Math.max(...rows.map((r) => r.length));
  const pad = outline ? 1 : 0;
  const W = w + pad * 2;
  const H = rows.length + pad * 2;

  const cell = (x, y) => {
    const ch = rows[y]?.[x];
    return ch && ch !== '.' ? ch : null;
  };

  const rects = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = x - pad;
      const sy = y - pad;
      let ch = cell(sx, sy);
      if (!ch && outline) {
        const touches =
          cell(sx - 1, sy) || cell(sx + 1, sy) || cell(sx, sy - 1) || cell(sx, sy + 1);
        if (touches) ch = 'o';
      }
      if (ch) rects.push({ x, y, fill: COLORS[ch] || COLORS.o });
    }
  }
  return { W, H, rects };
}

export default function PixelIcon({ name, size = 3, outline, className = '', title }) {
  const useOutline = outline ?? !NO_OUTLINE.has(name);
  const icon = build(name, useOutline);
  if (!icon) return null;

  return (
    <svg
      className={`px-icon ${className}`}
      width={icon.W * size}
      height={icon.H * size}
      viewBox={`0 0 ${icon.W} ${icon.H}`}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {icon.rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width="1" height="1" fill={r.fill} />
      ))}
    </svg>
  );
}
