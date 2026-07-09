import { useState } from 'react';
import { Plus, Trash2, Phone, Check, AlertCircle } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  addedDate: string;
}

interface PhoneBookProps {
  onContactAdded?: (contact: Contact) => void;
  onContactRemoved?: (contactId: string) => void;
}

export function PhoneBook({ onContactAdded, onContactRemoved }: PhoneBookProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phoneNum: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNum.replace(/\D/g, ''));
  };

  const handleAddContact = () => {
    setPhoneError('');

    if (!name.trim()) {
      setPhoneError('Name is required');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Phone must be 10 digits');
      return;
    }

    if (contacts.some((c: Contact) => c.phone === phone.replace(/\D/g, ''))) {
      setPhoneError('This contact already exists');
      return;
    }

    const newContact: Contact = {
      id: String(Date.now()),
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      addedDate: new Date().toLocaleDateString()
    };

    setContacts([...contacts, newContact]);
    onContactAdded?.(newContact);

    setName('');
    setPhone('');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setShowAddForm(false);
    }, 2000);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c: Contact) => c.id !== id));
    onContactRemoved?.(id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddContact();
    }
  };

  return (
    <div className="space-y-4">
      {!showAddForm && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(96,165,250,0.06) 100%)',
            border: '1px solid rgba(59,130,246,0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(59,130,246,0.1)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Phone Book</h3>
                <p className="text-sm text-blue-300">
                  {contacts.length === 0 ? 'Add contacts for splits' : `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} saved`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {contacts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-2">
              {contacts.slice(0, 3).map((contact: Contact) => (
                <div key={contact.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#A5B4FC]">{contact.name}</span>
                  <span className="text-blue-300 font-mono">{contact.phone}</span>
                </div>
              ))}
              {contacts.length > 3 && (
                <p className="text-xs text-[#7C83FD] pt-2">+{contacts.length - 3} more</p>
              )}
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(0,6,20,0.84) 0%, rgba(10,4,30,0.88) 100%)',
            border: '1px solid rgba(59,130,246,0.3)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Add to Phone Book</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setPhoneError('');
                setName('');
                setPhone('');
              }}
              className="text-[#A5B4FC] hover:text-white transition text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#A5B4FC] font-semibold mb-2">Contact Name</label>
              <input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Rahul, Priya"
                className="w-full px-4 py-3 rounded-lg bg-[#1a1754]/50 border border-blue-500/30 text-white placeholder-[#7C83FD]/50 focus:outline-none focus:border-blue-400 focus:bg-[#1a1754]/70 transition"
              />
            </div>

            <div>
              <label className="block text-[#A5B4FC] font-semibold mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-white">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#1a1754]/50 border border-blue-500/30 text-white placeholder-[#7C83FD]/50 focus:outline-none focus:border-blue-400 focus:bg-[#1a1754]/70 transition"
                />
              </div>
              {phoneError && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{phoneError}</span>
                </div>
              )}
            </div>

            {showSuccess && (
              <div
                className="p-3 rounded-lg flex items-center gap-2 animate-in fade-in"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-semibold">Contact added successfully!</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setPhoneError('');
                  setName('');
                  setPhone('');
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-[#1a1754]/50 border border-blue-500/20 text-white hover:border-blue-500/40 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={!name || !phone}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            </div>
          </div>

          {contacts.length > 0 && (
            <div className="mt-8 pt-8 border-t border-blue-500/20">
              <h4 className="text-white font-semibold mb-4">Saved Contacts ({contacts.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {contacts.map((contact: Contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1a1754]/30 border border-blue-500/20 hover:border-blue-500/40 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-[#A5B4FC] text-sm font-mono">+91 {contact.phone}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                      title="Delete contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
