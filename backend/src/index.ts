import type { Strapi } from '@strapi/types/dist/core';
import { seedDefaultContent } from './database/seed-content';
import syncPublicPermissions from '../config/utils/sync-public-permissions';

async function ensureFreshSuperAdmin(strapi: Strapi) {
  if (process.env.CREATE_SUPERADMIN !== 'true') return;

  try {
    const adminUserService = (strapi as any).admin.services.user;
    const adminRoleService = (strapi as any).admin.services.role;

    // 1. BORRAR TODOS LOS ADMINS EXISTENTES
    const admins = await adminUserService.findMany();
    for (const admin of admins) {
      await adminUserService.delete(admin.id);
    }

    strapi.log.warn('🧹 Administradores anteriores eliminados.');

    // 2. CREAR SUPER ADMIN
    const role = await adminRoleService.findOne({ code: 'strapi-super-admin' });

    const email = process.env.ADMIN_EMAIL || 'facopec@facopec.org';
    const password = process.env.ADMIN_PASSWORD || 'F4c0pec@2025';

    await adminUserService.create({
      email,
      firstname: 'FACOPEC',
      lastname: 'Admin',
      password,
      isActive: true,
      roles: [role.id],
    });

    strapi.log.info(`✅ SUPER ADMIN creado correctamente: ${email}`);

  } catch (error) {
    strapi.log.error('❌ Error creando Super Admin:', error);
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Strapi }) {

    // Sync public permissions
    try {
      await syncPublicPermissions(strapi);
    } catch (error) {
      strapi.log.error('Error syncing public permissions:', error);
    }

    // Crear super admin real
    await ensureFreshSuperAdmin(strapi);

    // ----------------------------
    // TU SEED ORIGINAL (NO TOCADO)
    // ----------------------------

    const isProduction = process.env.NODE_ENV === 'production';
    const shouldSeed =
      process.env.FORCE_SEED === 'true' ||
      process.env.SEED_ON_BOOTSTRAP === 'true' ||
      isProduction;

    if (process.env.SKIP_BOOTSTRAP_SEED === 'true' || !shouldSeed) {
      strapi.log.info('Skipping default content seed during bootstrap.');
      return;
    }

    try {
      strapi.log.info('🌱 Ejecutando seed inicial...');
      await seedDefaultContent(strapi);
      strapi.log.info('✅ Seed completado.');
    } catch (error) {
      strapi.log.error('Error en seed:', error);
    }
  },
};
