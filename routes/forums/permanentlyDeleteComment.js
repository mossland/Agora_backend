const Comments = require('../../models/forumcomments.model')

module.exports.permanentlyDeleteComment = async function (req, res) {
  try {
    const commentId = req.params.cid

    const commentToUpdate = await Comments.findOne({ _id: commentId })

    if (!commentToUpdate) {
      return res.status(400).send(`Failed to delete comment ${commentId}`)
    }

    const deleteComment = async () => {
      commentToUpdate.flaggedForDeletion = true

      commentToUpdate
        .save()
        .then((commentToUpdate) => {
          return res.status(200).json({ _id: commentToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to delete forum comment: ${err}`)
          return res.status(400).send(`Failed to delete forum comment ${commentId}`)
        })
    }

    async function handledeleteComment () {
      try {
        deleteComment()
      } catch (err) {
        console.log('error', `Failed to delete forum comment: ${err}`)
        return res.status(400).send(err)
      }
    }
    handledeleteComment()
  } catch (e) {
    return res.status(400).send('Failed to delete forum comment')
  }
}
