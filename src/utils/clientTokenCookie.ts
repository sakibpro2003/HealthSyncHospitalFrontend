const CLIENT_TOKEN_COOKIE = "client_token";
const ACCESS_TOKEN_COOKIE = "token";

const resolveSameSite = () =>
  process.env.NODE_ENV === "production"
    ? ["Secure", "SameSite=None"]
    : ["SameSite=Lax"];

const buildCookie = (name: string, value: string, maxAge: number) => {
  const segments = [
    `${name}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    ...resolveSameSite(),
  ];

  return segments.join("; ");
};

export const setClientTokenCookie = (
  token: string,
  maxAgeSeconds = 7 * 24 * 60 * 60
) => {
  if (typeof document === "undefined") {
    return;
  }

  const encoded = encodeURIComponent(token);
  document.cookie = buildCookie(CLIENT_TOKEN_COOKIE, encoded, maxAgeSeconds);
  // Set the main token cookie so middleware can read it
  document.cookie = buildCookie(ACCESS_TOKEN_COOKIE, encoded, maxAgeSeconds);
};

export const clearClientTokenCookie = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${CLIENT_TOKEN_COOKIE}=; Path=/; Max-Age=0`;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0`;
};

export const readClientTokenCookie = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieSource = document.cookie;
  const getValue = (name: string) => {
    const matcher = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`);
    const match = cookieSource.match(matcher);
    return match ? decodeURIComponent(match[1]) : null;
  };

  return (
    getValue(CLIENT_TOKEN_COOKIE) ?? getValue(ACCESS_TOKEN_COOKIE) ?? null
  );
};

export { CLIENT_TOKEN_COOKIE };
