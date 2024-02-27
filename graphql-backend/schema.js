const { typeDef: Authors, typeDefQueries: AuthorQueries, typeDefMutations: AuthorMutations } = require('./graphql/authors');
const { typeDef: Books, typeDefQueries: BookQueries, typeDefMutations: BookMutations } = require('./graphql/books');
const { typeDef: Users, typeDefQueries: UserQueries, typeDefMutations: UserMutations } = require('./graphql/users');
const { typeDef: Token } = require('./graphql/token');

const typeDefs = `
  ${Books}
  ${Authors}
  ${Users}
  ${Token}

  type Query {
    ${BookQueries}
    ${AuthorQueries}
    ${UserQueries}
  }

  type Mutation {
    ${BookMutations}
    ${AuthorMutations}
    ${UserMutations}
  }
`;

module.exports = typeDefs;