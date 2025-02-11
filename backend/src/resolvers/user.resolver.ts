import { Arg, Mutation, Query, Resolver } from "type-graphql";
import UserService from "../services/user.service";
import User, { InputRegister, UserWithoutPassword }  from "../entities/user.entity";

@Resolver()
export default class UserResolver {
  @Query(() => [User])
  async users() {
    return await new UserService().listUsers();
  }

  @Mutation(() => UserWithoutPassword)
  async register(@Arg("infos") infos: InputRegister){
    console.log("Mes infos => ", infos);
    const user = await new UserService().findUserByEmail(infos.email);
    if (user) {
      throw new Error("Cet email est déjà pris!");
  }
}





}
