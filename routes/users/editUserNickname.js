const Users = require('../../models/users.model')

module.exports.editUserNickname = async function (req, res) {
  try {
    const userId = req.params.uid

    if (req.user.user_id !== userId) {
      return res.status(400).send('Failed to edit nickname')
    }

    if (req.body.nickname === undefined || req.body.nickname.trim() === '') {
      return res.status(404).send('New nickname is required')
    }

    const userToUpdate = await Users.findOne({ _id: userId })

    if (!userToUpdate) {
      return res.status(400).send('Failed to update user nickname')
    }

    const updateNickname = async () => {
      userToUpdate.nickname = req.body.nickname

      userToUpdate
        .save()
        .then((userToUpdate) => {
          return res.status(200).json({ _id: userToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `'Failed to update user nickname: ${err}`)
          return res
            .status(400)
            .send(`'Failed to update user nickname ${userId}`)
        })
    }

    async function handleUpdateNickname () {
      try {
        updateNickname()
      } catch (err) {
        console.log('error', `Failed to update user nickname: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleUpdateNickname()
  } catch (e) {
    return res.status(400).send('Failed to update user nickname')
  }
}
