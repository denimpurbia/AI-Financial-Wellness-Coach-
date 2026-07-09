# 🔐 Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please email security@example.com instead of using the public issue tracker. We appreciate your responsible disclosure.

## Security Best Practices

### For Users
- **Never commit `.env` files** to version control
- Always use environment variables for sensitive data
- Keep your dependencies updated
- Review the `.env.example` file for required configuration

### For Developers
- Run `pip install -r requirements.txt` in a virtual environment
- Use `python-dotenv` for development configuration only
- Always validate and sanitize user input
- Use parameterized queries to prevent SQL injection
- Never hardcode API keys or secrets

## Environment Variables

The following environment variables should **NEVER** be committed:
- `OPENROUTER_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SECRET_KEY`

Use `.env.example` as a template and create a local `.env` file.

## Dependencies

We regularly audit dependencies for security vulnerabilities using:
- `pip audit` (Python)
- `npm audit` (Node.js)

## Authentication & Authorization

- JWT tokens are used for API authentication
- Supabase Row Level Security (RLS) enforces data isolation
- All sensitive endpoints require authentication
- CORS is configured to prevent cross-origin attacks

## Data Protection

- All user data is encrypted in transit (HTTPS)
- Sensitive data is never logged
- Database backups are regularly taken
- User data follows GDPR compliance guidelines

## Compliance

- ✅ HTTPS only
- ✅ Input validation on all endpoints
- ✅ Rate limiting recommended in production
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection

## Production Deployment

Before deploying to production:
1. Set `FLASK_ENV=production`
2. Set `FLASK_DEBUG=False`
3. Generate a secure `SECRET_KEY`
4. Enable HTTPS
5. Set up proper CORS origins
6. Use environment-specific `.env` files
7. Enable security headers
8. Set up logging and monitoring
9. Regular security updates

## Questions?

If you have security concerns, please contact security@example.com or open a private security advisory on GitHub.
