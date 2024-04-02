const Users = require('../../models/users.model')

module.exports.getUsers = async function (req, res) {
  try {
    const users = await Users.find() // .sort();
    return res.json(users)
  } catch (err) {
    return res.status(400).send('Failed to GET users')
  }
}
