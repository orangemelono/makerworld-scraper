const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const TARGET_URL = 'https://makerworld.com/en/3d-models';
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
  console.error('ERROR: TG_BOT_TOKEN and TG_CHAT_ID environment variables are required');
  process.exit(1);
}

const bot = new TelegramBot(TG_BOT_TOKEN);

async function scrapeData() {
  console.log(`[${new Date().toISOString()}] Starting scrape...`);
  
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      });
    });

    console.log('Navigating to target URL...');
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log('Waiting for content to load...');
    await page.waitForTimeout(5000);

    console.log('Extracting model links...');
    const modelLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="/en/models/"]'));
      
      return links
        .filter(link => {
          const href = link.getAttribute('href');
          const title = link.getAttribute('title');
          return href && href.length > '/en/models/'.length && title;
        })
        .slice(0, 5)
        .map(link => ({
          href: link.getAttribute('href'),
          title: link.getAttribute('title'),
          innerHTML: link.innerHTML
        }));
    });

    console.log('Extracting gif images...');
    const gifImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img.gif-image'));
      
      return images
        .slice(0, 5)
        .map(img => ({
          src: img.getAttribute('src')
        }));
    });

    await browser.close();
    browser = null;

    console.log(`Found ${modelLinks.length} model links and ${gifImages.length} gif images`);

    return {
      modelLinks,
      gifImages,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Scraping error:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

async function sendToTelegram(data) {
  console.log('Formatting message for Telegram...');
  
  let message = `🔍 *MakerWorld Scrape Results*\n`;
  message += `📅 Time: ${data.timestamp}\n\n`;
  
  message += `📦 *Top 5 Models:*\n\n`;
  data.modelLinks.forEach((link, index) => {
    message += `${index + 1}. *${link.title}*\n`;
    message += `   🔗 https://makerworld.com${link.href}\n\n`;
  });
  
  if (data.gifImages.length > 0) {
    message += `\n🖼 *Top 5 GIF Images:*\n\n`;
    data.gifImages.forEach((img, index) => {
      message += `${index + 1}. ${img.src}\n`;
    });
  }

  try {
    console.log('Sending to Telegram...');
    await bot.sendMessage(TG_CHAT_ID, message, { parse_mode: 'Markdown' });
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Telegram error:', error);
    throw error;
  }
}

async function runScraper() {
  try {
    console.log('\n' + '='.repeat(60));
    const data = await scrapeData();
    await sendToTelegram(data);
    console.log('✅ Scrape cycle completed successfully');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Scrape cycle failed:', error.message);
    console.log('='.repeat(60) + '\n');
  }
}

async function main() {
  console.log('MakerWorld Scraper starting...');
  console.log(`Bot Token: ${TG_BOT_TOKEN.substring(0, 10)}...`);
  console.log(`Chat ID: ${TG_CHAT_ID}`);
  
  console.log('\n🚀 Running initial scrape...');
  await runScraper();
  
  console.log('⏰ Setting up hourly schedule...');
  cron.schedule('0 * * * *', async () => {
    console.log('📅 Hourly scrape triggered');
    await runScraper();
  });
  
  console.log('✅ Scheduler active. Scraper will run every hour.');
  console.log('Press Ctrl+C to stop.\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
