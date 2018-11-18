const jwt = require('jsonwebtoken')

async function passRequest({ req }) {
  if (req.token != '') {
    const authData = await jwt.verify(req.token, 'mentorkodingpw')
    return {
      data: authData._id
    }
  } else {
    return {
      data: false
    }
  }
}

module.exports = passRequest
