const Users = require('../../models/users.model')

module.exports.getGeneralUsers = async function (req, res) {
  try {
    const users = await Users.find({ isBanned: false }).select(
      'role walletAddress isBanned bannedReason bannedTimestamp nickname profilePicture createdAt lastSeen firstVote views'
    ).sort({ createdAt: 'descending' })
    return res.json(users)
  } catch (err) {
    return res.status(400).send('Failed to GET general users')
  }
}
