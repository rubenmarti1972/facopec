# 📋 Datos para Poblar el CMS - Copiar y Pegar

## ⚠️ Nota Importante

Debido a las restricciones de autenticación de Strapi 5, la forma más simple y segura de poblar el CMS es copiar y pegar los datos directamente en el Admin UI de Strapi.

## 🚀 Cómo Usar Esta Guía

1. **Abre Strapi Admin:** http://localhost:1337/admin
2. **Login con:**
   - Email: `admin@facopec.org`
   - Password: `Admin123456`
3. **Navega a:** Content Manager → Single Types
4. **Selecciona** el content type correspondiente
5. **Copia y pega** los datos JSON de abajo en el editor
6. **Guarda** y **Publica**

---

## 1️⃣ Global Settings

**Navegar a:** Content Manager → Single Types → Global

**Copiar y pegar estos valores en los campos correspondientes:**

### Campos básicos:
- **Site Name:** `FACOPEC`
- **Site Tagline:** `Fundación Afrocolombiana Profe en Casa`
- **Site Description:** `Transformamos vidas a través de la educación y el cuidado. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.`

### Navigation (Array - Agregar 6 items):

**Item 1:**
```
Label: Inicio
URL: /
Is Internal: ✓
Order: 1
```

**Item 2:**
```
Label: Nosotros
URL: /about
Is Internal: ✓
Order: 2
```

**Item 3:**
```
Label: Programas
URL: /programs
Is Internal: ✓
Order: 3
```

**Item 4:**
```
Label: Donar
URL: /donate
Is Internal: ✓
Order: 4
```

**Item 5:**
```
Label: Blog
URL: https://fundacionafrocolombianaprofeencasa.blogspot.com
Is Internal: ✗
Order: 5
```

**Item 6:**
```
Label: Contacto
URL: /contact
Is Internal: ✓
Order: 6
```

### Social Links (Array - Agregar 4 items):

**Item 1:**
```
Platform: facebook
URL: https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa
Icon: facebook
```

**Item 2:**
```
Platform: instagram
URL: https://www.instagram.com/facopec
Icon: instagram
```

**Item 3:**
```
Platform: youtube
URL: https://www.youtube.com/@fundacionafrocolombianaprofe
Icon: youtube
```

**Item 4:**
```
Platform: blog
URL: https://fundacionafrocolombianaprofeencasa.blogspot.com
Icon: rss_feed
```

### Contact Info (Component):
```
Email: facopec@facopec.org
Phone: +57 321 523 0283
Whatsapp: +573215230283
Address: Puerto Tejada, Valle del Cauca, Colombia
```

### Footer (Component):
```
Copyright: © 2025 FACOPEC. Todos los derechos reservados.
Additional Text: Fundación Afrocolombiana Profe en Casa - Transformando vidas a través de la educación
```

**✅ Guardar y Publicar**

---

## 2️⃣ Organization Info

**Navegar a:** Content Manager → Single Types → Organization Info

### Campos básicos:
```
Name: Fundación Afrocolombiana Profe en Casa
Short Name: FACOPEC
Tagline: Transformando vidas a través de la educación y el cuidado
Founded Year: 2010
Email: facopec@facopec.org
Phone: +57 321 523 0283
Address: Puerto Tejada, Valle del Cauca, Colombia
```

### Description:
```
Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Valle del Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.
```

### Mission:
```
La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.
```

### Vision:
```
Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.
```

### Social Links (Component):
```
Facebook: https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa
Instagram: https://www.instagram.com/facopec
Youtube: https://www.youtube.com/@fundacionafrocolombianaprofe
Blog: https://fundacionafrocolombianaprofeencasa.blogspot.com
```

### Values (Array - Agregar 3 items):

**Item 1:**
```
Title: Derechos humanos y dignidad
Description: Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).
Icon: 👐🏾
```

**Item 2:**
```
Title: Educación transformadora
Description: Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.
Icon: 💡
```

**Item 3:**
```
Title: Fe, cultura y comunidad
Description: Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.
Icon: 🤲🏾
```

**✅ Guardar y Publicar**

---

## 3️⃣ Home Page

**Navegar a:** Content Manager → Single Types → Home Page

### Hero Section (Component):

**Campos básicos:**
```
Eyebrow: Misión con sentido social
Lead: Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.
```

**Title Lines (Array - 2 items):**
```
Item 1: Transformamos vidas
Item 2: a través de la educación y el cuidado
```

**Stats (Array - 3 items):**
```
Item 1:
  Value: +180
  Label: Estudiantes acompañados con tutorías y mentorías

Item 2:
  Value: 35
  Label: Voluntarios activos en programas comunitarios

Item 3:
  Value: 12
  Label: Barrios impactados con actividades presenciales y virtuales
```

**Actions (Array - 2 items):**
```
Item 1:
  Label: Donar ahora
  URL: /donate
  Variant: primary
  Is Internal: ✓
  Data UID: hero.actions.donate

Item 2:
  Label: Ver programas
  URL: /home#programas
  Variant: secondary
  Is Internal: ✗
  Data UID: hero.actions.programs
```

**Verse (Component):**
```
Reference: Proverbios 3:13
Text: "Feliz quien halla sabiduría"
Description: Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.
```

### Impact Highlights (Array - 3 items):

**Item 1:**
```
Icon: 📚
Title: Educación integral
Label: Tutorías, clubes de lectura y acompañamiento pedagógico
Description: Tutorías, clubes de lectura y acompañamiento pedagógico
Data UID: impact.education
Theme: teal
```

**Item 2:**
```
Icon: 🤝🏾
Title: Tejido comunitario
Label: Trabajo con familias, líderes y aliados del territorio
Description: Trabajo con familias, líderes y aliados del territorio
Data UID: impact.community
Theme: blue
```

**Item 3:**
```
Icon: 🌱
Title: Valores y fe
Label: Formación espiritual, bienestar emocional y liderazgo
Description: Formación espiritual, bienestar emocional y liderazgo
Data UID: impact.faith
Theme: rose
```

### Identity (Component):

**Description:**
```
Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Valle del Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.
```

**Data UID:** `about.description`

**Values (Array - 3 items):**
```
Item 1:
  Title: Derechos humanos y dignidad
  Description: Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).
  Icon: 👐🏾
  Data UID: about.values.rights

Item 2:
  Title: Educación transformadora
  Description: Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.
  Icon: 💡
  Data UID: about.values.education

Item 3:
  Title: Fe, cultura y comunidad
  Description: Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.
  Icon: 🤲🏾
  Data UID: about.values.community
```

### Mission Vision (Component):

```
Mission: La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.

Vision: Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.

Mission UID: about.mission
Vision UID: about.vision
```

**✅ Guardar y Publicar**

---

## 4️⃣ Donations Page

**Navegar a:** Content Manager → Single Types → Donations Page

### Campos básicos:
```
Hero Title: Tu donación | cambia vidas
Hero Subtitle: Con cada aporte fortalecemos procesos educativos, culturales y espirituales en el Valle del Cauca. Acompañas a familias afrocolombianas para que sigan soñando con más oportunidades.
```

### Donation Amounts (Array - 4 items):

```
Item 1:
  Value: 20000
  Label: $20.000
  Icon: 🎒
  Impact: Útiles para un niño

Item 2:
  Value: 50000
  Label: $50.000
  Icon: 📚
  Impact: Libros y lectura guiada

Item 3:
  Value: 100000
  Label: $100.000
  Icon: 🍎
  Impact: Refrigerios de un taller

Item 4:
  Value: 200000
  Label: $200.000
  Icon: 🚌
  Impact: Transporte a actividades
```

### Metrics (Array - 3 items):

```
Item 1:
  Value: +180
  Label: Kits escolares entregados en 2023
  Data UID: donations.stats.kits

Item 2:
  Value: 24
  Label: Familias con acompañamiento nutricional
  Data UID: donations.stats.families

Item 3:
  Value: 12
  Label: Voluntarios articulados cada mes
  Data UID: donations.stats.volunteers
```

### Highlights (Array - 4 items):

```
Item 1:
  Icon: 📚
  Title: Educación accesible
  Description: Materiales, tutorías y recursos digitales para niñas y niños afrocolombianos.
  Theme: teal
  Data UID: donations.highlights.education

Item 2:
  Icon: 🤝🏾
  Title: Crecimiento comunitario
  Description: Encuentros familiares, redes solidarias y acompañamiento psicoemocional.
  Theme: blue
  Data UID: donations.highlights.community

Item 3:
  Icon: 🌱
  Title: Huerta y nutrición
  Description: Huertas urbanas, soberanía alimentaria y formación en hábitos saludables.
  Theme: sun
  Data UID: donations.highlights.garden

Item 4:
  Icon: 🎶
  Title: Arte y espiritualidad
  Description: Laboratorios creativos, danza y espacios de fe que fortalecen la identidad.
  Theme: rose
  Data UID: donations.highlights.art
```

**✅ Guardar y Publicar**

---

## ✅ Verificación

Después de poblar todo el contenido:

1. **Verifica en la API:**
   ```bash
   curl http://localhost:1337/api/global
   curl http://localhost:1337/api/organization-info
   curl http://localhost:1337/api/home-page
   curl http://localhost:1337/api/donations-page
   ```

2. **Verifica en el Frontend:**
   - Abre http://localhost:4200
   - Recarga con `Ctrl+Shift+R`
   - Verifica que los datos del CMS se muestren correctamente

---

## 📝 Notas

- **Imágenes:** Sube las imágenes/logos a Media Library y luego vincúlalas en los campos correspondientes
- **Orden:** El orden de población no importa, pero se recomienda empezar con Global y Organization Info
- **Publicación:** No olvides hacer clic en "Publish" después de guardar cada content type
- **Backup:** Considera hacer un backup de la base de datos después de poblar todo

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu CMS estará completamente poblado con todos los datos del frontend.
