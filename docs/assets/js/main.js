// Main JavaScript file for site functionality

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuClose = document.querySelector('.mobile-menu-close');
  const navMenu = document.querySelector('.nav-menu');
  
  function openMenu() {
    // Store scroll position for iOS
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY;
    
    navMenu.classList.add('active');
    document.body.classList.add('menu-open');
    
    // Force background color with inline style for iOS
    navMenu.style.backgroundColor = 'rgb(40, 40, 40)';
    navMenu.style.background = 'rgb(40, 40, 40)';
    
    // iOS Safari fix - prevent background scrolling
    document.body.style.top = `-${scrollY}px`;
    menuToggle.textContent = '✕';
  }
  
  function closeMenu() {
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    // Clear inline styles
    navMenu.style.backgroundColor = '';
    navMenu.style.background = '';
    
    // Restore scroll position for iOS
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
    
    menuToggle.textContent = '☰';
  }
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
        menuToggle.textContent = '☰';
      } else {
        openMenu();
        menuToggle.textContent = '✕';
      }
    });
    
    // Close button
    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && 
          !menuToggle.contains(e.target) && 
          !navMenu.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Also handle clicks on nav menu items to close menu
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
}

// Pricing Toggle
function initPricingToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-option');
  const priceElement = document.querySelector('.price');
  const periodElement = document.querySelector('.price-period');
  
  if (toggleButtons.length > 0 && priceElement) {
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (button.dataset.period === 'yearly') {
          priceElement.textContent = '$16.67';
          periodElement.textContent = '/month';
          
          // Update pricing badge if exists
          const savingsBadge = document.querySelector('.savings-badge');
          if (savingsBadge) {
            savingsBadge.classList.remove('hidden');
          }
        } else {
          priceElement.textContent = '$19.99';
          periodElement.textContent = '/month';
          
          const savingsBadge = document.querySelector('.savings-badge');
          if (savingsBadge) {
            savingsBadge.classList.add('hidden');
          }
        }
      });
    });
  }
}

// Cookie Banner
function initCookieBanner() {
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptButton = document.querySelector('.cookie-accept');
  const rejectButton = document.querySelector('.cookie-reject');
  const settingsButton = document.querySelector('.cookie-settings');
  
  // Check if user has already made a choice
  const cookieChoice = localStorage.getItem('cookieConsent');
  
  if (!cookieChoice && cookieBanner) {
    cookieBanner.classList.remove('hidden');
  }
  
  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.add('hidden');
    });
  }
  
  if (rejectButton) {
    rejectButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.add('hidden');
    });
  }
  
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      // In a real implementation, this would open a cookie settings modal
      alert('Cookie settings would open here');
    });
  }
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Intersection Observer for Fade-in Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// Form Validation (for contact/feedback forms)
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        // In a real implementation, this would submit the form
        alert('Form submitted successfully!');
        form.reset();
      }
    });
  });
}

// Video Player Placeholder
function initVideoPlayer() {
  const videoContainers = document.querySelectorAll('.video-placeholder');
  
  videoContainers.forEach(container => {
    container.addEventListener('click', () => {
      // In the real implementation, this would start video playback
      container.innerHTML = '<div style="color: rgba(255,255,255,0.5);">Video Player Placeholder</div>';
    });
  });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initPricingToggle();
  initCookieBanner();
  initSmoothScroll();
  initScrollAnimations();
  initFormValidation();
  initVideoPlayer();
  
  // Add loaded class to body for initial animations
  document.body.classList.add('loaded');
});

// Handle navigation active states
function updateActiveNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Update active nav item on page load
updateActiveNavItem();

// Utility function to format dates (for blog posts)
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Export functions for use in other scripts if needed
window.siteUtils = {
  formatDate,
  updateActiveNavItem
};