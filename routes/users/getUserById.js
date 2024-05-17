const Users = require('../../models/users.model')

module.exports.getUserById = async function (req, res) {
  try {
    const userId = req.params.uid

    if (req.user.user_id === userId || req.user.role === 'Admin') {
      const user = await Users.findOne({ _id: userId })

      if (!user) {
        return res.status(400).send(`Failed to GET user ${userId}`)
      }

      return res.json(user)
    } else {
      return res.status(400).send('Failed to edit nickname')
    }
  } catch (err) {
    console.log(err)
    return res.status(400).send('Failed to GET users')
  }
}
