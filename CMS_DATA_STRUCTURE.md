# Estructura de Datos para el CMS de FACOPEC

Este documento detalla la estructura exacta que debe tener el CMS (Strapi) para que coincida con el contenido hardcodeado en el código.

---

## 📅 1. EVENTOS DEL CALENDARIO (eventCalendar)

**Ubicación en CMS:** `home-page` → `eventCalendar`
**Total requerido:** 5 eventos

```json
[
  {
    "title": "Cierre del programa de nivelación",
    "description": "Cierre del programa de nivelación académica",
    "eventDate": "2025-11-27T15:00:00",
    "location": "Sede FACOPEC",
    "category": "evento",
    "color": "teal",
    "isHighlighted": true
  },
  {
    "title": "Mujeres Equidad y Empleo",
    "description": "Programa de empleabilidad y formación para mujeres",
    "eventDate": "2025-11-10T09:00:00",
    "endDate": "2026-01-10T17:00:00",
    "location": "Sede FACOPEC",
    "category": "formacion",
    "color": "purple",
    "isHighlighted": true
  },
  {
    "title": "Taller de lectura en voz alta",
    "description": "Círculo literario con familias",
    "eventDate": "2025-12-15T15:00:00",
    "location": "Biblioteca Comunitaria",
    "category": "taller",
    "color": "blue",
    "isHighlighted": true
  },
  {
    "title": "Reunión Club Familias",
    "description": "Escuela de padres mensual",
    "eventDate": "2025-12-20T17:00:00",
    "location": "Sede FACOPEC",
    "category": "reunion",
    "color": "rose",
    "isHighlighted": false
  },
  {
    "title": "Celebración Fin de Año",
    "description": "Cierre de actividades 2025",
    "eventDate": "2025-12-22T14:00:00",
    "location": "Parque Central",
    "category": "celebracion",
    "color": "gold",
    "isHighlighted": true
  }
]
```

---

## 🎨 2. ACTIVIDADES (activities)

**Ubicación en CMS:** `home-page` → `activities`
**Total requerido:** 4 actividades

```json
[
  {
    "title": "Tutorías Profe en Casa",
    "description": "Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.",
    "link": "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas",
    "icon": "🧠",
    "theme": "teal",
    "dataUid": "activities.tutorias"
  },
  {
    "title": "Ruta Literaria María",
    "description": "Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.",
    "link": "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa",
    "icon": "📖",
    "theme": "blue",
    "dataUid": "activities.rutaLiteraria"
  },
  {
    "title": "Huerta y alimentación",
    "description": "Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.",
    "link": "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta",
    "icon": "🥬",
    "theme": "gold",
    "dataUid": "activities.huerta"
  },
  {
    "title": "Arte, danza y fe",
    "description": "Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.",
    "link": "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura",
    "icon": "🎨",
    "theme": "rose",
    "dataUid": "activities.arte"
  }
]
```

---

## 🎯 3. LOGOS DE PROGRAMAS (programLogos)

**Ubicación en CMS:** `home-page` → `programLogos`
**Total requerido:** 14 programas

```json
[
  {
    "logo": "guias.png",
    "alt": "Guías y Cuentos Cortos",
    "link": "https://cuentoscortosprofeencasa.blogspot.com/"
  },
  {
    "logo": "guias-mate.png",
    "alt": "Guías de Matemáticas",
    "link": "https://matematicasprofeencasa.blogspot.com/"
  },
  {
    "logo": "talleres-nivelacion.png",
    "alt": "Talleres de Nivelación",
    "link": "https://talleresdenivelacion.blogspot.com/"
  },
  {
    "logo": "primaria.png",
    "alt": "Desafío Matemáticos",
    "link": "https://desafio-matematicos.blogspot.com/"
  },
  {
    "logo": "plan-lector.png",
    "alt": "Plan Lector",
    "link": "https://rutaliterariamaria.blogspot.com/"
  },
  {
    "logo": "escuela-padres.png",
    "alt": "Escuela de Padres",
    "link": "https://consejosparapadresymadres.blogspot.com/"
  },
  {
    "logo": "espiritual.png",
    "alt": "Formación Espiritual",
    "link": "https://escueladominicalcreciendoconcristo.blogspot.com/"
  },
  {
    "logo": "emplpeabilidad.png",
    "alt": "Empleabilidad",
    "link": "https://empleabilidad-facopec.blogspot.com/"
  },
  {
    "logo": "educa.png",
    "alt": "Escuela de Formación para Jóvenes",
    "link": "https://personerosestudiantilesylideres.blogspot.com/"
  },
  {
    "logo": "educa.png",
    "alt": "FACOPEC Educa",
    "link": "https://facopeceduca.blogspot.com/"
  },
  {
    "logo": "comunidades-narp.png",
    "alt": "Comunidades NARP",
    "link": "https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform"
  },
  {
    "logo": "comunitario.png",
    "alt": "Servicio Comunitario",
    "link": "https://serviciocomunitario-facopec.blogspot.com/"
  },
  {
    "logo": "dona-ropa.png",
    "alt": "Dona Ropa",
    "link": "https://quetienespararegalar.blogspot.com/"
  },
  {
    "logo": "salida-pedagogica.png",
    "alt": "Salidas Pedagógicas",
    "link": "https://salidaspedagogicas-facopec.blogspot.com/"
  }
]
```

---

## 🗂️ 4. NAVEGACIÓN DEL HEADER (navigation)

**Ubicación en CMS:** `global` → `navigation`
**Total requerido:** 14 programas organizados en 8 categorías

### Estructura de Navegación:

```json
[
  {
    "id": "nav-home",
    "label": "Inicio",
    "url": "/home",
    "exact": true,
    "order": 1
  },
  {
    "id": "nav-programs",
    "label": "Programas",
    "order": 2,
    "children": [
      {
        "title": "📚 Educación y Refuerzo Académico",
        "items": [
          {
            "label": "Guías y Cuentos Cortos",
            "url": "https://cuentoscortosprofeencasa.blogspot.com/",
            "target": "_blank"
          },
          {
            "label": "Guías de Matemáticas",
            "url": "https://matematicasprofeencasa.blogspot.com/",
            "target": "_blank"
          },
          {
            "label": "Talleres de Nivelación",
            "url": "https://talleresdenivelacion.blogspot.com/",
            "target": "_blank"
          },
          {
            "label": "Desafío Matemáticos",
            "url": "https://desafio-matematicos.blogspot.com/",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "📖 Cultura y Lectura",
        "items": [
          {
            "label": "Plan Lector - Ruta Literaria María",
            "url": "https://rutaliterariamaria.blogspot.com/",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "👨‍👩‍👧‍👦 Desarrollo Familiar y Comunitario",
        "items": [
          {
            "label": "Escuela de Padres",
            "url": "https://consejosparapadresymadres.blogspot.com/",
            "target": "_blank"
          },
          {
            "label": "Formación Espiritual",
            "url": "https://escueladominicalcreciendoconcristo.blogspot.com/",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "💼 Empleabilidad y Desarrollo",
        "items": [
          {
            "label": "Empleabilidad",
            "url": "https://empleabilidad-facopec.blogspot.com/",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "💻 Innovación y Tecnología Educativa",
        "items": [
          {
            "label": "FACOPEC Educa",
            "url": "https://facopeceduca.blogspot.com/",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "🌍 Etnoeducación y Cultura (Identidad)",
        "items": [
          {
            "label": "Comunidades NARP",
            "url": "https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "🕊️ Liderazgo, Gobernanza y Paz",
        "items": [
          {
            "label": "Escuela de Formación para Jóvenes",
            "url": "https://personerosestudiantilesylideres.blogspot.com/",
            "target": "_blank"
          }
        ]
      },
      {
        "title": "🎉 Impacto Directo y Bienestar",
        "items": [
          {
            "label": "Servicio Comunitario",
            "url": "https://serviciocomunitario-facopec.blogspot.com/",
            "target": "_blank"
          },
          {
            "label": "Dona Ropa",
            "url": "https://quetienespararegalar.blogspot.com/",
            "target": "_blank"
          },
          {
            "label": "Salidas Pedagógicas",
            "url": "https://salidaspedagogicas-facopec.blogspot.com/",
            "target": "_blank"
          }
        ]
      }
    ]
  },
  {
    "id": "nav-projects",
    "label": "Proyectos",
    "url": "/proyectos",
    "fragment": "programas",
    "order": 3
  },
  {
    "id": "nav-support",
    "label": "Apóyanos",
    "url": "/donaciones",
    "order": 4
  },
  {
    "id": "nav-contact",
    "label": "Contáctanos",
    "url": "/contactanos",
    "order": 5
  },
  {
    "id": "nav-about",
    "label": "Nosotros",
    "url": "/about",
    "order": 6
  }
]
```

---

## ✅ RESUMEN DE CAMBIOS NECESARIOS EN EL CMS

### Cambios a realizar:

1. **eventCalendar**: Agregar 2 eventos más (actualmente 3, deben ser 5)
   - ✅ Ya existe: Cierre del programa de nivelación
   - ✅ Ya existe: Mujeres Equidad y Empleo
   - ✅ Ya existe: Taller de lectura en voz alta
   - ❌ AGREGAR: Reunión Club Familias
   - ❌ AGREGAR: Celebración Fin de Año

2. **programLogos**: Agregar 1 programa más (actualmente 13, deben ser 14)
   - ❌ AGREGAR: Escuela de Formación para Jóvenes (logo: educa.png, link: personerosestudiantilesylideres.blogspot.com)

3. **navigation**: Reorganizar en 8 categorías (actualmente 4, deben ser 8)
   - ❌ REORGANIZAR: Mover programas a las nuevas categorías
   - ❌ AGREGAR: Categoría "🕊️ Liderazgo, Gobernanza y Paz"
   - ❌ AGREGAR: Categoría "💻 Innovación y Tecnología Educativa"
   - ❌ AGREGAR: Categoría "🌍 Etnoeducación y Cultura (Identidad)"

---

## 📝 NOTAS IMPORTANTES

- Todos los logos deben estar en la carpeta `assets/program-logos/`
- Los emojis en los títulos de las categorías son importantes para la visualización
- Las fechas deben estar en formato ISO: `YYYY-MM-DDTHH:mm:ss`
- Los colores válidos para eventos: `teal`, `purple`, `blue`, `rose`, `gold`, `green`
- Las categorías válidas para eventos: `evento`, `taller`, `reunion`, `actividad`, `formacion`, `celebracion`
- Los temas válidos para actividades: `teal`, `blue`, `rose`, `gold`

---

## 🔄 LÓGICA DE FALLBACK

El sistema ahora funciona con **lógica de mezcla**:
- Si el CMS tiene datos, se **combinan** con los hardcodeados (no se reemplazan)
- Los datos hardcodeados **siempre están presentes** como fallback
- Se evitan duplicados comparando títulos/enlaces

**Validación actual:**
- La navegación del CMS solo se usa si tiene **al menos 14 programas**
- Si tiene menos, se mantiene la navegación hardcodeada automáticamente
