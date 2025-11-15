#!/usr/bin/env node

/**
 * Script MAESTRO para poblar TODO el CMS usando la API pública
 * Los permisos públicos ya están configurados con setup-public-api-access.js
 * Ejecutar: node populate-all-cms-public.js
 */

const API_URL = 'http://localhost:1337/api';

async function updateGlobalSettings() {
  const globalData = {
    data: {
      siteName: "FACOPEC | Fundación Afrocolombiana Profe en Casa",
      appUrl: "https://www.fundacionafro.org",
      socialLinks: [
        { platform: "facebook", url: "https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa", dataUid: "social.facebook" },
        { platform: "instagram", url: "https://www.instagram.com/facopec", dataUid: "social.instagram" },
        { platform: "youtube", url: "https://www.youtube.com/@fundacionafrocolombianaprofe", dataUid: "social.youtube" },
        { platform: "whatsapp", url: "https://wa.me/573215230283", dataUid: "social.whatsapp" }
      ]
    }
  };

  const response = await fetch(`${API_URL}/global`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(globalData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Global Settings failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function updateOrganizationInfo() {
  const orgData = {
    data: {
      name: "Fundación Afrocolombiana Profe en Casa | FACOPEC",
      mission: "La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.",
      vision: "Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.",
      history: "<p>Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.</p>",
      contactEmail: "facopec@facopec.org",
      contactPhone: "+57 321 523 0283",
      values: [
        { title: "Derechos humanos y dignidad", description: "Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).", icon: "👐🏾", dataUid: "about.values.rights" },
        { title: "Educación transformadora", description: "Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.", icon: "💡", dataUid: "about.values.education" },
        { title: "Fe, cultura y comunidad", description: "Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.", icon: "🤲🏾", dataUid: "about.values.community" }
      ]
    }
  };

  const response = await fetch(`${API_URL}/organization-info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orgData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Organization Info failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function updateHomePage() {
  const homeData = {
    data: {
      hero: {
        eyebrow: "Misión con sentido social",
        titleLines: [
          { line: "Transformamos vidas" },
          { line: "a través de la educación y el cuidado" }
        ],
        lead: "Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Cauca.",
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
          description: "Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias."
        }
      },
      impactHighlights: [
        { icon: "📚", title: "Educación integral", label: "Tutorías, clubes de lectura y acompañamiento pedagógico", description: "Tutorías, clubes de lectura y acompañamiento pedagógico", dataUid: "impact.education", theme: "teal" },
        { icon: "🤝🏾", title: "Tejido comunitario", label: "Trabajo con familias, líderes y aliados del territorio", description: "Trabajo con familias, líderes y aliados del territorio", dataUid: "impact.community", theme: "blue" },
        { icon: "🌱", title: "Valores y fe", label: "Formación espiritual, bienestar emocional y liderazgo", description: "Formación espiritual, bienestar emocional y liderazgo", dataUid: "impact.faith", theme: "rose" }
      ],
      identity: {
        description: "Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.",
        dataUid: "about.description",
        values: [
          { title: "Derechos humanos y dignidad", description: "Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).", icon: "👐🏾", dataUid: "about.values.rights" },
          { title: "Educación transformadora", description: "Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.", icon: "💡", dataUid: "about.values.education" },
          { title: "Fe, cultura y comunidad", description: "Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.", icon: "🤲🏾", dataUid: "about.values.community" }
        ]
      },
      missionVision: {
        mission: "La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.",
        vision: "Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.",
        missionUid: "about.mission",
        visionUid: "about.vision"
      }
    }
  };

  const response = await fetch(`${API_URL}/home-page`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(homeData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Home Page failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function updateDonationsPage() {
  const donationsData = {
    data: {
      heroTitle: "Tu donación | cambia vidas",
      heroSubtitle: "Con cada aporte fortalecemos procesos educativos, culturales y espirituales en el Cauca. Acompañas a familias afrocolombianas para que sigan soñando con más oportunidades.",
      donationAmounts: [
        { value: 20000, label: "$20.000", icon: "🎒", impact: "Útiles para un niño" },
        { value: 50000, label: "$50.000", icon: "📚", impact: "Libros y lectura guiada" },
        { value: 100000, label: "$100.000", icon: "🍎", impact: "Refrigerios de un taller" },
        { value: 200000, label: "$200.000", icon: "🚌", impact: "Transporte a actividades" }
      ],
      metrics: [
        { value: "+180", label: "Kits escolares entregados en 2023", dataUid: "donations.stats.kits" },
        { value: "24", label: "Familias con acompañamiento nutricional", dataUid: "donations.stats.families" },
        { value: "12", label: "Voluntarios articulados cada mes", dataUid: "donations.stats.volunteers" }
      ],
      highlights: [
        { icon: "📚", title: "Educación accesible", description: "Materiales, tutorías y recursos digitales para niñas y niños afrocolombianos.", theme: "teal", dataUid: "donations.highlights.education" },
        { icon: "🤝🏾", title: "Crecimiento comunitario", description: "Encuentros familiares, redes solidarias y acompañamiento psicoemocional.", theme: "blue", dataUid: "donations.highlights.community" },
        { icon: "🌱", title: "Huerta y nutrición", description: "Huertas urbanas, soberanía alimentaria y formación en hábitos saludables.", theme: "sun", dataUid: "donations.highlights.garden" },
        { icon: "🎶", title: "Arte y espiritualidad", description: "Laboratorios creativos, danza y espacios de fe que fortalecen la identidad.", theme: "rose", dataUid: "donations.highlights.art" }
      ]
    }
  };

  const response = await fetch(`${API_URL}/donations-page`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationsData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Donations Page failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║       🚀 POBLANDO TODO EL CMS CON DATOS DEL FRONTEND       ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    console.log('📝 1/4 Poblando Global Settings...');
    await updateGlobalSettings();
    console.log('✅ Global Settings actualizado\n');

    console.log('📝 2/4 Poblando Organization Info...');
    await updateOrganizationInfo();
    console.log('✅ Organization Info actualizado\n');

    console.log('📝 3/4 Poblando Home Page...');
    await updateHomePage();
    console.log('✅ Home Page actualizado\n');

    console.log('📝 4/4 Poblando Donations Page...');
    await updateDonationsPage();
    console.log('✅ Donations Page actualizado\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║                  🎉 ¡PROCESO COMPLETADO!                   ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📊 RESUMEN:\n');
    console.log('   ✅ Global Settings - Navegación, contacto, redes sociales');
    console.log('   ✅ Organization Info - Misión, visión, valores');
    console.log('   ✅ Home Page - Hero, highlights, identity, mission/vision');
    console.log('   ✅ Donations Page - Amounts, metrics, highlights\n');

    console.log('🌐 Verifica en:');
    console.log('   • Frontend: http://localhost:4200');
    console.log('   • Admin: http://localhost:1337/admin\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Si ves errores de permisos, ejecuta primero:');
    console.error('   node setup-public-api-access.js\n');
    process.exit(1);
  }
}

main();
