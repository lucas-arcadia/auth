import { ITokenPayload } from "../../libs/jwt";
import { IPolice } from "../police/PoliceInterfaces";
import { IUser } from "../user/UserInterface";

export interface IRule {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Police?: IPolice[];
  user?: IUser[];
}

export interface IAddRule {
  tokenPayload: ITokenPayload;
  name: string;
  description: string;
}

export interface IGetRule {
  tokenPayload: ITokenPayload;
  id?: string;
  depth?: string;
}

export interface IUpdateRule {}

export interface IListRuleQuery {
  tokenPayload: ITokenPayload;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IListRule {
  docs: IRule[],
  totalDocs: number,
  limit: number,
  totalPages: number,
  page: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  prevPage: number | null,
  nextPage: number | null,
}

export interface IRuleUpdate {
  tokenPayload: ITokenPayload;
  id: string;
  name?: string;
  description?: string;
}