const Forums = require('../../models/forums.model')
const Users = require('../../models/users.model')

module.exports.likeForum = async function (req, res) {
  try {
    const forumId = req.params.fid
    const userId = req.params.uid

    const forumToUpdate = await Forums.findById(forumId)

    if (!forumToUpdate) {
      return res.status(400).send('Forum not found')
    }

    const user = await Users.findById(userId)

    if (!user) {
      return res.status(400).send('User not found')
    }

    // Check if this user has already liked this forum
    const alreadyLiked = forumToUpdate.likers.includes(userId)

    if (alreadyLiked) {
      return res.status(400).send('User has already liked this forum')
    }

    // Add user to the likers array
    forumToUpdate.likers.push(userId)

    await forumToUpdate.save()

    return res.status(200).json({ _id: forumToUpdate._id })
  } catch (err) {
    console.error('Failed to like forum:', err)
    return res.status(500).send('Failed to like forum')
  }
}
