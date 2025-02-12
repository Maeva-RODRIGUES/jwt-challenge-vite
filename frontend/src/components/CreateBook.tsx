import { CREATE_BOOK } from "@/requetes/mutations/book.mutations";
import {
  CreateBookMutation,
  CreateBookMutationVariables,
  InputCreateBook,
} from "@/types/graphql";
import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
function CreateBook() {
  const navigate = useNavigate();
  const [createBook] = useMutation<
    CreateBookMutation,
    CreateBookMutationVariables
  >(CREATE_BOOK, {
    onCompleted() {
      navigate("/books/list");
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as InputCreateBook;
    createBook({ variables: { infos: { title: data.title } } });
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <form onSubmit={handleSubmit}>
        <h1 className="font-bold text-lg mb-8">Ajout d'un livre</h1>
        <div>
          <input name="title" placeholder="Titre du livre" />
        </div>
        <input type="submit" />
      </form>
    </main>
  );
}

export default CreateBook;
