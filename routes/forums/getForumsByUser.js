const Forums = require('../../models/forums.model')

module.exports.getForumsByUser = async function (req, res) {
  try {
    const userId = req.params.uid
    const forums = await Forums.find({ author: userId, flaggedForDeletion: false }).sort({ createdAt: 'descending' })
    await Forums.populate(forums, { path: 'author', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })
    return res.json(forums)
  } catch (err) {
    return res.status(400).send('Failed to GET forum topics by user')
  }
}
