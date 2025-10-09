
const rootElement = document.documentElement;
const STORAGE_KEYS = {
    theme: 'theme',
    language: 'language'
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

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'es'];
const translationsCache = new Map();

const dictionaries = {
  en: {
    "global": {
      "brand": "FoodChain"
    },
    "header": {
      "brand": {
        "ariaLabel": "Back to start"
      },
      "nav": {
        "ariaLabel": "Main navigation",
        "home": "Home",
        "solution": "Solution",
        "stages": "Stages",
        "benefits": "Benefits",
        "segments": "Segments",
        "contact": "Contact"
      },
      "cta": {
        "primary": "Try demo",
        "secondary": "Sign in"
      },
      "themeToggle": "Toggle theme",
      "language": {
        "group": "Language",
        "en": "EN",
        "enAria": "Switch to English",
        "es": "ES",
        "esAria": "Switch to Spanish"
      },
      "menuToggle": {
        "aria": "Open menu",
        "open": "Open menu",
        "close": "Close menu"
      }
    },
    "hero": {
      "title": "Build trust at every stage of your food chain with verified seals in minutes",
      "description": "Validate batches with a signed QR, operate with ready-made audits on a public blockchain, and share verifiable evidence with customers and authorities.",
      "bullet1": "Certificates ready in 48 hours",
      "bullet2": "Immediate alerts for deviations",
      "bullet3": "Audits without spreadsheets",
      "ctaPrimary": "Explore platform",
      "ctaPrimaryAria": "Open the FoodChain guided tour",
      "ctaSecondary": "See live case",
      "ctaSecondaryAria": "See a live case of FoodChain",
      "imageAlt": "FoodChain dashboard showing verified seals and blockchain traceability"
    },
    "problem": {
      "title": "The problem",
      "subtitle": "The food industry faces risks in traceability, safety, and regulatory compliance. Lack of transparency creates distrust and hinders crisis management.",
      "item1": "Food fraud",
      "item2": "Product recalls",
      "item3": "Counterfeitable labels",
      "item4": "Fragmented data"
    },
    "solution": {
      "title": "Our solution",
      "description": "FoodChain records every step of the chain with verifiable real-time evidence. With blockchain we guarantee immutability, and with a signed QR we prevent fraud, delivering fast and reliable audits.",
      "card1": {
        "title": "Blockchain/Immutability",
        "alt": "Network of interconnected blockchain nodes"
      },
      "card2": {
        "title": "QR per batch",
        "alt": "Secure QR code printed on packaging"
      },
      "card3": {
        "title": "Public verification",
        "alt": "Person verifying product data from a mobile device"
      },
      "card4": {
        "title": "Fast auditing",
        "alt": "Digital audit dashboard with metrics"
      }
    },
    "kpis": {
      "card1": "Companies",
      "card2": "Reduction in incidents",
      "card3": "Availability"
    },
    "stages": {
      "title": "Supply chain stages",
      "card1": {
        "title": "Origin",
        "description": "Capture data at the farm or producer.",
        "alt": "Farmer recording crop data at a farm"
      },
      "card2": {
        "title": "Processing",
        "description": "Monitor transformation in real time.",
        "alt": "Food processing line under supervision"
      },
      "card3": {
        "title": "Distribution",
        "description": "Control logistics and the cold chain.",
        "alt": "Temperature-monitored distribution truck"
      },
      "card4": {
        "title": "Retail",
        "description": "Share product information with consumers.",
        "alt": "Customer reviewing product information in store"
      }
    },
    "trust": {
      "title": "Trusted by industry leaders",
      "testimonial1": {
        "quote": "“With FoodChain we trace every batch in minutes and audit without disruption.”",
        "cite": "Ana García — Quality Director",
        "alt": "Portrait of a quality director"
      },
      "testimonial2": {
        "quote": "“The transparency we give distributors and customers elevated our reputation.”",
        "cite": "Carlos Rodríguez — Operations Manager",
        "alt": "Portrait of an operations manager"
      }
    },
    "benefits": {
      "title": "Key benefits",
      "card1": {
        "title": "Total transparency",
        "description": "Access detailed information at every stage of the chain."
      },
      "card2": {
        "title": "Regulatory compliance",
        "description": "Stay aligned with local and international regulations."
      },
      "card3": {
        "title": "Risk reduction",
        "description": "Quickly identify deviations and affected batches."
      },
      "card4": {
        "title": "Consumer trust",
        "description": "Offer verifiable information for every purchase."
      }
    },
    "segments": {
      "title": "Target segments",
      "ariaLabel": "Target segments",
      "tabs": {
        "producers": "Producers",
        "enterprises": "Enterprises/Retailers",
        "consumers": "Consumers"
      },
      "panels": {
        "producers": {
          "bullet1": "Digital, export-ready certificates of origin.",
          "bullet2": "Early alerts for sanitary or climate risks.",
          "bullet3": "Integration with ERPs and in-field sensors.",
          "quote": "“We now prove batch traceability without paperwork.”",
          "cta": "Contact us"
        },
        "enterprises": {
          "bullet1": "Unified dashboard for batches, suppliers, and audits.",
          "bullet2": "Automated regulatory and quality reports.",
          "bullet3": "24/7 monitoring SLA with expert support.",
          "quote": "“We cut each audit down to under an hour.”",
          "cta": "Talk to sales"
        },
        "consumers": {
          "bullet1": "Instant verification through on-pack QR codes.",
          "bullet2": "Transparent nutrition facts and trust seals.",
          "bullet3": "Personalized alerts about recalls or batch changes.",
          "quote": "“We trust the brand because we see the entire journey.”",
          "cta": "Contact us"
        }
      }
    },
    "useCase": {
      "title": "Use case",
      "step1": {
        "aria": "Step 1: Certified origin",
        "title": "Certified origin",
        "description": "A coffee producer logs cultivation, harvest, and processing data."
      },
      "step2": {
        "aria": "Step 2: Transparent processing",
        "title": "Transparent processing",
        "description": "Every transformation stage is recorded with quality checks."
      },
      "step3": {
        "aria": "Step 3: Controlled logistics",
        "title": "Controlled logistics",
        "description": "Temperature and location are tracked throughout transport."
      },
      "step4": {
        "aria": "Step 4: Informed consumer",
        "title": "Informed consumer",
        "description": "Shoppers scan a QR code to view the product journey end to end."
      }
    },
    "features": {
      "title": "Featured features",
      "card1": {
        "title": "QR labeling",
        "description": "Assign QR labels so stakeholders can access product data instantly."
      },
      "card2": {
        "title": "GPS & blockchain",
        "description": "Real-time tracking with immutable blockchain records."
      },
      "card3": {
        "title": "Consumer verification",
        "description": "Allow consumers to verify authenticity and origin on demand."
      },
      "card4": {
        "title": "Analytics dashboard",
        "description": "Visualize key metrics and trends across your supply chain."
      }
    },
    "capabilities": {
      "title": "Detailed capabilities",
      "ariaLabel": "Capabilities",
      "chips": {
        "traceability": "End-to-end traceability",
        "alerts": "Real-time alerts",
        "integration": "Systems integration",
        "reports": "Custom reports",
        "api": "Open API",
        "support": "Technical support"
      },
      "details": {
        "traceability": {
          "title": "End-to-end traceability",
          "description": "Follow every lot from origin to the final customer with verifiable evidence."
        },
        "alerts": {
          "title": "Real-time alerts",
          "description": "Receive instant notifications when thresholds or procedures are breached."
        },
        "integration": {
          "title": "Systems integration",
          "description": "Connect with ERP, CRM, and sensor networks already in place."
        },
        "reports": {
          "title": "Custom reports",
          "description": "Generate role-based reports tailored to regulators and partners."
        },
        "api": {
          "title": "Open API",
          "description": "Use an extensible API for custom apps and workflows."
        },
        "support": {
          "title": "Technical support",
          "description": "Rely on specialists for onboarding, training, and continuous support."
        }
      }
    },
    "pricing": {
      "title": "Plans and pricing",
      "basic": {
        "name": "Basic",
        "amount": "$29",
        "period": "/month",
        "feature1": "Basic traceability",
        "feature2": "Up to 1000 products",
        "feature3": "Standard support",
        "cta": "Select"
      },
      "featured": {
        "badge": "Recommended",
        "badgeAria": "Recommended plan",
        "name": "Professional",
        "amount": "$89",
        "period": "/month",
        "feature1": "Advanced traceability",
        "feature2": "Up to 10,000 products",
        "feature3": "Custom alerts",
        "feature4": "Priority support",
        "cta": "Select"
      },
      "enterprise": {
        "name": "Enterprise",
        "amount": "Contact us",
        "feature1": "Complete traceability",
        "feature2": "Unlimited products",
        "feature3": "Custom integrations",
        "feature4": "Dedicated support",
        "cta": "Contact us"
      }
    },
    "contact": {
      "title": "Let's talk about your traceability",
      "description": "We help you implement auditable records, public verification, and regulator-ready reports. Leave your details and we'll reach out today.",
      "status": {
        "successToast": "Request sent. We'll be in touch soon.",
        "successMessage": "Thanks! Your request was sent. We'll contact you within 24 business hours.",
        "successCta": "Schedule demo",
        "errorToast": "Check the fields and try again.",
        "errorMessage": "We couldn't process your request. Please try again."
      },
      "form": {
        "email": {
          "label": "Email",
          "placeholder": "you@company.com",
          "errorRequired": "Enter your email address.",
          "errorInvalid": "Enter a valid email address."
        },
        "name": {
          "label": "Name",
          "placeholder": "Full name",
          "errorRequired": "Enter your name.",
          "errorMin": "Enter at least 2 characters."
        },
        "company": {
          "label": "Company",
          "placeholder": "Company name",
          "errorRequired": "Enter your company name.",
          "errorMin": "Enter at least 2 characters."
        },
        "phone": {
          "label": "Phone",
          "placeholder": "+1 555 555 5555",
          "errorInvalid": "Enter a valid phone number."
        },
        "message": {
          "label": "Message",
          "placeholder": "Tell us about your project",
          "errorRequired": "Tell us about your project.",
          "errorMin": "Describe your project in at least 20 characters."
        },
        "captcha": {
          "label": "Type the code",
          "refresh": "Generate a new code",
          "inputPlaceholder": "Type the code",
          "errorRequired": "Enter the code shown.",
          "errorInvalid": "The code doesn't match."
        },
        "consent": {
          "errorRequired": "You must accept the privacy policy.",
          "label": "I've read and accept the <a href=\"#\">Privacy Policy</a>."
        },
        "submitAria": "Send contact form",
        "submitLabel": "Send"
      }
    },
    "faq": {
      "title": "Frequently asked questions",
      "items": {
        "one": {
          "question": "What is FoodChain?",
          "answer": "It digitizes and secures traceability: signed QR codes, blockchain hashes, and public verification."
        },
        "two": {
          "question": "How does the integration work?",
          "answer": "API and connectors for ERP/CRM. We start with a pilot and role-based onboarding."
        },
        "three": {
          "question": "What support do you offer?",
          "answer": "Onboarding, help desk, and SLA-backed plans."
        }
      }
    },
    "footer": {
      "brand": {
        "ariaLabel": "Back to start"
      },
      "description": "Verifiable trust and auditable traceability for every lot.",
      "social": "Social media",
      "socialTwitter": "Twitter",
      "socialLinkedIn": "LinkedIn",
      "product": {
        "heading": "Product",
        "home": "Home",
        "solution": "Solution",
        "pricing": "Pricing",
        "demo": "Demo",
        "cases": "Cases"
      },
      "resources": {
        "heading": "Resources",
        "blog": "Blog",
        "docs": "Docs",
        "help": "Help center"
      },
      "legal": {
        "heading": "Legal",
        "privacy": "Privacy",
        "terms": "Terms",
        "cookies": "Cookies"
      },
      "copy": "FoodChain — All rights reserved."
    },
    "whatsapp": {
      "ariaLabel": "Chat on WhatsApp",
      "href": "https://wa.me/XXXXXXXXXXX?text=Hello%20FoodChain,%20I%20want%20a%20demo"
    }
  },
  es: {
    "global": {
      "brand": "FoodChain"
    },
    "header": {
      "brand": {
        "ariaLabel": "Volver al inicio"
      },
      "nav": {
        "ariaLabel": "Navegación principal",
        "home": "Inicio",
        "solution": "Solución",
        "stages": "Etapas",
        "benefits": "Beneficios",
        "segments": "Segmentos",
        "contact": "Contacto"
      },
      "cta": {
        "primary": "Probar demo",
        "secondary": "Iniciar sesión"
      },
      "themeToggle": "Cambiar tema",
      "language": {
        "group": "Idioma",
        "en": "EN",
        "enAria": "Cambiar a inglés",
        "es": "ES",
        "esAria": "Cambiar a español"
      },
      "menuToggle": {
        "aria": "Abrir menú",
        "open": "Abrir menú",
        "close": "Cerrar menú"
      }
    },
    "hero": {
      "title": "Genera confianza en cada etapa de tu cadena alimentaria con sellos verificados en minutos",
      "description": "Valida lotes con un QR firmado, opera auditorías listas en una blockchain pública y comparte evidencia verificable con clientes y autoridades.",
      "bullet1": "Certificados listos en 48 horas",
      "bullet2": "Alertas inmediatas ante desviaciones",
      "bullet3": "Auditorías sin hojas de cálculo",
      "ctaPrimary": "Explorar plataforma",
      "ctaPrimaryAria": "Abrir el tour guiado de FoodChain",
      "ctaSecondary": "Ver caso en vivo",
      "ctaSecondaryAria": "Ver un caso en vivo de FoodChain",
      "imageAlt": "Panel de FoodChain con sellos verificados y trazabilidad en blockchain"
    },
    "problem": {
      "title": "El problema",
      "subtitle": "La industria alimentaria enfrenta riesgos de trazabilidad, inocuidad y cumplimiento normativo. La falta de transparencia genera desconfianza y dificulta la gestión de crisis.",
      "item1": "Fraude alimentario",
      "item2": "Retiros de producto",
      "item3": "Etiquetas falsificables",
      "item4": "Datos fragmentados"
    },
    "solution": {
      "title": "Nuestra solución",
      "description": "FoodChain registra cada paso de la cadena con evidencia verificable en tiempo real. Con blockchain garantizamos inmutabilidad y con un QR firmado evitamos el fraude, logrando auditorías rápidas y confiables.",
      "card1": {
        "title": "Blockchain/Inmutabilidad",
        "alt": "Red de nodos blockchain interconectados"
      },
      "card2": {
        "title": "QR por lote",
        "alt": "Código QR seguro impreso en el empaque"
      },
      "card3": {
        "title": "Verificación pública",
        "alt": "Persona verificando datos del producto desde un dispositivo móvil"
      },
      "card4": {
        "title": "Auditoría ágil",
        "alt": "Tablero digital de auditoría con métricas"
      }
    },
    "kpis": {
      "card1": "Empresas",
      "card2": "Reducción de incidentes",
      "card3": "Disponibilidad"
    },
    "stages": {
      "title": "Etapas de la cadena de suministro",
      "card1": {
        "title": "Origen",
        "description": "Captura datos en la granja o productor.",
        "alt": "Agricultor registrando datos de cultivo en una granja"
      },
      "card2": {
        "title": "Procesamiento",
        "description": "Monitorea la transformación en tiempo real.",
        "alt": "Línea de procesamiento de alimentos bajo supervisión"
      },
      "card3": {
        "title": "Distribución",
        "description": "Controla la logística y la cadena de frío.",
        "alt": "Camión de distribución con monitoreo de temperatura"
      },
      "card4": {
        "title": "Retail",
        "description": "Comparte información del producto con los consumidores.",
        "alt": "Cliente revisando información del producto en la tienda"
      }
    },
    "trust": {
      "title": "Confiado por líderes de la industria",
      "testimonial1": {
        "quote": "“Con FoodChain rastreamos cada lote en minutos y auditamos sin interrupciones.”",
        "cite": "Ana García — Directora de Calidad",
        "alt": "Retrato de una directora de calidad"
      },
      "testimonial2": {
        "quote": "“La transparencia que brindamos a distribuidores y clientes elevó nuestra reputación.”",
        "cite": "Carlos Rodríguez — Gerente de Operaciones",
        "alt": "Retrato de un gerente de operaciones"
      }
    },
    "benefits": {
      "title": "Beneficios clave",
      "card1": {
        "title": "Transparencia total",
        "description": "Accede a información detallada en cada etapa de la cadena."
      },
      "card2": {
        "title": "Cumplimiento normativo",
        "description": "Mantente alineado con regulaciones locales e internacionales."
      },
      "card3": {
        "title": "Reducción de riesgos",
        "description": "Identifica rápidamente desviaciones y lotes afectados."
      },
      "card4": {
        "title": "Confianza del consumidor",
        "description": "Ofrece información verificable en cada compra."
      }
    },
    "segments": {
      "title": "Segmentos objetivo",
      "ariaLabel": "Segmentos objetivo",
      "tabs": {
        "producers": "Productores",
        "enterprises": "Empresas/Retail",
        "consumers": "Consumidores"
      },
      "panels": {
        "producers": {
          "bullet1": "Certificados de origen digitales y listos para exportar.",
          "bullet2": "Alertas tempranas ante riesgos sanitarios o climáticos.",
          "bullet3": "Integración con ERPs y sensores en campo.",
          "quote": "“Ahora demostramos la trazabilidad de cada lote sin papeleo.”",
          "cta": "Contáctanos"
        },
        "enterprises": {
          "bullet1": "Tablero unificado para lotes, proveedores y auditorías.",
          "bullet2": "Reportes regulatorios y de calidad automatizados.",
          "bullet3": "SLA de monitoreo 24/7 con soporte experto.",
          "quote": "“Reducimos cada auditoría a menos de una hora.”",
          "cta": "Hablar con ventas"
        },
        "consumers": {
          "bullet1": "Verificación instantánea mediante códigos QR en el empaque.",
          "bullet2": "Sellos de confianza y nutrición transparentes.",
          "bullet3": "Alertas personalizadas sobre retiros o cambios de lote.",
          "quote": "“Confiamos en la marca porque vemos todo el recorrido.”",
          "cta": "Contáctanos"
        }
      }
    },
    "useCase": {
      "title": "Caso de uso",
      "step1": {
        "aria": "Paso 1: Origen certificado",
        "title": "Origen certificado",
        "description": "Un productor de café registra datos de cultivo, cosecha y procesamiento."
      },
      "step2": {
        "aria": "Paso 2: Procesamiento transparente",
        "title": "Procesamiento transparente",
        "description": "Cada etapa de transformación se registra con controles de calidad."
      },
      "step3": {
        "aria": "Paso 3: Logística controlada",
        "title": "Logística controlada",
        "description": "Se monitorea temperatura y ubicación durante todo el transporte."
      },
      "step4": {
        "aria": "Paso 4: Consumidor informado",
        "title": "Consumidor informado",
        "description": "Los compradores escanean un QR para ver el recorrido completo del producto."
      }
    },
    "features": {
      "title": "Funcionalidades destacadas",
      "card1": {
        "title": "Etiquetado QR",
        "description": "Asigna etiquetas QR para que los actores accedan a los datos al instante."
      },
      "card2": {
        "title": "GPS y blockchain",
        "description": "Seguimiento en tiempo real con registros inmutables en blockchain."
      },
      "card3": {
        "title": "Verificación del consumidor",
        "description": "Permite que los consumidores verifiquen autenticidad y origen al instante."
      },
      "card4": {
        "title": "Panel analítico",
        "description": "Visualiza métricas y tendencias de toda tu cadena de suministro."
      }
    },
    "capabilities": {
      "title": "Capacidades detalladas",
      "ariaLabel": "Capacidades",
      "chips": {
        "traceability": "Trazabilidad extremo a extremo",
        "alerts": "Alertas en tiempo real",
        "integration": "Integración de sistemas",
        "reports": "Reportes personalizados",
        "api": "API abierta",
        "support": "Soporte técnico"
      },
      "details": {
        "traceability": {
          "title": "Trazabilidad extremo a extremo",
          "description": "Sigue cada lote desde el origen hasta el cliente final con evidencia verificable."
        },
        "alerts": {
          "title": "Alertas en tiempo real",
          "description": "Recibe notificaciones instantáneas cuando se incumplen umbrales o procedimientos."
        },
        "integration": {
          "title": "Integración de sistemas",
          "description": "Conecta con tus ERP, CRM y redes de sensores existentes."
        },
        "reports": {
          "title": "Reportes personalizados",
          "description": "Genera reportes por rol adaptados a reguladores y socios."
        },
        "api": {
          "title": "API abierta",
          "description": "Usa una API extensible para aplicaciones y flujos personalizados."
        },
        "support": {
          "title": "Soporte técnico",
          "description": "Cuenta con especialistas para onboarding, capacitación y soporte continuo."
        }
      }
    },
    "pricing": {
      "title": "Planes y precios",
      "basic": {
        "name": "Básico",
        "amount": "$29",
        "period": "/mes",
        "feature1": "Trazabilidad básica",
        "feature2": "Hasta 1000 productos",
        "feature3": "Soporte estándar",
        "cta": "Seleccionar"
      },
      "featured": {
        "badge": "Recomendado",
        "badgeAria": "Plan recomendado",
        "name": "Profesional",
        "amount": "$89",
        "period": "/mes",
        "feature1": "Trazabilidad avanzada",
        "feature2": "Hasta 10,000 productos",
        "feature3": "Alertas personalizadas",
        "feature4": "Soporte prioritario",
        "cta": "Seleccionar"
      },
      "enterprise": {
        "name": "Empresarial",
        "amount": "Contáctanos",
        "feature1": "Trazabilidad completa",
        "feature2": "Productos ilimitados",
        "feature3": "Integraciones a medida",
        "feature4": "Soporte dedicado",
        "cta": "Contáctanos"
      }
    },
    "contact": {
      "title": "Hablemos de tu trazabilidad",
      "description": "Te ayudamos a implementar registros auditables, verificación pública y reportes listos para reguladores. Déjanos tus datos y te contactaremos hoy.",
      "status": {
        "successToast": "Solicitud enviada. Nos pondremos en contacto pronto.",
        "successMessage": "¡Gracias! Recibimos tu solicitud. Te contactaremos dentro de 24 horas hábiles.",
        "successCta": "Agendar demo",
        "errorToast": "Revisa los campos e inténtalo nuevamente.",
        "errorMessage": "No pudimos procesar tu solicitud. Vuelve a intentarlo."
      },
      "form": {
        "email": {
          "label": "Correo electrónico",
          "placeholder": "tu@empresa.com",
          "errorRequired": "Ingresa tu correo electrónico.",
          "errorInvalid": "Ingresa un correo válido."
        },
        "name": {
          "label": "Nombre",
          "placeholder": "Nombre completo",
          "errorRequired": "Ingresa tu nombre.",
          "errorMin": "Escribe al menos 2 caracteres."
        },
        "company": {
          "label": "Compañía",
          "placeholder": "Nombre de la compañía",
          "errorRequired": "Ingresa el nombre de tu compañía.",
          "errorMin": "Escribe al menos 2 caracteres."
        },
        "phone": {
          "label": "Teléfono",
          "placeholder": "+34 600 000 000",
          "errorInvalid": "Ingresa un teléfono válido."
        },
        "message": {
          "label": "Mensaje",
          "placeholder": "Cuéntanos sobre tu proyecto",
          "errorRequired": "Cuéntanos sobre tu proyecto.",
          "errorMin": "Describe tu proyecto en al menos 20 caracteres."
        },
        "captcha": {
          "label": "Escribe el código",
          "refresh": "Generar un nuevo código",
          "inputPlaceholder": "Escribe el código",
          "errorRequired": "Ingresa el código mostrado.",
          "errorInvalid": "El código no coincide."
        },
        "consent": {
          "errorRequired": "Debes aceptar la política de privacidad.",
          "label": "He leído y acepto la <a href=\"#\">Política de Privacidad</a>."
        },
        "submitAria": "Enviar formulario de contacto",
        "submitLabel": "Enviar"
      }
    },
    "faq": {
      "title": "Preguntas frecuentes",
      "items": {
        "one": {
          "question": "¿Qué es FoodChain?",
          "answer": "Digitaliza y asegura la trazabilidad: códigos QR firmados, hashes en blockchain y verificación pública."
        },
        "two": {
          "question": "¿Cómo funciona la integración?",
          "answer": "API y conectores para ERP/CRM. Iniciamos con un piloto y onboarding por roles."
        },
        "three": {
          "question": "¿Qué soporte ofrecen?",
          "answer": "Onboarding, mesa de ayuda y planes con SLA."
        }
      }
    },
    "footer": {
      "brand": {
        "ariaLabel": "Volver al inicio"
      },
      "description": "Confianza verificable y trazabilidad auditable para cada lote.",
      "social": "Redes sociales",
      "socialTwitter": "Twitter",
      "socialLinkedIn": "LinkedIn",
      "product": {
        "heading": "Producto",
        "home": "Inicio",
        "solution": "Solución",
        "pricing": "Precios",
        "demo": "Demo",
        "cases": "Casos"
      },
      "resources": {
        "heading": "Recursos",
        "blog": "Blog",
        "docs": "Documentación",
        "help": "Centro de ayuda"
      },
      "legal": {
        "heading": "Legal",
        "privacy": "Privacidad",
        "terms": "Términos",
        "cookies": "Cookies"
      },
      "copy": "FoodChain — Todos los derechos reservados."
    },
    "whatsapp": {
      "ariaLabel": "Chatear por WhatsApp",
      "href": "https://wa.me/XXXXXXXXXXX?text=Hola%20FoodChain,%20quiero%20una%20demo"
    }
  }
};

function normalizeLanguage(value, fallback = DEFAULT_LANGUAGE, supported = SUPPORTED_LANGUAGES) {
    if (typeof value !== 'string' || !value.trim()) {
        return supported.includes(fallback) ? fallback : supported[0];
    }
    const normalized = value.trim().toLowerCase();
    if (supported.includes(normalized)) {
        return normalized;
    }
    const matched = supported.find((language) => normalized.startsWith(`${language}-`));
    if (matched) {
        return matched;
    }
    return supported.includes(fallback) ? fallback : supported[0];
}

function getNestedValue(dictionary, path) {
    if (!dictionary || !path) return undefined;
    return path.split('.').reduce((accumulator, segment) => {
        if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, segment)) {
            return accumulator[segment];
        }
        return undefined;
    }, dictionary);
}

function applyTranslations(dictionary) {
    if (!dictionary) return;
    const elements = document.querySelectorAll('[data-i18n], [data-i18n-attrs]');
    elements.forEach((element) => {
        const key = element.dataset.i18n;
        if (key) {
            const value = getNestedValue(dictionary, key);
            if (value !== undefined && value !== null) {
                if (element.dataset.i18nType === 'html') {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        }

        const attrMap = element.dataset.i18nAttrs;
        if (!attrMap) return;
        attrMap.split(',').forEach((pair) => {
            if (!pair) return;
            const [attribute, attrKey] = pair.split(':').map((item) => item && item.trim());
            if (!attribute || !attrKey) return;
            const attrValue = getNestedValue(dictionary, attrKey);
            if (attrValue === undefined || attrValue === null) return;
            if (attribute === 'html') {
                element.innerHTML = attrValue;
                return;
            }
            if (attribute === 'text') {
                element.textContent = attrValue;
                return;
            }
            element.setAttribute(attribute, attrValue);
        });
    });
}

function initI18n({ defaultLanguage = DEFAULT_LANGUAGE, supportedLanguages = SUPPORTED_LANGUAGES, onChange } = {}) {
    const htmlElement = document.documentElement;
    const languageButtons = Array.from(document.querySelectorAll('[data-lang]'));
    let currentLanguage = normalizeLanguage(htmlElement.lang || defaultLanguage, defaultLanguage, supportedLanguages);
    let readyResolved = false;
    let resolveReady;
    const ready = new Promise((resolve) => {
        resolveReady = (language) => {
            if (readyResolved) return;
            readyResolved = true;
            resolve(language);
        };
    });

    const setButtonState = (language) => {
        languageButtons.forEach((button) => {
            const targetLang = normalizeLanguage(button.dataset.lang, defaultLanguage, supportedLanguages);
            const isActive = targetLang === language;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const loadDictionary = (language) => {
        const normalized = normalizeLanguage(language, defaultLanguage, supportedLanguages);
        if (translationsCache.has(normalized)) {
            return translationsCache.get(normalized);
        }
        const dictionary = dictionaries[normalized];
        if (!dictionary) {
            throw new Error(`Unable to load translations for ${normalized}`);
        }
        translationsCache.set(normalized, dictionary);
        return dictionary;
    };

    const applyLanguage = (language, dictionary, { persist = true, notify = true } = {}) => {
        if (!dictionary) return currentLanguage;
        applyTranslations(dictionary);
        htmlElement.setAttribute('lang', language);
        setButtonState(language);
        if (persist) {
            safeStorage.set(STORAGE_KEYS.language, language);
        }
        currentLanguage = language;
        if (typeof onChange === 'function' && notify) {
            onChange(language);
        }
        return language;
    };

    const setLanguage = (language, options = {}) => {
        const normalized = normalizeLanguage(language, defaultLanguage, supportedLanguages);
        try {
            const dictionary = loadDictionary(normalized);
            return applyLanguage(normalized, dictionary, options);
        } catch (error) {
            console.warn('Failed to set language', normalized, error);
            if (normalized !== defaultLanguage) {
                try {
                    const fallbackDictionary = loadDictionary(defaultLanguage);
                    return applyLanguage(defaultLanguage, fallbackDictionary, options);
                } catch (fallbackError) {
                    console.error('Failed to load fallback language', fallbackError);
                }
            }
        }
        return currentLanguage;
    };

    const detectLanguage = () => {
        const stored = safeStorage.get(STORAGE_KEYS.language);
        if (stored) {
            return normalizeLanguage(stored, defaultLanguage, supportedLanguages);
        }
        const navigatorLanguages = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language].filter(Boolean);
        for (const candidate of navigatorLanguages) {
            const normalized = normalizeLanguage(candidate, defaultLanguage, supportedLanguages);
            if (supportedLanguages.includes(normalized)) {
                return normalized;
            }
        }
        return defaultLanguage;
    };

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetLang = button.dataset.lang;
            setLanguage(targetLang, { persist: true });
        });
    });

    setButtonState(currentLanguage);

    const initialLanguage = detectLanguage();
    const loadedLanguage = setLanguage(initialLanguage, { persist: false, notify: false });
    resolveReady(loadedLanguage);
    if (typeof onChange === 'function') {
        onChange(loadedLanguage);
    }

    return {
        getLanguage: () => currentLanguage,
        setLanguage,
        ready
    };
}

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const storedThemePreference = safeStorage.get(STORAGE_KEYS.theme);
const derivedTheme = storedThemePreference || (prefersDarkScheme.matches ? 'dark' : 'light');
rootElement.classList.add(`theme-${derivedTheme}`, 'theme-preload');
rootElement.style.setProperty('color-scheme', derivedTheme);

function debounce(fn, delay = 150) {
    let timeoutId = null;
    return function debounced(...args) {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
    };
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
    const faqApi = initFaqAccordion();
    initScrollReveal();
    updateFooterYear();

    const syncUi = () => {
        headerApi.refreshLabels();
        segmentsApi.refreshIndicator();
        featuresApi.refreshHeights();
        contactApi.refreshCopy();
        themeApi.refreshAria();
        if (faqApi && typeof faqApi.refreshHeights === 'function') {
            faqApi.refreshHeights();
        }
    };

    const i18nApi = initI18n({
        onChange: () => {
            syncUi();
        }
    });

    syncUi();
    if (i18nApi && typeof i18nApi.ready === 'object' && typeof i18nApi.ready.then === 'function') {
        i18nApi.ready.then(() => {
            syncUi();
        });
    }
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

    const detailsWrapper = container.querySelector('.caracteristicas__details');

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
        if (!detailsWrapper || !detail) return;
        requestAnimationFrame(() => {
            const height = Math.ceil(detail.scrollHeight);
            detailsWrapper.style.setProperty('--feature-detail-height', `${height}px`);
            detailsWrapper.style.height = `${height}px`;
        });
    };

    const showDetail = (targetSelector) => {
        details.forEach((detail) => {
            const isActive = `#${detail.id}` === targetSelector;
            detail.classList.toggle('is-active', isActive);
            detail.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            if (isActive) {
                setDetailHeight(detail);
            }
        });
        if (detailsWrapper) {
            const activeDetail = details.find((detail) => detail.classList.contains('is-active'));
            const nextHeight = activeDetail ? Math.ceil(activeDetail.scrollHeight) : 0;
            detailsWrapper.style.setProperty('--feature-detail-height', `${nextHeight}px`);
            if (nextHeight === 0) {
                detailsWrapper.style.height = '';
            } else {
                detailsWrapper.style.height = `${nextHeight}px`;
            }
        }
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
            if (activeDetail) {
                setDetailHeight(activeDetail);
            } else if (detailsWrapper) {
                detailsWrapper.style.setProperty('--feature-detail-height', '0px');
                detailsWrapper.style.height = '';
            }
        }
    };
}

function initFaqAccordion() {
    const faqSection = document.getElementById('faq');
    if (!faqSection || faqSection.dataset.accordionInit === 'true') return;
    faqSection.dataset.accordionInit = 'true';

    const triggers = Array.from(faqSection.querySelectorAll('.faq-card__trigger'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const refreshHeights = () => {
        if (prefersReducedMotion) return;
        triggers.forEach((trigger) => {
            if (trigger.getAttribute('aria-expanded') !== 'true') return;
            const panelId = trigger.getAttribute('aria-controls');
            if (!panelId) return;
            const panel = document.getElementById(panelId);
            if (!panel) return;
            panel.style.maxHeight = 'none';
            const measuredHeight = panel.scrollHeight;
            panel.style.maxHeight = `${measuredHeight}px`;
            requestAnimationFrame(() => {
                panel.style.maxHeight = 'none';
            });
        });
    };

    const openItem = (trigger, panel) => {
        trigger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        panel.removeAttribute('hidden');
        panel.dataset.open = 'true';
        if (!prefersReducedMotion) {
            panel.style.maxHeight = `${panel.scrollHeight}px`;
            const handleOpenTransition = (event) => {
                if (event.propertyName !== 'max-height') return;
                panel.style.maxHeight = 'none';
                panel.removeEventListener('transitionend', handleOpenTransition);
            };
            panel.addEventListener('transitionend', handleOpenTransition);
        }
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
            refreshHeights();
        });
    });

    window.addEventListener('resize', debounce(refreshHeights, 150));

    return {
        refreshHeights
    };
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
