# 📝 Instrucciones para Poblar el CMS

## ✅ Verificaciones Completadas

1. **Frontend consume del CMS** ✓
   - El archivo `src/app/features/home/home.component.ts` (líneas 680-804) consume TODOS los datos del CMS
   - Si no hay datos en el CMS, usa valores hardcodeados como fallback
   - Una vez que pueblas el CMS, el frontend muestra automáticamente los datos del CMS

2. **Backend funcionando** ✓
   - Strapi corriendo en http://localhost:1337
   - Usuario admin: `admin@facopec.org` / `Admin123456`
   - Base de datos inicializada
   - Permisos configurados

## 🚀 Cómo Poblar el CMS (Método Manual - RECOMENDADO)

Los scripts automáticos tienen problemas de permisos con Strapi 5. La forma más confiable es poblarlo manualmente:

### Paso 1: Entra al CMS
1. Abre http://localhost:1337/admin
2. Login: `admin@facopec.org` / `Admin123456`

### Paso 2: Ve a Home Page
1. Click en "Content Manager" (menú izquierdo)
2. Click en "Home Page" (bajo Single Types)
3. Verás el editor de contenido

### Paso 3: Pobla cada sección

#### 📚 Programs (LOS 13 PROGRAMAS)

Click en "Add new entry" en la sección Programs y agrega cada uno:

**Programa 1:**
```
Title: Guías y Cuentos Cortos
Description: Recursos pedagógicos y cuentos para fortalecer la lectura comprensiva
Highlights: Lectura, Escritura, Creatividad
Link: https://cuentoscortosprofeencasa.blogspot.com/
```

**Programa 2:**
```
Title: Guías de Matemáticas
Description: Material didáctico para el aprendizaje de matemáticas
Highlights: Matemáticas, Lógica, Resolución
Link: https://matematicasprofeencasa.blogspot.com/
```

**Programa 3:**
```
Title: Talleres de Nivelación
Description: Refuerzo académico en áreas fundamentales
Highlights: Refuerzo, Nivelación, Acompañamiento
Link: https://talleresdenivelacion.blogspot.com/
```

**Programa 4:**
```
Title: Plan Lector Ruta Literaria María
Description: Programa de fomento de lectura basado en la obra María
Highlights: Lectura, Literatura, Cultura
Link: https://rutaliterariamaria.blogspot.com/
```

**Programa 5:**
```
Title: Escuela de Padres
Description: Formación y acompañamiento para madres y padres de familia
Highlights: Familia, Crianza, Educación
Link: https://consejosparapadresymadres.blogspot.com/
```

**Programa 6:**
```
Title: Formación Espiritual
Description: Escuela dominical y formación en valores cristianos
Highlights: Fe, Valores, Espiritualidad
Link: https://escueladominicalcreciendoconcristo.blogspot.com/
```

**Programa 7:**
```
Title: Comunidades NARP
Description: Fortalecimiento de comunidades negras, afrocolombianas, raizales y palenqueras
Highlights: Identidad, Derechos, Comunidad
Link: https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform
```

**Programa 8:**
```
Title: Empleabilidad
Description: Desarrollo de competencias laborales y orientación vocacional
Highlights: Empleo, Formación, Oportunidades
Link: https://empleabilidad-facopec.blogspot.com/
```

**Programa 9:**
```
Title: Salidas Pedagógicas
Description: Experiencias educativas fuera del aula
Highlights: Exploración, Aprendizaje, Cultura
Link: https://salidaspedagogicas-facopec.blogspot.com/
```

**Programa 10:**
```
Title: FACOPEC Educa
Description: Plataforma de recursos educativos digitales
Highlights: Educación, Tecnología, Recursos
Link: https://facopeceduca.blogspot.com/
```

**Programa 11:**
```
Title: Dona Ropa
Description: Programa de recolección y distribución de ropa para familias
Highlights: Solidaridad, Donación, Comunidad
Link: https://quetienespararegalar.blogspot.com/
```

**Programa 12:**
```
Title: Servicio Comunitario
Description: Acciones de voluntariado y servicio a la comunidad
Highlights: Voluntariado, Servicio, Impacto
Link: https://serviciocomunitario-facopec.blogspot.com/
```

**Programa 13:**
```
Title: Desafío Matemáticos
Description: Competencias y retos matemáticos para estudiantes de primaria
Highlights: Matemáticas, Competencia, Diversión
Link: https://desafio-matematicos.blogspot.com/
```

#### 👥 Attended Persons

**Persona 1:**
```
Program: Tutorías Profe en Casa
Count: 120
Description: Estudiantes en refuerzo escolar
Icon: 🧠
Theme: teal
```

**Persona 2:**
```
Program: Ruta Literaria María
Count: 65
Description: Participantes en círculos de lectura
Icon: 📖
Theme: blue
```

**Persona 3:**
```
Program: Semillero Digital
Count: 45
Description: Jóvenes en talleres STEAM
Icon: 💻
Theme: purple
```

**Persona 4:**
```
Program: Club Familias
Count: 80
Description: Familias acompañadas
Icon: 👨‍👩‍👧‍👦
Theme: rose
```

#### 📅 Event Calendar

**Evento 1:**
```
Title: Taller de lectura en voz alta
Description: Círculo literario con familias
Event Date: 2025-12-15T15:00:00
Location: Biblioteca Comunitaria
Category: taller
Color: blue
Is Highlighted: Yes
```

**Evento 2:**
```
Title: Reunión Club Familias
Description: Escuela de padres mensual
Event Date: 2025-12-20T17:00:00
Location: Sede FACOPEC
Category: reunion
Color: rose
Is Highlighted: No
```

**Evento 3:**
```
Title: Celebración Fin de Año
Description: Cierre de actividades 2025
Event Date: 2025-12-22T14:00:00
Location: Parque Central
Category: celebracion
Color: gold
Is Highlighted: Yes
```

### Paso 4: Guarda y Publica

1. Click en "Save" (arriba a la derecha)
2. Click en "Publish"
3. Recarga el frontend en http://localhost:4200
4. ¡Deberías ver los datos del CMS!

## 🧪 Cómo Probar que Funciona

1. Entra al CMS
2. Modifica el título de un programa (por ejemplo, cambia "Guías y Cuentos Cortos" a "Guías y Cuentos Modificado")
3. Guarda y publica
4. Recarga http://localhost:4200
5. ¡Deberías ver el cambio inmediatamente!

## 📊 Scripts Disponibles (si quieres intentar automático)

- `populate-all-cms-public.js`: Intenta poblar vía API pública (tiene problemas de permisos)
- `populate-cms-with-admin-auth.js`: Intenta con autenticación de admin
- `populate-via-content-manager.js`: Intenta vía Content Manager API

Para ejecutar cualquiera:
```bash
cd backend
node <nombre-del-script>.js
```

## ✅ Verificación Final

Frontend consume del CMS:
- ✅ activities (línea 680-695 de home.component.ts)
- ✅ programs (línea 697-721)
- ✅ attendedPersons (línea 768-783)
- ✅ eventCalendar (línea 785-804)
- ✅ catalog (línea 733-748)
- ✅ gallery (línea 750-766)
- ✅ supporters (línea 723-731)

TODO está listo para consumir del CMS cuando lo puebles.
