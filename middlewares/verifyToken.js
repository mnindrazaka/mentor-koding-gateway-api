function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    req.token = bearerHeader.split(' ')[1]
  } else {
    req.token = ''
  }
  next()
}

module.exports = verifyToken
