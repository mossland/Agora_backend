const Proposals = require('../../models/proposals.model')
const Users = require('../../models/users.model')
const Votes = require('../../models/votes.model')

module.exports.voteForProposal = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const proposalId = req.params.pid

    if (req.body.vote === undefined || req.body.voter === undefined) {
      return res.status(404).send('Vote type and voter id is required')
    }

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate || proposalToUpdate.status !== 'Approved') {
      return res.status(400).send('Failed to vote for proposal')
    }

    const voter = await Users.findOne({ _id: req.body.voter })

    if (!voter) {
      return res.status(400).send('Failed to vote for proposal')
    }

    // Check if proposal voting is ongoing
    const now = new Date()
    if ((now >= proposalToUpdate.startDate && now <= proposalToUpdate.endDate) === false) {
      return res.status(400).send('Failed to vote for proposal')
    }

    // Check if this user has already voted for this proposal
    const alreadyVoted = await Votes.findOne({ voter: req.body.voter, associatedProposal: proposalId })

    if (alreadyVoted) {
      return res.status(400).send('User can only vote once per proposal')
    }

    // Update voter's firstVote if it's not already set
    if (!voter.firstVote) {
      voter.firstVote = now
      try {
        await voter.save()
      } catch (error) {
        return res.status(400).send('Failed to update voter\'s first vote')
      }
    }

    // Check the vote type is valid
    if (!(req.body.vote === 'For' || req.body.vote === 'Against' || req.body.vote === 'Abstain')) {
      return res.status(400).send('Failed to vote for proposal')
    }

    const voteForProposal = async () => {
      const vote = new Votes({
        associatedProposal: proposalId,
        createdAt: now,
        type: req.body.vote,
        voter: voter._id,
        voterWalletAddress: voter.walletAddress
      })

      vote
        .save()
        .then((vote) => {
          return res.status(201).json({ _id: vote._id })
        })
        .catch((err) => {
          return res.status(400).send(`Failed to vote for proposal: ${err}`)
        })
    }

    async function handleVoteForProposal () {
      try {
        voteForProposal()
      } catch (err) {
        console.log('error', `Failed to vote for proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleVoteForProposal()
  } catch (e) {
    return res.status(400).send('Failed to vote for proposal')
  }
}
