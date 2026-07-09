import { useState } from 'react';
import { Users, Plus, Trash2, DollarSign, Bell, Check } from 'lucide-react';

interface SplitPerson {
  id: string;
  name: string;
  phone: string;
  amount: number;
}

interface SmartSplitData {
  id: string;
  totalAmount: number;
  people: SplitPerson[];
  splitType: 'equal' | 'custom';
  reminderFrequency: 'once' | 'weekly' | 'monthly';
  createdDate: string;
  nextPaymentDate: string;
  saved: boolean;
}

interface SmartSplitProps {
  onSplitSaved?: (splitData: SmartSplitData) => void;
  phoneContacts?: Array<{ id: string; name: string; phone: string }>;
}

export function SmartSplit({ onSplitSaved, phoneContacts = [] }: SmartSplitProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [reminderFrequency, setReminderFrequency] = useState<'once' | 'weekly' | 'monthly'>('monthly');
  const [people, setPeople] = useState<SplitPerson[]>([]);
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedSplit, setSavedSplit] = useState<SmartSplitData | null>(null);

  const numPeople = people.length;
  const amount = parseFloat(totalAmount) || 0;
  const amountPerPerson = numPeople > 0 ? amount / numPeople : 0;

  const addPerson = () => {
    const newPerson: SplitPerson = {
      id: String(people.length + 1),
      name: '',
      phone: '',
      amount: splitType === 'equal' ? amountPerPerson : 0
    };
    setPeople([...people, newPerson]);
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((p: SplitPerson) => p.id !== id));
  };

  const updatePerson = (id: string, field: string, value: string | number) => {
    setPeople(people.map((p: SplitPerson) =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSplitTypeChange = (type: 'equal' | 'custom') => {
    setSplitType(type);
    if (type === 'equal' && numPeople > 0) {
      setPeople(people.map((p: SplitPerson) => ({ ...p, amount: amountPerPerson })));
    }
  };

  const handleSaveSplit = () => {
    if (!totalAmount || people.length === 0 || !nextPaymentDate) {
      alert('Please fill all required fields');
      return;
    }

    const newSplit: SmartSplitData = {
      id: String(Date.now()),
      totalAmount: amount,
      people,
      splitType,
      reminderFrequency,
      createdDate: new Date().toLocaleDateString(),
      nextPaymentDate,
      saved: true
    };

    setSavedSplit(newSplit);
    setShowSuccess(true);
    
    onSplitSaved?.(newSplit);

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
      setTotalAmount('');
      setPeople([]);
      setNextPaymentDate('');
      setSplitType('equal');
      setReminderFrequency('monthly');
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Smart Split Card */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-2xl p-6 text-left hover:scale-[1.02] transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(168, 85, 247, 0.1)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Smart Split</h3>
                <p className="text-sm text-purple-300">Divide money with friends easily</p>
              </div>
            </div>
            <Plus className="w-5 h-5 text-purple-400" />
          </div>
        </button>
      )}

      {/* Split Form */}
      {isOpen && (
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Smart Split & Reminder</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#A5B4FC] hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-[#A5B4FC] font-semibold mb-2">Total Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-white text-xl">₹</span>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalAmount(e.target.value)}
                  placeholder="Enter amount to split"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-[#1a1754]/50 border border-purple-500/30 text-white placeholder-[#7C83FD]/50 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Split Type Selection */}
            <div>
              <label className="block text-[#A5B4FC] font-semibold mb-3">Split Type</label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSplitTypeChange('equal')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    splitType === 'equal'
                      ? 'bg-purple-500/40 border border-purple-400 text-white'
                      : 'bg-[#1a1754]/30 border border-purple-500/20 text-[#A5B4FC] hover:border-purple-500/40'
                  }`}
                >
                  Equal Split
                </button>
                <button
                  onClick={() => handleSplitTypeChange('custom')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    splitType === 'custom'
                      ? 'bg-purple-500/40 border border-purple-400 text-white'
                      : 'bg-[#1a1754]/30 border border-purple-500/20 text-[#A5B4FC] hover:border-purple-500/40'
                  }`}
                >
                  Custom Amount
                </button>
              </div>
            </div>

            {/* People List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[#A5B4FC] font-semibold">People ({numPeople})</label>
                <span className="text-purple-400 text-sm">
                  {amount > 0 && splitType === 'equal' && numPeople > 0
                    ? `₹${amountPerPerson.toFixed(2)} each`
                    : ''}
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {people.map((person, idx) => (
                  <div key={person.id} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePerson(person.id, 'name', e.target.value)}
                        placeholder="Name"
                        className="w-full px-3 py-2 rounded-lg bg-[#1a1754]/50 border border-purple-500/20 text-white placeholder-[#7C83FD]/50 focus:outline-none focus:border-purple-400 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="tel"
                        value={person.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePerson(person.id, 'phone', e.target.value)}
                        placeholder="Phone"
                        className="w-full px-3 py-2 rounded-lg bg-[#1a1754]/50 border border-purple-500/20 text-white placeholder-[#7C83FD]/50 focus:outline-none focus:border-purple-400 text-sm"
                      />
                    </div>
                    {splitType === 'custom' && (
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute right-3 top-2 text-[#7C83FD] text-xs">₹</span>
                          <input
                            type="number"
                            value={person.amount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePerson(person.id, 'amount', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full px-3 py-2 pr-6 rounded-lg bg-[#1a1754]/50 border border-purple-500/20 text-white placeholder-[#7C83FD]/50 focus:outline-none focus:border-purple-400 text-sm"
                          />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => removePerson(person.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addPerson}
                className="w-full mt-3 py-2 px-4 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:text-purple-200 transition font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Person
              </button>
            </div>

            {/* Reminder Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A5B4FC] font-semibold mb-2">Reminder Frequency</label>
                <select
                  value={reminderFrequency}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReminderFrequency(e.target.value as 'once' | 'weekly' | 'monthly')}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1754]/50 border border-purple-500/20 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="once">One time</option>
                  <option value="weekly">Every week</option>
                  <option value="monthly">Every month</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A5B4FC] font-semibold mb-2">Next Payment Date</label>
                <input
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNextPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1754]/50 border border-purple-500/20 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Summary */}
            {numPeople > 0 && amount > 0 && (
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                }}
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A5B4FC]">Total Amount:</span>
                    <span className="text-white font-semibold">₹{amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A5B4FC]">Per Person:</span>
                    <span className="text-purple-300 font-semibold">
                      {splitType === 'equal' ? `₹${amountPerPerson.toFixed(2)}` : 'Custom'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A5B4FC]">Number of People:</span>
                    <span className="text-white font-semibold">{numPeople}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 px-4 rounded-lg bg-[#1a1754]/50 border border-purple-500/20 text-white hover:border-purple-500/40 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSplit}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold transition flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Save & Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && savedSplit && (
        <div
          className="rounded-2xl p-6 border-2 border-green-500/50 animate-in fade-in slide-in-from-bottom-4"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(52, 211, 153, 0.06) 100%)',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1">Split Saved!</h4>
              <div className="text-sm text-green-300 space-y-1">
                <p>✓ Amount: ₹{savedSplit.totalAmount}</p>
                <p>✓ Split: {savedSplit.people.length} people → ₹{(savedSplit.totalAmount / savedSplit.people.length).toFixed(2)} each</p>
                <p>✓ Reminder: every {savedSplit.reminderFrequency}</p>
                <p>✓ Next payment: {savedSplit.nextPaymentDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
