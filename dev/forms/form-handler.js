// Updated script.js for Ralph website with form handlers
// Add this to your existing script.js or create new form-handler.js

// Configuration - UPDATE THIS WITH YOUR DEPLOYED WEB APP URL
const FORM_HANDLER_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// Demo Request Form Handler
function handleDemoForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        formType: 'demo',
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        aum: formData.get('aum'),
        deals: formData.get('deals'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Submit form
    fetch(FORM_HANDLER_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type': 'text/plain'},
        body: JSON.stringify(data)
    })
    .then(() => {
        // Show success message
        showSuccessMessage('demo');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('demo');
    })
    .finally(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Newsletter Form Handler
function handleNewsletterForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        formType: 'newsletter',
        email: formData.get('email'),
        consent: form.querySelector('input[name="consent"]').checked
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    // Submit form
    fetch(FORM_HANDLER_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type': 'text/plain'},
        body: JSON.stringify(data)
    })
    .then(() => {
        // Show success message
        showSuccessMessage('newsletter');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('newsletter');
    })
    .finally(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// SuperReturn Meeting Form Handler
function handleSuperReturnCTA() {
    // This function can be called when clicking the SuperReturn button
    // You can either:
    // 1. Scroll to a meeting form section
    // 2. Open a modal with the form
    // 3. Redirect to a dedicated page
    
    // For now, let's create a simple modal
    createMeetingModal();
}

// Helper function to create meeting modal
function createMeetingModal() {
    // Check if modal already exists
    if (document.getElementById('meeting-modal')) {
        document.getElementById('meeting-modal').style.display = 'flex';
        return;
    }
    
    const modalHTML = `
        <div id="meeting-modal" class="modal" style="display: flex;">
            <div class="modal-content glass-card">
                <span class="close-modal">&times;</span>
                <h2>Schedule Meeting at SuperReturn Berlin 2025</h2>
                <p>Meet our team to see Ralph in action.</p>
                
                <form id="meeting-form" onsubmit="handleMeetingForm(event)">
                    <div class="form-group">
                        <label for="meeting-name">Name *</label>
                        <input type="text" id="meeting-name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="meeting-company">Company *</label>
                        <input type="text" id="meeting-company" name="company" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="meeting-email">Email *</label>
                        <input type="email" id="meeting-email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="meeting-phone">Phone</label>
                        <input type="tel" id="meeting-phone" name="phone">
                    </div>
                    
                    <div class="form-group">
                        <label>Preferred Meeting Times *</label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="times" value="Monday Morning">
                            <span class="checkmark"></span>
                            Monday Morning
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="times" value="Monday Afternoon">
                            <span class="checkmark"></span>
                            Monday Afternoon
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="times" value="Tuesday Morning">
                            <span class="checkmark"></span>
                            Tuesday Morning
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="times" value="Tuesday Afternoon">
                            <span class="checkmark"></span>
                            Tuesday Afternoon
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label for="meeting-focus">Meeting Focus</label>
                        <textarea id="meeting-focus" name="focus" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" class="cta-primary">Schedule Meeting</button>
                </form>
                
                <div id="meeting-success" class="success-message" style="display: none;">
                    Thank you! We'll confirm your meeting slot shortly.
                </div>
                
                <div id="meeting-error" class="error-message" style="display: none;">
                    There was an error. Please try again or email us directly.
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const modalStyles = `
            <style id="modal-styles">
                .modal {
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-content {
                    position: relative;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 2rem;
                }
                
                .close-modal {
                    position: absolute;
                    right: 1rem;
                    top: 1rem;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #666;
                }
                
                .close-modal:hover {
                    color: #000;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
    
    // Add close functionality
    document.querySelector('.close-modal').onclick = function() {
        document.getElementById('meeting-modal').style.display = 'none';
    };
    
    window.onclick = function(event) {
        const modal = document.getElementById('meeting-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Meeting Form Handler
function handleMeetingForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get selected times
    const times = [];
    form.querySelectorAll('input[name="times"]:checked').forEach(cb => {
        times.push(cb.value);
    });
    
    const data = {
        formType: 'meeting',
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        times: times,
        focus: formData.get('focus')
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Submit form
    fetch(FORM_HANDLER_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type': 'text/plain'},
        body: JSON.stringify(data)
    })
    .then(() => {
        // Show success message
        document.getElementById('meeting-success').style.display = 'block';
        form.style.display = 'none';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            document.getElementById('meeting-modal').style.display = 'none';
            form.style.display = 'block';
            document.getElementById('meeting-success').style.display = 'none';
            form.reset();
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('meeting-error').style.display = 'block';
    })
    .finally(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Helper functions
function showSuccessMessage(formType) {
    // Hide any existing messages
    hideAllMessages();
    
    // Show success based on form type
    if (formType === 'demo') {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Thank you! We\'ll contact you shortly to schedule your demo.';
        successDiv.style.display = 'block';
        
        const demoForm = document.querySelector('.demo-form');
        demoForm.insertBefore(successDiv, demoForm.firstChild);
        
        setTimeout(() => successDiv.remove(), 5000);
    } else if (formType === 'newsletter') {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Thank you for subscribing! Check your email to confirm.';
        successDiv.style.display = 'block';
        
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.insertBefore(successDiv, newsletterForm.firstChild);
        
        setTimeout(() => successDiv.remove(), 5000);
    }
}

function showErrorMessage(formType) {
    // Hide any existing messages
    hideAllMessages();
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'There was an error. Please try again or contact us directly at contact@beneficious.com';
    errorDiv.style.display = 'block';
    
    if (formType === 'demo') {
        const demoForm = document.querySelector('.demo-form');
        demoForm.insertBefore(errorDiv, demoForm.firstChild);
    } else if (formType === 'newsletter') {
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.insertBefore(errorDiv, newsletterForm.firstChild);
    }
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function hideAllMessages() {
    document.querySelectorAll('.success-message, .error-message').forEach(msg => {
        msg.remove();
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Update existing form handlers if forms exist
    const demoForm = document.querySelector('.contact-form');
    if (demoForm) {
        demoForm.removeAttribute('onsubmit');
        demoForm.addEventListener('submit', handleDemoForm);
    }
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.removeAttribute('onsubmit');
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
});

// Export functions for use in HTML
window.handleDemoForm = handleDemoForm;
window.handleNewsletterForm = handleNewsletterForm;
window.handleSuperReturnCTA = handleSuperReturnCTA;
window.handleMeetingForm = handleMeetingForm;
