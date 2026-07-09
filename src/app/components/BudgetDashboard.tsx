import { useState } from 'react';
import { TrendingUp, AlertCircle, Lightbulb, Target, Zap, ArrowUpRight, Clock, Bell } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PageDecor3D } from './FloatingCoins3D';
import { QuickPayCard } from './QuickPayCard';
import { PaymentForm, PaymentFormData } from './PaymentForm';
import { PaymentSuccess } from './PaymentSuccess';
import { AllowanceSettings } from './AllowanceSettings';
import { SendMoneyForm } from './SendMoneyForm';
import { QRScannerForm } from './QRScannerForm';
import { SmartSplit } from './SmartSplit';
import { PhoneBook } from './PhoneBook';
import { SmartSplitReminder } from './SmartSplitReminder';

const glass = {
  background: 'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
  border: '1px solid rgba(0,217,255,0.14)',
  backdropFilter: 'blur(24px)',
};

interface Transaction {
  id: string;
  category: string;
  amount: number;
  purpose: string;
  paymentMethod: string;
  date: string;
  time: string;
}

interface SplitReminder {
  id: string;
  totalAmount: number;
  numPeople: number;
  peopleNames: string[];
  amountPerPerson: number;
  reminderFrequency: 'once' | 'weekly' | 'monthly';
  nextPaymentDate: string;
}

export function BudgetDashboard() {
  const [monthlyAllowance, setMonthlyAllowance] = useState(5000);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [lastPayment, setLastPayment] = useState<PaymentFormData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [sendMoneyUpiId, setSendMoneyUpiId] = useState('');
  const [qrScannedData, setQrScannedData] = useState('');
  const [splitReminders, setSplitReminders] = useState<SplitReminder[]>([]);

  // Define category colors and categories
  const categoryColors: Record<string, string> = {
    'Food': '#8AAE6D',
    'Travel': '#A5B4FC',
    'Rent': '#7C83FD',
    'Shopping': '#6366F1',
    'Bills': '#EC4899',
    'Entertainment': '#F59E0B',
    'Health': '#10B981',
    'Education': '#3B82F6',
    'Other': '#6B7280'
  };

  // Create expense data from transactions
  let expenseData: Array<{ name: string; value: number; color: string }> = [];

  if (transactions.length > 0) {
    const categoryTotals: Record<string, number> = {};
    
    // Calculate totals per category
    transactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    // Convert to expense data format
    expenseData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categoryColors[category] || '#6B7280'
    }));
  }

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  const remaining = monthlyAllowance - totalExpenses;
  const progress = (totalExpenses / monthlyAllowance) * 100;

  const tips = [
    {
      icon: Lightbulb,
      text: 'Set aside 20% of your income for savings',
      color: '#8AAE6D'
    },
    {
      icon: Target,
      text: 'Track your daily expenses to identify spending patterns',
      color: '#7C83FD'
    },
    {
      icon: TrendingUp,
      text: 'Use student discounts whenever possible',
      color: '#A5B4FC'
    }
  ];

  // Payment handlers
  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setPaymentLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add new transaction
      const newTransaction: Transaction = {
        id: String(transactions.length + 1),
        category: data.category,
        amount: parseFloat(data.amount),
        purpose: data.purpose,
        paymentMethod: data.paymentMethod,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setTransactions([newTransaction, ...transactions]);
      setLastPayment(data);
      setPaymentFormOpen(false);
      setSuccessOpen(true);

      // In real app, send to backend:
      // await fetch('/api/expenses', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     amount: data.amount,
      //     category: data.category,
      //     description: data.purpose,
      //     payment_method: data.paymentMethod,
      //     notes: data.notes
      //   })
      // });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayNow = () => {
    setPaymentFormOpen(true);
  };

  const handleQrScan = () => {
    setQrScannerOpen(true);
  };

  const handleSendMoney = () => {
    setSendMoneyOpen(true);
  };

  const handleBankTransfer = () => {
    // TODO: Implement bank transfer flow
    alert('Bank Transfer flow coming soon!');
  };

  // Handle UPI ID submission from Send Money form
  const handleSendMoneySubmit = (upiId: string) => {
    setSendMoneyUpiId(upiId);
    setSendMoneyOpen(false);
    // Open payment form with UPI as payment method and UPI ID in purpose
    setPaymentFormOpen(true);
  };

  // Handle QR code scanned data
  const handleQRScanned = (qrData: string) => {
    setQrScannedData(qrData);
    setQrScannerOpen(false);
    // Open payment form with QR as payment method and scanned data in purpose
    setPaymentFormOpen(true);
  };

  // Handle Smart Split saved
  const handleSplitSaved = (splitData: any) => {
    const newReminder: SplitReminder = {
      id: splitData.id,
      totalAmount: splitData.totalAmount,
      numPeople: splitData.people.length,
      peopleNames: splitData.people.map((p: any) => p.name),
      amountPerPerson: splitData.totalAmount / splitData.people.length,
      reminderFrequency: splitData.reminderFrequency,
      nextPaymentDate: splitData.nextPaymentDate,
    };
    
    setSplitReminders([...splitReminders, newReminder]);
  };

  // Handle dismiss split reminder
  const handleDismissSplitReminder = (reminderId: string) => {
    setSplitReminders(splitReminders.filter(r => r.id !== reminderId));
  };

  return (
    <div className="relative">
      <PageDecor3D />
      <div className="relative z-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight">Budget Dashboard</h2>
            <div
              className="px-4 py-2 rounded-xl flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,255,0.08) 0%, rgba(124,131,253,0.08) 100%)',
                border: '1px solid rgba(0,217,255,0.22)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 16px rgba(0,217,255,0.08)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="text-sm font-bold text-[#00D9FF]">March 2026</span>
            </div>
          </div>

          {/* Quick Pay Card - New Section A */}
          <QuickPayCard
            onPayNowClick={handlePayNow}
            onQrScan={handleQrScan}
            onSendMoney={handleSendMoney}
            onBankTransfer={handleBankTransfer}
          />

          {/* Smart Split Reminders - Show when active */}
          {splitReminders.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Active Payment Reminders
              </h3>
              <SmartSplitReminder 
                reminders={splitReminders}
                onDismiss={handleDismissSplitReminder}
              />
            </div>
          )}

          {/* Smart Split & Phone Book Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartSplit onSplitSaved={handleSplitSaved} />
            <PhoneBook />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 rounded-2xl p-8"
              style={glass}
            >
              <h3 className="text-white font-semibold mb-6">Expense Breakdown</h3>
              
              {expenseData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="text-5xl opacity-40">📊</div>
                  <p className="text-[#A5B4FC] text-lg font-semibold">No expenses yet</p>
                  <p className="text-[#A5B4FC] text-sm opacity-75 max-w-xs">
                    Start making payments to see your expense breakdown here. Click "Pay Now" to get started!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              style={{
                                filter: `drop-shadow(0 0 10px ${entry.color}60)`
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(26, 23, 54, 0.95) 100%)',
                            border: '1px solid rgba(124, 131, 253, 0.3)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            color: '#FFFFFF'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    {expenseData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          background: 'rgba(26, 23, 54, 0.5)',
                          border: `1px solid ${item.color}30`,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              background: item.color,
                              boxShadow: `0 0 10px ${item.color}60`
                            }}
                          ></div>
                          <span className="text-white font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">₹{item.value}</p>
                          <p className="text-[#A5B4FC] text-xs">
                            {((item.value / totalExpenses) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="rounded-2xl p-6"
              style={{
                ...glass,
                border: '1px solid rgba(0,217,255,0.22)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(0,217,255,0.08)',
              }}
            >
              <div className="mb-6 pb-6 border-b border-[#7C83FD]/20">
                <AllowanceSettings 
                  currentAllowance={monthlyAllowance}
                  onAllowanceChange={setMonthlyAllowance}
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="rgba(124, 131, 253, 0.15)"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#gradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(progress / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(124, 131, 253, 0.6))',
                        transition: 'stroke-dasharray 0.5s ease'
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C83FD" />
                        <stop offset="100%" stopColor="#00D9FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-white">₹{remaining}</p>
                    <p className="text-[#A5B4FC] text-sm">remaining</p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#A5B4FC] text-sm">Spent</span>
                    <span className="text-[#7C83FD] font-semibold">₹{totalExpenses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A5B4FC] text-sm">Progress</span>
                    <span className="text-white font-semibold">{progress.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={glass}
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb
                className="w-5 h-5 text-[#8AAE6D]"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(138, 174, 109, 0.5))'
                }}
              />
              <h3 className="text-white font-semibold">Quick Financial Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${tip.color}15 0%, ${tip.color}08 100%)`,
                      border: `1px solid ${tip.color}30`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Icon
                      className="w-5 h-5 mb-2"
                      style={{
                        color: tip.color,
                        filter: `drop-shadow(0 0 8px ${tip.color}40)`
                      }}
                    />
                    <p className="text-[#A5B4FC] text-sm">{tip.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(124,131,253,0.12) 0%, rgba(0,217,255,0.06) 100%)',
                border: '1px solid rgba(0,217,255,0.2)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 16px rgba(0,217,255,0.1)',
              }}
            >
              <p className="text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-1">This Week</p>
              <p className="text-3xl font-black text-[#7C83FD] mb-1">₹{
                transactions
                  .filter(t => {
                    const transDate = new Date(t.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return transDate >= weekAgo;
                  })
                  .reduce((sum, t) => sum + t.amount, 0)
              }</p>
              <p className="text-[#A5B4FC] text-xs">{transactions.length === 0 ? 'No transactions yet' : 'Last 7 days'}</p>
            </div>

            <div
              className="rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(138,174,109,0.12) 0%, rgba(0,217,255,0.04) 100%)',
                border: '1px solid rgba(138,174,109,0.25)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 16px rgba(138,174,109,0.1)',
              }}
            >
              <p className="text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-1">Avg Daily</p>
              <p className="text-3xl font-black text-[#8AAE6D] mb-1">₹{
                transactions.length === 0 ? 0 : Math.round(totalExpenses / Math.max(1, transactions.length))
              }</p>
              <p className="text-[#A5B4FC] text-xs">{transactions.length === 0 ? 'Start tracking' : 'Per transaction avg'}</p>
            </div>

            <div
              className="rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(124,131,253,0.06) 100%)',
                border: '1px solid rgba(0,217,255,0.22)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 16px rgba(0,217,255,0.1)',
              }}
            >
              <p className="text-[#A5B4FC] text-xs font-bold uppercase tracking-widest mb-1">Remaining</p>
              <p className="text-3xl font-black text-[#00D9FF] mb-1">₹{remaining.toLocaleString()}</p>
              <p className="text-[#A5B4FC] text-xs">{progress === 0 ? 'Full budget available' : `${progress.toFixed(0)}% spent`}</p>
            </div>
          </div>

          {/* Recent Transactions Section */}
          <div className="rounded-2xl p-6" style={glass}>
            <div className="flex items-center gap-3 mb-6">
              <ArrowUpRight className="w-5 h-5 text-[#00D9FF]" style={{ filter: 'drop-shadow(0 0 8px rgba(0,217,255,0.5))' }} />
              <h3 className="text-white font-semibold">Recent Transactions</h3>
              <span className="ml-auto text-xs text-[#A5B4FC] font-semibold">{transactions.length} transactions</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border transition-all hover:border-[#00D9FF]/40"
                    style={{
                      background: 'rgba(26, 23, 54, 0.5)',
                      border: '1px solid rgba(124, 131, 253, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(0,217,255,0.15)' }}>
                        <ArrowUpRight className="w-4 h-4 text-[#00D9FF]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{transaction.purpose}</p>
                        <div className="flex items-center gap-2 text-xs text-[#A5B4FC] mt-1">
                          <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(138, 174, 109, 0.2)', color: '#8AAE6D' }}>
                            {transaction.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹{transaction.amount}</p>
                      <p className="text-xs text-[#A5B4FC]">{transaction.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#A5B4FC]">
                  <p>No transactions yet. Make your first payment!</p>
                </div>
              )}
            </div>

            {transactions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#7C83FD]/20">
                <div className="flex justify-between">
                  <span className="text-[#A5B4FC] text-sm">Total Transactions:</span>
                  <span className="text-white font-semibold">
                    ₹{transactions.reduce((sum, t) => sum + t.amount, 0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      <PaymentForm
        isOpen={paymentFormOpen}
        onClose={() => {
          setPaymentFormOpen(false);
          setSendMoneyUpiId('');
          setQrScannedData('');
        }}
        onSubmit={handlePaymentSubmit}
        isLoading={paymentLoading}
        remainingBalance={remaining}
        initialData={
          sendMoneyUpiId 
            ? { 
                paymentMethod: 'upi', 
                purpose: `Send to ${sendMoneyUpiId}`,
                category: 'Other'
              }
            : qrScannedData 
            ? { 
                paymentMethod: 'qr', 
                purpose: `QR Payment - ${qrScannedData}`,
                category: 'Other'
              }
            : undefined
        }
      />

      {/* Send Money Modal */}
      <SendMoneyForm
        isOpen={sendMoneyOpen}
        onClose={() => setSendMoneyOpen(false)}
        onSendMoney={handleSendMoneySubmit}
        isLoading={paymentLoading}
      />

      {/* QR Scanner Modal */}
      <QRScannerForm
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onQRScanned={handleQRScanned}
        isLoading={paymentLoading}
      />

      {/* Payment Success Modal */}
      {lastPayment && (
        <PaymentSuccess
          isOpen={successOpen}
          onClose={() => setSuccessOpen(false)}
          amount={lastPayment.amount}
          category={lastPayment.category}
          paymentMethod={lastPayment.paymentMethod}
          purpose={lastPayment.purpose}
        />
      )}
    </div>
  );
}