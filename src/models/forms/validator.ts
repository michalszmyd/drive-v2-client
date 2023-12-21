import StringHelper from "../../helpers/string-helper";

export class ValidationError {
  field: string;
  message: string

  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }
}

export default class Validator {
  errors: ValidationError[];

  constructor() {
    this.errors = [];
  }

  isValid = () => {
    return this.errors.length === 0;
  }

  validatePresenceOf(column: string, value: string) {
    if (StringHelper.isPresent(value)) {
      return;
    }

    this.errors.push(new ValidationError(column, "is empty"));
  }
}
