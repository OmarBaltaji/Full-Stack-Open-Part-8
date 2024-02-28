import { gql } from "@apollo/client";
import { AUTHOR_DETAILS } from "../fragments";

const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`;

export default ALL_AUTHORS;