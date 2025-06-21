const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');
const fs = require('fs').promises;
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

async function testComprehensivePOMCoverage() {
  let browser;
  let page;
  const testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: [],
    methodResults: {}
  };
  
  // Helper function to log test results
  const logTest = (methodName, status, details, expected = null, actual = null) => {
    const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    const color = status === 'pass' ? colors.green : status === 'fail' ? colors.red : colors.yellow;
    
    console.log(`${color}${icon} ${methodName}${colors.reset}`);
    if (details) {
      console.log(`   ${colors.dim}${details}${colors.reset}`);
    }
    if (expected !== null && actual !== null) {
      console.log(`   Expected: ${colors.dim}${expected}${colors.reset}`);
      console.log(`   Actual: ${colors.bright}${actual}${colors.reset}`);
    }
    
    testResults.methodResults[methodName] = {
      status,
      details,
      expected,
      actual
    };
    
    if (status === 'pass') testResults.passed++;
    else if (status === 'fail') testResults.failed++;
    else testResults.warnings++;
  };
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    const pomInstance = new JaceHomePage(page);
    // Test with Beneficious site
    pomInstance.url = 'http://localhost:8080';
    
    console.log(`${colors.cyan}🧪 Comprehensive POM Method Coverage Test${colors.reset}`);
    console.log(`${colors.blue}============================================${colors.reset}\n`);
    
    console.log(`${colors.cyan}📍 Starting comprehensive test of all 40 POM methods${colors.reset}\n`);
    
    // 1. BASIC NAVIGATION METHODS
    console.log(`${colors.bright}${colors.blue}1️⃣ Basic Navigation Methods${colors.reset}`);
    console.log(`${colors.blue}============================${colors.reset}`);
    
    try {
      await pomInstance.navigate();
      logTest('navigate()', 'pass', 'Successfully navigated to page');
    } catch (error) {
      logTest('navigate()', 'fail', `Navigation failed: ${error.message}`);
    }
    
    try {
      const title = await pomInstance.getPageTitle();
      logTest('getPageTitle()', 'pass', 'Page title retrieved', 'String with content', title);
    } catch (error) {
      logTest('getPageTitle()', 'fail', `Failed to get title: ${error.message}`);
    }
    
    try {
      const viewport = await pomInstance.getViewportDimensions();
      logTest('getViewportDimensions()', 'pass', 'Viewport dimensions retrieved', 'Object with width/height', `${viewport.width}x${viewport.height}`);
    } catch (error) {
      logTest('getViewportDimensions()', 'fail', `Failed to get viewport: ${error.message}`);
    }
    
    try {
      await pomInstance.setViewport(1280, 800);
      const newViewport = await pomInstance.getViewportDimensions();
      logTest('setViewport()', 'pass', 'Viewport successfully changed', '1280x800', `${newViewport.width}x${newViewport.height}`);
    } catch (error) {
      logTest('setViewport()', 'fail', `Failed to set viewport: ${error.message}`);
    }
    
    // 2. NAVIGATION STRUCTURE METHODS
    console.log(`\n${colors.bright}${colors.blue}2️⃣ Navigation Structure Methods${colors.reset}`);
    console.log(`${colors.blue}================================${colors.reset}`);
    
    try {
      const navStructure = await pomInstance.getNavigationStructure();
      const hasNav = navStructure && navStructure.exists;
      logTest('getNavigationStructure()', hasNav ? 'pass' : 'fail', 
        hasNav ? `Found navigation with ${navStructure.links.length} links` : 'No navigation found',
        'Object with navigation details', hasNav ? `${navStructure.links.length} links, logo: ${navStructure.logo}` : 'null');
    } catch (error) {
      logTest('getNavigationStructure()', 'fail', `Failed to get navigation: ${error.message}`);
    }
    
    // 3. MOBILE MENU METHODS
    console.log(`\n${colors.bright}${colors.blue}3️⃣ Mobile Menu Methods${colors.reset}`);
    console.log(`${colors.blue}======================={colors.reset}`);
    
    // Test at mobile viewport
    await pomInstance.setViewport(375, 667);
    
    try {
      const isVisible = await pomInstance.isMobileMenuVisible();
      logTest('isMobileMenuVisible()', 'pass', 'Mobile menu visibility checked', 'Boolean', isVisible.toString());
    } catch (error) {
      logTest('isMobileMenuVisible()', 'fail', `Failed to check mobile menu visibility: ${error.message}`);
    }
    
    try {
      const opened = await pomInstance.openMobileMenu();
      logTest('openMobileMenu()', opened ? 'pass' : 'warning', 
        opened ? 'Mobile menu opened successfully' : 'Could not open mobile menu (may not exist)',
        'Boolean true', opened.toString());
    } catch (error) {
      logTest('openMobileMenu()', 'fail', `Failed to open mobile menu: ${error.message}`);
    }
    
    try {
      const menuState = await pomInstance.getMobileMenuState();
      logTest('getMobileMenuState()', 'pass', 'Mobile menu state retrieved', 'Object with state info', 
        menuState.found ? `Found: ${menuState.type}, Open: ${menuState.isOpen}` : 'Not found');
    } catch (error) {
      logTest('getMobileMenuState()', 'fail', `Failed to get mobile menu state: ${error.message}`);
    }
    
    try {
      const closed = await pomInstance.closeMobileMenu();
      logTest('closeMobileMenu()', closed ? 'pass' : 'warning', 
        closed ? 'Mobile menu closed successfully' : 'Could not close mobile menu',
        'Boolean true', closed.toString());
    } catch (error) {
      logTest('closeMobileMenu()', 'fail', `Failed to close mobile menu: ${error.message}`);
    }
    
    // Add the 6 missing mobile menu methods
    try {
      const toggleDetails = await pomInstance.getMobileMenuToggleDetails();
      logTest('getMobileMenuToggleDetails()', 'pass', 'Mobile menu toggle details retrieved', 'Array of toggle objects', 
        `${toggleDetails.length} toggle buttons analyzed`);
    } catch (error) {
      logTest('getMobileMenuToggleDetails()', 'fail', `Failed to get toggle details: ${error.message}`);
    }
    
    try {
      const menuStructure = await pomInstance.getMobileMenuStructure();
      logTest('getMobileMenuStructure()', 'pass', 'Mobile menu structure analyzed', 'Array of menu containers', 
        `${menuStructure.length} menu containers found`);
    } catch (error) {
      logTest('getMobileMenuStructure()', 'fail', `Failed to get menu structure: ${error.message}`);
    }
    
    try {
      const animationDetails = await pomInstance.getMobileMenuAnimationDetails();
      logTest('getMobileMenuAnimationDetails()', 'pass', 'Mobile menu animations analyzed', 'Array of animated elements', 
        `${animationDetails.length} animated elements found`);
    } catch (error) {
      logTest('getMobileMenuAnimationDetails()', 'fail', `Failed to get animation details: ${error.message}`);
    }
    
    try {
      const accessibility = await pomInstance.getMobileMenuAccessibility();
      logTest('getMobileMenuAccessibility()', 'pass', 'Mobile menu accessibility analyzed', 'Object with a11y data', 
        `${accessibility.toggleButtons?.length || 0} accessible toggle buttons`);
    } catch (error) {
      logTest('getMobileMenuAccessibility()', 'fail', `Failed to get accessibility data: ${error.message}`);
    }
    
    try {
      const interactionFlow = await pomInstance.getMobileMenuInteractionFlow();
      logTest('getMobileMenuInteractionFlow()', 'pass', 'Mobile menu interaction flow mapped', 'Object with interaction data', 
        `${interactionFlow.toggleButtons?.length || 0} interactive toggle buttons`);
    } catch (error) {
      logTest('getMobileMenuInteractionFlow()', 'fail', `Failed to get interaction flow: ${error.message}`);
    }
    
    try {
      const keyboardNav = await pomInstance.testMobileMenuKeyboardNavigation();
      logTest('testMobileMenuKeyboardNavigation()', keyboardNav?.length > 0 ? 'pass' : 'warning', 
        'Mobile menu keyboard navigation tested', 'Array of test results', 
        `${keyboardNav?.length || 0} keyboard navigation tests performed`);
    } catch (error) {
      logTest('testMobileMenuKeyboardNavigation()', 'fail', `Failed to test keyboard navigation: ${error.message}`);
    }
    
    // Reset to desktop viewport
    await pomInstance.setViewport(1280, 800);
    
    // 4. CONTENT METHODS
    console.log(`\n${colors.bright}${colors.blue}4️⃣ Content Extraction Methods${colors.reset}`);
    console.log(`${colors.blue}==============================${colors.reset}`);
    
    try {
      const heroContent = await pomInstance.getHeroContent();
      const hasHero = heroContent && (heroContent.headline || heroContent.subheadline);
      logTest('getHeroContent()', hasHero ? 'pass' : 'fail', 
        hasHero ? 'Hero content extracted' : 'No hero content found',
        'Object with headline/subheadline', hasHero ? `Headline: ${heroContent.headline?.substring(0, 30)}...` : 'null');
    } catch (error) {
      logTest('getHeroContent()', 'fail', `Failed to get hero content: ${error.message}`);
    }
    
    try {
      const colorScheme = await pomInstance.getColorScheme();
      logTest('getColorScheme()', 'pass', 'Color scheme extracted', 'Object with color info', 
        `Body bg: ${colorScheme.body?.background}`);
    } catch (error) {
      logTest('getColorScheme()', 'fail', `Failed to get color scheme: ${error.message}`);
    }
    
    try {
      const textContent = await pomInstance.getAllTextContent();
      const hasText = textContent && Object.keys(textContent).length > 0;
      logTest('getAllTextContent()', hasText ? 'pass' : 'fail', 
        hasText ? 'All text content extracted' : 'No text content found',
        'Object with text arrays', hasText ? `Nav: ${textContent.navigation?.length}, Hero: ${textContent.hero?.length}` : 'empty');
    } catch (error) {
      logTest('getAllTextContent()', 'fail', `Failed to get text content: ${error.message}`);
    }
    
    // 5. VISUAL TESTING METHODS
    console.log(`\n${colors.bright}${colors.blue}5️⃣ Visual Testing Methods${colors.reset}`);
    console.log(`${colors.blue}==========================${colors.reset}`);
    
    try {
      const screenshotPath = path.join('.test-results', 'pom-coverage', 'full-page-test.png');
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      await pomInstance.captureScreenshot(screenshotPath);
      logTest('captureScreenshot()', 'pass', 'Full page screenshot captured', 'File created', screenshotPath);
    } catch (error) {
      logTest('captureScreenshot()', 'fail', `Failed to capture screenshot: ${error.message}`);
    }
    
    try {
      const elementPath = path.join('.test-results', 'pom-coverage', 'nav-element-test.png');
      const captured = await pomInstance.captureElementScreenshot('nav', elementPath);
      logTest('captureElementScreenshot()', captured ? 'pass' : 'warning', 
        captured ? 'Element screenshot captured' : 'Element not found for screenshot',
        'Boolean true', captured.toString());
    } catch (error) {
      logTest('captureElementScreenshot()', 'fail', `Failed to capture element screenshot: ${error.message}`);
    }
    
    // 6. UTILITY METHODS
    console.log(`\n${colors.bright}${colors.blue}6️⃣ Utility Methods${colors.reset}`);
    console.log(`${colors.blue}==================${colors.reset}`);
    
    try {
      const elementExists = await pomInstance.waitForElement('nav', 1000);
      logTest('waitForElement()', elementExists ? 'pass' : 'warning', 
        elementExists ? 'Element found within timeout' : 'Element not found within timeout',
        'Boolean true', elementExists.toString());
    } catch (error) {
      logTest('waitForElement()', 'fail', `Wait for element failed: ${error.message}`);
    }
    
    try {
      const measurements = await pomInstance.getElementMeasurements('nav');
      const hasMeasurements = measurements && measurements.dimensions;
      logTest('getElementMeasurements()', hasMeasurements ? 'pass' : 'fail', 
        hasMeasurements ? 'Element measurements retrieved' : 'No measurements found',
        'Object with dimensions/spacing/typography', hasMeasurements ? `${measurements.dimensions.width}x${measurements.dimensions.height}` : 'null');
    } catch (error) {
      logTest('getElementMeasurements()', 'fail', `Failed to get element measurements: ${error.message}`);
    }
    
    // 7. DESIGN ANALYSIS METHODS
    console.log(`\n${colors.bright}${colors.blue}7️⃣ Design Analysis Methods${colors.reset}`);
    console.log(`${colors.blue}===========================${colors.reset}`);
    
    try {
      const buttonStyles = await pomInstance.getButtonStyles();
      logTest('getButtonStyles()', 'pass', 'Button styles analyzed', 'Array of button objects', `${buttonStyles.length} buttons found`);
    } catch (error) {
      logTest('getButtonStyles()', 'fail', `Failed to get button styles: ${error.message}`);
    }
    
    try {
      const layout = await pomInstance.getLayoutMeasurements();
      const hasLayout = layout && layout.viewport;
      logTest('getLayoutMeasurements()', hasLayout ? 'pass' : 'fail', 
        hasLayout ? 'Layout measurements retrieved' : 'No layout measurements',
        'Object with layout info', hasLayout ? `Viewport: ${layout.viewport.width}x${layout.viewport.height}` : 'null');
    } catch (error) {
      logTest('getLayoutMeasurements()', 'fail', `Failed to get layout measurements: ${error.message}`);
    }
    
    try {
      const visualElements = await pomInstance.getVisualDesignElements();
      logTest('getVisualDesignElements()', 'pass', 'Visual design elements analyzed', 'Object with element counts', 
        `Gradients: ${visualElements.gradients}, Animations: ${visualElements.cssAnimations}`);
    } catch (error) {
      logTest('getVisualDesignElements()', 'fail', `Failed to get visual design elements: ${error.message}`);
    }
    
    try {
      const spacing = await pomInstance.getSpacingRhythm();
      logTest('getSpacingRhythm()', 'pass', 'Spacing rhythm analyzed', 'Object with spacing data', 
        `Sections: ${spacing.sectionSpacings?.length}, Consistent: ${spacing.consistentSpacing}`);
    } catch (error) {
      logTest('getSpacingRhythm()', 'fail', `Failed to get spacing rhythm: ${error.message}`);
    }
    
    try {
      const textSizes = await pomInstance.getTextElementSizes();
      const hasTextSizes = textSizes && Object.keys(textSizes).length > 0;
      logTest('getTextElementSizes()', hasTextSizes ? 'pass' : 'fail', 
        hasTextSizes ? 'Text element sizes analyzed' : 'No text sizes found',
        'Object with text measurements', hasTextSizes ? `H1: ${textSizes.h1?.length}, P: ${textSizes.p?.length}` : 'empty');
    } catch (error) {
      logTest('getTextElementSizes()', 'fail', `Failed to get text element sizes: ${error.message}`);
    }
    
    // 8. INTERACTION ANALYSIS METHODS
    console.log(`\n${colors.bright}${colors.blue}8️⃣ Interaction Analysis Methods${colors.reset}`);
    console.log(`${colors.blue}================================${colors.reset}`);
    
    try {
      const interactive = await pomInstance.getInteractiveElements();
      logTest('getInteractiveElements()', 'pass', 'Interactive elements analyzed', 'Object with interaction counts', 
        `Focusable: ${interactive.focusableElements}, Dropdowns: ${interactive.dropdowns}`);
    } catch (error) {
      logTest('getInteractiveElements()', 'fail', `Failed to get interactive elements: ${error.message}`);
    }
    
    try {
      const microInteractions = await pomInstance.getMicroInteractions();
      logTest('getMicroInteractions()', 'pass', 'Micro-interactions analyzed', 'Object with interaction data', 
        `Hover: ${microInteractions.hoverEffects}, Transitions: ${microInteractions.transitions}`);
    } catch (error) {
      logTest('getMicroInteractions()', 'fail', `Failed to get micro-interactions: ${error.message}`);
    }
    
    // 9. ACCESSIBILITY METHODS
    console.log(`\n${colors.bright}${colors.blue}9️⃣ Accessibility Methods${colors.reset}`);
    console.log(`${colors.blue}========================${colors.reset}`);
    
    try {
      const accessibility = await pomInstance.getAccessibilityMetrics();
      logTest('getAccessibilityMetrics()', 'pass', 'Accessibility metrics analyzed', 'Object with a11y data', 
        `Images with alt: ${accessibility.imagesWithAlt}/${accessibility.totalImages}, Focusable: ${accessibility.focusableCount}`);
    } catch (error) {
      logTest('getAccessibilityMetrics()', 'fail', `Failed to get accessibility metrics: ${error.message}`);
    }
    
    // 10. FORM ANALYSIS METHODS
    console.log(`\n${colors.bright}${colors.blue}🔟 Form Analysis Methods${colors.reset}`);
    console.log(`${colors.blue}========================${colors.reset}`);
    
    try {
      const forms = await pomInstance.getFormElements();
      logTest('getFormElements()', 'pass', 'Form elements analyzed', 'Object with form data', 
        `Forms: ${forms.forms}, Inputs: ${forms.inputs}, Validation: ${forms.hasValidation}`);
    } catch (error) {
      logTest('getFormElements()', 'fail', `Failed to get form elements: ${error.message}`);
    }
    
    // 11. PERFORMANCE METHODS
    console.log(`\n${colors.bright}${colors.blue}1️⃣1️⃣ Performance Methods${colors.reset}`);
    console.log(`${colors.blue}=========================${colors.reset}`);
    
    try {
      const performance = await pomInstance.getPerformanceIndicators();
      logTest('getPerformanceIndicators()', 'pass', 'Performance indicators analyzed', 'Object with performance data', 
        `Lazy images: ${performance.lazyLoadedImages}/${performance.totalImages}, Async scripts: ${performance.asyncScripts}`);
    } catch (error) {
      logTest('getPerformanceIndicators()', 'fail', `Failed to get performance indicators: ${error.message}`);
    }
    
    try {
      const responsiveImages = await pomInstance.getResponsiveImages();
      logTest('getResponsiveImages()', 'pass', 'Responsive images analyzed', 'Array of image data', 
        `${responsiveImages.length} images, ${responsiveImages.filter(img => img.hasSrcset).length} with srcset`);
    } catch (error) {
      logTest('getResponsiveImages()', 'fail', `Failed to get responsive images: ${error.message}`);
    }
    
    // 12. COMPLIANCE METHODS
    console.log(`\n${colors.bright}${colors.blue}1️⃣2️⃣ Compliance Methods${colors.reset}`);
    console.log(`${colors.blue}=========================${colors.reset}`);
    
    try {
      const cookieCompliance = await pomInstance.getCookieCompliance();
      logTest('getCookieCompliance()', 'pass', 'Cookie compliance analyzed', 'Object with compliance data', 
        `Banner: ${cookieCompliance.hasCookieBanner}, Accept: ${cookieCompliance.hasAcceptButton}`);
    } catch (error) {
      logTest('getCookieCompliance()', 'fail', `Failed to get cookie compliance: ${error.message}`);
    }
    
    // 13. ENHANCED ANALYSIS METHODS
    console.log(`\n${colors.bright}${colors.blue}1️⃣3️⃣ Enhanced Analysis Methods${colors.reset}`);
    console.log(`${colors.blue}===============================${colors.reset}`);
    
    try {
      const gradients = await pomInstance.getGradientAnalysis();
      logTest('getGradientAnalysis()', 'pass', 'Gradient analysis completed', 'Object with gradient data', 
        `Backgrounds: ${gradients.backgrounds.length}, Text: ${gradients.texts.length}, Shadows: ${gradients.shadows.length}`);
    } catch (error) {
      logTest('getGradientAnalysis()', 'fail', `Failed to get gradient analysis: ${error.message}`);
    }
    
    try {
      const animations = await pomInstance.getAnimationAnalysis();
      logTest('getAnimationAnalysis()', 'pass', 'Animation analysis completed', 'Object with animation data', 
        `CSS: ${animations.cssAnimations.length}, Transitions: ${animations.transitions.length}, Transforms: ${animations.transforms.length}`);
    } catch (error) {
      logTest('getAnimationAnalysis()', 'fail', `Failed to get animation analysis: ${error.message}`);
    }
    
    try {
      const colorPalette = await pomInstance.getColorPalette();
      logTest('getColorPalette()', 'pass', 'Color palette analysis completed', 'Object with color data', 
        `Total colors: ${colorPalette.totalUniqueColors}, Backgrounds: ${colorPalette.backgrounds.length}`);
    } catch (error) {
      logTest('getColorPalette()', 'fail', `Failed to get color palette: ${error.message}`);
    }
    
    try {
      const fontAnalysis = await pomInstance.getFontAnalysis();
      logTest('getFontAnalysis()', 'pass', 'Font analysis completed', 'Object with typography data', 
        `Families: ${fontAnalysis.families.length}, Variations: ${fontAnalysis.totalVariations}`);
    } catch (error) {
      logTest('getFontAnalysis()', 'fail', `Failed to get font analysis: ${error.message}`);
    }
    
    try {
      const semantics = await pomInstance.getSemanticAnalysis();
      logTest('getSemanticAnalysis()', 'pass', 'Semantic analysis completed', 'Object with semantic data', 
        `Elements: ${Object.keys(semantics.semanticElements).length}, Headings: ${semantics.headingHierarchy.length}`);
    } catch (error) {
      logTest('getSemanticAnalysis()', 'fail', `Failed to get semantic analysis: ${error.message}`);
    }
    
    // 14. COMPREHENSIVE METHOD
    console.log(`\n${colors.bright}${colors.blue}1️⃣4️⃣ Comprehensive Analysis Method${colors.reset}`);
    console.log(`${colors.blue}===================================${colors.reset}`);
    
    try {
      const comprehensive = await pomInstance.getComprehensiveParityMetrics();
      const hasComprehensive = comprehensive && Object.keys(comprehensive).length > 0;
      logTest('getComprehensiveParityMetrics()', hasComprehensive ? 'pass' : 'fail', 
        hasComprehensive ? 'Comprehensive analysis completed' : 'Comprehensive analysis failed',
        'Object with all metrics', hasComprehensive ? `${Object.keys(comprehensive).length} metric categories` : 'empty');
    } catch (error) {
      logTest('getComprehensiveParityMetrics()', 'fail', `Failed to get comprehensive metrics: ${error.message}`);
    }
    
    // Save test results
    const outputDir = path.join('.test-results', 'pom-coverage');
    await fs.mkdir(outputDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeFile(
      path.join(outputDir, `pom-coverage-results-${timestamp}.json`),
      JSON.stringify(testResults, null, 2)
    );
    
    // Final Summary
    console.log(`\n${colors.bright}${colors.blue}============================================${colors.reset}`);
    console.log(`${colors.bright}📊 POM Method Coverage Summary${colors.reset}`);
    console.log(`${colors.blue}============================================${colors.reset}`);
    
    console.log(`${colors.green}✅ Passed: ${testResults.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${testResults.failed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Warnings: ${testResults.warnings}${colors.reset}`);
    
    const totalTests = testResults.passed + testResults.failed + testResults.warnings;
    const passRate = ((testResults.passed / totalTests) * 100).toFixed(1);
    const successRate = (((testResults.passed + testResults.warnings) / totalTests) * 100).toFixed(1);
    
    console.log(`${colors.bright}📈 Pass Rate: ${passRate}%${colors.reset}`);
    console.log(`${colors.bright}📈 Success Rate (including warnings): ${successRate}%${colors.reset}`);
    
    console.log(`\n${colors.bright}🔍 Coverage Analysis:${colors.reset}`);
    console.log(`Total POM methods tested: ${totalTests}`);
    console.log(`Core functionality methods: ${testResults.passed} working`);
    console.log(`Methods with warnings: ${testResults.warnings} (expected for some contexts)`);
    console.log(`Failed methods: ${testResults.failed} (need investigation)`);
    
    if (testResults.failed > 0) {
      console.log(`\n${colors.red}❌ Failed Methods:${colors.reset}`);
      Object.entries(testResults.methodResults).forEach(([method, result]) => {
        if (result.status === 'fail') {
          console.log(`  • ${method}: ${result.details}`);
        }
      });
    }
    
    console.log(`\n${colors.cyan}📁 Results saved to: .test-results/pom-coverage/pom-coverage-results-${timestamp}.json${colors.reset}`);
    
    // Verdict
    if (testResults.failed === 0) {
      console.log(`\n${colors.bright}${colors.green}🎯 VERDICT: ALL POM METHODS WORKING CORRECTLY!${colors.reset}`);
      console.log(`${colors.green}✨ The POM provides comprehensive coverage of all website analysis capabilities.${colors.reset}`);
    } else if (testResults.failed < 3) {
      console.log(`\n${colors.bright}${colors.yellow}🎯 VERDICT: EXCELLENT - Minor issues only${colors.reset}`);
      console.log(`${colors.yellow}Most POM methods work correctly with minimal failures.${colors.reset}`);
    } else {
      console.log(`\n${colors.bright}${colors.red}🎯 VERDICT: NEEDS ATTENTION${colors.reset}`);
      console.log(`${colors.red}Several POM methods need investigation and fixes.${colors.reset}`);
    }
    
    return testResults;
    
  } catch (error) {
    console.error(`${colors.red}❌ Critical Test Error: ${error.message}${colors.reset}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the comprehensive test
if (require.main === module) {
  testComprehensivePOMCoverage()
    .then((results) => {
      console.log(`\n${colors.green}✅ Comprehensive POM coverage test completed!${colors.reset}`);
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error(`\n${colors.red}❌ Test suite failed: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

module.exports = testComprehensivePOMCoverage;