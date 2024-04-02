const Comments = require('../../models/forumcomments.model')

module.exports.getReportedComments = async function (req, res) {
  try {
    const comments = await Comments.find({ reported: true }).sort({ createdAt: 'descending' })
    return res.json(comments)
  } catch (err) {
    return res.status(400).send('Failed to GET reported forum comments')
  }
}
