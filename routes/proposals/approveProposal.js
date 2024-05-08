const Proposals = require('../../models/proposals.model')
const Forums = require('../../models/forums.model')

module.exports.approveProposal = async function (req, res) {
  try {
    const proposalId = req.params.pid

    // Find the proposal by ID
    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    // If proposal not found, return error
    if (!proposalToUpdate) {
      return res.status(400).send('Failed to approve proposal: Proposal not found')
    }

    // Update the proposal status to 'Approved'
    proposalToUpdate.status = 'Approved'

    // Save the updated proposal
    const updatedProposal = await proposalToUpdate.save()

    // Create a forum topic based on the approved proposal
    const now = new Date()
    const topic = new Forums({
      title: updatedProposal.title,
      createdAt: now,
      contents: updatedProposal.description,
      author: updatedProposal.proponent,
      category: 'MIP Discussion',
      likers: [],
      views: 0,
      pinned: false,
      reported: false,
      flaggedForDeletion: false
    })

    // Save the forum topic
    const savedTopic = await topic.save()

    // Update the proposal with the forum topic ID
    updatedProposal.linkedDiscusion = savedTopic._id
    await updatedProposal.save()

    // Return success response with proposal ID and associated topic ID
    return res.status(201).json({
      _id: updatedProposal._id,
      associatedTopic: savedTopic._id
    })
  } catch (error) {
    console.error('Failed to approve proposal:', error)
    return res.status(400).send('Failed to approve proposal: Internal server error')
  }
}
