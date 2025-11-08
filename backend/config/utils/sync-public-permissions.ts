import type { Strapi } from '@strapi/types/dist/core';

type PermissionMap = Record<string, { controllers: Record<string, Record<string, boolean>> }>;

const PUBLIC_ROLE_TYPE = 'public';

const PUBLIC_PERMISSIONS: PermissionMap = {
  'api::global.global': {
    controllers: {
      global: {
        find: true,
      },
    },
  },
  'api::home-page.home-page': {
    controllers: {
      'home-page': {
        find: true,
      },
    },
  },
  'api::donations-page.donations-page': {
    controllers: {
      'donations-page': {
        find: true,
      },
    },
  },
  'api::organization-info.organization-info': {
    controllers: {
      'organization-info': {
        find: true,
      },
    },
  },
  'api::project.project': {
    controllers: {
      project: {
        find: true,
        findOne: true,
      },
    },
  },
  'plugin::upload': {
    controllers: {
      'content-api': {
        find: true,
        findOne: true,
      },
    },
  },
};

export default async function syncPublicPermissions(strapi: Strapi): Promise<boolean> {
  const usersPermissions = strapi.plugin('users-permissions');
  const roleService = usersPermissions?.service('role') as
    | {
        findOne?: (id: number) => Promise<unknown>;
        updateRole?: (id: number, payload: { permissions: PermissionMap }) => Promise<unknown>;
      }
    | undefined;

  if (!roleService?.updateRole) {
    strapi.log.warn(
      'No se pudo actualizar el rol público automáticamente; servicio users-permissions::role no disponible.'
    );
    return false;
  }

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

  await roleService.updateRole(roleId, { permissions: PUBLIC_PERMISSIONS });
  strapi.log.info('Permisos del rol público sincronizados para exponer contenido publicado del CMS.');
  return true;
}
