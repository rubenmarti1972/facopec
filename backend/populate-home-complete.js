#!/usr/bin/env node

/**
 * Script para poblar Home Page con TODOS los datos reales del frontend
 * Ejecutar: node populate-home-complete.js
 */

const API_URL = 'http://localhost:1337/api';
const ADMIN_EMAIL = 'admin@facopec.org';
const ADMIN_PASSWORD = 'Admin123456';

async function login() {
  const response = await fetch(`${API_URL}/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.jwt;
}

async function updateHomePage(token) {
  const homePageData = {
    data: {
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
          {
            label: "Donar ahora",
            url: "/donate",
            variant: "primary",
            isInternal: true,
            dataUid: "hero.actions.donate"
          },
          {
            label: "Ver programas",
            url: "/home#programas",
            variant: "secondary",
            isInternal: false,
            dataUid: "hero.actions.programs"
          }
        ],
        verse: {
          reference: "Proverbios 3:13",
          text: '"Feliz quien halla sabiduría"',
          description: "Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias."
        }
      },
      impactHighlights: [
        {
          icon: "📚",
          title: "Educación integral",
          label: "Tutorías, clubes de lectura y acompañamiento pedagógico",
          description: "Tutorías, clubes de lectura y acompañamiento pedagógico",
          dataUid: "impact.education",
          theme: "teal"
        },
        {
          icon: "🤝🏾",
          title: "Tejido comunitario",
          label: "Trabajo con familias, líderes y aliados del territorio",
          description: "Trabajo con familias, líderes y aliados del territorio",
          dataUid: "impact.community",
          theme: "blue"
        },
        {
          icon: "🌱",
          title: "Valores y fe",
          label: "Formación espiritual, bienestar emocional y liderazgo",
          description: "Formación espiritual, bienestar emocional y liderazgo",
          dataUid: "impact.faith",
          theme: "rose"
        }
      ],
      identity: {
        description: "Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Valle del Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.",
        dataUid: "about.description",
        values: [
          {
            title: "Derechos humanos y dignidad",
            description: "Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).",
            icon: "👐🏾",
            dataUid: "about.values.rights"
          },
          {
            title: "Educación transformadora",
            description: "Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.",
            icon: "💡",
            dataUid: "about.values.education"
          },
          {
            title: "Fe, cultura y comunidad",
            description: "Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.",
            icon: "🤲🏾",
            dataUid: "about.values.community"
          }
        ]
      },
      missionVision: {
        mission: "La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.",
        vision: "Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.",
        missionUid: "about.mission",
        visionUid: "about.vision"
      },
      activities: [
        {
          title: "Tutorías Profe en Casa",
          description: "Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.",
          icon: "🧠",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas",
          theme: "teal",
          dataUid: "activities.tutorias"
        },
        {
          title: "Ruta Literaria María",
          description: "Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.",
          icon: "📖",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa",
          theme: "blue",
          dataUid: "activities.rutaLiteraria"
        },
        {
          title: "Huerta y alimentación",
          description: "Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.",
          icon: "🥬",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta",
          theme: "gold",
          dataUid: "activities.huerta"
        },
        {
          title: "Arte, danza y fe",
          description: "Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.",
          icon: "🎨",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura",
          theme: "rose",
          dataUid: "activities.arte"
        }
      ],
      programs: [
        {
          title: "Semillero Digital",
          description: "Talleres STEAM, alfabetización digital y mentorías vocacionales que conectan a jóvenes con oportunidades tecnológicas.",
          highlights: ["Tecnología", "Innovación", "Mentorías"],
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital",
          strapiCollection: "programas",
          strapiEntryId: "semillero-digital"
        },
        {
          title: "Club Familias que Acompañan",
          description: "Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.",
          highlights: ["Familias", "Bienestar", "Prevención"],
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias",
          strapiCollection: "programas",
          strapiEntryId: "club-familias"
        }
      ],
      supporters: [
        {
          name: "Instituto Colombiano de Bienestar Familiar",
          caption: "Instituto Colombiano de Bienestar Familiar",
          dataUid: "supporters.icbf"
        },
        {
          name: "Programa de las Naciones Unidas para el Desarrollo",
          caption: "Programa de las Naciones Unidas para el Desarrollo",
          dataUid: "supporters.pnud"
        }
      ],
      catalog: [
        {
          title: "Kit escolar completo",
          description: "Útiles, lecturas y materiales artísticos para un estudiante durante un trimestre.",
          price: "$85.000 COP",
          link: "https://wa.me/p/5881121183974635/573215230283",
          strapiCollection: "catalogo-whatsapp",
          strapiEntryId: "kit-escolar"
        },
        {
          title: "Canasta solidaria",
          description: "Apoyo nutricional para familias con niñas y niños en refuerzo escolar durante un mes.",
          price: "$70.000 COP",
          link: "https://wa.me/p/5979113203538798/573215230283",
          strapiCollection: "catalogo-whatsapp",
          strapiEntryId: "canasta-solidaria"
        },
        {
          title: "Apadrina una tutoría",
          description: "Financia sesiones personalizadas y acompañamiento pedagógico para un estudiante.",
          price: "$45.000 COP",
          link: "https://wa.me/p/5332119887812567/573215230283",
          strapiCollection: "catalogo-whatsapp",
          strapiEntryId: "apadrina-tutoria"
        }
      ],
      gallery: [
        {
          title: "Laboratorio de lectura",
          description: "Niños y niñas viven experiencias literarias en la biblioteca comunitaria.",
          type: "image",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/09/lectura-en-comunidad.html",
          strapiCollection: "galeria",
          strapiEntryId: "laboratorio-lectura"
        },
        {
          title: "Huerta escolar comunitaria",
          description: "Familias cosechan alimentos y aprenden sobre soberanía alimentaria.",
          type: "image",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/06/huerta-escolar.html",
          strapiCollection: "galeria",
          strapiEntryId: "huerta-escolar"
        },
        {
          title: "Testimonio en video",
          description: "Conoce cómo la fundación impacta a las familias del Cauca.",
          type: "video",
          link: "https://www.youtube.com/watch?v=VN0qfM2Yg2w",
          strapiCollection: "galeria",
          strapiEntryId: "testimonio-video"
        }
      ],
      attendedPersons: [
        {
          program: "Tutorías Profe en Casa",
          count: 120,
          description: "Estudiantes en refuerzo escolar",
          icon: "🧠",
          theme: "teal"
        },
        {
          program: "Ruta Literaria María",
          count: 65,
          description: "Participantes en círculos de lectura",
          icon: "📖",
          theme: "blue"
        },
        {
          program: "Semillero Digital",
          count: 45,
          description: "Jóvenes en talleres STEAM",
          icon: "💻",
          theme: "purple"
        },
        {
          program: "Club Familias",
          count: 80,
          description: "Familias acompañadas",
          icon: "👨‍👩‍👧‍👦",
          theme: "rose"
        }
      ],
      eventCalendar: [
        {
          title: "Taller de lectura en voz alta",
          description: "Círculo literario con familias",
          eventDate: "2025-12-15T15:00:00",
          location: "Biblioteca Comunitaria",
          category: "taller",
          color: "blue",
          isHighlighted: true
        },
        {
          title: "Reunión Club Familias",
          description: "Escuela de padres mensual",
          eventDate: "2025-12-20T17:00:00",
          location: "Sede FACOPEC",
          category: "reunion",
          color: "rose"
        },
        {
          title: "Celebración Fin de Año",
          description: "Cierre de actividades 2025",
          eventDate: "2025-12-22T14:00:00",
          location: "Parque Central",
          category: "celebracion",
          color: "gold",
          isHighlighted: true
        }
      ]
    }
  };

  const response = await fetch(`${API_URL}/home-page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(homePageData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Update failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function publishHomePage(token, documentId) {
  const response = await fetch(`${API_URL}/home-page/actions/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      documentId: documentId
    })
  });

  if (!response.ok) {
    console.warn(`Publish via action failed: ${response.status}. Trying alternative method...`);

    // Try alternative publish method
    const altResponse = await fetch(`${API_URL}/home-page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          publishedAt: new Date().toISOString()
        }
      })
    });

    if (!altResponse.ok) {
      throw new Error(`Alternative publish also failed: ${altResponse.status}`);
    }

    return await altResponse.json();
  }

  return await response.json();
}

async function main() {
  try {
    console.log('🔐 Autenticando...');
    const token = await login();
    console.log('✅ Autenticación exitosa\n');

    console.log('📝 Poblando Home Page con TODOS los datos del frontend...');
    const result = await updateHomePage(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result.data.documentId;
    await publishHomePage(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Home Page poblada con todos los datos del frontend.');
    console.log('   📊 Datos migrados:');
    console.log('      • Hero section con 3 stats y 2 actions');
    console.log('      • 3 Impact highlights');
    console.log('      • Identity section con 3 valores');
    console.log('      • Misión y Visión completas');
    console.log('      • 4 Activity cards');
    console.log('      • 2 Program cards');
    console.log('      • 2 Supporters');
    console.log('      • 3 Catalog items');
    console.log('      • 3 Gallery items');
    console.log('      • 4 Attended persons');
    console.log('      • 3 Event calendar items\n');
    console.log('   🌐 Verifica en:');
    console.log('      1. API: http://localhost:1337/api/home-page');
    console.log('      2. Frontend: http://localhost:4200\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   • Strapi esté corriendo en http://localhost:1337');
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type home-page exista');
    process.exit(1);
  }
}

main();
