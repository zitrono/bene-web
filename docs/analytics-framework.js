/**
 * Comprehensive Analytics and Testing Framework for Ralph Website
 * 
 * This framework provides:
 * 1. Key metrics tracking by persona
 * 2. Regional performance monitoring
 * 3. Feature engagement analytics
 * 4. Content effectiveness measurement
 * 5. A/B testing capabilities
 * 6. User behavior tracking
 * 7. Conversion path analysis
 */

// Configuration
const ANALYTICS_CONFIG = {
    // Google Analytics 4
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
    
    // Microsoft Clarity
    CLARITY_PROJECT_ID: 'xxxxxxxxx', // Replace with actual Clarity ID
    
    // Custom events configuration
    EVENTS: {
        // Conversion events
        DEMO_REQUEST: 'demo_request',
        SUPERRETURN_MEETING: 'superreturn_meeting',
        NEWSLETTER_SIGNUP: 'newsletter_signup',
        EMAIL_CONTACT: 'email_contact',
        
        // Engagement events
        SCROLL_DEPTH: 'scroll_depth',
        SECTION_VIEW: 'section_view',
        FEATURE_INTERACTION: 'feature_interaction',
        SECURITY_FOCUS: 'security_focus',
        
        // Content interaction
        CTA_CLICK: 'cta_click',
        NAV_INTERACTION: 'nav_interaction',
        FORM_INTERACTION: 'form_interaction'
    },
    
    // Persona detection keywords
    PERSONAS: {
        PARTNER: ['partner', 'principal', 'managing director', 'investment committee'],
        OPERATIONS: ['operations', 'analyst', 'associate', 'due diligence'],
        IT_SECURITY: ['security', 'technology', 'it', 'infrastructure', 'compliance'],
        DECISION_MAKER: ['founder', 'ceo', 'cto', 'head of', 'director']
    },
    
    // Regional indicators
    REGIONS: {
        EUROPE: ['europe', 'berlin', 'london', 'paris', 'gdpr', 'eu'],
        NORTH_AMERICA: ['usa', 'america', 'new york', 'san francisco', 'california'],
        ASIA_PACIFIC: ['singapore', 'hong kong', 'tokyo', 'sydney', 'mas']
    }
};

// Analytics Framework Class
class AnalyticsFramework {
    constructor() {
        this.initialized = false;
        this.sessionData = {};
        this.abTestVariants = {};
        this.scrollDepthMilestones = [25, 50, 75, 90];
        this.scrollDepthReached = [];
        this.sectionViewTimes = {};
        this.conversionPath = [];
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize analytics platforms
            await this.initializeGA4();
            await this.initializeClarity();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize A/B testing
            this.initializeABTesting();
            
            // Start session tracking
            this.startSession();
            
            // Initialize user behavior tracking
            this.initializeUserBehaviorTracking();
            
            this.initialized = true;
            console.log('Analytics framework initialized successfully');
            
        } catch (error) {
            console.error('Analytics framework initialization failed:', error);
        }
    }
    
    // Google Analytics 4 Setup
    async initializeGA4() {
        // Load GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        // Configure GA4
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
            // Enhanced measurement
            send_page_view: true,
            allow_enhanced_conversions: true,
            
            // Custom dimensions
            custom_map: {
                'custom_1': 'persona',
                'custom_2': 'region',
                'custom_3': 'ab_variant',
                'custom_4': 'conversion_path'
            }
        });
        
        // Set up enhanced ecommerce for conversion tracking
        gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
            currency: 'USD',
            value: 0
        });
        
        window.gtag = gtag;
    }
    
    // Microsoft Clarity Setup
    async initializeClarity() {
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", ANALYTICS_CONFIG.CLARITY_PROJECT_ID);
    }
    
    // A/B Testing Initialization
    initializeABTesting() {
        // Hero messaging variants
        this.abTestVariants.hero_message = this.getABVariant('hero_message', [
            'autonomous_intelligence',
            'ai_native_approach',
            'transformative_technology'
        ]);
        
        // CTA variants
        this.abTestVariants.cta_primary = this.getABVariant('cta_primary', [
            'schedule_demo',
            'see_ralph_action',
            'transform_diligence'
        ]);
        
        // Security messaging prominence
        this.abTestVariants.security_prominence = this.getABVariant('security_prominence', [
            'high_prominence',
            'medium_prominence',
            'standard_prominence'
        ]);
        
        // Pricing transparency
        this.abTestVariants.pricing_transparency = this.getABVariant('pricing_transparency', [
            'full_transparency',
            'contact_pricing',
            'value_focused'
        ]);
        
        // Apply A/B test variants
        this.applyABTestVariants();
        
        // Track A/B test assignment
        this.trackEvent(ANALYTICS_CONFIG.EVENTS.SECTION_VIEW, {
            section: 'ab_test_assignment',
            variants: this.abTestVariants
        });
    }
    
    getABVariant(testName, variants) {
        // Check if user already has variant assigned
        const storageKey = `ab_test_${testName}`;
        let variant = localStorage.getItem(storageKey);
        
        if (!variant) {
            // Assign random variant
            variant = variants[Math.floor(Math.random() * variants.length)];
            localStorage.setItem(storageKey, variant);
        }
        
        return variant;
    }
    
    applyABTestVariants() {
        // Apply hero messaging variant
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && this.abTestVariants.hero_message) {
            switch (this.abTestVariants.hero_message) {
                case 'ai_native_approach':
                    heroTitle.textContent = 'AI-Native Approach to Private Equity Data Rooms';
                    break;
                case 'transformative_technology':
                    heroTitle.textContent = 'Transformative AI Technology for Due Diligence';
                    break;
                // Default: 'autonomous_intelligence' - keep original
            }
        }
        
        // Apply CTA variant
        const primaryCTA = document.querySelector('.cta-primary');
        if (primaryCTA && this.abTestVariants.cta_primary) {
            switch (this.abTestVariants.cta_primary) {
                case 'see_ralph_action':
                    primaryCTA.textContent = 'See Ralph in Action';
                    break;
                case 'transform_diligence':
                    primaryCTA.textContent = 'Transform Your Due Diligence';
                    break;
                // Default: 'schedule_demo' - keep original
            }
        }
        
        // Apply security prominence variant
        if (this.abTestVariants.security_prominence === 'high_prominence') {
            const securitySection = document.querySelector('#security');
            if (securitySection) {
                securitySection.style.order = '-1'; // Move security section higher
            }
        }
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Scroll depth tracking
        window.addEventListener('scroll', this.throttle(() => {
            this.trackScrollDepth();
        }, 250));
        
        // Section view tracking with Intersection Observer
        this.setupSectionViewTracking();
        
        // Click tracking
        document.addEventListener('click', (event) => {
            this.trackClick(event);
        });
        
        // Form interaction tracking
        document.addEventListener('focusin', (event) => {
            if (event.target.matches('input, textarea, select')) {
                this.trackFormInteraction(event);
            }
        });
        
        // Navigation interaction tracking
        document.addEventListener('click', (event) => {
            if (event.target.matches('.nav-link, .nav-toggle')) {
                this.trackNavigation(event);
            }
        });
        
        // Exit intent tracking
        document.addEventListener('mouseleave', (event) => {
            if (event.clientY <= 0) {
                this.trackExitIntent();
            }
        });
    }
    
    // Section View Tracking
    setupSectionViewTracking() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.trackSectionView(sectionId);
                    this.sectionViewTimes[sectionId] = Date.now();
                } else if (this.sectionViewTimes[entry.target.id]) {
                    // Calculate time spent in section
                    const timeSpent = Date.now() - this.sectionViewTimes[entry.target.id];
                    this.trackSectionEngagement(entry.target.id, timeSpent);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // Tracking Methods
    trackEvent(eventName, parameters = {}) {
        if (!this.initialized) return;
        
        // Add persona and region context
        const enrichedParams = {
            ...parameters,
            persona: this.detectPersona(),
            region: this.detectRegion(),
            ab_variants: this.abTestVariants,
            timestamp: Date.now(),
            page_path: window.location.pathname
        };
        
        // Send to GA4
        if (window.gtag) {
            gtag('event', eventName, enrichedParams);
        }
        
        // Send to Clarity
        if (window.clarity) {
            clarity('event', eventName, enrichedParams);
        }
        
        // Log for debugging
        console.log('Analytics Event:', eventName, enrichedParams);
        
        // Update conversion path
        this.updateConversionPath(eventName, enrichedParams);
    }
    
    trackScrollDepth() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        this.scrollDepthMilestones.forEach(milestone => {
            if (scrollPercent >= milestone && !this.scrollDepthReached.includes(milestone)) {
                this.scrollDepthReached.push(milestone);
                this.trackEvent(ANALYTICS_CONFIG.EVENTS.SCROLL_DEPTH, {
                    scroll_depth: milestone,
                    page_height: document.body.scrollHeight,
                    viewport_height: window.innerHeight
                });
            }
        });
    }
    
    trackSectionView(sectionId) {
        this.trackEvent(ANALYTICS_CONFIG.EVENTS.SECTION_VIEW, {
            section_id: sectionId,
            section_name: this.getSectionName(sectionId)
        });
    }
    
    trackSectionEngagement(sectionId, timeSpent) {
        this.trackEvent('section_engagement', {
            section_id: sectionId,
            time_spent: timeSpent,
            engagement_level: this.categorizeEngagement(timeSpent)
        });
    }
    
    trackClick(event) {
        const element = event.target;
        const elementType = this.getElementType(element);
        
        if (elementType) {
            this.trackEvent(ANALYTICS_CONFIG.EVENTS.CTA_CLICK, {
                element_type: elementType,
                element_text: element.textContent?.trim(),
                element_class: element.className,
                element_id: element.id,
                click_coordinates: {
                    x: event.clientX,
                    y: event.clientY
                }
            });
            
            // Special handling for conversion events
            if (element.matches('.cta-primary, .cta-secondary')) {
                this.trackConversion(element);
            }
        }
    }
    
    trackConversion(element) {
        const conversionType = this.getConversionType(element);
        
        this.trackEvent(conversionType, {
            conversion_value: this.getConversionValue(conversionType),
            conversion_path: this.conversionPath,
            session_duration: Date.now() - this.sessionData.startTime
        });
    }
    
    trackFormInteraction(event) {
        const formElement = event.target.closest('form');
        const formType = this.getFormType(formElement);
        
        this.trackEvent(ANALYTICS_CONFIG.EVENTS.FORM_INTERACTION, {
            form_type: formType,
            field_name: event.target.name,
            field_type: event.target.type,
            interaction_type: 'focus'
        });
    }
    
    trackNavigation(event) {
        this.trackEvent(ANALYTICS_CONFIG.EVENTS.NAV_INTERACTION, {
            nav_item: event.target.textContent?.trim(),
            nav_type: event.target.className.includes('nav-toggle') ? 'mobile_menu' : 'desktop_nav'
        });
    }
    
    trackExitIntent() {
        this.trackEvent('exit_intent', {
            time_on_page: Date.now() - this.sessionData.startTime,
            scroll_depth: Math.max(...this.scrollDepthReached),
            sections_viewed: Object.keys(this.sectionViewTimes).length
        });
    }
    
    // Persona Detection
    detectPersona() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const utmContent = urlParams.get('utm_content') || '';
        const utmCampaign = urlParams.get('utm_campaign') || '';
        
        // Check referrer
        const referrer = document.referrer.toLowerCase();
        
        // Combine all signals
        const signals = `${utmContent} ${utmCampaign} ${referrer}`.toLowerCase();
        
        for (const [persona, keywords] of Object.entries(ANALYTICS_CONFIG.PERSONAS)) {
            if (keywords.some(keyword => signals.includes(keyword))) {
                return persona.toLowerCase();
            }
        }
        
        return 'unknown';
    }
    
    // Region Detection
    detectRegion() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || '';
        const utmCampaign = urlParams.get('utm_campaign') || '';
        
        // Check browser language
        const language = navigator.language.toLowerCase();
        
        // Check timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Combine signals
        const signals = `${utmSource} ${utmCampaign} ${language} ${timezone}`.toLowerCase();
        
        for (const [region, indicators] of Object.entries(ANALYTICS_CONFIG.REGIONS)) {
            if (indicators.some(indicator => signals.includes(indicator))) {
                return region.toLowerCase();
            }
        }
        
        // Fallback to timezone-based detection
        if (timezone.includes('Europe')) return 'europe';
        if (timezone.includes('America')) return 'north_america';
        if (timezone.includes('Asia') || timezone.includes('Pacific')) return 'asia_pacific';
        
        return 'unknown';
    }
    
    // Helper Methods
    getSectionName(sectionId) {
        const sectionNames = {
            'hero': 'Hero Section',
            'about': 'Problem Statement',
            'features': 'Features',
            'security': 'Security',
            'benefits': 'Benefits',
            'demo': 'Demo Request',
            'superreturn': 'SuperReturn CTA',
            'contact': 'Contact'
        };
        
        return sectionNames[sectionId] || sectionId;
    }
    
    getElementType(element) {
        if (element.matches('.cta-primary')) return 'primary_cta';
        if (element.matches('.cta-secondary')) return 'secondary_cta';
        if (element.matches('.nav-link')) return 'navigation';
        if (element.matches('.feature-card')) return 'feature_card';
        if (element.matches('.security-feature')) return 'security_feature';
        if (element.matches('a[href^="mailto:"]')) return 'email_link';
        if (element.matches('a[href^="tel:"]')) return 'phone_link';
        if (element.matches('a[href^="http"]')) return 'external_link';
        
        return null;
    }
    
    getConversionType(element) {
        const text = element.textContent?.toLowerCase() || '';
        const href = element.href?.toLowerCase() || '';
        
        if (text.includes('demo') || text.includes('schedule')) {
            return ANALYTICS_CONFIG.EVENTS.DEMO_REQUEST;
        }
        if (text.includes('superreturn') || text.includes('meeting')) {
            return ANALYTICS_CONFIG.EVENTS.SUPERRETURN_MEETING;
        }
        if (text.includes('newsletter') || text.includes('mailing')) {
            return ANALYTICS_CONFIG.EVENTS.NEWSLETTER_SIGNUP;
        }
        if (href.includes('mailto:')) {
            return ANALYTICS_CONFIG.EVENTS.EMAIL_CONTACT;
        }
        
        return 'generic_conversion';
    }
    
    getConversionValue(conversionType) {
        const values = {
            [ANALYTICS_CONFIG.EVENTS.DEMO_REQUEST]: 100,
            [ANALYTICS_CONFIG.EVENTS.SUPERRETURN_MEETING]: 150,
            [ANALYTICS_CONFIG.EVENTS.EMAIL_CONTACT]: 50,
            [ANALYTICS_CONFIG.EVENTS.NEWSLETTER_SIGNUP]: 25
        };
        
        return values[conversionType] || 10;
    }
    
    getFormType(formElement) {
        if (!formElement) return 'unknown';
        
        if (formElement.classList.contains('newsletter-form')) return 'newsletter';
        if (formElement.classList.contains('demo-form')) return 'demo_request';
        if (formElement.classList.contains('contact-form')) return 'contact';
        
        return 'generic';
    }
    
    categorizeEngagement(timeSpent) {
        if (timeSpent < 3000) return 'low';
        if (timeSpent < 10000) return 'medium';
        if (timeSpent < 30000) return 'high';
        return 'very_high';
    }
    
    updateConversionPath(eventName, parameters) {
        this.conversionPath.push({
            event: eventName,
            timestamp: parameters.timestamp,
            section: parameters.section_id || parameters.element_type
        });
        
        // Keep only last 10 events
        if (this.conversionPath.length > 10) {
            this.conversionPath = this.conversionPath.slice(-10);
        }
    }
    
    startSession() {
        this.sessionData = {
            startTime: Date.now(),
            sessionId: this.generateSessionId(),
            persona: this.detectPersona(),
            region: this.detectRegion()
        };
        
        this.trackEvent('session_start', {
            session_id: this.sessionData.sessionId,
            referrer: document.referrer,
            utm_source: new URLSearchParams(window.location.search).get('utm_source'),
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        });
    }
    
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Utility method for throttling
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // User behavior tracking initialization
    initializeUserBehaviorTracking() {
        // Track mouse movement patterns
        this.trackMouseBehavior();
        
        // Track keyboard interactions
        this.trackKeyboardBehavior();
        
        // Track device and browser information
        this.trackDeviceInfo();
    }
    
    trackMouseBehavior() {
        let mouseTrail = [];
        
        document.addEventListener('mousemove', this.throttle((event) => {
            mouseTrail.push({
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now()
            });
            
            // Keep only last 10 points
            if (mouseTrail.length > 10) {
                mouseTrail = mouseTrail.slice(-10);
            }
        }, 100));
        
        // Track mouse dwell time on key elements
        const keyElements = document.querySelectorAll('.cta-primary, .cta-secondary, .feature-card, .security-feature');
        keyElements.forEach(element => {
            let dwellStart = null;
            
            element.addEventListener('mouseenter', () => {
                dwellStart = Date.now();
            });
            
            element.addEventListener('mouseleave', () => {
                if (dwellStart) {
                    const dwellTime = Date.now() - dwellStart;
                    this.trackEvent('element_dwell', {
                        element_type: this.getElementType(element),
                        dwell_time: dwellTime,
                        element_text: element.textContent?.trim()
                    });
                }
            });
        });
    }
    
    trackKeyboardBehavior() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.trackEvent('keyboard_navigation', {
                    navigation_type: 'tab',
                    active_element: document.activeElement.tagName
                });
            }
        });
    }
    
    trackDeviceInfo() {
        const deviceInfo = {
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            device_pixel_ratio: window.devicePixelRatio,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            connection_type: navigator.connection?.effectiveType || 'unknown'
        };
        
        this.trackEvent('device_info', deviceInfo);
    }
}

// Initialize analytics framework
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsFramework = new AnalyticsFramework();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsFramework;
}