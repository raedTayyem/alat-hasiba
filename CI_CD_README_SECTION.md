# CI/CD Section for README.md

Add this section to your main README.md file:

---

## CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline powered by GitHub Actions.

### Status Badges

![CI](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/CI/badge.svg)
![Translation Validation](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/Translation%20Validation/badge.svg)
![Bundle Size Check](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/Bundle%20Size%20Check/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/Deploy/badge.svg)

### Features

- **Automated Testing**: Tests run on every push and pull request
- **Code Quality**: ESLint and TypeScript checks ensure code quality
- **Security Scanning**: CodeQL and dependency scanning protect against vulnerabilities
- **Translation Validation**: Automated coverage checking for EN and AR translations
- **Bundle Size Control**: Automatic size tracking and limit enforcement
- **Automated Deployment**: Deploy to production on merge to main
- **Multi-Platform Support**: GitHub Pages, Netlify, Vercel, FTP, AWS S3

### Quick Start

Run all CI checks locally:

```bash
npm run ci
```

Individual checks:

```bash
npm run type-check    # TypeScript compilation
npm run lint          # ESLint
npm test:run          # Run tests
npm run build         # Build project
```

### Documentation

- [CI/CD Setup Guide](CI_CD_SETUP_GUIDE.md) - Complete setup instructions
- [Workflow Documentation](.github/workflows/README.md) - Detailed workflow information
- [Badge Reference](CI_CD_BADGES.md) - All available status badges
- [Pipeline Summary](CI_CD_PIPELINE_SUMMARY.md) - Overview and quick reference

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run local checks (`npm run ci`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

All pull requests must pass CI checks before merging.

---

**Replace `YOUR_USERNAME` with your actual GitHub username in the badge URLs!**
