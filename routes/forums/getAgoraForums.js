const Forums = require('../../models/forums.model')

module.exports.getAgoraForums = async function (req, res) {
  try {
    const forums = await Forums.find({ flaggedForDeletion: false }).sort({ createdAt: 'descending' })
    await Forums.populate(forums, { path: 'author', model: 'Users' })
    return res.json(forums)
  } catch (err) {
    return res.status(400).send('Failed to GET forum topics')
  }
}
