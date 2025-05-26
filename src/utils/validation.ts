// /src/utils/validation.ts

import db from "../config/database";
import { Company } from "../models/company.model";
import { Group } from "../models/group.model";
import { User } from "../models/user.model";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateLoginFields(email: string, password: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Invalid email address" });
  }
  if (!password || password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" });
  }

  return errors;
}

export function validateCompany(companyId: number): Company {
  try {
    const stmt = db.prepare("SELECT * FROM company WHERE id = ?");
    const company = stmt.get(companyId) as Company | null;
    if (!company) {
      throw new Error("Company not found", { cause: { type: "not_found" } });
    }
    if (company.deletedAt) {
      throw new Error("Company has been deleted", { cause: { type: "deleted" } });
    }

    return company;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function validateCompanyFields(name: string, surname: string, ein?: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (name.length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  } else if (!/^[A-Za-zÀ-ÿ0-9 !@#$%^&*()_+= -]+$/.test(name)) {
    errors.push({ field: "name", message: "Name must contain only letters, numbers, and spaces" });
  }

  if (surname.length > 100) {
    errors.push({ field: "surname", message: "Surname must be less than 100 characters" });
  } else if (!/^[A-Za-zÀ-ÿ0-9 !@#$%^&*()_+= -]+$/.test(surname)) {
    errors.push({ field: "surname", message: "Surname must contain only letters, numbers, and spaces" });
  }

  if (ein != undefined) {
    if (ein.length != 14) {
      errors.push({ field: "ein", message: "EIN must be 14 characters long" });
    } else if (!/^[0-9]+$/.test(ein)) {
      errors.push({ field: "ein", message: "EIN must contain only numbers" });
    }
  }

  return errors;
}

export function validateGroup(groupId: number, companyId: number): Group {
  try {
    const stmt = db.prepare("SELECT * FROM groups WHERE id = ? AND companyId = ?");
    const group = stmt.get(groupId, companyId) as Group | null;
    if (!group) {
      throw new Error("Group not found", {
        cause: { type: "not_found" },
      });
    }
    if (group.deletedAt) {
      throw new Error("Group has been deleted", {
        cause: { type: "deleted" },
      });
    }

    return group;
  } catch (error) {
    throw error;
  }
}

export function validateGroupFields(name?: string, companyId?: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (name && name.length > 50) {
    errors.push({ field: "name", message: "Name must not exceed 50 characters" });
  } else if (name && !/^[A-Za-zÀ-ÿ0-9 !@#$%^&*()_+= -]+$/.test(name)) {
    errors.push({ field: "name", message: "Name must contain only alphanumeric characters and spaces" });
  }

  if (companyId && companyId < 1) {
    errors.push({ field: "companyId", message: "Company ID must be a positive number" });
  }

  return errors;
}

export function validateUser(userId: number, companyId: number, groupId?: number): User {
  try {
    const whereClause = groupId ? "WHERE id = ? AND companyId = ? AND groupId = ?" : "WHERE id = ? AND companyId = ?";  
    const stmt = db.prepare(`SELECT * FROM users ${whereClause}`);
    
    let user: User | null;
    if (groupId) {
      user = stmt.get(userId, companyId, groupId) as User | null;
    } else {
      user = stmt.get(userId, companyId) as User | null;
    }
    if (!user) {
      throw new Error("User not found", { cause: { type: "not_found" } });
    }
    if (user.deletedAt) {
      throw new Error("User has been deleted", { cause: { type: "deleted" } });
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export function validateUserFields(companyId: number, groupId?: number, name?: string, email?: string, phone?: string, password?: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (name && name.length > 100) {
    errors.push({ field: "name", message: name ? "Name must not exceed 100 characters" : "Name is required" });
  } else if (name && !/^[A-Za-zÀ-ÿ0-9 !@#$%^&*()_+= -]+$/.test(name)) {
    errors.push({ field: "name", message: "Name must contain only alphanumeric characters and spaces" });
  }

  if (email && email.length > 100) {
    errors.push({ field: "email", message: "Email must not exceed 100 characters" });
  } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Invalid email address" });
  }

  if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
    errors.push({ field: "phone", message: "Invalid phone number format (e.g., +1234567890)" });
  }

  if (!companyId || companyId < 1) {
    errors.push({ field: "companyId", message: "Company ID must be a positive number" });
  }

  if (groupId && groupId < 1) {
    errors.push({ field: "groupId", message: "Group ID must be a positive number" });
  }

  if (password !== undefined && password.length > 0 && password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" });
  }

  return errors;
}
