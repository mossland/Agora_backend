const Forums = require('../../models/forums.model')

module.exports.pinForum = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const forumId = req.params.fid

    const forumToUpdate = await Forums.findOne({ _id: forumId })

    if (!forumToUpdate) {
      return res.status(400).send(`Failed to pin forum topic ${forumId}`)
    }

    const pinForum = async () => {
      forumToUpdate.pinned = true

      forumToUpdate
        .save()
        .then((forumToUpdate) => {
          return res.status(200).json({ _id: forumToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to pin forum topic: ${err}`)
          return res.status(400).send(`Failed to pin forum topic ${forumId}`)
        })
    }

    async function handlePinTopic () {
      try {
        pinForum()
      } catch (err) {
        console.log('error', `Failed to pin forum topic: ${err}`)
        return res.status(400).send(err)
      }
    }
    handlePinTopic()
  } catch (e) {
    return res.status(400).send('Failed to pin forum topic')
  }
}
