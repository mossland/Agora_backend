const Proposals = require('../../models/proposals.model')

module.exports.approveProposal = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send('Failed to approve proposal')
    }

    const approveProposal = async () => {
      proposalToUpdate.status = 'Approved'

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to approve proposal: ${err}`)
          return res.status(400).send(`Failed to approve proposal ${proposalId}`)
        })
    }

    async function handleApproveProposal () {
      try {
        approveProposal()
      } catch (err) {
        console.log('error', `Failed to approve proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleApproveProposal()
  } catch (e) {
    return res.status(400).send('Failed to approve proposal')
  }
}
