const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if(!(args.author || args.genre)){
        return await Book.find({}).populate('author', { name: 1 })
      }
      //filters
      let author = (args.author ? await Author.find({ name: args.author }) : null)
      if(author !== null && !author.length) {
        //author not found, return empty
        return []
      }
      const genre = (args.genre ? args.genre : null)
      if(author && genre) {
        return await Book.find({ author: author[0]._id, genres: genre }).populate('author', { name: 1 })
      }
      else if(author){
        return await Book.find({ author: author[0]._id }).populate('author', { name: 1 })
      }
      else if(genre){
        return await Book.find({ genres: genre}).populate('author', { name: 1 })
      }
      return []
    },
    allAuthors: async () => {
      return Author.find({})
    },
    allGenres: async () => {
      const result = await Book.find().distinct('genres')
      return result
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async ({ name }) => {
      const author = await Author.find({ name: name })
      const id = author[0]._id
      const ownBooks = await Book.find({ author: id })
      return ownBooks.length
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if(!currentUser){
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      let author = await Author.findOne({ name: args.author })
      if(!author){
        const newAuthor = new Author({ name: args.author })
        try{
          await newAuthor.save()
        }
        catch(error){
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
        author = newAuthor
      }
      const book = new Book({ ...args, author: author.id })
      try{
        await book.save()
      } catch(error){
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      const returnedBook = await Book.findById(book._id).populate(('author'))

      pubsub.publish('BOOK_ADDED', { bookAdded: returnedBook })

      return returnedBook
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if(!currentUser){
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      try{
        user.save()
      } catch(error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers