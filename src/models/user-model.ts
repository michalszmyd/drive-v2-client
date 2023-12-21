export default class UserModel {
  id: number | null;
  name: string | null;

  constructor({id, name = ''}: {id: number | null, name?: string | null}) {
    this.id = id;
    this.name = name;
  }
}
