import { AuditTrail } from "../../libs/audit";
import jwt, { ITokenPayload } from "../../libs/jwt";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";

export async function CheckPermission(tokenPayload: ITokenPayload, ip: string, service: string, action: string): Promise<boolean> {
  try {
    const serviceIndexOf = Object.values(Services).indexOf(service as unknown as Services);
    const actionIndexOf = Object.values(Actions).indexOf(action as unknown as Actions);

    if (serviceIndexOf !== -1 && actionIndexOf !== -1) {
      const result = await checkPermission({
        tokenPayload,
        service: Object.keys(Services)[serviceIndexOf] as Services,
        action: Object.keys(Actions)[actionIndexOf] as Actions,
        prisma,
      });

      if (result) return true;
      else return false;
    } else return false;
  } catch (error) {
    new AuditTrail(
      "CheckPermission",
      "User",
      `error: ${error}`,
      tokenPayload.u,
      JSON.stringify(error),
      ip,
    );
    
    throw error;
  }
}
