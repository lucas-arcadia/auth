import { ITokenPayload } from "../../libs/jwt";

export interface IGet {
  tokenPayload: ITokenPayload;
  ip: string;
  id?: string;
}

