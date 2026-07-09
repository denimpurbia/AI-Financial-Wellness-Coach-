import { useState } from 'react';
import { WelcomePage }       from './components/WelcomePage';
import { LoginPage }         from './components/LoginPage';
import { SignupPage }        from './components/SignupPage';
import { LandingPage }       from './components/LandingPage';
import { ChatbotInterface }  from './components/ChatbotInterface';
import { ExpenseTracking }   from './components/ExpenseTracking';
import { BudgetDashboard }   from './components/BudgetDashboard';
import { PredictiveAlerts }  from './components/PredictiveAlerts';
import { GamifiedSavings }   from './components/GamifiedSavings';
import { FinancialLiteracy } from './components/FinancialLiteracy';
import { PeerComparison }    from './components/PeerComparison';
import { ProfilePage }       from './components/ProfilePage';
import {
  LayoutDashboard, MessageSquare, Receipt, PieChart,
  Bell, Trophy, GraduationCap, Users, Menu, X,
  LogOut, UserCircle, Sparkles, Zap,
} from 'lucide-react';
import { Logo } from './components/Logo';

type Screen =
  | 'welcome' | 'login' | 'signup' | 'landing'
  | 'dashboard' | 'chat' | 'expenses' | 'budget'
  | 'alerts' | 'gamified' | 'literacy' | 'comparison' | 'profile';

const NAV_ITEMS = [
  { id: 'dashboard'  as Screen, name: 'Dashboard',  icon: LayoutDashboard },
  { id: 'chat'       as Screen, name: 'Obsidian AI',  icon: MessageSquare   },
  { id: 'expenses'   as Screen, name: 'Expenses',   icon: Receipt         },
  { id: 'budget'     as Screen, name: 'Budget',     icon: PieChart        },
  { id: 'alerts'     as Screen, name: 'Alerts',     icon: Bell            },
  { id: 'gamified'   as Screen, name: 'Challenges', icon: Trophy          },
  { id: 'literacy'   as Screen, name: 'Learn',      icon: GraduationCap   },
  { id: 'comparison' as Screen, name: 'Compare',    icon: Users           },
];

export default function App() {
  const [screen, setScreen]     = useState<Screen>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const go = (s: Screen) => { setScreen(s); setSidebarOpen(false); };

  /* ── pre-auth screens ── */
  if (screen === 'welcome') return <WelcomePage onGetStarted={() => go('login')} />;
  if (screen === 'login')   return <LoginPage   onLogin={(u) => { setUsername(u); go('dashboard'); }} onSignup={() => go('signup')} />;
  if (screen === 'signup')  return <SignupPage   onSignup={(u) => { setUsername(u); go('dashboard'); }} onBackToLogin={() => go('login')} />;
  if (screen === 'landing') return <LandingPage  onGetStarted={() => go('login')} />;

  /* ── render main content ── */
  const renderContent = () => {
    switch (screen) {
      case 'chat':       return <ChatbotInterface isFullScreen />;
      case 'expenses':   return <ExpenseTracking />;
      case 'budget':     return <BudgetDashboard />;
      case 'alerts':     return <PredictiveAlerts />;
      case 'gamified':   return <GamifiedSavings />;
      case 'literacy':   return <FinancialLiteracy />;
      case 'comparison': return <PeerComparison />;
      case 'profile':    return <ProfilePage username={username} initialPhoto={profilePhoto} onUpdateProfile={(name, photo) => { setUsername(name); setProfilePhoto(photo); }} />;
      default:           return <BudgetDashboard />;
    }
  };

  const mainNav    = NAV_ITEMS;
  const activeItem = NAV_ITEMS.find(n => n.id === screen);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #060B18 0%, #0D0A2E 50%, #060B18 100%)' }}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(13,10,46,0.82) 0%, rgba(6,11,24,0.9) 100%)',
          borderColor: 'rgba(0,217,255,0.1)',
          backdropFilter: 'blur(28px)',
        }}
      >
        <div className="h-full flex flex-col">

          {/* Logo */}
          <div className="p-5" style={{ borderBottom: '1px solid rgba(0,217,255,0.08)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Logo />
                <div>
                  <h2 className="text-base font-black tracking-tight leading-none">
                    <span className="text-white">Budget</span>{' '}
                    <span className="text-blue-300">Sathi</span>
                  </h2>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#A5B4FC] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main nav */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {mainNav.map((item) => {
              const Icon     = item.icon;
              const isActive = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(124,131,253,0.12) 100%)',
                          border: '1px solid rgba(0,217,255,0.25)',
                          boxShadow: '0 0 16px rgba(0,217,255,0.12)',
                          color: '#fff',
                        }
                      : { border: '1px solid transparent', color: '#8B9CC8' }
                  }
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={
                      isActive
                        ? {
                            background: 'linear-gradient(135deg, #00D9FF 0%, #7C83FD 100%)',
                            boxShadow: '0 0 14px rgba(0,217,255,0.5)',
                          }
                        : { background: 'rgba(124,131,253,0.07)' }
                    }
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : '#8B9CC8' }} />
                  </div>
                  <span className="font-semibold text-sm">{item.name}</span>
                  {item.id === 'alerts' && (
                    <span
                      className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(255,82,82,0.18)', color: '#FF5252', border: '1px solid rgba(255,82,82,0.3)' }}
                    >
                      1
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* XP bar */}
          <div className="px-3 pb-2">
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,255,0.06) 0%, rgba(11,18,32,0.5) 100%)',
                border: '1px solid rgba(0,217,255,0.12)',
              }}
            >
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold" style={{ color: '#00D9FF' }}>Lv. 5 · 850 XP</span>
                <span className="text-[#8B9CC8]">1000</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,217,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: '85%',
                    background: 'linear-gradient(90deg, #7C83FD 0%, #00D9FF 100%)',
                    boxShadow: '0 0 10px rgba(0,217,255,0.5)',
                  }}
                />
              </div>
              <p className="text-[#8B9CC8] text-xs mt-2">150 XP to Level 6</p>
            </div>
          </div>

          {/* Profile + logout */}
          <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid rgba(0,217,255,0.07)' }}>
            <button
              onClick={() => go('profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
              style={
                screen === 'profile'
                  ? {
                      background: 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(124,131,253,0.12) 100%)',
                      border: '1px solid rgba(0,217,255,0.25)',
                      color: '#fff',
                    }
                  : { border: '1px solid transparent', color: '#8B9CC8' }
              }
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={
                  screen === 'profile'
                    ? { background: 'linear-gradient(135deg, #00D9FF 0%, #7C83FD 100%)', boxShadow: '0 0 14px rgba(0,217,255,0.5)' }
                    : { background: 'rgba(124,131,253,0.07)' }
                }
              >
                <UserCircle className="w-4 h-4" style={{ color: screen === 'profile' ? '#fff' : '#8B9CC8' }} />
              </div>
              <span className="font-semibold text-sm">Profile</span>
            </button>

            <button
              onClick={() => go('welcome')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
              style={{ border: '1px solid transparent', color: '#8B9CC8' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,82,82,0.07)' }}>
                <LogOut className="w-4 h-4 text-[#FF5252]" />
              </div>
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Header */}
        <header
          className="px-6 py-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(13,10,46,0.75) 0%, rgba(6,11,24,0.75) 100%)',
            borderBottom: '1px solid rgba(0,217,255,0.08)',
            backdropFilter: 'blur(28px)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#8B9CC8] hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-initial min-w-0">
              <h1 className="text-lg font-black text-white truncate">
                {activeItem?.name ?? 'Dashboard'}
              </h1>
              {username && (
                <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: '#00D9FF' }}>
                  Welcome back, {username}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* AI Active pill */}
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,217,255,0.07)', border: '1px solid rgba(0,217,255,0.18)' }}
              >
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping absolute" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                </div>
                <span className="text-[#00D9FF] text-xs font-semibold tracking-wide">AI Active</span>
              </div>

              {/* XP chip */}
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(124,131,253,0.08)', border: '1px solid rgba(124,131,253,0.2)' }}
              >
                <Zap className="w-3.5 h-3.5 text-[#7C83FD]" style={{ filter: 'drop-shadow(0 0 4px rgba(124,131,253,0.7))' }} />
                <span className="text-[#7C83FD] text-xs font-bold">850 XP</span>
              </div>

              {/* Alert bell */}
              <button
                onClick={() => go('alerts')}
                className="relative p-2 rounded-xl transition-all hover:scale-105"
                style={{ background: 'rgba(255,82,82,0.07)', border: '1px solid rgba(255,82,82,0.15)' }}
              >
                <Bell className="w-4 h-4 text-[#FF5252]" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF5252] animate-pulse" />
              </button>

              {/* Avatar → profile */}
              <button
                onClick={() => go('profile')}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white transition-all hover:scale-105 overflow-hidden"
                style={{
                  backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: screen === 'profile'
                    ? '0 0 24px rgba(0,217,255,0.6)'
                    : '0 0 14px rgba(0,217,255,0.3)',
                  border: screen === 'profile'
                    ? '2px solid rgba(0,217,255,0.6)'
                    : '2px solid transparent',
                }}
              >
                {!profilePhoto && (username ? username.charAt(0).toUpperCase() : 'U')}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>

        {screen !== 'chat' && <ChatbotInterface isFullScreen={false} />}
      </main>
    </div>
  );
}