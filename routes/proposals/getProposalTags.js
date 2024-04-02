const ProposalTags = require('../../models/proposaltags.model')

module.exports.getProposalTags = async function (req, res) {
  try {
    const proposalTags = await ProposalTags.find()
    return res.json(proposalTags)
  } catch (err) {
    return res.status(400).send('Failed to GET proposal tags')
  }
}
