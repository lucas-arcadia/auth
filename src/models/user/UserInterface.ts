import { ITokenPayload } from "../../libs/jwt";
import { Actions, Services } from "../../libs/permisstions";
import { ICompany } from "../company/CompanyInterfaces";
import { IRule } from "../rule/RuleInterface";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  hash?: string;
  attempts: number;
  active: boolean;
  companyId: string;
  ruleId: string;
  createdAt: Date;
  updatedAt: Date;
  Company?: ICompany;
  Rule?: IRule;
}

export interface IAddUser {
  tokenPayload: ITokenPayload;
  email: string;
  name: string;
  password: string;
  phone: string;
  companyId: string;
  ruleId: string;
}

export interface IGetUser {
  tokenPayload: ITokenPayload;
  id?: string;
  companyId?: string;
  depth?: string;
}

export interface IListUserQuery {
  tokenPayload: ITokenPayload;
  companyId?: string;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IListUser {
  docs: IUser[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IUpdateUser {
  tokenPayload: ITokenPayload;
  id: string;
  name?: string;
  phone?: string;
  active?: boolean;
  attempts?: number;
  ruleId?: string;
  companyId?: string;
}

export interface IUserPermissionQuery {
  service: Services;
  action: Actions;
}

export interface IChangePassword {
  tokenPayload: ITokenPayload;
  id: string;
  oldPassword: string;
  newPassword: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}
