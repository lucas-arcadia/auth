import { ITokenPayload } from "../../libs/jwt";

export interface IGet {
  tokenPayload: ITokenPayload;
  ip: string;
  companyId?: string;
  depth?: string;
  id?: string;
}

