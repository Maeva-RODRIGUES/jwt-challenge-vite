import { Repository } from "typeorm";
import datasource from "../lib/datasource";
import Book, { InputCreateBook } from "../entities/book.entity";

export default class BookService {
  db: Repository<Book>;
  bookRepository: any;
  constructor() {
    this.db = datasource.getRepository(Book);
  }

  async listBooks(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async createBook({ title }: InputCreateBook) {
    const newBook = this.db.create({ title });
    return await this.db.save(newBook);
}

}
