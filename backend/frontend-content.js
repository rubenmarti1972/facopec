const sharedHeroActions = [
  {
    label: 'Donar ahora',
    url: '/donaciones',
    variant: 'primary',
    isInternal: true,
    dataUid: 'hero.actions.donate'
  },
  {
    label: 'Ver programas',
    url: '/inicio#programas',
    variant: 'secondary',
    isInternal: true,
    dataUid: 'hero.actions.programs'
  }
];

const homePageContent = {
  hero: {
    eyebrow: 'Misión con sentido social',
    titleLines: [
      { line: 'Educación, cuidado y defensa' },
      { line: 'de derechos para el fortalecimiento étnico' },
      { line: 'y social de nuestras comunidades' }
    ],
    lead:
      'Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Cauca.',
    stats: [
      { value: '+180', label: 'Estudiantes acompañados con tutorías y mentorías' },
      { value: '35', label: 'Voluntarios activos en programas comunitarios' },
      { value: '12', label: 'Barrios impactados con actividades presenciales y virtuales' }
    ],
    actions: sharedHeroActions,
    verse: {
      reference: 'Proverbios 3:13',
      text: '“Feliz quien halla sabiduría”',
      description:
        'Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.'
    }
  },
  impactHighlights: [
    {
      icon: '📚',
      title: 'Educación integral',
      label: 'Tutorías, clubes de lectura y acompañamiento pedagógico',
      description: 'Tutorías, clubes de lectura y acompañamiento pedagógico',
      dataUid: 'impact.education',
      theme: 'teal'
    },
    {
      icon: '🤝🏾',
      title: 'Tejido comunitario',
      label: 'Trabajo con familias, líderes y aliados del territorio',
      description: 'Trabajo con familias, líderes y aliados del territorio',
      dataUid: 'impact.community',
      theme: 'blue'
    },
    {
      icon: '🌱',
      title: 'Valores y fe',
      label: 'Formación espiritual, bienestar emocional y liderazgo',
      description: 'Formación espiritual, bienestar emocional y liderazgo',
      dataUid: 'impact.faith',
      theme: 'rose'
    }
  ],
  identity: {
    eyebrow: '¿Quiénes somos?',
    title: 'Fundación Afrocolombiana Profe en Casa (FACOPEC)',
    subtitle: 'Transformamos vidas a través de la educación, la cultura y el cuidado comunitario.',
    description:
      'Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.',
    dataUid: 'about.description',
    values: [
      {
        title: 'Derechos humanos y dignidad',
        description: 'Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
        icon: '👐🏾',
        dataUid: 'about.values.rights'
      },
      {
        title: 'Educación transformadora',
        description: 'Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.',
        icon: '💡',
        dataUid: 'about.values.education'
      },
      {
        title: 'Fe, cultura y comunidad',
        description: 'Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.',
        icon: '🤲🏾',
        dataUid: 'about.values.community'
      }
    ]
  },
  missionVision: {
    mission:
      'La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.',
    missionUid: 'about.mission',
    vision:
      'Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.',
    visionUid: 'about.vision'
  },
  activities: [
    {
      title: 'Tutorías Profe en Casa',
      description: 'Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.',
      icon: '🧠',
      theme: 'teal',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
      dataUid: 'activities.tutorias'
    },
    {
      title: 'Ruta Literaria María',
      description: 'Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.',
      icon: '📖',
      theme: 'blue',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
      dataUid: 'activities.rutaLiteraria'
    },
    {
      title: 'Huerta y alimentación',
      description: 'Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.',
      icon: '🥬',
      theme: 'gold',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
      dataUid: 'activities.huerta'
    },
    {
      title: 'Arte, danza y fe',
      description: 'Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.',
      icon: '🎨',
      theme: 'rose',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura',
      dataUid: 'activities.arte'
    }
  ],
  programs: [
    {
      title: 'Semillero Digital',
      description:
        'Talleres STEAM, alfabetización digital y mentorías vocacionales que conectan a jóvenes con oportunidades tecnológicas.',
      highlights: ['Tecnología', 'Innovación', 'Mentorías'],
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
      strapiCollection: 'programas',
      strapiEntryId: 'semillero-digital'
    },
    {
      title: 'Club Familias que Acompañan',
      description:
        'Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.',
      highlights: ['Familias', 'Bienestar', 'Prevención'],
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
      strapiCollection: 'programas',
      strapiEntryId: 'club-familias'
    }
  ],
  supporters: [
    {
      name: 'Instituto Colombiano de Bienestar Familiar',
      caption: 'Instituto Colombiano de Bienestar Familiar',
      dataUid: 'supporters.icbf'
    },
    {
      name: 'Programa de las Naciones Unidas para el Desarrollo',
      caption: 'Programa de las Naciones Unidas para el Desarrollo',
      dataUid: 'supporters.pnud'
    }
  ],
  catalog: [
    {
      title: 'Kit escolar completo',
      description: 'Útiles, lecturas y materiales artísticos para un estudiante durante un trimestre.',
      price: '$85.000 COP',
      link: 'https://wa.me/p/5881121183974635/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'kit-escolar'
    },
    {
      title: 'Canasta solidaria',
      description: 'Apoyo nutricional para familias con niñas y niños en refuerzo escolar durante un mes.',
      price: '$70.000 COP',
      link: 'https://wa.me/p/5979113203538798/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'canasta-solidaria'
    },
    {
      title: 'Apadrina una tutoría',
      description: 'Financia sesiones personalizadas y acompañamiento pedagógico para un estudiante.',
      price: '$45.000 COP',
      link: 'https://wa.me/p/5332119887812567/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'apadrina-tutoria'
    }
  ],
  gallery: [
    {
      title: 'Laboratorio de lectura',
      description: 'Niños y niñas viven experiencias literarias en la biblioteca comunitaria.',
      type: 'image',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/09/lectura-en-comunidad.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'laboratorio-lectura'
    },
    {
      title: 'Huerta escolar comunitaria',
      description: 'Familias cosechan alimentos y aprenden sobre soberanía alimentaria.',
      type: 'image',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/06/huerta-escolar.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'huerta-escolar'
    },
    {
      title: 'Testimonio en video',
      description: 'Conoce cómo la fundación impacta a las familias del Cauca.',
      type: 'video',
      link: 'https://www.youtube.com/watch?v=VN0qfM2Yg2w',
      strapiCollection: 'galeria',
      strapiEntryId: 'testimonio-video'
    }
  ],
  attendedPersons: [
    {
      program: 'Tutorías Profe en Casa',
      count: 120,
      description: 'Estudiantes en refuerzo escolar',
      icon: '🧠',
      theme: 'teal'
    },
    {
      program: 'Ruta Literaria María',
      count: 65,
      description: 'Participantes en círculos de lectura',
      icon: '📖',
      theme: 'blue'
    },
    {
      program: 'Semillero Digital',
      count: 45,
      description: 'Jóvenes en talleres STEAM',
      icon: '💻',
      theme: 'purple'
    },
    {
      program: 'Club Familias',
      count: 80,
      description: 'Familias acompañadas',
      icon: '👨‍👩‍👧‍👦',
      theme: 'rose'
    }
  ],
  eventCalendar: [
    {
      title: 'Taller de lectura en voz alta',
      description: 'Círculo literario con familias',
      eventDate: '2025-12-15T15:00:00.000Z',
      location: 'Biblioteca Comunitaria',
      category: 'taller',
      color: 'blue',
      isHighlighted: true
    },
    {
      title: 'Reunión Club Familias',
      description: 'Escuela de padres mensual',
      eventDate: '2025-12-20T17:00:00.000Z',
      location: 'Sede FACOPEC',
      category: 'reunion',
      color: 'rose'
    },
    {
      title: 'Celebración Fin de Año',
      description: 'Cierre de actividades 2025',
      eventDate: '2025-12-22T14:00:00.000Z',
      location: 'Parque Central',
      category: 'celebracion',
      color: 'gold',
      isHighlighted: true
    }
  ]
};

const donationsPageContent = {
  heroTitle: 'Tu donación | cambia vidas',
  heroSubtitle:
    'Con cada aporte fortalecemos procesos educativos, culturales y espirituales en el Cauca. Acompañas a familias afrocolombianas para que sigan soñando con más oportunidades.',
  donationAmounts: [
    { value: 20000, label: '$20.000', icon: '🎒', impact: 'Útiles para un niño' },
    { value: 50000, label: '$50.000', icon: '📚', impact: 'Libros y lectura guiada' },
    { value: 100000, label: '$100.000', icon: '🍎', impact: 'Refrigerios de un taller' },
    { value: 200000, label: '$200.000', icon: '🚌', impact: 'Transporte a actividades' }
  ],
  metrics: [
    { value: '+180', label: 'Kits escolares entregados en 2023', dataUid: 'donations.stats.kits' },
    { value: '24', label: 'Familias con acompañamiento nutricional', dataUid: 'donations.stats.families' },
    { value: '12', label: 'Voluntarios articulados cada mes', dataUid: 'donations.stats.volunteers' }
  ],
  highlights: [
    {
      icon: '📚',
      title: 'Educación accesible',
      description: 'Materiales, tutorías y recursos digitales para niñas y niños afrocolombianos.',
      theme: 'teal',
      dataUid: 'donations.highlights.education'
    },
    {
      icon: '🤝🏾',
      title: 'Crecimiento comunitario',
      description: 'Encuentros familiares, redes solidarias y acompañamiento psicoemocional.',
      theme: 'blue',
      dataUid: 'donations.highlights.community'
    },
    {
      icon: '🌱',
      title: 'Huerta y nutrición',
      description: 'Huertas urbanas, soberanía alimentaria y formación en hábitos saludables.',
      theme: 'sun',
      dataUid: 'donations.highlights.garden'
    },
    {
      icon: '🎶',
      title: 'Arte y espiritualidad',
      description: 'Laboratorios creativos, danza y espacios de fe que fortalecen la identidad.',
      theme: 'rose',
      dataUid: 'donations.highlights.art'
    }
  ],
  stories: [
    {
      title: 'Tutorías Profe en Casa',
      description: 'Voluntariado pedagógico que refuerza lectura, matemáticas y tecnología desde el hogar.',
      impact: 'Con $85.000 COP aseguras kits completos para un estudiante durante un trimestre.',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
      strapiCollection: 'donaciones-historias',
      strapiEntryId: 'tutorias-profe-en-casa'
    },
    {
      title: 'Huerta comunitaria',
      description: 'Familias siembran y aprenden sobre alimentación sostenible con apoyo de la fundación.',
      impact: 'Una donación de $70.000 COP respalda canastas de alimentos para cuatro familias.',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
      strapiCollection: 'donaciones-historias',
      strapiEntryId: 'huerta-comunitaria'
    },
    {
      title: 'Ruta Literaria María',
      description: 'Clubes de lectura, escritura creativa y encuentros culturales que celebran la afrocolombianidad.',
      impact: 'Con $45.000 COP apoyas la compra de libros y actividades para un círculo de lectura.',
      link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
      strapiCollection: 'donaciones-historias',
      strapiEntryId: 'ruta-literaria'
    }
  ],
  supportActions: [
    {
      icon: '🤝',
      title: 'Apadrina un niño',
      description: 'Acompaña el proceso educativo y emocional de una niña o un niño durante todo el año.',
      link: '/apadrina',
      linkLabel: 'Conocer más',
      theme: 'sun',
      dataUid: 'donations.actions.sponsor'
    },
    {
      icon: '⏰',
      title: 'Voluntariado activo',
      description: 'Comparte tu tiempo en tutorías, logística de eventos y mentorías profesionales.',
      link: '/contactanos',
      linkLabel: 'Inscribirme',
      theme: 'teal',
      dataUid: 'donations.actions.volunteer'
    },
    {
      icon: '📢',
      title: 'Comparte nuestra misión',
      description: 'Multiplica el mensaje en redes sociales y vincula nuevos aliados solidarios.',
      link: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
      linkLabel: 'Compartir',
      theme: 'rose',
      dataUid: 'donations.actions.share'
    }
  ],
  paymentGateways: [
    {
      name: 'Pagos PSE (Colombia)',
      description:
        'Conéctate con tu banco a través de la pasarela PSE y realiza transferencias seguras desde cualquier entidad nacional.',
      link: 'https://www.pse.com.co/persona',
      actionLabel: 'Donar con PSE',
      badge: '🇨🇴 PSE',
      theme: 'pse'
    },
    {
      name: 'Nequi',
      description:
        'Realiza tu donación de forma rápida y segura a través de Nequi. Escanea el código QR o envía directamente desde tu app.',
      link: 'https://www.nequi.com.co',
      actionLabel: 'Donar con Nequi',
      badge: '💜 Nequi',
      theme: 'nequi'
    },
    {
      name: 'PayPal',
      description:
        'Haz tu aporte desde el exterior con tarjeta de crédito o cuenta PayPal en una plataforma segura para aliados globales.',
      link: 'https://www.paypal.com/donate',
      actionLabel: 'Donar con PayPal',
      badge: '🌍 PayPal',
      theme: 'international'
    }
  ]
};

const organizationInfoContent = {
  name: 'Fundación Afrocolombiana Profe en Casa',
  mission:
    'La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos.',
  vision:
    'Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP, creando oportunidades para desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales.',
  history:
    '<p>Desde Puerto Tejada, FACOPEC acompaña a comunidades afrocolombianas con programas educativos, culturales, tecnológicos y de cuidado comunitario. Articulamos redes solidarias y voluntariado para transformar territorios a través del aprendizaje, la creatividad y la fe.</p>',
  contactEmail: 'facopec@facopec.org',
  contactPhone: '+57 321 523 0283',
  address: {
    street: 'Puerto Tejada',
    city: 'Puerto Tejada',
    state: 'Cauca',
    country: 'Colombia'
  },
  hours: {
    monday: '8:00 a.m. - 5:00 p.m.',
    tuesday: '8:00 a.m. - 5:00 p.m.',
    wednesday: '8:00 a.m. - 5:00 p.m.',
    thursday: '8:00 a.m. - 5:00 p.m.',
    friday: '8:00 a.m. - 5:00 p.m.',
    saturday: '9:00 a.m. - 1:00 p.m.'
  },
  values: [
    {
      title: 'Derechos humanos y dignidad',
      description: 'Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP.',
      icon: '👐🏾',
      dataUid: 'org.values.rights'
    },
    {
      title: 'Educación transformadora',
      description: 'Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.',
      icon: '💡',
      dataUid: 'org.values.education'
    },
    {
      title: 'Fe, cultura y comunidad',
      description: 'Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.',
      icon: '🤲🏾',
      dataUid: 'org.values.community'
    }
  ],
  socialLinks: [
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
      label: 'Facebook',
      dataUid: 'org.social.facebook'
    },
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/facopec',
      label: 'Instagram',
      dataUid: 'org.social.instagram'
    },
    {
      platform: 'youtube',
      url: 'https://www.youtube.com/@fundacionafrocolombianaprofe',
      label: 'YouTube',
      dataUid: 'org.social.youtube'
    },
    {
      platform: 'blog',
      url: 'https://fundacionafrocolombianaprofeencasa.blogspot.com',
      label: 'Blog',
      dataUid: 'org.social.blog'
    }
  ]
};

const globalNavigationChildren = [
  {
    title: '💻 Innovación y Tecnología Educativa',
    dataUid: 'navigation.programs.innovation',
    items: [
      {
        label: 'Robótica y Programación',
        url: 'https://roboticaprogramacion.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.innovation.robotica'
      },
      {
        label: 'Laboratorio Digital STEAM',
        url: 'https://laboratoriosteam.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.innovation.steam'
      },
      {
        label: 'Competencias Digitales',
        url: 'https://competenciasdigitales.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.innovation.competencias'
      }
    ]
  },
  {
    title: '📚 Refuerzo Académico y Nivelación',
    dataUid: 'navigation.programs.refuerzo',
    items: [
      {
        label: 'Talleres de nivelación',
        url: 'https://talleresdenivelacion.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.talleres'
      },
      {
        label: 'Matemáticas básicas',
        url: 'https://matematicasbasicas.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.matematicas'
      },
      {
        label: 'Lectura crítica',
        url: 'https://lecturacritica.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.lectura'
      },
      {
        label: 'Ciencias naturales',
        url: 'https://cienciasnaturales.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.naturales'
      },
      {
        label: 'Ciencias sociales',
        url: 'https://cienciassociales.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.sociales'
      },
      {
        label: 'Inglés básico',
        url: 'https://inglesbasico.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.ingles'
      },
      {
        label: 'Refuerzo escolar',
        url: 'https://refuerzoescolar.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.escolar'
      },
      {
        label: 'Pre-ICFES',
        url: 'https://preicfes.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.preicfes'
      },
      {
        label: 'Tutorías personalizadas',
        url: 'https://tutoriaspersonalizadas.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.refuerzo.tutorias'
      }
    ]
  },
  {
    title: '👨‍👩‍👧‍👦 Desarrollo Comunitario y Familiar',
    dataUid: 'navigation.programs.comunidad',
    items: [
      {
        label: 'Alfabetización',
        url: 'https://alfabetizacion.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.comunidad.alfabetizacion'
      },
      {
        label: 'Capacitación laboral',
        url: 'https://capacitacionlaboral.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.comunidad.capacitacion'
      },
      {
        label: 'Emprendimiento',
        url: 'https://emprendimiento.blogspot.com/',
        target: '_blank',
        dataUid: 'navigation.programs.comunidad.emprendimiento'
      }
    ]
  }
];

const globalSettingsContent = {
  siteName: 'Fundación Afrocolombiana | Profe en Casa',
  appUrl: 'https://www.facopec.org',
  navigation: [
    {
      label: 'Inicio',
      url: '/inicio',
      exact: true,
      order: 1,
      dataUid: 'navigation.home'
    },
    {
      label: 'Programas',
      url: '/inicio',
      fragment: 'programas',
      order: 2,
      dataUid: 'navigation.programs',
      children: globalNavigationChildren
    },
    {
      label: 'Proyectos',
      url: '/proyectos',
      order: 3,
      dataUid: 'navigation.projects'
    },
    {
      label: 'Apóyanos',
      url: '/donaciones',
      order: 4,
      dataUid: 'navigation.donate'
    },
    {
      label: 'Contáctanos',
      url: '/contactanos',
      order: 5,
      dataUid: 'navigation.contact'
    },
    {
      label: 'Nosotros',
      url: '/nosotros',
      order: 6,
      dataUid: 'navigation.about'
    }
  ],
  socialLinks: [
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
      label: 'Facebook',
      dataUid: 'navigation.social.facebook'
    },
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/facopec',
      label: 'Instagram',
      dataUid: 'navigation.social.instagram'
    },
    {
      platform: 'youtube',
      url: 'https://www.youtube.com/@fundacionafrocolombianaprofe',
      label: 'YouTube',
      dataUid: 'navigation.social.youtube'
    },
    {
      platform: 'blog',
      url: 'https://fundacionafrocolombianaprofeencasa.blogspot.com',
      label: 'Blog',
      dataUid: 'navigation.social.blog'
    }
  ]
};

const projectsContent = [
  {
    title: 'Apoyo escolar Profe en Casa',
    slug: 'apoyo-escolar-profe-en-casa',
    description: 'Refuerzos escolares, lectura guiada y clubes creativos para niñas, niños y adolescentes.',
    tag: 'Educación',
    link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
    order: 1
  },
  {
    title: 'Ruta literaria “María”',
    slug: 'ruta-literaria-maria',
    description: 'Lectura en familia, creación de relatos y visitas pedagógicas por el territorio afro.',
    tag: 'Cultura',
    link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
    order: 2
  },
  {
    title: 'Club Familias que acompañan',
    slug: 'club-familias-que-acompanan',
    description: 'Escuela para familias, bienestar emocional y redes comunitarias que se cuidan entre sí.',
    tag: 'Bienestar',
    link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
    order: 3
  },
  {
    title: 'Huerta y alimentación saludable',
    slug: 'huerta-y-alimentacion-saludable',
    description: 'Agricultura urbana, cocina nutritiva y emprendimientos solidarios para el territorio.',
    tag: 'Territorio',
    link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
    order: 4
  }
];

module.exports = {
  globalSettingsContent,
  organizationInfoContent,
  homePageContent,
  donationsPageContent,
  projectsContent
};
