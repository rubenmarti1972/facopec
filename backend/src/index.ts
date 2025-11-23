import type { Strapi } from '@strapi/types/dist/core';
import { seedDefaultContent } from './database/seed-content';
import syncPublicPermissions from '../config/utils/sync-public-permissions';

async function ensureSuperAdmin(strapi: Strapi) {
  try {
    const adminUserService = (strapi as any).admin.services.user;
    const adminRoleService = (strapi as any).admin.services.role;

    const adminCount = await adminUserService.count();

    if (adminCount > 0) {
      strapi.log.info('👤 Ya existe al menos un usuario admin, se omite creación de SUPER ADMIN.');
      return;
    }

    strapi.log.info('⚙️ No hay administradores. Creando SUPER ADMIN por defecto...');

    const superAdminRole = await adminRoleService.findOne({
      code: 'strapi-super-admin',
    });

    const email = process.env.ADMIN_EMAIL || 'facopec@facopec.org';
    const password = process.env.ADMIN_PASSWORD || 'F4c0pec@2025';

    await adminUserService.create({
      email,
      firstname: 'FACOPEC',
      lastname: 'Admin',
      password,
      registrationToken: null,
      isActive: true,
      roles: [superAdminRole.id],
    });

    strapi.log.info(`✅ SUPER ADMIN creado correctamente (${email}).`);
  } catch (error) {
    strapi.log.error('❌ Error creando SUPER ADMIN:', error);
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Strapi }) {
    // 1) Sincronizar permisos públicos SIEMPRE
    try {
      await syncPublicPermissions(strapi);
    } catch (error) {
      strapi.log.error('Error syncing public permissions:', error);
    }

    // 2) Asegurar que exista al menos un SUPER ADMIN
    await ensureSuperAdmin(strapi);

    // 3) Lógica de seed de contenido
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
      strapi.log.info('📝 Credenciales por defecto: facopec@facopec.org / F4c0pec@2025');
    } catch (error) {
      strapi.log.error(
        'Error while seeding default content during bootstrap:',
        error
      );
    }
  },
};
