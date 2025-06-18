// /src/models/company.model.ts

import prisma from "../config/database";

export interface ICompany {
  id: string;
  name: string;
  surname: string;
  ein: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface CountResult {
  count: number;
}

export class CompanyModel {
  static async create(name: string, surname: string, ein: string): Promise<ICompany> {
    try {
      const result = await prisma.company.create({
        data: {
          name: name.trim().toUpperCase(),
          surname: surname.trim().toUpperCase(),
          ein: ein.trim(),
        },
      });

      return result;
    } catch (error) {
      console.log("Error in CompanyModel.create", error);

      throw error;
    }
  }

  static async list(offset: number = 0, limit: number = 10, search: string = "", sort: string = "id", order: string = "asc"): Promise<{ rows: ICompany[]; total: number; totalNotFiltered: number }> {
    try {
      if (limit < 1) {
        throw new Error("Limit must be greater than zero", {
          cause: { type: "invalid_params" },
        });
      }

      if (offset < 0) {
        throw new Error("Offset must be greater than zero", {
          cause: { type: "invalid_params" },
        });
      }

      const result = await prisma.company.findMany({
        skip: offset,
        take: limit,
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              surname: {
                contains: search,
              },
            },
            {
              ein: {
                contains: search,
              },
            },
          ],
        },
        orderBy: {
          [sort]: order,
        },
      });

      return {
        total: result.length,
        totalNotFiltered: result.length,
        rows: result,
      };
    } catch (error) {
      console.log("Error in CompanyModel.getAll", error);

      throw error;
    }
  }

  static async update(id: string, name: string, surname: string): Promise<{ company: ICompany; updated: boolean }> {
    try {
      const company = await prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new Error("Company not found", { cause: { type: "not_found" } });
      }

      if (company.name === name && company.surname === surname) {
        return {
          company,
          updated: false,
        };
      }

      const result = await prisma.company.update({
        where: { id },
        data: {
          name,
          surname,
        },
      });

      return {
        company: result,
        updated: true,
      };
    } catch (error) {
      console.log("Error in CompanyModel.update", error);

      throw error;
    }
  }

  static async delete(id: string): Promise<{ company: ICompany; deleted: boolean }> {
    try {
      const company = await prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new Error("Company not found", { cause: { type: "not_found" } });
      }

      const result = await prisma.company.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return { company: result, deleted: true };
    } catch (error) {
      console.log("Error in CompanyModel.update", error);

      throw error;
    }
  }

  static async restore(id: string): Promise<{ company: ICompany; restored: boolean }> {
    try {
      const company = await prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new Error("Company not found", { cause: { type: "not_found" } });
      }

      if (company.deletedAt === null) {
        return {
          company,
          restored: false,
        };
      }

      const result = await prisma.company.update({
        where: { id },
        data: {
          deletedAt: null,
        },
      });

      return { company: result, restored: true };
    } catch (error) {
      console.log("Error in CompanyModel.restore", error);

      throw error;
    }
  }
}
