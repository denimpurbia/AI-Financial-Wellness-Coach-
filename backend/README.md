# AI Financial Wellness Coach - Backend API

A Flask-based backend for the AI Financial Wellness Coach application with Supabase authentication, database management, and OpenRouter AI integration.

## Features

- **Authentication**: User registration and login using Supabase Auth
- **Expense Tracking**: Store and manage financial expenses by category
- **Budget Management**: Create and track budgets with spending alerts
- **Financial Goals**: Set and monitor financial goals
- **AI Chatbot**: Multilingual financial advice using OpenRouter API
- **Challenge System**: Gamified financial challenges with XP rewards
- **Analytics**: Expense analysis and financial health scoring
- **Chat History**: Store and retrieve conversation history

## Technology Stack

- **Backend Framework**: Flask
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenRouter API
- **Language**: Python 3.8+

## Prerequisites

Before you begin, you'll need:

1. **Python 3.8+** installed on your system
2. **Supabase Account** - Sign up at https://supabase.com
3. **OpenRouter API Key** - Get it from https://openrouter.ai
4. **pip** or **poetry** for package management

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note your Project URL and API keys:
   - **Project URL** (SUPABASE_URL)
   - **Anon Key** (SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY)

### 2. Set Up Database Schema

1. In Supabase Dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire contents of `backend/database_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to create all tables and policies

### 3. Enable Email Authentication

In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Email with email verification

### 4. Get OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up or log in
3. Go to API Keys
4. Create a new API key
5. Copy your API key

### 5. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 6. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# Fill in all the required values:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENROUTER_API_KEY
```

### 7. Run the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "username",
  "full_name": "User Name",
  "profile_photo": "https://..."
}
```

#### Sign In
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "success": true,
  "user_id": "uuid",
  "email": "user@example.com",
  "access_token": "jwt_token"
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <access_token>
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "New Name",
  "profile_photo": "https://..."
}
```

### Expense Endpoints

#### Get All Expenses
```
GET /api/expenses
Authorization: Bearer <access_token>
```

#### Create Expense
```
POST /api/expenses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 250,
  "category": "Food",
  "description": "Lunch at café",
  "date": "2026-04-03"
}
```

#### Update Expense
```
PUT /api/expenses/<expense_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 300,
  "description": "Updated description"
}
```

#### Delete Expense
```
DELETE /api/expenses/<expense_id>
Authorization: Bearer <access_token>
```

#### Get Expense Analytics
```
GET /api/expenses/analytics
Authorization: Bearer <access_token>
```

Response:
```json
{
  "total_expenses": 5000,
  "average_per_expense": 250,
  "by_category": {
    "Food": 1200,
    "Transport": 800
  },
  "by_month": {
    "2026-03": 2000,
    "2026-04": 3000
  }
}
```

### Budget Endpoints

#### Get All Budgets
```
GET /api/budget
Authorization: Bearer <access_token>
```

#### Create Budget
```
POST /api/budget
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "category": "Food",
  "limit_amount": 500,
  "period": "monthly",
  "description": "Weekly food budget"
}
```

#### Update Budget
```
PUT /api/budget/<budget_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "limit_amount": 600
}
```

#### Get Budget Status
```
GET /api/budget/status
Authorization: Bearer <access_token>
```

Response:
```json
{
  "budget_status": [
    {
      "budget_id": "uuid",
      "category": "Food",
      "limit": 500,
      "spent": 300,
      "remaining": 200,
      "percentage": 60,
      "status": "good"
    }
  ]
}
```

### Chatbot Endpoints

#### Send Message
```
POST /api/chat/message
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "How can I save more money?",
  "language": "english"
}
```

Response:
```json
{
  "success": true,
  "response": "AI generated financial advice...",
  "language": "english",
  "model": "~openai/gpt-latest"
}
```

Supported languages:
- `english`
- `hindi`
- `hinglish`
- `mewadi`

#### Get Chat History
```
GET /api/chat/history?limit=50
Authorization: Bearer <access_token>
```

#### Get AI Suggestions
```
GET /api/chat/suggestions?language=english
Authorization: Bearer <access_token>
```

### Goals Endpoints

#### Get All Goals
```
GET /api/goals
Authorization: Bearer <access_token>
```

#### Create Goal
```
POST /api/goals
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Save for Emergency Fund",
  "description": "3-month emergency fund",
  "target_amount": 10000,
  "current_amount": 2000,
  "category": "Emergency",
  "deadline": "2026-12-31"
}
```

### Challenges Endpoints

#### Get Available Challenges
```
GET /api/challenges
Authorization: Bearer <access_token>
```

Response:
```json
{
  "challenges": [
    {
      "id": "no-spend-weekend",
      "name": "No-Spend Weekend",
      "description": "Complete a weekend without spending money",
      "reward_xp": 30,
      "difficulty": "easy"
    }
  ]
}
```

#### Get Completed Challenges
```
GET /api/challenges/completed
Authorization: Bearer <access_token>
```

#### Complete Challenge
```
POST /api/challenges/complete
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "challenge_id": "no-spend-weekend"
}
```

Response:
```json
{
  "success": true,
  "message": "Challenge completed!",
  "reward_xp": 30
}
```

#### Get Challenge Statistics
```
GET /api/challenges/stats
Authorization: Bearer <access_token>
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Server Configuration
HOST=localhost
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_HTTP_REFERER=http://localhost:5173
OPENROUTER_APP_TITLE=AI Financial Wellness Coach

# AI Configuration
AI_MODEL=~openai/gpt-latest
AI_MAX_TOKENS=1000
AI_TEMPERATURE=0.7

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Database
DATABASE_SCHEMA=public
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error Response Format:
```json
{
  "error": "Error message here",
  "details": "Additional error details if available"
}
```

## Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
```

Tokens are obtained from the sign-in endpoint and should be stored securely in the client.

## Database Schema

Key tables:
- **users**: User profiles and authentication
- **expenses**: User expense records
- **budgets**: Budget limits and tracking
- **goals**: Financial goals
- **chat_history**: Conversation history
- **challenges_completed**: Completed challenges and XP
- **user_preferences**: User settings
- **spending_predictions**: AI-generated spending predictions

## Development

### Install Development Dependencies

```bash
pip install -r requirements.txt
```

### Running Tests

```bash
# (Test suite can be added)
pytest
```

### Debugging

Enable debug mode in `.env`:
```
FLASK_DEBUG=True
```

## Deployment

### Production Checklist

1. Set `FLASK_ENV=production` in `.env`
2. Set `FLASK_DEBUG=False`
3. Use a strong `SECRET_KEY`
4. Set up HTTPS/SSL
5. Configure proper CORS origins
6. Use environment-specific Supabase projects
7. Set up proper logging and monitoring
8. Use a production WSGI server (Gunicorn, uWSGI, etc.)

### Deploy with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

### Deploy with Docker

Create a `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()"]
```

Build and run:
```bash
docker build -t financial-coach-backend .
docker run -p 5000:5000 --env-file .env financial-coach-backend
```

## Troubleshooting

### "Missing required environment variables"
- Ensure all variables in `.env.example` are filled in your `.env` file
- Check your Supabase and OpenRouter API keys are correct

### "Database connection error"
- Verify your Supabase URL and keys
- Check that the database schema has been applied
- Ensure Row Level Security policies are enabled

### "OpenRouter API error"
- Verify your OpenRouter API key is valid
- Check your API key has sufficient credits
- Ensure the API key permissions include chat completions

### CORS errors
- Add your frontend URL to `CORS_ORIGINS` in `.env`
- Ensure the frontend is making requests with correct headers

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check OpenRouter documentation: https://openrouter.ai/docs
4. Create an issue in the project repository

## License

This project is part of the AI Financial Wellness Coach application.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Last Updated**: April 2026
