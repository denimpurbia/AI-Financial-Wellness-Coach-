import { useState } from 'react';
import { Brain, CheckCircle, XCircle, BookOpen, Lightbulb, TrendingUp, Zap, Target, RotateCcw, Lock, Play } from 'lucide-react';
import { PageDecor3D } from './FloatingCoins3D';

const glass = {
  background:'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
  border:'1px solid rgba(0,217,255,0.14)',
  backdropFilter:'blur(24px)',
};

interface Quiz { question: string; options: string[]; correct: number; explanation: string }

const QUIZZES: Quiz[] = [
  {
    question: 'What is compound interest?',
    options: ['Interest on principal only', 'Interest on principal + accumulated interest', 'A fixed rate of return', 'Interest paid monthly only'],
    correct: 1,
    explanation: 'Compound interest earns "interest on interest" — making it exponentially powerful for long-term wealth building.',
  },
  {
    question: 'Ideal savings percentage for students?',
    options: ['5–10%', '10–20%', '20–30%', '50%'],
    correct: 1,
    explanation: '10–20% builds a solid safety net without being overly restrictive — the sweet spot for student finances.',
  },
  {
    question: 'Best strategy to avoid impulse buying?',
    options: ['Use credit cards always', 'Wait 24 hours before non-essential purchases', 'Shop when stressed', 'Buy everything on sale'],
    correct: 1,
    explanation: 'The 24-hour rule breaks emotional purchasing urgency — scientifically proven to reduce impulse spending by 40%.',
  },
  {
    question: 'What is an emergency fund?',
    options: ['Money for holidays', '3–6 months of expenses saved', 'Investment portfolio', 'Credit card limit'],
    correct: 1,
    explanation: "An emergency fund of 3–6 months' expenses provides a financial safety net against unexpected events.",
  },
];

function Shield({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const LESSONS = [
  { title:'Budgeting 101',     icon:Target,    color:'#00D9FF', tag:'BEGINNER',     xp:30, pct:100, desc:'Master the 50/30/20 rule and zero-based budgeting for students.' },
  { title:'Investment Basics', icon:TrendingUp, color:'#7C83FD', tag:'INTERMEDIATE', xp:50, pct:65,  desc:'SIP, index funds, and the magic of compound interest for students.' },
  { title:'Credit & Loans',    icon:Zap,        color:'#FFD700', tag:'INTERMEDIATE', xp:45, pct:30,  desc:'Credit scores, education loans, and smart borrowing strategies.' },
  { title:'Tax Planning',      icon:Shield,     color:'#8AAE6D', tag:'ADVANCED',     xp:60, pct:10,  desc:'Section 80C, HRA deductions, and student tax exemptions.' },
  { title:'Stock Market 101',  icon:Brain,      color:'#C850DC', tag:'ADVANCED',     xp:75, pct:0,   desc:'Equity, derivatives, mutual funds — demystified for Gen-Z.', locked:true },
];

export function FinancialLiteracy() {
  const [answers, setAnswers]     = useState<Record<number,number>>({});
  const [revealed, setRevealed]   = useState<Record<number,boolean>>({});
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const answerQuiz = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setAnswers(a => ({...a, [qIdx]: optIdx}));
    setRevealed(r => ({...r, [qIdx]: true}));
  };

  const checkAll = () => {
    const score = QUIZZES.filter((q, i) => answers[i] === q.correct).length;
    setQuizScore(score);
  };

  const reset = () => { setAnswers({}); setRevealed({}); setQuizScore(null); };

  const tips = [
    { icon:Lightbulb,  title:'Emergency Fund',    content:'Save at least 3 months of expenses. Start with ₹1,000 this month.',               color:'#8AAE6D', tag:'BEGINNER'  },
    { icon:TrendingUp, title:'50/30/20 Rule',     content:'50% needs · 30% wants · 20% savings & debt. Simple framework that works.',         color:'#7C83FD', tag:'FRAMEWORK' },
    { icon:Target,     title:'SIP Power',         content:'₹500/month in index fund for 10 years = ₹1.5L+ with 12% return. Start now.',      color:'#00D9FF', tag:'GROWTH'    },
    { icon:Zap,        title:'Student Discounts', content:'GitHub Student, Notion, Spotify, Canva — save ₹2,000+/year on tools.',     color:'#FFD700', tag:'HACK'      },
    { icon:Brain,      title:'Credit Score 101',  content:'Pay all bills on time. Never use >30% of credit limit. Check score monthly free.', color:'#C850DC', tag:'CREDIT'    },
    { icon:BookOpen,   title:'Tax Hack',          content:'Section 80C gives ₹1.5L deduction. Even students with part-time income can claim.',color:'#FF9F4A', tag:'TAX'       },
  ];

  const answeredAll = QUIZZES.every((_, i) => revealed[i]);

  return (
    <div className="relative">
      <PageDecor3D />
      <div className="relative z-10">
        <div className="space-y-6 pb-8">

          {/* ── Header ── */}
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Financial Literacy</h2>
            <p className="text-[#A5B4FC] text-sm mt-1">Neural knowledge modules — learn, quiz, level up</p>
          </div>

          {/* ── Learning Paths ── */}
          <div>
            <h3 className="text-white font-black mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00D9FF]" style={{ filter:'drop-shadow(0 0 6px rgba(0,217,255,0.8))' }} />
              Learning Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LESSONS.map((l, i) => {
                const Icon = l.icon;
                const open = activeLesson === i;
                return (
                  <div key={i}
                    className={`rounded-2xl p-5 transition-all duration-300 ${!l.locked ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-50'}`}
                    style={{ ...glass, border:`1px solid ${l.color}${open?'35':'18'}`, boxShadow: open ? `0 0 30px ${l.color}15` : 'none' }}
                    onClick={() => !l.locked && setActiveLesson(open ? null : i)}>
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background:`${l.color}14`, border:`1px solid ${l.color}28`, boxShadow:`0 0 16px ${l.color}18` }}>
                        {l.locked
                          ? <Lock className="w-5 h-5 text-[#A5B4FC]" />
                          : <Icon className="w-5 h-5" style={{ color:l.color, filter:`drop-shadow(0 0 6px ${l.color}90)` }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-white font-black text-sm">{l.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-black tracking-widest"
                            style={{ background:`${l.color}12`, color:l.color, border:`1px solid ${l.color}25` }}>{l.tag}</span>
                        </div>
                        <p className="text-[#A5B4FC] text-xs leading-relaxed">{l.desc}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#A5B4FC]">{l.pct}% complete</span>
                            <span className="font-bold" style={{ color:l.color }}>+{l.xp} XP</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width:`${l.pct}%`, background:`linear-gradient(90deg,${l.color},${l.color}66)`, boxShadow:`0 0 8px ${l.color}60` }} />
                          </div>
                        </div>
                      </div>
                      {!l.locked && (
                        <button className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background:`${l.color}14`, border:`1px solid ${l.color}25` }}>
                          {l.pct === 100
                            ? <CheckCircle className="w-4 h-4" style={{ color:l.color }} />
                            : <Play className="w-4 h-4" style={{ color:l.color, marginLeft:1 }} />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Daily Tips ── */}
          <div>
            <h3 className="text-white font-black mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#FFD700]" style={{ filter:'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
              Neural Finance Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} className="rounded-2xl p-5 group hover:scale-[1.03] transition-all duration-300"
                    style={{ ...glass, border:`1px solid ${tip.color}18` }}
                    onMouseMove={e => {
                      const el = e.currentTarget as HTMLElement;
                      const r = el.getBoundingClientRect();
                      const x = (e.clientX-r.left)/r.width - 0.5;
                      const y = (e.clientY-r.top)/r.height - 0.5;
                      el.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) scale(1.03)`;
                    }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform=''; }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background:`${tip.color}14`, border:`1px solid ${tip.color}25` }}>
                        <Icon className="w-5 h-5" style={{ color:tip.color, filter:`drop-shadow(0 0 6px ${tip.color}90)` }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold text-sm">{tip.title}</h4>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-black"
                            style={{ background:`${tip.color}10`, color:tip.color }}>{tip.tag}</span>
                        </div>
                        <p className="text-[#A5B4FC] text-xs leading-relaxed">{tip.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Quiz Section ── */}
          <div className="rounded-2xl p-6" style={glass}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-white font-black flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#7C83FD]" style={{ filter:'drop-shadow(0 0 6px rgba(124,131,253,0.8))' }} />
                Neural Finance Quiz
                {quizScore !== null && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black ml-2"
                    style={{
                      background: quizScore >= 3 ? 'rgba(138,174,109,0.15)' : 'rgba(255,82,82,0.15)',
                      color: quizScore >= 3 ? '#8AAE6D' : '#FF5252',
                      border:`1px solid ${quizScore>=3?'rgba(138,174,109,0.3)':'rgba(255,82,82,0.3)'}`
                    }}>
                    {quizScore}/{QUIZZES.length} Correct
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {answeredAll && !quizScore && (
                  <button onClick={checkAll}
                    className="px-4 py-2 rounded-xl text-sm font-black text-white transition-all hover:scale-105"
                    style={{ background:'linear-gradient(135deg,#7C83FD,#00D9FF)', boxShadow:'0 0 16px rgba(0,217,255,0.4)' }}>
                    Check Score
                  </button>
                )}
                <button onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background:'rgba(0,217,255,0.06)', border:'1px solid rgba(0,217,255,0.18)', color:'#00D9FF' }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {QUIZZES.map((q, qIdx) => (
                <div key={qIdx} className="rounded-xl p-5"
                  style={{ background:'rgba(0,217,255,0.03)', border:'1px solid rgba(0,217,255,0.1)' }}>
                  <p className="text-white font-bold mb-4 flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background:'rgba(0,217,255,0.12)', color:'#00D9FF', border:'1px solid rgba(0,217,255,0.25)' }}>
                      {qIdx+1}
                    </span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const sel = answers[qIdx] === oIdx;
                      const isCorr = oIdx === q.correct;
                      const rev = revealed[qIdx];
                      let bg = 'rgba(255,255,255,0.03)', border = 'rgba(0,217,255,0.12)', color = '#A5B4FC';
                      if (rev && isCorr)        { bg='rgba(138,174,109,0.12)'; border='rgba(138,174,109,0.4)'; color='#8AAE6D'; }
                      else if (rev && sel && !isCorr) { bg='rgba(255,82,82,0.1)';  border='rgba(255,82,82,0.4)';  color='#FF5252'; }
                      else if (!rev && sel)     { bg='rgba(0,217,255,0.08)';  border='rgba(0,217,255,0.35)';  color='#00D9FF'; }
                      return (
                        <button key={oIdx} onClick={() => answerQuiz(qIdx, oIdx)} disabled={rev}
                          className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 hover:scale-[1.01] disabled:cursor-default"
                          style={{ background:bg, border:`1px solid ${border}` }}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: rev&&isCorr ? 'rgba(138,174,109,0.2)' : rev&&sel&&!isCorr ? 'rgba(255,82,82,0.2)' : 'rgba(0,217,255,0.06)',
                              border:`1px solid ${border}`
                            }}>
                            {rev && isCorr
                              ? <CheckCircle className="w-3.5 h-3.5 text-[#8AAE6D]" />
                              : rev && sel && !isCorr
                                ? <XCircle className="w-3.5 h-3.5 text-[#FF5252]" />
                                : <span className="text-[10px] font-black" style={{ color }}>{String.fromCharCode(65+oIdx)}</span>}
                          </div>
                          <span className="text-sm" style={{ color }}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {revealed[qIdx] && (
                    <div className="mt-3 p-3 rounded-xl flex items-start gap-2"
                      style={{ background:'rgba(0,217,255,0.05)', border:'1px solid rgba(0,217,255,0.15)' }}>
                      <Lightbulb className="w-4 h-4 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                      <p className="text-[#A5B4FC] text-xs leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {quizScore !== null && (
              <div className="mt-5 p-5 rounded-xl text-center"
                style={{
                  background: quizScore>=3 ? 'rgba(138,174,109,0.08)' : 'rgba(255,82,82,0.06)',
                  border:`1px solid ${quizScore>=3?'rgba(138,174,109,0.25)':'rgba(255,82,82,0.25)'}`
                }}>
                <p className="text-white font-black text-lg mb-1">
                  {quizScore >= 3 ? `🏆 ${quizScore}/4 — Neural Certified!` : `📚 ${quizScore}/4 — Review & Retry`}
                </p>
                <p className="text-[#A5B4FC] text-sm">
                  {quizScore >= 3
                    ? `+${quizScore*15} XP earned. Keep learning to reach Gold status!`
                    : 'Review the explanations and try again to earn full XP.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
