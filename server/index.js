const express = require('express')
const cors = require('cors')
const app = express()
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
} = require('graphql')

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

const authors = [
    { id: 1, name: "John" },
    { id: 2, name: "Jack" },
    { id: 3, name: "Jason" },
]

const books = [
    { id: 1, name: "book1", authorId: 1 },
    { id: 2, name: "book2", authorId: 1 },
    { id: 3, name: "book3", authorId: 3 },
    { id: 4, name: "book4", authorId: 1 },
    { id: 5, name: "book5", authorId: 3 },
    { id: 6, name: "book6", authorId: 2 },
    { id: 7, name: "book7", authorId: 2 },
    { id: 8, name: "book8", authorId: 3 },
]

const authorType = new GraphQLObjectType({
    name: 'author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLString) },
        author: {
            type: new GraphQLNonNull(authorType),
            resolve: (book) => authors.find(author => author.id === book.authorId)
        }
    })
})

const rootQuery = new GraphQLObjectType({
    name: 'query',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLInt } },
            resolve: (parent, args) => books.find((book) => book.id == args.id)
        },
        author: {
            type: authorType,
            args: { id: { type: GraphQLInt } },
            resolve: (parent, args) => authors.find((author) => author.id == args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(authorType),
            resolve: () => authors
        }
    })
})

const rootMutation = new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(book);
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(3001, () => {
    console.log("Server running on port 3001");
})