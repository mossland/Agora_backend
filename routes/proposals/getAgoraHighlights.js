const Proposals = require('../../models/proposals.model')
const Forums = require('../../models/forums.model')

module.exports.getAgoraHighlights = async function (req, res) {
  try {
    const proposals = await Proposals.find({ status: ['Approved'] }).sort({ createdAt: 'descending' })
    await Proposals.populate(proposals, { path: 'proponent', model: 'Users' })

    // Sort amongst the proposals

    // Sort amongst the topics

    return res.json([])
  } catch (err) {
    return res.status(400).send('Failed to GET agora highlights')
  }
}
