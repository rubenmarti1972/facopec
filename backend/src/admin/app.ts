import logo from './extensions/logo.svg';

export default {
  config: {
    locales: ['es', 'en'],
    tutorials: false,
    notifications: { release: false },
    translations: {},
    head: {
      favicon: logo,
      logo
    },
    auth: {
      logo
    },
    theme: {
      light: {
        colors: {
          primary100: '#e0f2f1',
          primary200: '#b2dfdb',
          primary500: '#009688',
          buttonPrimary500: '#1b5e20',
          alternative100: '#f0f4c3'
        }
      }
    }
  },
  bootstrap(app: unknown) {
    return app;
  }
};
