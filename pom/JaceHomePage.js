const puppeteer = require('puppeteer');

class JaceHomePage {
  constructor(page) {
    this.page = page;
    this.url = 'https://jace.ai';
    
    // Define selectors
    this.selectors = {
      // Navigation
      nav: {
        container: 'nav',
        logo: 'a[href="/"]',
        menuItems: 'nav a:not([href="/"])',
        featuresLink: 'a[href="/features"]',
        companyLink: 'a[href="/company"]',
        pricingLink: 'a[href="/pricing"]',
        blogLink: 'a[href="/blog"]',
        loginButton: 'a[href*="login"], a[href*="signin"], nav a:nth-last-child(2)',
        ctaButton: 'a[href*="signup"], a[href*="start"], nav a:last-child',
        mobileMenuToggle: 'button[aria-label*="menu"], button[aria-label*="Menu"], nav button:last-child',
        mobileMenuClose: 'button[aria-label*="Close"], .mobile-menu-close'
      },
      
      // Hero Section
      hero: {
        container: 'main > section:first-child, section:first-of-type',
        headline: 'h1',
        subheadline: 'h1 + p',
        ctaButton: 'section a[href*="signup"], section a[href*="start"], h1 ~ * a.btn, h1 ~ * a[class*="button"]',
        trustBadges: 'img[alt*="CASA"], img[alt*="certification"]',
        userCount: 'span[class*="user"], div[class*="user"], span[class*="count"]',
        videoPlaceholder: 'div[class*="video"], svg[viewBox*="0 0 24 24"]'
      },
      
      // Features Section
      features: {
        container: 'section:nth-of-type(2), section:nth-of-type(3)',
        headline: 'h2',
        subheadline: 'h2 + h2, h2 ~ h2',
        featureCards: 'div[class*="feature"], div[class*="card"]'
      },
      
      // Testimonials/Logos
      testimonials: {
        container: 'section:last-of-type',
        headline: 'h3, p[class*="engineers"], p[class*="built"]',
        logoImages: 'img[alt*="Amazon"], img[alt*="Tesla"], img[alt*="Google"], img[alt*="Meta"]',
        logoContainer: 'div[class*="logo"], div[class*="brand"]'
      },
      
      // Mobile Menu (when open)
      mobileMenu: {
        overlay: '.nav-menu.active, nav ul.active, [class*="mobile-menu"].active',
        menuItems: '.nav-menu.active a, nav ul.active a',
        logo: '.nav-menu.active .logo, nav ul.active .logo',
        closeButton: '.nav-menu.active button, nav ul.active button'
      }
    };
  }
  
  async navigate() {
    await this.page.goto(this.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
  }
  
  async getPageTitle() {
    return await this.page.title();
  }
  
  async getViewportDimensions() {
    return await this.page.viewport();
  }
  
  async setViewport(width, height) {
    await this.page.setViewport({ width, height });
  }
  
  // Navigation Methods
  async getNavigationStructure() {
    return await this.page.evaluate((selectors) => {
      const nav = document.querySelector(selectors.nav.container);
      if (!nav) return null;
      
      const links = Array.from(document.querySelectorAll(selectors.nav.menuItems));
      return {
        exists: true,
        logo: !!document.querySelector(selectors.nav.logo),
        links: links.map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          isButton: link.classList.toString().includes('btn') || 
                   link.classList.toString().includes('button')
        }))
      };
    }, this.selectors);
  }
  
  async isMobileMenuVisible() {
    try {
      const button = await this.page.$(this.selectors.nav.mobileMenuToggle);
      return button !== null && await button.isVisible();
    } catch {
      return false;
    }
  }
  
  async openMobileMenu() {
    const button = await this.page.$(this.selectors.nav.mobileMenuToggle);
    if (button) {
      await button.click();
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
      return true;
    }
    return false;
  }
  
  async closeMobileMenu() {
    const closeBtn = await this.page.$(this.selectors.nav.mobileMenuClose);
    if (closeBtn) {
      await closeBtn.click();
      await this.page.waitForTimeout(500);
      return true;
    }
    return false;
  }
  
  async getMobileMenuState() {
    return await this.page.evaluate(() => {
      // Try different possible selectors for mobile menu
      const possibleMenus = [
        document.querySelector('.nav-menu'),
        document.querySelector('nav ul'),
        document.querySelector('[class*="mobile-menu"]'),
        document.querySelector('[class*="nav-links"]')
      ].filter(Boolean);
      
      if (possibleMenus.length === 0) return { found: false };
      
      const menu = possibleMenus[0];
      const isActive = menu.classList.contains('active') || 
                      menu.classList.contains('open') ||
                      menu.classList.contains('show') ||
                      getComputedStyle(menu).display !== 'none';
      
      return {
        found: true,
        isOpen: isActive,
        classes: menu.className,
        display: getComputedStyle(menu).display,
        position: getComputedStyle(menu).position
      };
    });
  }
  
  // Hero Section Methods
  async getHeroContent() {
    return await this.page.evaluate((selectors) => {
      const headline = document.querySelector(selectors.hero.headline);
      const subheadline = document.querySelector(selectors.hero.subheadline);
      const ctaButton = document.querySelector(selectors.hero.ctaButton);
      
      return {
        headline: headline ? headline.textContent.trim() : null,
        subheadline: subheadline ? subheadline.textContent.trim() : null,
        ctaButton: ctaButton ? {
          text: ctaButton.textContent.trim(),
          href: ctaButton.href
        } : null
      };
    }, this.selectors);
  }
  
  // Visual Testing Methods
  async captureScreenshot(filename) {
    await this.page.screenshot({ 
      path: filename,
      fullPage: true 
    });
  }
  
  async captureElementScreenshot(selector, filename) {
    const element = await this.page.$(selector);
    if (element) {
      await element.screenshot({ path: filename });
      return true;
    }
    return false;
  }
  
  // Color and Style Methods
  async getColorScheme() {
    return await this.page.evaluate(() => {
      const body = document.body;
      const nav = document.querySelector('nav');
      const hero = document.querySelector('section');
      
      const getColors = (element) => {
        if (!element) return null;
        const styles = getComputedStyle(element);
        return {
          background: styles.backgroundColor,
          color: styles.color,
          font: styles.fontFamily
        };
      };
      
      return {
        body: getColors(body),
        nav: getColors(nav),
        hero: getColors(hero)
      };
    });
  }
  
  // Get all text content for comparison
  async getAllTextContent() {
    return await this.page.evaluate(() => {
      const texts = {
        navigation: [],
        hero: [],
        features: [],
        footer: []
      };
      
      // Navigation text
      document.querySelectorAll('nav a').forEach(link => {
        texts.navigation.push(link.textContent.trim());
      });
      
      // Hero text
      const heroSection = document.querySelector('main > section:first-child, section:has(h1)');
      if (heroSection) {
        heroSection.querySelectorAll('h1, h2, p').forEach(el => {
          texts.hero.push(el.textContent.trim());
        });
      }
      
      // Features text
      document.querySelectorAll('h2, h3').forEach(heading => {
        if (heading.textContent.includes('feature') || 
            heading.textContent.includes('AI') ||
            heading.textContent.includes('hour')) {
          texts.features.push(heading.textContent.trim());
        }
      });
      
      return texts;
    });
  }
  
  // Utility method to wait for element
  async waitForElement(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = JaceHomePage;