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
  imutable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  User?: IUser[];
  Contact?: IContact[];
  Service?: IService[];
}

export interface IAddCompany {
  tokenPayload: ITokenPayload;
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

export interface IGetCompany {
  tokenPayload: ITokenPayload;
  companyId?: string;
  depth?: string;
}

export interface IListCompanyQuery {
  tokenPayload: ITokenPayload;
  depth?: string;
  limit?: string;
  page?: string;
  sort?: string;
  where?: string;
}

export interface IListCompany {
  docs: ICompany[],
  totalDocs: number,
  limit: number,
  totalPages: number,
  page: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  prevPage: number | null,
  nextPage: number | null,
}

export interface IUpdateCompany {
  tokenPayload: ITokenPayload;
  companyId?: string;
  name?: string;
  surname?: string;
}