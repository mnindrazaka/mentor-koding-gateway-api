const express = require('express')
const app = express()
const cors = require('cors')
const verifyToken = require('./middlewares/verifyToken')

app.use(cors())
app.use(express.json())
app.use(verifyToken)

app.listen(process.env.PORT || 3000, () => {
  console.log('server listening')
})

const schemaglue = require('schemaglue')
const { ApolloServer } = require('apollo-server-express')

const { schema, resolver } = schemaglue('./graphql/schemas')
const context = require('./graphql/context')
const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
  context
})

server.applyMiddleware({ app, path: '/graphql' })
