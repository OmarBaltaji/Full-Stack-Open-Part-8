import { gql } from "@apollo/client";
import { BOOK_DETAILS } from "../fragments";

const ALL_BOOKS = gql`
  query allBooks($genre: String, $author: String) {
    allBooks (genre: $genre, author: $author) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export default ALL_BOOKS;