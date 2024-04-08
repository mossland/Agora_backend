const Comments = require('../../models/forumcomments.model')

module.exports.getAgoraRecentActivity = async function (req, res) {
  try {
    const comments = await Comments.find({ flaggedForDeletion: false }).sort({ createdAt: 'descending' })
    await Comments.populate(comments, { path: 'author', model: 'Users' })
    await Comments.populate(comments, { path: 'forumTopic', model: 'Forums' })

    const updatedComments = comments.map(c => {
      return { ...c, type: 'Comment' }
    })

    return res.json(updatedComments.slice(0, 10))
  } catch (err) {
    return res.status(400).send('Failed to GET agora recent activity')
  }
}
