import * as argon2 from "argon2";
import { SignJWT } from "jose";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import UserService from "../services/user.service";
import User, {  CheckTokenInfos,
  InputLogin,
  InputRegister,
  Message,
  UserWithoutPassword,}  from "../entities/user.entity";
import { MyContext } from "../index";
import Cookies from "cookies";


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
  async login(@Arg("infos") infos: InputLogin, @Ctx() ctx: MyContext) {
    const user = await new UserService().findUserByEmail(infos.email);
    if (!user) {
      throw new Error("Vérifiez vos informations");
    }
    const isPasswordValid = await argon2.verify(user.password, infos.password);
    const m = new Message();
    if (isPasswordValid) {
      const token = await new SignJWT({ email: user.email })
        .setProtectedHeader({ alg: "HS256", typ: "jwt" })
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`));

      let cookies = new Cookies(ctx.req, ctx.res);
      cookies.set("token", token, { httpOnly: true });

      m.message = "Bienvenue!";
      m.success = true;
    } else {
      m.message = "Vérifiez vos informations";
      m.success = false;
    }
    return m;
  }

  @Query(() => Message)
  async logout(@Ctx() ctx: MyContext) {
    if (ctx.user) {
      let cookies = new Cookies(ctx.req, ctx.res);
      cookies.set("token"); //sans valeur, le cookie token sera supprimé
    }
    const m = new Message();
    m.message = "Vous avez été déconnecté";
    m.success = true;
    
    return m;
  }

  @Query(() => CheckTokenInfos, { nullable: true })
  async checkToken(@Ctx() ctx: MyContext) {
    return ctx.user ? { email: ctx.user.email } : null;
  }


}
