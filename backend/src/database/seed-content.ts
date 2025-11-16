import type { UID } from '@strapi/types';
import type { Strapi } from '@strapi/types/dist/core';
import grantSuperAdminAll from '../../config/utils/grant-super-admin-all';
import syncPublicPermissions from '../../config/utils/sync-public-permissions';
import path from 'path';
import fs from 'fs/promises';

type EntityData = Record<string, unknown>;

type UploadedFile = {
  id: number;
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
};

type UploadMetadata = {
  alternativeText?: string;
  caption?: string;
};

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const ensureMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
};

async function uploadFileFromAssets(
  strapi: Strapi,
  assetsRoot: string,
  relativePath: string,
  metadata: UploadMetadata
): Promise<UploadedFile | null> {
  const absolutePath = path.join(assetsRoot, relativePath);

  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isFile()) {
      strapi.log.warn(`Asset ${relativePath} is not a file, skipping upload.`);
      return null;
    }

    const fileName = path.basename(absolutePath);
    const existing = await strapi.db
      .query('plugin::upload.file')
      .findOne({ where: { name: fileName } });

    if (existing) {
      return existing as UploadedFile;
    }

    const uploadService = strapi.plugin('upload').service('upload');
    const uploaded = await uploadService.upload({
      data: metadata,
      files: {
        filepath: absolutePath,
        originalFilename: fileName,
        mimetype: ensureMimeType(absolutePath),
        size: stats.size,
      },
    });

    if (Array.isArray(uploaded) && uploaded.length > 0) {
      return uploaded[0] as UploadedFile;
    }

    return null;
  } catch (error) {
    strapi.log.error(`Failed to upload asset ${relativePath}:`, error);
    return null;
  }
}

const ensurePublished = (strapi: Strapi, uid: UID.ContentType, data: EntityData): EntityData => {
  const contentType = strapi.contentTypes?.[uid];
  if (contentType?.options?.draftAndPublish === false) {
    return data;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'publishedAt')) {
    return data;
  }

  return { ...data, publishedAt: new Date().toISOString() };
};

async function upsertSingleType(strapi: Strapi, uid: UID.ContentType, data: EntityData) {
  const query = strapi.db.query(uid);
  const existingEntries = await query.findMany({ select: ['id', 'publishedAt'] });
  const [primaryEntry, ...duplicateEntries] = existingEntries;

  for (const duplicate of duplicateEntries) {
    const duplicateId = duplicate.id as number | string | undefined;
    if (!duplicateId) {
      continue;
    }

    try {
      await query.delete({ where: { id: duplicateId } });
      strapi.log.warn(`Removed duplicate entry ${duplicateId} from single type ${uid}.`);
    } catch (error) {
      strapi.log.error(`Failed to remove duplicate entry ${duplicateId} from ${uid}:`, error);
    }
  }

  const entryId = primaryEntry?.id as number | string | undefined;
  const contentType = strapi.contentTypes?.[uid];
  const hasDraftAndPublish = contentType?.options?.draftAndPublish !== false;

  if (!entryId) {
    // Create new entry
    const created = await strapi.entityService.create(uid, { data });

    // Publish if draft & publish is enabled
    if (hasDraftAndPublish && created && typeof created === 'object' && 'id' in created) {
      try {
        await strapi.db.query(uid).update({
          where: { id: created.id },
          data: { publishedAt: new Date() },
        });
        strapi.log.info(`Created and published single type entry for ${uid}.`);
      } catch (error) {
        strapi.log.warn(`Created but failed to publish ${uid}:`, error);
      }
    } else {
      strapi.log.info(`Created single type entry for ${uid}.`);
    }
    return;
  }

  // Update existing entry
  await strapi.entityService.update(uid, entryId, { data });

  // Ensure it's published if draft & publish is enabled
  if (hasDraftAndPublish && !primaryEntry?.publishedAt) {
    try {
      await strapi.db.query(uid).update({
        where: { id: entryId },
        data: { publishedAt: new Date() },
      });
      strapi.log.info(`Updated and published single type entry ${entryId} for ${uid}.`);
    } catch (error) {
      strapi.log.warn(`Updated but failed to publish ${uid}:`, error);
    }
  } else {
    strapi.log.info(`Updated single type entry ${entryId} for ${uid}.`);
  }
}

export async function seedDefaultContent(strapi: Strapi) {
  const frontendAssetsDir = path.resolve(strapi.dirs.app.root, '..', 'src', 'assets');

  strapi.log.info('Seeding Strapi CMS with default FACOPEC content...');

  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'facopec';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'facopec@facopec.org';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'F4c0pec@2025';

  const superAdminRole = await strapi.db
    .query('admin::role')
    .findOne({ where: { code: 'strapi-super-admin' } });

  await grantSuperAdminAll(strapi);
  await syncPublicPermissions(strapi);
  if (!superAdminRole) {
    strapi.log.warn(
      'No se encontró el rol de super administrador; omitiendo la creación automática del usuario facopec.'
    );
  }

  const existingAdmin = await strapi.db
    .query('admin::user')
    .findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    if (superAdminRole) {
      await strapi.admin.services.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          password: adminPassword,
          firstname: 'FACOPEC',
          lastname: 'Administrador',
          isActive: true,
          roles: [superAdminRole.id],
        },
      });

      strapi.log.info(
        `Superusuario ${adminUsername} creado con correo ${adminEmail}. Usa las variables de entorno SEED_ADMIN_* para personalizarlo.`
      );
    } else {
      strapi.log.warn(
        'Superusuario facopec no creado automáticamente porque no existe el rol strapi-super-admin aún.'
      );
    }
  } else {
    strapi.log.info(`Superusuario ${adminUsername} ya existe.`);
  }

  const heroImage = await uploadFileFromAssets(strapi, frontendAssetsDir, 'ninos.jpg', {
    alternativeText: 'Niñas y niños participan en actividades educativas de FACOPEC',
    caption: 'Actividades educativas de FACOPEC',
  });

  const foundationLogo = await uploadFileFromAssets(strapi, frontendAssetsDir, 'logo.png', {
    alternativeText: 'Logo de la Fundación Afrocolombiana Profe en Casa',
    caption: 'Logo FACOPEC',
  });

  const supportersAssets: Array<{ key: string; path: string; alt: string; caption: string }> = [
    {
      key: 'icbf',
      path: path.join('supporters', 'icbf-logo.svg'),
      alt: 'Logo del Instituto Colombiano de Bienestar Familiar',
      caption: 'Aliado: Instituto Colombiano de Bienestar Familiar',
    },
    {
      key: 'pnud',
      path: path.join('supporters', 'pnud-logo.svg'),
      alt: 'Logo del Programa de las Naciones Unidas para el Desarrollo',
      caption: 'Aliado: Programa de las Naciones Unidas para el Desarrollo',
    },
  ];

  const supporterLogos = new Map<string, UploadedFile>();

  for (const supporter of supportersAssets) {
    const uploaded = await uploadFileFromAssets(strapi, frontendAssetsDir, supporter.path, {
      alternativeText: supporter.alt,
      caption: supporter.caption,
    });

    if (uploaded) {
      supporterLogos.set(supporter.key, uploaded);
    }
  }

  await upsertSingleType(strapi, 'api::global.global', {
    siteName: 'Fundación Afrocolombiana | Profe en Casa',
    appUrl: 'https://www.fundacionafro.org',
    logo: foundationLogo?.id,
    navigation: [
      {
        label: 'Inicio',
        description: 'Página principal',
        url: '/inicio',
        order: 1,
        exact: true,
        dataUid: 'navigation.home',
      },
      {
        label: 'Programas',
        description: 'Programas y actividades destacadas',
        url: '/inicio',
        fragment: 'programas',
        order: 2,
        dataUid: 'navigation.programs',
        children: [
          {
            title: 'Para estudiantes',
            dataUid: 'navigation.programs.students',
            items: [
              {
                label: 'Talleres de Nivelación',
                url: 'https://talleresdenivelacion.blogspot.com/',
                target: '_blank',
                dataUid: 'navigation.programs.students.talleres',
              },
              {
                label: 'Salidas Pedagógicas',
                url: 'https://salidaspedagogicas-facopec.blogspot.com/',
                target: '_blank',
                dataUid: 'navigation.programs.students.salidas',
              },
              {
                label: 'Personeros y Líderes',
                url: 'https://personerosestudiantilesylideres.blogspot.com/',
                target: '_blank',
                dataUid: 'navigation.programs.students.personeros',
              },
              {
                label: 'Obra María | Jorge Isaacs',
                url: 'https://rutaliterariamaria.blogspot.com/',
                target: '_blank',
                dataUid: 'navigation.programs.students.obraMaria',
              },
            ],
          },
          {
            title: 'Para fin de año 2025',
            dataUid: 'navigation.programs.yearEnd',
            items: [
              {
                label: 'Regalos de corazón',
                url: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2025/08/regalos-de-corazon-fundacion.html',
                target: '_blank',
                dataUid: 'navigation.programs.yearEnd.regalos',
              },
            ],
          },
          {
            title: 'Para adultos',
            dataUid: 'navigation.programs.adults',
            items: [
              {
                label: 'Escuela de Padres | Virtual',
                url: 'https://consejosparapadresymadres.blogspot.com/',
                target: '_blank',
                dataUid: 'navigation.programs.adults.parents',
              },
              {
                label: 'Empleabilidad',
                url: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Empleabilidad',
                target: '_blank',
                dataUid: 'navigation.programs.adults.jobs',
              },
            ],
          },
        ],
      },
      {
        label: 'Proyectos',
        description: 'Nuestros proyectos activos',
        url: '/proyectos',
        order: 3,
        dataUid: 'navigation.projects',
      },
      {
        label: 'Donaciones',
        description: 'Apoya nuestra misión',
        url: '/donaciones',
        order: 4,
        dataUid: 'navigation.donations',
      },
      {
        label: 'Apadrina',
        description: 'Programa de apadrinamiento',
        url: '/apadrina',
        order: 5,
        dataUid: 'navigation.sponsor',
      },
      {
        label: 'Ruta literaria',
        description: 'Ruta Literaria María',
        url: '/ruta-literaria-maria',
        order: 6,
        dataUid: 'navigation.literaryRoute',
      },
      {
        label: 'Nosotros',
        description: 'Conoce la fundación',
        url: '/nosotros',
        order: 7,
        dataUid: 'navigation.about',
      },
    ],
    socialLinks: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
        dataUid: 'social.facebook',
      },
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/fundacion_profeencasa',
        dataUid: 'social.instagram',
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/@fundacionprofeencasa',
        dataUid: 'social.youtube',
      },
      {
        platform: 'whatsapp',
        url: 'https://wa.me/573215230283',
        dataUid: 'social.whatsapp',
      },
    ],
  });

  await upsertSingleType(strapi, 'api::organization-info.organization-info', {
    name: 'Fundación Afrocolombiana Profe en Casa',
    mission:
      'Capta y canaliza recursos para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
    vision:
      'Ser una fundación líder en el desarrollo integral de comunidades afrocolombianas, potenciando sus capacidades desde la educación, la cultura y la fe.',
    history:
      '<p>Desde Puerto Tejada, en el Cauca, acompañamos a niñas, niños, adolescentes y sus familias con programas educativos, culturales y espirituales que transforman vidas.</p>',
    values: [
      {
        title: 'Derechos humanos y dignidad',
        description: 'Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
        icon: '👐🏾',
        dataUid: 'about.values.rights',
      },
      {
        title: 'Educación transformadora',
        description: 'Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.',
        icon: '💡',
        dataUid: 'about.values.education',
      },
      {
        title: 'Fe, cultura y comunidad',
        description: 'Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.',
        icon: '🤲🏾',
        dataUid: 'about.values.community',
      },
    ],
    logo: foundationLogo?.id,
    banner: heroImage?.id,
    contactEmail: 'contacto@facopec.org',
    contactPhone: '+57 321 523 0283',
    address: {
      street: 'Calle 5 #4-32',
      city: 'Puerto Tejada',
      state: 'Cauca',
      country: 'Colombia',
    },
    hours: {
      monday: '8:00 - 17:00',
      tuesday: '8:00 - 17:00',
      wednesday: '8:00 - 17:00',
      thursday: '8:00 - 17:00',
      friday: '8:00 - 17:00',
    },
    socialLinks: [
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
        dataUid: 'organization.social.facebook',
      },
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/fundacion_profeencasa',
        dataUid: 'organization.social.instagram',
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/@fundacionprofeencasa',
        dataUid: 'organization.social.youtube',
      },
      {
        platform: 'whatsapp',
        url: 'https://wa.me/573215230283',
        dataUid: 'organization.social.whatsapp',
      },
    ],
  });

  await upsertSingleType(strapi, 'api::home-page.home-page', {
    hero: {
      eyebrow: 'Misión con sentido social',
      titleLines: [
        { line: 'Transformamos vidas' },
        { line: 'a través de la educación y el cuidado' },
      ],
      lead:
        'Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Cauca.',
      image: heroImage?.id,
      stats: [
        { value: '+180', label: 'Estudiantes acompañados con tutorías y mentorías' },
        { value: '35', label: 'Voluntarios activos en programas comunitarios' },
        { value: '12', label: 'Barrios impactados con actividades presenciales y virtuales' },
      ],
      actions: [
        { label: 'Donar ahora', url: '/donaciones', variant: 'primary', isInternal: true, dataUid: 'hero.actions.donate' },
        { label: 'Ver programas', url: '/home#programas', variant: 'secondary', isInternal: true, dataUid: 'hero.actions.programs' },
      ],
      verse: {
        reference: 'Proverbios 3:13',
        text: '“Feliz quien halla sabiduría”',
        description:
          'Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.',
      },
    },
    impactHighlights: [
      { icon: '📚', title: 'Educación integral', label: 'Tutorías, clubes de lectura y acompañamiento pedagógico', dataUid: 'impact.education' },
      { icon: '🤝🏾', title: 'Tejido comunitario', label: 'Trabajo con familias, líderes y aliados del territorio', dataUid: 'impact.community' },
      { icon: '🌱', title: 'Valores y fe', label: 'Formación espiritual, bienestar emocional y liderazgo', dataUid: 'impact.faith' },
    ],
    identity: {
      eyebrow: 'Nuestra identidad',
      title: 'Formamos y acompañamos comunidades en el Cauca',
      subtitle:
        'Presentamos la esencia de FACOPEC con una estructura clara para gestionar la información desde Strapi y comunicar nuestro propósito de forma cercana.',
      description:
        'Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
      dataUid: 'about.description',
      values: [
        {
          title: 'Derechos humanos y dignidad',
          description: 'Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
          icon: '👐🏾',
          dataUid: 'about.values.rights',
        },
        {
          title: 'Educación transformadora',
          description: 'Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.',
          icon: '💡',
          dataUid: 'about.values.education',
        },
        {
          title: 'Fe, cultura y comunidad',
          description: 'Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.',
          icon: '🤲🏾',
          dataUid: 'about.values.community',
        },
      ],
    },
    missionVision: {
      mission:
        'La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
      missionUid: 'about.mission',
      vision:
        'Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP.',
      visionUid: 'about.vision',
    },
    activities: [
      {
        title: 'Tutorías Profe en Casa',
        description: 'Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.',
        icon: '🧠',
        theme: 'teal',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
        dataUid: 'activities.tutorias',
      },
      {
        title: 'Ruta Literaria María',
        description: 'Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.',
        icon: '📖',
        theme: 'blue',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
        dataUid: 'activities.rutaLiteraria',
      },
      {
        title: 'Huerta y alimentación',
        description: 'Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.',
        icon: '🥬',
        theme: 'gold',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
        dataUid: 'activities.huerta',
      },
      {
        title: 'Arte, danza y fe',
        description: 'Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.',
        icon: '🎨',
        theme: 'rose',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura',
        dataUid: 'activities.arte',
      },
    ],
    programs: [
      {
        title: 'Semillero Digital',
        description: 'Talleres STEAM, alfabetización digital y mentorías vocacionales para jóvenes.',
        highlights: ['Tecnología', 'Innovación', 'Mentorías'],
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
        strapiCollection: 'programas',
        strapiEntryId: 'semillero-digital',
      },
      {
        title: 'Club Familias que Acompañan',
        description: 'Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.',
        highlights: ['Familias', 'Bienestar', 'Prevención'],
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
        strapiCollection: 'programas',
        strapiEntryId: 'club-familias',
      },
    ],
    supporters: [
      {
        name: 'Instituto Colombiano de Bienestar Familiar',
        caption: 'Instituto Colombiano de Bienestar Familiar',
        link: 'https://www.icbf.gov.co',
        dataUid: 'supporters.icbf',
        logo: supporterLogos.get('icbf')?.id,
      },
      {
        name: 'Programa de las Naciones Unidas para el Desarrollo',
        caption: 'Programa de las Naciones Unidas para el Desarrollo',
        link: 'https://www.undp.org',
        dataUid: 'supporters.pnud',
        logo: supporterLogos.get('pnud')?.id,
      },
    ],
    catalog: [
      {
        title: 'Kit escolar completo',
        description: 'Útiles, lecturas y materiales artísticos para un estudiante durante un trimestre.',
        price: '$85.000 COP',
        link: 'https://wa.me/p/5881121183974635/573215230283',
        strapiCollection: 'catalogo-whatsapp',
        strapiEntryId: 'kit-escolar',
      },
      {
        title: 'Canasta solidaria',
        description: 'Apoyo nutricional para familias con niñas y niños en refuerzo escolar durante un mes.',
        price: '$70.000 COP',
        link: 'https://wa.me/p/5979113203538798/573215230283',
        strapiCollection: 'catalogo-whatsapp',
        strapiEntryId: 'canasta-solidaria',
      },
      {
        title: 'Apadrina una tutoría',
        description: 'Financia sesiones personalizadas y acompañamiento pedagógico para un estudiante.',
        price: '$45.000 COP',
        link: 'https://wa.me/p/5332119887812567/573215230283',
        strapiCollection: 'catalogo-whatsapp',
        strapiEntryId: 'apadrina-tutoria',
      },
    ],
    gallery: [
      {
        title: 'Tutorías Profe en Casa',
        description: 'Acompañamiento pedagógico personalizado para niños, niñas y adolescentes en refuerzo escolar.',
        type: 'image',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
        strapiCollection: 'galeria',
        strapiEntryId: 'tutorias-profe-en-casa',
      },
      {
        title: 'Semillero Digital STEAM',
        description: 'Talleres de tecnología, robótica y programación para jóvenes del Cauca.',
        type: 'image',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
        strapiCollection: 'galeria',
        strapiEntryId: 'semillero-digital',
      },
      {
        title: 'Club Familias que Acompañan',
        description: 'Escuela de padres y orientación psicoemocional para fortalecer el cuidado familiar.',
        type: 'image',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
        strapiCollection: 'galeria',
        strapiEntryId: 'club-familias',
      },
      {
        title: 'Trabajo Comunitario',
        description: 'Fortalecimiento del tejido social con familias, líderes y aliados del territorio.',
        type: 'image',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Comunidad',
        strapiCollection: 'galeria',
        strapiEntryId: 'trabajo-comunitario',
      },
      {
        title: 'Formación Espiritual',
        description: 'Espacios de oración, valores y bienestar emocional para toda la comunidad.',
        type: 'image',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Fe',
        strapiCollection: 'galeria',
        strapiEntryId: 'formacion-espiritual',
      },
      {
        title: 'Ruta Literaria María',
        description: 'Círculos de lectura, creación literaria y promoción de la cultura afrocolombiana.',
        type: 'image',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
        strapiCollection: 'galeria',
        strapiEntryId: 'ruta-literaria-maria',
      },
    ],
  });

  await upsertSingleType(strapi, 'api::donations-page.donations-page', {
    heroTitle: 'Tu donación transforma vidas en el Cauca',
    heroSubtitle: 'Cada aporte fortalece nuestros programas educativos, culturales y espirituales.',
    donationAmounts: [
      { value: 20000, label: '$20.000', icon: '🎒', impact: 'Útiles para un niño' },
      { value: 50000, label: '$50.000', icon: '📚', impact: 'Libros y lectura guiada' },
      { value: 100000, label: '$100.000', icon: '🍎', impact: 'Refrigerios de un taller' },
      { value: 200000, label: '$200.000', icon: '🚌', impact: 'Transporte a actividades' },
    ],
    metrics: [
      { value: '+180', label: 'Kits escolares entregados en 2023', dataUid: 'donations.stats.kits' },
      { value: '24', label: 'Familias con acompañamiento nutricional', dataUid: 'donations.stats.families' },
      { value: '12', label: 'Voluntarios articulados cada mes', dataUid: 'donations.stats.volunteers' },
    ],
    highlights: [
      {
        icon: '📚',
        title: 'Educación accesible',
        description: 'Materiales, tutorías y recursos digitales para niñas y niños afrocolombianos.',
        theme: 'teal',
        dataUid: 'donations.highlights.education',
      },
      {
        icon: '🤝🏾',
        title: 'Crecimiento comunitario',
        description: 'Encuentros familiares, redes solidarias y acompañamiento psicoemocional.',
        theme: 'blue',
        dataUid: 'donations.highlights.community',
      },
      {
        icon: '🌱',
        title: 'Huerta y nutrición',
        description: 'Huertas urbanas, soberanía alimentaria y formación en hábitos saludables.',
        theme: 'sun',
        dataUid: 'donations.highlights.garden',
      },
      {
        icon: '🎶',
        title: 'Arte y espiritualidad',
        description: 'Laboratorios creativos, danza y espacios de fe que fortalecen la identidad.',
        theme: 'rose',
        dataUid: 'donations.highlights.art',
      },
    ],
    stories: [
      {
        title: 'Tutorías Profe en Casa',
        description: 'Voluntariado pedagógico que refuerza lectura, matemáticas y tecnología desde el hogar.',
        impact: 'Con $85.000 COP aseguras kits completos para un estudiante durante un trimestre.',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
        strapiCollection: 'donaciones-historias',
        strapiEntryId: 'tutorias-profe-en-casa',
      },
      {
        title: 'Huerta comunitaria',
        description: 'Familias siembran y aprenden sobre alimentación sostenible con apoyo de la fundación.',
        impact: 'Una donación de $70.000 COP respalda canastas de alimentos para cuatro familias.',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
        strapiCollection: 'donaciones-historias',
        strapiEntryId: 'huerta-comunitaria',
      },
      {
        title: 'Ruta Literaria María',
        description: 'Clubes de lectura, escritura creativa y encuentros culturales que celebran la afrocolombianidad.',
        impact: 'Con $45.000 COP apoyas la compra de libros y actividades para un círculo de lectura.',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
        strapiCollection: 'donaciones-historias',
        strapiEntryId: 'ruta-literaria',
      },
    ],
    supportActions: [
      {
        icon: '🤝',
        title: 'Apadrina un niño',
        description: 'Acompaña el proceso educativo y emocional de una niña o un niño durante todo el año.',
        link: '/apadrina',
        linkLabel: 'Conocer más',
        theme: 'sun',
        dataUid: 'donations.actions.sponsor',
      },
      {
        icon: '⏰',
        title: 'Voluntariado activo',
        description: 'Comparte tu tiempo en tutorías, logística de eventos y mentorías profesionales.',
        link: '/contacto',
        linkLabel: 'Inscribirme',
        theme: 'teal',
        dataUid: 'donations.actions.volunteer',
      },
      {
        icon: '📢',
        title: 'Comparte nuestra misión',
        description: 'Multiplica el mensaje en redes sociales y vincula nuevos aliados solidarios.',
        link: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
        linkLabel: 'Compartir',
        theme: 'rose',
        dataUid: 'donations.actions.share',
      },
    ],
    paymentGateways: [
      {
        name: 'Pagos PSE (Colombia)',
        description: 'Conéctate con tu banco a través de la pasarela PSE y realiza transferencias seguras desde cualquier entidad nacional.',
        link: 'https://www.pse.com.co/persona',
        actionLabel: 'Donar con PSE',
        badge: '🇨🇴 PSE',
        theme: 'pse',
      },
      {
        name: 'Pasarela internacional',
        description: 'Haz tu aporte desde el exterior con tarjeta de crédito o cuenta PayPal en una plataforma segura para aliados globales.',
        link: 'https://www.paypal.com/donate',
        actionLabel: 'Donar desde el exterior',
        badge: '🌍 Global',
        theme: 'international',
      },
    ],
  });

  const existingProjects = await strapi.entityService.findMany('api::project.project', {});
  if (!Array.isArray(existingProjects) || existingProjects.length === 0) {
    const projects = [
      {
        title: 'Apoyo escolar Profe en Casa',
        description: 'Refuerzos escolares, lectura guiada y clubes creativos para niñas, niños y adolescentes.',
        tag: 'Educación',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
        order: 1,
      },
      {
        title: 'Ruta literaria “María”',
        description: 'Lectura en familia, creación de relatos y visitas pedagógicas por el territorio afro.',
        tag: 'Cultura',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
        order: 2,
      },
      {
        title: 'Club Familias que acompañan',
        description: 'Escuela para familias, bienestar emocional y redes comunitarias que se cuidan entre sí.',
        tag: 'Bienestar',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
        order: 3,
      },
      {
        title: 'Huerta y alimentación saludable',
        description: 'Agricultura urbana, cocina nutritiva y emprendimientos solidarios para el territorio.',
        tag: 'Territorio',
        link: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
        order: 4,
      },
    ];

    for (const project of projects) {
      await strapi.entityService.create('api::project.project', { data: project });
    }
  }

  strapi.log.info('Seed completed successfully.');
}
