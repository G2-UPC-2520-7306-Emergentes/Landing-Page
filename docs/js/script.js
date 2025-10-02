document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORS ---
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const langToggleText = document.getElementById('langToggleText');
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileNav = document.querySelector('.header__mobile-nav');

    // --- STATE ---
    let translations = {};
    const defaultLang = 'en';
    const availableLangs = ['en', 'es'];
    let mouseMoveRequest = null;
    let themeTransitionTimeout = null;
    let themeInitialized = false;

    const fallbackFormErrors = {
        en: {
            required: 'This field is required.',
            email: 'Enter a valid email address.',
            phone: 'Enter a valid phone number.',
            captcha: 'Complete the captcha.',
            captchaShort: 'Enter a valid captcha value.'
        },
        es: {
            required: 'Este campo es obligatorio.',
            email: 'Ingresa un correo electrónico válido.',
            phone: 'Ingresa un teléfono válido.',
            captcha: 'Completa el captcha.',
            captchaShort: 'Ingresa un valor válido en el captcha.'
        }
    };

    // --- I18N ---
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`./i18n/${lang}.json`);
            if (!response.ok) {
                console.error(`Could not load ${lang}.json.`);
                if (lang !== defaultLang) return loadTranslations(defaultLang);
                return;
            }
            translations = await response.json();
            translatePage(lang);
        } catch (error) {
            console.error('Error loading translation file:', error);
        }
    }

    const normalizeLang = (lang) => availableLangs.includes(lang) ? lang : defaultLang;

    function getActiveLang() {
        return normalizeLang(document.documentElement.lang || defaultLang);
    }

    function translatePage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = getTranslation(el.getAttribute('data-i18n')));
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = getTranslation(el.getAttribute('data-i18n-placeholder')));
        document.querySelectorAll('[data-i18n-content]').forEach(el => el.setAttribute('content', getTranslation(el.getAttribute('data-i18n-content'))));
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const mappings = el.getAttribute('data-i18n-attr');
            if (!mappings) return;
            mappings.split(';').forEach(mapping => {
                const [attr, key] = mapping.split(':').map(part => part && part.trim());
                if (!attr || !key) return;
                const value = getTranslation(key);
                if (value) {
                    el.setAttribute(attr, value);
                }
            });
        });
        document.querySelectorAll('.faq').forEach(section => {
            section.removeAttribute('data-accordion-init');
        });
        setupAccordions();
        initCardTilt();
        initSegmentTabs();
        initFeatureChips();
        initLeadFormValidation();
        initFaqAccordion();
        initWhatsAppFab();
        initScrollAnimations(); // Re-trigger animations for new elements
        updateLanguageToggleUI(lang);
    }

    function refreshThemeToggleLabel(lang = getActiveLang()) {
        if (!themeToggle) return;
        const normalizedLang = normalizeLang(lang);
        const isDark = (document.documentElement.dataset.theme || '').toLowerCase() === 'dark' || document.documentElement.classList.contains('theme-dark');
        const label = isDark
            ? (normalizedLang === 'es' ? 'Cambiar a tema claro' : 'Switch to light theme')
            : (normalizedLang === 'es' ? 'Cambiar a tema oscuro' : 'Switch to dark theme');
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('aria-pressed', isDark);
    }

    function updateLanguageToggleUI(lang) {
        const normalizedLang = normalizeLang(lang);
        if (langToggleText) {
            langToggleText.textContent = normalizedLang.toUpperCase();
        }
        if (langToggle) {
            const label = normalizedLang === 'es' ? 'Cambiar idioma a inglés (EN)' : 'Switch language to Spanish (ES)';
            langToggle.setAttribute('aria-label', label);
            langToggle.setAttribute('aria-pressed', normalizedLang === 'es');
        }
        if (mobileToggle) {
            const isOpened = document.body.classList.contains('mobile-nav-open');
            const closedLabel = normalizedLang === 'es' ? 'Abrir menú' : 'Open menu';
            const openLabel = normalizedLang === 'es' ? 'Cerrar menú' : 'Close menu';
            mobileToggle.setAttribute('aria-label', isOpened ? openLabel : closedLabel);
        }
        refreshThemeToggleLabel(normalizedLang);
    }

    function getTranslation(key) {
        return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : key, translations);
    }

    function getErrorMessage(key) {
        const translationKey = `form.errors.${key}`;
        const translation = getTranslation(translationKey);
        if (translation && translation !== translationKey) {
            return translation;
        }
        const activeLang = getActiveLang();
        if (fallbackFormErrors[activeLang] && fallbackFormErrors[activeLang][key]) {
            return fallbackFormErrors[activeLang][key];
        }
        return fallbackFormErrors[defaultLang][key] || '';
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = getActiveLang();
            const currentIndex = availableLangs.indexOf(currentLang);
            const nextLang = availableLangs[(currentIndex + 1) % availableLangs.length];
            localStorage.setItem('lang', nextLang);
            loadTranslations(nextLang);
        });
    }

    // --- THEME ---
    const sunIcon = themeToggle ? themeToggle.querySelector('.icon-sun') : null;
    const moonIcon = themeToggle ? themeToggle.querySelector('.icon-moon') : null;
    function applyTheme(theme) {
        const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const shouldAnimate = themeInitialized && !prefersReducedMotion;
        if (shouldAnimate) {
            if (themeTransitionTimeout) {
                clearTimeout(themeTransitionTimeout);
            }
            document.documentElement.classList.add('theme-transition');
            themeTransitionTimeout = window.setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 650);
        } else {
            document.documentElement.classList.remove('theme-transition');
        }
        document.documentElement.dataset.theme = normalizedTheme;
        document.documentElement.classList.toggle('theme-dark', normalizedTheme === 'dark');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = normalizedTheme === 'dark' ? 'none' : 'inline';
            moonIcon.style.display = normalizedTheme === 'dark' ? 'inline' : 'none';
        }
        refreshThemeToggleLabel();
        themeInitialized = true;
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = (document.documentElement.dataset.theme || (document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light')).toLowerCase();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // --- MOBILE NAV ---
    mobileToggle.addEventListener('click', () => {
        const isOpened = document.body.classList.toggle('mobile-nav-open');
        const currentLang = getActiveLang();
        mobileToggle.setAttribute('aria-expanded', isOpened);
        mobileToggle.setAttribute('aria-label', isOpened ? (currentLang === 'es' ? 'Cerrar menú' : 'Close menu') : (currentLang === 'es' ? 'Abrir menú' : 'Open menu'));
    });
    mobileNav.addEventListener('click', e => {
        if (e.target.closest('a')) {
            document.body.classList.remove('mobile-nav-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            const currentLang = getActiveLang();
            mobileToggle.setAttribute('aria-label', currentLang === 'es' ? 'Abrir menú' : 'Open menu');
        }
    });

    // --- ACCORDION ---
    function setupAccordions() { document.querySelectorAll('.accordion').forEach(acc => acc.addEventListener('click', e => { const btn = e.target.closest('.accordion__button'); if (!btn) return; const isExpanded = btn.getAttribute('aria-expanded') === 'true'; const content = btn.nextElementSibling; btn.setAttribute('aria-expanded', !isExpanded); content.style.display = isExpanded ? 'none' : 'block'; if (btn.querySelector('.accordion__icon')) btn.querySelector('.accordion__icon').textContent = isExpanded ? '+' : '-'; })); }

    // --- FORM ---
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            showToast(getTranslation('form.fields.success'));
            contactForm.reset();
        });
    }
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', function (e) { const href = this.getAttribute('href'); if (href.length > 1) { e.preventDefault(); document.querySelector(href).scrollIntoView({ behavior: 'smooth' }); } }));

    // --- INTERACTIVE EFFECTS ---
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (entry.target.classList.contains('reveal-stagger')) {
                        entry.target.querySelectorAll('.reveal-on-scroll > * > *').forEach((child, i) => {
                            child.style.setProperty('--stagger-delay', `${i * 100}ms`);
                        });
                    }
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }

    function initMouseEffects() {
        document.body.addEventListener('mousemove', (e) => {
            if (mouseMoveRequest) cancelAnimationFrame(mouseMoveRequest);
            mouseMoveRequest = requestAnimationFrame(() => {
                document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
                document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
            });
        });
    }

    function initCardTilt() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = card.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                const rotateX = (y - height / 2) / (height / 2) * -7;
                const rotateY = (x - width / 2) / (width / 2) * 7;
                card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                card.style.setProperty('--mouse-x', `${(x / width) * 100}%`);
                card.style.setProperty('--mouse-y', `${(y / height) * 100}%`);
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    function initSegmentTabs() {
        const container = document.querySelector('.target-segments');
        if (!container) return;
        const tablist = container.querySelector('.segments-tabs');
        if (!tablist) return;
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        const panels = Array.from(container.querySelectorAll('.segments-panel'));
        if (!tabs.length || !panels.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const activateTab = (nextTab, { setFocus = false } = {}) => {
            tabs.forEach(tab => {
                const isSelected = tab === nextTab;
                tab.setAttribute('aria-selected', isSelected);
                tab.tabIndex = isSelected ? 0 : -1;
                if (isSelected) {
                    if (setFocus) {
                        requestAnimationFrame(() => tab.focus());
                    }
                    if (!prefersReducedMotion && typeof tab.scrollIntoView === 'function') {
                        tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
                    }
                }
            });
            panels.forEach(panel => {
                const isActive = panel.getAttribute('aria-labelledby') === nextTab.id;
                if (isActive) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
            });
        };

        tabs.forEach((tab, index) => {
            if (tab.dataset.segmentTabInit === 'true') return;
            tab.dataset.segmentTabInit = 'true';
            tab.addEventListener('click', () => activateTab(tab, { setFocus: false }));
            tab.addEventListener('keydown', (event) => {
                let newIndex = null;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    newIndex = (index + 1) % tabs.length;
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    newIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (event.key === 'Home') {
                    newIndex = 0;
                } else if (event.key === 'End') {
                    newIndex = tabs.length - 1;
                }
                if (newIndex !== null) {
                    event.preventDefault();
                    activateTab(tabs[newIndex], { setFocus: true });
                }
            });
        });

        const current = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
        if (current) {
            activateTab(current, { setFocus: false });
        }
    }

    function initFeatureChips() {
        const section = document.querySelector('.caracteristicas');
        if (!section) return;
        const chips = Array.from(section.querySelectorAll('.caracteristicas__chip[data-target]'));
        if (!chips.length) return;

        const highlightTimers = new WeakMap();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const highlightDuration = prefersReducedMotion ? 1600 : 2600;

        const getHeaderOffset = () => {
            const header = document.querySelector('.header');
            return header ? header.offsetHeight + 24 : 24;
        };

        const scrollToTarget = (target) => {
            if (!target) return;
            const rect = target.getBoundingClientRect();
            const currentScroll = window.scrollY || window.pageYOffset || 0;
            const top = currentScroll + rect.top - getHeaderOffset();
            window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        };

        const highlight = (target) => {
            if (!target) return;
            const existing = highlightTimers.get(target);
            if (existing) {
                clearTimeout(existing);
            }
            target.classList.add('is-highlighted');
            const timer = window.setTimeout(() => {
                target.classList.remove('is-highlighted');
                highlightTimers.delete(target);
            }, highlightDuration);
            highlightTimers.set(target, timer);
        };

        chips.forEach(chip => {
            if (chip.dataset.featureChipInit === 'true') return;
            chip.dataset.featureChipInit = 'true';
            chip.addEventListener('click', () => {
                const selector = chip.getAttribute('data-target');
                if (!selector) return;
                const target = document.querySelector(selector);
                if (!target) return;
                scrollToTarget(target);
                highlight(target);
            });
        });
    }

    function initLeadFormValidation() {
        const form = document.getElementById('lead-form');
        if (!form || form.dataset.initialized === 'true') return;
        form.dataset.initialized = 'true';

        const fields = Array.from(form.querySelectorAll('input, textarea')).filter(field => field.id !== 'lead-site');
        const submitButton = form.querySelector('.lead-form__submit');
        const feedback = document.getElementById('lead-form-feedback');
        const honeypot = document.getElementById('lead-site');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+()\d\s-]{7,}$/;

        const getError = (field) => {
            const value = field.value.trim();
            if (field.required && !value) {
                if (field.type === 'email') return getErrorMessage('email');
                if (field.id === 'lead-captcha') return getErrorMessage('captcha');
                return getErrorMessage('required');
            }
            if (field.type === 'email' && value && !emailRegex.test(value)) {
                return getErrorMessage('email');
            }
            if (field.type === 'tel' && value && !phoneRegex.test(value)) {
                return getErrorMessage('phone');
            }
            if (field.id === 'lead-captcha' && value.length && value.length < 3) {
                return getErrorMessage('captchaShort');
            }
            return '';
        };

        const setFieldError = (field, message) => {
            const errorId = `${field.id}-error`;
            const errorEl = document.getElementById(errorId);
            if (!errorEl) return;
            errorEl.textContent = message;
            if (message) {
                field.setAttribute('aria-invalid', 'true');
            } else {
                field.removeAttribute('aria-invalid');
            }
        };

        const validateField = (field) => {
            const message = getError(field);
            setFieldError(field, message);
            return !message;
        };

        const toggleSubmit = (state) => {
            if (!submitButton) return;
            submitButton.disabled = state;
        };

        form.addEventListener('input', (event) => {
            const target = event.target;
            if (!fields.includes(target)) return;
            const wasInvalid = target.getAttribute('aria-invalid') === 'true';
            if (wasInvalid || form.dataset.submitted === 'true') {
                validateField(target);
            }
            if (feedback && !feedback.hidden) {
                feedback.hidden = true;
            }
        });

        form.addEventListener('blur', (event) => {
            const target = event.target;
            if (!fields.includes(target)) return;
            validateField(target);
        }, true);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            form.dataset.submitted = 'true';
            if (feedback) {
                feedback.hidden = true;
            }
            toggleSubmit(true);

            const hasSpam = honeypot && honeypot.value.trim().length > 0;
            const isValid = !hasSpam && fields.every(validateField);

            if (!isValid) {
                toggleSubmit(false);
                return;
            }

            if (prefersReducedMotion) {
                toggleSubmit(true);
            }

            setTimeout(() => {
                form.reset();
                fields.forEach(field => setFieldError(field, ''));
                if (feedback) {
                    feedback.hidden = false;
                }
                delete form.dataset.submitted;
                toggleSubmit(false);
            }, prefersReducedMotion ? 0 : 400);
        });
    }

    function initFaqAccordion() {
        const faq = document.querySelector('.faq');
        if (!faq || faq.dataset.accordionInit === 'true') return;
        faq.dataset.accordionInit = 'true';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const items = Array.from(faq.querySelectorAll('.faq-item__trigger')).map(trigger => {
            const panelId = trigger.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : null;
            return panel ? { trigger, panel } : null;
        }).filter(Boolean);

        const closeItem = ({ trigger, panel }) => {
            trigger.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
            if (prefersReducedMotion) {
                panel.removeAttribute('data-open');
                panel.style.maxHeight = '';
                return;
            }
            if (panel.style.maxHeight === 'none') {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
            requestAnimationFrame(() => {
                panel.style.maxHeight = '0px';
            });
            const handleCloseTransition = (event) => {
                if (event.propertyName !== 'max-height') return;
                panel.removeEventListener('transitionend', handleCloseTransition);
                panel.removeAttribute('data-open');
                panel.style.maxHeight = '';
            };
            panel.addEventListener('transitionend', handleCloseTransition);
        };

        const openItem = ({ trigger, panel }) => {
            trigger.setAttribute('aria-expanded', 'true');
            panel.setAttribute('aria-hidden', 'false');
            panel.setAttribute('data-open', '');
            if (prefersReducedMotion) {
                panel.style.maxHeight = 'none';
                return;
            }
            panel.style.maxHeight = `${panel.scrollHeight}px`;
            const handleOpenTransition = (event) => {
                if (event.propertyName !== 'max-height') return;
                panel.removeEventListener('transitionend', handleOpenTransition);
                panel.style.maxHeight = 'none';
            };
            panel.addEventListener('transitionend', handleOpenTransition);
        };

        items.forEach(item => {
            if (item.trigger.getAttribute('aria-expanded') === 'true') {
                item.panel.style.maxHeight = 'none';
                item.panel.setAttribute('aria-hidden', 'false');
                item.panel.setAttribute('data-open', '');
            } else {
                item.panel.setAttribute('aria-hidden', 'true');
                item.panel.style.maxHeight = '';
            }

            item.trigger.addEventListener('click', () => {
                const isExpanded = item.trigger.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    closeItem(item);
                    return;
                }
                items.forEach(other => {
                    if (other === item) {
                        openItem(other);
                    } else {
                        closeItem(other);
                    }
                });
            });
        });

        window.addEventListener('resize', () => {
            items.forEach(({ panel, trigger }) => {
                if (trigger.getAttribute('aria-expanded') === 'true') {
                    if (panel.style.maxHeight !== 'none') {
                        panel.style.maxHeight = `${panel.scrollHeight}px`;
                    }
                }
            });
        });
    }

    function initWhatsAppFab() {
        const fab = document.getElementById('whatsappFab');
        const footer = document.getElementById('footer');
        if (!fab || !footer || fab.dataset.fabInit === 'true') return;
        fab.dataset.fabInit = 'true';

        const baseOffsets = () => window.matchMedia('(max-width: 640px)').matches ? 18 : 24;
        const elevatedOffsets = () => baseOffsets() + 64;

        const updatePosition = (isFooterVisible) => {
            const bottomValue = isFooterVisible ? elevatedOffsets() : baseOffsets();
            fab.style.bottom = `${bottomValue}px`;
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                updatePosition(entry.isIntersecting);
            });
        }, { root: null, threshold: 0.05 });

        observer.observe(footer);

        updatePosition(footer.getBoundingClientRect().top < window.innerHeight);

        window.addEventListener('resize', () => {
            const footerVisible = footer.getBoundingClientRect().top < window.innerHeight;
            updatePosition(footerVisible);
        });
    }

    // --- INITIALIZATION ---
    function init() {
        const savedLang = localStorage.getItem('lang') || navigator.language.split('-')[0];
        const initialLang = normalizeLang(savedLang);
        document.documentElement.lang = initialLang;
        updateLanguageToggleUI(initialLang);
        loadTranslations(initialLang);

        const savedTheme = localStorage.getItem('theme');
        const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || preferredTheme;
        applyTheme(initialTheme);
        initScrollAnimations();
        initMouseEffects();
        initCardTilt();
        initSegmentTabs();
        initFeatureChips();
        initLeadFormValidation();
        initFaqAccordion();
        initWhatsAppFab();
    }

    init();
});
