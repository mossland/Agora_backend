const Proposals = require('../../models/proposals.model')

module.exports.withdrawProposal = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send('Failed to withdraw proposal')
    }

    const withdrawProposal = async () => {
      proposalToUpdate.status = 'Withdrawn'
      proposalToUpdate.reviewReason = null
      proposalToUpdate.reviewTimestamp = null

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to withdraw proposal: ${err}`)
          return res.status(400).send(`Failed to withdraw proposal ${proposalId}`)
        })
    }

    async function handleWithdrawProposal () {
      try {
        withdrawProposal()
      } catch (err) {
        console.log('error', `Failed to withdraw proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleWithdrawProposal()
  } catch (e) {
    return res.status(400).send('Failed to withdraw proposal')
  }
}
