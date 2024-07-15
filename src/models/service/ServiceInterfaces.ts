import { ITokenPayload } from "../../libs/jwt";
import { ICompany } from "../company/CompanyInterfaces";
import { IPolice } from "../police/PoliceInterfaces";

export interface IService {
  id: string;
  name: string;
  description: string;
  active: boolean;
  imutable: boolean;
  createdAt: Date;
  updatedAt: Date;
  Company?: ICompany[];
  Police?: IPolice[];
}

export interface IAddService {
  tokenPayload: ITokenPayload;
  name: string;
  description: string;
}

export interface IGetService {
  tokenPayload: ITokenPayload;
  id?: string;
  companyId?: string;
  depth?: string;
}

export interface IListServiceQuery {
  tokenPayload: ITokenPayload;
  companyId?: string;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IListService {
  docs: IService[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IUpdateService {
  tokenPayload: ITokenPayload;
  depth?: string;
  id: string;
  name?: string;
  description?: string;
  active?: boolean;
  Company?: {
    id: string;
  }[];
  Police?: {
    id: string;
  }[];
}
