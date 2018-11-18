const axios = require('axios')
const { userApi } = require('../../../config/api')
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server-express')

module.exports.resolver = {
  Query: {
    users: async (parent, args, context) => {
      if (context.data) {
        const { data } = await axios.get(`${userApi}/user`)
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    user: async (parent, { _id }) => {
      if (context.data) {
        const { data } = await axios.get(`${userApi}/user/${_id}`)
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    profile: async (parent, args, context) => {
      if (context.data) {
        const { data } = await axios.get(`${userApi}/user/${context.data}`)
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    login: async (parent, { username, password }) => {
      const { data } = await axios.post(`${userApi}/user/authenticate`, {
        user: { username, password }
      })
      return data.user
        ? await jwt.sign({ _id: data.user._id }, 'mentorkodingpw')
        : ''
    },
    search: async (parent, { skill }) => {
      if (context.data) {
        const { data } = await axios.post(`${userApi}/user/search`, { skill })
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    }
  },
  Mutation: {
    createUser: async (parent, { user }) => {
      const { data } = await axios.post(`${userApi}/user`, { user })
      return data
    },
    deleteUser: async (parent, args, context) => {
      if (context.data) {
        const { data } = await axios.delete(`${userApi}/user/${context.data}`)
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    updateUser: async (parent, { user }, context) => {
      if (context.data) {
        const { data } = await axios.put(`${userApi}/user/${context.data}`, {
          user
        })
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    }
  }
}
