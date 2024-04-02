const Forums = require('../../models/forums.model')

module.exports.permanentlyDeleteForums = async function (req, res) {
  try {
    const forums = await Forums.deleteMany({ flaggedForDeletion: true })
    return res.json({ forums })
  } catch (err) {
    return res.status(400).send('Failed to delete forums flagged for deletion')
  }
}
