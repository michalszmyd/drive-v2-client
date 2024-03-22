import { ValidationError } from "./forms/validator";

export default class Model {
  [key: string | number | symbol]: unknown;
  errors: ValidationError[];

  constructor() {
    this.errors = [];
  }

  assignAttributes(attributes: { [key: string | number | symbol]: unknown }) {
    Object.keys(attributes).forEach((key: string) => {
      this[key] = attributes[key];
    });
  }
}
