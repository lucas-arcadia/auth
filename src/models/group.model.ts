// /src/models/group.model.ts

import { SQLiteError } from "bun:sqlite";
import db from "../config/database";
import { validateCompany, validateGroup } from "../utils/validation";
import { User, UserModel } from "./user.model";

export interface Group {
  id: number;
  name: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CountResult {
  count: number;
}

export class GroupModel {
  static async create(name: string, companyId: number): Promise<Group> {
    try {
      validateCompany(companyId);

      let stmt = db.prepare("INSERT INTO groups (name, companyId) VALUES (?, ?)");
      stmt.run(name.trim(), companyId);

      stmt = db.prepare("SELECT * FROM groups WHERE name = ? AND companyId = ?");
      const group = stmt.get(name.trim(), companyId) as Group | null;
      if (!group) {
        throw new Error("Failed to retrieve created group", {
          cause: { type: "database_error" },
        });
      }

      return group;
    } catch (error: any) {
      if (error instanceof SQLiteError && error.errno === 19) {
        throw new Error("A group with this name already exists in the company", {
          cause: { type: "duplicate" },
        });
      }

      throw error;
    }
  }

  static async getAll(companyId: number, page: number, pageSize: number, includeDeleted: boolean = false): Promise<{ groups: Group[]; total: number; page: number; pageSize: number }> {
    try {
      // Validate page and pageSize
      if (page < 1 || pageSize < 1) {
        throw new Error("Page and pageSize must be positive numbers", {
          cause: { type: "invalid_params" },
        });
      }

      validateCompany(companyId);

      // Make query
      const offset = (page - 1) * pageSize;
      const whereClause = includeDeleted ? "WHERE companyId = ?" : "WHERE companyId = ? AND deletedAt IS NULL";
      const stmtQuery = db.prepare(`SELECT * FROM groups ${whereClause} LIMIT ? OFFSET ?`);
      const totalStmt = db.prepare(`SELECT COUNT(id) as count FROM groups ${whereClause}`);
      const totalResult = totalStmt.get(companyId) as CountResult;
      const groups = stmtQuery.all(companyId, pageSize, offset) as Group[];

      return {
        groups,
        total: totalResult.count,
        page,
        pageSize,
      };
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", { cause: { type: "database_error", errno: error.errno } });
      }

      throw error;
    }
  }

  static async getById(groupId: number, companyId: number): Promise<Group> {
    try {
      validateCompany(companyId);
      const group = validateGroup(groupId, companyId);

      return group;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", { cause: { type: "database_error", errno: error.errno } });
      }
      throw error;
    }
  }

  static async update(groupId: number, name: string, companyId: number): Promise<{ group: Group; updated: boolean }> {
    try {
      validateCompany(companyId);
      const group = validateGroup(groupId, companyId);

      const hasChanges = group.name !== name.trim();
      if (hasChanges) {
        let stmt = db.prepare("UPDATE groups SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?");
        stmt.run(name.trim(), groupId);

        stmt = db.prepare("SELECT * FROM groups WHERE id = ?");
        const updatedGroup = stmt.get(groupId) as Group | null;
        if (!updatedGroup) {
          throw new Error("Failed to retrieve updated group", { cause: { type: "database_error" } });
        }

        return { group: updatedGroup, updated: true };
      }

      return { group, updated: false };
    } catch (error: any) {
      if (error instanceof SQLiteError && error.errno === 19) {
        throw new Error("A group with this name already exists in the company", {
          cause: { type: "duplicate" },
        });
      }

      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async softDelete(groupId: number, companyId: number): Promise<Group> {
    try {
      validateCompany(companyId);
      validateGroup(groupId, companyId);

      let stmt = db.prepare("SELECT id FROM users WHERE companyId = ? AND groupId = ? AND deletedAt IS NULL");
      const users = stmt.all(companyId, groupId) as { id: number }[];

      for (const user of users) {
        await UserModel.softDelete(user.id, companyId);
      }

      stmt = db.prepare("UPDATE groups SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?");
      stmt.run(groupId);

      stmt = db.prepare("SELECT * FROM groups WHERE id = ?");
      const deletedGroup = stmt.get(groupId) as Group | null;
      if (!deletedGroup) {
        throw new Error("Failed to retrieve deleted group", { cause: { type: "database_error" } });
      }

      return deletedGroup;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", { cause: { type: "database_error", errno: error.errno } });
      }

      throw error;
    }
  }

  static async restore(groupId: number, companyId: number): Promise<Group> {
    try {
      validateCompany(companyId);

      let stmt = db.prepare("SELECT * FROM groups WHERE id = ? AND companyId = ?");
      const group = stmt.get(groupId, companyId) as Group | null;
      if (!group) {
        throw new Error("Group not found", {
          cause: { type: "not_found" },
        });
      }
      if (!group.deletedAt) {
        throw new Error("Group is not deleted", {
          cause: { type: "not_deleted" },
        });
      }

      stmt = db.prepare("UPDATE groups SET updatedAt = CURRENT_TIMESTAMP, deletedAt = NULL WHERE id = ?");
      stmt.run(groupId);

      stmt = db.prepare("SELECT * FROM groups WHERE id = ?");
      const restoredGroup = stmt.get(groupId) as Group | null;
      if (!restoredGroup) {
        throw new Error("Failed to retrieve restored group", {
          cause: { type: "database_error" },
        });
      }

      return restoredGroup;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async getAllUsersBelongTo(groupId: number, companyId: number, page: number, pageSize: number, includeDeleted: boolean = false): Promise<{ users: User[]; total: number; page: number; pageSize: number }> {
    try {
      validateCompany(companyId);
      validateGroup(groupId, companyId);

      const stmt = db.prepare("SELECT * FROM users WHERE companyId = ? AND groupId = ? AND deletedAt IS NULL");
      const users = stmt.all(companyId, groupId) as User[];

      return {
        users,
        total: users.length,
        page,
        pageSize,
      };
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
