const Proposals = require('../../models/proposals.model')
const Forums = require('../../models/forums.model')

module.exports.getAgoraHighlights = async function (req, res) {
  try {
    const proposals = await Proposals.find({ status: ['Approved'] }).sort({
      createdAt: 'descending'
    })
    await Proposals.populate(proposals, { path: 'proponent', model: 'Users' })

    // Sort proposals by likers count in descending order
    const proposalsByLikers = proposals
      .slice()
      .sort((a, b) => b.likers.length - a.likers.length)
      .slice(0, 2)

    // Sort forum topics by likers count in descending order and limit to 3
    const forumTopicsByLikers = await Forums.find()
      .sort({ likers: 'descending' })
      .limit(2)

    // Combine proposals and forum topics into a single list
    const highlights = [...proposalsByLikers, ...forumTopicsByLikers].slice(
      0,
      4
    )

    return res.json(highlights)
  } catch (err) {
    return res.status(400).send('Failed to GET agora highlights')
  }
}
