type ObjectType = {
  [key: string | number | symbol]: string | null | undefined | number | boolean;
};

export default class ObjectHelper {
  static rejectBlank(object: ObjectType) {
    const copy = { ...object };

    Object.keys(copy).forEach((key) => {
      const value = copy[key];

      switch (value) {
        case undefined:
        case null:
        case "":
          console.log(`DELETING ${key}`)
          delete copy[key];
          break;

        default:
          break;
      }
    });

    return copy;
  }
}
