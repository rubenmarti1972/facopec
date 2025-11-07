import type { Struct, Schema } from '@strapi/strapi';

export interface SharedValue extends Struct.ComponentSchema {
  collectionName: 'components_shared_values';
  info: {
    displayName: 'Valor';
    icon: 'heart';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    dataUid: Schema.Attribute.String;
  };
}

export interface SharedSupporterLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_supporter_logos';
  info: {
    displayName: 'Logo aliado';
    icon: 'handshake';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    link: Schema.Attribute.String;
    dataUid: Schema.Attribute.String;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Estad\u00EDstica';
    icon: 'chart-line';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlights';
  info: {
    displayName: 'Destacado';
    icon: 'star';
  };
  attributes: {
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<
      ['teal', 'blue', 'rose', 'gold', 'sun']
    > &
      Schema.Attribute.DefaultTo<'teal'>;
    dataUid: Schema.Attribute.String;
  };
}

export interface SharedHeroAction extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_actions';
  info: {
    displayName: 'Acci\u00F3n del h\u00E9roe';
    icon: 'mouse-pointer';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary']> &
      Schema.Attribute.DefaultTo<'primary'>;
    isInternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    dataUid: Schema.Attribute.String;
  };
}

export interface SharedGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_items';
  info: {
    displayName: 'Galer\u00EDa';
    icon: 'image';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    media: Schema.Attribute.Media & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['image', 'video']> &
      Schema.Attribute.DefaultTo<'image'>;
    link: Schema.Attribute.String;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
  };
}

export interface SharedCatalogItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_catalog_items';
  info: {
    displayName: 'Cat\u00E1logo WhatsApp';
    icon: 'shopping-cart';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    price: Schema.Attribute.String;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
  };
}

export interface HomeVerse extends Struct.ComponentSchema {
  collectionName: 'components_home_verses';
  info: {
    displayName: 'Vers\u00EDculo';
    icon: 'book';
  };
  attributes: {
    reference: Schema.Attribute.String;
    text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
  };
}

export interface HomeTitleLine extends Struct.ComponentSchema {
  collectionName: 'components_home_title_lines';
  info: {
    displayName: 'L\u00EDnea de t\u00EDtulo';
    icon: 'text';
  };
  attributes: {
    line: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeProgramCard extends Struct.ComponentSchema {
  collectionName: 'components_home_program_cards';
  info: {
    displayName: 'Programa';
    icon: 'tasks';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    highlights: Schema.Attribute.JSON;
    link: Schema.Attribute.String;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
  };
}

export interface HomeMissionVision extends Struct.ComponentSchema {
  collectionName: 'components_home_mission_visions';
  info: {
    displayName: 'Misi\u00F3n y visi\u00F3n';
    icon: 'bullseye';
  };
  attributes: {
    mission: Schema.Attribute.Text;
    missionUid: Schema.Attribute.String;
    vision: Schema.Attribute.Text;
    visionUid: Schema.Attribute.String;
  };
}

export interface HomeIdentity extends Struct.ComponentSchema {
  collectionName: 'components_home_identities';
  info: {
    displayName: 'Identidad';
    icon: 'users';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    dataUid: Schema.Attribute.String;
    values: Schema.Attribute.Component<'shared.value', true>;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heroes';
  info: {
    displayName: 'Secci\u00F3n h\u00E9roe';
    icon: 'address-card';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    titleLines: Schema.Attribute.Component<'home.title-line', true>;
    lead: Schema.Attribute.Text;
    image: Schema.Attribute.Media;
    stats: Schema.Attribute.Component<'shared.stat', true>;
    actions: Schema.Attribute.Component<'shared.hero-action', true>;
    verse: Schema.Attribute.Component<'home.verse', false>;
  };
}

export interface HomeActivityCard extends Struct.ComponentSchema {
  collectionName: 'components_home_activity_cards';
  info: {
    displayName: 'Actividad';
    icon: 'calendar';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['teal', 'blue', 'rose', 'gold']> &
      Schema.Attribute.DefaultTo<'teal'>;
    link: Schema.Attribute.String;
    dataUid: Schema.Attribute.String;
  };
}

export interface GlobalValueItem extends Struct.ComponentSchema {
  collectionName: 'components_global_value_items';
  info: {
    displayName: 'Elemento de valor';
    icon: 'star';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    dataUid: Schema.Attribute.String;
  };
}

export interface GlobalSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_global_social_links';
  info: {
    displayName: 'Red social';
    icon: 'share';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'x',
        'youtube',
        'whatsapp',
        'linkedin',
        'tiktok',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String;
  };
}

export interface GlobalNavigationLink extends Struct.ComponentSchema {
  collectionName: 'components_global_navigation_links';
  info: {
    displayName: 'Enlace de navegaci\u00F3n';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface GlobalHours extends Struct.ComponentSchema {
  collectionName: 'components_global_hours';
  info: {
    displayName: 'Horario de atenci\u00F3n';
    icon: 'clock';
  };
  attributes: {
    monday: Schema.Attribute.String;
    tuesday: Schema.Attribute.String;
    wednesday: Schema.Attribute.String;
    thursday: Schema.Attribute.String;
    friday: Schema.Attribute.String;
    saturday: Schema.Attribute.String;
    sunday: Schema.Attribute.String;
  };
}

export interface GlobalAddress extends Struct.ComponentSchema {
  collectionName: 'components_global_addresses';
  info: {
    displayName: 'Direcci\u00F3n';
    icon: 'map';
  };
  attributes: {
    street: Schema.Attribute.String;
    city: Schema.Attribute.String;
    state: Schema.Attribute.String;
    postalCode: Schema.Attribute.String;
    country: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
  };
}

export interface DonationsSupportAction extends Struct.ComponentSchema {
  collectionName: 'components_donations_support_actions';
  info: {
    displayName: 'Acci\u00F3n de apoyo';
    icon: 'hand-holding-heart';
  };
  attributes: {
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    link: Schema.Attribute.String;
    linkLabel: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['teal', 'blue', 'rose', 'sun']> &
      Schema.Attribute.DefaultTo<'teal'>;
    dataUid: Schema.Attribute.String;
  };
}

export interface DonationsPaymentGateway extends Struct.ComponentSchema {
  collectionName: 'components_donations_payment_gateways';
  info: {
    displayName: 'Pasarela de pago';
    icon: 'credit-card';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    actionLabel: Schema.Attribute.String;
    badge: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['pse', 'international']> &
      Schema.Attribute.DefaultTo<'pse'>;
  };
}

export interface DonationsDonationStory extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_stories';
  info: {
    displayName: 'Historia de impacto';
    icon: 'book-open';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    impact: Schema.Attribute.Text;
    cover: Schema.Attribute.Media & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
  };
}

export interface DonationsDonationMetric extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_metrics';
  info: {
    displayName: 'Indicador de donaciones';
    icon: 'chart-pie';
  };
  attributes: {
    value: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    dataUid: Schema.Attribute.String;
  };
}

export interface DonationsDonationHighlight extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_highlights';
  info: {
    displayName: 'Destacado de donaci\u00F3n';
    icon: 'lightbulb';
  };
  attributes: {
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    theme: Schema.Attribute.Enumeration<['teal', 'blue', 'sun', 'rose']> &
      Schema.Attribute.DefaultTo<'teal'>;
    dataUid: Schema.Attribute.String;
  };
}

export interface DonationsDonationAmount extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_amounts';
  info: {
    displayName: 'Monto sugerido';
    icon: 'coins';
  };
  attributes: {
    value: Schema.Attribute.Integer & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    impact: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.value': SharedValue;
      'shared.supporter-logo': SharedSupporterLogo;
      'shared.stat': SharedStat;
      'shared.highlight': SharedHighlight;
      'shared.hero-action': SharedHeroAction;
      'shared.gallery-item': SharedGalleryItem;
      'shared.catalog-item': SharedCatalogItem;
      'home.verse': HomeVerse;
      'home.title-line': HomeTitleLine;
      'home.program-card': HomeProgramCard;
      'home.mission-vision': HomeMissionVision;
      'home.identity': HomeIdentity;
      'home.hero': HomeHero;
      'home.activity-card': HomeActivityCard;
      'global.value-item': GlobalValueItem;
      'global.social-link': GlobalSocialLink;
      'global.navigation-link': GlobalNavigationLink;
      'global.hours': GlobalHours;
      'global.address': GlobalAddress;
      'donations.support-action': DonationsSupportAction;
      'donations.payment-gateway': DonationsPaymentGateway;
      'donations.donation-story': DonationsDonationStory;
      'donations.donation-metric': DonationsDonationMetric;
      'donations.donation-highlight': DonationsDonationHighlight;
      'donations.donation-amount': DonationsDonationAmount;
    }
  }
}
