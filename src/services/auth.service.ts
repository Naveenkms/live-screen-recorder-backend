import jwt, { JwtPayload } from "jsonwebtoken";
import { jwksClient } from "../config/auth";
import { ENV } from "../config/env";

export function getKey(header: any, callback: any) {
  console.log("Header:", header);
  jwksClient.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    console.log("Signing key:", signingKey);
    callback(null, signingKey);
  });
}

export function verifyToken(
  token: string,
): Promise<string | JwtPayload | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: ENV.AUTH0_AUDIENCE,
        issuer: `https://${ENV.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      },
    );
  });
}
