const Proposals = require('../../models/proposals.model')

module.exports.getApprovedProposalById = async function (req, res) {
  try {
    const pid = req.params.pid
    const proposal = await Proposals.findById(pid)

    if (proposal.status !== 'Approved') {
      return res.status(400).send('Failed to GET approved proposal by id')
    }

    await Proposals.populate(proposal, { path: 'proponent', model: 'Users' })

    return res.json(proposal)
  } catch (err) {
    return res.status(400).send('Failed to GET approved proposal by id')
  }
}
