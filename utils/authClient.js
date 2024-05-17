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

  const tokenn = token.includes('Bearer') ? token.split(' ')[1] : token

  try {
    const decoded = jwt.verify(tokenn, process.env.TOKEN_KEY)

    // if (decoded.role !== 'Admin') {
    //   return res.status(401).send('Unauthorized')
    // }

    req.user = decoded
  } catch (err) {
    console.log(err)
    return res.status(401).send('Unauthorized')
  }
  return next()
}

module.exports = verifyToken
