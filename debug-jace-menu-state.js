const puppeteer = require('puppeteer');

async function debugJaceMenuState() {
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    console.log('🔍 Debugging jace.ai menu state detection...');
    await page.goto('https://jace.ai', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test at mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📱 At mobile viewport (375px)...\n');
    
    // 1. Find the real menu toggle (not "Get Started" button)
    const menuToggle = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      
      // Find button with "Open main menu" text (this is the real toggle)
      const realToggle = buttons.find(btn => 
        btn.textContent.includes('Open main menu') ||
        btn.textContent.includes('menu')
      );
      
      if (realToggle) {
        return {
          text: realToggle.textContent,
          className: realToggle.className,
          innerHTML: realToggle.innerHTML.substring(0, 100)
        };
      }
      
      return null;
    });
    
    console.log('🔘 Real menu toggle found:', menuToggle);
    
    // 2. Check menu state before click
    const beforeState = await page.evaluate(() => {
      // Look for all fixed positioned elements
      const fixedElements = Array.from(document.querySelectorAll('div[class*="fixed"]'));
      return fixedElements.map(el => ({
        className: el.className,
        visible: getComputedStyle(el).display !== 'none',
        hasLinks: el.querySelectorAll('a').length,
        zIndex: getComputedStyle(el).zIndex,
        innerHTML: el.innerHTML.substring(0, 50)
      }));
    });
    
    console.log('\n📦 Menu containers BEFORE click:');
    beforeState.forEach((container, i) => {
      console.log(`${i}: "${container.className}" - visible: ${container.visible} - links: ${container.hasLinks} - z: ${container.zIndex}`);
    });
    
    // 3. Click the menu toggle
    console.log('\n🖱️ Clicking menu toggle...');
    
    const clickResult = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const realToggle = buttons.find(btn => 
        btn.textContent.includes('Open main menu')
      );
      
      if (realToggle) {
        realToggle.click();
        return true;
      }
      return false;
    });
    
    console.log(`Click result: ${clickResult}`);
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 4. Check menu state after click
    const afterState = await page.evaluate(() => {
      const fixedElements = Array.from(document.querySelectorAll('div[class*="fixed"]'));
      return fixedElements.map(el => ({
        className: el.className,
        visible: getComputedStyle(el).display !== 'none',
        hasLinks: el.querySelectorAll('a').length,
        zIndex: getComputedStyle(el).zIndex,
        innerHTML: el.innerHTML.substring(0, 100),
        opacity: getComputedStyle(el).opacity,
        transform: getComputedStyle(el).transform
      }));
    });
    
    console.log('\n📦 Menu containers AFTER click:');
    afterState.forEach((container, i) => {
      console.log(`${i}: "${container.className}"`);
      console.log(`   visible: ${container.visible}, links: ${container.hasLinks}, z: ${container.zIndex}`);
      console.log(`   opacity: ${container.opacity}, transform: ${container.transform}`);
      console.log('');
    });
    
    // 5. Check for any new elements that appeared
    const newElements = await page.evaluate(() => {
      // Look for any elements with "menu" or "navigation" in their attributes
      const allElements = Array.from(document.querySelectorAll('*'));
      return allElements.filter(el => {
        const className = el.className.toString().toLowerCase();
        const id = el.id.toLowerCase();
        const role = (el.getAttribute('role') || '').toLowerCase();
        const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
        
        return (className.includes('menu') || 
                className.includes('nav') ||
                id.includes('menu') ||
                role.includes('menu') ||
                ariaLabel.includes('menu')) &&
               getComputedStyle(el).display !== 'none';
      }).map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        visible: getComputedStyle(el).display !== 'none'
      }));
    });
    
    console.log('\n🔍 Elements with menu keywords after click:');
    newElements.forEach((el, i) => {
      console.log(`${i}: ${el.tagName} - "${el.className}" - id: "${el.id}" - role: "${el.role}"`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugJaceMenuState();