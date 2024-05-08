const Proposals = require('../../models/proposals.model')

module.exports.editProposalById = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid

    if (req.body.title === undefined || req.body.title.trim() === '' ||
    req.body.description === undefined ||
    req.body.tag === undefined ||
    req.body.startDate === undefined ||
    req.body.endDate === undefined ||
    req.body.ccdAdmins === undefined
    ) {
      return res.status(404).send('All proposal fields are required')
    }

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send(`Failed to update proposal ${proposalId}`)
    }

    if (proposalToUpdate.status === 'In Review' || (proposalToUpdate.status === 'Rejected' && proposalToUpdate.reviewReason !== null)) {
      const updateProposal = async () => {
        proposalToUpdate.title = req.body.title
        proposalToUpdate.description = req.body.description
        proposalToUpdate.tag = req.body.tag
        proposalToUpdate.startDate = req.body.startDate
        proposalToUpdate.endDate = req.body.endDate
        proposalToUpdate.ccdAdmins = req.body.ccdAdmins
        proposalToUpdate.status = 'In Review'

        proposalToUpdate
          .save()
          .then((proposalToUpdate) => {
            return res.status(200).json({ _id: proposalToUpdate._id })
          })
          .catch((err) => {
            console.log('error', `Failed to update proposal: ${err}`)
            return res.status(400).send(`Failed to update proposal ${proposalId}`)
          })
      }

      async function handleUpdateProposal () {
        try {
          updateProposal()
        } catch (err) {
          console.log('error', `Failed to update proposal: ${err}`)
          return res.status(400).send(err)
        }
      }
      handleUpdateProposal()
    } else {
      return res.status(400).send(`Failed to update proposal ${proposalId}`)
    }
  } catch (e) {
    return res.status(400).send('Failed to update proposal')
  }
}
