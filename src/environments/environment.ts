export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appUrl: 'http://localhost:4200',
  strapi: {
    url: 'http://localhost:1337',
    publicUrl: 'http://localhost:1337',
    apiToken: '', // Not required for public APIs
    previewToken: '', // Only needed for draft/preview content
    cacheDurationMs: 0, // Cache disabled in development
    requestTimeoutMs: 10000 // 10 seconds timeout in development
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
    facebook: 'https://www.facebook.com/Profeencasasedecds',
    instagram: 'https://www.instagram.com/fundacion_profeencasa/',
    x: 'https://x.com/FundacionProfe',
    twitter: 'https://x.com/FundacionProfe',
    youtube: 'https://www.youtube.com/@fundacionafroprofeencasa',
    whatsapp: 'https://api.whatsapp.com/send/?phone=573215230283&text=Hola+%EF%BF%BD%2C+Quiero+mas+informaci%C3%B3n&type=phone_number&app_absent=0',
    linkedIn: 'https://www.linkedin.com/in/fundación-afrocolombiana',
    tiktok: 'https://www.tiktok.com/@profeencasaoficial',
    telegram: 'https://t.me/Facopec'
  },
  logging: {
    enabled: true,
    level: 'debug'
  }
};
