const Users = require('../../models/users.model')
const Forums = require('../../models/forums.model')

module.exports.postForumTopic = async function (req, res) {
  try {
    if (req.body.title === undefined || req.body.contents === undefined || req.body.author === undefined || req.body.category === undefined) {
      return res.status(404).send('Missing forum topic data')
    }

    if (req.user.user_id !== req.body.author) {
      return res.status(400).send('Failed to post forum')
    }

    const author = await Users.findOne({ _id: req.body.author })

    if (!author) {
      return res.status(400).send('Failed to post forum topic')
    }

    const now = new Date()
    const newForumTopic = async () => {
      const topic = new Forums({
        title: req.body.title,
        createdAt: now,
        contents: req.body.contents,
        author: req.body.author,
        category: req.body.category,
        likers: [],
        views: 0,
        pinned: false,
        reported: false,
        flaggedForDeletion: false
      })

      topic
        .save()
        .then((topic) => {
          return res.status(201).json({ _id: topic._id })
        })
        .catch((err) => {
          return res.status(400).send(`Failed to post forum topic: ${err}`)
        })
    }

    async function handleNewForumTopic () {
      try {
        newForumTopic()
      } catch (err) {
        console.log('error', `Failed to post forum topic: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleNewForumTopic()
  } catch (e) {
    return res.status(400).send('Failed to post forum topic')
  }
}
