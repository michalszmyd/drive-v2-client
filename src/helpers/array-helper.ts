export default class ArrayHelper {
  static isAny(array: Array<unknown>) {
    return array.length > 0;
  }

  static isEmpty(array: Array<unknown>) {
    return array.length === 0;
  }
}
