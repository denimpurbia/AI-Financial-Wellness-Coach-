import { useState } from 'react';
import { X, Loader2, Check } from 'lucide-react';

export interface PaymentFormData {
  amount: string;
  category: string;
  purpose: string;
  paymentMethod: string;
  notes?: string;
}

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  isLoading?: boolean;
  remainingBalance?: number;
  initialData?: Partial<PaymentFormData>;
}

const CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other'
];

const PAYMENT_METHODS = [
  { id: 'bank', label: 'Bank Account', icon: '🏦' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'qr', label: 'QR Scan', icon: '📷' }
];

export function PaymentForm({ isOpen, onClose, onSubmit, isLoading = false, remainingBalance = 0, initialData = {} }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: initialData.amount || '',
    category: initialData.category || 'Food',
    purpose: initialData.purpose || '',
    paymentMethod: initialData.paymentMethod || 'upi',
    notes: initialData.notes || ''
  });
  const [balanceError, setBalanceError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBalanceError('');
    
    if (!formData.amount || !formData.purpose) {
      alert('Please fill in all required fields');
      return;
    }

    // Check balance
    const amount = parseFloat(formData.amount);
    if (amount > remainingBalance) {
      setBalanceError(`Insufficient balance! You only have ₹${remainingBalance.toFixed(2)} remaining.`);
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        amount: '',
        category: 'Food',
        purpose: '',
        paymentMethod: 'upi',
        notes: ''
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-md rounded-2xl p-6 relative my-auto max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(0,6,20,0.95) 0%, rgba(10,4,30,0.95) 100%)',
          border: '1px solid rgba(0,217,255,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,217,255,0.1)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
          disabled={isLoading}
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Make Payment</h2>

        {balanceError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{balanceError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-[#A5B4FC] mb-2">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white font-semibold">₹</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="100"
                min="1"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 bg-white/5 border border-[#7C83FD]/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:bg-white/10 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-[#A5B4FC] mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-[#7C83FD]/30 rounded-lg text-white focus:outline-none focus:border-[#00D9FF]/50 focus:bg-white/10 transition-all"
              disabled={isLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0a041e]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose Text Input */}
          <div>
            <label className="block text-sm font-semibold text-[#A5B4FC] mb-2">
              Purpose <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="e.g., Breakfast, Office supplies"
              className="w-full px-4 py-2 bg-white/5 border border-[#7C83FD]/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:bg-white/10 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#A5B4FC] mb-3">
              Payment Method <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.paymentMethod === method.id
                      ? 'border-[#00D9FF] bg-[#00D9FF]/10'
                      : 'border-[#7C83FD]/30 bg-white/5 hover:border-[#7C83FD]'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-xs text-white font-medium text-center">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#A5B4FC] mb-2">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional details..."
              className="w-full px-4 py-2 bg-white/5 border border-[#7C83FD]/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:bg-white/10 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Summary */}
          {formData.amount && (
            <div
              className="p-4 rounded-lg border"
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,255,0.08) 0%, rgba(124,131,253,0.08) 100%)',
                border: '1px solid rgba(0,217,255,0.2)'
              }}
            >
              <p className="text-xs text-[#A5B4FC] mb-2">Payment Summary:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Amount:</span>
                  <span className="text-[#00D9FF] font-semibold">₹{formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Category:</span>
                  <span className="text-white font-semibold">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Via:</span>
                  <span className="text-white font-semibold">
                    {PAYMENT_METHODS.find(m => m.id === formData.paymentMethod)?.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-[#7C83FD]/30 text-white hover:bg-white/5 transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7C83FD] to-[#00D9FF] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Pay ₹{formData.amount || '0'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
