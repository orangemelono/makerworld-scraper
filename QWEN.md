# MakerWorld Scraper Project

## Project Overview

This is an automated web scraping tool that monitors the MakerWorld 3D models website and sends updates to a Telegram chat. The project uses Playwright for web scraping, node-telegram-bot-api for Telegram integration, and node-cron for scheduling.

The scraper runs every hour and extracts:
- Top 5 3D models from the MakerWorld website with their titles and links
- Top 5 GIF images from the same page

## Architecture & Technologies

- **Main Language**: JavaScript (Node.js)
- **Web Scraping**: Playwright with Chromium browser
- **Telegram Integration**: node-telegram-bot-api
- **Scheduling**: node-cron
- **Deployment**: Docker container
- **Target**: MakerWorld 3D models website (https://makerworld.com/en/3d-models)

## Building and Running

### Prerequisites
- Node.js >= 18.0.0
- Telegram Bot Token
- Telegram Chat ID

### Environment Variables
- `TG_BOT_TOKEN`: Your Telegram bot token
- `TG_CHAT_ID`: The Telegram chat ID where notifications will be sent

### Running Locally
```bash
# Install dependencies
npm install

# Set environment variables
export TG_BOT_TOKEN="your_bot_token"
export TG_CHAT_ID="your_chat_id"

# Run the scraper
npm start
```

### Running with Docker
```bash
# Build the Docker image
docker build -t makerworld-scraper .

# Run the container
docker run -e TG_BOT_TOKEN="your_bot_token" -e TG_CHAT_ID="your_chat_id" makerworld-scraper
```

### Development Conventions
- The scraper is designed to run continuously, checking the website every hour
- Error handling is implemented to prevent crashes during scraping or Telegram API failures
- The Playwright configuration includes anti-bot detection measures (custom user agent, webdriver property override)
- Logging is implemented throughout the application for debugging purposes

## Key Features

1. **Anti-Detection Measures**: The scraper uses headless Chromium with specific arguments and configurations to avoid detection by anti-bot systems.

2. **Scheduled Execution**: Uses node-cron to run the scraping process every hour at minute 0.

3. **Telegram Notifications**: Sends formatted messages with Markdown support to a Telegram chat with scraped data.

4. **Docker Support**: Includes a Dockerfile optimized for production deployment with all necessary system dependencies for Playwright.

5. **Error Handling**: Comprehensive error handling for both scraping and Telegram API calls.

## File Structure

- `scraper.js`: Main application file containing all scraping and notification logic
- `package.json`: Dependencies and project metadata
- `Dockerfile`: Production-ready Docker configuration
- `.dockerignore`: Files to exclude from Docker image

## Security Considerations

- Environment variables are used for sensitive data (bot token and chat ID)
- No sensitive data is logged or stored in the application
- The Docker image is built with security in mind (uses slim base image)

## Testing

The application doesn't have formal tests, but can be tested by running it and verifying:
- Successful scraping of MakerWorld website
- Proper formatting of Telegram messages
- Hourly scheduling functionality
- Error handling when website is unavailable or Telegram API fails