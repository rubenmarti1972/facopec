import type { Strapi } from '@strapi/types/dist/core';

const PUBLIC_ROLE_TYPE = 'public';

// List of actions to grant to the public role
const PUBLIC_PERMISSION_ACTIONS = [
  'api::global.global.find',
  'api::home-page.home-page.find',
  'api::donations-page.donations-page.find',
  'api::organization-info.organization-info.find',
  'api::project.project.find',
  'api::project.project.findOne',
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
];

export default async function syncPublicPermissions(strapi: Strapi): Promise<boolean> {
  try {
    // Find the public role
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: PUBLIC_ROLE_TYPE } });

    if (!publicRole || (publicRole.id === undefined || publicRole.id === null)) {
      strapi.log.warn('Rol público no encontrado; permisos de lectura para el sitio público no actualizados.');
      return false;
    }

    const roleId = typeof publicRole.id === 'number' ? publicRole.id : Number(publicRole.id);

    if (!Number.isFinite(roleId)) {
      strapi.log.warn('No se pudo determinar el identificador del rol público para actualizar sus permisos.');
      return false;
    }

    // Delete all existing permissions for the public role
    const existingPermissions = await strapi.db
      .query('plugin::users-permissions.permission')
      .findMany({
        where: {
          role: roleId,
        },
      });

    for (const permission of existingPermissions) {
      if (permission.id) {
        await strapi.db.query('plugin::users-permissions.permission').delete({
          where: { id: permission.id },
        });
      }
    }

    // Create new permissions
    for (const action of PUBLIC_PERMISSION_ACTIONS) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: roleId,
          publishedAt: new Date(),
        },
      });
    }

    strapi.log.info('Permisos del rol público sincronizados para exponer contenido publicado del CMS.');
    return true;
  } catch (error) {
    strapi.log.error('Error al sincronizar permisos del rol público:', error);
    return false;
  }
}
