const puppeteer = require('puppeteer');

async function debugBoth() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  
  // Debug logo
  console.log('=== LOGO DEBUG ===');
  const logoResult = await page.evaluate(() => {
    const selectors = ['a[href="/"]', '.logo', 'a.logo', 'header nav a[href="/"]', 'nav:first-of-type a[href="/"]'];
    const results = {};
    
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      results[sel] = el ? {
        found: true,
        href: el.href,
        className: el.className,
        text: el.textContent,
        parent: el.parentElement.tagName + '.' + el.parentElement.className
      } : { found: false };
    });
    
    // Also check what the POM is looking for
    const headerNav = document.querySelector('header nav, nav:first-of-type');
    if (headerNav) {
      const logoInNav = headerNav.querySelector('a[href="/"]');
      results['POM logic'] = logoInNav ? {
        found: true,
        href: logoInNav.href,
        className: logoInNav.className
      } : { found: false };
    }
    
    return results;
  });
  console.log(JSON.stringify(logoResult, null, 2));
  
  // Debug mobile menu button
  console.log('\n=== MOBILE MENU DEBUG ===');
  const menuResult = await page.evaluate(() => {
    const button1 = document.querySelector('button[aria-label*="menu"]');
    const button2 = document.querySelector('.mobile-menu-toggle');
    
    return {
      'aria-label selector': button1 ? {
        found: true,
        className: button1.className,
        ariaLabel: button1.getAttribute('aria-label'),
        visible: button1.offsetParent !== null
      } : { found: false },
      'class selector': button2 ? {
        found: true,
        className: button2.className,
        ariaLabel: button2.getAttribute('aria-label'),
        visible: button2.offsetParent !== null,
        display: getComputedStyle(button2).display
      } : { found: false }
    };
  });
  console.log(JSON.stringify(menuResult, null, 2));
  
  // Check Puppeteer's isVisible method
  const toggleButton = await page.$('.mobile-menu-toggle');
  if (toggleButton) {
    const isVisible = await toggleButton.isVisible();
    console.log('\nPuppeteer isVisible() on .mobile-menu-toggle:', isVisible);
  }
  
  const menuButton = await page.$('button[aria-label*="menu"]');
  if (menuButton) {
    const isVisible = await menuButton.isVisible();
    const className = await menuButton.evaluate(el => el.className);
    console.log('\nPuppeteer found button[aria-label*="menu"]:', className);
    console.log('isVisible():', isVisible);
  }
  
  await browser.close();
}

debugBoth().catch(console.error);