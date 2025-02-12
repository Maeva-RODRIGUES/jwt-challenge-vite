
import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import BookService from "../services/book.service";
import Book from "../entities/book.entity";
import { MyContext } from "..";

@Resolver()
export default class BookResolver {
  @Authorized (["MANAGER"])
  @Query(() => [Book])
  async books(@Ctx() ctx: MyContext) {
    if (!ctx.user) {
      throw new Error(
        "Vous devez être authentifié pour accéder à la liste des livres!"
      );
    }
    return await new BookService().listBooks();
  }
}