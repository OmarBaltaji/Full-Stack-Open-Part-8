import { gql } from "@apollo/client";
import { BOOK_DETAILS } from "../fragments";

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook (title: $title, author: $author, published: $published, genres: $genres) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export default ADD_BOOK;