import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Sparkles, ArrowRight, Brain, Target, TrendingUp,
  Award, Shield, Zap, Users, ChevronDown, Star, CheckCircle,
} from 'lucide-react';
import { HeroCoins3D } from './FloatingCoins3D';

/* ══════════════════════════════════════════════════════════════════════
   ULTRA 3D CANVAS ENGINE
   Layers (bottom → top):
   1. Aurora neon waves
   2. Perspective grid floor
   3. Floating 3D holographic HUD circles
   4. Orbiting 3D coins (₹/$/€/₿)
   5. Depth-sorted wireframe shapes (icosahedron, torus, octahedron)
   6. Star particles
   7. Scan line
══════════════════════════════════════════════════════════════════════ */
function useMegaCanvas(ref: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let animId = 0, frame = 0;
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── 3D projection ── */
    const FOV = 850;
    const prj = (x: number, y: number, z: number): [number, number, number] => {
      const s = FOV / Math.max(1, FOV + z);
      return [x * s + W / 2, y * s + H / 2, s];
    };

    /* ── Rotation helpers ── */
    const rY = (x: number, y: number, z: number, a: number): [number,number,number] =>
      [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
    const rX = (x: number, y: number, z: number, a: number): [number,number,number] =>
      [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];

    /* ════ AURORA WAVES ════════════════════════════════════════════ */
    const AURORA_DEFS = [
      { y: 0.25, amp: 90,  freq: 0.0055, speed: 0.28, r: 0,   g: 217, b: 255, alpha: 0.07 },
      { y: 0.42, amp: 70,  freq: 0.0070, speed: 0.18, r: 124, g: 131, b: 253, alpha: 0.06 },
      { y: 0.60, amp: 100, freq: 0.0045, speed: 0.35, r: 200, g: 80,  b: 220, alpha: 0.05 },
      { y: 0.75, amp: 60,  freq: 0.0090, speed: 0.22, r: 0,   g: 217, b: 255, alpha: 0.04 },
    ];
    const drawAurora = (t: number) => {
      if (!isFinite(W) || !isFinite(H) || W <= 0 || H <= 0) return;
      AURORA_DEFS.forEach(w => {
        const baseY = H * w.y - scrollY * 0.12;
        if (!isFinite(baseY)) return;
        const grad = ctx.createLinearGradient(0, baseY - w.amp, 0, baseY + w.amp);
        grad.addColorStop(0,   `rgba(${w.r},${w.g},${w.b},0)`);
        grad.addColorStop(0.5, `rgba(${w.r},${w.g},${w.b},${w.alpha})`);
        grad.addColorStop(1,   `rgba(${w.r},${w.g},${w.b},0)`);
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= W + 8; x += 6) {
          const y = baseY + Math.sin(x * w.freq + t * w.speed) * w.amp
                          + Math.sin(x * w.freq * 0.5 + t * w.speed * 0.7) * (w.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H + 100); ctx.lineTo(0, H + 100); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
        // Neon stroke
        ctx.beginPath(); ctx.moveTo(0, baseY);
        for (let x = 0; x <= W + 8; x += 6) {
          const y = baseY + Math.sin(x * w.freq + t * w.speed) * w.amp
                          + Math.sin(x * w.freq * 0.5 + t * w.speed * 0.7) * (w.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${w.r},${w.g},${w.b},${w.alpha * 2.5})`;
        ctx.lineWidth = 1.2; ctx.stroke();
      });
    };

    /* ════ PERSPECTIVE GRID FLOOR ══════════════════════════════════ */
    const drawGrid = (t: number) => {
      if (!isFinite(W) || !isFinite(H) || W <= 0 || H <= 0) return;
      const horizon = H * 0.62;
      const anim = (t * 0.5) % 1;
      // Horizontal lines receding
      for (let i = 0; i <= 18; i++) {
        const f  = (i + anim) / 18;
        const y  = horizon + Math.pow(f, 1.8) * (H - horizon) * 1.1;
        const alpha = f * 0.08;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(0,217,255,${alpha})`; ctx.lineWidth = 0.7; ctx.stroke();
      }
      // Vertical lines converging to VP
      const vp = W / 2;
      for (let i = -14; i <= 14; i++) {
        const xFar  = vp + i * 55;
        const xNear = vp + i * 420;
        ctx.beginPath(); ctx.moveTo(xFar, horizon); ctx.lineTo(xNear, H + 80);
        ctx.strokeStyle = `rgba(0,217,255,0.04)`; ctx.lineWidth = 0.8; ctx.stroke();
      }
      // Gradient horizon glow
      const hg = ctx.createLinearGradient(0, horizon - 30, 0, horizon + 30);
      hg.addColorStop(0, 'rgba(0,217,255,0)');
      hg.addColorStop(0.5, 'rgba(0,217,255,0.06)');
      hg.addColorStop(1, 'rgba(0,217,255,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, horizon - 30, W, 60);
    };

    /* ════ HUD CIRCLES ════════════════════════════════════════════ */
    type HUD = { cx: number; cy: number; r: number; color: [number,number,number]; speed: number; label: string };
    const HUDS: HUD[] = [
      { cx: W * 0.82, cy: H * 0.28, r: 100, color: [0,217,255],   speed: 0.6, label: 'BUDGET' },
      { cx: W * 0.14, cy: H * 0.55, r: 75,  color: [124,131,253], speed: -0.4, label: 'SAVINGS' },
      { cx: W * 0.75, cy: H * 0.68, r: 60,  color: [200,80,220],  speed: 0.8, label: 'XP' },
    ];
    const drawHUDs = (t: number) => {
      HUDS.forEach(h => {
        const [r, g, b] = h.color;
        const a = `rgba(${r},${g},${b},`;
        // Outer rings
        for (let i = 3; i >= 1; i--) {
          ctx.beginPath(); ctx.arc(h.cx, h.cy, h.r * i / 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = `${a}${0.07 / i})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
        // Rotating arc
        ctx.beginPath();
        ctx.arc(h.cx, h.cy, h.r * 0.88, t * h.speed, t * h.speed + Math.PI * 1.6);
        ctx.strokeStyle = `${a}0.45)`; ctx.lineWidth = 2; ctx.stroke();
        // Inner rotating arc opposite
        ctx.beginPath();
        ctx.arc(h.cx, h.cy, h.r * 0.65, -t * h.speed + Math.PI, -t * h.speed + Math.PI * 2.2);
        ctx.strokeStyle = `${a}0.3)`; ctx.lineWidth = 1.5; ctx.stroke();
        // Tick marks
        for (let i = 0; i < 24; i++) {
          const angle = (i / 24) * Math.PI * 2 + t * h.speed * 0.3;
          const r1 = h.r; const r2 = h.r - (i % 6 === 0 ? 12 : 6);
          ctx.beginPath();
          ctx.moveTo(h.cx + Math.cos(angle) * r1, h.cy + Math.sin(angle) * r1);
          ctx.lineTo(h.cx + Math.cos(angle) * r2, h.cy + Math.sin(angle) * r2);
          ctx.strokeStyle = `${a}${i % 6 === 0 ? 0.6 : 0.25})`;
          ctx.lineWidth = i % 6 === 0 ? 2 : 0.8; ctx.stroke();
        }
        // Center dot
        ctx.beginPath(); ctx.arc(h.cx, h.cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `${a}0.7)`; ctx.fill();
        ctx.shadowColor = `rgb(${r},${g},${b})`; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
        // Label
        ctx.fillStyle = `${a}0.4)`;
        ctx.font = `600 9px 'monospace'`;
        ctx.textAlign = 'center'; ctx.fillText(h.label, h.cx, h.cy + h.r + 16);
      });
    };

    /* ════ FLOATING 3D COINS ══════════════════════════════════════ */
    type Coin = {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      sym: string; angle: number; aSpeed: number;
      baseColor: [number,number,number];
    };
    const COIN_SYMBOLS = ['₹','₹','₹','$','€','₿','₹','$','€'];
    const COIN_COLORS: [number,number,number][] = [
      [0,217,255],[124,131,253],[0,217,255],[255,200,50],[138,174,109],[255,165,0],[0,217,255],[200,80,220],[124,131,253]
    ];
    const coins: Coin[] = COIN_SYMBOLS.map((sym, i) => ({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 1800,
      z: Math.random() * 1000 - 400,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.15 + 0.06),
      vz: -(Math.random() * 0.3 + 0.08),
      sym, angle: Math.random() * Math.PI * 2,
      aSpeed: (Math.random() - 0.5) * 0.025,
      baseColor: COIN_COLORS[i],
    }));

    const drawCoin = (cx: number, cy: number, scale: number, angle: number, sym: string, bc: [number,number,number]) => {
      const rx = 28 * scale;
      const ry = Math.max(2, 28 * scale * Math.abs(Math.cos(angle)));
      const alpha = Math.min(1, scale * 1.4);
      const [r,g,b] = bc;
      // Coin body
      const grad = ctx.createRadialGradient(cx - rx * 0.25, cy - ry * 0.25, 0, cx, cy, Math.max(rx, ry));
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.85})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.45})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.08})`);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      // Rim
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.shadowColor = `rgb(${r},${g},${b})`; ctx.shadowBlur = rx * 0.6; ctx.stroke(); ctx.shadowBlur = 0;
      // Symbol (only when coin is face-on enough)
      if (Math.abs(Math.cos(angle)) > 0.25) {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.font = `900 ${Math.max(7, Math.floor(17 * scale))}px monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(sym, cx, cy);
      }
    };

    const drawCoins = () => {
      coins.forEach(c => {
        c.x += c.vx; c.y += c.vy; c.z += c.vz; c.angle += c.aSpeed;
        if (c.z < -800) c.z = 1200;
        const [px, py, sc] = prj(c.x, c.y, c.z);
        if (sc > 0.05 && px > -80 && px < W + 80 && py > -80 && py < H + 80) {
          drawCoin(px, py, sc, c.angle, c.sym, c.baseColor);
        }
      });
    };

    /* ════ WIREFRAME SHAPES ════════════════════════════════════════ */
    const buildIco = (scale: number) => {
      const t = (1 + Math.sqrt(5)) / 2;
      const raw: [number,number,number][] = [
        [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
        [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1],
      ];
      const verts = raw.map(([x,y,z]) => { const l=Math.sqrt(x*x+y*y+z*z); return [x/l*scale,y/l*scale,z/l*scale] as [number,number,number]; });
      const edges = [[0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],[2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],[4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11]];
      return { verts, edges };
    };
    const ICO = buildIco(145);
    const OCT_V: [number,number,number][] = [[180,0,0],[-180,0,0],[0,180,0],[0,-180,0],[0,0,180],[0,0,-180]];
    const OCT_E = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]];

    const buildTorus = (R: number, r: number, ss: number, ts: number) => {
      const pts: [number,number,number][] = [];
      for (let i=0;i<ss;i++) { const u=(i/ss)*Math.PI*2; for(let j=0;j<ts;j++) { const v=(j/ts)*Math.PI*2; pts.push([(R+r*Math.cos(v))*Math.cos(u),(R+r*Math.cos(v))*Math.sin(u),r*Math.sin(v)]); } }
      return pts;
    };
    const TORUS = buildTorus(110, 32, 48, 16);

    const drawShapes = (ay: number, ax: number) => {
      // Icosahedron — right side
      const ox1 = W * 0.82 - W/2, oy1 = H * 0.38 - H/2;
      ctx.strokeStyle = 'rgba(124,131,253,0.28)'; ctx.lineWidth = 0.9;
      ICO.edges.forEach(([a,b]) => {
        let va = rX(...rY(...ICO.verts[a], ay), ax);
        let vb = rX(...rY(...ICO.verts[b], ay), ax);
        const [pax,pay] = prj(va[0]+ox1, va[1]+oy1, va[2]);
        const [pbx,pby] = prj(vb[0]+ox1, vb[1]+oy1, vb[2]);
        ctx.beginPath(); ctx.moveTo(pax,pay); ctx.lineTo(pbx,pby); ctx.stroke();
      });
      // Torus — left side
      const ox2 = W * 0.18 - W/2, oy2 = H * 0.62 - H/2;
      ctx.strokeStyle = 'rgba(0,217,255,0.2)'; ctx.lineWidth = 0.8;
      for (let i=0;i<TORUS.length-1;i++) {
        const [tx1,ty1,tz1] = rY(...TORUS[i], -ay*0.5);
        const [tx2,ty2,tz2] = rY(...TORUS[i+1], -ay*0.5);
        const [pax,pay] = prj(tx1+ox2, ty1+oy2, tz1-300);
        const [pbx,pby] = prj(tx2+ox2, ty2+oy2, tz2-300);
        ctx.beginPath(); ctx.moveTo(pax,pay); ctx.lineTo(pbx,pby); ctx.stroke();
      }
      // Octahedron — center top
      const ox3 = W * 0.5 - W/2, oy3 = H * 0.18 - H/2;
      ctx.strokeStyle = 'rgba(200,80,220,0.25)'; ctx.lineWidth = 0.8;
      OCT_E.forEach(([a,b]) => {
        const [ax2,ay2,az2] = rY(...OCT_V[a], ay * 1.4);
        const [bx2,by2,bz2] = rY(...OCT_V[b], ay * 1.4);
        const [pax,pay] = prj(ax2+ox3, ay2+oy3, az2-400);
        const [pbx,pby] = prj(bx2+ox3, by2+oy3, bz2-400);
        ctx.beginPath(); ctx.moveTo(pax,pay); ctx.lineTo(pbx,pby); ctx.stroke();
      });
    };

    /* ════ STAR PARTICLES ════════════════════════════════════════ */
    type Star = { x:number;y:number;z:number;vx:number;vy:number;vz:number;r:number;color:string };
    const SCOLS = ['rgba(124,131,253,','rgba(0,217,255,','rgba(138,174,109,','rgba(200,80,220,'];
    const stars: Star[] = Array.from({length:200}, () => ({
      x:(Math.random()-0.5)*2600, y:(Math.random()-0.5)*2600, z:Math.random()*1400-200,
      vx:(Math.random()-0.5)*0.18, vy:(Math.random()-0.5)*0.18, vz:-(Math.random()*0.38+0.08),
      r:Math.random()*1.8+0.5, color:SCOLS[Math.floor(Math.random()*SCOLS.length)],
    }));
    const drawStars = () => {
      stars.forEach(s => {
        s.x+=s.vx; s.y+=s.vy; s.z+=s.vz;
        if(s.z<-900) s.z=1400;
        const [px,py,sc] = prj(s.x,s.y,s.z);
        if(px<-20||px>W+20||py<-20||py>H+20) return;
        const alpha = Math.min(1, sc*1.3);
        ctx.beginPath(); ctx.arc(px,py,s.r*sc,0,Math.PI*2);
        ctx.fillStyle=`${s.color}${alpha.toFixed(2)})`; ctx.fill();
      });
    };

    /* ════ SCAN LINE ══════════════════════════════════════════════ */
    const drawScanLine = (t: number) => {
      if (!isFinite(W) || !isFinite(H) || W <= 0 || H <= 0) return;
      const sy = (t * 80) % H;
      if (!isFinite(sy)) return;
      const grad = ctx.createLinearGradient(0, sy-40, 0, sy+40);
      grad.addColorStop(0,'rgba(0,217,255,0)');
      grad.addColorStop(0.5,'rgba(0,217,255,0.03)');
      grad.addColorStop(1,'rgba(0,217,255,0)');
      ctx.fillStyle=grad; ctx.fillRect(0,sy-40,W,80);
    };

    /* ════ MAIN RENDER LOOP ═══════════════════════════════════════ */
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      const t  = frame * 0.008;
      const ay = frame * 0.003 + scrollY * 0.0003;
      const ax = Math.sin(frame * 0.005) * 0.18;

      drawAurora(t);
      drawGrid(t);
      drawHUDs(t);
      drawCoins();
      drawShapes(ay, ax);
      drawStars();
      drawScanLine(t);

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ref]);
}

/* ══════════════════════════════════════════════════════════════════════
   SCROLL REVEAL via IntersectionObserver
══════════════════════════════════════════════════════════════════════ */
function useScrollReveal(ids: string[]) {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('wl-visible'); });
    }, { threshold: 0.1 });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
}

/* ══════════════════════════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: Brain,      title: 'Obsidian AI Coach',   desc: 'Neural network financial advisor with voice control and holographic interface', color: '#7C83FD', bg: '#7C83FD14' },
  { icon: Target,     title: 'Smart Budget Grid',   desc: 'Auto-categorize expenses and monitor budgets with real-time AI precision',      color: '#00D9FF', bg: '#00D9FF10' },
  { icon: TrendingUp, title: 'Predictive Engine',   desc: 'AI forecasts that intercept overspend before it happens',                      color: '#8AAE6D', bg: '#8AAE6D10' },
  { icon: Award,      title: 'Mission System',      desc: 'Earn XP, unlock badges, and compete in campus leaderboards',                   color: '#FFD700', bg: '#FFD70010' },
  { icon: Shield,     title: 'Financial Literacy',  desc: 'Interactive quizzes and lessons tailored to your knowledge level',             color: '#C850DC', bg: '#C850DC10' },
  { icon: Zap,        title: 'Instant Alerts',      desc: 'Nano-second alerts when spending risks are detected by the AI core',           color: '#FF9F4A', bg: '#FF9F4A10' },
];

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
interface WelcomePageProps { onGetStarted: () => void }

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMegaCanvas(canvasRef);
  useScrollReveal(['wl-stats','wl-features','wl-testimonial','wl-cta']);

  const [counters, setCounters] = useState({ students: 0, saved: 0, rating: 0 });
  const [typed, setTyped] = useState('');
  const HEADLINE = 'Master Your Financial Future';

  // Typewriter
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setTyped(HEADLINE.slice(0,i)); if(i>=HEADLINE.length) clearInterval(t); }, 55);
    return () => clearInterval(t);
  }, []);

  // Counters on scroll
  useEffect(() => {
    const el = document.getElementById('wl-stats');
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const dur = 2400, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now-start)/dur, 1);
        const e = 1 - Math.pow(1-p, 3);
        setCounters({ students: Math.floor(15000*e), saved: Math.floor(100*e), rating: parseFloat((4.8*e).toFixed(1)) });
        if (p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Liquid ripple on click
  const handleRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const span = document.createElement('span');
    Object.assign(span.style, {
      position:'absolute', pointerEvents:'none', borderRadius:'50%',
      width:'12px', height:'12px', background:'rgba(255,255,255,0.5)',
      left:`${e.clientX-r.left}px`, top:`${e.clientY-r.top}px`,
      animation:'liquid-ripple 0.65s ease-out forwards',
    });
    btn.appendChild(span);
    setTimeout(() => span.remove(), 700);
    onGetStarted();
  }, [onGetStarted]);

  return (
    <div style={{ background:'#060B18', overflowX:'hidden', position:'relative', minHeight:'100vh' }}>

      <style>{`
        /* ── Base reveal ── */
        .wl-section { opacity:0; transform:translateY(55px); transition:opacity 0.8s ease, transform 0.8s ease; }
        .wl-section.wl-visible { opacity:1; transform:none; }
        /* ── Feature cards ── */
        .wl-fcard {
          opacity:0; transform:translateY(60px) rotateY(8deg);
          transition:opacity 0.65s ease, transform 0.65s ease, box-shadow 0.3s ease;
          transform-style: preserve-3d;
        }
        .wl-visible .wl-fcard { opacity:1; transform:none; }
        /* ── Stat card ── */
        .wl-stat { opacity:0; transform:translateY(40px) scale(0.92); transition:opacity 0.6s ease, transform 0.6s ease; }
        .wl-visible .wl-stat { opacity:1; transform:none; }
        /* ── Liquid glass panel ── */
        .lg-panel {
          background: linear-gradient(135deg, rgba(0,6,18,0.82) 0%, rgba(10,4,30,0.88) 100%);
          border: 1px solid rgba(0,217,255,0.18);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
        /* ── Aurora button shimmer ── */
        @keyframes aurora-btn {
          0%,100% { box-shadow: 0 0 30px rgba(0,217,255,0.4), 0 0 15px rgba(124,131,253,0.3); }
          50%      { box-shadow: 0 0 50px rgba(0,217,255,0.6), 0 0 25px rgba(200,80,220,0.4); }
        }
        .aurora-btn { animation: aurora-btn 3s ease-in-out infinite; }
        /* ── Neon badge pulse ── */
        @keyframes badge-pulse {
          0%,100% { border-color: rgba(0,217,255,0.25); }
          50%      { border-color: rgba(0,217,255,0.55); }
        }
        /* ── Crystal card inner light ── */
        .crystal-light {
          background: radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.04) 0%, transparent 65%);
        }
      `}</style>

      {/* ── 3D Canvas — fixed background ── */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ width:'100%', height:'100%' }} />

      {/* ── Gradient master overlay ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background:'linear-gradient(145deg, rgba(6,11,24,0.86) 0%, rgba(10,5,30,0.78) 45%, rgba(6,11,24,0.88) 100%)' }} />

      {/* ── Hero 3D CSS Coins overlay (above canvas) ── */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <HeroCoins3D />
      </div>

      {/* ════ CONTENT ════════════════════════════════════════════ */}
      <div className="relative z-10">

        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
          style={{
            background: 'rgba(4,8,20,0.78)',
            backdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(0,217,255,0.1)',
          }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative"
              style={{ background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)', boxShadow:'0 0 22px rgba(0,217,255,0.5)' }}>
              <Sparkles className="w-5 h-5 text-white" />
              {/* Rotating ring on logo */}
              <div className="absolute inset-0 rounded-xl border border-[#00D9FF]/30"
                style={{ animation:'spin 6s linear infinite', borderStyle:'dashed' }} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-white">Budget</span>{' '}
                <span className="text-blue-300">Sathi</span>
              </span>
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#00D9FF]">AI Financial Command</p>
            </div>
          </div>
          <button onClick={onGetStarted}
            className="relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 aurora-btn"
            style={{ background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)' }}>
            Launch →
          </button>
        </nav>

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background:'rgba(0,217,255,0.06)',
              border:'1px solid rgba(0,217,255,0.28)',
              backdropFilter:'blur(16px)',
              animation:'badge-pulse 3s ease-in-out infinite',
            }}>
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping absolute" style={{ opacity:0.5 }} />
              <div className="w-2 h-2 rounded-full bg-[#00D9FF]" />
            </div>
            <span className="text-[#00D9FF] text-sm font-bold tracking-wide">Neural AI · Financial Command Center</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.05] max-w-5xl">
            <span className="text-white block mb-3">Master Your Money,</span>
            <span style={{
              background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 40%, #C850DC 70%, #8AAE6D 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>
              {typed}
              <span style={{
                display:'inline-block', width:4, height:'0.82em', background:'#00D9FF',
                marginLeft:5, verticalAlign:'middle', borderRadius:2,
                animation:'blink 0.8s ease-in-out infinite',
              }} />
            </span>
          </h1>

          <p className="text-xl text-[#A5B4FC] mb-12 max-w-2xl leading-relaxed">
            Your personal neural financial intelligence — tracks expenses, predicts overspend, gamifies savings, and speaks like Jarvis.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={handleRipple}
              className="group relative overflow-hidden px-10 py-4 rounded-2xl font-black text-white inline-flex items-center gap-3 text-lg transition-all duration-300 hover:scale-105 aurora-btn"
              style={{ background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)' }}>
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              className="px-10 py-4 rounded-2xl font-bold text-white inline-flex items-center gap-3 text-lg transition-all duration-300 hover:scale-105"
              style={{
                background:'rgba(124,131,253,0.07)',
                border:'1px solid rgba(124,131,253,0.3)',
                backdropFilter:'blur(16px)',
              }}>
              <div className="w-5 h-5 rounded-full border-2 border-[#7C83FD] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#7C83FD] ml-0.5" style={{ clipPath:'polygon(0 0, 100% 50%, 0 100%)' }} />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {['15K+ Students','₹1Cr+ Saved','4.8★ Rating','Voice-Enabled AI','Free Forever'].map((t,i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#8AAE6D]" style={{ filter:'drop-shadow(0 0 6px rgba(138,174,109,0.7))' }} />
                <span className="text-[#A5B4FC] text-sm">{t}</span>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
            <span className="text-[#A5B4FC] text-xs font-mono uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-[#00D9FF] animate-bounce" />
          </div>
        </section>

        {/* ── STATS ── */}
        <section id="wl-stats" className="py-20 px-6 wl-section">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { v:`${counters.students.toLocaleString()}+`, l:'Active Students', c:'#7C83FD', icon:Users,      delay:'0ms'   },
              { v:`₹${counters.saved}Cr+`,                  l:'Money Saved',     c:'#8AAE6D', icon:TrendingUp, delay:'100ms' },
              { v:`${counters.rating}/5`,                   l:'User Rating',     c:'#00D9FF', icon:Star,       delay:'200ms' },
              { v:'24/7',                                   l:'AI Support',      c:'#FFD700', icon:Zap,        delay:'300ms' },
            ].map((s,i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="wl-stat text-center p-6 rounded-2xl hover:scale-[1.04] transition-all duration-300 lg-panel crystal-light"
                  style={{ transitionDelay: s.delay, boxShadow:`0 4px 30px ${s.c}08` }}>
                  <Icon className="w-6 h-6 mx-auto mb-3" style={{ color:s.c, filter:`drop-shadow(0 0 8px ${s.c}90)` }} />
                  <p className="text-3xl font-black mb-1" style={{ color:s.c }}>{s.v}</p>
                  <p className="text-[#A5B4FC] text-xs">{s.l}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="wl-features" className="py-20 px-6 wl-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background:'rgba(0,217,255,0.06)', border:'1px solid rgba(0,217,255,0.2)' }}>
                <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span className="text-[#00D9FF] text-xs font-bold tracking-widest uppercase">Command Arsenal</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything You Need</h2>
              <p className="text-[#A5B4FC] text-lg max-w-xl mx-auto">
                Holographic-grade financial tools built for student command
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="wl-fcard rounded-2xl p-7 lg-panel crystal-light cursor-pointer"
                    style={{ transitionDelay:`${i*65}ms`, border:`1px solid ${f.color}18` }}
                    onMouseMove={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      const r  = el.getBoundingClientRect();
                      const x  = (e.clientX-r.left)/r.width - 0.5;
                      const y  = (e.clientY-r.top)/r.height - 0.5;
                      el.style.transform = `perspective(900px) rotateY(${x*12}deg) rotateX(${-y*12}deg) scale(1.04)`;
                      el.style.boxShadow = `0 8px 48px ${f.color}22, 0 0 0 1px ${f.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = ''; el.style.boxShadow = '';
                    }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ background:f.bg, border:`1px solid ${f.color}28`, boxShadow:`0 0 28px ${f.color}18` }}>
                      <Icon className="w-7 h-7" style={{ color:f.color, filter:`drop-shadow(0 0 9px ${f.color}aa)` }} />
                    </div>
                    <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                    <p className="text-[#A5B4FC] text-sm leading-relaxed">{f.desc}</p>
                    <div className="mt-5 h-px rounded-full"
                      style={{ background:`linear-gradient(90deg, ${f.color}70, transparent)` }} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ── */}
        <section className="py-16 px-6">
          <div id="wl-testimonial"
            className="max-w-3xl mx-auto text-center p-12 rounded-3xl wl-section lg-panel crystal-light"
            style={{
              boxShadow:'0 0 80px rgba(0,217,255,0.08), 0 0 40px rgba(124,131,253,0.1)',
              border:'1px solid rgba(0,217,255,0.2)',
            }}>
            <div className="flex justify-center mb-4 gap-1">
              {[...Array(5)].map((_,i) => (
                <Star key={i} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]"
                  style={{ filter:'drop-shadow(0 0 6px rgba(255,215,0,0.7))' }} />
              ))}
            </div>
            <p className="text-white text-xl mb-8 leading-relaxed italic font-light">
              "Obsidian AI inside Budget Sathi is insane — it actually speaks to me, warns me before I overspend, and awards XP. I saved ₹8,000 in two months. It's Jarvis for my wallet!"
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl flex-shrink-0"
                style={{ background:'linear-gradient(135deg, #7C83FD, #00D9FF)', boxShadow:'0 0 20px rgba(0,217,255,0.45)' }}>
                A
              </div>
              <div className="text-left">
                <p className="text-white font-bold">Ananya Verma</p>
                <p className="text-[#A5B4FC] text-sm">CS Student, Delhi University · Level 8 Saver 🔥</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6">
          <div id="wl-cta"
            className="max-w-4xl mx-auto text-center p-14 rounded-3xl wl-section"
            style={{
              background:'linear-gradient(135deg, rgba(8,4,28,0.94) 0%, rgba(0,6,18,0.97) 100%)',
              border:'1px solid rgba(0,217,255,0.25)',
              backdropFilter:'blur(32px)',
              boxShadow:'0 0 100px rgba(0,217,255,0.1), 0 0 50px rgba(124,131,253,0.14)',
            }}>
            {/* HUD corner accents */}
            {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((pos, i) => (
              <div key={i} className="absolute pointer-events-none"
                style={{ ...pos, width:24, height:24,
                  borderTop: i < 2 ? '2px solid rgba(0,217,255,0.5)' : 'none',
                  borderBottom: i >= 2 ? '2px solid rgba(0,217,255,0.5)' : 'none',
                  borderLeft: i%2===0 ? '2px solid rgba(0,217,255,0.5)' : 'none',
                  borderRight: i%2===1 ? '2px solid rgba(0,217,255,0.5)' : 'none',
                }} />
            ))}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background:'rgba(0,217,255,0.07)', border:'1px solid rgba(0,217,255,0.22)' }}>
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-[#00D9FF] text-xs font-black tracking-widest uppercase">Join 15,000+ Students</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Activate<br />Your Financial AI?
            </h2>
            <p className="text-[#A5B4FC] text-lg mb-10 max-w-xl mx-auto">
              Free forever. Obsidian AI ready. Your first mission starts now.
            </p>
            <button onClick={handleRipple}
              className="group relative overflow-hidden px-14 py-5 rounded-2xl font-black text-white inline-flex items-center gap-3 text-xl transition-all duration-300 hover:scale-105 aurora-btn"
              style={{ background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 60%, #C850DC 100%)' }}>
              Activate Obsidian AI
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:'1px solid rgba(0,217,255,0.07)' }} className="py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#A5B4FC] text-sm">
              <Shield className="w-4 h-4 text-[#00D9FF]" style={{ filter:'drop-shadow(0 0 4px rgba(0,217,255,0.6))' }} />
              <span>Bank-level security · 256-bit encryption · Always free</span>
            </div>
            <p className="text-[#A5B4FC]/50 text-sm font-mono">© 2026 Budget Sathi · Obsidian AI Core v3.1</p>
          </div>
        </footer>

      </div>
    </div>
  );
}