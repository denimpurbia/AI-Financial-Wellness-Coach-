# 🤝 Contributing to AI Financial Wellness Coach

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:
- Be respectful and inclusive
- Provide constructive feedback
- Respect different viewpoints
- Report any violations to the maintainers

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/AI-Financial-Wellness-Coach.git
   cd AI-Financial-Wellness-Coach
   ```

2. **Create a virtual environment (Python)**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd ..
   pnpm install
   ```

4. **Create a `.env` file** (use `.env.example` as template)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔄 Development Workflow

### Creating a Branch
```bash
git checkout -b feature/your-feature-name
```

### Testing Your Changes
- **Backend**: `cd backend && python app.py`
- **Frontend**: `pnpm run dev`
- Test locally before pushing

### Commit Guidelines
```bash
# Good commit messages
git commit -m "feat: add expense categorization"
git commit -m "fix: resolve budget calculation bug"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve expense service"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance
- `style`: Formatting

### Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a PR on GitHub with a clear description

## 📐 Code Style

### Python (Backend)
- Follow [PEP 8](https://pep8.org/)
- Use meaningful variable names
- Add docstrings to functions and classes
- Run `flake8` for linting

```bash
pip install flake8
flake8 backend/
```

### TypeScript/React (Frontend)
- Use TypeScript for type safety
- Follow component naming conventions
- Use meaningful prop names
- Comment complex logic

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage

```bash
# Python tests
cd backend
pytest

# Frontend tests
cd ..
pnpm test
```

## 📝 Documentation

- Update README if adding new features
- Add comments for complex logic
- Update API docs if modifying endpoints
- Include examples in documentation

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Python version, Node version)

## 💡 Feature Requests

When suggesting features:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Examples or mockups if applicable

## 📦 Pull Request Process

1. **Update documentation** if needed
2. **Ensure code passes linting**
   ```bash
   flake8 backend/  # Python
   pnpm lint        # Frontend (if configured)
   ```
3. **Write clear PR description**
4. **Reference related issues** (#123)
5. **Be ready for feedback and iterate**

### PR Template
```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## How Has This Been Tested?
Please describe testing approach

## Checklist
- [ ] My code follows the code style
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have tested this locally
```

## 🔒 Security

- Never commit `.env` files with actual credentials
- Don't include API keys in code
- Follow security best practices (see [SECURITY.md](SECURITY.md))
- Report security issues privately

## 📚 Resources

- [API Documentation](backend/README.md)
- [Backend Guide](BACKEND_FILE_GUIDE.md)
- [Frontend Integration](BACKEND_INTEGRATION.md)
- [Project Overview](BACKEND_SUMMARY.md)

## 🎯 Project Areas

### Backend (Python/Flask)
- API endpoints in `backend/routes/`
- Database logic in `backend/supabase_client.py`
- Authentication in `backend/auth.py`
- AI integration in `backend/ai_service.py`

### Frontend (React/TypeScript)
- Components in `src/app/components/`
- Pages in `src/app/`
- Services in `src/services/`
- Styles in `src/styles/`

## 💬 Questions?

- Open a discussion in GitHub Discussions
- Create an issue for clarification
- Contact maintainers via email

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

Thank you for contributing! Your help makes this project better! 🙌
