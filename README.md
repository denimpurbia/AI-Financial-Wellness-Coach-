
  # AI Financial Wellness Coach

  A comprehensive financial wellness platform for students with AI-powered financial advice, expense tracking, budgeting, and gamified challenges.

  ## Features

  - ✅ AI-powered financial chatbot (Obsidian AI) with multilingual support
  - 💰 Real-time expense tracking with category analysis
  - 📊 Budget management and spending alerts
  - 🎯 Financial goal setting and tracking
  - 🏆 Gamified challenges with XP rewards system
  - 📚 Financial literacy educational content
  - 👥 Peer comparison analytics
  - 🔐 Secure Supabase authentication
  - 🌍 Multi-language support (English, Hindi, Hinglish, Mewadi)

  ## Tech Stack

  - **Frontend**: React + TypeScript + Vite + Tailwind CSS
  - **Backend**: Flask + Python
  - **Database**: Supabase (PostgreSQL)
  - **AI**: OpenRouter API
  - **Authentication**: Supabase Auth

  ## Quick Start

  ### ⚡ Run Everything at Once (Recommended)

  ```bash
  # Install dependencies (if not already done)
  npm install

  # Start both frontend and backend together
  npm start
  ```

  This will start:
  - Frontend on: `http://localhost:5173`
  - Backend on: `http://localhost:5000`

  > **Note**: The backend server requires Python dependencies to be installed first. See [Backend Setup](#backend-setup) for initial setup.

  ### Frontend Setup

  ```bash
  # Install dependencies
  npm install

  # Start development server
  npm run dev
  ```

  Frontend runs on: `http://localhost:5173`

  ### Backend Setup

  ```bash
  cd backend

  # Create virtual environment
  python -m venv venv

  # Activate virtual environment
  # Windows:
  venv\Scripts\activate
  # macOS/Linux:
  source venv/bin/activate

  # Install dependencies
  pip install -r requirements.txt

  # Create and fill .env file
  cp .env.example .env
  # Edit .env with your credentials

  # Start backend server
  python app.py
  ```

  Backend runs on: `http://localhost:5000`

  ## Setup Requirements

  ### 1. Supabase Project
  - Create account at https://supabase.com
  - Create new project
  - Get Project URL and API keys
  - Run `database_schema.sql` in SQL editor
  - Enable Email authentication

  ### 2. OpenRouter API Key
  - Sign up at https://openrouter.ai
  - Create API key
  - Add to backend `.env` file

  ### 3. Environment Variables

  **Backend** (`backend/.env`):
  ```env
  SUPABASE_URL=your-supabase-url
  SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  OPENROUTER_API_KEY=your-openrouter-key
  OPENROUTER_HTTP_REFERER=http://localhost:5173
  OPENROUTER_APP_TITLE=AI Financial Wellness Coach
  FLASK_ENV=development
  FLASK_DEBUG=True
  ```

  **Frontend** (`.env`):
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

  ## API Documentation

  See [Backend API Documentation](backend/README.md) for complete API reference.

  See [Frontend Integration Guide](BACKEND_INTEGRATION.md) for integration examples.

  ## Project Structure

  ```
  ├── src/                    # Frontend React code
  │   ├── app/
  │   │   ├── components/    # React components
  │   │   └── App.tsx        # Main app component
  │   └── styles/            # CSS styles
  ├── backend/                # Flask backend
  │   ├── routes/            # API route handlers
  │   ├── app.py             # Flask app entry point
  │   ├── auth.py            # Authentication logic
  │   ├── ai_service.py      # AI/OpenRouter integration
  │   ├── supabase_client.py # Database service
  │   ├── config.py          # Configuration
  │   ├── database_schema.sql # Database setup
  │   └── requirements.txt   # Python dependencies
  ├── package.json           # Frontend dependencies
  ├── vite.config.ts         # Vite configuration
  └── README.md              # This file
  ```

  ## Development

  ### Available Frontend Scripts

  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build

  ### Available Backend Scripts

  ```bash
  # Run development server
  python app.py

  # Run with Gunicorn (production)
  gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
  ```

  ## API Endpoints Overview

  | Category | Endpoint | Method |
  |----------|----------|--------|
  | Auth | `/api/auth/signup` | POST |
  | Auth | `/api/auth/signin` | POST |
  | Auth | `/api/auth/profile` | GET, PUT |
  | Expenses | `/api/expenses` | GET, POST, PUT, DELETE |
  | Budget | `/api/budget` | GET, POST, PUT |
  | Chat | `/api/chat/message` | POST |
  | Chat | `/api/chat/history` | GET |
  | Goals | `/api/goals` | GET, POST |
  | Challenges | `/api/challenges` | GET |
  | Challenges | `/api/challenges/complete` | POST |

  Full documentation in [Backend README](backend/README.md)

  ## Deployment

  ### Frontend Deployment
  - Build: `npm run build`
  - Deploy `dist/` to Vercel, Netlify, or any static host

  ### Backend Deployment
  - Use Gunicorn: `pip install gunicorn`
  - Deploy to: Heroku, Railway, AWS, or any Python-capable host
  - Set environment variables in production
  - Use PostgreSQL connection from Supabase

  ## Troubleshooting

  ### Backend won't start
  - Check Python version (3.8+)
  - Verify all environment variables in `.env`
  - Run `pip install -r requirements.txt` again

  ### API connection errors
  - Ensure backend is running on 5000
  - Check `REACT_APP_API_URL` in frontend `.env`
  - Verify CORS configuration

  ### Supabase connection issues
  - Verify Supabase URL and keys are correct
  - Check database schema is applied
  - Ensure Row Level Security policies are in place

  ### OpenRouter API errors
  - Verify API key is valid
  - Check account has sufficient credits
  - Review API documentation at https://openrouter.ai

  ## Contributing

  Contributions welcome! Please:
  1. Fork the repository
  2. Create feature branch
  3. Make changes
  4. Submit pull request

  ## License

  This project is part of the AI Financial Wellness Coach application.

  ## Support

  For setup help, see:
  - Backend guide: [backend/README.md](backend/README.md)
  - Integration guide: [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)
  - Supabase docs: https://supabase.com/docs
  - OpenRouter docs: https://openrouter.ai/docs

  ---

  **Last Updated**: April 3, 2026
  