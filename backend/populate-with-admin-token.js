#!/usr/bin/env node

/**
 * Población del CMS usando autenticación de administrador
 */

const API_URL = 'http://localhost:1337/api';

async function getAdminToken() {
  console.log('🔑 Obteniendo token de administrador...');

  const response = await fetch(`${API_URL}/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'admin@facopec.org',
      password: 'Admin123456'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('✅ Token obtenido exitosamente');
  return data.jwt;
}

async function updateHomePageWithAuth(token) {
  const homeData = {
    data: {
      activities: [
        { title: "Tutorías Profe en Casa", description: "Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas", icon: "🧠", theme: "teal", dataUid: "activities.tutorias" },
        { title: "Ruta Literaria María", description: "Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa", icon: "📖", theme: "blue", dataUid: "activities.rutaLiteraria" },
        { title: "Huerta y alimentación", description: "Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta", icon: "🥬", theme: "gold", dataUid: "activities.huerta" },
        { title: "Arte, danza y fe", description: "Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.", link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura", icon: "🎨", theme: "rose", dataUid: "activities.arte" }
      ],
      programs: [
        { title: "Guías y Cuentos Cortos", description: "Recursos pedagógicos y cuentos para fortalecer la lectura comprensiva", highlights: ["Lectura", "Escritura", "Creatividad"], link: "https://cuentoscortosprofeencasa.blogspot.com/", strapiCollection: "programas", strapiEntryId: "guias-cuentos" },
        { title: "Guías de Matemáticas", description: "Material didáctico para el aprendizaje de matemáticas", highlights: ["Matemáticas", "Lógica", "Resolución"], link: "https://matematicasprofeencasa.blogspot.com/", strapiCollection: "programas", strapiEntryId: "guias-mate" },
        { title: "Talleres de Nivelación", description: "Refuerzo académico en áreas fundamentales", highlights: ["Refuerzo", "Nivelación", "Acompañamiento"], link: "https://talleresdenivelacion.blogspot.com/", strapiCollection: "programas", strapiEntryId: "talleres-nivelacion" },
        { title: "Plan Lector Ruta Literaria María", description: "Programa de fomento de lectura basado en la obra María", highlights: ["Lectura", "Literatura", "Cultura"], link: "https://rutaliterariamaria.blogspot.com/", strapiCollection: "programas", strapiEntryId: "plan-lector" },
        { title: "Escuela de Padres", description: "Formación y acompañamiento para madres y padres de familia", highlights: ["Familia", "Crianza", "Educación"], link: "https://consejosparapadresymadres.blogspot.com/", strapiCollection: "programas", strapiEntryId: "escuela-padres" },
        { title: "Formación Espiritual", description: "Escuela dominical y formación en valores cristianos", highlights: ["Fe", "Valores", "Espiritualidad"], link: "https://escueladominicalcreciendoconcristo.blogspot.com/", strapiCollection: "programas", strapiEntryId: "formacion-espiritual" },
        { title: "Comunidades NARP", description: "Fortalecimiento de comunidades negras, afrocolombianas, raizales y palenqueras", highlights: ["Identidad", "Derechos", "Comunidad"], link: "https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform", strapiCollection: "programas", strapiEntryId: "comunidades-narp" },
        { title: "Empleabilidad", description: "Desarrollo de competencias laborales y orientación vocacional", highlights: ["Empleo", "Formación", "Oportunidades"], link: "https://empleabilidad-facopec.blogspot.com/", strapiCollection: "programas", strapiEntryId: "empleabilidad" },
        { title: "Salidas Pedagógicas", description: "Experiencias educativas fuera del aula", highlights: ["Exploración", "Aprendizaje", "Cultura"], link: "https://salidaspedagogicas-facopec.blogspot.com/", strapiCollection: "programas", strapiEntryId: "salidas-pedagogicas" },
        { title: "FACOPEC Educa", description: "Plataforma de recursos educativos digitales", highlights: ["Educación", "Tecnología", "Recursos"], link: "https://facopeceduca.blogspot.com/", strapiCollection: "programas", strapiEntryId: "facopec-educa" },
        { title: "Dona Ropa", description: "Programa de recolección y distribución de ropa para familias", highlights: ["Solidaridad", "Donación", "Comunidad"], link: "https://quetienespararegalar.blogspot.com/", strapiCollection: "programas", strapiEntryId: "dona-ropa" },
        { title: "Servicio Comunitario", description: "Acciones de voluntariado y servicio a la comunidad", highlights: ["Voluntariado", "Servicio", "Impacto"], link: "https://serviciocomunitario-facopec.blogspot.com/", strapiCollection: "programas", strapiEntryId: "servicio-comunitario" },
        { title: "Desafío Matemáticos", description: "Competencias y retos matemáticos para estudiantes de primaria", highlights: ["Matemáticas", "Competencia", "Diversión"], link: "https://desafio-matematicos.blogspot.com/", strapiCollection: "programas", strapiEntryId: "desafio-matematicos" }
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

  console.log('📝 Actualizando Home Page con autenticación...');

  const response = await fetch(`${API_URL}/home-page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(homeData)
  });

  if (!response.ok) {
    const error = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', error);
    throw new Error(`Home Page update failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🚀 POBLANDO HOME PAGE CON LOS 13 PROGRAMAS            ║');
  console.log('║        (Usando autenticación de administrador)            ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    const token = await getAdminToken();
    await updateHomePageWithAuth(token);

    console.log('\n✅ Home Page actualizado completamente\n');

    console.log('📊 Contenido poblado:');
    console.log('   ✓ Activities (4)');
    console.log('   ✓ Programs (13) 🎯');
    console.log('   ✓ Attended Persons (4)');
    console.log('   ✓ Event Calendar (3)');
    console.log('   ✓ Catalog (3)');
    console.log('   ✓ Gallery (5)');
    console.log('   ✓ Supporters (2)\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║              🎉 ¡POBLACIÓN COMPLETADA!                     ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('🌐 Verifica en:');
    console.log('   • CMS: http://localhost:1337/admin/content-manager/single-types/api::home-page.home-page');
    console.log('   • Frontend: http://localhost:4200\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
