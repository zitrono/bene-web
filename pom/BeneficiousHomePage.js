const puppeteer = require('puppeteer');

class BeneficiousHomePage {
  constructor(page) {
    this.page = page;
    this.url = 'http://localhost:8080'; // Local development server
    
    // Define selectors for Beneficious site
    this.selectors = {
      // Navigation
      nav: {
        container: 'nav',
        logo: 'a[href="/"]',
        menuItems: 'nav a:not([href="/"])',
        mobileMenuToggle: '.nav-toggle',
        mobileMenuClose: '.nav-toggle'
      },
      
      // Hero Section
      hero: {
        container: '.hero',
        headline: 'h1',
        subheadline: '.hero p',
        ctaButton: '.hero .btn-primary',
        userCount: '.hero .user-count',
        videoPlaceholder: '.hero .video-container'
      },
      
      // Features Section
      features: {
        container: '.features',
        headline: '.features h2',
        featureCards: '.feature-card'
      },
      
      // Pricing Section
      pricing: {
        container: '.pricing',
        headline: '.pricing h2',
        toggle: '.pricing-toggle',
        priceCard: '.price-card'
      },
      
      // Testimonials
      testimonials: {
        container: '.testimonials',
        headline: '.testimonials h2',
        testimonialCards: '.testimonial-card'
      },
      
      // Footer
      footer: {
        container: 'footer',
        links: 'footer a',
        copyright: 'footer .copyright'
      },
      
      // Design Elements
      design: {
        gradients: '[class*="gradient"], [style*="gradient"]',
        blurEffects: '[class*="blur"], [style*="blur"]',
        animations: '[class*="animate"], [data-aos]',
        iconElements: 'svg, [class*="icon"]',
        cards: '.card, .feature-card, .price-card, .testimonial-card'
      },
      
      // Interactive Elements
      interactive: {
        buttons: 'button, .btn',
        dropdowns: '[class*="dropdown"], select',
        toggles: '[class*="toggle"], [class*="switch"]',
        tooltips: '[data-tooltip], [title]',
        modals: '[class*="modal"], [role="dialog"]'
      },
      
      // Layout Components
      layout: {
        containers: '.container, [class*="container"]',
        sections: 'section',
        flexContainers: '[class*="flex"]',
        gridContainers: '[class*="grid"]'
      },
      
      // Typography Elements
      typography: {
        headings: 'h1, h2, h3, h4, h5, h6',
        paragraphs: 'p',
        links: 'a',
        emphasis: 'strong, em, b, i'
      },
      
      // Forms and Inputs
      forms: {
        forms: 'form',
        inputs: 'input[type="text"], input[type="email"]',
        textareas: 'textarea',
        labels: 'label',
        buttons: 'input[type="submit"], button[type="submit"]'
      },
      
      // Accessibility
      accessibility: {
        skipLinks: 'a[href^="#"][class*="skip"]',
        ariaLabels: '[aria-label]',
        ariaLive: '[aria-live]',
        focusableElements: 'a, button, input, select, textarea, [tabindex]',
        altTexts: 'img[alt]'
      },
      
      // Performance
      performance: {
        lazyImages: 'img[loading="lazy"]',
        asyncScripts: 'script[async], script[defer]',
        preloads: 'link[rel="preload"], link[rel="prefetch"]'
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
      
      const links = Array.from(nav.querySelectorAll('a')).filter(link => {
        return !link.querySelector('img') && !link.classList.contains('logo');
      });
      
      return {
        exists: true,
        logo: !!nav.querySelector(selectors.nav.logo),
        links: links.map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          isButton: link.classList.toString().includes('btn') || 
                   link.classList.toString().includes('button')
        }))
      };
    }, this.selectors);
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
  
  // Color and Style Methods
  async getColorScheme() {
    return await this.page.evaluate(() => {
      const body = document.body;
      const nav = document.querySelector('nav');
      const hero = document.querySelector('.hero, section');
      
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
  
  // Get comprehensive metrics (implementing same interface as JaceHomePage)
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
        
        if (styles.backgroundColor?.includes('255, 220, 97') || 
            styles.backgroundColor?.includes('#ffdc61')) {
          colors.accent.push({
            element: el.className,
            color: styles.backgroundColor
          });
        }
      });
      
      // Get CSS variables
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars = {};
      
      ['--bg-', '--text-', '--border-', '--accent-', '--primary-', '--secondary-'].forEach(prefix => {
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
  
  // Additional methods to match JaceHomePage interface
  async getButtonStyles() {
    return await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, .btn, a[class*="btn"]'));
      
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
          }
        };
      });
    });
  }
  
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
      const container = document.querySelector('.container, [class*="container"]');
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
      const hero = document.querySelector('.hero, section:first-of-type');
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
      const sections = document.querySelectorAll('section');
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
  
  async getTextElementSizes() {
    return await this.page.evaluate(() => {
      const textElements = {
        h1: [],
        h2: [],
        h3: [],
        p: [],
        links: []
      };
      
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
  
  async getVisualDesignElements() {
    return await this.page.evaluate((selectors) => {
      const elements = {
        gradients: document.querySelectorAll(selectors.design.gradients).length,
        animations: document.querySelectorAll(selectors.design.animations).length,
        cards: document.querySelectorAll(selectors.design.cards).length,
        iconCount: document.querySelectorAll(selectors.design.iconElements).length,
        hasVideoBackground: false,
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
        consistentSpacing: spacings.every(s => s.paddingTop === spacings[0]?.paddingTop)
      };
    });
  }
  
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
        criticalStyles: document.querySelectorAll('style').length
      };
    }, this.selectors);
  }
  
  async getCookieCompliance() {
    return await this.page.evaluate(() => {
      const banner = document.querySelector('.cookie-banner, [class*="cookie"], [class*="consent"]');
      const acceptBtn = document.querySelector('.cookie-accept, [class*="accept"]');
      const rejectBtn = document.querySelector('.cookie-reject, [class*="reject"]');
      const privacyLink = document.querySelector('a[href*="privacy"]');
      
      return {
        hasCookieBanner: !!banner,
        hasAcceptButton: !!acceptBtn,
        hasRejectButton: !!rejectBtn,
        hasPrivacyLink: !!privacyLink,
        hasCookieSettings: false,
        bannerVisible: banner ? getComputedStyle(banner).display !== 'none' : false
      };
    });
  }
  
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
  
  async getMicroInteractions() {
    return await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, .btn'));
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
      });
      
      return interactions;
    });
  }
}

module.exports = BeneficiousHomePage;