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
      // Enhanced detection for jace.ai and other implementations
      const visible = await this.page.evaluate(() => {
        // Try specific selectors first
        const selectors = [
          'button[class*="mobile"]',
          'button[class*="menu"]', 
          'button[aria-label*="menu"]',
          'button[aria-label*="navigation"]',
          '.mobile-menu-toggle'
        ];
        
        let toggleButtons = [];
        
        for (const selector of selectors) {
          try {
            const buttons = Array.from(document.querySelectorAll(selector));
            toggleButtons = toggleButtons.concat(buttons);
          } catch (e) {
            // Continue if selector fails
          }
        }
        
        // If no specific selectors worked, check all buttons for menu-related content
        if (toggleButtons.length === 0) {
          const allButtons = Array.from(document.querySelectorAll('button'));
          
          // First priority: buttons with explicit menu text/aria
          let menuButtons = allButtons.filter(btn => {
            const text = btn.textContent.toLowerCase();
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            return text.includes('menu') || 
                   text.includes('navigation') ||
                   text.includes('nav') ||
                   ariaLabel.includes('menu') ||
                   ariaLabel.includes('navigation') ||
                   btn.querySelector('svg') && (text.includes('menu') || ariaLabel.includes('menu'));
          });
          
          // If we found explicit menu buttons, use those
          if (menuButtons.length > 0) {
            toggleButtons = menuButtons;
          } else {
            // Fallback: look for mobile-only buttons (but this might include false positives)
            toggleButtons = allButtons.filter(btn => {
              return btn.className.includes('md:hidden');
            });
          }
        }
        
        // Remove duplicates and check if any are visible
        toggleButtons = [...new Set(toggleButtons)];
        
        return toggleButtons.some(button => {
          const styles = getComputedStyle(button);
          return styles.display !== 'none' && styles.visibility !== 'hidden';
        });
      });
      
      return visible;
    } catch {
      return false;
    }
  }
  
  async openMobileMenu() {
    try {
      // Enhanced detection and clicking
      const success = await this.page.evaluate(() => {
        // Try specific selectors first
        const selectors = [
          '.mobile-menu-toggle', // Beneficious style
          'button[class*="mobile"]',
          'button[class*="menu"]', 
          'button[aria-label*="menu"]',
          'button[aria-label*="navigation"]'
        ];
        
        let toggleButtons = [];
        
        for (const selector of selectors) {
          try {
            const buttons = Array.from(document.querySelectorAll(selector));
            toggleButtons = toggleButtons.concat(buttons);
          } catch (e) {
            // Continue if selector fails
          }
        }
        
        // If no specific selectors worked, check all buttons for menu-related content
        if (toggleButtons.length === 0) {
          const allButtons = Array.from(document.querySelectorAll('button'));
          
          // First priority: buttons with explicit menu text/aria
          let menuButtons = allButtons.filter(btn => {
            const text = btn.textContent.toLowerCase();
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            return text.includes('menu') || 
                   text.includes('navigation') ||
                   text.includes('nav') ||
                   ariaLabel.includes('menu') ||
                   ariaLabel.includes('navigation') ||
                   btn.querySelector('svg') && (text.includes('menu') || ariaLabel.includes('menu'));
          });
          
          // If we found explicit menu buttons, use those
          if (menuButtons.length > 0) {
            toggleButtons = menuButtons;
          } else {
            // Fallback: look for mobile-only buttons (but this might include false positives)
            toggleButtons = allButtons.filter(btn => {
              return btn.className.includes('md:hidden');
            });
          }
        }
        
        // Remove duplicates and find first visible button
        toggleButtons = [...new Set(toggleButtons)];
        
        for (const button of toggleButtons) {
          const styles = getComputedStyle(button);
          if (styles.display !== 'none' && styles.visibility !== 'hidden') {
            button.click();
            return true;
          }
        }
        
        return false;
      });
      
      if (success) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Error opening mobile menu:', error);
      return false;
    }
  }
  
  async closeMobileMenu() {
    // Try Beneficious-style close button first
    try {
      const beneficiousClose = await this.page.$('.mobile-menu-close');
      if (beneficiousClose && await beneficiousClose.isVisible()) {
        await beneficiousClose.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
    } catch (error) {
      console.log('Beneficious close button not found');
    }
    
    // Try Beneficious toggle button (for toggle behavior)
    try {
      const beneficiousToggle = await this.page.$('.mobile-menu-toggle');
      if (beneficiousToggle && await beneficiousToggle.isVisible()) {
        await beneficiousToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
    } catch (error) {
      console.log('Beneficious toggle button not found');
    }
    
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
      // Check for Beneficious-style mobile menu first (.nav-menu.active)
      const beneficiousMenu = document.querySelector('.nav-menu.active');
      if (beneficiousMenu) {
        const links = beneficiousMenu.querySelectorAll('a');
        const styles = getComputedStyle(beneficiousMenu);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' &&
                         styles.opacity !== '0';
        
        return {
          found: true,
          isOpen: isVisible && links.length >= 3,
          classes: beneficiousMenu.className,
          display: styles.display,
          position: styles.position,
          visibility: styles.visibility,
          linkCount: links.length,
          type: 'beneficious'
        };
      }
      
      // Check for any nav menu with active class
      const activeMenu = document.querySelector('nav ul.active, nav .nav-menu.active');
      if (activeMenu) {
        const links = activeMenu.querySelectorAll('a');
        const styles = getComputedStyle(activeMenu);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' &&
                         styles.opacity !== '0';
        
        return {
          found: true,
          isOpen: isVisible && links.length >= 3,
          classes: activeMenu.className,
          display: styles.display,
          position: styles.position,
          visibility: styles.visibility,
          linkCount: links.length,
          type: 'generic-active'
        };
      }
      
      // jace.ai specific: Check for slide-out menu panel (appears after clicking toggle)
      // The actual menu is "fixed inset-y-0 right-0 z-50" with multiple links
      const jaceMenu = document.querySelector('div[class*="fixed inset-y-0 right-0"], div[class*="fixed"][class*="right-0"][class*="inset-y-0"]');
      
      if (jaceMenu) {
        const links = jaceMenu.querySelectorAll('a');
        const styles = getComputedStyle(jaceMenu);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' &&
                         styles.opacity !== '0';
        
        // jace.ai menu has 6+ links when open
        const hasNavLinks = links.length >= 3;
        
        return {
          found: true,
          isOpen: isVisible && hasNavLinks,
          classes: jaceMenu.className,
          display: styles.display,
          position: styles.position,
          visibility: styles.visibility,
          linkCount: links.length,
          type: 'jace-slideout'
        };
      }
      
      // Fallback: jace.ai uses a fixed positioned div for the mobile menu
      // Look for any fixed element with multiple navigation links
      const allFixedElements = Array.from(document.querySelectorAll('div[class*="fixed"]'));
      
      for (const element of allFixedElements) {
        const links = element.querySelectorAll('a');
        const styles = getComputedStyle(element);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' &&
                         styles.opacity !== '0';
        
        // If this fixed element has many links and is visible, it's likely the menu
        if (isVisible && links.length >= 5) {
          return {
            found: true,
            isOpen: true,
            classes: element.className,
            display: styles.display,
            position: styles.position,
            visibility: styles.visibility,
            linkCount: links.length,
            type: 'jace-fixed-multi-link'
          };
        }
      }
      
      // Original jace.ai fallback: Look for: fixed inset-y-0 right-0 z-50
      const mobileMenu = document.querySelector('div[class*="fixed"][class*="inset-y-0"], div[class*="fixed"][class*="right-0"]');
      
      if (mobileMenu) {
        // Check if it has navigation links
        const links = mobileMenu.querySelectorAll('a');
        const hasNavLinks = links.length >= 3;
        
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
          linkCount: links.length,
          type: 'jace-original'
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
          visibility: styles.visibility,
          type: 'dialog'
        };
      }
      
      return { found: false, isOpen: false };
    });
  }

  // Comprehensive Mobile Menu Analysis Methods
  async getMobileMenuToggleDetails() {
    return await this.page.evaluate(() => {
      // Enhanced selectors for jace.ai and other implementations
      const selectors = [
        'button[class*="mobile"]',
        'button[class*="menu"]', 
        'button[aria-label*="menu"]',
        'button[aria-label*="navigation"]',
        '.mobile-menu-toggle',
        // jace.ai specific: button with "Open main menu" text
        'button:has-text("Open main menu")',
        // Fallback: buttons with menu-related text content
        'button'
      ];
      
      let toggleButtons = [];
      
      // Try specific selectors first
      for (const selector of selectors.slice(0, -1)) {
        try {
          const buttons = Array.from(document.querySelectorAll(selector));
          toggleButtons = toggleButtons.concat(buttons);
        } catch (e) {
          // Selector might not be supported, continue
        }
      }
      
      // If no specific selectors worked, check all buttons for menu-related content
      if (toggleButtons.length === 0) {
        const allButtons = Array.from(document.querySelectorAll('button'));
        
        // First priority: buttons with explicit menu text/aria
        let menuButtons = allButtons.filter(btn => {
          const text = btn.textContent.toLowerCase();
          const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
          return text.includes('menu') || 
                 text.includes('navigation') ||
                 text.includes('nav') ||
                 ariaLabel.includes('menu') ||
                 ariaLabel.includes('navigation') ||
                 btn.querySelector('svg') && (text.includes('menu') || ariaLabel.includes('menu'));
        });
        
        // If we found explicit menu buttons, use those
        if (menuButtons.length > 0) {
          toggleButtons = menuButtons;
        } else {
          // Fallback: look for mobile-only buttons (but this might include false positives)
          toggleButtons = allButtons.filter(btn => {
            return btn.querySelector('svg[class*="hamburger"]') ||
                   btn.className.includes('md:hidden');
          });
        }
      }
      
      // Remove duplicates
      toggleButtons = [...new Set(toggleButtons)];
      
      return toggleButtons.map(button => {
        const styles = getComputedStyle(button);
        const rect = button.getBoundingClientRect();
        
        return {
          selector: button.className || button.tagName.toLowerCase(),
          ariaLabel: button.getAttribute('aria-label'),
          visible: styles.display !== 'none' && styles.visibility !== 'hidden',
          position: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          },
          styles: {
            display: styles.display,
            position: styles.position,
            zIndex: styles.zIndex,
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            padding: styles.padding
          },
          content: button.innerHTML,
          hasIcon: !!(button.querySelector('svg') || button.querySelector('span[class*="icon"]')),
          isClickable: !button.disabled && styles.pointerEvents !== 'none'
        };
      });
    });
  }

  async getMobileMenuStructure() {
    return await this.page.evaluate(() => {
      // Find all possible mobile menu containers
      const menuContainers = Array.from(document.querySelectorAll(
        '.nav-menu, [class*="mobile"][class*="menu"], [class*="drawer"], [role="dialog"], div[class*="fixed"][class*="inset"]'
      ));
      
      return menuContainers.map(container => {
        const styles = getComputedStyle(container);
        const rect = container.getBoundingClientRect();
        const links = Array.from(container.querySelectorAll('a'));
        const buttons = Array.from(container.querySelectorAll('button'));
        
        return {
          selector: container.className || container.tagName.toLowerCase(),
          role: container.getAttribute('role'),
          visible: styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0',
          dimensions: {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
          },
          styles: {
            position: styles.position,
            zIndex: styles.zIndex,
            backgroundColor: styles.backgroundColor,
            transform: styles.transform,
            transition: styles.transition,
            opacity: styles.opacity
          },
          navigation: {
            linkCount: links.length,
            links: links.map(link => ({
              text: link.textContent.trim(),
              href: link.href,
              classes: link.className,
              isButton: link.classList.toString().includes('btn')
            })),
            buttonCount: buttons.length,
            buttons: buttons.map(btn => ({
              text: btn.textContent.trim(),
              classes: btn.className,
              ariaLabel: btn.getAttribute('aria-label')
            }))
          },
          hasCloseButton: !!(container.querySelector('[class*="close"]') || container.querySelector('[aria-label*="close"]')),
          hasBackdrop: !!(container.previousElementSibling && container.previousElementSibling.classList.toString().includes('backdrop'))
        };
      });
    });
  }

  async getMobileMenuAnimationDetails() {
    return await this.page.evaluate(() => {
      const menuElements = Array.from(document.querySelectorAll(
        '.nav-menu, [class*="mobile"][class*="menu"], [class*="drawer"], div[class*="fixed"][class*="inset"]'
      ));
      
      return menuElements.map(element => {
        const styles = getComputedStyle(element);
        
        return {
          selector: element.className || element.tagName.toLowerCase(),
          animations: {
            transition: styles.transition,
            transitionDuration: styles.transitionDuration,
            transitionTimingFunction: styles.transitionTimingFunction,
            transitionProperty: styles.transitionProperty,
            transform: styles.transform,
            animation: styles.animation,
            animationDuration: styles.animationDuration
          },
          visibility: {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            overflow: styles.overflow
          },
          positioning: {
            position: styles.position,
            top: styles.top,
            right: styles.right,
            bottom: styles.bottom,
            left: styles.left,
            zIndex: styles.zIndex
          }
        };
      });
    });
  }

  async getMobileMenuAccessibility() {
    return await this.page.evaluate(() => {
      const menuElements = Array.from(document.querySelectorAll(
        '.nav-menu, [class*="mobile"][class*="menu"], [class*="drawer"], div[class*="fixed"][class*="inset"]'
      ));
      
      // Find toggle buttons using enhanced detection
      let toggleButtons = [];
      
      const selectors = [
        'button[class*="mobile"]',
        'button[class*="menu"]', 
        'button[aria-label*="menu"]',
        'button[aria-label*="navigation"]',
        '.mobile-menu-toggle'
      ];
      
      for (const selector of selectors) {
        try {
          const buttons = Array.from(document.querySelectorAll(selector));
          toggleButtons = toggleButtons.concat(buttons);
        } catch (e) {
          // Continue if selector fails
        }
      }
      
      // If no specific selectors worked, check all buttons for menu-related content
      if (toggleButtons.length === 0) {
        const allButtons = Array.from(document.querySelectorAll('button'));
        toggleButtons = allButtons.filter(btn => {
          const text = btn.textContent.toLowerCase();
          const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
          return text.includes('menu') || 
                 text.includes('navigation') ||
                 text.includes('nav') ||
                 ariaLabel.includes('menu') ||
                 ariaLabel.includes('navigation') ||
                 btn.className.includes('md:hidden');
        });
      }
      
      // Remove duplicates
      toggleButtons = [...new Set(toggleButtons)];
      
      return {
        menuContainers: menuElements.map(element => ({
          selector: element.className || element.tagName.toLowerCase(),
          accessibility: {
            role: element.getAttribute('role'),
            ariaLabel: element.getAttribute('aria-label'),
            ariaLabelledBy: element.getAttribute('aria-labelledby'),
            ariaHidden: element.getAttribute('aria-hidden'),
            tabIndex: element.getAttribute('tabindex'),
            hasKeyboardFocus: element === document.activeElement
          },
          focusableElements: Array.from(element.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')).length,
          hasSkipLinks: !!element.querySelector('[class*="skip"], [href="#main"]'),
          hasProperHeadings: !!element.querySelector('h1, h2, h3, h4, h5, h6')
        })),
        toggleButtons: toggleButtons.map(button => ({
          selector: button.className || button.tagName.toLowerCase(),
          accessibility: {
            ariaLabel: button.getAttribute('aria-label'),
            ariaExpanded: button.getAttribute('aria-expanded'),
            ariaControls: button.getAttribute('aria-controls'),
            ariaHaspopup: button.getAttribute('aria-haspopup'),
            role: button.getAttribute('role'),
            tabIndex: button.getAttribute('tabindex')
          },
          hasKeyboardSupport: true, // buttons inherently support keyboard
          hasProperLabeling: !!(button.getAttribute('aria-label') || button.textContent.trim()),
          visuallyHidden: getComputedStyle(button).clip === 'rect(0px, 0px, 0px, 0px)'
        }))
      };
    });
  }

  async getMobileMenuInteractionFlow() {
    return await this.page.evaluate(() => {
      const result = {
        toggleButtons: [],
        closeButtons: [],
        menuContainers: [],
        backdrop: null,
        interactions: []
      };
      
      // Find toggle buttons using enhanced detection
      let toggles = [];
      
      // Try specific selectors first
      const selectors = [
        'button[class*="mobile"]',
        'button[class*="menu"]', 
        'button[aria-label*="menu"]',
        'button[aria-label*="navigation"]',
        '.mobile-menu-toggle'
      ];
      
      for (const selector of selectors) {
        try {
          const buttons = Array.from(document.querySelectorAll(selector));
          toggles = toggles.concat(buttons);
        } catch (e) {
          // Continue if selector fails
        }
      }
      
      // If no specific selectors worked, check all buttons for menu-related content
      if (toggles.length === 0) {
        const allButtons = Array.from(document.querySelectorAll('button'));
        toggles = allButtons.filter(btn => {
          const text = btn.textContent.toLowerCase();
          const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
          return text.includes('menu') || 
                 text.includes('navigation') ||
                 text.includes('nav') ||
                 ariaLabel.includes('menu') ||
                 ariaLabel.includes('navigation') ||
                 btn.className.includes('md:hidden');
        });
      }
      
      // Remove duplicates
      toggles = [...new Set(toggles)];
      
      result.toggleButtons = toggles.map(button => ({
        element: button.className || button.tagName.toLowerCase(),
        ariaLabel: button.getAttribute('aria-label'),
        ariaExpanded: button.getAttribute('aria-expanded'),
        ariaControls: button.getAttribute('aria-controls'),
        visible: getComputedStyle(button).display !== 'none',
        clickable: !button.disabled
      }));
      
      // Find close buttons
      const closeButtons = Array.from(document.querySelectorAll(
        '.mobile-menu-close, button[class*="close"], button[aria-label*="close"]'
      ));
      
      result.closeButtons = closeButtons.map(button => ({
        element: button.className || button.tagName.toLowerCase(),
        ariaLabel: button.getAttribute('aria-label'),
        visible: getComputedStyle(button).display !== 'none',
        inMenu: !!button.closest('.nav-menu, [class*="mobile"][class*="menu"]')
      }));
      
      // Find menu containers
      const menus = Array.from(document.querySelectorAll(
        '.nav-menu, [class*="mobile"][class*="menu"], [class*="drawer"], div[class*="fixed"][class*="inset"]'
      ));
      
      result.menuContainers = menus.map(menu => ({
        element: menu.className || menu.tagName.toLowerCase(),
        isOpen: menu.classList.contains('active') || getComputedStyle(menu).display !== 'none',
        hasNavigationLinks: menu.querySelectorAll('a').length >= 3,
        hasCloseButton: !!menu.querySelector('.mobile-menu-close, button[class*="close"]'),
        outsideClickClosing: menu.getAttribute('data-outside-click') !== 'false'
      }));
      
      // Check for backdrop
      const backdrop = document.querySelector('[class*="backdrop"], [class*="overlay"]');
      if (backdrop) {
        result.backdrop = {
          element: backdrop.className || backdrop.tagName.toLowerCase(),
          visible: getComputedStyle(backdrop).display !== 'none',
          clickable: getComputedStyle(backdrop).pointerEvents !== 'none'
        };
      }
      
      return result;
    });
  }

  async testMobileMenuKeyboardNavigation() {
    const results = [];
    
    try {
      // Test Tab navigation to menu toggle - try up to 10 tabs
      let foundToggle = false;
      let focusedElement;
      
      for (let i = 0; i < 10; i++) {
        await this.page.keyboard.press('Tab');
        await new Promise(resolve => setTimeout(resolve, 100));
        
        focusedElement = await this.page.evaluate(() => {
          const focused = document.activeElement;
          return {
            tagName: focused.tagName,
            className: focused.className,
            ariaLabel: focused.getAttribute('aria-label'),
            isMobileToggle: focused.classList.toString().includes('mobile') && 
                           focused.classList.toString().includes('toggle') ||
                           (focused.getAttribute('aria-label') && 
                            focused.getAttribute('aria-label').toLowerCase().includes('menu'))
          };
        });
        
        if (focusedElement.isMobileToggle) {
          foundToggle = true;
          break;
        }
      }
      
      results.push({
        test: 'Tab to mobile toggle',
        passed: foundToggle,
        details: focusedElement
      });
      
      // Test Enter key to open menu
      if (foundToggle && focusedElement.isMobileToggle) {
        await this.page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const menuState = await this.getMobileMenuState();
        results.push({
          test: 'Enter key opens menu',
          passed: menuState.isOpen,
          details: menuState
        });
        
        // Test Escape key to close menu
        if (menuState.isOpen) {
          await this.page.keyboard.press('Escape');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const closedState = await this.getMobileMenuState();
          results.push({
            test: 'Escape key closes menu',
            passed: !closedState.isOpen,
            details: closedState
          });
        }
      }
      
    } catch (error) {
      results.push({
        test: 'Keyboard navigation test',
        passed: false,
        error: error.message
      });
    }
    
    return results;
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
      microInteractions: await this.getMicroInteractions(),
      
      // Enhanced detailed metrics
      gradients: await this.getGradientAnalysis(),
      animationDetails: await this.getAnimationAnalysis(),
      colorPalette: await this.getColorPalette(),
      fontAnalysis: await this.getFontAnalysis(),
      semantics: await this.getSemanticAnalysis()
    };
    
    return metrics;
  }
  
  // Get detailed gradient analysis
  async getGradientAnalysis() {
    return await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const gradients = {
        backgrounds: [],
        texts: [],
        shadows: []
      };
      
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        
        // Background gradients
        if (styles.backgroundImage && styles.backgroundImage.includes('gradient')) {
          gradients.backgrounds.push({
            selector: el.className || el.tagName.toLowerCase(),
            gradient: styles.backgroundImage,
            element: el.tagName
          });
        }
        
        // Text gradients
        if (styles.webkitBackgroundClip === 'text' || styles.backgroundClip === 'text') {
          gradients.texts.push({
            selector: el.className || el.tagName.toLowerCase(),
            gradient: styles.backgroundImage
          });
        }
        
        // Box shadows with color
        if (styles.boxShadow && styles.boxShadow !== 'none') {
          gradients.shadows.push({
            selector: el.className || el.tagName.toLowerCase(),
            shadow: styles.boxShadow
          });
        }
      });
      
      return gradients;
    });
  }
  
  // Get detailed animation analysis
  async getAnimationAnalysis() {
    return await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const animations = {
        cssAnimations: [],
        transitions: [],
        transforms: []
      };
      
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        
        if (styles.animation && styles.animation !== 'none') {
          animations.cssAnimations.push({
            selector: el.className || el.tagName.toLowerCase(),
            animation: styles.animation,
            duration: styles.animationDuration
          });
        }
        
        if (styles.transition && styles.transition !== 'all 0s ease 0s') {
          animations.transitions.push({
            selector: el.className || el.tagName.toLowerCase(),
            transition: styles.transition,
            duration: styles.transitionDuration
          });
        }
        
        if (styles.transform && styles.transform !== 'none') {
          animations.transforms.push({
            selector: el.className || el.tagName.toLowerCase(),
            transform: styles.transform
          });
        }
      });
      
      return animations;
    });
  }
  
  // Get detailed color palette
  async getColorPalette() {
    return await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const colors = {
        backgrounds: new Set(),
        texts: new Set(),
        borders: new Set(),
        primary: [],
        accent: []
      };
      
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.backgrounds.add(styles.backgroundColor);
        }
        
        if (styles.color) {
          colors.texts.add(styles.color);
        }
        
        if (styles.borderColor && styles.borderColor !== 'rgba(0, 0, 0, 0)') {
          colors.borders.add(styles.borderColor);
        }
        
        // Detect primary/accent colors
        if (el.classList.contains('btn-primary')) {
          colors.primary.push({
            background: styles.backgroundColor,
            text: styles.color
          });
        }
        
        if (styles.backgroundColor?.includes('255, 220, 97')) {
          colors.accent.push({
            element: el.className,
            color: styles.backgroundColor
          });
        }
      });
      
      // Get CSS variables
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars = {};
      
      ['--bg-', '--text-', '--border-', '--accent-'].forEach(prefix => {
        for (let i = 0; i < rootStyles.length; i++) {
          const prop = rootStyles[i];
          if (prop.startsWith(prefix)) {
            cssVars[prop] = rootStyles.getPropertyValue(prop);
          }
        }
      });
      
      return {
        backgrounds: Array.from(colors.backgrounds),
        texts: Array.from(colors.texts),
        borders: Array.from(colors.borders),
        primary: colors.primary,
        accent: colors.accent,
        cssVariables: cssVars,
        totalUniqueColors: colors.backgrounds.size + colors.texts.size + colors.borders.size
      };
    });
  }
  
  // Get detailed font analysis
  async getFontAnalysis() {
    return await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const fonts = {
        families: new Set(),
        sizes: new Map(),
        weights: new Map(),
        lineHeights: new Map()
      };
      
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const text = el.textContent?.trim();
        
        if (text && text.length > 0 && el.children.length === 0) {
          fonts.families.add(styles.fontFamily);
          
          const size = styles.fontSize;
          fonts.sizes.set(size, (fonts.sizes.get(size) || 0) + 1);
          
          const weight = styles.fontWeight;
          fonts.weights.set(weight, (fonts.weights.get(weight) || 0) + 1);
          
          const lineHeight = styles.lineHeight;
          fonts.lineHeights.set(lineHeight, (fonts.lineHeights.get(lineHeight) || 0) + 1);
        }
      });
      
      return {
        families: Array.from(fonts.families),
        sizes: Object.fromEntries(fonts.sizes),
        weights: Object.fromEntries(fonts.weights),
        lineHeights: Object.fromEntries(fonts.lineHeights),
        totalVariations: fonts.sizes.size + fonts.weights.size
      };
    });
  }
  
  // Get semantic HTML analysis
  async getSemanticAnalysis() {
    return await this.page.evaluate(() => {
      const semanticTags = [
        'header', 'nav', 'main', 'article', 'section', 'aside', 
        'footer', 'figure', 'time', 'mark'
      ];
      
      const results = {};
      
      semanticTags.forEach(tag => {
        const elements = document.querySelectorAll(tag);
        if (elements.length > 0) {
          results[tag] = {
            count: elements.length,
            examples: Array.from(elements).slice(0, 2).map(el => ({
              class: el.className,
              role: el.getAttribute('role')
            }))
          };
        }
      });
      
      // Heading hierarchy
      const headings = [];
      for (let i = 1; i <= 6; i++) {
        const h = document.querySelectorAll(`h${i}`);
        if (h.length > 0) {
          headings.push({
            level: i,
            count: h.length,
            texts: Array.from(h).map(el => el.textContent.trim().substring(0, 30))
          });
        }
      }
      
      return {
        semanticElements: results,
        headingHierarchy: headings
      };
    });
  }
}

module.exports = JaceHomePage;