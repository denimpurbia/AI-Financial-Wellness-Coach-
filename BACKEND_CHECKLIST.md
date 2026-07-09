# Backend Setup Checklist

Use this checklist to verify your backend is set up correctly.

## Prerequisites Checklist

- [ ] Python 3.8+ installed (`python --version`)
- [ ] pip installed (`pip --version`)
- [ ] Git installed (optional but recommended)
- [ ] Text editor or IDE available
- [ ] Internet connection for API calls
- [ ] Supabase account created
- [ ] OpenRouter account created

## Supabase Setup

### Create Supabase Project
- [ ] Logged into https://supabase.com
- [ ] Created new project
- [ ] Project creation completed (may take 1-2 minutes)

### Collect Credentials
- [ ] Found Project URL in Settings → API
  ```
  SUPABASE_URL: https://xxxxx.supabase.co
  ```
- [ ] Found Anon Key in Settings → API
  ```
  SUPABASE_ANON_KEY: eyJhbGciOi...
  ```
- [ ] Found Service Role Key in Settings → API
  ```
  SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOi...
  ```

### Database Setup
- [ ] Opened SQL Editor in Supabase
- [ ] Created new query
- [ ] Copied entire `backend/database_schema.sql`
- [ ] Pasted into SQL editor
- [ ] Executed query successfully
  - Should see "Success" message
  - No red error warnings
- [ ] Verified tables created
  - Go to Table Editor
  - See users, expenses, budgets, goals, etc.

### Authentication Setup
- [ ] Went to Authentication → Providers
- [ ] Enabled Email provider
- [ ] Email is toggled ON (blue)

## OpenRouter Setup

- [ ] Created account at https://openrouter.ai
- [ ] Went to API Keys section
- [ ] Created new API key
- [ ] Copied API key
  ```
  OPENROUTER_API_KEY: sk-or-v1-...
  ```
- [ ] Verified account has credits/quota

## Backend Installation

### Virtual Environment
- [ ] Navigated to `backend/` directory
- [ ] Created virtual environment
  ```bash
  python -m venv venv
  ```
- [ ] Activation file exists at `venv/Scripts/activate` (Windows)
  or `venv/bin/activate` (Mac/Linux)
- [ ] Activated virtual environment
  ```bash
  venv\Scripts\activate  # Windows
  source venv/bin/activate  # Mac/Linux
  ```
- [ ] Prompt shows `(venv)` prefix

### Dependencies
- [ ] `requirements.txt` exists in `backend/` folder
- [ ] Installed dependencies
  ```bash
  pip install -r requirements.txt
  ```
- [ ] No errors during installation
- [ ] Check with `pip list` to verify packages

### Environment Configuration
- [ ] Copied `.env.example` to `.env`
  ```bash
  cp .env.example .env  # Mac/Linux
  copy .env.example .env  # Windows
  ```
- [ ] `.env` file exists in `backend/` folder
- [ ] Opened `.env` in text editor
- [ ] Filled all required variables:
  - [ ] `SUPABASE_URL=https://xxxxx.supabase.co`
  - [ ] `SUPABASE_ANON_KEY=eyJhbGc...`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...`
  - [ ] `OPENROUTER_API_KEY=sk-or-v1-...`
  - [ ] `FLASK_ENV=development`
  - [ ] `FLASK_DEBUG=True`
  - [ ] `SECRET_KEY=your-secret-key` (any string)
- [ ] All API keys are non-empty
- [ ] No syntax errors in `.env`

### File Verification
- [ ] `backend/app.py` exists
- [ ] `backend/config.py` exists
- [ ] `backend/auth.py` exists
- [ ] `backend/supabase_client.py` exists
- [ ] `backend/ai_service.py` exists
- [ ] `backend/routes/` folder exists
- [ ] `backend/routes/auth_routes.py` exists
- [ ] `backend/routes/expenses_routes.py` exists
- [ ] `backend/routes/chat_routes.py` exists
- [ ] `backend/routes/budget_routes.py` exists
- [ ] `backend/routes/goals_challenges_routes.py` exists
- [ ] `backend/requirements.txt` exists

## Server Startup

### Start Backend
- [ ] Virtual environment is activated (`(venv)` shows in prompt)
- [ ] Current directory is `backend/`
- [ ] Run: `python app.py`
- [ ] See startup message:
  ```
  ============================================================
  AI Financial Wellness Coach - Backend Server
  ============================================================
  Starting server on http://localhost:5000
  Environment: development
  ```
- [ ] No error messages appear
- [ ] Server shows "Press Ctrl+C to quit"
- [ ] Port 5000 is not in use by another process

### Server Running
- [ ] Server responds to requests
- [ ] Can access http://localhost:5000 in browser
- [ ] Terminal shows no errors

## API Testing

### Health Check
- [ ] Open new terminal
- [ ] Run: `curl http://localhost:5000/api/health`
- [ ] Response shows:
  ```json
  {"status":"healthy",...}
  ```

### API Root
- [ ] Run: `curl http://localhost:5000/api`
- [ ] Response shows endpoints list

### Signup Endpoint
- [ ] Run signup curl command (see GETTING_STARTED.md)
- [ ] Response includes `user_id`
- [ ] No authentication errors
- [ ] Check Supabase Users table - new user appears

### Signin Endpoint
- [ ] Run signin curl command with same email/password
- [ ] Response includes `access_token`
- [ ] Token is JWT format (xxx.yyy.zzz)

### Protected Endpoint
- [ ] Get token from signin response
- [ ] Run expenses GET with Authorization header
- [ ] Response shows empty expenses array `[]`
- [ ] No "unauthorized" errors

### Create Expense
- [ ] Run create expense curl command
- [ ] Response includes expense with ID
- [ ] Amount, category, description match
- [ ] Check Supabase expenses table - data appears

### Chat Endpoint
- [ ] Run chat message curl command
- [ ] Response includes `response` field (AI message)
- [ ] Response is not empty
- [ ] Language matches what was sent

## Supabase Verification

### Tables Exist
- [ ] Go to Supabase → Table Editor
- [ ] See these tables:
  - [ ] users
  - [ ] expenses
  - [ ] budgets
  - [ ] goals
  - [ ] chat_history
  - [ ] challenges_completed
  - [ ] user_preferences
  - [ ] spending_predictions

### Data Appears
- [ ] users table has at least 1 user
- [ ] expenses table has at least 1 expense
- [ ] chat_history table has chat messages
- [ ] Data matches what you created via API

### Indexes Exist
- [ ] Each table has relevant indexes
- [ ] No slow query warnings

## Configuration Verification

### Flask Configuration
- [ ] FLASK_ENV is "development" (for development)
- [ ] FLASK_DEBUG is True (shows errors)
- [ ] SECRET_KEY is set (any non-empty string)

### Supabase Configuration
- [ ] SUPABASE_URL is valid URL (contains .supabase.co)
- [ ] All three Supabase keys are present and correct
- [ ] Can connect to database from backend

### OpenRouter Configuration
- [ ] OPENROUTER_API_KEY starts with "sk-or-v1-"
- [ ] API key is not empty
- [ ] Can connect to OpenRouter API

### Server Configuration
- [ ] HOST is "localhost"
- [ ] PORT is 5000
- [ ] CORS_ORIGINS includes frontend URL

## Documentation Verification

- [ ] `backend/README.md` exists and is readable
- [ ] `BACKEND_INTEGRATION.md` exists for frontend setup
- [ ] `BACKEND_SUMMARY.md` exists with overview
- [ ] `GETTING_STARTED.md` exists (this file!)
- [ ] All docs are markdown format

## Troubleshooting Checklist

### If server won't start:
- [ ] Virtual environment is activated
- [ ] Python version is 3.8+
- [ ] All dependencies installed (`pip list` shows Flask, supabase, etc.)
- [ ] Port 5000 is available (not in use)
- [ ] `.env` file exists and is valid

### If API returns errors:
- [ ] Check `.env` credentials are correct
- [ ] Verify Supabase project is running
- [ ] Check OpenRouter API key is valid
- [ ] Review error message in backend terminal

### If database operations fail:
- [ ] Verify database schema was applied
- [ ] Check Supabase tables exist
- [ ] Verify RLS policies are in place
- [ ] Check row-level security isn't blocking queries

### If AI responses fail:
- [ ] Check OpenRouter API key in `.env`
- [ ] Verify account has credits
- [ ] Check API key permissions include chat
- [ ] Review OpenRouter status page

## Performance Checks

- [ ] API requests complete in < 2 seconds
- [ ] No warning messages in terminal
- [ ] Database queries are fast
- [ ] AI responses arrive within reasonable time

## Security Checks

- [ ] `.env` file is NOT in git (check `.gitignore`)
- [ ] API keys are not hardcoded anywhere
- [ ] Supabase RLS policies are enabled
- [ ] Protected routes require Bearer token
- [ ] CORS is configured properly

## Deployment Readiness

- [ ] Can describe how to deploy to production
- [ ] Knows how to set environment variables
- [ ] Understands HTTPS requirements
- [ ] Has plan for logging/monitoring

## Documentation Readiness

- [ ] Can follow `GETTING_STARTED.md` instructions
- [ ] Can understand `backend/README.md`
- [ ] Can integrate with frontend via `BACKEND_INTEGRATION.md`
- [ ] Can troubleshoot common issues

## Final Verification

### Complete Setup Check
- [ ] Backend server running without errors
- [ ] Health endpoint responds
- [ ] Can signup and login
- [ ] Can create and retrieve data
- [ ] AI chatbot responds
- [ ] Supabase has all data
- [ ] No error messages in logs

### Complete? 
If all boxes are checked ✓, your backend is fully operational!

---

## Next Steps

1. **If all tests pass**:
   - Review `BACKEND_INTEGRATION.md` for frontend integration
   - Start connecting React frontend to backend

2. **If any test fails**:
   - Review the failing section
   - Check corresponding documentation
   - Verify all credentials are correct
   - Check error messages in terminal

3. **Ready for production?**
   - Review deployment section in `backend/README.md`
   - Set `FLASK_ENV=production`
   - Use Gunicorn for WSGI server
   - Deploy to hosting platform

---

**Congratulations!** 🎉 Your backend is ready to power the AI Financial Wellness Coach!
