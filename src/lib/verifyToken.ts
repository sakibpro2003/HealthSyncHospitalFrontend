import { decodeTokenValue } from "@/utils/tokenCookie";
// lib/verifyToken.ts
import { jwtVerify, type JWTPayload } from "jose";

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  const normalizedToken = decodeTokenValue(token);
  if (!normalizedToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      normalizedToken,
      new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!)
    );
    return payload;
  } catch {
    return null;
  }
};
