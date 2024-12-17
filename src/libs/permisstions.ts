import { PrismaClient } from "@prisma/client";
import jwt, { ITokenPayload } from "./jwt";

export interface ITokenInfo {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    attempts: number;
    createdAt: Date;
    updatedAt: Date;
  };
  company: {
    id: string;
    name: string;
    surname: string;
    ein: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  rule: {
    id: string;
    name: string;
  };
}

export enum Services {
  Company = "Company",
  Ombudsman = "Ombudsman",
}

export enum Actions {
  AddCompany = "AddCompany",
  GetCompany = "GetCompany",
  ListCompanies = "ListCompany",
  UpdateCompany = "UpdateCompany",
  DeleteCompany = "DeleteCompany",

  AddService = "AddService",
  GetService = "GetService",
  ListServices = "ListService",
  UpdateService = "UpdateService",
  DeleteService = "DeleteService",

  AddContact = "AddContact",
  GetContact = "GetContact",
  ListContact = "ListContact",
  UpdateContact = "UpdateContact",
  DeleteContact = "DeleteContact",

  AddUser = "AddUser",
  GetUser = "GetUser",
  ListUsers = "ListUser",
  UpdateUser = "UpdateUser",
  DeleteUser = "DeleteUser",

  AddPolicy = "AddPolicy",
  GetPolicy = "GetPolicy",
  ListPolicies = "ListPolicy",
  UpdatePolicy = "UpdatePolicy",
  DeletePolicy = "DeletePolicy",

  AddRule = "AddRule",
  GetRule = "GetRule",
  ListRules = "ListRule",
  UpdateRule = "UpdateRule",
  DeleteRule = "DeleteRule",

  AboutMe = "AboutMe",
  GetPermission = "GetPermission",
  SetPermission = "SetPermission",
  Password = "Password",
}

export interface ICheckPermission {
  tokenPayload: ITokenPayload;
  service: Services;
  action: Actions;
  prisma: PrismaClient;
}

export async function checkPermission(input: ICheckPermission): Promise<ITokenInfo> {
  try {
    const user = await input.prisma.user.findUnique({
      where: {
        id: input.tokenPayload.u,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        hash: false,
        active: true,
        attempts: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new Error("Unauthorized. (UNF)");

    const tokenIsLoginActive = await input.prisma.userLogins.findFirst({
      where: {
        AND: [
          {
            userId: input.tokenPayload.u,
            action: "Login",
          },
          {
            expiresAt: {
              gte: new Date(Date.now()).toISOString(),
            },
          },
        ],
      },
      orderBy: {
        expiresAt: "desc",
      },
      take: 1,
    });
    if (!tokenIsLoginActive) throw new Error("Unauthorized. (ULA)");

    const company = await input.prisma.company.findUnique({
      where: {
        id: input.tokenPayload.c,
        active: true,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        ein: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!company) throw new Error("Forbidden. (CNF)");

    const rule = await input.prisma.rule.findUnique({
      where: {
        id: input.tokenPayload.r,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!rule) throw new Error("Forbidden. (RNF)");

    const police = await input.prisma.policy.findFirst({
      where: {
        action: input.action,
        Service: {
          name: input.service,
        },
        Rule: {
          some: {
            id: rule.id,
          },
        },
      },
    });
    if (!police) throw new Error("Forbidden (PNF)");

    return {
      user,
      company,
      rule,
    };
  } catch (error) {
    throw error;
  }
}
