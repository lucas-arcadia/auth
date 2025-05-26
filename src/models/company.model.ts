// /src/models/company.model.ts

import { SQLiteError } from "bun:sqlite";
import db from "../config/database";
import { Group, GroupModel } from "./group.model";
import { User } from "./user.model";

export interface Company {
  id: number;
  name: string;
  surname: string;
  ein: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CountResult {
  count: number;
}

export class CompanyModel {
  static async create(name: string, surname: string, ein: string) {
    try {
      let stmt = db.prepare("SELECT id FROM company WHERE ein = ?");
      let company = stmt.get(ein) as Company | null;
      if (company) {
        throw new Error("A company with this EIN already exists", {
          cause: { type: "duplicate_ein" },
        });
      }

      stmt = db.prepare("INSERT INTO Company (name, surname, ein) VALUES (?, ?, ?)");
      stmt.run(name.trim(), surname.trim(), ein.trim());

      stmt = db.prepare("SELECT * FROM company WHERE ein = ?");
      company = stmt.get(ein) as Company | null;

      if (!company) {
        throw new Error("Failed to retrieve created company", {
          cause: { type: "database_error" },
        });
      }

      return company;
    } catch (error: any ) {
      if (error instanceof SQLiteError && error.errno === 19) {
        throw new Error("A company with this EIN already exists", {
          cause: { type: "duplicate_ein" },
        });
      }
      
      throw error;
    }
  }

  static async getAll(page: number, pageSize: number, includeDeleted: boolean = false): Promise<{ companies: Company[]; total: number; page: number; pageSize: number }> {
    try {
      if (page < 1 || pageSize < 1) {
        throw new Error("Page and pageSize must be positive numbers", {
          cause: { type: "invalid_params" },
        });
      }

      const offset = (page - 1) * pageSize;
      const whereClause = includeDeleted ? "" : "WHERE deletedAt IS NULL";
      const stmt = db.prepare(`SELECT * FROM company ${whereClause} LIMIT ? OFFSET ?`);
      const totalStmt = db.prepare(`SELECT COUNT(id) as count FROM company ${whereClause}`);
      const totalResult = totalStmt.get() as CountResult;
      const companies = stmt.all(pageSize, offset) as Company[];

      return {
        companies,
        total: totalResult.count,
        page: page,
        pageSize: pageSize,
      };
    } catch (error) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async getById(companyId: number): Promise<Company> {
    try {
      const stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const company = stmt.get(companyId) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (company.deletedAt) {
        throw new Error("Company has been deleted", {
          cause: { type: "deleted" },
        });
      }

      return company;
    } catch (error) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async getByEin(ein: string): Promise<Company> {
    try {
      const stmt = db.prepare("SELECT * FROM company WHERE ein = ?");
      const company = stmt.get(ein) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (company.deletedAt) {
        throw new Error("Company has been deleted", {
          cause: { type: "deleted" },
        });
      }

      return company;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async update(companyId: number, name: string, surname: string): Promise<{ company: Company; updated: boolean }> {
    try {
      let stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const company = stmt.get(companyId) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (company.deletedAt) {
        throw new Error("Company has been deleted", {
          cause: { type: "deleted" },
        });
      }

      const hasChanges = company.name !== name || company.surname !== surname;
      if (hasChanges) {
        stmt = db.prepare("UPDATE company SET name = ?, surname = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?");
        stmt.run(name.trim(), surname.trim(), companyId);

        stmt = db.prepare("SELECT * FROM company WHERE id = ?");
        const updatedCompany = stmt.get(companyId) as Company | null;

        if (!updatedCompany) {
          throw new Error("Failed to retrieve updated company", {
            cause: { type: "database_error" },
          });
        }

        return { company: updatedCompany, updated: true };
      }

      return { company: company, updated: false };
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async softDelete(companyId: number): Promise<Company> {
    try {
      let stmt = db.prepare("SELECT id FROM company WHERE id = ?");
      let company = stmt.get(companyId) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (company.deletedAt) {
        throw new Error("Company has been deleted", {
          cause: { type: "deleted" },
        });
      }

      stmt = db.prepare("SELECT id FROM groups WHERE companyId = ?");
      const groups = stmt.all(companyId) as Group[];
      for (const group of groups) {
        await GroupModel.softDelete(group.id, companyId);
      }

      // stmt = db.prepare("SELECT id FROM users WHERE companyId = ?");
      // const users = stmt.all(companyId) as User[];
      // for (const user of users) {
      //   await UserModel.softDelete(user.id, companyId, user.groupId);
      // }

      stmt = db.prepare("UPDATE company SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?");
      stmt.run(companyId);

      stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const deletedCompany = stmt.get(companyId) as Company | null;

      if (!deletedCompany) {
        throw new Error("Failed to retrieve deleted company", {
          cause: { type: "database_error" },
        });
      }

      return deletedCompany;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async restore(companyId: number): Promise<Company> {
    try {
      let stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const company = stmt.get(companyId) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (!company.deletedAt) {
        throw new Error("Company is not deleted", {
          cause: { type: "not_deleted" },
        });
      }

      stmt = db.prepare("UPDATE company SET updatedAt = CURRENT_TIMESTAMP, deletedAt = NULL WHERE id = ?");
      stmt.run(companyId);

      stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const restoredCompany = stmt.get(companyId) as Company | null;

      if (!restoredCompany) {
        throw new Error("Failed to retrieve restored company", {
          cause: { type: "database_error" },
        });
      }

      return restoredCompany;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async getAllGrupsBelongTo(companyId: number): Promise<Group[]> {
    try {
      let stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const company = stmt.get(companyId) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (company.deletedAt) {
        throw new Error("Company has been deleted", {
          cause: { type: "deleted" },
        });
      }

      stmt = db.prepare("SELECT * FROM groups WHERE companyId = ?");
      const groups = stmt.all(companyId) as Group[];
      return groups;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async getAllUsersBelongTo(companyId: number) {
    try {
      let stmt = db.prepare("SELECT * FROM company WHERE id = ?");
      const company = stmt.get(companyId) as Company | null;
      if (!company) {
        throw new Error("Company not found", {
          cause: { type: "not_found" },
        });
      }

      if (company.deletedAt) {
        throw new Error("Company has been deleted", {
          cause: { type: "deleted" },
        });
      }

      stmt = db.prepare("SELECT * FROM users WHERE companyId = ?");
      const users = stmt.all(companyId) as User[];
      return users;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }
}
