const Proposals = require('../../models/proposals.model')

module.exports.requestProposalReview = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid

    if (req.body.reviewReason === undefined || req.body.reviewReason.trim() === '') {
      return res.status(404).send('Review reason is required')
    }

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send('Failed to request proposal review')
    }

    const requestProposalReview = async () => {
      proposalToUpdate.status = 'Rejected'
      proposalToUpdate.reviewReason = req.body.reviewReason
      proposalToUpdate.reviewTimestamp = new Date()

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to request proposal review: ${err}`)
          return res.status(400).send(`Failed to request proposal review ${proposalId}`)
        })
    }

    async function handleRequestProposalReview () {
      try {
        requestProposalReview()
      } catch (err) {
        console.log('error', `Failed to request proposal review: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleRequestProposalReview()
  } catch (e) {
    return res.status(400).send('Failed to request proposal review')
  }
}
