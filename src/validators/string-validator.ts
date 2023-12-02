export default class StringValidator {
  string : string;
  errors : String[];

  constructor(string : string) {
    this.string = string;
    this.errors = [];
  }

  isPresent() {
    if ([null, '', undefined].includes(this.string)) {
      this.errors.push('is_empty');
    }

    return this;
  }

  get isValid() {
    return this.errors.length === 0;
  }
}
