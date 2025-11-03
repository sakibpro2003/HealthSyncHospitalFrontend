const FALLBACK_IMAGE = "/image.png";

const isAllowedAbsolute = (value: string) =>
  /^https?:\/\//i.test(value) ||
  value.startsWith("data:") ||
  value.startsWith("blob:");

/**
 * Normalises potentially malformed image URLs coming from the API so they
 * always resolve to a valid path for the Next.js Image component.
 */
export const resolveImageSrc = (rawValue?: string | null): string => {
  if (typeof rawValue !== "string") {
    return FALLBACK_IMAGE;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return FALLBACK_IMAGE;
  }

  const normalised = trimmed.replace(/\\/g, "/");

  if (isAllowedAbsolute(normalised)) {
    return normalised;
  }

  if (normalised.startsWith("//")) {
    return `https:${normalised}`;
  }

  if (normalised.startsWith("/")) {
    return normalised;
  }

  return `/${normalised.replace(/^\.?\/?/, "")}`;
};
