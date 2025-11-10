# Cambiar a PostgreSQL

## 1. Instala PostgreSQL en tu Mac

```bash
brew install postgresql@14
brew services start postgresql@14
```

## 2. Crea la base de datos

```bash
createdb strapi_facopec
```

## 3. Actualiza el .env

Edita `backend/.env` y cambia:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi_facopec
DATABASE_USERNAME=tu_usuario_mac
DATABASE_PASSWORD=
DATABASE_SSL=false
```

## 4. Limpia y reinicia

```bash
rm -rf .tmp .cache build
pnpm run build
pnpm run develop
```

PostgreSQL no tendrá los problemas de registros corruptos de SQLite.
