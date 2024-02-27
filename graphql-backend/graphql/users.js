const { GraphQLError } = require('graphql');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const typeDef = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
`;

const typeDefQueries = `
  me: User
`;

const typeDefMutations = `
  createUser(
    username: String!
    favoriteGenre: String!
  ): User

  login(
    username: String!
    password: String!
  ): Token
`;

const resolvers = {
  Query: {
    me: (roots, args, { currentUser }) => {
      return currentUser;
    }
  },
  Mutation: {
    createUser: async (roots, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre });
      
        return user.save()
          .catch(error => {
            throw new GraphQLError('Failed to save user', {
              extensions: {
                code: 'BAD_USER_INPUT',
                error
              }
            })
          })
    },
    login: async (roots, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user || password !== 'SECRET') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        }) 
      }
      const userToken = {
        username,
        id: user.id
      };
  
      return { value: jwt.sign(userToken, process.env.JWT_SECRET) };
    }
  }
}

module.exports = { typeDef, typeDefQueries, typeDefMutations, resolvers };