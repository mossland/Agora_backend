const Proposals = require('../../models/proposals.model')

module.exports.rejectProposal = async function (req, res) {
  try {
    const proposalId = req.params.pid

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send('Failed to reject proposal')
    }

    const rejectProposal = async () => {
      proposalToUpdate.status = 'Rejected'
      proposalToUpdate.reviewReason = null
      proposalToUpdate.reviewTimestamp = null

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to reject proposal: ${err}`)
          return res.status(400).send(`Failed to reject proposal ${proposalId}`)
        })
    }

    async function handleRejectProposal () {
      try {
        rejectProposal()
      } catch (err) {
        console.log('error', `Failed to reject proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleRejectProposal()
  } catch (e) {
    return res.status(400).send('Failed to reject proposal')
  }
}
