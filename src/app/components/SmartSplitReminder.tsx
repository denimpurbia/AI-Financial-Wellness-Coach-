import { Bell, Calendar, Users, TrendingUp } from 'lucide-react';

interface SplitReminder {
  id: string;
  totalAmount: number;
  numPeople: number;
  peopleNames: string[];
  amountPerPerson: number;
  reminderFrequency: 'once' | 'weekly' | 'monthly';
  nextPaymentDate: string;
}

interface SmartSplitReminderProps {
  reminders: SplitReminder[];
  onDismiss?: (reminderId: string) => void;
}

export function SmartSplitReminder({ reminders, onDismiss }: SmartSplitReminderProps) {
  if (reminders.length === 0) {
    return null;
  }

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'once':
        return 'One time';
      case 'weekly':
        return 'Every week';
      case 'monthly':
        return 'Every month';
      default:
        return freq;
    }
  };

  return (
    <div className="space-y-3">
      {reminders.map(reminder => (
        <div
          key={reminder.id}
          className="rounded-2xl p-6 overflow-hidden relative group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
            border: '2px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15)',
          }}
        >
          {/* Animated background gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at top right, rgba(168, 85, 247, 0.2), transparent)',
              pointerEvents: 'none',
            }}
          />

          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-3 rounded-lg bg-purple-500/20 flex-shrink-0">
                  <Bell className="w-5 h-5 text-purple-400 animate-bounce" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">Upcoming Payment Reminder</h4>
                  <p className="text-sm text-purple-300 mt-1">
                    Amount: <span className="text-purple-200 font-semibold">₹{reminder.totalAmount}</span>
                  </p>
                </div>
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(reminder.id)}
                  className="text-[#A5B4FC] hover:text-white transition text-xl flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Split Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Split Info */}
              <div
                className="p-3 rounded-lg"
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 text-[#A5B4FC] text-xs font-semibold mb-1">
                  <Users className="w-4 h-4" />
                  <span>Split</span>
                </div>
                <p className="text-white font-bold">
                  {reminder.numPeople} people → ₹{reminder.amountPerPerson.toFixed(2)} each
                </p>
              </div>

              {/* Reminder Frequency */}
              <div
                className="p-3 rounded-lg"
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 text-[#A5B4FC] text-xs font-semibold mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Reminder</span>
                </div>
                <p className="text-white font-bold">{getFrequencyLabel(reminder.reminderFrequency)}</p>
              </div>
            </div>

            {/* Next Payment Date */}
            <div
              className="p-4 rounded-lg flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[#A5B4FC] text-sm">Next payment</p>
                <p className="text-white font-bold">{reminder.nextPaymentDate}</p>
              </div>
              <div className="flex-shrink-0 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
                <span className="text-green-300 text-xs font-bold">Active</span>
              </div>
            </div>

            {/* People List */}
            <div className="pt-2">
              <p className="text-[#A5B4FC] text-xs font-semibold mb-2">Sharing with:</p>
              <div className="flex flex-wrap gap-2">
                {reminder.peopleNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#e9d5ff'
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
