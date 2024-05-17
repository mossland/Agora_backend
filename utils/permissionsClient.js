const Users = require('../models/users.model')

const verifyRolePermissions = async (req, res, next) => {
  // Validate if user exists in database
  const token =
      req.body.token ||
      req.query.token ||
      req.headers.Authorization ||
      req.headers.authorization

  if (!token) {
    return res
      .status(403)
      .send(
        'An authentication token and resource are required to verify permissions'
      )
  }

  const tokenn = token.includes('Bearer') ? token.split(' ')[1] : token

  try {
    // GET the role of this user
    const userFound = await Users.findOne({ token: tokenn })
    if (userFound) {
      // Retrieve the current role of this user
      const currentRole = userFound.role
      if (currentRole === 'Admin') {
        // res.status(200)
        next()
      } else {
        res.status(401).send('Unauthorized')
      }
    } else {
      return res.status(400).send('Failed to verify permissions')
    }
  } catch (err) {
    console.log(err)
    return res.status(401).send('Unauthorized')
  }
}

module.exports = verifyRolePermissions
