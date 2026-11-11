import type { DiagramKind } from '../lib/services';

/**
 * The lash map — the one ornament of the Lash Map style.
 *
 * A lash artist plans a set as a "map": the lid line, divided into zones, each
 * with a length. These small line drawings use the same language to show what
 * each treatment does: extensions add longer strokes, a lift curls the same
 * strokes, a tint darkens them, a brow map marks start · arch · tail.
 * Drawn in currentColor with hairline strokes — technical, never decorative.
 */
const W = 120;
const H = 60;
const LID_Y = 40;
const LID_RISE = 13;
const X0 = 14;
const X1 = 106;

/** A point on the upper lid at t ∈ [0, 1], and the outward normal there. */
function lid(t: number) {
  const x = X0 + (X1 - X0) * t;
  const y = LID_Y - LID_RISE * Math.sin(Math.PI * t);
  const dx = X1 - X0;
  const dy = -LID_RISE * Math.PI * Math.cos(Math.PI * t);
  const len = Math.hypot(dx, dy);
  // Normal pointing up, fanned slightly outward towards the outer corner (right).
  let nx = dy / len;
  let ny = -dx / len;
  nx += (t - 0.35) * 0.55;
  const n = Math.hypot(nx, ny);
  nx /= n;
  ny /= n;
  return { x, y, nx, ny };
}

const LID_PATH = (() => {
  const pts = Array.from({ length: 25 }, (_, i) => lid(i / 24));
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
})();

const COUNT = 15;
/** A classic map: shorter at the inner corner, longest just past centre, easing off at the tail. */
const MAP = (t: number) => 9 + 6 * Math.sin(Math.PI * Math.min(1, t * 1.15));

function strokes(lengthAt: (t: number) => number, curl = 0) {
  return Array.from({ length: COUNT }, (_, i) => {
    const t = 0.04 + (0.92 * i) / (COUNT - 1);
    const p = lid(t);
    const l = lengthAt(t);
    const ex = p.x + p.nx * l;
    const ey = p.y + p.ny * l;
    if (!curl) return `M${p.x.toFixed(2)} ${p.y.toFixed(2)} L${ex.toFixed(2)} ${ey.toFixed(2)}`;
    // A lift: the same length, bent upward from the root.
    const cx = p.x + p.nx * l * 0.35;
    const cy = p.y + p.ny * l * 0.35 - curl;
    const tx = ex - p.nx * l * 0.1 + (t - 0.5) * 2;
    const ty = ey - curl * 0.9;
    return `M${p.x.toFixed(2)} ${p.y.toFixed(2)} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${tx.toFixed(2)} ${ty.toFixed(2)}`;
  }).join(' ');
}

const NATURAL = strokes(() => 6.5);
const EXTENDED = strokes(MAP);
const INFILL = Array.from({ length: COUNT }, (_, i) => i)
  .map((i) => {
    const t = 0.04 + (0.92 * i) / (COUNT - 1);
    const p = lid(t);
    const l = i % 2 ? MAP(t) : 6.5;
    return `M${p.x.toFixed(2)} ${p.y.toFixed(2)} L${(p.x + p.nx * l).toFixed(2)} ${(p.y + p.ny * l).toFixed(2)}`;
  })
  .join(' ');
const LIFTED = strokes(() => 7.5, 3.2);

/** The brow: a soft arch drawn as an outline (upper and lower edge). */
const BROW_TOP = 'M12 40 C 30 24, 62 14, 80 16 C 92 17, 102 24, 108 30';
const BROW_BOTTOM = 'M12 44 C 34 34, 62 26, 80 25 C 92 25, 102 29, 108 30';
/** Brow hairs between the two edges, angled like natural growth (or brushed up for lamination). */
function browHairs(upright: boolean) {
  const out: string[] = [];
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const x = 16 + 88 * t;
    // Approximate the brow's centre line and thickness along its length.
    const yc = 40 - 20 * Math.sin(Math.PI * Math.min(1, t * 0.9)) + (t > 0.75 ? (t - 0.75) * 18 : 0);
    const thick = 7 * (1 - t * 0.75);
    const lean = upright ? 0.4 : 3.4 + t * 2;
    out.push(`M${(x - lean / 2).toFixed(2)} ${(yc + thick / 2).toFixed(2)} L${(x + lean / 2).toFixed(2)} ${(yc - thick / 2).toFixed(2)}`);
  }
  return out.join(' ');
}
const HAIRS = browHairs(false);
const HAIRS_UP = browHairs(true);

function Lashes({ kind }: { kind: DiagramKind }) {
  return (
    <>
      <path d={LID_PATH} className="lm-lid" />
      {kind === 'natural' && <path d={NATURAL} className="lm-lash" />}
      {kind === 'extensions' && (
        <>
          <path d={EXTENDED} className="lm-lash lm-lash--added" />
          {/* The map's zone marks: three lengths along the eye. */}
          <g className="lm-zones" aria-hidden="true">
            {[0.12, 0.5, 0.88].map((t, i) => {
              const p = lid(t);
              return (
                <text key={t} x={p.x} y={58} textAnchor="middle">
                  {['8', '11', '10'][i]}
                </text>
              );
            })}
          </g>
        </>
      )}
      {kind === 'infill' && <path d={INFILL} className="lm-lash lm-lash--added" />}
      {kind === 'lift' && <path d={LIFTED} className="lm-lash" />}
      {kind === 'tint' && <path d={NATURAL} className="lm-lash lm-lash--tinted" />}
    </>
  );
}

function Brow({ kind }: { kind: DiagramKind }) {
  return (
    <>
      {kind === 'brow-shape' && (
        <>
          <path d={`${BROW_TOP} ${BROW_BOTTOM}`} className="lm-lid" />
          <path d={HAIRS} className="lm-hair lm-hair--soft" />
          {/* Start · arch · tail — the three measured points of a brow map. */}
          <path d="M14 8 V56 M78 4 V56 M108 8 V56" className="lm-guide" />
        </>
      )}
      {kind === 'brow-tint' && (
        <>
          <path d={`${BROW_TOP} ${BROW_BOTTOM}`} className="lm-lid" />
          <path d={HAIRS} className="lm-hair lm-hair--tinted" />
        </>
      )}
      {kind === 'brow-lamination' && (
        <>
          <path d={`${BROW_TOP} ${BROW_BOTTOM}`} className="lm-lid lm-lid--faint" />
          <path d={HAIRS_UP} className="lm-hair lm-hair--tinted" />
        </>
      )}
    </>
  );
}

export function LashMapDiagram({ kind, className }: { kind: DiagramKind; className?: string }) {
  const isBrow = kind.startsWith('brow');
  return (
    <svg
      className={`lash-map ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-hidden="true"
      focusable="false"
    >
      {kind === 'combination' ? (
        <>
          <g transform="translate(0 -14) scale(1 0.62)">
            <Brow kind="brow-lamination" />
          </g>
          <g transform="translate(0 18) scale(1 0.7)">
            <Lashes kind="lift" />
          </g>
        </>
      ) : isBrow ? (
        <Brow kind={kind} />
      ) : (
        <Lashes kind={kind} />
      )}
    </svg>
  );
}
