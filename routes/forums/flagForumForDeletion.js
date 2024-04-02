const Forums = require('../../models/forums.model')

module.exports.flagForumForDeletion = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const forumId = req.params.fid

    const forumToUpdate = await Forums.findOne({ _id: forumId })

    if (!forumToUpdate) {
      return res.status(400).send(`Failed to flag forum topic for deletion ${forumId}`)
    }

    const deleteForum = async () => {
      forumToUpdate.flaggedForDeletion = true

      forumToUpdate
        .save()
        .then((forumToUpdate) => {
          return res.status(200).json({ _id: forumToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to flag forum topic for deletion: ${err}`)
          return res.status(400).send(`Failed to flag forum topic for deletion ${forumId}`)
        })
    }

    async function handleDeleteTopic () {
      try {
        deleteForum()
      } catch (err) {
        console.log('error', `Failed to flag forum topic for deletion: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleDeleteTopic()
  } catch (e) {
    return res.status(400).send('Failed to flag forum topic for deletion')
  }
}
