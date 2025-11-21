import type { Schema, Struct } from '@strapi/strapi';

export interface DonationsDonationAmount extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_amounts';
  info: {
    displayName: 'Monto sugerido';
    icon: 'coins';
  };
  attributes: {
    icon: Schema.Attribute.String;
    impact: Schema.Attribute.String;
    label: Schema.Attribute.String;
    value: Schema.Attribute.Integer;
  };
}

export interface DonationsDonationHighlight extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_highlights';
  info: {
    displayName: 'Destacado de donaci\u00F3n';
    icon: 'lightbulb';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['teal', 'blue', 'sun', 'rose']> &
      Schema.Attribute.DefaultTo<'teal'>;
    title: Schema.Attribute.String;
  };
}

export interface DonationsDonationMetric extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_metrics';
  info: {
    displayName: 'Indicador de donaciones';
    icon: 'chart-pie';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface DonationsDonationStory extends Struct.ComponentSchema {
  collectionName: 'components_donations_donation_stories';
  info: {
    displayName: 'Historia de impacto';
    icon: 'book-open';
  };
  attributes: {
    cover: Schema.Attribute.Media;
    description: Schema.Attribute.Text;
    impact: Schema.Attribute.Text;
    link: Schema.Attribute.String;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface DonationsPaymentGateway extends Struct.ComponentSchema {
  collectionName: 'components_donations_payment_gateways';
  info: {
    displayName: 'Pasarela de pago';
    icon: 'credit-card';
  };
  attributes: {
    actionLabel: Schema.Attribute.String;
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    link: Schema.Attribute.String;
    name: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['pse', 'nequi', 'international']> &
      Schema.Attribute.DefaultTo<'pse'>;
  };
}

export interface DonationsSupportAction extends Struct.ComponentSchema {
  collectionName: 'components_donations_support_actions';
  info: {
    displayName: 'Acci\u00F3n de apoyo';
    icon: 'hand-holding-heart';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    link: Schema.Attribute.String;
    linkLabel: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['teal', 'blue', 'rose', 'sun']> &
      Schema.Attribute.DefaultTo<'teal'>;
    title: Schema.Attribute.String;
  };
}

export interface GlobalAddress extends Struct.ComponentSchema {
  collectionName: 'components_global_addresses';
  info: {
    displayName: 'Direcci\u00F3n';
    icon: 'map';
  };
  attributes: {
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    postalCode: Schema.Attribute.String;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
  };
}

export interface GlobalHours extends Struct.ComponentSchema {
  collectionName: 'components_global_hours';
  info: {
    displayName: 'Horario de atenci\u00F3n';
    icon: 'clock';
  };
  attributes: {
    friday: Schema.Attribute.String;
    monday: Schema.Attribute.String;
    saturday: Schema.Attribute.String;
    sunday: Schema.Attribute.String;
    thursday: Schema.Attribute.String;
    tuesday: Schema.Attribute.String;
    wednesday: Schema.Attribute.String;
  };
}

export interface GlobalNavigationGroup extends Struct.ComponentSchema {
  collectionName: 'components_global_navigation_groups';
  info: {
    displayName: 'Grupo de navegaci\u00F3n';
    icon: 'layer-group';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    items: Schema.Attribute.Component<'global.navigation-link', true>;
    title: Schema.Attribute.String;
  };
}

export interface GlobalNavigationItem extends Struct.ComponentSchema {
  collectionName: 'components_global_navigation_items';
  info: {
    displayName: 'Elemento de navegaci\u00F3n';
    icon: 'bars';
  };
  attributes: {
    children: Schema.Attribute.Component<'global.navigation-group', true>;
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    exact: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    fragment: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    target: Schema.Attribute.Enumeration<['_self', '_blank']> &
      Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String;
  };
}

export interface GlobalNavigationLink extends Struct.ComponentSchema {
  collectionName: 'components_global_navigation_links';
  info: {
    displayName: 'Enlace de navegaci\u00F3n';
    icon: 'link';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.String;
    fragment: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    target: Schema.Attribute.Enumeration<['_self', '_blank']> &
      Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String;
  };
}

export interface GlobalSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_global_social_links';
  info: {
    displayName: 'Red social';
    icon: 'share';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    label: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'x',
        'youtube',
        'whatsapp',
        'linkedin',
        'tiktok',
        'blog',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GlobalValueItem extends Struct.ComponentSchema {
  collectionName: 'components_global_value_items';
  info: {
    displayName: 'Elemento de valor';
    icon: 'star';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomeActivityCard extends Struct.ComponentSchema {
  collectionName: 'components_home_activity_cards';
  info: {
    displayName: 'Actividad';
    icon: 'calendar';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    link: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images'>;
    theme: Schema.Attribute.Enumeration<['teal', 'blue', 'rose', 'gold']> &
      Schema.Attribute.DefaultTo<'teal'>;
    title: Schema.Attribute.String;
  };
}

export interface HomeAttendedPersonCard extends Struct.ComponentSchema {
  collectionName: 'components_home_attended_person_cards';
  info: {
    description: 'Card showing information about attended persons by program';
    displayName: 'Attended Person Card';
    icon: 'users';
  };
  attributes: {
    count: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'\uD83D\uDC65'>;
    program: Schema.Attribute.String & Schema.Attribute.Required;
    theme: Schema.Attribute.Enumeration<
      ['teal', 'blue', 'rose', 'gold', 'purple', 'green']
    > &
      Schema.Attribute.DefaultTo<'teal'>;
  };
}

export interface HomeCarouselItem extends Struct.ComponentSchema {
  collectionName: 'components_home_carousel_items';
  info: {
    description: 'Item individual del carrusel del h\u00E9roe';
    displayName: 'Carousel Item';
    icon: 'image';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface HomeEventCalendarItem extends Struct.ComponentSchema {
  collectionName: 'components_home_event_calendar_items';
  info: {
    description: 'Individual event item for the calendar';
    displayName: 'Event Calendar Item';
    icon: 'calendar';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['taller', 'reunion', 'evento', 'actividad', 'formacion', 'celebracion']
    > &
      Schema.Attribute.DefaultTo<'evento'>;
    color: Schema.Attribute.Enumeration<
      ['teal', 'blue', 'rose', 'gold', 'purple', 'green']
    > &
      Schema.Attribute.DefaultTo<'teal'>;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.DateTime;
    eventDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    isHighlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.String;
    location: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heroes';
  info: {
    displayName: 'Secci\u00F3n h\u00E9roe';
    icon: 'address-card';
  };
  attributes: {
    actions: Schema.Attribute.Component<'shared.hero-action', true>;
    carouselItems: Schema.Attribute.Component<'home.carousel-item', true>;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media;
    lead: Schema.Attribute.Text;
    stats: Schema.Attribute.Component<'shared.stat', true>;
    titleLines: Schema.Attribute.Component<'home.title-line', true>;
    verse: Schema.Attribute.Component<'home.verse', false>;
  };
}

export interface HomeIdentity extends Struct.ComponentSchema {
  collectionName: 'components_home_identities';
  info: {
    displayName: 'Identidad';
    icon: 'users';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    values: Schema.Attribute.Component<'shared.value', true>;
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

export interface HomeProgramCard extends Struct.ComponentSchema {
  collectionName: 'components_home_program_cards';
  info: {
    displayName: 'Programa';
    icon: 'tasks';
  };
  attributes: {
    description: Schema.Attribute.Text;
    highlights: Schema.Attribute.JSON;
    link: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images'>;
    logoAlt: Schema.Attribute.String;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomeProgramLogoSimple extends Struct.ComponentSchema {
  collectionName: 'components_home_program_logo_simples';
  info: {
    description: 'Logo simple de programa con link externo';
    displayName: 'Logo de Programa Simple';
    icon: 'link';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface HomeTitleLine extends Struct.ComponentSchema {
  collectionName: 'components_home_title_lines';
  info: {
    displayName: 'L\u00EDnea de t\u00EDtulo';
    icon: 'text';
  };
  attributes: {
    line: Schema.Attribute.String;
  };
}

export interface HomeVerse extends Struct.ComponentSchema {
  collectionName: 'components_home_verses';
  info: {
    displayName: 'Vers\u00EDculo';
    icon: 'book';
  };
  attributes: {
    description: Schema.Attribute.Text;
    reference: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface SharedCatalogItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_catalog_items';
  info: {
    displayName: 'Cat\u00E1logo WhatsApp';
    icon: 'shopping-cart';
  };
  attributes: {
    description: Schema.Attribute.Text;
    link: Schema.Attribute.String;
    price: Schema.Attribute.String;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_items';
  info: {
    displayName: 'Galer\u00EDa';
    icon: 'image';
  };
  attributes: {
    description: Schema.Attribute.Text;
    link: Schema.Attribute.String;
    media: Schema.Attribute.Media;
    strapiCollection: Schema.Attribute.String;
    strapiEntryId: Schema.Attribute.String;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['image', 'video']> &
      Schema.Attribute.DefaultTo<'image'>;
  };
}

export interface SharedHeroAction extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_actions';
  info: {
    displayName: 'Acci\u00F3n del h\u00E9roe';
    icon: 'mouse-pointer';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    isInternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlights';
  info: {
    displayName: 'Destacado';
    icon: 'star';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<
      ['teal', 'blue', 'rose', 'gold', 'sun']
    > &
      Schema.Attribute.DefaultTo<'teal'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Estad\u00EDstica';
    icon: 'chart-line';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedSupporterLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_supporter_logos';
  info: {
    displayName: 'Logo aliado';
    icon: 'handshake';
  };
  attributes: {
    caption: Schema.Attribute.String;
    dataUid: Schema.Attribute.String;
    link: Schema.Attribute.String;
    logo: Schema.Attribute.Media;
    name: Schema.Attribute.String;
  };
}

export interface SharedValue extends Struct.ComponentSchema {
  collectionName: 'components_shared_values';
  info: {
    displayName: 'Valor';
    icon: 'heart';
  };
  attributes: {
    dataUid: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'donations.donation-amount': DonationsDonationAmount;
      'donations.donation-highlight': DonationsDonationHighlight;
      'donations.donation-metric': DonationsDonationMetric;
      'donations.donation-story': DonationsDonationStory;
      'donations.payment-gateway': DonationsPaymentGateway;
      'donations.support-action': DonationsSupportAction;
      'global.address': GlobalAddress;
      'global.hours': GlobalHours;
      'global.navigation-group': GlobalNavigationGroup;
      'global.navigation-item': GlobalNavigationItem;
      'global.navigation-link': GlobalNavigationLink;
      'global.social-link': GlobalSocialLink;
      'global.value-item': GlobalValueItem;
      'home.activity-card': HomeActivityCard;
      'home.attended-person-card': HomeAttendedPersonCard;
      'home.carousel-item': HomeCarouselItem;
      'home.event-calendar-item': HomeEventCalendarItem;
      'home.hero': HomeHero;
      'home.identity': HomeIdentity;
      'home.mission-vision': HomeMissionVision;
      'home.program-card': HomeProgramCard;
      'home.program-logo-simple': HomeProgramLogoSimple;
      'home.title-line': HomeTitleLine;
      'home.verse': HomeVerse;
      'shared.catalog-item': SharedCatalogItem;
      'shared.gallery-item': SharedGalleryItem;
      'shared.hero-action': SharedHeroAction;
      'shared.highlight': SharedHighlight;
      'shared.stat': SharedStat;
      'shared.supporter-logo': SharedSupporterLogo;
      'shared.value': SharedValue;
    }
  }
}
