// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express')
require('dotenv').config();
const db = require('./db')
const models = require('./models')

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
// data
let notes = [
    { id: '1', content: 'This is a note', author: 'Adam Scott' },
    { id: '2', content: 'This is another note', author: 'Harlow Everly' },
    { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
  ];

// gql schema

const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!): Note!
    }
    
    type Mutation {
        newNote(content: String): Note!
    }
`;

// resolver
const resolvers = {
    Query: {

        hello: () => 'Hello World!',
        notes: async () => {
            return await models.Note.find()
        },

        note: async (parent, args) => {
            return await models.Note.findById(args.id)
        }
    },

    Mutation: {
        newNote: async (parent, args) => {
            // let noteValue = {
            //     id: String(notes.length + 1),
            //     content: args.content,
            //     author: 'Adam Scott'
            // }
            // notes.push(noteValue);
            // return noteValue
            return await models.Note.create({
                content: args.content,
                author: "Adam Scott"
            })
        }
    }
}

const app = express();
db.connect(DB_HOST);

//apollo server-specific settings and middle-ware

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQl middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });


app.get('/', (req, res) => res.send('Hello World!! Xiaomaozi'));
app.listen(port, () => 
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
)