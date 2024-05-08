const Proposals = require('../../models/proposals.model')

module.exports.viewProposal = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate || proposalToUpdate.status !== 'Approved') {
      return res.status(400).send('Failed to view proposal')
    }

    // Users can view a proposal multiple times

    const viewProposal = async () => {
      proposalToUpdate.views = proposalToUpdate.views + 1

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          return res.status(400).send(`Failed to view proposal ${proposalId}: ${err}`)
        })
    }

    async function handleViewProposal () {
      try {
        viewProposal()
      } catch (err) {
        return res.status(400).send(err)
      }
    }
    handleViewProposal()
  } catch (e) {
    return res.status(400).send('Failed to view proposal')
  }
}
