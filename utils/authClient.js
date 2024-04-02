const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers.Authorization ||
    req.headers.authorization

  if (!token) {
    return res.status(401).send('A token is required for authentication')
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decoded
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }
  return next()
}

module.exports = verifyToken
