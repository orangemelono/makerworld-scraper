# Security Policy

## 🛡️ Supported Versions

We provide security updates for the following versions of MakerWorld Scraper:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in this project, please follow these steps:

### Do Not Create a Public Issue
To protect the community, please do not create a public GitHub issue for security vulnerabilities. Instead, report them privately.

### How to Report
Send an email to [security@your-organization.com](mailto:security@your-organization.com) with the following information:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Your recommendation for fixing the issue (if any)
- Your contact information for follow-up

### Response Timeline
We commit to:
- Acknowledging your report within 48 hours
- Providing a preliminary assessment within 7 days
- Providing a fix or mitigation plan within 30 days
- Keeping you informed throughout the process

## 📋 Security Best Practices

### For Users
- Keep your dependencies up to date
- Never commit sensitive credentials to version control
- Use environment variables for secrets
- Regularly rotate your Telegram bot tokens
- Monitor your bot's activity for unusual behavior

### For Contributors
- Follow secure coding practices
- Validate and sanitize all inputs
- Use parameterized queries to prevent injection attacks
- Implement proper error handling
- Keep dependencies updated

## 📊 Supported Attack Vectors

We're particularly interested in reports related to:

- Injection attacks (SQL, command, etc.)
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Authentication and authorization issues
- Data exposure vulnerabilities
- Denial of service (DoS) vulnerabilities
- Dependency vulnerabilities

## 🙏 Acknowledgments

We appreciate the security community's efforts in identifying and reporting vulnerabilities. We will publicly acknowledge your contribution in our release notes unless you prefer to remain anonymous.

## 📞 Additional Information

For general security questions or concerns that are not vulnerabilities, feel free to open a GitHub issue or contact us through other communication channels.