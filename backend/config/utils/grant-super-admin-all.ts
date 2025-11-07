import type { Strapi } from '@strapi/types/dist/core';

export default async function grantSuperAdminAll(strapi: Strapi): Promise<boolean> {
  const adminRoleService = strapi.service('admin::role') as
    | {
        resetSuperAdminPermissions?: () => Promise<unknown>;
      }
    | undefined;

  if (!adminRoleService?.resetSuperAdminPermissions) {
    strapi.log.warn(
      'No se pudo sincronizar automáticamente los permisos del superadministrador; servicio admin::role no disponible.'
    );
    return false;
  }

  await adminRoleService.resetSuperAdminPermissions();
  strapi.log.info('Permisos de superadministrador sincronizados con todas las acciones disponibles.');
  return true;
}
