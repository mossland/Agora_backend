const Comments = require('../../models/forumcomments.model')
const Users = require('../../models/users.model')
const Forums = require('../../models/forums.model')

module.exports.postForumComment = async function (req, res) {
  try {
    const forumId = req.body.forumId

    // Check if required parameters are provided
    if (req.body.forumId === undefined || req.body.comment === undefined || req.body.commenter === undefined) {
      return res.status(400).send('Comment text and commenter id are required')
    }

    // Check if the forum exists
    const forumToUpdate = await Forums.findById(forumId)
    if (!forumToUpdate) {
      return res.status(400).send('Forum not found')
    }

    // Check if the commenter exists
    const commenter = await Users.findById(req.body.commenter)
    if (!commenter) {
      return res.status(400).send('Commenter not found')
    }

    // Create new comment
    const now = new Date()
    const comment = new Comments({
      forumTopic: forumId,
      createdAt: now,
      contents: req.body.comment,
      author: req.body.commenter,
      likers: [],
      reported: false,
      flaggedForDeletion: false
    })

    // Save the comment
    await comment.save()

    return res.status(201).json({ _id: comment._id })
  } catch (err) {
    console.error('Failed to post forum comment:', err)
    return res.status(500).send('Failed to post forum comment')
  }
}
