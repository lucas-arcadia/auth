// /src/models/group.model.ts

import { JsonValue } from "@prisma/client/runtime/library";
import { Company, User } from "../../generated/prisma/client";
import prisma from "../config/database";

export interface IRole {
  id: string;
  companyId: string;
  name: string;
  description: string;
  roles: JsonValue;
  notes: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Company?: Company;
  Users?: User[];
}

interface CountResult {
  count: number;
}

function transformNotes(notes: any): Record<string, string> | null {
  if (!notes) return null;
  
  // If it's an array, convert to object format
  if (Array.isArray(notes)) {
    const result: Record<string, string> = {};
    notes.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        Object.entries(item).forEach(([key, value]) => {
          result[`${key}`] = String(value);
        });
      }
    });
    return Object.keys(result).length > 0 ? result : null;
  }
  
  // If it's already an object, ensure all values are strings
  if (typeof notes === 'object') {
    const result: Record<string, string> = {};
    Object.entries(notes).forEach(([key, value]) => {
      result[key] = String(value);
    });
    return result;
  }
  
  return null;
}

export class RoleModel {
  // Create a new role

  static async create(companyId: string, name: string, description: string, roles: Record<string, boolean>, notes: Record<string, string>): Promise<IRole> {
    try {
      const role = await prisma.role.create({
        data: {
          companyId,
          name,
          description,
          roles: JSON.parse(JSON.stringify(roles)),
          notes: JSON.parse(JSON.stringify(notes)),
        },
      });

      return role;
    } catch (error) {
      throw error;
    }
  }

  // Get all roles from a company
  static async getAll(companyId: string, offset: number = 0, limit: number = 10, search: string = "", sort: string = "id", order: string = "asc"): Promise<{ total: number, totalNotFiltered: number, rows: IRole[] }> {
    try {
      const result = await prisma.role.findMany({
        skip: offset,
        take: limit,
        where: {
          companyId,
          name: {
            contains: search,
          },
        },
        orderBy: {
          [sort]: order,
        },
      });

      return {
        total: result.length,
        totalNotFiltered: result.length,
        rows: result.map(role => ({
          ...role,
          roles: role.roles as Record<string, boolean>,
          notes: transformNotes(role.notes)
        }))
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
