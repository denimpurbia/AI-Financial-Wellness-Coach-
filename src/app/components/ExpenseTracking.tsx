import { useState } from 'react';
import { Plus, Coffee, Home, Car, Popcorn, ShoppingCart, ShoppingBag, Zap, TrendingDown, Trash2, Search, Filter } from 'lucide-react';
import { PageDecor3D } from './FloatingCoins3D';

interface Expense { id: number; amount: number; category: string; description: string; date: string }

const CAT_META: Record<string, { icon: any; color: string; bg: string }> = {
  Food:          { icon: Coffee,      color: '#00D9FF', bg: 'rgba(0,217,255,0.1)'   },
  Rent:          { icon: Home,        color: '#8AAE6D', bg: 'rgba(138,174,109,0.1)' },
  Travel:        { icon: Car,         color: '#A5B4FC', bg: 'rgba(165,180,252,0.1)' },
  Entertainment: { icon: Popcorn,     color: '#7C83FD', bg: 'rgba(124,131,253,0.1)' },
  Shopping:      { icon: ShoppingCart,color: '#FFD700', bg: 'rgba(255,215,0,0.1)'   },
  Groceries:     { icon: ShoppingBag, color: '#8AAE6D', bg: 'rgba(138,174,109,0.1)' },
  Other:         { icon: Zap,         color: '#FF9F4A', bg: 'rgba(255,159,74,0.1)'  },
};

const CATS = Object.keys(CAT_META);

const glass = {
  background: 'linear-gradient(135deg, rgba(0,6,20,0.82) 0%, rgba(10,4,30,0.88) 100%)',
  border: '1px solid rgba(0,217,255,0.14)',
  backdropFilter: 'blur(24px)',
};

export function ExpenseTracking() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id:1, amount:250,  category:'Food',          description:'Lunch at café',       date:'2026-03-26' },
    { id:2, amount:3000, category:'Rent',           description:'Monthly rent',        date:'2026-03-25' },
    { id:3, amount:150,  category:'Travel',         description:'Bus pass',            date:'2026-03-24' },
    { id:4, amount:200,  category:'Entertainment',  description:'Movie tickets',       date:'2026-03-23' },
    { id:5, amount:480,  category:'Groceries',      description:'Weekly groceries',    date:'2026-03-22' },
    { id:6, amount:99,   category:'Shopping',       description:'Amazon delivery',     date:'2026-03-21' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', category: 'Food', description: '' });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [focusField, setFocusField] = useState('');

  const addExpense = () => {
    if (!formData.amount || !formData.description) return;
    setExpenses([{
      id: Date.now(), amount: parseFloat(formData.amount),
      category: formData.category, description: formData.description,
      date: new Date().toISOString().split('T')[0],
    }, ...expenses]);
    setFormData({ amount: '', category: 'Food', description: '' });
    setShowForm(false);
  };

  const deleteExpense = (id: number) => setExpenses(e => e.filter(x => x.id !== id));

  const filtered = expenses.filter(e => {
    const matchCat = filterCat === 'All' || e.category === filterCat;
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  // Category totals for mini bar chart
  const catTotals = CATS.map(c => ({
    name: c, total: expenses.filter(e => e.category === c).reduce((s, x) => s + x.amount, 0),
    ...CAT_META[c],
  })).filter(c => c.total > 0).sort((a,b) => b.total - a.total);
  const maxTotal = catTotals[0]?.total || 1;

  const inputStyle = (key: string) => ({
    background: 'rgba(0,217,255,0.04)',
    border: `1px solid ${focusField === key ? 'rgba(0,217,255,0.45)' : 'rgba(0,217,255,0.16)'}`,
    backdropFilter: 'blur(12px)',
    color: '#E0E8FF',
    transition: 'border-color 0.3s',
  });

  return (
    <div className="space-y-6 pb-8">
      <PageDecor3D />

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Expense Tracking</h2>
          <p className="text-[#A5B4FC] text-sm mt-0.5">
            <span style={{ color:'#00D9FF', fontFamily:'monospace' }}>{filtered.length}</span> transactions ·
            <span className="ml-1" style={{ color:'#FF5252' }}>₹{total.toLocaleString()}</span> total
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
          style={{
            background: showForm ? 'rgba(255,82,82,0.15)' : 'linear-gradient(135deg,#7C83FD,#00D9FF)',
            border: showForm ? '1px solid rgba(255,82,82,0.4)' : 'none',
            boxShadow: showForm ? 'none' : '0 0 20px rgba(0,217,255,0.35)',
          }}>
          <Plus className="w-4 h-4" style={{ transform: showForm ? 'rotate(45deg)' : 'none', transition:'transform 0.3s' }} />
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ ...glass, border:'1px solid rgba(0,217,255,0.25)', boxShadow:'0 0 40px rgba(0,217,255,0.08)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background:'linear-gradient(90deg,transparent,#00D9FF,transparent)', animation:'scan-line 4s linear infinite' }} />
          <h3 className="text-white font-black mb-5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
            New Expense Entry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">Amount (₹)</label>
              <input type="number" placeholder="0.00" value={formData.amount}
                onChange={e => setFormData(p => ({...p, amount: e.target.value}))}
                onFocus={() => setFocusField('amount')} onBlur={() => setFocusField('')}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={inputStyle('amount')} />
            </div>
            <div>
              <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">Category</label>
              <select value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                style={{ ...inputStyle('cat'), color:'#E0E8FF' }}>
                {CATS.map(c => <option key={c} value={c} style={{ background:'#0D0A2E' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-2">Description</label>
              <input type="text" placeholder="What did you spend on?" value={formData.description}
                onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                onFocus={() => setFocusField('desc')} onBlur={() => setFocusField('')}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={inputStyle('desc')} />
            </div>
          </div>
          <button onClick={addExpense}
            className="mt-4 px-8 py-3 rounded-xl font-black text-white transition-all hover:scale-105"
            style={{ background:'linear-gradient(135deg,#7C83FD,#00D9FF)', boxShadow:'0 0 20px rgba(0,217,255,0.4)' }}>
            <Zap className="w-4 h-4 inline mr-2" />Log Expense
          </button>
        </div>
      )}

      {/* ── Stats + Chart Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Totals */}
        <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { label:'This Month', val:`₹${expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()}`, color:'#FF5252', sub:'Total spent' },
            { label:'This Week',  val:'₹850',   color:'#00D9FF', sub:'12% less than last week' },
            { label:'Avg Daily',  val:'₹121',   color:'#8AAE6D', sub:'Within target' },
          ].map((s,i)=>(
            <div key={i} className="rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300" style={glass}>
              <p className="text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-black" style={{ color:s.color }}>{s.val}</p>
              <p className="text-[#A5B4FC] text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown bar chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={glass}>
          <h3 className="text-white font-black mb-5 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#00D9FF]" />
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {catTotals.map((c, i) => {
              const Icon = c.icon;
              const pct = (c.total / maxTotal) * 100;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c.bg, border:`1px solid ${c.color}25` }}>
                    <Icon className="w-4 h-4" style={{ color:c.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white font-semibold">{c.name}</span>
                      <span className="font-bold" style={{ color:c.color }}>₹{c.total.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width:`${pct}%`, background:`linear-gradient(90deg,${c.color}cc,${c.color}55)`, boxShadow:`0 0 8px ${c.color}60` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C83FD]" />
          <input type="text" placeholder="Search expenses..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
            style={{ background:'rgba(0,217,255,0.04)', border:'1px solid rgba(0,217,255,0.15)', backdropFilter:'blur(12px)', color:'#E0E8FF' }} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#7C83FD]" />
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...CATS].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={filterCat === c ? { background:'linear-gradient(135deg,#7C83FD,#00D9FF)', color:'#fff', boxShadow:'0 0 12px rgba(0,217,255,0.35)' }
                  : { background:'rgba(0,217,255,0.05)', border:'1px solid rgba(0,217,255,0.14)', color:'#8B9CC8' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Expense List ── */}
      <div className="rounded-2xl overflow-hidden" style={glass}>
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom:'1px solid rgba(0,217,255,0.08)' }}>
          <h3 className="text-white font-black">Transaction Log</h3>
          <span className="text-[#00D9FF] text-xs font-mono">{filtered.length} entries</span>
        </div>
        <div className="divide-y" style={{ divideColor:'rgba(0,217,255,0.05)' }}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#A5B4FC]">No transactions found</div>
          ) : (
            filtered.map((exp) => {
              const meta = CAT_META[exp.category] || CAT_META.Other;
              const Icon = meta.icon;
              return (
                <div key={exp.id}
                  className="flex items-center gap-4 px-6 py-4 group hover:bg-white/[0.02] transition-all duration-200"
                  style={{ borderBottom:'1px solid rgba(0,217,255,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:meta.bg, border:`1px solid ${meta.color}22` }}>
                    <Icon className="w-5 h-5" style={{ color:meta.color, filter:`drop-shadow(0 0 6px ${meta.color}80)` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{exp.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                        style={{ background:meta.bg, color:meta.color }}>{exp.category}</span>
                      <span className="text-[#A5B4FC] text-xs">{new Date(exp.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black" style={{ color:'#FF5252' }}>−₹{exp.amount.toLocaleString()}</span>
                    <button onClick={() => deleteExpense(exp.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/15 transition-all"
                      style={{ color:'#FF5252' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}