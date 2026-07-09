import { useState, useRef, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, User, GraduationCap, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';

interface SignupPageProps {
  onSignup: (username: string) => void;
  onBackToLogin: () => void;
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
    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.4 + 0.4,
      c: ['rgba(0,217,255,', 'rgba(124,131,253,', 'rgba(138,174,109,'][Math.floor(Math.random() * 3)],
    }));
    const render = () => {
      ctx.clearRect(0, 0, W, H); frame++;
      const t = frame * 0.007;
      [{ y:0.25, amp:70, freq:0.006, speed:0.22, r:0, g:217, b:255, a:0.05 },
       { y:0.5, amp:80, freq:0.005, speed:0.15, r:124, g:131, b:253, a:0.05 },
       { y:0.78, amp:60, freq:0.008, speed:0.28, r:138, g:174, b:109, a:0.04 }].forEach(w=>{
        const by=H*w.y, g=ctx.createLinearGradient(0,by-w.amp,0,by+w.amp);
        g.addColorStop(0,`rgba(${w.r},${w.g},${w.b},0)`);
        g.addColorStop(0.5,`rgba(${w.r},${w.g},${w.b},${w.a})`);
        g.addColorStop(1,`rgba(${w.r},${w.g},${w.b},0)`);
        ctx.beginPath(); ctx.moveTo(0,by);
        for(let x=0;x<=W+8;x+=6) ctx.lineTo(x,by+Math.sin(x*w.freq+t*w.speed)*w.amp);
        ctx.lineTo(W,H+60); ctx.lineTo(0,H+60); ctx.closePath();
        ctx.fillStyle=g; ctx.fill();
      });
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`${p.c}0.55)`; ctx.fill();
      });
      ctx.strokeStyle='rgba(0,217,255,0.022)'; ctx.lineWidth=0.7;
      for(let x=0;x<W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      animId=requestAnimationFrame(render);
    };
    render();
    return ()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',onR);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{width:'100%',height:'100%'}} />;
}

const inputBase = `w-full pl-12 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-300`;
const inputStyle = { background:'rgba(0,217,255,0.04)', border:'1px solid rgba(0,217,255,0.18)', backdropFilter:'blur(12px)', color:'#E0E8FF' };

export function SignupPage({ onSignup, onBackToLogin }: SignupPageProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uni, setUni] = useState('');
  const [pwd, setPwd] = useState('');
  const [conf, setConf] = useState('');
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== conf) { alert('Passwords do not match!'); return; }
    setLoading(true);
    const username = name.split(' ')[0] || email.split('@')[0] || 'User';
    setTimeout(() => { setLoading(false); onSignup(username); }, 1400);
  };

  const fields1 = [
    { key:'name', label:'Full Name', icon:User, type:'text', val:name, set:setName, placeholder:'Your full name' },
    { key:'uni', label:'University / College', icon:GraduationCap, type:'text', val:uni, set:setUni, placeholder:'IIT Delhi, DU, etc.' },
    { key:'email', label:'Email Address', icon:Mail, type:'email', val:email, set:setEmail, placeholder:'student@university.edu' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-start sm:items-center justify-center py-6 sm:py-8"
      style={{ background:'linear-gradient(135deg, #060B18 0%, #0D0A2E 50%, #060B18 100%)' }}>

      <style>{`@keyframes spin-slow{to{transform:rotate(360deg)}}`}</style>
      <AuthCanvas />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background:'radial-gradient(circle, #7C83FD 0%, transparent 70%)', filter:'blur(50px)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-6"
          style={{ background:'radial-gradient(circle, #00D9FF 0%, transparent 70%)', filter:'blur(40px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-5">

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center relative">
                <Logo className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-contain relative z-10" />
                <div className="absolute inset-[-8px] rounded-2xl border border-dashed border-[#00D9FF]/25"
                  style={{ animation:'spin-slow 8s linear infinite' }} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                <span className="text-white opacity-80">Join</span>{' '}
                <span className="text-white">Budget</span>{' '}
                <span className="text-blue-300">Sathi</span>
              </h1>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#00D9FF] mt-0.5">Initialize Neural Profile</p>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-6">
          {[1,2].map(s=>(
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
                style={s<=step ? { background:'linear-gradient(135deg,#7C83FD,#00D9FF)', color:'#fff', boxShadow:'0 0 12px rgba(0,217,255,0.5)' } : { background:'rgba(0,217,255,0.08)', color:'#8B9CC8', border:'1px solid rgba(0,217,255,0.18)' }}>
                {s<step ? <CheckCircle className="w-3.5 h-3.5" /> : s}
              </div>
              {s<2 && <div className="flex-1 h-px" style={{ background: step>1 ? 'linear-gradient(90deg,#7C83FD,#00D9FF)' : 'rgba(0,217,255,0.15)', width:40 }} />}
            </div>
          ))}
          <span className="text-[#A5B4FC] text-xs ml-2">{step === 1 ? 'Your Details' : 'Set Password'}</span>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-5 sm:p-8 relative overflow-hidden"
          style={{
            background:'linear-gradient(135deg, rgba(0,6,20,0.88) 0%, rgba(10,4,30,0.9) 100%)',
            border:'1px solid rgba(0,217,255,0.2)',
            backdropFilter:'blur(32px)',
            boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,217,255,0.06)',
          }}>

          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background:'linear-gradient(90deg,transparent,#00D9FF,#7C83FD,transparent)', animation:'scan-line 4s linear infinite' }} />

          {[{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}].map((pos,i)=>(
            <div key={i} className="absolute pointer-events-none" style={{ ...pos, width:16, height:16,
              borderTop:i<2?'1.5px solid rgba(0,217,255,0.35)':'none',
              borderBottom:i>=2?'1.5px solid rgba(0,217,255,0.35)':'none',
              borderLeft:i%2===0?'1.5px solid rgba(0,217,255,0.35)':'none',
              borderRight:i%2===1?'1.5px solid rgba(0,217,255,0.35)':'none',
            }}/>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {step === 1 && fields1.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">{f.label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: focus===f.key ? '#00D9FF' : '#7C83FD', transition:'color 0.3s' }} />
                    <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} required
                      onFocus={()=>setFocus(f.key)} onBlur={()=>setFocus('')}
                      className={inputBase}
                      style={{ ...inputStyle, borderColor: focus===f.key ? 'rgba(0,217,255,0.45)' : 'rgba(0,217,255,0.18)' }} />
                  </div>
                </div>
              );
            })}

            {step === 2 && (
              <>
                {[
                  { key:'pwd', label:'Password', val:pwd, set:setPwd, show:showPwd, toggle:()=>setShowPwd(v=>!v), placeholder:'Create strong password' },
                  { key:'conf', label:'Confirm Password', val:conf, set:setConf, show:showConf, toggle:()=>setShowConf(v=>!v), placeholder:'Re-enter password' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">{f.label}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color:focus===f.key?'#00D9FF':'#7C83FD', transition:'color 0.3s' }} />
                      <input type={f.show?'text':'password'} value={f.val} onChange={e=>f.set(e.target.value)}
                        onFocus={()=>setFocus(f.key)} onBlur={()=>setFocus('')}
                        placeholder={f.placeholder} required
                        className={`${inputBase} pr-12`}
                        style={{ ...inputStyle, borderColor:focus===f.key?'rgba(0,217,255,0.45)':'rgba(0,217,255,0.18)' }} />
                      <button type="button" onClick={f.toggle}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C83FD] hover:text-[#00D9FF] transition-colors">
                        {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                {pwd && conf && (
                  <div className="flex items-center gap-2 text-xs"
                    style={{ color: pwd===conf ? '#8AAE6D' : '#FF5252' }}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{pwd===conf ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <input type="checkbox" required className="mt-1" style={{ accentColor:'#00D9FF' }} />
                  <label className="text-[#A5B4FC] text-xs leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-[#00D9FF] hover:text-white transition-colors">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#00D9FF] hover:text-white transition-colors">Privacy Policy</a>
                  </label>
                </div>
              </>
            )}

            {step === 1 ? (
              <button type="button" onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl font-black text-white transition-all duration-300 hover:scale-[1.02]"
                style={{ background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)', boxShadow:'0 0 30px rgba(0,217,255,0.4)' }}>
                Continue →
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-xl font-bold text-[#A5B4FC] hover:text-white transition-all duration-300"
                  style={{ background:'rgba(0,217,255,0.05)', border:'1px solid rgba(0,217,255,0.18)' }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-[2] py-4 rounded-xl font-black text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
                  style={{ background:'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)', boxShadow:'0 0 30px rgba(0,217,255,0.4)' }}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Initializing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>Create Account</span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </form>

          <div className="mt-5 text-center">
            <p className="text-[#A5B4FC] text-sm">
              Already have access?{' '}
              <button onClick={onBackToLogin} className="text-[#00D9FF] font-black hover:text-white transition-colors">
                Sign in →
              </button>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[#A5B4FC]/50 text-xs">
          <Shield className="w-3.5 h-3.5 text-[#00D9FF]/50" />
          <span>256-bit encryption · Obsidian AI protected</span>
        </div>
      </div>
    </div>
  );
}
