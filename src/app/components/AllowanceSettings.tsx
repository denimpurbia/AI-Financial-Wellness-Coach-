import { Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

interface AllowanceSettingsProps {
  currentAllowance: number;
  onAllowanceChange: (amount: number) => void;
}

export function AllowanceSettings({ currentAllowance, onAllowanceChange }: AllowanceSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(currentAllowance));

  const handleSave = () => {
    const amount = parseFloat(inputValue);
    if (amount > 0) {
      onAllowanceChange(amount);
      setIsEditing(false);
    } else {
      alert('Please enter a valid amount');
    }
  };

  const handleCancel = () => {
    setInputValue(String(currentAllowance));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2 text-white font-semibold">₹</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white/10 border border-[#00D9FF]/50 rounded-lg text-white font-semibold focus:outline-none focus:bg-white/20 transition-all"
            placeholder="Enter monthly allowance"
            autoFocus
            min="1"
          />
        </div>
        <button
          onClick={handleSave}
          className="p-2 rounded-lg bg-[#8AAE6D]/20 hover:bg-[#8AAE6D]/40 transition-all"
          title="Save"
        >
          <Check className="w-4 h-4 text-[#8AAE6D]" />
        </button>
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          title="Cancel"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[#A5B4FC] text-xs opacity-75">Monthly Allowance</p>
        <p className="text-2xl font-black text-white">₹{currentAllowance.toLocaleString()}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 rounded-lg bg-[#7C83FD]/20 hover:bg-[#7C83FD]/40 transition-all group"
        title="Edit allowance"
      >
        <Edit2 className="w-4 h-4 text-[#7C83FD] group-hover:text-[#00D9FF]" />
      </button>
    </div>
  );
}
