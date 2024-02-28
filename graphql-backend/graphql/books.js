const Book = require('../models/book');
const Author = require('../models/author');
const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const pubSub = new PubSub();

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

const typeDefSubscriptions = `
  bookAdded: Book!
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
  
      let bookAuthor;
      try {
        bookAuthor = await Author.findOneAndUpdate(
          { name: author },
          { $setOnInsert: { name: author } },
          { upsert: true, new: true }
        );
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: author,
            error,
          }
        })
      }
      
      const newBook = new Book({ title, published, genres, author: bookAuthor });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title,
            error,
          }
        })
      }

      try {
        await Author.updateOne({ _id: bookAuthor._id }, { $push: { books: newBook._id } });
      } catch (error) {
        throw new GraphQLError('Failed adding book for author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: newBook.title,
            error,
          }
        })
      }

      pubSub.publish('BOOK_ADDED', { bookAdded: newBook });
      return newBook;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = { typeDef, typeDefQueries, typeDefMutations, typeDefSubscriptions, resolvers };