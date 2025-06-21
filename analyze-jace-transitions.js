const puppeteer = require('puppeteer');

async function analyzeJaceTransitions() {
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    console.log('🔍 Deep Analysis of jace.ai Transition Strategy');
    console.log('==============================================\n');
    
    await page.goto('https://jace.ai', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Analyze transition patterns in detail
    const transitionAnalysis = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const transitionData = {
        totalElements: allElements.length,
        elementsWithTransitions: 0,
        transitionPatterns: {},
        elementTypes: {},
        specificSelectors: [],
        cssRules: []
      };
      
      allElements.forEach((el, index) => {
        const styles = getComputedStyle(el);
        const transition = styles.transition;
        
        if (transition && transition !== 'all 0s ease 0s' && transition !== 'none') {
          transitionData.elementsWithTransitions++;
          
          // Track transition patterns
          if (!transitionData.transitionPatterns[transition]) {
            transitionData.transitionPatterns[transition] = 0;
          }
          transitionData.transitionPatterns[transition]++;
          
          // Track element types
          const tagName = el.tagName.toLowerCase();
          if (!transitionData.elementTypes[tagName]) {
            transitionData.elementTypes[tagName] = 0;
          }
          transitionData.elementTypes[tagName]++;
          
          // Collect specific selectors for common patterns
          if (index < 50) { // First 50 for analysis
            transitionData.specificSelectors.push({
              tagName: tagName,
              classes: el.className,
              id: el.id,
              transition: transition,
              styles: {
                position: styles.position,
                display: styles.display,
                opacity: styles.opacity
              }
            });
          }
        }
      });
      
      // Try to get CSS rules (this might be limited by CORS)
      try {
        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            rules.forEach(rule => {
              if (rule.style && rule.style.transition && rule.style.transition !== '') {
                transitionData.cssRules.push({
                  selector: rule.selectorText,
                  transition: rule.style.transition
                });
              }
            });
          } catch (e) {
            // CORS or security restrictions
          }
        });
      } catch (e) {
        // Handle stylesheet access errors
      }
      
      return transitionData;
    });
    
    console.log('📊 Transition Analysis Results:');
    console.log('==============================');
    console.log(`Total elements on page: ${transitionAnalysis.totalElements}`);
    console.log(`Elements with transitions: ${transitionAnalysis.elementsWithTransitions}`);
    console.log(`Transition coverage: ${((transitionAnalysis.elementsWithTransitions / transitionAnalysis.totalElements) * 100).toFixed(1)}%`);
    
    console.log('\n🎨 Most Common Transition Patterns:');
    const sortedPatterns = Object.entries(transitionAnalysis.transitionPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedPatterns.forEach(([pattern, count], i) => {
      console.log(`${i + 1}. (${count}x) ${pattern.substring(0, 80)}${pattern.length > 80 ? '...' : ''}`);
    });
    
    console.log('\n🏷️ Element Types with Transitions:');
    const sortedTypes = Object.entries(transitionAnalysis.elementTypes)
      .sort((a, b) => b[1] - a[1]);
    
    sortedTypes.forEach(([type, count]) => {
      console.log(`  ${type}: ${count} elements`);
    });
    
    console.log('\n🔍 Sample Elements with Transitions:');
    transitionAnalysis.specificSelectors.slice(0, 10).forEach((el, i) => {
      console.log(`${i + 1}. <${el.tagName}> ${el.classes ? `class="${el.classes}"` : ''}`);
      console.log(`   Transition: ${el.transition}`);
      console.log(`   Display: ${el.styles.display}, Position: ${el.styles.position}`);
    });
    
    if (transitionAnalysis.cssRules.length > 0) {
      console.log('\n📝 CSS Rules with Transitions:');
      transitionAnalysis.cssRules.slice(0, 10).forEach((rule, i) => {
        console.log(`${i + 1}. ${rule.selector}: ${rule.transition}`);
      });
    }
    
    // Analyze specific framework patterns
    const frameworkAnalysis = await page.evaluate(() => {
      const patterns = {
        tailwindClasses: [],
        reactComponents: [],
        frameworkIndicators: []
      };
      
      // Look for Tailwind patterns
      const elementsWithClasses = Array.from(document.querySelectorAll('[class]'));
      elementsWithClasses.forEach(el => {
        const classes = el.className;
        if (classes.includes('transition') || classes.includes('duration') || classes.includes('ease')) {
          patterns.tailwindClasses.push(classes);
        }
      });
      
      // Look for React indicators
      const reactElements = document.querySelectorAll('[data-reactroot], [data-react-], ._react');
      patterns.reactComponents = reactElements.length;
      
      // Look for framework indicators
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      scripts.forEach(script => {
        const src = script.src;
        if (src.includes('react') || src.includes('next') || src.includes('tailwind')) {
          patterns.frameworkIndicators.push(src);
        }
      });
      
      return patterns;
    });
    
    console.log('\n⚙️ Framework Analysis:');
    console.log('=====================');
    console.log(`React components detected: ${frameworkAnalysis.reactComponents}`);
    console.log(`Tailwind transition classes: ${frameworkAnalysis.tailwindClasses.length}`);
    
    if (frameworkAnalysis.tailwindClasses.length > 0) {
      console.log('\n🎨 Tailwind Transition Patterns:');
      const uniqueClasses = [...new Set(frameworkAnalysis.tailwindClasses)].slice(0, 5);
      uniqueClasses.forEach((classes, i) => {
        console.log(`${i + 1}. ${classes}`);
      });
    }
    
    return transitionAnalysis;
    
  } catch (error) {
    console.error('❌ Analysis Error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the analysis
analyzeJaceTransitions()
  .then(() => console.log('\n✅ jace.ai transition analysis completed!'))
  .catch(error => console.error('\n❌ Analysis failed:', error));