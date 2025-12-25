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

    await browser.close();
    browser = null;

    console.log(`Found ${modelLinks.length} model links`);

    return {
      modelLinks,
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
  console.log('Sending individual messages for each model to Telegram...');

  for (const [index, link] of data.modelLinks.entries()) {
    const message = `🔍 *New 3D Model Found!*\n\n*${link.title}*\n🔗 https://makerworld.com${link.href}\n\n📅 Time: ${data.timestamp}`;

    try {
      console.log(`Sending message ${index + 1} to Telegram...`);
      await bot.sendMessage(TG_CHAT_ID, message, { parse_mode: 'Markdown' });
      console.log(`Message ${index + 1} sent successfully!`);

      // Add a small delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Telegram error for message ${index + 1}:`, error);
      // Continue with the next message even if one fails
    }
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

  // Set up hourly schedule
  console.log('⏰ Setting up hourly schedule...');
  cron.schedule('0 * * * *', async () => {
    console.log('📅 Hourly scrape triggered');
    await runScraper();
  });

  // Set up Telegram bot commands
  bot.onText(/\/repeat/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Only allow the configured chat ID to use the command
    if (chatId.toString() === TG_CHAT_ID) {
      console.log(`🔄 /repeat command received from user ${userId} in chat ${chatId}`);

      try {
        // Send a temporary message to acknowledge the command
        const ackMsg = await bot.sendMessage(chatId, '🔄 Fetching latest models...', {
          reply_to_message: msg.message_id
        });

        // Get fresh data
        const data = await scrapeData();

        // Send individual messages for each model to the requesting user only
        for (const [index, link] of data.modelLinks.entries()) {
          const message = `🔍 *New 3D Model Found!*\n\n*${link.title}*\n🔗 https://makerworld.com${link.href}\n\n📅 Time: ${data.timestamp}`;

          try {
            console.log(`Sending model ${index + 1} to user ${userId}...`);
            await bot.sendMessage(chatId, message, {
              parse_mode: 'Markdown',
              reply_to_message: msg.message_id
            });
            console.log(`Model ${index + 1} sent successfully!`);

            // Add a small delay between messages to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Telegram error for model ${index + 1}:`, error);
          }
        }

        // Delete the temporary message
        await bot.deleteMessage(chatId, ackMsg.message_id);

        console.log(`✅ Sent ${data.modelLinks.length} models to user ${userId}`);
      } catch (error) {
        console.error('Error processing /repeat command:', error);
        await bot.sendMessage(chatId, '❌ Error fetching models. Please try again later.', {
          reply_to_message: msg.message_id
        });
      }
    } else {
      // If the command comes from a different chat, inform the user
      await bot.sendMessage(chatId, '❌ Unauthorized. This command can only be used in the configured chat.', {
        reply_to_message: msg.message_id
      });
    }
  });

  // Set up help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId.toString() === TG_CHAT_ID) {
      const helpMessage = `🤖 *MakerWorld Scraper Bot*\n\nCommands:\n• \`/repeat\` - Fetch latest models immediately\n• \`/help\` - Show this help message\n\nThe bot checks for new models hourly and sends updates automatically.`;
      bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    }
  });

  console.log('✅ Scheduler and bot commands active.');
  console.log('✅ Bot is listening for commands (/repeat, /help)');
  console.log('Press Ctrl+C to stop.\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
