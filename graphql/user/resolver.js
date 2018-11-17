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
    }
  }
}
