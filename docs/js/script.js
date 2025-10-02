
const rootElement = document.documentElement;
const STORAGE_KEYS = {
    theme: 'theme',
    lang: 'lang'
};

const safeStorage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Storage get unavailable', error);
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('Storage set unavailable', error);
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Storage remove unavailable', error);
        }
    }
};

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const storedThemePreference = safeStorage.get(STORAGE_KEYS.theme);
const derivedTheme = storedThemePreference || (prefersDarkScheme.matches ? 'dark' : 'light');
rootElement.classList.add(`theme-${derivedTheme}`, 'theme-preload');
rootElement.style.setProperty('color-scheme', derivedTheme);

const translationCache = new Map();

function debounce(fn, delay = 150) {
    let timeoutId = null;
    return function debounced(...args) {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
    };
}

function getNestedTranslation(translations, key) {
    return key.split('.').reduce((acc, segment) => (acc && acc[segment] !== undefined ? acc[segment] : undefined), translations);
}

document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        rootElement.classList.add('theme-transition-ready');
        rootElement.classList.remove('theme-preload');
    });

    const themeApi = initTheme(derivedTheme);
    const headerApi = initHeader();
    const toastApi = initToast();
    const contactApi = initContactForm(toastApi);
    const segmentsApi = initSegmentTabs();
    const featuresApi = initFeatureChips();
    initFaqAccordion();
    initScrollReveal();
    updateFooterYear();

    initLanguage({
        onAfterApply() {
            updateFooterYear();
            headerApi.refreshLabels();
            segmentsApi.refreshIndicator();
            featuresApi.refreshHeights();
            contactApi.refreshCopy();
            themeApi.refreshAria();
        }
    });
});

function initTheme(initialTheme) {
    let currentTheme = initialTheme;
    const themeToggle = document.getElementById('themeToggle');

    const applyTheme = (theme, { persist = true } = {}) => {
        const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
        rootElement.classList.remove('theme-dark', 'theme-light');
        rootElement.classList.add(`theme-${resolvedTheme}`);
        rootElement.style.setProperty('color-scheme', resolvedTheme);
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', resolvedTheme === 'dark' ? 'true' : 'false');
        }
        if (persist) {
            safeStorage.set(STORAGE_KEYS.theme, resolvedTheme);
        }
        currentTheme = resolvedTheme;
    };

    applyTheme(currentTheme, { persist: false });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    prefersDarkScheme.addEventListener('change', (event) => {
        const stored = safeStorage.get(STORAGE_KEYS.theme);
        if (stored) return;
        applyTheme(event.matches ? 'dark' : 'light', { persist: false });
    });

    const refreshAria = () => {
        if (!themeToggle) return;
        themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    };

    return { refreshAria };
}

function initLanguage(options = {}) {
    const { onAfterApply } = options;
    const langToggle = document.getElementById('langToggle');
    const langToggleText = document.getElementById('langToggleText');
    let currentLang = safeStorage.get(STORAGE_KEYS.lang) || (rootElement.lang || 'es');
    
    console.log('[i18n] 🚀 Init language system');
    console.log('[i18n] langToggle element:', langToggle ? '✅ Found' : '❌ NOT FOUND');
    console.log('[i18n] langToggleText element:', langToggleText ? '✅ Found' : '❌ NOT FOUND');
    console.log('[i18n] Initial language:', currentLang);

    const loadTranslations = async (lang) => {
        if (translationCache.has(lang)) {
            console.log(`[i18n] ♻️ Using cached translations for ${lang}`);
            return translationCache.get(lang);
        }
        try {
            const url = `./i18n/${lang}.json`;
            console.log(`[i18n] 📥 Loading translations from ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Unable to load translations for ${lang} (HTTP ${response.status})`);
            }
            const data = await response.json();
            translationCache.set(lang, data);
            console.log(`[i18n] ✅ Loaded ${Object.keys(data).length} translation keys for ${lang}`);
            return data;
        } catch (error) {
            console.error(`[i18n] ❌ Error loading translations:`, error);
            return {};
        }
    };

    const applyTranslations = (translations) => {
        console.log('[i18n] 🔄 Applying translations...');
        let textCount = 0, contentCount = 0, attrCount = 0;
        
        // Translate text content elements
        const textElements = document.querySelectorAll('[data-i18n]');
        console.log(`[i18n] Found ${textElements.length} elements with [data-i18n]`);
        
        textElements.forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const value = getNestedTranslation(translations, key);
            if (value !== undefined) {
                // Always use innerHTML to handle HTML entities and nested tags
                // Special handling for <title> tag - use textContent
                if (element.tagName === 'TITLE') {
                    element.textContent = value;
                } else {
                    // Use innerHTML for all other elements to properly handle HTML content
                    element.innerHTML = value;
                }
                textCount++;
            } else {
                console.warn(`[i18n] ⚠️ Translation not found for key: ${key}`);
            }
        });

        // Translate meta content attributes (including OG and Twitter)
        const contentElements = document.querySelectorAll('[data-i18n-content]');
        contentElements.forEach((element) => {
            const key = element.getAttribute('data-i18n-content');
            const value = getNestedTranslation(translations, key);
            if (value !== undefined) {
                element.setAttribute('content', value);
                contentCount++;
            }
        });

        // Translate other attributes (aria-label, placeholder, etc.)
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        attrElements.forEach((element) => {
            const mappings = element.getAttribute('data-i18n-attr').split(';');
            mappings.forEach((mapping) => {
                if (!mapping.trim()) return;
                const [attrName, key] = mapping.split(':').map((item) => item.trim());
                if (!attrName || !key) return;
                const value = getNestedTranslation(translations, key);
                if (value !== undefined) {
                    element.setAttribute(attrName, value);
                    attrCount++;
                }
            });
        });
        
        console.log(`[i18n] ✅ Translation complete: ${textCount} texts, ${contentCount} metas, ${attrCount} attributes`);
    };

    const setLanguage = async (lang) => {
        const langCode = lang === 'en' ? 'en' : 'es';
        console.log(`[i18n] Setting language to ${langCode}`);
        const translations = await loadTranslations(langCode);
        applyTranslations(translations);
        document.documentElement.lang = langCode;
        if (langToggleText) {
            langToggleText.textContent = langCode.toUpperCase();
        }
        if (langToggle) {
            langToggle.setAttribute('aria-pressed', langCode === 'en' ? 'true' : 'false');
        }
        safeStorage.set(STORAGE_KEYS.lang, langCode);
        currentLang = langCode;
        console.log(`[i18n] Language applied successfully: ${langCode}`);
        if (typeof onAfterApply === 'function') {
            onAfterApply();
        }
    };

    if (langToggle) {
        console.log('[i18n] Adding click listener to langToggle');
        langToggle.addEventListener('click', () => {
            console.log('[i18n] 🔥 CLICK DETECTED on langToggle');
            console.log('[i18n] Current language before toggle:', currentLang);
            const nextLang = currentLang === 'en' ? 'es' : 'en';
            console.log('[i18n] Next language:', nextLang);
            setLanguage(nextLang);
        });
    } else {
        console.error('[i18n] ❌ langToggle button NOT FOUND! Cannot add event listener.');
    }

    console.log('[i18n] Calling initial setLanguage with:', currentLang);
    setLanguage(currentLang);
}

function initHeader() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileNav = document.querySelector('.header__mobile-nav');
    let isMenuOpen = false;

    const updateMobileToggleLabel = () => {
        if (!mobileToggle) return;
        const label = isMenuOpen ? mobileToggle.dataset.labelClose : mobileToggle.dataset.labelOpen;
        if (label) {
            mobileToggle.setAttribute('aria-label', label);
        }
        mobileToggle.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
    };

    const openMenu = () => {
        if (isMenuOpen) return;
        document.body.classList.add('mobile-nav-open');
        isMenuOpen = true;
        updateMobileToggleLabel();
    };

    const closeMenu = () => {
        if (!isMenuOpen) return;
        document.body.classList.remove('mobile-nav-open');
        isMenuOpen = false;
        updateMobileToggleLabel();
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mobileNav) {
        mobileNav.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.matches('a')) {
                closeMenu();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    updateMobileToggleLabel();

    return {
        refreshLabels: updateMobileToggleLabel
    };
}

function initSegmentTabs() {
    const tabList = document.querySelector('.segments-tabs');
    const tabs = Array.from(document.querySelectorAll('.segments-tab'));
    const panels = tabs
        .map((tab) => document.getElementById(tab.getAttribute('aria-controls') || ''))
        .filter(Boolean);

    if (!tabList || !tabs.length || !panels.length) {
        return { refreshIndicator: () => {} };
    }

    if (tabList.dataset.tabsInit === 'true') {
        return {
            refreshIndicator: () => positionIndicator(tabList, tabs)
        };
    }

    tabList.dataset.tabsInit = 'true';

    const indicator = document.createElement('span');
    indicator.className = 'segments-tabs__indicator';
    indicator.setAttribute('aria-hidden', 'true');
    tabList.appendChild(indicator);

    const activateTab = (tab) => {
        const targetId = tab.getAttribute('aria-controls');
        if (!targetId) return;

        tabs.forEach((item) => {
            const isActive = item === tab;
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
            item.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        panels.forEach((panel) => {
            if (panel.id === targetId) {
                panel.removeAttribute('hidden');
                panel.dataset.active = 'true';
            } else {
                panel.setAttribute('hidden', '');
                panel.dataset.active = 'false';
            }
        });

        positionIndicator(tabList, tabs, indicator);
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (event) => {
            const key = event.key;
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
            event.preventDefault();
            let newIndex = index;
            if (key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
            if (key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
            if (key === 'Home') newIndex = 0;
            if (key === 'End') newIndex = tabs.length - 1;
            const nextTab = tabs[newIndex];
            nextTab.focus();
            activateTab(nextTab);
        });
    });

    window.addEventListener('resize', debounce(() => positionIndicator(tabList, tabs, indicator), 150));
    activateTab(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0]);

    return {
        refreshIndicator: () => positionIndicator(tabList, tabs, indicator)
    };
}

function positionIndicator(container, tabs, indicatorElement) {
    if (!container || !tabs.length || !indicatorElement) return;
    const activeTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
    if (!activeTab) return;
    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const offset = tabRect.left - containerRect.left + container.scrollLeft;
    indicatorElement.style.width = `${tabRect.width}px`;
    indicatorElement.style.transform = `translate3d(${offset}px, 0, 0)`;
    indicatorElement.classList.add('is-visible');
}

function initFeatureChips() {
    const chips = Array.from(document.querySelectorAll('.caracteristicas__chip'));
    const details = Array.from(document.querySelectorAll('.caracteristicas__detail'));

    if (!chips.length || !details.length) {
        return { refreshHeights: () => {} };
    }

    const container = document.querySelector('.caracteristicas');
    if (!container) {
        return { refreshHeights: () => {} };
    }

    if (container.dataset.detailsInit === 'true') {
        return {
            refreshHeights: () => {
                const activeDetail = details.find((detail) => detail.classList.contains('is-active'));
                if (activeDetail) setDetailHeight(activeDetail);
            }
        };
    }

    container.dataset.detailsInit = 'true';

    const detailMap = new Map(details.map((detail) => [`#${detail.id}`, detail]));

    const setDetailHeight = (detail) => {
        requestAnimationFrame(() => {
            detail.style.setProperty('--detail-max-height', `${detail.scrollHeight}px`);
        });
    };

    const showDetail = (targetSelector) => {
        details.forEach((detail) => {
            const isActive = `#${detail.id}` === targetSelector;
            detail.classList.toggle('is-active', isActive);
            detail.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            if (isActive) {
                setDetailHeight(detail);
            } else {
                detail.style.setProperty('--detail-max-height', '0px');
            }
        });
    };

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const targetSelector = chip.getAttribute('data-target');
            if (!targetSelector || !detailMap.has(targetSelector)) return;
            chips.forEach((item) => {
                const isActive = item === chip;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            showDetail(targetSelector);
        });

        chip.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            chip.click();
        });
    });

    const initialTarget = chips.find((chip) => chip.classList.contains('is-active'))?.getAttribute('data-target') || chips[0].getAttribute('data-target');
    if (initialTarget) {
        showDetail(initialTarget);
    }

    window.addEventListener('resize', debounce(() => {
        const activeDetail = details.find((detail) => detail.classList.contains('is-active'));
        if (activeDetail) setDetailHeight(activeDetail);
    }, 150));

    return {
        refreshHeights: () => {
            const activeDetail = details.find((detail) => detail.classList.contains('is-active'));
            if (activeDetail) setDetailHeight(activeDetail);
        }
    };
}

function initFaqAccordion() {
    const faqSection = document.getElementById('faq');
    if (!faqSection || faqSection.dataset.accordionInit === 'true') return;
    faqSection.dataset.accordionInit = 'true';

    const triggers = Array.from(faqSection.querySelectorAll('.faq-card__trigger'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const openItem = (trigger, panel) => {
        trigger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        panel.removeAttribute('hidden');
        panel.dataset.open = 'true';
        if (prefersReducedMotion) {
            panel.style.maxHeight = 'none';
            return;
        }
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        panel.addEventListener('transitionend', function handleTransitionEnd(event) {
            if (event.propertyName !== 'max-height') return;
            panel.style.maxHeight = 'none';
            panel.removeEventListener('transitionend', handleTransitionEnd);
        });
    };

    const closeItem = (trigger, panel) => {
        trigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        panel.removeAttribute('data-open');
        if (prefersReducedMotion) {
            panel.setAttribute('hidden', '');
            panel.style.maxHeight = '';
            return;
        }
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        requestAnimationFrame(() => {
            panel.style.maxHeight = '0px';
        });
        panel.addEventListener('transitionend', function handleTransitionEnd(event) {
            if (event.propertyName !== 'max-height') return;
            panel.setAttribute('hidden', '');
            panel.style.maxHeight = '';
            panel.removeEventListener('transitionend', handleTransitionEnd);
        });
    };

    triggers.forEach((trigger) => {
        const panelId = trigger.getAttribute('aria-controls');
        if (!panelId) return;
        const panel = document.getElementById(panelId);
        if (!panel) return;

        if (trigger.getAttribute('aria-expanded') === 'true') {
            openItem(trigger, panel);
        } else {
            panel.setAttribute('hidden', '');
            panel.setAttribute('aria-hidden', 'true');
            panel.removeAttribute('data-open');
        }

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            triggers.forEach((otherTrigger) => {
                const otherPanelId = otherTrigger.getAttribute('aria-controls');
                if (!otherPanelId) return;
                const otherPanel = document.getElementById(otherPanelId);
                if (!otherPanel) return;
                if (otherTrigger === trigger) {
                    if (isExpanded) {
                        closeItem(otherTrigger, otherPanel);
                    } else {
                        openItem(otherTrigger, otherPanel);
                    }
                } else {
                    closeItem(otherTrigger, otherPanel);
                }
            });
        });
    });
}

function initScrollReveal() {
    const revealElements = Array.from(document.querySelectorAll('.reveal-on-scroll'));
    if (!revealElements.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
}

function updateFooterYear() {
    const yearElement = document.getElementById('footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initToast() {
    const toastElement = document.getElementById('toast');
    if (!toastElement) {
        return {
            show: () => {},
            hide: () => {}
        };
    }

    let hideTimeoutId = null;

    const hide = () => {
        toastElement.classList.remove('show');
        toastElement.textContent = '';
        if (hideTimeoutId) {
            window.clearTimeout(hideTimeoutId);
            hideTimeoutId = null;
        }
    };

    const show = (message, options = {}) => {
        if (!message) return;
        const { duration = 4000 } = options;
        toastElement.textContent = message;
        toastElement.classList.add('show');
        window.clearTimeout(hideTimeoutId);
        hideTimeoutId = window.setTimeout(() => {
            hide();
        }, duration);
    };

    return { show, hide };
}

function initContactForm(toast = {}) {
    const form = document.getElementById('contact-form');
    const successStatus = document.getElementById('contact-status-success');
    const errorStatus = document.getElementById('contact-status-error');
    const captchaDisplay = document.getElementById('contact-captcha-code');
    const captchaRefresh = document.getElementById('contact-captcha-refresh');
    const submitButton = form?.querySelector('.contact__submit');
    const captchaInput = form?.querySelector('#contact-captcha');
    const honeypot = document.getElementById('contact-ref');

    if (!form || !captchaDisplay || !captchaRefresh || !captchaInput) {
        return { refreshCopy: () => {} };
    }

    const showToast = typeof toast.show === 'function' ? toast.show.bind(toast) : () => {};
    const hideToast = typeof toast.hide === 'function' ? toast.hide.bind(toast) : () => {};

    const inputs = Array.from(form.querySelectorAll('[data-validate]'));
    const phonePattern = /^[+]?[-\d()\s.]{6,}$/;
    const fallbackMessages = {
        errorRequired: 'Please fill out this field.',
        errorInvalid: 'The value entered is not valid.',
        errorMinlength: 'Add more detail to this field.'
    };

    let currentCaptcha = '';

    const setCaptcha = () => {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let value = '';
        for (let index = 0; index < 6; index += 1) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            value += alphabet[randomIndex];
        }
        currentCaptcha = value;
        captchaDisplay.textContent = value;
    };

    const getErrorElements = (input) => {
        const errorId = input.getAttribute('aria-describedby');
        if (!errorId) return null;
        const errorElement = document.getElementById(errorId);
        if (!errorElement) return null;
        const messageElement = errorElement.querySelector('.contact__error-message');
        return { errorElement, messageElement };
    };

    const clearError = (input) => {
        const elements = getErrorElements(input);
        if (!elements) return;
        const { errorElement, messageElement } = elements;
        errorElement.hidden = true;
        if (!errorElement.hasAttribute('hidden')) {
            errorElement.setAttribute('hidden', '');
        }
        if (messageElement) {
            messageElement.textContent = '';
        }
        input.removeAttribute('aria-invalid');
    };

    const setError = (input, key) => {
        const elements = getErrorElements(input);
        if (!elements) return false;
        const { errorElement, messageElement } = elements;
        const message = input.dataset[key] || fallbackMessages[key] || fallbackMessages.errorInvalid;
        errorElement.hidden = false;
        errorElement.removeAttribute('hidden');
        if (messageElement) {
            messageElement.textContent = message;
        }
        input.setAttribute('aria-invalid', 'true');
        return false;
    };

    const hideStatuses = () => {
        [successStatus, errorStatus].forEach((status) => {
            if (!status) return;
            status.hidden = true;
            if (!status.hasAttribute('hidden')) {
                status.setAttribute('hidden', '');
            }
        });
        hideToast();
    };

    const showStatus = (element) => {
        if (!element) return;
        hideStatuses();
        element.hidden = false;
        element.removeAttribute('hidden');
        const toastMessage = element.dataset.toast;
        if (toastMessage) {
            showToast(toastMessage);
        }
        requestAnimationFrame(() => {
            if (typeof element.focus === 'function') {
                element.focus({ preventScroll: true });
            }
        });
    };

    const setSubmitting = (isSubmitting) => {
        if (!submitButton) return;
        submitButton.classList.toggle('is-loading', isSubmitting);
        submitButton.disabled = Boolean(isSubmitting);
    };

    const validateField = (input) => {
        const type = input.dataset.validate;
        const value = input.value.trim();

        if (type !== 'consent') {
            clearError(input);
        }

        switch (type) {
            case 'email': {
                if (!value) return setError(input, 'errorRequired');
                const emailPattern = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;
                if (!emailPattern.test(value)) return setError(input, 'errorInvalid');
                return true;
            }
            case 'text': {
                if (!value) return setError(input, 'errorRequired');
                const min = Number(input.getAttribute('minlength')) || 0;
                if (min && value.length < min) return setError(input, 'errorMinlength');
                return true;
            }
            case 'message': {
                if (!value) return setError(input, 'errorRequired');
                const min = Number(input.getAttribute('minlength')) || 0;
                if (min && value.length < min) return setError(input, 'errorMinlength');
                return true;
            }
            case 'phone': {
                if (!value) {
                    clearError(input);
                    return true;
                }
                if (!phonePattern.test(value)) return setError(input, 'errorInvalid');
                return true;
            }
            case 'captcha': {
                if (!value) return setError(input, 'errorRequired');
                if (value.replace(/\s+/g, '').toUpperCase() !== currentCaptcha) {
                    return setError(input, 'errorInvalid');
                }
                return true;
            }
            case 'consent': {
                const isChecked = input instanceof HTMLInputElement ? input.checked : false;
                if (!isChecked) return setError(input, 'errorRequired');
                return true;
            }
            default:
                return true;
        }
    };

    const clearAllErrors = () => {
        inputs.forEach((input) => clearError(input));
    };

    inputs.forEach((input) => {
        const type = input.dataset.validate;
        if (type === 'consent') {
            input.addEventListener('change', () => {
                if (input instanceof HTMLInputElement && input.checked) {
                    clearError(input);
                }
            });
            return;
        }
        input.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') {
                validateField(input);
            }
        });
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                validateField(input);
            }
        });
    });

    captchaRefresh.addEventListener('click', () => {
        setCaptcha();
        captchaInput.value = '';
        clearError(captchaInput);
        captchaInput.focus({ preventScroll: true });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (honeypot && honeypot.value.trim()) {
            form.reset();
            setCaptcha();
            return;
        }

        hideStatuses();

        let firstInvalid = null;
        let isValid = true;

        inputs.forEach((input) => {
            const valid = validateField(input);
            if (!valid) {
                isValid = false;
                if (!firstInvalid) {
                    firstInvalid = input;
                }
            }
        });

        if (!isValid) {
            showStatus(errorStatus);
            if (firstInvalid) {
                requestAnimationFrame(() => {
                    firstInvalid.focus({ preventScroll: false });
                });
            }
            return;
        }

        setSubmitting(true);

        window.setTimeout(() => {
            setSubmitting(false);
            form.reset();
            clearAllErrors();
            setCaptcha();
            showStatus(successStatus);
        }, 650);
    });

    setCaptcha();
    hideStatuses();
    clearAllErrors();

    return {
        refreshCopy: () => {
            hideStatuses();
            clearAllErrors();
        }
    };
}
