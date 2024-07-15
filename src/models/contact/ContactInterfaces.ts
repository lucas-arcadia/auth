import { ITokenPayload } from "../../libs/jwt";
import { ICompany } from "../company/CompanyInterfaces";

export interface IContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  Company?: ICompany;
}

export interface IAddContact {
  tokenPayload: ITokenPayload;
  name: string;
  email: string;
  phone: string;
  companyId?: string;
}

export interface IGetContact {
  tokenPayload: ITokenPayload;
  id?: string;
  companyId?: string;
  depth?: string;
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

export interface IListContact {
  docs: IContact[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IUpdateContact {
  tokenPayload: ITokenPayload;
  companyId?: string;
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}
