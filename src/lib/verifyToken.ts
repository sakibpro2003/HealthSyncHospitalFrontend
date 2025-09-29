// lib/verifyToken.ts
import { jwtVerify, type JWTPayload } from "jose";

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!)
    );
    return payload;
  } catch {
    return null;
  }
};
