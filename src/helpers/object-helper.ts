import StringHelper from "./string-helper";

type ObjectType = {[key: string | number | symbol]: any};

export default class ObjectHelper {
  static rejectBlank(object: ObjectType) {
    const copy = {...object};

    Object.keys(copy).forEach((key) => {
      StringHelper.isBlank(copy[key]) && delete copy[key]
    });

    return copy;
  }
}
