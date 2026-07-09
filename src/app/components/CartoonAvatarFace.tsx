import { useEffect, useRef } from 'react';

export interface CartoonAvatarFaceProps {
  state: 'idle' | 'thinking' | 'speaking' | 'listening';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Memoji-style 3D Cartoon Avatar — Obsidian AI Assistant
 *
 * Fully rendered on Canvas (no external assets) with:
 *  • Warm-skin 3D face (multi-layer radial gradient shading)
 *  • Dark modern hair with specular catchlight
 *  • Large cartoon eyes — iris depth, dual specular, gaze tracking
 *  • Expressive eyebrows (state-driven lift / furrow)
 *  • Soft nostril highlights
 *  • Full lip-sync mouth: open/close with teeth + gloss
 *  • Cheek blush
 *  • Deep Indigo hoodie collar (matches app theme)
 *  • Breathing scale animation
 *  • Gentle head sway / state-based tilt
 *  • Blinking eyes (state-paced)
 *  • Floating thought bubbles (thinking)
 *  • Pulsing sound arcs (listening)
 *  • Speech ripple ring (speaking)
 *  • Responsive sm / md / lg sizing
 */
export function CartoonAvatarFace({ state, size = 'md' }: CartoonAvatarFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const DIM_MAP   = { sm: 72, md: 200, lg: 320 };
  const dim       = DIM_MAP[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = dim * dpr;
    canvas.height = dim * dpr;
    canvas.style.width  = `${dim}px`;
    canvas.style.height = `${dim}px`;
    ctx.scale(dpr, dpr);

    // ── Color system ──────────────────────────────────────────────────
    const SK = {                       // Skin
      hi:  '#FDECD8', lit: '#F9D8BE',
      bas: '#F0BB9A', mid: '#DFA07C',
      shd: '#C47A50', dep: '#9E5828',
    };
    const HAIR = { d: '#0D0C26', m: '#1C1A3A', h: '#2C2A52' };

    const STATE_ACC = {
      idle:      { p: '#00D9FF', glow: 'rgba(0,217,255,0.22)',    iT: '#1866E8', iB: '#042090', pGlow: false },
      thinking:  { p: '#7C83FD', glow: 'rgba(124,131,253,0.24)', iT: '#4455EE', iB: '#101868', pGlow: true  },
      speaking:  { p: '#00FFEF', glow: 'rgba(0,255,239,0.24)',    iT: '#0080E0', iB: '#002494', pGlow: false },
      listening: { p: '#00D9FF', glow: 'rgba(0,217,255,0.30)',    iT: '#0070D8', iB: '#001898', pGlow: false },
    };
    const A = STATE_ACC[state];

    // ── Base proportions ──────────────────────────────────────────────
    const cx = dim * 0.50;
    const cy = dim * 0.44;
    const hw = dim * 0.282;
    const hh = dim * 0.330;

    // ── Animation state ───────────────────────────────────────────────
    let frame = 0, animId = 0;
    let blinkTimer = 0, isBlinking = false, blinkProg = 0;

    // ── Face ellipse path helper ──────────────────────────────────────
    function facePath(fcx: number, fcy: number) {
      ctx.beginPath();
      ctx.ellipse(fcx, fcy, hw, hh, 0, 0, Math.PI * 2);
    }

    // ── Background glow ───────────────────────────────────────────────
    function drawBg(t: number) {
      const p = 0.70 + Math.sin(t * 0.012) * 0.24;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, dim * 0.56);
      g.addColorStop(0,   A.p + Math.floor(p * 42).toString(16).padStart(2, '0'));
      g.addColorStop(0.5, A.p + '0E');
      g.addColorStop(1,   'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, dim, dim);
    }

    // ── Hoodie / Shoulders ────────────────────────────────────────────
    function drawHoodie(fcx: number, fcy: number) {
      if (dim < 100) return;
      const sy  = fcy + hh * 0.90;
      const sw  = hw * 2.3;

      const g = ctx.createLinearGradient(fcx, sy, fcx, dim + 20);
      g.addColorStop(0,   '#1a1840');
      g.addColorStop(0.4, '#1E1B4B');
      g.addColorStop(1,   '#100E28');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(fcx - hw * 0.46, sy);
      ctx.lineTo(fcx + hw * 0.46, sy);
      ctx.lineTo(fcx + sw, dim + 20);
      ctx.lineTo(fcx - sw, dim + 20);
      ctx.closePath();
      ctx.fill();

      // Collar arc
      ctx.strokeStyle = '#2D2B7F';
      ctx.lineWidth   = dim * 0.020;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(fcx - hw * 0.53, sy + dim * 0.010);
      ctx.quadraticCurveTo(fcx, sy + dim * 0.065, fcx + hw * 0.53, sy + dim * 0.010);
      ctx.stroke();

      // Collar cyan accent glow
      ctx.strokeStyle = A.p + '38';
      ctx.lineWidth   = dim * 0.006;
      ctx.beginPath();
      ctx.moveTo(fcx - hw * 0.48, sy + dim * 0.006);
      ctx.quadraticCurveTo(fcx, sy + dim * 0.050, fcx + hw * 0.48, sy + dim * 0.006);
      ctx.stroke();
    }

    // ── Neck ─────────────────────────────────────────────────────────
    function drawNeck(fcx: number, fcy: number) {
      if (dim < 100) return;
      const nT = fcy + hh * 0.83;
      const nB = fcy + hh * 1.05;
      const nW = hw  * 0.25;

      const g = ctx.createLinearGradient(fcx - nW, nT, fcx + nW, nT);
      g.addColorStop(0,    SK.shd);
      g.addColorStop(0.28, SK.mid);
      g.addColorStop(0.55, SK.bas);
      g.addColorStop(0.78, SK.mid);
      g.addColorStop(1,    SK.shd);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(fcx - nW * 0.80, nT);
      ctx.lineTo(fcx + nW * 0.80, nT);
      ctx.lineTo(fcx + nW, nB);
      ctx.lineTo(fcx - nW, nB);
      ctx.closePath();
      ctx.fill();
    }

    // ── Ears ─────────────────────────────────────────────────────────
    function drawEars(fcx: number, fcy: number) {
      const eY  = fcy - hh * 0.03;
      const eWx = hw  * 0.135;
      const eWy = hh  * 0.21;

      [-1, 1].forEach(side => {
        const ex = fcx + side * hw * 0.96;
        const g  = ctx.createRadialGradient(ex - side * eWx * 0.2, eY - eWy * 0.1, 0, ex, eY, eWx * 1.4);
        g.addColorStop(0,   SK.lit);
        g.addColorStop(0.5, SK.bas);
        g.addColorStop(1,   SK.shd);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(ex, eY, eWx, eWy, 0, 0, Math.PI * 2);
        ctx.fill();
        // Inner hollow
        ctx.fillStyle = SK.dep + 'B0';
        ctx.beginPath();
        ctx.ellipse(ex, eY + eWy * 0.06, eWx * 0.46, eWy * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ── Face base with 3D shading ─────────────────────────────────────
    function drawFaceBase(fcx: number, fcy: number) {
      const lx = fcx - hw * 0.22;
      const ly = fcy - hh * 0.28;

      // Primary skin gradient (light from upper-left)
      const sg = ctx.createRadialGradient(lx, ly, 0, fcx, fcy, hw * 1.55);
      sg.addColorStop(0,    SK.hi);
      sg.addColorStop(0.16, SK.lit);
      sg.addColorStop(0.44, SK.bas);
      sg.addColorStop(0.72, SK.mid);
      sg.addColorStop(1,    SK.shd);
      ctx.fillStyle = sg;
      facePath(fcx, fcy);
      ctx.fill();

      // Depth layers (clipped to face)
      ctx.save();
      facePath(fcx, fcy);
      ctx.clip();

      // Side darkening (3D roundness)
      const side = ctx.createLinearGradient(fcx - hw, fcy, fcx + hw, fcy);
      side.addColorStop(0,    'rgba(110,45,8,0.40)');
      side.addColorStop(0.22, 'rgba(0,0,0,0)');
      side.addColorStop(0.78, 'rgba(0,0,0,0)');
      side.addColorStop(1,    'rgba(110,45,8,0.40)');
      ctx.fillStyle = side;
      ctx.fillRect(fcx - hw, fcy - hh, hw * 2, hh * 2);

      // Forehead upper shadow
      const fhg = ctx.createLinearGradient(0, fcy - hh, 0, fcy - hh * 0.42);
      fhg.addColorStop(0, 'rgba(0,0,0,0.10)');
      fhg.addColorStop(1, 'transparent');
      ctx.fillStyle = fhg;
      ctx.fillRect(fcx - hw, fcy - hh, hw * 2, hh * 0.58);

      // Chin shadow
      const chn = ctx.createLinearGradient(0, fcy + hh * 0.5, 0, fcy + hh);
      chn.addColorStop(0, 'transparent');
      chn.addColorStop(1, 'rgba(80,25,0,0.30)');
      ctx.fillStyle = chn;
      ctx.fillRect(fcx - hw, fcy + hh * 0.5, hw * 2, hh * 0.5);

      ctx.restore();

      // Subtle face outline
      ctx.strokeStyle = SK.shd + '55';
      ctx.lineWidth   = Math.max(dim * 0.005, 0.5);
      facePath(fcx, fcy);
      ctx.stroke();
    }

    // ── Hair ─────────────────────────────────────────────────────────
    function drawHair(fcx: number, fcy: number) {
      const g = ctx.createRadialGradient(
        fcx - hw * 0.10, fcy - hh * 0.72, hw * 0.08,
        fcx, fcy - hh * 0.55, hw * 1.25
      );
      g.addColorStop(0,   HAIR.h);
      g.addColorStop(0.4, HAIR.m);
      g.addColorStop(1,   HAIR.d);
      ctx.fillStyle = g;

      ctx.beginPath();
      // Left base
      ctx.moveTo(fcx - hw * 0.95, fcy - hh * 0.34);
      // Up left
      ctx.bezierCurveTo(
        fcx - hw * 1.04, fcy - hh * 0.64,
        fcx - hw * 0.82, fcy - hh * 1.10,
        fcx - hw * 0.08, fcy - hh * 1.14
      );
      // Across top
      ctx.bezierCurveTo(
        fcx + hw * 0.20, fcy - hh * 1.16,
        fcx + hw * 0.58, fcy - hh * 1.07,
        fcx + hw * 0.90, fcy - hh * 0.58
      );
      // Down right
      ctx.bezierCurveTo(
        fcx + hw * 0.98, fcy - hh * 0.38,
        fcx + hw * 0.90, fcy - hh * 0.24,
        fcx + hw * 0.82, fcy - hh * 0.30
      );
      // Back up inner right
      ctx.bezierCurveTo(
        fcx + hw * 0.72, fcy - hh * 0.82,
        fcx + hw * 0.28, fcy - hh * 1.00,
        fcx - hw * 0.06, fcy - hh * 0.96
      );
      // Inner left back
      ctx.bezierCurveTo(
        fcx - hw * 0.74, fcy - hh * 0.94,
        fcx - hw * 0.88, fcy - hh * 0.62,
        fcx - hw * 0.86, fcy - hh * 0.32
      );
      ctx.closePath();
      ctx.fill();

      // Hair specular catchlight
      const hs = ctx.createRadialGradient(
        fcx - hw * 0.08, fcy - hh * 0.84, 0,
        fcx - hw * 0.08, fcy - hh * 0.72, hw * 0.40
      );
      hs.addColorStop(0,   'rgba(90,80,145,0.55)');
      hs.addColorStop(0.5, 'rgba(65,60,118,0.18)');
      hs.addColorStop(1,   'transparent');
      ctx.fillStyle = hs;
      ctx.beginPath();
      ctx.ellipse(fcx - hw * 0.08, fcy - hh * 0.84, hw * 0.34, hh * 0.13, -0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Cheek blush ───────────────────────────────────────────────────
    function drawBlush(fcx: number, fcy: number) {
      const by = fcy + hh * 0.10;
      [-1, 1].forEach(side => {
        const bx = fcx + side * hw * 0.60;
        const g  = ctx.createRadialGradient(bx, by, 0, bx, by, hw * 0.27);
        g.addColorStop(0,   'rgba(245,120,88,0.24)');
        g.addColorStop(0.6, 'rgba(240,100,70,0.08)');
        g.addColorStop(1,   'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(bx, by, hw * 0.25, hh * 0.115, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ── Eyes ─────────────────────────────────────────────────────────
    function drawEyes(fcx: number, fcy: number, t: number) {
      const eY0  = fcy - hh * 0.145;
      const eXO  = hw  * 0.440;
      const erx  = hw  * 0.182;
      const ery0 = erx * 0.620;

      // Blink + state-open multiplier
      const blinkF = isBlinking ? Math.max(0.04, 1 - blinkProg / 5) : 1.0;
      const openM  = state === 'listening' ? 1.12 : state === 'thinking' ? 0.84 : 1.0;
      const ery    = ery0 * blinkF * openM;

      // Gaze offset
      let gx = Math.sin(t * 0.0008) * erx * 0.14;
      let gy = Math.cos(t * 0.0012) * ery0 * 0.11;
      if (state === 'thinking') { gx = erx * 0.19; gy = -ery0 * 0.24; }

      [-1, 1].forEach(side => {
        const ex  = fcx + side * eXO;
        const ey  = eY0;
        const eryC = Math.max(ery, 0.5);

        ctx.save();

        // Socket shadow (beneath eye)
        const sockG = ctx.createRadialGradient(ex, ey, 0, ex, ey, erx * 1.35);
        sockG.addColorStop(0, 'rgba(50,20,8,0.12)');
        sockG.addColorStop(1, 'transparent');
        ctx.fillStyle = sockG;
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx * 1.35, ery0 * 1.45 * openM, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sclera (white)
        const scl = ctx.createRadialGradient(ex - erx * 0.22, ey - ery0 * 0.30, 0, ex, ey, erx * 1.05);
        scl.addColorStop(0, '#FFFFFF');
        scl.addColorStop(0.7, '#F2F5FF');
        scl.addColorStop(1,   '#D8DDEF');
        ctx.fillStyle = scl;
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx, eryC, 0, 0, Math.PI * 2);
        ctx.fill();

        // Upper lid shadow on sclera
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx, eryC, 0, 0, Math.PI * 2);
        ctx.clip();
        const lidSh = ctx.createLinearGradient(0, ey - eryC, 0, ey);
        lidSh.addColorStop(0, 'rgba(20,10,45,0.22)');
        lidSh.addColorStop(1, 'transparent');
        ctx.fillStyle = lidSh;
        ctx.fillRect(ex - erx, ey - eryC, erx * 2, eryC);
        ctx.restore();

        // Iris (clipped to sclera)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx, eryC, 0, 0, Math.PI * 2);
        ctx.clip();

        const iR  = erx * 0.68;
        const irG = ctx.createRadialGradient(
          ex + gx - iR * 0.20, ey + gy - iR * 0.24, 0,
          ex + gx, ey + gy, iR
        );
        irG.addColorStop(0,   A.iT);
        irG.addColorStop(0.55, A.iB);
        irG.addColorStop(1,   '#020112');
        ctx.fillStyle = irG;
        ctx.beginPath();
        ctx.arc(ex + gx, ey + gy, iR, 0, Math.PI * 2);
        ctx.fill();

        // Iris ring detail
        ctx.strokeStyle = A.p + '48';
        ctx.lineWidth   = erx * 0.09;
        ctx.beginPath();
        ctx.arc(ex + gx, ey + gy, iR * 0.76, 0, Math.PI * 2);
        ctx.stroke();

        // Pupil
        if (A.pGlow) {
          ctx.shadowBlur  = 10;
          ctx.shadowColor = A.p;
        }
        ctx.fillStyle = '#030112';
        ctx.beginPath();
        ctx.arc(ex + gx, ey + gy, iR * 0.37, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // State iris glow
        if (state !== 'idle') {
          ctx.fillStyle   = A.p + '30';
          ctx.shadowBlur  = 8;
          ctx.shadowColor = A.p;
          ctx.beginPath();
          ctx.arc(ex + gx, ey + gy, iR * 0.62, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Specular 1 — large soft (Pixar style)
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.beginPath();
        ctx.ellipse(
          ex + gx - iR * 0.26, ey + gy - iR * 0.24,
          iR * 0.22, iR * 0.17,
          -0.45, 0, Math.PI * 2
        );
        ctx.fill();

        // Specular 2 — small sharp
        ctx.fillStyle = 'rgba(255,255,255,0.60)';
        ctx.beginPath();
        ctx.arc(ex + gx + iR * 0.16, ey + gy + iR * 0.18, iR * 0.09, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // iris clip

        // Upper eyelid stroke
        ctx.strokeStyle = HAIR.d + 'E0';
        ctx.lineWidth   = Math.max(dim * 0.012, 1.2);
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx, eryC, 0, Math.PI, 0);
        ctx.stroke();

        // Lower eyelid stroke
        ctx.strokeStyle = SK.shd + '70';
        ctx.lineWidth   = Math.max(dim * 0.007, 0.8);
        ctx.beginPath();
        ctx.ellipse(ex, ey, erx * 0.90, Math.max(ery * 0.80, 0.4), 0, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
      });
    }

    // ── Eyebrows ─────────────────────────────────────────────────────
    function drawEyebrows(fcx: number, fcy: number, t: number) {
      const bW   = hw  * 0.340;
      const bXO  = hw  * 0.440;
      const bThk = Math.max(dim * 0.014, 1.0);
      const bY   = fcy - hh * 0.325;

      ctx.save();
      ctx.lineCap = 'round';

      [-1, 1].forEach(side => {
        const bx = fcx + side * bXO;
        let lift = 0;
        if (state === 'thinking')  lift = -hh * 0.044;
        if (state === 'listening') lift = -hh * 0.027;
        const sway = Math.sin(t * 0.007 + (side > 0 ? 0.4 : 0)) * hh * 0.007;
        const liftFinal = lift + sway;

        // Brow shadow
        ctx.strokeStyle = HAIR.d + 'BB';
        ctx.lineWidth   = bThk * 1.25;
        ctx.beginPath();
        ctx.moveTo(bx - side * bW * 0.52, bY + liftFinal + dim * 0.003);
        ctx.quadraticCurveTo(bx, bY - hh * 0.010 + liftFinal + dim * 0.003, bx + side * bW * 0.48, bY + liftFinal + dim * 0.003);
        ctx.stroke();

        // Brow main
        ctx.strokeStyle = HAIR.m;
        ctx.lineWidth   = bThk;
        ctx.beginPath();
        ctx.moveTo(bx - side * bW * 0.52, bY + liftFinal);
        ctx.quadraticCurveTo(bx, bY - hh * 0.010 + liftFinal, bx + side * bW * 0.48, bY + liftFinal);
        ctx.stroke();

        // Brow highlight
        ctx.strokeStyle = HAIR.h + '58';
        ctx.lineWidth   = bThk * 0.35;
        ctx.beginPath();
        ctx.moveTo(bx - side * bW * 0.46, bY + liftFinal - dim * 0.003);
        ctx.quadraticCurveTo(bx, bY - hh * 0.008 + liftFinal - dim * 0.003, bx + side * bW * 0.44, bY + liftFinal - dim * 0.003);
        ctx.stroke();
      });

      ctx.restore();
    }

    // ── Nose ─────────────────────────────────────────────────────────
    function drawNose(fcx: number, fcy: number) {
      if (dim < 90) return;
      const ny = fcy + hh * 0.065;
      const nW = hw  * 0.098;
      const nH = hh  * 0.150;

      ctx.save();

      // Bridge highlight line
      ctx.strokeStyle = SK.hi + '58';
      ctx.lineWidth   = dim * 0.007;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(fcx, ny - nH * 0.38);
      ctx.lineTo(fcx, ny + nH * 0.26);
      ctx.stroke();

      // Nostril shadows
      [-1, 1].forEach(side => {
        const ng = ctx.createRadialGradient(
          fcx + side * nW, ny + nH * 0.36, 0,
          fcx + side * nW, ny + nH * 0.36, nW * 0.90
        );
        ng.addColorStop(0, 'rgba(130,55,22,0.32)');
        ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.ellipse(fcx + side * nW, ny + nH * 0.36, nW * 0.85, nW * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Nose tip highlight
      const nth = ctx.createRadialGradient(fcx, ny + nH * 0.09, 0, fcx, ny + nH * 0.09, nW * 0.88);
      nth.addColorStop(0, SK.hi + '72');
      nth.addColorStop(1, 'transparent');
      ctx.fillStyle = nth;
      ctx.beginPath();
      ctx.ellipse(fcx, ny + nH * 0.09, nW * 0.78, nW * 0.54, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // ── Mouth ─────────────────────────────────────────────────────────
    function drawMouth(fcx: number, fcy: number, t: number) {
      ctx.save();
      const mY  = fcy + hh * 0.400;
      const mW  = hw  * 0.420;

      let openAmt = 0;
      if (state === 'speaking')  openAmt = Math.abs(Math.sin(t * 0.088)) * 0.86;
      if (state === 'listening') openAmt = 0.11;

      const maxOpen = hh  * 0.155;
      const openPx  = openAmt * maxOpen;

      if (openPx < hh * 0.018) {
        // ── Closed smile ──────────────────────────────────────────────
        const smile = state === 'thinking' ? 0 : hh * 0.024;

        ctx.strokeStyle = SK.shd + 'C8';
        ctx.lineWidth   = Math.max(dim * 0.014, 1.2);
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.moveTo(fcx - mW, mY);
        ctx.quadraticCurveTo(fcx, mY + smile, fcx + mW, mY);
        ctx.stroke();

        // Upper lip line
        ctx.strokeStyle = SK.dep + '60';
        ctx.lineWidth   = Math.max(dim * 0.007, 0.8);
        ctx.beginPath();
        ctx.moveTo(fcx - mW * 0.85, mY - dim * 0.004);
        ctx.quadraticCurveTo(fcx, mY - dim * 0.007 + smile * 0.5, fcx + mW * 0.85, mY - dim * 0.004);
        ctx.stroke();

        // Corner dimples
        ctx.fillStyle = SK.shd + '80';
        [-1, 1].forEach(s => {
          ctx.beginPath();
          ctx.arc(fcx + s * mW, mY + smile * 0.80, dim * 0.008, 0, Math.PI * 2);
          ctx.fill();
        });

      } else {
        // ── Open mouth ────────────────────────────────────────────────
        const upY   = mY - openPx * 0.28;
        const loY   = mY + openPx * 0.72;

        // Interior dark
        const intG = ctx.createRadialGradient(fcx, mY + openPx * 0.15, 0, fcx, mY + openPx * 0.15, mW * 0.82);
        intG.addColorStop(0, '#180404');
        intG.addColorStop(1, '#280606');
        ctx.fillStyle = intG;
        ctx.beginPath();
        ctx.moveTo(fcx - mW, upY);
        ctx.quadraticCurveTo(fcx, upY + openPx * 0.05, fcx + mW, upY);
        ctx.quadraticCurveTo(fcx + mW * 0.50, loY + openPx * 0.16, fcx, loY + openPx * 0.12);
        ctx.quadraticCurveTo(fcx - mW * 0.50, loY + openPx * 0.16, fcx - mW, upY);
        ctx.closePath();
        ctx.fill();

        // Teeth — upper row
        if (openPx > hh * 0.025) {
          ctx.fillStyle = '#F5F2EC';
          ctx.beginPath();
          ctx.moveTo(fcx - mW * 0.75, upY + openPx * 0.10);
          ctx.quadraticCurveTo(fcx, upY + openPx * 0.02, fcx + mW * 0.75, upY + openPx * 0.10);
          ctx.lineTo(fcx + mW * 0.75, upY + openPx * 0.40);
          ctx.quadraticCurveTo(fcx, upY + openPx * 0.36, fcx - mW * 0.75, upY + openPx * 0.40);
          ctx.closePath();
          ctx.fill();

          // Tooth lines
          const numTeeth = 4;
          ctx.strokeStyle = 'rgba(160,100,60,0.15)';
          ctx.lineWidth   = Math.max(dim * 0.005, 0.6);
          for (let ti = 1; ti < numTeeth; ti++) {
            const tx = fcx - mW * 0.75 + (mW * 1.5 / numTeeth) * ti;
            ctx.beginPath();
            ctx.moveTo(tx, upY + openPx * 0.10);
            ctx.lineTo(tx, upY + openPx * 0.38);
            ctx.stroke();
          }
        }

        // Upper lip
        ctx.fillStyle = '#C47060';
        ctx.beginPath();
        ctx.moveTo(fcx - mW, upY);
        ctx.bezierCurveTo(fcx - mW * 0.60, upY - openPx * 0.23, fcx - mW * 0.14, upY - openPx * 0.32, fcx, upY - openPx * 0.32);
        ctx.bezierCurveTo(fcx + mW * 0.14, upY - openPx * 0.32, fcx + mW * 0.60, upY - openPx * 0.23, fcx + mW, upY);
        ctx.quadraticCurveTo(fcx, upY + openPx * 0.24, fcx - mW, upY);
        ctx.closePath();
        ctx.fill();

        // Upper lip highlight
        const ulH = ctx.createLinearGradient(0, upY - openPx * 0.32, 0, upY);
        ulH.addColorStop(0, 'rgba(255,255,255,0.20)');
        ulH.addColorStop(1, 'transparent');
        ctx.fillStyle = ulH;
        ctx.beginPath();
        ctx.moveTo(fcx - mW * 0.68, upY);
        ctx.bezierCurveTo(fcx - mW * 0.38, upY - openPx * 0.23, fcx - mW * 0.12, upY - openPx * 0.32, fcx, upY - openPx * 0.32);
        ctx.bezierCurveTo(fcx + mW * 0.12, upY - openPx * 0.32, fcx + mW * 0.38, upY - openPx * 0.23, fcx + mW * 0.68, upY);
        ctx.closePath();
        ctx.fill();

        // Lower lip
        ctx.fillStyle = '#D4806A';
        ctx.beginPath();
        ctx.moveTo(fcx - mW, upY);
        ctx.quadraticCurveTo(fcx - mW * 0.42, loY + openPx * 0.24, fcx, loY + openPx * 0.30);
        ctx.quadraticCurveTo(fcx + mW * 0.42, loY + openPx * 0.24, fcx + mW, upY);
        ctx.closePath();
        ctx.fill();

        // Lower lip gloss
        const llG = ctx.createRadialGradient(fcx, loY + openPx * 0.08, 0, fcx, loY + openPx * 0.08, mW * 0.38);
        llG.addColorStop(0, 'rgba(255,255,255,0.24)');
        llG.addColorStop(1, 'transparent');
        ctx.fillStyle = llG;
        ctx.beginPath();
        ctx.ellipse(fcx, loY + openPx * 0.08, mW * 0.34, openPx * 0.13, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // ── Face gloss specular ───────────────────────────────────────────
    function drawGloss(fcx: number, fcy: number) {
      const g = ctx.createRadialGradient(
        fcx - hw * 0.20, fcy - hh * 0.30, 0,
        fcx - hw * 0.10, fcy - hh * 0.18, hw * 0.38
      );
      g.addColorStop(0,   'rgba(255,255,255,0.18)');
      g.addColorStop(0.4, 'rgba(255,255,255,0.06)');
      g.addColorStop(1,   'transparent');
      ctx.save();
      facePath(fcx, fcy);
      ctx.clip();
      ctx.fillStyle = g;
      ctx.fillRect(fcx - hw, fcy - hh, hw * 2, hh * 2);
      ctx.restore();
    }

    // ── State-based floating effects ──────────────────────────────────
    function drawStateEffects(fcx: number, fcy: number, t: number) {
      if (dim < 100) return;

      // Thinking — floating thought dots
      if (state === 'thinking') {
        const dots = [
          { ox: -hw * 0.22, oy: -hh * 1.12, r: dim * 0.018, ph: 0.0 },
          { ox:  hw * 0.03, oy: -hh * 1.32, r: dim * 0.026, ph: 0.9 },
          { ox:  hw * 0.26, oy: -hh * 1.20, r: dim * 0.016, ph: 1.7 },
        ];
        dots.forEach(d => {
          const p = 0.55 + Math.sin(t * 0.038 + d.ph) * 0.38;
          ctx.save();
          ctx.globalAlpha = p * 0.78;
          ctx.fillStyle   = A.p;
          ctx.shadowBlur  = 14;
          ctx.shadowColor = A.p;
          ctx.beginPath();
          ctx.arc(
            fcx + d.ox,
            fcy + d.oy + Math.sin(t * 0.023 + d.ph) * hh * 0.04,
            d.r * (0.84 + p * 0.16),
            0, Math.PI * 2
          );
          ctx.fill();
          ctx.restore();
        });
      }

      // Listening — expanding sound-wave arcs
      if (state === 'listening') {
        for (let i = 0; i < 3; i++) {
          const prog  = ((t * 0.020 + i * 0.333) % 1.0);
          const rBase = hw * 0.24 + hw * 0.56 * prog;
          const alpha = (1 - prog) * 0.40;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = A.p;
          ctx.lineWidth   = 1.8;
          ctx.shadowBlur  = 8;
          ctx.shadowColor = A.p;
          // Left arc
          ctx.beginPath();
          ctx.arc(fcx - hw * 1.02, fcy, rBase * 0.48, -0.68, 0.68);
          ctx.stroke();
          // Right arc
          ctx.beginPath();
          ctx.arc(fcx + hw * 1.02, fcy, rBase * 0.48, Math.PI - 0.68, Math.PI + 0.68);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Speaking — ripple ring below mouth
      if (state === 'speaking') {
        const rProg = ((t * 0.017) % 1.0);
        const rR    = hw * 0.18 + hw * 0.55 * rProg;
        const rAlpha = (1 - rProg) * 0.32;
        ctx.save();
        ctx.globalAlpha = rAlpha;
        ctx.strokeStyle = A.p;
        ctx.lineWidth   = 1.8;
        ctx.shadowBlur  = 7;
        ctx.shadowColor = A.p;
        ctx.beginPath();
        ctx.arc(fcx, fcy + hh * 0.60, rR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // ── MAIN RENDER LOOP ───────────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, dim, dim);
      frame++;

      // Blink logic
      blinkTimer++;
      const blinkInterval = state === 'speaking' ? 140 : 195;
      if (blinkTimer > blinkInterval && !isBlinking) {
        isBlinking = true; blinkProg = 0; blinkTimer = 0;
      }
      if (isBlinking) {
        blinkProg++;
        if (blinkProg >= 10) { isBlinking = false; blinkProg = 0; }
      }

      // Breathing + head sway
      const breath = Math.sin(frame * 0.006) * 0.013;
      const swayX  = Math.sin(frame * 0.0045) * dim * 0.007;
      const swayY  = Math.cos(frame * 0.0062) * dim * 0.005;

      let stateOffX = 0, stateOffY = 0;
      if (state === 'listening') stateOffY = dim * 0.010;
      if (state === 'thinking')  stateOffX = dim * 0.008;

      const fcx = cx + swayX + stateOffX;
      const fcy = cy + swayY + stateOffY;

      // Background glow (outside breathing scale)
      drawBg(frame);

      // Apply breathing scale centered on canvas center
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + breath, 1 + breath);
      ctx.translate(-cx, -cy);

      drawHoodie(fcx, fcy);
      drawNeck(fcx, fcy);
      drawEars(fcx, fcy);
      drawFaceBase(fcx, fcy);
      drawHair(fcx, fcy);
      drawBlush(fcx, fcy);
      drawEyes(fcx, fcy, frame);
      drawEyebrows(fcx, fcy, frame);
      drawNose(fcx, fcy);
      drawMouth(fcx, fcy, frame);
      drawGloss(fcx, fcy);
      drawStateEffects(fcx, fcy, frame);

      ctx.restore();

      animId = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, dim]);

  const glowColor =
    state === 'listening' ? 'rgba(0,217,255,0.38)' :
    state === 'speaking'  ? 'rgba(0,255,239,0.30)' :
    state === 'thinking'  ? 'rgba(124,131,253,0.28)' :
                            'rgba(0,217,255,0.16)';

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: dim, height: dim }}
    >
      {/* State glow halo */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          animation: state !== 'idle' ? 'pulse 2.5s ease-in-out infinite' : 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: dim, height: dim, display: 'block' }}
      />
    </div>
  );
}
