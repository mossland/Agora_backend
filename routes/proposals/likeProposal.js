const Proposals = require('../../models/proposals.model')
const Users = require('../../models/users.model')

module.exports.likeProposal = async function (req, res) {
  try {
    const proposalId = req.params.pid
    const userId = req.params.uid

    if (req.user.user_id !== userId) {
      return res.status(400).send('Failed to unlike proposal')
    }

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate || proposalToUpdate.status !== 'Approved') {
      return res.status(400).send('Failed to like proposal')
    }

    const user = await Users.findOne({ _id: userId })

    if (!user) {
      return res.status(400).send('Failed to like proposal')
    }

    // Check if this user has already liked this proposal

    const alreadyLiked = proposalToUpdate.likers.includes(user._id)

    if (alreadyLiked) {
      return res.status(400).send('Failed to like proposal')
    }

    const likeProposal = async () => {
      const appendedLikers = proposalToUpdate.likers.push(user._id)
      proposalToUpdate.likers = appendedLikers

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to like proposal: ${err}`)
          return res.status(400).send(`Failed to like proposal ${proposalId}`)
        })
    }

    async function handleLikeProposal () {
      try {
        likeProposal()
      } catch (err) {
        console.log('error', `Failed to like proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleLikeProposal()
  } catch (e) {
    return res.status(400).send('Failed to like proposal')
  }
}
