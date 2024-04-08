const Comments = require('../../models/forumcomments.model')
module.exports.flagCommentsForDeletion = async function (req, res) {
  try {
    const comments = Comments.update({ reported: true }, { $set: { flaggedForDeletion: true } }, { multi: true }, () => {})
    return res.json({ comments })
  } catch (err) {
    return res.status(400).send('Failed to flag reported comments for deletion')
  }
}
