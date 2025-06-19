/**
 * Mobile Experience Enhancements for Ralph
 * Optimized for PE professionals on-the-go
 * Features: Offline support, adaptive performance, security monitoring, smart CTAs
 */

// ============================================================================
// Mobile Detection and Environment Setup
// ============================================================================

class MobileEnvironment {
    constructor() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.isAndroid = /Android/i.test(navigator.userAgent);
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.supportsTouch = 'ontouchstart' in window;
        this.supportsVibration = 'vibrate' in navigator;
        this.supportsGeolocation = 'geolocation' in navigator;
    }

    async detectRegion() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                continent: data.continent_code,
                country: data.country_code,
                city: data.city,
                timezone: data.timezone
            };
        } catch (error) {
            console.error('Failed to detect region:', error);
            return { continent: 'NA', country: 'US' };
        }
    }

    getConnectionQuality() {
        if (!this.connection) return 'unknown';
        
        const effectiveType = this.connection.effectiveType;
        const downlink = this.connection.downlink;
        
        if (effectiveType === '4g' && downlink > 10) return 'excellent';
        if (effectiveType === '4g') return 'good';
        if (effectiveType === '3g') return 'fair';
        return 'poor';
    }
}

// ============================================================================
// Offline Support Manager
// ============================================================================

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.offlineQueue = [];
        this.db = null;
        this.init();
    }

    async init() {
        // Initialize IndexedDB
        await this.initDB();
        
        // Monitor connection status
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Check initial state
        if (!this.isOnline) {
            this.handleOffline();
        }
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('RalphOfflineStore', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store offline form submissions
                if (!db.objectStoreNames.contains('formSubmissions')) {
                    const store = db.createObjectStore('formSubmissions', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    store.createIndex('timestamp', 'timestamp');
                }
                
                // Store cached data
                if (!db.objectStoreNames.contains('cachedData')) {
                    const store = db.createObjectStore('cachedData', { keyPath: 'key' });
                    store.createIndex('expiry', 'expiry');
                }
                
                // Store user preferences
                if (!db.objectStoreNames.contains('preferences')) {
                    db.createObjectStore('preferences', { keyPath: 'key' });
                }
            };
        });
    }

    handleOnline() {
        this.isOnline = true;
        document.body.classList.remove('offline');
        this.showNotification('Back online! Syncing data...', 'success');
        this.syncOfflineData();
    }

    handleOffline() {
        this.isOnline = false;
        document.body.classList.add('offline');
        this.showNotification('You\'re offline. Some features may be limited.', 'warning');
    }

    async syncOfflineData() {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['formSubmissions'], 'readonly');
        const store = transaction.objectStore('formSubmissions');
        const submissions = await this.promisifyRequest(store.getAll());
        
        for (const submission of submissions) {
            try {
                await this.submitForm(submission);
                await this.removeSubmission(submission.id);
            } catch (error) {
                console.error('Failed to sync submission:', error);
            }
        }
    }

    async queueFormSubmission(formData) {
        if (!this.db) return;
        
        const submission = {
            ...formData,
            timestamp: Date.now(),
            id: Date.now() + Math.random()
        };
        
        const transaction = this.db.transaction(['formSubmissions'], 'readwrite');
        const store = transaction.objectStore('formSubmissions');
        await this.promisifyRequest(store.add(submission));
        
        this.showNotification('Form saved. Will submit when online.', 'info');
    }

    async cacheData(key, data, expiryMinutes = 60) {
        if (!this.db) return;
        
        const item = {
            key,
            data,
            expiry: Date.now() + (expiryMinutes * 60 * 1000)
        };
        
        const transaction = this.db.transaction(['cachedData'], 'readwrite');
        const store = transaction.objectStore('cachedData');
        await this.promisifyRequest(store.put(item));
    }

    async getCachedData(key) {
        if (!this.db) return null;
        
        const transaction = this.db.transaction(['cachedData'], 'readonly');
        const store = transaction.objectStore('cachedData');
        const item = await this.promisifyRequest(store.get(key));
        
        if (!item) return null;
        if (item.expiry < Date.now()) {
            await this.removeCachedData(key);
            return null;
        }
        
        return item.data;
    }

    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    showNotification(message, type = 'info') {
        const banner = document.createElement('div');
        banner.className = `offline-notification ${type}`;
        banner.textContent = message;
        banner.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 9999;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(banner);
        
        setTimeout(() => {
            banner.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => banner.remove(), 300);
        }, 3000);
    }
}

// ============================================================================
// Adaptive Performance Manager
// ============================================================================

class PerformanceManager {
    constructor() {
        this.env = new MobileEnvironment();
        this.metrics = {
            fps: 60,
            memory: 0,
            connectionSpeed: 'unknown'
        };
        this.init();
    }

    init() {
        this.monitorPerformance();
        this.applyOptimizations();
        this.setupAdaptiveLoading();
    }

    monitorPerformance() {
        // Monitor FPS
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Apply optimizations if FPS drops
                if (this.metrics.fps < 30) {
                    this.reducePerfomanceLoad();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
        
        // Monitor memory if available
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memory = performance.memory.usedJSHeapSize / 1048576; // MB
            }, 5000);
        }
    }

    applyOptimizations() {
        const quality = this.env.getConnectionQuality();
        
        switch (quality) {
            case 'poor':
                this.applyLowBandwidthOptimizations();
                break;
            case 'fair':
                this.applyMediumBandwidthOptimizations();
                break;
            default:
                this.applyHighBandwidthOptimizations();
        }
    }

    applyLowBandwidthOptimizations() {
        document.body.classList.add('low-bandwidth');
        
        // Disable non-critical animations
        document.body.style.setProperty('--animation-duration', '0.001ms');
        
        // Replace images with placeholders
        document.querySelectorAll('img:not(.critical)').forEach(img => {
            img.dataset.originalSrc = img.src;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3C/svg%3E';
        });
        
        // Disable backdrop filters
        document.querySelectorAll('.glass-card').forEach(card => {
            card.style.backdropFilter = 'none';
        });
    }

    applyMediumBandwidthOptimizations() {
        document.body.classList.add('medium-bandwidth');
        
        // Reduce animation complexity
        document.body.style.setProperty('--animation-duration', '0.2s');
        
        // Load lower quality images
        this.loadOptimizedImages('medium');
    }

    applyHighBandwidthOptimizations() {
        // Load high quality assets
        this.loadOptimizedImages('high');
        
        // Enable all visual effects
        document.body.classList.remove('low-bandwidth', 'medium-bandwidth');
    }

    setupAdaptiveLoading() {
        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe all images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Connection change listener
        if (this.env.connection) {
            this.env.connection.addEventListener('change', () => {
                this.applyOptimizations();
            });
        }
    }

    loadImage(img) {
        const quality = this.env.getConnectionQuality();
        let src = img.dataset.src;
        
        // Adjust quality based on connection
        if (quality === 'poor' && img.dataset.srcLow) {
            src = img.dataset.srcLow;
        } else if (quality === 'fair' && img.dataset.srcMedium) {
            src = img.dataset.srcMedium;
        }
        
        // Load image
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
        };
        tempImg.src = src;
    }

    reducePerfomanceLoad() {
        // Disable non-essential features when performance is poor
        document.body.classList.add('reduced-performance');
        
        // Stop animations
        document.querySelectorAll('[data-animation]').forEach(el => {
            el.style.animation = 'none';
        });
        
        // Reduce parallax effects
        window.removeEventListener('scroll', this.parallaxHandler);
    }

    loadOptimizedImages(quality) {
        document.querySelectorAll('img[data-src]').forEach(img => {
            let src = img.dataset.src;
            
            if (quality === 'medium' && img.dataset.srcMedium) {
                src = img.dataset.srcMedium;
            } else if (quality === 'low' && img.dataset.srcLow) {
                src = img.dataset.srcLow;
            }
            
            img.src = src;
        });
    }
}

// ============================================================================
// Security Indicator Manager
// ============================================================================

class SecurityIndicator {
    constructor() {
        this.isSecure = location.protocol === 'https:';
        this.securityFeatures = [];
        this.init();
    }

    init() {
        this.createSecurityBadge();
        this.checkSecurityStatus();
        this.monitorSecurityChanges();
    }

    createSecurityBadge() {
        const badge = document.createElement('div');
        badge.className = 'mobile-security-badge';
        badge.innerHTML = `
            <span class="security-icon">🔒</span>
            <span class="security-text">Checking...</span>
        `;
        
        const details = document.createElement('div');
        details.className = 'mobile-security-details';
        details.innerHTML = `
            <div class="security-features-list"></div>
        `;
        
        document.body.appendChild(badge);
        document.body.appendChild(details);
        
        // Toggle details on click
        badge.addEventListener('click', () => {
            badge.classList.toggle('expanded');
            this.provideHapticFeedback();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!badge.contains(e.target) && !details.contains(e.target)) {
                badge.classList.remove('expanded');
            }
        });
    }

    async checkSecurityStatus() {
        const badge = document.querySelector('.mobile-security-badge');
        const features = [];
        
        // Check HTTPS
        if (this.isSecure) {
            features.push({ icon: '✓', text: 'Encrypted connection' });
            badge.classList.add('secure');
        } else {
            features.push({ icon: '⚠', text: 'Unencrypted connection' });
            badge.classList.add('insecure');
        }
        
        // Check for service worker (offline capability)
        if ('serviceWorker' in navigator) {
            features.push({ icon: '✓', text: 'Offline capable' });
        }
        
        // Check for secure headers
        try {
            const response = await fetch(location.href, { method: 'HEAD' });
            const headers = response.headers;
            
            if (headers.get('Strict-Transport-Security')) {
                features.push({ icon: '✓', text: 'HSTS enabled' });
            }
            
            if (headers.get('Content-Security-Policy')) {
                features.push({ icon: '✓', text: 'CSP protected' });
            }
        } catch (error) {
            console.error('Failed to check headers:', error);
        }
        
        // Update UI
        this.updateSecurityDisplay(features);
    }

    updateSecurityDisplay(features) {
        const badge = document.querySelector('.mobile-security-badge');
        const text = badge.querySelector('.security-text');
        const list = document.querySelector('.security-features-list');
        
        // Update badge text
        if (this.isSecure) {
            text.textContent = 'Secure';
        } else {
            text.textContent = 'Not Secure';
        }
        
        // Update features list
        list.innerHTML = features.map(feature => `
            <div class="security-feature">
                <span class="security-feature-icon">${feature.icon}</span>
                <span>${feature.text}</span>
            </div>
        `).join('');
        
        this.securityFeatures = features;
    }

    monitorSecurityChanges() {
        // Monitor for mixed content
        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                this.checkForMixedContent();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    checkForMixedContent() {
        if (!this.isSecure) return;
        
        const insecureElements = document.querySelectorAll(
            'img[src^="http:"], ' +
            'script[src^="http:"], ' +
            'link[href^="http:"], ' +
            'iframe[src^="http:"]'
        );
        
        if (insecureElements.length > 0) {
            console.warn('Mixed content detected:', insecureElements);
            this.showSecurityWarning('Mixed content detected');
        }
    }

    showSecurityWarning(message) {
        const warning = document.createElement('div');
        warning.className = 'security-warning';
        warning.textContent = `⚠️ ${message}`;
        warning.style.cssText = `
            position: fixed;
            top: 110px;
            right: 10px;
            background: #ff9800;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            animation: shake 0.5s ease;
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => warning.remove(), 300);
        }, 5000);
    }

    provideHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
}

// ============================================================================
// Smart CTA Manager
// ============================================================================

class SmartCTAManager {
    constructor() {
        this.currentSection = null;
        this.scrollPosition = 0;
        this.fab = null;
        this.smartBar = null;
        this.init();
    }

    init() {
        this.createFAB();
        this.createSmartBar();
        this.setupScrollTracking();
        this.setupGestureSupport();
    }

    createFAB() {
        const fab = document.createElement('div');
        fab.className = 'mobile-fab';
        fab.innerHTML = `
            <button class="fab-main" aria-label="Quick actions">
                <span class="fab-icon">⚡</span>
            </button>
            <div class="fab-actions">
                <button class="fab-action" data-action="schedule-demo">
                    <span class="fab-action-icon">📅</span>
                    <span class="fab-action-label">Schedule Demo</span>
                </button>
                <button class="fab-action" data-action="contact">
                    <span class="fab-action-icon">💬</span>
                    <span class="fab-action-label">Contact</span>
                </button>
                <button class="fab-action" data-action="download">
                    <span class="fab-action-icon">📥</span>
                    <span class="fab-action-label">Download Info</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(fab);
        this.fab = fab;
        
        // Toggle FAB menu
        const mainButton = fab.querySelector('.fab-main');
        mainButton.addEventListener('click', () => {
            fab.classList.toggle('active');
            this.provideHapticFeedback();
        });
        
        // Handle FAB actions
        fab.querySelectorAll('.fab-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleFABAction(action);
                fab.classList.remove('active');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!fab.contains(e.target)) {
                fab.classList.remove('active');
            }
        });
    }

    createSmartBar() {
        const bar = document.createElement('div');
        bar.className = 'mobile-smart-cta';
        bar.innerHTML = `
            <span class="smart-cta-text">Ready to transform your due diligence?</span>
            <button class="smart-cta-button">Get Started</button>
        `;
        
        document.body.appendChild(bar);
        this.smartBar = bar;
        
        // Handle button click
        const button = bar.querySelector('.smart-cta-button');
        button.addEventListener('click', () => {
            this.handleSmartCTAClick();
        });
    }

    setupScrollTracking() {
        const sections = document.querySelectorAll('section');
        let lastScrollTop = 0;
        
        // Intersection Observer for section tracking
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateCTAContext();
                }
            });
        }, {
            threshold: 0.5
        });
        
        sections.forEach(section => observer.observe(section));
        
        // Scroll direction tracking
        let scrollTimer;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            // Show/hide smart bar based on scroll
            if (scrollTop > 300 && scrollTop > lastScrollTop) {
                // Scrolling down
                this.smartBar.classList.remove('visible');
            } else if (scrollTop < lastScrollTop) {
                // Scrolling up
                this.smartBar.classList.add('visible');
            }
            
            lastScrollTop = scrollTop;
            
            // Hide FAB while scrolling
            this.fab.style.opacity = '0.3';
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.fab.style.opacity = '1';
            }, 150);
        });
    }

    updateCTAContext() {
        const button = this.smartBar.querySelector('.smart-cta-button');
        const text = this.smartBar.querySelector('.smart-cta-text');
        
        const contexts = {
            'hero': {
                text: 'Ready to transform your due diligence?',
                button: 'Get Started',
                action: 'demo'
            },
            'features': {
                text: 'See Ralph in action',
                button: 'Watch Demo',
                action: 'video'
            },
            'benefits': {
                text: 'Join our private beta',
                button: 'Apply Now',
                action: 'beta'
            },
            'superreturn': {
                text: 'Meet us at SuperReturn',
                button: 'Schedule Meeting',
                action: 'calendar'
            },
            'contact': {
                text: 'Have questions?',
                button: 'Contact Us',
                action: 'contact'
            }
        };
        
        const context = contexts[this.currentSection] || contexts['hero'];
        text.textContent = context.text;
        button.textContent = context.button;
        button.dataset.action = context.action;
    }

    setupGestureSupport() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            const threshold = 50;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    // Swipe right
                    this.navigateToPrevSection();
                } else {
                    // Swipe left
                    this.navigateToNextSection();
                }
            }
            
            // Vertical swipe
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
                if (deltaY > 0) {
                    // Swipe down - show smart bar
                    this.smartBar.classList.add('visible');
                } else {
                    // Swipe up - hide smart bar
                    this.smartBar.classList.remove('visible');
                }
            }
        };
    }

    handleFABAction(action) {
        this.provideHapticFeedback();
        
        switch (action) {
            case 'schedule-demo':
                window.location.href = '#demo';
                break;
            case 'contact':
                window.location.href = 'mailto:konstantin@beneficious.com';
                break;
            case 'download':
                this.downloadInfo();
                break;
        }
        
        // Track action
        this.trackEvent('FAB', action);
    }

    handleSmartCTAClick() {
        const button = this.smartBar.querySelector('.smart-cta-button');
        const action = button.dataset.action;
        
        this.provideHapticFeedback();
        
        switch (action) {
            case 'demo':
                window.location.href = '#demo';
                break;
            case 'video':
                this.playDemoVideo();
                break;
            case 'beta':
                window.location.href = '#demo';
                break;
            case 'calendar':
                window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3M9SPgwXBs6D46gwHZPOoEty84sRO6BYk1wZ0Jh8sk-j9AKKs2jNRWLtgJcE9OILGot8J4q7O5', '_blank');
                break;
            case 'contact':
                window.location.href = '#contact';
                break;
        }
        
        // Track action
        this.trackEvent('SmartCTA', action);
    }

    navigateToNextSection() {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentIndex = sections.findIndex(s => s.id === this.currentSection);
        
        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            nextSection.scrollIntoView({ behavior: 'smooth' });
            this.showGestureHint('Navigated to next section');
        }
    }

    navigateToPrevSection() {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentIndex = sections.findIndex(s => s.id === this.currentSection);
        
        if (currentIndex > 0) {
            const prevSection = sections[currentIndex - 1];
            prevSection.scrollIntoView({ behavior: 'smooth' });
            this.showGestureHint('Navigated to previous section');
        }
    }

    downloadInfo() {
        // Create a downloadable PDF or document
        const content = `
Ralph - Autonomous Data Room Intelligence

Transform your due diligence process with AI-powered analysis:
• Process thousands of documents in minutes
• Proactive risk identification
• Seamless integration with existing tools
• Enterprise-grade security

Contact: konstantin@beneficious.com
Website: https://beneficious.com
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Ralph-Info.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Info downloaded!', 'success');
    }

    playDemoVideo() {
        // Placeholder for video functionality
        this.showNotification('Demo video coming soon!', 'info');
    }

    showGestureHint(message) {
        const hint = document.createElement('div');
        hint.className = 'gesture-hint show';
        hint.textContent = message;
        
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => hint.remove(), 300);
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    provideHapticFeedback(pattern = [10]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    trackEvent(category, action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`Event tracked: ${category} - ${action}`);
    }
}

// ============================================================================
// Mobile Navigation Manager
// ============================================================================

class MobileNavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.createBottomNavigation();
        this.setupActiveTracking();
    }

    createBottomNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'mobile-bottom-nav';
        nav.innerHTML = `
            <a href="#about" class="mobile-nav-item" data-section="about">
                <span class="mobile-nav-icon">ℹ️</span>
                <span class="mobile-nav-label">About</span>
            </a>
            <a href="#features" class="mobile-nav-item" data-section="features">
                <span class="mobile-nav-icon">✨</span>
                <span class="mobile-nav-label">Features</span>
            </a>
            <a href="#benefits" class="mobile-nav-item" data-section="benefits">
                <span class="mobile-nav-icon">📈</span>
                <span class="mobile-nav-label">Benefits</span>
            </a>
            <a href="#demo" class="mobile-nav-item" data-section="demo">
                <span class="mobile-nav-icon">🚀</span>
                <span class="mobile-nav-label">Demo</span>
            </a>
            <a href="#contact" class="mobile-nav-item" data-section="contact">
                <span class="mobile-nav-icon">💬</span>
                <span class="mobile-nav-label">Contact</span>
            </a>
        `;
        
        document.body.appendChild(nav);
        
        // Add click handlers
        nav.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href');
                const element = document.querySelector(target);
                
                if (element) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = element.offsetTop - headerHeight - 10;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                this.provideHapticFeedback();
            });
        });
    }

    setupActiveTracking() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    navItems.forEach(item => {
                        if (item.dataset.section === sectionId) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.5
        });
        
        sections.forEach(section => observer.observe(section));
    }

    provideHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate(5);
        }
    }
}

// ============================================================================
// PWA Manager
// ============================================================================

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.checkInstallStatus();
        this.setupShareTarget();
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Check if user dismissed install recently
            const dismissedTime = localStorage.getItem('pwa-install-dismissed');
            if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
                return; // Don't show for 7 days after dismissal
            }
            
            // Show custom install prompt after user has engaged
            setTimeout(() => {
                if (this.shouldShowInstallPrompt()) {
                    this.showInstallBanner();
                }
            }, 30000); // 30 seconds
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.trackEvent('PWA', 'installed');
            this.hideInstallBanner();
        });
    }

    shouldShowInstallPrompt() {
        // Check engagement metrics
        const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        const timeOnSite = performance.now() / 1000; // seconds
        const pageViews = parseInt(sessionStorage.getItem('pageViews') || '1');
        
        return scrollDepth > 50 && timeOnSite > 60 && pageViews > 2;
    }

    showInstallBanner() {
        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <img src="/android-chrome-192x192.png" alt="Ralph icon" width="48" height="48">
                <div class="install-text">
                    <strong>Install Ralph</strong>
                    <p>Quick access, offline support, better performance</p>
                </div>
                <button class="install-button">Install</button>
                <button class="dismiss-button" aria-label="Dismiss">✕</button>
            </div>
        `;
        
        banner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 10px;
            right: 10px;
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1001;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(banner);
        
        // Install button handler
        banner.querySelector('.install-button').addEventListener('click', () => {
            this.installPWA();
        });
        
        // Dismiss button handler
        banner.querySelector('.dismiss-button').addEventListener('click', () => {
            this.hideInstallBanner();
            localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        });
    }

    async installPWA() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`User ${outcome} the install prompt`);
        this.trackEvent('PWA', 'install-prompt', outcome);
        
        this.deferredPrompt = null;
        this.hideInstallBanner();
    }

    hideInstallBanner() {
        const banner = document.querySelector('.pwa-install-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => banner.remove(), 300);
        }
    }

    checkInstallStatus() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('App running in standalone mode');
            document.body.classList.add('pwa-installed');
            
            // Track PWA usage
            this.trackEvent('PWA', 'usage', 'standalone');
        }
    }

    setupShareTarget() {
        // Handle shared files if app is launched via share
        if (window.location.search.includes('share-target')) {
            this.handleSharedData();
        }
    }

    handleSharedData() {
        // Parse shared data from URL params
        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        const text = params.get('text');
        const url = params.get('url');
        
        if (title || text || url) {
            console.log('Received shared data:', { title, text, url });
            // Handle the shared data appropriately
            this.showNotification('Content shared successfully', 'success');
        }
    }

    trackEvent(category, action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    showNotification(message, type = 'info') {
        // Reuse notification method from other managers
        const notification = document.createElement('div');
        notification.className = `mobile-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            z-index: 9999;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// ============================================================================
// Mobile Experience Initialization
// ============================================================================

class MobileExperience {
    constructor() {
        this.managers = {};
        this.init();
    }

    init() {
        // Only initialize on mobile devices
        const env = new MobileEnvironment();
        if (!env.isMobile) {
            console.log('Desktop device detected, skipping mobile enhancements');
            return;
        }
        
        // Initialize all managers
        this.managers.offline = new OfflineManager();
        this.managers.performance = new PerformanceManager();
        this.managers.security = new SecurityIndicator();
        this.managers.cta = new SmartCTAManager();
        this.managers.navigation = new MobileNavigationManager();
        this.managers.pwa = new PWAManager();
        
        // Add mobile class to body
        document.body.classList.add('mobile-experience');
        
        // Setup global error handler
        this.setupErrorHandling();
        
        // Track mobile usage
        this.trackMobileUsage();
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Mobile experience error:', event.error);
            
            // Log to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    description: event.error.toString(),
                    fatal: false
                });
            }
        });
        
        // Handle promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    trackMobileUsage() {
        // Track device info
        const env = new MobileEnvironment();
        const deviceInfo = {
            platform: env.isIOS ? 'iOS' : env.isAndroid ? 'Android' : 'Other',
            standalone: env.isStandalone,
            connection: env.getConnectionQuality()
        };
        
        console.log('Mobile device info:', deviceInfo);
        
        // Track to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mobile_usage', {
                event_category: 'Mobile',
                custom_map: deviceInfo
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileExperience = new MobileExperience();
    });
} else {
    window.mobileExperience = new MobileExperience();
}

// Export for use in other scripts
window.MobileExperience = MobileExperience;