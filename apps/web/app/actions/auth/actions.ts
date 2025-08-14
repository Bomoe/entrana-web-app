'use server'

import { db } from '@workspace/db/db'
import {
  permissionsTable,
  rolePermissionsTable,
  rolesTable,
  userRoles,
} from '@workspace/db/schema'
import { Permissions } from '@workspace/db/schemaTypes'
import { and, eq, isNull } from 'drizzle-orm'

export async function getUserPermissions({
  userId,
}: {
  userId: string
}): Promise<Set<Permissions>> {
  const userRolesWithPermissions = await db
    .select({
      permission: permissionsTable.permission,
    })
    .from(userRoles)
    .leftJoin(rolesTable, eq(userRoles.roleId, rolesTable.id))
    .leftJoin(
      rolePermissionsTable,
      eq(rolesTable.id, rolePermissionsTable.roleId)
    )
    .leftJoin(
      permissionsTable,
      eq(rolePermissionsTable.permissionId, permissionsTable.id)
    )
    .where(
      and(
        eq(userRoles.userId, userId),
        isNull(userRoles.deletedAt),
        isNull(rolesTable.deletedAt),
        isNull(rolePermissionsTable.deletedAt),
        isNull(permissionsTable.deletedAt)
      )
    )

  const permissions: Set<Permissions> = new Set()
  for (const row of userRolesWithPermissions) {
    if (row.permission) {
      permissions.add(row.permission)
    }
  }

  return permissions
}
