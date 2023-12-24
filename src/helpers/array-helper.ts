export default class ArrayHelper {
  static isAny(array: Array<any>) {
    return array.length > 0;
  }

  static isEmpty(array: Array<any>) {
    return array.length === 0;
  }
}
