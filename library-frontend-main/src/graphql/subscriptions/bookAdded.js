import { BOOK_DETAILS } from "../fragments";
import { gql } from "@apollo/client";

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export default BOOK_ADDED;