
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileNav = document.querySelector('.header__mobile-nav');
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-nav-open');
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('theme-dark');
            const isPressed = themeToggle.getAttribute('aria-pressed') === 'true';
            themeToggle.setAttribute('aria-pressed', !isPressed);
        });
    }

    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            // Language toggle functionality here
        });
    }

    // Accordion
    const accordionButtons = document.querySelectorAll('.faq-card__trigger');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            if (panel) {
                panel.hidden = isExpanded;
            }
        });
    });
});
