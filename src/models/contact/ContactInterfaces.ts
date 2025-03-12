import { ITokenPayload } from "../../libs/jwt";
import { ICompany } from "../company/CompanyInterfaces";

export interface IAddContact {
  tokenPayload: ITokenPayload;
  ip: string;
  name: string;
  email: string;
  phone: string;
  companyId?: string;
}

export interface IListContactQuery {
  tokenPayload: ITokenPayload;
  companyId?: string;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IUpdateContact {
  tokenPayload: ITokenPayload;
  ip: string;
  companyId?: string;
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}
