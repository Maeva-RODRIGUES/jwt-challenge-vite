import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import BookService from "../services/book.service";
import Book, { InputCreateBook } from "../entities/book.entity";
import { MyContext } from "..";

@Resolver()
export default class BookResolver {
  @Query(() => [Book])
  async books(@Ctx() ctx: MyContext) {
    return await new BookService().listBooks();
  }
  
  @Authorized()
  @Mutation(() => Book)
  async createBook(@Arg("infos") infos: InputCreateBook) {
    //? sans Authorized :
    // if (!ctx.user) {
    //   throw new Error(
    //     "Vous devez être authentifié pour accéder à la liste des livres!"
    //   );
    // }
    const newBook = await new BookService().createBook(infos);
    return newBook;
  }
}
