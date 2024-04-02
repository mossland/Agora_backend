const Proposals = require('../../models/proposals.model')

module.exports.getProposals = async function (req, res) {
  try {
    const proposals = await Proposals.find().sort({ createdAt: 'descending' })
    return res.json(proposals)
  } catch (err) {
    return res.status(400).send('Failed to GET proposals')
  }
}
