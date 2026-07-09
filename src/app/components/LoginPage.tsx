import { useState, useRef, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, Sparkles, Zap } from 'lucide-react';
import { Logo } from './Logo';

interface LoginPageProps {
  onLogin: (username: string) => void;
  onSignup: () => void;
}

function AuthCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
    let frame = 0, animId = 0;
    const onR = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener('resize', onR, { passive: true });

    // Particles
    const pts = Array.from({ length: 120 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      c: ['rgba(0,217,255,', 'rgba(124,131,253,', 'rgba(200,80,220,'][Math.floor(Math.random() * 3)],
    }));

    // HUD rings
    const rings = [
      { cx: W * 0.1, cy: H * 0.15, r: 80, color: 'rgba(0,217,255,0.12)', speed: 0.4 },
      { cx: W * 0.92, cy: H * 0.25, r: 60, color: 'rgba(124,131,253,0.15)', speed: -0.3 },
      { cx: W * 0.85, cy: H * 0.8, r: 100, color: 'rgba(0,217,255,0.1)', speed: 0.25 },
      { cx: W * 0.08, cy: H * 0.7, r: 70, color: 'rgba(200,80,220,0.1)', speed: -0.5 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      const t = frame * 0.008;

      // Aurora waves
      [
        { y: 0.3, amp: 80, freq: 0.005, speed: 0.25, r: 0, g: 217, b: 255, a: 0.06 },
        { y: 0.55, amp: 60, freq: 0.007, speed: 0.18, r: 124, g: 131, b: 253, a: 0.05 },
        { y: 0.75, amp: 90, freq: 0.004, speed: 0.3, r: 200, g: 80, b: 220, a: 0.04 },
      ].forEach(w => {
        const by = H * w.y;
        const g = ctx.createLinearGradient(0, by - w.amp, 0, by + w.amp);
        g.addColorStop(0, `rgba(${w.r},${w.g},${w.b},0)`);
        g.addColorStop(0.5, `rgba(${w.r},${w.g},${w.b},${w.a})`);
        g.addColorStop(1, `rgba(${w.r},${w.g},${w.b},0)`);
        ctx.beginPath(); ctx.moveTo(0, by);
        for (let x = 0; x <= W + 8; x += 6) {
          ctx.lineTo(x, by + Math.sin(x * w.freq + t * w.speed) * w.amp);
        }
        ctx.lineTo(W, H + 60); ctx.lineTo(0, H + 60); ctx.closePath();
        ctx.fillStyle = g; ctx.fill();
      });

      // Particles
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.c}0.6)`; ctx.fill();
      });

      // HUD rings
      rings.forEach(r => {
        ctx.beginPath(); ctx.arc(r.cx, r.cy, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = r.color; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath();
        ctx.arc(r.cx, r.cy, r.r * 0.7, t * r.speed, t * r.speed + Math.PI * 1.4);
        ctx.strokeStyle = r.color.replace('0.1', '0.35').replace('0.12', '0.45').replace('0.15', '0.5');
        ctx.lineWidth = 2; ctx.stroke();
      });

      // Grid lines
      ctx.strokeStyle = 'rgba(0,217,255,0.025)'; ctx.lineWidth = 0.7;
      for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onR); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }} />;
}

const inputCls = `w-full pl-12 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-300`;
const inputSty = {
  background: 'rgba(0,217,255,0.04)',
  border: '1px solid rgba(0,217,255,0.18)',
  backdropFilter: 'blur(12px)',
  color: '#E0E8FF',
};
const inputFocusSty = '0 0 0 2px rgba(0,217,255,0.25), 0 0 20px rgba(0,217,255,0.1)';

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail]     = useState('');
  const [pwd,   setPwd]       = useState('');
  const [focus, setFocus]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const username = email ? email.split('@')[0] : 'User';
    setTimeout(() => { setLoading(false); onLogin(username); }, 1200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-start sm:items-center justify-center py-6 sm:py-0"
      style={{ background: 'linear-gradient(135deg, #060B18 0%, #0D0A2E 50%, #060B18 100%)' }}>

      <style>{`
        @keyframes auth-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes spin-slow  { to{transform:rotate(360deg)} }
        .auth-input:focus { box-shadow: ${inputFocusSty} !important; border-color: rgba(0,217,255,0.45) !important; }
      `}</style>

      <AuthCanvas />

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C83FD 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #00D9FF 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-5">

        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center relative">
                <Logo className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-contain relative z-10" />
                {/* Orbit ring */}
                <div className="absolute inset-[-8px] rounded-2xl border border-dashed border-[#00D9FF]/25"
                  style={{ animation: 'spin-slow 8s linear infinite' }} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-20"
                style={{ background: '#8AAE6D', boxShadow: '0 0 10px rgba(138,174,109,0.7)', animation: 'auth-pulse 2s ease-in-out infinite' }}>
                <span style={{ fontSize: 8, color: '#fff', fontWeight: 900 }}>AI</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                <span className="text-white">Budget</span>{' '}
                <span className="text-blue-300">Sathi</span>
              </h1>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#00D9FF] mt-0.5">Neural Command · v3.1</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-5 sm:p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,6,20,0.88) 0%, rgba(10,4,30,0.9) 100%)',
            border: '1px solid rgba(0,217,255,0.2)',
            backdropFilter: 'blur(32px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,217,255,0.06)',
          }}>

          {/* Scan line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #00D9FF, #7C83FD, transparent)', animation: 'scan-line 4s linear infinite' }} />

          {/* Corner HUD */}
          {[{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}].map((pos,i)=>(
            <div key={i} className="absolute pointer-events-none" style={{ ...pos, width:16, height:16,
              borderTop: i<2?'1.5px solid rgba(0,217,255,0.4)':'none',
              borderBottom: i>=2?'1.5px solid rgba(0,217,255,0.4)':'none',
              borderLeft: i%2===0?'1.5px solid rgba(0,217,255,0.4)':'none',
              borderRight: i%2===1?'1.5px solid rgba(0,217,255,0.4)':'none',
            }}/>
          ))}

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,217,255,0.07)', border: '1px solid rgba(0,217,255,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="text-[#00D9FF] text-xs font-bold tracking-widest uppercase">Auth Required</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">Welcome Back</h2>
          <p className="text-[#A5B4FC] text-sm mb-7">Re-establish your neural financial session</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: focus === 'email' ? '#00D9FF' : '#7C83FD', transition: 'color 0.3s' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocus('email')} onBlur={() => setFocus('')}
                  placeholder="student@university.edu" required
                  className={`${inputCls} auth-input`}
                  style={{ ...inputSty, borderColor: focus === 'email' ? 'rgba(0,217,255,0.45)' : 'rgba(0,217,255,0.18)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: focus === 'pwd' ? '#00D9FF' : '#7C83FD', transition: 'color 0.3s' }} />
                <input
                  type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)}
                  onFocus={() => setFocus('pwd')} onBlur={() => setFocus('')}
                  placeholder="Enter your password" required
                  className={`${inputCls} pr-12 auth-input`}
                  style={{ ...inputSty, borderColor: focus === 'pwd' ? 'rgba(0,217,255,0.45)' : 'rgba(0,217,255,0.18)' }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C83FD] hover:text-[#00D9FF] transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" style={{ accentColor: '#00D9FF' }} />
                <span className="text-[#A5B4FC] text-xs">Remember session</span>
              </label>
              <a href="#" className="text-[#00D9FF] text-xs font-semibold hover:text-white transition-colors">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-black text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
                boxShadow: '0 0 30px rgba(0,217,255,0.4), 0 0 60px rgba(124,131,253,0.2)',
              }}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Enter Command Center</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A5B4FC] text-sm">
              No account?{' '}
              <button onClick={onSignup} className="text-[#00D9FF] font-black hover:text-white transition-colors">
                Create one →
              </button>
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[#A5B4FC]/50 text-xs">
          <Shield className="w-3.5 h-3.5 text-[#00D9FF]/50" />
          <span>256-bit encryption · Obsidian AI protected</span>
        </div>
      </div>
    </div>
  );
}
