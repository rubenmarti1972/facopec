# Instrucciones para reiniciar y poblar el CMS

## ⚠️ IMPORTANTE: Limpiar y repoblar el CMS

Para que todos los cambios se reflejen correctamente en el CMS, es necesario **limpiar completamente la base de datos** y repoblarla desde cero.

## Pasos para limpiar y repoblar el CMS

### 1. Detener el backend si está corriendo

Si el backend está corriendo, detenerlo con `Ctrl+C`.

### 2. Limpiar la base de datos y los archivos subidos

```bash
cd backend
rm -rf data/strapi.db
rm -rf public/uploads/*
```

### 3. Ejecutar el script de seed

Primero, asegúrate de que las dependencias estén instaladas:

```bash
cd backend
pnpm install --no-frozen-lockfile
```

Luego, ejecuta el seed:

```bash
pnpm run seed
```

### 4. Iniciar el backend

```bash
pnpm run develop
```

## Cambios realizados

### 1. Schemas actualizados

- **`program-card`**: Ahora incluye un campo `logo` (media) para mostrar el logo de cada programa
- **`activity-card`**: Ahora incluye un campo `logo` (media) para mostrar el logo de cada actividad
- **`home.hero`**: Ahora incluye un campo repetible `carouselItems` para las imágenes del carrusel

### 2. Nuevo componente

- **`home/carousel-item.json`**: Componente para los items del carrusel del hero (image, title, description)

### 3. Datos poblados en el seed

El script de seed (`backend/src/database/seed-content.ts`) ahora pobla:

#### **Programas** (13 programas con logos y URLs):
- Guías y Cuentos Cortos
- Guías de Matemáticas
- Talleres de Nivelación
- Ruta Literaria María
- Escuela de Padres
- Formación Espiritual
- Comunidades NARP
- Empleabilidad
- Salidas Pedagógicas
- FACOPEC Educa
- Dona Ropa y Artículos
- Servicio Comunitario
- Desafío Matemáticos Primaria

Cada programa incluye:
- `title`: Título del programa
- `description`: Descripción
- `logo`: Logo del programa (desde `assets/program-logos`)
- `link`: URL del programa
- `highlights`: Array de características destacadas

#### **Actividades** (4 actividades con logos):
- Tutorías Profe en Casa
- Ruta Literaria María
- Huerta y alimentación
- Arte, danza y fe

Cada actividad incluye:
- `title`: Título
- `description`: Descripción
- `logo`: Logo (desde `assets/program-logos`)
- `icon`: Emoji
- `theme`: Color del tema
- `link`: URL

#### **Personas atendidas** (6 registros):
- Tutorías Profe en Casa: 120 estudiantes
- Ruta Literaria María: 65 participantes
- Semillero Digital: 45 jóvenes
- Club Familias: 80 familias
- Escuela de Padres: 55 padres
- Formación Espiritual: 90 niños y jóvenes

#### **Calendario de eventos** (6 eventos):
- Taller de lectura en voz alta (15 dic 2025)
- Reunión Club Familias (20 dic 2025)
- Celebración Fin de Año (22 dic 2025)
- Salida Pedagógica - Teatro (10 ene 2026)
- Taller de Matemáticas Primaria (18 ene 2026)
- Jornada de Empleabilidad (25 ene 2026)

#### **Carrusel del Hero** (4 imágenes):
- FACOPEC en acción
- Experiencias educativas
- Comunidad FACOPEC
- Apoyo comunitario

## Verificar que todo funciona

### 1. Accede al admin de Strapi

```
http://localhost:1337/admin
```

**Credenciales:**
- Usuario: `facopec@facopec.org`
- Contraseña: `F4c0pec@2025`

### 2. Verifica cada sección

1. **Content Manager > Single Types > Página de inicio**
   - Hero > carouselItems: Debe tener 4 items con imágenes
   - Activities: Debe tener 4 actividades con logos
   - Programs: Debe tener 13 programas con logos
   - attendedPersons: Debe tener 6 registros
   - eventCalendar: Debe tener 6 eventos

2. **Prueba modificar datos:**
   - Intenta agregar un nuevo evento al calendario
   - Intenta eliminar una persona atendida
   - Intenta cambiar una imagen del carrusel
   - Guarda y publica

3. **Refresca el frontend:**
   - Los cambios deben reflejarse inmediatamente

## ¿Por qué era necesario limpiar el CMS?

El CMS no tenía estos datos porque:

1. **Los schemas estaban incompletos**: Faltaban campos como `logo` en `program-card` y `activity-card`, y `carouselItems` en `hero`
2. **El seed no poblaba todos los datos**: Faltaban `attendedPersons`, `eventCalendar`, y `carouselItems`
3. **Datos antiguos incompatibles**: Los cambios en los schemas requieren una base de datos limpia

## Solución al problema del carrusel infinito

El problema del "espacio al final del carrusel" debería estar resuelto con el nuevo componente `carouselItems` en el hero. El frontend ahora puede consumir las imágenes directamente del CMS.

## Problemas conocidos

Si después de hacer esto sigues teniendo problemas:

1. **Verifica que el frontend esté consumiendo del CMS**:
   - Abre las herramientas de desarrollador
   - Ve a la consola
   - Verifica que no haya errores de red al llamar a la API de Strapi

2. **Verifica que los datos estén publicados**:
   - En Strapi, asegúrate de hacer clic en "Publish" después de hacer cambios
   - Los datos deben tener `publishedAt` diferente de null

3. **Limpia la caché del navegador**:
   - El frontend puede estar cacheando datos antiguos
   - Recarga con `Ctrl+Shift+R` (o `Cmd+Shift+R` en Mac)
