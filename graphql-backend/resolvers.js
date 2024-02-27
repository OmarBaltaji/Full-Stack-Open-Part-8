const { resolvers: bookResolvers} = require('./graphql/books');
const { resolvers: authorResolvers} = require('./graphql/authors');
const { resolvers: userResolvers} = require('./graphql/users');

const resolvers = {
  Query: {
    ...bookResolvers.Query,
    ...authorResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...bookResolvers.Mutation,
    ...authorResolvers.Mutation,
    ...userResolvers.Mutation,
  },
}

module.exports = resolvers;