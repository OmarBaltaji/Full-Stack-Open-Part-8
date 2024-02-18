const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('error connection to MongoDB ' + error.message))

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!, 
      author: String!, 
      published: Int!, 
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
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
    allAuthors: async () => {
      let authors = await Author.find({});

      authors = authors.map(async (author) => {
        author.bookCount = await Book.countDocuments({ author: author.id });
        return author;
      })

      return authors;
    },
    me: (roots, args, { currentUser }) => {
      return currentUser;
    }
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

      return author;
    },
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
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})