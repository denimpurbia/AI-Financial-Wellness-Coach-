import { useState } from 'react';
import { Trophy, Crown, Star, Zap, Flame, Shield, BookOpen, Lock, CheckCircle, Target, Gift, Award } from 'lucide-react';
import { PageDecor3D } from './FloatingCoins3D';

const glass = {
  background:'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
  border:'1px solid rgba(0,217,255,0.14)',
  backdropFilter:'blur(24px)',
};

export function GamifiedSavings() {
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);

  const badges = [
    { name:'Budget Ninja',    desc:'Stayed under budget 30 days', icon:Zap,      earned:true,  color:'#7C83FD', glow:'rgba(124,131,253,0.6)' },
    { name:'Savings Guru',    desc:'Saved ₹5,000 in one month',   icon:Crown,    earned:true,  color:'#8AAE6D', glow:'rgba(138,174,109,0.6)' },
    { name:'Tracker Pro',     desc:'Logged expenses 7 days',      icon:Star,     earned:true,  color:'#FFD700', glow:'rgba(255,215,0,0.6)'   },
    { name:'Smart Spender',   desc:'10 smart purchase decisions', icon:Shield,   earned:false, color:'#A5B4FC', glow:'' },
    { name:'Streak Master',   desc:'Maintain 30-day streak',      icon:Flame,    earned:false, color:'#A5B4FC', glow:'' },
    { name:'Finance Scholar', desc:'Complete all literacy quizzes',icon:BookOpen,earned:false, color:'#A5B4FC', glow:'' },
  ];

  const challenges = [
    { id:1, title:'Cook at Home',   desc:'Cook 5 meals at home this week',           progress:3, total:5,  reward:'50 XP + ₹200 savings',       xp:50,  color:'#8AAE6D', emoji:'🍳', days:2 },
    { id:2, title:'No Impulse Zone',desc:'Avoid unplanned purchases for 7 days',     progress:5, total:7,  reward:'100 XP + Budget Ninja Badge',  xp:100, color:'#7C83FD', emoji:'🧠', days:2 },
    { id:3, title:'Daily Logger',   desc:'Log all expenses for 14 days straight',    progress:10,total:14, reward:'75 XP + Streak Master Badge',  xp:75,  color:'#00D9FF', emoji:'📒', days:4 },
    { id:4, title:'Zero Cab Week',  desc:'Use public transport all week',            progress:2, total:7,  reward:'40 XP + ₹300 savings',        xp:40,  color:'#FFD700', emoji:'🚌', days:5 },
  ];

  const leaderboard = [
    { rank:1, name:'Priya M.',   xp:1240, avatar:'P', color:'#FFD700',  badge:'👑' },
    { rank:2, name:'Arjun K.',   xp:1180, avatar:'A', color:'#C0C0C0',  badge:'🥈' },
    { rank:3, name:'You',        xp:850,  avatar:'S', color:'#7C83FD',  badge:'🔥', isYou:true },
    { rank:4, name:'Riya S.',    xp:820,  avatar:'R', color:'#8AAE6D',  badge:''   },
    { rank:5, name:'Nikhil P.',  xp:790,  avatar:'N', color:'#A5B4FC',  badge:''   },
  ];

  const rewards = [
    { id:1, title:'₹50 Discount',  desc:'Partner café near campus',  xp:200,  icon:Gift,   color:'#FFD700' },
    { id:2, title:'Month Cashback', desc:'Unlock 2% cashback',        xp:500,  icon:Target, color:'#8AAE6D' },
    { id:3, title:'Premium Badge',  desc:'Exclusive Gold Commander',  xp:1000, icon:Crown,  color:'#00D9FF' },
  ];

  const totalXP = 850;

  return (
    <div className="space-y-6 pb-8">
      <PageDecor3D />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Savings Challenges</h2>
          <p className="text-[#A5B4FC] text-sm mt-1">Level up your finances, one mission at a time</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{ background:'linear-gradient(135deg,rgba(0,217,255,0.08),rgba(124,131,253,0.12))', border:'1px solid rgba(0,217,255,0.22)', boxShadow:'0 0 24px rgba(0,217,255,0.1)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#7C83FD,#00D9FF)', boxShadow:'0 0 16px rgba(0,217,255,0.5)' }}>
            <Zap className="w-5 h-5 text-white" style={{ filter:'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
          </div>
          <div>
            <p className="text-white font-black text-xl">{totalXP} XP</p>
            <p className="text-[#00D9FF] text-xs font-mono tracking-widest">LEVEL 5 · 150 to Lv.6</p>
          </div>
        </div>
      </div>

      {/* ── XP Level Bar ── */}
      <div className="rounded-2xl p-5" style={glass}>
        <div className="flex justify-between text-sm mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF9F4A]" style={{ filter:'drop-shadow(0 0 6px rgba(255,159,74,0.8))' }} />
            <span className="text-white font-bold">Level 5 — Elite Saver</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-black"
              style={{ background:'rgba(255,159,74,0.12)', color:'#FF9F4A', border:'1px solid rgba(255,159,74,0.3)' }}>
              14 DAY STREAK 🔥
            </span>
          </div>
          <span className="text-[#A5B4FC] text-xs font-mono">850 / 1000</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden relative" style={{ background:'rgba(0,217,255,0.07)' }}>
          <div className="h-full rounded-full relative overflow-hidden"
            style={{ width:'85%', background:'linear-gradient(90deg,#7C83FD,#00D9FF)', boxShadow:'0 0 15px rgba(0,217,255,0.5)' }}>
            <div className="absolute inset-0 animate-pulse opacity-40"
              style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)' }} />
          </div>
        </div>
        <p className="text-[#A5B4FC] text-xs mt-2">150 XP to Level 6 — Gold Commander rank unlocked 🥇</p>
      </div>

      {/* ── Active Challenges ── */}
      <div>
        <h3 className="text-white font-black mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00D9FF]" style={{ filter:'drop-shadow(0 0 6px rgba(0,217,255,0.8))' }} />
          Active Missions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const pct = (ch.progress / ch.total) * 100;
            const done = ch.progress >= ch.total;
            const claimed = claimedRewards.includes(ch.id);
            return (
              <div key={ch.id}
                className="rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{ ...glass, border:`1px solid ${ch.color}22`, boxShadow: activeChallenge===ch.id ? `0 0 30px ${ch.color}20` : 'none' }}
                onClick={() => setActiveChallenge(activeChallenge===ch.id ? null : ch.id)}>

                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{ch.emoji}</div>
                    <div>
                      <p className="text-white font-black">{ch.title}</p>
                      <p className="text-[#A5B4FC] text-xs">{ch.desc}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-black"
                      style={{ background:`${ch.color}15`, color:ch.color, border:`1px solid ${ch.color}30` }}>
                      {ch.days}d left
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#A5B4FC]">{ch.progress}/{ch.total} completed</span>
                    <span className="font-black" style={{ color:ch.color }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pct}%`, background:`linear-gradient(90deg,${ch.color},${ch.color}77)`, boxShadow:`0 0 8px ${ch.color}70` }}>
                    </div>
                  </div>
                </div>

                {/* Reward row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" style={{ color:ch.color }} />
                    <span className="text-xs text-[#A5B4FC]">{ch.reward}</span>
                  </div>
                  {done && !claimed ? (
                    <button onClick={e => { e.stopPropagation(); setClaimedRewards(r=>[...r,ch.id]); }}
                      className="px-3 py-1.5 rounded-xl text-xs font-black text-white transition-all hover:scale-105"
                      style={{ background:`linear-gradient(135deg,${ch.color},${ch.color}aa)`, boxShadow:`0 0 12px ${ch.color}50` }}>
                      Claim +{ch.xp} XP
                    </button>
                  ) : claimed ? (
                    <span className="flex items-center gap-1 text-xs" style={{ color:'#8AAE6D' }}>
                      <CheckCircle className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Badges + Leaderboard row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Badges */}
        <div className="rounded-2xl p-6" style={glass}>
          <h3 className="text-white font-black mb-5 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FFD700]" style={{ filter:'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
            Badge Collection
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ background:'rgba(138,174,109,0.12)', color:'#8AAE6D', border:'1px solid rgba(138,174,109,0.3)' }}>
              3/6 Earned
            </span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i}
                  className={`rounded-2xl p-3 text-center transition-all duration-300 ${b.earned ? 'hover:scale-105 cursor-default' : 'opacity-40'}`}
                  style={{
                    background: b.earned ? `linear-gradient(135deg,${b.color}18,${b.color}08)` : 'rgba(255,255,255,0.02)',
                    border: b.earned ? `1px solid ${b.color}30` : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: b.earned ? `0 4px 20px ${b.color}12` : 'none',
                  }}>
                  {b.earned ? (
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                      style={{ background:`linear-gradient(135deg,${b.color},${b.color}99)`, boxShadow:`0 0 16px ${b.glow}` }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                      style={{ background:'rgba(255,255,255,0.05)' }}>
                      <Lock className="w-5 h-5 text-[#A5B4FC]" />
                    </div>
                  )}
                  <p className="text-white text-xs font-bold leading-tight">{b.name}</p>
                  <p className="text-[#A5B4FC] text-[10px] mt-0.5 leading-tight">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl p-6" style={glass}>
          <h3 className="text-white font-black mb-5 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FFD700]" style={{ filter:'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
            Campus Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((p) => (
              <div key={p.rank}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: p.isYou ? 'linear-gradient(135deg,rgba(0,217,255,0.08),rgba(124,131,253,0.1))' : 'rgba(255,255,255,0.02)',
                  border: p.isYou ? '1px solid rgba(0,217,255,0.25)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: p.isYou ? '0 0 20px rgba(0,217,255,0.1)' : 'none',
                }}>
                <div className="w-7 text-center flex-shrink-0">
                  {p.rank <= 3
                    ? <span className="text-lg">{['👑','🥈','🥉'][p.rank-1]}</span>
                    : <span className="text-[#A5B4FC] text-sm font-bold">#{p.rank}</span>}
                </div>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                  style={{ background:`linear-gradient(135deg,${p.color},${p.color}99)`, boxShadow:`0 0 10px ${p.color}50` }}>
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold">{p.name}{p.isYou&&<span className="text-[#00D9FF] ml-1 text-xs">← You</span>}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Zap className="w-3 h-3 text-[#7C83FD]" />
                  <span className="text-white text-sm font-black">{p.xp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Rewards Store ── */}
      <div className="rounded-2xl p-6" style={glass}>
        <h3 className="text-white font-black mb-5 flex items-center gap-2">
          <Gift className="w-4 h-4 text-[#FFD700]" style={{ filter:'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
          Rewards Command Store
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((r) => {
            const Icon = r.icon;
            const unlocked = totalXP >= r.xp;
            return (
              <div key={r.id}
                className={`rounded-2xl p-5 transition-all duration-300 ${unlocked ? 'hover:scale-[1.03]' : 'opacity-50'}`}
                style={{ background: unlocked ? `linear-gradient(135deg,${r.color}12,rgba(6,11,24,0.8))` : 'rgba(255,255,255,0.02)',
                  border:`1px solid ${unlocked ? r.color+'28' : 'rgba(255,255,255,0.06)'}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: unlocked ? `linear-gradient(135deg,${r.color},${r.color}77)` : 'rgba(255,255,255,0.05)',
                    boxShadow: unlocked ? `0 0 20px ${r.color}40` : 'none' }}>
                  <Icon className="w-6 h-6" style={{ color: unlocked ? '#fff' : '#A5B4FC' }} />
                </div>
                <p className="text-white font-black text-sm">{r.title}</p>
                <p className="text-[#A5B4FC] text-xs mb-3">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#7C83FD]" />
                    <span className="text-xs font-black" style={{ color:r.color }}>{r.xp} XP</span>
                  </div>
                  <button disabled={!unlocked}
                    className="px-3 py-1 rounded-xl text-xs font-black transition-all hover:scale-105 disabled:cursor-not-allowed"
                    style={unlocked ? { background:`${r.color}20`, color:r.color, border:`1px solid ${r.color}30` }
                      : { background:'rgba(255,255,255,0.04)', color:'#8B9CC8' }}>
                    {unlocked ? 'Redeem' : `Need ${r.xp - totalXP} XP`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}