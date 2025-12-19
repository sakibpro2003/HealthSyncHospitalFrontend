import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import { decodeTokenValue, ACCESS_TOKEN_COOKIE } from './tokenCookie';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = decodeTokenValue(req.cookies[ACCESS_TOKEN_COOKIE]); // httpOnly cookie
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // send only relevant user info
    res.status(200).json({
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });
  } catch (error) {
    console.error("Invalid token", error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
