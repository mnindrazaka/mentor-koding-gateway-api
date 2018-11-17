const express = require('express')
const app = express()
const { ApolloServer } = require('apollo-server-express')
const glue = require('schemaglue')

const { schema, resolver } = glue('./graphql')
const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver
})

app.use(express.json())
server.applyMiddleware({ app, path: '/graphql' })

app.listen(3000, () => {
  console.log('server listening')
})
