import { useEffect, useRef } from 'react';

export interface HolographicRobotFaceProps {
  state: 'idle' | 'thinking' | 'speaking' | 'listening';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 3D Holographic Humanoid AI Face — Obsidian AI (Enhanced)
 * Features:
 *  • Metallic + liquid-glass layered skin with realistic 3D shading
 *  • Neon cyan eyes with iris rings, pupil depth, specular highlights, state glow
 *  • Dynamic mouth animations: speaking waveform, listening, thinking, idle
 *  • Detailed circuit etchings with pulsing temple nodes
 *  • Forehead diamond-crystal power core
 *  • Neck column + trapezoid collar with highlight
 *  • Neural particle field with trail glow
 *  • Three rotating dashed HUD rings with orbiting dots
 *  • Simulated 3D rotation with per-state head tilt
 *  • Ear panel structures with state-based glow
 *  • Cheekbone ridge highlights
 *  • Jaw-chin structural lines
 *  • Eyebrow ridge bars
 *  • Responsive sizing: sm/md/lg
 *  • Hinglish / futuristic fintech AI personality
 */
export function HolographicRobotFace({ state, size = 'md' }: HolographicRobotFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const DIM_MAP = { sm: 72, md: 200, lg: 320 };
  const dim = DIM_MAP[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPR for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = dim * dpr;
    canvas.height = dim * dpr;
    canvas.style.width  = `${dim}px`;
    canvas.style.height = `${dim}px`;
    ctx.scale(dpr, dpr);

    // ── Palette per state ──────────────────────────────────────────────
    const PALETTES = {
      idle:      { p: '#00D9FF', s: '#7C83FD', a: '#00FFEF', glow: 'rgba(0,217,255,0.85)',    eyeColor: '#00D9FF', eyeSize: 1.0,  headTilt: 0    },
      thinking:  { p: '#7C83FD', s: '#A78BFA', a: '#00D9FF', glow: 'rgba(124,131,253,0.85)', eyeColor: '#7C83FD', eyeSize: 0.82, headTilt: 0.04 },
      speaking:  { p: '#00FFEF', s: '#00D9FF', a: '#7C83FD', glow: 'rgba(0,255,239,0.90)',   eyeColor: '#00FFEF', eyeSize: 1.12, headTilt: -0.02},
      listening: { p: '#00D9FF', s: '#7C83FD', a: '#A78BFA', glow: 'rgba(0,217,255,0.95)',   eyeColor: '#00D9FF', eyeSize: 1.25, headTilt: 0.06 },
    };

    const pal = PALETTES[state];

    // ── Animation state ────────────────────────────────────────────────
    let frame = 0;
    let animId = 0;
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProg  = 0;

    // ── Particle pool ──────────────────────────────────────────────────
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; col: string; trail: {x:number;y:number}[] };
    const particles: Particle[] = [];

    function spawnParticle(cx: number, cy: number) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = dim * (0.26 + Math.random() * 0.26);
      const speed = 0.22 + Math.random() * 0.5;
      const col   = Math.random() > 0.5 ? pal.p : pal.s;
      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * speed,
        vy: -(0.15 + Math.random() * 0.38),
        life: 1,
        maxLife: 55 + Math.random() * 80,
        r: 0.45 + Math.random() * 1.6,
        col,
        trail: [],
      });
    }

    function renderParticles() {
      particles.forEach((p, i) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();
        p.x  += p.vx;
        p.y  += p.vy;
        p.life -= 1 / p.maxLife;
        if (p.life <= 0) { particles.splice(i, 1); return; }

        // Trail glow
        p.trail.forEach((pt, ti) => {
          ctx.save();
          ctx.globalAlpha = (ti / p.trail.length) * p.life * 0.3;
          ctx.fillStyle   = p.col;
          ctx.shadowBlur  = 3;
          ctx.shadowColor = p.col;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        ctx.save();
        ctx.globalAlpha = p.life * 0.75;
        ctx.fillStyle   = p.col;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // ── Utility: rounded rect ──────────────────────────────────────────
    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }

    // ── Holographic outer rings ────────────────────────────────────────
    function drawRings(cx: number, cy: number, t: number) {
      // Ambient aura
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, dim * 0.52);
      aura.addColorStop(0,   pal.p + '28');
      aura.addColorStop(0.45, pal.s + '12');
      aura.addColorStop(1,   'transparent');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, dim, dim);

      // Three rotating dashed rings with orbiting dots
      const rings = [
        { r: dim * 0.475, w: 1.1, spd: 0.0028, segs: 52, dotR: 2.8 },
        { r: dim * 0.415, w: 0.75, spd: -0.0042, segs: 36, dotR: 2.0 },
        { r: dim * 0.530, w: 0.55, spd:  0.002, segs: 70, dotR: 1.6 },
      ];
      rings.forEach(ring => {
        ctx.save();
        ctx.translate(cx, cy);
        const angle = t * ring.spd;
        ctx.rotate(angle);
        ctx.strokeStyle = pal.p;
        ctx.lineWidth   = ring.w;
        ctx.globalAlpha = 0.25;
        const seg = (Math.PI * 2) / ring.segs;
        for (let i = 0; i < ring.segs; i++) {
          if (i % 3 !== 0) continue;
          ctx.beginPath();
          ctx.arc(0, 0, ring.r, i * seg, i * seg + seg * 0.65);
          ctx.stroke();
        }
        // Orbiting dot
        ctx.globalAlpha = 1;
        ctx.fillStyle   = pal.p;
        ctx.shadowBlur  = 14;
        ctx.shadowColor = pal.glow;
        const mx = Math.cos(angle * 1.5) * ring.r;
        const my = Math.sin(angle * 1.5) * ring.r;
        ctx.beginPath();
        ctx.arc(mx, my, ring.dotR, 0, Math.PI * 2);
        ctx.fill();
        // Second opposite dot (smaller)
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(-mx * 0.8, -my * 0.8, ring.dotR * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // ── Neck & collar ──────────────────────────────────────────────────
    function drawNeck(cx: number, topY: number) {
      const nW = dim * 0.11;
      const nH = dim * 0.10;

      // Neck cylinder with deeper metallic gradient
      const ng = ctx.createLinearGradient(cx - nW, topY, cx + nW, topY);
      ng.addColorStop(0,    '#020508');
      ng.addColorStop(0.22, '#0a1220');
      ng.addColorStop(0.5,  '#162035');
      ng.addColorStop(0.78, '#0a1220');
      ng.addColorStop(1,    '#020508');
      ctx.fillStyle = ng;
      ctx.beginPath();
      roundRect(cx - nW, topY, nW * 2, nH, 3);
      ctx.fill();

      // Neon column lines
      ctx.strokeStyle = pal.p + '60';
      ctx.lineWidth   = 0.7;
      for (let i = -2; i <= 2; i++) {
        const lx = cx + i * (nW / 2.5);
        ctx.beginPath();
        ctx.moveTo(lx, topY + 2);
        ctx.lineTo(lx, topY + nH - 2);
        ctx.stroke();
      }
      // Horizontal band
      ctx.strokeStyle = pal.p + '35';
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - nW + 2, topY + nH * 0.5);
      ctx.lineTo(cx + nW - 2, topY + nH * 0.5);
      ctx.stroke();

      // Collar trapezoid
      const colW = dim * 0.25;
      const colY = topY + nH - 1;
      const colH = dim * 0.055;
      const cg   = ctx.createLinearGradient(cx - colW, colY, cx + colW, colY);
      cg.addColorStop(0,   '#020406');
      cg.addColorStop(0.18,'#0c1828');
      cg.addColorStop(0.5, '#182f48');
      cg.addColorStop(0.82,'#0c1828');
      cg.addColorStop(1,   '#020406');
      ctx.fillStyle   = cg;
      ctx.strokeStyle = pal.p + '50';
      ctx.lineWidth   = 0.9;
      ctx.beginPath();
      ctx.moveTo(cx - nW * 1.1, colY);
      ctx.lineTo(cx + nW * 1.1, colY);
      ctx.lineTo(cx + colW, colY + colH);
      ctx.lineTo(cx - colW, colY + colH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Collar highlight line
      ctx.strokeStyle = pal.p + '38';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(cx - colW * 0.75, colY + colH * 0.38);
      ctx.lineTo(cx + colW * 0.75, colY + colH * 0.38);
      ctx.stroke();

      // Two small data ports on collar
      [-1, 1].forEach(side => {
        const px = cx + side * colW * 0.45;
        const py = colY + colH * 0.62;
        ctx.save();
        ctx.fillStyle   = pal.p + '55';
        ctx.shadowBlur  = 4;
        ctx.shadowColor = pal.glow;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // ── Ear panel structures ───────────────────────────────────────────
    function drawEarPanels(cx: number, cy: number, hw: number, hh: number, t: number) {
      const earPulse = state === 'listening'
        ? 0.7 + Math.sin(t * 0.09) * 0.28
        : 0.25 + Math.sin(t * 0.018) * 0.1;

      [-1, 1].forEach(side => {
        const ex = cx + side * (hw * 0.96);
        const ey = cy - hh * 0.04;
        const ew = hw * 0.10;
        const eh = hh * 0.30;

        // Ear outer plate
        const eg = ctx.createLinearGradient(ex - ew * side, ey - eh * 0.5, ex + ew * side, ey + eh * 0.5);
        eg.addColorStop(0,   '#050d1a');
        eg.addColorStop(0.5, '#0e1e30');
        eg.addColorStop(1,   '#050d1a');
        ctx.save();
        ctx.fillStyle   = eg;
        ctx.strokeStyle = pal.p + Math.floor(earPulse * 80).toString(16).padStart(2, '0');
        ctx.lineWidth   = 0.8;
        ctx.shadowBlur  = state === 'listening' ? 12 * earPulse : 4;
        ctx.shadowColor = pal.glow;
        ctx.beginPath();
        roundRect(ex - ew * 0.5, ey - eh * 0.5, ew, eh, 3);
        ctx.fill();
        ctx.stroke();

        // Ear slot lines
        ctx.strokeStyle = pal.p + Math.floor(earPulse * 100).toString(16).padStart(2, '0');
        ctx.lineWidth   = 0.5;
        ctx.shadowBlur  = 3;
        for (let li = -1; li <= 1; li++) {
          ctx.beginPath();
          ctx.moveTo(ex - ew * 0.3, ey + li * eh * 0.25);
          ctx.lineTo(ex + ew * 0.3, ey + li * eh * 0.25);
          ctx.stroke();
        }

        // Central ear node
        ctx.fillStyle   = pal.p + Math.floor(earPulse * 200).toString(16).padStart(2, '0');
        ctx.shadowBlur  = 8 * earPulse;
        ctx.shadowColor = pal.glow;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // ── Circuit etchings ───────────────────────────────────────────────
    function drawCircuits(cx: number, cy: number, hw: number, hh: number, t: number) {
      ctx.save();
      ctx.strokeStyle = pal.p;
      ctx.lineWidth   = 0.65;
      ctx.globalAlpha = 0.24;

      // Forehead left/right branches
      const fY = cy - hh * 0.50;
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(cx + side * hw * 0.13, fY + hh * 0.08);
        ctx.lineTo(cx + side * hw * 0.28, fY + hh * 0.08);
        ctx.lineTo(cx + side * hw * 0.38, fY + hh * 0.02);
        ctx.lineTo(cx + side * hw * 0.54, fY + hh * 0.02);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + side * hw * 0.38, fY + hh * 0.02);
        ctx.lineTo(cx + side * hw * 0.38, fY - hh * 0.045);
        ctx.stroke();
        // Extra branch
        ctx.beginPath();
        ctx.moveTo(cx + side * hw * 0.54, fY + hh * 0.02);
        ctx.lineTo(cx + side * hw * 0.60, fY - hh * 0.02);
        ctx.stroke();
      });

      // Cheekbone circuits
      const ckY = cy + hh * 0.13;
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(cx + side * hw * 0.52, ckY);
        ctx.lineTo(cx + side * hw * 0.70, ckY);
        ctx.lineTo(cx + side * hw * 0.70, ckY + hh * 0.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + side * hw * 0.58, ckY + hh * 0.09);
        ctx.lineTo(cx + side * hw * 0.70, ckY + hh * 0.09);
        ctx.stroke();
        // Extra micro circuit
        ctx.beginPath();
        ctx.moveTo(cx + side * hw * 0.70, ckY + hh * 0.15);
        ctx.lineTo(cx + side * hw * 0.76, ckY + hh * 0.15);
        ctx.stroke();
      });

      // Jaw detail line
      const jY = cy + hh * 0.48;
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.32, jY);
      ctx.lineTo(cx - hw * 0.16, jY + hh * 0.058);
      ctx.lineTo(cx + hw * 0.16, jY + hh * 0.058);
      ctx.lineTo(cx + hw * 0.32, jY);
      ctx.stroke();
      // Center chin node
      ctx.beginPath();
      ctx.moveTo(cx, jY + hh * 0.058);
      ctx.lineTo(cx, jY + hh * 0.095);
      ctx.stroke();

      // Pulsing temple nodes
      const pulse = 0.5 + Math.sin(t * 0.035) * 0.38;
      ctx.globalAlpha = pulse * 0.6;
      ctx.fillStyle   = pal.p;
      ctx.shadowBlur  = 9;
      ctx.shadowColor = pal.glow;
      [-1, 1].forEach(side => {
        [-0.11, 0.13].forEach(dy => {
          ctx.beginPath();
          ctx.arc(cx + side * hw * 0.70, cy + dy * hh, 1.9, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      ctx.restore();
    }

    // ── Eyebrow ridges ────────────────────────────────────────────────
    function drawEyebrows(cx: number, cy: number, hw: number, hh: number, t: number) {
      ctx.save();
      const browY   = cy - hh * 0.28;
      const browPulse = state === 'thinking'
        ? 0.6 + Math.sin(t * 0.04) * 0.35
        : state === 'listening' ? 0.8 : 0.45;

      ctx.strokeStyle = pal.p + Math.floor(browPulse * 180).toString(16).padStart(2, '0');
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 6 * browPulse;
      ctx.shadowColor = pal.glow;
      ctx.lineCap     = 'round';

      [-1, 1].forEach(side => {
        const ex = cx + side * hw * 0.36;
        // Brow bar — angled inward based on state
        const innerLift = state === 'thinking' ? hh * 0.025 : state === 'listening' ? -hh * 0.018 : 0;
        ctx.beginPath();
        ctx.moveTo(ex - side * hw * 0.18, browY + innerLift);
        ctx.lineTo(ex + side * hw * 0.08, browY);
        ctx.stroke();

        // Brow inner end node
        ctx.fillStyle  = pal.p;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ex - side * hw * 0.18, browY + innerLift, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // ── Forehead panel & core crystal ─────────────────────────────────
    function drawForeheadPanel(cx: number, cy: number, hw: number, t: number) {
      ctx.save();
      const pulse = 0.58 + Math.sin(t * 0.038) * 0.42;
      const coreW = hw * 0.17;
      const coreH = hw * 0.088;

      // Panel horizontal line
      ctx.strokeStyle = pal.p + '58';
      ctx.lineWidth   = 0.75;
      ctx.globalAlpha = 0.58;
      ctx.beginPath();
      ctx.moveTo(cx - coreW * 1.5, cy);
      ctx.lineTo(cx + coreW * 1.5, cy);
      ctx.stroke();
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(cx + side * coreW * 1.5, cy - coreH * 0.65);
        ctx.lineTo(cx + side * coreW * 1.5, cy + coreH * 0.65);
        ctx.stroke();
      });

      // Core crystal glow halo
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreW * 1.35);
      cg.addColorStop(0,   pal.a + Math.floor(pulse * 220).toString(16).padStart(2, '0'));
      cg.addColorStop(0.45, pal.p + '50');
      cg.addColorStop(1,   'transparent');
      ctx.fillStyle   = cg;
      ctx.shadowBlur  = 18 * pulse;
      ctx.shadowColor = pal.glow;
      ctx.globalAlpha = 1;
      ctx.fillRect(cx - coreW * 1.3, cy - coreH, coreW * 2.6, coreH * 2);

      // Diamond crystal
      ctx.fillStyle   = pal.a + Math.floor(pulse * 180).toString(16).padStart(2, '0');
      ctx.strokeStyle = pal.a + '90';
      ctx.lineWidth   = 0.8;
      ctx.shadowBlur  = 20 * pulse;
      ctx.beginPath();
      ctx.moveTo(cx,          cy - coreH * 0.78);
      ctx.lineTo(cx + coreW,  cy);
      ctx.lineTo(cx,          cy + coreH * 0.78);
      ctx.lineTo(cx - coreW,  cy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner crystal facets
      ctx.globalAlpha = pulse * 0.55;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - coreH * 0.5);
      ctx.lineTo(cx, cy + coreH * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - coreW * 0.6, cy);
      ctx.lineTo(cx + coreW * 0.6, cy);
      ctx.stroke();

      ctx.restore();
    }

    // ── Eyes ──────────────────────────────────────────────────────────
    function drawEyes(cx: number, cy: number, hw: number, _hh: number, t: number) {
      const spacing  = hw * 0.365;
      const eyeW     = hw * 0.20 * pal.eyeSize;
      const eyeH_max = eyeW * 0.40;

      const blinkFactor = isBlinking ? Math.max(0, 1 - blinkProg / 5) : 1;
      const eyeH = eyeH_max * blinkFactor;

      // Subtle gaze tracking
      const gazeX = Math.sin(t * 0.0009) * hw * 0.042;
      const gazeY = Math.cos(t * 0.0013) * hw * 0.022;

      let gIntensity = 0.88;
      if (state === 'thinking')  gIntensity = 0.52 + Math.sin(t * 0.05) * 0.30;
      if (state === 'speaking')  gIntensity = 0.68 + Math.abs(Math.sin(t * 0.07)) * 0.28;
      if (state === 'listening') gIntensity = 0.94 + Math.sin(t * 0.09) * 0.05;

      [-1, 1].forEach(side => {
        const ex = cx + side * spacing + gazeX;
        const ey = cy + gazeY;

        ctx.save();

        // Wide diffuse outer glow
        const og = ctx.createRadialGradient(ex, ey, 0, ex, ey, eyeW * 2.8);
        og.addColorStop(0,   pal.eyeColor + Math.floor(gIntensity * 0.55 * 255).toString(16).padStart(2, '0'));
        og.addColorStop(0.45, pal.eyeColor + '28');
        og.addColorStop(1,   'transparent');
        ctx.fillStyle = og;
        ctx.fillRect(ex - eyeW * 3, ey - eyeW * 3, eyeW * 6, eyeW * 6);

        // Eye socket dark recess
        const sock = ctx.createRadialGradient(ex, ey, 0, ex, ey, eyeW * 1.2);
        sock.addColorStop(0,   'rgba(0,3,12,0.95)');
        sock.addColorStop(0.6, 'rgba(0,3,12,0.60)');
        sock.addColorStop(1,   'transparent');
        ctx.fillStyle = sock;
        ctx.beginPath();
        ctx.ellipse(ex, ey, eyeW * 1.2, Math.max(eyeH * 2.0, eyeW * 0.20), 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyelid metallic rim
        ctx.strokeStyle = pal.eyeColor + '88';
        ctx.lineWidth   = 1.2;
        ctx.shadowBlur  = 4;
        ctx.shadowColor = pal.eyeColor;
        ctx.beginPath();
        ctx.ellipse(ex, ey, eyeW, Math.max(eyeH * 1.6, eyeW * 0.14), 0, 0, Math.PI * 2);
        ctx.stroke();

        // Iris outer ring
        ctx.shadowBlur  = 20 * gIntensity;
        ctx.shadowColor = pal.eyeColor;
        ctx.strokeStyle = pal.eyeColor + Math.floor(gIntensity * 0.6 * 255).toString(16).padStart(2, '0');
        ctx.lineWidth   = eyeW * 0.08;
        ctx.beginPath();
        ctx.ellipse(ex, ey, eyeW * 0.88, eyeH * 0.88, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Iris fill
        ctx.fillStyle   = pal.eyeColor;
        ctx.shadowBlur  = 22 * gIntensity;
        ctx.globalAlpha = gIntensity;
        ctx.beginPath();
        ctx.ellipse(ex, ey, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.fill();

        if (!isBlinking && eyeH > 1) {
          // Pupil dark ring
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = 'rgba(0,2,8,0.85)';
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.ellipse(ex, ey, eyeW * 0.36, eyeH * 0.44, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pupil core white
          ctx.fillStyle   = '#FFFFFF';
          ctx.shadowBlur  = 10;
          ctx.shadowColor = pal.eyeColor;
          ctx.globalAlpha = gIntensity * 0.95;
          ctx.beginPath();
          ctx.ellipse(ex, ey, eyeW * 0.14, eyeH * 0.18, 0, 0, Math.PI * 2);
          ctx.fill();

          // Specular highlight (top-left)
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = '#FFFFFF';
          ctx.globalAlpha = gIntensity * 0.90;
          ctx.beginPath();
          ctx.ellipse(ex - eyeW * 0.30, ey - eyeH * 0.20, eyeW * 0.15, eyeH * 0.24, -0.4, 0, Math.PI * 2);
          ctx.fill();

          // Small secondary specular (bottom-right)
          ctx.globalAlpha = gIntensity * 0.25;
          ctx.beginPath();
          ctx.ellipse(ex + eyeW * 0.22, ey + eyeH * 0.18, eyeW * 0.07, eyeH * 0.09, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    }

    // ── Nose ──────────────────────────────────────────────────────────
    function drawNose(cx: number, cy: number, hw: number, hh: number) {
      ctx.save();
      ctx.strokeStyle = pal.p + '55';
      ctx.lineWidth   = 0.9;
      ctx.globalAlpha = 0.40;
      const noseTopY = cy + hh * 0.04;
      const noseBotY = cy + hh * 0.23;
      // Bridge line
      ctx.beginPath();
      ctx.moveTo(cx, noseTopY);
      ctx.lineTo(cx, noseBotY);
      ctx.stroke();
      // Nostril arcs
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(cx, noseBotY);
        ctx.quadraticCurveTo(
          cx + side * hw * 0.08, noseBotY + hh * 0.055,
          cx + side * hw * 0.105, noseBotY + hh * 0.022
        );
        ctx.stroke();
      });
      // Nose tip dot
      ctx.fillStyle   = pal.p + '55';
      ctx.shadowBlur  = 4;
      ctx.shadowColor = pal.glow;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(cx, noseBotY + hh * 0.01, 1.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ── Mouth ─────────────────────────────────────────────────────────
    function drawMouth(cx: number, cy: number, hw: number, hh: number, t: number) {
      ctx.save();
      const mW   = hw * 0.40;
      const baseY = cy + hh * 0.37;

      ctx.shadowBlur  = 10;
      ctx.shadowColor = pal.glow;
      ctx.strokeStyle = pal.p;
      ctx.lineWidth   = 1.8;
      ctx.lineCap     = 'round';

      if (state === 'speaking') {
        // Organic waveform open/close
        const openAmt = Math.abs(Math.sin(t * 0.088)) * hh * 0.12;
        ctx.globalAlpha = 0.94;

        // Upper lip
        ctx.beginPath();
        ctx.moveTo(cx - mW, baseY);
        ctx.bezierCurveTo(cx - mW * 0.35, baseY - hh * 0.032, cx + mW * 0.35, baseY - hh * 0.032, cx + mW, baseY);
        ctx.stroke();

        // Lower lip
        ctx.beginPath();
        ctx.moveTo(cx - mW, baseY);
        ctx.bezierCurveTo(cx - mW * 0.35, baseY + openAmt, cx + mW * 0.35, baseY + openAmt, cx + mW, baseY);
        ctx.stroke();

        // Waveform teeth glow inside
        if (openAmt > 2.5) {
          const ig = ctx.createRadialGradient(cx, baseY + openAmt * 0.38, 0, cx, baseY + openAmt * 0.38, mW * 0.6);
          ig.addColorStop(0, pal.p + '78');
          ig.addColorStop(0.6, pal.p + '22');
          ig.addColorStop(1, 'transparent');
          ctx.fillStyle   = ig;
          ctx.globalAlpha = 0.60;
          ctx.shadowBlur  = 16;
          ctx.beginPath();
          ctx.ellipse(cx, baseY + openAmt * 0.38, mW * 0.72, openAmt * 0.68, 0, 0, Math.PI * 2);
          ctx.fill();

          // Voice waveform bars
          const barCount = 5;
          ctx.lineWidth   = 1.0;
          ctx.globalAlpha = 0.65;
          for (let bi = 0; bi < barCount; bi++) {
            const bx  = cx + (bi - barCount / 2 + 0.5) * (mW * 0.28);
            const bAmp = Math.abs(Math.sin(t * 0.12 + bi * 0.9)) * openAmt * 0.55;
            ctx.beginPath();
            ctx.moveTo(bx, baseY + openAmt * 0.2);
            ctx.lineTo(bx, baseY + openAmt * 0.2 + bAmp);
            ctx.stroke();
          }
        }

      } else if (state === 'listening') {
        // Attentive slight open
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(cx - mW, baseY);
        ctx.bezierCurveTo(cx - mW * 0.35, baseY - hh * 0.022, cx + mW * 0.35, baseY - hh * 0.022, cx + mW, baseY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - mW * 0.72, baseY);
        ctx.bezierCurveTo(cx - mW * 0.28, baseY + hh * 0.04, cx + mW * 0.28, baseY + hh * 0.04, cx + mW * 0.72, baseY);
        ctx.stroke();

        // Subtle listening glow dots
        const lp = 0.5 + Math.sin(t * 0.085) * 0.4;
        ctx.globalAlpha = lp * 0.55;
        ctx.fillStyle   = pal.p;
        ctx.shadowBlur  = 8;
        [-0.42, 0, 0.42].forEach(rel => {
          ctx.beginPath();
          ctx.arc(cx + rel * mW, baseY + hh * 0.02, 1.4, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (state === 'thinking') {
        // Slight asymmetric pursed + shift
        const shift = Math.sin(t * 0.013) * mW * 0.09;
        ctx.globalAlpha = 0.52;
        ctx.beginPath();
        ctx.moveTo(cx - mW + shift, baseY);
        ctx.quadraticCurveTo(cx + shift, baseY - hh * 0.016, cx + mW + shift, baseY);
        ctx.stroke();
        // Small pinch mark
        ctx.lineWidth   = 0.8;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.arc(cx + shift, baseY, mW * 0.08, 0, Math.PI * 2);
        ctx.stroke();

      } else {
        // Idle: gentle breathing smile
        const breathe = Math.sin(t * 0.006) * 0.04;
        ctx.globalAlpha = 0.44 + breathe;
        ctx.beginPath();
        ctx.moveTo(cx - mW, baseY);
        ctx.quadraticCurveTo(cx, baseY + hh * 0.028, cx + mW, baseY);
        ctx.stroke();
      }

      // Corner dots
      ctx.shadowBlur  = 6;
      ctx.fillStyle   = pal.p;
      ctx.globalAlpha = 0.60;
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.arc(cx + side * mW, baseY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    // ── Cheekbone ridge highlights ─────────────────────────────────────
    function drawCheekboneHighlights(cx: number, cy: number, hw: number, hh: number) {
      ctx.save();
      const ckY = cy - hh * 0.05;
      [-1, 1].forEach(side => {
        const g = ctx.createLinearGradient(
          cx + side * hw * 0.35, ckY,
          cx + side * hw * 0.62, ckY + hh * 0.14
        );
        g.addColorStop(0,   'rgba(255,255,255,0.04)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.09)');
        g.addColorStop(1,   'rgba(255,255,255,0.01)');
        ctx.fillStyle   = g;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.ellipse(
          cx + side * hw * 0.5, ckY + hh * 0.08,
          hw * 0.14, hh * 0.07,
          side * 0.35,
          0, Math.PI * 2
        );
        ctx.fill();
      });
      ctx.restore();
    }

    // ── Metallic head ──────────────────────────────────────────────────
    function drawHead(cx: number, cy: number, t: number) {
      const rotY = Math.sin(t * 0.0012) * 0.10 + pal.headTilt;
      const rotX = Math.cos(t * 0.0009) * 0.05;

      const pX = rotY * dim * 0.14;
      const pY = rotX * dim * 0.07;

      const hw  = dim * 0.31;
      const hh  = dim * 0.385;
      const hCY = cy - dim * 0.03;

      const fcx = cx  + pX * 0.55;
      const fcy = hCY + pY * 0.55;

      // ── NECK/COLLAR ──────────────────────────────────────────────
      drawNeck(cx + pX * 0.25, hCY + hh * 0.80);

      // ── AMBIENT OUTER GLOW ───────────────────────────────────────
      const ambG = ctx.createRadialGradient(fcx, fcy - hh * 0.1, 0, fcx, fcy, hh * 1.6);
      ambG.addColorStop(0,    pal.p + '20');
      ambG.addColorStop(0.4,  pal.s + '0E');
      ambG.addColorStop(1,    'transparent');
      ctx.fillStyle = ambG;
      ctx.fillRect(cx - hh * 1.85, hCY - hh * 1.85, hh * 3.7, hh * 3.7);

      // ── BASE METALLIC SKIN ───────────────────────────────────────
      const lightX = fcx - hw * 0.28;
      const lightY = fcy - hh * 0.34;
      const skinG  = ctx.createRadialGradient(lightX, lightY, 0, fcx + pX * 0.28, fcy + pY * 0.28, hw * 1.6);
      skinG.addColorStop(0,    '#1e3050');
      skinG.addColorStop(0.16, '#12243c');
      skinG.addColorStop(0.40, '#0b1828');
      skinG.addColorStop(0.62, '#080f1c');
      skinG.addColorStop(0.82, '#04090e');
      skinG.addColorStop(1,    '#020508');

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(fcx, fcy, hw, hh, 0, 0, Math.PI * 2);
      ctx.fillStyle = skinG;
      ctx.fill();

      // ── EDGE RIM GLOW ────────────────────────────────────────────
      ctx.shadowBlur  = 22;
      ctx.shadowColor = pal.glow;
      ctx.strokeStyle = pal.p + '95';
      ctx.lineWidth   = 1.8;
      ctx.stroke();
      ctx.shadowBlur  = 0;
      ctx.restore();

      // ── SIDE DEPTH DARKENING ─────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(fcx, fcy, hw, hh, 0, 0, Math.PI * 2);
      ctx.clip();

      const sideG = ctx.createLinearGradient(fcx - hw, fcy, fcx + hw, fcy);
      sideG.addColorStop(0,    'rgba(0,0,0,0.78)');
      sideG.addColorStop(0.20, 'rgba(0,0,0,0)');
      sideG.addColorStop(0.80, 'rgba(0,0,0,0)');
      sideG.addColorStop(1,    'rgba(0,0,0,0.78)');
      ctx.fillStyle = sideG;
      ctx.fillRect(fcx - hw, fcy - hh, hw * 2, hh * 2);

      const chinG = ctx.createLinearGradient(0, fcy, 0, fcy + hh);
      chinG.addColorStop(0, 'transparent');
      chinG.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = chinG;
      ctx.fillRect(fcx - hw, fcy, hw * 2, hh);
      ctx.restore();

      // ── FACE FEATURES ────────────────────────────────────────────
      drawCircuits(fcx, fcy, hw, hh, t);
      drawForeheadPanel(fcx, fcy - hh * 0.60, hw, t);
      drawEarPanels(fcx, fcy, hw, hh, t);
      drawEyebrows(fcx, fcy, hw, hh, t);
      drawEyes(fcx, fcy - hh * 0.16, hw, hh, t);
      drawNose(fcx, fcy, hw, hh);
      drawMouth(fcx, fcy, hw, hh, t);
      drawCheekboneHighlights(fcx, fcy, hw, hh);

      // ── LIQUID GLASS SPECULAR OVERLAY ────────────────────────────
      const specG = ctx.createRadialGradient(fcx - hw * 0.16, fcy - hh * 0.30, 0, fcx, fcy, hw * 0.95);
      specG.addColorStop(0,    'rgba(255,255,255,0.09)');
      specG.addColorStop(0.30, 'rgba(255,255,255,0.03)');
      specG.addColorStop(1,    'transparent');
      ctx.fillStyle = specG;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(fcx, fcy, hw, hh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── SCAN LINE (active states) ─────────────────────────────────
      if (state !== 'idle') {
        const scanY = ((t * 0.55) % (dim * 1.2)) - dim * 0.08;
        const scanG = ctx.createLinearGradient(0, scanY - 26, 0, scanY + 26);
        scanG.addColorStop(0,   'transparent');
        scanG.addColorStop(0.5, pal.p + '1C');
        scanG.addColorStop(1,   'transparent');
        ctx.fillStyle = scanG;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(fcx, fcy, hw, hh, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillRect(fcx - hw, scanY - 26, hw * 2, 52);
        ctx.restore();
      }

      // ── THINKING: forehead data flicker ──────────────────────────
      if (state === 'thinking') {
        if (Math.random() > 0.86) {
          ctx.save();
          ctx.globalAlpha = 0.38;
          ctx.fillStyle   = pal.s;
          ctx.shadowBlur  = 14;
          ctx.shadowColor = pal.s;
          ctx.beginPath();
          ctx.ellipse(fcx, fcy - hh * 0.62, hw * 0.24, hh * 0.065, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // Matrix-style data rain on forehead
        if (Math.random() > 0.92) {
          ctx.save();
          ctx.font = `${dim * 0.028}px monospace`;
          ctx.fillStyle   = pal.s;
          ctx.globalAlpha = 0.28;
          ctx.shadowBlur  = 5;
          ctx.shadowColor = pal.s;
          const chars = ['0','1','Ω','Σ','∂','∇'];
          const c = chars[Math.floor(Math.random() * chars.length)];
          const rx = fcx + (Math.random() - 0.5) * hw * 1.2;
          const ry = fcy - hh * 0.45 + Math.random() * hh * 0.25;
          ctx.fillText(c, rx, ry);
          ctx.restore();
        }
      }

      // ── LISTENING: ear pulse glow ─────────────────────────────────
      if (state === 'listening') {
        const earPulse = 0.55 + Math.sin(t * 0.09) * 0.42;
        [-1, 1].forEach(side => {
          const eg = ctx.createRadialGradient(fcx + side * hw, fcy, 0, fcx + side * hw, fcy, hw * 0.52);
          eg.addColorStop(0,   pal.p + Math.floor(earPulse * 130).toString(16).padStart(2, '0'));
          eg.addColorStop(1,   'transparent');
          ctx.fillStyle   = eg;
          ctx.globalAlpha = earPulse * 0.65;
          ctx.fillRect(fcx + side * hw - hw * 0.55, fcy - hh * 0.5, hw * 1.1, hh);
          ctx.globalAlpha = 1;
        });
      }

      // ── SPEAKING: energy emanation around face ────────────────────
      if (state === 'speaking') {
        const spk = Math.abs(Math.sin(t * 0.08)) * 0.55;
        if (spk > 0.2) {
          ctx.save();
          ctx.strokeStyle = pal.p + Math.floor(spk * 80).toString(16).padStart(2, '0');
          ctx.lineWidth   = 0.8;
          ctx.shadowBlur  = 12;
          ctx.shadowColor = pal.glow;
          ctx.beginPath();
          ctx.ellipse(fcx, fcy, hw * (1 + spk * 0.06), hh * (1 + spk * 0.04), 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // ── Main render loop ───────────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, dim, dim);
      frame++;

      blinkTimer++;
      const blinkInterval = state === 'speaking' ? 150 : 210;
      if (blinkTimer > blinkInterval && !isBlinking) {
        isBlinking = true; blinkProg = 0; blinkTimer = 0;
      }
      if (isBlinking) {
        blinkProg++;
        if (blinkProg >= 10) { isBlinking = false; blinkProg = 0; }
      }

      const pRate = state === 'idle' ? 4 : state === 'thinking' ? 2 : state === 'listening' ? 1 : 3;
      if (frame % pRate === 0) spawnParticle(dim / 2, dim / 2);

      renderParticles();
      drawRings(dim / 2, dim / 2, frame);
      drawHead(dim / 2, dim / 2, frame);

      animId = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, dim]);

  const wrapGlow =
    state === 'listening' ? 'rgba(0,217,255,0.30)' :
    state === 'speaking'  ? 'rgba(0,255,239,0.25)' :
    state === 'thinking'  ? 'rgba(124,131,253,0.22)' :
                            'rgba(0,217,255,0.12)';

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: dim, height: dim }}
    >
      {/* Background liquid glass layer */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(5,12,26,0.60) 0%, rgba(5,12,26,0.18) 70%, transparent 100%)',
          backdropFilter: 'blur(6px)',
        }}
      />

      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: dim, height: dim, display: 'block' }}
      />

      {/* Outer state glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${wrapGlow} 0%, transparent 68%)`,
          animation: state !== 'idle' ? 'pulse 2.2s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
}
