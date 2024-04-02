const Comments = require('../../models/forumcomments.model')

module.exports.getDeletedComments = async function (req, res) {
  try {
    const comments = await Comments.find({ flaggedForDeletion: true }).sort({ createdAt: 'descending' })
    return res.json(comments)
  } catch (err) {
    return res.status(400).send('Failed to GET forum comments flagged for deletion')
  }
}
