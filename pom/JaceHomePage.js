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
        ctaButton: 'section a[href*="signup"], section a[href*="start"], a.btn-primary, a[class*="button"][class*="primary"], section:first-of-type a[class*="btn"]',
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
      // Get header nav specifically
      const nav = document.querySelector('header nav, nav:first-of-type');
      if (!nav) return null;
      
      // Get links only from the header nav
      const links = Array.from(nav.querySelectorAll('a:not([href="/"])')).filter(link => {
        // Exclude the logo link
        return !link.querySelector('img') && !link.classList.contains('logo');
      });
      
      return {
        exists: true,
        logo: !!nav.querySelector(selectors.nav.logo),
        links: links.map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          isButton: link.classList.toString().includes('btn') || 
                   link.classList.toString().includes('button') ||
                   link.textContent.includes('Get Started') ||
                   link.textContent.includes('Log In')
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
    // First try the close button selector
    let closeBtn = await this.page.$(this.selectors.nav.mobileMenuClose);
    
    // If not found, try clicking the hamburger button again (toggle behavior)
    if (!closeBtn) {
      closeBtn = await this.page.$(this.selectors.nav.mobileMenuToggle);
    }
    
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    return false;
  }
  
  async getMobileMenuState() {
    return await this.page.evaluate(() => {
      // Look for the nav that contains the menu items
      const headerNav = document.querySelector('header nav');
      if (!headerNav) return { found: false };
      
      // Check if any nav links are in a mobile menu state
      const navLinks = headerNav.querySelector('ul, div[class*="nav"]');
      if (!navLinks) return { found: false };
      
      // Check various ways menu might be shown
      const styles = getComputedStyle(navLinks);
      const isVisible = styles.display !== 'none' && 
                       styles.visibility !== 'hidden' &&
                       styles.opacity !== '0';
      
      // Check if it's in mobile menu mode (fixed positioning is common)
      const isMobileMenu = styles.position === 'fixed' || 
                          styles.position === 'absolute' ||
                          navLinks.classList.toString().includes('mobile') ||
                          navLinks.classList.toString().includes('active');
      
      return {
        found: true,
        isOpen: isVisible && isMobileMenu,
        classes: navLinks.className,
        display: styles.display,
        position: styles.position,
        visibility: styles.visibility
      };
    });
  }
  
  // Hero Section Methods
  async getHeroContent() {
    return await this.page.evaluate((selectors) => {
      const headline = document.querySelector(selectors.hero.headline);
      const subheadline = document.querySelector(selectors.hero.subheadline);
      let ctaButton = document.querySelector(selectors.hero.ctaButton);
      
      // If no CTA found with selectors, look for it near the headline
      if (!ctaButton && headline) {
        const heroSection = headline.closest('section');
        if (heroSection) {
          // Look for any primary button in the hero section
          ctaButton = heroSection.querySelector('a[class*="btn"]:not([class*="secondary"]), a[class*="button"]:not([class*="secondary"])');
        }
      }
      
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
      
      // Navigation text - header nav only
      const headerNav = document.querySelector('header nav, nav:first-of-type');
      if (headerNav) {
        headerNav.querySelectorAll('a').forEach(link => {
          texts.navigation.push(link.textContent.trim());
        });
      }
      
      // Hero text - jace.ai uses div containers, not sections
      const h1 = document.querySelector('h1');
      if (h1) {
        // Find the hero container (could be section, div, or main)
        let heroContainer = h1.closest('section, main > div, .hero, [class*="hero"]');
        if (!heroContainer) {
          // Use the parent container that seems reasonable
          heroContainer = h1.parentElement.parentElement;
        }
        
        if (heroContainer) {
          // Get all text elements in hero area
          const heroElements = heroContainer.querySelectorAll('h1, h2, h3, p, span[class*="text"]');
          heroElements.forEach(el => {
            const text = el.textContent.trim();
            if (text && !texts.hero.includes(text)) {
              texts.hero.push(text);
            }
          });
        }
      }
      
      // Features text
      document.querySelectorAll('h2, h3').forEach(heading => {
        if (heading.textContent.includes('feature') || 
            heading.textContent.includes('AI') ||
            heading.textContent.includes('hour')) {
          texts.features.push(heading.textContent.trim());
        }
      });
      
      // Footer text - specifically from footer nav
      const footerNav = document.querySelector('footer nav, nav:nth-of-type(2)');
      if (footerNav) {
        footerNav.querySelectorAll('a').forEach(link => {
          texts.footer.push(link.textContent.trim());
        });
      }
      
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