export default class UserModel {
  id: number;
  name: string | null;

  constructor({id, name = ''}: {id: number, name?: string | null}) {
    this.id = id;
    this.name = name;
  }
}
