export const ACCESS_TOKEN_COOKIE = "token";
export const CLIENT_TOKEN_COOKIE = "client_token";

export const decodeTokenValue = (
  rawToken?: string | null
): string | null => {
  if (!rawToken) {
    return null;
  }

  try {
    return decodeURIComponent(rawToken);
  } catch {
    return rawToken;
  }
};
