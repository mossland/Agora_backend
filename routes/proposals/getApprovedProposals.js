const Proposals = require('../../models/proposals.model')

module.exports.getApprovedProposals = async function (req, res) {
  try {
    const proposals = await Proposals.find({ status: ['Ready', 'Ongoing', 'Ended', 'Approved'] }).sort({ createdAt: 'descending' })
    await Proposals.populate(proposals, { path: 'proponent', model: 'Users' })
    return res.json(proposals)
  } catch (err) {
    return res.status(400).send('Failed to GET approved proposals')
  }
}
