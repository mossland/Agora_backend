const Comments = require('../../models/forumcomments.model')
const Proposals = require('../../models/proposals.model')
const Votes = require('../../models/votes.model')

module.exports.getUserActivityForAdminView = async function (req, res) {
  try {
    const comments = await Comments.find({ author: req.params.uid }).sort({ createdAt: 'descending' })
    await Comments.populate(comments, { path: 'author', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })
    await Comments.populate(comments, { path: 'forumTopic', model: 'Forums' })

    const updatedComments = comments.map(c => {
      return { ...c, type: 'Comment' }
    })

    const proposals = await Proposals.find({ proponent: req.params.uid }).sort({ createdAt: 'descending' })

    const updatedProposals = proposals.map(c => {
      return { ...c, type: 'Proposal' }
    })
    const votes = await Votes.find({ voter: req.params.uid }).sort({ createdAt: 'descending' })
    await Votes.populate(votes, { path: 'associatedProposal', model: 'Proposals' })

    const updatedVotes = votes.map(c => {
      return { ...c, type: 'Vote' }
    })

    const all = []
    all.push(updatedComments)
    all.push(updatedVotes)
    all.push(updatedProposals)

    // Flatten the array of arrays into a single array
    const flattened = all.flat()

    // Sort the flattened array by createdAt in descending order
    const sorted = flattened.sort(function (a, b) {
      return new Date(b._doc.createdAt) - new Date(a._doc.createdAt)
    })

    return res.json(sorted)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Failed to GET user recent activity')
  }
}
