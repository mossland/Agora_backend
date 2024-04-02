const Forums = require('../../models/forums.model')

module.exports.getDeletedForums = async function (req, res) {
  try {
    const forums = await Forums.find({ flaggedForDeletion: true }).sort({ createdAt: 'descending' })
    await Forums.populate(forums, { path: 'reporter', model: 'Users' })
    return res.json(forums)
  } catch (err) {
    return res.status(400).send('Failed to GET forum topics flagged for deletion')
  }
}
