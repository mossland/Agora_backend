const Proposals = require('../../models/proposals.model')
const Votes = require('../../models/votes.model')

module.exports.getProposalStats = async function (req, res) {
  try {
    const approvedProposals = await Proposals.find({ status: ['Approved'] })

    const now = new Date()
    const ongoing = approvedProposals.filter(i => now >= i.startDate && now <= i.endDate)
    const upcoming = approvedProposals.filter(i => now < i.startDate)

    const votes = await Votes.find()

    return res.json({ votes: votes.length, approved: approvedProposals.length, pending: upcoming.length, active: ongoing.length })
  } catch (err) {
    return res.status(400).send('Failed to GET proposal stats')
  }
}
