#!/usr/bin/env node

/**
 * Script para poblar Organization Info con datos reales del frontend
 * Ejecutar: node populate-organization-info.js
 */

const BASE_URL = 'http://localhost:1337';
const API_URL = 'http://localhost:1337/api';
const ADMIN_EMAIL = 'admin@facopec.org';
const ADMIN_PASSWORD = 'Admin123456';

async function login() {
  const response = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.data.token;
}

async function updateOrganizationInfo(token) {
  const orgData = {
    data: {
      name: "Fundación Afrocolombiana Profe en Casa",
      shortName: "FACOPEC",
      tagline: "Transformando vidas a través de la educación y el cuidado",
      description: "Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Valle del Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.",
      mission: "La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.",
      vision: "Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.",
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
        {
          title: "Derechos humanos y dignidad",
          description: "Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).",
          icon: "👐🏾"
        },
        {
          title: "Educación transformadora",
          description: "Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.",
          icon: "💡"
        },
        {
          title: "Fe, cultura y comunidad",
          description: "Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.",
          icon: "🤲🏾"
        }
      ]
    }
  };

  const response = await fetch(`${API_URL}/organization-info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orgData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Update failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function publishOrganizationInfo(token, documentId) {
  const response = await fetch(`${API_URL}/organization-info/actions/publish`, {
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

    const altResponse = await fetch(`${API_URL}/organization-info`, {
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

    console.log('📝 Poblando Organization Info...');
    const result = await updateOrganizationInfo(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result.data.documentId;
    await publishOrganizationInfo(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Organization Info poblada.');
    console.log('   📊 Datos migrados:');
    console.log('      • Nombre y descripción de la organización');
    console.log('      • Misión y Visión completas');
    console.log('      • Información de contacto');
    console.log('      • Enlaces a redes sociales');
    console.log('      • 3 Valores corporativos\n');
    console.log('   🌐 Verifica en:');
    console.log('      1. API: http://localhost:1337/api/organization-info');
    console.log('      2. Frontend: http://localhost:4200/about\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   • Strapi esté corriendo en http://localhost:1337');
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type organization-info exista');
    process.exit(1);
  }
}

main();
