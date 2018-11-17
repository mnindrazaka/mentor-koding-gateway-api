const axios = require('axios')
const { skillApi } = require('../../config/api')

module.exports.resolver = {
  Query: {
    skills: async () => {
      const skills = await axios.get(skillApi)
      return skills.data.keywords.map(skill => ({
        _id: skill.id,
        title: skill.keyName
      }))
    }
  }
}
