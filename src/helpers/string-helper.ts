export default class StringHelper {
  static isBlank(string : string | null | undefined): boolean {
    return ['', undefined, null].includes(string)
  }

  static isPresent(string : string | null | undefined): boolean {
    return !StringHelper.isBlank(string);
  }
}
