const Users = require('../../models/users.model')

module.exports.viewUserProfile = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const userId = req.params.uid

    const userToUpdate = await Users.findOne({ _id: userId })

    if (!userToUpdate) {
      return res.status(400).send('Failed to view user profile')
    }


    const viewProfile = async () => {
      userToUpdate.views = userToUpdate.views + 1

      userToUpdate
        .save()
        .then((userToUpdate) => {
          return res.status(200).json({ _id: userToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to view user: ${err}`)
          return res.status(400).send(`Failed to view user ${userId}`)
        })
    }

    async function handleViewProfile () {
      try {
        viewProfile()
      } catch (err) {
        console.log('error', `Failed to view user: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleViewProfile()
  } catch (e) {
    return res.status(400).send('Failed to view user')
  }
}
