import * as jose from "jose";

export interface ITokenPayload {
  u: string;
  c: string;
  r: string;
  h: string;
  iat?: number;
  iss?: string;
  exp?: number;
}

class CSIJwt {
  private alg = process.env.JWT_ALGORITHM || "RS256";

  constructor() {}

  async sign(payload: jose.JWTPayload) {
    try {
      const privKey = await jose.importPKCS8(await Bun.file(`${import.meta.dir}/keys/private.key`).text(), this.alg);
      const secret = jose.base64url.decode(`${process.env.JWT_SECRET}`);

      const encPalyload = await new jose.EncryptJWT(payload)
        .setProtectedHeader({ alg: `${process.env.JWT_ALG}`, enc: `${process.env.JWT_ENC}` })
        .setIssuedAt(new Date().valueOf())
        .setIssuer(`${process.env.JWT_ISSUER}`)
        .setExpirationTime(`${process.env.JWT_EXPIRE}`)
        .encrypt(secret);

      const jwt = await new jose.SignJWT({ data: encPalyload }).setProtectedHeader({ alg: this.alg, typ: "JWT" }).setIssuedAt(new Date().valueOf()).setIssuer(`${process.env.JWT_ISSUER}`).setExpirationTime(`${process.env.JWT_EXPIRE}`).sign(privKey);

      return jwt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verify(jwt: string): Promise<ITokenPayload> {
    try {
      const pubKey = await jose.importSPKI(await Bun.file(`${import.meta.dir}/keys/public.key`).text(), this.alg);
      const secret = jose.base64url.decode(`${process.env.JWT_SECRET}`);

      const token = await jose.jwtVerify(jwt, pubKey, {
        issuer: `${process.env.JWT_ISSUER}`,
      });

      const { payload } = await jose.jwtDecrypt(token.payload.data as string, secret, {
        issuer: `${process.env.JWT_ISSUER}`,
      });

      return {
        u: payload.u as string,
        c: payload.c as string,
        r: payload.r as string,
        h: payload.h as string,
        iat: payload.iat,
        iss: payload.iss,
        exp: payload.exp,
      };
    } catch (error: any) {
      error.message = JSON.stringify(error); //`Invalid token`;
      throw error;
    }
  }
}

export default new CSIJwt();