const puppeteer = require('puppeteer');

async function debugKeyboardNav() {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Initial focused element:');
    let focused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el.tagName,
        class: el.className,
        id: el.id,
        href: el.href,
        text: el.textContent?.trim().substring(0, 50),
        tabindex: el.getAttribute('tabindex')
      };
    });
    console.log(focused);
    
    // Get all focusable elements in order
    console.log('\nAll focusable elements:');
    const focusable = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      return Array.from(elements).map((el, index) => ({
        index,
        tag: el.tagName,
        class: el.className,
        id: el.id,
        text: el.textContent?.trim().substring(0, 50),
        tabindex: el.getAttribute('tabindex'),
        visible: el.offsetWidth > 0 && el.offsetHeight > 0,
        ariaLabel: el.getAttribute('aria-label')
      }));
    });
    
    focusable.forEach(el => {
      if (el.visible) {
        console.log(`${el.index}: ${el.tag} - ${el.class || el.id || el.text} (tabindex: ${el.tabindex}, aria: ${el.ariaLabel})`);
      }
    });
    
    // Press Tab multiple times and see what gets focused
    console.log('\nTabbing through elements:');
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el.tagName,
          class: el.className,
          id: el.id,
          text: el.textContent?.trim().substring(0, 50),
          ariaLabel: el.getAttribute('aria-label'),
          isMobileToggle: el.classList.contains('mobile-menu-toggle')
        };
      });
      
      console.log(`Tab ${i + 1}: ${focused.tag} - ${focused.class || focused.id || focused.text} (mobile toggle: ${focused.isMobileToggle})`);
      
      if (focused.isMobileToggle) {
        console.log('Found mobile toggle!');
        break;
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) await browser.close();
  }
}

debugKeyboardNav();