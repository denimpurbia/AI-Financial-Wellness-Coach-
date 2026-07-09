import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Users, TrendingUp, TrendingDown, Trophy, Crown, Zap, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { PageDecor3D } from './FloatingCoins3D';

const glass = {
  background: 'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
  border: '1px solid rgba(0,217,255,0.14)',
  backdropFilter: 'blur(24px)',
};

export function PeerComparison() {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

  const comparisonData = [
    { category: 'Food', you: 500, average: 400, emoji: '🍛' },
    { category: 'Rent', you: 3000, average: 3200, emoji: '🏠' },
    { category: 'Travel', you: 200, average: 250, emoji: '🚌' },
    { category: 'Entertainment', you: 150, average: 300, emoji: '🎮' },
  ];

  const radarData = [
    { subject: 'Savings Rate', you: 82, peers: 60 },
    { subject: 'Budget Adherence', you: 90, peers: 70 },
    { subject: 'Expense Tracking', you: 95, peers: 55 },
    { subject: 'Goal Progress', you: 70, peers: 65 },
    { subject: 'Smart Spending', you: 85, peers: 72 },
  ];

  const insights = [
    {
      category: 'Food',
      emoji: '🍛',
      difference: 20,
      trend: 'higher',
      icon: TrendingUp,
      color: '#FF5252',
      tip: 'Consider meal prepping or cooking at home — students nearby spend ₹100 less on food weekly.',
    },
    {
      category: 'Rent',
      emoji: '🏠',
      difference: 6,
      trend: 'lower',
      icon: TrendingDown,
      color: '#8AAE6D',
      tip: "Great! You're paying 6% less on rent than average. That's ₹200 in your pocket monthly.",
    },
    {
      category: 'Entertainment',
      emoji: '🎮',
      difference: 50,
      trend: 'lower',
      icon: TrendingDown,
      color: '#7C83FD',
      tip: 'You spend 50% less on entertainment. Excellent financial discipline — reward yourself occasionally!',
    },
  ];

  const topSavers = [
    { rank: 1, name: 'Priya M.', college: 'IIT Delhi', saved: '₹8,200', badge: '👑', isYou: false },
    { rank: 2, name: 'Arjun K.', college: 'IIT Delhi', saved: '₹7,100', badge: '🥈', isYou: false },
    { rank: 3, name: 'You', college: 'IIT Delhi', saved: '₹3,500', badge: '🏅', isYou: true },
    { rank: 4, name: 'Riya S.', college: 'IIT Delhi', saved: '₹3,200', badge: '', isYou: false },
    { rank: 5, name: 'Nikhil P.', college: 'IIT Delhi', saved: '₹2,900', badge: '', isYou: false },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(30,27,75,0.97) 0%, rgba(11,18,32,0.97) 100%)',
            border: '1px solid rgba(124,131,253,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <p className="text-white font-bold text-sm mb-2">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-8">
      <PageDecor3D />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Peer Comparison</h2>
          <p className="text-[#A5B4FC] text-sm mt-1">See how you stack up against 1,000+ students in your city</p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,217,255,0.08) 0%, rgba(124,131,253,0.1) 100%)',
            border: '1px solid rgba(0,217,255,0.25)',
            boxShadow: '0 0 20px rgba(0,217,255,0.1)',
          }}
        >
          <Crown className="w-4 h-4 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }} />
          <span className="text-white font-bold text-sm">Rank #234</span>
          <span className="text-[#8AAE6D] text-xs font-semibold">Top 25%</span>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Your Rank', value: '#234', sub: 'Top 25% savers', color: '#7C83FD', icon: Trophy, dir: 'up' },
          { label: 'Total Saved', value: '₹3,500', sub: 'This semester', color: '#8AAE6D', icon: TrendingUp, dir: 'up' },
          { label: 'Tracking Streak', value: '14 days', sub: '🔥 Keep it going', color: '#FF9F4A', icon: Zap, dir: 'neutral' },
        ].map((card, i) => {
          const Icon = card.icon;
          const DirIcon = card.dir === 'up' ? ArrowUp : card.dir === 'down' ? ArrowDown : Minus;
          return (
            <div
              key={i}
              className="rounded-2xl p-5 group hover:scale-[1.02] transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${card.color}12 0%, rgba(11,18,32,0.7) 100%)`,
                border: `1px solid ${card.color}25`,
                boxShadow: `0 4px 20px ${card.color}08`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color, filter: `drop-shadow(0 0 8px ${card.color}80)` }} />
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${card.color}15`, color: card.color }}
                >
                  <DirIcon className="w-3 h-3" />
                </div>
              </div>
              <p className="text-3xl font-black" style={{ color: card.color }}>{card.value}</p>
              <p className="text-[#A5B4FC] text-xs mt-1">{card.label}</p>
              <p className="text-[#A5B4FC] text-xs opacity-70">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Chart Card ── */}
      <div
        className="rounded-2xl p-6"
        style={glass}
      >
        {/* Chart type toggle */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,131,253,0.2), rgba(30,27,75,0.5))', border: '1px solid rgba(124,131,253,0.3)' }}
            >
              <Users className="w-5 h-5 text-[#7C83FD]" style={{ filter: 'drop-shadow(0 0 8px rgba(124,131,253,0.5))' }} />
            </div>
            <div>
              <h3 className="text-white font-bold">Spending Breakdown</h3>
              <p className="text-[#A5B4FC] text-xs">vs. 1,043 students in New Delhi</p>
            </div>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.12)' }}>
            {(['bar', 'radar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200"
                style={
                  chartType === type
                    ? { background: 'linear-gradient(135deg, #7C83FD, #00D9FF)', color: '#fff', boxShadow: '0 0 12px rgba(0,217,255,0.4)' }
                    : { color: '#A5B4FC' }
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,131,253,0.06)" />
              <XAxis dataKey="category" stroke="#A5B4FC" tick={{ fontSize: 12 }} />
              <YAxis stroke="#A5B4FC" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: '#A5B4FC', fontSize: 12 }}>{v}</span>} />
              <Bar key="you" dataKey="you" fill="#7C83FD" name="You" radius={[8, 8, 0, 0]}
                style={{ filter: 'drop-shadow(0 0 8px rgba(124,131,253,0.5))' }} />
              <Bar key="average" dataKey="average" fill="#8AAE6D" name="Peers avg." radius={[8, 8, 0, 0]}
                style={{ filter: 'drop-shadow(0 0 8px rgba(138,174,109,0.3))' }} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(124,131,253,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#A5B4FC', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A5B4FC', fontSize: 10 }} />
              <Radar key="you-radar" name="You" dataKey="you" stroke="#7C83FD" fill="#7C83FD" fillOpacity={0.25}
                strokeWidth={2} />
              <Radar key="peers-radar" name="Peers avg." dataKey="peers" stroke="#8AAE6D" fill="#8AAE6D" fillOpacity={0.15}
                strokeWidth={2} />
              <Legend formatter={(v) => <span style={{ color: '#A5B4FC', fontSize: 12 }}>{v}</span>} />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {/* Legend chips */}
        <div className="flex gap-3 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: '#7C83FD', boxShadow: '0 0 6px rgba(124,131,253,0.6)' }} />
            <span className="text-[#A5B4FC] text-xs">You</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: '#8AAE6D' }} />
            <span className="text-[#A5B4FC] text-xs">Student average</span>
          </div>
        </div>
      </div>

      {/* ── Insights ── */}
      <div className="rounded-2xl p-6" style={glass}>
        <h3 className="text-white font-bold mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00D9FF]" style={{ filter: 'drop-shadow(0 0 8px rgba(0,217,255,0.8))' }} />
          Obsidian AI Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="rounded-2xl p-4 group hover:scale-[1.01] transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${insight.color}10 0%, rgba(11,18,32,0.4) 100%)`,
                  border: `1px solid ${insight.color}25`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${insight.color}18`, border: `1px solid ${insight.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: insight.color, filter: `drop-shadow(0 0 6px ${insight.color}60)` }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-base">{insight.emoji}</span>
                      <h4 className="text-white font-bold text-sm">{insight.category}</h4>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: `${insight.color}18`, color: insight.color, border: `1px solid ${insight.color}30` }}
                      >
                        {insight.difference}% {insight.trend}
                      </span>
                    </div>
                    <p className="text-[#A5B4FC] text-sm">{insight.tip}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Leaderboard ── */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(138,174,109,0.08) 0%, rgba(0,6,20,0.88) 100%)',
          border: '1px solid rgba(138,174,109,0.2)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 0 40px rgba(138,174,109,0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#8AAE6D]" />
            Semester Leaderboard
          </h3>
          <span className="text-[#A5B4FC] text-xs">IIT Delhi · Mar 2026</span>
        </div>

        <div className="space-y-2">
          {topSavers.map((saver, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
              style={{
                background: saver.isYou
                  ? 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(124,131,253,0.12) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: saver.isYou ? '1px solid rgba(0,217,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: saver.isYou ? '0 0 20px rgba(0,217,255,0.1)' : 'none',
              }}
            >
              <span className="text-base w-6 text-center flex-shrink-0">{saver.badge || `#${saver.rank}`}</span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{
                  background: saver.isYou
                    ? 'linear-gradient(135deg, #7C83FD 0%, #6366F1 100%)'
                    : i === 0
                      ? 'linear-gradient(135deg, #FFD700, #E5B800)'
                      : 'linear-gradient(135deg, rgba(124,131,253,0.4) 0%, rgba(30,27,75,0.8) 100%)',
                  boxShadow: saver.isYou ? '0 0 12px rgba(124,131,253,0.5)' : i === 0 ? '0 0 12px rgba(255,215,0,0.4)' : 'none',
                }}
              >
                {saver.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: saver.isYou ? '#fff' : '#A5B4FC' }}>{saver.name}</span>
                  {saver.isYou && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(124,131,253,0.2)', color: '#7C83FD', border: '1px solid rgba(124,131,253,0.3)' }}>
                      you
                    </span>
                  )}
                </div>
                <p className="text-[#A5B4FC] text-xs opacity-70">{saver.college}</p>
              </div>
              <span className="font-black text-sm flex-shrink-0" style={{ color: saver.isYou ? '#8AAE6D' : '#A5B4FC' }}>
                {saver.saved}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-2xl"
          style={{ background: 'rgba(124,131,253,0.06)', border: '1px solid rgba(124,131,253,0.12)' }}>
          <p className="text-[#A5B4FC] text-sm">
            Save <span className="text-[#7C83FD] font-bold">₹500 more</span> this month to reach Top 20% and unlock the
            {' '}<span className="text-[#8AAE6D] font-bold">Campus Saver</span> badge! 🚀
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
              color: '#fff',
              boxShadow: '0 0 20px rgba(0,217,255,0.4)',
            }}
          >
            View Full Leaderboard
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(138,174,109,0.1)', border: '1px solid rgba(138,174,109,0.25)', color: '#8AAE6D' }}
          >
            Invite Friends
          </button>
        </div>
      </div>
    </div>
  );
}