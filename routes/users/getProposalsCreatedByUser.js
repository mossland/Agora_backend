const Proposals = require('../../models/proposals.model')
const Users = require('../../models/users.model')

module.exports.getProposalsCreatedByUser = async function (req, res) {
  try {
    const userId = req.params.uid

    const user = await Users.findOne({ _id: userId })

    if (!user) {
      return res
        .status(400)
        .send(`Failed to GET proposals created by user ${userId}`)
    }

    const proposals = await Proposals.find({ proponent: user._id }).sort({
      createdAt: 'descending'
    })

    return res.json(proposals)
  } catch (err) {
    return res.status(400).send('Failed to GET proposals created by user')
  }
}
