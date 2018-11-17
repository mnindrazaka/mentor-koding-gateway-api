const axios = require('axios')
const { userApi } = require('../../config/api')

module.exports.resolver = {
  Query: {
    users: async () => {
      const { data } = await axios.get(`${userApi}/user`)
      return data
    },
    user: async (parent, args) => {
      const { data } = await axios.get(`${userApi}/user/${args._id}`)
      return data
    },
    search: async (parent, args) => {
      const { data } = await axios.post(`${userApi}/user/search`, {
        skill: args.skill
      })
      return data
    }
  },
  Mutation: {
    createUser: async (parent, args) => {
      const { data } = await axios.post(`${userApi}/user`, {
        user: args.user
      })
      return data
    }
  }
}
