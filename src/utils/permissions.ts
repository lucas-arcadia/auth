// /src/utils/permissions.ts

import { PrismaClient } from "../../generated/prisma/client";

// Verifica se um usuário específico tem uma permissão específica
export async function userHasPermission(userId: string, permission: string): Promise<boolean> {
  try {
    const prisma = new PrismaClient();

    // Busca o usuário com seus roles
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        Role: {
          select: {
            Policy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found", { cause: { type: "not_found" } });
    }

    // Verificar todas as policies do role
    for (const policy of user.Role.Policy) {
      const permissionsString = policy.name || '';
      const permissions = permissionsString.split(',').map(p => p.trim());
      if (permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }


}

// Retorna todas as permissões do usuário (união de todos os seus roles)
export async function getUserPermissions(userId: string): Promise<Record<string, boolean>> {
  try {
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Role: {
          select: {
            Policy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found", { cause: { type: "not_found" } });
    }

    // Combina todas as permissões de todos os roles do usuário
    const combinedPermissions: Record<string, boolean> = {};
    
    // Verificar todas as policies do role
    for (const policy of user.Role.Policy) {
      const permissionsString = policy.name || '';
      const permissions = permissionsString.split(',').map(p => p.trim());
      permissions.forEach(permission => {
        if (permission) {
          combinedPermissions[permission] = true;
        }
      });
    }

    return combinedPermissions;
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return {};
  }
}

// Verifica múltiplas permissões de uma vez
export async function userHasPermissions(userId: string, permissions: string[]): Promise<Record<string, boolean>> {
  try {
    const userPermissions = await getUserPermissions(userId);
    
    const result: Record<string, boolean> = {};
    permissions.forEach(permission => {
      result[permission] = userPermissions[permission] === true;
    });
    
    return result;
  } catch (error) {
    console.error("Error checking user permissions:", error);
    return permissions.reduce((acc, permission) => {
      acc[permission] = false;
      return acc;
    }, {} as Record<string, boolean>);
  }
}

// Obter permissões de um role específico
export async function getPermissions(roleId: string): Promise<Record<string, boolean>> {
  try {
    const prisma = new PrismaClient();
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
      },
      select: {
        Policy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error("Role not found", { cause: { type: "not_found" } });
    }

    const result: Record<string, boolean> = {};
    
    // Verificar todas as policies do role
    for (const policy of role.Policy) {
      const permissionsString = policy.name || '';
      const permissions = permissionsString.split(',').map(p => p.trim());
      permissions.forEach(permission => {
        if (permission) {
          result[permission] = true;
        }
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error getting role permissions:", error);
    return {};
  }
}



