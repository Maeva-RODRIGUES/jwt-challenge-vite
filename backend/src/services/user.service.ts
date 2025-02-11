import { Repository } from "typeorm";
import datasource from "../lib/datasource";
import User, { InputRegister } from "../entities/user.entity";

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

  async createUser({ email, password }: InputRegister) {
    const newUser = this.db.create({ email, password });
    return await this.db.save(newUser);
  }
  
}
