const Comments = require('../../models/forumcomments.model')
const Votes = require('../../models/votes.model')

module.exports.getAgoraRecentActivity = async function (req, res) {
  try {
    const comments = await Comments.find({ flaggedForDeletion: false }).sort({ createdAt: 'descending' })
    await Comments.populate(comments, { path: 'author', model: 'Users' })
    await Comments.populate(comments, { path: 'forumTopic', model: 'Forums' })

    const updatedComments = comments.map(c => {
      return { ...c, type: 'Comment' }
    })

    const votes = await Votes.find().sort({ createdAt: 'descending' })
    await Votes.populate(votes, { path: 'associatedProposal', model: 'Proposals' })
    await Votes.populate(votes, { path: 'voter', model: 'Users' })

    const updatedVotes = votes.map(c => {
      return { ...c, type: 'Vote' }
    })

    const all = []
    all.push(updatedComments)
    all.push(updatedVotes)

    // Flatten the array of arrays into a single array
    const flattened = all.flat()

    // Sort the flattened array by createdAt in descending order
    const sorted = flattened.sort(function (a, b) {
      return new Date(b._doc.createdAt) - new Date(a._doc.createdAt)
    })

    return res.json(sorted.slice(0, 10))
  } catch (err) {
    return res.status(400).send('Failed to GET agora recent activity')
  }
}
