import { ITokenPayload } from "../../libs/jwt";
import { IContact } from "../contact/ContactInterfaces";
import { IService } from "../service/ServiceInterfaces";
import { IUser } from "../user/UserInterface";

export interface ICompany {
  id: string;
  name: string;
  surname: string;
  ein: string;
  active?: boolean;
  readOnly?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  User?: IUser[];
  Contact?: IContact[];
  Service?: IService[];
}

export interface IAddCompany {
  tokenPayload: ITokenPayload;
  ip: string;
  company: {
    name: string;
    surname: string;
    ein: string;
  };
  user: {
    email: string;
    name: string;
    password: string;
    phone: string;
  };
}

export interface IUpdateCompany {
  tokenPayload: ITokenPayload;
  ip: string;
  companyId?: string;
  name?: string;
  surname?: string;
  active?: boolean;
}