/**
 * A/B Testing Configuration and Implementation
 * 
 * This file contains the configuration and implementation for A/B tests
 * focusing on the key areas identified for testing:
 * 1. Hero messaging variations
 * 2. CTA copy and placement
 * 3. Pricing transparency level
 * 4. Security messaging prominence
 */

class ABTestingFramework {
    constructor() {
        this.tests = {};
        this.userVariants = {};
        this.testResults = {};
        
        this.initializeTests();
    }
    
    initializeTests() {
        // Test 1: Hero Messaging Variations
        this.tests.hero_messaging = {
            name: 'Hero Messaging Variations',
            hypothesis: 'Different value propositions will resonate differently with PE personas',
            variants: {
                control: {
                    title: 'Autonomous Intelligence for Private Equity Data Rooms',
                    tagline: 'Where natural and artificial intelligence converge to transform due diligence',
                    weight: 34
                },
                ai_native: {
                    title: 'AI-Native Due Diligence for Private Equity',
                    tagline: 'Purpose-built autonomous intelligence that understands your investment process',
                    weight: 33
                },
                efficiency_focused: {
                    title: 'Accelerate Due Diligence by 70% with AI',
                    tagline: 'Autonomous data room analysis that finds what human reviewers miss',
                    weight: 33
                }
            },
            conversion_events: ['demo_request', 'superreturn_meeting', 'email_contact'],
            success_metrics: ['conversion_rate', 'engagement_time', 'scroll_depth']
        };
        
        // Test 2: CTA Copy and Placement
        this.tests.cta_optimization = {
            name: 'CTA Copy and Placement Optimization',
            hypothesis: 'Action-oriented CTAs with urgency will outperform generic scheduling CTAs',
            variants: {
                control: {
                    primary_text: 'Schedule a Demo',
                    secondary_text: 'Meet Us at SuperReturn Berlin',
                    placement: 'standard',
                    weight: 25
                },
                action_oriented: {
                    primary_text: 'See Ralph Transform Your Due Diligence',
                    secondary_text: 'Get Private Beta Access',
                    placement: 'standard',
                    weight: 25
                },
                urgency_focused: {
                    primary_text: 'Join the Private Beta (Limited Spots)',
                    secondary_text: 'Schedule SuperReturn Meeting Now',
                    placement: 'standard',
                    weight: 25
                },
                prominent_placement: {
                    primary_text: 'Schedule a Demo',
                    secondary_text: 'Meet Us at SuperReturn Berlin',
                    placement: 'sticky_header',
                    weight: 25
                }
            },
            conversion_events: ['demo_request', 'superreturn_meeting'],
            success_metrics: ['click_through_rate', 'conversion_rate', 'time_to_conversion']
        };
        
        // Test 3: Pricing Transparency Level
        this.tests.pricing_transparency = {
            name: 'Pricing Transparency Level',
            hypothesis: 'Some pricing information will build trust and qualify leads better',
            variants: {
                control: {
                    pricing_display: 'contact_only',
                    pricing_section: false,
                    weight: 33
                },
                value_based: {
                    pricing_display: 'value_proposition',
                    pricing_section: true,
                    content: 'Investment in Ralph typically pays for itself within the first major deal through accelerated timelines and enhanced risk detection.',
                    weight: 34
                },
                range_indication: {
                    pricing_display: 'enterprise_range',
                    pricing_section: true,
                    content: 'Enterprise pricing starts from $10K/month for small teams, with custom packages for larger organizations. Contact us for a tailored quote.',
                    weight: 33
                }
            },
            conversion_events: ['demo_request', 'email_contact'],
            success_metrics: ['qualified_leads', 'demo_completion_rate', 'sales_cycle_length']
        };
        
        // Test 4: Security Messaging Prominence
        this.tests.security_prominence = {
            name: 'Security Messaging Prominence',
            hypothesis: 'Higher security messaging prominence will increase conversions for security-conscious PE firms',
            variants: {
                control: {
                    security_position: 'standard',
                    hero_security_badges: false,
                    security_cta: false,
                    weight: 33
                },
                high_prominence: {
                    security_position: 'second_section',
                    hero_security_badges: true,
                    security_cta: true,
                    security_cta_text: 'View Security Documentation',
                    weight: 34
                },
                security_first: {
                    security_position: 'first_section',
                    hero_security_badges: true,
                    security_cta: true,
                    security_cta_text: 'Get Security Assessment',
                    hero_security_headline: 'Enterprise-Grade Security for Private Equity',
                    weight: 33
                }
            },
            conversion_events: ['demo_request', 'security_documentation_request'],
            success_metrics: ['security_section_engagement', 'conversion_rate', 'persona_conversion_rate']
        };
        
        // Test 5: Social Proof and Trust Signals
        this.tests.social_proof = {
            name: 'Social Proof and Trust Signals',
            hypothesis: 'Specific trust signals will increase credibility and conversions',
            variants: {
                control: {
                    trust_signals: 'compliance_badges',
                    social_proof: false,
                    weight: 33
                },
                client_focused: {
                    trust_signals: 'compliance_badges',
                    social_proof: true,
                    testimonial: '"Ralph identified critical risks in our target company that our team missed in the initial review." - Managing Director, European PE Firm',
                    stats: '12+ PE firms in private beta',
                    weight: 34
                },
                authority_focused: {
                    trust_signals: 'compliance_badges',
                    social_proof: true,
                    authority_indicators: true,
                    team_credentials: 'Founded by former Goldman Sachs analysts and Google AI researchers',
                    industry_recognition: 'Featured in Private Equity International',
                    weight: 33
                }
            },
            conversion_events: ['demo_request', 'newsletter_signup'],
            success_metrics: ['trust_score', 'conversion_rate', 'time_on_site']
        };
    }
    
    // Assign user to test variants
    assignUserToTests() {
        for (const [testName, testConfig] of Object.entries(this.tests)) {
            this.userVariants[testName] = this.assignVariant(testName, testConfig);
        }
        
        // Store assignments in localStorage for consistency
        localStorage.setItem('ab_test_assignments', JSON.stringify(this.userVariants));
        
        // Track test assignments
        if (window.analyticsFramework) {
            window.analyticsFramework.trackEvent('ab_test_assigned', {
                test_assignments: this.userVariants,
                session_id: this.generateSessionId()
            });
        }
    }
    
    assignVariant(testName, testConfig) {
        // Check if user already has assignment
        const storedAssignments = JSON.parse(localStorage.getItem('ab_test_assignments') || '{}');
        if (storedAssignments[testName]) {
            return storedAssignments[testName];
        }
        
        // Calculate cumulative weights
        const variants = Object.entries(testConfig.variants);
        const totalWeight = variants.reduce((sum, [, variant]) => sum + variant.weight, 0);
        
        // Generate random number
        const random = Math.random() * totalWeight;
        
        // Select variant based on weight
        let cumulativeWeight = 0;
        for (const [variantName, variant] of variants) {
            cumulativeWeight += variant.weight;
            if (random <= cumulativeWeight) {
                return variantName;
            }
        }
        
        // Fallback to first variant
        return variants[0][0];
    }
    
    // Apply test variants to the page
    applyTestVariants() {
        this.applyHeroMessagingTest();
        this.applyCTAOptimizationTest();
        this.applyPricingTransparencyTest();
        this.applySecurityProminenceTest();
        this.applySocialProofTest();
    }
    
    applyHeroMessagingTest() {
        const variant = this.userVariants.hero_messaging;
        const testConfig = this.tests.hero_messaging.variants[variant];
        
        if (!testConfig) return;
        
        const heroTitle = document.querySelector('.hero-title');
        const heroTagline = document.querySelector('.hero-tagline');
        
        if (heroTitle) {
            heroTitle.textContent = testConfig.title;
            heroTitle.setAttribute('data-ab-test', 'hero_messaging');
            heroTitle.setAttribute('data-ab-variant', variant);
        }
        
        if (heroTagline) {
            heroTagline.textContent = testConfig.tagline;
        }
    }
    
    applyCTAOptimizationTest() {
        const variant = this.userVariants.cta_optimization;
        const testConfig = this.tests.cta_optimization.variants[variant];
        
        if (!testConfig) return;
        
        // Update CTA text
        const primaryCTAs = document.querySelectorAll('.cta-primary');
        const secondaryCTAs = document.querySelectorAll('.cta-secondary');
        
        primaryCTAs.forEach(cta => {
            if (cta.textContent.includes('Schedule') || cta.textContent.includes('Demo')) {
                cta.textContent = testConfig.primary_text;
                cta.setAttribute('data-ab-test', 'cta_optimization');
                cta.setAttribute('data-ab-variant', variant);
            }
        });
        
        secondaryCTAs.forEach(cta => {
            if (cta.textContent.includes('SuperReturn') || cta.textContent.includes('Meet')) {
                cta.textContent = testConfig.secondary_text;
            }
        });
        
        // Apply placement changes
        if (testConfig.placement === 'sticky_header') {
            this.addStickyCTA(testConfig.primary_text);
        }
    }
    
    addStickyCTA(ctaText) {
        const stickyCTA = document.createElement('div');
        stickyCTA.className = 'sticky-cta';
        stickyCTA.innerHTML = `
            <button class="cta-primary sticky-cta-button" onclick="window.analyticsFramework.trackEvent('demo_request', {source: 'sticky_cta'})">
                ${ctaText}
            </button>
        `;
        
        stickyCTA.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 999;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(stickyCTA);
    }
    
    applyPricingTransparencyTest() {
        const variant = this.userVariants.pricing_transparency;
        const testConfig = this.tests.pricing_transparency.variants[variant];
        
        if (!testConfig || !testConfig.pricing_section) return;
        
        // Create pricing section
        const pricingSection = document.createElement('section');
        pricingSection.className = 'pricing-transparency';
        pricingSection.setAttribute('data-ab-test', 'pricing_transparency');
        pricingSection.setAttribute('data-ab-variant', variant);
        
        pricingSection.innerHTML = `
            <div class="container">
                <div class="glass-card">
                    <h3>Investment Information</h3>
                    <p>${testConfig.content}</p>
                    <a href="#demo" class="cta-secondary">Get Custom Quote</a>
                </div>
            </div>
        `;
        
        // Insert before contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.parentNode.insertBefore(pricingSection, contactSection);
        }
    }
    
    applySecurityProminenceTest() {
        const variant = this.userVariants.security_prominence;
        const testConfig = this.tests.security_prominence.variants[variant];
        
        if (!testConfig) return;
        
        const securitySection = document.querySelector('#security');
        if (!securitySection) return;
        
        securitySection.setAttribute('data-ab-test', 'security_prominence');
        securitySection.setAttribute('data-ab-variant', variant);
        
        // Apply positioning changes
        if (testConfig.security_position === 'first_section') {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.parentNode.insertBefore(securitySection, aboutSection);
            }
        } else if (testConfig.security_position === 'second_section') {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                featuresSection.parentNode.insertBefore(securitySection, featuresSection);
            }
        }
        
        // Add hero security badges
        if (testConfig.hero_security_badges) {
            const trustBadges = document.querySelector('.trust-badges');
            if (trustBadges) {
                trustBadges.style.display = 'flex';
                trustBadges.style.marginTop = '2rem';
            }
        }
        
        // Add security CTA
        if (testConfig.security_cta) {
            const securityCTA = document.createElement('div');
            securityCTA.className = 'security-cta-test';
            securityCTA.innerHTML = `
                <a href="mailto:security@beneficious.com" class="cta-secondary" onclick="window.analyticsFramework.trackEvent('security_documentation_request', {source: 'ab_test'})">
                    ${testConfig.security_cta_text}
                </a>
            `;
            
            const securityHeader = securitySection.querySelector('.security-header');
            if (securityHeader) {
                securityHeader.appendChild(securityCTA);
            }
        }
        
        // Add security-first headline
        if (testConfig.hero_security_headline) {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const securityHeadline = document.createElement('p');
                securityHeadline.className = 'security-headline';
                securityHeadline.textContent = testConfig.hero_security_headline;
                securityHeadline.style.cssText = `
                    color: var(--color-accent-primary);
                    font-weight: 600;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                `;
                
                const heroTitle = heroContent.querySelector('.hero-title');
                if (heroTitle) {
                    heroContent.insertBefore(securityHeadline, heroTitle);
                }
            }
        }
    }
    
    applySocialProofTest() {
        const variant = this.userVariants.social_proof;
        const testConfig = this.tests.social_proof.variants[variant];
        
        if (!testConfig || !testConfig.social_proof) return;
        
        // Create social proof section
        const socialProofSection = document.createElement('section');
        socialProofSection.className = 'social-proof-test';
        socialProofSection.setAttribute('data-ab-test', 'social_proof');
        socialProofSection.setAttribute('data-ab-variant', variant);
        
        let socialProofHTML = '<div class="container"><div class="glass-card">';
        
        if (testConfig.testimonial) {
            socialProofHTML += `
                <blockquote class="testimonial">
                    ${testConfig.testimonial}
                </blockquote>
            `;
        }
        
        if (testConfig.stats) {
            socialProofHTML += `
                <div class="stats">
                    <p><strong>${testConfig.stats}</strong></p>
                </div>
            `;
        }
        
        if (testConfig.team_credentials) {
            socialProofHTML += `
                <div class="team-credentials">
                    <p>${testConfig.team_credentials}</p>
                </div>
            `;
        }
        
        if (testConfig.industry_recognition) {
            socialProofHTML += `
                <div class="industry-recognition">
                    <p>${testConfig.industry_recognition}</p>
                </div>
            `;
        }
        
        socialProofHTML += '</div></div>';
        socialProofSection.innerHTML = socialProofHTML;
        
        // Insert after hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.parentNode.insertBefore(socialProofSection, heroSection.nextSibling);
        }
    }
    
    // Track test results
    trackConversion(eventName, testName = null) {
        if (testName) {
            // Track specific test conversion
            const variant = this.userVariants[testName];
            if (variant) {
                this.recordTestResult(testName, variant, 'conversion', eventName);
            }
        } else {
            // Track conversion for all active tests
            for (const [testName, testConfig] of Object.entries(this.tests)) {
                if (testConfig.conversion_events.includes(eventName)) {
                    const variant = this.userVariants[testName];
                    if (variant) {
                        this.recordTestResult(testName, variant, 'conversion', eventName);
                    }
                }
            }
        }
    }
    
    recordTestResult(testName, variant, metricType, value) {
        if (!this.testResults[testName]) {
            this.testResults[testName] = {};
        }
        
        if (!this.testResults[testName][variant]) {
            this.testResults[testName][variant] = {
                exposures: 0,
                conversions: 0,
                metrics: {}
            };
        }
        
        if (metricType === 'conversion') {
            this.testResults[testName][variant].conversions++;
        } else {
            this.testResults[testName][variant].metrics[metricType] = value;
        }
        
        // Send to analytics
        if (window.analyticsFramework) {
            window.analyticsFramework.trackEvent('ab_test_result', {
                test_name: testName,
                variant: variant,
                metric_type: metricType,
                value: value,
                timestamp: Date.now()
            });
        }
    }
    
    // Get test results for analysis
    getTestResults() {
        return this.testResults;
    }
    
    // Statistical significance calculation
    calculateSignificance(testName) {
        const results = this.testResults[testName];
        if (!results) return null;
        
        const variants = Object.keys(results);
        if (variants.length < 2) return null;
        
        // Simple two-proportion z-test
        const control = results[variants[0]];
        const treatment = results[variants[1]];
        
        if (!control || !treatment) return null;
        
        const n1 = control.exposures;
        const n2 = treatment.exposures;
        const x1 = control.conversions;
        const x2 = treatment.conversions;
        
        if (n1 === 0 || n2 === 0) return null;
        
        const p1 = x1 / n1;
        const p2 = x2 / n2;
        const p = (x1 + x2) / (n1 + n2);
        
        const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
        const z = (p2 - p1) / se;
        const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
        
        return {
            control_conversion_rate: p1,
            treatment_conversion_rate: p2,
            lift: ((p2 - p1) / p1) * 100,
            z_score: z,
            p_value: pValue,
            significant: pValue < 0.05,
            confidence: (1 - pValue) * 100
        };
    }
    
    // Normal CDF approximation
    normalCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }
    
    // Error function approximation
    erf(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    }
    
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize A/B testing framework
document.addEventListener('DOMContentLoaded', () => {
    window.abTestingFramework = new ABTestingFramework();
    window.abTestingFramework.assignUserToTests();
    window.abTestingFramework.applyTestVariants();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ABTestingFramework;
}