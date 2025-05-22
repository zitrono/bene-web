/**
 * Ralph Website JavaScript
 * Handles interactive elements, form submissions, and mobile navigation
 * This file provides enhanced user experience while maintaining GitHub Pages compatibility
 */

// Document ready state handling for better performance
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

/**
 * Main initialization function that sets up all website functionality
 * This approach ensures all DOM elements are available before binding events
 */
function initializeWebsite() {
    initializeMobileNavigation();
    initializeSmoothScrolling();
    initializeFormValidation();
    initializeVisualEnhancements();
    initializeAnalytics();
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
    // Enhanced validation for the demo request form
    const demoForm = document.querySelector('.contact-form');
    if (demoForm) {
        enhanceFormExperience(demoForm);
        
        // Add real-time validation
        const requiredFields = demoForm.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear error state when user starts typing
                clearFieldError(this);
            });
        });
    }
    
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
 * Analytics and Performance Tracking
 * Simple event tracking for user interactions
 */
function initializeAnalytics() {
    // Track important user interactions
    trackButtonClicks();
    trackFormInteractions();
    trackScrollDepth();
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
 * This function will redirect to a Google Calendar or Google Form
 */
function handleSuperReturnCTA() {
    // Add loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    // Track the interaction
    console.log('SuperReturn CTA clicked');
    
    // Simulate brief loading for better UX
    setTimeout(() => {
        // Replace with actual Google Form or Calendar URL
        const googleFormUrl = 'https://forms.google.com/your-superreturn-form-id';
        window.open(googleFormUrl, '_blank');
        
        // Reset button state
        button.textContent = originalText;
        button.disabled = false;
    }, 500);
}

/**
 * Handles demo form submission
 * Validates form and redirects to Google Form with pre-filled data
 * @param {Event} event - Form submission event
 */
function handleDemoForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Show general error message
        showFormMessage(form, 'Please correct the errors above', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Prepare Google Form URL with pre-filled data
    const baseUrl = 'https://forms.google.com/your-demo-form-id';
    const params = new URLSearchParams();
    
    // Map form fields to Google Form entry IDs (you'll need to get these from Google Forms)
    const fieldMapping = {
        'name': 'entry.123456789',
        'company': 'entry.987654321',
        'email': 'entry.456789123',
        'phone': 'entry.789123456',
        'aum': 'entry.321654987',
        'deals': 'entry.654987321',
        'message': 'entry.147258369'
    };
    
    // Add form data to URL parameters
    for (const [key, value] of formData.entries()) {
        if (fieldMapping[key] && value) {
            params.append(fieldMapping[key], value);
        }
    }
    
    const googleFormUrl = `${baseUrl}?${params.toString()}`;
    
    // Simulate processing time for better UX
    setTimeout(() => {
        // Open Google Form in new tab
        window.open(googleFormUrl, '_blank');
        
        // Show success message
        showFormMessage(form, 'Thank you! The demo request form will open in a new tab.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Clear focused states
        const focusedGroups = form.querySelectorAll('.form-group.focused');
        focusedGroups.forEach(group => {
            if (!group.querySelector('input, textarea, select').value) {
                group.classList.remove('focused');
            }
        });
        
    }, 1000);
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
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}