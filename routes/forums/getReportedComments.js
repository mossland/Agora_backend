const Comments = require('../../models/forumcomments.model')

module.exports.getReportedComments = async function (req, res) {
  try {
    const comments = await Comments.find({ reported: true, flaggedForDeletion: false }).sort({ createdAt: 'descending' })
    await Comments.populate(comments, { path: 'reporter', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })
    await Comments.populate(comments, { path: 'author', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })
    await Comments.populate(comments, { path: 'forumTopic', model: 'Forums' })
    return res.json(comments)
  } catch (err) {
    return res.status(400).send('Failed to GET reported forum comments')
  }
}
