function initMobileMenu() {
  const menu = document.querySelector('.nav-menu');
  const openButton = document.querySelector('.mobile-menu-toggle');
  const closeButton = document.querySelector('.mobile-menu-close');

  if (!menu || !openButton) return;

  function openMenu() {
    menu.classList.add('active');
    openButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('active');
    openButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openButton.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeButton?.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  const accept = document.querySelector('.cookie-accept');
  const reject = document.querySelector('.cookie-reject');
  const existingChoice = localStorage.getItem('beneficiousCookieChoice');

  if (!banner || existingChoice) return;

  banner.classList.remove('hidden');

  function storeChoice(choice) {
    localStorage.setItem('beneficiousCookieChoice', choice);
    banner.classList.add('hidden');
  }

  accept?.addEventListener('click', () => storeChoice('accepted'));
  reject?.addEventListener('click', () => storeChoice('rejected'));
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCookieBanner();
});
