const Votes = require('../../models/votes.model')

module.exports.getProposalVotes = async function (req, res) {
  try {
    const votes = await Votes.find({ associatedProposal: req.params.pid }).sort({ createdAt: 'descending' })
    await Votes.populate(votes, { path: 'voter', model: 'Users' })
    return res.json(votes)
  } catch (err) {
    return res.status(400).send('Failed to GET proposal votes')
  }
}
