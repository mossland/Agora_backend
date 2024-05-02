const Forums = require('../../models/forums.model')

module.exports.flagForumsForDeletion = async function (req, res) {
  try {
    const result = await Forums.updateMany(
      { reported: true },
      { $set: { flaggedForDeletion: true } }
    )
    return res.json({ result })
  } catch (err) {
    return res.status(400).send('Failed to flag reported forums for deletion')
  }
}
