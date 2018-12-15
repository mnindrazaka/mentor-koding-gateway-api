const axios = require('axios')
const { userApi, meetupApi } = require('../../../config/api')
const { AuthenticationError } = require('apollo-server-express')

function filterMeetups(meetups, isConfirmed, userId) {
  return meetups.filter(meetup => {
    if (isConfirmed) {
      return (
        meetup.isConfirmed == true &&
        (meetup.mentorId == userId || meetup.studentId == userId) &&
        !meetup.isFinished
      )
    } else {
      return (
        meetup.isConfirmed == false &&
        meetup.mentorId == userId &&
        !meetup.isFinished
      )
    }
  })
}

function includeUserData(meetups, userId) {
  return meetups.map(async meetup => {
    meetup.student = await getUser(meetup.studentId)
    meetup.mentor = await getUser(meetup.mentorId)
    meetup.isMentor = userId == meetup.mentorId
    return meetup
  })
}

async function getUser(userId) {
  return (await axios.get(`${userApi}/user/${userId}`)).data
}

module.exports.resolver = {
  Query: {
    meetups: async (parent, { isConfirmed }, context) => {
      if (context.data) {
        const { data } = await axios.get(`${meetupApi}/meetup`)
        const filteredMeetup = filterMeetups(data, isConfirmed, context.data)
        return includeUserData(filteredMeetup, context.data)
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    },
    meetup: async (parent, { _id }, context) => {
      if (context.data) {
        const { data } = await axios.get(`${meetupApi}/meetup/${_id}`)
        return includeUserData(data)
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
    },
    deleteMeetup: async (parent, { _id }, context) => {
      if (context.data) {
        const { data } = axios.delete(`${meetupApi}/meetup/${_id}`)
        return data
      } else {
        throw new AuthenticationError('Must Authenticate')
      }
    }
  }
}
