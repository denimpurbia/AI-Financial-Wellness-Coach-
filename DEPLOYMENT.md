# 🚀 Deployment Guide

This guide explains how to deploy the AI Financial Wellness Coach to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Dependencies updated
- [ ] Documentation updated
- [ ] API keys rotated
- [ ] Database backups created
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS properly configured

## 🔧 Backend Deployment Options

### Option 1: Heroku (Recommended for Small-Medium Scale)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set FLASK_DEBUG=False
   heroku config:set SECRET_KEY=your_secure_key
   heroku config:set SUPABASE_URL=your_url
   heroku config:set SUPABASE_ANON_KEY=your_key
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
   heroku config:set OPENROUTER_API_KEY=your_key
   ```

4. **Add Procfile** (already included)
   ```
   web: python backend/app.py
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: AWS EC2 + Gunicorn + Nginx

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.small or larger
   - Security group: Allow 80, 443, 22

2. **SSH to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Setup Python Environment**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx git
   
   git clone https://github.com/your-repo.git
   cd your-repo/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Configure Gunicorn**
   ```bash
   pip install gunicorn
   gunicorn --workers 4 --bind 0.0.0.0:5000 app:app
   ```

5. **Setup Systemd Service**
   Create `/etc/systemd/system/financial-coach.service`:
   ```ini
   [Unit]
   Description=AI Financial Wellness Coach
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/your-repo/backend
   Environment="PATH=/home/ubuntu/your-repo/backend/venv/bin"
   ExecStart=/home/ubuntu/your-repo/backend/venv/bin/gunicorn --workers 4 --bind 0.0.0.0:5000 app:app

   [Install]
   WantedBy=multi-user.target
   ```

6. **Enable Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable financial-coach
   sudo systemctl start financial-coach
   ```

7. **Configure Nginx** (Reverse Proxy)
   Create `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80 default_server;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile** (in `backend/`)
   ```dockerfile
   FROM python:3.10-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
   ```

2. **Build Image**
   ```bash
   docker build -t financial-coach:latest .
   ```

3. **Run Container**
   ```bash
   docker run -p 5000:5000 \
     -e FLASK_ENV=production \
     -e SUPABASE_URL=your_url \
     -e OPENROUTER_API_KEY=your_key \
     financial-coach:latest
   ```

## 🎨 Frontend Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - In Vercel dashboard
   - Add VITE_API_BASE_URL
   - Add VITE_SUPABASE_URL
   - Add VITE_SUPABASE_ANON_KEY

### Option 2: Netlify

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**
   - Build command: `pnpm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add same VITE_* variables

### Option 3: GitHub Pages

1. **Update vite.config.ts**
   ```typescript
   export default {
     base: '/your-repo-name/',
     // ...
   }
   ```

2. **Create GitHub Action** (`.github/workflows/deploy.yml`)
   Used for auto-deployment on push

## 🔐 Security Configuration

### Backend Security
```python
# Production settings
FLASK_ENV = 'production'
FLASK_DEBUG = False
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
```

### CORS Setup
```python
CORS_ORIGINS = [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
]
```

### Rate Limiting (Add to backend)
```bash
pip install Flask-Limiter
```

Configure in `app.py`:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

## 📊 Monitoring & Logging

### Sentry (Error Tracking)
```bash
pip install sentry-sdk
```

```python
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

### Datadog (Monitoring)
- Sign up at datadog.com
- Install agent
- Monitor performance, errors, and logs

## 🗄️ Database Backups

### Supabase Backups
- Automatic daily backups (7-day retention)
- Enable PITR (Point-in-Time Recovery) for production

### Manual Backup
```bash
# Export database
pg_dump postgresql://user:password@host/db > backup.sql

# Restore database
psql postgresql://user:password@host/db < backup.sql
```

## 🚨 Incident Response

### Rolling Back a Deployment
```bash
# Git
git revert <commit-hash>
git push

# Heroku
heroku releases
heroku rollback v<version>
```

## 📈 Post-Deployment

1. **Verify Deployment**
   - Check API endpoints
   - Test user flows
   - Monitor error logs

2. **Performance Testing**
   - Load testing with Apache Bench or k6
   - Monitor response times
   - Check database queries

3. **Security Audit**
   - OWASP Top 10 check
   - Vulnerability scanning
   - API security review

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:
- Automated testing
- Security scanning
- Automatic deployment to staging
- Manual approval for production

## 📞 Support

For deployment issues:
- Check logs: `heroku logs --tail` (Heroku)
- Monitor Sentry dashboard
- Review application metrics
- Contact support team

## 🎓 Additional Resources

- [Flask Deployment](https://flask.palletsprojects.com/deployment/)
- [Gunicorn Documentation](https://gunicorn.org/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Supabase Hosting](https://supabase.com/)

---

**Status**: Production Ready ✅
