import { gql } from "@apollo/client";

export const CREATE_BOOK = gql`
  mutation CreateBook($infos: InputCreateBook!) {
	  createBook(infos: $infos) {
	    id
	    title
	  }
	}
`;