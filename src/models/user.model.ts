// /src/models/user.model.ts

import prisma from "../config/database";

export interface IUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  birthday: string | null;
  gender: string | null;
  schoolYear: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class UserModel {
  static async me(userId: string, companyId: string): Promise<IUser> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId, companyId },
      });

      if (!user) {
        throw new Error("User not found", { cause: { type: "not_found" } });
      }

      return {
        id: user.id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
        birthday: user.birthdate,
        gender: user.gender,
        schoolYear: user.schoolYear,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(
    companyId: string,
    name: string,
    email: string,
    phone: string | null,
    password: string,
    birthday: string | null,
    gender: string | null,
    schoolYear: string | null,
  ): Promise<IUser> {
    try {
      const result = await prisma.user.create({
        data: {
          companyId,
          name,
          email,
          phone,
          birthdate: birthday,
          gender,
          schoolYear,
          password: await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 10,
          }),
        },
      });

      return {
        id: result.id,
        companyId: result.companyId,
        name: result.name,
        email: result.email,
        birthday: result.birthdate,
        gender: result.gender,
        schoolYear: result.schoolYear,
        phone: result.phone,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAll(companyId: string, offset: number = 0, limit: number = 10, search: string = "", sort: string = "id", order: string = "asc"): Promise<IUser[]> {
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

      const results = await prisma.user.findMany({
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

      return results.map((user) => ({
        id: user.id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
        birthday: user.birthdate,
        gender: user.gender,
        schoolYear: user.schoolYear,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      }));
    } catch (error) {
      console.log("Error in UserModel.getAll", error);

      throw error;
    }
  }

  static async getById(companyId: string, userId: string): Promise<IUser> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId, companyId: companyId },
        select: {
          id: true,
          companyId: true,
          name: true,
          email: true,
          birthdate: true,
          gender: true,
          schoolYear: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found", { cause: { type: "not_found" } });
      }

      return {
        id: user.id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
        birthday: user.birthdate,
        gender: user.gender,
        schoolYear: user.schoolYear,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
