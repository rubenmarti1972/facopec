/**
 * Script para subir logos de programas y actualizar la home page
 * Mapea los logos desde src/assets/program-logos/ con los programas correspondientes
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const ASSETS_PATH = path.join(__dirname, '..', 'src', 'assets', 'program-logos');

// Mapeo de logos a programas con sus datos
const PROGRAM_LOGOS = [
  {
    logoFile: 'guias.png',
    title: 'Guías de Cuentos Cortos',
    description: 'Material pedagógico para fomentar la lectura y comprensión lectora a través de cuentos cortos',
    link: 'https://cuentoscortosprofeencasa.blogspot.com/',
    highlights: ['Lectura', 'Comprensión', 'Creatividad']
  },
  {
    logoFile: 'guias-mate.png',
    title: 'Guías de Matemáticas',
    description: 'Recursos educativos para el aprendizaje de matemáticas adaptados a cada nivel',
    link: 'https://matematicasprofeencasa.blogspot.com/',
    highlights: ['Matemáticas', 'Lógica', 'Resolución de problemas']
  },
  {
    logoFile: 'talleres-nivelacion.png',
    title: 'Talleres de Nivelación',
    description: 'Refuerzo escolar personalizado para estudiantes de todas las edades',
    link: 'https://talleresdenivelacion.blogspot.com/',
    highlights: ['Refuerzo', 'Nivelación', 'Acompañamiento']
  },
  {
    logoFile: 'plan-lector.png',
    title: 'Ruta Literaria María',
    description: 'Programa de lectura en voz alta, círculos literarios y creación de cuentos',
    link: 'https://rutaliterariamaria.blogspot.com/',
    highlights: ['Lectura', 'Literatura', 'Identidad cultural']
  },
  {
    logoFile: 'escuela-padres.png',
    title: 'Escuela de Padres',
    description: 'Orientación y acompañamiento para familias en el proceso educativo de sus hijos',
    link: 'https://consejosparapadresymadres.blogspot.com/',
    highlights: ['Familias', 'Crianza', 'Acompañamiento']
  },
  {
    logoFile: 'espiritual.png',
    title: 'Escuela Dominical - Creciendo con Cristo',
    description: 'Formación espiritual, valores cristianos y liderazgo',
    link: 'https://escueladominicalcreciendoconcristo.blogspot.com/',
    highlights: ['Fe', 'Valores', 'Espiritualidad']
  },
  {
    logoFile: 'comunidades-narp.png',
    title: 'Comunidades NARP',
    description: 'Certificación y reconocimiento de Comunidades Negras, Afrocolombianas, Raizales y Palenqueras',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform',
    highlights: ['Identidad', 'Certificación', 'NARP']
  },
  {
    logoFile: 'emplpeabilidad.png', // Nota: hay un typo en el nombre del archivo
    title: 'Empleabilidad',
    description: 'Formación para el trabajo, emprendimiento y desarrollo de habilidades laborales',
    link: 'https://empleabilidad-facopec.blogspot.com/',
    highlights: ['Empleo', 'Emprendimiento', 'Formación laboral']
  },
  {
    logoFile: 'salida-pedagogica.png',
    title: 'Salidas Pedagógicas',
    description: 'Experiencias educativas y recreativas fuera del aula',
    link: 'https://salidaspedagogicas-facopec.blogspot.com/',
    highlights: ['Experiencias', 'Recreación', 'Aprendizaje vivencial']
  },
  {
    logoFile: 'educa.png',
    title: 'FACOPEC Educa',
    description: 'Plataforma educativa con recursos digitales y herramientas pedagógicas',
    link: 'https://facopeceduca.blogspot.com/',
    highlights: ['Educación digital', 'Recursos', 'Tecnología']
  },
  {
    logoFile: 'dona-ropa.png',
    title: '¿Qué Tienes para Regalar?',
    description: 'Programa de donación de ropa y artículos para familias necesitadas',
    link: 'https://quetienespararegalar.blogspot.com/',
    highlights: ['Donaciones', 'Solidaridad', 'Apoyo comunitario']
  },
  {
    logoFile: 'comunitario.png',
    title: 'Servicio Comunitario',
    description: 'Voluntariado y proyectos de impacto social en la comunidad',
    link: 'https://serviciocomunitario-facopec.blogspot.com/',
    highlights: ['Voluntariado', 'Servicio', 'Comunidad']
  },
  {
    logoFile: 'primaria.png',
    title: 'Desafío Matemáticos - Primaria',
    description: 'Programa especializado en matemáticas para estudiantes de primaria',
    link: 'https://desafio-matematicos.blogspot.com/',
    highlights: ['Matemáticas', 'Primaria', 'Desafíos']
  }
];

async function uploadLogo(logoFile) {
  const logoPath = path.join(ASSETS_PATH, logoFile);

  if (!fs.existsSync(logoPath)) {
    console.warn(`  ⚠️  Archivo no encontrado: ${logoFile}`);
    return null;
  }

  const form = new FormData();
  form.append('files', fs.createReadStream(logoPath));

  try {
    const response = await axios.post(`${STRAPI_URL}/api/upload`, form, {
      headers: form.getHeaders()
    });

    if (response.data && response.data.length > 0) {
      console.log(`  ✅ Logo subido: ${logoFile}`);
      return response.data[0].id;
    }
  } catch (error) {
    console.error(`  ❌ Error subiendo ${logoFile}:`, error.response?.data || error.message);
  }

  return null;
}

async function updateHomePagePrograms() {
  try {
    console.log('🎨 Subiendo logos de programas al CMS...\n');

    // Subir todos los logos primero
    const programsWithLogos = [];

    for (const program of PROGRAM_LOGOS) {
      console.log(`📁 Procesando: ${program.title}`);
      const logoId = await uploadLogo(program.logoFile);

      programsWithLogos.push({
        title: program.title,
        description: program.description,
        highlights: program.highlights,
        link: program.link,
        logo: logoId,
        logoAlt: `Logo ${program.title}`
      });
    }

    console.log(`\n✅ ${programsWithLogos.filter(p => p.logo).length} logos subidos exitosamente\n`);

    // Obtener la home page actual
    const homePageResponse = await axios.get(`${STRAPI_URL}/api/home-page`);
    const documentId = homePageResponse.data.data.documentId;

    console.log(`📄 Actualizando programas en Home Page (${documentId})...\n`);

    // Actualizar la home page con los programas
    await axios.put(
      `${STRAPI_URL}/api/home-page`,
      {
        data: {
          programs: programsWithLogos
        }
      }
    );

    console.log('✅ Programas actualizados exitosamente!\n');
    console.log('📊 Resumen:');
    programsWithLogos.forEach((program, index) => {
      console.log(`${index + 1}. ${program.title}`);
      console.log(`   Logo: ${program.logo ? '✅' : '❌'}`);
      console.log(`   URL: ${program.link}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

updateHomePagePrograms();
