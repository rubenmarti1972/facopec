import type { Strapi } from '@strapi/types/dist/core';
import { seedDefaultContent } from './database/seed-content';
import syncPublicPermissions from '../config/utils/sync-public-permissions';

async function ensureSuperAdmin(strapi: Strapi) {
  try {
    const email = process.env.ADMIN_EMAIL || 'facopec@facopec.org';
    const password = process.env.ADMIN_PASSWORD || 'F4c0pec@2025';

    const authService = (strapi as any).service('admin::auth');
    const roleService = (strapi as any).service('admin::role');
    const superAdminRole = await roleService.getSuperAdmin();

    // Buscar usuario admin por email
    const existingUser = await (strapi as any).db
      .query('admin::user')
      .findOne({
        where: { email },
        populate: ['roles'],
      });

    if (!existingUser) {
      // No existe -> lo creamos desde cero como SUPER ADMIN
      const hashedPassword = await authService.hashPassword(password);

      await (strapi as any).db.query('admin::user').create({
        data: {
          email,
          firstname: 'FACOPEC',
          lastname: 'Admin',
          password: hashedPassword,
          isActive: true,
          roles: [superAdminRole.id],
        },
      });

      strapi.log.info(`✅ SUPER ADMIN creado: ${email}`);
      return;
    }

    // Sí existe -> asegurar que tenga rol SUPER ADMIN y la clave correcta
    const hasSuperAdminRole =
      Array.isArray(existingUser.roles) &&
      existingUser.roles.some(
        (r: any) => r?.id === superAdminRole.id || r?.code === 'strapi-super-admin'
      );

    const dataToUpdate: any = {};

    if (!hasSuperAdminRole) {
      dataToUpdate.roles = [superAdminRole.id];
    }

    // Forzamos la contraseña a la que tú conoces
    const hashedPassword = await authService.hashPassword(password);
    dataToUpdate.password = hashedPassword;
    dataToUpdate.isActive = true;

    await (strapi as any).db.query('admin::user').update({
      where: { id: existingUser.id },
      data: dataToUpdate,
    });

    strapi.log.info(`✅ SUPER ADMIN actualizado: ${email}`);
  } catch (error) {
    strapi.log.error('❌ Error asegurando SUPER ADMIN:', error);
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Strapi }) {
    // 1) Permisos públicos
    try {
      await syncPublicPermissions(strapi);
    } catch (error) {
      strapi.log.error('Error syncing public permissions:', error);
    }

    // 2) Asegurar que exista / se repare el SUPER ADMIN
    await ensureSuperAdmin(strapi);

    // 3) Seed de contenido (tu lógica original)
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldSeed =
      process.env.FORCE_SEED === 'true' ||
      process.env.SEED_ON_BOOTSTRAP === 'true' ||
      isProduction;

    if (process.env.SKIP_BOOTSTRAP_SEED === 'true' || !shouldSeed) {
      strapi.log.info('Skipping default content seed during bootstrap.');
      strapi.log.info('Para ejecutar el seed, usa: SEED_ON_BOOTSTRAP=true npm run develop');
      return;
    }

    try {
      const singleTypeUids = [
        'api::global.global',
        'api::organization-info.organization-info',
        'api::home-page.home-page',
        'api::donations-page.donations-page',
      ] as const;

      const singleTypeStatuses = await Promise.all(
        singleTypeUids.map(async (uid) => {
          const entry = await strapi.db
            .query(uid)
            .findOne({ select: ['id', 'publishedAt'] });

          return {
            uid,
            hasEntry: Boolean(entry?.id),
            isPublished: Boolean(entry?.publishedAt),
          };
        })
      );

      const missingSingles = singleTypeStatuses.filter(
        (entry) => !entry.hasEntry || !entry.isPublished
      );

      const publishedProjects = await strapi.db
        .query('api::project.project')
        .count({ where: { publishedAt: { $notNull: true } } });

      const hasAllSingles = missingSingles.length === 0;
      const hasProjects = publishedProjects > 0;

      if (hasAllSingles && hasProjects && !process.env.FORCE_SEED) {
        strapi.log.info(
          '✅ La base de datos ya contiene Global, Organización, Home, Donations y proyectos publicados. Omitiendo seed automático.'
        );
        if (!isProduction) {
          strapi.log.info(
            '   Para forzar el seed, usa: FORCE_SEED=true npm run develop'
          );
        }
        return;
      }

      if (missingSingles.length > 0 || !hasProjects) {
        strapi.log.warn('⚠️  Faltan datos publicados en producción. Ejecutando seed...');
        if (missingSingles.length > 0) {
          strapi.log.warn(
            `   Tipos sin publicar: ${missingSingles
              .map((entry) => entry.uid)
              .join(', ')}`
          );
        }
        if (!hasProjects) {
          strapi.log.warn('   No hay proyectos publicados en la base de datos.');
        }
      }

      strapi.log.info('🌱 Ejecutando seed inicial de contenido...');
      strapi.log.info('📦 Poblando base de datos PostgreSQL en producción...');
      await seedDefaultContent(strapi);
      strapi.log.info('✅ Seed completado exitosamente.');
      strapi.log.info('📝 Credenciales: facopec@facopec.org / F4c0pec@2025');
    } catch (error) {
      strapi.log.error(
        'Error while seeding default content during bootstrap:',
        error
      );
    }
  },
};
