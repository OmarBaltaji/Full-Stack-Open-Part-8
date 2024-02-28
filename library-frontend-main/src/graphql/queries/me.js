import { gql } from "@apollo/client";

const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

export default ME;