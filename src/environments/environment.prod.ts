/**
 * Production Environment Configuration
 */

export const environment = {
  production: true,
  
  // Base URLs - Use environment variables or CI/CD provided values
  apiUrl: process.env['API_URL'] || 'https://api.fundacionafro.org',
  strapiUrl: process.env['STRAPI_URL'] || 'https://cms.fundacionafro.org',
  appUrl: process.env['APP_URL'] || 'https://www.fundacionafro.org',
  
  // Strapi Configuration
  strapi: {
    apiKey: process.env['STRAPI_API_KEY'] || '',
    bearerToken: process.env['STRAPI_BEARER_TOKEN'] || ''
  },
  
  // PayPal Configuration
  paypal: {
    clientId: process.env['PAYPAL_CLIENT_ID'] || '',
    mode: 'live', // Production uses live mode
    currency: 'USD',
    apiUrl: 'https://api.paypal.com'
  },
  
  // Women's Bank Configuration (Bank Transfer Details)
  womansBank: {
    accountNumber: process.env['WOMANS_BANK_ACCOUNT'] || '',
    routingNumber: process.env['WOMANS_BANK_ROUTING'] || '',
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
    facebook: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
    instagram: 'https://www.instagram.com/fundacion_profeencasa',
    x: 'https://x.com/FundacionProfe',
    youtube: 'https://www.youtube.com/@fundacionprofeencasa',
    whatsapp: 'https://wa.me/573215230283'
  },
  
  // Logging - Disabled in production
  logging: {
    enabled: false,
    level: 'error'
  },
  
  // Security
  security: {
    enableCSRF: true,
    corsOrigins: process.env['CORS_ORIGINS']?.split(',') || ['https://www.fundacionafro.org'],
    secureHeaders: true,
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "www.paypal.com", "*.paypal.com"],
      connectSrc: ["'self'", "*.paypal.com", "*.sandbox.paypal.com"],
      imgSrc: ["'self'", "data:", "https:", "*.paypal.com"]
    }
  }
};
