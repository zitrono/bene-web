const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');

async function debugJaceHamburger() {
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new', // Headless for CI
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    const homePage = new JaceHomePage(page);
    homePage.url = 'https://jace.ai';
    
    console.log('🔍 Debugging jace.ai hamburger menu...\n');
    
    await homePage.navigate();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test at mobile viewport
    await homePage.setViewport(375, 667);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📱 At mobile viewport (375px)...\n');
    
    // 1. Check for ALL possible button selectors
    const allButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => ({
        innerHTML: btn.innerHTML,
        className: btn.className,
        ariaLabel: btn.getAttribute('aria-label'),
        visible: getComputedStyle(btn).display !== 'none',
        hasMenuText: btn.textContent.toLowerCase().includes('menu'),
        hasNavText: btn.textContent.toLowerCase().includes('nav'),
        hasHamburgerIcon: btn.innerHTML.includes('M3 12h18M3 6h18M3 18h18') || 
                         btn.innerHTML.includes('hamburger') ||
                         btn.innerHTML.includes('☰') ||
                         btn.querySelector('svg')
      }));
    });
    
    console.log('🔘 ALL BUTTONS FOUND:');
    console.log(`Total buttons: ${allButtons ? allButtons.length : 'undefined'}`);
    
    if (allButtons && allButtons.length > 0) {
      allButtons.forEach((btn, i) => {
        console.log(`${i + 1}. Class: "${btn.className}"`);
        console.log(`   ARIA: "${btn.ariaLabel}"`);
        console.log(`   Visible: ${btn.visible}`);
        console.log(`   Has icon: ${btn.hasHamburgerIcon}`);
        console.log(`   HTML: ${btn.innerHTML.substring(0, 100)}...`);
        console.log('');
      });
    } else {
      console.log('No buttons found!');
    }
    
    // 2. Check for menu containers
    const menuContainers = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('*')).filter(el => {
        const classes = el.className.toString().toLowerCase();
        return classes.includes('menu') || 
               classes.includes('nav') || 
               classes.includes('drawer') ||
               classes.includes('modal') ||
               el.getAttribute('role') === 'dialog';
      });
      
      return containers.map(container => ({
        tagName: container.tagName,
        className: container.className,
        role: container.getAttribute('role'),
        visible: getComputedStyle(container).display !== 'none',
        hasLinks: container.querySelectorAll('a').length,
        styles: {
          position: getComputedStyle(container).position,
          zIndex: getComputedStyle(container).zIndex,
          display: getComputedStyle(container).display
        }
      }));
    });
    
    console.log('📦 MENU CONTAINERS FOUND:');
    menuContainers.forEach((container, i) => {
      console.log(`${i + 1}. ${container.tagName} - "${container.className}"`);
      console.log(`   Role: ${container.role}`);
      console.log(`   Visible: ${container.visible}`);
      console.log(`   Links: ${container.hasLinks}`);
      console.log(`   Position: ${container.styles.position}`);
      console.log('');
    });
    
    // 3. Test current POM selectors
    console.log('🔧 TESTING CURRENT POM SELECTORS:');
    
    const currentSelectors = [
      'button[class*="mobile"]',
      'button[class*="menu"]', 
      'button[aria-label*="menu"]',
      'button[aria-label*="navigation"]',
      '.mobile-menu-toggle'
    ];
    
    for (const selector of currentSelectors) {
      const found = await page.$$(selector);
      console.log(`${selector}: ${found.length} found`);
    }
    
    // 4. Try to click any visible buttons and see what happens
    console.log('\n🖱️ TESTING BUTTON CLICKS:');
    
    const visibleButtons = allButtons.filter(btn => btn.visible);
    for (let i = 0; i < Math.min(3, visibleButtons.length); i++) {
      const btn = visibleButtons[i];
      console.log(`Clicking button ${i + 1}: ${btn.className}`);
      
      try {
        await page.click(`button:nth-of-type(${allButtons.indexOf(btn) + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if anything changed
        const afterClick = await page.evaluate(() => {
          const modals = document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="menu"]');
          return Array.from(modals).map(modal => ({
            className: modal.className,
            visible: getComputedStyle(modal).display !== 'none'
          }));
        });
        
        console.log(`After click: ${afterClick.filter(m => m.visible).length} visible modals/menus`);
        afterClick.filter(m => m.visible).forEach(modal => {
          console.log(`  - ${modal.className}`);
        });
        
      } catch (error) {
        console.log(`  Error clicking: ${error.message}`);
      }
    }
    
    // Auto-close after analysis
    console.log('\n✅ Analysis complete');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugJaceHamburger();