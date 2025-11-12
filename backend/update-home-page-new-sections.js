#!/usr/bin/env node

/**
 * Script para agregar las nuevas secciones a Home Page:
 * - Personas atendidas (attendedPersons)
 * - Calendario de eventos (eventCalendar)
 *
 * Ejecutar: node update-home-page-new-sections.js
 */

const API_URL = 'http://localhost:1337/api';
const ADMIN_EMAIL = 'facopec@facopec.org';
const ADMIN_PASSWORD = 'F4c0pec@2025';

async function login() {
  console.log('🔐 Iniciando sesión...');
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
  console.log('✅ Sesión iniciada correctamente');
  return data.jwt;
}

async function getCurrentHomePage(token) {
  console.log('📖 Obteniendo datos actuales de la home page...');
  const response = await fetch(`${API_URL}/home-page?populate=deep`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get home page: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log('✅ Datos actuales obtenidos');
  return result.data;
}

async function updateHomePage(token, currentData) {
  console.log('📝 Actualizando home page con nuevas secciones...');

  const updatedData = {
    data: {
      ...currentData.attributes,
      attendedPersons: [
        {
          program: 'Tutorías Profe en Casa',
          count: 120,
          description: 'Estudiantes en refuerzo escolar',
          icon: '🧠',
          theme: 'teal'
        },
        {
          program: 'Ruta Literaria María',
          count: 65,
          description: 'Participantes en círculos de lectura',
          icon: '📖',
          theme: 'blue'
        },
        {
          program: 'Semillero Digital',
          count: 45,
          description: 'Jóvenes en talleres STEAM',
          icon: '💻',
          theme: 'purple'
        },
        {
          program: 'Club Familias',
          count: 80,
          description: 'Familias acompañadas',
          icon: '👨‍👩‍👧‍👦',
          theme: 'rose'
        }
      ],
      eventCalendar: [
        {
          title: 'Taller de lectura en voz alta',
          description: 'Círculo literario con familias',
          eventDate: '2025-12-15T15:00:00.000Z',
          location: 'Biblioteca Comunitaria',
          category: 'taller',
          color: 'blue',
          isHighlighted: true
        },
        {
          title: 'Reunión Club Familias',
          description: 'Escuela de padres mensual',
          eventDate: '2025-12-20T17:00:00.000Z',
          location: 'Sede FACOPEC',
          category: 'reunion',
          color: 'rose'
        },
        {
          title: 'Celebración Fin de Año',
          description: 'Cierre de actividades 2025',
          eventDate: '2025-12-22T14:00:00.000Z',
          location: 'Parque Central',
          category: 'celebracion',
          color: 'gold',
          isHighlighted: true
        },
        {
          title: 'Taller STEAM Semillero Digital',
          description: 'Programación básica para jóvenes',
          eventDate: '2025-12-18T16:00:00.000Z',
          location: 'Sala de Cómputo FACOPEC',
          category: 'formacion',
          color: 'purple',
          isHighlighted: false
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
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update home page: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const result = await response.json();
  console.log('✅ Home page actualizada correctamente');
  return result;
}

async function main() {
  try {
    console.log('🚀 Iniciando actualización de la home page...\n');

    const token = await login();
    const currentData = await getCurrentHomePage(token);
    await updateHomePage(token, currentData);

    console.log('\n✨ ¡Actualización completada con éxito!');
    console.log('\n📊 Nuevas secciones agregadas:');
    console.log('  • Personas atendidas (4 programas)');
    console.log('  • Calendario de eventos (4 eventos)');
    console.log('\n🌐 Visita http://localhost:4200 para ver los cambios');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
