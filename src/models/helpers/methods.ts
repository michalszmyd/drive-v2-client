import StringHelper from "../../helpers/string-helper";

export function resolveBaseURL(sourceUrl: string | null | undefined) : string | null {
  if (StringHelper.isPresent(sourceUrl) && typeof sourceUrl === "string") {
    const url = new URL(sourceUrl);
    return `${url.origin}${url.pathname}`;
  }

  return null;
}
