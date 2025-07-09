import { jwtDecode } from "jwt-decode";

// export interface ITokenPayload {
//   userId: string;
//   name: string;
//   email: string;
//   role: string;
//   iat: number;
//   exp: number;
// }

/**
 * Decodes a token and optionally stores the decoded data in localStorage.
 */
export const getDecodedToken = (token: string) => {
  try {
    if (!token) return null;

    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

    // Check if token is expired
    // if (decoded.exp * 1000 < Date.now()) {
    //   console.warn("Token expired");
    //   return null;
    // }

    // ✅ Save decoded token to localStorage
    localStorage.setItem("user", JSON.stringify(decoded));

    return decoded;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};
