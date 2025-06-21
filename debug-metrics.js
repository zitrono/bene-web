const puppeteer = require('puppeteer');
const JaceHomePage = require('./pom/JaceHomePage');

async function debugMetrics() {
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    const beneficiousHome = new JaceHomePage(page);
    beneficiousHome.url = 'http://localhost:8080';
    await beneficiousHome.navigate();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Testing individual methods:');
    
    const gradients = await beneficiousHome.getGradientAnalysis();
    console.log('Gradients:', {
      backgrounds: gradients?.backgrounds?.length || 0,
      texts: gradients?.texts?.length || 0,
      shadows: gradients?.shadows?.length || 0
    });
    
    const colors = await beneficiousHome.getColorPalette();
    console.log('Colors:', {
      backgrounds: colors?.backgrounds?.size || 0,
      texts: colors?.texts?.size || 0,
      borders: colors?.borders?.size || 0
    });
    
    const animations = await beneficiousHome.getAnimationAnalysis();
    console.log('Animations:', {
      transitions: animations?.transitions?.length || 0,
      cssAnimations: animations?.cssAnimations?.length || 0,
      transforms: animations?.transforms?.length || 0
    });
    
    const fonts = await beneficiousHome.getFontAnalysis();
    console.log('Fonts:', {
      variations: fonts?.variations?.length || 0,
      families: fonts?.families?.length || 0
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugMetrics();