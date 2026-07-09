# Payment Flow Implementation Guide

## Overview
This document describes the complete payment flow implementation for the AI Financial Wellness Coach Dashboard. The system includes UI components, backend APIs, and integration services for seamless payment processing.

## 📋 Components Overview

### 1. QuickPayCard Component
**Location:** `src/app/components/QuickPayCard.tsx`

**Features:**
- Primary "Pay Now" button with gradient styling
- Quick action buttons: Scan QR, Send Money, Bank Transfer
- Visual indicators and hover effects
- Info banner about automatic transaction tracking

**Props:**
```typescript
interface QuickPayCardProps {
  onPayNowClick: () => void;
  onQrScan: () => void;
  onSendMoney: () => void;
  onBankTransfer: () => void;
}
```

### 2. PaymentForm Component
**Location:** `src/app/components/PaymentForm.tsx`

**Features:**
- Modal-based payment form with smooth animations
- Form fields:
  - Amount (currency input)
  - Category dropdown (Food, Travel, Rent, Shopping, Bills, Entertainment, Health, Education, Other)
  - Purpose (text input)
  - Payment method selection (Bank, UPI, Card, QR)
  - Notes (optional)
- Real-time payment summary
- Loading state handling
- Form validation

**Props:**
```typescript
interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  isLoading?: boolean;
}

interface PaymentFormData {
  amount: string;
  category: string;
  purpose: string;
  paymentMethod: string;
  notes?: string;
}
```

### 3. PaymentSuccess Component
**Location:** `src/app/components/PaymentSuccess.tsx`

**Features:**
- Success confirmation modal with animations
- Displays transaction details:
  - Amount paid
  - Category
  - Purpose
  - Payment method
  - Date & time
- "What's Next" checklist showing updates
- Auto-closes after 4 seconds
- Confetti-like animations with glowing effects

**Props:**
```typescript
interface PaymentSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  category: string;
  paymentMethod: string;
  purpose: string;
}
```

### 4. Updated BudgetDashboard Component
**Location:** `src/app/components/BudgetDashboard.tsx`

**New Features:**
- ✅ QuickPayCard integration at the top
- ✅ Recent transactions list with:
  - Transaction details (category, purpose, amount)
  - Time and date information
  - Payment method indicator
  - Scrollable history
- ✅ Automatic expense chart updates
- ✅ Dynamic budget progress calculation
- ✅ Transaction state management

**State & Handlers:**
```typescript
const [paymentFormOpen, setPaymentFormOpen] = useState(false);
const [successOpen, setSuccessOpen] = useState(false);
const [paymentLoading, setPaymentLoading] = useState(false);
const [lastPayment, setLastPayment] = useState<PaymentFormData | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);
```

## 🔌 Backend API Endpoints

### Payment Routes Base URL
`/api/payments`

### Endpoints

#### 1. Process Payment
**Endpoint:** `POST /api/payments/process`

**Request Body:**
```json
{
  "amount": 250.50,
  "category": "Food",
  "purpose": "Lunch",
  "payment_method": "upi",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "transaction": {
    "id": "uuid",
    "user_id": "uuid",
    "amount": 250.50,
    "category": "Food",
    "description": "Lunch",
    "payment_method": "upi",
    "date": "2026-03-04",
    "status": "completed",
    "created_at": "2026-03-04T10:30:00"
  },
  "timestamp": "2026-03-04T10:30:00"
}
```

#### 2. Get All Transactions
**Endpoint:** `GET /api/payments/transactions`

**Query Parameters:**
- `limit` (default: 50) - Number of transactions to fetch
- `offset` (default: 0) - Pagination offset
- `category` (optional) - Filter by category

**Response:**
```json
{
  "success": true,
  "transactions": [...],
  "count": 10,
  "limit": 50,
  "offset": 0
}
```

#### 3. Get Transaction Details
**Endpoint:** `GET /api/payments/transactions/<transaction_id>`

**Response:**
```json
{
  "success": true,
  "transaction": {...}
}
```

#### 4. Update Transaction
**Endpoint:** `PUT /api/payments/transactions/<transaction_id>`

**Request Body:**
```json
{
  "category": "Updated Category",
  "purpose": "Updated Purpose",
  "notes": "Updated notes"
}
```

#### 5. Get Payment Summary
**Endpoint:** `GET /api/payments/summary`

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_amount": 5000,
    "transaction_count": 15,
    "by_category": {
      "Food": 1200,
      "Travel": 800,
      "Rent": 3000,
      "Entertainment": 0
    },
    "by_payment_method": {
      "upi": 2000,
      "card": 2000,
      "bank": 1000
    },
    "average_transaction": 333.33,
    "currency": "INR"
  }
}
```

#### 6. Get Valid Categories
**Endpoint:** `GET /api/payments/categories`

**Response:**
```json
{
  "categories": [
    "Food",
    "Travel",
    "Rent",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other"
  ]
}
```

#### 7. Get Valid Payment Methods
**Endpoint:** `GET /api/payments/methods`

**Response:**
```json
{
  "payment_methods": [
    {"id": "bank", "label": "Bank Account"},
    {"id": "upi", "label": "UPI"},
    {"id": "card", "label": "Credit Card"},
    {"id": "qr", "label": "QR Payment"}
  ]
}
```

## 🔧 Frontend Payment Service

**Location:** `src/services/paymentService.ts`

### Usage Examples

#### Process a Payment
```typescript
import PaymentService from '@/services/paymentService';

const handlePayment = async () => {
  try {
    const response = await PaymentService.processPayment({
      amount: '250.50',
      category: 'Food',
      purpose: 'Lunch',
      payment_method: 'upi',
      notes: 'Office lunch'
    });
    console.log('Payment successful:', response);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

#### Fetch Recent Transactions
```typescript
const fetchTransactions = async () => {
  try {
    const result = await PaymentService.getTransactions(50, 0, 'Food');
    console.log('Transactions:', result.transactions);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Get Payment Statistics
```typescript
const getStats = async () => {
  try {
    const result = await PaymentService.getPaymentSummary();
    console.log('Summary:', result.summary);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📊 Payment Flow Diagram

```
User Click
    ↓
[QuickPayCard] → "Pay Now" Button
    ↓
[PaymentForm Modal Opens]
    ↓
User Fills:
  - Amount
  - Category
  - Purpose
  - Payment Method
  - Notes (optional)
    ↓
[Submit Button] → API Call to /api/payments/process
    ↓
Backend Processing:
  - Validate inputs
  - Create expense record
  - Update database
    ↓
[PaymentSuccess Modal]
    ↓
Show Summary:
  - Amount
  - Category
  - Payment Method
  - Time
    ↓
Dashboard Updates:
  - ✓ Entry added to expense table
  - ✓ Budget chart updated
  - ✓ Monthly allowance adjusted
  - ✓ Recent transactions list updated
```

## 🗄️ Database Schema Updates

The system uses the existing **expenses table** with these key fields:

```sql
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    description TEXT,
    payment_method VARCHAR(20),  -- NEW: 'bank', 'upi', 'card', 'qr'
    notes TEXT,                   -- NEW: Optional transaction notes
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',  -- NEW: 'completed', 'pending', etc
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## ✨ Features Implemented

### Step 1: User Action
- ✅ Click "Pay Now" button in QuickPayCard
- ✅ Or use quick actions (QR, Send Money, Bank Transfer)

### Step 2: Payment Method Selection
- ✅ Bank Account
- ✅ UPI
- ✅ QR Scan
- ✅ Card

### Step 3: Payment Form
- ✅ Amount input with currency symbol
- ✅ Category dropdown with 9 predefined options
- ✅ Purpose text field
- ✅ Payment method visual selection
- ✅ Optional notes
- ✅ Payment summary preview
- ✅ Form validation

### Step 4: Success Screen
- ✅ Animated success modal
- ✅ Transaction details display
- ✅ What's Next checklist
- ✅ Auto-close after 4 seconds

### Step 5: Dashboard Updates
- ✅ Expense breakdown chart updates
- ✅ Monthly allowance recalculates
- ✅ Recent transactions list updates
- ✅ Budget progress updates

## 🔒 Authentication & Security

All payment endpoints require authentication:
```typescript
// Auth token is read from:
- localStorage.getItem('authToken')
- sessionStorage.getItem('authToken')
```

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

## 📝 Error Handling

### Common Error Responses

**Invalid Amount:**
```json
{
  "error": "Amount must be greater than 0"
}
```

**Missing Fields:**
```json
{
  "error": "Missing required fields",
  "required": ["amount", "category", "purpose", "payment_method"]
}
```

**Invalid Category:**
```json
{
  "error": "Invalid category. Must be one of: [...]"
}
```

**Invalid Payment Method:**
```json
{
  "error": "Invalid payment method. Must be one of: [...]"
}
```

## 🎯 Future Enhancements

- QR code scanner implementation
- Send money to contacts
- Bank transfer integration
- Transaction receipts (PDF export)
- Payment splitting between users
- Recurring payments
- Payment reminders
- Transaction search and filtering
- Export transaction history

## 📚 Integration Checklist

- [x] Create PaymentForm component
- [x] Create QuickPayCard component
- [x] Create PaymentSuccess component
- [x] Update BudgetDashboard
- [x] Create payment backend routes
- [x] Create payment service (frontend)
- [x] Register routes in Flask app
- [x] Add expense tracking
- [x] Add budget updates
- [ ] Implement QR scanner
- [ ] Implement Send Money flow
- [ ] Implement Bank Transfer flow
- [ ] Add transaction receipts
- [ ] Add payment analytics

## 🚀 How to Use

1. **Navigate to Budget Dashboard**
2. **Click the "Pay Now" button** in the QuickPayCard section
3. **Fill in the payment form**:
   - Enter amount
   - Select category
   - Add purpose
   - Choose payment method
4. **Review payment summary**
5. **Click "Pay ₹XXX"**
6. **Success modal appears** showing transaction details
7. **Dashboard automatically updates** with new transaction
