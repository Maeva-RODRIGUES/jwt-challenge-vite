import { Repository } from "typeorm";
import datasource from "../lib/datasource";
import User from "../entities/user.entity";

export default class UserService {
  db: Repository<User>;
  constructor() {
    this.db = datasource.getRepository(User);
  }

  async listUsers() {
    return this.db.find();
  }
  
  async findUserByEmail(email: string) {
    return await this.db.findOneBy({ email });
  }
}
