const Proposals = require('../../models/proposals.model')

module.exports.getProposalStats = async function (req, res) {
  try {
    const approvedProposals = await Proposals.find({ status: ['Approved'] })

    const now = new Date()
    const ongoing = approvedProposals.filter(i => now >= i.startDate && now <= i.endDate)

    return res.json({ approved: approvedProposals.length, pending: ongoing.length, active: ongoing.length })
  } catch (err) {
    return res.status(400).send('Failed to GET approved proposals')
  }
}
