import { QrCode, Send, CreditCard } from 'lucide-react';

interface QuickPayCardProps {
  onPayNowClick: () => void;
  onQrScan: () => void;
  onSendMoney: () => void;
  onBankTransfer: () => void;
}

export function QuickPayCard({
  onPayNowClick,
  onQrScan,
  onSendMoney,
  onBankTransfer
}: QuickPayCardProps) {
  return (
    <div
      className="rounded-xl p-3 mb-4 inline-block w-full"
      style={{
        background: 'linear-gradient(135deg, rgba(0,217,255,0.12) 0%, rgba(124,131,253,0.12) 100%)',
        border: '1px solid rgba(0,217,255,0.25)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 16px rgba(0,217,255,0.06)'
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Primary Action Button - Compact */}
        <button
          onClick={onPayNowClick}
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
            boxShadow: '0 4px 12px rgba(124,131,253,0.3)',
            color: 'white'
          }}
        >
          💳 Pay Now
        </button>

        {/* Quick Options - Compact Horizontal Layout */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onQrScan}
            className="p-2 rounded-lg border border-[#7C83FD]/40 hover:border-[#00D9FF]/60 hover:bg-white/5 transition-all duration-300 group"
            title="Scan QR"
          >
            <QrCode className="w-4 h-4 text-[#7C83FD] group-hover:text-[#00D9FF]" />
          </button>

          <button
            onClick={onSendMoney}
            className="p-2 rounded-lg border border-[#7C83FD]/40 hover:border-[#00D9FF]/60 hover:bg-white/5 transition-all duration-300 group"
            title="Send Money"
          >
            <Send className="w-4 h-4 text-[#7C83FD] group-hover:text-[#00D9FF]" />
          </button>

          <button
            onClick={onBankTransfer}
            className="p-2 rounded-lg border border-[#7C83FD]/40 hover:border-[#00D9FF]/60 hover:bg-white/5 transition-all duration-300 group"
            title="Bank Transfer"
          >
            <CreditCard className="w-4 h-4 text-[#7C83FD] group-hover:text-[#00D9FF]" />
          </button>
        </div>
      </div>
    </div>
  );
}
