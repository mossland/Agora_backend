const Forums = require('../../models/forums.model')

module.exports.flagForumsForDeletion = async function (req, res) {
  try {
    const forums = Forums.update({ reported: true }, { $set: { flaggedForDeletion: true } }, { multi: true }, () => {})
    return res.json({ forums })
  } catch (err) {
    return res.status(400).send('Failed to flag reported forums for deletion')
  }
}
