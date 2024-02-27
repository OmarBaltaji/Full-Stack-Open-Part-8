const Book = require('../models/book');
const Author = require('../models/author');
const { GraphQLError } = require('graphql');

const typeDef = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }
`;

const typeDefQueries = `
  bookCount: Int!
  allBooks(author: String, genre: String): [Book!]!
`;

const typeDefMutations = `
  addBook(
    title: String!, 
    author: String!, 
    published: Int!, 
    genres: [String!]!
  ): Book
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (roots, { author, genre }) => {
      let books = Book.find({});

      if (author) {
        const foundAuthor = await Author.findOne({ name: author })
        books = books.find({ author: foundAuthor.id });
      }

      if (genre) {
        books = books.find({ genres: genre });
      }

      return books.populate('author');
    },
  },
  Mutation: {
    addBook: async (root, { title, author, published, genres }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
  
      let bookAuthor = await Author.findOne({ name: author });
      if (!bookAuthor) {
        try {
          bookAuthor = new Author({ name: author });
          await bookAuthor.save();
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: author,
              error,
            }
          })
        }
      }
      
      const newBook = new Book({ title, published, genres, author: bookAuthor });
      return newBook.save().catch(error => {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title,
            error,
          }
        })
      })
    },
  }
}

module.exports = { typeDef, typeDefQueries, typeDefMutations, resolvers };