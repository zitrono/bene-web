/**
 * Ralph Website JavaScript
 * Handles interactive elements, form submissions, and mobile navigation
 * This file provides enhanced user experience while maintaining GitHub Pages compatibility
 * Optimized for performance and Core Web Vitals
 */

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            console.log('CLS:', entry.value);
        }
    }
});

// Observe Web Vitals
if ('PerformanceObserver' in window) {
    try {
        perfObserver.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
    } catch (e) {
        // Fallback for older browsers
        console.log('Performance Observer not fully supported');
    }
}

// Optimize loading sequence
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    // DOM already loaded
    initializeWebsite();
}

/**
 * Main initialization function that sets up all website functionality
 * This approach ensures all DOM elements are available before binding events
 * Optimized for performance with requestIdleCallback
 */
function initializeWebsite() {
    // Critical functionality first
    initializeMobileNavigation();
    initializeSmoothScrolling();
    initializeROICalculator();
    initializePricingCalculator();
    
    // Non-critical functionality during idle time
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initializeFormValidation();
            initializeVisualEnhancements();
            initializeAnalytics();
            initializePerformanceOptimizations();
            initializePersonaDetection();
            initializeRegionalAdaptation();
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            initializeFormValidation();
            initializeVisualEnhancements();
            initializeAnalytics();
            initializePerformanceOptimizations();
            initializePersonaDetection();
            initializeRegionalAdaptation();
        }, 100);
    }
}

/**
 * Mobile Navigation Toggle Functionality
 * Handles the hamburger menu for mobile devices with proper accessibility
 */
function initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            // Toggle the active class for both button and menu
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when mobile menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking navigation links
        const navLinkElements = navLinks.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Smooth Scrolling for Navigation Links
 * Enhances user experience with smooth transitions between sections
 */
function initializeSmoothScrolling() {
    // Handle all internal navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just a hash without target
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset to account for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Form Validation and Enhancement
 * Provides client-side validation and user feedback for all forms
 */
function initializeFormValidation() {
    // Enhanced validation for newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        enhanceFormExperience(newsletterForm);
    }
}

/**
 * Enhances form experience with better UX patterns
 * @param {HTMLElement} form - The form element to enhance
 */
function enhanceFormExperience(form) {
    // Add floating label effect
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add focus/blur classes for styling
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Initialize state for pre-filled inputs
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
}

/**
 * Field validation with user-friendly feedback
 * @param {HTMLElement} field - The field to validate
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation (basic)
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show or clear error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * Shows validation error for a field
 * @param {HTMLElement} field - The field with error
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    clearFieldError(field); // Remove any existing error
    
    field.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

/**
 * Clears validation error for a field
 * @param {HTMLElement} field - The field to clear error from
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Visual Enhancements and Animations
 * Adds subtle animations and interactive effects
 */
function initializeVisualEnhancements() {
    // Intersection Observer for scroll-triggered animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate in
        const animatedElements = document.querySelectorAll('.glass-card, .feature-card, .challenge-item, .benefit-item, .process-step');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Enhanced hover effects for interactive elements
    initializeHoverEffects();
    
    // Parallax effect for hero section (subtle)
    initializeParallaxEffects();
}

/**
 * Initializes hover effects for better user feedback
 */
function initializeHoverEffects() {
    // Enhanced card interactions
    const cards = document.querySelectorAll('.glass-card, .feature-card, .challenge-item, .benefit-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Button press effects
    const buttons = document.querySelectorAll('.cta-primary, .cta-secondary');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Subtle parallax effects for modern feel
 */
function initializeParallaxEffects() {
    // Only apply parallax on devices that can handle it smoothly
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroVisual = document.querySelector('.hero-visual');
            
            if (heroVisual) {
                const rate = scrolled * -0.3;
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

/**
 * Enhanced Analytics and Performance Tracking
 * Comprehensive conversion tracking for PE firms
 */
function initializeAnalytics() {
    // Initialize enhanced tracking systems
    trackButtonClicks();
    trackFormInteractions();
    trackScrollDepth();
    trackConversionFunnel();
    trackUserEngagement();
    trackPESpecificMetrics();
    
    // Set up session tracking
    initializeSessionTracking();
    
    console.log('Enhanced analytics initialized');
}

/**
 * Tracks button clicks for analytics
 */
function trackButtonClicks() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log(`CTA Click: ${buttonText}`); // Replace with actual analytics
            
            // You can replace this with Google Analytics, Mixpanel, etc.
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'CTA',
                    event_label: buttonText
                });
            }
        });
    });
}

/**
 * Tracks form interactions
 */
function trackFormInteractions() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const formId = this.className || 'unknown-form';
            console.log(`Form Submission: ${formId}`); // Replace with actual analytics
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Form',
                    event_label: formId
                });
            }
        });
    });
}

/**
 * Tracks scroll depth for engagement metrics
 */
function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90];
    const reached = [];
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !reached.includes(milestone)) {
                    reached.push(milestone);
                    console.log(`Scroll Depth: ${milestone}%`); // Replace with actual analytics
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            event_category: 'Engagement',
                            event_label: `${milestone}%`
                        });
                    }
                }
            });
        }
    });
}

/**
 * Form Submission Handlers
 * These functions handle form submissions and redirect to Google Forms
 * This approach allows for client-side validation while using Google Forms backend
 */

/**
 * Handles SuperReturn CTA click
 * Redirects to the new calendar scheduling URL
 */
function handleSuperReturnCTA() {
    // Track the interaction with comprehensive analytics
    if (window.analyticsFramework) {
        window.analyticsFramework.trackEvent('superreturn_meeting', {
            source: 'hero_cta',
            user_agent: navigator.userAgent
        });
    } else {
        console.log('SuperReturn CTA clicked');
    }
    
    // Open the calendar scheduling link
    window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3M9SPgwXBs6D46gwHZPOoEty84sRO6BYk1wZ0Jh8sk-j9AKKs2jNRWLtgJcE9OILGot8J4q7O5', '_blank');
}


/**
 * Handles newsletter form submission
 * @param {Event} event - Form submission event
 */
function handleNewsletterForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const consent = form.querySelector('input[type="checkbox"]').checked;
    
    // Validate
    if (!email || !consent) {
        showFormMessage(form, 'Please enter your email and provide consent', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage(form, 'Please enter a valid email address', 'error');
        return;
    }
    
    // Track newsletter signup attempt
    if (window.analyticsFramework) {
        window.analyticsFramework.trackEvent('newsletter_signup', {
            source: 'footer_form',
            email_domain: email.split('@')[1],
            consent_provided: consent
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    // Google Form URL for newsletter (replace with actual URL)
    const googleFormUrl = `https://forms.google.com/your-newsletter-form-id?entry.email=${encodeURIComponent(email)}`;
    
    setTimeout(() => {
        // Open Google Form in new tab
        window.open(googleFormUrl, '_blank');
        
        // Show success message
        showFormMessage(form, 'Thank you for subscribing! Please complete the signup in the new tab.', 'success');
        
        // Track successful newsletter signup
        if (window.analyticsFramework) {
            window.analyticsFramework.trackConversion('newsletter_signup');
        }
        
        // Reset form
        form.reset();
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 800);
}

/**
 * Shows a message to the user after form interaction
 * @param {HTMLElement} form - The form element
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(form, message, type) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Add message to form
    form.appendChild(messageElement);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

/**
 * Placeholder handlers for footer links
 * These will be replaced with actual privacy policy and terms of service
 */
function handlePrivacyPolicy() {
    alert('Privacy Policy will be available soon. Please contact us at contact@beneficious.com for any privacy-related questions.');
}

function handleTermsOfService() {
    alert('Terms of Service will be available soon. Please contact us at contact@beneficious.com for any questions.');
}

/**
 * Performance optimization
 * Lazy loading and other performance enhancements
 */
function initializePerformanceOptimizations() {
    // Lazy load images when they become available
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Resource hints for better performance
    addResourceHints();
    
    // Initialize service worker for caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .catch(err => console.log('SW registration failed'));
        });
    }
}

/**
 * Preload critical resources that will be needed soon
 */
function preloadCriticalResources() {
    const criticalResources = [
        { href: '/privacy-policy.html', as: 'document' },
        { href: '/terms-of-service.html', as: 'document' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource.href;
        if (resource.as) link.as = resource.as;
        document.head.appendChild(link);
    });
}

/**
 * Add resource hints for better performance
 */
function addResourceHints() {
    // DNS prefetch for external domains
    const externalDomains = [
        'https://forms.google.com',
        'https://www.google-analytics.com'
    ];
    
    externalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });
}

/**
 * ROI Calculator Implementation
 * Interactive calculator for PE firms to see potential savings with Ralph
 */
function initializeROICalculator() {
    const calculatorInputs = document.querySelectorAll('#deals-per-year, #team-size, #avg-deal-size, #dd-duration, #hourly-cost, #firm-type');
    
    if (calculatorInputs.length === 0) return; // Calculator not on this page
    
    // Initial calculation
    calculateROI();
    
    // Add event listeners for real-time updates
    calculatorInputs.forEach(input => {
        input.addEventListener('input', debounce(calculateROI, 300));
        input.addEventListener('change', calculateROI);
    });
}

/**
 * Calculate ROI based on user inputs
 */
function calculateROI() {
    // Get input values
    const dealsPerYear = parseFloat(document.getElementById('deals-per-year')?.value || 12);
    const teamSize = parseFloat(document.getElementById('team-size')?.value || 4);
    const avgDealSize = parseFloat(document.getElementById('avg-deal-size')?.value || 50);
    const ddDuration = parseFloat(document.getElementById('dd-duration')?.value || 120);
    const hourlyCost = parseFloat(document.getElementById('hourly-cost')?.value || 250);
    const firmType = document.getElementById('firm-type')?.value || 'mid-market';
    
    // Calculate metrics based on PE industry benchmarks
    const hoursPerDeal = ddDuration * 6; // 6 hours per day on average
    const totalDDHours = dealsPerYear * hoursPerDeal * teamSize;
    const currentAnnualCost = totalDDHours * hourlyCost;
    
    // Ralph efficiency gains (conservative estimates based on pilot data)
    const timeReductionPercentage = 0.7; // 70% time reduction
    const timeSaved = totalDDHours * timeReductionPercentage;
    const costSavings = timeSaved * hourlyCost;
    
    // Additional capacity calculations
    const savedTimePerDeal = hoursPerDeal * teamSize * timeReductionPercentage;
    const additionalDeals = Math.floor(timeSaved / (hoursPerDeal * teamSize));
    
    // Firm type multipliers for different value propositions
    const firmMultipliers = {
        'mid-market': { efficiency: 1.0, capacity: 1.2 },
        'large-cap': { efficiency: 1.2, capacity: 1.1 },
        'growth': { efficiency: 0.9, capacity: 1.3 },
        'venture': { efficiency: 0.8, capacity: 1.5 }
    };
    
    const multiplier = firmMultipliers[firmType];
    const adjustedSavings = costSavings * multiplier.efficiency;
    const adjustedAdditionalDeals = Math.floor(additionalDeals * multiplier.capacity);
    
    // Calculate detailed breakdown
    const docAnalysisSavings = adjustedSavings * 0.6; // 60% from document analysis
    const riskIdSavings = adjustedSavings * 0.19; // 19% from risk identification
    const reportGenSavings = adjustedSavings * 0.13; // 13% from report generation
    const capacityValue = adjustedSavings * 0.08; // 8% from additional capacity
    
    // ROI calculation (assuming Ralph costs roughly 25% of first year savings)
    const estimatedRalphCost = adjustedSavings * 0.25;
    const roiPercentage = Math.round(((adjustedSavings - estimatedRalphCost) / estimatedRalphCost) * 100);
    
    // Update the display
    updateROIDisplay({
        annualSavings: adjustedSavings,
        timeSaved: timeSaved,
        additionalDeals: adjustedAdditionalDeals,
        roiPercentage: roiPercentage,
        docAnalysisSavings: docAnalysisSavings,
        riskIdSavings: riskIdSavings,
        reportGenSavings: reportGenSavings,
        capacityValue: capacityValue
    });
    
    // Track calculator usage for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'roi_calculation', {
            event_category: 'Calculator',
            event_label: firmType,
            value: Math.round(adjustedSavings)
        });
    }
}

/**
 * Update ROI display with calculated values
 */
function updateROIDisplay(results) {
    const formatCurrency = (value) => {
        if (value >= 1000000) {
            return `€${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `€${(value / 1000).toFixed(0)}K`;
        } else {
            return `€${value.toFixed(0)}`;
        }
    };
    
    const formatNumber = (value) => {
        return value.toLocaleString();
    };
    
    // Update main results
    const annualSavingsEl = document.getElementById('annual-savings');
    const timeSavedEl = document.getElementById('time-saved');
    const additionalDealsEl = document.getElementById('additional-deals');
    const roiPercentageEl = document.getElementById('roi-percentage');
    
    if (annualSavingsEl) annualSavingsEl.textContent = formatCurrency(results.annualSavings);
    if (timeSavedEl) timeSavedEl.textContent = formatNumber(Math.round(results.timeSaved));
    if (additionalDealsEl) additionalDealsEl.textContent = `+${results.additionalDeals}`;
    if (roiPercentageEl) roiPercentageEl.textContent = `${results.roiPercentage}%`;
    
    // Update breakdown
    const docAnalysisEl = document.getElementById('doc-analysis-savings');
    const riskIdEl = document.getElementById('risk-id-savings');
    const reportGenEl = document.getElementById('report-gen-savings');
    const capacityValueEl = document.getElementById('capacity-value');
    
    if (docAnalysisEl) docAnalysisEl.textContent = formatCurrency(results.docAnalysisSavings);
    if (riskIdEl) riskIdEl.textContent = formatCurrency(results.riskIdSavings);
    if (reportGenEl) reportGenEl.textContent = formatCurrency(results.reportGenSavings);
    if (capacityValueEl) capacityValueEl.textContent = formatCurrency(results.capacityValue);
    
    // Add animation to updated values
    [annualSavingsEl, timeSavedEl, additionalDealsEl, roiPercentageEl].forEach(el => {
        if (el) {
            el.style.transform = 'scale(1.05)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

/**
 * Handle ROI Calculator CTA click
 */
function handleROICalculatorCTA() {
    // Get current calculator values for personalization
    const dealsPerYear = document.getElementById('deals-per-year')?.value;
    const teamSize = document.getElementById('team-size')?.value;
    const firmType = document.getElementById('firm-type')?.value;
    
    // Track the CTA click with context
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'ROI_Calculator_CTA',
            event_label: `${firmType}_${dealsPerYear}deals_${teamSize}team`
        });
    }
    
    // Scroll to demo section or open calendar
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show personalized message
    setTimeout(() => {
        const message = `Based on your ${dealsPerYear} annual deals and ${teamSize}-person team, Ralph could save you significant time and cost. Let's discuss your specific needs.`;
        showFormMessage(document.querySelector('.roi-calculator'), message, 'success');
    }, 1000);
}

/**
 * Export ROI Report functionality
 */
function exportROIReport() {
    // Get current values
    const dealsPerYear = document.getElementById('deals-per-year')?.value || 12;
    const teamSize = document.getElementById('team-size')?.value || 4;
    const firmType = document.getElementById('firm-type')?.value || 'mid-market';
    const annualSavings = document.getElementById('annual-savings')?.textContent || '€940K';
    
    // Create a simple text report (in a real implementation, this would generate a PDF)
    const reportContent = `
Ralph ROI Analysis Report
========================

Firm Profile:
- Type: ${firmType}
- Annual Deals: ${dealsPerYear}
- Team Size: ${teamSize}

Projected Annual Benefits:
- Cost Savings: ${annualSavings}
- Time Reduction: 70%
- Additional Deal Capacity: 8+ deals

Next Steps:
1. Schedule a personalized demo
2. Discuss pilot program options
3. Review security and compliance requirements

Contact: konstantin@beneficious.com
    `;
    
    // Create and download text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ralph-roi-analysis-${firmType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Track download
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            event_category: 'ROI_Report',
            event_label: firmType
        });
    }
    
    // Show feedback
    showFormMessage(document.querySelector('.roi-calculator'), 'ROI report downloaded! Check your downloads folder.', 'success');
}

/**
 * Persona Detection System
 * Analyzes user behavior to personalize content and CTAs
 */
function initializePersonaDetection() {
    const personaDetector = new PersonaDetector();
    personaDetector.init();
}

class PersonaDetector {
    constructor() {
        this.behaviors = {
            timeOnPage: 0,
            sectionsViewed: new Set(),
            ctaClicks: [],
            calculatorUsage: false,
            securityFocus: false,
            pricingFocus: false
        };
        
        this.personas = {
            'technical-leader': {
                indicators: ['security', 'features', 'architecture'],
                cta: 'Explore Technical Architecture',
                content: 'technical'
            },
            'business-leader': {
                indicators: ['roi-calculator', 'benefits', 'case-studies'],
                cta: 'See Business Impact',
                content: 'business'
            },
            'decision-maker': {
                indicators: ['pricing', 'demo', 'contact'],
                cta: 'Schedule Executive Demo',
                content: 'executive'
            }
        };
        
        this.currentPersona = null;
    }
    
    init() {
        this.trackTimeOnPage();
        this.trackSectionViews();
        this.trackInteractions();
        this.analyzePersona();
    }
    
    trackTimeOnPage() {
        this.startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            this.behaviors.timeOnPage = Date.now() - this.startTime;
        });
    }
    
    trackSectionViews() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.behaviors.sectionsViewed.add(entry.target.id);
                    this.analyzePersona();
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    trackInteractions() {
        // Track ROI calculator usage
        const calculatorInputs = document.querySelectorAll('.roi-calculator input, .roi-calculator select');
        calculatorInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.behaviors.calculatorUsage = true;
                this.analyzePersona();
            });
        });
        
        // Track security section focus
        const securityElements = document.querySelectorAll('.security a, .security button');
        securityElements.forEach(el => {
            el.addEventListener('click', () => {
                this.behaviors.securityFocus = true;
                this.analyzePersona();
            });
        });
        
        // Track pricing interest
        const pricingElements = document.querySelectorAll('[href*="pricing"], [href*="cost"]');
        pricingElements.forEach(el => {
            el.addEventListener('click', () => {
                this.behaviors.pricingFocus = true;
                this.analyzePersona();
            });
        });
    }
    
    analyzePersona() {
        let scores = {
            'technical-leader': 0,
            'business-leader': 0,
            'decision-maker': 0
        };
        
        // Score based on sections viewed
        if (this.behaviors.sectionsViewed.has('security')) scores['technical-leader'] += 2;
        if (this.behaviors.sectionsViewed.has('features')) scores['technical-leader'] += 1;
        if (this.behaviors.sectionsViewed.has('roi-calculator')) scores['business-leader'] += 3;
        if (this.behaviors.sectionsViewed.has('benefits')) scores['business-leader'] += 1;
        if (this.behaviors.sectionsViewed.has('demo')) scores['decision-maker'] += 2;
        if (this.behaviors.sectionsViewed.has('contact')) scores['decision-maker'] += 1;
        
        // Score based on behaviors
        if (this.behaviors.calculatorUsage) scores['business-leader'] += 3;
        if (this.behaviors.securityFocus) scores['technical-leader'] += 2;
        if (this.behaviors.pricingFocus) scores['decision-maker'] += 2;
        
        // Determine dominant persona
        const topPersona = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        
        if (scores[topPersona] > 2 && this.currentPersona !== topPersona) {
            this.currentPersona = topPersona;
            this.personalizeExperience(topPersona);
        }
    }
    
    personalizeExperience(persona) {
        const config = this.personas[persona];
        if (!config) return;
        
        // Update CTAs based on persona
        const primaryCTAs = document.querySelectorAll('.cta-primary');
        primaryCTAs.forEach(cta => {
            if (!cta.dataset.originalText) {
                cta.dataset.originalText = cta.textContent;
            }
            // Only update non-specific CTAs
            if (cta.textContent.includes('Demo') || cta.textContent.includes('Started')) {
                cta.textContent = config.cta;
            }
        });
        
        // Track personalization
        if (typeof gtag !== 'undefined') {
            gtag('event', 'persona_detected', {
                event_category: 'Personalization',
                event_label: persona
            });
        }
        
        console.log(`Persona detected: ${persona}`);
    }
}

/**
 * Pricing Calculator Implementation
 * Interactive calculator for transparent pricing based on firm requirements
 */
function initializePricingCalculator() {
    const pricingInputs = document.querySelectorAll('#pricing-deals, #pricing-deployment, #pricing-support, #pricing-region');
    
    if (pricingInputs.length === 0) return; // Pricing calculator not on this page
    
    // Initial calculation
    calculatePricing();
    
    // Add event listeners for real-time updates
    pricingInputs.forEach(input => {
        input.addEventListener('change', calculatePricing);
    });
}

/**
 * Calculate pricing based on user selections
 */
function calculatePricing() {
    // Get input values
    const dealVolume = document.getElementById('pricing-deals')?.value || '1-12';
    const deployment = document.getElementById('pricing-deployment')?.value || 'cloud';
    const support = document.getElementById('pricing-support')?.value || 'standard';
    const region = document.getElementById('pricing-region')?.value || 'europe';
    
    // Base pricing structure
    const basePricing = {
        '1-12': { platform: 42000, perDeal: 850, setup: 8500 },
        '13-25': { platform: 54000, perDeal: 750, setup: 12000 },
        '26-50': { platform: 78000, perDeal: 650, setup: 18000 },
        '51-100': { platform: 120000, perDeal: 550, setup: 25000 },
        '100+': { platform: 180000, perDeal: 450, setup: 35000 }
    };
    
    // Deployment multipliers
    const deploymentMultipliers = {
        'cloud': 1.0,
        'on-premise': 1.25,
        'hybrid': 1.15
    };
    
    // Support pricing
    const supportPricing = {
        'standard': 12600,
        'premium': 24000,
        'dedicated': 42000
    };
    
    // Regional currency and adjustments
    const regionalSettings = {
        'europe': { symbol: '€', multiplier: 1.0 },
        'north-america': { symbol: '$', multiplier: 1.08 },
        'uk': { symbol: '£', multiplier: 0.85 },
        'asia-pacific': { symbol: '$', multiplier: 1.12 }
    };
    
    const regional = regionalSettings[region];
    const pricing = basePricing[dealVolume];
    const deploymentMultiplier = deploymentMultipliers[deployment];
    
    // Calculate adjusted pricing
    const platformCost = Math.round(pricing.platform * deploymentMultiplier * regional.multiplier);
    const perDealCost = Math.round(pricing.perDeal * regional.multiplier);
    const setupCost = Math.round(pricing.setup * deploymentMultiplier * regional.multiplier);
    const supportCost = Math.round(supportPricing[support] * regional.multiplier);
    
    // Calculate total for typical deal volume (midpoint of range)
    const dealCount = getDealCountFromRange(dealVolume);
    const totalCost = platformCost + (perDealCost * dealCount) + setupCost + supportCost;
    
    // Calculate value comparison (using ROI calculator logic)
    const projectedSavings = calculateProjectedSavings(dealCount, regional.multiplier);
    const netROI = Math.round((projectedSavings - totalCost) / totalCost * 10) / 10;
    const paybackDays = Math.round((totalCost / projectedSavings) * 365);
    
    // Update the display
    updatePricingDisplay({
        platformCost,
        perDealCost,
        setupCost,
        supportCost,
        totalCost,
        projectedSavings,
        netROI,
        paybackDays,
        dealCount,
        symbol: regional.symbol
    });
    
    // Track pricing calculator usage
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pricing_calculation', {
            event_category: 'Pricing_Calculator',
            event_label: `${dealVolume}_${deployment}_${region}`,
            value: Math.round(totalCost)
        });
    }
}

function getDealCountFromRange(range) {
    const ranges = {
        '1-12': 12,
        '13-25': 19,
        '26-50': 38,
        '51-100': 75,
        '100+': 150
    };
    return ranges[range] || 12;
}

function calculateProjectedSavings(dealCount, multiplier) {
    // Simplified calculation based on ROI calculator logic
    const avgSavingsPerDeal = 78000; // Based on typical mid-market firm
    return Math.round(dealCount * avgSavingsPerDeal * multiplier);
}

function updatePricingDisplay(results) {
    const formatCurrency = (value, symbol) => {
        if (value >= 1000000) {
            return `${symbol}${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${symbol}${(value / 1000).toFixed(0)}K`;
        } else {
            return `${symbol}${value.toLocaleString()}`;
        }
    };
    
    // Update pricing breakdown
    const platformCostEl = document.getElementById('platform-cost');
    const perDealCostEl = document.getElementById('per-deal-cost');
    const setupCostEl = document.getElementById('setup-cost');
    const supportCostEl = document.getElementById('support-cost');
    
    if (platformCostEl) platformCostEl.textContent = formatCurrency(results.platformCost, results.symbol);
    if (perDealCostEl) perDealCostEl.textContent = formatCurrency(results.perDealCost, results.symbol);
    if (setupCostEl) setupCostEl.textContent = formatCurrency(results.setupCost, results.symbol);
    if (supportCostEl) supportCostEl.textContent = formatCurrency(results.supportCost, results.symbol);
    
    // Update totals
    const totalCostEl = document.getElementById('total-cost');
    const projectedSavingsEl = document.getElementById('projected-savings');
    const netROIEl = document.getElementById('net-roi');
    const paybackPeriodEl = document.getElementById('payback-period');
    
    if (totalCostEl) totalCostEl.textContent = formatCurrency(results.totalCost, results.symbol);
    if (projectedSavingsEl) projectedSavingsEl.textContent = formatCurrency(results.projectedSavings, results.symbol);
    if (netROIEl) netROIEl.textContent = `${results.netROI}x`;
    if (paybackPeriodEl) paybackPeriodEl.textContent = `${results.paybackDays} days`;
    
    // Add animation to updated values
    [totalCostEl, projectedSavingsEl, netROIEl, paybackPeriodEl].forEach(el => {
        if (el) {
            el.style.transform = 'scale(1.05)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

/**
 * Pricing CTA Handlers
 */
function handlePilotCTA() {
    // Track pilot CTA click
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Pricing_CTA',
            event_label: 'Pilot_Program'
        });
    }
    
    // Scroll to demo section
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show personalized message
    setTimeout(() => {
        showFormMessage(document.querySelector('.pricing-transparency'), 'Pilot program applications are now open. Let\'s discuss your specific requirements.', 'success');
    }, 1000);
}

function handlePricingCTA() {
    // Get current pricing context
    const dealVolume = document.getElementById('pricing-deals')?.value || '1-12';
    const region = document.getElementById('pricing-region')?.value || 'europe';
    
    // Track pricing CTA click
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Pricing_CTA',
            event_label: `Custom_Quote_${dealVolume}_${region}`
        });
    }
    
    // Open calendar scheduling
    window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3M9SPgwXBs6D46gwHZPOoEty84sRO6BYk1wZ0Jh8sk-j9AKKs2jNRWLtgJcE9OILGot8J4q7O5', '_blank');
    
    // Show confirmation message
    showFormMessage(document.querySelector('.pricing-transparency'), 'Quote request initiated. We\'ll prepare a custom proposal based on your requirements.', 'success');
}

function handlePartnershipCTA() {
    // Track partnership CTA click
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Pricing_CTA',
            event_label: 'Success_Partnership'
        });
    }
    
    // Navigate to contact
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show message about partnership terms
    setTimeout(() => {
        showFormMessage(document.querySelector('.contact'), 'Partnership discussions require custom terms. Let\'s schedule a strategic conversation.', 'success');
    }, 1000);
}

/**
 * Regional Adaptation System
 * Adapts content, currency, and compliance messaging based on user region
 */
function initializeRegionalAdaptation() {
    const regionalAdapter = new RegionalAdapter();
    regionalAdapter.init();
}

class RegionalAdapter {
    constructor() {
        this.userRegion = null;
        this.regionalSettings = {
            'EU': {
                currency: '€',
                compliance: ['GDPR', 'EU AI Act'],
                timezone: 'Europe/Berlin',
                language: 'en-EU'
            },
            'US': {
                currency: '$',
                compliance: ['CCPA', 'SOX'],
                timezone: 'America/New_York',
                language: 'en-US'
            },
            'GB': {
                currency: '£',
                compliance: ['UK GDPR', 'FCA'],
                timezone: 'Europe/London',
                language: 'en-GB'
            },
            'AS': {
                currency: '$',
                compliance: ['MAS FEAT', 'PIPEDA'],
                timezone: 'Asia/Singapore',
                language: 'en-AS'
            }
        };
    }
    
    async init() {
        try {
            await this.detectRegion();
            this.adaptContent();
        } catch (error) {
            console.log('Regional adaptation failed, using defaults:', error);
            this.userRegion = 'EU'; // Default to EU
            this.adaptContent();
        }
    }
    
    async detectRegion() {
        try {
            // Try to get region from various sources
            const response = await fetch('https://ipapi.co/continent_code/', { 
                method: 'GET',
                timeout: 3000
            });
            const continentCode = await response.text();
            this.userRegion = continentCode.trim();
        } catch (error) {
            // Fallback to timezone detection
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone.includes('Europe')) {
                this.userRegion = 'EU';
            } else if (timezone.includes('America')) {
                this.userRegion = 'US';
            } else if (timezone.includes('London')) {
                this.userRegion = 'GB';
            } else {
                this.userRegion = 'AS';
            }
        }
    }
    
    adaptContent() {
        const settings = this.regionalSettings[this.userRegion] || this.regionalSettings['EU'];
        
        // Adapt currency displays
        this.adaptCurrency(settings.currency);
        
        // Adapt compliance messaging
        this.adaptCompliance(settings.compliance);
        
        // Adapt pricing calculator default
        this.adaptPricingDefaults();
        
        // Track regional adaptation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'regional_adaptation', {
                event_category: 'Localization',
                event_label: this.userRegion
            });
        }
        
        console.log(`Regional adaptation: ${this.userRegion} (${settings.currency})`);
    }
    
    adaptCurrency(currency) {
        // Update currency symbols in pricing displays
        const currencyElements = document.querySelectorAll('.currency-symbol');
        currencyElements.forEach(el => {
            el.textContent = currency;
        });
        
        // Update pricing calculator default region
        const regionSelect = document.getElementById('pricing-region');
        if (regionSelect) {
            const regionMap = {
                'EU': 'europe',
                'US': 'north-america',
                'GB': 'uk',
                'AS': 'asia-pacific'
            };
            
            const regionValue = regionMap[this.userRegion];
            if (regionValue) {
                regionSelect.value = regionValue;
                calculatePricing(); // Recalculate with new region
            }
        }
    }
    
    adaptCompliance(complianceStandards) {
        // Highlight relevant compliance badges
        const complianceCards = document.querySelectorAll('.compliance-card');
        complianceCards.forEach(card => {
            const title = card.querySelector('h4')?.textContent;
            if (complianceStandards.some(standard => title?.includes(standard))) {
                card.style.border = '2px solid var(--color-accent-secondary)';
                card.style.backgroundColor = 'rgba(254, 83, 13, 0.05)';
            }
        });
    }
    
    adaptPricingDefaults() {
        // Set default pricing calculator values based on region
        const dealVolumeSelect = document.getElementById('pricing-deals');
        if (dealVolumeSelect && this.userRegion === 'US') {
            // US firms typically have higher deal volumes
            dealVolumeSelect.value = '13-25';
        }
        
        if (dealVolumeSelect) {
            calculatePricing(); // Recalculate with regional defaults
        }
    }
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}