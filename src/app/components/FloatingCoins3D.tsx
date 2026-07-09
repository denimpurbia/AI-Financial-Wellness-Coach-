import { useEffect, useRef } from 'react';

/* ════════════════════════════════════════════════════════════════
   FLOATING 3D COINS — Canvas-based premium coin renderer
   Drop anywhere as a fixed/absolute overlay
════════════════════════════════════════════════════════════════ */

interface Coin3D {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  angle: number; aSpeed: number;
  tiltX: number; tiltVX: number;
  sym: string;
  r: number; g: number; b: number;
  radius: number;
  trail: Array<{x:number;y:number;alpha:number}>;
}

interface FloatingCoins3DProps {
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingCoins3D({ count = 14, className = '', style }: FloatingCoins3DProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let animId = 0;

    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    const FOV = 900;
    const project = (x: number, y: number, z: number): [number, number, number] => {
      const s = FOV / Math.max(1, FOV + z);
      return [x * s + W / 2, y * s + H / 2, s];
    };

    const SYMBOLS = ['₹','₹','₹','₹','$','€','₿','$','₹','€','₹','$','₿','₹'];
    const COLORS: [number,number,number][] = [
      [0,217,255],[124,131,253],[0,217,255],[255,210,60],
      [138,174,109],[255,165,0],[0,217,255],[200,80,220],
      [124,131,253],[0,217,255],[255,210,60],[124,131,253],
      [0,217,255],[138,174,109],
    ];

    const coins: Coin3D[] = Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * W * 2.4,
      y: (Math.random() - 0.5) * H * 2.4,
      z: Math.random() * 1000 - 300,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.28 + 0.08),
      vz: -(Math.random() * 0.35 + 0.08),
      angle: Math.random() * Math.PI * 2,
      aSpeed: (Math.random() - 0.5) * 0.032,
      tiltX: Math.random() * Math.PI * 2,
      tiltVX: (Math.random() - 0.5) * 0.012,
      sym: SYMBOLS[i % SYMBOLS.length],
      r: COLORS[i % COLORS.length][0],
      g: COLORS[i % COLORS.length][1],
      b: COLORS[i % COLORS.length][2],
      radius: 26 + Math.random() * 18,
      trail: [],
    }));

    const drawCoin = (coin: Coin3D, px: number, py: number, scale: number) => {
      const { r, g, b, sym, angle, tiltX, radius } = coin;
      const rx = radius * scale;
      const cosA = Math.cos(angle);
      const cosT = Math.cos(tiltX);
      const ry = Math.max(1.5, rx * Math.abs(cosA));
      const alpha = Math.min(0.92, scale * 1.5);
      if (alpha < 0.04) return;

      // ── Outer glow halo ──
      const glowR = rx * 1.6;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.18})`);
      glow.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.07})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.ellipse(px, py, glowR, glowR * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // ── Coin face gradient (3D shading) ──
      const highX = px - rx * 0.28;
      const highY = py - ry * 0.28;
      const grad = ctx.createRadialGradient(highX, highY, 0, px, py, Math.max(rx, ry));
      grad.addColorStop(0,   `rgba(255,255,255,${alpha * 0.45})`);
      grad.addColorStop(0.25,`rgba(${r},${g},${b},${alpha * 0.9})`);
      grad.addColorStop(0.7, `rgba(${r},${g},${b},${alpha * 0.6})`);
      grad.addColorStop(1,   `rgba(${Math.floor(r*0.4)},${Math.floor(g*0.4)},${Math.floor(b*0.4)},${alpha * 0.3})`);

      ctx.save();
      ctx.translate(px, py);
      // Apply tilt for 3D depth illusion
      ctx.scale(1, cosT > 0 ? Math.max(0.3, Math.abs(cosT)) : 1);
      ctx.translate(-px, -py);

      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Edge rim (3D thickness) ──
      if (ry > 3) {
        const rimGrad = ctx.createLinearGradient(px - rx, py, px + rx, py);
        rimGrad.addColorStop(0,   `rgba(${r},${g},${b},${alpha * 0.3})`);
        rimGrad.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.5})`);
        rimGrad.addColorStop(1,   `rgba(${r},${g},${b},${alpha * 0.3})`);
        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = Math.max(1, rx * 0.06);
        ctx.stroke();

        // Neon edge glow
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.shadowBlur = rx * 0.7;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // ── Specular highlight ──
      const spec = ctx.createRadialGradient(highX, highY, 0, highX, highY, rx * 0.45);
      spec.addColorStop(0, `rgba(255,255,255,${alpha * 0.55})`);
      spec.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.ellipse(highX, highY, rx * 0.35, ry * 0.28, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = spec;
      ctx.fill();

      ctx.restore();

      // ── Symbol ──
      if (Math.abs(cosA) > 0.2 && rx > 10) {
        ctx.save();
        ctx.font = `900 ${Math.max(9, Math.floor(rx * 0.65))}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.92})`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
        ctx.shadowBlur = 6;
        ctx.fillText(sym, px, py);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // ── Cross sparkle on big coins ──
      if (rx > 20 && alpha > 0.5) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.4})`;
        ctx.lineWidth = 0.8;
        const sp = rx * 0.55;
        ctx.beginPath();
        ctx.moveTo(px - sp, py); ctx.lineTo(px + sp, py);
        ctx.moveTo(px, py - sp * 0.5); ctx.lineTo(px, py + sp * 0.5);
        ctx.stroke();
        ctx.restore();
      }
    };

    const render = () => {
      if (!isFinite(W) || !isFinite(H) || W <= 0 || H <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, W, H);

      // Sort by z for painter's algorithm
      const sorted = [...coins].sort((a, b) => b.z - a.z);

      sorted.forEach(coin => {
        // Update
        coin.x     += coin.vx;
        coin.y     += coin.vy;
        coin.z     += coin.vz;
        coin.angle += coin.aSpeed;
        coin.tiltX += coin.tiltVX;

        // Reset when off-screen or behind camera
        if (coin.z < -700) {
          coin.z = 1000 + Math.random() * 400;
          coin.x = (Math.random() - 0.5) * W * 2;
          coin.y = H * 0.8 + Math.random() * H * 0.4;
        }
        if (coin.y < -H * 0.8) {
          coin.y = H * 0.8;
          coin.x = (Math.random() - 0.5) * W * 2;
        }

        const [px, py, sc] = project(coin.x, coin.y, coin.z);
        if (sc < 0.04 || px < -120 || px > W + 120 || py < -120 || py > H + 120) return;

        // Trail effect
        coin.trail.push({ x: px, y: py, alpha: Math.min(0.35, sc * 0.4) });
        if (coin.trail.length > 8) coin.trail.shift();

        // Draw trail
        if (coin.trail.length > 1) {
          for (let i = 1; i < coin.trail.length; i++) {
            const t = coin.trail[i];
            const tp = coin.trail[i - 1];
            const a = (i / coin.trail.length) * t.alpha * 0.4;
            ctx.beginPath();
            ctx.moveTo(tp.x, tp.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = `rgba(${coin.r},${coin.g},${coin.b},${a})`;
            ctx.lineWidth = coin.radius * sc * 0.35 * (i / coin.trail.length);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        drawCoin(coin, px, py, sc);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════
   HOLOGRAPHIC HUD RING — CSS 3D animated ring component
════════════════════════════════════════════════════════════════ */
interface HudRing3DProps {
  size: number;
  color: string;
  speed: string;
  reverse?: boolean;
  x: string;
  y: string;
  ticks?: number;
  label?: string;
  opacity?: number;
}

export function HudRing3D({ size, color, speed, reverse = false, x, y, ticks = 16, label, opacity = 1 }: HudRing3DProps) {
  const r = size / 2;
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, transform: 'translate(-50%, -50%)', opacity }}
    >
      {/* Outer rotating ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 ${size * 0.12}px ${color}, inset 0 0 ${size * 0.08}px ${color}40`,
          animation: `spin${reverse ? '-rev' : ''} ${speed} linear infinite`,
        }}
      >
        {/* Dot on the ring */}
        <div className="absolute rounded-full"
          style={{
            width: size * 0.055, height: size * 0.055,
            background: color,
            boxShadow: `0 0 ${size * 0.06}px ${color}`,
            top: 0, left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Inner ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '18%',
          border: `1px dashed ${color}60`,
          animation: `spin${reverse ? '' : '-rev'} ${parseFloat(speed) * 1.5}s linear infinite`,
        }}
      />

      {/* Tick marks */}
      {Array.from({ length: ticks }).map((_, i) => {
        const angle = (i / ticks) * 360;
        const isMajor = i % (ticks / 4) === 0;
        const len = isMajor ? size * 0.12 : size * 0.06;
        return (
          <div key={i} className="absolute"
            style={{
              left: '50%', top: 0,
              width: 1.5, height: len,
              transformOrigin: `0.75px ${r}px`,
              transform: `rotate(${angle}deg)`,
              background: isMajor ? color : `${color}70`,
              borderRadius: 1,
            }}
          />
        );
      })}

      {/* Center cross-hair */}
      <div className="absolute" style={{ inset: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: 1, background: `${color}50` }} />
      </div>
      <div className="absolute" style={{ inset: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 1, height: '100%', background: `${color}50` }} />
      </div>

      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          left: '50%', top: '50%',
          width: size * 0.06, height: size * 0.06,
          transform: 'translate(-50%, -50%)',
          background: color,
          boxShadow: `0 0 ${size * 0.1}px ${color}`,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* Label */}
      {label && (
        <div
          className="absolute text-center font-mono"
          style={{
            top: '100%', left: '50%', transform: 'translateX(-50%)',
            color, fontSize: size * 0.1, letterSpacing: '0.15em',
            marginTop: 6, textShadow: `0 0 8px ${color}`,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PREMIUM 3D COIN — Single CSS-animated coin for page decorations
════════════════════════════════════════════════════════════════ */
interface PremiumCoinProps {
  symbol: string;
  size: number;
  color: string;
  glowColor: string;
  x: string;
  y: string;
  delay?: string;
  duration?: string;
  rotateSpeed?: string;
}

export function PremiumCoin({ symbol, size, color, glowColor, x, y, delay = '0s', duration = '4s', rotateSpeed = '3s' }: PremiumCoinProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y,
        width: size, height: size,
        transform: 'translate(-50%, -50%)',
        animation: `float-premium ${duration} ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <style>{`
        @keyframes float-premium {
          0%, 100% { transform: translate(-50%,-50%) translateY(0px); }
          50%       { transform: translate(-50%,-50%) translateY(-${size * 0.3}px); }
        }
        @keyframes coin-spin-3d {
          0%   { transform: perspective(${size * 6}px) rotateY(0deg); }
          100% { transform: perspective(${size * 6}px) rotateY(360deg); }
        }
        @keyframes spin-rev {
          to { transform: translate(-50%,-50%) rotate(-360deg); }
        }
      `}</style>

      {/* Coin body with 3D rotation */}
      <div
        style={{
          width: '100%', height: '100%',
          animation: `coin-spin-3d ${rotateSpeed} linear infinite`,
          animationDelay: delay,
          position: 'relative',
        }}
      >
        {/* Coin face */}
        <div
          style={{
            width: '100%', height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, white 0%, ${color} 30%, ${glowColor} 70%, rgba(0,0,0,0.3) 100%)`,
            boxShadow: `0 0 ${size * 0.5}px ${glowColor}90, 0 0 ${size * 0.2}px ${glowColor}, inset 0 0 ${size * 0.15}px rgba(255,255,255,0.3)`,
            border: `${Math.max(1, size * 0.04)}px solid ${color}cc`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Specular shine */}
          <div style={{
            position: 'absolute',
            top: '8%', left: '12%',
            width: '38%', height: '32%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 100%)',
            borderRadius: '50%',
            transform: 'rotate(-30deg)',
          }} />

          {/* Symbol */}
          <span style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: size * 0.4,
            fontWeight: 900,
            fontFamily: 'monospace',
            textShadow: `0 0 ${size * 0.2}px ${glowColor}`,
            position: 'relative', zIndex: 1,
            lineHeight: 1,
          }}>
            {symbol}
          </span>

          {/* Rim stripe */}
          <div style={{
            position: 'absolute',
            inset: 0, borderRadius: '50%',
            border: `${size * 0.055}px solid transparent`,
            borderTop: `${size * 0.055}px solid rgba(255,255,255,0.25)`,
          }} />
        </div>
      </div>

      {/* Shadow */}
      <div style={{
        position: 'absolute',
        bottom: -size * 0.2,
        left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: size * 0.12,
        background: `radial-gradient(ellipse, ${glowColor}40 0%, transparent 70%)`,
        borderRadius: '50%',
      }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE 3D DECOR — Lightweight decorations for inner pages
════════════════════════════════════════════════════════════════ */
export function PageDecor3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes spin-rev { to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes decor-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-12px) rotate(2deg); }
          66%      { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes decor-pulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.06); }
        }
      `}</style>

      {/* Top-right HUD ring cluster */}
      <HudRing3D size={160} color="rgba(0,217,255,0.18)" speed="14s" x="92%" y="12%" ticks={24} label="BUDGET" opacity={0.7} />
      <HudRing3D size={100} color="rgba(124,131,253,0.22)" speed="9s" reverse x="92%" y="12%" ticks={16} opacity={0.7} />

      {/* Bottom-left */}
      <HudRing3D size={120} color="rgba(138,174,109,0.16)" speed="11s" x="6%" y="80%" ticks={20} label="SAVINGS" opacity={0.6} />
      <HudRing3D size={70}  color="rgba(0,217,255,0.18)" speed="7s" reverse x="6%" y="80%" ticks={12} opacity={0.6} />

      {/* Floating mini coins */}
      <PremiumCoin symbol="₹" size={42} color="#00D9FF" glowColor="#00D9FF" x="88%" y="50%" delay="0s" duration="5s" rotateSpeed="4s" />
      <PremiumCoin symbol="$" size={30} color="#7C83FD" glowColor="#7C83FD" x="5%" y="30%" delay="1.2s" duration="4.5s" rotateSpeed="3.5s" />
      <PremiumCoin symbol="₿" size={36} color="#FFD700" glowColor="#FF9F4A" x="94%" y="68%" delay="2.1s" duration="6s" rotateSpeed="5s" />

      {/* Particle nodes */}
      {[
        { x: '15%', y: '20%', c: 'rgba(0,217,255,0.4)',   size: 4, delay: '0s'   },
        { x: '82%', y: '35%', c: 'rgba(124,131,253,0.4)', size: 3, delay: '0.7s' },
        { x: '55%', y: '88%', c: 'rgba(138,174,109,0.4)', size: 3.5, delay: '1.4s' },
        { x: '28%', y: '72%', c: 'rgba(0,217,255,0.35)',  size: 2.5, delay: '2s'  },
        { x: '70%', y: '15%', c: 'rgba(200,80,220,0.35)', size: 3, delay: '0.5s' },
      ].map((p, i) => (
        <div key={i}
          className="absolute rounded-full"
          style={{
            left: p.x, top: p.y,
            width: p.size * 2, height: p.size * 2,
            background: p.c,
            boxShadow: `0 0 ${p.size * 4}px ${p.c}`,
            animation: `decor-pulse 3s ease-in-out infinite`,
            animationDelay: p.delay,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Scanning line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.3) 30%, rgba(124,131,253,0.4) 50%, rgba(0,217,255,0.3) 70%, transparent 100%)',
        animation: 'scan-line-v 8s linear infinite',
        top: 0,
      }} />
      <style>{`
        @keyframes scan-line-v {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO 3D COINS — For the Welcome Page hero section (prominent)
════════════════════════════════════════════════════════════════ */
export function HeroCoins3D() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes coin-orbit {
          0%   { transform: translate(-50%,-50%) rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
          100% { transform: translate(-50%,-50%) rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }
        @keyframes hero-float-a {
          0%,100% { transform: translate(-50%,-50%) translateY(0) scale(1); filter: brightness(1); }
          50%      { transform: translate(-50%,-50%) translateY(-28px) scale(1.04); filter: brightness(1.2); }
        }
        @keyframes hero-float-b {
          0%,100% { transform: translate(-50%,-50%) translateY(0) scale(1) rotate(0deg); }
          50%      { transform: translate(-50%,-50%) translateY(-18px) scale(1.02) rotate(3deg); }
        }
        @keyframes hero-coin-spin {
          0%   { transform: perspective(300px) rotateY(0deg); }
          100% { transform: perspective(300px) rotateY(360deg); }
        }
        @keyframes hero-pulse-ring {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
          50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.85; }
        }
      `}</style>

      {/* Giant background coin — center-right */}
      <div style={{ position: 'absolute', left: '78%', top: '38%', width: 130, height: 130, transform: 'translate(-50%,-50%)', animation: 'hero-float-a 5s ease-in-out infinite' }}>
        <div style={{ animation: 'hero-coin-spin 6s linear infinite', width: '100%', height: '100%' }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: 'radial-gradient(circle at 33% 33%, rgba(255,255,255,0.6) 0%, rgba(0,217,255,0.9) 30%, rgba(0,150,200,0.7) 65%, rgba(0,50,80,0.4) 100%)',
            boxShadow: '0 0 60px rgba(0,217,255,0.7), 0 0 30px rgba(0,217,255,0.4), inset 0 0 30px rgba(255,255,255,0.15)',
            border: '2px solid rgba(0,217,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:'10%', left:'15%', width:'35%', height:'28%', background:'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 100%)', borderRadius:'50%', transform:'rotate(-30deg)' }} />
            <span style={{ color:'rgba(255,255,255,0.95)', fontSize: 52, fontWeight: 900, fontFamily:'monospace', textShadow:'0 0 20px rgba(0,217,255,0.9)', zIndex: 1 }}>₹</span>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:'-22%', left:'50%', transform:'translateX(-50%)', width:'70%', height:20, background:'radial-gradient(ellipse, rgba(0,217,255,0.4) 0%, transparent 70%)', borderRadius:'50%' }} />
        {/* Pulse ring */}
        <div style={{ position:'absolute', inset:'-20%', borderRadius:'50%', border:'1.5px solid rgba(0,217,255,0.3)', animation:'hero-pulse-ring 2.5s ease-in-out infinite' }} />
        <div style={{ position:'absolute', inset:'-40%', borderRadius:'50%', border:'1px solid rgba(0,217,255,0.15)', animation:'hero-pulse-ring 2.5s ease-in-out infinite', animationDelay:'0.8s' }} />
      </div>

      {/* Medium coin — left */}
      <div style={{ position:'absolute', left:'12%', top:'52%', width: 78, height: 78, transform:'translate(-50%,-50%)', animation:'hero-float-b 4.5s ease-in-out infinite', animationDelay:'1.2s' }}>
        <div style={{ animation:'hero-coin-spin 5s linear infinite', animationDelay:'0.6s', width:'100%', height:'100%' }}>
          <div style={{
            width:'100%', height:'100%', borderRadius:'50%',
            background:'radial-gradient(circle at 33% 33%, rgba(255,255,255,0.55) 0%, rgba(124,131,253,0.9) 35%, rgba(80,50,200,0.6) 70%, rgba(20,10,60,0.3) 100%)',
            boxShadow:'0 0 36px rgba(124,131,253,0.7), 0 0 16px rgba(124,131,253,0.4), inset 0 0 18px rgba(255,255,255,0.15)',
            border:'2px solid rgba(124,131,253,0.8)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'rgba(255,255,255,0.95)', fontSize:30, fontWeight:900, fontFamily:'monospace', textShadow:'0 0 14px rgba(124,131,253,0.9)' }}>$</span>
          </div>
        </div>
      </div>

      {/* Bitcoin — top-right */}
      <div style={{ position:'absolute', left:'88%', top:'22%', width: 58, height: 58, transform:'translate(-50%,-50%)', animation:'hero-float-a 6s ease-in-out infinite', animationDelay:'0.5s' }}>
        <div style={{ animation:'hero-coin-spin 4s linear infinite', animationDelay:'1s', width:'100%', height:'100%' }}>
          <div style={{
            width:'100%', height:'100%', borderRadius:'50%',
            background:'radial-gradient(circle at 33% 33%, rgba(255,255,255,0.55) 0%, rgba(255,165,0,0.9) 35%, rgba(200,100,0,0.6) 70%, rgba(60,30,0,0.3) 100%)',
            boxShadow:'0 0 28px rgba(255,165,0,0.7), 0 0 12px rgba(255,165,0,0.4)',
            border:'2px solid rgba(255,165,0,0.8)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'rgba(255,255,255,0.95)', fontSize:22, fontWeight:900, fontFamily:'monospace', textShadow:'0 0 10px rgba(255,165,0,0.9)' }}>₿</span>
          </div>
        </div>
      </div>

      {/* Euro — bottom-left */}
      <div style={{ position:'absolute', left:'22%', top:'82%', width: 48, height: 48, transform:'translate(-50%,-50%)', animation:'hero-float-b 5.5s ease-in-out infinite', animationDelay:'2s' }}>
        <div style={{ animation:'hero-coin-spin 7s linear infinite', width:'100%', height:'100%' }}>
          <div style={{
            width:'100%', height:'100%', borderRadius:'50%',
            background:'radial-gradient(circle at 33% 33%, rgba(255,255,255,0.5) 0%, rgba(138,174,109,0.9) 35%, rgba(80,130,60,0.6) 70%, rgba(20,40,10,0.3) 100%)',
            boxShadow:'0 0 24px rgba(138,174,109,0.7), 0 0 10px rgba(138,174,109,0.4)',
            border:'2px solid rgba(138,174,109,0.8)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'rgba(255,255,255,0.95)', fontSize:18, fontWeight:900, fontFamily:'monospace', textShadow:'0 0 10px rgba(138,174,109,0.9)' }}>€</span>
          </div>
        </div>
      </div>

      {/* Small rupee - top-left area */}
      <div style={{ position:'absolute', left:'6%', top:'18%', width: 38, height: 38, transform:'translate(-50%,-50%)', animation:'hero-float-a 4s ease-in-out infinite', animationDelay:'0.9s' }}>
        <div style={{ animation:'hero-coin-spin 3.5s linear infinite', animationDelay:'0.4s', width:'100%', height:'100%' }}>
          <div style={{
            width:'100%', height:'100%', borderRadius:'50%',
            background:'radial-gradient(circle at 33% 33%, rgba(255,255,255,0.5) 0%, rgba(200,80,220,0.9) 35%, rgba(140,40,160,0.6) 70%, rgba(50,0,60,0.3) 100%)',
            boxShadow:'0 0 20px rgba(200,80,220,0.7)',
            border:'2px solid rgba(200,80,220,0.8)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'rgba(255,255,255,0.95)', fontSize:14, fontWeight:900, fontFamily:'monospace' }}>₹</span>
          </div>
        </div>
      </div>
    </div>
  );
}
