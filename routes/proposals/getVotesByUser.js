const Votes = require('../../models/votes.model')

module.exports.getVotesByUser = async function (req, res) {
  try {
    const userId = req.params.uid
    const votes = await Votes.find({ voter: userId }).sort({ createdAt: 'descending' })
    await Votes.populate(votes, { path: 'associatedProposal', model: 'Proposals' })
    await Votes.populate(votes, { path: 'voter', model: 'Users' })
    return res.json(votes)
  } catch (err) {
    return res.status(400).send('Failed to GET votes by user')
  }
}
