#!/usr/bin/env node

/**
 * Script para poblar Home Page con datos de ejemplo
 * Ejecutar: node populate-home-page.js
 */

const API_URL = 'http://localhost:1337/api';
const ADMIN_EMAIL = 'facopec@facopec.org';
const ADMIN_PASSWORD = 'F4c0pec@2025';

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
        eyebrow: "FUNDACIÓN FACOPEC",
        titleLines: [
          { line: "Transformando" },
          { line: "Vidas a través" },
          { line: "de la Educación" }
        ],
        lead: "Comprometidos con el desarrollo integral de niños, jóvenes y familias vulnerables en Colombia",
        stats: [
          { value: "500+", label: "Niños beneficiados" },
          { value: "15", label: "Años de experiencia" },
          { value: "20+", label: "Aliados estratégicos" }
        ],
        actions: [
          { label: "Hacer una donación", url: "/donate", variant: "primary" },
          { label: "Conocer más", url: "/about", variant: "secondary" }
        ],
        verse: {
          reference: "Proverbios 22:6",
          text: "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él",
          description: "Nuestro fundamento bíblico"
        }
      },
      impactHighlights: [
        {
          icon: "school",
          title: "Educación",
          label: "Becas y apoyo escolar para niños vulnerables"
        },
        {
          icon: "favorite",
          title: "Salud",
          label: "Programas de nutrición y salud preventiva"
        },
        {
          icon: "family_restroom",
          title: "Familia",
          label: "Fortalecimiento del núcleo familiar"
        },
        {
          icon: "sports_soccer",
          title: "Recreación",
          label: "Actividades deportivas y culturales"
        }
      ],
      identity: {
        description: "FACOPEC es una fundación cristiana sin ánimo de lucro, dedicada a transformar la vida de niños, jóvenes y familias en situación de vulnerabilidad. Trabajamos con amor, compromiso y transparencia para construir un futuro mejor.",
        values: [
          {
            title: "Amor",
            description: "Servimos con amor cristiano a cada persona",
            icon: "favorite"
          },
          {
            title: "Integridad",
            description: "Actuamos con transparencia y honestidad",
            icon: "verified"
          },
          {
            title: "Excelencia",
            description: "Buscamos la calidad en todo lo que hacemos",
            icon: "star"
          },
          {
            title: "Compromiso",
            description: "Dedicados a nuestra misión y visión",
            icon: "handshake"
          }
        ]
      },
      missionVision: {
        mission: "Contribuir al desarrollo integral de niños, jóvenes y familias en situación de vulnerabilidad, a través de programas educativos, de salud y fortalecimiento familiar, fundamentados en principios cristianos.",
        vision: "Ser una fundación referente en Colombia por su impacto social y transformación de vidas, reconocida por su compromiso, transparencia y amor al prójimo."
      },
      activities: [
        {
          title: "Becas Educativas",
          description: "Apoyo económico para estudios de niños y jóvenes",
          icon: "school",
          link: "/programs/scholarships"
        },
        {
          title: "Alimentación",
          description: "Programas de nutrición y alimentación balanceada",
          icon: "restaurant",
          link: "/programs/nutrition"
        },
        {
          title: "Apoyo Familiar",
          description: "Talleres y acompañamiento a familias",
          icon: "group",
          link: "/programs/family"
        },
        {
          title: "Deportes",
          description: "Actividades deportivas y recreativas",
          icon: "sports",
          link: "/programs/sports"
        }
      ],
      programs: [
        {
          title: "Educación para Todos",
          description: "Becas escolares, útiles y uniformes para niños en situación de vulnerabilidad",
          highlights: [
            "Becas completas",
            "Útiles escolares",
            "Uniformes",
            "Transporte escolar"
          ],
          link: "/programs/education"
        },
        {
          title: "Nutrición Infantil",
          description: "Alimentación balanceada y seguimiento nutricional para niños",
          highlights: [
            "Desayunos nutritivos",
            "Almuerzos balanceados",
            "Control médico",
            "Vitaminas"
          ],
          link: "/programs/nutrition"
        }
      ],
      supporters: [
        {
          name: "Aliado 1",
          logo: null
        }
      ],
      catalog: [
        {
          title: "Kit Escolar",
          description: "Uniforme + útiles escolares para un niño",
          price: "$150.000",
          link: "https://wa.me/573001234567"
        },
        {
          title: "Alimentación Mensual",
          description: "Alimentación para un niño durante un mes",
          price: "$200.000",
          link: "https://wa.me/573001234567"
        }
      ],
      gallery: [
        {
          title: "Entrega de Becas 2024",
          description: "Ceremonia de entrega de becas educativas",
          type: "image",
          link: null,
          media: null
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

    console.log('📝 Poblando Home Page con datos de ejemplo...');
    const result = await updateHomePage(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result.data.documentId;
    await publishHomePage(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Ahora verifica:');
    console.log('   1. API: http://localhost:1337/api/home-page');
    console.log('   2. Frontend: http://localhost:4200');
    console.log('   3. Recarga con Ctrl+Shift+R\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   • Strapi esté corriendo');
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type home-page exista');
    process.exit(1);
  }
}

main();
