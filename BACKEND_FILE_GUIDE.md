# Backend File Structure Guide

## Overview

This guide explains each file in the backend directory and its purpose.

## Core Files

### `app.py` (Main Application)
**Purpose**: Flask application factory and entry point  
**Contains**:
- Flask app initialization
- Blueprint registration
- CORS configuration
- Error handlers
- Health check endpoint
- Main server loop

**Key Functions**:
- `create_app()` - Creates and configures Flask app
- `health()` - Health check endpoint

**When to use**: Start the server with `python app.py`

---

### `config.py` (Configuration Management)
**Purpose**: Centralized configuration management  
**Contains**:
- Base Config class with default values
- DevelopmentConfig for development
- ProductionConfig for production
- TestingConfig for testing
- Configuration validation

**Key Functions**:
- `get_config(env)` - Returns appropriate config class
- `validate_config()` - Validates all required env vars

**When to use**: Automatically loaded by app.py, no direct usage needed

---

### `auth.py` (Authentication Service)
**Purpose**: Handle all authentication logic  
**Contains**:
- AuthService class for signup/signin/signout
- Token verification
- JWT token handling
- Protected route decorator

**Key Functions**:
- `sign_up()` - Register new user
- `sign_in()` - Login user
- `verify_token()` - Verify JWT token
- `require_auth` - Decorator for protected routes

**When to use**: All auth endpoints use this service

---

### `supabase_client.py` (Database Service)
**Purpose**: Database operations and Supabase integration  
**Contains**:
- SupabaseClient singleton
- DatabaseService class
- All CRUD operations
- Error handling

**Key Classes**:
- `SupabaseClient` - Manages Supabase connection
- `DatabaseService` - Database operations

**Key Functions**:
- `get_supabase_client()` - Get Supabase client instance
- `create_expense()`, `get_user_expenses()`, etc.

**When to use**: All data operations go through this service

---

### `ai_service.py` (AI Integration)
**Purpose**: OpenRouter API integration for AI features  
**Contains**:
- AIService class
- Prompt building with context
- API communication
- Error handling

**Key Functions**:
- `generate_response()` - Get AI response with context
- `analyze_expenses()` - Analyze expense data
- `_build_system_prompt()` - Build context-aware prompts

**When to use**: Chat endpoints use this for AI responses

---

### `database_schema.sql` (Database Setup)
**Purpose**: Complete SQL schema for Supabase  
**Contains**:
- Table definitions (users, expenses, budgets, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Foreign key relationships

**Tables Created**:
- users, expenses, budgets, goals
- chat_history, challenges_completed
- user_preferences, spending_predictions

**When to use**: Run once in Supabase SQL editor to create database

---

### `requirements.txt` (Python Dependencies)
**Purpose**: List all Python package dependencies  
**Contains**:
- Flask and extensions
- Supabase client
- JWT handling
- HTTP clients

**Key Packages**:
- Flask==3.0.0
- supabase==2.3.5
- PyJWT==2.8.1
- requests==2.31.0

**When to use**: Install with `pip install -r requirements.txt`

---

### `.env.example` (Configuration Template)
**Purpose**: Template for environment variables  
**Contains**:
- All required environment variable names
- Example values (commented)
- Brief descriptions

**Variables**:
- Supabase credentials
- OpenRouter API key
- Flask settings
- Server configuration

**When to use**: Copy to `.env` and fill in your actual credentials

---

### `README.md` (API Documentation)
**Purpose**: Complete API reference and setup guide  
**Contains**:
- Setup instructions
- Environment configuration
- All API endpoints with examples
- cURL testing commands
- Troubleshooting
- Deployment guide

**Sections**:
- Prerequisites
- Setup Instructions
- API Endpoints
- Error Handling
- Deployment

**When to use**: Reference for API usage and troubleshooting

---

## Routes Files

### `routes/auth_routes.py` (Authentication Endpoints)
**Purpose**: User authentication endpoints  
**Contains**:
- /auth/signup - Register new user
- /auth/signin - Login user
- /auth/signout - Logout user
- /auth/profile - Get user profile
- /auth/profile - Update user profile

**Returns**: JSON with user data, token, or error

---

### `routes/expenses_routes.py` (Expense Endpoints)
**Purpose**: Expense management endpoints  
**Contains**:
- GET /expenses - List all expenses
- POST /expenses - Create new expense
- PUT /expenses/<id> - Update expense
- DELETE /expenses/<id> - Delete expense
- GET /expenses/analytics - Get analytics

**Returns**: Expense data or analytics summary

---

### `routes/chat_routes.py` (Chatbot Endpoints)
**Purpose**: AI chatbot endpoints  
**Contains**:
- POST /chat/message - Send message to AI
- GET /chat/history - Get chat history
- GET /chat/suggestions - Get AI suggestions
- POST /chat/analyze - Analyze expenses

**Returns**: AI responses or chat history

**Languages Supported**: English, Hindi, Hinglish, Mewadi

---

### `routes/budget_routes.py` (Budget Endpoints)
**Purpose**: Budget management endpoints  
**Contains**:
- GET /budget - List all budgets
- POST /budget - Create budget
- PUT /budget/<id> - Update budget
- GET /budget/status - Get budget status

**Returns**: Budget data or status

---

### `routes/goals_challenges_routes.py` (Goals & Challenges)
**Purpose**: Financial goals and challenges endpoints  
**Contains**:

**Goals Endpoints**:
- GET /goals - List goals
- POST /goals - Create goal

**Challenges Endpoints**:
- GET /challenges - List available
- GET /challenges/completed - Get completed
- POST /challenges/complete - Mark complete
- GET /challenges/stats - Get stats

**Returns**: Goal/challenge data or statistics

---

## File Relationships

```
app.py (entry point)
  ├── config.py (loads configuration)
  ├── supabase_client.py (initializes DB)
  └── routes/ (registers all endpoints)
      ├── auth_routes.py (uses auth.py, supabase_client.py)
      ├── expenses_routes.py (uses supabase_client.py)
      ├── chat_routes.py (uses ai_service.py, supabase_client.py)
      ├── budget_routes.py (uses supabase_client.py)
      └── goals_challenges_routes.py (uses supabase_client.py)

auth.py (authentication)
  └── supabase_client.py (database operations)

ai_service.py (AI integration)
  ├── config.py (reads API keys)
  └── supabase_client.py (saves chat history)

database_schema.sql (database structure)
  └── run once in Supabase
```

## Data Flow Example: Create Expense

```
1. User sends POST request to /api/expenses
2. Flask routes to expenses_routes.py::create_expense()
3. @require_auth decorator verifies token via auth.py
4. Route calls db.create_expense() from supabase_client.py
5. DatabaseService inserts into Supabase database
6. Returns response to user
```

## Data Flow Example: Chat Message

```
1. User sends POST to /api/chat/message
2. Flask routes to chat_routes.py::send_message()
3. @require_auth decorator verifies token
4. Route calls ai_service.generate_response()
5. ai_service.py makes HTTP call to OpenRouter API
6. OpenRouter returns AI response
7. Route saves to chat history via supabase_client.py
8. Returns response to user
```

## Common Operations

### Adding New Endpoint

1. Create function in appropriate route file
2. Add `@require_auth` decorator if protected
3. Use `db = DatabaseService()` for data access
4. Return `jsonify()` with data or error
5. Endpoint is automatically available

### Adding Database Query

1. Add method to `DatabaseService` in supabase_client.py
2. Use Supabase client: `self.supabase.table().select()...`
3. Handle errors with `_handle_error()`
4. Return dict with success flag
5. Call from routes

### Modifying AI Behavior

1. Edit prompts in `ai_service.py::_build_system_prompt()`
2. Adjust `temperature` in config.py
3. Change `max_tokens` in config.py
4. Modify language instructions for new languages

## Environment Variables

See `.env.example` for:
- All required variables
- Example values
- Descriptions

Copy template and fill with real credentials.

## Deployment Considerations

- **config.py** handles environment detection
- **app.py** validates config on startup
- **database_schema.sql** must be run before using
- **requirements.txt** has all dependencies

## Testing Endpoints

Use cURL (see README.md for examples):

```bash
# Create expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 250, "category": "Food", "description": "Lunch"}'

# Get chat history
curl http://localhost:5000/api/chat/history \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

**Module not found errors**:
- Ensure you're in correct directory
- Check Python path includes backend directory
- Verify `__init__.py` exists in routes/

**Connection errors**:
- Check Supabase URL and keys in .env
- Verify network connectivity
- Check Supabase dashboard for issues

**AI errors**:
- Verify OpenRouter API key is valid
- Check account has credits
- Review API response in terminal

---

For more details, see `README.md` in backend directory.
