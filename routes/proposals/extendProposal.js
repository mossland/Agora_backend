const Proposals = require('../../models/proposals.model')

module.exports.extendProposal = async function (req, res) {
  try {
    const proposalId = req.params.pid

    if (req.body.newEndDate === undefined) {
      return res.status(404).send('New end date is required')
    }

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send('Failed to patch proposal')
    }

    const patchProposal = async () => {
      proposalToUpdate.extended = true
      proposalToUpdate.endDate = req.body.newEndDate

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to patch proposal: ${err}`)
          return res.status(400).send(`Failed to patch proposal ${proposalId}`)
        })
    }

    async function handlePatchProposal () {
      try {
        patchProposal()
      } catch (err) {
        console.log('error', `Failed to patch proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handlePatchProposal()
  } catch (e) {
    return res.status(400).send('Failed to patch proposal')
  }
}
