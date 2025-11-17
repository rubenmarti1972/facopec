/**
 * Production Environment Configuration
 */

export const environment = {
  production: true,

  // Base URLs
  apiUrl: 'https://facopec-strapi.onrender.com',
  appUrl: 'https://fundacion-afrocolombiana.web.app',

  // Strapi Configuration
  strapi: {
    url: 'https://facopec-strapi.onrender.com',
    publicUrl: 'https://facopec-strapi.onrender.com',
    apiToken: '',          // si algún día usas tokens, los pones aquí a mano
    previewToken: '',
    cacheDurationMs: 300000
  },

  // PayPal Configuration
  paypal: {
    clientId: '',          // aquí pones el ID si algún día lo necesitas en el front
    mode: 'live',
    currency: 'USD',
    apiUrl: 'https://api.paypal.com'
  },

  // Women's Bank Configuration (Bank Transfer Details)
  womansBank: {
    accountNumber: '',
    routingNumber: '',
    bankName: 'Banco Femenino Latinoamericano',
    accountHolder: 'Fundación Afrocolombiana Pro Encasa NIT: 900XXXXXX-X',
    swiftCode: 'SWFTCOCO'
  },

  // Authentication
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 3600000 // 1 hour in milliseconds
  },

  // Application Settings
  app: {
    name: 'Fundación Afrocolombiana Pro Encasa',
    version: '1.0.0',
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en', 'fr'],
    itemsPerPage: 10,
    maxUploadSize: 52428800, // 50MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
  },

  // Social Media
  socialMedia: {
    facebook: 'https://www.facebook.com/Profeencasasedecds',
    instagram: 'https://www.instagram.com/fundacion_profeencasa/',
    x: 'https://x.com/FundacionProfe',
    twitter: 'https://x.com/FundacionProfe',
    youtube: 'https://www.youtube.com/@fundacionafroprofeencasa',
    whatsapp: 'https://api.whatsapp.com/send/?phone=573215230283&text=Hola+%EF%BF%BD%2C+Quiero+mas+informaci%C3%B3n&type=phone_number&app_absent=0',
    linkedIn: 'https://www.linkedin.com/company/facopec',
    tiktok: 'https://www.tiktok.com/@profeencasaoficial',
    telegram: 'https://t.me/Facopec'
  },

  // Logging - Disabled in production
  logging: {
    enabled: false,
    level: 'error'
  },

  // Security
  security: {
    enableCSRF: true,
    corsOrigins: ['https://fundacion-afrocolombiana.web.app'],
    secureHeaders: true,
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "www.paypal.com", "*.paypal.com"],
      connectSrc: ["'self'", "*.paypal.com", "*.sandbox.paypal.com"],
      imgSrc: ["'self'", "data:", "https:", "*.paypal.com"]
    }
  }
};
