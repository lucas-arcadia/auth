import { ITokenPayload } from "../../libs/jwt";
import { IRule } from "../rule/RuleInterface";
import { IService } from "../service/ServiceInterfaces";

export interface IPolicy {
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

export interface IAddPolicy {
  tokenPayload: ITokenPayload;
  serviceId: string;
  effect: string;
  action: string;
  description: string;
}

export interface IGetPolicy {
  tokenPayload: ITokenPayload;
  id?: string;
  depth?: string;
}

export interface IListPolicyQuery {
  tokenPayload: ITokenPayload;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IListPolicy {
  docs: IPolicy[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IUpdatePolicy {
  tokenPayload: ITokenPayload;
  id: string;
  serviceId?: string;
  description?: string;
  action?: string;
  active?: boolean;
}
