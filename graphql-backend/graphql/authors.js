const Author = require('../models/author');
const Book = require('../models/book');
const { GraphQLError } = require('graphql');

const typeDef = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
`;

const typeDefQueries = `
  authorCount: Int!
  allAuthors: [Author!]!
`;

const typeDefMutations = `
  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author
`;

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {
      const authors = await Author.find({}).populate('books');

      return authors.map((author) => {
        author.bookCount = author.books.length;
        return author;
      })
    },
  },
  Mutation: {
    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: name }).populate('books');
      if (!author) {
        return null;
      }

      author.born = setBornTo;

      await author.save();
      author.bookCount = author.books.length; 

      return author;
    },
  }
};

module.exports = { typeDef, typeDefQueries, typeDefMutations, resolvers };