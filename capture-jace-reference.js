const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');
const fs = require('fs');
const path = require('path');

async function captureJaceReference() {
  console.log('🎯 Capturing jace.ai reference data...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    const jacePage = new JaceHomePage(page);
    
    // Create reference directory
    const refDir = '.reference/jace';
    if (!fs.existsSync(refDir)) {
      fs.mkdirSync(refDir, { recursive: true });
    }
    
    // Navigate to jace.ai
    await jacePage.navigate();
    console.log('✓ Navigated to jace.ai');
    
    // Get page title
    const title = await jacePage.getPageTitle();
    console.log(`✓ Page title: ${title}`);
    
    // Capture data at different viewports
    const viewports = [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    const referenceData = {
      captureDate: new Date().toISOString(),
      pageTitle: title,
      viewports: {}
    };
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
      
      await jacePage.setViewport(viewport.width, viewport.height);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for responsive adjustments
      
      // Capture screenshot
      const screenshotPath = path.join(refDir, `jace-${viewport.name}.png`);
      await jacePage.captureScreenshot(screenshotPath);
      console.log(`  ✓ Screenshot saved: ${screenshotPath}`);
      
      // Get navigation structure
      const navStructure = await jacePage.getNavigationStructure();
      console.log(`  ✓ Navigation items: ${navStructure.links.length}`);
      
      // Get hero content
      const heroContent = await jacePage.getHeroContent();
      console.log(`  ✓ Hero headline: "${heroContent.headline}"`);
      
      // Get color scheme
      const colors = await jacePage.getColorScheme();
      console.log(`  ✓ Background color: ${colors.body.background}`);
      
      // Mobile-specific tests
      if (viewport.name === 'mobile') {
        const mobileMenuVisible = await jacePage.isMobileMenuVisible();
        console.log(`  ✓ Mobile menu button visible: ${mobileMenuVisible}`);
        
        if (mobileMenuVisible) {
          // Test mobile menu open
          await jacePage.openMobileMenu();
          const menuState = await jacePage.getMobileMenuState();
          console.log(`  ✓ Mobile menu opened: ${menuState.isOpen}`);
          
          // Capture mobile menu screenshot
          const mobileMenuPath = path.join(refDir, 'jace-mobile-menu-open.png');
          await jacePage.captureScreenshot(mobileMenuPath);
          console.log(`  ✓ Mobile menu screenshot: ${mobileMenuPath}`);
          
          // Get mobile menu structure
          const mobileMenuLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.nav-menu a, nav ul.active a, [class*="mobile-menu"] a'));
            return links.map(link => ({
              text: link.textContent.trim(),
              href: link.href,
              visible: link.offsetParent !== null
            }));
          });
          
          // Close menu
          await jacePage.closeMobileMenu();
          console.log(`  ✓ Mobile menu closed`);
          
          // Store mobile menu data
          referenceData.viewports[viewport.name] = {
            ...referenceData.viewports[viewport.name],
            mobileMenu: {
              visible: mobileMenuVisible,
              state: menuState,
              links: mobileMenuLinks
            }
          };
        }
      }
      
      // Store viewport-specific data
      referenceData.viewports[viewport.name] = {
        ...referenceData.viewports[viewport.name],
        navigation: navStructure,
        hero: heroContent,
        colors: colors,
        textContent: await jacePage.getAllTextContent()
      };
    }
    
    // Get font information
    const fonts = await page.evaluate(() => {
      const elements = ['body', 'h1', 'h2', 'p', 'a', 'button'];
      const fontData = {};
      
      elements.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          const styles = getComputedStyle(el);
          fontData[selector] = {
            family: styles.fontFamily,
            size: styles.fontSize,
            weight: styles.fontWeight,
            lineHeight: styles.lineHeight
          };
        }
      });
      
      return fontData;
    });
    
    referenceData.typography = fonts;
    
    // Get specific design tokens
    const designTokens = await page.evaluate(() => {
      // Try to extract CSS variables
      const rootStyles = getComputedStyle(document.documentElement);
      const tokens = {};
      
      // Common CSS variable patterns
      const varPatterns = ['--', 'color', 'space', 'font', 'size'];
      
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith('--')) {
          tokens[prop] = rootStyles.getPropertyValue(prop);
        }
      }
      
      return tokens;
    });
    
    referenceData.designTokens = designTokens;
    
    // Save reference data as JSON
    const jsonPath = path.join(refDir, 'jace-reference-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(referenceData, null, 2));
    console.log(`\n✓ Reference data saved: ${jsonPath}`);
    
    // Create a summary report
    const summaryPath = path.join(refDir, 'jace-summary.md');
    const summary = `# Jace.ai Reference Capture
    
Captured: ${referenceData.captureDate}

## Page Structure

### Navigation
- Logo: ${referenceData.viewports.desktop.navigation.logo ? '✓' : '✗'}
- Links: ${referenceData.viewports.desktop.navigation.links.map(l => l.text).join(', ')}

### Hero Section
- Headline: "${referenceData.viewports.desktop.hero.headline}"
- Subheadline: "${referenceData.viewports.desktop.hero.subheadline}"
- CTA Button: "${referenceData.viewports.desktop.hero.ctaButton?.text}"

### Colors
- Background: ${referenceData.viewports.desktop.colors.body.background}
- Text: ${referenceData.viewports.desktop.colors.body.color}
- Font: ${referenceData.viewports.desktop.colors.body.font}

### Typography
${Object.entries(referenceData.typography).map(([el, styles]) => 
  `- ${el}: ${styles.size} / ${styles.weight} / ${styles.family}`
).join('\n')}

### Mobile Menu
- Visible on mobile: ${referenceData.viewports.mobile.mobileMenu?.visible}
- Menu type: ${referenceData.viewports.mobile.mobileMenu?.state.position}
- Links in mobile menu: ${referenceData.viewports.mobile.mobileMenu?.links.length || 0}

## Screenshots Captured
- Desktop: jace-desktop.png
- Tablet: jace-tablet.png  
- Mobile: jace-mobile.png
- Mobile Menu: jace-mobile-menu-open.png
`;
    
    fs.writeFileSync(summaryPath, summary);
    console.log(`✓ Summary report: ${summaryPath}`);
    
    console.log('\n✅ Jace.ai reference capture complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Run the capture
if (require.main === module) {
  captureJaceReference();
}

module.exports = { captureJaceReference };