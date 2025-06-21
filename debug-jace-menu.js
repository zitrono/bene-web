const puppeteer = require('puppeteer');

async function debugJaceMenu() {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://jace.ai', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Looking for menu button...');
  
  // Find the button that contains 'Open main menu'
  const menuButtonIndex = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const hamburgerButton = buttons.find(btn => 
      btn.textContent.includes('Open main menu')
    );
    return hamburgerButton ? buttons.indexOf(hamburgerButton) : -1;
  });
  
  console.log('Menu button index:', menuButtonIndex);
  
  if (menuButtonIndex >= 0) {
    // Click the button
    await page.evaluate((index) => {
      document.querySelectorAll('button')[index].click();
    }, menuButtonIndex);
    
    console.log('Clicked menu button, waiting for menu to open...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check what changed in the DOM
    const afterClick = await page.evaluate(() => {
      // Look for any new overlays, dialogs, or fixed positioned elements
      const allElements = Array.from(document.querySelectorAll('*'));
      const fixedElements = allElements.filter(el => {
        const styles = getComputedStyle(el);
        return styles.position === 'fixed' && styles.display !== 'none';
      });
      
      // Also check for dialog role
      const dialogs = document.querySelectorAll('[role="dialog"]');
      
      // Check nav changes
      const nav = document.querySelector('nav');
      const navClasses = nav ? nav.className : '';
      
      // Check if a new div appeared that might be the menu
      const possibleMenu = document.querySelector('div[class*="fixed"][class*="inset"]');
      
      return {
        fixedElements: fixedElements.length,
        fixedElementsInfo: fixedElements.slice(0, 3).map(el => ({
          tag: el.tagName,
          classes: el.className.substring(0, 100),
          hasLinks: el.querySelectorAll('a').length
        })),
        dialogs: dialogs.length,
        navClasses: navClasses,
        possibleMenu: possibleMenu ? {
          found: true,
          classes: possibleMenu.className,
          linkCount: possibleMenu.querySelectorAll('a').length
        } : null
      };
    });
    
    console.log('After clicking menu:', JSON.stringify(afterClick, null, 2));
    
    // Look specifically for the mobile menu
    const mobileMenu = await page.evaluate(() => {
      // The menu is likely a fixed positioned div that appeared after click
      const fixedDivs = Array.from(document.querySelectorAll('div[class*="fixed"]'));
      
      for (const div of fixedDivs) {
        const links = div.querySelectorAll('a');
        if (links.length >= 3) { // Menu should have navigation links
          return {
            found: true,
            classes: div.className,
            position: getComputedStyle(div).position,
            zIndex: getComputedStyle(div).zIndex,
            transform: getComputedStyle(div).transform,
            links: Array.from(links).map(a => a.textContent.trim())
          };
        }
      }
      
      return { found: false };
    });
    
    console.log('\nMobile menu analysis:', JSON.stringify(mobileMenu, null, 2));
  }
  
  await browser.close();
}

debugJaceMenu().catch(console.error);