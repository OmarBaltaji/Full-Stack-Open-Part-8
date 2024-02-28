import { gql } from "@apollo/client";
import { AUTHOR_DETAILS } from "../fragments";

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`;

export default EDIT_AUTHOR;