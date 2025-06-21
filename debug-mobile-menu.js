const puppeteer = require('puppeteer');

async function debugMobileMenu() {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Checking mobile menu visibility at 375px...');
  
  const menuState = await page.evaluate(() => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileCta = document.querySelector('.mobile-cta');
    const navMenu = document.querySelector('.nav-menu');
    
    const toggleStyles = toggle ? getComputedStyle(toggle) : null;
    const ctaStyles = mobileCta ? getComputedStyle(mobileCta) : null;
    const navStyles = navMenu ? getComputedStyle(navMenu) : null;
    
    return {
      toggle: {
        found: !!toggle,
        display: toggleStyles?.display,
        visible: toggle ? toggle.offsetParent !== null : false,
        computedDisplay: toggleStyles?.display,
        opacity: toggleStyles?.opacity,
        visibility: toggleStyles?.visibility
      },
      mobileCta: {
        found: !!mobileCta,
        display: ctaStyles?.display,
        visible: mobileCta ? mobileCta.offsetParent !== null : false
      },
      navMenu: {
        found: !!navMenu,
        display: navStyles?.display,
        position: navStyles?.position
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      mediaQuery: window.matchMedia('(max-width: 1023px)').matches
    };
  });
  
  console.log('Menu state:', JSON.stringify(menuState, null, 2));
  
  // Try to find any button elements
  const buttons = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    return allButtons.map(btn => ({
      classes: btn.className,
      visible: btn.offsetParent !== null,
      display: getComputedStyle(btn).display,
      innerHTML: btn.innerHTML.substring(0, 50)
    }));
  });
  
  console.log('\nAll buttons:', JSON.stringify(buttons, null, 2));
  
  await browser.close();
}

debugMobileMenu().catch(console.error);