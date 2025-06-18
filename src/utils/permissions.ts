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
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found", { cause: { type: "not_found" } });
    }

    // Verifica se pelo menos um dos roles do usuário tem a permissão
    for (const role of user.Role) {
      const permissions = role.roles as Record<string, boolean>;
      if (permissions && permissions[permission] === true) {
        return true
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
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found", { cause: { type: "not_found" } });
    }

    // Combina todas as permissões de todos os roles do usuário
    const combinedPermissions: Record<string, boolean> = {};
    
    for (const role of user.Role) {
      const permissions = role.roles as Record<string, boolean>;
      if (permissions) {
        Object.keys(permissions).forEach(permission => {
          // Se algum role tem a permissão como true, o usuário tem a permissão
          if (permissions[permission] === true) {
            combinedPermissions[permission] = true;
          } else if (combinedPermissions[permission] === undefined) {
            combinedPermissions[permission] = false;
          }
        });
      }
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
        roles: true,
      },
    });

    if (!role) {
      throw new Error("Role not found", { cause: { type: "not_found" } });
    }

    return (role.roles as Record<string, boolean>) || {};
  } catch (error) {
    console.error("Error getting role permissions:", error);
    return {};
  }
}



