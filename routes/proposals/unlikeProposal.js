const Proposals = require('../../models/proposals.model')
const Users = require('../../models/users.model')

module.exports.unlikeProposal = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid
    const userId = req.params.uid

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate || proposalToUpdate.status !== 'Approved') {
      return res.status(400).send('Failed to unlike proposal')
    }

    const user = await Users.findOne({ _id: userId })

    if (!user) {
      return res.status(400).send('Failed to unlike proposal')
    }

    // Check if this user has already liked this proposal

    const alreadyLiked = proposalToUpdate.likers.includes(user._id)

    if (!alreadyLiked) {
      return res.status(400).send('Failed to unlike proposal')
    }

    const unlikeProposal = async () => {
      const index = proposalToUpdate.likers.indexOf(user._id)
      const removedLiker = proposalToUpdate.likers.splice(index, 1)
      proposalToUpdate.likers = removedLiker

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to unlike proposal: ${err}`)
          return res.status(400).send(`Failed to unlike proposal ${proposalId}`)
        })
    }

    async function handleUnLikeProposal () {
      try {
        unlikeProposal()
      } catch (err) {
        console.log('error', `Failed to unlike proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleUnLikeProposal()
  } catch (e) {
    return res.status(400).send('Failed to unlike proposal')
  }
}
