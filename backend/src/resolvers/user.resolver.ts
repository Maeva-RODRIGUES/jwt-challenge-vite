import { Arg, Mutation, Query, Resolver } from "type-graphql";
import UserService from "../services/user.service";
import User, {  InputLogin,
  InputRegister,
  Message,
  UserWithoutPassword,}  from "../entities/user.entity";

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
  const newUser = await new UserService().createUser(infos);
    return newUser;
}

@Query(() => Message)
async login(@Arg("infos") infos: InputLogin): Promise<Message> {
  console.log("infos", infos);
  return { success: true, message: "Connexion réussie" };
}

}
