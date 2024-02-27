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
      let authors = await Author.find({});

      authors = authors.map(async (author) => {
        author.bookCount = await Book.countDocuments({ author: author.id });
        return author;
      })

      return authors;
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

      const author = await Author.findOne({ name: name });
      if (!author) {
        return null;
      }

      author.born = setBornTo;

      await author.save();
      author.bookCount = await Book.countDocuments({ author: author.id }); 

      return author;
    },
  }
};

module.exports = { typeDef, typeDefQueries, typeDefMutations, resolvers };