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
      },
      activities: [
        { title: "Tutorías Profe en Casa", description: "Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas", icon: "🧠", theme: "teal", dataUid: "activities.tutorias" },
        { title: "Ruta Literaria María", description: "Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa", icon: "📖", theme: "blue", dataUid: "activities.rutaLiteraria" },
        { title: "Huerta y alimentación", description: "Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta", icon: "🥬", theme: "gold", dataUid: "activities.huerta" },
        { title: "Arte, danza y fe", description: "Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura", icon: "🎨", theme: "rose", dataUid: "activities.arte" }
      ],
      programs: [
        { title: "Semillero Digital", description: "Talleres STEAM, alfabetización digital y mentorías vocacionales que conectan a jóvenes con oportunidades tecnológicas.", highlights: ["Tecnología", "Innovación", "Mentorías"], link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital", strapiCollection: "programas", strapiEntryId: "semillero-digital" },
        { title: "Club Familias que Acompañan", description: "Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.", highlights: ["Familias", "Bienestar", "Prevención"], link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias", strapiCollection: "programas", strapiEntryId: "club-familias" }
      ],
      attendedPersons: [
        { program: "Tutorías Profe en Casa", count: 120, description: "Estudiantes en refuerzo escolar", icon: "🧠", theme: "teal" },
        { program: "Ruta Literaria María", count: 65, description: "Participantes en círculos de lectura", icon: "📖", theme: "blue" },
        { program: "Semillero Digital", count: 45, description: "Jóvenes en talleres STEAM", icon: "💻", theme: "purple" },
        { program: "Club Familias", count: 80, description: "Familias acompañadas", icon: "👨‍👩‍👧‍👦", theme: "rose" }
      ],
      eventCalendar: [
        { title: "Taller de lectura en voz alta", description: "Círculo literario con familias", eventDate: "2025-12-15T15:00:00", location: "Biblioteca Comunitaria", category: "taller", color: "blue", isHighlighted: true },
        { title: "Reunión Club Familias", description: "Escuela de padres mensual", eventDate: "2025-12-20T17:00:00", location: "Sede FACOPEC", category: "reunion", color: "rose" },
        { title: "Celebración Fin de Año", description: "Cierre de actividades 2025", eventDate: "2025-12-22T14:00:00", location: "Parque Central", category: "celebracion", color: "gold", isHighlighted: true }
      ],
      catalog: [
        { title: "Kit escolar completo", description: "Útiles, lecturas y materiales artísticos para un estudiante durante un trimestre.", price: "$85.000 COP", link: "https://wa.me/p/5881121183974635/573215230283", strapiCollection: "catalogo-whatsapp", strapiEntryId: "kit-escolar" },
        { title: "Canasta solidaria", description: "Apoyo nutricional para familias con niñas y niños en refuerzo escolar durante un mes.", price: "$70.000 COP", link: "https://wa.me/p/5979113203538798/573215230283", strapiCollection: "catalogo-whatsapp", strapiEntryId: "canasta-solidaria" },
        { title: "Apadrina una tutoría", description: "Financia sesiones personalizadas y acompañamiento pedagógico para un estudiante.", price: "$45.000 COP", link: "https://wa.me/p/5332119887812567/573215230283", strapiCollection: "catalogo-whatsapp", strapiEntryId: "apadrina-tutoria" }
      ],
      gallery: [
        { title: "Teatro Las Dos Aguas", description: "Salida pedagógica al Teatro Las Dos Aguas, una experiencia cultural que enriquece el aprendizaje de nuestros estudiantes.", type: "image", link: "https://salidaspedagogicas-facopec.blogspot.com/2025/10/facopec-dteatro.html", strapiCollection: "galeria", strapiEntryId: "teatro-dos-aguas" },
        { title: "Museo de la Caña", description: "Salida pedagógica al Museo de la Caña - Hacienda El Paraíso, explorando nuestra historia y patrimonio cultural.", type: "image", link: "https://salidaspedagogicas-facopec.blogspot.com/2025/04/museo-de-la-cana-hacienda-el-paraiso.html", strapiCollection: "galeria", strapiEntryId: "museo-cana" },
        { title: "Curso Manipulación de Alimentos", description: "Cooperación entre el SENA y la Fundación Afrocolombiana Profe en Casa para formación en manipulación de alimentos.", type: "image", link: "https://www.facebook.com/Profeencasasedecds/posts/pfbid0jUg224nXfxCa3MWdo2jZFps1mNcWDkuidzGDShV1FfcZgo6rBYeXLaYovtE5E61vl", strapiCollection: "galeria", strapiEntryId: "curso-manipulacion-alimentos" },
        { title: "Desafío 5K", description: "Una carrera llena de mucha energía y alegría en Ciudad del Sur, promoviendo la actividad física y el espíritu comunitario.", type: "image", link: "https://www.facebook.com/photo/?fbid=1007381601593265&set=pcb.1007384828259609", strapiCollection: "galeria", strapiEntryId: "desafio-5k" },
        { title: "Feria de Empleo", description: "Feria de empleo para conectar a nuestra comunidad con oportunidades laborales y fortalecer la empleabilidad.", type: "image", link: "https://www.facebook.com/Profeencasasedecds/posts/pfbid0TLJhrPgsq3YMiVUiqbErE6nMvQ8xUnREvvTjkoxm3ZuRTMmpjAGeuyo5EaLk6v3xl", strapiCollection: "galeria", strapiEntryId: "feria-empleo" }
      ],
      supporters: [
        { name: "Instituto Colombiano de Bienestar Familiar", caption: "Instituto Colombiano de Bienestar Familiar", dataUid: "supporters.icbf" },
        { name: "Programa de las Naciones Unidas para el Desarrollo", caption: "Programa de las Naciones Unidas para el Desarrollo", dataUid: "supporters.pnud" }
      ]
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
