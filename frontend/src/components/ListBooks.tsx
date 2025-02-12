//frontend/src/components/ListBooks.tsx
import { LIST_BOOKS } from "@/requetes/queries/books.queries";
import { BooksQuery, BooksQueryVariables } from "@/types/graphql";
import { useQuery } from "@apollo/client";

function ListBooks() {
  const { data } = useQuery<BooksQuery, BooksQueryVariables>(LIST_BOOKS, {
    fetchPolicy: "no-cache",
  });
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <ul className="list-decimal">
        {data?.books.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </main>
  );
}

export default ListBooks;