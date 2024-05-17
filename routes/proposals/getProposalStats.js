const Proposals = require('../../models/proposals.model')
const Votes = require('../../models/votes.model')

module.exports.getProposalStats = async function (req, res) {
  try {
    const approvedProposals = await Proposals.find({ status: ['Approved'] })

    const now = new Date()
    const ongoing = approvedProposals.filter(i => now >= i.startDate && now <= i.endDate)
    const upcoming = approvedProposals.filter(i => now < i.startDate)
    const endedProposals = approvedProposals.filter(i => now > i.endDate)

    const endedProposalIds = endedProposals.map(proposal => proposal.id)

    const endedVotes = await Votes.find({ associatedProposal: { $in: endedProposalIds } })
    // Step 4: Group the votes by proposalId and calculate weighted "For" and "Against" vote counts
    const weightedVoteCounts = {}

    endedVotes.forEach(vote => {
      if (!weightedVoteCounts[vote.associatedProposal]) {
        weightedVoteCounts[vote.associatedProposal] = { forVotes: 0, againstVotes: 0 }
      }
      if (vote.type === 'For') {
        weightedVoteCounts[vote.associatedProposal].forVotes += vote.initialMocBalance
      } else if (vote.type === 'Against') {
        weightedVoteCounts[vote.associatedProposal].againstVotes += vote.initialMocBalance
      }
    })

    // Determine which proposals passed based on weighted votes
    const passedProposals = endedProposals.filter(proposal => {
      const counts = weightedVoteCounts[proposal._id]
      return counts && counts.forVotes > counts.againstVotes
    })

    const votes = await Votes.find()

    return res.json({ votes: votes.length, approved: approvedProposals.length, pending: upcoming.length, active: ongoing.length, passed: passedProposals.length })
  } catch (err) {
    return res.status(400).send('Failed to GET proposal stats')
  }
}
