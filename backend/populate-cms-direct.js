#!/usr/bin/env node

/**
 * Script para poblar ALL CMS content types usando Strapi Entity Service
 * Este script se ejecuta dentro del contexto de Strapi
 * Ejecutar: cd backend && node populate-cms-direct.js
 */

const path = require('path');

async function bootstrap() {
  const Strapi = require('@strapi/strapi');
  const strapi = await Strapi.createStrapi().load();

  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║       🚀 POBLANDO TODO EL CMS CON DATOS DEL FRONTEND       ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // 1. GLOBAL SETTINGS
    console.log('📝 1/4 Poblando Global Settings...');
    const globalData = {
      siteName: "FACOPEC",
      siteTagline: "Fundación Afrocolombiana Profe en Casa",
      siteDescription: "Transformamos vidas a través de la educación y el cuidado. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.",
      navigation: [
        { label: "Inicio", url: "/", isInternal: true, order: 1 },
        { label: "Nosotros", url: "/about", isInternal: true, order: 2 },
        { label: "Programas", url: "/programs", isInternal: true, order: 3 },
        { label: "Donar", url: "/donate", isInternal: true, order: 4 },
        { label: "Blog", url: "https://fundacionafrocolombianaprofeencasa.blogspot.com", isInternal: false, order: 5 },
        { label: "Contacto", url: "/contact", isInternal: true, order: 6 }
      ],
      socialLinks: [
        { platform: "facebook", url: "https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa", icon: "facebook" },
        { platform: "instagram", url: "https://www.instagram.com/facopec", icon: "instagram" },
        { platform: "youtube", url: "https://www.youtube.com/@fundacionafrocolombianaprofe", icon: "youtube" },
        { platform: "blog", url: "https://fundacionafrocolombianaprofeencasa.blogspot.com", icon: "rss_feed" }
      ],
      contactInfo: {
        email: "facopec@facopec.org",
        phone: "+57 321 523 0283",
        whatsapp: "+573215230283",
        address: "Puerto Tejada, Valle del Cauca, Colombia"
      },
      footer: {
        copyright: "© 2025 FACOPEC. Todos los derechos reservados.",
        additionalText: "Fundación Afrocolombiana Profe en Casa - Transformando vidas a través de la educación"
      },
      publishedAt: new Date()
    };

    await strapi.documents('api::global.global').createOrUpdate({
      documentId: await getDocumentId('api::global.global'),
      data: globalData,
      status: 'published'
    });
    console.log('✅ Global Settings actualizado\n');

    // 2. ORGANIZATION INFO
    console.log('📝 2/4 Poblando Organization Info...');
    const orgData = {
      name: "Fundación Afrocolombiana Profe en Casa",
      shortName: "FACOPEC",
      tagline: "Transformando vidas a través de la educación y el cuidado",
      description: "Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).",
      mission: "La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP.",
      vision: "Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP.",
      foundedYear: 2010,
      email: "facopec@facopec.org",
      phone: "+57 321 523 0283",
      address: "Puerto Tejada, Valle del Cauca, Colombia",
      socialLinks: {
        facebook: "https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa",
        instagram: "https://www.instagram.com/facopec",
        youtube: "https://www.youtube.com/@fundacionafrocolombianaprofe",
        blog: "https://fundacionafrocolombianaprofeencasa.blogspot.com"
      },
      values: [
        { title: "Derechos humanos y dignidad", description: "Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP.", icon: "👐🏾" },
        { title: "Educación transformadora", description: "Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.", icon: "💡" },
        { title: "Fe, cultura y comunidad", description: "Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.", icon: "🤲🏾" }
      ],
      publishedAt: new Date()
    };

    await strapi.documents('api::organization-info.organization-info').createOrUpdate({
      documentId: await getDocumentId('api::organization-info.organization-info'),
      data: orgData,
      status: 'published'
    });
    console.log('✅ Organization Info actualizado\n');

    // 3. HOME PAGE
    console.log('📝 3/4 Poblando Home Page...');
    const homeData = {
      hero: {
        eyebrow: "Misión con sentido social",
        titleLines: [
          { line: "Transformamos vidas" },
          { line: "a través de la educación y el cuidado" }
        ],
        lead: "Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.",
        stats: [
          { value: "+180", label: "Estudiantes acompañados con tutorías y mentorías" },
          { value: "35", label: "Voluntarios activos en programas comunitarios" },
          { value: "12", label: "Barrios impactados con actividades presenciales y virtuales" }
        ],
        actions: [
          { label: "Donar ahora", url: "/donate", variant: "primary", isInternal: true, dataUid: "hero.actions.donate" },
          { label: "Ver programas", url: "/home#programas", variant: "secondary", isInternal: false, dataUid: "hero.actions.programs" }
        ],
        verse: {
          reference: "Proverbios 3:13",
          text: '"Feliz quien halla sabiduría"',
          description: "Creamos espacios seguros para aprender, compartir y crecer en comunidad."
        }
      },
      impactHighlights: [
        { icon: "📚", title: "Educación integral", label: "Tutorías, clubes de lectura y acompañamiento pedagógico", description: "Tutorías, clubes de lectura y acompañamiento pedagógico", dataUid: "impact.education", theme: "teal" },
        { icon: "🤝🏾", title: "Tejido comunitario", label: "Trabajo con familias, líderes y aliados del territorio", description: "Trabajo con familias, líderes y aliados del territorio", dataUid: "impact.community", theme: "blue" },
        { icon: "🌱", title: "Valores y fe", label: "Formación espiritual, bienestar emocional y liderazgo", description: "Formación espiritual, bienestar emocional y liderazgo", dataUid: "impact.faith", theme: "rose" }
      ],
      publishedAt: new Date()
    };

    await strapi.documents('api::home-page.home-page').createOrUpdate({
      documentId: await getDocumentId('api::home-page.home-page'),
      data: homeData,
      status: 'published'
    });
    console.log('✅ Home Page actualizado\n');

    // 4. DONATIONS PAGE
    console.log('📝 4/4 Poblando Donations Page...');
    const donationsData = {
      heroTitle: "Tu donación | cambia vidas",
      heroSubtitle: "Con cada aporte fortalecemos procesos educativos, culturales y espirituales en el Valle del Cauca.",
      donationAmounts: [
        { value: 20000, label: "$20.000", icon: "🎒", impact: "Útiles para un niño" },
        { value: 50000, label: "$50.000", icon: "📚", impact: "Libros y lectura guiada" },
        { value: 100000, label: "$100.000", icon: "🍎", impact: "Refrigerios de un taller" },
        { value: 200000, label: "$200.000", icon: "🚌", impact: "Transporte a actividades" }
      ],
      publishedAt: new Date()
    };

    await strapi.documents('api::donations-page.donations-page').createOrUpdate({
      documentId: await getDocumentId('api::donations-page.donations-page'),
      data: donationsData,
      status: 'published'
    });
    console.log('✅ Donations Page actualizado\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║                  🎉 ¡PROCESO COMPLETADO!                   ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('🌐 Verifica en:');
    console.log('   • Frontend: http://localhost:4200');
    console.log('   • Admin: http://localhost:1337/admin\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await strapi.destroy();
  }

  async function getDocumentId(uid) {
    try {
      const existing = await strapi.documents(uid).findMany({ limit: 1 });
      return existing[0]?.documentId || null;
    } catch {
      return null;
    }
  }
}

bootstrap();
