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
      },
      
      // Visual Design Elements
      design: {
        gradients: '[class*="gradient"], [style*="gradient"]',
        blurEffects: '[class*="blur"], [style*="blur"]',
        animations: '[class*="animate"], [data-aos]',
        videoBackground: 'video, [class*="video-bg"]',
        iconElements: 'svg, [class*="icon"]',
        badges: '[class*="badge"], [class*="tag"]',
        cards: '[class*="card"], [class*="feature-box"]'
      },
      
      // Interactive Elements
      interactive: {
        dropdowns: '[class*="dropdown"], select',
        toggles: '[class*="toggle"], [class*="switch"]',
        tooltips: '[data-tooltip], [title]',
        modals: '[class*="modal"], [role="dialog"]',
        accordions: '[class*="accordion"], details',
        tabs: '[role="tablist"], [class*="tabs"]'
      },
      
      // Layout Components
      layout: {
        grid: '[class*="grid"], [style*="grid"]',
        flexContainers: '[class*="flex"], [style*="flex"]',
        containers: '.container, [class*="container"], [class*="wrapper"]',
        sections: 'section, [class*="section"]',
        sidebars: 'aside, [class*="sidebar"]',
        sticky: '[class*="sticky"], [style*="sticky"]'
      },
      
      // Typography Elements
      typography: {
        headings: 'h1, h2, h3, h4, h5, h6',
        highlights: 'mark, [class*="highlight"]',
        quotes: 'blockquote, q',
        code: 'code, pre',
        lists: 'ul, ol',
        emphasis: 'strong, em, b, i'
      },
      
      // Forms and Inputs
      forms: {
        inputs: 'input[type="text"], input[type="email"]',
        textareas: 'textarea',
        checkboxes: 'input[type="checkbox"]',
        radios: 'input[type="radio"]',
        selects: 'select',
        labels: 'label',
        errorMessages: '[class*="error"], [class*="invalid"]',
        successMessages: '[class*="success"], [class*="valid"]'
      },
      
      // Media Elements
      media: {
        images: 'img, picture',
        videos: 'video, iframe[src*="youtube"], iframe[src*="vimeo"]',
        audio: 'audio',
        svgGraphics: 'svg',
        lazyLoaded: '[loading="lazy"], [data-src]'
      },
      
      // Social Proof
      social: {
        testimonials: '[class*="testimonial"], [class*="review"]',
        ratings: '[class*="rating"], [class*="stars"]',
        socialLinks: 'a[href*="twitter"], a[href*="linkedin"], a[href*="facebook"]',
        shareButtons: '[class*="share"], [class*="social"]',
        trustBadges: '[class*="trust"], [class*="certified"], [class*="badge"]'
      },
      
      // Footer Elements
      footer: {
        container: 'footer',
        links: 'footer a',
        copyright: '[class*="copyright"], footer p',
        newsletter: 'footer form, [class*="newsletter"]',
        socialIcons: 'footer [class*="social"]'
      },
      
      // Accessibility
      accessibility: {
        skipLinks: 'a[href^="#"][class*="skip"]',
        ariaLabels: '[aria-label]',
        ariaLive: '[aria-live]',
        focusableElements: 'a, button, input, select, textarea, [tabindex]',
        altTexts: 'img[alt]'
      },
      
      // Performance Indicators
      performance: {
        lazyImages: 'img[loading="lazy"]',
        asyncScripts: 'script[async], script[defer]',
        criticalCSS: 'style:not([media="print"])',
        preloads: 'link[rel="preload"], link[rel="prefetch"]'
      },
      
      // Cookie/Privacy
      privacy: {
        cookieBanner: '[class*="cookie"], [class*="privacy-banner"], [class*="consent"]',
        acceptButton: '[class*="accept"], [class*="agree"]',
        rejectButton: '[class*="reject"], [class*="decline"]',
        privacyLink: 'a[href*="privacy"]',
        cookieSettings: '[class*="cookie-settings"], [class*="preferences"]'
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
      // Check all matching buttons and return true if any are visible
      const buttons = await this.page.$$(this.selectors.nav.mobileMenuToggle);
      for (const button of buttons) {
        if (await button.isVisible()) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  
  async openMobileMenu() {
    // Find the visible mobile menu toggle button
    const buttons = await this.page.$$(this.selectors.nav.mobileMenuToggle);
    for (const button of buttons) {
      if (await button.isVisible()) {
        await button.click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
        return true;
      }
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
      // jace.ai uses a fixed positioned div for the mobile menu
      // Look for: fixed inset-y-0 right-0 z-50
      const mobileMenu = document.querySelector('div[class*="fixed"][class*="inset-y-0"], div[class*="fixed"][class*="right-0"]');
      
      if (mobileMenu) {
        // Check if it has navigation links
        const links = mobileMenu.querySelectorAll('a');
        const hasNavLinks = links.length >= 3; // Should have at least Features, Company, Pricing
        
        const styles = getComputedStyle(mobileMenu);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' &&
                         styles.opacity !== '0';
        
        return {
          found: true,
          isOpen: isVisible && hasNavLinks,
          classes: mobileMenu.className,
          display: styles.display,
          position: styles.position,
          visibility: styles.visibility,
          linkCount: links.length
        };
      }
      
      // Fallback: check for dialog role (some implementations use this)
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog && dialog.querySelector('nav')) {
        const styles = getComputedStyle(dialog);
        return {
          found: true,
          isOpen: styles.display !== 'none',
          classes: dialog.className,
          display: styles.display,
          position: styles.position,
          visibility: styles.visibility
        };
      }
      
      return { found: false, isOpen: false };
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
  
  // Get detailed element measurements
  async getElementMeasurements(selector) {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      
      return {
        dimensions: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        },
        spacing: {
          padding: styles.padding,
          paddingTop: styles.paddingTop,
          paddingRight: styles.paddingRight,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          margin: styles.margin,
          marginTop: styles.marginTop,
          marginRight: styles.marginRight,
          marginBottom: styles.marginBottom,
          marginLeft: styles.marginLeft
        },
        typography: {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          textTransform: styles.textTransform
        },
        appearance: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          border: styles.border,
          boxShadow: styles.boxShadow
        }
      };
    }, selector);
  }
  
  // Get all button styles and sizes
  async getButtonStyles() {
    return await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('a.btn, a[class*="button"], button'));
      
      return buttons.map(btn => {
        const rect = btn.getBoundingClientRect();
        const styles = getComputedStyle(btn);
        
        return {
          text: btn.textContent.trim(),
          selector: btn.className || btn.tagName.toLowerCase(),
          dimensions: {
            width: rect.width,
            height: rect.height
          },
          typography: {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            textTransform: styles.textTransform
          },
          spacing: {
            padding: styles.padding,
            paddingX: `${styles.paddingLeft} ${styles.paddingRight}`,
            paddingY: `${styles.paddingTop} ${styles.paddingBottom}`
          },
          appearance: {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderRadius: styles.borderRadius,
            border: styles.border,
            boxShadow: styles.boxShadow
          },
          hover: btn.matches(':hover') ? 'checking' : 'use DevTools'
        };
      });
    });
  }
  
  // Get comprehensive layout measurements
  async getLayoutMeasurements() {
    return await this.page.evaluate(() => {
      const measurements = {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        container: null,
        navigation: null,
        hero: null,
        sections: []
      };
      
      // Measure container
      const container = document.querySelector('.container, .max-w-7xl, [class*="container"]');
      if (container) {
        const rect = container.getBoundingClientRect();
        const styles = getComputedStyle(container);
        measurements.container = {
          width: rect.width,
          maxWidth: styles.maxWidth,
          padding: styles.padding,
          margin: styles.margin
        };
      }
      
      // Measure navigation
      const nav = document.querySelector('nav, header');
      if (nav) {
        const rect = nav.getBoundingClientRect();
        const styles = getComputedStyle(nav);
        measurements.navigation = {
          height: rect.height,
          padding: styles.padding,
          position: styles.position,
          backgroundColor: styles.backgroundColor
        };
      }
      
      // Measure hero section
      const hero = document.querySelector('h1')?.closest('section, div[class*="hero"], main > div');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const styles = getComputedStyle(hero);
        measurements.hero = {
          height: rect.height,
          padding: styles.padding,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom
        };
      }
      
      // Measure all sections
      const sections = document.querySelectorAll('section, main > div');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const styles = getComputedStyle(section);
        measurements.sections.push({
          index: index,
          height: rect.height,
          padding: styles.padding,
          margin: styles.margin,
          backgroundColor: styles.backgroundColor
        });
      });
      
      return measurements;
    });
  }
  
  // Get visual design elements
  async getVisualDesignElements() {
    return await this.page.evaluate((selectors) => {
      const elements = {
        gradients: document.querySelectorAll(selectors.design.gradients).length,
        animations: document.querySelectorAll(selectors.design.animations).length,
        cards: document.querySelectorAll(selectors.design.cards).length,
        iconCount: document.querySelectorAll(selectors.design.iconElements).length,
        hasVideoBackground: !!document.querySelector(selectors.design.videoBackground),
        hasBlurEffects: !!document.querySelector(selectors.design.blurEffects)
      };
      
      // Check for CSS animations
      const animatedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const styles = getComputedStyle(el);
        return styles.animation !== 'none' || styles.transition !== 'all 0s ease 0s';
      });
      
      elements.cssAnimations = animatedElements.length;
      
      return elements;
    }, this.selectors);
  }
  
  // Get spacing and rhythm
  async getSpacingRhythm() {
    return await this.page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const spacings = sections.map(section => {
        const styles = getComputedStyle(section);
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom
        };
      });
      
      // Get vertical rhythm
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
      const headingSpacings = headings.map(h => {
        const styles = getComputedStyle(h);
        return {
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          lineHeight: styles.lineHeight
        };
      });
      
      return {
        sectionSpacings: spacings,
        headingRhythm: headingSpacings,
        consistentSpacing: spacings.every(s => s.paddingTop === spacings[0].paddingTop)
      };
    });
  }
  
  // Get interactive elements state
  async getInteractiveElements() {
    return await this.page.evaluate((selectors) => {
      return {
        dropdowns: document.querySelectorAll(selectors.interactive.dropdowns).length,
        toggles: document.querySelectorAll(selectors.interactive.toggles).length,
        tooltips: document.querySelectorAll(selectors.interactive.tooltips).length,
        modals: document.querySelectorAll(selectors.interactive.modals).length,
        focusableElements: document.querySelectorAll(selectors.accessibility.focusableElements).length
      };
    }, this.selectors);
  }
  
  // Get accessibility metrics
  async getAccessibilityMetrics() {
    return await this.page.evaluate((selectors) => {
      const images = Array.from(document.querySelectorAll('img'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a'));
      
      return {
        imagesWithAlt: images.filter(img => img.hasAttribute('alt')).length,
        totalImages: images.length,
        buttonsWithAriaLabel: buttons.filter(btn => btn.hasAttribute('aria-label')).length,
        totalButtons: buttons.length,
        linksWithAriaLabel: links.filter(link => link.hasAttribute('aria-label')).length,
        skipLinks: document.querySelectorAll(selectors.accessibility.skipLinks).length,
        ariaLiveRegions: document.querySelectorAll(selectors.accessibility.ariaLive).length,
        focusableCount: document.querySelectorAll(selectors.accessibility.focusableElements).length
      };
    }, this.selectors);
  }
  
  // Get form elements
  async getFormElements() {
    return await this.page.evaluate((selectors) => {
      return {
        forms: document.querySelectorAll('form').length,
        inputs: document.querySelectorAll(selectors.forms.inputs).length,
        textareas: document.querySelectorAll(selectors.forms.textareas).length,
        selects: document.querySelectorAll(selectors.forms.selects).length,
        labels: document.querySelectorAll(selectors.forms.labels).length,
        hasValidation: document.querySelectorAll('[required], [pattern]').length > 0
      };
    }, this.selectors);
  }
  
  // Get performance indicators
  async getPerformanceIndicators() {
    return await this.page.evaluate((selectors) => {
      const images = Array.from(document.querySelectorAll('img'));
      const scripts = Array.from(document.querySelectorAll('script'));
      const links = Array.from(document.querySelectorAll('link'));
      
      return {
        lazyLoadedImages: images.filter(img => img.loading === 'lazy').length,
        totalImages: images.length,
        asyncScripts: scripts.filter(script => script.async || script.defer).length,
        totalScripts: scripts.length,
        preloadedResources: links.filter(link => link.rel === 'preload' || link.rel === 'prefetch').length,
        criticalStyles: document.querySelectorAll(selectors.performance.criticalCSS).length
      };
    }, this.selectors);
  }
  
  // Get cookie/privacy compliance
  async getCookieCompliance() {
    return await this.page.evaluate((selectors) => {
      const banner = document.querySelector(selectors.privacy.cookieBanner);
      const acceptBtn = document.querySelector(selectors.privacy.acceptButton);
      const rejectBtn = document.querySelector(selectors.privacy.rejectButton);
      const privacyLink = document.querySelector(selectors.privacy.privacyLink);
      
      return {
        hasCookieBanner: !!banner,
        hasAcceptButton: !!acceptBtn,
        hasRejectButton: !!rejectBtn,
        hasPrivacyLink: !!privacyLink,
        hasCookieSettings: !!document.querySelector(selectors.privacy.cookieSettings),
        bannerVisible: banner ? getComputedStyle(banner).display !== 'none' : false
      };
    }, this.selectors);
  }
  
  // Get responsive images
  async getResponsiveImages() {
    return await this.page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      
      return images.map(img => {
        const srcset = img.srcset;
        const sizes = img.sizes;
        
        return {
          src: img.src,
          hasSrcset: !!srcset,
          hasSizes: !!sizes,
          loading: img.loading,
          width: img.width,
          height: img.height,
          aspectRatio: img.width && img.height ? (img.width / img.height).toFixed(2) : null
        };
      });
    });
  }
  
  // Get micro-interactions
  async getMicroInteractions() {
    return await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a.btn'));
      const links = Array.from(document.querySelectorAll('a:not(.btn)'));
      
      const interactions = {
        hoverEffects: 0,
        transitions: 0,
        transforms: 0
      };
      
      [...buttons, ...links].forEach(el => {
        const styles = getComputedStyle(el);
        if (styles.transition !== 'all 0s ease 0s') interactions.transitions++;
        if (styles.transform !== 'none') interactions.transforms++;
        
        // Check :hover pseudo-class (requires special handling)
        el.classList.add('hover-check');
        const hoverStyles = getComputedStyle(el, ':hover');
        el.classList.remove('hover-check');
        
        if (hoverStyles.backgroundColor !== styles.backgroundColor ||
            hoverStyles.color !== styles.color ||
            hoverStyles.transform !== styles.transform) {
          interactions.hoverEffects++;
        }
      });
      
      return interactions;
    });
  }
  
  // Get text element sizes throughout the page
  async getTextElementSizes() {
    return await this.page.evaluate(() => {
      const textElements = {
        h1: [],
        h2: [],
        h3: [],
        p: [],
        links: []
      };
      
      // Helper to extract text metrics
      const getTextMetrics = (element) => {
        const styles = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        return {
          text: element.textContent.trim().substring(0, 50) + '...',
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          color: styles.color,
          width: rect.width,
          height: rect.height
        };
      };
      
      // Collect all text elements
      document.querySelectorAll('h1').forEach(el => {
        textElements.h1.push(getTextMetrics(el));
      });
      
      document.querySelectorAll('h2').forEach(el => {
        textElements.h2.push(getTextMetrics(el));
      });
      
      document.querySelectorAll('h3').forEach(el => {
        textElements.h3.push(getTextMetrics(el));
      });
      
      document.querySelectorAll('p').forEach(el => {
        if (el.textContent.trim()) {
          textElements.p.push(getTextMetrics(el));
        }
      });
      
      document.querySelectorAll('a:not(.btn):not([class*="button"])').forEach(el => {
        if (el.textContent.trim()) {
          textElements.links.push(getTextMetrics(el));
        }
      });
      
      return textElements;
    });
  }
  
  // Comprehensive parity check
  async getComprehensiveParityMetrics() {
    const metrics = {
      navigation: await this.getNavigationStructure(),
      hero: await this.getHeroContent(),
      colors: await this.getColorScheme(),
      buttons: await this.getButtonStyles(),
      layout: await this.getLayoutMeasurements(),
      typography: await this.getTextElementSizes(),
      visualDesign: await this.getVisualDesignElements(),
      spacing: await this.getSpacingRhythm(),
      interactive: await this.getInteractiveElements(),
      accessibility: await this.getAccessibilityMetrics(),
      performance: await this.getPerformanceIndicators(),
      cookieCompliance: await this.getCookieCompliance(),
      responsiveImages: await this.getResponsiveImages(),
      microInteractions: await this.getMicroInteractions()
    };
    
    return metrics;
  }
}

module.exports = JaceHomePage;