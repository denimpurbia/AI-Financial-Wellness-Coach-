import { CheckCircle, Calendar, Wallet, Tag } from 'lucide-react';
import { useEffect } from 'react';

interface PaymentSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  category: string;
  paymentMethod: string;
  purpose: string;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'bank': 'Bank Account',
  'upi': 'UPI',
  'card': 'Credit Card',
  'qr': 'QR Payment'
};

export function PaymentSuccess({
  isOpen,
  onClose,
  amount,
  category,
  paymentMethod,
  purpose
}: PaymentSuccessProps) {
  // Auto-close after 4 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-md rounded-2xl p-8 relative overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(0,6,20,0.95) 0%, rgba(10,4,30,0.95) 100%)',
          border: '1px solid rgba(0,217,255,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,217,255,0.15)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Animated background circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00D9FF] rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7C83FD] rounded-full opacity-10 blur-3xl animate-pulse" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Success Icon Animation */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-[#00D9FF] rounded-full opacity-20 animate-ping" />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
                boxShadow: '0 0 30px rgba(0,217,255,0.6)'
              }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-3xl font-black text-white mb-2">Payment Successful! 🎉</h2>
          <p className="text-[#A5B4FC] mb-8">Your transaction has been processed</p>

          {/* Amount Display */}
          <div
            className="w-full p-4 rounded-xl mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(124,131,253,0.1) 100%)',
              border: '1px solid rgba(0,217,255,0.2)'
            }}
          >
            <p className="text-[#A5B4FC] text-sm mb-1">Amount Paid</p>
            <p className="text-4xl font-black text-[#00D9FF]">₹{amount}</p>
          </div>

          {/* Details */}
          <div className="w-full space-y-3 mb-8">
            {/* Category */}
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background: 'rgba(26, 23, 54, 0.4)',
                border: '1px solid rgba(138, 174, 109, 0.25)'
              }}
            >
              <div className="p-2 rounded-lg bg-[#8AAE6D]/20 mr-3">
                <Tag className="w-4 h-4 text-[#8AAE6D]" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-[#A5B4FC]">Category</p>
                <p className="text-white font-semibold">{category}</p>
              </div>
            </div>

            {/* Purpose */}
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background: 'rgba(26, 23, 54, 0.4)',
                border: '1px solid rgba(124, 131, 253, 0.25)'
              }}
            >
              <div className="p-2 rounded-lg bg-[#7C83FD]/20 mr-3">
                <CheckCircle className="w-4 h-4 text-[#7C83FD]" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-[#A5B4FC]">Purpose</p>
                <p className="text-white font-semibold">{purpose}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background: 'rgba(26, 23, 54, 0.4)',
                border: '1px solid rgba(0, 217, 255, 0.25)'
              }}
            >
              <div className="p-2 rounded-lg bg-[#00D9FF]/20 mr-3">
                <Wallet className="w-4 h-4 text-[#00D9FF]" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-[#A5B4FC]">Via</p>
                <p className="text-white font-semibold">{PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod}</p>
              </div>
            </div>

            {/* Date */}
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background: 'rgba(26, 23, 54, 0.4)',
                border: '1px solid rgba(170, 100, 200, 0.25)'
              }}
            >
              <div className="p-2 rounded-lg bg-purple-500/20 mr-3">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-[#A5B4FC]">Date & Time</p>
                <p className="text-white font-semibold">
                  {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div
            className="w-full p-4 rounded-lg mb-6"
            style={{
              background: 'rgba(138, 174, 109, 0.08)',
              border: '1px solid rgba(138, 174, 109, 0.25)'
            }}
          >
            <p className="text-[#8AAE6D] text-sm font-semibold mb-3">✅ What's Next:</p>
            <ul className="text-left space-y-2 text-xs text-[#A5B4FC]">
              <li>✓ Entry added to your expense table</li>
              <li>✓ Budget chart updated</li>
              <li>✓ Monthly allowance adjusted</li>
              <li>✓ Transaction history updated</li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(124,131,253,0.3)'
            }}
          >
            Done ✨
          </button>
        </div>
      </div>
    </div>
  );
}
