const Users = require('../../models/users.model')
const Comments = require('../../models/forumcomments.model')

module.exports.likeForumComment = async function (req, res) {
  try {
    const commentId = req.params.cid
    const userId = req.params.uid

    const commentToUpdate = await Comments.findById(commentId)

    if (!commentToUpdate) {
      return res.status(400).send('Comment not found')
    }

    const user = await Users.findById(userId)

    if (!user) {
      return res.status(400).send('User not found')
    }

    // Check if this user has already liked this forum comment
    const alreadyLiked = commentToUpdate.likers.includes(userId)

    if (alreadyLiked) {
      return res.status(400).send('User has already liked this comment')
    }

    // Add user to the likers array
    commentToUpdate.likers.push(userId)

    await commentToUpdate.save()

    return res.status(200).json({ _id: commentToUpdate._id })
  } catch (err) {
    console.error('Failed to like forum comment:', err)
    return res.status(500).send('Failed to like forum comment')
  }
}
