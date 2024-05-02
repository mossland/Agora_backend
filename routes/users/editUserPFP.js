const Users = require('../../models/users.model')

module.exports.editUserPFP = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const userId = req.params.uid

    function validatePFP (pfp) {
      if (pfp === '1' || pfp === '2' || pfp === '3' || pfp === '4') {
        return true
      }
      return false
    }

    if (req.body.pfp === undefined || validatePFP(req.body.pfp) === false) {
      return res.status(404).send('Valid pfp is required')
    }

    const userToUpdate = await Users.findOne({ _id: userId })

    if (!userToUpdate) {
      return res.status(400).send('Failed to update user pfp')
    }

    const updatePFP = async () => {
      userToUpdate.profilePicture = req.body.pfp

      userToUpdate
        .save()
        .then((userToUpdate) => {
          return res.status(200).json({ _id: userToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `'Failed to update user pfp: ${err}`)
          return res
            .status(400)
            .send(`'Failed to update user pfp ${userId}`)
        })
    }

    async function handleUpdatePFP () {
      try {
        updatePFP()
      } catch (err) {
        console.log('error', `Failed to update user nickname: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleUpdatePFP()
  } catch (e) {
    return res.status(400).send('Failed to update user pfp')
  }
}
