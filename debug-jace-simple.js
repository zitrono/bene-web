const puppeteer = require('puppeteer');

async function debugJaceSimple() {
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    console.log('🔍 Navigating to jace.ai...');
    await page.goto('https://jace.ai', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test at mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📱 At mobile viewport (375px)...\n');
    
    // Simple check for buttons
    const buttonCount = await page.evaluate(() => {
      return document.querySelectorAll('button').length;
    });
    
    console.log(`Total buttons found: ${buttonCount}`);
    
    if (buttonCount > 0) {
      const buttons = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).map((btn, i) => ({
          index: i,
          className: btn.className,
          textContent: btn.textContent.trim(),
          ariaLabel: btn.getAttribute('aria-label'),
          innerHTML: btn.innerHTML.substring(0, 50)
        }));
      });
      
      console.log('\nButtons found:');
      buttons.forEach(btn => {
        console.log(`${btn.index}: "${btn.className}" - "${btn.textContent}" - aria: "${btn.ariaLabel}"`);
      });
    }
    
    // Check for any elements with "menu" in class or aria
    const menuElements = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      return all.filter(el => {
        const className = el.className.toString().toLowerCase();
        const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
        return className.includes('menu') || 
               className.includes('nav') || 
               ariaLabel.includes('menu') ||
               ariaLabel.includes('navigation') ||
               className.includes('hamburger') ||
               className.includes('toggle');
      }).map(el => ({
        tagName: el.tagName,
        className: el.className,
        ariaLabel: el.getAttribute('aria-label'),
        id: el.id
      }));
    });
    
    console.log(`\nElements with menu/nav keywords: ${menuElements.length}`);
    menuElements.forEach((el, i) => {
      console.log(`${i}: ${el.tagName} - "${el.className}" - aria: "${el.ariaLabel}" - id: "${el.id}"`);
    });
    
    // Check what happens when we look for the specific jace.ai pattern we know exists
    const fixedMenus = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div[class*="fixed"]'));
      return elements.map(el => ({
        className: el.className,
        visible: getComputedStyle(el).display !== 'none',
        hasLinks: el.querySelectorAll('a').length,
        innerHTML: el.innerHTML.substring(0, 100)
      }));
    });
    
    console.log(`\nFixed positioned elements: ${fixedMenus.length}`);
    fixedMenus.forEach((el, i) => {
      console.log(`${i}: "${el.className}" - visible: ${el.visible} - links: ${el.hasLinks}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugJaceSimple();