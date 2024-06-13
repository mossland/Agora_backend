const Users = require('../../models/users.model')

module.exports.getBannedUsers = async function (req, res) {
  try {
    const users = await Users.find({ isBanned: true }).select(
      'role walletAddress isBanned banReason banTimestamp nickname profilePicture createdAt lastSeen firstVote views'
    ).sort({ createdAt: 'descending' })
    return res.json(users)
  } catch (err) {
    return res.status(400).send('Failed to GET banned users')
  }
}
