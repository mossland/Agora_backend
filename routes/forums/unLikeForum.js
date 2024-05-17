const Forums = require('../../models/forums.model')
const Users = require('../../models/users.model')

module.exports.unLikeForum = async function (req, res) {
  try {
    const forumId = req.params.fid
    const userId = req.params.uid

    if (req.user.user_id !== userId) {
      return res.status(400).send('Failed to unlike forum')
    }

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

    if (!alreadyLiked) {
      return res.status(400).send('User has not liked this forum')
    }

    // Remove user from the likers array
    forumToUpdate.likers = forumToUpdate.likers.filter(id => id !== userId)

    await forumToUpdate.save()

    return res.status(200).json({ _id: forumToUpdate._id })
  } catch (err) {
    console.error('Failed to unlike forum:', err)
    return res.status(500).send('Failed to unlike forum')
  }
}
