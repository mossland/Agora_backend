const Comments = require('../../models/forumcomments.model')

module.exports.getAgoraTopicCommentsById = async function (req, res) {
  try {
    const fid = req.params.fid
    const topic = await Comments.find({ flaggedForDeletion: false, forumTopic: fid })

    if (topic.flaggedForDeletion === true) {
      return res.status(400).send('Failed to GET agora topic comments by id')
    }

    await Comments.populate(topic, { path: 'author', model: 'Users' })

    return res.json(topic)
  } catch (err) {
    return res.status(400).send('Failed to GET agora topic comments by id')
  }
}
