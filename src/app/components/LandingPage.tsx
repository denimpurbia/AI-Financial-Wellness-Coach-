/**
 * LandingPage — Cinematic 3D Landing for Indigo Ledger
 *
 * Layers (bottom → top)
 *  1. Three.js canvas: floating coins, holographic charts, glassmorphism panels,
 *     particle field, vertical data-stream lines, aurora gradient
 *  2. Liquid-glass UI overlay: minimal hero text + CTA buttons
 *  3. Feature cards (glassmorphism)
 *  4. Stats bar
 *  5. Testimonial
 *  6. Footer CTA
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  ArrowRight, Play, Brain, Target, TrendingUp,
  Award, Shield, Sparkles, ChevronDown, Star,
} from 'lucide-react';
import { RoboticAI3DFace } from './RoboticAI3DFace';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
}

/* ═══════��══════════════════════════════════════════════════
   THREE.JS BACKGROUND SCENE
════════════════════════════════════════════════════════════ */
function useThreeBackground(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * Math.min(devicePixelRatio, 2);
    canvas.height = H * Math.min(devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 0, 22);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0x010510, 6));
    const rimL = new THREE.PointLight(0x00D9FF, 4, 50); rimL.position.set(-12, 5, 8); scene.add(rimL);
    const rimR = new THREE.PointLight(0x5533FF, 3, 50); rimR.position.set(12, 4, 8);  scene.add(rimR);
    const top  = new THREE.DirectionalLight(0x0A2888, 1.2); top.position.set(0, 15, 5); scene.add(top);

    const bin: Array<{ dispose(): void }> = [];
    function D<T extends { dispose(): void }>(x: T): T { bin.push(x); return x; }

    /* ── Coin factory ────────────────────────────────────────── */
    function makeCoin(symbol: string, color: number, emissive: number): THREE.Group {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        D(new THREE.CylinderGeometry(0.70, 0.70, 0.14, 48)),
        D(new THREE.MeshPhysicalMaterial({
          color, metalness: 0.95, roughness: 0.06, clearcoat: 1,
          emissive: new THREE.Color(emissive), emissiveIntensity: 0.6,
        }))
      );
      g.add(body);
      // Rim
      const rim = new THREE.Mesh(
        D(new THREE.TorusGeometry(0.70, 0.045, 8, 48)),
        D(new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, metalness: 1, roughness: 0.04, emissive: new THREE.Color(emissive), emissiveIntensity: 0.4 }))
      );
      rim.rotation.x = Math.PI / 2; g.add(rim);
      // Glow halo
      const haloMat = D(new THREE.MeshBasicMaterial({ color: emissive, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }));
      g.add(new THREE.Mesh(D(new THREE.CylinderGeometry(0.90, 0.90, 0.04, 32)), haloMat));
      return g;
    }

    const coinDefs = [
      { sym: '₹', color: 0xD4AF37, emissive: 0xFFAA00, pos: [-6.5, 2.5, -2] as [number,number,number], spd: 0.38 },
      { sym: '$', color: 0x22C55E, emissive: 0x00FF88, pos: [ 5.5, 3.2, -3] as [number,number,number], spd: 0.28 },
      { sym: '₿', color: 0xF97316, emissive: 0xFF6600, pos: [ 7.0,-2.5, -4] as [number,number,number], spd: 0.44 },
      { sym: '€', color: 0x7C83FD, emissive: 0x4455FF, pos: [-5.0,-3.0, -2] as [number,number,number], spd: 0.32 },
      { sym: '¥', color: 0xEC4899, emissive: 0xFF44AA, pos: [-8.5, 0.0, -5] as [number,number,number], spd: 0.22 },
      { sym: '£', color: 0x00D9FF, emissive: 0x00FFFF, pos: [ 9.0, 1.0, -6] as [number,number,number], spd: 0.35 },
    ];
    const coins = coinDefs.map(d => {
      const g = makeCoin(d.sym, d.color, d.emissive);
      g.position.set(...d.pos);
      g.userData.spd = d.spd;
      g.userData.oy  = d.pos[1];
      scene.add(g);
      return g;
    });

    /* ── Holographic chart panels ───────────────────────────── */
    function makeChart(): THREE.Group {
      const g = new THREE.Group();
      // Panel glass
      const panel = new THREE.Mesh(
        D(new THREE.PlaneGeometry(3.2, 2.0)),
        D(new THREE.MeshPhysicalMaterial({
          color: 0x001840, metalness: 0.1, roughness: 0.05,
          transmission: 0.60, thickness: 0.5, transparent: true, opacity: 0.55,
          side: THREE.DoubleSide,
        }))
      );
      g.add(panel);
      // Neon border
      const border = new THREE.LineSegments(
        D(new THREE.EdgesGeometry(D(new THREE.PlaneGeometry(3.2, 2.0)))),
        D(new THREE.LineBasicMaterial({ color: 0x00D9FF, transparent: true, opacity: 0.55 }))
      );
      g.add(border);
      // Bar chart bars inside
      const barMat = D(new THREE.MeshBasicMaterial({ color: 0x00D9FF, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending }));
      const heights = [0.4, 0.7, 0.5, 0.9, 0.65, 0.8, 0.55];
      heights.forEach((h, i) => {
        const bar = new THREE.Mesh(D(new THREE.PlaneGeometry(0.22, h)), barMat);
        bar.position.set(-1.2 + i * 0.40, -0.95 + h / 2, 0.01);
        g.add(bar);
      });
      // Line path
      const pts = heights.map((h, i) => new THREE.Vector3(-1.2 + i * 0.40, -0.95 + h, 0.02));
      const lineGeo = D(new THREE.BufferGeometry().setFromPoints(pts));
      g.add(new THREE.Line(lineGeo, D(new THREE.LineBasicMaterial({ color: 0x7C83FD, transparent: true, opacity: 0.75 }))));
      return g;
    }

    const chartDefs = [
      { pos: [-9.5, 1.5, -8] as [number,number,number], rot: [0.10, 0.35, 0] as [number,number,number], scale: 0.9 },
      { pos: [ 8.5,-1.0,-10] as [number,number,number], rot: [0.05,-0.30, 0] as [number,number,number], scale: 0.75 },
      { pos: [-2.0,-5.5, -9] as [number,number,number], rot: [0.08, 0.05, 0] as [number,number,number], scale: 0.80 },
    ];
    const charts = chartDefs.map(d => {
      const c = makeChart();
      c.position.set(...d.pos);
      c.rotation.set(...d.rot);
      c.scale.setScalar(d.scale);
      scene.add(c);
      return c;
    });

    /* ── Holographic ring clusters ──────────────────────────── */
    const rings: THREE.Mesh[] = [];
    [[0, 3.5, -14], [-10, -2, -16], [10, 2, -18]].forEach(([x, y, z]) => {
      [2.0, 3.2, 4.5].forEach((r, ri) => {
        const ring = new THREE.Mesh(
          D(new THREE.TorusGeometry(r, 0.028, 8, 60)),
          D(new THREE.MeshBasicMaterial({
            color: ri % 2 === 0 ? 0x00D9FF : 0x7C83FD,
            transparent: true, opacity: 0.14 + ri * 0.06,
            blending: THREE.AdditiveBlending,
          }))
        );
        ring.position.set(x, y, z);
        ring.userData.speed = 0.003 + ri * 0.002;
        scene.add(ring);
        rings.push(ring);
      });
    });

    /* ── Wireframe geometric shapes ─────────────────────────── */
    const shapes: THREE.LineSegments[] = [];
    const wMat = (col: number) => D(new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.25 }));
    [
      { geo: D(new THREE.OctahedronGeometry(1.1)), pos: [-13, 4, -12], col: 0x00D9FF, spd: 0.008 },
      { geo: D(new THREE.IcosahedronGeometry(0.9)), pos: [12, -4, -11], col: 0x7C83FD, spd: 0.005 },
      { geo: D(new THREE.TetrahedronGeometry(1.2)), pos: [0, 7, -15], col: 0x00D9FF, spd: 0.006 },
    ].forEach(({ geo, pos: [x, y, z], col, spd }) => {
      const sh = new THREE.LineSegments(D(new THREE.EdgesGeometry(geo)), wMat(col));
      sh.position.set(x, y, z);
      sh.userData.spd = spd;
      scene.add(sh); shapes.push(sh);
    });

    /* ── Particle cloud ─────────────────────────────────────── */
    const NP = 600;
    const pPos = new Float32Array(NP * 3);
    const pVel = new Float32Array(NP * 3);
    for (let i = 0; i < NP; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 38;
      pPos[i*3+1] = (Math.random() - 0.5) * 28;
      pPos[i*3+2] = -4 - Math.random() * 22;
      pVel[i*3]   = (Math.random() - 0.5) * 0.012;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.010;
    }
    const pGeo = D(new THREE.BufferGeometry());
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pCloud = new THREE.Points(pGeo, D(new THREE.PointsMaterial({
      color: 0x00D9FF, size: 0.11, transparent: true, opacity: 0.50,
      blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false,
    })));
    scene.add(pCloud);

    /* ── Data-stream vertical lines ─────────────────────────── */
    for (let i = 0; i < 50; i++) {
      const lx = (Math.random() - 0.5) * 36;
      const lz = -6 - Math.random() * 20;
      const ly = (Math.random() - 0.5) * 18;
      const ll = 2 + Math.random() * 8;
      scene.add(new THREE.Line(
        D(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(lx, ly, lz), new THREE.Vector3(lx, ly - ll, lz)])),
        D(new THREE.LineBasicMaterial({ color: 0x003388, transparent: true, opacity: 0.08 + Math.random() * 0.18 }))
      ));
    }

    /* ── Mouse parallax ─────────────────────────────────────── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 2;
      my = -(e.clientY / H - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    /* ── Scroll parallax ────────────────────────────────────── */
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Animate ────────────────────────────────────────────── */
    let frame = 0, animId = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.010;

      // Camera parallax
      camera.position.x += (mx * 1.8 - camera.position.x) * 0.028;
      camera.position.y += (my * 1.2 + scrollY * -0.004 - camera.position.y) * 0.028;
      camera.lookAt(0, 0, 0);

      // Coins
      coins.forEach((c, i) => {
        c.rotation.y += coinDefs[i].spd * 0.018;
        c.position.y = coinDefs[i].oy + Math.sin(t * (0.45 + i * 0.11) + i) * 0.55;
      });

      // Charts float
      charts.forEach((c, i) => {
        c.position.y += Math.sin(t * 0.35 + i * 2) * 0.005;
        c.rotation.y  = chartDefs[i].rot[1] + Math.sin(t * 0.20 + i) * 0.06;
      });

      // Rings
      rings.forEach(r => { r.rotation.x += r.userData.speed; r.rotation.z += r.userData.speed * 0.6; });

      // Shapes
      shapes.forEach(s => { s.rotation.x += s.userData.spd; s.rotation.y += s.userData.spd * 0.7; });

      // Particles
      pCloud.rotation.y += 0.00025;
      const pa = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < NP; i++) {
        pa.array[i*3]   += pVel[i*3];
        pa.array[i*3+1] += pVel[i*3+1];
        if (Math.abs(pa.array[i*3])   > 19) pVel[i*3]   *= -1;
        if (Math.abs(pa.array[i*3+1]) > 14) pVel[i*3+1] *= -1;
      }
      pa.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      bin.forEach(d => d.dispose());
      renderer.dispose();
    };
  }, []);
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════��══════════════════════════════════ */
export function LandingPage({ onGetStarted }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  useThreeBackground(canvasRef);

  const [demoOpen, setDemoOpen] = useState(false);

  const features = [
    { icon: Brain,      title: 'AI Financial Coach',    desc: 'Obsidian AI gives Jarvis-style advice tailored to your spending habits' },
    { icon: Target,     title: 'Smart Budget Tracking', desc: 'Automatic categorization with predictive overspend alerts' },
    { icon: TrendingUp, title: 'Predictive Analytics',  desc: 'Forecast your expenses before they happen — neural-powered' },
    { icon: Award,      title: 'Gamified Savings',      desc: 'Earn XP, unlock badges, and compete with friends on leaderboards' },
    { icon: Shield,     title: 'Financial Literacy',    desc: 'Interactive quizzes and micro-lessons to build money intelligence' },
    { icon: Sparkles,   title: 'Multilingual AI',       desc: 'Responds in English, Hindi, Hinglish and Mewadi — your language' },
  ];

  const stats = [
    { val: '10K+', label: 'Active Students' },
    { val: '₹50L+', label: 'Total Saved' },
    { val: '4.9/5', label: 'User Rating' },
    { val: '24/7',  label: 'AI Support'   },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#0B1220' }}>

      {/* ── Three.js canvas background ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Aurora gradient overlay ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: `
          radial-gradient(ellipse 80% 55% at 15% 30%, rgba(30,27,75,0.55) 0%, transparent 60%),
          radial-gradient(ellipse 70% 50% at 85% 65%, rgba(0,80,140,0.30) 0%, transparent 55%),
          radial-gradient(ellipse 100% 100% at 50% 100%, rgba(11,18,32,0.85) 0%, transparent 70%)
        `,
      }} />

      {/* ── Neon grid ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 2,
        backgroundImage: `
          linear-gradient(rgba(0,217,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,217,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '55px 55px',
      }} />

      {/* ══ CONTENT ══════════════════════════════════════════════ */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── NAV ── */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-black tracking-tight leading-none" style={{ fontSize: 18 }}>
              <span className="text-white">Budget</span>{' '}
              <span className="text-blue-300">Sathi</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Pricing'].map(l => (
              <span key={l} className="text-sm tracking-wide cursor-pointer transition-colors"
                style={{ color: 'rgba(165,180,252,0.65)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00D9FF')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(165,180,252,0.65)')}>
                {l}
              </span>
            ))}
          </div>

          <button onClick={onGetStarted}
            className="px-5 py-2 rounded-xl text-sm tracking-wider transition-all hover:scale-105"
            style={{
              background: 'rgba(124,131,253,0.10)',
              border: '1px solid rgba(124,131,253,0.35)',
              color: '#A5B4FC',
              backdropFilter: 'blur(12px)',
            }}>
            Sign In
          </button>
        </nav>

        {/* ── HERO ── */}
        <section className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-10 pb-20 gap-12">

          {/* Left: Text */}
          <div className="flex-1 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                background: 'rgba(0,217,255,0.07)',
                border: '1px solid rgba(0,217,255,0.22)',
                backdropFilter: 'blur(14px)',
              }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" style={{ boxShadow: '0 0 6px #00D9FF' }} />
              <span className="text-[11px] tracking-[0.22em] uppercase font-mono" style={{ color: '#00D9FF' }}>
                Powered by Obsidian AI · Neural v3.1
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ lineHeight: 1.08, marginBottom: 24 }}>
              <span className="block text-white" style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                Master Your
              </span>
              <span className="block" style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 55%, #8AAE6D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Money, Finally.
              </span>
            </h1>

            <p className="mb-10 max-w-lg" style={{ color: 'rgba(165,180,252,0.72)', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Your AI finance coach — smarter than a spreadsheet, more personal than a bank.
              Built for students who want to own their financial future.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <button onClick={onGetStarted}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
                  boxShadow: '0 0 32px rgba(124,131,253,0.45), 0 0 60px rgba(0,217,255,0.20)',
                  color: '#fff',
                }}>
                <Sparkles className="w-4 h-4" />
                <span className="tracking-wide">Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button onClick={() => setDemoOpen(true)}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(0,217,255,0.06)',
                  border: '1px solid rgba(0,217,255,0.28)',
                  color: '#00D9FF',
                  backdropFilter: 'blur(16px)',
                }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,217,255,0.18)', border: '1px solid rgba(0,217,255,0.4)' }}>
                  <Play className="w-3 h-3 ml-0.5" />
                </div>
                <span className="tracking-wide">Watch Demo</span>
              </button>
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {['#7C83FD','#00D9FF','#8AAE6D','#F97316'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-black text-white"
                    style={{ background: c, borderColor: '#0B1220' }}>
                    {['A','S','R','P'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />)}
                </div>
                <span className="text-[11px]" style={{ color: 'rgba(165,180,252,0.55)' }}>
                  Trusted by 10,000+ students
                </span>
              </div>
            </div>
          </div>

          {/* Right: 3D AI Face */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-[-20px] rounded-full pointer-events-none" style={{
                background: 'radial-gradient(circle, rgba(0,217,255,0.12) 0%, transparent 68%)',
                animation: 'pulse 3s ease-in-out infinite',
              }} />
              {/* Rotating HUD rings */}
              <div className="absolute inset-[-32px] pointer-events-none" style={{ animation: 'spin 18s linear infinite' }}>
                <div className="w-full h-full rounded-full" style={{ border: '1px solid rgba(0,217,255,0.15)' }} />
              </div>
              <div className="absolute inset-[-48px] pointer-events-none" style={{ animation: 'spin-rev 28s linear infinite' }}>
                <div className="w-full h-full rounded-full" style={{ border: '1px dashed rgba(124,131,253,0.14)' }} />
              </div>

              {/* Corner HUD labels */}
              {[
                { label: 'NEURAL', val: '98%', pos: 'top-0 left-0', color: '#00D9FF' },
                { label: 'SYNC',   val: 'LIVE', pos: 'top-0 right-0', color: '#7C83FD' },
                { label: 'XP',     val: '1,240', pos: 'bottom-0 left-0', color: '#8AAE6D' },
                { label: 'LVL',    val: '5',   pos: 'bottom-0 right-0', color: '#00D9FF' },
              ].map(({ label, val, pos, color }) => (
                <div key={label} className={`absolute ${pos} flex flex-col items-center pointer-events-none`}
                  style={{ transform: 'translate(-28%, -28%)' }}>
                  <span style={{ fontSize: 8, color: `${color}99`, fontFamily: 'monospace', letterSpacing: '0.15em' }}>{label}</span>
                  <span style={{ fontSize: 10, color, fontFamily: 'monospace', fontWeight: 900 }}>{val}</span>
                </div>
              ))}

              <RoboticAI3DFace state="idle" size="xl" zoomToFit={true} />
            </div>

            {/* Identity label */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(0,217,255,0.06)',
                border: '1px solid rgba(0,217,255,0.22)',
              }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8AAE6D', boxShadow: '0 0 5px #8AAE6D' }} />
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: '#00D9FF' }}>
                Obsidian · Neural Ready
              </span>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ val, label }) => (
              <div key={label} className="text-center px-6 py-5 rounded-2xl"
                style={{
                  background: 'rgba(30,27,75,0.30)',
                  border: '1px solid rgba(124,131,253,0.18)',
                  backdropFilter: 'blur(20px)',
                }}>
                <p className="mb-1" style={{
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #7C83FD, #00D9FF)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{val}</p>
                <p className="text-xs tracking-wider uppercase font-mono" style={{ color: 'rgba(165,180,252,0.55)' }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCROLL CUE ── */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-col items-center gap-2 animate-bounce" style={{ color: 'rgba(0,217,255,0.40)' }}>
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase">Scroll to explore</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(124,131,253,0.08)', border: '1px solid rgba(124,131,253,0.22)' }}>
              <Sparkles className="w-3.5 h-3.5 text-[#7C83FD]" />
              <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#A5B4FC]">Core Features</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              background: 'linear-gradient(135deg, #fff 40%, #7C83FD 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Built for the Future of Finance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={i}
                className="group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.025] cursor-pointer"
                style={{
                  background: 'rgba(11,18,32,0.55)',
                  border: '1px solid rgba(124,131,253,0.16)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.30)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,217,255,0.35)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 30px rgba(0,217,255,0.08), 0 4px 24px rgba(0,0,0,0.30)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(124,131,253,0.16)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.30)';
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,131,253,0.15) 0%, rgba(0,217,255,0.08) 100%)',
                    border: '1px solid rgba(124,131,253,0.25)',
                  }}>
                  <Icon className="w-5 h-5 text-[#7C83FD] group-hover:text-[#00D9FF] transition-colors" />
                </div>
                <h3 className="text-white mb-2 tracking-wide" style={{ fontSize: '0.95rem' }}>{title}</h3>
                <p style={{ color: 'rgba(165,180,252,0.60)', fontSize: '0.84rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI PREVIEW PANEL ── */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="rounded-3xl overflow-hidden relative"
            style={{
              background: 'rgba(11,18,32,0.65)',
              border: '1px solid rgba(0,217,255,0.18)',
              backdropFilter: 'blur(28px)',
              boxShadow: '0 0 60px rgba(0,217,255,0.06), 0 8px 40px rgba(0,0,0,0.4)',
            }}>
            {/* Top glow line */}
            <div className="h-px w-full" style={{
              background: 'linear-gradient(90deg, transparent 0%, #00D9FF 35%, #7C83FD 65%, transparent 100%)',
              opacity: 0.7,
            }} />

            <div className="flex flex-col lg:flex-row items-center gap-8 p-8 md:p-12">
              {/* Mini face + chat UI mockup */}
              <div className="flex-shrink-0 relative">
                <div className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(6,10,28,0.85)',
                    border: '1px solid rgba(0,217,255,0.22)',
                    width: 240, padding: 16,
                  }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#8AAE6D] animate-pulse" style={{ boxShadow: '0 0 5px #8AAE6D' }} />
                    <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#00D9FF' }}>Obsidian AI · Live</span>
                  </div>
                  {/* Mock chat messages */}
                  {[
                    { user: true,  msg: 'How much did I spend this week?' },
                    { user: false, msg: '📊 ₹1,240 this week. You\'re 12% under budget — great job! 🔥' },
                    { user: true,  msg: 'Set a ₹200 food budget alert' },
                    { user: false, msg: '✅ Alert set! I\'ll notify you when you hit ₹160.' },
                  ].map((m, i) => (
                    <div key={i} className={`mb-2 flex ${m.user ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[88%] px-3 py-2 rounded-xl"
                        style={{
                          fontSize: 11, lineHeight: 1.5,
                          background: m.user ? 'rgba(124,131,253,0.18)' : 'rgba(0,217,255,0.07)',
                          border: `1px solid ${m.user ? 'rgba(124,131,253,0.3)' : 'rgba(0,217,255,0.18)'}`,
                          color: m.user ? '#E8EEFF' : '#C8E8F8',
                        }}>
                        {m.msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                  style={{ background: 'rgba(0,217,255,0.07)', border: '1px solid rgba(0,217,255,0.20)' }}>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00D9FF]">Obsidian AI · Jarvis-Style</span>
                </div>
                <h3 className="text-white mb-4" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
                  Your Personal AI<br />Finance Advisor
                </h3>
                <p style={{ color: 'rgba(165,180,252,0.65)', lineHeight: 1.7, marginBottom: 24 }}>
                  Obsidian AI analyzes your transactions in real time, predicts overspending 
                  before it happens, and guides you with personalized, voice-enabled financial 
                  advice in your language — Hindi, English, Hinglish or Mewadi.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Voice Commands', 'Hindi / English', 'Real-Time Alerts', 'XP Rewards'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg text-[11px] font-mono tracking-wider"
                      style={{
                        background: 'rgba(124,131,253,0.10)',
                        border: '1px solid rgba(124,131,253,0.25)',
                        color: '#A5B4FC',
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button onClick={onGetStarted}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,131,253,0.22) 0%, rgba(0,217,255,0.14) 100%)',
                    border: '1px solid rgba(0,217,255,0.30)',
                    color: '#00D9FF',
                  }}>
                  <span className="text-sm tracking-wide">Try Obsidian AI Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
          <div className="rounded-3xl px-8 py-10"
            style={{
              background: 'rgba(30,27,75,0.28)',
              border: '1px solid rgba(124,131,253,0.20)',
              backdropFilter: 'blur(22px)',
              boxShadow: '0 0 50px rgba(124,131,253,0.08)',
            }}>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />)}
            </div>
            <p className="text-lg mb-6" style={{ color: 'rgba(230,235,255,0.88)', lineHeight: 1.75 }}>
              "Budget Sathi completely changed how I think about money. Obsidian AI feels like 
              having a personal CFO in my pocket — and the XP system actually makes saving 
              <em> fun</em>. Saved ₹8,000 in two months without even trying hard."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #7C83FD, #00D9FF)' }}>P</div>
              <div className="text-left">
                <p className="text-white text-sm">Priya Sharma</p>
                <p className="text-xs font-mono" style={{ color: 'rgba(165,180,252,0.50)' }}>B.Tech CSE · IIT Bombay</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30,27,75,0.55) 0%, rgba(0,40,80,0.50) 100%)',
              border: '1px solid rgba(0,217,255,0.22)',
              backdropFilter: 'blur(24px)',
            }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,217,255,0.08) 0%, transparent 60%)',
            }} />
            {/* Top bar */}
            <div className="h-px" style={{
              background: 'linear-gradient(90deg, transparent, #7C83FD 35%, #00D9FF 65%, transparent)',
            }} />
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                Ready to Own Your<br />
                <span style={{
                  background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Financial Future?</span>
              </h2>
              <p className="mb-10 max-w-xl mx-auto" style={{ color: 'rgba(165,180,252,0.65)', lineHeight: 1.65 }}>
                Join 10,000+ students who are mastering their money with Obsidian AI.
                Start free — no credit card required.
              </p>
              <button onClick={onGetStarted}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
                  boxShadow: '0 0 40px rgba(124,131,253,0.50), 0 0 80px rgba(0,217,255,0.20)',
                  color: '#fff',
                }}>
                <Sparkles className="w-5 h-5" />
                <span className="tracking-wide">Start Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t px-6 py-6 flex items-center justify-between max-w-7xl mx-auto"
          style={{ borderColor: 'rgba(124,131,253,0.12)' }}>
          <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(165,180,252,0.35)' }}>
            © 2026 BUDGET SATHI · OBSIDIAN AI v3.1
          </span>
          <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(165,180,252,0.25)' }}>
            NEURAL FINANCE PLATFORM
          </span>
        </footer>

      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes spin     { to { transform: rotate(360deg);  } }
        @keyframes spin-rev { to { transform: rotate(-360deg); } }
        @keyframes pulse    {
          0%,100% { opacity:1; transform: scale(1); }
          50%     { opacity:0.75; transform: scale(1.04); }
        }
      `}</style>

      {/* ── Demo modal ── */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(5,8,20,0.88)', backdropFilter: 'blur(12px)' }}
          onClick={() => setDemoOpen(false)}>
          <div className="rounded-3xl px-10 py-12 text-center max-w-sm mx-4"
            style={{
              background: 'rgba(11,18,32,0.90)',
              border: '1px solid rgba(0,217,255,0.28)',
              backdropFilter: 'blur(28px)',
            }}
            onClick={e => e.stopPropagation()}>
            <RoboticAI3DFace state="speaking" size="md" />
            <p className="mt-4 mb-6 text-sm" style={{ color: 'rgba(165,180,252,0.75)' }}>
              Demo video coming soon — meanwhile, experience Obsidian AI live in the app!
            </p>
            <button onClick={() => { setDemoOpen(false); onGetStarted(); }}
              className="px-6 py-3 rounded-xl w-full"
              style={{
                background: 'linear-gradient(135deg, #7C83FD, #00D9FF)',
                color: '#fff',
              }}>
              Try Live Demo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
