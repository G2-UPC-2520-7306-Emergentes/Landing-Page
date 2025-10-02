
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
    const langToggleText = document.getElementById('langToggleText');
    let currentLang = 'en';

    const fetchTranslations = async (lang) => {
        const response = await fetch(`./i18n/${lang}.json`);
        return await response.json();
    };

    const updateContent = (translations) => {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
        document.querySelectorAll('[data-i18n-content]').forEach(element => {
            const key = element.getAttribute('data-i18n-content');
            if (translations[key]) {
                element.setAttribute('content', translations[key]);
            }
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const attrs = element.getAttribute('data-i18n-attr').split(';');
            attrs.forEach(attr => {
                const [attrName, key] = attr.split(':');
                if (translations[key]) {
                    element.setAttribute(attrName, translations[key]);
                }
            });
        });
    };

    if (langToggle) {
        langToggle.addEventListener('click', async () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            const translations = await fetchTranslations(currentLang);
            updateContent(translations);
            langToggleText.textContent = currentLang.toUpperCase();
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
