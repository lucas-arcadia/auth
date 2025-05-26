// /src/models/user.model.ts

import { SQLiteError } from "bun:sqlite";
import db from "../config/database";
import { validateCompany, validateGroup, validateUser } from "../utils/validation";

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  phone: string;
  companyId: number;
  groupId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CountResult {
  count: number;
}

export class UserModel {
  static async create(name: string, email: string, phone: string, companyId: number, groupId: number, password: string): Promise<User> {
    try {
      validateCompany(companyId);
      validateGroup(groupId, companyId);

      // Validate password
      const hashedPassword = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 });

      // Create user
      let stmt = db.prepare("INSERT INTO users (name, email, phone, companyId, groupId, password) VALUES (?, ?, ?, ?, ?, ?)");
      stmt.run(name.trim(), email.trim(), phone.trim(), companyId, groupId, hashedPassword);

      // Retrieve created user
      stmt = db.prepare("SELECT * FROM users WHERE email = ? AND companyId = ? AND groupId = ?");
      const user = stmt.get(email, companyId, groupId) as User | null;
      if (!user) {
        throw new Error("Failed to retrieve created user", {
          cause: { type: "database_error" },
        });
      }

      return user;
    } catch (error: any) {
      if (error instanceof SQLiteError && error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("An user with this email already exists in the company", {
          cause: { type: "duplicate_email" },
        });
      }
      throw error;
    }
  }

  static async getAll(companyId: number, page: number, pageSize: number, includeDeleted: boolean = false): Promise<{ users: User[]; total: number; page: number; pageSize: number }> {
    try {
      if (page < 1 || pageSize < 1) {
        throw new Error("Page and pageSize must be positive numbers", {
          cause: { type: "invalid_params" },
        });
      }

      validateCompany(companyId);

      const offset = (page - 1) * pageSize;
      const whereClause = includeDeleted ? "WHERE companyId = ?" : "WHERE companyId = ? AND deletedAt IS NULL";
      const stmtQuery = db.prepare(`SELECT * FROM users ${whereClause} LIMIT ? OFFSET ?`);
      const totalStmt = db.prepare(`SELECT COUNT(id) as count FROM users ${whereClause}`);
      const totalResult = totalStmt.get(companyId) as CountResult;
      const users = stmtQuery.all(companyId, pageSize, offset) as User[];

      return {
        users,
        total: totalResult.count,
        page,
        pageSize,
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

  static async getById(userId: number, companyId: number): Promise<User> {
    try {
      validateCompany(companyId);

      const user = validateUser(userId, companyId);

      return user;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async update(userId: number, companyId: number, fields: Partial<{ name: string; phone: string; groupId: number; password: string }>): Promise<{ user: User; update: boolean }> {
    try {
      validateCompany(companyId);
      const user = validateUser(userId, companyId);

      const updates: string[] = [];
      const values: any[] = [];

      if (fields.name && fields.name.trim() !== user.name) {
        updates.push("name = ?");
        values.push(fields.name.trim());
      }

      if (fields.phone && fields.phone.trim() !== user.phone) {
        updates.push("phone = ?");
        values.push(fields.phone.trim());
      }

      if (fields.groupId && fields.groupId !== user.groupId) {
        validateGroup(fields.groupId, companyId);
        updates.push("groupId = ?");
        values.push(fields.groupId);
      }

      if (fields.password && fields.password.length !== 0) {
        const hashedPassword = await Bun.password.hash(fields.password, { algorithm: "bcrypt", cost: 10 });
        updates.push("password = ?");
        values.push(hashedPassword);
      }

      if (updates.length > 0) {
        updates.push("updatedAt = CURRENT_TIMESTAMP");
        values.push(userId, companyId);

        const updateQuery = updates.join(", ");
        let stmt = db.prepare(`UPDATE users SET ${updateQuery} WHERE id = ? AND companyId = ?`);
        stmt.run(...values);

        stmt = db.prepare("SELECT * FROM users WHERE id = ? AND companyId = ?");
        const updatedUser = stmt.get(userId, companyId) as User | null;
        if (!updatedUser) {
          throw new Error("Failed to update user", {
            cause: { type: "database_error" },
          });
        }
        return { user: updatedUser, update: true };
      } else {
        return { user: user, update: false };
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async softDelete(userId: number, companyId: number): Promise<User> {
    try {
      validateCompany(companyId);
      validateUser(userId, companyId); 

      let stmt = db.prepare("UPDATE users SET deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND companyId = ?");
      const result = stmt.run(userId, companyId);
      if (result.changes === 0) {
        throw new Error("Failed to delete user", {
          cause: { type: "database_error" },
        });
      }

      stmt = db.prepare("SELECT * FROM users WHERE id = ? AND companyId = ?");
      const deletedUser = stmt.get(userId, companyId) as User | null;
      if (!deletedUser) {
        throw new Error("Failed to retrieve deleted user", {
          cause: { type: "database_error" },
        });
      }

      return deletedUser;
    } catch (error: any) {
      if (error instanceof SQLiteError) {
        throw new Error("Database error", {
          cause: { type: "database_error", errno: error.errno },
        });
      }

      throw error;
    }
  }

  static async restore(userId: number, companyId: number): Promise<User> {
    try {
      validateCompany(companyId);
      
      let stmt = db.prepare("SELECT * FROM users WHERE id = ? AND companyId = ?");
      const user = stmt.get(userId, companyId) as User | null;
      if (!user) {
        throw new Error("User not found", {
          cause: { type: "not_found" },
        });
      }
      if (!user.deletedAt) {
        throw new Error("User is not deleted", {
          cause: { type: "not_deleted" },
        });
      }

      stmt = db.prepare("UPDATE users SET deletedAt = NULL WHERE id = ? AND companyId = ?");
      const result = stmt.run(userId, companyId);
      if (result.changes === 0) {
        throw new Error("Failed to restore user", {
          cause: { type: "database_error" },
        });
      }

      stmt = db.prepare("SELECT * FROM users WHERE id = ? AND companyId = ?");
      const restoredUser = stmt.get(userId, companyId) as User | null;
      if (!restoredUser) {
        throw new Error("Failed to retrieve restored user", {
          cause: { type: "database_error" },
        });
      }

      return restoredUser;
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
