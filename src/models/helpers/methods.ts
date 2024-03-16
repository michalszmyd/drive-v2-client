import StringHelper from "../../helpers/string-helper";

export function resolveBaseURL(sourceUrl: string | null | undefined) : string | null {
  if (StringHelper.isPresent(sourceUrl) && typeof sourceUrl === "string") {
    const url = new URL(sourceUrl);
    return `${url.origin}${url.pathname}`;
  }

  return null;
}

export function getFileExt(filename: string | null | undefined) : string | null {
  const source = resolveBaseURL(filename);

  if (!source) {
    return null;
  }

  const regex = /(?:\.([^.]+))?$/;
  const result = regex.exec(source);

  return result && result[1]?.toLowerCase();
}
