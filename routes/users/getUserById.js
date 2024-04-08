const Users = require('../../models/users.model')

module.exports.getUserById = async function (req, res) {
  try {
    const userId = req.params.uid

    const user = await Users.findOne({ _id: userId })

    if (!user) {
      return res.status(400).send(`Failed to GET user ${userId}`)
    }

    return res.json(user)
  } catch (err) {
    return res.status(400).send('Failed to GET users')
  }
}
