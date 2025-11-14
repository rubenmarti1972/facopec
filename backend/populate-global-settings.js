#!/usr/bin/env node

/**
 * Script para poblar Global Settings con configuración general
 * Ejecutar: node populate-global-settings.js
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

async function updateGlobalSettings(token) {
  const globalData = {
    data: {
      siteName: "FACOPEC",
      siteTagline: "Fundación Afrocolombiana Profe en Casa",
      siteDescription: "Transformamos vidas a través de la educación y el cuidado. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.",
      navigation: [
        {
          label: "Inicio",
          url: "/",
          isInternal: true,
          order: 1
        },
        {
          label: "Nosotros",
          url: "/about",
          isInternal: true,
          order: 2
        },
        {
          label: "Programas",
          url: "/programs",
          isInternal: true,
          order: 3
        },
        {
          label: "Donar",
          url: "/donate",
          isInternal: true,
          order: 4
        },
        {
          label: "Blog",
          url: "https://fundacionafrocolombianaprofeencasa.blogspot.com",
          isInternal: false,
          order: 5
        },
        {
          label: "Contacto",
          url: "/contact",
          isInternal: true,
          order: 6
        }
      ],
      socialLinks: [
        {
          platform: "facebook",
          url: "https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa",
          icon: "facebook"
        },
        {
          platform: "instagram",
          url: "https://www.instagram.com/facopec",
          icon: "instagram"
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@fundacionafrocolombianaprofe",
          icon: "youtube"
        },
        {
          platform: "blog",
          url: "https://fundacionafrocolombianaprofeencasa.blogspot.com",
          icon: "rss_feed"
        }
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
      }
    }
  };

  const response = await fetch(`${API_URL}/global`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(globalData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Update failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function publishGlobalSettings(token, documentId) {
  const response = await fetch(`${API_URL}/global/actions/publish`, {
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

    const altResponse = await fetch(`${API_URL}/global`, {
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

    console.log('📝 Poblando Global Settings...');
    const result = await updateGlobalSettings(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result.data.documentId;
    await publishGlobalSettings(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Global Settings poblada.');
    console.log('   📊 Datos migrados:');
    console.log('      • Nombre y descripción del sitio');
    console.log('      • 6 Elementos de navegación');
    console.log('      • 4 Enlaces a redes sociales');
    console.log('      • Información de contacto');
    console.log('      • Footer configuration\n');
    console.log('   🌐 Verifica en:');
    console.log('      1. API: http://localhost:1337/api/global');
    console.log('      2. Frontend: http://localhost:4200 (header y footer)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   • Strapi esté corriendo en http://localhost:1337');
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type global exista');
    process.exit(1);
  }
}

main();
