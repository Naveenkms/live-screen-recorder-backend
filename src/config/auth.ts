import jksClient from "jwks-rsa";
import { ENV } from "./env";

export const jwksClient = jksClient({
  jwksUri: `https://${ENV.AUTH0_DOMAIN}/.well-known/jwks.json`,
});
