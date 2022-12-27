export default class ReactHelper {
  static arrayToClassName = (list : string[] | string) => {
    if (typeof list === 'object') {
      return list.join(' ');
    }

    return list;
  }
}
