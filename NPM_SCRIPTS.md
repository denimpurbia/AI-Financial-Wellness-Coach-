# 📋 Available npm Scripts

Quick reference for all available npm commands to run the project.

## 🚀 Main Commands

### `npm start` ⭐ **RECOMMENDED**
**Start both frontend and backend together**
```bash
npm start
```
- Runs frontend on `http://localhost:5173`
- Runs backend on `http://localhost:5000`
- Requires both to be installed (see Setup section below)
- Requires `concurrently` package (included in devDependencies)

### `npm run frontend`
**Start only the frontend development server**
```bash
npm run frontend
```
- Same as `npm run dev`
- Runs on `http://localhost:5173`
- Good for frontend-only development

### `npm run backend`
**Start only the backend Flask server**
```bash
npm run backend
```
- Runs backend from `backend/app.py`
- Runs on `http://localhost:5000`
- Good for backend-only development
- Make sure Python dependencies are installed first

### `npm run dev`
**Old command for frontend dev (equivalent to `npm run frontend`)**
```bash
npm run dev
```
- Legacy command, use `npm run frontend` instead
- Runs Vite dev server on `http://localhost:5173`

### `npm run build`
**Build frontend for production**
```bash
npm run build
```
- Builds optimized production bundle
- Output in `dist/` folder
- Use this before deploying

---

## ⚙️ Setup Requirements

### Frontend Setup (One-time)
```bash
# Install npm dependencies
npm install
```

### Backend Setup (One-time)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Setup .env file
cp .env.example .env
# Edit .env with your credentials
```

---

## 📝 Environment Variables

### Frontend (`.env` in root)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
FLASK_ENV=development
FLASK_DEBUG=True
HOST=localhost
PORT=5000
```

---

## 🔄 Typical Workflow

### First Time Setup ✨
```bash
# Install frontend dependencies
npm install

# Setup backend
cd backend
python -m venv venv
venv\Scripts\activate  # or: source venv/bin/activate on macOS/Linux
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Go back to root
cd ..
```

### Daily Development 👨‍💻
```bash
# Start everything
npm start

# In another terminal, if you want to run backend separately:
# cd backend
# venv\Scripts\activate
# python app.py
```

### Building for Production 🚀
```bash
npm run build
# Then deploy the dist/ folder
```

---

## 🐛 Troubleshooting

### Backend not starting with `npm start`?
- Make sure Python dependencies are installed: `cd backend && pip install -r requirements.txt`
- Make sure backend/.env file is created with proper credentials
- Check that port 5000 is not in use

### Frontend not compiling?
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Check Node.js version: `node --version` (should be 14+)

### Ports already in use?
- Frontend (5173): Change in `vite.config.ts`
- Backend (5000): Change `PORT` in `backend/.env`

### Can't run backend.?
- Activate virtual environment first: `cd backend && venv\Scripts\activate`
- Check Python version: `python --version` (should be 3.8+)

---

## 📚 More Info

- Frontend docs: See `src/` folder
- Backend docs: See `backend/README.md`
- Payment flow: See `PAYMENT_FLOW_GUIDE.md`
- Full setup: See `GETTING_STARTED.md`

---

**Happy coding! 💜**
