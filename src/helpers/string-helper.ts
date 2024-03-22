export default class StringHelper {
  static isBlank(string: string | null | undefined): boolean {
    return ["", undefined, null].includes(string);
  }

  static isPresent(string: string | null | undefined): boolean {
    return !StringHelper.isBlank(string);
  }

  static humanize(string: string): string {
    return string
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
