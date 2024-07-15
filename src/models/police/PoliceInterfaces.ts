import { ITokenPayload } from "../../libs/jwt";
import { IRule } from "../rule/RuleInterface";
import { IService } from "../service/ServiceInterfaces";

export interface IPolice {
  id: string;
  serviceId: string;
  description: string;
  action: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  Service?: IService;
  Rule?: IRule[];
}

export interface IAddPolice {
  tokenPayload: ITokenPayload;
  serviceId: string;
  effect: string;
  action: string;
  description: string;
}

export interface IGetPolice {
  tokenPayload: ITokenPayload;
  id?: string;
  depth?: string;
}

export interface IListPoliceQuery {
  tokenPayload: ITokenPayload;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IListPolice {
  docs: IPolice[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IUpdatePolice {
  tokenPayload: ITokenPayload;
  id: string;
  serviceId?: string;
  description?: string;
  action?: string;
  active?: boolean;
}
