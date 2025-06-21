const puppeteer = require('puppeteer');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:8080/docs/',
  viewports: {
    mobile: { width: 375, height: 667, deviceScaleFactor: 2 },
    tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
    desktop: { width: 1440, height: 900, deviceScaleFactor: 1 }
  },
  pages: ['index.html', 'company.html', 'blog.html', 'terms.html', 'privacy.html', 'feedback.html']
};

async function captureScreenshots() {
  console.log('🚀 Starting visual testing...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Create screenshots directory
    const screenshotsDir = '.screenshots';
    const fs = require('fs');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Test each page at each viewport
    for (const pageName of config.pages) {
      console.log(`📄 Testing ${pageName}...`);
      
      for (const [device, viewport] of Object.entries(config.viewports)) {
        await page.setViewport(viewport);
        
        const url = pageName === 'index.html' 
          ? config.baseUrl 
          : `${config.baseUrl}${pageName}`;
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        const filename = `${pageName.replace('.html', '')}-${device}.png`;
        const filepath = path.join(screenshotsDir, filename);
        
        await page.screenshot({ 
          path: filepath,
          fullPage: true 
        });
        
        console.log(`  ✓ ${device}: ${filename}`);
        
        // Test mobile menu on mobile viewport
        if (device === 'mobile') {
          const hamburger = await page.$('button[aria-label="Toggle navigation"]');
          if (hamburger) {
            await hamburger.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const menuFilename = `${pageName.replace('.html', '')}-mobile-menu.png`;
            const menuFilepath = path.join(screenshotsDir, menuFilename);
            
            await page.screenshot({ 
              path: menuFilepath,
              fullPage: false 
            });
            
            console.log(`  ✓ mobile menu: ${menuFilename}`);
            
            // Close menu
            const closeBtn = await page.$('button[aria-label="Close menu"]');
            if (closeBtn) await closeBtn.click();
          }
        }
      }
      console.log('');
    }

    console.log('✅ Visual testing complete!');
    console.log(`📁 Screenshots saved to: ${path.resolve(screenshotsDir)}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  captureScreenshots();
}

module.exports = { captureScreenshots };