const Comments = require('../../models/forumcomments.model')

module.exports.permanentlyDeleteComments = async function (req, res) {
  try {
    const comments = await Comments.deleteMany({ flaggedForDeletion: true })
    return res.json({ comments })
  } catch (err) {
    return res.status(400).send('Failed to delete comments flagged for deletion')
  }
}
