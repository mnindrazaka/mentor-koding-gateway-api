const axios = require('axios')
const { userApi, meetupApi } = require('../../../config/api')
const { AuthenticationError } = require('apollo-server-express')

function filterMeetups(meetups, isConfirmed, userId) {
  return meetups.filter(meetup => {
    if (isConfirmed) {
      return (
        meetup.isConfirmed == true &&
        (meetup.mentorId == userId || meetup.studentId == userId)
      )
    } else {
      return meetup.isConfirmed == false && meetup.mentorId == userId
    }
  })
}

function getUserData(meetups) {
  return meetups.map(async meetup => {
    const student = (await axios.get(`${userApi}/user/${meetup.studentId}`))
      .data
    const mentor = (await axios.get(`${userApi}/user/${meetup.mentorId}`)).data
    meetup.student = student
    meetup.mentor = mentor
    return meetup
  })
}

module.exports.resolver = {
  Query: {
    meetups: async (parent, { isConfirmed }, context) => {
      if (context.data) {
        const { data } = await axios.get(`${meetupApi}/meetup`)
        const filteredMeetup = filterMeetups(data, isConfirmed, context.data)
        return getUserData(filteredMeetup)
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    meetup: async (parent, { _id }, context) => {
      if (context.data) {
        const { data } = await axios.get(`${meetupApi}/meetup/${_id}`)
        return getUserData(data)
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    }
  },
  Mutation: {
    createMeetup: async (parent, { meetup }, context) => {
      if (context.data) {
        meetup.studentId = context.data
        const { data } = axios.post(`${meetupApi}/meetup`, { meetup })
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    updateMeetup: async (parent, { meetup, _id }, context) => {
      if (context.data) {
        const { data } = axios.put(`${meetupApi}/meetup/${_id}`, { meetup })
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    }
  }
}
