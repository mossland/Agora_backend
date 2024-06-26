const Forums = require('../../models/forums.model')

module.exports.getReportedForums = async function (req, res) {
  try {
    const forums = await Forums.find({ reported: true, flaggedForDeletion: false }).sort({ createdAt: 'descending' })
    await Forums.populate(forums, { path: 'reporter', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })
    await Forums.populate(forums, { path: 'author', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })
    return res.json(forums)
  } catch (err) {
    return res.status(400).send('Failed to GET reported forum topics')
  }
}
