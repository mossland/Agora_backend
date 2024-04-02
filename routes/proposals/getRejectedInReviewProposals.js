const Proposals = require('../../models/proposals.model')

module.exports.getRejectedInReviewProposals = async function (req, res) {
  try {
    const proposals = await Proposals.find({ status: ['In Review', 'Rejected'] }).sort({ createdAt: 'descending' })
    await Proposals.populate(proposals, { path: 'proponent', model: 'Users' })
    return res.json(proposals)
  } catch (err) {
    return res.status(400).send('Failed to GET rejected/in review proposals')
  }
}
