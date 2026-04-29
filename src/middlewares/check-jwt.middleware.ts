import { auth } from "express-oauth2-jwt-bearer";
import { ENV } from "../config/env";

const checkJwt = auth({
  audience: ENV.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${ENV.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

export default checkJwt;
