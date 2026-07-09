import { useState, useRef } from 'react';
import {
  User, Mail, Phone, GraduationCap, MapPin, Edit3, Camera,
  Trophy, Flame, Star, Shield, Zap, TrendingUp, Target,
  Bell, Lock, CreditCard, ChevronRight, Award, Crown,
  BookOpen, CheckCircle, Calendar, BarChart2, Settings
} from 'lucide-react';

export function ProfilePage({ username, initialPhoto, onUpdateProfile }: { username?: string, initialPhoto?: string | null, onUpdateProfile?: (name: string, photo: string | null) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(username || 'Siddharth Kumar');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(initialPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        if (onUpdateProfile) {
          onUpdateProfile(name, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (onUpdateProfile) {
      onUpdateProfile(newName, profilePhoto);
    }
  };

  const stats = [
    { label: 'Total Saved', value: '₹12,400', icon: TrendingUp, color: '#8AAE6D', glow: 'rgba(138, 174, 109, 0.4)' },
    { label: 'Budget Score', value: '94/100', icon: Target, color: '#7C83FD', glow: 'rgba(124, 131, 253, 0.4)' },
    { label: 'Day Streak', value: '14 🔥', icon: Flame, color: '#FF9F4A', glow: 'rgba(255, 159, 74, 0.4)' },
    { label: 'Total XP', value: '850 XP', icon: Zap, color: '#7C83FD', glow: 'rgba(124, 131, 253, 0.4)' },
  ];

  const earnedBadges = [
    { name: 'Budget Ninja', icon: Zap, color: '#7C83FD', desc: 'Under budget 30 days' },
    { name: 'Savings Guru', icon: Crown, color: '#8AAE6D', desc: 'Saved ₹5K in a month' },
    { name: 'Tracker Pro', icon: Star, color: '#FFD700', desc: 'Logged 7 days straight' },
  ];

  const lockedBadges = [
    { name: 'Smart Spender', icon: Shield, desc: '10 smart decisions' },
    { name: 'Streak Master', icon: Flame, desc: '30-day streak' },
    { name: 'Scholar', icon: BookOpen, desc: 'All quizzes done' },
  ];

  const recentActivity = [
    { action: 'Completed Cook at Home Challenge', xp: '+50 XP', time: '2h ago', icon: Trophy, color: '#8AAE6D' },
    { action: 'Under food budget this week', xp: '+25 XP', time: '1d ago', icon: CheckCircle, color: '#7C83FD' },
    { action: 'Answered 5 quiz questions', xp: '+30 XP', time: '2d ago', icon: BookOpen, color: '#FFD700' },
    { action: 'New savings streak: 14 days', xp: '+40 XP', time: '3d ago', icon: Flame, color: '#FF9F4A' },
  ];

  const settingsOptions = [
    { icon: Bell, label: 'Notification Preferences', desc: 'Manage alerts & reminders', color: '#7C83FD' },
    { icon: Lock, label: 'Privacy & Security', desc: 'Password & 2FA settings', color: '#8AAE6D' },
    { icon: CreditCard, label: 'Linked Accounts', desc: 'Manage bank connections', color: '#FFD700' },
    { icon: BarChart2, label: 'Data & Analytics', desc: 'Export your financial data', color: '#7C83FD' },
    { icon: GraduationCap, label: 'Student Verification', desc: 'College ID verified ✓', color: '#8AAE6D' },
    { icon: Settings, label: 'App Preferences', desc: 'Theme, currency, language', color: '#A5B4FC' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'achievements' as const, label: 'Achievements' },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ── Profile Hero Card ── */}
      <div
        className="relative rounded-3xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(11, 18, 32, 0.9) 100%)',
          border: '1px solid rgba(124, 131, 253, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(124, 131, 253, 0.08)',
        }}
      >
        {/* Background glow orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7C83FD 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8AAE6D 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white relative overflow-hidden"
              style={{
                backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'linear-gradient(135deg, #7C83FD 0%, #6366F1 50%, #8AAE6D 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 40px rgba(124, 131, 253, 0.5), 0 0 80px rgba(124, 131, 253, 0.2)',
              }}
            >
              {!profilePhoto && <span>{name ? name.charAt(0).toUpperCase() : 'S'}</span>}
              {/* shimmer overlay */}
              <div className="absolute inset-0 opacity-30"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7C83FD, #6366F1)', border: '2px solid #0B1220', zIndex: 10 }}
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            {/* Level badge */}
            <div
              className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8AAE6D, #6B9A4F)', border: '2px solid #0B1220', fontSize: '10px' }}
            >
              LVL 5
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editMode ? (
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="text-white text-2xl font-black tracking-tight bg-transparent border-b-2 border-[#7C83FD]/50 outline-none w-full max-w-sm"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-white text-2xl font-black tracking-tight">{name}</h2>
                )}
                <p className="text-[#A5B4FC] text-sm mt-0.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  B.Tech CSE, 3rd Year · IIT Delhi
                </p>
                <p className="text-[#7C83FD] text-xs mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  New Delhi, India
                </p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: editMode
                    ? 'linear-gradient(135deg, #7C83FD, #6366F1)'
                    : 'rgba(124, 131, 253, 0.12)',
                  border: '1px solid rgba(124, 131, 253, 0.3)',
                  color: '#7C83FD',
                }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>

            {/* XP Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#A5B4FC]">Progress to Level 6</span>
                <span className="text-[#7C83FD] font-semibold">850 / 1000 XP</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(124, 131, 253, 0.1)', border: '1px solid rgba(124, 131, 253, 0.15)' }}>
                <div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: '85%',
                    background: 'linear-gradient(90deg, #7C83FD 0%, #8AAE6D 100%)',
                    boxShadow: '0 0 12px rgba(124, 131, 253, 0.7)',
                  }}
                >
                  <div className="absolute inset-0 animate-pulse opacity-40"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i}
                className="rounded-2xl p-4 text-center group hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}12 0%, ${stat.color}06 100%)`,
                  border: `1px solid ${stat.color}25`,
                }}
              >
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.glow})` }} />
                <p className="text-white font-black text-lg" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[#A5B4FC] text-xs mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div
        className="flex gap-1 p-1 rounded-2xl"
        style={{ background: 'rgba(30, 27, 75, 0.5)', border: '1px solid rgba(124, 131, 253, 0.15)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={
              activeTab === tab.id
                ? {
                    background: 'linear-gradient(135deg, #7C83FD 0%, #6366F1 100%)',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(124, 131, 253, 0.4)',
                  }
                : { color: '#A5B4FC' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Personal Info */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(11, 18, 32, 0.6) 100%)',
              border: '1px solid rgba(124, 131, 253, 0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-[#7C83FD]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: username || 'Siddharth Kumar', icon: User },
                { label: 'Email', value: 'siddharth@iitd.ac.in', icon: Mail },
                { label: 'Phone', value: '+91 98765 43210', icon: Phone },
                { label: 'Roll No.', value: '2021CS10234', icon: GraduationCap },
                { label: 'College', value: 'IIT Delhi', icon: MapPin },
                { label: 'Member Since', value: 'August 2023', icon: Calendar },
              ].map((field, i) => {
                const Icon = field.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl group"
                    style={{ background: 'rgba(124, 131, 253, 0.05)', border: '1px solid rgba(124, 131, 253, 0.1)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(124, 131, 253, 0.1)' }}>
                      <Icon className="w-4 h-4 text-[#7C83FD]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#A5B4FC] text-xs">{field.label}</p>
                      {editMode ? (
                        <input
                          defaultValue={field.value}
                          className="text-white text-sm font-medium bg-transparent border-b border-[#7C83FD]/40 outline-none w-full"
                        />
                      ) : (
                        <p className="text-white text-sm font-medium truncate">{field.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(11, 18, 32, 0.6) 100%)',
              border: '1px solid rgba(124, 131, 253, 0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF9F4A]" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i}
                    className="flex items-center gap-4 p-3 rounded-xl group hover:scale-[1.01] transition-all duration-200"
                    style={{ background: 'rgba(124, 131, 253, 0.04)', border: '1px solid rgba(124, 131, 253, 0.08)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.action}</p>
                      <p className="text-[#A5B4FC] text-xs">{item.time}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={{ background: '#8AAE6D18', color: '#8AAE6D', border: '1px solid #8AAE6D30' }}>
                      {item.xp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {activeTab === 'achievements' && (
        <div className="space-y-5">
          {/* Earned Badges */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(11, 18, 32, 0.6) 100%)',
              border: '1px solid rgba(124, 131, 253, 0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFD700]" />
                Earned Badges
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: '#8AAE6D18', color: '#8AAE6D', border: '1px solid #8AAE6D30' }}>
                  3 / 6
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {earnedBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i}
                    className="relative rounded-2xl p-5 flex items-center gap-4 group hover:scale-105 transition-all duration-300 cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${badge.color}15 0%, ${badge.color}08 100%)`,
                      border: `1px solid ${badge.color}30`,
                      boxShadow: `0 8px 24px ${badge.color}10, 0 0 40px ${badge.color}08`,
                    }}
                  >
                    {/* Sparkle dots */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: badge.color, opacity: 0.6 }} />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}99 100%)`,
                        boxShadow: `0 0 20px ${badge.color}50`,
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{badge.name}</p>
                      <p className="text-[#A5B4FC] text-xs">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <h4 className="text-[#A5B4FC] text-sm font-semibold mt-6 mb-4 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Locked Badges
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {lockedBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i}
                    className="rounded-2xl p-4 flex items-center gap-3 opacity-50"
                    style={{
                      background: 'rgba(124, 131, 253, 0.04)',
                      border: '1px solid rgba(124, 131, 253, 0.1)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(124, 131, 253, 0.08)' }}>
                      <Icon className="w-5 h-5 text-[#A5B4FC]" />
                    </div>
                    <div>
                      <p className="text-[#A5B4FC] font-semibold text-sm">{badge.name}</p>
                      <p className="text-[#A5B4FC] text-xs opacity-70">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning milestones */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(138, 174, 109, 0.08) 0%, rgba(11, 18, 32, 0.6) 100%)',
              border: '1px solid rgba(138, 174, 109, 0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8AAE6D]" />
              Learning Milestones
            </h3>
            {[
              { label: 'Budgeting Basics', pct: 100, color: '#8AAE6D' },
              { label: 'Investment Fundamentals', pct: 65, color: '#7C83FD' },
              { label: 'Credit & Loans', pct: 30, color: '#7C83FD' },
              { label: 'Tax Planning', pct: 10, color: '#A5B4FC' },
            ].map((m, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#A5B4FC]">{m.label}</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124, 131, 253, 0.1)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.pct}%`,
                      background: `linear-gradient(90deg, ${m.color} 0%, ${m.color}80 100%)`,
                      boxShadow: `0 0 8px ${m.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(11, 18, 32, 0.6) 100%)',
              border: '1px solid rgba(124, 131, 253, 0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {settingsOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <button
                  key={i}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-all duration-200 group"
                  style={{ borderBottom: i < settingsOptions.length - 1 ? '1px solid rgba(124, 131, 253, 0.08)' : 'none' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${opt.color}15`, border: `1px solid ${opt.color}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: opt.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{opt.label}</p>
                    <p className="text-[#A5B4FC] text-xs">{opt.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A5B4FC] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Danger zone */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255, 82, 82, 0.04)',
              border: '1px solid rgba(255, 82, 82, 0.15)',
            }}
          >
            <p className="text-[#FF5252] text-sm font-semibold mb-3">Danger Zone</p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)', color: '#FF5252' }}
              >
                Reset Data
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: 'rgba(255, 82, 82, 0.18)', border: '1px solid rgba(255, 82, 82, 0.4)', color: '#FF5252' }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
