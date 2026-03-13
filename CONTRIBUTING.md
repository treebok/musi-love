# 🤝 Contributing to Musi-Love

Thank you for your interest in contributing to Musi-Love! This guide will help you get started.

## 🌟 How to Contribute

### Reporting Bugs 🐛

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/device information

### Suggesting Features 💡

We welcome feature suggestions! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Mockups or examples (if applicable)

### Code Contributions 💻

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/musi-love.git
   cd musi-love
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

5. **Test your changes**
   ```bash
   npm run dev
   # Test thoroughly in browser
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes

## 📝 Code Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use arrow functions for components
- Destructure props
- Use meaningful variable names
- Add JSDoc comments for complex functions

**Example:**
```javascript
import React, { useState, useEffect } from 'react';

/**
 * Component description
 * @param {Object} props - Component props
 */
const MyComponent = ({ user, onUpdate }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Effect logic
  }, [user]);
  
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### CSS

- Use CSS variables for colors
- Follow BEM naming convention when appropriate
- Mobile-first responsive design
- Group related styles together

**Example:**
```css
.component {
  background: var(--background);
  padding: 1rem;
}

.component-header {
  font-size: 1.5rem;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .component {
    padding: 0.5rem;
  }
}
```

### File Organization

```
src/
├── components/        # Reusable components
├── contexts/          # React contexts
├── pages/            # Page components
├── utils/            # Utility functions
├── hooks/            # Custom hooks
└── services/         # API services
```

## 🧪 Testing

Currently, the project doesn't have automated tests. Contributions to add testing are welcome!

**Manual testing checklist:**
- [ ] Authentication flow works
- [ ] All pages load correctly
- [ ] Forms validate properly
- [ ] API calls succeed
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] PWA installs correctly

## 📋 Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows style guidelines
- [ ] No console errors or warnings
- [ ] Feature works as expected
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Tested in multiple browsers

## 🎯 Priority Areas for Contribution

We especially welcome contributions in these areas:

1. **Testing**
   - Unit tests (Jest, React Testing Library)
   - E2E tests (Playwright, Cypress)
   - Test coverage reports

2. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast improvements

3. **Performance**
   - Bundle size optimization
   - Image optimization
   - Lazy loading improvements
   - Database query optimization

4. **Features**
   - Dark mode
   - Social features (follow, like, comment)
   - Advanced playlist management
   - Search and filter improvements
   - Notifications

5. **Documentation**
   - Tutorials
   - Video guides
   - API documentation
   - Deployment guides

## 🚀 Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Add YouTube API key to `src/config.js`
   - Ensure Firebase is set up

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌿 Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation
- `refactor/what-changed` - Code refactoring
- `test/what-tested` - Adding tests

## 💬 Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

**Examples:**
```
feat: add dark mode toggle
fix: resolve login redirect issue
docs: update setup guide
refactor: simplify user context
```

## 🔍 Code Review Process

1. Pull request is submitted
2. Maintainer reviews code
3. Feedback provided (if needed)
4. Changes requested or approved
5. PR merged into main branch

## 📞 Getting Help

- Open an issue for questions
- Check existing issues and PRs
- Review documentation files

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Appreciated in the community!

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for making Musi-Love better! 🎵❤️**
