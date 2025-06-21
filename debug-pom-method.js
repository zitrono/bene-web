const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');

async function debugPOMMethod() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const jaceHome = new JaceHomePage(page);
  
  await jaceHome.setViewport(375, 667);
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  
  // Get the selector from POM
  const selector = jaceHome.selectors.nav.mobileMenuToggle;
  console.log('POM mobileMenuToggle selector:', selector);
  console.log('');
  
  // Test each part of the compound selector
  const parts = selector.split(', ');
  for (const part of parts) {
    try {
      const element = await page.$(part);
      if (element) {
        const isVisible = await element.isVisible();
        const details = await element.evaluate(el => ({
          className: el.className,
          ariaLabel: el.getAttribute('aria-label'),
          tagName: el.tagName,
          parentClass: el.parentElement.className
        }));
        console.log('Selector part:', part);
        console.log('  Found:', true);
        console.log('  isVisible():', isVisible);
        console.log('  Details:', details);
        console.log('');
      } else {
        console.log('Selector part:', part);
        console.log('  Found:', false);
        console.log('');
      }
    } catch (error) {
      console.log('Selector part:', part);
      console.log('  Error:', error.message);
      console.log('');
    }
  }
  
  // Test the actual POM method
  console.log('--- Testing POM method ---');
  const pomResult = await jaceHome.isMobileMenuVisible();
  console.log('POM isMobileMenuVisible() result:', pomResult);
  
  // Test the full compound selector
  console.log('\n--- Testing full compound selector ---');
  const button = await page.$(selector);
  if (button) {
    const isVisible = await button.isVisible();
    console.log('Full selector found button');
    console.log('isVisible():', isVisible);
  } else {
    console.log('Full selector found nothing');
  }
  
  await browser.close();
}

debugPOMMethod().catch(console.error);