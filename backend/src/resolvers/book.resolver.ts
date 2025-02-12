import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import BookService from "../services/book.service";
import Book, { InputCreateBook } from "../entities/book.entity";
import { MyContext } from "..";

@Resolver()
export default class BookResolver {
  @Authorized()
  @Query(() => [Book])
  async books(@Ctx() ctx: MyContext) {
    //? sans Authorized : 
    // if (!ctx.user) {
    //   throw new Error(
    //     "Vous devez être authentifié pour accéder à la liste des livres!"
    //   );
    // }
    return await new BookService().listBooks();
  }

  @Mutation(() => Book)
  async createBook(@Arg("infos") infos: InputCreateBook) {
    const newBook = await new BookService().createBook(infos);
    return newBook;
  }
}

