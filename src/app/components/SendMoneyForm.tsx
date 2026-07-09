import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface SendMoneyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMoney: (upiId: string) => void;
  isLoading?: boolean;
}

export function SendMoneyForm({ isOpen, onClose, onSendMoney, isLoading = false }: SendMoneyFormProps) {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]{3,}$/;
    if (!upiId.trim()) {
      setError('Please enter a UPI ID');
      return;
    }

    if (!upiRegex.test(upiId)) {
      setError('Invalid UPI ID format. Example: username@bankname');
      return;
    }

    onSendMoney(upiId);
    setUpiId('');
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

        <h2 className="text-2xl font-bold text-white mb-2">Send Money</h2>
        <p className="text-white/60 text-sm mb-6">Enter the UPI ID to send money</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UPI ID Input */}
          <div>
            <label className="block text-sm font-semibold text-[#A5B4FC] mb-2">
              UPI ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@bankname"
              className="w-full px-4 py-2 bg-white/5 border border-[#7C83FD]/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00D9FF]/50 focus:bg-white/10 transition-all"
              disabled={isLoading}
            />
            <p className="text-white/40 text-xs mt-2">Format: yourname@banknameapp</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !upiId.trim()}
            className="w-full py-3 bg-gradient-to-r from-[#00D9FF] to-[#7C83FD] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00D9FF]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
