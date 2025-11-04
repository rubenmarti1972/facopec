export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  strapiUrl: 'http://localhost:1337',
  appUrl: 'http://localhost:4200',
  strapi: {
    apiKey: 'your-strapi-api-key-here',
    bearerToken: 'your-strapi-bearer-token-here'
  },
  paypal: {
    clientId: 'your-paypal-client-id-here',
    mode: 'sandbox',
    currency: 'USD',
    apiUrl: 'https://api-m.sandbox.paypal.com'
  },
  womansBank: {
    accountNumber: 'XXXX-XXXX-XXXX-XXXX',
    routingNumber: 'XXXXXXXXX',
    bankName: 'Banco Femenino',
    accountHolder: 'Fundación Afrocolombiana Pro Encasa',
    swiftCode: 'SWFTCOCO'
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 3600000
  },
  app: {
    name: 'Fundación Afrocolombiana Pro Encasa',
    version: '1.0.0',
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en', 'fr'],
    itemsPerPage: 10,
    maxUploadSize: 52428800,
    allowedFileTypes: ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
  },
  socialMedia: {
    facebook: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
    instagram: 'https://www.instagram.com/fundacion_profeencasa',
    x: 'https://x.com/FundacionProfe',
    youtube: 'https://www.youtube.com/@fundacionprofeencasa',
    whatsapp: 'https://wa.me/573215230283'
  },
  logging: {
    enabled: true,
    level: 'debug'
  }
};
