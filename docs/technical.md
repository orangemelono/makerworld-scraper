# Technical Documentation

## Architecture

The MakerWorld Scraper is a Node.js application that uses Playwright for web scraping and node-telegram-bot-api for notifications.

## Components

### scraper.js
Main application file containing:
- Web scraping logic using Playwright
- Telegram notification functionality
- Scheduling with node-cron
- Error handling and logging

### Dependencies
- `playwright`: For headless browser automation
- `node-telegram-bot-api`: For sending messages to Telegram
- `node-cron`: For scheduling tasks

## Configuration

### Environment Variables
- `TG_BOT_TOKEN`: Telegram bot API token
- `TG_CHAT_ID`: Chat ID where notifications are sent

### Scheduling
The scraper runs:
- An initial execution when the application starts
- Every hour on the hour using cron expression '0 * * * *'

## Anti-Detection Measures

The scraper includes several measures to avoid detection:
- Custom user agent string
- Headless browser settings
- Automation control prevention
- Appropriate timeouts to mimic human behavior

## Data Extraction

The scraper extracts:
- Top 5 model links with titles and URLs
- Top 5 GIF images from the page
- Timestamp of the scrape

## Error Handling

The application includes comprehensive error handling:
- Browser launch and navigation errors
- Network timeout errors
- Telegram API errors
- General exception handling

## Docker Deployment

The included Dockerfile:
- Uses Node.js 18 base image
- Installs necessary system dependencies for Playwright
- Sets up the application environment
- Runs the scraper in production mode