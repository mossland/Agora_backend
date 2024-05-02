const Comments = require('../../models/forumcomments.model')
module.exports.flagCommentsForDeletion = async function (req, res) {
  try {
    const comments = await Comments.updateMany(
      { reported: true },
      { $set: { flaggedForDeletion: true } }
    )
    return res.json({ comments })
  } catch (err) {
    return res.status(400).send('Failed to flag reported comments for deletion')
  }
}
