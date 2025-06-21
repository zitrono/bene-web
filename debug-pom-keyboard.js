const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');

async function debugPOMKeyboard() {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const homePage = new JaceHomePage(page);
    homePage.url = 'http://localhost:8080';
    
    await homePage.navigate();
    await homePage.setViewport(375, 667);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Testing keyboard navigation with POM method...');
    const results = await homePage.testMobileMenuKeyboardNavigation();
    
    console.log('\nResults:', JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) await browser.close();
  }
}

debugPOMKeyboard();