# 💳 Payment System Quick Reference

## 🎯 Quick Links

| Component | Path | Purpose |
|-----------|------|---------|
| QuickPayCard | `src/app/components/QuickPayCard.tsx` | Top section with Pay Now button |
| PaymentForm | `src/app/components/PaymentForm.tsx` | Modal form for entering payment details |
| PaymentSuccess | `src/app/components/PaymentSuccess.tsx` | Success confirmation screen |
| BudgetDashboard | `src/app/components/BudgetDashboard.tsx` | Main dashboard with all features |
| PaymentService | `src/services/paymentService.ts` | Frontend API client |
| Payment Routes | `backend/routes/payments_routes.py` | Backend API endpoints |

---

## 💡 Common Tasks

### Make a Payment (Frontend)
```typescript
import { PaymentForm, PaymentFormData } from '@/components/PaymentForm';

const handlePayment = async (data: PaymentFormData) => {
  try {
    const response = await PaymentService.processPayment({
      amount: data.amount,
      category: data.category,
      purpose: data.purpose,
      payment_method: data.paymentMethod
    });
    console.log('Payment successful:', response);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### Get Recent Transactions (Frontend)
```typescript
import PaymentService from '@/services/paymentService';

const fetchTransactions = async () => {
  const result = await PaymentService.getTransactions(
    50, // limit
    0,  // offset
    'Food' // optional category filter
  );
  console.log(result.transactions);
};
```

### Process Payment (Backend)
```python
@payments_bp.route('/process', methods=['POST'])
@require_auth
def process_payment(user_id):
    data = request.get_json()
    # All validation happens automatically
    result = db.create_expense({
        'user_id': user_id,
        'amount': float(data['amount']),
        'category': data['category'],
        'description': data['purpose'],
        'payment_method': data['payment_method']
    })
```

---

## 📊 Valid Values

### Payment Methods
```javascript
'bank'  // Bank Account
'upi'   // UPI
'card'  // Credit Card
'qr'    // QR Payment
```

### Categories
```javascript
'Food'
'Travel'
'Rent'
'Shopping'
'Bills'
'Entertainment'
'Health'
'Education'
'Other'
```

---

## 🔌 API Endpoints Quick Reference

```
POST   /api/payments/process              → Create payment
GET    /api/payments/transactions         → List transactions
GET    /api/payments/transactions/<id>    → Get one transaction
PUT    /api/payments/transactions/<id>    → Update transaction
GET    /api/payments/summary              → Get statistics
GET    /api/payments/categories           → Get categories
GET    /api/payments/methods              → Get payment methods
```

---

## 🧪 Testing Checklist

- [ ] Click "Pay Now" button - form opens
- [ ] Select category dropdown - all options show
- [ ] Enter amount - validates positive number
- [ ] Select payment method - highlights on click
- [ ] Submit form - success modal appears
- [ ] Success modal auto-closes - after 4 seconds
- [ ] Dashboard updates - new transaction appears
- [ ] Expense chart updates - amount added to category
- [ ] Budget updates - remaining decreases

---

## 🐛 Debugging

### Form Not Opening?
- Check `paymentFormOpen` state in BudgetDashboard
- Verify `handlePayNow` is called
- Check console for errors

### Success Modal Not Showing?
- Verify `lastPayment` state is set
- Check `successOpen` state
- Ensure `PaymentSuccess` component receives correct props

### Dashboard Not Updating?
- Verify `setTransactions` is called
- Check `expenseData` calculation
- Look for state update timing issues

### API Errors?
- Check auth token in localStorage
- Verify backend is running
- Check API URL in paymentService.ts
- Verify CORS settings

---

## 📱 Component Props

### QuickPayCard
```typescript
onPayNowClick: () => void      // Called when Pay Now clicked
onQrScan: () => void           // Called when QR clicked
onSendMoney: () => void        // Called when Send Money clicked
onBankTransfer: () => void     // Called when Bank Transfer clicked
```

### PaymentForm
```typescript
isOpen: boolean                // Modal visibility
onClose: () => void            // Close handler
onSubmit: (data) => Promise    // Submit handler
isLoading?: boolean            // Loading state
```

### PaymentSuccess
```typescript
isOpen: boolean                // Modal visibility
onClose: () => void            // Close handler
amount: string                 // Payment amount
category: string               // Expense category
paymentMethod: string          // Payment method ID
purpose: string                // Transaction purpose
```

---

## 🎨 Tailwind Classes Used

```
text-white             // Primary text
text-[#A5B4FC]         // Secondary text (light purple)
text-[#00D9FF]         // Accent text (cyan)
text-[#7C83FD]         // Primary accent (purple)
text-[#8AAE6D]         // Secondary accent (green)

bg-white/5-10          // Transparent backgrounds
border-[#7C83FD]/20-40 // Accent borders
```

---

## 📦 Dependencies

### Frontend
- React (useState, ReactNode)
- Lucide React (icons)
- Recharts (charts - optional for payments)
- TypeScript

### Backend
- Flask
- Flask-CORS
- Supabase Python SDK
- Python 3.8+

---

## 🔐 Auth Token Setup

The service expects auth token in:
```javascript
localStorage.getItem('authToken') 
// OR
sessionStorage.getItem('authToken')
```

Set it after login:
```javascript
localStorage.setItem('authToken', token);
```

---

## 🚀 Deployment Notes

### Frontend
- All components are self-contained
- No external API calls without backend running
- Test locally first
- Check CORS settings on backend

### Backend
- Ensure environment variables are set
- Database migrations applied
- CORS enabled for frontend domain
- Auth endpoints working

---

## 📞 Error Handling

```typescript
try {
  await PaymentService.processPayment(data);
} catch (error) {
  // Common errors:
  // - "Missing required fields"
  // - "Invalid category"
  // - "Invalid payment method"
  // - "Amount must be greater than 0"
  console.error(error.message);
}
```

---

## 🎯 Next Steps

1. **Connect to real backend** - Update API URL
2. **Add QR scanner** - Implement QR code scanning
3. **Add send money** - Implement money transfer
4. **Add receipts** - Generate PDF receipts
5. **Add analytics** - Build payment dashboard

---

## 💬 Code Examples

### Initialize Payment Form
```typescript
const [isOpen, setIsOpen] = useState(false);

<PaymentForm
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
/>
```

### Update Dashboard Data
```typescript
const newTransaction: Transaction = {
  id: String(Date.now()),
  category: 'Food',
  amount: 250,
  purpose: 'Lunch',
  paymentMethod: 'upi',
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString()
};
setTransactions([newTransaction, ...transactions]);
```

### Fetch Summary
```typescript
const summary = await PaymentService.getPaymentSummary();
console.log('Total spent:', summary.summary.total_amount);
console.log('By category:', summary.summary.by_category);
```

---

## 📖 Full Documentation

For detailed documentation, see:
- [PAYMENT_FLOW_GUIDE.md](PAYMENT_FLOW_GUIDE.md) - Complete guide
- [PAYMENT_IMPLEMENTATION_SUMMARY.md](PAYMENT_IMPLEMENTATION_SUMMARY.md) - Summary

---

**Happy coding! 💜**
