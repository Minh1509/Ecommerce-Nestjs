export class User {
  userId: string;
  username: string;
  roles: string[];

  constructor(userId: string, username: string, roles: string[]) {
    this.userId = userId;
    this.username = username;
    this.roles = roles;
  }
}
