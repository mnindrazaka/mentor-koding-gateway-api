const axios = require('axios')
const { userApi } = require('../../../config/api')
const jwt = require('jsonwebtoken')

module.exports.resolver = {
  Query: {
    users: async () => {
      const { data } = await axios.get(`${userApi}/user`)
      return data
    },
    user: async (parent, { _id }) => {
      const { data } = await axios.get(`${userApi}/user/${_id}`)
      return data
    },
    profile: async (parent, args, context) => {
      const { data } = await axios.get(`${userApi}/user/${context.data}`)
      return data
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
      const { data } = await axios.post(`${userApi}/user/search`, { skill })
      return data
    }
  },
  Mutation: {
    createUser: async (parent, { user }) => {
      const { data } = await axios.post(`${userApi}/user`, { user })
      return data
    },
    deleteUser: async (parent, args, context) => {
      const { data } = await axios.delete(`${userApi}/user/${context.data}`)
      return data
    },
    updateUser: async (parent, { user }, context) => {
      const { data } = await axios.put(`${userApi}/user/${context.data}`, {
        user
      })
      return data
    }
  }
}
