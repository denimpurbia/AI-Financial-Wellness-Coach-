# Getting Started with the AI Financial Wellness Coach

**Complete installation and running guide - takes ~15 minutes**

## 🚀 Quick Start (After Initial Setup)

Once you've completed the setup below, you can start everything with:

```bash
npm start
```

This runs both frontend and backend together! 🎉

---

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager) 
- Node.js and npm (for frontend)
- Supabase account (free at https://supabase.com)
- OpenRouter API key (free at https://openrouter.ai)

## Step-by-Step Setup

### Step 1: Prepare Supabase (5 minutes)

1. Go to https://supabase.com and sign up
2. Create a new project
3. In Project Settings, copy:
   - `Project URL` → `SUPABASE_URL`
   - `Anon Key` → `SUPABASE_ANON_KEY`
   - `Service Role Key` → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to SQL Editor → New Query
5. Copy entire contents of `backend/database_schema.sql`
6. Paste into SQL editor and click "Run"
7. Go to Authentication → Providers and enable Email

### Step 2: Get OpenRouter API Key (2 minutes)

1. Visit https://openrouter.ai
2. Sign up or log in
3. Go to API Keys section
4. Create new API key
5. Copy the key → `OPENROUTER_API_KEY`

### Step 3: Setup Backend (8 minutes)

```bash
# Navigate to backend folder
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows Command Prompt:
venv\Scripts\activate
# Windows PowerShell:
venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Create environment file
copy .env.example .env
# On Windows PowerShell or Linux/Mac: cp .env.example .env

# Edit .env file with your credentials
# Use any text editor to fill in:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENROUTER_API_KEY
```

### Step 4: Start Backend Server

```bash
python app.py
```

You should see:
```
============================================================
AI Financial Wellness Coach - Backend Server
============================================================
Starting server on http://localhost:5000
Environment: development
...
```

## Verify Installation

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"healthy","service":"AI Financial Wellness Coach Backend","version":"1.0.0"}
```

## Common Issues & Solutions

### Issue: "python: command not found"
**Solution**: 
- Ensure Python is installed
- Try `python3` instead of `python`
- Add Python to PATH if needed

### Issue: "No module named 'flask'"
**Solution**:
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check Python version (must be 3.8+)

### Issue: "Missing required environment variables"
**Solution**:
- Check all fields in `.env` are filled
- Verify Supabase credentials are correct
- Ensure OpenRouter API key is valid

### Issue: "Supabase connection error"
**Solution**:
- Verify Project URL is correct (should start with https://)
- Check API keys are correct
- Ensure database schema was applied
- Check internet connection

### Issue: "OpenRouter API error"
**Solution**:
- Verify API key is correct
- Check account has sufficient credits
- Visit https://openrouter.ai/status to check service

## Testing API Endpoints

### Test 1: Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### Test 2: Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response will include `access_token` - copy this for next tests.

### Test 3: Create Expense
```bash
# Replace TOKEN with your access_token from signin
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250,
    "category": "Food",
    "description": "Lunch at cafe",
    "date": "2026-04-03"
  }'
```

### Test 4: Send Chat Message
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I save more money?",
    "language": "english"
  }'
```

## Next: Frontend Integration

Once backend is running, see `BACKEND_INTEGRATION.md` for:
- Connecting React frontend to backend
- Creating API service layer
- Implementing hooks
- Full working examples

## File Structure 

All backend files in `backend/`:

```
backend/
├── app.py                    # Start here!
├── config.py                 # Configuration
├── auth.py                   # Authentication
├── supabase_client.py        # Database
├── ai_service.py             # AI features
├── database_schema.sql       # Install database once
├── requirements.txt          # Dependencies
├── .env.example              # Config template
├── README.md                 # Full API docs
└── routes/                   # API endpoints
    ├── auth_routes.py
    ├── expenses_routes.py
    ├── chat_routes.py
    ├── budget_routes.py
    └── goals_challenges_routes.py
```

## Production Deployment

For hosting the backend (later):

**Option 1: Heroku** (recommended for beginners)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

**Option 2: Railway**
- Import from GitHub
- Set environment variables
- Deploy!

**Option 3: AWS/Google Cloud**
- Containerize with Docker
- Deploy to container service

## Documentation

| Document | Purpose | Read When |
|----------|---------|-----------|
| `backend/README.md` | Complete API reference | Need to understand an endpoint |
| `BACKEND_INTEGRATION.md` | Frontend integration | Connecting React to backend |
| `BACKEND_FILE_GUIDE.md` | File-by-file explanation | Understanding code structure |
| `BACKEND_SUMMARY.md` | High-level overview | Getting project overview |

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `python app.py` |
| Install dependencies | `pip install -r requirements.txt` |
| Activate venv (Windows) | `venv\Scripts\activate` |
| Activate venv (Mac/Linux) | `source venv/bin/activate` |
| Test health | `curl http://localhost:5000/api/health` |
| View API docs | See `backend/README.md` |

## Support

- **Setup issues**: Check `.env` file is correct
- **API errors**: See error message and check `backend/README.md`
- **Database issues**: Verify schema was applied in Supabase
- **AI not working**: Check OpenRouter API key is valid

## Success Checklist

- [ ] Backend server running on localhost:5000
- [ ] Health endpoint returns success
- [ ] Can signup new user
- [ ] Can signin and get token
- [ ] Can create expenses
- [ ] Can get AI response from chatbot
- [ ] Supabase database has data

**If all checked ✓, your backend is ready!**

## Next Steps After Setup

1. **Option A**: Test API with provided curl commands
2. **Option B**: Integrate with React frontend (see BACKEND_INTEGRATION.md)
3. **Option C**: Explore different endpoints in README.md
4. **Option D**: Start building more features!

---

**Need help?** See the full documentation in `backend/README.md`

**Everything working?** Great! Your AI Financial Wellness Coach backend is ready to go! 🚀
