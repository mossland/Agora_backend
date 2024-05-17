const Forums = require('../../models/forums.model')

module.exports.reviveForum = async function (req, res) {
  try {
    const forumId = req.params.fid

    const forumToUpdate = await Forums.findOne({ _id: forumId })

    if (!forumToUpdate) {
      return res.status(400).send(`Failed to revive forum topic ${forumId}`)
    }

    const reviveForum = async () => {
      forumToUpdate.reported = false

      forumToUpdate
        .save()
        .then((forumToUpdate) => {
          return res.status(200).json({ _id: forumToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to revive forum topic: ${err}`)
          return res.status(400).send(`Failed to revive forum topic ${forumId}`)
        })
    }

    async function handleReviveForum () {
      try {
        reviveForum()
      } catch (err) {
        console.log('error', `Failed to revive forum topic: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleReviveForum()
  } catch (e) {
    return res.status(400).send('Failed to revive forum topic')
  }
}
