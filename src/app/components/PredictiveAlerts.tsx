import { useState } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Info, Bell, BellOff, Zap, Brain, Activity, Shield, Clock } from 'lucide-react';
import { PageDecor3D } from './FloatingCoins3D';

const glass = {
  background:'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
  border:'1px solid rgba(0,217,255,0.14)',
  backdropFilter:'blur(24px)',
};

export function PredictiveAlerts() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [toggled, setToggled] = useState<Record<string,boolean>>({
    overspend: true, savings: true, reminders: true, weekly: false,
  });

  const alerts = [
    {
      id:1, type:'critical', icon:AlertTriangle,
      title:'Food Budget Breach Imminent',
      message:"Neural projection: You'll overshoot food budget by 30% (₹650 excess) by month-end at current velocity. Intercept recommended.",
      color:'#FF5252', tagBg:'rgba(255,82,82,0.12)', tag:'⚠ CRITICAL',
      timeAgo:'2 min ago', action:'View AI Plan',
    },
    {
      id:2, type:'ai', icon:Brain,
      title:'Savings Optimization Detected',
      message:'Pattern analysis: Cooking home twice this week could free ₹400. 3 campus discount nodes identified. Deploy savings protocol?',
      color:'#7C83FD', tagBg:'rgba(124,131,253,0.12)', tag:'⬡ AI TIP',
      timeAgo:'15 min ago', action:'Activate Protocol',
    },
    {
      id:3, type:'success', icon:CheckCircle,
      title:'Entertainment Budget — On Track',
      message:'Entertainment spend is 40% below target this month. Discipline coefficient: HIGH. Streak day 14 — keep going!',
      color:'#8AAE6D', tagBg:'rgba(138,174,109,0.12)', tag:'✓ ON TRACK',
      timeAgo:'1h ago', action:'View Progress',
    },
    {
      id:4, type:'reminder', icon:Clock,
      title:'Rent Payment — 5 Days',
      message:'₹3,000 due April 5. Current balance sufficient. Auto-reminder set for April 3. No action required unless balance changes.',
      color:'#00D9FF', tagBg:'rgba(0,217,255,0.08)', tag:'⏰ REMINDER',
      timeAgo:'3h ago', action:'Set Reminder',
    },
    {
      id:5, type:'insight', icon:Activity,
      title:'Spending Velocity Spike',
      message:'Week-over-week spending +18%. Primary driver: food & transport. AI recommends reviewing last 3 days of transactions.',
      color:'#FFD700', tagBg:'rgba(255,215,0,0.08)', tag:'📡 INSIGHT',
      timeAgo:'5h ago', action:'Review Data',
    },
  ];

  const predictions = [
    { category:'Food',          current:500, projected:650, budget:500, color:'#FF5252' },
    { category:'Entertainment', current:150, projected:200, budget:400, color:'#8AAE6D' },
    { category:'Travel',        current:200, projected:280, budget:300, color:'#00D9FF' },
    { category:'Shopping',      current:99,  projected:150, budget:200, color:'#7C83FD' },
  ];

  const smartSettings = [
    { key:'overspend', label:'Overspend Intercepts', desc:'Alert before budget breach', icon:AlertTriangle, color:'#FF5252' },
    { key:'savings',   label:'Savings Opportunities', desc:'Notify when AI finds savings', icon:Zap,          color:'#00D9FF' },
    { key:'reminders', label:'Bill Reminders',       desc:'48h before payments due',    icon:Bell,          color:'#7C83FD' },
    { key:'weekly',    label:'Weekly Neural Report', desc:'Summarize AI insights',      icon:Brain,         color:'#8AAE6D' },
  ];

  const visible = alerts.filter(a => !dismissed.includes(a.id));

  return (
    <div className="space-y-6 pb-8">
      <PageDecor3D />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-white">Predictive Alerts</h2>
          <p className="text-[#A5B4FC] text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse inline-block" />
            Neural engine monitoring · <span style={{ color:'#00D9FF' }}>{visible.length}</span> active alerts
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background:'rgba(0,217,255,0.06)', border:'1px solid rgba(0,217,255,0.2)' }}>
          <Activity className="w-4 h-4 text-[#00D9FF]" style={{ filter:'drop-shadow(0 0 4px rgba(0,217,255,0.8))' }} />
          <span className="text-[#00D9FF] text-xs font-black tracking-widest uppercase">Live Scan</span>
        </div>
      </div>

      {/* ── Alert Cards ── */}
      <div className="space-y-4">
        {visible.map(alert => {
          const Icon = alert.icon;
          return (
            <div key={alert.id}
              className="rounded-2xl p-5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300"
              style={{ ...glass, border:`1px solid ${alert.color}25`, boxShadow:`0 4px 30px ${alert.color}08` }}>
              {/* Colored left accent bar */}
              <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
                style={{ background:`linear-gradient(to bottom, ${alert.color}, ${alert.color}55)`, boxShadow:`0 0 12px ${alert.color}80` }} />

              <div className="pl-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:alert.tagBg, border:`1px solid ${alert.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color:alert.color, filter:`drop-shadow(0 0 6px ${alert.color}90)` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-black text-sm">{alert.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black tracking-wide"
                          style={{ background:alert.tagBg, color:alert.color, border:`1px solid ${alert.color}30` }}>
                          {alert.tag}
                        </span>
                      </div>
                      <p className="text-[#A5B4FC] text-sm leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:scale-105"
                          style={{ background:`${alert.color}18`, border:`1px solid ${alert.color}30`, color:alert.color }}>
                          {alert.action}
                        </button>
                        <span className="text-[#A5B4FC]/50 text-xs font-mono">{alert.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDismissed(d => [...d, alert.id])}
                    className="text-[#A5B4FC]/40 hover:text-[#A5B4FC] transition-colors p-1 flex-shrink-0">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="rounded-2xl p-12 text-center" style={glass}>
            <Shield className="w-12 h-12 mx-auto mb-3" style={{ color:'#8AAE6D', filter:'drop-shadow(0 0 10px rgba(138,174,109,0.5))' }} />
            <p className="text-white font-bold">All clear — neural scan nominal</p>
            <p className="text-[#A5B4FC] text-sm mt-1">No active alerts. You're on track!</p>
          </div>
        )}
      </div>

      {/* ── Spending Projection ── */}
      <div className="rounded-2xl p-6" style={glass}>
        <h3 className="text-white font-black mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00D9FF]" style={{ filter:'drop-shadow(0 0 6px rgba(0,217,255,0.8))' }} />
          Month-End Spend Projections
        </h3>
        <p className="text-[#A5B4FC] text-xs mb-6">Neural forecast based on current spending velocity</p>
        <div className="space-y-5">
          {predictions.map((p, i) => {
            const pct = Math.min((p.projected / p.budget) * 100, 100);
            const over = p.projected > p.budget;
            return (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-semibold">{p.category}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#A5B4FC]">Now: <b style={{ color:p.color }}>₹{p.current}</b></span>
                    <span className="text-[#A5B4FC]">Projected: <b style={{ color: over?'#FF5252':p.color }}>₹{p.projected}</b></span>
                    <span className="text-[#A5B4FC]">Budget: ₹{p.budget}</span>
                  </div>
                </div>
                <div className="relative h-3 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
                  {/* Budget marker */}
                  <div className="absolute top-0 bottom-0 w-px z-10"
                    style={{ left:`${Math.min((p.budget/Math.max(p.projected,p.budget))*100,100)}%`, background:`rgba(255,255,255,0.3)` }} />
                  {/* Current bar */}
                  <div className="absolute h-full rounded-full transition-all duration-700"
                    style={{ width:`${(p.current/Math.max(p.projected,p.budget))*100}%`,
                      background:`linear-gradient(90deg,${p.color}cc,${p.color}55)`, boxShadow:`0 0 8px ${p.color}60` }} />
                  {/* Projection extension */}
                  <div className="absolute h-full rounded-full transition-all duration-700 opacity-40"
                    style={{ left:`${(p.current/Math.max(p.projected,p.budget))*100}%`,
                      width:`${((p.projected-p.current)/Math.max(p.projected,p.budget))*100}%`,
                      background: over ? 'rgba(255,82,82,0.6)' : `rgba(${p.color},0.3)` }} />
                </div>
                {over && (
                  <p className="text-xs mt-1" style={{ color:'#FF5252' }}>
                    ⚠ Projected overspend: ₹{p.projected - p.budget}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Smart Alert Settings ── */}
      <div className="rounded-2xl p-6" style={glass}>
        <h3 className="text-white font-black mb-5 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#7C83FD]" />
          Neural Alert Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {smartSettings.map((s) => {
            const Icon = s.icon;
            const on = toggled[s.key];
            return (
              <div key={s.key}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300"
                style={{ background: on ? `${s.color}08` : 'rgba(255,255,255,0.02)', border:`1px solid ${on ? s.color+'25' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${s.color}12`, border:`1px solid ${s.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: on ? s.color : '#A5B4FC' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{s.label}</p>
                  <p className="text-[#A5B4FC] text-xs">{s.desc}</p>
                </div>
                <button onClick={() => setToggled(t => ({...t,[s.key]:!t[s.key]}))}
                  className="flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 relative"
                  style={{ background: on ? `linear-gradient(90deg,${s.color},${s.color}aa)` : 'rgba(255,255,255,0.08)',
                    boxShadow: on ? `0 0 12px ${s.color}50` : 'none' }}>
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                    style={{ left: on ? 'calc(100% - 20px)' : '4px', boxShadow:'0 1px 3px rgba(0,0,0,0.4)' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}