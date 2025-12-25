# Contributing to MakerWorld Scraper

Thank you for your interest in contributing to the MakerWorld Scraper project! We welcome contributions from the community and appreciate your help in improving this tool.

## 📝 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Project Structure](#project-structure)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 How Can I Contribute?

### Reporting Bugs

- Check the existing issues before creating a new one
- Use a clear and descriptive title
- Include as much detail as possible about the issue
- Provide steps to reproduce the problem
- Include your environment information (OS, Node.js version, etc.)

### Suggesting Enhancements

- Check if the enhancement has already been suggested
- Provide a clear and detailed explanation of the feature
- Explain why this enhancement would be useful
- Consider implementation complexity

### Pull Requests

- Fork the repository
- Create a feature branch from `main`
- Follow the coding style guidelines
- Include tests if applicable
- Update documentation as needed
- Ensure all tests pass
- Submit a pull request with a clear description

## ⚙️ Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/makerworld-scraper.git
   cd makerworld-scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

4. Create a `.env` file with your test credentials:
   ```
   TG_BOT_TOKEN=your_test_bot_token
   TG_CHAT_ID=your_test_chat_id
   ```

5. Run the scraper locally:
   ```bash
   npm start
   ```

## 🔄 Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update documentation as needed
3. Add tests for new functionality if applicable
4. Ensure all tests pass
5. Submit your pull request with a clear title and description
6. Link any relevant issues in the pull request description
7. Be responsive to feedback during the review process

## 🎨 Style Guidelines

### JavaScript Style
- Use 2-space indentation
- Use semicolons
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for constructors
- Follow the existing code style in the project

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters or less
- Reference issues and pull requests after the first line

### File Naming
- Use kebab-case for file names (e.g., `my-file-name.js`)
- Use descriptive names that reflect the file's purpose

## 📁 Project Structure

```
makerworld-scraper/
├── scraper.js          # Main scraping logic
├── package.json        # Project dependencies and scripts
├── Dockerfile          # Docker configuration
├── .dockerignore       # Files to ignore in Docker builds
├── .env                # Environment variables (not committed)
├── .gitignore          # Files to ignore in Git
├── README.md           # Project documentation
├── LICENSE             # License information
└── CONTRIBUTING.md     # This file
```

## 🧪 Testing

Currently, the project doesn't have automated tests, but please ensure your changes work as expected before submitting a pull request.

## 🙏 Thank You

Thank you for contributing to MakerWorld Scraper! Your efforts help make this tool better for everyone.