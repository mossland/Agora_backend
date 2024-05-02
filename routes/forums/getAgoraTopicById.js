const Forums = require('../../models/forums.model')

module.exports.getAgoraTopicById = async function (req, res) {
  try {
    const fid = req.params.fid
    const topic = await Forums.findById(fid)

    if (topic.flaggedForDeletion === true) {
      return res.status(400).send('Failed to GET agora topic by id')
    }

    await Forums.populate(topic, { path: 'author', model: 'Users' })

    return res.json(topic)
  } catch (err) {
    return res.status(400).send('Failed to GET agora topic by id')
  }
}
