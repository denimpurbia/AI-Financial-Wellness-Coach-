# Backend Integration Guide

This guide will help you integrate the Flask backend with the React frontend.

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# Or on macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create and fill .env file
cp .env.example .env
# Edit .env with your Supabase and OpenRouter credentials
```

### 2. Setup Supabase

1. Create account at https://supabase.com
2. Create new project
3. Get your Project URL and API keys from project settings
4. In Supabase SQL Editor, run the contents of `database_schema.sql`
5. Enable Email authentication in Authentication → Providers

### 3. Get OpenRouter API Key

1. Visit https://openrouter.ai
2. Create account and get API key
3. Add to your `.env` file

### 4. Start Backend Server

```bash
python app.py
```

Server will run on `http://localhost:5000`

## Frontend Integration

### Update API Configuration

Create `src/config/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    PROFILE: '/auth/profile',
    
    // Expenses
    EXPENSES: '/expenses',
    EXPENSES_ANALYTICS: '/expenses/analytics',
    
    // Budget
    BUDGET: '/budget',
    BUDGET_STATUS: '/budget/status',
    
    // Chat
    CHAT_MESSAGE: '/chat/message',
    CHAT_HISTORY: '/chat/history',
    CHAT_SUGGESTIONS: '/chat/suggestions',
    
    // Goals
    GOALS: '/goals',
    
    // Challenges
    CHALLENGES: '/challenges',
    CHALLENGES_COMPLETED: '/challenges/completed',
    CHALLENGES_COMPLETE: '/challenges/complete',
    CHALLENGES_STATS: '/challenges/stats',
  }
};
```

### Create API Service

Create `src/services/apiService.ts`:

```typescript
import { API_CONFIG } from '../config/api';

export class APIService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request(method: string, endpoint: string, data?: any) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const options: any = {
      method,
      headers: this.getHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'API request failed');
    }

    return result;
  }

  // Auth methods
  async signup(email: string, password: string, username: string) {
    const result = await this.request('POST', API_CONFIG.ENDPOINTS.SIGNUP, {
      email,
      password,
      username,
    });
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  async signin(email: string, password: string) {
    const result = await this.request('POST', API_CONFIG.ENDPOINTS.SIGNIN, {
      email,
      password,
    });
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  async getProfile() {
    return this.request('GET', API_CONFIG.ENDPOINTS.PROFILE);
  }

  async updateProfile(data: any) {
    return this.request('PUT', API_CONFIG.ENDPOINTS.PROFILE, data);
  }

  // Expense methods
  async getExpenses(limit = 100) {
    return this.request('GET', `${API_CONFIG.ENDPOINTS.EXPENSES}?limit=${limit}`);
  }

  async createExpense(expense: any) {
    return this.request('POST', API_CONFIG.ENDPOINTS.EXPENSES, expense);
  }

  async updateExpense(id: string, expense: any) {
    return this.request('PUT', `${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, expense);
  }

  async deleteExpense(id: string) {
    return this.request('DELETE', `${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`);
  }

  async getExpenseAnalytics() {
    return this.request('GET', API_CONFIG.ENDPOINTS.EXPENSES_ANALYTICS);
  }

  // Budget methods
  async getBudgets() {
    return this.request('GET', API_CONFIG.ENDPOINTS.BUDGET);
  }

  async createBudget(budget: any) {
    return this.request('POST', API_CONFIG.ENDPOINTS.BUDGET, budget);
  }

  async updateBudget(id: string, budget: any) {
    return this.request('PUT', `${API_CONFIG.ENDPOINTS.BUDGET}/${id}`, budget);
  }

  async getBudgetStatus() {
    return this.request('GET', API_CONFIG.ENDPOINTS.BUDGET_STATUS);
  }

  // Chat methods
  async sendMessage(message: string, language = 'english') {
    return this.request('POST', API_CONFIG.ENDPOINTS.CHAT_MESSAGE, {
      message,
      language,
    });
  }

  async getChatHistory(limit = 50) {
    return this.request('GET', `${API_CONFIG.ENDPOINTS.CHAT_HISTORY}?limit=${limit}`);
  }

  async getAISuggestions(language = 'english') {
    return this.request('GET', `${API_CONFIG.ENDPOINTS.CHAT_SUGGESTIONS}?language=${language}`);
  }

  // Goals methods
  async getGoals() {
    return this.request('GET', API_CONFIG.ENDPOINTS.GOALS);
  }

  async createGoal(goal: any) {
    return this.request('POST', API_CONFIG.ENDPOINTS.GOALS, goal);
  }

  // Challenges methods
  async getChallenges() {
    return this.request('GET', API_CONFIG.ENDPOINTS.CHALLENGES);
  }

  async getCompletedChallenges() {
    return this.request('GET', API_CONFIG.ENDPOINTS.CHALLENGES_COMPLETED);
  }

  async completeChallenge(challengeId: string) {
    return this.request('POST', API_CONFIG.ENDPOINTS.CHALLENGES_COMPLETE, {
      challenge_id: challengeId,
    });
  }

  async getChallengeStats() {
    return this.request('GET', API_CONFIG.ENDPOINTS.CHALLENGES_STATS);
  }
}

export const apiService = new APIService();
```

### Update Environment Variables

Create `.env` in frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Update React Components

Now update your React components to use the API service:

#### LoginPage Component

```typescript
import { apiService } from './services/apiService';

export function LoginPage({ onLogin, onSignup }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await apiService.signin(email, password);
      if (result.success) {
        onLogin(result.email);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### Example Hooks

Create `src/hooks/useApi.ts`:

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const result = await apiService.getExpenses();
      setExpenses(result.expenses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: any) => {
    try {
      const result = await apiService.createExpense(expense);
      setExpenses([result, ...expenses]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, loading, error, addExpense, fetchExpenses };
}
```

## Testing the Integration

### Test Endpoints with cURL

```bash
# Test health check
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'

# Test signin
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test protected endpoint (replace TOKEN with your access token)
curl http://localhost:5000/api/expenses \
  -H "Authorization: Bearer TOKEN"
```

## Common Issues

### API Connection Errors
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` is set correctly
- Verify CORS is configured properly in `config.py`

### Authentication Failures
- Verify Supabase credentials are correct
- Check email verification is working
- Ensure token is being sent in Authorization header

### Expenses Not Saving
- Verify user is authenticated
- Check database schema is applied
- Review browser network tab for API errors

## Next Steps

1. Gradually migrate UI state to use API
2. Implement proper error handling
3. Add loading states and spinners
4. Set up Redux/Context for global state management
5. Add request caching/optimization
6. Implement real-time updates with WebSockets (future enhancement)

---

For detailed API documentation, see `backend/README.md`
