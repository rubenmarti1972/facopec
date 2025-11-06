import { createStrapi } from '@strapi/strapi';
import type { Strapi } from '@strapi/strapi';

type EntityData = Record<string, unknown>;

async function upsertSingleType(app: Strapi, uid: string, data: EntityData) {
  const existing = await app.entityService.findMany(uid, {});

  if (!existing) {
    await app.entityService.create(uid, { data });
    return;
  }

  if (Array.isArray(existing)) {
    if (existing.length === 0) {
      await app.entityService.create(uid, { data });
    } else {
      await app.entityService.update(uid, existing[0].id, { data });
    }
  } else if (typeof existing === 'object' && 'id' in existing && existing.id) {
    await app.entityService.update(uid, (existing as { id: number }).id, { data });
  } else {
    await app.entityService.create(uid, { data });
  }
}

async function seed() {
  const app = await createStrapi();
  await app.start();

  console.log('Seeding Strapi CMS with default FACOPEC content...');

  const adminEmail = 'facopec@facopec.org';
  const adminPassword = 'F4c0pec@2025';

  const superAdminRole = await app.db.query('admin::role').findOne({ where: { code: 'strapi-super-admin' } });
  if (!superAdminRole) {
    throw new Error('No se encontró el rol de super administrador');
  }

  const existingAdmin = await app.db.query('admin::user').findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await app.admin.services.user.create({
      data: {
        username: 'facopec',
        email: adminEmail,
        password: adminPassword,
        firstname: 'FACOPEC',
        lastname: 'Administrador',
        isActive: true,
        roles: [superAdminRole.id],
      }
    });

    console.log('Superusuario facopec creado con contraseña F4c0pec@2025');
  } else {
    console.log('Superusuario facopec ya existe.');
  }

  await upsertSingleType(app, 'api::global.global', {
    siteName: 'Fundación Afrocolombiana Profe en Casa',
    appUrl: 'https://facopec.web.app',
    navigation: [
      { label: 'Inicio', description: 'Página principal', url: '/inicio', order: 1 },
      { label: 'Proyectos', description: 'Nuestros proyectos', url: '/proyectos', order: 2 },
      { label: 'Donaciones', description: 'Apoya nuestra misión', url: '/donaciones', order: 3 },
      { label: 'Apadrina', description: 'Programa de apadrinamiento', url: '/apadrina', order: 4 },
      { label: 'Ruta Literaria', description: 'Ruta literaria María', url: '/ruta-literaria-maria', order: 5 },
      { label: 'Nosotros', description: 'Conoce la fundación', url: '/nosotros', order: 6 }
    ],
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa' },
      { platform: 'instagram', url: 'https://www.instagram.com/fundacion_profeencasa' },
      { platform: 'youtube', url: 'https://www.youtube.com/@fundacionprofeencasa' },
      { platform: 'whatsapp', url: 'https://wa.me/573215230283' }
    ]
  });

  await upsertSingleType(app, 'api::organization-info.organization-info', {
    name: 'Fundación Afrocolombiana Profe en Casa',
    mission:
      'Capta y canaliza recursos para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las comunidades negras, afrocolombianas, raizales y palenqueras.',
    vision:
      'Ser una fundación líder en el desarrollo integral de comunidades afrocolombianas, potenciando sus capacidades desde la educación, la cultura y la fe.',
    history:
      '<p>Desde Puerto Tejada, en el Valle del Cauca, acompañamos a niñas, niños, adolescentes y sus familias con programas educativos, culturales y espirituales que transforman vidas.</p>',
    values: [
      'Derechos humanos y dignidad',
      'Educación transformadora',
      'Fe, cultura y comunidad'
    ],
    contactEmail: 'contacto@facopec.org',
    contactPhone: '+57 321 523 0283',
    address: {
      street: 'Calle 5 #4-32',
      city: 'Puerto Tejada',
      state: 'Cauca',
      country: 'Colombia'
    },
    hours: {
      monday: '8:00 - 17:00',
      tuesday: '8:00 - 17:00',
      wednesday: '8:00 - 17:00',
      thursday: '8:00 - 17:00',
      friday: '8:00 - 17:00'
    },
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa' },
      { platform: 'instagram', url: 'https://www.instagram.com/fundacion_profeencasa' }
    ]
  });

  await upsertSingleType(app, 'api::home-page.home-page', {
    hero: {
      eyebrow: 'Misión con sentido social',
      titleLines: [
        { line: 'Transformamos vidas' },
        { line: 'a través de la educación y el cuidado' }
      ],
      lead:
        'Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.',
      stats: [
        { value: '+180', label: 'Estudiantes acompañados con tutorías y mentorías' },
        { value: '35', label: 'Voluntarios activos en programas comunitarios' },
        { value: '12', label: 'Barrios impactados con actividades presenciales y virtuales' }
      ],
      actions: [
        { label: 'Donar ahora', url: '/donaciones', variant: 'primary', isInternal: true, dataUid: 'hero.actions.donate' },
        { label: 'Ver programas', url: '/home#programas', variant: 'secondary', isInternal: true, dataUid: 'hero.actions.programs' }
      ],
      verse: {
        reference: 'Proverbios 3:13',
        text: '“Feliz quien halla sabiduría”',
        description:
          'Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.'
      }
    },
    impactHighlights: [
      { icon: '📚', title: 'Educación integral', label: 'Tutorías, clubes de lectura y acompañamiento pedagógico', dataUid: 'impact.education' },
      { icon: '🤝🏾', title: 'Tejido comunitario', label: 'Trabajo con familias, líderes y aliados del territorio', dataUid: 'impact.community' },
      { icon: '🌱', title: 'Valores y fe', label: 'Formación espiritual, bienestar emocional y liderazgo', dataUid: 'impact.faith' }
    ],
    identity: {
      eyebrow: 'Nuestra identidad',
      title: 'Formamos y acompañamos comunidades en el Valle del Cauca',
      subtitle:
        'Presentamos la esencia de FACOPEC con una estructura clara para gestionar la información desde Strapi y comunicar nuestro propósito de forma cercana.',
      description:
        'Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en comunidades negras, afrocolombianas, raizales y palenqueras.',
      dataUid: 'about.description',
      values: [
        {
          title: 'Derechos humanos y dignidad',
          description: 'Promovemos la defensa y reivindicación de los derechos de las comunidades negras, afrocolombianas, raizales y palenqueras.',
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
        'La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las comunidades negras, afrocolombianas, raizales y palenqueras.',
      missionUid: 'about.mission',
      vision:
        'Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las comunidades afrocolombianas, raizales y palenqueras.',
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
        description: 'Talleres STEAM, alfabetización digital y mentorías vocacionales para jóvenes.',
        highlights: ['Tecnología', 'Innovación', 'Mentorías'],
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
        strapiCollection: 'programas',
        strapiEntryId: 'semillero-digital'
      },
      {
        title: 'Club Familias que Acompañan',
        description: 'Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.',
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
        link: 'https://www.icbf.gov.co',
        dataUid: 'supporters.icbf'
      },
      {
        name: 'Programa de las Naciones Unidas para el Desarrollo',
        caption: 'Programa de las Naciones Unidas para el Desarrollo',
        link: 'https://www.undp.org',
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
    ]
  });

  await upsertSingleType(app, 'api::donations-page.donations-page', {
    heroTitle: 'Tu donación transforma vidas en el Valle del Cauca',
    heroSubtitle: 'Cada aporte fortalece nuestros programas educativos, culturales y espirituales.',
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
        link: '/contacto',
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
        description: 'Conéctate con tu banco a través de la pasarela PSE y realiza transferencias seguras desde cualquier entidad nacional.',
        link: 'https://www.pse.com.co/persona',
        actionLabel: 'Donar con PSE',
        badge: '🇨🇴 PSE',
        theme: 'pse'
      },
      {
        name: 'Pasarela internacional',
        description: 'Haz tu aporte desde el exterior con tarjeta de crédito o cuenta PayPal en una plataforma segura para aliados globales.',
        link: 'https://www.paypal.com/donate',
        actionLabel: 'Donar desde el exterior',
        badge: '🌍 Global',
        theme: 'international'
      }
    ]
  });

  const existingProjects = await app.entityService.findMany('api::project.project', {});
  if (!Array.isArray(existingProjects) || existingProjects.length === 0) {
    const projects = [
      {
        title: 'Apoyo escolar Profe en Casa',
        description: 'Refuerzos escolares, lectura guiada y clubes creativos para niñas, niños y adolescentes.',
        tag: 'Educación',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
        order: 1
      },
      {
        title: 'Ruta literaria “María”',
        description: 'Lectura en familia, creación de relatos y visitas pedagógicas por el territorio afro.',
        tag: 'Cultura',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
        order: 2
      },
      {
        title: 'Club Familias que acompañan',
        description: 'Escuela para familias, bienestar emocional y redes comunitarias que se cuidan entre sí.',
        tag: 'Bienestar',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
        order: 3
      },
      {
        title: 'Huerta y alimentación saludable',
        description: 'Agricultura urbana, cocina nutritiva y emprendimientos solidarios para el territorio.',
        tag: 'Territorio',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
        order: 4
      }
    ];

    for (const project of projects) {
      await app.entityService.create('api::project.project', { data: project });
    }
  }

  await app.destroy();
  console.log('Seed completed successfully.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
