const Proposals = require('../../models/proposals.model')

module.exports.getApprovedProposals = async function (req, res) {
  try {
    const proposals = await Proposals.find({ status: ['Approved'] }).sort({ createdAt: 'descending' })
    await Proposals.populate(proposals, { path: 'proponent', model: 'Users' })

    const now = new Date()

    function fetchVotingStatus (p) {
      if (now >= p.startDate && now <= p.endDate) {
        return 'Ongoing'
      }
      if (now >= p.endDate) {
        // to-do: check voting result
        if (p.extended === true && now < p.extendedEndDate) {
          return 'Extended'
        }
        return 'Ended'
      }
      if (now < p.startDate) {
        return 'Ready'
      }
      return ''
    }
    const updatedProposals = proposals.map(proposal => {
      const votingStatus = fetchVotingStatus(proposal)
      return { ...proposal, votingStatus }
    })

    return res.json(updatedProposals)
  } catch (err) {
    return res.status(400).send('Failed to GET approved proposals')
  }
}
