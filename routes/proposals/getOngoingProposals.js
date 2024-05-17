const Proposals = require('../../models/proposals.model')

module.exports.getOngoingProposals = async function (req, res) {
  try {
    const proposals = await Proposals.find({ status: ['Approved'] }).sort({ createdAt: 'descending' })
    await Proposals.populate(proposals, { path: 'proponent', model: 'Users', select: 'role walletAddress isBanned nickname profilePicture createdAt lastSeen firstVote views' })

    const now = new Date()
    const ongoing = proposals.filter(i => now >= i.startDate && now <= i.endDate)

    return res.json(ongoing)
  } catch (err) {
    return res.status(400).send('Failed to GET ongoing proposals')
  }
}
