const puppeteer = require('puppeteer');

async function checkSelector() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  
  const results = await page.evaluate(() => {
    const selectors = [
      'button[aria-label*="menu"]',
      'button[aria-label*="Menu"]',
      'nav button:last-child',
      '.mobile-menu-toggle',
      'button.mobile-menu-toggle'
    ];
    
    return selectors.map(sel => {
      const el = document.querySelector(sel);
      return {
        selector: sel,
        found: !!el,
        visible: el ? el.offsetParent !== null : false,
        ariaLabel: el ? el.getAttribute('aria-label') : null
      };
    });
  });
  
  console.log('Selector results:', JSON.stringify(results, null, 2));
  await browser.close();
}

checkSelector().catch(console.error);