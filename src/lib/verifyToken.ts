// lib/verifyToken.ts
import { jwtVerify } from "jose";

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!)
    );
    return payload;
  } catch (error) {
    return null;
  }
};
