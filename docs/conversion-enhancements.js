/**
 * Conversion Enhancement JavaScript
 * Implements sophisticated conversion tracking and optimization for PE buyers
 */

// ROI Calculator functionality
function initializeROICalculator() {
    const form = document.getElementById('roi-form');
    if (!form) return;
    
    // Input elements
    const dealsPerYear = document.getElementById('deals-per-year');
    const teamSize = document.getElementById('team-size');
    const avgDealSize = document.getElementById('avg-deal-size');
    const ddWeeks = document.getElementById('dd-weeks');
    
    // Result elements
    const timeSaved = document.getElementById('time-saved');
    const costSaved = document.getElementById('cost-saved');
    const extraDeals = document.getElementById('extra-deals');
    const roiPercentage = document.getElementById('roi-percentage');
    
    function calculateROI() {
        // Constants based on PE data
        const HOURS_PER_WEEK = 40;
        const WEEKS_PER_YEAR = 48;
        const COST_PER_HOUR = 280; // €280/hour for PE professionals
        const RALPH_TIME_REDUCTION = 0.7; // 70% time savings
        const RALPH_ANNUAL_COST = 300000; // €300K average
        
        // Calculate current state
        const currentHoursPerDeal = parseInt(ddWeeks.value) * HOURS_PER_WEEK * parseInt(teamSize.value);
        const currentAnnualHours = currentHoursPerDeal * parseInt(dealsPerYear.value);
        const currentAnnualCost = currentAnnualHours * COST_PER_HOUR;
        
        // Calculate with Ralph
        const ralphHoursPerDeal = currentHoursPerDeal * (1 - RALPH_TIME_REDUCTION);
        const ralphAnnualHours = ralphHoursPerDeal * parseInt(dealsPerYear.value);
        const hoursSaved = currentAnnualHours - ralphAnnualHours;
        
        // Calculate savings
        const laborCostSaved = hoursSaved * COST_PER_HOUR;
        const netSavings = laborCostSaved - RALPH_ANNUAL_COST;
        
        // Calculate additional deal capacity
        const hoursPerDeal = parseInt(ddWeeks.value) * HOURS_PER_WEEK * parseInt(teamSize.value);
        const additionalDeals = Math.floor(hoursSaved / ralphHoursPerDeal);
        
        // Calculate ROI
        const roi = ((netSavings / RALPH_ANNUAL_COST) * 100).toFixed(0);
        
        // Update display
        timeSaved.textContent = `${hoursSaved.toLocaleString()} hours`;
        costSaved.textContent = `€${(netSavings / 1000).toFixed(0)}K`;
        extraDeals.textContent = `+${additionalDeals} deals`;
        roiPercentage.textContent = `${roi}%`;
        
        // Add animation
        document.querySelectorAll('.result-value').forEach(el => {
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 600);
        });
    }
    
    // Calculate on input change
    [dealsPerYear, teamSize, avgDealSize, ddWeeks].forEach(input => {
        input.addEventListener('input', calculateROI);
    });
    
    // Initial calculation
    calculateROI();
}

// Exit Intent Modal
function initializeExitIntent() {
    const modal = document.createElement('div');
    modal.className = 'exit-intent-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close">&times;</button>
            <h3>Before You Go...</h3>
            <p class="modal-title">Get our PE AI Transformation Guide</p>
            <p class="modal-subtitle">See how top firms achieve 70% faster due diligence</p>
            <form class="quick-capture-form" id="exit-capture-form">
                <input type="email" 
                       placeholder="your.name@pefirm.com" 
                       required 
                       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                <button type="submit">Send Guide</button>
            </form>
            <p class="privacy-note">We respect your privacy. No spam, ever.</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let hasShown = false;
    
    // Exit intent detection
    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && !hasShown && !sessionStorage.getItem('exitIntentShown')) {
            modal.classList.add('active');
            hasShown = true;
            sessionStorage.setItem('exitIntentShown', 'true');
        }
    });
    
    // Close functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Form submission
    const form = modal.querySelector('#exit-capture-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead', {
                'event_category': 'Exit Intent',
                'event_label': 'PE AI Guide Download',
                'value': 50
            });
        }
        
        // Submit to backend (implement your endpoint)
        try {
            // Placeholder for actual submission
            console.log('Guide requested for:', email);
            
            // Show success
            form.innerHTML = '<p class="success-message">✓ Check your email!</p>';
            setTimeout(() => modal.classList.remove('active'), 3000);
        } catch (error) {
            console.error('Submission error:', error);
        }
    });
}

// Floating CTA Bar
function initializeFloatingCTA() {
    const floatingBar = document.createElement('div');
    floatingBar.className = 'floating-cta-bar';
    floatingBar.innerHTML = `
        <div class="floating-content">
            <span class="cta-message">€47K saved per €100M deal</span>
            <a href="#roi-calculator" class="cta-compact">See How</a>
        </div>
    `;
    
    document.body.appendChild(floatingBar);
    
    // Show after scrolling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 500) {
            floatingBar.classList.add('visible');
        }
        
        // Hide when scrolling up
        if (currentScroll < lastScroll && currentScroll > 500) {
            floatingBar.classList.add('visible');
        } else if (currentScroll > lastScroll) {
            floatingBar.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
    });
}

// Progressive Disclosure for Enterprise Features
function initializeProgressiveDisclosure() {
    const securityLink = document.querySelector('.security-link');
    if (!securityLink) return;
    
    securityLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create security details modal
        const modal = document.createElement('div');
        modal.className = 'security-modal';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <button class="modal-close">&times;</button>
                <h2>Enterprise Security Architecture</h2>
                <div class="security-grid">
                    <div class="security-item">
                        <h3>🔒 Private Deployment</h3>
                        <p>Ralph runs entirely on your infrastructure. Your data never leaves your control.</p>
                    </div>
                    <div class="security-item">
                        <h3>🛡️ Compliance</h3>
                        <p>SOC 2 Type II, GDPR compliant. EU AI Act ready. Full audit trails.</p>
                    </div>
                    <div class="security-item">
                        <h3>🔐 Encryption</h3>
                        <p>End-to-end encryption. Zero-knowledge architecture. Air-gapped options.</p>
                    </div>
                    <div class="security-item">
                        <h3>🏛️ Governance</h3>
                        <p>Role-based access. Multi-factor authentication. IP whitelisting.</p>
                    </div>
                </div>
                <div class="security-cta">
                    <p>Ready to discuss your security requirements?</p>
                    <a href="#pilot" class="cta-primary">Start Secure Pilot</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('active');
        
        // Close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
}

// Persona-based CTA optimization
function optimizeCTAsByPersona() {
    // Detect user behavior patterns
    let pageViews = parseInt(localStorage.getItem('ralphPageViews') || '0');
    let technicalInterest = parseInt(localStorage.getItem('ralphTechInterest') || '0');
    let pricingInterest = parseInt(localStorage.getItem('ralphPricingInterest') || '0');
    
    pageViews++;
    localStorage.setItem('ralphPageViews', pageViews);
    
    // Track technical vs business interest
    document.addEventListener('click', (e) => {
        if (e.target.closest('.features')) {
            technicalInterest++;
            localStorage.setItem('ralphTechInterest', technicalInterest);
        }
        if (e.target.textContent.includes('pric') || e.target.textContent.includes('cost')) {
            pricingInterest++;
            localStorage.setItem('ralphPricingInterest', pricingInterest);
        }
    });
    
    // Personalize CTAs after 3 page views
    if (pageViews >= 3) {
        const primaryCTA = document.querySelector('.hero-cta .cta-primary');
        
        if (technicalInterest > pricingInterest) {
            // Technical persona (Innovation Leader)
            primaryCTA.textContent = 'Explore Technical Architecture';
            primaryCTA.href = '#architecture';
        } else if (pricingInterest > technicalInterest) {
            // CFO persona
            primaryCTA.textContent = 'View Transparent Pricing';
            primaryCTA.href = '#pricing';
        }
    }
}

// Initialize all conversion enhancements
function initializeConversionEnhancements() {
    initializeROICalculator();
    initializeExitIntent();
    initializeFloatingCTA();
    initializeProgressiveDisclosure();
    optimizeCTAsByPersona();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConversionEnhancements);
} else {
    initializeConversionEnhancements();
}