#!/usr/bin/env node

/**
 * Script para poblar Donations Page con todos los datos reales del frontend
 * Ejecutar: node populate-donations-page.js
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

async function updateDonationsPage(token) {
  const donationsData = {
    data: {
      heroTitle: "Tu donación | cambia vidas",
      heroSubtitle: "Con cada aporte fortalecemos procesos educativos, culturales y espirituales en el Valle del Cauca. Acompañas a familias afrocolombianas para que sigan soñando con más oportunidades.",
      donationAmounts: [
        {
          value: 20000,
          label: "$20.000",
          icon: "🎒",
          impact: "Útiles para un niño"
        },
        {
          value: 50000,
          label: "$50.000",
          icon: "📚",
          impact: "Libros y lectura guiada"
        },
        {
          value: 100000,
          label: "$100.000",
          icon: "🍎",
          impact: "Refrigerios de un taller"
        },
        {
          value: 200000,
          label: "$200.000",
          icon: "🚌",
          impact: "Transporte a actividades"
        }
      ],
      metrics: [
        {
          value: "+180",
          label: "Kits escolares entregados en 2023",
          dataUid: "donations.stats.kits"
        },
        {
          value: "24",
          label: "Familias con acompañamiento nutricional",
          dataUid: "donations.stats.families"
        },
        {
          value: "12",
          label: "Voluntarios articulados cada mes",
          dataUid: "donations.stats.volunteers"
        }
      ],
      highlights: [
        {
          icon: "📚",
          title: "Educación accesible",
          description: "Materiales, tutorías y recursos digitales para niñas y niños afrocolombianos.",
          theme: "teal",
          dataUid: "donations.highlights.education"
        },
        {
          icon: "🤝🏾",
          title: "Crecimiento comunitario",
          description: "Encuentros familiares, redes solidarias y acompañamiento psicoemocional.",
          theme: "blue",
          dataUid: "donations.highlights.community"
        },
        {
          icon: "🌱",
          title: "Huerta y nutrición",
          description: "Huertas urbanas, soberanía alimentaria y formación en hábitos saludables.",
          theme: "sun",
          dataUid: "donations.highlights.garden"
        },
        {
          icon: "🎶",
          title: "Arte y espiritualidad",
          description: "Laboratorios creativos, danza y espacios de fe que fortalecen la identidad.",
          theme: "rose",
          dataUid: "donations.highlights.art"
        }
      ],
      stories: [
        {
          title: "Tutorías Profe en Casa",
          description: "Voluntariado pedagógico que refuerza lectura, matemáticas y tecnología desde el hogar.",
          impact: "Con $85.000 COP aseguras kits completos para un estudiante durante un trimestre.",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas",
          strapiCollection: "donaciones-historias",
          strapiEntryId: "tutorias-profe-en-casa"
        },
        {
          title: "Huerta comunitaria",
          description: "Familias siembran y aprenden sobre alimentación sostenible con apoyo de la fundación.",
          impact: "Una donación de $70.000 COP respalda canastas de alimentos para cuatro familias.",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta",
          strapiCollection: "donaciones-historias",
          strapiEntryId: "huerta-comunitaria"
        },
        {
          title: "Ruta Literaria María",
          description: "Clubes de lectura, escritura creativa y encuentros culturales que celebran la afrocolombianidad.",
          impact: "Con $45.000 COP apoyas la compra de libros y actividades para un círculo de lectura.",
          link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa",
          strapiCollection: "donaciones-historias",
          strapiEntryId: "ruta-literaria"
        }
      ],
      supportActions: [
        {
          icon: "🤝",
          title: "Apadrina un niño",
          description: "Acompaña el proceso educativo y emocional de una niña o un niño durante todo el año.",
          link: "/apadrina",
          linkLabel: "Conocer más",
          theme: "sun",
          dataUid: "donations.actions.sponsor"
        },
        {
          icon: "⏰",
          title: "Voluntariado activo",
          description: "Comparte tu tiempo en tutorías, logística de eventos y mentorías profesionales.",
          link: "/contacto",
          linkLabel: "Inscribirme",
          theme: "teal",
          dataUid: "donations.actions.volunteer"
        },
        {
          icon: "📢",
          title: "Comparte nuestra misión",
          description: "Multiplica el mensaje en redes sociales y vincula nuevos aliados solidarios.",
          link: "https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa",
          linkLabel: "Compartir",
          theme: "rose",
          dataUid: "donations.actions.share"
        }
      ],
      paymentGateways: [
        {
          name: "Pagos PSE (Colombia)",
          description: "Conéctate con tu banco a través de la pasarela PSE y realiza transferencias seguras desde cualquier entidad nacional.",
          link: "https://www.pse.com.co/persona",
          actionLabel: "Donar con PSE",
          badge: "🇨🇴 PSE",
          theme: "pse"
        },
        {
          name: "Nequi",
          description: "Realiza tu donación de forma rápida y segura a través de Nequi. Escanea el código QR o envía directamente desde tu app.",
          link: "https://www.nequi.com.co",
          actionLabel: "Donar con Nequi",
          badge: "💜 Nequi",
          theme: "nequi"
        },
        {
          name: "PayPal",
          description: "Haz tu aporte desde el exterior con tarjeta de crédito o cuenta PayPal en una plataforma segura para aliados globales.",
          link: "https://www.paypal.com/donate",
          actionLabel: "Donar con PayPal",
          badge: "🌍 PayPal",
          theme: "international"
        }
      ]
    }
  };

  const response = await fetch(`${API_URL}/donations-page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(donationsData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Update failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function publishDonationsPage(token, documentId) {
  const response = await fetch(`${API_URL}/donations-page/actions/publish`, {
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

    const altResponse = await fetch(`${API_URL}/donations-page`, {
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

    console.log('📝 Poblando Donations Page con todos los datos del frontend...');
    const result = await updateDonationsPage(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result.data.documentId;
    await publishDonationsPage(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Donations Page poblada con todos los datos.');
    console.log('   📊 Datos migrados:');
    console.log('      • Hero section con título y descripción');
    console.log('      • 4 Donation amounts presets');
    console.log('      • 3 Impact metrics');
    console.log('      • 4 Highlight cards');
    console.log('      • 3 Impact stories');
    console.log('      • 3 Support actions');
    console.log('      • 3 Payment gateway options\n');
    console.log('   🌐 Verifica en:');
    console.log('      1. API: http://localhost:1337/api/donations-page');
    console.log('      2. Frontend: http://localhost:4200/donate\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   • Strapi esté corriendo en http://localhost:1337');
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type donations-page exista');
    process.exit(1);
  }
}

main();
