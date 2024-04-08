const Comments = require('../../models/forumcomments.model')

module.exports.reviveComment = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const commentId = req.params.cid

    const commentToUpdate = await Comments.findOne({ _id: commentId })

    if (!commentToUpdate) {
      return res.status(400).send(`Failed to revive comment ${commentId}`)
    }

    const reviveComment = async () => {
      commentToUpdate.reported = false

      commentToUpdate
        .save()
        .then((commentToUpdate) => {
          return res.status(200).json({ _id: commentToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to revive forum comment: ${err}`)
          return res.status(400).send(`Failed to revive forum comment ${commentId}`)
        })
    }

    async function handleReviveComment () {
      try {
        reviveComment()
      } catch (err) {
        console.log('error', `Failed to revive forum comment: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleReviveComment()
  } catch (e) {
    return res.status(400).send('Failed to revive forum comment')
  }
}
