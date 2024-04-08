const Comments = require('../../models/forumcomments.model')

module.exports.getDeletedComments = async function (req, res) {
  try {
    const comments = await Comments.find({ flaggedForDeletion: true }).sort({ createdAt: 'descending' })
    await Comments.populate(comments, { path: 'reporter', model: 'Users' })
    await Comments.populate(comments, { path: 'author', model: 'Users' })
    await Comments.populate(comments, { path: 'forumTopic', model: 'Forums' })
    return res.json(comments)
  } catch (err) {
    return res.status(400).send('Failed to GET forum comments flagged for deletion')
  }
}
