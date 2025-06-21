const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');

async function debugPOMVisibility() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const jaceHome = new JaceHomePage(page);
  
  await jaceHome.setViewport(375, 667);
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Testing POM mobile menu visibility detection...');
  
  // Test the POM method
  const pomResult = await jaceHome.isMobileMenuVisible();
  console.log('POM isMobileMenuVisible():', pomResult);
  
  // Test the selectors directly
  const selectors = [
    'button[aria-label*="menu"]',
    'button[aria-label*="Menu"]',
    'nav button:last-child'
  ];
  
  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        const isVisible = await element.isVisible();
        const boundingBox = await element.boundingBox();
        console.log(`\nSelector: ${selector}`);
        console.log('  Found:', true);
        console.log('  isVisible():', isVisible);
        console.log('  boundingBox:', boundingBox);
        
        // Get more details
        const details = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) {
            const styles = getComputedStyle(el);
            return {
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity,
              offsetParent: el.offsetParent !== null,
              ariaLabel: el.getAttribute('aria-label'),
              className: el.className,
              textContent: el.textContent.trim()
            };
          }
          return null;
        }, selector);
        console.log('  Details:', details);
      } else {
        console.log(`\nSelector: ${selector}`);
        console.log('  Found:', false);
      }
    } catch (error) {
      console.log(`\nSelector: ${selector}`);
      console.log('  Error:', error.message);
    }
  }
  
  // Test our actual button
  console.log('\n--- Our actual mobile menu button ---');
  const ourButton = await page.$('.mobile-menu-toggle');
  if (ourButton) {
    const isVisible = await ourButton.isVisible();
    const boundingBox = await ourButton.boundingBox();
    console.log('Found:', true);
    console.log('isVisible():', isVisible);
    console.log('boundingBox:', boundingBox);
  }
  
  await browser.close();
}

debugPOMVisibility().catch(console.error);