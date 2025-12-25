# MakerWorld Scraper

A Node.js web scraper that monitors [MakerWorld](https://makerworld.com/en/3d-models) for new 3D models and sends updates to Telegram.

## 🚀 Features

- **Automated Scraping**: Runs on a schedule to monitor new 3D models
- **Telegram Notifications**: Sends updates to your Telegram chat
- **Docker Support**: Containerized for easy deployment
- **Playwright Integration**: Uses headless Chrome for reliable scraping
- **Hourly Updates**: Automatically checks for new content every hour

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Docker (optional, for containerized deployment)
- Telegram Bot Token
- Telegram Chat ID

## 🛠 Installation

### Option 1: Local Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

4. Create a `.env` file with your Telegram credentials:
   ```
   TG_BOT_TOKEN=your_telegram_bot_token
   TG_CHAT_ID=your_telegram_chat_id
   ```

5. Run the scraper:
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t makerworld-scraper .
   ```

2. Run the container with environment variables:
   ```bash
   docker run -e TG_BOT_TOKEN=your_telegram_bot_token -e TG_CHAT_ID=your_telegram_chat_id makerworld-scraper
   ```

## ⚙️ Configuration

### Environment Variables

- `TG_BOT_TOKEN`: Your Telegram bot token (required)
- `TG_CHAT_ID`: The chat ID where notifications will be sent (required)

### Creating a Telegram Bot

1. Message @BotFather on Telegram
2. Send `/newbot` to create a new bot
3. Follow the instructions to set a name and username
4. Copy the API token provided
5. Message your new bot to start a chat
6. Find your chat ID using: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`

## 📊 Output

The scraper collects:
- Top 5 model links with titles and URLs
- Top 5 GIF images from the page
- Timestamp of the scrape
- All data is formatted in Markdown and sent to Telegram

## 🗓️ Schedule

The scraper runs:
- Initial execution when started
- Every hour on the hour (0 * * * *)

## 🤖 How It Works

1. Uses Playwright to launch a headless Chrome browser
2. Navigates to MakerWorld's 3D models page
3. Extracts model links and GIF images
4. Formats the data into a Telegram message
5. Sends the message to your specified chat

## 🛡️ Anti-Detection

The scraper includes measures to avoid detection:
- Custom user agent string
- Headless browser settings
- Automation control prevention
- Appropriate timeouts

## 🐳 Docker

The included Dockerfile:
- Uses Node.js 18 base image
- Installs necessary system dependencies for Playwright
- Sets up the application environment
- Runs the scraper in production mode

## 🔐 Security

- Never commit your `.env` file to version control
- The `.gitignore` file excludes sensitive environment files
- Use environment variables for all credentials

## 🚨 Troubleshooting

- If the scraper fails, check that your Telegram credentials are correct
- Ensure the system has enough resources for the headless browser
- Check network connectivity to MakerWorld
- Review Playwright dependencies are properly installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational purposes only. Please respect MakerWorld's Terms of Service and robots.txt file. Use responsibly and at your own risk.